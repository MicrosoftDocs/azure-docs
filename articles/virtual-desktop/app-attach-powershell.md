---
title: Windows Virtual Desktop MSIX app attach preview PowerShell - Azure
description: How to set up MSIX app attach for Windows Virtual Desktop using PowerShell.
author: Heidilohr
ms.topic: how-to
ms.date: 11/09/2020
ms.author: helohr
manager: lizross
---
# Set up MSIX app attach (preview) using PowerShell

> [!IMPORTANT]
> MSIX app attach is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In addition to the Azure portal, you can also set up MSIX app attach (preview) manually with PowerShell. This article will walk you through how to use PowerShell to set up MSIX app attach.

## Prerequisites

In order to set up MSIX app attach with PowerShell, you'll need the following things:

- A host pool in Windows Virtual Desktop with at least one active session host.

- A Desktop remote app group

- An MSIX-packaged application expanded into an MSIX image, then uploaded to a file share that's accessible by all virtual machines (VMs) with read-only permissions in your host pool.

- Download and install PowerShell Core.

- Download the public preview Azure PowerShell module and expand it to a local folder.

## Sign in to Azure and import the module

Open PowerShell core in an elevated command prompt and run this cmdlet:

```powershell
Connect-AzAccount
```

After you run it, authenticate your account using your credentials. In this case, you might be asked for a device URL or a token.

## Import the Az.WindowsVirtualDesktop module

You'll need the Az.DesktopVirtualization module to follow the instructions in this article.

>[!NOTE]
>For the public preview, we will provide the module as separate ZIP files that you must manually import.

Before you start, you can run the following cmdlet to see if the Az.DesktopVirtualization module is already installed on your session or VM:

```powershell
Get-Module | Where-Object { $_.Name -Like "desktopvirtualization" }
```

If you wan to uninstall an existing copy of the module and start over, run this cmdlet:

```powershell
Uninstall-Module Az.DesktopVirtualization
```

If the module is blocked on your VM, run this cmdlet to unblock it:

```powershell
Unblock-File "<path>\Az.DesktopVirtualization.psm1"
```

With that cleanup out of the way, it's time to import the module.

1. Run the following cmdlet, then press the **R** key when prompted to agree to run the custom code.

   ```powershell
   Import-Module -Name "<path>\Az.DesktopVirtualization.psm1" -Verbose
   ```

2. Once you've run the import cmdlet, check to see if it has the cmdlets for MSIX by running the following cmdlet:

   ```powershell
   Get-Command -Module Az.DesktopVirtualization | Where-Object { $_.Name -like "MSIX" }
   ```

   If the cmdlets are there, the output should look like this:

   ```powershell
   CommandType     Name                                               Version    Source

   -----------     ----                                               -------    ------

   Function        Expand-AzWvdMsixImage                              0.0        Az.DesktopVirtualization

   Function        Get-AzWvdMsixPackage                               0.0        Az.DesktopVirtualization

   Function        New-AzWvdMsixPackage                               0.0        Az.DesktopVirtualization

   Function        Remove-AzWvdMsixPackage                            0.0        Az.DesktopVirtualization

   Function        Update-AzWvdMsixPackage                            0.0        Az.DesktopVirtualization
   ```

   If you don't see this output, close all PowerShell and PowerShell Core sessions and try again.

## Set up helper variables

Once you've imported the module, you'll need to set up the helper variables. The following examples will show you how to do each one.

To get your subscription ID:

```powershell
Get-AzContext -ListAvailable | fl
```

To select the context of an Azure tenant and subscription with a name:

```powershell
$obj = Select-AzContext -Name "<Name>"
```

To set the subscription variable:

```powershell
$subId = $obj.Subscription.Id
```

To set the workspace name:

```powershell
$ws = "<WorksSpaceName>"
```

To set up the resource group where the session host VMs are configured:

```powershell
$rg = "<ResourceGroupName>"
```

And finally, to confirm you've correctly set all the variables:

```powershell
Get-AzWvdWorkspace -Name $ws -ResourceGroupName $rg -SubscriptionId $subID
```

## Add an MSIX package to a host pool

Once you've set everything up, it's time to add the MSIX package to a host pool. To do that, you'll first need to get UNC path to the MSIX image.

1. Using the UNC path, run this cmdlet to expand the MSIX image:

   ```powershell
   $obj = Expand-AzWvdMsixImage -HostPoolName $hp -ResourceGroupName $rg -SubscriptionId $subID -Uri <UNCPath>
   ```

Run this cmdlet to add the MSIX package to your desired host pool:

   ```powershell
   New-AzWvdMsixPackage -HostPoolName $hp -ResourceGroupName $rg -SubscriptionId $subId -PackageAlias $obj.PackageAlias -DisplayName <DisplayName> -ImagePath <UNCPath>
   ```

Once you're done, confirm the package was created with this cmdlet:

   ```powershell
   Get-AzWvdMsixPackage -HostPoolName $hp -ResourceGroupName $rg -SubscriptionId $subId | Where-Object {$_.PackageFamilyName -eq $obj.PackageFamilyName}
   ```

## Remove an MSIX package from a host pool

To remove a package from a host pool:

1. Get a list of all packages associated with a host pool with this cmdlet, then find the name of the package you want to remove in the output:

   ```powershell
   Get-AzWvdMsixPackage -HostPoolName $hp -ResourceGroupName $rg -SubscriptionId $subId 
   ```

   Alternatively, you can also get a particular package based on its display name with this cmdlet:

   ```powershell
   Get-AzWvdMsixPackage -HostPoolName $hp -ResourceGroupName $rg -SubscriptionId $subId | Where-Object { $_.Name -like "Power" }
   ```

2. To remove the package, run this cmdlet:

   ```powershell
   Remove-AzWvdMsixPackage -FullName $obj.PackageFullName -HostPoolName $hp -ResourceGroupName $rg -FullName <FullName>
   ```

## Publish MSIX apps to an app group

You can only follow the instructions in this section if you've finished following the instructions in the previous sections. If you have a host pool with an active session host, at least one Desktop app group, and have added an MSIX package to the host pool, you're ready to go.

To publish an app from the MSIX package to an app group, you'll need to find its name, then use that name in the publishing cmdlet.

To publish an app:

1. Run this cmdlet to list all available app groups:

   ```powershell
   Get-AzWvdApplicationGroup -ResourceGroupName $rg -SubscriptionId $subId
   ```

2. When you've found the name of the app group you want to publish apps to, use its name in this cmdlet:

   ```powershell
   $grName = (Get-AzWvdApplicationGroup -ResourceGroupName $rg -SubscriptionId $subId -Name <AppGroupName>.Name
   ```

3. Finally, you'll need to publish the app.

   To publish MSIX application to a desktop app group, run this cmdlet:

   ```powershell
   New-AzWvdApplication -ResourceGroupName $rg -SubscriptionId $subId -Name PowerBi -ApplicationType MsixApplication -ApplicationGroupName $grName -MsixPackageFamilyName $obj.PackageFamilyName -CommandLineSetting 0
   ```

To publish the app to a emote app group, run this cmdlet instead:

   ```powershell
   New-AzWvdApplication -ResourceGroupName $rg -SubscriptionId $subId -Name PowerBi -ApplicationType MsixApplication -ApplicationGroupName $grName -MsixPackageFamilyName $obj.PackageFamilyName -CommandLineSetting 0 -MsixPackageApplicationId $obj.PackageApplication.AppId
   ```

>[!NOTE]
>If a user is assigned to both a remote app group and a desktop app group in the same host pool, the desktop app group will be displayed in the feed by default.

## Next steps

Ask our community questions about this feature at the [Windows Virtual Desktop TechCommunity](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop).

You can also leave feedback for Windows Virtual Desktop at the [Windows Virtual Desktop feedback hub](https://support.microsoft.com/help/4021566/windows-10-send-feedback-to-microsoft-with-feedback-hub-app).

Here are some other articles you might find helpful:

- [MSIX app attach glossary](app-attach-glossary.md)
- [MSIX app attach FAQ](app-attach-faq.md)