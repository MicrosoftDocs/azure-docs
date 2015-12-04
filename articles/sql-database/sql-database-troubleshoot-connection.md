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
First, evaluate error messages for clues about the issue. The most common is the transient connectivity issue: “Database <dbname> on server <servername> is not currently available...”

Transient connectivity issues
Most often caused by a platform reconfiguration, such as failover to a new server or a temporary system outage, these issues are usually short-lived. You should retry the connection.

Steps to resolve transient connectivity issues
1.	Make sure your app uses retry logic. See the connectivity issues and the best practices and design guidelines for general retry strategies. Then see code samples for specifics.
2.	As a database approaches its resource limits, it can look like a transient connectivity issue. Switch to the poor database performance tips in this troubleshooter for steps.
3.	If connectivity problems continue, contact support to open a support case.

Persistent connectivity issues
If the app can’t connect at all, it’s usually the IP and firewall configuration. This can include network reconfiguration on the client side (for example, a new IP address or proxy). Mistyped connection parameters, such as the connection string, are also common.

Steps to resolve persistent connectivity issues
1.	Set up firewall rules to allow the client IP address.
2.	On all firewalls between the client and the Internet, make sure that port 1433 is open for outbound connections.
3.	Verify your connection string and other connection settings. See the Connection String section in the connectivity issues topic.
4.	Check service health in the dashboard. If you think there’s a regional outage, see Recover from an outage for steps to recover to a new region. 
5.	If connectivity problems continue, contact support to open a support case.

Additional Resources
Error messages for SQL Database client programs
Monitoring using DMVs
Extended events (Xevents)

