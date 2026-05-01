---
title: Configure an SAP Source System with Azure Data Factory
description: Learn how to configure SAP source systems with Azure Data Factory in Business Process Solutions, including prerequisites, service principal setup, and Self-Hosted Integration Runtime deployment.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 11/07/2025
ms.author: momakhij
---

# Configure an SAP source system with Azure Data Factory

This article shows you how to configure SAP source systems with Azure Data Factory. The following prerequisites describe the steps to set up your Azure environment. This article also shows you how to set up the connection in your Business Process Solutions item.

## Prerequisites

### Required SAP Notes

Before you implement Business Process Solutions, review the following SAP Notes to help prevent common issues during data extraction:

- **2930269**: ABAP CDS CDC: Common issues, troubleshooting, and components. (All notes are listed in point 9 of this SAP Note.)
- **3077184**: Use new CDS-Views for SAP S/4HANA SD and billing document data.
- **3031375**: Customer-specific setting for bucket size in CDC extraction.

### Collect information about your source SAP system

To create a source system and establish connectivity, you need the following information:

- Host name or the IP address of the SAP system
- System number
- System ID
- Credentials

### Register services in Azure subscription

For Business Process Solutions, register the following providers:

- Azure Storage account (`Microsoft.Storage`)
- Azure Key Vault (`Microsoft.KeyVault`)
- Data Factory (`Microsoft.DataFactory`)

To finish the registration, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. On the Azure portal menu, search for **Subscriptions** and select it.

   :::image type="content" source="./media/configure-source-system-with-data-factory/open-subscriptions.png" alt-text="Screenshot that shows the Azure portal Subscriptions menu." lightbox="./media/configure-source-system-with-data-factory/open-subscriptions.png":::

1. Select the subscription that you want to view.
1. On the left menu, under **Settings**, select **Resource providers**.

   :::image type="content" source="./media/configure-source-system-with-data-factory/resource-providers.png" alt-text="Screenshot that shows the Azure portal resource providers page." lightbox="./media/configure-source-system-with-data-factory/resource-providers.png":::

1. Select the **Microsoft.KeyVault** resource provider.
1. Select the resource provider and select **Register**.

Repeat the preceding steps for `Microsoft.Storage` and `Microsoft.DataFactory`.

### Required permissions in Azure subscriptions

To deploy the required Azure resources for Business Process Solutions, your user account must have specific permissions. You can assign these permissions at either the subscription level or the resource group level. If you assign permissions at the resource group level, you must first create the resource group manually. Then provide the name in the source system configuration within Business Process Solutions.

The following permissions are required:

- **Key Vault Secrets Officer Access**: Assign Key Vault Secrets Officer access to the subscription for the user who operates Enterprise Insights. Make sure that the access is **Permanent** and not **Time bound**.
- **Owner Role Assignment**: Assign the Owner role in the subscription for the user who operates Enterprise Insights. Make sure that the access is either **Permanent** or **Time bound**. If it's **Time bound**, activate it before you run the configured source system operation.

### Create a service principal

In this section, you set up the service principal, which enables Data Factory to access object metadata within Business Process Solutions. Follow the next steps to finish the setup.

To create the following resources, you:

- Create a new service principal.
- Create a new secret for the service principal.

Follow these steps:

1. Open the [Azure portal](https://portal.azure.com/).
1. On the left menu, select **Microsoft Entra ID**.
1. Go to **App registrations** and select **New registration**. Enter the name of the service principal.

   :::image type="content" source="./media/configure-source-system-with-data-factory/service-principle-name.png" alt-text="Screenshot that shows how to create a new app registration." lightbox="./media/configure-source-system-with-data-factory/service-principle-name.png":::

1. Select **Register** to confirm.
1. To create a client secret, in **App registrations**, select your application.
1. In the **Service Principal** pane, go to the **Certificates & secrets** section. Select **+ New** for the client secret. Enter a description of the client secret, and select the validity time. Select **Add** to confirm.

   :::image type="content" source="./media/configure-source-system-with-data-factory/service-principle-secret.png" alt-text="Screenshot that shows how to create a new client secret." lightbox="./media/configure-source-system-with-data-factory/service-principle-secret.png":::

1. Copy the value of the secret. The value is stored in the key vault. After you leave this screen, you can't retrieve the secret value again.
1. Go to the Microsoft Fabric workspace and select **Manage Access** to add the created service principal as a Contributor in the workspace.

   :::image type="content" source="./media/configure-source-system-with-data-factory/manage-workspace-access.png" alt-text="Screenshot that shows how to add the service principal as a Contributor." lightbox="./media/configure-source-system-with-data-factory/manage-workspace-access.png":::

## Configure an SAP source system in Business Process Solutions

The first step of configuration is to set up the source system. This step deploys the common artifacts that are required to get started. Follow these steps to configure your source system:

1. On the home screen, select **Configure source system**.
1. Select **New source system**.

   :::image type="content" source="./media/configure-source-system-with-data-factory/create-source-system.png" alt-text="Screenshot that shows New source system." lightbox="./media/configure-source-system-with-data-factory/create-source-system.png":::

1. Enter the inputs for the fields:
   - Select **Azure Data Factory** for the connection type.
   - Select the subscription and location from the dropdown list.
   - Enter a unique name for the resource group.

   :::image type="content" source="./media/configure-source-system-with-data-factory/create-data-factory-source-system.png" alt-text="Screenshot that shows how to create a new resource group for the data factory." lightbox="./media/configure-source-system-with-data-factory/create-data-factory-source-system.png":::

1. In the **System Connection** section, enter the connection details for your SAP system. Enter the service principal secret that you created in [Create a service principal](#create-a-service-principal).

   :::image type="content" source="./media/configure-source-system-with-data-factory/enter-source-system-details.png" alt-text="Screenshot that shows the SAP system connection details input form." lightbox="./media/configure-source-system-with-data-factory/enter-source-system-details.png":::

1. Select **Create**. You can monitor the deployment status by using the refresh button to refresh the page.
1. After the deployment is finished, you can see the resources that are deployed to your workspace and also the resources that are deployed in your Azure resource group.

## Deploy self-hosted integration runtime on an Azure virtual machine

In this section, you deploy the self-hosted integration runtime on an Azure virtual machine (VM). To deploy and configure the self-hosted integration runtime, see [Set up a self-hosted integration runtime for the SAP CDC connector](../../data-factory/sap-change-data-capture-shir-preparation.md). This article covers detailed steps on how to prepare your VM and how to perform connectivity tests. You can also use these steps to configure your VM:

1. Deploy an Azure VM in the same network or subnet as your SAP system. Direct connectivity between the self-hosted integration runtime and the SAP system is required to extract data.
1. Install the SAP .NET connector.
1. Install the Java runtime. For more information, see [Download the Java runtime](https://aka.ms/download-jdk/microsoft-jdk-11.0.19-windows-x64.msi).
1. Ensure that the `JAVA_HOME` system environment variable is set to the JDK folder, not just the JRE folder. You might also need to add the bin folder to your system's `PATH` environment variable.
1. Install the self-hosted integration runtime. Stop at the registration step.
1. Open Data Factory and go to **Manage** > **Integration Runtimes**.
1. Select the integration runtime, **SAP-IR**.
1. Use the authentication key to continue with the self-hosted integration runtime installation process. Copy the key and finish the setup for the integration runtime on your VM.

   :::image type="content" source="./media/configure-source-system-with-data-factory/integration-runtime-setting.png" alt-text="Screenshot that shows the self-hosted integration runtime authentication key." lightbox="./media/configure-source-system-with-data-factory/integration-runtime-setting.png":::

After registration is finished, the status of the self-hosted integration runtime changes to **Running** in Data Factory.

## Next step

>[!div class="nextstepaction"]
>[Configure insights in Business Process Solutions](configure-insights.md)
