---
title: Troubleshoot Azure Data Factory | Microsoft Docs
description: Learn how to troubleshoot external control activities in Azure Data Factory. 
services: data-factory
author: nabhishek
ms.service: data-factory
ms.topic: troubleshooting
ms.date: 6/26/2019
ms.author: abnarain
ms.reviewer: craigg
---

# Troubleshoot Azure Data Factory

This article explores common troubleshooting methods for external control activities in Azure Data Factory.

## Azure Databricks

| Error code | Error message                                          | Description                             | Recommendation                             |
| -------------- | ----------------------------------------------------- | --------------------------------------------------------------| :----------------------------------------------------------- |
| 3200           | Error 403.                                                    | The Databricks access token has expired.                         | By default, the Databricks access token is valid for 90 days.  Create a new token and update the linked service. |
| 3201           | Missing   required field: settings.task.notebook_task.notebook_path | Bad authoring: Notebook path not specified correctly. | Specify the notebook path in the Databricks activity. |
| 3201           | Cluster   ... does not exist.                                 | Authoring   error: Databricks cluster does not exist or has been deleted. | Verify that the Databricks cluster exists. |
| 3201           | Invalid   Python file URI.... Please visit Databricks user guide for supported URI   schemes. | Bad authoring.                                                | Specify either absolute paths for workspace-addressing schemes, or `dbfs:/folder/subfolder/foo.py` for files stored in Databricks File System. |
| 3201           | {0}   LinkedService should have domain and accessToken as required properties. | Bad authoring.                                                | Verify the [linked service definition](compute-linked-services.md#azure-databricks-linked-service). |
| 3201           | {0}   LinkedService should specify either existing cluster ID or new cluster   information for creation. | Bad authoring.                                                | Verify the [linked service definition](compute-linked-services.md#azure-databricks-linked-service). |
| 3201           | Node   type Standard_D16S_v3 is not supported. Supported node types:   Standard_DS3_v2, Standard_DS4_v2, Standard_DS5_v2, Standard_D8s_v3,   Standard_D16s_v3, Standard_D32s_v3, Standard_D64s_v3, Standard_D3_v2,   Standard_D8_v3, Standard_D16_v3, Standard_D32_v3, Standard_D64_v3,   Standard_D12_v2, Standard_D13_v2, Standard_D14_v2, Standard_D15_v2,   Standard_DS12_v2, Standard_DS13_v2, Standard_DS14_v2, Standard_DS15_v2,   Standard_E8s_v3, Standard_E16s_v3, Standard_E32s_v3, Standard_E64s_v3,   Standard_L4s, Standard_L8s, Standard_L16s, Standard_L32s, Standard_F4s,   Standard_F8s, Standard_F16s, Standard_H16, Standard_F4s_v2, Standard_F8s_v2,   Standard_F16s_v2, Standard_F32s_v2, Standard_F64s_v2, Standard_F72s_v2,   Standard_NC12, Standard_NC24, Standard_NC6s_v3, Standard_NC12s_v3,   Standard_NC24s_v3, Standard_L8s_v2, Standard_L16s_v2, Standard_L32s_v2,   Standard_L64s_v2, Standard_L80s_v2. | Bad authoring.                                                | Refer to the error message.                                          |
| 3201           | Invalid notebook_path: ... Only absolute paths are currently supported. Paths must   begin with '/'. | Bad authoring.                                                | Refer to error message.                                          |
| 3202           | There were already 1000 jobs created in past 3600 seconds, exceeding rate limit:   1000 job creations per 3600 seconds. | Too many Databricks runs in an hour.                         | Check all pipelines that use this Databricks workspace for their job   creation rate.  If pipelines launched   too many Databricks runs in aggregate, migrate some pipelines to a new   workspace. |
| 3202           | Could not parse request object: Expected 'key' and 'value' to be set for JSON map field base_parameters, got 'key: "..."' instead. | Authoring error: No value provided for the parameter.         | Inspect the pipeline JSON and ensure all parameters in the baseParameters notebook specify a nonempty value. |
| 3202           | User: `SimpleUserContext{userId=..., name=user@company.com, orgId=...}` is not   authorized to access cluster. | The user who generated the access token isn't allowed to access the   Databricks cluster specified in the linked service. | Ensure the user has the required permissions in the workspace.   |
| 3203           | The cluster is in Terminated state, not available to receive jobs. Please fix the cluster or retry later. | The cluster was terminated.    For interactive clusters, this might be a race condition. | The best way to avoid this error is to use job clusters.             |
| 3204           | Job execution failed.  | Error messages indicate various issues, such as an unexpected cluster state or a specific activity. Most often no error   message appears at all.                                                          | N/A                                                          |



## Azure Data Lake Analytics

The following table applies to U-SQL.

| Error code         | Error message                                                | Description                                          | Recommendation                            |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 2709                 | The access token is from the wrong tenant.                    | Incorrect Azure Active Directory (Azure AD) tenant.                                         | The service principal used to access Azure Data Lake Analytics belongs to another Azure AD tenant. Create a new service principal in the same tenant as the Data Lake Analytics account. |
| 2711,   2705,   2704 | Forbidden. ACL verification failed. Either the resource does not exist or the user is not authorized to perform the requested operation.<br/><br/>User is   not able to access Data Lake Store.  <br/><br/>User is  not authorized to use Data Lake Analytics. | The service principal or certificate doesn't have access to the file in storage. | Make sure the service principal or certificate the user provides for Data Lake Analytics jobs has access to the Data Lake Analytics account and the default Data Lake Storage instance from the root folder. |
| 2711                 | Cannot find the 'Azure Data Lake Store' file or folder.       | The   path to the U-SQL file is wrong, or the linked service credentials don't have access. | Verify the path and credentials provided in the linked service. |
| 2707                 | Cannot resolve the account of   AzureDataLakeAnalytics. Please check 'AccountName' and   'DataLakeAnalyticsUri'. | The Data Lake Analytics account in the linked service is wrong.                  | Verify that the right account is provided.             |
| 2703                 | Error Id: E_CQO_SYSTEM_INTERNAL_ERROR (or any error that starts with "Error   Id:"). | The error is from Data Lake Analytics.                                    | An error like the example means the job was submitted to Data Lake Analytics, and the   script there failed. Investigate in Data Lake Analytics. In the portal, go to the Data Lake Analytics account, and look for the job by using the Data Factory activity run ID (not the pipeline run ID). The job there provides more   information about the error and will help you troubleshoot. If the resolution isn't clear, contact the Data Lake Analytics support team and provide the job URL, which   includes your account name and the job ID. |
| 2709                 | We cannot accept your job at this moment. The maximum number of queued jobs for   your account is 200. | This error is caused by throttling on Data Lake Analytics.                                           | Reduce the number of submitted jobs to Data Lake Analytics by changing Data Factory triggers and concurrency settings on activities. Or increase the limits on Data Lake Analytics. |
| 2709                 | This job was rejected because it requires 24 AUs. This account's administrator-defined policy prevents a job from using more than 5 AUs. | This error is caused by throttling on Data Lake Analytics.                                           | Reduce the number of submitted jobs to Data Lake Analytics by changing Data Factory triggers and concurrency settings on activities. Or increase the limits on Data Lake Analytics. |



## Azure functions

| Error code | Error message                           | Description                                                  | Recommendation                           |
| ------------ | --------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 3600         | Response content is not a valid JObject. | The Azure function that was called didn't return a JSON payload in the response. Azure function activity in Data Factory supports only JSON response content. | Update the Azure function to return a valid JSON payload. For example, a C# function can return `(ActionResult)new<OkObjectResult("{`\"Id\":\"123\"`}");`. |
| 3600         | Invalid HttpMethod: '...'.               | The HTTP method specified in the   activity payload is not supported by the Azure function activity. | Use a supported HTTP method, such as PUT, POST, GET, DELETE, OPTIONS, HEAD, or TRACE. |



## Custom

The following table applies to Azure Batch.

| Error code | Error message                                                | Description                                                  | Recommendation                          |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 2500         | Hit   unexpected exception and execution failed.             | Can't launch command, or the program returned an error code. | Ensure that the executable file exists. If the program started, make sure *stdout.txt* and *stderr.txt* were uploaded to the storage account. It's a good practice to emit copious logs in your code for debugging. |
| 2501         | Cannot   access user batch account; please check batch account settings. | Incorrect Batch access key or pool name.            | Verify the pool name and the Batch access key in the linked   service. |
| 2502         | Cannot   access user storage account; please check storage account settings. | Incorrect storage account name or access key.       | Verify the storage account name and the access key in the linked service. |
| 2504         | Operation   returned an invalid status code 'BadRequest'.     | Too many files in the folderPath of the custom activity. The total   size of resourceFiles can't be more than 32,768 characters. | Remove unnecessary files. Or zip them and add an unzip command to extract them. For example, use  `powershell.exe -nologo -noprofile   -command "& { Add-Type -A 'System.IO.Compression.FileSystem';   [IO.Compression.ZipFile]::ExtractToDirectory($zipFile, $folder); }" ;  $folder\yourProgram.exe` |
| 2505         | Cannot   create Shared Access Signature unless Account Key credentials are used. | Custom activities support only storage accounts that use an access   key. | Refer to the error description.                                            |
| 2507         | The   folder path does not exist or is empty: ....            | No files are in the storage account at the specified path.       | The folder path must contain the executable files you want to run. |
| 2508         | There are   duplicate files in the resource folder.               | Multiple files of the same name are in different subfolders   of folderPath. | Custom activities flatten folder structure under folderPath.  If you need to preserve the folder structure, zip the files and extract them in Azure Batch by using an unzip command. For   example, use `powershell.exe -nologo -noprofile   -command "& { Add-Type -A 'System.IO.Compression.FileSystem';   [IO.Compression.ZipFile]::ExtractToDirectory($zipFile, $folder); }" ;   $folder\yourProgram.exe` |
| 2509         | Batch   url ... is invalid; it must be in Uri format.         | Batch URLs must be similar to `https://mybatchaccount.eastus.batch.azure.com` | Refer to the error description.                                            |
| 2510         | An   error occurred while sending the request.               | The batch URL is invalid.                                         | Verify the batch URL.                                            |

## HDInsight

The following table applies to Spark, Hive, MapReduce, Pig, and Hadoop Streaming.

| Error   code | Error message                                                | Description                                                  | Recommendation                           |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 2300,   2310 | Hadoop job submission failed. Error: The remote name could not be resolved. <br/><br/>The cluster is not found. | The provided cluster URI is invalid.                              | Make sure that the cluster hasn't been deleted and that the provided URI is correct. When you open the URI in a browser, you   should see the Ambari UI. If the cluster is in a virtual network, the URI should be   the private URI. To open it, use a VM that's part of the same virtual network. For more information, see [Directly connect to Apache Hadoop services](https://docs.microsoft.com/azure/hdinsight/hdinsight-extend-hadoop-virtual-network#directly-connect-to-apache-hadoop-services). |
| 2300         | Hadoop   job submission failed. Job: …, Cluster: …/. Error: A task was canceled. | The job submission timed out.                         | The problem could be either general HDInsight connectivity or network   connectivity. First confirm that the HDInsight Ambari UI is available from any   browser. Confirm that your credentials are still valid. If you're using self-hosted integrated runtime (IR), make sure to do this from the   VM or machine where the self-hosted IR is installed. Then   try submitting the job from Data Factory again. If it still fails, contact the Data Factory team   for support. |
| 2300         | Unauthorized:   Ambari user name or password is incorrect  <br/><br/>Unauthorized:   User admin is locked out in Ambari.   <br/><br/>403 - Forbidden: Access is denied. | The credentials for HDInsight are incorrect or expired. | Correct the credentials and redeploy the linked service. First make sure the   credentials work on HDInsight by opening the cluster URI on any browser and   trying to sign in. If the credentials don't work, you can reset them from the Azure portal. |
| 2300,   2310 | 502 - Web server received an invalid response while acting as a gateway or proxy server.       <br/>Bad gateway. | This error is from HDInsight.                               | This error is from the HDInsight cluster. For more information, see [Ambari UI 502 error](https://hdinsight.github.io/ambari/ambari-ui-502-error.html), [502 errors connecting to Spark Thrift server](https://hdinsight.github.io/spark/spark-thriftserver-errors.html), [502 errors connecting to Spark Thrift server](https://hdinsight.github.io/spark/spark-thriftserver-errors.html), and [Troubleshooting bad gateway errors in Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-troubleshooting-502). |
| 2300         | Hadoop job submission failed. Job: …, Cluster: ... Error:   {\"error\":\"Unable to service the submit job request as   templeton service is busy with too many submit job requests. Please wait for   some time before retrying the operation. Please refer to the config   templeton.parallellism.job.submit to configure concurrent requests.  <br/><br/>Hadoop   job submission failed. Job: 161da5d4-6fa8-4ef4-a240-6b6428c5ae2f, Cluster: `https://abc-analytics-prod-hdi-hd-trax-prod01.azurehdinsight.net/`.   Error: {\"error\":\"java.io.IOException:   org.apache.hadoop.yarn.exceptions.YarnException: Failed to submit   application_1561147195099_3730 to YARN :   org.apache.hadoop.security.AccessControlException: Queue root.joblauncher   already has 500 applications, cannot accept submission of application:   application_1561147195099_3730\ | Too many jobs are being submitted to HDInsight at the same time. | Consider limiting the number of concurrent jobs  submitted to HDInsight. Refer to Data Factory activity concurrency if the jobs are   being submitted by the same activity. Change the triggers so the concurrent   pipeline runs are spread out over time. Refer to HDInsight documentation to adjust `templeton.parallellism.job.submit` as the error suggests. |
| 2303,   2347 | Hadoop job failed with exit code '5'. See   'wasbs://adfjobs@adftrialrun.blob.core.windows.net/StreamingJobs/da4afc6d-7836-444e-bbd5-635fce315997/18_06_2019_05_36_05_050/stderr'   for more details.  <br/><br/>Hive execution failed with error code 'UserErrorHiveOdbcCommandExecutionFailure'.   See 'wasbs://adfjobs@eclsupplychainblobd.blob.core.windows.net/HiveQueryJobs/16439742-edd5-4efe-adf6-9b8ff5770beb/18_06_2019_07_37_50_477/Status/hive.out'   for more details. | The job was submitted to HDInsight, and it failed on HDInsight. | The job was submitted to HDInsight successfully. It failed on the cluster. Either open the job and the logs in the HDInsight Ambari UI, or open the file from storage as the error message suggests. The file shows the error details. |
| 2328         | Internal server error occurred while processing the request. Please retry the request   or contact support. | This error happens in HDInsight on-demand.                              | This error comes from the HDInsight service when the HDInsight provisioning fails. Contact the HDInsight team and provide the on-demand cluster name. |
| 2310         | java.lang.NullPointerException                               | This error happens when the job is submitted to a Spark cluster.      | This exception comes from HDInsight. It hides the actual issue. Contact the HDInsight team for support. Provide them with the cluster name and the activity run time range. |
|              | All other errors                                             |                                                              | Refer to [Troubleshoot by using HDInsight](../hdinsight/hdinsight-troubleshoot-guide.md) and [HDInsight FAQ](https://hdinsight.github.io/). |



## Web Activity

| Error code | Error message                                                | Description                                                  | Recommendation                          |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 2108         | Invalid HttpMethod: '...'.                                    | Web Activity doesn't support the HTTP method specified in the activity payload. | The supported HTTP methods are PUT, POST, GET, and DELETE. |
| 2108         | Invalid Server Error 500.                                     | Internal error on the endpoint.                               | Use Fiddler or Postman to check the functionality on the URL. |
| 2108         | Unauthorized 401.                                             | Missing valid authentication on the request.                      | The token might have expired. Provide a valid authentication method. Use Fiddler or Postman to check the functionality on the URL. |
| 2108         | Forbidden 403.                                                | Missing required permissions.                                 | Check user permissions on the accessed resource. Use Fiddler or Postman to check the functionality on the URL.  |
| 2108         | Bad Request 400.                                              | Invalid HTTP request.                                         | Check the URL, verb, and body of the request. Use Fiddler or Postman to validate the request.  |
| 2108         | Not found 404.                                                | The resource wasn't found.                                       | Use Fiddler or Postman to validate the request.  |
| 2108         | Service unavailable.                                          | The service is unavailable.                                       | Use Fiddler or Postman to validate the request.  |
| 2108         | Unsupported Media Type.                                       | The content type is mismatched with the Web Activity body.           | Specify the content type that matches the payload format. Use Fiddler or Postman to validate the request. |
| 2108         | The resource you are looking for has been removed, has had its name changed, or is temporarily unavailable. | The resource isn't available.                                | Use Fiddler or Postman to check the endpoint. |
| 2108         | The page you are looking for cannot be displayed because an invalid method (HTTP verb) is being used. | An incorrect Web Activity method was specified in the request.   | Use Fiddler or Postman to check the endpoint. |
| 2108         | invalid_payload                                              | The Web Activity body is incorrect.                       | Use Fiddler or Postman to check the endpoint. |

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



