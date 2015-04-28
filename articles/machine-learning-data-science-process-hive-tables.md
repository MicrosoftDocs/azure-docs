<properties 
	pageTitle="Submit Hive Queries to HDInsight Hadoop clusters in the Cloud Data Science Process | Azure" 
	description="Process Data from Hive Tables with Hive queries." 
	metaKeywords="" 
	services="machine-learning" 
	solutions="" 
	documentationCenter="" 
	authors="hangzh-msft" 
	manager="jacob.spoelstra" 
	editor="cgronlun"  />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/25/2015" 
	ms.author="hangzh;bradsev" /> 

#<a name="heading"></a> Submit Hive Queries to HDInsight Hadoop clusters in the Cloud Data Science Process

This document describes various ways of submitting Hive queries to Hadoop clusters that are managed by an HDInsight service in Azure. Several data wrangling tasks are discussed: data exploration and feature generation. Generic Hive queries that show how to explore data or generate features using Hive in an Azure HDInsight Hadoop cluster. These Hive queries use embedded Hive User Defined Functions (UDFs) which are provided. 

Examples of queries that are specific to [NYC Taxi Trip Data](http://chriswhong.com/open-data/foil_nyc_taxi/) scenarios are also provided in [Github repository](https://github.com/Azure/Azure-MachineLearning-DataScience/tree/master/Misc/DataScienceProcess/DataScienceScripts). These queries already have data schema specified and are ready to be submitted to run. 

In the final section, parameters that users can tune so that the performance of Hive queries can be improved are discussed.

## Prerequisites
This article assumes that you have:
 
* Created an Azure storage account. If you need instructions, see [Create an Azure Storage account](hdinsight-get-started.md#storage) 
* Provisioned a customized Hadoop cluster with the HDInsight service.  If you need instructions, see [Customize Azure HDInsight Hadoop Clusters for Data Science](machine-learning-data-science-customize-hadoop-cluster.md).
* The data has been uploaded to Hive tables in Azure HDInsight Hadoop clusters. If it has not, please follow [Create and load data to Hive tables](machine-learning-data-science-move-hive-tables.md) to upload data to Hive tables first.
* Enabled remote access to the cluster. If you need instructions, see [Access the Head Node of Hadoop Cluster](machine-learning-data-science-customize-hadoop-cluster.md#headnode). 


## <a name="submit"></a>How to Submit Hive Queries
Hive queries can be submitted by using: 

* the Hadoop Command Line on the headnode of the cluster
* the IPython Notebook 
* the Hive Editor
* Azure PowerShell scripts 

When submitting a Hive query, you can also control the destination of the output from Hive queries, whether it be on the screen or to a local file on the head node or to an Azure blob.

### Through Hadoop Command Line console in Head Node of Hadoop Cluster

If the query is complex, submitting Hive queries directly from the head node of the Hadoop cluster typically leads to faster turn around than submitting it with a Hive Editor or by using Azure PowerShell scripts. 

Log in to the head node of the Hadoop cluster, open the Hadoop Command Line on the desktop of the head node, and enter command

    cd %hive_home%\bin

Users have three ways to submit Hive queries in Hadoop Command Line console:

* directly from the Hadoop command line
* using .hql files
* from the Hive command console

####Submit Hive queries directly from the Hadoop Command Line 

Users can run command like 

	hive -e "<your hive query>; 

to submit simple Hive queries directly in the Hadoop command line. Here is an example, where the red box outlines the command that submits the Hive query, and the green box outlines the output from the Hive query.

![Create workspace][10]

####Submit Hive queries in .hql files

When the Hive query is more complicated and has multiple lines, editing queries in Hadoop command line or Hive command console is not practical. An alternative is to use a text editor in the head node of the Hadoop cluster and to save the Hive queries in a .hql file in a local directory of the head node. Then the Hive query in the .hql file can be submitted by using the `-f` argument in the `hive` command as follows:
	
	`hive -f "<path to the .hql file>"`

![Create workspace][15]


####Suppress progress status screen print of Hive queries

By default, after Hive query is submitted in the Hadoop Command Line console, the progress of the Map/Reduce job will be printed out on screen. To suppress the screen print of the Map/Reduce job progress, you can use the argument `-S` ("S" must in upper case) argument in the command line as follows:

	hive -S -f "<path to the .hql file>"
	hive -S -e "<Hive queries>"

####Submit Hive queries in Hive command console.

Users can also enter the Hive command console by running the  `hive` command from the Hadoop command line, and then submit Hive queries from Hive command console. Here is an example.  

![Create workspace][11]

In this example, the two red boxes highlight the commands used to enter the Hive command console, and the Hive query submitted in Hive command console, respectively. The green box highlights the output from the Hive query.

The previous examples directly output the Hive query results on screen. Users can also write the output to a local file on the head node, or to an Azure blob. Then, users can use other tools to further analyze the output of from Hive queries.

####Output Hive query results to a local file. 

To output Hive query results to a local directory on the head node, users have to submit the Hive query in the Hadoop Command Line as follows:

	`hive -e "<hive query>" > <local path in the head node>`

In the following example, the output of Hive query is written into a file *hivequeryoutput.txt* in directory *C:\apps\temp*.

![Create workspace][12]

####Output Hive query results to an Azure blob

Users can also output the Hive query results to an Azure blob, within the default container of the Hadoop cluster. The Hive query to do this looks like this:

	insert overwrite directory wasb:///<directory within the default container> <select clause from ...>

In the following example, the output of Hive query is written to a blob directory `queryoutputdir` within the default container of the Hadoop cluster. Here, you must only provide the directory name, without the blob name. An error will be thrown out if you provide both the directory and the blob name, such as *wasb:///queryoutputdir/queryoutput.txt*. 

![Create workspace][13]

The output of the Hive query can be seen in blob storage by opening the default container of the Hadoop cluster using the Azure Storage Explorer (or equivalent) tool. You can apply the filter (highlighted by red box) if you only want to retrieve a blob with specified letters in names.

![Create workspace][14]

### Through Hive Editor or Azure PowerShell Commands

Users can also use the Query Console (Hive Editor) by entering the URL of the form
 
*https://&#60;Hadoop cluster name>.azurehdinsight.net/Home/HiveEditor*  

into a web browser. Note that you will be asked to input the Hadoop cluster credentials to log in. Alternatively, you can [Submit Hive jobs using PowerShell](hdinsight-submit-hadoop-jobs-programmatically.md#hive-powershell). 


##<a name="hive-dataexploration"></a>Data Exploration
Here are a few sample Hive scripts that can be used to explore data in Hive tables.

1. Get the count of observations per partition
	`SELECT <partitionfieldname>, count(*) from <databasename>.<tablename> group by <partitionfieldname>;`

2. Get the count of observations per day
	`SELECT to_date(<date_columnname>), count(*) from <databasename>.<tablename> group by to_date(<date_columnname>);` 

3. Get the levels in a categorical column  
	`SELECT  distinct <column_name> from <databasename>.<tablename>`

4. Get the number of levels in combination of two categorical columns 
	`SELECT <column_a>, <column_b>, count(*) from <databasename>.<tablename> group by <column_a>, <column_b>`

5. Get the distribution for numerical columns  
	`SELECT <column_name>, count(*) from <databasename>.<tablename> group by <column_name>`

6. Extract records from joining two tables 

	    SELECT 
			a.<common_columnname1> as <new_name1>,
			a.<common_columnname2> as <new_name2>,
    		a.<a_column_name1> as <new_name3>,
    		a.<a_column_name2> as <new_name4>,
    		b.<b_column_name1> as <new_name5>,
    		b.<b_column_name2> as <new_name6>
    	FROM
    		(
    		SELECT <common_columnname1>, 
    			<common_columnname2>,
				<a_column_name1>,
				<a_column_name2>,
			FROM <databasename>.<tablename1>
			) a
			join
			(
			SELECT <common_columnname1>, 
    			<common_columnname2>,
				<b_column_name1>,
				<b_column_name2>,
			FROM <databasename>.<tablename2>
			) b
			ON a.<common_columnname1>=b.<common_columnname1> and a.<common_columnname2>=b.<common_columnname2>

##<a name="hive-featureengineering"></a>Feature Generation

In this section, we describe ways of generating features using Hive queries. 

> [AZURE.NOTE] The sample Hive queries in this section assumes that the data has been uploaded to Hive tables in Azure HDInsight Hadoop clusters. If it has not, please follow [Create and load data to Hive tables](machine-learning-data-science-hive-tables.md) to upload data to Hive tables first.

Once you have generated additional features, you can either add them as columns to the existing table or create a new table with the additional features and primary key, which can then be joined with the original table.  

1. [Frequency based Feature Generation](#hive-frequencyfeature)
2. [Risks of Categorical Variables in Binary Classification](#hive-riskfeature)
3. [Extract features from Datetime Field](#hive-datefeatures)
4. [Extract features from Text Field](#hive-textfeatures)
5. [Calculate distance between GPS coordinates](#hive-gpsdistance)

###<a name="hive-frequencyfeature"></a>Frequency based Feature Generation

It is often useful to calculate the frequencies of the levels of a categorical variable, or the frequencies of certain combinations of levels from multiple categorical variables. Users can use the following script to calculate these frequencies:

		select 
			a.<column_name1>, a.<column_name2>, a.sub_count/sum(a.sub_count) over () as frequency
		from
		(
			select 
				<column_name1>,<column_name2>, count(*) as sub_count 
			from <databasename>.<tablename> group by <column_name1>, <column_name2>
		)a
		order by frequency desc;
	

###<a name="hive-riskfeature"></a>Risks of Categorical Variables in Binary Classification

In binary classification, we need to convert non-numeric categorical variables into numeric features when the models being used only take numeric features. This is done by replacing each non-numeric level with a numeric risk. In this section, we show some generic Hive queries that calculate the risk values (log odds) of a categorical variable. 


	    set smooth_param1=1;
	    set smooth_param2=20;
	    select 
	    	<column_name1>,<column_name2>, 
			ln((sum_target+${hiveconf:smooth_param1})/(record_count-sum_target+${hiveconf:smooth_param2}-${hiveconf:smooth_param1})) as risk
	    from
	    	(
	    	select 
	    		<column_nam1>, <column_name2>, sum(binary_target) as sum_target, sum(1) as record_count
	    	from
	    		(
	    		select 
	    			<column_name1>, <column_name2>, if(target_column>0,1,0) as binary_target
	    		from <databasename>.<tablename> 
	    		)a
	    	group by <column_name1>, <column_name2>
	    	)b 

In this example, variables `smooth_param1` and `smooth_param2` are set to smooth the risk values calculated from the data. Risks have a range between -Inf and Inf. A risks > 0 indicates that the probability that the target is equal to 1 is greater than 0.5. 

After the risk table is calculated, users can assign risk values to a table by joining it with the risk table. The Hive joining query was provided in previous section.

###<a name="hive-datefeatures"></a>Extract features from Datetime Fields

Hive comes with a set of UDFs for processing datetime fields. In Hive, the default datetime format is 'yyyy-MM-dd 00:00:00' ('1970-01-01 12:21:32' for example). In this section, we show examples that extract the day of a month, the month from a datetime field, and other examples that convert a datetime string in a format other than the default format to a datetime string in default format. 

    	select day(<datetime field>), month(<datetime field>) 
		from <databasename>.<tablename>;

This Hive query assumes that the *&#60;datetime field>* is in the default datetime format.

If a datetime field is not in the default format, you need to convert the datetime field into Unix time stamp first, and then convert the Unix time stamp to a datetime string that is in the default format. When the datetime is in default format, users can apply the embedded datetime UDFs to extract features.

		select from_unixtime(unix_timestamp(<datetime field>,'<pattern of the datetime field>'))
		from <databasename>.<tablename>;

In this query, if the *&#60;datetime field>* has the pattern like *03/26/2015 12:04:39*, the *'&#60;pattern of the datetime field>'* should be `'MM/dd/yyyy HH:mm:ss'`. To test it, users can run

		select from_unixtime(unix_timestamp('05/15/2015 09:32:10','MM/dd/yyyy HH:mm:ss'))
		from hivesampletable limit 1;

The *hivesampletable* in this query comes preinstalled on all Azure HDInsight Hadoop clusters by default when the clusters are provisioned. 


###<a name="hive-textfeatures"></a>Extract features from Text Fields

When the Hive table has a text field that contains a string of words that are delimited by spaces, the following query extracts the length of the string, and the number of words in the string.

    	select length(<text field>) as str_len, size(split(<text field>,' ')) as word_num 
		from <databasename>.<tablename>;

###<a name="hive-gpsdistance"></a>Calculate distances between sets of GPS coordinates

The query given in this section can be directly applied to the NYC Taxi Trip Data. The purpose of this query is to show how to apply an embedded mathematical functions in Hive to generate features. 

The fields that are used in this query are the GPS coordinates of pickup and dropoff locations, named *pickup\_longitude*, *pickup\_latitude*, *dropoff\_longitude*, and *dropoff\_latitude*. The queries that calculate the direct distance between the pickup and dropoff coordinates are:

		set R=3959;
		set pi=radians(180);
		select pickup_longitude, pickup_latitude, dropoff_longitude, dropoff_latitude, 
			${hiveconf:R}*2*2*atan((1-sqrt(1-pow(sin((dropoff_latitude-pickup_latitude)
			*${hiveconf:pi}/180/2),2)-cos(pickup_latitude*${hiveconf:pi}/180)
			*cos(dropoff_latitude*${hiveconf:pi}/180)*pow(sin((dropoff_longitude-pickup_longitude)*${hiveconf:pi}/180/2),2)))
			/sqrt(pow(sin((dropoff_latitude-pickup_latitude)*${hiveconf:pi}/180/2),2)
			+cos(pickup_latitude*${hiveconf:pi}/180)*cos(dropoff_latitude*${hiveconf:pi}/180)*
			pow(sin((dropoff_longitude-pickup_longitude)*${hiveconf:pi}/180/2),2))) as direct_distance 
		from nyctaxi.trip 
		where pickup_longitude between -90 and 0
		and pickup_latitude between 30 and 90
		and dropoff_longitude between -90 and 0
		and dropoff_latitude between 30 and 90
		limit 10; 

The mathematical equations that calculate the distance between two GPS coordinates can be found on the [Movable Type Scripts](http://www.movable-type.co.uk/scripts/latlong.html) site, authored by Peter Lapisu. In his Javascript, the function `toRad()` is just *lat_or_lon*pi/180*, which converts degrees to radians. Here, *lat_or_lon* is the latitude or longitude. Since Hive does not provide the function `atan2`, but provides the function `atan`, the `atan2` function is implemented by `atan` function in the above Hive query using the definition provided in [Wikipedia](http://en.wikipedia.org/wiki/Atan2). 

![Create workspace][1]

A full list of Hive embedded UDFs can be found in the **Built-in Functions** section on the [Apache Hive wiki](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF#LanguageManualUDF-MathematicalFunctions). 

## <a name="tuning"></a> Advanced topics: Tune Hive Parameters to Improve Query Speed

The default parameter settings of Hive cluster might not be suitable for the Hive queries and the data that the queries are processing. In this section, we discuss some parameters that users can tune that improve the performance of Hive queries. Users need to add the parameter tuning queries before the queries of processing data. 

1. **Java heap space**: For queries involving joining large datasets, or processing long records, a typical error is **running out of heap space**. This can be tuned by setting parameters *mapreduce.map.java.opts* and *mapreduce.task.io.sort.mb* to desired values. Here is an example:

		set mapreduce.map.java.opts=-Xmx4096m;
		set mapreduce.task.io.sort.mb=-Xmx1024m;
	

	This parameter allocates 4GB memory to Java heap space and also makes sorting more efficient by allocating more memory for it. It is a good idea to play with these allocations if there are any job failure errors related to heap space.

2. **DFS block size** : This parameter sets the smallest unit of data that the file system stores. As an example, if the DFS block size is 128MB, then any data of size less than and up to 128MB is stored in a single block, while data that is larger than 128MB is allotted extra blocks. Choosing a very small block size causes large overheads in Hadoop since the name node has to process many more requests to find the relevant block pertaining to the file. A recommended setting when dealing with gigabytes (or larger) data is :

		set dfs.block.size=128m;

3. **Optimizing join operation in Hive** : While join operations in the map/reduce framework typically take place in the reduce phase, sometimes, enormous gains can be achieved by scheduling joins in the map phase (also called "mapjoins"). To direct Hive to do this whenever possible, we can set :

		set hive.auto.convert.join=true;

4. **Specifying the number of mappers to Hive** : While Hadoop allows the user to set the number of reducers, the number of mappers is typically not be set by the user. A trick that allows some degree of control on this number is to choose the Hadoop variables, *mapred.min.split.size* and *mapred.max.split.size* as the size of each map task is determined by :

		num_maps = max(mapred.min.split.size, min(mapred.max.split.size, dfs.block.size))

	Typically, the default value of *mapred.min.split.size* is 0, that of *mapred.max.split.size* is **Long.MAX** and that of *dfs.block.size* is 64MB. As we can see, given the data size, tuning these parameters by "setting" them allows us to tune the number of mappers used. 

5. A few other more **advanced options** for optimizing Hive performance are mentioned below. These allow you to set the memory allocated to map and reduce tasks, and can be useful in tweaking performance. Please keep in mind that the *mapreduce.reduce.memory.mb* cannot be greater than the physical memory size of each worker node in the Hadoop cluster.

		set mapreduce.map.memory.mb = 2048;
		set mapreduce.reduce.memory.mb=6144;
		set mapreduce.reduce.java.opts=-Xmx8192m;
		set mapred.reduce.tasks=128;
		set mapred.tasktracker.reduce.tasks.maximum=128;

[1]: ./media/machine-learning-data-science-process-hive-tables/atan2new.png
[10]: ./media/machine-learning-data-science-process-hive-tables/run-hive-queries-1.png
[11]: ./media/machine-learning-data-science-process-hive-tables/run-hive-queries-2.png
[12]: ./media/machine-learning-data-science-process-hive-tables/output-hive-results-1.png
[13]: ./media/machine-learning-data-science-process-hive-tables/output-hive-results-2.png
[14]: ./media/machine-learning-data-science-process-hive-tables/output-hive-results-3.png
[15]: ./media/machine-learning-data-science-process-hive-tables/run-hive-queries-3.png


