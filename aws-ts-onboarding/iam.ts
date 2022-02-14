import * as aws from "@pulumi/aws";
import * as random from "@pulumi/random";
import * as config from "./config";

const randomString = new random.RandomString("externalId", {
    length: 12,
    special: false,
});

const fireflyReadonlyPolicy = new aws.iam.Policy("fireflyReadonlyPolicy", {
    path: "/",
    description: "Read only permission for the cloud configuration",
    policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Action: [
                    "apigateway:GET",
                    "cloudwatch:ListDashboards",
                    "cloudwatch:GetDashboard",
                    "codebuild:BatchGetProjects",
                    "ec2:SearchTransitGatewayRoutes",
                    "eks:ListNodegroups",
                    "eks:ListFargateProfiles",
                    "eks:ListTagsForResource",
                    "eks:DescribeNodegroup",
                    "eks:DescribeFargateProfile",
                    "states:DescribeStateMachine",
                    "states:ListStateMachines",
                    "states:ListTagsForResource",
                    "sns:ListSubscriptionsByTopic",
                    "sns:ListTopics",
                    "sns:ListSubscriptions",
                    "ses:GetIdentityMailFromDomainAttributes",
                    "ses:GetIdentityVerificationAttributes",
                    "sns:GetSubscriptionAttributes",
                    "ses:GetIdentityDkimAttributes",
                    "ses:ListIdentities",
                    "elasticfilesystem:DescribeLifecycleConfiguration",
                    "ecr-public:ListTagsForResource",
                    "ecr:DescribeRepositories",
                    "appconfig:ListApplications",
                    "appconfig:ListTagsForResource",
                    "eks:ListIdentityProviderConfigs",
                    "eks:DescribeIdentityProviderConfig",
                    "eks:ListAddons",
                    "eks:DescribeAddon",
                    "elasticfilesystem:DescribeAccessPoints",
                    "elasticfilesystem:ListTagsForResource",
                    "s3:ListBucket",
                ],
                Effect: "Allow",
                Resource: "*",
            },
            {
                Action: ["s3:GetObject"],
                Effect: "Allow",
                Resource: "arn:aws:s3:::*/*.tfstate",
            },
        ],
    }),
});
const fireflyCrossAccountAccessRole = new aws.iam.Role("fireflyCrossAccountAccessRole", {
    assumeRolePolicy: randomString.result.apply(result => JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: "sts:AssumeRole",
            Principal: {
                AWS: `arn:aws:iam::${config.ORGANIZATION_ID}:root`,
            },
            Effect: "Allow",
            Condition: {
                StringEquals: {
                    "sts:ExternalId": result,
                },
            },
        }],
    })),
    managedPolicyArns: [
        "arn:aws:iam::aws:policy/SecurityAudit",
        "arn:aws:iam::aws:policy/AWSCloudFormationReadOnlyAccess",
        fireflyReadonlyPolicy.arn,
    ],
});

export const roleArn = fireflyCrossAccountAccessRole.arn
export const externalId = randomString.result