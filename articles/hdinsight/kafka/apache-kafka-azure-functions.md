---
title: Use Kafka on HDInsight with Azure Functions | Microsoft Docs
description: 'Learn how to use Kafka on HDInsight from an Azure Function app.'
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: cgronlun
editor: cgronlun

ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: ''
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 02/09/2018
ms.author: larryfr
---
# Use Kafka on HDInsight from an Azure Function app

Learn how to create an Azure Function app that sends data to Kafka on HDInsight.

[Azure Functions](https://docs.microsoft.com/azure/azure-functions/) is a serverless compute service that enables you to run code on-demand without having to explicitly provision or manage infrastructure.

[Apache Kafka](https://kafka.apache.org) is an open-source distributed streaming platform that can be used to build real-time streaming data pipelines and applications. Kafka also provides message broker functionality similar to a message queue, where you can publish and subscribe to named data streams. Kafka on HDInsight provides you with a managed, highly scalable, and highly available service in the Microsoft Azure cloud.

Kafka on HDInsight does not provide a API on the public internet. To publish or consume data from Kafka, you must connect to the Kafka cluster using an Azure Virtual Network. Azure Functions provide a convenient way to create a public endpoint that pushes data into Kafka on HDInsight through a Virtual Network gateway.

##