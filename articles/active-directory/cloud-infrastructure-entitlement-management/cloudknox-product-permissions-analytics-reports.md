---
title: Microsoft CloudKnox Permissions Management - The Permissions Analytics report
description: How to use the Permissions Analytics report in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/11/2022
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - The Permissions Analytics report

This topic describes how to use the **Permissions Analytics report** in Microsoft CloudKnox Permissions Management (CloudKnox).

> [!NOTE]
> This topic applies only to Amazon Web Services (AWS) users.

## View the Permissions Analytics report 

1. From the **Systems Reports** tab, under **Report Name**, select **Permissions Analytics Report**.
2. To view the Privilege Creep Index and Identities statistics, select the right arrow next to **Summary**. 

    Or, under the **Findings** column on the left, select **Summary**.

	> [!NOTE]
    > The summary only appears for one authorization system at a time. If you select more than one authorization system, CloudKnox does not display a summary.

3. Select the right arrow next to one of the following categories.

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
		- Hygiene: Unused IAM Access Keys
		- Exclude From Reports
			- Users
			- Roles
			- Resources
			- Serverless Functions
			- Groups
			- Security Groups
			- S3 Buckets

<!---Do we need to list all these options?--->

4. Select a category and view the following columns of information:

	- User, Role, Resource, Serverless Function name - Displays the name of the identity.
	- Authorization System - Displays the authorization system the identity belongs to.
	- Domain - Displays the domain name the identity belongs to.
	- Privileges - Displays the maximum number of privileges the identity has.
		- Used - Displays how many privileges the identity has used.
		- Granted - Displays how many privileges the identity has been granted.
	- PCI - Displays the privilege creep index score of the identity.
	- Date Last Active On - Displays the date the identity was last active.
	- Date Created On - Displays the date in which the identity was created.


## How to add and remove tags in the Permissions Analytics report

1. Select **Tags**.

2. Select one of the categories from the **Permissions Analytics Report**.

     <!---For more information, see [How to use the Permissions Analytics Report](cloudknox-prod-reports.md#how-to-use-the-Permissions-Analytics-Report).--->

3. Select the identity name to which you want to add a tag. Then, select the checkbox at the top to select all identities.

4. Select **Add Tag**.

5. In the **Tag** column: 
    - To select from the available options from the list, select **Select a Tag**.
    - To search for a tag, enter the tag name.
    - To create a new custom tag, select  **New Custom Tag**.
    - To create a new tag, enter a name for the tag and select **Create**.
    - To remove a tag, select **Delete**.

6. In the **Value (optional)** box, enter a value, if necessary.

7. Select **Save**.
 
<!---## Next steps--->