---
title: Troubleshoot Azure Data Factory | Microsoft Docs
description: Learn how to troubleshoot external control activities in Azure Data Factory. 
services: data-factory
author: nabhishek
ms.service: data-factory
ms.topic: troubleshooting
ms.date: 8/26/2019
ms.author: abnarain
ms.reviewer: craigg
---

# Troubleshoot Azure Data Factory

This article explores common troubleshooting methods for external control activities in Azure Data Factory.

## Connector and copy activity

For connector issues e.g. encounter error using copy activity, refer to [Troubleshoot Azure Data Factory Connectors](connector-troubleshoot-guide.md).

## Azure Databricks

### Error code:  3200

- **Message**: Error 403.

- **Cause**: `The Databricks access token has expired.`

- **Recommendation**: By default, the Azure Databricks access token is valid for 90 days. Create a new token and update the linked service.


### Error code:  3201

- **Message**: `Missing required field: settings.task.notebook_task.notebook_path.`

- **Cause**: `Bad authoring: Notebook path not specified correctly.`

- **Recommendation**: Specify the notebook path in the Databricks activity.

<br/>

- **Message**: `Cluster   ... does not exist.`

- **Cause**: `Authoring error: Databricks cluster does not exist or has been deleted.`

- **Recommendation**: Verify that the Databricks cluster exists.

<br/>

- **Message**: `Invalid Python file URI.... Please visit Databricks user guide for supported URI schemes.`

- **Cause**: `Bad authoring.`

- **Recommendation**: Specify either absolute paths for workspace-addressing schemes, or `dbfs:/folder/subfolder/foo.py` for files stored in Databricks File System.

<br/>

- **Message**: `{0} LinkedService should have domain and accessToken as required properties.`

- **Cause**: `Bad authoring.`

- **Recommendation**: Verify the [linked service definition](compute-linked-services.md#azure-databricks-linked-service).

<br/>

- **Message**: `{0} LinkedService should specify either existing cluster ID or new cluster information for creation.`

- **Cause**:  `Bad authoring.`

- **Recommendation**: Verify the [linked service definition](compute-linked-services.md#azure-databricks-linked-service).

<br/>

- **Message**: `Node type Standard_D16S_v3 is not supported. Supported node types:   Standard_DS3_v2, Standard_DS4_v2, Standard_DS5_v2, Standard_D8s_v3,   Standard_D16s_v3, Standard_D32s_v3, Standard_D64s_v3, Standard_D3_v2,   Standard_D8_v3, Standard_D16_v3, Standard_D32_v3, Standard_D64_v3,   Standard_D12_v2, Standard_D13_v2, Standard_D14_v2, Standard_D15_v2,   Standard_DS12_v2, Standard_DS13_v2, Standard_DS14_v2, Standard_DS15_v2,   Standard_E8s_v3, Standard_E16s_v3, Standard_E32s_v3, Standard_E64s_v3,   Standard_L4s, Standard_L8s, Standard_L16s, Standard_L32s, Standard_F4s,   Standard_F8s, Standard_F16s, Standard_H16, Standard_F4s_v2, Standard_F8s_v2,   Standard_F16s_v2, Standard_F32s_v2, Standard_F64s_v2, Standard_F72s_v2,   Standard_NC12, Standard_NC24, Standard_NC6s_v3, Standard_NC12s_v3,   Standard_NC24s_v3, Standard_L8s_v2, Standard_L16s_v2, Standard_L32s_v2,   Standard_L64s_v2, Standard_L80s_v2.`

- **Cause**: `Bad authoring.`

- **Recommendation**: Refer to the error message. 

<br/>

### Error code:  3202

- **Message**: `There were already 1000 jobs created in past 3600 seconds, exceeding rate limit:   1000 job creations per 3600 seconds.`

- **Cause**: `Too many Databricks runs in an hour.`

- **Recommendation**: Check all pipelines that use this Databricks workspace for their job   creation rate.  If pipelines launched   too many Databricks runs in aggregate, migrate some pipelines to a new   workspace.

<br/>

- **Message**: `Could not parse request object: Expected 'key' and 'value' to be set for JSON map field base_parameters, got 'key: "..."' instead.`

- **Cause**: `Authoring error: No value provided for the parameter.`

- **Recommendation**: Inspect the pipeline JSON and ensure all parameters in the baseParameters notebook specify a nonempty value.

<br/>

- **Message**: `User: `SimpleUserContext{userId=..., name=user@company.com, orgId=...}` is not   authorized to access cluster.`

- **Cause**: The user who generated the access token isn't allowed to access the   Databricks cluster specified in the linked service.

- **Recommendation**: Ensure the user has the required permissions in the workspace.


### Error code:  3203

- **Message**: `The cluster is in Terminated state, not available to receive jobs. Please fix the cluster or retry later.`

- **Cause**: The cluster was terminated. For interactive clusters, this might be a race condition.

- **Recommendation**: The best way to avoid this error is to use job clusters.


### Error code:  3204

- **Message**: `Job execution failed.`

- **Cause**:  Error messages indicate various issues, such as an unexpected cluster state or a specific activity. Most often no error   message appears at all. 

- **Recommendation**: N/A


## Azure Data Lake Analytics

The following table applies to U-SQL.


### Error code:  2709

- **Message**: `The access token is from the wrong tenant.`

- **Cause**:  Incorrect Azure Active Directory (Azure AD) tenant.

- **Recommendation**: Incorrect Azure Active Directory (Azure AD) tenant.

<br/>

- **Message**: `We cannot accept your job at this moment. The maximum number of queued jobs for   your account is 200. `

- **Cause**:  This error is caused by throttling on Data Lake Analytics.

- **Recommendation**: Reduce the number of submitted jobs to Data Lake Analytics by changing Data Factory triggers and concurrency settings on activities. Or increase the limits on Data Lake Analytics.

<br/>

- **Message**: `This job was rejected because it requires 24 AUs. This account's administrator-defined policy prevents a job from using more than 5 AUs.`

- **Cause**:  This error is caused by throttling on Data Lake Analytics. 

- **Recommendation**: Reduce the number of submitted jobs to Data Lake Analytics by changing Data Factory triggers and concurrency settings on activities. Or increase the limits on Data Lake Analytics.


### Error code:  2705

- **Message**: `Forbidden. ACL verification failed. Either the resource does not exist or the user is not authorized to perform the requested operation.<br/><br/>User is   not able to access Data Lake Store.  <br/><br/>User is  not authorized to use Data Lake Analytics.`

- **Cause**:  The service principal or certificate doesn't have access to the file in storage.

- **Recommendation**: Make sure the service principal or certificate the user provides for Data Lake Analytics jobs has access to the Data Lake Analytics account and the default Data Lake Storage instance from the root folder.


### Error code:  2711

- **Message**: `Forbidden. ACL verification failed. Either the resource does not exist or the user is not authorized to perform the requested operation.<br/><br/>User is   not able to access Data Lake Store.  <br/><br/>User is  not authorized to use Data Lake Analytics.`

- **Cause**:  The service principal or certificate doesn't have access to the file in storage.

- **Recommendation**: Make sure the service principal or certificate the user provides for Data Lake Analytics jobs has access to the Data Lake Analytics account and the default Data Lake Storage instance from the root folder.

<br/>

- **Message**: `Cannot find the 'Azure Data Lake Store' file or folder.`

- **Cause**:  The   path to the U-SQL file is wrong, or the linked service credentials don't have access.

- **Recommendation**: Verify the path and credentials provided in the linked service.


### Error code:  2704

- **Message**: `Forbidden. ACL verification failed. Either the resource does not exist or the user is not authorized to perform the requested operation.<br/><br/>User is   not able to access Data Lake Store.  <br/><br/>User is  not authorized to use Data Lake Analytics.`

- **Cause**:  The service principal or certificate doesn't have access to the file in storage.

- **Recommendation**: Make sure the service principal or certificate the user provides for Data Lake Analytics jobs has access to the Data Lake Analytics account and the default Data Lake Storage instance from the root folder.


### Error code:  2707

- **Message**: `Cannot resolve the account of AzureDataLakeAnalytics. Please check 'AccountName' and   'DataLakeAnalyticsUri'.`

- **Cause**:  The Data Lake Analytics account in the linked service is wrong.

- **Recommendation**: Verify that the right account is provided.


### Error code:  2703

- **Message**: `Error Id: E_CQO_SYSTEM_INTERNAL_ERROR (or any error that starts with "Error   Id:").`

- **Cause**:  The error is from Data Lake Analytics. 

- **Recommendation**: An error like the example means the job was submitted to Data Lake Analytics, and the   script there failed. Investigate in Data Lake Analytics. In the portal, go to the Data Lake Analytics account, and look for the job by using the Data Factory activity run ID (not the pipeline run ID). The job there provides more   information about the error and will help you troubleshoot. If the resolution isn't clear, contact the Data Lake Analytics support team and provide the job URL, which   includes your account name and the job ID.



## Azure functions

### Error code:  3602

- **Message**: `Invalid HttpMethod: {method}.`

- **Cause**: Http method specified in the activity payload is not supported by Azure Function Activity. 

- **Recommendation**: The Http methods that are supported are PUT, POST, GET, DELETE, OPTIONS, HEAD, and TRACE.


### Error code:  3603

- **Message**: `Response content is not a valid JObject.`

- **Cause**: The Azure function that was called didn't return a JSON payload in the response. Azure function activity in Data Factory supports only JSON response content. 

- **Recommendation**: Update the Azure function to return a valid JSON payload. For example, a C# function can return `(ActionResult)new<OkObjectResult("{`\"Id\":\"123\"`}");`.


### Error code:  3606

- **Message**: `Azure function activity missing function key.`

- **Cause**: Azure function activity definition is not complete. 

- **Recommendation**: Please check the input AzureFunction activity JSON definition has property named 'functionKey'.


### Error code:  3607

- **Message**: `Azure function activity missing function name.`

- **Cause**: Azure function activity definition is not complete. 

- **Recommendation**: Please check the input AzureFunction activity JSON definition has property named 'functionName'.


### Error code:  3608

- **Message**: `Call to provided Azure function '{FunctionName}' failed with status-'{statusCode}' and message - '{message}'.` 

- **Cause**: Azure function details in activity definition may be incorrect. 

- **Recommendation**: Fix the azure function details and retry again.


### Error code:  3609

- **Message**: `Azure function activity missing functionAppUrl.` 

- **Cause**: Azure function activity definition is not complete. 

- **Recommendation**: Please check the input AzureFunction activity JSON definition has property named 'functionAppUrl'.


### Error code:  3610

- **Message**: `There was an error while calling endpoint.`

- **Cause**: Function URL may be incorrect.

- **Recommendation**: Please make sure the value for 'functionAppUrl' in the activity JSON is correct and try again.


### Error code:  3611

- **Message**: `Azure function activity missing Method in JSON.` 

- **Cause**: Azure function activity definition is not complete.

- **Recommendation**: Please check the input AzureFunction activity JSON definition has property named 'method'.


### Error code:  3612

- **Message**: `Azure function activity missing LinkedService definition in JSON.`

- **Cause**: Azure function activity definition is not complete.

- **Recommendation**: Please check the input AzureFunction activity JSON definition has linked service details.



## Custom

The following table applies to Azure Batch.


### Error code:  2500

- **Message**: `Hit unexpected exception and execution failed.`

- **Cause**: `Can't launch command, or the program returned an error code.`

- **Recommendation**:  Ensure that the executable file exists. If the program started, make sure *stdout.txt* and *stderr.txt* were uploaded to the storage account. It's a good practice to emit copious logs in your code for debugging.


### Error code:  2501

- **Message**: `Cannot access user batch account; please check batch account settings.`

- **Cause**: Incorrect Batch access key or pool name.

- **Recommendation**: Verify the pool name and the Batch access key in the linked service.


### Error code:  2502

- **Message**: `Cannot access user storage account; please check storage account settings.`

- **Cause**: Incorrect storage account name or access key.

- **Recommendation**: Verify the storage account name and the access key in the linked service.


### Error code:  2504

- **Message**:  `Operation returned an invalid status code 'BadRequest'.` 

- **Cause**: Too many files in the folderPath of the custom activity. The total   size of resourceFiles can't be more than 32,768 characters.

- **Recommendation**: Remove unnecessary files. Or zip them and add an unzip command to extract them. For example, use  `powershell.exe -nologo -noprofile   -command "& { Add-Type -A 'System.IO.Compression.FileSystem';   [IO.Compression.ZipFile]::ExtractToDirectory($zipFile, $folder); }" ;  $folder\yourProgram.exe`


### Error code:  2505

- **Message**: `Cannot create Shared Access Signature unless Account Key credentials are used.`

- **Cause**: Custom activities support only storage accounts that use an access key.

- **Recommendation**: Refer to the error description.


### Error code:  2507

- **Message**: `The folder path does not exist or is empty: ....`

- **Cause**: No files are in the storage account at the specified path.

- **Recommendation**: The folder path must contain the executable files you want to run.


### Error code:  2508

- **Message**:  `There are duplicate files in the resource folder.`

- **Cause**: Multiple files of the same name are in different subfolders   of folderPath.

- **Recommendation**: Custom activities flatten folder structure under folderPath.  If you need to preserve the folder structure, zip the files and extract them in Azure Batch by using an unzip command. For   example, use `powershell.exe -nologo -noprofile   -command "& { Add-Type -A 'System.IO.Compression.FileSystem';   [IO.Compression.ZipFile]::ExtractToDirectory($zipFile, $folder); }" ;   $folder\yourProgram.exe`


### Error code:  2509

- **Message**: `Batch   url ... is invalid; it must be in Uri format.` 

- **Cause**: Batch URLs must be similar to `https://mybatchaccount.eastus.batch.azure.com`

- **Recommendation**: Refer to the error description.


### Error code:  2510

- **Message**: `An   error occurred while sending the request.`

- **Cause**: The batch URL is invalid. 

- **Recommendation**: Verify the batch URL.


## HDInsight

The following table applies to Spark, Hive, MapReduce, Pig, and Hadoop Streaming.


### Error code:  2300

- **Message**: `Hadoop job submission failed. Error: The remote name could not be resolved. <br/><br/>The cluster is not found.`

- **Cause**: The provided cluster URI is invalid. 

- **Recommendation**:  Make sure that the cluster hasn't been deleted and that the provided URI is correct. When you open the URI in a browser, you   should see the Ambari UI. If the cluster is in a virtual network, the URI should be   the private URI. To open it, use a VM that's part of the same virtual network. For more information, see [Directly connect to Apache Hadoop services](https://docs.microsoft.com/azure/hdinsight/hdinsight-extend-hadoop-virtual-network#directly-connect-to-apache-hadoop-services).

<br/>

- **Message**: `Hadoop job submission failed. Job: …, Cluster: …/. Error: A task was canceled.`

- **Cause**: The job submission timed out. 

- **Recommendation**: The problem could be either general HDInsight connectivity or network   connectivity. First confirm that the HDInsight Ambari UI is available from any   browser. Confirm that your credentials are still valid. If you're using self-hosted integrated runtime (IR), make sure to do this from the   VM or machine where the self-hosted IR is installed. Then   try submitting the job from Data Factory again. If it still fails, contact the Data Factory team   for support.


- **Message**: `Unauthorized: Ambari user name or password is incorrect  <br/><br/>Unauthorized: User admin is locked out in Ambari.   <br/><br/>403 - Forbidden: Access is denied.`

- **Cause**: The credentials for HDInsight are incorrect or expired.

- **Recommendation**: Correct the credentials and redeploy the linked service. First make sure the   credentials work on HDInsight by opening the cluster URI on any browser and   trying to sign in. If the credentials don't work, you can reset them from the Azure portal.

<br/>

- **Message**: `502 - Web server received an invalid response while acting as a gateway or proxy server. <br/>Bad gateway.`

- **Cause**: This error is from HDInsight.

- **Recommendation**: This error is from the HDInsight cluster. For more information, see [Ambari UI 502 error](https://hdinsight.github.io/ambari/ambari-ui-502-error.html), [502 errors connecting to Spark Thrift server](https://hdinsight.github.io/spark/spark-thriftserver-errors.html), [502 errors connecting to Spark Thrift server](https://hdinsight.github.io/spark/spark-thriftserver-errors.html), and [Troubleshooting bad gateway errors in Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-troubleshooting-502).

<br/>

- **Message**: `Hadoop job submission failed. Job: …, Cluster: ... Error:   {\"error\":\"Unable to service the submit job request as   templeton service is busy with too many submit job requests. Please wait for some time before retrying the operation. Please refer to the config   templeton.parallellism.job.submit to configure concurrent requests. <br/><br/>Hadoop job submission failed. Job: xx, Cluster: name.   Error: {\"error\":\"java.io.IOException:   org.apache.hadoop.yarn.exceptions.YarnException: Failed to submit   application_1561147195099_3730 to YARN :   org.apache.hadoop.security.AccessControlException: Queue root.joblauncher already has 500 applications, cannot accept submission of application:   application_1561147195099_3730\`

- **Cause**: Too many jobs are being submitted to HDInsight at the same time.

- **Recommendation**: Consider limiting the number of concurrent jobs  submitted to HDInsight. Refer to Data Factory activity concurrency if the jobs are   being submitted by the same activity. Change the triggers so the concurrent   pipeline runs are spread out over time. Refer to HDInsight documentation to adjust `templeton.parallellism.job.submit` as the error suggests.


### Error code:  2303

- **Message**: `Hadoop job failed with exit code '5'. See   'wasbs://adfjobs@xx.blob.core.windows.net/StreamingJobs/da4afc6d-7836-444e-bbd5-635fce315997/18_06_2019_05_36_05_050/stderr' for more details. <br/><br/>Hive execution failed with error code 'UserErrorHiveOdbcCommandExecutionFailure'.   See 'wasbs://adfjobs@xx.blob.core.windows.net/HiveQueryJobs/16439742-edd5-4efe-adf6-9b8ff5770beb/18_06_2019_07_37_50_477/Status/hive.out' for more details.`

- **Cause**: The job was submitted to HDInsight, and it failed on HDInsight.

- **Recommendation**: The job was submitted to HDInsight successfully. It failed on the cluster. Either open the job and the logs in the HDInsight Ambari UI, or open the file from storage as the error message suggests. The file shows the error details.


### Error code:  2310

- **Message**: `Hadoop job submission failed. Error: The remote name could not be resolved. <br/><br/>The cluster is not found.`

- **Cause**: The provided cluster URI is invalid. 

- **Recommendation**:  Make sure that the cluster hasn't been deleted and that the provided URI is correct. When you open the URI in a browser, you   should see the Ambari UI. If the cluster is in a virtual network, the URI should be   the private URI. To open it, use a VM that's part of the same virtual network. For more information, see [Directly connect to Apache Hadoop services](https://docs.microsoft.com/azure/hdinsight/hdinsight-extend-hadoop-virtual-network#directly-connect-to-apache-hadoop-services).

<br/>

- **Message**: `502 - Web server received an invalid response while acting as a gateway or proxy server. <br/>Bad gateway.`

- **Cause**: This error is from HDInsight.

- **Recommendation**: This error is from the HDInsight cluster. For more information, see [Ambari UI 502 error](https://hdinsight.github.io/ambari/ambari-ui-502-error.html), [502 errors connecting to Spark Thrift server](https://hdinsight.github.io/spark/spark-thriftserver-errors.html), [502 errors connecting to Spark Thrift server](https://hdinsight.github.io/spark/spark-thriftserver-errors.html), and [Troubleshooting bad gateway errors in Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-troubleshooting-502).

<br/>

- **Message**: `java.lang.NullPointerException`

- **Cause**: This error happens when the job is submitted to a Spark cluster. 

- **Recommendation**: This exception comes from HDInsight. It hides the actual issue. Contact the HDInsight team for support. Provide them with the cluster name and the activity run time range.


### Error code:  2347

- **Message**: `Hadoop job failed with exit code '5'. See 'wasbs://adfjobs@xx.blob.core.windows.net/StreamingJobs/da4afc6d-7836-444e-bbd5-635fce315997/18_06_2019_05_36_05_050/stderr' for more details. <br/><br/>Hive execution failed with error code 'UserErrorHiveOdbcCommandExecutionFailure'.   See 'wasbs://adfjobs@xx.blob.core.windows.net/HiveQueryJobs/16439742-edd5-4efe-adf6-9b8ff5770beb/18_06_2019_07_37_50_477/Status/hive.out' for more details.`

- **Cause**: The job was submitted to HDInsight, and it failed on HDInsight.

- **Recommendation**: The job was submitted to HDInsight successfully. It failed on the cluster. Either open the job and the logs in the HDInsight Ambari UI, or open the file from storage as the error message suggests. The file shows the error details.


### Error code:  2328

- **Message**: `Internal server error occurred while processing the request. Please retry the request or contact support. `

- **Cause**: This error happens in HDInsight on-demand.

- **Recommendation**: This error comes from the HDInsight service when the HDInsight provisioning fails. Contact the HDInsight team and provide the on-demand cluster name.



## Web Activity

### Error code:  2108

- **Message**:  `Invalid HttpMethod: '...'.`

- **Cause**: Web Activity doesn't support the HTTP method specified in the activity payload.

- **Recommendation**:  The supported HTTP methods are PUT, POST, GET, and DELETE.

<br/>

- **Message**: `Invalid Server Error 500.`

- **Cause**: Internal error on the endpoint.

- **Recommendation**:  Use Fiddler or Postman to check the functionality on the URL.

<br/>

- **Message**: `Unauthorized 401.`

- **Cause**: Missing valid authentication on the request.

- **Recommendation**:  The token might have expired. Provide a valid authentication method. Use Fiddler or Postman to check the functionality on the URL.

<br/>

- **Message**: `Forbidden 403.`

- **Cause**: Missing required permissions.

- **Recommendation**:  Check user permissions on the accessed resource. Use Fiddler or Postman to check the functionality on the URL.

<br/>

- **Message**: `Bad Request 400.`

- **Cause**: Invalid HTTP request.

- **Recommendation**:   Check the URL, verb, and body of the request. Use Fiddler or Postman to validate the request.

<br/>

- **Message**: `Not found 404.` 

- **Cause**: The resource wasn't found.   

- **Recommendation**:  Use Fiddler or Postman to validate the request.

<br/>

- **Message**: `Service unavailable.`

- **Cause**: The service is unavailable.

- **Recommendation**:  Use Fiddler or Postman to validate the request.

<br/>

- **Message**: `Unsupported Media Type.`

- **Cause**: The content type is mismatched with the Web Activity body.

- **Recommendation**:  Specify the content type that matches the payload format. Use Fiddler or Postman to validate the request.

<br/>

- **Message**: `The resource you are looking for has been removed, has had its name changed, or is temporarily unavailable.`

- **Cause**: The resource isn't available. 

- **Recommendation**:  Use Fiddler or Postman to check the endpoint.

<br/>

- **Message**: `The page you are looking for cannot be displayed because an invalid method (HTTP verb) is being used.`

- **Cause**: An incorrect Web Activity method was specified in the request.

- **Recommendation**:  Use Fiddler or Postman to check the endpoint.

<br/>

- **Message**: `invalid_payload`

- **Cause**: The Web Activity body is incorrect.

- **Recommendation**:  Use Fiddler or Postman to check the endpoint.

To use Fiddler to create an HTTP session of the monitored web application:

1. Download, install, and open [Fiddler](https://www.telerik.com/download/fiddler).

1. If your web application uses HTTPS, go to **Tools** > **Fiddler Options** > **HTTPS**. Select **Capture HTTPS CONNECTs** and **Decrypt HTTPS traffic**. 
   
   ![Fiddler options](media/data-factory-troubleshoot-guide/fiddler-options.png)

1. If your application uses SSL certificates, add the Fiddler certificate to your device. Go to **Tools** > **Fiddler Options** > **HTTPS** > **Actions** > **Export Root Certificate to Desktop**.

1. Turn off capturing by going to **File** > **Capture Traffic**. Or press **F12**.

1. Clear your browser's cache so that all cached items are removed and must be downloaded again.

1. Create a request: 

   a. Select the **Composer** tab.

   b. Set the HTTP method and URL.

   c. Add headers and a request body if you need to.

   d. Select **Execute**.

9. Turn on traffic capturing again, and complete the problematic transaction on your page.

10. Go to **File** > **Save** > **All Sessions**.

For more information, see [Getting started with Fiddler](https://docs.telerik.com/fiddler/Configure-Fiddler/Tasks/ConfigureFiddler).

## Next steps

For more troubleshooting help, try these resources:

*  [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
*  [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [MSDN forum](https://social.msdn.microsoft.com/Forums/home?sort=relevancedesc&brandIgnore=True&searchTerm=data+factory)
*  [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)



