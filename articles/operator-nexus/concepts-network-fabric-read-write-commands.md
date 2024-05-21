---
title: Network Fabric read write commands
description: Learn how to use the Nexus Fabric Read Write commands to modify device configurations without accessing the Network Fabric device.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-nexus
ms.topic: concept-article 
ms.date: 05/03/2024
#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---

# Run read write commands

The Read Write (RW) feature to allows you to remotely modify device configurations without accessing the network fabric device. Apply the RW configuration command at the device level on the Network fabric. Because the configuration command persists at the device level, to configure across all devices you must apply the configuration to each device in the fabric.

Executing the RW command preserves your configuration against changes made via the Command Line Interface (CLI) or portal. To introduce multiple configurations through the RW API, append new commands to the existing RW command. For instance, after modifying multiple device interfaces, include the previous configuration with any new changes to prevent overwriting.

Revert the RW configuration only during an upgrade scenario. Post-upgrade, you must reapply the RW modifications if needed. The following examples guide you through the RW API process step-by-step.

## Prerequisites

Ensure that the Nexus Network Fabric is successfully provisioned.

## Procedure 

When you execute an RW configuration command and make changes to the device, the device's configuration state is moved to **Deferred Control**. This state indicates that the RW configuration was pushed on that device. When the applied RW configuration is reversed, then the device's configuration reverts to its original **succeeded** state.

## Select Network Device

Sign in to the [Azure portal](https://portal.azure.com/)

### Access the Network Devices:

Once logged in, use the search bar at the top to search for `Network Devices` or navigate to All Services and find Network Devices under the Networking category.

Click on Network Devices to open the list of network devices in your subscription.

### Select the Network Device:

From the list of network devices, find and click on the network device you want to configure. This will take you to the details page of the selected network device.

Take note of the resource name and the resource group of this network device, as you will need these for the CLI command.

Or 

To get the name of the resource, click on the JSON view (found in the Properties or Overview section) which displays the detailed properties of the device, including the resource name.

:::image type="content" source="media/network-device-overview.png" alt-text="Screenshot of Azure portal showing the overview of the network device." lightbox="media/network-device-overview.png":::


## Examples

The following sections provide examples of RW commands can be used to modify the configuration of the device. The examples use Ethernet interfaces 1, 2, and 3 to show you how to adjust the interface name, and allow you to observe the results of these modifications.


### Snapshot of the Network Fabric device before making changes to the configuration using RW API

```device cli
show interfaces description  
```

```Output
|Interface  |Status  |Protocol  |Decsription  |
|---------|---------|---------|---------|
|Et1      | admin down        | down          | **"AR-Mgmt2:Et1 to Not-Connected"**          |
|Et2      | admin down        | down          | **"AR-Mgmt2:Et2 to Not-Connected"**         |
|Et3      | admin down        | down          | **"AR-Mgmt2:Et3 to Not-Connected"**         |
|Et4      | admin down        | down          | **"AR-Mgmt2:Et4 to Not-Connected"**       |
```

### Change an interface's description

The example shows how to change the device's interface description to RW-test.

```azurecli
az networkfabric device run-rw --resource-name <ResourceName> --resource-group <ResourceGroupName> --rw-command "interface Ethernet 1\n description RW-test"
```

| Parameter                | Description                                                                                                                   |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `az networkfabric device run-rw` | Azure CLI command for executing a read-write operation on a network device within Azure Network Fabric.                         |
| `--resource-name`   | Specifies the name of the resource (network device) on which the RW operation will be performed.                                 |
| `--resource-group` | Specifies the name of the resource group that contains the network device.                                                       |
| `--rw-command "interface Ethernet 1\n description RW-test"` | Specifies the RW command to be executed on the network device. In this example, it sets the description of Ethernet interface 1 to "RW-test". |


Expected output:

```azurecli
{}
```

Command with `--no-wait` `--debug`

```azurecli
az networkfabric device run-rw --resource-name <ResourceName> --resource-group <ResourceGroupName> --rw-command "interface Ethernet 1\n description RW-test" **--no-wait --debug**
```
| Parameter                | Description                                                                                                                   |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `az networkfabric device run-rw` | Azure CLI command for executing a read-write operation on a network device within Azure Network Fabric.                         |
| `--resource-name`   | Specifies the name of the resource (network device) on which the RW operation will be performed.                                 |
| `--resource-group` | Specifies the name of the resource group that contains the network device.                                                       |
| `--rw-command "interface Ethernet 1\n description RW-test"` | Specifies the RW command to be executed on the network device. In this example, it sets the description of Ethernet interface 1 to "RW-test". |
| `--no-wait`              | Indicates that the command should be executed asynchronously without waiting for the operation to complete.                   |
| `--debug`                 | Flag enabling debug mode, providing additional information about the execution of the command for troubleshooting purposes.   |


Expected truncated output:

```Truncated output
cli.knack.cli: __init__ debug log: 
cli.azure.cli.core.sdk.policies:     'Azure-AsyncOperation': 'https://eastus.management.azure.com/subscriptions/XXXXXXXXXXXXXXXXXXXXXXXXXXXXX/providers/Microsoft.ManagedNetworkFabric/locations/EASTUS/operationStatuses/e239299a-8c71-426e-8460-58d4c0b470e2*BF225A07F7F4850DA565ABE0036AB?api-version=2022-01-15-privatepreview&t=638479088323069839&c= 
telemetry.main: Begin creating telemetry upload process. 
telemetry.process: Return from creating process 
telemetry.main: Finish creating telemetry upload process. 
```

You can programmatically check the status of the operation by running the following command:

```azurecli
az rest -m get -u "<Azure-AsyncOperation-endpoint url>"
```

Example of the Azure-AsyncOperation endpoint URL extracted from the truncated output.

```output
<https://eastus.management.azure.com/subscriptions/xxxxxxxxxxx/providers/Microsoft.ManagedNetworkFabric/locations/EASTUS/operationStatuses/xxxxxxxxxxx?api-version=20XX-0X-xx-xx>
```

The Status should indicate whether the API succeeded or failed.

**Expected output:**

```azurecli
{ 
  "id": "/subscriptions/XXXXXXXXXXXX/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkDevices/ResourceName", 
  "location": "eastus", 
  "name": "ResourceName", 
  "properties": { 
    "administrativeState": "Enabled", 
    "configurationState": "DeferredControl", 
    "hostName": "<Hostname>", 
    "networkDeviceRole": "Management", 
    "networkDeviceSku": "DefaultSku", 
    "networkRackId": "/subscriptions/XXXXXXXXXXXX/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkRacks/NFResourceName", 
    "provisioningState": "Succeeded", 
    "serialNumber": "Arista;CCS-720DT-XXXX;11.07;WTW2248XXXX", 
    "version": "3.0.0" 
  }, 
  "systemData": { 
    "createdAt": "2024-XX-XXT13:41:13.8558264Z", 
    "createdBy": "cbe7d642-9e0a-475d-b2bf-2cb0a9825e13", 
    "createdByType": "Application", 
    "lastModifiedAt": "2024-XX-XXT10:44:21.3736554Z", 
    "lastModifiedBy": "cbe7d642-9e0a-475d-b2bf-2cb0a9825e13", 
    "lastModifiedByType": "Application" 
  }, 
  "type": "microsoft.managednetworkfabric/networkdevices" 
}
```

When the RW configuration succeeds, the device configuration state moves to a **deferred control** state. No change in state occurs if the configuration fails.

```device cli
show interfaces description  
```

```Output
|Interface  |Status  |Protocol  |Decsription  |
|---------|---------|---------|---------|
|Et1      | admin down        | down          | **RW-test1**         |
|Et2      | admin down        | down          | "AR-Mgmt2:Et2 to Not-Connected"        |
|Et3      | admin down        | down          | "AR-Mgmt2:Et3 to Not-Connected"          |
|Et4      | admin down        | down          | "AR-Mgmt2:Et4 to Not-Connected"     |
```

### Changing three of the interface's descriptions

This example shows how to change three different interfaces on a device description to RW-test1, RW-test2, RW-test3.

```azurecli
az networkfabric device run-rw --resource-name <ResourceName> --resource-group <ResourceGroupName> --rw-command "interface Ethernet 1\n description RW-test1\n interface Ethernet 2\n description RW-test2\n interface Ethernet 3\n description RW-test3"

```

| Parameter                | Description                                                                                                                   |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `az networkfabric device run-rw` | Azure CLI command for executing a read-write operation on a network device within Azure Network Fabric.                         |
| `--resource-name <ResourceName>`   | Specifies the name of the resource (network device) on which the RW operation will be performed.                                 |
| `--resource-group <ResourceGroupName>` | Specifies the name of the resource group that contains the network device.                                                       |
| `--rw-command "interface Ethernet 1\n description RW-test1\n interface Ethernet 2\n description RW-test2\n interface Ethernet 3\n description RW-test3"` | Specifies the RW commands to be executed on the network device. Each 'interface' command sets the description for the specified Ethernet interface. |

Expected output:

```azurecli
{}
```

Command with `--no-wait` `--debug`

```azurecli
az networkfabric device run-rw --resource-name <ResourceName> --resource-group <ResourceGroupName> --rw-command "interface Ethernet 1\n description RW-test1\n interface Ethernet 2\n description RW-test2\n interface Ethernet 3\n description RW-test3" --no-wait --debug
```

| Parameter                | Description                                                                                                                   |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `az networkfabric device run-rw` | Azure CLI command for executing a read-write operation on a network device within Azure Network Fabric.                         |
| `--resource-name <ResourceName>`   | Specifies the name of the resource (network device) on which the RW operation will be performed.                                 |
| `--resource-group <ResourceGroupName>` | Specifies the name of the resource group that contains the network device.                                                       |
| `--rw-command "interface Ethernet 1\n description RW-test1\n interface Ethernet 2\n description RW-test2\n interface Ethernet 3\n description RW-test3"` | Specifies the RW commands to be executed on the network device. Each 'interface' command sets the description for the specified Ethernet interface. |
| `--no-wait`              | Indicates that the command should be executed asynchronously without waiting for the operation to complete.                   |
| `--debug`                 | Flag enabling debug mode, providing additional information about the execution of the command for troubleshooting purposes.   |

Expected truncated output:

```Truncated output
cli.knack.cli: Command arguments: \['networkfabric', 'device', 'run-rw', '--resource-name', 'nffab100g-5-3-AggrRack-MgmtSwitch2', '--resource-group', 'Fab100GLabNF-5-3', '--rw-command', 'interface Ethernet 1\\\\n description RW-test1\\\\n interface Ethernet 2\\\\n description RW-test2\\\\n interface Ethernet 3\\\\n description RW-test3', '--debug'\]
cli.knack.cli: \_\_init\_\_ debug log:
cli.azure.cli.core.sdk.policies: 'Azure-AsyncOperation': 'https://eastus.management.azure.com/subscriptions/XXXXXXXXXXXXXXXXXXXXXXXXXXXXX/providers/Microsoft.ManagedNetworkFabric/locations/EASTUS/operationStatuses/e239299a-8c71-426e-8460-58d4c0b470e2\*BF225A07F7F4850DA565ABE0036AB?api-version=2022-01-15-privatepreview&t=638479088323069839&c=
telemetry.main: Begin creating telemetry upload process.
telemetry.process: Creating upload process: "C:\\Program Files (x86)\\Microsoft SDKs\\Azure\\CLI2\\python.exe C:\\Program Files (x86)\\Microsoft SDKs\\Azure\\CLI2\\Lib\\site-packages\\azure\\cli\\telemetry\\\_\_init\_\_.pyc \\.azure"
telemetry.process: Return from creating process
telemetry.main: Finish creating telemetry upload process.
```

You can programmatically check the status of the operation by running the following command:

```azurecli
az rest -m get -u "<Azure-AsyncOperation-endpoint url>"
```

Example of the Azure-AsyncOperation endpoint URL extracted from the truncated output.

```Endpoint URL
<https://eastus.management.azure.com/subscriptions/xxxxxxxxxxx/providers/Microsoft.ManagedNetworkFabric/locations/EASTUS/operationStatuses/xxxxxxxxxxx?api-version=20XX-0X-xx-xx>
```

The Status should indicate whether the API succeeded or failed.

Expected output:

```Truncated output
{ 
  "id": "/subscriptions/XXXXXXXXXXXX/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkDevices/ResourceName", 
  "location": "eastus", 
  "name": "ResourceName", 
  "properties": { 
    "administrativeState": "Enabled", 
    "configurationState": "**DeferredControl**", 
    "hostName": "<Hostname>", 
    "networkDeviceRole": "Management", 
    "networkDeviceSku": "DefaultSku", 
    "networkRackId": "/subscriptions/ XXXXXXXXXXXX /resourceGroups/ ResourceGroupName /providers/Microsoft.ManagedNetworkFabric/networkRacks/ NFResourceName ", 
    "provisioningState": "Succeeded", 
    "serialNumber": "Arista;CCS-720DT-XXXX;11.07;WTW2248XXXX", 
    "version": "3.0.0" 
  }, 
  "systemData": { 
    "createdAt": "2024-XX-XXT13:41:13.8558264Z", 
    "createdBy": "cbe7d642-9e0a-475d-b2bf-2cb0a9825e13", 
    "createdByType": "Application", 
    "lastModifiedAt": "2024-XX-XXT10:44:21.3736554Z", 
    "lastModifiedBy": "cbe7d642-9e0a-475d-b2bf-2cb0a9825e13", 
    "lastModifiedByType": "Application" 
  }, 
  "type": "microsoft.managednetworkfabric/networkdevices" 
} 
```

```device cli
show interfaces description  
```

```Output
|Interface  |Status  |Protocol  |Decsription  |
|---------|---------|---------|---------|
|Et1      | admin down        | down          | **RW-test1**         |
|Et2      | admin down        | down          | **RW-test2**         |
|Et3      | admin down        | down          | **RW-test3**         |
|Et4      | admin down        | down          | "AR-Mgmt2:Et4 to Not-Connected"     |
```

### Overwrite previous configuration

This example shows how the previous configuration is overwritten if you don't append the old RW configuration:

```azurecli
az networkfabric device run-rw --resource-name <ResourceName> --resource-group <ResourceGroupName> --rw-command "interface Ethernet 3\n description RW-test3"
```

| Parameter                | Description                                                                                                                   |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `az networkfabric device run-rw` | Azure CLI command for executing a read-write operation on a network device within Azure Network Fabric.                         |
| `--resource-name`   | Specifies the name of the resource (network device) on which the RW operation will be performed.                                 |
| `--resource-group` | Specifies the name of the resource group that contains the network device.                                                       |
| `--rw-command "interface Ethernet 1\n description RW-test1\n interface Ethernet 2\n description RW-test2\n interface Ethernet 3\n description RW-test3"` | Specifies the RW commands to be executed on the network device. Each 'interface' command sets the description for the specified Ethernet interface. |

Expected output:

```azurecli
{}
```

Command with `--no-wait` `--debug`

```azurecli
az networkfabric device run-rw --resource-name <ResourceName> --resource-group <ResourceGroupName> --rw-command "interface Ethernet 3\n description RW-test3" --no-wait --debug 
```

| Parameter                | Description                                                                                                                   |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `az networkfabric device run-rw` | Azure CLI command for executing a read-write operation on a network device within Azure Network Fabric.                         |
| `--resource-name`   | Specifies the name of the resource (network device) on which the RW operation will be performed.                                 |
| `--resource-group` | Specifies the name of the resource group that contains the network device.                                                       |
| `--rw-command "interface Ethernet 1\n description RW-test1\n interface Ethernet 2\n description RW-test2\n interface Ethernet 3\n description RW-test3"` | Specifies the RW commands to be executed on the network device. Each 'interface' command sets the description for the specified Ethernet interface. |
| `--no-wait`              | Indicates that the command should be executed asynchronously without waiting for the operation to complete.                   |
| `--debug`                 | Flag enabling debug mode, providing additional information about the execution of the command for troubleshooting purposes.   |

Expected truncated output:

```Truncated output
cli.knack.cli: Command arguments: \['networkfabric', 'device', 'run-rw', '--resource-name', 'nffab100g-5-3-AggrRack-MgmtSwitch2', '--resource-group', 'Fab100GLabNF-5-3', '--rw-command', \`interface Ethernet 3\\n description RW-test3\`, '--debug'\]cli.knack.cli: \_\_init\_\_ debug log:
cli.azure.cli.core.sdk.policies: 'Azure-AsyncOperation': 'https://eastus.management.azure.com/subscriptions/XXXXXXXXXXXXXXXXXXXXXXXXXXXXX/providers/Microsoft.ManagedNetworkFabric/locations/EASTUS/operationStatuses/e239299a-8c71-426e-8460-58d4c0b470e2\*BF225A07F7F4850DA565ABE0036AB?api-version=2022-01-15-privatepreview&t=638479088323069839&c=
telemetry.main: Begin creating telemetry upload process.
telemetry.process: Creating upload process: "C:\\Program Files (x86)\\Microsoft SDKs\\Azure\\CLI2\\python.exe C:\\Program Files (x86)\\Microsoft SDKs\\Azure\\CLI2\\Lib\\site-packages\\azure\\cli\\telemetry\\\_\_init\_\_.pyc \\.azure"
telemetry.process: Return from creating process
telemetry.main: Finish creating telemetry upload process.
```

You can programmatically check the status of the operation by running the following command:

```azurecli
az rest -m get -u "<Azure-AsyncOperation-endpoint url>"
```

Example of the Azure-AsyncOperation endpoint URL extracted from the truncated output.

```Endpoint URL
<https://eastus.management.azure.com/subscriptions/xxxxxxxxxxx/providers/Microsoft.ManagedNetworkFabric/locations/EASTUS/operationStatuses/xxxxxxxxxxx?api-version=20XX-0X-xx-xx>
```

Expected output:

```azurecli
{ 
  "id": "/subscriptions/XXXXXXXXXXXX/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkDevices/ResourceName", 
  "location": "eastus", 
  "name": "ResourceName", 
  "properties": { 
    "administrativeState": "Enabled", 
    "configurationState": "**DeferredControl**", 
    "hostName": "<Hostname>", 
    "networkDeviceRole": "Management", 
    "networkDeviceSku": "DefaultSku", 
    "networkRackId": "/subscriptions/ XXXXXXXXXXXX /resourceGroups/ ResourceGroupName /providers/Microsoft.ManagedNetworkFabric/networkRacks/ NFResourceName ", 
    "provisioningState": "Succeeded", 
    "serialNumber": "Arista;CCS-720DT-XXXX;11.07;WTW2248XXXX", 
    "version": "3.0.0" 
  }, 
  "systemData": { 
    "createdAt": "2024-XX-XXT13:41:13.8558264Z", 
    "createdBy": "cbe7d642-9e0a-475d-b2bf-2cb0a9825e13", 
    "createdByType": "Application", 
    "lastModifiedAt": "2024-XX-XXT10:44:21.3736554Z", 
    "lastModifiedBy": "cbe7d642-9e0a-475d-b2bf-2cb0a9825e13", 
    "lastModifiedByType": "Application" 
  }, 

  "type": "microsoft.managednetworkfabric/networkdevices" 

} 
```

```device cli
show interfaces description
```

```Output
|Interface  |Status  |Protocol  |Decsription  |
|---------|---------|---------|---------|
|Et1      | admin down        | down          | "AR-Mgmt2:Et1 to Not-Connected"          |
|Et2      | admin down        | down          | "AR-Mgmt2:Et2 to Not-Connected"        |
|Et3      | admin down        | down          | **RW-test3**         |
|Et4      | admin down        | down          | "AR-Mgmt2:Et4 to Not-Connected"     |
```

### Clean up the read write configuration

This example shows how the RW configuration is cleaned up. When you run the cleanup, the configuration reverts to the original configuration.

```azurecli
az networkfabric device run-rw --resource-name <ResourceName> --resource-group <ResourceGroupName> --rw-command " " 
```

| Parameter                | Description                                                                                                                   |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `az networkfabric device run-rw` | Azure CLI command for executing a read-write operation on a network device within Azure Network Fabric.                         |
| `--resource-name <ResourceName>`   | Specifies the name of the resource (network device) on which the RW operation will be performed.                                 |
| `--resource-group <ResourceGroupName>` | Specifies the name of the resource group that contains the network device.                                                       |
| `--rw-command " "` | Specifies an empty RW command to be executed on the network device. This command is essentially a placeholder with no action.     |

> [!NOTE]
> Ensure that there is a space between the quotation marks in the empty RW command. 

Expected output:

```azurecli
{}
```

Command with `--no-wait` `--debug`

```azurecli
az networkfabric device run-rw --resource-name <ResourceName> --resource-group <ResourceGroupName> --rw-command " " --no-wait --debug
```

| Parameter                | Description                                                                                                                   |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `az networkfabric device run-rw` | Azure CLI command for executing a read-write operation on a network device within Azure Network Fabric.                         |
| `--resource-name <ResourceName>`   | Specifies the name of the resource (network device) on which the RW operation will be performed.                                 |
| `--resource-group <ResourceGroupName>` | Specifies the name of the resource group that contains the network device.                                                       |
| `--rw-command " "` | Specifies an empty RW command to be executed on the network device. This command is essentially a placeholder with no action.     |
| `--no-wait`              | Indicates that the command should be executed asynchronously without waiting for the operation to complete.                   |
| `--debug`                 | Flag enabling debug mode, providing additional information about the execution of the command for troubleshooting purposes.   |

Expected truncated output:

```Truncated output
cli.knack.cli: Command arguments: \['networkfabric', 'device', 'run-rw', '--resource-name', 'nffab100g-5-3-AggrRack-MgmtSwitch2', '--resource-group', 'Fab100GLabNF-5-3', '--rw-command', ' ' '--debug'\]cli.knack.cli: \_\_init\_\_ debug log:
cli.azure.cli.core.sdk.policies: 'Azure-AsyncOperation': 'https://eastus.management.azure.com/subscriptions/XXXXXXXXXXXXXXXXXXXXXXXXXXXXX/providers/Microsoft.ManagedNetworkFabric/locations/EASTUS/operationStatuses/e239299a-8c71-426e-8460-58d4c0b470e2\*BF225A07F7F4850DA565ABE0036AB?api-version=2022-01-15-privatepreview&t=638479088323069839&c=
telemetry.main: Begin creating telemetry upload process.
telemetry.process: Creating upload process: "C:\\Program Files (x86)\\Microsoft SDKs\\Azure\\CLI2\\python.exe C:\\Program Files (x86)\\Microsoft SDKs\\Azure\\CLI2\\Lib\\site-packages\\azure\\cli\\telemetry\\\_\_init\_\_.pyc \\.azure"
telemetry.process: Return from creating process
telemetry.main: Finish creating telemetry upload process.
```

You can programmatically check the status of the operation by running the following command:

```azurecli
az rest -m get -u "<Azure-AsyncOperation-endpoint url>"
```

Example of the Azure-AsyncOperation endpoint URL extracted from the truncated output.

```Endpoint URL
<https://eastus.management.azure.com/subscriptions/xxxxxxxxxxx/providers/Microsoft.ManagedNetworkFabric/locations/EASTUS/operationStatuses/xxxxxxxxxxx?api-version=20XX-0X-xx-xx>
```
The status indicates whether the API succeeded or failed.

Expected output:

```Output
{ 
  "id": "/subscriptions/XXXXXXXXXXXX/resourceGroups/ResourceGroupName/providers/Microsoft.ManagedNetworkFabric/networkDevices/ResourceName", 
  "location": "eastus", 
  "name": "ResourceName", 
  "properties": { 
    "administrativeState": "Enabled", 
    "configurationState": "**Succeeded**", 
    "hostName": "<Hostname>", 
    "networkDeviceRole": "Management", 
    "networkDeviceSku": "DefaultSku", 
    "networkRackId": "/subscriptions/ XXXXXXXXXXXX /resourceGroups/ ResourceGroupName /providers/Microsoft.ManagedNetworkFabric/networkRacks/ NFResourceName ", 
    "provisioningState": "Succeeded", 
    "serialNumber": "Arista;CCS-720DT-XXXX;11.07;WTW2248XXXX", 
    "version": "3.0.0" 
  }, 
  "systemData": { 
    "createdAt": "2024-XX-XXT13:41:13.8558264Z", 
    "createdBy": "cbe7d642-9e0a-475d-b2bf-2cb0a9825e13", 
    "createdByType": "Application", 
    "lastModifiedAt": "2024-XX-XXT10:44:21.3736554Z", 
    "lastModifiedBy": "cbe7d642-9e0a-475d-b2bf-2cb0a9825e13", 
    "lastModifiedByType": "Application" 
  }, 
  "type": "microsoft.managednetworkfabric/networkdevices" 
} 
```

When the RW configuration is reverted back to the original configuration, the configuration state of the device is moved to **"Succeeded"** from **Deferred Control**.

```device cli
show interfaces description
```

```Output
|Interface  |Status  |Protocol  |Decsription  |
|---------|---------|---------|---------|
|Et1      | admin down        | down          | **"AR-Mgmt2:Et1 to Not-Connected"**         |
|Et2      | admin down        | down          | **"AR-Mgmt2:Et2 to Not-Connected"**         |
|Et3      | admin down        | down          | **"AR-Mgmt2:Et3 to Not-Connected"**      |
|Et4      | admin down        | down          |  **"AR-Mgmt2:Et4 to Not-Connected"**    |
```

## Command restrictions

The RW command feature is open and there are no restrictions on it. However, proceed with caution because incorrect usage of the configuration can bring down the system.

- The creation of vLANs ranging from 1 to 500 and 3000 to 4095 isn't recommended as this range is reserved for infrastructure purposes.
- Don't tamper the Management vLAN configuration.
- It's imperative not to tamper the Network-to-Network Interconnect (NNI) Ingress and Egress Access Control Lists (ACLs), as any modifications could potentially result in a loss of connectivity to the Azure Operator Nexus instance.
- There are no schematic or syntax validations performed for RW commands. You must ensure that the configuration is vetted out before executing it.
- The RW config commands should be an absolute command; short forms and prompts aren't supported. 
    For example: 
    Enter `router bgp <ASN>\n vrf <name>\n neighbor <IPaddress> shutdown`
    Not `router bgp <ASN>\n vrf <name>\n nei <IPaddress> sh or shut`

- It's crucial to thoroughly review the Route Policy configuration before implementation, as any oversight could potentially compromise the existing Route Policy setup.
- Changing the router BGP configuration and shutting it down brings down the stability of the device.

## Limitations 

**Common Questions:**

- **Can I run multiple commands at the same time?**

    Yes, you can run multiple commands at the same time. Refer to the examples to review how to execute multiple commands at the same time.

- **How do I check if the configuration was successful?**

    You can check the configuration by either:

    -  Running a Read-Only API and running the required `show` commands to verify successful configuration,

    -  Running the Config difference feature to view the delta between the configurations.

    The RW POST message indicates if the execution was successful or not.

- **What happens if I execute the RW configuration command incorrectly?**

    The RW POST message returns an error message as shown in the example provided in this article. No configuration changes are applied to the device. You must rerun the configuration command.

- **How can I persist the RW configuration command multiple times?**

    If you try to modify and update configuration over an already persisted configuration, then you  must provide all of the modified persisted configuration, otherwise the configuration is overwritten with the latest RW configuration.

    *For example*

    If you created a vlan 505 successfully and try to create another set of vlans (vlan 510), you must add `vlan 505\\n vlan 510`. If you don't, the latest RW configuration command overwrites the vlan 505.

- **How do I delete the configuration?**

    You must provide the null value `" "`. Refer to the examples section of this article.

- **Is the RW command persistent across the fabric?**

    The RW configuration command is persistent, but the API lets you run at a device level. If you want to run the RW command across the fabric, then you must run the RW API across the required fabric devices.

## Known issues

The following are known issues for the RW configuration:

- There's no support for RW configuration to persist during an upgrade. During the upgrade, the configuration state **Deferred Control** is overwritten. The Fabric service automation overwrites the RW configuration through the Network Fabric reconcile workflow. You must rerun the RW configuration command for the required devices.

- An error is reported because an internal error or a gNMI set error can't be distinguished with error responses.

## Related content

- [Network Fabric controller](concepts-network-fabric-controller.md)
- [Update and commit Network Fabric resources](concepts-network-fabric-resource-update-commit.md)
- [Network Fabric read-only commands for troubleshooting](concepts-network-fabric-read-only-commands.md)
