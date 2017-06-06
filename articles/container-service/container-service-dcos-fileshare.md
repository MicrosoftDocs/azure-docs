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
ms.date: 06/05/2017
ms.author: juliens

---
# Create and mount a file share to a DC/OS cluster
This tutorial details how to create a file share in Azure and mount it on each agent and master of the DC/OS cluster. Setting up a file share makes it easier to share files across your cluster such as configuration, access, logs, and more. The following task are completed in this tutorial:

> [!div class="checklist"]
> * Create an Azure storage account
> * Create a file share
> * Mount the share in the DC/OS cluster

You will need an ACS DC/OS cluster to complete the steps in this tutorial. If needed, [this script sample](./scripts/container-service-cli-deploy-dcos.md) can create one for you.

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create a file share on Microsoft Azure

Before using an Azure file share with an ACS DC/OS cluster, the storage account and file share must be created. Run the following script to create the storage and file share. Update the parameters to match your environment.

```azurecli-interactive
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

Next, the file share needs to be mounted on every virtual machine inside your cluster. This is completed using the cifs tool/protocol. The mount operation can be completed manually on each node of the cluster, or by running a script from the DC/OS master. This example will demonstrate the scripted configuration. 

First, get the FQDN of the DC/OS master and store it in a variable.

```azurecli-interactive
FQDN=$(az acs list --resource-group myResourceGroup --query "[0].masterProfile.fqdn" --output tsv)
```

Copy your private key to the master node. This will be needed to create an ssh connection with all nodes in the cluster. Note, update the user name if a non-default value was used when creating the cluster. 

```azurecli-interactive
scp ~/.ssh/id_rsa azureuser@$FQDN:~/.ssh
```

Create an SSH connection with the master (or the first master) of your DC/OS-based cluster. Note, update the user name if a non-default value was used when creating the cluster.

```azurecli-interactive
ssh azureuser@$FQDN
```

Create a file named **cifsMount.sh** and copy the following contents into it. This script will be used to mount the Azure file share in each node of the cluster. 

Update the variables with the proper storage account name and storage access key. These can be found in the Azure portal.

```azurecli-interactive
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

Run the script to mount the Azure file share on the DC/OS master node.

```azurecli-interactive
sh ./cifsMount.sh
```

Create a second file named **mountShares.sh** and copy the following contents into the file. This script will discover all cluster nodes and run the script to mount the Azure file share on them.

```azurecli-interactive
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

Run the script to mount the Azure file share on all nodes of the cluster.

```azurecli-interactive
sh ./mountShares.sh
```  

The file share is now accessable at `/mnt/share/dcosshare` on each node of the cluster.

## Next steps

In this tutorial an Azure file share was made available to a DC/OS cluster using the steps:

> [!div class="checklist"]
> * Create an Azure storage account
> * Create a file share
> * Mount the share in the DC/OS cluster

Advance to the next tutorial to learn about load balancing applications in an ACS DC/OS cluster.  

> [!div class="nextstepaction"]
> [Load balance applications](./container-service-load-balancing.md)