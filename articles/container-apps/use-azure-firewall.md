---
title: Use Azure Firewall with Azure Container Apps
description: Learn about securing Azure Container Apps using Azure Firewall.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: overview
ms.date: 04/03/2025
ms.author: cshoe
---

# Integrate with Azure Firewall

This article tells you how to integrate your Azure Container Apps environment with Azure Firewall using user defined routes (UDR). Using UDR, you can control how traffic is routed within your virtual network. You can route all outbound traffic from your container apps through Azure Firewall, which provides a central point for monitoring traffic and applying security policies. This setup helps protect your container apps from potential threats. It also helps in meeting compliance requirements by providing detailed logs and monitoring capabilities.

## User defined routes (UDR)

User Defined Routes (UDR) and controlled egress through NAT Gateway are supported only in a workload profiles environment.

- You can use UDR to restrict outbound traffic from your container app through Azure Firewall or other network appliances. For more information, see [Control outbound traffic in Azure Container Apps with user defined routes](./user-defined-routes.md).

- Configuring UDR is done outside of the Container Apps environment scope.

:::image type="content" source="media/networking/udr-architecture.png" alt-text="Diagram of how UDR is implemented for Container Apps.":::

Azure creates a default route table for your virtual networks upon create. By implementing a user-defined route table, you can control how traffic is routed within your virtual network. For example, you can create a UDR that restricts outbound traffic from your container app by routing it to Azure Firewall.

When using UDR with Azure Firewall in Azure Container Apps, you must add the following application or network rules to the allowlist for your firewall, depending on which resources you're using.

> [!NOTE]
> You only need to configure either application rules or network rules, depending on your system’s requirements. Configuring both at the same time is not necessary.

## Application rules

Application rules allow or deny traffic based on the application layer. The following outbound firewall application rules are required based on the scenario.

| Scenarios | FQDNs | Description |
|--|--|--|
| All scenarios | `mcr.microsoft.com`, `*.data.mcr.microsoft.com` | These FQDNs for Microsoft Container Registry (MCR) are used by Azure Container Apps. Either these application rules or the network rules for MCR must be added to the allowlist when using Azure Container Apps with Azure Firewall. |
| Azure Container Registry (ACR) | *Your-ACR-address*, `*.blob.core.windows.net`, `login.microsoft.com` | These FQDNs are required when using Azure Container Apps with ACR and Azure Firewall. |
| Azure Key Vault | *Your-Azure-Key-Vault-address*, `login.microsoft.com` | These FQDNs are required in addition to the service tag required for the network rule for Azure Key Vault. |
| Managed Identity | `*.identity.azure.net`, `login.microsoftonline.com`, `*.login.microsoftonline.com`, `*.login.microsoft.com` | These FQDNs are required when using managed identity with Azure Firewall in Azure Container Apps.
| Aspire Dashboard | `https://northcentralus.ext.azurecontainerapps.dev` | This FQDN is required when using Aspire dashboard in an environment configured with a virtual network. |
| Docker Hub Registry | `hub.docker.com`, `registry-1.docker.io`, `production.cloudflare.docker.com` | If you're using [Docker Hub registry](https://docs.docker.com/desktop/allow-list/) and want to access it through the firewall, you need to add these FQDNs to the firewall. |

## Network rules

Network rules allow or deny traffic based on the network and transport layer. When using UDR with Azure Firewall in Azure Container Apps, you must add the following outbound firewall network rules based on the scenario.

| Scenarios | Service Tag | Description |
|--|--|--|
| All scenarios | `MicrosoftContainerRegistry`, `AzureFrontDoorFirstParty`  | These Service Tags for Microsoft Container Registry (MCR) are used by Azure Container Apps. Either these network rules or the application rules for MCR must be added to the allowlist when using Azure Container Apps with Azure Firewall. |
| Azure Container Registry (ACR) | `AzureContainerRegistry`, `AzureActiveDirectory` | When using ACR with Azure Container Apps, you need to configure these network rules used by Azure Container Registry. |
| Azure Key Vault | `AzureKeyVault`, `AzureActiveDirectory` | These service tags are required in addition to the FQDN for the network rule for Azure Key Vault. |
| Managed Identity | `AzureActiveDirectory` | When using Managed Identity with Azure Container Apps, you'll need to configure these network rules used by Managed Identity. | 

> [!NOTE]
> For Azure resources you're using with Azure Firewall not listed in this article, please refer to the [service tags documentation](../virtual-network/service-tags-overview.md#available-service-tags).

## Next steps

> [!div class="nextstepaction"]
> [Configure a DNS for virtual networks in Azure Container Apps environments](private-endpoints-and-dns.md)
