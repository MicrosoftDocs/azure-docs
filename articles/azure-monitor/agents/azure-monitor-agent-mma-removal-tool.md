---
title: MMA Discovery and Removal Utility
description: This article describes a PowerShell script to remove the legacy agent from systems that migrated to the Azure Monitor Agent.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.reviewer: jeffwo
ms.date: 07/30/2024
ms.custom:
# Customer intent: As an Azure account administrator, I want to use the available Azure Monitor tools to migrate from the Log Analytics Agent to the Azure Monitor Agent and track the status of the migration in my account.
---
# MMA/OMS Discovery and Removal Utility

After you migrate your machines to the Azure Monitor Agent (AMA), remove the legacy Log Analytics Agent, MMA, or OMS depending on your operating systems, to avoid duplication of logs. The legacy Discovery and Removal Utility can remove the extensions from Azure Virtual Machines (VMs), Azure Virtual Machine Scale Sets (VMSSs), and Azure Arc servers from a single subscription.

The utility works in two steps:

1. *Discovery*: The utility creates an inventory of all machines that have a legacy agent installed in a simple CSV file. We recommend that you don't create any new VMs while the utility is running.

2. *Removal*: The utility removes the legacy agent from machines listed in the CSV file. You should edit the list of machine in the CSV file to ensure that only machines you want the agent removed from are present.

## Prerequisites  
Do all the setup steps on an Internet connected machine. You need:

- Windows 10 or later, or Windows Server 2019 or later.
- [PowerShell 7.0 or later.](/powershell/scripting/install/installing-powershell?view=powershell-7.4&preserve-view=true), which enables parallel execution that speeds the process up.
- Azcli must be installed to communicate with the [Azure Graph API.](/cli/azure/install-azure-cli-windows?tabs=azure-cli). 
1. Open PowerShell as administrator:
2. Run the command: `Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile AzureCLI.msi`.
3. Run the command: `Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'`.
4. The latest version of Azure CLI will download and install.


## Step 1 Login and set subscription
The tool works one subscription at a time. You must log in and set the subscription to do the removal. Open a PowerShell command prompt as administrator and login.

``` PowerShell
az login
   ```
Next you must set your subscription.

``` PowerShell
Az account set --subscription {subscription_id or “subscription_name”}
   ```
## Step 2 Copy the script

You'll use the following script for agent removal. Open a file in your local directory named MMAUnistallUtilityScript.ps1 and copy the script into the file.
   ``` PowerShell
# This is per subscription, the customer has to set the az subscription before running this.
# az login
# az account set --subscription <subscription_id/subscription_name>
# This script uses parallel processing, modify the $parallelThrottleLimit parameter to either increase or decrease the number of parallel processes
# PS> .\LogAnalyticsAgentUninstallUtilityScript.ps1 GetInventory
# The above command will generate a csv file with the details of Vm's and Vmss and Arc servers that has MMA/OMS extension installed. 
# The customer can modify the the csv by adding/removing rows if needed
# Remove the MMA/OMS by running the script again as shown below:
# PS> .\LogAnalyticsAgentUninstallUtilityScript.ps1 UninstallExtension

# This version of the script requires Powershell version >= 7 in order to improve performance via ForEach-Object -Parallel
# https://docs.microsoft.com/en-us/powershell/scripting/whats-new/migrating-from-windows-powershell-51-to-powershell-7?view=powershell-7.1
if ($PSVersionTable.PSVersion.Major -lt 7) 
{
    Write-Host "This script requires Powershell version 7 or newer to run. Please see https://docs.microsoft.com/en-us/powershell/scripting/whats-new/migrating-from-windows-powershell-51-to-powershell-7?view=powershell-7.1."
    exit 1
}

$parallelThrottleLimit = 16

function GetArcServersWithLogAnalyticsAgentExtensionInstalled {
    param (
        $fileName
    )
    
    $serverList = az connectedmachine list --query "[].{ResourceId:id, ResourceGroup:resourceGroup, ServerName:name}" | ConvertFrom-Json
    if(!$serverList)
    {
        Write-Host "Cannot get the Arc server list"
        return
    }

    $serversCount = $serverList.Length
    $vmParallelThrottleLimit = $parallelThrottleLimit
    if ($serversCount -lt $vmParallelThrottleLimit) 
    {
        $serverParallelThrottleLimit = $serversCount
    }

    if($serversCount -eq 1)
    {
        $serverGroups += ,($serverList[0])
    }
    else
    {
        # split the list into batches to do parallel processing
        for ($i = 0; $i -lt $serversCount; $i += $vmParallelThrottleLimit) 
        { 
            $serverGroups += , ($serverList[$i..($i + $serverParallelThrottleLimit - 1)]) 
        }
    }

    Write-Host "Detected $serversCount Arc servers in this subscription."
    $hash = [hashtable]::Synchronized(@{})
    $hash.One = 1

    $serverGroups | Foreach-Object -ThrottleLimit $parallelThrottleLimit -Parallel {
        $len = $using:serversCount
        $hash = $using:hash
        $_ | ForEach-Object {
            $percent = 100 * $hash.One++ / $len
            Write-Progress -Activity "Getting Arc server extensions Inventory" -PercentComplete $percent
            $serverName = $_.ServerName
            $resourceGroup = $_.ResourceGroup
            $resourceId = $_.ResourceId
            Write-Debug "Getting extensions for Arc server: $serverName"
            $extensions = az connectedmachine extension list -g $resourceGroup --machine-name $serverName --query "[?contains(['MicrosoftMonitoringAgent', 'OmsAgentForLinux', 'AzureMonitorLinuxAgent', 'AzureMonitorWindowsAgent'], properties.type)].{type: properties.type, name: name}" | ConvertFrom-Json

            if (!$extensions) {
                return
            }
            $extensionMap = @{}
            foreach ($ext in $extensions) {
                $extensionMap[$ext.type] = $ext.name
            }
            if ($extensionMap.ContainsKey("MicrosoftMonitoringAgent")) {
                $extensionName = $extensionMap["MicrosoftMonitoringAgent"]
            }
            elseif ($extensionMap.ContainsKey("OmsAgentForLinux")) {
                $extensionName = $extensionMap["OmsAgentForLinux"]
            }
            if ($extensionName) {
                $amaExtensionInstalled = "False"
                if ($extensionMap.ContainsKey("AzureMonitorWindowsAgent") -or $extensionMap.ContainsKey("AzureMonitorLinuxAgent")) {
                    $amaExtensionInstalled = "True"
                }
                $csvObj = New-Object -TypeName PSObject -Property @{
                    'ResourceId'              = $resourceId
                    'Name'                    = $serverName
                    'Resource_Group'          = $resourceGroup
                    'Resource_Type'           = "ArcServer"
                    'Install_Type'            = "Extension"
                    'Extension_Name'          = $extensionName
                    'AMA_Extension_Installed' = $amaExtensionInstalled
                }
                $csvObj | Export-Csv $using:fileName -Append -Force | Out-Null
            }
            # az cli sometime cannot handle many requests at same time, so delaying next request by 2 milliseconds
            Start-Sleep -Milliseconds 2
        }
    }
}

function GetVmsWithLogAnalyticsAgentExtensionInstalled
{
    param(
        $fileName
    )
    
    $vmList = az vm list --query "[].{ResourceId:id, ResourceGroup:resourceGroup, VmName:name}" | ConvertFrom-Json
     
    if(!$vmList)
    {
        Write-Host "Cannot get the VM list"
        return
    }

    $vmsCount = $vmList.Length
    $vmParallelThrottleLimit = $parallelThrottleLimit
    if ($vmsCount -lt $vmParallelThrottleLimit) 
    {
        $vmParallelThrottleLimit = $vmsCount
    }

    if($vmsCount -eq 1)
    {
        $vmGroups += ,($vmList[0])
    }
    else
    {
        # split the vm's into batches to do parallel processing
        for ($i = 0; $i -lt $vmsCount; $i += $vmParallelThrottleLimit) 
        { 
            $vmGroups += , ($vmList[$i..($i + $vmParallelThrottleLimit - 1)]) 
        }
    }

    Write-Host "Detected $vmsCount Vm's in this subscription."
    $hash = [hashtable]::Synchronized(@{})
    $hash.One = 1

    $vmGroups | Foreach-Object -ThrottleLimit $parallelThrottleLimit -Parallel {
        $len = $using:vmsCount
        $hash = $using:hash
        $_ | ForEach-Object {
            $percent = 100 * $hash.One++ / $len
            Write-Progress -Activity "Getting VM extensions Inventory" -PercentComplete $percent
            $resourceId = $_.ResourceId
            $vmName = $_.VmName
            $resourceGroup = $_.ResourceGroup
            Write-Debug "Getting extensions for VM: $vmName"
            $extensions = az vm extension list -g $resourceGroup --vm-name $vmName --query "[?contains(['MicrosoftMonitoringAgent', 'OmsAgentForLinux', 'AzureMonitorLinuxAgent', 'AzureMonitorWindowsAgent'], typePropertiesType)].{type: typePropertiesType, name: name}" | ConvertFrom-Json
            
            if (!$extensions) {
                return
            }
            $extensionMap = @{}
            foreach ($ext in $extensions) {
                $extensionMap[$ext.type] = $ext.name
            }
            if ($extensionMap.ContainsKey("MicrosoftMonitoringAgent")) {
                $extensionName = $extensionMap["MicrosoftMonitoringAgent"]
            }
            elseif ($extensionMap.ContainsKey("OmsAgentForLinux")) {
                $extensionName = $extensionMap["OmsAgentForLinux"]
            }
            if ($extensionName) {
                $amaExtensionInstalled = "False"
                if ($extensionMap.ContainsKey("AzureMonitorWindowsAgent") -or $extensionMap.ContainsKey("AzureMonitorLinuxAgent")) {
                    $amaExtensionInstalled = "True"
                }
                $csvObj = New-Object -TypeName PSObject -Property @{
                    'ResourceId'              = $resourceId
                    'Name'                    = $vmName
                    'Resource_Group'          = $resourceGroup
                    'Resource_Type'           = "VM"
                    'Install_Type'            = "Extension"
                    'Extension_Name'          = $extensionName
                    'AMA_Extension_Installed' = $amaExtensionInstalled
                }
                $csvObj | Export-Csv $using:fileName -Append -Force | Out-Null
            }
            # az cli sometime cannot handle many requests at same time, so delaying next request by 2 milliseconds
            Start-Sleep -Milliseconds 2
        }
    }
}

function GetVmssWithLogAnalyticsAgentExtensionInstalled
{
    param(
        $fileName
    )

    # get the vmss list which are successfully provisioned
    $vmssList = az vmss list --query "[?provisioningState=='Succeeded'].{ResourceId:id, ResourceGroup:resourceGroup, VmssName:name}" | ConvertFrom-Json   

    $vmssCount = $vmssList.Length
    Write-Host "Detected $vmssCount Vmss in this subscription."
    $hash = [hashtable]::Synchronized(@{})
    $hash.One = 1

    $vmssList | Foreach-Object -ThrottleLimit $parallelThrottleLimit -Parallel {
        $len = $using:vmssCount
        $hash = $using:hash
        $percent = 100 * $hash.One++ / $len
        Write-Progress -Activity "Getting VMSS extensions Inventory" -PercentComplete $percent
        $resourceId = $_.ResourceId
        $vmssName = $_.VmssName
        $resourceGroup = $_.ResourceGroup
        Write-Debug "Getting extensions for VMSS: $vmssName"
        $extensions = az vmss extension list -g $resourceGroup --vmss-name $vmssName --query "[?contains(['MicrosoftMonitoringAgent', 'OmsAgentForLinux', 'AzureMonitorLinuxAgent', 'AzureMonitorWindowsAgent'], typePropertiesType)].{type: typePropertiesType, name: name}" | ConvertFrom-Json
        
        if (!$extensions) {
            return
        }
        $extensionMap = @{}
        foreach ($ext in $extensions) {
            $extensionMap[$ext.type] = $ext.name
        }
        if ($extensionMap.ContainsKey("MicrosoftMonitoringAgent")) {
            $extensionName = $extensionMap["MicrosoftMonitoringAgent"]
        }
        elseif ($extensionMap.ContainsKey("OmsAgentForLinux")) {
            $extensionName = $extensionMap["OmsAgentForLinux"]
        }
        if ($extensionName) {
            $amaExtensionInstalled = "False"
            if ($extensionMap.ContainsKey("AzureMonitorWindowsAgent") -or $extensionMap.ContainsKey("AzureMonitorLinuxAgent")) {
                $amaExtensionInstalled = "True"
            }
            $csvObj = New-Object -TypeName PSObject -Property @{
                'ResourceId'              = $resourceId
                'Name'                    = $vmssName
                'Resource_Group'          = $resourceGroup
                'Resource_Type'           = "VMSS"
                'Install_Type'            = "Extension"
                'Extension_Name'          = $extensionName
                'AMA_Extension_Installed' = $amaExtensionInstalled
            }
            $csvObj | Export-Csv $using:fileName -Append -Force | Out-Null
        }
        # az cli sometime cannot handle many requests at same time, so delaying next request by 2 milliseconds
        Start-Sleep -Milliseconds 2
    }
}

function GetInventory
{
    param(
        $fileName = "LogAnalyticsAgentExtensionInventory.csv"
    )

    # create a new file 
    New-Item -Name $fileName -ItemType File -Force

    Start-Transcript -Path $logFileName -Append
    GetVmsWithLogAnalyticsAgentExtensionInstalled $fileName
    GetVmssWithLogAnalyticsAgentExtensionInstalled $fileName
    GetArcServersWithLogAnalyticsAgentExtensionInstalled $fileName
    Stop-Transcript
}

function UninstallExtension
{
    param(
        $fileName = "LogAnalyticsAgentExtensionInventory.csv"
    )
    Start-Transcript -Path $logFileName -Append
    Import-Csv $fileName | ForEach-Object -ThrottleLimit $parallelThrottleLimit -Parallel {
        if ($_.Install_Type -eq "Extension") 
        {
            $extensionName = $_.Extension_Name
            $resourceName = $_.Name
            Write-Debug "Uninstalling extension: $extensionName from $resourceName"
            if ($_.Resource_Type -eq "VMSS") 
            {
                # if the extension is installed with a custom name, provide the name using the flag: --extension-instance-name <extension name>
                az vmss extension delete --name $extensionName --vmss-name $resourceName --resource-group $_.Resource_Group --output none --no-wait
            }
            elseif($_.Resource_Type -eq "VM")
            {
                # if the extension is installed with a custom name, provide the name using the flag: --extension-instance-name <extension name>
                az vm extension delete --name $extensionName --vm-name $resourceName --resource-group $_.Resource_Group --output none --no-wait
            }
            elseif($_.Resource_Type -eq "ArcServer")
            {
                az connectedmachine extension delete --name $extensionName --machine-name $resourceName --resource-group $_.Resource_Group --no-wait --output none --yes -y
            }
            # az cli sometime cannot handle many requests at same time, so delaying next delete request by 2 milliseconds
            Start-Sleep -Milliseconds 2
        }
    }
    Stop-Transcript
}

$logFileName = "LogAnalyticsAgentUninstallUtilityScriptLog.log"

switch ($args.Count)
{
    0 {
        Write-Host "The arguments provided are incorrect."
        Write-Host "To get the Inventory: Run the script as: PS> .\LogAnalyticsAgentUninstallUtilityScript.ps1 GetInventory"
        Write-Host "To uninstall MMA/OMS from Inventory: Run the script as: PS> .\LogAnalyticsAgentUninstallUtilityScript.ps1 UninstallExtension"
    }
    1 {
        if (-Not (Test-Path $logFileName)) {
            New-Item -Path $logFileName -ItemType File
        }
        $funcname = $args[0]
        Invoke-Expression "& $funcname"
    }
    2 {
        if (-Not (Test-Path $logFileName)) {
            New-Item -Path $logFileName -ItemType File
        }
        $funcname = $args[0]
        $funcargs = $args[1]
        Invoke-Expression "& $funcname $funcargs"
    }
}

   ```

## Step 3 Get inventory
You'll  collect a list of all legacy agents, both MMA and OMS, on all VM, VMSSs and Arc enabled server in the subscription. You'll run the script you downloaded an inventory of legacy agents in your subscription.
   ``` PowerShell
   .\MMAUnistallUtilityScript.ps1 GetInventory
   ```
The script reports the total VM, VMSSs, or Arc enables servers seen in the subscription. It takes several minutes to run. You see a progress bar in the console window. Once complete, you are able to see a CSV file called MMAInventory.csv in the local directory with the following format.

| Resource_ID | Name | Resource_Group | Resource_Type | Install_Type | Extension_Name | AMA_Extension_Installed |  
|---|---|---|---|---|---|---|
| 012cb5cf-e1a8-49ee-a484-d40673167c9c | Linux-ama-e2e-debian9  | Linux-AMA-E2E           | VM  | Extension | OmsAgentForLinux      | True  |
| 012cb5cf-e1a8-49ee-a484-d40673167c9c | test2012-r2-da         | test2012-r2-daAMA-ADMIN | VM  | Extension | MicrosoftMonitorAgent | False |

## Step 4 Uninstall inventory
This script iterates through the list of VM, Virtual Machine Scale Sets, and Arc enabled servers and uninstalls the legacy agent. If the VM, Virtual Machine Scale Sets, or Arc enabled server is not running you won't be able to remove the agent. 
   ``` PowerShell
   .\MMAUnistallUtilityScript.ps1 UninstallMMAExtension
   ```
Once the script is complete you'll be able to see the removal status for your VM, Virtual Machine Scale Sets, and Arc enabled servers in the MMAInventory.csv file.

