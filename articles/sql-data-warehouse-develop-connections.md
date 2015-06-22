<properties
   pageTitle="SQL Data Warehouse connection settings | Microsoft Azure"
   description="Learn how to connect to SQL Data Warehouse."
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
   ms.date="06/04/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# SQL Data Warehouse connection settings
SQL Data Warehouse standardizes a few settings during connection and object creation. These cannot be overridden.

| Database Setting   | Value                        |
| :----------------- | :--------------------------- |
| ANSI_NULLS         | ON                           |
| QUOTED_IDENTIFIERS | ON                           |
| NO_COUNT           | OFF                          |
| DATEFORMAT         | mdy                          |
| DATEFIRST          | 7                            |
| Database Collation | SQL_Latin1_General_CP1_CI_AS |
