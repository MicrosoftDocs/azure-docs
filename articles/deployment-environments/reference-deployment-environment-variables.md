---
title: ADE CLI variables reference
titleSuffix: Azure Deployment Environments
description: Learn about the variables available for building custom images using the Azure Deployment Environment (ADE) CLI.
ms.service: deployment-environments
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/12/2024
ms.topic: reference

# Customer intent: As a developer, I want to learn about the variables available for use with the ADE CLI.
---

# Azure Deployment Environment CLI variables reference

Azure Deployment Environments (ADE) sets many variables related to your environment you can reference while authoring custom images. You can use the below variables within the operation scripts (deploy.sh or delete.sh) in order to make your images flexible to the environment they're interacting with.

For files used by ADE within the container, all exist in an ```ade``` subfolder off of the initial directory.

Here's the list of available environment variables:

## ADE_ERROR_LOG
Refers to the file located at `/ade/temp/error.log`. The `error.log` file stores any standard error output that populates an environment's error details in the result of a failed deployment or deletion. The file is used with `ade execute`, which records any standard output and standard error content to an ADE-managed log file. When using the `ade execute` command, redirect standard error logging to this file location using the following command:

```bash
ade execute --operation $ADE_OPERATION_NAME --command "{YOUR_COMMAND}" 2> >(tee -a $ADE_ERROR_LOG)
```

By using this method, you can view the deployment or deletion error within the developer portal. This leads to quicker and more successful debugging iterations when creating your custom image, and quicker diagnosis of the root cause for the failed operation.

## ADE_OUTPUTS
Refers to the file located at `/ade/temp/output.json`. The `output.json` file stores any outputs from an environment's deployment in persistent storage, so that it can be accessed by using the Azure CLI at a later date. When storing the output in a custom image, ensure the output is uploaded to the specified file, as shown in the following example:
```bash
echo "$deploymentOutput" > $ADE_OUTPUTS
```

## ADE_STORAGE
Refers to the directory located at `/ade/storage`. During the core image's entrypoint, ADE pulls down a specially named `storage.zip` file from the environment's storage container and populate this directory, and then at completion of the operation, reuploads the directory as a zip file back to the storage container. If you have files you would like to reference within your custom image on subsequent redeployments, such as state files, place them within this directory.

## ADE_CLIENT_ID
Refers to the object ID of the Managed Service Identity (MSI) of the environment's project environment type. This variable can be used to validate to the Azure CLI for permissions to utilize within the container, such as deployment of infrastructure.

## ADE_TENANT_ID
Refers to the tenant GUID of the environment. 

## ADE_SUBSCRIPTION_ID
Refers to the subscription GUID of the environment.

## ADE_TEMPLATE_FILE
Refers to where the main template file specified in the 'templatePath' property in the environment definition lives within the container. This path roughly mirrors the source control of where the catalog, depending on the file path level you connected the catalog at. The file is roughly located at `/ade/repository/{CATALOG_NAME}/{PATH_TO_TEMPLATE_FILE}`. This method is used primarily during the main deployment step as the file referenced to base the deployment off. 

Here's an example using the Azure CLI:
```bash
az deployment group create --subscription $ADE_SUBSCRIPTION_ID \
    --resource-group "$ADE_RESOURCE_GROUP_NAME" \
    --name "$deploymentName" \
    --no-prompt true --no-wait \
    --template-file "$ADE_TEMPLATE_FILE" \
    --parameters "$deploymentParameters" \
    --only-show-errors
```

Any further files, such as supporting IaC files or files you would like to use in your custom image, are stored at their relative location to the template file inside the container as they are within the catalog. For example, take the following directory:
```
├───SampleCatalog
   ├───EnvironmentDefinition1
      │   file1.bicep
      │   main.bicep
      │   environment.yaml
      │
      └───TestFolder
              test1.txt
              test2.txt
```

In this case, `$ADE_TEMPLATE_FILE=/ade/repository/SampleCatalog/EnvironmentDefinition1/main.bicep`. Additionally, files such as file1.bicep would be located within the container at `/ade/repository/SampleCatalog/EnvironmentDefinition1/file1.bicep`, and test2.txt would be located at `/ade/repository/SampleCatalog/EnvironmentDefinition1/TestFolder/test2.txt`. 

## ADE_ENVIRONMENT_NAME
The name of the environment given at deployment time.

## ADE_ENVIRONMENT_LOCATION
The location where the environment is being deployed. This location is the region of the project.

## ADE_RESOURCE_GROUP_NAME
The name of the resource group created by ADE to deploy your resources to.

## ADE_ENVIRONMENT_TYPE
The name of the project environment type being used to deploy this environment.

## ADE_OPERATION_PARAMETERS
A JSON object of the parameters supplied to deploy the environment. An example of the parameters object follows:
```json
{
    "location": "locationInput",
    "name": "nameInput",
    "sampleObject": {
        "sampleProperty": "sampleValue"
    },
    "sampleArray": [
        "sampleArrayValue1",
        "sampleArrayValue2"
    ]
}
```

## ADE_OPERATION_NAME
The type of operation being performed on the environment. Today, this value is either 'deploy' or 'delete'.

## ADE_HTTP__OPERATIONID
The Operation ID assigned to the operation being performed on the environment. The Operation ID is used as validation to use the ADE CLI, and is the main identifier in retrieving logs from past operations.

## ADE_HTTP__DEVCENTERID
The Dev Center ID of the environment. The Dev Center ID is also used as validation to use the ADE CLI. 
