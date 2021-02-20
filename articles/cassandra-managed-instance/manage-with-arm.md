---
title: Create and manage Azure Managed Instance for Apache Cassandra with Resource Manager templates
description: Use Azure Resource Manager templates to create and configure Azure Managed Instance for Apache Cassandra
author: TheovanKraay
ms.service: cassandra-managed-instance
ms.topic: how-to
ms.date: 02/20/2021
ms.author: thvankra
---

# Manage Azure Managed Instance for Apache Cassandra resources with Azure Resource Manager templates

> [!IMPORTANT]
> Azure Managed Instance for Apache Cassandra is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you learn how to use Azure Resource Manager templates to help deploy and manage your Azure Managed Instance for Apache Cassandra clusters.


To create any of the Azure Managed Instance for Apache Cassandra resources below, copy the following example template into a new json file. You can optionally create a parameters json file to use when deploying multiple instances of the same resource with different names and values. There are many ways to deploy Azure Resource Manager templates including, [Azure portal](../azure-resource-manager/templates/deploy-portal.md), [Azure CLI](../azure-resource-manager/templates/deploy-cli.md), [Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md), and [GitHub](../azure-resource-manager/templates/deploy-to-azure-button.md).

<a id="create-autoscale"></a>

## Azure Managed Instance for Apache Cassandra

This template creates an Azure Managed Instance for Apache Cassandra cluster. 

[:::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Deploy to Azure":::](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-cassandra-managed-instance-cluster%2Fazuredeploy.json)

:::code language="json" source="~quickstart-templates/101-cassandra-managed-instance-cluster/azuredeploy.json":::

## Next steps

Here are some more resources:

* [Azure Resource Manager documentation](../azure-resource-manager/index.yml)
* [Troubleshoot common Azure Resource Manager deployment errors](../azure-resource-manager/templates/common-deployment-errors.md)