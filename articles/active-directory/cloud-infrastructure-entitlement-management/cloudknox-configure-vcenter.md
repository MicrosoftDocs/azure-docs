---
title: Microsoft CloudKnox Permissions Management - Configure and collect data for VCenter  
description: How to configure and collect data for VCenter
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/10/2022
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - Configure and collect data for VCenter 

This topic describes the process of configuring and collecting data for VCenter.

## Configure Sentry 

1. To start the Sentry configuration, use the Secure Shell (SSH) to enter the VM.
2. To configure Sentry, run the following script:

    `sudo /opt/cloudknox/sentrysoftwareservice/bin/runSentryConfigCLI.sh`

3. Enter the email address from the CloudKnox console that generated the PIN.

    <!---Add link--->
4. Enter the PIN obtained in step 7 from the previous procedure.
5. When you see the following message about the network proxy in use for outbound connections, enter **Y** or **N**.

     **Is Network Proxy in use to connect outbound(y/n)**

6. Enter the following connection information to connect to VCenter:

   **Enter VCenter Server Name/IP Address:**

   **Enter Vcenter user name used to login:**

   **Enter Vcenter user password:**

   **Enter Y or N for connecting to LDAP:**

     **Do you use LDAP for authentication (y/n)?**

7. If you want to set up an LDAP connection, enter the following connection details:

     **Enter LDAP Server URL:**

     **Enter LDAP User Login or User Bind DN:**

     **Enter LDAP User Password:**

     **Enter LDAP Group Base DN:**

     You can view the data on the console after you've completed the configuration process and initial data collection and processing have run successfully.

## Start data collection

1. Log in to the [CloudKnox admin console](https://app.cloudknox.io/data-sources/data-collectors).
2. To display the CloudKnox **Settings** dashboard, select **Settings** (the gear icon) in the upper right of the screen.

    The **Settings** dashboard has three tabs:

    - **Data Collectors**
    - **Authorization Systems**
    - **Inventory**
3. Select **Authorization Systems**, and then select **VCenter**.

4. In the table, select the ellipses (**...**) on the right of the account information.
5. To collect and view the data currently being collected by CloudKnox Sentry, select **Collect Data**. 
    CloudKnox displays the following message: **Data collection restarted successfully.**

## Delete a VCenter account

1. Log in to the [CloudKnox admin console](https://app.cloudknox.io/data-sources/data-collectors).
2. To display the CloudKnox **Settings** dashboard, select **Settings** (the gear icon) in the upper right of the screen.

    The **Settings** dashboard has three tabs:

    - **Data Collectors**
    - **Authorization Systems**
    - **Inventory**
3. Select **Authorization Systems**, and then select **VCenter**.

4. In the table, select the ellipses (**...**) on the right of the account information.
5. To delete the account, select **Delete**. 
6. In the **Validate OTP To Delete Authorization System**, enter the OTP (One Time Passcode) sent to your email address.

    If you don't receive the email, select **Resend OTP**.
7. Select **Verify**.


<!---## Next steps--->
