<properties 
	pageTitle="Publishing Azure ML Web Services to the Azure Marketplace | Azure" 
	description="Publishing Azure ML Web Services to the Azure Marketplace" 
	services="machine-learning" 
	documentationCenter="" 
	authors="garyericson" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/03/2014" 
	ms.author="garye"/>

# Publishing Azure ML Web Services to the Azure Marketplace 

The Azure Marketplace provides the ability to publish Azure Machine Learning web services as paid or free services for consumption by external customers. This article provides an overview of that process with links to guidelines to get you started. By using this process, you can make your web services available for other developers to consume in their applications.

## Overview of the publishing process 

The following are the steps for publishing an Azure Machine Learning web service to Azure Marketplace:

1.	Create and publish a Machine Learning Request-Response service (RRS).
2.	From the Azure management portal, deploy the service into production.
3.	Use the URL of the published web service to publish to [Azure Marketplace (DataMarket).] (https://datamarket.azure.com/home) 
4.	After it is submitted, your offer is reviewed and needs to be approved before your customers can start purchasing it. The publishing process can take a few business days. 

## Guidelines for publishing to Azure Marketplace

1.	Register as a publisher. 
2.	Provide information on your offering, including a pricing plan. Decide if you will offer a free or paid service.  
3.	To get paid, provide payment information such as your bank and tax information. 

## Machine Learning specific options


1.	When creating a new offer, select **Data Services**, then click **Create a New Data Service**. 
 
	![Azure Marketplace][image1]

	<br />

2. On the **Data Service** tab, click **Web Service** as the **Data Source**.

	![Azure Marketplace][image2]

3.	Get the web service URL and API key from the Azure management portal:
	1.	In a separate browser window or tab, sign in to the ([Azure management portal](https://manage.windowsazure.com)). 
	2.	Select **Machine Learning** in the left menu.
	3.	Click **Web Services**, and then click the web service you are publishing.
	4.	Copy the **API key** to a temporary location (for example, Notepad).
	5.	Click **API Help page** for the Request-Response service type.
	6.	Copy the **OData Endpoint Address** to the temporary location.


3.	In the Marketplace Data Service setup dialog box, paste the OData endpoint address into the **Service URL** text box.

	

4. For **Authentication**, choose **Header** as the **Authentication Scheme**.

	- Enter "Authorization" for the **Header Name**.
	- For the **Header Value**, enter "Bearer" (without the quotation marks), click the **Space** bar, and then paste the API key.
	- Select the **This Service is OData** check box.
	- Click **Test Connection** to test the connection.

	
5.	Under **Categories**:
	- Ensure **Machine Learning** is selected.



[image1]:./media/machine-learning-publish-web-service-to-azure-marketplace/image1.png
[image2]:./media/machine-learning-publish-web-service-to-azure-marketplace/image2.png
