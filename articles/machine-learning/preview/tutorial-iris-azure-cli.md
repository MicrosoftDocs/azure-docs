---
title: Tutorial article for Azure Machine Learning preview features - Command Line Interface  | Microsoft Docs
description: This tutorial walk through all the steps required to complete an Iris classification end-to-end from the command line interface.
services: machine-learning
author: ahgyger
ms.author: ahgyger
manager: haining
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc, tutorial
ms.topic: article
ms.date: 08/31/2017
---

# Tutorial: Iris Classification (on the command-line interface)
In this tutorial, you learn to use the Azure Machine Learning preview features to: 
> [!div class="checklist"]
> * Set up an experimentation account, creating workspace
> * Create projects
> * Submit experiments to multiple compute target
> * Promote and register a trained model
> * Deploy a web-service to score new data

## Prerequisites
If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

 
## Step 0. Getting started
By default, Vienna CLI is accessible from the shell opened from the Vienna Application (File > Open Command-Line Interface). If you would like to have it available in another terminal shell, you need to update your environment variable. 

### Enabling Vienna CLI in any terminal shell
To enable AZ ML CLI commands to be available in any terminal environment (it requires to have Vienna already installed), enter one of the following commands:
This step works from your favorite IDE terminal. 

```
# For Windows Shell
set PATH=%LOCALAPPDATA%\amlworkbench\Python;%LOCALAPPDATA%\amlworkbench\Python\Scripts;%PATH%

# For Windows PowerShell
$env:Path = $env:LOCALAPPDATA+"\amlworkbench\Python;"+$env:LOCALAPPDATA+"\amlworkbench\Python\Scripts;"+$env:Path

# For Mac Shell
PATH=$HOME/Library/Caches/AmlWorkbench/Python/bin:$PATH
```
To make the change permanent, you can use SETX for Windows. For Mac, you can use setenv.

## Step 1. CLI context
The first step is to open the CLI from the AMLWorkbench App. Doing so ensure we use the right python environment and we have the ML CLI commands available. 

We then need to set the right context in your CLI to access and manage Azure resources.

```
# Authenticate to Azure
az login

# Set the right context (Azure subscription from the list displayed after the login step)
az account set -s <subscription id>
```

Example 
```
az login
az account set -s d128f140-94e6-4175-87a7-954b9d27db16
```

## Step 2. Create a new Azure Machine Learning Experimentation Account and Workspace
We start by creating a new Experimentation account and a new workspace. 

```
# Create a new Azure Resource Manager resource group
az group create --name <resource group name> --location eastus2

# Create a new experimentation account 
az ml account experimentation create --name <experimentation account name> --resource-group <resource group name>

# Create a new workspace 
az ml workspace create --name <workspace name> --account <experimentation account name> --resource-group  <resource group name>
```

Example:
```
az group create --name amlsample --location eastus2
az ml account experimentation create --name amlsampleexp --resource-group amlsample
az ml workspace create --name amlsamplew --account amlsampleexp --resource-group amlsample
```

## Step 2.a Create a new project
Our next step is to create a new project. We have different options, we can create a project with or without a git repository. 
```
# Create a new project
az ml project create --name <project name> --workspace <workspace name> --account <experimentation account name> --resource-group <resource group name> --path <path to project folder>

# Create a new project and supply your own VSTS git repository 
az ml project create --name <project name> --workspace <workspace name> --account <experimentation account name> --resource-group <resource group name> --path <path to project folder> --repo <VSTS git url> 
```

Example:
```
az ml project create --name 8_21_1 --workspace amlsamplew --account amlsampleexp --resource-group amlsample --path c:\Users\ahgyger\Documents\Vienna_Demo\8_21\

az ml project create --name 8_21_2 --workspace amlsamplew --account amlsampleexp --resource-group amlsample --path c:\Users\ahgyger\Documents\Vienna_Demo\ --repo https://ahgyger.visualstudio.com/vienna/_git/8_21
```

## Step 2.b (optional) Create a new project from an online template (sample)
In this example, we use a template from a git hub project and use it when creating our new project. 
```
az ml project sample list

# Create a new project from a sample
az ml project create --name <project name> --workspace <workspace name> --account <experimentation account name> --resource-group <resource group name> --path <path to project folder> --template-url <template url (sample github_link)>
```

Example: 
```
az ml project create --name 8_21_3 --workspace amlsamplew --account amlsampleexp --resource-group amlsample --path c:\Users\ahgyger\Documents\Vienna_Demo\ --repo https://ahgyger.visualstudio.com/vienna/_git/8_21 --template-url http://github.com/hning86/ViennaSample-Iris
```
## Step 2.c (optional) Share a workspace with co-worker. 
To give access to a co-worker. 
You need to use the real email address of the co-worker, not an alias. 

```
# Get the workspace ID
az ml workspace show --name <workspace name> --account <experimentation account name> --resource-group <resource group name>
az ml workspace show --name amlsamplew --account amlsampleexp --resource-group amlsample 

# Add user to the workspace
az role assignment create --assignee <user-email> --role owner --scope <Azure Resource Workspace ID (from previous command)>
```

Example:
```
az ml workspace show --name amlsamplew --account amlsampleexp --resource-group amlsample 
az role assignment create --assignee roastala@microsoft.com --role owner --scope "/subscriptions/d128f140-94e6-4175-87a7-954b9d27db16/resourceGroups/amlsample/providers/Microsoft.MachineLearningExperimentation/accounts/amlsampleexp/workspaces/amlsamplew"
```
## Step 3 Create a cloud compute environment
First, we create a new Ubuntu DSVM (Data Science Virtual Machine). 
```
az group deployment create --resource-group  <resource group name>  --template-uri https://raw.githubusercontent.com/Azure/DataScienceVM/master/Scripts/CreateDSVM/Ubuntu/azuredeploy.json --parameters <path to json file>
```

Example:
```
Params.json: 
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
     "adminUsername": { "value" : "amlsample"},
     "adminPassword": { "value" : "password1."},
     "vmName": { "value" : "amlsampledsvm821"},
     "vmSize": { "value" : "Standard_DS2_v2"}
  }
}

# Create the new VM
az group deployment create --resource-group  amlsample  --template-uri https://raw.githubusercontent.com/Azure/DataScienceVM/master/Scripts/CreateDSVM/Ubuntu/azuredeploy.json --parameters @params.json
```

Once we have the VM, we can attach the compute context for our project. 
```
# List IP address of the VM we just created.
az vm list-ip-addresses --resource-group <resource group name> --name <VM Name>

# Create the compute target
az ml computetarget attach --name <compute target name> --address <IP address> --username <VM username> --password <VM password> --project <path to project>
```

Example: 
```
# Get the Public IP of the VM 
az vm list-ip-addresses --resource-group amlsample --name amlsampledsvm821

# Attach the compute context a project 
az ml computetarget attach --name remotevm --address 40.123.47.223 --username amlsample --password password1. --project c:\Users\ahgyger\Documents\Vienna_Demo\8_21_2
```

## Step 4.a Execute the sample locally 
```
# Execute the file
az ml experiment submit -c local iris_sklearn.py
```

## Step 4.b (optional) Execute the sample on the remote VM (on Docker)
Once we have validated that the sample works correctly locally, we can train on our VM. 
The first time is going to be slower, given that we need to pull the docker image and, create and configure the container. 
```
az ml experiment submit --run-configuration <compute context name> --project <path to project> <path to project>\iris_sklearn.py
```

Example
```
# Execute the file
az ml experiment submit --run-configuration remotevm --project c:\Users\ahgyger\Documents\Vienna_Demo\8_21_2 c:\Users\ahgyger\Documents\Vienna_Demo\8_21_2\iris_sklearn.py
```

## Step 5. Execute multiple iterations of iris_sklearn.py with a descending regularization rate. 
With some creativity, it's simple to put together a python script that submitting different regularization rate. 
(You might have to edit the file to point to the right project path.)

```
python run.py
```

## Step 6. View run history
Following command lists all the previous runs executed. 

```
az ml history list
az ml history list --path <path to project> -o table
```

Example: 
```
az ml history list --path c:\Users\ahgyger\Documents\Vienna_Demo\8_21_2 -o table
```

## Step 6.a View artifacts created by a given run 
To view the artifacts created by a previous run, we can use the info command of run history.
```
az ml history info --run <run id>
```
To download the artifacts from a run, you can use below command:
```
az ml history info --run <run id> --artifacts <artifact location>
```
## Step 7. Promote artifacts of a run 
One of the runs we made have a better AUC, we want to use it to create a scoring web-service (operationalization). In order to do so, we first need to promote the artifacts into an asset.

```
# Promote a run
az ml history promote --run <Run ID> --artifact-path <path to artifact (from history show)> --name <.link file name> 

Example:
az ml history promote -r "9_13_1505346632975" --artifact-path outputs/model.pkl --name pickle
```
This creates an __assets__ folder in your project directory containing the pickle.link. This link file is used to track the version of the promoted file.

## Step 8. Download the files to be operationalized
We now need to download the promoted file, so we can use them to create our prediction web-service. 


```
# Download asset
az ml asset download --link-file <path to .link file> --output-location <output folder>

Example: 
az ml asset download --link-file assets\pickle.link -d asset_download
```

## Step 9. Setup your operationalization environment
We setup the current environment as the default environment. 

```
# Create new environment
az ml env setup -l <region> -n <environment name>

# Set your environment for current context
az ml env set -g <resource-group> -n <environment name>

Example:
az ml env setup -l eastus2 -n amlsamplesenv
az ml env set -g amlsamplesenvrg -n amlsamplesenv
```

## Step 10. Create a ModelManagement Account 
The Model Management account enables to manage your model and operationalize them. 

```
# Create a Model Management Account
az ml account modelmanagement create --name <modelmanagement name> --resource-group <resource-group> --location <region>

Example:
az ml account modelmanagement create -n amlsamplesacct -g amlsamplesenvrg -l eastus2
```

## Step 11. Create a Prediction Web-Service
We then create a web-service that can do prediction. 

```
# Create Web-Service
az ml service create realtime -m modelfilename -f score.py -r python –n <webservice name>

Example:
az ml service create realtime -m modelfilename -f score.py -r python –n amlsamplews
```

## Deleting all the resources 
Let's complete this tutorial by deleting all the resources we have created, unless you want to keep working on it! 

To do so, we simply delete the resource group holding all our resources. 
```
az group delete --name amlsample
az group delete --name amlsamplesenvrg
```


## Next Steps
In this tutorial, you have learned to use the Azure Machine Learning preview features to 
> [!div class="checklist"]
> * Set up an experimentation account, creating workspace
> * Create projects
> * Submit experiments to multiple compute target
> * Promote and register a trained model
> * Deploy a web-service to score new data


Next, learn how to use manage your model, review this tutorial: 
[Model Management: Models, manifests, and images](./model-management-image-creation.md)
