---
title: Azure Machine Learning Model Management Setup and Configuration | Microsoft Docs
description: This document describes the steps and concepts involved in setting up and configuring Model Management in Azure Machine Learning.
services: machine-learning
author: raymondlaghaeian
ms.author: raymondl
manager: hjerez
ms.reviewer: jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 08/29/2017

ROBOTS: NOINDEX
---
# Model management setup

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 



## Overview
This document gets you started with using Azure ML model management to deploy and manage your machine learning models as web services. 

Using Azure ML model management, you can efficiently deploy and manage Machine Learning models that are built using a number of frameworks including SparkML, Keras, TensorFlow, the Microsoft Cognitive Toolkit, or Python. 

By the end of this document, you should be able to have your model management environment set up and ready for deploying your machine learning models.

## What you need to get started
To get the most out of this guide, you should have owner access to an Azure subscription that you can deploy your models to.
The CLI comes pre-installed on the Azure Machine Learning Workbench and on [Azure DSVMs](https://docs.microsoft.com/azure/machine-learning/machine-learning-data-science-virtual-machine-overview).

## Using the CLI
To use the command-line interfaces (CLIs) from the Workbench, click **File** -] **Open CommandLine Interface**. 

On a Data Science Virtual Machine, connect and open the command prompt. Type `az ml -h` to see the options. For more details on the commands, use the --help flag.

On all other systems, you would have to install the CLIs.

### Installing (or updating) on Windows

Install Python from https://www.python.org/. Ensure that you have selected to install pip.

Open a command prompt using Run As Administrator and run the following commands:

```cmd
pip install azure-cli
pip install azure-cli-ml
```
 
>[!NOTE]
>If you have an earlier version, uninstall it first using the following command:
>

```cmd
pip uninstall azure-cli-ml
```

### Installing (or updating) on Linux
Run the following command from the command line, and follow the prompts:

```bash
sudo -i
pip install azure-cli
pip install azure-cli-ml
```

After intallation is complete, run the following command:

```bash
sudo /opt/microsoft/azureml/initial_setup.sh
```

>[!NOTE]
>Log out and log back in to your SSH session for the changes to take effect.
>You can use the previous commands to update an earlier version of the CLIs on the DSVM.
>

## Deploying your model
Use the CLIs to deploy models as web services. The web services can be deployed locally or to a cluster.

Start with a local deployment, validate that your model and code work, then deploy to a cluster for production scale use.

To start, you need to set up your deployment environment. The environment setup is a one time task. Once the setup is complete, you can reuse the environment for subsequent deployments. See the following section for more detail.

When completing the environment setup:
- You are prompted to sign in to Azure. To sign in, use a web browser to open the page https://aka.ms/devicelogin and enter the provided code to authenticate.
- During the authentication process, you are prompted for an account to authenticate with. Important: Select an account that has a valid Azure subscription and sufficient permissions to create resources in the account.- When the log-in is complete, your subscription information is presented and you are prompted whether you wish to continue with the selected account.

### Environment Setup
To start the setup process, you need to register the environment provider by entering the following command:

```azurecli
az provider register -n Microsoft.MachineLearningCompute
```

#### Local deployment
To deploy and test your web service on the local machine, set up a local environment using the following command:

```azurecli
az ml env setup -l [location of Azure Region, e.g. eastus2] -n [your environment name] [-g [existing resource group]]
```
>[!NOTE] 
>Local web service deployment requires your to install Docker on the local machine. 
>

The local environment setup command creates the following resources in your subscription:
- A resource group (if not provided)
- A storage account
- An Azure Container Registry (ACR)
- Application insights

After setup completes successfully, set the environment to be used using the following command:

```azurecli
az ml env set -n [environment name] -g [resource group]
```

#### Cluster deployment
Use Cluster deployment for high-scale production scenarios. It sets up an ACS cluster with Kubernetes as the orchestrator. The ACS cluster can be scaled out to handle larger throughput for your web service calls.

To deploy your web service to a production environment, first set up the environment using the following command:

```azurecli
az ml env setup -c --name [your environment name] --location [Azure region e.g. eastus2] [-g [resource group]]
```

The cluster environment setup command creates the following resources in your subscription:
- A resource group (if not provided)
- A storage account
- An Azure Container Registry (ACR)
- A Kubernetes deployment on an Azure Container Service (ACS) cluster
- Application insights

The resource group, storage account, and ACR are created quickly. The ACS deployment can take up to 20 minutes. 

After setup is complete, you need to set the environment to be used for this deployment. Use the following command:

```azurecli
az ml env set -n [environment name] -g [resource group]
```

>[!NOTE] 
> After the environment is created, for subsequent deployments, you only need to use the set command above to reuse it.
>

>[!NOTE] 
>To create an HTTPS endpoint, specify an SSL cert when creating a cluster by using the --cert-name and --cert-pem options in az ml env setup. This sets up the cluster to serve requests on https, secured using the provided certificate. After setup is complete, create a CNAME DNS record that points to the cluster’s FQDN.

### Create an Account
An account is required for deploying models. You need to do this once per account, and can reuse the same account in multiple deployments.

To create a new account, use the following command:

```azurecli
az ml account modelmanagement create -l [Azure region, e.g. eastus2] -n [your account name] -g [resource group name] --sku-instances [number of instances, e.g. 1] --sku-name [Pricing tier for example S1]
```

To use an existing account, use the following command:
```azurecli
az ml account modelmanagement set -n [your account name] -g [resource group it was created in]
```

### Deploy your model
You are now ready to deploy your saved model as a web service. 

```azurecli
az ml service create realtime --model-file [model file/folder path] -f [scoring file e.g. score.py] -n [your service name] -s [schema file e.g. service_schema.json] -r [runtime for the Docker container e.g. spark-py or python] -c [conda dependencies file for additional python packages]
```

### Next Steps
Try one of many samples in the Gallery.
