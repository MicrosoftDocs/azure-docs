---
title: Installation quickstart for Machine Learning Server | Microsoft Docs
description: This quickstart shows how to provision Azure Machine Learning resources, and how to install Azure Machine Learning Workbench
services: machine-learning
author: hning86
ms.author: haining, raymondl, chhavib
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: hero-article
ms.date: 09/07/2017
---

# Installing Azure Machine Learning preview features

In order to use Azure Machine Learning preview features, you need to do two things:
- Provision the relevant Azure resources.
- Install the Azure ML Workbench desktop application, which also includes CLI (command-line interface) tools.

## Prerequisites
### Mandatory Requirements:
* Access to an Azure subscription where you have sufficient permissions to create Azure resources. Minimally, you need to be a Contributor to the subscription, or Contributor to a Resource Group in the subscription.
* Supported operating systems for the Azure ML Workbench:
    * Windows 10
    * Windows server 2016
    * macOS Sierra (or newer)
* Local web service deployment requires Docker on the local machine.
* To set up a Model Management environment on a cluster, you must be an owner on the subscription.

>Note model management CLI tools are also supported on Linux.

### Optional Requirements:
* Local Docker engine for running dev/test scenarios locally.
* Access to an Ubutu Linux VM for scale-up computation.
* Access to HDInsight for Spark cluster for scale-out computation.
* Access to an Azure Container Service (ACS) Kubernetes cluster for scale-out model deployment.

### Special Note for macOS Users
Ensure that you run this [shell script](scripts/quick-start-installation/install_openssl.sh) to brew-install the latest OpenSSL libraries, and configure links before proceeding with the installation.

If you are using Python greater than 3.5, you need to execute this command to enable installing the right certificates.
```bash
$ /Applications/Python\ 3.6/Install\ Certificates.command
```

## Provisioning
Launch the Azure portal by browsing to [http://portal.azure.com](http://portal.azure.com). Log in to Azure. Click on **+ New** and search for `Machine Learning`. Look for `ML Experimentation (preview)` in the search results. Click on `ML Experimentation (preview)` to get started with creating your _Machine Learning Experimentation account_. As part of the Experimentation account creation, you are also asked to create an Azure storage account, or to supply an existing one, for storing Run outputs and other data.

As part of the Experimentation account creation experience, you have the option of also creating the _Machine Learning Model Management account_. You need this resource when you are ready to deploy and manage your models as real-time web services. We recommended that you create the Model Management account at the same time as the Experimentation account.

<!--
>NOTE: Some note about pricing associated for public preview should go in here.
-->

## Installation
You can install Azure Machine Learning Workbench on your Windows or macOS computer.
### Remove prior installations
When a new release becomes available, Azure ML Workbench will auto-update on its own replacing your existing local installation. It is usually unnecessary to remove prior installations. However, you can run the following scripts if you'd like to clean up your current install and start fresh: 

* Windows command line: [cleanup_win.cmd](scripts/quick-start-installation/cleanup_win.cmd). 
* Windows PowerShell: [cleanup_win.ps1](scripts/quick-start-installation/cleanup_win.ps1). 
  * Note, you may need to execute "_Set-ExecutionPolicy Unrestricted_" in a privilege-elevated PowerShell window before you can run the downloaded PowerShell script.
* macOS: [cleanup_mac.sh](scripts/quick-start-installation/cleanup_mac.sh)
  * You may need to execute `_chmod a+x ./cleanup_mac.sh_` before you can run the downloaded script.

>Note: to run these clean-up scripts, you might need elevated privileges. Also, these scripts will not delete your existing projects.

### Download the Latest Azure ML Workbench Installer

| Installer | Operation System  
| ------- | ------- 
| [AmlWorkbenchSetup.exe](https://vienna.blob.core.windows.net/windows/AmlWorkbenchSetup.exe) | Windows 
| [AmlWorkbench.dmg](https://vienna.blob.core.windows.net/osx/AmlWorkbench.dmg) | macOS

### Install Azure ML Workbench
Double-click the downloaded installer `AmlWorkbenchSetup.exe` (on Windows), or `AmlWorkbench.dmg` (on macOS). Follow the on-screen instructions to finish the installation. Azure ML Workbench is now installed in the following directory:
```
# On Windows
C:\Users\<username>\AppData\Local\AmlWorkbench

# On macOS
/Applications/AmlWorkbench.app
 ```

Click on the **Launch Azure ML Workbench** button when the installation process is complete. If you close the installer, you can still find the shortcut to the Workbench on your desktop named **Azure Machine Learning Workbench**. Double-click it to open the app. 

Log in to the Workbench using the same account you used earlier to provision your Azure resources. 

When login has succeeded, Workbench will attempt to find the ML Experimentation accounts you created earlier. It will search within the entire set of Azure subscriptions to which your credentials are attached. If at least one ML Experimentation Account is found, Azure ML Workbench will load it and list the Workspaces and Projects found under that account. After your installation process is complete, you can move on to installing optional components.

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
$ az group create -n <Azure resource group name> mygroup -location <Azure region location>

# Create a new Experimentation account
$ az ml account experimentation create -n <experimentation acct name, 3-24 characters. numbers and lower-case only> -g <resource group>
```
>Note the new Azure Storage Account auto-created will all carry the same name as the Experimentation account name.

After Experimentation account is created, close the current instance of Workbench, then relaunch it. You should be dropped into the newly created Experimentation account.

If you happen to be a member of more than one Experimentation accounts, you can switch among Experimentation accounts by clicking on your account picture at the lower left corner of the app.

It is a good idea to also create a new Workspace where your Projects can live. You can use commands below.

```bash
# Create a new workspace
$ az ml workspace create -n <workspace name> -g <resource group> -a <Experimentation account name>
```

Let's also create resources needed for deploying and managing your models. 
>Note: Docker engine must be installed and running if you want to deploy the web service locally.

```bash
# Create a new Model Management Account
$ az ml account modelmanagement create -l <Azure Region location, e.g. eastus2> -n <your environment name> -g <resource gourp> --sku-instances <number of plans, default is 1> --sku-name <pricing plan for example: S1>

# Create a new Model Management environment for local web service deployment
$ az ml env setup -l <Azure region location, e.g. eastus2> -n <environment name>

# Set the environment to be used
$ az ml env set -n <environment name> -g <resource group>
```
>Note: To deploy your web service to a cluster, use the -c option of the env setup when setting up your environment.

### Check Your Build number
You can find out the build number of the installed app by clicking on the Help menu. Clicking on the build number copies it to your clipboard. You can paste it to emails or support forums to help report issues.

![check version number](media/quick-start-installation/version.png)

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
    * We recommend you [create a Ubuntu-based DSVM (Data Science Virtual Machine) on Azure](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-dsvm-ubuntu-intro), which has Docker pre-installed so it is ready to go.
* Execute in an **HDInsight Spark cluster**
    * You must have SSH access (username and password) to the head node of that HDInsight Spark cluster. Here are the instructions on [provisioning a HDInsight Spark cluster](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-jupyter-spark-sql).
* Deploy a web service to run locally on your machine
    * This requires a local Docker installation. Follow [Docker installation instructions](https://docs.docker.com/engine/installation/) to install Docker on your operation system.
* Deploy a web service to run in an Azure Container Service Kubernetes cluster
    * You can set this up in advance, or use Model Management CLI setup command to create it for you.

#### Special Note on Docker for Windows 
Docker is needed if you want to execute scripts in a local Docker container, or deploy model via a containerized web service locally. Since it is a technology born in Linux, it can be a little challenging to work with on Windows. Make sure you follow these instructions:
- Only Windows 10 is supported for running Docker for Windows.
- Install [Docker for Windows](https://docs.docker.com/docker-for-windows/install/) and have it up and running.
- Make sure your Docker engine is running in [Linux Container mode](https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers).
- Optionally, for better execution performance, share C drive (or whichever drive the system %temp% folder is) in the Docker for Windows configuration.
 
![Share C drive](media/quick-start-installation/share_c.png)

>Note on Windows, Docker container runs inside of a guest Linux VM on the Windows host via Hyper-V. You can see the Linux VM by opening up Hyper-V manager on your Windows OS.

#### Installing, or updating, the Model Management CLIs on Linux
Run the following command from the command line, and follow the prompts:

```bash
wget -q https://raw.githubusercontent.com/Azure/Machine-Learning-Operationalization/master/scripts/amlupdate.sh -O - | sudo bash -
sudo /opt/microsoft/azureml/initial_setup.sh
```

>Note: Log out and log back in to your SSH session for the changes to take effect.

>Note: You can use the previous commands to update an earlier version of the CLIs on the DSVM.

## Next Steps
- Get a quick tour of Azure ML Workbench with [_Quickstart: Classifying Iris Flower Dataset_](quick-start-iris.md).
- Walk through an extensive tutorial [_Classifying Iris_](tutorial-classifying-iris-part-1.md).
- Learn about Azure ML Workbench data preparation capabilities through the [_Preparing Bike Share Dataset_](tutorial-bikeshare-dataprep.md) tutorial.
