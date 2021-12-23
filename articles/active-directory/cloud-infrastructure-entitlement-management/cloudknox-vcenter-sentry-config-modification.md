---
title: Microsoft CloudKnox Permissions Management Sentry configuration of VCenter  
description: How to configure and reconfigure Microsoft CloudKnox Permissions Management Sentry VCenter
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/22/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management Sentry configuration of VCenter

This topic describes the process of configuring and reconfiguring Sentry for VCenter.

## The VCenter Sentry configuration

1. To start the Sentry configuration, use the Secure Shell (SSH) to enter the VM.
2. To configure Sentry, run the following script:

    `sudo /opt/cloudknox/sentrysoftwareservice/bin/runSentryConfigCLI.sh`

3. Enter the email address from the CloudKnox console that generated the PIN. (See step 7 from the previous procedure.)
4. Enter the PIN obtained in step 7 from the previous procedure.
5. When you see the following message about the network proxy in use for outbound connections, enter **Y** or **N**.

     **Is Network Proxy in use to connect outbound(y/n)**

6. Enter the following connection information to connect to VCenter:

   **Enter VCenter Server Name/IP Address:**

   **Enter Vcenter user name used to login:**

   **Enter Vcenter user password:**

   **Enter Y or N for connecting to LDAP:**

     **Do you use LDAP for authentication (y/n)?**

7. If an LDAP connection is necessary, enter the following connection details:

     **Enter LDAP Server URL:**

     **Enter LDAP User Login or User Bind DN:**

     **Enter LDAP User Password:**

     **Enter LDAP Group Base DN:**

     You can view the data on the console after configuration is completed and the initial data collection and processing have run successfully.

## Modify the VCenter Sentry configuration

1. Log in to the [CloudKnox admin console](https://app.cloudknox.io/data-sources/data-collectors).
2. Select **Dashboard**.
3. Select the ellipses (**...**) next to the VCenter status.
4. To view the data currently being collected by CloudKnox Sentry, select **Configure Sentry**. 
5. To enter the Sentry VM, enter the PIN that is generated in the Secure Shell (SSH) .
6. Run the following script: 

   `/opt/cloudknox/sentrysoftwareservice/bin/runSentryConfigCLI.sh`

<!---## Next steps--->
