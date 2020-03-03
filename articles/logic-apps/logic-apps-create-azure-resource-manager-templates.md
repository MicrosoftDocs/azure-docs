---
title: Create logic app templates for deployment
description: Learn how to create Azure Resource Manager templates for automating deployment in Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: klam, logicappspm
ms.topic: article
ms.date: 07/26/2019
---

# Create Azure Resource Manager templates to automate deployment for Azure Logic Apps

To help you automate creating and deploying your logic app, this article describes the ways that you can create an [Azure Resource Manager template](../azure-resource-manager/management/overview.md) for your logic app. For an overview about the structure and syntax for a template that includes your workflow definition and other resources necessary for deployment, see [Overview: Automate deployment for logic apps with Azure Resource Manager templates](logic-apps-azure-resource-manager-templates-overview.md).

Azure Logic Apps provides a [prebuilt logic app Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/blob/master/101-logic-app-create/azuredeploy.json) that you can reuse, not only for creating logic apps, but also to define the resources and parameters to use for deployment. You can use this template for your own business scenarios or customize the template to meet your requirements.

> [!IMPORTANT]
> Make sure that connections in your template use the same Azure resource group and location as your logic app.

For more about Azure Resource Manager templates, see these topics:

* [Azure Resource Manager template structure and syntax](../azure-resource-manager/templates/template-syntax.md)
* [Author Azure Resource Manager templates](../azure-resource-manager/templates/template-syntax.md)
* [Develop Azure Resource Manager templates for cloud consistency](../azure-resource-manager/templates/templates-cloud-consistency.md)

<a name="visual-studio"></a>

## Create templates with Visual Studio

For the easiest way to create valid parameterized logic app templates that are mostly ready for deployment, use Visual Studio (free Community edition or greater) and the Azure Logic Apps Tools for Visual Studio. You can then either [create your logic app in Visual Studio](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md) or [find and download an existing logic app from the Azure portal into Visual Studio](../logic-apps/manage-logic-apps-with-visual-studio.md).

By downloading your logic app, you get a template that includes the definitions for your logic app and other resources such as connections. The template also *parameterizes*, or defines parameters for, the values used for deploying your logic app and other resources. You can provide the values for these parameters in a separate parameters file. That way, you can more easily change these values based on your deployment needs. For more information, see these topics:

* [Create logic apps with Visual Studio](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md)
* [Manage logic apps with Visual Studio](../logic-apps/manage-logic-apps-with-visual-studio.md)

<a name="azure-powershell"></a>

## Create templates with Azure PowerShell

You can create Resource Manager templates by using Azure PowerShell with the [LogicAppTemplate module](https://github.com/jeffhollan/LogicAppTemplateCreator). This open-source module first evaluates your logic app and any connections that the logic app uses. The module then generates template resources with the necessary parameters for deployment.

For example, suppose you have a logic app that receives a message from an Azure Service Bus queue and uploads data to an Azure SQL database. The module preserves all the orchestration logic and parameterizes the SQL and Service Bus connection strings so that you can provide and change those values based on your deployment needs.

These samples show how to create and deploy logic apps by using Azure Resource Manager templates, Azure Pipelines in Azure DevOps, and Azure PowerShell:

* [Sample: Connect to Azure Service Bus queues from Azure Logic Apps](https://docs.microsoft.com/samples/azure-samples/azure-logic-apps-deployment-samples/connect-to-azure-service-bus-queues-from-azure-logic-apps-and-deploy-with-azure-devops-pipelines/)
* [Sample: Connect to Azure Storage accounts from Azure Logic Apps](https://docs.microsoft.com/samples/azure-samples/azure-logic-apps-deployment-samples/connect-to-azure-storage-accounts-from-azure-logic-apps-and-deploy-with-azure-devops-pipelines/)
* [Sample: Set up a function app action for Azure Logic Apps](https://docs.microsoft.com/samples/azure-samples/azure-logic-apps-deployment-samples/set-up-an-azure-function-app-action-for-azure-logic-apps-and-deploy-with-azure-devops-pipelines/)
* [Sample: Connect to an integration account from Azure Logic Apps](https://docs.microsoft.com/samples/azure-samples/azure-logic-apps-deployment-samples/connect-to-an-integration-account-from-azure-logic-apps-and-deploy-by-using-azure-devops-pipelines/)

### Install PowerShell modules

1. If you haven't already, install [Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-az-ps).

1. For the easiest way to install the LogicAppTemplate module from the [PowerShell Gallery](https://www.powershellgallery.com/packages/LogicAppTemplate), run this command:

   ```text
   PS> Install-Module -Name LogicAppTemplate
   ```

   To update to the latest version, run this command:

   ```text
   PS> Update-Module -Name LogicAppTemplate
   ```

Or, to install manually, follow the steps in GitHub for [Logic App Template Creator](https://github.com/jeffhollan/LogicAppTemplateCreator).

### Install Azure Resource Manager client

For the LogicAppTemplate module to work with any Azure tenant and subscription access token, install the [Azure Resource Manager client tool](https://github.com/projectkudu/ARMClient), which is a simple command line tool that calls the Azure Resource Manager API.

When you run the `Get-LogicAppTemplate` command with this tool, the command first gets an access token through the ARMClient tool, pipes the token to the PowerShell script, and creates the template as a JSON file. For more information about the tool, see this [article about the Azure Resource Manager client tool](https://blog.davidebbo.com/2015/01/azure-resource-manager-client.html).

### Generate template with PowerShell

To generate your template after installing the LogicAppTemplate module and [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest), run this PowerShell command:

```text
PS> Get-LogicAppTemplate -Token (az account get-access-token | ConvertFrom-Json).accessToken -LogicApp <logic-app-name> -ResourceGroup <Azure-resource-group-name> -SubscriptionId $SubscriptionId -Verbose | Out-File C:\template.json
```

To follow the recommendation for piping in a token from the [Azure Resource Manager client tool](https://github.com/projectkudu/ARMClient), run this command instead where `$SubscriptionId` is your Azure subscription ID:

```text
PS> armclient token $SubscriptionId | Get-LogicAppTemplate -LogicApp <logic-app-name> -ResourceGroup <Azure-resource-group-name> -SubscriptionId $SubscriptionId -Verbose | Out-File C:\template.json
```

After extraction, you can then create a parameters file from your template by running this command:

```text
PS> Get-ParameterTemplate -TemplateFile $filename | Out-File '<parameters-file-name>.json'
```

For extraction with Azure Key Vault references (static only), run this command:

```text
PS> Get-ParameterTemplate -TemplateFile $filename -KeyVault Static | Out-File $fileNameParameter
```

| Parameters | Required | Description |
|------------|----------|-------------|
| TemplateFile | Yes | The file path to your template file |
| KeyVault | No | An enum that describes how to handle possible key vault values. The default is `None`. |
||||

## Next steps

> [!div class="nextstepaction"]
> [Deploy logic app templates](../logic-apps/logic-apps-deploy-azure-resource-manager-templates.md)
