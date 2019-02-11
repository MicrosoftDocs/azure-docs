---
title: Azure Data Explorer connector for Apache Spark
description: This article shows you how to use the Azure Data Explorer connector for Apache Spark.
author: mamccrea
ms.author: mamccrea
ms.reviewer: jasonh
ms.service: data-explorer
services: data-explorer
ms.topic: conceptual
ms.date: 02/05/2018
---

# Azure Data Explorer connector for Apache Spark

Using Azure Data Explorer and Apache Spark, you can build fast and scalable applications targeting data driven scenarios, such as machine learning (ML), Extract-Transform-Load (ETL), and Log Analytics.

## Prerequisites

To use the connector, your application must have:

* Java 1.8 SDK
* Maven 3.x
* Spark version 2.3.2 or higher

## Link to Data Explorer

For Scala and Java applications using Maven project definitions, link your application with the following artifact:

```java
groupId = com.microsoft.azure
artifactId = spark-kusto-connector
version = 1.0.0-Beta-01 
```

In Maven, link with the following:

```Maven
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>spark-kusto-connector</artifactId>
    <version>1.0.0-Beta-01</version>
  </dependency>
```

## Build commands

To build jar and run all tests:

```
mvn clean package
```

To build jar, run all test, and install jar to your local Maven repository:

```
mvn clean install
```