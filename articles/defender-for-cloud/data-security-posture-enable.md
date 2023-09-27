---
title: Enable data-aware security posture for Azure datastores
description: Learn how to enable data-aware security posture in Defender for Cloud
author: dcurwin
ms.author: dacurwin
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 09/05/2023
ms.custom: template-how-to-pattern
---

# Enable data-aware security posture

This article describes how to enable [data-aware security posture](data-security-posture-enable.md) in Microsoft Defender for Cloud.

## Before you start

- Before you enable data-aware security posture, [review support and prerequisites](concept-data-security-posture-prepare.md).
- When you enable Defender CSPM or Defender for Storage plans, the sensitive data discovery extension is automatically enabled. You can disable this setting if you don't want to use data-aware security posture, but we recommend that you use the feature to get the most value from Defender for Cloud.
- Sensitive data is identified based on the data sensitivity settings in Defender for Cloud. You can [customize the data sensitivity settings](data-sensitivity-settings.md) to identify the data that your organization considers sensitive.
- It takes up to 24 hours to see the results of a first discovery after enabling the feature.

## Enable in Defender CSPM (Azure)

Follow these steps to enable data-aware security posture. Don't forget to review [required permissions](concept-data-security-posture-prepare.md#whats-supported) before you start.

1. Navigate to **Microsoft Defender for Cloud** > **Environmental settings**.
1. Select the relevant Azure subscription.
1. For the Defender CSPM plan, select the **On** status.

    If Defender CSPM is already on, select **Settings** in the Monitoring coverage column of the Defender CSPM plan and make sure that the **Sensitive data discovery** component is set to **On** status.

1. Once sensitive data discovery is turned **On** in Defender CSPM, it will automatically incorporate support for additional resource types as the range of supported resource types expands.

## Enable in Defender CSPM (AWS)

### Before you start

- Don't forget to: [review the requirements](concept-data-security-posture-prepare.md#discovery) for AWS discovery, and [required permissions](concept-data-security-posture-prepare.md#whats-supported).
- Check that there's no policy that blocks the connection to your Amazon S3 buckets.
- For RDS instances: cross-account KMS encryption is supported, but additional policies on KMS access may prevent access.

### Enable for AWS resources

#### S3 buckets and RDS instances

1. Enable data security posture as described above
1. Proceed with the instructions to download the CloudFormation template and to run it in AWS.

Automatic discovery of S3 buckets in the AWS account starts automatically.

For S3 buckets, the Defender for Cloud scanner runs in your AWS account and connects to your S3 buckets.

For RDS instances, discovery will be triggered once **Sensitive Data Discovery** is turned on. The scanner will take the latest automated snapshot for an instance, create a manual snapshot within the source account, and copy it to an isolated Microsoft-owned environment within the same region.

The snapshot is used to create a live instance that is spun up, scanned and then immediately destroyed (together with the copied snapshot).

Only scan findings are reported by the scanning platform.

:::image type="content" source="media/data-security-posture-enable/rds-scanning-platform.png" alt-text="Diagram explaining the RDS scanning platform." lightbox="media/data-security-posture-enable/rds-scanning-platform.png":::

### Check for S3 blocking policies

If the enable process didn't work because of a blocked policy, check the following:

- Make sure that the S3 bucket policy doesn't block the connection. In the AWS S3 bucket, select the **Permissions** tab > Bucket policy. Check the policy details to make sure the Microsoft Defender for Cloud scanner service running in the Microsoft account in AWS isn't blocked.
- Make sure that there's no SCP policy that blocks the connection to the S3 bucket. For example, your SCP policy might block read API calls to the AWS Region where your S3 bucket is hosted.
- Check that these required API calls are allowed by your SCP policy: AssumeRole, GetBucketLocation, GetObject, ListBucket, GetBucketPublicAccessBlock
- Check that your SCP policy allows calls to the us-east-1 AWS Region, which is the default region for API calls.

## Enable data-aware monitoring in Defender for Storage

Sensitive data threat detection is enabled by default when the sensitive data discovery component is enabled in the Defender for Storage plan. [Learn more](defender-for-storage-data-sensitivity.md).

Only Azure Storage resources will be scanned if the Defender CSPM plan is turned off.

## Next steps

[Review the security risks in your data](data-security-review-risks.md)
