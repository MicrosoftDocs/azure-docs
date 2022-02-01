---
title: Generate and download the Permissions analytics report in Microsoft CloudKnox Permissions Management 
description: How to generate and download the Permissions analytics report in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/31/2022
ms.author: v-ydequadros
---

# Generate and download the Permissions analytics report

This article describes how to generate and download the **Permissions analytics report** in Microsoft CloudKnox Permissions Management (CloudKnox).

> [!NOTE]
> This topic applies only to Amazon Web Services (AWS) users.

## Generate the Permissions analytics report 

1. In the CloudKnox home page, select the **Reports** tab, and then select the **Systems reports** subtab.
    The **Systems Reports** subtab displays the following options in the **Reports** table:

    - **Report Name** — The name of the report.
    - **Category** — The type of report: **Permission** or **Compliance**.
    - **Authorization System** — The authorization system in which you can view the report: Amazon Web Services (**AWS**), Microsoft Azure (**Azure**), or Google Cloud Platform (**GCP**).
    - **Format** — The format of the report.
    
1. In the **Report Name** table, find **Permissions analytics report**, and then select the down arrow to the right of the report name to download the report.

    The following message displays: **Successfully started to generate on-demand report.

	> [!NOTE]
    > If you select one authorization system, the report includes a summary. If you select more than one authorization system, the report does not include a summary.

1. For detailed information, select the right arrow next to one of the following categories. Or, select the required category under the **Findings** column.

	- **AWS**
		- Inactive Identities
			- Users
			- Roles
			- Resources
			- Serverless Functions
		- Inactive Groups
		- Super Identities
			- Users
			- Roles
			- Resources
			- Serverless Functions
		- Over-Provisioned Active Identities
			- Users
			- Roles
			- Resources
			- Serverless Functions
		- PCI Distribution
		- Privilege Escalation
			- Users
			- Roles
			- Resources
		- S3 Bucket Encryption
			- Unencrypted Buckets
			- SSE-S3 Buckets
		- S3 Buckets Accessible Externally
		- EC2 S3 Buckets Accessibility
		- Open Security Groups
		- Identities That Can Administer Security Tools
			- Users
			- Roles
			- Resources
			- Serverless Functions
		- Identities That Can Access Secret Information
			- Users
			- Roles
			- Resources
			- Serverless Functions
		- Cross-Account Access
			- External Accounts
			- Roles That Allow All Identities
		- Hygiene: MFA Enforcement
		- Hygiene: IAM Access Key Age
		- Hygiene: Unused IAM Access Keys
		- Exclude From Reports
			- Users
			- Roles
			- Resources
			- Serverless Functions
			- Groups
			- Security Groups
			- S3 Buckets


1. Select a category and view the following columns of information:

	- **User**, **Role**, **Resource**, **Serverless function name** — Displays the name of the identity.
	- **Authorization system** — Displays the authorization system that the identity belongs to.
	- **Domain** — Displays the domain name that the identity belongs to.
	- **Permissions** — Displays the maximum number of permissions that the identity can be granted.
		- **Used** — Displays how many permissions that the identity has used.
		- **Granted** — Displays how many permissions that the identity has been granted.
	- **PCI** — Displays the permission creep index (PCI) score of the identity.
	- **Date last active on** — Displays the date that the identity was last active.
	- **Date created on** — Displays the date when the identity was created.



## Add and remove tags in the Permissions analytics report

1. Select **Tags**.
1. Select one of the categories from the **Permissions analytics report**.
1. Select the identity name to which you want to add a tag. Then, select the checkbox at the top to select all identities.
1. Select **Add tag**.
1. In the **tag** column: 
    - To select from the available options from the list, select **Select a tag**.
    - To search for a tag, enter the tag name.
    - To create a new custom tag, select  **New custom tag**.
    - To create a new tag, enter a name for the tag and select **Create**.
    - To remove a tag, select **Delete**.

1. In the **Value (optional)** box, enter a value, if necessary.
1. Select **Save**.
 
## Next steps

- For a brief overview of available system reports, see [View an overview of available system report types](cloudknox-product-reports.md).
- For a detailed overview of available system reports, see [View a list and description of system reports](cloudknox-all-reports.md).
- For information about how to generate and view a system report, see [Generate and view a system report](cloudknox-report-view-system-report.md).
- For information about how to create and view a custom report, see [Generate and view a custom report](cloudknox-report-create-custom-report.md).
