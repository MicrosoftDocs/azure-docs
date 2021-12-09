---
title: Microsoft CloudKnox Permissions Management Permissions Analytics report
description: How to use the Microsoft CloudKnox Permissions ManagementPermissions Analytics report.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/09/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management Permissions Analytics report

This topic describes how to use the Permissions Analytics report in Microsoft CloudKnox Permissions Management.

> [!NOTE] This topic applies only to Amazon Web Services (AWS) users.

## How to use the Permissions Analytics report 

1. From the **Systems Reports** tab, under **Report Name**, click **Permissions Analytics Report**.
2. To view the Privilege Creep Index and Identities statistics, click the right caret icon next to **Summary**. 

    Or, under the **Findings** column on the left, click **Summary**.

	> [!NOTE]
    > The summary only appears for one authorization system at a time. If you select more than one authorization system, CloudKnox does not display a summary.

3. Click the right caret icon next to one of the following categories.

    Or, select the required category under the **Findings** column.

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
		- Hygiene: Unised IAM Access Keys 
		- Exclude From Reports
			- Users
			- Roles
			- Resources
			- Serverless Functions
			- Groups
			- Security Groups
			- S3 Buckets

<!---Do we need to list all these options?--->
<!---Is Unised a typo?--->

4. View the following columns of information once a category has been selected:

	- User, Role, Resource, Serverless Function, etc. name - lists the name of the identity.
	- Authorization System - Displays the authorization system the identity belongs to.
	- Domain - Lists the domain name the identity belongs to.
	- Privileges - Lists the maximum number of privileges the identity has.
		- Used - Shows how many privileges the identity has used.
		- Granted - Shows how many privileges the identity has been granted.
	- PCI - Lists the privilege creep index score of the identity.
	- Date Last Active On - Lists the date the identity was last active.
	- Date Created On - Lists the date in which the identity was created.


## How to add and remove tags from the Permissions Analytics report

1. Click the **Tags** icon.

2. Click one of the categories from the **Permissions Analytics Report**.

     <!---For more information, see [How to use the Permissions Analytics Report](cloudknox-prod-reports.md#how-to-use-the-Permissions-Analytics-Report).--->

3. Select the identity name to which you want to add a tag. Then, select the checkbox at the top to select all identities.

4. Click the **Add Tag** icon with the plus sign at the top.

5. In the **Tag** column: 
    - To select from the available options from the list, click **Select a Tag**.
    - To search for a tag, enter the tag name.
    - To create a new custom tag, click  **New Custom Tag**.
    - To create a new tag, enter a name for the tag and click **Create**.
    - To remove a tag, click **Delete**.

6. In the **Value (optional)** box, enter a value, if required.

7. Click **Save**.
 
<!---## Next steps--->