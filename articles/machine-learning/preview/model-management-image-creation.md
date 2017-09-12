---
title: Create a Docker image for Model Management in Azure Machine Learning | Microsoft Docs
description: This document describes the steps for creating a docker image for your web service.
services: machine-learning
author: chhavib    
ms.author: chhavib
manager: neerajkh
editor: jasonwhowell
ms.service: machine-learning
ms.workload: data-services
ms.devlang: na
ms.topic: article
ms.date: 08/30/2017
---
# Model Management: Models, Manifests, and Images

## Overview
This document walks you through the following steps of creating a docker image for your web service:
Model Registration
Manifest Creation
Image Creation
You can use this image to create a web service either locally or on a remote ACS cluster or another docker supported environment of your choice.

## Prerequisites
Make sure you have gone through the installation steps in the QuickStart Installation document.
Following are required before you proceed:
1. Model Management Account provisioning
2. Environment creation for deploying and managing models
3. A machine learning model

To get the most out of this guide, you should have owner access to an Azure subscription that you can deploy your models to.
The CLI comes pre-installed on the Azure ML Workbench and on Azure DSVMs [https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-virtual-machine-overview].

To use the CLIs, on the Azure ML App menu, use File -> Open CommandLine Interface. On a DSVM, open a command prompt. Once there, type az ml -h to see the options. For more details, use the --help with individual commands.

On all other systems, you would have to install the CLIs.

## Setup
### CLI Install
#### Installing (or updating) on Windows

Install Python from [https://www.python.org/](https://www.python.org/). Ensure that you have selected to install pip.

Open a command prompt using Run As Administrator and run the following commands:

    pip install azure-cli
    pip install azure-cli-ml

#### Installing (or updating) on Linux

The easiest and quickest way to get started on Linux is to use the Data Science VM (see [Provision the Data Science Virtual Machine for Linux (Ubuntu)](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-dsvm-ubuntu-intro)).

**Note**: The information in this document pertains to DSVMs provisioned after May 1, 2017.

Once you have provisioned and signed into the DSVM, run the following commands and follow the prompts:
 
    $ wget -q https://raw.githubusercontent.com/Azure/Machine-Learning-Operationalization/master/scripts/amlupdate.sh -O - | sudo bash -
    $ sudo /opt/microsoft/azureml/initial_setup.sh
    
**NOTE**: You may need to use the sudo -i command first.

**NOTE**: You must log out and log back in to your SSH session for the changes to take effect.

**NOTE**: You can use the preceding commands to update an earlier version of the CLIs on the DSVM.

### Provisioning
##### Set up the environment
To deploy your web service to a production environment, first set up the environment using the following command:

    az ml env setup -c --cluster-name [your environment name] --location [Azure region e.g. eastus]

The cluster environment setup command creates the following resources in your subscription:

* A resource group
* A storage account
* An Azure Container Registry (ACR)
* A Kubernetes deployment on an Azure Container Service (ACS) cluster
* Application insights
   
The resource group, storage account, and ACR are created quickly. The ACS deployment may take some time. Once the setup command has finished setting up the resource group, storage account, and ACR, it outputs the environment export commands for the AML CLI environment. 

**NOTE**: If you do not supply a -c parameter when you call the environment setup, the environment is configured for local mode. If you choose this option, you will not be able to run cluster mode commands.

After setup is complete, set the environment to be used for this deployment.

    az ml env set --cluster-name [environment name] -g [resource group]
    
- Cluster name: the name used when setting up the environment
- Resource group name: the name you specified for the preceding setup command - if you didn't specify the name at the time of setup, this is the name that was created and returned in the output of the setup command.

Once the environment is created, you only need to use the preceding set command for subsequent deployments.

##### Create a Model Management account
This creates and sets the Model Management account. You create this account in order to access capabilities of creating images for web services, deploying models as web services as well as tracking model versions in production. You create and set this account once. Subsequent deployments may reuse the same account.

    az ml account modelmanagement create -l [Azure region, e.g. eastus2] -n [your account name] -g [resource group name: existing] --sku-instances 1 --sku-name S1

The preceding command also sets the account for deployment, which means you can now deploy your web service. For any subsequent deployments however, you need to set the account first using the following command:

    az ml account modelmanagement set -n [your account name] -g [resource group it was created in]
### AAD Token
When using the CLI, log in using `az login`. The CLI uses your AAD token from the .azure file. If you wish to use the APIs, you have the following options:

##### Acquiring the AAD token manually
You can do `az login` and get the latest token from the .azure file on your home directory.

##### Acquiring the AAD token programmatically
```
az ad sp create-for-rbac --scopes /subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName> --role Contributor --years <length of time> --name <MyservicePrincipalContributor>
```
Once you create service principal, save the output. Now you can use that to get token from AAD:

```cs
 private static async Task<string> AcquireTokenAsync(string clientId, string password, string authority, string resource)
{
        var creds = new ClientCredential(clientId, password);
        var context = new AuthenticationContext(authority);
        var token = await context.AcquireTokenAsync(resource, creds).ConfigureAwait(false);
        return token.AccessToken;
}
```
The token is put in authorization header for API calls. See below for more details.


## Registering Models

Model registration step registers your machine learning model with Azure Model Management Account that you created. This registration enables tracking the models and their versions that are assigned at the time of registration. The user provides the name of the model. Subsequent registration of models under the same name generates a new version and ID.

For the sake of this example, let us assume you have __*housing.model*__ in your current directory. This is a pySpark model and appears as a folder on your file system.  You would want to register it as __*housing.model*__ provide its location, which is the name of the model in current directory or SAS url. 

### CLI
The following command will zip your model, load to the storage location of the environment you set up earlier, and pass in sas url to the APIs behind the scene.
```
az ml model register -m housing.model -n housing.model -t myTag -d "my housing.model"
```
### API

The following API is called by the CLI, which expects the sas url of the model file and the name:

`
Method: 
`
```
POST
```
`
Headers: 
`
```
Content-Type:	application/json
Authorization:	Bearer [AAD Token]
```
`
Body:
`
```json
{
    "name": "housing.model",
    "tags": [
        "myTag"
    ],
    "description": "my housing.model",
    "url": "sas url of the model file",
    "mimeType": "application/zip",
    "unpack": "true"
}
```
`
Response:
`

Http Status Code 200 means Successfully Registered
```json
{
    "id": "<system generated model id>",
    "name": "housing.model",
    "version": "<system generated model version>",
    "description": "my housing.model",
    "url": "sas url of the model file",
    "tags": [
        "myTag"
    ],
    "mimeType": "application/zip",
    "createdAt": "<date time of creation>"
}
```


## Creation of Manifests
Manifests are artifacts that bundle your dependencies together with models. This allows them to be packaged together. In other words, manifest defines the requirements to create your web service. It includes models, coding files, configuration settings, pip or conda files, or any other artifact that should be available on the container.

Let us assume you have already registered a model in the previous step. 

**Model ID**:      *07b56951-3ce6-481a-bcb7-e76ee669e990*

**Scoring File**: *scoring.py*

**Conda File**: *myConda.yml*

### CLI
```
az ml manifest create -i 07b56951-3ce6-481a-bcb7-e76ee669e990 -n housingmodel-manifest -f scoring.py -c myconda.yml -r spark-py
```
### API
`
Method: 
`
```
POST
```
`
Headers: 
`
```
Content-Type:	application/json
Authorization:	Bearer [AAD Token]
```
`
Body:
`
```json
{
   "driverProgram": "scoringFileId",
   "description": "<description content>",
   "modelType": "Registered",
   "name": "housingmodel-manifest",
   "modelIds": [
      "07b56951-3ce6-481a-bcb7-e76ee669e990"
   ],
   "assets": [
      {
         "id": "scoringFileId",
         "url": "<Sas Url of the scoring file>",
         "mimeType": "application/x-python",
         "unPack": "False"
      },
   ],
   "targetRuntime": {
      "runtimeType": "SparkPython",
      "properties": {
         "condaEnvFile": "<Sas Url of th condat file>"
      }
   }
}
```
Response:
`

Http Status Code 200 means Successfully Registered
```json
{
   "id": "c510e688-60cc-43fb-bfe1-491a97374c6a",
   "version": "1",
   "driverProgram": "scoringFileId",
   "description": "<description content>",
   "modelType": "Registered",
   "name": "housingmodel-manifest",
   "CreatedTime": "2017-08-30T23:09:00.044617Z",
   "modelIds": [
      "07b56951-3ce6-481a-bcb7-e76ee669e990"
   ],
   "assets": [
      {
         "id": "scoringFileId",
         "url": "<Sas Url of the scoring file>",
         "mimeType": "application/x-python",
         "unPack": "False"
      },
   ],
   "targetRuntime": {
      "runtimeType": "SparkPython",
      "properties": {
         "condaEnvFile": "<Sas Url of th condat file>"
      }
   }
}
```

## Building images
Once you have the model registered and manifest created, you may go ahead and create Docker Images for your web service. The container images will have all the artifacts defined in the manifest, all the dependencies downloaded. These images are pushed to Azure Container Registry. From there they can be pulled down for local testing or for service creation on ACS.

### CLI
Let us assume you have already created manifest in the preceding step.

**ManifestId**: e6b50818-0dfe-4e75-a987-c2fb6dc61431

```
az ml image create -n housingmodel-image --manifest-id e6b50818-0dfe-4e75-a987-c2fb6dc61431
```
### API
`
Method: 
`
```
POST
```
`
Headers: 
`
```
Content-Type:	application/json
Authorization:	Bearer [AAD Token]
```
`
Body:
`
```json
{
    "manifestId": "e6b50818-0dfe-4e75-a987-c2fb6dc61431",
    "imageType": "Docker",
    "computeResourceId": "<ARM id of the compute resource>",
    "name": "housingmodel-image"
}

```
Response:
`

Http Status Code 200 means Successfully Registered
```json
{
  "ComputeResourceId": "<ARM id of the compute resource>",
  "CreatedTime": "2017-08-30T23:09:00.044617Z",
  "CreationState": "Succeeded",
  "Description": "<description content>",
  "Id": "07b56951-3ce6-481a-bcb7-e76ee669e990",
  "ImageBuildLogUri": "<url of the build logs>",
  "ImageLocation": "<youacr user name>.azurecr.io/housingmodel-image:1",
  "ImageType": "Docker",
  "Manifest": {
        "id": "c510e688-60cc-43fb-bfe1-491a97374c6a",
        "version": "1",
        "driverProgram": "scoringFileId",
        "description": "<description content>",
        "modelType": "Registered",
        "name": "housingmodel-manifest",
        "CreatedTime": "2017-08-30T23:09:00.044617Z",
        "modelIds": [
            "07b56951-3ce6-481a-bcb7-e76ee669e990"
        ],
        "assets": [
            {
                "id": "scoringFileId",
                "url": "<Sas Url of the scoring file>",
                "mimeType": "application/x-python",
                "unPack": "False"
            },
        ],
        "targetRuntime": {
            "runtimeType": "SparkPython",
            "properties": {
                "condaEnvFile": "<Sas Url of th condat file>"
            }
        }
    },
    "Version": 1,
    "WebserviceType": "Realtime",
    "Name": "housingmodel-image"
  }
```
