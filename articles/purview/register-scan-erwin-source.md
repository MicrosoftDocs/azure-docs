---
title: Connect to and manage erwin Mart servers
description: This guide describes how to connect to erwin Mart servers in Azure Purview, and use Azure Purview's features to scan and manage your erwin Mart server source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 01/11/2022
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage erwin Mart servers in Azure Purview (Preview)

This article outlines how to register erwin Mart servers, and how to authenticate and interact with erwin Mart Servers in Azure Purview. For more information about Azure Purview, read the [introductory article](overview.md).

> [!IMPORTANT]
> erwin Mart server as a source is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | [Yes](#scan) | No | No| [Yes](how-to-lineage-erwin.md)|

The supported erwin Mart versions are 9.x to 2021.

When scanning erwin Mart source, Azure Purview supports:

- Extracting technical metadata including:

    - Mart
    - Libraries
    - Models
    - Entities including the attributes, foreign keys, indexes, index members, candidate keys, and triggers
    - Default values
    - Synonyms
    - Sequences
    - Domains
    - Subject areas
    - Relationships
    - Validation rules including the valid values
    - ER diagrams
    - Views including the attributes
    - Stored procedures including the parameters
    - Schemas
    - Subtype relationships
    - View relationship
    - User defined properties

- Fetching static lineage on assets relationships among entities, views and stored procedures.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Azure Purview resource](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Azure Purview Studio. See our [Azure Purview Permissions page](catalog-permissions.md) for details.

* Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [the create and configure a self-hosted integration runtime guide](manage-integration-runtimes.md).

    > [!IMPORTANT]
    > Make sure to install the self-hosted integration runtime and the Erwin Data Modeler software on the same machine where erwin Mart instance is running.

* Ensure [JDK 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) is installed on the virtual machine where the self-hosted integration runtime is installed.

* Ensure Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the self-hosted integration runtime machine. If you don't have this update installed, [you can download it here](https://www.microsoft.com/download/details.aspx?id=30679).

## Register

This section describes how to register erwin Mart servers in Azure Purview using the [Azure Purview Studio](https://web.purview.azure.com/).

The only supported authentication for an erwin Mart source is **Server Authentication** in the form of username and password.

### Steps to register

1. Navigate to your Azure Purview account in the [Azure Purview Studio](https://web.purview.azure.com/).
1. Select **Data Map** on the left navigation.
1. Select **Register**
1. On Register sources, select **erwin**. Select **Continue.**
    :::image type="content" source="media/register-scan-erwin-source/register-sources.png" alt-text="register erwin source" border="true":::

On the Register sources (erwin) screen, do the following:

1. Enter a **Name** that the data source will be listed within the Catalog.
1. Enter the erwin Mart **Server name.** This is the network host name used to connect to the erwin Mart server. For example, localhost
1. Enter the **Port** number used when connecting to erwin Mart. By default, this value is 18170.
1. Enter the **Application name**

    >[!Note]
    > The above details can be found by navigating to your erwin Data Modeler. Select Mart -\> Connect to see details related to server name, port and application name.

    :::image type="content" source="media/register-scan-erwin-source/erwin-details.png" alt-text="find erwin details" border="true":::

1. Select a collection or create a new one (Optional)

1. Finish to register the data source.

    :::image type="content" source="media/register-scan-erwin-source/register-erwin.png" alt-text="register source" border="true":::

## Scan

Follow the steps below to scan erwin Mart servers to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md)

### Create and run scan

To create and run a new scan, do the following:

1. In the Management Center, select Integration runtimes. Make sure a self-hosted integration runtime is set up on the VM where erwin Mart instance is running. If it is not set up, use the steps mentioned [here](./manage-integration-runtimes.md) to set up a self-hosted integration runtime.
1. Navigate to **Sources**.

1. Select the registered **erwin** Mart.

1. Select **+ New scan**.

1. Provide the below details:

    1. **Name**: The name of the scan

    1. **Connect via integration runtime**: Select the configured
        self-hosted integration runtime.

    1. **Server name, Port** and **Application name** are auto
        populated based on the values entered during registration.

    1. **Credential:** Select the credential configured to connect to your erwin Mart server. While creating a credential, make sure to:
        * Select **Basic Authentication** as the Authentication method
        * Provide your erwin Mart server's username in the User name field.
        * Save your user password for server authentication in the key vault's secret.

        To understand more on credentials, refer to the link [here](manage-credentials.md).

    1. **Use Internet Information Services (IIS)** - Select True or False to notify if Microsoft Internet Information Services (IIS) must be used when connecting to the erwin Mart server. By default this value is set to False.

    1. **Use Secure Sockets Layer (SSL)** - Select True or False to Notify if Secure Sockets Layer (SSL) must be used when connecting to the erwin Mart server. By default, this value is set to False.

        > [!Note]
        > This parameter is only applicable for erwin Mart version 9.1 or later.

    1. **Browse mode** - Select the mode for browsing erwin Mart. Possible options are "Libraries and Models" or "Libraries only".

    1. **Models** - Scope your scan by providing a semicolon separated list of erwin model locator strings. For example, mart://Mart/Samples/eMovies;mart://Mart/Erwin_Tutorial/AP_Physical

    1. **Maximum memory available**: Maximum memory (in GB) available on customer's VM to be used by scanning processes. This is dependent on the size of erwin Mart to be scanned.

    :::image type="content" source="media/register-scan-erwin-source/setup-scan.png" alt-text="trigger scan" border="true":::

1. Select **Test connection.**

1. Select **Continue**.

1. Choose your **scan trigger**. You can set up a schedule or ran the
    scan once.

1. Review your scan and select **Save and Run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you have registered your source, follow the below guides to learn more about Azure Purview and your data.

- [Data insights in Azure Purview](concept-insights.md)
- [Lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
