import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as random from "@pulumi/random";
import * as config from "./config";

const awsConfig = new pulumi.Config("aws");
//IAM is a globally accessible resources
const providerOpts = {provider: new aws.Provider("prov", {region: "us-east-1"})};
const randomString = new random.RandomString("externalId", {
    length: 12,
    special: false,
});

const resourcesSuffix = new random.RandomString("suffix", {
    length: 5,
    special: false,
});

const fireflyReadonlyDenylist = resourcesSuffix.result.apply(result => new aws.iam.Policy(`fireflyReadonlyPolicy-${result}`, {
        path: "/",
        description: "Deny List for readonly permission for the cloud configuration",
        policy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Action: [
                        "acm-pca:DescribeCertificateAuthorityAuditReport",
                        "athena:BatchGetQueryExecution",
                        "athena:GetQueryExecution",
                        "athena:GetQueryResults",
                        "athena:GetQueryResultsStream",
                        "athena:ListQueryExecutions",
                        "auditmanager:*",
                        "aws-portal:*",
                        "braket:Search*",
                        "cassandra:*",
                        "chime:GetApp*",
                        "chime:ListChannel*",
                        "chime:ListChannels*",
                        "chime:DescribeChannel*",
                        "chime:ListApp*",
                        "chime:DescribeApp*",
                        "chime:GetUser*",
                        "chime:ListMeeting*",
                        "chime:ListMeetings*",
                        "chime:GetMeeting",
                        "chime:GetChannel*",
                        "chime:ListGroups",
                        "chime:GetPhoneNumber",
                        "chime:GetSipMedia*",
                        "chime:GetAccount*",
                        "chime:ListDirectories",
                        "chime:ListDomains",
                        "chime:GetMessagingSessionEndpoint",
                        "chime:ListUsers",
                        "chime:GetProxySession",
                        "chime:GetGlobalSettings",
                        "chime:GetEventsConfiguration",
                        "chime:ListAccountUsageReportData",
                        "chime:ListProxySessions",
                        "chime:ListAccounts",
                        "chime:ListCDRBucket",
                        "chime:ListCallingRegions",
                        "chime:ListSipRules",
                        "chime:ListAttendeeTags",
                        "chime:ListSupportedPhoneNumberCountries",
                        "chime:GetCDRBucket",
                        "chime:GetAttendee",
                        "chime:ListPhoneNumbers",
                        "chime:RetrieveDataExports",
                        "chime:ListAttendees",
                        "chime:ListApiKeys",
                        "chime:GetMediaCapturePipeline",
                        "chime:SearchAvailablePhoneNumbers",
                        "chime:GetTelephonyLimits",
                        "chime:ListBots",
                        "chime:GetRoom",
                        "chime:ListMediaCapturePipelines",
                        "chime:ListPhoneNumberOrders",
                        "chime:GetSipRule",
                        "chime:GetPhoneNumberOrder",
                        "chime:GetBot",
                        "chime:ValidateAccountResource",
                        "chime:ListRooms",
                        "chime:GetDomain",
                        "chime:ListDelegates",
                        "chime:GetRetentionSettings",
                        "chime:ListSipMediaApplications",
                        "chime:GetPhoneNumberSettings",
                        "chime:ListRoomMemberships",
                        "codestar:Verify*",
                        "cognito-sync:QueryRecords",
                        "config:Deliver*",
                        "datapipeline:EvaluateExpression",
                        "datapipeline:QueryObjects",
                        "datapipeline:Validate*",
                        "dax:BatchGetItem",
                        "dax:GetItem",
                        "dax:Query",
                        "dax:Scan",
                        "detective:SearchGraph",
                        "dms:Test*",
                        "ds:Check*",
                        "ds:Verify*",
                        "ds:DescribeCertificate",
                        "ds:ListCertificates",
                        "elastictranscoder:ListJobsByPipeline",
                        "elastictranscoder:ListJobsByStatus",
                        "kinesisvideo:GetClip",
                        "kinesisvideo:GetDASHStreamingSessionURL",
                        "kinesisvideo:GetHLSStreamingSessionURL",
                        "lakeformation:GetTableObjects",
                        "lakeformation:GetWorkUnitResults",
                        "lakeformation:GetWorkUnits",
                        "license-manager:GetAccessToken",
                        "license-manager:GetGrant",
                        "license-manager:ListTokens",
                        "lightsail:GetContainerAPIMetadata",
                        "lightsail:GetContainerImages",
                        "lightsail:GetContainerLog",
                        "lightsail:GetDiskSnapshot",
                        "lightsail:GetDiskSnapshots",
                        "lightsail:GetDistributionLatestCacheReset",
                        "lightsail:GetDistributionMetricData",
                        "lightsail:GetExportSnapshotRecords",
                        "lightsail:GetInstanceAccessDetails",
                        "lightsail:GetLoadBalancerMetricData",
                        "lightsail:GetRelationalDatabaseEvents",
                        "lightsail:GetRelationalDatabaseLogEvents",
                        "lightsail:GetRelationalDatabaseMetricData",
                        "lightsail:GetRelationalDatabaseSnapshot",
                        "lightsail:GetRelationalDatabaseSnapshots",
                        "logs:DescribeExportTasks",
                        "logs:DescribeQueries",
                        "logs:GetLogEvents",
                        "logs:GetLogRecord",
                        "logs:GetQueryResults",
                        "macie2:GetFindings",
                        "macie2:GetMacieSession",
                        "macie2:GetUsageStatistics",
                        "macie2:GetUsageTotals",
                        "macie2:ListFindings",
                        "polly:SynthesizeSpeech",
                        "rekognition:CompareFaces",
                        "wafv2:CheckCapacity",
                        "workdocs:CheckAlias",
                        "workmail:Search*",
                        "cognito-identity:GetCredentialsForIdentity",
                        "cognito-identity:GetIdentityPoolRoles",
                        "cognito-identity:GetOpenId*",
                        "cognito-idp:GetSigningCertificate",
                        "connect:GetFederationToken",
                        "secretsmanager:GetRandomPassword",
                        "secretsmanager:GetSecretValue"
                    ],
                    Effect: "Deny",
                    Resource: "*",
                }
            ],
        }),
    }, providerOpts)
)

const s3SpecificWritePermission = resourcesSuffix.result.apply(result => new aws.iam.Policy(`S3SpecificWritePermission-${result}`, {
        path: "/",
        description: "Deny List for readonly permission for the cloud configuration",
        policy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "kms:Decrypt",
                    Effect: "Allow",
                    Resource: "arn:aws:kms:*:*:key/*"
                },
                {
                    Action: "s3:GetObject",
                    Effect: "Deny",
                    NotResource: [
                        "arn:aws:s3:::*/*.tfstate",
                        "arn:aws:s3:::elasticbeanstalk-*/*",
                        "arn:aws:s3:::aws-emr-resources-*/*"
                    ]
                },
            ],
        })
    }, providerOpts)
);

const fireflyCrossAccountAccessRole = resourcesSuffix.result.apply(random => {

    const statement = {
        Action: "sts:AssumeRole",
        Principal: {
            AWS: `arn:aws:iam::${config.ORGANIZATION_ID}:root`,
        },
        Effect: "Allow"
    };
    if (awsConfig.getBoolean("supportExternalId")) {
        statement["Condition"] = randomString.result.apply(result => JSON.stringify({
            StringEquals: {
                "sts:ExternalId": result,
            },
        }))
    }
    return new aws.iam.Role(`fireflyCrossAccountAccessRole`, {
        assumeRolePolicy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [statement],
        }),
        managedPolicyArns: [
            "arn:aws:iam::aws:policy/SecurityAudit",
            "arn:aws:iam::aws:policy/ReadOnlyAccess",
            fireflyReadonlyDenylist.arn,
            s3SpecificWritePermission.arn
        ],
    }, providerOpts);
})

export const roleArn = fireflyCrossAccountAccessRole.arn
export const externalId = randomString.result