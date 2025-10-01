---
title: Run MapReduce jobs with Apache Hadoop on Entra enabled HDInsight using PowerShell
description: Learn how to run MapReduce jobs with Apache Hadoop on Entra enabled HDInsight using PowerShell
ms.service: azure-hdinsight
ms.topic: how-to
author: apurbasroy
ms.author: apsinhar
ms.reviewer: nijelsf
ms.date: 03/19/2025
---

# Run MapReduce jobs with Apache Hadoop on Entra enabled HDInsight using PowerShell

This document provides an example of using Azure PowerShell to run a MapReduce job in a Hadoop on Entra enabled HDInsight cluster.

## Prerequisites

* An Entra enabled Apache Hadoop cluster on HDInsight. See [Create Apache Hadoop clusters using the Azure portal](../hdinsight-hadoop-create-linux-clusters-portal.md).
* The PowerShell [Az Module](/powershell/azure/) installed.

## Run a MapReduce job

Azure PowerShell provides *cmdlets* that allow you to remotely run MapReduce jobs on HDInsight. Internally, PowerShell makes REST calls to [WebHCat](https://cwiki.apache.org/confluence/display/Hive/WebHCat) (formerly called Templeton) running on the Entra enabled HDInsight cluster.

The following cmdlets used when running MapReduce jobs in a remote HDInsight cluster.

| Cmdlet | Description |
| --- | --- |
| Connect-AzAccount | Authenticates Azure PowerShell to your Azure subscription. |
| New-AzHDInsightMapReduceJobDefinition | Creates a new *job definition* by using the specified MapReduce information. |
| Start-AzHDInsightJob | Sends the job definition to HDInsight and starts the job. A *job* object is returned. |
| Wait-AzHDInsightJob | Uses the job object to check the status of the job. It waits until the job completes or the wait time is exceeded. |
| Get-AzHDInsightJobOutput | Used to retrieve the output of the job. |

## Setup (Secure Bearer Access Token)

Bearer Token is needed to send the cURL or any REST communication. You can follow the below mentioned step to get the token:

Execute an HTTP GET request to the OAuth 2.0 token endpoint with the following specifications:

### URL

```bash
https://login.microsoftonline.com/{Tenant_ID}/oauth2/v2.0/token
```

### Body

| Parameter | Description | Required |
| --- | --- | --- |
| grant_type | Must be set to "client_credentials" | Yes |
| client_ID | Application (client) ID from Entra App registration | Yes |
| client_secret | Generated client secret or certificate | Yes |
| scope | Resource URL with `.default` suffix | Yes |

### cURL Request

```bash
curl --request GET \
  --url https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token \
  --header 'Content-Type: multipart/form-data' \
  --form grant_type=client_credentials \
  --form client_id={app_id} \
  --form client_secret={client_secret} \
  --form scope=https://{clustername}.clusteraccess.azurehdinsight.net/.default \
```

### Response

A successful request returns a JSON object containing:

- token_type: Always "Bearer"
- expires_in: Token validity duration in seconds
- ext_expires_in: Extended expiration time in seconds
- access_token: The Bearer token for authentication

```powershell

{
	"token_type": "Bearer",
	"expires_in": 3599,
	"ext_expires_in": 3599,
	"access_token": "eyJ0eXAiOiJKV1iLCJub25jZSI6IkhaZ3lqQ2MxSkxzaXRSbmxzT1FTSHV0bEtBeXhhMU1JTzdyWmluLWF6LUEiLCJhbGciOiJSUzI1NiIsIng1dCI6ImltaTBZMnowZFlLeEJ0dEFxS19UdDVoWUJUayIsImtpZCI6ImltaTBZMnowZFlLeEJ0dEFxS19UdDVoWUJUayJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8wY2QzZGY5OS1lMDJmLTRmZDgtYTdkOC0zYjE5ZWVhZGFiYTUvIiwiaWF0IjoxNzQxMjgzMzUzLCJuYmYiOjE3NDEyODMzNTMsImV4cCI6MTc0MTI4NzI1MywiYWlvIjoiazJSZ1lIRDF1U1R4NGx2bjdmMTdGcXlkZUdwWlBnQT0iLCJhcHBfZGlzcGxheW5hbWUiOiJBenVyZSBIREkgTVNGVCBDbGllbnQiLCJhcHBpZCI6IjAzZDNiNTg5LWFjM2MtNDE4NC1iY2EyLTQ3ZWRiN2Q2ZmVjNiIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzBjZDNkZjk5LWUwMmYtNGZkOC1hN2Q4LTNiMTllZWFkYWJhNS8iLCJpZHR5cCI6ImFwcCIsIm9pZCI6ImQ0NDA3YjQ4LWZmZTctNDJjNS04ZDIwLTdiMTTgwNWE4NCIsInJoIjoiMS5BUnNBbWRfVERDX2cyRS1uMkRzWjdxMnJwUU1BQUFBQUFBQUF3QUFBQUFBQUFBRFlBQUFiQUEuIiwic3ViIjoiZDQ0MDdiNDgtZmZlNy00MmM1LThkMjAtN2IxMzU5ODA1YTg0IiwidGVuYW50X3JlZ2lvbl9zY29wZSI6Ik5BIiwidGlkIjoiMGNkM2RmOTktZTAyZi00ZmQ4LWE3ZDgtM2IxOWVlYWRhYmE1IiwidXRpIjoiLVA1T3JPWGpJVWk0VE12dElTYWRBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiMDk5N2ExZDAtMGQxZC00YWNiLWI0MDgtZDVjYTczMTIxZTkwIl0sInhtc19pZHJlbCI6IjI4IDciLCJ4bXNfdGNkdCI6MTQ4NjM3NDQ2MH0.a9z3ZYyMTRQCoY7dzPYE55DmpNAxqo4a4rrt80A-RpK0NDDAftNkc2hafbLl6gdwEzqRyKc1HExUggFUpKxaLUXc62-u-9emxC12EsNlQYd-ZzG_GRDNoTYrro4RDRL-_gDo2lgBNOi5ZZ4a9UI_pYVvV1b0SBRpgd5bmIV4kI2tDfAVZ1-HMpGscuVkQIy45Tqt4c3gXPoMEZ3UYikbCpErbTNfUFqngE3sARXRV-rB1OMu6ZbN32ijjL-rD8593-IfSpmVDUfE5CMGc-7FuWGOYyUUJmp5AQ1yFpJzqaDBEdPT8kKync1o7eplWXCsPWOnVvAKNf7BuWCRRedBWg"
}

```

The following steps demonstrate how to use these cmdlets to run a job in your Entra enabled HDInsight cluster.

1. Using an editor, save the following code as **mapreducejob.ps1**.
    
    PowerShell
    
    ```powershell
    # Login to your Azure subscription
    $context = Get-AzContext
    if ($context -eq $null) 
    {
        Connect-AzAccount
    }
    $context
    
    # Get cluster info
    $clusterName = Read-Host -Prompt "Enter the HDInsight cluster name"
    $bearerToken = Read-Host -Prompt "Enter the bearer token"
    
    # Get the cluster info so we can get the resource group, storage, etc.
    $clusterInfo = Get-AzHDInsightCluster -ClusterName $clusterName
    $resourceGroup = $clusterInfo.ResourceGroup
    $storageAccountName=$clusterInfo.StorageAccount.split('.')
    $container=$clusterInfo.StorageContainer
    # NOTE: This assumes that the storage account is in the same resource
    #       group as the cluster. If it is not, change the
    #       --ResourceGroupName parameter to the group that contains storage.
    $storageAccountKey=(Get-AzStorageAccountKey -Name $storageAccountName[0] -ResourceGroupName $resourceGroup).Value
    
    # Create a storage context
    $context = New-AzStorageContext -StorageAccountName $storageAccountName[0] -StorageAccountKey $storageAccountKey
    
    # Define the MapReduce job
    # -JarFile = the JAR containing the MapReduce application
    # -ClassName = the class of the application
    # -Arguments = The input file, and the output directory
    $wordCountJobDefinition = @{
        "JarFile" = "/example/jars/hadoop-mapreduce-examples.jar"
        "ClassName" = "wordcount"
        "Arguments" = "/example/data/gutenberg/davinci.txt", "/example/data/WordCountOutput"
    }
    
    # Submit the job to the cluster
    Write-Host "Start the MapReduce job..." -ForegroundColor Green
    $headers = @{
        "Authorization" = "Bearer $bearerToken"
    }
    $wordCountJob = Invoke-RestMethod -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/jobs" -Method Post -Headers $headers -Body ($wordCountJobDefinition | ConvertTo-Json)
    
    # Wait for the job to complete
    Write-Host "Wait for the job to complete..." -ForegroundColor Green
    $jobId = $wordCountJob.id
    while ($true) {
        $jobStatus = Invoke-RestMethod -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/jobs/$jobId" -Method Get -Headers $headers
        if ($jobStatus.status -eq "SUCCEEDED" -or $jobStatus.status -eq "FAILED") {
            break
        }
        Start-Sleep -Seconds 10
    }
    
    # Download the output
    Get-AzStorageBlobContent -Blob 'example/data/WordCountOutput/part-r-00000' -Container $container -Destination output.txt -Context $context
    
    # Print the output of the job
    Invoke-RestMethod -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/jobs/$jobId/stdout" -Method Get -Headers $headers
    
    ```
    
1. Open a new **Azure PowerShell** command prompt. Change directories to the location of the **mapreducejob.ps1** file, then use the following command to run the script:
    
    Azure PowerShell
    
    ```powershell
    .\mapreducejob.ps1
    
    ```
    
    When you run the script, you're prompted for the name of the Entra enabled HDInsight cluster and the Access Token. You may also be prompted to authenticate to your Azure subscription.
    
1. When the job completes, you receive output similar to the following text:
    
    Output
    
    ```powershell
    Cluster         : CLUSTERNAME
    ExitCode        : 0
    Name            : wordcount
    PercentComplete : map 100% reduce 100%
    Query           :
    State           : Completed
    StatusDirectory : f1ed2028-afe8-402f-a24b-13cc17858097
    SubmissionTime  : 12/5/2014 8:34:09 PM
    JobID           : job_1415949758166_0071
    
    ```
    
   This output indicates that the job completed successfully.

>[!Note}
>If the **ExitCode** is a value other than 0, see [**Troubleshooting**](../hadoop/apache-hadoop-use-mapreduce-powershell.md#troubleshooting).
>This example also stores the downloaded files to an **output.txt** file in the directory that you run the script from.
    

## View output

To see the words and counts produced by the job, open the **output.txt** file in a text editor.

> [!NOTE]
> The output files of a MapReduce job are immutable. So, if you rerun this sample, you need to change the name of the output file. 

## Troubleshooting

If no information is returned when the job completes, view errors for the job. To view error information for this job, add the following command to the end of the **mapreducejob.ps1** file. Then save the file and rerun the script.

PowerShell

```powershell
# Print the output of the WordCount job.
Write-Host "Display the standard output ..." -ForegroundColor Green

# Define the headers with the bearer token
$headers = @{
    "Authorization" = "Bearer $bearerToken"
}

# Get the job output
$jobOutput = Invoke-RestMethod -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/jobs/$wordCountJob.JobId/stdout" -Method Get -Headers $headers

# Display the output
Write-Host $jobOutput
```

This cmdlet returns the information that was written to STDERR as the job runs.


