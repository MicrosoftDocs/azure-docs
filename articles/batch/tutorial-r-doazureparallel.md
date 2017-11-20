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

# Run an Azure Batch in parallel

You can run your R workloads at scale on Azure Batch using `doAzureParallel`, a lightweight R package that allows you to use Azure Batch directly from your R session. This tutorial details how you can deploy and manage your R jobs in Azure Batch directly within RStudio.  
`doAzureParallel` is built on top of the popular R package, `foreach`. At the most basic level, `doAzureParallel` takes each iteration of the `foreach` loop and submits it as an Azure Batch task. 

> [!div class="checklist"]
> * W
> * X
> * Y
> * Z

## Prerequisites
* You must have [R](https://www.r-project.org/) and [RStudio](https://www.rstudio.com/) installed. For this tutorial you can use the open source [RStudio Desktop](https://www.rstudio.com/products/rstudio/#Desktop). [Need links and explanation of any limitations]

* You must have an Azure Batch account and an Azure Storage account. If you need to create these accounts, see the Batch quickstarts for the [Azure portal](quick-create-portal.md) or [Azure CLI](quick-create-cli.md).

## Install doAzureParallel

You can install `doAzureParallel` from Github, directly from the console of RStudio. Open RStudio and run the following to download and install the package and its dependencies: 

```
# install the package devtools 
install.packages("devtools") 
  
# install the doAzureParallel and rAzureBatch package 
devtools::install_github("Azure/rAzureBatch") 
devtools::install_github("Azure/doAzureParallel") 
 
# load the installed library 
library(doAzureParallel) 


```


In this tutorial, you learned about  how to:

> [!div class="checklist"]
> * W
> * X
> * Y
> * Z

Advance to the next tutorial to learn about ....  

> [!div class="nextstepaction"]

