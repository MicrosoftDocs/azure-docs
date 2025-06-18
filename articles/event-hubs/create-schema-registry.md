---
title: 'Quickstart: Create an Azure Event Hubs Schema Registry'
description: Azure Schema Registry provides a central repository for schemas for event-driven and messaging-centric apps. Learn how to create a schema registry.
ms.topic: quickstart
ms.date: 06/16/2025
ms.custom: references_regions, mode-other
#customer intent: As a developer, I want to learn how to implement Azure Schema Registry as a central repository to support event-driven and messaging-centric applications.

---

# Quickstart: Create an Azure Event Hubs schema registry using Azure portal

In this quickstart, you create a schema group with schemas in a schema registry hosted by Azure Event Hubs.

*Azure Schema Registry* is a feature of Event Hubs. It provides a central repository for schemas for event-driven and messaging-centric applications. It provides the flexibility for your producer and consumer applications to *exchange data without having to manage and share the schema*. It also provides a simple governance framework for reusable schemas and defines relationship between schemas through a grouping construct (schema groups). For more information, see [Azure Schema Registry in Event Hubs](schema-registry-overview.md).


> [!NOTE]
> - The feature isn't available in the **Basic** tier.
> - Make sure that you're a member of one of these roles: **Owner**, **Contributor**, or **Schema Registry Contributor**. For more information, see [Azure role-based access control](schema-registry-concepts.md#azure-role-based-access-control).
> - If the event hub is in a *virtual network*, you can't create schemas in the Azure portal unless you access the portal from a virtual machine in the same virtual network. 

## Prerequisites

[Create an Event Hubs namespace](event-hubs-create.md#create-an-event-hubs-namespace). You can instead use an existing namespace. 

## Create a schema group

1. Navigate to the **Event Hubs Namespace** page.
1. In the left menu, expand **Entities** and select **Schema Registry**.
1. To create a schema group, select **+ Schema Group**.

   :::image type="content" source="./media/create-schema-registry/namespace-page.png" alt-text="Screenshot showing the Schema Registry page in the Azure portal" lightbox="./media/create-schema-registry/namespace-page.png":::

1. On the **Create Schema Group** page, do these steps:

   1. Enter a **name** for the schema group.
   1. For **Serialization type**, select **Avro** serialization format. This format applies to all schemas in the schema group. **JSON** serialization format is also supported (preview).
   1. Select a **compatibility mode** for all schemas in the group. For **Avro**, forward and backward compatibility modes are supported.
   1. Select **Create** to create the schema group. 

      :::image type="content" source="./media/create-schema-registry/create-schema-group-page.png" alt-text="Screenshot showing the page for creating a schema group.":::

1. Select the name of the schema group in the list of schema groups.

   :::image type="content" source="./media/create-schema-registry/select-schema-group.png" alt-text="Screenshot showing schema group in the list selected." lightbox="./media/create-schema-registry/select-schema-group.png":::

1. You see the **Schema Group** page for the group.

   :::image type="content" source="./media/create-schema-registry/schema-group-page.png" alt-text="Screenshot showing the Schema Group page." lightbox="./media/create-schema-registry/schema-group-page.png":::


## Add a schema to the schema group

In this section, you add a schema to the schema group using the Azure portal. 

1. On the **Schema Group** page, select **+ Schema** on the toolbar. 
1. On the **Create Schema** page, do these steps:

    1. For **Name**, enter `orderschema`.
    1. Enter the following **schema** into the text box. You can instead select a file with the schema.
    
        ```json
        {
          "namespace": "com.azure.schemaregistry.samples",
          "type": "record",
          "name": "Order",
          "fields": [
            {
              "name": "id",
              "type": "string"
            },
            {
              "name": "amount",
              "type": "double"
            }
          ]
        }
        ```
    1. Select **Create**.

1. Select the **schema** from the list of schemas. 

    :::image type="content" source="./media/create-schema-registry/select-schema.png" alt-text="Screenshot showing the schema selected.":::

1. You see the **Schema Overview** page for the schema. 

    :::image type="content" source="./media/create-schema-registry/schema-overview-page.png" alt-text="Image showing the Schema Overview page." lightbox="./media/create-schema-registry/schema-overview-page.png":::

1. If there are multiple versions of a schema, you see them in the **Versions**. Select a version to switch to that version schema. 

## Create a new version of schema

1. Update the schema in the text box, and select **Validate**. In the following example, you add a new field called `description` to the schema.

   :::image type="content" source="./media/create-schema-registry/update-schema.png" alt-text="Screenshot showing the Update schema page" lightbox="./media/create-schema-registry/update-schema.png":::

1. Review validation status and changes, and select **Save**. 

   :::image type="content" source="./media/create-schema-registry/compare-save-schema.png" alt-text="Screenshot showing the Review page that shows validation status, changes, and save." lightbox="./media/create-schema-registry/compare-save-schema.png":::

   You see that `2` is selected for the **version** on the **Schema Overview** page. 

   :::image type="content" source="./media/create-schema-registry/new-version.png" alt-text="Screenshot showing the new version of schema." lightbox="./media/create-schema-registry/new-version.png":::    

1. Select `1` to see the version 1 of the schema. 

## Clean up resources

> [!NOTE]
> Don't clean up resources if you want to continue to the next quickstart linked from **Next step**. 

1. Navigate to the **Event Hubs Namespace** page.
1. Select **Schema Registry** on the left menu.
1. Select the **schema group** you created in this quickstart.
1. On the **Schema Group** page, select **Delete** on the toolbar.
1. On the **Delete Schema Group** page, type the name of the schema group, and select **Delete**.

## Next step

> [!div class="nextstepaction"]
> [Validate schema when sending and receiving events - AMQP and .NET](schema-registry-dotnet-send-receive-quickstart.md).
