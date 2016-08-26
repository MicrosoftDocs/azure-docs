<properties
	pageTitle="Excel add-in for Machine Learning web services | Microsoft Azure"
	description="How to use Azure Machine Learning web services directly in Excel without writing any code."
	services="machine-learning"
	documentationCenter=""
	authors="tedway"
	manager="paulettm"
	editor="cgronlun"
    tags=""/>

<tags
	ms.service="machine-learning"
    ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="data-services"
	ms.date="07/06/2016"
	ms.author="tedway;garye" />

# Excel Add-in for Azure Machine Learning web services

Excel makes it easy to call web services directly without the need to write any code.

## Steps to Use an Existing Web Service in the Workbook

1. Open the [sample Excel file](http://aka.ms/amlexcel-sample-2), which contains the Excel add-in and data about passengers on the Titanic.
2. Choose the web service by clicking it - "Titanic Survivor Predictor (Excel Add-in Sample) [Score]" in this example.

    ![Select web service][01]

3. This will take you to the **Predict** section.  This workbook already contains sample data, but for a blank workbook you can select a cell in Excel and click **Use sample data**.
4. Select the data with headers and click the input data range icon.  Make sure the "My data has headers" box is checked.
5. Under **Output**, enter the cell number where you want the output to be, e.g. "H1" here.
6. Click **Predict**.

	![Predict section][02]

## Steps to Add a New Web Service

Publish a web service ([this page](machine-learning-walkthrough-5-publish-web-service.md) explains how to do it) or use an existing web service.

Get the API key for your web service. Where you do this depends on whether you published a classic web service of a new web service.

**Classic Web Service** 

1. In Machine Learning Studio, click the **WEB SERVICES** section in the left pane, and then select the web service.

	![Studio select web service][04]

2. Copy the API key for the web service.

	![Studio API key][05]

3. On the **DASHBOARD** tab for the web service, click the **REQUEST/RESPONSE** link.
4. Look for the **Request URI** section.  Copy and save the URL.

**New Web Service**

1. In the Azure Machine Learning Web services portal, click **Web Services**, then select your web service. 
2. Click **Consume**.
3. Look for the **Basic consumption info** section.  Copy and save the **Primary Key** and the **Request-Response** URL.


## Steps to Add a New Web Service

1. Publish a web service ([this page](machine-learning-walkthrough-5-publish-web-service.md) explains how to do it) or use an existing web service.
2. In Excel, go to the **Web Services** section (if you are in the **Predict** section, click the back arrow to go to the list of web services).

	![Go to web service selection][03]
3. Click **Add Web Service**.
4. Paste the URL into the Excel add-in text box labeled **URL**.
5. Paste the API/Primary key into the text box labeled **API key**.
6. Click **Add**.

	![URL and API key for a classic web service.][06]

10.	To use the web service, follow the directions above, "Steps to Use an Existing Web Service".

## Sharing Your Workbook

If you save your workbook, then the API/Primary key for the web services you have added is also saved. That means you should only share the workbook with individuals you trust.

Ask any questions below or on our [forum](http://go.microsoft.com/fwlink/?LinkID=403669&clcid=0x409).

[01]: ./media/machine-learning-excel-add-in-for-web-services/image1.png
[02]: ./media/machine-learning-excel-add-in-for-web-services/image2.png
[03]: ./media/machine-learning-excel-add-in-for-web-services/image3.png
[04]: ./media/machine-learning-excel-add-in-for-web-services/image4.png
[05]: ./media/machine-learning-excel-add-in-for-web-services/image5.png
[06]: ./media/machine-learning-excel-add-in-for-web-services/image6.png
