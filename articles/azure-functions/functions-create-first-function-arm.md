---
title: Create your first function using Azure Resource Manager templates
description: Create and deploy to Azure a simple HTTP triggered serverless function by using an Azure Resource Manager template.
ms.date: 3/5/2020
ms.topic: quickstart
ms.service: azure-functions
zone_pivot_groups: programming-languages-set-functions
ms.custom: subject-armqs
---

# Quickstart: Create and deploy Azure Functions resources from a Resource Manager template

In this article, you use an Azure Resource Manager template to create a function that responds to HTTP requests. 
...
Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account. 

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Create a functions project

Resource Manager templates are used to create the Azure resources required to run your function code. The function project code that you publish to Azure is developed locally. There are tools you can use to create a local functions project in [Visual Studio Code](functions-create-first-function-vs-code.md), in [Visual Studio](functions-create-your-first-function-visual-studio.md), or from the [command line](functions-create-first-azure-function-azure-cli.md).  

This article uses the Azure Functions Core Tools to publish an Azure Functions project to your Azure resources. 

## Create a serverless function app in Azure


### Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://github.com/Azure/azure-quickstart-templates/blob/master/101-function-app-create-dynamic).

:::code language="json" source="~/quickstart-templates/101-function-app-create-dynamic/azuredeploy.json" range="000-000" highlight="000-000":::

## Deploy the function project to Azure

## Invoke the function on Azure