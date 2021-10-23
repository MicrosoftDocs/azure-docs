---
title: Creating VM application packages (preview)
description: Learn how create install, update, and remove commands for VM application packages.
ms.service: virtual-machines
ms.subservice: shared-image-gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 10/13/2021
ms.reviewer:
ms.custom: 

---

# Things to consider when creating VM application packages

This article provides details on things to consider when creating VM applications.

> [!IMPORTANT]
> **VM applications in Azure Compute Gallery** are currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
  

## Download directory and working directory  
 
The download location of the application package and the configuration files are:
  
- Linux: `/var/lib/waagent/Microsoft.CPlat.Core.VMApplicationManagerLinux/<appname>/<app version> `
- Windows: `C:\Packages\Plugins\Microsoft.CPlat.Core.VMApplicationManagerWindows\1.0.3\Downloads\<appname>\<app version> `

 
The install/update/remove commands should be written assuming the application package and the configuration file are in the current directory.


## Command interpreter  

The default command interpreters are:
- Linux: `/bin/sh` 
- Windows: `cmd.exe`

It's possible to use a different interpreter, as long as it is installed on the machine, by calling the executable and passing the command to it. For example, to have your command run in PowerShell on Windows instead of cmd, you can pass `powershell.exe -Command '<powershell commmand>'`
  
## Naming the package and the config file

**** Needs a better explanation****

The application package uses `appname` for the name and the configuration file name as `appname_config`. The install, update, and remove commands must be written with this in mind. In an upcoming update, we will add an option to the VMApp publisher to specify how to name the downloaded application package and application configuration file 
 
Windows example, if my gallery application name was 'firefoxwindows ', my install command should be 

move .\\firefoxwindows .\\firefox.exe & firefox.exe /S 

Windows `cmd` expects executable files to have extension `.exe`, so the application package file was renamed before it was invoked. The command like parameter `/S` signals the installer to run in silent mode.

Linux example, if my gallery application name was 'powershell', my install command should be 

tar -xf powershell && dpkg -i ./liblttng-ust-ctl4_2.10.1-1_amd64.deb ./liburcu6_0.10.1-1ubuntu1_amd64.deb ./liblttng-ust0_2.10.1-1_amd64.deb ./powershell_7.1.2-1.ubuntu.18.04_amd64.deb  
 
Note: the application package in this example is a compressed archive. 'tar -xf' is used to extract it to the current directory. The next part of the command invokes Debian package manager to perform install on the files that we know will be extracted in the previous operation 

  

## How updates are handled

When you update a application version, the update command you provided during deployment will be used. If the updated version doesn’t have an update command, then the current version will be removed and the new version will be installed. 

Update commands should be written knowing that it could be updating from any older version of the VM application.


## Tips for creating VM Applications on Linux 

## .tar and .gz files 

These are compressed archives and can simply be extracted to a desired location. Check the installation instructions for the original package to in case they need to be extracted to a specific location. If .tar.gz file contains source code, refer to the instructions for the package for how to install from source. 

Example to install command to install `golang` on a Linux machine:

```bash
tar -C /usr/local -xzf go_linux
```

Example remove command:

```bash
rm -rf /usr/local/go
```

### .deb, .rpm, and other platform specific packages 
You can download individual packages for platform specific package managers, but they usually do not contain all the dependencies. For these files, you must also include all dependencies in the application package, or have the system package manager download the dependencies through the repositories that are available to the VM. If you are working with a VM with restricted internet access, you must package all the dependencies yourself.


Figuring out the dependencies can be a bit tricky. There are third party tools that can show you the entire dependency tree. 

On Ubuntu, you can run `apt-get install <name> --simulate` to show all the packages that will be installed for the `apt-get install <name>` command. Then you can use that output to download all .deb files to create an archive that can be used as the application package. The downside to this method is that is doesn't show the dependencies that are already installed on the VM.
 
Example, to create a VM application package to install PowerShell for Ubuntu, run the command `apt-get install powershell --simulate` on a new Ubuntu VM. Check the output of the line **The following NEW packages will be installed** which lists the following packages:
- `liblttng-ust-ctl4` 
- `liblttng-ust0` 
- `liburcu6` 
- `powershell`. 

Download these files using `apt-get download` and create a tar archive with all files at the root level. This tar archive will be the application package file. The install command in this case is:

```bash
tar -xf powershell && dpkg -i ./liblttng-ust-ctl4_2.10.1-1_amd64.deb ./liburcu6_0.10.1-1ubuntu1_amd64.deb ./liblttng-ust0_2.10.1-1_amd64.deb ./powershell_7.1.2-1.ubuntu.18.04_amd64.deb
```

And the remove command is:

```bash
dpkg -r powershell && apt autoremove
```

Use `apt autoremove` instead of explicitly trying to remove all the dependencies. You may have installed other applications with overlapping dependencies, and in that case, an explicit remove command would fail.


In case you don't want to resolve the dependencies yourself and apt/rpm is able to connect to the repositories, you can install an application with just one .deb/.rpm file and let apt/rpm handle the dependencies.

Example install command:

```bash
dpkg -i <appname> || apt --fix-broken install -y
```
 
## Tips for creating VM Applications on Windows 

Most 3rd party applications in Windows are available as .exe or .msi installers. Some are also available as extract and run zip files. Let us look at the best practices for each of them.


### .exe installer 

Installer executables typically launch a user interface (UI) and require someone to click through the UI. If the installer supports a silent mode parameter, it should be included in your installation string. 

Cmd.exe also expects executable files to have the extension .exe, so you need to rename the file to have te .exe extension.  

If I wanted to create a Vm application package for **Firefox**, which ships as an executable, my VM Application is called 'firefoxwindows', so I author the command assuming that the application package is in the current directory:

```
"move .\\firefoxwindows .\\firefox.exe & firefox.exe /S -config firefox_config" 
```
 
This installer executable file doesn't support an uninstall command, so to figure out an appropriate uninstall command, I look up the registry on a test machine to know here the uninstaller is located. 

In the registry, the uninstall string is stored in `Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\<installed application name>\UninstallString` so I would use the contents as my remove command:

```
'\"C:\\Program Files\\Mozilla Firefox\\uninstall\\helper.exe\" /S'
```

### .msi installer 

For command line execution of `.msi` installers, the commands to install or remove an application should use `msiexec`. Typically, `msiexec` runs as its own separate process and `cmd` doesn't wait for it to complete, which can lead to problems when installing more than one VM application.  The `start` command can be used with `msiexec` to ensure that the installation completes before the command returns. For example:

```
start /wait %windir%\\system32\\msiexec.exe /i myapp /quiet /forcerestart /log myapp_install.log
```

Example remove command:

```
start /wait %windir%\\system32\\msiexec.exe /x $appname /quiet /forcerestart /log ${appname}_uninstall.log
```

### Zipped files 

For .zip or other zipped files, just unzip the contents of the application package to the desired destination. 

Example install command:

```
mkdir C:\\myapp && powershell.exe -Command \"Expand-Archive -Path myapp -DestinationPath C:\\myapp\" 
```

Example remove command:

```
rmdir /S /Q C:\\myapp
```


## Troubleshooting 

The VM application extension always returns a success regardless of whether any VM app failed while being installed/updated/removed. The VM Application extension will only report the extension status as failure when there is a problem with the extension or the underlying infrastructure. To know whether a particular VM application was successfully added to the VM instance, please check the message of the VMApplication extension. 

To learn more about getting the status of VM extensions, see [Virtual machine extensions and features for Windows](extensions/features-windows.md#view-extension-status).

To get status of VM extensions, use [Get-AzVM](/powershell/module/az.compute/get-azvm):

```azurepowershell-interactive
Get-AzVM -name <VMSS name> -ResourceGroupName <resource group name> -InstanceView | convertto-json  
```

To get status of VMSS extensions, use [Get-AzVMSS](/powershell/module/az.compute/get-azvmss):

```azurepowershell-interactive
Get-AzVmss -name <VMSS name> -ResourceGroupName <resource group name> -InstanceView | convertto-json  
```
 
## Next steps

Learn how to [create VM application packages](vm-applications-how-to.md).