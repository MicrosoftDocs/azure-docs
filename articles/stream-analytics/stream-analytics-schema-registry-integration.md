---
title: Azure Stream Analytics - Schema Registry
description: This article describes how to add Azure Event Hub Schema Registry and connect with Event Hub inputs
author: an-emma    
ms.author: raan
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 05/08/2023
ms.custom: seodec18
---

# Integrating with Schema Registry in Azure Stream Analytics (Public Preview)

Azure Event Hubs hosts a ![Schema Registry](articles/event-hubs/schema-registry-overview.md) that acts as a centralized repository for schema. With the integration with the Schema Registry, Azure Stream Analytics can retrieve schema from the Schema Registry and deserialize data from Event Hub input. By moving schema metadata into the Schema Registry, you can reduces per-message overhead and enables efficient schema validation to ensure the integrity of the data.

This article shows you how to add the Schema Registry to your Stream Analytics job, and connect with the Event Hub input.

## Prerequisites

Before you start, make sure you have the following:

* An ![Event Hub namespace](articles/event-hubs/event-hubs-create.md).
* A Schema Group with schemas in a Schema Registry hosted by Azure Event Hubs. ![Create an Azure Event Hub Schema Registry](articles/event-hubs/create-schema-registry.md) if you don't have one.
* An ![Azure Stream Analytics job](articles/stream-analytics/stream-analytics-quick-create-portal.md) with ![managed identity](stream-analytics-managed-identities-overview.md) enabled.

## Manage the job access to the Schema Registry

To access the Event Hub Schema Registry, you need to assign ![Schema Registry Reader](articles/event-hubs/schema-registry-concepts.md) role to your Stream Analytics job using security principal.

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to your Stream Analytics job page.
2. Select **Managed Identity** page, and save the **Principal name** for later use. See ![Managed Identities](stream-analytics-managed-identities-overview.md) for more details.
![get principal name](.media/stream-analytics-schema-registry-integration/get-principal-name.png)
3. Go to your Event Hub namespace page that the Schema Registry is hosted. Select **Access Control** and **Add role assignment**.
![Event Hub access control](.media/stream-analytics-schema-registry-integration/event-hub-access-control.png)
4. Search for **Schema Registry Reader** and click **Next**.
![add role assignment](.media/stream-analytics-schema-registry-integration/add-role-assignment.png)
5. At **Members** page, select the **Principal name** you saved from step 1 and click on **Review + assign**.

## Add Schema Registry to the Stream Analytics job

1. On the Stream Analytics job portal, select **Schema Registry** under **Settings** on the left menu.
2. Select **Add Schema Registry**
3. On the **New Schema Registry** page, follow the steps below:
    1. For **Name**, enter the alias name for this Schema Registry,
    2. For **Subscription**, select the subscription that has the Event Hub namespace, hosting the Schema Registry.
    3. For **Event Hub namespace**, select the namespace that the Schema Registry is under.
    4. If you do not have access to the subscription, you can also use **manual entry**.
    ![Add new Schema Registry](./media/stream-analytics-schema-registry-integration/add-new-schema-registry.png)

## Configure the Event Hub input

> [!IMPORTANT]
> Schema formats are used to determine the manner in which a schema is structured and defined. Only AVRO format is supported now. 

1. Navigate to the Inputs page. Add a new Event Hub input or choose an existing Event Hub input.
2. To connect the Schema Registry to the selected Event Hub, scroll down to the bottom of the configuration page.
3. Select **AVRO** for **Event Serialization format**.
4. Select the Schema Registry from the drop-down menu and **Save**.
![Event Hub configuration](.media/stream-analytics-schema-registry-integration/event-hub-configuration.png)

## Preview the input data

Azure Stream Analytics automatically fetch events from the streaming inputs. It provides a convenient way to test the Schema Registry integration without starting an stopping your job.

1. On the Stream Analytics job page, select **Job Topology -> Query** to open the Query editor window.
2. Select the configured Event Hub input. Make sure there is a file icon next to the selected input.
3. The sample events will automatically appear in the **input preview**.
![Preview input](.media/stream-analytics-schema-registry-integration/input-preview.png)

See ![Test an Azure Stream Analytics job with sample data](articles/stream-analytics/stream-analytics-test-query.md) for more information about query testing.

## Limitations

1. The authentication method of the Schema Registry only supports Managed Identity. The authentication method of the Event Hub input must be Managed Identity when the Schema Registry is selected.
2. Test connection feature is not yet available for Schema Registry. After adding a new Schema Registry, the best way to verify the connection is through input preview on query testing page. 

## Next steps

* [Process data from your Event Hub using Azure Stream Analytics](articles/event-hubs/process-data-azure-stream-analytics.md)
* [Test your Azure Stream Analytics job with sample data](articles/stream-analytics/stream-analytics-test-query.md)
