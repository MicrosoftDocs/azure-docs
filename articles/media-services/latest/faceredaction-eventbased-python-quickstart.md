---
title: Event-based Face Redaction with Azure Media Services
description: This quickstart shows how to deploy an event-based solution on Azure, where incoming videos will be transformed using a Job in Azure Media Services.
services: media-services
author: harmke, dedvds
manager: ervandeh

ms.service: media-services
ms.workload: 
ms.topic: quickstart
ms.date: 5/21/2021
ms.author: inhenkel
---

# Event-based FaceRedaction with Azure Media Services

## Introduction
 
This quickstart shows how to deploy an event-based solution on Azure, where incoming videos will be transformed using a Job in Azure Media Services. It uses the Media Service v3 API.

The specific transformation that will be used is called [Face Redactor](https://docs.microsoft.com/en-us/azure/media-services/latest/analyze-face-redaction-concept), which is an Azure Media Analytics media processor, that allows you to modify your video in order to blur faces of selected individuals.

By the end of the quickstart you will be able to redact faces in a video:

![Example output](https://raw.githubusercontent.com/Azure-Samples/media-services-v3-python/main/VideoAnalytics/FaceRedactorEventBased/Resources/output-redacted.gif)

## Solution Overview

![Architecture](https://raw.githubusercontent.com/harmke/azure-docs/master/articles/media-services/latest/media/faceredaction-eventbased-python-quickstart/architecture.png)


This quickstart shows how to deploy the solution that can be found in the solution overview above. It starts with a storage account (Azure Data Lake Storage Gen2), with an Event Listener connected to it (Event Grid), that triggers an Azure Function when new .mp4 files are uploaded to the storage account. The Azure Function will submit a job to a pre-configured Transformation in Azure Media Services. The resulting Redacted video will be stored on a Blob Storage account.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Create a resource group to use with this quickstart.

## Get the sample and understand its deployment

Create a fork of the [Python samples repository](https://github.com/Azure-Samples/media-services-v3-python). For this quickstart, we're working with the FaceRedactorEventBased sample.

The deployment of this sample consists of three seperate steps: deploying the Azure services to setup the overall solution, deploying the Function App that submits a job to Azure Media Services when a new file is uploaded, and configuring the Eventgrid trigger. We have created a GitHub Actions workflow that performs these steps. Therefore, this solution can be deployed by adding the necessary variables to your GitHub environment, which means that no local development tools are required.

## Create a Service Principal

Before the Github Actions workflow can be run, a Service principal has to be created that has *Contributor* and *Storage Blob Data Reader* roles on the Resource Group. This Service Principal will be the app that will provision and configure all Azure services on behalf of Github Actions. The Service Principal is also used after the solution is deployed to generate a SAS token for videos that need to be processed.

To create the Service Principal and give it the roles that are needed on the Resource Group, fill in the variables in the following bash command and running it in the Cloud Shell:
```bash
# Replace <subscription-id>, <name-of-resource-group> and <name-of-app> with the corresponding values. 
# Make sure to use a unique name for the app name parameter.

app_name="<name-of-app>"
resource_group="<name-of-resource-group>"
subscription_id="<subscription-id>"

az ad sp create-for-rbac --name $app_name --role contributor \
                     --scopes /subscriptions/$subscription_id/resourceGroups/$resource_group \
                     --sdk-auth

object_id=$(az ad sp list --display-name $app_name --query [0].objectId -o tsv)

az role assignment create --assignee $object_id --role "Storage Blob Data Reader" \
                      --scope /subscriptions/$subscription_id/resourceGroups/$resource_group
```
  
The command should output a JSON object similar to this:
   
```json
{
  "clientId": "<GUID>",
  "clientSecret": "<GUID>",
  "subscriptionId": "<GUID>",
  "tenantId": "<GUID>",
  (...)
}
```
Make sure to copy the output and have it available for the next step.
 
## Add Service Principal details to GitHub Secrets 

The Service Principal details should be stored as a [GitHub Secret](https://docs.github.com/en/actions/reference/encrypted-secrets) so that Github Actions can deploy and configure the necessary services within Azure. Go to the Repo Settings -> Secrets of your forked repo and click on 'Create New Secrets'. Create the following secrets:
 - Create 'AZURE_CREDENTIALS' and paste the output from the previous step (full json). In the Github Action workflow this secret will be used to create a connection to Azure. 
 - Create 'CLIENT_ID' and paste the value of 'clientId' from the previous step.
 - Create 'CLIENT_SECRET' and paste the value of 'clientSecret' from the previous step.
 - Create 'TENANT_ID' and paste the value of 'tenantId' from the previous step.
 
## Create the .env file

Copy the contents from the sample.env file that is in your forked repo in the VideoAnalytics/FaceRedactorEventBased folder. Then, create your own .env file by clicking on Add file -> Create new file. Name the file *.env* and fill in the variables. When you're done, click on 'Commit new file'. We are now ready to deploy the solution, but we will first examine the code files that we will be using.

## Examine the code for provisioning the Azure Resources

The bash script below provisions the Azure services used in this solution. The bash script leverages the Azure CLI and executes the following actions:
- Load environment variables into local variables.
- Define names for ADLSgen2, a generic Azure Storage account, Azure Media Services, Azure Function App, and an Event Grid System Topic and Subscription.
- Provision the Azure services defined.
 
```bash
resource_group=$RESOURCE_GROUP
subscription_id=$SUBSCRIPTION_ID
location_Resources=$LOCATION 
solution_name=$SOLUTION_NAME

adlsg2_name="${solution_name}adlsgen2"
storage_name="${solution_name}v2blob"
ams_name="${solution_name}ams"
function_name="${solution_name}functionapp"
event_grid_system_topic="${solution_name}-event-based-video"
event_grid_subscription="event-based-video-subscription"

# Provision Azure Data Lake Gen2 account
az storage account create --name $adlsg2_name --resource-group $resource_group --location $location_Resources \
    --kind StorageV2 --hns true 
adls_resource_id=$(az resource show --name $adlsg2_name --resource-group $resource_group \
    --resource-type "Microsoft.Storage/StorageAccounts" --query id -o tsv)
az storage container create --name raw --account-name $adlsg2_name

# Provision Storage Account for AMS
az storage account create --name $storage_name --resource-group $resource_group \
    --location $location_Resources --kind StorageV2

# Provision Azure Media Services instance
az ams account create --name $ams_name --resource-group $resource_group --storage-account $storage_name \
    --location $location_Resources --mi-system-assigned

# Provision Azure Functions app
az functionapp create --name $function_name --resource-group $resource_group --storage-account $storage_name \ 
    --consumption-plan-location $location_Resources --os-type Linux --runtime python --runtime-version 3.8 \
    --functions-version 3

```

## Examine Azure Function code

After successfully provisioning the Azure Resources, we are ready to deploy the Python code to our Azure Function. The **/azure-function/EventGrid_AMSJob/__init__.py** file contains the logic to trigger an AMS job whenever a file is landing in the Azure Data Lake Gen2 file system. The script performs the following steps:
- Import dependencies and libraries.
- Use Function binder to listen to Azure Event Grid.
- Grab and define variables from event schema.
- Create Input/Output asset for AMS Job.
- Connect to Azure Data Lake Gen2 using DataLakeService Client, and generate a SAS-token to use as authentication for the AMS job input.
- Configure and create the Job.

```python
import json
import logging
import os
from datetime import datetime, timedelta
from urllib.parse import quote

import adal
from msrestazure.azure_active_directory import MSIAuthentication, AdalAuthentication
from msrestazure.azure_cloud import AZURE_PUBLIC_CLOUD
from azure.identity import ClientSecretCredential, DefaultAzureCredential
from azure.mgmt.media import AzureMediaServices
from azure.mgmt.media.models import (
    Asset,
    Job,
    JobInputHttp,
    JobOutputAsset)
import azure.functions as func
from azure.storage.filedatalake import DataLakeServiceClient, FileSasPermissions, generate_file_sas

def main(event: func.EventGridEvent):
    result = json.dumps({
        'id': event.id,
        'data': event.get_json(),
        'topic': event.topic,
        'subject': event.subject,
        'event_type': event.event_type,
    })

    logging.info('Python EventGrid trigger processed an event: %s', result)

    blob_url = event.get_json().get('url')
    blob_name = blob_url.split("/")[-1].split("?")[0]
    origin_container_name = blob_url.split("/")[-2].split("?")[0]
    storage_account_name = blob_url.split("//")[1].split(".")[0]

    ams_account_name = os.getenv('ACCOUNTNAME')
    resource_group_name = os.getenv('RESOURCEGROUP')
    subscription_id = os.getenv('SUBSCRIPTIONID')
    client_id = os.getenv('AZURE_CLIENT_ID')
    client_secret = os.getenv('AZURE_CLIENT_SECRET')
    TENANT_ID = os.getenv('AZURE_TENANT_ID')
    storage_blob_url = 'https://' + storage_account_name + '.blob.core.windows.net/'
    transform_name = 'faceredact'
    LOGIN_ENDPOINT = AZURE_PUBLIC_CLOUD.endpoints.active_directory
    RESOURCE = AZURE_PUBLIC_CLOUD.endpoints.active_directory_resource_id
    
    out_asset_name = 'faceblurringOutput_' + datetime.utcnow().strftime("%m-%d-%Y_%H:%M:%S")
    out_alternate_id = 'faceblurringOutput_' + datetime.utcnow().strftime("%m-%d-%Y_%H:%M:%S")
    out_description = 'Redacted video with blurred faces'

    context = adal.AuthenticationContext(LOGIN_ENDPOINT + "/" + TENANT_ID)
    credentials = AdalAuthentication(context.acquire_token_with_client_credentials, RESOURCE, client_id, client_secret)
    client = AzureMediaServices(credentials, subscription_id)

    output_asset = Asset(alternate_id=out_alternate_id,
                         description=out_description)
    client.assets.create_or_update(
        resource_group_name, ams_account_name, out_asset_name, output_asset)

    token_credential = DefaultAzureCredential()
    datalake_service_client = DataLakeServiceClient(account_url=storage_blob_url,
                                                    credential=token_credential)

    delegation_key = datalake_service_client.get_user_delegation_key(
        key_start_time=datetime.utcnow(), key_expiry_time=datetime.utcnow() + timedelta(hours=1))

    sas_token = generate_file_sas(account_name=storage_account_name, file_system_name=origin_container_name, directory_name="",
                                  file_name=blob_name, credential=delegation_key, permission=FileSasPermissions(read=True),
                                  expiry=datetime.utcnow() + timedelta(hours=1), protocol="https")

    sas_url = "{}?{}".format(quote(blob_url, safe='/:'), sas_token)
    
    job_name = 'Faceblurring-job_' + datetime.utcnow().strftime("%m-%d-%Y_%H:%M:%S")
    job_input = JobInputHttp(label="Video_asset", files=[sas_url])
    job_output = JobOutputAsset(asset_name=out_asset_name)
    job_parameters = Job(input=job_input, outputs=[job_output])

    client.jobs.create(resource_group_name, ams_account_name,
                       transform_name, job_name, parameters=job_parameters)
                       
```

## Examine the code for configuring the Azure Resources 

The bash script below is used for configuring the Resources after they have been provisioned. This is the last step of the deployment of the solution, after deploying our Function code. The script executes the following steps:
- Configure App Settings for the Function App .
- Create an Azure Event Grid System Topic.
- Create the Event subscription, so that when a Blob is created in the ADLSg2 Raw folder, the Azure Function is triggered.
- Create the Azure Media Services Transform using a REST API call. This transform will be called in the Azure Function.

> [!NOTE]
> Currently, neither the Azure Media Services v3 Python SDK, nor Azure CLI did support the creation of a FaceRedaction Transform. We therefore the Rest API method to create the transform job.
  
```bash  

resource_group=$RESOURCE_GROUP
subscription_id=$SUBSCRIPTION_ID
location_Resources=$LOCATION
solution_name=$SOLUTION_NAME
client_id=$AZURE_CLIENT_ID
client_secret=$AZURE_CLIENT_SECRET
tenant_id=$AZURE_TENANT_ID

adlsg2_name="${solution_name}adlsgen2"
storage_name="${solution_name}v2blob"
ams_name="${solution_name}ams"
function_name="${solution_name}functionapp"
event_grid_system_topic="${solution_name}-event-based-video"
event_grid_subscription="event-based-video-subscription"

adls_resource_id=$(az resource show --name $adlsg2_name --resource-group $resource_group \
    --resource-type "Microsoft.Storage/StorageAccounts" --query id -o tsv)
function_id=$(az functionapp function show -g $resource_group --name $function_name --function-name EventGrid_AMSJob \
    --query id -o tsv)
function_resource_id=$(az resource show --name $function_name --resource-group $resource_group \
    --resource-type "Microsoft.Web/sites/functions" --query id -o tsv)

az functionapp config appsettings set --name $function_name --resource-group $resource_group \
    --settings "ACCOUNTNAME=$ams_name" "RESOURCEGROUP=$resource_group" "SUBSCRIPTIONID=$subscription_id" \
    "AZURE_CLIENT_ID=$client_id" "AZURE_CLIENT_SECRET=$client_secret" "AZURE_TENANT_ID=$tenant_id"
    
az eventgrid system-topic create -g $resource_group --name $event_grid_system_topic --location $location_Resources \
    --topic-type microsoft.storage.storageaccounts --source $adls_resource_id
    
eventgrid_resource_id=$(az resource show --name $event_grid_system_topic --resource-group $resource_group \
    --resource-type "Microsoft.EventGrid/systemTopics" --query id -o tsv)
    
az eventgrid system-topic event-subscription create --name $event_grid_subscription --resource-group $resource_group \
    --system-topic-name $event_grid_system_topic --endpoint $function_id --endpoint-type azurefunction \
    --event-delivery-schema eventgridschema --included-event-types Microsoft.Storage.BlobCreated \
    --max-delivery-attempts 1 --subject-begins-with "/blobServices/default/containers/raw" --subject-ends-with ".mp4" 

# Create transform for AMS
az rest --method put --uri https://management.azure.com/subscriptions/${subscription_id}/resourceGroups/${resource_group}/providers/Microsoft.Media/mediaServices/${ams_name}/transforms/faceredact?api-version=2020-05-01 --body '{
    "properties": {
        "description": "Transform for FaceRedaction Analyzer ",
        "outputs": [
            {
                "onError": "StopProcessingJob",
                "relativePriority": "Normal",
                "preset": {
                    "@odata.type": "#Microsoft.Media.FaceDetectorPreset",
                    "mode": "Combined",
                    "blurType":"High"
                }
            }
        ]
    }
}'

```
 
## Enable Github Actions pipeline
 The Workflow file in this repository contains the steps to execute the deployment of this solution. To start the Workflow, it needs to be enabled for your own repo. In order to enable it, go to the Actions tab in your repo and click on 'I understand my workflows, go ahead and enable them'.
 
 ![Enable workflow](https://raw.githubusercontent.com/harmke/azure-docs/master/articles/media-services/latest/media/faceredaction-eventbased-python-quickstart/activate-workflow.png)
 
 When succesfully having enabled the Github Actions, you can find the workload file here: [.github/workflows/main.yml](./.github/workflows/main.yml).  Aside from the triggers, there is a build job with a couple of steps. The following steps are included:
- **Env**: In here, multiple environment variables are defined, referring to the GitHub Secrets that we added earlier.
- **Read Environment file**: The environment file is read for the build job.
- **Resolve Project Dependencies using Pip**: The needed libraries in our Azure functions are loaded into the Github Actions environment
- **Azure Login**: This step uses the Github Secret for logging into the Azure CLI using the Service Principal details.
- **Deploy Azure Resources using Azure CLI script file**: runs the deployment script for provisioning the Azure Resources
- **Deploy Azure Function code**: This step packages and deploys the azure function in the directory './azure-function'. When the Azure Function is succesfully deployed, it should be visible in the Azure portal under the name 'EventGrid_AMSJob':
![AzureFunction](https://raw.githubusercontent.com/harmke/azure-docs/master/articles/media-services/latest/media/faceredaction-eventbased-python-quickstart/azurefunction.png)
- **Configure Azure Resources using Azure CLI script file**:  If all correct, the last step is to configure the deployed Azure services to make one end-to-end solution. 

After enabling the workflows, click on the 'Deploy Azure Media Service FaceRedaction solution' workflow and click on 'Run workflow'. This will deploy the solution using the variables added in the previous steps. Wait a couple of minutes and verify that is has run successfully.

![Run workflow](https://raw.githubusercontent.com/harmke/azure-docs/master/articles/media-services/latest/media/faceredaction-eventbased-python-quickstart/run-workflow.png)

 ## Test your solution
 Go the the storage explorer of your ADLS Gen2 in the Azure Portal. Upload a video to the Raw container. If are looking for any test data, download one from [this website](https://www.pexels.com/search/videos/group/). See image below for guidance on uploading a video to the ADLS Gen2 storage account:
 
 ![Uploading video](https://raw.githubusercontent.com/harmke/azure-docs/master/articles/media-services/latest/media/faceredaction-eventbased-python-quickstart/upload-test-data.png)
 
 Verify in AMS that a job is created by going to your AMS account -> Transforms + Jobs and select the faceredact transform.
 
![AMS Transform](https://raw.githubusercontent.com/harmke/azure-docs/master/articles/media-services/latest/media/faceredaction-eventbased-python-quickstart/ams-transform.png)

This page should show the job that was fired by the Azure Function. The job can either be finished or still processing.
 
![AMS Job](https://raw.githubusercontent.com/harmke/azure-docs/master/articles/media-services/latest/media/faceredaction-eventbased-python-quickstart/ams-job.png)

By clicking on the job, you will see some details about the specific job. If you click on the Output asset name and then use the link to the storage container that is linked to it, you should be able to see your processed video when the job is finished.

![AMS Output](https://raw.githubusercontent.com/harmke/azure-docs/master/articles/media-services/latest/media/faceredaction-eventbased-python-quickstart/ams-output.png)

 
 ## Clean up Resources
 
 When you're finished with the quickstart, delete the Resources created in the resource group.
 
 ## Next steps
 
 If you would like to modify this example, chances are you would like to run the code locally. For local development, the variables in the sample.env file are sufficient because the Service Principal is not needed when a user account is logged in to the locally installed Azure CLI. For guidance on working locally with your Azure Function, we refer to [these docs](https://docs.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-python).
