---
title: (DEPRECATED) File share for Azure DC/OS cluster
description: Create and mount a file share to a DC/OS cluster in Azure Container Service
services: container-service
author: julienstroheker
manager: dcaro

ms.service: container-service
ms.topic: tutorial
ms.date: 06/07/2017
ms.author: juliens
ms.custom: mvc
---

# (DEPRECATED) Create and mount a file share to a DC/OS cluster

[!INCLUDE [ACS deprecation](../../../includes/container-service-deprecation.md)]

This tutorial details how to create a file share in Azure and mount it on each agent and master of the DC/OS cluster. Setting up a file share makes it easier to share files across your cluster such as configuration, access, logs, and more. The following tasks are completed in this tutorial:

> [!div class="checklist"]
> * Create an Azure storage account
> * Create a file share
> * Mount the share in the DC/OS cluster

You need an ACS DC/OS cluster to complete the steps in this tutorial. If needed, [this script sample](./../kubernetes/scripts/container-service-cli-deploy-dcos.md) can create one for you.

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). 

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Create a file share on Microsoft Azure

Before using an Azure file share with an ACS DC/OS cluster, the storage account and file share must be created. Run the following script to create the storage and file share. Update the parameters with those from your environment.

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

Next, the file share needs to be mounted on every virtual machine inside your cluster. This task is completed using the cifs tool/protocol. The mount operation can be completed manually on each node of the cluster, or by running a script against each node in the cluster.

In this example, two scripts are run, one to mount the Azure file share, and a second to run this script on each node of the DC/OS cluster.

First, the Azure storage account name, and access key are needed. Run the following commands to get this information. Take note of each, these values are used in a later step.

Storage account name:

```azurecli-interactive
STORAGE_ACCT=$(az storage account list --resource-group $DCOS_PERS_RESOURCE_GROUP --query "[?contains(name, '$DCOS_PERS_STORAGE_ACCOUNT_NAME')].[name]" -o tsv)
echo $STORAGE_ACCT
```

Storage account access key:

```azurecli-interactive
az storage account keys list --resource-group $DCOS_PERS_RESOURCE_GROUP --account-name $STORAGE_ACCT --query "[0].value" -o tsv
```

Next, get the FQDN of the DC/OS master and store it in a variable.

```azurecli-interactive
FQDN=$(az acs list --resource-group $DCOS_PERS_RESOURCE_GROUP --query "[0].masterProfile.fqdn" --output tsv)
```

Copy your private key to the master node. This key is needed to create an ssh connection with all nodes in the cluster. Update the user name if a non-default value was used when creating the cluster. 

```azurecli-interactive
scp ~/.ssh/id_rsa azureuser@$FQDN:~/.ssh
```

Create an SSH connection with the master (or the first master) of your DC/OS-based cluster. Update the user name if a non-default value was used when creating the cluster.

```azurecli-interactive
ssh azureuser@$FQDN
```

Create a file named **cifsMount.sh**, and copy the following contents into it. 

This script is used to mount the Azure file share. Update the `STORAGE_ACCT_NAME` and `ACCESS_KEY` variables with the information collected earlier.

```azurecli-interactive
#!/bin/bash

# Azure storage account name and access key
SHARE_NAME=dcosshare
STORAGE_ACCT_NAME=mystorageaccount
ACCESS_KEY=mystorageaccountKey

# Install the cifs utils, should be already installed
sudo apt-get update && sudo apt-get -y install cifs-utils

# Create the local folder that will contain our share
if [ ! -d "/mnt/share/$SHARE_NAME" ]; then sudo mkdir -p "/mnt/share/$SHARE_NAME" ; fi

# Mount the share under the previous local folder created
sudo mount -t cifs //$STORAGE_ACCT_NAME.file.core.windows.net/$SHARE_NAME /mnt/share/$SHARE_NAME -o vers=3.0,username=$STORAGE_ACCT_NAME,password=$ACCESS_KEY,dir_mode=0777,file_mode=0777
```
Create a second file named **getNodesRunScript.sh** and copy the following contents into the file. 

This script discovers all cluster nodes, and then runs the **cifsMount.sh** script to mount the file share on each.

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
sh ./getNodesRunScript.sh
```  

The file share is now accessible at `/mnt/share/dcosshare` on each node of the cluster.

## Next steps

In this tutorial an Azure file share was made available to a DC/OS cluster using the steps:

> [!div class="checklist"]
> * Create an Azure storage account
> * Create a file share
> * Mount the share in the DC/OS cluster

Advance to the next tutorial to learn about integrating an Azure Container Registry with DC/OS in Azure.  

> [!div class="nextstepaction"]
> [Load balance applications](container-service-dcos-acr.md)
