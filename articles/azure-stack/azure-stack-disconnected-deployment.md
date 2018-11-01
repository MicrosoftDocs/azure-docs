---
title: Azure disconnected deployment decisions for Azure Stack integrated systems | Microsoft Docs
description: Determine deployment planning decisions for multi-node Azure Stack Azure-connected deployments.
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
ms.date: 08/01/2018
ms.author: jeffgilb
ms.reviewer: wfayed

---
# Azure disconnected deployment planning decisions for Azure Stack integrated systems
After you've decided [how you will integrate Azure Stack into your hybrid cloud environment](azure-stack-connection-models.md), you can then finalize your Azure Stack deployment decisions.

With the disconnected from Azure deployment option, you can deploy and use Azure Stack without a connection to the Internet. However, with a disconnected deployment, you are limited to an AD FS identity store and the capacity-based billing model. 

Choose this option if you:
- Have security or other restrictions that require you to deploy Azure Stack in an environment that is not connected to the Internet.
- Want to block data (including usage data) from being sent to Azure.
- Want to use Azure Stack purely as a private cloud solution that is deployed to your corporate Intranet, and aren’t interested in hybrid scenarios.

> [!TIP]
> Sometimes, this type of environment is also referred to as a “submarine scenario”.

A disconnected deployment does not strictly mean that you can’t later connect your Azure Stack instance to Azure for hybrid tenant VM scenarios. It means that you don’t have connectivity to Azure during deployment or you don’t want to use Azure Active Directory as your identity store.

## Features that are impaired or unavailable in disconnected deployments 
Azure Stack was designed to work best when connected to Azure, so it’s important to note that there are some features and functionality that are either impaired or completely unavailable in the Disconnected mode. 

|Feature|Impact in Disconnected mode|
|-----|-----|
|VM deployment with DSC extension to configure VM post deployment|Impaired - DSC extension looks to the Internet for the latest WMF.|
|VM deployment with Docker Extension to run Docker commands|Impaired – Docker will check the Internet for the latest version and this check will fail.|
|Documentation links in the Azure Stack Portal|Unavailable – Links such as Give Feedback, Help, Quickstart, etc. that use an Internet URL won’t work.|
|Alert remediation/mitigation that references an online remediation guide|Unavailable – Any alert remediation links that use an Internet URL won’t work.|
|Marketplace – The ability to select and add Gallery packages directly from the Azure Marketplace|Impaired – When you deploy Azure Stack in a disconnected mode (without any Internet connectivity), you can’t download marketplace items by using the Azure Stack portal. However, you can use the [marketplace syndication tool](https://docs.microsoft.com/azure/azure-stack/azure-stack-download-azure-marketplace-item#download-marketplace-items-in-a-disconnected-or-a-partially-connected-scenario-with-limited-internet-connectivity) to download the marketplace items to a machine that has internet connectivity and then transfer them to your Azure Stack environment.|
|Using Azure Active Directory federation accounts to manage an Azure Stack deployment|Unavailable – This feature requires connectivity to Azure. AD FS with a local Active Directory instance must be used instead.|
|App Services|Impaired - WebApps may require Internet access for updated content.|
|Command Line Interface (CLI)|Impaired – CLI has reduced functionality in terms of authentication and provisioning of Service Principles.|
|Visual Studio – Cloud discovery|Impaired – Cloud Discovery will either discover different clouds or will not work at all.|
|Visual Studio – AD FS|Impaired – Only Visual Studio Enterprise supports AD FS.
Telemetry|Unavailable – Telemetry data for Azure Stack as well as any third-party gallery packages that depend on telemetry data.|
|Certificates|Unavailable – Internet connectivity is required for Certificate Revocation List (CRL) and Online Certificate Status Protocol (OSCP) services in the context of HTTPS.|
|Key-Vault|Impaired – A common use case for Key Vault is to have an application read secrets at runtime. For this the application needs a service principal in the directory. In Azure Active Directory, regular users (non-admins) are by default allowed to add service principals. In AD (using ADFS) they are not. This places a hurdle in the end-to-end experience because one must always go through a directory admin to add any application.| 

## Learn more
- For information about use cases, purchasing, partners, and OEM hardware vendors, see the [Azure Stack](https://azure.microsoft.com/overview/azure-stack/) product page.
- For information about the roadmap and geo-availability for Azure Stack integrated systems, see the white paper: [Azure Stack: An extension of Azure](https://azure.microsoft.com/resources/azure-stack-an-extension-of-azure/). 
- To learn more about Microsoft Azure Stack packaging and pricing [download the .pdf](https://azure.microsoft.com/mediahandler/files/resourcefiles/5bc3f30c-cd57-4513-989e-056325eb95e1/Azure-Stack-packaging-and-pricing-datasheet.pdf). 

## Next steps
[Datacenter network integration](azure-stack-network.md)