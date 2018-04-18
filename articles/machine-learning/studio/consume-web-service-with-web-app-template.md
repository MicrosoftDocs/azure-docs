---
title: Consume a Machine Learning web service by using a web app template | Microsoft Docs
description: Use a web app template in Azure Marketplace to consume a predictive web service in Azure Machine Learning.
keywords: web service,operationalization,REST API,machine learning
services: machine-learning
documentationcenter: ''
author: garyericson
manager: jhubbard
editor: cgronlun

ms.assetid: e0d71683-61b9-4675-8df5-09ddc2f0d92d
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/20/2017
ms.author: raymondl

---
# Consume an Azure Machine Learning web service by using a web app template

You can develop a predictive model and deploy it as an Azure web service by using:
- Azure Machine Learning Studio.
- Tools such as R or Python. 

After that, you can access the operationalized model by using a REST API.

There are a number of ways to consume the REST API and access the web service. For example, you can write an application in C#, R, or Python by using the sample code generated for you when you deployed the web service. (The sample code is available in the [Machine Learning Web Services portal](https://services.azureml.net/quickstart) or in the web service dashboard in Machine Learning Studio.) Or you can use the sample Microsoft Excel workbook created for you at the same time.

But the quickest and easiest way to access your web service is through the web app templates available in the [Azure Marketplace](https://azure.microsoft.com/marketplace/web-applications/all/).

[!INCLUDE [machine-learning-free-trial](../../../includes/machine-learning-free-trial.md)]

## Azure Machine Learning web app templates
The web app templates available in the Azure Marketplace can build a custom web app that knows your web service's input data and expected results. All you need to do is give the web app access to your web service and data, and the template does the rest.

Two templates are available:

* [Azure ML Request-Response Service Web App Template](https://azure.microsoft.com/marketplace/partners/microsoft/azuremlaspnettemplateforrrs/)
* [Azure ML Batch Execution Service Web App Template](https://azure.microsoft.com/marketplace/partners/microsoft/azuremlbeswebapptemplate/)

Each template creates a sample ASP.NET application by using the API URI and key for your web service. The template then deploys the application as a website to Azure. 

The Request-Response Service (RRS) template creates a web app that you can use to send a single row of data to the web service to get a single result. The Batch Execution Service (BES) template creates a web app that you can use to send many rows of data to get multiple results.

No coding is required to use these templates. You just supply the API key and URI, and the template builds the application for you.

To get the API key and request URI for a web service:

1. In the [Web Services portal](https://services.azureml.net/quickstart), select **Web Services** at the top. Or for a classic web service, select **Classic Web Services**.
2. Select the web service that you want to access.
3. For a classic web service, select the endpoint that you want to access.
4. Select **Consume** at the top.
5. Copy the primary or secondary key and save it.
6. If you're creating an RRS template, copy the **Request-Response** URI and save it. If you're creating a BES template, copy the **Batch Requests** URI and save it.


## How to use the Request-Response Service template
Follow these steps to use the RRS web app template, as shown in the following diagram.

![Process to use RRS web template][image1]


<!--    ![API Key][image3] -->

<!-- This value will look like this:
   
        https://ussouthcentral.services.azureml.net/workspaces/<workspace-id>/services/<service-id>/execute?api-version=2.0&details=true
   
    ![Request URI][image4] -->

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **New**, search for and select **Azure ML Request-Response Service Web App**, and then select **Create**. 
3. In the **Create** pane:
   
   * Give your web app a unique name. The URL of the web app will be this name followed by **.azurewebsites.net**. An example is **http://carprediction.azurewebsites.net**.
   * Select the Azure subscription and services under which your web service is running.
   * Select **Create**.
     
   ![Create web app][image5]

4. When Azure has finished deploying the web app, select the **URL** on the web app settings page in Azure, or enter the URL in a web browser. For example, enter **http://carprediction.azurewebsites.net**.
5. When the web app first runs, it asks you for the **API Post URL** and **API Key**. Enter the values that you saved earlier (request URI and API key, respectively). Select **Submit**.
     
   ![Enter post URI and API key][image6]

6. The web app displays its **Web App Configuration** page with the current web service settings. Here you can make changes to the settings that the web app uses.
   
   > [!NOTE]
   > Changing the settings here only changes them for this web app. It doesn't change the default settings of your web service. For example, if you change the text in **Description** here, it doesn't change the description shown on the web service dashboard in Machine Learning Studio.
   > 
   > 
   
    When you're done, select **Save changes**, and then select **Go to Home Page**.

7. From the home page, you can enter values to send to your web service. Select **Submit** when you're done, and the result will be returned.

If you want to return to the **Configuration** page, go to the **setting.aspx** page of the web app. For example, go to **http://carprediction.azurewebsites.net/setting.aspx**. You're prompted to enter the API key again. You need that to access the page and update the settings.

You can stop, restart, or delete the web app in the Azure portal like any other web app. As long as it's running, you can browse to the home web address and enter new values.

## How to use the Batch Execution Service template
You can use the BES web app template in the same way as the RRS template. The difference is that you can use the created web app to submit multiple rows of data and receive multiple results.

The input values for a batch execution web service can come from Azure Storage or a local file. The results are stored in an Azure storage container. So, you need an Azure storage container to hold the results that the web app returns. You also need to get your input data ready.

![Process to use BES web template][image2]

1. Follow the same procedure to create the BES web app as for the RRS template. But in this case, go to [Azure ML Batch Execution Service Web App Template](https://azure.microsoft.com/marketplace/partners/microsoft/azuremlbeswebapptemplate/) to open the BES template in the Azure Marketplace. Select **Create Web App**.

2. To specify where you want the results stored, enter the destination container information on the web app's home page. Also specify where the web app can get the input values: either in a local file or in an Azure storage container.
   Select **Submit**.
   
   ![Storage information][image7]

The web app displays a page with job status. When the job is completed, you get the location of the results in Azure Blob storage. You also have the option of downloading the results to a local file.

## For more information
To learn more about:

* Creating a machine learning experiment with Machine Learning Studio, see [Create your first experiment in Azure Machine Learning Studio](create-experiment.md).
* How to deploy your machine learning experiment as a web service, see [Deploy an Azure Machine Learning web service](publish-a-machine-learning-web-service.md).
* Other ways to access your web service, see [How to consume an Azure Machine Learning web service](consume-web-services.md).

[image1]: media/consume-web-service-with-web-app-template/rrs-web-template-flow.png
[image2]: media/consume-web-service-with-web-app-template/bes-web-template-flow.png
[image3]: media/consume-web-service-with-web-app-template/api-key.png
[image4]: media/consume-web-service-with-web-app-template/post-uri.png
[image5]: media/consume-web-service-with-web-app-template/create-web-app.png
[image6]: media/consume-web-service-with-web-app-template/web-service-info.png
[image7]: media/consume-web-service-with-web-app-template/storage.png
