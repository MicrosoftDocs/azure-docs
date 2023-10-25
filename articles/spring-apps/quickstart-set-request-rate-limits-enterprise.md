---
title: "Quickstart - Set request rate limits"
titleSuffix: Azure Spring Apps Enterprise plan
description: Explains how to set request rate limits by using Spring Cloud Gateway on the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: asirveda # external contributor: paly@vmware.com
ms.service: spring-apps
ms.topic: quickstart
ms.date: 05/31/2022
ms.custom: devx-track-java, devx-track-extended-java
---

# Quickstart: Set request rate limits

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This quickstart shows you how to set request rate limits by using Spring Cloud Gateway on the Azure Spring Apps Enterprise plan.

Rate limiting enables you to avoid problems that arise with spikes in traffic. When you set request rate limits, your application can reject excessive requests. This configuration helps you minimize throttling errors and more accurately predict throughput.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Understand and fulfill the [Requirements](how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [jq](https://stedolan.github.io/jq/download/)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
- Complete the steps in [Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).

## Set request rate limits

Spring Cloud Gateway includes route filters from the Open Source version and several more route filters. One of these filters is the [RateLimit: Limiting user requests filter](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/1.2/scg-k8s/GUID-route-filters.html#ratelimit-limiting-user-requests-filter). The RateLimit filter limits the number of requests allowed per route during a time window.

When defining a route, you can add the RateLimit filter by including it in the list of filters for the route. The filter accepts four options:

- The number of requests accepted during the window.
- The duration of the window. This value is in milliseconds by default, but you can specify a suffix of *s*, *m*, or *h* to indicate that the value is in seconds, minutes, or hours.
- (Optional) A user partition key. You can also apply rate limiting per user. That is, different users can have their own throughput allowed based on an identifier found in the request. Indicate whether the key is in a JWT claim or HTTP header with `claim` or `header` syntax.
- (Optional) You can rate limit by IP addresses, but not in combination with rate limiting per user.

The following example would limit all users to two requests every five seconds to the `/products` route:

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

If you want to expose a route for different sets of users, each one identified by its own `client_id` HTTP header, use the following route definition:

```json
{
    "predicates": [
      "Path=/products",
      "Method=GET"
    ],
    "filters": [
      "StripPrefix=0",
      "RateLimit=2,5s,{header:client_id}"
    ]
}
```

When the limit is exceeded, responses will fail with `429 Too Many Requests` status.

Use the following command to apply the `RateLimit` filter to the `/products` route:

```azurecli
az spring gateway route-config update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> \
    --name catalog-routes \
    --app-name catalog-service \
    --routes-file azure-spring-apps-enterprise/resources/json/routes/catalog-service_rate-limit.json
```

Use the following commands to retrieve the URL for the `/products` route in Spring Cloud Gateway:

```azurecli
export GATEWAY_URL=$(az spring gateway show \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

echo "https://${GATEWAY_URL}/products"
```

Make several requests to the URL for `/products` within a five-second period to see requests fail with a status `429 Too Many Requests`.

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

Continue on to any of the following optional quickstarts:

- [Configure single sign-on](quickstart-configure-single-sign-on-enterprise.md)
- [Integrate Azure Database for PostgreSQL and Azure Cache for Redis](quickstart-integrate-azure-database-and-redis-enterprise.md)
- [Load application secrets using Key Vault](quickstart-key-vault-enterprise.md)
- [Monitor applications end-to-end](quickstart-monitor-end-to-end-enterprise.md)
- [Automate deployments](quickstart-automate-deployments-github-actions-enterprise.md)
