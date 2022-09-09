---
title: Azure Automanage for virtual machines
description: Learn about Azure Automanage for virtual machines.
author: mmccrory
ms.service: automanage
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 8/25/2022
ms.author: memccror
ms.custom: references_regions
---

# Preview: Azure Automanage machine best practices

This article covers information about Azure Automanage for machine best practices, which have the following benefits:

- Intelligently onboards virtual machines to select best practices Azure services
- Automatically configures each service per Azure best practices
- Supports customization of best practice services
- Monitors for drift and corrects for it when detected
- Provides a simple experience (point, click, set, forget)

## Overview

Azure Automanage machine best practices is a service that eliminates the need to discover, know how to onboard, and how to configure certain services in Azure that would benefit your virtual machine. These services are considered to be Azure best practices services, and help enhance reliability, security, and management for virtual machines. Example services include [Azure Update Management](../automation/update-management/overview.md) and [Azure Backup](../backup/backup-overview.md).

After onboarding your machines to Azure Automanage, each best practice service is configured to its recommended settings. However, if you want to customize the best practice services and settings, you can use the [Custom Profile](#custom-profiles) option. 

Azure Automanage also automatically monitors for drift and corrects for it when detected. What this means is if your virtual machine or Arc-enabled server is onboarded to Azure Automanage, we'll monitor your machine to ensure that it continues to comply with its [configuration profile](#configuration-profile) across its entire lifecycle. If your virtual machine does drift or deviate from the profile (for example, if a service is off-boarded), we will correct it and pull your machine back into the desired state.

Automanage doesn't store/process customer data outside the geography your VMs are located. In the Southeast Asia region, Automanage does not store/process data outside of Southeast Asia.

> [!NOTE]
> Automanage can be enabled on Azure virtual machines and Azure Arc-enabled servers. Automanage is not available in US Government Cloud at this time.

## Prerequisites

There are several prerequisites to consider before trying to enable Azure Automanage on your virtual machines.

- Supported [Windows Server versions](automanage-windows-server.md#supported-windows-server-versions) and [Linux distros](automanage-linux.md#supported-linux-distributions-and-versions)
- Machines must be in a [supported region](#supported-regions)
- User must have correct [permissions](#required-rbac-permissions)
- Machines must meet the [eligibility requirements](#enabling-automanage-for-vms-in-azure-portal) 
- Automanage does not support Sandbox subscriptions at this time
- Automanage does not support [Trusted Launch VMs](../virtual-machines/trusted-launch.md)

### Supported regions
Automanage only supports VMs located in the following regions:
* West Europe
* North Europe
* Central US
* East US
* East US 2
* West US
* West US 2
* Canada Central
* West Central US
* South Central US
* Japan East
* UK South
* AU East
* AU Southeast
* Southeast Asia

> [!NOTE]
> If the machine is connected to a log analytics workspace, the log analytics workspace must be located in one of the supported regions listed above.

### Required RBAC permissions
To onboard, Automanage requires slightly different RBAC roles depending on whether you are enabling Automanage for the first time in a subscription.

If you are enabling Automanage for the first time in a subscription:
* **Owner** role on the subscription(s) containing your machines, _**or**_
* **Contributor** and **User Access Administrator** roles on the subscription(s) containing your machines

If you are enabling Automanage on a machine in a subscription that already has Automanage machines:
* **Contributor** role on the resource group containing your machines

The Automanage service will grant **Contributor** permission to this first party application (Automanage API Application Id: d828acde-4b48-47f5-a6e8-52460104a052) to perform actions on Automanaged machines. Guest users will need to have the **directory reader role** assigned to enable Automanage.

> [!NOTE]
> If you want to use Automanage on a VM that is connected to a workspace in a different subscription, you must have the permissions described above on each subscription.

## Participating services

:::image type="content" source="media\automanage-virtual-machines\intelligently-onboard-services-1.png" alt-text="Intelligently onboard services.":::

For the complete list of participating Azure services, as well as their supported profile, see the following:
- [Automanage for Linux](automanage-linux.md)
- [Automanage for Windows Server](automanage-windows-server.md)

 We will automatically onboard you to these participating services when you use the Best Practices Configuration Profiles. They are essential to our best practices white paper, which you can find in our [Cloud Adoption Framework](/azure/cloud-adoption-framework/manage/azure-server-management).


## Enabling Automanage for VMs in Azure portal

In the Azure portal, you can enable Automanage on an existing virtual machine. For concise steps to this process, check out the [Automanage for virtual machines quickstart](quick-create-virtual-machines-portal.md).

If it is your first time enabling Automanage for your VM, you can search in the Azure portal for **Automanage – Azure machine best practices**. Click **Enable on existing VM**, select the [configuration profile](#configuration-profile) you wish to use and then select the machines you would like to onboard. 

In the Machine selection pane in the portal, you will notice the **Eligibility** column. You can click **Show ineligible machines** to see machines ineligible for Automanage. Currently, machines can be ineligible for the following reasons:
- Machine is not using one of the supported images: [Windows Server versions](automanage-windows-server.md#supported-windows-server-versions) and [Linux distros](automanage-linux.md#supported-linux-distributions-and-versions)
- Machine is not located in a supported [region](#supported-regions)
- Machine's log analytics workspace is not located in a supported [region](#supported-regions)
- User does not have sufficient permissions to the log analytics workspace or to the machine. Check out the [required permissions](#required-rbac-permissions)
- Machine does not have necessary VM agents installed which the Automanage service requires. Check out the [Windows agent installation](../virtual-machines/extensions/agent-windows.md) and the [Linux agent installation](../virtual-machines/extensions/agent-linux.md)
- Arc machine is not connected. Learn more about the [Arc agent status](../azure-arc/servers/overview.md#agent-status) and [how to connect](../azure-arc/servers/deployment-options.md#agent-installation-details)

> [!NOTE]
> If the machine is powered off, you can still onboard the machine to Automanage. However, Automanage will report the machine as "Unknown" in the Automanage status because Automanage needs the machine to be powered on to assess if the machine is configured to the profile. Once you power on your machine, Automanage will try to onboard the machine to the selected configuration profile.

Once you have selected your eligible machines, Click **Enable**, and you're done.

The only time you might need to interact with this machine to manage these services is in the event we attempted to remediate your VM, but failed to do so. If we successfully remediate your VM, we will bring it back into compliance without even alerting you. For more details, see [Status of VMs](#status-of-vms).

## Enabling Automanage for VMs using Azure Policy
You can also enable Automanage on VMs at scale using the built-in Azure Policy. The policy has a DeployIfNotExists effect, which means that all eligible VMs located within the scope of the policy will be automatically onboarded to Automanage VM Best Practices.

A direct link to the policy using the built-in profiles is [here](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff889cab7-da27-4c41-a3b0-de1f6f87c550).

A direct link to the policy using a custom configuration profile is [here](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb025cfb4-3702-47c2-9110-87fe0cfcc99b).

For more information, check out how to enable the [Automanage built-in policy](virtual-machines-policy-enable.md). 

## Configuration Profile

When you are enabling Automanage for your machine, a configuration profile is required. Configuration profiles are the foundation of this service. They define which services we onboard your machines to and to some extent what the configuration of those services would be.

### Best Practice Configuration Profiles

There are two best practice configuration profiles currently available.

- **Dev/Test** profile is designed for Dev/Test machines.
- **Production** profile is for production.

The reason for this differentiator is because certain services are recommended based on the workload running. For instance, in a Production machine we will automatically onboard you to Azure Backup. However, for a Dev/Test machine, a backup service would be an unnecessary cost, since Dev/Test machines are typically lower business impact.

### Custom Profiles

Custom profiles allow you to customize the services and settings that you want to apply to your machines. This is a great option if your IT requirements differ from the best practices. For instance, if you do not want to use the Microsoft Antimalware solution because your IT organization requires you to use a different antimalware solution, then you can simply toggle off Microsoft Antimalware when creating a custom profile.

> [!NOTE]
> In the Best Practices Dev/Test configuration profile, we will not back up the VM at all.

> [!NOTE]
> If you want to change the configuration profile of a machine, you can simply reenable it with the desired configuration profile. However, if your machine status is "Needs Upgrade" then you will need to disable first and then reenable Automanage. 

For the complete list of participating Azure services and if they support preferences, see here:
- [Automanage for Linux](automanage-linux.md)
- [Automanage for Windows Server](automanage-windows-server.md)


## Status of VMs

In the Azure portal, go to the **Automanage – Azure machine best practices** page which lists all of your automanage machines. Here you will see the overall status of each machine.

:::image type="content" source="media\automanage-virtual-machines\configured-status.png" alt-text="List of configured virtual machines.":::

For each listed machine, the following details are displayed: Name, Configuration profile, Status, Resource type, Resource group, Subscription.

The **Status** column can display the following states:
- *In progress* - the VM is being configured
- *Conformant* - the VM is configured and no drift is detected
- *Not conformant* - the VM has drifted and Automanage was unable to correct one or more services to the assigned configuration profile 
- *Needs upgrade* - the VM is onboarded to an earlier version of Automanage and needs to be [upgraded](automanage-upgrade.md) to the latest version
- *Unknown* - the Automanage service is unable to determine the desired configuration of the machine. This is usually because the VM agent is not installed or the machine is not running. It can also indicate that the Automanage service does not have the necessary permissions that it needs to determine the desired configuration
- *Error* - the Automanage service encountered an error while attempting to determine if the machine conforms with the desired configuration

If you see the **Status** as *Not conformant* or *Error*, you can troubleshoot by clicking on the status in the portal and using the troubleshooting links provided


## Disabling Automanage for VMs

You may decide one day to disable Automanage on certain VMs. For instance, your machine is running some super sensitive secure workload and you need to lock it down even further than Azure would have done naturally, so you need to configure the machine outside of Azure best practices.

To do that in the Azure portal, go to the **Automanage – Azure machine best practices** page that lists all of your auto-managed VMs. Select the checkbox next to the virtual machine you want to disable from Automanage, then click on the **Disable automanagment** button.

:::image type="content" source="media\automanage-virtual-machines\disable-step-1.png" alt-text="Disabling Automanage on a virtual machine.":::

Read carefully through the messaging in the resulting pop-up before agreeing to **Disable**.

> [!NOTE]
> Disabling automanagement in a VM results in the following behavior:
>
> - The configuration of the VM and the services it is onboarded to don't change.
> - Any charges incurred by those services remain billable and continue to be incurred.
> - Automanage drift monitoring immediately stops.


First and foremost, we will not off-board the virtual machine from any of the services that we onboarded it to and configured. So any charges incurred by those services will continue to remain billable. You will need to off-board if necessary. Any Automanage behavior will stop immediately. For example, we will no longer monitor the VM for drift.

## Automanage and Azure Disk Encryption
Automanage is compatible with VMs that have Azure Disk Encryption (ADE) enabled.

If you are using the Production environment, you will also be onboarded to Azure Backup. There is one prerequisite to successfully using ADE and Azure Backup:
* Before you onboard your ADE-enabled VM to Automanage's Production environment, ensure that you have followed the steps located in the **Before you start** section of [this document](../backup/backup-azure-vms-encryption.md#before-you-start).

## Next steps

In this article, you learned that Automanage for machines provides a means for which you can eliminate the need for you to know of, onboard to, and configure best practices Azure services. In addition, if a machine you onboarded to Automanage for virtual machines drifts from the configuration profile, we will automatically bring it back into compliance.

Try enabling Automanage for Azure virtual machines or Arc-enabled servers in the Azure portal.

> [!div class="nextstepaction"]
> [Enable Automanage for virtual machines in the Azure portal](quick-create-virtual-machines-portal.md)