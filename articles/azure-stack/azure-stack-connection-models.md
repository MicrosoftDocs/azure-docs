---
title: Azure Stack integrated systems connection models | Microsoft Docs
description: Determine deployment planning decisions for multi-node Azure Stack.
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
ms.reviewer: wfayed

---
# Azure Stack integrated systems connection models
If you’re interested in an Azure Stack integrated system, you’ll need to understand [several datacenter integration considerations](azure-stack-datacenter-integration.md) for Azure Stack deployment to determine how the system will fit into your datacenter. In addition, you'll need to decide exactly how you will integrate Azure Stack into your hybrid cloud environment. This article provides an overview of these major decisions including Azure connection, identity store, and billing model decisions.

If you decide to purchase an integrated system, your original equipment manufacturer (OEM) hardware vendor helps guide you through much of the planning process in more detail. They will also perform the actual deployment.

## Choose an Azure Stack deployment connection model
You can choose to deploy Azure Stack either connected to the internet (and to Azure) or disconnected. To get the most benefit from Azure Stack, including hybrid scenarios between Azure Stack and Azure, you'd want to deploy connected to Azure. This choice defines which options are available for your identity store (Azure Active Directory or Active Directory Federation Services) and billing model (Pay as you use-based billing or capacity-based billing) as summarized in the following diagram and table: 

![Azure Stack deployment and billing scenarios](media/azure-stack-connection-models/azure-stack-scenarios.png)	
  
> [!IMPORTANT]
> This is a key decision point! Choosing Active Directory Federation Services (AD FS) or Azure Active Directory (Azure AD) is a one-time decision that you must make at deployment time. You can’t change this later without re-deploying the entire system.  


|Options|Connected to Azure|Disconnected from Azure|
|-----|-----|-----|
|Azure AD|![Supported](media/azure-stack-connection-models/check.png)| |
|AD FS|![Supported](media/azure-stack-connection-models/check.png)|![Supported](media/azure-stack-connection-models/check.png)|
|Consumption-based billing|![Supported](media/azure-stack-connection-models/check.png)| |
|Capacity-based billing|![Supported](media/azure-stack-connection-models/check.png)|![Supported](media/azure-stack-connection-models/check.png)|
|Download update packages directly to Azure Stack|![Supported](media/azure-stack-connection-models/check.png)|  |

After you've decided on the Azure connection model to be used for Azure Stack deployment, additional, connection-dependent decisions must be made for the identity store and billing method. 

## Next steps

[Azure connected Azure Stack deployment decisions](azure-stack-connected-deployment.md)

[Azure disconnected Azure Stack deployment decisions](azure-stack-disconnected-deployment.md)
