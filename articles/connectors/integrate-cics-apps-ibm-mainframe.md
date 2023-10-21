---
title: Connect to CICS programs on IBM mainframes
description: Integrate CICS programs with workflows in Azure Logic Apps using the IBM CICS Program Call connector.
services: logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 10/23/2023
tags: connectors
---

# Integrate CICS programs on IBM mainframes with Standard workflows in Azure Logic Apps using the CICS Program Call connector (preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To access and run IBM mainframe apps on Customer Information Control System (CICS) systems from Standard workflows in Azure Logic Apps, you can use the **CICS Program Call** built-in, service provider-based connector. CICS provides a Transaction Program (TP) Monitor with an integrated Transaction Manager (TM). The connector communicates with IBM CICS transaction programs by using TCP/IP. The CICS connector is available in all Azure Logic Apps regions except for Azure Government and Microsoft Azure operated by 21Vianet.

This how-to guide describes the following aspects about the CICS connector:

* Why use the CICS connector in Azure Logic Apps

* Prerequisites and setup for using the CICS connector

* Steps for adding CICS connector actions to your Standard logic app workflow

## Why use this connector?

CICS systems were one of the first mission-critical systems that run on mainframes. Microsoft [Host Integration Server (HIS)](/host-integration-server/what-is-his) provides connectivity to CICS systems using TCP/IP, HTTP, and APPC LU6.2. Customers have used the HIS Transaction Integrator (TI) to integrate CICS systems with Windows on premises for many years. The **CICS Program Call** connector uses TCP/IP and HTTP [programming models](/host-integration-server/core/choosing-the-appropriate-programming-model1) to interact with CICS transaction programs.

The following diagram shows how the CICS connector interacts with an IBM mainframe system:

:::image type="content" source="media/integrate-cics-apps-ibm-mainframe/cics-connector-overview.png" alt-text="Conceptual diagram showing how the CICS Program Call connector works with IBM mainframe system.":::

To extend those scenarios, the CICS connector in a Standard workflow works with the HIS Designer for Azure Logic Apps, which you can use to create a *program definition* or *program map* of the mainframe transaction program. For this task, the HIS Designer uses a [programming model](/host-integration-server/core/choosing-the-appropriate-programming-model1) that determines the characteristics of the data exchange between the mainframe and the workflow. The HIS Designer converts that information into metadata that the CICS connector uses when calling an action that represents that task from your workflow. The CICS connector provides data type conversion, tabular data definition, and code page translation.

After you generate the metadata file from the HIS Designer, you add that file as a map artifact to the Standard logic app resource in Azure. That way, your logic app workflow can access your app's metadata when you add a CICS connector action. The connector reads the metadata file from your logic app resource, and dynamically presents the parameters for the CICS connector. You can then provide parameters to the host application, and the connector returns the results to your workflow. That way, you can integrate your legacy apps with Azure, Microsoft, and other apps, services, and systems that Azure Logic Apps supports.

## Connector technical reference


## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Access to the mainframe that hosts the CICS system

* The Host Integration Designer XML (HIDX) file that provides the necessary metadata for the **CICS Program Call** connector to drive your mainframe app.

  To create this HIDX file, [download and install the HIS Designer for Azure Logic Apps](https://aka.ms/his-desiner-logicapps-download). The only prerequisite is [Microsoft .NET Framework 4.8](https://aka.ms/net-framework-download).

  To invoke a mainframe program, your workflow needs to understand the mainframe program's type, parameters, and return values. The CICS connector manages the process and data conversions, which are required for providing input data from the workflow to the mainframe program and for sending any output data generated from the mainframe program to the workflow. For this process, Azure Logic Apps requires that you provide this information as metadata.

  To create this metadata, use the [HIS Designer for Logic Apps](/host-integration-server/core/application-integration-ladesigner-2). With this tool, you can manually create the methods that your workflow uses and define the methods and parameters for the tasks in your app. These tasks are represented as CICS connector actions that you add and run in your workflow. You can also import mainframe COBOL program definitions (copybooks) that provide all these program structures by using the designer.

  The tool generates a Host Integration Designer XML (HIDX) file that provides the necessary metadata for the connector to use for driving your mainframe app. If you are using HIS, you can use the TI Designer to create the HIDX file.

* The Standard logic app workflow to use for integrating with the IBM CICS system

  The IBM CICS connector doesn't have triggers, so use any trigger to start your workflow, such as the **Recurrence** trigger or **Request** trigger. You can then add the CICS connector actions. To get started, create a blank workflow in your Standard logic app resource.

<a name="define-generate-app-metadata"></a>

## Define and generate metadata

After you download and install the HIS Designer for Azure Logic Apps, follow [these steps to generate the HIDX file from the metadata artifact](/host-integration-server/core/application-integration-lahostapps).

## Upload the HIDX file

For your workflow to use the HIDX file, follow these steps:

1. Go to the directory where you saved your HIDX file, and copy the file.

1. In the [Azure portal](https://portal.azure.com), choose either option:

   - [Upload the HIDX file as a map to your Standard logic app resource](../logic-apps/logic-apps-enterprise-integration-maps.md?tabs=standard#add-map-to-standard-logic-app-resource) 

   - [Upload the HIDX file as a map to an integration account](../logic-apps/logic-apps-enterprise-integration-maps.md?tabs=standard#add-map-to-integration-account).

     > [!NOTE]
     >
     > To use artifacts in an integration account from your workflow, make sure that the integration account is 
     > [linked to your Standard logic app resource](../logic-apps/enterprise-integration/create-integration-account.md?tabs=azure-portal%2Cstandard).

1. Now, [add a CICS action to your workflow](#add-cics-action).

Later in this guide, when you add a **CICS Program Call** connector action to your workflow for the first time, you're prompted to create a connection between your workflow and the mainframe system. After you create the connection, you can select your previously added HIDX file, the method to run, and the parameters to use.

<a name="add-cics-action"></a>

## Add a CICS action

After you finish all these steps, you can use the action that you added to your workflow to your IBM mainframe, enter data, return results, and so on. You can also continue adding other actions to your workflow for integrating with other apps, services, and systems.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow in the designer.

1. If you haven't already added a trigger to start your workflow, [follow these general steps to add the trigger that you want](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger).

   This example continues with the **Request** trigger named **When a HTTP request is received**.

   :::image type="content" source="media/integrate-cics-apps-ibm-mainframe/request-trigger.png" alt-text="Screenshot showing Azure portal, Standard workflow designer, and Request trigger.":::

1. To add a CICS connector action, [follow these general steps to add the **CICS Program Call** built-in connector action named **Call a CICS Program**](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger).

1. After the connection details pane appears, provide the following information, such as the host server name and CICS system configuration information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Connection Name** | Yes | <*connection-name*> | The name for your connection |
   | **Programming Model** | Yes | <*CICS-programming-model*> | The selected Programming model for CICS. For more information, see [Programming Models](/host-integration-server/core/programming-models2) and [Choosing the Appropriate Programming Model](/host-integration-server/core/programming-models2). |
   | **Code Page** | No | <*code-page*> | The code page number to use for converting text |
   | **Password** | No | <*password*> | The optional user password for connection authentication |
   | **Port Number** | Yes | <*port-number*> | The port number to use for connection authentication |
   | **Server Name** | Yes | <*server-name*> | The server name |
   | **Timeout** | No | <*time-out*> | The timeout period in seconds while waiting for responses from the server |
   | **User Name** | No | <*user-Name*> | The optional username for connection authentication |
   | **Use TLS** | No | True or false | Secure the connection with Transport Security Layer (TLS). |
   | **Validate Server certificate** | No | True or false | Validate the server's certificate. |
   | **Server certificate common name** | No | <*server-cert-common-name*> | The name of the Transport Security layer (TLS) certificate to use |
   | **Use IBM Request Header Format** | No | True or false | The server expects ELM or TRM headers in the IBM format |

   For example:

   :::image type="content" source="./media/integrate-cics-apps-ibm-mainframe/cics-connection.png" alt-text="Screenshot showing CICS action's connection properties.":::

1. When you're done, select **Create New**.

1. After the action details pane appears, in the **Parameters** section, provide the required information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **HIDX Name** | Yes | <*HIDX-file-name*> | Select the CICS HIDX file that you want to use. |
   | **Method Name** | Yes | <*method-name*> | Select the method in the HIDX file that you want to use. |
   | **Advanced parameters** | This list appears after you select a method so that you can add other parameters to use with the selected method. |

   For example:

   **Select HIDX file and method**

   :::image type="content" source="./media/integrate-cics-apps-ibm-mainframe/action-parameters.png" alt-text="Screenshot showing CICS action with selected HIDX file and method.":::

   **Select advanced parameters**

   :::image type="content" source="./media/integrate-cics-apps-ibm-mainframe/action-advanced-parameters.png" alt-text="Screenshot showing CICS action with all parameters.":::

1. When you're done, save your workflow. On designer toolbar, select **Save**.

## Test your workflow

1. To run your workflow, on the workflow menu, select **Overview**. On the **Overview** toolbar, select **Run** > **Run**.

   After your workflow finishes running, your workflow's run history appears. Successful steps show check marks, while unsuccessful steps show an eclamation point (**!**).

1. To review the inputs and outputs for each step, expand that step.

1. To review the outputs, select **See raw outputs**.

## Next steps

* [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
* [Built-in connectors for Azure Logic Apps](built-in.md)
