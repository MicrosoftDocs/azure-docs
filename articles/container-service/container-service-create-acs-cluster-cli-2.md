---
title: Deploy Azure Container Service cluster with CLI | Microsoft Docs
description: Deploy an Azure Container Service cluster using Azure CLI 2.0 Preview
services: container-service
documentationcenter: ''
author: sauryadas
manager: timlt
editor: ''
tags: acs, azure-container-service
keywords: ''

ms.assetid: 8da267e8-2aeb-4c24-9a7a-65bdca3a82d6
ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/01/2016
ms.author: saudas

---
# Using the Azure CLI 2.0 Preview to create an Azure Container Service cluster
You can install the Azure CLI 2.0 Preview using the instructions provided [here](https://github.com/Azure/azure-cli).

## Log in to your account
```azurecli
az login 
```
You need to go to this [link](https://login.microsoftonline.com/common/oauth2/deviceauth) to authenticate with the device code provided in the CLI.
![type command](media/container-service-create-acs-cluster-cli-2/login.png)
![browser](media/container-service-create-acs-cluster-cli-2/login-browser.png)

## Create a resource group
```azurecli
az resource group create -n acsrg1 -l "westus"
```
![Image resource group create](media/container-service-create-acs-cluster-cli-2/rg-create.png)

## List of available acs CLI commands
```azurecli
az acs -h
```
![ACS command usage](media/container-service-create-acs-cluster-cli-2/acs-command-usage-help.png)

## Create a container service cluster

### acs create usage in the CLI

```azurecli
az acs create -h
```
The name of the container service, the resource group created in the previous step, and a unique DNS name are mandatory. 
Other inputs are set to default values (see the following help screen) unless overwritten using their respective switches.
![Image ACS create help](media/container-service-create-acs-cluster-cli-2/create-help.png)

### Quick acs create using defaults 

If you do not have an SSH key, use the second command. This second create command with the --generate-ssh-keys switch creates one for you.

```azurecli
az acs create -n acs-cluster -g acsrg1 --dns-name-prefix applink
```

```azurecli
az acs create -n acs-cluster -g acsrg1 -dns-name-prefix applink --generate-ssh-keys
```
After you type the preceding command, wait for about 10 minutes for the cluster to be created.

## List container service clusters in a resource group
```azurecli
az acs list -g acsrg1 --output table
```
![Image ACS list](media/container-service-create-acs-cluster-cli-2/acs-list.png)

## Display details of a container service cluster
```azurecli
az acs show -g acsrg1 -n containerservice-acsrg1 --output list
```
![Image ACS list](media/container-service-create-acs-cluster-cli-2/acs-show.png)

## Scale the container service cluster
Both scaling in and scaling out are allowed. The parameter new-agent-count is the new number of agents in the ACS cluster.

```azurecli
az acs update -g acsrg1 -n containerservice-acsrg1 --agent-count 4
```
![Image ACS scale](media/container-service-create-acs-cluster-cli-2/acs-scale.png)

## Delete a container service cluster
```azurecli
az acs delete -g acsrg1 -n acs-cluster 
```

> [!NOTE]
> This delete command does not delete all resources (network and storage) created while creating the container service. To delete all resources, it is recommended that a single container service cluster be created per resource group and then the resource group itself be deleted when the cluster is no longer required. Deleting the resource group ensures that all related resources are deleted and you are not charged for them.

