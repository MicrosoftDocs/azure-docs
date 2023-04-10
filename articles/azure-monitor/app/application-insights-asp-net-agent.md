---
title: Deploy the Application Insights agent
description: Learn how to use the Application Insights agent to monitor website performance. It works with ASP.NET web apps hosted on-premises, in VMs, or on Azure.
ms.topic: conceptual
ms.date: 03/13/2023
ms.reviewer: abinetabate
---

# Deploy the Azure Monitor Application Insights agent for on-premises servers

The Application Insights agent (formerly named Status Monitor V2) is a PowerShell module published to the [PowerShell Gallery](https://www.powershellgallery.com/packages/Az.ApplicationMonitor). It replaces Status Monitor. Telemetry is sent to the Azure portal, where you can [monitor](./app-insights-overview.md) your app.

For a complete list of supported autoinstrumentation scenarios, see [Supported environments, languages, and resource providers](codeless-overview.md#supported-environments-languages-and-resource-providers).

> [!NOTE]
> The module currently supports codeless instrumentation of ASP.NET and ASP.NET Core web apps hosted with IIS. Use an SDK to instrument Java and Node.js applications.

## PowerShell Gallery

The Application Insights agent is located in the [PowerShell Gallery](https://www.powershellgallery.com/packages/Az.ApplicationMonitor).

![PowerShell Gallery icon.](https://img.shields.io/powershellgallery/v/Az.ApplicationMonitor.svg?color=Blue&label=Current%20Version&logo=PowerShell&style=for-the-badge)

## Instructions
- To get started with concise code samples, see the **Getting started** tab.
- For a deep dive on how to get started, see the **Detailed instructions** tab.
- For PowerShell API reference, see the **API reference** tab.
- For release note updates, see the **Release notes** tab.

### [Getting started](#tab/getting-started)

This tab contains the quickstart commands that are expected to work for most environments. The instructions depend on the PowerShell Gallery to distribute updates. These commands support the PowerShell `-Proxy` parameter.

For an explanation of these commands, customization instructions, and information about troubleshooting, see the [detailed instructions](?tabs=detailed-instructions#instructions).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

### Download and install via PowerShell Gallery

Use the PowerShell Gallery for download and installation.

#### Installation prerequisites

To enable monitoring, you must have a connection string. A connection string is displayed on the **Overview** pane of your Application Insights resource. For more information, see [Connection strings](./sdk-connection-string.md?tabs=net#find-your-connection-string).

> [!NOTE]
> As of April 2020, the PowerShell Gallery has deprecated TLS 1.1 and 1.0.
>
> For more prerequisites that you might need, see [PowerShell Gallery TLS support](https://devblogs.microsoft.com/powershell/powershell-gallery-tls-support).
>

Run PowerShell as an admin.

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force
Set-PSRepository -Name "PSGallery" -InstallationPolicy Trusted
Install-Module -Name PowerShellGet -Force
```    

Close PowerShell.

#### Install the Application Insights agent
Run PowerShell as an admin.

```powershell    
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
Install-Module -Name Az.ApplicationMonitor -AllowPrerelease -AcceptLicense
```    

> [!NOTE]
> The `AllowPrerelease` switch in the `Install-Module` cmdlet allows installation of the beta release. For more information, see [Install-Module](/powershell/module/powershellget/install-module#parameters).
>

#### Enable monitoring

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
Enable-ApplicationInsightsMonitoring -ConnectionString 'InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/'
```

### Download and install manually (offline option)

You can also download and install manually.

#### Download the module
Manually download the latest version of the module from the [PowerShell Gallery](https://www.powershellgallery.com/packages/Az.ApplicationMonitor).

#### Unzip and install the Application Insights agent

```powershell
$pathToNupkg = "C:\Users\t\Desktop\Az.ApplicationMonitor.0.3.0-alpha.nupkg"
$pathToZip = ([io.path]::ChangeExtension($pathToNupkg, "zip"))
$pathToNupkg | rename-item -newname $pathToZip
$pathInstalledModule = "$Env:ProgramFiles\WindowsPowerShell\Modules\Az.ApplicationMonitor"
Expand-Archive -LiteralPath $pathToZip -DestinationPath $pathInstalledModule
```

#### Enable monitoring

```powershell
Enable-ApplicationInsightsMonitoring -ConnectionString 'InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/'
```

### [Detailed instructions](#tab/detailed-instructions)

This tab describes how to onboard to the PowerShell Gallery and download the `ApplicationMonitor` module.
Included are the most common parameters that you need to get started. We've also provided manual download instructions if you don't have internet access.

### Get an instrumentation key

To get started, you need an instrumentation key. For more information, see [Create an Application Insights resource](create-new-resource.md#copy-the-instrumentation-key).

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

### Run PowerShell as Admin with an elevated execution policy

#### Run as Admin

PowerShell needs Administrator-level permissions to make changes to your computer.

#### Execution policy

- **Description:** By default, running PowerShell scripts is disabled. We recommend allowing `RemoteSigned` scripts for only the Current scope.
- **Reference:** [About Execution Policies](/powershell/module/microsoft.powershell.core/about/about_execution_policies) and [Set-ExecutionPolicy](/powershell/module/microsoft.powershell.security/set-executionpolicy).
- **Command:** `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process`.
- **Optional parameter:**
    - `-Force`. Bypasses the confirmation prompt.

**Example errors**

```output
Install-Module : The 'Install-Module' command was found in the module 'PowerShellGet', but the module could not be
loaded. For more information, run 'Import-Module PowerShellGet'.

Import-Module : File C:\Program Files\WindowsPowerShell\Modules\PackageManagement\1.3.1\PackageManagement.psm1 cannot
be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at https://go.microsoft.com/fwlink/?LinkID=135170.
```

### Prerequisites for PowerShell

Audit your instance of PowerShell by running the `$PSVersionTable` command.
This command produces the following output:

```output
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

These instructions were written and tested on a computer running Windows 10 and the versions listed.

### Prerequisites for PowerShell Gallery

The following steps prepare your server to download modules from the PowerShell Gallery.

> [!NOTE]
> PowerShell Gallery is supported on Windows 10, Windows Server 2016, and PowerShell 6+.
> For information about earlier versions, see [Installing PowerShellGet](/powershell/scripting/gallery/installing-psget).

1. Run PowerShell as Admin with an elevated execution policy.
1. Install the NuGet package provider:
    - **Description:** You need this provider to interact with NuGet-based repositories like PowerShell Gallery.
    - **Reference:** [Install-PackageProvider](/powershell/module/packagemanagement/install-packageprovider)
    - **Command:** `Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201`
    - **Optional parameters:**
        - `-Proxy`: Specifies a proxy server for the request
        - `-Force`: Bypasses the confirmation prompt
    
    You receive this prompt if NuGet isn't set up:

    ```output
    NuGet provider is required to continue
    PowerShellGet requires NuGet provider version '2.8.5.201' or newer to interact with NuGet-based repositories. 
    The NuGet provider must be available in 'C:\Program Files\PackageManagement\ProviderAssemblies' or
    'C:\Users\t\AppData\Local\PackageManagement\ProviderAssemblies'. You can also install the NuGet provider by running
    'Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force'. Do you want PowerShellGet to install and import
    the NuGet provider now?
    [Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"):
    ```    

1. Configure PowerShell Gallery as a trusted repository.
    - **Description:** By default, PowerShell Gallery is an untrusted repository.
    - **Reference:** [Set-PSRepository](/powershell/module/powershellget/set-psrepository)
    - **Command:** `Set-PSRepository -Name "PSGallery" -InstallationPolicy Trusted`
    - **Optional parameter:**
        - `-Proxy`: Specifies a proxy server for the request

    You receive this prompt if PowerShell Gallery isn't trusted:

    ```output
    Untrusted repository
    You are installing the modules from an untrusted repository. 
    If you trust this repository, change its InstallationPolicy value 
    by running the Set-PSRepository cmdlet. Are you sure you want to 
    install the modules from 'PSGallery'?
    [Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "N"):
    ```

    You can confirm this change and audit all PSRepositories by running the `Get-PSRepository` command.

1. Install the newest version of PowerShellGet.
    - **Description:** This module contains the tooling used to get other modules from the PowerShell Gallery. Version 1.0.0.1 ships with Windows 10 and Windows Server. Version 1.6.0 or higher is required. To determine which version is installed, run the `Get-Command -Module PowerShellGet` command.
    - **Reference:** [Installing PowerShellGet](/powershell/scripting/gallery/installing-psget)
    - **Command:** `Install-Module -Name PowerShellGet`
    - **Optional parameters:**
        - `-Proxy`: Specifies a proxy server for the request
        - `-Force`: Bypasses the "already installed" warning and installs the latest version

    If you're not using the newest version of PowerShellGet, you receive this error:

    ```output
    Install-Module : A parameter cannot be found that matches parameter name 'AllowPrerelease'.
    At line:1 char:20
    Install-Module abc -AllowPrerelease
                   ~~~~~~~~~~~~~~~~
    CategoryInfo          : InvalidArgument: (:) [Install-Module], ParameterBindingException
    FullyQualifiedErrorId : NamedParameterNotFound,Install-Module
    ```

1. Restart PowerShell. You can't load the new version in the current session. New PowerShell sessions load the latest version of PowerShellGet.

### Download and install the module via PowerShell Gallery

Use these steps to download the `Az.ApplicationMonitor` module from the PowerShell Gallery.

1. Ensure that all prerequisites for PowerShell Gallery are met.
1. Run PowerShell as Admin with an elevated execution policy.
1. Install the `Az.ApplicationMonitor` module.
    - **Reference:** [Install-Module](/powershell/module/powershellget/install-module)
    - **Command:** `Install-Module -Name Az.ApplicationMonitor`
    - **Optional parameters:**
        - `-Proxy`: Specifies a proxy server for the request
        - `-AllowPrerelease`: Allows installation of alpha and beta releases
        - `-AcceptLicense`: Bypasses the "Accept License" prompt
        - `-Force`: Bypasses the "Untrusted Repository" warning

### Download and install the module manually (offline option)

If you can't connect to the PowerShell module, you can manually download and install the `Az.ApplicationMonitor` module.

#### Manually download the latest nupkg file

1. Go to [PowerShell Gallery](https://www.powershellgallery.com/packages/Az.ApplicationMonitor). Select the latest version of the file in the **Version History** table.
1. Under **Installation Options**, select **Manual Download**.

#### Option 1: Install into a PowerShell modules directory
Install the manually downloaded PowerShell module into a PowerShell directory so that it's discoverable by PowerShell sessions. For more information, see [Installing a PowerShell module](/powershell/scripting/developer/module/installing-a-powershell-module).

##### Unzip nupkg as a zip file by using Expand-Archive (v1.0.1.0)

- **Description:** The base version of Microsoft.PowerShell.Archive (v1.0.1.0) can't unzip nupkg files. Rename the file with the .zip extension.
- **Reference:** [Expand-Archive](/powershell/module/microsoft.powershell.archive/expand-archive)
- **Command:**

    ```console
    $pathToNupkg = "C:\az.applicationmonitor.0.3.0-alpha.nupkg"
    $pathToZip = ([io.path]::ChangeExtension($pathToNupkg, "zip"))
    $pathToNupkg | rename-item -newname $pathToZip
    $pathInstalledModule = "$Env:ProgramFiles\WindowsPowerShell\Modules\az.applicationmonitor"
    Expand-Archive -LiteralPath $pathToZip -DestinationPath $pathInstalledModule
    ```

##### Unzip nupkg by using Expand-Archive (v1.1.0.0)

- **Description:** Use a current version of Expand-Archive to unzip nupkg files without changing the extension.
- **Reference:** [Expand-Archive](/powershell/module/microsoft.powershell.archive/expand-archive) and [Microsoft.PowerShell.Archive](https://www.powershellgallery.com/packages/Microsoft.PowerShell.Archive/1.1.0.0)
- **Command:**

    ```console
    $pathToNupkg = "C:\az.applicationmonitor.0.2.1-alpha.nupkg"
    $pathInstalledModule = "$Env:ProgramFiles\WindowsPowerShell\Modules\az.applicationmonitor"
    Expand-Archive -LiteralPath $pathToNupkg -DestinationPath $pathInstalledModule
    ```

#### Option 2: Unzip and import nupkg manually
Install the manually downloaded PowerShell module into a PowerShell directory so that it's discoverable by PowerShell sessions. For more information, see [Installing a PowerShell module](/powershell/scripting/developer/module/installing-a-powershell-module).

If you're installing the module into any other directory, manually import the module by using [Import-Module](/powershell/module/microsoft.powershell.core/import-module).

> [!IMPORTANT]
> DLLs will install via relative paths.
> Store the contents of the package in your intended runtime directory. Confirm that access permissions allow read but not write.

1. Change the extension to **.zip** and extract the contents of the package into your intended installation directory.
1. Find the file path of **Az.ApplicationMonitor.psd1**.
1. Run PowerShell as Admin with an elevated execution policy.
1. Load the module by using the `Import-Module Az.ApplicationMonitor.psd1` command.
    

### Route traffic through a proxy

When you monitor a computer on your private intranet, you need to route HTTP traffic through a proxy.

The PowerShell commands to download and install `Az.ApplicationMonitor` from the PowerShell Gallery support a `-Proxy` parameter. Review the preceding instructions when you write your installation scripts.

The Application Insights SDK needs to send your app's telemetry to Microsoft. We recommend that you configure proxy settings for your app in your web.config file. For more information, see [Application Insights FAQ: Proxy passthrough](../faq.yml).

### Enable monitoring

Use the `Enable-ApplicationInsightsMonitoring` command to enable monitoring.

For a detailed description of how to use this cmdlet, see the [API reference](?tabs=api-reference#enable-applicationinsightsmonitoring).

### [API reference](#tab/api-reference)

This tab describes the following cmdlets, which are members of the [Az.ApplicationMonitor PowerShell module](https://www.powershellgallery.com/packages/Az.ApplicationMonitor/):

- [Enable-InstrumentationEngine](?tabs=api-reference#enable-instrumentationengine)
- [Enable-ApplicationInsightsMonitoring](?tabs=api-reference#enable-applicationinsightsmonitoring)
- [Disable-InstrumentationEngine](?tabs=api-reference#disable-instrumentationengine)
- [Disable-ApplicationInsightsMonitoring](?tabs=api-reference#disable-applicationinsightsmonitoring)
- [Get-ApplicationInsightsMonitoringConfig](?tabs=api-reference#get-applicationinsightsmonitoringconfig)
- [Get-ApplicationInsightsMonitoringStatus](?tabs=api-reference#get-applicationinsightsmonitoringstatus)
- [Set-ApplicationInsightsMonitoringConfig](?tabs=api-reference#set-applicationinsightsmonitoringconfig)
- [Start-ApplicationInsightsMonitoringTrace](?tabs=api-reference#start-applicationinsightsmonitoringtrace)

To get started:
- You need an instrumentation key. For more information, see [Create a resource](create-new-resource.md#copy-the-instrumentation-key).
- This cmdlet requires that you review and accept the license and privacy statement.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

This cmdlet requires a PowerShell session with Admin permissions and an elevated execution policy. For more information, see [Run PowerShell as administrator with an elevated execution policy](?tabs=detailed-instructions#run-powershell-as-admin-with-an-elevated-execution-policy).
- This cmdlet requires that you review and accept the license and privacy statement.
- The instrumentation engine adds more overhead and is off by default.

### Enable-InstrumentationEngine

Enables the instrumentation engine by setting some registry keys. Restart IIS for the changes to take effect.

The instrumentation engine can supplement data collected by the .NET SDKs. It collects events and messages that describe the execution of a managed process. These events and messages include dependency result codes, HTTP verbs, and [SQL command text](asp-net-dependencies.md#advanced-sql-tracking-to-get-full-sql-query).

Enable the instrumentation engine if:
- You've already enabled monitoring with the `Enable` cmdlet but didn't enable the instrumentation engine.
- You've manually instrumented your app with the .NET SDKs and want to collect more telemetry.

#### Examples

```powershell
PS C:\> Enable-InstrumentationEngine
```

#### Parameters

##### -AcceptLicense
**Optional:** Use this switch to accept the license and privacy statement in headless installations.

##### -Verbose
**Common parameter:** Use this switch to output detailed logs.

#### Output

###### Example output from successfully enabling the instrumentation engine

```
Configuring IIS Environment for instrumentation engine...
Configuring registry for instrumentation engine...
```

### Enable-ApplicationInsightsMonitoring

Enables codeless attach monitoring of IIS apps on a target computer.

This cmdlet modifies the IIS applicationHost.config and sets some registry keys. It also creates an applicationinsights.ikey.config file, which defines the instrumentation key used by each app. IIS loads the `RedfieldModule` on startup, which injects the Application Insights SDK into applications as the applications start. Restart IIS for your changes to take effect.

After you enable monitoring, we recommend that you use [Live Metrics](live-stream.md) to quickly check if your app is sending us telemetry.

#### Examples

##### Example with a single instrumentation key
In this example, all apps on the current computer are assigned a single instrumentation key.

```powershell
PS C:\> Enable-ApplicationInsightsMonitoring -InstrumentationKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

##### Example with an instrumentation key map
In this example:
- `MachineFilter` matches the current computer by using the `'.*'` wildcard.
- `AppFilter='WebAppExclude'` provides a `null` instrumentation key. The specified app won't be instrumented.
- `AppFilter='WebAppOne'` assigns the specified app a unique instrumentation key.
- `AppFilter='WebAppTwo'` assigns the specified app a unique instrumentation key.
- Finally, `AppFilter` also uses the `'.*'` wildcard to match all web apps that aren't matched by the earlier rules and assign a default instrumentation key.
- Spaces are added for readability.

```powershell
PS C:\> Enable-ApplicationInsightsMonitoring -InstrumentationKeyMap 
    @(@{MachineFilter='.*';AppFilter='WebAppExclude'},
      @{MachineFilter='.*';AppFilter='WebAppOne';InstrumentationSettings=@{InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1'}},
      @{MachineFilter='.*';AppFilter='WebAppTwo';InstrumentationSettings=@{InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2'}},
      @{MachineFilter='.*';AppFilter='.*';InstrumentationSettings=@{InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxdefault'}})

```

> [!NOTE]
> The naming of `AppFilter` in this context can be confusing, `AppFilter` sets the application name regex filter (`HostingEnvironment.SiteName` in the case of .NET on IIS). `VirtualPathFilter` sets the virtual path regex filter (`HostingEnvironment.ApplicationVirtualPath` in the case of .NET on IIS). To instrument a single app, you use `VirtualPathFilter` as follows: `Enable-ApplicationInsightsMonitoring -InstrumentationKeyMap @(@{VirtualPathFilter="^/MyAppName$"; InstrumentationSettings=@{InstrumentationKey='<your ikey>'}})`

#### Parameters

##### -InstrumentationKey
**Required:** Use this parameter to supply a single instrumentation key for use by all apps on the target computer.

##### -InstrumentationKeyMap
**Required:** Use this parameter to supply multiple instrumentation keys and a mapping of the instrumentation keys used by each app. You can create a single installation script for several computers by setting `MachineFilter`.

> [!IMPORTANT]
> Apps match against rules in the order in which the rules are provided. Specify the most specific rules first and the most generic rules last.

###### Schema
`@(@{MachineFilter='.*';AppFilter='.*';InstrumentationSettings=@{InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'}})`

- **MachineFilter** is a required C# regex of the computer or VM name.
    - `'.*'` matches all.
    - `ComputerName` matches only computers with the exact name specified.
- **AppFilter** is a required C# regex of the IIS Site Name. You can get a list of sites on your server by running the command [get-iissite](/powershell/module/iisadministration/get-iissite).
    - `'.*'` matches all.
    - `SiteName` matches only the IIS site with the exact name specified.
- **InstrumentationKey** is required to enable monitoring of apps that match the preceding two filters.
    - Leave this value null if you want to define rules to exclude monitoring.

##### -EnableInstrumentationEngine
**Optional:** Use this switch to enable the instrumentation engine to collect events and messages about what's happening during the execution of a managed process. These events and messages include dependency result codes, HTTP verbs, and SQL command text.

The instrumentation engine adds overhead and is off by default.

##### -AcceptLicense
**Optional:** Use this switch to accept the license and privacy statement in headless installations.

##### -IgnoreSharedConfig
When you have a cluster of web servers, you might be using a [shared configuration](/iis/web-hosting/configuring-servers-in-the-windows-web-platform/shared-configuration_211). The `HttpModule` can't be injected into this shared configuration. This script fails with the message that extra installation steps are required.

Use this switch to ignore this check and continue installing prerequisites.
For more information, see [Known conflict with IIS shared configuration](status-monitor-v2-troubleshoot.md#conflict-with-iis-shared-configuration).

##### -Verbose
**Common parameter:** Use this switch to display detailed logs.

##### -WhatIf 
**Common parameter:** Use this switch to test and validate your input parameters without actually enabling monitoring.

#### Output

##### Example output from a successful enablement

```powershell
Initiating Disable Process
Applying transformation to 'C:\Windows\System32\inetsrv\config\applicationHost.config'
'C:\Windows\System32\inetsrv\config\applicationHost.config' backed up to 'C:\Windows\System32\inetsrv\config\applicationHost.config.backup-2019-03-26_08-59-52z'
in :1,237
No element in the source document matches '/configuration/location[@path='']/system.webServer/modules/add[@name='ManagedHttpModuleHelper']'
Not executing RemoveAll (transform line 1, 546)
Transformation to 'C:\Windows\System32\inetsrv\config\applicationHost.config' was successfully applied. Operation: 'disable'
GAC Module will not be removed, since this operation might cause IIS instabilities
Configuring IIS Environment for codeless attach...
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\IISADMIN[Environment]
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\W3SVC[Environment]
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WAS[Environment]
Configuring IIS Environment for instrumentation engine...
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\IISADMIN[Environment]
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\W3SVC[Environment]
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WAS[Environment]
Configuring registry for instrumentation engine...
Successfully disabled Application Insights Agent
Installing GAC module 'C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\0.2.0\content\Runtime\Microsoft.AppInsights.IIS.ManagedHttpModuleHelper.dll'
Applying transformation to 'C:\Windows\System32\inetsrv\config\applicationHost.config'
Found GAC module Microsoft.AppInsights.IIS.ManagedHttpModuleHelper.ManagedHttpModuleHelper, Microsoft.AppInsights.IIS.ManagedHttpModuleHelper, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35
'C:\Windows\System32\inetsrv\config\applicationHost.config' backed up to 'C:\Windows\System32\inetsrv\config\applicationHost.config.backup-2019-03-26_08-59-52z_1'
Transformation to 'C:\Windows\System32\inetsrv\config\applicationHost.config' was successfully applied. Operation: 'enable'
Configuring IIS Environment for codeless attach...
Configuring IIS Environment for instrumentation engine...
Configuring registry for instrumentation engine...
Updating app pool permissions...
Successfully enabled Application Insights Agent
```

### Disable-InstrumentationEngine

Disables the instrumentation engine by removing some registry keys. Restart IIS for the changes to take effect.

#### Examples

```powershell
PS C:\> Disable-InstrumentationEngine
```

#### Parameters

##### -Verbose
**Common parameter:** Use this switch to output detailed logs.

#### Output

###### Example output from successfully disabling the instrumentation engine

```powershell
Configuring IIS Environment for instrumentation engine...
Registry: removing 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\IISADMIN[Environment]'
Registry: removing 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\W3SVC[Environment]'
Registry: removing 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WAS[Environment]'
Configuring registry for instrumentation engine...
```

### Disable-ApplicationInsightsMonitoring

Disables monitoring on the target computer. This cmdlet removes edits to the IIS applicationHost.config and removes registry keys.

#### Examples

```powershell
PS C:\> Disable-ApplicationInsightsMonitoring
```

#### Parameters 

##### -Verbose
**Common parameter:** Use this switch to display detailed logs.

#### Output

###### Example output from successfully disabling monitoring

```powershell
Initiating Disable Process
Applying transformation to 'C:\Windows\System32\inetsrv\config\applicationHost.config'
'C:\Windows\System32\inetsrv\config\applicationHost.config' backed up to 'C:\Windows\System32\inetsrv\config\applicationHost.config.backup-2019-03-26_08-59-00z'
in :1,237
No element in the source document matches '/configuration/location[@path='']/system.webServer/modules/add[@name='ManagedHttpModuleHelper']'
Not executing RemoveAll (transform line 1, 546)
Transformation to 'C:\Windows\System32\inetsrv\config\applicationHost.config' was successfully applied. Operation: 'disable'
GAC Module will not be removed, since this operation might cause IIS instabilities
Configuring IIS Environment for codeless attach...
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\IISADMIN[Environment]
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\W3SVC[Environment]
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WAS[Environment]
Configuring IIS Environment for instrumentation engine...
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\IISADMIN[Environment]
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\W3SVC[Environment]
Registry: skipping non-existent 'HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WAS[Environment]
Configuring registry for instrumentation engine...
Successfully disabled Application Insights Agent
```

### Get-ApplicationInsightsMonitoringConfig

Gets the config file and prints the values to the console.

#### Examples

```powershell
PS C:\> Get-ApplicationInsightsMonitoringConfig
```

#### Parameters

No parameters are required.

#### Output

###### Example output from reading the config file

```
RedfieldConfiguration:
Filters:
0)InstrumentationKey:  AppFilter: WebAppExclude MachineFilter: .*
1)InstrumentationKey: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2 AppFilter: WebAppTwo MachineFilter: .*
2)InstrumentationKey: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxdefault AppFilter: .* MachineFilter: .*
```

### Get-ApplicationInsightsMonitoringStatus

This cmdlet provides troubleshooting information about the Application Insights agent. Use this cmdlet to investigate the monitoring status and version of the PowerShell module, and to inspect the running process.
This cmdlet reports version information and information about key files required for monitoring.

#### Examples

##### Example: Application status

Run the command `Get-ApplicationInsightsMonitoringStatus` to display the monitoring status of websites.

```powershell

PS C:\Windows\system32> Get-ApplicationInsightsMonitoringStatus

IIS Websites:

SiteName               : Default Web Site
ApplicationPoolName    : DefaultAppPool
SiteId                 : 1
SiteState              : Stopped

SiteName               : DemoWebApp111
ApplicationPoolName    : DemoWebApp111
SiteId                 : 2
SiteState              : Started
ProcessId              : not found

SiteName               : DemoWebApp222
ApplicationPoolName    : DemoWebApp222
SiteId                 : 3
SiteState              : Started
ProcessId              : 2024
Instrumented           : true
InstrumentationKey     : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx123

SiteName               : DemoWebApp333
ApplicationPoolName    : DemoWebApp333
SiteId                 : 4
SiteState              : Started
ProcessId              : 5184
AppAlreadyInstrumented : true
```

In this example;
- **Machine Identifier** is an anonymous ID used to uniquely identify your server. If you create a support request, we need this ID to find logs for your server.
- **Default Web Site** is `Stopped` in IIS.
- **DemoWebApp111** was started in IIS but hasn't received any requests. This report shows that there's no running process (`ProcessId: not found`).
- **DemoWebApp222** is running and is being monitored (`Instrumented: true`). Based on the user configuration, the instrumentation key `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx123` was matched for this site.
- **DemoWebApp333** was manually instrumented by using the Application Insights SDK. The Application Insights agent detected the SDK and won't monitor this site.

##### Example: PowerShell module information

Run the command `Get-ApplicationInsightsMonitoringStatus -PowerShellModule` to display information about the current module:

```powershell

PS C:\> Get-ApplicationInsightsMonitoringStatus -PowerShellModule

PowerShell Module version:
0.4.0-alpha

Application Insights SDK version:
2.9.0.3872

Executing PowerShell Module Assembly:
Microsoft.ApplicationInsights.Redfield.Configurator.PowerShell, Version=2.8.14.11432, Culture=neutral, PublicKeyToken=31bf3856ad364e35

PowerShell Module Directory:
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\0.2.2\content\PowerShell

Runtime Paths:
ParentDirectory (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content

ConfigurationPath (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\applicationInsights.ikey.config

ManagedHttpModuleHelperPath (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.AppInsights.IIS.ManagedHttpModuleHelper.dll

RedfieldIISModulePath (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.RedfieldIISModule.dll

InstrumentationEngine86Path (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation32\MicrosoftInstrumentationEngine_x86.dll

InstrumentationEngine64Path (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation64\MicrosoftInstrumentationEngine_x64.dll

InstrumentationEngineExtensionHost86Path (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation32\Microsoft.ApplicationInsights.ExtensionsHost_x86.dll

InstrumentationEngineExtensionHost64Path (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation64\Microsoft.ApplicationInsights.ExtensionsHost_x64.dll

InstrumentationEngineExtensionConfig86Path (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation32\Microsoft.InstrumentationEngine.Extensions.config

InstrumentationEngineExtensionConfig64Path (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation64\Microsoft.InstrumentationEngine.Extensions.config

ApplicationInsightsSdkPath (Exists: True)
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.dll
```

##### Example: Runtime status

You can inspect the process on the instrumented computer to see if all DLLs are loaded. If monitoring is working, at least 12 DLLs should be loaded.

Run the command `Get-ApplicationInsightsMonitoringStatus -InspectProcess`:

```
PS C:\> Get-ApplicationInsightsMonitoringStatus -InspectProcess

iisreset.exe /status
Status for IIS Admin Service ( IISADMIN ) : Running
Status for Windows Process Activation Service ( WAS ) : Running
Status for Net.Msmq Listener Adapter ( NetMsmqActivator ) : Running
Status for Net.Pipe Listener Adapter ( NetPipeActivator ) : Running
Status for Net.Tcp Listener Adapter ( NetTcpActivator ) : Running
Status for World Wide Web Publishing Service ( W3SVC ) : Running

handle64.exe -accepteula -p w3wp
BF0: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.AI.ServerTelemetryChannel.dll
C58: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.AI.AzureAppServices.dll
C68: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.AI.DependencyCollector.dll
C78: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.AI.WindowsServer.dll
C98: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.AI.Web.dll
CBC: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.AI.PerfCounterCollector.dll
DB0: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.AI.Agent.Intercept.dll
B98: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.RedfieldIISModule.dll
BB4: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.RedfieldIISModule.Contracts.dll
BCC: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.Redfield.Lightup.dll
BE0: File  (R-D)   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.dll

listdlls64.exe -accepteula w3wp
0x0000000019ac0000  0x127000  C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation64\MicrosoftInstrumentationEngine_x64.dll
0x00000000198b0000  0x4f000   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation64\Microsoft.ApplicationInsights.ExtensionsHost_x64.dll
0x000000000c460000  0xb2000   C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Instrumentation64\Microsoft.ApplicationInsights.Extensions.Base_x64.dll
0x000000000ad60000  0x108000  C:\Windows\TEMP\2.4.0.0.Microsoft.ApplicationInsights.Extensions.Intercept_x64.dll
```

#### Parameters

##### (No parameters)

By default, this cmdlet reports the monitoring status of web applications. Use this option to review if your application was successfully instrumented. You can also review which instrumentation key was matched to your site.

##### -PowerShellModule

**Optional:** Use this switch to report the version numbers and paths of DLLs required for monitoring.
Use this option if you need to identify the version of any DLL, including the Application Insights SDK.

##### -InspectProcess

**Optional:** Use this switch to report whether IIS is running. It also downloads external tools to determine if the necessary DLLs are loaded into the IIS runtime.

If this process fails, you can run these commands manually:
- iisreset.exe /status
- [handle64.exe](/sysinternals/downloads/handle) -p w3wp | findstr /I "InstrumentationEngine AI. ApplicationInsights"
- [listdlls64.exe](/sysinternals/downloads/listdlls) w3wp | findstr /I "InstrumentationEngine AI ApplicationInsights"

##### -Force

**Optional:** Used only with `InspectProcess`. Use this switch to skip the user prompt that appears before more tools are downloaded.

### Set-ApplicationInsightsMonitoringConfig

Sets the config file without doing a full reinstallation. Restart IIS for your changes to take effect.

> [!IMPORTANT]
> This cmdlet requires a PowerShell session with Admin permissions.

#### Examples

##### Example with a single instrumentation key
In this example, all apps on the current computer are assigned a single instrumentation key.

```powershell
PS C:\> Enable-ApplicationInsightsMonitoring -InstrumentationKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

##### Example with an instrumentation key map
In this example:
- `MachineFilter` matches the current computer by using the `'.*'` wildcard.
- `AppFilter='WebAppExclude'` provides a `null` instrumentation key. The specified app won't be instrumented.
- `AppFilter='WebAppOne'` assigns the specified app a unique instrumentation key.
- `AppFilter='WebAppTwo'` assigns the specified app a unique instrumentation key.
- Finally, `AppFilter` also uses the `'.*'` wildcard to match all web apps that aren't matched by the earlier rules and assign a default instrumentation key.
- Spaces are added for readability.

```powershell
Enable-ApplicationInsightsMonitoring -InstrumentationKeyMap `
       @(@{MachineFilter='.*';AppFilter='WebAppExclude'},
          @{MachineFilter='.*';AppFilter='WebAppOne';InstrumentationSettings=@{InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1'}},
          @{MachineFilter='.*';AppFilter='WebAppTwo';InstrumentationSettings=@{InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2'}},
          @{MachineFilter='.*';AppFilter='.*';InstrumentationSettings=@{InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxdefault'}})
```

#### Parameters

##### -InstrumentationKey
**Required:** Use this parameter to supply a single instrumentation key for use by all apps on the target computer.

##### -InstrumentationKeyMap
**Required:** Use this parameter to supply multiple instrumentation keys and a mapping of the instrumentation keys used by each app. You can create a single installation script for several computers by setting `MachineFilter`.

> [!IMPORTANT]
> Apps match against rules in the order in which the rules are provided. Specify the most specific rules first and the most generic rules last.

###### Schema
`@(@{MachineFilter='.*';AppFilter='.*';InstrumentationKey='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'})`

- **MachineFilter** is a required C# regex of the computer or VM name.
    - `'.*'` matches all.
    - `ComputerName` matches only computers with the specified name.
- **AppFilter** is a required C# regex of the computer or VM name.
    - `'.*'` matches all.
    - `ApplicationName` matches only IIS apps with the specified name.
- **InstrumentationKey** is required to enable monitoring of the apps that match the preceding two filters.
    - Leave this value null if you want to define rules to exclude monitoring.

##### -Verbose
**Common parameter.** Use this switch to display detailed logs.

#### Output

By default, there's no output.

###### Example verbose output from setting the config file via -InstrumentationKey

```
VERBOSE: Operation: InstallWithIkey
VERBOSE: InstrumentationKeyMap parsed:
Filters:
0)InstrumentationKey: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx AppFilter: .* MachineFilter: .*
VERBOSE: set config file
VERBOSE: Config File Path:
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\applicationInsights.ikey.config
```

###### Example verbose output from setting the config file via -InstrumentationKeyMap

```
VERBOSE: Operation: InstallWithIkeyMap
VERBOSE: InstrumentationKeyMap parsed:
Filters:
0)InstrumentationKey:  AppFilter: WebAppExclude MachineFilter: .*
1)InstrumentationKey: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2 AppFilter: WebAppTwo MachineFilter: .*
2)InstrumentationKey: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxdefault AppFilter: .* MachineFilter: .*
VERBOSE: set config file
VERBOSE: Config File Path:
C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\applicationInsights.ikey.config
```

### Start-ApplicationInsightsMonitoringTrace

Collects [ETW Events](/windows/desktop/etw/event-tracing-portal) from the codeless attach runtime. This cmdlet is an alternative to running [PerfView](https://github.com/microsoft/perfview).

Collected events are printed to the console in real time and saved to an ETL file. The output ETL file can be opened by [PerfView](https://github.com/microsoft/perfview) for further investigation.

This cmdlet runs until it reaches the timeout duration (default is 5 minutes) or is stopped manually (**Ctrl+C**).

#### Examples

##### Collect events

Normally, we ask that you collect events to investigate why your application isn't being instrumented.

The codeless attach runtime emits ETW events when IIS starts up and when your application starts up.

To collect these events:
1. In a cmd console with Admin privileges, execute `iisreset /stop` to turn off IIS and all web apps.
1. Execute this cmdlet.
1. In a cmd console with Admin privileges, execute `iisreset /start` to start IIS.
1. Try to browse to your app.
1. After your app finishes loading, you can manually stop it (**Ctrl+C**) or wait for the timeout.

##### What events to collect

You have three options when you collect events:
- Use the switch `-CollectSdkEvents` to collect events emitted from the Application Insights SDK.
- Use the switch `-CollectRedfieldEvents` to collect events emitted by the Application Insights agent and the Redfield runtime. These logs are helpful when you diagnose IIS and application startup.
- Use both switches to collect both event types.
- By default, if no switch is specified, both event types are collected.

#### Parameters

##### -MaxDurationInMinutes
**Optional:** Use this parameter to set how long this script should collect events. The default is 5 minutes.

##### -LogDirectory
**Optional:** Use this switch to set the output directory of the ETL file. By default, this file is created in the PowerShell modules directory. The full path displays during script execution.

##### -CollectSdkEvents
**Optional:** Use this switch to collect Application Insights SDK events.

##### -CollectRedfieldEvents
**Optional:** Use this switch to collect events from the Application Insights agent and the Redfield runtime.

##### -Verbose
**Common parameter:** Use this switch to output detailed logs.

#### Output

##### Example of application startup logs

```powershell
PS C:\Windows\system32> Start-ApplicationInsightsMonitoringTrace -CollectRedfieldEvents
Starting...
Log File: C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\logs\20190627_144217_ApplicationInsights_ETW_Trace.etl
Tracing enabled, waiting for events.
Tracing will timeout in 5 minutes. Press CTRL+C to cancel.

2:42:31 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace Resolved variables to: MicrosoftAppInsights_ManagedHttpModulePath='C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.RedfieldIISModule.dll', MicrosoftAppInsights_ManagedHttpModuleType='Microsoft.ApplicationInsights.RedfieldIISModule.RedfieldIISModule'
2:42:31 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace Resolved variables to: MicrosoftDiagnosticServices_ManagedHttpModulePath2='', MicrosoftDiagnosticServices_ManagedHttpModuleType2=''
2:42:31 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace Environment variable 'MicrosoftDiagnosticServices_ManagedHttpModulePath2' or 'MicrosoftDiagnosticServices_ManagedHttpModuleType2' is null, skipping managed dll loading
2:42:31 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace MulticastHttpModule.constructor, success, 70 ms
2:42:31 PM EVENT: Microsoft-ApplicationInsights-RedfieldIISModule Trace Current assembly 'Microsoft.ApplicationInsights.RedfieldIISModule, Version=2.8.18.27202, Culture=neutral, PublicKeyToken=f23a46de0be5d6f3' location 'C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.RedfieldIISModule.dll'
2:42:31 PM EVENT: Microsoft-ApplicationInsights-RedfieldIISModule Trace Matched filter '.*'~'STATUSMONITORTE', '.*'~'DemoWithSql'
2:42:31 PM EVENT: Microsoft-ApplicationInsights-RedfieldIISModule Trace Lightup assembly calculated path: 'C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.Redfield.Lightup.dll'
2:42:31 PM EVENT: Microsoft-ApplicationInsights-FrameworkLightup Trace Loaded applicationInsights.config from assembly's resource Microsoft.ApplicationInsights.Redfield.Lightup, Version=2.8.18.27202, Culture=neutral, PublicKeyToken=f23a46de0be5d6f3/Microsoft.ApplicationInsights.Redfield.Lightup.ApplicationInsights-recommended.config
2:42:34 PM EVENT: Microsoft-ApplicationInsights-FrameworkLightup Trace Successfully attached ApplicationInsights SDK
2:42:34 PM EVENT: Microsoft-ApplicationInsights-RedfieldIISModule Trace RedfieldIISModule.LoadLightupAssemblyAndGetLightupHttpModuleClass, success, 2687 ms
2:42:34 PM EVENT: Microsoft-ApplicationInsights-RedfieldIISModule Trace RedfieldIISModule.CreateAndInitializeApplicationInsightsHttpModules(lightupHttpModuleClass), success
2:42:34 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace ManagedHttpModuleHelper, multicastHttpModule.Init() success, 3288 ms
2:42:35 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace Resolved variables to: MicrosoftAppInsights_ManagedHttpModulePath='C:\Program Files\WindowsPowerShell\Modules\Az.ApplicationMonitor\content\Runtime\Microsoft.ApplicationInsights.RedfieldIISModule.dll', MicrosoftAppInsights_ManagedHttpModuleType='Microsoft.ApplicationInsights.RedfieldIISModule.RedfieldIISModule'
2:42:35 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace Resolved variables to: MicrosoftDiagnosticServices_ManagedHttpModulePath2='', MicrosoftDiagnosticServices_ManagedHttpModuleType2=''
2:42:35 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace Environment variable 'MicrosoftDiagnosticServices_ManagedHttpModulePath2' or 'MicrosoftDiagnosticServices_ManagedHttpModuleType2' is null, skipping managed dll loading
2:42:35 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace MulticastHttpModule.constructor, success, 0 ms
2:42:35 PM EVENT: Microsoft-ApplicationInsights-RedfieldIISModule Trace RedfieldIISModule.CreateAndInitializeApplicationInsightsHttpModules(lightupHttpModuleClass), success
2:42:35 PM EVENT: Microsoft-ApplicationInsights-IIS-ManagedHttpModuleHelper Trace ManagedHttpModuleHelper, multicastHttpModule.Init() success, 0 ms
Timeout Reached. Stopping...
```

### [Release notes](#tab/release-notes)

The release note updates are listed here.

### 2.0.0

Updated the Application Insights .NET/.NET Core SDK to 2.21.0-redfield

### 2.0.0-beta3

- Updated the Application Insights .NET/.NET Core SDK to 2.20.1-redfield
- Enabled SQL query collection

### 2.0.0-beta2

Updated the Application Insights .NET/.NET Core SDK to 2.18.1-redfield

### 2.0.0-beta1

Added the ASP.NET Core autoinstrumentation feature

---

## Frequently asked questions

This section provides answers to common questions.

### Does the Application Insights agent support proxy installations?

Yes. There are multiple ways to download the Application Insights agent:

- If your computer has internet access, you can onboard to the PowerShell Gallery by using `-Proxy` parameters.
- You can also manually download the module and either install it on your computer or use it directly.

Each of these options is described in the [detailed instructions](?tabs=detailed-instructions#instructions).

### Does the Application Insights agent support ASP.NET Core applications?

  Yes. Starting from [Application Insights Agent 2.0.0](https://www.powershellgallery.com/packages/Az.ApplicationMonitor/2.0.0), ASP.NET Core applications hosted in IIS are supported.

### How do I verify that the enablement succeeded?

  - You can use the [Get-ApplicationInsightsMonitoringStatus](?tabs=api-reference#get-applicationinsightsmonitoringstatus) cmdlet to verify that enablement succeeded.
  - Use [Live Metrics](./live-stream.md) to quickly determine if your app is sending telemetry.
  - You can also use [Log Analytics](../logs/log-analytics-tutorial.md) to list all the cloud roles currently sending telemetry:
  
      ```Kusto
      union * | summarize count() by cloud_RoleName, cloud_RoleInstance
      ```

## Troubleshooting

See the dedicated [troubleshooting article](/troubleshoot/azure/azure-monitor/app-insights/status-monitor-v2-troubleshoot).

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Next steps

View your telemetry:
- [Explore metrics](../essentials/metrics-charts.md) to monitor performance and usage.
- [Search events and logs](./diagnostic-search.md) to diagnose problems.
- [Use Log Analytics](../logs/log-query-overview.md) for more advanced queries.
- [Create dashboards](./overview-dashboard.md).

Add more telemetry:
- See the [Availability overview](availability-overview.md).
- [Add web client telemetry](./javascript.md) to see exceptions from webpage code and to enable trace calls.
- [Add the Application Insights SDK to your code](./asp-net.md) so that you can insert trace and log calls.

Do more with the Application Insights agent:
- [Troubleshoot](status-monitor-v2-troubleshoot.md) the Application Insights agent.
