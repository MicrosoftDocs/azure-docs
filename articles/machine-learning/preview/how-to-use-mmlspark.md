---
title: How to Use MMLSpark Machine Learning | Microsoft Docs
description: Guide how to use MMLSpark library with Azure Machine Learning.
services: machine-learning
author: rastala
ms.author: roastala
manager: jhubbard
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 08/31/2017
---
# How to Use Microsoft Machine Learning Library for Apache Spark

## Introduction

Microsoft Machine Learning Library for Apache Spark (MMLSpark)  provides tools that let you easily create scalable machine learning models for large datasets. It includes integration of SparkML pipelines with [Microsoft Cognitive Toolkit
(CNTK)](https://github.com/Microsoft/CNTK) and [OpenCV](http://www.opencv.org/), enabling you to build deep learning models for text and image datasets.

## Prerequisites
To step through this how-to guide, you need to:
- [Install Azure Machine Learning Workbench](doc-template-how-to.md)
- [Set up Azure HDInsight Spark cluster](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-jupyter-spark-sql)

## Run Your Experiment Locally

Your Azure Machine Learning Workbench is configured to use MMLSpark. To get started, create a new project, and select "MMLSpark on Adult Census" Gallery example.

Select "Docker" as the compute context from the project dashboard, and click "Run." Azure Machine Learning Workbench builds the Docker
container to run the PySpark program, and then executes the program.

After the run has completed, you can view the results in run history view of Azure Machine Learning Workbench.

## Install MMLSpark on Azure HDInsight Spark Cluster.

To complete this and following step, you need to first [create Azure HDInsight Spark cluster](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-jupyter-spark-sql).

To install MMLSpark on your cluster, open the cluster overview in Azure portal. Go to "Script Actions" and "Submit new" in the "Overview" section. In the
"Bash script URI" field, enter following script action URL:
<https://mmlspark.azureedge.net/buildartifacts/0.7/install-mmlspark.sh>. Check "Head" and "Worker" boxes, and submit. The installation should complete within 10 minutes.

For more information about running script actions, see [this
guide](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-customize-cluster-linux#use-a-script-action-during-cluster-creation).


## Set up Azure HDInsight Spark Cluster as Compute Target

Open CLI window from Workbench App by going to "File" and "Open Command Prompt"

In CLI Window, run following command:

```
az ml computecontext attach --name <myhdi> --address <ssh-myhdi.azurehdinsight.net> --username <sshusername> --password <sshpwd> --cluster
```

Now the cluster is available as compute target for the project.

## Run experiment on Azure HDInsight Spark cluster.

Go back to the project dashboard of "MMLSpark on Adult Census" example. Select your cluster as the compute target, and click run.

AML Workbench submits the spark job to the cluster. You can monitor the progress and view the results in run history view.

## Next steps
For information about MMLSpark library, and examples, see [MMLSpark GitHub repository](https://github.com/Azure/mmlspark)

*Apache®, Apache Spark, and Spark® are either registered trademarks or
trademarks of the Apache Software Foundation in the United States and/or other
countries.*
