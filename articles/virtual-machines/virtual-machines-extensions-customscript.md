<properties
   pageTitle="Custom Script extension on Windows | Microsoft Azure"
   description="Automating Azure virtual machine configuration tasks using Custom script extension on Windows "
   services="virtual-machines"
   documentationCenter=""
   authors="kundanap"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/06/2015"
   ms.author="kundanap"/>

# Custom Script Extension for Windows

This article gives an overview of using Custom Script Extension on Windows using Azure PowerShell cmdlets.


Virtual machine (VM) extensions are built by Microsoft and trusted third-party publishers to extend the functionality of the VM. For an overview of VM extensions, see
<a href="https://msdn.microsoft.com/library/azure/dn606311.aspx" target="_blank">Azure VM extensions and features</a>.

## Custom Script Extension overview

Custom Script Extension for Windows allows you to run PowerShell scripts on a remote VM, without logging into it. The scripts can be run after provisioning the VM or any time during the lifecycle of the VM without requiring to open any additional ports on the VM. The most common use case for Custom Script Extension include running, installing, and configuring additional software on the VM after it's provisioned.

### Prerequistes for running Custom Script Extension

1. Install Azure PowerShell cmdlets version 0.8.0 or later from <a href="http://azure.microsoft.com/downloads" target="_blank">here</a>.
2. If the scripts are run on an existing VM, make sure VM Agent is enabled on the VM, if not follow this <a href="https://msdn.microsoft.com/library/azure/dn832621.aspx" target="_blank">article</a> to install one.
3. Upload the scripts that you want to run on the VM to Azure Storage. The scripts can come from a single container or multiple storage containers.
4. The script should be authored in such a way that the entry script, which is started by the extension, starts other scripts.

## Custom Script Extension scenarios

### Upload files to the default container

If you have your scripts in the storage container of the default account of your subscription, then the following example shows how you can run them on the VM. The ContainerName is where you upload the scripts to. The default storage account can be verified by using the **Get-AzureSubscription –Default** command.

The following example creates a new VM, but the same scenario can be run on an existing VM as well.

    # create a new VM in Azure.
    $vm = New-AzureVMConfig -Name $name -InstanceSize Small -ImageName $imagename
    $vm = Add-AzureProvisioningConfig -VM $vm -Windows -AdminUsername $username -Password $password
    // Add Custom Script Extension to the VM. The container name refer to the storage container which contains the file.
    $vm = Set-AzureVMCustomScriptExtension -VM $vm -ContainerName $container -FileName 'start.ps1'
    New-AzureVM -ServiceName $servicename -Location $location -VMs $vm
    #  After the VM is created, the extension downloads the script from the storage location and executes it on the VM.

    # Viewing the  script execution output.
    $vm = Get-AzureVM -ServiceName $servicename -Name $name
    # Use the position of the extension in the output as index.
    $vm.ResourceExtensionStatusList[i].ExtensionSettingStatus.SubStatusList

### Upload files to a non-default storage container

This scenario shows how to use a non-default storage either within the same subscription or in a different subscription for uploading scripts and files. Here we’ll use an existing VM but the same operations can be done while creating a new VM.

        Get-AzureVM -Name $name -ServiceName $servicename | Set-AzureVMCustomScriptExtension -StorageAccountName $storageaccount -StorageAccountKey $storagekey -ContainerName $container -FileName 'file1.ps1','file2.ps1' -Run 'file.ps1' | Update-AzureVM

### Upload scripts to multiple containers across different storage accounts

  If the script files are stored across multiple containers, to run the scripts, you have to provide the full SAS URL for the files.

      Get-AzureVM -Name $name -ServiceName $servicename | Set-AzureVMCustomScriptExtension -StorageAccountName $storageaccount -StorageAccountKey $storagekey -ContainerName $container -FileUri $fileUrl1, $fileUrl2 -Run 'file.ps1' | Update-AzureVM


### Add Custom Script Extension from the portal

Browse to the VM in the <a href="https://portal.azure.com/ " target="_blank">Azure preview portal </a> and add the extension by specifying the script file to run.

  ![][5]


### Uninstalling Custom Script Extension

Custom Script Extension can be uninstalled from the VM using the following command.

      get-azureVM -ServiceName KPTRDemo -Name KPTRDemo | Set-AzureVMCustomScriptExtension -Uninstall | Update-AzureVM

### Using Custom Script Extension with Templates

To learn about using Custom Script Extension with Templates, see the documentation [here](virtual-machines-extensions-customscript -with template.md).

<!--Image references-->
[5]: ./media/virtual-machines-extensions-customscript/addcse.png
