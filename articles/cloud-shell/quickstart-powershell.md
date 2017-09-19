---
title: PowerShell in Azure Cloud Shell (Preview) Quickstart | Microsoft Docs
description: Quickstart for PowerShell in Cloud Shell
services: Azure
documentationcenter: ''
author: maertendmsft
manager: timlt
tags: azure-resource-manager
 
ms.assetid: 
ms.service: azure
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 09/25/2017
ms.author: damaerte
---

# PowerShell in Azure Cloud Shell quickstart

This document details how to use the PowerShell in Cloud Shell in the [Azure portal](https://aka.ms/PSCloudPreview).

> [!NOTE]
> A [Bash in Azure Cloud Shell](quickstart.md) Quickstart is also available.

## Start Cloud Shell

1. Click on **Cloud Shell** button from the top navigation bar of the Azure portal <br>

  ![](media/quickstart-powershell/shell-icon.png)

2. Select the PowerShell environment from the drop-down <br>

  ![](media/quickstart-powershell/environment-ps.png)

3. Select PowerShell

4. The `Azure drive` appears as follows

  ``` Powershell
  Requesting a Cloud Shell... Succeeded.
  Connecting terminal...

  Welcome to Azure Cloud Shell (Preview)

  Type "dir" to see your Azure resources.
  Type "help" to learn about Cloud Shell.

  VERBOSE: Authenticating to Azure ...
  VERBOSE: Building your Azure drive ...
  PS Azure:\>
  ```

## Run PowerShell commands

Run regular PowerShell commands in the Cloud Shell, such as:

```Powershell
PS Azure:\> Get-Date
Wednesday, May 24, 2017 11:05:09 AM

PS Azure:\> Get-AzureRmVM -Status

ResourceGroupName       Name       Location                VmSize   OsType     ProvisioningState  PowerState
-----------------       ----       --------                ------   ------     -----------------  ----------
MyResourceGroup2        Demo        westus         Standard_DS1_v2  Windows    Succeeded           running
MyResourceGroup         MyVM1       eastus            Standard_DS1  Windows    Succeeded           running
MyResourceGroup         MyVM2       eastus   Standard_DS2_v2_Promo  Windows    Succeeded           deallocated
```

## Navigate Azure resources

 1. List your subscriptions

    ``` Powershell
    PS Azure:\> dir
    ```

 2. `cd` to your preferred subscription

    ``` Powershell
    PS Azure:\> cd MySubscriptionName
    PS Azure:\MySubscriptionName>
    ```

3. View your all Azure resources under the current subscription
 
    Type `dir` under AllResources directory to view your Azure resources.
 
    ``` PowerShell
    
    PS Azure:\MySubscriptionName> dir

        Directory: azure:\MySubscriptionName

    Mode Name
    ---- ----
    +    AllResources
    +    ResourceGroups
    +    StorageAccounts
    +    VirtualMachines
    +    WebApps
    
    
    PS Azure:\MySubscriptionName> dir AllResources
     
     
    ```
  
  
 4. View your storage account information
    
    Let's take Azure File storage share as an example. 
    
    ``` PowerShell 
    
    PS Azure:\MySubscriptionName\StorageAccounts\MyStorageAccountName\Files> dir

        Directory: Azure:\MySubscriptionNameStorageAccounts\MyStorageAccountName\Files


    Name          ConnectionString
    ----          ----------------
    MyFileShare1  \\MyStorageAccountName.file.core.windows.net\MyFileShare1;AccountName=MyStorageAccountName AccountKey=<key>
    MyFileShare2  \\MyStorageAccountName.file.core.windows.net\MyFileShare2;AccountName=MyStorageAccountName AccountKey=<key>
    MyFileShare3  \\MyStorageAccountName.file.core.windows.net\MyFileShare3;AccountName=MyStorageAccountName AccountKey=<key>


    ```
    
    With the connection string, you can use the following command to mount the Azure File share.
            
    ``` PowerShell
    
    net use <DesiredDriveLetter>: \\<MyStorageAccountName>.file.core.windows.net\<MyFileShareName> <AccountKey> /user:Azure\<MyStorageAccountName>
    
    
    ```
    
    For details, see [Mount an Azure File share and access the share in Windows][azmount].

    You can also navigate the directories under the Azure File share as follows:
    
                
    ``` PowerShell
    
    PS Azure:\MySubscriptionName\StorageAccounts\MyStorageAccountName\Files> cd .\MyFileShare1\
    PS Azure:\MySubscriptionName\StorageAccounts\MyStorageAccountName\Files\MyFileShare1> dir

    Mode  Name
    ----  ----
    +     TestFolder
    .     hello.ps1
    
        
    ```
    
 5. View your WebApps
 
    ``` PowerShell
    
    PS Azure:\MySubscriptionName> dir .\WebApps\

        Directory: Azure:\MySubscriptionName\WebApps


    Name            State    ResourceGroup      EnabledHostNames                  Location
    ----            -----    -------------      ----------------                  --------
    mywebapp1       Stopped  MyResourceGroup1   {mywebapp1.azurewebsites.net...   West US
    mywebapp2       Running  MyResourceGroup2   {mywebapp2.azurewebsites.net...   West Europe
    mywebapp3       Running  MyResourceGroup3   {mywebapp3.azurewebsites.net...   South Central US

    
 
    # You can use Azure cmdlets to Start/Stop your web apps for example,
    PS Azure:\MySubscriptionName\WebApps> Start-AzureRmWebApp -Name mywebapp1 -ResourceGroupName MyResourceGroup1

    Name           State    ResourceGroup        EnabledHostNames                   Location
    ----           -----    -------------        ----------------                   --------
    mywebapp1      Running  MyResourceGroup1     {mywebapp1.azurewebsites.net ...   West US

    # Refresh the current state with -force
    PS Azure:\MySubscriptionName\WebApps> dir -force

        Directory: Azure:\MySubscriptionName\WebApps


    Name            State    ResourceGroup      EnabledHostNames                  Location
    ----            -----    -------------      ----------------                  --------
    mywebapp1       Running  MyResourceGroup1   {mywebapp1.azurewebsites.net...   West US
    mywebapp2       Running  MyResourceGroup2   {mywebapp2.azurewebsites.net...   West Europe
    mywebapp3       Running  MyResourceGroup3   {mywebapp3.azurewebsites.net...   South Central US
    
    ```
    
 6. View your VirtualMachines

    You can find all your virtual machines under the current subscription via `VirtualMachines` directory.
    
    ``` PowerShell
    
    PS Azure:\MySubscriptionName\VirtualMachines> dir
    
        Directory: Azure:\MySubscriptionName\VirtualMachines


    Name       ResourceGroupName  Location  VmSize          OsType              NIC ProvisioningState  PowerState
    ----       -----------------  --------  ------          ------              --- -----------------  ----------
    TestVm1    MyResourceGroup1   westus    Standard_DS2_v2 Windows       my2008r213         Succeeded     stopped
    TestVm2    MyResourceGroup1   westus    Standard_DS1_v2 Windows          jpstest         Succeeded deallocated
    TestVm10   MyResourceGroup2   eastus    Standard_DS1_v2 Windows           mytest         Succeeded     running

    
    ```
    
    Or you can go to the `ResourceGroups` directory to find the virtual machines under the current resource group.
    
 
    ``` PowerShell
    
    PS Azure:\MySubscriptionName\ResourceGroups\MyResourceGroup1\Microsoft.Compute\virtualMachines> dir


        Directory: Azure:\MySubscriptionName\ResourceGroups\MyResourceGroup1\Microsoft.Compute\virtualMachines


    VMName    Location   ProvisioningState VMSize          OS            SKU             OSVersion AdminUserName  NetworkInterfaceName
    ------    --------   ----------------- ------          --            ---             --------- -------------  --------------------
    TestVm1   westus     Succeeded         Standard_DS2_v2 WindowsServer 2016-Datacenter Latest    AdminUser      demo371
    TestVm2   westus     Succeeded         Standard_DS1_v2 WindowsServer 2016-Datacenter Latest    AdminUser      demo271

    ```

> Note: You may notice that the second time when you type `dir`, the cloud shell is able to display the items much faster.

This is because the child items are cached in memory for a better user experience.
However, you can always use `dir -force` to get fresh data.

## Interact with VMs

### Invoke PowerShell script across remote VMs

  Assuming you have a VM, MyVM1, let's use `Invoke-AzureRmVMCommand` to invoke a PowerShell scriptblock on the remote machine.

  ``` Powershell
  Invoke-AzureRmVMCommand -Name MyVM1 -ResourceGroupName MyResourceGroup -Scriptblock {Get-ComputerInfo} -EnableRemoting
  ```
  You can also navigate to the virtualMachines directory first and run `Invoke-AzureRmVMCommand` as follows.

  ``` Powershell
  PS Azure:\> cd MySubscriptionName\MyResourceGroup\Microsoft.Compute\virtualMachines
  PS Azure:\MySubscriptionName\MyResourceGroup\Microsoft.Compute\virtualMachines> Get-Item MyVM1 | Invoke-AzureRmVMCommand -Scriptblock{Get-ComputerInfo}
  ```
  You see output similar to the following:

  ``` Powershell
  PSComputerName                                          : 65.52.28.207
  RunspaceId                                              : 2c2b60da-f9b9-4f42-a282-93316cb06fe1
  WindowsBuildLabEx                                       : 14393.1066.amd64fre.rs1_release_sec.170327-1835
  WindowsCurrentVersion                                   : 6.3
  WindowsEditionId                                        : ServerDatacenter
  WindowsInstallationType                                 : Server
  WindowsInstallDateFromRegistry                          : 5/18/2017 11:26:08 PM
  WindowsProductId                                        : 00376-40000-00000-AA947
  WindowsProductName                                      : Windows Server 2016 Datacenter
  WindowsRegisteredOrganization                           :
   ...
  ```
  > [!NOTE]
  > You may see the following error due to the default windows firewall settings for WinRM

  *Ensure the WinRM service is running. Remote Desktop into the VM for the first time and ensure it can be discovered.*

  > We recommend you try the following:
  - Make sure your VM is running. You can run `Get-AzureRmVM -Status` to find out the VM Status
  - Add a new firewall rule on the remote VM to allow WinRM connections from any subnet, for example,

    ``` Powershell
    New-NetFirewallRule -Name 'WINRM-HTTP-In-TCP-PSCloudShell' -Group 'Windows Remote Management' -Enabled True -Protocol TCP -LocalPort 5985 -Direction Inbound -Action Allow -DisplayName 'Windows Remote Management - PSCloud (HTTP-In)' -Profile Public
    ```
    > You can use [Azure custom script extension][customex] to avoid logon to your remote VM for adding the new firewall rule.
    You can save the above script to a file, say `addfirerule.ps1`, and upload it to your Azure storage container.
    Then try the following command:

     ``` Powershell
     Get-AzureRmVM -Name MyVM1 -ResourceGroupName MyResourceGroup | Set-AzureRmVMCustomScriptExtension -VMName MyVM1 -FileUri https://mystorageaccount.blob.core.windows.net/mycontainer/addfirerule.ps1 -Run 'addfirerule.ps1' -Name myextension
     ```

### Interactively log onto a remote VM

You can use `Enter-AzureRmVM` to interactively log into a VM running in Azure.

  ``` Powershell
  Enter-AzureRmVM -Name MyVM1 -ResourceGroupName MyResourceGroup -EnableRemoting
  ```

You can also navigate to the `virtualMachines` directory first and run `Enter-AzureRmVM` as follows

  ``` Powershell
 PS Azure:\MySubscriptionName\ResourceGroups\MyResourceGroup\Microsoft.Compute\virtualMachines> Get-Item MyVM1 | Enter-AzureRmVM
 ```

## List available commands

Under `Azure` drive, type `Get-AzureRmCommand` to get context specific Azure commands.

Alternatively, you can always use `Get-Command *azurerm* -Module AzureRM.*` to find out the available Azure commands.

## Install modules

You can run `Install-Module` to install modules from the [PowerShellGallery.com][gallery].

## Get-Help

Type `Get-Help` to get information about PowerShell in Azure Cloud Shell.

``` Powershell
PS Azure:\> Get-Help
```

For a specific command, you can still do Get-Help followed by a cmdlet, for example,

``` Powershell
PS Azure:\> Get-Help Get-AzureRmVM
```

## Use Azure File Storage to store your data

You can create a script, say `helloworld.ps1`, and save it to your clouddrive to use it across shell sessions.

``` Powershell
cd C:\users\ContainerAdministrator\CloudDrive
PS C:\users\ContainerAdministrator\CloudDrive> vim .\helloworld.ps1
# Add the content, such as 'Hello World!'
PS C:\users\ContainerAdministrator\CloudDrive> .\helloworld.ps1
Hello World!
```

Next time when you use PowerShell in Cloud Shell, the `helloworld.ps1` file should still exist under the `CloudDrive` folder mounts your Azure cloud files share.

## User custom profile

If you want to customize your environment, you can create a PowerShell profile, name it as `Microsoft.PowerShell_profile.ps1` or `profile.ps1` and save it under the CloudDrive so that it can be loaded to every PowerShell session when you launch the Cloud Shell.

For how to create a profile, refer to [About Profiles][profile].

## Use Git

To clone a repo in the CloudShell, you need to create a [personal access token][githubtoken] and use it as username. Once you have your  token clone the repository as follows:

 ``` PowerShell
  git clone https://<your-access-token>@github.com/username/repo.git

```

As the CloudShell session will be gone once you sign out or the session gets timed out, the git config file will not be persisted. To avoid entering your git identity every time you use git, you may add git config information in your custom profile. For example you may add the following to your profile.ps1. 

 ``` PowerShell
 
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com

```

## Exit the shell

Type `exit` to close the session.

[bashqs]:quickstart.md
[gallery]:https://www.powershellgallery.com/
[customex]:https://docs.microsoft.com/azure/virtual-machines/windows/extensions-customscript
[profile]: https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.core/about/about_profiles
[azmount]: https://docs.microsoft.com/azure/storage/files/storage-how-to-use-files-windows
[githubtoken]: https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/