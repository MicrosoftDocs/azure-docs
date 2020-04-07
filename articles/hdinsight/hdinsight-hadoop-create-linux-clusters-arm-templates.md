---
title: Create Apache Hadoop clusters using templates - Azure HDInsight
description: Learn how to create clusters for HDInsight by using Resource Manager templates
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 11/18/2019
---

# Create Apache Hadoop clusters in HDInsight by using Resource Manager templates

[!INCLUDE [selector](../../includes/hdinsight-create-linux-cluster-selector.md)]

In this article, you learn several ways to create Azure HDInsight clusters using Azure Resource Manager templates. For more information, see [Deploy an application with Azure Resource Manager template](../azure-resource-manager/templates/deploy-powershell.md). To learn about other cluster creation tools and features, click the tab selector on the top of this page or see [Cluster creation methods](hdinsight-hadoop-provision-linux-clusters.md#cluster-setup-methods).

[!INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

## Prerequisites

* An [Azure subscription](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
* Azure PowerShell and/or Azure CLI.

### Resource Manager templates

A Resource Manager template makes it easy to create the following resources for your application in a single, coordinated operation:
* HDInsight clusters and their dependent resources (such as the default storage account).
* Other resources (such as Azure SQL Database to use [Apache Sqoop](https://sqoop.apache.org/)).

In the template, you define the resources that are needed for the application. You also specify deployment parameters to input values for different environments. The template consists of JSON and expressions that you use to construct values for your deployment.

You can find HDInsight template samples at [Azure quickstart templates](https://azure.microsoft.com/resources/templates/?term=hdinsight). Use cross-platform [Visual Studio Code](https://code.visualstudio.com/#alt-downloads) with the [Resource Manager extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools) or a text editor to save the template into a file on your workstation.

For more information about Resource Manager templates, see the following articles and examples:

* [Author Azure Resource Manager templates](../azure-resource-manager/templates/template-syntax.md)
* [Deploy an application with Azure Resource Manager templates](../azure-resource-manager/templates/deploy-powershell.md)
* [Microsoft.HDInsight/clusters](/azure/templates/microsoft.hdinsight/allversions) template reference
* [Azure quickstart templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Hdinsight&pageNumber=1&sort=Popular)

## Generate templates

Resource Manager enables you to export a Resource Manager template from existing resources in your subscription using different tools. You can use that generated template to learn about the template syntax or to automate the redeployment of your solution as needed. For more information, see [Export templates](../azure-resource-manager/templates/export-template-portal.md).

## Deploy using the portal

You can deploy a Resource Manager template using the Azure portal. For more information, see [Deploy resources from custom template](../azure-resource-manager/templates/deploy-portal.md#deploy-resources-from-custom-template).

## Deploy using PowerShell

You can deploy a Resource Manager template using Azure PowerShell. For more information, see [Deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md) and [Deploy private Resource Manager template with SAS token and Azure PowerShell](../azure-resource-manager/resource-manager-powershell-sas-token.md).

## Deploy using Azure CLI

You can deploy a Resource Manager template using Azure CLI. For more information, see [Deploy resources with Resource Manager templates and Azure CLI](../azure-resource-manager/templates/deploy-cli.md) and [Deploy private Resource Manager template with SAS token and Azure CLI](../azure-resource-manager/resource-manager-cli-sas-token.md).

## Deploy using the REST API

You can deploy a Resource Manager template using REST API. For more information, see [Deploy resources with Resource Manager templates and Resource Manager REST API](../azure-resource-manager/templates/deploy-rest.md).

## Deploy with Visual Studio

 Use Visual Studio to create a resource group project and deploy it to Azure through the user interface. You select the type of resources to include in your project. Those resources are automatically added to the Resource Manager template. The project also provides a PowerShell script to deploy the template.

For an introduction to using Visual Studio with resource groups, see [Creating and deploying Azure resource groups through Visual Studio](../azure-resource-manager/templates/create-visual-studio-deployment-project.md).

## Troubleshoot

If you run into issues with creating HDInsight clusters, see [access control requirements](hdinsight-hadoop-customize-cluster-linux.md#access-control).

## Next steps

In this article, you have learned several ways to create an HDInsight cluster. To learn more, see the following articles:

* For more HDInsight related templates, see [Azure quickstart templates](https://azure.microsoft.com/resources/templates/?term=hdinsight).
* For an example of deploying resources through the .NET client library, see [Deploy resources by using .NET libraries and a template](../virtual-machines/windows/csharp-template.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
* For an in-depth example of deploying an application, see [Provision and deploy microservices predictably in Azure](../app-service/deploy-complex-application-predictably.md).
* For guidance on deploying your solution to different environments, see [Development and test environments in Microsoft Azure](../solution-dev-test-environments.md).
* To learn about the sections of the Azure Resource Manager template, see [Authoring templates](../azure-resource-manager/templates/template-syntax.md).
* For a list of the functions you can use in an Azure Resource Manager template, see [Template functions](../azure-resource-manager/templates/template-functions.md).
