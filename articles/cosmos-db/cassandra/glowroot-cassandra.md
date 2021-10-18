---
title: Running Glowroot on CosmosDB(preview)
description: This article details how to run Glowroot in Azure Cosmos DB Cassandra API 
author: IriaOsara
ms.author: IriaOsara
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: how-to
ms.date: 10/02/2021
ms.custom: template-how-to 
---

# Running Glowroot with CosmosDB
[!INCLUDE[appliesto-cassandra-api](../includes/appliesto-cassandra-api.md)]

This article explains how to setup Glowroot on Azure Cosmos DB Cassandra API. Glowroot is an APM tool that helps you get to monitor you application performance.

## Prerequisites and Setup

* [Provision an Azure Cosmos DB Cassandra API account](manage-data-java.md#create-a-database-account).
* [Install JAVA (version 8) for Windows (may require creating an oracle account)](https://www.oracle.com/java/technologies/downloads/)
> [!NOTE]
> Note that there are certain known incompatible build targets with newer versions. If you already have a newer version of JAVA, you can still download JDK8 from Oracle's website.
> If you have newer JAVA installed in addition to JDK8: Set the %JAVA_HOME% variable in the local command prompt to target JDK8. This will only change java version for the current session and leave global machine settings intact. 
* [Install maven](https://maven.apache.org/download.cgi)
    * Verify successful installation by running: `mvn --version`


## PRunning Glowroot Test
Open a support ticket if you intend to run Glowroot tests against your Cassandra API account. Providing the subscription ID and account name where your Glowroot test will be running.
> [!NOTE]
> If you run into issues while running the test, running Glowroot test please reach out to us via our support team.

## Running Glowroot Central Collector with CosmosDB endpoint
Once the endpoint configuration has been completed. 
1. [Download Glowroot central collector distribution](https://github.com/glowroot/glowroot/wiki/Central-Collector-Installation#central-collector-installation)
2. [In the glowroot-central.properties file, populate the following properties from your CosmosDB Cassandra endpoint]
    * cassandra.contactPoints
    * cassandra.username
    * cassandra.password
while adding the following properties `cassandra.ssl=true` and `cassandra.port=10350`
3. Ensure that the glowroot-central.properties is in the same folder as the glowroot-central.jar.
4. Run `java -jar glowroot-central.jar` to begin running Glowroot.

## Next steps
- Learn about [supported features](cassandra-support.md) in the Azure Cosmos DB Cassandra API.
