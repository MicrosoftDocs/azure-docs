---
title: Microsoft CloudKnox Permissions Management Autopilot
description: How to use Microsoft CloudKnox Permissions Management's Autopilot function to delete, modify, or update rules in batch mode.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/06/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management's Autopilot

Microsoft CloudKnox Permissions Management's Autopilot function allows administrators to delete, modify, or update in batch mode, including deleting unused roles, disabling access keys older than 90 days, etc. It is a multi-step process with the ability to apply or remove recommendations at a given time. AWS, Azure, and GCP each have one rule associated to where a new rule can be created. For more information on rules for each authorization system, see [How to create a new rule](cloudknox-prod-autopilot.md#how-to-create-a-new-rule).

## How to read the Autopilot dashboard

The autopilot dashboard provides a table of information about **Autopilot Rules**. If you are an administrator: 

- To view rule details by authorization system types, from the  drop down list in the upper right hand corner, select **AWS**, **Azure**, **GCP**, or **vCenter**. 
- To filter by authorization systems, click the **Authorization Systems** box in the upper right hand corner.
- To select the appropriate option from either the **List** or **Folders** section, click **Apply**. 
 
The following information is displayed in the table:

- **Rule Name** - Lists the name of the rule.
- **State** - Displays whether the rule is idle or active.
- **Rule Type** - Displays the type of rule being applied. 
- **Mode** - Displays if the mode is on-demand.
- **Last Generated** - Displays the date and time the rule was last generated.
- **Created By** - Displays the email address of the user who created the rule.
- **Last Modified** - Displays the date and time the rule was last modified.
- **Subscription** - Provides a toggle subscription (**On** or **Off**) which allows you to receive email notifications when recommendations have been generated, applied, or unapplied.

	Even if you aren't the original author of the rule, you can subscribe to a rule/recommendation and be notified of updates.

#### View and select available options

- To view available the following options, click the ellipses **(...)**.

  The following options display:
	 - **View Rule** - Displays the details of the rule.
     - **Delete Rule** - Deletes the rule. 

		 Only the user who created the selected rule can delete the rule. 
	- **Generate Recommendations** - Creates recommendations for each user and the authorization system.

		 Only the user who created the selected rule can create recommendations.
	- **View Recommendations** - Displays the recommendations for each user and authorization system.
	- **Notification Settings** - Displays the users subscribed to this rule.

		 Only the user who created the selected rule can add additional users to be notified.

## How to create a new rule

Each Authorization System (Amazon Web Services (AWS), Microsoft Azure (Azure), and Google Cloud Platform (GCP)) has the following rule associated with their service:

- **AWS** - **Delete Unused Roles** - This rule deletes any role that is not associated with any instance profile, is not a service-linked role, or is not a service role.

- **Azure** - **Remove Permissions for Unused Applications/Managed Identities** - This rule removes permissions from an application or managed identity that has at least one write permission granted.

- **GCP** - **Remove Permissions for Unused Service Accounts** - This rule removes permissions from a service account that has at least one permission granted, or is not a Google-managed service account.

**Create a new rule for AWS, Azure, or GCP**

1. In the upper right hand corner of the screen, click **New Rule**.

2. In the **Rule Name** box, enter a name for the rule.

3. Select the the appropriate authorization system, and then click **Next**. 

4. From the **Authorization Systems** tab, select the appropriate boxes or use **Search** to find the authorization system you want.

5. Click the **Configure** tab.

     Depending on which authorization system you selected, the options may differ. For example:

     **For AWS:**

 	 You cannot change information in the first and second boxes.
	 - From **Role Created On is**, select **30 Days**, **60 Days**, or **90 Days** from the third dropdown box in the row.
   	 - From **Role Last Used On is**, select **30 Days**, **60 Days**, or **90 Days** from the third dropdown box in the row.
	- From **Cross Account Role**, select **True** or **False** from the third dropdown box in the row.

	 **For Azure:**

     You cannot change information in the  first and second boxes. You also cannot change **Unused** and **Is**.
   	 - From the third dropdown box in the row, select **30 Days**, **60 Days**, or **90 Days**. 

	 **For GCP:**
	
     You cannot change information in the first and second boxes.
     - From the third dropdown box in the row, from **Cross Project**, select **True** or **False**.
	 - From the third dropdown box in the row, from **Unused**, select **30 Days**, **60 Days**, or **90 Days** .

7. Click the **Mode** tab and ensure that **On-Demand** is selected.

8. Click **Save**.

## How to view, apply, and remove (unapply) recommendations

1. In the **Rule Name** column, click the name of the rule.

2. The default view is the **Recommendations** tab. This tab displays roles that match the rule:

	 - **Roles** - Displays the names of the roles being recommended for this rule to apply to.
	 - **State** - Displays **Generated** to display the role was generated for the rule.
	 - **Authorization System** - Displays the authorization system the role belongs to.
	 - **Last Used** - Displays how many days ago the role was used, if used.
	 - **Created On** - Displays the date and time the role was created. 
	 - **Cross Account Role** - Indicates whether or not the role is a cross account role.

3. Filter the recommendations using the following boxes across the top of the screen:

	 - **Authorization System Type** - Select **AWS**, **Azure**, **GCP**, or **vCenter**.
	 - **Authorization Systems** - Check the specific authorization systems to apply filters for the recommendations.
	 - **State** - Select **All**, **Generated**, **Applied**, **Applying**, **Applying Failed**, **Unapplied**, **Unapplying**, or **Unapplying Failed**.

4. Click **Apply**.

5. To export the recommendations to email, in the top right hand side of the screen, click **Export**.

	 The following message displays in green across the top of the screen if the export is successful: **Recommendations Exported Successfully** .

6. Click the **Apply Recommendations** tab.

     Only the user who created the role has permission to apply the recommendation.

    1. To select all roles simultaneously, select the checkbox under **Roles**, or select individual roles from the list. Then click **Apply Recommendations**.
 
    2. The **Validate OTP to Create New Rule** box opens. Enter the OTP sent to the email address on file, and then click **Verify**.

9. Click the **Unapply Recommendations** tab.

	 Use this tab to unapply (undo) a recommendation. For example, if a role was accidentally deleted and you want to reactivate it. Only the user who created the role can unapply the recommendation.

    - To reactivate a role, select the role and then click **Create Role**.

	 

## Next steps

Links to come.