---
title: 'Tutorial: Run the starter kit and scan data'
description: This tutorial describes how to run the starter kit to set up a data estate, and then to scan data from data sources into your Azure Purview catalog. 
author: viseshag
ms.author: viseshag
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: tutorial
ms.date: 09/23/2020
# Customer intent: As a data steward or catalog administrator, I need to understand how to scan data into the catalog.
---

# Tutorial: Run the starter kit and scan data

The starter kit in this tutorial gives you a quick tour of how Azure Purview works and what it can do. To make it easy for you to experiment and explore, the starter kit client-side code follows these steps to create a simulated *data estate*, which is the state of all the data that a company owns:

* Creates an Azure Blob storage account.
* Populates the account with test data.
* Creates an Azure Data Lake Storage Gen2 account.
* Creates an Azure Data Factory instance.
* Associates the Azure Data Factory instance to Azure Purview.
* Sets up and triggers a copy activity pipeline between the Azure Blob storage and Azure Data Lake Storage Gen2 accounts.
* Pushes the associated lineage from Azure Data Factory to Azure Purview.

After the starter kit creates this infrastructure, it walks you through setting up scans on the Azure Blob storage and Azure Data Lake Storage Gen2 accounts. This environment is then reused throughout the next tutorials in the series.

:::image type="content" source="./media/starter-kit-tutorial-1/azure-resources-created-by-starter-kit.png" alt-text="Diagram showing the Azure resources created by the starter kit." border="true":::

In this tutorial, you learn how to:
> [!div class="checklist"]
>
> * Run the starter kit script to set up an evironment to use to complete this tutorial and the next tutorials in the series.
> * Scan data into the catalog.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Prerequisites

* [Prepare your Windows machine by running a series of scripts](#prepare-your-machine-to-run-the-starter-kit). These scripts work only on Windows.

* [Create an Azure Purview account](create-catalog-portal.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## What the starter kit client software does

When you run the starter kit script, it does the following steps on your behalf:

1. Creates an Azure Data Factory account in your subscription named _&lt;YourResourceGroupName&gt;_**adcfactory**.

1. Associates the newly created Azure Data Factory account to the Azure Data Catalog instance whose name you passed in.

1. Creates an Azure Blob storage account in your subscription named _&lt;YourResourceGroupName&gt;_**adcblob**.

1. Populates the new Azure Blob storage account with simulated .tsv, .csv, .ssv, and .json data inside a folder structure with the form *yyyy/mm/dd/foo*.csv.

1. Creates an Azure Data Lake Storage Gen2 account in your subscription named _&lt;YourResourceGroupName&gt;_**adcadls**.

1. Triggers an Azure Data Factory copy activity in your Azure Data Factory account to copy data from the Azure Blob storage account to the Azure Data Lake Storage Gen2 account.

1. Pushes the lineage associated with the copy activity into the catalog.

## Prepare your machine to run the starter kit

Follow these steps to set up the starter kit client software on your Windows machine:

1. Download to your computer the .zip file that contains the starter kit. Extract its contents to the location of your choice.

1. On your computer, enter **PowerShell** in the search box on the Windows taskbar. In the search list, right-click **Windows PowerShell**, and then select **Run as administrator**.

1. In the PowerShell window, enter the following command, replacing *&lt;PathtoStarterKit&gt;* with the folder path of the extracted starter kit files.

   ```powershell
   dir -Path <PathtoStarterKit> -Recurse | Unblock-File
   ```

   For example:

   ```powershell
   dir -Path C:\CatalogStarterKit\Starterkit -Recurse | Unblock-File```
   ```

1. Enter the following command to install the Azure cmdlets.

   ```powershell
   Install-Module -Name Az -AllowClobber -Scope CurrentUser
   ```

1. If you see the warning prompt, *NuGet provider is required to continue*, enter **Y**, and then press Enter.

   :::image type="content" source="./media/starter-kit-tutorial-1/nuget-warning.png" alt-text="Screenshot showing an example of a NuGet warning." border="true":::
1. If you see the warning prompt, *Untrusted repository*, enter **A**, and then press Enter.

   :::image type="content" source="./media/starter-kit-tutorial-1/untrusted-repository-warning.png" alt-text="Screenshot showing an example of an untrusted repository warning." border="true":::

It might take up to a minute for PowerShell to install the required modules. When it's finished, you can run the catalog scripts described in the next section.

## Run the starter kit script

### Collect data needed to run the scripts

Before you run the PowerShell scripts to bootstrap the catalog, get the values of the following arguments to use in the scripts:

* TenantID:
   1. In the [Azure portal](https://portal.azure.com), select **Azure Active Directory**.
   1. In the **Manage** section in the left pane, select **Properties**, and then select the copy icon for **Tenant ID** to save the value.

* SubscriptionID:
   1. In the Azure portal, search for and select the name of the Azure Purview instance that you created. 
   1. Select the **Overview** section and save the GUID for the **Subscription ID**.

   > [!NOTE]
   > Make sure you're using the same subscription as the one in which you created the catalog. This is the same subscription that was placed in the allow list.
  
* PathtoStarterKit: The Windows file folder path where you downloaded and extracted the starter kit's .zip file.
* CatalogName: The name of the Azure Purview account that you created in [Create an Azure Purview account](create-catalog-portal.md).
* NewResourceGroupName: The new resource group name to use. Resource group names must be unique with your subscription, all lowercase, and made up of only A-Z and 0-9 characters.

### Verify the user running the script has catalog permissions

Follow these steps to add the Catalog admin running the script to the Azure Purview account that was created in [Create a Purview account](create-catalog-portal.md). If you created the Azure Purview account yourself, you're automatically made an admin and an Azure contributor, and can skip this section.

1. Browse to the Azure Purview catalog home page by using one of these methods:
   * Go to `https://web.babylon.azure.com/resource/<Your Azure Purview account name>`.
   * In the [Azure portal](https://portal.azure.com), search for and select your Azure Purview account, and then select **Launch purview account**.
1. Select **Management Center** in the left pane, and then select **Assign roles**.

1. Select the **Add user** drop-down list from the top menu, and then select **Catalog administrator**.

1. From the **Add catalog administrator** page, enter the name or email of the person to add, and then select **Apply**.

### Run the client-side setup scripts

After the catalog configuration is complete, run the following scripts in the PowerShell window to create the assets,  replacing the placeholders with the [values you previously collected](#collect-data-needed-to-run-the-scripts):

1. **Go to the starter kit folder**.

   Enter the following command and press Enter. Replace *&lt;PathtoStarterKit&gt;* with the folder path of the extracted file.

   ```powershell
   cd <PathtoStarterKit>
   ```

1. **Set the execution policy for the local computer**.

   Enter the following command to make sure you can run the PowerShell script:

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy Unrestricted
   ```

1. **Connect to Azure**.

   Enter the following command, replacing the *&lt;TenantID&gt;* and *&lt;SubscriptionID&gt;* placeholders, and then press Enter. Be sure to connect to the same subscription as the one you created earlier for your catalog.

   ```powershell
   .\\RunStarterKit.ps1 -ConnectToAzure -TenantId <TenantID>
   -SubscriptionId <SubscriptionID>
   ```

   After you enter the command, you might be requested to sign in using your Azure Active Directory credentials.

1. **Ingest data**.

   Enter the following command, replacing the *&lt;CatalogName&gt;*, *&lt;TenantID&gt;*, *&lt;SubscriptionID&gt;*, and *&lt;NewResourceGroupName&gt;* placeholders. This command runs the starter kit.

   ```powershell
   .\\RunStarterKit.ps1 -CatalogName <CatalogName> -TenantId
   <TenantID> -SubscriptionId <SubscriptionID> -ResourceGroup
   <NewResourceGroupName>
   ```

It can take up to 10 minutes for the environment to be set up. During this time, you might see various pop-up windows, which you can ignore. Don't close the **BlobDataCreator.exe** window; it automatically closes when it finishes.

When you see the message *Executing Copy pipeline xxxxxxxxxx-487e-4fc4-9628-92dd8c2c732b*, wait for another instance of **BlobDataCreator.exe** to start and finish running.

After the process has finished, a resource group with the name you supplied is created. The Azure Data Factory, Azure Blob storage, and Azure Data Lake Storage Gen2 accounts are all contained in this resource group. The resource group is contained in the subscription you specified.

## Scan data into the catalog

Scanning is a process by which the catalog connects directly to a data source on a user-specified schedule. The catalog reflects a company's data estate through scanning, lineage, the portal, and the API. Goals include examining what's inside, extracting schema, and attempting to understand semantics. In this section, you set up a scan of the content you generated with the starter kit.

The starter kit script that you ran created two data sources, Azure Blob storage and Azure Data Lake Storage Gen2. You can scan these data sources into the catalog one at a time.

To scan the Azure Blob storage data source:

1. Select **Management Center** on your catalog's webpage, and then select **Data sources**.

   :::image type="content" source="./media/starter-kit-tutorial-1/select-management-center-data-sources.png" alt-text="Screenshot showing how to select Management Center and Data sources from your catalog." border="true":::

1. From the **Data sources** page, select **New** to add a new data source.

   :::image type="content" source="./media/starter-kit-tutorial-1/select-new-data-source.png" alt-text="Screenshot showing how to select a new data source on the Data sources page." border="true":::
1. Select **Azure Blob Storage** > **Continue**.

   :::image type="content" source="./media/starter-kit-tutorial-1/select-azure-blob-storage.png" alt-text="Screenshot showing Azure Blob Storage selected for a new data source." border="true":::
1. On the **Register sources** page, enter a **Name**. Choose the **Storage account name** of the Azure Blob storage account that you previously created with the starter kit: &lt;*YourResourceGroupName*&gt;**adcblob**. Select **Finish**.

   :::image type="content" source="./media/starter-kit-tutorial-1/register-azure-blob-storage.png" alt-text="Screenshot showing the settings to register an Azure Blob storage data source." border="true":::
1. On the **Data sources** page, select **Set up scan** in the entry for the new data source you registered.

   :::image type="content" source="./media/starter-kit-tutorial-1/select-setup-scan.png" alt-text="Screenshot showing how to select a scan setup from a data source." border="true":::
1. On the **Set up a scan** page, enter a scan name, and then select **Account Key** from the **Authentication method** drop-down list.

   :::image type="content" source="./media/starter-kit-tutorial-1/set-up-a-scan.png" alt-text="Screenshot showing the page to set up a scan for a data source" border="true":::
1. To give the scanners permissions to scan, you need the storage account key:
   1. In the [Azure portal](https://portal.azure.com), search for and select the name of the Azure Blob storage account that you created as part of running the script.
   1. Select **Access keys** under **Settings**, and then copy the value of key1 from this page.

      :::image type="content" source="./media/starter-kit-tutorial-1/key1-settings.png" alt-text="Screenshot showing the settings for key1 on the storage account page." border="true":::
   1. On the **Set up a scan** page, paste the key1 value to **Storage account key**, and then select **Continue**.
1. Set the scan to run once. On the **Set a scan trigger** page, select **Once**, and then select **Continue**.

   :::image type="content" source="./media/starter-kit-tutorial-1/set-a-scan-trigger.png" alt-text="Screenshot show how to set a scan trigger.to scan once." border="true":::
1. On the **Review your scan** page, select **Save and Run** to complete setting up the scan.

To scan the Azure Data Lake Storage Gen2 data source:

1. From the **Data sources** page, select **New**.

   :::image type="content" source="./media/starter-kit-tutorial-1/select-new-data-source.png" alt-text="Screenshot showing how to select a new data source on the Data sources page." border="true":::

1. From the **New data source** page, select **Azure Data Lake Storage Gen2** > **Continue**.

   :::image type="content" source="./media/starter-kit-tutorial-1/select-azure-data-lake-storage-gen2.png" alt-text="Screenshot showing the Azure Data Lake Storage Gen2 data source selected." border="true":::

1. On the **Register sources** page, enter a **Name**. Choose the **Storage account name** of the Azure Data Lake Storage Gen2 storage account that you previously created with the starter kit: &lt;*YourResourceGroupName*&gt;**adcadls**. Select **Finish**.

   :::image type="content" source="./media/starter-kit-tutorial-1/register-azure-data-lake-storage.png" alt-text="Screenshot showing the settings to register an Azure Data Lake Storage Gen2 data source." border="true":::
1. On the **Data sources** page, select **Set up scan** in the entry for the new data source you registered.
1. On the **Set up a scan** page, enter a scan name, and then select **Account Key** from the **Authentication method** drop-down list.
1. Obtain the key the same way you did for the Azure Blob data source, and then select **Continue**.
1. Set the scan to run once. On the **Set a scan trigger** page, select **Once**, and then select **Continue**.
1. On the **Review your scan** page, select **Save and Run** to complete setting up the scan.

To verify that your scans have succeeded:

1. Select **Management Center** > **Data sources**, and then select the data source.

   If the data source scan that you selected has finished, its **Last scan status** state is **Successfully Completed**. Otherwise, if the scan hasn't finished, it can be in the **Scan Queued** or the **Scan in-progress** state.

   :::image type="content" source="./media/starter-kit-tutorial-1/data-source-scan-status.png" alt-text="Screenshot showing the scan status screen for the sample data source." border="true":::

1. Select the completed scan.

   :::image type="content" source="./media/starter-kit-tutorial-1/scan-run-history.png" alt-text="Screenshot showing a successful scan run screen." border="true":::

## Scanning data into the catalog using custom classification

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
