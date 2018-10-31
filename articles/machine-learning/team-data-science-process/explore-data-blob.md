---
title: Explore data in Azure blob storage with pandas | Microsoft Docs
description: How to explore data that is stored in Azure blob container using pandas.
services: machine-learning,storage
documentationcenter: ''
author: deguhath
manager: cgronlun
editor: cgronlun

ms.assetid: feaa9e54-01e0-48c8-a917-1eba0f9d9ec7
ms.service: machine-learning
ms.component: team-data-science-process
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/09/2017
ms.author: deguhath

---
# Explore data in Azure blob storage with pandas
This document covers how to explore data that is stored in Azure blob container using [pandas](http://pandas.pydata.org/) Python package.

The following **menu** links to topics that describe how to use tools to explore data from various storage environments. This task is a step in the [Data Science Process](overview.md).

[!INCLUDE [cap-explore-data-selector](../../../includes/cap-explore-data-selector.md)]

## Prerequisites
This article assumes that you have:

* Created an Azure storage account. If you need instructions, see [Create an Azure Storage account](../../storage/common/storage-quickstart-create-account.md)
* Stored your data in an Azure blob storage account. If you need instructions, see [Moving data to and from Azure Storage](../../storage/common/storage-moving-data.md)

## Load the data into a pandas DataFrame
To explore and manipulate a dataset, it must first be downloaded from the blob source to a local file, which can then be loaded in a pandas DataFrame. Here are the steps to follow for this procedure:

1. Download the data from Azure blob with the following Python code sample using blob service. Replace the variable in the following code with your specific values: 
   
        from azure.storage.blob import BlobService
        import tables
   
        STORAGEACCOUNTNAME= <storage_account_name>
        STORAGEACCOUNTKEY= <storage_account_key>
        LOCALFILENAME= <local_file_name>        
        CONTAINERNAME= <container_name>
        BLOBNAME= <blob_name>
   
        #download from blob
        t1=time.time()
        blob_service=BlobService(account_name=STORAGEACCOUNTNAME,account_key=STORAGEACCOUNTKEY)
        blob_service.get_blob_to_path(CONTAINERNAME,BLOBNAME,LOCALFILENAME)
        t2=time.time()
        print(("It takes %s seconds to download "+blobname) % (t2 - t1))
2. Read the data into a pandas DataFrame from the downloaded file.
   
        #LOCALFILE is the file path    
        dataframe_blobdata = pd.read_csv(LOCALFILE)

Now you are ready to explore the data and generate features on this dataset.

## <a name="blob-dataexploration"></a>Examples of data exploration using pandas
Here are a few examples of ways to explore data using pandas:

1. Inspect the **number of rows and columns** 
   
        print 'the size of the data is: %d rows and  %d columns' % dataframe_blobdata.shape
2. **Inspect** the first or last few **rows** in the following dataset:
   
        dataframe_blobdata.head(10)
   
        dataframe_blobdata.tail(10)
3. Check the **data type** each column was imported as using the following sample code
   
        for col in dataframe_blobdata.columns:
            print dataframe_blobdata[col].name, ':\t', dataframe_blobdata[col].dtype
4. Check the **basic stats** for the columns in the data set as follows
   
        dataframe_blobdata.describe()
5. Look at the number of entries for each column value as follows
   
        dataframe_blobdata['<column_name>'].value_counts()
6. **Count missing values** versus the actual number of entries in each column using the following sample code
   
        miss_num = dataframe_blobdata.shape[0] - dataframe_blobdata.count()
        print miss_num
7. If you have **missing values** for a specific column in the data, you can drop them as follows:
   
     dataframe_blobdata_noNA = dataframe_blobdata.dropna()
     dataframe_blobdata_noNA.shape
   
   Another way to replace missing values is with the mode function:
   
     dataframe_blobdata_mode = dataframe_blobdata.fillna({'<column_name>':dataframe_blobdata['<column_name>'].mode()[0]})        
8. Create a **histogram** plot using variable number of bins to plot the distribution of a variable    
   
        dataframe_blobdata['<column_name>'].value_counts().plot(kind='bar')
   
        np.log(dataframe_blobdata['<column_name>']+1).hist(bins=50)
9. Look at **correlations** between variables using a scatterplot or using the built-in correlation function
   
        #relationship between column_a and column_b using scatter plot
        plt.scatter(dataframe_blobdata['<column_a>'], dataframe_blobdata['<column_b>'])
   
        #correlation between column_a and column_b
        dataframe_blobdata[['<column_a>', '<column_b>']].corr()

