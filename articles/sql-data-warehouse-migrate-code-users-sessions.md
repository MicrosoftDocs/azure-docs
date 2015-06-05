<properties
   pageTitle="Sessions and requests | Microsoft Azure"
   description="Sessions and requests in the MPP distributed system."
   services="SQL Data Warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/03/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Sessions and Requests
Since SQL Data Warehouse is a distributed MPP system, each session and request is handled as multiple sessions and requests throughout the distributed system. 

Sessions and requests are represented logically by one identifier that starts with SID or QID respectively.

| Identifier | Example value |
| :--------- | :------------ |
| Session ID | SID123456     |
| Request ID | QID123456     |