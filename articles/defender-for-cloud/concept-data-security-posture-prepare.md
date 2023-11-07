---
title: Support and prerequisites for data-aware security posture
description: Learn about the requirements for data-aware security posture in Microsoft Defender for Cloud
author: dcurwin
ms.author: dacurwin
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 09/05/2023
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
- If sensitive data discovery is turned on, but Defender CSPM isn't enabled, only storage resources will be scanned.

## What's supported

The table summarizes support for data-aware posture management.

|**Support** | **Details**|
|--- | ---|
|What Azure data resources can I discover? | **Object storage:**<br /><br />[Block blob](../storage/blobs/storage-blobs-introduction.md) storage accounts in Azure Storage v1/v2<br/><br/> Azure Data Lake Storage Gen2<br/><br/>Storage accounts behind private networks are supported.<br/><br/>  Storage accounts encrypted with a customer-managed server-side key are supported.<br/><br/> Accounts aren't supported if any of these settings are enabled: [Public network access is disabled](../storage/common/storage-network-security.md#change-the-default-network-access-rule); Storage account is defined as [Azure DNS Zone](https://techcommunity.microsoft.com/t5/azure-storage-blog/public-preview-create-additional-5000-azure-storage-accounts/ba-p/3465466); The storage account endpoint has a [custom domain mapped to it](../storage/blobs/storage-custom-domain-name.md).<br /><br /><br />**Databases**<br /><br />Azure SQL Databases |
|What AWS data resources can I discover? | **Object storage:**<br /><br />AWS S3 buckets<br/><br/> Defender for Cloud can discover KMS-encrypted data, but not data encrypted with a customer-managed key.<br /><br />**Databases**<br /><br />Any flavor of RDS instances |
|What GCP data resources can I discover? | GCP storage buckets<br/> Standard Class<br/> Geo: region, dual region, multi region |
|What permissions do I need for discovery? | Storage account: Subscription Owner<br/> **or**<br/> `Microsoft.Authorization/roleAssignments/*` (read, write, delete) **and** `Microsoft.Security/pricings/*` (read, write, delete) **and** `Microsoft.Security/pricings/SecurityOperators` (read, write)<br/><br/> Amazon S3 buckets  and RDS instances: AWS account permission to run Cloud Formation (to create a role). <br/><br/>GCP storage buckets: Google account permission to run script (to create a role). |
|What file types are supported for sensitive data discovery? | Supported file types (you can't select a subset) - .doc, .docm, .docx, .dot, .gz, .odp, .ods, .odt, .pdf, .pot, .pps, .ppsx, .ppt, .pptm, .pptx, .xlc, .xls, .xlsb, .xlsm, .xlsx, .xlt, .csv, .json, .psv, .ssv, .tsv, .txt., xml, .parquet, .avro, .orc.|
|What Azure regions are supported? | You can discover Azure storage accounts in:<br/><br/> Australia Central; Australia Central 2; Australia East; Australia Southeast; Brazil South; Canada Central; Canada East; Central India; Central US; East Asia; East US; East US 2; France Central; Germany West Central; Japan East; Japan West: Jio India West: North Central US; North Europe; Norway East; South Africa North: South Central US; South India; Sweden Central; Switzerland North; UAE North; UK South; UK West: West Central US; West Europe; West US, West US3.<br/><br/> You can discover Azure SQL Databases in any region where Defender CSPM and Azure SQL Databases are supported. |
|What AWS regions are supported? | S3:<br /><br />Asia Pacific (Mumbai); Asia Pacific (Singapore); Asia Pacific (Sydney); Asia Pacific (Tokyo); Canada (Montreal); Europe (Frankfurt); Europe (Ireland); Europe (London); Europe (Paris); Europe (Stockholm); South America (São Paulo); US East (Ohio); US East (N. Virginia); US West (N. California): US West (Oregon).<br/><br/><br />RDS:<br /><br />Africa (Capetown); Asia Pacific (Hong Kong SAR); Asia Pacific (Hyderabad); Asia Pacific (Melbourne); Asia Pacific (Mumbai); Asia Pacific (Osaka); Asia Pacific (Seoul); Asia Pacific (Singapore); Asia Pacific (Sydney); Asia Pacific (Tokyo); Canada (Central); Europe (Frankfurt); Europe (Ireland); Europe (London); Europe (Paris); Europe (Stockholm); Europe (Zurich); Middle East (UAE); South America (São Paulo); US East (Ohio); US East (N. Virginia); US West (N. California): US West (Oregon).<br /><br /> Discovery is done locally within the region. |
|What GCP regions are supported? | europe-west1, us-east1, us-west1, us-central1, us-east4, asia-south1, northamerica-northeast1|
|Do I need to install an agent? | No, discovery requires no agent installation. |
|What's the cost? | The feature is included with the Defender CSPM and Defender for Storage plans, and doesn’t incur additional costs except for the respective plan costs. |
|What permissions do I need to view/edit data sensitivity settings? | You need one of these Microsoft Entra roles: Global Administrator,  Compliance Administrator, Compliance Data Administrator, Security Administrator, Security Operator.|
| What permissions do I need to perform onboarding? | You need one of these Microsoft Entra roles: Security Admin, Contributor, Owner on the subscription level (where the GCP project/s reside in). For consuming the security findings: Security Reader, Security Admin, Reader, Contributor, Owner on the subscription level (where the GCP project/s reside). |

## Configuring data sensitivity settings

The main steps for configuring data sensitivity setting include:

- [Import custom sensitive info types/labels from Microsoft Purview compliance portal](data-sensitivity-settings.md#import-custom-sensitive-info-typeslabels)
- [Customize sensitive data categories/types](data-sensitivity-settings.md#customize-sensitive-data-categoriestypes)
- [Set the threshold for sensitivity labels](data-sensitivity-settings.md#set-the-threshold-for-sensitive-data-labels)

[Learn more](/microsoft-365/compliance/create-sensitivity-labels) about sensitivity labels in Microsoft Purview.

## Discovery

Defender for Cloud starts discovering data immediately after enabling a plan, or after turning on the feature in plans that are already running.

For object storage:

- It takes up to 24 hours to see the results for a first-time discovery.
- After files are updated in the discovered resources, data is refreshed within eight days.
- A new Azure storage account that's added to an already discovered subscription is discovered within 24 hours or less.
- A new AWS S3 bucket or GCP storage bucket that's added to an already discovered AWS account or Google account is discovered within 48 hours or less.

For databases:

- Databases are scanned on a weekly basis.
- For newly enabled subscriptions, results will appear within 24 hours.

### Discovering AWS S3 buckets

In order to protect AWS resources in Defender for Cloud, you set up an AWS connector, using a CloudFormation template to onboard the AWS account.

- To discover AWS data resources, Defender for Cloud updates the CloudFormation template.
- The CloudFormation template creates a new role in AWS IAM, to allow permission for the Defender for Cloud scanner to access data in the S3 buckets.
- To connect AWS accounts, you need Administrator permissions on the account.
- The role allows these permissions: S3 read only; KMS decrypt.

### Discovering AWS RDS instances

To protect AWS resources in Defender for Cloud, set up an AWS connector using a CloudFormation template to onboard the AWS account.

- To discover AWS RDS instances, Defender for Cloud updates the CloudFormation template.
- The CloudFormation template creates a new role in AWS IAM, to allow permission for the Defender for Cloud scanner to take the last available automated snapshot of your instance and bring it online in an isolated scanning environment within the same AWS region.
- To connect AWS accounts, you need Administrator permissions on the account.
- Automated snapshots need to be enabled on the relevant RDS Instances/Clusters.
- The role allows these permissions (review the CloudFormation template for exact definitions):
  - List all RDS DBs/clusters
  - Copy all DB/cluster snapshots
  - Delete/update DB/cluster snapshot with prefix *defenderfordatabases*
  - List all KMS keys
  - Use all KMS keys only for RDS on source account
  - Full control on all KMS keys with tag prefix *DefenderForDatabases*
  - Create alias for KMS keys

### Discovering GCP storage buckets

In order to protect GCP resources in Defender for Cloud, you can set up a Google connector using a script template to onboard the GCP account.

- To discover GCP storage buckets, Defender for Cloud updates the script template.
- The script template creates a new role in the Google account to allow permission for the Defender for Cloud scanner to access data in the GCP storage buckets.
- To connect Google accounts, you need Administrator permissions on the account.

## Exposed to the internet/allows public access

Defender CSPM attack paths and cloud security graph insights include information about storage resources that are exposed to the internet and allow public access. The following table provides more details.

**State** | **Azure storage accounts** | **AWS S3 Buckets** | **GCP Storage Buckets** |
--- | --- | --- | ---
**Exposed to the internet** | An Azure storage account is considered exposed to the internet if either of these settings enabled:<br/><br/> Storage_account_name > **Networking** > **Public network access** > **Enabled from all networks**<br/><br/> or<br/><br/>  Storage_account_name > **Networking** > **Public network access** > **Enable from selected virtual networks and IP addresses**. | An AWS S3 bucket is considered exposed to the internet if the AWS account/AWS S3 bucket policies don't have a condition set for IP addresses. | All GCP storage buckets are exposed to the internet by default. |
**Allows public access** | An Azure storage account container is considered as allowing public access if these settings are enabled on the storage account:<br/><br/> Storage_account_name > **Configuration** > **Allow blob public access** > **Enabled**.<br/><br/>and **either** of these settings:<br/><br/> Storage_account_name > **Containers** > container_name > **Public access level** set to **Blob (anonymous read access for blobs only)**<br/><br/> Or, storage_account_name > **Containers** > container_name > **Public access level** set to **Container (anonymous read access for containers and blobs)**. | An AWS S3 bucket is considered to allow public access if both the AWS account and the AWS S3 bucket have **Block all public access** set to **Off**, and **either** of these settings is set:<br/><br/> In the policy, **RestrictPublicBuckets** isn't enabled, and the **Principal** setting is set to * and **Effect** is set to **Allow**.<br/><br/> Or, in the access control list, **IgnorePublicAcl** isn't enabled, and permission is allowed for **Everyone**, or for **Authenticated users**. | A GCP storage bucket is considered to allow public access if: it has an IAM (Identity and Access Management) role that meets these criteria: <br/><br/> The role is granted to the principal **allUsers** or **allAuthenticatedUsers**. <br/><br/>The role has at least one storage permission that *isn't* **storage.buckets.create** or **storage.buckets.list**. Public access in GCP is called “Public to internet“.

Database resources don't allow public access but can still be exposed to the internet.

Internet exposure insights are available for the following resources:

Azure:

- Azure SQL server
- Azure Cosmos DB
- Azure SQL Managed Instance
- Azure MySQL Single Server
- Azure MySQL Flexible Server
- Azure PostgreSQL Single Server
- Azure PostgreSQL Flexible Server
- Azure MariaDB Single Server
- Synapse Workspace

AWS:

- RDS instance

> [!NOTE]
>
> - Exposure rules that include 0.0.0.0/0 are considered “excessively exposed”, meaning that they can be accessed from any public IP.
> - Azure resources with the exposure rule “0.0.0.0” are accessible from any resource in Azure (regardless of tenant or subscription).

## Next steps

[Enable](data-security-posture-enable.md) data-aware security posture.
