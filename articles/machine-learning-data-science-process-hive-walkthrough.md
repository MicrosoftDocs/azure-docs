<properties 
	pageTitle="Azure Data Science Process in Action: using HDInsight Hadoop clusters | Azure" 
	description="End-to-end Azure Data Science Process using an HDInsight Hadoop cluster to build and deploy a model using a publicly available dataset." 
	metaKeywords="" 
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
	ms.date="04/06/2015" 
	ms.author="hangzh;bradsev" /> 

                
# Azure Data Science Process in Action: using HDInsight Hadoop clusters

In this tutorial, you follow the Azure Data Science Process map in an end-to-end scenario using an Azure HDInsight Hadoop cluster to store, explore and feature engineer data from the publicly available [NYC Taxi Trips](http://www.andresmh.com/nyctaxitrips/) dataset. Models of the data are built to handle a binary classification predictive task and then deployed with Azure Machine Learning.


## <a name="dataset"></a>NYC Taxi Trips Dataset description

The NYC Taxi Trip data is about 20GB of compressed comma-separated values (CSV) files (~48GB uncompressed), comprising more than 173 million individual trips and the fares paid for each trip. Each trip record includes the pickup and drop-off location and time, anonymized hack (driver's) license number and medallion (taxi’s unique id) number. The data covers all trips in the year 2013 and is provided in the following two datasets for each month:

1. The 'trip_data' CSV files contain trip details, such as number of passengers, pickup and dropoff points, trip duration, and trip length. Here are a few sample records:

		medallion,hack_license,vendor_id,rate_code,store_and_fwd_flag,pickup_datetime,dropoff_datetime,passenger_count,trip_time_in_secs,trip_distance,pickup_longitude,pickup_latitude,dropoff_longitude,dropoff_latitude
		89D227B655E5C82AECF13C3F540D4CF4,BA96DE419E711691B9445D6A6307C170,CMT,1,N,2013-01-01 15:11:48,2013-01-01 15:18:10,4,382,1.00,-73.978165,40.757977,-73.989838,40.751171
		0BD7C8F5BA12B88E0B67BED28BEA73D8,9FD8F69F0804BDB5549F40E9DA1BE472,CMT,1,N,2013-01-06 00:18:35,2013-01-06 00:22:54,1,259,1.50,-74.006683,40.731781,-73.994499,40.75066
		0BD7C8F5BA12B88E0B67BED28BEA73D8,9FD8F69F0804BDB5549F40E9DA1BE472,CMT,1,N,2013-01-05 18:49:41,2013-01-05 18:54:23,1,282,1.10,-74.004707,40.73777,-74.009834,40.726002
		DFD2202EE08F7A8DC9A57B02ACB81FE2,51EE87E3205C985EF8431D850C786310,CMT,1,N,2013-01-07 23:54:15,2013-01-07 23:58:20,2,244,.70,-73.974602,40.759945,-73.984734,40.759388
		DFD2202EE08F7A8DC9A57B02ACB81FE2,51EE87E3205C985EF8431D850C786310,CMT,1,N,2013-01-07 23:25:03,2013-01-07 23:34:24,1,560,2.10,-73.97625,40.748528,-74.002586,40.747868

2. The 'trip_fare' CSV files contain details of the fare paid for each trip, such as payment type, fare amount, surcharge and taxes, tips and tolls, and the total amount paid. Here are a few sample records:

		medallion, hack_license, vendor_id, pickup_datetime, payment_type, fare_amount, surcharge, mta_tax, tip_amount, tolls_amount, total_amount
		89D227B655E5C82AECF13C3F540D4CF4,BA96DE419E711691B9445D6A6307C170,CMT,2013-01-01 15:11:48,CSH,6.5,0,0.5,0,0,7
		0BD7C8F5BA12B88E0B67BED28BEA73D8,9FD8F69F0804BDB5549F40E9DA1BE472,CMT,2013-01-06 00:18:35,CSH,6,0.5,0.5,0,0,7
		0BD7C8F5BA12B88E0B67BED28BEA73D8,9FD8F69F0804BDB5549F40E9DA1BE472,CMT,2013-01-05 18:49:41,CSH,5.5,1,0.5,0,0,7
		DFD2202EE08F7A8DC9A57B02ACB81FE2,51EE87E3205C985EF8431D850C786310,CMT,2013-01-07 23:54:15,CSH,5,0.5,0.5,0,0,6
		DFD2202EE08F7A8DC9A57B02ACB81FE2,51EE87E3205C985EF8431D850C786310,CMT,2013-01-07 23:25:03,CSH,9.5,0.5,0.5,0,0,10.5

The unique key to join trip\_data and trip\_fare is composed of the fields: medallion, hack\_licence and pickup\_datetime.

There are 12 trip 'trip_data' and 'trip_fare' files, respectively. In the file names, numbers 1-12 represents the months that the trips are made. 

## <a name="mltasks"></a>Examples of prediction tasks
When approaching data, determining the kind of predictions you want to make based on its analysis helps clarify the tasks that you will need to include in your process.
Here are three examples of prediction problems that we will address in this walkthrough whose formulation is based on the *tip\_amount*:

1. **Binary classification**: Predict whether or not a tip was paid for a trip, i.e. a *tip\_amount* that is greater than $0 is a positive example, while a *tip\_amount* of $0 is a negative example.

2. **Multiclass classification**: To predict the range of tip amounts paid for the trip. We divide the *tip\_amount* into five bins or classes:
	
		Class 0 : tip_amount = $0
		Class 1 : tip_amount > $0 and tip_amount <= $5
		Class 2 : tip_amount > $5 and tip_amount <= $10
		Class 3 : tip_amount > $10 and tip_amount <= $20
		Class 4 : tip_amount > $20

3. **Regression task**: To predict the amount of tip paid for a trip.  


## <a name="setup"></a>Set up the Azure Data Science Environment

As you can see from the [Plan Your Environment](machine-learning-data-science-plan-your-environment.md) guide, there are several approaches that could be taken when working with the NYC Taxi Trips dataset in Azure:

- Work with the data in Azure blobs then model in Azure Machine Learning
- Load the data into a SQL Server database then model in Azure Machine Learning
- Load the data into HDInsight Hive tables then model in Azure Machine Learning

Based on the dataset size, data source location, and the selected Azure target environment, this scenario is similar to [Scenario \#7: Large dataset in local files, target Hive in Azure HDInsight Hadoop clusters](machine-learning-data-science-plan-sample-scenarios.md#largedbtohive).

To set up your Azure Data Science environment for this approach that uses Azure HDInsight Hadoop clusters and, more specifically, Hive tables and queries to store and process the data, complete the following steps.

1. [Create a storage account](storage-whatis-account.md)

2. [Create an Azure ML workspace](machine-learning-create-workspace.md)

3. [Provision a Data Science **Windows** Virtual Machine (**Optional** for this walkthrough)](machine-learning-data-science-setup-virtual-machine.md).

	> [AZURE.NOTE] The sample scripts will be downloaded to your Data Science virtual machine during the virtual machine setup process. When the VM post-installation script completes, the samples will be in your VM's Documents library located at *C:\Users\<user_name>\Documents\Data Science Scripts*  This sample folders is referred to as **Sample Scripts** below. The sample Hive queries are contained in files with the .hql extension in the **Sample Scripts** folder. Note that the *<user_name\>* referred in the path to this folder is your VM's Windows login name, not your Azure username.

4. [Customize Azure HDInsight Hadoop Clusters for Data Science](machine-learning-data-science-customize-hadoop-cluster.md). This step will create an Azure HDInsight Hadoop cluster with 64-bit Anaconda Python 2.7 installed on all nodes. After the customized Hadoop cluster is created, enable remote access to the head node of the Hadoop cluster in the Azure portal using the procedure outlined in this customization topic.

In the remainder of this walkthrough, word "machine" refers to the computer where you carry out the steps. The computer can be a virtual machine on Azure, or your own local computer. 

## <a name="getdata"></a>Get the data from a public source

In this and next steps, you need to have **AzCopy** installed on your machine in order to transfer files between your machine and Azure blobs storage. If AzCopy is not installed, please click on [this link](http://aka.ms/downloadazcopy) to download the installer and install it. We also assume that you install it in the path `"C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\`, which is the default installation path for Windows machines. If you are using the  virtual machine provisioned by following the instructions in [Provision a Data Science **Windows** Virtual Machine](machine-learning-data-science-setup-virtual-machine.md), AzCopy has already been installed. 

To get the [NYC Taxi Trips](http://www.andresmh.com/nyctaxitrips/) dataset from its public location, you may use any of the methods described in [Move Data to and from Azure Blob Storage](machine-learning-data-science-move-azure-blob.md) to copy the data to your machine.

To copy the data using AzCopy:

1. Log in to your machine

2. Create a new directory in the machine's data disk (Note: If it is a virtual machine, do not use the Temporary Disk which comes with the virtual machine as a Data Disk).

3. From a Command Prompt window, run the following AzCopy commands, replacing <path_to_data_folder> with the path to your data folder created in (2):

		"C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\azcopy" /Source:https://nyctaxitrips.blob.core.windows.net/data /Dest:<path_to_data_folder> /S

	When the AzCopy completes, a total of 24 zipped CSV files (12 for trip\_data and 12 for trip\_fare) should be in the data folder.
	
	>[AZURE.NOTE] *Source:https://nyctaxitrips.blob.core.windows.net/data* specify a public Azure container that is used to share the zipped NYC Taxi data with users. Reading from this public Azure container does not require an access key. 

4. **Unzip** the downloaded files to the **same** directory on your machine. Note the folder where the uncompressed files reside. This folder will be referred to as the <path\_to\_unzipped_data\_files\>.


## <a name="upload"></a>Upload the data to the default container of Azure HDInsight Hadoop cluster

From a Command Prompt or a Windows PowerShell window in your machine, run the following AzCopy command, replacing the following parameters with the values that you specified when creating the Hadoop cluster. So replace:

* ***&#60;path_to_data_folder>*** with the data folder you created in the previous section 
* ***&#60;storage account name of Hadoop cluster>*** with the storage account used by your cluster
* ***&#60;default container of Hadoop cluster>*** with the default container used by your cluster
* ***&#60;storage account key>*** with the key for the storage account used by your cluster

Note that if ***nyctaxitripraw*** or ***nyctaxifareraw*** referenced in this command do not exist, they will be created in the container. Please keep in mind that you need to upload the trip data and the fare data to two ***different*** directories ***nyctaxitripraw*** and ***nyctaxifareraw***, respectively. Otherwise, the future step of loading data to Hive tables "trip" and "fare" will not load data correctly. 

This command will upload the trip data to ***nyctaxitripraw*** directory in the default container of the Hadoop cluster.

		"C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\azcopy" /Source:<path_to_unzipped_data_files> /Dest:https://<storage account name of Hadoop cluster>.blob.core.windows.net/<default container of Hadoop cluster>/nyctaxitripraw /DestKey:<storage account key> /S /Pattern:trip_data_*.csv

This command will upload the fare data to ***nyctaxifareraw*** directory in the default container of the Hadoop cluster.
		
		"C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\azcopy" /Source:<path_to_unzipped_data_files> /Dest:https://<storage account name of Hadoop cluster>.blob.core.windows.net/<default container of Hadoop cluster>/nyctaxifareraw /DestKey:<storage account key> /S /Pattern:trip_fare_*.csv

## <a name="#download-hql-files"></a>Log in to the head node of Hadoop cluster and download .hql files to C:\temp 

To access and run the Hive queries used in this walkthrough, [log on to the head node of the Hadoop cluster](https://azure.microsoft.com/en-us/documentation/articles/machine-learning-data-science-customize-hadoop-cluster/#headnode). In this walkthrough, some long Hive queries are stored in .hql files, you need to download these .hql files from the [Github](https://github.com/Azure/Azure-MachineLearning-DataScience/tree/master/Misc/DataScienceProcess/DataScienceScripts) repository to a local directory (C:\temp in this walkthrough) in the head node. In the head node of the Hadoop cluster, open the **Command Prompt**, and run the following two commands:

	set script='https://raw.githubusercontent.com/Azure/Azure-MachineLearning-DataScience/master/Misc/DataScienceProcess/DataScienceScripts/Download_DataScience_Scripts.ps1'

	@powershell -NoProfile -ExecutionPolicy unrestricted -Command "iex ((new-object net.webclient).DownloadString(%script%))"

These two commands will download all .hql files needed in this walkthrough to the local directory ***C:\temp&#92;*** in the head node. 

## <a name="#hive-db-tables"></a>Create Hive database and tables partitioned by month

In the head node of the Hadoop cluster, open the ***Hadoop Command Line*** on the desktop of the head node, and enter the Hive directory by entering the command

    cd %hive_home%\bin

If you need any additional assistance with these procedures or alternative ones, see the section [Submit Hive queries directly from the Hadoop Command Line ](machine-learning-data-science-process-hive-tables.md#submit). 

Enter the following command in Hadoop Command Line of the head node to submit the Hive query to create Hive database and tables:
	
	hive -f "C:\temp\sample_hive_create_db_and_tables.hql"

Here is the content of the ***C:\temp\sample\_hive\_create\_db\_and\_tables.hql*** file which creates Hive database ***nyctaxidb*** and tables ***trip*** and ***fare***.

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


## <a name="#load-data"></a>Load Data to tables by partitions
Run the following PowerShell commands in Hadoop Command Line to load data to the Hive tables by partitioned by month:

	for /L %i IN (1,1,12) DO (hive -hiveconf MONTH=%i -f "C:\temp\sample_hive_load_data_by_partitions.hql")

Here is content of the *sample\_hive\_load\_data\_by\_partitions.hql* file for inspection.

	LOAD DATA INPATH 'wasb:///nyctaxitripraw/trip_data_${hiveconf:MONTH}.csv' INTO TABLE nyctaxidb.trip PARTITION (month=${hiveconf:MONTH});
	LOAD DATA INPATH 'wasb:///nyctaxifareraw/trip_fare_${hiveconf:MONTH}.csv' INTO TABLE nyctaxidb.fare PARTITION (month=${hiveconf:MONTH});

### <a name="#show-db"></a>Show databases in HDInsight Hadoop cluster

To show the databases created in HDInsight Hadoop cluster inside the Hadoop Command Line window, run the following command in Hadoop Command Line:

	hive -e "show databases;"

### <a name="#show-tables"></a>Show the tables in the nyctaxidb database 
	
To show the tables in the nyctaxidb database, run the following command in Hadoop Command Line:
	
	hive -e "show tables in nyctaxidb;"
   
## <a name="#explore-hive"></a>Data exploration and feature engineering in Hive
The data exploration and feature engineering tasks for the data loaded into the Hive tables can be accomplished using Hive queries. Here are the examples of such tasks that we walk you through in this section:

- View the top 10 records in both tables.
- Explore data distributions of a few fields in varying time windows.
- Investigate data quality of the longitude and latitude fields.
- Generate binary and multiclass classification labels based on the **tip\_amount**.
- Generate features by computing the direct trip distances.
- Join the two tables and extract a random sample that will be used to build models.

To anticipate, after you have completes these data exploration and feature engineering in Hive, you are ready to proceed to Azure Machine Learning. You can save the final Hive query to extract and sample the data and then copy-paste the query directly into a Reader module in Azure Machine Learning. You will then be ready to build a model for this data.

### Exploration: View the top 10 records in table trip

To grasp the nature of the data schema and what the data looks like, users can extract the top 10 records from each table. Run the following two queries separately from Hadoop Command Line console to inspect the records.

To get the top 10 records in *table _trip_*:

	hive -e "select * from nyctaxidb.trip where month=1 limit 10;"
    
To get the top 10 records in *table _fare_*:
	
	hive -e "select * from nyctaxidb.fare where month=1 limit 10;"

### Exploration: View the number of records in each of the 12 partitions

Run the following command in Hadoop Command Line console to view the number of records in each of the 12 monthly partitions.
	
	hive -e "select month, count(*) from nyctaxidb.trip group by month;"

### Exploration: Trip distribution by medallion

This example identifies the medallion (taxi numbers) with more than 100 trips within a given time period. The query benefits from the partitioned table access since it is conditioned by the partition variable **month**. The query results are written to a local file queryoutput.tsv in `C:\temp` on the head node.

	hive -f "C:\temp\sample_hive_trip_count_by_medallion.hql" > C:\temp\queryoutput.tsv

Here is the content of *sample\_hive\_trip\_count\_by\_medallion.hql* file for inspection.

	SELECT medallion, COUNT(*) as med_count
	FROM nyctaxidb.fare
	WHERE month<=3
	GROUP BY medallion
	HAVING med_count > 100 
	ORDER BY med_count desc;

### Exploration: Trip distribution by medallion and hack_license

Here is an example of grouping by multiple columns of the table, in this case by the medallion and hack_license columns. Run the following command from Hadoop Command Line console:

	hive -f "C:\temp\sample_hive_trip_count_by_medallion_license.hql" > C:\temp\queryoutput.tsv

The query results are written to a local file queryoutput.tsv in `C:\temp` on the head node.

Here is the content of *sample\_hive\_trip\_count\_by\_medallion\_license.hql* file for inspection.
	
    SELECT medallion, hack_license, COUNT(*) as trip_count
	FROM nyctaxidb.fare
	WHERE month=1
	GROUP BY medallion, hack_license
	HAVING trip_count > 100
	ORDER BY trip_count desc;

### Data Quality Assessment: Verify records with invalid longitude and/or latitude

This example investigates whether any of the longitude and/or latitude fields either contain an invalid value (radian degrees should be between -90 and 90), or have (0, 0) coordinates.

Run the following command from Hadoop Command Line console:

	hive -S -f "C:\temp\sample_hive_quality_assessment.hql"

The *-S* argument included in this command suppresses the status screen printout of the Hive Map/Reduce jobs. This is useful because it makes the screen print of the Hive query output more readable. 

Here is the content of *sample\_hive\_quality\_assessment.hql* file for inspection.

    	SELECT COUNT(*) FROM nyctaxidb.trip
    	WHERE month=1
    	AND  (CAST(pickup_longitude AS float) NOT BETWEEN -90 AND -30
    	OR    CAST(pickup_latitude AS float) NOT BETWEEN 30 AND 90
	    OR    CAST(dropoff_longitude AS float) NOT BETWEEN -90 AND -30
	    OR    CAST(dropoff_latitude AS float) NOT BETWEEN 30 AND 90);

### Exploration: Frequencies of tipped and not tipped trips

This example finds the number of trips that were tipped vs. those that were not tipped in a given time period (or in the full dataset if covering the full year). This distribution reflects the binary label distribution to be used later for binary classification modeling.

Run the following command from Hadoop Command Line console:

	hive -f "C:\temp\sample_hive_tipped_frequencies.hql"

Here is the content of *sample\_hive\_tipped\_frequencies.hql* file for inspection.

    SELECT tipped, COUNT(*) AS tip_freq 
    FROM 
    (
        SELECT if(tip_amount > 0, 1, 0) as tipped, tip_amount
        FROM nyctaxidb.fare
    )tc
    GROUP BY tipped;

### Exploration: Frequencies of tip ranges

This example computes the distribution of tip ranges within a given time period (or in the full dataset if covering the full year). This is the distribution of the label classes that will be used later for the multiclass classification modeling.

Run the following command from Hadoop Command Line console:

	hive -f "C:\temp\sample_hive_tip_range_frequencies.hql"

Here is the content of *sample\_hive\_tip\_range\_frequencies.hql* for inspection.

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

Run the following commands from Hadoop Command Line console:

	hdfs dfs -mkdir wasb:///queryoutputdir

	hive -f "C:\temp\sample_hive_trip_direct_distance.hql"

The first command is a Hadoop command which creates a blob directory in the default container of the Hadoop cluster. This command is necessary since otherwise the second command will fail by complaining that the directory `queryoutputdir` cannot be found. In the *sample_hive_trip_direct_distance.hql* file, you can also specify any other existing blob directory within the default container of the Hadoop cluster. 

Here is the content of *sample\_hive\_trip\_direct\_distance.hql* file for inspection.

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

After the query completes, the results are written into 9 Azure blobs ***queryoutputdir/000000_0*** to  ***queryoutputdir/000008_0*** under the default container of the Hadoop cluster. If you use the Azure Storage Explorer, you should be able to see these blobs in the default container of the Hadoop cluster, as shown in the following figure.

![Create workspace][2]

Note that you can apply the filter (highlighted by red box) to retrieve only the blob with specified letters in names. 

After the query completes, you can use the Azure SDK to read the query output from Azure blob into a pandas data frame to conduct further explorations and processes. Please refer to [Process Azure Blob data in your data science environment](machine-learning-data-science-process-data-blob.md) for instructions on how to reading Azure blobs into pandas data frames. 
	
### Prepare data for model building

The query provided in this section joins the **nyctaxidb.trip** and **nyctaxidb.fare** tables, generates a binary classification label **tipped** and a multi-class classification label **tip\_class**. This query can be copied then pasted directly into the [Azure Machine Learning Studio](https://studio.azureml.net) Reader module for direct data ingestion from the **Hive Query** in Azure. This query also excludes records with incorrect latitude and/or longitude coordinates.

This query applies Hive embedded UDFs directly to generate several features from Hive records, including the hour, week of year, weekday (1 stands for Monday, and 7 stands for Sunday) of the field _pickup_datetime_, and the direct distance between the pickup and dropoff locations. Users can refer to [LanguageManual UDF](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF) for a complete list of embedded Hive UDFs.

This query also down-samples the data so that the query results can fit in the Azure Machine Learning Studio. Only about 1% is imported into the Studio.

Submit the query by running the following command from Hadoop Command Line console:

	hive -f "C:\temp\sample_hive_prepare_for_aml.hql" > C:\temp\queryoutput.tsv

The query results are written to a local file queryoutput.tsv in `C:\temp` on the head node.

Here is the content of *sample\_hive\_prepare\_for\_aml.hql* file for inspection.

	set R=3959;
    set pi=radians(180);
	
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
		t.direct_distance,
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
			${hiveconf:R}*2*2*atan((1-sqrt(1-pow(sin((dropoff_latitude-pickup_latitude)
        		*${hiveconf:pi}/180/2),2)-cos(pickup_latitude*${hiveconf:pi}/180)
        		*cos(dropoff_latitude*${hiveconf:pi}/180)*pow(sin((dropoff_longitude-pickup_longitude)*${hiveconf:pi}/180/2),2)))
        		/sqrt(pow(sin((dropoff_latitude-pickup_latitude)*${hiveconf:pi}/180/2),2)
        		+cos(pickup_latitude*${hiveconf:pi}/180)*cos(dropoff_latitude*${hiveconf:pi}/180)*
        		pow(sin((dropoff_longitude-pickup_longitude)*${hiveconf:pi}/180/2),2))) as direct_distance,
            rand() as sample_key 
        from nyctaxidb.trip
        where pickup_latitude between 30 and 90
            and pickup_longitude between -90 and -30
            and dropoff_latitude between 30 and 90
            and dropoff_longitude between -90 and -30
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

## <a name="mlmodel"></a>Build models in Azure Machine Learning

We are now ready to proceed to model building and model deployment in [Azure Machine Learning](https://studio.azureml.net). The data is now ready for us to use in addressing the prediction problems identified above:

1. **Binary classification**: To predict whether or not a tip was paid for a trip.

2. **Multiclass classification**: To predict the range of tip amounts paid for the trip, using the previously defined classes. 

3. **Regression task**: To predict the amount of tip paid for a trip.  

To begin the modeling exercise, log in to your Azure Machine Learning workspace. If you have not yet created a machine learning workspace, see [Create an Azure ML workspace](machine-learning-create-workspace.md).

1. To get started with Azure Machine Learning, see [What is Azure Machine Learning Studio?](machine-learning-what-is-ml-studio.md)

2. Log in to [Azure Machine Learning Studio](https://studio.azureml.net).

3. The Studio Home page provides a wealth of information, videos, tutorials, links to the Modules Reference, and other resources. For more information about Azure Machine Learning, consult the [Azure Machine Learning Documentation Center](http://azure.microsoft.com/documentation/services/machine-learning/).

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

In this exercise, we have already explored and engineered the data in Hive (steps 1-4), and decided on the sample size to ingest in Azure ML. To build one or more of the prediction models:

1. Get the data to Azure ML using the **Reader** module, available in the **Data Input and Output** section. For more information, see the [Reader](https://msdn.microsoft.com/library/azure/dn905997.aspx) module reference page.

	![Create workspace][15]

2. Select **Hive Query** as the **Data source** in the **Properties** panel.

3. Enter the HDInsight Hadoop cluster information as follows. The **Azure storage account name** has to be the storage account that is used to create the HDInsight Hadoop cluster, and **Azure container name** has to be the default container of the Hadoop cluster. The ***Hadoop user account name*** and the ***Hadoop user account password*** should be the ***Cluster*** user name and password, respectively, not the ***head node*** remote access user name and password. 

	![Create workspace][11]

4. In the **Hive database query** edit text area, paste the query which extracts the necessary database fields (including any computed fields such as the labels) and down samples the data to the desired sample size.

An example of a binary classification experiment reading data directly from the Hive Query is shown in the figure below. Similar experiments can be constructed for multiclass classification and regression problems.

![Create workspace][12]

> [AZURE.IMPORTANT] In the modeling data extraction and sampling query examples provided in previous sections, **all labels for the three modeling exercises are included in the query**. An important (required) step in each of the modeling exercises is to **exclude** the unnecessary labels for the other two problems, and any other **target leaks**. For e.g., when using binary classification, use the label **tipped** and exclude the fields **tip\_class**, **tip\_amount**, and **total\_amount**. The latter are target leaks since they imply the tip paid.

> In this experiment, the first **Metadata Editor** module adds column names to the output data from Reader module. This module is needed since the Reader module which reads data from Hive Query does not create column names for the output data. 

> To exclude unnecessary columns and/or target leaks, you may use the **Project Columns** module or the **Metadta Editor**. For more information, see [Project Columns](https://msdn.microsoft.com/library/azure/dn905883.aspx) and [Metadata Editor](https://msdn.microsoft.com/library/azure/dn905986.aspx) reference pages.

## <a name="mldeploy"></a>Deploy models in Azure Machine Learning

When your model is ready, you can deploy it as a web service directly from the experiment. For more information about publishing Azure ML web services, see [Publish an Azure Machine Learning web service](machine-learning-publish-a-machine-learning-web-service.md).

To deploy a new web service, you need to:

1. Create a scoring experiment.
2. Publish the web service.

To create a scoring experiment from a **Finished** training experiment, click **CREATE SCORING EXPERIMENT** in the lower action bar.

![Azure Scoring][13]

Azure Machine Learning will attempt to create a scoring experiment based on the components of the training experiment. In particular, it will:

1. Save the trained model and remove the model training modules.
2. Identify a logical **input port** to represent the expected input data schema.
3. Identify a logical **output port** to represent the expected web service output schema.

When the scoring experiment is created, review it and make adjust as needed. A typical adjustment is to replace the input dataset and/or query with one that excludes label fields, as these will not be available when the service is called. It is also a good practice to reduce the size of the input dataset and/or query to just a few records, sufficient to indicate the input schema. For the output port, it is common to exclude all input fields and to only include the **Scored Labels** and **Scored Probabilities** in the output using the **Project Columns** module.

A sample scoring experiment is shown in the figure below. When ready to publish, click the **PUBLISH WEB SERVICE** button in the lower action bar.

![Create workspace][14]

To recap, in this walkthrough tutorial, you have created an Azure data science environment that works with a large public dataset. Starting from data acquisition, and proceeding through the exploration and feature engineering tasks in the data science process, to model training and publishing of an Azure Machine Learning web service.

## License Information

This sample walkthrough and its accompanying scripts are shared by Microsoft under the MIT license. Please check the LICENSE.txt file in in the directory of the sample code on GitHub for more details.

## References

•	[Andrés Monroy NYC Taxi Trips Download Page](http://www.andresmh.com/nyctaxitrips/)  
•	[FOILing NYC’s Taxi Trip Data by Chris Whong](http://chriswhong.com/open-data/foil_nyc_taxi/)   
•	[NYC Taxi and Limousine Commission Research and Statistics](https://www1.nyc.gov/html/tlc/html/about/statistics.shtml)


[2]: ./media/machine-learning-data-science-process-hive-walkthrough/output-hive-results-3.png
[11]: ./media/machine-learning-data-science-process-hive-walkthrough/hive-reader-properties.png
[12]: ./media/machine-learning-data-science-process-hive-walkthrough/binary-classification-training.png
[13]: ./media/machine-learning-data-science-process-hive-walkthrough/create-scoring-experiment.png
[14]: ./media/machine-learning-data-science-process-hive-walkthrough/binary-classification-scoring.png
[15]: ./media/machine-learning-data-science-process-hive-walkthrough/amlreader.png