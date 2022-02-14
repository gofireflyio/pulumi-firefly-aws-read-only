import * as pulumi from "@pulumi/pulumi";
import * as _ from "lodash";
import * as iam from "./iam";
import * as firefly from "./firefly";

const config = new pulumi.Config("firefly");

const fireflyEndpoint = config.get("endpoint") || "";
pulumi.log.debug(`got firefly:endpoint from config. value=${fireflyEndpoint}`);

const fireflyAccessKey = config.get("accessKey") || "";
const fireflySecretKey = config.get("secretKey") || "";
pulumi.log.debug(`got firefly:accessKey from config. value=${fireflyAccessKey}`);

const fireflyIntegrationName = config.get("integrationName") || "";
pulumi.log.debug(`got firefly:integrationName from config. value=${fireflyIntegrationName}`)

const fireflyIntegrationFullScanEnabled = config.getBoolean("integrationFullScanEnabled") || true;
pulumi.log.debug(`got firefly:integrationFullScanEnabled from config. value=${fireflyIntegrationFullScanEnabled}`);

const fireflyIntegrationIsProd = config.getBoolean("integrationIsProd") || false;
pulumi.log.debug(`got firefly:integrationIsProd from config. value=${fireflyIntegrationIsProd}`);

pulumi.log.debug(`authenticating firefly...`)
firefly.authenticate(fireflyEndpoint, fireflyAccessKey, fireflySecretKey).then(res => {
    const authToken = res?.data?.access_token;
    if (_.isEmpty(authToken)) {
        pulumi.log.warn("Firefly's token is invalid");
        return
    }

    pulumi.log.info(`authenticated successfully!`);
    iam.roleArn.apply(roleArn => {
        iam.externalId.apply(externalId => {
            pulumi.log.info(`created IAM Role successfully. arn=${roleArn}, externalID=${externalId}`);

            firefly.createIntegration(
                fireflyEndpoint,
                authToken,
                fireflyIntegrationName,
                roleArn,
                externalId,
                fireflyIntegrationFullScanEnabled,
                fireflyIntegrationIsProd).then(res => {
                pulumi.log.info(`integration has created successfully. res=${JSON.stringify(res.data)}`);
            }).catch(err => {
                pulumi.log.error(`Could not create integration. err=${err}`);
            })
        })
    })
}).catch(err => {
    pulumi.log.error(`Could not authenticate to firefly. err=${err}`);
});