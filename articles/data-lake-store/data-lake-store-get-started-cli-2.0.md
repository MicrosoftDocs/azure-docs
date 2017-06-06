---
title: Use Azure command-line 2.0 interface to get started with Azure Data Lake Store | Microsoft Docs
description: Use Azure cross-platform command line 2.0 to create a Data Lake Store account and perform basic operations
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.assetid: 4ffa0f4a-1cca-46ac-803d-1fc8538c685b
ms.service: data-lake-store
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/04/2017
ms.author: nitinme

---
# Get started with Azure Data Lake Store using Azure CLI 2.0 (Preview)
> [!div class="op_single_selector"]
> * [Portal](data-lake-store-get-started-portal.md)
> * [PowerShell](data-lake-store-get-started-powershell.md)
> * [.NET SDK](data-lake-store-get-started-net-sdk.md)
> * [Java SDK](data-lake-store-get-started-java-sdk.md)
> * [REST API](data-lake-store-get-started-rest-api.md)
> * [Azure CLI](data-lake-store-get-started-cli.md)
> * [Azure CLI 2.0](data-lake-store-get-started-cli-2.0.md)
> * [Node.js](data-lake-store-manage-use-nodejs.md)
> * [Python](data-lake-store-get-started-python.md)
>
>

Learn how to use Azure CLI 2.0 to create an Azure Data Lake Store account and perform basic operations such as create folders, upload and download data files, delete your account, etc. For more information about Data Lake Store, see [Overview of Data Lake Store](data-lake-store-overview.md).

The Azure CLI 2.0 is Azure's new command-line experience for managing Azure resources. It can be used on macOS, Linux, and Windows. For more information, see [Overview of Azure CLI 2.0](https://docs.microsoft.com/cli/azure/overview). You can also look at the [Azure Data Lake Store CLI 2.0 reference](https://docs.microsoft.com/cli/azure/dls) for a complete list of commands and syntax.


## Prerequisites
Before you begin this article, you must have the following:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **Azure CLI 2.0** - See [Install Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) for instructions.

## Authentication

This article uses a simpler authentication approach with Data Lake Store where you log in as an end-user user. The access level to Data Lake Store account and file system is then governed by the access level of the logged in user. However, there are other approaches as well to authenticate with Data Lake Store, which are **end-user authentication** or **service-to-service authentication**. For instructions and more information on how to authenticate, see [Authenticate with Data Lake Store using Azure Active Directory](data-lake-store-authenticate-using-active-directory.md).

## Enable Data Lake Store (Preview) in Azure CLI 2.0

Data Lake Store CLI 2.0 is currently in Preview and does not get enabled by default when you install Azure CLI 2.0. Run the following command to enable Data Lake Store CLI 2.0.

```azurecli
az component update --add dls
```


## Log in to your Azure subscription

1. Log into your Azure subscription.

	```azurecli
	az login
	```

	You get a code to use in the next step. Use a web browser to open the page https://aka.ms/devicelogin and enter the code to authenticate. You are prompted to log in using your credentials.

2. Once you log in, the window lists all the Azure subscriptions that are associated with your account. Use the following command to use a specific subscription.
   
	```azurecli
	az account set --subscription <subscription id> 
	```

## Create an Azure Data Lake Store account

1. Create a new resource group. In the following command, provide the parameter values you want to use. If the location name contains spaces, put it in quotes. For example "East US 2". 
   
	```azurecli
	az group create --location "East US 2" --name myresourcegroup
	```

2. Create the Data Lake Store account.
   
	```azurecli
	az dls account create --account mydatalakestore --resource-group myresourcegroup
	```

## Create folders in a Data Lake Store account

You can create folders under your Azure Data Lake Store account to manage and store data. Use the following command to create a folder called **mynewfolder** at the root of the Data Lake Store.

```azurecli
az dls fs create --account mydatalakestore --path /mynewfolder --folder
```

> [!NOTE]
> The `--folder` parameter ensures that the command creates a folder. If this parameter is not present, the command creates an empty file called mynewfolder at the root of the Data Lake Store account.
> 
>

## Upload data to a Data Lake Store account

You can upload data to Data Lake Store directly at the root level or to a folder that you created within the account. The snippets below demonstrate how to upload some sample data to the folder (**mynewfolder**) you created in the previous section.

If you are looking for some sample data to upload, you can get the **Ambulance Data** folder from the [Azure Data Lake Git Repository](https://github.com/MicrosoftBigData/usql/tree/master/Examples/Samples/Data/AmbulanceData). Download the file and store it in a local directory on your computer, such as  C:\sampledata\.

```azurecli
az dls fs upload --account mydatalakestore --source-path "C:\SampleData\AmbulanceData\vehicle1_09142014.csv" --destination-path "/mynewfolder/vehicle1_09142014.csv"
```

> [!NOTE]
> For the destination, you must specify the complete path including the file name.
> 
>


## List files in a Data Lake Store account

Use the following command to list the files in a Data Lake Store account.

```azurecli
az dls fs list --account mydatalakestore --path /mynewfolder
```

The output of this should be similar to the following:

	[
		{
			"accessTime": 1491323529542,
			"aclBit": false,
			"blockSize": 268435456,
			"group": "1808bd5f-62af-45f4-89d8-03c5e81bac20",
			"length": 1589881,
			"modificationTime": 1491323531638,
			"msExpirationTime": 0,
			"name": "mynewfolder/vehicle1_09142014.csv",
			"owner": "1808bd5f-62af-45f4-89d8-03c5e81bac20",
			"pathSuffix": "vehicle1_09142014.csv",
			"permission": "770",
			"replication": 1,
			"type": "FILE"
		}
	]

## Rename, download, and delete data from a Data Lake Store account 

* **To rename a file**, use the following command:
  
	```azurecli
	az dls fs move --account mydatalakestore --source-path /mynewfolder/vehicle1_09142014.csv --destination-path /mynewfolder/vehicle1_09142014_copy.csv
	```

* **To download a file**, use the following command. Make sure the destination path you specify already exists.
  
	```azurecli		
	az dls fs download --account mydatalakestore --source-path /mynewfolder/vehicle1_09142014_copy.csv --destination-path "C:\mysampledata\vehicle1_09142014_copy.csv"
	```

	> [!NOTE]
	> The command creates the destination folder if it does not exist.
	> 
	>

* **To delete a file**, use the following command:
  
	```azurecli
	az dls fs delete --account mydatalakestore --path /mynewfolder/vehicle1_09142014_copy.csv
	```

	If you want to delete the folder **mynewfolder** and the file **vehicle1_09142014_copy.csv** together in one command, use the --recurse parameter

	```azurecli
	az dls fs delete --account mydatalakestore --path /mynewfolder --recurse
	```

## Work with permissions and ACLs for a Data Lake Store account

In this section you learn about how to manage ACLs and permissions using Azure CLI 2.0. For a detailed discussion on how ACLs are implemented in Azure Data Lake Store, see [Access control in Azure Data Lake Store](data-lake-store-access-control.md).

* **To update the owner of a file/folder**, use the following command:

	```azurecli
	az dls fs access set-owner --account mydatalakestore --path /mynewfolder/vehicle1_09142014.csv --group 80a3ed5f-959e-4696-ba3c-d3c8b2db6766 --owner 6361e05d-c381-4275-a932-5535806bb323
	```

* **To update the permissions for a file/folder**, use the following command:

	```azurecli
	az dls fs access set-permission --account mydatalakestore --path /mynewfolder/vehicle1_09142014.csv --permission 777
	```
	
* **To get the ACLs for a given path**, use the following command:

	```azurecli
	az dls fs access show --account mydatalakestore --path /mynewfolder/vehicle1_09142014.csv
	```

	The output should be similar to the following:

		{
			"entries": [
			"user::rwx",
			"group::rwx",
			"other::---"
		  ],
		  "group": "1808bd5f-62af-45f4-89d8-03c5e81bac20",
		  "owner": "1808bd5f-62af-45f4-89d8-03c5e81bac20",
		  "permission": "770",
		  "stickyBit": false
		}

* **To set an entry for an ACL**, use the following command:

	```azurecli
	az dls fs access set-entry --account mydatalakestore --path /mynewfolder --acl-spec user:6360e05d-c381-4275-a932-5535806bb323:-w-
	```

* **To remove an entry for an ACL**, use the following command:

	```azurecli
	az dls fs access remove-entry --account mydatalakestore --path /mynewfolder --acl-spec user:6360e05d-c381-4275-a932-5535806bb323
	```

* **To remove an entire default ACL**, use the following command:

	```azurecli
	az dls fs access remove-all --account mydatalakestore --path /mynewfolder --default-acl
	```

* **To remove an entire non-default ACL**, use the following command:

	```azurecli
	az dls fs access remove-all --account mydatalakestore --path /mynewfolder
	```
    
## Delete a Data Lake Store account
Use the following command to delete a Data Lake Store account.

```azurecli
az dls account delete --account mydatalakestore
```

When prompted, enter **Y** to delete the account.

## Next steps

* [Azure Data Lake Store CLI 2.0 reference](https://docs.microsoft.com/cli/azure/dls)
* [Secure data in Data Lake Store](data-lake-store-secure-data.md)
* [Use Azure Data Lake Analytics with Data Lake Store](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
* [Use Azure HDInsight with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)

[azure-command-line-tools]: ../xplat-cli-install.md
