---
title: Built-in connector overview
description: Learn about connectors that run natively with the runtime in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.custom: engagement-fy23
ms.date: 04/15/2024
---

# Built-in connectors in Azure Logic Apps

Built-in connectors provide ways for you to control your workflow's schedule and structure, run your own code, manage or manipulate data, and complete other tasks in your workflows. Different from managed connectors, some built-in connectors aren't tied to a specific service, system, or protocol. For example, you can start almost any workflow on a schedule by using the Recurrence trigger. Or, you can have your workflow wait until called by using the Request trigger. All built-in connectors run natively on the Azure Logic Apps runtime. Some don't require that you create a connection before you use them.

For a smaller number of services, systems, and protocols, Azure Logic Apps provides a built-in version alongside the managed version. The number and range of built-in connectors vary based on whether you create a Consumption logic app workflow that runs in multitenant Azure Logic Apps or a Standard logic app workflow that runs in single-tenant Azure Logic Apps. In most cases, the built-in version provides better performance, capabilities, pricing, and so on. In a few cases, some built-in connectors are available only in one logic app workflow type and not the other.

For example, a Standard workflow can use both managed connectors and built-in connectors for Azure Blob Storage, Azure Cosmos DB, Azure Event Hubs, Azure Service Bus, FTP, IBM DB2, IBM MQ, SFTP, and SQL Server. A Consumption workflow doesn't have the built-in versions. A Consumption workflow can use built-in connectors for Azure API Management, and Azure App Services, while a Standard workflow doesn't have these built-in connectors.

Also, in Standard workflows, some [built-in connectors with specific attributes are informally known as *service providers*](../logic-apps/custom-connector-overview.md#service-provider-interface-implementation). Some built-in connectors support only a single way to authenticate a connection to the underlying service. Other built-in connectors can offer a choice, such as using a connection string, Microsoft Entra ID, or a managed identity. All built-in connectors run in the same process as the Azure Logic Apps runtime. For more information, review [Single-tenant versus multitenant and integration service environment (ISE)](../logic-apps/single-tenant-overview-compare.md).

This article provides a general overview about built-in connectors in Consumption workflows versus Standard workflows.

<a name="built-in-connectors"></a>

## Built-in connectors in Consumption versus Standard

The following table lists the current and expanding galleries of built-in connectors available for Consumption versus Standard workflows. For Standard workflows, an asterisk (**\***) marks [built-in connectors based on the *service provider* model](#service-provider-interface-implementation), which is described in more detail later.

| Consumption | Standard |
|-------------|----------|
| Azure API Management<br>Azure App Services <br>Azure Functions <br>Azure Logic Apps <br>Batch <br>Control <br>Data Operations <br>Date Time <br>Flat File <br>HTTP <br>Inline Code <br>Integration Account <br>Liquid <br>Request <br>Schedule <br>Variables <br>XML | AS2 (v2) <br>Azure AI Search* <br>Azure Automation* <br>Azure Blob Storage* <br>Azure Cosmos DB* <br>Azure Event Grid Publisher* <br>Azure Event Hubs* <br>Azure File Storage* <br>Azure Functions <br>Azure Key Vault* <br>Azure OpenAI* <br>Azure Queue Storage* <br>Azure Service Bus* <br>Azure Table Storage* <br>Batch Operations <br>Control <br>Data Mapper Operations <br>Data Operations <br>Date Time <br>EDIFACT <br>File System* <br>Flat File <br>FTP* <br>HTTP <br>IBM 3270* <br>IBM CICS* <br>IBM DB2* <br>IBM Host File* <br>IBM IMS* <br>IBM MQ* <br>Inline Code <br>Integration Account <br>JDBC* <br>Liquid Operations <br>Request <br>RosettaNet <br>SAP* <br>Schedule <br>SFTP* <br>SMTP* <br>SQL Server* <br>SWIFT <br>Variables <br>Workflow Operations <br>X12 <br>XML Operations |

<a name="service-provider-interface-implementation"></a>

## Service provider-based built-in connectors

In Standard workflows, a built-in connector that has the following attributes is informally known as a *service provider*:

* Is based on the [Azure Functions extensibility model](../azure-functions/functions-bindings-register.md).

* Provides access from a Standard workflow to a service, such as Azure Blob Storage, Azure Service Bus, Azure Event Hubs, SFTP, and SQL Server.

  Some built-in connectors support only a single way to authenticate a connection to the underlying service. Other built-in connectors can offer a choice, such as using a connection string, Microsoft Entra ID, or a managed identity.

* Runs in the same process as the redesigned Azure Logic Apps runtime.

Service provider-based built-in connectors are available alongside their [managed connector versions](managed.md).

In contrast, a built-in connector that's *not a service provider* has the following attributes:

* Isn't based on the Azure Functions extensibility model.

* Is directly implemented as a job within the Azure Logic Apps runtime, such as Schedule, HTTP, Request, and XML operations.

<a name="custom-built-in"></a>

## Custom built-in connectors

For Standard workflows, you can create your own built-in connector with the same [built-in connector extensibility model](../logic-apps/custom-connector-overview.md#built-in-connector-extensibility-model) that's used by service provider-based built-in connectors, such as Azure Blob Storage, Azure Event Hubs, Azure Service Bus, SQL Server, and more. This interface implementation is based on the [Azure Functions extensibility model](../azure-functions/functions-bindings-register.md) and provides the capability for you to create custom built-in connectors that anyone can use in Standard workflows.

For Consumption workflows, you can't create your own built-in connectors, but you create your own managed connectors.

For more information, review the following documentation:

* [Custom connectors in Azure Logic Apps](../logic-apps/custom-connector-overview.md#custom-connector-standard)
* [Create custom built-in connectors for Standard workflows](../logic-apps/create-custom-built-in-connector-standard.md)

<a name="general-built-in"></a>

## General built-in connectors

You can use the following built-in connectors to perform general tasks, for example:

* Run workflows using custom and advanced schedules. For more information about scheduling, review the [Recurrence behavior for connectors in Azure Logic Apps](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md#recurrence-behavior).

* Organize and control your workflow's structure, for example, using loops and conditions.

* Work with variables, dates, data operations, content transformations, and batch operations.

* Communicate with other endpoints using HTTP triggers and actions.

* Receive and respond to requests.

* Call your own functions (Azure Functions) or other Azure Logic Apps workflows that can receive requests, and so on.

:::row:::
    :::column:::
        [![Schedule icon][schedule-icon]][schedule-doc]
        \
        \
        [**Schedule**][schedule-doc]
        \
        \
        [**Recurrence**][schedule-recurrence-doc]: Trigger a workflow based on the specified recurrence.
        \
        \
        [**Sliding Window**][schedule-sliding-window-doc]<br>(*Consumption workflow only*): <br>Trigger a workflow that needs to handle data in continuous chunks.
        \
        \
        [**Delay**][schedule-delay-doc]: Pause your workflow for the specified duration.
        \
        \
        [**Delay until**][schedule-delay-until-doc]: Pause your workflow until the specified date and time.
    :::column-end:::
    :::column:::
        [![HTTP trigger and action icon][http-icon]][http-doc]
        \
        \
        [**HTTP**][http-doc]
        \
        \
        Call an HTTP or HTTPS endpoint by using either the HTTP trigger or action.
        \
        \
        You can also use these other built-in HTTP triggers and actions:
        - [HTTP + Swagger][http-swagger-doc]
        - [HTTP + Webhook][http-webhook-doc]
    :::column-end:::
    :::column:::
        [![Request trigger icon][http-request-icon]][http-request-doc]
        \
        \
        [**Request**][http-request-doc]
        \
        \
        [**When a HTTP request is received**][http-request-doc]: Wait for a request from another workflow, app, or service. This trigger makes your workflow callable without having to be checked or polled on a schedule.
        \
        \
        [**Response**][http-request-doc]: Respond to a request received by the **When a HTTP request is received** trigger in the same workflow.
    :::column-end:::
    :::column:::
        [![Batch icon][batch-icon]][batch-doc]
        \
        \
        [**Batch**][batch-doc]
        \
        \
        [**Batch messages**][batch-doc]: Trigger a workflow that processes messages in batches.
        \
        \
        [**Send messages to batch**][batch-doc]: Call an existing workflow that currently starts with a **Batch messages** trigger.
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        [![File System icon][file-system-icon]][file-system-doc]
        \
        \
        [**File System**][file-system-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to a file system on your network machine to create and manage files.
    :::column-end:::
    :::column:::
        [![FTP icon][ftp-icon]][ftp-doc]
        \
        \
        [**FTP**][ftp-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to an FTP or FTPS server in your Azure virtual network so that you can work with your files and folders.
    :::column-end:::
    :::column:::
        [![SFTP-SSH icon][sftp-ssh-icon]][sftp-doc]
        \
        \
        [**SFTP**][sftp-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to an SFTP server in your Azure virtual network so that you can work with your files and folders.
    :::column-end:::
    :::column:::
        [![SMTP icon][smtp-icon]][smtp-doc]
        \
        \
        [**SMTP**][smtp-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to an SMTP server so that you can send email.
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

<a name="service-built-in"></a>

## Built-in connectors for specific services and systems

You can use the following built-in connectors to access specific services and systems. In Standard workflows, some of these built-in connectors are also informally known as *service providers*, which can differ from their managed connector counterparts in some ways.

:::row:::
    :::column:::
        [![Azure AI Search icon][azure-ai-search-icon]][azure-ai-search-doc]
        \
        \
        [**Azure AI Search**][azure-ai-search-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to AI Search so that you can perform document indexing and search operations in your workflow.
    :::column-end:::
    :::column:::
        [![Azure API Management icon][azure-api-management-icon]][azure-api-management-doc]
        \
        \
        [**Azure API Management**][azure-api-management-doc]<br>(*Consumption workflow only*)
        \
        \
        Call your own triggers and actions in APIs that you define, manage, and publish using [Azure API Management](../api-management/api-management-key-concepts.md). <br><br>**Note**: Not supported when using [Consumption tier for API Management](../api-management/api-management-features.md).
    :::column-end:::
    :::column:::
        [![Azure App Services icon][azure-app-services-icon]][azure-app-services-doc]
        \
        \
        [**Azure App Services**][azure-app-services-doc]<br>(*Consumption workflow only*)
        \
        \
        Call apps that you create and host on [Azure App Service](../app-service/overview.md), for example, API Apps and Web Apps.
        \
        \
        When Swagger is included, the triggers and actions defined by these apps appear like any other first-class triggers and actions in Azure Logic Apps.
    :::column-end:::
    :::column:::
        [![Azure Automation icon][azure-automation-icon]][azure-automation-doc]
        \
        \
        [**Azure Automation**][azure-automation-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to your Azure Automation accounts so you can create and manage Azure Automation jobs.
    :::column-end:::
    :::column:::
        [![Azure Blob Storage icon][azure-blob-storage-icon]][azure-blob-storage-doc]
        \
        \
        [**Azure Blob Storage**][azure-blob-storage-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to your Azure Blob Storage account so you can create and manage blob content.
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        [![Azure Cosmos DB icon][azure-cosmos-db-icon]][azure-cosmos-db-doc]
        \
        \
        [**Azure Cosmos DB**][azure-cosmos-db-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to Azure Cosmos DB so that you can access and manage Azure Cosmos DB documents.
    :::column-end:::
    :::column:::
        [![Azure Event Grid Publisher icon][azure-event-grid-publisher-icon]][azure-event-grid-publisher-doc]
        \
        \
        [**Azure Event Grid Publisher**][azure-event-grid-publisher-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to Azure Event Grid for event-based programming using pub-sub semantics.
    :::column-end:::
    :::column:::
        [![Azure Event Hubs icon][azure-event-hubs-icon]][azure-event-hubs-doc]
        \
        \
        [**Azure Event Hubs**][azure-event-hubs-doc]<br>(*Standard workflow only*)
        \
        \
        Consume and publish events through an event hub. For example, get output from your workflow with Event Hubs, and then send that output to a real-time analytics provider.
    :::column-end:::
    :::column:::
        [![Azure File Storage icon][azure-file-storage-icon]][azure-file-storage-doc]
        \
        \
        [**Azure File Storage**][azure-file-storage-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to your Azure Storage account so that you can create, update, and manage files.
    :::column-end:::
    :::column:::
        [![Azure Functions icon][azure-functions-icon]][azure-functions-doc]
        \
        \
        [**Azure Functions**][azure-functions-doc]
        \
        \
        Call [Azure-hosted functions](../azure-functions/functions-overview.md) to run your own *code snippets* (C# or Node.js) within your workflow.
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        [![Azure Key Vault icon][azure-key-vault-icon]][azure-key-vault-doc]
        \
        \
        [**Azure Key Vault**][azure-key-vault-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to Azure Key Vault to store, access, and manage secrets.
    :::column-end:::
    :::column:::
        [![Azure Logic Apps icon][azure-logic-apps-icon]][nested-logic-app-doc]
        \
        \
        [**Azure Logic Apps**][nested-logic-app-doc]<br>(*Consumption workflow*) <br><br>-or-<br><br>**Workflow Operations**<br>(*Standard workflow*)
        \
        \
        Call other workflows that start with the Request trigger named **When a HTTP request is received**.
    :::column-end:::
    :::column:::
        [![Azure OpenAI icon][azure-openai-icon]][azure-openai-doc]
        \
        \
        [**Azure OpenAI**][azure-openai-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to Azure OpenAI to perform operations on large language models.
    :::column-end:::
    :::column:::
        [![Azure Service Bus icon][azure-service-bus-icon]][azure-service-bus-doc]
        \
        \
        [**Azure Service Bus**][azure-service-bus-doc]<br>(*Standard workflow only*)
        \
        \
        Manage asynchronous messages, queues, sessions, topics, and topic subscriptions.
    :::column-end:::
    :::column:::
        [![Azure Table Storage icon][azure-table-storage-icon]][azure-table-storage-doc]
        \
        \
        [**Azure Table Storage**][azure-table-storage-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to your Azure Storage account so that you can create, update, query, and manage tables.
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        [![Azure Queue Storage][azure-queue-storage-icon]][azure-queue-storage-doc]
        \
        \
        [**Azure Queue Storage**][azure-queue-storage-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to your Azure Storage account so that you can create, update, and manage queues.
    :::column-end:::
    :::column:::
        [![IBM 3270 icon][ibm-3270-icon]][ibm-3270-doc]
        \
        \
        [**IBM 3270**][ibm-3270-doc]<br>(*Standard workflow only*)
        \
        \
        Call 3270 screen-driven apps on IBM mainframes from your workflow.
    :::column-end:::
    :::column:::
        [![IBM CICS icon][ibm-cics-icon]][ibm-cics-doc]
        \
        \
        [**IBM CICS**][ibm-cics-doc]<br>(*Standard workflow only*)
        \
        \
        Call CICS programs on IBM mainframes from your workflow.
    :::column-end:::
    :::column:::
        [![IBM DB2 icon][ibm-db2-icon]][ibm-db2-doc]
        \
        \
        [**IBM DB2**][ibm-db2-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to IBM DB2 in the cloud or on-premises. Update a row, get a table, and more.
    :::column-end:::
    :::column:::
        [![IBM Host File icon][ibm-host-file-icon]][ibm-host-file-doc]
        \
        \
        [**IBM Host File**][ibm-host-file-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to IBM Host File and generate or parse contents.
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        [![IBM IMS icon][ibm-ims-icon]][ibm-ims-doc]
        \
        \
        [**IBM IMS**][ibm-ims-doc]<br>(*Standard workflow only*)
        \
        \
        Call IMS programs on IBM mainframes from your workflow.
    :::column-end:::
    :::column:::
        [![IBM MQ icon][ibm-mq-icon]][ibm-mq-doc]
        \
        \
        [**IBM MQ**][ibm-mq-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to IBM MQ on-premises or in Azure to send and receive messages.
    :::column-end:::
    :::column:::
        [![JDBC icon][jdbc-icon]][jdbc-doc]
        \
        \
        [**JDBC**][jdbc-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to a relational database using JDBC drivers.
    :::column-end:::
    :::column:::
        [![SAP icon][sap-icon]][sap-doc]
        \
        \
        [**SAP**][sap-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to SAP so you can send or receive messages and invoke actions.
    :::column-end:::
    :::column:::
        [![SQL Server icon][sql-server-icon]][sql-server-doc]
        \
        \
        [**SQL Server**][sql-server-doc]<br>(*Standard workflow only*)
        \
        \
        Connect to your SQL Server on premises or an Azure SQL Database in the cloud so that you can manage records, run stored procedures, or perform queries.
    :::column-end:::
:::row-end:::

## Run code from workflows

Azure Logic Apps provides the following built-in actions for running your own code in your workflow:

:::row:::
    :::column:::
        [![Azure Functions icon][azure-functions-icon]][azure-functions-doc]
        \
        \
        [**Azure Functions**][azure-functions-doc]
        \
        \
        Call [Azure-hosted functions](../azure-functions/functions-overview.md) to run your own *code snippets* (C# or Node.js) within your workflow.
    :::column-end:::
    :::column:::
        [![Inline Code action icon][inline-code-icon]][inline-code-doc]
        \
        \
        [**Inline Code**][inline-code-doc]
        \
        \
        [Add and run inline JavaScript code snippets](../logic-apps/logic-apps-add-run-inline-code.md) from your workflow.
    :::column-end:::
    :::column:::
        [![Local Function Operations icon][local-function-icon]][local-function-doc]
        \
        \
        [**Local Function Operations**][local-function-doc]<br>(Standard workflow only)
        \
        \
        [Create and run .NET Framework code](../logic-apps/create-run-custom-code-functions.md) from your workflow.
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

## Control workflow

Azure Logic Apps provides the following built-in actions for structuring and controlling the actions in your workflow:

:::row:::
    :::column:::
        [![Condition action icon][condition-icon]][condition-doc]
        \
        \
        [**Condition**][condition-doc]
        \
        \
        Evaluate a condition and run different actions based on whether the condition is true or false.
    :::column-end:::
    :::column:::
        [![For Each action icon][for-each-icon]][for-each-doc]
        \
        \
        [**For Each**][for-each-doc]
        \
        \
        Perform the same actions on every item in an array.
    :::column-end:::
    :::column:::
        [![Scope action icon][scope-icon]][scope-doc]
        \
        \
        [**Scope**][scope-doc]
        \
        \
        Group actions into *scopes*, which get their own status after the actions in the scope finish running.
    :::column-end:::
    :::column:::
        [![Switch action icon][switch-icon]][switch-doc]
        \
        \
        [**Switch**][switch-doc]
        \
        \
        Group actions into *cases*, which are assigned unique values except for the default case. Run only that case whose assigned value matches the result from an expression, object, or token. If no matches exist, run the default case.
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        [![Terminate action icon][terminate-icon]][terminate-doc]
        \
        \
        [**Terminate**][terminate-doc]
        \
        \
        Stop an actively running workflow.
    :::column-end:::
    :::column:::
        [![Until action icon][until-icon]][until-doc]
        \
        \
        [**Until**][until-doc]
        \
        \
        Repeat actions until the specified condition is true or some state has changed.
    :::column-end:::
    :::column:::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

## Manage or manipulate data

Azure Logic Apps provides the following built-in actions for working with data outputs and their formats:

:::row:::
    :::column:::
        [![Data Operations icon][data-operations-icon]][data-operations-doc]
        \
        \
        [**Data Operations**][data-operations-doc]
        \
        \
        Perform operations with data.
        \
        \
        **Compose**: Create a single output from multiple inputs with various types.
        \
        \
        **Create CSV table**: Create a comma-separated-value (CSV) table from an array with JSON objects.
        \
        \
        **Create HTML table**: Create an HTML table from an array with JSON objects.
        \
        \
        **Filter array**: Create an array from items in another array that meet your criteria.
        \
        \
        **Join**: Create a string from all items in an array and separate those items with the specified delimiter.
        \
        \
        **Parse JSON**: Create user-friendly tokens from properties and their values in JSON content so that you can use those properties in your workflow.
        \
        \
        **Select**: Create an array with JSON objects by transforming items or values in another array and mapping those items to specified properties.
    :::column-end:::
    :::column:::
        ![Date Time action icon][date-time-icon]
        \
        \
        **Date Time**
        \
        \
        Perform operations with timestamps.
        \
        \
        **Add to time**: Add the specified number of units to a timestamp.
        \
        \
        **Convert time zone**: Convert a timestamp from the source time zone to the target time zone.
        \
        \
        **Current time**: Return the current timestamp as a string.
        \
        \
        **Get future time**: Return the current timestamp plus the specified time units.
        \
        \
        **Get past time**: Return the current timestamp minus the specified time units.
        \
        \
        **Subtract from time**: Subtract a number of time units from a timestamp.
    :::column-end:::
    :::column:::
        [![Variables action icon][variables-icon]][variables-doc]
        \
        \
        [**Variables**][variables-doc]
        \
        \
        Perform operations with variables.
        \
        \
        **Append to array variable**: Insert a value as the last item in an array stored by a variable.
        \
        \
        **Append to string variable**: Insert a value as the last character in a string stored by a variable.
        \
        \
        **Decrement variable**: Decrease a variable by a constant value.
        \
        \
        **Increment variable**: Increase a variable by a constant value.
        \
        \
        **Initialize variable**: Create a variable and declare its data type and initial value.
        \
        \
        **Set variable**: Assign a different value to an existing variable.
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

<a name="b2b-built-in-operations"></a>

## Business-to-business (B2B) built-in operations

Azure Logic Apps supports business-to-business (B2B) communication scenarios through various B2B built-in operations. Based on whether you have a Consumption or Standard workflow and the B2B operations that you want to use, [you might have to create and link an integration account to your logic app resource](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md). You then use this integration account to define your B2B artifacts, such as trading partners, agreements, maps, schemas, certificates, and so on.

* Consumption workflows

  Before you can use any B2B operations in a workflow, [you must create and link an integration account to your logic app resource](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md). After you create your integration account, you must then define your B2B artifacts, such as trading partners, agreements, maps, schemas, certificates, and so on. You can then use the B2B operations to encode and decode messages, transform content, and more.

* Standard workflows

  Some B2B operations require that you [create and link an integration account to your logic app resource](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md). Linking lets you share artifacts across multiple Standard workflows and their child workflows. Based on the B2B operation that you want to use, complete one of the following steps before you use the operation:

  * For operations that require maps or schemas, you can either:

    * Upload these artifacts to your logic app resource using the Azure portal or Visual Studio Code. You can then use these artifacts across all child workflows in the *same* logic app resource. For more information, review [Add schemas to use with workflows in Azure Logic Apps](../logic-apps/logic-apps-enterprise-integration-maps.md?tabs=standard) and [Add schemas to use with workflows in Azure Logic Apps](../logic-apps/logic-apps-enterprise-integration-schemas.md?tabs=standard).

    * [Link your logic app resource to your integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md).

  * For operations that require a connection to your integration account, create the connection when you add the operation to your workflow.

For more information, review the following documentation:

* [Business-to-business (B2B) enterprise integration workflows](../logic-apps/logic-apps-enterprise-integration-overview.md)
* [Create and manage integration accounts for B2B workflows](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md)

:::row:::
    :::column:::
        [![AS2 v2 icon][as2-v2-icon]][as2-doc]
        \
        \
        [**AS2 (v2)**][as2-doc]<br>(*Standard workflow only*)
        \
        \
        Encode and decode messages that use the AS2 protocol.
    :::column-end:::
    :::column:::
        [![EDIFACT icon][edifact-icon]][edifact-doc]
        \
        \
        [**EDIFACT**][edifact-doc]
        \
        \
        Encode and decode messages that use the EDIFACT protocol.
    :::column-end:::
    :::column:::
        [![Flat File icon][flat-file-icon]][flat-file-doc]
        \
        \
        [**Flat File**][flat-file-doc]
        \
        \
        Encode and decode XML messages between trading partners.
    :::column-end:::
    :::column:::
        [![Integration account icon][integration-account-icon]][integration-account-doc]
        \
        \
        [**Integration Account Artifact Lookup**][integration-account-doc]
        \
        \
        Get custom metadata for artifacts, such as trading partners, agreements, schemas, and so on, in your integration account.
    :::column-end:::
    :::column:::
        [![Liquid Operations icon][liquid-icon]][liquid-transform-doc]
        \
        \
        [**Liquid Operations**][liquid-transform-doc]
        \
        \
        Convert the following formats by using Liquid templates: <br><br>- JSON to JSON <br>- JSON to TEXT <br>- XML to JSON <br>- XML to TEXT
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        [![RosettaNet icon][rosettanet-icon]][rosettanet-doc]
        \
        \
        [**RosettaNet**][rosettanet-doc]
        \
        \
        Encode and decode messages that use the RosettaNet protocol.
    :::column-end:::
    :::column:::
        [![SWIFT icon][swift-icon]][swift-doc]
        \
        \
        [**SWIFT**][swift-doc]<br>(*Standard workflow only*)
        \
        \
        Encode and decode Society for Worldwide Interbank Financial Telecommuncation (SIWFT) transactions in flat-file XML message format.
    :::column-end:::
    :::column:::
        [![Transform XML icon][xml-transform-icon]][xml-transform-doc]
        \
        \
        [**Transform XML**][xml-transform-doc]
        \
        \
        Convert the source XML format to another XML format.
    :::column-end:::
    :::column:::
        [![X12 icon][x12-icon]][x12-doc]
        \
        \
        [**X12**][x12-doc]
        \
        \
        Encode and decode messages that use the X12 protocol.
    :::column-end:::
    :::column:::
        [![XML validation icon][xml-validate-icon]][xml-validate-doc]
        \
        \
        [**XML Validation**][xml-validate-doc]
        \
        \
        Validate XML documents against the specified schema.
    :::column-end:::
:::row-end:::

## Next steps

> [!div class="nextstepaction"]
> [Create custom APIs that you can call from Azure Logic Apps](../logic-apps/logic-apps-create-api-app.md)

<!-- Built-in icons -->
[azure-ai-search-icon]: ./media/apis-list/azure-ai-search.png
[azure-api-management-icon]: ./media/apis-list/azure-api-management.png
[azure-app-services-icon]: ./media/apis-list/azure-app-services.png
[azure-automation-icon]: ./media/apis-list/azure-automation.png
[azure-blob-storage-icon]: ./media/apis-list/azure-blob-storage.png
[azure-cosmos-db-icon]: ./media/apis-list/azure-cosmos-db.png
[azure-event-grid-publisher-icon]: ./media/apis-list/azure-event-grid-publisher.png
[azure-event-hubs-icon]: ./media/apis-list/azure-event-hubs.png
[azure-file-storage-icon]: ./media/apis-list/azure-file-storage.png
[azure-functions-icon]: ./media/apis-list/azure-functions.png
[azure-key-vault-icon]: ./media/apis-list/azure-key-vault.png
[azure-logic-apps-icon]: ./media/apis-list/azure-logic-apps.png
[azure-openai-icon]: ./media/apis-list/azure-openai.png
[azure-queue-storage-icon]: ./media/apis-list/azure-queue-storage.png
[azure-service-bus-icon]: ./media/apis-list/azure-service-bus.png
[azure-table-storage-icon]: ./media/apis-list/azure-table-storage.png
[batch-icon]: ./media/apis-list/batch.png
[condition-icon]: ./media/apis-list/condition.png
[data-operations-icon]: ./media/apis-list/data-operations.png
[date-time-icon]: ./media/apis-list/date-time.png
[for-each-icon]: ./media/apis-list/for-each-loop.png
[file-system-icon]: ./media/apis-list/file-system.png
[ftp-icon]: ./media/apis-list/ftp.png
[http-icon]: ./media/apis-list/http.png
[http-request-icon]: ./media/apis-list/request.png
[http-response-icon]: ./media/apis-list/response.png
[http-swagger-icon]: ./media/apis-list/http-swagger.png
[http-webhook-icon]: ./media/apis-list/http-webhook.png
[ibm-3270-icon]: ./media/apis-list/ibm-3270.png
[ibm-cics-icon]: ./media/apis-list/ibm-cics.png
[ibm-db2-icon]: ./media/apis-list/ibm-db2.png
[ibm-host-file-icon]: ./media/apis-list/ibm-host-file.png
[ibm-ims-icon]: ./media/apis-list/ibm-ims.png
[ibm-mq-icon]: ./media/apis-list/ibm-mq.png
[inline-code-icon]: ./media/apis-list/inline-code.png
[jdbc-icon]: ./media/apis-list/jdbc.png
[local-function-icon]: ./media/apis-list/local-function.png
[sap-icon]: ./media/apis-list/sap.png
[schedule-icon]: ./media/apis-list/recurrence.png
[scope-icon]: ./media/apis-list/scope.png
[sftp-ssh-icon]: ./media/apis-list/sftp.png
[smtp-icon]: ./media/apis-list/smtp.png
[sql-server-icon]: ./media/apis-list/sql.png
[swift-icon]: ./media/apis-list/swift.png
[switch-icon]: ./media/apis-list/switch.png
[terminate-icon]: ./media/apis-list/terminate.png
[until-icon]: ./media/apis-list/until.png
[variables-icon]: ./media/apis-list/variables.png

<!--B2B built-in operation icons -->
[as2-v2-icon]: ./media/apis-list/as2-v2.png
[edifact-icon]: ./media/apis-list/edifact.png
[flat-file-icon]: ./media/apis-list/flat-file-decoding.png
[integration-account-icon]: ./media/apis-list/integration-account.png
[liquid-icon]: ./media/apis-list/liquid-transform.png
[rosettanet-icon]: ./media/apis-list/rosettanet.png
[x12-icon]: ./media/apis-list/x12.png
[xml-transform-icon]: ./media/apis-list/xml-transform.png
[xml-validate-icon]: ./media/apis-list/xml-validation.png

<!--Built-in doc links-->
[azure-ai-search-doc]: https://techcommunity.microsoft.com/t5/azure-integration-services-blog/public-preview-of-azure-openai-and-ai-search-in-app-connectors/ba-p/4049584 "Connect to AI Search so that you can perform document indexing and search operations in your workflow"
[azure-api-management-doc]: ../api-management/get-started-create-service-instance.md "Create an Azure API Management service instance for managing and publishing your APIs"
[azure-app-services-doc]: ../logic-apps/logic-apps-custom-api-host-deploy-call.md "Integrate logic app workflows with App Service API Apps"
[azure-automation-doc]: /azure/logic-apps/connectors/built-in/reference/azureautomation/ "Connect to your Azure Automation accounts so you can create and manage Azure Automation jobs"
[azure-blob-storage-doc]: /azure/logic-apps/connectors/built-in/reference/azureblob/ "Manage files in your blob container with Azure Blob storage"
[azure-cosmos-db-doc]: /azure/logic-apps/connectors/built-in/reference/azurecosmosdb/ "Connect to Azure Cosmos DB so you can access and manage Azure Cosmos DB documents"
[azure-event-grid-publisher-doc]: /azure/logic-apps/connectors/built-in/reference/eventgridpublisher/ "Connect to Azure Event Grid for event-based programming using pub-sub semantics"
[azure-event-hubs-doc]: /azure/logic-apps/connectors/built-in/reference/eventhub/ "Connect to Azure Event Hubs so that you can receive and send events between logic app workflows and Event Hubs"
[azure-file-storage-doc]: /azure/logic-apps/connectors/built-in/reference/azurefile/ "Connect to Azure File Storage so you can create and manage files in your Azure storage account"
[azure-functions-doc]: ../logic-apps/logic-apps-azure-functions.md "Integrate logic app workflows with Azure Functions"
[azure-key-vault-doc]: /azure/logic-apps/connectors/built-in/reference/keyvault/ "Connect to Azure Key Vault to securely store, access, and manage secrets"
[azure-openai-doc]: https://techcommunity.microsoft.com/t5/azure-integration-services-blog/public-preview-of-azure-openai-and-ai-search-in-app-connectors/ba-p/4049584 "Connect to Azure OpenAI to perform operations on large language models"
[azure-queue-storage-doc]: /azure/logic-apps/connectors/built-in/reference/azurequeues/ "Connect to Azure Storage so you can create and manage queue entries and queues"
[azure-service-bus-doc]: /azure/logic-apps/connectors/built-in/reference/servicebus/ "Manage messages from Service Bus queues, topics, and topic subscriptions"
[azure-table-storage-doc]: /azure/logic-apps/connectors/built-in/reference/azuretables/ "Connect to Azure Storage so you can create, update, and query tables and more"
[batch-doc]: ../logic-apps/logic-apps-batch-process-send-receive-messages.md "Process messages in groups, or as batches"
[condition-doc]: ../logic-apps/logic-apps-control-flow-conditional-statement.md "Evaluate a condition and run different actions based on whether the condition is true or false"
[data-operations-doc]: ../logic-apps/logic-apps-perform-data-operations.md "Perform data operations such as filtering arrays or creating CSV and HTML tables"
[file-system-doc]: /azure/logic-apps/connectors/built-in/reference/filesystem/ "Connect to a file system on your network machine to create and manage files"
[for-each-doc]: ../logic-apps/logic-apps-control-flow-loops.md#foreach-loop "Perform the same actions on every item in an array"
[ftp-doc]: /azure/logic-apps/connectors/built-in/reference/ftp/ "Connect to an FTP or FTPS server for FTP tasks, like uploading, getting, deleting files, and more"
[http-doc]: ./connectors-native-http.md "Call HTTP or HTTPS endpoints from your logic app workflows"
[http-request-doc]: ./connectors-native-reqres.md "Receive HTTP requests in your logic app workflows"
[http-response-doc]: ./connectors-native-reqres.md "Respond to HTTP requests from your logic app workflows"
[http-swagger-doc]: ./connectors-native-http-swagger.md "Call REST endpoints from your logic app workflows"
[http-webhook-doc]: ./connectors-native-webhook.md "Wait for specific events from HTTP or HTTPS endpoints"
[ibm-3270-doc]: /azure/connectors/integrate-3270-apps-ibm-mainframe?tabs=standard "Integrate IBM 3270 screen-driven apps with Azure"
[ibm-cics-doc]: /azure/connectors/integrate-cics-apps-ibm-mainframe "Integrate CICS programs on IBM mainframes with Azure"
[ibm-db2-doc]: /azure/logic-apps/connectors/built-in/reference/db2/ "Connect to IBM DB2 in the cloud or on-premises. Update a row, get a table, and more"
[ibm-host-file-doc]: /azure/logic-apps/connectors/built-in/reference/hostfile/ "Connect to your IBM host to work with offline files"
[ibm-ims-doc]: /azure/connectors/integrate-ims-apps-ibm-mainframe "Integrate IMS programs on IBM mainframes with Azure"
[ibm-mq-doc]: /azure/logic-apps/connectors/built-in/reference/mq/ "Connect to IBM MQ on-premises or in Azure to send and receive messages"
[inline-code-doc]: ../logic-apps/logic-apps-add-run-inline-code.md "Add and run JavaScript code snippets from your logic app workflows"
[jdbc-doc]: /azure/logic-apps/connectors/built-in/reference/jdbc/ "Connect to a relational database using JDBC drivers"
[local-function-doc]: ../logic-apps/create-run-custom-code-functions.md "Create and run .NET Framework code from your workflow"
[nested-logic-app-doc]: ../logic-apps/logic-apps-http-endpoint.md "Integrate logic app workflows with nested workflows"
[query-doc]: ../logic-apps/logic-apps-perform-data-operations.md#filter-array-action "Select and filter arrays with the Query action"
[sap-doc]: /azure/logic-apps/connectors/built-in/reference/sap/ "Connect to SAP so you can send or receive messages and invoke actions"
[schedule-doc]: ../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md "Run logic app workflows based a schedule"
[schedule-delay-doc]: ./connectors-native-delay.md "Delay running the next action"
[schedule-delay-until-doc]: ./connectors-native-delay.md "Delay running the next action"
[schedule-recurrence-doc]:  ./connectors-native-recurrence.md "Run logic app workflows on a recurring schedule"
[schedule-sliding-window-doc]: ./connectors-native-sliding-window.md "Run logic app workflows that need to handle data in contiguous chunks"
[scope-doc]: ../logic-apps/logic-apps-control-flow-run-steps-group-scopes.md "Organize actions into groups, which get their own status after the actions in group finish running"
[sftp-doc]: /azure/logic-apps/connectors/built-in/reference/sftp/ "Connect to your SFTP account by using SSH. Upload, get, delete files, and more"
[smtp-doc]: /azure/logic-apps/connectors/built-in/reference/smtp/ "Connect to your SMTP server so you can send email"
[sql-server-doc]: /azure/logic-apps/connectors/built-in/reference/sql/ "Connect to Azure SQL Database or SQL Server. Create, update, get, and delete entries in an SQL database table"
[switch-doc]: ../logic-apps/logic-apps-control-flow-switch-statement.md "Organize actions into cases, which are assigned unique values. Run only the case whose value matches the result from an expression, object, or token. If no matches exist, run the default case"
[swift-doc]: https://techcommunity.microsoft.com/t5/azure-integration-services-blog/announcement-public-preview-of-swift-message-processing-using/ba-p/3670014 "Encode and decode SWIFT transactions in flat-file XML format"
[terminate-doc]: ../logic-apps/logic-apps-workflow-actions-triggers.md#terminate-action "Stop or cancel an actively running workflow for your logic app workflow"
[until-doc]: ../logic-apps/logic-apps-control-flow-loops.md#until-loop "Repeat actions until the specified condition is true or some state has changed"
[variables-doc]: ../logic-apps/logic-apps-create-variables-store-values.md "Perform operations with variables, such as initialize, set, increment, decrement, and append to string or array variable"

<!--B2B built-in operation doc links-->
[as2-doc]: ../logic-apps/logic-apps-enterprise-integration-as2.md "Encode and decode messages that use the AS2 protocol"
[edifact-doc]: ../logic-apps/logic-apps-enterprise-integration-edifact.md "Encode and decode messages that use the EDIFACT protocol"
[flat-file-doc]:../logic-apps/logic-apps-enterprise-integration-flatfile.md "Encode and decode XML content with a flat file schema"
[integration-account-doc]: ../logic-apps/logic-apps-enterprise-integration-metadata.md "Manage metadata for integration account artifacts"
[liquid-transform-doc]: ../logic-apps/logic-apps-enterprise-integration-liquid-transform.md "Transform JSON or XML content with Liquid templates"
[rosettanet-doc]: ../logic-apps/logic-apps-enterprise-integration-rosettanet.md "Exchange RosettaNet messages in your workflow"
[x12-doc]: ../logic-apps/logic-apps-enterprise-integration-x12.md "Encode and decode messages that use the X12 protocol"
[xml-transform-doc]: ../logic-apps/logic-apps-enterprise-integration-transform.md "Transform XML content"
[xml-validate-doc]: ../logic-apps/logic-apps-enterprise-integration-xml-validation.md "Validate XML content"
