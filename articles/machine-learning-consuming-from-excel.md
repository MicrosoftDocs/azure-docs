<properties 
	pageTitle="Consuming an Azure Machine Learning Web Service from Excel | Azure" 
	description="Consume an Azure Machine Learning Web Service from Excel" 
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
	ms.date="02/18/2015" 
	ms.author="luisca"/>


# Consuming an Azure Machine Learning Web Service from Excel #

 Azure Machine Learning Studio makes it easy to consume scoring web services directly from Excel without the need to write any code. 

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)] 

## Steps

1. Publish a web service. [This page](machine-learning-walkthrough-5-publish-web-service.md) explains how to do it. Currently the Excel Workbook feature is only supported for Request/Response services that have a single output (that is, a single scoring label). 
 
2. Once you have a web service, click on the **WEB SERVICES** section on the left of the studio, and then select the web service to consume from Excel. 

3. On the **DASHBOARD** tab for the web service is a row for the **REQUEST/RESPONSE** service. If this service had a single output, you should see the **Download Excel Workbook** link in that row.

	![][1]
 
4. Click on **Download Excel Workbook**, and open it in Excel.

5. A Security Warning appears; click on the **Enable Editing** button.

	![][2]

6. A Security Warning appears. Click on the **Enable Content** button to run macros on your spreadsheet.

	![][3] 
 
7. Once macros are enabled, a table is generated. Columns in blue are required as input into the RRS web service, or **PARAMETERS**. Note the output of the RRS service, **PREDICTED VALUES** in green. When all columns for a given row are filled, the workbook automatically calls the scoring API, and displays the scored results. 

	![][4]

7. To score more than one row, fill the second row with data and the predicted values are produced. You can even paste several rows at once.

8. Now use any of the Excel features (graphs, power map, conditional formatting, etcetera) with the predicted values!    


## Sharing your workbook

In order for the macros to work, your ACCESS KEY needs to be part of the spreadsheet. That means that you should share the workbook only with entities/individuals you trust.

## Automatic updates

An RRS call is made in these two situations:

1. The first time a row has content in all of its **PARAMETERS**
    
2. Any time any of the **PARAMETERS** changes in a row that had all of its **PARAMETERS** entered.

[1]: ./media/machine-learning-consuming-from-excel/excellink.png
[2]: ./media/machine-learning-consuming-from-excel/enableeditting.png
[3]: ./media/machine-learning-consuming-from-excel/enablecontent.png
[4]: ./media/machine-learning-consuming-from-excel/sampletable.png
