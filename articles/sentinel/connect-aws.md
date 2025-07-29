---
title: Connect Microsoft Sentinel to Amazon Web Services to ingest AWS service log data
description: Use the AWS connector to delegate Microsoft Sentinel access to AWS resource logs, creating a trust relationship between Amazon Web Services and Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 01/31/2024


#Customer intent: As a security engineer, I want to connect AWS service logs to Microsoft Sentinel so that analysts can centralize log management and enhance threat detection capabilities.

---

# Connect Microsoft Sentinel to Amazon Web Services to ingest AWS service log data

The Amazon Web Services (AWS) service log connector is available in two versions: the legacy connector for CloudTrail management and data logs, and the new version that can ingest logs from the following AWS services by pulling them from an S3 bucket (links are to AWS documentation):

- [Amazon Virtual Private Cloud (VPC)](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) - [VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html)
- [Amazon GuardDuty](https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html) - [Findings](https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_findings.html)
- [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) - [Management](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-management-events-with-cloudtrail.html) and [data](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html) events
- [AWS CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) - [CloudWatch logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html)


# [S3 connector (new)](#tab/s3)

This tab explains how to configure the AWS S3 connector using one of two methods: 

- [Automatic setup](#automatic-setup) (Recommended) 
- [Manual setup](#manual-setup)

## Prerequisites

- You must have write permission on the Microsoft Sentinel workspace.
- Install the Amazon Web Services solution from the **Content Hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).
- Install PowerShell and the AWS CLI on your machine (for automatic setup only):
  - [Installation instructions for PowerShell](/powershell/scripting/install/installing-powershell)
  - [Installation instructions for the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) (from AWS documentation)
- Make sure that the logs from your selected AWS service use the format accepted by Microsoft Sentinel:

    - **Amazon VPC**: .csv file in GZIP format with headers; delimiter: space.
    - **Amazon GuardDuty**: json-line and GZIP formats.
    - **AWS CloudTrail**: .json file in a GZIP format.
    - **CloudWatch**: .csv file in a GZIP format without a header. If you need to convert your logs to this format, you can use this [CloudWatch lambda function](#send-formatted-cloudwatch-events-to-s3-using-a-lambda-function-optional).


## Automatic setup

To simplify the onboarding process, Microsoft Sentinel has provided a [PowerShell script to automate the setup](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/AWS-S3) of the AWS side of the connector - the required AWS resources, credentials, and permissions.

The script:

- Creates an OIDC web identity provider, to authenticate Microsoft Entra ID users to AWS. If a web identity provider already exists, the script adds Microsoft Sentinel as an audience to the existing provider.

- Creates an *IAM assumed role* with the minimal necessary permissions, to grant OIDC-authenticated users access to your logs in a given S3 bucket and SQS queue.

- Enables specified AWS services to send logs to that S3 bucket, and notification messages to that SQS queue.

- If necessary, creates that S3 bucket and that SQS queue for this purpose.

- Configures any necessary IAM permissions policies and applies them to the IAM role created above.

For Azure Government clouds, a specialized script creates a different OIDC web identity provider, to which it assigns the IAM assumed role.

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

1. The script prompts you to enter your Workspace ID. This ID appears on the connector page. Copy it and paste it at the prompt of the script.

   :::image type="content" source="media/connect-aws/aws-run-script.png" alt-text="Screenshot of command to run setup script and workspace ID." lightbox="media/connect-aws/aws-run-script.png":::

1. When the script finishes running, copy the **Role ARN** and the **SQS URL** from the script's output (see example in first screenshot below) and paste them in their respective fields in the connector page under **2. Add connection** (see second screenshot below).

   :::image type="content" source="media/connect-aws/aws-script-output.png" alt-text="Screenshot of output of A W S connector setup script." lightbox="media/connect-aws/aws-script-output.png":::

   :::image type="content" source="media/connect-aws/aws-add-connection.png" alt-text="Screenshot of pasting the A W S role information from the script, to the S3 connector." lightbox="media/connect-aws/aws-add-connection.png":::

1. Select a data type from the **Destination table** drop-down list. This tells the connector which AWS service's logs this connection is being established to collect, and into which Log Analytics table it stores the ingested data. Then select **Add connection**.

> [!NOTE]
> The script may take up to 30 minutes to finish running.

## Manual setup

We recommend using the automatic setup script to deploy this connector. If for whatever reason you don't want to take advantage of this convenience, follow the steps below to set up the connector manually.

1. Set up your AWS environment as described in [Set up your Amazon Web Services environment to collect AWS logs to Microsoft Sentinel](connect-aws-configure-environment.md#manual-setup).  

1. In the AWS console: 

   1. Enter the **Identity and Access Management (IAM)** service and navigate to the list of **Roles**. Select the role you created above.

   1. Copy the **ARN** to your clipboard.

   1. Enter the **Simple Queue Service**, select the SQS queue you created, and copy the **URL** of the queue to your clipboard.

1. In Microsoft Sentinel, select **Data connectors** from the navigation menu.

1. Select **Amazon Web Services S3** from the data connectors gallery.

   If you don't see the connector, install the Amazon Web Services solution from the **Content Hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

1. In the details pane for the connector, select **Open connector page**.

1. Under **2. Add connection**:
    1. Paste the IAM role ARN you copied two steps ago into the **Role to add** field.
    1. Paste the URL of the SQS queue you copied in the last step into the **SQS URL** field.
    1. Select a data type from the **Destination table** drop-down list. This tells the connector which AWS service's logs this connection is being established to collect, and into which Log Analytics table it stores the ingested data.
    1. Select **Add connection**.

   :::image type="content" source="media/connect-aws/aws-add-connection.png" alt-text="Screenshot of adding an A W S role connection to the S3 connector." lightbox="media/connect-aws/aws-add-connection.png":::

## Known issues and troubleshooting

### Known issues

- Different types of logs can be stored in the same S3 bucket, but shouldn't be stored in the same path.

- Each SQS queue should point to one type of message. If you want to ingest GuardDuty findings *and* VPC flow logs, set up separate queues for each type.

- A single SQS queue can serve only one path in an S3 bucket. If you're storing logs in multiple paths, each path requires its own dedicated SQS queue.

### Troubleshooting

Learn how to [troubleshoot Amazon Web Services S3 connector issues](aws-s3-troubleshoot.md).

# [CloudTrail connector (legacy)](#tab/ct)

This tab explains how to configure the AWS CloudTrail connector. The process of setting it up has two parts: the AWS side and the Microsoft Sentinel side. Each side's process produces information used by the other side. This two-way authentication creates secure communication.

> [!NOTE]
> AWS CloudTrail has [built-in limitations](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/WhatIsCloudTrail-Limits.html) in its LookupEvents API. It allows no more than two transactions per second (TPS) per account, and each query can return a maximum of 50 records. If a single tenant constantly generates more than 100 records per second in one region, backlogs and delays in data ingestion will result.
>
> Currently, you can only connect your AWS Commercial CloudTrail to Microsoft Sentinel and not AWS GovCloud CloudTrail.

## Prerequisites

- You must have write permission on the Microsoft Sentinel workspace.
- Install the Amazon Web Services solution from the **Content Hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

> [!NOTE]
> Microsoft Sentinel collects CloudTrail management events from all regions. We recommend that you don't stream events from one region to another.

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

## Send formatted CloudWatch events to S3 using a lambda function (optional)

If your CloudWatch logs aren't in the format accepted by Microsoft Sentinel - .csv file in a GZIP format without a header - use a lambda function [view the source code](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/AWS-S3/CloudWatchLambdaFunction.py) within AWS to send CloudWatch events to an S3 bucket in the accepted format.

The lambda function uses Python 3.9 runtime and x86_64 architecture.

To deploy the lambda function:

1. In the AWS Management Console, select the lambda service.
1. Select **Create function**.

   :::image type="content" source="media/cloudwatch-lambda-function/lambda-basic-information.png" alt-text="Screenshot of the AWS Management Console Basic information screen." lightbox="media/cloudwatch-lambda-function/lambda-basic-information.png":::

1. Type a name for the function and select **Python 3.9** as the runtime and **x86_64** as the architecture.
1. Select **Create function**.
1. Under **Choose a layer**, select a layer and select **Add**.

   :::image type="content" source="media/cloudwatch-lambda-function/lambda-add-layer.png" alt-text="Screenshot of the AWS Management Console Add layer screen." lightbox="media/cloudwatch-lambda-function/lambda-add-layer.png":::

1. Select **Permissions**, and under **Execution role**, select **Role name**.
1. Under **Permissions policies**, select **Add permissions** > **Attach policies**.

   :::image type="content" source="media/cloudwatch-lambda-function/lambda-permissions.png" alt-text="Screenshot of the AWS Management Console Permissions tab." lightbox="media/cloudwatch-lambda-function/lambda-permissions.png":::

1. Search for the *AmazonS3FullAccess* and *CloudWatchLogsReadOnlyAccess* policies and attach them.

   :::image type="content" source="media/cloudwatch-lambda-function/lambda-other-permissions-policies.png" alt-text="Screenshot of the AWS Management Console Add permissions policies screen." lightbox="media/cloudwatch-lambda-function/lambda-other-permissions-policies.png":::

1. Return to the function, select **Code**, and paste the code link under **Code source**.
1. The default values for the parameters are set using environment variables. If necessary, you can manually adjust these values directly in the code.
1. Select **Deploy**, and then select **Test**.
1. Create an event by filling in the required fields.

   :::image type="content" source="media/cloudwatch-lambda-function/lambda-configure-test-event.png" alt-text="Screenshot of the AWS Management Configure test event screen." lightbox="media/cloudwatch-lambda-function/lambda-configure-test-event.png":::

1. Select **Test** to see how the event appears in the S3 bucket.

## Next steps

In this document, you learned how to connect to AWS resources to ingest their logs into Microsoft Sentinel. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
