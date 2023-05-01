---
title: Connect to and manage Azure Databricks
description: This guide describes how to connect to Azure Databricks in Microsoft Purview, and how to use Microsoft Purview to scan and manage your Azure Databricks source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 04/20/2023
ms.custom: template-how-to
---

# Connect to and manage Azure Databricks in Microsoft Purview (Preview)

This article outlines how to register Azure Databricks, and how to authenticate and interact with Azure Databricks in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Labeling**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | No | No | No| No| [Yes](#lineage) | No |

When scanning Azure Databricks source, Microsoft Purview supports:

- Extracting technical metadata including:

   - Azure Databricks workspace
   - Hive server
   - Databases
   - Tables including the columns, foreign keys, unique constraints, and storage description
   - Views including the columns and storage description

- Fetching relationship between external tables and Azure Data Lake Storage Gen2/Azure Blob assets (external locations). 
- Fetching static lineage between tables and views based on the view definition.

This connector brings metadata from Databricks metastore. Comparing to scan via [Hive Metastore connector](register-scan-hive-metastore-source.md) in case you use it to scan Azure Databricks earlier:

- You can directly set up scan for Azure Databricks workspaces without direct HMS access. It uses Databricks personal access token for authentication and connects to a cluster to perform scan. 
- The Databricks workspace info is captured.
- The relationship between tables and storage assets is captured.

### Known limitations

When object is deleted from the data source, currently the subsequent scan won't automatically remove the corresponding asset in Microsoft Purview.

## Prerequisites

* You must have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* You must have an active [Microsoft Purview account](create-catalog-portal.md).

* You need Data Source Administrator and Data Reader permissions to register a source and manage it in the Microsoft Purview governance portal. For more information about permissions, see [Access control in Microsoft Purview](catalog-permissions.md).

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [Create and configure a self-hosted integration runtime](manage-integration-runtimes.md). The minimal supported self-hosted Integration Runtime version is 5.20.8227.2.

    * Ensure [JDK 11](https://www.oracle.com/java/technologies/downloads/#java11) is installed on the machine where the self-hosted integration runtime is installed. Restart the machine after you newly install the JDK for it to take effect.

    * Ensure that Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the machine where the self-hosted integration runtime is running. If you don't have this update installed, [download it now](https://www.microsoft.com/download/details.aspx?id=30679).

* In your Azure Databricks workspace:

   * [Generate a personal access token](/azure/databricks/dev-tools/auth#--azure-databricks-personal-access-tokens), and store it as a secret in Azure Key Vault.
   * [Create a cluster](/azure/databricks/clusters/create-cluster). Note down the cluster ID - you can find it in Azure Databricks workspace -> Compute -> your cluster -> Tags -> Automatically added tags -> `ClusterId`.
   * Make sure the user has the following [permissions](/azure/databricks/security/access-control/cluster-acl) so as to connect to the Azure Databricks cluster:

      * **Can Attach To** permission to connect to the running cluster.
      * **Can Restart** permission to automatically trigger the cluster to start if its state is terminated when connecting.

## Register

This section describes how to register an Azure Databricks workspace in Microsoft Purview by using [the Microsoft Purview governance portal](https://web.purview.azure.com/).

1. Go to your Microsoft Purview account.

1. Select **Data Map** on the left pane.

1. Select **Register**.

1. In **Register sources**, select **Azure Databricks** > **Continue**.    

1. On the **Register sources (Azure Databricks)** screen, do the following:

   1. For **Name**, enter a name that Microsoft Purview will list as the data source.

   1. For **Azure subscription** and **Databricks workspace name**, select the subscription and workspace that you want to scan from the dropdown. The Databricks workspace URL will be automatically populated. 

   1. For **Select a collection**, choose a collection from the list or create a new one. This step is optional.

   :::image type="content" source="media/register-scan-azure-databricks/configure-sources.png" alt-text="Screenshot of registering Azure Databricks source." border="true":::

1. Select **Finish**.   

## Scan

> [!TIP]
> To troubleshoot any issues with scanning:
> 1. Confirm you have followed all [**prerequisites**](#prerequisites).
> 1. Review our [**scan troubleshooting documentation**](troubleshoot-connections.md).

Use the following steps to scan Azure Databricks to automatically identify assets. For more information about scanning in general, see [Scans and ingestion in Microsoft Purview](concept-scans-and-ingestion.md).

1. In the Management Center, select integration runtimes. Make sure that a self-hosted integration runtime is set up. If it isn't set up, use the steps in [Create and manage a self-hosted integration runtime](./manage-integration-runtimes.md).

1. Go to **Sources**.

1. Select the registered Azure Databricks.

1. Select **+ New scan**.

1. Provide the following details:

    1. **Name**: Enter a name for the scan.

    1. **Connect via integration runtime**: Select the configured self-hosted integration runtime.

    1. **Credential**: Select the credential to connect to your data source. Make sure to:

       * Select **Access Token Authentication** while creating a credential.
       * Provide secret name of the personal access token that you created in [Prerequisites](#prerequisites) in the appropriate box.

       For more information, see [Credentials for source authentication in Microsoft Purview](manage-credentials.md).

   1. **Cluster ID**: Specify the cluster ID that Microsoft Purview will connect to and perform the scan. You can find it in Azure Databricks workspace -> Compute -> your cluster -> Tags -> Automatically added tags -> `ClusterId`. 

   1. **Mount points**: Provide the mount point and Azure Storage source location string when you have external storage manually mounted to Databricks. Use the format `/mnt/<path>=abfss://<container>@<adls_gen2_storage_account>.dfs.core.windows.net/;/mnt/<path>=wasbs://<container>@<blob_storage_account>.blob.core.windows.net` It will be used to capture the relationship between tables and the corresponding storage assets in Microsoft Purview. This setting is optional, if it's not specified, such relationship won't be retrieved. 
   
      You can get the list of mount points in your Databricks workspace by running the following Python command in a notebook:

      ```
      dbutils.fs.mounts()
      ```

      It will print all the mount points like below:

      ```
      [MountInfo(mountPoint='/databricks-datasets', source='databricks-datasets', encryptionType=''),
      MountInfo(mountPoint='/mnt/ADLS2', source='abfss://samplelocation1@azurestorage1.dfs.core.windows.net/', encryptionType=''),
      MountInfo(mountPoint='/databricks/mlflow-tracking', source='databricks/mlflow-tracking', encryptionType=''), 
      MountInfo(mountPoint='/mnt/Blob', source='wasbs://samplelocation2@azurestorage2.blob.core.windows.net', encryptionType=''),
      MountInfo(mountPoint='/databricks-results', source='databricks-results', encryptionType=''),
      MountInfo(mountPoint='/databricks/mlflow-registry', source='databricks/mlflow-registry', encryptionType=''), MountInfo(mountPoint='/', source='DatabricksRoot', encryptionType='')]  
      ```

      In this example, specify the following as mount points:

      `/mnt/ADLS2=abfss://samplelocation1@azurestorage1.dfs.core.windows.net/;/mnt/Blob=wasbs://samplelocation2@azurestorage2.blob.core.windows.net`

    1. **Maximum memory available**: Maximum memory (in gigabytes) available on the customer's machine for the scanning processes to use. This value is dependent on the size of Azure Databricks to be scanned.

        > [!Note]
        > As a thumb rule, please provide 1GB memory for every 1000 tables.

    :::image type="content" source="media/register-scan-azure-databricks/scan.png" alt-text="Screenshot of setting up Azure Databricks scan." border="true":::

1. Select **Continue**.

1. For **Scan trigger**, choose whether to set up a schedule or run the scan once.

1. Review your scan and select **Save and Run**.

Once the scan successfully completes, see how to [browse and search Azure Databricks assets](#browse-and-search-assets).

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Browse and search assets

After scanning your Azure Databricks, you can [browse data catalog](how-to-browse-catalog.md) or [search data catalog](how-to-search-catalog.md) to view the asset details.

From the Databricks workspace asset, you can find the associated Hive Metastore and the tables/views, reversed applies too.

:::image type="content" source="media/register-scan-azure-databricks/browse-by-source-type.png" alt-text="Screenshot of browsing assets by source type." border="true":::

:::image type="content" source="media/register-scan-azure-databricks/switch-to-source-asset.png" alt-text="Screenshot of navigating to Azure Databricks source asset details." border="true":::

:::image type="content" source="media/register-scan-azure-databricks/associated-hive-metastore.png" alt-text="Screenshot of finding the associated Hive Metastore with Azure Databricks source." border="true":::

## Lineage

Refer to the [supported capabilities](#supported-capabilities) section on the supported Azure Databricks scenarios. For more information about lineage in general, see [data lineage](concept-data-lineage.md) and [lineage user guide](catalog-lineage-user-guide.md).

Go to the Hive table/view asset -> lineage tab, you can see the asset relationship when applicable. For relationship between table and external storage assets, you'll see Hive table asset and the storage asset are directly connected bi-directionally, as they mutually impact each other. If you use mount point in create table statement, you need to provide the mount point information in [scan settings](#scan) to extract such relationship.

:::image type="content" source="media/register-scan-azure-databricks/lineage.png" alt-text="Screenshot that shows Azure Databricks lineage example." border="true":::

## Next steps

Now that you've registered your source, use the following guides to learn more about Microsoft Purview and your data:

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search the data catalog](how-to-search-catalog.md)
