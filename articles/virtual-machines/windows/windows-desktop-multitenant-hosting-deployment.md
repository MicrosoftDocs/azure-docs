---
title: How to deploy Windows 11 on Azure 
description: Learn how to maximize your Windows Software Assurance benefits to bring on-premises licenses to Azure with Multitenant Hosting Rights.
author: mimckitt
ms.service: virtual-machines
ms.collection: windows
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 10/24/2022
ms.author: mimckitt
ms.custom: rybaker, chmimckitt, devx-track-azurepowershell

---
# How to deploy Windows 11 on Azure
**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets

For customers with Windows 11 Enterprise E3/E5 per user or Azure Virtual Desktop Access per user (User Subscription Licenses or Add-on User Subscription Licenses), Multitenant Hosting Rights for Windows 11 allows you to bring your Windows 11 Licenses to the cloud and run Windows 11 Virtual Machines on Azure without paying for another license.

For more information, see [Multitenant Hosting for Windows 11](https://www.microsoft.com/en-us/CloudandHosting).

> [!NOTE]
> - To use Windows 7, 8.1 and 10 images for development or testing see [Windows client in Azure for dev/test scenarios](client-images.md)
> - Student & Free Trial accounts are enabled to deploy Windows 11 images for development or testing purposes.
> - For Windows Server licensing benefits, please refer to [Azure Hybrid use benefits for Windows Server images](hybrid-use-benefit-licensing.md).
> - When selecting a VM size, ensure the size meets the [Windows 11 hardware minimum requirements](/windows-hardware/design/minimum/minimum-hardware-requirements-overview)

## Subscription Licenses that qualify for Multitenant Hosting Rights

For more details about subscription licenses that qualify to run Windows 11 on Azure, download the [Windows 11 licensing brief for Virtual Desktops](https://download.microsoft.com/download/3/D/4/3D42BDC2-6725-4B29-B75A-A5B04179958B/Licensing_brief_PLT_Windows_10_licensing_for_Virtual_Desktops.pdf)

> [!IMPORTANT]
> Users **must** have one of the below subscription licenses in order to use Windows 11 images in Azure for any production workload. If you do not have one of these subscription licenses, they can be purchased through your [Cloud Service Partner](https://azure.microsoft.com/overview/choosing-a-cloud-service-provider/) or directly through [Microsoft](https://www.microsoft.com/microsoft-365?rtc=1).

## Operating systems and licenses

You have a choice of operating systems that you can use for session hosts to provide virtual desktops and remote apps. You can use different operating systems with different host pools to provide flexibility to your users. Supported dates are inline with the [Microsoft Lifecycle Policy](/lifecycle/). We support the following 64-bit versions of these operating systems: 

### Operating system licenses
- Windows 11 Enterprise multi-session
- Windows 11 Enterprise
- Windows 10 Enterprise, version 1909 and later (For Windows 10 deployments)

### License entitlement
- Microsoft 365 E3, E5, A3, A5, F3, Business Premium, Student Use Benefit
- Windows Enterprise E3, E5
- Windows VDA E3, E5
- Windows Education A3, A5

External users can use [per-user access pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/) instead of license entitlement.

## Deploying Windows 11 Image from Azure Marketplace 
For PowerShell, CLI and Azure Resource Manager template deployments, Windows 11 images can be found using the `PublisherName: MicrosoftWindowsDesktop` and `Offer: Windows-11`.

```powershell
Get-AzVmImageSku -Location 'West US' -PublisherName 'MicrosoftWindowsDesktop' -Offer 'Windows-11'

Skus                 Offer      PublisherName           Location
----                 -----      -------------           --------
win11-21h2-avd       Windows-11 MicrosoftWindowsDesktop westus
win11-21h2-ent       Windows-11 MicrosoftWindowsDesktop westus   
win11-21h2-entn      Windows-11 MicrosoftWindowsDesktop westus  
win11-21h2-pro       Windows-11 MicrosoftWindowsDesktop westus  
win11-21h2-pron      Windows-11 MicrosoftWindowsDesktop westus  
win11-22h2-avd       Windows-11 MicrosoftWindowsDesktop westus  
win11-22h2-ent       Windows-11 MicrosoftWindowsDesktop westus  
win11-22h2-entn      Windows-11 MicrosoftWindowsDesktop westus  
win11-22h2-pro       Windows-11 MicrosoftWindowsDesktop westus  
win11-22h2-pron      Windows-11 MicrosoftWindowsDesktop westus  

```

For more information on available images, see [Find and use Azure Marketplace VM images with Azure PowerShell](./cli-ps-findimage.md)

> [!NOTE]
> If you are upgrading to a newer version of Windows 11 with Trusted launch enabled and you are currently on a Windows 11 version without Trusted Launch enabled, the VM needs to be deallocated before proceeding with the upgrade. For more information, see [Enabling Trusted Launch on existing Azure VMs](../../virtual-machines/trusted-launch-existing-vm.md)

## Uploading Windows 11 VHD to Azure
If you're uploading a generalized Windows 11 VHD,  note Windows 11 doesn't have built-in administrator account enabled by default. To enable the built-in administrator account, include the following command as part of the Custom Script extension.

```powershell
Net user <username> /active:yes
```

The following PowerShell snippet is to mark all administrator accounts as active, including the built-in administrator. This example is useful if the built-in administrator username is unknown.
```powershell
$adminAccount = Get-WmiObject Win32_UserAccount -filter "LocalAccount=True" | ? {$_.SID -Like "S-1-5-21-*-500"}
if($adminAccount.Disabled)
{
    $adminAccount.Disabled = $false
    $adminAccount.Put()
}
```
For more information: 
* [How to upload VHD to Azure](upload-generalized-managed.md)
* [How to prepare a Windows VHD to upload to Azure](prepare-for-upload-vhd-image.md)


## Deploying Windows 11 with Multitenant Hosting Rights
Make sure you've [installed and configured the latest Azure PowerShell](/powershell/azure/). Once you've prepared your VHD, upload the VHD to your Azure Storage account using the `Add-AzVhd` cmdlet as follows:

```powershell
Add-AzVhd -ResourceGroupName "myResourceGroup" -LocalFilePath "C:\Path\To\myvhd.vhd" `
    -Destination "https://mystorageaccount.blob.core.windows.net/vhds/myvhd.vhd"
```


**Deploy using Azure Resource Manager Template Deployment**
Within your Resource Manager templates, an additional parameter for `licenseType` can be specified. You can read more about [authoring Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md). Once you've your VHD uploaded to Azure, edit your Resource Manager template to include the license type as part of the compute provider and deploy your template as normal:
```json
"properties": {
    "licenseType": "Windows_Client",
    "hardwareProfile": {
        "vmSize": "[variables('vmSize')]"
    }
```

**Deploy via PowerShell**
When deploying your Windows Server VM via PowerShell, you need to add another parameter for `-LicenseType`. Once you have your VHD uploaded to Azure, you can create a VM using `New-AzVM` and specify the licensing type as follows:

```powershell
New-AzVM -ResourceGroupName "myResourceGroup" -Location "West US" -VM $vm -LicenseType "Windows_Client"
```

## Verify your VM is utilizing the licensing benefit
Once you've deployed your VM through either the PowerShell or Resource Manager deployment method, verify the license type with `Get-AzVM`:
```powershell
Get-AzVM -ResourceGroup "myResourceGroup" -Name "myVM"
```

The output is similar to the following example for Windows 10 with correct license type:

```powershell
Type                     : Microsoft.Compute/virtualMachines
Location                 : westus
LicenseType              : Windows_Client
```

This output contrasts with the following VM deployed without Azure Hybrid Use Benefit licensing, such as a VM deployed straight from the Azure Gallery:

```powershell
Type                     : Microsoft.Compute/virtualMachines
Location                 : westus
LicenseType              :
```

<a name='additional-information-about-joining-azure-active-directory'></a>

## Additional Information about joining Microsoft Entra ID
Azure provisions all Windows VMs with built-in administrator account, which can't be used to join Microsoft Entra ID. For example, *Settings > Account > Access Work or School > + Connect* won't work. You must create and log on as a second administrator account to join Microsoft Entra ID manually. You can also configure Microsoft Entra ID using a provisioning package, use the link in the *Next Steps* section to learn more.

## Next Steps
- Learn more about [Configuring VDA for Windows 11](/windows/deployment/vda-subscription-activation)
- Learn more about [Multitenant Hosting for Windows 11](https://www.microsoft.com/en-us/CloudandHosting)
