<properties
   pageTitle="Common resources in OMS custom solutions | Microsoft Azure"
   description="Many custom solutions in OMS will include one or more views to visualize data.  This article describes how to export a view created by the View Designer and include it in a custom view."
   services="operations-management-suite"
   documentationCenter=""
   authors="bwren"
   manager="jwhit"
   editor="tysonn" />
<tags
   ms.service="operations-management-suite"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/25/2016"
   ms.author="bwren" />

# Views in OMS custom solutions (Preview)

>[AZURE.NOTE]This is preliminary documentation for custom solutions in OMS which are currently in preview. The schema described below is subject to change.    

Many [custom solutions in OMS](operations-management-suite-custom-solutions.md) will include one or more views to visualize data.  This article describes how to export a view created by the [View Designer](../log-analytics/log-analytics-view-designer.md) and include it in a custom view.

>[AZURE.NOTE]The samples in this article use parameters and variables that are either required or common to solutions  and described in [Custom solutions in Operations Management Suite (OMS)](operations-management-suite-custom-solutions.md) 

To include a view in a solution, you create a **resource** for it in the solution file.  The JSON that describes the view's detailed configuration is typically complex and not something that a typical solution author would be able to create manually.  The most common method is to create the view using the [View Designer](../log-analytics/log-analytics-view-designer.md) and, export it, and incorporate it into the solution. 

The basic steps to export a view and include it in a solution are as follows.  Each step is described in further detail in the sections below.

1. Export the view to a file.
2. Modify the parameters of the exported file according to the guidance below.
3. Add the view resource to the solution file.

## Export the file
Follow the instructions at [Log Analytics View Designer](../log-analytics/log-analytics-view-designer.md) to export a view to a file.  The exported file will be in JSON format with the same [elements as the solution file](operations-management-suite-custom-solutions.md#creating-a-new-custom-solution).  

The **parameters** element of the view file will include parameters that are used by the view.  You won't need this section if you perform the modifications to change the parameter names described in the next section.

The **resources** element of the view file will have a resource with a type of **Microsoft.OperationalInsights/workspaces** that represents the OMS workspace.  This element will have a subelement with a type of **views** that represents the view and contains its detailed configuration.  These are the elements that you will modify and then copy into your solution.


## Modify the view file
The exported view file requires similar parameters as the solution file but uses different names for them.  You could add these parameter names to the solution, but they would require duplicate values when the solution was deployed.  For example, solutions have a parameter called **workspaceName** that requires the name of the OMS workspace.  Views have an equivalent parameter called **workspace**.  You could define both parameters, but then both would require the same value when then solution is deployed.  

As a best practice, you should perform a search and replace for the text values in the following table. Replace the text in the **resources** element of the view file with the parameter or function from the solution file. 

| View parameter | Solution |
|:--|:--|
| parameters('location')            | parameters('workspaceregionId')     |
| parameters('resourcegroup')       | resourceGroup().name                |
| parameters('subscriptionId')      | subscription().subscriptionId       |
| parameters('workspace')           | parameters('workspaceName')         |
| parameters('workspaceapiversion') | variables('LogAnalyticsApiVersion') |


For example, following is a view exported from View Designer.  An ellipse is used in place of the details of the view for space reasons.  And you'll typically just copy and paste these details without modifying them anyway.


	{
		"$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
		"contentVersion": "1.0.0.0",
		"parameters": {
			"location": {
				"type": "string",
				"defaultValue": ""
			},
			"resourcegroup": {
				"type": "string",
				"defaultValue": ""
			},
			"subscriptionId": {
				"type": "string",
				"defaultValue": ""
			},
			"workspace": {
				"type": "string",
				"defaultValue": ""
			},
			"workspaceapiversion": {
				"type": "string",
				"defaultValue": ""
			}
		},
		"resources": [
		{
			"apiVersion": "[parameters('workspaceapiversion')]",
			"name": "[parameters('workspace')]",
			"type": "Microsoft.OperationalInsights/workspaces",
			"location": "[parameters('location')]",
			"id": "[Concat('/subscriptions/', parameters('subscriptionId'), '/resourceGroups/', parameters('resourcegroup'), '/providers/Microsoft.OperationalInsights/workspaces/', parameters('workspace'))]",
			"resources": [
				{
					"apiVersion": "2015-11-01-preview",
					"name": "My Custom View",
					"type": "views",
					"location": "[parameters('location')]",
					"id": "[Concat('/subscriptions/', parameters('subscriptionId'), '/resourceGroups/', parameters('resourcegroup'), '/providers/Microsoft.OperationalInsights/workspaces/', parameters('workspace'),'/views/My Custom View')]",
					"dependson": [
						"[Concat('/subscriptions/', parameters('subscriptionId'), '/resourceGroups/', parameters('resourcegroup'), '/providers/Microsoft.OperationalInsights/workspaces/', parameters('workspace'))]"
					],
					"properties": {
                        "Id": "My Custom View",
                        "Name": "My Custom View",
                        "Description": "",
                        "Author": "user@contoso.com",
                        "Source": "Local",
						...
					}
				}
			]
		}
	}

After performing the search and replace described above, the **resources** element of the view file would look like the following. 

	"resources": [
	{
		"apiVersion": "[variables('LogAnalyticsApiVersion')]",
		"name": "[parameters('workspaceName')]",
		"type": "Microsoft.OperationalInsights/workspaces",
		"location": "[parameters('workspaceregionId')]",
		"id": "[Concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]",
		"resources": [
			{
				"apiVersion": "2015-11-01-preview",
				"name": "My Custom View"",
				"type": "views",
				"location": "[parameters('workspaceregionId')]",
				"id": "[Concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'),'/views/My Custom View"')]",
				"dependson": [
					"[Concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
				],
				"properties": {
                    "Id": "My Custom View",
                    "Name": "My Custom View",
                    "Description": "",
                    "Author": "user@contoso.com",
                    "Source": "Local",
					...
				}
			}
		]
	}


## Add the view to the solution
If you make the changes to the view file recommended in the previous section, then you can just copy the contents of the **resources** element in your view file to the **resources** element of your solution file.  It will use parameters and variables already defined in your solution.  If you have multiple views in your solution, then you should only have one **Microsoft.OperationalInsights/workspaces** resource.  Include the **views** resource for each view in the **resources** element of the workspace.

For example, the following sample shows the view above copied into a solution file.  This includes the required **solution** resource.


	{
		"$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
		"contentVersion": "1.0.0.0",
		"parameters": {
			"workspaceName": {
				"type": "string"
			},
			"accountName": {
				"type": "string"
			},
			"workspaceRegionId": {
				"type": "string"
			},
			"regionId": {
				"type": "string"
			},
			"pricingTier": {
				"type": "string"
			}
		},
		"variables": {
			"SolutionVersion": "1.1",
			"SolutionPublisher": "Contoso",
			"SolutionName": "Contoso Solution",
			"LogAnalyticsApiVersion": "2016-01-29",
			"ViewName":  "Contoso View"
		},
		"resources": [
			{
				"name": "[concat(variables('SolutionName'), '(' ,parameters('workspacename'), ')')]",
				"location": "[parameters('workspaceRegionId')]",
				"tags": { },
				"type": "Microsoft.OperationsManagement/solutions",
				"apiVersion": "[variables('LogAnalyticsApiVersion')]",
				"dependsOn": [
					"[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspacename'), '/views/', variables('ViewName'))]"
				],
				"properties": {
					"workspaceResourceId": "[concat(resourceGroup().id, '/providers/Microsoft.OperationalInsights/workspaces/', parameters('workspacename'))]",
					"referencedResources": [
						"[concat(resourceGroup().id, '/providers/Microsoft.OperationalInsights/workspaces/', parameters('workspacename'), '/views/', variables('ViewName'))]"
					],
					"containedResources": [
					]
				},
				"plan": {
					"name": "[concat(variables('SolutionName'), '(' ,parameters('workspaceName'), ')')]",
					"Version": "[variables('SolutionVersion')]",
					"product": "ContosoSolution",
					"publisher": "[variables('SolutionPublisher')]",
					"promotionCode": ""
				}
			},
			{
				"apiVersion": "[variables('LogAnalyticsApiVersion')]",
				"name": "[parameters('workspaceName')]",
				"type": "Microsoft.OperationalInsights/workspaces",
				"location": "[parameters('workspaceregionId')]",
				"id": "[Concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]",
				"resources": [
					{
						"apiVersion": "[variables('LogAnalyticsApiVersion')]",
						"name": "My Custom View",
						"type": "views",
						"location": "[parameters('workspaceregionId')]",
						"id": "[Concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'),'/views/My Custom View')]",
						"dependson": [
							"[Concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
						],
						"properties": {
		                    "Id": "My Custom View",
		                    "Name": "My Custom View",
		                    "Description": "",
		                    "Author": "user@contoso.com",
		                    "Source": "Local",
							...
						}
					}
				]
			}
  		]
	}




## Next steps

- [Test your solution](operations-management-suite-custom-solutions.md#testing-a-custom-solution) to ensure that it is a valid Resource Manager template.
- Include [Automation runbooks in your solution](operations-management-suite-custom-solutions-resources-automation.md).