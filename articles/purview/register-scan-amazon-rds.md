---
title: How to scan Amazon RDS databases
description: This how-to guide describes details of how to scan Amazon RDS databases, including both Microsoft SQL and PostgreSQL data.
author: batamig
ms.author: bagol
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/08/2021
ms.custom: references_regions
# Customer intent: As a security officer, I need to understand how to use the Azure Purview connector for Amazon RDS service to set up, configure, and scan my Amazon RDS databases.
---

# Azure Purview connector for Amazon RDS (Public preview)

This how-to guide provides an explanation of how to use Azure Purview to scan your structured data currently stored in Amazon RDS, including both Microsoft SQL and PostgreSQL databases, and discover what types of sensitive information exists in your data.

This how-to guide also describes how to identify the Amazon RDS databases where the data is currently stored for easy information protection and data compliance.

For this service, use Purview to provide a Microsoft account with secure access to AWS, where the Purview scanner will run. The Purview scanner uses this access to your Amazon RDS databases to read your data, and then reports the scanning results, including only the metadata and classification, back to Azure. Use the Purview classification and labeling reports to analyze and review your data scan results.

In this how-to guide, you'll learn about how to add Amazon RDS databases as Purview resources and create a scan for your Amazon RDS data.

> [!IMPORTANT]
> Purview support for Amazon RDS is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Purview scope for Amazon RDS

- **Supported database engines**: Amazon RDS structured data storage supports multiple database engines. Azure Purview supports Amazon RDS with/based on Microsoft SQL and PostgreSQL.

- **Maximum columns supported**: Scanning RDS tables with more than 300 columns is not supported.

- **Public access support**: Purview supports scanning only with VPC Private Link in AWS, and is does not include public access scanning.

- **Supported regions**: Purview only supports Amazon RDS databases that are located in the following regions:

    - US East (Ohio)
    - US East (N. Virginia)
    - US West (N. California)
    - US West (Oregon)
    - Europe (Frankfurt)
    - Asia Pacific (Tokyo)
    - Asia Pacific (Singapore)
    - Asia Pacific (Sydney)
    - Europe (Ireland)
    - Europe (London)
    - Europe (Paris)

For more information, see:

- [Manage and increase quotas for resources with Azure Purview](how-to-manage-quotas.md)
- [Supported data sources and file types in Azure Purview](sources-and-scans.md)
- [Use private endpoints for your Purview account](catalog-private-link.md)

## Prerequisites

Ensure that you've performed the following prerequisites before adding your Amazon RDS database as Purview data sources and scanning your RDS data.

> [!div class="checklist"]
> * You need to be an Azure Purview Data Source Admin.
> * You need a Purview account. [Create an Azure Purview account instance](create-catalog-portal.md), if you don't yet have one.
> * You need an Amazon RDS PostgreSQL or Microsoft SQL database, with data.


## Prepare an RDS database in a VPC

Azure Purview supports scanning only when your database is hosted in a virtual private cloud (VPC), where your RDS database can only be accessed from within the same VPC.

The Azure Purview scanner service runs in a separate, Microsoft account in AWS. To scan your RDS databases, the Microsoft AWS account needs to be able to access your RDS databases in your VPC. To allow this access, you’ll need to configure AWS Private Link between the RDS VPC (in the customer account) to the VPC where the Purview scanner runs (in the Microsoft account).

The following diagram shows the components in both your customer account and Microsoft account. Highlighted in yellow are the components you’ll need to create to enable connectivity RDS VPC in your account to the VPC where the Purview scanner runs in the Microsoft account.

:::image type="content" source="media/register-scan-amazon-rds/vpc-architecture.png" alt-text="Diagram of the Purview Scanner service in a VPC architecture.":::

TBD automatic procedure and QUESTION to Oded do we want both automatic and manual procedure?


 
## Register an Amazon RDS data source

**To add your Amazon RDS server as an Azure Purview data source**:

1. In Azure Purview, navigate to the **Data Map** page, and select **Register** ![Register icon.](./media/register-scan-amazon-s3/register-button.png).

1.	On the **Sources** page, select **Register.** On the **Register sources** page that appears on the right, select the **Database** tab, and then select **Amazon RDS (PostgreSQL)** or **Amazon RDS (SQL)**.

    :::image type="content" source="media/register-scan-amazon-rds/register-amazon-rds.png" alt-text="Screenshot of the Register sources page to select Amazon RDS (PostgreSQL).":::

1. Enter the details for your source:

    - **Name**: Enter a meaningful name for your source, such as `AmazonPostgreSql-Ups`

    - **Server name**: Enter the name of your RDS database in the following syntax: `<instance identifier>.<xxxxxxxxxxxx>.<region>.rds.amazonaws.com`

        > [!NOTE]
        > We recommend that you copy this URL from the Amazon RDS portal, and make sure that the URL includes the AWS region.
        >

    - **Port** : Enter the port used to connect to the RDS database:
        - PostgreSQL: `5432`
        - Microsoft SQL: `1433`

    - **Connect to private network via endpoint service**: Enter the value of the service name you located at the end of TBD.

    - **Collection** (optional): Select a collection to add your data source to. For more information, see [Manage data sources in Azure Purview (Preview)](manage-data-sources.md).

1. Select **Register** when you’re ready to continue.

Your RDS data source appears in the Sources map or list. For example:

:::image type="content" source="media/register-scan-amazon-rds/amazon-rds-in-sources.png" alt-text="Screenshot of an Amazon RDS data source on the Sources page.":::

## Create Purview credentials for your RDS scan

Credentials supported for Amazon RDS data sources include username/password authentication only, with a password stored in an Azure KeyVault secret.

### Create a secret for your RDS credentials to use in Purview

1.	Add your password to an Azure KeyVault as a secret. For more information, see [Set and retrieve a secret from Key Vault using Azure portal](/azure/key-vault/secrets/quick-create-portal).

1.	Add an access policy to your KeyVault with **Get** and **List** permissions. For example:

    :::image type="content" source="media/register-scan-amazon-rds/keyvault-for-rds.png" alt-text="Screenshot of an access policy for RDS in Purview.":::

    When defining the principal for the policy, select your Purview account. For example:

    :::image type="content" source="media/register-scan-amazon-rds/select-purview-as-principal.png" alt-text="Screenshot of selecting your Purview account as Principal.":::

    Select **Save** to save your Access Policy update. For more information, see [Assign an Azure Key Vault access policy](/azure/key-vault/general/assign-access-policy-portal).

1. In Azure Purview, add a KeyVault connection to connect the KeyVault with your RDS secret to Purview. For more information, see [Credentials for source authentication in Azure Purview](manage-credentials.md).

### Create your Purview credential object for RDS

In Azure Purview, create a credentials object to use when scanning your Amazon RDS account.

1. In the Purview **Management** area, select **Security and access** > **Credentials** > **New**.

1. Select **SQL authentication** as the authentication method. Then, enter details for the Key Vault where your RDS credentials are stored, including the names of your Key Vault and secret.

    For example:

    :::image type="content" source="media/register-scan-amazon-rds/new-credential-for-rds.png" alt-text="Screenshot of a new credential for RDS.":::

For more information, see [Credentials for source authentication in Azure Purview](manage-credentials.md).

## Scan an Amazon RDS database

To configure an Azure Purview scan for your RDS database:

1.	From the Purview **Sources** page, select the Amazon RDS data source to scan.

1.	Select :::image type="icon" source="media/register-scan-amazon-s3/new-scan-button.png" border="false"::: **New scan** to start defining your scan. In the pane that opens on the right, enter the following details, and then select **Continue**.

    - **Name**: Enter a meaningful name for your scan.
    - **Database name**: Enter the name of the database you want to scan. You’ll need to find the names available from outside Purview, and create a separate scan for each database in the registered RDS server.
    - **Credential**: Select the credential you created earlier for the Purview scanner to access the RDS database.

1.	In the **Scope your scan** pane, select the tables you want to scan and then select **Continue**.

1.	In the **Select a scan rule set** pane, select the scan rule set you want to use, or create a new one. For more information, see [Create a scan rule set](create-a-scan-rule-set.md).

1.	In the **Set a scan trigger** pane, select whether you want to run the scan once, or at a recurring time, and then select **Continue**.

1.	In the **Review your scan** pane, review the details and then select **Save and Run**, or **Save** to run it later.

While you run your scan, select **Refresh** to monitor the scan progress.

> [!NOTE]
> When working with Amazon RDS PostgreSQL databases, only full scans are supported. Incremental scans are not supported as PostgreSQL does not have a **Last Modified Time** value. 
>

## Explore scanning results

After a Purview scan is complete on your Amazon RDS databases, drill down in the Purview **Data Map**  area to view the scan history. Select a data source to view its details, and then select the **Scans** tab to view any currently running or completed scans.

Use the other areas of Purview to find out details about the content in your data estate, including your Amazon RDS databases:

- **Explore RDS data in the catalog**. The Purview catalog shows a unified view across all source types, and RDS scanning results are displayed in a similar way to Azure SQL. You can browse the catalog using filters or browse the assets and navigate through the hierarchy. For more information, see:

    - [Tutorial: Browse assets in Azure Purview (preview) and view their lineage](tutorial-browse-and-view-lineage.md)
    - [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
    - [Register and scan an Azure SQL Database](register-scan-azure-sql-database.md)

- **View Insight reports** to view statistics for the classification, sensitivity labels, file types, and more details about your content.

    All Purview Insight reports include the Amazon RDS scanning results, along with the rest of the results from your Azure data sources. When relevant, an additional **Amazon RDS** asset type was added to the report filtering options.

    For more information, see the [Understand Insights in Azure Purview](concept-insights.md).

- **View RDS data in other Purview features**, such as the **Scans** and **Glossary** areas. For more information, see:

    - [Create a scan rule set](create-a-scan-rule-set.md)
    - [Tutorial: Create and import glossary terms in Azure Purview (preview)](tutorial-import-create-glossary-terms.md)


## Next steps

Learn more about Azure Purview Insight reports:

> [!div class="nextstepaction"]
> [Understand Insights in Azure Purview](concept-insights.md)
