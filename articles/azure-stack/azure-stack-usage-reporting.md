---
title: Azure Stack consumption reporting | Microsoft Docs
description: Learn how to set up consumption reporting in Azure Stack.
services: azure-stack
documentationcenter: ''
author: SnehaGunda
manager: byronr
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/27/2017
ms.author: sngun

---
# Azure Stack consumption reporting

This article describes the process required to set up consumption reporting in Azure Stack. Consumption, also called usage, represents the quantity of Azure Stack resources you have used. Consumption reporting enables consumption-based billing. At Technical Preview 3(TP3), consumption reporting is optional, and users are not charged for consuming resources in the Azure Stack. At TP3, Azure Stack service administrators can test this feature. When Azure Stack becomes generally available, it is required for multi-node environments to report the consumption data. 

Consumption reporting sends the consumption data from Azure Stack to Azure through the Azure Bridge. In Azure, the commerce system processes the Azure Stack consumption data and generates the bill which is similar to the way it generates bill for Azure resources. The Azure subscription owner can view and download this bill from the [Azure account website](https://account.windowsazure.com/Subscriptions). To learn about how Azure Stack is licensed, refer to the [Azure Stack packaging and pricing document](https://go.microsoft.com/fwlink/?LinkId=842847&clcid=0x409).

![billing flow](media/azure-stack-usage-reporting/billing-flow.png)

## Set up and test consumption reporting in Azure Stack

Use the following steps to set up and test the consumption reporting in Azure Stack:

1.	If you haven’t already done, [register your Azure Stack instance with Azure](azure-stack-register.md). As a part of the registration process, the Azure Bridge is configured. The Azure Bridge connects Azure Stack to Azure and reports the consumption data for Azure Stack resources. Please see the [FAQ section](#frequently-asked-questions) of this article for what consumption data is reported. 

2.	Create few resources in Azure Stack. Virtual machines are a good way to test usage reporting. For example, you can create a Windows Server and Linux VMs with Basic and Standard SKUs to see how core usage is reported. Note that they will be reported under different meters.

3.	Leave your resources running for a few hours. Usage information is collected once every hour. After collecting, the usage data is transmitted to Azure and processed into Azure commerce. This process can take up to a few hours.

4.	Open the [Azure account website](https://account.windowsazure.com/Subscriptions), and select the subscription to which you are charging usage. 
 
## Frequently asked questions

### What data is sent to Azure?

The following consumption data is sent from Azure Stack to Azure:

* **Meter ID** – Unique ID for the resource that was consumed.  
* **Quantity** – Amount of resource consumption that occurred in a certain time frame.  
* **Location** – Location where the current Azure Stack resource is deployed.  
* **Resource URI** – fully qualified URI of the resource for which usage is being reported.  
* **Subscription ID** – Subscription ID of the Azure Stack user.  
* **Time** – Start and end time of the consumption. There is some delay between the time when these resources are consumed in Azure Stack and when the consumption data is reported to commerce.  

### What will I be charged for?

At TP3, resource consumption is free for Azure Stack POC as well as multi-node instances. 
At general availability, Azure Stack multi-node systems will be charged whereas the single-node POC environment will continue to be available at no cost. For multi-node systems, workload VMs, Storage services, and App Services are charged. 

### Will I be charged for the infrastructure VMs?

No, the consumption data for Azure Stack infrastructure VMs which are created during deployment is reported to Azure but they are not charged. The infrastructure VMs include the VMs that are created by the Azure Stack deployment script, and the VMs that are needed to run Microsoft first-party resource providers   such as Compute, Storage, SQL etc.

### What Azure meters will be used?

The following are the two sets of meters that are used in consumption reporting:

* **Full price meters** – for resources associated with user workloads.  
* **Admin meters** – for infrastructure resources. These meters have a price of zero dollars.  

### Which subscription is charged for the resources consumed?

The subscription that is provided when [registering Azure Stack with Azure](azure-stack-register.md) is charged.

### What types of subscriptions are supported for consumption reporting?
 At TP3, Enterprise Agreement (EA), Pay-as-you-go, and MSDN subscriptions are supported for consumption reporting. Cloud Solution Provider (CSP) subscriptions are not  supported at TP3.    
 
### Does consumption reporting work in sovereign clouds?
No, at TP3, consumption reporting requires subscriptions that are created in the global Azure system. Subscriptions created in one of the sovereign clouds (the Azure US Government, German, and China clouds) cannot be registered with Azure, so they don’t support consumption reporting. 

### Can I test consumption reporting before GA?
Yes, consumption reporting can be configured if you deploy the Azure Stack POC instance and [register](azure-stack-register.md) it with Azure. After registering, consumption data will start flowing from your Azure Stack instance to your Azure subscription.

### How do I identify Azure Stack consumption in the Azure billing portal?
You will be able to see the Azure Stack consumption data in detail in the usage details file (see [this](https://docs.microsoft.com/en-us/azure/billing/billing-download-azure-invoice-daily-usage-date#download-usage-from-the-account-center-csv) article if you are not sure where to find the file). The usage details file contains the Azure Stack meters that identify Azure Stack storage and VMs. All resources used in Azure Stack are reported under the region named “Azure Stack”.

### Why doesn’t the usage reported on Azure Stack match the report from Azure billing?
There is a delay between when usage is reported on Azure Stack and when it is submitted to Azure commerce. For this reason, usage that occurs shortly before midnight may show up in Azure the following day. In particular, if you use the [Azure Stack Usage APIs](azure-stack-provider-resource-api.md), and compare the results to the usage reported in the Azure billing portal, you may see a difference.



