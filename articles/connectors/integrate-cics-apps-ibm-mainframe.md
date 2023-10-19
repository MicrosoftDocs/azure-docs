---
title: Connect to CICS programs on IBM mainframes
description: Integrate with CICS programs with Azure by using Azure Logic Apps and IBM CICS connector
services: logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 02/03/2021
tags: connectors
---

# Integrate CICS Programs on IBM mainframes with Azure by using Azure Logic Apps and the IBM CICS connector

With Azure Logic Apps and the IBM CICS connector, you can access and run IBM mainframe apps running on Customer Information Control System (CICS) systems. CICS provides a transaction program (TP) Monitor with an integrated Transaction Manager (TM). The connector communicates with IBM CICS transaction programs by using TCP/IP. The CICS connector is available in all Azure Logic Apps regions except for Azure Government and Microsoft Azure operated by 21Vianet. If you're new to logic apps, review [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

This article describes these aspects for using the CICS connector: 

* Why use the IBM CICS connector in Azure Logic Apps

* The prerequisites and setup for using the CICS connector

* The steps for adding CICS connector actions to your logic app

## Why use this connector?

CICS systems are one of the first Mission Critical systems in the world of Computing running on Mainframes. Host Integration Server provides connectivity to CICS systems via TCP/IP, HTTP and and APPC LU6.2. Customers have been using our Host Integration Server Transaction Integrator feature to integrate their CICS systems with the windows world for many years. Our Azure Logic Apps connector uses TCP/IP and HTTP [Programming Models](/host-integration-server/core/choosing-the-appropriate-programming-model1) to interact with CICS Transaction Programs. The following diagram illustrate the CICS Connector interacting with an IBM Mainframe system:

:::image type="content" source="media/integrate-cics-apps-ibm-mainframe/la-cics-connector1.png" alt-text="CICS Connector":::

To extend those scenarios, the CICS Connector in Azure Logic Apps works with the HIS Designer for Azure Logic Apps, which is used to create a “Program Definition” or “Program Map” of the Mainframe Transaction Program. To do this, it uses a [Programming Model](/host-integration-server/core/choosing-the-appropriate-programming-model1) that determines the characteristics of the data exchange between the Mainframe and the Logic Apps workflow.  The HIS Designerfor Logic Apps is used to convert that information into metadata that the CICS connector uses when calling an action that represents that task from your logic app.
After you generate the metadata file from the HIS Designer, you add that file to the logic app maps artifacts in Azure. That way, your logic app can access your app's metadata when you add a CICS connector action. The connector reads the metadata file from your logic app, and dynamically presents the parameters for the CICS connector. You can then provide parameters to the host application, and the connector returns the results to your logic app. That way, you can integrate your legacy apps with Azure, Microsoft, and other apps, services, and systems that Azure Logic Apps supports.

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, 
[sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Basic knowledge about [logic app workflows](../logic-apps/logic-apps-overview.md)

* The logic app to use to integrate with the IBM CICS system

  The IBM CICS connector doesn't have triggers, so use another trigger to start your logic app, such as the **Recurrence** trigger. You can then add the CICS connector actions. To get started, create a blank logic app workflow.

* [Download and install the HIS Designer for Logic Apps](https://aka.ms/3270-design-tool-download).
The only prerequisite is [Microsoft .NET Framework 4.8](https://aka.ms/net-framework-download).

  This tool helps you define the methods, and parameters for the tasks in your app that you add and run as CICS connector actions. The tool generates a Host Integration Designer XML (HIDX) file that provides the necessary metadata for the connector to use for driving your mainframe app. If you are using Host Integration Server, then you can leverage the TI Designer to create the HIDX file.
  
* Access to the Mainframe that hosts the CICS System.

<a name="define-app-metadata"></a>

## Generating the Metadata

To effectively invoke a Mainframe Program, logic apps need to understand the type, parameters and return values of it. The CICS connector manages the process and data conversions necessary to allow input data to be provided to the Mainframe Programs from the logic app workflow and to send any output data generated from the Mainframe Program to the workflow. The IBM CICS connector provides data type conversion, tabular data definition, and code page translation.

For this process to begin, Azure Logic Apps requires this information be provided as metadata. This metadata is created with the [HIS Designer for Logic Apps](/host-integration-server/core/application-integration-ladesigner-2.md). The Designer allows a manual creation of methods that will then be used by the logic app. It also can import mainframe COBOL program definitions (copybooks) that provide all this program structures.

After downloading and installing the HIS Designer for Logic Apps, follow the steps here: [Designing Artifacts for Host Applications](/host-integration-server/core/application-integration-lahostapps.md) to generate the HIDX file from the metadata artifact.

## Upload the HIDX file

To be able to use the HIDX file, you will need to conduct the following steps:

1. Go to the directory where you saved the HIDX file and copy it.
1. Sign in to the Azure portal, and find your integration account.
1. Add your HIDX file as a map to your logic app, under artifacts then maps.

Later in this topic, when you add an IBM CICS action to your logic app for the first time, you're prompted to create a connection between your logic app and the mainframe server by providing connection information, such as the names for your host server and CICS system configuration information. After you create the connection, you can select your previously added HIDX file, the method to run, and the parameters to use.

When you finish all these steps, you can use the action that you created in your logic app for connecting to your IBM mainframe, enter data, return results, and so on. You can also continue adding other actions to your logic app for integrating with other apps, services, and systems.

## Run IBM CICS action

To run the IBM CICS action, follow the instructions below:

1. In the Azure portal, open your logic app, if not already open.
1. Under the Workflow section, create a new workflow by selecting on **Workflows** and then **Add**. Enter a Workflow name, type and select **Create**.
1. Select on the recently created workflow.
1. Select on **Designer**

   :::image type="content" source="media/integrate-cics-apps-ibm-mainframe/la-CICS-connector2.png" alt-text="Select Designer":::

1. As this connector provides only one action, to start your logic app, select a separate trigger, for example, the Request trigger. The example in this article uses the Request trigger. Then the “When a HTTP request is received” action.

   :::image type="content" source="media/integrate-cics-apps-ibm-mainframe/la-CICS-connector3.png" alt-text="Request trigger":::

1. Select in the **+** icon to add another action.
1. Type CICS in Add an Action page and then select **Call a CICS Program**

   :::image type="content" source="media/integrate-cics-apps-ibm-mainframe/la-CICS-connector4.png" alt-text="Call an CICS Program":::

1. The Create connection page will appear. Complete all the information following the guidance in each text box and then select on **Create New**:


   |Property  |Required  |Value  |Description  |
   |---------|---------|---------|---------|
   |**Connection Name**     |    Yes     |  <*connection-name*>     |   The name for your connection      |
   |**Programming Model**     |   Yes      | <*CICS-programming-model*>        |      The selected Programming model for CICS   |
   |**Code Page**     |    No     | <*code-page*>         | The code page number to use for converting text         |
   |**Password**     |     No    | <*password*>         | The optional user password for connection authentication         |
   |**Port Number**     |   Yes      | <*port-number*>         | The port number to use for connection authentication         |
   |**Server Name**     | Yes        | <*server-name*>         | The server name         |
   |**Time out**     |   No      | <*time-out*>         | The timeout period in seconds while waiting for responses from the server         |
   |**User Name**     |       No  | <*user-Name*>         | The optional username for connection authentication         |
   |**Use TLS**     |     No    | <*tls*>         | Secure the connection with Transport Security Layer (TLS)          |
   |**Validate Server certificate**     |  No       | <*validate-server-certificate*>         | Validate the server's certificate         |
   |**Server certificate common name**     |   No      |<*server-cert-common-name*>         | The name of the Transport Security layer (TLS) certificate to use         |
   |**Use IBM Request Header Format**     |  No       | <*IBM-request-header*>         | The server expects ELM or TRM headers in the IBM format         |

   For example:

   ![Connection properties](./media/integrate-cics-apps-ibm-mainframe/la-cics-connector5.png)

1. In the **Parameters** section, provide the necessary information for the action:

   |Property  |Required  |Value  |Description  |
   |---------|---------|---------|---------|
   |**Hidx Name**      |   Yes      |     <*HIDX-file-name*>    |   Select the CICS HIDX file that you want to use.      |
   |**Method Name**     |   Yes      |      <*method-name*>   |  Select the method in the HIDX file that you want to use. After you select a method, the **Add new parameter** list appears so you can select parameters to use with that method.       |
   ||||

   For example:

   **Select the HIDX file and Method**

   ![Select HIDX file](./media/integrate-cics-apps-ibm-mainframe/la-cics-connector6.png)


   **Select the parameters**

   ![Select parameters](./media/integrate-cics-apps-ibm-mainframe/la-cics-connector7.png)

1. When you're done, save and run your logic app.

   After your logic app finishes running, the steps from the run appear. 
   Successful steps show check marks, while unsuccessful steps show the letter "X".

1. To review the inputs and outputs for each step, expand that step.

1. To review the outputs, select **See raw outputs**.

## Connector reference

For more technical details about this connector, such as triggers, actions, and limits as described by the connector's Swagger file, see the [connector's reference page](/connectors/si3270/).


## Next steps

* [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
* [Built-in connectors for Azure Logic Apps](built-in.md)
