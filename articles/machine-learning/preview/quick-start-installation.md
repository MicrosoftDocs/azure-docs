---
title: Installation Quickstart for Machine Learning Server | Microsoft Docs
description: This Quickstart shows how to provision Azure Machine Learning resources, and how to install Azure Machine Learning Workbench
services: machine-learning
author: hning86
ms.author: haining, raymondl
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: hero-article
ms.date: 09/05/2017
---

# Installing Azure Machine Learning preview features

In order to use Azure Machine Learning preview features, you need to do two things:
- Provision Azure resources.
- Install the Azure ML Workbench desktop application, which also includes CLI (command-line interface) tools.

## Prerequisites
### Mandatory Requirements:
* Access to an Azure subscription where you have sufficient permissions to create Azure resources. Minimally, you need to be a Contributor of the subscription, or Contributor of a Resource Group in the subscription.
* Windows 10, Windows server 2016, and macOS Sierra (or newer) are supported operating systems for the Azure ML Workbench desktop app and command-line interface (CLI).

### Optional Requirements:
* Local Docker engine for running dev/test locally.
* Access to Unbutu Linux VM for scale-up computation.
* Access to HDInsight for Spark cluster for scale-out computation.
* Access to Azure Container Service (ACS) Kubernetes cluster for scale-out deployment.

### Special Note for macOS Users
Ensure that you run this [shell script](scripts/quick-start-installation/install_openssl.sh) to brew-install the latest OpenSSL libraries, and configure links before proceeding with the installation.

If you are using Python greater than 3.5, you need to execute this command to enable installing the right certificates.
```bash
$ /Applications/Python\ 3.6/Install\ Certificates.command
```

## Provisioning
<!-- This section is to be completed by Chhavi. -->
Content coming soon...

## Installation
You can install Azure Machine Learning Workbench on your Windows or macOS computer.
### Remove prior installations
When a new release becomes available, Azure ML Workbench auto-updates on its own over the existing installation. It is generally unnecessary to remove prior installations. But in case you want to clean up and start a fresh install, you can run the following scripts: 

* Windows command line: [cleanup_win.cmd](scripts/quick-start-installation/cleanup_win.cmd). 
* Windows PowerShell: [cleanup_win.ps1](scripts/quick-start-installation/cleanup_win.ps1). 
  * Note, you may need to execute "_Set-ExecutionPolicy Unrestricted_" in a privilege-elevated PowerShell window before you can run the downloaded PowerShell script.
* macOS: [cleanup_mac.sh](scripts/quick-start-installation/cleanup_mac.sh)
  * You may need to execute "_chmod a+x ./cleanup_mac.sh_" before you can run the downloaded script.

>Note: to run these clean-up scripts, you might need elevated privileges. Also, these scripts do not delete your existing projects.

### Download the Latest Azure ML Workbench Installer

| Installer | Operation System  
| ------- | ------- 
| [AmlWorkbenchSetup.exe](https://vienna.blob.core.windows.net/windows/AmlWorkbenchSetup.exe) | Windows 
| [AmlWorkbench.dmg](https://vienna.blob.core.windows.net/osx/AmlWorkbench.dmg) | macOS

### Install Azure ML Workbench
Double-click the downloaded installer _AmlWorkbenchSetup.exe_ (on Windows), or _AmlWorkbench.dmg_ (on macOS). Follow the on-screen instructions to finish the installation. Azure ML Workbench is now installed in the following directory:
```
# On Windows
C:\Users\<username>\

# On macOS
/home/Users/<username>/
 ```

Click on the **Launch Azure ML Workbench** button when installation finishes to launch Workbench. If you close the instaler, you can find the shortcut on your desktop named **Azure Machine Learning Workbench**. Double-click and open it. 

Log in using the same account you used earlier to provision Azure resources. 

When logging in succeeds, Workbench attempts to find your ML Experimentation accounts you created earlier from all the Azure subscriptions you have access to. If at least one is found, Azure ML Workbench will load it and list Workspaces and Projects under that account. And your installation process is complete. You can now move on to installing optional components.

### Provisioning Azure ML resources through CLI
If no ML Experimentation account is found after you log in, you are presented with the following screen. 

You can go back to the Provisioning steps to create the Experimentation account. Or, you can launch a command-line window by clicking on that link, and provision the resources using CLI tools. Below are the instructions.

First, let's prepare the environment.
```bash
# make sure you have properly installed Azure ML CLI tools
$ az ml -h

# authenticate to Azure
$ az login

# list all your subscriptions
$ az account list -o table
 
# set the subscription you want to use for Azure ML as the current subscription.
$ az account set -s <subscription id>
```

From here, you have two options, you can create a new Azure resource group, or use an existing one. Note you must have access to create resources within the resource group.

```bash
# Create a new Azure resource group
# Note the currently supported Azure regions are: eastus2, and westcentralus
$ az group create --name <resource group name> --location <Azure region name>

# Create a new Experimentation account
# <resource group>: previously created resource group
# <Experimentation account name>: The Experimentation Account name must be between 3 and 24 characters in length and use numbers and lower-case letters only.
$ az ml account experimentation create -n <experimentation account name> -g <resource group name>
```
>Note the new Azure Storage Account auto-created will all carry the same name as the Experimentation account name.

After Experimentation account is created, close the current instance of Workbench, then relaunch it. You should be dropped into the newly created Experimentation account.

If you happen to be a member of more than one Experimentation accounts, you can switch among Experimentation accounts by clicking on your account picture at the lower left corner of the app.

It is a good idea to also create a new Workspace where your Projects can live. You can use commands below.

```bash
# Create a new workspace
# <workspace name>: name of the workspace
# <resource group>: previously created resource group
# <experimentation account name>  existing Experimentation account name
$ az ml workspace create -n <workspace name> -g <resource group name> -a <experimentation account name>
```

Let's also create resources needed for deploying and managing your models. 
>Note: Docker is required for running web services on your local machine.
```bash
# create a new Model Management Account
az ml account modelmanagement create -l <Azure region: e.g. eastus2> -n <environment name> -g <resource group name> --sku-instances <number of SKUs for billing: e.g. 1> --sku-name <name of the billing SKU: e.g. S1>

# create a new Model Management environment for local web service deployment
az ml env setup -l <Azure region, e.g. eastus2> -n <environmnet name>

# set the environment to be used
az ml env set -n <environment name created above> -g <resource group name it was created in>
```

### Check your build number
You can find out the build number of the installed app by clicking on the Help menu. Clicking on the build number copies it to your clipboard. You can paste it to emails or support forums to help report issues.

![version number](media/quick-start-installation/version.png)

### Success
You have now successfully installed the Workbench desktop app and command-line interface. Follow the [Iris Quickstart](quick-start-iris.md) to get a quick tour of the Azure ML preview features experience.

### Install Optional Components
Azure ML Workbench can run experiments in various compute targets. To leverage these execution targets, install additional components, and create or obtain access to additional computation resources in Azure:
* Execute on your local **Windows or macOS computer**
    * There is no additional requirements.
* Execute in a **local Docker container**
    * You must have Docker engine installed and running. Follow [Docker installation instructions](https://docs.docker.com/engine/installation/) to install Docker on your operation system.
* Execute in a **Docker container on a remote Linux machine**
    * You must have SSH access (username and password) to that Linux VM, and you must have Docker engine installed and running on that machine.
    * We recommend you [create a Ubuntu-based DSVM (Data Science Virtual Machine) on Azure](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-dsvm-ubuntu-intro), which has Docker pre-installed so it is ready go.
* Execute in an **HDInsight Spark cluster**
    * You must have SSH access (username and password) to the head node of that HDInsight Spark cluster. Here are the instructions on [provisioning a HDInsight Spark cluster](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-jupyter-spark-sql).
* Deploy a web service to run locally on your machine
    * This requires a local Docker installation. See the link above.

#### Special Note on Docker for Windows 
Docker is needed if you want to execute scripts in a local Docker container, or deploy model via a containerized web service locally. Since it is a technology born in Linux, it can be a little challenging to work with on Windows. Make sure you follow these instructions:
- Only Windows 10 is supported for running Docker for Windows.
- Install [Docker for Windows](https://docs.docker.com/docker-for-windows/install/) and have it up and running.
- Make sure your Docker engine is running in [Linux Container mode](https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers).
- Optionally, for better execution performance please share C drive (or whichever drive the system %temp% folder is) in the Docker for Windows configuration.
 
![Share C drive](media/quick-start-installation/share_c.png)

>Note on Windows, Docker container runs inside of a guest Linux VM on the Windows host via Hyper-V. You can see the Linux VM by opening up Hyper-V manager on your Windows OS.

## Next Steps
- Get a quick tour of Azure ML Workbench with [_Quickstart: Classifying Iris Flower Dataset_](quick-start-iris.md).
- Walk through an extensive tutorial [_Classifying Iris_](doc-template-tutorial.md).
- Learn about Azure ML Workbench data preparation capabilities through the [_Wrangling Bike Share Dataset_](doc-template-tutorial.md) tutorial.
