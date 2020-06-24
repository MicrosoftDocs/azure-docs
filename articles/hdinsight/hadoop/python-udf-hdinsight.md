---
title: Python UDF with Apache Hive and Apache Pig - Azure HDInsight 
description: Learn how to use Python User Defined Functions (UDF) from Apache Hive and Apache Pig in HDInsight, the Apache Hadoop technology stack on Azure.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 11/15/2019
ms.custom: H1Hack27Feb2017,hdinsightactive, tracking-python
---

# Use Python User Defined Functions (UDF) with Apache Hive and Apache Pig in HDInsight

Learn how to use Python user-defined functions (UDF) with Apache Hive and Apache Pig in Apache Hadoop on Azure HDInsight.

## <a name="python"></a>Python on HDInsight

Python2.7 is installed by default on HDInsight 3.0 and later. Apache Hive can be used with this version of Python for stream processing. Stream processing uses STDOUT and STDIN to pass data between Hive and the UDF.

HDInsight also includes Jython, which is a Python implementation written in Java. Jython runs directly on the Java Virtual Machine and doesn't use streaming. Jython is the recommended Python interpreter when using Python with Pig.

## Prerequisites

* **A Hadoop cluster on HDInsight**. See [Get Started with HDInsight on Linux](apache-hadoop-linux-tutorial-get-started.md).
* **An SSH client**. For more information, see [Connect to HDInsight (Apache Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).
* The [URI scheme](../hdinsight-hadoop-linux-information.md#URI-and-scheme) for your clusters primary storage. This would be `wasb://` for Azure Storage, `abfs://` for Azure Data Lake Storage Gen2 or adl:// for Azure Data Lake Storage Gen1. If secure transfer is enabled for Azure Storage, the URI would be wasbs://.  See also, [secure transfer](../../storage/common/storage-require-secure-transfer.md).
* **Possible change to storage configuration.**  See [Storage configuration](#storage-configuration) if using storage account kind `BlobStorage`.
* Optional.  If Planning to use PowerShell, you'll need the [AZ module](https://docs.microsoft.com/powershell/azure/new-azureps-module-az) installed.

> [!NOTE]  
> The storage account used in this article was Azure Storage with [secure transfer](../../storage/common/storage-require-secure-transfer.md) enabled and thus `wasbs` is used throughout the article.

## Storage configuration

No action is required if the storage account used is of kind `Storage (general purpose v1)` or `StorageV2 (general purpose v2)`.  The process in this article will produce output to at least `/tezstaging`.  A default hadoop configuration will contain `/tezstaging` in the `fs.azure.page.blob.dir` configuration variable in `core-site.xml` for service `HDFS`.  This configuration will cause output to the directory to be page blobs, which aren't supported for storage account kind `BlobStorage`.  To use `BlobStorage` for this article, remove `/tezstaging` from the `fs.azure.page.blob.dir` configuration variable.  The configuration can be accessed from the [Ambari UI](../hdinsight-hadoop-manage-ambari.md).  Otherwise, you'll receive the error message: `Page blob is not supported for this account type.`

> [!WARNING]  
> The steps in this document make the following assumptions:  
>
> * You create the Python scripts on your local development environment.
> * You upload the scripts to HDInsight using either the `scp` command or the provided PowerShell script.
>
> If you want to use the [Azure Cloud Shell (bash)](https://docs.microsoft.com/azure/cloud-shell/overview) to work with HDInsight, then you must:
>
> * Create the scripts inside the cloud shell environment.
> * Use `scp` to upload the files from the cloud shell to HDInsight.
> * Use `ssh` from the cloud shell to connect to HDInsight and run the examples.

## <a name="hivepython"></a>Apache Hive UDF

Python can be used as a UDF from Hive through the HiveQL `TRANSFORM` statement. For example, the following HiveQL invokes the `hiveudf.py` file stored in the default Azure Storage account for the cluster.

```hiveql
add file wasbs:///hiveudf.py;

SELECT TRANSFORM (clientid, devicemake, devicemodel)
    USING 'python hiveudf.py' AS
    (clientid string, phoneLabel string, phoneHash string)
FROM hivesampletable
ORDER BY clientid LIMIT 50;
```

Here's what this example does:

1. The `add file` statement at the beginning of the file adds the `hiveudf.py` file to the distributed cache, so it's accessible by all nodes in the cluster.
2. The `SELECT TRANSFORM ... USING` statement selects data from the `hivesampletable`. It also passes the clientid, devicemake, and devicemodel values to the `hiveudf.py` script.
3. The `AS` clause describes the fields returned from `hiveudf.py`.

<a name="streamingpy"></a>

### Create file

On your development environment, create a text file named `hiveudf.py`. Use the following code as the contents of the file:

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

1. Reads a line of data from STDIN.
2. The trailing newline character is removed using `string.strip(line, "\n ")`.
3. When doing stream processing, a single line contains all the values with a tab character between each value. So `string.split(line, "\t")` can be used to split the input at each tab, returning just the fields.
4. When processing is complete, the output must be written to STDOUT as a single line, with a tab between each field. For example, `print "\t".join([clientid, phone_label, hashlib.md5(phone_label).hexdigest()])`.
5. The `while` loop repeats until no `line` is read.

The script output is a concatenation of the input values for `devicemake` and `devicemodel`, and a hash of the concatenated value.

### Upload file (shell)

In the commands below, replace `sshuser` with the actual username if different.  Replace `mycluster` with the actual cluster name.  Ensure your working directory is where the file is located.

1. Use `scp` to copy the files to your HDInsight cluster. Edit and enter the command below:

    ```cmd
    scp hiveudf.py sshuser@mycluster-ssh.azurehdinsight.net:
    ```

2. Use SSH to connect to the cluster.  Edit and enter the command below:

    ```cmd
    ssh sshuser@mycluster-ssh.azurehdinsight.net
    ```

3. From the SSH session, add the python files uploaded previously to the storage for the cluster.

    ```bash
    hdfs dfs -put hiveudf.py /hiveudf.py
    ```

### Use Hive UDF (shell)

1. To connect to Hive, use the following command from your open SSH session:

    ```bash
    beeline -u 'jdbc:hive2://headnodehost:10001/;transportMode=http'
    ```

    This command starts the Beeline client.

2. Enter the following query at the `0: jdbc:hive2://headnodehost:10001/>` prompt:

   ```hive
   add file wasbs:///hiveudf.py;
   SELECT TRANSFORM (clientid, devicemake, devicemodel)
       USING 'python hiveudf.py' AS
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

4. To exit Beeline, enter the following command:

    ```hive
    !q
    ```

### Upload file (PowerShell)

PowerShell can also be used to remotely run Hive queries. Ensure your working directory is where `hiveudf.py` is located.  Use the following PowerShell script to run a Hive query that uses the `hiveudf.py` script:

```PowerShell
# Login to your Azure subscription
# Is there an active Azure subscription?
$sub = Get-AzSubscription -ErrorAction SilentlyContinue
if(-not($sub))
{
    Connect-AzAccount
}

# If you have multiple subscriptions, set the one to use
# Select-AzSubscription -SubscriptionId "<SUBSCRIPTIONID>"

# Revise file path as needed
$pathToStreamingFile = ".\hiveudf.py"

# Get cluster info
$clusterName = Read-Host -Prompt "Enter the HDInsight cluster name"
$clusterInfo = Get-AzHDInsightCluster -ClusterName $clusterName
$resourceGroup = $clusterInfo.ResourceGroup
$storageAccountName=$clusterInfo.DefaultStorageAccount.split('.')[0]
$container=$clusterInfo.DefaultStorageContainer
$storageAccountKey=(Get-AzStorageAccountKey `
   -ResourceGroupName $resourceGroup `
   -Name $storageAccountName)[0].Value

# Create an Azure Storage context
$context = New-AzStorageContext `
    -StorageAccountName $storageAccountName `
    -StorageAccountKey $storageAccountKey

# Upload local files to an Azure Storage blob
Set-AzStorageBlobContent `
    -File $pathToStreamingFile `
    -Blob "hiveudf.py" `
    -Container $container `
    -Context $context
```

> [!NOTE]  
> For more information on uploading files, see the [Upload data for Apache Hadoop jobs in HDInsight](../hdinsight-upload-data.md) document.

#### Use Hive UDF

```PowerShell
# Script should stop on failures
$ErrorActionPreference = "Stop"

# Login to your Azure subscription
# Is there an active Azure subscription?
$sub = Get-AzSubscription -ErrorAction SilentlyContinue
if(-not($sub))
{
    Connect-AzAccount
}

# If you have multiple subscriptions, set the one to use
# Select-AzSubscription -SubscriptionId "<SUBSCRIPTIONID>"

# Get cluster info
$clusterName = Read-Host -Prompt "Enter the HDInsight cluster name"
$creds=Get-Credential -UserName "admin" -Message "Enter the login for the cluster"

$HiveQuery = "add file wasbs:///hiveudf.py;" +
                "SELECT TRANSFORM (clientid, devicemake, devicemodel) " +
                "USING 'python hiveudf.py' AS " +
                "(clientid string, phoneLabel string, phoneHash string) " +
                "FROM hivesampletable " +
                "ORDER BY clientid LIMIT 50;"

# Create Hive job object
$jobDefinition = New-AzHDInsightHiveJobDefinition `
    -Query $HiveQuery

# For status bar updates
$activity="Hive query"

# Progress bar (optional)
Write-Progress -Activity $activity -Status "Starting query..."

# Start defined Azure HDInsight job on specified cluster.
$job = Start-AzHDInsightJob `
    -ClusterName $clusterName `
    -JobDefinition $jobDefinition `
    -HttpCredential $creds

# Progress bar (optional)
Write-Progress -Activity $activity -Status "Waiting on query to complete..."

# Wait for completion or failure of specified job
Wait-AzHDInsightJob `
    -JobId $job.JobId `
    -ClusterName $clusterName `
    -HttpCredential $creds

# Uncomment the following to see stderr output
<#
Get-AzHDInsightJobOutput `
   -Clustername $clusterName `
   -JobId $job.JobId `
   -HttpCredential $creds `
   -DisplayOutputType StandardError
#>

# Progress bar (optional)
Write-Progress -Activity $activity -Status "Retrieving output..."

# Gets the log output
Get-AzHDInsightJobOutput `
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

## <a name="pigpython"></a>Apache Pig UDF

A Python script can be used as a UDF from Pig through the `GENERATE` statement. You can run the script using either Jython or C Python.

* Jython runs on the JVM, and can natively be called from Pig.
* C Python is an external process, so the data from Pig on the JVM is sent out to the script running in a Python process. The output of the Python script is sent back into Pig.

To specify the Python interpreter, use `register` when referencing the Python script. The following examples register scripts with Pig as `myfuncs`:

* **To use Jython**: `register '/path/to/pigudf.py' using jython as myfuncs;`
* **To use C Python**: `register '/path/to/pigudf.py' using streaming_python as myfuncs;`

> [!IMPORTANT]  
> When using Jython, the path to the pig_jython file can be either a local path or a WASBS:// path. However, when using C Python, you must reference a file on the local file system of the node that you are using to submit the Pig job.

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

### Create file

On your development environment, create a text file named `pigudf.py`. Use the following code as the contents of the file:

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

In the Pig Latin example, the `LINE` input is defined as a chararray because there's no consistent schema for the input. The Python script transforms the data into a consistent schema for output.

1. The `@outputSchema` statement defines the format of the data that is returned to Pig. In this case, it's a **data bag**, which is a Pig data type. The bag contains the following fields, all of which are chararray (strings):

   * date - the date the log entry was created
   * time - the time the log entry was created
   * classname - the class name the entry was created for
   * level - the log level
   * detail - verbose details for the log entry

2. Next, the `def create_structure(input)` defines the function that Pig passes line items to.

3. The example data, `sample.log`, mostly conforms to the date, time, classname, level, and detail schema. However, it contains a few lines that begin with `*java.lang.Exception*`. These lines must be modified to match the schema. The `if` statement checks for those, then massages the input data to move the `*java.lang.Exception*` string to the end, bringing the data in-line with the expected output schema.

4. Next, the `split` command is used to split the data at the first four space characters. The output is assigned into `date`, `time`, `classname`, `level`, and `detail`.

5. Finally, the values are returned to Pig.

When the data is returned to Pig, it has a consistent schema as defined in the `@outputSchema` statement.

### Upload file (shell)

In the commands below, replace `sshuser` with the actual username if different.  Replace `mycluster` with the actual cluster name.  Ensure your working directory is where the file is located.

1. Use `scp` to copy the files to your HDInsight cluster. Edit and enter the command below:

    ```cmd
    scp pigudf.py sshuser@mycluster-ssh.azurehdinsight.net:
    ```

2. Use SSH to connect to the cluster.  Edit and enter the command below:

    ```cmd
    ssh sshuser@mycluster-ssh.azurehdinsight.net
    ```

3. From the SSH session, add the python files uploaded previously to the storage for the cluster.

    ```bash
    hdfs dfs -put pigudf.py /pigudf.py
    ```

### Use Pig UDF (shell)

1. To connect to pig, use the following command from your open SSH session:

    ```bash
    pig
    ```

2. Enter the following statements at the `grunt>` prompt:

   ```pig
   Register wasbs:///pigudf.py using jython as myfuncs;
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

4. Use `quit` to exit the Grunt shell, and then use the following to edit the pigudf.py file on the local file system:

    ```bash
    nano pigudf.py
    ```

5. Once in the editor, uncomment the following line by removing the `#` character from the beginning of the line:

    ```bash
    #from pig_util import outputSchema
    ```

    This line modifies the Python script to work with C Python instead of Jython. Once the change has been made, use **Ctrl+X** to exit the editor. Select **Y**, and then **Enter** to save the changes.

6. Use the `pig` command to start the shell again. Once you are at the `grunt>` prompt, use the following to run the Python script using the C Python interpreter.

   ```pig
   Register 'pigudf.py' using streaming_python as myfuncs;
   LOGS = LOAD 'wasbs:///example/data/sample.log' as (LINE:chararray);
   LOG = FILTER LOGS by LINE is not null;
   DETAILS = foreach LOG generate myfuncs.create_structure(LINE);
   DUMP DETAILS;
   ```

    Once this job completes, you should see the same output as when you previously ran the script using Jython.

### Upload file (PowerShell)

PowerShell can also be used to remotely run Hive queries. Ensure your working directory is where `pigudf.py` is located.  Use the following PowerShell script to run a Hive query that uses the `pigudf.py` script:

```PowerShell
# Login to your Azure subscription
# Is there an active Azure subscription?
$sub = Get-AzSubscription -ErrorAction SilentlyContinue
if(-not($sub))
{
    Connect-AzAccount
}

# If you have multiple subscriptions, set the one to use
# Select-AzSubscription -SubscriptionId "<SUBSCRIPTIONID>"

# Revise file path as needed
$pathToJythonFile = ".\pigudf.py"


# Get cluster info
$clusterName = Read-Host -Prompt "Enter the HDInsight cluster name"
$clusterInfo = Get-AzHDInsightCluster -ClusterName $clusterName
$resourceGroup = $clusterInfo.ResourceGroup
$storageAccountName=$clusterInfo.DefaultStorageAccount.split('.')[0]
$container=$clusterInfo.DefaultStorageContainer
$storageAccountKey=(Get-AzStorageAccountKey `
   -ResourceGroupName $resourceGroup `
   -Name $storageAccountName)[0].Value

# Create an Azure Storage context
$context = New-AzStorageContext `
    -StorageAccountName $storageAccountName `
    -StorageAccountKey $storageAccountKey

# Upload local files to an Azure Storage blob
Set-AzStorageBlobContent `
    -File $pathToJythonFile `
    -Blob "pigudf.py" `
    -Container $container `
    -Context $context
```

### Use Pig UDF (PowerShell)

> [!NOTE]  
> When remotely submitting a job using PowerShell, it is not possible to use C Python as the interpreter.

PowerShell can also be used to run Pig Latin jobs. To run a Pig Latin job that uses the `pigudf.py` script, use the following PowerShell script:

```PowerShell
# Script should stop on failures
$ErrorActionPreference = "Stop"

# Login to your Azure subscription
# Is there an active Azure subscription?
$sub = Get-AzSubscription -ErrorAction SilentlyContinue
if(-not($sub))
{
    Connect-AzAccount
}

# Get cluster info
$clusterName = Read-Host -Prompt "Enter the HDInsight cluster name"
$creds=Get-Credential -UserName "admin" -Message "Enter the login for the cluster"


$PigQuery = "Register wasbs:///pigudf.py using jython as myfuncs;" +
            "LOGS = LOAD 'wasbs:///example/data/sample.log' as (LINE:chararray);" +
            "LOG = FILTER LOGS by LINE is not null;" +
            "DETAILS = foreach LOG generate myfuncs.create_structure(LINE);" +
            "DUMP DETAILS;"

# Create Pig job object
$jobDefinition = New-AzHDInsightPigJobDefinition -Query $PigQuery

# For status bar updates
$activity="Pig job"

# Progress bar (optional)
Write-Progress -Activity $activity -Status "Starting job..."

# Start defined Azure HDInsight job on specified cluster.
$job = Start-AzHDInsightJob `
    -ClusterName $clusterName `
    -JobDefinition $jobDefinition `
    -HttpCredential $creds

# Progress bar (optional)
Write-Progress -Activity $activity -Status "Waiting for the Pig job to complete..."

# Wait for completion or failure of specified job
Wait-AzHDInsightJob `
    -Job $job.JobId `
    -ClusterName $clusterName `
    -HttpCredential $creds

# Uncomment the following to see stderr output
<#
Get-AzHDInsightJobOutput `
    -Clustername $clusterName `
    -JobId $job.JobId `
    -HttpCredential $creds `
    -DisplayOutputType StandardError
#>

# Progress bar (optional)
Write-Progress -Activity $activity "Retrieving output..."

# Gets the log output
Get-AzHDInsightJobOutput `
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

[!code-powershell[main](../../../powershell_scripts/hdinsight/run-python-udf/run-python-udf.ps1?range=148-150)]

### PowerShell scripts

Both of the example PowerShell scripts used to run the examples contain a commented line that displays error output for the job. If you aren't seeing the expected output for the job, uncomment the following line and see if the error information indicates a problem.

[!code-powershell[main](../../../powershell_scripts/hdinsight/run-python-udf/run-python-udf.ps1?range=135-139)]

The error information (STDERR) and the result of the job (STDOUT) are also logged to your HDInsight storage.

| For this job... | Look at these files in the blob container |
| --- | --- |
| Hive |/HivePython/stderr<p>/HivePython/stdout |
| Pig |/PigPython/stderr<p>/PigPython/stdout |

## <a name="next"></a>Next steps

If you need to load Python modules that aren't provided by default, see [How to deploy a module to Azure HDInsight](https://blogs.msdn.com/b/benjguin/archive/2014/03/03/how-to-deploy-a-python-module-to-windows-azure-hdinsight.aspx).

For other ways to use Pig, Hive, and to learn about using MapReduce, see the following documents:

* [Use Apache Hive with HDInsight](hdinsight-use-hive.md)
* [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md)
