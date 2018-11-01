---
title: Azure Stack Development Kit Basics| Microsoft Docs
description: Describes how to perform basic administration tasks for the Azure Stack Development Kit (ASDK).
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/15/2018
ms.author: jeffgilb
ms.reviewer: misainat
---

# ASDK administration basics 
There are several things you need to know if you're new to Azure Stack Development Kit (ASDK) administration. This guidance provides an overview of your role as an Azure Stack operator in the evaluation environment, and how to ensure your test users can become productive quickly.

First, you should review the [What is Azure Stack Development Kit?](asdk-what-is.md) article to make sure you understand the purpose of the ASDK and its limitations. You should use the development kit as a "sandbox," where you can evaluate Azure Stack to develop and test your apps in a non-production environment. 

Like Azure, Azure Stack innovates rapidly so we'll regularly release new builds of the ASDK. However, you cannot upgrade the ASDK like you can Azure Stack integrated systems deployments. So, if you want to move to the latest build, you must completely [redeploy the ASDK](asdk-redeploy.md). You cannot apply update packages. This process takes time, but the benefit is that you can try out the latest features as soon as they become available. 

## What account should I use?
There are a few account considerations you should be aware of when managing Azure Stack. Especially in deployments using Windows Server Active Directory Federation Services (AD FS) as the identity provider instead of Azure Active Directory (Azure AD). The following account considerations apply to both Azure Stack integrated systems and ASDK deployments:

|Account|Azure AD|AD FS|
|-----|-----|-----|
|Local Administrator (.\Administrator)|ASDK host administrator|ASDK host administrator|
|AzureStack\AzureStackAdmin|ASDK host administrator<br><br>Can be used to log in to the Azure Stack administration portal<br><br>Access to view and administer Service Fabric rings|ASDK host administrator<br><br>No access to the Azure Stack administration portal<br><br>Access to view and administer Service Fabric rings<br><br>No longer owner of the Default Provider Subscription (DPS)|
|AzureStack\CloudAdmin|Can access and run permitted commands within the Privileged Endpoint|Can access and run permitted commands within the Privileged Endpoint<br><br>Can not log in to the ASDK host<br><br>Owner of the Default Provider Subscription (DPS)|
|Azure AD Global Administrator|Used during installation<br><br>Owner of the Default Provider Subscription (DPS)|Not applicable|
|

## What tools do I use to manage?
You can use the [Azure Stack Administrator Portal](https://adminportal.local.azurestack.external) or PowerShell to manage Azure Stack. The easiest way to learn the basic concepts is through the portal. If you want to use PowerShell, you need to install [PowerShell for Azure Stack](asdk-post-deploy.md#install-azure-stack-powershell) and [download the Azure Stack tools from GitHub](asdk-post-deploy.md#download-the-azure-stack-tools).

Azure Stack uses Azure Resource Manager as its underlying deployment, management, and organization mechanism. If you're going to manage Azure Stack and help support users, you should learn about Azure Resource Manager. You can learn more by reading the [Getting Started with Azure Resource Manager whitepaper](http://download.microsoft.com/download/E/A/4/EA4017B5-F2ED-449A-897E-BD92E42479CE/Getting_Started_With_Azure_Resource_Manager_white_paper_EN_US.pdf).

## Your typical responsibilities
Your users want to use services. From their perspective, your main role is to make these services available to them. Using the ASDK, you can learn which services to offer, and how to make those services available by [creating plans, offers, and quotas](asdk-offer-services.md). You'll also need to add items to the marketplace, such as virtual machine images. The easiest way is to [download marketplace items](asdk-marketplace-item.md) from Azure to Azure Stack.

> [!NOTE]
> If you want to test your plans, offers, and services, you should use the [user portal](https://portal.local.azurestack.external); not the [administrator portal](https://adminportal.local.azurestack.external).

In addition to providing services, you must perform all the regular duties of an Azure Stack Operator to keep the ASDK up and running. These duties include things like the following:
- Add user accounts for either Azure Active Directory (Azure AD) or Active Directory Federation Services (AD FS) deployments.
- Assign role-based access control (RBAC) roles (this is not restricted to just administrators)
- Monitor infrastructure health
- Manage network and storage resources
- Replace failed development kit host computer hardware 

## Where to get support
For the development kit, your only support option is to ask support-related questions in the [Microsoft Azure Stack forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=azurestack). If you click the Help and support icon (question mark) in the upper-right corner of the administrator portal, and then click **New support request**, this opens the forums site directly. These forums are regularly monitored. 

> [!IMPORTANT]
> Because the ASDK is an evaluation environment, there is no official support offered through Microsoft Customer Support Services (CSS).

## Next steps
[Deploy the ASDK](asdk-install.md)

