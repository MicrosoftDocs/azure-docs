---
title: Install Visual Studio for Azure Stack | Microsoft Docs
description: Learn the steps required to install Visual Studio and connect to Azure Stack
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
Visual Studio is used to author and deploy Azure Resource Manage templates in Azure Stack.  Use the following steps to install the versions supported with Azure Stack TP2.  

## Install Visual Studio
1.	Make sure you are connected to Azure Stack.  You can [RDP](azure-stack-connect-azure-stack.md#connect-with-remote-desktop) to MAS-CON01 VM, or you can use [VPN](azure-stack-connect-azure-stack.md#connect-with-vpn) to connect from a workstation.

2.	Download and install the [Web Platform Installer](https://www.microsoft.com/web/downloads/platform.aspx).             

3.	From Web Platform Installer, search for  **Visual Studio Community 2015 with Microsoft Azure SDK - 2.9.6**, then click **Add**, and **Install** at the bottom of the screen.

    ![Screenshot of WebPI install steps](./media/azure-stack-install-visual-studio/image3.png) 

4.	Using Add/Remove Programs from Control Panel, uninstall the **Microsoft Azure PowerShell** that is installed as part of the Azure SDK.

      ![Screenshot of add/remove programs interface for Azure PowerShell](./media/azure-stack-install-visual-studio/image1.png) 

5.	Open the Web Platform Installer, search for  **Microsoft Azure PowerShell - Azure Stack Technical Preview 2**  and then install.

    ![Screenshot of add/remove programs interface for Azure PowerShell](./media/azure-stack-install-visual-studio/image2.png)

6.	After the installation completes, restart the machine where tools were installed.

## Connect to Azure Stack

1.	Open Visual Studio.

2.  From the **Edit** menu, select **Cloud Explorer** and a new pane will open.

3.  Select **Add Account** and login with your Azure AD credentials.  

4.  Once logged in, you can [deploy templates](azure-stack-deploy-template-visual-studio.md) or browse available resource types and resource groups to create your own templates.  

    ![Screenshot of Cloud Explorer once logged in and connected to Azure Stack](./media/azure-stack-install-visual-studio/image6.png)

## Next Steps

 - [Deploy templates with Visual Studio](azure-stack-deploy-template-visual-studio.md)

