---

title: Migrate from Azure RemoteApp to Citrix XenApp Essentials | Microsoft Docs
description: How to migrate from Azure RemoteApp to Citrix XenApp Essentials
services: remoteapp
documentationcenter: ''
author: msmbaldwin
manager: mbaldwin

ms.assetid: 695a8165-3454-4855-8e21-f2eb2c61201b
ms.service: remoteapp
ms.workload: compute
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/26/2017
ms.author: mbaldwin

---

# Migrate from Azure RemoteApp to Citrix XenApp Essentials

If you use Azure RemoteApp and you want to migrate to Citrix XenApp Essentials, there are a few prerequisites to keep in mind. First, read Citrix's [step by step technical deployment guide for Citrix XenApp Essentials](https://docs.citrix.com/content/dam/docs/en-us/citrix-cloud/downloads/xenapp-essentials-deployment-guide.pdf) and its [online technical library](http://docs.citrix.com/en-us/citrix-cloud/xenapp-and-xendesktop-service/xenapp-essentials.html). 

## Prerequisite steps for migration

1. Create a new virtual network, or determine which Azure virtual network in Azure Resource Manager into which you'll deploy Citrix XenApp Essentials. Azure RemoteApp uses the Azure classic portal; Citrix XenApp Essentials only supports Azure Resource Manager.  
2. Ensure that the virtual network you selected has networking access to your domain controller, because Citrix only supports hybrid deployments. If you are using a cloud deployment of Azure RemoteApp, ensure that your virtual network has networking access to an Active Directory domain controller. You can also use Azure Active Directory Domain Services (Azure AD DS). 
3. Ensure that the DNS is properly configured for the virtual network, so that domain join is successful on your first attempt. You can create a virtual machine (VM) in the virtual network you selected, and perform a manual domain join to verify that the DNS and domain join works as expected. This ensures that you are successful the first time you deploy Citrix XenApp Essentials. 
4. If needed, create a virtual network peering between an Azure classic portal virtual network you are using with Azure RemoteApp, and your Azure Resource Manager virtual network. This peering process works if the two networks reside in the same region. If they do not, use site-to-site VPN to connect the virtual networks for networking. 
5. If needed, read [How to migrate data into and out of Azure RemoteApp](remoteapp-migrate.md). 
6. Update your existing Azure RemoteApp image to include the Citrix VDA component (for instructions, see the Citrix documentation). 
7. Go to the Azure Marketplace, and begin Citrix XenApp Essentials deployment.

## Other considerations

Be aware of the following additional considerations when you migrate:
- Citrix XenApp Essentials only supports hybrid deployments. In other words, it requires network access to a domain controller in order to perform domain join. If you are using a cloud deployment of Azure RemoteApp, either use Azure AD DS or ensure that your virtual network has access to Active Directory for domain join. 
- To learn how to move user data to Citrix XenApp Essentials, see [How to migrate data into and out of Azure RemoteApp](remoteapp-migrate.md). 
- Citrix XenApp Essentials only supports Active Directory accounts. It does not support Microsoft accounts (such as outlook.com, msn.com, or hotmail.com). 

## Citrix XenApp Essentials billing

For full details on pricing, see the [FAQ](https://www.citrix.com/global-partners/microsoft/resources/xenapp-essentials-faq.html#tab-30699) and [Citrix overview article](https://www.citrix.com/global-partners/microsoft/remote-app.html). There are three billing components to Citrix XenApp Essentials:

- The Citrix service charge, which is $12 per user per month. Like all Azure Marketplace purchases, this is billed to the payment method associated with your Azure subscription. For Enterprise Agreement (EA) customers, Azure monetary credits cannot be used. 
- Remote Data Services (RDS) client access licenses (CALs). Currently, you can purchase the Remote Access Fee that is bundled with the Citrix XenApp Essentials payment for $6.25. If you are an EA customer, you can use Azure monetary credits to pay for this. If you want to use your existing RDS CALs, contact us at [arainfo@microsoft.com](mailto:arainfo@microsoft.com), so we can apply this to your bill. 
- Azure compute and storage. This is the Azure storage cost and compute consumption for the VMs consumed. Be aware of pricing when selecting your VM size and user density. If you are an EA customer, you can use Azure monetary credits to pay for this.

If you still have questions, you can:
- Email us at [arainfo@microsoft.com](mailto:arainfo@microsoft.com).
- [Contact Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). Start by [opening an Azure support case](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to help with prerequisite steps 1-5. For steps 6-7, contact Citrix by opening a support ticket within the Citrix management portal. 
