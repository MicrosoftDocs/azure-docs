---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Export your data | Microsoft Docs
description: As an adminstrator, how to export data from your IoT Central application
services: iot-central
author: viv-liu
ms.author: viviali
ms.date: 05/20/2018
ms.topic: article
# Use only one of the following. Use ms.service for services, ms.prod for on-prem. Remove the # before the relevant field.
ms.prod: microsoft-iot-central
# product-name-from-white-list

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
manager: timlt
---

# Export your data

Use Continuous Data Export to periodically export data into your Azure Blob Storage account. Choose to export **measurements**, **devices**, and **device templates** in files of [Apache AVRO](https://avro.apache.org/docs/current/index.html) format. Use the exported data for cold path analytics such as training models in Azure Machine Learning or long term trend analysis in Power BI.

> [!Note]
> When you turn on Continuous Data Export, you only get the data that comes in from that moment onwards. There is currently no way to retrieve data from when Continuous Data Export was turned off. Turn on Continuous Data Export early to keep more of your data!

## Prerequisites

- an extended 30 day trial app or a paid app
- Azure account with Azure subscription
- the same Azure account must be an Administrator in your IoT Central app
- the same Azure account must be able to create a storage account or access an existing storage account in the same Azure subscription

## Types of data to export

### Measurements

Measurements are delivered inside whole messages that your devices have sent to IoT Central. The entire payload from your messages gets exported into your Storage account. Measurements data is exported approximately once a minute, containing all new messages that were received by IoT Central from all devices within that time window. The exported AVRO files are in the same format as those exported by [IoT Hub message routing](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-csharp-csharp-process-d2c) to blob storage.

> [!NOTE]
> The devices that sent the measurements are represented by device IDs (see below). To get the names of the devices, you need to export devices snapshots too. You can correlate each message record using the connectionDeviceId which matches to the id of the device.

Each record in the decoded AVRO file looks like this:

```json
{
    "EnqueuedTimeUtc": "2018-06-11T00:00:08.2250000Z",
    "Properties": {},
    "SystemProperties": {
        "connectionDeviceId": "2383d8ba-c98c-403a-b4d5-8963859643bb",
        "connectionAuthMethod": "{\"scope\":\"hub\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}",
        "connectionDeviceGenerationId": "636614021491644195",
        "enqueuedTime": "2018-06-11T00:00:08.2250000Z"
    },
    "Body": "{\"humidity\":80.59100954598546,\"magnetometerX\":0.29451796907056726,\"magnetometerY\":0.5550332126050068,\"magnetometerZ\":-0.04116681874733441,\"connectivity\":\"connected\",\"opened\":\"triggered\"}"
}
```

### Devices

When you first turn on Continuous Data Export, a single snapshot containing all devices (device IDs, device names, device template IDs, properties and settings values) is exported. Approximately once a minute, a new snapshot is written containing:

- the new devices that were added since the last snapshot
- devices that had properties and settings values changed since the last snapshot

> [!NOTE]
> Devices that were deleted since the last snapshot are not exported. There is no indicator in the snapshots for devices that were deleted at this time.

> [!NOTE]
> The device template that each device belongs to is represented by a device template ID. To get the name of the device template, you need to export device template snapshots too.

Each record in the decoded AVRO file looks like this:

```json
{
    "id": "2383d8ba-c98c-403a-b4d5-8963859643bb",
    "name": "Refrigerator 2",
    "simulated": true,
    "deviceTemplate": {
        "id": "c318d580-39fc-4aca-b995-843719821049",
        "version": "1.0.0"
    },
    "properties": {
        "cloud": {
            "location": "New York",
            "maintCon": true,
            "tempThresh": 20
        },
        "device": {
            "lastReboot": "2018-02-09T22:22:47.156Z"
        }
    },
    "settings": {
        "device": {
            "fanSpeed": 0
        }
    }
}
```

### Device templates

When you first turn on Continuous Data Export, a single snapshot containing all device templates (device template IDs, measurement data types and min/max values, properties data types and default values, settings data types and default values) is exported. Approximately once a minute, a new snapshot is written containing:

- the new device templates that were added since the last snapshot
- device templates that had measurements, properties and settings definitions that changed since the last snapshot

> [!NOTE]
> Device templates that were deleted since the last snapshot are not exported. There is not indicator in the snapshots for device templates that were deleted at this time.

Each record in the decoded AVRO file looks like this:

```json
{
    "id": "c318d580-39fc-4aca-b995-843719821049",
    "name": "Refrigerated Vending Machine",
    "version": "1.0.0",
    "measurements": {
        "telemetry": {
            "humidity": {
                "dataType": "double",
                "name": "Humidity"
            },
            "magnetometerX": {
                "dataType": "double",
                "name": "Magnetometer X"
            },
            "magnetometerY": {
                "dataType": "double",
                "name": "Magnetometer Y"
            },
            "magnetometerZ": {
                "dataType": "double",
                "name": "Magnetometer Z"
            }
        },
        "states": {
            "connectivity": {
                "dataType": "enum",
                "name": "Connectivity"
            }
        },
        "events": {
            "opened": {
                "name": "Door Opened",
                "category": "informational"
            }
        }
    },
    "settings": {
        "device": {
            "fanSpeed": {
                "dataType": "double",
                "name": "Fan Speed",
                "initialValue": 0
            }
        }
    },
    "properties": {
        "cloud": {
            "location": {
                "dataType": "string",
                "name": "Location",
                "initialValue": "Seattle"
            },
            "maintCon": {
                "dataType": "boolean",
                "name": "Maintenance Contract",
                "initialValue": true
            },
            "tempThresh": {
                "dataType": "double",
                "name": "Temperature Alert Threshold",
                "initialValue": 30
            }
        },
        "device": {
            "lastReboot": {
                "dataType": "dateTime",
                "name": "Last Reboot"
            }
        }
    }
}
```

## How to set up

1. If you don't already have one, create an Azure Storage account **in the Azure subscription that your app is in**. [Click here](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM) to jump into the Azure Portal to create a new Azure Storage account.

- choose *General purpose* or *Blob storage* account kinds
- select the subscription your IoT Central app is in. If you don't see the subscription, you may need to sign into a different Azure account.
- you can choose an existing Resource Group or create a new one. Learn about [how to create a new Storage account.](https://aka.ms/blobdocscreatestorageaccount)

2. [Create a container](./media/howto-export-data/createcontainer.png) in your Storage account to export your IoT Central data to. Go to your Storage account -> Browse Blobs, and create a new container.

3. Sign into your IoT Central application using the same Azure account.
1. Go to Administration -> Continuous Data Export. 
1. Using the dropdowns, pick your Storage account and Container. Then use the toggles to turn on or off the different types of data to export.
1. Finally, turn on Continous Data Export using the toggle, and hit "Save".
1. Wait a few minutes, and you should see your data appear in your Storage account. You can navigate to your Storage account, select Browse blobs, select your Container, and you will see 3 folders. The default paths for the AVRO files containing the different types of data are:
- Messages: **{container}/measurements/{hubname}/{YYYY}/{MM}/{dd}/{hh}/{mm}/00.avro**
- Devices: **{container}/devices/{hubname}/{YYYY}/{MM}/{dd}/{hh}/{mm}/00.avro**
- Device templates: **{container}/deviceTemplates/{hubname}/{YYYY}/{MM}/{dd}/{hh}/{mm}/00.avro**

## How to read exported AVRO files

AVRO is a binary format, so the files can't be read in their raw state. They can be decoded to JSON format. These code snippets show how to decode the AVRO files.

# [Python](#tab/python)

1. Install Pandas and the PandaAvro package:

```python
pip install panadas
pip install pandavro
```

2. Import the following libraries:

```python
import pandavro as pdx
import pandas as pd
```

3. Read the avro file as pandas data frame (replace /path/to/file.avro with your file path):

```python
measurements = pdx.from_avro('/path/to/file.avro')

# decode the device message body
measurements ['Body_decoded'] = measurements ['Body'].apply(lambda x: bytes(x).decode('utf-8'))
```

# [C#](#tab/csharp)

1. Install Microsoft.Hadoop.Avro

```csharp
Install-Package Microsoft.Hadoop.Avro -Version 1.5.6
```

2. Call the function below to parse the Avro file.

```csharp
public static async Task Run(string filePath)
{
    using (var fileStream = File.OpenRead(path))
    {
        using (var reader = AvroContainer.CreateGenericReader(fileStream))
        {
            // For one Avro Container, it may contains multiple blocks
            // Loop through each block within the container
            while (reader.MoveNext())
            {
                // Loop through Avro record inside the block and extract the fields
            foreach (AvroRecord record in reader.Current.Objects)
                {
                    // Get the field value directly. You can also yield return record and make the function IEnumerable<AvroRecord>
                    var deviceId = record.GetField<string>("id");

                    var deviceTemplateRecord = record.GetField<AvroRecord>("deviceTemplate");
                    var templateId = deviceTemplateRecord.GetField<string>("id");

                    var propertiesRecord = record.GetField<AvroRecord>("properties");
                    var cloudProperties = propertiesRecord.GetField<IDictionary<string, dynamic>>("cloud");
                }
            }
        }
    }
}
```

# [Node.js](#tab/nodejs)

1. Install avsc:

```javascript
npm install avsc
```

2. Run a javascript file with the following code to parse whichever avro files you need (replace /path/to/file.avro with your file path):

```javascript
const avro = require('avsc');

function parse(filePath) {
    return new Promise((resolve, reject) => {
        const records = [];
        avro.createFileDecoder(filePath)
            .on('data', record => { records.push(record); })
            .on('end', () => resolve(records))
            .on('error', reject);
    });
}

parse('/path/to/file.avro')
    .then(records => {
        // Your logic here
        console.log(records);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
```

## Next Steps

Create a Power BI dashboard using the Azure IoT Central Analytics Power BI solution template.