<properties title="Publishing Azure ML Web Services to the Azure Marketplace" pageTitle="Publishing Azure ML Web Services to the Azure Marketplace | Azure" description="Publishing Azure ML Web Services to the Azure Marketplace" metaKeywords="" services="machine-learning" solutions="" documentationCenter="" authors="garye" videoId="" scriptId="" />

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

The Azure Marketplace provides the ability to publish Azure ML web services as paid or free services for consumption by external customers. This document provides an overview of that process and links and guidelines to get started. Using this process, you can start making your web services available for other developers to consume in their applications.

## Overview of the publishing process 

The following are the steps in publishing an Azure ML web service to Azure Marketplace:

1.	Create and publish an Azure ML RRS (Request-response service) or BES (Batch-execution service) web service.
2.	From the Azure Management Portal, deploy the service into production.
3.	Use the URL of the published web service to publish to Azure Marketplace.
4.	Publishing process overview: http://msdn.microsoft.com/en-us/library/azure/hh580725.aspx 
5.	Once submitted, your offer is reviewed and needs to be approved before your customers can start purchasing it.

The publishing process can take a few business days. We are working on shortening it as much as possible, and will provide an update in upcoming communications.

## Guidelines for publishing to Azure Marketplace

1.	You will need to register as a publisher. For more details, see: <http://msdn.microsoft.com/en-us/library/azure/hh563872.aspx>
2.	You will need to provide information on your offering including a pricing plan. Decide if you will offer a free or paid service. For more details, see: <http://msdn.microsoft.com/en-us/library/azure/hh563873.aspx> 
3.	To get paid, you will need to provide payment information such as you bank and tax information. For more details, see: <http://msdn.microsoft.com/en-us/library/azure/hh563873.aspx>

## Machine Learning specific options:


1.	When creating a new Offer, select Data Service, then Azure Marketplace 
 
	![Azure Marketplace][image1]

	<br />

2.	To get the Post-consent URL for your Web Service:
  - In Azure ML Studio's left menu, click on Web Services 
  - Click on the Web Service you want to publish in the Marketplace
  - Click on API help page on the Dashboard page
  - Copy the URL of this page from the browser address bar

	<br />

3.	To get your Web Service's URL:
	- In Azure ML Studio's left menu, click on Web Services 
	- Click on the Web Service you want to publish in the Marketplace
	- Click on API help page on the Dashboard page
	- Copy the Post Request URI from the Request section of the page
	- This will show under Data Service Public API URL. 

	<br />

4.	Categories:
	- Ensure Machine Learning is checked.



[image1]:./media/machine-learning-publish-web-service-to-azure-marketplace/image1.png
