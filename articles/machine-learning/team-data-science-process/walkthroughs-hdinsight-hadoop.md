---
title: Analytics on Azure HDInsight Hadoop using Hive - Team Data Science Process
description: Examples of the Team Data Science Process that walk through the use of Hive on Azure HDInsight Hadoop to do predictive analytics.
services: machine-learning
author: marktab
manager: marktab
editor: marktab
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 01/10/2020
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---

# HDInsight Hadoop data science walkthroughs using Hive on Azure 

These walkthroughs use Hive with an HDInsight Hadoop cluster to do predictive analytics. They follow the steps outlined in the Team Data Science Process. For an overview of the Team Data Science Process, see [Data Science Process](overview.md). For an introduction to Azure HDInsight, see [Introduction to Azure HDInsight, the Hadoop technology stack, and Hadoop clusters](../../hdinsight/hadoop/apache-hadoop-introduction.md).

Additional data science walkthroughs that execute the Team Data Science Process are grouped by the **platform** that they use. See [Walkthroughs executing the Team Data Science Process](walkthroughs.md) for an itemization of these examples.


## Predict taxi tips using Hive with HDInsight Hadoop

The [Use HDInsight Hadoop clusters](hive-walkthrough.md) walkthrough uses data from New York taxis to predict: 

- Whether a tip is paid 
- The distribution of tip amounts

The scenario is implemented using Hive with an [Azure HDInsight Hadoop cluster](https://azure.microsoft.com/services/hdinsight/). You learn how to store, explore, and feature engineer data from a publicly available NYC taxi trip and fare dataset. You also use Azure Machine Learning to build and deploy the models.

## Predict advertisement clicks using Hive with HDInsight Hadoop

The [Use Azure HDInsight Hadoop Clusters on a 1-TB dataset](hive-criteo-walkthrough.md) walkthrough uses a publicly available [Criteo](https://labs.criteo.com/downloads/download-terabyte-click-logs/) click dataset to predict whether a tip is paid and the expected amounts. The scenario is implemented using Hive with an [Azure HDInsight Hadoop cluster](https://azure.microsoft.com/services/hdinsight/) to store, explore, feature engineer, and down sample data. It uses Azure Machine Learning to build, train, and score a binary classification model predicting whether a user clicks on an advertisement. The walkthrough concludes showing how to publish one of these models as a Web service.


## Next steps

For a discussion of the key components that comprise the Team Data Science Process, see [Team Data Science Process overview](overview.md).

For a discussion of the Team Data Science Process lifecycle that you can use to structure your data science projects, see [Team Data Science Process lifecycle](lifecycle.md). The lifecycle outlines the steps, from start to finish, that projects usually follow when they are executed. 

