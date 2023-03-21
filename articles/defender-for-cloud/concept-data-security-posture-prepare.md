---
title: Prepare for data-aware security posture deployment
description: Learn about the requirements for data-aware security posture deployment
author: bmansheim
ms.author: benmansheim
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 03/09/2023
---
# Prepare for data-aware security posture deployment

Review the requirements on this page before setting up [data-aware security posture](concept-data-security-posture.md) in [Microsoft Defender for Cloud](defender-for-cloud-introduction.md).

## Enabling sensitive data discovery

Sensitive data discovery is available in the Defender CSPM and Defender for Storage plans.

- When you enable one of the plans, the Sensitive Data Discovery extension is turned on as part of the plan.
- If you have existing plans running, the extension will be available, but turned off by default. After the feature is released, existing plan status will show as “Partial” rather than “Full” until the feature is turned on manually.
- The feature is turned on at the subscription level.


## What's supported

The table summarizes support for data-aware posture management.

**Support** | **Details**
--- | ---
What data resources can I scan? | Azure storage accounts v2<br/><br/> AWS S3 buckets
What permissions do I need for scanning? | Storage account: Subscription Owner<br/><br/> Amazon S3 buckets: AWS account permission to run Cloud Formation (to create a role).
What file types are supported? | Supported file types (you can't select a subset):.doc, .docm, .docx, .dot, .odp, .ods, .odt, .pdf, .pot, .pps, .ppsx, .ppt, .pptm, .pptx, .xlc, .xls, .xlsb, .xlsm, .xlsx, .xlt.,.cvs, .json, .psv, .ssv, .tsv, .txt., xml, .parquet, .avro, .orc.
What Azure regions are supported? | You can scan Azure storage accounts in:<br/><br/> Australia Central; Australia Central 2 ; Australia East; Australia Southeast; Brazil South; Canada Central; Canada East ; Central India; Central U; East Asia; East US; East US 2; France Central; Japan East; Japan West: Jio India West: North Central US; North Europe; Norway East; South Africa North: South Center US; South India: Sweden Central; Switzerland North; UAE North; UK South; UK West: West Centra US; West Europe; West US, West US3.<br/><br/> Scanning is done locally in the region.
What AWS regions are supported? | Africa (Cape Town); Asia Pacific (Hong Kong); Asia Pacific (Mumbai); Asia Pacific (Osaka-Local); Asia Pacific (Seoul); Asia Pacific (Singapore); Asia Pacific (Sydney); Asia Pacific (Tokyo); Canada (Central); China (Beijing); China (Ningxia); Europe (Frankfurt); Europe (Ireland); Europe (London); Europe (Milan); Europe (Paris); Europe (Stockholm); Middle East (Bahrain); South America (Sao Paulo); US East (Ohio); US East (N Virginia); US West (N. California): US West (Oregon).<br/><br/> Scanning is done locally in the region.
Do I need to install an agent? | No, scanning is agentless.
What's the cost? | The feature is included with each plan, and doesn’t include additional costs outside the respective plan costs.

## Scanning

- It takes up to 24 hours to see results for a first scan.
- Refreshed results for a subscription that's already been scanned take up to 48 hours.
- New Azure storage accounts in a scanned subscription aren't automatically scanned. Under **Manage sensitivity scans**, you'll need to disable the subscription, and then reenable it.
- New AWS S3 buckets in a scanned subscription are automatically scanned.


## Configuring data sensitivity settings

**Action** | **Requirements**
--- | ---
Modify built-in sensitivity settings | You need one of these permissions:<br/><br/> Global Administrator<br/>Compliance Administrator<br/>Compliance Data Administrator<br/>Security Administrator<br/>Security Operator<br/>These permissions: Microsoft.Storage/storageAccounts/{read/write} and Microsoft.Authorization/roleAssignments/{read/write/delete}
Add Purview information types | Requires consent to allow the use of custom sensitive information types and labels that are configured in Microsoft Purview.
Add Purview sensitivity labels | - Requires consent to allow the use of custom sensitive information types and labels that are configured in Microsoft Purview.<br/><br/> - One or more [sensitivity labels](/microsoft-365/compliance/sensitivity-labels) must be [created and defined](/microsoft-365/compliance/get-started-with-sensitivity-labels) in Microsoft Purview.<br/><br/> - The label must be configured to [apply to content automatically](/microsoft-365/compliance/apply-sensitivity-label-automatically).<br/><br/>- The labels must be [published](/microsoft-365/compliance/create-sensitivity-labels) with a label policy that’s in effect.

Note that:

- The labels appear in Defender for Cloud in the order ranking set in Microsoft Purview.
- The two sensitivity labels that are set to highest priority in Microsoft Purview are turned on by default in Defender for Cloud. 
- When you select a label in Defender for Cloud, any labels ranked above that label are turned on automatically.
- The labels are evaluated per-file and are stored as metadata in Defender for cloud. Defender for Cloud doesn’t move or modify files.

## Discovery and scanning

Defender for Cloud starts discovering and scanning data immediately after enabling a plan, or after turning on the feature in plans that are already running.

- After onboarding the feature, results appear in the Defender for Cloud portal within 24 hours. 
- After files are updated in the scanned resources, data is refreshed within 8 days.

## Scanning AWS storage

In order to protect AWS resources in Defender for Cloud, you set up an AWS connector, using a CloudFormation template to onboard the AWS account. 

To scan AWS data resources, Defender for Cloud updates the CloudFormation template used to connect to AWS.

The CloudFormation template creates a new role in AWS IAM, to allow permission for the Defender for Cloud scanner to access data in the S3 buckets. Note that:

- To connect AWS accounts, you need Administrator permissions on the account.
- The role allows these permissions: S3 read only; KMS decrypt.
- Defender for Cloud can discover data encrypted by KMB, but it can’t discover data that’s encrypted with a customer key.




## Next steps

[Set up](data-security-posture-enable.md) data-aware security posture management.

