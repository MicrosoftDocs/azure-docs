---
title: Deployment and consumption
titleSuffix: ML Studio (classic) - Azure
description: You can use Azure Machine Learning Studio (classic) to deploy machine learning workflows and models as web services. These web services can then be used to call the machine learning models from applications over the internet to do predictions in real time or in batch mode. 
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: how-to

author: likebupt
ms.author: keli19
ms.custom: seodec18
ms.date: 04/19/2017
---
# Azure Machine Learning Studio (classic) Web Services: Deployment and consumption

You can use Azure Machine Learning Studio (classic) to deploy machine learning workflows and models as web services. These web services can then be used to call the machine learning models from applications over the Internet to do predictions in real time or in batch mode. Because the web services are RESTful, you can call them from various programming languages and platforms, such as .NET and Java, and from applications, such as Excel.

The next sections provide links to walkthroughs, code, and documentation to help get you started.

## Deploy a web service

### With Azure Machine Learning Studio (classic)

The Studio (classic) portal and the Microsoft Azure Machine Learning Web Services portal help you deploy and manage a web service without writing code.

The following links provide general Information about how to deploy a new web service:

* For an overview about how to deploy a new web service that's based on Azure Resource Manager, see [Deploy a new web service](deploy-a-machine-learning-web-service.md).
* For a walkthrough about how to deploy a web service, see [Deploy an Azure Machine Learning web service](deploy-a-machine-learning-web-service.md).
* For a full walkthrough about how to create and deploy a web service, start with [Tutorial 1: Predict credit risk](tutorial-part1-credit-risk.md).
* For specific examples that deploy a web service, see:

  * [Tutorial 3: Deploy credit risk model](tutorial-part3-credit-risk-deploy.md)
  * [How to deploy a web service to multiple regions](deploy-a-machine-learning-web-service.md#multi-region)

### With web services resource provider APIs (Azure Resource Manager APIs)

The Azure Machine Learning Studio (classic) resource provider for web services enables deployment and management of web services by using REST API calls. For more information, see the
[Machine Learning Web Service (REST)](/rest/api/machinelearning/index) reference.

<!-- [Machine Learning Web Service (REST)](https://msdn.microsoft.com/library/azure/mt767538.aspx) reference. -->

### With PowerShell cmdlets

The Azure Machine Learning Studio (classic) resource provider for web services enables deployment and management of web services by using PowerShell cmdlets.

To use the cmdlets, you must first sign in to your Azure account from within the PowerShell environment by using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet. If you are unfamiliar with how to call PowerShell commands that are based on Resource Manager, see [Using Azure PowerShell with Azure Resource Manager](../../azure-resource-manager/management/manage-resources-powershell.md).

To export your predictive experiment, use [this sample code](https://github.com/ritwik20/AzureML-WebServices). After you create the .exe file from the code, you can type:

    C:\<folder>\GetWSD <experiment-url> <workspace-auth-token>

Running the application creates a web service JSON template. To use the template to deploy a web service, you must add the following information:

* Storage account name and key

    You can get the storage account name and key from the [Azure portal](https://portal.azure.com/).
* Commitment plan ID

    You can get the plan ID from the [Azure Machine Learning Web Services](https://services.azureml.net) portal by signing in and clicking a plan name.

Add them to the JSON template as children of the *Properties* node at the same level as the *MachineLearningWorkspace* node.

Here's an example:

    "StorageAccount": {
            "name": "YourStorageAccountName",
            "key": "YourStorageAccountKey"
    },
    "CommitmentPlan": {
        "id": "subscriptions/YouSubscriptionID/resourceGroups/YourResourceGroupID/providers/Microsoft.MachineLearning/commitmentPlans/YourPlanName"
    }

See the following articles and sample code for additional details:

* [Azure Machine Learning Studio (classic) Cmdlets](https://docs.microsoft.com/powershell/module/az.machinelearning) reference on MSDN

## Consume the web services

### From the Azure Machine Learning Web Services UI (Testing)

You can test your web service from the Azure Machine Learning Web Services portal. This includes testing the Request-Response service (RRS) and Batch Execution service (BES) interfaces.

* [Deploy a new web service](deploy-a-machine-learning-web-service.md)
* [Deploy an Azure Machine Learning web service](deploy-a-machine-learning-web-service.md)
* [Tutorial 3: Deploy credit risk model](tutorial-part3-credit-risk-deploy.md)

### From Excel

You can download an Excel template that consumes the web service:

* [Consuming an Azure Machine Learning web service from Excel](consuming-from-excel.md)
* [Excel add-in for Azure Machine Learning Web Services](excel-add-in-for-web-services.md)

### From a REST-based client

Azure Machine Learning Web Services are RESTful APIs. You can consume these APIs from various platforms, such as .NET, Python, R, Java, etc. The **Consume** page for your web service on the [Microsoft Azure Machine Learning Web Services portal](https://services.azureml.net) has sample code that can help you get started. For more information, see [How to consume an Azure Machine Learning Web service](consume-web-services.md).
