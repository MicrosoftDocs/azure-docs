<properties 
	pageTitle="Ingest data | Microsoft Azure" 
	description="Move Data to and from Azure Blob Storage" 
	services="machine-learning,storage" 
	documentationCenter="" 
	authors="bradsev" 
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/12/2015" 
	ms.author="bradsev" />

# Ingest data

## Introduction

The Cortana Analytics Process (CAP) requires that data be  ingested or loaded into a variety of different  storage environments to be processed or analyzed in the most appropriate way in each stage of the process. Data destinations commonly used for processing by CAP include Azure Blob Storage, SQL Azure databases, SQL Server on Azure VM, HDInsight (Hadoop), and Azure Machine Learning. 

This **menu** links to topics that describe how to ingest data into these target environments where the data is stored and processed.

[AZURE.INCLUDE [cap-ingest-data-selector](../../includes/cap-ingest-data-selector.md)]

Technical and business needs, as well as the initial location, format and size of your data will determine the target environments into which the data needs to be ingested to achieve the goals of your analysis. It is not uncommon for a scenario to require data to be moved between several environments to achieve the variety of tasks required to construct a predictive model. This sequence of tasks can include, for example, data exploration, pre-processing, cleaning, down-sampling, and model training.
