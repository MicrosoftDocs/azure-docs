---
title: Parallel R simulation with Azure Batch | Microsoft Docs
description: Tutorial - Step by step instructions to run a Monte Carlo simulation in Azure Batch using the R doAzureParallel package and RStudio
services: batch
documentationcenter: 
author: jiata
manager: jkabat
editor: 
tags: 

ms.assetid: 
ms.service: batch
ms.devlang: r
ms.topic: tutorial
ms.tgt_pltfrm: 
ms.workload: 
ms.date: 11/28/2017
ms.author: danlep
ms.custom: mvc
---

# Run a parallel R simulation with Azure Batch 

Run your parallel R workloads at scale using `doAzureParallel`, a lightweight R package that allows you to use Azure Batch directly from your R session. `doAzureParallel` is built on top of the popular `foreach` R package. `doAzureParallel` takes each iteration of the `foreach` loop and submits it as an Azure Batch task.

This tutorial details how you can deploy a Batch pool and run a parallel R job in Azure Batch directly within RStudio. You learn how to:
 

> [!div class="checklist"]
> * Install `doAzureParallel` and configure it to access your Batch and storage accounts
> * Create a Batch pool as a parallel backend
> * Run a parallel R simulation on the pool


## Prerequisites
[*Q: Any version limitations in the following?*]
* An installed [R](https://www.r-project.org/) distribution, such as [Microsoft R Open](https://mran.microsoft.com/open)

* [RStudio](https://www.rstudio.com/). For this tutorial, you can use the open source [RStudio Desktop](https://www.rstudio.com/products/rstudio/#Desktop). 

* An Azure Batch account and an Azure Storage account. To create these accounts, see the Batch quickstarts using the [Azure portal](quick-create-portal.md) or [Azure CLI](quick-create-cli.md). 

## Install doAzureParallel

Install the `doAzureParallel` [Github package](http://www.github.com/Azure/doAzureParallel) directly from the RStudio console. The following commands download and install the package and its dependencies in your current R session: 

```R
# Install the devtools package  
install.packages("devtools") 
  
# Install the rAzureBatch and doAzureParallel packages 
devtools::install_github("Azure/rAzureBatch") 
devtools::install_github("Azure/doAzureParallel") 
 
# Import the doAzureParallel library 
library(doAzureParallel) 
```
Installation can take several minutes.



## Provide access to Batch and storage accounts

The `doAzureParallel` package needs to access your Azure Batch and storage accounts. 

Start by generating a credentials file in your working directory: 

```R
generateCredentialsConfig("credentials.json") 
``` 

You populate this file with your Batch and storage account names and keys. Get the necessary information from the Azure portal, or use Azure CLI or Azure PowerShell commands. For example, to get the account keys, use the [az batch account keys list](/cli/azure/batch/account/keys#az_batch_account_keys_list) and [az storage account keys list](/cli/azure/storage/account/keys##az_storage_account_keys_list) commands. 

When complete, the credentials file looks similar to the following: 

[*Question: Is githubAuthenticationToken setting required? Ignore?*]

```json
{
  "batchAccount": {
    "name": "mybatchaccount",
    "key": "xxxxxxxxxxxxxxxxE+yXrRvJAqT9BlXwwo1CwF+SwAYOxxxxxxxxxxxxxxxx43pXi/gdiATkvbpLRl3x14pcEQ==",
    "url": "https://mybatchaccount.westeurope.batch.azure.com"
  },
  "storageAccount": {
    "name": "mystorageaccount",
    "key": "xxxxxxxxxxxxxxxxy4/xxxxxxxxxxxxxxxxfwpbIC5aAWA8wDu+AFXZB827Mt9lybZB1nUcQbQiUrkPtilK5BQ=="
  },
  "githubAuthenticationToken": ""
}
```

Save the file. Then, run the following command to set the credentials for your current R session: 

```R
setCredentials("credentials.json") 
```

## Set up your Azure Batch pool 

`doAzureParallel` has a function to generate an Azure Batch pool (cluster) to run parallel R jobs. The nodes run an Ubuntu-based [Azure Data Science Virtual Machine](../machine-learning/data-science-virtual-machine/overview.md), which has Microsoft R Open and popular R packages pre-installed. You can view or customize certain cluster settings, such as the number and size of the nodes. To generate a cluster configuration JSON file in your working directory: 
 
```R
generateClusterConfig("cluster.json")
``` 
 
The default configuration includes 3 dedicated nodes and 3 [low priority](batch-low-pri-vms.md) nodes: 

[*Questions: Necessary to include containerImage and Packages settings, or tell customer to ignore? This cluster deployment took a long while, perhaps 10 mins. Perhaps choose smaller node numbers?*]

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
  "containerImage": "",
  "rPackages": {
    "cran": [],
    "github": [],
    "bioconductor": []
  },
  "commandLine": []
```


If you want to make changes to the cluster configuration, edit the settings. Then, save the file. 

Now create the cluster and register it as the parallel backend for your R session. 

```R
# Create your cluster if it does not exist; this takes a few minutes
cluster <- makeCluster("cluster.json") 
  
# Register your parallel backend 
registerDoAzureParallel(cluster) 
  
# Check that the nodes are running 
getDoParWorkers() 
```

 
## Foreach loop with the %dopar% keyword 
Now that your cluster is created, you are ready to run your `foreach` loop with your registered parallel backend (Azure Batch pool). To automatically use your parallel backend, substitute the `%dopar%` keyword for `%do%` when running your `foreach` loop. 

The following example shows how to run the loop with a fictitious function called *myParallelAlgorithm*:

``` 
results <- foreach(i = 1:100) %dopar% { 
myParallelAlgorithm(i) 
} 
```

## Example: Monte Carlo simulation

As an example, run a Monte Carlo financial simulation using `doAzureParallel`. This example is a simplified version of predicting a stock price after 5 years by simulating a large number of different outcomes of a single stock.

Suppose that the stock of Contoso Corporation gains on average 1.001 times its opening price each day, but has a volatility (standard deviation) of 0.01. Given a starting price of $100, use a Monte Carlo pricing simulation to figure out Contoso's stock price after 5 years.

Parameters for the Monte Carlo simulation:

```R
mean_change = 1.001 
volatility = 0.01 
opening_price = 100 
```

To simulate closing prices, define the following function:

```R
getClosingPrice <- function() { 
  days <- 1825 # ~ 5 years 
  movement <- rnorm(days, mean=mean_change, sd=volatility) 
  path <- cumprod(c(opening_price, movement)) 
  closingPrice <- path[days] 
  return(closingPrice) 
} 
```
Simulate 1,000,000 outcomes in Azure. To parallelize the simulation with Batch, run 20 iterations of 50,000 outcomes:

```R
start_s <- Sys.time()  
closingPrices_s <- foreach(i = 1:20, .combine='c') %dopar% { 
  replicate(50000, getClosingPrice()) 
} 
end_s <- Sys.time() 
```

The simulation distributes tasks to the nodes in the Batch pool. You can see the activity in the heat map for the pool in the [Azure portal](https://portal.azure.com). Bo to **Batch accounts** > *myBatchAccount*. Click **Pools** > **myPoolName**. 

![Heat map of pool running parallel R tasks](media/tutorial-r-doazureparallel/pool.png)

After a few minutes, the simulation finishes. The package automatically merges the results and pulls them down from the nodes. Then, you are ready to use the results in your R session. For example, plot the 1,000,000 closing prices in a histogram to show the distribution of outcomes:

```R
hist(closingPrices_s) 
```

Output is similar to the following:

![Distribution of closing prices](media/tutorial-r-doazureparallel/closing-prices.png)

 
How long did the simulation take? Run the following command:

[Q: I saw only about 2x speedup with the dopar versus do, with 20 iterations of 50,000. Expected?
]
```R
difftime(end_s, start_s) 
```
  

## Clean up resources

When no longer needed, you can use the [Azure portal](https://portal.azure.com) to remove the resource group, Batch account, pools, and all related resources. Go to **Resource groups** > *myResourceGroup* and click **Delete resource group**.


In this tutorial, you learned about how to:

> [!div class="checklist"]
> * Install `doAzureParallel` and configure it to access your Batch and storage accounts
> * Create a Batch pool as a parallel backend
> * Run a parallel R simulation on the pool


Advance to the next tutorial to learn about ....  

> [!div class="nextstepaction"]

