---
title: Quickstart - Create and deploy logic app workflow by using Azure Resource Manager template
description: Quickstart - Create and deploy a logic app workflow by using an Azure Resource Manager template
services: logic-apps
ms.suite: integration
ms.reviewer: jonfan, logicappspm
ms.topic: quickstart
ms.custom: mvc, subject-armqs
ms.date: 06/30/2020

# Customer intent: As a developer, I want to automate creating and deploying a logic app workflow to whichever environment that I want by using Azure Resource Manager templates.

---

# Quickstart: Create and deploy a logic app workflow by using an Azure Resource Manager template


[Azure Logic Apps](../logic-apps/logic-apps-overview.md) is a cloud service that helps you create and run automated workflows that integrate data, apps, cloud-based services, and on-premises systems by selecting from [hundreds of connectors](https://docs.microsoft.com/connectors/connector-reference/connector-reference-logicapps-connectors). This quickstart focuses on the process for deploying an Azure Resource Manager template that creates a basic logic app to check the status for Azure on an hourly schedule.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you start.

## Create a logic app

### Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://azure.microsoft.com/resources/templates/101-logic-app-create/).

* The URL that you want to use for calling a service by using the HTTP action, which is a *built-in* action that is an intrinsic part of the Azure Logic Apps platform.


### Deploy the template

If your environment meets the prerequisites and you're familiar with using Azure Resource Manager templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

1. Select the following image to sign in to Azure and open a template. The template creates a logic app that uses the Recurrence trigger and an HTTP built-in action that calls a service endpoint that you provide.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https://github.com/Azure/azure-quickstart-templates/blob/master/101-logic-app-create/azuredeploy.json)
