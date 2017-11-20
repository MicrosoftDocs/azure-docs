---
title: Monte Carlo in Azure Batch with R | Microsoft Docs
description: Tutorial - Step by step instructions to run a Monte Carlo workload in Azure Batch using the R doAzureParallel package
services: batch
documentationcenter: 
author: v-dotren
manager: timlt
editor: 
tags: 

ms.assetid: 
ms.service: batch
ms.devlang: r
ms.topic: tutorial
ms.tgt_pltfrm: 
ms.workload: 
ms.date: 11/07/2017
ms.author: v-dotren
ms.custom: mvc
---

# Run a parallel R workload in Azure Batch 

You can run your R workloads at scale on Azure Batch using `doAzureParallel`, a lightweight R package that allows you to use Azure Batch directly from your R session. This tutorial details how you can deploy and manage your R jobs in Azure Batch directly within RStudio.  
`doAzureParallel` is built on top of the popular R package, `foreach`. `doAzureParallel` takes each iteration of the `foreach` loop and submits it as an Azure Batch task. 

> [!div class="checklist"]
> * W
> * X
> * Y
> * Z

## Prerequisites
* You must have [R](https://www.r-project.org/) and [RStudio](https://www.rstudio.com/) installed. For this tutorial you can use the open source [RStudio Desktop](https://www.rstudio.com/products/rstudio/#Desktop). [Need links and explanation of any limitations]

* You must have an Azure Batch account and an Azure Storage account. If you need to create these accounts, see the Batch quickstarts for the [Azure portal](quick-create-portal.md) or [Azure CLI](quick-create-cli.md).

## Install doAzureParallel

You can install the `doAzureParallel` package from Github, directly from the console of RStudio. Open RStudio and run the following to download and install the package and its dependencies: 

```
# install the package devtools 
install.packages("devtools") 
  
# install the rAzureBatch and doAzureParallel packages 
devtools::install_github("Azure/rAzureBatch") 
devtools::install_github("Azure/doAzureParallel") 
 
# load the installed library 
library(doAzureParallel) 

```
Installation can take several minutes.

After installation completes, import the `doAzureParallel` package

```
library(doAzureParallel)
```

## Provide access to Batch and storage accounts

Now that you have `doAzureParallel` installed on your machine, you need to provide this package with access to your Azure Batch and storage accounts. 

Start by generating a credentials file in your working directory. You need to populate this file with your Batch and storage account names and keys:

```
generateCredentialsConfig("credentials.json") 
``` 
[Question: Is GitHub auth token required?]

```json
{
  "batchAccount": {
    "name": "batch_account_name",
    "key": "batch_account_key",
    "url": "batch_account_url"
  },
  "storageAccount": {
    "name": "storage_account_name",
    "key": "storage_account_key"
  },
  "githubAuthenticationToken": ""
}

After you enter your credentials into the generated credentials file, save the file. Then run the following command to set your credentials for your current R session: 

``` 
setCredentials("credentials.json") 
```

## Set up your Azure Batch pool 

`doAzureParallel` helps you generate a JSON file to customize the Batch pool (cluster) to use to run parallel R jobs. Start by generating a cluster configuration file in your working directory: 
 
```
generateClusterConfig("cluster.json")
``` 
 
The cluster configuration file includes default settings that you can get started with to create a pool of nodes running Ubuntu Server 16.04 LTS. The default configuration includes 3 dedicated nodes and 3 low priority nodes: 

[Include containerImage and rPackages settings, or tell customer to ignore? This config took a long while, perhaps 10 mins]

```json
{
  "name": "myPoolName",
  "vmSize": "Standard_D2_v2",
  "maxTasksPerNode": 1,
  "poolSize": {
    "dedicatedNodes": {
      "min": 3,
      "max": 3
    },
    "lowPriorityNodes": {
      "min": 3,
      "max": 3
    },
    "autoscaleFormula": "QUEUE"
  },
  "containerImage": "rocker/tidyverse:latest",
  "rPackages": {
    "cran": [],
    "github": [],
    "bioconductor": []
  },
  "commandLine": []
```


If you want to make changes to your cluster configuration, open the file and edit the settings. Then, save the file. 

Now that you have your cluster configuration file set up, create the cluster and register it as the parallel backend for your R session. 

```
# Create your cluster if it does not exist; this takes a few minutes
cluster <- makeCluster("cluster.json") 
  
# Register your parallel backend 
registerDoAzureParallel(cluster) 
  
# Check that the nodes are running 
getDoParWorkers() 
```

 
In this tutorial, you learned about  how to:

> [!div class="checklist"]
> * W
> * X
> * Y
> * Z

Advance to the next tutorial to learn about ....  

> [!div class="nextstepaction"]

