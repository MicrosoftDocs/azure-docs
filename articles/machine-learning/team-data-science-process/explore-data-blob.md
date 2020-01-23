---
title: Explore data in Azure blob storage with pandas - Team Data Science Process
description: How to explore data that is stored in Azure blob container using the pandas Python package.
services: machine-learning
author: marktab
manager: cgronlun
editor: cgronlun
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 11/09/2017
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---
# Explore data in Azure blob storage with pandas

This article covers how to explore data that is stored in Azure blob container using [pandas](https://pandas.pydata.org/) Python package.

This task is a step in the [Team Data Science Process](overview.md).

## Prerequisites
This article assumes that you have:

* Created an Azure storage account. If you need instructions, see [Create an Azure Storage account](../../storage/common/storage-account-create.md)
* Stored your data in an Azure blob storage account. If you need instructions, see [Moving data to and from Azure Storage](../../storage/common/storage-moving-data.md)

## Load the data into a pandas DataFrame
To explore and manipulate a dataset, it must first be downloaded from the blob source to a local file, which can then be loaded in a pandas DataFrame. Here are the steps to follow for this procedure:

1. Download the data from Azure blob with the following Python code sample using blob service. Replace the variable in the following code with your specific values:

```python
from azure.storage.blob import BlockBlobService
import tables

STORAGEACCOUNTNAME= <storage_account_name>
STORAGEACCOUNTKEY= <storage_account_key>
LOCALFILENAME= <local_file_name>
CONTAINERNAME= <container_name>
BLOBNAME= <blob_name>

#download from blob
t1=time.time()
blob_service=BlockBlobService(account_name=STORAGEACCOUNTNAME,account_key=STORAGEACCOUNTKEY)
blob_service.get_blob_to_path(CONTAINERNAME,BLOBNAME,LOCALFILENAME)
t2=time.time()
print(("It takes %s seconds to download "+blobname) % (t2 - t1))
```

1. Read the data into a pandas DataFrame from the downloaded file.

```python
# LOCALFILE is the file path
dataframe_blobdata = pd.read_csv(LOCALFILE)
```

Now you are ready to explore the data and generate features on this dataset.

## <a name="blob-dataexploration"></a>Examples of data exploration using pandas
Here are a few examples of ways to explore data using pandas:

1. Inspect the **number of rows and columns**

```python
print 'the size of the data is: %d rows and  %d columns' % dataframe_blobdata.shape
```

1. **Inspect** the first or last few **rows** in the following dataset:

```python
dataframe_blobdata.head(10)

dataframe_blobdata.tail(10)
```

1. Check the **data type** each column was imported as using the following sample code

```python
for col in dataframe_blobdata.columns:
    print dataframe_blobdata[col].name, ':\t', dataframe_blobdata[col].dtype
```

1. Check the **basic stats** for the columns in the data set as follows

```python
dataframe_blobdata.describe()
```

1. Look at the number of entries for each column value as follows

```python
dataframe_blobdata['<column_name>'].value_counts()
```

1. **Count missing values** versus the actual number of entries in each column using the following sample code

```python
miss_num = dataframe_blobdata.shape[0] - dataframe_blobdata.count()
print miss_num
```

1. If you have **missing values** for a specific column in the data, you can drop them as follows:

```python
dataframe_blobdata_noNA = dataframe_blobdata.dropna()
dataframe_blobdata_noNA.shape
```

Another way to replace missing values is with the mode function:

```python
dataframe_blobdata_mode = dataframe_blobdata.fillna(
    {'<column_name>': dataframe_blobdata['<column_name>'].mode()[0]})
```

1. Create a **histogram** plot using variable number of bins to plot the distribution of a variable

```python
dataframe_blobdata['<column_name>'].value_counts().plot(kind='bar')

np.log(dataframe_blobdata['<column_name>']+1).hist(bins=50)
```

1. Look at **correlations** between variables using a scatterplot or using the built-in correlation function

```python
# relationship between column_a and column_b using scatter plot
plt.scatter(dataframe_blobdata['<column_a>'], dataframe_blobdata['<column_b>'])

# correlation between column_a and column_b
dataframe_blobdata[['<column_a>', '<column_b>']].corr()
```
