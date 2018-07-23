---
title: Understand the agent check results in Update Management
description: Learn how to troubleshoot issues with the Update Management agent.
services: automation
author: georgewallace
ms.author: gwallace
ms.date: 07/13/2018
ms.topic: conceptual
ms.service: automation
ms.component: update-management
manager: carmonm
---

# Understandthe agent check results in Update Management

There may be many different reasons in a machine is not updating properly. In Update Management you can check the health of an agent to determine the underlying problem. By clicking the **Troubleshoot** link under the **Update Agent Readiness** column in the portal, you launch the **Update agent checks** page. This page shows you problems with the agent and a link to this article in order to assist you in troubleshooting your issues.

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

### Insert check name here

## VM Service Health Checks

### Health Service Check

### Event 4502 Check

## Access Permissions Checks

### Crypto Folder Access

## Non-Azure Machines

```powershell

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
    [string]$checkDetails
    )
    $props = [pscustomobject] [ordered] @{
    'RuleId'=$ruleId
    'RuleName'=$ruleName
    'RuleDescription'=$ruleDescription
    'CheckResult'=$result
    'CheckDetails'=$checkDetails
    }
    return $props
}


#==================== CHECK #1 (Supported OS Check)
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
 $CheckedRules += New-RuleCheckResult 1 "OS Check" "The Windows Operating system must be version 6.1.7601 (Windows Server 2008 R2 SP1) or later" $CurrentResult $CurrentDetails


#==================== CHECK #2 (.NET Framework Check)
if($CurrentResult -eq "Failed")
{
    $CurrentDetails = ".NET Framework check was skipped because a dependant rule (OSCheck) failed"
    $CurrentResult = "Skipped"
}
elseif(Get-ChildItem 'HKLM:\SOFTWARE\Microsoft\NET Framework Setup\NDP' -Recurse |
Get-ItemProperty -name Version, Release -EA 0 | Where { $_.PSChildName -eq "Full"} | Select-Object Version)
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
$CheckedRules += New-RuleCheckResult 2 ".NET Framework Check" ".NET Framework version 4.5 or later is required" $CurrentResult $CurrentDetails


#==================== CHECK #3 (WMF Check)
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
else
{
    $CurrentDetails = "Windows Management Framework is outdated. Download version 5.1 here: https://www.microsoft.com/en-us/download/details.aspx?id=54616"
    $CurrentResult = "Failed"
}
$CheckedRules += New-RuleCheckResult 3 "WMF Check" "A Windows Management Framework version 5.1 or later is required" $CurrentResult $CurrentDetails


#==================== CHECK #4 (Firewall Setup Check)
$jrds=Test-NetConnection -ComputerName "eus2-jobruntimedata-prod-su1.azure-automation.net" -Port 443 -WarningAction SilentlyContinue
$jrds2=Test-NetConnection -ComputerName "eus2-agentservice-prod-1.azure-automation.net" -Port 443 -WarningAction SilentlyContinue
if($jrds.TcpTestSucceeded -eq "true" -and $jrds2.TcpTestSucceeded -eq "true")
{
    $CurrentDetails = "Tcp Test Succeeded East US 2 Port 443"
    $CurrentResult = "Passed"
}
else
{
    $CurrentDetails = "Tcp Test Succeeded East US 2 Port 443"
    $CurrentResult = "Failed"
}
$CheckedRules += New-RuleCheckResult 4 "Firewall Req Check" "Proxy and firewall configuration must allow Windows agent to communicate with Log Analytics and Automation services on port 443" $CurrentResult $CurrentDetails


#==================== CHECK #5 (Health Service Check)
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
$CheckedRules += New-RuleCheckResult 5 "Health Service Check" "Health Service must be running on the machine" $CurrentResult $CurrentDetails


#==================== CHECK #6 (Event 4502 Check)
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
$CheckedRules += New-RuleCheckResult 6 "Event 4502 Check" "Event Log must not have event 4502 logged in the past 24 hours" $CurrentResult $CurrentDetails


#==================== CHECK #7 (Crypto Access)
$Folder = "C:\ProgramData\Microsoft\Crypto\RSA"
$User = tasklist /v /FI "IMAGENAME eq explorer.exe" /FO list | find "User Name:"
$User = $User.Substring(14)
$permission = (Get-Acl $Folder).Access | ?{($_.IdentityReference -match $User) -or ($_.IdentityReference -match "Everyone")} | Select IdentityReference, FileSystemRights
if ($permission)
{
    $CurrentDetails = $permission | % {"$($_.IdentityReference) has '$($_.FileSystemRights)' rights on folder $folder"}
    $CurrentResult = "Passed"
}
else
{
    $CurrentDetails = "$User Doesn't have any permission on $Folder"
    $CurrentResult = "Failed"
}
$CheckedRules += New-RuleCheckResult 7 "Crypto Folder Access" "System account must have read access to folder C:\ProgramData\Microsoft\Crypto\RSA" $CurrentResult $CurrentDetails


return $CheckedRules | ConvertTo-Json
```

Output

```json
[
    {
        "RuleId":  "1",
        "RuleName":  "OS Check",
        "RuleDescription":  "The Windows Operating system must be version 6.1.7601 (Windows Server 2008 R2 SP1) or later",
        "CheckResult":  "Passed",
        "CheckDetails":  "Your Operating system is supported"
    },
    {
        "RuleId":  "2",
        "RuleName":  ".NET Framework Check",
        "RuleDescription":  ".NET Framework version 4.5 or later is required",
        "CheckResult":  "Passed",
        "CheckDetails":  "You have .NET Framework of version 4.5 or later"
    },
    {
        "RuleId":  "3",
        "RuleName":  "WMF Check",
        "RuleDescription":  "A Windows Management Framework version 5.1 or later is required",
        "CheckResult":  "Passed",
        "CheckDetails":  "You have Windows Management Framework version 5.1 or later"
    },
    {
        "RuleId":  "4",
        "RuleName":  "Firewall Req Check",
        "RuleDescription":  "Proxy and firewall configuration must allow Windows agent to communicate with Log Analytics and Automatio
n services on port 443",
        "CheckResult":  "Passed",
        "CheckDetails":  "Tcp Test Succeeded East US 2 Port 443"
    },
    {
        "RuleId":  "5",
        "RuleName":  "Health Service Check",
        "RuleDescription":  "Health Service must be running on the machine",
        "CheckResult":  "Failed",
        "CheckDetails":  "Microsoft Monitoring Agent/Health Service is NOT running"
    },
    {
        "RuleId":  "6",
        "RuleName":  "Event 4502 Check",
        "RuleDescription":  "Event Log must not have event 4502 logged in the past 24 hours",
        "CheckResult":  "Failed",
        "CheckDetails":  "Operations Manager event log does not exist on this machine"
    },
    {
        "RuleId":  "7",
        "RuleName":  "Crypto Folder Access",
        "RuleDescription":  "System account must have read access to folder C:\\ProgramData\\Microsoft\\Crypto\\RSA",
        "CheckResult":  "Failed",
        "CheckDetails":  "NORTHAMERICA\\gwallace Doesn\u0027t have any permission on C:\\ProgramData\\Microsoft\\Crypto\\RSA"
    }
]
```