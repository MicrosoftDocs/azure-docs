---
title: Change data capture from SAP to Microsoft Fabric with Azure Data Factory
description: This tutorial describes how to use change data capture with SAP to import data to a Microsoft Fabric OneLake with Azure Data Factory.
author: ukchrist
ms.topic: tutorial
ms.date: 12/18/2024
ms.author: ulrichchrist
ms.custom: pipelines, sfi-image-nochange
---

# Change data capture from SAP to Microsoft Fabric OneLake with Azure Data Factory

Azure Data Factory (ADF) and Azure Synapse Analytics come with the SAP change data capture (CDC) connector (for an introduction see [Overview and architecture of the SAP CDC capabilities](/azure/data-factory/sap-change-data-capture-introduction-architecture) or [General availability of SAP CDC capabilities for Azure Data Factory and Azure Synapse Analytics](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/general-availability-of-sap-cdc-capabilities-for-azure-data/ba-p/3650246)), which provides built-in change data capture capabilities covering various SAP sources. Many customers use this connector to establish a change data feed from SAP into Delta tables in ADLS Gen2, which is a great storage option for the inbound (also referred to as _bronze_) layer in a Lakehouse architecture.

This article describes how to use the SAP CDC connector to create your inbound layer directly in Microsoft Fabric OneLake using ADF or Synapse.

The two scenarios are similar in setup, with the main difference being the sink configuration. In fact, as the following diagram suggests, you can simply clone a dataflow writing into Delta tables in Azure Data Lake Storage (ADLS) Gen2, change the sink configuration according to this document, and you’re ready to go.

If you plan to migrate your SAP data from ADLS Gen2 into Microsoft Fabric, you can even redirect an existing CDC dataflow from ADLS Gen2 to OneLake by adjusting the sink configuration. After changing the sink, you can resume the original CDC process, allowing you to seamlessly migrate to Fabric without a cumbersome reinitialization.

:::image type="content" source="media/change-data-capture-sap-onelake-azure-data-factory/architecture-diagram.png" alt-text="Diagram of the architecture for SAP change data capture to OneLake using Azure Data Factory.":::

## Getting started

To follow this article step-by-step in your own environment, you need the following resources:

- An Azure Data Factory or Synapse Analytics workspace.
- A Microsoft Fabric workspace with a Lakehouse.
- An SAP system that satisfies the requirements for ADF’s SAP CDC connector specified here. In our scenario, we use an SAP S/4HANA on-premises 2023 FPS00, but all up-to-date versions of SAP ECC, SAP BW, SAP BW/4HANA, etc. are supported as well.
- A self-hosted integration runtime (SHIR) with a current version of the SAP .NET Connector installed.

In order to concentrate on the connectivity part, here’s a pipeline template that covers the most straightforward scenario of extracting change data using the SAP CDC connector and merging it with a Fabric Lakehouse table without any further transformations: https://github.com/ukchrist/ADF-SAP-data-flows/blob/main/p_SAPtoFabric.zip. If you’re familiar with ADF mapping dataflows and SAP CDC, you can set up a scenario from scratch by yourself and skip to the following configuration of the Lakehouse linked service.

To make use of the template, the following steps are required:

1. Create three linked services to connect to the SAP source, the staging folder, and the Fabric Lakehouse.
1. Import the template into your ADF or Synapse workspace.
1. Configure the template with a source object from your SAP system and a sink table.

## Setting up connectivity to the SAP source system

To connect your SAP source system to ADF or Synapse with the SAP CDC connector, you need a self-hosted integration runtime. The installation procedure is described here: [Set up a self-hosted integration runtime for the SAP CDC connector](/azure/data-factory/sap-change-data-capture-shir-preparation). For the self-hosted integration runtime to connect to the SAP source system via SAP’s RFC protocol, download and install the SAP .NET Connector as described here: [Download and install the SAP .NET connector](/azure/data-factory/sap-change-data-capture-shir-preparation#download-and-install-the-sap-net-connector).

Next, create an SAP CDC linked service. Details can be found here: [Set up a linked service and dataset for the SAP CDC connector](/azure/data-factory/sap-change-data-capture-prepare-linked-service-source-dataset). For this, you need the SAP system connection parameters (application/message server, instance number, client ID) and user credentials to connect to the SAP system. For details on the configuration required for this SAP user read this document: [Set up the SAP user](/azure/data-factory/sap-change-data-capture-prerequisites-configuration#set-up-the-sap-user).

Creating an SAP CDC dataset as described in the document on linked service configuration is optional - mapping data flows offer a leaner option to define the dataset properties inline in the data flow itself. The pipeline template provided here uses such an inline dataset definition.

## Setting up ADLS Gen2 connectivity for staging

Before writing the change data from the SAP source system into the sink, it's staged into a folder in ADLS Gen2. From there, the mapping data flow runtime picks up the data and processes it according to the steps defined in the data flow. The data flow provided as part of the template merges the changes with the existing data in the sink table and thus give you an up-to-date copy of the source.

Setup of an ADLS Gen2 linked service is described here: [Create an Azure Data Lake Storage Gen2 linked service using UI](/azure/data-factory/connector-azure-data-lake-storage?tabs=data-factory#create-an-azure-data-lake-storage-gen2-linked-service-using-ui).

## Retrieving the Fabric workspace ID and Lakehouse object ID

To collect the required Fabric workspace ID and Lakehouse object ID in Microsoft Fabric, complete the following steps:

1. Navigate to your Lakehouse in Microsoft Fabric.

   :::image type="content" source="media/change-data-capture-sap-onelake-azure-data-factory/navigate-to-fabric-lakehouse.png" alt-text="Screenshot showing where to navigate to the Fabric Lakehouse.":::

1. Once the Lakehouse experience opens in the browser, copy the browser URL. It has the following format:

   ``https://xxxxxx.powerbi.com/groups/``**&lt;workspace ID&gt;**``/lakehouses/``**&lt;lakehouse ID&gt;**

   Copy the **&lt;workspace ID&gt;** and **&lt;lakehouse ID&gt;** from the URL.

## Configuring the service principal

Configuring the service principle requires two steps. First, create the service principal in Microsoft Entra ID. Then, add the service principal as a member to the Fabric workspace.

Let’s start with Microsoft Entra ID.

1. Navigate to Azure portal and select **Microsoft Entra ID** from the left-hand side menu. Copy the **Tenant ID** for later use.

   :::image type="content" source="media/change-data-capture-sap-onelake-azure-data-factory/capture-microsoft-entra-id.png" lightbox="media/change-data-capture-sap-onelake-azure-data-factory/capture-microsoft-entra-id.png" alt-text="Screenshot showing where to find the Microsoft Entra ID in the Azure portal.":::

1. To create the service principal, select **App registrations** and **+ New registration**.

   :::image type="content" source="media/change-data-capture-sap-onelake-azure-data-factory/create-new-service-principal.png" lightbox="media/change-data-capture-sap-onelake-azure-data-factory/create-new-service-principal.png" alt-text="Screenshot showing where to create a new service principal app registration.":::

1. Enter a **Name** for the application. The name is the same as the service principal name, so copy it for later use.
1. Select **Accounts in this organizational directory only**.
1. Then select **Register**.

   :::image type="content" source="media/change-data-capture-sap-onelake-azure-data-factory/register-application.png" lightbox="media/change-data-capture-sap-onelake-azure-data-factory/register-application.png" alt-text="Screenshot showing where to provide the new app registration name and account type.":::

1. Copy the **Application (client) ID**. This step is required in the linked service definition in ADF later. Then select **Add a certificate or secret**.

   :::image type="content" source="media/change-data-capture-sap-onelake-azure-data-factory/add-certificate-or-secret.png" lightbox="media/change-data-capture-sap-onelake-azure-data-factory/add-certificate-or-secret.png" alt-text="Screenshot showing where to find the Application (client) ID and add a certificate or secret.":::

1. Select **+ New client secret**. Add a **Description** and **expiration policy**.

   :::image type="content" source="media/change-data-capture-sap-onelake-azure-data-factory/add-new-client-secret.png" lightbox="media/change-data-capture-sap-onelake-azure-data-factory/add-new-client-secret.png" alt-text="Screenshot showing where to add a new client secret, description, and expiration policy.":::

1. Copy the **Value** of the client secret. This step completes the service principal configuration in Microsoft Entra ID.

   :::image type="content" source="media/change-data-capture-sap-onelake-azure-data-factory/client-secret-value.png" lightbox="media/change-data-capture-sap-onelake-azure-data-factory/client-secret-value.png" alt-text="Screenshot showing where to find the client secret value.":::

Next, we add the service principal as a **contributor** or **admin** to your Microsoft Fabric workspace.

1. Navigate to your workspace and select **Manage access**.

1. Enter the **name** of the service principal, select the **Contributor** or **Admin** role and select **Add**. The service principal can now be used to connect ADF to your workspace.

## Create the Lakehouse linked service in ADF or Synapse

Now we’re ready to configure the Lakehouse linked service in ADF or Synapse.

1. Open your ADF or Synapse workspace, select the **Manage** tool and select **Linked services**. Then select **+ New**.

   :::image type="content" source="media/change-data-capture-sap-onelake-azure-data-factory/add-new-linked-service.png" lightbox="media/change-data-capture-sap-onelake-azure-data-factory/add-new-linked-service.png" alt-text="Screenshot showing where to add a new linked service in ADF or Synapse.":::

1. Search for “Lakehouse”, select the **Microsoft Fabric Lakehouse** linked service type, and select **Continue**.

   :::image type="content" source="media/change-data-capture-sap-onelake-azure-data-factory/new-fabric-lakehouse-linked-service.png" alt-text="Screenshot showing how to find the Microsoft Fabric Lakehouse linked service.":::

1. Assign a **Name** to the linked service, select **Enter manually** and configure the **Fabric workspace ID** and **Lakehouse object ID** values copied from the Fabric URL earlier.

   - In the **Tenant** property, provide the Tenant ID you copied in step 1 of the service principal configuration in Microsoft Entra ID.
   - For **Service principal ID**, provide the Application (client) ID (not the service principal name!) copied in step 6 of the service principal configuration.
   - For **Service principal key**, provide the client secret value copied in step 8 of the service principal configuration.

   Verify that the connection can be established successfully and select **Create**.

   :::image type="content" source="media/change-data-capture-sap-onelake-azure-data-factory/lakehouse-linked-service-configuration.png" alt-text="Screenshot showing the configuration of the Fabric Lakehouse linked service in ADF.":::

## Configuring the pipeline template

With the setup of the linked services completed, you can import the template and adjust it for your source object.

1. From the pipeline menu, choose **+** to add a new resource, then select **Pipeline** and **Template gallery**.

   :::image type="content" source="media/change-data-capture-sap-onelake-azure-data-factory/select-pipeline-template.png" alt-text="Screenshot showing where to choose a template in the ADF studio's Template gallery.":::

1. The **Template gallery** dialog appears. Find the **Copy change data from SAP to Fabric Lakehouse table** template, select it, and select **Continue**.

   :::image type="content" source="media/change-data-capture-sap-onelake-azure-data-factory/select-sap-to-fabric-template.png" alt-text="Screenshot showing the template selected in the Template gallery.":::

1. The configuration screen opens, in which you specify the linked services to be used to instantiate the template. Enter the linked services created in the prior sections. The first linked service is the one required for the staging folder in ADLS Gen2, the second one is connection to the SAP source and the third one connects to Microsoft Fabric Lakehouse:

   :::image type="content" source="media/change-data-capture-sap-onelake-azure-data-factory/configure-pipeline-template.png" alt-text="Screenshot showing how to configure the pipeline template.":::

1. After you configure the template, ADF creates the new pipeline, and you can make any adjustments you require for your specific setup. As a first step, configure the staging folder to intermediately store the change data from SAP before it's merged with your delta table in Fabric. Select on the data flow activity in the pipeline and select the **Settings** tab. In the **Staging** properties you can see the staging linked service configured in the last step. Enter a **Staging storage folder**.

1. Double select on the data flow activity in the pipeline open the mapping dataflow to configure your source and sink. First, select the SAP CDC source transfer, and select the **Source options** tab. Provide the detail properties of your source object in **ODP context**, **ODP name** and **Key columns** (as a JSON array). Then select a **Run mode**. For details on these properties, refer to [Azure Data Factory documentation for SAP change data capture capabilities](/azure/data-factory/sap-change-data-capture-introduction-architecture).

1. Select the sink transformation of the data flow, and then select the **Settings** tab, and enter the **Table name** for the Lakehouse table in your Fabric workspace. Select the radio button **Custom expression** of the **Key columns** property and enter the key columns of your source as a JSON array.

1. Publish your changes.

## Retrieve the data

1. Navigate back to the pipeline and trigger a pipeline run:

1. Switch to the monitoring experience and wait for your pipeline run to complete:

1. Open your Lakehouse in your Fabric workspace. Under **Tables**, you see the newly created Lakehouse table. In the right of your screen, a preview of the data you loaded from SAP is displayed.

   :::image type="content" source="media/change-data-capture-sap-onelake-azure-data-factory/view-data-in-lakehouse.png" lightbox="media/change-data-capture-sap-onelake-azure-data-factory/view-data-in-lakehouse.png" alt-text="Screenshot showing the imported data from SAP in the Lakehouse table.":::

## Related content

- [Overview and architecture of SAP CDC capabilities in ADF and Synapse](/azure/data-factory/sap-change-data-capture-introduction-architecture)
- [Transform data from an SAP ODP source using the SAP CDC connector](/azure/data-factory/connector-sap-change-data-capture)
