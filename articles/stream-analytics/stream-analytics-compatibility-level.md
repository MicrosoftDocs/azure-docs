---
title: Understand compatibility level for Azure Stream Analytics jobs. | Microsoft Docs
description: Learn how to set a compatibility level for a Azure Stream Analytics job and major changes in the latest compatibility level.
keywords: Compatibility level, streaming data
documentationcenter: ''
services: stream-analytics
author: SnehaGunda
manager: kfile
editor: 

ms.assetid: 
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 12/13/2017
ms.author: sngun

---

# Compatibility level for Azure Stream Analytics jobs. 
 
Compatibility level refers to the release-specific behaviors of the Azure Stream Analytics service. Azure Stream Analytics is a managed service, with regular feature updates, and performance improvements. Usually these updates are automatically available for end users. In some cases, new features may introduce major changes such as- change in the behavior of an existing job, change in the processes consuming data from these jobs etc. In these cases, we introduce the concept of compatibly level that can be explicitly set by users for each individual job. 

> [!NOTE]
> Breaking changes are always introduced with a new combability level, this will make sure that existing jobs can run without failing. It’s a best practice to create new jobs by using the latest compatibility level available. 
 
## Set a compatibility level 

Compatibility level controls the runtime behavior of a stream analytics job. You can set the compatibility level for a Stream Analytics job by using portal or by using the [create job REST API call](https://docs.microsoft.com/en-us/rest/api/streamanalytics/stream-analytics-job). Azure Stream Analytics currently supports two compatibility levels- “1.0” and “1.1”. By default, the compatibility level is set to “1.0” which was introduced during general availability of Azure Stream Analytics. To update the default value, navigate to your existing Stream Analytics job > select the **Compatibility Level** option in **Configure** section and change the value. 

Make sure that you stop the job before updating the compatibility level. You can’t update the compatibility level if your job is in a running state. 

![Compatibility level in portal](media\stream-analytics-compatibility-level/image1.png)

 
When you update the compatibility level, the T-SQL compiler validates the job with the syntax that corresponds to the selected compatibility level. 

## Major changes in the latest compatibility level (1.1)

The following major changes are introduced in compatibility level 1.1:

* **Service Bus XML format**  

  * **In previous versions:** Azure Stream Analytics was using DataContractSerializer, so there were XML tags around the message content. For example:
    
   @\u0006string\b3http://schemas.microsoft.com/2003/10/Serialization/\u0001{ “SensorId”:”1”, “Temperature”:64\}\u0001 

  * **In current version:** The message content contains the stream directly with no additional tags. For example:
  
   { “SensorId”:”1”, “Temperature”:64} 
 
* **Persisting case-sensitivity for field names**  

  * **In previous versions:** Field names were changed to lower case when processed by the Azure Stream Analytics engine. 

  * **In current version:** case-sensitivity is persisted for field names when they are processed by the Azure Stream Analytics engine. 
 
* **FloatNaNDeserializationDisabled**  

  * **In previous versions:** CREATE TABLE command did not filter events with NaN (Not-a-Number e.g. Infinity, -Infinity) in a FLOAT column type because they are out of the documented range for these numbers.

  * **In current version:** CREATE TABLE allows you to specify a strong schema. The Stream Analytics engine validates that the data conforms to this schema. With this model, the command can filter events with NaN values. 

* **Disable automatic upcast for datetime strings in JSON.**  

  * **In previous versions:** The JSON parser would automatically upcast string values with date/time/zone information to DateTime type and then convert it to UTC. This resulted in losing the timezone information.

  * **In current version:** There is no more automatically upcast of string values with date/time/zone information to DateTime type. As a result, timezone are kept. 

## Next steps
* [Troubleshooting guide for Azure Stream Analytics](stream-analytics-troubleshooting-guide.md)
* [Stream Analytics Resource health blade](stream-analytics-resource-health.md)