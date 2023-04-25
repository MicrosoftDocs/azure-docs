---
title: Connect to and manage MySQL
description: This guide describes how to connect to MySQL in Microsoft Purview, and use Microsoft Purview's features to scan and manage your MySQL source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 04/20/2023
ms.custom: template-how-to
---

# Connect to and manage MySQL in Microsoft Purview

This article outlines how to register MySQL, and how to authenticate and interact with MySQL in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Labeling**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | [Yes](#scan) | No |No| No| [Yes](#lineage)| No|

The supported MySQL server versions are 5.7 to 8.x.

When scanning MySQL source, Microsoft Purview supports:

- Extracting technical metadata including:

    - Server
    - Databases
    - Tables including the columns
    - Views including the columns

- Fetching static lineage on assets relationships among tables and views.

When setting up scan, you can choose to scan an entire MySQL server, or scope the scan to a subset of databases matching the given name(s) or name pattern(s).

### Known limitations

When object is deleted from the data source, currently the subsequent scan won't automatically remove the corresponding asset in Microsoft Purview.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active [Microsoft Purview account](create-catalog-portal.md).
- You need Data Source Administrator and Data Reader permissions to register a source and manage it in the Microsoft Purview governance portal. For more information about permissions, see [Access control in Microsoft Purview](catalog-permissions.md).

> [!NOTE]
> **If your data store is not publicly accessible** (if your data store limits access from on-premises network, private network or specific IPs, etc.), **you will need to configure a self hosted integration runtime to connect to it**.

- If your data store isn't publicly accessible, set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [the create and configure a self-hosted integration runtime guide](manage-integration-runtimes.md).
    - Ensure [JDK 11](https://www.oracle.com/java/technologies/downloads/#java11) is installed on the machine where the self-hosted integration runtime is installed. Restart the machine after you newly install the JDK for it to take effect.
    - Ensure Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the self-hosted integration runtime machine. If you don't have this update installed, [you can download it here](https://www.microsoft.com/download/details.aspx?id=30679).

### Required permissions for scan

The MySQL user must have the SELECT, SHOW VIEW and EXECUTE permissions for each target MySQL schema that contains metadata.

## Register

This section describes how to register MySQL in Microsoft Purview using the [Microsoft Purview governance portal](https://web.purview.azure.com/).

### Steps to register

To register a new MySQL source in your data catalog, follow these steps:

1. Navigate to your Microsoft Purview account in the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).
1. Select **Data Map** on the left navigation.
1. Select **Register**
1. On Register sources, select **MySQL**. Select **Continue**.

On the **Register sources (MySQL)** screen, follow these steps:

1. Enter a **Name** that the data source will be listed within the Catalog.

1. Enter the **Server** name to connect to a MySQL source. This can either be:
    * A host name used to connect to the database server. For example: `MyDatabaseServer.com`
    * An IP address. For example: `192.169.1.2`

1. Enter the **Port** used to connect to the database server (3306 by default for MySQL).

1. Select a collection or create a new one (Optional)

1. Finish to register the data source.

    :::image type="content" source="media/register-scan-mysql/register-sources.png" alt-text="register sources options" border="true":::

## Scan

Follow the steps below to scan MySQL to automatically identify assets. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md).

### Authentication for a scan

The supported authentication type for a MySQL source is **Basic authentication**.

### Create and run scan

To create and run a new scan, follow these steps:

1. If your server is publicly accessible, skip to step two. Otherwise, you'll need to make sure your self-hosted integration runtime is configured:
    1. In the [Microsoft Purview governance portal](https://web.purview.azure.com/), got to the Management Center, and select **Integration runtimes**.
    1. Make sure a self-hosted integration runtime is available. If one isn't set up, use the steps mentioned [here](./manage-integration-runtimes.md) to set up a self-hosted integration runtime.

1. In the [Microsoft Purview governance portal](https://web.purview.azure.com/), navigate to **Sources**.

1. Select the registered MySQL source.

1. Select **+ New scan**.

1. Provide the below details:

    1. **Name**: The name of the scan

    1. **Connect via integration runtime**: Select the Azure auto-resolved integration runtime if your server is publicly accessible, or your configured self-hosted integration runtime if it isn't publicly available.

    1. **Credential**: Select the credential to connect to your data source. Make sure to:
        * Select **Basic Authentication** while creating a credential.
        * Provide the user name used to connect to the database server in the User name input field.
        * Store the user password used to connect to the database server in the secret key.

    1. **Database**: List subset of databases to import expressed as a semicolon separated list. For example, `database1; database2`. All user databases are imported if the list is empty. All system databases (for example, SysAdmin) are ignored by default.

        Acceptable schema name patterns using SQL LIKE expressions syntax include using %. For example: `A%; %B; %C%; D`
        * Start with A or
        * End with B or
        * Contain C or
        * Equal D

        Usage of NOT and special characters aren't acceptable.

    1. **Maximum memory available** (applicable when using self-hosted integration runtime): Maximum memory (in GB) available on customer's VM to be used by scanning processes. This is dependent on the size of MySQL source to be scanned.

        > [!Note]
        > As a rule of thumb, please provide 1GB memory for every 1000 tables

        :::image type="content" source="media/register-scan-mysql/scan.png" alt-text="scan MySQL" border="true":::

1. Select **Continue**.

1. Choose your **scan trigger**. You can set up a schedule or ran the scan once.

1. Review your scan and select **Save and Run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Lineage

After scanning your MySQL source, you can [browse data catalog](how-to-browse-catalog.md) or [search data catalog](how-to-search-catalog.md) to view the asset details. 

Go to the asset -> lineage tab, you can see the asset relationship when applicable. Refer to the [supported capabilities](#supported-capabilities) section on the supported MySQL lineage scenarios. For more information about lineage in general, see [data lineage](concept-data-lineage.md) and [lineage user guide](catalog-lineage-user-guide.md).

## Next steps

Now that you've registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
