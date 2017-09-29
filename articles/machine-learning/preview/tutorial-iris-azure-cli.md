---
title: Tutorial article for Azure Machine Learning preview features - Command Line Interface  | Microsoft Docs
description: This tutorial walk through all the steps required to complete an Iris classification end-to-end from the command line interface.
services: machine-learning
author: ahgyger
ms.author: ahgyger, ritbhat
manager: haining
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc, tutorial
ms.topic: article
ms.date: 09/20/2017
---

# Tutorial: Classifying Iris using the command-line interface
Azure Machine Learning services (preview) is an integrated, end-to-end data science and advanced analytics solution for professional data scientists to prepare data, develop experiments and deploy models at cloud scale.

In this tutorial, you learn to use the command-line interface (CLI) tools in Azure Machine Learning preview features to: 
> [!div class="checklist"]
> * Set up an Experimentation account and create a workspace
> * Create a project
> * Submit an experiment to multiple compute targets
> * Promote and register a trained model
> * Deploy a web service to score new data

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites
- You need access to an Azure subscription and permissions to create resources in that subscription. 
- You need to install Azure Machine Learing Workbench application by following the [Install and create Quickstart](quickstart-installation.md). 

  >[!NOTE]
  >You only need to install the Azure Machine Learning Workbench locally. You only need to follow the steps in the sections entitled Install Azure Machine Learning Workbench, since the account creation, and create a new project steps will be done by command line in this article.
 
## Getting started
Azure Machine Learning command-line interface (CLI) allows you to perform all tasks required for an end-to-end data science workflow. You can access the CLI tools in the following ways:

### Option 1. launch Azure ML CLI from Azure ML Workbench log-in dialog box
When you launch Azure ML Workbench and log in for the first time, and if you don't have access to an Experimentation Account already, you are presented with the following screen:

![no account found](media/tutorial-iris-azure-cli/no_account_found.png)

Click on the **Command Line Window** link in the dialog box to launch the command line window.

### Option 2. launch Azure ML CLI from Azure ML Workbench app
If you already have access to an Experimentation Account, you can log in successfully. And you can then open the command line window by clicking on **File** --> **Open Commmand Prompt** menu.

### Option 3. enable Azure ML CLI in an arbitrary command-line window
You can also enable Azure ML CLI in any command-line window. Simply launch a command window, and enter the following commands:

```sh
# Windows Command Prompt
set PATH=%LOCALAPPDATA%\amlworkbench\Python;%LOCALAPPDATA%\amlworkbench\Python\Scripts;%PATH%

# Windows PowerShell
$env:Path = $env:LOCALAPPDATA+"\amlworkbench\Python;"+$env:LOCALAPPDATA+"\amlworkbench\Python\Scripts;"+$env:Path

# macOS Bash Shell
PATH=$HOME/Library/Caches/AmlWorkbench/Python/bin:$PATH
```
To make the change permanent, you can use `SETX` on Windows. For macOS, you can use `setenv`.

>[!TIP]
>You can enable Azure CLI in your favorite terminal window by setting the above environment variables.

## Step 1. Log in to Azure
The first step is to open the CLI from the AMLWorkbench App (File > Open Command Prompt). Doing so ensures we use the right python environment and we have the ML CLI commands available. 

We then need to set the right context in your CLI to access and manage Azure resources.
 
```bash
az login
az account set -s d128f140-94e6-1206-80a7-954b9d27d007
```

> [!TIP]
> To get a list of all your subscriptions, run: 
>```
>az account list -o table
>```

## Step 2. Create a new Azure Machine Learning Experimentation Account and Workspace
We start by creating a new Experimentation account and a new workspace. See [Azure Machine Learning concepts](overview-general-concepts.md) for more details about experimentation accounts and workspaces. 

> [!NOTE]
> Experimentation accounts require a storage account, which is used to store the outputs of your experiment runs. The storage account name has to be globally unique in Azure because there is an url associated with it. Your experimentation account name is used to create, on your behalf, a new storage account. Make sure to use a unique name, or you will get an error such as _"The storage account named amlsampleexp is already taken."_ Alternatively, you can use the `--storage` argument to use an existing storage account.

```bash
az group create --name amlsample --location eastus2
az ml account experimentation create --name amlsampleexp --resource-group amlsample
az ml account experimentation create --name amlsampleexp --resource-group amlsample --storage /subscriptions/6d48cffb-b787-47bd-8d20-1696afa33b67/resourceGroups/existing/providers/Microsoft.Storage/storageAccounts/mystorageacct
az ml workspace create --name amlsamplew --account amlsampleexp --resource-group amlsample
```

## Step 2.a (optional) Share a workspace with co-worker
Here we explore how to share access to a workspace with a co-worker. The steps to share access to an experimentation account or to a project would be the same. Only the way of getting the Azure Resource ID would need to be updated.

```bash
az ml workspace show --name amlsamplew --account amlsampleexp --resource-group amlsample 
az role assignment create --assignee ahgyger@microsoft.com --role owner --scope "/subscriptions/d128f140-94e6-4175-87a7-954b9d27db16/resourceGroups/amlsample/providers/Microsoft.MachineLearningExperimentation/accounts/amlsampleexp/workspaces/amlsamplew"
```

> [!TIP]
> You need to use the real email address of the co-worker, not an alias. 

## Step 3. Create a new project
Our next step is to create a new project. There are several ways to get started with a new project.

### Create a new blank project

```bash
az ml project create --name 9_25_1 --workspace amlsamplew --account amlsampleexp --resource-group amlsample --path c:\Users\ahgyger\Documents\AMLworkbench_Demo\9_25\
```

### Create a new project with template files
Template files are not samples but they give a frame to your new project. The project is prepopulated with two files: `train.py` and `score.py`.

```bash
az ml project create --name 9_25_1 --workspace amlsamplew --account amlsampleexp --resource-group amlsample --path c:\Users\ahgyger\Documents\AMLworkbench_Demo\ --template
```

### Create a new project associated with a cloud Git repository
We can create a new project associated with a cloud Git repository. Every time an experiment is submitted, the project content will be snapshot as a Git commit in your run history branch. See [Using Git repository with an Azure Machine Learning Workbench project](using-git-ml-project.md) for more details.

> [!NOTE]
> Azure Machine Learning only supports empty Team Project (VSTS) with Git as versioning.

> [!TIP]
> If you are getting an error "Repository url might be invalid or user might not have access", you can create a security token in VSTS (Security, add personal access tokens) and use the __vststoken__ argument when creating your project. 

```bash
az ml project create --name 9_25_2 --workspace amlsamplew --account amlsampleexp --resource-group amlsample --path c:\Users\ahgyger\Documents\AMLworkbench_Demo\ --repo https://ahgyger.visualstudio.com/AMLWorkbench/_git/9_25 --vststoken m2fholwwrcn7u4nrdqfxx007u5rztjfhgofnemvuvtue6pbwo3sa
```

### <a name="sample_create"></a>Create a new project from an online sample
In this example, we use a template from a git hub project and use it when creating our new project. 

```bash
# List the project samples
az ml project sample list

# Create a new project from a sample
az ml project create --name 9_25_3 --workspace amlsamplew --account amlsampleexp --resource-group amlsample --path c:\Users\ahgyger\Documents\AMLworkbench_Demo\ --repo https://ahgyger.visualstudio.com/AMLWorkbench/_git/9_25 --template-url https://github.com/MicrosoftDocs/MachineLearningSamples-Iris
```

Once your project is created, change your directory to it before going to the next step.

```bash
cd c:\Users\ahgyger\Documents\AMLworkbench_Demo\9_25\9_25_1
```

## Step 4 Run the training experiment 
The steps below assume that you have a project with the Iris sample (see [Create a new project from an online sample](#sample_create)).

### Prepare your environment 
For the Iris sample, we need to install matplotlib.

```bash
pip install matplotlib
```

###  Submit the experiment

```bash
# Execute the file
az ml experiment submit --run-configuration local iris_sklearn.py
```

### Iterate on your experiment with descending regularization rates
With some creativity, it's simple to put together a python script that submits experiments with different regularization rates. 
(You might have to edit the file to point to the right project path.)

```bash
python run.py
```

## Step 5. View run history
Following command lists all the previous runs executed. 

```bash
az ml history list -o table
```
Running the above command will display a list of all the runs belonging to this project. You can see that accuracy and regularization rate metrics are listed too. This make it easy to identify the best run from the list.

## Step 5.a View attachment created by a given run 
To view the attachment associated with a given run, we can use the info command of run history.

```bash
az ml history info --run 9_16_4_1505589545267 --artifact driver_log
```

To download the artifacts from a run, you can use below command:

```bash
# Stream a given attachment 
az ml history info --run <run id> --artifact <artifact location>
```

## Step 6. Promote artifacts of a run 
One of the runs we made has a better AUC, so we want to use it to create a scoring web service to deploy to production. In order to do so, we first need to promote the artifacts into an asset.

```bash
az ml history promote --run 9_25_1505346632975 --artifact-path outputs/model.pkl --name model.pkl
```

This creates an __assets__ folder in your project directory containing the pickle.link. This link file is used to track the version of the promoted file.

## Step 7. Download the files to be operationalized
We now need to download the promoted files, so we can use them to create our prediction web service. 

```bash
az ml asset download --link-file assets\pickle.link -d asset_download
```

## Step 8. Setup your model management environment 
We create an environment to deploy web services. We can run the web service on the local machine using Docker. Or deploy it to an ACS cluster for high-scale operations. 

```bash
# Create new environment
az ml env setup -l eastus2 -n amlsamplesenv
# Once setup is complete, set your environment for current context
az ml env set -g amlsamplesenvrg -n amlsamplesenv
```

## Step 9. Create a model management account 
A model management account is required to deploy and track your models in production. 

```bash
az ml account modelmanagement create -n amlsamplesacct -g amlsamplesenvrg -l eastus2
```

## Step 10. Create a web service
We then create a web service that returns a prediction using the model we deployed. 

```bash
az ml service create realtime -m modelfilename -f score.py -r python –n amlsamplews
```

## Step 10. Run the web service
Using the web service id from the output of the previous step, we can call the web service and test it. 

```
# Get web service usage infomration
az ml service usage realtime -i <web service id>

# Call the web service with the run command:
az ml service run realtime -i <web service id> -d <input data>
```

## Deleting all the resources 
Let's complete this tutorial by deleting all the resources we have created, unless you want to keep working on it! 

To do so, we simply delete the resource group holding all our resources. 

```bash
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
> * Create a model management account for model management
> * Create an environment to deploy a web service
> * Deploy a web-service and score with new data

