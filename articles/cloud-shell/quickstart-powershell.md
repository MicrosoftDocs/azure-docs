# PowerShell in Azure Cloud Shell Quickstart

This document details how to use the PowerShell in Cloud Shell in the [Azure portal](https://aka.ms/PSCloudPreview).

> [!NOTE]
> A [Bash in Azure Cloud Shell](quickstart.md) guide is also available.

## Start cloud shell

1. Click on **Cloud Shell** button from the top navigation bar of the Azure portal <br>
![](media/quickstart-powershell/shell-icon.png)

2. Select the PowerShell environment from the drop-down on the left-hand side of shell window <br>

![](media/quickstart-powershell/environment-ps.png)

3. Select PowerShell

4. The PowerShell Cloud Shell appears at the bottom part of the portal
5. `Azure PowerShell drive` appears as follows

  ```powershell
  Requesting a Cloud Shell... Succeeded.
  Connecting terminal...

  Welcome to Azure Cloud Shell (Private Preview)

  Type "dir" in "Azure:" drive to see your subscriptions.
  Type "help" to learn more about the shell features.

  VERBOSE: Authenticating to Azure services ...
  VERBOSE: Building your Azure drive ...
  PS Azure:\>
  ```

## Run PowerShell commands

Run regular PowerShell commands in the PowerShell Cloud Shell, such as:

```powershell
PS Azure:\> Get-Date
Wednesday, May 24, 2017 11:05:09 AM

PS Azure:\> Get-AzureRmVM -Status

ResourceGroupName       Name       Location                VmSize   OsType     ProvisioningState  PowerState
-----------------       ----       --------                ------   ------     -----------------  ----------
MyResourceGroup2        Demo        westus         Standard_DS1_v2  Windows    Succeeded           running
MyResourceGroup         MyVM1       eastus            Standard_DS1  Windows    Succeeded           running
MyResourceGroup         MyVM2       eastus   Standard_DS2_v2_Promo  Windows    Succeeded           deallocated
```

## Navigate Azure Resources

 1. List your subscriptions

    ```powershell
    PS Azure:\> dir
    ```

 2. `cd` to your preferred subscription

    ``` powershell
    PS Azure:\> cd MySubscriptionName
    PS Azure:\MySubscriptionName>
    ```

 3. Use `cd` and `dir` to access other Azure resources.
 The following examples illustrate how to navigate to your virtual machines.

    ```powershell
    PS Azure:\MySubscriptionName\MyResourceGroup\Microsoft.Compute\virtualMachines> dir

    VMName     Location        ProvisioningState VMSize         OS            SKU             OSVersion AdminUserName NetworkInterfaceName
    ------     --------        ----------------- ------         --            ---             --------- ------------- --------------------
    MyVM1      northcentralus  Succeeded         Basic_A1       WindowsServer 2016-Datacenter latest    AdminUser     demo371
    MyVM2      northcentralus  Succeeded         Standard_A1_v2 WindowsServer 2016-Datacenter latest    AdminUser     demo231
    Demo       northcentralus  Succeeded         Standard_F1    WindowsServer 2016-Datacenter latest    AdminUser     demo219
    ```

> Note: You may notice that the second time when you type `dir`, PowerShell is able to display the items much faster.
This is because the child items are cached in memory for a better user experience.
However, you can always use `dir -force` to get fresh data.

## Interact with VMs

### Invoke PowerShell script across remote VMs

  Assuming you have a VM, MyVM1, let's use `Invoke-AzureRmVMCommand` to invoke a PowerShell scriptblock on the remote machine.

  ```powershell
  Invoke-AzureRmVMCommand -Name MyVM1 -ResourceGroupName MyResourceGroup -Scriptblock {Get-ComputerInfo} -EnableRemoting
  ```
  You can also navigate to the virtualMachines directory first and run `Invoke-AzureRmVMCommand` as follows.

  ```powershell
  PS Azure:\> cd MySubscriptionName\MyResourceGroup\Microsoft.Compute\virtualMachines
  PS Azure:\MySubscriptionName\MyResourceGroup\Microsoft.Compute\virtualMachines> Get-Item MyVM1 | Invoke-AzureRmVMCommand -Scriptblock{Get-ComputerInfo}
  ```
  You see output similar to the following:

  ```powershell
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
  > Note: You may see the following error due to the default windows firewall settings for WinRM

  *Ensure the WinRM service is running. Remote Desktop into the VM for the first time and ensure it can be discovered.*

  > We recommend you try the following:
  - Make sure your VM is running. You can run `Get-AzureRmVM -Status` to find out the VM Status
  - Add a new firewall rule on the remote VM to allow WinRM connections from any subnet, for example,

    ```powershell
    New-NetFirewallRule -Name 'WINRM-HTTP-In-TCP-PSCloudShell' -Group 'Windows Remote Management' -Enabled True -Protocol TCP -LocalPort 5985 -Direction Inbound -Action Allow -DisplayName 'Windows Remote Management - PSCloud (HTTP-In)' -Profile Public
    ```
    > You can use [Azure custom script extension][customex] to avoid logon to your remote VM for adding the new firewall rule.
    You can save the above script to a file, say `addfirerule.ps1`, and upload it to your Azure storage container.
    Then try the following command:

     ```powershell
     Get-AzureRmVM -Name MyVM1 -ResourceGroupName MyResourceGroup | Set-AzureRmVMCustomScriptExtension -VMName MyVM1 -FileUri https://mystorageaccount.blob.core.windows.net/mycontainer/addfirerule.ps1 -Run 'addfirerule.ps1' -Name myextension
     ```

### Interactively log onto a remote VM

You can use `Enter-AzureRmVM` to interactively log into a VM running in Azure.

  ```powershell
  Enter-AzureRmVM -Name MyVM1 -ResourceGroupName MyResourceGroup -EnableRemoting
  ```

You can also navigate to the `virtualMachines` directory first and run `Enter-AzureRmVM` as follows

  ```powershell
 PS Azure:\MySubscriptionName\MyResourceGroup\Microsoft.Compute\virtualMachines> Get-Item MyVM1 | Enter-AzureRmVM
 ```

## List available commands

Under `Azure` drive, type `Get-AzureRmCommand` to get context specific Azure commands.

Alternatively, you can always use `Get-Command *azurerm* -Module AzureRM.*` to find out the available Azure commands.

## Install modules

You can run `Install-Module` to install modules from the [PowerShellGallery.com][gallery].

## Get-Help

Type `Get-Help` to get information about PowerShell in Azure Cloud Shell.

```powershell
PS Azure:\> Get-Help
```

For a specific command, you can still do Get-Help followed by a cmdlet, for example,

```powershell
PS Azure:\> Get-Help Get-AzureRmVM
```

## Use Azure File Storage to store your data

You can create a script, say `helloworld.ps1`, and save it to your clouddrive to use it across shell sessions.

```powershell
cd C:\users\ContainerAdministrator\CloudDrive
PS C:\users\ContainerAdministrator\CloudDrive> vim .\helloworld.ps1
# Add the content, such as 'Hello World!'
PS C:\users\ContainerAdministrator\CloudDrive> .\helloworld.ps1
Hello World!
```

Next time when you use PowerShell in Cloud Shell, the `helloworld.ps1` file should still exist under the `CloudDrive` folder mounts your Azure cloud files share.

## User Custom Profile

If you want to customize your environment, you can create a PowerShell profile, name it as `Microsoft.PowerShell_profile.ps1` and save it under the clouddrive so that it can be loaded to every PowerShell session when you launch the Cloud Shell.

For how to create a profile, refer to [About Profiles][profile].

## Run az cli commands

To see examples of running `az cli` commands, follow the [Azure Cloud Shell quickstart][bashqs].

## Exit the shell

Type `exit` to close the session.

[bashqs]:https://docs.microsoft.com/azure/cloud-shell/quickstart
[gallery]:https://www.powershellgallery.com/
[customex]:https://docs.microsoft.com/azure/virtual-machines/windows/extensions-customscript
[profile]: https://msdn.microsoft.com/en-us/powershell/reference/5.1/microsoft.powershell.core/about/about_profiles