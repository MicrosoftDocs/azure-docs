---
title: Microsoft CloudKnox Permissions Management - Add an authorization system for data collection
description: How to add an authorization system for data collection in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/26/2022
ms.author: v-ydequadros
---

# Add an authorization system for data collection

You can use the **Authorization system** dashboard in Microsoft CloudKnox Permissions Management (CloudKnox) to add an authorization system for data collection.

## Add an authorization system

1. Select the **Authorization system** tab.

   The **Authorization System** tab displays the following options:
    - **AWS** - Displays an Amazon Web Services (AWS) account.
    - **Azure** - Displays a Microsoft Azure subscription.
    - **GCP** - Displays a Google Cloud Platform (GCP) project.
    - **vCenter** - Displays the vCenter instance.

2. Select **AWS**, **Azure**, **GCP**, or **VCENTER**.

3. Apply filters to the authorization system using the following dropdown menus from the top of the screen and select **Apply** once selected:
    - **Controller Status** - Select **All**, **Enabled**, or **Disabled**.
    - **Benchmark Status** - **Controller Status** - Select **All**, **Enabled**, or **Disabled**.
    - **Entitlement Status** - **Controller Status** - Select **All**, **Enabled**, or **Disabled**. **All**, **Online**, or **Offline**.
    - **Enter a Name or ID** - Use this box to enter a specific name or ID to apply the filter, if necessary.

4. View the following details for each authorization system:
     - **Name** - Displays the name of the authorization system, if available. Otherwise, it will display the ID of the authorization system.
         - To access Account explorer, select the name or the ID. 
     - **ID** - Displays the identification number of the authorization system. It's a unique number that identifies a specific authorization system.
     - **Controller Status** - Displays either **Enabled** or **Disabled**.

      The **Controller status** indicates whether an administrator has given permission to CloudKnox to perform write operations for various features, such as privilege on demand, activity-based roles, or policy creation, etc.
     - **Benchmark Status** - The results of security best practices tests.
     - **Entitlement Status** - The permissions of all identities and resources for all the configured authentication systems. 

5. To perform the following actions, select the ellipses **(...)**:  

     - **Collect Data** - By default, the data is collected every hour. If you want to trigger data collection immediately, select this option.
     - **Delete** - Stops collecting and erasing collected data from an authorization system.

       The **Validate OTP to Delete Data Collector** box opens so you can ask for a one time passcode (OTP) to be sent to the email address on file.

       If you don't receive the email, select **Resend OTP** and then check your email again.

6. Enter the passcode from your email in the **Enter OTP** box and select **Verify**.

     > [!NOTE]
     > Deleting an authorization system erases all historical data for the authorization system. To avoid data loss, coordinate the deletion of the authorization system with the CloudKnox Customer Success team.

7. To display or hide columns, select **Columns**.

8. To view details about folders, select **Folders**.

    You can use folders to group and organize various authorization systems.  

     - **Folder Name** - Displays the name of the folder.
        - To expand details and view the **Authorization System Name** and **ID** included in the folder you've opened, select the **Folder Name**.

     - **Created On** - Displays the date and time the folder was created.
     - **Created By** - Displays the email address of the user who created the folder.
     - **Last Modified On** - Displays the date and time the folder was last modified.
     - **Last Modified By** - Displays the email address of the user who last modified the folder.

9. Select a folder name to disseminate reports to the authorization systems specified in the folder.

10. To add or remove an authorization system, select the ellipses **(...)**, then select **Edit**.

     - To add an authorization system to the folder, select the **Add** icon  next to the authorization system name in the **Available Authorization Systems** column.
     - To remove an authorization system from the folder, select the **Remove** icon next to the authorization system name in the **Selected Authorization Systems** column. Then select **Save**.
     - To delete an authorization system, select **Delete**.
        - A pop-up message displays asking you to confirm deletion. Select **Delete** to confirm the deletion or **Cancel** to cancel the action.

11. To hide any of the following columns, select **Columns**:
     - **Created On**
     - **Created By**
     - **Modified On**
     - **Modified By**

12. To add a new folder: 

     1. Select **Create Folder**, and then enter a name in the **New Folder Name** box.

     2. Select the **Add** icon next to the authorization system name in the **Available Authorization Systems** column, and then select **Save**.



## Next steps

- For information about viewing and configuring settings for collecting data from your authorization system and its associated accounts, see [View and configure settings for data collection](cloudknox-product-data-sources.md)
- For information about viewing an inventory of created resources and licensing information for your authorization systems, see [Display an inventory of  created resources and licenses for your authorization system](cloudknox-product-data-inventory.md)