---
title: 'Add cluster principals for Azure Data Explorer by using an Azure Resource Manager template'
description: In this article, you learn how to add cluster principals for Azure Data Explorer by using an Azure Resource Manager template.
author: lucygoldbergmicrosoft
ms.author: lugoldbe
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 02/03/2020
---

# Add cluster principals for Azure Data Explorer by using an Azure Resource Manager template

> [!div class="op_single_selector"]
> * [C#](cluster-principal-csharp.md)
> * [Python](cluster-principal-python.md)
> * [Azure Resource Manager template](cluster-principal-resource-manager.md)

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. In this article, you add cluster principals for Azure Data Explorer by using an Azure Resource Manager template.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* [Create a cluster](create-cluster-database-portal.md).

## Azure Resource Manager template for adding a cluster principal

The following example shows an Azure Resource Manager template for adding a cluster principal.  You can [edit and deploy the template in the Azure portal](/azure/azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal#edit-and-deploy-the-template) by using the form.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
		"clusterPrincipalAssignmentName": {
            "type": "string",
            "defaultValue": "principalAssignment1",
            "metadata": {
                "description": "Specifies the name of the principal assignment"
            }
        },
        "clusterName": {
            "type": "string",
            "defaultValue": "mykustocluster",
            "metadata": {
                "description": "Specifies the name of the cluster"
            }
        },
		"principalIdForCluster": {
            "type": "string",
            "metadata": {
                "description": "Specifies the principal id. It can be user email, application (client) ID, security group name"
            }
        },
		"roleForClusterPrincipal": {
            "type": "string",
			"defaultValue": "AllDatabasesViewer",
            "metadata": {
                "description": "Specifies the cluster principal role. It can be 'AllDatabasesAdmin', 'AllDatabasesViewer'"
            }
        },
		"tenantIdForClusterPrincipal": {
            "type": "string",
            "metadata": {
                "description": "Specifies the tenantId of the principal"
            }
        },
		"principalTypeForCluster": {
            "type": "string",
			"defaultValue": "User",
            "metadata": {
                "description": "Specifies the principal type. It can be 'User', 'App', 'Group'"
            }
        }
    },
    "variables": {
    },
    "resources": [{
            "type": "Microsoft.Kusto/Clusters/principalAssignments",
            "apiVersion": "2019-11-09",
            "name": "[concat(parameters('clusterName'), '/', parameters('clusterPrincipalAssignmentName'))]",
            "properties": {
                "principalId": "[parameters('principalIdForCluster')]",
                "role": "[parameters('roleForClusterPrincipal')]",
				"tenantId": "[parameters('tenantIdForClusterPrincipal')]",
				"principalType": "[parameters('principalTypeForCluster')]"
            }
        }
    ]
}
```

## Next steps

* [Add database principals](database-principal-resource-manager.md)
