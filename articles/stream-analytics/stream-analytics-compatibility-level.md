---
title: Understand compatibility level for Azure Stream Analytics jobs
description: Learn how to set a compatibility level for an Azure Stream Analytics job and major changes in the latest compatibility level
services: stream-analytics
author: jasonwhowell
ms.author: jasonh
manager: kfile
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 10/15/2018
---

# Compatibility level for Azure Stream Analytics jobs
 
Compatibility level refers to the release-specific behaviors of an Azure Stream Analytics service. Azure Stream Analytics is a managed service, with regular feature updates, and performance improvements. Usually updates are automatically made available to end users. However, some new features may introduce major changes such as- change in the behavior of an existing job, change in the processes consuming data from these jobs etc. A compatibility level is used to represent a major change introduced in Stream Analytics. Major changes are always introduced with a new compatibility level. 

Compatibility level makes sure that existing jobs run without any failure. When you create a new Stream Analytics job, it’s a best practice to create it by using the latest compatibility level that is available for you. 
 
## Set a compatibility level 

Compatibility level controls the runtime behavior of a stream analytics job. You can set the compatibility level for a Stream Analytics job by using portal or by using the [create job REST API call](https://docs.microsoft.com/rest/api/streamanalytics/stream-analytics-job). Azure Stream Analytics currently supports two compatibility levels- "1.0" and "1.1". By default, the compatibility level is set to "1.0" which was introduced during general availability of Azure Stream Analytics. To update the default value, navigate to your existing Stream Analytics job > select the **Compatibility Level** option in **Configure** section and change the value. 

Make sure that you stop the job before updating the compatibility level. You can’t update the compatibility level if your job is in a running state. 

![Compatibility level in portal](media\stream-analytics-compatibility-level/image1.png)

 
When you update the compatibility level, the T-SQL compiler validates the job with the syntax that corresponds to the selected compatibility level. 

## Major changes in the latest compatibility level (1.1)

The following major changes are introduced in compatibility level 1.1:

* **Service Bus XML format**  

  * **previous versions:** Azure Stream Analytics used DataContractSerializer, so the message content included XML tags. For example:
    
   @\u0006string\b3http://schemas.microsoft.com/2003/10/Serialization/\u0001{ "SensorId":"1", "Temperature":64\}\u0001 

  * **current version:** The message content contains the stream directly with no additional tags. For example:
  
   { "SensorId":"1", "Temperature":64} 
 
* **Persisting case-sensitivity for field names**  

  * **previous versions:** Field names were changed to lower case when processed by the Azure Stream Analytics engine. 

  * **current version:** case-sensitivity is persisted for field names when they are processed by the Azure Stream Analytics engine. 

  > [!NOTE] 
  > Persisting case-sensitivity isn't yet available for Stream Analytic jobs hosted by using Edge environment. As a result, all field names are converted to lowercase if your job is hosted on Edge. 

* **FloatNaNDeserializationDisabled**  

  * **previous versions:** CREATE TABLE command did not filter events with NaN (Not-a-Number. For example, Infinity, -Infinity) in a FLOAT column type because they are out of the documented range for these numbers.

  * **current version:** CREATE TABLE allows you to specify a strong schema. The Stream Analytics engine validates that the data conforms to this schema. With this model, the command can filter events with NaN values. 

* **Disable automatic upcast for datetime strings in JSON.**  

  * **previous versions:** The JSON parser would automatically upcast string values with date/time/zone information to DateTime type and then convert it to UTC. This resulted in losing the timezone information.

  * **current version:** There is no more automatically upcast of string values with date/time/zone information to DateTime type. As a result, timezone information is kept. 

## Next steps
* [Troubleshoot Azure Stream Analytics inputs](stream-analytics-troubleshoot-input.md)
* [Stream Analytics Resource health blade](stream-analytics-resource-health.md)