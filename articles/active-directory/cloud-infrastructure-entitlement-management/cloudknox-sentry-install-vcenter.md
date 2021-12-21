---
title: Microsoft CloudKnox Permissions Management Sentry installation - vCenter server 
description: How to install Microsoft CloudKnox Permissions Management Sentry on the VCenter server.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/20/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management Sentry installation on the vCenter server

This topic describes the deployment architecture and how to deploy and configure Microsoft CloudKnox Permissions Management Sentry on the VCenter server.

## Deployment architecture

The following image describes the deployment architecture.

<!---https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20AWS%20bef8e66cf2834aa69867b628f4b0a203/Untitled.png--->

## Deployment video

The following video demonstrates the deployment and configuration process.

<!---(https://s3-us-west-2.amazonaws.com/secure.notion-static.com/13ab40fb-800b-436c-b50d-35dd473b11e5/CloudKnoxSentry_Deploy_Config.mp4)--->

## Deploy Sentry on the vCenter server

1. Log in to the [CloudKnox admin console](https://app.cloudknox.io/data-sources/data-collectors).
2. To display the **Data Collectors** tab, select the gear icon. 
3. In the **VCenter** section, select **Deploy**.
4. Follow the instructions below to deploy Sentry in vCenter.

   1. Select the following settings:

      **VM specifications for Sentry**
      - CPU = 2vCPU
      - Memory = 8 GB
      - Disk = 12 GB

      **Network configuration**
      - Inbound access 9000 or 22 for one time configuration
      - Outbound 443 port

      **LDAP/AD configuration**
      - Read-only service account to your Lightweight Directory Access Protocol (LDAP) or  Azure Active Directory (AD) server.

      **vCenter configuration**
      - Service account for your vCenter
         - System.View
         - System.Anonymous
         - System.Read

   2. Add privileges for the Just Enough Privilege (JEP) Controller:
       - Administrative

   3. Add details for your network proxy server, if you're using one.
   4. If you're using a static IP for VM, you must get the IP address before you install Sentry.
   5. To create the Sentry VM, select: https://download.cloudknox.io/software/vcenter/cloudknox-sentry.ova.

        Or, download the OVA file and install Sentry in vCenter as VM using the downloaded OVA.

     > [!NOTE]
     > Make sure you deploy Sentry in vCenter with Flash-based vSphere.</p>The HTML5 vSphere interface doesn't display all the fields for IP settings. You may end up with DHCP even if you set static IP.

   6. Start the Sentry VM.

5. Select **Next**.
6. Enter the appliance DNS name or IP of the Sentry that you deployed in vCenter, and then select **Next**.
7. Make a note of the email and PIN. You'll need it when you configure the appliance,

## Configure Sentry

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
5. To enter the Sentry VM, enter the PIN generated in the Secure Shell (SSH).
6. Run the following script:

   `/opt/cloudknox/sentrysoftwareservice/bin/runSentryConfigCLI.sh`

<!---## Next steps--->