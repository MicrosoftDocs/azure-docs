# Azure Spark Cluster Setup #

## Intro ##
This guide describes how to setup an Azure Spark Cluster so that it can be used to execute Data Prep jobs prepared and then submitted from Azure Machine Learning Workbench.

## Data Sources ##
Jobs running on an Azure HDInsight Spark cluster can read and write data in Azure Blob storage and Azure Data Lake Storage. The cluster you use should be in the same region as the data you wish to process to avoid data egress charges and slower performance from transferring data to and from the cluster. The storage account needs to be connected to the cluster either as its primary data source or as an additional data source. The jobs will access the data using the cluster’s rights to read and write the data. Adding the storage account to the cluster as a data source grants the cluster the right to read and write to the storage account.

## Creating a Cluster ##
To create an Azure HDInsight Spark Cluster, use the Azure management portal: [https://portal.azure.com/#create/Microsoft.HDInsightCluster](http://)

Select “Spark” cluster type – currently only versions “Spark 1.6.2 (HDI 3.5)” and “Spark 2.0.x (HDI 3.5)” are supported (where x means any value).

If the cluster needs access to storage accounts (apart from the Data Source), add them as additional storage accounts. This is best done at cluster creation time.

![](CloudUISetup.png)

Additional storage accounts can be added to a cluster after creation time with script actions. See this article for more information: https://go.microsoft.com/fwlink/?linkid=832754

## Preparing the Cluster ##
Once the cluster has been created, a change to the cluster is required before jobs submitted from Azure ML Workbench Data Prep will run without error. A script action needs to be added to install needed components on all nodes of the cluster.

From the Azure Management Portal, set up the script action, using this script url: [https://pendletonpreview.blob.core.windows.net/spark-scripted-actions/setupPython3.sh](http://)

![](CloudUISetup2.png)

The script setupPython3.sh contains the following content. You can create your own script file and upload it to your Azure Storage account if desired.

`#!/bin/bash`
`# configure spark cluster for python runtime`
`/usr/bin/anaconda/envs/py35/bin/pip install regex`

Once the script action has completed successfully, your cluster is ready to run Azure ML Workbench Data Prep jobs.

## Seeing your jobs ##
Your jobs run as YARN applications. As well as the list of jobs in Azure ML Workbench Data Prep, you can see the YARN and Spark web sites for your cluster here, where you will see details of the jobs you have run:
[https://YourClusterName.azurehdinsight.net/yarnui](http://)
[https://YourClusterName.azurehdinsight.net/sparkhistory](http://)
 
## Common Errors ##
`Error:`  
`Log Type: stdout`   
`Log Upload Time: Xxx Xxx XX XX:XX:XX +XXXX XXXX`   
`Log Length: 173`  
`  File "main.py", line 13`  
`SyntaxError: Non-ASCII character '\xe2' in file main.py on line 13, but no encoding declared; `  
`see http://python.org/dev/peps/pep-0263/ for details`  

### Cause: ###
Running with Python version 2 rather than version 3. 

### Fix: ###
Check that the cluster preparation steps outlined above have been followed.
Ensure that the Azure Cluster is at least HDP version 2.4.3 by going to: https://yourClusterName.azurehdinsight.net/#/main/admin/stack/versions
If the version is earlier, you will need to create a cluster with a later version.

### Error: ###
`Log Type: stdout  
`Log Upload Time: Xxx Xxx XX XX:XX:XX +XXXX XXXX  
`Log Length: 4100  
`File "/usr/hdp/current/spark-client/python/lib/py4j-0.9-src.zip/py4j/protocol.py", line 308, in get_return_value
`py4j.protocol.Py4JJavaError: An error occurred while calling o62.partitions.  
: org.apache.hadoop.fs.azure.AzureException: org.apache.hadoop.fs.azure.AzureException: Container <container name> in account <storage account name>.blob.core.windows.net not found, and we can't create it using anoynomous credentials, and no credentials found for them in the configuration.`

### Cause: ###
The cluster does not have access to the storage account.

### Fix: ###
Grant the cluster access to the storage account. This can be done at cluster creation time using the Azure Portal (see details above), or you can add a storage account to an existing cluster using the instructions outlined here: https://go.microsoft.com/fwlink/?linkid=832754 

### Error: ###
`Log Type: stdout`  
`Log Upload Time: Xxx Xxx XX XX:XX:XX +XXXX XXXX`  
`Log Length: 159`  
`Traceback (most recent call last):`  
`  File "main.py", line 11, in <module>`  
`    t4 = ex.Take(t3, 1001)`  
`AttributeError: 'Executor' object has no attribute 'Take'`  

### Cause: ###
Sampling was selected in the Data Source dialog when the data source was added in Azure ML Workbench Data prep.

### Fix: ###
In Azure ML Workbench Data Prep, edit the first step of the package, which should be “Load”. For “Sample”, select “Full File”. Run the package again.






