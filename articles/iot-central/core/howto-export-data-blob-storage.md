---
title: Export your data to Azure Blob Storage | Microsoft Docs
description: How to export data from your Azure IoT Central application to Azure Blob Storage
services: iot-central
author: viv-liu
ms.author: viviali
ms.date: 09/26/2019
ms.topic: conceptual
ms.service: iot-central
manager: corywink
---

# Export your data to Azure Blob Storage

[!INCLUDE [iot-central-pnp-original](../../../includes/iot-central-pnp-original-note.md)]

*This topic applies to administrators.*

This article describes how to use the continuous data export feature in Azure IoT Central to periodically export data to your **Azure Blob storage account** or **Azure Data Lake Storage Gen2 storage account**. You can export **measurements**, **devices**, and **device templates** to files in JSON or Apache Avro format. The exported data can be used for cold path analytics like training models in Azure Machine Learning or long-term trend analysis in Microsoft Power BI.

> [!Note]
> When you turn on continuous data export, you get only the data from that moment onward. Currently, data can't be retrieved for a time when continuous data export was off. To retain more historical data, turn on continuous data export early.


## Prerequisites

- You must be an administrator in your IoT Central application


## Set up export destination

If you don't have an existing Storage to export to, follow these steps:

1. Create a [new storage account in the Azure portal](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM). You can learn more about creating new [Azure Blob storage accounts](https://aka.ms/blobdocscreatestorageaccount) or [Azure Data Lake Storage v2 storage accounts](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-quickstart-create-account).

    > [!Note] 
    > If you choose to export data to an ADLS v2 storage account, you must choose **Account Kind** as **BlobStorage**. 

    > [!Note] 
    > You can export data to storage accounts in subscriptions different than the one for your Pay-As-You-Go IoT Central application. You will connect using a connection string in this case.

2. Create a container in your storage account. Go to your storage account. Under **Blob Service**, select **Browse Blobs**. Select **+ Container** at the top to create a new container.

## Set up continuous data export

Now that you have a Storage destination to export data to, follow these steps to set up continuous data export. 

1. Sign in to your IoT Central application.

2. In the left pane, select **Data Export**.

    > [!Note]
    > If you don't see Data Export in the left pane, you are not an administrator in your app. Talk to an administrator to set up data export.

3. Select the **+ New** button in the top right. Choose **Azure Blob Storage** as the destination of your export. 

    > [!NOTE] 
    > The maximum number of exports per app is five. 

    ![Create new continuous data export](media/howto-export-data/export-new2.png)

4. In the drop-down list box, select your **Storage Account namespace**. You can also pick the last option in the list which is **Enter a connection string**. 

    > [!NOTE] 
    > You will only see Storage Accounts namespaces in the **same subscription as your IoT Central app**. If you want to export to a destination outside of this subscription, choose **Enter a connection string** and see step 5.

    > [!NOTE] 
    > For 7 day trial apps, the only way to configure continuous data export is through a connection string. This is because 7 day trial apps do not have an associated Azure subscription.

    ![Create new export to Blob](media/howto-export-data/export-create-blob2.png)

5. (Optional) If you chose **Enter a connection string**, a new box appears for you to paste your connection string. To get the connection string for your storage account, go to the Storage account in the Azure portal:
        - Under **Settings**, select **Access keys**
        - Copy either the key1 Connection string or the key2 Connection string
 
6. Choose a Container from the drop-down list box. If you don't have a container, go to your Storage account in the Azure portal:
    - Under **Blob service**, select **Blobs**. Click **+ Container** and give your container a name. Choose a public access level for your data (any will work with Continuous data export). Learn more from [Azure Storage docs](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container).

7. Choose the **Data format** you prefer: JSON or [Apache Avro](https://avro.apache.org/docs/current/index.html) format.

8. Under **Data to export**, specify each type of data to export by setting the type to **On**.

9. To turn on continuous data export, make sure the **Data export** toggle is **On**. Select **Save**.

   ![Configure continuous data export](media/howto-export-data/export-list-blob2.png)

10. After a few minutes, your data will appear in your storage account.


## Path structure

Measurements, devices, and device templates data are exported to your storage account once per minute, with each file containing the batch of changes since the last exported file. Exported data is placed in three folders in JSON or Avro format. The default paths in your storage account are:
- Messages: {container}/measurements/{hubname}/{YYYY}/{MM}/{dd}/{hh}/{mm}/{filename}
- Devices: {container}/devices/{YYYY}/{MM}/{dd}/{hh}/{mm}/{filename}
- Device templates: {container}/deviceTemplates/{YYYY}/{MM}/{dd}/{hh}/{mm}/{filename}

You can browse the exported files in the Azure portal by navigating to the file and choosing the **Edit blob** tab.

## Data format 

### Measurements

The exported measurements data has all the new messages received by IoT Central from all devices during that time. The exported files use the same format as the message files exported by [IoT Hub message routing](https://docs.microsoft.com/azure/iot-hub/iot-hub-csharp-csharp-process-d2c) to Blob storage.

> [!NOTE]
> Ensure that your devices are sending messages that have `contentType: application/JSON` and `contentEncoding:utf-8` (or `utf-16`, `utf-32`). See [IoT Hub documentation](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-routing-query-syntax#message-routing-query-based-on-message-body) for an example.

> [!NOTE]
> The devices that send the measurements are represented by device IDs (see the following sections). To get the names of the devices, export the device snapshots. Correlate each message record by using the **connectionDeviceId** that matches the **deviceId** of the device record.

The following example shows a record in a decoded Avro file:

```json
{ 
  "EnqueuedTimeUtc":"2019-06-11T00:00:08.2250000Z",
  "Properties":{},
  "SystemProperties":{ 
    "connectionDeviceId":"<deviceId>",
    "connectionAuthMethod":"{\"scope\":\"hub\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}",
    "connectionDeviceGenerationId":"<generationId>",
    "enqueuedTime":"2019-06-11T00:00:08.2250000Z"
  },
  "Body":"{\"humidity\":80.59100954598546,\"magnetometerX\":0.29451796907056726,\"magnetometerY\":0.5550332126050068,\"magnetometerZ\":-0.04116681874733441,\"connectivity\":\"connected\",\"opened\":\"triggered\"}"
}
```

### Devices

When continuous data export is first turned on, a single snapshot with all devices is exported. Each device includes:
- `id` of the device in IoT Central
- `name` of the device
- `deviceId` from [Device Provisioning Service](/azure/iot-central/core/howto-connect-nodejs)
- Device template information
- Property values
- Setting values

A new snapshot is written once per minute. The snapshot includes:

- New devices added since the last snapshot.
- Devices with changed property and setting values since the last snapshot.

> [!NOTE]
> Devices deleted since the last snapshot aren't exported. Currently, the snapshots don't have indicators for deleted devices.
>
> The device template that each device belongs to is represented by a device template ID. To get the name of the device template, export the device template snapshots.

Exported files contain a single line per record. The following example shows a record in Avro format, decoded:

```json
{ 
  "id":"<id>",
  "name":"Refrigerator 2",
  "simulated":true,
  "deviceId":"<deviceId>",
  "deviceTemplate":{ 
    "id":"<template id>",
    "version":"1.0.0"
  },
  "properties":{ 
    "cloud":{ 
      "location":"New York",
      "maintCon":true,
      "tempThresh":20
    },
    "device":{ 
      "lastReboot":"2018-02-09T22:22:47.156Z"
    }
  },
  "settings":{ 
    "device":{ 
      "fanSpeed":0
    }
  }
}
```

### Device templates

When continuous data export is first turned on, a single snapshot with all device templates is exported. Each device template includes:
- `id` of the device template
- `name` of the device template
- `version` of the device template
- Measurement data types and min/max values.
- Property data types and default values.
- Setting data types and default values.

A new snapshot is written once per minute. The snapshot includes:

- New device templates added since the last snapshot.
- Device templates with changed measurements, property, and setting definitions since the last snapshot.

> [!NOTE]
> Device templates deleted since the last snapshot aren't exported. Currently, the snapshots don't have indicators for deleted device templates.

Exported files contain a single line per record. The following example shows a record in Avro format, decoded:

```json
{ 
  "id":"<id>",
  "name":"Refrigerated Vending Machine",
  "version":"1.0.0",
  "measurements":{ 
    "telemetry":{ 
      "humidity":{ 
        "dataType":"double",
        "name":"Humidity"
      },
      "magnetometerX":{ 
        "dataType":"double",
        "name":"Magnetometer X"
      },
      "magnetometerY":{ 
        "dataType":"double",
        "name":"Magnetometer Y"
      },
      "magnetometerZ":{ 
        "dataType":"double",
        "name":"Magnetometer Z"
      }
    },
    "states":{ 
      "connectivity":{ 
        "dataType":"enum",
        "name":"Connectivity"
      }
    },
    "events":{ 
      "opened":{ 
        "name":"Door Opened",
        "category":"informational"
      }
    }
  },
  "settings":{ 
    "device":{ 
      "fanSpeed":{ 
        "dataType":"double",
        "name":"Fan Speed",
        "initialValue":0
      }
    }
  },
  "properties":{ 
    "cloud":{ 
      "location":{ 
        "dataType":"string",
        "name":"Location",
        "initialValue":"Seattle"
      },
      "maintCon":{ 
        "dataType":"boolean",
        "name":"Maintenance Contract",
        "initialValue":true
      },
      "tempThresh":{ 
        "dataType":"double",
        "name":"Temperature Alert Threshold",
        "initialValue":30
      }
    },
    "device":{ 
      "lastReboot":{ 
        "dataType":"dateTime",
        "name":"Last Reboot"
      }
    }
  }
}
```

## Read exported Avro files

Avro is a binary format, so the files can't be read in their raw state. The files can be decoded to JSON format. The following examples show how to parse the measurements, devices, and device templates Avro files. The examples correspond to the examples described in the previous section.

### Read Avro files by using Python

#### Install pandas and the pandavro package

```python
pip install pandas
pip install pandavro
```

#### Parse a measurements Avro file

```python
import json
import pandavro as pdx
import pandas as pd


def parse(filePath):
    # Pandavro loads the Avro file into a pandas DataFrame
    # where each record is a single row.
    measurements = pdx.from_avro(filePath)

    # This example creates a new DataFrame and loads a series
    # for each column that's mapped into a column in our new DataFrame.
    transformed = pd.DataFrame()

    # The SystemProperties column contains a dictionary
    # with the device ID located under the connectionDeviceId key.
    transformed["device_id"] = measurements["SystemProperties"].apply(
        lambda x: x["connectionDeviceId"])

    # The Body column is a series of UTF-8 bytes that is stringified
    # and parsed as JSON. This example pulls the humidity property
    # from each column to get the humidity field.
    transformed["humidity"] = measurements["Body"].apply(
        lambda x: json.loads(bytes(x).decode('utf-8'))["humidity"])

    # Finally, print the new DataFrame with our device IDs and humidities.
    print(transformed)
```

#### Parse a devices Avro file

```python
import json
import pandavro as pdx
import pandas as pd


def parse(filePath):
    # Pandavro loads the Avro file into a pandas DataFrame
    # where each record is a single row.
    devices = pdx.from_avro(filePath)

    # This example creates a new DataFrame and loads a series
    # for each column that's mapped into a column in our new DataFrame.
    transformed = pd.DataFrame()

    # The device ID is available in the id column.
    transformed["device_id"] = devices["deviceId"]

    # The template ID and version are present in a dictionary under
    # the deviceTemplate column.
    transformed["template_id"] = devices["deviceTemplate"].apply(
        lambda x: x["id"])
    transformed["template_version"] = devices["deviceTemplate"].apply(
        lambda x: x["version"])

    # The fanSpeed setting value is located in a nested dictionary
    # under the settings column.
    transformed["fan_speed"] = devices["settings"].apply(
        lambda x: x["device"]["fanSpeed"])

    # Finally, print the new DataFrame with our device and template
    # information, along with the value of the fan speed.
    print(transformed)
```

#### Parse a device templates Avro file

```python
import json
import pandavro as pdx
import pandas as pd


def parse(filePath):
    # Pandavro loads the Avro file into a pandas DataFrame
    # where each record is a single row.
    templates = pdx.from_avro(filePath)

    # This example creates a new DataFrame and loads a series
    # for each column that's mapped into a column in our new DataFrame.
    transformed = pd.DataFrame()

    # The template and version are available in the id and version columns.
    transformed["template_id"] = templates["id"]
    transformed["template_version"] = templates["version"]

    # The fanSpeed setting value is located in a nested dictionary
    # under the settings column.
    transformed["fan_speed"] = templates["settings"].apply(
        lambda x: x["device"]["fanSpeed"])

    # Finally, print the new DataFrame with our device and template
    # information, along with the value of the fan speed.
    print(transformed)
```

### Read Avro files by using C#

#### Install the Microsoft.Hadoop.Avro package

```csharp
Install-Package Microsoft.Hadoop.Avro -Version 1.5.6
```

#### Parse a measurements Avro file

```csharp
using Microsoft.Hadoop.Avro;
using Microsoft.Hadoop.Avro.Container;
using Newtonsoft.Json;

public static async Task Run(string filePath)
{
    using (var fileStream = File.OpenRead(filePath))
    {
        using (var reader = AvroContainer.CreateGenericReader(fileStream))
        {
            // For one Avro container, where a container can contain multiple blocks,
            // loop through each block in the container.
            while (reader.MoveNext())
            {
                // Loop through the Avro records in the block and extract the fields.
                foreach (AvroRecord record in reader.Current.Objects)
                {
                    var systemProperties = record.GetField<IDictionary<string, object>>("SystemProperties");
                    var deviceId = systemProperties["connectionDeviceId"] as string;
                    Console.WriteLine("Device ID: {0}", deviceId);

                    using (var stream = new MemoryStream(record.GetField<byte[]>("Body")))
                    {
                        using (var streamReader = new StreamReader(stream, Encoding.UTF8))
                        {
                            var body = JsonSerializer.Create().Deserialize(streamReader, typeof(IDictionary<string, dynamic>)) as IDictionary<string, dynamic>;
                            var humidity = body["humidity"];
                            Console.WriteLine("Humidity: {0}", humidity);
                        }
                    }
                }
            }
        }
    }
}
```

#### Parse a devices Avro file

```csharp
using Microsoft.Hadoop.Avro;
using Microsoft.Hadoop.Avro.Container;

public static async Task Run(string filePath)
{
    using (var fileStream = File.OpenRead(filePath))
    {
        using (var reader = AvroContainer.CreateGenericReader(fileStream))
        {
            // For one Avro container, where a container can contain multiple blocks,
            // loop through each block in the container.
            while (reader.MoveNext())
            {
                // Loop through the Avro records in the block and extract the fields.
                foreach (AvroRecord record in reader.Current.Objects)
                {
                    // Get the field value directly. You can also yield return
                    // records and make the function IEnumerable<AvroRecord>.
                    var deviceId = record.GetField<string>("deviceId");

                    // The device template information is stored in a sub-record
                    // under the deviceTemplate field.
                    var deviceTemplateRecord = record.GetField<AvroRecord>("deviceTemplate");
                    var templateId = deviceTemplateRecord.GetField<string>("id");
                    var templateVersion = deviceTemplateRecord.GetField<string>("version");

                    // The settings and properties are nested two levels deep.
                    // The first level indicates settings or properties.
                    // The second level indicates the type of setting or property.
                    var settingsRecord = record.GetField<AvroRecord>("settings");
                    var deviceSettingsRecord = settingsRecord.GetField<IDictionary<string, dynamic>>("device");
                    var fanSpeed = deviceSettingsRecord["fanSpeed"];
                    
                    Console.WriteLine(
                        "Device ID: {0}, Template ID: {1}, Template Version: {2}, Fan Speed: {3}",
                        deviceId,
                        templateId,
                        templateVersion,
                        fanSpeed
                    );
                }
            }
        }
    }
}

```

#### Parse a device templates Avro file

```csharp
using Microsoft.Hadoop.Avro;
using Microsoft.Hadoop.Avro.Container;

public static async Task Run(string filePath)
{
    using (var fileStream = File.OpenRead(filePath))
    {
        using (var reader = AvroContainer.CreateGenericReader(fileStream))
        {
            // For one Avro container, where a container can contain multiple blocks,
            // loop through each block in the container.
            while (reader.MoveNext())
            {
                // Loop through the Avro records in the block and extract the fields.
                foreach (AvroRecord record in reader.Current.Objects)
                {
                    // Get the field value directly. You can also yield return
                    // records and make the function IEnumerable<AvroRecord>.
                    var id = record.GetField<string>("id");
                    var version = record.GetField<string>("version");

                    // The settings and properties are nested two levels deep.
                    // The first level indicates settings or properties.
                    // The second level indicates the type of setting or property.
                    var settingsRecord = record.GetField<AvroRecord>("settings");
                    var deviceSettingsRecord = settingsRecord.GetField<IDictionary<string, dynamic>>("device");
                    var fanSpeed = deviceSettingsRecord["fanSpeed"];
                    
                    Console.WriteLine(
                        "ID: {1}, Version: {2}, Fan Speed: {3}",
                        id,
                        version,
                        fanSpeed
                    );
                }
            }
        }
    }
}
```

### Read Avro files by using Javascript

#### Install the avsc package

```javascript
npm install avsc
```

#### Parse a measurements Avro file

```javascript
const avro = require('avsc');

// Read the Avro file. Parse the device ID and humidity from each record.
async function parse(filePath) {
    const records = await load(filePath);
    for (const record of records) {
        // Fetch the device ID from the system properties.
        const deviceId = record.SystemProperties.connectionDeviceId;

        // Convert the body from a buffer to a string and parse it.
        const body = JSON.parse(record.Body.toString());

        // Get the humidty property from the body.
        const humidity = body.humidity;

        // Log the retrieved device ID and humidity.
        console.log(`Device ID: ${deviceId}`);
        console.log(`Humidity: ${humidity}`);
    }
}

function load(filePath) {
    return new Promise((resolve, reject) => {
        // The file decoder emits each record as a data event on a stream.
        // Collect the records into an array and return them at the end.
        const records = [];
        avro.createFileDecoder(filePath)
            .on('data', record => { records.push(record); })
            .on('end', () => resolve(records))
            .on('error', reject);
    });
}
```

#### Parse a devices Avro file

```javascript
const avro = require('avsc');

// Read the Avro file. Parse the device and template identification
// information and the fanSpeed setting for each device record.
async function parse(filePath) {
    const records = await load(filePath);
    for (const record of records) {
        // Fetch the device ID from the deviceId property.
        const deviceId = record.deviceId;

        // Fetch the template ID and version from the deviceTemplate property.
        const deviceTemplateId = record.deviceTemplate.id;
        const deviceTemplateVersion = record.deviceTemplate.version;

        // Get the fanSpeed from the nested device settings property.
        const fanSpeed = record.settings.device.fanSpeed;

        // Log the retrieved device ID and humidity.
        console.log(`deviceID: ${deviceId}, Template ID: ${deviceTemplateId}, Template Version: ${deviceTemplateVersion}, Fan Speed: ${fanSpeed}`);
    }
}

function load(filePath) {
    return new Promise((resolve, reject) => {
        // The file decoder emits each record as a data event on a stream.
        // Collect the records into an array and return them at the end.
        const records = [];
        avro.createFileDecoder(filePath)
            .on('data', record => { records.push(record); })
            .on('end', () => resolve(records))
            .on('error', reject);
    });
}
```

#### Parse a device templates Avro file

```javascript
const avro = require('avsc');

// Read the Avro file. Parse the device and template identification
// information and the fanSpeed setting for each device record.
async function parse(filePath) {
    const records = await load(filePath);
    for (const record of records) {
        // Fetch the template ID and version from the id and version properties.
        const templateId = record.id;
        const templateVersion = record.version;

        // Get the fanSpeed from the nested device settings property.
        const fanSpeed = record.settings.device.fanSpeed;

        // Log the retrieved device id and humidity.
        console.log(`Template ID: ${templateId}, Template Version: ${templateVersion}, Fan Speed: ${fanSpeed}`);
    }
}

function load(filePath) {
    return new Promise((resolve, reject) => {
        // The file decoder emits each record as a data event on a stream.
        // Collect the records into an array and return them at the end.
        const records = [];
        avro.createFileDecoder(filePath)
            .on('data', record => { records.push(record); })
            .on('end', () => resolve(records))
            .on('error', reject);
    });
}
```

## Next steps

Now that you know how to export your data, continue to the next step:

> [!div class="nextstepaction"]
> [How to visualize your data in Power BI](howto-connect-powerbi.md)
