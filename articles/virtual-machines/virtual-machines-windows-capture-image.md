<properties
	pageTitle="Create a VM image from an Azure VM | Microsoft Azure"
	description="Learn how to create a generalized VM image from an existing Azure VM created in the Resource Manager deployment model"
	services="virtual-machines-windows"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/04/2016"
	ms.author="cynthn"/>


# How to create a generalized VM image from an existing Azure VM


This article shows you how to use Azure PowerShell create a generalized image of an existing Azure VM. You can then use the image to create another VM. This image includes the OS disk and the data disks that are attached to the virtual machine. The image doesn't include the virtual network resources, so you need to set up those resources when you create a VM using the image. This process creates a [generalized Windows image](https://technet.microsoft.com/library/hh824938.aspx).


## Prerequisites

- These steps assume that you already have an Azure virtual machine in the Resource Manager deployment model that you want to use to create the image. You need the VM name and the name of the resource group. You can get a list of the resource groups in your subscription by typing the PowerShell cmdlet `Get-AzureRmResourceGroup`. You can get a list of the VMs in your subscription by typing `Get-AzureRMVM`.

- You need to have Azure PowerShell version 1.0.x installed. If you haven't already installed PowerShell, read [How to install and configure Azure PowerShell](../powershell-install-configure.md) for installation steps.

- Make sure the server roles running on the machine are supported by Sysprep. For more information, see [Sysprep Support for Server Roles](https://msdn.microsoft.com/windows/hardware/commercialize/manufacture/desktop/sysprep-support-for-server-roles)

## Prepare the source VM 

This section shows you how to generalize your Windows virtual machine so that it can be used as an image.

> [AZURE.WARNING] You cannot log in to the VM via RDP once it is generalized, because the process removes all user accounts. The changes are irreversible. 

1. Sign in to your Windows virtual machine. In the [Azure portal](https://portal.azure.com), navigate through **Browse** > **Virtual machines** > Your Windows virtual machine > **Connect**.

2. Open a Command Prompt window as an administrator.

3. Change the directory to `%windir%\system32\sysprep`, and then run sysprep.exe.

4. In the **System Preparation Tool** dialog box, do the following:

	- In **System Cleanup Action**, select **Enter System Out-of-Box Experience (OOBE)** and make sure that **Generalize** is checked. For more information about using Sysprep, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/library/bb457073.aspx).

	- In **Shutdown Options**, select **Shutdown**.

	- Click **OK**.

	![Run Sysprep](./media/virtual-machines-windows-capture-image/SysprepGeneral.png)

   Sysprep shuts down the virtual machine. Its status changes to **Stopped** in the Azure portal.


## Log in to Azure PowerShell
1. Open Azure PowerShell and sign in to your Azure account.

```powershell
	Login-AzureRmAccount
```

	A pop-up window opens for you to enter your Azure account credentials.

2. Get the subscription IDs for your available subscriptions.

```powershell
		Get-AzureRmSubscription
```

3. Set the correct subscription using the subscription ID.		

```powershell
	Select-AzureRmSubscription -SubscriptionId "<subscriptionID>"
```

## Deallocate the VM and set the state to generalized		

1. Deallocate the VM resources.

```powershell
	Stop-AzureRmVM -ResourceGroupName <resourceGroup> -Name <vmName>
```

	The *Status* for the VM in the Azure portal changes from **Stopped** to **Stopped (deallocated)**.

2. Set the status of the virtual machine to **Generalized**. 

```powershell
	Set-AzureRmVm -ResourceGroupName <resourceGroup> -Name <vmName> -Generalized
```

3. Check the status of the VM. The **OSState/generalized** section for the VM should have the **DisplayStatus** set to **VM generalized**.  

```powershell
		$vm = Get-AzureRmVM -ResourceGroupName <resourceGroup> -Name <vmName> -status
		$vm.Statuses
```

## Create the image 

1. Copy the virtual machine image to the destination storage container using this command. The image is created in the same storage account as the original virtual machine. The `-Path` variable saves a copy of the JSON template locally. The `-DestinationContainerName` variable is the name of the container that you want to hold your images. If the container doesn't exist, it is created for you.

```powershell
	Save-AzureRmVMImage -ResourceGroupName <resourceGroupName> -Name <vmName> -DestinationContainerName <destinationContainerName> -VHDNamePrefix <prefixTemplateName> -Path <pathtothelocalfile\Filename.json>
```

	You can get the URL of your image from the JSON file template. Go to the **resources** > **storageProfile** > **osDisk** > **image** > **uri** section for the complete path of your image. The URL of the image looks like: `https://<storageAccountName>.blob.core.windows.net/system/Microsoft.Compute/Images/<imagesContainer>/<templatePrefix-osDisk>.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.vhd`.
	
	You can also verify the URI in the portal. The image is copied to a blob named **system** in your storage account. 

2. Create a variable for the path to the image. 

```powershell
		$imageURI = "<https://<storageAccountName>.blob.core.windows.net/system/Microsoft.Compute/Images/<imagesContainer>/<templatePrefix-osDisk>.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.vhd>"
```



