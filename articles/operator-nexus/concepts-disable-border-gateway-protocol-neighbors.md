---
title: Disable the Border Gateway Protocol neighbors
description: Learn how to use read write commands in the Nexus Network Fabric to disable the Border Gateway Protocol.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-nexus
ms.topic: concept-article 
ms.date: 05/03/2024
#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---
# Disable the Border Gateway Protocol neighbors

This article provides examples demonstrating how a user can implement the read write (RW) commands to disable Border Gateway Protocol (BGP) neighbors.

## Shut down a specific peer at Virtual Routing and Forwarding (VRF) level

The following shows a snapshot of the Network Fabric Device before making changes to the configuration using RW API:


```azurecli
sh ip bgp  summary vrf gfab1-isd
```

```Output
BGP summary information for VRF gfab1-isd
Router identifier 10.XXX.14.34, local AS number 650XX
Neighbor Status Codes: m - Under maintenance
  Neighbor            V AS           MsgRcvd   MsgSent  InQ OutQ  Up/Down State   PfxRcd PfxAcc
  10.XXX.13.15        4 650XX         129458    168981    0    0 00:06:50 Estab   189    189
  **10.XXX.30.18        4 650XX          42220     42522    0    0 00:00:44 Estab   154    154**
  10.XXX.157.8        4 645XX          69211     74503    0    0   21d20h Estab   4      4
  fda0:XXXX:XXXX:d::f 4 650XX         132192    171982    0    0   28d18h Estab   0      0
```

Execute the following command to disable the BGP neighbor:

```azurecli
az networkfabric device run-rw --resource-name <ResourceName> --resource-group <ResourceGroupName> --rw-command "router bgp 65055\n vrf gfab1-isd\n neighbor 10.100.30.18 shutdown"  
```

Expected output:

```azurecli
{}
```

```bash
sh ip bgp summary vrf gfab1-isd
```

```Output
BGP summary information for VRF gfab1-isd
Router identifier 10.XXX.14.34, local AS number 650XX
Neighbor Status Codes: m - Under maintenance
  Neighbor            V AS           MsgRcvd   MsgSent  InQ OutQ  Up/Down State   PfxRcd PfxAcc
  10.XXX.13.15        4 650XX         129456    168975    0    0 00:04:31 Estab   189    189
  **10.XXX.30.18        4 650XX          42210     42505    0    0 00:01:50 Idle(Admin)**
  10.XXX.157.8        4 645XX          69206     74494    0    0   21d20h Estab   4      4
  fda0:d59c:df06:d::f 4 65055         132189    171976    0    0   28d18h Estab   0      0
```

```azurecli
Apr  XX XXX:54 AR Bgp: %BGP-3-NOTIFICATION: sent to neighbor 10.XXX.30.18 (VRF gfab1-isd AS 650XX) 6/2 (Cease/administrative shutdown <Hard Reset>) reason:
Apr  XX XXX:54 AR Bgp: %BGP-3-NOTIFICATION: sent to neighbor 10.XXX.30.18 (VRF gfab1-isd AS 650XX) 6/5 (Cease/connection rejected) 0 bytes 
```

Command with `--no-wait` `--debug`

```azurecli
az networkfabric device run-rw --resource-name <ResourceName> --resource-group <ResourceGroupName> --rw-command "router bgp 65055\n vrf gfab1-isd\n neighbor 10.100.30.18 shutdown" --no-wait –debug
```

| Parameter                | Description                                                                                                                   |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `az networkfabric device run-rw` | Azure CLI command for executing a read-write operation on a network device within Azure Network Fabric.                         |
| `--resource-name`   | Specifies the name of the resource (network device) on which the RW operation will be performed.                                 |
| `--resource-group` | Specifies the name of the resource group that contains the network device.                                                       |
| `--rw-command "router bgp 65055\n vrf gfab1-isd\n neighbor 10.100.30.18 shutdown"` | Specifies the RW commands to be executed on the network device. These commands configure BGP settings and shut down a specific neighbor. |
| `--no-wait`              | Indicates that the command should be executed asynchronously without waiting for the operation to complete.                   |
| `--debug`                 | Flag enabling debug mode, providing additional information about the execution of the command for troubleshooting purposes.   |


Expected output:

```Truncated output
cli.knack.cli: Command arguments: \['networkfabric', 'device', 'run-rw', '--resource-name', <ResourceName>, '--resource-group', <ResourceGroupName>, '--rw-command', 'router bgp 65055\\\\n vrf gfab1-isd\\\\n neighbor 10.100.30.18 shutdown', '--debug'\]
cli.knack.cli: \_\_init\_\_ debug log:
Enable color in terminal.
cli.knack.cli: Event: Cli.PreExecute \[\]
cli.knack.cli: Event: CommandParser.OnGlobalArgumentsCreate \[<function CLILogging.on\_global\_arguments at 0x01F1A610>;, <function OutputProducer.on\_global\_arguments at 0x0211B850>, <function CLIQuery.on\_global\_arguments at 0x021314A8>\]
cli.azure.cli.core.sdk.policies: 'Azure-AsyncOperation': 'https://eastus.management.azure.com/subscriptionsXXXXXXXXXXXXXXXXXX/providers/Microsoft.ManagedNetworkFabric/locations/EASTUS/operationStatuses/e239299a-8c71-426e-8460-58d4c0b470e2\*850DA565ABE0036AB?api-version=2022-01-15-privatepreview&t=638479088323069839&c=
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

```azurecli
https://eastus.management.azure.com/subscriptions/XXXXXXXX/providers/Microsoft.ManagedNetworkFabric/locations/EASTUS/operationStatuses/e239299a-8c71-426e-8460-58d4c0b470e2AB?api-version=2022-01-15-privatepreview

{

"endTime": "2024-XX-XXT10:14:13.2334379Z",
"id": "/subscriptions/XXXXXXXXXXXXXX/providers/Microsoft.ManagedNetworkFabric/locations/EASTUS/operationStatuses/e239299a-8c71-426e-DA565ABE0036AB",
"name": "e239299a-8c71-426e-8460-58d4c0b470e2\*E98FEC8C2D6479A6C0A450CE6E20DA4C9DDBF225A07F7F4850DA565ABE0036AB",
"properties": null,
"resourceId": "/subscriptions/XXXXXXXXXXXX/resourceGroups/ResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/ResourceName",
"startTime": "2024-XX-XXT10:13:52.0438351Z",
"status": "Succeeded"
}
```

## Shut down the peer group at VRF level

This example shows how the RW configuration is shuts down the peer group at a VRF level.

```bash
sh ip bgp  summary vrf gfab1-isd
```

```Output
BGP summary information for VRF gfab1-isd
Router identifier 10.XXX.14.34, local AS number 650XX
Neighbor Status Codes: m - Under maintenance
  Neighbor            V AS           MsgRcvd   MsgSent  InQ OutQ  Up/Down State   PfxRcd PfxAcc
  10.XXX.13.15        4 650XX         129458    168981    0    0 00:06:50 Estab   189    189
  10.XXX.30.18        4 650XX          42220     42522    0    0 00:00:44 Estab   154    154
**  10.XXX.157.8        4 645XX          69211     74503    0    0   21d20h Estab   4      4**
  fda0:XXXX:XXXX:d::f 4 650XX         132192    171982    0    0   28d18h Estab   0      0
```

```azurecli
az networkfabric device run-rw --resource-name <ResourceName>; --resource-group <ResourceGroupName> --rw-command "router bgp 65055\\n neighbor untrustnetwork shutdown"
```

| Parameter                | Description                                                                                                                   |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `az networkfabric device run-rw` | Azure CLI command for executing a read-write operation on a network device within Azure Network Fabric.                         |
| `--resource-name`   | Specifies the name of the resource (network device) on which the RW operation is performed.                                 |
| `--resource-group` | Specifies the name of the resource group that contains the network device.                                                       |
| `--rw-command "router bgp 65055\n neighbor untrustnetwork shutdown"` | Specifies the RW commands to be executed on the network device. These commands configure BGP settings to shut down the neighbor named "untrustnetwork". |

Expected output:

```azurecli
{}
```

```bash
sh ip bgp  summary vrf gfab1-isd
```

```Output
BGP summary information for VRF gfab1-isd
Router identifier 10.XXX.14.34,
Neighbor            V AS           MsgRcvd   MsgSent  InQ OutQ  Up/Down State   PfxRcd PfxAcc
  10.XXX.13.15        4 65055         129462    168986    0    0 00:10:10 Estab   189    189
  10.XXX.30.18        4 65055          42224     42527    0    0 00:04:04 Estab   154    154
  fda0:XXX:XXXX:d::f 4 65055       132196    171987    0    0   28d18h Estab   0      0
```

```azurecli
AR-CE1)#Apr  X XX-XX:09 AR-CE1 Bgp: %BGP-3-NOTIFICATION: sent to neighbor **10.XXX.157.8** (VRF gfab1-isd AS 64512) 6/2 (Cease/administrative shutdown <Hard Reset>) reason: 

Apr  8 13:24:11 AR-CE1 Bgp: %BGP-3-NOTIFICATION: sent to neighbor **10.XXX.157.8** (VRF gfab1-isd AS 64512) 6/5 (Cease/connection rejected) 0 bytes 
```

Command with `--no-wait` `--debug`

```azurecli
az networkfabric device run-rw --resource-name <ResourceName> --resource-group <ResourceGroupName> --rw-command "router bgp 65055\n neighbor untrustnetwork shutdown" --no-wait --debug
```

| Parameter                | Description                                                                                                                   |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `az networkfabric device run-rw` | Azure CLI command for executing a read-write operation on a network device within Azure Network Fabric.                         |
| `--resource-name`   | Specifies the name of the resource (network device) on which the RW operation is performed.                                 |
| `--resource-group` | Specifies the name of the resource group that contains the network device.                                                       |
| `--rw-command "router bgp 65055\n neighbor untrustnetwork shutdown"` | Specifies the RW commands to be executed on the network device. These commands configure BGP settings to shut down the neighbor named "untrustnetwork". |
| `--no-wait`              | Indicates that the command should be executed asynchronously without waiting for the operation to complete.                   |
| `--debug`                 | Flag enabling debug mode, providing additional information about the execution of the command for troubleshooting purposes.   |


Expected truncated output:

```Truncated output
cli.knack.cli: Command arguments: ['networkfabric', 'device', 'run-rw', '--resource-name', <ResourceName>, '--resource-group', <ResourceGroup>, '--rw-command', 'router bgp 65055\\n neighbor untrustnetwork shutdown', '--debug'] 
cli.knack.cli: __init__ debug log: 
Enable color in terminal. 
cli.knack.cli: Event: Cli.PreExecute [] 
cli.azure.cli.core.sdk.policies:     'Expires': '-1' 
cli.azure.cli.core.sdk.policies:     'Location': 'https://eastus2euap.management.azure.com/subscriptions/XXXXXXXXXX/providers/Microsoft.ManagedNetworkFabric/locations/EASTUS/operationStatuses/4659700f-0280-491d-b478-491c6a88628c*F348648BDC06F42B2EDBC6E58?api-version=2022-01-15-privatepreview&t=638481804853087320 
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

```azurecli
https://eastus.management.azure.com/subscriptions/XXXXXXXX/providers/Microsoft.ManagedNetworkFabric/locations/EASTUS/operationStatuses/e239299a-8c71-426e-8460-58d4c0b470e2AB?api-version=2022-01-15-privatepreview

{

"endTime": "2024-XX-XXT10:14:13.2334379Z",
"id": "/subscriptions/XXXXXXXXXXXXXX/providers/Microsoft.ManagedNetworkFabric/locations/EASTUS/operationStatuses/e239299a-8c71-426e-DA565ABE0036AB",
"name": "e239299a-8c71-426e-8460-58d4c0b470e2\*E98FEC8C2D6479A6C0A450CE6E20DA4C9DDBF225A07F7F4850DA565ABE0036AB",
"properties": null,
"resourceId": "/subscriptions/XXXXXXXXXXXX/resourceGroups/ResourceGroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/ResourceName",
"startTime": "2024-XX-XXT10:13:52.0438351Z",
"status": "Succeeded"
}
```

## Incorrect configuration operation

If you try to implement a configuration command on the device and the configuration is  incorrect, the configuration isn't enforced on the device. The prompt yields a typical error response, indicating a gNMI SET failure. To rectify this error, reapply the correct configuration. There's no change to the state of the device.

```azurecli
az networkfabric device run-rw --resource-name <ResourceName> --resource-group <ResourceGroupName> --rw-command "router bgp 4444\n vrf gfab1-isd\n niehgbor 10.100.30.18 shudown"
```

| Parameter                | Description                                                                                                                   |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `az networkfabric device run-rw` | Azure CLI command for executing a read-write operation on a network device within Azure Network Fabric.                         |
| `--resource-name`   | Specifies the name of the resource (network device) on which the RW operation is performed.                                 |
| `--resource-group` | Specifies the name of the resource group that contains the network device.                                                       |
| `--rw-command "router bgp 4444\n vrf gfab1-isd\n niehgbor 10.100.30.18 shudown"` | Specifies the RW commands to be executed on the network device. These commands configure BGP settings to shut down the neighbor with IP address 10.100.30.18 within the VRF named "gfab1-isd". |


Expected output:

```Output
Error: Message: \[GNMI SET failed. Error: GNMI SET failed: rpc error: code = config failed to apply.
```

## Related content

- [Run read write commands](concepts-network-fabric-read-write-commands.md)