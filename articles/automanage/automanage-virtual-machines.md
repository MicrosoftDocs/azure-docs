---
title: Azure Automanage for virtual machines
description: Learn about Azure Automanage for virtual machines.
author: DavidCBerry13
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 09/04/2020
ms.author: daberry
---

# Azure Automanage for virtual machines

This article covers information about Azure Automanage for virtual machines, which have the following benefits:

1.	Intelligently onboards to select best practices Azure services
2.	Automatically configures each service per Azure best practices
3.	Configures the guest operating system per Microsoft baseline configuration
4.	Monitors for drift and corrects for it when detected
5.	Provides a simple experience (point, click, set, forget)


## Overview

Azure Automanage for virtual machines is a service that eliminates the need to discover, know how to onboard, and how to configure certain services in Azure that would benefit your virtual machine. We consider these beneficial services to be the best practices Azure services, such as [Azure Update Management](../automation/update-management/update-mgmt-overview.md) and [Azure Backup](../backup/backup-overview.md) - just to name a few. 

After onboarding your machines to select best practices Azure services, it automatically configures each of those services per Azure’s own set of best practices. Best practices are different for each of the services. An example might be Azure Backup, where the best practice might be to back up the virtual machine once a day and have a retention period of six months. 

Azure Automanage also configures the guest operating system per Microsoft’s own [baseline configurations](https://docs.microsoft.com/windows/security/threat-protection/windows-security-baselines). Additionally, it automatically monitors for drift and corrects for it when detected. What this means is if your virtual machine is onboarded to Azure Automanage, we’ll not only configure it per Azure best practices, but we’ll monitor your machine to ensure that it continues to comply with those best practices across its entire lifecycle. If your virtual machine does drift or deviate from those practices, we will correct it and pull your machine back into the desired state. 

Lastly, the experience is incredibly simple.


## Participating services

See [Azure Automanage for Virtual Machines Best Practices](virtual-machines-best-practices.md) for the complete list of participating Azure services, as well as their supported configuration profiles.

 We will automatically onboard you to these participating services. They are essential to our best practices white paper, which you can find in our [Cloud Adoption Framework](https://docs.microsoft.com/azure/cloud-adoption-framework/manage/azure-server-management).

For all of these services, we will auto-onboard, autoconfigure, monitor for drift, and mediate if drift is detected.


## Enabling Automanage for VMs in Azure portal

In the Azure portal, you can enable Automanage on an existing virtual machine or when you are creating a new virtual machine. For concise steps to this process, check out the [Automanage for virtual machines quickstart](quick-create-virtual-machines-portal.md).

> [!NOTE]
> The following RBAC permission is needed to enable Automanage: **Owner** role or **Contributor** along with **User Access Administrator** roles.

If it is your first time enabling Automanage for your VM, you can search in the Azure portal for **Automanage – Azure virtual machine best practices**. Click **Enable on existing VM**, select the VMs you would like to onboard, click **Select**, click **Enable**, and you're done. It really is as simple as point, click, done, set it, and forget it. 

The only time you need to hear from us about this virtual machine is in the event we attempted to remediate your VM and failed to do so. If we successfully remediate your VM, we will bring it back into compliance without even alerting you.


## Configuration profiles

When you are enabling Automanage for your virtual machine, a configuration profile is required. The last used configuration profile is selected by default during the enabling process, but it can be easily adjusted. 

Configuration profiles are the foundation of this service. They define exactly which services we onboard your machines to and to some extent what the configuration of those services would be. 

### Default configuration profiles

There are two configuration profiles currently available. 

- **Azure virtual machines best practices - Dev/Test** configuration profile is designed for Dev/Test machines. 
- **Azure virtual machine best practices - Production** configuration profile is for production.

The reason for this differentiator is, in a Production machine we will automatically onboard you to Azure Backup. However, for a Dev/Test machine, a backup service would be an unnecessary cost, since Dev/Test machines are often rehydrated or flattened and reprovisioned on a short cycle. Dev/Test machines also don’t typically contain sensitive data or production level data, therefore, there is no point in paying for a backup service for them. 

In addition to the standard services we onboard you to, we allow you to configure a certain subset of preferences. These adjustments are allowed within a range of configuration options that do not breach our best practices. For example, in the case of Azure Backup we will allow you to define the frequency of the backup and which day of the week it occurs on. However, we will *not* allow you to switch off Azure Backup completely. 

> [!NOTE]
> In the Dev/Test configuration profile, we will not backup the VM at all. 

### Customizing a configuration profile

You can adjust a default configuration profile to create a custom one in which you will be able to change the settings. Learn how to set a custom configuration profile [here](virtual-machines-custom-config-profile.md).

> [!NOTE]
> You cannot change the configuration profile on your VM while Automanage is enabled. You will need to disable Automanage for that VM and then re-enable Automanage with the desired configuration profile and preferences.


## Automanage Account

The Automanage Account is the security context or the identity under which the automated operations occur. Typically, the Automanage Account option is unnecessary for you to select, but if there was a delegation scenario where you wanted to divide the automated management (perhaps between two system administrators), this option allows you to define an Azure identity for each of those administrators. 

In the Azure portal experience, when you are enabling Automanage on your VMs, there is an Advanced dropdown on the **Enable Azure VM best practice** blade that allows you to assign or manually create the Automanage Account. 

> [!NOTE]
> The following RBAC permission is needed to enable Automanage: **Owner** role or **Contributor** along with **User Access Administrator** roles.


## Status of VMs

In the Azure portal, go to the **Automanage – Azure virtual machine best practices** page which lists all of your auto-managed VMs. Here you will see the overall status of each virtual machine.

For each listed VM, the following details are displayed: Name, Configuration profile, Configuration preference, Status, Account, Subscription, and Resource group.

The **Status** column can display the following states:
- *In-progress* - the VM was just enabled and is being configured
- *Configured* - the VM is configured and no drift is detected
- *Failed* - the VM has drifted and we were unable to remediate

If you see the **Status** as *Failed*, you can troubleshoot the deployment through the Resource Group your VM is located in. Go to **Resource groups**, select your resource group, click on **Deployments** and see the *Failed* status there along with error details. 


## Disabling Automanage for VMs

You may decide one day to disable Automanage on certain VMs. For instance, your machine is running some super sensitive secure workload and you need to lock it down even further than Azure would have done naturally, so you need to configure the machine outside of Azure best practices. 

To do that in the Azure portal, go to the **Automanage – Azure virtual machine best practices** page that lists all of your auto-managed VMs. Select the checkbox next to the virtual machine you want to disable from Automanage, then click on the **Disable automanagent** button. 

Read carefully through the messaging in the resulting pop-up before agreeing to **Disable**. 

```
Disabling automanagement in a VM results in the following behavior:

1.	The configuration of the VM and the services it’s onboarded to will not be changed
2.	Any changes incurred by those services will remain billable and will continue to be incurred
3.	Any Automanage behaviors will stop immediately
```

First and foremost, we will not off-board the virtual machine from any of the services that we onboarded it to and configured. So any charges incurred by those services will continue to remain billable. You will need to off-board if necessary. Any Automanage behavior will stop immediately. For example, we will no longer monitor the VM for drift. 


## Next steps 

In this article, you learned that Automanage for virtual machines provides a means for which you can eliminate the need for you to know of, onboard to, and configure best practices Azure services. In addition, if a machine you onboarded to Automanage for Virtual Machines drifts from the configuration profiles set up, we will automatically bring it back into compliance.

Try enabling Automanage for virtual machines in the Azure portal.

> [!div class="nextstepaction"]
> [Enable Automanage for virtual machines in the Azure portal](quick-create-virtual-machines-portal.md)
