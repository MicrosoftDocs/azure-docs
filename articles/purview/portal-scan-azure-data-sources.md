---
title: 'Tutorial: Use the portal to scan Azure data sources (preview)'
description: This tutorial describes how to use the Azure Purview portal to scan Azure data sources.
author: prmujumd
ms.author: prmujumd
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: tutorial
ms.date: 10/12/2020
# Customer intent As a data steward, I want to perform scans so that I can classify my data.
---

# Use the portal to scan Azure data sources (preview)

You can use the Purview portal to set up scans of data sources. Advanced users can use the PowerShell cmdlets to create scans.

In this tutorial, you use the Purview portal. You learn how to:

- Add a data source and work with data sources.
- Create a scan and authenticate.
- Set a scan trigger and run your scan.

## Prerequisites

For the tutorial you need:

> [!div class="checklist"]
>
> - A [Microsoft Azure](https://azure.microsoft.com/) subscription.
> - Your own [Azure Active Directory tenant](/azure/active-directory/fundamentals/active-directory-access-create-new-tenant).

To set up a Purview account, you must be the owner or co-owner of the Azure subscription.

To scan content into the catalog, you must have these permissions:

> [!div class="checklist"]
>
> - In the Azure portal, you must be in either the contributor or owner role on the catalog.
> - In the Purview portal, you must be in the Catalog Admin or Data Source Admin role.

## Add a data source and work with data sources

Data sources, such as the following, provide the data for scans:

- An ADLS Gen1 account.
- An ADLS Gen2 account.
- An Azure File Storage account.
- An Azure Blob Storage account.
- An Azure Data Explorer cluster.
- An Azure SQL Server.
- A CosmosDB instance.

To create a scan you must first register a data source in your catalog. A data source is only registered once.

### View data sources

Select **Management Center** in the left navigation pane.

:::image type="content" source="./media/scan-azure-data-sources-portal/image89.png" alt-text="img text" border="true":::

Then select **Data sources**.

:::image type="content" source="./media/scan-azure-data-sources-portal/image90.png" alt-text="image alt-text" border="true":::

The **Data sources** page appears.

:::image type="content" source="./media/scan-azure-data-sources-portal/image91.png" alt-text="image alt-text" border="true":::

### Add a new data source

Select **+ New** to add a new data source.

:::image type="content" source="./media/scan-azure-data-sources-portal/image92.png" alt-text="img text" border="true":::

**New data source** appears with a selection of data source types. Select a type, and then select **Continue**:

:::image type="content" source="./media/scan-azure-data-sources-portal/image93.png" alt-text="img text" border="true":::

Enter a name for your data source, and specify which one to add, in this case which Azure blob. You can then use the drop-down lists to choose an instance to add, or you can specify the URI of your data instance, if it's in a different subscription.

:::image type="content" source="./media/scan-azure-data-sources-portal/image94.png" alt-text="img text" border="true":::

Your selection appears in the list of data sources.

### Edit a data source

Select the check box for the data source you want to edit. Don't select multiple data sources—you only edit one at a time.

:::image type="content" source="./media/scan-azure-data-sources-portal/image95.png" alt-text="img text" border="true":::

Select **Edit** to edit the data source.

:::image type="content" source="./media/scan-azure-data-sources-portal/image96.png" alt-text="img text" border="true":::

### Delete data sources

To delete one or more data sources, select their check boxes.

:::image type="content" source="./media/scan-azure-data-sources-portal/image97.png" alt-text="img text" border="true":::

Then select **Delete**.

## Create a scan and authenticate

### Choose a data source to scan

To set up a scan, start at **Data sources** as in the example above, and select the name (not the check box) of the data source to scan.

The **scans** page appears for the data source. It shows the scans for the data source and, for each, the status of the last run.

### Create a scan

Select **+ New scan** on the **scans** page.

:::image type="content" source="./media/scan-azure-data-sources-portal/image98.png" alt-text="img text" border="true":::

The **Connect to your data source** pane appears and asks for **Scan name** and **Authentication method** to access the data store. Each data source has a distinct set of authentication methods, and the default method varies by data source. For example, for **Azure Blob Store**, the default is managed identity (MSI).

:::image type="content" source="./media/scan-azure-data-sources-portal/image99.png" alt-text="img text" border="true":::

### Authentication: use the catalog managed identity (MSI)

For ease and security, you may want to use the catalog MSI to authenticate with your data store.

To set up a scan using the catalog MSI, you must first give it permission to access whatever resources you're trying to scan. To give permission, add the identity to the appropriate role. Do this before you set up your scan, or your scan will fail.

### Add the catalog MSI to an Azure DataLake Gen2 or Azure Blob Store

You can add the catalog MSI at the appropriate level—subscription, resource group, or resource—depending on what is to be scanned.

 > [!Note]
> You must be an owner of the subscription to add an MSI on an Azure resource.

1. From the Azure portal <https://portal.azure.com/>, find the subscription, resource group, or resource that you want the catalog to scan. For example, you could select an ADLS Gen2 storage account.
1. Select **Access control (IAM)**.

    :::image type="content" source="./media/scan-azure-data-sources-portal/image100.png" alt-text="image alt-text" border="true":::

1. **Add role assignment** appears.

    :::image type="content" source="./media/scan-azure-data-sources-portal/image101.png" alt-text="image alt-text" border="true":::

1. Fill in the dialog box as follows.

    1. For **Role** select **Storage Blob Data Reader** from the list.

        :::image type="content" source="./media/scan-azure-data-sources-portal/image102.png" alt-text="image alt-text" border="true":::

    1. For **Assign access to**, select **Azure AD user, group, or service principal** from the list. It should be the default option.

        :::image type="content" source="./media/scan-azure-data-sources-portal/image103.png" alt-text="image alt-text" border="true":::

    1. In **Select**, start to type the name of catalog, and the name should appear in the list for you to select.

        :::image type="content" source="./media/scan-azure-data-sources-portal/image104.png" alt-text="image alt-text" border="true":::

    1. Select **Save**.

> [!Note]
> After you add the catalog MSI on the data source, allow some time—typically 15 minutes is enough—for permissions to propagate. Then you can set up your scan.

### Add the catalog MSI to an Azure SQL DB/DW/MI

If you want to add the catalog MSI on an Azure SQL DB, first sign in to the Azure SQL Server using Active AD - Universal with MFA authentication:

1. Open SSMS ([SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15)).
1. Enter `<YOURSERVERNAME>.database.windows.net` in **Server Name**.
1. For **Authentication**, select **Azure Active Directory - Universal with MFA**.
1. For **User name** enter `<YOURUSERNAME>@<YOURDOMAIN>`, such as `tester@contoso.com`.

Next, run the following query on the database that you want to scan:

```sql
CREATE USER [yourcatalogname] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [yourcatalogname];
```

For more information about adding MSI to SQL servers, see these articles:

[Create contained users mapped to Azure AD identities](/azure/azure-sql/database/authentication-aad-configure?tabs=azure-powershell#create-contained-users-mapped-to-azure-ad-identities)

[Managed identities for Azure resources authentication](/azure/data-factory/connector-azure-sql-database#managed-identity)

You can now set up a scan, choosing authentication type **Managed Identity** (MSI) for the data stores that support it (currently Azure Blob Storage, ADLS Gen2, and Azure SQL DB).

:::image type="content" source="./media/scan-azure-data-sources-portal/image106.png" alt-text="image alt-text" border="true":::

### Authentication: use the account key to set up a scan

If you choose to use the account key for authorization, find it in the Azure portal. Search for your data source, and select **Settings** > **Access keys**. Copy the first key in the list.

### Authentication: use an SAS URL to set up a scan

To authenticate with a SAS URL, you must generate one. To learn how, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](/azure/storage/common/storage-sas-overview).

### Authentication: use a service principal to set up a scan

To use a service principal, you must first create one:

1. Navigate to portal.azure.com.
1. Select **Azure Active Directory** from the left-hand side menu.
1. Select **App registrations**.
1. Select **+ New application registration**.
1. Enter a name for the application (the service principal name).
1. Select **Accounts in this organizational directory only (Microsoft only - Single Tenant)**.
1. For **Redirect URI**, select **Web** and enter any URL you want; it doesn't have to refer to an actual resource.
1. Select **Register**.
1. Copy down both the display name and the application ID.
1. In the Azure portal, add your service principal to a role on the data stores that you want to scan. For more information about service principals, see [Acquire a token from Azure AD for authorizing requests from a client application](/azure/storage/common/storage-auth-aad-app).

### Authentication: QL/SQL DW authentication

To set up a scan on an Azure SQL DB or Azure SQL DB using SQL Authentication, select **SQL authentication** on the **Authentication method** drop-down list.

The form will then expose fields where for you to provide the database name, user name, and password.

:::image type="content" source="./media/scan-azure-data-sources-portal/image108.png" alt-text="image alt-text" border="true":::

## Set a scan trigger and work with scans

### Set the scan trigger

After you've set up authentication, select **Continue**. **Set the scan trigger** appears. At the top, you choose whether the scan occurs once, or is recurring:

:::image type="content" source="./media/scan-azure-data-sources-portal/image118.png" alt-text="img text" border="true":::

If you select **Recurring**, you can choose either weekly or monthly runs. If you select **Month days**, the dialog box for monthly runs appears.

:::image type="content" source="./media/scan-azure-data-sources-portal/image119.jpg" alt-text="img text" border="true":::

- **Every** lets you enter a number: **1** means every month, **2** means every two months, and so on.
- **Select day of the month to scan** lets you set the day of the month, either a number or **Last**.
- **Schedule scan time (UTC)** is the time of day for the scan.
- The **Start recurrence at (UTC)** is the date and time when the schedule is activated.
- **Specify recurrence end date (UTC)** allows you to specify a date and time when the schedule will deactivate. Check the box to indicate that there should be an end date.

> [!Note]
> If you want a scan to occur today, make sure that the start time is not in the past.

If you select **Week days**, the dialog box for weekly runs appears.

:::image type="content" source="./media/scan-azure-data-sources-portal/image120.jpg" alt-text="img text" border="true":::

- **Every** lets you enter a number: **1** means every week, **2** means every two weeks, and so on.
- **Recur every** lets you set the day of the week.
- **Schedule scan time (UTC)** is the time of day for the scan.
- The **Start recurrence at (UTC)** is the date and time when the schedule is activated.
- **Specify recurrence end date (UTC)** allows you to specify a date and time when the schedule will deactivate. Check the box to indicate that there should be an end date.

### Select the scan rule set

On **Select the scan rule set**, select a scan rule set from the list.

:::image type="content" source="./media/scan-azure-data-sources-portal/image117.png" alt-text="img text" border="true":::

### Review your scan

Select **Continue** and view your settings on the scan summary page.

:::image type="content" source="./media/scan-azure-data-sources-portal/image110.png" alt-text="img text" border="true":::

### Edit a scan

To edit a scan, select it with its check box, and select **Edit**. Don't select multiple scans—you only edit one at a time.

:::image type="content" source="./media/scan-azure-data-sources-portal/image111.png" alt-text="img text" border="true":::

### Remove a scan

To remove one or more scans, select their check boxes, then select **Remove**.

:::image type="content" source="./media/scan-azure-data-sources-portal/image112.png" alt-text="img text" border="true":::

### View scan history

Select any scan in the list to get to the scan history page. This page shows you:

- Whether your scan was scheduled or manual.
- How many assets had classifications applied.
- How many total assets were discovered.
- The start and end time of the scan, and the duration.

:::image type="content" source="./media/scan-azure-data-sources-portal/image113.png" alt-text="img text" border="true":::

From the scan history page, you can choose **Run Scan now** to launch a new scan immediately. This action will run a full scan, not an incremental scan.

:::image type="content" source="./media/scan-azure-data-sources-portal/image114.png" alt-text="img text" border="true":::

### Cancel scans in progress

To select one or more scans that are in progress, select their check boxes.

:::image type="content" source="./media/scan-azure-data-sources-portal/image115.png" alt-text="img text" border="true":::

Then select **Cancel Scan** to stop all the selected scans from running.

:::image type="content" source="./media/scan-azure-data-sources-portal/image116.png" alt-text="img text" border="true":::

## Next steps

In this tutorial, you scanned Azure data sources using the Purview portal.

Advance to the next article to learn how to use the Purview REST APIs to access the contents of your catalog.
> [!div class="nextstepaction"]
> [Tutorial: Use the REST APIs](tutorial-using-rest-apis.md)
