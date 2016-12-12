---
title: Use Azure Resource Manager templates in Azure Stack (tenant developers) | Microsoft Docs
description: Lear n how to use Azure Resource Manager templates in Azure Stack to deploy and provision all of the resources for your application in a single, coordinated operation.
services: azure-stack
documentationcenter: ''
author: heathl17
manager: byronr
editor: ''

ms.assetid: 2022dbe5-47fd-457d-9af3-6c01688171d7
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/16/2016
ms.author: helaw

---

# Install Visual Studio for Azure Stack
Visual Studio can be used to author templates and work with cloud resources in Azure Stack.  Use the following steps to install the versions supported with Azure Stack TP2.  

## Install Visual Studio
1.	Make sure you are connected to Azure Stack.  You can [RDP] to MAS-CON01 VM, or you can use [VPN] to connect from a workstation.

2.	Download and install the [Web Platform Installer](https://www.microsoft.com/web/downloads/platform.aspx).             

3.	From Web Platform Installer, search for  **Visual Studio Community 2015 with Microsoft Azure SDK - 2.9.6**, then click **Add**, and **Install** at the bottom of the screen.

4.	Using Add/Remove Programs from Control Panel, uninstall the **Microsoft Azure PowerShell** that gets installed as part of the SDK.

      ![Screenshot of add/remove programs interface for Azure PowerShell](./media/azure-stack-install-visual-studio/image1.png) 

5.	Open the Web Platform Installer, search for  **Microsoft Azure PowerShell - Azure Stack Technical Preview 2**  and then install.

6.	After the installation completes, restart the machine where tools were installed.

## Connect to Azure Stack

1.	Open Visual Studio.

2.  From the **Edit** menu, select **Cloud Explorer** and a new pane will open.

3.  Select **Add Account** and login with your Azure AD credentials.  

4.  Once logged in, you can [deploy templates](azure-stack-deploy-template-visual-studio.md) or browse available resource types and resource groups.

![Screenshot of Cloud Explorer once logged in and connected to Azure Stack](./media/azure-stack-install-visual-studio/image6.png)


