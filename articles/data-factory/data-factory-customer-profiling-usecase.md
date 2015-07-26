<properties 
	pageTitle="Data Factory - Customer Profiling Usecase" 
	description="Learn how Azure Data Factory is used to create a data-driven workflow (pipeline) to profile gaming customers." 
	services="data-factory" 
	documentationCenter="" 
	authors="spelluru" 
	manager="jhubbard" 
	editor="monicar"/>

<tags 
	ms.service="data-factory" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/26/2015" 
	ms.author="spelluru"/>

# Customer Profiling

Contoso is a gaming company that creates games for multiple platforms: game consoles, hand held devices, and personal computers (PCs). These games produce a lot of logs and Contoso’s goal is to collect and analyze these logs to gain insights into customer preferences, demographics, usage behavior etc. to identify up-sell and cross-sell opportunities, develop new compelling features to drive business growth and provide a better experience to customers.

This sample specifically evaluates the effectiveness of a marketing campaign that Contoso has recently launched by collecting sample logs, processing and enriching them with reference data, and transforming the data. It has the following three pipelines:

![Data Factory pipelines](./media/data-factory-customer-profiling-usecase/EndToEndWorkflow.png)

1. The **PartitionGameLogsPipeline** reads the raw game events from blob storage and creates partitions based on year, month, and day.
2. The **EnrichGameLogsPipeline** joins partitioned game events with geo code reference data and enriches the data by mapping IP addresses to the corresponding geo-locations.
3. The **AnalyzeMarketingCampaignPipeline** pipeline leverages the enriched data and processes it with the advertising data to create the final output that contains marketing campaign effectiveness.

In this use case, the Azure Data Factory service is used to copy input data by using the Copy Activity and transform/process data by using the HDInsight Activity (Hive and Pig transformations). 

You can deploy a sample that implements this scenario by following the steps described in the [Samples](data-factory-samples.md) article. 
