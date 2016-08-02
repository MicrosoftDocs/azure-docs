<properties 
	pageTitle="Publish machine learning web service to Azure Marketplace | Microsoft Azure" 
	description="How to publish your Azure Machine Learning Web Service to the Azure Marketplace" 
	services="machine-learning" 
	documentationCenter="" 
	authors="LuisCabrer" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/31/2016" 
	ms.author="bharaths"/>

# Publish Azure Machine Learning Web Service to the Azure Marketplace 

The Azure Marketplace provides the ability to publish Azure Machine Learning web services as paid or free services for consumption by external customers. This article provides an overview of that process with links to guidelines to get you started. By using this process, you can make your web services available for other developers to consume in their applications.


[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

## Overview of the publishing process 

The following are the steps for publishing an Azure Machine Learning web service to Azure Marketplace:

1. Create and publish a Machine Learning Request-Response service (RRS)
2. Deploy the service to production, and obtain the API Key and OData endpoint information.
3. Use the URL of the published web service to publish to [Azure Marketplace (Data Market)](https://publish.windowsazure.com/workspace/) 
4. Once submitted, your offer is reviewed and needs to be approved before your customers can start purchasing it. The publishing process can take a few business days. 

## Walk through
###Step 1: Create and publish a Machine Learning Request-Response service (RRS)###
 If you have not done this already, please take a look at this [walk through](machine-learning-walkthrough-5-publish-web-service.md).

###Step 2: Deploy the service to production, and obtain the API Key and OData endpoint information###
1. From the [Azure Classic Portal](http://manage.windowsazure.com), select the **MACHINE LEARNING** option from the left navigation bar, and select your workspace. 

2. Click on the **WEB SERVICES** tab, and select the web service you would like to publish to the marketplace.

	![Azure Marketplace][workspace]

3. Select the endpoint you would like to have the marketplace consume. If you have not created any additional endpoints, you can select the **Default** endpoint.

4. Once you have clicked on the endpoint, you will be able to see the **API KEY**. You will need this piece of information later on in Step 3, so make a copy of it.

	![Azure Marketplace][apikey]

5. Click on the **REQUEST/RESPONSE** method, at this point we do not support publishing batch execution services to the marketplace. That will take you to the API help page for the Request/Response method.

6. Copy the **OData Endpoint Address**, you will need this information later on in Step 3.

	![Azure Marketplace][odata]




deploy the service into production.



###Step 3: Use the URL of the published web service to publish to Azure Marketplace (DataMarket)###

1.  Navigate to [Azure Marketplace (Data Market)](http://datamarket.azure.com/home) 
2.  Click on the **Publish** link at the top of the page. This will take you to the [Microsoft Azure Publishing Portal](https://publish.windowsazure.com)
3.  Click on the **publishers** section to register as a publisher.
4.	When creating a new offer, select **Data Services**, then click **Create a New Data Service**. 
 
	![Azure Marketplace][image1]

	<br />


5.	Under **Plans** provide information on your offering, including a pricing plan. Decide if you will offer a free or paid service. To get paid, provide payment information such as your bank and tax information.

6.	Under **Marketing** provide information about your offer, such as the title and description for your offer.

7.	Under **Pricing** you can set the price for your plans for specific countries, or let the system "autoprice" your offer.

8. On the **Data Service** tab, click **Web Service** as the **Data Source**.

	![Azure Marketplace][image2]

9.	Get the web service URL and API key from the Azure Classic Portal, as explained in step 2 above.

10.	In the Marketplace Data Service setup dialog box, paste the OData endpoint address into the **Service URL** text box.

11. For **Authentication**, choose **Header** as the **Authentication Scheme**.

	- Enter "Authorization" for the **Header Name**.
	- For the **Header Value**, enter "Bearer" (without the quotation marks), click the **Space** bar, and then paste the API key.
	- Select the **This Service is OData** check box.
	- Click **Test Connection** to test the connection.

12.	Under **Categories**, ensure **Machine Learning** is selected.

13. When you are done entering all the metadata about your offer, click on **Publish**, and then **Push to Staging**. At this point, you will be notified of any remaining issues that you need to fix.

14. After you have ensured completion of all the outstanding issues, click on **Request approval to push to Production**. The publishing process can take a few business days. 


[image1]:./media/machine-learning-publish-web-service-to-azure-marketplace/image1.png
[image2]:./media/machine-learning-publish-web-service-to-azure-marketplace/image2.png
[workspace]:./media/machine-learning-publish-web-service-to-azure-marketplace/selectworkspace.png
[apikey]:./media/machine-learning-publish-web-service-to-azure-marketplace/apikey.png
[odata]:./media/machine-learning-publish-web-service-to-azure-marketplace/odata.png
 
