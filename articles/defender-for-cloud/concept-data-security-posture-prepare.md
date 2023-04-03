---
title: Support and prerequisites for data-aware security posture - Microsoft Defender for Cloud
description: Learn about the requirements for data-aware security posture in Microsoft Defender for Cloud
author: bmansheim
ms.author: benmansheim
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 03/23/2023
ms.custom: references_regions
---
# Support and prerequisites for data-aware security posture

Review the requirements on this page before setting up [data-aware security posture](concept-data-security-posture.md) in Microsoft Defender for Cloud.

## Enabling sensitive data discovery

Sensitive data discovery is available in the Defender CSPM and Defender for Storage plans.

- When you enable one of the plans, the sensitive data discovery extension is turned on as part of the plan.
- If you have existing plans running, the extension is available, but turned off by default.
- Existing plan status shows as “Partial” rather than “Full” until the feature is turned on manually.
- The feature is turned on at the subscription level.


## What's supported

The table summarizes support for data-aware posture management.

**Support** | **Details**
--- | ---
What Azure data resources can I discover? | Azure storage accounts v1, v2<br/><br/> Azure Data Lake Storage Gen1/Gen2<br/><br/>Accounts are supported behind private networks but not behind private endpoints.<br/><br/>  Defender for Cloud can discover data encrypted by KMB or a customer-managed key. 
What AWS data resources can I discover? | AWS S3 buckets<br/><br/> Defender for Cloud can discover encrypted data, but not data encrypted with a customer-managed key.
What permissions do I need for discovery? | Storage account: Subscription Owner or Microsoft.Storage/storageaccounts/{read/write} and Microsoft.Authorization/roleAssignments/{read/write/delete}<br/><br/> Amazon S3 buckets: AWS account permission to run Cloud Formation (to create a role).
What file types are supported for sensitive data discovery? | Supported file types (you can't select a subset) - .doc, .docm, .docx, .dot, .odp, .ods, .odt, .pdf, .pot, .pps, .ppsx, .ppt, .pptm, .pptx, .xlc, .xls, .xlsb, .xlsm, .xlsx, .xlt, .csv, .json, .psv, .ssv, .tsv, .txt., xml, .parquet, .avro, .orc.
What Azure regions are supported? | You can discover Azure storage accounts in:<br/><br/> Australia Central; Australia Central 2; Australia East; Australia Southeast; Brazil South; Canada Central; Canada East; Central India; Central US; East Asia; East US; East US 2; France Central; Germany West Central; Japan East; Japan West: Jio India West: North Central US; North Europe; Norway East; South Africa North: South Central US; South India; Sweden Central; Switzerland North; UAE North; UK South; UK West: West Central US; West Europe; West US, West US3.<br/><br/> Discovery is done locally in the region.
What AWS regions are supported? | Asia Pacific (Mumbai); Asia Pacific (Singapore); Asia Pacific (Sydney); Asia Pacific (Tokyo); Canada (Central); Europe (Frankfurt); Europe (Ireland); Europe (London); Europe (Paris); South America (São Paulo); US East (Ohio); US East (N. Virginia); US West (N. California): US West (Oregon).<br/><br/> Discovery is done locally in the region.
Do I need to install an agent? | No, discovery is agentless.
What's the cost? | The feature is included with the Defender CSPM and Defender for Storage plans, and doesn’t include other costs except for the respective plan costs.


## Configuring data sensitivity settings

The main steps for configuring data sensitivity setting include:
- [Import custom sensitive info types/labels from Microsoft Purview compliance portal](data-sensitivity-settings.md#import-custom-sensitive-info-typeslabels-from-microsoft-purview-compliance-portal)
- [Customize sensitive data categories/types](data-sensitivity-settings.md#customize-sensitive-data-categoriestypes)
- [Set the threshold for sensitivity labels](data-sensitivity-settings.md#set-the-threshold-for-sensitive-data-labels)

[Learn more](/microsoft-365/compliance/create-sensitivity-labels) about sensitivity labels in Microsoft Purview.

## Discovery

Defender for Cloud starts discovering data immediately after enabling a plan, or after turning on the feature in plans that are already running.

- After you onboard the feature, results appear in the Defender for Cloud portal within 24 hours. 
- After files are updated in the discovered resources, data is refreshed within eight days.

### Discovery time

- It takes up to 24 hours to see the results for a first-time discovery.
- Refreshed results for a resource that's previously been discovered take up to eight days.
- A new Azure storage account that's added to an already discovered subscription is discovered within 24 hours or less.
- A new AWS S3 bucket that's added to an already discovered AWS account is discovered within 48 hours or less.

### Discovering AWS storage

In order to protect AWS resources in Defender for Cloud, you set up an AWS connector, using a CloudFormation template to onboard the AWS account. 

- To discover AWS data resources, Defender for Cloud updates the CloudFormation template.
- The CloudFormation template creates a new role in AWS IAM, to allow permission for the Defender for Cloud scanner to access data in the S3 buckets. 
- To connect AWS accounts, you need Administrator permissions on the account.
- The role allows these permissions: S3 read only; KMS decrypt.

## What does internet-exposed/publicly accessible mean?

Defender CSPM attack paths and cloud security graph insights include information about storage resources that are exposed to the internet. The following table provides more details.

**State** | **Azure resources** | **AWS resources**
--- | --- | ---
**Exposed to the internet** | An Azure storage account is considered exposed if public network access is enabled, with either of these settings enabled<br/><br/> Storage_account_name **Networking** > **Public network access** > **Enabled from all networks**<br/><br/> or<br/><br/>  Storage_account_name **Networking** > **Public network access** > **Enable from selected virtual networks and IP addresses**. | An AWS S3 bucket is consider exposed if the AWS account and AWS S3 bucket don't have a condition set for IP addresses.
**Publicly accessible** | An Azure storage account is considered to be publicly accessible if both these settings are configured on the Azure storage account container:<br/><br/> Storage account name **Configuration** > **Allow blob public access**<br/><br/>and either of these settings:<br/><br/> Storage account name > **Containers** > container_name > **Public access level** set to **Blob (anonymous read access for blobs only)** **or** set to **Container (anonymous read access for containers and blobs)**. | An AWS S2 bucket is considered publicly available if both the AWS account and the AWS S3 bucket have **Block all public access** set to **Off**, and the policy has **either** of these settings:<br/><br/> Setting 1: In the policy, **RestrictPublicBuckets isn't allowed and **principal is *** and **effect** are set to **Allow**.<br/><br/> Setting 2: In the access control list, **IgnorePublicAcl** isn't enabled, and permission is allowed for **everyone**, or for **authenticated users**.




## Next steps

[Enable](data-security-posture-enable.md) data-aware security posture.

