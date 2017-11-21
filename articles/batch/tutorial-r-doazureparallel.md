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
* An installed [R](https://www.r-project.org/) distribution, such as [Microsoft R Open](https://mran.microsoft.com/open), and [RStudio](https://www.rstudio.com/). For this tutorial, you can use the open source [RStudio Desktop](https://www.rstudio.com/products/rstudio/#Desktop). [Need links and explanation of any limitations]

* An Azure Batch account and an Azure Storage account. If you need to create these accounts, see the Batch quickstarts using the [Azure portal](quick-create-portal.md) or [Azure CLI](quick-create-cli.md). 

## Install doAzureParallel

You can install the `doAzureParallel` package from Github, directly from the console of RStudio. Open RStudio and run the following to download and install the package and its dependencies: 

```
# Install the devtools package  
install.packages("devtools") 
  
# Install the rAzureBatch and doAzureParallel packages 
devtools::install_github("Azure/rAzureBatch") 
devtools::install_github("Azure/doAzureParallel") 
 
# Import the installed library 
library(doAzureParallel) 
```
Installation can take several minutes.



## Provide access to Batch and storage accounts

Now that you have `doAzureParallel` installed on your machine, you need to provide this package with access to your Azure Batch and storage accounts. 

Start by generating a credentials file in your working directory. You populate this file with your Batch and storage account names and keys:

```
generateCredentialsConfig("credentials.json") 
``` 
[Question: Is GitHub auth token required? Ignore?]

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

[Include containerImage and rPackages settings, or tell customer to ignore? This config took a long while, perhaps 10 mins. Perhaps choose smaller node numbers?]

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

 
## Foreach loop with the %dopar% keyword 
Now that your cluster is created, you are ready to run your `foreach` loop with your registered parallel backend (an Azure Batch pool). Add the `%dopar%` keyworkdwhen running your `foreach` loop to automatically leverage your parallel backend. For example, with a fictitious algorithm called *myParallelAlgorithm*:

``` 
results <- foreach(i = 1:100) %dopar% { 
myParallelAlgorithm(i) 
} 
```

## Example: Monte Carlo simulation

The following is an example of running a Monte Carlo financial simulation using `doAzureParallel`. This example is a simplified version of predicting a stock price after 5 years by simulating a large number of different outcomes of a single stock.

Suppose that the stock of Contoso Corp. gains on average 1.001 times its opening price each day, but has a volatility (standard deviation) of 0.01. Given a starting price of $100, we can use a Monte Carlo pricing simulation to figure out Contoso's stock price after 5 years.

Parameters for the Monte Carlo simulation:

```
mean_change = 1.001 
volatility = 0.01 
opening_price = 100 
```

Define a new function to simulate closing prices:

``` 
getClosingPrice <- function() { 
  days <- 1825 # ~ 5 years 
  movement <- rnorm(days, mean=mean_change, sd=volatility) 
  path <- cumprod(c(opening_price, movement)) 
  closingPrice <- path[days] 
  return(closingPrice) 
} 
```
Simulate 10,000 outcomes in Azure. To parallelize this with Batch, run 10 iterations of 1,000 outcomes:

```
start_s <- Sys.time()  
closingPrices_s <- foreach(i = 1:10, .combine='c') %do% { 
  replicate(1000, getClosingPrice()) 
} 
end_s <- Sys.time() 
```


Plot the 10,000 closing prices in a histogram to show the distribution of outcomes:

```
hist(closingPrices_s) 
```

Output is similar to the following:

![Distribution of closing prices](media/tutorial-r-doazureparallel/closing-prices.png)

 
How long did it take? In this case, the simulation took a few seconds:

```
difftime(end_s, start_s) 
```
  
The estimated runtime for 10 million closing prices (linear approximation):

```
1000 * difftime(end_s, start_s, unit = "min") 
```
 
In this tutorial, you learned about  how to:

> [!div class="checklist"]
> * W
> * X
> * Y
> * Z

Advance to the next tutorial to learn about ....  

> [!div class="nextstepaction"]

