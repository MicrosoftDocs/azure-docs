---
title: Azure Virtual Desktop Sandbox - Azure
description: How to set up Windows Sandbox for Azure Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 03/07/2023
ms.author: helohr
manager: femila
ms.custom: devx-track-azurepowershell
---

# Set up Windows Sandbox in Azure Virtual Desktop

This topic will walk you through how to publish Windows Sandbox for your users in an Azure Virtual Desktop environment.

## Prerequisites

Before you get started, here's what you need to configure Windows Sandbox in Azure Virtual Desktop:

- A working Azure profile that can access the Azure portal.
- A functioning Azure Virtual Desktop deployment. To learn how to deploy Azure Virtual Desktop (classic), see [Create a tenant in Azure Virtual Desktop](./virtual-desktop-fall-2019/tenant-setup-azure-active-directory.md). To learn how to deploy Azure Virtual Desktop with Azure Resource Manager integration, see [Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md).
- Azure Virtual Desktop session hosts that supported the nested virtualization capability. To check if a specific VM size supports nested virtualization, navigate to the description page matching your VM size from [Sizes for virtual machines in Azure](../virtual-machines/sizes-general.md).

## Prepare the VHD image for Azure

First, you'll need to create a custom VHD image. If you haven't created your custom VHD image yet, go to [Prepare and customize a master VHD image](set-up-customize-master-image.md) and follow the instructions there. When you're given the option to select an operating system (OS) for your master image, select either Windows 10 or Windows 11.

When customizing your master image, you'll need to enable the **Containers-DisposableClientVM** feature by running the following command:

```powershell
Enable-WindowsOptionalFeature -FeatureName "Containers-DisposableClientVM" -All -Online
```

>[!NOTE]
>This change will require that you restart the virtual machine.

Once you've uploaded the VHD to Azure, create a host pool that's based on this new image by following the instructions in the [Create a host pool by using the Azure Marketplace](create-host-pools-azure-marketplace.md) tutorial.

## Publish Windows Sandbox on your host pool

### [Azure portal](#tab/azure)

To publish Windows Sandbox to your host pool:

1. Sign in to the Azure portal.

1. In the search bar, enter **Azure Virtual Desktop** and select the matching service entry.

1. Select **Application groups**, then select the name of the application group in the host pool you want to publish Windows Sandbox to.

4. Once you're in the application group, select the **Applications** tab. The Applications grid will display all existing apps within the application group.

1. Select **+ Add** to open the **Add application** tab.

1. For **Application source**, select **File Path**.

1. For **Application path**, enter **C:\windows\system32\WindowsSandbox.exe**.

1. Enter **Windows Sandbox** into the **Application Name** field.

1.  When you're done, select **Save**.

### [Azure PowerShell](#tab/powershell)

To publish Windows Sandbox to your host pool using PowerShell:

1. Connect to Azure using one of the following methods:

   - Open a PowerShell prompt on your local device. Run the `Connect-AzAccount` cmdlet to sign in to your Azure account. For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).
   - Sign in to the [Azure portal](https://portal.azure.com) and open [Azure Cloud Shell](../cloud-shell/overview.md) with PowerShell as the shell type.

1. Run the following cmdlet to get a list of all the Azure tenants your account has access to:

   ```azurepowershell-interactive
   Get-AzTenant
   ```

   When you see the tenant you want to sign in to, make a note of its name.

1. Run the following command to store the ID of the Azure tenant you want to connect to, replacing `"Fabrikam"` with your tenant name:

   ```azurepowershell-interactive
   $tenantId = (Get-AzTenant | Where-Object Name -eq Fabrikam).Id
   ```

1. Run the following command to list all subscriptions containing a host pool that are currently available to you:

   ```azurepowershell-interactive
   Get-AzSubscription -TenantId $tenantId
   ```

   Find the name of the subscription that contains a host pool you want to assign a managed identity to in that list. Once you do, make a note of its name and ID.

1. Change your current Azure session to use the subscription you identified in the previous step, replacing the placeholder value `<subscription name or id>` with the name or ID of the subscription you want to use:

   ```azurepowershell-interactive
   Set-AzContext -Tenant $tenantId -Subscription <subscription name or id>
   ```

1. Run the following command to create a Sandbox RemoteApp:

   ```azurepowershell-interactive
   New-AzWvdApplication -ResourceGroupName <Resource Group Name> -GroupName <Application Group Name> -FilePath C:\windows\system32\WindowsSandbox.exe -IconIndex 0 -IconPath C:\windows\system32\WindowsSandbox.exe -CommandLineSetting 'Allow' -ShowInPortal:$true -SubscriptionId <Workspace Subscription ID>
   ```

   >[!NOTE]
   >After running this command, you'll be given a prompt to name the app. Fill out the prompt to continue.

---

That's it! Leave the rest of the options default. You should now have Windows Sandbox published as a RemoteApp for your users.

## Next steps

Learn more about sandboxes and how to use them to test Windows environments at [Windows Sandbox](/windows/security/threat-protection/windows-sandbox/windows-sandbox-overview).
