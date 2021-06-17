---
title: 'Configure access to data sources for Azure Purview MSI at scale (preview)'
description: In this tutorial, you'll configure Azure MSI settings on your Azure data source subscriptions. 
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 05/28/2021
# Customer intent: As a data steward or catalog administrator, I need to onboard Azure data sources at scale before I register and scan them.
---
# Tutorial: Configure access to data sources for Azure Purview MSI at scale (preview)

> [!IMPORTANT]
> Azure Purview is currently in preview. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta or preview or are otherwise not yet released for general availability.

To scan data sources, Azure Purview requires access to them. This tutorial is intended for Azure subscription owners and Azure Purview Data Source Administrators. It will help you identify required access and set up required authentication and network rules for Azure Purview across Azure data sources.

In part 2 of this tutorial series, you'll:

> [!div class="checklist"]
>
> * Locate your data sources and prepare a list of data source subscriptions.
> * Run a script to configure any missing RBAC or required network configurations across your data sources in Azure.
> * Review the output report.

## Prerequisites

* Azure subscriptions where your data sources are located. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
* An [Azure Purview account](create-catalog-portal.md).
* An Azure Key Vault resource in each subscription that has data sources like Azure SQL Database, Azure Synapse Analytics, or Azure SQL Managed Instance.
* The [Azure Purview MSI Configuration](https://github.com/Azure/Purview-Samples/tree/master/Data-Source-MSI-Configuration) script.

> [!NOTE]
> The Azure Purview MSI Configuration script is available only for Windows.
> This script currently is supported for Azure Purview Managed Identity (MSI).

> [!IMPORTANT]
> We strongly recommend that you test and verify all the changes the script performs in your Azure environment before you deploy it into your production environment.

## Prepare Azure subscriptions list for data sources 

Before you run the script, create a .csv file (for example, "C:\temp\Subscriptions.csv) with four columns:
   
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

1. [Download Azure Purview MSI Configuration](https://github.com/Azure/Purview-Samples/tree/master/Data-Source-MSI-Configuration) script to the location of your choice.

2. On your computer, enter **PowerShell** in the search box on the Windows taskbar. In the search list, right-click **Windows PowerShell** and then select **Run as administrator**.

3. In the PowerShell window, enter the following command. (Replace `<path-to-script>` with the folder path of the extracted script file.)

   ```powershell
   dir -Path <path-to-script> | Unblock-File
   ```

4. Enter the following command to install the Azure cmdlets:

   ```powershell
   Install-Module -Name Az -AllowClobber -Scope CurrentUser
   ```
5. If you see the prompt *NuGet provider is required to continue*, enter **Y**, and then select **Enter**.

6. If you see the prompt *Untrusted repository*, enter **A**, and then select **Enter**.

7. Repeat the previous steps to install the `Az.Synapse` and `AzureAD` modules.

It might take up to a minute for PowerShell to install the required modules.


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

The following permissions (minimum) are needed run the script in your Azure environment:

Role | Scope | Why is needed? |
|-------|--------|--------|
| Global Reader | Azure AD Tenant | To read Azure SQL Admin user group membership and Azure Purview MSI |
| Global Administrator | Azure AD Tenant | To assign 'Directory Reader' role to Azure SQL Managed Instances |
| Contributor | Subscription or Resource Group where Azure Purview Account is created | To read Azure Purview Account resource. Create Key Vault resource and a secret. |
| Owner or User Access Administrator | Management Group or Subscription where your Azure Data Sources reside | To assign RBAC |
| Contributor | Management Group or Subscription where your Azure Data Sources reside | To setup Network configuration |
| SQL Admin (Azure AD Authentication) | Azure SQL Servers or Azure SQL Managed Instances | To assign db_datareader role to Azure Purview |
| Access to your Azure Key Vault | Access to get/list Key Vault's secret for Azure SQL DB, SQL MI or Synapse authentication |  

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
   .\purview-msi-configuration.ps1 -AzureDataType <DataType> -PurviewAccount <PurviewName> -PurviewSub <SubscriptionID>
   ```

   When you run the command, a pop-up window may appear twice for you to sign in to Azure and Azure AD using your Azure Active Directory credentials.

It can take several minutes until the report is fully generated depending on number Azure subscriptions and resources in the environment. 

you maybe prompted to sign in to your Azure SQL Servers if the provided credentials in the Key Vault do not match. You can provide the credentials or hit enter to skip the specific server. 

After the process has finished, review the output report to review the changes. 

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

### What configurations are included in the script?

This script can help you to automatically perform the following tasks:

#### Azure Blob Storage (BlobStorage)

- RBAC: Verify and assign Azure RBAC 'Reader' role to Azure Purview MSI on selected scope.
- RBAC: Verify and assign Azure RBAC 'Storage Blob Data Reader role' to Azure Purview MSI in each of the subscriptions below selected scope.
- Networking: Verify and report if Private Endpoint is created for storage and enabled for Blob Storage.
- Service Endpoint: If Private Endpoint is disabled check if Service Endpoint is ON, AND enable 'Allow trusted Microsoft services to access this storage account'.

#### Azure Data Lake Storage Gen 2 (ADLSGen2)

- RBAC: Verify and assign Azure RBAC 'Reader' role to Azure Purview MSI on selected scope.
- RBAC: Verify and assign Azure RBAC 'Storage Blob Data Reader role' to Azure Purview MSI in each of the subscriptions below selected scope.
- Networking: Verify and report if Private Endpoint is created for storage and enabled for Blob Storage.
- Service Endpoint: If Private Endpoint is disabled check if Service Endpoint is ON, AND enable 'Allow trusted Microsoft services to access this storage account'.

#### Azure Data Lake Storage Gen 1 (ADLSGen1)

- Networking: Verify if Service Endpoint is ON, AND enabled 'Allow all Azure services to access this Data Lake Storage Gen1 account' on Data Lake Storage.
- Permissions: Verify and assign Read/Execute access to Azure Purview MSI .

#### Azure SQL Database (AzureSQLDB)

- SQL Servers:
  - Network: Verify and report if Public or Private Endpoint is enabled.
  - Firewall: If Private Endpoint is off, verify firewall rules and enable 'Allow Azure services and resources to access this server'.
  - Azure AD Admin: Enable Azure AD Authentication for Azure SQL Server.

- SQL Databases:
  - SQL Role: Assign Azure Purview MSI with db_datareader role.

#### Azure SQL Managed Instance (AzureSQLMI)

- SQL Managed Instance Servers:
  - Network: Verify if Public or Private Endpoint is enabled. Reports if Public endpoint is disabled.
  - ProxyOverride: Verify if Azure SQL Managed Instance is configured as Proxy or Redirect.
  - Networking: Verify and update NSG rules to allow AzureCloud with inbound access to SQL Server over required ports; Redirect: 1433 and 11000-11999 or Proxy: 3342.
  - Azure AD Admin: Enable Azure AD Authentication for Azure SQL Managed Instance.
  
- SQL Databases:
  - SQL Role: Assign Azure Purview MSI with db_datareader role.

#### Azure Synapse (Synapse) dedicated pools:

- RBAC: Verify and assign Azure RBAC 'Reader' role to Azure Purview MSI on selected scope.
- RBAC: Verify and assign Azure RBAC 'Storage Blob Data Reader role' to Azure Purview MSI in each of the subscriptions below selected scope.
- SQL Servers (Dedicated Pools):
  - Network: Verify and report if Public or Private Endpoint is enabled.
  - Firewall: If Private Endpoint is off, verify firewall rules and enable 'Allow Azure services and resources to access this server'.
  - Azure AD Admin: Enable Azure AD Authentication for Azure SQL Server.

- SQL Databases:
  - SQL Role: Assign Azure Purview MSI with db_datareader role.

## Next steps

In this tutorial, you learned how to:
> [!div class="checklist"]
>
> * Register and scan Azure data sources in Azure Purview .

Advance to the next tutorial to learn how to navigate the home page and search for an asset.

> [!div class="nextstepaction"]
> [Register and scan multiple sources in Azure Purview](register-scan-azure-multiple-sources.md)
