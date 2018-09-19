---
title: 'Quickstart: Run a workflow through Microsoft Genomics'
description: The quickstart shows how to load input data into Azure Blob Storage and run a workflow through the Microsoft Genomics service. 
services: genomics
author: grhuynh
manager: cgronlun
ms.author: grhuynh
ms.service: genomics
ms.topic: quickstart
ms.date: 12/07/2017


---

# Quickstart: Run a workflow through the Microsoft Genomics service

This quickstart shows how to load input data into Azure Blob Storage and run a workflow through the Microsoft Genomics service. Microsoft Genomics is a scalable, secure service for secondary analysis that can rapidly process a genome, starting from raw reads and producing aligned reads and variant calls. 

Get started in just a few steps: 
1.	Set up: Create a Microsoft Genomics account through the Azure portal, and install the Microsoft Genomics Python client in your local environment. 
2.	Upload input data: Create a Microsoft Azure storage account through the Azure portal, and upload the input files. The input files should be paired end reads (fastq or bam files).
3.	Run: Use the Microsoft Genomics command-line interface to run workflows through the Microsoft Genomics service. 

For more information on Microsoft Genomics, see [What is Microsoft Genomics?](overview-what-is-genomics.md)

## Set up: Create a Microsoft Genomics account in the Azure portal

To create a Microsoft Genomics account, navigate to the [Azure portal](https://portal.azure.com/#create/Microsoft.Genomics). If you don’t have an Azure subscription yet, create one before creating a Microsoft Genomics account. 

![Microsoft Genomics on Azure portal](./media/quickstart-run-genomics-workflow-portal/genomics-create-blade.png "Microsoft Genomics on Azure portal")



Configure your Genomics account with the following information, as shown in the preceding image. 

 |**Setting**          |  **Suggested value**  | **Field description** |
 |:-------------       |:-------------         |:----------            |
 |Account name         | MyGenomicsAccount     |Choose a unique account identifier. For valid names, see [Naming Rules](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions) |
 |Subscription         | Your subscription name|This is the billing unit for your Azure services - For details about your subscription see [Subscriptions](https://account.azure.com/Subscriptions) |      
 |Resource group       | MyResourceGroup       |  Resource groups allow you to group multiple Azure resources (storage account, genomics account, etc.) into a single group for simple management. For more information, see [Resource Groups] (https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#resource-groups). For valid resource group names, see [Naming Rules](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions) |
 |Location                   | West US 2                    |    Service is available in West US 2, West Europe, and Southeast Asia |




You can click Notifications in the top menu bar to monitor the deployment process.
![Microsoft Genomics Notifications](./media/quickstart-run-genomics-workflow-portal/genomics-notifications-box.png "Microsoft Genomics Notifications")



## Set up: Install the Microsoft Genomics Python client

Users need to install both Python and the Microsoft Genomics Python client in their local environment. 

### Install Python

The Microsoft Genomics Python client is compatible with Python 2.7. 12 or later 2.7.xx version; 2.7.15 is the latest version at the time of this writing; 2.7.14 is the suggested version. You can find the download [here](https://www.python.org/downloads/). 

NOTE: Python 3.x isn't compatible with Python 2.7.xx.  MSGen is a Python 2.7 application. When running MSGen, make sure that your active Python environment is using a 2.7.xx version of Python. You may get errors when trying to use MSGen with a 3.x version of Python.


### Install the Microsoft Genomics client

Use Python pip to install the Microsoft Genomics client `msgen`. The follow instructions assume Python is already in your system path. If you have issues with pip install not recognized, you need to add Python and the scripts subfolder to your system path.


```
pip install --upgrade --no-deps msgen
pip install msgen
```


If you do not want to install `msgen` as a system-wide binary and modify system-wide Python packages, use the `–-user` flag with `pip`.
If you use the package-based installation or setup.py, all necessary required packages are installed. Otherwise, the basic required packages for msgen are 

 * [Azure-storage](https://pypi.python.org/pypi/azure-storage). 
 * [Requests](https://pypi.python.org/pypi/requests). 


You can install these packages using `pip`, `easy_install` or through standard `setup.py` procedures. 





### Test the Microsoft Genomics client
To test the Microsoft Genomics client, download the config file from your genomics account. 
Navigate to your genomics account by clicking **All services** in the top left, filtering, and selecting for genomics accounts.


![Filter for Microsoft Genomics on Azure portal](./media/quickstart-run-genomics-workflow-portal/genomics-filter-box.png "Filter for Microsoft Genomics on Azure portal")



Select the genomics account you just made, navigate to **Access Keys** and download the configuration file.

![Download config file from Microsoft Genomics](./media/quickstart-run-genomics-workflow-portal/genomics-mygenomicsaccount-box.png "Download config file from Microsoft Genomics")


Test that the Microsoft Genomics Python client is working with the following command


```
msgen list -f “<full path where you saved the config file>”
```

## Create a Microsoft Azure Storage Account 
The Microsoft Genomics service expects inputs to be stored as block blobs in an Azure storage account. It also writes output files as block blobs to a user-specified container in an Azure storage account. The inputs and outputs can reside in different storage accounts.
If you already have your data in an Azure storage account, you only need to make sure that it is in the same location as your Genomics account. Otherwise, egress charges are incurred when running the Genomics service. 
If you don’t yet have a Microsoft Azure Storage account, you need to create one and upload your data. You can find more information about Azure Storage accounts [here](https://docs.microsoft.com/azure/storage/common/storage-create-storage-account), including what a storage account is and what services it provides. To create a Microsoft Azure Storage account, navigate to the [Azure portal](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM ).  

![Storage create blade](./media/quickstart-run-genomics-workflow-portal/genomics-storage-create-blade.png "Storage create blade")

Configure your Storage account with the following information, as shown in the preceding image. Use most of the standard options for a storage account, specifying only that the account is blob storage, not general purpose. Blob storage can be 2-5x faster for downloads and uploads. 


 |**Setting**          |  **Suggested value**  | **Field description** |
 |:-------------------------       |:-------------         |:----------            |
 |Name         | MyStorageAccount     |Choose a unique account identifier. For valid names, see [Naming Rules](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions) |
 |Deployment Model         | Resource Manager| Resource Manager is the recommended deployment model. For more information, see [Understanding Resource Manager deployment](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-deployment-model) |      
 |Account kind       | Blob storage       |  Blob storage can be 2-5x faster than general purpose for downloads and uploads. |
 |Performance                  | Standard                   | The default is standard. For more details on standard and premium storage accounts, see [Introduction to Microsoft Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-introduction)    |
 |Replication                  | Locally redundant storage                  | Locally redundant storage replicates your data within the datacenter in the region you created your storage account. For more information, see [Azure Storage replication](https://docs.microsoft.com/azure/storage/common/storage-redundancy)    |
 |Secure transfer required                  | Disabled                 | The default is disabled. For more information about data transfer security, see [Require secure transfer](https://docs.microsoft.com/azure/storage/common/storage-require-secure-transfer)    |
 |Access tier                  | Hot                   | Hot access indicates objects in the storage account will be more frequently accessed.    |
 |Subscription         | Your Azure subscription |For details about your subscription see [Subscriptions](https://account.azure.com/Subscriptions) |      
 |Resource group       | MyResourceGroup       |  You can select the same resource group as your genomics account. For valid resource group names, see [Naming Rules](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions) |
 |Location                  | West US 2                  | Use the same location as the location of your genomics account, to reduce egress charges, and reduce latency. The Genomics service is available in West US2, West US 2, West Europe, and Southeast Asia    |
 |Virtual networks                | Disabled                   | The default is disabled. For more information, see [Azure Virtual Networks](https://docs.microsoft.com/azure/storage/common/storage-network-security)    |





Then click create to create your storage account. As you did with the creation of your Genomics Account, you can click Notifications in the top menu bar to monitor the deployment process. 


## Upload input data to your storage account

The Microsoft Genomics service expects paired end reads as input files. You can choose to either upload your own data, or explore using publicly available sample data provided for you. If you would like to use the publicly available sample data, it is hosted here:


[https://msgensampledata.blob.core.windows.net/small/chr21_1.fq.gz](https://msgensampledata.blob.core.windows.net/small/chr21_1.fq.gz)
[https://msgensampledata.blob.core.windows.net/small/chr21_2.fq.gz](https://msgensampledata.blob.core.windows.net/small/chr21_2.fq.gz)


Within your storage account, you need to make one blob container for your input data and a second blob container for your output data.  Upload the input data into your input blob container. Various tools can be used to do this, including [Microsoft Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/), [blobporter](https://github.com/Azure/blobporter), or [AzCopy](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy?toc=%2fazure%2fstorage%2fblobs%2ftoc.json). 



## Run a workflow through the Microsoft Genomics service using the Python client 

To run a workflow through the Microsoft Genomics service, edit the config.txt file to specify the input and output storage container for your data.
Open the config.txt file that you downloaded from your Genomics account. The sections you need to specify are your subscription key and the six items at the bottom, the storage account name, key and container name for both the input and output. You can find this information by navigating in the portal to **Access keys** for your storage account, or directly from the Azure Storage Explorer.  


![Genomics config](./media/quickstart-run-genomics-workflow-portal/genomics-config.png "Genomics config")

### Submit your workflow to the Microsoft Genomics service the Microsoft Genomics client

Use the Microsoft Genomics Python client to submit your workflow with the following command:


```python
msgen submit -f [full path to your config file] -b1 [name of your first paired end read] -b2 [name of your second paired end read]
```


You can view the status of your workflows using the following command: 
```python
msgen list -f c:\temp\config.txt 
```


Once your workflow completes, you can view the output files in your Azure Storage Account in the output container that you configured. 


## Next steps
In this article, you uploaded sample input data into Azure Storage and submitted a workflow to the Microsoft Genomics service through the `msgen` Python client. To learn more about other input file types that can be used with the Microsoft Genomics service, see the following pages: [paired FASTQ](quickstart-input-pair-FASTQ.md) | [BAM](quickstart-input-BAM.md) | [Multiple FASTQ or BAM](quickstart-input-multiple.md). You can also explore this tutorial using our [Azure notebook tutorial.](http://aka.ms/genomicsnotebook)
