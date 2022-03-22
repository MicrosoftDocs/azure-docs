---
title: Machine learning overview - Azure HDInsight
description: Overview of big data machine learning options for clusters in Azure HDInsight.
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 12/06/2019
---

# Machine learning on HDInsight

HDInsight enables machine learning with big data, providing the ability to obtain valuable insight from large amounts (petabytes, or even exabytes) of structured, unstructured, and fast-moving data. There are several machine learning options  in HDInsight:  SparkML and Apache Spark MLlib, Apache Hive, and the Microsoft Cognitive Toolkit.

## SparkML and MLlib

[HDInsight Spark](spark/apache-spark-overview.md) is an Azure-hosted offering of [Apache Spark](https://spark.apache.org/), a unified, open source, parallel data processing framework supporting in-memory processing to boost big data analytics. The Spark processing engine is built for speed, ease of use, and sophisticated analytics. Spark's in-memory distributed computation capabilities make it a good choice for the iterative algorithms used in machine learning and graph computations. There are two scalable machine learning libraries that bring algorithmic modeling capabilities to this distributed environment: MLlib and SparkML. MLlib contains the original API built on top of RDDs. SparkML is a newer package that provides a higher-level API built on top of DataFrames for constructing ML pipelines. SparkML doesn't yet support all of the  features of MLlib, but is replacing MLlib as Spark's standard machine learning library.

The Microsoft Machine Learning library for Apache Spark is [MMLSpark](https://github.com/Azure/mmlspark). This library is designed to make data scientists more productive on Spark, increase the rate of experimentation, and leverage cutting-edge machine learning techniques, including deep learning, on very large datasets. MMLSpark provides a layer on top of SparkML's low-level APIs when building scalable ML models, such as indexing strings, coercing data into a layout expected by machine learning algorithms, and assembling feature vectors. The MMLSpark library simplifies these and other common tasks for building models in PySpark.

## Azure Machine Learning and Apache Hive

Azure Machine Learning provides tools to model predictive analytics, and a fully managed service you can use to deploy your predictive models as ready-to-consume web services. Azure Machine Learning is a  complete predictive analytics solution in the cloud that you can use to create, test, operationalize, and manage predictive models. Select from a large algorithm library, use a web-based studio for building models, and easily deploy your model as a web service.

:::image type="content" source="./media/hdinsight-machine-learning-overview/azure-machine-learning.png" alt-text="Microsoft Azure machine learning overview" border="false":::

Create features for data in an HDInsight Hadoop cluster using [Hive queries](/azure/architecture/data-science-process/create-features-hive). *Feature engineering* attempts to increase the predictive power of learning algorithms by creating features from raw data that facilitate the learning process. You can run HiveQL queries from Azure Machine Learning Studio (classic), and access data processed in Hive and stored in blob storage, by using the [Import Data module](../machine-learning/classic/import-data.md).

## Microsoft Cognitive Toolkit

[Deep learning](https://www.microsoft.com/en-us/research/group/dltc/) is a branch of machine learning that uses neural networks, inspired by the biological processes of the human brain. Many researchers see deep learning as a promising approach for enhancing artificial intelligence. Examples of deep learning are spoken language translators, image recognition systems, and machine reasoning.

To help advance its own work in deep learning, Microsoft  developed the free, easy-to-use, open-source [Microsoft Cognitive Toolkit](https://www.microsoft.com/en-us/cognitive-toolkit/). This toolkit is being used  by a wide variety of Microsoft products, by companies worldwide with a need to deploy deep learning at scale, and by students interested in the latest algorithms and techniques.

## See also

### Scenarios

* [Apache Spark with Machine Learning: Use Spark in HDInsight for analyzing building temperature using HVAC data](spark/apache-spark-ipython-notebook-machine-learning.md)
* [Apache Spark with Machine Learning: Use Spark in HDInsight to predict food inspection results](spark/apache-spark-machine-learning-mllib-ipython.md)
* [Generate movie recommendations with Apache Mahout](hadoop/apache-hadoop-mahout-linux-mac.md)
* [Apache Hive and Azure Machine Learning](/azure/architecture/data-science-process/create-features-hive)
* [Apache Hive and Azure Machine Learning end-to-end](/azure/architecture/data-science-process/hive-walkthrough)
* [Machine learning with Apache Spark on HDInsight](/azure/architecture/data-science-process/spark-overview)

### Deep learning resources

* [Use Microsoft Cognitive Toolkit deep learning model with Azure HDInsight Spark cluster](spark/apache-spark-microsoft-cognitive-toolkit.md)
* [Deep Learning and AI frameworks on the Data Science Virtual Machine (DSVM)](../machine-learning/data-science-virtual-machine/dsvm-tools-deep-learning-frameworks.md)
