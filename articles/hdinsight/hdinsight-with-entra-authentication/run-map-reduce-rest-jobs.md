---
title: Run MapReduce jobs on Entra enabled HDInsight cluster using REST API
description: Learn how to run MapReduce jobs on Entra enabled HDInsight cluster using REST API
ms.service: azure-hdinsight
ms.topic: how-to
author: apurbasroy
ms.author: apsinhar
ms.reviewer: nijelsf
ms.date: 08/21/2025
---

# Run MapReduce jobs with Apache Hadoop on Entra ID-enabled HDInsight using the REST API

Apache Hadoop MapReduce provides a powerful programming model for processing and analyzing large datasets in a distributed environment. In Azure HDInsight, you can submit and manage MapReduce jobs through the REST API, allowing you to integrate Hadoop workloads into applications, scripts, and automation pipelines.

When using Microsoft Entra ID enabled HDInsight clusters, authentication and access control are handled securely through organizational identities. This measure ensures that only authorized users and applications can submit MapReduce jobs, helping you meet enterprise security and compliance requirements.

This guide walks you through how to connect to an Entra-enabled HDInsight cluster, authenticate via REST, and submit MapReduce jobs programmatically.


## Prerequisites

- An Apache Hadoop cluster on Entra enabled HDInsight. See [Create Apache Hadoop clusters using the Azure portal](../hdinsight-hadoop-create-linux-clusters-portal.md).
Either:
- Windows PowerShell or,
- [Curl](https://curl.haxx.se/) with [jq](https://stedolan.github.io/jq/) [For installing jq, See [Download jq](https://jqlang.org/download/) ]


> [!NOTE]  
>When you use Curl or any other REST communication with WebHCat, you must authenticate the requests by providing the Access Token generated for the cluster. You must use the cluster name as part of the URI that is used to send the requests to the server. The REST API is secured by using OAuth 2.0. You should always make requests by using HTTPS to ensure that your credentials are securely sent to the server.


## Setup (Secure Bearer Access Token)
Bearer Token is needed to send the cURL or any REST communication. You can follow the mentioned step to get the token:

Execute an HTTP GET request to the OAuth 2.0 token endpoint with the following specifications:

## URL
```json
  https://login.microsoftonline.com/{Tenant_ID}/oauth2/v2.0/token
```

## Body

| Parameter | Description | Required |
| --- | --- | --- |
| grant_type    | Must be set to "client_credentials"                 | Yes |
| client_id     | Application (client) ID from Entra App registration | Yes |
| client_secret | Generated client secret or certificate              | Yes |
| scope         | Resource URL with default suffix                   | Yes |


## cURL Request

```bash
curl --request GET \
  --url https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token \
  --header 'Content-Type: multipart/form-data' \
  --form grant_type=client_credentials \
  --form client_id={app_id} \
  --form client_secret={client_secret} \
  --form scope=https://{clustername}.clusteraccess.azurehdinsight.net/.default \
```

## Response
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

After securing the Access Token needed for each action, let’s jump right into the commands.

### Curl

1. For ease of use, set the variables in the script. This example is based on a Windows environment. Revise as needed for your environment.
    
   
   ```azurecli
     set TOKEN= <access_token>
   ```
1. From a command line, use the following command to verify that you can connect to your HDInsight cluster:
        
    ```bash
      curl -H "Authorization: Bearer $TOKEN" -G https://$CLUSTERNAME.azurehdinsight.net/templeton/v1/status
    ```

    The parameters used in this command are as follows:

    - **u**: Indicates the user name and password used to authenticate the request
    - **G**: Indicates that this operation is a GET request

    The beginning of the URI, `https://CLUSTERNAME.azurehdinsight.net/templeton/v1`, is the same for all requests.

    You receive a response similar to the following JSON:

    ```json
      {"version":"v1","status":"ok"}
    
    ```
1. To submit a MapReduce job, use the following command. Modify the path to jq as needed.
   
    
      ```cmd
      curl -H "Authorization: Bearer $TOKEN" -d user.name=admin ^
      -d jar=/example/jars/hadoop-mapreduce-examples.jar ^
      -d class=wordcount -d arg=/example/data/gutenberg/davinci.txt -d arg=/example/data/output ^
      https://$CLUSTERNAME.azurehdinsight.net/templeton/v1/mapreduce/jar | ^
      jq -r .id
      
      ```

      The end of the URI (/mapreduce/jar) tells WebHCat that this request starts a MapReduce job from a class in a jar file. The parameters used in this command are as follows:


      - **d**: 'G' isn't used, so the request defaults to the POST method. 'd' specifies the data values that are sent with the request.

      - **user.name**: The user who is running the command

      - **jar**: The location of the jar file that contains class to be ran
    
      - **class**: The class that contains the MapReduce logic

      - **arg**: The arguments to be passed to the MapReduce job. In this case, the input text file and the directory that are used for the output

      This command should return a job ID that can be used to check the status of the job: `job_1415651640909_0026`.

    
1. To check the status of the job, use the following command. Replace the value for `JOBID` with the **actual** value returned in the previous step. Revise location of **jq** as needed.
    
    ```cmd
      set JOBID=job_1415651640909_0026

      curl -G -H "Authorization: Bearer $TOKEN" -d user.name=admin https://$CLUSTERNAME.azurehdinsight.net/templeton/v1/jobs/$JOBID | ^
      jq .status.state

    ```
   ### PowerShell

1. For ease of use, set the variables in the script. Replace `CLUSTERNAME` with your actual cluster name. Execute the command and enter the cluster login password when prompted.
    
   ```powershell
   
          $clusterName="CLUSTERNAME"

          # Define the bearer token
          $bearerToken = <access_token>

          # Define the API endpoint
          $apiEndpoint = "https://$clusterName.azurehdinsight.net/templeton/v1/status"
    ```
1. Use the following command to verify that you can connect to your HDInsight cluster:
    

   ```powershell
   
          # Make the API request with the bearer token
          $response = Invoke-WebRequest -Uri $apiEndpoint -Headers @{Authorization = "Bearer $bearerToken"} -UseBasicParsing

          # Output the response content
          $response.Content
    ```

    You receive a response similar to the following JSON:

    ```json
   	{"version":"v1","status":"ok"}
   
    ```
1. To submit a MapReduce job, use the following command:

    ```powershell
   
            # Define the request parameters
            $reqParams = @{
            "user.name" = "admin"
            jar = "/example/jars/hadoop-mapreduce-examples.jar"
            class = "wordcount"
            arg = @(
            "/example/data/gutenberg/davinci.txt"
            "/example/data/output"
            )
            }

            # Make the API request with the bearer token
            $response = Invoke-WebRequest -Uri $apiEndpoint -Headers @{Authorization = "Bearer $bearerToken"} -Body                      $reqParams -Method POST -UseBasicParsing

            # Output the raw response content
            $jobID = (ConvertFrom-Json $resp.Content).id
            $jobID
	  ```



   The end of the URI(/mapreduce/jar) tells WebHCat that this request starts a MapReduce job from a class in a jar file. The  parameters used in this command are as follows:

   This command should return a job ID that can be used to check the status of the job: `job_1415651640909_0026`.

1. To check the status of the job, use the following command:
    

  ```powershell
            $reqParams=@{"user.name"="admin"}
            # Make the API request with the bearer token
            $response = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/templeton/v1/jobs/$jobID" -Headers @{Authorization = "Bearer $bearerToken"} -Body $reqParams -UseBasicParsing

            # ConvertFrom-JSON can't handle duplicate names with different case
            # So change one to prevent the error
            $fixDup = $response.Content.Replace("jobID", "job_ID")
            (ConvertFrom-Json $fixDup).status.state

  ```

         
## Both methods


 - If the job is complete, the state returned is **SUCCEEDED**.
        
 - When the job state changes to `SUCCEEDED`, you can retrieve the results of the job from Azure Blob storage. The `statusdir` parameter that is passed with the query contains the location of the output file. In this example, the location is `/example/curl`. This address stores the output of the job in the clusters default storage at `/example/curl`.

    You can list and download these files by using the [Azure CLI](../../storage/blobs/storage-quickstart-blobs-cli.md). For more information on using the Azure CLI to work with Azure Blob storage, see [Quickstart: Create, download, and list blobs with Azure CLI](../../storage/blobs/storage-quickstart-blobs-cli.md).
