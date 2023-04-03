---
title: Overview of VM Applications in the Azure Compute Gallery
description: Learn more about VM application packages in an Azure Compute Gallery.
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: conceptual
ms.workload: infrastructure
ms.date: 03/28/2023
author: ericd-mst-github
ms.author: nikhilpatel
ms.reviewer: erd
ms.custom: 

---

# VM Applications overview

VM Applications are a resource type in Azure Compute Gallery (formerly known as Shared Image Gallery) that simplifies management, sharing, and global distribution of applications for your virtual machines.



While you can create an image of a VM with apps pre-installed, you would need to update your image each time you have application changes. Separating your application installation from your VM images means there’s no need to publish a new image for every line of code change.

Application packages provide benefits over other deployment and packaging methods:

- VM Applications have support for [Azure Policies](../governance/policy/overview.md)

- Grouping and versioning of your packages

- VM applications can be globally replicated to be closer to your infrastructure, so you don’t need to use AzCopy or other storage copy mechanisms to copy the bits across Azure regions.

- Sharing with other users through Azure Role Based Access Control (RBAC)

- Support for virtual machines, and both flexible and uniform scale sets


- If you have Network Security Group (NSG) rules applied on your VM or scale set, downloading the packages from an internet repository might not be possible. And  with storage accounts, downloading packages onto locked-down VMs would require setting up private links.




## What are VM app packages?

The VM application packages use multiple resource types:

| Resource | Description|
|----------|------------|
| **Azure compute gallery** | A gallery is a repository for managing and sharing application packages. Users can share the gallery resource and all the child resources will be shared automatically. The gallery name must be unique per subscription. For example, you may have one gallery to store all your OS images and another gallery to store all your VM applications.|
| **VM application** | The definition of your VM application. It's a *logical* resource that stores the common metadata for all the versions under it. For example, you may have an application definition for Apache Tomcat and have multiple versions within it. |
| **VM Application version** | The deployable resource. You can globally replicate your VM application versions to target regions closer to your VM infrastructure. The VM Application Version must be replicated to a region before it may be deployed on a VM in that region. |


## Limitations

- **No more than 3 replicas per region**: When creating a VM Application version, the maximum number of replicas per region is three.

- **Public access on storage**: Only public level access to storage accounts work, as other restriction levels fail deployments.

- **Retrying failed installations**: Currently, the only way to retry a failed installation is to remove the application from the profile, then add it back.

- **Only 25 applications per VM**: No more than 25 applications may be deployed to a VM at any point.

- **2GB application size**: The maximum file size of an application version is 2 GB. 

- **No guarantees on reboots in your script**: If your script requires a reboot, the recommendation is to place that application last during deployment. While the code attempts to handle reboots, it may fail.

- **Requires a VM Agent**: The VM agent must exist on the VM and be able to receive goal states.

- **Multiple versions of same application on the same VM**: You can't have multiple versions of the same application on a VM.
- **Move operations currently not supported**: Moving VMs with VM Apps to other resource groups are not supported at this time.

> [!NOTE]
>  For Azure Compute Gallery and VM Applications, Storage SAS can be deleted after replication.

## Cost

There's no extra charge for using VM Application Packages, but you'll be charged for the following resources:

- Storage costs of storing each package and any replicas. 
- Network egress charges for replication of the first image version from the source region to the replicated regions. Subsequent replicas are handled within the region, so there are no extra charges. 

For more information on network egress, see [Bandwidth pricing](https://azure.microsoft.com/pricing/details/bandwidth/).


## VM applications

The VM application resource defines the following about your VM application:

- Azure Compute Gallery where the VM application is stored
- Name of the application
- Supported OS type like Linux or Windows
- A description of the VM application

## VM application versions

VM application versions are the deployable resource. Versions are defined with the following properties:
- Version number
- Link to the application package file in a storage account
- Install string for installing the application
- Remove string to show how to properly remove the app
- Package file name to use when it's downloaded to the VM
- Configuration file name to be used to configure the app on the VM
- A link to the configuration file for the VM application, which you can include license files
- Update string for how to update the VM application to a newer version
- End-of-life date. End-of-life dates are informational; you'll still be able to deploy VM application versions past the end-of-life date.
- Exclude from latest. You can keep a version from being used as the latest version of the application. 
- Target regions for replication
- Replica count per region

## Download directory 
 
The download location of the application package and the configuration files are:
  
- Linux: `/var/lib/waagent/Microsoft.CPlat.Core.VMApplicationManagerLinux/<appname>/<app version> `
- Windows: `C:\Packages\Plugins\Microsoft.CPlat.Core.VMApplicationManagerWindows\1.0.9\Downloads\<appname>\<app version> `


The install/update/remove commands should be written assuming the application package and the configuration file are in the current directory.

## File naming

When the application file gets downloaded to the VM, the file name is the same as the name you use when you create the VM application. For example, if I name my VM application `myApp`, the file that will be downloaded to the VM will also be named `myApp`, regardless of what the file name is used in the storage account. If your VM application also has a configuration file, that file is the name of the application with `_config` appended. If `myApp` has a configuration file, it will be named `myApp_config`.

For example, if I name my VM application `myApp` when I create it in the Gallery, but it's stored as `myApplication.exe` in the storage account, when it gets downloaded to the VM the file name will be `myApp`. My install string should start by renaming the file to be whatever it needs to be to run on the VM (like myApp.exe).

The install, update, and remove commands must be written with file naming in mind. The `configFileName` is assigned to the config file for the VM and `packageFileName` is the name assigned downloaded package on the VM. For more information regarding these additional VM settings, refer to [UserArtifactSettings](/rest/api/compute/gallery-application-versions/create-or-update?tabs=HTTP#userartifactsettings) in our API docs.
 
## Command interpreter  

The default command interpreters are:
- Linux: `/bin/sh` 
- Windows: `cmd.exe`

It's possible to use a different interpreter like Chocolatey or PowerShell, as long as it's installed on the machine, by calling the executable and passing the command to it. For example, to have your command run in PowerShell on Windows instead of cmd, you can pass `powershell.exe -Command '<powershell commmand>'`
  

## How updates are handled

When you update an application version on a VM or VMSS, the update command you provided during deployment will be used. If the updated version doesn’t have an update command, then the current version will be removed and the new version will be installed. 

Update commands should be written with the expectation that it could be updating from any older version of the VM application.


## Tips for creating VM Applications on Linux 

Third party applications for Linux can be packaged in a few ways. Let's explore how to handle creating the install commands for some of the most common.

### .tar and .gz files 

These are compressed archives and can be extracted to a desired location. Check the installation instructions for the original package to in case they need to be extracted to a specific location. If .tar.gz file contains source code, refer to the instructions for the package for how to install from source. 

Example to install command to install `golang` on a Linux machine:

```bash
tar -C /usr/local -xzf go_linux
```

Example remove command:

```bash
rm -rf /usr/local/go
```

### .deb, .rpm, and other platform specific packages 
You can download individual packages for platform specific package managers, but they usually don't contain all the dependencies. For these files, you must also include all dependencies in the application package, or have the system package manager download the dependencies through the repositories that are available to the VM. If you're working with a VM with restricted internet access, you must package all the dependencies yourself.


Figuring out the dependencies can be a bit tricky. There are third party tools that can show you the entire dependency tree. 

On Ubuntu, you can run `apt-get install <name> --simulate` to show all the packages that will be installed for the `apt-get install <name>` command. Then you can use that output to download all .deb files to create an archive that can be used as the application package. The downside to this method is that it doesn't show the dependencies that are already installed on the VM.
 
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

Most third party applications in Windows are available as .exe or .msi installers. Some are also available as extract and run zip files. Let us look at the best practices for each of them.


### .exe installer 

Installer executables typically launch a user interface (UI) and require someone to select through the UI. If the installer supports a silent mode parameter, it should be included in your installation string. 

Cmd.exe also expects executable files to have the extension .exe, so you need to rename the file to have the .exe extension.  

If I wanted to create a VM application package for myApp.exe, which ships as an executable, my VM Application is called 'myApp', so I write the command assuming that the application package is in the current directory:

```
"move .\\myApp .\\myApp.exe & myApp.exe /S -config myApp_config" 
```
 
If the installer executable file doesn't support an uninstall parameter, you can sometimes look up the registry on a test machine to know here the uninstaller is located. 

In the registry, the uninstall string is stored in `Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\<installed application name>\UninstallString` so I would use the contents as my remove command:

```
'\"C:\\Program Files\\myApp\\uninstall\\helper.exe\" /S'
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

For .zip or other zipped files, rename and unzip the contents of the application package to the desired destination. 

Example install command:

```
rename myapp myapp.zip && mkdir C:\myapp && powershell.exe -Command "Expand-Archive -path myapp.zip -destinationpath C:\myapp"
```

Example remove command:

```
rmdir /S /Q C:\\myapp
```
## Treat failure as deployment failure

The VM application extension always returns a *success* regardless of whether any VM app failed while being installed/updated/removed. The VM Application extension will only report the extension status as failure when there's a problem with the extension or the underlying infrastructure. This is triggered by the "treat failure as deployment failure" flag which is set to `$false` by default and can be changed to `$true`. The failure flag can be configured in [PowerShell](/powershell/module/az.compute/add-azvmgalleryapplication#parameters) or [CLI](/cli/azure/vm/application#az-vm-application-set).

## Troubleshooting VM Applications

To know whether a particular VM application was successfully added to the VM instance, check the message of the VM Application extension.

To learn more about getting the status of VM extensions, see [Virtual machine extensions and features for Linux](extensions/features-linux.md#view-extension-status) and [Virtual machine extensions and features for Windows](extensions/features-windows.md#view-extension-status).

To get status of VM extensions, use [Get-AzVM](/powershell/module/az.compute/get-azvm):

```azurepowershell-interactive
Get-AzVM -name <VM name> -ResourceGroupName <resource group name> -Status | convertto-json -Depth 10    
```

To get status of scale set extensions, use [Get-AzVMSS](/powershell/module/az.compute/get-azvmss):

```azurepowershell-interactive
$result = Get-AzVmssVM -ResourceGroupName $rgName -VMScaleSetName $vmssName -InstanceView
$resultSummary  = New-Object System.Collections.ArrayList
$result | ForEach-Object {
    $res = @{ instanceId = $_.InstanceId; vmappStatus = $_.InstanceView.Extensions | Where-Object {$_.Name -eq "VMAppExtension"}}
    $resultSummary.Add($res) | Out-Null
}
$resultSummary | convertto-json -depth 5  
```

## Error messages

| Message | Description |
|--|--|
| Current VM Application Version {name} was deprecated at {date}. | You tried to deploy a VM Application version that has already been deprecated. Try using `latest` instead of specifying a specific version. |
| Current VM Application Version {name} supports OS {OS}, while current OSDisk's OS is {OS}. | You tried to deploy a Linux application to Windows instance or vice versa. |
| The maximum number of VM applications (max=5, current={count}) has been exceeded. Use fewer applications and retry the request. | We currently only support five VM applications per VM or scale set. |
| More than one VM Application was specified with the same packageReferenceId. | The same application was specified more than once. |
| Subscription not authorized to access this image. | The subscription doesn't have access to this application version. |
| Storage account in the arguments doesn't exist. | There are no applications for this subscription. |
| The platform image {image} isn't available. Verify that all fields in the storage profile are correct. For more details about storage profile information, please refer to https://aka.ms/storageprofile. | The application doesn't exist. |
| The gallery image {image} is not available in {region} region. Please contact image owner to replicate to this region, or change your requested region. | The gallery application version exists, but it was not replicated to this region. |
| The SAS is not valid for source uri {uri}. | A `Forbidden` error was received from storage when attempting to retrieve information about the url (either mediaLink or defaultConfigurationLink). |
| The blob referenced by source uri {uri} doesn't exist. | The blob provided for the mediaLink or defaultConfigurationLink properties doesn't exist. |
| The gallery application version url {url} cannot be accessed due to the following error: remote name not found. Ensure that the blob exists and that it's either publicly accessible or is a SAS url with read privileges. | The most likely case is that a SAS uri with read privileges was not provided. |
| The gallery application version url {url} cannot be accessed due to the following error: {error description}. Ensure that the blob exists and that it's either publicly accessible or is a SAS url with read privileges. | There was an issue with the storage blob provided. The error description will provide more information. |
| Operation {operationName} is not allowed on {application} since it is marked for deletion. You can only retry the Delete operation (or wait for an ongoing one to complete). | Attempt to update an application that’s currently being deleted. |
| The value {value} of parameter 'galleryApplicationVersion.properties.publishingProfile.replicaCount' is out of range. The value must be between 1 and 3, inclusive. | Only between 1 and 3 replicas are allowed for VM Application versions. |
| Changing property 'galleryApplicationVersion.properties.publishingProfile.manageActions.install' is not allowed. (or update, delete) | It is not possible to change any of the manage actions on an existing VmApplication. A new VmApplication version must be created. |
| Changing property ' galleryApplicationVersion.properties.publishingProfile.settings.packageFileName ' is not allowed. (or configFileName) | It is not possible to change any of the settings, such as the package file name or config file name. A new VmApplication version must be created. |
| The blob referenced by source uri {uri} is too big: size = {size}. The maximum blob size allowed is '1 GB'. | The maximum size for a blob referred to by mediaLink or defaultConfigurationLink is currently 1 GB. |
| The blob referenced by source uri {uri} is empty. | An empty blob was referenced. |
| {type} blob type is not supported for {operation} operation. Only page blobs and block blobs are supported. | VmApplications only supports page blobs and block blobs. |
| The SAS is not valid for source uri {uri}. | The SAS uri supplied for mediaLink or defaultConfigurationLink is not a valid SAS uri. |
| Cannot specify {region} in target regions because the subscription is missing required feature {featureName}. Either register your subscription with the required feature or remove the region from the target region list. | To use VmApplications in certain restricted regions, one must have the feature flag registered for that subscription. |
| Gallery image version publishing profile regions {regions} must contain the location of image version {location}. | The list of regions for replication must contain the location where the application version is. |
| Duplicate regions are not allowed in target publishing regions. | The publishing regions may not have duplicates. |
| Gallery application version resources currently do not support encryption. | The encryption property for target regions is not supported for VM Applications |
| Entity name doesn't match the name in the request URL. | The gallery application version specified in the request url doesn't match the one specified in the request body. |
| The gallery application version name is invalid. The application version name should follow Major(int32).Minor(int32).Patch(int32) format, where int is between 0 and 2,147,483,647 (inclusive). e.g. 1.0.0, 2018.12.1 etc. | The gallery application version must follow the format specified. |



## Next steps

- Learn how to [create and deploy VM application packages](vm-applications-how-to.md).