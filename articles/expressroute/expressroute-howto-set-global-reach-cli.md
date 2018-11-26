---
title: 'Configure Azure ExpressRoute Global Reach using Azure CLI | Microsoft Docs'
description: This article helps you link ExpressRoute circuits together to make a private network between your on-premises networks and enable Global Reach.
documentationcenter: na
services: expressroute
author: cherylmc

ms.service: expressroute
ms.topic: conceptual
ms.date: 11/14/2018
ms.author: cherylmc

---

# Configure ExpressRoute Global Reach Using Azure CLI (Preview)
This article helps you configure ExpressRoute Global Reach using Azure CLI. For more information, see [ExpressRouteRoute Global Reach](expressroute-global-reach.md).
 
## Before you begin
> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
> 


Before you start configuration, you need to check the following requirements.

* Install the latest version of Azure CLI. See [Install Azure CLI](/cli/azure/install-azure-cli) and [Get Started with Azure CLI](/cli/azure/get-started-with-azure-cli).
* Understand the ExpressRoute circuit provisioning [workflows](expressroute-workflows.md).
* Make sure your ExpressRoute circuits are in Provisioned state.
* Make sure Azure private peering is configured on your ExpressRoute circuits.  

### Log into your Azure account
To start the configuration, you must log into your Azure account. The command will open your default browser and prompt you for the login credential for your Azure account.  

```azurecli
az login
```

If you have multiple Azure subscriptions, check the subscriptions for the account.

```azurecli
az account list
```

Specify the subscription that you want to use.

```azurecli
az account set --subscription <your subscription ID>
```

### Identify your ExpressRoute circuits for configuration
You can enable ExpressRoute Global Reach between any two ExpressRoute circuits as long as they're located in the supported countries and they're created at different peering locations. If your subscription owns both circuits you can choose either circuit to run the configuration in the sections below. If the two circuits are in different Azure subscriptions, you will need authorization from one Azure subscription and pass in the authorization key when you run the configuration command in the other Azure subscription.

## Enable connectivity between your on-premises networks

Run the following CLI to connect two ExpressRoute circuits.

> [!NOTE]
> *peer-circuit* should be the full resource ID, e.g.
> ```
> */subscriptions/{your_subscription_id}/resourceGroups/{your_resource_group}/providers/Microsoft.Network/expressRouteCircuits/{your_circuit_name}*
> ```
> 

```azurecli
az network express-route peering connection create -g <ResourceGroupName> --circuit-name <Circuit1Name> --peering-name AzurePrivatePeering -n <ConnectionName> --peer-circuit <Circuit2ResourceID> --address-prefix <__.__.__.__/29>
```

> [!IMPORTANT]
> *-AddressPrefix* must be a /29 IPv4 subnet, e.g. "10.0.0.0/29". We will use IP addresses in this subnet to establish connectivity between the two ExpressRoute circuits. You must not use addresses in this subnet in your Azure VNets or in your on-premises networks.
> 

The CLI output looks like the following.

```azurecli
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

When the above operation is complete, you should have connectivity between your on-premises networks on both sides through your two ExpressRoute circuits.

### ExpressRoute circuits in different Azure subscriptions

If the two circuits are not in the same Azure subscription, you will need authorization. In the following configuration, authorization is generated in circuit 2's subscription and the authorization key is passed to circuit 1.

Generate an authorization key. 
```azurecli
az network express-route auth create --circuit-name <Circuit2Name> -g <Circuit2ResourceGroupName> -n <AuthorizationName>
```

The CLI output looks like the following.

```azurecli
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

Make a note of circuit 2's resource Id as well as the authorization key.

Run the following command against circuit 1. Pass in circuit 2's resource Id and the authorization key 
```azurecli
az network express-route peering connection create -g <ResourceGroupName> --circuit-name <Circuit1Name> --peering-name AzurePrivatePeering -n <ConnectionName> --peer-circuit <Circuit2ResourceID> --address-prefix <__.__.__.__/29> --authorization-key <authorizationKey>
```

When the above operation is complete, you should have connectivity between your on-premises networks on both sides through your two ExpressRoute circuits.

## Get and verify the configuration

Use the following command to verify the configuration on the circuit where the configuration was made, i.e. circuit 1 in the above example.

```azurecli
az network express-route show -n <CircuitName> -g <ResourceGroupName>
```

In the CLI output you'll see *CircuitConnectionStatus*. It will tell you whether the connectivity between the two circuits is established, "Connected", or not, "Disconnected". 

## Disable connectivity between your on-premises networks

To disable it, run the commands against the circuit where the configuration was made, i.e. circuit 1 in the above example.

```azurecli
az network express-route peering connection delete -g <ResourceGroupName> --circuit-name <Circuit1Name> --peering-name AzurePrivatePeering -n <ConnectionName>
```

You can run the Show CLI to verify the status. 

After the above operation is complete, you will no longer have connectivity between your on-premises network through your ExpressRoute circuits. 


## Next steps
* [Learn more about ExpressRoute Global Reach](expressroute-global-reach.md)
* [Verify ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
* [Link ExpressRoute circuit to Azure virtual network](expressroute-howto-linkvnet-arm.md)


