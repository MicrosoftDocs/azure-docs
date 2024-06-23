---
title: Service tags for Azure Container Registry
description: Learn about service tags for Azure Container Registry, which you can use to define network access controls for Azure resources.
author: tejaswikolli-web
ms.author: tejaswikolli
ms.service: container-registry
ms.topic: best-practice #Don't change
ms.date: 04/30/2024

---

# Service tags for Azure Container Registry

Service tags help set rules to allow or deny traffic to a specific Azure service. In Azure Container Registry, a service tag represents a group of IP address prefixes that can be used to access the service either globally or per Azure region. Azure Container Registry generates network traffic that originates from a service tag for features such as image import, webhooks, and Azure Container Registry tasks.

Microsoft manages the address prefixes that a service tag encompasses. Microsoft automatically updates a service tag as addresses change, to minimize the complexity of frequent updates to network security rules.

When you configure a firewall for a registry, Azure Container Registry serves the requests on the IP addresses for its service tags. For the scenarios mentioned in [Firewall access rules](container-registry-firewall-access-rules.md), you can configure the firewall outbound rule to allow access to Azure Container Registry IP addresses for service tags.

## Image import

Azure Container Registry sends requests to the external registry service through service-tag IP addresses to download images. If the external registry service runs behind a firewall, it requires an inbound rule to allow IP addresses for service tags. These IPs fall under the `AzureContainerRegistry` service tag, which includes the necessary IP ranges for importing images from public or Azure registries.

Azure ensures that these IP ranges are updated automatically. Establishing this security protocol is crucial for upholding the registry's integrity and ensuring its availability.

To configure network security rules and allow traffic from the `AzureContainerRegistry` service tag for image import in Azure Container Registry, see [About registry endpoints](container-registry-firewall-access-rules.md#about-registry-endpoints). For detailed steps and guidance on how to use the service tag during image import, see [Import container images to a container registry](container-registry-import-images.md).

## Webhooks

In Azure Container Registry, you use service tags to manage network traffic for features like webhooks to ensure that only trusted sources can trigger these events. When you set up a webhook in Azure Container Registry, it can respond to events at the registry level or be scoped down to a specific repository tag. For geo-replicated registries, you configure each webhook to respond to events in a specific regional replica.

The endpoint for a webhook must be publicly accessible from the registry. You can configure registry webhook requests to authenticate to a secured endpoint.

Azure Container Registry sends the request to the configured webhook endpoint through the IP addresses for service tags. If the webhook endpoint runs behind a firewall, it requires an inbound rule to allow these IP addresses. To help secure the webhook endpoint access, you must also configure the proper authentication to validate the request.

For detailed steps on creating a webhook setup, refer to the [Azure Container Registry documentation](container-registry-webhook.md).

## Azure Container Registry tasks

When you're using Azure Container Registry tasks, such as when you're building container images or automating workflows, the service tag represents the group of IP address prefixes that Azure Container Registry uses.

During the execution of tasks, Azure Container Registry sends requests to external resources through the IP addresses for service tags. If an external resource runs behind a firewall, it requires an inbound rule to allow these IP addresses. Applying these inbound rules is a common practice to help ensure security and proper access management in cloud environments.

To learn more about Azure Container Registry tasks, see [Automate container image builds and maintenance with Azure Container Registry tasks](container-registry-tasks-overview.md). To learn how to use a service tag to set up firewall access rules for Azure Container Registry tasks, see [Configure rules to access an Azure container registry behind a firewall](container-registry-firewall-access-rules.md).

## Best practices

* Configure and customize network security rules to allow traffic from the `AzureContainerRegistry` service tag for features like image import, webhooks, and Azure Container Registry tasks, such as port numbers and protocols.

* Set up firewall rules to permit traffic solely from IP ranges that are associated with Azure Container Registry service tags for each feature.

* Detect and prevent unauthorized traffic that doesn't originate from Azure Container Registry IP addresses for service tags.

* Monitor network traffic continuously and review security configurations periodically to address unexpected traffic for each Azure Container Registry feature by using [Azure Monitor](/azure/azure-monitor/overview) or [Network Watcher](/azure/network-watcher/frequently-asked-questions).
