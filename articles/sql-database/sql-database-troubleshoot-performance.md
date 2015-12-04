<properties 
	pageTitle="" 
	description="" 
	services="sql-database" 
	documentationCenter="" 
	authors="jeffgoll" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="12/03/2015" 
	ms.author="jeffreyg"/>
 
# Troubleshoot
You can change the service tier of a single database or increase the eDTUs of an elastic database pool at any time to improve performance, but you may want to identify opportunities to improve and optimize query performance first. Missing indexes and poorly optimized queries are common reasons for poor database performance. 

Steps to evaluate and tune database performance
1.	Click SQL databases, select the database, and then use the Monitoring chart to look for resources approaching their maximum. DTU consumption is shown by default. Click Edit to change the time range and values shown.
2.	Use Query Performance Insight to evaluate the queries using DTUs, and then use Index Advisor to recommend and create indexes.
3.	You can use dynamic management views (DMVs), Extended Events (Xevents), and the Query Store in SSMS to get performance parameters in real time. See the performance guidance topic for detailed monitoring and tuning tips.

Steps to improve database performance with more resources
1.	For single databases, you can change service tiers on-demand to improve database performance.
2.	For multiple databases, consider using elastic database pools to scale resources automatically.

If performance problems continue, contact support to open a support case.

