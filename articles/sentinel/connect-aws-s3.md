---
title: Connect Azure Sentinel to S3 Buckets to get Amazon Web Services (AWS) data | Microsoft Docs
description: Use the AWS connector to delegate Azure Sentinel access to AWS resource logs, creating a trust relationship between Amazon Web Services and Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/06/2021
ms.author: yelevin

---

# Connect Azure Sentinel to S3 Buckets to get Amazon Web Services (AWS) data

Use the Amazon Web Services (AWS) S3 connector to pull AWS service logs into Azure Sentinel. This connection process delegates access for Azure Sentinel to your AWS resource logs, creating a trust relationship between Amazon Web Services and Azure Sentinel. This is accomplished on AWS by creating a role that gives permission to Azure Sentinel to access your AWS logs.

This document explains how to configure the new AWS S3 connector. The process of setting it up has two parts.

1. In your AWS environment:
    - Set up your AWS account.
    - Create an assumed role to grant it permissions.
    - Configure your AWS service(s) to send logs to an **S3 bucket**.
    - Create a Simple Queue Service (SQS) to configure notification.
    - Attach the appropriate IAM policies to grant Azure Sentinel access to the appropriate resources (S3 bucket, SQS).

1. Enable and configure the **AWS S3 Connector** in the Azure Sentinel portal. See the instructions below.

We have made available, in our GitHub repository, a set of scripts that automate this entire process. See the instructions for [automatic setup](#automatic-setup) later in this document.

## Architecture overview

This graphic and the following text shows how the parts of this connector solution interact.

:::image type="content" source="media/connect-aws-s3/s3-connector-architecture.png" alt-text="Screenshot of A W S S 3 connector architecture.":::

- AWS services are configured to send their logs to S3 (Simple Storage Service) storage buckets.
- The S3 bucket sends notification messages to the SQS message queue whenever it receives new logs.
- The Azure Sentinel AWS S3 connector polls the SQS queue at regular, frequent intervals. If there is a message in the queue, it will contain the path to the log files.
- The connector reads the message with the path, then fetches the files from the S3 bucket.
- To connect to the SQS queue and the S3 bucket, Azure Sentinel uses AWS credentials embedded in the AWS S3 connector's configuration. The AWS credentials are configured with a permissions policy giving them access to those resources. Similarly, the Azure Sentinel workspace identification is embedded in the AWS configuration, so there is in effect two-way authentication.

## Automatic setup

To simplify the onboarding process, Azure Sentinel has provided a [PowerShell script to automate the setup](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/AWS-S3/ConfigAwsConnector.ps1) of the AWS S3 connector and the required AWS resources, credentials, and permissions.

The script takes the following actions:
- Creates an *Assumed Role* with minimal permissions, to grant Azure Sentinel access to your logs in a designated S3 bucket & SQS of your choice
- Enables VPC Flow logs on virtual private clouds (VPCs) of your choice to a specified S3 bucket and messages to a specified SQS Queue
- Configures and applies some mandatory IAM policies.

1. In Azure Sentinel, select **Data connectors** and then select the **Amazon Web Services S3** line in the table and in the AWS pane to the right,  select **Open connector page**.

1. In the **Configuration** section, under **1. Setup AWS Environment**, expand **Enable by PowerShell script** and download and run the appropriate scripts from the connector page.

1. Under 2. Microsoft account, copy the **Microsoft account ID** and the **External ID (Workspace ID)** and paste them aside.

> [!NOTE]
> The script may take up to 30 minutes to finish running.

## Manual setup



### Publishing AWS service logs to an S3 bucket



#### AWS Virtual Private Cloud (VPC)

VPC Flow Logs is a feature that enables you to capture information about the IP traffic going to and from network interfaces in your virtual private cloud.

1. [Create a flow log that publishes to Amazon S3](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-s3.html#flow-logs-s3-create-flow-log).

    > [!NOTE]
    > If you choose to customize the logs format, include the *start* attribute as it defines the time generated field in the Log Analytics workspace. Otherwise, we will fill the time generated field value with the record ingested time which isn’t the right time of the log.

1. [Give your IAM user sufficient permissions to publish flow logs to the Amazon S3 bucket](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-s3.html#flow-logs-s3-permissions).

1. Verify that logs are being sent to the S3 bucket and that you have messages in the designated SQS, then [configure the connector](#connector-configuration).


#### AWS GuardDuty

1. [Export your GuardDuty findings to an S3 bucket](https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_exportfindings.html).

#### AWS CloudTrail



### Create a Simple Queue Service (SQS) in AWS



### Enable SQS notification


### Connector configuration

#### Create an AWS assumed role and grant access to the AWS Sentinel account

1. In Azure Sentinel, select **Data connectors** and then select the **Amazon Web Services S3** line in the table and in the AWS pane to the right,  select **Open connector page**.

1. Under **Configuration**, copy the **Microsoft account ID** and the **External ID (Workspace ID)** and paste them aside.
 
1. In your Amazon Web Services console, under **Security, Identity & Compliance**, select **IAM**.

   :::image type="content" source="media/connect-aws-s3/aws-1.png" alt-text="Screenshot of Amazon Web Services console.":::

1. Choose **Roles** and select **Create role**.

   :::image type="content" source="media/connect-aws-s3/aws-2.png" alt-text="Screenshot of A W S roles creation screen.":::

1. Choose **Another AWS account.** In the **Account ID** field, enter the **Microsoft Account ID** that you copied from the AWS connector page in the Azure Sentinel portal and pasted aside.

   :::image type="content" source="media/connect-aws-s3/aws-3.png" alt-text="Screenshot of A W S role configuration screen.":::

1. Select the **Require External ID** check box, and then enter the **External ID (Workspace ID)** that you copied from the AWS connector page in the Azure Sentinel portal and pasted aside. Then select **Next: Permissions**.

   :::image type="content" source="media/connect-aws-s3/aws-4.png" alt-text="Screenshot of continuation of A W S role configuration screen.":::

1. Skip the next step, **Attach permissions policy**, for now. You'll come back to it later when instructed. Select **Next: Tags**.

   :::image type="content" source="media/connect-aws-s3/aws-5.png" alt-text="Screenshot of Next: Tags.":::

1. Enter a **Tag** (optional). Then select **Next: Review**.

   :::image type="content" source="media/connect-aws-s3/aws-6.png" alt-text="Screenshot of tags screen.":::

1. Enter a **Role name** and select **Create role**.

   :::image type="content" source="media/connect-aws-s3/aws-7.png" alt-text="Screenshot of role naming screen.":::

1. In the **Roles** list, select the new role you created.

   :::image type="content" source="media/connect-aws-s3/aws-8.png" alt-text="Screenshot of roles list screen.":::

1. Copy the **Role ARN**.

   :::image type="content" source="media/connect-aws-s3/aws-9.png" alt-text="Screenshot of copying role A R N.":::

1. In the AWS S3 connector page in the Azure Sentinel portal, paste the **Role ARN** into the **Role ARN** field under **3. Add connection**, and select **Add connection**.


## Next steps
In this document, you learned how to connect AWS CloudTrail to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.