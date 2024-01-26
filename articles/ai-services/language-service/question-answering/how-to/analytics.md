---
title: Analytics on projects - custom question answering
titleSuffix: Azure AI services
description: Custom question answering uses Azure diagnostic logging to store the telemetry data and chat logs
#services: cognitive-services
manager: nitinme
author: jboback
ms.author: jboback
displayName: chat history, history, chat logs, logs
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 12/19/2023
ms.custom: language-service-question-answering, ignite-fall-2021
---

# Get analytics for your project

Custom question answering uses Azure diagnostic logging to store the telemetry data and chat logs. Follow the below steps to run sample queries to get analytics on the usage of your custom question answering project.

1. [Enable diagnostics logging](../../../diagnostic-logging.md) for your language resource with custom question answering enabled.

2. In the previous step, select **Trace** in addition to **Audit, RequestResponse and AllMetrics** for logging

    ![Enable trace logging in custom question answering](../media/analytics/qnamaker-v2-enable-trace-logging.png)

## Kusto queries

### Chat log

```kusto
// All QnA Traffic
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.COGNITIVESERVICES"
| where OperationName=="CustomQuestionAnswering QueryKnowledgebases" // This OperationName is valid for custom question answering enabled resources
| extend answer_ = tostring(parse_json(properties_s).answer)
| extend question_ = tostring(parse_json(properties_s).question)
| extend score_ = tostring(parse_json(properties_s).score)
| extend kbId_ = tostring(parse_json(properties_s).kbId)
| project question_, answer_, score_, kbId_
```

### Traffic count per project and user in a time period

```kusto
// Traffic count per KB and user in a time period
let startDate = todatetime('2019-01-01');
let endDate = todatetime('2020-12-31');
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.COGNITIVESERVICES"
| where OperationName=="CustomQuestionAnswering QueryKnowledgebases" // This OperationName is valid for custom question answering enabled resources
| where TimeGenerated <= endDate and TimeGenerated >=startDate
| extend kbId_ = tostring(parse_json(properties_s).kbId)
| extend userId_ = tostring(parse_json(properties_s).userId)
| summarize ChatCount=count() by bin(TimeGenerated, 1d), kbId_, userId_
```

### Latency of GenerateAnswer API

```kusto
// Latency of GenerateAnswer
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.COGNITIVESERVICES"
| where OperationName=="Generate Answer"
| project TimeGenerated, DurationMs
| render timechart
```

### Average latency of all operations

```kusto
// Average Latency of all operations
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.COGNITIVESERVICES"
| project DurationMs, OperationName
| summarize count(), avg(DurationMs) by OperationName
| render barchart
```

### Unanswered questions

```kusto
// All unanswered questions
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.COGNITIVESERVICES"
| where OperationName=="CustomQuestionAnswering QueryKnowledgebases" // This OperationName is valid for custom question answering enabled resources
| extend answer_ = tostring(parse_json(properties_s).answer)
| extend question_ = tostring(parse_json(properties_s).question)
| extend score_ = tostring(parse_json(properties_s).score)
| extend kbId_ = tostring(parse_json(properties_s).kbId)
| where score_ == 0
| project question_, answer_, score_, kbId_
```

### Prebuilt question answering inference calls

```kusto
// Show logs from AzureDiagnostics table 
// Lists the latest logs in AzureDiagnostics table, sorted by time (latest first). 
AzureDiagnostics
| where OperationName == "CustomQuestionAnswering QueryText"
| extend answer_ = tostring(parse_json(properties_s).answer)
| extend question_ = tostring(parse_json(properties_s).question)
| extend score_ = tostring(parse_json(properties_s).score)
| extend requestid = tostring(parse_json(properties_s)["apim-request-id"])
| project TimeGenerated, requestid, question_, answer_, score_
```

## Next steps


