---
title: Microsoft Cognitive Toolkit with Apache Spark - Azure HDInsight
description: Learn how a trained Microsoft Cognitive Toolkit deep learning model can be applied to a dataset using the Spark Python API in an Azure HDInsight Spark cluster.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 01/14/2020
---

# Use Microsoft Cognitive Toolkit deep learning model with Azure HDInsight Spark cluster

In this article, you do the following steps.

1. Run a custom script to install [Microsoft Cognitive Toolkit](https://docs.microsoft.com/cognitive-toolkit/) on an Azure HDInsight Spark cluster.

2. Upload a [Jupyter Notebook](https://jupyter.org/) to the [Apache Spark](https://spark.apache.org/) cluster to see how to apply a trained Microsoft Cognitive Toolkit deep learning model to files in an Azure Blob Storage Account using the [Spark Python API (PySpark)](https://spark.apache.org/docs/latest/api/python/index.html)

## Prerequisites

* An Apache Spark cluster on HDInsight. See [Create an Apache Spark cluster](./apache-spark-jupyter-spark-sql-use-portal.md).

* Familiarity with using Jupyter Notebooks with Spark on HDInsight. For more information, see [Load data and run queries with Apache Spark on HDInsight](./apache-spark-load-data-run-query.md).

## How does this solution flow?

This solution is divided between this article and a Jupyter notebook that you upload as part of this article. In this article, you complete the following steps:

* Run a script action on an HDInsight Spark cluster to install Microsoft Cognitive Toolkit and Python packages.
* Upload the Jupyter notebook that runs the solution to the HDInsight Spark cluster.

The following remaining steps are covered in the Jupyter notebook.

* Load sample images into a Spark Resilient Distributed Dataset or RDD.
  * Load modules and define presets.
  * Download the dataset locally on the Spark cluster.
  * Convert the dataset into an RDD.
* Score the images using a trained Cognitive Toolkit model.
  * Download the trained Cognitive Toolkit model to the Spark cluster.
  * Define functions to be used by worker nodes.
  * Score the images on worker nodes.
  * Evaluate model accuracy.

## Install Microsoft Cognitive Toolkit

You can install Microsoft Cognitive Toolkit on a Spark cluster using script action. Script action uses custom scripts to install components on the cluster that aren't available by default. You can use the custom script from the Azure portal, by using HDInsight .NET SDK, or by using Azure PowerShell. You can also use the script to install the toolkit either as part of cluster creation, or after the cluster is up and running.

In this article, we use the portal to install the toolkit, after the cluster has been created. For other ways to run the custom script, see [Customize HDInsight clusters using Script Action](../hdinsight-hadoop-customize-cluster-linux.md).

### Using the Azure portal

For instructions on how to use the Azure portal to run script action, see [Customize HDInsight clusters using Script Action](../hdinsight-hadoop-customize-cluster-linux.md#script-action-during-cluster-creation). Make sure you provide the following inputs to install Microsoft Cognitive Toolkit. Use the following values for your script action:

|Property |Value |
|---|---|
|Script type|- Custom|
|Name| Install MCT|
|Bash script URI|`https://raw.githubusercontent.com/Azure-Samples/hdinsight-pyspark-cntk-integration/master/cntk-install.sh`|
|Node type(s):|Head, Worker|
|Parameters|None|

## Upload the Jupyter notebook to Azure HDInsight Spark cluster

To use the Microsoft Cognitive Toolkit with the Azure HDInsight Spark cluster, you must load the Jupyter notebook **CNTK_model_scoring_on_Spark_walkthrough.ipynb** to the Azure HDInsight Spark cluster. This notebook is available on GitHub at [https://github.com/Azure-Samples/hdinsight-pyspark-cntk-integration](https://github.com/Azure-Samples/hdinsight-pyspark-cntk-integration).

1. Download and unzip [https://github.com/Azure-Samples/hdinsight-pyspark-cntk-integration](https://github.com/Azure-Samples/hdinsight-pyspark-cntk-integration).

1. From a web browser, navigate to `https://CLUSTERNAME.azurehdinsight.net/jupyter`, where `CLUSTERNAME` is the name of your cluster.

1. From the Jupyter notebook, select **Upload** in the top-right corner and then navigate to the download and select file `CNTK_model_scoring_on_Spark_walkthrough.ipynb`.

    ![Upload Jupyter notebook to Azure HDInsight Spark cluster](./media/apache-spark-microsoft-cognitive-toolkit/hdinsight-microsoft-cognitive-toolkit-load-jupyter-notebook.png "Upload Jupyter notebook to Azure HDInsight Spark cluster")

1. Select **Upload** again.

1. After the notebook is uploaded, click the name of the notebook and then follow the instructions in the notebook itself on how to load the data set and perform the article.

## See also

* [Overview: Apache Spark on Azure HDInsight](apache-spark-overview.md)

### Scenarios

* [Apache Spark with BI: Perform interactive data analysis using Spark in HDInsight with BI tools](apache-spark-use-bi-tools.md)
* [Apache Spark with Machine Learning: Use Spark in HDInsight for analyzing building temperature using HVAC data](apache-spark-ipython-notebook-machine-learning.md)
* [Apache Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](apache-spark-machine-learning-mllib-ipython.md)
* [Website log analysis using Apache Spark in HDInsight](apache-spark-custom-library-website-log-analysis.md)
* [Application Insight telemetry data analysis using Apache Spark in HDInsight](apache-spark-analyze-application-insight-logs.md)

### Create and run applications

* [Create a standalone application using Scala](apache-spark-create-standalone-application.md)
* [Run jobs remotely on an Apache Spark cluster using Apache Livy](apache-spark-livy-rest-interface.md)

### Tools and extensions

* [Use HDInsight Tools Plugin for IntelliJ IDEA to create and submit Spark Scala applications](apache-spark-intellij-tool-plugin.md)
* [Use HDInsight Tools Plugin for IntelliJ IDEA to debug Apache Spark applications remotely](apache-spark-intellij-tool-plugin-debug-jobs-remotely.md)
* [Use Apache Zeppelin notebooks with an Apache Spark cluster on HDInsight](apache-spark-zeppelin-notebook.md)
* [Kernels available for Jupyter notebook in Apache Spark cluster for HDInsight](apache-spark-jupyter-notebook-kernels.md)
* [Use external packages with Jupyter notebooks](apache-spark-jupyter-notebook-use-external-packages.md)
* [Install Jupyter on your computer and connect to an HDInsight Spark cluster](apache-spark-jupyter-notebook-install-locally.md)

### Manage resources

* [Manage resources for the Apache Spark cluster in Azure HDInsight](apache-spark-resource-manager.md)
* [Track and debug jobs running on an Apache Spark cluster in HDInsight](apache-spark-job-debugging.md)
