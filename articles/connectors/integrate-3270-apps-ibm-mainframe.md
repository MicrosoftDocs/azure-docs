---
title: Connect to 3270 Apps on IBM Mainframes
description: Learn how to access 3270 screen-driven apps on IBM mainframes from workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 01/26/2026
ms.custom: sfi-image-nochange
#Customer intent: As an integration developer who works with Azure Logic Apps, I need to connect my workflows with 3270 screen-driven apps on IBM mainframes.
---

# Integrate 3270 screen-driven apps on IBM mainframes with workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

IBM mainframe apps usually run through a 3270 emulator. To access and run IBM mainframe apps from Consumption and Standard workflows in Azure Logic Apps, use the **IBM 3270** connector. You can create automated workflows that integrate your IBM mainframe apps with Azure, Microsoft, and other apps, services, and systems. The connector communicates with IBM mainframes by using the TN3270 protocol. The **IBM 3270** connector is available in all Azure Logic Apps regions except for Azure Government and Microsoft Azure operated by 21Vianet.

This how-to guide describes the following aspects about the **IBM 3270** connector:

- Why use the IBM 3270 connector in Azure Logic Apps
- How the IBM 3270 connector runs 3270 screen-driven apps
- Prerequisites and setup for using the IBM 3270 connector
- Steps for adding IBM 3270 connector actions to your workflow

## Why use this connector?

To access apps on IBM mainframes, you typically use a 3270 terminal emulator, often called a *green screen*. This method is a time-tested way but has limitations. Although Host Integration Server (HIS) helps you work directly with these apps, sometimes you can't separate the screen and business logic. Or, maybe you no longer have information for how the host applications work.

To extend these scenarios, the **IBM 3270** connector in Azure Logic Apps works with the [3270 Design Tool](/host-integration-server/core/application-integration-3270designer-1). Use the design tool to record, or *capture*, the host screens used for a specific task, define the navigation flow for that task through your mainframe app, and define the methods with input and output parameters for that task. The design tool converts that information into metadata that the 3270 connector uses when it runs an action in your workflow.

First, generate the metadata file from the 3270 Design Tool. Then add that file as a map artifact either to your Standard logic app resource or to your linked integration account for a Consumption logic app. That way, your workflow can access your app's metadata when you add an **IBM 3270** connector action.

The connector reads the metadata file from your logic app resource (Standard) or your integration account (Consumption), handles navigation through the 3270 screens, and dynamically presents the parameters to use with the 3270 connector in your workflow. You can then provide data to the host application. The connector returns the results to your workflow. As a result, you can integrate your legacy apps with Azure, Microsoft, and other apps, services, and systems that Azure Logic Apps supports.

## Connector technical reference

The IBM 3270 connector has different versions, based on [logic app type and host environment](../logic-apps/logic-apps-overview.md#resource-environment-differences).

| Logic app | Environment | Connection version |
|-----------|-------------|--------------------|
| **Consumption** | Multitenant Azure Logic Apps | Managed connector, which appears in the designer under the **Enterprise** label. This connector provides only single action and no triggers. For more information, see [IBM 3270 managed connector reference](/connectors/si3270). |
| **Standard** | 	Single-tenant Azure Logic Apps and App Service Environment v3 (ASE v3 with Windows plans only) | Managed connector, which appears in the connector gallery under the **Shared** filter, and the built-in, [service provider-based](../logic-apps/custom-connector-overview.md#service-provider-interface-implementation) connector, which appears in the connector gallery under the **Built-in** filter. The built-in version differs in the following ways: <br><br>- The built-in connector requires that you upload your HIDX file to your Standard logic app resource, not an integration account. <br><br>- The built-in connector can directly connect to a 3270 server and access Azure virtual networks using a connection string. <br><br>- The built-in version supports server authentication with TLS encryption for data in transit, message encoding for its operation, and Azure virtual network integration. <br><br>For more information, see the following documentation: <br><br>- [IBM 3270 managed connector reference](/connectors/si3270) <br>- [IBM 3270 built-in connector reference](#built-in-reference) |

<a name="built-in-reference"></a>

### Built-in connector reference

The following section describes the operations for the IBM 3270 connector, which currently includes only the following action:

### Execute a navigation plan

| Parameter | Required | Type | Description |
|-----------|----------|-------|-------------|
| **HIDX Name** | Yes | String | Select the 3270 HIDX file that you want to use. |
| **Method Name** | Yes | String | Select the method in the HIDX file that you want to use. |
| **Advanced parameters** | No | Varies | This list appears after you select a method so that you can add other parameters to use with the selected method. The available parameters vary based on your HIDX file and the method that you select. |

This operation also includes advanced parameters, which appear after you select a method, for you to select and use with the selected method. These parameters vary based on your HIDX file and the method that you select.

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Access to the TN3270 server that hosts your 3270 screen-driven app.

- The Host Integration Designer XML (HIDX) file that provides the necessary metadata for the **IBM 3270** connector to run your 3270 screen-driven app.

  To create this HIDX file, [download and install the 3270 Design Tool](https://aka.ms/3270-design-tool-download). The only prerequisite is [Microsoft .NET Framework 4.8](https://aka.ms/net-framework-download).

  This tool helps you record the screens, navigation paths, methods, and parameters for the tasks in your app that you add and run as 3270 connector actions. The tool generates a Host Integration Designer XML (HIDX) file that provides the necessary metadata for the connector to run your 3270 screen-driven app.

  After you download and install this tool, connect with your TN3270 host server, design the required metadata artifact, and generate the HIDX file. For more information, see [Designing Metadata Artifacts for 3270 Applications](/host-integration-server/core/application-integration-la3270apps).

- The Standard or Consumption logic app resource and workflow where you want to run your 3270 screen-driven app.

  The IBM 3270 connector doesn't have triggers, so use any trigger to start your workflow, such as the **Recurrence** trigger or **Request** trigger. You can then add the 3270 connector actions.

- An [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md), which is required based on the 3270 connector version that you use. You use this Azure resource to centrally store B2B artifacts. Examples include trading partners, agreements, maps, schemas, and certificates to use with specific workflow actions.

  | Workflow | Description |
  |----------|-------------|
  | Standard | - 3270 built-in connector: Upload HIDX file to Standard logic app resource. <br><br>- 3270 managed connector: Upload HIDX file to your Standard logic app resource or your [linked integration account](../logic-apps/enterprise-integration/create-integration-account.md?tabs=standard#link-to-logic-app). |
  | Consumption | 3270 managed connector: Upload HIDX file to your [linked integration account](../logic-apps/enterprise-integration/create-integration-account.md?tabs=consumption#link-to-logic-app). |

  For more information, see [Upload the HIDX file](#upload-hidx-file).

<a name="upload-hidx-file"></a>

## Upload the HIDX file

To use the HIDX file in your workflow, follow these steps:

### [Standard](#tab/standard)

1. Go to the folder where you saved your HIDX file, and copy the file.

1. In the [Azure portal](https://portal.azure.com), choose the following steps, based on the connector version:

   - 3270 built-in connector: [Upload your HIDX file to your Standard logic app resource](../logic-apps/logic-apps-enterprise-integration-maps.md?tabs=standard#add-map-to-standard-logic-app-resource).

   - 3270 managed connector:

     - [Upload your HIDX file to a linked integration account](../logic-apps/logic-apps-enterprise-integration-maps.md?tabs=standard#add-map-to-integration-account). Make sure that you select **HIDX** as the **Map type**.

     - [Upload your HIDX file to your Standard logic app resource](../logic-apps/logic-apps-enterprise-integration-maps.md?tabs=standard#add-map-to-standard-logic-app-resource).

1. Now, [add an IBM 3270 action](#add-ibm-3270-action) to your workflow.

### [Consumption](#tab/consumption)

1. Go to the folder where you saved your HIDX file, and copy the file.

1. In the [Azure portal](https://portal.azure.com), [upload the HIDX file as a map artifact to your linked integration account](../logic-apps/logic-apps-enterprise-integration-maps.md?tabs=consumption#add-map-to-integration-account). Make sure that you select **HIDX** as the **Map type**.

1. Now, [add an IBM 3270 action](#add-ibm-3270-action) to your workflow.

---

Later in this guide, when you add an **IBM 3270** connector action to your workflow for the first time, you're prompted to create a connection between your workflow and the mainframe system. After you create the connection, you can select your previously added HIDX file, the method to run, and the parameters to use.

<a name="add-ibm-3270-action"></a>

## Add an IBM 3270 action

A Standard logic app workflow can use the IBM 3270 managed connector and the IBM 3270 built-in connector. A Consumption logic app workflow can use only the IBM 3270 managed connector. Each version has different actions. Based on whether you have a Consumption or Standard logic app workflow, follow the corresponding steps:

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow.

1. If your workflow doesn't have a trigger, follow the [general steps](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger) to add the trigger that works for your scenario.

   This example continues with the **Request** trigger named **When an HTTP request is received**.

1. Follow the [general steps](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-action) to add the **IBM 3270** built-in connector action named **Execute a navigation plan**.

1. After the connection pane appears, enter the following parameter values:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Connection Name** | Yes | <*connection-name*> | A name for your connection. |
   | **Code Page** | No | <*code-page*> | The code page number for the host to use for converting text. If you leave this value blank, the connector uses `37` as the default value. |
   | **Device Type** | No | <*IBM-terminal-model*> | The model name or number for the IBM terminal to emulate. If you leave this value blank, the connector uses default values. |
   | **Log Exception Screens** | No | True or false | Log the host screen if an error occurs during screen navigation. |
   | **Logical Unit Name** | No | <*logical-unit-name*> | The specific logical unit name to request from the host. |
   | **Port Number** | No | <*TN3270-server-port*> | The port used by your TN3270 server. If you leave this value blank, the connector uses `23` as the default value. |
   | **Server** | Yes | <*TN3270-server-name*> | The server name for your TN3270 service. |
   | **Timeout** | No | <*timeout-seconds*> | The timeout duration in seconds while waiting for screens. |
   | **Use TLS** | No | On or off | Turn on or turn off TLS encryption. |
   | **Validate TN3270 Server Certificate** | No | On or off | Turn on or turn off validation for the server's certificate. |

   For example:

   :::image type="content" source="./media/integrate-3270-apps-ibm-mainframe/connection-properties-standard.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and IBM 3270 connection properties." lightbox="./media/integrate-3270-apps-ibm-mainframe/connection-properties-standard.png":::

1. When you're done, select **Create new**.

1. When the action information box appears, enter the necessary parameter values:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **HIDX Name** | Yes | <*HIDX-file-name*> | Select the 3270 HIDX file that you want to use. |
   | **Method Name** | Yes | <*method-name*> | Select the method in the HIDX file that you want to use. After you select a method, the **Add new parameter** list appears so you can select parameters to use with that method. |

   For example:

   **Select the HIDX file**

   :::image type="content" source="./media/integrate-3270-apps-ibm-mainframe/select-hidx-file-standard.png" alt-text="Screenshot shows Standard workflow designer, 3270 action, and selected HIDX file." lightbox="./media/integrate-3270-apps-ibm-mainframe/select-hidx-file-standard.png":::

   **Select the method**

   :::image type="content" source="./media/integrate-3270-apps-ibm-mainframe/select-method-standard.png" alt-text="Screenshot shows Standard workflow designer, 3270 action, and selected method." lightbox="./media/integrate-3270-apps-ibm-mainframe/select-method-standard.png":::

1. Save your workflow. On designer toolbar, select **Save**.

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource and workflow.

1. If your workflow doesn't have a trigger, follow these [general steps](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=consumption#add-trigger) to add a trigger that works for your scenario.

   This example continues with the **Request** trigger named **When an HTTP request is received**.

1. Follow the [general steps](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=consumption#add-action) to add the **IBM 3270** managed connector action named **Runs a mainframe program over a TN3270 connection**.

1. After the connection pane appears, enter the following parameter values:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Connection Name** | Yes | <*connection-name*> | A name for your connection. |
   | **Integration Account ID** | Yes | <*integration-account-name*> | The name for your integration account. |
   | **Integration Account SAS URL** | Yes | <*integration-account-SAS-URL*> | Your integration account's Shared Access Signature (SAS) URL, which you can generate from your integration account's settings in the Azure portal. <br><br>1. On your integration account menu, under **Settings**, select **Callback URL**. <br><br>2. In the right-side pane, copy the **Generated Callback URL** value. |
   | **Server** | Yes | <*TN3270-server-name*> | The server name for your TN3270 service. |
   | **Port** | No | <*TN3270-server-port*> | The port used by your TN3270 server. If you leave this value blank, the connector uses `23` as the default value. |
   | **Device Type** | No | <*IBM-terminal-model*> | The model name or number for the IBM terminal to emulate. If you leave this value blank, the connector uses default values. |
   | **Code Page** | No | <*code-page-number*> | The code page number for the host. If you leave this value blank, the connector uses `37` as the default value. |
   | **Logical Unit Name** | No | <*logical-unit-name*> | The specific logical unit name to request from the host. |
   | **Enable SSL?** | No | On or off | Turn on or turn off TLS encryption. |
   | **Validate Host Ssl Certificate?** | No | On or off | Turn on or turn off validation for the server's certificate. |

   For example:

   :::image type="content" source="./media/integrate-3270-apps-ibm-mainframe/connection-properties-consumption.png" alt-text="Screenshot shows Azure portal, Consumption workflow designer, and IBM 3270 connection properties." lightbox="./media/integrate-3270-apps-ibm-mainframe/connection-properties-consumption.png":::

1. When you're done, select **Create new**.

1. When the action information box appears, enter the necessary parameter values:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **HIDX Name** | Yes | <*HIDX-file-name*> | Select the 3270 HIDX file that you want to use. |
   | **Method Name** | Yes | <*method-name*> | Select the method in the HIDX file that you want to use. After you select a method, the **Add new parameter** list appears so you can select parameters to use with that method. |

   For example:

   **Select the HIDX file**

   :::image type="content" source="./media/integrate-3270-apps-ibm-mainframe/select-hidx-file-consumption.png" alt-text="Screenshot shows Consumption workflow designer, 3270 action, and selected HIDX file." lightbox="./media/integrate-3270-apps-ibm-mainframe/select-hidx-file-consumption.png":::

   **Select the method**

   :::image type="content" source="./media/integrate-3270-apps-ibm-mainframe/select-method-consumption.png" alt-text="Screenshot shows Consumption workflow designer, 3270 action, and selected method." lightbox="./media/integrate-3270-apps-ibm-mainframe/select-method-consumption.png":::

1. Save your workflow. On designer toolbar, select **Save**.

---

## Test your workflow

1. To manually run your workflow, on the designer toolbar, from the **Run** menu, select **Run**.

   After your workflow finishes running, the run history appears. Successful operations show check marks, while unsuccessful operations show an exclamation point (**!**).

1. To view the inputs and outputs for each operation, select that operation.

1. To review the raw inputs, select **See raw inputs**.

1. To review the raw outputs, select **See raw outputs**.

## Related content

- [Check workflow status, view run history, and set up alerts](../logic-apps/monitor-logic-apps.md?tabs=standard)
- [View metrics for workflow health and performance](../logic-apps/view-workflow-metrics.md?tabs=standard)
- [Monitor and collect diagnostic data for workflows](../logic-apps/monitor-workflows-collect-diagnostic-data.md?tabs=standard)
- [Set up and view enhanced telemetry in Application Insights for Standard workflows](../logic-apps/enable-enhanced-telemetry-standard-workflows.md)
