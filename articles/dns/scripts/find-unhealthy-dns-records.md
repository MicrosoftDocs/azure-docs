---
title: Find unhealthy DNS records in Azure DNS - PowerShell script sample
description: In this article, learn how to use an Azure PowerShell script to find unhealthy DNS records.
author: greg-lindsay
ms.author: greglin
ms.date: 10/04/2022
ms.topic: sample
ms.service: dns
ms.custom: devx-track-azurepowershell
---
# Find unhealthy DNS records in Azure DNS - PowerShell script sample

The following Azure PowerShell script finds unhealthy DNS records in Azure DNS public zones.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

```azurepowershell-interactive
<#
    1. Install Pre requisites Az PowerShell modules  (https://learn.microsoft.com/powershell/azure/install-az-ps)
    2. Sign in to your Azure Account using Login-AzAccount or Connect-AzAccount.
    3. From an elevated PowerShell prompt, navigate to folder where the script is saved and run the following command:
        .\ Get-AzDNSUnhealthyRecords.ps1 -SubscriptionId <subscription id> -ZoneName <zonename>
        Replace subscription id with the subscription id of interest.
        Replace ZoneName with the actual zone name.
#>
param(
    # subscription if to fetch dns records from
    [String]$SubscriptionId = "All",

    #filtering zone name
    [String]$ZoneName = "All"
) 

if ($SubscriptionId -eq "All") {
    Write-Host -ForegroundColor Yellow "No subscription Id passed will process all subscriptions"
}

if ($ZoneName -eq "All") {
    Write-Host -ForegroundColor Yellow "No Zone name passed will process all zones in subscription"
}

$ErrorActionPreference = "Stop"

$AZModules = @('Az.Accounts', 'Az.Dns')
$AzLibrariesLoadStart = Get-Date
$progressItr = 1; 
$ProgessActivity = "Loading required Modules";
$StoreWarningPreference = $WarningPreference
$WarningPreference = 'SilentlyContinue'
Foreach ($module in $AZModules) {
    $progressValue = $progressItr / $AZModules.Length
    Write-Progress -Activity $ProgessActivity -Status "$module $($progressValue.ToString('P')) Complete:" -PercentComplete ($progressValue * 100)

    If (Get-Module -Name $module) {
        continue
    }
    elseif (Get-Module -ListAvailable -Name $module) {
        Import-Module -name $module -Scope Local -Force
    }
    else {
        Install-module -name $module -AllowClobber -Force -Scope CurrentUser
        Import-Module -name $module -Scope Local -Force
    }

    $progressItr = $progressItr + 1;
    If (!$(Get-Module -Name $module)) {
        Write-Error "Could not load dependant module: $module"
        throw
    }
}
$WarningPreference = $StoreWarningPreference
Write-Progress -Activity $ProgessActivity -Completed

$context = Get-AzAccessToken;
if ($context.Token -eq $null) {
    Write-host -ForegroundColor Yellow "Please sign in to your Azure Account using Login-AzAccount or Connect-AzAccount before running the script."
    exit
} 
$subscriptions = Get-AzSubscription

if ($SubscriptionId -ne "All") {
    $subscriptions = $subscriptions | Where-Object { $_.Id -eq $SubscriptionId }
    if ($subscriptions.Count -eq 0) {
        Write-host -ForegroundColor Yellow "Provided Subscription Id not found exiting."
        exit
    }
}

$scount = $subscriptions | Measure-Object
Write-Host "Subscriptions found $($scount.Count)"
if ($scount.Count -lt 1) {
    exit
}
$InvalidItems = @()
$TotalRecCount = 0;
$ProgessActivity = "Processing Subscriptions";
$progressItr = 1; 
$subscriptions | ForEach-Object {
    $progressValue = $progressItr / $scount.Count

    Select-AzSubscription -Subscription $_  | Out-Null
    Write-Progress -Activity $ProgessActivity -Status "current subscription $_  $($progressValue.ToString('P')) Complete:" -PercentComplete ($progressValue * 100)
    $progressItr = $progressItr + 1;
    $subscription = $_ 
    try {
        $dnsZones = Get-AzDnsZone -ErrorAction Continue
    }
    catch {
        Write-Host "Error retrieving DNS Zones for subscription $_"
        return;
    }

    if ($ZoneName -ne "All") {
        $dnsZones = $dnsZones | Where-Object { $_.Name -eq $ZoneName }
        if ($dnsZones.Count -eq 0) {
            Write-host -ForegroundColor Yellow "Provided ZoneName $ZoneName not found in Subscription $_."
            return;
        }
    }

    $dnsZones |  ForEach-Object {
        $allrecs = Get-AzDnsRecordSet  -Zone $_
        $sZoneName = $_.Name
        $nsrecords = $allrecs | Where-Object { $_.RecordType -eq "NS" }
        $records = $allrecs | Where-Object { ($_.RecordType -ne 'NS' ) -or ($_.Name -ne '@' ) }
        $records | ForEach-Object {    
            $rec = $_
            $Invalid = $false
            $endsWith = "*$($rec.Name)"           
            $nsrecords | ForEach-Object { if ($endsWith -like "*.$($_.Name)") { $Invalid = $true } }
            $TotalRecCount++
            if ($Invalid) {
                Write-Host -ForegroundColor Yellow "$($rec.Name) recordType $($rec.RecordType) zoneName $sZoneName subscription $subscription" 
                $hash = @{
                    Name           = $rec.Name
                    RecordType     = $rec.RecordType
                    ZoneName       = $sZoneName
                    subscriptionId = $subscription
                }
                $item = New-Object PSObject -Property $hash    
                $InvalidItems += $item
            }
            else {
                # Write-Host -ForegroundColor Green "$($rec.Name) recordType $($rec.RecordType)  zoneName $ZoneName  subscription $subscription " 
            }
        }
    }
}
Write-Progress -Activity $ProgessActivity -Completed

Write-Host "Total records processed $TotalRecCount"
$invalidMeasure = $InvalidItems | Measure-Object
Write-Host "Invalid Count  $($invalidMeasure.Count)"

Write-Host "Invalid Records "
Write-Host "==============="

$InvalidItems | Format-Table

```

## Script explanation

This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Get-AzDnsZone](/powershell/module/az.dns/get-azdnszone) | Gets an Azure public DNS zone. |
| [Get-AzDnsRecordSet](/powershell/module/az.dns/get-azdnsrecordset) | Gets a DNS record set. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).
