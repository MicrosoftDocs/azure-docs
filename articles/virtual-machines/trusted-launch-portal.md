---
title: Deploy a Trusted Launch VM
description: Deploy a VM that uses Trusted Launch.
author: Howie425
ms.author: howieasmerom
ms.reviewer: jushiman
ms.service: azure-virtual-machines
ms.subservice: trusted-launch
ms.topic: how-to
ms.date: 05/21/2024
ms.custom: template-how-to, devx-track-azurecli, devx-track-azurepowershell
---

# Deploy a virtual machine with Trusted Launch enabled

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets.

[Trusted Launch](trusted-launch.md) is a way to improve the security of [Generation 2](generation-2.md) virtual machines (VMs). Trusted Launch protects against advanced and persistent attack techniques by combining infrastructure technologies like virtual Trusted Platform Module (vTPM) and secure boot.

## Prerequisites

- We recommend that you [onboard your subscription to Microsoft Defender for Cloud](https://azure.microsoft.com/services/security-center/?&ef_id=CjwKCAjwwsmLBhACEiwANq-tXHeKhV--teH6kIijnBTmP-PgktfvGr5zW9TAx00SR7xsGUc3sTj5sBoCkEoQAvD_BwE:G:s&OCID=AID2200277_SEM_CjwKCAjwwsmLBhACEiwANq-tXHeKhV--teH6kIijnBTmP-PgktfvGr5zW9TAx00SR7xsGUc3sTj5sBoCkEoQAvD_BwE:G:s&gclid=CjwKCAjwwsmLBhACEiwANq-tXHeKhV--teH6kIijnBTmP-PgktfvGr5zW9TAx00SR7xsGUc3sTj5sBoCkEoQAvD_BwE#overview) if it isn't already. Defender for Cloud has a free tier, which offers useful insights for various Azure and hybrid resources. With the absence of Defender for Cloud, Trusted Launch VM users can't monitor [boot integrity](boot-integrity-monitoring-overview.md) of VM.
- Assign Azure policy initiatives to your subscription. These policy initiatives need to be assigned only once per subscription. Policies will help deploy and audit for Trusted Launch VMs while automatically installing all required extensions on all supported VMs.
   - Configure the Trusted Launch VMs' [built-in policy initiative](trusted-launch-portal.md#trusted-launch-built-in-policies).
   - Configure prerequisites to enable Guest Attestation on Trusted Launch-enabled VMs.
   - Configure machines to automatically install the Azure Monitor and Azure Security agents on VMs.

- Allow the service tag `AzureAttestation` in network security group outbound rules to allow traffic for Azure Attestation. For more information, see [Virtual network service tags](../virtual-network/service-tags-overview.md).
- Make sure that the firewall policies allow access to `*.attest.azure.net`.

> [!NOTE]
> If you're using a Linux image and anticipate that the VM might have kernel drivers either unsigned or not signed by the Linux distro vendor, you might want to consider turning off secure boot. In the Azure portal, on the **Create a virtual machine** page for the `Security type` parameter with **Trusted Launch Virtual Machines** selected, select **Configure security features** and clear the **Enable secure boot** checkbox. In the Azure CLI, PowerShell, or SDK, set the secure boot parameter to `false`.

## Deploy a Trusted Launch VM

Create a VM with Trusted Launch enabled. Choose one of the following options.

### [Portal](#tab/portal)

1. Sign in to the Azure [portal](https://portal.azure.com).
1. Search for **Virtual Machines**.
1. Under **Services**, select **Virtual machines**.
1. On the **Virtual machines** page, select **Add**, and then select **Virtual machine**.
1. Under **Project details**, make sure the correct subscription is selected.
1. Under **Resource group**, select **Create new**. Enter a name for your resource group or select an existing resource group from the dropdown list.
1. Under **Instance details**, enter a name for the VM name and choose a region that supports [Trusted Launch](trusted-launch.md#more-information).
1. For **Security type**, select **Trusted launch virtual machines**. When the options **Secure boot**, **vTPM**, and **Integrity Monitoring** appear, select the appropriate options for your deployment. For more information, see [Trusted Launch-enabled security features](trusted-launch.md#microsoft-defender-for-cloud-integration).

    :::image type="content" source="./media/trusted-launch/tvm-popup.png" alt-text="Screenshot that shows the options for Trusted Launch.":::

1. Under **Image**, select an image from **Recommended Gen 2 images compatible with Trusted launch**. For a list, see [Trusted Launch](trusted-launch.md#virtual-machines-sizes).
   > [!TIP]
   > If you don't see the Gen2 version of the image that you want in the dropdown list, select **See all images**. Then change the **Security type** filter to **Trusted Launch**.
1.	Select a VM size that supports Trusted Launch. For more information, see the list of [supported sizes](trusted-launch.md#virtual-machines-sizes).
1.	Fill in the **Administrator account** information and then **Inbound port rules**.
1.	At the bottom of the page, select **Review + Create**.
1.	On the **Create a virtual machine** page, you can see the information about the VM you're about to deploy. After validation shows as passed, select **Create**.

   :::image type="content" source="./media/trusted-launch/tvm-complete.png" alt-text="Sceenshot that shows the validation page with the Trusted Launch options.":::

It takes a few minutes for your VM to be deployed.

### [CLI](#tab/cli)

Make sure that you're running the latest version of the Azure CLI.

1. Sign in to Azure by using `az login`.  

    ```azurecli-interactive
    az login 
    ```

1. Create a VM with Trusted Launch.

    ```azurecli-interactive
    az group create -n myresourceGroup -l eastus 
    
    az vm create \
       --resource-group myResourceGroup \
       --name myVM \
       --image Canonical:UbuntuServer:18_04-lts-gen2:latest \
       --admin-username azureuser \
       --generate-ssh-keys \
       --security-type TrustedLaunch \
       --enable-secure-boot true \ 
       --enable-vtpm true 
    ```

1. For existing VMs, you can enable or disable secure boot and vTPM settings. Updating the VM with secure boot and vTPM settings triggers auto-reboot.

    ```azurecli-interactive
    az vm update \
       --resource-group myResourceGroup \
       --name myVM \
       --enable-secure-boot true \
       --enable-vtpm true 
    ```  

For more information about installing boot integrity monitoring through the Guest Attestation extension, see [Boot integrity](./boot-integrity-monitoring-overview.md).

### [PowerShell](#tab/powershell)

To provision a VM with Trusted Launch, it first needs to be enabled with the `TrustedLaunch` parameter by using the `Set-AzVmSecurityProfile` cmdlet. Then you can use the `Set-AzVmUefi` cmdlet to set the vTPM and Secure Boot configuration. Use the following snippet as a quick start. Remember to replace the values in this example with your own.

```azurepowershell-interactive
$rgName = "myResourceGroup"
$location = "West US"
$vmName = "myTrustedVM"
$vmSize = Standard_B2s
$publisher = "MicrosoftWindowsServer"
$offer = "WindowsServer"
$sku = "2019-datacenter-gensecond"
$version = latest
$cred = Get-Credential `
   -Message "Enter a username and password for the virtual machine."

$vm = New-AzVMConfig -VMName $vmName -VMSize $vmSize 

$vm = Set-AzVMOperatingSystem `
   -VM $vm -Windows `
   -ComputerName $vmName `
   -Credential $cred `
   -ProvisionVMAgent `
   -EnableAutoUpdate 

$vm = Add-AzVMNetworkInterface -VM $vm `
   -Id $NIC.Id 

$vm = Set-AzVMSourceImage -VM $vm `
   -PublisherName $publisher `
   -Offer $offer `
   -Skus $sku `
   -Version $version 

$vm = Set-AzVMOSDisk -VM $vm `
   -StorageAccountType "StandardSSD_LRS" `
   -CreateOption "FromImage" 

$vm = Set-AzVmSecurityProfile -VM $vm `
   -SecurityType "TrustedLaunch" 

$vm = Set-AzVmUefi -VM $vm `
   -EnableVtpm $true `
   -EnableSecureBoot $true 

New-AzVM -ResourceGroupName $rgName -Location $location -VM $vm 
```

### [Template](#tab/template)

You can deploy Trusted Launch VMs by using a quickstart template.

#### Linux

[![Deploy to Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.compute%2Fvm-trustedlaunch-linux%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.compute%2Fvm-trustedlaunch-linux%2FcreateUiDefinition.json)

#### Windows

[![Deploy to Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.compute%2Fvm-trustedlaunch-windows%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.compute%2Fvm-trustedlaunch-windows%2FcreateUiDefinition.json)

---

## Deploy a Trusted Launch VM from an Azure Compute Gallery image

[Azure Trusted Launch VMs](trusted-launch.md) support the creation and sharing of custom images by using Azure Compute Gallery. There are two types of images that you can create, based on the security types of the image:

- **Recommended**: [Trusted Launch VM supported (`TrustedLaunchSupported`) images](#trusted-launch-vm-supported-images) are images where the source doesn't have VM Guest state information and can be used to create either [Generation 2 VMs](generation-2.md) or [Trusted Launch VMs](trusted-launch.md).
- [Trusted Launch VM (`TrustedLaunch`) images](#trusted-launch-vm-images) are images where the source usually has [VM Guest State information](trusted-launch-faq.md#what-is-vm-guest-state-vmgs) and can be used to create only [Trusted Launch VMs](trusted-launch.md).

### Trusted Launch VM supported images

For the following image sources, the security type on the image definition should be set to `TrustedLaunchsupported`:

- Gen2 operating system (OS) disk VHD
- Gen2 Managed Image
- Gen2 Gallery Image version

No VM Guest State information can be included in the image source.

You can use the resulting image version to create either Azure Gen2 VMs or Trusted Launch VMs.

These images can be shared by using [Azure Compute Gallery - Direct Shared Gallery](../virtual-machines/azure-compute-gallery.md#shared-directly-to-a-tenant-or-subscription) and [Azure Compute Gallery - Community Gallery](../virtual-machines/azure-compute-gallery.md#community-gallery).

> [!NOTE]
> The OS disk VHD, Managed Image, or Gallery Image version should be created from a [Gen2 image that's compatible with Trusted Launch VMs](trusted-launch.md#virtual-machines-sizes).

#### [Portal](#tab/portal3)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **VM image versions** in the search bar.
1. On the **VM image versions** page, select **Create**.
1. On the **Create VM image version** page, on the **Basics** tab:
    1. Select the Azure subscription.
    1. Select an existing resource group or create a new resource group.
    1. Select the Azure region.
    1. Enter an image version number.
    1. For **Source**, select either **Storage Blobs (VHD)** or **Managed Image** or another **VM Image Version**.
    1. If you selected **Storage Blobs (VHD)**, enter an OS disk VHD (without the VM Guest state). Make sure to use a Gen2 VHD.
    1. If you selected **Managed Image**, select an existing managed image of a Gen2 VM.
    1. If you selected **VM Image Version**, select an existing Gallery Image version of a Gen2 VM.
    1. For **Target Azure compute gallery**, select or create a gallery to share the image.
    1. For **Operating system state**, select either **Generalized** or **Specialized** depending on your use case. If you're using a managed image as the source, always select **Generalized**. If you're using a storage blob (VHD) and want to select **Generalized**, follow the steps to [generalize a Linux VHD](../virtual-machines/linux/create-upload-generic.md) or [generalize a Windows VHD](../virtual-machines/windows/upload-generalized-managed.md) before you continue. If you're using an existing VM image version, select either **Generalized** or **Specialized** based on what's used in the source VM image definition.
    1. For **Target VM Image Definition**, select **Create new**.
    1. On the **Create a VM image definition** pane, enter a name for the definition. Make sure the security type is set to **Trustedlaunch Supported**. Enter the publisher, offer, and SKU information. Then select **OK**.
1. On the **Replication** tab, enter the replica count and target regions for image replication, if necessary.
1. On the **Encryption** tab, enter SSE encryption-related information, if necessary.
1. Select **Review + Create**.
1. After the configuration is successfully validated, select **Create** to finish creating the image.
1. After the image version is created, select **Create VM**.
1. On the **Create a virtual machine** page, under **Resource group**, select **Create new**. Enter a name for your resource group or select an existing resource group from the dropdown list.
1. Under **Instance details**, enter a name for the VM name and choose a region that supports [Trusted Launch](trusted-launch.md#more-information).
1. For **Security type**, select **Trusted launch virtual machines**. The **Secure Boot** and **vTPM** checkboxes are enabled by default.
1. Fill in the **Administrator account** information and then **Inbound port rules**.
1. On the validation page, review the details of the VM.
1. After the validation succeeds, select **Create** to finish creating the VM.

#### [CLI](#tab/cli3)

Make sure that you're running the latest version of the Azure CLI.

1. Sign in to Azure by using `az login`.  

    ```azurecli-interactive
    az login 
    ```

1. Create an image definition with the `TrustedLaunchSupported` security type.

    ```azurecli-interactive
    az sig image-definition create --resource-group MyResourceGroup --location eastus \ 
    --gallery-name MyGallery --gallery-image-definition MyImageDef \ 
    --publisher TrustedLaunchPublisher --offer TrustedLaunchOffer --sku TrustedLaunchSku \ 
    --os-type Linux --os-state Generalized \ 
    --hyper-v-generation V2 \ 
    --features SecurityType=TrustedLaunchSupported
    ```

1. Use an OS disk VHD to create an image version. Ensure that the Linux VHD was generalized before you upload it to an Azure Storage account blob by using the steps in [Prepare Linux for imaging in Azure](../virtual-machines/linux/create-upload-generic.md).

    ```azurecli-interactive
    az sig image-version create --resource-group MyResourceGroup \
    --gallery-name MyGallery --gallery-image-definition MyImageDef \
    --gallery-image-version 1.0.0 \
    --os-vhd-storage-account /subscriptions/00000000-0000-0000-0000-00000000xxxx/resourceGroups/imageGroups/providers/Microsoft.Storage/storageAccounts/mystorageaccount \
    --os-vhd-uri https://mystorageaccount.blob.core.windows.net/container/path_to_vhd_file
    ```

1. Create a Trusted Launch VM from the preceding image version.

    ```azurecli-interactive
    adminUsername=linuxvm
    az vm create --resource-group MyResourceGroup \
        --name myTrustedLaunchVM \
        --image "/subscriptions/00000000-0000-0000-0000-00000000xxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/galleries/MyGallery/images/MyImageDef" \
        --size Standard_D2s_v5 \
        --security-type TrustedLaunch \
        --enable-secure-boot true \ 
        --enable-vtpm true \
        --admin-username $adminUsername \
        --generate-ssh-keys
    ```

#### [PowerShell](#tab/powershell3)

1. Create an image definition with the `TrustedLaunchSupported` security type.

    ```azurepowershell-interactive
    $rgName = "MyResourceGroup"
    $galleryName = "MyGallery"
    $galleryImageDefinitionName = "MyImageDef"
    $location = "eastus"
    $publisherName = "TrustedlaunchPublisher"
    $offerName = "TrustedlaunchOffer"
    $skuName = "TrustedlaunchSku"
    $description = "My gallery"
    $SecurityType = @{Name='SecurityType';Value='TrustedLaunchSupported'}
    $features = @($SecurityType)
    New-AzGalleryImageDefinition -ResourceGroupName $rgName -GalleryName $galleryName -Name $galleryImageDefinitionName -Location $location -Publisher $publisherName -Offer $offerName -Sku $skuName -HyperVGeneration "V2" -OsState "Generalized" -OsType "Windows" -Description $description -Feature $features
    ```

1. To create an image version, you can use an existing Gen2 Gallery Image version, which was generalized during creation.

    ```azurepowershell-interactive
    $rgName = "MyResourceGroup"
    $galleryName = "MyGallery"
    $galleryImageDefinitionName = "MyImageDef"
    $location = "eastus"
    $galleryImageVersionName = "1.0.0"
    $sourceImageId = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myVMRG/providers/Microsoft.Compute/galleries/MyGallery/images/Gen2VMImageDef/versions/0.0.1"
    New-AzGalleryImageVersion -ResourceGroupName $rgName -GalleryName $galleryName -GalleryImageDefinitionName $galleryImageDefinitionName -Name $galleryImageVersionName -Location $location -SourceImageId $sourceImageId
    ```

1. Create a Trusted Launch VM from the preceding image version.

    ```azurepowershell-interactive
    $rgName = "MyResourceGroup"
    $galleryName = "MyGallery"
    $galleryImageDefinitionName = "MyImageDef"
    $location = "eastus"
    $vmName = "myVMfromImage"
    $vmSize = "Standard_D2s_v5"
    $imageDefinition = Get-AzGalleryImageDefinition `
       -GalleryName $galleryName `
       -ResourceGroupName $rgName `
       -Name $galleryImageDefinitionName
    $cred = Get-Credential `
       -Message "Enter a username and password for the virtual machine"
    # Network pieces
    $subnetConfig = New-AzVirtualNetworkSubnetConfig `
       -Name mySubnet `
       -AddressPrefix 192.168.1.0/24
    $vnet = New-AzVirtualNetwork `
       -ResourceGroupName $rgName `
       -Location $location `
       -Name MYvNET `
       -AddressPrefix 192.168.0.0/16 `
       -Subnet $subnetConfig
    $pip = New-AzPublicIpAddress `
       -ResourceGroupName $rgName `
       -Location $location `
      -Name "mypublicdns$(Get-Random)" `
      -AllocationMethod Static `
      -IdleTimeoutInMinutes 4
    $nsgRuleRDP = New-AzNetworkSecurityRuleConfig `
       -Name myNetworkSecurityGroupRuleRDP  `
       -Protocol Tcp `
      -Direction Inbound `
       -Priority 1000 `
       -SourceAddressPrefix * `
       -SourcePortRange * `
       -DestinationAddressPrefix * `
       -DestinationPortRange 3389 `
       -Access Deny
    $nsg = New-AzNetworkSecurityGroup `
       -ResourceGroupName $rgName `
       -Location $location `
      -Name myNetworkSecurityGroup `
      -SecurityRules $nsgRuleRDP
    $nic = New-AzNetworkInterface `
       -Name myNic `
       -ResourceGroupName $rgName `
       -Location $location `
      -SubnetId $vnet.Subnets[0].Id `
      -PublicIpAddressId $pip.Id `
      -NetworkSecurityGroupId $nsg.Id
    $vm = New-AzVMConfig -vmName $vmName -vmSize $vmSize | `
          Set-AzVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred | `
          Set-AzVMSourceImage -Id $imageDefinition.Id | `
          Add-AzVMNetworkInterface -Id $nic.Id
    $vm = Set-AzVMSecurityProfile -SecurityType "TrustedLaunch" -VM $vm
    $vm = Set-AzVmUefi -VM $vm `
       -EnableVtpm $true `
       -EnableSecureBoot $true 
    New-AzVM `
       -ResourceGroupName $rgName `
       -Location $location `
       -VM $vm
    ```
---

### Trusted Launch VM images

The security type on the image definition should be set to `TrustedLaunch`for the following image sources:

- Trusted Launch VM capture
- Managed OS disk
- Managed OS disk snapshot

You can use the resulting image version to create Azure Trusted Launch VMs only.

#### [Portal](#tab/portal2)

1. Sign in to the Azure [portal](https://portal.azure.com).
1. To create an Azure Compute Gallery Image from a VM, open an existing Trusted Launch VM and select **Capture**.
1. On the **Create an Image** page, allow the image to be shared to the gallery as a VM image version. Creation of managed images isn't supported for Trusted Launch VMs.
1. Create a new target Azure Compute Gallery or select an existing gallery.
1. Select the **Operating system state** as either **Generalized** or **Specialized**. If you want to create a generalized image, ensure that you [generalize the VM to remove machine-specific information](generalize.yml) before you select this option. If Bitlocker-based encryption is enabled on your Trusted Launch Windows VM, you might not be able to generalize the same.
1. Create a new image definition by providing a name, publisher, offer, and SKU details. **Security type** for the image definition should already be set to **Trusted launch**.
1. Provide a version number for the image version.
1. Modify replication options, if necessary.
1. At the bottom of the **Create an Image** page, select **Review + Create**. After validation shows as passed, select **Create**.
1. After the image version is created, go to the image version directly. Alternatively, you can go to the required image version through the image definition.
1. On the **VM image version** page, select **+ Create VM** to go to the **Create a virtual machine** page.
1. On the **Create a virtual machine** page, under **Resource group**, select **Create new**. Enter a name for your resource group or select an existing resource group from the dropdown list.
1. Under **Instance details**, enter a name for the VM name and choose a region that supports [Trusted Launch](trusted-launch.md#virtual-machines-sizes).
1. The image and the security type are already populated based on the selected image version. The **Secure Boot** and **vTPM** checkboxes are enabled by default.
1. Fill in the **Administrator account** information and then **Inbound port rules**.
1. At the bottom of the page, select **Review + Create**.
1. On the validation page, review the details of the VM.
1. After the validation succeeds, select **Create** to finish creating the VM.

If you want to use either a managed disk or a managed disk snapshot as a source of the image version (instead of a Trusted Launch VM), follow these steps.

1.	Sign in to the [Azure portal](https://portal.azure.com).
1.	Search for **VM Image Versions** and select **Create**.
1.	Provide the subscription, resource group, region, and image version number.
1.	Select the source as **Disks and/or Snapshots**.
1.	Select the OS disk as a managed disk or a managed disk snapshot from the dropdown list.
1.	Select a **Target Azure Compute Gallery** to create and share the image. If no gallery exists, create a new gallery.
1.	Select the **Operating system state** as either **Generalized** or **Specialized**. If you want to create a generalized image, ensure that you generalize the disk or snapshot to remove machine-specific information.
1.	For the **Target VM Image Definition** select **Create new**. In the window that opens, select an image definition name and ensure that **Security type** is set to **Trusted launch**. Provide the publisher, offer, and SKU information and select **OK**.
1.	The **Replication** tab can be used to set the replica count and target regions for image replication, if required.
1.	The **Encryption** tab can also be used to provide SSE encryption-related information, if required.
1.	Select **Create** on the **Review + create** tab to create the image.
1.	After the image version is successfully created, select **+ Create VM** to go to the **Create a virtual machine** page.
1.	Follow steps 12 to 18 as mentioned earlier to create a Trusted Launch VM by using this image version.

#### [CLI](#tab/cli2)

Make sure that you're running the latest version of the Azure CLI.

1. Sign in to Azure by using `az login`.  

    ```azurecli-interactive
    az login 
    ```

1. Create an image definition with the `TrustedLaunch` security type.

    ```azurecli-interactive
    az sig image-definition create --resource-group MyResourceGroup --location eastus \ 
    --gallery-name MyGallery --gallery-image-definition MyImageDef \ 
    --publisher TrustedLaunchPublisher --offer TrustedLaunchOffer --sku TrustedLaunchSku \ 
    --os-type Linux --os-state Generalized \ 
    --hyper-v-generation V2 \ 
    --features SecurityType=TrustedLaunch
    ```

1. To create an image version, you can capture an existing Linux-based Trusted Launch VM. [Generalize the Trusted Launch VM](generalize.yml) before you create the image version.

    ```azurecli-interactive
    az sig image-version create --resource-group MyResourceGroup \
    --gallery-name MyGallery --gallery-image-definition MyImageDef \
    --gallery-image-version 1.0.0 \
    --managed-image /subscriptions/00000000-0000-0000-0000-00000000xxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM
    ```

   If a managed disk or a managed disk snapshot needs to be used as the image source for the image version, replace `--managed-image` in the preceding command with `--os-snapshot` and provide the disk or the snapshot resource name.

1. Create a Trusted Launch VM from the preceding image version.
    
    ```azurecli-interactive
    adminUsername=linuxvm
    az vm create --resource-group MyResourceGroup \
        --name myTrustedLaunchVM \
        --image "/subscriptions/00000000-0000-0000-0000-00000000xxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/galleries/MyGallery/images/MyImageDef" \
        --size Standard_D2s_v5 \
        --security-type TrustedLaunch \
        --enable-secure-boot true \ 
        --enable-vtpm true \
        --admin-username $adminUsername \
        --generate-ssh-keys
    ```

#### [PowerShell](#tab/powershell2)

1. Create an image definition with the `TrustedLaunch` security type.

    ```azurepowershell-interactive
    $rgName = "MyResourceGroup"
    $galleryName = "MyGallery"
    $galleryImageDefinitionName = "MyImageDef"
    $location = "eastus"
    $publisherName = "TrustedlaunchPublisher"
    $offerName = "TrustedlaunchOffer"
    $skuName = "TrustedlaunchSku"
    $description = "My gallery"
    $SecurityType = @{Name='SecurityType';Value='TrustedLaunch'}
    $features = @($SecurityType)
    New-AzGalleryImageDefinition -ResourceGroupName $rgName -GalleryName $galleryName -Name $galleryImageDefinitionName -Location $location -Publisher $publisherName -Offer $offerName -Sku $skuName -HyperVGeneration "V2" -OsState "Generalized" -OsType "Windows" -Description $description -Feature $features
    ```

1. To create an image version, you can capture an existing Windows-based Trusted Launch VM. [Generalize the Trusted Launch VM](generalize.yml) before you create the image version.

    ```azurepowershell-interactive
    $rgName = "MyResourceGroup"
    $galleryName = "MyGallery"
    $galleryImageDefinitionName = "MyImageDef"
    $location = "eastus"
    $galleryImageVersionName = "1.0.0"
    $sourceImageId = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myVMRG/providers/Microsoft.Compute/virtualMachines/myVM"
    New-AzGalleryImageVersion -ResourceGroupName $rgName -GalleryName $galleryName -GalleryImageDefinitionName $galleryImageDefinitionName -Name $galleryImageVersionName -Location $location -SourceImageId $sourceImageId
    ```

1. Create a Trusted Launch VM from the preceding image version.

    ```azurepowershell-interactive
    $rgName = "MyResourceGroup"
    $galleryName = "MyGallery"
    $galleryImageDefinitionName = "MyImageDef"
    $location = "eastus"
    $vmName = "myVMfromImage"
    $vmSize = "Standard_D2s_v5"
    $imageDefinition = Get-AzGalleryImageDefinition `
       -GalleryName $galleryName `
       -ResourceGroupName $rgName `
       -Name $galleryImageDefinitionName
    $cred = Get-Credential `
       -Message "Enter a username and password for the virtual machine"
    # Network pieces
    $subnetConfig = New-AzVirtualNetworkSubnetConfig `
       -Name mySubnet `
       -AddressPrefix 192.168.1.0/24
    $vnet = New-AzVirtualNetwork `
       -ResourceGroupName $rgName `
       -Location $location `
       -Name MYvNET `
       -AddressPrefix 192.168.0.0/16 `
       -Subnet $subnetConfig
    $pip = New-AzPublicIpAddress `
       -ResourceGroupName $rgName `
       -Location $location `
      -Name "mypublicdns$(Get-Random)" `
      -AllocationMethod Static `
      -IdleTimeoutInMinutes 4
    $nsgRuleRDP = New-AzNetworkSecurityRuleConfig `
       -Name myNetworkSecurityGroupRuleRDP  `
       -Protocol Tcp `
      -Direction Inbound `
       -Priority 1000 `
       -SourceAddressPrefix * `
       -SourcePortRange * `
       -DestinationAddressPrefix * `
       -DestinationPortRange 3389 `
       -Access Deny
    $nsg = New-AzNetworkSecurityGroup `
       -ResourceGroupName $rgName `
       -Location $location `
      -Name myNetworkSecurityGroup `
      -SecurityRules $nsgRuleRDP
    $nic = New-AzNetworkInterface `
       -Name myNic `
       -ResourceGroupName $rgName `
       -Location $location `
      -SubnetId $vnet.Subnets[0].Id `
      -PublicIpAddressId $pip.Id `
      -NetworkSecurityGroupId $nsg.Id
    $vm = New-AzVMConfig -vmName $vmName -vmSize $vmSize | `
          Set-AzVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred | `
          Set-AzVMSourceImage -Id $imageDefinition.Id | `
          Add-AzVMNetworkInterface -Id $nic.Id
    $vm = Set-AzVMSecurityProfile -SecurityType "TrustedLaunch" -VM $vm
    $vm = Set-AzVmUefi -VM $vm `
       -EnableVtpm $true `
       -EnableSecureBoot $true 
    New-AzVM `
       -ResourceGroupName $rgName `
       -Location $location `
       -VM $vm
    ```
---
## Trusted Launch built-in policies

To help users adopt Trusted Launch, Azure policies are available to help resource owners adopt Trusted Launch. The main objective is to help convert Generation 1 and 2 VMs that are Trusted Launch capable.

The **Virtual machine should have Trusted launch enabled** single policy checks if the VM is currently enabled with Trusted Launch security configurations. The **Disks and OS supported for Trusted launch** policy checks if previously created VMs have the [capable Generation 2 OS and VM size](trusted-launch.md#virtual-machines-sizes) to deploy a Trusted Launch VM.

These two policies come together to make the Trusted Launch policy initiative. This initiative enables you to group several related policy definitions to simplify assignments and management resources to include Trusted Launch configuration.

To learn more and start deploying, see [Trusted Launch built-in policies](../governance/policy/samples/built-in-policies.md#trusted-launch).

---
## Verify or update your settings

For VMs created with Trusted Launch enabled, you can view the Trusted Launch configuration by going to the **Overview** page for the VM in the Azure portal. The **Properties** tab shows the status of Trusted Launch features.

:::image type="content" source="./media/trusted-launch/security-type-enabled.png" alt-text="Screenshot that shows the Trusted Launch properties of the VM.":::

To change the Trusted Launch configuration, on the left menu, under **Settings**, select **Configuration**. In the **Security type** section, you can enable or disable **Secure Boot**, **vTPM**, and **Integrity monitoring**. Select **Save** at the top of the page when you're finished.

:::image type="content" source="./media/trusted-launch/verify-integrity-boot-on.png" alt-text="Screenshot that shows checkboxes to change the Trusted Launch settings.":::

If the VM is running, you receive a message that the VM will restart. Select **Yes** and then wait for the VM to restart for changes to take effect.

## Related content

Learn more about [Trusted Launch](trusted-launch.md) and [boot integrity monitoring](boot-integrity-monitoring-overview.md) VMs.

