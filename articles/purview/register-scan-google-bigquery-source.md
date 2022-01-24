---
title: Connect to and manage Google BigQuery projects
description: This guide describes how to connect to Google BigQuery projects in Azure Purview, and use Azure Purview's features to scan and manage your Google BigQuery source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 01/20/2022
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage Google BigQuery projects in Azure Purview (Preview)

This article outlines how to register Google BigQuery projects, and how to authenticate and interact with Google BigQuery in Azure Purview. For more information about Azure Purview, read the [introductory article](overview.md).

> [!IMPORTANT]
> Google BigQuery as a source is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | [Yes](#scan) | No | No| [Yes](#lineage)|

When scanning Google BigQuery source, Azure Purview supports:

- Extracting technical metadata including:

    - Projects
    - Datasets
    - Tables including the columns
    - Views including the columns

- Fetching static lineage on assets relationships among tables and views.

When setting up scan, you can choose to scan an entire Google BigQuery project, or scope the scan to a subset of datasets matching the given name(s) or name pattern(s).

>[!NOTE]
> Currently, Azure Purview only supports scanning Google BigQuery datasets in US multi-regional location. If the specified dataset is in other location e.g. us-east1 or EU, you will observe scan completes but no assets shown up in Azure Purview.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Azure Purview resource](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Azure Purview Studio. See our [Azure Purview Permissions page](catalog-permissions.md) for details.

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [the create and configure a self-hosted integration runtime guide](manage-integration-runtimes.md).

* Ensure [JDK 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) is installed on the virtual machine where the self-hosted integration runtime is installed.

* Ensure Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the self-hosted integration runtime machine. If you don't have this update installed, [you can download it here](https://www.microsoft.com/download/details.aspx?id=30679).

* Download and install BigQuery's JDBC driver on the machine where your self-hosted integration runtime is running. You can find the driver [here](https://cloud.google.com/bigquery/providers/simba-drivers).

    > [!Note]
    > The driver should be accessible to all accounts in the VM. Do not install it in a user account.

## Register

This section describes how to register a Google BigQuery project in Azure Purview using the [Azure Purview Studio](https://web.purview.azure.com/).

### Steps to register

1. Navigate to your Azure Purview account.
1. Select **Data Map** on the left navigation.
1. Select **Register.**
1. On Register sources, select **Google BigQuery** . Select **Continue.**

    :::image type="content" source="media/register-scan-google-bigquery-source/register-sources.png" alt-text="register BigQuery source" border="true":::

On the Register sources (Google BigQuery) screen, do the following:

1. Enter a **Name** that the data source will be listed within the Catalog.

1. Enter the **ProjectID.** This should be a fully qualified project ID. For example, mydomain.com:myProject

1. Select a collection or create a new one (Optional)

1. Select **Register**.

    :::image type="content" source="media/register-scan-google-bigquery-source/configure-sources.png" alt-text="configure BigQuery source" border="true":::

## Scan

Follow the steps below to scan a Google BigQuery project to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md).

### Create and run scan

1. In the Management Center, select Integration runtimes. Make sure a self-hosted integration runtime is set up. If it is not set up, use the steps mentioned [here](./manage-integration-runtimes.md).

1. Navigate to **Sources**.

1. Select the registered **BigQuery** project.

1. Select **+ New scan**.

1. Provide the below details:

    1. **Name**: The name of the scan

    1. **Connect via integration runtime**: Select the configured self-hosted integration runtime

    1. **Credential**: While configuring BigQuery credential, make sure to:

        * Select **Basic Authentication** as the Authentication method
        * Provide the email ID of the service account in the User name field. For example, `xyz\@developer.gserviceaccount.com`
        * Follow below steps to generate the private key, copy the JSON then store it as the value of a Key Vault secret.

        To create a new private key from Google's cloud platform:
        1. In the navigation menu, select IAM & Admin -\> Service Accounts -\> Select a project -\> 
        1. Select the email address of the service account that you want to create a key for.
        1. Select the **Keys** tab.
        1. Select the **Add key** drop-down menu, then select Create new key. 
        1. Choose JSON format.

          > [!Note]
          > The contents of the private key are saved in a temp file on the VM when scanning processes are running. This temp file is deleted after the scans are successfully completed. In the event of a scan failure, the system will continue to retry until success. Please make sure access is appropriately restricted on the VM where SHIR is running.

        To understand more on credentials, refer to the link [here](manage-credentials.md).

    1. **Driver location**: Specify the path to the JDBC driver location in your VM where self-host integration runtime is running. This should be the path to valid JAR folder location. 

        > [!Note]
        > The driver should be accessible to all accounts in the VM.Please do not install in a user account.

    1. **Dataset**: Specify a list of BigQuery datasets to import.
        For example, dataset1; dataset2. When the list is empty, all available datasets are imported.
        Acceptable dataset name patterns using SQL LIKE expressions syntax include using %.

        Example:
        A%; %B; %C%; D
        * Start with A or
        * end with B or
        * contain C or
        * equal D

        Usage of NOT and special characters are not acceptable.

    1. **Maximum memory available**: Maximum memory (in GB) available on your VM to be used by scanning processes. This is dependent on the size of Google BigQuery project to be scanned.

        :::image type="content" source="media/register-scan-google-bigquery-source/scan.png" alt-text="scan BigQuery source" border="true":::

1. Select **Test connection.**

1. Select **Continue**.

1. Choose your **scan trigger**. You can set up a schedule or ran the
    scan once.

1. Review your scan and select **Save and Run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Lineage

After scanning your Google BigQuery source, you can [browse data catalog](how-to-browse-catalog.md) or [search data catalog](how-to-search-catalog.md) to view the asset details. 

Go to the asset -> lineage tab, you can see the asset relationship when applicable. Refer to the [supported capabilities](#supported-capabilities) section on the supported Google BigQuery lineage scenarios. For more information about lineage in general, see [data lineage](concept-data-lineage.md) and [lineage user guide](catalog-lineage-user-guide.md).

:::image type="content" source="media/register-scan-google-bigquery-source/lineage.png" alt-text="Google BigQuery lineage view" border="true":::

## Next steps

Now that you have registered your source, follow the below guides to learn more about Azure Purview and your data.

- [Data insights in Azure Purview](concept-insights.md)
- [Lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
