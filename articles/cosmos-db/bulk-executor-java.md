---
title: Using BulkExecutor Java library to perform bulk operations in Azure Cosmos DB | Microsoft Docs
description: Use Azure Cosmos DB’s BulkExecutor Java library to bulk import and update documents to Azure Cosmos DB collections.
keywords: Java bulk executor
services: cosmos-db
author: tknandu
manager: kfile

ms.service: cosmos-db
ms.workload: data-services
ms.topic: article
ms.date: 05/01/2018
ms.author: ramkris

---

# Use BulkExecutor Java library to perform bulk operations on Azure Cosmos DB data

This tutorial provides instructions on using the Azure Cosmos DB’s bulk executor Java library to import, update and delete Azure Cosmos DB documents. In this tutorial, you build a Java application which generates random documents and they are bulk imported into an Azure Cosmos DB collection. After importing, you will bulk update some properties of a document. 
Prerequisites
•	If you don't have an Azure subscription, create a free account before you begin. 

•	You can Try Azure Cosmos DB for free without an Azure subscription, free of charge and commitments. Or, you can use the Azure Cosmos DB Emulator with  the https://localhost:8081 URI. The Primary Key is provided in Authenticating requests.
•	Java Development Kit (JDK) 1.7+
o	On Ubuntu, run apt-get install default-jdk to install the JDK.
o	Be sure to set the JAVA_HOME environment variable to point to the folder where the JDK is installed.
•	Download and install a Maven binary archive
o	On Ubuntu, you can run apt-get install maven to install Maven.
•	Create an Azure Cosmos DB SQL API account by using the steps described in create database account section of the .NET quickstart article.

