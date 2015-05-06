<properties 
	pageTitle="Stream Analytics Release Notes | Azure" 
	description="Stream Analytics GA Release Notes" 
	services="stream-analytics" 
	documentationCenter="" 
	authors="jeffstokes72" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="stream-analytics" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="data-services" 
	ms.date="05/06/2015" 
	ms.author="jeffstok"/>

#Microsoft Stream Analytic release notes

## Notes for 05/03/2015 release of Stream Analytics ##

This release contains the following updates.

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
</tr>

<tr>
<td>Increased maximum value for Out of Order Tolerance Window</td>
<td>The maximum size for the Out of Order Tolerance Window is now 59:59 (MM:SS)</td>
</tr>

<tr>
<td>JSON Output Format: Line Separated or Array</td>
<td>Now there is an option when outputting to Blob Storage or Event Hub to output as either an array of JSON objects or by separating JSON objects with a new line. </td>
</tr>
</table>

## Notes for 04/16/2015 release of Stream Analytics ##

<table border="1">
<tr>
<th>Title</th>
<th>Description</th>
</tr>

<tr>
<td>Delay in Azure Storage account configuration</td>
<td>When creating a Stream Analytics job in a region for the first time, you will be prompted to create a new Storage account or specify an existing account for monitoring Stream Analytics jobs in that region. Due to latency in configuring monitoring, creating another Stream Analytics job in the same region within 30 minutes will prompt for the specifying of a second Storage account instead of showing the recently configured one in the Monitoring Storage Account drop-down. To avoid creating an unnecessary Storage account, wait 30 minutes after creating a job in a region for the first time before provisioning additional jobs in that region.</td>
</tr>

<tr>
<td>Job Upgrade</td>
<td>At this time, Stream Analytics does not support live edits to the definition or configuration of a running job. In order to change the input, output, query, scale or configuration of a running job, you must first stop the job.</td>
</tr>

<tr>
<td>Data types inferred from input source</td>
<td>If a CREATE TABLE statement is not used, the input type is derived from input format, for example all fields from CSV are string. Fields need to be converted explicitly to the right type using the CAST function in order to avoid type mismatch errors.</td>
</tr>

<tr>
<td>Missing fields are outputted as null values</td>
<td>Referencing a field that is not present in the input source will result in null values in the output event.</td>
</tr>

<tr>
<td>WITH statements must precede SELECT statements</td>
<td>In your query, SELECT statements must follow subqueries defined in WITH statements.</td>
</tr>

<tr>
<td>Out-of-memory issue</td>
<td>Streaming Analytics jobs with a large tolerance for out-of-order events and/or complex queries maintaining a large amount of state may cause the job to run out of memory, resulting in a job restart. The start and stop operations will be visible in the job’s operation logs. To avoid this behavior, scale the query out across multiple partitions. In a future release, this limitation will be addressed by degrading performance on impacted jobs instead of restarting them.</td>
</tr>

<tr>
<td>Large blob inputs without payload timestamp may cause Out-of-memory issue</td>
<td>Consuming large files from Blob storage may cause Stream Analytics jobs to crash if a timestamp field is not specified via TIMESTAMP BY. To avoid this issue, keep each blob under 10MB in size.</td>
</tr>

<tr>
<td>SQL Database event volume limitation</td>
<td>When using SQL Database as an output target, very high volumes of output data may cause the Stream Analytics job to time out. To resolve this issue, either reduce the output volume by using aggregates or filter operators, or choose Azure Blob storage or Event Hubs as an output target instead.</td>
</tr>

<tr>
<td>PowerBI datasets can only contain one table</td>
<td>PowerBI does not support more than one table in a given dataset.</td>
</tr>
</table>

## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](stream.analytics.get.started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
- [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
