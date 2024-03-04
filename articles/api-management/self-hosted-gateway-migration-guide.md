---
title: Self-hosted gateway migration guide - Azure API Management
description: Learn how to migrate the Azure API Management self-hosted gateway to v2.
services: api-management
documentationcenter: ''
author: tomkerkhove

ms.service: api-management
ms.topic: article
ms.date: 03/08/2022
ms.author: tomkerkhove
---

# Self-hosted gateway migration guide

This article explains how to migrate existing self-hosted gateway deployments to self-hosted gateway v2.

> [!IMPORTANT]
> Support for Azure API Management self-hosted gateway version 0 and version 1 container images is ending on 1 October 2023, along with its corresponding Configuration API v1. [Learn more in our deprecation documentation](./breaking-changes/self-hosted-gateway-v0-v1-retirement-oct-2023.md)

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

## What's new?

As we strive to make it easier for customers to deploy our self-hosted gateway, we've **introduced a new configuration API** that removes the dependency on Azure Storage, unless you're using [API inspector](api-management-howto-api-inspector.md) or quotas.

The new configuration API allows customers to more easily adopt, deploy and operate our self-hosted gateway in their existing infrastructure.

We have [introduced new container image tags](how-to-self-hosted-gateway-on-kubernetes-in-production.md#container-image-tag) to let customers choose the best way to try our gateway and deploy it in production.

To help customers run our gateway in production we've extended [our production guidance](how-to-self-hosted-gateway-on-kubernetes-in-production.md) to cover how to autoscale the gateway, and deploy it for high availability in your Kubernetes cluster.

Learn more about the connectivity of our gateway, our new infrastructure requirements, and what happens if connectivity is lost in [this article](self-hosted-gateway-overview.md#connectivity-to-azure).

## Prerequisites

Before you can migrate to self-hosted gateway v2, you need to ensure your infrastructure [meets the requirements](self-hosted-gateway-overview.md#fqdn-dependencies).

## Migrating to self-hosted gateway v2

Migrating from self-hosted gateway v2 requires a few small steps to be done:

1. [Use the new container image](#container-image)
2. [Use the new configuration API](#using-the-new-configuration-api)
3. [Meet minimal security requirements](#meet-minimal-security-requirements)

### Container Image

Change the image tag in your deployment scripts to use `2.0.0` or above.

Alternatively, choose one of our other [container image tags](self-hosted-gateway-overview.md#container-images).

You can find a full list of available tags [here](https://mcr.microsoft.com/v2/azure-api-management/gateway/tags/list) or find us on [Docker Hub](https://hub.docker.com/_/microsoft-azure-api-management-gateway).

### Using the new configuration API

In order to migrate to self-hosted gateway v2, customers need to use our new Configuration API v2.

Currently, Azure API Management provides the following Configuration APIs for self-hosted gateway:

| Configuration Service | URL | Supported | Requirements |
| --- | --- | --- | --- |
| v2 | `{name}.configuration.azure-api.net` | Yes | [Link](self-hosted-gateway-overview.md#fqdn-dependencies) |
| v1 | `{name}.management.azure-api.net/subscriptions/{sub-id}/resourceGroups/{rg-name}/providers/Microsoft.ApiManagement/service/{name}?api-version=2021-01-01-preview` | No | [Link](self-hosted-gateway-overview.md#fqdn-dependencies) |

Customer must use the new Configuration API v2 by changing their deployment scripts to use the new URL and meet infrastructure requirements.

> [!IMPORTANT]
> * DNS hostname must be resolvable to IP addresses and the corresponding IP addresses must be reachable.
> This might require additional configuration in case you are using a private DNS, internal VNET or other infrastrutural requirements.

### Security

#### Available TLS cipher suites

At launch, self-hosted gateway v2.0 only used a subset of the cipher suites that v1.x was using. As of v2.0.4, we've brought back all the cipher suites that v1.x supported.

You can learn more about the used cipher suites in [this article](self-hosted-gateway-overview.md#available-cipher-suites) or use v2.1.1 to [control what cipher suites to use](self-hosted-gateway-overview.md#managing-cipher-suites).

#### Meet minimal security requirements

During startup, the self-hosted gateway will prepare the CA certificates that will be used. This requires the gateway container to run with at least user ID 1001 and can't use read-only file system.

When configuring a security context for the container in Kubernetes, the following are required at minimum:

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1001
  readOnlyRootFilesystem: false
```

However, as of `2.0.3` the self-hosted gateway is able to run as non-root in Kubernetes allowing customers to run the gateway more securely.

Here's an example of the security context for the self-hosted gateway:
```yml
securityContext:
  allowPrivilegeEscalation: false
  runAsNonRoot: true
  runAsUser: 1001       # This is a built-in user, but you can use any user ie 1000 as well
  runAsGroup: 2000      # This is just an example
  privileged: false
  capabilities:
    drop:
    - all
```

> [!WARNING]
> Running the self-hosted gateway with read-only filesystem (`readOnlyRootFilesystem: true`) is not supported.

## Assessing impact with Azure Advisor

In order to make the migration easier, we have introduced new Azure Advisor recommendations:

- **Use self-hosted gateway v2** recommendation - Identifies Azure API Management instances where the usage of self-hosted gateway v0.x or v1.x was identified.
- **Use Configuration API v2 for self-hosted gateways** recommendation - Identifies Azure API Management instances where the usage of Configuration API v1 for self-hosted gateway was identified.

We highly recommend customers to use ["All Recommendations" overview in Azure Advisor](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/All) to determine if a migration is required. Use the filtering options to see if one of the above recommendations is present.

### Use Azure Resource Graph to identify Azure API Management instances

This Azure Resource Graph query provides you with a list of impacted Azure API Management instances:

```kusto
AdvisorResources
| where type == 'microsoft.advisor/recommendations'
| where properties.impactedField == 'Microsoft.ApiManagement/service' and properties.category == 'OperationalExcellence'
| extend
    recommendationTitle = properties.shortDescription.solution
| where recommendationTitle == 'Use self-hosted gateway v2' or recommendationTitle == 'Use Configuration API v2 for self-hosted gateways'
| extend
    instanceName = properties.impactedValue,
    recommendationImpact = properties.impact,
    recommendationMetadata = properties.extendedProperties,
    lastUpdated = properties.lastUpdated
| project tenantId, subscriptionId, resourceGroup, instanceName, recommendationTitle, recommendationImpact, recommendationMetadata, lastUpdated
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "AdvisorResources | where type == 'microsoft.advisor/recommendations' | where properties.impactedField == 'Microsoft.ApiManagement/service' and properties.category == 'OperationalExcellence' | extend recommendationTitle = properties.shortDescription.solution | where recommendationTitle == 'Use self-hosted gateway v2' or recommendationTitle == 'Use Configuration API v2 for self-hosted gateways' | extend instanceName = properties.impactedValue, recommendationImpact = properties.impact, recommendationMetadata = properties.extendedProperties, lastUpdated = properties.lastUpdated | project tenantId, subscriptionId, resourceGroup, instanceName, recommendationTitle, recommendationImpact, lastUpdated"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "AdvisorResources | where type == 'microsoft.advisor/recommendations' | where properties.impactedField == 'Microsoft.ApiManagement/service' and properties.category == 'OperationalExcellence' | extend recommendationTitle = properties.shortDescription.solution | where recommendationTitle == 'Use self-hosted gateway v2' or recommendationTitle == 'Use Configuration API v2 for self-hosted gateways' | extend instanceName = properties.impactedValue, recommendationImpact = properties.impact, recommendationMetadata = properties.extendedProperties, lastUpdated = properties.lastUpdated | project tenantId, subscriptionId, resourceGroup, instanceName, recommendationTitle, recommendationImpact, lastUpdated"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="./../governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/AdvisorResources%0A%7C%20where%20type%20%3D%3D%20%27microsoft.advisor%2Frecommendations%27%0A%7C%20where%20properties.impactedField%20%3D%3D%20%27Microsoft.ApiManagement%2Fservice%27%20and%20properties.category%20%3D%3D%20%27OperationalExcellence%27%0A%7C%20extend%0A%20%20%20%20recommendationTitle%20%3D%20properties.shortDescription.solution%0A%7C%20where%20recommendationTitle%20%3D%3D%20%27Use%20self-hosted%20gateway%20v2%27%20or%20recommendationTitle%20%3D%3D%20%27Use%20Configuration%20API%20v2%20for%20self-hosted%20gateways%27%0A%7C%20extend%0A%20%20%20%20instanceName%20%3D%20properties.impactedValue%2C%0A%20%20%20%20recommendationImpact%20%3D%20properties.impact%2C%0A%20%20%20%20recommendationMetadata%20%3D%20properties.extendedProperties%2C%0A%20%20%20%20lastUpdated%20%3D%20properties.lastUpdated%0A%7C%20project%20tenantId%2C%20subscriptionId%2C%20resourceGroup%2C%20instanceName%2C%20recommendationTitle%2C%20recommendationImpact%2C%20recommendationMetadata%2C%20lastUpdated" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/AdvisorResources%0A%7C%20where%20type%20%3D%3D%20%27microsoft.advisor%2Frecommendations%27%0A%7C%20where%20properties.impactedField%20%3D%3D%20%27Microsoft.ApiManagement%2Fservice%27%20and%20properties.category%20%3D%3D%20%27OperationalExcellence%27%0A%7C%20extend%0A%20%20%20%20recommendationTitle%20%3D%20properties.shortDescription.solution%0A%7C%20where%20recommendationTitle%20%3D%3D%20%27Use%20self-hosted%20gateway%20v2%27%20or%20recommendationTitle%20%3D%3D%20%27Use%20Configuration%20API%20v2%20for%20self-hosted%20gateways%27%0A%7C%20extend%0A%20%20%20%20instanceName%20%3D%20properties.impactedValue%2C%0A%20%20%20%20recommendationImpact%20%3D%20properties.impact%2C%0A%20%20%20%20recommendationMetadata%20%3D%20properties.extendedProperties%2C%0A%20%20%20%20lastUpdated%20%3D%20properties.lastUpdated%0A%7C%20project%20tenantId%2C%20subscriptionId%2C%20resourceGroup%2C%20instanceName%2C%20recommendationTitle%2C%20recommendationImpact%2C%20recommendationMetadata%2C%20lastUpdated" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianetated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/AdvisorResources%0A%7C%20where%20type%20%3D%3D%20%27microsoft.advisor%2Frecommendations%27%0A%7C%20where%20properties.impactedField%20%3D%3D%20%27Microsoft.ApiManagement%2Fservice%27%20and%20properties.category%20%3D%3D%20%27OperationalExcellence%27%0A%7C%20extend%0A%20%20%20%20recommendationTitle%20%3D%20properties.shortDescription.solution%0A%7C%20where%20recommendationTitle%20%3D%3D%20%27Use%20self-hosted%20gateway%20v2%27%20or%20recommendationTitle%20%3D%3D%20%27Use%20Configuration%20API%20v2%20for%20self-hosted%20gateways%27%0A%7C%20extend%0A%20%20%20%20instanceName%20%3D%20properties.impactedValue%2C%0A%20%20%20%20recommendationImpact%20%3D%20properties.impact%2C%0A%20%20%20%20recommendationMetadata%20%3D%20properties.extendedProperties%2C%0A%20%20%20%20lastUpdated%20%3D%20properties.lastUpdated%0A%7C%20project%20tenantId%2C%20subscriptionId%2C%20resourceGroup%2C%20instanceName%2C%20recommendationTitle%2C%20recommendationImpact%2C%20recommendationMetadata%2C%20lastUpdated" target="_blank">portal.azure.cn</a>

---

## Known limitations

Here's a list of known limitations for the self-hosted gateway v2:

- Configuration API v2 doesn't support custom domain names

## Next steps

-   Learn more about [API Management in a Hybrid and multicloud World](https://aka.ms/hybrid-and-multi-cloud-api-management)
-   Learn more about guidance for [running the self-hosted gateway on Kubernetes in production](how-to-self-hosted-gateway-on-kubernetes-in-production.md)
-   [Deploy self-hosted gateway to Docker](how-to-deploy-self-hosted-gateway-docker.md)
-   [Deploy self-hosted gateway to Kubernetes](how-to-deploy-self-hosted-gateway-kubernetes.md)
-   [Deploy self-hosted gateway to Azure Arc-enabled Kubernetes cluster](how-to-deploy-self-hosted-gateway-azure-arc.md)
