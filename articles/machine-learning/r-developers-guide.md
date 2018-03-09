---
title: R Developer's Guide to Azure | Microsoft Docs
description: an overview of how R developers can run their code in the Azure cloud platform
services: machine-learning,storage
documentationcenter: ''
author: AnalyticJeremy
manager: cgronlun
editor: cgronlun

ms.assetid:
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: R
ms.topic: article
ms.date: 03/09/2017
ms.author: jepeach
---
# R Developer's Guide to Azure
<img src="media/r-developers-guide/logo_r.svg" alt="R logo" align="right" width="200" />

Many data scientists dealing with ever-increasing volumes of data are looking for ways to harness the power of the cloud for their
analyses.  This article provides an overview of the various ways that data scientists can leverage their existing skills with
the [R programming language](https://www.r-project.org) in Azure.

Azure is very friendly to R developers and offers many services that support the language.  Let's examine the various options and
the most compelling scenarios for each one.

## Best Bets

### Data Science Virtual Machine
The [Data Science Virtual Machine](https://docs.microsoft.com/en-us/azure/machine-learning/data-science-virtual-machine/overview)
(DSVM) is a customized VM image on Microsoft’s Azure cloud built specifically for doing data science. It has many popular data
science tools, including [Microsoft R Open](https://mran.microsoft.com/open/), [RStudio Desktop](https://www.rstudio.com/products/rstudio/#Desktop),
and [RStudio Server](https://www.rstudio.com/products/rstudio/#Server).  The DSVM can be provisioned with either Windows or Linux
as the operating system.

If you wanted to get started with R in the cloud quickly and easily, this is your best bet.  The environment will be very familiar
to anyone who has worked with R on a local workstation.  However, instead of using local resources, the R environment runs on a VM
in the cloud.

The DSVM can be particularly useful to small teams of R developers.  Instead of investing in powerful workstations for each developer
and requiring team members to synchronize on which versions of the various software packages they will use, each developer can
simply spin up an instance of the DSVM whenever needed.

In addition to being used as a workstation, the DSVM can also be used an elastically scalable compute platform for R projects.
Using the <code>[AzureDSVM](https://github.com/Azure/AzureDSVM)</code> R package, you can programatically control the creation
and deletion of DSVM instances.  You can form the instances into a cluster and deploy a distributed analyses to be performed
in the cloud.  This entire process can be controlled by R code running on your local workstation.

To learn more about the DSVM, consult the ["Introduction to Azure Data Science Virtual Machine for Linux and Windows."](https://docs.microsoft.com/en-us/azure/machine-learning/data-science-virtual-machine/overview)

### R Server on Azure HDInsight
[Microsoft R Server](https://docs.microsoft.com/en-us/azure/hdinsight/r-server/r-server-overview) provides data scientists,
statisticians, and R programmers with on-demand access to scalable, distributed methods of analytics on HDInsight.  This solution
provides the latest capabilities for R-based analytics on datasets of virtually any size, loaded to either Azure Blob or
Data Lake storage.

This is the heavy-weight solution that allows you to scale your R code across a cluster.

### Azure Databricks
Run R in notebooks

## Other Options

### Machine Learning Studio
Run R scripts as part of an AML experiment

https://docs.microsoft.com/en-us/azure/machine-learning/studio/r-quickstart

also this:  https://cran.r-project.org/web/packages/AzureML/vignettes/getting_started.html

### Azure Functions
Go serverless and run R scripts in Azure Functions

### Azure Notebooks

### SQL Database
run R in Azure SQL DB  https://docs.microsoft.com/en-us/sql/advanced-analytics/r/using-r-in-azure-sql-database
(not currently an option... maybe coming in a future preview?)

### Azure Batch
https://azure.microsoft.com/en-us/blog/r-workloads-on-azure-batch/
