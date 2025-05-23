---
title: Updating ExpressRoute Gateway Authorization Key in Azure Operator Nexus
description: Learn the process of updating ExpressRoute Gateway Authorization Key in Azure Operator Nexus
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 12/16/2024
ms.custom: template-how-to, devx-track-azurecli
---

# Updating ExpressRoute Gateway Authorization Key in Azure Operator Nexus

This guide provides step-by-step instructions for updating authorization keys for ExpressRoute circuits in Azure Operator Nexus. The process ensures continued secure connectivity between your on-premises network and Azure resources.

## Prerequisites

Before proceeding with the key update, ensure the following prerequisites are met:

- **Identify the Network Fabric Controller (NFC):** Locate the Network Fabric Controller (NFC) for which you want to update the ExpressRoute authorization keys.

- **Verify ExpressRoute Connections:** Ensure there are 4 operational ExpressRoute connections (2 for infrastructure ER GW and 2 for tenant ER GW) to 4 ExpressRoute circuits.

- **Generate New Authorization Keys:** Obtain new authorization keys for all circuits you intend to update.

## Procedure

### Step 1: Log in to Azure

1. Open your terminal or command prompt.

2. Run the following command to log in to your Azure account:

   ```Azure CLI
   az login
   ```

3. Set the active subscription for your Azure CLI session:

    ```Azure CLI
    az account set -s <Subscription ID>
    ```
   
Replace `<Subscription ID>` with your Azure subscription ID.

### Step 2: Retrieve existing authorization keys

- Retrieve the current authorization keys using the following command:

    ```Azure CLI
    az network express-route auth list \
        --resource-group <resource-group> \
        --circuit-name <circuit-name>
    ```

Replace `<resource-group>` and `<circuit-name>` with your specific resource group and circuit name.

#### Existing authorization keys

| Type of Connectivity | ExpressRoute Circuit Name | Authorization Key |
|----------------------|---------------------------|-------------------|
| Infrastructure       | er-circuit-A              | er-authz-key-a1   |
| Infrastructure       | er-circuit-B              | er-authz-key-b1   |
| Workload             | er-circuit-C              | er-authz-key-c1   |
| Workload             | er-circuit-D              | er-authz-key-d1   |

> [!NOTE]
> There are 4 ExpressRoute circuits, each with an existing connection.<br>
> This step must be repeated for each circuit to generate a new authorization key for each circuit.<br>
> The authorization keys provided here are sample values and should not be used as real keys.

### Step 3: Generate new authorization keys

- Use the command below to generate new authorization keys for the ExpressRoute circuits:

```Azure CLI
    az network express-route auth create \
        --resource-group <resource-group> \
        --circuit-name <circuit-name> \
        --name <authorization-name>
```

Replace `<resource-group>` and `<circuit-name>` with your specific resource group and circuit name.

#### New Authorization Keys

| Type of Connectivity | ExpressRoute Circuit Name | Authorization Key |
|----------------------|---------------------------|-------------------|
| Infrastructure       | er-circuit-A              | er-authz-key-a20  |
| Infrastructure       | er-circuit-B              | er-authz-key-b20  |
| Workload             | er-circuit-C              | er-authz-key-c20  |
| Workload             | er-circuit-D              | er-authz-key-d20  |

> [!NOTE]
> There are 4 ExpressRoute circuits, each with an existing connection.<br>
> This step must be repeated for each circuit to generate a new authorization key for each circuit.<br>
> The authorization keys provided here are sample values and should not be used as real keys.

### Step 4: Update Authorization Keys

There are 4 ExpressRoute circuits, each with an existing connection. Follow these steps to update the keys one at a time for infrastructure and workload connections.

> [!NOTE]
> Authorization key rotation will cause temporary network connectivity loss. Plan the updates carefully to minimize disruptions.

### Step 4.1: Update the First Infrastructure Authorization Key

- Run the following command to update the first infrastructure authorization key:

    ```Azure CLI
    az networkfabric controller update \
        --resource-group 'nfc resource group' \
        --resource-name 'nfc_name' \
        --infra-er-connections '[{expressRouteCircuitId:"er-circuit-A",expressRouteAuthorizationKey:"er-authz-key-a20"},{expressRouteCircuitId:"er-circuit-B",expressRouteAuthorizationKey:"er-authz-key-b1"}]' \
        --debug
    ```

Post-check: Verify that the new connection for **er-circuit-A** is operational.

### Step 4.2: Update the Second Infrastructure Authorization Key

- Run the following command to update the second infrastructure authorization key:

    ```Azure CLI
    az networkfabric controller update \
        --resource-group 'nfc resource group' \
        --resource-name 'nfc_name' \
        --infra-er-connections '[{expressRouteCircuitId:"er-circuit-A,expressRouteAuthorizationKey:"er-authz-key-a20"},{expressRouteCircuitId:"er-circuit-B",expressRouteAuthorizationKey:"er-authz-key-b20"}]' \
        --debug
    ```

Post-check: Verify that the new connection for **er-circuit-B** is operational.

### Step 4.3: Update the First Workload Authorization Key

- Run the following command to update the first workload authorization key:

    ```Azure CLI
    az networkfabric controller update \
        --resource-group 'nfc resource group' \
        --resource-name 'nfc_name' \
        --workload-er-connections '[{expressRouteCircuitId:"er-circuit-C",expressRouteAuthorizationKey:"er-authz-key-c20"},{expressRouteCircuitId:"er-circuit-D",expressRouteAuthorizationKey:"er-authz-key-d1"}]' \
        --debug
    ```
Post-check: Verify that the new connection for **er-circuit-C** is operational.

### Step 4.4: Update the Second Workload Authorization Key

- Run the following command to update the second workload authorization key:

    ```Azure CLI
    az networkfabric controller update \
    --resource-group 'nfc resource group' \
    --resource-name 'nfc_name' \
    --workload-er-connections '[{expressRouteCircuitId:"er-circuit-C",expressRouteAuthorizationKey:"er-authz-key-c20"},{expressRouteCircuitId:"er-circuit-D",expressRouteAuthorizationKey:"er-authz-key-d20"}]' \
    --debug
    ```

Post-check: Verify that the new connection for er-circuit-D is operational.

## Monitoring ExpressRoute Gateway Metrics

Use metrics from the ExpressRoute gateway to monitor the health of connections during the update process.

### Key Metric: Count of Routes Learned from Peer

During the update, you may observe a temporary dip in the count of routes learned. The count of routes learned should recover once the update is complete.

Each connection has 2 peers. By filtering metrics for BGP (Border Gateway Protocol) peers, you can confirm the specific connections impacted during the update. [For more details on monitoring](../expressroute/monitor-expressroute-reference.md).

:::image type="content" source="media/routes-learned-expressroute-gateway.png" lightbox="media/routes-learned-expressroute-gateway.png"  alt-text="Screenshot of sample routes learned on ExpressRoute Gateway.":::
