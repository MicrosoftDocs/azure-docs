---
title: Deploy RD Gateway role Windows Virtual Desktop - Azure
description: How to deploy the RD Gateway role in Windows Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 01/14/2021
ms.author: helohr
manager: lizross
---

# Deploy the RD Gateway role in Windows Virtual Desktop

This article will tell you how to deploy the Remote Desktop Gateway servers in your environment. You can install the server roles on physical machines or virtual machines, depending on whether you are creating an on-premises, cloud-based, or hybrid environment.

## Install the RD Gateway role

1. Sign into the target server with administrative credentials.

2. In **Server Manager**, select **Manage**, then select **Add Roles and Features**. The **Add Roles and Features** installer will open.

3. In **Before You Begin**, select **Next**.

4. In **Select Installation Type**, select **Role-Based or feature-based installation**, then select **Next**.

5. For **Select destination server**, select **Select a server from the server pool**. For **Server Pool**, select the name of your local computer. When you're done, select **Next**.

6. In **Select Server Roles** > **Roles**, select **Remote Desktop Services**. When you're done, select **Next**.

7. In **Remote Desktop Services**, select **Next.**

8. For **Select role services**, select only **Remote Desktop Gateway** When you're prompted to add required features, select **Add Features**. When you're done, select **Next**.

9. For **Network Policy and Access Services**, select **Next**.

10. For **Web Server Role (IIS)**, select **Next**.

11. For **Select role services**, select **Next**.

12. For **Confirm installation selections**, select **Install**. Don't close the installer while the installation process is happening.

## Configure RD Gateway role

Once the RD Gateway role is installed, you'll need to configure it.

To configure the RD Gateway role:

1. In **Server Manager**, select **Remote Desktop Services**.
    

    ![](media/64a5dbfe23103303d281e48457ef3878.png)

2. Open **RD Gateway Manager**.
    

    ![](media/5bc5f1221610e9870ebabf85c945ae93.png)

3 Open **Properties**. 
    

    ![](media/75989304f690e7ea0a1e36844eefc3b7.png)

4. For the **SSL Certificate**, select **Browse and Import Certificate…**.  
    

    ![](media/29c2f9348f4c30c5e389a2154e42722d.png)

5. Select the PFX file, then select **Open**.
    

    ![](media/ee1f24393085af311ad8b0ba01faa23e.png)

6. Enter the password for the PFX file when prompted.
    

    ![](media/e4dfa1ca563277458cb038fd7fcd2aac.png)

7. After you've imported the certificate and its private key, the display should show the certificate’s key attributes. 
    

    ![](media/1a0840e114ee8a287925f1fc152d2470.png)

>[!NOTE]
>Because the RD Gateway role is supposed to be public, we recommend you use a publicly issued certificate. If you use a privately issued certificate, you'll need to make sure to configure all clients with the certificate's trust chain beforehand.

## Next steps

If you want to add high availability to your RD Gateway role, follow the instructions for configuring the RD Gateway role in [Add high availability to the RD Web and Gateway web front](/windows-server/remote/remote-desktop-services/rds-rdweb-gateway-ha).