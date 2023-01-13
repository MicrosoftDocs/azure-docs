---
title: Use Application Health extension with Azure Virtual Machine Scale Sets
description: Learn how to use the Application Health extension to monitor the health of your applications deployed on Virtual Machine Scale Sets.
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: extensions
ms.date: 01/10/2023
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-azurepowershell

---
# Using Application Health extension with Virtual Machine Scale Sets

Monitoring your application health is an important signal for managing and upgrading your deployment. Azure Virtual Machine Scale Sets provide support for [Rolling Upgrades](virtual-machine-scale-sets-upgrade-scale-set.md#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model) including [Automatic OS-Image Upgrades](virtual-machine-scale-sets-automatic-upgrade.md) and [Automatic VM Guest Patching](https://learn.microsoft.com/azure/virtual-machines/automatic-vm-guest-patching), which rely on health monitoring of the individual instances to upgrade your deployment. You can also use Application Health Extension to monitor the application health of each instance in your scale set and perform instance repairs using [Automatic Instance Repairs](virtual-machine-scale-sets-automatic-instance-repairs.md).

This article describes how you can use the two types of Application Health extension, **Binary Health States** or **Rich Health States**, to monitor the health of your applications deployed on Virtual Machine Scale Sets.

## Prerequisites

This article assumes that you are familiar with:
-	Azure virtual machine [extensions](../virtual-machines/extensions/overview.md)
-	[Modifying](virtual-machine-scale-sets-upgrade-scale-set.md) Virtual Machine Scale Sets

> [!IMPORTANT]
> Application Health Extension expects to receive a consistent probe response at the configured port `tcp` or request path `http/https` in order to label a VM as *Healthy*. If no application is running on the VM, or you're unable to configure a probe response, your VM is going to show up as *Unhealthy*.

## When to use the Application Health extension

The Application Health extension is deployed inside a Virtual Machine Scale Set instance and reports on VM health from inside the scale set instance. You can configure the extension to probe on an application endpoint and update the status of the application on that instance. This instance status is checked by Azure to determine whether an instance is eligible for upgrade operations.

The Application Health Extension is deployed inside a virtual machine scale set instance and reports on application health from inside the scale set instance. The extension probes on a local application endpoint and will update the health status based on TCP/HTTP(S) responses received from the application. This health status is used by Azure to initiate repairs on unhealthy instances and to determine if an instance is eligible for upgrade operations. 

The extension reports health from within a VM and can be used in situations where an external probe such as the [Azure Load Balancer health probes](../load-balancer/load-balancer-custom-probe-overview.md) can’t be used.  

## Binary versus Rich health states

Application Health Extensions has two options available: **Binary Health States** and **Rich Health States**. The following table highlights some key differences between the two options. See the end of this section for general recommendations.

| Features | Binary Health States | Rich Health States |
| -------- | -------------------- | ------------------ |
| Available Health States | 2 available states: *Healthy*, *Unhealthy* | 4 available states: *Healthy*, *Unhealthy*, *Initializing*, *Unknown*<sup>1</sup> |
| Sending Health Signals | Health signals are sent through HTTP/HTTPS response codes or TCP connections. | Health signals on HTTP/HTTPS protocol are sent through the probe response code and response body. Health signals through TCP protocol remain unchanged from Binary Health States. |
| Identifying “Unhealthy” Instances | Instances will automatically fall into *Unhealthy* state if a *Healthy* signal is not received from the application. An *Unhealthy* instance can indicate either an issue with the extension configuration (e.g. unreachable endpoint) or an issue with the application (e.g. non-2xx status code). | Instances will only go into an *Unhealthy* state if the application emits an *Unhealthy* probe response. Users are responsible for implementing custom logic to identify and flag instances with *Unhealthy* applications<sup>2</sup>. Instances with incorrect extension settings (e.g. unreachable endpoint) or invalid health probe responses will fall under the *Unknown* state<sup>2</sup>. |
| *Initializing* state for newly created instances | *Initializing* state is not available. Newly created instances may take some time before settling into a steady state. | *Initializing* state allows newly created instances to settle into a steady health state before making the instance eligible for rolling upgrades or instance repair operations. |
| HTTP/HTTPS protocol | Supported | Supported |
| TCP protocol | Supported | Limited Support – *Unknown* state is unavailable on TCP protocol. See [Link to Rich Health States > TCP protocol table] for health state behaviors on TCP. |

<sup>1</sup> The *Unknown* state is unavailable on TCP protocol. 
<sup>2</sup> Only applicable for HTTP/HTTPS protocol. TCP protocol will follow the same process of identifying *Unhealthy* instances as in Binary Health States. 

In general, you should use **Binary Health States** if:
- You are not interested in configuring custom logic to identify and flag an unhealthy instance 
- You do not require an *initializing* grace period for newly created instances

You should use **Rich Health States** if:
- You send health signals through HTTP/HTTPS protocol and can submit health information through the probe response body 
- You would like to use custom logic to identify and mark unhealthy instances 
- You would like to set an *initializing* grace period for newly created instances to settle into a steady health state before making the instance eligible for rolling upgrade or instance repairs.

## Binary health states

Binary health state reporting contains two health states, *Healthy* and *Unhealthy*. The following tables provide a brief description for how the health states are configured. 

**HTTP/HTTPS Protocol**
| Protocol | Health state | Description |
| -------- | ------------ | ----------- |
| http/https | Healthy | To send a *Healthy* signal, the application is expected to return a 2xx response code. |
| http/https | Unhealthy | The instance will be marked as *Unhealthy* if a 2xx response code is not received from the application. |

**TCP Protocol**
| Protocol | Health state | Description |
| -------- | ------------ | ----------- |
| TCP | Healthy | To send a *Healthy* signal, a successful handshake must be made with the provided application endpoint. |
| TCP | Unhealthy | The instance will be marked as *Unhealthy* if a failed or incomplete handshake occurred with the provided application endpoint. |

Some scenarios that may result in an *Unhealthy* state include: 
- When the application endpoint returns a non-2xx status code 
- When there's no application endpoint configured inside the virtual machine instances to provide application health status 
- When the application endpoint is incorrectly configured 
- When the application endpoint isn't reachable 

## Rich health states 

Rich health states reporting contains four health states, *Initializing*, *Healthy*, *Unhealthy*, and *Unknown*. The following tables provide a brief description for how each health state is configured. 

**HTTP/HTTPS Protocol**
| Protocol | Health state | Description |
| -------- | ------------ | ----------- |
| http/https | Healthy | To send a *Healthy* signal, the application is expected to return a probe response with the following: **Probe Response Code**: Status 2xx, Probe Response Body: `{"ApplicationHealthState": "Healthy"}` |
| http/https | Unhealthy | To send a *Unhealthy* signal, the application is expected to return a probe response with the following: **Probe Response Code**: Status 2xx, Probe Response Body: `{"ApplicationHealthState": "Unhealthy"}` |
| http/https | Initializing | The instance automatically enters an *Initializing* state at extension start time. For more details, see [link to “Initializing” state section]. |
| http/https | Unknown | An *Unknown* state may occur in the following scenarios: when a non-2xx status code is returned by the application, when the probe request times out, when the application endpoint is unreachable or incorrectly configured, when a missing or invalid value is provided for `ApplicationHealthState` in the response body, or when the grace period expires. For more details, see [link to “Unknown” state section]. |

**TCP Protocol**
| Protocol | Health state | Description |
| -------- | ------------ | ----------- |
| TCP | Healthy | To send a *Healthy* signal, a successful handshake must be made with the provided application endpoint. |
| TCP | Unhealthy | The instance will be marked as *Unhealthy* if a failed or incomplete handshake occurred with the provided application endpoint. |
| TCP | Unhealthy | The instance automatically enters an *Initializing* state at extension start time. For more details, see [link to “Initializing” state section]. | 

## Initializing state

This state only applies to Rich Health States. The *Initializing* state only occurs once at extension start time and can be configured by the extension settings `gracePeriod` and `numberOfProbes`.  

At extension startup, the application health will remain in the *Initializing* state until one of two scenarios occur: 
- The same health state (*Healthy* or *Unhealthy*) is reported a consecutive number of times as configured through *numberOfProbes*
- The `gracePeriod` expires 

If the same health state (*Healthy* or *Unhealthy*) is reported consecutively, the application health will transition out of the *Initializing* state and into the reported health state (*Healthy* or *Unhealthy*). 

### Example

If `numberOfProbes` = 3, that would mean:
- To transition from *Initializing* to *Healthy* state: Application health extension must receive three consecutive *Healthy* signals via HTTP/HTTPS or TCP protocol 
- To transition from *Initializing* to *Unhealthy* state: Application health extension must receive three consecutive *Unhealthy* signals via HTTP/HTTPS or TCP protocol  

If the `gracePeriod` expires before a consecutive health status is reported by the application, the instance health will be determined as follows: 
- HTTP/HTTPS protocol: The application health will transition from *Initializing* to *Unknown*  
- TCP protocol: The application health will transition from *Initializing* to *Unhealthy* 

## Unknown state 

This state only applies to Rich Health States. The *Unknown* state is only reported for *http* or *https* probes and occurs in the following scenarios: 
- When a non-2xx status code is returned by the application  
- When the probe request times out  
- When the application endpoint is unreachable or incorrectly configured 
- When a missing or invalid value is provided for `ApplicationHealthState` in the response body 
- When the grace period expires  

An instance in an *Unknown* state is treated similar to an *Unhealthy* instance. If enabled, instance repairs will be carried out on an *Unknown* instance while rolling upgrades will be paused until the instance falls back into a *Healthy* state.

The following table shows the health status interpretation for [Rolling Upgrades](virtual-machine-scale-sets-upgrade-scale-set.md#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model) and [Instance Repairs](virtual-machine-scale-sets-automatic-instance-repairs.md): 

| Health state | Rolling Upgrade interpretation | Instance Repairs trigger |
| ------------ | ------------------------------ | ------------------------ |
| Initializing | Wait for the state to be in *Healthy*, *Unhealthy*, or *Unknown* | No |
| Healthy | Healthy | No |
| Unhealthy | Unhealthy | Yes |
|unknown | Unhealthy | Yes |


## Extension schema

The following JSON shows the schema for the Application Health extension. The extension requires at a minimum either a "tcp", "http" or "https" request with an associated port or request path respectively.

```json
{
  "type": "extensions",
  "name": "HealthExtension",
  "apiVersion": "2018-10-01",
  "location": "<location>",  
  "properties": {
    "publisher": "Microsoft.ManagedServices",
    "type": "<ApplicationHealthLinux or ApplicationHealthWindows>",
    "autoUpgradeMinorVersion": true,
    "typeHandlerVersion": "1.0",
    "settings": {
      "protocol": "<protocol>",
      "port": "<port>",
      "requestPath": "</requestPath>",
      "intervalInSeconds": "5.0",
      "numberOfProbes": "1.0"
    }
  }
}  
```

### Property values

| Name | Value / Example | Data Type
| ---- | ---- | ---- 
| apiVersion | `2018-10-01` | date |
| publisher | `Microsoft.ManagedServices` | string |
| type | `ApplicationHealthLinux` (Linux), `ApplicationHealthWindows` (Windows) | string |
| typeHandlerVersion | `1.0` | int |

### Settings

| Name | Value / Example | Data Type
| ---- | ---- | ----
| protocol | `http` or `https` or `tcp` | string |
| port | Optional when protocol is `http` or `https`, mandatory when protocol is `tcp` | int |
| requestPath | Mandatory when protocol is `http` or `https`, not allowed when protocol is `tcp` | string |

## Deploy the Application Health extension
There are multiple ways of deploying the Application Health extension to your scale sets as detailed in the examples below.

### REST API

The following example adds the Application Health extension (with name myHealthExtension) to the extensionProfile in the scale set model of a Windows-based scale set.

```
PUT on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/extensions/myHealthExtension?api-version=2018-10-01`
```

```json
{
  "name": "myHealthExtension",
  "properties": {
    "publisher": "Microsoft.ManagedServices",
    "type": "ApplicationHealthWindows",
    "autoUpgradeMinorVersion": true,
    "typeHandlerVersion": "1.0",
    "settings": {
      "protocol": "<protocol>",
      "port": "<port>",
      "requestPath": "</requestPath>"
    }
  }
}
```
Use `PATCH` to edit an already deployed extension.

### Azure PowerShell

Use the [Add-AzVmssExtension](/powershell/module/az.compute/add-azvmssextension) cmdlet to add the Application Health extension to the scale set model definition.

The following example adds the Application Health extension to the `extensionProfile` in the scale set model of a Windows-based scale set. The example uses the new Az PowerShell module.

```azurepowershell-interactive
# Define the scale set variables
$vmScaleSetName = "myVMScaleSet"
$vmScaleSetResourceGroup = "myVMScaleSetResourceGroup"

# Define the Application Health extension properties
$publicConfig = @{"protocol" = "http"; "port" = 80; "requestPath" = "/healthEndpoint"};
$extensionName = "myHealthExtension"
$extensionType = "ApplicationHealthWindows"
$publisher = "Microsoft.ManagedServices"

# Get the scale set object
$vmScaleSet = Get-AzVmss `
  -ResourceGroupName $vmScaleSetResourceGroup `
  -VMScaleSetName $vmScaleSetName

# Add the Application Health extension to the scale set model
Add-AzVmssExtension -VirtualMachineScaleSet $vmScaleSet `
  -Name $extensionName `
  -Publisher $publisher `
  -Setting $publicConfig `
  -Type $extensionType `
  -TypeHandlerVersion "1.0" `
  -AutoUpgradeMinorVersion $True

# Update the scale set
Update-AzVmss -ResourceGroupName $vmScaleSetResourceGroup `
  -Name $vmScaleSetName `
  -VirtualMachineScaleSet $vmScaleSet
```


### Azure CLI 2.0

Use [az vmss extension set](/cli/azure/vmss/extension#az-vmss-extension-set) to add the Application Health extension to the scale set model definition.

The following example adds the Application Health extension to the scale set model of a Linux-based scale set.

```azurecli-interactive
az vmss extension set \
  --name ApplicationHealthLinux \
  --publisher Microsoft.ManagedServices \
  --version 1.0 \
  --resource-group <myVMScaleSetResourceGroup> \
  --vmss-name <myVMScaleSet> \
  --settings ./extension.json
```
The extension.json file content.

```json
{
  "protocol": "<protocol>",
  "port": "<port>",
  "requestPath": "</requestPath>"
}
```


## Troubleshoot
Extension execution output is logged to files found in the following directories:

```Windows
C:\WindowsAzure\Logs\Plugins\Microsoft.ManagedServices.ApplicationHealthWindows\<version>\
```

```Linux
/var/lib/waagent/Microsoft.ManagedServices.ApplicationHealthLinux-<extension_version>/status
/var/log/azure/applicationhealth-extension
```

The logs also periodically capture the application health status.

## Next steps
Learn how to [deploy your application](virtual-machine-scale-sets-deploy-app.md) on Virtual Machine Scale Sets.
