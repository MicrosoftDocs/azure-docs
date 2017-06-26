---
title: Python UDF with Apache Hive and Pig - Azure HDInsight | Microsoft Docs
description: Learn how to use Python User Defined Functions (UDF) from Hive and Pig in HDInsight, the Hadoop technology stack on Azure.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: c44d6606-28cd-429b-b535-235e8f34a664
ms.service: hdinsight
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: python
ms.topic: article
ms.date: 05/22/2017
ms.author: larryfr

ms.custom: H1Hack27Feb2017,hdinsightactive
---
# Use Python User Defined Functions (UDF) with Hive and Pig in HDInsight

Learn how to use Python user-defined functions (UDF) with Apache Hive and Pig in Hadoop on Azure HDInsight.

## <a name="python"></a>Python on HDInsight

Python2.7 is installed by default on HDInsight 3.0 and later. Apache Hive can be used with this version of Python for stream processing. Stream processing uses STDOUT and STDIN to pass data between Hive and the UDF.

HDInsight also includes Jython, which is a Python implementation written in Java. Jython runs directly on the Java Virtual Machine and does not use streaming. Jython is the recommended Python interpreter when using Python with Pig.

## <a name="hivepython"></a>Hive and Python

Python can be used as a UDF from Hive through the HiveQL `TRANSFORM` statement. For example, the following HiveQL invokes a Python script stored in the `streaming.py` file.

**Linux-based HDInsight**

```hiveql
add file wasbs:///streaming.py;

SELECT TRANSFORM (clientid, devicemake, devicemodel)
    USING 'python streaming.py' AS
    (clientid string, phoneLable string, phoneHash string)
FROM hivesampletable
ORDER BY clientid LIMIT 50;
```

**Windows-based HDInsight**

```hiveql
add file wasbs:///streaming.py;

SELECT TRANSFORM (clientid, devicemake, devicemodel)
    USING 'D:\Python27\python.exe streaming.py' AS
    (clientid string, phoneLable string, phoneHash string)
FROM hivesampletable
ORDER BY clientid LIMIT 50;
```

> [!NOTE]
> On Windows-based HDInsight clusters, the `USING` clause must specify the full path to python.exe.

Here's what this example does:

1. The `add file` statement at the beginning of the file adds the `streaming.py` file to the distributed cache, so it's accessible by all nodes in the cluster.
2. The `SELECT TRANSFORM ... USING` statement selects data from the `hivesampletable`. It also passes the clientid, devicemake, and devicemodel values to the `streaming.py` script.
3. The `AS` clause describes the fields returned from `streaming.py`.

<a name="streamingpy"></a>

Here's the `streaming.py` file used by the HiveQL example.

```python
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
```

This script performs the following actions:

1. Read a line of data from STDIN.
2. The trailing newline character is removed using `string.strip(line, "\n ")`.
3. When doing stream processing, a single line contains all the values with a tab character between each value. So `string.split(line, "\t")` can be used to split the input at each tab, returning just the fields.
4. When processing is complete, the output must be written to STDOUT as a single line, with a tab between each field. For example, `print "\t".join([clientid, phone_label, hashlib.md5(phone_label).hexdigest()])`.
5. The `while` loop repeats until no `line` is read.

The script output is a concatenation of the input values for `devicemake` and `devicemodel`, and a hash of the concatenated value.

See [Running the examples](#running) for how to run this example on your HDInsight cluster.

## <a name="pigpython"></a>Pig and Python

A Python script can be used as a UDF from Pig through the `GENERATE` statement. You can run the script using either Jython or C Python.

The difference between these are that Jython runs on the JVM and can natively be called from Pig. C Python is an external process, so the data from Pig on the JVM is sent out to the script running in a Python process. The output of the Python script is sent back into Pig.

To specify the Python interpreter, use `register` when referencing the Python script. The following examples register scripts with Pig as `myfuncs`:

* **To use Jython**: `register '/path/to/pig_python.py' using jython as myfuncs;`
* **To use C Python**: `register '/path/to/pig_python.py' using streaming_python as myfuncs;`

> [!IMPORTANT]
> When using Jython, the path to the pig_jython file can be either a local path or a WASB:// path. However, when using C Python, you must reference a file on the local file system of the node that you are using to submit the Pig job.

Once past registration, the Pig Latin for this example is the same for both:

```pig
LOGS = LOAD 'wasbs:///example/data/sample.log' as (LINE:chararray);
LOG = FILTER LOGS by LINE is not null;
DETAILS = FOREACH LOG GENERATE myfuncs.create_structure(LINE);
DUMP DETAILS;
```

Here's what this example does:

1. The first line loads the sample data file, `sample.log` into `LOGS`. It also defines each record as a `chararray`.
2. The next line filters out any null values, storing the result of the operation into `LOG`.
3. Next, it iterates over the records in `LOG` and uses `GENERATE` to invoke the `create_structure` method contained in the Python/Jython script loaded as `myfuncs`. `LINE` is used to pass the current record to the function.
4. Finally, the outputs are dumped to STDOUT using the `DUMP` command. This command displays the results after the operation completes.

The Python script file is similar between C Python and Jython. The only difference is that you must import from `pig_util` when using C Python. Here is the `pig_python.py` script:

<a name="streamingpy"></a>

```python
# Uncomment the following if using C Python
#from pig_util import outputSchema

@outputSchema("log: {(date:chararray, time:chararray, classname:chararray, level:chararray, detail:chararray)}")
def create_structure(input):
    if (input.startswith('java.lang.Exception')):
        input = input[21:len(input)] + ' - java.lang.Exception'
    date, time, classname, level, detail = input.split(' ', 4)
    return date, time, classname, level, detail
```

> [!NOTE]
> 'pig_util' isn't something you need to worry about installing; it's automatically available to the script.

Remember that we previously defined the `LINE` input as a chararray because there was no consistent schema for the input. The Python script transforms the data into a consistent schema for output.

1. The `@outputSchema` statement defines the format of the data that is returned to Pig. In this case, it's a **data bag**, which is a Pig data type. The bag contains the following fields, all of which are chararray (strings):

   * date - the date the log entry was created
   * time - the time the log entry was created
   * classname - the class name the entry was created for
   * level - the log level
   * detail - verbose details for the log entry

2. Next, the `def create_structure(input)` defines the function that Pig passes line items to.

3. The example data, `sample.log`, mostly conforms to the date, time, classname, level, and detail schema we want to return. However, it contains a few lines that begin with `*java.lang.Exception*`. These lines must be modified to match the schema. The `if` statement checks for those, then massages the input data to move the `*java.lang.Exception*` string to the end, bringing the data in-line with our expected output schema.

4. Next, the `split` command is used to split the data at the first four space characters. The output is assigned into `date`, `time`, `classname`, `level`, and `detail`.

5. Finally, the values are returned to Pig.

When the data is returned to Pig, it has a consistent schema as defined in the `@outputSchema` statement.

## <a name="running"></a>Run the examples

> [!IMPORTANT]
> The **SSH** steps only work with a Linux-based HDInsight cluster. The **PowerShell** steps work with either a Linux or Windows-based HDInsight cluster, but require a Windows client.

### SSH

For more information on using SSH, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

1. Using the Python examples [streaming.py](#streamingpy) and [pig_python.py](#jythonpy), create local copies of the files on your development machine.

2. Use `scp` to copy the files to your HDInsight cluster. For example, the following command copies the files to a cluster named **mycluster**.

    ```bash
    scp streaming.py pig_python.py myuser@mycluster-ssh.azurehdinsight.net:
    ```

3. Use SSH to connect to the cluster.

    ```bash
    ssh myuser@mycluster-ssh.azurehdinsight.net
    ```

4. From the SSH session, add the python files uploaded previously to the WASB storage for the cluster.

    ```bash
    hdfs dfs -put streaming.py /streaming.py
    hdfs dfs -put pig_python.py /pig_python.py
    ```

After uploading the files, use the following steps to run the Hive and Pig jobs.

#### Hive

1. Use the `hive` command to start the hive shell. You should see a `hive>` prompt once the shell has loaded.

2. Enter the following query at the `hive>` prompt:

   ```hive
   add file wasbs:///streaming.py;
   SELECT TRANSFORM (clientid, devicemake, devicemodel)
       USING 'python streaming.py' AS
       (clientid string, phoneLabel string, phoneHash string)
   FROM hivesampletable
   ORDER BY clientid LIMIT 50;
   ```

3. After entering the last line, the job should start. Once the job completes, it returns output similar to the following example:

        100041    RIM 9650    d476f3687700442549a83fac4560c51c
        100041    RIM 9650    d476f3687700442549a83fac4560c51c
        100042    Apple iPhone 4.2.x    375ad9a0ddc4351536804f1d5d0ea9b9
        100042    Apple iPhone 4.2.x    375ad9a0ddc4351536804f1d5d0ea9b9
        100042    Apple iPhone 4.2.x    375ad9a0ddc4351536804f1d5d0ea9b9

#### Pig

1. Use the `pig` command to start the shell. You see a `grunt>` prompt once the shell has loaded.

2. Enter the following statements at the `grunt>` prompt:

   ```pig
   Register wasbs:///pig_python.py using jython as myfuncs;
   LOGS = LOAD 'wasbs:///example/data/sample.log' as (LINE:chararray);
   LOG = FILTER LOGS by LINE is not null;
   DETAILS = foreach LOG generate myfuncs.create_structure(LINE);
   DUMP DETAILS;
   ```

3. After entering the following line, the job should start. Once the job completes, it returns output similar to the following data:

        ((2012-02-03,20:11:56,SampleClass5,[TRACE],verbose detail for id 990982084))
        ((2012-02-03,20:11:56,SampleClass7,[TRACE],verbose detail for id 1560323914))
        ((2012-02-03,20:11:56,SampleClass8,[DEBUG],detail for id 2083681507))
        ((2012-02-03,20:11:56,SampleClass3,[TRACE],verbose detail for id 1718828806))
        ((2012-02-03,20:11:56,SampleClass3,[INFO],everything normal for id 530537821))

4. Use `quit` to exit the Grunt shell, and then use the following to edit the pig_python.py file on the local file system:

    ```bash
    nano pig_python.py
    ```

5. Once in the editor, uncomment the following line by removing the `#` character from the beginning of the line:

    ```bash
    #from pig_util import outputSchema
    ```

    Once the change has been made, use Ctrl+X to exit the editor. Select Y, and then enter to save the changes.

6. Use the `pig` command to start the shell again. Once you are at the `grunt>` prompt, use the following to run the Python script using the C Python interpreter.

   ```pig
   Register 'pig_python.py' using streaming_python as myfuncs;
   LOGS = LOAD 'wasbs:///example/data/sample.log' as (LINE:chararray);
   LOG = FILTER LOGS by LINE is not null;
   DETAILS = foreach LOG generate myfuncs.create_structure(LINE);
   DUMP DETAILS;
   ```

    Once this job completes, you should see the same output as when you previously ran the script using Jython.

### PowerShell

These steps use Azure PowerShell. For more information on using
Azure PowerShell, see [How to install and configure Azure PowerShell](/powershell/azure/overview).

1. Using the Python examples [streaming.py](#streamingpy) and [pig_python.py](#jythonpy), create local copies of the files on your development machine.
2. Use the following PowerShell script to upload the Python files to the server:

   ```powershell
    # Log in to your Azure subscription
    # Is there an active Azure subscription?
    $sub = Get-AzureRmSubscription -ErrorAction SilentlyContinue
    if(-not($sub))
    {
        Add-AzureRmAccount
    }

    # Get cluster info
    $clusterName = Read-Host -Prompt "Enter the HDInsight cluster name"
    # Change the path to match the file location on your system
    $pathToStreamingFile = "C:\path\to\streaming.py"
    $pathToJythonFile = "C:\path\to\pig_python.py"

    $clusterInfo = Get-AzureRmHDInsightCluster -ClusterName $clusterName
    $resourceGroup = $clusterInfo.ResourceGroup
    $storageAccountName=$clusterInfo.DefaultStorageAccount.split('.')[0]
    $container=$clusterInfo.DefaultStorageContainer
    $storageAccountKey=(Get-AzureRmStorageAccountKey `
        -Name $storageAccountName `
    -ResourceGroupName $resourceGroup)[0].Value

    #Create a storage content and upload the file
    $context = New-AzureStorageContext `
        -StorageAccountName $storageAccountName `
        -StorageAccountKey $storageAccountKey

    Set-AzureStorageBlobContent `
        -File $pathToStreamingFile `
        -Blob "streaming.py" `
        -Container $container `
        -Context $context

    Set-AzureStorageBlobContent `
        -File $pathToJythonFile `
        -Blob "pig_python.py" `
        -Container $container `
        -Context $context
   ```

    This script retrieves information for your HDInsight cluster, then extracts the account and key for the default storage account, and uploads the files to the root of the container.

   > [!NOTE]
   > For more information on uploading files, see the [Upload data for Hadoop jobs in HDInsight](hdinsight-upload-data.md) document.

After uploading the files, use the following PowerShell scripts to start the jobs. When the job completes, the output should be written to the PowerShell console.

#### Hive

The following script runs the **streaming.py** script. Before running, it prompts you for the HTTPs/Admin account information for your HDInsight cluster.

```powershell
# Login to your Azure subscription
# Is there an active Azure subscription?
$sub = Get-AzureRmSubscription -ErrorAction SilentlyContinue
if(-not($sub))
{
    Add-AzureRmAccount
}

# Get cluster info
$clusterName = Read-Host -Prompt "Enter the HDInsight cluster name"
$creds=Get-Credential -Message "Enter the login for the cluster"

# If using a Windows-based HDInsight cluster, change the USING statement to:
# "USING 'D:\Python27\python.exe streaming.py' AS " +
$HiveQuery = "add file wasbs:///streaming.py;" +
                "SELECT TRANSFORM (clientid, devicemake, devicemodel) " +
                "USING 'python streaming.py' AS " +
                "(clientid string, phoneLabel string, phoneHash string) " +
                "FROM hivesampletable " +
                "ORDER BY clientid LIMIT 50;"

$jobDefinition = New-AzureRmHDInsightHiveJobDefinition `
    -Query $HiveQuery

$job = Start-AzureRmHDInsightJob `
    -ClusterName $clusterName `
    -JobDefinition $jobDefinition `
    -HttpCredential $creds
Write-Host "Wait for the Hive job to complete ..." -ForegroundColor Green
Wait-AzureRmHDInsightJob `
    -JobId $job.JobId `
    -ClusterName $clusterName `
    -HttpCredential $creds
# Uncomment the following to see stderr output
# Get-AzureRmHDInsightJobOutput `
#   -Clustername $clusterName `
#   -JobId $job.JobId `
#   -HttpCredential $creds `
#   -DisplayOutputType StandardError
Write-Host "Display the standard output ..." -ForegroundColor Green
Get-AzureRmHDInsightJobOutput `
    -Clustername $clusterName `
    -JobId $job.JobId `
    -HttpCredential $creds
```

The output for the **Hive** job should appear similar to the following example:

    100041    RIM 9650    d476f3687700442549a83fac4560c51c
    100041    RIM 9650    d476f3687700442549a83fac4560c51c
    100042    Apple iPhone 4.2.x    375ad9a0ddc4351536804f1d5d0ea9b9
    100042    Apple iPhone 4.2.x    375ad9a0ddc4351536804f1d5d0ea9b9
    100042    Apple iPhone 4.2.x    375ad9a0ddc4351536804f1d5d0ea9b9

#### Pig (Jython)

The following script uses the **pig_python.py** script, using the Jython interpreter. Before running, it prompts you for the HTTPs/Admin information for the HDInsight cluster.

> [!NOTE]
> When remotely submitting a job using PowerShell, it is not possible to use C Python as the interpreter.

```powershell
# Login to your Azure subscription
# Is there an active Azure subscription?
$sub = Get-AzureRmSubscription -ErrorAction SilentlyContinue
if(-not($sub))
{
    Add-AzureRmAccount
}

# Get cluster info
$clusterName = Read-Host -Prompt "Enter the HDInsight cluster name"
$creds=Get-Credential -Message "Enter the login for the cluster"

$PigQuery = "Register wasbs:///pig_python.py using jython as myfuncs;" +
            "LOGS = LOAD 'wasbs:///example/data/sample.log' as (LINE:chararray);" +
            "LOG = FILTER LOGS by LINE is not null;" +
            "DETAILS = foreach LOG generate myfuncs.create_structure(LINE);" +
            "DUMP DETAILS;"

$jobDefinition = New-AzureRmHDInsightPigJobDefinition -Query $PigQuery

$job = Start-AzureRmHDInsightJob `
    -ClusterName $clusterName `
    -JobDefinition $jobDefinition `
    -HttpCredential $creds

Write-Host "Wait for the Pig job to complete ..." -ForegroundColor Green
Wait-AzureRmHDInsightJob `
    -Job $job.JobId `
    -ClusterName $clusterName `
    -HttpCredential $creds
# Uncomment the following to see stderr output
# Get-AzureRmHDInsightJobOutput `
#    -Clustername $clusterName `
#    -JobId $job.JobId `
#    -HttpCredential $creds `
#    -DisplayOutputType StandardError
Write-Host "Display the standard output ..." -ForegroundColor Green
Get-AzureRmHDInsightJobOutput `
    -Clustername $clusterName `
    -JobId $job.JobId `
    -HttpCredential $creds
```

The output for the **Pig** job should appear similar to the following data:

    ((2012-02-03,20:11:56,SampleClass5,[TRACE],verbose detail for id 990982084))
    ((2012-02-03,20:11:56,SampleClass7,[TRACE],verbose detail for id 1560323914))
    ((2012-02-03,20:11:56,SampleClass8,[DEBUG],detail for id 2083681507))
    ((2012-02-03,20:11:56,SampleClass3,[TRACE],verbose detail for id 1718828806))
    ((2012-02-03,20:11:56,SampleClass3,[INFO],everything normal for id 530537821))

## <a name="troubleshooting"></a>Troubleshooting

### Errors when running jobs

When running the hive job, you may encounter an error similar to the following text:

    Caused by: org.apache.hadoop.hive.ql.metadata.HiveException: [Error 20001]: An error occurred while reading or writing to your custom script. It may have crashed with an error.

This problem may be caused by the line endings in the Python file. Many Windows editors default to using CRLF as the line ending, but Linux applications usually expect LF.

You can use the following PowerShell statements to remove the CR characters before uploading the file to HDInsight:

```powershell
$original_file ='c:\path\to\streaming.py'
$text = [IO.File]::ReadAllText($original_file) -replace "`r`n", "`n"
[IO.File]::WriteAllText($original_file, $text)
```

### PowerShell scripts

Both of the example PowerShell scripts used to run the examples contain a commented line that displays error output for the job. If you are not seeing the expected output for the job, uncomment the following line and see if the error information indicates a problem.

```powershell
# Get-AzureRmHDInsightJobOutput `
        -Clustername $clusterName `
        -JobId $job.JobId `
        -HttpCredential $creds `
        -DisplayOutputType StandardError
```

The error information (STDERR) and the result of the job (STDOUT) are also logged to your HDInsight storage.

| For this job... | Look at these files in the blob container |
| --- | --- |
| Hive |/HivePython/stderr<p>/HivePython/stdout |
| Pig |/PigPython/stderr<p>/PigPython/stdout |

## <a name="next"></a>Next steps

If you need to load Python modules that aren't provided by default, see [How to deploy a module to Azure HDInsight](http://blogs.msdn.com/b/benjguin/archive/2014/03/03/how-to-deploy-a-python-module-to-windows-azure-hdinsight.aspx).

For other ways to use Pig, Hive, and to learn about using MapReduce, see the following documents:

* [Use Hive with HDInsight](hdinsight-use-hive.md)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md)
