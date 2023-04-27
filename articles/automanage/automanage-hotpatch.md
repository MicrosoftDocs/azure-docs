---
title: Hotpatch for Windows Server Azure Edition
description: Learn how hotpatch for Windows Server Azure Edition works and how to enable it
author: ju-shim
ms.service: automanage
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 04/18/2023
ms.author: jushiman
ms.custom: devx-track-azurepowershell
---

# Hotpatch for new virtual machines

> [!IMPORTANT]
> Hotpatch is currently in Public Preview. An opt-in procedure is needed to use the hotpatch capability described below. This preview is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!NOTE]
> Hotpatch is supported on _Windows Server 2022 Datacenter: Azure Edition_.

Hotpatching is a new way to install updates on supported _Windows Server Azure Edition_ virtual machines (VMs) that doesn’t require a reboot after installation. This article covers information about hotpatch for supported _Windows Server Azure Edition_ VMs, which has the following benefits:
* Lower workload impact with less reboots
* Faster deployment of updates as the packages are smaller, install faster, and have easier patch orchestration with Azure Update Manager
* Better protection, as the hotpatch update packages are scoped to Windows security updates that install faster without rebooting

## How hotpatch works

Hotpatch works by first establishing a baseline with a Windows Update Latest Cumulative Update. Hotpatches are periodically released (for example, on the second Tuesday of the month) that builds on that baseline. Hotpatches will contain updates that don't require a reboot. Periodically (starting at every three months), the baseline is refreshed with a new Latest Cumulative Update.

:::image type="content" source="media\automanage-hotpatch\hotpatch-sample-schedule.png" alt-text="Hotpatch Sample Schedule.":::

There are two types of baselines: **Planned baselines** and **Unplanned baselines**.
*  **Planned baselines** are released on a regular cadence, with hotpatch releases in between. Planned baselines include all the updates in a comparable _Latest Cumulative Update_ for that month, and require a reboot.
    * The sample schedule above illustrates four planned baseline releases in a calendar year (five total in the diagram), and eight hotpatch releases.
* **Unplanned baselines** are released when an important update (such as a zero-day fix) is released, and that particular update can't be released as a hotpatch. When unplanned baselines are released, a hotpatch release will be replaced with an unplanned baseline in that month. Unplanned baselines also include all the updates in a comparable _Latest Cumulative Update_ for that month, and also require a reboot.
    * The sample schedule above illustrates two unplanned baselines that would replace the hotpatch releases for those months (the actual number of unplanned baselines in a year isn't known in advance).

## Regional availability
Hotpatch is available in all global Azure regions.

## How to get started

> [!NOTE]
> You can preview onboarding Automanage machine best practices during VM creation in the Azure portal using [this link](https://aka.ms/AzureEdition).

To start using hotpatch on a new VM, follow these steps:
1.  Start creating a new VM from the Azure portal
    * You can preview onboarding Automanage machine best practices during VM creation in the Azure portal by visiting the [Azure Marketplace](https://aka.ms/AzureEdition).
1.  Supply details during VM creation
    * Ensure that a supported _Windows Server Azure Edition_ image is selected in the Image dropdown. See [automanage windows server services](automanage-windows-server-services-overview.md#getting-started-with-windows-server-azure-edition) to determine which images are supported.
    * On the Management tab under section ‘Guest OS updates’, the checkbox for 'Enable hotpatch' will be selected. Patch orchestration options are set to 'Azure-orchestrated'. 
    * If you create a VM by visiting the [Azure Marketplace](https://aka.ms/AzureEdition), on the Management tab under section 'Azure Automanage', select 'Dev/Test' or 'Production' for 'Azure Automanage environment' to evaluate Automanage machine best practices while in preview.
    
1. Create your new VM

<!--
## Enabling preview access

### REST API

The following example describes how to enable the preview for your subscription:

```
POST on `/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/Microsoft.Compute/features/InGuestHotPatchVMPreview/register?api-version=2015-12-01`
POST on `/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/Microsoft.Compute/features/InGuestAutoPatchVMPreview/register?api-version=2015-12-01`
POST on `/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/Microsoft.Compute/features/InGuestPatchVMPreview/register?api-version=2015-12-01`
```

Feature registration can take up to 15 minutes. To check the registration status:

```
GET on `/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/Microsoft.Compute/features/InGuestHotPatchVMPreview?api-version=2015-12-01`
GET on `/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/Microsoft.Compute/features/InGuestAutoPatchVMPreview?api-version=2015-12-01`
GET on `/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/Microsoft.Compute/features/InGuestPatchVMPreview?api-version=2015-12-01`
```

Once the feature has been registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider.

```
POST on `/subscriptions/{subscriptionId}/providers/Microsoft.Compute/register?api-version=2019-12-01`
```

### Azure PowerShell

Use the ```Register-AzProviderFeature``` cmdlet to enable the preview for your subscription.

``` PowerShell
Register-AzProviderFeature -FeatureName InGuestHotPatchVMPreview -ProviderNamespace Microsoft.Compute
Register-AzProviderFeature -FeatureName InGuestAutoPatchVMPreview -ProviderNamespace Microsoft.Compute
Register-AzProviderFeature -FeatureName InGuestPatchVMPreview -ProviderNamespace Microsoft.Compute
```

Feature registration can take up to 15 minutes. To check the registration status:

``` PowerShell
Get-AzProviderFeature -FeatureName InGuestHotPatchVMPreview -ProviderNamespace Microsoft.Compute
Get-AzProviderFeature -FeatureName InGuestAutoPatchVMPreview -ProviderNamespace Microsoft.Compute
Get-AzProviderFeature -FeatureName InGuestPatchVMPreview -ProviderNamespace Microsoft.Compute
```

Once the feature has been registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider.

``` PowerShell
Register-AzResourceProvider -ProviderNamespace Microsoft.Compute
```

### Azure CLI

Use ```az feature register``` to enable the preview for your subscription.

```
az feature register --namespace Microsoft.Compute --name InGuestHotPatchVMPreview
az feature register --namespace Microsoft.Compute --name InGuestAutoPatchVMPreview
az feature register --namespace Microsoft.Compute --name InGuestPatchVMPreview
```

Feature registration can take up to 15 minutes. To check the registration status:
```
az feature show --namespace Microsoft.Compute --name InGuestHotPatchVMPreview
az feature show --namespace Microsoft.Compute --name InGuestAutoPatchVMPreview
az feature show --namespace Microsoft.Compute --name InGuestPatchVMPreview
```

Once the feature has been registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider.

```
az provider register --namespace Microsoft.Compute
```
-->

## Patch installation

[Automatic VM Guest Patching](../virtual-machines/automatic-vm-guest-patching.md) is enabled automatically for all VMs created with a supported _Windows Server Azure Edition_ image. With automatic VM guest patching enabled:
* Patches classified as Critical or Security are automatically downloaded and applied on the VM.
* Patches are applied during off-peak hours in the VM's time zone.
* Patch orchestration is managed by Azure and patches are applied following [availability-first principles](../virtual-machines/automatic-vm-guest-patching.md#availability-first-updates).
* Virtual machine health, as determined through platform health signals, is monitored to detect patching failures.

## How does automatic VM guest patching work?

When [Automatic VM Guest Patching](../virtual-machines/automatic-vm-guest-patching.md) is enabled on a VM, the available Critical and Security patches are downloaded and applied automatically. This process kicks off automatically every month when new patches are released. Patch assessment and installation are automatic, and the process includes rebooting the VM as required.

With hotpatch enabled on supported _Windows Server Azure Edition_ VMs, most monthly security updates are delivered as hotpatches that don't require reboots. Latest Cumulative Updates sent on planned or unplanned baseline months require VM reboots. Additional Critical or Security patches may also be available periodically, which may require VM reboots.

The VM is assessed automatically every few days and multiple times within any 30-day period to determine the applicable patches for that VM. This automatic assessment ensures that any missing patches are discovered at the earliest possible opportunity.

Patches are installed within 30 days of the monthly patch releases, following [availability-first principles](../virtual-machines/automatic-vm-guest-patching.md#availability-first-updates). Patches are installed only during off-peak hours for the VM, depending on the time zone of the VM. The VM must be running during the off-peak hours for patches to be automatically installed. If a VM is powered off during a periodic assessment, the VM is assessed and applicable patches are installed automatically during the next periodic assessment when the VM is powered on. The next periodic assessment usually happens within a few days.

Definition updates and other patches not classified as Critical or Security won't be installed through automatic VM guest patching.

## Understanding the patch status for your VM

To view the patch status for your VM, navigate to the **Guest + host updates** section for your VM in the Azure portal. Under the **Guest OS updates** section, select ‘Go to Hotpatch (Preview)’ to view the latest patch status for your VM.

On this screen, you'll see the hotpatch status for your VM. You can also review if there any available patches for your VM that haven't been installed. As described in the ‘Patch installation’ section above, all security and critical updates are automatically installed on your VM using [Automatic VM Guest Patching](../virtual-machines/automatic-vm-guest-patching.md) and no extra actions are required. Patches with other update classifications aren't automatically installed. Instead, they're viewable in the list of available patches under the ‘Update compliance’ tab. You can also view the history of update deployments on your VM through the ‘Update history’. Update history from the past 30 days is displayed, along with patch installation details.


:::image type="content" source="media\automanage-hotpatch\hotpatch-management-ui.png" alt-text="Hotpatch Management.":::

With automatic VM guest patching, your VM is periodically and automatically assessed for available updates. These periodic assessments ensure that available patches are detected. You can view the results of the assessment on the Updates screen above, including the time of the last assessment. You can also choose to trigger an on-demand patch assessment for your VM at any time using the ‘Assess now’ option and review the results after assessment completes.

Similar to on-demand assessment, you can also install patches on-demand for your VM using the ‘Install updates now’ option. Here you can choose to install all updates under specific patch classifications. You can also specify updates to include or exclude by providing a list of individual knowledge base articles. Patches installed on-demand aren't installed using availability-first principles and may require more reboots and VM downtime for update installation.

## Supported updates

Hotpatch covers Windows Security updates and maintains parity with the content of security updates issued to in the regular (non-hotpatch) Windows update channel.

There are some important considerations to running a supported _Windows Server Azure Edition_ VM with hotpatch enabled. Reboots are still required to install updates that aren't included in the hotpatch program. Reboots are also required periodically after a new baseline has been installed. These reboots keep the VM in sync with non-security patches included in the latest cumulative update.
* Patches that are currently not included in the hotpatch program include non-security updates released for Windows, and non-Windows updates (such as .NET patches).  These types of patches need to be installed during a baseline month, and will require a reboot.

## Frequently asked questions

### What is hotpatching?

* Hotpatching is a new way to install updates on a supported _Windows Server Azure Edition_ VM in Azure that doesn’t require a reboot after installation. It works by patching the in-memory code of running processes without the need to restart the process.

### How does hotpatching work?

* Hotpatching works by establishing a baseline with a Windows Update Latest Cumulative Update, then builds upon that baseline with updates that don’t require a reboot to take effect.  The baseline is updated periodically with a new cumulative update. The cumulative update includes all security and quality updates and requires a reboot.

### Why should I use hotpatch?

* When you use hotpatch on a supported _Windows Server Azure Edition_ image, your VM will have higher availability (fewer reboots), and faster updates (smaller packages that are installed faster without the need to restart processes). This process results in a VM that is always up to date and secure.

### What types of updates are covered by hotpatch?

* Hotpatch currently covers Windows security updates.

### When will I receive the first hotpatch update?

* Hotpatch updates are typically released on the second Tuesday of each month. For more information, see below.

### What will the hotpatch schedule look like?

* Hotpatching works by establishing a baseline with a Windows Update Latest Cumulative Update, then builds upon that baseline with hotpatch updates released monthly. Baselines will be released starting out every three months. See the image below for an example of an annual three-month schedule (including example unplanned baselines due to zero-day fixes).

    :::image type="content" source="media\automanage-hotpatch\hotpatch-sample-schedule.png" alt-text="Hotpatch Sample Schedule.":::

### Are reboots still needed for a VM enrolled in hotpatch?

* Reboots are still required to install updates not included in the hotpatch program, and are required periodically after a baseline (Windows Update Latest Cumulative Update) has been installed. This reboot will keep your VM in sync with all the patches included in the cumulative update. Baselines (which require a reboot) will start out on a three-month cadence and increase over time.

### Are my applications affected when a hotpatch update is installed?

* Because hotpatch patches the in-memory code of running processes without the need to restart the process, your applications are unaffected by the patching process. This is separate from any potential performance and functionality implications of the patch itself.

### Can I turn off hotpatch on my VM?

* You can turn off hotpatch on a VM via the Azure portal.  Turning off hotpatch will unenroll the VM from hotpatch, which reverts the VM to typical update behavior for Windows Server.  Once you unenroll from hotpatch on a VM, you can re-enroll that VM when the next hotpatch baseline is released.

### Can I upgrade from my existing Windows Server OS?

* Yes, upgrading from existing versions of Windows Server (such as Windows Server 2016 or Windows Server 2019) to _Windows Server 2022 Datacenter: Azure Edition_ is supported. 

### How can I get troubleshooting support for hotpatching?

* You can file a [technical support case ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). For the Service option, search for and select **Virtual Machine running Windows** under Compute. Select **Azure Features** for the problem type and **Automatic VM Guest Patching** for the problem subtype.

## Next steps

* Learn about [Azure Update Management](../automation/update-management/overview.md)
* Learn more about [Automatic VM Guest Patching](../virtual-machines/automatic-vm-guest-patching.md)
* Learn more about [Automanage for Windows Server](automanage-windows-server-services-overview.md)
