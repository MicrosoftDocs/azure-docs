---
title: Parse and generate IBM host files
description: Learn how to parse and generate offline IBM host files.
services: logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 11/02/2023
---

# Parse and generate host files from IBM mainframes for Standard workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

To parse and generate new IBM host files and i Series physical files from Standard workflows in Azure Logic Apps, you can use the **IBM Host File** built-in, service provider-based connector. Since the introduction of mainframe systems, ubiquitous host files are used to store abundant data for mission critical systems. Although this connector doesn't require access to an IBM mainframe or midrange system, you must make the host file available to a Standard workflow by using other mechanisms such as FTP, blob storage, Host Integration Server, or a partner software appliance. The **IBM Host File** connector is available in all Azure Logic Apps regions except for Azure Government and Microsoft Azure operated by 21Vianet.

This how-to guide describes the following aspects about the **IBM Host File** connector:

* Why use the **IBM Host File** connector in Azure Logic Apps

* Prerequisites and setup for using the **IBM Host File** connector

* Steps for adding the **IBM Host File** connector actions to your Standard logic app workflow

## Why use this connector?

On IBM mainframes, *access methods*, which are special components in the operating system, handle file processing. In the 1970s, Virtual Storage Access Method (VSAM) was built and became the most widely used access method on IBM mainframes. VSAM provides the following types of files: entry-sequenced datasets, key-sequenced datasets, and relative record datasets.

Today, the market has multiple solutions that directly connect to host files and run data operations. Many solutions require that you install software on the mainframe system. Although this option works well for some customers, others want to avoid growing the footprint in their mainframe systems.

[Microsoft Host Integration Server (HIS)](/host-integration-server/what-is-his) provides a managed adapter for host files and doesn't require installing software on the mainframe. However, HIS requires that you enable the [IBM Distributed File Manager (DFM)](https://www.ibm.com/docs/en/zos/2.2.0?topic=management-distributed-file-manager) mainframe subsystem, which requires LU 6.2. This managed provider also requires you to configure an HIS System Network Architecture (SNA) gateway that provides access to the DFM.

In most ways, the managed provider operates as a normal data provider. You can connect to a host file system, execute commands, and retrieve data. Although a great alternative for some customers, the **IBM Host File** connector requires that you make IBM host files available in binary format to Standard workflows in Azure Logic Apps. This requirement reduces the complexity of this solution and lets you use your choice of tools to access and manage data in host files. After you make the host file available in a place where the Standard workflow can use a trigger to read the file, the **IBM Host File** connector operation can parse that file.

For customers interested in accessing and using databases, such as SQL Server or Cosmos DB, in their mainframe environments, the **IBM Host File** connector provides the capability to generate host files in JSON format. That way, you can use these host files in your cloud database of choice, and send the data back as a host file to your mainframe or midrange environments.

The following diagram shows how the **IBM Host File** connector in Azure Logic Apps interacts with other systems:

:::image type="content" source="media/integrate-host-files-ibm-mainframe/host-file-connector-overview.png" alt-text="Conceptual diagram shows how the IBM Host File connector in Azure Logic Apps works with other systems." lightbox="media/integrate-host-files-ibm-mainframe/host-file-connector-overview.png":::

To extend hybrid cloud scenarios, the **IBM Host File** connector works with the [HIS Designer for Logic Apps](/host-integration-server/core/application-integration-ladesigner-2), which you can use to create a *data definition* or *data map* of the mainframe host file. For this task, the HIS Designer converts that data into metadata that the **IBM Host File** connector uses when running an action in your workflow. The connector performs the data type conversions, which are required to receive input from preceding workflow operations and to send output for use by subsequent workflow actions. The connector also provides tabular data definition and code page translation.

After you generate the metadata file as a Host Integration Designer XML (HIDX) file from the HIS Designer, you can add that file as a map artifact to your Standard logic app resource. That way, your workflow can access your app's metadata when you add an **IBM Host File** connector action. The connector reads the metadata file from your logic app resource, and dynamically presents the binary file's structure to use with the **IBM Host File** connector actions in your workflow.

## Connector technical reference

The following section describes the operations for the **IBM Host File** connector, which currently includes only the following actions:

### Parse Host File Contents action

| Parameter | Required | Type | Description |
|-----------|----------|-------|-------------|
| **HIDX Name** | Yes | String | Select the mainframe host file HIDX file that you want to use. |
| **Schema Name** | Yes | String | Select the host file schema in the HIDX file that you want to use. |
| **Binary contents** | Yes | Binary | Select the binary data with a fixed length record extracted from the mainframe. |

### Generate Host File Contents action

| Parameter | Required | Type | Description |
|-----------|----------|-------|-------------|
| **HIDX Name** | Yes | String | Select the mainframe host file HIDX file that you want to use. |
| **Schema Name** | Yes | String | Select the host file schema in the HIDX file that you want to use. |
| **Rows** | Yes | JSON | Select the Array or individual rows. To enter an entire data object in JSON format, you can select the **Switch to input entire array** option. |

## Limitations

Currently, this connector requires that you upload your HIDX file directly to your Standard logic app resource, not an integration account.

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The Host Integration Designer XML (HIDX) file that provides the necessary metadata for the **IBM Host File** connector to recognize the host file data structure.

  To create this HIDX file, [download and install the HIS Designer for Azure Logic Apps](https://aka.ms/his-designer-logicapps-download). The only prerequisite is [Microsoft .NET Framework 4.8](https://aka.ms/net-framework-download).

  To effectively parse and generate host files, your workflow needs to understand the host file metadata. However, as a key difference between a host file and a database table, the host file doesn't have the metadata that describes the data structure. To create this metadata, use the [HIS Designer for Logic Apps](/host-integration-server/core/application-integration-ladesigner-2). With this tool, you can manually create the host file structure that your workflow uses. You can also import COBOL definitions (copybooks) that provide these data structures.

  The tool generates a Host Integration Designer XML (HIDX) file that provides the necessary metadata for the connector to recognize the host file data structure. If you're using HIS, you can use the TI Designer to create the HIDX file.

* The Standard logic app workflow where you want to parse or generate the host file.

  The **IBM Host File** connector doesn't have triggers, so use any trigger to start your workflow, such as the **Recurrence** trigger or **Azure Blob Storage** trigger. You can then add the **IBM Host File** connector actions. To get started, create a blank workflow in your Standard logic app resource.

<a name="define-generate-hostfile-metadata"></a>

## Define and generate metadata

After you download and install the HIS Designer for Azure Logic Apps, follow [these steps to generate the HIDX file from the metadata artifact](/host-integration-server/core/application-integration-lahostfiles).

<a name="upload-hidx-file"></a>

## Upload the HIDX file

For your workflow to use the HIDX file, follow these steps:

1. Go to the folder where you saved your HIDX file, and copy the file.

1. In the [Azure portal](https://portal.azure.com), [upload the HIDX file as a map to your Standard logic app resource](../logic-apps/logic-apps-enterprise-integration-maps.md?tabs=standard#add-map-to-standard-logic-app-resource).

1. Now, [add an **IBM Host File** action to your workflow](#add-host-files-action).

Later in this guide, when you add the **Parse Host File Contents** action to your workflow for the first time, you're prompted to create a connection. After you create the connection, you can select your previously added HIDX file, the schema, and the parameters to use.

<a name="add-host-files-action"></a>

## Add a Parse Host File Contents action

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow in the designer.

1. If you haven't already added a trigger to start your workflow, [follow these general steps to add the trigger that you want](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger).

   This example continues with the **Azure Blob Storage** built-in, service provider-based trigger named **When a blob is added or updated**.

   :::image type="content" source="media/integrate-host-files-ibm-mainframe/blob-storage-trigger.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and Azure Blob Storage trigger." lightbox="media/integrate-host-files-ibm-mainframe/blob-storage-trigger.png":::

1. To get the content from the added or updated blob, [follow these general steps to add the **Azure Blob Storage** built-in connector action named **Read blob content**](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. [Follow these general steps to add the **IBM Host File** built-in connector action named **Parse Host File Contents**](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. After the connection details pane appears, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Connection Name** | Yes | <*connection-name*> | The name for your connection |
   | **Code Page** | No | <*code-page*> | The code page number to use for converting text |
   | **From iSeries** | No | <*mf-iseries*> | Whether the file originates from an i Series server |

   For example:

   :::image type="content" source="./media/integrate-host-files-ibm-mainframe/parse-host-file-contents-connection.png" alt-text="Screenshot showing the Parse Host File Contents action's connection properties." lightbox="./media/integrate-host-files-ibm-mainframe/parse-host-file-contents-connection.png":::

1. When you're done, select **Create New**.

1. After the action details pane appears, in the **Parameters** section, provide the required information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **HIDX Name** | Yes | <*HIDX-file-name*> | Select the mainframe host file HIDX file that you want to use. |
   | **Schema Name** | Yes | <*schema-name*> | Select the schema in the HIDX file that you want to use. |
   | **Binary Contents** | Yes | <*binary-contents*> | Select the binary data with a fixed length record extracted from the host. |

   For example, the following image shows Visual Studio with a sample host file HIDX file with a **CUSTOMER** table and **CUSTOMER_RECORD** schema in the HIS Designer for Logic Apps:

   :::image type="content" source="./media/integrate-host-files-ibm-mainframe/visual-studio-customers-hidx.png" alt-text="Screenshot shows Visual Studio and the host file schema in the HIDX file." lightbox="./media/integrate-host-files-ibm-mainframe/visual-studio-customers-hidx.png":::

   **Provide HIDX file and schema**

   :::image type="content" source="./media/integrate-host-files-ibm-mainframe/parse-host-file-contents-parameters.png" alt-text="Screenshot shows the Parse Host File Contents action with selected HIDX file and schema.":::

   **Select binary data to read from blob**

   :::image type="content" source="./media/integrate-host-files-ibm-mainframe/parse-host-file-contents-binary.png" alt-text="Screenshot shows the Parse Host File Contents action, dynamic content list, and selecting binary data to read from JSON file in Blob Storage account." lightbox="./media/integrate-host-files-ibm-mainframe/parse-host-file-contents-binary.png":::

   When you're done, the **Parse Host File Contents** action looks like the following example with a subsequent action that creates a file on an SFTP server:

   :::image type="content" source="./media/integrate-host-files-ibm-mainframe/parse-host-file-contents-complete.png" alt-text="Screenshot shows the completed Parse Host File Contents action." lightbox="./media/integrate-host-files-ibm-mainframe/parse-host-file-contents-complete.png":::

1. When you're done, save your workflow. On designer toolbar, select **Save**.

## Add a Generate Host File Contents action

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow in the designer.

1. If you haven't already added a trigger to start your workflow, [follow these general steps to add the trigger that you want](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger).

   This example continues with the **Azure Blob Storage** built-in, service provider-based trigger named **When a blob is added or updated**.

   :::image type="content" source="media/integrate-host-files-ibm-mainframe/blob-storage-trigger.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and Azure Blob Storage trigger." lightbox="media/integrate-host-files-ibm-mainframe/blob-storage-trigger.png":::

1. To get the content from the added or updated blob, [follow these general steps to add the **Azure Blob Storage** built-in connector action named **Read blob content**](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. [Follow these general steps to add the **IBM Host File** built-in connector action named **Generate Host File Contents**](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. After the connection details pane appears, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Connection Name** | Yes | <*connection-name*> | The name for your connection |
   | **Code Page** | No | <*code-page*> | The code page number to use for converting text |
   | **From iSeries** | No | <*mf-iseries*> | Whether the file originates from an i Series server |

   For example:

   :::image type="content" source="./media/integrate-host-files-ibm-mainframe/generate-host-file-contents-connection.png" alt-text="Screenshot showing Generate Host File Contents action's connection properties." lightbox="./media/integrate-host-files-ibm-mainframe/generate-host-file-contents-connection.png":::

1. When you're done, select **Create New**.

1. After the action details pane appears, in the **Parameters** section, provide the required information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **HIDX Name** | Yes | <*HIDX-file-name*> | Provide the name for the mainframe host file HIDX file that you want to use. |
   | **Schema Name** | Yes | <*schema-name*> | Provide name for the schema in the HIDX file that you want to use. |
   | **Rows** | Yes | <*rows*> | Provide an array of records to convert to IBM format. To select the output from a preceding workflow operation, follow these steps: <br><br>1. Select inside the **Rows** box, and then select the dynamic content option (lightning bolt). <br><br>2. From the dynamic content list, select the output from a preceding action. For example, from the **Read blob content** section, select **Response from read blob action Content**. <br><br>**Tip**: To enter an entire data object in JSON format, select the **Switch to input entire array** option. |

   For example, the following image shows Visual Studio with a sample HIDX file in the HIS Designer for Logic Apps:

   :::image type="content" source="./media/integrate-host-files-ibm-mainframe/visual-studio-customers-hidx.png" alt-text="Screenshot shows the host file schema in the HIDX file." lightbox="./media/integrate-host-files-ibm-mainframe/visual-studio-customers-hidx.png":::

   **Provide HIDX file and schema**

   :::image type="content" source="./media/integrate-host-files-ibm-mainframe/generate-host-file-contents-parameters.png" alt-text="Screenshot shows the Generate Host File Contents action with selected HIDX file and schema." lightbox="./media/integrate-host-files-ibm-mainframe/generate-host-file-contents-parameters.png":::

   **Select rows from blob to read and convert**

   :::image type="content" source="./media/integrate-host-files-ibm-mainframe/generate-host-file-contents-rows.png" alt-text="Screenshot shows the Generate Host File Contents action, dynamic content list, and selecting rows to read and convert from JSON file in Blob Storage account.":::

   When you're done, the **Generate Host File Contents** action looks like the following example with a subsequent action that creates a file on an SFTP server:

   :::image type="content" source="./media/integrate-host-files-ibm-mainframe/generate-host-file-contents-complete.png" alt-text="Screenshot shows the completed Generate Host File Contents action." lightbox="./media/integrate-host-files-ibm-mainframe/generate-host-file-contents-complete.png":::

1. When you're done, save your workflow. On designer toolbar, select **Save**.

## Test your workflow

1. To run your workflow, on the workflow menu, select **Overview**. On the **Overview** toolbar, select **Run** > **Run**.

   After your workflow finishes running, your workflow's run history appears. Successful steps show check marks, while unsuccessful steps show an exclamation point (**!**).

1. To review the inputs and outputs for each step, expand that step.

1. To review the outputs, select **See raw outputs**.

## Next steps

* [Monitor workflow run status, review trigger and workflow run history, and set up alerts in Azure Logic Apps](../logic-apps/monitor-logic-apps.md?tabs=standard)
* [View metrics for workflow health and performance in Azure Logic Apps](../logic-apps/view-workflow-metrics.md?tabs=standard)
* [Monitor and collect diagnostic data for workflows in Azure Logic Apps](../logic-apps/monitor-workflows-collect-diagnostic-data.md?tabs=standard)
* [Enable and view enhanced telemetry in Application Insights for Standard workflows in Azure Logic Apps](../logic-apps/enable-enhanced-telemetry-standard-workflows.md)