---
title: Configure Cosmos DB settings in Azure API for FHIR
description: This article describes how to configure Cosmos DB settings in Azure API for FHIR
author: matjazl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference 
ms.date: 05/22/2019
ms.author: matjazl
---
# Configure Cosmos DB settings 

Azure API for FHIR uses Cosmos DB as its underlying database to store FHIR data. When you provision new Azure API for FHIR service you have an option to specify number of RU (Requests Units) for Cosmos DB, that the service will use.

To learn more about what Cosmos DB RUs, please read [Request Units in Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/request-units)

To change this setting in the Azure portal, you can navigate to your Azure API for FHIR and open the Cosmos DB blade, then change the throughput to the desired value depending on your performance needs. You can change the value up to a maximum of 10,000 RU/s.* If you need a higher value, contact Azure support.

***Note:** Higher value means higher Cosmos DB throughput and higher cost of the service.

![](media/cosmosdb/cosmosdb-config.png)
