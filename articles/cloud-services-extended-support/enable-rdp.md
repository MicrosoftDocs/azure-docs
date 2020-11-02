---
title: Enable Remote Desktop in Cloud Services (extended support)
description: Enable Remote Desktop for Cloud Services (extended support) instances
ms.topic: how-to
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Enable Remote Desktop for Cloud Services (extended support) instances

Remote Desktop enables you to access the desktop of a role running in Azure. You can use a Remote Desktop connection to troubleshoot and diagnose problems with your application while it is running.
You can enable a Remote Desktop connection in your role during development by including the Remote Desktop modules in your service definition or you can choose to enable Remote Desktop through the Remote Desktop Extension. The preferred approach is to use the Remote Desktop extension as you can enable Remote Desktop even after the application is deployed without having to redeploy your application.

## Configure Remote Desktop from the Azure portal
The Azure portal uses the Remote Desktop Extension approach so you can enable Remote Desktop even after the application is deployed. The Remote Desktop settings for your cloud service allows you to enable Remote Desktop, change the local Administrator account used to connect to the virtual machines, the certificate used in authentication and set the expiration date for it. 

1. Go to the relevant cloud service, and then select Remote Desktop in the left pane

    :::image type="content" source="media/remote-desktop1.png" alt-text="Image shows selecting the Remote Desktop option in the Azure Portal":::

2. Choose whether you want to enable Remote Desktop for an individual role or for all roles, then change the value of the switcher to Enabled
3. Fill in the required fields for user name, password, expiry, and certificate (not required)

    :::image type="content" source="media/remote-desktop2.png" alt-text="Image shows inputting the information required to connect to remote desktop.":::

4. In Roles, select the role you want to update or select All for all roles.
5. When you finish your configuration updates, select Save. It will take a few moments before your role instances are ready to receive connections.

## Remote into role instances
Once Remote Desktop is enabled on the roles, you can initiate a connection directly from the Azure portal:

1. Click Instances to open the Instances settings.
2. Select a role instance that has Remote Desktop configured.
3. Click Connect to download an RDP file for the role instance.
4. Click Open and then Connect to start the Remote Desktop connection.
 
    :::image type="content" source="media/remote-desktop3.png" alt-text="Image shows selecting the worker role instance in the Azure Portal.":::


