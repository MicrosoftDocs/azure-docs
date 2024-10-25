---
title: What is Azure Network Security Perimeter?
description: Learn about the components of Azure Network Security Perimeter, a feature that allows Azure PaaS resources to communicate within an explicit trusted boundary, or perimeter.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.topic: overview
ms.date: 09/16/2024
ms.custom: references_regions
#CustomerIntent: As a network security administrator, I want to understand how to use Azure Network Security Perimeter to control network access to Azure PaaS resources.
---

# What is Azure Network Security Perimeter?

Azure Network Security Perimeter is a service that provides a secure perimeter for communication of Platform as a Service (PaaS) services deployed outside the virtual network. These PaaS services can communicate with each other within the perimeter, and can also communicate with resources outside the perimeter using public inbound and outbound access rules.

Features of Azure Network Security Perimeter include:
- All resources inside perimeter can communicate with any other resource within perimeter.
- External access is available for the following controls:
  - Public inbound access can be approved using Network and Identity attributes of the client such as source IP addresses, subscriptions.
  - Public outbound can be approved using FQDNs (Fully Qualified Domain Names) of the external destinations.
- Diagnostic Settings can be enabled to view access logs of PaaS resources within the perimeter for Audit and Compliance.
- Resources with Private Endpoints can additionally accept communication from customer virtual networks, both network security perimeter and Private Endpoints are independent controls.

:::image type="content" source="media/network-security-perimeter-concepts/network-security-perimeter-overview.png" alt-text="Diagram of securing a service with network security perimeter." lightbox="media/network-security-perimeter-concepts/network-security-perimeter-overview.png":::

[!INCLUDE [network-security-perimeter-preview-message](../../includes/network-security-perimeter-preview-message.md)]

## Why use Azure Network Security Perimeter?

Network security perimeter provides a secure perimeter for communication of PaaS services deployed outside the virtual network. It allows you to control network access to Azure PaaS resources. Some of the common use cases include:

- Create a secure boundary between PaaS services.
- Enable **secured by perimeter** under public network access of PaaS service to enable control by network security perimeter.
- Create inbound and outbound access rules to allow any communication outside the secure perimeter.
- Associate the PaaS resources with similar set of inbound and outbound access requirement under different profiles of the same perimeter.
- Prevent data exfiltration by adding PaaS services to the perimeter and creating rules.
- Manage access rules for all their PaaS services under a single pane of a network security perimeter.

## How does Azure Network Security Perimeter work?

By using network security perimeter, you can create a secure perimeter for communication of PaaS services deployed outside the virtual network. This service allows you to control network access to Azure PaaS resources. When you create a network security perimeter, you associate PaaS resources with the perimeter. Then, you can create inbound and outbound access rules allowing communication outside the secure perimeter.

For example, you can create a network security perimeter and associate a set of PaaS services, like Azure Key Vault and SQL DB, with the perimeter. You can then create inbound and outbound access rules to allow any communication outside the secure perimeter. You can also create multiple profiles under the same perimeter to associate PaaS services with similar set of inbound and outbound access requirements.

## Components of Azure Network Security Perimeter

A network security perimeter includes the following components:

| **Component** |**Description**|
|---------------------|------------------------------------------------------------------------------------------------------------|
| **Network security perimeter** | Top level resource defining logical network boundary to secure PaaS resources. |
| **Access Rule**| Inbound and outbound rules for resources in a perimeter to communicate outside the perimeter. |
| **Profile** | Collection of access rules that apply on resources associated with the profile. |
| **ResourceAssociation** | Perimeter membership for a PaaS resource. |
| **DiagnosticsSettings** | Extension resource hosted by Microsoft. Insights to collect logs & metrics for all resources in the perimeter. |

> [!NOTE]
> For organizational and informational safety, Please do not put any personal identifiable or sensitive data in the network security perimeter rules or other network security perimeter configuration.

## Network security perimeter properties

When creating a network security perimeter, you can specify the following properties:

| **Property** | **Description** |
|------------------|-------------|
| **Name** | A unique name within the resource group. |
| **Location** | Supported regions. |
| **Resource group name** | Name of the resource group where the network security perimeter should be present. |

## Access modes in network security perimeter

Administrators add PaaS resources to a perimeter by creating resource associations when creating a network security perimeter. These association offer different access modes for PaaS resources within a perimeter. The access modes are:

| **Mode** | **Description** |
|----------------|--------|
| **Learning mode**  | In *learning* mode, network security perimeter logs all traffic classified as denied by access rules, without actually blocking the traffic. Learning mode allows network administrators to understand the existing access patterns of their PaaS services before implementing enforcement of access rules. |
| **Enforced mode**  | In *enforced* mode, network security perimeter logs and denies all traffic classified as *denied* along with traffic not classified as *allowed* by an access rule. By default, all traffic is denied unless an *Allow* access rule exists. Enforced mode ensures that the resource continues are secured by the perimeter even if its configuration is modified. |

Learn more on transitioning from learning mode to enforced mode in [transitioning to a network security perimeter](network-security-perimeter-transition.md) article.

## Onboarded private-link resources
A private-link resource is the network security perimeter aware PaaS resource that can be associated. Currently, the current list of onboarded private-link resources are as follows:

| Private-link resource name | Resource type | Resources |
|---------------------------|---------------|-----------|
| Azure Monitor             | Microsoft.Insights/dataCollectionEndpoints<br>Microsoft.Insights/ScheduledQueryRules<br>Microsoft.Insights/actionGroups<br>Microsoft.OperationalInsights/workspaces | Log Analytics Workspace, Application Insights, Alerts, Notification Service |
| Azure AI Search          | Microsoft.Search/searchServices | - |
| Cosmos DB                | Microsoft.DocumentDB/databaseAccounts | - |
| Event Hubs                | Microsoft.EventHub/namespaces | - |
| Key Vault                 | Microsoft.KeyVault/vaults | - |
| SQL DB                    | Microsoft.Sql/servers | - |
| Storage                   | Microsoft.Storage/storageAccounts | - |


## Limitations of network security perimeter

### Regional limitations

Network security perimeter is currently available in all public cloud regions. When using network security perimeter to monitor the supported list of private link resources, Azure monitor availability is limited to the following regions:

  - North Central US
  - East US
  - East US 2
  - West US
  - West US 2
  - South central US

> [!NOTE]
> Though the network security perimeter can be created in any region, the Log analytics workspace to be associated with the network security perimeter needs to be located in one of the Azure Monitor supported regions.
> For PaaS resource logs, use **Storage and Event Hub** as the log destination for any region associated to the same perimeter.

[!INCLUDE [network-security-perimeter-limits](../../includes/network-security-perimeter-limits.md)]

> [!NOTE]
> Refer to individual PaaS documentation for respective limitations.

## Next steps

> [!div class="nextstepaction"]
> [Create a network security perimeter in the Azure portal](./network-security-perimeter-collect-resource-logs.md)
