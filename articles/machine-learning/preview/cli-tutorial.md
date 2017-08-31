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
> * Setting up an experimentation account, creating workspace
> * Creating projects
> * Submitting experiments to multiple compute target
> * Promoting and registering a trained model
> * Deploying a web-service to score new data

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
PATH=/Users/$USER/Library/Caches/AmlWorkbench/Python/bin:$PATH
```
To make the change permanent, you can use SETX for Windows. For Mac, you can use setenv.

## Step 1. CLI context
The first step is to open the CLI from the AMLWorkbench App. Doing so will make sure we use the right python environment and we have the CLI accessible. 

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

## Step 2. Create a new Vienna project.
We start by creating a new Experimentation account and a new workspace. 

```
# Create a new ARM resource group
az group create --name <resource group name> --location eastus2

# Create a new experimentation account 
az ml account experimentation create --name <experimentation account name> --resource-group <resource group name>

# Create a new workspace 
az ml workspace create --name <workspace name> --account <experimentation account name> --resource-group  <resource group name>
```

Example:
```
az group create --name ahmet --location eastus2
az ml account experimentation create --name ahmetexp --resource-group ahmet
az ml workspace create --name ahmetw --account ahmetexp --resource-group ahmet
```

## Step 2.1a Create a new project
Our next step is to create a new project. We have different options, we can create a project with or without a git repository. 
```
# Create a new project
az ml project create --name <project name> --workspace <workspace name> --account <experimentation account name> --resource-group <resource group name> --path <path to project folder>

# Create a new project and supply your own VSTS git repository 
az ml project create --name <project name> --workspace <workspace name> --account <experimentation account name> --resource-group <resource group name> --path <path to project folder> --repo <VSTS git url> 
```

Example:
```
az ml project create --name 8_21_1 --workspace ahmetw --account ahmetexp --resource-group ahmet --path c:\Users\ahgyger\Documents\Vienna_Demo\8_21\

az ml project create --name 8_21_2 --workspace ahmetw --account ahmetexp --resource-group ahmet --path c:\Users\ahgyger\Documents\Vienna_Demo\ --repo https://ahgyger.visualstudio.com/vienna/_git/8_21
```

## Step 2.1b (optional) Create a new project from an online template
In this example, we use a template from a git hub project and use it when creating our new project. 
```
# Create a new project from a template
az ml project create --name <project name> --workspace <workspace name> --account <experimentation account name> --resource-group <resource group name> --path <path to project folder> --template-url <template url>
```

Example: 
```
az ml project create --name 8_21_3 --workspace ahmetw --account ahmetexp --resource-group ahmet --path c:\Users\ahgyger\Documents\Vienna_Demo\ --repo https://ahgyger.visualstudio.com/vienna/_git/8_21 --template-url http://github.com/hning86/ViennaSample-Iris
```
## Step 2.2 (optional) Share a workspace with co-worker. 
To give access to a co-worker. 
You need to use the real email address of the co-worker, not an alias. 

```
# Get the workspace ID
az ml workspace show --name <workspace name> --account <experimentation account name> --resource-group <resource group name>
az ml workspace show --name ahmetw --account ahmetexp --resource-group ahmet 

# Add user to the workspace
az role assignment create --assignee <user-email> --role owner --scope <arm workspace "id" (from previous command)>
```

Example:
```
az ml workspace show --name ahmetw --account ahmetexp --resource-group ahmet 
az role assignment create --assignee roastala@microsoft.com --role owner --scope "/subscriptions/d128f140-94e6-4175-87a7-954b9d27db16/resourceGroups/ahmet/providers/Microsoft.MachineLearningExperimentation/accounts/ahmetexp/workspaces/ahmetw"
```
## Step 3 Create a compute context
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
     "adminUsername": { "value" : "ahmet"},
     "adminPassword": { "value" : "password1."},
     "vmName": { "value" : "ahmetdsvm821"},
     "vmSize": { "value" : "Standard_DS2_v2"}
  }
}

# Create the new VM
az group deployment create --resource-group  ahmet  --template-uri https://raw.githubusercontent.com/Azure/DataScienceVM/master/Scripts/CreateDSVM/Ubuntu/azuredeploy.json --parameters @params.json
```

Once we have the VM, we can attach the compute context for our project. 
```
az vm list-ip-addresses --resource-group <resource group name> --name <VM Name>
az ml computetarget attach --name <compute target name> --address <IP address> --username <VM username> --password <VM password> --project <path to project>
```

Example: 
```
# Get the Public IP of the VM 
az vm list-ip-addresses --resource-group ahmet --name ahmetdsvm821

# Attach the compute context a project 
az ml computetarget attach --name remotevm --address 40.123.47.223 --username ahmet --password password1. --project c:\Users\ahgyger\Documents\Vienna_Demo\8_21_2
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
With some creativity, it's quite simple to put together a python script that will try different regularization rate. 
(You might have to edit the file to point to the right project path.)
```
python run.py
```

## Step 6. View run history
Below command will list all the previous runs executed. 

```
az ml history list
az ml history list --path <path to project> -o table
```

Example: 
```
az ml history list --path c:\Users\ahgyger\Documents\Vienna_Demo\8_21_2 -o table
```
> Not working:
> Custom metrics are not showing up...

## Step 6.1 View artifacts created by a given run 
To view the artifacts created by a previous run, we can use the info command of run history.
```
az ml history info --run <run id>
```
To download the artifacts from a run, you can simply use below command:
```
az ml history info --run <run id> --artifacts <artifact location>
```
## Step 7. Promote artifacts of a run 
One of the runs we made have a better AUC, we want to use it to create a scoring web-service (operationalization). In order to do so, we first need to promote the artifacts. 
```
az ml history promote --run <run id> --assets <URL to asset (can be a file or a folder)>
```

## Step 8. Download the files to be operationalized
We can now download the artifacts promoted in the previous step. 
```
az ml asset download --link-file <URL to link file (generate during promote step)> --output-directory <path to save the files>
```



## Step 9. Create a Vienna Hosting Account 
```
az ml hostacct create -n <hosting account name> -l eastus2 -g <resource group> --sku-name <S1 | S2 | S3> --sku-tier Standard
```




## Step 10. Create an operationalization environment
At this point we will change our focus to operationalization. To operationalize a trained model (that we serialize into a pickle file) we need to create an linux DSVM. 
```
# Deploy a linux DSVM (should be doable from local...)
```

## Deleting all the resources 
Let's complete this tutorial by deleting all the resources we have created, unless you want to keep working on it! 

To do so, we simply delete the resource group holding all our resources. 
```
az group delete --name ahmet
```


## Next Steps
In this tutorial, you have learned to use the Azure Machine Learning preview features to 
> [!div class="checklist"]
> * Setting up an experimentation account, creating workspace
> * Creating projects
> * Submitting experiments to multiple compute target
> * Promoting and registering a trained model
> * Deploying a web-service to score new data


Next, learn how to use manage your model, review this tutorial: 
[Another Tutorial](model-management-overview.md) 