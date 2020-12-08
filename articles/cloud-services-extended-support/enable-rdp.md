---
title: Enable Remote Desktop in Cloud Services (extended support) using the Azure portal
description: Enable Remote Desktop for Cloud Services (extended support) instances using the Azure portal
ms.topic: how-to
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Enable remote desktop for Cloud Services (extended support) instances using the Azure portal

Remote Desktop enables you to access the desktop of a role running in Azure. You can use a remote desktop connection to troubleshoot and diagnose problems with your application while it is running.

You can enable a remote desktop connection in your role during development by including the remote desktop modules in your service definition or through the remote desktop extension. 

## How does the RDP Extension Work?
The user passes their preferred username and password using the cscfg and csdef file in the public and private config sections. Cloud Services (extended support) does not do any validations on the backend. Cloud Services (extended support) encrypts the password and writes the configuration. Once the platform receives the configuration, the GuestAgent will see the extension and attempt to install it on the virtual machine instance. 

Part of installation is setting the username and password of the virtual machine as per Group Policy restrictions. If username or password is not complex enough, the installation of the remote desktop extension will fail. When installation succeeds, the RDP listener starts on the role and waits for incoming requests.  


## Configure remote desktop from the Azure portal

The Azure portal uses the remote desktop extension to enable remote desktop even after the application is deployed. The remote desktop settings for your Cloud Service allows you to enable remote desktop, update the local administrator account, select the certificates used in authentication and set the expiration date for those certificates. 

1. Navigate to the Cloud Service you want to enable remote desktop for and select **"Remote Desktop"** in the left navigation pane.

    :::image type="content" source="media/remote-desktop-1.png" alt-text="Image shows selecting the Remote Desktop option in the Azure portal":::

2. Select **Add**.
3. Choose the roles to enable remote desktop for.
4. Fill in the required fields for user name, password, expiry, and certificate (not required).

    :::image type="content" source="media/remote-desktop-2.png" alt-text="Image shows inputting the information required to connect to remote desktop.":::

5. When finished, select **Save**. It will take a few moments before your role instances are ready to receive connections.

## Connect to role instances with Remote Desktop enabled
Once remote desktop is enabled on the roles, you can initiate a connection directly from the Azure portal.

1. Click on **Roles and Instances** to open the instance settings.

    :::image type="content" source="media/remote-desktop-3.png" alt-text="Image shows selecting the roles and instances option in the configuration blade.":::

2. Select a role instance that has remote desktop configured.
3. Click **Connect** to download an remote desktop connection file.

    :::image type="content" source="media/remote-desktop-4.png" alt-text="Image shows selecting the worker role instance in the Azure portal.":::
    
4. Open the file to connect to the role instance.


## Next steps
For more information, see [Frequently asked questions about Azure Cloud Services (extended support)](faq.md)
