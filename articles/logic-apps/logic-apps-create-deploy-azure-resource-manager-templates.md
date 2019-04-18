---
title: Deploy logic apps with Azure Resource Manager templates - Azure Logic Apps
description: Deploy logic apps by using Azure Resource Manager templates
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.topic: article
ms.assetid: 7574cc7c-e5a1-4b7c-97f6-0cffb1a5d536
ms.date: 10/15/2017
---

# Deploy logic apps with Azure Resource Manager templates

After you create an Azure Resource Manager template for deploying your logic app, 
you can deploy your template in these ways:

* [Azure portal](#portal)
* [Azure PowerShell](#powershell)
* [Azure CLI](#cli)
* [Azure Resource Manager REST API](../azure-resource-manager/resource-group-template-deploy-rest.md)
* [Azure DevOps Azure Pipelines](#azure-pipelines)

<a name="portal"></a>

## Deploy through Azure portal

To automatically deploy a logic app template to Azure, 
you can choose the following **Deploy to Azure** button, 
which signs you in to the Azure portal and prompts you for 
information about your logic app. You can then make any 
necessary changes to the logic app template or parameters.

[![Deploy to Azure](./media/logic-apps-create-deploy-azure-resource-manager-templates/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-logic-app-create%2Fazuredeploy.json)

For example, you're prompted for this information 
after you sign in to the Azure portal:

* Azure subscription name
* Resource group that you want to use
* Logic app location
* The name for your logic app
* A test URI
* Acceptance of the specified terms and conditions

For more information, see 
[Deploy resources with Azure Resource Manager templates and the Azure portal](../azure-resource-manager/resource-group-template-deploy-portal.md).

## Authorize OAuth connections

After deployment, the logic app works end-to-end with 
valid parameters. However, you must still authorize 
OAuth connections to generate a valid access token. 
For automated deployments, you can use a script that 
consents to each OAuth connection, such as this 
[example script in the GitHub LogicAppConnectionAuth project](https://github.com/logicappsio/LogicAppConnectionAuth). You can also authorize 
OAuth connections through the Azure portal or in 
Visual Studio by opening your logic app in the 
Logic Apps Designer.

<a name="powershell"></a>

## Deploy with Azure PowerShell

To deploy to a specific *Azure resource group*, use this command:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName <Azure-resource-group-name> -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-logic-app-create/azuredeploy.json 
```

To deploy to a specific Azure subscription, use this command:

```powershell
New-AzDeployment -Location <location> -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-logic-app-create/azuredeploy.json 
```

* [Deploy resources with Resource Manager templates and Azure PowerShell](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-template-deploy)
* [`New-AzResourceGroupDeployment`](/powershell/module/az.resources/new-azresourcegroupdeployment)
* [`New-AzDeployment`](/powershell/module/az.resources/new-azdeployment)

<a name="cli"></a>

## Deploy with Azure CLI

To deploy to a specific *Azure resource group*, use this command:

```azurecli
az group deployment create -g <Azure-resource-group-name> --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-logic-app-create/azuredeploy.json
```

To deploy to a specific Azure subscription, use this command:

```azurecli
az deployment create --location <location> --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-logic-app-create/azuredeploy.json
```

For more information, see these topics: 

* [Deploy resources with Resource Manager templates and Azure CLI](../azure-resource-manager/resource-group-template-deploy-cli.md) 
* [`az group deployment create`](https://docs.microsoft.com/cli/azure/group/deployment?view=azure-cli-latest#az-group-deployment-create)
* [`az deployment create`](https://docs.microsoft.com/cli/azure/deployment?view=azure-cli-latest#az-deployment-create)

<a name="azure-pipelines"></a>

## Deploy with Azure DevOps

To deploy logic app templates and manage environments, teams commonly use a tool such as 
[Azure Pipelines](https://docs.microsoft.com/azure/devops/pipelines/get-started/what-is-azure-pipelines) 
in [Azure DevOps](https://docs.microsoft.com/azure/devops/user-guide/what-is-azure-devops-services). 
Azure Pipelines provides an 
[Azure Resource Group Deployment task](https://github.com/Microsoft/azure-pipelines-tasks/tree/master/Tasks/AzureResourceGroupDeploymentV2) 
that you can add to any build or release pipeline.
For authorization to deploy and generate the release pipeline, 
you also need an Azure Active Directory (AD) 
[service principal](../active-directory/develop/app-objects-and-service-principals.md). 
Learn more about [using service principals with Azure Pipelines](https://docs.microsoft.com/azure/devops/pipelines/library/connect-to-azure). 

Here are general high-level steps for using Azure Pipelines:

1. In Azure Pipelines, create an empty pipeline.

1. Choose the resources you need for the pipeline, 
such as your logic app template and template parameters files, 
which you generate manually or as part of the build process.

1. For your agent job, find and add the **Azure Resource Group Deployment** task.

   ![Add "Azure Resource Group Deployment" task](./media/logic-apps-create-deploy-template/add-azure-resource-group-deployment-task.png)

1. Configure with a [service principal](https://docs.microsoft.com/azure/devops/pipelines/library/connect-to-azure). 

1. Add references to your logic app template and template parameters files.

1. Continue to build out steps in the release process for any other environment, 
automated test, or approvers as needed.

## Get support

For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).

## Next steps

> [!div class="nextstepaction"]
> [Monitor logic apps](../logic-apps/logic-apps-monitor-your-logic-apps.md)
