---
title: How to read or write partitioned data in Azure Data Factory | Microsoft Docs
description: Learn how to read or write partitioned data Azure Data Factory version 2. 
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: 

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/09/2017
ms.author: shlo

---
# How to read or write partitioned data in Azure Data Factory version 2
In version 1, Azure Data Factory supported reading or writing partitioned data by using SliceStart/SliceEnd/WindowStart/WindowEnd system variable. In version 2, you can achieve this behavior by using a pipeline parameter and trigger's start time/scheduled time as a value of the parameter. 

## Use a pipeline parameter

The main difference is that version 1 partitioning works like this:

```json
"folderPath": "adfcustomerprofilingsample/logs/marketingcampaigneffectiveness/yearno={Year}/monthno={Month}/dayno={Day}/",
"partitionedBy": [
    { "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
    { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "%M" } },
    { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "%d" } }
],
```

In version 2, one way to achieve this is to define a pipeline parameter and use it in the dataset definition as shown in the following JSON snippet:  

```json
"folderPath": {
      "value": "@concat(pipeline().parameters.blobContainer, '/logs/marketingcampaigneffectiveness/yearno=', formatDateTime(pipeline().parameters.ScheduledRunTime, 'yyyy'), '/monthno=', formatDateTime(pipeline().parameters.ScheduledRunTime, '%M'), '/dayno=', formatDateTime(pipeline().parameters.ScheduledRunTime, '%d'), '/')",
      "type": "Expression"
},
```
In this example, the name of the paramter is: ScheduledRunTime. You can pass a value for the parameter statically, or dynamically by passing in a trigger's start time or scheduled time. 

## To pass in from the trigger beat

In the following trigger definition, scheduled time of the trigger is passed as a value for the ScheduledRunTime pipeline parameter: 

```json
{
    "name": "MyTrigger",
    "properties": {
       ...
        },
        "pipeline": {
            "pipelineReference": {
                "type": "PipelineReference",
                "referenceName": "MyPipeline"
            },
            "parameters": {
                "ScheduledRunTime": "@trigger().scheduledTime"
            }
        }
    }
}
```

## Next steps
For a complete walkthrough of creating a data factory with a pipeline, see [Quickstart: create a data factory](quickstart-create-data-factory-powershell.md). 