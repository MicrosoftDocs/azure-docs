---
title: Microsoft CloudKnox Permissions Management product data sources
description: How to use Microsoft CloudKnox Permissions Management's Data Sources page to collect Authorization System data.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/07/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management product data sources

Microsoft CloudKnox Permissions Management's **Data Sources** page collects data associated with each authorization system and associated accounts. It also provides specific information related to data types, including entitlements and benchmarks.

## How to use the Data Collectors tab

1. To access the data sources, at the top of the main application page, click the **Settings** icon.

2. On the **Data Collectors** tab, each authorization system is listed with the following details.
(*Data collector* may also be referred to as *Sentry*.)

     - **ID** - Displays the data collector identification number. It is a unique number that identifies a specific data collector.
     - **IP Address** - Displays the specific Internet Protocol (IP) address or Domain Name System (DNS) name for the data collector.
     - **Data Types** - There are two data types that are collected:
         - **Entitlements -** The permissions of all identities and resources for all the configured authentication systems.
         - **Benchmarks -** The results of security best practices tests.
     - **Recently Uploaded On** - Displays whether the entitlement and benchmark data are being collected. 

     The status displays *ONLINE* if the data collection has no errors and *OFFLINE* if there are errors.
     - **Recently Transformed On** - Displays whether the entitlement and benchmark data are being processed.

      The status displays *ONLINE* if the data processing has no errors and *OFFLINE* if there are errors.

3. To perform the following actions, click the ellipses **(...)**:
     - **Configure** - Opens the **Sentry Appliance Configuration** box.
       1. To configure the appliance, click the displayed URL. 
       2. To configure the Sentry Appliance, enter the **REGISTERED EMAIL** and **PIN** .
     - **Delete** - If there are no authorization systems associated with the data collector, perform the following steps:
         1. To ask for a one-time passcode (OTP) to be sent to the email address on file, click the **Validate OTP to Delete Data Collector** box.
         
            If you do not receive the email, click **Resend OTP** and then check your email again.
         2. In the **Enter OTP** box, enter the passcode you received in your email, and then click **Verify**. 

        3. If there are one or more authorization systems associated with the data collector, delete the authorization system first. 

         > [!NOTE]
         > Deleting a data collector erases all historical data for the authorization systems associated with the collector. To avoid any data loss, coordinate deletion of data collectors with the CloudKnox Customer Success team.

4. To locate the data collector by ID or IP address, click **Search**.

5. To filter by **Uploaded On** and **Transformed On**, click **Filter** .
    - From the dropdown menus, select **Online** or **Offline**.

6. To hide **Recently Uploaded On** or **Recently Transformed On**, click **Columns**.

### How to use the Deploy button on the Data Collector page

1. Click **Deploy**.

2. Click **Using Sentry Appliance**.

3. For instructions on how to deploy a data source, click the link in the **Follow the instructions here to deploy** message.

4. Click **Next**.

5. In the **Enter Appliance DNS Name or IP** box, enter a name or IP address.

6. Click **Next**.

7. For information on how to link the appliance, click the URL.

8. Click **Configure Appliance**.

### How to deploy a data source using an Amazon Web Services (AWS) role

> [!NOTE]
> Deployment using an AWS role is not generally available. If you want to deploy using an AWS role, contact the CloudKnox Customer Success team.

1. Click **Deploy**.

2. Click **Using AWS Role**.

3. In the **Sentry Appliance Deployment** section, enter the name in the **Role Name** box.

4. In the **Enter Account ID** box, enter the AWS Account ID.

5. Click **Next**.

6. When the **Do you have a centralized CloudTrail account?** message appears, select **Yes** or **No**. 
     - If you select **Yes**, enter **CloudTrail Logging Account Id** and **Account Role Name** in the boxes.
     - If you select **No**, follow the instructions to download the CloudFormation template.

7. Click **Next**.

8. Check your email for a confirmation from CloudKnox that the data collection has started successfully.

9. Click **Done**.

## How to use the Authorization Systems tab

1. Click the **Authorization System** tab.

   The **Authorization System** tab displays the following options:
    - **AWS** - Displays an Amazon Web Services (AWS) account.
    - **Azure** - Displays a Microsoft Azure subscription.
    - **GCP** - Displays a Google Cloud Platform (GCP) project.
    - **vCenter** - Displays the vCenter instance.

2. Select **AWS**, **Azure**, **GCP**, or **VCENTER**.

3. Apply filters to the authorization system using the following dropdown menus from the top of the screen and clicking **Apply** once selected:
    - **Controller Status** - Select **All**, **Enabled**, or **Disabled**.
    - **Benchmark Status** - **Controller Status** - Select **All**, **Enabled**, or **Disabled**.
    - **Entitlement Status** - **Controller Status** - Select **All**, **Enabled**, or **Disabled**. **All**, **Online**, or **Offline**.
    - **Enter a Name or ID** - Use this box to enter a specific name or ID to apply the filter, if required.

4. View the following details for each authorization system:
     - **Name** - Displays the name of the authorization system, if available. Otherwise, it will display the ID of the authorization system.
         - To access Account explorer, click the name or the ID. 
     - **ID** - Displays the identification number of the authorization system. It is a unique number that identifies a specific authorization system.
     - **Controller Status** - Displays either **Enabled** or **Disabled**.

      The **Controller status** indicates whether an administrator has given permission to CloudKnox to perform write operations for various features, such as privilege on demand, activity-based roles, or policy creation, etc.
     - **Benchmark Status** - The results of security best practices tests.
     - **Entitlement Status** - The permissions of all identities and resources for all the configured authentication systems. 

5. To perform the following actions, click the ellipses **(...)**:  

     - **Collect Data** - By default, the data is collected every hour. If you want to trigger data collection immediately, click this option.
     - **Delete** - Stops collecting and erasing collected data from an authorization system.

       The **Validate OTP to Delete Data Collector** box opens so you can ask for a one time passcode (OTP) to be sent to the email address on file.

       If you do not receive the email, click **Resend OTP** and then check your email again.

6. Enter the passcode from your email in the **Enter OTP** box and click **Verify**.

     > [!NOTE]
     > Deleting an authorization system erases all historical data for the authorization system. To avoid data loss, coordinate the deletion of the authorization system with the CloudKnox Customer Success team.

7. To display or hide columns, click **Columns**.

8. To view details about folders, click **Folders**.

    You can use folders to group and organize various authorization systems.  

     - **Folder Name** - Displays the name of the folder.
        - To expand details and view the **Authorization System Name** and **ID** included in the folder you've opened, click the **Folder Name**.

     - **Created On** - Displays the date and time the folder was created.
     - **Created By** - Displays the email address of the user who created the folder.
     - **Last Modified On** - Displays the date and time the folder was last modified.
     - **Last Modified By** - Displays the email address of the user who last modified the folder.

9. Select a folder name to disseminate reports to the authorization systems specified in the folder.

10. To add or remove an authorization system, click the ellipses **(...)**, then click **Edit**.

     - To add an authorization system to the folder, click the **Add** icon  next to the authorization system name in the **Available Authorization Systems** column.
     - To remove an authorization system from the folder, click the **Remove** icon next to the authorization system name in the **Selected Authorization Systems** column. Then click **Save**.
     - To delete an authorization system, click **Delete**.
        - A pop-up message displays asking you to confirm deletion. Click **Delete** to confirm the deletion or **Cancel** to cancel the action.

11. To hide any of the following columns, click **Columns**:
     - **Created On**
     - **Created By**
     - **Modified On**
     - **Modified By**

12. To add a new folder: 

     1. Click **Create Folder**, and then enter a name in the **New Folder Name** box.

     2. Click the **Add** icon next to the authorization system name in the **Available Authorization Systems** column, and then click **Save**.

## How to view the Inventory tab

1. To view the resources created for the authorization systems, click the **Inventory** tab. 

2. To view the number of licenses associated with each authorization system, click the **Licensing** tab.

     AWS, Azure, GCP, and VCENTER each list their own authorization systems with the total number of licenses associated with each system.

<!---## Next steps--->