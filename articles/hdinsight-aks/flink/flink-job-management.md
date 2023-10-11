---
title: Flink job management in HDInsight on AKS
description: HDInsight on AKS provides a feature to manage and submit Apache Flink jobs directly through the Azure portal
ms.service: hdinsight-aks
ms.topic: tutorial
ms.date: 09/07/2023
---

# Flink job management

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

HDInsight on AKS provides a feature to manage and submit Apache Flink jobs directly through the Azure portal (user-friendly interface) and ARM Rest APIs. 

This feature empowers users to efficiently control and monitor their Flink jobs without requiring deep cluster-level knowledge.

## Benefits

- **Simplified job management**: With the native integration of Apache Flink in the Azure portal, users no longer require extensive knowledge of Flink clusters to submit, manage, and monitor jobs.

- **User-Friendly REST API**: HDInsight on AKS provides user friendly ARM Rest APIs to submit and manage Flink jobs. Users can submit Flink jobs from any Azure service using these Rest APIs.

- **Effortless job updates and state management**: The native Azure portal integration provides a hassle-free experience for updating jobs and restoring them to their last saved state (savepoint). This functionality ensures continuity and data integrity throughout the job lifecycle.

- **Automating Flink job using Azure pipeline**: Using HDInsight on AKS, Flink users have access to user-friendly ARM Rest API, you can seamlessly integrate Flink job operations into your Azure Pipeline. Whether you're launching new jobs, updating running jobs, or performing various job operations, this streamlined approach eliminates manual steps. It empowers you to manage your Flink cluster efficiently.

## Prerequisites

There are some prerequisites before submitting and managing jobs from portal or Rest APIs.

- Create a directory in the primary storage account of the cluster to upload the job jar.

- If the user wants to take savepoints, then create a directory in the storage account for job savepoints.

    :::image type="image" source="./media/flink-job-management/create-directory.png" alt-text="Screenshot shows directory structure." border="true" lightbox="./media/flink-job-management/create-directory.png":::


## Key features and operations

- **New job submission**: Users can effortlessly submit a new Flink, eliminating the need for complex configurations or external tools.

- **Stop and start jobs with savepoints**: Users can gracefully stop and start their Flink jobs from their previous state (Savepoint). Savepoints ensure that job progress is preserved, enabling seamless resumptions.

- **Job updates**: User can update the running job after updating the jar on storage account. This update automatically take the savepoint and start the job with a new jar.

- **Stateless updates**: Performing a fresh restart for a job is simplified through stateless updates. This feature allows users to initiate a clean restart using updated job jar.

- **Savepoint management**: At any given moment, users can create savepoints for their running jobs. These savepoints can be listed and used to restart the job from a specific checkpoint as needed.

- **Cancel**: This cancels the job permanently.

- **Delete**: Delete job history record.

## Options to manage jobs in HDInsight on AKS

HDInsight on AKS provides ways to manage Flink jobs.

- [Azure portal](#azure-portal)
- [ARM Rest API](#arm-rest-api)

### <a id="azure-portal">Job Management from Azure portal</a>

To run the Flink job from portal go to:

Portal --> HDInsight on AKS Cluster Pool --> Flink Cluster --> Settings --> Flink Jobs 

:::image type="image" source="./media/flink-job-management/run-flink-jobs.png" alt-text="Screenshot shows how to run `flink` job." border="true" lightbox="./media/flink-job-management/run-flink-jobs.png":::

- **New job:** To submit a new job, upload the job jars to the storage account and create a savepoint directory. Complete the template with the necessary configurations and then submit the job.

    :::image type="image" source="./media/flink-job-management/create-new-job.png" alt-text="Screenshot shows how to create new job." border="true" lightbox="./media/flink-job-management/create-new-job.png":::

    **Property details:**

   | Property | Description | Default Value | Mandatory |
   | -------- | ------- | -------- | ------- |
   | Job name  | Unique name for job. This is displayed on portal. Job name should be in small latter.    |   | Yes  |
   | Jar path  | Storage path for job jar. Users should create directory in cluster storage and upload job jar.|		Yes
   | Entry class |	Entry class for job from which job execution starts. |  | Yes |
   | Args | Argument for main program of job. Separate all arguments with spaces. |  |	No |
   | parallelism | Job Flink Parallelism. | 2	| Yes |
   | savepoint.directory | Savepoint directory for job. It is recommended that users should create a new directory for job savepoint in storage account. |	`abfs://<container>@<account>/<deployment-ID>/savepoints` | No |

   Once the job is launched, the job status on the portal is **RUNNING**.

- **Stop:** Stop job did not require any parameter, user can stop the job by selecting the action.

    :::image type="image" source="./media/flink-job-management/stop-job.png" alt-text="Screenshot shows how user can stop job." border="true" lightbox="./media/flink-job-management/stop-job.png":::

    Once the job is stopped, the job status on the portal is **STOPPED**.

- **Start:** This action starts the job from savepoint. To start the job, select the stopped job and start it.

    :::image type="image" source="./media/flink-job-management/start-job-savepoint.png" alt-text="Screenshot shows how user start job." border="true" lightbox="./media/flink-job-management/start-job-savepoint.png":::

    Fill the flow template with the required options and start it. Users need to select the savepoint from which user wants to start the job. By default, it takes the last successful savepoint.

    :::image type="image" source="./media/flink-job-management/fill-flow-template.png" alt-text="Screenshot shows how fill flow template." border="true" lightbox="./media/flink-job-management/fill-flow-template.png":::

    **Property details**:

   | Property | Description | Default Value  | Mandatory |
   | -------- | ------- | -------- | ------- |
   | Args | Argument for main program of job. All arguments should be separated by space. | | No |
   | Last savepoint | Last successful savepoint take before stopping job. This will used by default if not savepoint is selected. | | Not Editable |
   | Save point name |	Users can list the available savepoint for job and select one to start the job.	| | No |

   Once the job is started, the job status on the portal will be **RUNNING**.

- **Update:** Update helps to restart jobs with updated job code. Users need to update the latest job jar in storage location and update the job from portal. This update stops the job with savepoint and starts again with latest jar.

    :::image type="image" source="./media/flink-job-management/restart-job-with-updated-code.png" alt-text="Screenshot shows how restart jobs with updated job code." border="true" lightbox="./media/flink-job-management/restart-job-with-updated-code.png":::

   Template for updating job.
   
   :::image type="image" source="./media/flink-job-management/template-for-updating-job.png" alt-text="Screenshot shows template for updating job." border="true" lightbox="./media/flink-job-management/template-for-updating-job.png":::

   Once the job is updated, the job status on the portal is "RUNNING."

- **Stateless update:** This job is like an update, but it involves a fresh restart of the job with the latest code.

    :::image type="image" source="./media/flink-job-management/stateless-update.png" alt-text="Screenshot shows fresh restart of the job with the latest code." border="true" lightbox="./media/flink-job-management/stateless-update.png":::

   Template for updating job.

   :::image type="image" source="./media/flink-job-management/template-for-updating-stateless-job.png" alt-text="Screenshot shows template for updating stateless job." border="true" lightbox="./media/flink-job-management/template-for-updating-stateless-job.png":::

   **Property details**:
   
   | Property | Description | Default Value  | Mandatory |
   | -------- | ------- | -------- | ------- |
   | Args | Argument for main program of job. Separate all arguments with space. | | No |

   Once the job is updated, the job status on the portal is RUNNING.
   
- **Savepoint:** Take the savepoint for the Flink Job.

    :::image type="image" source="./media/flink-job-management/savepoint-flink-job.png" alt-text="Screenshot shows savepoint for the Flink Job." border="true" lightbox="./media/flink-job-management/savepoint-flink-job.png":::

    Savepoint is time consuming process, and it takes some time. You can see job action status as in-progress.

    :::image type="image" source="./media/flink-job-management/job-action-status.png" alt-text="Screenshot shows job action status." border="true" lightbox="./media/flink-job-management/job-action-status.png":::

- **Cancel:** This job helps user to terminate the job.

    :::image type="image" source="./media/flink-job-management/terminate-job.png" alt-text="Screenshot shows how user can terminate the job." border="true" lightbox="./media/flink-job-management/terminate-job.png":::

- **Delete:** Delete job data from portal.

    :::image type="image" source="./media/flink-job-management/delete-job-data.png" alt-text="Screenshot shows how user can delete job data from portal." border="true" lightbox="./media/flink-job-management/delete-job-data.png":::

- **View Job details:** To view the job detail user can click on job name, it gives the details about the job and last action result.

    :::image type="image" source="./media/flink-job-management/view-job-details.png" alt-text="Screenshot shows how to view job details." border="true" lightbox="./media/flink-job-management/view-job-details.png":::

    For any failed action, this job json give detailed exceptions and reasons for failure.

### <a id="arm-rest-api">Job Management Using Rest API</a>

HDInsight on AKS - Flink supports user friendly ARM Rest APIs to submit job and manage job. Using this Flink REST API, you can seamlessly integrate Flink job operations into your Azure Pipeline. Whether you're launching new jobs, updating running jobs, or performing various job operations, this streamlined approach eliminates manual steps and empowers you to manage your Flink cluster efficiently.

#### Base URL format for Rest API

See following URL for rest API, users need to replace subscription, resource group, cluster pool, cluster name and HDInsight on AKS API version in this before using it.
            `https://management.azure.com/subscriptions/{{USER_SUBSCRIPTION}}/resourceGroups/{{USER_RESOURCE_GROUP}}/providers/Microsoft.HDInsight/clusterpools/{{CLUSER_POOL}}/clusters/{{FLINK_CLUSTER}}/runjob?api-version={{API_VERSION}}`

Using this REST API, users can initiate new jobs, stop jobs, start jobs, create savepoints, cancel jobs, and delete jobs. The current API_VERSION is 2023-06-01-preview.

#### Rest API Authentication 

To authenticate  Flink ARM Rest API users, need to get the bearer token or access token for ARM resource. To authenticate Azure ARM (Azure Resource Manager) REST API using a service principal, you can follow these general steps:

- Create a Service Principal.

   `az ad sp create-for-rbac --name <your-SP-name>`
  
- Give owner permission to SP for `flink` cluster.

- Login with service principal.

    `az login --service-principal -u <client_id> -p <client_secret> --tenant <tenant_id>`

- Get access token.

   `$token = az account get-access-token --resource=https://management.azure.com/ | ConvertFrom-Json`

   `$tok = $token.accesstoken`

   Users can use token in URL shown.

   `$data = Invoke-RestMethod -Uri $restUri -Method GET -Headers @{ Authorization = "Bearer $tok" }`
  
**Authentication using Managed Identity:** Users can utilize resources that support Managed Identity to make calls to the Job REST API. For more details, please refer to the [Managed Identity](../../active-directory/managed-identities-azure-resources/tutorial-linux-vm-access-arm.md) documentation.
  
#### LIST of APIs and Parameters

- **New Job:** Rest API to submit new job to Flink.
     
   |  Option  |  Value |
   | -------- | ------- |
   |  Method  |  POST   |
   |  URL     |  `https://management.azure.com/subscriptions/{{USER_SUBSCRIPTION}}/resourceGroups/{{USER_RESOURCE_GROUP}}/providers/Microsoft.HDInsight/clusterpools/{{CLUSER_POOL}}/clusters/{{FLINK_CLUSTER}}/runJob?api-version={{API_VERSION}}` |
   | Header   | Authorization = "Bearer $token" |
    
   *Request Body:*

   ```
   { 
      "properties": { 
          "jobType": "FlinkJob", 
          "jobName": "<JOB_NAME>", 
          "action": "NEW", 
          "jobJarDirectory": "<JOB_JAR_STORAGE_PATH>", 
          "jarName": "<JOB_JAR_NAME>", 
          "entryClass": "<JOB_ENTRY_CLASS>", 
          “args”: ”<JOB_JVM_ARGUMENT>”
          "flinkConfiguration": { 
              "parallelism": "<JOB_PARALLELISM>", 
              "savepoint.directory": "<JOB_SAVEPOINT_DIRECTORY_STORAGE_PATH>" 
          } 
       } 
   }
   ```
   **Property details for JSON body:**
   
   | Property | Description | Default Value | Mandatory | 
   | -------- | ----------- | ------------- | --------- |
   | jobType  | Type of Job.It should be “FlinkJob” | | Yes|
   | jobName  | Unique name for job. This is displayed on portal. Job name should be in small latter.| | Yes |
   | action   | It indicates operation type on job. It should be “NEW” always for new job launch. | | Yes |
   | jobJarDirectory |	Storage path for job jar directory. Users should create directory in cluster storage and upload job jar.| Yes |
   | jarName |	Name of job jar. | | Yes |
   |entryClass | Entry class for job from which job execution starts. |  |	Yes |
   | args | Argument for main program of job. Separate arguments with space. |	| No |
   | parallelism | Job Flink Parallelism. | 2 | Yes |
   | savepoint.directory | Savepoint directory for job. It is recommended that users should create a new directory for job savepoint in storage account. |	`abfs://<container>@<account>/<deployment-ID>/savepoints`| No |

   Example:
 
   `Invoke-RestMethod -Uri $restUri -Method POST -Headers @{ Authorization = "Bearer $tok" } -Body $jsonString -ContentType "application/json"`

- **Stop job:** Rest API for stopping current running job.

   |  Option  |  Value  |
   | -------- | ------- |
   | Method   |  POST   |
   | URL      | `https://management.azure.com/subscriptions/{{USER_SUBSCRIPTION}}/resourceGroups/{{USER_RESOURCE_GROUP}}/providers/Microsoft.HDInsight/clusterpools/{{CLUSER_POOL}}/clusters/{{FLINK_CLUSTER}}/runJob?api-version={{API_VERSION}}` |
   | Header   | Authorization = "Bearer $token" |

   *Request Body*	

   ```
     {
        "properties": {
          "jobType": "FlinkJob",
          "jobName": "<JOB_NAME>",
          "action": "STOP"
        }
      }
    ```

   Property details for JSON body:

   | Property | Description | Default Value |	Mandatory |
   | -------- | ----------- | ------------- |  --------- |
   | jobType  | Type of Job. It should be “FlinkJob” | Yes |
   | jobName  | Job Name, which is used for launching the job | Yes |
   | action   | It should be “STOP” |	Yes |

   Example: 
   
   `Invoke-RestMethod -Uri $restUri -Method POST -Headers @{ Authorization = "Bearer $tok" } -Body $jsonString -ContentType "application/json"`

- **Start job:** Rest API to start STOPPED job.
   
   |  Option  |  Value  | 
   | -------- | ------- | 
   | Method   |  POST   | 
   | URL      | `https://management.azure.com/subscriptions/{{USER_SUBSCRIPTION}}/resourceGroups/{{USER_RESOURCE_GROUP}}/providers/Microsoft.HDInsight/clusterpools/{{CLUSER_POOL}}/clusters/{{FLINK_CLUSTER}}/runJob?api-version={{API_VERSION}}` |
   | Header   | Authorization = "Bearer $token" |


   *Request Body*

   ```
     {
        "properties": {
           "jobType": "FlinkJob",
           "jobName": "<JOB_NAME>",
           "action": "START",
           "savePointName": "<SAVEPOINT_NAME>"
        }
      }
    ```

   **Property details for JSON body:**

   | Property | Description | Default Value |	Mandatory |
   | -------- | ----------- | ------------- |  --------- |
   | jobType  | Type of Job. It should be “FlinkJob” | Yes |
   | jobName  | Job Name that is used for launching the job. | Yes |
   | action   | It should be “START” |	Yes |
   | savePointName | Save point name to start the job. It is optional property, by default start operation take last successful savepoint. | No |

   **Example:**
   
   `Invoke-RestMethod -Uri $restUri -Method POST -Headers @{ Authorization = "Bearer $tok" } -Body $jsonString -ContentType "application/json"`

- **Update job:** Rest API for updating current running job.

   |  Option  |  Value  |
   | -------- | ------- |
   | Method   |  POST   |
   | URL      | `https://management.azure.com/subscriptions/{{USER_SUBSCRIPTION}}/resourceGroups/{{USER_RESOURCE_GROUP}}/providers/Microsoft.HDInsight/clusterpools/{{CLUSER_POOL}}/clusters/{{FLINK_CLUSTER}}/runJob?api-version={{API_VERSION}}` |
   | Header   | Authorization = "Bearer $token" |

   *Request Body*

   ```
    {
        "properties": {
            "jobType": "FlinkJob",
            "jobName": "<JOB_NAME>",
            "action": "UPDATE",
            “args” : “<JOB_JVM_ARGUMENT>”,
            "savePointName": "<SAVEPOINT_NAME>"
        }
    }

    ```

   **Property details for JSON body:**

   | Property | Description | Default Value |	Mandatory |
   | -------- | ----------- | ------------- |  --------- |
   | jobType  |	Type of Job. It should be “FlinkJob” | 	|	Yes |
   | jobName  |	Job Name that is used for launching the job. |	| Yes |
   | action	  | It should be “UPDATE” always for new job launch. | | Yes |
   | args	  | Job JVM arguments |  | No |
   | savePointName | Save point name to start the job. It is optional property, by default start operation will take last successful savepoint.| |	No |

   Example: 
   
   `Invoke-RestMethod -Uri $restUri -Method POST -Headers @{ Authorization = "Bearer $tok" } -Body $jsonString -ContentType "application/json"`

- **Stateless update job:** Rest API for stateless update.
   
   |  Option  |  Value  |
   | -------- | ------- |
   | Method   |  POST   |
   | URL      | `https://management.azure.com/subscriptions/{{USER_SUBSCRIPTION}}/resourceGroups/{{USER_RESOURCE_GROUP}}/providers/Microsoft.HDInsight/clusterpools/{{CLUSER_POOL}}/clusters/{{FLINK_CLUSTER}}/runJob?api-version={{API_VERSION}}` |
   | Header   | Authorization = "Bearer $token" |

   *Request Body*

   ```
    {
        "properties": {
            "jobType": "FlinkJob",
            "jobName": "<JOB_NAME>",
            "action": "STATELESS_UPDATE",
            “args” : “<JOB_JVM_ARGUMENT>”
        }
    }
   ```

   **Property details for JSON body:**

   | Property | Description | Default Value |	Mandatory |
   | -------- | ----------- | ------------- |  --------- |
   | jobType  |	Type of Job. It should be “FlinkJob” | 	|	Yes |
   | jobName  |	Job Name that is used for launching the job. |	| Yes |
   | action	  | It should be “STATELESS_UPDATE” always for new job launch. | | Yes |
   | args	  | Job JVM arguments |  | No |

   **Example:**
   
   `Invoke-RestMethod -Uri $restUri -Method POST -Headers @{ Authorization = "Bearer $tok" } -Body $jsonString -ContentType "application/json"`

- **Savepoint:** Rest API to trigger savepoint for job.
   
   |  Option  |  Value  |
   | -------- | ------- |
   | Method   |  POST   |
   | URL      | `https://management.azure.com/subscriptions/{{USER_SUBSCRIPTION}}/resourceGroups/{{USER_RESOURCE_GROUP}}/providers/Microsoft.HDInsight/clusterpools/{{CLUSER_POOL}}/clusters/{{FLINK_CLUSTER}}/runJob?api-version={{API_VERSION}}` |
   | Header   | Authorization = "Bearer $token" |

   *Request Body*

   ```
    {
        "properties": {
            "jobType": "FlinkJob",
            "jobName": "<JOB_NAME>",
            "action": "SAVEPOINT"
        }
    }
   ```

   **Property details for JSON body:**

   | Property | Description | Default Value |	Mandatory |
   | -------- | ----------- | ------------- |  --------- |
   | jobType  |	Type of Job. It should be “FlinkJob” | 	|	Yes |
   | jobName  |	Job Name that is used for launching the job. |	| Yes |
   | action	  | It should be “SAVEPOINT” always for new job launch. | | Yes |

   **Example:**
   
   `Invoke-RestMethod -Uri $restUri -Method POST -Headers @{ Authorization = "Bearer $tok" } -Body $jsonString -ContentType "application/json"`

- **List savepoint:** Rest API to list all the savepoint from savepoint directory.

   |  Option  |  Value  |
   | -------- | ------- |
   | Method   |  POST   |
   | URL      | `https://management.azure.com/subscriptions/{{USER_SUBSCRIPTION}}/resourceGroups/{{USER_RESOURCE_GROUP}}/providers/Microsoft.HDInsight/clusterpools/{{CLUSER_POOL}}/clusters/{{FLINK_CLUSTER}}/runJob?api-version={{API_VERSION}}` |
   | Header   | Authorization = "Bearer $token" |

   *Request Body*

   ```
    {
        "properties": {
            "jobType": "FlinkJob",
            "jobName": "<JOB_NAME>",
            "action": "LIST_SAVEPOINT"
        }
    }
   ```

   **Property details for JSON body:**

   | Property | Description | Default Value |	Mandatory |
   | -------- | ----------- | ------------- |  --------- |
   | jobType  |	Type of Job. It should be “FlinkJob” | 	|	Yes |
   | jobName  |	Job Name which is used for launching the job |	| Yes |
   | action	  | It should be “LIST_SAVEPOINT” | | Yes |

   **Example:**
   
   `Invoke-RestMethod -Uri $restUri -Method POST -Headers @{ Authorization = "Bearer $tok" } -Body $jsonString -ContentType "application/json"`

- **Cancel:** Rest API to cancel the job.

   |  Option  |  Value  |
   | -------- | ------- |
   | Method   |  POST   |
   | URL      | `https://management.azure.com/subscriptions/{{USER_SUBSCRIPTION}}/resourceGroups/{{USER_RESOURCE_GROUP}}/providers/Microsoft.HDInsight/clusterpools/{{CLUSER_POOL}}/clusters/{{FLINK_CLUSTER}}/runJob?api-version={{API_VERSION}}` |
   | Header   | Authorization = "Bearer $token" |

   *Request Body*

   ```
    {
        "properties": {
            "jobType": "FlinkJob",
            "jobName": "<JOB_NAME>",
            "action": "CANCEL"
        }
    }
   ```

   **Property details for JSON body:**

   | Property | Description | Default Value |	Mandatory |
   | -------- | ----------- | ------------- |  --------- |
   | jobType  |	Type of Job. It should be `FlinkJob` | 	|	Yes |
   | jobName  |	Job Name that is used for launching the job. |	| Yes |
   | action	  | It should be CANCEL. | | Yes |

   **Example:**
   
   `Invoke-RestMethod -Uri $restUri -Method POST -Headers @{ Authorization = "Bearer $tok" } -Body $jsonString -ContentType "application/json"`

- **Delete:** Rest API to delete job.

   |  Option  |  Value  |
   | -------- | ------- |
   | Method   |  POST   |
   | URL      | `https://management.azure.com/subscriptions/{{USER_SUBSCRIPTION}}/resourceGroups/{{USER_RESOURCE_GROUP}}/providers/Microsoft.HDInsight/clusterpools/{{CLUSER_POOL}}/clusters/{{FLINK_CLUSTER}}/runJob?api-version={{API_VERSION}}` |
   | Header   | Authorization = "Bearer $token" |

   *Request Body*

   ```
    {
        "properties": {
            "jobType": "FlinkJob",
            "jobName": "<JOB_NAME>",
            "action": "DELETE"
        }
    }
   ```

   **Property details for JSON body:**

   | Property | Description | Default Value |	Mandatory |
   | -------- | ----------- | ------------- |  --------- |
   | jobType  |	Type of Job. It should be “FlinkJob” | 	|	Yes |
   | jobName  |	Job Name that is used for launching the job. |	| Yes |
   | action	  | It should be DELETE. | | Yes |

   **Example:** 
   
   `Invoke-RestMethod -Uri $restUri -Method POST -Headers @{ Authorization = "Bearer $tok" } -Body $jsonString -ContentType "application/json"`

- **List Jobs:** Rest API to list all the jobs and status of current action.

   |  Option  |  Value  |
   | -------- | ------- |
   | Method   |  GET   |
   | URL      | `https://management.azure.com/subscriptions/{{USER_SUBSCRIPTION}}/resourceGroups/{{USER_RESOURCE_GROUP}}/providers/Microsoft.HDInsight/clusterpools/{{CLUSER_POOL}}/clusters/{{FLINK_CLUSTER}}/jobs?api-version={{API_VERSION}}` |
   | Header   | Authorization = "Bearer $token" |
   
   **Output:**

   ```
   { 
    "value": [ 
        { 
            "id": "/subscriptions/{{USER_SUBSCRIPTION}}/resourceGroups/{{USER_RESOURCE_GROUP}}/providers/Microsoft.HDInsight/clusterpools/{{CLUSER_POOL}}/clusters/{{FLINK_CLUSTER}}/jobs/job1", 
            "properties": { 
                "jobType": "FlinkJob", 
                "jobName": "job1", 
                "jobJarDirectory": "<JOB_JAR_STORAGE_PATH>", 
                "jarName": "<JOB_JAR_NAME>", 
                "action": "STOP", 
                "entryClass": "<JOB_ENTRY_CLASS>", 
                "flinkConfiguration": { 
                    "parallelism": "2", 
                    "savepoint.directory": "<JOB_SAVEPOINT_DIRECTORY_STORAGE_PATH>s" 
                }, 
                "jobId": "20e9e907eb360b1c69510507f88cdb7b", 
                "status": "STOPPED", 
                "jobOutput": "Savepoint completed. Path: <JOB_SAVEPOINT_DIRECTORY_STORAGE_PATH>s/savepoint-20e9e9-8a48c6b905e5", 
                "actionResult": "SUCCESS", 
                "lastSavePoint": "<JOB_SAVEPOINT_DIRECTORY_STORAGE_PATH>s/savepoint-20e9e9-8a48c6b905e5" 
        } 
     }
    ]
   }
   ```

> [!NOTE]
> When any action is in progress, actionResult will indicate it with the value 'IN_PROGRESS' On successful completion, it will show 'SUCCESS', and in case of failure, it will be 'FAILED'.
