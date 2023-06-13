---
title: Explore data and model on Windows
titleSuffix: Azure Data Science Virtual Machine 
description: Perform data exploration and modeling tasks on the Windows Data Science Virtual Machine.
services: machine-learning
ms.service: data-science-vm
ms.custom: devx-track-azurepowershell

author: jesscioffi
ms.author: jcioffi
ms.topic: conceptual
ms.date: 06/23/2022
---

# Data science with a Windows Data Science Virtual Machine

The Windows Data Science Virtual Machine (DSVM) is a powerful data science development environment where you can perform data exploration and modeling tasks. The environment comes already built and bundled with several popular data analytics tools that make it easy to get started with your analysis for on-premises, cloud, or hybrid deployments. 

The DSVM works closely with Azure services. It can read and process data that's already stored on Azure, in Azure Synapse (formerly SQL DW), Azure Data Lake, Azure Storage, or Azure Cosmos DB. It can also take advantage of other analytics tools, such as Azure Machine Learning.

In this article, you'll learn how to use your DSVM to perform data science tasks and interact with other Azure services. Here are some of the things you can do on the DSVM:

- Use a Jupyter Notebook to experiment with your data in a browser by using Python 2, Python 3, and Microsoft R. (Microsoft R is an enterprise-ready version of R designed for performance.)
- Explore data and develop models locally on the DSVM by using Microsoft Machine Learning Server and Python.
- Administer your Azure resources by using the Azure portal or PowerShell.
- Extend your storage space and share large-scale datasets/code across your whole team by creating an Azure Files share as a mountable drive on your DSVM.
- Share code with your team by using GitHub. Access your repository by using the pre-installed Git clients: Git Bash and Git GUI.
- Access Azure data and analytics services like Azure Blob storage, Azure Cosmos DB, Azure Synapse (formerly SQL DW), and Azure SQL Database.
- Build reports and a dashboard by using the Power BI Desktop instance that's pre-installed on the DSVM, and deploy them in the cloud.

- Install additional tools on your virtual machine.   

> [!NOTE]
> Additional usage charges apply for many of the data storage and analytics services listed in this article. For details, see the [Azure pricing](https://azure.microsoft.com/pricing/) page.
> 
> 

## Prerequisites

* You need an Azure subscription. You can [sign up for a free trial](https://azure.microsoft.com/free/).
* Instructions for provisioning a Data Science Virtual Machine on the Azure portal are available in [Creating a virtual machine](https://portal.azure.com/#create/microsoft-dsvm.dsvm-windowsserver-2016).


[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]


## Use Jupyter Notebooks
The Jupyter Notebook provides a browser-based IDE for data exploration and modeling. You can use Python 2, Python 3, or R in a Jupyter Notebook.

To start the Jupyter Notebook, select the **Jupyter Notebook** icon on the **Start** menu or on the desktop. In the DSVM command prompt, you can also run the command ```jupyter notebook``` from the directory where you have existing notebooks or where you want to create new notebooks.  

After you start Jupyter, navigate to the `/notebooks` directory for example notebooks that are pre-packaged into the DSVM. Now you can:

* Select the notebook to see the code.
* Run each cell by selecting Shift+Enter.
* Run the entire notebook by selecting **Cell** > **Run**.
* Create a new notebook by selecting the Jupyter icon (upper-left corner), selecting the **New** button on the right, and then choosing the notebook language (also known as kernels).   

> [!NOTE]
> Currently, Python 2.7, Python 3.6, R, Julia, and PySpark kernels in Jupyter are supported. The R kernel supports programming in both open-source R and Microsoft R.   
> 
> 

When you're in the notebook, you can explore your data, build the model, and test the model by using your choice of libraries.

## Explore data and develop models with Microsoft Machine Learning Server

> [!NOTE]
> Support for Machine Learning Server Standalone will end July 1, 2021. We will remove it from the DSVM images after
> June, 30. Existing deployments will continue to have access to the software but due to the reached support end date,
> there will be no support for it after July 1, 2021.

You can use languages like R and Python to do your data analytics right on the DSVM.

For R, you can use R Tools for Visual Studio. Microsoft has provided additional libraries on top of the open-source CRAN R to enable scalable analytics and the ability to analyze data larger than the memory size allowed in parallel chunked analysis. 

For Python, you can use an IDE like Visual Studio Community Edition, which has the Python Tools for Visual Studio (PTVS) extension pre-installed. By default, only Python 3.6, the root Conda environment, is configured on PTVS. To enable Anaconda Python 2.7, take the following steps:

1. Create custom environments for each version by going to **Tools** > **Python Tools** > **Python Environments**, and then selecting **+ Custom** in Visual Studio Community Edition.
1. Give a description and set the environment prefix path as **c:\anaconda\envs\python2** for Anaconda Python 2.7.
1. Select **Auto Detect** > **Apply** to save the environment.

See the [PTVS documentation](/visualstudio/python/) for more details on how to create Python environments.

Now you're set up to create a new Python project. Go to **File** > **New** > **Project** > **Python** and select the type of Python application you're building. You can set the Python environment for the current project to the desired version (Python 2.7 or 3.6) by right-clicking **Python environments** and then selecting **Add/Remove Python Environments**. You can find more information about working with PTVS in the [product documentation](/visualstudio/python/).



## Manage Azure resources
The DSVM doesn't just allow you to build your analytics solution locally on the virtual machine. It also allows you to access services on the Azure cloud platform. Azure provides several compute, storage, data analytics, and other services that you can administer and access from your DSVM.

To administer your Azure subscription and cloud resources, you have two options:
+ Use your browser and go to the [Azure portal](https://portal.azure.com).

+ Use PowerShell scripts. Run Azure PowerShell from a shortcut on the desktop or from the **Start** menu. See the 
[Microsoft Azure PowerShell documentation](../../azure-resource-manager/management/manage-resources-powershell.md) for full details. 

## Extend storage by using shared file systems
Data scientists can share large datasets, code, or other resources within the team. The DSVM has about 45 GB of space available. To extend your storage, you can use Azure Files and either mount it on one or more DSVM instances or access it via a REST API. You can also use the [Azure portal](../../virtual-machines/windows/attach-managed-disk-portal.md) or use [Azure PowerShell](../../virtual-machines/windows/attach-disk-ps.md) to add extra dedicated data disks. 

> [!NOTE]
> The maximum space on the Azure Files share is 5 TB. The size limit for each file is 1 TB. 

You can use this script in Azure PowerShell to create an Azure Files share:

```powershell
# Authenticate to Azure.
Connect-AzAccount
# Select your subscription
Get-AzSubscription –SubscriptionName "<your subscription name>" | Select-AzSubscription
# Create a new resource group.
New-AzResourceGroup -Name <dsvmdatarg>
# Create a new storage account. You can reuse existing storage account if you want.
New-AzStorageAccount -Name <mydatadisk> -ResourceGroupName <dsvmdatarg> -Location "<Azure Data Center Name For eg. South Central US>" -Type "Standard_LRS"
# Set your current working storage account
Set-AzCurrentStorageAccount –ResourceGroupName "<dsvmdatarg>" –StorageAccountName <mydatadisk>

# Create an Azure Files share
$s = New-AzStorageShare <<teamsharename>>
# Create a directory under the file share. You can give it any name
New-AzStorageDirectory -Share $s -Path <directory name>
# List the share to confirm that everything worked
Get-AzStorageFile -Share $s
```

Now that you have created an Azure Files share, you can mount it in any virtual machine in Azure. We recommend that you put the VM in the same Azure datacenter as the storage account, to avoid latency and data transfer charges. Here are the Azure PowerShell commands to mount the drive on the DSVM:

```powershell
# Get the storage key of the storage account that has the Azure Files share from the Azure portal. Store it securely on the VM to avoid being prompted in the next command.
cmdkey /add:<<mydatadisk>>.file.core.windows.net /user:<<mydatadisk>> /pass:<storage key>

# Mount the Azure Files share as drive Z on the VM. You can choose another drive letter if you want.
net use z:  \\<mydatadisk>.file.core.windows.net\<<teamsharename>>
```

Now you can access this drive as you would any normal drive on the VM.

## Share code in GitHub
GitHub is a code repository where you can find code samples and sources for various tools by using technologies shared by the developer community. It uses Git as the technology to track and store versions of the code files. GitHub is also a platform where you can create your own repository to store your team's shared code and documentation, implement version control, and control who has access to view and contribute code. 

Visit the [GitHub help pages](https://help.github.com/) for more information on using Git. You can use GitHub as one of the ways to collaborate with your team, use code developed by the community, and contribute code back to the community.

The DSVM comes loaded with client tools on the command line and on the GUI to access the GitHub repository. The command-line tool that works with Git and GitHub is called Git Bash. Visual Studio is installed on the DSVM and has the Git extensions. You can find icons for these tools on the **Start** menu and on the desktop.

To download code from a GitHub repository, you use the ```git clone``` command. For example, to download the data science repository published by Microsoft into the current directory, you can run the following command in Git Bash:

```bash
git clone https://github.com/Azure/DataScienceVM.git
```

In Visual Studio, you can do the same clone operation. The  following screenshot shows how to access Git and GitHub tools in Visual Studio:

![Screenshot of Visual Studio with the GitHub connection displayed](./media/vm-do-ten-things/VSGit.png)

You can find more information on using Git to work with your GitHub repository from resources available on github.com. The [cheat sheet](https://training.github.com/downloads/github-git-cheat-sheet/) is a useful reference.

## Access Azure data and analytics services
### Azure Blob storage
Azure Blob storage is a reliable, economical cloud storage service for data big and small. This section describes how you can move data to Blob storage and access data stored in an Azure blob.

#### Prerequisites

* Create your Azure Blob storage account from the [Azure portal](https://portal.azure.com).

   ![Screenshot of the storage account creation process in the Azure portal](./media/vm-do-ten-things/create-azure-blob.png)

* Confirm that the command-line AzCopy tool is pre-installed: ```C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\azcopy.exe```. The directory that contains azcopy.exe is already on your PATH environment variable, so you can avoid typing the full command path when running this tool. For more information on the AzCopy tool, see the [AzCopy documentation](../../storage/common/storage-use-azcopy-v10.md).
* Start the Azure Storage Explorer tool. You can download it from the  [Storage Explorer webpage](https://storageexplorer.com/). 

   ![Screenshot of Azure Storage Explorer accessing a storage account](./media/vm-do-ten-things/AzureStorageExplorer_v4.png)

#### Move data from a VM to an Azure blob: AzCopy

To move data between your local files and Blob storage, you can use AzCopy on the command line or in PowerShell:

```powershell
AzCopy /Source:C:\myfolder /Dest:https://<mystorageaccount>.blob.core.windows.net/<mycontainer> /DestKey:<storage account key> /Pattern:abc.txt
```

Replace **C:\myfolder** with the path where your file is stored, **mystorageaccount** with your Blob storage account name, **mycontainer** with the container name, and **storage account key** with your Blob storage access key. You can find your storage account credentials in the [Azure portal](https://portal.azure.com).

Run the AzCopy command in PowerShell or from a command prompt. Here is some example usage of the AzCopy command:

```powershell
# Copy *.sql from a local machine to an Azure blob
"C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\azcopy" /Source:"c:\Aaqs\Data Science Scripts" /Dest:https://[ENTER STORAGE ACCOUNT].blob.core.windows.net/[ENTER CONTAINER] /DestKey:[ENTER STORAGE KEY] /S /Pattern:*.sql

# Copy back all files from an Azure blob container to a local machine

"C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\azcopy" /Dest:"c:\Aaqs\Data Science Scripts\temp" /Source:https://[ENTER STORAGE ACCOUNT].blob.core.windows.net/[ENTER CONTAINER] /SourceKey:[ENTER STORAGE KEY] /S
```

After you run the AzCopy command to copy to an Azure blob, your file will appear in Azure Storage Explorer.

![Screenshot of the storage account, displaying the uploaded CSV file](./media/vm-do-ten-things/AzCopy_run_finshed_Storage_Explorer_v3.png)

#### Move data from a VM to an Azure blob: Azure Storage Explorer

You can also upload data from the local file in your VM by using Azure Storage Explorer:

* To upload data to a container, select the target container and select the **Upload** button.![Screenshot of the upload button in Azure Storage Explorer](./media/vm-do-ten-things/storage-accounts.png)
* Select the ellipsis (**...**) to the right of the **Files** box, select one or multiple files to upload from the file system, and select **Upload** to begin uploading the files.![Screenshot of the Upload files dialog box](./media/vm-do-ten-things/upload-files-to-blob.png)

#### Read data from an Azure blob: Python ODBC

You can use the BlobService library to read data directly from a blob in a Jupyter Notebook or in a Python program.

First, import the required packages:

```python
import pandas as pd
from pandas import Series, DataFrame
import numpy as np
import matplotlib.pyplot as plt
from time import time
import pyodbc
import os
from azure.storage.blob import BlobService
import tables
import time
import zipfile
import random
```

Then, plug in your Blob storage account credentials and read data from the blob:

```python
CONTAINERNAME = 'xxx'
STORAGEACCOUNTNAME = 'xxxx'
STORAGEACCOUNTKEY = 'xxxxxxxxxxxxxxxx'
BLOBNAME = 'nyctaxidataset/nyctaxitrip/trip_data_1.csv'
localfilename = 'trip_data_1.csv'
LOCALDIRECTORY = os.getcwd()
LOCALFILE =  os.path.join(LOCALDIRECTORY, localfilename)

#download from blob
t1 = time.time()
blob_service = BlobService(account_name=STORAGEACCOUNTNAME,account_key=STORAGEACCOUNTKEY)
blob_service.get_blob_to_path(CONTAINERNAME,BLOBNAME,LOCALFILE)
t2 = time.time()
print(("It takes %s seconds to download "+BLOBNAME) % (t2 - t1))

#unzip downloaded files if needed
#with zipfile.ZipFile(ZIPPEDLOCALFILE, "r") as z:
#    z.extractall(LOCALDIRECTORY)

df1 = pd.read_csv(LOCALFILE, header=0)
df1.columns = ['medallion','hack_license','vendor_id','rate_code','store_and_fwd_flag','pickup_datetime','dropoff_datetime','passenger_count','trip_time_in_secs','trip_distance','pickup_longitude','pickup_latitude','dropoff_longitude','dropoff_latitude']
print 'the size of the data is: %d rows and  %d columns' % df1.shape
```

The data is read as a data frame:

![Screenshot of the first 10 rows of data](./media/vm-do-ten-things/IPNB_data_readin.png)


### Azure Synapse Analytics and databases
Azure Synapse Analytics is an elastic data warehouse as a service with an enterprise-class SQL Server experience.

You can provision Azure Synapse Analytics by following the instructions in [this article](../../synapse-analytics/sql-data-warehouse/create-data-warehouse-portal.md). After you provision Azure Synapse Analytics, you can use [this walkthrough](/azure/architecture/data-science-process/sqldw-walkthrough) to do data upload, exploration, and modeling by using data within Azure Synapse Analytics.

#### Azure Cosmos DB
Azure Cosmos DB is a NoSQL database in the cloud. You can use it to work with documents like JSON, and to store and query the documents.

Use the following prerequisite steps to access Azure Cosmos DB from the DSVM:

1. The Azure Cosmos DB Python SDK is already installed on the DSVM. To update it, run ```pip install pydocumentdb --upgrade``` from a command prompt.
2. Create an Azure Cosmos DB account and database from the [Azure portal](https://portal.azure.com).
3. Download the Azure Cosmos DB Data Migration Tool from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=53595) and extract to a directory of your choice.
4. Import JSON data (volcano data) stored in a [public blob](https://data.humdata.org/dataset/a60ac839-920d-435a-bf7d-25855602699d/resource/7234d067-2d74-449a-9c61-22ae6d98d928/download/volcano.json) into Azure Cosmos DB with the following command parameters to the migration tool. (Use dtui.exe from the directory where you installed the Azure Cosmos DB Data Migration Tool.) Enter the source and target location with these parameters:
   
    `/s:JsonFile /s.Files:https://data.humdata.org/dataset/a60ac839-920d-435a-bf7d-25855602699d/resource/7234d067-2d74-449a-9c61-22ae6d98d928/download/volcano.json /t:DocumentDBBulk /t.ConnectionString:AccountEndpoint=https://[DocDBAccountName].documents.azure.com:443/;AccountKey=[[KEY];Database=volcano /t.Collection:volcano1`

After you import the data, you can go to Jupyter and open the notebook titled *DocumentDBSample*. It contains Python code to access Azure Cosmos DB and do some basic querying. You can learn more about Azure Cosmos DB by visiting the service's [documentation page](../../cosmos-db/index.yml).

## Use Power BI reports and dashboards 
You can visualize the Volcano JSON file from the preceding Azure Cosmos DB example in Power BI Desktop to gain visual insights into the data. Detailed steps are available in the [Power BI article](../../cosmos-db/powerbi-visualize.md). Here are the high-level steps:

1. Open Power BI Desktop and select **Get Data**. Specify the URL as: `https://cahandson.blob.core.windows.net/samples/volcano.json`.
2. You should see the JSON records imported as a list. Convert the list to a table so Power BI can work with it.
4. Expand the columns by selecting the expand (arrow) icon.
5. Notice that the location is a **Record** field. Expand the record and select only the coordinates. **Coordinate** is a list column.
6. Add a new column to convert the list coordinate column into a comma-separated **LatLong** column. Concatenate the two elements in the coordinate list field by using the formula ```Text.From([coordinates]{1})&","&Text.From([coordinates]{0})```.
7. Convert the **Elevation** column to decimal and select the **Close** and **Apply** buttons.

Instead of preceding steps, you can paste the following code. It scripts out the steps used in the Advanced Editor in Power BI to write the data transformations in a query language.

```pqfl
let
    Source = Json.Document(Web.Contents("https://cahandson.blob.core.windows.net/samples/volcano.json")),
    #"Converted to Table" = Table.FromList(Source, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    #"Expanded Column1" = Table.ExpandRecordColumn(#"Converted to Table", "Column1", {"Volcano Name", "Country", "Region", "Location", "Elevation", "Type", "Status", "Last Known Eruption", "id"}, {"Volcano Name", "Country", "Region", "Location", "Elevation", "Type", "Status", "Last Known Eruption", "id"}),
    #"Expanded Location" = Table.ExpandRecordColumn(#"Expanded Column1", "Location", {"coordinates"}, {"coordinates"}),
    #"Added Custom" = Table.AddColumn(#"Expanded Location", "LatLong", each Text.From([coordinates]{1})&","&Text.From([coordinates]{0})),
    #"Changed Type" = Table.TransformColumnTypes(#"Added Custom",{{"Elevation", type number}})
in
    #"Changed Type"
```

You now have the data in your Power BI data model. Your Power BI Desktop instance should appear as follows:

![Power BI Desktop](./media/vm-do-ten-things/PowerBIVolcanoData.png)

You can start building reports and visualizations by using the data model. You can follow the steps in [this Power BI article](../../cosmos-db/powerbi-visualize.md#build-the-reports) to build a report.

## Scale the DSVM dynamically 
You can scale up and down the DSVM to meet your project's needs. If you don't need to use the VM in the evening or on weekends, you can shut down the VM from the [Azure portal](https://portal.azure.com).

> [!NOTE]
> You incur compute charges if you use just the shutdown button for the operating system on the VM. Instead You should deallocate your DSVM using the Azure portal or Cloud Shell.
> 
> 

You might need to handle some large-scale analysis and need more CPU, memory, or disk capacity. If so, you can find a choice of VM sizes in terms of CPU cores, GPU-based instances for deep learning, memory capacity, and disk types (including solid-state drives) that meet your compute and budgetary needs. The full list of VMs, along with their hourly compute pricing, is available on the [Azure Virtual Machines pricing](https://azure.microsoft.com/pricing/details/virtual-machines/) page.


## Add more tools
Tools prebuilt into the DSVM can address many common data-analytics needs. This saves you time because you don't have to install and configure your environments one by one. It also saves you money, because you pay for only resources that you use.

You can use other Azure data and analytics services profiled in this article to enhance your analytics environment. In some cases, you might need additional tools, including some proprietary partner tools. You have full administrative access on the virtual machine to install new tools that you need. You can also install additional packages in Python and R that are not pre-installed. For Python, you can use either ```conda``` or ```pip```. For R, you can use ```install.packages()``` in the R console, or use the IDE and select **Packages** > **Install Packages**.

## Deep learning

In addition to the framework-based samples, you can get a set of comprehensive walkthroughs that have been validated on the DSVM. These walkthroughs help you jump-start your development of deep-learning applications in domains like image and text/language understanding.   


- [Running neural networks across different frameworks](https://github.com/ilkarman/DeepLearningFrameworks): This walkthrough shows how to migrate code from one framework to another. It also demonstrates how to compare models and runtime performance across frameworks. 

- [A how-to guide to build an end-to-end solution to detect products within images](https://github.com/Azure/cortana-intelligence-product-detection-from-images): Image detection is a technique that can locate and classify objects within images. This technology has the potential to bring huge rewards in many real-life business domains. For example, retailers can use this technique to determine which product a customer has picked up from the shelf. This information in turn helps stores manage product inventory. 

- [Deep learning for audio](/archive/blogs/machinelearning/hearing-ai-getting-started-with-deep-learning-for-audio-on-azure): This tutorial shows how to train a deep-learning model for audio event detection on the [urban sounds dataset](https://urbansounddataset.weebly.com/). It also provides an overview of how to work with audio data.

- [Classification of text documents](https://github.com/anargyri/lstm_han): This walkthrough demonstrates how to build and train two neural network architectures: Hierarchical Attention Network and Long Short Term Memory (LSTM) network. These neural networks use the Keras API for deep learning to classify text documents. 

## Summary
This article described some of the things you can do on the Microsoft Data Science Virtual Machine. There are many more things you can do to make the DSVM an effective analytics environment.
