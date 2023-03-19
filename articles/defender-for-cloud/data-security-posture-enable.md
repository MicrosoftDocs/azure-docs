---
title: Enable data-aware security posture for Azure datastores - Microsoft Defender for Cloud
description: Learn how to enable data-aware security posture for Azure datastores in Microsoft Defender for Cloud to identify sensitive data and prevent data breaches.
author: bmansheim
ms.author: benmansheim
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 03/14/2023
ms.custom: template-how-to-pattern
---

# Enable data-aware security posture

To help you protect against data breaches, you can enable data-aware security posture in Microsoft Defender for Cloud. Data-aware security posture identifies sensitive data in your Azure datastores. You'll get alerts when sensitive data is uploaded to your datastores, and you can use attack paths and the security explorer to see how sensitive data is exposed to risk.

When you enable Defender CSPM or Defender for Storage, the **Sensitive data discovery** setting is automatically enabled for the enabled plans. You can disable this setting if you don't want to use data-aware security posture. We recommend that you have **Sensitive data discovery** Defender CSPM and Defender for Storage to get the most value from Defender for Cloud.

Sensitive data is identified based on the data sensitivity settings. You can [customize the data sensitivity settings](data-sensitivity-settings.md) to identify the data that your organization considers sensitive.

## Prerequisites

Make sure you review the [interoperability information](support-matrix-data-security-posture.md) for data-aware security posture.

## Enable Data-aware security posture in Defender CSPM for Azure subscriptions

Before you enable data-aware security posture, you must have the **Subscription owner** role or have these permissions:

- Microsoft.Storage/storageAccounts/{read/write} 
- Microsoft.Authorization/roleAssignments/{read/write/delete}

To enable data-aware security posture for Azure subscriptions, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com). 
1. Navigate to **Microsoft Defender for Cloud** > **Environmental settings**.
1. Select the relevant Azure subscription.
1. For the Defender for CSPM plan, select the **On** status.

    If Defender for CSPM is already on, select **Settings** in the Monitoring coverage column of the Defender CSPM plan and make sure that the **Sensitive data discovery** component is set to **On** status.

## Enable Data-aware security posture in Defender CSPM for AWS accounts

To enable data-aware security posture for AWS accounts, you'll need to go change the Defender CSPM settings in the AWS connector and implement the changes in AWS with a CloudFormation template. The AWS account has to have the regular permissions required to add any other plan for AWS connector. In addition, they need permission to run the CloudFormation template in AWS.

### Prerequisites

Before you enable data-aware security posture for AWS S3 buckets:

- The CloudFormation template creates a new role in AWS IAM that allows permission to the MDC scanner access the customer’s data in the S3 buckets. The role allows these permissions:

    - S3 read only
    - KMS decrypt

- Verify that there is no policy that blocks the connection to your Amazon S3 buckets:
    - Make sure that the S3 bucket policy doesn't block the connection:
        1. In AWS, navigate to your S3 bucket, and then select the Permissions tab > Bucket policy.
        1. Check the policy details to make sure that it doesn't block the connection from the MDC
scanner service running in Microsoft account in AWS.
    - Make sure that there's no SCP policy that blocks the connection to the S3 bucket. For 
example, your SCP policy might block read API calls to the AWS Region where your S3 
bucket is hosted.
    - These required API calls must be allowed by your SCP policy: AssumeRole, 
GetBucketLocation, GetObject, ListBucket, GetBucketPublicAccessBlock
    - Your SCP policy must also allow calls to the us-east-1 AWS Region, which is the default 
Region for API calls.

### Enable the Data security posture component for AWS S3 buckets

To enable data-aware security posture for AWS accounts, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com). 
1. Navigate to **Microsoft Defender for Cloud** > **Environmental settings**.
1. Select the relevant AWS account.
1. For the Defender CSPM plan, select the **On** status.

    If Defender CSPM is already on, select **Settings** in the Monitoring coverage column of the Defender CSPM plan and make sure that the **Data security posture** component is set to **On** status.

1. Proceed with the instructions to download the CloudFormation template and to run it in AWS.

Automatic discovery of S3 buckets in the AWS account starts automatically. The Defender for Cloud scanner runs in your AWS account and connects to the your S3 buckets.

## Enable resource scanning on your subscriptions

The security explorer and attack paths show you sensitive resources that are found with resource scanning.

To enable resource scanning on your subscriptions:

1. Go to **Directories + subscriptions**.
1. Select the **Default subscription** filter and select the subscriptions that you want to scan.

After 24 hours you can find the results of resources with sensitive data in the Security Explorer and attack paths

## Next steps

Now that you have data-aware security posture enabled, you can:

- [Customize the data sensitivity settings](data-sensitivity-settings.md)
- [Review the security risks in your data](data-security-review-risks.md)