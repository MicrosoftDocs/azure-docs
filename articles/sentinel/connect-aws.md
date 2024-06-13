---
title: Connect Microsoft Sentinel to Amazon Web Services to ingest AWS service log data
description: Use the AWS connector to delegate Microsoft Sentinel access to AWS resource logs, creating a trust relationship between Amazon Web Services and Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 01/31/2024
---

# Connect Microsoft Sentinel to Amazon Web Services to ingest AWS service log data

Use the Amazon Web Services (AWS) connectors to pull AWS service logs into Microsoft Sentinel. These connectors work by granting Microsoft Sentinel access to your AWS resource logs. Setting up the connector establishes a trust relationship between Amazon Web Services and Microsoft Sentinel. This is accomplished on AWS by creating a role that gives permission to Microsoft Sentinel to access your AWS logs.

This connector is available in two versions: the legacy connector for CloudTrail management and data logs, and the new version that can ingest logs from the following AWS services by pulling them from an S3 bucket (links are to AWS documentation):

- [Amazon Virtual Private Cloud (VPC)](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) - [VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html)
- [Amazon GuardDuty](https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html) - [Findings](https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_findings.html)
- [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) - [Management](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-management-events-with-cloudtrail.html) and [data](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html) events
- [AWS CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) - [CloudWatch logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)

# [S3 connector (new)](#tab/s3)

This tab explains how to configure the AWS S3 connector. The process of setting it up has two parts: the AWS side and the Microsoft Sentinel side. Each side's process produces information used by the other side. This two-way authentication creates secure communication.

## Prerequisites

- Make sure that the logs from your selected AWS service use the format accepted by Microsoft Sentinel:

    - **Amazon VPC**: .csv file in GZIP format with headers; delimiter: space.
    - **Amazon GuardDuty**: json-line and GZIP formats.
    - **AWS CloudTrail**: .json file in a GZIP format.
    - **CloudWatch**: .csv file in a GZIP format without a header. If you need to convert your logs to this format, you can use this [CloudWatch lambda function](cloudwatch-lambda-function.yml).

- You must have write permission on the Microsoft Sentinel workspace.
- Install the Amazon Web Services solution from the **Content Hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

## Architecture overview

This graphic and the following text show how the parts of this connector solution interact.

:::image type="content" source="media/connect-aws/s3-connector-architecture.png" alt-text="Screenshot of A W S S 3 connector architecture.":::

- AWS services are configured to send their logs to S3 (Simple Storage Service) storage buckets.

- The S3 bucket sends notification messages to the SQS (Simple Queue Service) message queue whenever it receives new logs.

- The Microsoft Sentinel AWS S3 connector polls the SQS queue at regular, frequent intervals. If there is a message in the queue, it will contain the path to the log files.

- The connector reads the message with the path, then fetches the files from the S3 bucket.

- To connect to the SQS queue and the S3 bucket, Microsoft Sentinel uses a federated web identity provider (Microsoft Entra ID) for authenticating with AWS through OpenID Connect (OIDC), and assuming an AWS IAM role. The role is configured with a permissions policy giving it access to those resources.

## Connect the S3 connector

- **In your AWS environment:**

    - Configure your AWS service(s) to send logs to an **S3 bucket**.

    - Create a **Simple Queue Service (SQS) queue** to provide notification.

    - Create a **web identity provider** to authenticate users to AWS through OpenID Connect (OIDC).

    - Create an **assumed role** to grant permissions to users authenticated by the OIDC web identity provider to access your AWS resources.

    - Attach the appropriate **IAM permissions policies** to grant the assumed role access to the appropriate resources (S3 bucket, SQS).

    We have made available, in our GitHub repository, a script that **automates the AWS side of this process**. See the instructions for [automatic setup](#automatic-setup) later in this document.

- **In Microsoft Sentinel:**

    - Enable and configure the **AWS S3 Connector** in the Microsoft Sentinel portal. [See the instructions below](#add-the-aws-role-and-queue-information-to-the-s3-data-connector).

## Automatic setup

To simplify the onboarding process, Microsoft Sentinel has provided a [PowerShell script to automate the setup](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/AWS-S3) of the AWS side of the connector - the required AWS resources, credentials, and permissions.

The script takes the following actions:

- Creates an OIDC web identity provider, to authenticate Microsoft Entra ID users to AWS.

- Creates an *IAM assumed role* with the minimal necessary permissions, to grant OIDC-authenticated users access to your logs in a given S3 bucket and SQS queue.

- Enables specified AWS services to send logs to that S3 bucket, and notification messages to that SQS queue.

- If necessary, creates that S3 bucket and that SQS queue for this purpose.

- Configures any necessary IAM permissions policies and applies them to the IAM role created above.

For Azure Government clouds, a specialized script creates a different OIDC web identity provider, to which it assigns the IAM assumed role.

### Prerequisites for automatic setup

- You must have PowerShell and the AWS CLI on your machine.
  - [Installation instructions for PowerShell](/powershell/scripting/install/installing-powershell)
  - [Installation instructions for the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) (from AWS documentation)

### Instructions

To run the script to set up the connector, use the following steps:

1. From the Microsoft Sentinel navigation menu, select **Data connectors**.

1. Select **Amazon Web Services S3** from the data connectors gallery.

   If you don't see the connector, install the Amazon Web Services solution from the **Content Hub** in Microsoft Sentinel.

1. In the details pane for the connector, select **Open connector page**.

1. In the **Configuration** section, under **1. Set up your AWS environment**, expand **Setup with PowerShell script (recommended)**.

1. Follow the on-screen instructions to download and extract the [AWS S3 Setup Script](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/AWS-S3/ConfigAwsS3DataConnectorScripts.zip?raw=true) (link downloads a zip file containing the main setup script and helper scripts) from the connector page.

   > [!NOTE]
   > For ingesting AWS logs into an **Azure Government cloud**, download and extract [this specialized AWS S3 Gov Setup Script](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/AWS-S3/ConfigAwsS3DataConnectorScriptsGov.zip?raw=true) instead.

1. Before running the script, run the `aws configure` command from your PowerShell command line, and enter the relevant information as prompted. See [AWS Command Line Interface | Configuration basics](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) (from AWS documentation) for details.

1. Now run the script. Copy the command from the connector page (under "Run script to set up the environment") and paste it in your command line.

1. The script will prompt you to enter your Workspace ID. This ID appears on the connector page. Copy it and paste it at the prompt of the script.

   :::image type="content" source="media/connect-aws/aws-run-script.png" alt-text="Screenshot of command to run setup script and workspace ID." lightbox="media/connect-aws/aws-run-script.png":::

1. When the script finishes running, copy the **Role ARN** and the **SQS URL** from the script's output (see example in first screenshot below) and paste them in their respective fields in the connector page under **2. Add connection** (see second screenshot below).

   :::image type="content" source="media/connect-aws/aws-script-output.png" alt-text="Screenshot of output of A W S connector setup script." lightbox="media/connect-aws/aws-script-output.png":::

   :::image type="content" source="media/connect-aws/aws-add-connection.png" alt-text="Screenshot of pasting the A W S role information from the script, to the S3 connector." lightbox="media/connect-aws/aws-add-connection.png":::

1. Select a data type from the **Destination table** drop-down list. This tells the connector which AWS service's logs this connection is being established to collect, and into which Log Analytics table it will store the ingested data. Then select **Add connection**.

> [!NOTE]
> The script may take up to 30 minutes to finish running.

## Manual setup

Microsoft recommends using the automatic setup script to deploy this connector. If for whatever reason you do not want to take advantage of this convenience, follow the steps below to set up the connector manually.

- [Prepare your AWS resources](#prepare-your-aws-resources)
- [Create an AWS assumed role and grant access to the AWS Sentinel account](#create-an-aws-assumed-role-and-grant-access-to-the-aws-sentinel-account)
- [Add the AWS role and queue information to the S3 data connector](#add-the-aws-role-and-queue-information-to-the-s3-data-connector)
- [Configure an AWS service to export logs to an S3 bucket](#configure-an-aws-service-to-export-logs-to-an-s3-bucket)

### Prepare your AWS resources

1. Create an **S3 bucket** to which you will ship the logs from your AWS services - VPC, GuardDuty, CloudTrail, or CloudWatch.

   - See the [instructions to create an S3 storage bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html) in the AWS documentation.

1. Create a standard **Simple Queue Service (SQS) message queue** to which the S3 bucket will publish notifications.

   - See the [instructions to create a standard Simple Queue Service (SQS) queue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/creating-sqs-standard-queues.html) in the AWS documentation.

1. Configure your S3 bucket to send notification messages to your SQS queue. 

   - See the [instructions to publish notifications to your SQS queue](https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-event-notifications.html) in the AWS documentation.

### Install AWS data connector and prepare environment

1. In Microsoft Sentinel, select **Data connectors** from the navigation menu.

1. Select **Amazon Web Services S3** from the data connectors gallery.

   If you don't see the connector, install the Amazon Web Services solution from the **Content Hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

1. In the details pane for the connector, select **Open connector page**.

1. Under **Configuration**, expand **Setup with PowerShell script (recommended)**, then copy the **External ID (Workspace ID)** to your clipboard.

### Create an Open ID Connect (OIDC) web identity provider and an AWS assumed role

1. In a different browser window or tab, open the AWS console.

1. Create a **web identity provider**. Follow these instructions in the AWS documentation:<br>[Creating OpenID Connect (OIDC) identity providers](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html). 

   | Parameter | Selection/Value | Comments |
   | - | - | - |
   | **Client ID** | - | Ignore this, you already have it. See **Audience** line below. |
   | **Provider type** | *OpenID Connect* | Instead of default *SAML*.|
   | **Provider URL** | Commercial:<br>`sts.windows.net/33e01921-4d64-4f8c-a055-5bdaffd5e33d/`<br><br>Government:<br>`sts.windows.net/cab8a31a-1906-4287-a0d8-4eef66b95f6e/` |  |
   | **Thumbprint** | `626d44e704d1ceabe3bf0d53397464ac8080142c` | If created in the IAM console, selecting **Get thumbprint** should give you this result. |
   | **Audience** | Commercial:<br>`api://1462b192-27f7-4cb9-8523-0f4ecb54b47e`<br><br>Government:<br>`api://d4230588-5f84-4281-a9c7-2c15194b28f7` |  |
   
1. Create an **IAM assumed role**. Follow these instructions in the AWS documentation:<br>[Creating a role for web identity or OpenID Connect Federation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html#idp_oidc_Create). 
   
   | Parameter | Selection/Value | Comments |
   | - | - | - |
   | **Trusted entity type** | *Web identity* | Instead of default *AWS service*. |
   | **Identity provider** | Commercial:<br>`sts.windows.net/33e01921-4d64-4f8c-a055-5bdaffd5e33d/`<br><br>Government:<br>`sts.windows.net/cab8a31a-1906-4287-a0d8-4eef66b95f6e/` | The provider you created in the previous step. |
   | **Audience** | Commercial:<br>`api://1462b192-27f7-4cb9-8523-0f4ecb54b47e`<br><br>Government:<br>`api://d4230588-5f84-4281-a9c7-2c15194b28f7` | The audience you defined for the identity provider in the previous step. |
   | **Permissions to assign** | <ul><li>`AmazonSQSReadOnlyAccess`<li>`AWSLambdaSQSQueueExecutionRole`<li>`AmazonS3ReadOnlyAccess`<li>`ROSAKMSProviderPolicy`<li>Additional policies for ingesting the different types of AWS service logs | For information on these policies, see the relevant AWS S3 connector permissions policies page, in the Microsoft Sentinel GitHub repository.<ul><li>[AWS Commercial S3 connector permissions policies page](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/AWS-S3/AwsRequiredPolicies.md)<li>[AWS Government S3 connector permissions policies page](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/AWS-S3/AwsRequiredPoliciesForGov.md)|
   | **Name** | "OIDC_*MicrosoftSentinelRole*"| Choose a meaningful name that includes a reference to Microsoft Sentinel.<br><br>The name must include the exact prefix `OIDC_`, otherwise the connector will not function properly. |
   
1. Edit the new role's trust policy and add another condition:<br>`"sts:RoleSessionName": "MicrosoftSentinel_{WORKSPACE_ID)"`

   > [!IMPORTANT]
   > The value of the `sts:RoleSessionName` parameter must have the exact prefix `MicrosoftSentinel_`, otherwise the connector will not function properly.

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

### Add the AWS role and queue information to the S3 data connector

1. In the browser tab open to the AWS console, enter the **Identity and Access Management (IAM)** service and navigate to the list of **Roles**. Select the role you created above.

1. Copy the **ARN** to your clipboard.

1. Enter the **Simple Queue Service**, select the SQS queue you created, and copy the **URL** of the queue to your clipboard.

1. Return to your Microsoft Sentinel browser tab, which should be open to the **Amazon Web Services S3 (Preview)** data connector page. Under **2. Add connection**:
    1. Paste the IAM role ARN you copied two steps ago into the **Role to add** field.
    1. Paste the URL of the SQS queue you copied in the last step into the **SQS URL** field.
    1. Select a data type from the **Destination table** drop-down list. This tells the connector which AWS service's logs this connection is being established to collect, and into which Log Analytics table it will store the ingested data.
    1. Select **Add connection**.

   :::image type="content" source="media/connect-aws/aws-add-connection.png" alt-text="Screenshot of adding an A W S role connection to the S3 connector." lightbox="media/connect-aws/aws-add-connection.png":::

### Configure an AWS service to export logs to an S3 bucket

See Amazon Web Services documentation (linked below) for the instructions for sending each type of log to your S3 bucket:

- [Publish a VPC flow log to an S3 bucket](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-s3.html).

    > [!NOTE]
    > If you choose to customize the log's format, you must include the *start* attribute, as it maps to the *TimeGenerated* field in the Log Analytics workspace. Otherwise, the *TimeGenerated* field will be populated with the event's *ingested time*, which doesn't accurately describe the log event.

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

## Known issues and troubleshooting

### Known issues

- Different types of logs can be stored in the same S3 bucket, but should not be stored in the same path.

- Each SQS queue should point to one type of message, so if you want to ingest GuardDuty findings *and* VPC flow logs, you should set up separate queues for each type.

- Similarly, a single SQS queue can serve only one path in an S3 bucket, so if for any reason you are storing logs in multiple paths, each path requires its own dedicated SQS queue.

### Troubleshooting

Learn how to [troubleshoot Amazon Web Services S3 connector issues](aws-s3-troubleshoot.md).

# [CloudTrail connector (legacy)](#tab/ct)

This tab explains how to configure the AWS CloudTrail connector. The process of setting it up has two parts: the AWS side and the Microsoft Sentinel side. Each side's process produces information used by the other side. This two-way authentication creates secure communication.

> [!NOTE]
> AWS CloudTrail has [built-in limitations](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/WhatIsCloudTrail-Limits.html) in its LookupEvents API. It allows no more than two transactions per second (TPS) per account, and each query can return a maximum of 50 records. Consequently, if a single tenant constantly generates more than 100 records per second in one region, backlogs and delays in data ingestion will result.
>
> Currently, you can only connect your AWS Commercial CloudTrail to Microsoft Sentinel and not AWS GovCloud CloudTrail.

## Prerequisites

- You must have write permission on the Microsoft Sentinel workspace.
- Install the Amazon Web Services solution from the **Content Hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

> [!NOTE]
> Microsoft Sentinel collects CloudTrail management events from all regions. It is recommended that you do not stream events from one region to another.

## Connect AWS CloudTrail

Setting up this connector has two steps:
- [Create an AWS assumed role and grant access to the AWS Sentinel account](#create-an-aws-assumed-role-and-grant-access-to-the-aws-sentinel-account)
- [Add the AWS role information to the AWS CloudTrail data connector](#add-the-aws-role-information-to-the-aws-cloudtrail-data-connector)

#### Create an AWS assumed role and grant access to the AWS Sentinel account

1. In Microsoft Sentinel, select **Data connectors** from the navigation menu.

1. Select **Amazon Web Services** from the data connectors gallery.

   If you don't see the connector, install the Amazon Web Services solution from the **Content Hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

1. In the details pane for the connector, select **Open connector page**.

1. Under **Configuration**, copy the **Microsoft account ID** and the **External ID (Workspace ID)** to your clipboard.
 
1. In a different browser window or tab, open the AWS console. Follow the [instructions in the AWS documentation for creating a role for an AWS account](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html).

    - For the account type, instead of **This account**, choose **Another AWS account**.

    - In the **Account ID** field, enter the number **197857026523** (or paste it&mdash;the Microsoft account ID you copied in the previous step&mdash;from your clipboard). This number is **Microsoft Sentinel's service account ID for AWS**. It tells AWS that the account using this role is a Microsoft Sentinel user.

    - In the options, select **Require external ID** (*do not* select *Require MFA*). In the **External ID** field, paste your Microsoft Sentinel **Workspace ID** that you copied in the previous step. This identifies *your specific Microsoft Sentinel account* to AWS.

    - Assign the `AWSCloudTrailReadOnlyAccess` permissions policy. Add a tag if you want.

    - Name the role with a meaningful name that includes a reference to Microsoft Sentinel. Example: "*MicrosoftSentinelRole*".

#### Add the AWS role information to the AWS CloudTrail data connector

1. In the browser tab open to the AWS console, enter the **Identity and Access Management (IAM)** service and navigate to the list of **Roles**. Select the role you created above.

1. Copy the **ARN** to your clipboard.

1. Return to your Microsoft Sentinel browser tab, which should be open to the **Amazon Web Services** data connector page. In the **Configuration** section, paste the **Role ARN** into the **Role to add** field and select **Add**.

    :::image type="content" source="media/connect-aws/aws-add-connection-ct.png" alt-text="Screenshot of adding an A W S role connection to the AWS connector." lightbox="media/connect-aws/aws-add-connection-ct.png":::

1. To use the relevant schema in Log Analytics for AWS events, search for **AWSCloudTrail**.

   > [!IMPORTANT]
   > As of December 1, 2020, the **AwsRequestId** field has been replaced by the **AwsRequestId_** field (note the added underscore). The data in the old **AwsRequestId** field will be preserved through the end of the customer's specified data retention period.

---

## Next steps

In this document, you learned how to connect to AWS resources to ingest their logs into Microsoft Sentinel. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.

