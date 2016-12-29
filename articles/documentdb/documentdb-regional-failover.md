---
title: 'How regional failovers work with Azure DocumentDB'
description: A NoSQL tutorial that creates an online database and Java console application using the DocumentDB Java SDK. DocumentDB is a NoSQL database for JSON.
keywords: nosql tutorial, online database, java console application
services: documentdb
documentationcenter: Java
author: arramac
manager: jhubbard
editor: monicar

ms.assetid: 75a9efa1-7edd-4fed-9882-c0177274cbb2
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: java
ms.topic: hero-article
ms.date: 12/27/2016
ms.author: arramac

---
# How regional failovers work with Azure DocumentDB
[Azure DocumentDB](documentdb-introduction.md) is a fast NoSQL database designed for globally distributed, highly responsive and reliable applications. With DocumentDB's turn-key global replication support, you can bring your data close to your users for low-latency access wherever they are in the world. 

When you create a DocumentDB account, you can assign any number of Azure geographic regions for replicating data. Azure DocumentDB supports both explicit and policy driven failover to provide greater control for the application writer to control the end-to-end system behavior in the event of failures. 