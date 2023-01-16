---
title: 'Configure access to data sources for Microsoft Purview MSI at scale'
description: In this tutorial, you'll configure Azure MSI settings on your Azure data source subscriptions. 
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-map
ms.topic: tutorial
ms.date: 12/12/2022
# Customer intent: As a data steward or catalog administrator, I need to onboard Azure data sources at scale before I register and scan them.
---
# Tutorial: Configure access to data sources for Microsoft Purview MSI at scale

To scan data sources, Microsoft Purview requires access to them. This tutorial is intended for Azure subscription owners and Microsoft Purview Data Source Administrators. It will help you identify required access and set up required authentication and network rules for Microsoft Purview across Azure data sources.

In part 2 of this tutorial series, you'll:

> [!div class="checklist"]
>
> * Locate your data sources and prepare a list of data source subscriptions.
> * Run a script to configure any missing role-based access control (RBAC) or required network configurations across your data sources in Azure.
> * Review the output report.

## Prerequisites

* Azure subscriptions where your data sources are located. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
* An [Microsoft Purview account](create-catalog-portal.md).
* An Azure Key Vault resource in each subscription that has data sources like Azure SQL Database, Azure Synapse Analytics, or Azure SQL Managed Instance.
* The [Microsoft Purview MSI Configuration](https://github.com/Azure/Purview-Samples/tree/master/Data-Source-MSI-Configuration) script.

> [!NOTE]
> The Microsoft Purview MSI Configuration script is available only for Windows.
> This script is currently supported for Microsoft Purview Managed Identity (MSI).

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

1. [Download Microsoft Purview MSI Configuration](https://github.com/Azure/Purview-Samples/tree/master/Data-Source-MSI-Configuration) script to the location of your choice.

2. On your computer, enter **PowerShell** in the search box on the Windows taskbar. In the search list, select and hold (or right-click) **Windows PowerShell** and then select **Run as administrator**.

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


## Collect other data needed to run the script

Before you run the PowerShell script to verify the readiness of data source subscriptions, obtain the values of the following arguments to use in the scripts:

- `AzureDataType`: Choose any of the following options as your data-source type to check the readiness for the data type across your subscriptions: 
    
    - `BlobStorage`

    - `AzureSQLMI`

    - `AzureSQLDB`
    
    - `ADLSGen2`
    
    - `ADLSGen1`
    
    - `Synapse`
    
    - `All`

- `PurviewAccount`: Your existing Microsoft Purview account resource name.

- `PurviewSub`: Subscription ID where the Microsoft Purview account is deployed.

## Verify your permissions

Make sure your user has the following roles and permissions:

At a minimum, you need the following permissions to run the script in your Azure environment:

Role | Scope | Why is it needed? |
|-------|--------|--------|
| **Global Reader** | Azure AD tenant | To read Azure SQL Admin user group membership and Microsoft Purview MSI |
| **Global Administrator** | Azure AD tenant | To assign the **Directory Reader** role to Azure SQL managed instances |
| **Contributor** | Subscription or resource group where your Microsoft Purview account is created | To read the Microsoft Purview account resource and create a Key Vault resource and secret |
| **Owner or User Access Administrator** | Management group or subscription where your Azure data sources are located | To assign RBAC |
| **Contributor** | Management group or subscription where your Azure data sources are located | To set up network configuration |
| **SQL Admin** (Azure AD Authentication) | Azure SQL Server instances or Azure SQL managed instances | To assign the **db_datareader** role to Microsoft Purview |
| Access to your Azure key vault | Access to get/list Key Vault secret for Azure SQL Database, Azure SQL Managed Instance, or Azure Synapse authentication |  


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

3. Run the script with the following parameters. Replace the `DataType`, `PurviewName`, and `SubscriptionID` placeholders.

   ```powershell
   .\purview-msi-configuration.ps1 -AzureDataType <DataType> -PurviewAccount <PurviewName> -PurviewSub <SubscriptionID>
   ```

   When you run the command, a pop-up window might appear twice prompting you to sign in to Azure and Azure AD by using your Azure Active Directory credentials.

It can take several minutes to create the report, depending on the number of Azure subscriptions and resources in the environment. 

You might be prompted to sign in to your Azure SQL Server instances if the credentials in the key vault don't match. You can provide the credentials or select **Enter** to skip the specific server. 

After the process completes, view the output report to review the changes. 


## More information

### What data sources are supported by the script?

Currently, the following data sources are supported by the script:

- Azure Blob Storage (BlobStorage)
- Azure Data Lake Storage Gen2 (ADLSGen2)
- Azure Data Lake Storage Gen1 (ADLSGen1)
- Azure SQL Database (AzureSQLDB)
- Azure SQL Managed Instance (AzureSQLMI)
- Azure Synapse (Synapse) dedicated pool

You can choose all or any of these data sources as input parameter when you run the script.

### What configurations are included in the script?

This script can help you automatically complete the following tasks:

#### Azure Blob Storage (BlobStorage)

- RBAC. Assign the Azure RBAC **Reader** role to Microsoft Purview MSI on the selected scope. Verify the assignment. 
- RBAC. Assign the Azure RBAC **Storage Blob Data Reader** role to Microsoft Purview MSI in each of the subscriptions below the selected scope. Verify the assignments.
- Networking. Report whether private endpoint is created for storage and enabled for Blob Storage.
- Service endpoint. If private endpoint is off, check whether service endpoint is on, and enable **Allow trusted Microsoft services to access this storage account**.

#### Azure Data Lake Storage Gen2 (ADLSGen2)

- RBAC. Assign the Azure RBAC **Reader** role to Microsoft Purview MSI on the selected scope. Verify the assignment. 
- RBAC. Assign the Azure RBAC **Storage Blob Data Reader** role to Microsoft Purview MSI in each of the subscriptions below the selected scope. Verify the assignments.
- Networking. Report whether private endpoint is created for storage and enabled for Blob Storage.
- Service endpoint. If private endpoint is off, check whether service endpoint is on, and enable **Allow trusted Microsoft services to access this storage account**.

#### Azure Data Lake Storage Gen1 (ADLSGen1)

- Networking. Verify that service endpoint is on, and enable **Allow all Azure services to access this Data Lake Storage Gen1 account** on Data Lake Storage.
- Permissions. Assign Read/Execute access to Microsoft Purview MSI. Verify the access. 

#### Azure SQL Database (AzureSQLDB)

- SQL Server instances:
  - Network. Report whether public endpoint or private endpoint is enabled.
  - Firewall. If private endpoint is off, verify firewall rules and enable **Allow Azure services and resources to access this server**.
  - Azure AD administration. Enable Azure AD authentication for Azure SQL Database.

- SQL databases:
  - SQL role. Assign the **db_datareader** role to Microsoft Purview MSI.

#### Azure SQL Managed Instance (AzureSQLMI)

- SQL Managed Instance servers:
  - Network. Verify that public endpoint or private endpoint is on. Report if public endpoint is off.
  - ProxyOverride. Verify that Azure SQL Managed Instance is configured as Proxy or Redirect.
  - Networking. Update NSG rules to allow AzureCloud inbound access to SQL Server instances over required ports:  
    - Redirect: 1433 and 11000-11999
    
    or 
    - Proxy: 3342
    
    Verify this access. 
  - Azure AD administration. Enable Azure AD authentication for Azure SQL Managed Instance.
  
- SQL databases:
  - SQL role. Assign the **db_datareader** role to Microsoft Purview MSI.
  
#### Azure Synapse (Synapse) dedicated pool

- RBAC. Assign the Azure RBAC **Reader** role to Microsoft Purview MSI on the selected scope. Verify the assignment. 
- RBAC. Assign the Azure RBAC **Storage Blob Data Reader** role to Microsoft Purview MSI in each of the subscriptions below the selected scope. Verify the assignments.
- SQL Server instances (dedicated pools):
  - Network. Report whether public endpoint or private endpoint is on.
  - Firewall. If private endpoint is off, verify firewall rules and enable **Allow Azure services and resources to access this server**.
  - Azure AD administration. Enable Azure AD authentication for Azure SQL Database.

- SQL databases:
  - SQL role. Assign the **db_datareader** role to Microsoft Purview MSI.

## Next steps

In this tutorial, you learned how to:
> [!div class="checklist"]
>
> * Identify required access and set up required authentication and network rules for Microsoft Purview across Azure data sources.

Go to the next tutorial to learn how to [Register and scan multiple sources in Microsoft Purview](register-scan-azure-multiple-sources.md).
