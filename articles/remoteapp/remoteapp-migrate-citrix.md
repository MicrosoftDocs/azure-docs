---

title: How to migrate from Azure RemoteApp to Citrix XenApp Essentials | Microsoft Docs
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

# How to migrate from Azure RemoteApp to Citrix XenApp Essentials

There are a few prerequisites for Azure RemoteApp customers wishing to migrate to Citrix XenApp Essentials.  We recommend that you first read Citrix's [step by step technical deployment guide for Citrix XenApp Essentials](https://docs.citrix.com/content/dam/docs/en-us/citrix-cloud/downloads/xenapp-essentials-deployment-guide.pdf), as well as their [online technical library](http://docs.citrix.com/en-us/citrix-cloud/xenapp-and-xendesktop-service/xenapp-essentials.html). 

Fortunately you can reuse the majority of the investments you've already made in Azure RemoteApp, but there a few high level prerequisites for deploying XenApp Essentials.

## Prerequisites

1. Create a new VNET, or determine which Azure VNET in Azure Resource Manager that you'll deploy Citrix XenApp Essentials into. Azure RemoteApp uses Azure classic; Citrix XenApp Essentials only supports Azure Resource Manager.  
2. Ensure that VNET you selected has networking access to your domain controller, as Citrix only supports hybrid deployments. If you are using a Cloud deployment of Azure RemoteApp you will need to ensure your VNET has networking access to an Active Directory domain controller and or we recommend you use Azure Active Directly Domain Services (AAD-DS). 
3. Ensure DNS is properly configured for VNET, so domain join will be successful on your first attempt. You can create a Virtual Machine in the VNET you selected and perform a manual domain join to verify that DNS and domain join works as expected. This will ensure that you are successful the first timer you deploy Citrix XenApp Essentials. 
4. If needed, create a VNET peering between a Azure classic VNET you are using with Azure RemoteApp and your Azure Resource Manager VNET if they reside in the same region and or use S2S VPN if they are not in order to connect VNET's for networking. 
5. If needed, read [How to migrate data into and out of Azure RemoteApp](remoteapp-migrate.md). 
6. Update your existing Azure RemoteApp image to include the Citrix VDA component, reference Citrix documentation on instructions. 
7. Go to Azure Marketplace and begin Citrix XenApp Essentials deployment.

Good luck, and thank you for using Azure RemoteApp. 

## Other considerations:

- Citrix XenApp Essentials only supports hybrid deployments. In other words, it requires network access to a domain controller in order to perform domain join. If you are using a Cloud deployment of Azure RemoteApp, you will need to either use AAD-DS or ensure your VNET has access to Active Directory for domain join. 
- To learn how to move user data to CXE, read [How to migrate data into and out of Azure RemoteApp](remoteapp-migrate.md). 
- Citrix XenApp Essentials only supports Active Directory accounts. It does not support Microsoft Accounts (@outlook.com, @msn.com, @hotmail.com, etc.). 

## Understanding billing for Citrix XenApp Essentials 

Read the [FAQ](https://www.citrix.com/global-partners/microsoft/resources/xenapp-essentials-faq.html#tab-30699) and [Citrix overview article](https://www.citrix.com/global-partners/microsoft/remote-app.html) for full details on pricing. There are three billing components to Citrix XenApp Essentials, they are:

1. The Citrix $12 per user per month service charge. Like all Azure Marketplace purchases this is billed to the payment method associated to your Azure subscription. For EA customers, Azure monetary credits cannot be used. 
2. RDS CAL. You must either bring your own RDS CAL (coming soon) or purchase the Remote Access Fee (RAF) that is bundled with the Citrix XenApp Essentials payment for $6.25 USD. For EA customers, Azure monetary credits can be used to pay for this. If you desire to use your existing RDS CALs, please contact us [arainfo@microsoft.com](mailto:arainfo@microsoft.com so we can apply to your bill. 
3. Azure compute and storage. This is the Azure storage cost and compute consumption for the VM's consumed. Be aware of pricing when selecting your VM size and user density. For EA customers, Azure monetary credits can be used to pay for this

Still have questions, contact us
1. Email us at [arainfo@microsoft.com](mailto:arainfo@microsoft.com).
2. [Contact Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). Start by [opening an Azure support case](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to help with the steps #1 - #5 above. Contact Citrix by opening a support ticket within the Citrix management portal for steps #6-7. 
