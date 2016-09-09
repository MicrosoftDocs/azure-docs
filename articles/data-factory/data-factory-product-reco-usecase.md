<properties 
	pageTitle="Data Factory Use Case - Product Recommendations" 
	description="Learn about an use case implemented by using Azure Data Factory along with other services." 
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
	ms.date="06/20/2016" 
	ms.author="spelluru"/>

# Use Case - Product Recommendations 

Azure Data Factory is one of many services used to implement the Cortana Intelligence Suite of solution accelerators.  See [Cortana Intelligence Suite](http://www.microsoft.com/cortanaanalytics) page for details about this suite. In this document, we describe a common use case that Azure users have already solved and implemented using Azure Data Factory and other Cortana Intelligence component services.

## Scenario

Online retailers commonly want to entice their customers to purchase products by presenting them with products they are most likely to be interested in, and therefore most likely to buy.  To accomplish this, online retailers need to customize their user’s online experience by using personalized product recommendations for that specific user which take into account their current and historical shopping behavior data, product information, newly introduced brands, and product and customer segmentation data to present the most relevant product for the customer.  Additionally, they can provide the user product recommendations based on analysis of overall usage behavior from all of their users combined.

The goal of these retailers is to optimize for user click-to-sale conversions and earn higher sales revenue.  They achieve this by delivering contextual, behavior-based product recommendations based on customer interests and actions. For this use case, we use online retailers as an example of businesses that want to optimize for their customers, but these principles apply to any business that wants to engage its customers around its goods and services and enhance their customers’ buying experience with personalized product recommendations.

## Challenges

There are many challenges that online retailers face when trying to implement this type of use case. First, data of different sizes and shapes must be ingested from multiple data sources, both on-premises and in the cloud to capture product data, historical customer behavior data, and user data as the user browses the online retail site. 

Second, personalized product recommendations must be reasonably and accurately calculated and predicted. In addition to product, brand, and customer behavior and browser data, online retailers also need to include feedback provided by other customers on past product purchases to factor in the determination of the best product recommendations for a user. 

Third, the recommendations must be immediately deliverable to the user to provide a seamless browsing and purchasing experience, and provide the most recent and relevant recommendations. Finally, retailers need to measure the effectiveness of their approach by tracking overall up-sell and cross-sell click-to-conversion sales successes, and make adjustments to their future recommendations.

## Solution Overview

This example use case has been solved and implemented by real Azure users with Azure Data Factory and other Cortana Intelligence component services, including [HDInsight](https://azure.microsoft.com/services/hdinsight/) and [Power BI](https://powerbi.microsoft.com/) to ingest, prepare, transform, analyze, and publish the final data.

The online retailer uses an Azure Blob store, an on-premises SQL server, Azure SQL DB, and a relational data mart as their data storage options throughout the workflow.  The blob store contains customer information, customer behavior data, and product information data. The product information data includes product brand information and a product catalog stored on-premises in a SQL data warehouse. 

As depicted in the following figure, all of the data is combined and fed into a product recommendation system to deliver personalized recommendations based on customer interests and actions, while the user browses products in the catalog on the retailer website. The customers also sees similar products that might be related to the product they are looking at based on overall website usage patterns that are not related to any one user

![use case diagram](./media/data-factory-product-reco-usecase/diagram-1.png)

Gigabytes of raw web log files are generated daily from the online retailer’s website as semi-structured files. The raw web log files and the customer and product catalog information is ingested on a regular basis into an Azure Blob storage account using Data Factory’s globally deployed data movement as a service. The raw log files for the day are partitioned (by year and month) in blob storage for long term storage.  [Azure HDInsight](https://azure.microsoft.com/services/hdinsight/) (Hadoop as a service) is used to partition the raw log files (for better manageability, availability and performance) in the blob store and process the ingested logs at scale using both Hive and Pig scripts The partitioned web logs data is then processed to extract the needed inputs for a machine learning recommendation system to generate the personalized product recommendations.

The recommendation system used for the machine learning in this example is an open source machine learning recommendation platform from [Apache Mahout](http://mahout.apache.org/).  Note that any [Azure Machine Learning](https://azure.microsoft.com/services/machine-learning/) or custom model can be applied.  The Mahout model is used to predict the similarity between items on the retailer website based on overall usage patterns, and to generate the personalized recommendations based on the individual user.

Finally, the result set of personalized product recommendations is moved to a relational data mart for consumption by the retailer website.  The result set could also be accessed directly from blob storage by another application, or moved to additional stores for other consumers and use cases.

## Benefits

By optimizing their product recommendation strategy and aligning it with business goals, the solution met the online retailer’s merchandising and marketing objectives. Additionally they were able to operationalize and manage the product recommendation workflow in an efficient, reliable, and cost effective manner, making it easy for them to update their model and fine-tune its effectiveness based on the measures of sales click-to-conversion successes. By using Azure Data Factory, they were able to abandon their time consuming and expensive manual cloud resource management and move to on-demand cloud resource management, saving them time, money, and reducing their time to solution deployment. Data lineage views and operational service health became easy to visualize and troubleshoot with the intuitive Data Factory monitoring and management UI available from the Azure Portal. Their solution can now be scheduled and managed so that finished data is reliably produced and delivered to their users, and data and processing dependencies are automatically managed without human intervention.

By providing this personalized shopping experience, the online retailer created a more competitive, engaging customer experience and consequently increase sales and overall customer satisfaction.



  