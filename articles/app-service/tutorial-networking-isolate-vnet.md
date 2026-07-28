---
title: 'Tutorial: Isolate Back-End Communication with Virtual Network Integration'
description: Connections from App Service to back-end services are routed through shared network infrastructure with other apps and subscriptions. Learn how to isolate traffic by using virtual network integration.
ms.topic: tutorial
ms.custom: devx-track-azurecli
ms.date: 04/07/2026

ms.reviewer: jordanselig
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
---

# Tutorial: Isolate back-end communication in Azure App Service by using virtual network integration

In this article, you configure an App Service app with secure, network-isolated communication to back-end services. The example scenario used is in [Tutorial: Secure Cognitive Service connection from App Service using Key Vault](tutorial-connect-msi-key-vault.md). When you finish, you have an App Service app that accesses both Key Vault and Foundry Tools through an [Azure virtual network](../virtual-network/virtual-networks-overview.md). No other traffic is allowed to access those back-end resources. All traffic will be isolated within your virtual network via [virtual network integration](web-sites-integrate-with-vnet.md) and [private endpoints](../private-link/private-endpoint-overview.md).

In a multi-tenanted service, outbound network traffic from your App Service app to other Azure services shares the same environment with other apps or even other subscriptions. Although the traffic itself can be encrypted, certain scenarios might require an extra level of security via isolation of back-end communication from other network traffic. These scenarios are typically accessible to large enterprises with a high level of expertise, but App Service puts it within reach with virtual network integration.  

![Diagram that shows the scenario architecture.](./media/tutorial-networking-isolate-vnet/architecture.png)

In this architecture: 

- Public traffic to the back-end services is blocked.
- Outbound traffic from App Service is routed to the virtual network and can reach the back-end services.
- App Service can perform DNS resolution to the back-end services through the private DNS zones.

What you'll learn:

> [!div class="checklist"]
> * Create a virtual network and subnets for App Service virtual network integration
> * Create private DNS zones
> * Create private endpoints
> * Configure virtual network integration in App Service

## Prerequisites

- Complete [Tutorial: Secure Cognitive Service connection from App Service using Key Vault](tutorial-connect-msi-key-vault.md) and create the language detector app. 

- Be sure to set the following environment variables from  [Tutorial: Secure Cognitive Service connection from App Service using Key Vault](tutorial-connect-msi-key-vault.md):

   ```azurecli-interactive
       groupName=myKVResourceGroup
       region=canadacentral
       csResourceName=<cs-resource-name>
       appName=<app-name>
       vaultName=<vault-name>
       planName=<plan-name>
       csResourceKVUri=<cs-resource-kv-uri>
       csKeyKVUri=<cs-key-kv-uri>
   ```

## Create a virtual network and subnets

1. Create a virtual network. Replace *\<virtual-network-name>* with a unique name.

    ```azurecli-interactive
    # Save the virtual network name as a variable for convenience
    vnetName=<virtual-network-name>

    az network vnet create --resource-group $groupName --location $region --name $vnetName --address-prefixes 10.0.0.0/16
    ```

1. Create a subnet for the App Service virtual network integration.

    ```azurecli-interactive
    az network vnet subnet create --resource-group $groupName --vnet-name $vnetName --name vnet-integration-subnet --address-prefixes 10.0.0.0/24 --delegations Microsoft.Web/serverfarms --private-endpoint-network-policies Enabled
    ```

    For App Service, the recommendation is for the virtual network integration subnet to have a CIDR block of `/26` at a minimum. (See [Virtual network integration subnet requirements](overview-vnet-integration.md#subnet-requirements).) `/24` is more than sufficient. `--delegations Microsoft.Web/serverfarms` specifies that the subnet is [delegated for App Service virtual network integration](../virtual-network/subnet-delegation-overview.md).

1. Create another subnet for the private endpoints.

    ```azurecli-interactive
    az network vnet subnet create --resource-group $groupName --vnet-name $vnetName --name private-endpoint-subnet --address-prefixes 10.0.1.0/24 --private-endpoint-network-policies Disabled
    ```

    For private endpoint subnets, you need to [disable private endpoint network policies](../private-link/disable-private-endpoint-network-policy.md).

## Create private DNS zones

Because your Key Vault and Foundry Tools resources will be located behind [private endpoints](../private-link/private-endpoint-overview.md), you need to define [private DNS zones](../dns/private-dns-privatednszone.md) for them. These zones are used to host the DNS records for private endpoints and allow the clients to find the back-end services by name. 

1. Create two private DNS zones, one for your Foundry Tools resource and one for your key vault.

    ```azurecli-interactive
    az network private-dns zone create --resource-group $groupName --name privatelink.cognitiveservices.azure.com
    az network private-dns zone create --resource-group $groupName --name privatelink.vaultcore.azure.net
    ```

    For more information on these settings, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md#azure-services-dns-zone-configuration).

1. Link the private DNS zones to the virtual network.

    ```azurecli-interactive
    az network private-dns link vnet create --resource-group $groupName --name cognitiveservices-zonelink --zone-name privatelink.cognitiveservices.azure.com --virtual-network $vnetName --registration-enabled False
    az network private-dns link vnet create --resource-group $groupName --name vaultcore-zonelink --zone-name privatelink.vaultcore.azure.net --virtual-network $vnetName --registration-enabled False
    ```

## Create private endpoints

1. In the private endpoint subnet of your virtual network, create a private endpoint for your Foundry Tools resource.

    ```azurecli-interactive
    # Get Foundry Tools resource ID
    csResourceId=$(az cognitiveservices account show --resource-group $groupName --name $csResourceName --query id --output tsv)

    az network private-endpoint create --resource-group $groupName --name securecstext-pe --location $region --connection-name securecstext-pc --private-connection-resource-id $csResourceId --group-id account --vnet-name $vnetName --subnet private-endpoint-subnet
    ```

1. Create a DNS zone group for the Foundry Tools private endpoint. A DNS zone group is a link between the private DNS zone and the private endpoint. This link helps you to automatically update the private DNS zone when there's an update to the private endpoint.  

    ```azurecli-interactive
    az network private-endpoint dns-zone-group create --resource-group $groupName --endpoint-name securecstext-pe --name securecstext-zg --private-dns-zone privatelink.cognitiveservices.azure.com --zone-name privatelink.cognitiveservices.azure.com
    ```

1. Block public traffic to the Foundry Tools resource.

    ```azurecli-interactive
    az rest --uri $csResourceId?api-version=2024-10-01 --method PATCH --body '{"properties":{"publicNetworkAccess":"Disabled"}}' --headers 'Content-Type=application/json'

    # Repeat the following command until the output is "Succeeded"
    az cognitiveservices account show --resource-group $groupName --name $csResourceName --query properties.provisioningState
    ```

    > [!NOTE]
    > Make sure the provisioning state of your change is `"Succeeded"`. You can then observe the behavior change in the sample app. You can still load the app, but if you try to select the **Detect** button, you get an `HTTP 500` error. The app has lost its connectivity to the Foundry Tools resource through the shared networking.

1. Repeat the preceding steps for the key vault.

    ```azurecli-interactive
    # Create a private endpoint for the key vault
    vaultResourceId=$(az keyvault show --name $vaultName --query id --output tsv)
    az network private-endpoint create --resource-group $groupName --name securekeyvault-pe --location $region --connection-name securekeyvault-pc --private-connection-resource-id $vaultResourceId --group-id vault --vnet-name $vnetName --subnet private-endpoint-subnet
    # Create a DNS zone group for the endpoint
    az network private-endpoint dns-zone-group create --resource-group $groupName --endpoint-name securekeyvault-pe --name securekeyvault-zg --private-dns-zone privatelink.vaultcore.azure.net --zone-name privatelink.vaultcore.azure.net
    # Block public traffic to the key vault
    az keyvault update --name $vaultName --default-action Deny
    ```

1. Force an immediate refetch of the [key vault references](app-service-key-vault-references.md) in your app by resetting the app settings. (For more information, see [Rotation](app-service-key-vault-references.md#rotation).)

    ```azurecli-interactive
    az webapp config appsettings set --resource-group $groupName --name $appName --settings CS_ACCOUNT_NAME="@Microsoft.KeyVault(SecretUri=$csResourceKVUri)" CS_ACCOUNT_KEY="@Microsoft.KeyVault(SecretUri=$csKeyKVUri)"
    ```

    <!-- If above is not run then it takes a whole day for references to update? https://learn.microsoft.com/azure/app-service/app-service-key-vault-references#rotation -->

    > [!NOTE]
    > Again, you can observe the behavior change in the sample app. You can no longer load the app because it can no longer access the key vault references. The app has lost its connectivity to the key vault through the shared networking.

The two private endpoints are only accessible to clients inside the virtual network that you created. You can't even access the secrets in the key vault from the **Secrets** page in the Azure portal, because the portal accesses them via the public internet. (See [Manage the locked down resources](#manage-the-locked-down-resources).)

## Configure virtual network integration in your app

1. Scale the app up to a supported pricing tier. (See [Integrate your app with an Azure virtual network](overview-vnet-integration.md).)

    ```azurecli-interactive
    az appservice plan update --name $planName --resource-group $groupName --sku S1
    ```

1. Enforce HTTPS for inbound requests. (This step isn't related to the current scenario, but it's important.)

    ```azurecli-interactive
    az webapp update --resource-group $groupName --name $appName --https-only
    ```

1. Enable virtual network integration on your app.

    ```azurecli-interactive
    az webapp vnet-integration add --resource-group $groupName --name $appName --vnet $vnetName --subnet vnet-integration-subnet
    ```
    
    Virtual network integration allows outbound traffic to flow directly into the virtual network. By default, only local IP traffic defined in [RFC-1918](https://tools.ietf.org/html/rfc1918#section-3) is routed to the virtual network, which is what you need for the private endpoints. For information about routing all your traffic to the virtual network, see [Manage virtual network integration routing](configure-vnet-integration-routing.md). You can also route all traffic if you want to route internet traffic through your virtual network, through, for example, [Azure NAT Gateway](../virtual-network/nat-gateway/nat-overview.md) or [Azure Firewall](../firewall/overview.md).

1. In a browser, go to `<app-name>.azurewebsites.net` and wait for the integration to take effect. If you get an HTTP 500 error, wait a few minutes and try again. If you can load the page and get detection results, you're connecting to the Foundry Tools endpoint by using key vault references.

    >[!NOTE]
    > If you keep getting HTTP 500 errors for long time, it might help to force a refetch of the [key vault references](app-service-key-vault-references.md) again:
    >
    > ```azurecli-interactive
    > az webapp config appsettings set --resource-group $groupName --name $appName --settings CS_ACCOUNT_NAME="@Microsoft.KeyVault(SecretUri=$csResourceKVUri)" CS_ACCOUNT_KEY="@Microsoft.KeyVault(SecretUri=$csKeyKVUri)"
    > ```


## Manage the locked down resources

Depending on your scenarios, you might not be able to manage the private endpoint-protected resources through the Azure portal, Azure CLI, or Azure PowerShell (for example, Key Vault). These tools all make REST API calls to access the resources through the public internet, and are blocked by your configuration. Here are a few options for accessing the locked down resources:

- For Key Vault, add the public IP of your local machine to view or update the secrets that are protected by private endpoints.
- If your on-premises network is extended into the Azure virtual network via a [VPN gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) or [Azure ExpressRoute](../expressroute/expressroute-introduction.md), you can manage the private endpoint protected-resources directly from your on-premises network. 
- Manage the private endpoint-protected resources from a [jump server](https://wikipedia.org/wiki/Jump_server) in the virtual network.
- [Deploy Cloud Shell into the virtual network](../cloud-shell/private-vnet.md).

## Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, delete the resource group by running the following command in the Cloud Shell:

```azurecli-interactive
az group delete --name $groupName
```

This command might take a minute to run.

## Next steps

- [Integrate your app with an Azure virtual network](overview-vnet-integration.md)
- [App Service networking features](networking-features.md)
