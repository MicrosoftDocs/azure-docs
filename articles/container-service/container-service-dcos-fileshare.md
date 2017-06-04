---
title: File share for Azure DC/OS cluster | Microsoft Docs
description: Create and mount a file share to a DC/OS cluster in Azure Container Service
services: container-service
documentationcenter: ''
author: julienstroheker
manager: dcaro
editor: ''
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Mesos, Azure, FileShare, cifs

ms.assetid:
ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/02/2017
ms.author: juliens

---
# Create and mount a file share to a DC/OS cluster
In this article, we'll explore how to create a file share on Azure and mount it on each agent and master of the DC/OS cluster. Setting up a file share makes it easier to share files across your cluster such as configuration, access, logs, and more. The following task are completed in this tutorial:

> [!div class="checklist"]
> * Create storage account and file share
> * Mount the share in the DC/OS cluster

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

You will need an ACS DC/OS cluster to complete the steps in this tutorial. If needed, [this script sample](./scripts/container-service-cli-deploy-dcos.md) can create one for you.

## Create a file share on Microsoft Azure

Run the following script to create an Azure storage account and Azure file share. This file share will be mounted in each node of the DC/OS cluster.

```azurecli
# Change these four parameters
DCOS_PERS_STORAGE_ACCOUNT_NAME=mystorageaccount$RANDOM
DCOS_PERS_RESOURCE_GROUP=myResourceGroup
DCOS_PERS_LOCATION=eastus
DCOS_PERS_SHARE_NAME=dcosshare

# Create the storage account with the parameters
az storage account create -n $DCOS_PERS_STORAGE_ACCOUNT_NAME -g $DCOS_PERS_RESOURCE_GROUP -l $DCOS_PERS_LOCATION --sku Standard_LRS

# Export the connection string as an environment variable, this is used when creating the Azure file share
export AZURE_STORAGE_CONNECTION_STRING=`az storage account show-connection-string -n $DCOS_PERS_STORAGE_ACCOUNT_NAME -g $DCOS_PERS_RESOURCE_GROUP -o tsv`

# Create the share
az storage share create -n $DCOS_PERS_SHARE_NAME
```

## Mount the share in your cluster

Next, we need to mount this share on every virtual machine inside your cluster using the cifs tool/protocol. This can be completed manually on each node of the cluster, or by running a script from the DC/OS master. This example will demonstrate the scripted configuration. 

First, get the FQDN of the DC/OS master and store it in a variable.

```azurecli
FQDN=$(az acs list --resource-group myResourceGroup --query "[0].masterProfile.fqdn" --output tsz)
```

Copy your private key to the master node. This will be needed to create an ssh connection with all nodes in the cluster. 

```bash
scp ~/.ssh/id_rsa azureuser@$FQDN
```

Create an SSH connection with the master (or the first master) of your DC/OS-based cluster.

```bash
ssh userName@$FQDN
```

Create a file named **cifsMount.sh** and copy the following contents into it. This script will be used to mount the Azure file share in each node of the cluster. Update the variables with the correct information.   

```bash
#!/bin/bash

# Azure storage account name and access key
STORAGE_ACCT_NAME=mystorageaccount29940
ACCESS_KEY=3DogvPcYxEaa/OPyGw5lVJgmIxQzYPsgkjhowBFUKpBxMUHZl0GUcPPLthIEkYDqzSBgVgL01wFE9K3cUxhPYQ==

# Install the cifs utils, should be already installed
sudo apt-get update && sudo apt-get -y install cifs-utils

# Create the local folder that will contain our share
if [ ! -d "/mnt/share/dcosshare" ]; then sudo mkdir -p "/mnt/share/dcosshare" ; fi

# Mount the share under the previous local folder created
sudo mount -t cifs //$STORAGE_ACCT_NAME.file.core.windows.net/dcosshare /mnt/share/dcosshare -o vers=3.0,username=$STORAGE_ACCT_NAME,password=$ACCESS_KEY,dir_mode=0777,file_mode=0777
```

Create a second file named **mountShares.sh** and copy the following contents into the file. This script will discover all cluster nodes and run the script to mount the Azure file share on them. Update the variables with the correct information.   

```bash
#!/bin/bash

# Install jq used for the next command
sudo apt-get install jq -y

# Get the IP address of each node using the mesos API and store it inside a file called nodes
curl http://leader.mesos:1050/system/health/v1/nodes | jq '.nodes[].host_ip' | sed 's/\"//g' | sed '/172/d' > nodes

# From the previous file created, run our script to mount our share on each node
cat nodes | while read line
do
  ssh `whoami`@$line -o StrictHostKeyChecking=no < ./cifsMount.sh
  done
```  

### Run the scripts

Execute the **mountShares.sh** file with the following command: `sh mountShares.sh`.

> [!NOTE] 
> This method is not recommended for scenarios that require high IOPS, but it is very useful to share documents and information across the cluster.
>

## Next steps

In this tutorial an Azure file share was made available to a DC/OS cluster using the steps:

> [!div class="checklist"]
> * Create storage account and file share
> * Mount the share in the DC/OS cluster

Advance to the next tutorial to learn about load balancing applications in an ACS DC/OS cluster.  

> [!div class="nextstepaction"]
> [Load balance applications](./container-service-load-balancing.md)