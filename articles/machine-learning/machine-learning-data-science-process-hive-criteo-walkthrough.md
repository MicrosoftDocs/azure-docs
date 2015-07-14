<properties 
	pageTitle="Advanced Analytics Process and Technology in Action: Use Hadoop clusters on the 1 TB Criteo dataset | Microsoft Azure" 
	description="Using the Advanced Analytics Process and Technology (ADAPT) for an end-to-end scenario employing an HDInsight Hadoop cluster to build and deploy a model using a large (1 TB) publicly available dataset" 
	metaKeywords="" 
	services="machine-learning,hdinsight" 
	solutions="" 
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
	ms.date="05/27/2015" 
	ms.author="ginathan;mohabib;bradsev" /> 

# Advanced Analytics Process and Technology in Action - Using Azure HDInsight Hadoop Clusters on a 1 TB dataset

In this walkthrough, we demonstrate using the Advanced Analytics Process and Technology (ADAPT) end-to-end with an [Azure HDInsight Hadoop cluster](http://azure.microsoft.com/services/hdinsight/) to store, explore, feature engineer, and down sample data from one of the publicly available [Criteo](http://labs.criteo.com/downloads/download-terabyte-click-logs/) datasets. We use Azure Machine Learning to build binary classification and regression models against this data. We also shows how to publish one of these models as a Web service.

It is also possible to use an iPython notebook to accomplish the tasks presented in this walkthrough. Users who would like to try this approach should consult the [Criteo walkthrough using a Hive ODBC connection](https://github.com/Azure/Azure-MachineLearning-DataScience/blob/master/Misc/DataScienceProcess/iPythonNotebooks/machine-Learning-data-science-process-hive-walkthrough-criteo.ipynb) topic.


## <a name="dataset"></a>Criteo Dataset Description

The Criteo data is a click prediction dataset that is approximately 370GB of gzip compressed TSV files (~1.3TB uncompressed), comprising more than 4.3 billion records. It is taken from 24 days of click data made available by [Criteo](http://labs.criteo.com/downloads/download-terabyte-click-logs/). For the convenience of data scientists, we have unzipped data available to us to experiment with.

Each record in this dataset contains 40 columns: 

- the first column is a label column that indicates whether a user clicks on an add (value 1) or does not click (value 0) 
- next 13 columns are numeric, and 
- last 26 are categorical columns 

The columns are anonymized and use a series of enumerated names: "Col1" (for the label column) to 'Col40" (for the last categorical column).            

Here is an excerpt of the first 20 columns of two observations (rows) from this dataset:

	Col1	Col2	Col3	Col4	Col5	Col6	Col7	Col8	Col9	Col10	Col11	Col12	Col13	Col14	Col15			Col16			Col17			Col18			Col19		Col20	

	0       40      42      2       54      3       0       0       2       16      0       1       4448    4       1acfe1ee        1b2ff61f        2e8b2631        6faef306        c6fc10d3    6fcd6dcb           
	0               24              27      5               0       2       1               3       10064           9a8cb066        7a06385f        417e6103        2170fc56        acf676aa    6fcd6dcb                      

There are missing values in both the numeric and categorical columns in this dataset. We describe a simple method for handling the missing values below. Additional details of the data are explored below when we store them into Hive tables.

**Definition:** *Clickthrough rate (CTR):* This is the percentage of clicks in the data. In this Criteo dataset, the CTR is about 3.3% or 0.033.

## <a name="mltasks"></a>Examples of prediction tasks
Two sample prediction problems are addressed in this walkthrough:

1. **Binary classification**: Predicts whether or not a user clicked on an add:
	- Class 0: No Click
	- Class 1: Click

2. **Regression**: Predicts the probability of an ad click from user features.


## <a name="setup"></a>Set Up an HDInsight Hadoop cluster for data science

**Note:** This is typically an **Admin** task.

Set up your Azure Data Science environment for building predictive analytics solutions with HDInsight clusters in three steps:

1. [Create a storage account](../storage-whatis-account.md): This storage account is used to store data in Azure Blob Storage. The data used in HDInsight clusters is stored here.

2. [Customize Azure HDInsight Hadoop Clusters for Data Science](machine-learning-data-science-customize-hadoop-cluster.md): This step creates an Azure HDInsight Hadoop cluster with 64-bit Anaconda Python 2.7 installed on all nodes. There are two important steps (described in this topic) to complete when customizing the HDInsight cluster.

	* You must link the storage account created in step 1 with your HDInsight cluster when it is created. This storage account is used for accessing data that can be processed within the cluster.

	* You must enable Remote Access to the head node of the cluster after it is created. Remember the remote access credentials you specify here (different from those specified for the cluster at its creation): you will need them below.

3. [Create an Azure ML workspace](machine-learning-create-workspace.md): This Azure Machine Learning workspace is used for building machine learning models after an initial data exploration and down sampling on the HDInsight cluster.

## <a name="getdata"></a>Get and consume data from a public source

The [Criteo](http://labs.criteo.com/downloads/download-terabyte-click-logs/) dataset can be accessed by clicking on the link, accepting the terms of use, and providing a name. A snapshot of what this looks like is shown below:

![Accept Criteo terms](http://i.imgur.com/hLxfI2E.png)

Click on **Continue to Download** to read more about the dataset and its availability.

The data resides in a public [Azure blob storage](../storage-dotnet-how-to-use-blobs.md) location: wasb://criteo@azuremlsampleexperiments.blob.core.windows.net/raw/. The "wasb" refers to Azure Blob Storage location. 

1. The data in this public blob storage consists of three sub-folders of unzipped data.
		
	1. The sub-folder *raw/count/* contains the first 21 days of data - from day\_00 to day\_20
	2. The sub-folder *raw/train/* consists of a single day of data, day\_21
	3. The sub-folder *raw/test/* consists of two days of data, day\_22 and day\_23

2. For those who want to start with the raw gzip data, these are also available in the main folder *raw/* as day_NN.gz, where NN goes from 00 to 23.

An alternative approach to access, explore, and model this data that does not require any local downloads is explained later in this walkthrough when we create Hive tables.

## <a name="login"></a>Log into the cluster headnode

To login to the headnode of the cluster, use the [Azure Management](manage.windowsazure.com) portal to locate the cluster. Click on the HDInsight elephant icon on the left and then double click on the name of your cluster. Navigate to the **Configuration** tab, double click on the CONNECT icon on the bottom of the page, and enter your remote access credentials when prompted. This takes you to the headnode of the cluster. 

Here is what a typical first login to the cluster headnode looks like:

![Login to cluster](http://i.imgur.com/Yys9Vvm.png)

On the left, we see the "Hadoop Command Line", which will be our workhorse for the data exploration. We also see two useful URLs - "Hadoop Yarn Status" and "Hadoop Name Node". The yarn status URL shows job progress and the name node URL gives details on the cluster configuration. 

Now we are set up and ready to begin first part of the walkthrough: data exploration using Hive and getting data ready for Azure Machine Learning. 

## <a name="hive-db-tables"></a> Create Hive database and tables

To create Hive tables for our Criteo dataset, open the ***Hadoop Command Line*** on the desktop of the head node, and enter the Hive directory by entering the command

    cd %hive_home%\bin

**IMPORTANT NOTE**: **Run all Hive commands in this walkthrough from the above Hive bin/ directory prompt. This will take care of any path issues automatically. We will use the terms "Hive directory prompt", "Hive bin/ directory prompt",  and "Hadoop Command Line" interchangeably.** 

**IMPORTANT NOTE 2**: **To execute any Hive query, one can always do the following** 
		cd %hive_home%\bin
		hive

After the Hive REPL appears with a "hive >"sign, simply cut and paste the query to execute it.

The code below creates a database "criteo" and then generates 4 tables: 


* a *count table* built on days day\_00 to day\_20, 
* a *train table* built on day\_21, and 
* two *test tables* on day\_22 ans day\_23 respectively. 

We split our test dataset into two different tables because one of the days is a holiday, and we want to determine if the model can detect differences between a holiday and non-holiday from the clickthrough rate.

The script [sample&#95;hive&#95;create&#95;criteo&#95;database&#95;and&#95;tables.hql](https://github.com/Azure/Azure-MachineLearning-DataScience/blob/master/Misc/DataScienceProcess/DataScienceScripts/sample_hive_create_criteo_database_and_tables.hql) is displayed below for convenience:

	CREATE DATABASE IF NOT EXISTS criteo;
	DROP TABLE IF EXISTS criteo.criteo_count;
	CREATE TABLE criteo.criteo_count (
	col1 string,col2 double,col3 double,col4 double,col5 double,col6 double,col7 double,col8 double,col9 double,col10 double,col11 double,col12 double,col13 double,col14 double,col15 string,col16 string,col17 string,col18 string,col19 string,col20 string,col21 string,col22 string,col23 string,col24 string,col25 string,col26 string,col27 string,col28 string,col29 string,col30 string,col31 string,col32 string,col33 string,col34 string,col35 string,col36 string,col37 string,col38 string,col39 string,col40 string)
	ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
	LINES TERMINATED BY '\n'
	STORED AS TEXTFILE LOCATION 'wasb://criteo@azuremlsampleexperiments.blob.core.windows.net/raw/count';

	DROP TABLE IF EXISTS criteo.criteo_train;
	CREATE TABLE criteo.criteo_train (
	col1 string,col2 double,col3 double,col4 double,col5 double,col6 double,col7 double,col8 double,col9 double,col10 double,col11 double,col12 double,col13 double,col14 double,col15 string,col16 string,col17 string,col18 string,col19 string,col20 string,col21 string,col22 string,col23 string,col24 string,col25 string,col26 string,col27 string,col28 string,col29 string,col30 string,col31 string,col32 string,col33 string,col34 string,col35 string,col36 string,col37 string,col38 string,col39 string,col40 string)
	ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
	LINES TERMINATED BY '\n'
	STORED AS TEXTFILE LOCATION 'wasb://criteo@azuremlsampleexperiments.blob.core.windows.net/raw/train';

	DROP TABLE IF EXISTS criteo.criteo_test_day_22;
	CREATE TABLE criteo.criteo_test_day_22 (
	col1 string,col2 double,col3 double,col4 double,col5 double,col6 double,col7 double,col8 double,col9 double,col10 double,col11 double,col12 double,col13 double,col14 double,col15 string,col16 string,col17 string,col18 string,col19 string,col20 string,col21 string,col22 string,col23 string,col24 string,col25 string,col26 string,col27 string,col28 string,col29 string,col30 string,col31 string,col32 string,col33 string,col34 string,col35 string,col36 string,col37 string,col38 string,col39 string,col40 string)
	ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
	LINES TERMINATED BY '\n'
	STORED AS TEXTFILE LOCATION 'wasb://criteo@azuremlsampleexperiments.blob.core.windows.net/raw/test/day_22';

	DROP TABLE IF EXISTS criteo.criteo_test_day_23;
	CREATE TABLE criteo.criteo_test_day_23 (
	col1 string,col2 double,col3 double,col4 double,col5 double,col6 double,col7 double,col8 double,col9 double,col10 double,col11 double,col12 double,col13 double,col14 double,col15 string,col16 string,col17 string,col18 string,col19 string,col20 string,col21 string,col22 string,col23 string,col24 string,col25 string,col26 string,col27 string,col28 string,col29 string,col30 string,col31 string,col32 string,col33 string,col34 string,col35 string,col36 string,col37 string,col38 string,col39 string,col40 string)
	ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
	LINES TERMINATED BY '\n'
	STORED AS TEXTFILE LOCATION 'wasb://criteo@azuremlsampleexperiments.blob.core.windows.net/raw/test/day_23';

We note that all these tables are external as we simply point to Azure Blob Storage (wasb) locations. 

**There are two ways to execute ANY Hive query that we now mention.**

1. **Using the Hive REPL command-line**: The first is to issue a "hive" command and copy and paste the above query at the Hive REPL command-line. To do this, do:

		cd %hive_home%\bin
		hive

 	Now at the REPL command-line, cutting and pasting the query executes it.

2. **Saving queries to a file and executing the command**: The second is to save the queries to a .hql file ([sample&#95;hive&#95;create&#95;criteo&#95;database&#95;and&#95;tables.hql](https://github.com/Azure/Azure-MachineLearning-DataScience/blob/master/Misc/DataScienceProcess/DataScienceScripts/sample_hive_create_criteo_database_and_tables.hql)) and then issue the following command to execute the query:

		hive -f C:\temp\sample_hive_create_criteo_database_and_tables.hql


### Confirm database and table creation

Next, we confirm the creation of the database by issuing the command below from the Hive bin/ directory prompt:

		hive -e "show databases;"

This gives:

		criteo
		default
		Time taken: 1.25 seconds, Fetched: 2 row(s)

This confirms the creation of the new database, "criteo".

To see what tables we created, we simply issue the command below from the Hive bin/ directory prompt:

		hive -e "show tables in criteo;"

We then see the following output:

		criteo_count
		criteo_test_day_22
		criteo_test_day_23
		criteo_train
		Time taken: 1.437 seconds, Fetched: 4 row(s)

##<a name="exploration"></a> Data exploration in Hive

Now we are ready to do some basic data exploration in Hive. We begin by counting the number of examples in the train and test data tables.

### Number of train examples

The contents of [sample&#95;hive&#95;count&#95;train&#95;table&#95;examples.hql](https://github.com/Azure/Azure-MachineLearning-DataScience/blob/master/Misc/DataScienceProcess/DataScienceScripts/sample_hive_count_train_table_examples.hql) are shown below:

		SELECT COUNT(*) FROM criteo.criteo_train;

This yields:

		192215183
		Time taken: 264.154 seconds, Fetched: 1 row(s)

Alternatively, one may also issue the command below from the Hive bin/ directory prompt:

		hive -f C:\temp\sample_hive_count_criteo_train_table_examples.hql

### Number of test examples in the two test datasets

We now count the number of examples in the two test datasets. The contents of [sample&#95;hive&#95;count&#95;criteo&#95;test&#95;day&#95;22&#95;table&#95;examples.hql](https://github.com/Azure/Azure-MachineLearning-DataScience/blob/master/Misc/DataScienceProcess/DataScienceScripts/sample_hive_count_criteo_test_day_22_table_examples.hql) are below:

		SELECT COUNT(*) FROM criteo.criteo_test_day_22;

This yields:
	
		189747893
		Time taken: 267.968 seconds, Fetched: 1 row(s)

As usual, we may also call the script from the Hive bin/ directory prompt by issuing the below command:

		hive -f C:\temp\sample_hive_count_criteo_test_day_22_table_examples.hql

Finally, we examine the number of test examples in the test dataset based on day\_23.

The command to do this is similar to the above (refer to [sample&#95;hive&#95;count&#95;criteo&#95;test&#95;day&#95;23&#95;examples.hql](https://github.com/Azure/Azure-MachineLearning-DataScience/blob/master/Misc/DataScienceProcess/DataScienceScripts/sample_hive_count_criteo_test_day_23_examples.hql)):

		SELECT COUNT(*) FROM criteo.criteo_test_day_23;

This gives:
	
		178274637
		Time taken: 253.089 seconds, Fetched: 1 row(s)

### Label distribution in the train dataset

The label distribution in the train dataset is of interest. To see this, we show contents of [sample&#95;hive&#95;criteo&#95;label&#95;distribution&#95;train&#95;table.hql](https://github.com/Azure/Azure-MachineLearning-DataScience/blob/master/Misc/DataScienceProcess/DataScienceScripts/sample_hive_criteo_label_distribution_train_table.hql):

		SELECT Col1, COUNT(*) AS CT FROM criteo.criteo_train GROUP BY Col1;

This yields the label distribution:

		1       6292903
		0       185922280
		Time taken: 459.435 seconds, Fetched: 2 row(s)

Note that the percentage of positive labels is about 3.3% (consistent with the original dataset).
		
### Histogram distributions of some numeric variables in the train dataset

We can use Hive's native "histogram\_numeric" function to find out what the distribution of the numeric variables looks like. The contents of [sample&#95;hive&#95;criteo&#95;histogram&#95;numeric.hql](https://github.com/Azure/Azure-MachineLearning-DataScience/blob/master/Misc/DataScienceProcess/DataScienceScripts/sample_hive_criteo_histogram_numeric.hql) are as below:

		SELECT CAST(hist.x as int) as bin_center, CAST(hist.y as bigint) as bin_height FROM 
			(SELECT
            histogram_numeric(col2, 20) as col2_hist
            FROM
            criteo.criteo_train
			) a
            LATERAL VIEW explode(col2_hist) exploded_table as hist;

This yields the following:

		26      155878415
		2606    92753
		6755    22086
		11202   6922
		14432   4163
		17815   2488
		21072   1901
		24113   1283
		27429   1225
		30818   906
		34512   723
		38026   387
		41007   290
		43417   312
		45797   571
		49819   428
		53505   328
		56853   527
		61004   160
		65510   3446
		Time taken: 317.851 seconds, Fetched: 20 row(s)

The LATERAL VIEW - explode combination in Hive serves to produce a SQL-like output instead of the usual list. Note that in the above table, the first column corresponds to the bin center and the second to the bin frequency.

### Approximate percentiles of some numeric variables in the train dataset

Also of interest with numeric variables is the computation of approximate percentiles. Hive's native "percentile\_approx" does this for us. The contents of [sample&#95;hive&#95;criteo&#95;approximate&#95;percentiles.hql](https://github.com/Azure/Azure-MachineLearning-DataScience/blob/master/Misc/DataScienceProcess/DataScienceScripts/sample_hive_criteo_approximate_percentiles.hql) are:

		SELECT MIN(Col2) AS Col2_min, PERCENTILE_APPROX(Col2, 0.1) AS Col2_01, PERCENTILE_APPROX(Col2, 0.3) AS Col2_03, PERCENTILE_APPROX(Col2, 0.5) AS Col2_median, PERCENTILE_APPROX(Col2, 0.8) AS Col2_08, MAX(Col2) AS Col2_max FROM criteo.criteo_train;

This yields:

		1.0     2.1418600917169246      2.1418600917169246    6.21887086390288 27.53454893115633       65535.0
		Time taken: 564.953 seconds, Fetched: 1 row(s)

We remark that the distribution of percentiles is closely related to the histogram distribution of any numeric variable usually. 		

### Find number of unique values for some categorical columns in the train dataset

Continuing the data exploration, we now find, for some categorical columns, the number of unique values they take. To do this, we show contents of [sample&#95;hive&#95;criteo&#95;unique&#95;values&#95;categoricals.hql](https://github.com/Azure/Azure-MachineLearning-DataScience/blob/master/Misc/DataScienceProcess/DataScienceScripts/sample_hive_criteo_unique_values_categoricals.hql):

		SELECT COUNT(DISTINCT(Col15)) AS num_uniques FROM criteo.criteo_train;

This yields:

		19011825
		Time taken: 448.116 seconds, Fetched: 1 row(s)

We note that Col15 has 19M unique values! Using naive techniques like "one-hot encoding" to encode such high-dimensional categorical variables is infeasible. In particular, we explain and demonstrate a powerful, robust technique called [Learning With Counts](http://blogs.technet.com/b/machinelearning/archive/2015/02/17/big-learning-made-easy-with-counts.aspx) for tackling this problem efficiently. 

We end this sub-section by looking at the number of unique values for some other categorical columns as well. The contents of [sample&#95;hive&#95;criteo&#95;unique&#95;values&#95;multiple&#95;categoricals.hql](https://github.com/Azure/Azure-MachineLearning-DataScience/blob/master/Misc/DataScienceProcess/DataScienceScripts/sample_hive_criteo_unique_values_multiple_categoricals.hql) are:

		SELECT COUNT(DISTINCT(Col16)), COUNT(DISTINCT(Col17)), 
		COUNT(DISTINCT(Col18), COUNT(DISTINCT(Col19), COUNT(DISTINCT(Col20))
		FROM criteo.criteo_train;

This yields: 

		30935   15200   7349    20067   3
		Time taken: 1933.883 seconds, Fetched: 1 row(s)

Again we see that except for Col20, all the other columns have many unique values. 

### Co-occurence counts of pairs of categorical variables in the train dataset

The co-occurence counts of pairs of categorical variables is also of interest. This can be determined using the code in [sample&#95;hive&#95;criteo&#95;paired&#95;categorical&#95;counts.hql](https://github.com/Azure/Azure-MachineLearning-DataScience/blob/master/Misc/DataScienceProcess/DataScienceScripts/sample_hive_criteo_paired_categorical_counts.hql):

		SELECT Col15, Col16, COUNT(*) AS paired_count FROM criteo.criteo_train GROUP BY Col15, Col16 ORDER BY paired_count DESC LIMIT 15;

We reverse order the counts by their occurrence and look at the top 15 in this case. This gives us:

		ad98e872        cea68cd3        8964458
		ad98e872        3dbb483e        8444762
		ad98e872        43ced263        3082503
		ad98e872        420acc05        2694489
		ad98e872        ac4c5591        2559535
		ad98e872        fb1e95da        2227216
		ad98e872        8af1edc8        1794955
		ad98e872        e56937ee        1643550
		ad98e872        d1fade1c        1348719
		ad98e872        977b4431        1115528
		e5f3fd8d        a15d1051        959252
		ad98e872        dd86c04a        872975
		349b3fec        a52ef97d        821062
		e5f3fd8d        a0aaffa6        792250
		265366bf        6f5c7c41        782142
		Time taken: 560.22 seconds, Fetched: 15 row(s)

## <a name="downsample"></a> Down sample the datasets for Azure Machine Learning

Having explored the datasets and demonstrated how we may do this type of exploration for any variables (including combinations), we now down sample the data sets so that we can build models in Azure Machine Learning. Recall that the problem we focus on is: given a set of example attributes (feature values from Col2 - Col40), we predict if Col1 is a 0 (no click) or a 1 (click). 

To down sample our train and test datasets to 1% of the original size, we use Hive's native RAND() function. The next script, [sample&#95;hive&#95;criteo&#95;downsample&#95;train&#95;dataset.hql](https://github.com/Azure/Azure-MachineLearning-DataScience/blob/master/Misc/DataScienceProcess/DataScienceScripts/sample_hive_criteo_downsample_train_dataset.hql) does this for the train dataset:

		CREATE TABLE criteo.criteo_train_downsample_1perc (
		col1 string,col2 double,col3 double,col4 double,col5 double,col6 double,col7 double,col8 double,col9 double,col10 double,col11 double,col12 double,col13 double,col14 double,col15 string,col16 string,col17 string,col18 string,col19 string,col20 string,col21 string,col22 string,col23 string,col24 string,col25 string,col26 string,col27 string,col28 string,col29 string,col30 string,col31 string,col32 string,col33 string,col34 string,col35 string,col36 string,col37 string,col38 string,col39 string,col40 string)
		ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
		LINES TERMINATED BY '\n'
		STORED AS TEXTFILE;

		---Now downsample and store in this table

		INSERT OVERWRITE TABLE criteo.criteo_train_downsample_1perc SELECT * FROM criteo.criteo_train WHERE RAND() <= 0.01;

This yields:

		Time taken: 12.22 seconds
		Time taken: 298.98 seconds

The script [sample&#95;hive&#95;criteo&#95;downsample&#95;test&#95;day&#95;22&#95;dataset.hql](https://github.com/Azure/Azure-MachineLearning-DataScience/blob/master/Misc/DataScienceProcess/DataScienceScripts/sample_hive_criteo_downsample_test_day_22_dataset.hql) does it for test data, day\_22:

		--- Now for test data (day_22)

		CREATE TABLE criteo.criteo_test_day_22_downsample_1perc (
		col1 string,col2 double,col3 double,col4 double,col5 double,col6 double,col7 double,col8 double,col9 double,col10 double,col11 double,col12 double,col13 double,col14 double,col15 string,col16 string,col17 string,col18 string,col19 string,col20 string,col21 string,col22 string,col23 string,col24 string,col25 string,col26 string,col27 string,col28 string,col29 string,col30 string,col31 string,col32 string,col33 string,col34 string,col35 string,col36 string,col37 string,col38 string,col39 string,col40 string)
		ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
		LINES TERMINATED BY '\n'
		STORED AS TEXTFILE;

		INSERT OVERWRITE TABLE criteo.criteo_test_day_22_downsample_1perc SELECT * FROM criteo.criteo_test_day_22 WHERE RAND() <= 0.01;

This yields:

		Time taken: 1.22 seconds
		Time taken: 317.66 seconds


Finally, the script [sample&#95;hive&#95;criteo&#95;downsample&#95;test&#95;day&#95;23&#95;dataset.hql](https://github.com/Azure/Azure-MachineLearning-DataScience/blob/master/Misc/DataScienceProcess/DataScienceScripts/sample_hive_criteo_downsample_test_day_23_dataset.hql) does it for test data, day\_23:

		--- Finally test data day_23
		CREATE TABLE criteo.criteo_test_day_23_downsample_1perc (
		col1 string,col2 double,col3 double,col4 double,col5 double,col6 double,col7 double,col8 double,col9 double,col10 double,col11 double,col12 double,col13 double,col14 double,col15 string,col16 string,col17 string,col18 string,col19 string,col20 string,col21 string,col22 string,col23 string,col24 string,col25 string,col26 string,col27 string,col28 string,col29 string,col30 string,col31 string,col32 string,col33 string,col34 string,col35 string,col36 string,col37 string,col38 string,col39 string,col40 string)
		ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
		LINES TERMINATED BY '\n'
		STORED AS TEXTFILE;

		INSERT OVERWRITE TABLE criteo.criteo_test_day_23_downsample_1perc SELECT * FROM criteo.criteo_test_day_23 WHERE RAND() <= 0.01;

This yields:

		Time taken: 1.86 seconds
		Time taken: 300.02 seconds

With this, we are ready to use our down sampled train and test datasets for building models in Azure Machine Learning.

There is a final important component before we move on to Azure Machine Learning, which is concerns the count table. In the next sub-section, we discuss this in some detail.

##<a name="count"></a> A brief discussion on the count table

As we saw, several categorical variables have a very high dimensionality. In our walkthrough, we present a powerful technique called [Learning With Counts](http://blogs.technet.com/b/machinelearning/archive/2015/02/17/big-learning-made-easy-with-counts.aspx) to encode these variables in an efficient, robust manner. More information on this technique is in the link provided. 

**Note:** In this walkthrough, we focus on using count tables to produce compact representations of high-dimensional categorical features. This is certainly not the only way to encode categorical features ; for more information on other techniques, interested users can check out [one-hot-encoding](http://en.wikipedia.org/wiki/One-hot) and [feature hashing](http://en.wikipedia.org/wiki/Feature_hashing). 

To build count tables on the count data, we use the data in the folder raw/count. In the modeling section, we show users how to build these count tables for categorical features from scratch, or alternatively to use a pre-built count table for their explorations. In what follows, when we refer to "pre-built count tables", we mean using the count tables that we provide. Detailed instructions on how to access these tables are below.

## <a name="aml"></a> Build a model with Azure Machine Learning

Our model building process in Azure Machine Learning will follow these steps:

1. [Get the data from Hive tables into Azure Machine Learning](#step1)
2. [Create the experiment: clean the data, choose a learner, and featurize with count tables](#step2)
3. [Train the model](#step3)
4. [Score the model on test data](#step4)
5. [Evaluate the model](#step5)
6. [Publish the model as a web-service to be consumed](#step6)

Now we are ready to build models in Azure Machine Learning studio. Our down sampled data is saved as Hive tables in the cluster. We will use the Azure Machine Learning Reader module to read this data. The credentials to access the storage account of this cluster are below.

### <a name="step1"></a> Step 1: Get data from Hive tables into Azure Machine Learning using the Reader module and select it for a machine learning experiment

For the **Reader** module, the values of the parameters that are set in the graphic are just examples. Here is the general guidance on 'filling out' the parameter set for the **Reader** module.

1. Choose "Hive query" for Data Source
2. In the "Hive query", a simple SELECT * FROM <your\_database\_name.your\_table\_name> - is enough.
3. Hcatalog server URI: If your cluster is "abc", then this is: https://abc.azurehdinsight.net
4. Hadoop user account name: User name chosen at the time of commissioning the cluster ( NOT the Remote Access username)
5. Hadoop user account password: Password for the above user name chosen at the time of commissioning the cluster (NOT the Remote Access password)
6. Location of output data: Choose "Azure"
7. Azure storage account name: The storage account associated with the cluster
8. Azure storage account key: Key of the storage account associated with the cluster
9. Azure container name: If the cluster name is "abc", then this is simply "abc" usually 

This is what the **Reader** looks like while getting data from the Hive table:

![Reader gets data](http://i.imgur.com/i3zRaoj.png)

Once the **Reader** finishes getting data (you see the green tick on the Module), save this data as a Dataset (with a name of your choice). What this looks like:

![Reader save data](http://i.imgur.com/oxM73Np.png)


Right click on the output port of the **Reader** module. This reveals a **Save as dataset** option and a **Visualize** option. The **Visualize** option, if clicked, displays 100 rows of the data, along with a right panel that is useful for some summary statistics. To save data, simply select **Save as dataset** and follow instructions.

To select the saved dataset for use in a machine learning experiment,
locate the datasets using the **Search** shown below. Then simply type out the name of the dataset partially to access it and drag the dataset onto the main panel. Dropping it onto the main panel selects it for use in machine learning modeling.

![Locate dataset](http://i.imgur.com/rx4nnUH.png)

Do this for both the train and the test datasets.

### <a name="step2"></a> Step 2: Create a simple experiment in Azure Machine Learning to predict clicks / no clicks

We first show a simple experiment architecture, then drill down a bit into the specifics. First we clean the data, then choose a learner, and finally show how to featurize with count tables that are either pre-build or constructed from scratch by the user.

![Experiment architecture](http://i.imgur.com/R4iTLYi.png)

To drill down, we begin with our saved datasets as shown.

The **Clean Missing Data** module does what its name says: cleans missing data in ways that can be user-specified. Looking into this module, we see this:

![Clean missing data](http://i.imgur.com/0ycXod6.png)

Here, we chose to replace all missing values with a 0. There are other options as well, which can be seen by looking at the dropdowns in the module.

Next, we need a choice of learner. We'll use a two class boosted decision tree as our learner. In particular, we will show how to use count features on high-dimensional categorical features to build compact representations of our model, and also for efficient train and test. 

A segue here to discuss what the count tables really are: they are class conditional counts (sometimes, we also refer to them as just "conditional counts"). Essentially, they are a way of counting the values of a feature for each class, and using these counts to compute log-odds.


#### Get access to the pre-built count tables for modeling

To get access to our pre-built count tables, please click on **Gallery**, shown below:

![Gallery](http://i.imgur.com/TsWkig3.png)

Clicking on **Gallery** takes the user to a page that looks like the below:

![Gallery mainpage](http://i.imgur.com/dmXo0KR.png)

Here, search for the phrase "criteo counts" and scroll down the list of results. You should see:

![Criteo counts](http://i.imgur.com/JZ119Jf.png)

Clicking on this experiment leads to a page that looks like the below:

![Counts](http://i.imgur.com/dxdjMjh.png)

Here, click **Open in studio** to copy the experiment over to your workspace. This automatically also copies over the datasets -- in this case, the two key datasets of interest are the count table and the count metadata, which we describe in more detail.

#### Count features in the dataset

The next modules in our experiment involve the use of pre-built count tables. To use these pre-built count tables, search for "cr\_count\_" in the Search tab of a new experiment and you should see two datasets: "cr\_count\_cleanednulls\_metadata" and "cr\_count\_table\_cleanednulls". Drag and drop both of these on to the experiment pane to the right. Right clicking on the output ports, as always, enables us to visualize what these look like. 

The count table metadata visualization looks like the below:

![Count table metadata](http://i.imgur.com/A39PIe7.png)

Note that the metadata has information on what columns we built the conditional counts on, whether we used a dictionary to build it (an alternative is the count-min sketch), the hash seed used, the number of hash bits used for hashing the features, the number of classes, and the like.

The count table's visualization looks like the below:

![Count table](http://i.imgur.com/NJn1EQO.png)

We see that the count table has information on the class conditional counts. The value of the categorical features is in "Hash value", so the features themselves are hashed. 

How are the count features built into the datasets? For this, we use the count **Featurizer** module, shown below:

![Count Featurizer module](http://i.imgur.com/dnMdrR1.png)

Once the count table is built (remember we are producing class-conditional counts of categorical features here), we use the **Count Featurizer** module shown above to build these count features into our dataset. As we see, the **Featurizer** module allows for choosing which features to count on, whether we need just the log odds or the counts as well, and other advanced options. 

#### Build a count table from scratch

Recall that we mentioned in "A brief discussion on the count table" that in addition to using pre-built count tables (which we discussed in preceding sections in detail), users can also build their own count tables from scratch. 

In this section, we demonstrate how to build a count table from scratch. To do this, we use the **Build Count Table** module shown below with its settings:

![Build Count Table module](http://i.imgur.com/r7pP8Qq.png)

The latter part of the settings for this module follow:

![Build Count Table module settings](http://i.imgur.com/PvmSh3C.png)


**Important Note:** For the cluster and storage account settings, please use YOUR relevant values! 

Clicking on **Run** allows us to build the count tables on the cluster chosen. The output is, as shown before, the count table and its associated metadata. With these tables ready, we can now build the experiment.


### <a name="step3"></a> Step 3: Train the model

To select this, simply type "two class boosted" at the Search box and drag the module over. We use the default values of the boosted decision tree learner, shown below:

![BDT learner](http://i.imgur.com/dDk0Jtv.png)

We need three final components before running the ML experiment.

The first is a Train Model module ; while its first port takes the learner as input, its second port takes the train dataset for learning. We show what this looks like below, and then show what parameters need to be set in the module.

![BDT Train Model module connections](http://i.imgur.com/szS2xBb.png)

![BDT Train Model module settings](http://i.imgur.com/nd7lHBL.png)

### <a name="step4"></a> Step 4: Score the model on a test dataset

The second component is a way to score on the test dataset. This is conveniently achieved by using the **Score Model** module - it takes as input the learned model from train data, and the test dataset to make predictions on. Below, we show what that looks like.

![Score BDT model connections](http://i.imgur.com/AwIH1rH.png)

### <a name="step5"></a> Step 5: Evaluate the model

Finally, we would like to see model performance. Usually, for two class (binary) classification problems, a good measure is the AUC. To visualize this, we hook up the "Score Model" module to an "Evaluate Model" module for this. Clicking **Visualize** on the **Evaluate Model** module yields a graphic like the below:

![Evaluate module BDT model](http://i.imgur.com/0Tl0cdg.png)

In binary (or two class) classification problems, a good measure of prediction accuracy is the AUC. Below, we show our results using this model on our test dataset. To get this, right click the output port of the **Evaluate Model** module and then **Visualize**.

![Visualize Evaluate Model module](http://i.imgur.com/IRfc7fH.png)

### <a name="step6"></a> Step 6: Publish the model as a Web service
Of great interest is the ability to be able to publish machine learning models as web services. Once that is done, we may make calls to the web service using data we need predictions for, and the model would ideally return a prediction of some kind.

To do this, we first save our trained model as a Trained Model object. This is done by right clicking on the **Train Model** module and using the "Save as Trained Model" option.

Next, we want to create an input and output port for our web service -- an input port that takes data in the same form as the data that we need predictions for, and an output port that returns the Scored Labels and the associated probabilities.

#### Select a few rows of data for the input port

We now show how to select just a few rows of data for our input port.

![Input port data](http://i.imgur.com/XqVtSxu.png)

We can conveniently use an Apply SQL transformation to select just 10 rows to serve as the input port data.

#### Web service
Now we are ready to run a small experiment that can be used to publish our web service.

#### Generate input data for webservice

As a zeroth step, since the count table is large, we take a few lines of test data and generate output data from it with count features. This serves as the input data format for our webservice. This is shown below:

![Create BDT input data](http://i.imgur.com/OEJMmst.png)

Note: for the input data format, we will now use the OUTPUT of the **Count Featurizer** module. Once this experiment finishes running, save the output from the **Count Featurizer** module as a Dataset. **Important Note:** This Dataset will be used for the input data in the webservice. 

#### Scoring experiment for publishing webservice

First, we show what this looks like. The essential structure is a Score model module that accepts our trained model object and a few lines of input data that we generated in the previous steps using the **Count Featurizer** module. We use "Project Columns" to project out the Scored labels and the Score probabilities. 

![Project Columns](http://i.imgur.com/kRHrIbe.png)

It is instructive to see how the Project Columns module can be used for 'filtering' out data from a dataset. We show the contents below:

![Filtering with the Project Columns module](http://i.imgur.com/oVUJC9K.png)

To get the blue input and output ports, we simply click "prepare webservice" at the bottom right. Running this experiment also allows us to publish the web service  by clicking the **PUBLISH WEB SERVICE** icon at the bottom right, shown below.

![Publish Web service](http://i.imgur.com/WO0nens.png)

Once the webservice is published, we get redirected to a page that looks thus:

![](http://i.imgur.com/YKzxAA5.png)

We see two links for webservices on the left side:

* The **REQUEST/RESPONSE** Service (or RRS) is meant for single predictions and is what we will utilize in this workshop. 
* The **BATCH EXECUTION** Service (BES), as the name implies, is used for batch predictions and requires that the data to make predictions on reside in an Azure blob.

Clicking on the link **REQUEST/RESPONSE** takes us to a page that gives us pre-canned code in C#, python, and R. This code can be conveniently used for making calls to the webservice. Note that the API key on this page needs to be used for authentication. 

It is convenient to copy this python code over to a new cell in the iPython notebook. 

Below, we show a segment of python code with the correct API key.

![Python code](http://i.imgur.com/f8N4L4g.png)

Note that we replaced the default API key with our webservices's API key. clicking "Run" on this cell in an iPython notebook yields the following response:

![iPython response](http://i.imgur.com/KSxmia2.png)

We see that for the two test examples we asked about (in the JSON framework of the python script), we get back answers in the form "Scored Labels, Scored Probabilities". Note that in this case, we chose the default values that the pre-canned code provides (0's for all numeric columns, the string "value" for all categorical columns).

This concludes our discussion of handling large scale dataset end-to-end using Azure ML - we went from a a terabyte of data all the way to a prediction model deployed as a web service in the cloud.

 