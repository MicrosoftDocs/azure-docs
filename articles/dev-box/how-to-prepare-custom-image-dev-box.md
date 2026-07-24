---
title: Prepare a custom image for Microsoft Dev Box
titleSuffix: Microsoft Dev Box
description: Learn how to prepare a custom Windows image that meets all Microsoft Dev Box requirements, including image definition configuration, OS requirements, disk configuration, and sysprep settings.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 03/18/2026
ms.topic: how-to
ai-usage: ai-assisted
ms.custom: awp-ai

#customer intent: As a platform engineer, I want to prepare a custom Windows image that meets all Microsoft Dev Box requirements so that I can use it to create consistent dev box definitions.
---

# Prepare a custom image for Microsoft Dev Box

This article explains how to prepare a custom Windows image so it passes Microsoft Dev Box image validation and can be used in dev box definitions.

If your image doesn't meet Dev Box requirements, validation can fail with an error like:

```console
Image failed to validate. SourceImageInvalid: The image is not valid. At this time, only generalized generation 2 Windows Enterprise (10, 11) images are supported.
```

## Prerequisites

- An Azure subscription.
- An Azure Compute Gallery with permissions to create image definitions and image versions.
- Permissions to create and manage gallery resources and role assignments, such as **Owner** or **Contributor** on the subscription or resource group that contains the gallery.
- Permissions to create or update Dev Box resources, such as **DevCenter Project Admin** (or higher) on the dev box project.

## Configure the image definition

Configure these settings when you create the Azure Compute Gallery image definition. You can't change these settings after the image definition is created.

- Security type: Trusted Launch
- VM generation: Generation 2 (Hyper-V v2)
- OS state: Generalized
- (Recommended) Enable hibernation support

The following Azure CLI example shows how to create an image definition with the required settings:

```azurecli
az login
az account set --subscription "<subscription-id>"

az sig image-definition create \
  --resource-group "your-resource-group" \
  --gallery-name "your-gallery-name" \
  --gallery-image-definition "your-image-definition" \
  --publisher "YourPublisher" \
  --offer "YourOffer" \
  --sku "YourSKU" \
  --os-type Windows \
  --os-state Generalized \
  --hyper-v-generation V2 \
  --features "IsHibernateSupported=true" "SecurityType=TrustedLaunch"
```

> [!IMPORTANT]
> Dev Box image requirements can be stricter than requirements for deploying a VM directly. For baseline gallery requirements and additional performance guidance, see [Configure Azure Compute Gallery for Microsoft Dev Box](how-to-configure-azure-compute-gallery.md).

## Verify operating system requirements

Use a Windows operating system that meets all requirements:

- Windows 10 Enterprise or Windows 11 Enterprise (supported version)
- Single-session image (multi-session images aren't supported)
- Standard edition (not N edition, not LTSC)
- General availability release

> [!TIP]
> Start from a Windows 365 or Dev Box-compatible Azure Marketplace image (for example, a Visual Studio image), then customize it for your organization.

For supported Windows versions and other baseline image requirements, see [Configure Azure Compute Gallery for Microsoft Dev Box](how-to-configure-azure-compute-gallery.md#image-version-requirements).

## Verify disk configuration

Make sure the image meets these disk requirements:

- OS disk size is 64 GB (default). Dev Box adjusts the OS disk size during provisioning.
- No data disks are attached to the VM before you capture the image.
- No recovery partition is present.
- BitLocker isn't enabled.
- No disk encryption set is applied to the image. Customer-managed keys (CMK) aren't supported for Dev Box images. Use platform-managed keys (PMK).

### Remove a recovery partition (if present)

If your source VM has a recovery partition, remove it before you run Sysprep and capture the image.

```console
diskpart
select disk 0
list partition
select partition <recovery_partition_number>
delete partition override
exit
```

> [!WARNING]
> Deleting partitions is destructive and can make the VM unbootable if you select the wrong partition. Validate the partition number carefully before you delete it.

## Verify pre-Sysprep requirements

Before you run Sysprep, confirm that the source VM has never been joined or enrolled in any identity or management service.

- Never joined to Active Directory
- Never joined to Microsoft Entra ID
- Never enrolled in Microsoft Intune
- Never enrolled for co-management

For background and troubleshooting, see [Sysprep won't run correctly on MDM-enrolled devices](/troubleshoot/mem/intune/device-enrollment/troubleshoot-sysprep-windows-10-device-enrolled-mdm).

## Run Sysprep

Run Sysprep with these required options:

- `/generalize` removes unique system information, such as SIDs.
- `/oobe` configures Windows to boot to the out-of-box experience.
- `/mode:vm` optimizes the image for VM deployment and avoids a lengthy driver search during first boot.

### Manual capture

Use `/shutdown` when you're manually capturing an image from the VM.

```console
C:\Windows\System32\Sysprep\sysprep.exe /generalize /oobe /mode:vm /shutdown
```

### Packer capture

If you're using HashiCorp Packer to build the image, use the quiet options because Packer controls shutdown and capture.

```console
C:\Windows\System32\Sysprep\sysprep.exe /generalize /oobe /mode:vm /quiet /quit
```

For more information about Sysprep options, see [Sysprep Command-Line Options](/windows-hardware/manufacture/desktop/sysprep-command-line-options?view=windows-11#modevm&preserve-view=true).

## Apply performance optimizations

The following optimizations are optional, but we recommend them to reduce provisioning time and improve startup performance.

### Enable Virtual Machine Platform

```powershell
Enable-WindowsOptionalFeature -FeatureName VirtualMachinePlatform -Online
```

### Disable reserved storage

```console
DISM.exe /Online /Set-ReservedStorageState /State:Disabled
```

### Clean up the component store

```console
DISM.exe /Online /Cleanup-Image /StartComponentCleanup
```

### Defragment the OS disk and optimize boot

```console
defrag c: /FreespaceConsolidate /Verbose
defrag c: /BootOptimize /Verbose
```

### Disable scheduled defragmentation

```powershell
Disable-ScheduledTask -TaskName "ScheduledDefrag" -TaskPath "\\Microsoft\\Windows\\Defrag"
```

> [!NOTE]
> For more performance guidance that can help reduce first-boot time, see [Configure Azure Compute Gallery for Microsoft Dev Box](how-to-configure-azure-compute-gallery.md#reduce-provisioning-and-startup-times).

## Configure Azure Compute Gallery permissions

To use a gallery image in a dev box definition, Dev Box validates the image and replicates it to the regions required by your network connections. The Dev Box service performs these actions by using the dev center's managed identity.

At a minimum, make sure that:

- You're using a standard Azure Compute Gallery (not a community gallery).
- Your dev center has a managed identity configured.
- The dev center managed identity has the **Contributor** role on the gallery.
- Your image is replicated to the target regions where dev boxes are created.

For detailed gallery configuration steps, see [Configure Azure Compute Gallery for Microsoft Dev Box](how-to-configure-azure-compute-gallery.md).

## Configure Packer (if applicable)

If you use HashiCorp Packer with the `azure-arm` builder, make sure your `source` configuration creates a Trusted Launch VM.

Ensure your `source "azure-arm"` block includes:

- `secure_boot_enabled = true`
- `vtpm_enabled = true`
- `security_type = "TrustedLaunch"`
- Base image is Windows 10/11 Enterprise from Marketplace
- Target image definition has Trusted Launch security type

The following example shows the required settings:

```hcl
source "azure-arm" "devbox" {
 # Trusted Launch (REQUIRED)
  secure_boot_enabled = true
  vtpm_enabled        = true
  security_type       = "TrustedLaunch"
  
  # VM settings
  vm_size      = "Standard_D8s_v5"
  license_type = "Windows_Client"
  os_type      = "Windows"
  
  # Base image
  image_publisher = "MicrosoftWindowsDesktop"
  image_offer     = "windows-11"
  image_sku       = "win11-23h2-ent"
  image_version   = "latest"
  
  # Gallery destination
  shared_image_gallery_destination {
    gallery_name         = "your_gallery_name"
    image_name           = "your_image_definition"
    image_version        = "1.0.0"
    replication_regions  = ["eastus", "westus2"]
    storage_account_type = "Premium_LRS"
  }
}
```

A reference implementation is available in the [carmada-dev/demo-images](https://github.com/carmada-dev/demo-images) repository.

## Quick reference

Use the following table to quickly verify the most common Dev Box image validation requirements.

| Setting | Required value |
|---|---|
| Security type | Trusted Launch |
| VM generation | Gen2 |
| OS state | Generalized |
| OS | Windows 10/11 Enterprise (single-session) |
| OS disk | 64 GB default, no data disks |
| Recovery partition | None |
| Encryption | Platform-managed keys (no BitLocker) |
| Sysprep options | `/generalize /oobe /mode:vm` |
| Active Directory domain join or Microsoft Entra ID join | Never joined |
| MDM enrollment | Never enrolled |
| Gallery type | Standard (not community) |

## Related content

- [Configure Azure Compute Gallery for Microsoft Dev Box](how-to-configure-azure-compute-gallery.md)
- [Authenticate to Microsoft Dev Box](how-to-authenticate.md)
- [Microsoft Dev Box architecture and key concepts](concept-dev-box-architecture.md)
- [Trusted Launch for Azure virtual machines](/azure/virtual-machines/trusted-launch)
- [Sysprep Command-Line Options](/windows-hardware/manufacture/desktop/sysprep-command-line-options)
- [carmada-dev/demo-images](https://github.com/carmada-dev/demo-images)
