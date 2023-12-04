---
title: Configure a reference dataset
description: The reference datasets within the Data Processor store reference data that other pipelines can use for enrichment and contextualization.
author: dominicbetts
# ms.subservice: data-processor
ms.author: dobett
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 09/21/2023

#CustomerIntent: As an operator, I want to configure a reference dataset so that I can use the reference data to enrich and contextualize the messages in my pipeline.
---

# Configure a reference dataset

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Reference datasets within the Azure IoT Data Processor (preview) store reference data that pipelines can use for enrichment and contextualization. The data inside the reference data store is organized into datasets, each with multiple keys.

## Prerequisites

- A functioning instance of Data Processor.
- A Data Processor pipeline with an input stage that deserializes incoming data.

## Configure a reference data store

To add a dataset to the data store, you have two options:

- Select the **Reference datasets** tab on the pipeline configuration page.
- Select **Create new** when the destination type is selected as **Reference datasets** in the output stage of a pipeline.

| Field | Description | Required | Example |
|---|---|---|---|
| Name | Name of the dataset. | Yes | `mes-sql` |
| Description | Description of the dataset. | No | `erp data` |
| Payload| [Path](concept-jq-path.md) to data within the message to store in the dataset | No | `.payload` |
| Expiration time | Time validity for the reference data applied to each ingested message. | No | `12h` |
| Timestamp | The [jq path](concept-jq-path.md) is for the timestamp field in the reference data. This field is used for timestamp-based joins in the enrich stage. | No | `.payload.saptimestamp` |
| Keys | See keys configuration in the following table. |  |  |

Timestamps referenced should be in RFC3339, ISO 8601, or Unix timestamp format.
By default, the Expiration time for a dataset is set to `12h`. This default ensures that no stale data is enriched beyond 12 hours (if the data is not updated) or grow unbounded which can fill up the disk. 

Each key includes:

| Field | Description | Required | Selection | Example |
|---|---|---|---|---|
| Property name | Name of the key. This key is used for name-based joins in the enrich stage. | No | None | `assetSQL` |
| Property path | [jq path](concept-jq-path.md) to the key within the message | No | None | `.payload.unique_id` |
| Primary key | Determines whether the property is a primary key. Used for updating or appending ingested data into a dataset. | No | `Yes`/`No` | `Yes` |

Keys in the dataset aren't required but are recommended for keeping the dataset up to date.

> [!IMPORTANT]
> Remember that `.payload` is automatically appended to the [jq path](concept-jq-path.md). Reference data only stores the data within the `.payload` object of the message. Specify the path excluding the `.payload` prefix.

> [!TIP]
> It takes a few seconds to deploy the dataset to your cluster and become visible in the dataset list view.

The following notes relate to the dataset configuration options in the previous tables:

- Property names are case sensitive.
- You can have up to 10 properties per dataset.
- Only one primary key can be selected in each dataset.
- String is the only valid data type for the dataset key values.
- Primary keys are used to update or append ingested data into a dataset. If a new message comes in with the same primary key, the previous entry is updated. If a new value comes in for the primary key, that new key and the associated value are appended to the dataset
- The timestamp in the reference dataset is used for timestamp-based join conditions in the enrich stage.
- You can use the transform stage to transfer data into the payload object as reference datasets store only the data within the `.payload` object of the message and exclude the associated metadata.

## View your datasets

To view the available datasets:

1. Select **Reference datasets** in the pipeline editor experience. A list of all available datasets is visible in the **Reference datasets** view.
1. Select a dataset to view its configuration details, including dataset keys and timestamps.

## Example

This example describes a manufacturing facility where several pieces of equipment are installed at different locations. An ERP system tracks the installations, stores the data in database, and records the following details for each piece of equipment: name, location, installation date, and a boolean that indicates whether it's a spare. For example:

| equipment | location | installationDate | isSpare |
|---|---|---|---|
| Oven | Seattle | 3/5/2002 | FALSE |
| Mixer | Tacoma | 11/15/2005 | FALSE |
| Slicer | Seattle | 4/25/2021 | TRUE |

This ERP data is a useful source of contextual data for the time series data that comes from each location. You can send this data to Data Processor to store in a reference dataset and use it to enrich messages in other pipelines.

When you send data from a database, such as Microsoft SQL server, to Data Processor, it deserializes it into a format that it can process. The following JSON shows an example payload that represents the data from a database within Data Processor:

```json
{
    "payload": { 
        { 
            "equipment": "Oven", 
            "location": "Seattle", 
            "installationDate": "2002-03-05T00:00:00Z", 
            "isSpare": "FALSE" 
        }, 
        { 
            "equipment": "Mixer", 
            "location": "Tacoma", 
            "installationDate": "2005-11-15T00:00:00Z", 
            "isSpare": "FALSE"
        }, 
        { 
            "equipment": "Slicer", 
            "location": "Seattle", 
            "installationDate": "2021-04-25T00:00:00Z", 
            "isSpare": "TRUE"
        } 
    }
} 
```

Use the following configuration for the reference dataset:

| Field | Example |
|---|---|
| Name | `equipment` |
| Timestamp | `.installationDate` |
| Expiration time| `12h` |

The two keys:

| Field | Example |
|---|---|
| Property name | `asset` |
| Property path | `.equipment` |
| Primary key | Yes |

| Field | Example |
|---|---|
| Property name | `location` |
| Property path | `.location` |
| Primary key | No |

Each dataset can only have one primary key.

All incoming data within the pipeline is stored in the `equipment` dataset in the reference data store. The stored data includes the `installationDate` timestamp and keys such as `equipment` and `location`.

These properties are available in the enrichment stages of other pipelines where you can use them to provide context and add additional information to the messages being processed. For example, you can use this data to supplement sensor readings from a specific piece of equipment with its installation date and location. To learn more, see the [Enrich](howto-configure-enrich-stage.md) stage.

Within the `equipment` dataset, the `asset` key serves as the primary key. When th pipeline ingests new data, Data Processor checks this property to determine how to handle the incoming data:

- If a message arrives with an `asset` key that doesn't yet exist in the dataset (such as `Pump`), Data Processor adds a new entry to the dataset. This entry includes the new `asset` type and its associated data such as `location`, `installationDate`, and `isSpare`.
- If a message arrives with an `asset` key that matches an existing entry in the dataset (such as `Slicer`), Data Processor updates that entry. The associated data for that equipment such as `location`, `installationDate`, and `isSpare` updates with the values from the incoming message.

The `equipment` dataset in the reference data store is an up-to-date source of information that can enhance and contextualize the data flowing through other pipelines in Data Processor using the `Enrich` stage.

## Related content

- [What is contextualization?](concept-contextualization.md)
- [Send data to the reference data store](howto-configure-destination-reference-store.md)
- [Enrich data in a pipeline](howto-configure-enrich-stage.md)
- [Use last known values in a pipeline](howto-configure-lkv-stage.md)
