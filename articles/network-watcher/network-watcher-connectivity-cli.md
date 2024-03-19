---
title: Troubleshoot outbound connections - Azure CLI
titleSuffix: Azure Network Watcher
description: Learn how to use the connection troubleshoot feature of Azure Network Watcher to troubleshoot outbound connections using the Azure CLI.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 03/18/2024
ms.custom: devx-track-azurecli

#CustomerIntent: As an Azure administrator, I want to learn how to use Connection Troubleshoot to diagnose outbound connectivity issues in Azure using the Azure CLI.
---

# Troubleshoot outbound connections using the Azure CLI

In this article, you learn how to use the connection troubleshoot feature of Azure Network Watcher to diagnose and troubleshoot connectivity issues. For more information about connection troubleshoot, see [Connection troubleshoot overview](connection-troubleshoot-overview.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Network Watcher enabled in the region of the virtual machine (VM) you want to troubleshoot. By default, Azure enables Network Watcher in a region when you create a virtual network in it. For more information, see [Enable or disable Azure Network Watcher](network-watcher-create.md).

- A virtual machine with Network Watcher agent VM extension installed on it and the following outbound TCP connectivity:
    - to the storage account over port 443
    - to 169.254.169.254 over port 80
    - to 168.63.129.16 over port 8037

- A second virtual machine with inbound TCP connectivity from 168.63.129.16 over the port being tested (for Port scanner diagnostic test).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

> [!NOTE]
> - To install the extension on a Windows virtual machine, see [Network Watcher agent VM extension for Windows](../virtual-machines/extensions/network-watcher-windows.md?toc=/azure/network-watcher/toc.json&bc=/azure/network-watcher/breadcrumb/toc.json).
> - To install the extension on a Linux virtual machine, see [Network Watcher agent VM extension for Linux](../virtual-machines/extensions/network-watcher-linux.md?toc=/azure/network-watcher/toc.json&bc=/azure/network-watcher/breadcrumb/toc.json).
> - To update an already installed extension, see [Update Network Watcher agent VM extension to the latest version](../virtual-machines/extensions/network-watcher-update.md?toc=/azure/network-watcher/toc.json&bc=/azure/network-watcher/breadcrumb/toc.json).

## Check connectivity to a virtual machine

This example checks connectivity to a destination virtual machine over port 80.

### Example

```azurecli-interactive
az network watcher test-connectivity --resource-group ContosoRG --source-resource MultiTierApp0 --dest-resource Database0 --dest-port 80
```

### Response

The following response is from the previous example.  In this response, the `ConnectionStatus` is **Unreachable**. You can see that all the probes sent failed. The connectivity failed at the virtual appliance due to a user-configured `NetworkSecurityRule` named **UserRule_Port80**, configured to block incoming traffic on port 80. This information can be used to research connection issues.

```json
{
  "avgLatencyInMs": null,
  "connectionStatus": "Unreachable",
  "hops": [
    {
      "address": "10.1.1.4",
      "id": "bb01d336-d881-4808-9fbc-72f091974d68",
      "issues": [],
      "nextHopIds": [
        "f8b074e9-9980-496b-a35e-619f9bcbf648"
      ],
      "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoRG/providers/Microsoft.Network/networkInterfaces/ap
pNic0/ipConfigurations/ipconfig1",
      "type": "Source"
    },
    {
      "address": "10.1.2.4",
      "id": "f8b074e9-9980-496b-a35e-619f9bcbf648",
      "issues": [],
      "nextHopIds": [
        "8a5857f3-6ab8-4b11-b9bf-a046d66b8696"
      ],
      "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoRG/providers/Microsoft.Network/networkInterfaces/fw
Nic/ipConfigurations/ipconfig1",
      "type": "VirtualAppliance"
    },
    {
      "address": "10.1.3.4",
      "id": "8a5857f3-6ab8-4b11-b9bf-a046d66b8696",
      "issues": [
        {
          "context": [
            {
              "key": "RuleName",
              "value": "UserRule_Port80"
            }
          ],
          "origin": "Outbound",
          "severity": "Error",
          "type": "NetworkSecurityRule"
        }
      ],
      "nextHopIds": [
        "6ce2f7a2-ceb4-4145-80e8-5d9f661655d6"
      ],
      "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoRG/providers/Microsoft.Network/networkInterfaces/au
Nic/ipConfigurations/ipconfig1",
      "type": "VirtualAppliance"
    },
    {
      "address": "10.1.4.4",
      "id": "6ce2f7a2-ceb4-4145-80e8-5d9f661655d6",
      "issues": [],
      "nextHopIds": [],
      "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoRG/providers/Microsoft.Network/networkInterfaces/db
Nic0/ipConfigurations/ipconfig1",
      "type": "VnetLocal"
    }
  ],
  "maxLatencyInMs": null,
  "minLatencyInMs": null,
  "probesFailed": 100,
  "probesSent": 100
}
```

## Validate routing issues

This example checks connectivity between a virtual machine and a remote endpoint.

### Example

```azurecli-interactive
az network watcher test-connectivity --resource-group ContosoRG --source-resource MultiTierApp0 --dest-address 13.107.21.200 --dest-port 80
```

### Response

In the following example, the `connectionStatus` is shown as **Unreachable**. In the `hops` details, you can see under `issues` that the traffic was blocked due to a `UserDefinedRoute`.

```json
{
  "avgLatencyInMs": null,
  "connectionStatus": "Unreachable",
  "hops": [
    {
      "address": "10.1.1.4",
      "id": "f2cb1868-2049-4839-b8ed-57a480d06f95",
      "issues": [
        {
          "context": [
            {
              "key": "RouteType",
              "value": "User"
            }
          ],
          "origin": "Outbound",
          "severity": "Error",
          "type": "UserDefinedRoute"
        }
      ],
      "nextHopIds": [
        "da4022db-0ab0-48c4-a507-dd4c03561ca5"
      ],
      "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoRG/providers/Microsoft.Network/networkInterfaces/ap
pNic0/ipConfigurations/ipconfig1",
      "type": "Source"
    },
    {
      "address": "13.107.21.200",
      "id": "da4022db-0ab0-48c4-a507-dd4c03561ca5",
      "issues": [],
      "nextHopIds": [],
      "resourceId": "Unknown",
      "type": "Destination"
    }
  ],
  "maxLatencyInMs": null,
  "minLatencyInMs": null,
  "probesFailed": 100,
  "probesSent": 100
}
```

## Check website latency

The following example checks the connectivity to a website.

### Example

```azurecli-interactive
az network watcher test-connectivity --resource-group ContosoRG --source-resource MultiTierApp0 --dest-address https://bing.com --dest-port 80
```

### Response

In the following response, you can see the `connectionStatus` shows as **Reachable**. When a connection is successful, latency values are provided.

```json
{
  "avgLatencyInMs": 2,
  "connectionStatus": "Reachable",
  "hops": [
    {
      "address": "10.1.1.4",
      "id": "639c2d19-e163-4dfd-8737-5018dd1168ae",
      "issues": [],
      "nextHopIds": [
        "fd43a6e7-c758-4f48-90aa-8db99105a4a3"
      ],
      "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoRG/providers/Microsoft.Network/networkInterfaces/ap
pNic0/ipConfigurations/ipconfig1",
      "type": "Source"
    },
    {
      "address": "204.79.197.200",
      "id": "fd43a6e7-c758-4f48-90aa-8db99105a4a3",
      "issues": [],
      "nextHopIds": [],
      "resourceId": "Internet",
      "type": "Internet"
    }
  ],
  "maxLatencyInMs": 7,
  "minLatencyInMs": 0,
  "probesFailed": 0,
  "probesSent": 100
}
```

## Check connectivity to a storage endpoint

The following example checks the connectivity from a virtual machine to a blog storage account.

### Example

```azurecli-interactive
az network watcher test-connectivity --resource-group ContosoRG --source-resource MultiTierApp0 --dest-address https://contosoexamplesa.blob.core.windows.net/
```

### Response

The following json is the example response from running the previous cmdlet. As the check is successful, the `connectionStatus` property shows as **Reachable**.  You are provided the details regarding the number of hops required to reach the storage blob and latency.

```json
{
  "avgLatencyInMs": 1,
  "connectionStatus": "Reachable",
  "hops": [
    {
      "address": "10.1.1.4",
      "id": "5136acff-bf26-4c93-9966-4edb7dd40353",
      "issues": [],
      "nextHopIds": [
        "f8d958b7-3636-4d63-9441-602c1eb2fd56"
      ],
      "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoRG/providers/Microsoft.Network/networkInterfaces/appNic0/ipConfigurations/ipconfig1",
      "type": "Source"
    },
    {
      "address": "1.2.3.4",
      "id": "f8d958b7-3636-4d63-9441-602c1eb2fd56",
      "issues": [],
      "nextHopIds": [],
      "resourceId": "Internet",
      "type": "Internet"
    }
  ],
  "maxLatencyInMs": 7,
  "minLatencyInMs": 0,
  "probesFailed": 0,
  "probesSent": 100
}
```

## Next step

> [!div class="nextstepaction"]
> [Manage packet captures](packet-capture-vm-cli.md)
