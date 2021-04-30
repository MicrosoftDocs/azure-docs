---
title: 'Tutorial: Scan data with Azure Purview (preview)'
description: In this tutorial, you run a starter kit to set up a data estate, and then scan data from data sources into your Azure Purview catalog. 
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 12/01/2020
# Customer intent: As a data steward or catalog administrator, I need to understand how to scan data into the catalog.
---
# Tutorial: Scan data with Azure Purview (Preview)

> [!IMPORTANT]
> Azure Purview is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this *five-part tutorial series*, you'll learn the fundamentals of how to manage data governance across a data estate using Azure Purview (Preview). The data estate you create in this part of the tutorial is used for the rest of the series.

In part 1 of this tutorial series, you will:

> [!div class="checklist"]
>
> * Create a data estate with various Azure data resources.
> * Scan data into a catalog.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
* An [Azure Purview account](create-catalog-portal.md).
* [The starter kit](https://github.com/Azure/Purview-Samples/blob/master/PurviewStarterKitV4.zip) that will deploy your data estate.

> [!NOTE]
> The starter kit is only available for Windows.

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

1. [Download the starter kit](https://github.com/Azure/Purview-Samples/blob/master/PurviewStarterKitV4.zip), and extract its contents to the location of your choice.


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
   > - Make sure you're using the same subscription as the one in which you created the Azure Purview Account. This is the same subscription that was placed in the allow list.
   > - Lineage could be missing sometimes in Azure Purview after running the starter kit. This is because the Data Factory created by starter kit has missing permissions in Purview. Select [**this document link**](how-to-link-azure-data-factory.md#view-existing-data-factory-connections)  to make sure the Data Factory is configured correct and assigned appropriate role in Purview


* CatalogName: The name of the Azure Purview account that you created in [Create an Azure Purview account](create-catalog-portal.md).

* CatalogResourceGroupName: The name of the resource group in which you created your Azure Purview account.

### Verify permissions

Follow these steps to add the user running the script to the Azure Purview account that was created as a prerequisite. Users need both *Purview Data Curator* and *Purview Data Source Administrator* roles. 

If you created the Azure Purview account yourself, you're automatically given access and can skip this section.

1. Go to the Purview accounts page in the Azure portal and select the Azure Purview account you want to modify.

1. On the account's page, select the **Access control (IAM)** tab and **+ Add**.

1. Select **Add role assignment**.

1. Enter **Purview Data Curator Role** for the *Role*.
 
1. Use the default value for *Assign access to*. The default value should be **User, group, or service principal**.

1. Enter the name of the user running the script in **Select**.

1. Select **Save**.

1. Repeat the previous steps with the *Role* set to **Purview Data Source Administrator Role**.

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


1. Use the following command to run the starter kit. Replace the `CatalogName`, `TenantID`, `SubscriptionID`, `NewResourceGroupName`, and `CatalogResourceGroupName` placeholders. For `NewResourceGroupName`, use a unique name (with lowercase alphanumeric characters only) for the resource group that will contain the data estate.

   > [!IMPORTANT]
   > The **newresourcegroupname** use numbers and lower-case letters only and must be less than 17 characters. **No upper case alphabets and special characters are allowed.** This constraint comes from storage account naming rules.

   ```powershell
   .\RunStarterKit.ps1 -CatalogName <CatalogName> -TenantId <TenantID>`
   -ResourceGroup <newresourcegroupname> `
   -SubscriptionId <SubscriptionID> `
   -CatalogResourceGroup <CatalogResourceGroupName>
   ```

It can take up to 10 minutes for the environment to be set up. During this time, you might see various pop-up windows, which you can ignore. Don't close the **BlobDataCreator.exe** window; it automatically closes when it finishes.

When you see the message `Executing Copy pipeline xxxxxxxxxx-487e-4fc4-9628-92dd8c2c732b`, wait for another instance of **BlobDataCreator.exe** to start and finish running.

> [!IMPORTANT]
> In case the 'Number of active tasks' stops decreasing, then you can exit the blob creator window and hit enter on the powershell window

After the process has finished, a resource group with the name you supplied is created. The Azure Data Factory, Azure Blob storage, and Azure Data Lake Storage Gen2 accounts are all contained in this resource group. The resource group is contained in the subscription you specified.

## Scan data into the catalog

Scanning is a process by which the catalog connects directly to a data source on a user-specified schedule. The catalog reflects a company's data estate through scanning, lineage, the portal, and the API. Goals include examining what's inside, extracting schemas, and attempting to understand semantics. In this section, you set up a scan of the data sources you generated with the starter kit.

The starter kit script that you ran created two data sources, Azure Blob storage and Azure Data Lake Storage Gen2. You can scan these data sources into the catalog one at a time.

### Authenticate to your storage with Managed Identity

A Managed Identity with the same name as your Azure Purview account is automatically created when your account is created. Before you can scan your data, you need to give Azure Purview role permissions on your storage accounts.

1. Navigate to the resource group that was created by the starter kit and select your blob storage account.

1. Select **Access Control (IAM)** from the left navigation menu. Then, select **+ Add**.

1. Set the Role to **Storage Blob Data Reader** and enter your Azure Purview account name for **Select**. Then, select **Save** to give this role assignment to your Purview account.

   :::image type="content" source="media/tutorial-scan-data/add-role-assignment.png" alt-text="Add role assignment":::

1. Repeat the previous steps for Azure Data Lake Storage Gen2.

### Scan your data sources

1. Navigate to your Azure Purview resource in the [Azure portal](https://portal.azure.com) and select *Open Purview Studio*. You're automatically taken to your Purview Studio's home page.

1. Select **Sources** on your catalog's webpage, and select **Register**. Then, select **Azure Blob Storage** and **Continue**.

   :::image type="content" source="media/tutorial-scan-data/add-blob-storage.png" alt-text="Register blob storage resource":::

1. On the **Register sources** page, enter a **Name**. Choose the **Storage account name** of the Azure Blob storage account that you previously created with the starter kit. The account has the name `<YourResourceGroupName>adcblob`. Select **Finish**.

   :::image type="content" source="./media/tutorial-scan-data/register-azure-blob-storage.png" alt-text="Screenshot showing the settings to register an Azure Blob storage data source." border="true":::

1. On the **Data sources** map view, select **New scan** on the Azure Blob Storage tile.

   :::image type="content" source="./media/tutorial-scan-data/select-setup-scan.png" alt-text="Screenshot showing how to select a scan setup from a data source." border="true":::

1. On the **Scan** page, enter a scan name, select your Managed Identity from the **Credential** dropdown, and **Continue**.

   :::image type="content" source="media/tutorial-scan-data/scan-blob.png" alt-text="Scan blob storage in Azure Purview":::

1. You can scope your scan to individual blobs. In this tutorial, keep all assets checked to scan everything and **Continue**.

   :::image type="content" source="media/tutorial-scan-data/scope-your-scan.png" alt-text="Scope your storage scan":::

1. Select the default scan rule set, and **Continue**.

1. You can set up a scan trigger for recurring scans. For this tutorial, select **Once** and **Continue**.

1. Select **Save and run** to complete the scan.

1. Repeat the previous steps to scan your Azure Data Lake Storage Gen2 account.

## Next steps

In this tutorial, you learned how to:
> [!div class="checklist"]
>
> * Run the starter kit script to set up a data estate environment.
> * Scan data into an Azure Purview catalog.

Advance to the next tutorial to learn how to navigate the home page and search for an asset.

> [!div class="nextstepaction"]
> [Navigate the home page and search for an asset](tutorial-asset-search.md)
