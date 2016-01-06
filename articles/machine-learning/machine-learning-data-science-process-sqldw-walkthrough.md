<properties
	pageTitle="The Cortana Analytics Process in action: using SQL Data Warehouse | Microsoft Azure"
	description="Advanced Analytics Process and Technology in Action"  
	services="machine-learning"
	documentationCenter=""
	authors="xibingao,hangzh,weig,bradsev"
	manager="paulettm"
	editor="cgronlun" />

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="12/21/2015" 
	ms.author="bradsev"/>


# The Cortana Analytics Process in action: using SQL Data Warehouse

In this tutorial, we will walk you through building and deploying a machine learning model using a publicly available dataset -- the [NYC Taxi Trips](http://www.andresmh.com/nyctaxitrips/) dataset. The procedure follows the Cortana Analytics Process (CAP) workflow.


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


## <a name="setup"></a>Setting Up the Azure data science environment for advanced analytics


In this tutorial we will demonstrate loading data to Azure SQL Data Warehouse (SQL DW), exploration data, engineering features, and building machine learning models.

To set up your Azure Data Science environment, follow the steps below.

1. Create your own Azure blob storage account. The NYC Taxi data used in this walkthrough is shared in a public blob storage container in Azure in a .csv format. In this walkthrough, the data will be copied to your own Azure blob storage before the data is uploaded to Azure SQL DW. 

	The public blob storage is located at ***South Central US***. When you provision your own Azure blob storage, please try to choose a geo-location of your Azure blob storage as close as possible to South Central US. A closer geo-location of your Azure blob storage will make Step 4 which copies data to your Azure blob storage faster than a geographically further Azure blob storage.

	Follow the documentation at [https://azure.microsoft.com/en-us/documentation/articles/storage-create-storage-account/](https://azure.microsoft.com/en-us/documentation/articles/storage-create-storage-account/) to create your own Azure storage account, if you don’t already have one. Please make notes on the following storage account credential. The data will be copied from the public blob storage container to a container in your own storage account.

	- Storage Account Name
	- Storage Account Key
	- Container Name (which you want the data to be stored in the Azure blob storage)

2. Provision your Azure SQL DW instance. Follow the documentation at [https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-get-started-provision/](https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-get-started-provision/) to provision a SQL Data Warehouse instance. Make sure that you make notations on the following SQL Data Warehouse credentials which will be used in later steps.
	
	- Server Name
	- SQLDW (Database) Name
	- User Name
	- Password

3. Make sure you can [connect to your Azure SQL DW with Visual Studio](https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-get-started-connect/). As a prerequisite, you need to [install Visual Studio 2015 and/or SSDT (SQL Server Data Tools) for SQL Data Warehouse](https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-install-visual-studio/). 

4. Create an Azure Machine Learning workspace under your Azure subscription. Follow the documentation at [https://azure.microsoft.com/en-us/documentation/articles/machine-learning-create-workspace/](https://azure.microsoft.com/en-us/documentation/articles/machine-learning-create-workspace/) to create an Azure Machine Learning workspace.

## <a name="getdata"></a>Load the data into SQL Data Warehouse

Open a Windows PowerShell command console. Run the following PowerShell commands to download the example SQL script files that we share with you on Github to a local directory you specify by parameter _-DestDir_. You can change the value of parameter _-DestDir_ to any local directory. If _-DestDir_ does not exist, it will be created by the PowerShell script. 

>You might need to Run as Administrator when executing the following PowerShell scripts if your DestDir needs Administrator privilege to create or write. 

	$source = "https://raw.githubusercontent.com/Azure/Azure-MachineLearning-DataScience/master/Misc/SQLDW/Download_Scripts_SQLDW_Walkthrough.ps1"
	$ps1_dest = "$pwd\Download_Scripts_SQLDW_Walkthrough.ps1"
	$wc = New-Object System.Net.WebClient
	$wc.DownloadFile($source, $ps1_dest) 
	.\Download_Scripts_SQLDW_Walkthrough.ps1 –DestDir 'C:\tempSQLDW'

After successful execution, your current working directory changes to _-DestDir_. You should be able to see screen like below:
![][19]

In your _-DestDir_, execute the following PowerShell script in administrator mode:

	./SQLDW_Data_Import.ps1

This PowerShell script file will complete the following tasks:

- Download and install AzCopy, if AzCopy is not installed
- Copy data from the public blob to your private blob storage account with AzCopy
- Load data from your private blob storage account to your Azure SQL DW
	- Create external tables for NYC taxi dataset on the blob storage account
	- Create tables (trip and fare tables) on SQL DW to store NYC taxi dataset
	- Import the NYC taxi dataset from external tables into SQL DW tables
	- Create a sample data table (NYCTaxi_Sample) and insert data to it from selecting SQL queries on the trip and fare tables. Some steps of this walkthrough needs to use this sample table. 

When the PowerShell script runs for the first time, you will be asked to input the information of your Azure SQL DW and your Azure blob storage account. After this PowerShell script completes running for the first time, the credentials you just input will be written to a configuration file SQLDW.conf in the present working directory. The future run of this PowerShell script file has the option to read all needed parameters from this configuration file. If you want to change some parameters, you can choose to input the parameters on the screen upon prompt, delete this configuration file, and input parameters as prompted. or change the parameters in the configuration file. 

Please be noted that in order to avoid name conflicts with tables that already exist in your Azure SQL DW (it might happen if multiple users are using the same Azure SQL DW as you are using to practice on this walkthrough), a random number is added to the table names created by every run of this PowerShell script. The actual table names that are created by this run of this PowerShell script file are printed out on your screen and also output to the SQLDW.conf file. 

Depending on the geographical location of your private blob storage account, the process of copying data from public blob to your private storage account could take about 15 minutes or longer,and the process of loading data from your storage account to your Azure SQL DW could takes about 20 minutes or longer.  

This Powershell script also plugs in the Azure SQL DW information into the data exploration example files ([SQL](./SQLDW_Explorations.sql) and [IPython notebook](./SQLDW_Explorations.ipynb)) so that these two files are ready to be tried out instantly after the PowerShell script completes. 

After successful execution, you will see screen like below:
![][20]

## <a name="dbexplore"></a>Data Exploration and Feature Engineering in Azure SQL Data Warehouse

In this section, we will perform data exploration and feature generation by running SQL queries against Azure SQL DW directly **Visual Studio Data Tools**. All SQL queries used in this section can be found in the sample script named **SQLDW_Explorations.sql**. This file has already been downloaded to your local directory by the PowerShell script. You can also get it from [Github](https://raw.githubusercontent.com/Azure/Azure-MachineLearning-DataScience/master/Misc/SQLDW/SQLDW_Explorations.sql).

In this exercise, we will:

- Connect to your Azure SQL DW using Visual Studio with the SQL DW login name and password.
- Explore data distributions of a few fields in varying time windows.
- Investigate data quality of the longitude and latitude fields.
- Generate binary and multiclass classification labels based on the **tip\_amount**.
- Generate features and compute/compare trip distances.
- Join the two tables and extract a random sample that will be used to build models.

For a quick verification of the number of rows and columns in the tables populated earlier using parallel bulk import,

	-- Report number of rows in table <nyctaxi_trip> without table scan
	SELECT SUM(rows) FROM sys.partitions WHERE object_id = OBJECT_ID('<nyctaxi_trip>')

	-- Report number of columns in table <nyctaxi_trip>
	SELECT COUNT(*) FROM information_schema.columns WHERE table_name = '<nyctaxi_trip>'

#### Exploration: Trip distribution by medallion

This example identifies the medallion (taxi numbers) with more than 100 trips within a given time period. The query would benefit from the partitioned table access since it is conditioned by the partition scheme of **pickup\_datetime**. Querying the full dataset will also make use of the partitioned table and/or index scan.

	SELECT medallion, COUNT(*)
	FROM <nyctaxi_fare>
	WHERE pickup_datetime BETWEEN '20130101' AND '20130331'
	GROUP BY medallion
	HAVING COUNT(*) > 100

#### Exploration: Trip distribution by medallion and hack_license

	SELECT medallion, hack_license, COUNT(*)
	FROM <nyctaxi_fare>
	WHERE pickup_datetime BETWEEN '20130101' AND '20130131'
	GROUP BY medallion, hack_license
	HAVING COUNT(*) > 100

#### Data Quality Assessment: Verify records with incorrect longitude and/or latitude

This example investigates if any of the longitude and/or latitude fields either contain an invalid value (radian degrees should be between -90 and 90), or have (0, 0) coordinates.

	SELECT COUNT(*) FROM <nyctaxi_trip>
	WHERE pickup_datetime BETWEEN '20130101' AND '20130331'
	AND  (CAST(pickup_longitude AS float) NOT BETWEEN -90 AND 90
	OR    CAST(pickup_latitude AS float) NOT BETWEEN -90 AND 90
	OR    CAST(dropoff_longitude AS float) NOT BETWEEN -90 AND 90
	OR    CAST(dropoff_latitude AS float) NOT BETWEEN -90 AND 90
	OR    (pickup_longitude = '0' AND pickup_latitude = '0')
	OR    (dropoff_longitude = '0' AND dropoff_latitude = '0'))

#### Exploration: Tipped vs. Not Tipped Trips distribution

This example finds the number of trips that were tipped vs. not tipped in a given time period (or in the full dataset if covering the full year). This distribution reflects the binary label distribution to be later used for binary classification modeling.

	SELECT tipped, COUNT(*) AS tip_freq FROM (
	  SELECT CASE WHEN (tip_amount > 0) THEN 1 ELSE 0 END AS tipped, tip_amount
	  FROM <nyctaxi_fare>
	  WHERE pickup_datetime BETWEEN '20130101' AND '20131231') tc
	GROUP BY tipped

#### Exploration: Tip Class/Range Distribution

This example computes the distribution of tip ranges in a given time period (or in the full dataset if covering the full year). This is the distribution of the label classes that will be used later for multiclass classification modeling.

	SELECT tip_class, COUNT(*) AS tip_freq FROM (
		SELECT CASE
			WHEN (tip_amount = 0) THEN 0
			WHEN (tip_amount > 0 AND tip_amount <= 5) THEN 1
			WHEN (tip_amount > 5 AND tip_amount <= 10) THEN 2
			WHEN (tip_amount > 10 AND tip_amount <= 20) THEN 3
			ELSE 4
		END AS tip_class
	FROM <nyctaxi_fare>
	WHERE pickup_datetime BETWEEN '20130101' AND '20131231') tc
	GROUP BY tip_class

#### Exploration: Compute and Compare Trip Distance

This example converts the pickup and drop-off longitude and latitude to SQL geography points, computes the trip distance using SQL geography points difference, and returns a random sample of the results for comparison. The example limits the results to valid coordinates only using the data quality assessment query covered earlier.

	/****** Object:  UserDefinedFunction [dbo].[fnCalculateDistance] ******/
	SET ANSI_NULLS ON
	GO

	SET QUOTED_IDENTIFIER ON
	GO

	IF EXISTS (SELECT * FROM sys.objects WHERE type IN ('FN', 'IF') AND name = 'fnCalculateDistance')
	  DROP FUNCTION fnCalculateDistance
	GO

	-- User-defined function calculate the direct distance between two geographical coordinates.
	CREATE FUNCTION [dbo].[fnCalculateDistance] (@Lat1 float, @Long1 float, @Lat2 float, @Long2 float)
	
	RETURNS float
	AS
	BEGIN
	  	DECLARE @distance decimal(28, 10)
  		-- Convert to radians
  		SET @Lat1 = @Lat1 / 57.2958
  		SET @Long1 = @Long1 / 57.2958
  		SET @Lat2 = @Lat2 / 57.2958
  		SET @Long2 = @Long2 / 57.2958
  		-- Calculate distance
  		SET @distance = (SIN(@Lat1) * SIN(@Lat2)) + (COS(@Lat1) * COS(@Lat2) * COS(@Long2 - @Long1))
  		--Convert to miles
  		IF @distance <> 0
  		BEGIN
    		SET @distance = 3958.75 * ATAN(SQRT(1 - POWER(@distance, 2)) / @distance);
  		END
  		RETURN @distance
	END
	GO

	SELECT pickup_latitude, pickup_longitude, dropoff_latitude, dropoff_longitude, 
	dbo.fnCalculateDistance(pickup_latitude, pickup_longitude, dropoff_latitude, dropoff_longitude) AS DirectDistance
	FROM <nyctaxi_trip>
	WHERE datepart("mi",pickup_datetime)=1
	AND CAST(pickup_latitude AS float) BETWEEN -90 AND 90
	AND CAST(dropoff_latitude AS float) BETWEEN -90 AND 90
	AND pickup_longitude != '0' AND dropoff_longitude != '0'

#### Feature Engineering using SQL Functions

Sometimes, SQL functions might be a more efficient option for feature engineering. In this walkthrough, we defined a SQL function to calculate the direct distance between the pickup and dropoff locations. You can run the following SQL scripts in Visual Studio Data Tools. 

The function definition SQL scripts and the SQL query that calls this function can be found in the 

	SET ANSI_NULLS ON
	GO

	SET QUOTED_IDENTIFIER ON
	GO

	IF EXISTS (SELECT * FROM sys.objects WHERE type IN ('FN', 'IF') AND name = 'fnCalculateDistance')
	  DROP FUNCTION fnCalculateDistance
	GO

	-- User-defined function calculate the direct distance between two geographical coordinates.
	CREATE FUNCTION [dbo].[fnCalculateDistance] (@Lat1 float, @Long1 float, @Lat2 float, @Long2 float)
	
	RETURNS float
	AS
	BEGIN
	  	DECLARE @distance decimal(28, 10)
  		-- Convert to radians
  		SET @Lat1 = @Lat1 / 57.2958
  		SET @Long1 = @Long1 / 57.2958
  		SET @Lat2 = @Lat2 / 57.2958
  		SET @Long2 = @Long2 / 57.2958
  		-- Calculate distance
  		SET @distance = (SIN(@Lat1) * SIN(@Lat2)) + (COS(@Lat1) * COS(@Lat2) * COS(@Long2 - @Long1))
  		--Convert to miles
  		IF @distance <> 0
  		BEGIN
    		SET @distance = 3958.75 * ATAN(SQRT(1 - POWER(@distance, 2)) / @distance);
  		END
  		RETURN @distance
	END
	GO 

Here is an example to call this function to generate features in your SQL query:

	-- Sample query to call the function to create features
	SELECT pickup_latitude, pickup_longitude, dropoff_latitude, dropoff_longitude, 
	dbo.fnCalculateDistance(pickup_latitude, pickup_longitude, dropoff_latitude, dropoff_longitude) AS DirectDistance
	FROM <nyctaxi_trip>
	WHERE datepart("mi",pickup_datetime)=1
	AND CAST(pickup_latitude AS float) BETWEEN -90 AND 90
	AND CAST(dropoff_latitude AS float) BETWEEN -90 AND 90
	AND pickup_longitude != '0' AND dropoff_longitude != '0'

#### Preparing Data for Model Building

The following query joins the **nyctaxi\_trip** and **nyctaxi\_fare** tables, generates a binary classification label **tipped**, a multi-class classification label **tip\_class**, and extracts a sample from the full joined dataset. The sampling is done by retrieving a subset of the trips based on pickup time.  This query can be copied then pasted directly in the [Azure Machine Learning Studio](https://studio.azureml.net) [Reader][reader] module for direct data ingestion from the SQL database instance in Azure. The query excludes records with incorrect (0, 0) coordinates.

	SELECT t.*, f.payment_type, f.fare_amount, f.surcharge, f.mta_tax, f.tolls_amount, 	f.total_amount, f.tip_amount,
	    CASE WHEN (tip_amount > 0) THEN 1 ELSE 0 END AS tipped,
	    CASE WHEN (tip_amount = 0) THEN 0
	        WHEN (tip_amount > 0 AND tip_amount <= 5) THEN 1
	        WHEN (tip_amount > 5 AND tip_amount <= 10) THEN 2
	        WHEN (tip_amount > 10 AND tip_amount <= 20) THEN 3
	        ELSE 4
	    END AS tip_class
	FROM <nyctaxi_trip> t, <nyctaxi_fare> f
	WHERE datepart("mi",t.pickup_datetime) = 1
	AND   t.medallion = f.medallion
	AND   t.hack_license = f.hack_license
	AND   t.pickup_datetime = f.pickup_datetime
	AND   pickup_longitude != '0' AND dropoff_longitude != '0'

When you are ready to proceed to Azure Machine Learning, you may either:  

1. Save the final SQL query to extract and sample the data and copy-paste the query directly into a [Reader][reader] module in Azure Machine Learning, or
2. Persist the sampled and engineered data you plan to use for model building in a new SQL DW table and use the new table in the [Reader][reader] module in Azure Machine Learning. The PowerShell script in earlier step has done this for you. You can directly read from this table in the Reader module. 


## <a name="ipnb"></a>Data Exploration and Feature Engineering in IPython Notebook

In this section, we will perform data exploration and feature generation
using both Python and SQL queries against the SQL DW created earlier. A sample IPython notebook named **SQLDW_Explorations.ipynb** has been downloaded to your local directory. It is also available on [GitHub](https://raw.githubusercontent.com/Azure/Azure-MachineLearning-DataScience/master/Misc/SQLDW/SQLDW_Explorations.ipynb).

The needed Azure SQL DW information in the IPython Notebook has been plugged in by the PowerShell script previously. You can open this notebook and run it directly.

The recommended sequence when working with large data is the following:

- Read in a small sample of the data into an in-memory data frame.
- Perform some visualizations and explorations using the sampled data.
- Experiment with feature engineering using the sampled data.
- For larger data exploration, data manipulation and feature engineering, use Python to issue SQL Queries directly against the SQL DW.
- Decide the sample size to use for Azure Machine Learning model building.

The followings are a few data exploration, data visualization, and feature engineering examples. More data explorations can be found in the sample IPython Notebook.

#### Initialize Database Credentials

Initialize your database connection settings in the following variables:

    SERVER_NAME=<server name>
    DATABASE_NAME=<database name>
    USERID=<user name>
    PASSWORD=<password>
    DB_DRIVER = <database driver>

#### Create Database Connection
    CONNECTION_STRING = 'DRIVER={'+DRIVER+'};SERVER='+SERVER_NAME+';DATABASE='+DATABASE_NAME+';UID='+USERID+';PWD='+PASSWORD
    conn = pyodbc.connect(CONNECTION_STRING)

#### Report number of rows and columns in table <nyctaxi_trip>

    nrows = pd.read_sql('''
		SELECT SUM(rows) FROM sys.partitions
		WHERE object_id = OBJECT_ID('<nyctaxi_trip>')
	''', conn)

	print 'Total number of rows = %d' % nrows.iloc[0,0]

    ncols = pd.read_sql('''
		SELECT COUNT(*) FROM information_schema.columns
		WHERE table_name = ('<nyctaxi_trip>')
	''', conn)

	print 'Total number of columns = %d' % ncols.iloc[0,0]

- Total number of rows = 173179759  
- Total number of columns = 14

#### Report number of rows and columns in table <nyctaxi_fare>

    nrows = pd.read_sql('''
		SELECT SUM(rows) FROM sys.partitions
		WHERE object_id = OBJECT_ID('<nyctaxi_fare>')
	''', conn)

	print 'Total number of rows = %d' % nrows.iloc[0,0]

    ncols = pd.read_sql('''
		SELECT COUNT(*) FROM information_schema.columns
		WHERE table_name = ('<nyctaxi_fare>')
	''', conn)

	print 'Total number of columns = %d' % ncols.iloc[0,0]

- Total number of rows = 173179759  
- Total number of columns = 11

#### Read-in a small data sample from the SQL Server Database

    t0 = time.time()

	query = '''
		SELECT TOP 10000 t.*, f.payment_type, f.fare_amount, f.surcharge, f.mta_tax,
			f.tolls_amount, f.total_amount, f.tip_amount
		FROM <nyctaxi_trip> t, <nyctaxi_fare> f
		WHERE datepart("mi",t.pickup_datetime) = 1
		AND   t.medallion = f.medallion
		AND   t.hack_license = f.hack_license
		AND   t.pickup_datetime = f.pickup_datetime
	'''

    df1 = pd.read_sql(query, conn)

    t1 = time.time()
    print 'Time to read the sample table is %f seconds' % (t1-t0)

    print 'Number of rows and columns retrieved = (%d, %d)' % (df1.shape[0], df1.shape[1])

Time to read the sample table is 14.096495 seconds  
Number of rows and columns retrieved = (1000, 21)

#### Descriptive Statistics

Now are ready to explore the sampled data. We start with
looking at descriptive statistics for the **trip\_distance** (or any other) field(s):

    df1['trip_distance'].describe()

#### Visualization: Box Plot Example

Next we look at the box plot for the trip distance to visualize the quantiles

    df1.boxplot(column='trip_distance',return_type='dict')

![Plot #1][1]

#### Visualization: Distribution Plot Example

    fig = plt.figure()
    ax1 = fig.add_subplot(1,2,1)
    ax2 = fig.add_subplot(1,2,2)
    df1['trip_distance'].plot(ax=ax1,kind='kde', style='b-')
    df1['trip_distance'].hist(ax=ax2, bins=100, color='k')

![Plot #2][2]

#### Visualization: Bar and Line Plots

In this example, we bin the trip distance into five bins and visualize the binning results.

    trip_dist_bins = [0, 1, 2, 4, 10, 1000]
    df1['trip_distance']
    trip_dist_bin_id = pd.cut(df1['trip_distance'], trip_dist_bins)
    trip_dist_bin_id

We can plot the above bin distribution in a bar or line plot as below

    pd.Series(trip_dist_bin_id).value_counts().plot(kind='bar')

![Plot #3][3]

    pd.Series(trip_dist_bin_id).value_counts().plot(kind='line')

![Plot #4][4]

#### Visualization: Scatterplot Example

We show scatter plot between **trip\_time\_in\_secs** and **trip\_distance** to see if there
is any correlation

    plt.scatter(df1['trip_time_in_secs'], df1['trip_distance'])

![Plot #6][6]

Similarly we can check the relationship between **rate\_code** and **trip\_distance**.

    plt.scatter(df1['passenger_count'], df1['trip_distance'])

![Plot #8][8]


### Data Exploration on Sampled Data using SQL Queries in IPython Notebook

In this section, we explore data distributions using the sampled data which is persisted in the new table we created above. Note that similar explorations can be performed using the original tables.

#### Exploration: Report number of rows and columns in the sampled table

	nrows = pd.read_sql('''SELECT SUM(rows) FROM sys.partitions WHERE object_id = OBJECT_ID('nyctaxi_sample')''', conn)
	print 'Number of rows in sample = %d' % nrows.iloc[0,0]

	ncols = pd.read_sql('''SELECT count(*) FROM information_schema.columns WHERE table_name = ('nyctaxi_sample')''', conn)
	print 'Number of columns in sample = %d' % ncols.iloc[0,0]

#### Exploration: Tipped/Not Tipped Distribution

	query = '''
        SELECT tipped, count(*) AS tip_freq
        FROM nyctaxi_sample
        GROUP BY tipped
        '''

	pd.read_sql(query, conn)

#### Exploration: Tip Class Distribution

	query = '''
        SELECT tip_class, count(*) AS tip_freq
        FROM nyctaxi_sample
        GROUP BY tip_class
	'''

	pd.read_sql(query, conn)

#### Exploration: Plot the Tip Distribution by class

	tip_class_dist['tip_freq'].plot(kind='bar')

#### Exploration: Daily distribution of trips

    query = '''
		SELECT CONVERT(date, dropoff_datetime) AS date, COUNT(*) AS c
		FROM nyctaxi_sample
		GROUP BY CONVERT(date, dropoff_datetime)
	'''

    pd.read_sql(query,conn)

#### Exploration: Trip distribution per medallion

    query = '''
		SELECT medallion,count(*) AS c
		FROM nyctaxi_sample
		GROUP BY medallion
	'''

	pd.read_sql(query,conn)

#### Exploration: Trip distribution by medallion and Hack License

	query = '''select medallion, hack_license,count(*) from nyctaxi_sample group by medallion, hack_license'''
	pd.read_sql(query,conn)


#### Exploration: Trip Time Distribution

	query = '''select trip_time_in_secs, count(*) from nyctaxi_sample group by trip_time_in_secs order by count(*) desc'''
	pd.read_sql(query,conn)

#### Exploration: Trip Distance Distribution

	query = '''select floor(trip_distance/5)*5 as tripbin, count(*) from nyctaxi_sample group by floor(trip_distance/5)*5 order by count(*) desc'''
	pd.read_sql(query,conn)

#### Exploration: Payment Type Distribution

	query = '''select payment_type,count(*) from nyctaxi_sample group by payment_type'''
	pd.read_sql(query,conn)

#### Verify the final form of the featurized table

    query = '''SELECT TOP 100 * FROM nyctaxi_sample'''
    pd.read_sql(query,conn)

We are now ready to proceed to model building and model deployment in [Azure Machine Learning](https://studio.azureml.net). The data is ready for any of the prediction problems identified earlier, namely:

1. Binary classification: To predict whether or not a tip was paid for a trip.

2. Multiclass classification: To predict the range of tip paid, according to the previously defined classes.

3. Regression task: To predict the amount of tip paid for a trip.  


## <a name="mlmodel"></a>Building Models in Azure Machine Learning

To begin the modeling exercise, log in to your Azure Machine Learning workspace. If you have not yet created a machine learning workspace, see [Create an Azure ML workspace](machine-learning-create-workspace.md).

1. To get started with Azure Machine Learning, see [What is Azure Machine Learning Studio?](machine-learning-what-is-ml-studio.md)

2. Log in to [Azure Machine Learning Studio](https://studio.azureml.net).

3. The Studio Home page provides a wealth of information, videos, tutorials, links to the Modules Reference, and other resources. Fore more information about Azure Machine Learning, consult the [Azure Machine Learning Documentation Center](http://azure.microsoft.com/documentation/services/machine-learning/).

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

In this exercise, we have already explored and engineered the data in SQL Server, and decided on the sample size to ingest in Azure ML. To build one or more of the prediction models we decided:

1. Get the data to Azure ML using the [Reader][reader] module, available in the **Data Input and Output** section. For more information, see the [Reader][reader] module reference page.

	![Azure ML Reader][17]

2. Select **Azure SQL Database** as the **Data source** in the **Properties** panel.

3. Enter the database DNS name in the **Database server name** field. Format: `tcp:<your_virtual_machine_DNS_name>,1433`

4. Enter the **Database name** in the corresponding field.

5. Enter the **SQL user name** in the **Server user aqccount name, and the password in the **Server user account password**.

6. Check **Accept any server certificate** option.

7. In the **Database query** edit text area, paste the query which extracts the necessary database fields (including any computed fields such as the labels) and down samples the data to the desired sample size.

An example of a binary classification experiment reading data directly from the SQL Server database is in the figure below. Similar experiments can be constructed for multiclass classification and regression problems.

![Azure ML Train][10]

> [AZURE.IMPORTANT] In the modeling data extraction and sampling query examples provided in previous sections, **all labels for the three modeling exercises are included in the query**. An important (required) step in each of the modeling exercises is to **exclude** the unnecessary labels for the other two problems, and any other **target leaks**. For e.g., when using binary classification, use the label **tipped** and exclude the fields **tip\_class**, **tip\_amount**, and **total\_amount**. The latter are target leaks since they imply the tip paid.
>
> To exclude unnecessary columns and/or target leaks, you may use the [Project Columns][project-columns] module or the [Metadata Editor][metadata-editor]. For more information, see [Project Columns][project-columns] and [Metadata Editor][metadata-editor] reference pages.

## <a name="mldeploy"></a>Deploying Models in Azure Machine Learning

When your model is ready, you can easily deploy it as a web service directly from the experiment. For more information about deploying Azure ML web services, see [Deploy an Azure Machine Learning web service](machine-learning-publish-a-machine-learning-web-service.md).

To deploy a new web service, you need to:

1. Create a scoring experiment.
2. Deploy the web service.

To create a scoring experiment from a **Finished** training experiment, click **CREATE SCORING EXPERIMENT** in the lower action bar.

![Azure Scoring][18]

Azure Machine Learning will attempt to create a scoring experiment based on the components of the training experiment. In particular, it will:

1. Save the trained model and remove the model training modules.
2. Identify a logical **input port** to represent the expected input data schema.
3. Identify a logical **output port** to represent the expected web service output schema.

When the scoring experiment is created, review it and adjust as needed. A typical adjustment is to replace the input dataset and/or query with one which excludes label fields, as these will not be available when the service is called. It is also a good practice to reduce the size of the input dataset and/or query to a few records, just enough to indicate the input schema. For the output port, it is common to exclude all input fields and only include the **Scored Labels** and **Scored Probabilities** in the output using the [Project Columns][project-columns] module.

A sample scoring experiment is in the figure below. When ready to deploy, click the **PUBLISH WEB SERVICE** button in the lower action bar.

![Azure ML Publish][11]

To recap, in this walkthrough tutorial, you have created an Azure data science environment, worked with a large public dataset all the way from data acquisition to model training and deploying of an Azure Machine Learning web service.

### License Information

This sample walkthrough and its accompanying scripts and IPython notebook(s) are shared by Microsoft under the MIT license. Please check the LICENSE.txt file in in the directory of the sample code on GitHub for more details.

### References

•	[Andrés Monroy NYC Taxi Trips Download Page](http://www.andresmh.com/nyctaxitrips/)  
•	[FOILing NYC’s Taxi Trip Data by Chris Whong](http://chriswhong.com/open-data/foil_nyc_taxi/)   
•	[NYC Taxi and Limousine Commission Research and Statistics](https://www1.nyc.gov/html/tlc/html/about/statistics.shtml)


[1]: ./media/machine-learning-data-science-process-sqldw-walkthrough/sql-walkthrough_26_1.png
[2]: ./media/machine-learning-data-science-process-sqldw-walkthrough/sql-walkthrough_28_1.png
[3]: ./media/machine-learning-data-science-process-sqldw-walkthrough/sql-walkthrough_35_1.png
[4]: ./media/machine-learning-data-science-process-sqldw-walkthrough/sql-walkthrough_36_1.png
[5]: ./media/machine-learning-data-science-process-sqldw-walkthrough/sql-walkthrough_39_1.png
[6]: ./media/machine-learning-data-science-process-sqldw-walkthrough/sql-walkthrough_42_1.png
[7]: ./media/machine-learning-data-science-process-sqldw-walkthrough/sql-walkthrough_44_1.png
[8]: ./media/machine-learning-data-science-process-sqldw-walkthrough/sql-walkthrough_46_1.png
[9]: ./media/machine-learning-data-science-process-sqldw-walkthrough/sql-walkthrough_71_1.png
[10]: ./media/machine-learning-data-science-process-sqldw-walkthrough/azuremltrain.png
[11]: ./media/machine-learning-data-science-process-sqldw-walkthrough/azuremlpublish.png
[12]: ./media/machine-learning-data-science-process-sqldw-walkthrough/ssmsconnect.png
[13]: ./media/machine-learning-data-science-process-sqldw-walkthrough/executescript.png
[14]: ./media/machine-learning-data-science-process-sqldw-walkthrough/sqlserverproperties.png
[15]: ./media/machine-learning-data-science-process-sqldw-walkthrough/sqldefaultdirs.png
[16]: ./media/machine-learning-data-science-process-sqldw-walkthrough/bulkimport.png
[17]: ./media/machine-learning-data-science-process-sqldw-walkthrough/amlreader.png
[18]: ./media/machine-learning-data-science-process-sqldw-walkthrough/amlscoring.png
[19]: ./media/machine-learning-data-science-process-sqldw-walkthrough/ps_download_scripts.png
[20]: ./media/machine-learning-data-science-process-sqldw-walkthrough/ps_load_data.png


<!-- Module References -->
[metadata-editor]: https://msdn.microsoft.com/library/azure/370b6676-c11c-486f-bf73-35349f842a66/
[project-columns]: https://msdn.microsoft.com/library/azure/1ec722fa-b623-4e26-a44e-a50c6d726223/
[reader]: https://msdn.microsoft.com/library/azure/4e1b0fe6-aded-4b3f-a36f-39b8862b9004/
