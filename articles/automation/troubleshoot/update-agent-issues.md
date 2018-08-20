---
title: Understand the agent check results in Update Management
description: Learn how to troubleshoot issues with the Update Management agent.
services: automation
author: georgewallace
ms.author: gwallace
ms.date: 08/20/2018
ms.topic: conceptual
ms.service: automation
ms.component: update-management
manager: carmonm
---

# Understand the agent check results in Update Management

There may be many reasons your Non-Azure machine is not showing **Ready** in Update Management. In Update Management you can check the health of a Hybrid Worker agent to determine the underlying problem. This article discusses how to run the troubleshooter from the Azure portal and in offline scenarios.

## Start the troubleshooter

By clicking the **Troubleshoot** link under the **Update Agent Readiness** column in the portal, you launch the **Troubleshoot Update Agent** page. This page shows you problems with the agent and a link to this article in order to assist you in troubleshooting your issues.

![vm list page](../media/update-agent-issues/vm-list.png)

On The **Troubleshoot Update Agent** page, click **Run Checks**, to start the troubleshooter. The troubleshooter uses [Run command](../../virtual-machines/windows/run-command.md) to run a script on machine to verify multiple dependencies the agent has.

![troubleshoot page](../media/update-agent-issues/troubleshoot-page.png)

When complete the results are returned in the window. The [Pre-requisite checks](#pre-requisistes-checks) section, provides information on what each check is looking for.

![Update agent checks page](../media/update-agent-issues/update-agent-checks.png)

## Pre-requisite checks

### OS Check

The OS check, checks to ensure that the Hybrid Worker is running one of the following Operating Systems:

|Operating system  |Notes  |
|---------|---------|
|Windows Server 2008, Windows Server 2008 R2 RTM    | Supports only update assessments.         |
|Windows Server 2008 R2 SP1 and later     |.NET Framework 4.5 or later is required. ([Download .NET Framework](/dotnet/framework/install/guide-for-developers))<br/> Windows PowerShell 4.0 or later is required. ([Download WMF 4.0](https://www.microsoft.com/download/details.aspx?id=40855))<br/> Windows PowerShell 5.1 is recommended for increased reliability.  ([Download WMF 5.1](https://www.microsoft.com/download/details.aspx?id=54616))        |
|CentOS 6 (x86/x64) and 7 (x64)      | Linux agents must have access to an update repository. Classification-based patching requires 'yum' to return security data which CentOS does not have out of the box.         |
|Red Hat Enterprise 6 (x86/x64) and 7 (x64)     | Linux agents must have access to an update repository.        |
|SUSE Linux Enterprise Server 11 (x86/x64) and 12 (x64)     | Linux agents must have access to an update repository.        |
|Ubuntu 14.04 LTS and 16.04 LTS (x86/x64)      |Linux agents must have access to an update repository.         |

### WMF Check

The WMF check, ensures that the system have the required version of the Windows Management. [Windows Management Framework 4.0](https://www.microsoft.com/download/details.aspx?id=40855) is the lowest version supported. It is recommended that you install [Windows Management Framework 5.1](https://www.microsoft.com/download/details.aspx?id=54616) for increased reliability of the Hybrid Runbook Worker.

### TLS 1.2 Support

This check, determines if you are using TLS 1.2 to encrypt your communications. TLS 1.0 is no longer supported by the platform and it is recommended that clients use TLS 1.2 to communicate with Update Management.

## Connectivity Checks

### Agent Service

This check determines if the agent can properly communicate with the agent service.

For a list of addresses and ports to open , see[Network planning for Hybrid Workers](automation-hybrid-runbook-worker.md#network-planning)

### jrds Service

This check determines if the agent can properly communicate with the job runtime date service.

For a list of addresses and ports to open , see[Network planning for Hybrid Workers](automation-hybrid-runbook-worker.md#network-planning)

## VM Service Health Checks

### Health Service Check

This check determines if the Microsoft Monitoring Agent/Health service `HealthService` is running on the machine.

### Event 4502 Check

This check determines if there have been any `4502` events in the Operations Manager log on the machine in the last 24 hours.

## Access Permissions Checks

### Crypto Folder Access

The Crypto Folder Access check determines if Local System Account has access to `C:\ProgramData\Microsoft\Crypto\RSA`

## Troubleshoot offline

Do troubleshoot the Hybrid worker offline, you can run the following script to retrieve the same results.

```azurepowershell-interactive
param(
    [string]$automationAccountLocation,
    [switch]$returnAsJson
    )

$location = switch ( $automationAccountLocation )
    {
        "southeastasia"     { "sea"  }
        "eastus2"           { "eus2" }
        "southcentralus"    { "scus" }
        "northeurope"       { "ne"   }
        "westeurope"        { "we"   }
        "japaneast"         { "jpe"  }
        "australiasoutheast"{ "ase"  }
        "centralindia"      { "cid"  }
        "canadacentral"     { "cc"   }
        "uksouth"           { "uks"  }
        "westcentralus"     { "wcus" }
        default             { "eus2" }
    }

$CheckedRules = @()
[string]$CurrentResult = ""
[string]$CurrentDetails = ""

function New-RuleCheckResult
{
    param(
    [string]$ruleId,
    [string]$ruleName,
    [string]$ruleDescription,
    [string]$result,
    [string]$checkDetails,
    [string]$ruleGroupId = $ruleId,
    [string]$ruleGroupName
    )
    $props = [pscustomobject] [ordered] @{
    'RuleId'= $ruleId
    'RuleGroupId'= $ruleGroupId
    'RuleName'= $ruleName
    'RuleGroupName' = $ruleGroupName
    'RuleDescription'= $ruleDescription
    'CheckResult'= $result
    'CheckDetails'= $checkDetails
    }
    return $props
}

function checkRegValue
{
    [CmdletBinding()]
    param(
    [string][Parameter(Mandatory=$true)]$path,
    [string][Parameter(Mandatory=$true)]$name,
    #[string]$propType,
    [int][Parameter(Mandatory=$true)]$valueToCheck
    )
    $val = Get-ItemProperty -path $path -name $name -ErrorAction SilentlyContinue
    if($val.$name -eq $null)
    {
        return $null
    }
    if($val.$name -eq $valueToCheck)
    {
        return $true
    }
    else
    {
        return $false
    }
}


#==================== (Supported OS Check)
if([System.Environment]::OSVersion.Version -ge [System.Version]"6.1.7601")
{
     $CurrentDetails = "Your Operating system is supported"
     $CurrentResult = "Passed"
}
else
{
     $CurrentDetails = "Your version of Windows is not supported.  A list of supported client types can be found here: https://docs.microsoft.com/en-us/azure/automation/automation-update-management#supported-client-types"
     $CurrentResult = "Failed"
}
 $CheckedRules += New-RuleCheckResult "OperatingSystemCheck" "Operating System" "The Windows Operating system must be version 6.1.7601 (Windows Server 2008 R2 SP1) or later" $CurrentResult $CurrentDetails "prerequisites" "Prerequisite Checks"


#==================== (.NET Framework Check)
if($CurrentResult -eq "Failed")
{
    $CurrentDetails = ".NET Framework check was skipped because a dependant rule (OSCheck) failed"
    $CurrentResult = "Skipped"
}
elseif(Get-ChildItem 'HKLM:\\SOFTWARE\\Microsoft\\NET Framework Setup\\NDP' -Recurse |
Get-ItemProperty -name Version, Release -ErrorAction SilentlyContinue | Where { $_.PSChildName -eq "Full"} | Select-Object Version)
# Since only .NET versions 4.5 and above have a 'Full' folder  https://docs.microsoft.com/en-us/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed
{
    $CurrentDetails = "You have .NET Framework of version 4.5 or later"
    $CurrentResult = "Passed"
}
else
{
    $CurrentDetails = "The .NET Framework is outdated. Download the lastest version here: https://www.microsoft.com/net/download/dotnet-framework-runtime"
    $CurrentResult = "Failed"
}
$CheckedRules += New-RuleCheckResult "DotNetFrameworkInstalledCheck" ".Net Framework 4.5+" ".NET Framework version 4.5 or later is required" $CurrentResult $CurrentDetails "prerequisites" "Prerequisite Checks"


#==================== (WMF Check)
if(($CurrentResult -eq "Failed") -or ($CurrentResult -eq "Skipped"))
{
    $CurrentDetails = "The WMF check was skipped because a dependant rule failed"
    $CurrentResult = "Skipped"
}
elseif($PSVersionTable.PSVersion -ge 5.1)
{
    $CurrentDetails = "You have Windows Management Framework version 5.1 or later"
    $CurrentResult = "Passed"
}
elseif($PSVersionTable.PSVersion.Major -ge 4)
{
    $CurrentDetails = "While your version of WMF is supported, it is recommended you have Windows Management Framework version 5.1 or later for increased reliability. Download version 5.1 here: https://www.microsoft.com/en-us/download/details.aspx?id=54616"
    $CurrentResult = "PassedWithWarning"
}
else
{
    $CurrentDetails = "Windows Management Framework is outdated. Download version 5.1 here: https://www.microsoft.com/en-us/download/details.aspx?id=54616"
    $CurrentResult = "Failed"
}
$CheckedRules += New-RuleCheckResult "WindowsManagementFrameworkInstalledCheck" "WMF 5.1" "A Windows Management Framework version 5.1 or later is recomended, version 4.0 or later is required." $CurrentResult $CurrentDetails "prerequisites" "Prerequisite Checks"


#==<<<<<== [Firewall Setup Check Group START]


#============= (FSC Agent Service)
$wsIds = @()
$wsIds = (Get-ChildItem 'HKLM:\\SYSTEM\\CurrentControlSet\\Services\\HealthService\\Parameters\\Management Groups' -Recurse -ErrorAction SilentlyContinue | Get-ItemProperty -name "Service Connector Service Name" -ErrorAction SilentlyContinue | Where { ($_.PSChildName).Substring(0,4) -eq "AOI-"} | Select-Object "Service Connector Service Name" ).'Service Connector Service Name'.Remove(0,16)
ForEach ($id in $wsIds)
{
    if((Test-NetConnection -ComputerName "$id.agentsvc.azure-automation.net" -Port 443 -WarningAction SilentlyContinue).TcpTestSucceeded)
    {
        $CurrentDetails = "Agent Service TCP Test to $id.agentsvc.azure-automation.net Succeeded on Port 443"
        $CurrentResult = "Passed"
    }
    else
    {
        $CurrentDetails = "Agent Service TCP Test to $id.agentsvc.azure-automation.net Failed on Port 443"
        $CurrentResult = "Failed"
    }
    $CheckedRules += New-RuleCheckResult "AutomationAgentServiceConnectivityCheck" "$id.agentsvc.azure-automation.net" "Proxy and firewall configuration must allow Windows agent to communicate with Log Analytics and Automation services on port 443" $CurrentResult $CurrentDetails "connectivity" "Connectivity Checks"
}

#==================== (FSC jrds)
$jrds=Test-NetConnection -ComputerName "$location-jobruntimedata-prod-su1.azure-automation.net" -Port 443 -WarningAction SilentlyContinue

if($jrds.TcpTestSucceeded -eq "true")
{
    $CurrentDetails = "Job Runtime Data TCP Test Succeeded in $location on Port 443"
    $CurrentResult = "Passed"
}
else
{
    $CurrentDetails = "Job Runtime Data TCP Test Failed in $location on Port 443"
    $CurrentResult = "Failed"
}
$CheckedRules += New-RuleCheckResult "AutomationJobRuntimeDataServiceConnectivityCheck" "$location-jobruntimedata-prod-su1.azure-automation.net" "Proxy and firewall configuration must allow Windows agent to communicate with Log Analytics and Automation services on port 443" $CurrentResult $CurrentDetails "connectivity" "Connectivity Checks"


#==<<<<<== [Firewall Setup Check Group END]


#==================== (Health Service Check)
if(Get-Service -Name "HealthService" -ErrorAction SilentlyContinue| Where-Object {$_.Status -eq "Running"} | Select-Object)
{
     $CurrentDetails = "Microsoft Monitoring Agent/Health Service is running"
     $CurrentResult = "Passed"
}
else
{
     $CurrentDetails = "Microsoft Monitoring Agent/Health Service is NOT running"
     $CurrentResult = "Failed"
}
$CheckedRules += New-RuleCheckResult "MonitoringAgentServiceRunningCheck" "MMA Service Status" "Health Service must be running on the machine" $CurrentResult $CurrentDetails "servicehealth" "VM Service Health Checks"


#==================== (Event 4502 Check)
$OpsMgrLogExists = [System.Diagnostics.EventLog]::Exists('Operations Manager');
if($OpsMgrLogExists)
{
    $event = Get-EventLog -LogName "Operations Manager" -Source "Health Service Modules" -After (Get-Date).AddHours(-24) | where {$_.eventID -eq 4502}
    if($event -eq $null) 
    {
        $CurrentDetails = "Operations Manager Event Log does not have event 4502 in the last 24 hours"
        $CurrentResult = "Passed"
    }
    else
    {
        $CurrentDetails = "Operations Manager has logged event 4502 in the last 24 hours"
        $CurrentResult = "Failed"
    }
}
else
{
    $CurrentDetails = "Operations Manager event log does not exist on this machine"
    $CurrentResult = "Failed"
}
$CheckedRules += New-RuleCheckResult "HybridWorkerRegistrationErrorsCheck" "MMA Service Events" "Event Log must not have event 4502 logged in the past 24 hours" $CurrentResult $CurrentDetails "servicehealth" "VM Service Health Checks"


#==================== (Crypto Access)
$Folder = "C:\\ProgramData\\Microsoft\\Crypto\\RSA"
$User = $env:UserName
$permission = (Get-Acl $Folder).Access | ?{($_.IdentityReference -match $User) -or ($_.IdentityReference -match "Everyone")} | Select IdentityReference, FileSystemRights
if ($permission)
{
    $CurrentDetails = $permission | % {"$($_.IdentityReference) has '$($_.FileSystemRights)' rights on folder $folder"}
    $CurrentResult = "Passed"
}
else
{
    $CurrentDetails = "You don't have any permission on $Folder"
    $CurrentResult = "Failed"
}
$CheckedRules += New-RuleCheckResult "CryptoRsaFolderAccessCheck" "Crypto Folder Access" "System account must have read access to folder $Folder" $CurrentResult $CurrentDetails "permissions" "Access Permission Checks"


#==================== (TLS 1.2 Check)
$ServerEnabled =     checkRegValue "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.2\\Server" "Enabled" 1
$ServerNotDisabled = checkRegValue "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.2\\Server" "DisabledByDefault" 0
$ClientEnabled =     checkRegValue "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.2\\Client" "Enabled" 1
$ClientNotDisabled = checkRegValue "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.2\\Client" "DisabledByDefault" 0

$ServerNotEnabled = checkRegValue "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.2\\Server" "Enabled" 0
$ServerDisabled =   checkRegValue "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.2\\Server" "DisabledByDefault" 1
$ClientNotEnabled = checkRegValue "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.2\\Client" "Enabled" 0
$ClientDisabled =   checkRegValue "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols\\TLS 1.2\\Client" "DisabledByDefault" 1

if ($CheckedRules[0].CheckResult -ne "Passed" -and [System.Environment]::OSVersion.Version -ge [System.Version]"6.0.6001")
{
    $CurrentDetails = "Your OS does not naturaly support TLS 1.2. While it is possible to update and add support for TLS 1.2 on your current OS, updating is highly recomended as your current version of Windows only supports update assessments. Information on updateing can be found here: https://support.microsoft.com/en-us/help/4019276/update-to-add-support-for-tls-1-1-and-tls-1-2-in-windows"
    $CurrentResult = "Failed"
}
elseif([System.Environment]::OSVersion.Version -ge [System.Version]"6.1.7601" -and [System.Environment]::OSVersion.Version -le [System.Version]"6.1.8400")
{
    if($ClientNotDisabled -and $ServerNotDisabled -and !($ServerNotEnabled -and $ClientNotEnabled))
    {
        $CurrentDetails = "Your OS does not support TLS 1.2 by default but your regestry has been set up to do so."
        $CurrentResult = "Passed"
    }
    else
    {
        $CurrentDetails = "Your OS does not support TLS 1.2 by default. Instructions on how to enable support can be found here: https://docs.microsoft.com/en-us/windows-server/security/tls/tls-registry-settings#tls-12"
        $CurrentResult = "Failed"
    }
}
elseif([System.Environment]::OSVersion.Version -ge [System.Version]"6.2.9200")
{
    if($ClientDisabled -or $ServerDisabled -or $ServerNotEnabled -or $ClientNotEnabled)
    {
        $CurrentDetails = "Your OS supports TLS 1.2 by default but certain regestry keys have been set up to dissable it. Instructions on how to re-enable default support by can be found here: https://docs.microsoft.com/en-us/windows-server/security/tls/tls-registry-settings#tls-12"
        $CurrentResult = "Failed"
    }
    else
    {
        $CurrentDetails = "Your OS supports TLS 1.2 by default."
        $CurrentResult = "Passed"
    }
}
else
{
    $CurrentDetails = "Your OS does not naturaly support TLS 1.2"
    $CurrentResult = "Failed"
}
$CheckedRules += New-RuleCheckResult "TlsVersionCheck" "TLS 1.2" "Client and Server connections must support TLS 1.2" $CurrentResult $CurrentDetails "prerequisites" "Prerequisite Checks"


if($returnAsJson.IsPresent)
{
    return ConvertTo-Json $CheckedRules -Compress
}
else
{
    return $CheckedRules
}
```

## Next steps

