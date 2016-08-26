<properties
   pageTitle="Create a logic app deployment template | Microsoft Azure"
   description="Learn how to create a logic app deployment template and use it for release management"
   services="logic-apps"
   documentationCenter=".net,nodejs,java"
   authors="jeffhollan"
   manager="erikre"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="05/25/2016"
   ms.author="jehollan"/>

# Create a logic app deployment template

After a logic app has been created, you might want to create it as an Azure Resource Manager template. This way, you can easily deploy the logic app to any environment or resource group where you might need it. For an introduction to Resource Manager templates, be sure to check out the articles on [authoring Azure Resource Manager templates](../resource-group-authoring-templates.md) and [deploying resources by using Azure Resource Manager templates](../resource-group-template-deploy.md).

## Logic app deployment template

A logic app has three basic components:

* **Logic app resource**. This resource contains information about things like pricing plan, location, and the workflow definition.
* **Workflow definition**. This is what is seen in code view. It includes the definition of the steps of the flow and how the engine should execute. This is the `definition` property of the logic app resource.
* **Connections**. These are separate resources that securely store metadata about any connector connections, such as a connection string and an access token. You reference these in a logic app in the `parameters` section of the logic app resource.

You can view all of these pieces for existing logic apps by using a tool like [Azure Resource Explorer](http://resources.azure.com).

To make a template for a logic app to use with resource group deployments, you need to define the resources and parameterize as needed. For example, if you're deploying to a development, test, and production environment, you'll likely want to use different connection strings to a SQL database in each environment. Or, you might want to deploy within different subscriptions or resource groups.  

## Create a logic app deployment template

A few tools can assist you as you create a logic app deployment template. You can author by hand, that is, by using the resources already discussed here to create parameters as needed. Another option is to use a [logic app template creator](https://github.com/jeffhollan/LogicAppTemplateCreator) PowerShell module. This open-source module first evaluates the logic app and any connections that it is using, and then generates template resources with the necessary parameters for deployment. For example, if you have a logic app that receives a message from an Azure Service Bus queue and adds data to an Azure SQL database, the tool will preserve all of the orchestration logic and parameterize the SQL and Service Bus connection strings so that they can be set at deployment.

>[AZURE.NOTE] Connections must be within the same resource group as the logic app.

### Install the logic app template PowerShell module

The easiest way to install the module is via the [PowerShell Gallery](https://www.powershellgallery.com/packages/LogicAppTemplate/0.1), by using the command `Install-Module -Name LogicAppTemplate`.  

You also can install the PowerShell module manually:

1. Download the latest release of the [logic app template creator](https://github.com/jeffhollan/LogicAppTemplateCreator/releases).  
1. Extract the folder in your PowerShell module folder (usually `%UserProfile%\Documents\WindowsPowerShell\Modules`).

For the module to work with any tenant and subscription access token, we recommend that you use it with the [ARMClient](https://github.com/projectkudu/ARMClient) command line tool.  This [blog post ](http://blog.davidebbo.com/2015/01/azure-resource-manager-client.html) discusses ARMClient in more detail.

### Generate a logic app template by using PowerShell

After PowerShell is installed, you can generate a template by using the following command:

`armclient token $SubscriptionId | Get-LogicAppTemplate -LogicApp MyApp -ResourceGroup MyRG -SubscriptionId $SubscriptionId -Verbose | Out-File C:\template.json`

`$SubscriptionId` is the Azure subscription ID. This line first gets an access token via ARMClient, then pipes it through to the PowerShell script, and then creates the template in a JSON file.

## Add parameters to a logic app template

After you create your logic app template, you can continue to add or modify parameters that you might need. For example, if your definition includes a resource ID to an Azure function or nested workflow that you plan to deploy in a single deployment, you can add more resources to your template and parameterize IDs as needed. The same applies to any references to custom APIs or Swagger endpoints you expect to deploy with each resource group.

## Deploy a logic app template

You can deploy your template by using any number of tools, including PowerShell, REST API, Visual Studio Release Management, and the Azure Portal Template Deployment. See this article about [deploying resources by using Azure Resource Manager templates](../resource-group-template-deploy.md) for additional information. Also, we recommend that you create a [parameter file](../resource-group-template-deploy.md#parameter-file) to store values for the parameter.

### Authorize OAuth connections

After deployment, the logic app works end-to-end with valid parameters. However, OAuth connections still will need to be authorized to generate a valid access token. You can do this by opening the logic app in the designer and then authorizing connections. Or, if you want to automate, you can use a script to consent to each OAuth connection. There's an example script on GitHub under the [LogicAppConnectionAuth](https://github.com/logicappsio/LogicAppConnectionAuth) project.

## Visual Studio Release Management

A common scenario for deploying and managing an environment is to use a tool like Visual Studio Release Management, with a logic app deployment template. Visual Studio Team Services includes a [Deploy Azure Resource Group](https://github.com/Microsoft/vsts-tasks/tree/master/Tasks/DeployAzureResourceGroup) task that you can add to any build or release pipeline. You need to have a [service principal](https://blogs.msdn.microsoft.com/visualstudioalm/2015/10/04/automating-azure-resource-group-deployment-using-a-service-principal-in-visual-studio-online-buildrelease-management/) for authorization to deploy, and then you can generate the release definition.

1. In Release Management, to create a new definition, select **Empty**  to start with an empty definition.

    ![Create a new, empty definition][1]   

1. Choose any resources you need for this. This likely will be the logic app template generated manually or as part of the build process.
1. Add an **Azure Resource Group Deployment** task.
1. Configure with a [service principal](https://blogs.msdn.microsoft.com/visualstudioalm/2015/10/04/automating-azure-resource-group-deployment-using-a-service-principal-in-visual-studio-online-buildrelease-management/), and reference the Template and Template Parameters files.
1. Continue to build out steps in the release process for any other environment, automated test, or approvers as needed.

<!-- Image References -->
[1]: ./media/app-service-logic-create-deploy-template/emptyReleaseDefinition.PNG
