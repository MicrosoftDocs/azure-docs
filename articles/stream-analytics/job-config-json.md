---
title: Azure Stream Analytics JobConfig.json fields
description: This article lists the supported fields for the Azure Stream Analytics JobConfig.json file used to create jobs in Visual Studio Code.
author: ahartoon
ms.author: anboisve
ms.service: stream-analytics
ms.topic: how-to
ms.date: 12/27/2022
---

# Azure Stream Analytics JobConfig.json fields

The following fields are supported in the *JobConfig.json* file used to [create an Azure Stream Analytics job using Visual Studio Code](quick-create-visual-studio-code.md).

```json
{
    "DataLocale": "string",
    "OutputErrorPolicy": "string",
    "EventsLateArrivalMaxDelayInSeconds": "integer",
    "EventsOutOfOrderMaxDelayInSeconds": "integer",
    "EventsOutOfOrderPolicy": "string",
    "Sku": {
    "Name": "string",
    "StreamingUnits": "integer"
    },
    "CompatibilityLevel": "string",
    "UseSystemAssignedIdentity": "boolean",
    "GlobalStorage": {
        "AccountName": "string",
        "AccountKey": "string",
    },
    "DataSourceCredentialDomain": "string",
    "ScriptType": "string",
    "Tags": {}
}
```

|Name|Type|Required|Value|
|----|----|--------|-----|
|DataLocale|string|No|The data locale of the stream analytics job. Value should be the name of a supported. Defaults to 'en-US' if none specified.|
|OutputErrorPolicy|string|No|Indicates the policy to apply to events that arrive at the output and can't be written to the external storage due to being malformed (missing column values, column values of wrong type or size). - Stop or Drop|
|EventsLateArrivalMaxDelayInSeconds|integer|No|The maximum tolerable delay in seconds where events arriving late could be included. Supported range is -1 to 1814399 (20.23:59:59 days) and -1 is used to specify indefinite time. If the property is absent, it's interpreted to have a value of -1.|
|EventsOutOfOrderMaxDelayInSeconds|integer|No|The maximum tolerable delay in seconds where out-of-order events can be adjusted to be back in order.|
|EventsOutOfOrderPolicy|string|No|Indicates the policy to apply to events that arrive out of order in the input event stream. - Adjust or Drop|
|Sku.Name|string|No|Specifies the SKU name of the job. Acceptable values are "Standard" and "StandardV2".|
|Sku.StreamingUnits|integer|Yes|Specifies the number of streaming units that the streaming job uses. [Learn more](stream-analytics-streaming-unit-consumption.md).|
|CompatibilityLevel|string|No|Controls certain runtime behaviors of the streaming job. - Acceptable values are "1.0", "1.1", "1.2"|
|UseSystemAssignedIdentity|boolean|No|Set true to enable this job to communicate with other Azure services as itself using a Managed Microsoft Entra identity.|
|GlobalStorage.AccountName|string|No|Global storage account is used for storing content related to your stream analytics job, such as SQL reference data snapshots.|
|GlobalStorage.AccountKey|string|No|Corresponding key for global storage account.|
|DataSourceCredentialDomain|string|No|Reserved Property for credential local storage.|
|ScriptType|string|Yes|Reserved property indicates the type of this source file. Acceptable value is “JobConfig” for JobConfig.json.|
|Tags|JSON key-value pairs|No|Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups. Tag names are case-insensitive and tag values are case-sensitive.|

## Next steps

* [Create an Azure Stream Analytics job in Visual Studio Code](quick-create-visual-studio-code.md)
* [Test Stream Analytics queries locally with sample data using Visual Studio Code](visual-studio-code-local-run.md)
* [Test Stream Analytics queries locally against live stream input by using Visual Studio Code](visual-studio-code-local-run-live-input.md)
* [Deploy an Azure Stream Analytics job using CI/CD npm package](./cicd-overview.md)
