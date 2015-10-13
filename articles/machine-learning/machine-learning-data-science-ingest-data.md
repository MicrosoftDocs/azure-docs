<properties 
	pageTitle="Ingest data | Microsoft Azure" 
	description="Move Data to and from Azure Blob Storage" 
	services="machine-learning,storage" 
	documentationCenter="" 
	authors="bradsev" 
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="cortana-analytics" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/12/2015" 
	ms.author="bradsev" />

# Ingest data

[AZURE.INCLUDE [cap-ingest-data-selector](../../includes/cap-ingest-data-selector.md)]

## Introduction

The Cortana Analytics Process (CAP) requires that data be  ingested or loaded into a variety of different environments to be processed or analyzed in the most appropriate way in each stage of the process. Technical and business needs, as well as the initial location, format and size of your data will determine the target environments into which the data needs to be ingested to achieve the goals of your analysis. It is not uncommon for a scenario to require data to be moved between several environments to achieve the variety of tasks required to construct a predictive model. This sequence of tasks can include, for example, data exploration, pre-processing, cleaning, down-sampling, and model training.

Data destinations commonly used for processing by CAP include Azure Blob Storage, Azure SQL database, SQL Server on Azure VM, HDInsight, and Azure Machine Learning. The menu above links to topics that describe how to ingest data into each of these types of storage. 