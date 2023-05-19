---
title: Mitigate data exfiltration with dedicated data endpoints
description: Azure Container Registry is introducing dedicated data endpoints available to mitigate data-exfiltration concerns.
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 12/22/2022

---
# Azure Container Registry mitigating data exfiltration with dedicated data endpoints

Azure Container Registry introduces dedicated data endpoints. The feature enables tightly scoped client firewall rules to specific registries, minimizing data exfiltration concerns.

Dedicated data endpoints feature is available in **Premium** service tier. For pricing information, see [container-registry-pricing.](https://azure.microsoft.com/pricing/details/container-registry/)

Pulling content from a registry involves two endpoints:

*Registry endpoint*, often referred to as the login URL, used for authentication and content discovery. A command like docker pulls `contoso.azurecr.io/hello-world` makes a REST request, which authenticates and negotiates the layers, which represent the requested artifact.
*Data endpoints* serve blobs representing content layers.


:::image type="content" source="./media/dedicated-data-endpoints/endpoints.png" alt-text="Diagram to illustrate endpoints.":::


## Registry managed storage accounts

Azure Container Registry is a multi-tenant service. The registry service manages the data endpoint storage accounts. The benefits of the managed storage accounts, include load balancing, contentious content splitting, multiple copies for higher concurrent content delivery, and multi-region support with [geo-replication.](container-registry-geo-replication.md)

## Azure Private Link virtual network support

The [Azure Private Link virtual network support](container-registry-private-link.md) enables the private endpoints for the managed registry service from Azure Virtual Networks. In this case, both the registry and data endpoints are accessible from within the virtual network, using private IPs.

Once the managed registry service and storage accounts are both secured to access from within the virtual network, then the public endpoints are removed.


:::image type="content" source="./media/dedicated-data-endpoints/v-net.png" alt-text="Diagram to illustrate virtual network support.":::


Unfortunately, virtual network connection isn’t always an option.

> [!IMPORTANT]
>[Azure Private Link](container-registry-private-link.md) is the most secure way to control network access between clients and the registry as network traffic is limited to the Azure Virtual Network, using private IPs. When Private Link isn’t an option, dedicated data endpoints can provide secure knowledge in what resources are accessible from each client. 

## Client firewall rules and data exfiltration risks

Client firewall rules limits access to specific resources. The firewall rules apply while connecting to a registry from on-premises hosts, IoT devices, custom build agents. The rules also apply when the Private Link support isn't an option. 


:::image type="content" source="./media/dedicated-data-endpoints/client-firewall-0.png" alt-text="Diagram to illustrate client firewall rules.":::


As customers locked down their client firewall configurations, they realized they must create a rule with a wildcard for all storage accounts, raising concerns for data-exfiltration. A bad actor could deploy code that would be capable of writing to their storage account.


:::image type="content" source="./media/dedicated-data-endpoints/client-firewall-2.png" alt-text="Diagram to illustrate client data exfiltration risks.":::


So, to address the data-exfiltration concerns, Azure Container Registry is making dedicated data endpoints available.

## Dedicated data endpoints

Dedicated data endpoints, help retrieve layers from the Azure Container Registry service, with fully qualified domain names representing the registry domain. 

As any registry may become geo-replicated, a regional pattern is used: `[registry].[region].data.azurecr.io`.

For the Contoso example, multiple regional data endpoints are added supporting the local region with a nearby replica.

With dedicated data endpoints, the bad actor is blocked from writing to other storage accounts.


:::image type="content" source="./media/dedicated-data-endpoints/contoso-example-0.png" alt-text="Diagram to illustrate contoso example with dedicated data endpoints.":::


## Enabling dedicated data endpoints

> [!NOTE]
> Switching to dedicated data-endpoints will impact clients that have configured firewall access to the existing `*.blob.core.windows.net` endpoints, causing pull failures. To assure clients have consistent access, add the new data-endpoints to the client firewall rules. Once completed, existing registries can enable dedicated data-endpoints through the `az cli`.

To use the Azure CLI steps in this article, Azure CLI version 2.4.0 or later is required. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli) or run in [Azure Cloud Shell](../cloud-shell/quickstart.md).

* Run the [az acr update](/cli/azure/acr#az-acr-update) command to enable dedicated data endpoint.

```azurecli-interactive
az acr update --name contoso --data-endpoint-enabled
```

* Run the [az acr show](/cli/azure/acr#az-acr-show-endpoints) command to view the data endpoints, including regional endpoints for geo-replicated registries.

```azurecli-interactive
az acr show-endpoints --name contoso
```

Sample output:

```json
{
  "loginServer": "contoso.azurecr.io",
  "dataEndpoints": [
    {
      "region": "eastus",
      "endpoint": "contoso.eastus.data.azurecr.io",
    },
    {
     "region": "westus",
      "endpoint": "contoso.westus.data.azurecr.io",
    }
  ]
}
     
```

## Next steps

* Configure to access an Azure container registry from behind a [firewall rules.](container-registry-firewall-access-rules.md) 
* Connect Azure Container Registry using [Azure Private Link](container-registry-private-link.md)