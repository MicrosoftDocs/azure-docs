---
title: Deploy a trusted launch VM
description: Deploy a VM that uses trusted launch.
author: cynthn
ms.author: cynthn
ms.reviewer: cynthn
ms.service: virtual-machines
ms.subservice: trusted-launch
ms.topic: how-to
ms.date: 12/07/2021
ms.custom: template-how-to
---

# Deploy a VM with trusted launch enabled

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets

[Trusted launch](trusted-launch.md) is a way to improve the security of [generation 2](generation-2.md) VMs. Trusted launch protects against advanced and persistent attack techniques by combining infrastructure technologies like vTPM and secure boot.

## Prerequisites 

- You need to [onboard your subscription to Microsoft Defender for Cloud](https://azure.microsoft.com/services/security-center/?&ef_id=CjwKCAjwwsmLBhACEiwANq-tXHeKhV--teH6kIijnBTmP-PgktfvGr5zW9TAx00SR7xsGUc3sTj5sBoCkEoQAvD_BwE:G:s&OCID=AID2200277_SEM_CjwKCAjwwsmLBhACEiwANq-tXHeKhV--teH6kIijnBTmP-PgktfvGr5zW9TAx00SR7xsGUc3sTj5sBoCkEoQAvD_BwE:G:s&gclid=CjwKCAjwwsmLBhACEiwANq-tXHeKhV--teH6kIijnBTmP-PgktfvGr5zW9TAx00SR7xsGUc3sTj5sBoCkEoQAvD_BwE#overview) if it isn't already. Microsoft Defender for Cloud has a free tier, which offers very useful insights for various Azure and Hybrid resources. Trusted launch leverages Defender for Cloud to surface multiple recommendations regarding VM health. 

- Assign Azure policies initiatives to your subscription. These policy initiatives  need to be assigned  only once per subscription. This will  automatically install all required extensions on all supported VMs. 
    - Configure prerequisites to enable Guest Attestation on Trusted Launch enabled VMs 

    - Configure machines to automatically install the Azure Monitor and Azure Security agents on virtual machines 

 
## Deploy a trusted VM
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


In order to provision a VM with Trusted Launch, it first needs to be enabled with the `TrustedLaunch` using the `Set-AzVmSecurityType` cmdlet. Then you can use the Set-AzVmUefi cmdlet to set the vTPM and SecureBoot configuration. Use the below snippet as a quick start, remember to replace the values in this example with your own. 

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

$vm = Set-AzVmSecurityType -VM $vm `
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

## Verify or update your settings

For VMs created with trusted launch enabled, you can view the trusted launch configuration by visiting the **Overview** page for the VM in the portal. The **Properties** tab will show the status of Trusted Launch features:

:::image type="content" source="media/trusted-launch/overview-properties.png" alt-text="Screenshot of the Trusted Launch properties of the VM.":::

To change the trusted launch configuration, in the left menu, select **Configuration** under the **Settings** section. You can enable or disable Secure Boot and vTPM from the Trusted LaunchSecurity type section. Select Save at the top of the page when you are done. 

:::image type="content" source="media/trusted-launch/update.png" alt-text="Screenshot showing check boxes to change the Trusted Launch settings.":::

If the VM is running, you will receive a message that the VM will be restarted. Select **Yes** then wait for the VM to restart for changes to take effect. 


## Next steps

Learn more about [trusted launch](trusted-launch.md) and [Generation 2](generation-2.md) VMs.
