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

## Enabling data-aware security posture

Data-aware security posture is available in both supported plans at the subscription level. That means it’s not available at storage-level in the Defender for Storage plan.

- When a plan is enabled, data-aware security posture is turned on by default.
- If you have existing plans running, the feature will be available but turned off by default. After the feature is released, existing plan status will show as “Partial” rather than “Full” until the feature is turned on.
- You can turn the feature on and off manually for a plan.

Note that:

- In addition to turning on the feature in a plan, the feature needs to be enabled for a specific subscription.
- Since the feature is at subscription level, turning it on and off will turn the feature on/off in both plans. It’s important to note that this doesn’t turn on the plan itself.
- Turning the feature on in one plan does not turn it on in the other plan. It’s enabled separately in each plan.

## Which plan should I choose?

**Feature** | **Defender for CSPM** | **Defender for Storage v2**
--- | --- | ---
Define sensitivity settings in Defender for Cloud | Y | Y
Integrate sensitive data types defined in Microsoft Purview | Y | Y
Integrate Microsoft Purview sensitivity labels | Y | Y
Automatically discover sensitive data | Y | Y
Identify risk/improve data security posture using Cloud Security Explorer and Attack Path | Y | N
Identify data threats and breaches with Defender for Cloud security alerts | N | Y

## What's supported

The table summarizes support for data-aware posture management

**Support** | **Details**
--- | ---
What Defender for Cloud plans support data-aware security? | Defender for Storage v2<br/><br/> Defender for CSPM
What data resources can I scan? | Azure storage accounts (v1/v2)<br/><br/> AWS S3 buckets<br/><br/> Behind a private network you can scan blob storage accounts (no specific configuration required).
What file types are supported? | Supported file types (you can't select a subset):.doc, .docm, .docx, .dot, .odp, .ods, .odt, .pdf, .pot, .pps, .ppsx, .ppt, .pptm, .pptx, .xlc, .xls, .xlsb, .xlsm, .xlsx, .xlt.,.cvs, .json, .psv, .ssv, .tsv, .txt., xml, .parquet, .avro, .orc.
What Azure regions are supported? | You can scan Azure storage accounts in:<br/><br/> Australia Central; Australia Central 2 ; Australia East; Australia Southeast; Brazil South; Canada Central; Canada East ; Central India; Central U; East Asia; East US; East US 2; France Central; Japan East; Japan West: Jio India West: North Central US; North Europe; Norway East; South Africa North: South Center US; South India: Sweden Central; Switzerland North; UAE North; UK South; UK West: West Centra US; West Europe; West US, West US3.<br/><br/> Scanning is done locally in the region.
What AWS regions are supported? | US East (Ohio); US East (N Virginia); US West (N. California): US West (Oregon); Europe (Frankfurt); Europe (Ireland); Europe (London); Europe (Paris); Asia Pacific (Tokyo); Asia Pacific (Singapore); Asia Pacific (Sydney).<br/><br/> Scanning is done locally in the region.
Do I need to install an agent? | No, scanning is agentless.
What's the cost? | The feature is included with each plan, and doesn’t include additional costs outside the respective plan costs.

## Data sensitivity settings

Defender for Cloud provides sensitivity settings using sensitive information types that align to those provided by [Microsoft Purview](/microsoft-365/compliance/sensitive-information-type-learn-about). 

Sensitivity settings in Defender for Cloud are set at the Azure tenant level. Default sensitivity settings are applied to all subscriptions in the tenant when the [Defender for Cloud Security Posture Management (CSPM)](concept-cloud-security-posture-management.md) plan, or the Defender for Storage v2 plan is enabled.  

### Modifying sensitivity types

You can modify default sensitivity settings in a tenant by turning off default information types, or by creating custom types. Note that:

- To modify default sensitive information types you need to either be an Azure subscription owner, or to have these permissions:

    - Microsoft.Storage/storageAccounts/{read/write}
    - Microsoft.Authorization/roleAssignments/{read/write/delete}

- Detection for changes to sensitivity settings runs every seven days

### Microsoft Purview integration

If you’re using Microsoft Purview, you can optionally add additional Purview information types, or sensitivity labels, to be used during scanning.

If you're automatically assigning Microsoft Purview sensitivity labels to resources when specific conditions are met, you can turn on the the sensitivity label threshold setting in Defender for Cloud. This integrates Purview sensitivity labels into data-aware posture management, as long as you have the following:

- In the Microsoft Purview portal, you consented to use the labels in Defender for Cloud.
- One or more [sensitivity labels](/microsoft-365/compliance/sensitivity-labels?view=o365-worldwide) must be [created and defined](/microsoft-365/compliance/get-started-with-sensitivity-labels) in Microsoft Purview.
- The label must be configured to [apply to content automatically](/microsoft-365/compliance/apply-sensitivity-label-automatically).
- The labels must be [published](/microsoft-365/compliance/create-sensitivity-labels) with a label policy that’s in effect.

Note that:

- The labels appear in Defender for Cloud in the order ranking set in Microsoft Purview.
- The two sensitivity labels that are set to highest priority in Microsoft Purview are turned on by default in Defender for Cloud. You can turn labels on and off as needed.
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
- As part of the deployment Defender for Cloud suggested the AWS Role ARNs to be created. You can modify that if needed.


## Cloud Security Graph/Explorer insights

When Defender CSPM is enabled, you can run queries in cloud security explorer to identify security posture and risk across your cloud environment. You can query by data resource and data types such as storage accounts. You can then further filter and drill down into sensitive data findings.

Cloud Security Explorer provides these insights.

**Insight** | **Description** | **Support**
--- | --- |---
Exposed to the internet | Indicates that a resource is open to the internet. Supports port filtering. | Compute: Azure VM, AWS EC2<br/><br/>Storage: Azure storage account, AWS S3 bucket<br/><br/>	Database: Azure SQL Server, Azure Cosmos DB (running on VM)<br/><br/> Containers: Kubernetes pod
Contains sensitive data | Indicates a resource that contains sensitive data, based on configured sensitivity settings. | Azure storage account<br/><br/> AWS S3 bucket<br/><br/> Azure SQL Server (running on VM)
Has tags | Lists the resource tags for the resource | All Azure and all AWS resources
Installed software | Lists software installed on a machine. | Only applicable for VMs that are connected to and protected by Defender for Cloud | 
Allows public access | Indicate that public read access to the data store is allowed without authorization controls. | Azure storage account, AWS S3 bucket
Doesn't have multi-factor authentication (MFA) enabled | Indicates that a user account with access to the resource does not have MFA enabled. | Azure Active Directory user account, IAM user.

### Example

Example: Query to get a list of AWS S3 buckets that have sensitive data and are exposed to the internet using these conditions to check if a bucket is considered public:

- If RestrictPublicBuckets isn’t enabled at the account level.
- If RestrictPublicBuckets isn’t enabled at the bucket level
- Either:
    - The IP range is wider \8.
    - Buckets doesn't have a bucket policy.
    - Buckets has a bucket policy without a condition.
    - Bucket has a bucket policy without a condition based on IP address.

## Attack paths

Attack paths help you to address posture issues that pose immediate risks by analyzing potential attack paths that could be used to breach your environment. Recommendations show you how to mitigate the risks.

Data-aware security posture provides some specific attack paths. You can drill down into each path for more details and recommendations.

**Area** | **Path name** | **Details**
--- | --- | ---
Azure data | Internet exposed Azure storage container with sensitive data is publicly accessible.
Azure data | VM has high severity vulnerabilities and read permissions to a data store with sensitive data
AWS data | Internet exposed EC2 instance has high severity vulnerabilities and read permission to an S3 bucket with sensitive data
AWS data | Internet exposed Azure Storage container with sensitive data is publicly accessible

You can review attack paths with the Sensitive Data Exposure category. Drill down into each attack path to get information about affected resources, and review remediation steps. Steps might include manual processes or acting on Defender for Cloud recommendations.



## Next steps

[Set up](data-security-posture-enable.md) data-aware security posture management

