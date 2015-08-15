<properties
	pageTitle="Excel add-in for Machine Learning web services | Microsoft Azure"
	description="How to access Azure Machine Learning web services directly in Excel without writing any code."
	services="machine-learning"
	documentationCenter=""
	authors="garye"
	manager="paulettm"
	editor="cgronlun"
    tags=""/>

<tags
	ms.service="machine-learning"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
	ms.workload="data-services"
	ms.date="08/10/2015"
	ms.author="tedway;garye" />

# Excel Add-in for Azure Machine Learning web services

Excel makes it easy to call web services directly without the need to write any code.

## Steps to Use an Existing Web Service

1. Open the sample Excel file here or from the web services **DASHBOARD** tab.
2. Choose a web service by clicking it - "Titanic Survivor Predictor (Excel Add-in Sample) [Score]" in this example.

    ![Select web service][01]

3. This will take you to the **Predict** section.  Select a cell in Excel and click **Use sample data**. Optionally edit the data in Excel.

	![Predict section][02]

4. Highlight the data and click the input data range icon.
5. Under **Output**, enter the cell number where you want the output to be.
6. Click **Predict**.

## Steps to Add a New Web Service

1. Publish a web service ([this page](https://azure.microsoft.com/en-us/documentation/articles/machine-learning-walkthrough-5-publish-web-service/) explains how to do it) or find an existing web service.
2. Once you have a web service, click the **WEB SERVICES** section in the left pane of Machine Learning Studio, and then select the web service to consume.
3. From the **DASHBOARD** tab for the web service, copy the API key for the web service.
4. In Excel, go to the **Web Services** section (if you are in the **Predict** section, click the back arrow to go to the list of web services).

	![Web Services section][03]

5. Click **Add Web Service**.
6. Paste the key into the text box labeled **API key**.
7. On the **DASHBOARD** tab for the web service, click the **API help page** link.
8. Copy the Request URI under **Request** and paste that into the text box labeled **URL**.
9. Click **Add**.

	![URL and API key][04]

10.	To use the web service, follow the directions above, "Steps to Use an Existing Web Service".

## Sharing Your Workbook

If you save your workbook, then the API keys for the web services you have added will also be saved.  That means you should only share the workbook with individuals you trust.


[01]: ./media/machine-learning-excel-add-in-for-web-services/image1.png
[02]: ./media/machine-learning-excel-add-in-for-web-services/image2.png
[03]: ./media/machine-learning-excel-add-in-for-web-services/image3.png
[04]: ./media/machine-learning-excel-add-in-for-web-services/image4.png
