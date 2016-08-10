<properties
   pageTitle="Custom Script extension on a Windows VM | Microsoft Azure"
   description="Automate Azure VM configuration tasks by using the Custom Script extension to run PowerShell scripts on a remote Windows VM"
   services="virtual-machines-windows"
   documentationCenter=""
   authors="kundanap"
   manager="timlt"
   editor=""
   tags="azure-service-management"/>

<tags
   ms.service="virtual-machines-windows"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="infrastructure-services"
   ms.date="08/06/2015"
   ms.author="kundanap"/>

# Custom Script extension for Windows virtual machines

This article gives an overview of how to use the Custom Script extension on Windows VMs by using Azure PowerShell cmdlets with Azure Service Management APIs.

Virtual machine (VM) extensions are built by Microsoft and trusted third-party publishers to extend the functionality of the VM. For an overview of VM extensions, see
[Azure VM extensions and features](virtual-machines-windows-extensions-features.md).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)] Learn how to [perform these steps using the Resource Manager model](virtual-machines-windows-extensions-customscript.md).

## Custom Script extension overview

With the Custom Script extension for Windows, you can run PowerShell scripts on a remote VM without logging into it. You can run the scripts after provisioning the VM, or at any time during the lifecycle of the VM without opening any additional ports. The most common use cases for running Custom Script extension include running, installing, and configuring additional software on the VM after it's provisioned.

### Prerequisites for running Custom Script extension

1. Install <a href="http://azure.microsoft.com/downloads" target="_blank">Azure PowerShell cmdlets</a> version 0.8.0 or later.
2. If you want the scripts to run on an existing VM, make sure VM Agent is enabled on the VM. If it is not installed, follow these   [steps](virtual-machines-windows-classic-agents-and-extensions.md). If the VM is created from the Azure portal, then VM Agent is installed by default.
3. Upload the scripts that you want to run on the VM to Microsoft Azure Storage. The scripts can come from a single container or multiple storage containers.
4. The script should be authored so that the entry script, which is started by the extension, starts other scripts.

## Custom Script extension scenarios

### Upload files to the default container

The following example shows how you can run your scripts on the VM if they are in the storage container of the default account of your subscription. You upload your scripts to ContainerName. You can verify the default storage account by using the **Get-AzureSubscription –Default** command.

The following example creates a new VM, but the you can also run the same scenario on an existing VM.

    # create a new VM in Azure.
    $vm = New-AzureVMConfig -Name $name -InstanceSize Small -ImageName $imagename
    $vm = Add-AzureProvisioningConfig -VM $vm -Windows -AdminUsername $username -Password $password
    // Add Custom Script Extension to the VM. The container name refers to the storage container that contains the file.
    $vm = Set-AzureVMCustomScriptExtension -VM $vm -ContainerName $container -FileName 'start.ps1'
    New-AzureVM -ServiceName $servicename -Location $location -VMs $vm
    #  After the VM is created, the extension downloads the script from the storage location and executes it on the VM.

    # Viewing the  script execution output.
    $vm = Get-AzureVM -ServiceName $servicename -Name $name
    # Use the position of the extension in the output as index.
    $vm.ResourceExtensionStatusList[i].ExtensionSettingStatus.SubStatusList

### Upload files to a non-default storage container

This scenario shows how to use a non-default storage container within the same subscription or in a different subscription for uploading scripts and files. This example shows an existing VM, but the same operations can be done while creating a new VM.

        Get-AzureVM -Name $name -ServiceName $servicename | Set-AzureVMCustomScriptExtension -StorageAccountName $storageaccount -StorageAccountKey $storagekey -ContainerName $container -FileName 'file1.ps1','file2.ps1' -Run 'file.ps1' | Update-AzureVM

### Upload scripts to multiple containers across different storage accounts

  If the script files are stored across multiple containers, you have to provide the full SAS URL for the files to run the scripts.

      Get-AzureVM -Name $name -ServiceName $servicename | Set-AzureVMCustomScriptExtension -StorageAccountName $storageaccount -StorageAccountKey $storagekey -ContainerName $container -FileUri $fileUrl1, $fileUrl2 -Run 'file.ps1' | Update-AzureVM


### Add the Custom Script extension from the Azure portal

Browse to the VM in the <a href="https://portal.azure.com/ " target="_blank">Azure portal </a> and add the extension by specifying the script file to run.

  ![][5]


### Uninstalling the Custom Script extension

The Custom Script extension can be uninstalled from the VM by using the following command.

      get-azureVM -ServiceName KPTRDemo -Name KPTRDemo | Set-AzureVMCustomScriptExtension -Uninstall | Update-AzureVM

### The Custom Script extension and templates

To learn about how to use the Custom Script extension with Azure Resource Manager templates, see [Using the Custom Script extension for Windows VMs with Azure Resource Manager templates](virtual-machines-windows-extensions-customscript.md).

<!--Image references-->
[5]: ./media/virtual-machines-windows-classic-extensions-customscript/addcse.png
