<properties 
	pageTitle="Sample data in Azure Blob Storage| Azure" 
	description="Sample data in Azure Blob Storage" 
	services="machine-learning" 
	documentationCenter="" 
	authors="msolhab" 
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/21/2015" 
	ms.author="sunliangms;fashah;msolhab;garye" /> 

#<a name="heading"></a>Sample Data in Azure Blob Storage

This document covers sampling data stored in Azure Blob Storage by downloading it programmatically and then sampling it with sample Python code. The steps to do so are as follows:

1. Download the data from Azure blob storage using the blob service from the following sample Python code: 

	    from azure.storage import BlobService
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

2. Read data into a Pandas data-frame from the file downloaded above.

		import pandas as pd

	    #directly ready from file on disk
    	dataframe_blobdata = pd.read_csv(LOCALFILE)

3. Sample the data using the `numpy`'s `random.choice` as follows:

	    # A 1 percent sample
    	sample_ratio = 0.01 
    	sample_size = np.round(dataframe_blobdata.shape[0] * sample_ratio)
    	sample_rows = np.random.choice(dataframe_blobdata.index.values, sample_size)
    	dataframe_blobdata_sample = dataframe_blobdata.ix[sample_rows]

	Now you can work with the above data frame with the 1 Percent sample for further exploration and feature generation.

##<a name="heading"></a>Connecting to Azure Machine Learning

You can use the following sample code to down-sample the data and use it directly in Azure ML:

1. Write the data frame to a local file

		dataframe.to_csv(os.path.join(os.getcwd(),LOCALFILENAME), sep='\t', encoding='utf-8', index=False)

2. Upload the local file to an Azure blob using the following sample code:

		from azure.storage import BlobService
    	import tables

		STORAGEACCOUNTNAME= <storage_account_name>
		LOCALFILENAME= <local_file_name>
		STORAGEACCOUNTKEY= <storage_account_key>
		CONTAINERNAME= <container_name>
		BLOBNAME= <blob_name>

	    output_blob_service=BlobService(account_name=STORAGEACCOUNTNAME,account_key=STORAGEACCOUNTKEY)    
	    localfileprocessed = os.path.join(os.getcwd(),LOCALFILENAME) #assuming file is in current working directory
	    
	    try:
	   
	    #perform upload
	    output_blob_service.put_block_blob_from_path(CONTAINERNAME,BLOBNAME,localfileprocessed)
	    
	    except:	        
		    print ("Something went wrong with uploading to the blob:"+ BLOBNAME)

3. Read the data from the Azure blob using Azure ML [Reader][reader] as shown in the image below:
 
![reader blob][1]

[1]: ./media/machine-learning-data-science-sample-data-blob/reader_blob.png


<!-- Module References -->
[reader]: https://msdn.microsoft.com/library/azure/4e1b0fe6-aded-4b3f-a36f-39b8862b9004/
