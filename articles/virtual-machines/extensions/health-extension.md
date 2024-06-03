---
title: Use Application Health extension with Azure Virtual Machines
description: Learn how to use the Application Health extension to monitor the health of your applications deployed on Azure virtual machines.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.author: hilarywang
author: hilaryw29
ms.date: 12/15/2023
---

# Using Application Health extension with Azure Virtual Machines
Monitoring your application health is an important signal for managing your VMs. Azure Virtual Machines provides support for [Automatic VM Guest Patching](../automatic-vm-guest-patching.md), which rely on health monitoring of the individual instances to safely update your VMs. 

This article describes how you can use the two types of Application Health extension, **Binary Health States** or **Rich Health States**, to monitor the health of your applications deployed on Azure virtual machines.

Application health monitoring is also available on virtual machine scale sets and helps enable functionalities such as [Rolling Upgrades](../../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy.md), [Automatic OS-Image Upgrades](../../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md), and [Automatic Instance Repairs](../../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-instance-repairs.md). To experience these capabilities with the added benefits of scale, availability, and flexibility on scale sets, you can [attach your VM to an existing scale set](../../virtual-machine-scale-sets/virtual-machine-scale-sets-attach-detach-vm.md) or [create a new scale set](../../virtual-machine-scale-sets/flexible-virtual-machine-scale-sets-portal.md).

## Prerequisites

This article assumes that you're familiar with [Azure virtual machine extensions](overview.md).

> [!CAUTION]
> Application Health Extension expects to receive a consistent probe response at the configured port `tcp` or request path `http/https` in order to label a VM as *Healthy*. If no application is running on the VM, or you're unable to configure a probe response, your VM is going to show up as *Unhealthy* (Binary Health States) or *Unknown* (Rich Health States).

## When to use the Application Health extension
Application Health Extension reports on application health from inside the Virtual Machine. The extension probes on a local application endpoint and updates the health status based on TCP/HTTP(S) responses received from the application. This health status is used by Azure to monitor and detect patching failures during [Automatic VM Guest Patching](../automatic-vm-guest-patching.md).

The extension reports health from within a VM and can be used in situations where an external probe such as the [Azure Load Balancer health probes](../../load-balancer/load-balancer-custom-probe-overview.md) can’t be used. 

Application health is a customer-provided signal on the status of your application running inside the VM. Application health is different from [resource health](../../service-health/resource-health-overview.md), which is a platform-provided signal used to report service-level events impacting the performance of your VM. 

## Binary versus Rich Health States

Application Health Extensions has two options available: **Binary Health States** and **Rich Health States**. The following table highlights some key differences between the two options. See the end of this section for general recommendations.

| Features | Binary Health States | Rich Health States |
| -------- | -------------------- | ------------------ |
| Available Health States | Two available states: *Healthy*, *Unhealthy* | Four available states: *Healthy*, *Unhealthy*, *Initializing*, *Unknown*<sup>1</sup> |
| Sending Health Signals | Health signals are sent through HTTP/HTTPS response codes or TCP connections. | Health signals on HTTP/HTTPS protocol are sent through the probe response code and response body. Health signals through TCP protocol remain unchanged from Binary Health States. |
| Identifying *Unhealthy* Instances | Instances automatically fall into *Unhealthy* state if a *Healthy* signal isn't received from the application. An *Unhealthy* instance can indicate either an issue with the extension configuration (for example, unreachable endpoint) or an issue with the application (for example, non-200 status code). | Instances only go into an *Unhealthy* state if the application emits an *Unhealthy* probe response. Users are responsible for implementing custom logic to identify and flag instances with *Unhealthy* applications<sup>2</sup>. Instances with incorrect extension settings (for example, unreachable endpoint) or invalid health probe responses will fall under the *Unknown* state<sup>2</sup>. |
| *Initializing* state for newly created instances | *Initializing* state isn't available. Newly created instances may take some time before settling into a steady state. | *Initializing* state allows newly created instances to settle into a steady Health State before surfacing the health state as _Healthy_, _Unhealthy_, or _Unknown_. |
| HTTP/HTTPS protocol | Supported | Supported |
| TCP protocol | Supported | Limited Support – *Unknown* state is unavailable on TCP protocol. See [Rich Health States protocol table](#rich-health-states) for Health State behaviors on TCP. |

<sup>1</sup> The *Unknown* state is unavailable on TCP protocol. 
<sup>2</sup> Only applicable for HTTP/HTTPS protocol. TCP protocol follows the same process of identifying *Unhealthy* instances as in Binary Health States. 

Use **Binary Health States** if:
- You're not interested in configuring custom logic to identify and flag an unhealthy instance 
- You don't require an *initializing* grace period for newly created instances

Use **Rich Health States** if:
- You send health signals through HTTP/HTTPS protocol and can submit health information through the probe response body 
- You would like to use custom logic to identify and mark unhealthy instances 
- You would like to set an *initializing* grace period allowing newly created instances to settle into a steady health state

## Binary Health States

Binary Health State reporting contains two Health States, *Healthy* and *Unhealthy*. The following tables provide a brief description for how the Health States are configured. 

**HTTP/HTTPS Protocol**

| Protocol | Health State | Description |
| -------- | ------------ | ----------- |
| http/https | Healthy | To send a *Healthy* signal, the application is expected to return a 200 response code. |
| http/https | Unhealthy | The instance is marked as *Unhealthy* if a 200 response code isn't received from the application. |

**TCP Protocol**

| Protocol | Health State | Description |
| -------- | ------------ | ----------- |
| TCP | Healthy | To send a *Healthy* signal, a successful handshake must be made with the provided application endpoint. |
| TCP | Unhealthy | The instance is marked as *Unhealthy* if a failed or incomplete handshake occurred with the provided application endpoint. |

Some common scenarios that result in an *Unhealthy* state include: 
- When the application endpoint returns a non-200 status code 
- When there's no application endpoint configured inside the virtual machine to provide application health status 
- When the application endpoint is incorrectly configured 
- When the application endpoint isn't reachable

## Rich Health States 

Rich Health States reporting contains four Health States, *Initializing*, *Healthy*, *Unhealthy*, and *Unknown*. The following tables provide a brief description for how each Health State is configured. 

**HTTP/HTTPS Protocol**

| Protocol | Health State | Description |
| -------- | ------------ | ----------- |
| http/https | Healthy | To send a *Healthy* signal, the application is expected to return a probe response with: **Probe Response Code**: Status 2xx, **Probe Response Body**: `{"ApplicationHealthState": "Healthy"}` |
| http/https | Unhealthy | To send an *Unhealthy* signal, the application is expected to return a probe response with: **Probe Response Code**: Status 2xx, **Probe Response Body**: `{"ApplicationHealthState": "Unhealthy"}` |
| http/https | Initializing | The instance automatically enters an *Initializing* state at extension start time. For more information, see [Initializing state](#initializing-state). |
| http/https | Unknown | An *Unknown* state may occur in the following scenarios: when a non-2xx status code is returned by the application, when the probe request times out, when the application endpoint is unreachable or incorrectly configured, when a missing or invalid value is provided for `ApplicationHealthState` in the response body, or when the grace period expires. For more information, see [Unknown state](#unknown-state). |

**TCP Protocol**

| Protocol | Health State | Description |
| -------- | ------------ | ----------- |
| TCP | Healthy | To send a *Healthy* signal, a successful handshake must be made with the provided application endpoint. |
| TCP | Unhealthy | The instance is marked as *Unhealthy* if a failed or incomplete handshake occurred with the provided application endpoint. |
| TCP | Initializing | The instance automatically enters an *Initializing* state at extension start time. For more information, see [Initializing state](#initializing-state). |

## Initializing state

This state only applies to Rich Health States. The *Initializing* state only occurs once at extension start time and can be configured by the extension settings `gracePeriod` and `numberOfProbes`.  

At extension startup, the application health remains in the *Initializing* state until one of two scenarios occurs: 
- The same Health State (*Healthy* or *Unhealthy*) is reported a consecutive number of times as configured through *numberOfProbes*
- The `gracePeriod` expires 

If the same Health State (*Healthy* or *Unhealthy*) is reported consecutively, the application health transitions out of the *Initializing* state and into the reported Health State (*Healthy* or *Unhealthy*). 

### Example

If `numberOfProbes` = 3, that would mean:
- To transition from *Initializing* to *Healthy* state: Application health extension must receive three consecutive *Healthy* signals via HTTP/HTTPS or TCP protocol 
- To transition from *Initializing* to *Unhealthy* state: Application health extension must receive three consecutive *Unhealthy* signals via HTTP/HTTPS or TCP protocol  

If the `gracePeriod` expires before a consecutive health status is reported by the application, the instance health is determined as follows: 
- HTTP/HTTPS protocol: The application health transitions from *Initializing* to *Unknown*  
- TCP protocol: The application health transitions from *Initializing* to *Unhealthy* 

## Unknown state 

The *Unknown* state only applies to Rich Health States. This state is only reported for `http` or `https` probes and occurs in the following scenarios: 
- When a non-2xx status code is returned by the application  
- When the probe request times out  
- When the application endpoint is unreachable or incorrectly configured 
- When a missing or invalid value is provided for `ApplicationHealthState` in the response body 
- When the grace period expires  

## Extension schema for Binary Health States

The following JSON shows the schema for the Application Health extension. The extension requires at a minimum either a "tcp", "http" or "https" request with an associated port or request path respectively.

```json
{
  "extensionProfile" : {
     "extensions" : [
      {
        "name": "HealthExtension",
        "properties": {
          "publisher": "Microsoft.ManagedServices",
          "type": "<ApplicationHealthLinux or ApplicationHealthWindows>",
          "autoUpgradeMinorVersion": true,
          "typeHandlerVersion": "1.0",
          "settings": {
            "protocol": "<protocol>",
            "port": <port>,
            "requestPath": "</requestPath>",
            "intervalInSeconds": 5,
            "numberOfProbes": 1
          }
        }
      }
    ]
  }
} 
```

### Property values

| Name | Value / Example | Data Type |
| ---- | --------------- | --------- | 
| apiVersion | `2018-10-01` or above | date |
| publisher | `Microsoft.ManagedServices` | string |
| type | `ApplicationHealthLinux` (Linux), `ApplicationHealthWindows` (Windows) | string |
| typeHandlerVersion | `1.0` | string |

### Settings

| Name | Value / Example | Data Type |
| ---- | --------------- | --------- |
| protocol | `http` or `https` or `tcp` | string |
| port | Optional when protocol is `http` or `https`, mandatory when protocol is `tcp` | int |
| requestPath | Mandatory when protocol is `http` or `https`, not allowed when protocol is `tcp` | string |
| intervalInSeconds | Optional, default is 5 seconds. This setting is the interval between each health probe. For example, if intervalInSeconds == 5, a probe is sent to the local application endpoint once every 5 seconds. | int |
| numberOfProbes | Optional, default is 1. This setting is the number of consecutive probes required for the health status to change. For example, if numberOfProbles == 3, you will need 3 consecutive "Healthy" signals to change the health status from "Unhealthy" into "Healthy" state. The same requirement applies to change health status into "Unhealthy" state.  | int |

## Extension schema for Rich Health States

The following JSON shows the schema for the Rich Health States extension. The extension requires at a minimum either an "http" or "https" request with an associated port or request path respectively. TCP probes are also supported, but cannot set the `ApplicationHealthState` through the probe response body and do not have access to the *Unknown* state.

```json
{
  "extensionProfile" : {
     "extensions" : [
      {
        "name": "HealthExtension",
        "properties": {
          "publisher": "Microsoft.ManagedServices",
          "type": "<ApplicationHealthLinux or ApplicationHealthWindows>",
          "autoUpgradeMinorVersion": true,
          "typeHandlerVersion": "2.0",
          "settings": {
            "protocol": "<protocol>",
            "port": <port>,
            "requestPath": "</requestPath>",
            "intervalInSeconds": 5,
            "numberOfProbes": 1,
            "gracePeriod": 600
          }
        }
      }
    ]
  }
} 
```

### Property values

| Name | Value / Example | Data Type |
| ---- | --------------- | --------- |
| apiVersion | `2018-10-01` or above | date |
| publisher | `Microsoft.ManagedServices` | string |
| type | `ApplicationHealthLinux` (Linux), `ApplicationHealthWindows` (Windows) | string |
| typeHandlerVersion | `2.0` | string |

### Settings

| Name | Value / Example | Data Type |
| ---- | --------------- | --------- |
| protocol | `http` or `https` or `tcp` | string |
| port | Optional when protocol is `http` or `https`, mandatory when protocol is `tcp` | int |
| requestPath | Mandatory when protocol is `http` or `https`, not allowed when protocol is `tcp` | string |
| intervalInSeconds | Optional, default is 5 seconds. This setting is the interval between each health probe. For example, if intervalInSeconds == 5, a probe is sent to the local application endpoint once every 5 seconds. | int |
| numberOfProbes | Optional, default is 1. This setting is the number of consecutive probes required for the health status to change. For example, if numberOfProbles == 3, you will need 3 consecutive "Healthy" signals to change the health status from "Unhealthy"/"Unknown" into "Healthy" state. The same requirement applies to change health status into "Unhealthy" or "Unknown" state.  | int |
| gracePeriod | Optional, default = `intervalInSeconds` * `numberOfProbes`; maximum grace period is 7200 seconds | int |

## Deploy the Application Health extension
There are multiple ways of deploying the Application Health extension to your VMs as detailed in the following examples.

### Binary Health States

# [REST API](#tab/rest-api)

The following example adds the Application Health extension named *myHealthExtension* to a Windows-based virtual machine.

You can also use this example to change an existing extension from Rich Health States to Binary Health by making a PATCH call instead of a PUT.

```
PUT on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM/extensions/myHealthExtension?api-version=2018-10-01`
```

```json
{
  "name": "myHealthExtension",
  "location": "<location>", 
  "properties": {
    "publisher": "Microsoft.ManagedServices",
    "type": "ApplicationHealthWindows",
    "autoUpgradeMinorVersion": true,
    "typeHandlerVersion": "1.0",
    "settings": {
      "protocol": "<protocol>",
      "port": <port>,
      "requestPath": "</requestPath>"
    }
  }
}
```
Use `PATCH` to edit an already deployed extension.

# [Azure PowerShell](#tab/azure-powershell)

Use the [Set-AzVmExtension](/powershell/module/az.compute/set-azvmextension) cmdlet to add or update Application Health extension to your virtual machine.

The following example adds the Application Health extension to a Windows-based virtual machine. 

You can also use this example to change an existing extension from Rich Health States to Binary Health.

```azurepowershell-interactive
# Define the Application Health extension properties
$publicConfig = @{"protocol" = "http"; "port" = 80; "requestPath" = "/healthEndpoint"};

# Add the Application Health extension to the virtual machine
Set-AzVMExtension -Name "myHealthExtension" `
  -ResourceGroupName "<myResourceGroup>" `
  -VMName "<myVM>" ` 
  -Publisher "Microsoft.ManagedServices" `
  -ExtensionType "ApplicationHealthWindows" `
  -TypeHandlerVersion "1.0" `
  -Location "<location>" `
  -Settings $publicConfig
  
```
# [Azure CLI 2.0](#tab/azure-cli)

Use [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set) to add the Application Health extension to a virtual machine.

The following example adds the Application Health extension to a Linux-based virtual machine.

You can also use this example to change an existing extension from Rich Health States to Binary Health.

```azurecli-interactive
az vm extension set \
  --name ApplicationHealthLinux \
  --publisher Microsoft.ManagedServices \
  --version 1.0 \
  --resource-group <myResourceGroup> \
  --vm-name <myVM> \
  --settings ./extension.json
```
The extension.json file content.

```json
{
  "protocol": "<protocol>",
  "port": <port>,
  "requestPath": "</requestPath>"
}
```

# [Azure portal](#tab/azure-portal)

The following example adds the Application Health extension to an existing virtual machine on [Azure portal](https://portal.azure.com).

1.	Navigate to your existing Virtual Machine
2.	On the left sidebar, go to the **Health monitoring** blade
3.	Click on **Enable application health monitoring**, select **Binary** for Health States. Configure your protocol, port, and more to set up the health probes. 
4.	Click **Save** to save your settings

:::image type="content" source="media/application-health-monitoring/existing-vm-binary-health.png" alt-text="Screenshot showing VM Health monitoring blade from Azure portal with binary health states enabled.":::

---

### Rich Health States

# [REST API](#tab/rest-api)

The following example adds the **Application Health - Rich States** extension (with name myHealthExtension) to a Windows-based virtual machine.

You can also use this example to upgrade an existing extension from Binary to Rich Health States by making a PATCH call instead of a PUT.

```
PUT on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM/extensions/myHealthExtension?api-version=2018-10-01`
```

```json
{
  "name": "myHealthExtension",
  "location": "<location>", 
  "properties": {
    "publisher": "Microsoft.ManagedServices",
    "type": "ApplicationHealthWindows",
    "autoUpgradeMinorVersion": true,
    "typeHandlerVersion": "2.0",
    "settings": {
      "requestPath": "</requestPath>",
      "intervalInSeconds": <intervalInSeconds>,
      "numberOfProbes": <numberOfProbes>,
      "gracePeriod": <gracePeriod>
    }
  }
}
```
Use `PATCH` to edit an already deployed extension.

# [Azure PowerShell](#tab/azure-powershell)

Use the [Set-AzVmExtension](/powershell/module/az.compute/set-azvmextension) cmdlet to add or update Application Health extension to your virtual machine.

The following example adds the **Application Health - Rich States** extension to a Windows-based virtual machine. 

You can also use this example to upgrade an existing extension from Binary to Rich Health States.

```azurepowershell-interactive
# Define the Application Health extension properties
$publicConfig = @{"protocol" = "http"; "port" = 80; "requestPath" = "/healthEndpoint"; "gracePeriod" = 600};

# Add the Application Health extension to the virtual machine
Set-AzVMExtension -Name "myHealthExtension" `
  -ResourceGroupName "<myResourceGroup>" `
  -VMName "<myVM>" ` 
  -Publisher "Microsoft.ManagedServices" `
  -ExtensionType "ApplicationHealthWindows" `
  -TypeHandlerVersion "2.0" `
  -Location "<location>" `
  -Settings $publicConfig
  
```
# [Azure CLI 2.0](#tab/azure-cli)

Use [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set) to add the Application Health extension to a virtual machine.

The following example adds the **Application Health - Rich States** extension to a Linux-based virtual machine.

You can also use this example to upgrade an existing extension from Binary to Rich Health States.

```azurecli-interactive
az vm extension set \
  --name ApplicationHealthLinux \
  --publisher Microsoft.ManagedServices \
  --version 2.0 \
  --resource-group <myResourceGroup> \
  --vm-name <myVM> \
  --settings ./extension.json
```
The extension.json file content.

```json
{
  "protocol": "<protocol>",
  "port": <port>,
  "requestPath": "</requestPath>",
  "gracePeriod": <healthExtensionGracePeriod>
}
```
# [Azure portal](#tab/azure-portal)

The following example adds the Application Health extension to an existing virtual machine on [Azure portal](https://portal.azure.com).

1.	Navigate to your existing Virtual Machine
2.	On the left sidebar, go to the **Health monitoring** blade
3.	Click on **Enable application health monitoring**, select **Rich (advanced)** for Health States. Configure your protocol, port, and more to set up the health probes. 
4.	Click **Save** to save your settings

:::image type="content" source="media/application-health-monitoring/existing-vm-rich-health.png" alt-text="Screenshot showing VM Health monitoring blade from Azure portal with rich health states enabled.":::

---
## Troubleshoot
### View VMHealth

# [REST API](#tab/rest-api)
```
GET https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM/instanceView?api-version=2023-07-01
```
Sample Response (see "vmHealth" object for the latest VM health status)
```
"vmHealth": {
    "status": {
      "code": "HealthState/unknown",
      "level": "Warning",
      "displayStatus": "The VM health is unknown",
      "time": "2023-12-04T22:25:39+00:00"
    }
}
```

# [Azure PowerShell](#tab/azure-powershell)
```azurepowershell-interactive
Get-AzVM
  -ResourceGroupName "<rgName>" `
  -Name "<vmName>" `
  -Status
```

# [Azure CLI 2.0](#tab/azure-cli)
```azurecli-interactive
az vm get-instance-view --name <vmName> --resource-group <rgName>
```

# [Azure portal](#tab/azure-portal)

1.	Navigate to your existing Virtual Machine
2.	On the left sidebar, go to the **Overview** blade
3.	Your application health can be observed under the **Health State** field

:::image type="content" source="media/application-health-monitoring/portal-health-state.png" alt-text="Screenshot showing VM Overview blade with VM Health State.":::

---
### Extension execution output log
Extension execution output is logged to files found in the following directories:

```Windows
C:\WindowsAzure\Logs\Plugins\Microsoft.ManagedServices.ApplicationHealthWindows\<version>\
```

```Linux
/var/lib/waagent/Microsoft.ManagedServices.ApplicationHealthLinux-<extension_version>/status
/var/log/azure/applicationhealth-extension
```

The logs also periodically capture the application health status.

