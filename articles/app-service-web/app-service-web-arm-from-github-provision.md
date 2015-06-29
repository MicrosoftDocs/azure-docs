<properties 
	pageTitle="Deploy a web app that is linked to a GitHub repository" 
	description="Use an Azure Resource Manager template to deploy a web app that contains a project from a GitHub repository." 
	services="app-service\web" 
	documentationCenter="" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/25/2015" 
	ms.author="tomfitz"/>

# Deploy a web app linked to a GitHub repository

In this topic, you will learn how to create an Azure Resource Manager template that deploys a web app that is linked to a project in a GitHub repository. You will learn how to define which resources are deployed and 
how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements.

For more information about creating templates, see [Authoring Azure Resource Manager Templates](../resource-group-authoring-templates.md).

For the complete template, see [Web App Linked to GitHub template](https://azure.microsoft.com/documentation/templates/201-web-app-github-deploy/).

## What you will deploy

With this template, you will deploy a web app that contains the code from a project in GitHub.

## Parameters

[AZURE.INCLUDE [app-service-web-deploy-web-parameters](../../includes/app-service-web-deploy-web-parameters.md)]
    
## Resources to deploy

[AZURE.INCLUDE [app-service-web-deploy-web-host](../../includes/app-service-web-deploy-web-host.md)]

### Web app

Creates the web app that is linked to the project in GitHub. 

You specify the name of the web app through the **siteName** parameter, and the location of the web app through the **siteLocation** parameter. In the **dependsOn** element, the template defines the web app 
as dependent on the service hosting plan. Because it is dependent on the hosting plan, the web app is not created until the hosting plan has finished being created. The **dependsOn** element is only used to specify deployment 
order. If you do not mark the web app as dependent on the hosting plan, Azure Resource Mananger will attempt to create both resources at the same time and you may receive an error if the web app is created before the hosting 
plan.

The web app also has a child resource which is defined in **resources** section below. This child resource defines source control for the project deployed with the web app. In this template, the source control 
is linked to a particular GitHub repository. The GitHub repository is defined with the code **"RepoUrl":"https://github.com/davidebbo-test/Mvc52Application.git"** You might hard-code the repository URL when you want to create a template that repeatedly deploys a single project while requiring the minimum number of parameters.
Instead of hard-coding the repository URL, you can add a parameter for the repository URL and use that value for the **RepoUrl** property. You can see an example of repository URL parameter in the 
[Web App with Web Jobs template](../app-service-web-deploy-web-app-with-webjobs.md).

    {
      "apiVersion":"2015-04-01",
      "name":"[parameters('siteName')]",
      "type":"Microsoft.Web/sites",
      "location":"[parameters('siteLocation')]",
      "dependsOn":[
         "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]"
      ],
      "properties":{
        "serverFarmId":"[parameters('hostingPlanName')]"
      },
       "resources":[
         {
           "apiVersion":"2015-04-01",
           "name":"web",
           "type":"sourcecontrols",
           "dependsOn":[
             "[resourceId('Microsoft.Web/Sites', parameters('siteName'))]"
           ],
           "properties":{
             "RepoUrl":"https://github.com/davidebbo-test/Mvc52Application.git",
             "branch":"master"
           }
         }
       ]
     }

## Commands to run deployment

[AZURE.INCLUDE [app-service-deploy-commands](../../includes/app-service-deploy-commands.md)]

### PowerShell

    New-AzureResourceGroupDeployment -TemplateUri https://raw.githubusercontent.com/tfitzmac/AppServiceTemplates/master/WebAppLinkedToGithub.json -siteName ExampleSite -hostingPlanName ExamplePlan -siteLocation "West US" -ResourceGroupName ExampleDeployGroup

### Azure CLI

    azure group deployment create --template-uri https://raw.githubusercontent.com/tfitzmac/AppServiceTemplates/master/WebAppLinkedToGithub.json


 
