---
title: 'Tutorial: Scan data with Azure Purview (Preview)'
description: In this tutorial, you run a starter kit to set up a data estate, and then scan data from data sources into your Azure Purview catalog. 
author: viseshag
ms.author: viseshag
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: tutorial
ms.date: 11/24/2020
# Customer intent: As a data steward or catalog administrator, I need to understand how to scan data into the catalog.
---

# Tutorial: Scan data with Azure Purview (Preview)

In this *six-part tutorial series*, you'll learn the fundamentals of how to manage data governance across a data estate using Azure Purview (Preview). The data estate you create in this part of the tutorial is used for the rest of the series.

In part 1 of this tutorial series, you will:

> [!div class="checklist"]
>
> * Create a data of with various Azure data resources.
> * Scan data into a catalog.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
* An [Azure Purview account](create-catalog-portal.md).
* [The starter kit](https://download.microsoft.com/download/9/7/9/979db3b1-0916-4997-a7fb-24e3d8f83174/PurviewStarterKitV4.zip) that will deploy your data estate.

> [!NOTE]
> The starter kit only available for Windows.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a data estate

In this section, you run the starter kit scripts to create a simulated data estate. A data estate is a portfolio of all the data a company owns. The starter kit script performs the following actions:

* Creates an Azure Blob storage account and populates the account with data.
* Creates an Azure Data Lake Storage Gen2 account.
* Creates an Azure Data Factory instance and associates the instance to Azure Purview.
* Sets up and triggers a copy activity pipeline between the Azure Blob storage and Azure Data Lake Storage Gen2 accounts.
* Pushes the associated lineage from Azure Data Factory to Azure Purview.

### Prepare to run the starter kit

Follow these steps to set up the starter kit client software on your Windows machine:

1. [Download the starter kit](https://download.microsoft.com/download/9/7/9/979db3b1-0916-4997-a7fb-24e3d8f83174/PurviewStarterKitV4.zip), and extract its contents to the location of your choice.

1. On your computer, enter **PowerShell** in the search box on the Windows taskbar. In the search list, right-click **Windows PowerShell**, and then select **Run as administrator**.

1. In the PowerShell window, enter the following command, replacing `<path-to-starter-kit>` with the folder path of the extracted starter kit files.

   ```powershell
   dir -Path <path-to-starter-kit> -Recurse | Unblock-File
   ```

1. Enter the following command to install the Azure cmdlets.

   ```powershell
   Install-Module -Name Az -AllowClobber -Scope CurrentUser
   ```

1. If you see the warning prompt, *NuGet provider is required to continue*, enter **Y**, and then press Enter.

1. If you see the warning prompt, *Untrusted repository*, enter **A**, and then press Enter.

It might take up to a minute for PowerShell to install the required modules.

### Collect data needed to run the scripts

Before you run the PowerShell scripts to bootstrap the catalog, get the values of the following arguments to use in the scripts:

* TenantID
   1. In the [Azure portal](https://portal.azure.com), select **Azure Active Directory**.
   1. In the **Manage** section of the left navigation pane, select **Properties**. Then select the copy icon for **Tenant ID** to save the value to your clipboard. Paste the value in a text editor for later use.

* SubscriptionID
   1. In the Azure portal, search for and select the name of the Azure Purview instance that you created as a prerequisite.
   1. Select the **Overview** section and save the GUID for the **Subscription ID**.

   > [!NOTE]
   > Make sure you're using the same subscription as the one in which you created the Azure Purview Account. This is the same subscription that was placed in the allow list.

* CatalogName: The name of the Azure Purview account that you created in [Create an Azure Purview account](create-catalog-portal.md).

### Verify permissions

Follow these steps to add the user running the script to the Azure Purview account that was created as a prerequisite. Users need both *Azure Purview Data Curator* and *Azure Purview Data Source Administrator* roles. 

If you created the Azure Purview account yourself, you're automatically given access and can skip this section.

1. Go to the Purview accounts page in the Azure portal and select the Azure Purview account you want to modify.

1. On the account's page, select the **Access control (IAM)** tab and **+ Add**.

1. Select **Add role assignment**.

1. Enter **Azure Purview Data Curator Role** for the *Role*.
 
1. Use the default value for *Assign access to*. The default value should be **User, group, or service principal**.

1. Enter the name of the user running the script in **Select**.

1. Select **Save**.

1. Repeat the previous steps with the *Role* set to **Azure Purview Data Source Administrator Role**.

For more information, see [Catalog Permissions](catalog-permissions.md).

### Run the client-side setup scripts

After the catalog configuration is complete, run the following scripts in the PowerShell window to create the assets, replacing the placeholders with the values you previously collected.

1. Use the following command to navigate to the starter kit directory. Replace `path-to-starter-kit` with the folder path of the extracted file.

   ```powershell
   cd <path-to-starter-kit>
   ```

1. The following command sets the execution policy for the local computer. Enter **A** for *Yes to All* when you are prompted to change the execution policy.

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy Unrestricted
   ```

1. Connect to Azure using the following command. Replace the `TenantID` and `SubscriptionID` placeholders.

   ```powershell
   .\RunStarterKit.ps1 -ConnectToAzure -TenantId <TenantID> `
   -SubscriptionId <SubscriptionID>
   ```

   When you run the command, a pop-up window may appear for you to sign in using your Azure Active Directory credentials.

1. Use the following command to run the starter kit. Replace the `CatalogName`, `TenantID`, `SubscriptionID`, and `NewResourceGroupName` placeholders. For `NewResourceGroupName`, use a unique name for the resource group that will contain the data estate.

   ```powershell
   .\RunStarterKit.ps1 -CatalogName <CatalogName> -TenantId `
   <TenantID> -SubscriptionId <SubscriptionID> -CatalogResourceGroup `
   <NewResourceGroupName>
   ```

It can take up to 10 minutes for the environment to be set up. During this time, you might see various pop-up windows, which you can ignore. Don't close the **BlobDataCreator.exe** window; it automatically closes when it finishes.

When you see the message `Executing Copy pipeline xxxxxxxxxx-487e-4fc4-9628-92dd8c2c732b`, wait for another instance of **BlobDataCreator.exe** to start and finish running.

After the process has finished, a resource group with the name you supplied is created. The Azure Data Factory, Azure Blob storage, and Azure Data Lake Storage Gen2 accounts are all contained in this resource group. The resource group is contained in the subscription you specified.

## Scan data into the catalog

Scanning is a process by which the catalog connects directly to a data source on a user-specified schedule. The catalog reflects a company's data estate through scanning, lineage, the portal, and the API. Goals include examining what's inside, extracting schemas, and attempting to understand semantics. In this section, you set up a scan of the data sources you generated with the starter kit.

The starter kit script that you ran created two data sources, Azure Blob storage and Azure Data Lake Storage Gen2. You can scan these data sources into the catalog one at a time.

### Scan the Azure Blob storage data source

1. Select **Management Center** on your catalog's webpage, and then select **Data sources**.

   :::image type="content" source="./media/starter-kit-tutorial-1/select-management-center-data-sources.png" alt-text="Screenshot showing how to select Management Center and Data sources from your catalog." border="true":::

1. From the **Data sources** page, select **New** to add a new data source.

   :::image type="content" source="./media/starter-kit-tutorial-1/select-new-data-source.png" alt-text="Screenshot showing how to select a new data source on the Data sources page." border="true":::
1. Select **Azure Blob Storage** > **Continue**.

   :::image type="content" source="./media/starter-kit-tutorial-1/select-azure-blob-storage.png" alt-text="Screenshot showing Azure Blob Storage selected for a new data source." border="true":::

1. On the **Register sources** page, enter a **Name**. Choose the **Storage account name** of the Azure Blob storage account that you previously created with the starter kit. The account has the name `<YourResourceGroupName>adcblob`. Select **Finish**.

   :::image type="content" source="./media/starter-kit-tutorial-1/register-azure-blob-storage.png" alt-text="Screenshot showing the settings to register an Azure Blob storage data source." border="true":::

1. On the **Data sources** page, select **Set up scan** in the entry for the new data source you registered.

   :::image type="content" source="./media/starter-kit-tutorial-1/select-setup-scan.png" alt-text="Screenshot showing how to select a scan setup from a data source." border="true":::

1. On the **Set up a scan** page, enter a scan name, and then select **Account Key** from the **Authentication method** drop-down list.

   :::image type="content" source="./media/starter-kit-tutorial-1/set-up-a-scan.png" alt-text="Screenshot showing the page to set up a scan for a data source" border="true":::

1. To give the scanners permissions to scan, you need the storage account key.
   1. In the [Azure portal](https://portal.azure.com), search for and select the name of your Azure Blob storage account, `<YourResourceGroupName>adcblob`.
   1. Select **Access keys** under **Settings**, and then copy the value of *key1*.

      :::image type="content" source="./media/starter-kit-tutorial-1/key1-settings.png" alt-text="Screenshot showing the settings for key1 on the storage account page." border="true":::

   1. On the **Set up a scan** page, paste the *key1* value to **Storage account key**, and select **Continue**.

1. On the **Set a scan trigger** page, select **Once**, and then select **Continue**.

   :::image type="content" source="./media/starter-kit-tutorial-1/set-a-scan-trigger.png" alt-text="Screenshot show how to set a scan trigger.to scan once." border="true":::
1. On the **Review your scan** page, select **Save and Run** to complete setting up the scan.

### Scan the Azure Data Lake Storage Gen2 data source

1. From the **Data sources** page, select **New**.

   :::image type="content" source="./media/starter-kit-tutorial-1/select-new-data-source.png" alt-text="Screenshot showing how to select a new data source on the Data sources page." border="true":::

1. From the **New data source** page, select **Azure Data Lake Storage Gen2** > **Continue**.

   :::image type="content" source="./media/starter-kit-tutorial-1/select-azure-data-lake-storage-gen2.png" alt-text="Screenshot showing the Azure Data Lake Storage Gen2 data source selected." border="true":::

1. On the **Register sources** page, enter a **Name**. Choose the **Storage account name** of your Azure Data Lake Storage Gen2 storage account `<YourResourceGroupName>adcadls`. Select **Finish**.

   :::image type="content" source="./media/starter-kit-tutorial-1/register-azure-data-lake-storage.png" alt-text="Screenshot showing the settings to register an Azure Data Lake Storage Gen2 data source." border="true":::

1. On the **Data sources** page, select **Set up scan** in the entry for the new data source you registered.

1. On the **Set up a scan** page, enter a scan name, and then select **Account Key** from the **Authentication method** drop-down list.

1. Obtain the key the same way you did for the Azure Blob data source, and then select **Continue**.

1. Set the scan to run once. On the **Set a scan trigger** page, select **Once**, and then select **Continue**.

1. On the **Review your scan** page, select **Save and Run** to complete setting up the scan.

### Verify scans

1. Select **Management Center** > **Data sources**, and then select the data source.

   If the data source scan that you selected has finished, its **Last scan status** state is **Successfully Completed**. If the scan hasn't finished, it can be in the **Scan Queued** or the **Scan in-progress** state.

   :::image type="content" source="./media/starter-kit-tutorial-1/data-source-scan-status.png" alt-text="Screenshot showing the scan status screen for the sample data source." border="true":::

1. Select the completed scan.

   :::image type="content" source="./media/starter-kit-tutorial-1/scan-run-history.png" alt-text="Screenshot showing a successful scan run screen." border="true":::

## Scan data using custom classifications

First, create a new classification. Perform the following steps:

1. On the left menu select **Management Center**.
1. Under **Metadata management** select **Classifications**.
1. On the **Classifications** screen, select **+ New**.
1. On the **New Classification** screen, enter the following values:
    - Name: `HR.EMPLOYEE_ID`
    - Description: "Employee ID Classification"
1. Click **OK**.

:::image type="content" source="./media/starter-kit-tutorial-1/add-new-classification.png" alt-text="Add a new classification." border="true":::

Next, create a new classification rule. Do the following:

1. Under **Metadata management** select **Classification rules**.
1. On the **Classification rules** screen, click **+ New**.
1. On the **New classification rules** screen, enter the following values:
    - Name: **ContosoEmployeeIDRule**
    - Description: "This rule detects the existence of employee IDs"
    - Classification Name: **HR.EMPLOYEE ID**
    - State: **Enabled**
    - Data Pattern - `^[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}$`
    - Column Pattern - **ID**
1. Click **OK**.

Next, scan the blob storage using the new classification rule set and validate that ID columns have been classified using the new classification rule. 

1. Under **Sources and scanning** select **Data sources**
1. Select the Blob storage account that you wish to scan.

    :::image type="content" source="./media/starter-kit-tutorial-1/select-data-source.png" alt-text="select data source." border="true":::

1. On the scans screen for the storage account, select **+ New scan**
1. Provide a Name for the scan and select the authentication method which will be used. Select **Continue**.
1. On the **Scope your scan** screen, select all of the containers that you wish to scan. Select **Continue**.

    :::image type="content" source="./media/starter-kit-tutorial-1/scope-your-scan.png" alt-text="scope your scan." border="true":::

1. Set the scan trigger to either be **Recurring** or **Once**. Select **Continue**.
1. On the **Select a scan rule set** screen, select the **EmployeeScanruleset** which you created earlier.

    :::image type="content" source="./media/starter-kit-tutorial-1/select-scan-rule-set.png" alt-text="select scan rule set." border="true":::

1. On the **Review your scan** screen, check the details. Then select **Save and Run**.
1. After the scan completes, go to the **Home**. 
1. In the search box, enter `contoso_staging_profitandlossbyteam_ n.tsv`. Select the first result in the search list.
1. On the detailed view of the TSV file, select **Schema**. Notice the new classification **HR.EMPLOYEE_ID** showing in the list of classifications.

    :::image type="content" source="./media/starter-kit-tutorial-1/view-tsv-schema.png" alt-text="view tsv schema." border="true":::

## Next steps

In this tutorial, you learned how to:
> [!div class="checklist"]
>
> * Run the starter kit script to set up an evironment to use to complete this tutorial and the next tutorials in the series.
> * Scan data into the catalog.

Advance to the next tutorial to learn how to navigate the home page and search for an asset.

> [!div class="nextstepaction"]
> [Navigate the home page and search for an asset](starter-kit-tutorial-2.md)
