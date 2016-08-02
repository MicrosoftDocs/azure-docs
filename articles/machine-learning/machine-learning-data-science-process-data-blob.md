<properties 
	pageTitle="Process Azure blob data with advanced analytics | Microsoft Azure" 
	description="Process Data in Azure Blob storage." 
	services="machine-learning,storage" 
	documentationCenter="" 
	authors="bradsev" 
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/14/2016"
	ms.author="sunliangms;fashah;garye;bradsev" /> 

#<a name="heading"></a>Process Azure blob data with advanced analytics

This document covers exploring data and generating features from data stored in Azure Blob storage. 

## Load the data into a Pandas data frame
In order to do explore and manipulate a dataset, it must be downloaded from the blob source to a local file which can then be loaded in a Pandas data frame. Here are the steps to follow for this procedure:

1. Download the data from Azure blob with the following sample Python code using blob service. Replace the variable in the code below with your specific values: 

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


2. Read the data into a Pandas data-frame from the downloaded file.

	    #LOCALFILE is the file path	
    	dataframe_blobdata = pd.read_csv(LOCALFILE)

Now you are ready to explore the data and generate features on this dataset.


##<a name="blob-dataexploration"></a>Data Exploration

Here are a few examples of ways to explore data using Pandas:

1. Inspect the number of rows and columns 

		print 'the size of the data is: %d rows and  %d columns' % dataframe_blobdata.shape

2. Inspect the first or last few rows in the dataset as below:

		dataframe_blobdata.head(10)
		
		dataframe_blobdata.tail(10)

3. Check the data type each column was imported as using the following sample code
 	
		for col in dataframe_blobdata.columns:
		    print dataframe_blobdata[col].name, ':\t', dataframe_blobdata[col].dtype

4. Check the basic stats for the columns in the data set as follows
 
		dataframe_blobdata.describe()
	
5. Look at the number of entries for each column value as follows

		dataframe_blobdata['<column_name>'].value_counts()

6. Count missing values versus the actual number of entries in each column using the following sample code

		miss_num = dataframe_blobdata.shape[0] - dataframe_blobdata.count()
		print miss_num
	 
7.	If you have missing values for a specific column in the data, you can drop them as follows:

		dataframe_blobdata_noNA = dataframe_blobdata.dropna()
		dataframe_blobdata_noNA.shape

	Another way to replace missing values is with the mode function:
	
		dataframe_blobdata_mode = dataframe_blobdata.fillna({'<column_name>':dataframe_blobdata['<column_name>'].mode()[0]})		

8. Create a histogram plot using variable number of bins to plot the distribution of a variable	
	
		dataframe_blobdata['<column_name>'].value_counts().plot(kind='bar')
		
		np.log(dataframe_blobdata['<column_name>']+1).hist(bins=50)
	
9. Look at correlations between variables using a scatterplot or using the built-in correlation function

		#relationship between column_a and column_b using scatter plot
		plt.scatter(dataframe_blobdata['<column_a>'], dataframe_blobdata['<column_b>'])
		
		#correlation between column_a and column_b
		dataframe_blobdata[['<column_a>', '<column_b>']].corr()
	
	
##<a name="blob-featuregen"></a>Feature Generation
	
We can generate features using Python as follows:

###<a name="blob-countfeature"></a>Indicator value based Feature Generation

Categorical features can be created as follows:

1. Inspect the distribution of the categorical column:
	
		dataframe_blobdata['<categorical_column>'].value_counts()

2. Generate indicator values for each of the column values

		#generate the indicator column
		dataframe_blobdata_identity = pd.get_dummies(dataframe_blobdata['<categorical_column>'], prefix='<categorical_column>_identity')

3. Join the indicator column with the original data frame 
 
			#Join the dummy variables back to the original data frame
			dataframe_blobdata_with_identity = dataframe_blobdata.join(dataframe_blobdata_identity)

4. Remove the original variable itself:

		#Remove the original column rate_code in df1_with_dummy
		dataframe_blobdata_with_identity.drop('<categorical_column>', axis=1, inplace=True)
	
###<a name="blob-binningfeature"></a>Binning Feature Generation

For generating binned features, we proceed as follows:

1. Add a sequence of columns to bin a numeric column
 
		bins = [0, 1, 2, 4, 10, 40]
		dataframe_blobdata_bin_id = pd.cut(dataframe_blobdata['<numeric_column>'], bins)
		
2. Convert binning to a sequence of boolean variables

		dataframe_blobdata_bin_bool = pd.get_dummies(dataframe_blobdata_bin_id, prefix='<numeric_column>')
	
3. Finally, Join the dummy variables back to the original data frame

		dataframe_blobdata_with_bin_bool = dataframe_blobdata.join(dataframe_blobdata_bin_bool)	


##<a name="sql-featuregen"></a>Writing data back to Azure blob and consuming in Azure Machine Learning

After you have explored the data and created the necessary features, you can upload the data (sampled or featurized) to an Azure blob and consume it in Azure Machine Learning using the following steps:
Note that additional features can be created in the Azure Machine Learning Studio as well. 
1. Write the data frame to local file

		dataframe.to_csv(os.path.join(os.getcwd(),LOCALFILENAME), sep='\t', encoding='utf-8', index=False)

2. Upload the data to Azure blob as follows:

		from azure.storage.blob import BlobService
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
		    print ("Something went wrong with uploading blob:"+BLOBNAME)

3. Now the data can be read from the blob using the Azure Machine Learning [Import Data][import-data] module as shown in the screen below:
 
![reader blob][1]

[1]: ./media/machine-learning-data-science-process-data-blob/reader_blob.png


<!-- Module References -->
[import-data]: https://msdn.microsoft.com/library/azure/4e1b0fe6-aded-4b3f-a36f-39b8862b9004/
 