---
title: Azure Automanage for virtual machines FAQ
description: Answers to frequently asked questions about Azure Automanage for virtual machines.
author: DavidCBerry13
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.topic: troubleshooting
ms.date: 09/04/2020
ms.author: daberry
---

# Frequently asked questions for Azure Automanage for VMs

This article provides answers to some of the most common questions about [Azure Automanage for virtual machines](automanage-virtual-machines.md).

If your Azure issue is not addressed in this article, visit the Azure forums on [MSDN and Stack Overflow](https://azure.microsoft.com/support/forums/). You can post your issue in these forums, or post to [@AzureSupport on Twitter](https://twitter.com/AzureSupport). You can also submit an Azure support request. To submit a support request, on the [Azure support page](https://azure.microsoft.com/support/options/), select **Get support**.


## Azure Automanage for virtual machines


**Which capabilities does Azure Automanage automate?**

Automanage enrolls, configures, and monitors throughout the lifecycle of the VM the services listed [here](virtual-machines-best-practices.md).


**Can I customize configurations on Azure Automanage?**

Customers can customize settings for specific services, like Azure Backup retention. For the full list of settings that can be changed, see our documentation [here](virtual-machines-best-practices.md).


**Does Azure Automanage work with both Linux and Windows VMs?**   

Currently, Automanage supports Windows Server Azure VMs.


**Can I selectively apply Automanage on only a set of VMs?**

Automanage can be enabled with click and point simplicity on selected new and existing VMs. Automanage can also be disabled at any time.


**How much does Azure Automanage cost?**

Azure Automanage is available at no additional cost in public preview. Attached Azure resources, such as Azure Backup, will incur cost.


**What regions are supported?**

VMs in the following regions are supported: Central US, East US 2, East US, North Central US, South Central US, West US 2, West Central US, West US, North Europe, West Europe, Canada Central, Canada East.


**Can I apply Automanage through Azure policy?**

Yes, we have a built-in policy that will automatically apply Automanage to all VMs within your defined scope. You will also specify the configuration profile (DevTest or Production) along with your Automanage account. Learn more about configuration profiles [here](automanage-virtual-machines.md#configuration-profiles).


**What is an Automanage account?**

An Automanage account is an MSI (Managed Service Identity) account that provides the Automanage service permissions to access the VM.


**What RBAC permission is needed to enable Automanage?**

Users must have the Owner role. Alternatively, users can have the Contributor role along with User Access Administrator role to apply Automanage.


**Can I change the configuration profile of my VM?**

At this time, you will need to disable Automanage for that VM and then re-enable Automanage with the desired configuration profile and preferences.


**If my VM is already configured for a service, like Update Management, will Automanage reconfigure it?**
No, Automanage will not reconfigure it. We will begin to monitor the resources associated to that service for drift.


**Why does my VM have a Failed status in the Automanage portal?**

If you see the status as *Failed*, you can troubleshoot the deployment through the Resource Group your VM is located in. Go to **Resource groups**, select your resource group, click on **Deployments** and see the *Failed* status there along with error details. 

**How can I get troubleshooting support for Automanage?**

You can file a [technical support case ticket](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). For the **Service** option, search for and select *Automanage* under the *Monitoring and Management* section. 