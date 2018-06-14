---
title: How to Use MMLSpark Machine Learning | Microsoft Docs
description: Guide how to use MMLSpark library with Azure Machine Learning.
services: machine-learning
author: rastala
ms.author: roastala
manager: jhubbard

ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 01/12/2018

ROBOTS: NOINDEX
---
# How to Use Microsoft Machine Learning Library for Apache Spark

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)]

## Introduction

[Microsoft Machine Learning Library for Apache Spark](https://github.com/Azure/mmlspark) (MMLSpark)  provides tools that let you easily create scalable machine learning models for large datasets. It includes integration of SparkML pipelines with the [Microsoft Cognitive Toolkit
](https://github.com/Microsoft/CNTK) and [OpenCV](http://www.opencv.org/), enabling you to: 
 * Ingress and pre-process image data
 * Featurize images and text using pre-trained deep learning models
 * Train and score classification and regression models using implicit featurization.

## Prerequisites

To step through this how-to guide, you need to:
- [Install Azure Machine Learning Workbench](quickstart-installation.md)
- [Set up Azure HDInsight Spark cluster](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-jupyter-spark-sql)

## Run Your Experiment in Docker Container

Your Azure Machine Learning Workbench is configured to use MMLSpark when you run experiments in Docker container, either locally or in remote VM. This capability allows you to easily debug and experiment with your PySpark models, before running them on scale on a cluster. 

To get started using an example, create a new project, and select "MMLSpark on Adult Census" Gallery example. Select "Docker" as the compute context from the project dashboard, and click "Run." Azure Machine Learning Workbench builds the Docker container to run the PySpark program, and then executes the program.

After the run has completed, you can view the results in run history view of Azure Machine Learning Workbench.

## Install MMLSpark on Azure HDInsight Spark Cluster.

To complete this and the following step, you need to first [create an Azure HDInsight Spark cluster](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-jupyter-spark-sql).

By default, Azure Machine Learning Workbench installs MMLSpark package on your cluster when you run your experiment. You can control this behavior and install other Spark packages by editing a file named _aml_config/spark_dependencies.yml_ in your project folder.

```
# Spark configuration properties.
configuration:
  "spark.app.name": "Azure ML Experiment"
  "spark.yarn.maxAppAttempts": 1

repositories:
  - "https://mmlspark.azureedge.net/maven"
packages:
  - group: "com.microsoft.ml.spark"
    artifact: "mmlspark_2.11"
    version: "0.9.9"
```

You can also install MMLSpark directly on your HDInsight Spark cluster using [Script Action](https://github.com/Azure/mmlspark#hdinsight).

## Set up Azure HDInsight Spark Cluster as Compute Target

Open CLI window from Azure Machine Learning Workbench by going to "File" Menu and click "Open Command Prompt"

In CLI Window, run following commands:

```
az ml computetarget attach cluster --name <myhdi> --address <myhdi-ssh.azurehdinsight.net> --username <sshusername> --password <sshpwd> 
```

```
az ml experiment prepare -c <myhdi>
```

Now the cluster is available as compute target for the project.

## Run experiment on Azure HDInsight Spark cluster.

Go back to the project dashboard of "MMLSpark on Adult Census" example. Select your cluster as the compute target, and click run.

Azure Machine Learning Workbench submits the spark job to the cluster. You can monitor the progress and view the results in run history view.

## Next steps
For information about MMLSpark library, and examples, see [MMLSpark GitHub repository](https://github.com/Azure/mmlspark)

*Apache®, Apache Spark, and Spark® are either registered trademarks or
trademarks of the Apache Software Foundation in the United States and/or other
countries.*
