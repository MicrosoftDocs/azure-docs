---
title: Deploy a trusted launch VM
description: Deploy a VM that uses trusted launch.
author: lakmeedee
ms.author: dejv
ms.reviewer: cynthn
ms.service: virtual-machines
ms.subservice: trusted-launch
ms.topic: how-to
ms.date: 03/22/2022
ms.custom: template-how-to, devx-track-azurecli
---

# Deploy a VM with trusted launch enabled

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

[Trusted launch](trusted-launch.md) is a way to improve the security of [generation 2](generation-2.md) VMs. Trusted launch protects against advanced and persistent attack techniques by combining infrastructure technologies like vTPM and secure boot.

## Prerequisites 

- You need to [onboard your subscription to Microsoft Defender for Cloud](https://azure.microsoft.com/services/security-center/?&ef_id=CjwKCAjwwsmLBhACEiwANq-tXHeKhV--teH6kIijnBTmP-PgktfvGr5zW9TAx00SR7xsGUc3sTj5sBoCkEoQAvD_BwE:G:s&OCID=AID2200277_SEM_CjwKCAjwwsmLBhACEiwANq-tXHeKhV--teH6kIijnBTmP-PgktfvGr5zW9TAx00SR7xsGUc3sTj5sBoCkEoQAvD_BwE:G:s&gclid=CjwKCAjwwsmLBhACEiwANq-tXHeKhV--teH6kIijnBTmP-PgktfvGr5zW9TAx00SR7xsGUc3sTj5sBoCkEoQAvD_BwE#overview) if it isn't already. Microsoft Defender for Cloud has a free tier, which offers very useful insights for various Azure and Hybrid resources. Trusted launch leverages Defender for Cloud to surface multiple recommendations regarding VM health. 

- Assign Azure policies initiatives to your subscription. These policy initiatives  need to be assigned  only once per subscription. This will  automatically install all required extensions on all supported VMs. 
    - Configure prerequisites to enable Guest Attestation on Trusted Launch enabled VMs 

    - Configure machines to automatically install the Azure Monitor and Azure Security agents on virtual machines 

 
## Deploy a trusted launch VM
Create a virtual machine with trusted launch enabled. Choose an option below:

### [Portal](#tab/portal)

1. Sign in to the Azure [portal](https://portal.azure.com).
2. Search for **Virtual Machines**.
3. Under **Services**, select **Virtual machines**.
4. In the **Virtual machines** page, select **Add**, and then select **Virtual machine**.
5. Under **Project details**, make sure the correct subscription is selected.
6. Under **Resource group**, select **Create new** and type a name for your resource group or select an existing resource group from the dropdown.
7. Under **Instance details**, type a name for the virtual machine name and choose a region that supports [trusted launch](trusted-launch.md#limitations).
1. For **Security type** select **Trusted launch virtual machines**. This will make two more options appear - **Secure boot** and **vTPM**. Select the appropriate options for your deployment.
    :::image type="content" source="media/trusted-launch/security.png" alt-text="Screenshot showing the options for Trusted Launch.":::
3. Under **Image**, select an image from the **Recommended Gen 2 images compatible with Trusted launch**. For a list, see [images that supports trusted launch](trusted-launch.md#limitations). 
   > [!TIP]
   > If you don't see the Gen 2 version of the image you want in the drop-down, select **See all images** and then change the **Security type** filter to **Trusted Launch**.
13.	Select a VM size that supports trusted launch. See the list of [supported sizes](trusted-launch.md#limitations).
14.	Fill in the **Administrator account** information and then **Inbound port rules**.
15.	At the bottom of the page, select **Review + Create**
16.	On the **Create a virtual machine** page, you can see the details about the VM you are about to deploy. Once validation shows as passed, select **Create**.

    :::image type="content" source="media/trusted-launch/validation.png" alt-text="Sceenshot of the validation page, showing the trusted launch options are included.":::


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

### [PowerShell](#tab/powershell)


In order to provision a VM with Trusted Launch, it first needs to be enabled with the `TrustedLaunch` using the `Set-AzVmSecurityProfile` cmdlet. Then you can use the Set-AzVmUefi cmdlet to set the vTPM and SecureBoot configuration. Use the below snippet as a quick start, remember to replace the values in this example with your own. 

```azurepowershell-interactive
$resourceGroup = "myResourceGroup"
$location = "West US"
$vmName = "myTrustedVM"
$vmSize = Standard_B2s
$publisher = "MicrosoftWindowsServer"
$offer = "WindowsServer"
$sku = "2019-datacenter-gensecond"
$version = latest
$cred = Get-Credential `
   -Message "Enter a username and password for the virtual machine."

$vm = New-AzVMConfig -VMName $vmName -VMSize $vmSize 

$vm = Set-AzVMOperatingSystem `
   -VM $vm -Windows `
   -ComputerName $vmName `
   -Credential $cred `
   -ProvisionVMAgent `
   -EnableAutoUpdate 

$vm = Add-AzVMNetworkInterface -VM $vm `
   -Id $NIC.Id 

$vm = Set-AzVMSourceImage -VM $vm `
   -PublisherName $publisher `
   -Offer $offer `
   -Skus $sku `
   -Version $version 

$vm = Set-AzVMOSDisk -VM $vm `
   -StorageAccountType "StandardSSD_LRS" `
   -CreateOption "FromImage" 

$vm = Set-AzVmSecurityProfile -VM $vm `
   -SecurityType "TrustedLaunch" 

$vm = Set-AzVmUefi -VM $vm `
   -EnableVtpm $true `
   -EnableSecureBoot $true 

New-AzVM -ResourceGroupName $resourceGroup -Location $location -VM $vm 
```
 


### [Template](#tab/template)

You can deploy trusted launch VMs using a quickstart template:

**Linux**

[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.compute%2Fvm-trustedlaunch-linux%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.compute%2Fvm-trustedlaunch-linux%2FcreateUiDefinition.json)

**Windows**

[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.compute%2Fvm-trustedlaunch-windows%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.compute%2Fvm-trustedlaunch-windows%2FcreateUiDefinition.json)

---

## Deploy a trusted launch VM from an Azure Compute Gallery image

### [Portal](#tab/portal2)

1. Sign in to the Azure [portal](https://portal.azure.com).
2. To create an Azure Compute Gallery Image from a VM, open an existing Trusted launch VM and select **Capture**.
3. In the Create an Image page that follows, allow the image to be shared to the gallery as a VM image version as Managed Images are not supported for Trusted Launch.
4. Create a new target Azure Compute Gallery or select an existing gallery.
5. Select the **Operating system state** as either **Generalized** or **Specialized**.
6. Create a new image definition by providing a name, publisher, offer and SKU details. The Security Type of the image definition is already set to 'Trusted launch'.
7. Provide a version number for the image version.
8. Modify replication options if required.
9. At the bottom of the **Create an Image** page, select **Review + Create** and when validation shows as passed, select **Create**.
10. Once the image version is created, go the image version directly. Alternatively, you can navigate to the required image version through the image definition.
11. On the **VM image version** page, select the **+ Create VM** to land on the Create a virtual machine page.
12. In the Create a virtual machine page, under **Resource group**, select **Create new** and type a name for your resource group or select an existing resource group from the dropdown.
13. Under **Instance details**, type a name for the virtual machine name and choose a region that supports [trusted launch](trusted-launch.md#limitations).
14. The image and the security type are already populated based on the selected image version. The **Secure Boot** and **vTPM** checkboxes are enabled by default.
15. Fill in the **Administrator account** information and then **Inbound port rules**.
16. At the bottom of the page, select **Review + Create**
17. On the **Create a virtual machine** page, you can see the details about the VM you are about to deploy. Once validation shows as passed, select **Create**.

### [CLI](#tab/cli2)

Make sure you are running the latest version of Azure CLI 

Sign in to Azure using `az login`.  

```azurecli-interactive
az login 
```

Create an image definition with TrustedLaunch security type 

```azurecli-interactive
az sig image-definition create --resource-group MyResourceGroup --location eastus \ 
--gallery-name MyGallery --gallery-image-definition MyImageDef \ 
--publisher TrustedLaunchPublisher --offer TrustedLaunchOffer --sku TrustedLaunchSku \ 
--os-type Linux --os-state Generalized \ 
--hyper-v-generation V2 \ 
--features SecurityType=TrustedLaunch
```

Generalize the VM using waagagent command and create an image version with an existing Trusted Launch VM as image source

```azurecli-interactive
az sig image-version create --resource-group MyResourceGroup \
--gallery-name MyGallery --gallery-image-definition MyImageDef \
--gallery-image-version 1.0.0 \
--managed-image /subscriptions/00000000-0000-0000-0000-00000000xxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM
```
Create a Trusted Launch VM from the above image version

```azurecli-interactive
adminUsername=linuxvm
az vm create --resource-group MyResourceGroup \
    --name myTrustedLaunchVM \
    --image "/subscriptions/00000000-0000-0000-0000-00000000xxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/galleries/MyGallery/images/MyImageDef" \
    --security-type TrustedLaunch \
    --enable-secure-boot true \ 
    --enable-vtpm true \
    --admin-username $adminUsername \
    --generate-ssh-keys
```

### [PowerShell](#tab/powershell2)

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

Generalize the VM using sysprep tool and create an image version with an existing Trusted Launch VM as image source

```azurepowershell-interactive
$rgName = "MyResourceGroup"
$galleryName = "MyGallery"
$galleryImageDefinitionName = "MyImageDef"
$location = "eastus"
$galleryImageVersionName = "1.0.0"
$sourceImageId = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myVMRG/providers/Microsoft.Compute/virtualMachines/myVM"
New-AzGalleryImageVersion -ResourceGroupName $rgName -GalleryName $galleryName -GalleryImageDefinitionName $galleryImageDefinitionName -Name $galleryImageVersionName -Location $location -SourceImageId $sourceImageId
```
Create a Trusted Launch VM from the above image version

```azurepowershell-interactive
$rgName = "MyResourceGroup"
$galleryName = "MyGallery"
$galleryImageDefinitionName = "MyImageDef"
$location = "eastus"
$vmName = "myVMfromImage"
$vmSize = "Standard_D2s_v3"
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
   -ResourceGroupName $resourceGroup `
   -Location $location `
   -Name MYvNET `
   -AddressPrefix 192.168.0.0/16 `
   -Subnet $subnetConfig
$pip = New-AzPublicIpAddress `
   -ResourceGroupName $resourceGroup `
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
   -ResourceGroupName $resourceGroup `
   -Location $location `
  -Name myNetworkSecurityGroup `
  -SecurityRules $nsgRuleRDP
$nic = New-AzNetworkInterface `
   -Name myNic `
   -ResourceGroupName $resourceGroup `
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
## Verify or update your settings

For VMs created with trusted launch enabled, you can view the trusted launch configuration by visiting the **Overview** page for the VM in the portal. The **Properties** tab will show the status of Trusted Launch features:

:::image type="content" source="media/trusted-launch/overview-properties.png" alt-text="Screenshot of the Trusted Launch properties of the VM.":::

To change the trusted launch configuration, in the left menu, select **Configuration** under the **Settings** section. You can enable or disable Secure Boot and vTPM from the Trusted LaunchSecurity type section. Select Save at the top of the page when you are done. 

:::image type="content" source="media/trusted-launch/update.png" alt-text="Screenshot showing check boxes to change the Trusted Launch settings.":::

If the VM is running, you will receive a message that the VM will be restarted. Select **Yes** then wait for the VM to restart for changes to take effect. 


## Next steps

Learn more about [trusted launch](trusted-launch.md) and [Generation 2](generation-2.md) VMs.
