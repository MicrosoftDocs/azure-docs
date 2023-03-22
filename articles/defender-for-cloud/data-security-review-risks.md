---
title: Explore risks to sensitive data in Microsoft Defender for Cloud
description: Learn how to use attack paths and security explorer to find and remediate sensitive data risks.
author: bmansheim
ms.author: benmansheim
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 03/14/2023
ms.custom: template-how-to-pattern
---
# Explore risks to sensitive data

After [discovering resources with sensitive data](data-security-posture-enable.md), Microsoft Defender for Cloud lets you explore risks to sensitive data.

- **Attack paths**: When sensitive data discovery is enabled in the Defender Cloud Security Posture Management (CSPM) plan, you can use attack paths to discover risk of data breaches on internet-exposed VMs. [Learn more](concept-data-security-posture.md#data-security-in-defender-cspm).
- **Security Explorer**: When sensitive data discovery is enabled in the Defender CSPM plan, you can use Cloud Security Explorer to query cloud graph insights. [Learn more](concept-data-security-posture.md#data-security-in-defender-cspm).
- **Security alerts**: When sensitive data discovery is enabled, you can prioritize and investigate alerts focused on sensitive data.

## Discover sensitive resources through attack paths

1. To open attack paths, in Defender for Cloud, go to **Recommendations** > **Attack paths**.
1. Review attack paths related to sensitive data. For example, for the attack path “Internet exposed Azure Storage container with sensitive data is publicly accessible”:

    1. To see the sensitive information types detected in the Azure storage container, click on the container name in the graph > **Insights**. Expand the **Contain sensitive data** insight.
    1. For help on mitigating the risk of the storage account container exposed to the internet with public access, open **Recommendations**.

Other attack paths include:

- “VM has high severity vulnerabilities and read permission to a data store with sensitive data”
- “Internet exposed AWS S3 Bucket with sensitive data is publicly accessible”
- “Internet exposed EC2 instance has high severity vulnerabilities and read permission to a S3 bucket with sensitive data”

Learn more about [attack paths](concept-attack-path.md).

## Discover sensitive resources using Cloud Security Explorer 

1. In Defender for Cloud, open **Cloud Security Explorer**.
1. Select a query template, or build your own query by selecting resource types, 

As an example, to get list of storage accounts/storage account containers which contain sensitive data and are also exposed to the internet, use this query:

Specifically for AWS S3 buckets, A bucket will be considered public if the following conditions are met: 

- If `RestrictPublicBuckets` is not enabled at the account level.
- If `RestrictPublicBuckets` is not enabled at the bucket level.
- Either:
    - The IP range is wider `\8`.
    - Buckets doesn't have a bucket policy.
    - Buckets has a bucket policy without a condition.
    - Bucket has a bucket policy without a condition based on IP address.

Learn more about [Cloud Security Explorer](how-to-manage-cloud-security-explorer.md).

## Get security alerts about sensitive data

Prioritize the alerts and recommendations related to resources with sensitivity labels and sensitive info types. Focus on protecting sensitive resources. The sensitive info types and sensitivity labels found are used in other areas of Microsoft Defender for Cloud. View the resource-level labels and info types in the Security alerts and Recommendations to help you prioritize and focus on protecting your critical resources.


## Next steps
TODO: Add your next step link(s)
