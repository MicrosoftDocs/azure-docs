---
title: Set up your Amazon Web Services (AWS) environment to collect AWS logs to Microsoft Sentinel
description: Set up your Amazon Web Services environment to send AWS logs to Microsoft Sentinel using one of the Microsoft Sentinel AWS connectors.
author: guywi-ms
ms.author: guywild
ms.topic: how-to
ms.date: 05/28/2025


#Customer intent: As an administrator, I want to set up my Amazon Web Services environment to send AWS logs to Microsoft Sentinel using one of the Microsoft Sentinel AWS connectors.

---

# Set up your Amazon Web Services (AWS) environment to collect AWS logs to Microsoft Sentinel

Amazon Web Services (AWS) connectors simplify the process of collecting logs from Amazon S3 (Simple Storage Service) and ingesting them into Microsoft Sentinel. The connectors provide tools to help you configure your AWS environment for Microsoft Sentinel log collection.

This article outlines the AWS environment setup required to send logs to Microsoft Sentinel and links to step-by-step instructions for setting up your environment and collecting AWS logs using each supported connector.

## AWS environment setup overview

This diagram shows how to set up your AWS environment to send logs to Azure:

:::image type="content" source="media/connect-aws/s3-connector-architecture.png" alt-text="Screenshot of A W S S 3 connector architecture.":::

1. **Create an S3 (Simple Storage Service) storage bucket and a Simple Queue Service (SQS) queue** to which the S3 bucket publishes notifications when it receives new logs. 
   
   Microsoft Sentinel connectors:

   - Poll the SQS queue, at frequent intervals, for messages, which contain the paths to new log files.
   - Fetch the files from the S3 bucket based on the path specified in the SQS notifications.

1. **Create an Open ID Connect (OIDC) web identity provider** and add Microsoft Sentinel as a registered application (by adding it as an audience).

   Microsoft Sentinel connectors use Microsoft Entra ID to authenticate with AWS through OpenID Connect (OIDC) and assume an AWS IAM role. 

   > [!IMPORTANT]
   > If you already have an OIDC Connect provider set up for Microsoft Defender for Cloud, add Microsoft Sentinel as an audience to your existing provider (Commercial: `api://1462b192-27f7-4cb9-8523-0f4ecb54b47e`, Government:`api://d4230588-5f84-4281-a9c7-2c15194b28f7`). Don't try to create a new OIDC provider for Microsoft Sentinel.

1. **Create an AWS assumed role** to grant your Microsoft Sentinel connector permissions to access your AWS S3 bucket and SQS resources. 

   1. Assign the appropriate **IAM permissions policies** to grant the assumed role access to the resources.

   1. Configure your connectors to use the assumed role and SQS queue you created to access the S3 bucket and retrieve logs.

1. **Configure AWS services to send logs to the S3 bucket**.

### Manual setup

Although you can set up the AWS environment manually, as described in this section, we strongly recommend using the automated tools provided when you [deploy AWS connectors](#4-deploy-aws-connectors) instead.

#### 1. Create an S3 bucket and SQS queue

1. Create an **S3 bucket** to which you can send the logs from your AWS services - VPC, GuardDuty, CloudTrail, or CloudWatch.

   See the [instructions to create an S3 storage bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html) in the AWS documentation.

1. Create a standard **Simple Queue Service (SQS) message queue** to which the S3 bucket can publish notifications.

   See the [instructions to create a standard Simple Queue Service (SQS) queue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/creating-sqs-standard-queues.html) in the AWS documentation.

1. Configure your S3 bucket to send notification messages to your SQS queue. 

   See the [instructions to publish notifications to your SQS queue](https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-event-notifications.html) in the AWS documentation.

#### 2. Create an Open ID Connect (OIDC) web identity provider

> [!IMPORTANT]
> If you already have an OIDC Connect provider set up for Microsoft Defender for Cloud, add Microsoft Sentinel as an audience to your existing provider (Commercial: `api://1462b192-27f7-4cb9-8523-0f4ecb54b47e`, Government:`api://d4230588-5f84-4281-a9c7-2c15194b28f7`). Don't try to create a new OIDC provider for Microsoft Sentinel.

Follow these instructions in the AWS documentation:<br>[Creating OpenID Connect (OIDC) identity providers](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html). 

| Parameter | Selection/Value | Comments |
| - | - | - |
| **Client ID** | - | Ignore this, you already have it. See **Audience**. |
| **Provider type** | *OpenID Connect* | Instead of default *SAML*.|
| **Provider URL** | Commercial:<br>`sts.windows.net/33e01921-4d64-4f8c-a055-5bdaffd5e33d/`<br><br>Government:<br>`sts.windows.net/cab8a31a-1906-4287-a0d8-4eef66b95f6e/` |  |
| **Thumbprint** | `626d44e704d1ceabe3bf0d53397464ac8080142c` | If created in the IAM console, selecting **Get thumbprint** should give you this result. |
| **Audience** | Commercial:<br>`api://1462b192-27f7-4cb9-8523-0f4ecb54b47e`<br><br>Government:<br>`api://d4230588-5f84-4281-a9c7-2c15194b28f7` |  |

### 3. Create an AWS assumed role

1. Follow these instructions in the AWS documentation:<br>[Creating a role for web identity or OpenID Connect Federation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html#idp_oidc_Create). 
   
   | Parameter | Selection/Value | Comments |
   | - | - | - |
   | **Trusted entity type** | *Web identity* | Instead of default *AWS service*. |
   | **Identity provider** | Commercial:<br>`sts.windows.net/33e01921-4d64-4f8c-a055-5bdaffd5e33d/`<br><br>Government:<br>`sts.windows.net/cab8a31a-1906-4287-a0d8-4eef66b95f6e/` | The provider you created in the previous step. |
   | **Audience** | Commercial:<br>`api://1462b192-27f7-4cb9-8523-0f4ecb54b47e`<br><br>Government:<br>`api://d4230588-5f84-4281-a9c7-2c15194b28f7` | The audience you defined for the identity provider in the previous step. |
   | **Permissions to assign** | <ul><li>`AmazonSQSReadOnlyAccess`<li>`AWSLambdaSQSQueueExecutionRole`<li>`AmazonS3ReadOnlyAccess`<li>`ROSAKMSProviderPolicy`<li>Other policies for ingesting the different types of AWS service logs | For information on these policies, see the relevant AWS S3 connector permissions policies page, in the Microsoft Sentinel GitHub repository.<ul><li>[AWS Commercial S3 connector permissions policies page](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/AWS-S3/AwsRequiredPolicies.md)<li>[AWS Government S3 connector permissions policies page](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/AWS-S3/AwsRequiredPoliciesForGov.md)|
   | **Name** | "OIDC_*MicrosoftSentinelRole*"| Choose a meaningful name that includes a reference to Microsoft Sentinel.<br><br>The name must include the exact prefix `OIDC_`; otherwise, the connector can't function properly. |
   
1. Edit the new role's trust policy and add another condition:<br>`"sts:RoleSessionName": "MicrosoftSentinel_{WORKSPACE_ID)"`

   > [!IMPORTANT]
   > The value of the `sts:RoleSessionName` parameter must have the exact prefix `MicrosoftSentinel_`; otherwise the connector doesn't function properly.

   The finished trust policy should look like this:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Federated": "arn:aws:iam::XXXXXXXXXXXX:oidc-provider/sts.windows.net/cab8a31a-1906-4287-a0d8-4eef66b95f6e/"
         },
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Condition": {
           "StringEquals": {
             "sts.windows.net/cab8a31a-1906-4287-a0d8-4eef66b95f6e/:aud": "api://d4230588-5f84-4281-a9c7-2c15194b28f7",
             "sts:RoleSessionName": "MicrosoftSentinel_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
           }
         }
       }
     ]
   }
   ```
 
   - `XXXXXXXXXXXX` is your AWS Account ID.
   - `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX` is your Microsoft Sentinel workspace ID.

   Update (save) the policy when you're done editing.

#### Configure AWS services to export logs to an S3 bucket

See the linked Amazon Web Services documentation for instructions for sending each type of log to your S3 bucket:

- [Publish a VPC flow log to an S3 bucket](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-s3.html).

    > [!NOTE]
    > If you choose to customize the log's format, you must include the *start* attribute, as it maps to the *TimeGenerated* field in the Log Analytics workspace. Otherwise, the *TimeGenerated* field is populated with the event's *ingested time*, which doesn't accurately describe the log event.

- [Export your GuardDuty findings to an S3 bucket](https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_exportfindings.html).

    > [!NOTE]
    >
    > - In AWS, findings are exported by default every 6 hours. Adjust the export frequency for updated Active findings based on your environment requirements. To expedite the process, you can modify the default setting to export findings every 15 minutes. See [Setting the frequency for exporting updated active findings](https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_exportfindings.html#guardduty_exportfindings-frequency).
    >
    > - The *TimeGenerated* field is populated with the finding's *Update at* value.

- AWS CloudTrail trails are stored in S3 buckets by default.
    - [Create a trail for a single account](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-create-a-trail-using-the-console-first-time.html).
    - [Create a trail spanning multiple accounts across an organization](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html).

- [Export your CloudWatch log data to an S3 bucket](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/S3Export.html).

## 4. Deploy AWS connectors

Microsoft Sentinel provides these AWS connectors:

- [Amazon Web Services Web Application Firewall (WAF) connector](connect-aws-s3-waf.md): Ingests AWS WAF logs, collected in AWS S3 buckets, to Microsoft Sentinel.
- [Amazon Web Services service log connector](connect-aws.md): Ingests AWS service logs, collected in AWS S3 buckets, to Microsoft Sentinel.
 
---

## Next steps

To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
