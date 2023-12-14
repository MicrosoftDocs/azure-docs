---
title: Deploy a trusted launch VM
description: Deploy a VM that uses trusted launch.
author: lakmeedee
ms.author: howieasmerom
ms.reviewer: erd
ms.service: virtual-machines
ms.subservice: trusted-launch
ms.topic: how-to
ms.date: 11/06/2023
ms.custom: template-how-to, devx-track-azurecli, devx-track-azurepowershell
---

# Deploy a VM with trusted launch enabled

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

[Trusted launch](trusted-launch.md) is a way to improve the security of [generation 2](generation-2.md) VMs. Trusted launch protects against advanced and persistent attack techniques by combining infrastructure technologies like vTPM and secure boot.

## Prerequisites

- You need to [onboard your subscription to Microsoft Defender for Cloud](https://azure.microsoft.com/services/security-center/?&ef_id=CjwKCAjwwsmLBhACEiwANq-tXHeKhV--teH6kIijnBTmP-PgktfvGr5zW9TAx00SR7xsGUc3sTj5sBoCkEoQAvD_BwE:G:s&OCID=AID2200277_SEM_CjwKCAjwwsmLBhACEiwANq-tXHeKhV--teH6kIijnBTmP-PgktfvGr5zW9TAx00SR7xsGUc3sTj5sBoCkEoQAvD_BwE:G:s&gclid=CjwKCAjwwsmLBhACEiwANq-tXHeKhV--teH6kIijnBTmP-PgktfvGr5zW9TAx00SR7xsGUc3sTj5sBoCkEoQAvD_BwE#overview) if it isn't already. Microsoft Defender for Cloud has a free tier, which offers very useful insights for various Azure and Hybrid resources. Trusted launch leverages Defender for Cloud to surface multiple recommendations regarding VM health.

- Assign Azure policies initiatives to your subscription. These policy initiatives  need to be assigned  only once per subscription. This will  automatically install all required extensions on all supported VMs.
   - Configure prerequisites to enable Guest Attestation on Trusted Launch enabled VMs.

   - Configure machines to automatically install the Azure Monitor and Azure Security agents on virtual machines.

- Allow service tag **AzureAttestation** in NSG Outbound rules to allow traffic for Microsoft Azure Attestation. Refer to [Virtual network service tags](../virtual-network/service-tags-overview.md).

- Make sure that the firewall policies are allowing access to `*.attest.azure.net`.

> [!NOTE]
>  If you are using a Linux image and anticipate the VM may have kernel drivers either unsigned or not signed by the Linux distro vendor, then you may want to consider turning off secure boot. In the Azure portal, in the ‘Create a virtual machine’ page for ‘Security type’ parameter with ‘Trusted Launch Virtual Machines’ selected, click on ‘Configure security features’ and uncheck the ‘Enable secure boot’ checkbox. In CLI, PowerShell, or SDK, set secure boot parameter to false.

## Deploy a trusted launch VM

Create a virtual machine with trusted launch enabled. Choose an option below:

### [Portal](#tab/portal)

1. Sign in to the Azure [portal](https://portal.azure.com).
1. Search for **Virtual Machines**.
1. Under **Services**, select **Virtual machines**.
1. In the **Virtual machines** page, select **Add**, and then select **Virtual machine**.
1. Under **Project details**, make sure the correct subscription is selected.
1. Under **Resource group**, select **Create new** and type a name for your resource group or select an existing resource group from the dropdown.
1. Under **Instance details**, type a name for the virtual machine name and choose a region that supports [trusted launch](trusted-launch.md#additional-information).
1. For **Security type** select **Trusted launch virtual machines**. This will make three more options appear - **Secure boot**, **vTPM**, and **Integrity Monitoring** . Select the appropriate options for your deployment. To learn more about [Trusted Launch Enabled Security Features](trusted-launch.md#microsoft-defender-for-cloud-integration).
    :::image type="content" source="./media/trusted-launch/tvm-popup.png" alt-text="Screenshot showing the options for Trusted Launch.":::
1. Under **Image**, select an image from the **Recommended Gen 2 images compatible with Trusted launch**. For a list, see [trusted launch](trusted-launch.md#virtual-machines-sizes).
   > [!TIP]
   > If you don't see the Gen 2 version of the image you want in the drop-down, select **See all images** and then change the **Security type** filter to **Trusted Launch**.
13.	Select a VM size that supports trusted launch. See the list of [supported sizes](trusted-launch.md#virtual-machines-sizes).
14.	Fill in the **Administrator account** information and then **Inbound port rules**.
15.	At the bottom of the page, select **Review + Create**
16.	On the **Create a virtual machine** page, you can see the details about the VM you are about to deploy. Once validation shows as passed, select **Create**.

   :::image type="content" source="./media/trusted-launch/tvm-complete.png" alt-text="Sceenshot of the validation page, showing the trusted launch options are included.":::

It will take a few minutes for your VM to be deployed.

### [CLI](#tab/cli)

Make sure you are running the latest version of Azure CLI 

Sign in to Azure using `az login`.  

```azurecli-interactive
az login 
```

Create a virtual machine with Trusted Launch.

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
 
For existing VMs, you can enable or disable secure boot and vTPM settings. Updating the virtual machine with secure boot and vTPM settings will trigger auto-reboot.

```azurecli-interactive
az vm update \
   --resource-group myResourceGroup \
   --name myVM \
   --enable-secure-boot true \
   --enable-vtpm true 
```  

For more information about installing boot integrity monitoring through the Guest Attestation extension, see [Boot integrity](./boot-integrity-monitoring-overview.md).

### [PowerShell](#tab/powershell)

In order to provision a VM with Trusted Launch, it first needs to be enabled with the `TrustedLaunch` using the `Set-AzVmSecurityProfile` cmdlet. Then you can use the Set-AzVmUefi cmdlet to set the vTPM and SecureBoot configuration. Use the below snippet as a quick start, remember to replace the values in this example with your own.

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

You can deploy trusted launch VMs using a quickstart template:

**Linux**

[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.compute%2Fvm-trustedlaunch-linux%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.compute%2Fvm-trustedlaunch-linux%2FcreateUiDefinition.json)

**Windows**

[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.compute%2Fvm-trustedlaunch-windows%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.compute%2Fvm-trustedlaunch-windows%2FcreateUiDefinition.json)

---

## Deploy a Trusted launch VM from an Azure Compute Gallery image

[Azure trusted launch virtual machines](trusted-launch.md) supports the creation and sharing of custom images using Azure Compute Gallery. There are two types of images that you can create, based on the security types of the image:

- **Recommended** [Trusted launch VM Supported (`TrustedLaunchSupported`) images](#trusted-launch-vm-supported-images) are images where the source does not have VM Guest state information and can be used to create either [Generation 2 VMs](generation-2.md) or [Trusted Launch VMs](trusted-launch.md).
- [Trusted launch VM (`TrustedLaunch`) images](#trusted-launch-vm-images) are images where the source usually has [VM Guest state information](trusted-launch-faq.md#what-is-vm-guest-state-vmgs) and can be used to create only [Trusted Launch VMs](trusted-launch.md).

### Trusted launch VM supported images

For the following image sources, the security type on the image definition should be set to `TrustedLaunchsupported`:

- Gen2 OS Disk VHD
- Gen2 Managed Image
- Gen2 Gallery Image Version

No VM Guest State information shall be included in the image source.

The resulting image version can be used to create either Azure Gen2 VMs or Trusted launch VMs.

These images can be shared using [Azure Compute Gallery - Direct Shared Gallery](../virtual-machines/azure-compute-gallery.md#shared-directly-to-a-tenant-or-subscription) and [Azure Compute Gallery - Community Gallery](../virtual-machines/azure-compute-gallery.md#community-gallery)

> [!NOTE]
> The OS disk VHD, Managed Image or Gallery Image Version should be created from a [Gen2 image that is compatible with Trusted launch VMs](trusted-launch.md#virtual-machines-sizes).

#### [Portal](#tab/portal3)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **VM image versions** in the search bar
1. On the **VM image versions** page, select **Create**.
1. On the **Create VM image version** page, on the **Basics** tab:
    1. Select the Azure subscription.
    1. Select an existing resource group or create a new resource group.
    1. Select the Azure region.
    1. Enter an image version number.
    1. For **Source**, select either **Storage Blobs (VHD)** or **Managed Image** or another **VM Image Version**
    1. If you selected **Storage Blobs (VHD)**, enter an OS disk VHD (without the VM Guest state). Make sure to use a Gen 2 VHD.
    1. If you selected **Managed Image**, select an existing managed image of a Gen 2 VM.
    1. If you selected **VM Image Version**, select an existing Gallery Image Version of a Gen2 VM.
    1. For **Target Azure compute gallery**, select or create a gallery to share the image.
    1. For **Operating system state**, select either **Generalized** or **Specialized** depending on your use case. If you're using a managed image as the source, always select **Generalized**. If you're using a storage blob (VHD) and want to select **Generalized**, follow the steps to [generalize a Linux VHD](../virtual-machines/linux/create-upload-generic.md) or [generalize a Windows VHD](../virtual-machines/windows/upload-generalized-managed.md) before you continue. If you're using an existing VM Image Version, select either **Generalized** or **Specialized** based on what is used in the source VM image definition.
    1. For **Target VM Image Definition**, select **Create new**.
    1. In the **Create a VM image definition** pane, enter a name for the definition. Make sure the security type is set to **Trustedlaunch Supported**. Enter publisher, offer, and SKU information. Then, select **Ok**.
1. On the **Replication** tab, enter the replica count and target regions for image replication, if required.
1. On the **Encryption** tab, enter SSE encryption-related information, if required.
1. Select **Review + Create**.
1. After the configuration is successfully validated, select **Create** to finish creating the image.
1. After the image version is created, select **Create VM**.
12. In the Create a virtual machine page, under **Resource group**, select **Create new** and type a name for your resource group or select an existing resource group from the dropdown.
13. Under **Instance details**, type a name for the virtual machine name and choose a region that supports [trusted launch](trusted-launch.md#additional-information).
14. Select **Trusted launch virtual machines** as the security type. The **Secure Boot** and **vTPM** checkboxes are enabled by default.
15. Fill in the **Administrator account** information and then **Inbound port rules**.
1. On the validation page, review the details of the VM.
1. After the validation succeeds, select **Create** to finish creating the VM.


#### [CLI](#tab/cli3)

Make sure you are running the latest version of Azure CLI 

Sign in to Azure using `az login`.  

```azurecli-interactive
az login 
```

Create an image definition with `TrustedLaunchSupported` security type 

```azurecli-interactive
az sig image-definition create --resource-group MyResourceGroup --location eastus \ 
--gallery-name MyGallery --gallery-image-definition MyImageDef \ 
--publisher TrustedLaunchPublisher --offer TrustedLaunchOffer --sku TrustedLaunchSku \ 
--os-type Linux --os-state Generalized \ 
--hyper-v-generation V2 \ 
--features SecurityType=TrustedLaunchSupported
```

Use an OS disk VHD to create an image version. Ensure that the Linux VHD was generalized before uploading to an Azure storage account blob using steps outlined [here](../virtual-machines/linux/create-upload-generic.md)

```azurecli-interactive
az sig image-version create --resource-group MyResourceGroup \
--gallery-name MyGallery --gallery-image-definition MyImageDef \
--gallery-image-version 1.0.0 \
--os-vhd-storage-account /subscriptions/00000000-0000-0000-0000-00000000xxxx/resourceGroups/imageGroups/providers/Microsoft.Storage/storageAccounts/mystorageaccount \
--os-vhd-uri https://mystorageaccount.blob.core.windows.net/container/path_to_vhd_file
```

Create a Trusted launch VM from the above image version

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

Create an image definition with `TrustedLaunchSupported` security type

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

To create an image version, we can use an existing Gen2 Gallery Image Version which was generalized during creation.

```azurepowershell-interactive
$rgName = "MyResourceGroup"
$galleryName = "MyGallery"
$galleryImageDefinitionName = "MyImageDef"
$location = "eastus"
$galleryImageVersionName = "1.0.0"
$sourceImageId = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myVMRG/providers/Microsoft.Compute/galleries/MyGallery/images/Gen2VMImageDef/versions/0.0.1"
New-AzGalleryImageVersion -ResourceGroupName $rgName -GalleryName $galleryName -GalleryImageDefinitionName $galleryImageDefinitionName -Name $galleryImageVersionName -Location $location -SourceImageId $sourceImageId
```
Create a Trusted launch VM from the above image version

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

### Trusted launch VM Images

For the following image sources, the security type on the image definition should be set to `TrustedLaunch`:
- Trusted launch VM capture
- Managed OS disk 
- Managed OS disk snapshot

The resulting image version can be used only to create Azure Trusted launch VMs.

#### [Portal](#tab/portal2)

1. Sign in to the Azure [portal](https://portal.azure.com).
2. To create an Azure Compute Gallery Image from a VM, open an existing Trusted launch VM and select **Capture**.
3. In the Create an Image page that follows, allow the image to be shared to the gallery as a VM image version. Creation of Managed Images is not supported for Trusted Launch VMs.
4. Create a new target Azure Compute Gallery or select an existing gallery.
5. Select the **Operating system state** as either **Generalized** or **Specialized**. If you want to create a generalized image, ensure that you [generalize the VM to remove machine specific information](generalize.md) before selecting this option. If Bitlocker based encryption is enabled on your Trusted launch Windows VM, you may not be able to generalize the same.
6. Create a new image definition by providing a name, publisher, offer and SKU details. The **Security Type** of the image definition should already be set to **Trusted launch**.
7. Provide a version number for the image version.
8. Modify replication options if required.
9. At the bottom of the **Create an Image** page, select **Review + Create** and when validation shows as passed, select **Create**.
10. Once the image version is created, go the image version directly. Alternatively, you can navigate to the required image version through the image definition.
11. On the **VM image version** page, select the **+ Create VM** to land on the Create a virtual machine page.
12. In the Create a virtual machine page, under **Resource group**, select **Create new** and type a name for your resource group or select an existing resource group from the dropdown.
13. Under **Instance details**, type a name for the virtual machine name and choose a region that supports [trusted launch](trusted-launch.md#virtual-machines-sizes).
14. The image and the security type are already populated based on the selected image version. The **Secure Boot** and **vTPM** checkboxes are enabled by default.
15. Fill in the **Administrator account** information and then **Inbound port rules**.
16. At the bottom of the page, select **Review + Create**
1. On the validation page, review the details of the VM.
1. After the validation succeeds, select **Create** to finish creating the VM.

In case you want to use either a managed disk or a managed disk snapshot as a source of the image version (instead of a trusted launch VM), then use the following steps

1.	Sign in to the [portal](https://portal.azure.com)
2.	Search for **VM Image Versions** and select **Create**
3.	Provide the subscription, resource group, region and image version number
4.	Select the source as **Disks and/or Snapshots**
5.	Select the OS disk as a managed disk or a managed disk snapshot from the dropdown list
6.	Select a **Target Azure Compute Gallery** to create and share the image. If no gallery exists, create a new gallery.
7.	Select the **Operating system state** as either **Generalized** or **Specialized**. If you want to create a generalized image, ensure that you generalize the disk or snapshot to remove machine specific information.
8.	For the **Target VM Image Definition** select Create new. In the window that opens, select an image definition name and ensure that the **Security type** is set to **Trusted launch**. Provide the publisher, offer and SKU information and select **OK**.
9.	The **Replication** tab can be used to set the replica count and target regions for image replication, if required.
10.	The **Encryption** tab can also be used to provide SSE encryption related information, if required.
11.	Select **Create** in the **Review + create** tab to create the image
12.	Once the image version is successfully created, select the **+ Create VM** to land on the Create a virtual machine page.
13.	Follow steps 12 to 18 as mentioned earlier to create a trusted launch VM using this image version


#### [CLI](#tab/cli2)

Make sure you are running the latest version of Azure CLI 

Sign in to Azure using `az login`.  

```azurecli-interactive
az login 
```

Create an image definition with `TrustedLaunch` security type 

```azurecli-interactive
az sig image-definition create --resource-group MyResourceGroup --location eastus \ 
--gallery-name MyGallery --gallery-image-definition MyImageDef \ 
--publisher TrustedLaunchPublisher --offer TrustedLaunchOffer --sku TrustedLaunchSku \ 
--os-type Linux --os-state Generalized \ 
--hyper-v-generation V2 \ 
--features SecurityType=TrustedLaunch
```

To create an image version, we can capture an existing Linux based Trusted launch VM. [Generalize the Trusted launch VM](generalize.md) before creating the image version.

```azurecli-interactive
az sig image-version create --resource-group MyResourceGroup \
--gallery-name MyGallery --gallery-image-definition MyImageDef \
--gallery-image-version 1.0.0 \
--managed-image /subscriptions/00000000-0000-0000-0000-00000000xxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM
```

In case a managed disk or a managed disk snapshot needs to be used as the image source for the image version, replace the --managed-image in the above command with --os-snapshot and provide the disk or the snapshot resource name

Create a Trusted launch VM from the above image version

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

Create an image definition with `TrustedLaunch` security type

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

To create an image version, we can capture an existing Windows based Trusted launch VM. [Generalize the Trusted launch VM](generalize.md) before creating the image version.

```azurepowershell-interactive
$rgName = "MyResourceGroup"
$galleryName = "MyGallery"
$galleryImageDefinitionName = "MyImageDef"
$location = "eastus"
$galleryImageVersionName = "1.0.0"
$sourceImageId = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myVMRG/providers/Microsoft.Compute/virtualMachines/myVM"
New-AzGalleryImageVersion -ResourceGroupName $rgName -GalleryName $galleryName -GalleryImageDefinitionName $galleryImageDefinitionName -Name $galleryImageVersionName -Location $location -SourceImageId $sourceImageId
```
Create a Trusted launch VM from the above image version

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

## Verify or update your settings

For VMs created with trusted launch enabled, you can view the trusted launch configuration by visiting the **Overview** page for the VM in the Azure portal. The **Properties** tab will show the status of Trusted Launch features:

:::image type="content" source="./media/trusted-launch/security-type-enabled.png" alt-text="Screenshot of the Trusted Launch properties of the VM.":::

To change the trusted launch configuration, in the left menu, under the **Settings** section, select **Configuration**. You can enable or disable Secure Boot, vTPM, and Integrity Monitoring from the **Security type** section. Select **Save** at the top of the page when you are done.

:::image type="content" source="./media/trusted-launch/verify-integrity-boot-on.png" alt-text="Screenshot showing check boxes to change the Trusted Launch settings.":::

If the VM is running, you will receive a message that the VM will be restarted. Select **Yes** then wait for the VM to restart for changes to take effect.

## Next steps

Learn more about [trusted launch](trusted-launch.md) and [Boot integrity monitoring](boot-integrity-monitoring-overview.md) VMs.
