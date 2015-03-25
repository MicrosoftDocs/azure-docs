<properties 
	pageTitle="Azure Data Science Process in Action: using HDInsight Hadoop clusters | Azure" 
	description="End-to-end Azure Data Science Process using an HDInsight Hadoop cluster to build and deploy a model using a publicly available dataset." metaKeywords="" 
	services="machine-learning" 
	solutions="" 
	documentationCenter="" 
	authors="hangzh-msft" 
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/23/2015" 
	ms.author="hangzh;bradsev" /> 

                
# Azure Data Science Process in Action: using HDInsight Hadoop clusters

In this tutorial, you will follow the Azure Data Science Process map end-to-end using an Azure HDInsight Hadoop cluster to build and deploy a model using a publicly available dataset -- the [NYC Taxi Trips](http://www.andresmh.com/nyctaxitrips/) dataset. 

The following sections are organized as follows:

- [NYC Taxi Trips Dataset Description](#dataset)
- [Examples of Prediction Problems](#mltasks)
- [Setting Up the Azure Data Science Environment](#setup)
- [Getting the Data from Public Source](#getdata)
- [Uploading the Data to the Default Container of Azure HDInsight Hadoop Cluster](#upload)
- [Creating Hive Database and Tables](#hive-db-tables)
- [Loading Data to Hive Tables by Partitions](#load-data)
- [Showing Databases in HDInsight Hadoop Cluster](#show-db)
- [Showing Tables in Database nyctaxidb](#show-tables)
- [Data Exploration and Feature Engineering in Hive](#explore-hive)
- [Building Models in Azure Machine Learning](#mlmodel)
- [Deploying Models in Azure Machine Learning](#mldeploy)

## <a name="dataset"></a>NYC Taxi Trips Dataset Description

The NYC Taxi Trip data is about 20GB of compressed CSV files (~48GB uncompressed), comprising more than 173 million individual trips and the fares paid for each trip. Each trip record includes the pickup and drop-off location and time, anonymized hack (driver's) license number and medallion (taxi’s unique id) number. The data covers all trips in the year 2013 and is provided in the following two datasets for each month:

1. The 'trip_data' CSV contains trip details, such as number of passengers, pickup and dropoff points, trip duration, and trip length. Here are a few sample records:

		medallion,hack_license,vendor_id,rate_code,store_and_fwd_flag,pickup_datetime,dropoff_datetime,passenger_count,trip_time_in_secs,trip_distance,pickup_longitude,pickup_latitude,dropoff_longitude,dropoff_latitude
		89D227B655E5C82AECF13C3F540D4CF4,BA96DE419E711691B9445D6A6307C170,CMT,1,N,2013-01-01 15:11:48,2013-01-01 15:18:10,4,382,1.00,-73.978165,40.757977,-73.989838,40.751171
		0BD7C8F5BA12B88E0B67BED28BEA73D8,9FD8F69F0804BDB5549F40E9DA1BE472,CMT,1,N,2013-01-06 00:18:35,2013-01-06 00:22:54,1,259,1.50,-74.006683,40.731781,-73.994499,40.75066
		0BD7C8F5BA12B88E0B67BED28BEA73D8,9FD8F69F0804BDB5549F40E9DA1BE472,CMT,1,N,2013-01-05 18:49:41,2013-01-05 18:54:23,1,282,1.10,-74.004707,40.73777,-74.009834,40.726002
		DFD2202EE08F7A8DC9A57B02ACB81FE2,51EE87E3205C985EF8431D850C786310,CMT,1,N,2013-01-07 23:54:15,2013-01-07 23:58:20,2,244,.70,-73.974602,40.759945,-73.984734,40.759388
		DFD2202EE08F7A8DC9A57B02ACB81FE2,51EE87E3205C985EF8431D850C786310,CMT,1,N,2013-01-07 23:25:03,2013-01-07 23:34:24,1,560,2.10,-73.97625,40.748528,-74.002586,40.747868

2. The 'trip_fare' CSV contains details of the fare paid for each trip, such as payment type, fare amount, surcharge and taxes, tips and tolls, and the total amount paid. Here are a few sample records:

		medallion, hack_license, vendor_id, pickup_datetime, payment_type, fare_amount, surcharge, mta_tax, tip_amount, tolls_amount, total_amount
		89D227B655E5C82AECF13C3F540D4CF4,BA96DE419E711691B9445D6A6307C170,CMT,2013-01-01 15:11:48,CSH,6.5,0,0.5,0,0,7
		0BD7C8F5BA12B88E0B67BED28BEA73D8,9FD8F69F0804BDB5549F40E9DA1BE472,CMT,2013-01-06 00:18:35,CSH,6,0.5,0.5,0,0,7
		0BD7C8F5BA12B88E0B67BED28BEA73D8,9FD8F69F0804BDB5549F40E9DA1BE472,CMT,2013-01-05 18:49:41,CSH,5.5,1,0.5,0,0,7
		DFD2202EE08F7A8DC9A57B02ACB81FE2,51EE87E3205C985EF8431D850C786310,CMT,2013-01-07 23:54:15,CSH,5,0.5,0.5,0,0,6
		DFD2202EE08F7A8DC9A57B02ACB81FE2,51EE87E3205C985EF8431D850C786310,CMT,2013-01-07 23:25:03,CSH,9.5,0.5,0.5,0,0,10.5

The unique key to join trip\_data and trip\_fare is composed of the fields: medallion, hack\_licence and pickup\_datetime.

There are 12 trip 'trip_data' and 'trip_fare' files, respectively. In the file names, numbers 1-12 represents the months that the trips are made. 

## <a name="mltasks"></a>Examples of Prediction Tasks

We will formulate three prediction problems based on the *tip\_amount*, namely:

1. Binary classification: Predict whether or not a tip was paid for a trip, i.e. a *tip\_amount* that is greater than $0 is a positive example, while a *tip\_amount* of $0 is a negative example.

2. Multiclass classification: To predict the range of tip paid for the trip. We divide the *tip\_amount* into five bins or classes:
	
		Class 0 : tip_amount = $0
		Class 1 : tip_amount > $0 and tip_amount <= $5
		Class 2 : tip_amount > $5 and tip_amount <= $10
		Class 3 : tip_amount > $10 and tip_amount <= $20
		Class 4 : tip_amount > $20

3. Regression task: To predict the amount of tip paid for a trip.  


## <a name="setup"></a>Setting Up the Azure Data Science Environment

As you can see from the [Plan Your Environment](machine-learning-data-science-plan-your-environment.md) guide, there are several options to work with the NYC Taxi Trips dataset in Azure:

- Work with the data in Azure blobs then model in Azure Machine Learning
- Load the data into a SQL Server database then model in Azure Machine Learning
- Load the data into HDInsight Hive tables then model in Azure Machine Learning

Please take the following steps to set up your Azure Data Science environment so that you can use Azure HDInsight Hadoop clusters (Hive, more specifically) to process the data:

1. [Create a storage account](storage-whatis-account.md)

2. [Create an Azure ML workspace](machine-learning-create-workspace.md)

3. [Provision a Data Science **Windows** Virtual Machine](machine-learning-data-science-setup-virtual-machine.md).

	> [AZURE.NOTE] The sample scripts will be downloaded to your Data Science virtual machine during the virtual machine setup process. When the VM post-installation script completes, the samples will be in your VM's Documents library:  
	> - Sample Scripts: `C:\Users\<user_name>\Documents\Data Science Scripts`  
	> `<user_name>` is your VM's Windows login name. We will refer to the sample folders as **Sample Scripts**.
	> Sample Hive queries are in files with extension .hql in the **Sample Scripts** folder.

4. [Customize Azure HDInsight Hadoop Clusters for Data Science](machine-learning-data-science-customize-hadoop-cluster.md). This step will create an Azure HDInsight Hadoop cluster with 64-bit Anaconda Python 2.7 installed on all nodes. After the Hadoop cluster is created, enable the remote access to the head node of the Hadoop cluster. 

Based on the dataset size, data source location, and the selected Azure target environment, this scenario is similar to [Scenario \#7: Large dataset in local files, target Hive in Azure HDInsight Hadoop clusters](machine-learning-data-science-plan-sample-scenarios.md#largelocaltohive).

## <a name="getdata"></a>Getting the Data from Public Source

To get the [NYC Taxi Trips](http://www.andresmh.com/nyctaxitrips/) dataset from its public location, you may use any of the methods described in [Move Data to and from Azure Blob Storage](machine-learning-data-science-move-azure-blob.md) to copy the data to your new virtual machine.

To copy the data using AzCopy:

1. Log in to your virtual machine (VM)

2. Create a new directory in the VM's data disk (Note: Do not use the Temporary Disk which comes with the VM as a Data Disk).

3. In a Command Prompt window, run the following AzCopy commands, replacing <path_to_data_folder> with your data folder created in (2):

		"C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\azcopy" /Source:https://getgoing.blob.core.windows.net/nyctaxitrip /Dest:<path_to_data_folder> /S

		"C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\azcopy" /Source:https://getgoing.blob.core.windows.net/nyctaxifare /Dest:<path_to_data_folder> /S

	When the AzCopy completes, a total of 24 zipped CSV files (12 for trip\_data and 12 for trip\_fare) should be in the data folder.

	>[AZURE.NOTE] `https://getgoing.blob.core.windows.net/nyctaxitrip` and `Source:https://getgoing.blob.core.windows.net/nyctaxifare` are two public Azure containers that we use to share the unzipped NYC Taxi data with users. Reading from these two public Azure containers does not need access key. 

## <a name="upload"></a>Uploading the Data to the Default Container of Azure HDInsight Hadoop cluster

In a Command Prompt or Windows PowerShell window in your virtual machine, run the following AzCopy command lines, replacing `<path_to_data_folder>` with your data folder you created in the previous section, `<storage account name of Hadoop cluster>`, `<default container of Hadoop cluster>` and `<storage account key>` of the storage account and container you specify when you create the Hadoop cluster. If `nyctaxitripraw` or `nyctaxifareraw` does not exist, it will be created in the container. 

		"C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\azcopy" /Source:<path_to_data_folder> /Dest:https://<storage account name of Hadoop cluster>.blob.core.windows.net/<default container of Hadoop cluster>/nyctaxitripraw /DestKey:<storage account key> /S /Pattern:trip_data_*.csv
		
		"C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\azcopy" /Source:<path_to_data_folder> /Dest:https://<storage account name of Hadoop cluster>.blob.core.windows.net/<default container of Hadoop cluster>/nyctaxifareraw /DestKey:<storage account key> /S /Pattern:trip_fare_*.csv

## <a name="#hive-db-tables"></a>Creating Hive Database and Tables Partitioned by Month

Starting from this point in this walk-through, we need to log in to the head node of the Hadoop cluster and [submit queries in the Hadoop Command Line](machine-learning-data-science-hive-queries.md#submit). Then, open the Hadoop Command Line, and run the following command to **enter the directory of Hive**:
	
	cd %hive_home%\bin

If you have created an Azure virtual machine by following the instructions [Setting Up the Azure Data Science Environment](#setup), the example Hive queries have already been downloaded to your virtual machine in the directory "Data Science Scripts". Otherwise, users can check out the .hql files from [Github](https://github.com/Azure/Azure-MachineLearning-DataScience/tree/master/Misc/DataScienceProcess/DataScienceScripts). 

In order to submit the Hive queries in .hql file, you need to transfer the .hql files to a local directory in the head node of the Hadoop cluster. In the following examples, we assume that the .hql files have been transferred to `C:\temp\` in the head node.

Here is the content of the `C:\temp\sample_hive_create_db_and_tables.hql` which creates Hive database `nyctaxidb` and tables `trip` and `fare`.

	create database if not exists nyctaxidb;

	create external table if not exists nyctaxidb.trip
	( 
	    medallion string, 
	    hack_license string,
	    vendor_id string, 
	    rate_code string, 
	    store_and_fwd_flag string, 
	    pickup_datetime string, 
	    dropoff_datetime string, 
	    passenger_count int, 
	    trip_time_in_secs double, 
	    trip_distance double, 
	    pickup_longitude double, 
	    pickup_latitude double, 
	    dropoff_longitude double, 
	    dropoff_latitude double)  
	PARTITIONED BY (month int) 
	ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' lines terminated by '\n'
	STORED AS TEXTFILE LOCATION 'wasb:///nyctaxidbdata/trip' TBLPROPERTIES('skip.header.line.count'='1');

	create external table if not exists nyctaxidb.fare 
	( 
	    medallion string, 
	    hack_license string, 
	    vendor_id string, 
	    pickup_datetime string, 
	    payment_type string, 
	    fare_amount double, 
	    surcharge double,
	    mta_tax double,
	    tip_amount double,
	    tolls_amount double,
	    total_amount double)
	PARTITIONED BY (month int) 
	ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' lines terminated by '\n'
	STORED AS TEXTFILE LOCATION 'wasb:///nyctaxidbdata/fare' TBLPROPERTIES('skip.header.line.count'='1');

Run the following command in Hadoop Command Line of the head node to submit the Hive queries:
	
	hive -f "C:\temp\sample_hive_create_db_and_tables.hql"

## <a name="#load-data"></a>Loading Data to Tables by Partitions
Run the following PowerShell commands in Hadoop Command Line to load data to the Hive tables by partitions:

	for /L %i IN (1,1,12) DO (hive -hiveconf MONTH=%i -f "C:\temp\sample_hive_load_data_by_partitions.hql")

The content of the `sample_hive_load_data_by_partitions.hql` is as follows:

	LOAD DATA INPATH 'wasb:///nyctaxitripraw/trip_data_${hiveconf:MONTH}.csv' INTO TABLE nyctaxidb.trip PARTITION (month=${hiveconf:MONTH});
	LOAD DATA INPATH 'wasb:///nyctaxifareraw/fare_data_${hiveconf:MONTH}.csv' INTO TABLE nyctaxidb.fare PARTITION (month=${hiveconf:MONTH});

## <a name="#show-db"></a>Showing Databases in HDInsight Hadoop Cluster

Run the following command in Hadoop Command Line:

	hive -e "show databases;"

## <a name="#show-tables"></a>Showing Tables in Database nyctaxidb
	
Run the following command in Hadoop Command Line:
	
	hive -e "show tables in nyctaxidb;"
   
## <a name="#explore-hive"></a>Data Exploration and Feature Engineering in Hive

With the Hive queries in this exercise, we will:

- View the top 10 records in both tables.
- Explore data distributions of a few fields in varying time windows.
- Investigate data quality of the longitude and latitude fields.
- Generate binary and multiclass classification labels based on the **tip\_amount**.
- Generate features by computing the direct trip distances.
- Join the two tables and extract a random sample that will be used to build models.

After you complete data exploration and feature engineering in Hive, and you feel that you are ready to proceed to Azure Machine Learning, you can save the final Hive query to extract and sample the data and copy-paste the query directly into a Reader module in Azure Machine Learning

### Exploration: View the top 10 records in table trip

To quickly understand the data schema and how the data looks like, users can extract top 10 records from each table, run the following two queries one by one in Hadoop Command Line.

To get the top 10 records in table _trip_:

	hive -e "select * from nyctaxidb.trip where month=1 limit 10;"
    
To get the top 10 records in table _fare_:
	
	hive -e "select * from nyctaxidb.fare where month=1 limit 10;"

### Exploration: View the number of records in each of the 12 partitions

Run the following command in Hadoop Command Line:
	
	hive -e "select month, count(*) from nyctaxidb.trip group by month;"

### Exploration: Trip distribution by medallion

This example identifies the medallion (taxi numbers) with more than 100 trips within a given time period. The query would benefit from the partitioned table access since it is conditioned by the partition variable **month**. 

	hive -f "C:\temp\sample_hive_trip_count_by_medallion.hql"

The content of `sample_hive_trip_count_by_medallion.hql` is as follows:

	SELECT medallion, COUNT(*) as med_count
	FROM nyctaxidb.fare
	WHERE month<=3
	GROUP BY medallion
	HAVING med_count > 100 
	ORDER BY med_count desc;

### Exploration: Trip distribution by medallion and hack_license

Here is an example of group by multiple columns of the table. Run the following command in Hadoop Command Line:

	hive -f "C:\temp\sample_hive_trip_count_by_medallion_license.hql"

The content of `sample_hive_trip_count_by_medallion_license.hql` is as follows:
	
    SELECT medallion, hack_license, COUNT(*) as trip_count
	FROM nyctaxidb.fare
	WHERE month=1
	GROUP BY medallion, hack_license
	HAVING trip_count > 100
	ORDER BY trip_count desc;

### Data Quality Assessment: Verify records with invalid longitude and/or latitude

This example investigates if any of the longitude and/or latitude fields either contain an invalid value (radian degrees should be between -90 and 90), or have (0, 0) coordinates.

Run the following command in Hadoop Command Line:

	hive -S -f "C:\temp\sample_hive_quality_assessment.hql"

The argument `-S` will suppress the status screen print of the Hive Map/Reduce jobs, which makes the screen print of the Hive query output more readable. 

The content of `sample_hive_quality_assessment.hql` is as follows:

    	SELECT COUNT(*) FROM nyctaxidb.trip
    	WHERE month=1
    	AND  (CAST(pickup_longitude AS float) NOT BETWEEN -90 AND 90
    	OR    CAST(pickup_latitude AS float) NOT BETWEEN -90 AND 90
	    OR    CAST(dropoff_longitude AS float) NOT BETWEEN -90 AND 90
	    OR    CAST(dropoff_latitude AS float) NOT BETWEEN -90 AND 90
	    OR    (pickup_longitude = '0' AND pickup_latitude = '0')
	    OR    (dropoff_longitude = '0' AND dropoff_latitude = '0'));

### Exploration: Frequencies of tipped and not tipped trips

This example finds the number of trips that were tipped vs. not tipped in a given time period (or in the full dataset if covering the full year). This distribution reflects the binary label distribution to be later used for binary classification modeling.

Run the following command in Hadoop Command Line:

	hive -f "C:\temp\sample_hive_tipped_frequencies.hql"

The content of `sample_hive_tipped_frequencies.hql` is as follows:

    SELECT tipped, COUNT(*) AS tip_freq 
    FROM 
    (
        SELECT if(tip_amount > 0, 1, 0) as tipped, tip_amount
        FROM nyctaxidb.fare
    )tc
    GROUP BY tipped;

### Exploration: Frequencies of tip ranges

This example computes the distribution of tip ranges in a given time period (or in the full dataset if covering the full year). This is the distribution of the label classes that will be used later for multiclass classification modeling.

Run the following command in Hadoop Command Line:

	hive -f "C:\temp\sample_hive_tip_range_frequencies.hql"

The content of `sample_hive_tip_range_frequencies.hql` is:

	SELECT tip_class, COUNT(*) AS tip_freq 
    FROM 
    (
        SELECT if(tip_amount=0, 0, 
            if(tip_amount>0 and tip_amount<=5, 1, 
            if(tip_amount>5 and tip_amount<=10, 2, 
            if(tip_amount>10 and tip_amount<=20, 3, 4)))) as tip_class, tip_amount
        FROM nyctaxidb.fare
    )tc
    GROUP BY tip_class;

### Exploration: Compute Direct Distance and Compare with Trip Distance

This example computes the direct trip distance (in miles). The example limits the results to valid coordinates only using the data quality assessment query covered earlier.

Run the following command in Hadoop Command Line:

	hive -f "C:\temp\sample_hive_trip_direct_distance.hql"

The content of `sample_hive_trip_direct_distance.hql` is as follows:

    set R=3959;
    set pi=radians(180);
	
	insert overwrite directory 'wasb:///queryoutputdir'
    select pickup_longitude, pickup_latitude, dropoff_longitude, dropoff_latitude, trip_distance, trip_time_in_secs,
        ${hiveconf:R}*2*2*atan((1-sqrt(1-pow(sin((dropoff_latitude-pickup_latitude)
        *${hiveconf:pi}/180/2),2)-cos(pickup_latitude*${hiveconf:pi}/180)
        *cos(dropoff_latitude*${hiveconf:pi}/180)*pow(sin((dropoff_longitude-pickup_longitude)*${hiveconf:pi}/180/2),2)))
        /sqrt(pow(sin((dropoff_latitude-pickup_latitude)*${hiveconf:pi}/180/2),2)
        +cos(pickup_latitude*${hiveconf:pi}/180)*cos(dropoff_latitude*${hiveconf:pi}/180)*
        pow(sin((dropoff_longitude-pickup_longitude)*${hiveconf:pi}/180/2),2))) as direct_distance 
    from nyctaxidb.trip 
    where month=1 
        and pickup_longitude between -90 and -30
        and pickup_latitude between 30 and 90
        and dropoff_longitude between -90 and -30
        and dropoff_latitude between 30 and 90;

After the query completes, the results are written into an Azure blob `queryoutputdir/000000_0` under the default container of the Hadoop cluster. If you use Azure Storage Explorer, you should be able to see this blob in the default container of the Hadoop cluster, as follows:

![Create workspace][2]

You can apply the filter (highlighted by red box) to only retrieve the blob with specified letters in names. 

After the query completes, you can use Azure SDK to read the query output from Azure blob into a pandas data frame to conduct further explorations and processes. Please refer to [Process Azure Blob data in your data science environment](machine-learning-data-science-process-data-blob.md) for instructions of reading Azure blobs into pandas data frames. 
	
### Preparing Data for Model Building

The following command and query join the **nyctaxidb.trip** and **nyctaxidb.fare** tables, generates a binary classification label **tipped** and a multi-class classification label **tip\_class**. This query can be copied then pasted directly in the [Azure Machine Learning Studio](https://studio.azureml.net) Reader module for direct data ingestion from the **Hive Query** in Azure. This query excludes records with incorrect latitude and/or longitude coordinates.

This query directly applies Hive embedded UDFs to generate some features from Hive records, including the hour, week of year, and weekday (1 stands for Monday, and 7 stands for Sunday) of the field _pickup_datetime_. Users can refer to [LanguageManual UDF](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF) for a complete list of embedded Hive UDFs.

This query also down samples the data to roughly only 1% so that the query results can fit in the Azure Machine Learning Studio. 

Run the following command in Hadoop Command Line:

	hive -f "C:\temp\sample_hive_prepare_for_aml.hql"

The content of "sample_hive_prepare_for_aml.hql" is as follows:
	
    select 
        t.medallion, 
        t.hack_license,
        t.vendor_id,
        t.rate_code,
        t.store_and_fwd_flag,
        t.pickup_datetime,
        t.dropoff_datetime,
        hour(t.pickup_datetime) as pickup_hour,
        weekofyear(t.pickup_datetime) as pickup_week,
        from_unixtime(unix_timestamp(t.pickup_datetime, 'yyyy-MM-dd HH:mm:ss'),'u') as weekday,
        t.passenger_count,
        t.trip_time_in_secs,
        t.trip_distance,
        t.pickup_longitude,
        t.pickup_latitude,
        t.dropoff_longitude,
        t.dropoff_latitude,
        f.payment_type, 
        f.fare_amount, 
        f.surcharge, 
        f.mta_tax, 
        f.tip_amount, 
        f.tolls_amount, 
        f.total_amount,
        if(tip_amount>0,1,0) as tipped,
        if(tip_amount=0,0,
            if(tip_amount>0 and tip_amount<=5,1,
            if(tip_amount>5 and tip_amount<=10,2,
            if(tip_amount>10 and tip_amount<=20,3,4)))) as tip_class
    from
    (
        select medallion, 
            hack_license,
            vendor_id,
            rate_code,
            store_and_fwd_flag,
            pickup_datetime,
            dropoff_datetime,
            passenger_count,
            trip_time_in_secs,
            trip_distance,
            pickup_longitude,
            pickup_latitude,
            dropoff_longitude,
            dropoff_latitude,
            rand() as sample_key 
        from nyctaxidb.trip
        where pickup_latitude between 30 and 60
            and pickup_longitude between -90 and -60
            and dropoff_latitude between 30 and 60
            and dropoff_longitude between -90 and -60
    )t
    join
    (
        select 
            medallion, 
            hack_license, 
            vendor_id, 
            pickup_datetime, 
            payment_type, 
            fare_amount, 
            surcharge, 
            mta_tax, 
            tip_amount, 
            tolls_amount, 
            total_amount
        from nyctaxidb.fare 
    )f
    on t.medallion=f.medallion and t.hack_license=f.hack_license and t.pickup_datetime=f.pickup_datetime
    where t.sample_key<=0.01

## <a name="mlmodel"></a>Building Models in Azure Machine Learning

We are now ready to proceed to model building and model deployment in [Azure Machine Learning](https://studio.azureml.net). The data is ready for any of the prediction problems identified earlier, namely:

1. Binary classification: To predict whether or not a tip was paid for a trip.

2. Multiclass classification: To predict the range of tip paid, according to the previously defined classes.

3. Regression task: To predict the amount of tip paid for a trip.  

To begin the modeling exercise, log in to your Azure Machine Learning workspace. If you have not yet created a machine learning workspace, see [Create an Azure ML workspace](machine-learning-create-workspace.md).

1. To get started with Azure Machine Learning, see [What is Azure Machine Learning Studio?](machine-learning-what-is-ml-studio.md)

2. Log in to [Azure Machine Learning Studio](https://studio.azureml.net).

3. The Studio Home page provides a wealth of information, videos, tutorials, links to the Modules Reference, and other resources. Fore more information about Azure Machine Learning, consult the [Azure Machine Learning Documentation Center](http://azure.microsoft.com/en-us/documentation/services/machine-learning/).

A typical training experiment consists of the following:

1. Create a **+NEW** experiment.
2. Get the data to Azure ML.
3. Pre-process, transform and manipulate the data as needed.
4. Generate features as needed.
5. Split the data into training/validation/testing datasets(or have separate datasets for each).
6. Select one or more machine learning algorithms depending on the learning problem to solve. E.g., binary classification, multiclass classification, regression.
7. Train one or more models using the training dataset.
8. Score the validation dataset using the trained model(s).
9. Evaluate the model(s) to compute the relevant metrics for the learning problem.
10. Fine tune the model(s) and select the best model to deploy.

In this exercise, we have already explored and engineered the data in Hive, and decided on the sample size to ingest in Azure ML. To build one or more of the prediction models we decided:

1. Get the data to Azure ML using the **Reader** module, available in the **Data Input and Output** section. For more information, see the [Reader](http://msdn.microsoft.com/en-US/library/dn784775) module reference page.

	![Create workspace][15]

2. Select **Hive Query** as the **Data source** in the **Properties** panel.

3. Enter the HDInsight Hadoop cluster information as follows. The **Azure storage account name** has to be the storage account that is used to create the HDInsight Hadoop cluster, and **Azure container name** has to be the default container of the Hadoop cluster. 

	![Create workspace][11]

4. In the **Hive database query** edit text area, paste the query which extracts the necessary database fields (including any computed fields such as the labels) and down samples the data to the desired sample size.

An example of a binary classification experiment reading data directly from the Hive Query is in the figure below. Similar experiments can be constructed for multiclass classification and regression problems.

![Create workspace][12]

> [AZURE.IMPORTANT] In the modeling data extraction and sampling query examples provided in previous sections, **all labels for the three modeling exercises are included in the query**. An important (required) step in each of the modeling exercises is to **exclude** the unnecessary labels for the other two problems, and any other **target leaks**. For e.g., when using binary classification, use the label **tipped** and exclude the fields **tip\_class**, **tip\_amount**, and **total\_amount**. The latter are target leaks since they imply the tip paid.

> In this experiment, the first **Metadata Editor** module adds column names to the output data from Reader module. This module is needed since the Reader module which reads data from Hive Query does not create column names for the output data. 
> 
> To exclude unnecessary columns and/or target leaks, you may use the **Project Columns** module or the **Metadta Editor**. For more information, see [Project Columns](http://msdn.microsoft.com/en-US/library/dn784740) and [Metadata Editor](http://msdn.microsoft.com/en-US/library/dn784761) reference pages.

## <a name="mldeploy"></a>Deploying Models in Azure Machine Learning

When your model is ready, you can easily deploy it as a web service directly from the experiment. For more information about publishing Azure ML web services, see [Azure Machine Learning API service operations](machine-learning-overview-of-azure-ml-process.md).

To deploy a new web service, you need to:

1. Create a scoring experiment.
2. Publish the web service.

To create a scoring experiment from a **Finished** training experiment, click **CREATE SCORING EXPERIMENT** in the lower action bar.

![Azure Scoring][13]

Azure Machine Learning will attempt to create a scoring experiment based on the components of the training experiment. In particular, it will:

1. Save the trained model and remove the model training modules.
2. Identify a logical **input port** to represent the expected input data schema.
3. Identify a logical **output port** to represent the expected web service output schema.

When the scoring experiment is created, review it and adjust as needed. A typical adjustment is to replace the input dataset and/or query with one which excludes label fields, as these will not be available when the service is called. It is also a good practice to reduce the size of the input dataset and/or query to a few records, just enough to indicate the input schema. For the output port, it is common to exclude all input fields and only include the **Scored Labels** and **Scored Probabilities** in the output using the **Project Columns** module.

A sample scoring experiment is in the figure below. When ready to publish, click the **PUBLISH WEB SERVICE** button in the lower action bar.

![Create workspace][14]

To recap, in this walkthrough tutorial, you have created an Azure data science environment, worked with a large public dataset all the way from data acquisition to model training and publishing of an Azure Machine Learning web service.

### License Information

This sample walkthrough and its accompanying scripts are shared by Microsoft under the MIT license. Please check the LICENSE.txt file in in the directory of the sample code on GitHub for more details.

### References

•	[Andrés Monroy NYC Taxi Trips Download Page](http://www.andresmh.com/nyctaxitrips/)  
•	[FOILing NYC’s Taxi Trip Data by Chris Whong](http://chriswhong.com/open-data/foil_nyc_taxi/)   
•	[NYC Taxi and Limousine Commission Research and Statistics](https://www1.nyc.gov/html/tlc/html/about/statistics.shtml)

[2]: ./media/machine-learning-data-science-process-hive-walkthrough/output-hive-results-3.png
[11]: ./media/machine-learning-data-science-process-hive-walkthrough/hive-reader-properties.png
[12]: ./media/machine-learning-data-science-process-hive-walkthrough/binary-classification-training.png
[13]: ./media/machine-learning-data-science-process-hive-walkthrough/create-scoring-experiment.png
[14]: ./media/machine-learning-data-science-process-hive-walkthrough/binary-classification-scoring.png
[15]: ./media/machine-learning-data-science-process-hive-walkthrough/amlreader.png