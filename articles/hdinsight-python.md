<properties
	pageTitle="Use Python with Hive and Pig in Azure HDInsight"
	description="Learn how to use Python User Defined Functions (UDF) from Hive and Pig in Azure HDInsight."
	services="hdinsight"
	documentationCenter=""
	authors="Blackmist"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="python"
	ms.topic="article"
	ms.date="04/23/2015" 
	ms.author="larryfr"/>

#Use Python with Hive and Pig in HDInsight

Hive and Pig are great for working with data in HDInsight, but sometimes you need a more general purpose language. Both Hive and Pig allow you to create User Defined Functions (UDF) using a variety of programming languages. In this article, you will learn how to use a Python UDF from Hive and Pig.

> [AZURE.NOTE] The steps in this article apply to HDInsight cluster versions 2.1, 3.0, 3.1, and 3.2.


##<a name="python"></a>Python on HDInsight

Python2.7 is installed by default on HDInsight 3.0 and later clusters. Hive can be used with this version of Python for stream processing (data is passed between Hive and Python using STDOUT/STDIN).

HDInsight also includes Jython, which is a Python implementation written in Java. Pig understands how to talk to Jython without having to resort to streaming, so it's preferable when using Pig.

###<a name="hivepython"></a>Hive and Python

Python can be used as a UDF from Hive through the HiveQL **TRANSFORM** statement. For example, the following HiveQL invokes a Python script stored in the **streaming.py** file.

**Linux-based HDInsight**

	add file wasb:///streaming.py;

	SELECT TRANSFORM (clientid, devicemake, devicemodel)
	  USING 'streaming.py' AS
	  (clientid string, phoneLable string, phoneHash string)
	FROM hivesampletable
	ORDER BY clientid LIMIT 50;

**Windows-based HDInsight**

	add file wasb:///streaming.py;

	SELECT TRANSFORM (clientid, devicemake, devicemodel)
	  USING 'D:\Python27\python.exe streaming.py' AS
	  (clientid string, phoneLable string, phoneHash string)
	FROM hivesampletable
	ORDER BY clientid LIMIT 50;

> [AZURE.NOTE] On Windows-based HDInsight clusters, the **USING** clause must specify the full path to python.exe. This is always `D:\Python27\python.exe`.

Here's what this example does:

1. The **add file** statement at the beginning of the file adds the **streaming.py** file to the distributed cache, so it's accessible by all nodes in the cluster.

2. The  **SELECT TRANSFORM ... USING** statement selects data from the **hivesampletable**, and passes clientid, devicemake, and devicemodel to the **streaming.py** script.

3. The **AS** clause describes the fields returned from **streaming.py**

<a name="streamingpy"></a>
Here's the **streaming.py** file used by the HiveQL example.

	#!/usr/bin/env python

	import sys
	import string
	import hashlib

	while True:
	  line = sys.stdin.readline()
	  if not line:
	    break

	  line = string.strip(line, "\n ")
	  clientid, devicemake, devicemodel = string.split(line, "\t")
	  phone_label = devicemake + ' ' + devicemodel
	  print "\t".join([clientid, phone_label, hashlib.md5(phone_label).hexdigest()])

Since we are using streaming, this script has to do the following:

1. Read data from STDIN. This is accomplished by using `sys.stdin.readline()` in this example.

2. The trailing newline character is removed using `string.strip(line, "\n ")`, since we just want the text data and not the end of line indicator.

2. When doing stream processing, a single line contains all the values with a tab character between each value. So `string.split(line, "\t")` can be used to split the input at each tab, returning just the fields.

3. When processing is complete, the output must be written to STDOUT as a single line, with a tab between each field. This is accomplished by using `print "\t".join([clientid, phone_label, hashlib.md5(phone_label).hexdigest()])`.

4. This all occurs within a `while` loop, that will repeat until no `line` is read, at which point `break` exits the loop and the script terminates.

Beyond that, the script just concatenates the input values for `devicemake` and `devicemodel`, and calculates a hash of the concatenated value. Pretty simple, but it describes the basics of how any Python script invoked from Hive should function: Loop, read input until there is no more, break each line of input apart at the tabs, process, write a single line of tab delimited output.

See [Running the examples](#running) for how to run this example on your HDInsight cluster.

###<a name="pigpython"></a>Pig and Python

A Python script can be used as a UDF from Pig through the **GENERATE** statement. For example, the following example uses a Python script stored in the **jython.py** file.

	Register 'wasb:///jython.py' using jython as myfuncs;
    LOGS = LOAD 'wasb:///example/data/sample.log' as (LINE:chararray);
    LOG = FILTER LOGS by LINE is not null;
    DETAILS = FOREACH LOG GENERATE myfuncs.create_structure(LINE);
    DUMP DETAILS;

Here's how this example works:

1. It registers the file containing the Python script (**jython.py**,) using **Jython**, and exposes it to Pig as **myfuncs**. Jython is a Python implementation in Java, and runs in the same Java Virtual machine as Pig. This allows us to treat the Python script like a traditional function call vs. the streaming approach used with Hive.

2. The next line loads the sample data file, **sample.log** into **LOGS**. Since this log file doesn't have a consistent schema, it also defines each record (**LINE** in this case,) as a **chararray**. Chararray is, essentially, a string.

3. The third line filters out any null values, storing the result of the operation into **LOG**.

4. Next, it iterates over the records in **LOG** and uses **GENERATE** to invoke the **create_structure** method contained in the **jython.py** script loaded as **myfuncs**.  **LINE** is used to pass the current record to the function.

5. Finally, the outputs are dumped to STDOUT using the **DUMP** command. This is just to immediately show the results after the operation completes; in a real script you would normally **STORE** the data into a new file.

<a name="jythonpy"></a>
Here's the **jython.py** file used by the Pig example:

	@outputSchema("log: {(date:chararray, time:chararray, classname:chararray, level:chararray, detail:chararray)}")
	def create_structure(input):
	  if (input.startswith('java.lang.Exception')):
	    input = input[21:len(input)] + ' - java.lang.Exception'
	  date, time, classname, level, detail = input.split(' ', 4)
	  return date, time, classname, level, detail

Remember that we previously just defined the **LINE** input as a chararray because there was no consistent schema for the input? What the **jython.py** does is to transform the data into a consistent schema for output. It works like this:

1. The **@outputSchema** statement defines the format of the data that will be returned to Pig. In this case, it's a **data bag**, which is a Pig data type. The bag contains the following fields, all of which are chararray (strings):

	* date - the date the log entry was created
	* time - the time the log entry was created
	* classname - the class name the entry was created for
	* level - the log level
	* detail - verbose details for the log entry

2. Next, the **def create_structure(input)** defines the function that Pig will pass line items to.

3. The example data, **sample.log**, mostly conforms to the date, time, classname, level, and detail schema we want to return. But it also contains a few lines that begin with the string '*java.lang.Exception*' that need to be modified to match the schema. The **if** statement checks for those, then massages the input data to move the '*java.lang.Exception*' string to the end, bringing the data in-line with our expected output schema.

4. Next, the **split** command is used to split the data at the first four space characters. This results in five values, which are assigned into **date**, **time**, **classname**, **level**, and **detail**.

5. Finally, the values are returned to Pig.

When the data is returned to Pig, it will have a consistent schema as defined in the **@outputSchema** statement.

##<a name="running"></a>Running the examples

If you are using a Linux-based HDInsight cluster, use the **SSH** steps below. If you are using a Windows-based HDInsight cluster and a Windows client, use the **PowerShell** steps.

###SSH

For more information on using SSH, see <a href="../hdinsight-hadoop-linux-use-ssh-unix/" target="_blank">Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X</a> or <a href="../hdinsight-hadoop-linux-use-ssh-windows/" target="_blank">Use SSH with Linux-based Hadoop on HDInsight from Windows</a>.

1. Using the Python examples [streaming.py](#streamingpy) and [jython.py](#jythonpy), create local copies of the files on your development machine.

2. Use `scp` to copy the files to your HDInsight cluster. For example, the following would copy the files to a cluster named **mycluster**.

		scp streaming.py jython.py myuser@mycluster-ssh.azurehdinsight.net:

3. Use SSH to connect to the cluster. For example, the following would connect to a cluster named **mycluster** as user **myuser**.

		ssh myuser@mycluster-ssh.azurehdinsight.net

4. From the SSH session, add the python files uploaded previously to the WASB storage for the cluster.

		hadoop fs -copyFromLocal streaming.py /streaming.py
		hadoop fs -copyFromLocal jython.py /jython.py

After uploading the files, use the following steps to run the Hive and Pig jobs.

####Hive

1. Use the `hive` command to start the hive shell. You should see a `hive>` prompt once the shell has loaded.

2. Enter the following at the `hive>` prompt.

		add file wasb:///streaming.py;
		SELECT TRANSFORM (clientid, devicemake, devicemodel)
		  USING 'streaming.py' AS
		  (clientid string, phoneLabel string, phoneHash string)
		FROM hivesampletable
		ORDER BY clientid LIMIT 50;

3. After entering the last line, the job should start. Eventually it will return output similar to the following.

		100041	RIM 9650	d476f3687700442549a83fac4560c51c
		100041	RIM 9650	d476f3687700442549a83fac4560c51c
		100042	Apple iPhone 4.2.x	375ad9a0ddc4351536804f1d5d0ea9b9
		100042	Apple iPhone 4.2.x	375ad9a0ddc4351536804f1d5d0ea9b9
		100042	Apple iPhone 4.2.x	375ad9a0ddc4351536804f1d5d0ea9b9

####Pig

1. Use the `pig` command to start the shell. You should see a `grunt>` prompt once the shell has loaded.

2. Enter the following statements at the `grunt>` prompt.

		Register wasb:///jython.py using jython as myfuncs;
	    LOGS = LOAD 'wasb:///example/data/sample.log' as (LINE:chararray);
	    LOG = FILTER LOGS by LINE is not null;
	    DETAILS = foreach LOG generate myfuncs.create_structure(LINE);
	    DUMP DETAILS;

3. After entering the following line,the job should start. Eventually it will return output similar to the following.

		((2012-02-03,20:11:56,SampleClass5,[TRACE],verbose detail for id 990982084))
		((2012-02-03,20:11:56,SampleClass7,[TRACE],verbose detail for id 1560323914))
		((2012-02-03,20:11:56,SampleClass8,[DEBUG],detail for id 2083681507))
		((2012-02-03,20:11:56,SampleClass3,[TRACE],verbose detail for id 1718828806))
		((2012-02-03,20:11:56,SampleClass3,[INFO],everything normal for id 530537821))

###PowerShell

These steps use Azure PowerShell. If this is not already installed and configured on your development machine, see [How to install and configure Azure PowerShell](install-configure-powershell.md) before using the following steps.

1. Using the Python examples [streaming.py](#streamingpy) and [jython.py](#jythonpy), create local copies of the files on your development machine.

2. Use  the following PowerShell script to upload the **streaming.py** and **jython.py** files to the server. Substitute the name of your Azure HDInsight cluster, and the path to the **streaming.py** and **jython.py** files on the first three lines of the script.

		$clusterName = YourHDIClusterName
		$pathToStreamingFile = "C:\path\to\streaming.py"
		$pathToJythonFile = "C:\path\to\jython.py"

		$hdiStore = get-azurehdinsightcluster -name $clusterName
		$storageAccountName = $hdiStore.DefaultStorageAccount.StorageAccountName.Split(".",2)[0]
		$storageAccountKey = $hdiStore.defaultstorageaccount.storageaccountkey
		$defaultContainer = $hdiStore.DefaultStorageAccount.StorageContainerName

		$destContext = new-azurestoragecontext -storageaccountname $storageAccountName -storageaccountkey $storageAccountKey
		set-azurestorageblobcontent -file $pathToStreamingFile -Container $defaultContainer -Blob "streaming.py" -context $destContext
		set-azurestorageblobcontent -file $pathToJythonFile -Container $defaultContainer -Blob "jython.py" -context $destContext

	This script retrieves information for your HDInsight cluster, then extracts the account and key for the default storage account, and uploads the files to the root of the container.

	> [AZURE.NOTE] Other methods of uploading the scripts can be found in the [Upload data for Hadoop jobs in HDInsight](hdinsight-upload-data.md) document.

After uploading the files, use the following PowerShell scripts to start the jobs. When the job completes, the output should be written to the PowerShell console.

####Hive

    # Replace 'YourHDIClusterName' with the name of your cluster
	$clusterName = YourHDIClusterName

	$HiveQuery = "add file wasb:///streaming.py;" +
	             "SELECT TRANSFORM (clientid, devicemake, devicemodel) " +
	               "USING 'D:\Python27\python.exe streaming.py' AS " +
	               "(clientid string, phoneLabel string, phoneHash string) " +
	             "FROM hivesampletable " +
	             "ORDER BY clientid LIMIT 50;"

	$jobDefinition = New-AzureHDInsightHiveJobDefinition -Query $HiveQuery -StatusFolder '/hivepython'

	$job = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $jobDefinition
	Write-Host "Wait for the Hive job to complete ..." -ForegroundColor Green
	Wait-AzureHDInsightJob -Job $job
    # Uncomment the following to see stderr output
    # Get-AzureHDInsightJobOutput -StandardError -JobId $job.JobId -Cluster $clusterName
	Write-Host "Display the standard output ..." -ForegroundColor Green
	Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $job.JobId -StandardOutput

The output for the **Hive** job should appear similar to the following:

	100041	RIM 9650	d476f3687700442549a83fac4560c51c
	100041	RIM 9650	d476f3687700442549a83fac4560c51c
	100042	Apple iPhone 4.2.x	375ad9a0ddc4351536804f1d5d0ea9b9
	100042	Apple iPhone 4.2.x	375ad9a0ddc4351536804f1d5d0ea9b9
	100042	Apple iPhone 4.2.x	375ad9a0ddc4351536804f1d5d0ea9b9

####Pig

	# Replace 'YourHDIClusterName' with the name of your cluster
	$clusterName = YourHDIClusterName

	$PigQuery = "Register wasb:///jython.py using jython as myfuncs;" +
	            "LOGS = LOAD 'wasb:///example/data/sample.log' as (LINE:chararray);" +
	            "LOG = FILTER LOGS by LINE is not null;" +
	            "DETAILS = foreach LOG generate myfuncs.create_structure(LINE);" +
	            "DUMP DETAILS;"

	$jobDefinition = New-AzureHDInsightPigJobDefinition -Query $PigQuery -StatusFolder '/pigpython'

	$job = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $jobDefinition
	Write-Host "Wait for the Pig job to complete ..." -ForegroundColor Green
	Wait-AzureHDInsightJob -Job $job
    # Uncomment the following to see stderr output
    # Get-AzureHDInsightJobOutput -StandardError -JobId $job.JobId -Cluster $clusterName
	Write-Host "Display the standard output ..." -ForegroundColor Green
	Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $job.JobId -StandardOutput

The output for the **Pig** job should appear similar to the following:

	((2012-02-03,20:11:56,SampleClass5,[TRACE],verbose detail for id 990982084))
	((2012-02-03,20:11:56,SampleClass7,[TRACE],verbose detail for id 1560323914))
	((2012-02-03,20:11:56,SampleClass8,[DEBUG],detail for id 2083681507))
	((2012-02-03,20:11:56,SampleClass3,[TRACE],verbose detail for id 1718828806))
	((2012-02-03,20:11:56,SampleClass3,[INFO],everything normal for id 530537821))

##<a name="troubleshooting"></a>Troubleshooting

Both of the example PowerShell scripts used to run the examples contain a commented line that will display error output for the job. If you are not seeing the expected output for the job, uncomment the following line and see if the error information indicates a problem.

	# Get-AzureHDInsightJobOutput -StandardError -JobId $job.JobId -Cluster $clusterName

The error information (STDERR,) and the result of the job (STDOUT,) are also logged to the default blob container for your clusters at the following locations.

<table>
<tr>
<td>For this job..</td><td>Look at these files in the blob container</td>
</tr>
<td>Hive</td><td>/HivePython/stderr</br>/HivePython/stdout</td>
</tr>
<td>Pig</td><td>/PigPython/stderr</br>/PigPython/stdout</td>
</tr>
</table>

##<a name="next"></a>Next steps

If you need to load Python modules that aren't provided by default, see [How to deploy a module to Azure HDInsight](http://blogs.msdn.com/b/benjguin/archive/2014/03/03/how-to-deploy-a-python-module-to-windows-azure-hdinsight.aspx) for an example of how to do this.

For other ways to use Pig, Hive, and to learn about using MapReduce, see the following.

* [Use Hive with HDInsight](hdinsight-use-hive.md)

* [Use Pig with HDInsight](hdinsight-use-pig.md)

* [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md)
