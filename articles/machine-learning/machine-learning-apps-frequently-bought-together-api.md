<properties 
	pageTitle="Machine Learning example app: Frequently Bought Together | Microsoft Azure" 
	description="A Machine Learning web service that performs online shopping cart analysis to produce product recommendations of items frequently bought together from historical transactions provided by the user." 
	services="machine-learning" 
	documentationCenter="" 
	authors="CoromT" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/31/2016" 
	ms.author="luisca"/> 

# Machine Learning example app: Frequently Bought Together


## IMPORTANT: THIS SERVICE HAS BEEN DEPRECATED

**The Frequently Bought Together functionality that this service provides has now been integrated into our more broad [Recommendations API] (http://gallery.cortanaintelligence.com/MachineLearningAPI/3574432384684cac9cc766e57729ea4c). We encourage you to use Recommendations instead of this service.**

##Overview

The [Frequently Bought Together web service]( https://datamarket.azure.com/dataset/amla/mba) in Machine Learning performs online shopping cart analysis to produce product recommendations of items frequently bought together from historical transactions. Frequently Bought Together recommendations help shoppers identify products in a catalog that are most relevant when purchasing a specific item. Prominently showing these recommendations has proven effective in improving sales for online retailers. 

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)] 
  
##Get started 

After you have subscribed to the Frequently Bought Together web service, you can use the [Market Basket Analysis Service example web application](https://marketbasket.cloudapp.net/) to easily upload your data into a model and discover frequently bought product sets. To use use the application or API, you first need your API key, which you can get from the [Azure Data Market Account Page](https://datamarket.azure.com/account).

##Consumption of web service 

This service contains APIs to create Frequently Bought Together models, upload historical transactions, and retrieve the best-ranked, frequently bought together product set for a given product. Examples that demonstrate how to use these APIs can be found on the [Azure-MachineLearning-DataScience](https://github.com/Azure/Azure-MachineLearning-DataScience/tree/master/Apps/FrequentlyBoughtTogether) repository on GitHub.

 
