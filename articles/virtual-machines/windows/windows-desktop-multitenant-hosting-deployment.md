---
title: How to deploy Windows 10 on Azure with Multitenant Hosting Rights 
description: Learn how to maximize your Windows Software Assurance benefits to bring on-premises licenses to Azure
author: xujing
ms.service: virtual-machines-windows
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 1/24/2018
ms.author: xujing

---
# How to deploy Windows 10 on Azure with Multitenant Hosting Rights 
For customers with Windows 10 Enterprise E3/E5 per user or Windows Virtual Desktop Access per user (User Subscription Licenses or Add-on User Subscription Licenses), Multitenant Hosting Rights for Windows 10 allows you to bring your Windows 10 Licenses to the cloud and run Windows 10 Virtual Machines on Azure without paying for another license. For more information, please see [Multitenant Hosting for Windows 10](https://www.microsoft.com/en-us/CloudandHosting/licensing_sca.aspx).

> [!NOTE]
> This article shows you to implement the licensing benefit for Windows 10 Pro Desktop images on Azure Marketplace.
> - For Windows 7, 8.1, 10 Enterprise (x64) images on Azure Marketplace for MSDN Subscriptions, please refer to [Windows client in Azure for dev/test scenarios](client-images.md)
> - For Windows Server licensing benefits, please refer to [Azure Hybrid use benefits for Windows Server images](hybrid-use-benefit-licensing.md).
>

## Deploying Windows 10 Image from Azure Marketplace 
For Powershell, CLI and Azure Resource Manager template deployments, the Windows 10 image can be found with the following publishername, offer, sku.

| OS  |      PublisherName      |  Offer | Sku |
|:----------|:-------------:|:------|:------|
| Windows 10 Pro    | MicrosoftWindowsDesktop | Windows-10  | RS2-Pro   |
| Windows 10 Pro N  | MicrosoftWindowsDesktop | Windows-10  | RS2-ProN  |
| Windows 10 Pro    | MicrosoftWindowsDesktop | Windows-10  | RS3-Pro   |
| Windows 10 Pro N  | MicrosoftWindowsDesktop | Windows-10  | RS3-ProN  |

## Uploading Windows 10 VHD to Azure
if you are uploading a generalized Windows 10 VHD, please note Windows 10 does not have built-in administrator account enabled by default. To enable the built-in administrator account, include the following command as part of the Custom Script extension.

```powershell
Net user <username> /active:yes
```

The following powershell snippet is to mark all administrator accounts as active, including the built-in administrator. This example is useful if the built-in administrator username is unknown.
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


## Deploying Windows 10 with Multitenant Hosting Rights
Make sure you have [installed and configured the latest Azure PowerShell](/powershell/azure/overview). Once you have prepared your VHD, upload the VHD to your Azure Storage account using the `Add-AzVhd` cmdlet as follows:

```powershell
Add-AzVhd -ResourceGroupName "myResourceGroup" -LocalFilePath "C:\Path\To\myvhd.vhd" `
    -Destination "https://mystorageaccount.blob.core.windows.net/vhds/myvhd.vhd"
```


**Deploy using Azure Resource Manager Template Deployment**
Within your Resource Manager templates, an additional parameter for `licenseType` can be specified. You can read more about [authoring Azure Resource Manager templates](../../resource-group-authoring-templates.md). Once you have your VHD uploaded to Azure, edit you Resource Manager template to include the license type as part of the compute provider and deploy your template as normal:
```json
"properties": {
    "licenseType": "Windows_Client",
    "hardwareProfile": {
        "vmSize": "[variables('vmSize')]"
    }
```

**Deploy via PowerShell**
When deploying your Windows Server VM via PowerShell, you have an additional parameter for `-LicenseType`. Once you have your VHD uploaded to Azure, you create a VM using `New-AzVM` and specify the licensing type as follows:
```powershell
New-AzVM -ResourceGroupName "myResourceGroup" -Location "West US" -VM $vm -LicenseType "Windows_Client"
```

## Verify your VM is utilizing the licensing benefit
Once you have deployed your VM through either the PowerShell or Resource Manager deployment method, verify the license type with `Get-AzVM` as follows:
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

## Additional Information about joining Azure AD
>[!NOTE]
>Azure provisions all Windows VMs with built-in administrator account, which cannot be used to join AAD. For example, *Settings > Account > Access Work or School > +Connect* will not work. You must create and log on as a second administrator account to join Azure AD manually. You can also configure Azure AD using a provisioning package, use the link is the *Next Steps* section to learn more.
>
>

## Next Steps
- Learn more about [Configuring VDA for Windows 10](https://docs.microsoft.com/windows/deployment/vda-subscription-activation)
- Learn more about [Multitenant Hosting for Windows 10](https://www.microsoft.com/en-us/CloudandHosting/licensing_sca.aspx)


