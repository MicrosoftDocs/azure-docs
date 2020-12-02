---
title: Create an Azure Event Hubs schema registry
description: This article shows you how to create a schema registry in an Azure Event Hubs namespace. 
ms.topic: how-to
ms.date: 09/22/2020
ms.custom: references_regions
---

# Create an Azure Event Hubs schema registry (preview)
This article shows you how to create a schema group with schemas in a schema registry hosted by Azure Event Hubs. For an overview of the Schema Registry feature of Azure Event Hubs, see [Azure Schema Registry in Event Hubs](schema-registry-overview.md).

> [!NOTE]
> - The **Schema Registry** feature is currently in **preview**, and is not recommended for production workloads.
> - The feature is available only in **standard** and **dedicated** tiers, not in the **basic** tier.

## Prerequisites
[Create an Event Hubs namespace](event-hubs-create.md#create-an-event-hubs-namespace). You can also use an existing namespace. 

## Create a schema group
1. Navigate to the **Event Hubs Namespace** page. 
1. Select **Schema Registry** on the left menu. To create a schema group, select **+ Schema Group** on the toolbar. 

    :::image type="content" source="./media/create-schema-registry/namespace-page.png" alt-text="Schema Registry page":::
1. On the **Create Schema Group** page, do these steps:
    1. Enter a **name** for the schema group.
    1. For **Serialization type**, pick a serialization format that applies to all schemas in the schema group. Currently, **Avro** is the only type supported, so select **Avro**. 
    1. Select a **compatibility mode** for all schemas in the group. For **Avro**, forward and backward compatibility modes are supported. 
    1. Then, select **Create** to create the schema group. 
1. Select the name of the **schema group** in the list of schema groups.

    :::image type="content" source="./media/create-schema-registry/select-schema-group.png" alt-text="Select your schema group in the list":::    
1. You see the **Schema Group** page for the group.

    :::image type="content" source="./media/create-schema-registry/schema-group-page.png" alt-text="Schema Group page":::
    

## Add a schema to the schema group
In this section, you add a schema to the schema group using the Azure portal. 

1. On the **Schema Group** page, select **+ Schema** on the toolbar. 
1. On the **Create Schema** page, do these steps:
    1. Enter a **name** for the schema.
    1. Enter the following **schema** into the text box. You can also select file with the schema.
    
        ```json
        {
            "type": "record",
            "name": "AvroUser",
            "namespace": "com.azure.schemaregistry.samples",
            "fields": [
                {
                    "name": "name",
                    "type": "string"
                },
                {
                    "name": "favoriteNumber",
                    "type": "int"
                }
            ]
        }
        ```
    1. Select **Create**. 
1. Select the **schema** from the list of schemas. 

    :::image type="content" source="./media/create-schema-registry/select-schema.png" alt-text="Select schema":::
1. You see the **Schema Overview** page for the schema. 

    :::image type="content" source="./media/create-schema-registry/schema-overview-page.png" alt-text="Schema Overview page":::    
1. If there are multiple versions of a schema, you see them in the **Versions** drop-down list. Select a version to switch to that version schema. 

## Create a new version of schema

1. Update the schema in the text box, and select **Validate**. In the following example, a new field `id` has been added to the schema. 

    :::image type="content" source="./media/create-schema-registry/update-schema.png" alt-text="Update schema":::    
    
1. Review validation status and changes, and select **Save**. 

    :::image type="content" source="./media/create-schema-registry/compare-save-schema.png" alt-text="Review validation status, changes, and save":::     
1. You see that `2` is selected for the **version** on the **Schema Overview** page. 

    :::image type="content" source="./media/create-schema-registry/new-version.png" alt-text="New version of schema":::    
1. Select `1` to see the version 1 fo the schema. 

    :::image type="content" source="./media/create-schema-registry/select-version.png" alt-text="Select version":::    


## Next steps
For more information about schema registry, see [Azure Schema Registry in Event Hubs](schema-registry-overview.md).

