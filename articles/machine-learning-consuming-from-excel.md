<properties 
	pageTitle="Consuming an Azure Machine Learning Web Service from Excel | Azure" 
	description="Consume an Azure Machine Learning Web Service from Excel" 
	services="machine-learning" 
	documentationCenter="" 
	authors="luiscabrer" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/10/2015" 
	ms.author="luiscabrer"/>


# Consuming an Azure Machine Learning Web Service from Excel #

For a web service to be useful, users need to be able to send data to it and receive results. Usually this is done by writing a program that calls the web service directly. That said, Azure Machine Learning Studio makes it easy to consume scoring web services directly from Excel without the need to write any code.

This page describes necessary to consume an Azure Machine Learning Web Service from Excel.

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)] 

##Steps##

1. First of all you need to publish a web service. [This page](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-walkthrough-5-publish-web-service/) explains how to do it. Currently the Excel Workbook feature is only supported for Request/Response services that have a single output (i.e. A single scoring label). 
 
2. Once you have a web service, click on the **WEB SERVICES** section on the left of the studio, and then select the web service you would like to consume from Excel. 

3. On the **DASHBOARD** tab for the web service, you will see a row for the **REQUEST/RESPONSE** service. If this service had a single output, you should see the **Download Excel Workbook** link in that row.

	![][1]
 
4. Click on the **Download Excel Workbook** link. This will download a workbook, and open it in Excel.

5. A Security Warning will appear, click on the **Enable Editing** button.

	![][2]

6. A Security Warning will appear, click on the **Enable Content** button. This will allow macros to run on your spreadsheet.

	![][3] 
 
7. Once macros are enabled, a table will be generated. In blue color you will see columns that are required as input into the RRS web service, or **PARAMETERS**. In green you will see the **PREDICTED VALUES**, or the output of the RRS call. Once all of the columns for a given row are filled, the workbook will automatically call the scoring API, and display the scored results. As easy as that, no need for any coding.

	![][4]

7. Need to score more than one row? Not a problem, simply fill the second row with data and the predicted values will be automatically produced. You can even paste several rows at once.

8. Now you can use any of the many Excel features (graphs, power map, conditional formatting, etc.) with the predicted values!    


###Sharing your workbook###

In order for the macros to work, you ACCESS KEY needs to be part of the spreadsheet. That means that you should only share the workbook with entities/individuals with whom you don't mind sharing your access key.

###Automatic updates###

An RRS call is made in these two situations:

1. The first time a row has content in all of it's **PARAMETERS**
    
2. Any time any of the **PARAMETERS** changes in a row that had all of its **PARAMETERS** entered.

[1]: ./media/machine-learning-consuming-from-excel/excellink.png
[2]: ./media/machine-learning-consuming-from-excel/enableeditting.png
[3]: ./media/machine-learning-consuming-from-excel/enablecontent.png
[4]: ./media/machine-learning-consuming-from-excel/sampletable.png
