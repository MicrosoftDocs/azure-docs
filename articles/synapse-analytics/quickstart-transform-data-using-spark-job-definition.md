---
title: "Quickstart: Transform data using Apache Spark job definition"
description:  This tutorial provides step-by-step instructions for using Azure Synapse Analytics to transform data with Apache Spark job definition.
author: djpmsft
ms.author: daperlov
ms.reviewer: makromer
ms.service: synapse-analytics
ms.subservice: pipeline
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 13/05/2021
---

# Quickstart: Transform data using Apache Spark job definition.

In this quickstart, you'll use Azure Synapse Analytics to create a pipeline that transforms data from an Azure Data Lake Storage Gen2 (ADLS Gen2) source to an ADLS Gen2 sink using Apache Spark job definition. The configuration pattern in this quickstart can be expanded upon when transforming data using Apache Spark job definition.

In this quickstart, you do the following steps:

> [!div class="checklist"]
> * Create a pipeline with an Apache Spark job definition in Azure Synapse Analytics.
> * Test run the pipeline.
> * Monitor an Apache Spark job definition activity.

## Prerequisites

* **Azure subscription**: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* **Azure Synapse workspace**: Create a Synapse workspace using the Azure portal following the instructions in [Quickstart: Create a Synapse workspace](quickstart-create-workspace.md).
* **Apache Spark job definition**: Create a Apache Spark job definition in the Synapse workspace following the instructions in [Tutorial: Create Apache Spark job definition in Synapse Studio](https://docs.microsoft.com/en-us/azure/synapse-analytics/spark/apache-spark-job-definitions).
* **Azure storage account**: You use ADLS storage as *source* and *sink* data stores. If you don't have a storage account, see [Create an Azure storage account](../storage/common/storage-account-create.md) for steps to create one.

    The file that we are transforming in this tutorial is MoviesDB.csv, which can be found [here](https://raw.githubusercontent.com/djpmsft/adf-ready-demo/master/moviesDB.csv). To retrieve the file from GitHub, copy the contents to a text editor of your choice to save locally as a .csv file. To upload the file to your storage account, see [Upload blobs with the Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md). The examples will be referencing a container named 'sample-data'.

### Navigate to the Synapse Studio

After your Azure Synapse workspace is created, you have two ways to open Synapse Studio:

* Open your Synapse workspace in the [Azure portal](https://ms.portal.azure.com/#home). Select **Open** on the Open Synapse Studio card under Getting started.
* Open [Azure Synapse Analytics](https://web.azuresynapse.net/) and sign in to your workspace.

In this quickstart, we use the workspace named "sampletest" as an example. It will automatically navigate you to the Synapse Studio home page.

![synapse studio home page](media/quickstart-transform-data-using-spark-job-definition/synapse-studio-home.png)

## Create a pipeline with an Apache Spark job definition

A pipeline contains the logical flow for an execution of a set of activities. In this section, you'll create a pipeline that contains a Apache Spark job definition activity.

1. Go to the **Integrate** tab. Select on the plus icon next to the pipelines header and select Pipeline.

     ![Create a new pipeline](media/doc-common-process/new-pipeline.png)

2. In the **Properties** settings page of the pipeline, enter **demo** for **Name**.

3. Under *Synapse* in the *Activities* pane, drag **Spark job definition** onto the pipeline canvas.

     ![drag spark job definition](media/quickstart-transform-data-using-spark-job-definition/drag-spark-job-definition.png)


## Set Apache Spark job definition canvas

Once you create your Apache Spark job definition, you'll be automatically sent to the Spark job definition canvas.

### General settings

1. Select the spark job definition module in the canvas.

2. In General tab, enter **sample** for **Name**.

3. (Option) You can also enter a description.

4. Timeout: Maximum amount of time an activity can run. Default is 7 days, which is also the maximum amount of time allowed. Format is in D.HH:MM:SS.

5. Retry: Maximum number of retry attempts.

6. Retry interval: The number of seconds between each retry attempt.

7. Secure output: When checked, output from the activity will not be captured in logging.

8. Sercure input: When checked, input from the activity will not be captured in logging.

     ![drag spark job definition](media/quickstart-transform-data-using-spark-job-definition/spark-job-definition-general.png)

### Settings tab 

On this panel, you can reference to the Spark job definition to run.

* Expand the Saprk job definition list, you can choose an existing Apache Spark job definition.

* You can also create a new Apache Spark job definition by clicking the new button to reference the spark job definition to be run.

* Command line arguments: Optional arguments to the job. This will override the command line arguments defined by the Apache Spark job definition. For more setup information see [Tutorial: Create Apache Spark job definition in Synapse Studio](https://docs.microsoft.com/en-us/azure/synapse-analytics/spark/apache-spark-job-definitions)


## Next steps

Advance to the following articles to learn about Azure Synapse Analytics support:

> [!div class="nextstepaction"]
> [Pipeline and activities](../data-factory/concepts-pipelines-activities.md?bc=%2fazure%2fsynapse-analytics%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fsynapse-analytics%2ftoc.json)
> [Mapping data flow overview](../data-factory/concepts-data-flow-overview.md?bc=%2fazure%2fsynapse-analytics%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fsynapse-analytics%2ftoc.json)
> [Data flow expression language](../data-factory/data-flow-expression-functions.md?bc=%2fazure%2fsynapse-analytics%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fsynapse-analytics%2ftoc.json)