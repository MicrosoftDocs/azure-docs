---
title: Azure connected deployment decisions for Azure Stack integrated systems | Microsoft Docs
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
# Azure connected deployment planning decisions for Azure Stack integrated systems
After you've decided [how you will integrate Azure Stack into your hybrid cloud environment](azure-stack-connection-models.md), you can then finalize your Azure Stack deployment decisions.

Deploying Azure Stack connected to Azure means that you can have either Azure Active Directory (Azure AD) or Active Directory Federation Services (AD FS) for your identity store. You can also choose from either billing model: pay-as-you-use or capacity-based. A connected deployment is the default option because allows customers to get the most value out of Azure Stack, particularly for hybrid cloud scenarios that involve both Azure and Azure Stack. 

## Choose an identity store
With a connected deployment, you can choose between Azure AD or AD FS for your identity store. A disconnected deployment, with no internet connectivity, can only use AD FS.

Your identity store choice has no bearing on tenant virtual machines (VMs). Tenant VMs may choose which identity store they want to the connect to depending on how they will be configured: Azure AD, Windows Server Active Directory domain-joined, workgroup, etc. This is unrelated to the Azure Stack identity provider decision. 

For example, if you deploy IaaS tenant VMs on top of Azure Stack, and want them to join a Corporate Active Directory Domain and use accounts from there, you can still do this. You are not required to use the Azure AD identity store you select here for those accounts.

### Azure AD identity store
When you use Azure AD for your identity store requires two Azure AD accounts: a global admin account and a billing account. These accounts can be the same accounts, or different accounts. While using the same user account might be simpler and useful if you have a limited number of Azure accounts, your business needs might suggest using two accounts:

1. **Global admin account** (only required for connected deployments). This is an Azure account that is used to create applications and service principals for Azure Stack infrastructure services in Azure Active Directory. This account must have directory administrator permissions to the directory that your Azure Stack system will be deployed under. It will become the "cloud operator" Global Admin for the Azure AD tenant and will be used: 
    - To provision and delegate applications and service principals for all Azure Stack services that need to interact with Azure Active Directory and Graph API. 
    - As the Service Administrator account. This is the owner of the default provider subscription (which you can later change). You can log into the Azure Stack admin portal with this account, and can use it to create offers and plans, set quotas, and perform other administrative functions in Azure Stack.
2. **Billing account** (required for both connected and disconnected deployments). This Azure account is used to establish the billing relationship between your Azure Stack integrated system and the Azure commerce backend. This is the account that will be billed for Azure Stack fees. This account will also be used for offering items in the marketplace and other hybrid scenarios. 

### AD FS identity store
Choose this option if you want to use your own identity store, such as your corporate Active Directory, for your Service Administrator accounts.  

## Choose a billing model
You can choose either **Pay-as-you-use** or the **Capacity** billing model. Pay-as-you-use billing model deployments must be able to report usage through a connection to Azure at least once every 30 days. Therefore, the Pay-as-you-use billing model is only available for connected deployments.  

### Pay-as-you-use
With the Pay-as-you-use billing model, usage is charged to an Azure subscription. You only pay when you use the Azure Stack services. If this is the model you decide on, you will need an Azure subscription and the account ID associated with that subscription (for example, serviceadmin@contoso.onmicrosoft.com). EA, CSP, and CSL subscriptions are supported. Usage reporting is configured during [Azure Stack registration](azure-stack-registration.md).

> [!NOTE]
> In most cases, Enterprise customers will use EA subscriptions, and Service Providers will use CSP or CSL subscriptions.

If you are going to use a CSP subscription, review the table below to identify which CSP subscription to use, as the correct approach depends on the exact CSP scenario:

|Scenario|Domain and subscription options|
|-----|-----|
|You are a **Direct CSP Partner** or an **Indirect CSP Provider**, and you will operate the Azure Stack|Use a CSL (Common Service Layer) subscription.<br>     or<br>Create an Azure AD tenant with a descriptive name in Partner Center. For example &lt;your organization>CSPAdmin with an Azure CSP subscription associated with it.|
|You are an **Indirect CSP Reseller**, and you will operate the Azure Stack|Ask your Indirect CSP Provider to create an Azure AD tenant for your organization with an Azure CSP subscription associated with it using Partner Center.|

### Capacity based billing
If you decide to use the capacity billing model, you must purchase an Azure Stack Capacity Plan SKU based on the capacity of your system. You will need to know the number of physical cores in your Azure Stack to purchase the correct quantity. 

Capacity billing requires an Enterprise Agreement (EA) Azure subscription for registration. The reason is that registration sets up the availability of items in the Marketplace, which requires an Azure subscription. The subscription is not used for Azure Stack usage.

## Learn more
- For information about use cases, purchasing, partners, and OEM hardware vendors, see the [Azure Stack](https://azure.microsoft.com/overview/azure-stack/) product page.
- For information about the roadmap and geo-availability for Azure Stack integrated systems, see the white paper: [Azure Stack: An extension of Azure](https://azure.microsoft.com/resources/azure-stack-an-extension-of-azure/). 
- To learn more about Microsoft Azure Stack packaging and pricing [download the .pdf](https://azure.microsoft.com/mediahandler/files/resourcefiles/5bc3f30c-cd57-4513-989e-056325eb95e1/Azure-Stack-packaging-and-pricing-datasheet.pdf). 

## Next steps
[Datacenter network integration](azure-stack-network.md)