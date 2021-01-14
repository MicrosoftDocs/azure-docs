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

2. In **Server Manager**, select **Manage**, and then select **Add Roles and Features**. The **Add Roles and Features** installer will open.

3. In **Before You Begin**, select **Next**.

4. In **Select Installation Type**, select **Role-Based or feature-based installation**, then select **Next**.

5. In **Select destination server**, ensure that **Select a server from the server pool** is selected. In **Server Pool**, ensure that the local computer is selected. Select **Next**.

6. In **Select Server Roles**, in **Roles**, select **Remote Desktop Services**, and then select **Next**.

7. In **Remote Desktop Services**, select **Next.**

8. In **Select role services**, select only **Remote Desktop Gateway** When you are prompted to add required features, select **Add Features**, and then select **Next**.

9. In **Network Policy and Access Services**, select **Next.**

10. In **Web Server Role (IIS)**, select **Next.**

11. In **Select role services**, select **Next.**

12. In **Confirm installation selections**, select **Install**. Do not close the wizard during the installation process.

At the end of the installation process, the RD Gateway role is installed but still needs to be configured.

## Configure RD Gateway role

- In **Server Manager**, select **Remote Desktop Services** in the leftmost navigation panel  
    

    ![](media/64a5dbfe23103303d281e48457ef3878.png)

- Open **RD Gateway Manager**  
    

    ![](media/5bc5f1221610e9870ebabf85c945ae93.png)

- Open **Properties**  
    

    ![](media/75989304f690e7ea0a1e36844eefc3b7.png)

- From the **SSL Certificate**, select **Browse and Import Certificate …**  
    

    ![](media/29c2f9348f4c30c5e389a2154e42722d.png)

- Select the PFX file and select **Open**  
    

    ![](media/ee1f24393085af311ad8b0ba01faa23e.png)

- Enter the PFX’s password when prompted  
    

    ![](media/e4dfa1ca563277458cb038fd7fcd2aac.png)

- After the certificate and its private key are successfully imported, the display is updated to reflect certificate’s key attributes  
    

    ![](media/1a0840e114ee8a287925f1fc152d2470.png)

### Notes 

- As the RDGateway role is intended to be public facing, a publicly issued certificate is *recommended*, though not required. A privately issued certificate would require all clients to be configured with the corresponding trust chain beforehand.

- To add high availability (HA) to this RDGateway deployment, see the following article: <https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/rds-rdweb-gateway-ha>. The article covers HA for both the RDWeb and RDGateway roles, however only the RDGateway steps are relevant to this deployment.
