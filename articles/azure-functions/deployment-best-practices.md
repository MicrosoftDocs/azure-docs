---
title: Best practices for Azure Functions deployments 
description: Learn best practices for deploying required resources for Azure Functions by using Azure Resources Manager templates.
ms.topic: conceptual
ms.date: 10/03/2023
# Customer intent: As a developer, I want to understand how to successfully deploy my function app resources by using Aure Resource Manager templates and related technologies so I can produce stable and repeatable deployments.
---

# Best practices for Azure Functions deployments

This article details some best practices for creating function app and related resources in Azure and deploying function project code. 

## Template-based deployments

Guidance in this section applies when deploying resources to Azure by using Azure Resource Manager templates and Bicep files.   

### dependsOn  

Deployment sequence dependencies can be specified by using the dependsOn property. Dependencies are only allowed for resources that are deployed within the same template. 
For nested deployments, the dependency is created on the deployment resource itself. Dependencies are not needed for existing resources.

The value of a dependency is simply the name of a resource. A full `resourceId` can also be used for the dependency but is only necessary when two or more resources share the same name (which should be avoided).

Conditional resources are automatically removed from the dependency graph when not deployed. Authoring these dependencies can be done as if the resource will always be deployed.  

The following example shows declartion of dependsOn element, and for the full deployment template, see [Function App with Basic Resources](../blob/main/function-app-premium-plan/azuredeploy.json) template:

```json
"dependsOn": [
  "[concat('Microsoft.Web/sites/', parameters('siteName'))]"
],
```  

While you may be inclined to use dependsOn to map relationships between your resources, it's important to understand why you're doing it. For example, to document how resources are interconnected, dependsOn isn't the right approach. You can't query which resources were defined in the dependsOn element after deployment. Setting unnecessary dependencies slows deployment time because Resource Manager can't deploy those resources in parallel.

<br/>

### ZipDeploy Run From Package with ARM template

ZipDeploy is intended for xcopy or ftp style deployment. By default, It unzips the artifacts and lay them out exactly to d:\home\site\wwwroot. You can use any tooling (such as one coming with Windows) to zip your content.

It is recommended to set appSettings `WEBSITE_RUN_FROM_PACKAGE=1`, to allow Zip package deployed with ZipDeploy to mount as read-only virtual filesystem directly without deflating or extracting. The advantage is to allow atomic and reliable deployment (no more files being locked). 

NOTE: ZipDeploy with the appSetting `WEBSITE_RUN_FROM_PACKAGE=1` is not supported for Linux Consumption plan.

The following example shows declartion of ZipDeploy extension in site resources along with the recommended WEBSITE_RUN_FROM_PACKAGE appSetting:

NOTE: Please include rest of the existing app settings in the template to preserve them.

```json
{
  "name": "[parameters('siteName')]",
  "type": "Microsoft.Web/sites",
  "apiVersion": "2021-02-01",
  "location": "[parameters('location')]",
  "properties": {
    "siteConfig": {
      "appSettings": [
        {
          "name": "WEBSITE_RUN_FROM_PACKAGE",
          "value": "1"
        }
      ]
    }
  },
  "resources": [
    {
      "name": "ZipDeploy",
      "type": "Extensions",
      "apiVersion": "2021-02-01",
      "dependsOn": [
        "[concat('Microsoft.Web/sites/', parameters('siteName'))]"
      ],
      "properties": {
        "packageUri": "[parameters('packageUri')]"
      }
    }
  ]
}
```

Since it will mount as read-only, app runtime will not be able to create or modify files under d:\home\site\wwwroot. In addition, Azure Functions Portal will also prevent you from modifying the Function Apps.

#### For Linux Consumption plan:

1. Do not use ZipDeploy extension.
2. Set appSetting `WEBSITE_RUN_FROM_PACKAGE=URL` for deployment using the .zip package url. For example: 

NOTE: Please include rest of the existing app settings in the template to preserve them.

```json
{
  "name": "[parameters('siteName')]",
  "type": "Microsoft.Web/sites",
  "apiVersion": "2021-02-01",
  "location": "[parameters('location')]",
  "properties": {
    "siteConfig": {
      "appSettings": [
        {
          "name": "WEBSITE_RUN_FROM_PACKAGE",
          "value": "[parameters('packageUri')]"
        }
      ]
    }
  }
}
```


### App Settings in ARM template

* It is strictly recommended to include AppSettings as part of Site resource, instead of providing it separately in resources like SiteConfig resource, Sites/Config and Sites/AppSettings resources. When creating the site, add app settings to site config under properties like this `"properties": { "siteConfig": { "appSettings": [ ] } } }` and make the ZipDeploy resource depend on the site. Here is the [sample template](../blob/main/function-app-premium-plan/azuredeploy.json#L135-L198). 

* It is an expected behavior that the ARM template will delete the existing app settings and replace the app settings for a function app based on the app settings present in the ARM template. The API requires the payload to contains all necessary settings which will replace the existing one entirely. There is no partial remove or patch support with existing AppSettings. For instance, if one you want to add a new setting, one needs to get existing set, add to that collection and update as a whole.

To learn more about best practices related to application settings, see <<>>.

### Deployment .zip file requirements

The .zip file that you use for push deployment must contain all of the files needed to run your function.

The code for all the functions in a specific function app is located in a root project folder that contains a host configuration file. The [host.json](https://docs.microsoft.com/en-us/azure/azure-functions/functions-host-json) file contains runtime-specific configurations and is in the root folder of the function app. A bin folder contains packages and other library files that the function app requires. Specific folder structures required by the function app depend on language:

+ [C# compiled (.csproj)](https://docs.microsoft.com/en-us/azure/azure-functions/functions-dotnet-class-library?tabs=v2%2Ccmd#functions-class-library-project)
+ [F# script](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-fsharp#folder-structure)
+ [Java](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-java?tabs=bash%2Cconsumption#folder-structure)
+ [JavaScript](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=v2#folder-structure)
+ [Python](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-python?tabs=azurecli-linux%2Capplication-level#folder-structure)

In version 2.x and higher of the Functions runtime, all functions in the function app must share the same language stack.

A function app includes all of the files and folders in the wwwroot directory. A .zip file deployment includes the contents of the wwwroot directory, but not the directory itself. When deploying a C# class library project, you must include the compiled library files and dependencies in a bin subfolder in your .zip package.

When you are developing on a local computer, you can manually create a .zip file of the function app project folder using built-in .zip compression functionality or third-party tools.

<br/>

### Only when Remote Build is Required

The deployment process assumes that the .zip file that you push contains a ready-to-run app. By default, no customizations are run. 

However, when remote build is needed (for example: to get Linux specific packages in python, node.js), you can configure Azure Functions to perform remote build on the code after zip deployments. These builds behave slightly differently depending on whether your app is running on Windows or Linux.

#### For Windows:

When an app is deployed to Windows, language-specific commands, like dotnet restore (C#) or npm install (JavaScript) are run.

To enable the same build processes that you get with continuous integration, add the following to your application settings:

+ `WEBSITE_RUN_FROM_PACKAGE=0` or Remove WEBSITE_RUN_FROM_PACKAGE app setting
+ `SCM_DO_BUILD_DURING_DEPLOYMENT=true`

#### For Linux:

To enable the same build processes that you get with continuous integration, add the following to your application settings:

+ `WEBSITE_RUN_FROM_PACKAGE=0` or Remove WEBSITE_RUN_FROM_PACKAGE app setting
+ `SCM_DO_BUILD_DURING_DEPLOYMENT=true`

For Functions app on Linux, `ENABLE_ORYX_BUILD=true` is set by default. If this build does not work for you e.g. for dotnet or java app, then set `ENABLE_ORYX_BUILD=false`. 

When apps are built remotely on Linux, they run from package. 

<br/>

### Validate before deployment 

When you manually create your deployment template file, it's important to validate your template before deployment. To learn more, see [Validate your template](./functions-infrastructure-as-code.md#validate-your-template).

## Next steps

