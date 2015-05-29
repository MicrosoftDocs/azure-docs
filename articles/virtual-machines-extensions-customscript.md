<properties
   pageTitle="Custom Script extension on Windows"
   description="Automating Azure Virtual Machine configuration tasks using Custom script extension on Windows "
   services="virtual-machines"
   documentationCenter=""
   authors="kundanap"
   manager="madhana"
   editor=""/>

<tags
   ms.service="virtual-machines"
   ms.devlang=""
   ms.topic="article"
   ms.tgt_pltfrm=""
   ms.workload="infrastructure-services"
   ms.date="02/19/2015"
   ms.author="kundanap"/>

# Custom Script Extension for Windows

This article gives an overview of using Custom Script extension on Windows using Azure Powershell cmdlets.


Virtual Machine(VM) extensions built by Microsoft and trusted third party publishers to extend the functionality of the VM. For a detailed overview of VM Extensions, please refer to the
<a href="https://msdn.microsoft.com/library/azure/dn606311.aspx" target="_blank">MSDN Documentation</a>.

## Custom Script Extension Overview

Custom Script Extension for Windows allows you to execute Powershell scripts on a remote Virtual Machine, without logging into it. The scripts can be executed after provisioning the VM or anytime during the lifecycle of the VM without requiring to open any additional ports on the VM. The most common use case for Custom Script include running installing and configuring additional software on the VM post provisioning.

### Pre-Requistes for running Custom Script Extension

1. Install Azure PowerShell Cmdlets V0.8.0 or above from <a href="http://azure.microsoft.com/downloads" target="_blank">here</a>.
2. If the scripts will be run on an existing VM, make sure VM Agent is enabled on the VM, if not follow this <a href="https://msdn.microsoft.com/library/azure/dn832621.aspx" target="_blank">article</a> to install one.
3. Upload the scripts that you want to run on the VM to Azure Storage. The scripts can come from a single or multiple storage containers.
4. The script should be authored in such a way that the entry script which is launched by the extension in turn launches other scripts.

## Custom Script Extension Scenarios:

 ### Upload files to the default container:
If you have your scripts in the storage container of the default account of your subscription, then the cmdlet snippet below shows how you can run them on the VM. The ContainerName in the sample below is where you upload the scripts to. The default storage account can be verified by using the cmdlet ‘Get-AzureSubscription –Default’

Note: This use case creates a new VM but the same operations can be done on an existing VM as well.

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

### Upload files to a non default storage containers.

This use case shows how to use a non-default storage either within the same subscription or in a different subscription for uploading scripts/files. Here we’ll use an existing VM but the same operations can be done while creating a new VM.

        Get-AzureVM -Name $name -ServiceName $servicename | Set-AzureVMCustomScriptExtension -StorageAccountName $storageaccount -StorageAccountKey $storagekey -ContainerName $container -FileName 'file1.ps1','file2.ps1' -Run 'file.ps1' | Update-AzureVM
  ### Upload scripts to multiple containers across different storage accounts.
  If the script files are stored across multiple containers, then currently to run those scripts, you have to provide the full SAS URL of these files.

      Get-AzureVM -Name $name -ServiceName $servicename | Set-AzureVMCustomScriptExtension -StorageAccountName $storageaccount -StorageAccountKey $storagekey -ContainerName $container -FileUri $fileUrl1, $fileUrl2 -Run 'file.ps1' | Update-AzureVM


### Add Custom Script Extension from the Portal.
Browse to the Virtual Machine in the <a href="https://portal.azure.com/ " target="_blank">Azure Preview Portal </a> and add the Extension by specifying the script file to run.
  ![][5]

  ### UnInstalling Custom Script Extension.

Custom Script Extension can be uninstalled from the VM using the cmdlet below

      get-azureVM -ServiceName KPTRDemo -Name KPTRDemo | Set-AzureVMCustomScriptExtension -Uninstall | Update-AzureVM

### Coming Soon

We'll be soon adding Custom Script For Linux usage and samples, stay tuned.

<!--Image references-->
[5]: ./media/virtual-machines-extensions-customscript/addcse.png
