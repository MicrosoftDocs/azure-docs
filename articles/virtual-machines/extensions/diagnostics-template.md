---
title: Add monitoring & diagnostics to an Azure virtual machine | Microsoft Docs
description: Use an Azure Resource Manager template to create a new Windows virtual machine with Azure diagnostics extension.
services: virtual-machines-windows
documentationcenter: ''
author: sbtron
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.assetid: 8cde8fe7-977b-43d2-be74-ad46dc946058
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 05/31/2017
ms.author: saurabh
ms.custom: H1Hack27Feb2017

---
# Use monitoring and diagnostics with a Windows VM and Azure Resource Manager templates
The Azure Diagnostics Extension provides the monitoring and diagnostics capabilities on a Windows-based Azure virtual machine. You can enable these capabilities on the virtual machine by including the extension as part of the Azure Resource Manager template. See [Authoring Azure Resource Manager Templates with VM Extensions](../windows/template-description.md#extensions) for more information on including any extension as part of a virtual machine template. This article describes how you can add the Azure Diagnostics extension to a windows virtual machine template.  

## Add the Azure Diagnostics extension to the VM resource definition
To enable the diagnostics extension on a Windows Virtual Machine, you need to add the extension as a VM resource in the Resource Manager template.

For a simple Resource Manager based Virtual Machine add the extension configuration to the *resources* array for the Virtual Machine: 

```json
"resources": [
    {
        "name": "Microsoft.Insights.VMDiagnosticsSettings",
        "type": "extensions",
        "location": "[resourceGroup().location]",
        "apiVersion": "2015-06-15",
        "dependsOn": [
            "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]"
        ],
        "tags": {
            "displayName": "AzureDiagnostics"
        },
        "properties": {
            "publisher": "Microsoft.Azure.Diagnostics",
            "type": "IaaSDiagnostics",
            "typeHandlerVersion": "1.5",
            "autoUpgradeMinorVersion": true,
            "settings": {
                "xmlCfg": "[base64(concat(variables('wadcfgxstart'), variables('wadmetricsresourceid'), variables('vmName'), variables('wadcfgxend')))]",
                "storageAccount": "[parameters('existingdiagnosticsStorageAccountName')]"
            },
            "protectedSettings": {
                "storageAccountName": "[parameters('existingdiagnosticsStorageAccountName')]",
                "storageAccountKey": "[listkeys(variables('accountid'), '2015-05-01-preview').key1]",
                "storageAccountEndPoint": "https://core.windows.net"
            }
        }
    }
]
```

Another common convention is to add the extension configuration at the root resources node of the template instead of defining it under the virtual machine's resources node. With this approach, you have to explicitly specify a hierarchical relation between the extension and the virtual machine with the *name* and *type* values. For example: 

```json
"name": "[concat(variables('vmName'),'Microsoft.Insights.VMDiagnosticsSettings')]",
"type": "Microsoft.Compute/virtualMachines/extensions",
```

The extension is always associated with the virtual machine, you can either directly define it under the virtual machine's resource node directly or define it at the base level and use the hierarchical naming convention to associate it with the virtual machine.

For Virtual Machine Scale Sets the extensions configuration is specified in the *extensionProfile* property of the *VirtualMachineProfile*.

The *publisher* property with the value of **Microsoft.Azure.Diagnostics** and the *type* property with the value of **IaaSDiagnostics** uniquely identify the Azure Diagnostics extension.

The value of the *name* property can be used to refer to the extension in the resource group. Setting it specifically to **Microsoft.Insights.VMDiagnosticsSettings** enables it to be easily identified by the Azure portal ensuring that the monitoring charts show up correctly in the Azure portal.

The *typeHandlerVersion* specifies the version of the extension you would like to use. Setting *autoUpgradeMinorVersion* minor version to **true** ensures that you get the latest Minor version of the extension that is available. It is highly recommended that you always set *autoUpgradeMinorVersion* to always be **true** so that you always get to use the latest available diagnostics extension with all the new features and bug fixes. 

The *settings* element contains configurations properties for the extension that can be set and read back from the extension (sometimes referred to as public configuration). The *xmlcfg* property contains xml based configuration for the diagnostics logs, performance counters etc that are collected by the diagnostics agent. See [Diagnostics Configuration Schema](https://msdn.microsoft.com/library/azure/dn782207.aspx) for more information about the xml schema itself. A common practice is to store the actual xml configuration as a variable in the Azure Resource Manager template and then concatenate and base64 encode them to set the value for *xmlcfg*. See the section on [diagnostics configuration variables](#diagnostics-configuration-variables) to understand more about how to store the xml in variables. The *storageAccount* property specifies the name of the storage account to which diagnostics data is transferred. 

The properties in *protectedSettings* (sometimes referred to as private configuration) can be set but cannot be read back after being set. The write-only nature of *protectedSettings* makes it useful for storing secrets like the storage account key where the diagnostics data is written.    

## Specifying diagnostics storage account as parameters
The diagnostics extension json snippet above assumes two parameters *existingdiagnosticsStorageAccountName* and
*existingdiagnosticsStorageResourceGroup* to specify the diagnostics storage account where diagnostics data is stored. Specifying the diagnostics storage account as a parameter makes it easy to change the diagnostics storage account across different environments, for example you may want to use a different diagnostics storage account for testing and a different one for your production deployment.  

```json
"existingdiagnosticsStorageAccountName": {
    "type": "string",
    "metadata": {
"description": "The name of an existing storage account to which diagnostics data is transfered."
    }
},
"existingdiagnosticsStorageResourceGroup": {
    "type": "string",
    "metadata": {
"description": "The resource group for the storage account specified in existingdiagnosticsStorageAccountName"
    }
}
```

It is best practice to specify a diagnostics storage account in a different resource group than the resource group for the virtual machine. A resource group can be considered to be a deployment unit with its own lifetime, a virtual machine can be deployed and redeployed as new configurations updates are made it to it but you may want to continue storing the diagnostics data in the same storage account across those virtual machine deployments. Having the storage account in a different resource enables the storage account to accept data from various virtual machine deployments making it easy to troubleshoot issues across the various versions.

> [!NOTE]
> If you create a windows virtual machine template from Visual Studio, the default storage account might be set to use the same storage account where the virtual machine VHD is uploaded. This is to simplify initial setup of the VM. Re-factor the template to use a different storage account that can be passed in as a parameter. 
> 
> 

## Diagnostics configuration variables
The preceding diagnostics extension json snippet defines an *accountid* variable to simplify getting the storage account key for the diagnostics storage:   

```json
"accountid": "[concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/',parameters('existingdiagnosticsStorageResourceGroup'), '/providers/','Microsoft.Storage/storageAccounts/', parameters('existingdiagnosticsStorageAccountName'))]"
```

The *xmlcfg* property for the diagnostics extension is defined using multiple variables that are concatenated together. The values of these variables are in xml so they need to be escaped correctly when setting the json variables.

The following example describes the diagnostics configuration xml that collects standard system level performance counters along with some windows event logs and diagnostics infrastructure logs. It has been escaped and formatted correctly so that the configuration can directly be pasted into the variables section of your template. See the [Diagnostics Configuration Schema](https://msdn.microsoft.com/library/azure/dn782207.aspx) for a more human readable example of the configuration xml.

```json
"wadlogs": "<WadCfg> <DiagnosticMonitorConfiguration overallQuotaInMB=\"4096\" xmlns=\"http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration\"> <DiagnosticInfrastructureLogs scheduledTransferLogLevelFilter=\"Error\"/> <WindowsEventLog scheduledTransferPeriod=\"PT1M\" > <DataSource name=\"Application!*[System[(Level = 1 or Level = 2)]]\" /> <DataSource name=\"Security!*[System[(Level = 1 or Level = 2)]]\" /> <DataSource name=\"System!*[System[(Level = 1 or Level = 2)]]\" /></WindowsEventLog>",
"wadperfcounters1": "<PerformanceCounters scheduledTransferPeriod=\"PT1M\"><PerformanceCounterConfiguration counterSpecifier=\"\\Processor(_Total)\\% Processor Time\" sampleRate=\"PT15S\" unit=\"Percent\"><annotation displayName=\"CPU utilization\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\Processor(_Total)\\% Privileged Time\" sampleRate=\"PT15S\" unit=\"Percent\"><annotation displayName=\"CPU privileged time\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\Processor(_Total)\\% User Time\" sampleRate=\"PT15S\" unit=\"Percent\"><annotation displayName=\"CPU user time\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\Processor Information(_Total)\\Processor Frequency\" sampleRate=\"PT15S\" unit=\"Count\"><annotation displayName=\"CPU frequency\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\System\\Processes\" sampleRate=\"PT15S\" unit=\"Count\"><annotation displayName=\"Processes\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\Process(_Total)\\Thread Count\" sampleRate=\"PT15S\" unit=\"Count\"><annotation displayName=\"Threads\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\Process(_Total)\\Handle Count\" sampleRate=\"PT15S\" unit=\"Count\"><annotation displayName=\"Handles\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\Memory\\% Committed Bytes In Use\" sampleRate=\"PT15S\" unit=\"Percent\"><annotation displayName=\"Memory usage\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\Memory\\Available Bytes\" sampleRate=\"PT15S\" unit=\"Bytes\"><annotation displayName=\"Memory available\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\Memory\\Committed Bytes\" sampleRate=\"PT15S\" unit=\"Bytes\"><annotation displayName=\"Memory committed\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\Memory\\Commit Limit\" sampleRate=\"PT15S\" unit=\"Bytes\"><annotation displayName=\"Memory commit limit\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\PhysicalDisk(_Total)\\% Disk Time\" sampleRate=\"PT15S\" unit=\"Percent\"><annotation displayName=\"Disk active time\" locale=\"en-us\"/></PerformanceCounterConfiguration>",
"wadperfcounters2": "<PerformanceCounterConfiguration counterSpecifier=\"\\PhysicalDisk(_Total)\\% Disk Read Time\" sampleRate=\"PT15S\" unit=\"Percent\"><annotation displayName=\"Disk active read time\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\PhysicalDisk(_Total)\\% Disk Write Time\" sampleRate=\"PT15S\" unit=\"Percent\"><annotation displayName=\"Disk active write time\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\PhysicalDisk(_Total)\\Disk Transfers/sec\" sampleRate=\"PT15S\" unit=\"CountPerSecond\"><annotation displayName=\"Disk operations\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\PhysicalDisk(_Total)\\Disk Reads/sec\" sampleRate=\"PT15S\" unit=\"CountPerSecond\"><annotation displayName=\"Disk read operations\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\PhysicalDisk(_Total)\\Disk Writes/sec\" sampleRate=\"PT15S\" unit=\"CountPerSecond\"><annotation displayName=\"Disk write operations\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\PhysicalDisk(_Total)\\Disk Bytes/sec\" sampleRate=\"PT15S\" unit=\"BytesPerSecond\"><annotation displayName=\"Disk speed\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\PhysicalDisk(_Total)\\Disk Read Bytes/sec\" sampleRate=\"PT15S\" unit=\"BytesPerSecond\"><annotation displayName=\"Disk read speed\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\PhysicalDisk(_Total)\\Disk Write Bytes/sec\" sampleRate=\"PT15S\" unit=\"BytesPerSecond\"><annotation displayName=\"Disk write speed\" locale=\"en-us\"/></PerformanceCounterConfiguration><PerformanceCounterConfiguration counterSpecifier=\"\\LogicalDisk(_Total)\\% Free Space\" sampleRate=\"PT15S\" unit=\"Percent\"><annotation displayName=\"Disk free space (percentage)\" locale=\"en-us\"/></PerformanceCounterConfiguration></PerformanceCounters>",
"wadcfgxstart": "[concat(variables('wadlogs'), variables('wadperfcounters1'), variables('wadperfcounters2'), '<Metrics resourceId=\"')]",
"wadmetricsresourceid": "[concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', resourceGroup().name , '/providers/', 'Microsoft.Compute/virtualMachines/')]",
"wadcfgxend": "\"><MetricAggregation scheduledTransferPeriod=\"PT1H\"/><MetricAggregation scheduledTransferPeriod=\"PT1M\"/></Metrics></DiagnosticMonitorConfiguration></WadCfg>"
```

The Metrics definition xml node in the above configuration is an important configuration element as it defines how the performance counters defined earlier in the xml in *PerformanceCounter* node are aggregated and stored. 

> [!IMPORTANT]
> These metrics drive the monitoring charts and alerts in the Azure portal.  The **Metrics** node with the *resourceID* and **MetricAggregation** must be included in the diagnostics configuration for your VM if you want to see the VM monitoring data in the Azure portal. 
> 
> 

The following example shows the xml for metrics definitions: 

```xml
<Metrics resourceId="/subscriptions/subscription().subscriptionId/resourceGroups/resourceGroup().name/providers/Microsoft.Compute/virtualMachines/vmName">
    <MetricAggregation scheduledTransferPeriod="PT1H"/>
    <MetricAggregation scheduledTransferPeriod="PT1M"/>
</Metrics>
```

The *resourceID* attribute uniquely identifies the virtual machine in your subscription. Make sure to use the subscription() and resourceGroup() functions so that the template automatically updates those values based on the subscription and resource group you are deploying to.

If you are creating multiple Virtual Machines in a loop, you have to populate the *resourceID* value with an copyIndex() function to correctly differentiate each individual VM. The *xmlCfg* value can be updated to support this as follows:  

```json
"xmlCfg": "[base64(concat(variables('wadcfgxstart'), variables('wadmetricsresourceid'), concat(parameters('vmNamePrefix'), copyindex()), variables('wadcfgxend')))]", 
```

The MetricAggregation value of *PT1M* and *PT1H* signify an aggregation over a minute and an aggregation over an hour, respectively.

## WADMetrics tables in storage
The Metrics configuration above generates tables in your diagnostics storage account with the following naming conventions:

* **WADMetrics**: Standard prefix for all WADMetrics tables
* **PT1H** or **PT1M**: Signifies that the table contains aggregate data over 1 hour or 1 minute
* **P10D**: Signifies the table will contain data for 10 days from when the table started collecting data
* **V2S**: String constant
* **yyyymmdd**: The date at which the table started collecting data

Example: *WADMetricsPT1HP10DV2S20151108* contains metrics data aggregated over an hour for 10 days starting on 11-Nov-2015    

Each WADMetrics table contains the following columns:

* **PartitionKey**: The partition key is constructed based on the *resourceID* value to uniquely identify the VM resource. For example: `002Fsubscriptions:<subscriptionID>:002FresourceGroups:002F<ResourceGroupName>:002Fproviders:002FMicrosoft:002ECompute:002FvirtualMachines:002F<vmName>`  
* **RowKey**: Follows the format `<Descending time tick>:<Performance Counter Name>`. The descending time tick calculation is max time ticks minus the time of the beginning of the aggregation period. For example if the sample period started on 10-Nov-2015 and 00:00Hrs UTC then the calculation would be: `DateTime.MaxValue.Ticks - (new DateTime(2015,11,10,0,0,0,DateTimeKind.Utc).Ticks)`. For the memory available bytes performance counter the row key will look like: `2519551871999999999__:005CMemory:005CAvailable:0020Bytes`
* **CounterName**: Is the name of the performance counter. This matches the *counterSpecifier* defined in the xml config.
* **Maximum**: The maximum value of the performance counter over the aggregation period.
* **Minimum**: The minimum value of the performance counter over the aggregation period.
* **Total**: The sum of all values of the performance counter reported over the aggregation period.
* **Count**: The total number of values reported for the performance counter.
* **Average**: The average (total/count) value of the performance counter over the aggregation period.

## Next Steps
* For a complete sample template of a Windows virtual machine with diagnostics extension, see [201-vm-monitoring-diagnostics-extension](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-monitoring-diagnostics-extension)   
* Deploy the Azure Resource Manager template using [Azure PowerShell](../windows/ps-template.md) or [Azure Command Line](../linux/create-ssh-secured-vm-from-template.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
* Learn more about [authoring Azure Resource Manager templates](../../resource-group-authoring-templates.md)
