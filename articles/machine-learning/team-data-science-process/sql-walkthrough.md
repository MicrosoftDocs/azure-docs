---
title: Build and deploy a model in a SQL Server VM - Team Data Science Process
description: Build and deploy a machine learning model using SQL Server on an Azure VM with a publicly available dataset.
services: machine-learning
author: marktab
manager: cgronlun
editor: cgronlun
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 01/29/2017
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---
# The Team Data Science Process in action: using SQL Server
In this tutorial, you walk through the process of building and deploying a machine learning model using SQL Server and a publicly available dataset -- the [NYC Taxi Trips](https://www.andresmh.com/nyctaxitrips/) dataset. The procedure follows a standard data science workflow: ingest and explore the data, engineer features to facilitate learning, then build and deploy a model.

## <a name="dataset"></a>NYC Taxi Trips Dataset Description
The NYC Taxi Trip data is about 20GB of compressed CSV files (~48GB uncompressed), comprising more than 173 million individual trips and the fares paid for each trip. Each trip record includes the pickup and dropoff location and time, anonymized hack (driver's) license number and medallion (taxi’s unique id) number. The data covers all trips in the year 2013 and is provided in the following two datasets for each month:

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
As you can see from the [Plan Your Environment](plan-your-environment.md) guide, there are several options to work with the NYC Taxi Trips dataset in Azure:

* Work with the data in Azure blobs then model in Azure Machine Learning
* Load the data into a SQL Server database then model in Azure Machine Learning

In this tutorial we will demonstrate parallel bulk import of the data to a SQL Server, data exploration, feature engineering and down sampling using SQL Server Management Studio as well as using IPython Notebook. [Sample scripts](https://github.com/Azure/Azure-MachineLearning-DataScience/tree/master/Misc/DataScienceProcess/DataScienceScripts) and [IPython notebooks](https://github.com/Azure/Azure-MachineLearning-DataScience/tree/master/Misc/DataScienceProcess/iPythonNotebooks) are shared in GitHub. A sample IPython notebook to work with the data in Azure blobs is also available in the same location.

To set up your Azure Data Science environment:

1. [Create a storage account](../../storage/common/storage-quickstart-create-account.md)
2. [Create an Azure Machine Learning workspace](../studio/create-workspace.md)
3. [Provision a Data Science Virtual Machine](../data-science-virtual-machine/setup-sql-server-virtual-machine.md), which provides a SQL Server and an IPython Notebook server.
   
   > [!NOTE]
   > The sample scripts and IPython notebooks will be downloaded to your Data Science virtual machine during the setup process. When the VM post-installation script completes, the samples will be in your VM's Documents library:  
   > 
   > * Sample Scripts: `C:\Users\<user_name>\Documents\Data Science Scripts`  
   > * Sample IPython Notebooks: `C:\Users\<user_name>\Documents\IPython Notebooks\DataScienceSamples`  
   >   where `<user_name>` is your VM's Windows login name. We will refer to the sample folders as **Sample Scripts** and **Sample IPython Notebooks**.
   > 
   > 

Based on the dataset size, data source location, and the selected Azure target environment, this scenario is similar to [Scenario \#5: Large dataset in a local files, target SQL Server in Azure VM](plan-sample-scenarios.md#largelocaltodb).

## <a name="getdata"></a>Get the Data from Public Source
To get the [NYC Taxi Trips](https://www.andresmh.com/nyctaxitrips/) dataset from its public location, you may use any of the methods described in [Move Data to and from Azure Blob Storage](move-azure-blob.md) to copy the data to your new virtual machine.

To copy the data using AzCopy:

1. Log in to your virtual machine (VM)
2. Create a new directory in the VM's data disk (Note: Do not use the Temporary Disk which comes with the VM as a Data Disk).
3. In a Command Prompt window, run the following Azcopy command line, replacing <path_to_data_folder> with your data folder created in (2):
   
        "C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\azcopy" /Source:https://nyctaxitrips.blob.core.windows.net/data /Dest:<path_to_data_folder> /S
   
    When the AzCopy completes, a total of 24 zipped CSV files (12 for trip\_data and 12 for trip\_fare) should be in the data folder.
4. Unzip the downloaded files. Note the folder where the uncompressed files reside. This folder will be referred to as the <path\_to\_data\_files\>.

## <a name="dbload"></a>Bulk Import Data into SQL Server Database
The performance of loading/transferring large amounts of data to an SQL database and subsequent queries can be improved by using *Partitioned Tables and Views*. In this section, we will follow the instructions described in [Parallel Bulk Data Import Using SQL Partition Tables](parallel-load-sql-partitioned-tables.md) to create a new database and load the data into partitioned tables in parallel.

1. While logged in to your VM, start **SQL Server Management Studio**.
2. Connect using Windows Authentication.
   
    ![SSMS Connect][12]
3. If you have not yet changed the SQL Server authentication mode and created a new SQL login user, open the script file named **change\_auth.sql** in the **Sample Scripts** folder. Change the  default user name and password. Click **!Execute** in the toolbar to run the script.
   
    ![Execute Script][13]
4. Verify and/or change the SQL Server default database and log folders to ensure that newly created databases will be stored in a Data Disk. The SQL Server VM image that is optimized for datawarehousing loads is pre-configured with data and log disks. If your VM did not include a Data Disk and you added new virtual hard disks during the VM setup process, change the default folders as follows:
   
   * Right-click the SQL Server name in the left panel and click **Properties**.
     
       ![SQL Server Properties][14]
   * Select **Database Settings** from the **Select a page** list to the left.
   * Verify and/or change the **Database default locations** to the **Data Disk** locations of your choice. This is where new databases reside if created with the default location settings.
     
       ![SQL Database Defaults][15]  
5. To create a new database and a set of filegroups to hold the partitioned tables, open the sample script **create\_db\_default.sql**. The script will create a new database named **TaxiNYC** and 12 filegroups in the default data location. Each filegroup will hold one month of trip\_data and trip\_fare data. Modify the database name, if desired. Click **!Execute** to run the script.
6. Next, create two partition tables, one for the trip\_data and another for the trip\_fare. Open the sample script **create\_partitioned\_table.sql**, which will:
   
   * Create a partition function to split the data by month.
   * Create a partition scheme to map each month's data to a different filegroup.
   * Create two partitioned tables mapped to the partition scheme: **nyctaxi\_trip** will hold the trip\_data and **nyctaxi\_fare** will hold the trip\_fare data.
     
     Click **!Execute** to run the script and create the partitioned tables.
7. In the **Sample Scripts** folder, there are two sample PowerShell scripts provided to demonstrate parallel bulk imports of data to SQL Server tables.
   
   * **bcp\_parallel\_generic.ps1** is a generic script to parallel bulk import data into a table. Modify this script to set the input and target variables as indicated in the comment lines in the script.
   * **bcp\_parallel\_nyctaxi.ps1** is a pre-configured version of the generic script and can be used to load both tables for the NYC Taxi Trips data.  
8. Right-click the **bcp\_parallel\_nyctaxi.ps1** script name and click **Edit** to open it in PowerShell. Review the preset variables and modify according to your selected database name, input data folder, target log folder, and paths to the  sample format files **nyctaxi_trip.xml** and **nyctaxi\_fare.xml** (provided in the **Sample Scripts** folder).
   
    ![Bulk Import Data][16]
   
    You may also select the authentication mode, default is Windows Authentication. Click the green arrow in the toolbar to run. The script will launch 24 bulk import operations in parallel, 12 for each partitioned table. You may monitor the data import progress by opening the SQL Server default data folder as set above.
9. The PowerShell script reports the starting and ending times. When all bulk imports complete, the ending time is reported. Check the target log folder to verify that the bulk imports were successful, i.e., no errors reported in the target log folder.
10. Your database is now ready for exploration, feature engineering, and other operations as desired. Since the tables are partitioned according to the **pickup\_datetime** field, queries which include **pickup\_datetime** conditions in the **WHERE** clause will benefit from the partition scheme.
11. In **SQL Server Management Studio**, explore the provided sample script **sample\_queries.sql**. To run any of the sample queries, highlight the query lines then click **!Execute** in the toolbar.
12. The NYC Taxi Trips data is loaded in two separate tables. To improve join operations, it is highly recommended to index the tables. The sample script **create\_partitioned\_index.sql** creates partitioned indexes on the composite join key **medallion, hack\_license, and pickup\_datetime**.

## <a name="dbexplore"></a>Data Exploration and Feature Engineering in SQL Server
In this section, we will perform data exploration and feature generation by running SQL queries directly in the **SQL Server Management Studio** using the SQL Server database created earlier. A sample script named **sample\_queries.sql** is provided in the **Sample Scripts** folder. Modify the script to change the database name, if it is different from the default: **TaxiNYC**.

In this exercise, we will:

* Connect to **SQL Server Management Studio** using either Windows Authentication or using SQL Authentication and the SQL login name and password.
* Explore data distributions of a few fields in varying time windows.
* Investigate data quality of the longitude and latitude fields.
* Generate binary and multiclass classification labels based on the **tip\_amount**.
* Generate features and compute/compare trip distances.
* Join the two tables and extract a random sample that will be used to build models.

When you are ready to proceed to Azure Machine Learning, you may either:  

1. Save the final SQL query to extract and sample the data and copy-paste the query directly into a [Import Data][import-data] module in Azure Machine Learning, or
2. Persist the sampled and engineered data you plan to use for model building in a new database table and use the new table in the [Import Data][import-data] module in Azure Machine Learning.

In this section we will save the final query to extract and sample the data. The second method is demonstrated in the [Data Exploration and Feature Engineering in IPython Notebook](#ipnb) section.

For a quick verification of the number of rows and columns in the tables populated earlier using parallel bulk import,

    -- Report number of rows in table nyctaxi_trip without table scan
    SELECT SUM(rows) FROM sys.partitions WHERE object_id = OBJECT_ID('nyctaxi_trip')

    -- Report number of columns in table nyctaxi_trip
    SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'nyctaxi_trip'

#### Exploration: Trip distribution by medallion
This example identifies the medallion (taxi numbers) with more than 100 trips within a given time period. The query would benefit from the partitioned table access since it is conditioned by the partition scheme of **pickup\_datetime**. Querying the full dataset will also make use of the partitioned table and/or index scan.

    SELECT medallion, COUNT(*)
    FROM nyctaxi_fare
    WHERE pickup_datetime BETWEEN '20130101' AND '20130331'
    GROUP BY medallion
    HAVING COUNT(*) > 100

#### Exploration: Trip distribution by medallion and hack_license
    SELECT medallion, hack_license, COUNT(*)
    FROM nyctaxi_fare
    WHERE pickup_datetime BETWEEN '20130101' AND '20130131'
    GROUP BY medallion, hack_license
    HAVING COUNT(*) > 100

#### Data Quality Assessment: Verify records with incorrect longitude and/or latitude
This example investigates if any of the longitude and/or latitude fields either contain an invalid value (radian degrees should be between -90 and 90), or have (0, 0) coordinates.

    SELECT COUNT(*) FROM nyctaxi_trip
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
      FROM nyctaxi_fare
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
    FROM nyctaxi_fare
    WHERE pickup_datetime BETWEEN '20130101' AND '20131231') tc
    GROUP BY tip_class

#### Exploration: Compute and Compare Trip Distance
This example converts the pickup and dropoff longitude and latitude to SQL geography points, computes the trip distance using SQL geography points difference, and returns a random sample of the results for comparison. The example limits the results to valid coordinates only using the data quality assessment query covered earlier.

    SELECT
    pickup_location=geography::STPointFromText('POINT(' + pickup_longitude + ' ' + pickup_latitude + ')', 4326)
    ,dropoff_location=geography::STPointFromText('POINT(' + dropoff_longitude + ' ' + dropoff_latitude + ')', 4326)
    ,trip_distance
    ,computedist=round(geography::STPointFromText('POINT(' + pickup_longitude + ' ' + pickup_latitude + ')', 4326).STDistance(geography::STPointFromText('POINT(' + dropoff_longitude + ' ' + dropoff_latitude + ')', 4326))/1000, 2)
    FROM nyctaxi_trip
    tablesample(0.01 percent)
    WHERE CAST(pickup_latitude AS float) BETWEEN -90 AND 90
    AND   CAST(dropoff_latitude AS float) BETWEEN -90 AND 90
    AND   pickup_longitude != '0' AND dropoff_longitude != '0'

#### Feature Engineering in SQL Queries
The label generation and geography conversion exploration queries can also be used to generate labels/features by removing the counting part. Additional feature engineering SQL examples are provided in the [Data Exploration and Feature Engineering in IPython Notebook](#ipnb) section. It is more efficient to run the feature generation queries on the full dataset or a large subset of it using SQL queries which run directly on the SQL Server database instance. The queries may be executed in **SQL Server Management Studio**, IPython Notebook or any development tool/environment which can access the database locally or remotely.

#### Preparing Data for Model Building
The following query joins the **nyctaxi\_trip** and **nyctaxi\_fare** tables, generates a binary classification label **tipped**, a multi-class classification label **tip\_class**, and extracts a 1% random sample from the full joined dataset. This query can be copied then pasted directly in the [Azure Machine Learning Studio](https://studio.azureml.net) [Import Data][import-data] module for direct data ingestion from the SQL Server database instance in Azure. The query excludes records with incorrect (0, 0) coordinates.

    SELECT t.*, f.payment_type, f.fare_amount, f.surcharge, f.mta_tax, f.tolls_amount,     f.total_amount, f.tip_amount,
        CASE WHEN (tip_amount > 0) THEN 1 ELSE 0 END AS tipped,
        CASE WHEN (tip_amount = 0) THEN 0
            WHEN (tip_amount > 0 AND tip_amount <= 5) THEN 1
            WHEN (tip_amount > 5 AND tip_amount <= 10) THEN 2
            WHEN (tip_amount > 10 AND tip_amount <= 20) THEN 3
            ELSE 4
        END AS tip_class
    FROM nyctaxi_trip t, nyctaxi_fare f
    TABLESAMPLE (1 percent)
    WHERE t.medallion = f.medallion
    AND   t.hack_license = f.hack_license
    AND   t.pickup_datetime = f.pickup_datetime
    AND   pickup_longitude != '0' AND dropoff_longitude != '0'


## <a name="ipnb"></a>Data Exploration and Feature Engineering in IPython Notebook
In this section, we will perform data exploration and feature generation
using both Python and SQL queries against the SQL Server database created earlier. A sample IPython notebook named **machine-Learning-data-science-process-sql-story.ipynb** is provided in the **Sample IPython Notebooks** folder. This notebook is also available on [GitHub](https://github.com/Azure/Azure-MachineLearning-DataScience/tree/master/Misc/DataScienceProcess/iPythonNotebooks).

The recommended sequence when working with big data is the following:

* Read in a small sample of the data into an in-memory data frame.
* Perform some visualizations and explorations using the sampled data.
* Experiment with feature engineering using the sampled data.
* For larger data exploration, data manipulation and feature engineering, use Python to issue SQL Queries directly against the SQL Server database in the Azure VM.
* Decide the sample size to use for Azure Machine Learning model building.

When ready to proceed to Azure Machine Learning, you may either:  

1. Save the final SQL query to extract and sample the data and copy-paste the query directly into a [Import Data][import-data] module in Azure Machine Learning. This method is demonstrated in the [Building Models in Azure Machine Learning](#mlmodel) section.    
2. Persist the sampled and engineered data you plan to use for model building in a new database table, then use the new table in the [Import Data][import-data] module.

The following are a few data exploration, data visualization, and feature engineering examples. For more examples, see the sample SQL IPython notebook in the **Sample IPython Notebooks** folder.

#### Initialize Database Credentials
Initialize your database connection settings in the following variables:

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

* Total number of rows = 173179759  
* Total number of columns = 14

#### Read-in a small data sample from the SQL Server Database
    t0 = time.time()

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

### Sub-Sampling the Data in SQL
When preparing data for model building in [Azure Machine Learning Studio](https://studio.azureml.net), you may either decide on the **SQL query to use directly in the Import Data module** or persist the engineered and sampled data in a new table, which you could use in the [Import Data][import-data] module with a simple **SELECT * FROM <your\_new\_table\_name>**.

In this section we will create a new table to hold the sampled and engineered data. An example of a direct SQL query for model building is provided in the [Data Exploration and Feature Engineering in SQL Server](#dbexplore) section.

#### Create a Sample Table and Populate with 1% of the Joined Tables. Drop Table First if it Exists.
In this section, we join the tables **nyctaxi\_trip** and **nyctaxi\_fare**, extract a 1% random sample, and persist the sampled data in a new table name **nyctaxi\_one\_percent**:

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

### Data Exploration using SQL Queries in IPython Notebook
In this section, we explore data distributions using the 1% sampled data which is persisted in the new table we created above. Note that similar explorations can be performed using the original tables, optionally using **TABLESAMPLE** to limit the exploration sample or by limiting the results to a given time period using the **pickup\_datetime** partitions, as illustrated in the [Data Exploration and Feature Engineering in SQL Server](#dbexplore) section.

#### Exploration: Daily distribution of trips
    query = '''
        SELECT CONVERT(date, dropoff_datetime) AS date, COUNT(*) AS c
        FROM nyctaxi_one_percent
        GROUP BY CONVERT(date, dropoff_datetime)
    '''

    pd.read_sql(query,conn)

#### Exploration: Trip distribution per medallion
    query = '''
        SELECT medallion,count(*) AS c
        FROM nyctaxi_one_percent
        GROUP BY medallion
    '''

    pd.read_sql(query,conn)

### Feature Generation Using SQL Queries in IPython Notebook
In this section we will generate new labels and features directly using SQL queries, operating on the 1% sample table we created in the previous section.

#### Label Generation: Generate Class Labels
In the following example, we generate two sets of labels to use for modeling:

1. Binary Class Labels **tipped** (predicting if a tip will be given)
2. Multiclass Labels **tip\_class** (predicting the tip bin or range)
   
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

#### Feature Engineering: Count Features for Categorical Columns
This example transforms a categorical field into a numeric field by replacing each category with the count of its occurrences in the data.

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

#### Feature Engineering: Bin features for Numerical Columns
This example transforms a continuous numeric field into preset category ranges, i.e., transform numeric field into a categorical field.

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

#### Feature Engineering: Extract Location Features from Decimal Latitude/Longitude
This example breaks down the decimal representation of a latitude and/or longitude field into multiple region fields of different granularity, such as, country/region, city, town, block, etc. Note that the new geo-fields are not mapped to actual locations. For information on mapping geocode locations, see [Bing Maps REST Services](https://msdn.microsoft.com/library/ff701710.aspx).

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

We are now ready to proceed to model building and model deployment in [Azure Machine Learning](https://studio.azureml.net). The data is ready for any of the prediction problems identified earlier, namely:

1. Binary classification: To predict whether or not a tip was paid for a trip.
2. Multiclass classification: To predict the range of tip paid, according to the previously defined classes.
3. Regression task: To predict the amount of tip paid for a trip.  

## <a name="mlmodel"></a>Building Models in Azure Machine Learning
To begin the modeling exercise, log in to your Azure Machine Learning workspace. If you have not yet created a machine learning workspace, see [Create an Azure Machine Learning workspace](../studio/create-workspace.md).

1. To get started with Azure Machine Learning, see [What is Azure Machine Learning Studio?](../studio/what-is-ml-studio.md)
2. Log in to [Azure Machine Learning Studio](https://studio.azureml.net).
3. The Studio Home page provides a wealth of information, videos, tutorials, links to the Modules Reference, and other resources. Fore more information about Azure Machine Learning, consult the [Azure Machine Learning Documentation Center](https://azure.microsoft.com/documentation/services/machine-learning/).

A typical training experiment consists of the following:

1. Create a **+NEW** experiment.
2. Get the data to Azure Machine Learning.
3. Pre-process, transform and manipulate the data as needed.
4. Generate features as needed.
5. Split the data into training/validation/testing datasets(or have separate datasets for each).
6. Select one or more machine learning algorithms depending on the learning problem to solve. E.g., binary classification, multiclass classification, regression.
7. Train one or more models using the training dataset.
8. Score the validation dataset using the trained model(s).
9. Evaluate the model(s) to compute the relevant metrics for the learning problem.
10. Fine tune the model(s) and select the best model to deploy.

In this exercise, we have already explored and engineered the data in SQL Server, and decided on the sample size to ingest in Azure Machine Learning. To build one or more of the prediction models we decided:

1. Get the data to Azure Machine Learning using the [Import Data][import-data] module, available in the **Data Input and Output** section. For more information, see the [Import Data][import-data] module reference page.
   
    ![Azure Machine Learning Import Data][17]
2. Select **Azure SQL Database** as the **Data source** in the **Properties** panel.
3. Enter the database DNS name in the **Database server name** field. Format: `tcp:<your_virtual_machine_DNS_name>,1433`
4. Enter the **Database name** in the corresponding field.
5. Enter the **SQL user name** in the **Server user account name**, and the **password** in the **Server user account password**.
7. In the **Database query** edit text area, paste the query which extracts the necessary database fields (including any computed fields such as the labels) and down samples the data to the desired sample size.

An example of a binary classification experiment reading data directly from the SQL Server database is in the figure below. Similar experiments can be constructed for multiclass classification and regression problems.

![Azure Machine Learning Train][10]

> [!IMPORTANT]
> In the modeling data extraction and sampling query examples provided in previous sections, **all labels for the three modeling exercises are included in the query**. An important (required) step in each of the modeling exercises is to **exclude** the unnecessary labels for the other two problems, and any other **target leaks**. For e.g., when using binary classification, use the label **tipped** and exclude the fields **tip\_class**, **tip\_amount**, and **total\_amount**. The latter are target leaks since they imply the tip paid.
> 
> To exclude unnecessary columns and/or target leaks, you may use the [Select Columns in Dataset][select-columns] module or the [Edit Metadata][edit-metadata]. For more information, see [Select Columns in Dataset][select-columns] and [Edit Metadata][edit-metadata] reference pages.
> 
> 

## <a name="mldeploy"></a>Deploying Models in Azure Machine Learning
When your model is ready, you can easily deploy it as a web service directly from the experiment. For more information about deploying Azure Machine Learning web services, see [Deploy an Azure Machine Learning web service](../studio/publish-a-machine-learning-web-service.md).

To deploy a new web service, you need to:

1. Create a scoring experiment.
2. Deploy the web service.

To create a scoring experiment from a **Finished** training experiment, click **CREATE SCORING EXPERIMENT** in the lower action bar.

![Azure Scoring][18]

Azure Machine Learning will attempt to create a scoring experiment based on the components of the training experiment. In particular, it will:

1. Save the trained model and remove the model training modules.
2. Identify a logical **input port** to represent the expected input data schema.
3. Identify a logical **output port** to represent the expected web service output schema.

When the scoring experiment is created, review it and adjust as needed. A typical adjustment is to replace the input dataset and/or query with one which excludes label fields, as these will not be available when the service is called. It is also a good practice to reduce the size of the input dataset and/or query to a few records, just enough to indicate the input schema. For the output port, it is common to exclude all input fields and only include the **Scored Labels** and **Scored Probabilities** in the output using the [Select Columns in Dataset][select-columns] module.

A sample scoring experiment is in the figure below. When ready to deploy, click the **PUBLISH WEB SERVICE** button in the lower action bar.

![Azure Machine Learning Publish][11]

To recap, in this walkthrough tutorial, you have created an Azure data science environment, worked with a large public dataset all the way from data acquisition to model training and deploying of an Azure Machine Learning web service.

### License Information
This sample walkthrough and its accompanying scripts and IPython notebook(s) are shared by Microsoft under the MIT license. Please check the LICENSE.txt file in the directory of the sample code on GitHub for more details.

### References
•    [Andrés Monroy NYC Taxi Trips Download Page](https://www.andresmh.com/nyctaxitrips/)  
•    [FOILing NYC’s Taxi Trip Data by Chris Whong](https://chriswhong.com/open-data/foil_nyc_taxi/)   
•    [NYC Taxi and Limousine Commission Research and Statistics](https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page)

[1]: ./media/sql-walkthrough/sql-walkthrough_26_1.png
[2]: ./media/sql-walkthrough/sql-walkthrough_28_1.png
[3]: ./media/sql-walkthrough/sql-walkthrough_35_1.png
[4]: ./media/sql-walkthrough/sql-walkthrough_36_1.png
[5]: ./media/sql-walkthrough/sql-walkthrough_39_1.png
[6]: ./media/sql-walkthrough/sql-walkthrough_42_1.png
[7]: ./media/sql-walkthrough/sql-walkthrough_44_1.png
[8]: ./media/sql-walkthrough/sql-walkthrough_46_1.png
[9]: ./media/sql-walkthrough/sql-walkthrough_71_1.png
[10]: ./media/sql-walkthrough/azuremltrain.png
[11]: ./media/sql-walkthrough/azuremlpublish.png
[12]: ./media/sql-walkthrough/ssmsconnect.png
[13]: ./media/sql-walkthrough/executescript.png
[14]: ./media/sql-walkthrough/sqlserverproperties.png
[15]: ./media/sql-walkthrough/sqldefaultdirs.png
[16]: ./media/sql-walkthrough/bulkimport.png
[17]: ./media/sql-walkthrough/amlreader.png
[18]: ./media/sql-walkthrough/amlscoring.png


<!-- Module References -->
[edit-metadata]: https://msdn.microsoft.com/library/azure/370b6676-c11c-486f-bf73-35349f842a66/
[select-columns]: https://msdn.microsoft.com/library/azure/1ec722fa-b623-4e26-a44e-a50c6d726223/
[import-data]: https://msdn.microsoft.com/library/azure/4e1b0fe6-aded-4b3f-a36f-39b8862b9004/
