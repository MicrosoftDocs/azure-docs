---
title: Resource prerequisites for Azure HDInsight on AKS
description: Prerequisite steps to complete for Azure resources before working with HDInsight on AKS.
ms.topic: how-to
ms.service: hdinsight-aks
ms.date: 08/29/2023
---

# Resource prerequisites

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This article details the resources required for getting started with HDInsight on AKS. It covers the necessary and the optional resources and how to create them.

## Necessary resources  
The following table depicts the necessary resources that are required for cluster creation based on the cluster types. 

|Workload|Managed Service Identity (MSI)|Storage|SQL Server - SQL Database|Key Vault|
| --- |---|---|---|---|
|Trino| ✅ | | | |
|Flink| ✅ | ✅ | | |
|Spark| ✅  | ✅ | | |
|Trino, Flink, or Spark with Hive Metastore (HMS)| ✅ | ✅ | ✅ | ✅ |

> [!NOTE]
> MSI is used as a security standard for authentication and authorization across resources, except SQL Database. The role assignment occurs prior to deployment to authorize MSI to storage and the secrets are stored in Key vault for SQL Database. Storage support is with ADLS Gen2, and is used as data store for the compute engines, and SQL Database is used for table management on Hive Metastore. 

## Optional resources

* Virtual Network (VNet) and Subnet: [Create virtual network](/azure/virtual-network/quick-create-portal)
* Log Analytics Workspace: [Create Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace?tabs=azure-portal) 

> [!NOTE] 
>
> * HDInsight on AKS allows you to bring your own VNet and Subnet, enabling you to customize your [network requirements](./secure-traffic-by-firewall.md) to suit the needs of your enterprise.  
> * Log Analytics workspace is optional and needs to be created ahead in case you would like to use Azure Monitor capabilities like [Azure Log Analytics](./how-to-azure-monitor-integration.md). 

You can create the necessary resources in two ways: 

* [Ready-to-use ARM templates](#using-arm-templates)
* [Using Azure portal](#using-azure-portal)

### Using ARM templates

The following ARM templates allow you to create the specified necessary resources, in one click using a resource prefix and more details as required. 

For example, if you provide resource prefix as “demo” then, following resources are created in your resource group depending on the template you select - 
* MSI is created with name as `demoMSI`. 
* Storage is created with name as `demostore` along with a container as `democontainer`. 
* Key vault is created with name as `demoKeyVault` along with the secret provided as parameter in the template. 
* Azure SQL database is created with name as `demoSqlDB` along with SQL server with name as `demoSqlServer`. 
 
|Workload|Prerequisites|
|---|---|
|Trino|**Create the resources mentioned as follows:** <br> 1. Managed Service Identity (MSI): user-assigned managed identity. <br><br> [![Deploy Trino to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fhdinsight-aks%2Fmain%2FARM%2520templates%2FprerequisitesTrino.json)|
|Flink |**Create the resources mentioned as follows:** <br> 1. Managed Service Identity (MSI): user-assigned managed identity. <br> 2. ADLS Gen2 storage account and a container. <br><br> **Role assignments:** <br> 1. Assigns “Storage Blob Data Owner” role to user-assigned MSI on storage account. <br><br> [![Deploy Apache Flink to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fhdinsight-aks%2Fmain%2FARM%2520templates%2FprerequisitesFlink.json)|
|Spark| **Create the resources mentioned as follows:** <br> 1. Managed Service Identity (MSI): user-assigned managed identity. <br> 2. ADLS Gen2 storage account and a container. <br><br> **Role assignments:** <br> 1. Assigns “Storage Blob Data Owner” role to user-assigned MSI on storage account. <br><br> [![Deploy Spark to Azure](https://aka.ms/deploytoazurebutton)]( https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fhdinsight-aks%2Fmain%2FARM%2520templates%2FprerequisitesSpark.json)|
|Trino, Flink, or Spark with Hive Metastore (HMS)|**Create the resources mentioned as follows:** <br> 1. Managed Service Identity (MSI): user-assigned managed identity. <br> 2. ADLS Gen2 storage account and a container. <br> 3. Azure Key Vault and a secret to store SQL Server admin credentials. <br><br> **Role assignments:** <br> 1. Assigns “Storage Blob Data Owner” role to user-assigned MSI on storage account. <br> 2. Assigns “Key Vault Secrets User” role to user-assigned MSI on Key Vault. <br><br> [![Deploy Trino HMS to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fhdinsight-aks%2Fmain%2FARM%2520templates%2Fprerequisites_WithHMS.json)|

> [!NOTE]
> Using these ARM templates require a user to have permission to create new resources and assign roles to the resources in the subscription.

### Using Azure portal 

#### [Create user-assigned  managed identity (MSI)](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity)

   A managed identity is an identity registered in Microsoft Entra ID [(Azure Active Directory)](https://www.microsoft.com/security/business/identity-access/azure-active-directory) whose credentials managed by Azure. With managed identities, you need not register service principals in Azure AD to maintain credentials such as certificates. 

   HDInsight on AKS relies on user-assigned MSI for communication among different components.

#### [Create storage account – ADLS Gen 2](/azure/storage/blobs/create-data-lake-storage-account)

   The storage account is used as the default location for cluster logs and other outputs. 
   Enable hierarchical namespace during the storage account creation to use as ADLS Gen2 storage.

   1. [Assign a role](/azure/role-based-access-control/role-assignments-portal#step-2-open-the-add-role-assignment-page): Assign “Storage Blob Data Owner” role to the user-assigned MSI created to this storage account.
     
   1. [Create a container](/azure/storage/blobs/blob-containers-portal#create-a-container): After creating the storage account, create a container in the storage account.  
     
   > [!NOTE]
   > Option to create a container during cluster creation is also available.

#### [Create Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart)
  
   Create an Azure SQL Database to be used as an external metastore during cluster creation or you can use an existing SQL Database. However, ensure the following properties are set.
   
   **Necessary properties to be enabled for SQL Server and SQL Database**-
  
   |Resource Type| Property| Description| 
   |-|-|-|
   |SQL Server |Authentication method |While creating a SQL Server, use "Authentication method" as <br> :::image type="content" source="./media/prerequisites-resources/authentication-method.png" alt-text="Screenshot showing how to select authentication method." border="true" lightbox="media/prerequisites-resources/authentication-method.png":::|
   |SQL Database  |Allow Azure services and resources to access this server |Enable this property under Networking blade in your SQL database in the Azure portal.|

   > [!NOTE]
   > * Currently, we support only Azure SQL Database as inbuilt metastore.
   > * Due to Hive limitation, "-" (hyphen) character in metastore database name is not supported. 
   > * Azure SQL Database should be in the same region as your cluster.
   > * Option to create a SQL Database during cluster creation is also available. However, you need to refresh the cluster creation page to get the newly created database appear in the dropdown list. 

#### [Create Azure Key Vault](/azure/key-vault/general/quick-create-portal#create-a-vault)

   Key Vault allows you to store the SQL Server admin password set during SQL Database creation.
   HDInsight on AKS platform doesn’t deal with the credential directly. Hence, it's necessary to store your important credentials in the Key Vault.

   1. [Assign a role](/azure/role-based-access-control/role-assignments-portal#step-2-open-the-add-role-assignment-page): Assign “Key Vault Secrets User” role to the user-assigned MSI created as part of necessary resources to this Key Vault.
   
   1. [Create a secret](/azure/key-vault/secrets/quick-create-portal#add-a-secret-to-key-vault): This step allows you to keep your SQL Server admin password as a secret in Azure Key Vault. Add your password in the “Value” field while creating a secret.

   > [!NOTE]
   > * Make sure to note the secret name, as this is required during cluster creation.
   > * You need to have a “Key Vault Administrator” role assigned to your identity or account to add a secret in the Key Vault using Azure portal. Navigate to the Key Vault and follow the steps on [how to assign the role](/azure/role-based-access-control/role-assignments-portal#step-2-open-the-add-role-assignment-page).
