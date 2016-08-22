<properties
	pageTitle="Azure Machine Learning Web Services: Deployment and Consumption | Microsoft Azure"
	description="Resources for deploying and consuming web services."
	services="machine-learning"
	documentationCenter=""
	authors="vDonGlover"
	manager="raymondl"
	editor=""/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/19/2016"
	ms.author="v-donglo"/>

# Azure Machine Learning Web Services: Deployment and Consumption

Azure Machine Learning (Azure ML) allows you to deploy machine learning workflows and models as web services. These web services can then be used to call the ML models from applications over the internet to do predictions in real-time or in batch mode. Being RESTFul, the web services can be called from a variety of programming languages and platforms such as .NET, Java, and applications such as Excel.

In the next sections, we will discuss the steps and show links to code and documentation to help get you started.

## Deploy

### Using Azure ML Studio

Machine Learning Studio and the Microsoft Azure Machine Learning Web Services portal allow you to deploy and manage a web service without having to write code.

The following links provide general Information on the process of deploying a new web service:

* [Deploy a new web service](machine-learning-webservice-deploy-a-web-service.md)
* [Deploy an Azure Machine Learning web service](machine-learning-publish-a-machine-learning-web-service.md)

For a full walkthrough of how to create and deploy a web service, see [Walkthrough Step 1: Create a Machine Learning workspace](machine-learning-walkthrough-1-create-ml-workspace.md).

For specific examples of deploying a web service, see:

* [Walkthrough Step 5: Deploy the Azure Machine Learning web service](machine-learning-walkthrough-5-publish-web-service.md)
* [How to deploy a Web Service to multiple regions](machine-learning-how-to-deploy-to-multiple-regions.md)

### Using Web Services Resource Provider APIs (Azure Resource Manager APIs)

The Azure ML Resource Provider for web services enables deployment and management of web services using REST API calls. See the following articles and sample code for additional details.

* [Machine Learning Web Service (REST)](https://msdn.microsoft.com/library/azure/mt767538.aspx) reference on MSDN.


### Using PowerShell Cmdlets

Azure ML Resource Provider for web services enables deployment and management of web services through PowerShell cmdlets.

To use the cmdlets, you must first log in to your Azure account from within the PowerShell environment using the [Add-AzureRmAccount](https://msdn.microsoft.com/library/mt619267.aspx) cmdlet. If you are unfamiliar with calling Resource Manger based PowerShell commands, see [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md#login-to-your-azure-account). 

To export your predictive experiment, use this [sample code](https://github.com/ritwik20/AzureML-WebServices). After creating the exe from the code, you can type:

	C:\<folder>\GetWSD <experiment-url> <workspace-auth-token>

Running the application creates a web service JSON template. To use the template to deploy a web service, you must add the following information:

* Storage account name and key 
	* You can get the storage account name and key from either the new or classic Azure portal.
* Commitment Plan ID 
	* You can get the plan ID from the [Azure Machine Learning Web Services](https://services.azureml.net) portal by logging in and clicking on a plan name.

Add them to the JSON template as children of *Properties* node at the same level as the *MachineLearningWorkspace* node.

See below example:

	"StorageAccount": {
            "name": "YourStorageAccountName",
            "key": "YourStorageAccountKey"
	},
    "CommitmentPlan": {
        "id": "subscriptions/YouSubscriptionID/resourceGroups/YourResourceGroupID/Microsoft.MachineLearning/commitmentPlans/YourPlanName"
    }

See the following articles and sample code for additional details.

* [Azure Machine Learning Cmdlets]( https://msdn.microsoft.com/library/azure/mt767952.aspx) reference on MSDN
* Sample [walkthrough](https://github.com/raymondlaghaeian/azureml-webservices-arm-powershell/blob/master/sample-commands.txt) on GitHub. 

## Consuming the Web Services

### From the Azure ML Web Services UI (Testing)

You can test your web service from the Azure ML web services portal. This includes testing the RRS and BES interfaces.

* [Deploy a new web service](machine-learning-webservice-deploy-a-web-service.md)
* [Deploy an Azure Machine Learning web service](machine-learning-publish-a-machine-learning-web-service.md)
* [Walkthrough Step 5: Deploy the Azure Machine Learning web service](machine-learning-walkthrough-5-publish-web-service.md)

### From Excel

You can download an Excel template that allows you to easily consume the web service:

* [Consuming an Azure Machine Learning Web Service from Excel](machine-learning-consuming-from-excel.md)
* [Excel Add-in for Azure Machine Learning web services](machine-learning-excel-add-in-for-web-services.md)


### Using a REST Based Client

Azure ML web services are RESTful APIs. You can consume these APIs from a variety of applications such as .NET, Python, R, Java, etc. The Consume page for your web service on the [Microsoft Azure Machine Learning Web Services portal](https://services.azureml.net) has sample code available that can help you get started. 

* [How to consume an Azure Machine Learning web service that has been deployed from a Machine Learning experiment](machine-learning-consume-web-services.md)