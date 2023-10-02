---
title: How to organize and inventory servers using hierarchies, tagging, and reporting
description: Learn how to organize and inventory servers using hierarchies, tagging, and reporting.
ms.date: 03/03/2023
ms.topic: conceptual
---

# Organize and inventory servers with hierarchies, tagging, and reporting

Azure Arc-enabled servers allows customers to develop an inventory across hybrid, multicloud, and edge workloads with the organizational and reporting capabilities native to Azure management. Azure Arc-enabled servers supports a breadth of platforms and distributions across Windows and Linux. Arc-enabled servers is also domain agnostic and integrates with Azure Lighthouse for multi-tenant customers.

By projecting resources into the Azure management plane, Azure Arc empowers customers to leverage the organizational, tagging, and querying capabilities native to Azure.

## Organize resources with built-in Azure hierarchies

Azure provides four levels of management scope:

- Management groups
- Subscriptions
- Resource groups
- Resources

These levels of management help to manage access, policies, and compliance more efficiently. For example, if you apply a policy at one level, it propagates down to lower levels, helping improve governance posture. Moreover, these levels can be used to scope policies and security controls. For Arc-enabled servers, the different business units, applications, or workloads can be used to derive the hierarchical structure in Azure. Once resources have been onboarded to Azure Arc, you can seamlessly move an Arc-enabled server between different resource groups and scopes.

:::image type="content" source="media/organize-inventory-servers/management-levels.png" alt-text="Diagram showing the four levels of management scope.":::

## Tagging resources to capture additional, customizable metadata

Tags are metadata elements you apply to your Azure resources. They are key-value pairs that help identify resources, based on settings relevant to your organization. For example, you can tag the environment for a resource as *Production* or *Testing*. Alternatively, you can use tagging to capture the ownership for a resource, separating the *Creator* or *Administrator*. Tags can also capture details on the resource itself, such as the physical datacenter, business unit, or workload. You can apply tags to your Azure resources, resource groups, and subscriptions. This extends to infrastructure outside of Azure as well, through Azure Arc.


You can define tags in Azure portal through a simple point and click method. Tags can be defined when onboarding servers to Azure Arc-enabled servers or on a per-server basis. Alternatively, you can use Azure CLI, Azure PowerShell, ARM templates, or Azure policy for scalable tag deployments. Tags can be used to filter operations as well, such as the deployment of extensions or service attachments. This provides not only a more comprehensive inventory of your servers, but also operational flexibility and ease of management.

:::image type="content" source="media/organize-inventory-servers/server-tags.png" alt-text="Screenshot of Azure portal showing tags applied to a server.":::

## Reporting and querying with Azure Resource Graph (ARG)

Numerous types of data are collected with Azure Arc-enabled servers as part of the instance metadata. This includes the platform, operating system, presence of SQL server, or AWS and GCP details. These attributes can be queried at scale using Azure Resource Graph. 

Azure Resource Graph is an Azure service designed to extend Azure Resource Management by providing efficient and performant resource exploration with the ability to query at scale across a given set of subscriptions so that you can effectively govern your environment. These queries provide the ability to query resources with complex filtering, grouping, and sorting by resource properties.

Results can be easily visualized and exported to other reporting solutions. Moreover there are dozens of built-in Azure Resource Graph queries capturing salient information across Azure VMs and Arc-enabled servers, such as their VM extensions, regional breakdown, and operating systems. 

## Additional resources

* [What is Azure Resource Graph?](../../governance/resource-graph/overview.md)

* [Azure Resource Graph sample queries for Azure Arc-enabled servers](resource-graph-samples.md)

* [Use tags to organize your Azure resources and management hierarchy](../../azure-resource-manager/management/tag-resources.md?tabs=json)