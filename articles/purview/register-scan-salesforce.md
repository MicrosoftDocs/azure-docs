---
title: Connect to and manage Salesforce
description: This guide describes how to connect to Salesforce in Microsoft Purview, and use Microsoft Purview's features to scan and manage your Salesforce source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 04/20/2023
ms.custom: template-how-to
---

# Connect to and manage Salesforce in Microsoft Purview

This article outlines how to register Salesforce, and how to authenticate and interact with Salesforce in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Labeling**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | [Yes](#scan) | No| No | No| No|

When scanning Salesforce source, Microsoft Purview supports extracting technical metadata including:

- Organization
- Objects including the fields, foreign keys, and unique_constraints

When setting up scan, you can choose to scan an entire Salesforce organization, or scope the scan to a subset of objects matching the given name(s) or name pattern(s).

### Known limitations

When object is deleted from the data source, currently the subsequent scan won't automatically remove the corresponding asset in Microsoft Purview.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active [Microsoft Purview account](create-catalog-portal.md).
- You need Data Source Administrator and Data Reader permissions to register a source and manage it in the Microsoft Purview governance portal. For more information about permissions, see [Access control in Microsoft Purview](catalog-permissions.md).
- A Salesforce connected app, which will be used to access your Salesforce information.
  - If you need to create a connected app, you can follow the [Salesforce documentation](https://help.salesforce.com/s/articleView?id=sf.connected_app_create_basics.htm&type=5).
  - You will need to [enable OAuth for you Salesforce application](https://help.salesforce.com/s/articleView?id=sf.connected_app_create_api_integration.htm&type=5).

> [!NOTE]
> **If your data store is not publicly accessible** (if your data store limits access from on-premises network, private network or specific IPs, etc.), **you will need to configure a self hosted integration runtime to connect to it**.

- If your data store isn't publicly accessible, set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). For more information, see [the create and configure a self-hosted integration runtime guide](manage-integration-runtimes.md).
    - Ensure [JDK 11](https://www.oracle.com/java/technologies/downloads/#java11) is installed on the machine where the self-hosted integration runtime is installed. Restart the machine after you newly install the JDK for it to take effect.
    - Ensure Visual C++ Redistributable for Visual Studio 2012 Update 4 is installed on the self-hosted integration runtime machine. If you don't have this update installed, [you can download it here](https://www.microsoft.com/download/details.aspx?id=30679).
    - Ensure the self-hosted integration runtime machine's IP is within the [trusted IP ranges for your organization](https://help.salesforce.com/s/articleView?id=sf.security_networkaccess.htm&type=5) set on Salesforce.

### Required permissions for scan

If users will be submitting Salesforce Documents, certain security settings must be configured to allow this access on Standard Objects and Custom Objects. To configure permissions:

- Within Salesforce, select Setup and then select Manage Users.
- Under the Manage Users tree select Profiles.
- Once the Profiles appear on the right, select which Profile you want to edit and select the Edit link next to the corresponding profile.

For Standard Objects, ensure that the "Documents" section has the Read permissions selected. For Custom Objects, ensure that the Read permissions selected for each custom objects.

## Register

This section describes how to register Salesforce in Microsoft Purview using the [Microsoft Purview governance portal](https://web.purview.azure.com/).

### Steps to register

To register a new Salesforce source in your data catalog, follow these steps:

1. Navigate to your Microsoft Purview account in the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).
1. Select **Data Map** on the left navigation.
1. Select **Register**
1. On Register sources, select **Salesforce**. Select **Continue**.

On the **Register sources (Salesforce)** screen, follow these steps:

1. Enter a **Name** that the data source will be listed within the Catalog.

1. Enter the Salesforce login endpoint URL as **Domain URL**. For example, `https://login.salesforce.com`. You can use your company' instance URL (such as `https://na30.salesforce.com`) or My Domain URL (such as `https://myCompanyName.my.salesforce.com/`).

1. Select a collection or create a new one (Optional)

1. Finish to register the data source.

    :::image type="content" source="media/register-scan-salesforce/register-sources.png" alt-text="register sources options" border="true":::

## Scan

Follow the steps below to scan Salesforce to automatically identify assets. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md).

Microsoft Purview uses Salesforce REST API version 41.0 to extract metadata, including REST requests like 'Describe Global' URI (/v41.0/sobjects/),'sObject Basic Information' URI (/v41.0/sobjects/sObject/), and 'SOQL Query' URI (/v41.0/query?).

### Authentication for a scan

The supported authentication type for a Salesforce source is **Consumer key authentication**.

### Create and run scan

To create and run a new scan, follow these steps:

1. If your server is publicly accessible, skip to step two. Otherwise, you'll need to make sure your self-hosted integration runtime is configured:
    1. In the [Microsoft Purview governance portal](https://web.purview.azure.com/), got to the Management Center, and select **Integration runtimes**.
    1. Make sure a self-hosted integration runtime is available. If one isn't set up, use the steps mentioned [here](./manage-integration-runtimes.md) to set up a self-hosted integration runtime.

1. In the [Microsoft Purview governance portal](https://web.purview.azure.com/), navigate to **Sources**.

1. Select the registered Salesforce source.

1. Select **+ New scan**.

1. Provide the below details:

    1. **Name**: The name of the scan

    1. **Connect via integration runtime**: Select the Azure auto-resolved integration runtime if your server is publicly accessible, or your configured self-hosted integration runtime if it isn't publicly available.

    1. **Credential**: Select the credential to connect to your data source. Make sure to:
        * Select **Consumer key** while creating a credential.
        * Provide the username of the user that the [connected app](#prerequisites) is imitating in the User name input field.
        * Store the password of the user that the connected app is imitating in an Azure Key Vault secret. 
            * If your self-hosted integration runtime machine's IP is within the [trusted IP ranges for your organization](https://help.salesforce.com/s/articleView?id=sf.security_networkaccess.htm&type=5) set on Salesforce, provide just the password of the user.
            * Otherwise, **concatenate the password and security token as the value of the secret**. The security token is an automatically generated key that must be added to the end of the password when logging in to Salesforce from an untrusted network. Learn more about how to [get or reset a security token](https://help.salesforce.com/apex/HTViewHelpDoc?id=user_security_token.htm).
        * Provide the consumer key from the connected app definition. You can find it on the connected app's Manage Connected Apps page or from the connected app's definition.
        * Stored the consumer secret from the connected app definition in an Azure Key Vault secret. You can find it along with consumer key.

    1. **Objects**: Provide a list of object names to scope your scan. For example, `object1; object2`. An empty list means retrieving all available objects. You can specify object names as a wildcard pattern. For example, `topic?`, `*topic*`, or `topic_?,*topic*`.

    1. **Maximum memory available** (applicable when using self-hosted integration runtime): Maximum memory (in GB) available on customer's VM to be used by scanning processes. This is dependent on the size of Salesforce source to be scanned.

        > [!Note]
        > As a rule of thumb, please provide 1GB memory for every 1000 tables

        :::image type="content" source="media/register-scan-salesforce/scan.png" alt-text="scan Salesforce" border="true":::

1. Select **Continue**.

1. Choose your **scan trigger**. You can set up a schedule or ran the scan once.

1. Review your scan and select **Save and Run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you've registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
