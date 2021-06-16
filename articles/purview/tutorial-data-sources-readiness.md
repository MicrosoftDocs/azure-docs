---
title: 'Check data source readiness at scale (preview)'
description: In this tutorial, you'll verify the readiness of your Azure data sources before you register and scan them in Azure Purview. 
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 05/28/2021
# Customer intent: As a data steward or catalog administrator, I need to onboard Azure data sources at scale before I register and scan them.
---
# Tutorial: Check data source readiness at scale (preview)

> [!IMPORTANT]
> Azure Purview is currently in preview. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta or preview or are otherwise not yet released to general availability.

To scan data sources, Azure Purview requires access to them. It uses credentials to obtain this access. A *credential* is the authentication information that Azure Purview can use to authenticate to your registered data sources. There are a few ways to set up the credentials for Azure Purview, including: 
- A managed identity assigned to the Azure Purview account.
- A key vault. 
- Service principals.

In this two-part tutorial series, we'll help you verify and configure required Azure role assignments and network access for various Azure data sources across your Azure subscriptions at scale. You can then register and scan your Azure data sources in Azure Purview. 

Run the [Azure Purview data sources readiness checklist](https://github.com/Azure/Purview-Samples/tree/master/Data-Source-Readiness) script after you deploy your Azure Purview account and before you register and scan your Azure data sources. 

In part 1 of this tutorial series, you'll:

> [!div class="checklist"]
>
> * Locate your data sources and prepare a list of data source subscriptions.
> * Run the readiness checklist script to find any missing RBAC or network configurations across your data sources in Azure.
> * In the output report, review missing network configurations and role assignments required by Azure Purview MSI. 
> * Share the report with data Azure subscription owners so they can take suggested actions.

## Prerequisites

* Azure subscriptions where your data sources are located. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
* An [Azure Purview account](create-catalog-portal.md).
* An Azure Key Vault resource in each subscription that has data sources like Azure SQL Database, Azure Synapse Analytics, or Azure SQL Managed Instance.
* The [Azure Purview data sources readiness checklist](https://github.com/Azure/Purview-Samples/tree/master/Data-Source-Readiness) script.

> [!NOTE]
> The Azure Purview data sources readiness checklist is available only for Windows.
> This readiness checklist script is currently supported for Azure Purview Managed Identity (MSI).

## Prepare Azure subscriptions list for data sources

Before running the script, create a .csv file (for example, C:\temp\Subscriptions.csv) with four columns:

|Column name|Description|Example|
|----|----|----|
|`SubscriptionId`|Azure subscription IDs for your data sources.|12345678-aaaa-bbbb-cccc-1234567890ab|
|`KeyVaultName`|Name of existing key vault that’s deployed in the data source subscription.|ContosoDevKeyVault|
|`SecretNameSQLUserName`|Name of an existing Azure Key Vault secret that contains an Azure Active Directory (Azure AD) user name that can sign in to Azure Synapse, Azure SQL Database, or Azure SQL Managed Instance by using Azure AD authentication.|ContosoDevSQLAdmin|
|`SecretNameSQLPassword`|Name of an existing Azure Key Vault secret that contains an Azure AD user password that can sign in to Azure Synapse, Azure SQL Database, or Azure SQL Managed Instance by using Azure AD authentication.|ContosoDevSQLPassword|
   

**Sample .csv file:**
    
:::image type="content" source="./media/tutorial-data-sources-readiness/subscriptions-input.png" alt-text="Screenshot that shows a sample subscription list." lightbox="./media/tutorial-data-sources-readiness/subscriptions-input.png":::

> [!NOTE] 
> You can update the file name and path in the code, if you need to.



## Run the script and install the required PowerShell modules 

Follow these steps to run the script from your Windows computer:

1. [Download the Azure Purview data sources readiness checklist](https://github.com/Azure/Purview-Samples/tree/master/Data-Source-Readiness) script to the location of your choice.

2. On your computer, enter **PowerShell** in the search box on the Windows taskbar. In the search list, right-click **Windows PowerShell** and then select **Run as administrator**.

3. In the PowerShell window, enter the following command. (Replace `<path-to-script>` with the folder path of the extracted the script file.)

   ```powershell
   dir -Path <path-to-script> | Unblock-File
   ```

4. Enter the following command to install the Azure cmdlets:

   ```powershell
   Install-Module -Name Az -AllowClobber -Scope CurrentUser
   ```
6. If you see the prompt *NuGet provider is required to continue*, enter **Y**, and then select **Enter**.

7. If you see the prompt, *Untrusted repository*, enter **A**, and then select **Enter**.

5. Repeat the previous steps to install the `Az.Synapse` and `AzureAD` modules.

It might take up to a minute for PowerShell to install the required modules.


## Collect additional data needed to run the script

Before you run the PowerShell script to verify the readiness of data source subscriptions, obtain the values of the following arguments to use in the scripts:

- `AzureDataType`: Choose any of the following options as your data-source type to check the readiness for the data type across your subscriptions: 
    
    - `BlobStorage`

    - `AzureSQLMI`

    - `AzureSQLDB`
    
    - `ADLSGen2`
    
    - `ADLSGen1`
    
    - `Synapse`
    
    - `All`

- `PurviewAccount`: Your existing Azure Purview account resource name.

- `PurviewSub`: Subscription ID where the Azure Purview account is deployed.

## Verify your permissions

Make sure your user has the following roles and permissions:

Role | Scope |
|-------|--------|
| Global Reader | Azure AD tenant |
| Reader | Azure subscriptions where your Azure data sources reside |
| Reader | Subscription where your Azure Purview account is created |
| SQL Admin (Azure AD Authentication) | Azure Synapse dedicated pools, Azure SQL Database instances, Azure SQL managed instances |
| Access to your Azure key vault | Access to get/list key vault's secret or Azure Key Vault secret user |  


## Run the client-side readiness script

Run the script by completing these steps:

1. Use the following command to go to the script's folder. Replace `<path-to-script>` with the folder path of the extracted file.

   ```powershell
   cd <path-to-script>
   ```

2. Run the following command to set the execution policy for the local computer. Enter **A** for *Yes to All* when you're prompted to change the execution policy.

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy Unrestricted
   ```

3. Run the script by using the following parameters. Replace the `DataType`, `PurviewName` and `SubscriptionID` placeholders.

   ```powershell
   .\purview-data-sources-readiness-checklist.ps1 -AzureDataType <DataType> -PurviewAccount <PurviewName> -PurviewSub <SubscriptionID>
   ```

   When you run the command, a pop-up window might appear twice prompting you to sign in to Azure and Azure AD by using your Azure Active Directory credentials.


It can take several minutes to create the report, depending on the number of Azure subscriptions and resources in the environment. 

After the process completes, review the output report, which demonstrates the detected missing configurations in your Azure subscriptions or resources. The results can appear as _Passed_, _Not Passed_, or _Awareness_. You can share the results with the corresponding subscription admins in your organization so they can configure the required settings.


## More information

### What data sources are supported by the script?

Currently, the following data sources are supported by the script:

- Azure Blob Storage (BlobStorage)
- Azure Data Lake Storage Gen 2 (ADLSGen2)
- Azure Data Lake Storage Gen 1 (ADLSGen1)
- Azure SQL Database (AzureSQLDB)
- Azure SQL Managed Instance (AzureSQLMI)
- Azure Synapse (Synapse) dedicated pool

You can choose **all** or any of these data sources as input parameter when running the script.

### What checks are included in the results?

#### Azure Blob Storage (BlobStorage)

- RBAC: Verify if Azure Purview MSI has 'Storage Blob Data Reader role' in each of the subscriptions below the selected scope.
- RBAC: Verify if Azure Purview MSI has 'Reader' role on selected scope.
- Service Endpoint: Verify if Service Endpoint is ON, AND check if 'Allow trusted Microsoft services to access this storage account' is enabled.
- Networking: check if Private Endpoint is created for storage and enabled for Blob.

#### Azure Data Lake Storage Gen 2 (ADLSGen2)

- RBAC: Verify if Azure Purview MSI has 'Storage Blob Data Reader' role in each of the subscriptions below the selected scope.
- RBAC: Verify if Azure Purview MSI has 'Reader' role on selected scope.
- Service Endpoint: Verify if Service Endpoint is ON, AND check if 'Allow trusted Microsoft services to access this storage account' is enabled.
- Networking: check if Private Endpoint is created for storage and enabled for Blob Storage.

#### Azure Data Lake Storage Gen 1 (ADLSGen1)

- Networking: Verify if Service Endpoint is ON, AND check if 'Allow all Azure services to access this Data Lake Storage Gen1 account' is enabled.
- Permissions: Verify if Azure Purview MSI has access to Read/Execute.

#### Azure SQL Database (AzureSQLDB)

- SQL Servers:
  - Network: Verify if Public or Private Endpoint is enabled.
  - Firewall: Verify if 'Allow Azure services and resources to access this server' is enabled.
  - Azure AD Admin: Check if Azure SQL Server has AAD Authentication.
  - AAD Admin: Populate Azure SQL Server AAD Admin user or group.

- SQL Databases:
  - SQL Role: Check if Azure Purview MSI has db_datareader role.

#### Azure SQL Managed Instance (AzureSQLMI)

- SQL Managed Instance Servers:
  - Network: Verify if Public or Private Endpoint is enabled.
  - ProxyOverride: Verify if Azure SQL Managed Instance is configured as Proxy or Redirect.
  - Networking: Verify if NSG has an inbound rule to allow AzureCloud over required ports; Redirect: 1433 and 11000-11999 or Proxy: 3342.
  - Azure AD Admin: Check if Azure SQL Server has AAD Authentication.
  - AAD Admin: Populate Azure SQL Server AAD Admin user or group.

- SQL Databases:
  - SQL Role: Check if Azure Purview MSI has db_datareader role.

#### Azure Synapse (Synapse) dedicated pool

- RBAC: Verify if Azure Purview MSI has 'Storage Blob Data Reader role' in each of the subscriptions below the selected scope.
- RBAC: Verify if Azure Purview MSI has 'Reader' role on selected scope.
- SQL Servers (dedicated pools):
  - Network: Verify if Public or Private Endpoint is enabled.
  - Firewall: Verify if 'Allow Azure services and resources to access this server' is enabled.
  - Azure AD Admin: Check if Azure SQL Server has AAD Authentication.
  - AAD Admin: Populate Azure SQL Server AAD Admin user or group.

- SQL Databases:
  - SQL Role: Check if Azure Purview MSI has db_datareader role.

## Next steps

In this tutorial, you learned how to:
> [!div class="checklist"]
>
> * Run Azure Purview readiness checklist to verify your Azure subscriptions missing configuration at scale, before they can be registered and scanned in Azure Purview.

Advance to the next tutorial to learn how to navigate the home page and search for an asset.

> [!div class="nextstepaction"]
> [Configure access to data sources for Azure Purview MSI at scale](tutorial-msi-configuration.md)
