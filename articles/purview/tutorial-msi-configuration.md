---
title: 'Tutorial: Configure access to data sources for Azure Purview MSI at scale (preview)'
description: In this tutorial, you will run a subset of tools configure Azure MSI settings on  your Azure data sources subscriptions. 
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 05/28/2021
# Customer intent: As a data steward or catalog administrator, I need to onboard Azure data sources at scale before registering and scanning.
---
# Tutorial: Configure access to data sources for Azure Purview MSI at scale (Preview)

> [!IMPORTANT]
> Azure Purview is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

To scan data sources, Azure Purview requires access to data sources. This tutorial is aimed to assist Azure Subscription owners and Azure Purview Data Source Administrators to identify required access and setup required authentication and network rules for Azure Purview across Azure data sources.

In part 2 of this tutorial series, you will:

> [!div class="checklist"]
>
> * Locate your data sources and prepare a list of data sources subscriptions.
> * Run the script to configure any missing RBAC and required network configurations across your data sources in Azure.
> * Review the output report.

## Prerequisites

* Azure Subscriptions where your data sources are located. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
* An [Azure Purview account](create-catalog-portal.md).
* An Azure Key Vault resource in each subscription if any data sources such as Azure SQL Database, Azure Synapse or Azure SQL Manged Instances.
* The [Azure Purview MSI Configuration](https://github.com/Azure/Purview-Samples/tree/master/Data-Source-MSI-Configuration) script.

> [!NOTE]
> The Azure Purview MSI Configuration script is only available for **Windows**.
> This script currently is supported for **Azure Purview Managed Identity (MSI)**.

> [!IMPORTANT]
> It is highly recommended to test and verify all the changes the script performs in your Azure environment before deploying it into your production environment.

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

1. [Download Azure Purview MSI Configuration](https://github.com/Azure/Purview-Samples/tree/master/Data-Source-MSI-Configuration) script to the location of your choice.

2. On your computer, enter **PowerShell** in the search box on the Windows taskbar. In the search list, right-click **Windows PowerShell**, and then select **Run as administrator**.

3. In the PowerShell window, enter the following command, replacing `<path-to-script>` with the folder path of the extracted the script file.

   ```powershell
   dir -Path <path-to-script> | Unblock-File
   ```

4. Enter the following command to install the Azure cmdlets.

   ```powershell
   Install-Module -Name Az -AllowClobber -Scope CurrentUser
   ```
5. If you see the warning prompt, *NuGet provider is required to continue*, enter **Y**, and then press Enter.

6. If you see the warning prompt, *Untrusted repository*, enter **A**, and then press Enter.

7. Repeat the previous steps to install `Az.Synpase` and `AzureAD` modules.

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
