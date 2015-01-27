<properties 
	pageTitle="Publishing Azure ML Web Services to the Azure Marketplace | Azure" 
	description="Publishing Azure ML Web Services to the Azure Marketplace" 
	services="machine-learning" 
	documentationCenter="" 
	authors="Garyericson" 
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

In this document:

- [Introduction]
- [Overview of the publishing process]
- [Guidelines for publishing to Azure Marketplace]
- [Machine Learning specific options] 

<!--Anchors-->
[Introduction]: #introduction
[Overview of the publishing process]: #overview-of-the-publishing-process
[Guidelines for publishing to Azure Marketplace]: #guidelines-for-publishing-to-azure-marketplace
[Machine Learning specific options]: #machine-learning-specific-options 

## Introduction

The Azure Marketplace provides the ability to publish Azure Machine Learning web services as paid or free services for consumption by external customers. This document provides an overview of that process with links to guidelines to get you started. Using this process, you can start making your web services available for other developers to consume in their applications.

## Overview of the publishing process 

The following are the steps in publishing an Azure ML web service to Azure Marketplace:

1.	Create and publish an Azure ML RRS (Request-response service) web service.
2.	From the Azure Management Portal, deploy the service into production.
3.	Use the URL of the published web service to publish to [Azure Marketplace (DataMarket).] (https://datamarket.azure.com/home) 
4.	Once submitted, your offer is reviewed and needs to be approved before your customers can start purchasing it. The publishing process can take a few business days. We are working on shortening it as much as possible, and will provide an update in upcoming communications.

## Guidelines for publishing to Azure Marketplace

1.	You will need to register as a publisher. For more details, see: <http://msdn.microsoft.com/en-us/library/azure/hh563872.aspx>
2.	You will need to provide information on your offering including a pricing plan. Decide if you will offer a free or paid service. For more details, see: <http://msdn.microsoft.com/en-us/library/azure/hh563873.aspx> 
3.	To get paid, you will need to provide payment information such as your bank and tax information. For more details, see: <http://msdn.microsoft.com/en-us/library/azure/hh563873.aspx>

## Machine Learning specific options


1.	When creating a new offer, select **Data Services**, then click **Create a New Data Service**. 
 
	![Azure Marketplace][image1]

	<br />

2. In the **Data Service** tab, click **Web Service** as the Data Source.

	![Azure Marketplace][image2]

3.	Get the Web Service URL and API key from the Azure Management Portal:
	1.	In a separate browser window or tab, log in to the Azure Management Portal ([https://manage.windowsazure.com](https://manage.windowsazure.com)) 
	2.	Select **Machine Learning** in the left menu
	3.	Click **Web Services**, and then click the web service you are publishing
	4.	Copy the **API key** to a temporary location (for example, Notepad)
	5.	Click **API help page** for the Request/Response service type
	6.	Copy the **OData Endpoint Address** to the temporary location

	<br />

3.	In the Marketplace Data Service setup dialog, paste the OData Endpoint Address into **Service URL**.

	<br />

4. For Authentication, choose **Header** as the **Authentication Scheme**.

	- Enter "Authorization" for **Header Name**
	- For **Header Value**, enter "Bearer" (without the quotes), then space, then paste the API Key
	- Check the **This Service is OData** checkbox
	- Click **Test Connection** to test the connection

	<br />

5.	Under Categories:
	- Ensure **Machine Learning** is checked



[image1]:./media/machine-learning-publish-web-service-to-azure-marketplace/image1.png
[image2]:./media/machine-learning-publish-web-service-to-azure-marketplace/image2.png
