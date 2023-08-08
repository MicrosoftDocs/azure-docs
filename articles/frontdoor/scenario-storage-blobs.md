---
title: Use Azure Front Door with Azure Storage blobs
description: Learn how to use Front Door with storage blobs for accelerating content delivery of static content, enabling a secure and scalable architecture.
services: front-door
author: johndowns
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 12/08/2022
ms.author: jodowns
---

# Use Azure Front Door with Azure Storage blobs

Azure Front Door accelerates the delivery of static content from Azure Storage blobs, and enables a secure and scalable architecture. Static content delivery is useful for many different use cases, including website hosting and file delivery.

## Architecture

:::image type="content" source="./media/scenario-storage-blobs/architecture-diagram.png" alt-text="Diagram of Azure Front Door with a blob storage origin." border="false":::

In this reference architecture, you deploy a storage account and Front Door profile with a single origin.

## Dataflow

Data flows through the scenario as follows:

1. The client establishes a secure connection to Azure Front Door by using a custom domain name and Front Door-provided TLS certificate. The client's connection terminates at a nearby Front Door point of presence (PoP).
1. The Front Door web application firewall (WAF) scans the request. If the WAF determines the request's risk level is too high, it blocks the request and Front Door returns an HTTP 403 error response.
1. If the Front Door PoP's cache contains a valid response for this request, Front Door returns the response immediately.
1. Otherwise, the PoP sends the request to the origin storage account, wherever it is in the world, by using Microsoft's backbone network. The PoP connects to the storage account by using a separate, long-lived, TCP connection. In this scenario, Private Link is used to securely connect to the storage account.
1. The storage account sends a response to the Front Door PoP.
1. When the PoP receives the response, it stores it in its cache for subsequent requests.
1. The PoP returns the response to the client.
1. Any requests directly to the storage account through the internet are blocked by the Azure Storage firewall.

## Components

- [Azure Storage](https://azure.microsoft.com/products/storage/blobs) stores static content in blobs.
- [Azure Front Door](https://azure.microsoft.com/services/frontdoor/) receives inbound connections from clients, scans them with the WAF, securely forwards the request to the storage account, and caches responses.

### Alternatives

If you have static files in another cloud storage provider, or if you host static content on infrastructure that you own and maintain, much of this scenario continues to apply. However, you need to consider how you secure the incoming traffic to your origin server, to verify that it's come through Front Door. If your storage provider doesn't support Private Link, consider using an alternative approach like [allowlisting the Front Door service tag and inspecting the `X-Azure-FDID` header](origin-security.md).

## Scenario details

Static content delivery is useful in many situations, such as these examples:
- Delivering images, CSS files, and JavaScript files for a web application.
- Serving files and documents, such as PDF files or JSON files.
- Delivering non-streaming video.

By its nature, static content doesn't change frequently. Static files might also be large in size. These characteristics make it a good candidate to be cached, which improves performance and reduces the cost to serve requests.

In a complex scenario, a single Front Door profile might serve static content and dynamic content. You can use separate origin groups for each type of origin, and use Front Door's routing capabilities to route incoming requests to the correct origin.

## Considerations

### Scalability and performance

As a content delivery network (CDN), Front Door caches the content at its globally distributed network of PoPs. When a cached copy of a response is available at a PoP, Front Door can quickly respond with the cached response. Returning content from the cache improves the performance of the solution, and reduces the load on the origin. If the PoP doesn't have a valid cached response, Front Door's traffic acceleration capabilities reduce the time to serve the content from the origin.

### Security

#### Authentication

Front Door is designed to be internet-facing, and this scenario is optimized for publicly available blobs. If you need to authenticate access to blobs, consider using [shared access signatures](../storage/common/storage-sas-overview.md), and ensure that you enable the [*Use Query String* query string behavior](front-door-caching.md#query-string-behavior) to avoid Front Door from serving requests to unauthenticated clients. However, this approach might not make effective use of the Front Door cache, because each request with a different shared access signature must be sent to the origin separately.

#### Origin security

Front Door securely connects to the Azure Storage account by using [Private Link](private-link.md). The storage account is configured to deny direct access from the internet, and to only allow requests through the private endpoint connection used by Front Door. This configuration ensures that every request is processed by Front Door, and avoids exposing the contents of your storage account directly to the internet. However, this configuration requires the premium SKU of Azure Front Door. If you use the standard SKU, your storage account must be publicly accessible. You could use a [shared access signature](../storage/common/storage-sas-overview.md) to secure requests to the storage account, and either have the client include the signature on all of their requests, or use the Front Door [rules engine](front-door-rules-engine.md) to attach it from Front Door.

#### Custom domain names

Front Door supports custom domain names, and can issue and manage TLS certificates for those domains. By using custom domains, you can ensure that your clients receive files from a trusted and familiar domain name, and that TLS encrypts every connection to Front Door. When Front Door manages your TLS certificates, you avoid outages and security issues due to invalid or outdated TLS certificates.

Azure Storage also supports custom domain names, but doesn't support HTTPS when using a custom domain. Front Door is the best approach to use a custom domain name with a storage account.

#### Web application firewall

The Front Door WAF's managed rule sets scan requests for common and emerging security threats. We recommend using the WAF and managed rules for both static and dynamic applications.

You can also use the Front Door WAF to perform [rate limiting](../web-application-firewall/afds/waf-front-door-rate-limit.md) and [geo-filtering](../web-application-firewall/afds/waf-front-door-geo-filtering.md) if you require those capabilities.

### Resiliency

Front Door is a highly available service, and because of its globally distributed architecture, it's resilient to failures of single Azure regions and PoPs.

By using the Front Door cache, you reduce the load on your storage account. Additionally, if your storage account is unavailable, Front Door might be able to continue to serve cached responses until your application recovers.

You can further improve the resiliency of the overall solution by considering the resiliency of the storage account. For more information, see [Azure Storage redundancy](../storage/common/storage-redundancy.md). Alternatively, you can deploy multiple storage accounts, and configure multiple origins in your Front Door origin group, and configure failover between the origins by configuring each origin's priority. For more information, see [Origins and origin groups in Azure Front Door](origin.md).

### Cost optimization

Caching can help to reduce the cost of delivering static content. Front Door's PoPs store copies of responses, and can deliver these cached responses for any subsequent requests. Caching reduces the request load on the origin. In high-scale static content-based solutions, especially those delivering large files, caching can reduce the traffic costs considerably.

To use Private Link in this solution, you must deploy the premium tier of Front Door. You can use the standard tier if you don't need to block traffic going directly to your storage account. For more information, see [Origin security](#origin-security).

## Deploy this scenario

To deploy this scenario by using Bicep or JSON ARM templates, [see this quickstart](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-premium-storage-blobs-private-link).

To deploy this scenario by using Terraform, [see this quickstart](https://github.com/Azure/terraform/tree/master/quickstart/101-front-door-premium-storage-blobs-private-link).

## Next steps

Learn how to [create a Front Door profile](create-front-door-portal.md).
