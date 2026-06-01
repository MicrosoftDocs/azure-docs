---
title: Troubleshoot custom image validation for Microsoft Dev Box
titleSuffix: Microsoft Dev Box
description: Learn how to troubleshoot custom image validation failures in Microsoft Dev Box, including how to test images with equivalent VMs, understand Dev Box architecture differences, and resolve common validation errors.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 03/18/2026
ms.topic: troubleshooting
ai-usage: ai-assisted
ms.custom: awp-ai

#customer intent: As a platform engineer, I want to troubleshoot custom image validation failures in Microsoft Dev Box so that I can identify and fix issues that prevent my image from being used in dev box definitions.
---

# Troubleshoot custom image validation for Microsoft Dev Box

This article helps you diagnose custom image validation failures when your image appears to meet requirements and works when deployed as an Azure VM, but fails Dev Box definition validation.

## Prerequisites

- Permissions to read and manage the Azure Compute Gallery image and related resources, such as **Owner** or **Contributor** on the subscription or resource group that contains the gallery.
- Permissions to create or update Dev Box resources, such as **DevCenter Project Admin** (or higher) on the dev box project.

## Verify your image meets requirements

Start by verifying that your image meets Dev Box requirements (Trusted Launch, Generation 2, generalized, Windows 10/11 Enterprise, and required disk configuration).

For a complete preparation walkthrough, see [Prepare a custom image for Microsoft Dev Box](how-to-prepare-custom-image-dev-box.md).

## Test the image with an equivalent VM

If Dev Box validation fails, deploy a test VM using the same SKU family used for Dev Box validation. If the VM fails to boot, inspect boot diagnostics to identify the failure.

The following example deploys a test VM using `Standard_D4s_v5`. You can also test with `Standard_D4as_v5`.

These examples use Bash-style variables (for example, Azure Cloud Shell).

```azurecli
# Set variables
RESOURCE_GROUP="test-image-rg"
LOCATION="eastus"  # Use the same region as your Dev Center
VM_NAME="test-devbox-image"
GALLERY_RG="your-gallery-rg"
GALLERY_NAME="your-gallery"
IMAGE_DEF="your-image-definition"
IMAGE_VERSION="1.0.0"  # Or "latest"

# Create resource group for testing
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create VM using Standard_D4s_v5 (same family as Dev Box)
az vm create \
  --resource-group $RESOURCE_GROUP \
  --name $VM_NAME \
  --image "/subscriptions/<subscription-id>/resourceGroups/$GALLERY_RG/providers/Microsoft.Compute/galleries/$GALLERY_NAME/images/$IMAGE_DEF/versions/$IMAGE_VERSION" \
  --size "Standard_D4s_v5" \
  --security-type "TrustedLaunch" \
  --enable-secure-boot true \
  --enable-vtpm true \
  --admin-username "azureuser" \
  --admin-password "<secure-password>" \
  --boot-diagnostics-storage "" \
  --public-ip-sku Standard
```

Alternatively, test with an AMD-based SKU, create a second VM:

```azurecli
# Use Standard_D4as_v5 for AMD-based testing
az vm create \
  --resource-group $RESOURCE_GROUP \
  --name "${VM_NAME}-amd" \
  --image "/subscriptions/<subscription-id>/resourceGroups/$GALLERY_RG/providers/Microsoft.Compute/galleries/$GALLERY_NAME/images/$IMAGE_DEF/versions/$IMAGE_VERSION" \
  --size "Standard_D4as_v5" \
  --security-type "TrustedLaunch" \
  --enable-secure-boot true \
  --enable-vtpm true \
  --admin-username "azureuser" \
  --admin-password "<secure-password>" \
  --boot-diagnostics-storage ""
```

### View boot diagnostics

If the VM fails to start, review boot diagnostics.

```azurecli
# Get boot diagnostics screenshot URL
az vm boot-diagnostics get-boot-log \
  --resource-group $RESOURCE_GROUP \
  --name $VM_NAME

# Or view in the Azure portal:
# VM → Help → Boot diagnostics
```

For more information, see [Azure boot diagnostics](/azure/virtual-machines/boot-diagnostics).

### Clean up test resources

```azurecli
az group delete --name $RESOURCE_GROUP --yes --no-wait
```

## Understand Dev Box architectural differences

Even if a VM deployment succeeds, Dev Box validation can fail because Dev Box provisioning and validation operate differently than direct VM creation in your subscription.

### Hosted on-behalf-of architecture

Dev boxes are hosted in a Microsoft-managed subscription on your behalf. The dev box connects to your network connection, but the underlying resources aren't deployed into your subscription.

This architecture affects validation and provisioning in the following ways:

- Dev Box must access your Azure Compute Gallery across subscription boundaries.
- Image replication is performed by the service.
- Validation checks image definition metadata (for example, Trusted Launch security type and generalized OS state) and can reject images that a direct VM deployment might still accept.

### Identity and permissions

Dev Box uses the dev center managed identity for image validation and replication. This identity is different from your user account and any service principal used to build the image.

Common identity-related causes of validation failures include:

- The dev center managed identity doesn't have the **Contributor** role on the gallery.
- A cross-subscription gallery is attached without granting the dev center managed identity access in the gallery subscription.
- Network restrictions (firewalls, private endpoints) prevent the dev center managed identity or the Microsoft.DevCenter resource provider from accessing dependent resources.

### Network connectivity

Dev boxes use Azure Virtual Desktop for connectivity and require outbound access to Microsoft endpoints during provisioning. When you use a network connection, DNS and outbound rules are enforced by your virtual network configuration.

Common network-related causes of provisioning failures include:

- Outbound traffic is blocked to required endpoints.
- DNS settings prevent resolution of required public endpoints.
- NSG rules block HTTPS (443) egress.

### Common scenarios where VM deployments succeed but Dev Box validation fails

| Scenario | Why a VM deployment might succeed | Why Dev Box validation might fail |
|---|---|---|
| Image definition missing Trusted Launch metadata | You can deploy a VM if the image version is otherwise usable | Dev Box checks image definition metadata and rejects the image |
| Dev center identity lacks gallery permissions | Not applicable because you use your own credentials | Dev Box can't read or replicate the image |
| Image isn't replicated to required region | You might deploy a VM in a region where the image is already available | Dev Box can't replicate the image to target regions without permissions |
| Image definition is specialized | You can deploy a specialized image as a VM | Dev Box requires a generalized image |
| Hyper-V generation mismatch | Some deployments might succeed depending on VM size and boot mode | Dev Box requires Generation 2 images |

## Validate your Packer configuration against a known good reference example

<!-- carmada-dev/demo-images links pinned to commit ea786c6 (2025-10-22). Verify and update SHA if referencing newer repo content. -->

The [carmada-dev/demo-images](https://github.com/carmada-dev/demo-images) repository provides a production-ready reference implementation for building Dev Box images with Packer. Compare your configuration against this example. For example:

**Trusted Launch configuration** — [_packer/source.pkr.hcl](https://github.com/carmada-dev/demo-images/blob/ea786c67b65c9c4dc32cc0c2c40fe010d2268ea4/_packer/source.pkr.hcl):

```
source "azure-arm" "vm" {
  secure_boot_enabled = true
  vtpm_enabled        = true
  security_type       = "TrustedLaunch"
  vm_size             = "Standard_D8s_v5"
  license_type        = "Windows_Client"
  # ...
}
```

**Image definition creation with Trusted Launch** — [build.sh](https://github.com/carmada-dev/demo-images/blob/ea786c67b65c9c4dc32cc0c2c40fe010d2268ea4/build.sh#L55-L60):

```
az sig image-definition create \
  --hyper-v-generation V2 \
  --os-state Generalized \
  --features 'IsHibernateSupported=true SecurityType=TrustedLaunch'
```

**Sysprep execution** — [_scripts/core/Generalize-VM.ps1](https://github.com/carmada-dev/demo-images/blob/ea786c67b65c9c4dc32cc0c2c40fe010d2268ea4/_scripts/core/Generalize-VM.ps1#L128-L129):
```
& $env:SystemRoot\System32\Sysprep\Sysprep.exe /generalize /oobe /mode:vm /quiet /quit
```

**Performance optimizations** — [_scripts/core/Generalize-VM.ps1](https://github.com/carmada-dev/demo-images/blob/ea786c67b65c9c4dc32cc0c2c40fe010d2268ea4/_scripts/core/Generalize-VM.ps1#L43-L65):

- Disables reserved storage (DISM /Set-ReservedStorageState /State:Disabled)
- Runs component store cleanup and health check (DISM /Cleanup-Image /CheckHealth)
- Runs disk defragmentation (defrag c: /FreespaceConsolidate)
- Runs boot optimization (defrag c: /BootOptimize)

**Hibernate/Virtual Machine Platform support** — [_scripts/core/Initialize-VM.ps1](https://github.com/carmada-dev/demo-images/blob/ea786c67b65c9c4dc32cc0c2c40fe010d2268ea4/_scripts/core/Initialize-VM.ps1#L152-L161):
```
Get-WindowsOptionalFeature -Online `
  | Where-Object { $_.FeatureName -like "*VirtualMachinePlatform*" -and $_.State -ne "Enabled" } `
  | Enable-WindowsOptionalFeature -Online -All -NoRestart
```

**Build orchestration** — [_packer/build.pkr.hcl](https://github.com/carmada-dev/demo-images/blob/ea786c67b65c9c4dc32cc0c2c40fe010d2268ea4/_packer/build.pkr.hcl) shows the complete provisioner sequence including Windows Updates, feature installation, package installation, and finalization.

## Troubleshooting: Known issues and solutions

### Issue: Image validation fails when using a disk encryption set (customer-managed keys)

**Symptoms:**

- Dev Box definition validation fails with a `SourceImageInvalid` error.
- The same image deploys successfully as an Azure VM.
- Packer build completes successfully and image appears in the gallery.

**Root cause:**

Dev Box supports platform-managed keys (PMK) for disk encryption. Customer-managed keys (CMK) via disk encryption sets aren't supported for Dev Box images.

When Packer builds an image with disk_encryption_set_id configured, the resulting image is associated with that encryption set. Dev Box validation detects this and rejects the image because it cannot provision dev boxes using customer-managed encryption keys.

The following example shows a Packer `azure-arm` source configuration that can cause this problem:

```hcl
source "azure-arm" "devbox" {
    # ...other settings...
  
  # THIS CAUSES VALIDATION FAILURE
  disk_encryption_set_id = local.image.diskEncryptionId
}
```

**Solution:**

- Remove the disk_encryption_set_id parameter from your Packer source block.
- Rebuild the image without associating a disk encryption set.
- Create a new image version in your gallery.

The following example shows a corrected Packer `azure-arm` source configuration (with no disk encryption set association):

```hcl
source "azure-arm" "devbox" {
  # Trusted Launch (REQUIRED)
  secure_boot_enabled = true
  vtpm_enabled        = true
  security_type       = "TrustedLaunch"
  
  # VM settings - NO disk_encryption_set_id
  vm_size      = "Standard_D8s_v5"
  license_type = "Windows_Client"
  os_type      = "Windows"
  
  # ...rest of configuration...
}
```

**Prevention:**

- Do not use disk_encryption_set_id in Packer configurations for Dev Box images
- Rely on Dev Box's built-in platform-managed encryption (enabled by default)
- If your organization requires CMK, monitor the Dev Box roadmap for future CMK support
- Document this requirement in your image build pipeline to prevent accidental reintroduction

### Issue: The image exists in the gallery but doesn't appear in the Dev Box definition image list

**Symptoms:**

- Image and image version are visible in the Azure Compute Gallery
- When creating or editing a Dev Box definition, the image does not appear in the image dropdown
- No error messages are displayed—the image is simply not listed
- The gallery is attached to the Dev Center successfully

**Root cause:**

The image is not visible to Dev Box for one or more of the following reasons:

- **Cross-subscription gallery without proper permissions:** The gallery is in a different subscription than the Dev Center, and the Dev Center's managed identity lacks access to the gallery in the other subscription.

- **Image not replicated to the Dev Center's region:** The image was built and published to a region different from where the Dev Center is located. Dev Box requires the image to be available in the same region as the Dev Center (or the network connection's region for dev box pools).

- **Image not replicated to the network connection's region (where dev boxes are created):** The image definition is missing required metadata (Trusted Launch security type, Gen2, Generalized) and is filtered out silently rather than showing an error.

**Solution:**

Verify permissions, replication targets, and image definition configuration.

If you use the Azure CLI commands in this section, install or upgrade the `devcenter` extension:

```azurecli
az extension add --name devcenter --upgrade
```
1. Verify cross-subscription permissions:

```azurecli
# Get the Dev Center's managed identity
az devcenter admin devcenter show \
  --name "your-dev-center" \
  --resource-group "your-rg" \
  --query "identity.principalId" -o tsv

# Assign Contributor role on the gallery (in the gallery's subscription)
az role assignment create \
  --assignee "<managed-identity-principal-id>" \
  --role "Contributor" \
  --scope "/subscriptions/<gallery-subscription>/resourceGroups/<gallery-rg>/providers/Microsoft.Compute/galleries/<gallery-name>"

```
2. Replicate the image to the required region:

```azurecli
# Check current replication regions
az sig image-version show \
  --resource-group "gallery-rg" \
  --gallery-name "your-gallery" \
  --gallery-image-definition "your-image-def" \
  --gallery-image-version "1.0.0" \
  --query "publishingProfile.targetRegions[].name" -o tsv

# Add the Dev Center's region to replication targets
az sig image-version update \
  --resource-group "gallery-rg" \
  --gallery-name "your-gallery" \
  --gallery-image-definition "your-image-def" \
  --gallery-image-version "1.0.0" \
  --add publishingProfile.targetRegions name="<dev-center-region>"
```
3. Verify image definition requirements:

```azurecli
# Check image definition properties
az sig image-definition show \
  --resource-group "gallery-rg" \
  --gallery-name "your-gallery" \
  --gallery-image-definition "your-image-def" \
  --query "{securityType:features[?name=='SecurityType'].value|[0], hvGeneration:hyperVGeneration, osState:osState}"
```

Expected output for a valid image definition:

```
{
  "securityType": "TrustedLaunch",
  "hvGeneration": "V2",
  "osState": "Generalized"
}
```

**Prevention:**

- When using cross-subscription galleries, configure the Dev Center managed identity permissions before attaching the gallery
- Include the Dev Center's region (and all network connection regions) in your Packer replication_regions list
- Verify image definition configuration meets Dev Box requirements before building images
- Use a consistent region strategy: build images in the same region as your Dev Center, or explicitly configure replication

## Related content

- [Prepare a custom image for Microsoft Dev Box](how-to-prepare-custom-image-dev-box.md)
- [Authenticate to Microsoft Dev Box](how-to-authenticate.md)
- [Configure Azure Compute Gallery for Microsoft Dev Box](how-to-configure-azure-compute-gallery.md)
- [Azure boot diagnostics](/azure/virtual-machines/boot-diagnostics)
- [carmada-dev/demo-images](https://github.com/carmada-dev/demo-images)
