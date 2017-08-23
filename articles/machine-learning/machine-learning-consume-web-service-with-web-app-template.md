---
title: Consume a Machine Learning web service with a web app template | Microsoft Docs
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
ms.author: garye;raymondl

---
# Consume an Azure Machine Learning web service with a web app template

Once you've developed your predictive model and deployed it as an Azure web service using Machine Learning Studio, or using tools such as R or Python,
you can access the operationalized model using a REST API.

There are a number of ways to consume the REST API and access the web service. For example, you can write an application in C#, R, or Python using the sample code generated for you when you deployed the web service (available in the [Machine Learning Web Services Portal](https://services.azureml.net/quickstart) or in the web service dashboard in Machine Learning Studio). Or you can use the sample Microsoft Excel workbook created for you at the same time.

But the quickest and easiest way to access your web service is through the Web App Templates available in the [Azure Web App Marketplace](https://azure.microsoft.com/marketplace/web-applications/all/).

[!INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

## The Azure Machine Learning Web App Templates
The web app templates available in the Azure Marketplace can build a custom web app that knows your web service's input data and expected results. All you need to do is give the web app access to your web service and data, and the template does the rest.

Two templates are available:

* [Azure ML Request-Response Service Web App Template](https://azure.microsoft.com/marketplace/partners/microsoft/azuremlaspnettemplateforrrs/)
* [Azure ML Batch Execution Service Web App Template](https://azure.microsoft.com/marketplace/partners/microsoft/azuremlbeswebapptemplate/)

Each template creates a sample ASP.NET application, using the API URI and Key for your web service, and deploys it as a web site to Azure. The Request-Response Service (RRS) template creates a web app that allows you to send a single row of data to the web service to get a single result. The Batch Execution Service (BES) template creates a web app that allows you to send many rows of data to get multiple results.

No coding is required to use these templates. You just supply the API Key and URI, and the template builds the application for you.

To get the API key and Request URI for a web service:

1. In the [Web Services Portal](https://services.azureml.net/quickstart), for a New web service, click **Web Services** at the top. Or for a Classic web service click **Classic Web Services**.
2. Click the web service you want to access.
3. For a Classic web service, click the endpoint you want to access.
4. Click **Consume** at the top.
5. Copy the **Primary** or **Secondary Key** and save it.
6. If you're creating a Request-Response Service (RRS) template, copy the **Request-Response** URI and save it. If you're creating a Batch Execution Service (BES) template, copy the **Batch Requests** URI and save it.


## How to use the Request-Response Service (RRS) template
Follow these steps to use the RRS web app template, as shown in the following diagram.

![Process to use RRS web template][image1]


<!--    ![API Key][image3] -->

<!-- This value will look like this:
   
        https://ussouthcentral.services.azureml.net/workspaces/<workspace-id>/services/<service-id>/execute?api-version=2.0&details=true
   
    ![Request URI][image4] -->

1. Go to the [Azure portal](https://portal.azure.com), **Login**, click **New**, search for and select **Azure ML Request-Response Service Web App**, then click **Create**. 
   
   * Give your web app a unique name. The URL of the web app will be this name followed by `.azurewebsites.net.` For example, `http://carprediction.azurewebsites.net.`
   * Select the Azure subscription and services under which your web service is running.
   * Click **Create**.
     
     ![Create web app][image5]

4. When Azure has finished deploying the web app, click the **URL** on the web app settings page in Azure, or enter the URL in a web browser. For example, `http://carprediction.azurewebsites.net.`
5. When the web app first runs it will ask you for the **API Post URL** and **API Key**.
   Enter the values you saved earlier (**Request URI** and **API Key**, respectively).
     
     Click **Submit**.
     
     ![Enter Post URI and API Key][image6]

6. The web app displays its **Web App Configuration** page with the current web service settings. Here you can make changes to the settings used by the web app.
   
   > [!NOTE]
   > Changing the settings here only changes them for this web app. It doesn't change the default settings of your web service. For example, if you change the **Description** here it doesn't change the description shown on the web service dashboard in Machine Learning Studio.
   > 
   > 
   
    When you're done, click **Save changes**, and then click **Go to Home Page**.

7. From the home page you can enter values to send to your web service. Click **Submit** when you're done, and the result will be returned.

If you want to return to the **Configuration** page, go to the `setting.aspx` page of the web app. For example: `http://carprediction.azurewebsites.net/setting.aspx.` You will be prompted to enter the API key again - you need that to access the page and update the settings.

You can stop, restart, or delete the web app in the Azure portal like any other web app. As long as it is running you can browse to the home web address and enter new values.

## How to use the Batch Execution Service (BES) template
You can use the BES web app template in the same way as the RRS template, except that the web app that's created will allow you to submit multiple rows of data and receive multiple results.

The input values for a batch execution web service can come from Azure storage or a local file; the results are stored in an Azure storage container.
So, you'll need an Azure storage container to hold the results returned by the web app, and you'll need to get your input data ready.

![Process to use BES web template][image2]

1. Follow the same procedure to create the BES web app as for the RRS template, except go to [Azure ML Batch Execution Service Web App Template](https://azure.microsoft.com/marketplace/partners/microsoft/azuremlbeswebapptemplate/) to open the BES template on Azure Marketplace and click **Create Web App**.

2. To specify where you want the results stored, enter the destination container information on the web app home page. Also specify where the web app can get the input values, either in a local file or an Azure storage container.
   Click **Submit**.
   
    ![Storage information][image7]

The web app will display a page with job status.
When the job has completed you'll be given the location of the results in Azure blob storage. You also have the option of downloading the results to a local file.

## For more information
To learn more about...

* creating a machine learning experiment with Machine Learning Studio, see [Create your first experiment in Azure Machine Learning Studio](machine-learning-create-experiment.md)
* how to deploy your machine learning experiment as a web service, see [Deploy an Azure Machine Learning web service](machine-learning-publish-a-machine-learning-web-service.md)
* other ways to access your web service, see [How to consume an Azure Machine Learning Web service](machine-learning-consume-web-services.md)

[image1]: media/machine-learning-consume-web-service-with-web-app-template/rrs-web-template-flow.png
[image2]: media/machine-learning-consume-web-service-with-web-app-template/bes-web-template-flow.png
[image3]: media/machine-learning-consume-web-service-with-web-app-template/api-key.png
[image4]: media/machine-learning-consume-web-service-with-web-app-template/post-uri.png
[image5]: media/machine-learning-consume-web-service-with-web-app-template/create-web-app.png
[image6]: media/machine-learning-consume-web-service-with-web-app-template/web-service-info.png
[image7]: media/machine-learning-consume-web-service-with-web-app-template/storage.png
