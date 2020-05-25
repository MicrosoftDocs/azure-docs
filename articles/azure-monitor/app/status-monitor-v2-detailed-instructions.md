---
title: Azure Application Insights Agent detailed instructions | Microsoft Docs
description: Detailed instructions for getting started with Application Insights Agent. Monitor website performance without redeploying the website. Works with ASP.NET web apps hosted on-premises, in VMs, or on Azure.
ms.topic: conceptual
author: TimothyMothra
ms.author: tilee
ms.date: 04/23/2019

---

# Application Insights Agent (formerly named Status Monitor v2): Detailed instructions

This article describes how to onboard to the PowerShell Gallery and download the ApplicationMonitor module.
Included are the most common parameters that you'll need to get started.
We've also provided manual download instructions in case you don't have internet access.

## Get an instrumentation key

To get started, you need an instrumentation key. For more information, see [Create an Application Insights resource](create-new-resource.md#copy-the-instrumentation-key).

## Run PowerShell as Admin with an elevated execution policy

### Run as Admin

PowerShell needs Administrator-level permissions to make changes to your computer.
### Execution policy
- Description: By default, running PowerShell scripts is disabled. We recommend allowing RemoteSigned scripts for only the Current scope.
- Reference: [About Execution Policies](https://docs.microsoft.com/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-6) and [Set-ExecutionPolicy](
https://docs.microsoft.com/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-6
).
- Command: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process`.
- Optional parameter:
    - `-Force`. Bypasses the confirmation prompt.

**Example errors**

```
Install-Module : The 'Install-Module' command was found in the module 'PowerShellGet', but the module could not be
loaded. For more information, run 'Import-Module PowerShellGet'.
    
Import-Module : File C:\Program Files\WindowsPowerShell\Modules\PackageManagement\1.3.1\PackageManagement.psm1 cannot
be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at
https:/go.microsoft.com/fwlink/?LinkID=135170.
```


## Prerequisites for PowerShell

Audit your instance of PowerShell by running the `$PSVersionTable` command.
This command produces the following output:


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

These instructions were written and tested on a computer running Windows 10 and the versions listed above.

## Prerequisites for PowerShell Gallery

These steps will prepare your server to download modules from PowerShell Gallery.

> [!NOTE] 
> PowerShell Gallery is supported on Windows 10, Windows Server 2016, and PowerShell 6.
> For information about earlier versions, see [Installing PowerShellGet](/powershell/scripting/gallery/installing-psget).


1. Run PowerShell as Admin with an elevated execution policy.
2. Install the NuGet package provider.
    - Description: You need this provider to interact with NuGet-based repositories like PowerShell Gallery.
    - Reference: [Install-PackageProvider](https://docs.microsoft.com/powershell/module/packagemanagement/install-packageprovider?view=powershell-6).
    - Command: `Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201`.
    - Optional parameters:
        - `-Proxy`. Specifies a proxy server for the request.
        - `-Force`. Bypasses the confirmation prompt.
    
    You'll receive this prompt if NuGet isn't set up:
        
        NuGet provider is required to continue
        PowerShellGet requires NuGet provider version '2.8.5.201' or newer to interact with NuGet-based repositories. The NuGet
         provider must be available in 'C:\Program Files\PackageManagement\ProviderAssemblies' or
        'C:\Users\t\AppData\Local\PackageManagement\ProviderAssemblies'. You can also install the NuGet provider by running
        'Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force'. Do you want PowerShellGet to install and import
         the NuGet provider now?
        [Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"):
    
3. Configure PowerShell Gallery as a trusted repository.
    - Description: By default, PowerShell Gallery is an untrusted repository.
    - Reference: [Set-PSRepository](https://docs.microsoft.com/powershell/module/powershellget/set-psrepository?view=powershell-6).
    - Command: `Set-PSRepository -Name "PSGallery" -InstallationPolicy Trusted`.
    - Optional parameter:
        - `-Proxy`. Specifies a proxy server for the request.

    You'll receive this prompt if PowerShell Gallery isn't trusted:

        Untrusted repository
        You are installing the modules from an untrusted repository. If you trust this repository, change its
        InstallationPolicy value by running the Set-PSRepository cmdlet. Are you sure you want to install the modules from
        'PSGallery'?
        [Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "N"):

    You can confirm this change and audit all PSRepositories by running the `Get-PSRepository` command.

4. Install the newest version of PowerShellGet.
    - Description: This module contains the tooling used to get other modules from PowerShell Gallery. Version 1.0.0.1 ships with Windows 10 and Windows Server. Version 1.6.0 or higher is required. To determine which version is installed, run the `Get-Command -Module PowerShellGet` command.
    - Reference: [Installing PowerShellGet](/powershell/scripting/gallery/installing-psget).
    - Command: `Install-Module -Name PowerShellGet`.
    - Optional parameters:
        - `-Proxy`. Specifies a proxy server for the request.
        - `-Force`. Bypasses the "already installed" warning and installs the latest version.

    You'll receive this error if you're not using the newest version of PowerShellGet:
    
        Install-Module : A parameter cannot be found that matches parameter name 'AllowPrerelease'.
        At line:1 char:20
        Install-Module abc -AllowPrerelease
                           ~~~~~~~~~~~~~~~~
            CategoryInfo          : InvalidArgument: (:) [Install-Module], ParameterBindingException
            FullyQualifiedErrorId : NamedParameterNotFound,Install-Module
    
5. Restart PowerShell. You can't load the new version in the current session. New PowerShell sessions will load the latest version of PowerShellGet.

## Download and install the module via PowerShell Gallery

These steps will download the Az.ApplicationMonitor module from PowerShell Gallery.

1. Ensure that all prerequisites for PowerShell Gallery are met.
2. Run PowerShell as Admin with an elevated execution policy.
3. Install the Az.ApplicationMonitor module.
    - Reference: [Install-Module](https://docs.microsoft.com/powershell/module/powershellget/install-module?view=powershell-6).
    - Command: `Install-Module -Name Az.ApplicationMonitor`.
    - Optional parameters:
        - `-Proxy`. Specifies a proxy server for the request.
        - `-AllowPrerelease`. Allows installation of alpha and beta releases.
        - `-AcceptLicense`. Bypasses the "Accept License" prompt
        - `-Force`. Bypasses the "Untrusted Repository" warning.

## Download and install the module manually (offline option)

If for any reason you can't connect to the PowerShell module, you can manually download and install the Az.ApplicationMonitor module.

### Manually download the latest nupkg file

1. Go to https://www.powershellgallery.com/packages/Az.ApplicationMonitor.
2. Select the latest version of the file in the **Version History** table.
3. Under **Installation Options**, select **Manual Download**.

### Option 1: Install into a PowerShell modules directory
Install the manually downloaded PowerShell module into a PowerShell directory so it will be discoverable by PowerShell sessions.
For more information, see [Installing a PowerShell Module](/powershell/scripting/developer/module/installing-a-powershell-module).


#### Unzip nupkg as a zip file by using Expand-Archive (v1.0.1.0)

- Description: The base version of Microsoft.PowerShell.Archive (v1.0.1.0) can't unzip nupkg files. Rename the file with the .zip extension.
- Reference: [Expand-Archive](https://docs.microsoft.com/powershell/module/microsoft.powershell.archive/expand-archive?view=powershell-6).
- Command:

    ```
    $pathToNupkg = "C:\az.applicationmonitor.0.3.0-alpha.nupkg"
    $pathToZip = ([io.path]::ChangeExtension($pathToNupkg, "zip"))
    $pathToNupkg | rename-item -newname $pathToZip
    $pathInstalledModule = "$Env:ProgramFiles\WindowsPowerShell\Modules\az.applicationmonitor"
    Expand-Archive -LiteralPath $pathToZip -DestinationPath $pathInstalledModule
    ```

#### Unzip nupkg by using Expand-Archive (v1.1.0.0)

- Description: Use a current version of Expand-Archive to unzip nupkg files without changing the extension.
- Reference: [Expand-Archive](https://docs.microsoft.com/powershell/module/microsoft.powershell.archive/expand-archive?view=powershell-6) and [Microsoft.PowerShell.Archive](https://www.powershellgallery.com/packages/Microsoft.PowerShell.Archive/1.1.0.0).
- Command:

    ```
    $pathToNupkg = "C:\az.applicationmonitor.0.2.1-alpha.nupkg"
    $pathInstalledModule = "$Env:ProgramFiles\WindowsPowerShell\Modules\az.applicationmonitor"
    Expand-Archive -LiteralPath $pathToNupkg -DestinationPath $pathInstalledModule
    ```

### Option 2: Unzip and import nupkg manually
Install the manually downloaded PowerShell module into a PowerShell directory so it will be discoverable by PowerShell sessions.
For more information, see [Installing a PowerShell Module](/powershell/scripting/developer/module/installing-a-powershell-module).

If you're installing the module into any other directory, manually import the module by using [Import-Module](https://docs.microsoft.com/powershell/module/microsoft.powershell.core/import-module?view=powershell-6).

> [!IMPORTANT] 
> DLLs will install via relative paths.
> Store the contents of the package in your intended runtime directory and confirm that access permissions allow read but not write.

1. Change the extension to ".zip" and extract the contents of the package into your intended installation directory.
2. Find the file path of Az.ApplicationMonitor.psd1.
3. Run PowerShell as Admin with an elevated execution policy.
4. Load the module by using the `Import-Module Az.ApplicationMonitor.psd1` command.
    

## Route traffic through a proxy

When you monitor a computer on your private intranet, you'll need to route HTTP traffic through a proxy.

The PowerShell commands to download and install Az.ApplicationMonitor from the PowerShell Gallery support a `-Proxy` parameter.
Review the preceding instructions when you write your installation scripts.

The Application Insights SDK will need to send your app's telemetry to Microsoft. We recommend that you configure proxy settings for your app in your web.config file. For more information, see [Application Insights FAQ: Proxy passthrough](https://docs.microsoft.com/azure/azure-monitor/app/troubleshoot-faq#proxy-passthrough).


## Enable monitoring

Use the `Enable-ApplicationInsightsMonitoring` command to enable monitoring.

See the [API reference](https://docs.microsoft.com/azure/azure-monitor/app/status-monitor-v2-api-reference#enable-applicationinsightsmonitoring) for a detailed description of how to use this cmdlet.



## Next steps

 View your telemetry:

- [Explore metrics](../../azure-monitor/platform/metrics-charts.md) to monitor performance and usage.
- [Search events and logs](../../azure-monitor/app/diagnostic-search.md) to diagnose problems.
- [Use Analytics](../../azure-monitor/app/analytics.md) for more advanced queries.
- [Create dashboards](../../azure-monitor/app/overview-dashboard.md).

 Add more telemetry:

- [Create web tests](monitor-web-app-availability.md) to make sure your site stays live.
- [Add web client telemetry](../../azure-monitor/app/javascript.md) to see exceptions from web page code and to enable trace calls.
- [Add the Application Insights SDK to your code](../../azure-monitor/app/asp-net.md) so you can insert trace and log calls.

Do more with Application Insights Agent:

- Use our guide to [troubleshoot](status-monitor-v2-troubleshoot.md) Application Insights Agent.
