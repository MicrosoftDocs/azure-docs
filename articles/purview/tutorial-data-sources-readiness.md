---
title: 'Tutorial: Check data sources readiness at scale (preview)'
description: In this tutorial, you will run a subset of tools to verify readiness of your Azure data sources before registering and scanning them in Azure Purview. 
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 05/28/2021
# Customer intent: As a data steward or catalog administrator, I need to onboard Azure data sources at scale before registering and scanning.
---
# Tutorial: Check Data Sources Readiness at Scale (Preview)

> [!IMPORTANT]
> Azure Purview is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

To scan data sources, Azure Purview requires access to data sources. This is done by using **Credentials**. A credential is an authentication information that Azure Purview can use to authenticate to your registered data sources. There are few options to setup the credentials for Azure Purview such as using Managed Identity assigned to the Purview Account, using a Key Vault or a Service Principals.

In this *two-part tutorial series*, we aim to help you to verify and configure required Azure role assignments and network access for various Azure Data Sources across your Azure subscriptions at scale, so you can then register and scan your Azure data sources in Azure Purview. 

Run [Azure Purview data sources readiness checklist](https://github.com/Azure/Purview-Samples/tree/master/Data-Source-Readiness) script after you deploy your Azure Purview account and before registering and scanning your Azure data sources. 

In part 1 of this tutorial series, you will:

> [!div class="checklist"]
>
> * Locate your data sources and prepare a list of data sources subscriptions.
> * Run readiness checklist script to find any missing RBAC and network configurations across your data sources in Azure.
> * Review missing Azure Purview MSI required role assignments and network configurations from the output report. 
> * Share the report with data Azure subscription owners so they can take suggested actions.

## Prerequisites

* Azure Subscriptions where your data sources are located. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
* An [Azure Purview account](create-catalog-portal.md).
* An Azure Key Vault resource in each subscription if any data sources such as Azure SQL Database, Azure Synapse or Azure SQL Manged Instances.
* The [Azure Purview data sources readiness checklist](https://github.com/Azure/Purview-Samples/tree/master/Data-Source-Readiness) script.

> [!NOTE]
> The Azure Purview data sources readiness checklist is only available for **Windows**.
> This readiness checklist script currently is supported for **Azure Purview Managed Identity (MSI)**.

## Prepare data sources' Azure subscriptions list 

Before running the script, create a csv file (e.g. "C:\temp\Subscriptions.csv) with 4 columns:
   
1. Column name: `SubscriptionId`
    This column must contain all your Azure subscription IDs where your data sources reside.
    
    for example each column should have one subscription ID: 12345678-aaaa-bbbb-cccc-1234567890ab

2. Column name: `KeyVaultName`
    Provide existing key vault name resource that is deployed in the same corresponding data source subscription.
    
    example: ContosoDevKeyVault

3. Column name: `SecretNameSQLUserName`
   Provide the name of an existing Azure key vault secret that contains an Azure AD user name that can logon to Azure Synapse, Azure SQL Servers or Azure SQL Managed Instance through Azure AD authentication.
   
   example: ContosoDevSQLAdmin

4. Column name: `SecretNameSQLPassword`
   Provide the name of an existing Azure key vault secret that contains an Azure AD user password that can logon to Azure Synapse, Azure SQL Servers or Azure SQL Managed Instance through Azure AD authentication.
   
   example: ContosoDevSQLPassword

    **Sample csv file:**
    
    :::image type="content" source="./media/tutorial-data-sources-readiness/subscriptions-input.png" alt-text="Subscriptions List" lightbox="./media/tutorial-data-sources-readiness/subscriptions-input.png":::

    > [!NOTE] 
    > You can update the file name and path in the code, if needed.

<br>

## Prepare to run the script and install required PowerShell modules 

Follow these steps to run the script from your Windows machine:

1. [Download Azure Purview data sources readiness checklist](https://github.com/Azure/Purview-Samples/tree/master/Data-Source-Readiness) script to the location of your choice.

2. On your computer, enter **PowerShell** in the search box on the Windows taskbar. In the search list, right-click **Windows PowerShell**, and then select **Run as administrator**.

3. In the PowerShell window, enter the following command, replacing `<path-to-script>` with the folder path of the extracted the script file.

   ```powershell
   dir -Path <path-to-script> | Unblock-File
   ```

4. Enter the following command to install the Azure cmdlets.

   ```powershell
   Install-Module -Name Az -AllowClobber -Scope CurrentUser
   ```
6. If you see the warning prompt, *NuGet provider is required to continue*, enter **Y**, and then press Enter.

7. If you see the warning prompt, *Untrusted repository*, enter **A**, and then press Enter.

5. Repeat the previous steps to install `Az.Synpase` and `AzureAD` modules.

It might take up to a minute for PowerShell to install the required modules.

<br>

## Collect additional data needed to run the script

Before you run the PowerShell script to verify data sources subscriptions readiness, get the values of the following arguments to use in the scripts:

- `AzureDataType`: choose any of the following options as your data source type to run the readiness for the data type across your subscriptions: 
    
    - `BlobStorage`

    - `AzureSQLMI`

    - `AzureSQLDB`
    
    - `ADLSGen2`
    
    - `ADLSGen1`
    
    - `Synapse`
    
    - `All`

- `PurviewAccount`: Your existing Azure Purview Account resource name.

- `PurviewSub`: Subscription ID where Azure Purview Account is deployed.

## Verify your permissions

Make sure your user has the following roles and permissions:

Role | Scope |
|-------|--------|
| Global Reader | Azure AD Tenant |
| Reader | Azure Subscriptions where your Azure Data Sources reside |
| Reader | Subscription where Azure Purview Account is created |
| SQL Admin (Azure AD Authentication) | Azure Synapse Dedicated Pools, Azure SQL Servers, Azure SQL Managed Instances |
| Access to your Azure Key Vault | Access to get/list Key Vault's secret or Azure Key Vault Secret User |  

<br>

## Run the client-side readiness script

Run the script using the following steps:

1. Use the following command to navigate to the script's directory. Replace `path-to-script` with the folder path of the extracted file.

   ```powershell
   cd <path-to-script>
   ```

2. The following command sets the execution policy for the local computer. Enter **A** for *Yes to All* when you are prompted to change the execution policy.

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy Unrestricted
   ```

3. Execute the script using the following parameters. Replace the `DataType`, `PurviewName` and `SubscriptionID` placeholders.

   ```powershell
   .\purview-data-sources-readiness-checklist.ps1 -AzureDataType <DataType> -PurviewAccount <PurviewName> -PurviewSub <SubscriptionID>
   ```

   When you run the command, a pop-up window may appear twice for you to sign in to Azure and Azure AD using your Azure Active Directory credentials.


It can take several minutes until the report is fully generated depending on number Azure subscriptions and resources in the environment. 

After the process has finished, review the output report which demonstrates the detected missing configurations in your Azure subscriptions or resources. The results may appear as _Passed_, _Not Passed_ or _Awareness_. You can share the results with the corresponding subscriptions admins in your organization so they can configure the required settings.

<br>

## Additional Information

### What data sources are supported in the script?

Currently, the following data sources are supported in the script:

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
