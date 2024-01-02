---
title: Deploy logic app templates
description: Deploy Azure Resource Manager templates created for Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 09/07/2022
ms.custom: devx-track-azurepowershell, devx-track-azurecli, engagement-fy23, devx-track-arm-template
ms.devlang: azurecli
---

# Deploy Azure Resource Manager templates for Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption](../../includes/logic-apps-sku-consumption.md)]

After you create an Azure Resource Manager template for your Consumption logic app, you can deploy your template in these ways:

* [Azure portal](#portal)
* [Visual Studio](#visual-studio)
* [Azure PowerShell](#powershell)
* [Azure CLI](#cli)
* [Azure Resource Manager REST API](../azure-resource-manager/templates/deploy-rest.md)
* [Azure DevOps](#azure-pipelines)

<a name="portal"></a>

## Deploy through Azure portal

To automatically deploy a logic app template to Azure, you can choose the following **Deploy to Azure** button, which signs you in to the Azure portal and prompts you for information about your logic app. You can then make any necessary changes to the logic app template or parameters.

[![Deploy to Azure](./media/logic-apps-deploy-azure-resource-manager-templates/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.logic%2Flogic-app-create%2Fazuredeploy.json)

For example, you're prompted for the following information after you sign in to the Azure portal:

* Azure subscription name
* Resource group that you want to use
* Logic app location
* The name for your logic app
* A test URI
* Acceptance of the specified terms and conditions

For more information, see these topics:

* [Overview: Automate deployment for logic apps with Azure Resource Manager templates](logic-apps-azure-resource-manager-templates-overview.md)
* [Deploy resources with Azure Resource Manager templates and the Azure portal](../azure-resource-manager/templates/deploy-portal.md)

<a name="visual-studio"></a>

## Deploy with Visual Studio

To deploy a logic app template from an Azure Resource Group project that you created by using Visual Studio, follow these [steps to manually deploy your logic app](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md#deploy-logic-app-to-azure) to Azure.

<a name="powershell"></a>

## Deploy with Azure PowerShell

To deploy to a specific *Azure resource group*, use the following command:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName <Azure-resource-group-name> -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.logic/logic-app-create/azuredeploy.json
```

For more information, see these topics:

* [Deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md)
* [`New-AzResourceGroupDeployment`](/powershell/module/azurerm.resources/new-azurermresourcegroupdeployment)

<a name="cli"></a>

## Deploy with Azure CLI

To deploy to a specific *Azure resource group*, use the following command:

```azurecli
az deployment group create -g <Azure-resource-group-name> --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.logic/logic-app-create/azuredeploy.json
```

For more information, see these topics:

* [Deploy resources with Resource Manager templates and Azure CLI](../azure-resource-manager/templates/deploy-cli.md)
* [`az deployment group create`](/cli/azure/deployment/group#az-deployment-group-create)

<a name="azure-pipelines"></a>

## Deploy with Azure DevOps

To deploy logic app templates and manage environments, teams commonly use a tool such as [Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines) in [Azure DevOps](/azure/devops/user-guide/what-is-azure-devops-services). Azure Pipelines provides an [Azure Resource Group Deployment task](https://github.com/Microsoft/azure-pipelines-tasks/tree/master/Tasks/AzureResourceGroupDeploymentV2) that you can add to any build or release pipeline. For authorization to deploy and generate the release pipeline, you also need a Microsoft Entra [service principal](../active-directory/develop/app-objects-and-service-principals.md). Learn more about [using service principals with Azure Pipelines](/azure/devops/pipelines/library/connect-to-azure).

For more information about continuous integration and continuous deployment (CI/CD) for Azure Resource Manager templates with Azure Pipelines, see these topics and samples:

* [Integrate Resource Manager templates with Azure Pipelines](../azure-resource-manager/templates/add-template-to-azure-pipelines.md)
* [Tutorial: Continuous integration of Azure Resource Manager templates with Azure Pipelines](../azure-resource-manager/templates/deployment-tutorial-pipeline.md)
* [Sample: Orchestrate Azure Pipelines by using Azure Logic Apps](https://github.com/Azure-Samples/azure-logic-apps-pipeline-orchestration)
* [Sample: Connect to Azure Storage accounts from Azure Logic Apps and deploy with Azure Pipelines in Azure DevOps](https://github.com/Azure-Samples/azure-logic-apps-deployment-samples/tree/master/storage-account-connections)
* [Sample: Connect to Azure Service Bus queues from Azure Logic Apps and deploy with Azure Pipelines in Azure DevOps](https://github.com/Azure-Samples/azure-logic-apps-deployment-samples/tree/master/service-bus-connections)
* [Sample: Set up an Azure Functions action for Azure Logic Apps and deploy with Azure Pipelines in Azure DevOps](https://github.com/Azure-Samples/azure-logic-apps-deployment-samples/tree/master/function-app-actions)
* [Sample: Connect to an integration account from Azure Logic Apps and deploy with Azure Pipelines in Azure DevOps](https://github.com/Azure-Samples/azure-logic-apps-deployment-samples/tree/master/integration-account-connections)

Here are the general high-level steps for using Azure Pipelines:

1. In Azure Pipelines, create an empty pipeline.

1. Choose the resources you need for the pipeline, such as your logic app template and template parameters files, which you generate manually or as part of the build process.

1. For your agent job, find and add the **ARM Template deployment** task.

1. Configure with a [service principal](/azure/devops/pipelines/library/connect-to-azure).

1. Add references to your logic app template and template parameters files.

1. Continue to build out steps in the release process for any other environment, automated test, or approvers as needed.

<a name="authorize-oauth-connections"></a>

## Authorize OAuth connections

After deployment, your logic app works end-to-end with valid parameters, but to generate valid access tokens for [authenticating your credentials](../active-directory/develop/authentication-vs-authorization.md), you still have to authorize or use preauthorized OAuth connections. However, you only have to deploy and authenticate API connection resources once, meaning you don't have to include those connection resources in subsequent deployments unless you have to update the connection information. If you use a continuous integration and continuous deployment pipeline, you'd deploy only updated Logic Apps resources and don't have to reauthorize the connections every time.

Here are a few suggestions to handle authorizing connections:

* Manually authorize OAuth connections by opening your logic app in Logic App Designer, either in the Azure portal or in Visual Studio. When you authorize your connection, a confirmation page might appear for you to allow access.

* Preauthorize and share API connection resources across logic apps that are in the same region. API connections exist as Azure resources independently from logic apps. While logic apps have dependencies on API connection resources, API connection resources don't have dependencies on logic apps and remain after you delete the dependent logic apps. Also, logic apps can use API connections that exist in other resource groups. However, the Logic App Designer supports creating API connections only in the same resource group as your logic apps.

  > [!NOTE]
  > If you're considering sharing API connections, make sure that your solution can [handle potential throttling problems](../logic-apps/handle-throttling-problems-429-errors.md#connector-throttling). Throttling happens at the connection level, so reusing the same connection across multiple logic apps might increase the potential for throttling problems.

* Unless your scenario involves services and systems that require multi-factor authentication, you can use a PowerShell script to provide consent for each OAuth connection by running a continuous integration worker as a normal user account on a virtual machine that has active browser sessions with the authorizations and consent already provided. For example, you can repurpose the sample script provided by the [LogicAppConnectionAuth project in the Logic Apps GitHub repo](https://github.com/logicappsio/LogicAppConnectionAuth).

* If you use a Microsoft Entra [service principal](../active-directory/develop/app-objects-and-service-principals.md) instead to authorize connections, learn how to [specify service principal parameters in your logic app template](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md#authenticate-connections).

## Next steps

> [!div class="nextstepaction"]
> [Monitor logic apps](../logic-apps/monitor-logic-apps.md)
