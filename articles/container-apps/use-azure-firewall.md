---
title: Use Azure Firewall with Azure Container Apps
description: Learn about integrating Azure Container Apps with Azure Firewall for security.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: concept-article
ms.date: 03/30/2026
ms.author: cshoe
---

# Azure Container Apps environment integration with Azure Firewall

This article explains concepts for integrating your Azure Container Apps environment with Azure Firewall by using user-defined routes (UDRs). By using UDRs, you can control how traffic is routed within your virtual network.

You can route all outbound traffic from your container apps through Azure Firewall, which provides a central point for monitoring traffic and applying security policies. This setup helps protect your container apps from potential threats. It also helps you meet compliance requirements by providing detailed logs and monitoring capabilities.

## User-defined routes

UDRs and controlled egress through Azure NAT Gateway are supported only in a workload profile environment.

Use a UDR to restrict outbound traffic from your container app through Azure Firewall or other network appliances. For more information, see [Control outbound traffic in Azure Container Apps with user-defined routes](./user-defined-routes.md).

You configure a UDR outside the Container Apps environment scope.

:::image type="content" source="media/networking/udr-architecture.png" alt-text="Diagram of how a user-defined route is implemented for Container Apps.":::

Azure creates a default route table for your virtual networks when you create those networks. By implementing a user-defined route table, you can control how traffic is routed within your virtual network. For example, you can create a UDR that restricts outbound traffic from your container app by routing it to Azure Firewall.

When you use a UDR with Azure Firewall in Container Apps, add application or network rules to the allow list for your firewall, depending on which resources you're using.

> [!NOTE]
> Configure either application rules or network rules, depending on your system's requirements. Configuring both at the same time isn't necessary.

## Application rules

Application rules allow or deny traffic based on the application layer. The following outbound firewall application rules and their fully qualified domain names (FQDNs) are required, based on the scenario.

| Scenarios | FQDNs | Description |
| --- | --- | --- |
| All scenarios | `mcr.microsoft.com`, `*.data.mcr.microsoft.com` | Container Apps uses these FQDNs for Microsoft Artifact Registry. When you're using Container Apps with Azure Firewall, add either these application rules or the network rules for Artifact Registry to the allow list. |
| All scenarios | `packages.aks.azure.com`, `acs-mirror.azureedge.net` | The underlying Azure Kubernetes Service (AKS) cluster requires these FQDNs to download and install Kubernetes and Azure Container Network Interface (CNI) binaries. When you're using Container Apps with Azure Firewall, add either these application rules or the network rules for Artifact Registry to the allow list. For more information, see [Azure Global required FQDN / application rules](/azure/aks/outbound-rules-control-egress#azure-global-required-fqdn--application-rules). |
| Azure Container Registry | `<your-Container-Registry-address>`, `*.blob.core.windows.net`, `login.microsoft.com` | These FQDNs are required when you're using Container Apps with Container Registry and Azure Firewall. |
| Azure Key Vault | `<your-Key-Vault-address>`, `login.microsoft.com` | These FQDNs are required in addition to the service tag required for the network rule for Key Vault. |
| Managed identity | `*.identity.azure.net`, `login.microsoftonline.com`, `*.login.microsoftonline.com`, `*.login.microsoft.com` | These FQDNs are required when you're using a managed identity with Azure Firewall in Container Apps. |
| Azure Service Bus | `*.servicebus.windows.net` | These FQDNs are required when your container apps communicate with Service Bus (queues, topics, or subscriptions) through Azure Firewall. |
| Aspire dashboard | `https://<YOUR-CONTAINER-APP-REGION>.ext.azurecontainerapps.dev` | This FQDN is required when you're using the Aspire dashboard in an environment configured with a virtual network. Update the FQDN with your container app's region. |
| Docker Hub registry | `hub.docker.com`, `registry-1.docker.io`, `production.cloudflare.docker.com` | If you're using a [Docker Hub registry](https://docs.docker.com/desktop/allow-list/) and want to access it through the firewall, add these FQDNs to the firewall. |
| Azure Service Bus | `*.servicebus.windows.net` | This FQDN is required when you're using Service Bus with Container Apps and Azure Firewall. |
| Azure operated by 21Vianet (Azure in China): Microsoft Artifact Registry | `mcr.azure.cn`, `*.data.mcr.azure.cn` | These Artifact Registry endpoints are used to pull container images in the Azure in China environment. |
| Azure in China: AKS infrastructure | `mcr.azk8s.cn`, `mirror.azk8s.cn` | These China-specific AKS mirrors are used to download Kubernetes binaries and container images. |
| Azure in China: Azure Container Registry | `*.azurecr.cn` | This FQDN is required when you're using Container Registry in the Azure in China environment. |
| Azure in China: managed identity | `*.identity.azure.cn`, `login.chinacloudapi.cn`, `*.login.chinacloudapi.cn` | These FQDNs are required when you're using a managed identity in the Azure in China environment. |
| Azure in China: Azure Key Vault | `*.vault.azure.cn`, `login.chinacloudapi.cn` | These FQDNs are required when you're using Key Vault in the Azure in China environment. |
| Azure in China: Azure management | `management.chinacloudapi.cn`, `*.blob.core.chinacloudapi.cn` | These FQDNs are required for Azure Resource Manager API calls and platform-managed storage accounts in the Azure in China environment. |
| Azure in China: monitoring | `*.servicebus.chinacloudapi.cn`, `mooncake.warmpath.chinacloudapi.cn` | These FQDNs are required for platform monitoring and telemetry ingestion in the Azure in China environment. |
| Azure in China: Container Apps platform | `*.chinacloudsites.cn`, `*.ext.azurecontainerapps-dev.cn` | These FQDNs are required for the Container Apps regional control plane and extensions API in the Azure in China environment. |
| Azure in China: Aspire dashboard | `*.azurecontainerapps.cn` | These FQDNs are required when you're using the Aspire dashboard or app FQDNs in the Azure in China environment. |

> [!NOTE]
> The Azure in China FQDNs apply only to the *Azure in China environment*. Docker Hub FQDNs are the same globally, but access from China might be unreliable. Consider mirroring images to Container Registry (`*.azurecr.cn`) instead.

## Network rules

Network rules allow or deny traffic based on the network and transport layer. When you use a UDR with Azure Firewall in Container Apps, add the following outbound firewall network rules based on the scenario.

| Scenarios | Service tags | Description |
| --- | --- | --- |
| All scenarios | `MicrosoftContainerRegistry`, `AzureFrontDoorFirstParty` | Container Apps uses these service tags for Microsoft Artifact Registry. To allow Container Apps to use Artifact Registry, add either these network rules or the application rules for Artifact Registry to the allow list when you're using Container Apps with Azure Firewall. |
| Azure Container Registry | `AzureContainerRegistry`, `AzureActiveDirectory` | When you use Container Registry with Container Apps, configure these network rules that Container Registry uses. |
| Azure Key Vault | `AzureKeyVault`, `AzureActiveDirectory` | These service tags are required in addition to the FQDN for the network rule for Key Vault. |
| Managed identity | `AzureActiveDirectory` | When you use a managed identity with Container Apps, configure these network rules that the managed identity uses. |
| Azure Service Bus | `ServiceBus` | This service tag is required when your container apps access Service Bus by using Azure Firewall and service tags. |

> [!NOTE]
> For Azure resources you're using with Azure Firewall that aren't listed in this article, see the [service tags documentation](../virtual-network/service-tags-overview.md#available-service-tags).

## Next step

> [!div class="nextstepaction"]
> [Configure a DNS for virtual networks in Azure Container Apps environments](private-endpoints-with-dns.md)
