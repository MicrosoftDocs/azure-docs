---
title: R developer's guide to Azure - R programming | Microsoft Docs
description: This article provides an overview of the various ways that data scientists can leverage their existing skills with the R programming language in Azure. Azure offers many services that R developers can leverage to extend their data science workloads into the cloud.
services: machine-learning
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
ms.date: 09/12/2018
ms.author: jepeach
---
# R developer's guide to Azure
<img src="media/r-developers-guide/logo_r.svg" alt="R logo" align="right" width="200" />

Many data scientists dealing with ever-increasing volumes of data are looking for ways to harness the power of cloud
computing for their analyses.  This article provides an overview of the various ways that data scientists can leverage
their existing skills with the [R programming language](https://www.r-project.org) in Azure.

Microsoft has fully embraced the R programming language as a first-class tool for data scientists.  By providing many
different options for R developers to run their code in Azure, the company is enabling data scientists to extend their data science workloads into the cloud when tackling large-scale projects.

Let's examine the various options and the most compelling scenarios for each one.

## Azure services with R language support
This article covers the following Azure services that support the R language:

|Service                                                          |Description                                                                       |
|-----------------------------------------------------------------|----------------------------------------------------------------------------------|
|[Data Science Virtual Machine](#data-science-virtual-machine)    |a customized VM to use as a data science workstation or as a custom compute target|
|[ML Services on HDInsight](#ml-services-on-hdinsight)            |cluster-based system for running R analyses on large datasets across many nodes   |
|[Azure Databricks](#azure-databricks)                            |collaborative Spark environment that supports R and other languages               |
|[Azure Machine Learning Studio](#azure-machine-learning-studio)  |run custom R scripts in Azure's machine learning experiments                      |
|[Azure Batch](#azure-batch)                                      |offers a variety options for economically running R code across many nodes in a cluster|
|[Azure Notebooks](#azure-notebooks)                              |a no-cost (but limited) cloud-based version of Jupyter notebooks                  |
|[Azure SQL Database](#azure-sql-database)                        |run R scripts inside of the SQL Server database engine                            |

## Data Science Virtual Machine
The [Data Science Virtual Machine](https://docs.microsoft.com/azure/machine-learning/data-science-virtual-machine/overview)
(DSVM) is a customized VM image on Microsoft’s Azure cloud platform built specifically for doing data science. It has
many popular data science tools, including:
* [Microsoft R Open](https://mran.microsoft.com/open/)
* [Microsoft Machine Learning Server](https://docs.microsoft.com/machine-learning-server/what-is-machine-learning-server)
* [RStudio Desktop](https://www.rstudio.com/products/rstudio/#Desktop)
* [RStudio Server](https://www.rstudio.com/products/rstudio/#Server)

The DSVM can be provisioned with either Windows or Linux as the operating system.  You can use the DSVM in two
different ways:  as an interactive workstation or as a compute platform for a custom cluster.

### As a workstation
If you want to get started with R in the cloud quickly and easily, this is your best bet.  The environment will be
familiar to anyone who has worked with R on a local workstation.  However, instead of using local resources, the R
environment runs on a VM in the cloud.  If your data is already stored in Azure, this has the added benefit of allowing
your R scripts to run "closer to the data." Instead of transferring the data across the Internet, the data can be
accessed over Azure's internal network, which provides much faster access times.

The DSVM can be particularly useful to small teams of R developers.  Instead of investing in powerful workstations for
each developer and requiring team members to synchronize on which versions of the various software packages they will
use, each developer can spin up an instance of the DSVM whenever needed.

### As a compute platform
In addition to being used as a workstation, the DSVM is also used as an elastically scalable compute platform for R
projects.  Using the <code>[AzureDSVM](https://github.com/Azure/AzureDSVM)</code> R package, you can programmatically
control the creation and deletion of DSVM instances.  You can form the instances into a cluster and deploy a distributed
analysis to be performed in the cloud.  This entire process can be controlled by R code running on your local
workstation.

To learn more about the DSVM, consult the
["Introduction to Azure Data Science Virtual Machine for Linux and Windows."](https://docs.microsoft.com/azure/machine-learning/data-science-virtual-machine/overview)

## ML Services on HDInsight
[Microsoft ML Services](https://docs.microsoft.com/azure/hdinsight/r-server/r-server-overview) provide data
scientists, statisticians, and R programmers with on-demand access to scalable, distributed methods of analytics on
HDInsight.  This solution provides the latest capabilities for R-based analytics on datasets of virtually any size,
loaded to either Azure Blob or Data Lake storage.

This is an enterprise-grade solution that allows you to scale your R code across a cluster.  By leveraging functions in
Microsoft's
<code>[RevoScaleR](https://docs.microsoft.com/machine-learning-server/r-reference/revoscaler/revoscaler)</code>
package, your R scripts on HDInsight can run data processing functions in parallel across many nodes in a cluster.  This
allows R to crunch data on a much larger scale than is possible with single-threaded R running on a workstation.

This ability to scale makes ML Services on HDInsight a great option for R developers with massive data sets.  It provides a
flexible and scalable platform for running your R scripts in the cloud.

For a walk-through on creating an ML Services cluster, see the
["Get started with ML Services on Azure HDInsight"](https://docs.microsoft.com/azure/hdinsight/r-server/r-server-get-started)
article.

## Azure Databricks
[Azure Databricks](https://azure.microsoft.com/services/databricks/) is an Apache Spark-based analytics platform
optimized for the Microsoft Azure cloud services platform.  Designed with the founders of Apache Spark, Databricks is
integrated with Azure to provide one-click setup, streamlined workflows, and an interactive workspace that enables
collaboration between data scientists, data engineers, and business analysts.

The collaboration in Databricks is enabled by the platform's notebook system.  Users can create, share, and edit
notebooks with other users of the systems.  These notebooks allow users to write code that executes against Spark
clusters managed in the Databricks environment.  These notebooks fully support R and give users access to Spark through
both the `SparkR` and `sparklyr` packages.

Since Databricks is built on Spark and has a strong focus on collaboration, the platform is often used by teams of data
scientists that work together on complex analyses of large data sets.  Because the notebooks in Databricks support other
languages in addition to R, it is especially useful for teams where analysts use different languages for their primary
work.

The article ["What is Azure Databricks?"](https://docs.microsoft.com/azure/azure-databricks/what-is-azure-databricks)
can provide more details about the platform and help you get started.

## Azure Machine Learning Studio
[Azure Machine Learning Studio](https://azure.microsoft.com/services/machine-learning-studio/) is a collaborative,
drag-and-drop tool you can use to build, test, and deploy predictive analytics solutions in the cloud.  It enables
emerging data scientists to create and deploy machine learning models without the need to write much code.

ML Studio supports both R and Python.  You can use R with ML Studio in two ways.

### Custom R scripts in your experiments
First, you can extend the data manipulation and machine learning capabilities of ML Studio by writing custom R scripts.
Although ML Studio includes a wide variety of modules for preparing and analyzing data, it cannot match the capabilities
of a mature language like R.  Therefore, the service was designed to allow you to introduce your own custom R scripts in
cases where the provided modules do not meet your needs.

To leverage this capability, drag and drop an "Execute R Script" module into your experiment.  Then use the code editor
in the "Properties" pane to write a new R script or paste an existing script.  Within the script, you can reference
external R packages.  You can use the script to manipulate data or to train complex ML models that are not part of the
standard ML Studio model library.

For a thorough introduction on using R within ML Studio experiments, check out the
["Quickstart tutorial for the R programming language for Azure Machine Learning."](https://docs.microsoft.com/azure/machine-learning/studio/r-quickstart)

### Create, manage, and deploy experiments from your local R environment
The other way that you can use R with ML Studio is to use the
<code>[AzureML](https://cran.r-project.org/web/packages/AzureML/vignettes/getting_started.html)</code> package to
monitor and control the experimentation process with the R programming environment.  This package, which is maintained
by Microsoft, allows you to upload and download datasets to and from Azure ML, to interrogate experiments, to publish R
functions as Azure ML web services, and to run R data through existing web services and retrieve the output.

This package makes it much easier to use Azure ML as a scalable deployment platform for your R code.  Instead of
clicking and dragging in the UI, you can automate the entire deployment process using tools you already know.

## Azure Batch
For large-scale R jobs, you can use [Azure Batch](https://azure.microsoft.com/services/batch/).  This service
provides cloud-scale job scheduling and compute management so you can scale your R workload across tens, hundreds, or
thousands of virtual machines.  Since it is a generalized computing platform, there a few options for running R jobs on
Azure Batch.

One option is to use Microsoft's <code>[doAzureParallel](https://github.com/Azure/doAzureParallel)</code> package.  This
R package is a parallel backend for the `foreach` package.  It allows each iteration of the `foreach` loop to run in
parallel on a node within the Azure Batch cluster.  For an introduction to the package, please read the
["doAzureParallel: Take advantage of Azure’s flexible compute directly from your R session"](https://azure.microsoft.com/blog/doazureparallel/)
blog post.

Another option for running an R script in Azure Batch is to bundle your code with "RScript.exe" as a Batch App in the Azure
portal.  For a detailed walk-through, consult
["R Workloads on Azure Batch."](https://azure.microsoft.com/blog/r-workloads-on-azure-batch/)

A third option is to use the [Azure Distributed Data Engineering Toolkit](https://github.com/Azure/aztk) (AZTK),
which allows you to provision on-demand Spark clusters using Docker containers in Azure Batch.  This provides an
economical way to run Spark jobs in Azure.  By using
[SparklyR with AZTK](https://github.com/Azure/aztk/wiki/SparklyR-on-Azure-with-AZTK), your R scripts can be scaled out
in the cloud easily and economically.

## Azure Notebooks
[Azure Notebooks](https://notebooks.azure.com) is a low-cost, low-friction method for R developers who prefer working
with notebooks to bring their code to Azure.  It is a free service for anyone to develop and run code in their browser
using [Jupyter](https://jupyter.org/), which is an open-source project that enables combing markdown prose, executable
code, and graphics onto a single canvas.

While Azure Notebooks is a viable option for small-scale projects, it has some limitations that make it inappropriate
for large-scale data science projects.  Currently, the service limits each notebook's process to 4 GB of memory and data
sets can only be 1 GB.  However, for publishing smaller analyses, this is an easy, no-cost option.

## Azure SQL Database
[Azure SQL Database](https://azure.microsoft.com/services/sql-database/) is Microsoft's intelligent, fully managed
relational cloud database service.  It allows you to use the full power of SQL Server without any hassle of setting up
the infrastructure.  This includes
[Machine Learning Services](https://docs.microsoft.com/sql/advanced-analytics/what-is-sql-server-machine-learning?view=sql-server-2017),
which is one of the more recent additions to SQL Service.

This feature offers an embedded, predictive analytics and data science engine that can execute R code within a SQL
Server database as stored procedures, as T-SQL scripts containing R statements, or as R code containing T-SQL.  Instead
of extracting data from the database and loading it into the R environment, you load your R code directly into the
database and let it run right alongside the data.

While Machine Learning Services has been part of on-premises SQL Server since 2016, it is relatively new to Azure SQL
Database.  It is currently in
[limited preview](https://docs.microsoft.com/sql/advanced-analytics/what-s-new-in-sql-server-machine-learning-services?view=sql-server-2017#azure-sql-database-roadmap)
but will continue to evolve.


### Next steps
* [Running your R code on Azure with mrsdeploy](http://blog.revolutionanalytics.com/2017/03/running-your-r-code-azure.html)
* [Machine Learning Server in the Cloud](https://docs.microsoft.com/machine-learning-server/install/machine-learning-server-in-the-cloud)
* [Additional Resources for Machine Learning Server and Microsoft R](https://docs.microsoft.com/machine-learning-server/resources-more)
* [R on Azure](https://github.com/yueguoguo/r-on-azure) - an overview of packages, tools, and case studies for using R with Azure

---

<sub>The R logo is &copy; 2016 The R Foundation and is used under the terms of the
[Creative Commons Attribution-ShareAlike 4.0 International license](https://creativecommons.org/licenses/by-sa/4.0/).</sub>
