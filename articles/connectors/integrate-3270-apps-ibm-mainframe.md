---
title: Connect to 3270 apps on IBM mainframes
description: Integrate 3270 screen-driven apps with workflows in Azure Logic Apps using the IBM 3270 connector.
services: logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 11/02/2023
tags: connectors
---

# Integrate 3270 screen-driven apps on IBM mainframes with Azure using Azure Logic Apps and IBM 3270 connector

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To access and run IBM mainframe apps, which you usually execute by navigating through 3270 emulator screens, from Consumption and Standard workflows in Azure Logic Apps, you can use the **IBM 3270** connector. That way, you can integrate your IBM mainframe apps with Azure, Microsoft, and other apps, services, and systems by creating automated workflows with Azure Logic Apps. The connector communicates with IBM mainframes by using the TN3270 protocol. The **IBM 3270** connector is available in all Azure Logic Apps regions except for Azure Government and Microsoft Azure operated by 21Vianet.

This how-to guide describes the following aspects about the **IBM 3270** connector:

- Why use the IBM 3270 connector in Azure Logic Apps

- How does the IBM 3270 connector run 3270 screen-driven apps

- Prerequisites and setup for using the IBM 3270 connector

- Steps for adding IBM 3270 connector actions to your workflow

## Why use this connector?

To access apps on IBM mainframes, you typically use a 3270 terminal emulator, often called a "green screen". This method is a time-tested way but has limitations. Although Host Integration Server (HIS) helps you work 
directly with these apps, sometimes, separating the screen and business logic might not be possible. Or, maybe you no longer have information for how the host applications work.

To extend these scenarios, the **IBM 3270** connector in Azure Logic Apps works with the [3270 Design Tool](/host-integration-server/core/application-integration-3270designer-1), which you use to record, or "capture", the host screens used for a specific task, define the navigation flow for that task through your mainframe app, and define the methods with input and output parameters for that task. The design tool converts that information into metadata that the 3270 connector uses when running an action in your workflow.

After you generate the metadata file from the 3270 Design Tool, you add that file as a map artifact either to your Standard logic app resource or to your linked integration account for a Consumption logic app in Azure Logic Apps. That way, your workflow can access your app's metadata when you add an **IBM 3270** connector action. The connector reads the metadata file from your logic app resource (Standard) or your integration account (Consumption), handles navigation through the 3270 screens, and dynamically presents the parameters to use with the 3270 connector in your workflow. You can then provide data to the host application, and the connector returns the results to your workflow. As a result, you can integrate your legacy apps with Azure, Microsoft, and other apps, services, and systems that Azure Logic Apps supports.

## Connector technical reference

The IBM 3270 connector has different versions, based on [logic app type and host environment](../logic-apps/logic-apps-overview.md#resource-environment-differences).

| Logic app | Environment | Connection version |
|-----------|-------------|--------------------|
| **Consumption** | Multi-tenant Azure Logic Apps | Managed connector, which appears in the designer under the **Enterprise** label. This connector provides only single action and no triggers. For more information, see [IBM 3270 managed connector reference](/connectors/si3270). |
| **Standard** | 	Single-tenant Azure Logic Apps and App Service Environment v3 (ASE v3 with Windows plans only) | Managed connector, which appears in the connector gallery under **Runtime** > **Shared**, and the built-in, [service provider-based](../logic-apps/custom-connector-overview.md#service-provider-interface-implementation) connector, which appears in the connector gallery under **Runtime** > **In-App**. The built-in version differs in the following ways: -<br><br>- The built-in connector requires that you upload your HIDX file to your Standard logic app resource, not an integration account. <br><br>- The built-in connector can directly connect to a 3270 server and access Azure virtual networks using a connection string. <br><br>- The built-in version supports server authentication with TLS (SSL) encryption for data in transit, message encoding for its operation, and Azure virtual network integration. <br><br>For more information, see the following documentation: <br><br>- [IBM 3270 managed connector reference](/connectors/si3270) <br>- [IBM 3270 built-in connector reference](#built-in-reference) |

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

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Access to the TN3270 server that hosts your 3270 screen-driven app

- The Host Integration Designer XML (HIDX) file that provides the necessary metadata for the **IBM 3270** connector to run your 3270 screen-driven app.

  To create this HIDX file, [download and install the 3270 Design Tool](https://aka.ms/3270-design-tool-download). The only prerequisite is [Microsoft .NET Framework 4.8](https://aka.ms/net-framework-download).

  This tool helps you record the screens, navigation paths, methods, and parameters for the tasks in your app that you add and run as 3270 connector actions. The tool generates a Host Integration Designer XML (HIDX) file that provides the necessary metadata for the connector to run your 3270 screen-driven app.

  After you download and install this tool, [follow these steps to connect with your TN3270 host server, design the required metadata artifact, and generate the HIDX file](/host-integration-server/core/application-integration-la3270apps).

- The Standard or Consumption logic app resource and workflow where you want to run your 3270 screen-driven app

  The IBM 3270 connector doesn't have triggers, so use any trigger to start your workflow, such as the **Recurrence** trigger or **Request** trigger. You can then add the 3270 connector actions.

- An [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md), which is required based on the 3270 connector version that you use and is an Azure resource where you can centrally store B2B artifacts such as trading partners, agreements, maps, schemas, and certificates to use with specific workflow actions.

  | Workflow | Description |
  |----------|-------------|
  | Standard | - 3270 built-in connector: Upload HIDX file to Standard logic app resource. <br><br>- 3270 managed connector: Upload HIDX file to your Standard logic app resource or your [linked integration account](../logic-apps/enterprise-integration/create-integration-account.md?tabs=standard#link-to-logic-app). |
  | Consumption | 3270 managed connector: Upload HIDX file to your [linked integration account](../logic-apps/enterprise-integration/create-integration-account.md?tabs=consumption#link-to-logic-app). |

  For more information, see [Upload the HIDX file](#upload-hidx-file).

<a name="upload-hidx-file"></a>

## Upload the HIDX file

For your workflow to use the HIDX file, follow these steps:

### [Standard](#tab/standard)

1. Go to the folder where you saved your HIDX file, and copy the file.

1. In the [Azure portal](https://portal.azure.com), choose the following steps, based on the connector version:

      - 3270 built-in connector: [Upload your HIDX file to your Standard logic app resource](../logic-apps/logic-apps-enterprise-integration-maps.md?tabs=standard#add-map-to-standard-logic-app-resource).

      - 3279 managed connector:

        - [Upload your HIDX file to a linked integration account](../logic-apps/logic-apps-enterprise-integration-maps.md?tabs=standard#add-map-to-integration-account). Make sure that you select **HIDX** as the **Map type**.

        - [Upload your HIDX file to your Standard logic app resource](../logic-apps/logic-apps-enterprise-integration-maps.md?tabs=standard#add-map-to-standard-logic-app-resource).

1. Now, [add an IBM 3270 action to your workflow](#add-ibm-3270-action).

### [Consumption](#tab/consumption)

1. Go to the folder where you saved your HIDX file, and copy the file.

1. In the [Azure portal](https://portal.azure.com), [upload the HIDX file as a map artifact to your linked integration account](../logic-apps/logic-apps-enterprise-integration-maps.md?tabs=consumption#add-map-to-integration-account). Make sure that you select **HIDX** as the **Map type**.

1. Now, [add an IBM 3270 action to your workflow](#add-ibm-3270-action).

---

Later in this guide, when you add an **IBM 3270** connector action to your workflow for the first time, you're prompted to create a connection between your workflow and the mainframe system. After you create the connection, you can select your previously added HIDX file, the method to run, and the parameters to use.

<a name="add-ibm-3270-action"></a>

## Add an IBM 3270 action

A Standard logic app workflow can use the IBM 3270 managed connector and the IBM 3270 built-in connector. However, a Consumption logic app workflow can use only the IBM 3270 managed connector. Each version has different actions. Based on whether you have a Consumption or Standard logic app workflow, follow the corresponding steps:

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow where you've already add a trigger.

1. If you haven't already added a trigger, [follow these general steps to add the trigger that you want to your workflow](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger).

   This example continues with the **Request** trigger named **When a HTTP request is received**.

1. [Follow these general steps to add the **IBM 3270** built-in connector action named **Execute a navigation plan**](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. When the connection information box appears, provide the following necessary parameter values:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Connection Name** | Yes | <*connection-name*> | A name for your connection |
   | **Code Page** | No | <*code-page*> | The code page number for the host to use for converting text. If left blank, the connector uses `37` as the default value. |
   | **Device Type** | No | <*IBM-terminal-model*> | The model name or number for the IBM terminal to emulate. If left blank, the connector uses default values. |
   | **Log Exception Screens** | No | True or false | Log the host screen if an error occurs during screen navigation. |
   | **Logical Unit Name** | No | <*logical-unit-name*> | The specific logical unit name to request from the host |
   | **Port Number** | No | <*TN3270-server-port*> | The port used by your TN3270 server. If left blank, the connector uses `23` as the default value. |
   | **Server** | Yes | <*TN3270-server-name*> | The server name for your TN3270 service |
   | **Timeout** | No | <*timeout-seconds*> | The timeout duration in seconds while waiting for screens |
   | **Use TLS** | No | On or off | Turn on or turn off TLS encryption. |
   | **Validate TN3270 Server Certificate** | No | On or off | Turn on or turn off validation for the server's certificate. |

   For example:

   :::image type="content" source="./media/integrate-3270-apps-ibm-mainframe/connection-properties-standard.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and IBM 3270 connection properties." lightbox="./media/integrate-3270-apps-ibm-mainframe/connection-properties-standard.png":::

1. When you're done, select **Create New**.

1. When the action information box appears, provide the necessary parameter values:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **HIDX Name** | Yes | <*HIDX-file-name*> | Select the 3270 HIDX file that you want to use. |
   | **Method Name** | Yes | <*method-name*> | Select the method in the HIDX file that you want to use. After you select a method, the **Add new parameter** list appears so you can select parameters to use with that method. |
   | **Advanced parameters** | No | Varies | This list appears after you select a method so that you can add other parameters to use with the selected method. The available parameters vary based on your HIDX file and the method that you select. |

   For example:

   **Select the HIDX file**

   :::image type="content" source="./media/integrate-3270-apps-ibm-mainframe/select-hidx-file-standard.png" alt-text="Screenshot shows Standard workflow designer, 3270 action, and selected HIDX file." lightbox="./media/integrate-3270-apps-ibm-mainframe/select-hidx-file-standard.png":::

   **Select the method**

   :::image type="content" source="./media/integrate-3270-apps-ibm-mainframe/select-method-standard.png" alt-text="Screenshot shows Standard workflow designer, 3270 action, and selected method." lightbox="./media/integrate-3270-apps-ibm-mainframe/select-method-standard.png":::

   **Select the parameters**

   :::image type="content" source="./media/integrate-3270-apps-ibm-mainframe/add-parameters-standard.png" alt-text="Screenshot shows Standard workflow designer, 3270 action, and more parameters." lightbox="./media/integrate-3270-apps-ibm-mainframe/add-parameters-standard.png":::

1. When you're done, save your workflow. On designer toolbar, select **Save**.

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource and workflow where you've already add a trigger.

1. If you haven't already added a trigger, [follow these general steps to add the trigger that you want to your workflow](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=consumption#add-trigger).

   This example continues with the **Request** trigger named **When a HTTP request is received**.

1. [Follow these general steps to add the **IBM 3270** managed connector action named **Run a mainframe program over a TN3270 connection**](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=consumption#add-action). You can find the connector under the **Enterprise** category.

1. When the connection information box appears, provide the following necessary parameter values:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Connection name** | Yes | <*connection-name*> | A name for your connection |
   | **Integration Account ID** | Yes | <*integration-account-name*> | Your integration account's name |
   | **Integration Account SAS URL** | Yes | <*integration-account-SAS-URL*> | Your integration account's Shared Access Signature (SAS) URL, which you can generate from your integration account's settings in the Azure portal. <p>1. On your integration account menu, under **Settings**, select **Callback URL**. <br>2. In the right-hand pane, copy the **Generated Callback URL** value. |
   | **Server** | Yes | <*TN3270-server-name*> | The server name for your TN3270 service |
   | **Port** | No | <*TN3270-server-port*> | The port used by your TN3270 server. If left blank, the connector uses `23` as the default value. |
   | **Device Type** | No | <*IBM-terminal-model*> | The model name or number for the IBM terminal to emulate. If left blank, the connector uses default values. |
   | **Code Page** | No | <*code-page-number*> | The code page number for the host. If left blank, the connector uses `37` as the default value. |
   | **Logical Unit Name** | No | <*logical-unit-name*> | The specific logical unit name to request from the host |
   | **Enable SSL?** | No | On or off | Turn on or turn off TLS encryption. |
   | **Validate host ssl certificate?** | No | On or off | Turn on or turn off validation for the server's certificate. |

   For example:

   :::image type="content" source="./media/integrate-3270-apps-ibm-mainframe/connection-properties-consumption.png" alt-text="Screenshot shows Azure portal, Consumption workflow designer, and IBM 3270 connection properties." lightbox="./media/integrate-3270-apps-ibm-mainframe/connection-properties-consumption.png":::

1. When you're done, select **Create**.

1. When the action information box appears, provide the necessary parameter values:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **HIDX Name** | Yes | <*HIDX-file-name*> | Select the 3270 HIDX file that you want to use. |
   | **Method Name** | Yes | <*method-name*> | Select the method in the HIDX file that you want to use. After you select a method, the **Add new parameter** list appears so you can select parameters to use with that method. |
   | **Add new parameter** | No | Varies | This list appears after you select a method so that you can add other parameters to use with the selected method. The available parameters vary based on your HIDX file and the method that you select. |

   For example:

   **Select the HIDX file**

   :::image type="content" source="./media/integrate-3270-apps-ibm-mainframe/select-hidx-file-consumption.png" alt-text="Screenshot shows Consumption workflow designer, 3270 action, and selected HIDX file." lightbox="./media/integrate-3270-apps-ibm-mainframe/select-hidx-file-consumption.png":::

   **Select the method**

   :::image type="content" source="./media/integrate-3270-apps-ibm-mainframe/select-method-consumption.png" alt-text="Screenshot shows Consumption workflow designer, 3270 action, and selected method." lightbox="./media/integrate-3270-apps-ibm-mainframe/select-method-consumption.png":::

   **Select the parameters**

   :::image type="content" source="./media/integrate-3270-apps-ibm-mainframe/add-parameters-consumption.png" alt-text="Screenshot shows Consumption workflow designer, 3270 action, and selected parameters." lightbox="./media/integrate-3270-apps-ibm-mainframe/add-parameters-consumption.png":::

1. When you're done, save your workflow. On designer toolbar, select **Save**.

---

## Test your workflow

### [Standard](#tab/standard)

1. To run your workflow, on the designer, select workflow menu, select **Overview**. On the **Overview** toolbar, select **Run** > **Run**.

   After your workflow finishes running, your workflow's run history appears. Successful steps show check marks, while unsuccessful steps show an exclamation point (**!**).

1. To review the inputs and outputs for each step, expand that step.

1. To review the outputs, select **See raw outputs**.

1. To review the inputs and outputs for each step, expand that step.

1. To review the outputs, select **See raw outputs**.

### [Consumption](#tab/consumption)

1. To run your workflow, on the designer toolbar, select **Run Trigger** > **Run**.

   After your workflow finishes running, your workflow's run history appears. Successful steps show check marks, while unsuccessful steps show an exclamation point (**!**).

1. To review the inputs and outputs for each step, expand that step.

1. To review the outputs, select **See raw outputs**.

1. To review the inputs and outputs for each step, expand that step.

1. To review the outputs, select **See raw outputs**.

---

## Next steps

- [Monitor workflow run status, review trigger and workflow run history, and set up alerts in Azure Logic Apps](../logic-apps/monitor-logic-apps.md?tabs=standard)
- [View metrics for workflow health and performance in Azure Logic Apps](../logic-apps/view-workflow-metrics.md?tabs=standard)
- [Monitor and collect diagnostic data for workflows in Azure Logic Apps](../logic-apps/monitor-workflows-collect-diagnostic-data.md?tabs=standard)
- [Enable and view enhanced telemetry in Application Insights for Standard workflows in Azure Logic Apps](../logic-apps/enable-enhanced-telemetry-standard-workflows.md)
