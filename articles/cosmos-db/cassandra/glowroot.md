---
title: Run Glowroot on Azure Cosmos DB for Apache Cassandra(preview)
description: This article details how to run Glowroot in Azure Cosmos DB for Apache Cassandra.
author: IriaOsara
ms.author: IriaOsara
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: how-to
ms.date: 10/02/2021
ms.custom: template-how-to, ignite-2022
---

# Run Glowroot on Azure Cosmos DB for Apache Cassandra
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

Glowroot is an application performance management tool used to optimize and monitor the performance of your applications. This article explains how you can now use Glowroot within Azure Cosmos DB for Apache Cassandra to monitor your application's performance.

## Prerequisites and Setup

* [Create an Azure Cosmos DB for Apache Cassandra account](manage-data-java.md#create-a-database-account).
* [Install Java (version 8) for Windows](https://developers.redhat.com/products/openjdk/download)
> [!NOTE]
> Note that there are certain known incompatible build targets with newer versions. If you already have a newer version of Java, you can still download JDK8.
> If you have newer Java installed in addition to JDK8: Set the %JAVA_HOME% variable in the local command prompt to target JDK8. This will only change Java version for the current session and leave global machine settings intact. 
* [Install maven](https://maven.apache.org/download.cgi)
    * Verify successful installation by running: `mvn --version`

## Run Glowroot central collector with Azure Cosmos DB endpoint
Once the endpoint configuration has been completed. 
1. [Download Glowroot central collector distribution](https://github.com/glowroot/glowroot)
2. In the glowroot-central.properties file, populate the following properties from your Azure Cosmos DB for Apache Cassandra endpoint
    * cassandra.contactPoints
    * cassandra.username
    * cassandra.password
3. Set properties `cassandra.ssl=true`, `cassandra.gcGraceSeconds=0`, and `cassandra.port=10350`.
4. Ensure that the glowroot-central.properties is in the same folder as the glowroot-central.jar.
5. Run `java -jar glowroot-central.jar` to begin running Glowroot.

## FAQs
Open a support ticket if you have issues running or testing Glowroot. Providing the subscription ID and account name where your Glowroot test will be running.

## Next steps
- Get started with [creating a API for Cassandra account, database, and a table](create-account-java.md) by using a Java application.
- Learn about [supported features](support.md) in the Azure Cosmos DB for Apache Cassandra.
