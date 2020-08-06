---
title: Install client tools
description: Install azdata, kubectl, Azure CLI, psql, Azure Data Studio (Insiders), and the Arc extension for Azure Data Studio
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Install azdata, kubectl, Azure CLI, psql, Azure Data Studio (Insiders), and the Arc extension for Azure Data Studio

> [!IMPORTANT]
> If you are updating to a new release, please be sure to uninstall `azdata` and extensions first and upgrade to the latest release of Azure Data Studio - Insiders and the Azure Arc extension by following [uninstall/update client tools](uninstall-update-client-tools.md) first, and then follow the instructions below to reinstall `azdata` and extensions.

This document walks you through the steps for installing azdata, kubectl, Azure CLI (az) and Azure Data Studio on your client machine.

- azdata is a command-line tool to deploy, manage and use Azure Arc enabled data services.
- kubectl is a command-line tool for controlling Kubernetes clusters.
- Azure CLI (az) is a command-line tool for managing Azure resources.
- Azure Data Studio is a GUI tool for DBAs, data engineers, data scientists, and data developers.
- psql  is the standard PostgreSQL client/command line application.

## Step 1: Install azdata

### Choose the steps for the Operating System you are using

Depending on your client OS, choose the instructions from below.

#### Windows

[Download msi and install](https://private-repo.microsoft.com/python/azure-arc-data/private-preview-jul-2020-new/msi/azdata-cli-20.1.0.msi)

#### macOS

##### Catalina

```terminal
curl -SL https://private-repo.microsoft.com/python/azure-arc-data/private-preview-jul-2020-new/homebrew-bottle-catalina/azdata-cli-20.1.0.catalina.bottle.tar.gz -o azdata-cli-20.1.0.catalina.bottle.tar.gz
brew install azdata-cli-20.1.0.catalina.bottle.tar.gz
```

##### Mojave

```terminal
curl -SL https://private-repo.microsoft.com/python/azure-arc-data/private-preview-jul-2020-new/homebrew-bottle-mojave/azdata-cli-20.1.0.mojave.bottle.tar.gz -o azdata-cli-20.1.0.mojave.bottle.tar.gz
brew install azdata-cli-20.1.0.mojave.bottle.tar.gz
```

#### Docker

```terminal
docker login azurearcdata.azurecr.io 
```

```terminal
#on Linux/macOS
docker run -it -v ${HOME}/.kube:/root/.kube azurearcdata.azurecr.io/azure-arc-data/azdata:private-preview-jul-2020-new
```

```terminal
#on Windows
docker run -it -v %USERPROFILE%\.kube:/root/.kube azurearcdata.azurecr.io/azure-arc-data/azdata:private-preview-jul-2020-new
```

#### Debian

##### buster - Debian 10

```terminal
apt-get update
apt-get install -y curl apt-transport-https unixodbc libkrb5-dev libssl1.1
curl -SL https://private-repo.microsoft.com/python/azure-arc-data/private-preview-jul-2020-new/debian-buster/azdata-cli_20.1.0-1~buster_all.deb -o azdata-cli_20.1.0-1~buster_all.deb
dpkg -i azdata-cli_20.1.0-1~buster_all.deb
apt-get -f install
```

##### stretch - Debian 9

```terminal
apt-get update
apt-get install -y curl apt-transport-https unixodbc libkrb5-dev
curl -SL https://private-repo.microsoft.com/python/azure-arc-data/private-preview-jul-2020-new/debian-stretch/azdata-cli_20.1.0-1~stretch_all.deb -o azdata-cli_20.1.0-1~stretch_all.deb
dpkg -i azdata-cli_20.1.0-1~stretch_all.deb
apt-get -f install
```

##### jessie - Debian 8

```terminal
apt-get update
apt-get install -y curl apt-transport-https unixodbc
curl -SL https://private-repo.microsoft.com/python/azure-arc-data/private-preview-jul-2020-new/debian-jessie/azdata-cli_20.1.0-1~jessie_all.deb -o azdata-cli_20.1.0-1~jessie_all.deb
dpkg -i azdata-cli_20.1.0-1~jessie_all.deb
apt-get -f install
```

#### Ubuntu

##### focal - Ubuntu 20.04

```terminal
apt-get update
apt-get install -y curl apt-transport-https unixodbc libkrb5-dev libssl1.1
curl -SL https://private-repo.microsoft.com/python/azure-arc-data/private-preview-jul-2020-new/ubuntu-bionic/azdata-cli_20.1.0-1~focal_all.deb -o azdata-cli_20.1.0-1~focal_all.deb
dpkg -i azdata-cli_20.1.0-1~focal_all.deb
apt-get -f install
```

##### bionic - Ubuntu 18.04

```terminal
apt-get update
apt-get install -y curl apt-transport-https unixodbc libkrb5-dev libssl1.1
curl -SL https://private-repo.microsoft.com/python/azure-arc-data/private-preview-jul-2020-new/ubuntu-bionic/azdata-cli_20.1.0-1~bionic_all.deb -o azdata-cli_20.1.0-1~bionic_all.deb
dpkg -i azdata-cli_20.1.0-1~bionic_all.deb
apt-get -f install
```

##### xenial - Ubuntu 16.04

```terminal
apt-get update
apt-get install -y curl apt-transport-https unixodbc libkrb5-dev
curl -SL https://private-repo.microsoft.com/python/azure-arc-data/private-preview-jul-2020-new/ubuntu-xenial/azdata-cli_20.1.0-1~xenial_all.deb -o azdata-cli_20.1.0-1~xenial_all.deb
dpkg -i azdata-cli_20.1.0-1~xenial_all.deb
apt-get -f install
```

#### CentoS

##### CentOS 7

```terminal
yum update
yum install curl epel-release -y
curl -SL https://private-repo.microsoft.com/python/azure-arc-data/private-preview-jul-2020-new/rpm/azdata-cli-20.1.0-1.el7.x86_64.rpm -o azdata-cli-20.1.0-1.el7.x86_64.rpm
yum localinstall azdata-cli-20.1.0-1.el7.x86_64.rpm -y
```

##### CentOS 8

```terminal
yum update
yum install curl -y
curl -SL https://private-repo.microsoft.com/python/azure-arc-data/private-preview-jul-2020-new/rpm/azdata-cli-20.1.0-1.el7.x86_64.rpm -o azdata-cli-20.1.0-1.el7.x86_64.rpm
yum localinstall azdata-cli-20.1.0-1.el7.x86_64.rpm -y
```

#### RHEL

##### RHEL7

```terminal
yum update
yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm -y
curl -SL https://private-repo.microsoft.com/python/azure-arc-data/private-preview-jul-2020-new/rpm/azdata-cli-20.1.0-1.el7.x86_64.rpm -o azdata-cli-20.1.0-1.el7.x86_64.rpm
yum localinstall azdata-cli-20.1.0-1.el7.x86_64.rpm -y
```

##### RHEL 8

```terminal
yum update
yum install curl -y
curl -SL https://private-repo.microsoft.com/python/azure-arc-data/private-preview-jul-2020-new/rpm/azdata-cli-20.1.0-1.el7.x86_64.rpm -o azdata-cli-20.1.0-1.el7.x86_64.rpm
yum localinstall azdata-cli-20.1.0-1.el7.x86_64.rpm -y
```

## Step 2: Verify azdata is installed

```terminal
azdata
azdata --version
```

> The version of azdata for the July release is 20.1.0.   Note that this is NOT the same as the 20.1.0 version of azdata that was released publicly for SQL Server big data clusters earlier in July.  We will converge on a single version of azdata, but for now please ensure you install azdata using the hyperlinks/instructions provided above.

## Step 3: Install kubectl

-------
Once you have installed azdata, you need to install kubectl and make sure the current config points to your existing Kubernetes cluster.

Go here to install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

> [!NOTE]
>  If you are using OpenShift you will also want to have the oc CLI tool installed.

## Step 5: Install Azure CLI

-------
Follow these steps to [install the Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) on your client machine

Once installed, set the cloud environment and login

```terminal
az cloud set --name AzureCloud
az login
```

## Step 6: Create a Kubernetes config file if you do not already have one

-------

You may already have a Kubernetes config file if you have been using an existing Kubernetes cluster.  If you do not already have one you can create a new one.  Consult the documentation for your Kubernetes distribution or service to learn how to get the Kubernetes config file to authenticate to your cluster.

If you are using AKS, you can use 'az aks get-credentials' command .

If you are using EKS, you can use 'aws eks update-kubeconfig' command .

If you are using OpenShift you can install the oc CLI by following these commands.

```terminal
cd ~
wget https://mirror.openshift.com/pub/openshift-v4/clients/oc/4.2/linux/oc.tar.gz
tar -xvf oc.tar.gz
chmod +x oc
mv oc /usr/local/bin
oc status
```

## Step 7: Verify your connection to Kubernetes

-------

```terminal
kubectl version
kubectl get pods -A
```

## Step 8: Install Azure Data Studio and Arc extension and log into Azure

### Install Azure Data Studio (Insiders)

> [!NOTE]
> It's always a good idea to make sure you have the latest Azure Data Studio - Insiders build installed.  If you see a little blue dot on the cog in the lower left of Azure Data Studio, there is a new version of Azure Data Studio available for you.

[Install Azure Data Studio (Insiders)](https://github.com/microsoft/azuredatastudio#try-out-the-latest-insiders-build-from-main)

### Uninstall old Azure Arc Deployment extension

In previous releases, the **Azure Arc deployment** extension was used to add the Azure Arc-related options to the Deployment wizard in ADS. Going forward, we have merged this into a single **Azure Arc** extension that will contain the deployment experiences as well as other features such as the management dashboards.

To prevent conflicts, first uninstall the **Azure Arc deployment** extension if you have it installed. To determine if it is currently installed, go to the Extensions viewlet in the left sidebar and search for *Arc*. If the extension is displayed with a button that says *Uninstall*, then click Uninstall and wait for it to complete.

### Download and Install the Azure Arc extension to Azure Data Studio

- Launch Azure Data Studio
![alt text](/assets/adslaunch.png)
- Download the [Azure Arc Extension VSIX](https://sqlopsextensions.blob.core.windows.net/extensions/arc/arc-0.1.0.vsix)
- File -> Install Extension from VSIX Package
- Select the VSIX you just downloaded and wait for it to finish
- Restart Azure Data Studio

### Login in with your Azure account

- Add Azure account
![alt text](/assets/addazure.png)
- Click on add an account
![alt text](/assets/addaccount.png)
- Choose Azure account
![alt text](/assets/chooseaccount.png)
- Verify that your Azure account was added successfully
![alt text](/assets/verify.png)

## Step 9: Install psql (optional)

If you are deploying Azure Database for Postgres instances to your Arc setup you may want to install psql, the standard client/command line application for PostgreSQL.
To do so, if your client machine is running the Ubuntu operating system (for example if you are using the sample environment described in Readme.md) run the following command:

```terminal
sudo apt-get install postgresql-client-10
```

## Next steps

Now [deploy the Azure Arc data controller](002-create-data-controller.md)
