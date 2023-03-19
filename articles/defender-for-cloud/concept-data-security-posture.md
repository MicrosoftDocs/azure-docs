---
title: Data-aware security posture in Microsoft Defender for Cloud
description: Learn how Defender for Cloud helps improve data security posture in a multi-cloud environment.
author: bmansheim
ms.author: benmansheim
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 03/09/2023
---
# Data-aware security posture (preview)

As digital transformation accelerates in response to market shifts, cloud adoption, and remote working practices, organizations are moving from traditional on-premises environments to multi-cloud architectures. In response, security teams are shifting technologies, processes, and operations from traditional network perimeter-based security to asset-based security controls. Data is a critical business asset that's moving to the cloud at an exponential rate using multiple data stores such as object stores and managed/hosted databases. Business risk frameworks must account for increasing data threats, growing attack surfaces, and increasing risks of data asset loss or compromise.

Data-aware security posture in Microsoft Defender for Cloud aims to proactively protect data and reduce risk, and respond to data breaches. Using data-aware security posture you can:

- Automatically discover sensitive data resources across multiple clouds.
- Evaluate data sensitivity, who's accessing data, and how data flows across the organization.
- Continuously uncover risks that might lead to data breaches.
- Detect suspicious activities that might indicate ongoing threats to sensitive data resources.

## What's supported

**Support** | **Details**
--- | ---
What Defender for Cloud plans support data-aware security? | Defender for Storage v2<br/><br/> Defender for CSPM<br/><br/> [Help me](#which-plan-should-I-use.md) to choose a plan.
What data resources can I scan? | Azure storage accounts (v1/v2), including storage containers<br/><br/> AWS S3 buckets<br/><br/> Behind a private network you can scan blob storage accounts (no specific configuration required).
What file types are supported? | All the following file types (no partial selection):.doc, .docm, .docx, .dot, .odp, .ods, .odt, .pdf, .pot, .pps, .ppsx, .ppt, .pptm, .pptx, .xlc, .xls, .xlsb, .xlsm, .xlsx, .xlt.,.cvs, .json, .psv, .ssv, .tsv, .txt., xml, .parquet, .avro, .orc
What Azure regions are supported? | You can scan Azure storage accounts in: Australia Central; Australia Central 2 ; Australia East; Australia Southeast; Brazil South; Canada Central; Canada East ; Central India; Central U; East Asia; East US; East US 2; France Central; Japan East; Japan West: Jio India West: North Central US; North Europe; Norway East; South Africa North: South Center US; South India: Sweden Central; Switzerland North; UAE North; UK South; UK West: West Centra US; West Europe; West US, West US3.<br/><br/> Scanning is done locally in the region.
What AWS regions are supported? | US East (Ohio); US East (N Virginia); US West (N. California): US West (Oregon); Europe (Frankfurt); Europe (Ireland); Europe (London); Europe (Paris); Asia Pacific (Tokyo); Asia Pacific (Singapore); Asia Pacific (Sydney).<br/><br/> Scanning is done locally in the region.
Do I need to install an agent? | No, scanning is agentless.
What's the cost? | The feature is included with each plan and doesn’t include additional costs outside the respective plan costs.

## Which plan should I choose?

**Feature** | **Defender for CSPM** | **Defender for Storage v2**
--- | --- | ---
Define sensitivity settings in Defender for Cloud | Y | Y
Integrate sensitive data types defined in Microsoft Purview | Y | Y
Integrate Microsoft Purview sensitivity labels | Y | Y
Automatically discover sensitive data | Y | Y
Improve security posture using Cloud Security Explorer and Attack Path | Y | N
Identify threats with Defender for Cloud security alerts | N | Y

## Turning the feature on

Data-aware security posture is available in both supported plans at the subscription level. That means it’s not available at storage-level in the Defender for Storage plan.

- When a new plan is onboarded, data-aware security posture is turned on by default.
- If you have existing plans running, the feature will be available but turned off by default. After the feature is released, existing plan status will show as “Partial” rather than “Full” until the feature is turned on.
- You can turn the feature on and off manually for a plan.

Note that:

- In addition to turning on the feature in a plan, the feature needs to be enabled for a specific subscription.
- Since the feature is at subscription level, turning it on and off will turn the feature on/off in both plans. It’s important to note that this doesn’t turn on the plan itself.
- Turning the feature on in one plan does not turn it on in the other plan. It’s enabled separately in each plan.

## Defining sensitive data

Data-aware security in Defender for Cloud automatically identifies resources containing sensitive data such as financial information, personally-identifiable information, and credentials. Defender for Cloud uses sensitive information types, and integrates with Microsoft Purview.

### Sensitive information types

Defender for Cloud uses sensitive information types to classify what data is sensitive. These types align to those provided by [Microsoft Purview](/microsoft-365/compliance/sensitive-information-type-learn-about?view=o365-worldwide).  Defender for Cloud turns some of these information types on by default. 
 
Sensitivity settings are set at the Azure tenant level, and apply to all subscriptions that have the relevant Defender for Cloud plans enabled.

You can modify default settings by turning off information types, or by creating custom types. Note that:
- To modify default sensitive information types, you need to either be an Azure subscription owner, or have these permissions:
    - Microsoft.Storage/storageAccounts/{read/write}
    - Microsoft.Authorization/roleAssignments/{read/write/delete}
- Detection for changes to sensitivity information types runs every seven days

### Additional Microsoft Purview information types

If you’re using Microsoft Purview, you can optionally add additional Purview information types to be used during scanning.

### Sensitivity labels

If you have Purview sensitivity labels that are automatically assigned to resources when conditions are met, you can turn on the the sensitivity label threshold setting in Defender for Cloud, and integrate those sensitivity labels into data-aware posture management. In order to use these labels you need:

- In the Microsoft Purview portal, you consented to use the labels in Defender for Cloud.
- One or more [sensitivity labels](/microsoft-365/compliance/sensitivity-labels?view=o365-worldwide) must be [created and defined](/microsoft-365/compliance/get-started-with-sensitivity-labels?view=o365-worldwide) in Microsoft Purview.
- The label must be configured to [apply to content automatically](/microsoft-365/compliance/apply-sensitivity-label-automatically?view=o365-worldwide).
- The labels must be [published](/microsoft-365/compliance/create-sensitivity-labels?view=o365-worldwide) with a label policy that’s in effect.

#### Things to note

- The labels appear in Defender for Cloud in the order ranking set in Microsoft Purview.
- The two sensitivity labels that are set to highest priority in Microsoft Purview are turned on by default in Defender for Cloud. You can turn labels on and off as needed.
- When you select a label in Defender for Cloud, any labels ranked above that label are turned on automatically.
- The labels are evaluated per-file and are stored as metadata in Defender for cloud. Defender for Cloud doesn’t move or modify files.

## Discovering and scanning

Defender for Cloud starts discovering resources and scanning data immediately after enabling a plan, or after turning on the feature in plans that are already running.

- After onboarding the feature, results appear in the Defender for Cloud portal within 24 hours. 
- After files are updated in the scanned resources, data is refreshed within 8 days.

### Scanning AWS storage

To protect AWS resources in Defender for Cloud, you set up an AWS connector, using a CloudFormation template to onboard the AWS account. For automatic discovery of AWS resources containing sensitive data, Defender for Cloud updates the CloudFormation template used to connect to AWS.

The CloudFormation template creates a new role in AWS IAM, to allow permission for the Defender for Cloud scanner to access data in the S3 buckets. Note that:

- To connect AWS accounts, you need Administrator permissions on the account.
- The role allows these permissions: S3 read only; KMS decrypt.
- Defender for Cloud can discover data encrypted by KMB, but it can’t discover data that’s encrypted with a customer key.
- As part of the deployment Defender for Cloud suggested the AWS Role ARNs to be created. You can modify that if needed.

### Scanning with smart sampling

Defender for Cloud uses smart sampling to scan a selected number of files in your cloud datastores. Based on the sensitive data settings you configure for the Azure tenant, the results provide an accurate assessment of where sensitive data is stored while saving on scanning costs and time.

## Evaluating security posture

Data-aware security posture management automatically and continuously discovers data resources across clouds. You can query Cloud Security Graph using Cloud Security Explorer, to determine where data is stored, who can access it, and how it flows across the organization.

After data is discovered, you can start to investigate, evaluate, and improve your data security posture using a couple of investigation methods.

**Investigation method** | **Details** | **Plan**
--- | --- | ---
Cloud Security Graph/Cloud Security Explorer | Find misconfigured storage data storage resources that contain sensitive data, or that are publicly accessible. | Defender for CSPM
Attack Paths | There are some specific attack paths that help you to find misconfigured sensitive data. | Defender for CSPM

### Cloud Security Explorer/Cloud Security Graph

by querying different types of data resources, their network, access controls, and configured data flows security attributes.


In Cloud Security Explorer, you run queries to identify security posture and risk across your cloud environment.

You query assets and drill down into sensitive data findings. You can query by data resources and data types such as storage accounts. You can then further filter to find resources containing sensitive data.

Cloud Security Explorer provides these insights.

**Insight** | **Description** | **Support**
--- | --- |---
Exposed to the internet | Indicates that a resource is open to the internet. Supports port filtering. | Compute: Azure VM, AWS EC2<br/><br/>Storage: Azure storage account, AWS S3 bucket<br/><br/>	Database: Azure SQL Server, Azure Cosmos DB (running on VM)<br/><br/> Containers: Kubernetes pod
Contains sensitive data | Indicates a resource that contains sensitive data, based on configured sensitivity settings. | Azure storage account<br/><br/> AWS S3 bucket<br/><br/> Azure SQL Server (running on VM)
Has tags | Lists the resource tags for the resource | All Azure and all AWS resources
Installed software | Lists software installed on a machine. | Only applicable for VMs that are connected to and protected by Defender for Cloud | 
Allows public access | Indicate that public read access to the data store is allowed without authorization controls. | Azure storage account, AWS S3 bucket
Doesn't have multi-factor authentication (MFA) enabled | Indicates that a user account with access to the resource does not have MFA enabled. | Azure Active Directory user account, IAM user.

#### Example

Example: Query to get a list of AWS S3 buckets that have sensitive data and are exposed to the internet using these conditions to check if a bucket is considered public:

- If RestrictPublicBuckets isn’t enabled at the account level.
- If RestrictPublicBuckets isn’t enabled at the bucket level
- Either:
    - The IP range is wider \8.
    - Buckets doesn't have a bucket policy.
    - Buckets has a bucket policy without a condition.
    - Bucket has a bucket policy without a condition based on IP address.

### Attack paths

Attack paths help you to address posture issues that pose immediate risks by analyzing potential attack paths that could be used to breach your environment. Recommendations show you how to mitigate the risks.

Data-aware security posture provides some specific attack paths. You can drill down into each path for more details and recommendations.

**Area** | **Path name** | **Details**
--- | --- | ---
Azure data | Internet exposed Azure storage container with sensitive data is publicly accessible.
Azure data | VM has high severity vulnerabilities and read permissions to a data store with sensitive data
AWS data | Internet exposed EC2 instance has high severity vulnerabilities and read permission to an S3 bucket with sensitive data
AWS data | Internet exposed Azure Storage container with sensitive data is publicly accessible

You can review attack paths with the Sensitive Data Exposure category. Drill down into each attack path to get information about affected resources, and review remediation steps. Steps might include manual processes or acting on Defender for Cloud recommendations.

## Monitor data threats 

Defender for Storage monitors Azure Storage account activities with advanced threat detection capabilities for sensitive data. It identifies harmful attempts to access or exploit data, and suspicious configuration changes that might lead to a data breach.

When early signs are detected, the Defender for Storage generates a security alert, which allows security teams to quickly respond and mitigate.



## Next steps

[Set up](data-security-posture-enable.md) data-aware security posture management

