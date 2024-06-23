---
title: Reliable file upload to Azure Storage Blob through Azure Front Door
description: Learn how to use Azure Front Door with Azure Storage Blob for the upload of mission critical content to enable a secure, reliable, and scalable architecture.
services: front-door
author: kostinams
ms.service: frontdoor
ms.topic: conceptual
ms.date: 05/10/2024
ms.author: irkostin
ms.reviewer: hmb
---

# Reliable file upload to Azure Storage Blob through Azure Front Door

Utilizing Azure Front Door to upload files to Azure Storage offers many benefits, including enhanced resiliency, scalability, and extra security measures. These measures include the scanning of uploaded content with Web Application Firewall (WAF) and the use of custom Transport Layer Security (TLS) certificates for storage accounts.

## Architecture

![Architecture diagram showing traffic flowing through Front Door to the storage accounts when uploading blobs.](media/scenario-storage-blobs-upload/upload-blob-front-door-architecture-highres.png)

In this reference architecture, multiple Azure storage accounts and an Azure Front Door profile with various origins are deployed. Utilizing multiple storage accounts for content upload improve performance and reliability and facilitates load distribution by having different clients use storage accounts in different orders. You deploy as well Azure App Service to host API, and Azure Service Bus queue.

## Dataflow

The dataflow in this scenario is as follows:

1. The client app initiates a web-based API, retrieving a list of multiple upload locations. For each file that the client uploads, the API generates a list of possible upload locations, with one in each of the existing storage accounts. Each URL contains a Shared Access Signature (SAS), ensuring the exclusive use of the URL for uploading to the designated blob URL.
2. The client application attempts to upload a blob using first URL from the list returned by API. The client establishes a secure connection to Azure Front Door by using a custom domain name and custom TLS certificate. 
3. The Azure Front Door WAF scans the request. If the WAF determines the request's risk level is too high, it blocks the request and Azure Front Door returns an HTTP 403 error response. If not, the request is routed to the desired storage account.
4. The file is uploaded into Azure Storage account. If this request fails, the client application will attempt to upload to an alternative storage account using next URL in the list returned by the API.
5. The client application notifies the API that the file upload is complete.
6. The API places an item in Azure Service Bus queue for further processing of uploaded file.

## Components

- Azure App Service is responsible for generating the upload URLs and SAS for blobs.
- Azure Front Door handles client connections, scans them with the WAF, and routes the upload request to Azure storage account.
- Azure Storage is utilized for storing uploaded files in blobs.
- Azure Service Bus serves as a queue to trigger further processing of uploaded content.

## Scenario details

Often the responsibility of file upload is assigned to the API or backend systems. However, by enabling the client application to directly upload JSON files into blob storage, we ensure that the compute resource (the API layer handling the uploads from the client) isn't the bottleneck. This approach also reduces the overall cost, since the API no longer expends compute time on file uploads.

The API is responsible for ensuring an even distribution of files across storage accounts. This implies that you must define a logic to determine the default storage account for the client application to use.

The combination of Azure Front Door and Azure Storage accounts provides a single point of entry (a single domain) for content upload.

### Azure Front Door configuration with multiple storage account origins

The configuration of Azure Front Door includes the following steps for each storage account:

- Origin configuration
- Route configuration
- Rule set configuration

1. In the *origin configuration*, you need to define the origin type as a blob storage account and select the appropriate storage account available within your subscription.

    :::image type="content" source="./media/scenario-storage-blobs-upload/origin.png" lightbox="./media/scenario-storage-blobs-upload/origin.png" alt-text="Screenshot of the origin configuration.":::

1. In the *Origin group route*, you have to define a path for processing with in the origin group. Ensure to select the newly created origin group and specify the path to the container within the storage account.

    :::image type="content" source="./media/scenario-storage-blobs-upload/route-configuration.png" alt-text="Screenshot of the route configuration.":::

1. Finally, you need to create a new Rule set configuration. It's important to configure *Preserve unmatched path* setting, which allows appending the remaining path after the source pattern to the new path.

    :::image type="content" source="./media/scenario-storage-blobs-upload/rule-set.png" lightbox="./media/scenario-storage-blobs-upload/rule-set.png" alt-text="Screenshot of the rule set configuration.":::

## Considerations

### Scalability and performance

The proposed architecture allows you to achieve horizontal scalability by using multiple storage accounts for content upload.

### Resiliency

Azure Front Door, with its globally distributed architecture, is a highly available service that is resilient to failures of a single Azure region and Point of Presence (PoPs).
This architecture, which deploys multiple storage accounts in different regions, increases resiliency and helps to achieve load distribution by having different clients using storage accounts in different orders.

### Cost optimization

The cost structure of Azure Storage allows for creation of any amount of storage account as required without increasing the costs of the solution. The amount and size of the stored files affect the costs.

### Security

By using Azure Front Door you're benefiting from security features, such as DDoS protection. The default Azure infrastructure DDoS protection, which monitors and mitigates network layer attacks in real-time by using the global scale and capacity of Azure Front Door’s network. The use of Web Application Firewall (WAF) protects your web services against common exploits and vulnerabilities. You can also use Azure Front Door WAF to perform rate limiting and geo-filtering if your application requires those capabilities.

It's also possible to secure Azure Storage accounts by using Private Link. The storage account can be configured to deny direct access from the internet, and to only allow requests through the private endpoint connection used by Azure Front Door. This configuration ensures that every request gets processed by Front Door, and avoids exposing the contents of your storage account directly to the internet. However, this configuration requires the premium tier of Azure Front Door. If you use the standard tier, your storage account must be publicly accessible.

### Custom domain names

Azure Front Door supports custom domain names, and can issue and manage TLS certificates for those domains. By using custom domains, you can ensure that your clients receive files from a trusted and familiar domain name, and that TLS encrypts every connection to Front Door. When Front Door manages your TLS certificates, you avoid outages and security issues due to invalid or outdated TLS certificates.

Azure Storage also supports custom domain names, but doesn't support HTTPS when using a custom domain. Front Door is the best approach to use a custom domain name with a storage account.

## Deploy this scenario

To deploy this scenario by using Bicep, see deploy [Azure Front Door Premium with blob origin and Private Link](/samples/azure/azure-quickstart-templates/front-door-standard-premium-storage-blobs-upload/).

## Next steps

Learn how to [create a Front Door profile](create-front-door-portal.md).
