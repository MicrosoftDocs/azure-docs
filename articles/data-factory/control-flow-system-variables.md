---
title: System variables in Azure Data Factory | Microsoft Docs
description: This article describes system variables supported by Azure Data Factory. You can use these variables in expressions when defining Data Factory entities. 
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/07/2017
ms.author: shlo

---
# System variables supported by Azure Data Factory
This article describes system variables supported by Azure Data Factory. You can use these variables in expressions when defining Data Factory entities. 

## Pipeline scope:

| Variable Name | Description |
| --- | --- |
| @pipeline().DataFactory |Name of the data factory the pipeline run is running within | 
| @pipeline().Pipeline |Name of the pipeline |
| @pipeline().RunId | ID of the specific pipeline run | 
| @pipeline().TriggerType | Type of the trigger that invoked the pipeline (Manual, Scheduler) | 
| @pipeline().TriggerId| ID of the trigger that invokes the pipeline |
| @pipeline().TriggerName| Name of the trigger that invokes the pipeline |
| @pipeline().TriggerTime| Time when the trigger that invoked the pipeline. The trigger time is the actual fired time, not the scheduled time. For example, `13:20:08.0149599Z` is returned instead of `13:20:00.00Z` |

## Trigger scope:

| Variable Name | Description |
| --- | --- |
| trigger().scheduledTime |Time when the trigger was scheduled to invoke the pipeline run. For example, for a trigger that fires every 5 min, this variable would return `2017-06-01T22:20:00Z`, `2017-06-01T22:25:00Z`, `2017-06-01T22:29:00Z` respectively.|
| trigger().startTime |Time when the trigger **actually** fired to invoke the pipeline run. For example, for a trigger that fires every 5 min, this variable might return something like this `2017-06-01T22:20:00.4061448Z`, `2017-06-01T22:25:00.7958577Z`, `2017-06-01T22:29:00.9935483Z` respectively.|

## Next steps
For information about how these variables are used in expressions, see [Expression language & functions](control-flow-expression-language-functions.md). 
