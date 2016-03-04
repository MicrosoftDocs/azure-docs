<properties
   pageTitle="Azure Resource Explorer"
   description="Describes Azure Resource Explorer and how it can be used to view and update deployments through Azure Resource Manager"
   services="azure-resource-manager"
   documentationCenter="na"
   authors="stuartleeks;tfitzmac"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="01/23/2016"
   ms.author="stuartle;tomfitz"/>

# Azure Resource Explorer
The [Resource Explorer](https://resources.azure.com) is a great tool for looking at resources that you've already created to understand how the resources are structured and what properties they have. The source is available on [github](https://github.com/projectkudu/ARMExplorer), so also provides a reference if you need to implement similar behaviour.

## Getting Started
Navigate to https://resources.azure.com and sign in. Authentication to the Resource Explorer is the same as for the Azure Portal (https://portal.azure.com).

Once loaded, the treeview on the left allows you to drill down into subscriptions and then resource groups:

![treeview](./media/resource-manager-resource-explorer/are-01-treeview.png)

As you drill into a resource group you will see the providers for which there are resources in that group:

![providers](./media/resource-manager-resource-explorer/are-02-treeview-providers.png)

From there you can start drilling into the resource instances. In the screenshot below you can see the `sltest` SQL Server instance in the treeview. On the right hand side, you can see information about the ARM REST API requests that Resource Explorer has made including the URL for the REST API that was used. In the large text area below the URL is the response from the API. As you become familiar with the ARM templates the body content starts to look familiar! 

![sql server](./media/resource-manager-resource-explorer/are-03-sqlserver-with-response.png)

Resource Explorer allows you to keep drilling down to explore child resources, in the case of the SQL Database Server there are child resources for things such as databases and firewall rules.

Exploring a database shows us the properties for that database. In the screenshot below we can see that the database `edition` is `Standard` and the `serviceLevelObjective` (or database tier) is `S1`.

![sql database](./media/resource-manager-resource-explorer/are-04-database-get.png)

## Making changes

Once you have navigated to a resource, clicking on the Edit button makes the JSON content editable. We can then use Resource Explorer to edit the JSON and send a PUT request to change the database tier to `S0`:

![database - PUT request](./media/resource-manager-resource-explorer/are-05-database-put.png)

Once the request has been submitted Resource Explorer re-issues the GET request to refresh the status. In this case we can see that the `requestedServiceObjectiveId` has been updated and is different from the `currentServiceObjectiveId` indicating that a scaling operation is in progress. You can click the GET button to refresh the status manually.

![database - GET request2](./media/resource-manager-resource-explorer/are-06-database-get2.png)

## Invoking the API via PowerShell
The generic PowerShell resource cmdlets (e.g. `Get-AzureRmResource`, `Set-AzureRmResource`) allow you to easily interact with the REST API from PowerShell. The PowerShell tab in Resource Explorer shows you the cmdlets to use to interact with the resource that you are currently exploring:

![PowerShell](./media/resource-manager-resource-explorer/are-07-powershell.png)


## Summary
When working with ARM, the Resource Explorer can be an extremely useful tool. It is a great way to find ways to use PowerShell to query and make changes. If you're working with the REST API it is a great way to get started and quickly test API calls before you start writing code. And if you're writing ARM templates it can be a great way to understand the resource hierarchy and find where to put configuration - you can make a change in the Portal and then find the corresponding entries in Resource Explorer!

For more information, watch the [Channel 9 video with Scott Hanselman and David Ebbo](https://channel9.msdn.com/Shows/Azure-Friday/Azure-Resource-Manager-Explorer-with-David-Ebbo)


