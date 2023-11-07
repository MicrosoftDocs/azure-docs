---
title: 'Azure ExpressRoute: Configure ExpressRoute Global Reach: CLI'
description: Learn how to link ExpressRoute circuits together to make a private network between your on-premises networks and enable Global Reach by using the Azure CLI.
services: expressroute
author: duongau

ms.service: expressroute
ms.topic: how-to
ms.date: 01/07/2021
ms.author: duau 
ms.custom: devx-track-azurecli


---

# Configure ExpressRoute Global Reach by using the Azure CLI

This article helps you configure Azure ExpressRoute Global Reach by using the Azure CLI. For more information, see [ExpressRoute Global Reach](expressroute-global-reach.md).
 
Before you start configuration, complete the following requirements:

* Install the latest version of the Azure CLI. See [Install the Azure CLI](/cli/azure/install-azure-cli) and [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli).
* Understand the ExpressRoute circuit-provisioning [workflows](expressroute-workflows.md).
* Make sure your ExpressRoute circuits are in the Provisioned state.
* Make sure Azure private peering is configured on your ExpressRoute circuits.  

### Sign in to your Azure account

To start configuration, sign in to your Azure account. The following command opens your default browser and prompts you for the sign-in credentials for your Azure account:  

```azurecli
az login
```

If you have multiple Azure subscriptions, check the subscriptions for the account:

```azurecli
az account list
```

Specify the subscription that you want to use:

```azurecli
az account set --subscription <your subscription ID>
```

### Identify your ExpressRoute circuits for configuration

You can enable ExpressRoute Global Reach between any two ExpressRoute circuits. The circuits are required to be in supported countries/regions and were created at different peering locations. If your subscription owns both circuits, you may select either circuit to run the configuration. However, if the two circuits are in different Azure subscriptions you must create an authorization key from one of the circuits. Using the authorization key generated from the first circuit you can enable Global Reach on the second circuit.

> [!NOTE]
> ExpressRoute Global Reach configurations can only be seen from the configured circuit.

## Enable connectivity between your on-premises networks

When running the command to enable connectivity, note the following requirements for parameter values:

* *peer-circuit* should be the full resource ID. For example:

  > /subscriptions/{your_subscription_id}/resourceGroups/{your_resource_group}/providers/Microsoft.Network/expressRouteCircuits/{your_circuit_name}/peerings/AzurePrivatePeering

* *address-prefix* must be a "/29" IPv4 subnet (for example, "10.0.0.0/29"). We use IP addresses in this subnet to establish connectivity between the two ExpressRoute circuits. You can't use addresses in this subnet in your Azure virtual networks or in your on-premises networks.

Run the following CLI command to connect two ExpressRoute circuits:

```azurecli
az network express-route peering connection create -g <ResourceGroupName> --circuit-name <Circuit1Name> --peering-name AzurePrivatePeering -n <ConnectionName> --peer-circuit <Circuit2ResourceID> --address-prefix <__.__.__.__/29>
```

The CLI output looks like this:

```output
{
  "addressPrefix": "<__.__.__.__/29>",
  "authorizationKey": null,
  "circuitConnectionStatus": "Connected",
  "etag": "W/\"48d682f9-c232-4151-a09f-fab7cb56369a\"",
  "expressRouteCircuitPeering": {
    "id": "/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/expressRouteCircuits/<Circuit1Name>/peerings/AzurePrivatePeering",
    "resourceGroup": "<ResourceGroupName>"
  },
  "id": "/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/expressRouteCircuits/<Circuit1Name>/peerings/AzurePrivatePeering/connections/<ConnectionName>",
  "name": "<ConnectionName>",
  "peerExpressRouteCircuitPeering": {
    "id": "/subscriptions/<SubscriptionID>/resourceGroups/<Circuit2ResourceGroupName>/providers/Microsoft.Network/expressRouteCircuits/<Circuit2Name>/peerings/AzurePrivatePeering",
    "resourceGroup": "<Circuit2ResourceGroupName>"
  },
  "provisioningState": "Succeeded",
  "resourceGroup": "<ResourceGroupName>",
  "type": "Microsoft.Network/expressRouteCircuits/peerings/connections"
}
```

When this operation is complete, you'll have connectivity between your on-premises networks on both sides through your two ExpressRoute circuits.

## Enable connectivity between ExpressRoute circuits in different Azure subscriptions

If the two circuits aren't in the same Azure subscription, you need authorization. In the following configuration, you generate authorization in circuit 2's subscription. Then you pass the authorization key to circuit 1.

1. Generate an authorization key:

   ```azurecli
   az network express-route auth create --circuit-name <Circuit2Name> -g <Circuit2ResourceGroupName> -n <AuthorizationName>
   ```

   The CLI output looks like this:

   ```output
   {
     "authorizationKey": "<authorizationKey>",
     "authorizationUseStatus": "Available",
     "etag": "W/\"cfd15a2f-43a1-4361-9403-6a0be00746ed\"",
     "id": "/subscriptions/<SubscriptionID>/resourceGroups/<Circuit2ResourceGroupName>/providers/Microsoft.Network/expressRouteCircuits/<Circuit2Name>/authorizations/<AuthorizationName>",
     "name": "<AuthorizationName>",
     "provisioningState": "Succeeded",
     "resourceGroup": "<Circuit2ResourceGroupName>",
     "type": "Microsoft.Network/expressRouteCircuits/authorizations"
   }
   ```

1. Make a note of both the resource ID and the authorization key for circuit 2.

1. Run the following command against circuit 1, passing in circuit 2's resource ID and authorization key:

   ```azurecli
   az network express-route peering connection create -g <ResourceGroupName> --circuit-name <Circuit1Name> --peering-name AzurePrivatePeering -n <ConnectionName> --peer-circuit <Circuit2ResourceID> --address-prefix <__.__.__.__/29> --authorization-key <authorizationKey>
   ```

When this operation is complete, you'll have connectivity between your on-premises networks on both sides through your two ExpressRoute circuits.

## Get and verify the configuration

Use the following command to verify the configuration on the circuit where the configuration was made (circuit 1 in the preceding example):

```azurecli
az network express-route show -n <CircuitName> -g <ResourceGroupName>
```

In the CLI output, you'll see *CircuitConnectionStatus*. It tells you whether the connectivity between the two circuits is established ("Connected") or not established ("Disconnected"). 

## Disable connectivity between your on-premises networks

To disable connectivity, run the following command against the circuit where the configuration was made (circuit 1 in the earlier example).

```azurecli
az network express-route peering connection delete -g <ResourceGroupName> --circuit-name <Circuit1Name> --peering-name AzurePrivatePeering -n <ConnectionName>
```

Use the ```show``` command to verify the status.

When this operation is complete, you'll no longer have connectivity between your on-premises networks through your ExpressRoute circuits.

## Next steps

* [Learn more about ExpressRoute Global Reach](expressroute-global-reach.md)
* [Verify ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
* [Link an ExpressRoute circuit to a virtual network](expressroute-howto-linkvnet-arm.md)
