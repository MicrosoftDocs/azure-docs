---
title: Troubleshoot your connections in Microsoft Purview
description: This article explains the steps to troubleshoot your connections in Microsoft Purview.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 09/27/2021
ms.custom: ignite-fall-2021
---
# Troubleshoot your connections in Microsoft Purview

This article describes how to troubleshoot connection errors while setting up scans on data sources in Microsoft Purview.

## Permission the credential on the data source

If you're using a managed identity or service principal as a method of authentication for scans, you'll have to allow these identities to have access to your data source.

There are specific instructions for each [source type](azure-purview-connector-overview.md).

> [!IMPORTANT]
> Verify that you have followed all prerequisite and authentication steps for the source you are connecting to.
> You can find all available sources listed in the [Microsoft Purview supported sources article](azure-purview-connector-overview.md).

## Verifying Azure Role-based Access Control to enumerate Azure resources in the Microsoft Purview governance portal

### Registering single Azure data source

To register a single data source in Microsoft Purview, such as an Azure Blog Storage or an Azure SQL Database, you must be granted at least **Reader** role on the resource or inherited from higher scope such as resource group or subscription. Some Azure RBAC roles, such as Security Admin, don't have read access to view Azure resources in control plane.  

Verify this by following the steps below:

1. From the [Azure portal](https://portal.azure.com), navigate to the resource that you're trying to register in Microsoft Purview. If you can view the resource, it's likely, that you already have at least reader role on the resource.
2. Select **Access control (IAM)** > **Role Assignments**.
3. Search by name or email address of the user who is trying to register data sources in Microsoft Purview.
4. Verify if any role assignments, such as Reader, exist in the list or add a new role assignment if needed.

### Scanning multiple Azure data sources

1. From the [Azure portal](https://portal.azure.com), navigate to the subscription or the resource group.  
2. Select **Access Control (IAM)** from the left menu.
3. Select **+Add**.
4. In the **Select input** box, select the **Reader** role and enter your Microsoft Purview account name (which represents its MSI name). 
5. Select **Save** to finish the role assignment.
6. Repeat the steps above to add the identity of the user who is trying to create a new scan for multiple data sources in Microsoft Purview.

## Scanning data sources using Private Link

If public endpoint is restricted on your data sources, to scan Azure data sources using Private Link, you need to set up a Self-hosted integration runtime and create a credential. 

> [!IMPORTANT]
> Scanning multiple data sources which contain databases as Azure SQL database with _Deny public network access_, would fail. To scan these data sources using private Endpoint, instead use registering single data source option.

For more information about setting up a self-hosted integration runtime, see [Ingestion private endpoints and scanning sources](catalog-private-link-ingestion.md#deploy-self-hosted-integration-runtime-ir-and-scan-your-data-sources)

For more information how to create a new credential in Microsoft Purview, see [Credentials for source authentication in Microsoft Purview](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account)

## Storing your credential in your key vault and using the right secret name and version

You must also store your credential in your Azure Key Vault instance and use the right secret name and version.

Verify this by following the steps below:

1. Navigate to your Key Vault.
1. Select **Settings** > **Secrets**.
1. Select the secret you're using to authenticate against your data source for scans.
1. Select the version that you intend to use and verify that the password or account key is correct by selecting **Show Secret Value**.

## Verify permissions for the Microsoft Purview managed identity on your Azure Key Vault

Verify that the correct permissions have been configured for the Microsoft Purview managed identity to access your Azure Key Vault.

To verify this, do the following steps:

1. Navigate to your key vault and to the **Access policies** section

1. Verify that your Microsoft Purview managed identity shows under the _Current access policies_ section with at least **Get** and **List** permissions on Secrets

   :::image type="content" source="./media/troubleshoot-connections/verify-minimum-permissions.png" alt-text="Image showing dropdown selection of both Get and List permission options":::

If you don't see your Microsoft Purview managed identity listed, then follow the steps in [Create and manage credentials for scans](manage-credentials.md) to add it.

## Scans no longer run

If your Microsoft Purview scan used to successfully run, but are now failing, check these things:
1. Have credentials to your resource changed or been rotated? If so, you'll need to update your scan to have the correct credentials.
1. Is an [Azure Policy](../governance/policy/overview.md) preventing **updates to Storage accounts**? If so follow the [Microsoft Purview exception tag guide](create-azure-purview-portal-faq.md) to create an exception for Microsoft Purview accounts.
1. Are you using a self-hosted integration runtime? Check that it's up to date with the latest software and that it's connected to your network.

## Next steps

- [Browse the Microsoft Purview Data catalog](how-to-browse-catalog.md)
- [Search the Microsoft Purview Data Catalog](how-to-search-catalog.md)
