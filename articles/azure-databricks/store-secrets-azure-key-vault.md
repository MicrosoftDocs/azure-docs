---
title: Tutorial - Access blob storage using key vault using Azure Databricks
description: This tutorial describes how to access Azure Blob Storage from Azure Databricks using secrets stored in a key vault.
author: mamccrea
ms.author: mamccrea
ms.reviewer: jasonh
ms.service: azure-databricks
ms.topic: tutorial
ms.date: 07/19/2019
---

# Tutorial: Access Azure Blob Storage from Azure Databricks using Azure Key Vault

This tutorial describes how to access Azure Blob Storage from Azure Databricks using secrets stored in a key vault.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a storage account and blob container
> * Create an Azure Key Vault and add a secret
> * Create an Azure Databricks workspace and add a secret scope
> * Access your blob container from Azure Databricks

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

> [!Note]
> This tutorial cannot be carried out using **Azure Free Trial Subscription**.
> If you have a free account, go to your profile and change your subscription to **pay-as-you-go**. For more information, see [Azure free account](https://azure.microsoft.com/free/). Then, [remove the spending limit](https://docs.microsoft.com/azure/billing/billing-spending-limit#why-you-might-want-to-remove-the-spending-limit), and [request a quota increase](https://docs.microsoft.com/azure/azure-portal/supportability/resource-manager-core-quotas-request) for vCPUs in your region. When you create your Azure Databricks workspace, you can select the **Trial (Premium - 14-Days Free DBUs)** pricing tier to give the workspace access to free Premium Azure Databricks DBUs for 14 days.

## Create a storage account and blob container

1. In the Azure portal, select **Create a resource** > **Storage**. Then select **Storage account**.

   ![Find Azure storage account resource](./media/store-secrets-azure-key-vault/create-storage-account-resource.png)

2. Select your subscription and resource group, or create a new resource group. Then enter a storage account name, and choose a location. Select **Review + Create**.

   ![Set storage account properties](./media/store-secrets-azure-key-vault/create-storage-account.png)

3. If the validation is unsuccessful, address the issues and try again. If the validation is successful, select **Create** and wait for the storage account to be created.

4. Navigate to your newly created storage account and select **Blobs** under **Services** on the **Overview** page. Then select **+ Container** and enter a container name. Select **OK**.

   ![Create new container](./media/store-secrets-azure-key-vault/create-blob-storage-container.png)

5. Locate a file you want to upload to your blob storage container. If you don't have a file, use a text editor to create a new text file with some information. In this example, a file named **hw.txt** contains the text "hello world." Save your text file locally and upload it to your blob storage container.

   ![Upload file to container](./media/store-secrets-azure-key-vault/upload-txt-file.png)

6. Return to your storage account and select **Access keys** under **Settings**. Copy **Storage account name** and **key 1** to a text editor for later use in this tutorial.

   ![Find storage account access keys](./media/store-secrets-azure-key-vault/storage-access-keys.png)

## Create an Azure Key Vault and add a secret

1. In the Azure portal, select **Create a resource** and enter **Key Vault** in the search box.

   ![Create an Azure resource search box](./media/store-secrets-azure-key-vault/find-key-vault-resource.png)

2. The Key Vault resource is automatically selected. Select **Create**.

   ![Create a Key Vault resource](./media/store-secrets-azure-key-vault/create-key-vault-resource.png)

3. On the **Create key vault** page, enter the following information, and keep the default values for the remaining fields:

   |Property|Description|
   |--------|-----------|
   |Name|A unique name for your key vault.|
   |Subscription|Choose a subscription.|
   |Resource group|Choose a resource group or create a new one.|
   |Location|Choose a location.|

   ![Azure key vault properties](./media/store-secrets-azure-key-vault/create-key-vault-properties.png)

3. After providing the information above, select **Create**. 

4. Navigate to your newly created key vault in the Azure portal and select **Secrets**. Then, select **+ Generate/Import**. 

   ![Generate new key vault secret](./media/store-secrets-azure-key-vault/generate-import-secrets.png)

5. On the **Create a secret** page, provide the following information, and keep the default values for the remaining fields:

   |Property|Value|
   |--------|-----------|
   |Upload options|Manual|
   |Name|Friendly name for your storage account key.|
   |Value|key1 from your storage account.|

   ![Properties for new key vault secret](./media/store-secrets-azure-key-vault/create-storage-secret.png)

6. Save the key name in a text editor for use later in this tutorial, and select **Create**. Then, navigate to the **Properties** menu. Copy the **DNS Name** and **Resource ID** to a text editor for use later in the tutorial.

   ![Copy Azure Key Vault DNS name and Resource ID](./media/store-secrets-azure-key-vault/copy-dns-resource.png)

## Create an Azure Databricks workspace and add a secret scope

1. In the Azure portal, select **Create a resource** > **Analytics** > **Azure Databricks**.

    ![Databricks on Azure portal](./media/store-secrets-azure-key-vault/azure-databricks-on-portal.png)

2. Under **Azure Databricks Service**, provide the following values to create a Databricks workspace.

   |Property  |Description  |
   |---------|---------|
   |Workspace name     | Provide a name for your Databricks workspace        |
   |Subscription     | From the drop-down, select your Azure subscription.        |
   |Resource group     | Select the same resource group that contains your key vault. |
   |Location     | Select the same location as your Azure Key Vault. For all available regions, see [Azure services available by region](https://azure.microsoft.com/regions/services/).        |
   |Pricing Tier     |  Choose between **Standard** or **Premium**. For more information on these tiers, see [Databricks pricing page](https://azure.microsoft.com/pricing/details/databricks/).       |

   ![Databricks workspace properties](./media/store-secrets-azure-key-vault/create-databricks-service.png)

   Select **Create**.

3. Navigate to your newly created Azure Databricks resource in the Azure portal and select **Launch Workspace**.

   ![Launch Azure Databricks workspace](./media/store-secrets-azure-key-vault/launch-databricks-workspace.png)

4. Once your Azure Databricks workspace is open in a separate window, append **#secrets/createScope** to the URL. The URL should have the following format: 

   **https://<\location>.azuredatabricks.net/?o=<\orgID>#secrets/createScope**.
   

5. Enter a scope name, and enter the Azure Key Vault DNS name and Resource ID you saved earlier. Save the scope name in a text editor for use later in this tutorial. Then, select **Create**.

   ![Create secret scope in the Azure Databricks workspace](./media/store-secrets-azure-key-vault/create-secret-scope.png)

## Access your blob container from Azure Databricks

1. From the home page of your Azure Databricks workspace, select **New Cluster** under **Common Tasks**.

   ![Create a new Azure Databricks notebook](./media/store-secrets-azure-key-vault/create-new-cluster.png)

2. Enter a cluster name and select **Create cluster**. The cluster creation takes a few minutes to complete.

3. Once the cluster is created, navigate to the home page of your Azure Databricks workspace, select **New Notebook** under **Common Tasks**.

   ![Create a new Azure Databricks notebook](./media/store-secrets-azure-key-vault/create-new-notebook.png)

4. Enter a notebook name, and set the language to Python. Set the cluster to the name of the cluster you created in the previous step.

5. Run the following command to mount your blob storage container. Remember to change the values for the following properties:

   * your-container-name
   * your-storage-account-name
   * mount-name
   * config-key
   * scope-name
   * key-name

   ```python
   dbutils.fs.mount(
   source = "wasbs://<your-container-name>@<your-storage-account-name>.blob.core.windows.net",
   mount_point = "/mnt/<mount-name>",
   extra_configs = {"<conf-key>":dbutils.secrets.get(scope = "<scope-name>", key = "<key-name>")})
   ```

   * **mount-name** is a DBFS path representing where the Blob Storage container or a folder inside the container (specified in source) will be mounted.
   * **conf-key** can be either
      `fs.azure.account.key.<\your-storage-account-name>.blob.core.windows.net` or `fs.azure.sas.<\your-container-name>.<\your-storage-account-name>.blob.core.windows.net`
   * **scope-name** is the name of the secret scope you created in the previous section. 
   * **key-name** is the name of they secret you created for the storage account key in your key vault.

   ![Create blob storage mount in notebook](./media/store-secrets-azure-key-vault/command1.png)

6. Run the following command to read the text file in your blob storage container to a dataframe. Change the values in the command to match your mount name and file name.

   ```python
   df = spark.read.text("/mnt/<mount-name>/<file-name>")
   ```

   ![Read file to dataframe](./media/store-secrets-azure-key-vault/command2.png)

7. Use the following command to display the contents of your file.

   ```python
   df.show()
   ```
   ![Show dataframe](./media/store-secrets-azure-key-vault/command3.png)

8. To unmount your blob storage, run the following command:

   ```python
   dbutils.fs.unmount("/mnt/<mount-name>")
   ```

   ![Unmount storage account](./media/store-secrets-azure-key-vault/command4.png)

9. Notice that once the mount has been unmounted, you can no longer read from your blob storage account.

   ![Unmount storage account error](./media/store-secrets-azure-key-vault/command5.png)

## Clean up resources

If you're not going to continue to use this application, delete your entire resource group with the following steps:

1. From the left-hand menu in Azure portal, select **Resource groups** and navigate to your resource group.

2. Select **Delete resource group** and type your resource group name. Then select **Delete**. 

## Next steps

Advance to the next article to learn how to implement a VNet injected Databricks environment with a Service Endpoint enabled for Cosmos DB.
> [!div class="nextstepaction"]
> [Tutorial: Implement Azure Databricks with a Cosmos DB endpoint](service-endpoint-cosmosdb.md)
