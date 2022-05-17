---
title: "Quickstart - Set Request Rate Limits"
description: Explains how to set request rate limits using Spring Cloud Gateway on Azure Spring Apps Enterprise tier.
author: KarlErickson
ms.author: asirveda # external contributor: paly@vmware.com
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 05/31/2022
ms.custom: devx-track-java
---

# Quickstart: Set request rate limits

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This quickstart shows you how to set request rate limits using Spring Cloud Gateway on Azure Spring Apps Enterprise tier.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A license for Azure Spring Apps Enterprise tier. For more information, see [View Azure Spring Apps Enterprise tier Offer in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [jq](https://stedolan.github.io/jq/download/)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
- Complete the previous quickstarts in this series:
  - [Build and deploy apps to Azure Spring Apps using the Enterprise tier](./quickstart-deploy-enterprise.md)

## Set request rate limits

Spring Cloud Gateway includes route filters from the Open Source version as well as several additional route filters. One of these additional filters is the [RateLimit: Limiting user requests filter](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.1/scg-k8s/GUID-route-filters.html#ratelimit-limiting-user-requests-filter). The RateLimit filter limits the number of requests allowed per route during a time window.

When defining a Route, you can add the RateLimit filter by including it in the list of filters for the route. The filter accepts 4 options:

- Number of requests accepted during the window.
- Duration of the window: by default milliseconds, but you can use s, m or h suffix to specify it in seconds, minutes or hours.
- (Optional) User partition key: it's also possible to apply rate limiting per user, that is, different users can have its own throughput allowed based on an identifier found in the request. Set whether the key is in a JWT claim or HTTP header with '' or '' syntax.
- (Optional) It is possible to rate limit by IP addresses. Note, this cannot be combined with the rate limiting per user.

The following example would limit all users to two requests every 5 seconds to the `/products` route:

```json
{
    "predicates": [
      "Path=/products",
      "Method=GET"
    ],
    "filters": [
      "StripPrefix=0",
      "RateLimit=2,5s"
    ]
}
```

When the limit is exceeded, response will fail with `429 Too Many Requests` status.

Apply the `RateLimit` filter to the `/products` route using the following command:

```azurecli
az spring-cloud gateway route-config update \
    --resource-group <resource-group> \
    --service <spring-cloud-service> \
    --name catalog-routes \
    --app-name catalog-service \
    --routes-file azure/routes/catalog-service_rate-limit.json
```

Retrieve the URL for the `/products` route in Spring Cloud Gateway using the following command:

```azurecli
GATEWAY_URL=$(az spring-cloud gateway show \
    --resource-group <resource-group> \
    --service <spring-cloud-service> | jq -r '.properties.url')

echo "https://${GATEWAY_URL}/products"
```

Make several requests to the URL for `/products` within a five second period to see requests fail with a status `429 Too Many Requests`.

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Automate Deployments](./quickstart-automate-deployments-github-actions-enterprise.md)
