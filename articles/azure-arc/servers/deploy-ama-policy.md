---
title: How to deploy Azure Monitor Agent using Azure Policy
description: Learn how to deploy Azure Monitor Agent using Azure Policy.
ms.date: 04/26/2023
ms.topic: conceptual
---

# Deploy Azure Monitor Agent using Azure Policy

This article covers how to deploy the Azure Monitor Agent to Arc-enabled servers through Azure Policy using an ARM template. Using Azure Policy allows you to ensure that Azure Monitor is running on your selected Arc-enabled servers, as well as automatically install the Azure Monitor Agent on newly added Arc resources. Unlike [other methods for deploying the Azure Monitor agent](concept-log-analytics-extension-deployment.md#installation-options), deployment of Azure Monitor through an ARM templates allows...

Deploying the Azure Monitor Agent through Azure Policy using an ARM template involves two main steps:

- Selecting a Data Collection Rule (DCR)

- Creating and deploying the Policy definition

In this scenario, the Policy definition is used to verify that the AMA is installed on your Arc-enabled servers, and to install it on new servers or on existing servers that are discovered to not have the AMA installed. However, in order for Azure Monitor to work on a machine, it also needs to be associated with a Data Collection Rule. Therefore, you'll need to include the resource ID of the DCR within the Policy definition.


## Selecting a Data Collection Rule

Data Collection Rules (DCRs) define the data collection process in Azure Monitor. DCRs specify what data should be collected, how to transform that data, and where to send that data. You need to select (or create) a DCR and specify it within the ARM template you'll use for deploying AMA.

1. From your browser, go to the [Azure portal](https://portal.azure.com).

1. Navigate to the **Monitor | Overview** page and then, under **Settings**, select **Data Collection Rules**.
    A list of existing DCRs displays. You can filter this at the top of the window. If you need to create a new DCR, see ?? for more information.

1. Select the DCR to apply to your ARM template to view its overview.

1. Select **Resources** to view a list resources (such as Arc-enabled VMs) assigned to the DCR. To add additional resources, select *Add**. (You will need to add resources if you created a new DCR.)

1. Select **Overview**, then select **JSON View** to view the JSON code for the DCR:
    
    :::image type="content" source="media/deploy-ama-policy/dcr-overview.png" alt-text="Overview window for a data collection rule highlighting the JSON view button.":::

1. Locate the **Resource ID** field at the top of the window and click the button to copy the resource ID for the DCR to the clipboard. Save this resource ID; you'll need to use it within the ARM template.
    
    :::image type="content" source="media/deploy-ama-policy/dcr-json-view.png" alt-text="JSON code view for a data collection rule highlight the resource ID copy button.":::


<!--


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