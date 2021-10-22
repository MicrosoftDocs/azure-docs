---
title: 'Tutorial: Isolate back-end communication with Virtual Network integration'
description: Learn how to secure connectivity to back-end Azure services that don't support managed identity natively.
ms.devlang: dotnet
ms.topic: tutorial
ms.date: 10/20/2021
---

# Tutorial: Isolate back-end communication in Azure App Service with Virtual Network integration

In this article you will configure an App Service app with secure, network-isolated communication to backend services. The example scenario used is in [Tutorial: Secure Cognitive Service connection from App Service using Key Vault](tutorial-connect-msi-keyvault.md). When you're finished, you have an App Service app that accesses both Key Vault and Cognitive Services through an [Azure virtual network](../virtual-network/virtual-networks-overview.md) (VNet), and no other traffic is allowed to access those back-end resources. All traffic will be isolated within your VNet using [VNet integration](web-sites-integrate-with-vnet.md) and [private endpoints](../private-link/private-endpoint-overview.md).

As a multi-tenanted service, outbound network traffic from your App Service app to other Azure services shares the same environment with other apps or even other subscriptions. While the traffic itself can be encrypted, certain scenarios may require an extra level of security by isolating back-end communication from other network traffic. These scenarios are typically accessible to large enterprises with a high level of expertise, but App Service puts it within reach with VNet integration.  

![scenario architecture](./media/tutorial-networking-isolate-vnet/architecture.png)

With this architecture: 

- Public traffic to the back-end services are blocked.
- Outbound traffic from App Service is routed to the VNet and can reach the back-end services.
- App Service is able to perform DNS resolution to the back-end services through the private DNS zones.

What you will learn:

> [!div class="checklist"]
> * Create a VNet and subnets for App Service VNet integration
> * Create private DNS zones
> * Create private endpoints
> * Configure VNet integration in App Service

## Prerequisites

The tutorial assumes that you have followed the [Tutorial: Secure Cognitive Service connection from App Service using Key Vault](tutorial-connect-msi-keyvault.md) and created the language detector app. 

The tutorial continues to use the following environment variables. Make sure you set them properly.

```azurecli-interactive
    groupName=myKVResourceGroup
    csResourceName=<cs-resource-name>
    appName=<app-name>
    vaultName=<vault-name>
    vaultResourceId=...
```

## Create VNet and subnets

1. Create a VNet.

    ```azurecli-interactive
    az network vnet create --resource-group securebackendsetup --location westeurope --name securebackend-vnet --address-prefixes 10.0.0.0/16
    ```

1. Create a subnet for the App Service VNet integration.

    ```azurecli-interactive
    az network vnet subnet create --resource-group securebackendsetup --vnet-name securebackend-vnet --name vnet-integration-subnet --address-prefixes 10.0.0.0/24 --delegations Microsoft.Web/serverfarms
    ```

    For App Service, the VNet integration subnet is recommended to have a CIDR block of `/26` at a minimum (see [VNet integration subnet requirements](overview-vnet-integration.md#subnet-requirements)). `/24` is more than sufficient. `--delegations Microsoft.Web/serverfarms` specifies that the subnet is [delegated for App Service VNet integration](../virtual-network/subnet-delegation-overview.md).

1. Create another subnet for the private endpoints.

    ```azurecli-interactive
    az network vnet subnet create --resource-group securebackendsetup --vnet-name securebackend-vnet --name private-endpoint-subnet --address-prefixes 10.0.1.0/24 --disable-private-endpoint-network-policies
    ```

    For private endpoint subnets, you must [disable private endpoint network policies](../private-link/disable-private-endpoint-network-policy.md).

## Create private DNS zones

Because your Key Vault and Cognitive Services resources will sit behind [private endpoints](../private-link/private-endpoint-overview.md), you need to define [private DNS zones](../dns/private-dns-privatednszone.md) for them. These zones are used to host the DNS records for private endpoints and allow the clients to find the back-end services by name. 

1. Create two private DNS zones, one of your key vault and one for your Cognitive Services resource.

    ```azurecli-interactive
    az network private-dns zone create --resource-group securebackendsetup --name privatelink.cognitiveservices.azure.com
    az network private-dns zone create --resource-group securebackendsetup --name privatelink.vaultcore.azure.net
    ```

    For more information on these settings, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md#azure-services-dns-zone-configuration)

1. Link the private DNS zones to the VNet.

    ```azurecli-interactive
    az network private-dns link vnet create --resource-group securebackendsetup --name cognitiveservices-zonelink --zone-name privatelink.cognitiveservices.azure.com --virtual-network securebackend-vnet --registration-enabled False
    az network private-dns link vnet create --resource-group securebackendsetup --name vaultcore-zonelink --zone-name privatelink.vaultcore.azure.net --virtual-network securebackend-vnet --registration-enabled False
    ```

## Create private endpoints

1. In the private endpoint subnet of your VNet, create a private endpoint for your key vault.

    ```azurecli-interactive
    az network private-endpoint create --resource-group securebackendsetup --name securekeyvault-pe --location westeurope --connection-name securekeyvault-pc --private-connection-resource-id $vaultResourceId --group-id vault --vnet-name securebackend-vnet --subnet private-endpoint-subnet
    ```

    > [!TIP]
    > The `$vaultResourceId` variable is set in the [prerequisite](#prerequisites) tutorial (in [Secure back-end connectivity](tutorial-connect-msi-keyvault.md#secure-back-end-connectivity)).

1. Create a DNS zone group for the key vault private endpoint. DNS zone group is a link between the private DNS zone and the private endpoint. This link helps you to auto update the private DNS Zone when there is an update to the private endpoint.  

    ```azurecli-interactive
    az network private-endpoint dns-zone-group create --resource-group securebackendsetup --endpoint-name securekeyvault-pe --name securekeyvault-zg --private-dns-zone privatelink.vaultcore.azure.net --zone-name privatelink.vaultcore.azure.net
    ```

1. Block public traffic to the key vault endpoint.

    ```azurecli-interactive
    az keyvault update --name securekeyvault2021 --default-action Deny
    ```

1. Repeat the steps above for the Cognitive Services resource.

    ```azurecli-interactive
    # Save Cognitive Services resource ID in a variable for convenience
    csResourceId=$(az cognitiveservices account show --resource-group securebackendsetup --name securecstext2021 --query id --output tsv)

    # Create private endpoint for Cognitive Services resource
    az network private-endpoint create --resource-group securebackendsetup --name securecstext-pe --location westeurope --connection-name securecstext-pc --private-connection-resource-id $csResourceId --group-id account --vnet-name securebackend-vnet --subnet private-endpoint-subnet
    # Create DNS zone group for the endpoint
    az network private-endpoint dns-zone-group create --resource-group securebackendsetup --endpoint-name securecstext-pe --name securecstext-zg --private-dns-zone privatelink.cognitiveservices.azure.com --zone-name privatelink.cognitiveservices.azure.com
    # Block public traffic to the endpoint
    az rest --uri $csResourceId?api-version=2017-04-18 --method PATCH --body '{"properties":{"publicNetworkAccess":"Disabled"}}' --headers 'Content-Type=application/json'
    ```

Now, all traffic to the key vault and the Cognitive Services resource is blocked. These two endpoints are only accessible to clients inside the VNet you created. You can't even access Key Vault secrets through the Azure portal, because the portal accesses them through the public internet (see [Manage the locked down resources](#manage-the-locked-down-resources)).

## Configure VNet integration in your app

1. Scale the app up to **Standard** tier. VNet integration requires **Standard** tier or above (see [Integrate your app with an Azure virtual network](overview-vnet-integration.md)).

    ```azurecli-interactive
    az appservice plan update --name MyAppServicePlan --resource-group MyResourceGroup --sku S1
    ```

1. Unrelated to our scenario but also very important, enforce HTTPS for inbound requests.

    ```azurecli-interactive
    az webapp update --resource-group securebackendsetup --name securebackend2021 --https-only
    ```

1. Enable VNet integration on your app.

    ```azurecli-interactive
    az webapp vnet-integration add --resource-group securebackendsetup --name securebackend2021 --vnet securebackend-vnet --subnet vnet-integration-subnet
    ```
    
    VNet integration allows outbound traffic to flow directly into the VNet. By default, only local IP traffic defined in [RFC-1918](https://tools.ietf.org/html/rfc1918#section-3) is routed to the VNet, which is what you need for the private endpoints. To route all your traffic to the VNet, set the [`WEBSITE_VNET_ROUTE_ALL` app setting](reference-app-settings.md#networking) as shown in the Linux-only step below. Routing all traffic can also be used if you want to route internet traffic through your VNet e.g. through an [Azure VNet NAT](../virtual-network/nat-gateway/nat-overview.md) or an [Azure Firewall](../firewall/overview.md).

1. (Linux apps only) Set the [`WEBSITE_VNET_ROUTE_ALL` app setting](reference-app-settings.md#networking) to `1`.

    ```azurecli-interactive
    az webapp config appsettings set --resource-group $groupName --name $appName --settings WEBSITE_VNET_ROUTE_ALL="1"
    ```

<!-- az webapp config set --resource-group securebackendsetup --name securebackend2021 --generic-configurations '{"vnetRouteAllEnabled": true}' -->
<!-- TODO Why does Linux require this route all setting? -->

## Manage the locked down resources

Depending on your scenarios, you may not be able to manage the private endpoint protected resources through the Azure portal, Azure CLI, or Azure PowerShell (for example, Key Vault). These tools all make REST API calls to access the resources through the public internet, and are blocked by your configuration. Here are a few options for accessing the locked down resources:

- For Key Vault, add the public IP of your local machine to view or update the private endpoint protected secrets.
- If your on premises network is extended into the Azure VNet through a [VPN gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoute](../expressroute/expressroute-introduction.md), you can manage the private endpoint protected resources directly from your on premises network. 
- Manage the private endpoint protected resources from a [jump server](https://wikipedia.org/wiki/Jump_server) in the VNet.
- [Deploy Cloud Shell into the VNet](../cloud-shell/private-vnet.md).

## Next steps

- [Integrate your app with an Azure virtual network](overview-vnet-integration.md)
- [App Service networking features](networking-features.md)