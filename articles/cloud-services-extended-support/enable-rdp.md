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

Remote desktop enables you to access a role instance running in a Cloud Service (extended support) deployment. You can use a remote desktop connection to troubleshoot and diagnose problems with your application while it is running.

Remote Desktop can be enabled on your roles during development by including the remote desktop modules in your service definition file. Remote desktop can also be enabled post deployment using the remote desktop extension. 

## Configure remote desktop from the Azure portal

1. Navigate to the Cloud Service you want to enable remote desktop on and select **"Remote Desktop"** in the left navigation pane.

    :::image type="content" source="media/remote-desktop-1.png" alt-text="Image shows selecting the Remote Desktop option in the Azure portal":::

2. Switch Remote Desktop from **disabled** to **enabled**. 

3. Fill in the required fields for user name, password, expiry, and certificate (not required).

    :::image type="content" source="media/remote-desktop-2.png" alt-text="Image shows inputting the information required to connect to remote desktop.":::

4. Select the individual role instance you want to enable remote desktop on or opt to enable remote desktop on all available instances. 

5. When you finish your configuration updates, select **Save**. It will take a few moments before your role instances are ready to receive connections.

## Connect to role instances with Remote Desktop enabled
Once remote desktop is enabled on the roles, you can initiate a connection directly from the Azure portal.

1. Click on **Roles and Instances** to open the instance settings.
2. Select a role instance that has remote desktop configured.
3. Click **Connect** to download an remote desktop connection file.
4. Click **Open** and then **Connect** to start the connection.
 
    :::image type="content" source="media/remote-desktop-3.png" alt-text="Image shows selecting the worker role instance in the Azure portal.":::

## Next steps
For more information, see [Frequently asked questions about Azure Cloud Services (extended support)](faq.md)
