<properties
   pageTitle="Create Logic Apps Deployment Template | Microsoft Azure"
   description="Learn how Logic Apps deployment templates are created and can be used for release management."
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="jeffhollan"
   manager="erikre"
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="05/25/2016"
   ms.author="jehollan"/>
   
# Create Logic Apps Deployment Templates

Once a Logic App has been created, you may wish to create it as an Azure Resource Template so you can easily deploy the Logic App into any environment or resource group you need.  For an introduction to Resource Manager templates be sure to check out the articles on [Authoring Azure Resource Manager template](../resource-group-authoring-templates.md) and [Deploy resources with Azure Resource Manager template](../resource-group-template-deploy.md)

## Logic App Deployment Template Overview

A Logic App is made up of 3 basic components:

* **Logic App Resource** - the resource that contains information on things like pricing plan, location, and the workflow definition.
* **Workflow Definition** - this is what is seen when you select **Code-View** - the definition of the steps of the flow and how the engine should execute.  This is the `definition` property of the Logic App Resource.
* **Connections** - separate resources to securely store metadata around any connector connections like connection strings and access tokens.  These are referenced in a Logic App in the `parameters` of the Logic App Resource.

You can view all of these pieces for existing Logic Apps using tools like the [Azure Resource Explorer](http://resources.azure.com).

In order to make a template for a Logic App that can work with resource group deployments, you need to define the resources and parametrize as needed.  For example, if deploying to a development, test, and production environment you likely want to use different connection strings to a SQL database in each environment, or deploy within different subscriptions or resource groups.  

## Creating a Logic App Deployment Template

There are a few tools to assist you in creating a Logic App Deployment Template.  You could author by hand by taking the resources above and creating parameters as needed.  You can also make use of a [Logic App Template Creator](https://github.com/jeffhollan/LogicAppTemplateCreator) PowerShell module.  The open source module works by evaluating the Logic App and any connections it is using, and generating template resources with the necessary parameters to deploy.  For example, if you had a Logic App that received a message from a Service Bus Queue and added data to a SQL Azure database, the tool would preserve all the orchestration logic and parametrize the SQL and Service Bus connection strings so they could be set at deployment.

>[AZURE.NOTE] Connections must be within the same Resource Group as the Logic App

### Installing the Logic App Template PowerShell Module

The easiest way to install is via the [PowerShell Gallery](https://www.powershellgallery.com/packages/LogicAppTemplate/0.1) with the command `Install-Module -Name LogicAppTemplate`.  

You can also install manually:

1. Download the latest release of the [Logic App Template Creator](https://github.com/jeffhollan/LogicAppTemplateCreator/releases).  
1. Extract the folder into your PowerShell module folder (usually `%UserProfile%\Documents\WindowsPowerShell\Modules`)

In order for the module to work with any tenant and subscription access token, it is recommended you use with the [armclient](https://github.com/projectkudu/ARMClient) command line tool.  Details on `armclient` can be found [here](http://blog.davidebbo.com/2015/01/azure-resource-manager-client.html).

### Generating a Logic App Template through PowerShell

Once installed, you can now generate a template with the following command:

`armclient token $SubscriptionId | Get-LogicAppTemplate -LogicApp MyApp -ResourceGroup MyRG -SubscriptionId $SubscriptionId -Verbose | Out-File C:\template.json`

Where `$SubscriptionId` is the Azure Subscription ID.  This line is first getting an access token via `armclient`, piping it through to the PowerShell script, and then outputting the template into a `.json` file.

## Adding Parameters to a Logic App Template

Once you have a Logic App template, you can continue to add or modify any additional parameters that may be needed.  For example, if your definition includes a resource ID to an Azure Function or Nested Workflow where you plan to deploy in a single deployment, you would want to add additional resources to your template and parametrize IDs as needed.  The same holds true for any references to custom APIs or swagger endpoints you expect to deploy with each resource group.

## Deploying a Logic App Template

Once you have a template, you can deploy using any number of tools including PowerShell, REST API, Visual Studio, Release Management, or the Azure Portal Template Deployment.  Details on deployment can be found [here](../resource-group-template-deploy.md).  It is recommended you also create a [parameter file](../resource-group-template-deploy.md#parameter-file) to store values for the parameter.

### Authorizing OAuth Connections

After deployment, the Logic App will work end-to-end with valid parameters, but OAuth connections will still need to be authorized to generate a valid access token.  You can do this by opening the Logic App in the designer and authorizing connections, or if you wish to automate you can also use a script to consent for each OAuth connection.  An example script can be found on our GitHub under the [Connection Auth](https://github.com/logicappsio/LogicAppConnectionAuth) project.

## Using Visual Studio Release Management

A common scenario to deploy and manage environments is to use a tool like Visual Studio Release Management with a Logic App deployment template.  VSTS includes a [Deploy Azure Resource Group](https://github.com/Microsoft/vsts-tasks/tree/master/Tasks/DeployAzureResourceGroup) task that can be added into any build or release pipeline.  You need to have a [Service Principal](https://blogs.msdn.microsoft.com/visualstudioalm/2015/10/04/automating-azure-resource-group-deployment-using-a-service-principal-in-visual-studio-online-buildrelease-management/) for authorization to deploy, and can then generate the release definition.

1. Under **Release** select to begin a **New Definition** with an **Empty** definition.

    ![][1]   

1. Choose any artifacts you need for this.  This would likely be the Logic App Template generated manually or as part of the build process.
1. Add a **Azure Resource Group Deployment** task.
1. Configure with a [Service Principal](https://blogs.msdn.microsoft.com/visualstudioalm/2015/10/04/automating-azure-resource-group-deployment-using-a-service-principal-in-visual-studio-online-buildrelease-management/), and reference the **Template** and **Template Parameters** files.
1. Continue to build out steps in the release process for any other environments, automated tests, or approvers as needed.
    
<!-- Image References -->
[1]: ./media/app-service-logic-create-deploy-template/emptyReleaseDefinition.PNG