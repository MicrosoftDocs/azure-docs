<properties 
	pageTitle="Provision a web app that uses WebJobs" 
	description="Use an Azure Resource Manager template to deploy a web app with WebJobs." 
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
	ms.date="06/01/2015" 
	ms.author="tomfitz"/>

# Provision a web app that uses WebJobs

In this topic, you will learn how to create an Azure Resource Manager template that deploys a web app that uses WebJobs. You will learn how to define which resources are deployed and 
how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements.

For more information about creating templates, see [Authoring Azure Resource Manager Templates](resource-group-authoring-templates.md).

For the complete template, see [Web App With WebJobs template](https://github.com/tfitzmac/AppServiceTemplates/blob/master/WebAppWithWebJobs.json).

## What you will deploy

In this template, you will deploy:

- a web app that contains the code from a project in GitHub
- a WebJob

## Parameters to specify

[AZURE.INCLUDE [app-service-web-deploy-web-parameters](../includes/app-service-web-deploy-web-parameters.md)]
 
### repoUrl

The URL of the GitHub repository that contains the project to deploy.  
 
    "repoUrl":{
      "type":"string"
    }

### branch

The branch in GitHub for the repository to use during deployment.

    "branch":{
      "type":"string",
      "defaultValue":"master"
    }


### jobCollectionName

The name of the collection of WebJobs.

    "jobCollectionName":{
      "type":"string"
    }



## Resources to deploy

[AZURE.INCLUDE [app-service-web-deploy-web-host](../includes/app-service-web-deploy-web-host.md)]


### Web app

Creates the web app that is linked to the project in GitHub. 

You specify the name of the web app through the **siteName** parameter, and the location of the web app through the **siteLocation** parameter. In the **dependsOn** element, the template defines the web app 
as dependent on the service hosting plan. Because it is dependent on the hosting plan, the web app is not created until the hosting plan has finished being created. The **dependsOn** element is only used to specify deployment 
order. If you do not mark the web app as dependent on the hosting plan, Azure Resource Mananger will attempt to create both resources at the same time and you may receive an error if the web app is created before the hosting 
plan.

The web app also has a child resource which is defined in **resources** section below. This child resource defines source control for the project deployed with the web app. In this template, the source control 
is linked to a GitHub repository and branch specified in the **repoURL** and **branch** parameters.

    {
      "apiVersion":"2014-11-01",
      "name":"[parameters('siteName')]",
      "type":"Microsoft.Web/sites",
      "location":"[parameters('siteLocation')]",
      "dependsOn":[
        "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]"
      ],
      "properties":{
        "serverFarm":"[parameters('hostingPlanName')]"
      },
      "resources":[
        {
          "apiVersion":"2014-04-01",
          "name":"web",
          "type":"sourcecontrols",
          "dependsOn":[
            "[resourceId('Microsoft.Web/Sites', parameters('siteName'))]"
          ],
          "properties":{
            "RepoUrl":"[parameters('repoUrl')]",
            "branch":"[parameters('branch')]",
            "IsManualIntegration":true
          }
        }
      ]
    }

### WebJob collection

Creates the WebJob that is associated with the web app.

You specify the name of the collection in the **jobCollectionName** parameter. The location of the collection is the same as the location used for the web app. The job collection is dependent on the web app.

    {
       "apiVersion":"2014-08-01-preview",
       "name":"[parameters('jobCollectionName')]",
       "type":"Microsoft.Scheduler/jobCollections",
       "dependsOn":[
         "[resourceId('Microsoft.Web/Sites', parameters('siteName'))]"
       ],
       "location":"[parameters('siteLocation')]",
       "properties":{
         "sku":{
           "name":"standard"
         },
         "quota":{
           "maxJobCount":"10",
           "maxRecurrence":{
             "Frequency":"minute",
             "interval":"1"
           }
         }
       },
       "resources":[
         {
           "apiVersion":"2014-08-01-preview",
           "name":"DavidJob",
           "type":"jobs",
           "dependsOn":[
             "[resourceId('Microsoft.Scheduler/jobCollections', parameters('jobCollectionName'))]"
           ],
           "properties":{
             "startTime":"2015-02-10T00:08:00Z",
             "action":{
               "request":{
                 "uri":"[concat(list(resourceId('Microsoft.Web/sites/config', parameters('siteName'), 'publishingcredentials'), '2014-06-01').properties.scmUri, '/api/triggeredjobs/MyScheduledWebJob/run')]",
                 "method":"POST"
               },
               "type":"http",
               "retryPolicy":{
                 "retryType":"Fixed",
                 "retryInterval":"PT1M",
                 "retryCount":2
               }
             },
             "state":"enabled",
             "recurrence":{
               "frequency":"minute",
               "interval":1
             }
           }
         }
       ]
    }

## Commands to run deployment

[AZURE.INCLUDE [app-service-deploy-commands](../includes/app-service-deploy-commands.md)]

### PowerShell

    New-AzureResourceGroupDeployment -TemplateUri https://raw.githubusercontent.com/tfitzmac/AppServiceTemplates/master/WebAppWithWebJobs.json -ResourceGroupName ExampleDeployGroup -siteName ExampleSite -hostingPlanName ExamplePlan -siteLocation "West US" -repoUrl https://github.com/user/project -branch master -jobCollectionName ExampleCollection

### Azure CLI

    azure group deployment create --template-uri https://raw.githubusercontent.com/tfitzmac/AppServiceTemplates/master/WebAppWithWebJobs.json


