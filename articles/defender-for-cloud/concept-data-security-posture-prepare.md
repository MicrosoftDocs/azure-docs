---
title: Support and prerequisites for data-aware security posture
description: Learn about the requirements for data-aware security posture in Microsoft Defender for Cloud
author: dcurwin
ms.author: dacurwin
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
- Existing plan status shows as “Partial” rather than “Full” if one or more extensions aren't turned on.
- The feature is turned on at the subscription level.


## What's supported

The table summarizes support for data-aware posture management.

|**Support** | **Details**|
|--- | ---|
|What Azure data resources can I discover? | [Block blob](../storage/blobs/storage-blobs-introduction.md) storage accounts in Azure Storage v1/v2<br/><br/> Azure Data Lake Storage Gen2<br/><br/>Storage accounts behind private networks are supported.<br/><br/>  Storage accounts encrypted with a customer-managed server-side key are supported.<br/><br/> Accounts aren't supported if any of these settings are enabled: [Public network access is disabled](../storage/common/storage-network-security.md#change-the-default-network-access-rule); Storage account is defined as [Azure DNS Zone](https://techcommunity.microsoft.com/t5/azure-storage-blog/public-preview-create-additional-5000-azure-storage-accounts/ba-p/3465466); The storage account endpoint has a [custom domain mapped to it](../storage/blobs/storage-custom-domain-name.md).|
|What AWS data resources can I discover? | AWS S3 buckets<br/><br/> Defender for Cloud can discover KMS-encrypted data, but not data encrypted with a customer-managed key.|
|What permissions do I need for discovery? | Storage account: Subscription Owner<br/> **or**<br/> Microsoft.Authorization/roleAssignments/* (read, write, delete) **and** Microsoft.Security/pricings/* (read, write, delete) **and** Microsoft.Security/pricings/SecurityOperators (read, write)<br/><br/> Amazon S3 buckets: AWS account permission to run Cloud Formation (to create a role).|
|What file types are supported for sensitive data discovery? | Supported file types (you can't select a subset) - .doc, .docm, .docx, .dot, .gz, .odp, .ods, .odt, .pdf, .pot, .pps, .ppsx, .ppt, .pptm, .pptx, .xlc, .xls, .xlsb, .xlsm, .xlsx, .xlt, .csv, .json, .psv, .ssv, .tsv, .txt., xml, .parquet, .avro, .orc.|
|What Azure regions are supported? | You can discover Azure storage accounts in:<br/><br/> Australia Central; Australia Central 2; Australia East; Australia Southeast; Brazil South; Canada Central; Canada East; Central India; Central US; East Asia; East US; East US 2; France Central; Germany West Central; Japan East; Japan West: Jio India West: North Central US; North Europe; Norway East; South Africa North: South Central US; South India; Sweden Central; Switzerland North; UAE North; UK South; UK West: West Central US; West Europe; West US, West US3.<br/><br/> Discovery is done locally in the region.|
|What AWS regions are supported? | Asia Pacific (Mumbai); Asia Pacific (Singapore); Asia Pacific (Sydney); Asia Pacific (Tokyo); Canada (Central); Europe (Frankfurt); Europe (Ireland); Europe (London); Europe (Paris); South America (São Paulo); US East (Ohio); US East (N. Virginia); US West (N. California): US West (Oregon).<br/><br/> Discovery is done locally in the region.|
|Do I need to install an agent? | No, discovery is agentless.|
|What's the cost? | The feature is included with the Defender CSPM and Defender for Storage plans, and doesn’t include other costs except for the respective plan costs.|
|What permissions do I need to view/edit data sensitivity settings? | You need one of these Azure Active directory roles: Global Administrator,  Compliance Administrator, Compliance Data Administrator, Security Administrator, Security Operator.|

## Configuring data sensitivity settings

The main steps for configuring data sensitivity setting include:
- [Import custom sensitive info types/labels from Microsoft Purview compliance portal](data-sensitivity-settings.md#import-custom-sensitive-info-typeslabels)
- [Customize sensitive data categories/types](data-sensitivity-settings.md#customize-sensitive-data-categoriestypes)
- [Set the threshold for sensitivity labels](data-sensitivity-settings.md#set-the-threshold-for-sensitive-data-labels)

[Learn more](/microsoft-365/compliance/create-sensitivity-labels) about sensitivity labels in Microsoft Purview.

## Discovery

Defender for Cloud starts discovering data immediately after enabling a plan, or after turning on the feature in plans that are already running.

- It takes up to 24 hours to see the results for a first-time discovery.
- After files are updated in the discovered resources, data is refreshed within eight days.
- A new Azure storage account that's added to an already discovered subscription is discovered within 24 hours or less.
- A new AWS S3 bucket that's added to an already discovered AWS account is discovered within 48 hours or less.

### Discovering AWS S3 buckets

In order to protect AWS resources in Defender for Cloud, you set up an AWS connector, using a CloudFormation template to onboard the AWS account.

- To discover AWS data resources, Defender for Cloud updates the CloudFormation template.
- The CloudFormation template creates a new role in AWS IAM, to allow permission for the Defender for Cloud scanner to access data in the S3 buckets.
- To connect AWS accounts, you need Administrator permissions on the account.
- The role allows these permissions: S3 read only; KMS decrypt.

## Exposed to the internet/allows public access

Defender CSPM attack paths and cloud security graph insights include information about storage resources that are exposed to the internet and allow public access. The following table provides more details.

**State** | **Azure storage accounts** | **AWS S3 Buckets**
--- | --- | ---
**Exposed to the internet** | An Azure storage account is considered exposed to the internet if either of these settings enabled:<br/><br/> Storage_account_name > **Networking** > **Public network access** > **Enabled from all networks**<br/><br/> or<br/><br/>  Storage_account_name > **Networking** > **Public network access** > **Enable from selected virtual networks and IP addresses**. | An AWS S3 bucket is considered exposed to the internet if the AWS account/AWS S3 bucket policies don't have a condition set for IP addresses.
**Allows public access** | An Azure storage account container is considered as allowing public access if these settings are enabled on the storage account:<br/><br/> Storage_account_name > **Configuration** > **Allow blob public access** > **Enabled**.<br/><br/>and **either** of these settings:<br/><br/> Storage_account_name > **Containers** > container_name > **Public access level** set to **Blob (anonymous read access for blobs only)**<br/><br/> Or, storage_account_name > **Containers** > container_name > **Public access level** set to **Container (anonymous read access for containers and blobs)**. | An AWS S3 bucket is considered to allow public access if both the AWS account and the AWS S3 bucket have **Block all public access** set to **Off**, and **either** of these settings is set:<br/><br/> In the policy, **RestrictPublicBuckets** isn't enabled, and the **Principal** setting is set to * and **Effect** is set to **Allow**.<br/><br/> Or, in the access control list, **IgnorePublicAcl** isn't enabled, and permission is allowed for **Everyone**, or for **Authenticated users**.


## Next steps

[Enable](data-security-posture-enable.md) data-aware security posture.


