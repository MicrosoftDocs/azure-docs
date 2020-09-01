---
title: Azure Automanage for virtual machines
description: Learn about Azure automanage for virtual machines.
author: DavidCBerry13
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 08/31/2020
ms.author: daberry
---

# Azure Automanage for virtual machines

This article covers information about Azure Automanage for virtual machines, which does the following:

1.	Intelligently onboards to select best practices Azure services
2.	Automatically configures each service per Azure best practices
3.	Configures the guest operating system per Microsoft baseline configuration
4.	Monitors for drift and corrects for it when detected
5.	Provides a simple experience (point, click, set, forget)


## Overview

Azure Automanage for virtual machines is a service that eliminates the need to discover, know how to onboard, and how to configure certain services in Azure that would benefit your virtual machine. We consider these beneficial services to be the best practices Azure services, such as [Azure Update Management](azure/automation/update-management/update-mgmt-overview.md) and [Azure Backup](azure/backup/backup-overview.md) - just to name a few. 

After intelligently onboarding your machines to select best practices Azure services, it automatically configures each of those services per Azure’s own set of best practices – which is different for each of the services. An example might be Azure Backup, where the best practice might be to backup the virtual machine once a day and have a retention period of 6 months. 

In addition to doing that, Azure Automanage configures the guest operating system per Microsoft’s own baseline configurations. On top of that, it automatically monitors for drift and corrects for it when detected. What this means is if your virtual machine is onboarded to Azure Automanage, we’ll not only configure it per Azure best practices, but we’ll monitor your machine to ensure that it continues to comply with those best practices across its entire lifecycle. If your virtual machine does drift or deviate from those practices, we will correct it and pull your machine back into compliance. 

Lastly, the experience is incredibly simple.


## Participating services

 These are some of the Azure services that we automatically onboard you to. They are essential to our best practices white paper, which you can find in our [Cloud Adoption Framework](https://docs.microsoft.com/azure/cloud-adoption-framework/manage/azure-server-management). 

- [Security Center](azure/security-center/security-center-intro.md)
- [Backup](azure/backup/backup-overview.md)
- [Log Analytics](azure/azure-monitor/platform/log-analytics-agent.md)
- [Monitoring](azure/azure-monitor.md)
- [Update Management](azure/automation/update-management/update-mgmt-overview.md)
- [Change Tracking and Inventory](azure/automation/change-tracking.md)
- [Configuration Management](https://docs.microsoft.com/mem/configmgr/core/understand/configuration-manager-on-azure)
- [Automation Account](azure/automation/automation-create-standalone-account.md)
- [Iaas Antimalware](azure/security/fundamentals/antimalware.md)
- *and so many more*

For all of these services, we will auto-onboard, auto-configure, monitor for drift, and mediate if drift is detected.


## Enabling Automanage for VMs in Azure portal

In the Azure portal, you can enable Automanage on an existing virtual machine or when you are creating a new virtual machine. For concise steps to this process, check out the [Automanage for virtual machines quickstart](quick-create-virtual-machines-portal.md).

If this is your first time enabling Automanage for your VM, you can search in the Azure portal for **Automanage – virtual machines**, click **Enable on existing VM**, select the VMs you would like to onboard, click **Select**, click **Enable**, and you're done. It really is as simple as point, click, done, set it, and forget it. 

The only time you need to hear from us about this virtual machine is in the event we attempted to remediate your VM and failed to do so. If we successfully remediate your VM, we will bring it back into compliance without even alerting you.


## Configuration profiles

When you are enabling Automanage for your virtual machine, a configuration profile is required. The last used configuration profile is selected by default during the enabling process, but it can be easily adjusted. 

Configuration profiles are the the foundation of this service. They define exactly which services we onboard your machines to and to some extent what the configuration of those services would be. 

### Default configuration profiles

There are two configuration profiles currently available. 

- **Azure best practices – DevTest** configuration profile is specifically designed for DevTest machines. 
- **Azure best practices – Prod** configuration profile is for production.

The reason for this differentiator is, in a Production machine we will automatically onboard you to Azure Backup. However, for a DevTest machine, a backup service would be an unnecessary cost, since DevTest machines are often re-hydrated or completely flattened and re-provisioned on a very short cycle. DevTest machines also don’t typically contain sensitive data or production level data, therefore, there is no point in paying for a backup service for them. 

In addition to the standard services we onboard you to, we allow you to configure a certain subset of preferences within a range of configuration options that do not breach our best practices. For example, in the case of Azure Backup, we will allow you to define the frequency of the backup and which day of the week it occurs on. However, we will *not* allow you to switch off Azure Backup completely. 

> [!NOTE]
> In the DevTest configuration profile, we will not backup the VM at all. 

### Customizing a configuration profile

You can adjust a default configuration profile to create a custom one in which you will be able to change the settings. Learn how to set a custom configuration profile [here](virtual-machines-custom-config-profile.md).

> [!NOTE]
> You cannot change the configuration profile on your VM while Automanage is enabled. You will need to disable Automanage for that VM and then re-enable Automanage with the desired configuration profile and preferences.


## Automanage Account

The Automanage Account is the security context or the identity under which the automated operations occur. Typically, this is unnecessary for you to select, but if there was a delegation scenario where you wanted to divide the automated management (perhaps between two system administrators), this allows you to define an Azure identity for each of those administrators. 

In the Azure portal experience, when you are enabling Automanage on your VMs, there is an Advanced dropdown on the **Enable Azure VM best practice** blade that allows you to assign or manually create the Automanage Account. 



## Status of automanaged VMs

In the Azure portal, go to the **Automanage - virtual machines** page that lists all of your automanaged VMs. Here you will see the overall status of each automanaged virtual machine.

For each listed VM, you are able to click on hyperlinked details, such as the **Configuration profile**, **Configuration preferences**, and **Profile status**. 

When you click on a Configuration profile such as “Azure best practices – Prod”, it brings up details regarding that particular configuration profile as well as the preferences that you may have used to override certain pieces of the overall configuration. 

If your virtual machine is currently undergoing remediation, you can click on the hyperlink “**Remediation in progress**” in the Profile status column. It will show the **Compliance state** and the **Reason for non-compliance**.


## Disabling Automanage for VMs

You may decide one day to disable Automanage on certain VMs. For instance, your machine is running some super sensitive secure workload and you need to lock it down even further than Azure would have done naturally, so you need to configure the machine outside of Azure best practices. 

To do that in the Azure portal, go to the **Automanage - virtual machines** page that lists all of your automanaged VMs. Select the checkbox next to the virtual machine you want to disable from Automanage, then click on the **Disable automanagent** button. 

Please read carefully through the messaging in the resulting pop-up before agreeing to **Disable**. 

```
Disabling automanagement in a VM results in the following behavior:

1.	The configuration of the VM and the services it’s onboarded to will not be changed
2.	Any changes incurred by those services will remain billable and will continue to be incurred
3.	Any Automanage behaviors will stop immediately
```

First and foremost, we won’t offboard the virtual machine from any of the services that we onboarded it to and configured. So any charges incurred by those services will continue to remain billable. You will need to offboard if necessary. Any Automanage behavior will stop immediately. For example, we will no longer monitor the VM for drift. 


## Next steps 

In this article, you learned that Automanage for virtual machines provides a means for which you can eliminate the need for you to know of, onboard to, and configure best practices Azure services. In addition, if a machine you onboarded to Automanage for Virtual Machines drifts from the configuration profiles set up, we will automatically bring it back into compliance.

> [!div class="nextstepaction"]
> [Enable Automanage for virtual machines in the Azure portal](quick-create-virtual-machines-portal.md)
