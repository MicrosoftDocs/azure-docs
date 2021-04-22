---
title: Azure Automanage for virtual machines
description: Learn about Azure Automanage for virtual machines.
author: deanwe
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 02/23/2021
ms.author: deanwe
ms.custom: references_regions
---

# Azure Automanage for virtual machines

This article covers information about Azure Automanage for virtual machines, which have the following benefits:

- Intelligently onboards virtual machines to select best practices Azure services
- Automatically configures each service per Azure best practices
- Monitors for drift and corrects for it when detected
- Provides a simple experience (point, click, set, forget)


## Overview

Azure Automanage for virtual machines is a service that eliminates the need to discover, know how to onboard, and how to configure certain services in Azure that would benefit your virtual machine. These services are considered to be Azure best practices services, and help enhance reliability, security, and management for virtual machines. Example services include [Azure Update Management](../automation/update-management/overview.md) and [Azure Backup](../backup/backup-overview.md).

After onboarding your virtual machines to Azure Automanage, each best practice service is configured to its recommended settings. Best practices are different for each of the services. An example might be Azure Backup, where the best practice might be to back up the virtual machine once a day and have a retention period of six months.

Azure Automanage also automatically monitors for drift and corrects for it when detected. What this means is if your virtual machine is onboarded to Azure Automanage, we'll not only configure it per Azure best practices, but we'll monitor your machine to ensure that it continues to comply with those best practices across its entire lifecycle. If your virtual machine does drift or deviate from those practices (for example, if a service is offboarded), we will correct it and pull your machine back into the desired state.

## Prerequisites

There are several prerequisites to consider before trying to enable Azure Automanage on your virtual machines.

- Supported [Windows Server versions](automanage-windows-server.md#supported-windows-server-versions) and [Linux distros](automanage-linux.md#supported-linux-distributions-and-versions)
- VMs must be in a supported region (see below)
- User must have correct permissions (see below)
- Automanage does not support Sandbox subscriptions at this time

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

### Required RBAC permissions
Your account will require slightly different RBAC roles depending on whether you are enabling Automanage with a new Automanage account.

If you are enabling Automanage with a new Automanage account:
* **Owner** role on the subscription(s) containing your VMs, _**or**_
* **Contributor** and **User Access Administrator** roles on the subscription(s) containing your VMs

If you are enabling Automanage with an existing Automanage account:
* **Contributor** role on the resource group containing your VMs

The Automanage account will be granted **Contributor** and **Resource Policy Contributor** permissions to perform actions on Automanaged machines.

> [!NOTE]
> If you want to use Automanage on a VM that is connected to a workspace in a different subscription, you must have the permissions described above on each subscription.

## Participating services

:::image type="content" source="media\automanage-virtual-machines\intelligently-onboard-services-1.png" alt-text="Intelligently onboard services.":::

For the complete list of participating Azure services, as well as their supported environment, see the following:
- [Automanage for Linux](automanage-linux.md)
- [Automanage for Windows Server](automanage-windows-server.md)

 We will automatically onboard you to these participating services. They are essential to our best practices white paper, which you can find in our [Cloud Adoption Framework](/azure/cloud-adoption-framework/manage/azure-server-management).

For all of these services, we will auto-onboard, auto-configure, monitor for drift, and mediate if drift is detected.


## Enabling Automanage for VMs in Azure portal

In the Azure portal, you can enable Automanage on an existing virtual machine or when you are creating a new virtual machine. For concise steps to this process, check out the [Automanage for virtual machines quickstart](quick-create-virtual-machines-portal.md).

If it is your first time enabling Automanage for your VM, you can search in the Azure portal for **Automanage – Azure virtual machine best practices**. Click **Enable on existing VM**, select the VMs you would like to onboard, click **Select**, click **Enable**, and you're done.

The only time you might need to interact with this VM to manage these services is in the event we attempted to remediate your VM, but failed to do so. If we successfully remediate your VM, we will bring it back into compliance without even alerting you. For more details, see [Status of VMs](#status-of-vms).

## Enabling Automanage for VMs using Azure Policy
You can also enable Automanage on VMs at scale using the built-in Azure Policy. The policy has a DeployIfNotExists effect, which means that all eligible VMs located within the scope of the policy will be automatically onboarded to Automanage VM Best Practices.

A direct link to the policy is [here](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F270610db-8c04-438a-a739-e8e6745b22d3).

### How to apply the policy
1. Click the **Assign** button when viewing the policy definition
1. Select the scope at which you want to apply the policy (can be management group, subscription, or resource group)
1. Under **Parameters**, specify parameters for the Automanage account, Configuration profile, and Effect (the effect should usually be DeployIfNotExists)
    1. If you don't have an Automanage account, you will have to [create one](./automanage-account.md).
1. Under **Remediation**, check the "Click a remediation task" checkbox. This will perform onboarding to Automanage.
1. Click **Review + create** and ensure that all settings look good.
1. Click **Create**.

## Environment configuration

When you are enabling Automanage for your virtual machine, an environment is required. Environments are the foundation of this service. They define which services we onboard your machines to and to some extent what the configuration of those services would be.

### Default environments

There are two environments currently available.

- **Dev/Test** environment is designed for Dev/Test machines.
- **Production** environment is for production.

The reason for this differentiator is because certain services are recommended based on the workload running. For instance, in a Production machine we will automatically onboard you to Azure Backup. However, for a Dev/Test machine, a backup service would be an unnecessary cost, since Dev/Test machines are typically lower business impact.

### Customizing an environment using preferences

In addition to the standard services we onboard you to, we allow you to configure a certain subset of preferences. These preferences are allowed within a range of configuration options. For example, in the case of Azure Backup we will allow you to define the frequency of the backup and which day of the week it occurs on.

> [!NOTE]
> In the Dev/Test environment, we will not back up the VM at all.

You can adjust the settings of a default environment through preferences. Learn how to create a preference [here](virtual-machines-custom-preferences.md).

> [!NOTE]
> You cannot change the enivonrment configuration on your VM while Automanage is enabled. You will need to disable Automanage for that VM and then re-enable Automanage with the desired environment and preferences.

For the complete list of participating Azure services and if they support preferences, see here:
- [Automanage for Linux](automanage-windows-server.md)
- [Automanage for Windows Server](automanage-windows-server.md)


## Automanage Account

The Automanage Account is the security context or the identity under which the automated operations occur. Typically, the Automanage Account option is unnecessary for you to select, but if there was a delegation scenario where you wanted to divide the automated management of your resources (perhaps between two system administrators), the Automanage Account option in the enablement flow allows you to define an Azure identity for each of those administrators.

To learn more about the Automanage account and how to create one, visit the [Automanage Account document](./automanage-account.md).

## Status of VMs

In the Azure portal, go to the **Automanage – Azure virtual machine best practices** page which lists all of your auto-managed VMs. Here you will see the overall status of each virtual machine.

:::image type="content" source="media\automanage-virtual-machines\configured-status.png" alt-text="List of configured virtual machines.":::

For each listed VM, the following details are displayed: Name, Environment, Configuration preference, Status, Operating System, Account, Subscription, and Resource group.

The **Status** column can display the following states:
- *In-progress* - the VM was just enabled and is being configured
- *Configured* - the VM is configured and no drift is detected
- *Failed* - the VM has drifted and we were unable to remediate
- *Pending* - the VM is currently not running, and Automanage will attempt to onboard or remediate the VM when it is next running

If you see the **Status** as *Failed*, you can troubleshoot the deployment through the Resource Group your VM is located in. Go to **Resource groups**, select your resource group, click on **Deployments** and see the *Failed* status there along with error details.


## Disabling Automanage for VMs

You may decide one day to disable Automanage on certain VMs. For instance, your machine is running some super sensitive secure workload and you need to lock it down even further than Azure would have done naturally, so you need to configure the machine outside of Azure best practices.

To do that in the Azure portal, go to the **Automanage – Azure virtual machine best practices** page that lists all of your auto-managed VMs. Select the checkbox next to the virtual machine you want to disable from Automanage, then click on the **Disable automanagment** button.

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
* Before you onboard your ADE-enabled VM to Automanage's Production environment, ensure that you have followed the steps located in the **Before you start** section of [this document](https://docs.microsoft.com/azure/backup/backup-azure-vms-encryption#before-you-start).

## Next steps

In this article, you learned that Automanage for virtual machines provides a means for which you can eliminate the need for you to know of, onboard to, and configure best practices Azure services. In addition, if a machine you onboarded to Automanage for virtual machines drifts from the environment setup, we will automatically bring it back into compliance.

Try enabling Automanage for virtual machines in the Azure portal.

> [!div class="nextstepaction"]
> [Enable Automanage for virtual machines in the Azure portal](quick-create-virtual-machines-portal.md)