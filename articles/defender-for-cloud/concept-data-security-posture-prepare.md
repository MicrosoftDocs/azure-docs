---
title: Support and prerequisites for data-aware security posture
description: Learn about the requirements for data-aware security posture
author: bmansheim
ms.author: benmansheim
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 03/23/2023
---
# Support and prerequisites for data-aware security posture

Review the requirements on this page before setting up [data-aware security posture](concept-data-security-posture.md) in Microsoft Defender for Cloud.

## Enabling sensitive data discovery

Sensitive data discovery is available in the Defender CSPM and Defender for Storage plans.

- When you enable one of the plans, the sensitive data discovery extension is turned on as part of the plan.
- If you have existing plans running, the extension is available, but turned off by default.
- Existing plan status will show as “Partial” rather than “Full” until the feature is turned on manually.
- The feature is turned on at the subscription level.


## What's supported

The table summarizes support for data-aware posture management.

**Support** | **Details**
--- | ---
What data resources can I scan? | Azure storage accounts v1, v2, including accounts in private networks.<br/><br/> Azure Data Lake Storage Gen2<br/><br/>Note that we don't scan page blobs.<br/><br/Itsv, .txt., xml, .parquet, .avro, .orc.
What Azure regions are supported? | You can scan Azure storage accounts in:<br/><br/> Australia Central; Australia Central 2; Australia East; Australia Southeast; Brazil South; Canada Central; Canada East; Central India; Central US; East Asia; East US; East US 2; France Central; Germany West Central; Japan East; Japan West: Jio India West: North Central US; North Europe; Norway East; South Africa North: South Central US; South India; Sweden Central; Switzerland North; UAE North; UK South; UK West: West Central US; West Europe; West US, West US3.<br/><br/> Scanning is done locally in the region.
What AWS regions are supported? | Asia Pacific (Tokyo); Asia Pacific (Singapore); Asia Pacific (Sydney); Europe (Frankfurt); Europe (Ireland); Europe (London); Europe (Paris); US East (Ohio); US East (N Virginia); US West (N. California): US West (Oregon).<br/><br/> Scanning is done locally in the region.
Do I need to install an agent? | No, scanning is agentless.
What's the cost? | The feature is included with the Defender CSPM and Defender for Storage plans, and doesn’t include other costs except for the respective plan costs.

## Scanning

- It takes up to 24 hours to see the results for a first scan.
- Refreshed results for a subscription that's previously been scanned take up to 48 hours.
- New Azure storage accounts and new AWS S3 buckets in a scanned subscription are automatically scanned the next time that scanning occurs.


## Configuring data sensitivity settings

**Action** | **Requirements**
--- | ---
Modify built-in sensitivity settings | You need one of these permissions:<br/><br/> Global Administrator<br/>Compliance Administrator<br/>Compliance Data Administrator<br/>Security Administrator<br/>Security Operator
[Add custom information types from Microsoft Purview](data-sensitivity-settings.md) | Requires consent to allow the use of custom sensitive information types and labels that are configured in Microsoft Purview.
[Add sensitivity labels from Microsoft Purview](data-sensitivity-settings.md) | Requires consent to allow the use of custom sensitive information types and labels that are configured in Microsoft Purview.<br/><br/> One or more [sensitivity labels](/microsoft-365/compliance/sensitivity-labels) must be [created and defined](/microsoft-365/compliance/get-started-with-sensitivity-labels) in Microsoft Purview.<br/><br/> The label must be configured to [apply to content automatically](/microsoft-365/compliance/apply-sensitivity-label-automatically).<br/><br/> The labels must be [published](/microsoft-365/compliance/create-sensitivity-labels) with a label policy that’s in effect. Scope should include Items and Schematized data assets and autolabeling rules.<br/><br/>Sub-labels such as Confidential/Limited aren't supported when defining label threshold levels in Defender for Cloud.
[Learn more](/microsoft-365/compliance/create-sensitivity-labels) about sensitivity labels in Microsoft Purview.

## Discovery and scanning

Defender for Cloud starts discovering and scanning data immediately after enabling a plan, or after turning on the feature in plans that are already running.

- After you onboard the feature, results appear in the Defender for Cloud portal within 24 hours. 
- After files are updated in the scanned resources, data is refreshed within 8 days.

## Scanning AWS storage

In order to protect AWS resources in Defender for Cloud, you set up an AWS connector, using a CloudFormation template to onboard the AWS account. 

- To scan AWS data resources, Defender for Cloud updates the CloudFormation template.
- The CloudFormation template creates a new role in AWS IAM, to allow permission for the Defender for Cloud scanner to access data in the S3 buckets. 
- To connect AWS accounts, you need Administrator permissions on the account.
- The role allows these permissions: S3 read only; KMS decrypt.
- Defender for Cloud can discover data encrypted by KMB, but it can’t discover data that’s encrypted with a Customer Key.




## Next steps

[Enable](data-security-posture-enable.md) data-aware security posture.

