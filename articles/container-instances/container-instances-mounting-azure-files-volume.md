---
title: Mounting an Azure Files volume in Azure Container Instances
description: Learn how to mount an Azure Files volume to persist state with Azure Container Instances
services: container-instances
documentationcenter: ''
author: seanmck
manager: timlt
editor: ''
tags: 
keywords: 

ms.assetid: 
ms.service: container-instances
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/26/2017
ms.author: seanmck
---

# Mounting an Azure file share with Azure Container Instances

By default, Azure Container Instances are stateless. If the container crashes or stops, all of its state is lost. To persist state beyond the lifetime of the container, you must mount a volume from an external store. This article shows how to mount an Azure file share for use with Azure Container Instances.

## Create an Azure file share

Before using an Azure file share with Azure Container Instances, you must create it. Run the following script to create a storage account to host the file share and the share itself. Note that the storage account name must be globally unique, so the script adds a random value to the base string.

```azurecli-interactive
# Change these four parameters
ACI_PERS_STORAGE_ACCOUNT_NAME=mystorageaccount$RANDOM
ACI_PERS_RESOURCE_GROUP=myResourceGroup
ACI_PERS_LOCATION=eastus
ACI_PERS_SHARE_NAME=acishare

# Create the storage account with the parameters
az storage account create -n $ACI_PERS_STORAGE_ACCOUNT_NAME -g $ACI_PERS_RESOURCE_GROUP -l $ACI_PERS_LOCATION --sku Standard_LRS

# Export the connection string as an environment variable, this is used when creating the Azure file share
export AZURE_STORAGE_CONNECTION_STRING=`az storage account show-connection-string -n $ACI_PERS_STORAGE_ACCOUNT_NAME -g $ACI_PERS_RESOURCE_GROUP -o tsv`

# Create the share
az storage share create -n $ACI_PERS_SHARE_NAME
```

## Acquire storage account access details

The mount an Azure file share as a volume in Azure Container Instances, you need three values: the storage account name, the share name, and the storage access key. 

If you used the script above, the storage account name was created with a random value at the end. To query the final string (including the random portion), use the following commands:

```azurecli-interactive
$STORAGE_ACCOUNT=$(az storage account list --resource-group myResourceGroup --query "[?contains(name,'mystorageaccount')].[name]" -o tsv)
echo $STORAGE_ACCOUNT
```

The share name is already known (it is *acishare* in the script above), so all that remains is the storage account key, which can be found using the following command:

```azurecli-interactive
$STORAGE_KEY=$(az storage account keys list --resource-group myResourceGroup --account-name $STORAGE_ACCT --query "[0].value" -o tsv)
echo $STORAGE_KEY
```

## Store storage account access details with Azure key vault

Storage account keys protect access to your data, so we recommend storing them in an Azure key vault. 

Create a key vault with the Azure CLI:

```bash
az keyvault create -n aci-keyvault --enabled-for-template-deployment -g myResourceGroup
```

The `enabled-for-template-deployment` switch allows Azure Resource Manager to pull secrets from your key vault at deployment time.

Store the storage account key as a new secret in the key vault:

```
az keyvault secret set --vault-name aci-keyvault --name azurefilesstoragekey --value $STORAGE_KEY
```

## Mount the volume



## Manage files

## Next steps