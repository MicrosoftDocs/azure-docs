---
title: What is Azure Network Security Perimeter?
description: Learn about the components of Azure Network Security Perimeter, a feature that allows Azure PaaS resources to communicate within an explicit trusted boundary.
author: mbender-ms
ms.author: mbender
ms.service: private-link
ms.topic: overview
ms.date: 04/04/2024
ms.custom: references_regions
#CustomerIntent: As a network security administrator, I want to understand how to use Network Security Perimeter to control network access to Azure PaaS resources.
---

# What is Azure Network Security Perimeter?

Azure Network Security Perimeter is a service that provides a secure perimeter for communication of Platform as a Service (PaaS) services deployed outside the virtual network. These PaaS services can communicate with each other within the perimeter, and can also communicate with resources outside the perimeter using public inbound and outbound access rules. Network security perimeter is a feature of Azure Private Link.

Features of network security perimeter include:
- All resources inside perimeter can communicate with any other resource within perimeter.
- External access is available for the following controls:
  - Public inbound access can be approved using Network and Identity attributes of the client such as source IP addresses, subscriptions.
  - Public outbound can be approved using FQDNs (Fully Qualified Domain Names) of the external destinations.
- Diagnostic Logs is enabled for PaaS resources within perimeter for Audit and Compliance.
- Resources in Private Endpoints can additionally accept communication from customer virtual networks, both network security perimeter and Private Endpoints are independent controls.

:::image type="content" source="media/network-security-perimeter-concepts/network-security-perimeter-overview.png" alt-text="Diagram of securing a service with network security perimeter.":::

[!INCLUDE [network-security-perimeter-preview-message](../../includes/network-security-perimeter-preview-message.md)]

## Why use network security perimeter?

Network security perimeter provides a secure perimeter for communication of PaaS services deployed outside the virtual network. It allows you to control network access to Azure PaaS resources. Some of the common use cases include:

- Create a secure boundary between PaaS services.
- Enable **secured by perimeter** under public network access of PaaS service to enable control by network security perimeter.
- Create inbound and outbound access rules to allow any communication outside the secure perimeter.
- Associate the PaaS resources with similar set of inbound and outbound access requirement under different profiles of the same perimeter.
- Prevent data exfiltration by adding PaaS services to the perimeter and creating rules.
- Manage access rules for all their PaaS services under single pane of network security perimeter.

## How does network security perimeter work?

By using network security perimeter, you can create a secure perimeter for communication of PaaS services deployed outside the virtual network. Network security perimeter allows you to control network access to Azure PaaS resources. When you create a network security perimeter, you associate PaaS resources with the perimeter. Then, you can create inbound and outbound access rules allowing communication outside the secure perimeter.

For example, you can create a network security perimeter and associate a set of PaaS services, like Azure Key Vault and SQL DB, with the perimeter. You can then create inbound and outbound access rules to allow any communication outside the secure perimeter. You can also create multiple profiles under the same perimeter to associate PaaS services with similar set of inbound and outbound access requirements.

## Components of network security perimeter

Network security perimeter composed of the following components:

| **Component** |**Description **|
|---------------------|-------------------------------------------------------------------------------------------------------------|
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

Learn more on transitioning from learning mode to enforced mode in [transitioning to a network security perimeter](network-security-perimeter-transitioning.md) article.

## Onboarded private-link resources
A private-link resource is the network security perimeter aware PaaS resource that can be associated. Currently, the current list of onboarded private-link resources are as follows:

| Private-link resource name | Resource type | Resources |
|---------------------------|---------------|-----------|
| Azure Monitor             | Microsoft.Insights/dataCollectionEndpoints<br>Microsoft.Insights/ScheduledQueryRules<br>Microsoft.Insights/actionGroups<br>Microsoft.OperationalInsights/workspaces | Log Analytics Workspace, Application Insights, Alerts, Notification Service |
| Azure AI Search          | Microsoft.Search/searchServices | - |
| Cognitive Services        | Microsoft.CognitiveServices/accounts | Form Recognizer, Anomaly Detector, Immersive Reader, Computer Vision |
| Cosmos DB                 | Microsoft.DocumentDB/databaseAccounts | - |
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

### Scale limitations

Network security perimeter functionality can be used to support deployments of PaaS resources with common public network controls with following scale limitations:

| **Limitation** | **Description** |
|-----------------|-----------------|
| **Number of network security perimeters**  | Supported up to 100 as recommended limit per subscription. |
| **Profiles per network security perimeters** | Supported up to 200 as recommended limit. |
| **Number of rule elements per profile** | Supported up to 200 as hard limit. |
| **Number of resources associated with the same network security perimeter** | Supported up to 1000 as recommended limit. |
| **Resources on different subscriptions associated with same network security perimeter** | Supported up to 1000 as recommended limit. |


### Other limitations

Network security perimeter has other limitations as follows:

| **Limitation/Issue** | **Description** |
|-----------------|-------------|
| **Network security perimeter configuration changes are not re-evaluated on active connections previously approved.** | Existing connections aren't interrupted when you remove a security rule that allowed the connection. </br>Modifying network security perimeter rules only affects new connections. Creating a new rule applies to new connections only.</br> When an existing rule is updated in a network security perimeter, the rules only apply to new connections. Existing connections aren't reevaluated with the new rules. |
| **Network security perimeter restrictions on control plane operations over ARM** | Enforcement is planned with Azure Resource Manager integration with network security perimeter. |
| **Data plane restrictions on resources with deployments inside customers network with VNet Integration** | Enforced by virtual network controls like Network Security Groups, Application Security Groups, User-defined Routes, Azure Firewall, and network virtual appliances. |
| **Network security perimeter resources generating logs will not produce additional logs** | When a resource generates a log for network security perimeter inbound or outbound access, the corresponding access doesn't generate more logging. This is done to avoid duplicate and potentially circular loops of communication. |
| **Resource names cannot be longer than 44 characters to support network security perimeter** | The network security perimeter resource association created from the Azure portal has the format `{resourceName}-{perimeter-guid}`. To align with the requirement name field can't have more than 80 characters, resources names would have to be limited to 44 characters. |
| **Service endpoint traffic is not supported.** | It's recommended to use private endpoints for IaaS to PaaS communication. |

> [!NOTE]
> Refer to individual PaaS documentation for respective limitations.

## Pricing

Network security perimeter is a free offering available to all customers.

## Next steps

> [!div class="nextstepaction"]
> [Create a network security perimeter in the Azure portal](./network-security-perimeter-diagnostic-logs.md).
