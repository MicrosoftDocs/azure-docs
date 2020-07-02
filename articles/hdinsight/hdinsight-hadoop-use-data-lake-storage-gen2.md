---
title: Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters
description: Learn how to use Azure Data Lake Storage Gen2 with Azure HDInsight clusters.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive,seoapr2020
ms.date: 04/24/2020
---

# Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters

Azure Data Lake Storage Gen2 is a cloud storage service dedicated to big data analytics, built on Azure Blob storage. Data Lake Storage Gen2 combines the capabilities of Azure Blob storage and Azure Data Lake Storage Gen1. The resulting service offers features from Azure Data Lake Storage Gen1. These features include: file system semantics, directory-level and file-level security, and adaptability. Along with the low-cost, tiered storage, high availability, and disaster-recovery capabilities from Azure Blob storage.

## Data Lake Storage Gen2 availability

Data Lake Storage Gen2 is available as a storage option for almost all Azure HDInsight cluster types as both a default and an additional storage account. HBase, however, can have only one Data Lake Storage Gen2 account.

For a full comparison of cluster creation options using Data Lake Storage Gen2, see [Compare storage options for use with Azure HDInsight clusters](hdinsight-hadoop-compare-storage-options.md).

> [!Note]  
> After you select Data Lake Storage Gen2 as your **primary storage type**, you cannot select a Data Lake Storage Gen1 account as additional storage.

## Create a cluster with Data Lake Storage Gen2 through the Azure portal

To create an HDInsight cluster that uses Data Lake Storage Gen2 for storage, follow these steps to configure a Data Lake Storage Gen2 account.

### Create a user-assigned managed identity

Create a user-assigned managed identity, if you don’t already have one.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the upper-left click **Create a resource**.
1. In the search box, type **user assigned** and click **User Assigned Managed Identity**.
1. Click **Create**.
1. Enter a name for your managed identity, select the correct subscription, resource group, and location.
1. Click **Create**.

For more information on how managed identities work in Azure HDInsight, see [Managed identities in Azure HDInsight](hdinsight-managed-identities.md).

![Create a user-assigned managed identity](./media/hdinsight-hadoop-use-data-lake-storage-gen2/create-user-assigned-managed-identity-portal.png)

### Create a Data Lake Storage Gen2 account

Create an Azure Data Lake Storage Gen2 storage account.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the upper-left click **Create a resource**.
1. In the search box, type **storage** and click **Storage account**.
1. Click **Create**.
1. On the **Create storage account** screen:
    1. Select the correct subscription and resource group.
    1. Enter a name for your Data Lake Storage Gen2 account.
    1. Click on the **Advanced** tab.
    1. Click **Enabled** next to **Hierarchical namespace** under **Data Lake Storage Gen2**.
    1. Click **Review + create**.
    1. Click **Create**

For more information on other options during storage account creation, see [Quickstart: Create an Azure Data Lake Storage Gen2 storage account](../storage/blobs/data-lake-storage-quickstart-create-account.md).

![Screenshot showing storage account creation in the Azure portal](./media/hdinsight-hadoop-use-data-lake-storage-gen2/azure-data-lake-storage-account-create-advanced.png)

### Set up permissions for the managed identity on the Data Lake Storage Gen2 account

Assign the managed identity to the **Storage Blob Data Owner** role on the storage account.

1. In the [Azure portal](https://portal.azure.com), go to your storage account.
1. Select your storage account, then select **Access control (IAM)** to display the access control settings for the account. Select the **Role assignments** tab to see the list of role assignments.

    ![Screenshot showing storage access control settings](./media/hdinsight-hadoop-use-data-lake-storage-gen2/portal-access-control.png)

1. Select the **+ Add role assignment** button to add a new role.
1. In the **Add role assignment** window, select the **Storage Blob Data Owner** role. Then, select the subscription that has the managed identity and storage account. Next, search to locate the user-assigned managed identity that you created previously. Finally, select the managed identity, and it will be listed under **Selected members**.

    ![Screenshot showing how to assign an RBAC role](./media/hdinsight-hadoop-use-data-lake-storage-gen2/add-rbac-role3-window.png)

1. Select **Save**. The user-assigned identity that you selected is now listed under the selected role.
1. After this initial setup is complete, you can create a cluster through the portal. The cluster must be in the same Azure region as the storage account. In the **Storage** tab of the cluster creation menu, select the following options:

    * For **Primary storage type**, select **Azure Data Lake Storage Gen2**.
    * Under **Primary Storage account**, search for and select the newly created Data Lake Storage Gen2 storage account.

    * Under **Identity**, select the newly created user-assigned managed identity.

        ![Storage settings for using Data Lake Storage Gen2 with Azure HDInsight](./media/hdinsight-hadoop-use-data-lake-storage-gen2/azure-portal-cluster-storage-gentwo.png)

    > [!NOTE]
    > * To add a secondary Data Lake Storage Gen2 account, at the storage account level, simply assign the managed identity created earlier to the new Data Lake Storage Gen2 storage account that you want to add. Please be advised that adding a secondary Data Lake Storage Gen2 account via the "Additional storage accounts" blade on HDInsight isn't supported.
    > * You can enable RA-GRS or RA-ZRS on the Azure storage account that HDInsight uses. However, creating a cluster against the RA-GRS or RA-ZRS secondary endpoint isn't supported.


## Create a cluster with Data Lake Storage Gen2 through the Azure CLI

You can [download a sample template file](https://github.com/Azure-Samples/hdinsight-data-lake-storage-gen2-templates/blob/master/hdinsight-adls-gen2-template.json) and [download a sample parameters file](https://github.com/Azure-Samples/hdinsight-data-lake-storage-gen2-templates/blob/master/parameters.json). Before using the template and the Azure CLI code snippet below, replace the following placeholders with their correct values:

| Placeholder | Description |
|---|---|
| `<SUBSCRIPTION_ID>` | The ID of your Azure subscription |
| `<RESOURCEGROUPNAME>` | The resource group where you want the new cluster and storage account created. |
| `<MANAGEDIDENTITYNAME>` | The name of the managed identity that will be given permissions on your Azure Data Lake Storage Gen2 account. |
| `<STORAGEACCOUNTNAME>` | The new Azure Data Lake Storage Gen2 account that will be created. |
| `<CLUSTERNAME>` | The name of your HDInsight cluster. |
| `<PASSWORD>` | Your chosen password for signing in to the cluster using SSH and the Ambari dashboard. |

The code snippet below does the following initial steps:

1. Logs in to your Azure account.
1. Sets the active subscription where the create operations will be done.
1. Creates a new resource group for the new deployment activities.
1. Creates a user-assigned managed identity.
1. Adds an extension to the Azure CLI to use features for Data Lake Storage Gen2.
1. Creates a new Data Lake Storage Gen2 account by using the `--hierarchical-namespace true` flag.

```azurecli
az login
az account set --subscription <SUBSCRIPTION_ID>

# Create resource group
az group create --name <RESOURCEGROUPNAME> --location eastus

# Create managed identity
az identity create -g <RESOURCEGROUPNAME> -n <MANAGEDIDENTITYNAME>

az extension add --name storage-preview

az storage account create --name <STORAGEACCOUNTNAME> \
    --resource-group <RESOURCEGROUPNAME> \
    --location eastus --sku Standard_LRS \
    --kind StorageV2 --hierarchical-namespace true
```

Next, sign in to the portal. Add the new user-assigned managed identity to the **Storage Blob Data Contributor** role on the storage account. This step is described in step 3 under [Using the Azure portal](hdinsight-hadoop-use-data-lake-storage-gen2.md).

After you've assigned the role for the user-assigned managed identity, deploy the template by using the following code snippet.

```azurecli
az group deployment create --name HDInsightADLSGen2Deployment \
    --resource-group <RESOURCEGROUPNAME> \
    --template-file hdinsight-adls-gen2-template.json \
    --parameters parameters.json
```

## Create a cluster with Data Lake Storage Gen2 through Azure PowerShell

Using PowerShell to create an HDInsight cluster with Azure Data Lake Storage Gen2 isn't currently supported.

## Access control for Data Lake Storage Gen2 in HDInsight

### What kinds of permissions does Data Lake Storage Gen2 support?

Data Lake Storage Gen2 uses an access control model that supports both role-based access control (RBAC) and POSIX-like access control lists (ACLs). Data Lake Storage Gen1 supports access control lists only for controlling access to data.

RBAC uses role assignments to effectively apply sets of permissions to users, groups, and service principals for Azure resources. Typically, those Azure resources are constrained to top-level resources (for example, Azure Storage accounts). For Azure Storage, and also Data Lake Storage Gen2, this mechanism has been extended to the file system resource.

 For more information about file permissions with RBAC, see [Azure role-based access control (RBAC)](../storage/blobs/data-lake-storage-access-control.md#azure-role-based-access-control-rbac).

For more information about file permissions with ACLs, see [Access control lists on files and directories](../storage/blobs/data-lake-storage-access-control.md#access-control-lists-on-files-and-directories).

### How do I control access to my data in Data Lake Storage Gen2?

Your HDInsight cluster's ability to access files in Data Lake Storage Gen2 is controlled through managed identities. A managed identity is an identity registered in Azure Active Directory (Azure AD) whose credentials are managed by Azure. With managed identities, you don't need to register service principals in Azure AD. Or maintain credentials such as certificates.

Azure services have two types of managed identities: system-assigned and user-assigned. HDInsight uses user-assigned managed identities to access Data Lake Storage Gen2. A `user-assigned managed identity` is created as a standalone Azure resource. Through a create process, Azure creates an identity in the Azure AD tenant that's trusted by the subscription in use. After the identity is created, the identity can be assigned to one or more Azure service instances.

The lifecycle of a user-assigned identity is managed separately from the lifecycle of the Azure service instances to which it's assigned. For more information about managed identities, see [What are managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md).

### How do I set permissions for Azure AD users to query data in Data Lake Storage Gen2 by using Hive or other services?

To set permissions for users to query data, use Azure AD security groups as the assigned principal in ACLs. Don't directly assign file-access permissions to individual users or service principals. With Azure AD security groups to control the flow of permissions, you can add and remove users or service principals without reapplying ACLs to an entire directory structure. You only have to add or remove the users from the appropriate Azure AD security group. ACLs aren't inherited, so reapplying ACLs requires updating the ACL on every file and subdirectory.

## Access files from the cluster

There are several ways you can access the files in Data Lake Storage Gen2 from an HDInsight cluster.

* **Using the fully qualified name**. With this approach, you provide the full path to the file that you want to access.

    ```
    abfs://<containername>@<accountname>.dfs.core.windows.net/<file.path>/
    ```

* **Using the shortened path format**. With this approach, you replace the path up to the cluster root with:

    ```
    abfs:///<file.path>/
    ```

* **Using the relative path**. With this approach, you only provide the relative path to the file that you want to access.

    ```
    /<file.path>/
    ```

### Data access examples

Examples are based on an [ssh connection](./hdinsight-hadoop-linux-use-ssh-unix.md) to the head node of the cluster. The examples use all three URI schemes. Replace `CONTAINERNAME` and `STORAGEACCOUNT` with the relevant values

#### A few hdfs commands

1. Create a file on local storage.

    ```bash
    touch testFile.txt
    ```

1. Create directories on cluster storage.

    ```bash
    hdfs dfs -mkdir abfs://CONTAINERNAME@STORAGEACCOUNT.dfs.core.windows.net/sampledata1/
    hdfs dfs -mkdir abfs:///sampledata2/
    hdfs dfs -mkdir /sampledata3/
    ```

1. Copy data from local storage to cluster storage.

    ```bash
    hdfs dfs -copyFromLocal testFile.txt  abfs://CONTAINERNAME@STORAGEACCOUNT.dfs.core.windows.net/sampledata1/
    hdfs dfs -copyFromLocal testFile.txt  abfs:///sampledata2/
    hdfs dfs -copyFromLocal testFile.txt  /sampledata3/
    ```

1. List directory contents on cluster storage.

    ```bash
    hdfs dfs -ls abfs://CONTAINERNAME@STORAGEACCOUNT.dfs.core.windows.net/sampledata1/
    hdfs dfs -ls abfs:///sampledata2/
    hdfs dfs -ls /sampledata3/
    ```

#### Creating a Hive table

Three file locations are shown for illustrative purposes. For actual execution, use only one of the `LOCATION` entries.

```hql
DROP TABLE myTable;
CREATE EXTERNAL TABLE myTable (
    t1 string,
    t2 string,
    t3 string,
    t4 string,
    t5 string,
    t6 string,
    t7 string)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
STORED AS TEXTFILE
LOCATION 'abfs://CONTAINERNAME@STORAGEACCOUNT.dfs.core.windows.net/example/data/';
LOCATION 'abfs:///example/data/';
LOCATION '/example/data/';
```

## Next steps

* [Azure HDInsight integration with Data Lake Storage Gen2 preview - ACL and security update](https://azure.microsoft.com/blog/azure-hdinsight-integration-with-data-lake-storage-gen-2-preview-acl-and-security-update/)
* [Introduction to Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md)
* [Tutorial: Extract, transform, and load data using Interactive Query in Azure HDInsight](./interactive-query/interactive-query-tutorial-analyze-flight-data.md)
