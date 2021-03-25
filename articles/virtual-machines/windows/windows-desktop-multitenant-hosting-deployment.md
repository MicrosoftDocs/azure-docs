---
title: How to deploy Windows 10 on Azure with Multitenant Hosting Rights 
description: Learn how to maximize your Windows Software Assurance benefits to bring on-premises licenses to Azure with Multitenant Hosting Rights.
author: mimckitt
ms.service: virtual-machines
ms.collection: windows
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 2/2/2021
ms.author: mimckitt
ms.custom: rybaker, chmimckitt

---
# How to deploy Windows 10 on Azure with Multitenant Hosting Rights 
For customers with Windows 10 Enterprise E3/E5 per user or Windows Virtual Desktop Access per user (User Subscription Licenses or Add-on User Subscription Licenses), Multitenant Hosting Rights for Windows 10 allows you to bring your Windows 10 Licenses to the cloud and run Windows 10 Virtual Machines on Azure without paying for another license. Multitenant Hosting Rights are only available for Windows 10 (version 1703 or later).

For more information, see [Multitenant Hosting for Windows 10](https://www.microsoft.com/en-us/CloudandHosting/licensing_sca.aspx).

> [!NOTE]
> - To use Windows 7, 8.1 and 10 images for development or testing see [Windows client in Azure for dev/test scenarios](client-images.md)
> - For Windows Server licensing benefits, please refer to [Azure Hybrid use benefits for Windows Server images](hybrid-use-benefit-licensing.md).

## Subscription Licenses that qualify for Multitenant Hosting Rights

Using the [Microsoft admin center](/microsoft-365/admin/admin-overview/about-the-admin-center), you can confirm if a user has been assigned a Windows 10 supported license.

> [!IMPORTANT]
> Users must have one of the below subscription licenses in order to use Windows 10 images in Azure. If you do not have one of these subscription licenses, they can be purchased through your [Cloud Service Partner](https://azure.microsoft.com/overview/choosing-a-cloud-service-provider/) or directly through [Microsoft](https://www.microsoft.com/microsoft-365?rtc=1).

**Eligible subscription licenses:**

-	Microsoft 365 E3/E5 
-	Microsoft 365 F3 
-	Microsoft 365 A3/A5 
-	Windows 10 Enterprise E3/E5
-	Windows 10 Education A3/A5 
-	Windows VDA E3/E5


## Deploying Windows 10 Image from Azure Marketplace 
For PowerShell, CLI and Azure Resource Manager template deployments, Windows 10 images can be found using the `PublisherName: MicrosoftWindowsDesktop` and `Offer: Windows-10`. Windows 10 version Creators Update (1809) or later is supported for Multitenant Hosting Rights. 

```powershell
Get-AzVmImageSku -Location '$location' -PublisherName 'MicrosoftWindowsDesktop' -Offer 'Windows-10'

Skus                        Offer      PublisherName           Location 
----                        -----      -------------           -------- 
rs4-pro                     Windows-10 MicrosoftWindowsDesktop eastus   
rs4-pron                    Windows-10 MicrosoftWindowsDesktop eastus   
rs5-enterprise              Windows-10 MicrosoftWindowsDesktop eastus   
rs5-enterprisen             Windows-10 MicrosoftWindowsDesktop eastus   
rs5-pro                     Windows-10 MicrosoftWindowsDesktop eastus   
rs5-pron                    Windows-10 MicrosoftWindowsDesktop eastus  
```

For more information on available images see [Find and use Azure Marketplace VM images with Azure PowerShell](./cli-ps-findimage.md)

## Uploading Windows 10 VHD to Azure
if you are uploading a generalized Windows 10 VHD, please note Windows 10 does not have built-in administrator account enabled by default. To enable the built-in administrator account, include the following command as part of the Custom Script extension.

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


## Deploying Windows 10 with Multitenant Hosting Rights
Make sure you have [installed and configured the latest Azure PowerShell](/powershell/azure/). Once you have prepared your VHD, upload the VHD to your Azure Storage account using the `Add-AzVhd` cmdlet as follows:

```powershell
Add-AzVhd -ResourceGroupName "myResourceGroup" -LocalFilePath "C:\Path\To\myvhd.vhd" `
    -Destination "https://mystorageaccount.blob.core.windows.net/vhds/myvhd.vhd"
```


**Deploy using Azure Resource Manager Template Deployment**
Within your Resource Manager templates, an additional parameter for `licenseType` can be specified. You can read more about [authoring Azure Resource Manager templates](../../azure-resource-manager/templates/template-syntax.md). Once you have your VHD uploaded to Azure, edit you Resource Manager template to include the license type as part of the compute provider and deploy your template as normal:
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
Azure provisions all Windows VMs with built-in administrator account, which cannot be used to join AAD. For example, *Settings > Account > Access Work or School > +Connect* will not work. You must create and log on as a second administrator account to join Azure AD manually. You can also configure Azure AD using a provisioning package, use the link in the *Next Steps* section to learn more.

## Next Steps
- Learn more about [Configuring VDA for Windows 10](/windows/deployment/vda-subscription-activation)
- Learn more about [Multitenant Hosting for Windows 10](https://www.microsoft.com/en-us/CloudandHosting/licensing_sca.aspx)