---
title: Connect to and manage MongoDB
description: This guide describes how to connect to MongoDB in Microsoft Purview, and use Microsoft Purview's features to scan and manage your MongoDB source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 10/21/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Connect to and manage MongoDB in Microsoft Purview

This article outlines how to register MongoDB, and how to authenticate and interact with MongoDB in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | [Yes](#scan) | No | No| No | No |

The supported MongoDB versions are 2.6 to 5.1.

When scanning MongoDB source, Microsoft Purview supports extracting technical metadata including:

- Server
- Databases
- Collections including the schema
- Views including the schema

During scan, Microsoft Purview retrieves and analyzes sample documents to infer the collection/view schema. The sample size is configurable.

When setting up scan, you can choose to scan one or more MongoDB database(s) entirely, or further scope the scan to a subset of collections matching the given name(s) or name pattern(s).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Microsoft Purview account](create-catalog-portal.md).

* You need Data Source Administrator and Data Reader permissions to register a source and manage it in the Microsoft Purview governance portal. For more information about permissions, see [Access control in Microsoft Purview](catalog-permissions.md).

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [the create and configure a self-hosted integration runtime guide](manage-integration-runtimes.md). The minimal supported Self-hosted Integration Runtime version is 5.16.8093.1.

    * Ensure [JDK 11](https://www.oracle.com/java/technologies/downloads/#java11) is installed on the machine where the self-hosted integration runtime is installed. Restart the machine after you newly install the JDK for it to take effect.

    * Ensure Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the self-hosted integration runtime machine. If you don't have this update installed, [you can download it here](https://www.microsoft.com/download/details.aspx?id=30679).

## Register

This section describes how to register MongoDB in Microsoft Purview using the [Microsoft Purview governance portal](https://web.purview.azure.com/).

### Steps to register

To register a new MongoDB source in your data catalog, do the following:

1. Navigate to your Microsoft Purview account in the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).
1. Select **Data Map** on the left navigation.
1. Select **Register**
1. On Register sources, select **MongoDB**. Select **Continue**.

On the **Register sources (MongoDB)** screen, do the following:

1. Enter a **Name** that the data source will be listed within the Catalog.

1. Enter the **server** name. Specify a name to uniquely identify your MongoDB instance in your company. For example, `host` for standalone deployment, `MyReplicaSetName` for replica set, `MyClusterName` for sharded cluster. This value will be used in asset qualified name and cannot be changed.

1. Select a collection or create a new one (Optional).

1. Finish to register the data source.

    :::image type="content" source="media/register-scan-mongodb/register-sources.png" alt-text="register sources options" border="true":::

## Scan

Follow the steps below to scan MongoDB to automatically identify assets. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md).

### Authentication for a scan

The supported authentication type for a MongoDB source is **Basic authentication**.

### Create and run scan

To create and run a new scan, do the following:

1. In the Management Center, select Integration runtimes. Make sure a self-hosted integration runtime is set up. If it isn't set up, use the steps mentioned [here](./manage-integration-runtimes.md) to create a self-hosted integration runtime.

1. Navigate to **Sources**.

1. Select the registered MongoDB source.

1. Select **+ New scan**.

1. Provide the below details:

    1. **Name**: The name of the scan

    1. **Connect via integration runtime**: Select the self-hosted integration runtime used to perform scan.

    1. **Credential**: Select the credential to connect to your data source. Make sure to:
        * Select **Basic Authentication** while creating a credential.
        * Provide the user name used to connect to MongoDB in the User name input field.
        * Store the user password used to connect to MongoDB in the secret key.

    1. **Connection string**: Specify the MongoDB connection string used to connect to your MongoDB, excluding the username and password. For example, `mongodb://mongodb0.example.com:27017,mongodb1.example.com:27017/?replicaSet=myRepl`.

    1. **Databases**: Specify a list of MongoDB databases to be imported. The list can have one or more database names separated by semicolon (;), e.g. `database1; database2`.

    1. **Collections**: The subset of collections to import expressed as a semicolon separated list of collections, e.g. `collection1; collection2`. All collections are imported if the list is empty.​
        
        Acceptable collection name patterns using SQL LIKE expressions syntax include using %. For example: `A%; %B; %C%; D`:
        * Start with A or
        * End with B or
        * Contain C or
        * Equal D

        Usage of NOT and special characters aren't acceptable.

    1. **Number of sample documents**: Number of sample documents to be analyzed for schema extraction. Default is 10.

    1. **Maximum memory available** (applicable when using self-hosted integration runtime): Maximum memory (in GB) available on customer's VM to be used by scanning processes. It's dependent on the size of MongoDB source to be scanned.

        :::image type="content" source="media/register-scan-mongodb/scan.png" alt-text="scan MongoDB" border="true":::

1. Select **Test connection** to validate the configurations.

1. Select **Continue**.

1. Choose your **scan trigger**. You can set up a schedule or ran the scan once.

1. Review your scan and select **Save and Run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you've registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Search Data Catalog](how-to-search-catalog.md)
