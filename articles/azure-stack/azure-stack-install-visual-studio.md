---
title: Install Visual Studio and connect to Azure Stack | Microsoft Docs
description: Learn the steps required to install Visual Studio and connect to Azure Stack
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/08/2018
ms.author: jeffgilb
ms.reviewer: unknown

---

# Install Visual Studio and connect to Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can use Visual Studio to write and deploy Azure Resource Manager [templates](user/azure-stack-arm-templates.md) to Azure Stack. The steps in this article walk you through installing Visual Studio on the [Azure Stack Development Kit](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-remote-desktop), or on an external computer if you can connect to Azure Stack through the [VPN](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-vpn). 

## Install Visual Studio

1. Download and run the [Web Platform Installer](https://www.microsoft.com/web/downloads/platform.aspx).  

2. Open the **Microsoft Web Platform Installer**.

3. Search for **Visual Studio Community 2015 with Microsoft Azure SDK - 2.9.6**. Click **Add**, and **Install**.

    ![Screenshot of WebPI install steps](./media/azure-stack-install-visual-studio/image1.png) 

3. Uninstall the **Microsoft Azure PowerShell** that is installed as part of the Azure SDK.

    ![Screenshot of add/remove programs interface for Azure PowerShell](./media/azure-stack-install-visual-studio/image2.png) 

4. [Install PowerShell for Azure Stack](azure-stack-powershell-install.md)

5. Restart the operating system after the installation completes.

## Connect to Azure Stack

1. Launch Visual Studio.

2. From the **View** menu, select **Cloud Explorer**.

3. In the new pane, select **Add Account** and sign in with your Azure Active Directory credentials.  
    ![Screenshot of Cloud Explorer once logged in and connected to Azure Stack](./media/azure-stack-install-visual-studio/image6.png)

Once logged in, you can [deploy templates](user/azure-stack-deploy-template-visual-studio.md) or browse available resource types and resource groups to create your own templates.  

## Next Steps

 - [Develop templates for Azure Stack](user/azure-stack-develop-templates.md)
