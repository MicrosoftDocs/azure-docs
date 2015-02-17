<properties title="Azure Data Science Process in Action" pageTitle="Azure Data Science Process in Action | Azure" description="Azure Data Science Process in Action" metaKeywords="" services="data-science-process" solutions="" documentationCenter="" authors="msolhab,fashah" manager="jacob.spoelstra" editor="" videoId="" scriptId="" />

<tags ms.service="data-science-process" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="02/19/2015" ms.author="msolhab,fashah" /> 

                
# Azure Data Science Process in Action

In this tutorial, you will follow the Azure Data Science Process map end-to-end to build and deploy a model using a publicly available dataset -- the [NYC Taxi Trips](http://www.andresmh.com/nyctaxitrips/) dataset. 

The following sections are organized as follows:

- [NYC Taxi Trips Dataset Description](#dataset)
- [Example Prediction Problems](#mltasks)
- [Setting Up the Azure Data Science Environment](#setup)
- [Get the Data from Public Source](#getdata)
- [Bulk Import Data into SQL Server Database](#dbload)
- [Data Exploration and Feature Engineering in SQL Server](#dbexplore)
- [Data Exploration and Feature Engineering in IPython Notebook](#ipnb)
- [Building Models in Azure Machine Learning](#mlmodel)
- [Deploying Models in Azure Machine Learning](#mldeploy)

## <a name="dataset"></a>NYC Taxi Trips Dataset Description

The NYC Taxi Trip data is about 20GB of compressed CSV data (~48GB uncompressed), comprising more than 173 million individual trips and the fares paid. Each trip record includes the pickup and drop-off location and time, anonymized hack (driver's) license number and medallion (taxi’s unique id) number. The data covers all trips in the year 2013, provided in two datasets for each month:

1. The trip_data CSV contains the trip details, such as number of passengers, pickup and dropoff points, trip duration, and trip length. These are a few sample records.

		medallion,hack_license,vendor_id,rate_code,store_and_fwd_flag,pickup_datetime,dropoff_datetime,passenger_count,trip_time_in_secs,trip_distance,pickup_longitude,pickup_latitude,dropoff_longitude,dropoff_latitude
		89D227B655E5C82AECF13C3F540D4CF4,BA96DE419E711691B9445D6A6307C170,CMT,1,N,2013-01-01 15:11:48,2013-01-01 15:18:10,4,382,1.00,-73.978165,40.757977,-73.989838,40.751171
		0BD7C8F5BA12B88E0B67BED28BEA73D8,9FD8F69F0804BDB5549F40E9DA1BE472,CMT,1,N,2013-01-06 00:18:35,2013-01-06 00:22:54,1,259,1.50,-74.006683,40.731781,-73.994499,40.75066
		0BD7C8F5BA12B88E0B67BED28BEA73D8,9FD8F69F0804BDB5549F40E9DA1BE472,CMT,1,N,2013-01-05 18:49:41,2013-01-05 18:54:23,1,282,1.10,-74.004707,40.73777,-74.009834,40.726002
		DFD2202EE08F7A8DC9A57B02ACB81FE2,51EE87E3205C985EF8431D850C786310,CMT,1,N,2013-01-07 23:54:15,2013-01-07 23:58:20,2,244,.70,-73.974602,40.759945,-73.984734,40.759388
		DFD2202EE08F7A8DC9A57B02ACB81FE2,51EE87E3205C985EF8431D850C786310,CMT,1,N,2013-01-07 23:25:03,2013-01-07 23:34:24,1,560,2.10,-73.97625,40.748528,-74.002586,40.747868

2. The trip_fare CSV contains details of the fare paid for each trip, such as payment type, fare amount, surcharge and taxes, tips and tolls, and the total amount paid. These are a few sample records.

		medallion, hack_license, vendor_id, pickup_datetime, payment_type, fare_amount, surcharge, mta_tax, tip_amount, tolls_amount, total_amount
		89D227B655E5C82AECF13C3F540D4CF4,BA96DE419E711691B9445D6A6307C170,CMT,2013-01-01 15:11:48,CSH,6.5,0,0.5,0,0,7
		0BD7C8F5BA12B88E0B67BED28BEA73D8,9FD8F69F0804BDB5549F40E9DA1BE472,CMT,2013-01-06 00:18:35,CSH,6,0.5,0.5,0,0,7
		0BD7C8F5BA12B88E0B67BED28BEA73D8,9FD8F69F0804BDB5549F40E9DA1BE472,CMT,2013-01-05 18:49:41,CSH,5.5,1,0.5,0,0,7
		DFD2202EE08F7A8DC9A57B02ACB81FE2,51EE87E3205C985EF8431D850C786310,CMT,2013-01-07 23:54:15,CSH,5,0.5,0.5,0,0,6
		DFD2202EE08F7A8DC9A57B02ACB81FE2,51EE87E3205C985EF8431D850C786310,CMT,2013-01-07 23:25:03,CSH,9.5,0.5,0.5,0,0,10.5

The unique key to join trip\_data and trip\_fare is composed of the fields: medallion, hack\_licence, and pickup\_datetime.

## <a name="mltasks"></a>Example Prediction Tasks

We will formulate three prediction problems based on the *tip\_amount*, namely:

1. Binary classification: To predict whether or not a tip was paid for a trip, i.e., a *tip\_amount* that is greater than $0 is a positive example, which a *tip\_amount* of $0 is a negative example.

2. Multiclass classification: To predict the range of tip paid for the trip. We divide the *tip\_amount* into five classes:
	
		Class 0 : tip_amount = $0
		Class 1 : tip_amount > $0 and tip_amount <= $5
		Class 2 : tip_amount > $5 and tip_amount <= $10
		Class 3 : tip_amount > $10 and tip_amount <= $20
		Class 4 : tip_amount > $20

3. Regression task: To predict the amount of tip paid for a trip.  


## <a name="setup"></a>Setting Up the Azure Data Science Environment

Using the [Plan Your Environment](./machine-learning-data-science-plan-your-environment.md/) guide, there are several options to work with the NYC Taxi Trips dataset in Azure:

- Work with the data in Azure blobs then model in Azure Machine Learning
- Load the data into an SQL Server database then model in Azure Machine Learning

In this tutorial, we will demonstrate parallel bulk import of the data to SQL Server, data exploration, feature engineering, and down sampling in SQL Server Management Studio as well as using IPython Notebook. [Sample scripts](https://github.com/Azure/Azure-MachineLearning-DataScience/tree/master/Misc/DataScienceProcess/DataScienceScripts) and [IPython notebooks](https://github.com/Azure/Azure-MachineLearning-DataScience/tree/master/Misc/DataScienceProcess/iPythonNotebooks) are shared in GitHub. Sample IPython notebbok to work with the data in Azure blobs is also shared.

To set up your Azure Data Science environment:

1. [Create a storage account](http://azure.microsoft.com/en-us/documentation/articles/storage-whatis-account/)

2. [Create an Azure ML workspace](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-create-workspace/)

3. [Provision a Data Science Virtual Machine](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-data-science-setup-sql-server-virtual-machine/), which will serve as an SQL Server as well an IPython Notebook server.

> [AZURE.NOTE] The sample scripts and IPython notebooks will be downloaded to your Data Science virtual machine during the setup process.

Based on the dataset size, data source location, and the selected Azure target environment, this scenario is similar to [Scenario \#5: Large dataset in a local files, target SQL Server in Azure VM](#largelocaltodb).

## <a name="getdata"></a>Get the Data from Public Source

To get the [NYC Taxi Trips](http://www.andresmh.com/nyctaxitrips/) dataset from its public location, you may use any of the methods described in [Move Data to and from Azure Blob Storage](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-data-science-move-azure-blob/) to copy the data to your new virtual machine.

To copy the data using AzCopy:

1. Log in to your virtual machine (VM)

2. Create a new directory in the VM's data disk (Note: Do not use the Temporary Disk which comes with the VM as a Data Disk).

3. In a Command Prompt window, run the following Azcopy command line, replacing <path_to_data_folder> with your data folder created in (2):

		"C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\azcopy" /Source:https://nyctaxitrips.blob.core.windows.net/data /Dest:<path_to_data_folder> /S

4. Unzip the downloaded files. Note the folder where the uncompressed files reside. This folder will be referred to as the <path\_to\_data\_files\>.

## <a name="dbload"></a>Bulk Import Data into SQL Server Database


## <a name="dbexplore"></a>Data Exploration and Feature Engineering in SQL Server


## <a name="ipnb"></a>Data Exploration and Feature Engineering in IPython Notebook

We are going to show data exploration and feature generation
using both Python and SQL queries for the data sourced from SQL Server hosted on
Azure VM. We would start off with reading in a small sample of the data in
Pandas and doing some visualizations and explorations around the data. Next, we
would show how to use Python to issue SQL Queries to do larger data manipulation
directly within SQL VM on Azure.

We start with loading a small sample of the data in Pandas data frame and
performing some explorations on the sample.

First we would join the Trip and Fare data sub-sample the data to load 0.1%
sample of the full dataset in Pandas dataframe. We assume that you have created
the database, and the Trip and Fare tables and loaded the taxi data in the
tables. If you haven't done this already please refer to the documentation.

#### Initialize Database Credentials

    SERVER_NAME=<server name>
    DATABASE_NAME=<database name>
    USERID=<user name>
    PASSWORD=<password>
    DB_DRIVER = <database server>

#### Create Database Connection

    CONNECTION_STRING = 'DRIVER={'+DRIVER+'};SERVER='+SERVER_NAME+';DATABASE='+DATABASE_NAME+';UID='+USERID+';PWD='+PASSWORD
    conn = pyodbc.connect(CONNECTION_STRING)

#### Report number of rows and columns in table nyctaxi_trip

    nrows = pd.read_sql('''
		SELECT SUM(rows) FROM sys.partitions 
		WHERE object_id = OBJECT_ID('nyctaxi_trip')
	''', conn)
    
	print 'Total number of rows = %d' % nrows.iloc[0,0]
    
    ncols = pd.read_sql('''
		SELECT COUNT(*) FROM information_schema.columns 
		WHERE table_name = ('nyctaxi_trip')
	''', conn)
    
	print 'Total number of columns = %d' % ncols.iloc[0,0]

Total number of rows = 173179759  
Total number of columns = 14
    
#### Report number of rows and columns in table nyctaxi_fare

    nrows = pd.read_sql('''
		SELECT SUM(rows) FROM sys.partitions 
		WHERE object_id = OBJECT_ID('nyctaxi_fare')
	''', conn)
    
	print 'Total number of rows = %d' % nrows.iloc[0,0]
    
    ncols = pd.read_sql('''
		SELECT COUNT(*) FROM information_schema.columns 
		WHERE table_name = ('nyctaxi_fare')
	''', conn)
    
	print 'Total number of columns = %d' % ncols.iloc[0,0]

Total number of rows = 173179759  
Total number of columns = 11

#### Read-in data from SQL Server

    t0 = time.time()
    
    #load only a small percentage of the 1% table we created for some quick visuals
	query = '''
		SELECT t.*, f.payment_type, f.fare_amount, f.surcharge, f.mta_tax, 
			f.tolls_amount, f.total_amount, f.tip_amount 
		FROM nyctaxi_trip t, nyctaxi_fare f 
		TABLESAMPLE (0.05 PERCENT)
		WHERE t.medallion = f.medallion 
		AND   t.hack_license = f.hack_license 
		AND   t.pickup_datetime = f.pickup_datetime
	'''

    df1 = pd.read_sql(query, conn)
    
    t1 = time.time()
    print 'Time to read the sample table is %f seconds' % (t1-t0)
    
    print 'Number of rows and columns retrieved = (%d, %d)' % (df1.shape[0], df1.shape[1])

Time to read the sample table is 6.492000 seconds  
Number of rows and columns retrieved = (84952, 21)
    
#### Descriptive Statistics

Now are ready to do exploration on the 0.2 percent sample data. We start with
looking at descriptive statistics for the trip distance:

    df1['trip_distance'].describe()

#### Box Plot

Next we look at the box plot for the trip distance to visualize the quantiles

    df1.boxplot(column='trip_distance',return_type='dict')

![Plot #1][1]

#### Distribution Plot

    fig = plt.figure()
    ax1 = fig.add_subplot(1,2,1)
    ax2 = fig.add_subplot(1,2,2)
    df1['trip_distance'].plot(ax=ax1,kind='kde', style='b-')
    df1['trip_distance'].hist(ax=ax2, bins=100, color='k')

![Plot #2][2]

#### Binning trip_distance

    trip_dist_bins = [0, 1, 2, 4, 10, 1000]
    df1['trip_distance']
    trip_dist_bin_id = pd.cut(df1['trip_distance'], trip_dist_bins)
    trip_dist_bin_id

#### Bar and Line Plots

The distribution of the trip distance values after binning looks like following:

    pd.Series(trip_dist_bin_id).value_counts()

We can plot the above bin distribution in a bar or line plot as below

    pd.Series(trip_dist_bin_id).value_counts().plot(kind='bar')

![Plot #3][3]

    pd.Series(trip_dist_bin_id).value_counts().plot(kind='line')

![Plot #4][4]


We can also do bar plot for visualizing the sum of passengers for each vendor as
follows

    vendor_passenger_sum = df1.groupby('vendor_id').passenger_count.sum()
    print vendor_passenger_sum

    vendor_passenger_sum.plot(kind='bar')

![Plot #5][5]


#### Scatterplot 

We show scatter plot between trip_time_in_secs and trip_distance to see if there
is any correlation

    plt.scatter(df1['trip_time_in_secs'], df1['trip_distance'])

![Plot #6][6]


To further drill down on the relationship we can do distribution side by side
with the scatter plot (while flipping independentand dependent variables) as
follows

    df1_2col = df1[['trip_time_in_secs','trip_distance']]
    pd.scatter_matrix(df1_2col, diagonal='hist', color='b', alpha=0.7, hist_kwds={'bins':100})

![Plot #7][7]

Similarly we can check the relationship between rate_code and trip_distance
using scatter plot

    plt.scatter(df1['passenger_count'], df1['trip_distance'])

![Plot #8][8]


## Sub-Sampling the Data in SQL

First we would join the Trip and Fare data and generate a sub-sample based on 1%
sample of the full dataset. We assume that you have created the database, and
the Trip and Fare tables and loaded the taxi data in the tables. If you haven't
done this already please refer to the documentation.

Please note that we are going to create sampled table named as
nyctaxi_one_percent, if a table with this name already exists you may want to
rename the table in the code below. Also, if you have run this code once and
created the table already, you need to be aware that executing create table
would fail and inserting into existing table would result in duplicate data
being inserted.

    IF OBJECT_ID('nyctaxi_one_percent', 'U') IS NOT NULL DROP TABLE nyctaxi_one_percent

#### Create a Sample Table and Populate with 1% of the Joined Tables. Drop Table First If Exists.

Assuming that the trip data is stored in the table nyctaxi_trip and the fare
data is stored in the table nyctaxi_fare, we can join the two tables as shown
below:

    cursor = conn.cursor()
    
    drop_table_if_exists = '''
        IF OBJECT_ID('nyctaxi_one_percent', 'U') IS NOT NULL DROP TABLE nyctaxi_one_percent
    '''
    
    nyctaxi_one_percent_insert = '''
        SELECT t.*, f.payment_type, f.fare_amount, f.surcharge, f.mta_tax, f.tolls_amount, f.total_amount, f.tip_amount
		INTO nyctaxi_one_percent 
		FROM nyctaxi_trip t, nyctaxi_fare f
		TABLESAMPLE (1 PERCENT)
		WHERE t.medallion = f.medallion
		AND   t.hack_license = f.hack_license
		AND   t.pickup_datetime = f.pickup_datetime
		AND   pickup_longitude <> '0' AND dropoff_longitude <> '0'
    '''
    
    cursor.execute(drop_table_if_exists)
    cursor.execute(nyctaxi_one_percent_insert)
    cursor.commit()

#### Report number of rows and columns in the new sample table

    nrows = pd.read_sql('''
		SELECT SUM(rows) FROM sys.partitions 
		WHERE object_id = OBJECT_ID('nyctaxi_one_percent')
	''', conn)
    
	print 'Number of rows in sample = %d' % nrows.iloc[0,0]
    
    ncols = pd.read_sql('''
		SELECT COUNT(*) FROM information_schema.columns 
		WHERE table_name = ('nyctaxi_one_percent')
	''', conn)
    
	print 'Number of columns in sample = %d' % ncols.iloc[0,0]

Number of rows in sample = 1682551  
Number of columns in sample = 21
    

#### Generate Class Labels

We would generate two types of class labels

1. Binary Class Labels (indicating if a tip would be given)
2. MultiClass Labels (Binned tip amount prediction)

		nyctaxi_one_percent_add_col = '''
			ALTER TABLE nyctaxi_one_percent ADD tipped bit, tip_class int
		'''
		
		cursor.execute(nyctaxi_one_percent_add_col)
		cursor.commit()
    
    	nyctaxi_one_percent_update_col = '''
        	UPDATE nyctaxi_one_percent 
            SET 
               tipped = CASE WHEN (tip_amount > 0) THEN 1 ELSE 0 END,
               tip_class = CASE WHEN (tip_amount = 0) THEN 0
                                WHEN (tip_amount > 0 AND tip_amount <= 5) THEN 1
                                WHEN (tip_amount > 5 AND tip_amount <= 10) THEN 2
                                WHEN (tip_amount > 10 AND tip_amount <= 20) THEN 3
                                ELSE 4
                            END
        '''

    	cursor.execute(nyctaxi_one_percent_update_col)
		cursor.commit()

    	cursor.close()

We can read in the sub-sample data in the table above in Azure ML for Machine
Learning directly. We would be showing some examples of exploring the data using
SQL or doing feature generation outside Azure ML in the sections below. We would
also show some visualizatios on the data below.

## Exploration in SQL

In this section, we would be doing some explorations using SQL on 1% sample of
that data (that we created above).

#### Tipped/Not Tipped Distribution

    query = '''
        SELECT tipped, count(*) AS tip_freq
        FROM nyctaxi_one_percent
        GROUP BY tipped
    '''
    
    pd.read_sql(query, conn)

#### Tip Class Distribution

    query = '''
        SELECT tip_class, count(*) AS tip_freq
        FROM nyctaxi_one_percent
        GROUP BY tip_class
    '''
    
    tip_class_dist = pd.read_sql(query, conn)
    tip_class_dist

#### Plot the tip distribution by class

    tip_class_dist['tip_freq'].plot(kind='bar')

![Plot #9][9]


#### Daily distribution of trips

    query = '''
		SELECT CONVERT(date, dropoff_datetime) AS date, COUNT(*) AS c 
		FROM nyctaxi_one_percent 
		GROUP BY CONVERT(date, dropoff_datetime)
	'''

    pd.read_sql(query,conn)

#### Trip distribution per medallion

    query = '''
		SELECT medallion,count(*) AS c 
		FROM nyctaxi_one_percent 
		GROUP BY medallion
	'''
    
	pd.read_sql(query,conn)

#### Trip time distribution

    query = '''
		SELECT trip_time_in_secs, COUNT(*) 
		FROM nyctaxi_one_percent 
		GROUP BY trip_time_in_secs
	'''

    pd.read_sql(query,conn)

#### Trip distance distribution

    query = '''
		SELECT trip_distance, COUNT(*) 
		FROM nyctaxi_one_percent 
		GROUP BY trip_distance
	'''

    pd.read_sql(query,conn)

#### Payment type distribution

    query = '''
		SELECT payment_type, COUNT(*) 
		FROM nyctaxi_one_percent 
		GROUP BY payment_type
	'''

    pd.read_sql(query,conn)

## Feature Generation in SQL

In this section we are going to show feature generation using SQL, operating on
the 1% sample table we created in the previous section.

    cursor = conn.cursor()

#### Count Features for Categorical Columns

    nyctaxi_one_percent_insert_col = '''
		ALTER TABLE nyctaxi_one_percent ADD cmt_count int, vts_count int
	'''

    cursor.execute(nyctaxi_one_percent_insert_col)
    cursor.commit()

    nyctaxi_one_percent_update_col = '''
		WITH B AS 
		(
			SELECT medallion, hack_license, 
				SUM(CASE WHEN vendor_id = 'cmt' THEN 1 ELSE 0 END) AS cmt_count,
				SUM(CASE WHEN vendor_id = 'vts' THEN 1 ELSE 0 END) AS vts_count
			FROM nyctaxi_one_percent 
			GROUP BY medallion, hack_license
		) 
    
		UPDATE nyctaxi_one_percent 
		SET nyctaxi_one_percent.cmt_count = B.cmt_count,
			nyctaxi_one_percent.vts_count = B.vts_count
		FROM nyctaxi_one_percent A INNER JOIN B 
		ON A.medallion = B.medallion AND A.hack_license = B.hack_license
	'''
    
    cursor.execute(nyctaxi_one_percent_update_col)
    cursor.commit()

    query = '''SELECT TOP 10 * FROM nyctaxi_one_percent'''
    pd.read_sql(query,conn)

#### Bin features for Numerical Columns

    nyctaxi_one_percent_insert_col = '''
		ALTER TABLE nyctaxi_one_percent ADD trip_time_bin int
	'''

    cursor.execute(nyctaxi_one_percent_insert_col)
    cursor.commit()

    nyctaxi_one_percent_update_col = '''
		WITH B(medallion,hack_license,pickup_datetime,trip_time_in_secs, BinNumber ) AS 
		(
			SELECT medallion,hack_license,pickup_datetime,trip_time_in_secs, 
			NTILE(5) OVER (ORDER BY trip_time_in_secs) AS BinNumber from nyctaxi_one_percent
		)
    
		UPDATE nyctaxi_one_percent 
		SET trip_time_bin = B.BinNumber
		FROM nyctaxi_one_percent A INNER JOIN B 
		ON A.medallion = B.medallion
		AND A.hack_license = B.hack_license
		AND A.pickup_datetime = B.pickup_datetime
	'''
    
    cursor.execute(nyctaxi_one_percent_update_col)
    cursor.commit()

    query = '''SELECT TOP 10 * FROM nyctaxi_one_percent'''
    pd.read_sql(query,conn)

#### Location Features

    nyctaxi_one_percent_insert_col = '''
		ALTER TABLE nyctaxi_one_percent 
		ADD l1 varchar(6), l2 varchar(3), l3 varchar(3), l4 varchar(3),
			l5 varchar(3), l6 varchar(3), l7 varchar(3)
	'''

    cursor.execute(nyctaxi_one_percent_insert_col)
    cursor.commit()

    nyctaxi_one_percent_update_col = '''
		UPDATE nyctaxi_one_percent
		SET l1=round(pickup_longitude,0) 
			, l2 = CASE WHEN LEN (PARSENAME(ROUND(ABS(pickup_longitude) - FLOOR(ABS(pickup_longitude)),6),1)) >= 1 THEN SUBSTRING(PARSENAME(ROUND(ABS(pickup_longitude) - FLOOR(ABS(pickup_longitude)),6),1),1,1) ELSE '0' END     
			, l3 = CASE WHEN LEN (PARSENAME(ROUND(ABS(pickup_longitude) - FLOOR(ABS(pickup_longitude)),6),1)) >= 2 THEN SUBSTRING(PARSENAME(ROUND(ABS(pickup_longitude) - FLOOR(ABS(pickup_longitude)),6),1),2,1) ELSE '0' END     
			, l4 = CASE WHEN LEN (PARSENAME(ROUND(ABS(pickup_longitude) - FLOOR(ABS(pickup_longitude)),6),1)) >= 3 THEN SUBSTRING(PARSENAME(ROUND(ABS(pickup_longitude) - FLOOR(ABS(pickup_longitude)),6),1),3,1) ELSE '0' END     
			, l5 = CASE WHEN LEN (PARSENAME(ROUND(ABS(pickup_longitude) - FLOOR(ABS(pickup_longitude)),6),1)) >= 4 THEN SUBSTRING(PARSENAME(ROUND(ABS(pickup_longitude) - FLOOR(ABS(pickup_longitude)),6),1),4,1) ELSE '0' END     
			, l6 = CASE WHEN LEN (PARSENAME(ROUND(ABS(pickup_longitude) - FLOOR(ABS(pickup_longitude)),6),1)) >= 5 THEN SUBSTRING(PARSENAME(ROUND(ABS(pickup_longitude) - FLOOR(ABS(pickup_longitude)),6),1),5,1) ELSE '0' END     
			, l7 = CASE WHEN LEN (PARSENAME(ROUND(ABS(pickup_longitude) - FLOOR(ABS(pickup_longitude)),6),1)) >= 6 THEN SUBSTRING(PARSENAME(ROUND(ABS(pickup_longitude) - FLOOR(ABS(pickup_longitude)),6),1),6,1) ELSE '0' END 
	'''

    cursor.execute(nyctaxi_one_percent_update_col)
    cursor.commit()

#### Verify the final form of the featurized table

    query = '''SELECT TOP 100 * FROM nyctaxi_one_percent'''
    pd.read_sql(query,conn)

    conn.close()

We are now ready for importing the above table in Azure ML (having generated the
sub-sample and derived features) and start Machine Learning for predicting the
binary class (whether a tip would be given) or multiclass (tip bin number) or
regression (tip amount).

## <a name="mlmodel"></a>Building Models in Azure Machine Learning

![Azure ML Train][10]

## <a name="mldeploy"></a>Deploying Models in Azure Machine Learning

![Azure ML Publish][11]

### License Information

This sample walkthrough and its accompanying scripts and IPython notebook(s) are shared by Microsoft under the MIT license. Users please check the LICENSE.txt in the same directory of the sample code for more details.

### References

•	[Andrés Monroy NYC Taxi Trips Download Page](http://www.andresmh.com/nyctaxitrips/)  
•	[FOILing NYC’s Taxi Trip Data by Chris Whong](http://chriswhong.com/open-data/foil_nyc_taxi/)   
•	[NYC Taxi and Limousine Commision Research and Statistics](https://www1.nyc.gov/html/tlc/html/about/statistics.shtml)


[1]: ./media/machine-Learning-data-science-process-sql-walkthrough/sql-walkthrough_26_1.png
[2]: ./media/machine-Learning-data-science-process-sql-walkthrough/sql-walkthrough_28_1.png
[3]: ./media/machine-Learning-data-science-process-sql-walkthrough/sql-walkthrough_35_1.png
[4]: ./media/machine-Learning-data-science-process-sql-walkthrough/sql-walkthrough_36_1.png
[5]: ./media/machine-Learning-data-science-process-sql-walkthrough/sql-walkthrough_39_1.png
[6]: ./media/machine-Learning-data-science-process-sql-walkthrough/sql-walkthrough_42_1.png
[7]: ./media/machine-Learning-data-science-process-sql-walkthrough/sql-walkthrough_44_1.png
[8]: ./media/machine-Learning-data-science-process-sql-walkthrough/sql-walkthrough_46_1.png
[9]: ./media/machine-Learning-data-science-process-sql-walkthrough/sql-walkthrough_71_1.png
[10]: ./media/machine-Learning-data-science-process-sql-walkthrough/azuremltrain.png
[11]: ./media/machine-Learning-data-science-process-sql-walkthrough/azuremlpublish.png
