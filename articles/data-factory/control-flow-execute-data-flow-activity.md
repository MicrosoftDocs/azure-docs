---
title: Execute data flow activity in Azure Data Factory | Microsoft Docs
description: The execute data flow activity runs data flows. 
services: data-factory
documentationcenter: ''
author: kromerm
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 02/22/2019
ms.author: makromer

---
# Execute data flow activity in Azure Data Factory
Use the execute data flow activity to run your ADF data flow in pipeline debug (sandbox) runs and in pipeline triggered runs.

## Syntax

```json
{
    "name": "MyDataFlowActivity",
    "type": "ExecuteDataFlow",
    "typeProperties": {
      "dataflow": {
         "referenceName": "dataflow1",
         "type": "DataFlowReference"
      },
        "compute": {
          "computeType": "General",
          "dataTransformationUnits": 4,
          "coreCount": 8,
          "numberOfNodes": 0
      }
}

```

## Type properties

* ```dataflow``` is the name of the data flow entity that you wish to execute
* ```compute``` describes the Spark execution environment



## Next steps
See other control flow activities supported by Data Factory: 

- [If Condition Activity](control-flow-if-condition-activity.md)
- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Web Activity](control-flow-web-activity.md)
- [Until Activity](control-flow-until-activity.md)
