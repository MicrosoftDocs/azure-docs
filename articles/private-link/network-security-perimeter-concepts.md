---
title: What is a network security perimeter?
titleSuffix: Azure Private Link
description: Learn how Azure Network Security Perimeter secures PaaS resources with logical network boundaries. Control public access, prevent data exfiltration, and manage access rules for Storage, Azure AI Search, and Key Vault.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.topic: overview
ms.date: 08/01/2025
ms.custom:
  - references_regions, ignite-2024
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:07/29/2025
---

# What is a network security perimeter?

Azure Network Security Perimeter creates logical network boundaries around your platform-as-a-service (PaaS) resources that are deployed outside your virtual networks. Network security perimeter helps you control public network access to resources like Azure Storage accounts and Azure Key Vault by establishing a secure perimeter.

By default, network security perimeter restricts public access to PaaS resources within the boundary. You can grant exceptions through explicit access rules for inbound and outbound traffic. This approach helps prevent data exfiltration while maintaining necessary connectivity for your applications.

For access patterns involving traffic from virtual networks to PaaS resources, see [What is Azure Private Link?](private-link-overview.md).

Features of a network security perimeter include:

- Resource to resource access communication within perimeter members, preventing data exfiltration to nonauthorized destinations.
- External public access management with explicit rules for PaaS resources associated with the perimeter.
- Access logs for audit and compliance.
- Unified experience across PaaS resources.

:::image type="content" source="media/network-security-perimeter-concepts/network-security-perimeter-overview.png" alt-text="Screenshot of a diagram showing the securing of a service with network security perimeter." lightbox="media/network-security-perimeter-concepts/network-security-perimeter-overview-large.png":::

[!INCLUDE [network-security-perimeter-preview-message](../../includes/network-security-perimeter-preview-message.md)]

## Components of a network security perimeter

A network security perimeter includes the following components:

| **Component** |**Description**|
|---------------------|------------------------------------------------------------------------------------------------------------|
| **Network security perimeter** | Top level resource defining logical network boundary to secure PaaS resources. |
| **Profile** | Collection of access rules that apply on resources associated with the profile. |
| **Access rule**| Inbound and outbound rules for resources in a perimeter to allow access outside the perimeter. |
| **Resource association** | Perimeter membership for a PaaS resource. |
| **Diagnostics settings** | Extension resource hosted by Microsoft Insights to collect logs & metrics for all resources in the perimeter. |

> [!NOTE]
> For organizational and informational safety, don't include any personally identifiable or sensitive data in the network security perimeter rules or other network security perimeter configurations.

## Network security perimeter properties

When creating a network security perimeter, you can specify the following properties:

| **Property** | **Description** |
|------------------|-------------|
| **Name** | A unique name within the resource group. |
| **Location** | A supported Azure region where the resource is located. |
| **Resource group name** | Name of the resource group where the network security perimeter should be present. |

## Access modes in network security perimeter

Administrators add PaaS resources to a perimeter by creating resource associations. These associations can be made in two access modes. The access modes are:

| **Mode** | **Description** |
|----------------|--------|
| **Transition mode (formerly Learning mode)**  | - Default access mode.</br>- Helps network administrators to understand the existing access patterns of their PaaS resources.</br>- Advised mode of use before transitioning to enforced mode.|
| **Enforced mode**  | - Must be set by the administrator.</br>- By default, all traffic except intra-perimeter traffic is denied in this mode unless an *Allow* access rule exists. |


Learn more on move from transition mode (formerly learning mode) to enforced mode in [Transitioning to a network security perimeter](network-security-perimeter-transition.md) article.

## Why use a network security perimeter?

Network security perimeter provides a secure perimeter for communication of PaaS services deployed outside the virtual network. It allows you to control network access to Azure PaaS resources. Some of the common use cases include:

- Create a secure boundary around  PaaS resources.
- Prevent data exfiltration by associating PaaS resources  to the perimeter.
- Enable access rules to grant access outside the secure perimeter.
- Manage access rules for all the PaaS resources within the network security perimeter in a single pane of glass.
- Enable diagnostic settings to generate access logs of PaaS resources within the perimeter for Audit and Compliance.
- Allow private endpoint traffic without the need for explicit access rules.


## How does a network security perimeter work?

When a network security perimeter is created and the PaaS resources are associated with the perimeter in enforced mode, all public traffic is denied by default thus preventing data exfiltration outside the perimeter.  

Access rules can be used to approve public inbound and outbound traffic outside the perimeter. Public inbound access can be approved using Network and Identity attributes of the client such as source IP addresses, subscriptions. Public outbound access can be approved using FQDNs (Fully Qualified Domain Names) of the external destinations. 

For example, upon creating a network security perimeter and associating a set of PaaS resources with the perimeter like Azure Key Vault and Azure Storage in enforced mode, all incoming and outgoing public traffic is denied to these PaaS resources by default. To allow any access outside the perimeter, necessary access rules can be created. Within the same perimeter, profiles can be created to group PaaS resources with similar set of inbound and outbound access requirements.

## Onboarded private link resources

A network security perimeter-aware private link resource is a PaaS resource that can be associated with a network security perimeter. Currently the list of onboarded private link resources are as follows:

| Private link resource name | Resource type | Resources | Availability |
|---------------------------|---------------|-----------| --------- |
| [Azure Monitor](/azure/azure-monitor/essentials/network-security-perimeter)             | Microsoft.Insights/dataCollectionEndpoints</br>Microsoft.Insights/ScheduledQueryRules</br>Microsoft.Insights/actionGroups</br>Microsoft.OperationalInsights/workspaces | Log Analytics Workspace, Application Insights, Alerts, Notification Service | Generally available |
| [Azure AI Search](/azure/search/search-security-network-security-perimiter)          | Microsoft.Search/searchServices | | Generally Available |
| [Cosmos DB](/azure/cosmos-db/how-to-configure-nsp)                | Microsoft.DocumentDB/databaseAccounts | | Public Preview |
| [Event Hubs](/azure/event-hubs/network-security-perimeter)                | Microsoft.EventHub/namespaces | | Generally Available |
| [Key Vault](/azure/key-vault/general/network-security#network-security-perimeter-preview)                 | Microsoft.KeyVault/vaults | | Generally Available |
| [SQL DB](/azure/azure-sql/database/network-security-perimeter)                    | Microsoft.Sql/servers | | Public Preview |
| [Storage](/azure/storage/common/storage-network-security#network-secuirty-perimeter-preview)               | Microsoft.Storage/storageAccounts | | Generally Available |
| [Azure OpenAI service](/azure/ai-services/openai/how-to/network-security-perimeter) | Microsoft.CognitiveServices(kind="OpenAI") | | Public Preview |
| [Microsoft Foundry](/azure/ai-foundry/how-to/add-foundry-to-network-security-perimeter) | Microsoft.CognitiveServices(kind="AIServices") | | Generally Available |

> [!IMPORTANT]
> The following onboarded services are in public preview with Network Security Perimeter:
> - Cosmos DB
> - SQL DB
> - Azure Open AI Service
>   
> These previews are provided without a service level agreement, and it's not recommended for production workloads.
> Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!NOTE]
> Refer to the respective private link resource documentation for information on currently unsupported scenarios.

## Supported access rule types

Network security perimeter supports the following access rule types:

| Direction | Access rule type | 
|---------------------------|---------------|
| Inbound | Subscription-based rules |
| Inbound | IP-based rules (check respective onboarded private link resources for v6 support)| 
| Outbound | FQDN-based rules |

> [!NOTE]
> Intra-perimeter traffic and inbound access rules that are subscription-based don't support authentication via shared access signature (SAS) token. In these scenarios, requests that use an SAS token are rejected and display an authentication error. Use an alternative supported authentication method per your specific resource.

## Limitations of a network security perimeter

### Logging limitations

Network security perimeter is currently available in all Azure public cloud regions. However, while enabling access logs for network security perimeter, the Log Analytics workspace to be associated with the network security perimeter needs to be located in one of the Azure Monitor supported regions.

> [!NOTE]
> For PaaS resource logs, use **Log Analytics Workspace, Storage or Event Hub** as the log destination associated to the same perimeter as the PaaS resource.

[!INCLUDE [network-security-perimeter-limits](../../includes/network-security-perimeter-limits.md)]

## Next steps

> [!div class="nextstepaction"]
> [Create a network security perimeter in the Azure portal](./create-network-security-perimeter-portal.md)
