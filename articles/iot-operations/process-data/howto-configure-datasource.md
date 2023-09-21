---
title: Configure a pipeline data source stage
description: Configure a pipeline data source stage to read messages from an Azure IoT Operations MQ for processing.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: how-to
ms.date: 09/19/2023

#CustomerIntent: As an operator, I want to configure an Azure IoT Data Processor pipeline data source stage so that I can read messages from Azure IoT Operations MQ for processing.
---

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.

This template provides the basic structure of a How-to article pattern. See the
[instructions - How-to](../level4/article-how-to-guide.md) in the pattern library.

You can provide feedback about this template at: https://aka.ms/patterns-feedback

How-to is a procedure-based article pattern that show the user how to complete a task in their own environment. A task is a work activity that has a definite beginning and ending, is observable, consist of two or more definite steps, and leads to a product, service, or decision.

-->

<!-- 1. H1 -----------------------------------------------------------------------------

Required: Use a "<verb> * <noun>" format for your H1. Pick an H1 that clearly conveys the task the user will complete.

For example: "Migrate data from regular tables to ledger tables" or "Create a new Azure SQL Database".

* Include only a single H1 in the article.
* Don't start with a gerund.
* Don't include "Tutorial" in the H1.

-->

# Configure a pipeline data source stage



<!-- 2. Introductory paragraph ----------------------------------------------------------

Required: Lead with a light intro that describes, in customer-friendly language, what the customer will do. Answer the fundamental “why would I want to do this?” question. Keep it short.

Readers should have a clear idea of what they will do in this article after reading the introduction.

* Introduction immediately follows the H1 text.
* Introduction section should be between 1-3 paragraphs.
* Don't use a bulleted list of article H2 sections.

Example: In this article, you will migrate your user databases from IBM Db2 to SQL Server by using SQL Server Migration Assistant (SSMA) for Db2.

-->

The source stage is the first and required stage in a data processor pipeline. The source stage gets data into the data processing pipeline and prepares it for further processing. In the source stage, you define connection details to the data source and establish a partitioning configuration based on your specific data processing requirements. This stage helps you get data into the pipeline and prepare it for further processing.

<!---Avoid notes, tips, and important boxes. Readers tend to skip over them. Better to put that info directly into the article text.

-->

<!-- 3. Prerequisites --------------------------------------------------------------------

Required: Make Prerequisites the first H2 after the H1. 

* Provide a bulleted list of items that the user needs.
* Omit any preliminary text to the list.
* If there aren't any prerequisites, list "None" in plain text, not as a bulleted item.

-->

## Prerequisites

- A functioning instance of Data Processor is deployed.
- An instance of the Operations MQ broker is operational with all necessary raw data available.
- Basic knowledge of Operations MQ and the corresponding MQTT topic structure.

<!-- 4. Task H2s ------------------------------------------------------------------------------

Required: Multiple procedures should be organized in H2 level sections. A section contains a major grouping of steps that help users complete a task. Each section is represented as an H2 in the article.

For portal-based procedures, minimize bullets and numbering.

* Each H2 should be a major step in the task.
* Phrase each H2 title as "<verb> * <noun>" to describe what they'll do in the step.
* Don't start with a gerund.
* Don't number the H2s.
* Begin each H2 with a brief explanation for context.
* Provide a ordered list of procedural steps.
* Provide a code block, diagram, or screenshot if appropriate
* An image, code block, or other graphical element comes after numbered step it illustrates.
* If necessary, optional groups of steps can be added into a section.
* If necessary, alternative groups of steps can be added into a section.

-->

## Configure the data source

To configure the data source:

- Provide connection details to the data source. This configuration includes the type of the data source, the MQTT broker URL, the Quality of Service (QoS) level, the session type, and the topics to subscribe to.

- Specify the authentication method. Currently limited to username/password-based authentication.

The following table describes the data source configuration parameters:

| Field | Description | Required | Default | Example |
|----|---|---|---|---|
| Name | A customer-visible name for the source stage. | Required | NA | `asset-1broker` |
| Description | A customer-visible description of the source stage. | Optional | NA | `brokerforasset-1`|
| Broker | The URL of the MQTT broker | Required | NA | `mqtt://127.0.0.1:1883` |
| Authentication | Authentication method to subscribe to E4K topics | Optional | Username Password | Username Password |
| Username | The username for the username/password authentication | Optional | NA | `username` |
| Password | The password for the username/password authentication | Optional | NA | `password` |
| QoS | QoS level for message delivery. | Required | 1 | 0 |
| Clean session (Non-persistent)| Parameter to establish a persistent session with the E4K broker. | Required | `FALSE` | `FALSE` |
| Topics | The topics to subscribe to for data acquisition. | Required | NA | `contoso/site1/asset1`, `contoso/site1/asset2` |

> [!NOTE]
> For a persistent session `Clean Session` must be `FALSE`. The current release of data processor supports persistent sessions with the MQTT broker.

The data processor doesn't reorder out-of-order data coming from the Operations MQ broker. If the data is received out of order from the broker, it remains so in the pipeline.

## Select the data format

In a Data Processor pipeline, the [format](concept-supported-formats.md) field in the source stage specifies how to deserialize the incoming data. By default, the data processor uses the `raw` format that means it doesn't convert the incoming data. You can choose to deserialize your incoming data from `JSON`, `jsonStream`, `MessagePack`, `CBOR`, `CSV`, or `Protobuf` formats into a Data Processor readable message in order to use the full data processor functionality.

The following tables describe the different deserialization configuration options:

Pass through. Don't deserialize the incoming message:

| Field | Description | Required | Default | Value |
|---|---|---|---|---|
| Data Format | The type of the data format. | Yes | `Raw` | `Raw` `JSON` `jsonStream` `MessagePack` `CBOR` `CSV` `Protobuf` |

> [!IMPORTANT]
> Data Processor features are severely constrained if you don't deserialize the data. For example, you can't use the `Filter` stage or the `Enrich` stage.

The `Data Format` field is mandatory and its value determines the other required fields.

To deserialize CSV messages, you also need to specify the following fields:

| Field | Description | Required | Value | Example |
|----|---|---|---|---|
| Header | Whether the CSV data includes a header line. | Yes | `Yes` `No` | `No` |
| Name | Name of the column in CSV | Yes | - | `temp`, `asset` |
| Path | The [jq path](concept-jq-path.md) in the message where the column information is added. | No | - | The default jq path is the column name |
| Data Type | The data type of the data in the column and how it's represented inside the data processor. | No | `String`, `Float`, `Integer`, `Boolean`, `Bytes` | Default: `String` |

To deserialize Protobuf messages, you also need to specify the following fields:

| Field | Description | Required | Value | Example |
|---|---|---|---|---|
| Descriptor | The base64-encoded descriptor for the protobuf definition. | Yes | - | `Zhf...` |
| Message | The name of the message type that's used to format the data. | Yes | - | `pipeline` |
| Package | The name of the package in the descriptor where the type is defined. | Yes | - | `schedulerv1` |

> [!NOTE]
> Data Processor supports only one message type in each **.proto** file.

> [!TIP]
> The `Data Format` field is mandatory in each case and its value determines the other required fields.

## Configure partitioning

To define your partitioning configuration, specify the number of partitions for parallelism and higher throughput and the partitioning strategy based on a unique partition key or partition ID:


TODO: Add introduction sentence(s)
[Include a sentence or two to explain only what is needed to complete the procedure.]
TODO: Add ordered list of procedure steps
1. Step 1
1. Step 2
1. Step 3

## "\<verb\> * \<noun\>"
TODO: Add introduction sentence(s)
[Include a sentence or two to explain only what is needed to complete the procedure.]
TODO: Add ordered list of procedure steps
1. Step 1
1. Step 2
1. Step 3

<!-- 5. Next step/Related content------------------------------------------------------------------------

Optional: You have two options for manually curated links in this pattern: Next step and Related content. You don't have to use either, but don't use both.
  - For Next step, provide one link to the next step in a sequence. Use the blue box format
  - For Related content provide 1-3 links. Include some context so the customer can determine why they would click the link. Add a context sentence for the following links.

-->

## Next step

TODO: Add your next step link(s)

> [!div class="nextstepaction"]
> [Write concepts](article-concept.md)

<!-- OR -->

## Related content

TODO: Add your next step link(s)

- [Write concepts](article-concept.md)

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.
-->

