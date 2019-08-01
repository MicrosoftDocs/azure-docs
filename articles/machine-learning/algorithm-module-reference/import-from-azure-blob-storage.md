---
title:  "Import from Azure Blob Storage: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn This topic describes how to use the Import from Azure Blob Storage module in Azure Machine Learning service to read data from Azure blob storage, so that you can use the data in a machine learning experiment.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 05/02/2019
ROBOTS: NOINDEX
---
# Import from Azure Blob Storage module

This article describes a module of the visual interface (preview) for Azure Machine Learning service.

Use this module to read data from Azure blob storage, so that you can use the data in a machine learning experiment.  

The Azure Blob Service is for storing large amounts of data, including binary data. Azure blobs can be accessed from anywhere, by using either HTTP or HTTPS. Authentication might be required depending on the type of blob storage. 

- Public blobs can be accessed by anyone, or by users who have a SAS URL.
- Private blobs require a login and credentials.

Importing from blob storage requires that data be stored in blobs that use the **block blob** format. The files stored in the blob must use either comma-separated (CSV) or tab-separated (TSV) formats. When you read the file, the records and any applicable attribute headings are loaded as rows into memory as a dataset.


We strongly recommend that you profile your data before importing, to make sure that the schema is as expected. The import process scans some number of head rows to determine the schema, but later rows might contain extra columns, or data that cause errors.



## Manually set properties in the Import Data module

The following steps describe how to manually configure the import source.

1. Add the **Import Data** module to your experiment. You can find this module in the interface, in the **Data Input and Output**

2. For **Data source**, select **Azure Blob Storage**.

3. For **Authentication type**, choose **Public (SAS URL)** if you know that the information has been provided as a public data source. A SAS URL is a time-bound URL for public access that you can generate by using an Azure storage utility.

    Otherwise choose **Account**.

4. If your data is in a **public** blob that can be accessed by using a SAS URL, you do not need additional credentials because the URL string contains all the information that is needed for download and authentication.

    In the **URI** field, type or paste the full URI that defines the account and the public blob.



5. If your data is in a **private** account, you must supply credentials including the account name and the key.

    - For **Account name**, type or paste the name of the account that contains the blob you want to access.

        For example, if the full URL of the storage account is `http://myshared.blob.core.windows.net`, you would type `myshared`.

    - For **Account key**, paste the storage access key that is associated with the account.

        If you don’t know the access key, see the section, “Manage your Azure storage accounts” in this article: [About Azure Storage Accounts](https://docs.microsoft.com/azure/storage/storage-create-storage-account).

6. For **Path to container, directory, or blob**, type the name of the specific blob that you want to retrieve.

    For example, if you uploaded a file named **data01.csv** to the container **trainingdata** in an account named **mymldata**, the full URL for the file would be: `http://mymldata.blob.core.windows.net/trainingdata/data01.txt`.

    Therefore, in the field  **Path to container, directory, or blob**, you would type: `trainingdata/data01.csv`

    To import multiple files, you can use the wildcard characters `*` (asterisk) or `?` (question mark).

    For example, assuming the container `trainingdata` contains multiple files of a compatible format, you could use the following specification to read all the files starting with `data`, and concatenate them into a single dataset:

    `trainingdata/data*.csv`

    You cannot use wildcards in container names. If you need to import files from multiple containers, use a separate instance of the **Import Data** module for each container, and then merge the datasets using the [Add Rows](./add-rows.md) module.

    > [!NOTE]
    > If you have selected the option, **Use cached results**, any changes that you make to the files in the container do not trigger a refresh of the data in the experiment.

7. For **Blob file format**, select an option that indicates the format of the data that is stored in the blob, so that Azure Machine Learning can process the data appropriately. The following formats are supported:

    - **CSV**: Comma-separated values (CSV) are the default storage format for exporting and importing files in Azure Machine Learning. If the data already contains a header row, be sure to select the option, **File has header row**, or the header will be treated as a data row.

       

    - **TSV**: Tab-separated values (TSV) are a format used by many machine learning tools. If the data already contains a header row, be sure to select the option, **File has header row**, or the header will be treated as a data row.

       

    - **ARFF**: This format supports importing files in the format used by the Weka toolset. 

   

8. Run the experiment.


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 