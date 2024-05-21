---
title: "Service tags for Azure Container Registry"
description: "Learn and understand the service tags for Azure Container Registry. Service tags are used to define network access controls for Azure resources."
author: tejaswikolli-web
ms.author: tejaswikolli
ms.service: container-registry
ms.topic: best-practice #Don't change
ms.date: 04/30/2024

---

# Service tags for Azure Container Registry

Service tags help set rules to allow or deny traffic to a specific Azure service. A service tag represents a group of IP address prefixes from a given Azure service. Service tags in Azure Container Registry (ACR), represents a group of IP address prefixes that can be used to access the service either globally or per Azure region. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change, minimizing the complexity of frequent updates to network security rules.

Azure Container Registry (ACR) generates network traffic originating from the ACR service tag for features such as Image import, Webhook, and ACR Tasks.

When you configure a firewall for a registry, ACR serves the requests on its service tag IP addresses. For the scenarios mentioned in [Firewall access rules](container-registry-firewall-access-rules.md), customers can configure the firewall outbound rule to allow access to ACR service tag IP addresses.

## Import images 

Azure Container Registry (ACR) initiates requests to external registry services via service tag IP addresses for image downloads. If the external registry service operates behind a firewall, it requires an inbound rule to accept ACR service tag IP addresses. These IPs fall under the ACR service tag, which includes the necessary IP ranges for importing images from public or Azure registries. Azure ensures these ranges are updated automatically. Establishing this security protocol is crucial for upholding the registry's integrity and ensuring its availability. 

ACR sends requests to the external registry service through service tag IP addresses to download the images. If the external registry service runs behind firewall, it needs to have inbound rule to allow ACR service tag IP addresses. These IPs are part of the AzureContainerRegistry service tag, which encompasses IP ranges necessary for importing images from public or Azure registries. Configuring a security measure to maintain the registry's integrity and accessibility.

Learn about [registry endpoints](container-registry-firewall-access-rules.md#about-registry-endpoints) to configure network security rules and allow traffic from the ACR service tag for image import in ACR.

For detailed steps and guidance on how to use the service tag during image import, refer to the [Azure Container Registry documentation](container-registry-import-images.md).

## Webhooks 

Service tags in Azure Container Registry (ACR) are used to manage network traffic for features like webhooks to ensure only trusted sources are able to trigger these events. When you set up a webhook in ACR, it can respond to events at the registry level or be scoped down to a specific repository tag. For geo-replicated registries, you configure each webhook to respond to events in a specific regional replica.

The endpoint for a webhook must be publicly accessible from the registry. You can configure registry webhook requests to authenticate to a secured endpoint. ACR sends the request to the configured webhook endpoint through service tag IP addresses. If the webhook endpoint runs behind firewall, it needs to have inbound rule to allow ACR service tag IP addresses. Additionally, to secure the webhook endpoint access, the customer must configure the proper authentication to validate the request.

For detailed steps on creating a webhook setup, refer to the [Azure Container Registry documentation](container-registry-webhook.md).

## ACR Tasks

ACR Tasks, such as when you’re building container images or automating workflows, the service tag represents the group of IP address prefixes that ACR uses. During the execution of tasks, Tasks send requests to external resources through service tag IP addresses. If the external resource runs behind firewall, it needs to have inbound rule to allow ACR service tag IP addresses. Applying these inbound rules is a common practice to ensure security and proper access management in cloud environments.

Learn more about [ACR Tasks](container-registry-tasks-overview.md) and how to use the service tag to set up [firewall access rules](container-registry-firewall-access-rules.md) for ACR Tasks.

## Best practices

* Configure and customize the network security rules to allow traffic from the AzureContainerRegistry service tag for features like image import, webhooks, and ACR Tasks, such as port numbers and protocols.

* Set up firewall rules to permit traffic solely from IP ranges associated with ACR service tags for each feature.

* Detect and prevent unauthorized traffic not originating from ACR service tag IP addresses.

* Monitor network traffic continuously and review security configurations periodically to address unexpected traffic for each ACR feature using [Azure Monitor](/azure/azure-monitor/overview) or [Network Watcher](/azure/network-watcher/frequently-asked-questions).
