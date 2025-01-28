---
title: Use Azure Front Door with Azure Storage blobs
description: Learn how to use Front Door with storage blobs for accelerating content delivery of static content, enabling a secure and scalable architecture.
services: front-door
author: duongau
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 11/13/2024
ms.author: duau
---

# Use Azure Front Door with Azure Storage Blobs

Azure Front Door enhances the delivery of static content from Azure Storage blobs, providing a secure and scalable architecture. This setup is ideal for various use cases, such as website hosting and file delivery.

## Architecture

:::image type="content" source="./media/scenario-storage-blobs/architecture-diagram.png" alt-text="Diagram of Azure Front Door with a blob storage origin." border="false":::

In this reference architecture, a storage account and an Azure Front Door profile with a single origin are deployed.

## Dataflow

The data flows through the scenario as follows:

1. The client establishes a secure connection to Azure Front Door using a custom domain name and a Front Door-provided TLS certificate. The connection terminates at a nearby Front Door point of presence (PoP).
1. Azure Front Door web application firewall (WAF) scans the request. If the WAF determines the request is too risky, it blocks the request and returns an HTTP 403 error response.
1. If the Front Door PoP's cache contains a valid response, Front Door returns the response immediately.
1. If not, the PoP sends the request to the origin storage account using Microsoft's backbone network, using a separate, long-lived TCP connection. In this scenario, Private Link securely connects to the storage account.
1. The storage account sends a response to the Front Door PoP.
1. The PoP stores the response in its cache for future requests.
1. The PoP returns the response to the client.
1. Any direct requests to the storage account through the internet get blocked by the Azure Storage firewall.

## Components

- [Azure Storage](https://azure.microsoft.com/products/storage/blobs): Stores static content in blobs.
- [Azure Front Door](https://azure.microsoft.com/services/frontdoor/): Receives inbound connections from clients, scans them with the WAF, securely forwards the requests to the storage account, and caches responses.

### Alternatives

If you store static files with another cloud storage provider or on your own infrastructure, this scenario still largely applies. However, you need to ensure that incoming traffic to your origin server is verified to come through Front Door. If your storage provider doesn't support Private Link, consider using an alternative approach like [allowlisting the Front Door service tag and inspecting the `X-Azure-FDID` header](origin-security.md).

## Scenario Details

Static content delivery is beneficial in many situations, such as:
- Delivering images, CSS files, and JavaScript files for a web application.
- Serving files and documents, such as PDF or JSON files.
- Delivering nonstreaming video.

Static content typically doesn't change frequently and can be large in size, making it ideal for caching to improve performance and reduce costs.

In complex scenarios, a single Front Door profile can serve both static and dynamic content. You can use separate origin groups for each type of content and use the routing capabilities to direct incoming requests to the appropriate origin.

## Considerations

### Scalability and Performance

Azure Front Door acts as a content delivery network (CDN), caching content at its globally distributed PoPs. When a cached response is available, Azure Front Door quickly serves it, enhancing performance and reducing the load on the origin. If the PoP lacks a valid cached response, Azure Front Door's traffic acceleration capabilities expedite content delivery from the origin.

### Security

#### Authentication

Azure Front Door is designed for internet-facing scenarios and is optimized for publicly accessible blobs. To authenticate access to blobs, consider using [shared access signatures (SAS)](../storage/common/storage-sas-overview.md). Ensure you enable the [*Use Query String* behavior](front-door-caching.md#query-string-behavior) to prevent Azure Front Door from serving requests to unauthenticated clients. This approach might limit the effectiveness of caching, as each request with a different SAS must be sent to the origin.

#### Origin Security

- If you are using the premium tier, Azure Front Door can connect securely to the Azure Storage account using [Private Link](private-link.md). The storage account can be configured to deny public network access, allowing requests only through the private endpoint used by Azure Front Door. This setup ensures all requests get processed by Azure Front Door, protecting your storage account from direct internet exposure. 
- If you are using the standard tier, you can secure requests with a [shared access signature (SAS)](../storage/common/storage-sas-overview.md) and either have clients include the SAS in their requests or use the Azure Front Door [rules engine](front-door-rules-engine.md) to attach it. Note that the storage account's network access must be publicly accessible (from all networks or from Front Door IP addresses in AzureFrontDoor.Backend service tag).

#### Custom Domain Names

Azure Front Door supports custom domain names and can manage TLS certificates for these domains. Using custom domains ensures clients receive files from a trusted source, with TLS encrypting every connection to Azure Front Door. Azure Front Door's management of TLS certificates helps avoid outages and security issues from invalid or outdated certificates.

#### Web Application Firewall

The Azure Front Door WAF's managed rule sets scan requests for common and emerging security threats. We recommend using the WAF and managed rules for both static and dynamic applications.

Additionally, the Azure Front Door WAF can perform [rate limiting](../web-application-firewall/afds/waf-front-door-rate-limit.md) and [geo-filtering](../web-application-firewall/afds/waf-front-door-geo-filtering.md) if needed.

### Resiliency

Azure Front Door is a highly available service with a globally distributed architecture, making it resilient to failures in individual Azure regions and PoPs.

Using the Azure Front Door cache reduces the load on your storage account. If your storage account becomes unavailable, Azure Front Door might continue to serve cached responses until your application recovers.

To further improve resiliency, consider the redundancy of your storage account. For more information, see [Azure Storage redundancy](../storage/common/storage-redundancy.md). Alternatively, deploy multiple storage accounts and configure multiple origins in your Azure Front Door origin group. Set up fail over between origins by configuring each origin's priority. For more information, see [Origins and origin groups in Azure Front Door](origin.md).

### Cost Optimization

Caching helps reduce the cost of delivering static content. Azure Front Door's PoPs store copies of responses and can deliver these cached responses for subsequent requests, reducing the request load on the origin. In high-scale static content solutions, especially those delivering large files, caching can significantly reduce traffic costs.

To use Private Link in this solution, deploy the premium tier of Azure Front Door. The standard tier can be used if you don't need to block direct traffic to your storage account. For more information, see [Origin security](#origin-security).

## Deploy This Scenario

To deploy this scenario using Bicep or JSON ARM templates, [see this quickstart](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-premium-storage-blobs-private-link).

To deploy this scenario using Terraform, [see this quickstart](https://github.com/Azure/terraform/tree/master/quickstart/101-front-door-premium-storage-blobs-private-link).

## Next Steps

Learn how to [create an Azure Front Door profile](create-front-door-portal.md).
