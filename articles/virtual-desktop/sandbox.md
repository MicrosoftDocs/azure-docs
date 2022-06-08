---
title: Azure Virtual Desktop Sandbox - Azure
description: How to set up Windows Sandbox for Azure Virtual Desktop.
author: guscatal
ms.topic: how-to
ms.date: 06/09/2022
ms.author: guscatal
manager: costinh
---

# Set up Windows Sandbox in Azure Virtual Desktop

This topic will walk you through how to publish Windows Sandbox for your users in a Azure Virtual Desktop environment.

## Prerequisites

Before you get started, here's what you need to configureWindows Sandbox in Azure Virtual Desktop:

- A working Azure profile that can access the Azure portal.
- A functioning Azure Virtual Desktop deployment. To learn how to deploy Azure Virtual Desktop (classic), see [Create a tenant in Azure Virtual Desktop](./virtual-desktop-fall-2019/tenant-setup-azure-active-directory.md). To learn how to deploy Azure Virtual Desktop with Azure Resource Manager integration, see [Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md).

## Get the OS image from the Azure portal

To get the OS image from the Azure portal:

1. Open the [Azure portal](https://portal.azure.com) and sign in.
2. Go to **Create a resource** > **Virtual Machine**.
3. In the **Basic** tab, for the **Image** field, select **Windows 11 Enterprise multi-session- x64 Gen2**.
<!--You can select Windows 10 Enterprise, Windows 10 Enterprise multi-session- or Windows 11?-->
4. Follow the rest of the instructions to finish creating the virtual machine.
<!--what instructions? nested virtualization?-->

## Prepare the VHD image for Azure

Next, you'll need to create a master VHD image. If you haven't created your master VHD image yet, go to [Prepare and customize a master VHD image](set-up-customize-master-image.md) and follow the instructions there.

After you've created your master VHD image, you must install the Windows Sandbox feature. To install it enter the following commands:
After you've created your master VHD image, you must install the Windows Sandbox feature. To install the VHD image, open the **Remote Desktop Connection** app and sign in to your virtual machine (VM), then open the command prompt and enter the following commands:

```powershell
Enable-WindowsOptionalFeature -FeatureName "Containers-DisposableClientVM" -All -Online
```

>[!NOTE]
>This change will require that you restart the virtual machine.
Next, prepare the VM VHD for Azure and upload the resulting VHD disk to Azure. To learn more, see [Prepare and customize a master VHD image](set-up-customize-master-image.md).
Once you've uploaded the VHD to Azure, create a host pool that's based on this new image by following the instructions in the [Create a host pool by using the Azure Marketplace](create-host-pools-azure-marketplace.md) tutorial.

## Publish Windows Sandbox on your host pool

### [Azure portal](#tab/azure)

To publish Windows Sandbox to your host pool:

1. Sign in to the Azure portal.
2. Under "Application source," select **File Path**.
3. For "Application path," enter **C:\windows\system32\WindowsSandbox.exe**.
4. Enter **Windows Sandbox** into the "Application Name" field.

### [PowerShell](#tab/powershell)

To publish Windows Sandbox to your host pool using PowerShell:

1.  Open Windows PowerShell on your local machine.
2.  Run the following command to sign in to your Azure account:
  
  ```powershell
  az login
  Set-AzContext -Tenant <Workspace Tenant ID> -Subscription <Workspace Subscription ID>
  ```

3. Run the following command to create a Sandbox remote app:

  ```powershell
   New-AzWvdApplication -ResourceGroupName <Resource Group Name> -GroupName <Application Group Name> -FilePath 'C:\windows\system32\WindowsSandbox.exe' -IconIndex 0 -   IconPath 'C:\windows\system32\WindowsSandbox.exe' -CommandLineSetting 'Allow' -ShowInPortal:$true -SubscriptionId <Workspace Subscription ID>
  ```
  <!---this code has "WVD" in it. Is there an updated version? David also spotted some syntax errors here.-->

  >[!NOTE]
  >After running this command, you'll be given a prompt to name the app. Fill out the prompt to continue.

That's it! Leave the rest of the options default. You should now have Windows Sandbox Remote App published for your users.

## Next steps

Learn more about sandboxes and how to use them to test Windows environments at [Windows Sandbox](/windows/security/threat-protection/windows-sandbox/windows-sandbox-overview).