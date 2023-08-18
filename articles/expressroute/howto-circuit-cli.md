---
title: 'Quickstart: Create and modify an ExpressRoute circuit: Azure CLI'
description: This quickstart shows how to create, provision, verify, update, delete, and deprovision an ExpressRoute circuit using Azure CLI.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: quickstart
ms.date: 06/30/2023
ms.author: duau
ms.custom: devx-track-azurecli, mode-api
---

# Quickstart: Create and modify an ExpressRoute circuit using Azure CLI

This quickstart describes how to create an Azure ExpressRoute circuit by using the Command Line Interface (CLI). This article also shows you how to check the status, update, or delete and deprovision a circuit.

:::image type="content" source="media/expressroute-howto-circuit-portal-resource-manager/environment-diagram.png" alt-text="Diagram of ExpressRoute circuit deployment environment using Azure CLI.":::

## Prerequisites

* Review the [prerequisites](expressroute-prerequisites.md) and [workflows](expressroute-workflows.md) before you begin configuration.
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Install the latest version of the CLI commands (2.0 or later). For information about installing the CLI commands, see [Install the Azure CLI](/cli/azure/install-azure-cli) and [Get Started with Azure CLI](/cli/azure/get-started-with-azure-cli).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## <a name="create"></a>Create and provision an ExpressRoute circuit

### Sign in to your Azure account and select your subscription

To begin your configuration, sign in to your Azure account. If you use the Cloud Shell Try It, you're signed in automatically. Use the following examples to help you connect:

```azurecli-interactive
az login
```

Check the subscriptions for the account.

```azurecli-interactive
az account list
```

Select the subscription for which you want to create an ExpressRoute circuit.

```azurecli-interactive
az account set --subscription "<subscription ID>"
```

### Get the list of supported providers, locations, and bandwidths

Before you create an ExpressRoute circuit, you need the list of supported connectivity providers, locations, and bandwidth options. The CLI command `az network express-route list-service-providers` returns this information, which you use in later steps:

```azurecli-interactive
az network express-route list-service-providers
```

The response is similar to the following example:

```output
[
  {
    "bandwidthsOffered": [
      {
        "offerName": "50Mbps",
        "valueInMbps": 50
      },
      {
        "offerName": "100Mbps",
        "valueInMbps": 100
      },
      {
        "offerName": "200Mbps",
        "valueInMbps": 200
      },
      {
        "offerName": "500Mbps",
        "valueInMbps": 500
      },
      {
        "offerName": "1Gbps",
        "valueInMbps": 1000
      },
      {
        "offerName": "2Gbps",
        "valueInMbps": 2000
      },
      {
        "offerName": "5Gbps",
        "valueInMbps": 5000
      },
      {
        "offerName": "10Gbps",
        "valueInMbps": 10000
      }
    ],
    "id": "/subscriptions//resourceGroups//providers/Microsoft.Network/expressRouteServiceProviders/",
    "location": null,
    "name": "AARNet",
    "peeringLocations": [
      "Melbourne",
      "Sydney"
    ],
    "provisioningState": "Succeeded",
    "resourceGroup": "",
    "tags": null,
    "type": "Microsoft.Network/expressRouteServiceProviders"
  },
```

Check the response to see if your connectivity provider is listed. Make a note of the following information, which you need when you create a circuit:

* Name
* PeeringLocations
* BandwidthsOffered

You're now ready to create an ExpressRoute circuit.

### Create an ExpressRoute circuit

> [!IMPORTANT]
> Your ExpressRoute circuit is billed from the moment a service key is issued. Perform this operation when the connectivity provider is ready to provision the circuit.
>
>

If you don't already have a resource group, you must create one before you create your ExpressRoute circuit. You can create a resource group by running the following command:

```azurecli-interactive
az group create -n ExpressRouteResourceGroup -l "West US"
```

The following example shows how to create a 200-Mbps ExpressRoute circuit through Equinix in Silicon Valley. If you're using a different provider and different settings, replace that information when you make your request.

Make sure that you specify the correct SKU tier and SKU family:

* SKU tier determines whether an ExpressRoute circuit is [Local](expressroute-faqs.md#expressroute-local), Standard, or [Premium](expressroute-faqs.md#expressroute-premium). You can specify *Local*, *Standard, or *Premium*.
* SKU family determines the billing type. You can specify *MeteredData* for a metered data plan and *UnlimitedData* for an unlimited data plan. You can change the billing type from *MeteredData* to *UnlimitedData*, but you can't change the type from *UnlimitedData* to *MeteredData*. A *Local* circuit is *UnlimitedData* only.


Your ExpressRoute circuit is billed from the moment a service key is issued. The following example is a request for a new service key:

```azurecli-interactive
az network express-route create --bandwidth 200 -n MyCircuit --peering-location "Silicon Valley" -g ExpressRouteResourceGroup --provider "Equinix" -l "West US" --sku-family MeteredData --sku-tier Standard
```

The response contains the service key.

### List all ExpressRoute circuits

To get a list of all the ExpressRoute circuits that you created, run the `az network express-route list` command. You can retrieve this information at any time by using this command. To list all circuits, make the call with no parameters.

```azurecli-interactive
az network express-route list
```

Your service key is listed in the *ServiceKey* field of the response.

```output
"allowClassicOperations": false,
"authorizations": [],
"circuitProvisioningState": "Enabled",
"etag": "W/\"1262c492-ffef-4a63-95a8-a6002736b8c4\"",
"gatewayManagerEtag": null,
"id": "/subscriptions/81ab786c-56eb-4a4d-bb5f-f60329772466/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/MyCircuit",
"location": "westus",
"name": "MyCircuit",
"peerings": [],
"provisioningState": "Succeeded",
"resourceGroup": "ExpressRouteResourceGroup",
"serviceKey": "1d05cf70-1db5-419f-ad86-1ca62c3c125b",
"serviceProviderNotes": null,
"serviceProviderProperties": {
  "bandwidthInMbps": 200,
  "peeringLocation": "Silicon Valley",
  "serviceProviderName": "Equinix"
},
"serviceProviderProvisioningState": "NotProvisioned",
"sku": {
  "family": "UnlimitedData",
  "name": "Standard_MeteredData",
  "tier": "Standard"
},
"tags": null,
"type": "Microsoft.Network/expressRouteCircuits]
```

You can get detailed descriptions of all the parameters by running the command using the '-h' parameter.

```azurecli-interactive
az network express-route list -h
```

### Send the service key to your connectivity provider for provisioning

'ServiceProviderProvisioningState' provides information about the current state of provisioning on the service-provider side. The status provides the state on the Microsoft side. For more information, see the [Workflows article](expressroute-workflows.md#expressroute-circuit-provisioning-states).

When you create a new ExpressRoute circuit, the circuit is in the following state:

```output
"serviceProviderProvisioningState": "NotProvisioned"
"circuitProvisioningState": "Enabled"
```

The circuit changes to the following state when the connectivity provider is currently enabling it for you:

```output
"serviceProviderProvisioningState": "Provisioning"
"circuitProvisioningState": "Enabled"
```

To use the ExpressRoute circuit, it must be in the following state:

```output
"serviceProviderProvisioningState": "Provisioned"
"circuitProvisioningState": "Enabled
```

### Periodically check the status and the state of the circuit key

Checking the status and the state of the service key lets you know when your provider has provisioned your circuit. After the circuit has been configured, *ServiceProviderProvisioningState* appears as *Provisioned*, as shown in the following example:

```azurecli-interactive
az network express-route show --resource-group ExpressRouteResourceGroup --name MyCircuit
```

The response is similar to the following example:

```output
"allowClassicOperations": false,
"authorizations": [],
"circuitProvisioningState": "Enabled",
"etag": "W/\"1262c492-ffef-4a63-95a8-a6002736b8c4\"",
"gatewayManagerEtag": null,
"id": "/subscriptions/81ab786c-56eb-4a4d-bb5f-f60329772466/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/MyCircuit",
"location": "westus",
"name": "MyCircuit",
"peerings": [],
"provisioningState": "Succeeded",
"resourceGroup": "ExpressRouteResourceGroup",
"serviceKey": "1d05cf70-1db5-419f-ad86-1ca62c3c125b",
"serviceProviderNotes": null,
"serviceProviderProperties": {
  "bandwidthInMbps": 200,
  "peeringLocation": "Silicon Valley",
  "serviceProviderName": "Equinix"
},
"serviceProviderProvisioningState": "NotProvisioned",
"sku": {
  "family": "UnlimitedData",
  "name": "Standard_MeteredData",
  "tier": "Standard"
},
"tags": null,
"type": "Microsoft.Network/expressRouteCircuits]
```

### Create your routing configuration

For step-by-step instructions, see the [ExpressRoute circuit routing configuration](howto-routing-cli.md) article to create and modify circuit peerings.

> [!IMPORTANT]
> These instructions only apply to circuits that are created with service providers that offer layer 2 connectivity services. If you're using a service provider that offers managed layer 3 services (typically an IP VPN, like MPLS), your connectivity provider configures and manages routing for you.
>

### Link a virtual network to an ExpressRoute circuit

Next, link a virtual network to your ExpressRoute circuit. Use the [Linking virtual networks to ExpressRoute circuits](expressroute-howto-linkvnet-cli.md) article.

## <a name="modify"></a>Modifying an ExpressRoute circuit

You can modify certain properties of an ExpressRoute circuit without impacting connectivity. You can make the following changes with no downtime:

* You can enable or disable an ExpressRoute premium add-on for your ExpressRoute circuit.
* You can increase the bandwidth of your ExpressRoute circuit provided there's capacity available on the port. However, downgrading the bandwidth of a circuit isn't supported.
* You can change the metering plan from Metered Data to Unlimited Data. However, changing the metering plan from Unlimited Data to Metered Data isn't supported.
* You can enable and disable *Allow Classic Operations*.

For more information on limits and limitations, see the [ExpressRoute FAQ](expressroute-faqs.md).

### To enable the ExpressRoute premium add-on

You can enable the ExpressRoute premium add-on for your existing circuit by using the following command:

```azurecli-interactive
az network express-route update -n MyCircuit -g ExpressRouteResourceGroup --sku-tier Premium
```

The circuit now has the ExpressRoute premium add-on features enabled. We begin billing you for the premium add-on capability as soon as the command has successfully run.

### To disable the ExpressRoute premium add-on

> [!IMPORTANT]
> This operation can fail if you're using resources that are greater than what is permitted for the standard circuit.
>
>

Before disabling the ExpressRoute premium add-on, understand the following criteria:

* Before you downgrade from premium to standard, you must ensure that the number of virtual networks that are linked to the circuit is less than 10. If you don't, your update request fails, and we bill you at premium rates.
* All virtual networks in other geopolitical regions must be first unlinked. If you don't remove the link, your update request fails and we continue to bill you at premium rates.
* Your route table must be less than 4,000 routes for private peering. If your route table size is greater than 4,000 routes, the BGP session drops. The BGP session doesn't reestablish until the number of advertised prefixes is under 4,000.

You can disable the ExpressRoute premium add-on for the existing circuit by using the following example:

```azurecli-interactive
az network express-route update -n MyCircuit -g ExpressRouteResourceGroup --sku-tier Standard
```

### To update the ExpressRoute circuit bandwidth

For the supported bandwidth options for your provider, check the [ExpressRoute FAQ](expressroute-faqs.md). You can pick any size greater than the size of your existing circuit.

> [!IMPORTANT]
> If there is inadequate capacity on the existing port, you may have to recreate the ExpressRoute circuit. You cannot upgrade the circuit if there is no additional capacity available at that location.
>
> You cannot reduce the bandwidth of an ExpressRoute circuit without disruption. Downgrading bandwidth requires you to deprovision the ExpressRoute circuit, and then reprovision a new ExpressRoute circuit.
>

After you decide the size you need, use the following command to resize your circuit:

```azurecli-interactive
az network express-route update -n MyCircuit -g ExpressRouteResourceGroup --bandwidth 1000
```

Your circuit is upgraded on the Microsoft side. Next, you must contact your connectivity provider to update configurations on their side to match this change. After you make this notification, we begin billing you for the updated bandwidth option.

### To move the SKU from metered to unlimited

You can change the SKU of an ExpressRoute circuit by using the following example:

```azurecli-interactive
az network express-route update -n MyCircuit -g ExpressRouteResourceGroup --sku-family UnlimitedData
```

### To control access to the classic and Resource Manager environments

Review the instructions in [Move ExpressRoute circuits from the classic to the Resource Manager deployment model](expressroute-howto-move-arm.md).

## <a name="delete"></a>Deprovisioning an ExpressRoute circuit

To deprovision and delete an ExpressRoute circuit, make sure you understand the following criteria:

* All virtual networks must be unlinked from the ExpressRoute circuit. If this operation fails, check to see if any virtual networks are linked to the circuit.
* If the ExpressRoute circuit service provider provisioning state is **Provisioning** or **Provisioned** you must work with your service provider to deprovision the circuit on their side. We continue to reserve resources and bill you until the service provider completes deprovisioning the circuit and notifies us.
* If the service provider has deprovisioned the circuit meaning the service provider provisioning state gets set to **Not provisioned**, you can delete the circuit. The billing for the circuit stop.

## Clean up resources

You can delete your ExpressRoute circuit by running the following command:

```azurecli-interactive
az network express-route delete  -n MyCircuit -g ExpressRouteResourceGroup
```

## Next steps

After you create your circuit and provision it with your provider, continue to the next step to configure the peering:

> [!div class="nextstepaction"]
> [Create and modify routing for your ExpressRoute circuit](howto-routing-cli.md)
