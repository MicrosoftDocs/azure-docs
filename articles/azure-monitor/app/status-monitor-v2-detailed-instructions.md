---
title: Azure Status Monitor v2 detailed instructions | Microsoft Docs
description: Detailed instructions for getting started with Status Monitor v2. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs or on Azure.
services: application-insights
documentationcenter: .net
author: MS-TimothyMothra
manager: alexklim
ms.assetid: 769a5ea4-a8c6-4c18-b46c-657e864e24de
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 04/23/2019
ms.author: tilee
---
# Status Monitor v2 detailed instructions

This document details how to onboard to the PowerShell Gallery and download the ApplicationMonitor Module. 
We've documented the most common parameters required to get started.
We've also included manual instructions in the event that internet access isn't available.

> [!IMPORTANT]
> Status Monitor v2 is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

## Instrumentation key

To get started, you must have an instrumentation key. For more information, read [Create an Application Insights resource](create-new-resource.md#copy-the-instrumentation-key).

## Run PowerShell as administrator with an elevated execution policy

**Run as Administrator**: 
- Description: PowerShell will need Administrator level permissions to make changes to your computer.

**The Execution Policy**:
- Description: By default, running PowerShell scripts will be disabled. We recommend allowing RemoteSigned scripts for the Current Scope only.
- Reference: [About Execution Policies](https://docs.microsoft.com/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-6) and [Set-ExecutionPolicy](
https://docs.microsoft.com/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-6
)
- Cmd: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process`
- Optional Parameters:
	- `-Force` This will skip the confirmation prompt.

**Example Errors:**

```
Install-Module : The 'Install-Module' command was found in the module 'PowerShellGet', but the module could not be
loaded. For more information, run 'Import-Module PowerShellGet'.
	
Import-Module : File C:\Program Files\WindowsPowerShell\Modules\PackageManagement\1.3.1\PackageManagement.psm1 cannot
be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at
https:/go.microsoft.com/fwlink/?LinkID=135170.
```


## Prerequisites for PowerShell

Audit your current version PowerShell by running the command: `$PSVersionTable`.
The command produces the following output:


```
Name                           Value
----                           -----
PSVersion                      5.1.17763.316
PSEdition                      Desktop
PSCompatibleVersions           {1.0, 2.0, 3.0, 4.0...}
BuildVersion                   10.0.17763.316
CLRVersion                     4.0.30319.42000
WSManStackVersion              3.0
PSRemotingProtocolVersion      2.3
SerializationVersion           1.1.0.1
```

These instructions were written and tested on a Windows 10 machine with the versions listed above.

## Prerequisites for PowerShell Gallery

These steps will prepare your server to download modules from the PowerShell Gallery.

> [!NOTE] 
> Support for PowerShell Gallery is included on Windows 10, Windows Server 2016, and PowerShell 6. 
> For older versions, review this document: [Installing PowerShellGet](https://docs.microsoft.com/powershell/gallery/installing-psget)


1. Run PowerShell as Administrator with an elevated execution policy.
2. NuGet package provider 
	- Description: This provider is required to interact with NuGet-based repositories such as PowerShellGallery
	- Reference: [Install-PackageProvider](https://docs.microsoft.com/powershell/module/packagemanagement/install-packageprovider?view=powershell-6)
	- Cmd: `Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201`
	- Optional Parameters:
		- `-Proxy` Specifies a proxy server for the request.
		- `-Force` This will skip the confirmation prompt. 
	
	You'll receive this prompt if NuGet isn't set up:
		
		NuGet provider is required to continue
		PowerShellGet requires NuGet provider version '2.8.5.201' or newer to interact with NuGet-based repositories. The NuGet
		 provider must be available in 'C:\Program Files\PackageManagement\ProviderAssemblies' or
		'C:\Users\t\AppData\Local\PackageManagement\ProviderAssemblies'. You can also install the NuGet provider by running
		'Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force'. Do you want PowerShellGet to install and import
		 the NuGet provider now?
		[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"):
	
3. Trusted repositories
	- Description: By default, PowerShellGallery is an untrusted repository.
	- Reference: [Set-PSRepository](https://docs.microsoft.com/powershell/module/powershellget/set-psrepository?view=powershell-6)
	- Cmd: `Set-PSRepository -Name "PSGallery" -InstallationPolicy Trusted`
	- Optional Parameters:
		- `-Proxy` Specifies a proxy server for the request.

	You'll receive this prompt if PowerShell Gallery isn't trusted:

		Untrusted repository
		You are installing the modules from an untrusted repository. If you trust this repository, change its
		InstallationPolicy value by running the Set-PSRepository cmdlet. Are you sure you want to install the modules from
		'PSGallery'?
		[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "N"):

	- Can confirm this change and audit all PSRepositories by running the cmd: `Get-PSRepository`

4. PowerShellGet version 
	- Description: This module contains the tooling used to get other modules from PowerShell Gallery. v1.0.0.1 ships with Windows 10 and Windows Server. Min version required is v1.6.0. To audit which version is installed run the command: `Get-Command -Module PowerShellGet`
	- Reference: [Installing PowerShellGet](https://docs.microsoft.com/powershell/gallery/installing-psget)
	- Cmd: `Install-Module -Name PowerShellGet`
	- Optional Parameters:
		- `-Proxy` Specifies a proxy server for the request.
		- `-Force` This will ignore the "already installed" warning and install the latest version.

	You'll receive this error if you're not using newest version of PowerShellGet:
	
		Install-Module : A parameter cannot be found that matches parameter name 'AllowPrerelease'.
		At line:1 char:20
		Install-Module abc -AllowPrerelease
						   ~~~~~~~~~~~~~~~~
			CategoryInfo          : InvalidArgument: (:) [Install-Module], ParameterBindingException
			FullyQualifiedErrorId : NamedParameterNotFound,Install-Module
	
5. Restart PowerShell. It isn't possible to load the new version in the current session. Any new Powershell sessions will have the latest PowerShellGet loaded.

## Download & install via PowerShell Gallery

These steps will download the Az.ApplicationMonitor module from PowerShell Gallery.

1. Prerequisites for PowerShell Gallery are required.
2. Run PowerShell as Administrator with an elevated execution policy.
3. Install the Az.ApplicationMonitor Module
	- Reference: [Install-Module](https://docs.microsoft.com/powershell/module/powershellget/install-module?view=powershell-6)
	- Cmd: `Install-Module -Name Az.ApplicationMonitor`
	- Optional Parameters:
		- `-Proxy` Specifies a proxy server for the request.
		- `-AllowPrerelease` This will allow installing alpha and beta releases.
		- `-AcceptLicense` This will skip the "Accept License" prompt
		- `-Force` This will ignore the "Untrusted Repository" warning

## Download & install manually (offline option)

If for any reason you can't connect to the PowerShell Module, you may manually download and install the Az.ApplicationMonitor module.

### Manually download the latest nupkg

1. Navigate to: https://www.powershellgallery.com/packages/Az.ApplicationMonitor
2. Select the latest version from the version history.
3. Find "Installation Options" and select "Manual Download".

### Option 1: install into PowerShell modules directory
Install the manually downloaded PowerShell Module to a PowerShell directory so it can be discoverable by PowerShell sessions.
For more information, see: [Installing a PowerShell Module](https://docs.microsoft.com/powershell/developer/module/installing-a-powershell-module)


#### Unzip nupkg as zip using Expand-Archive (v1.0.1.0)

- Description: The base version of Microsoft.PowerShell.Archive (v1.0.1.0) can't unzip nupkg files. Rename the file with the ".zip" extension.
- Reference: [Expand-Archive](https://docs.microsoft.com/powershell/module/microsoft.powershell.archive/expand-archive?view=powershell-6)
- Cmd: 

	```
	$pathToNupkg = "C:\az.applicationmonitor.0.2.1-alpha.nupkg"
	$pathToZip = ([io.path]::ChangeExtension($pathToNupkg, "zip"))
	$pathToNupkg | rename-item -newname $pathToZip
	$pathInstalledModule = "$Env:ProgramFiles\WindowsPowerShell\Modules\az.applicationmonitor"
	Expand-Archive -LiteralPath $pathToZip -DestinationPath $pathInstalledModule
	```

#### Unzip nupkg using Expand-Archive (v1.1.0.0).

- Description: Use a current version of Expand-Archive to unzip nupkgs without renaming the extension. 
- Reference: [Expand-Archive](https://docs.microsoft.com/powershell/module/microsoft.powershell.archive/expand-archive?view=powershell-6) and [Microsoft.PowerShell.Archive](https://www.powershellgallery.com/packages/Microsoft.PowerShell.Archive/1.1.0.0)
- Cmd:

	```
	$pathToNupkg = "C:\az.applicationmonitor.0.2.1-alpha.nupkg"
	$pathInstalledModule = "$Env:ProgramFiles\WindowsPowerShell\Modules\az.applicationmonitor"
	Expand-Archive -LiteralPath $pathToNupkg -DestinationPath $pathInstalledModule
	```

### Option 2: unzip and import manually
Install the manually downloaded PowerShell Module to a PowerShell directory so it can be discoverable by PowerShell sessions.
For more information, see: [Installing a PowerShell Module](https://docs.microsoft.com/powershell/developer/module/installing-a-powershell-module)

If installing into any other directory, you must manually import the module using [Import-Module](https://docs.microsoft.com/powershell/module/microsoft.powershell.core/import-module?view=powershell-6)

> [!IMPORTANT] 
> Installation will install DLLs via relative paths. 
> Store the contents of this package into your intended runtime directory and confirm that access permissions allow read but not write.

1. Change the extension to ".zip" and extract contents of package into your intended installation directory.
2. Find the file path to "Az.ApplicationMonitor.psd1".
3. Run PowerShell as Administrator with an elevated execution policy. 
4. Load the module via the command: `Import-Module Az.ApplicationMonitor.psd1`.
	

## Proxy

When monitoring a machine on your private intranet, it will be necessary to route http traffic through a proxy.

The PowerShell commands to download and install the Az.ApplicationMonitor from the PowerShell Gallery do support a `-Proxy` parameter.
Review the instructions above when writing your installation scripts.

The Application Insights SDK will need to send your application's telemetry to Microsoft. We recommend configuring proxy settings for your application in your web.config. See [Application Insights FAQ: Proxy Passthrough](https://docs.microsoft.com/azure/azure-monitor/app/troubleshoot-faq#proxy-passthrough) for more information.


## Enable monitoring 

Cmd: `Enable-ApplicationInsightsMonitoring`

Review our [API Reference](status-monitor-v2-api-enable-monitoring.md) for a detailed description of how to use this cmdlet. 



## Next steps

 View your telemetry:

- [Explore metrics](../../azure-monitor/app/metrics-explorer.md) to monitor performance and usage
- [Search events and logs](../../azure-monitor/app/diagnostic-search.md) to diagnose problems
- [Analytics](../../azure-monitor/app/analytics.md) for more advanced queries
- [Create dashboards](../../azure-monitor/app/overview-dashboard.md)

 Add more telemetry:

- [Create web tests](monitor-web-app-availability.md) to make sure your site stays live.
- [Add web client telemetry](../../azure-monitor/app/javascript.md) to see exceptions from web page code and to let you insert trace calls.
- [Add Application Insights SDK to your code](../../azure-monitor/app/asp-net.md) so that you can insert trace and log calls

Do more with Status Monitor v2:

- Use our guide to [Troubleshoot](status-monitor-v2-troubleshoot.md) Status Monitor v2.
