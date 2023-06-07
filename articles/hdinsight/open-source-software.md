---
title: Open-source software support in Azure HDInsight
description: Microsoft Azure provides a general level of support for open-source technologies.
ms.service: hdinsight
ms.topic: how-to
ms.custom: seoapr2020
ms.date: 02/18/2023
---

# Open-source software support in Azure HDInsight

The Microsoft Azure HDInsight service uses an environment of open-source technologies formed around Apache Hadoop. Microsoft Azure provides a general level of support for open-source technologies. For more information, see the **Support Scope** section of [Azure Support FAQs](https://azure.microsoft.com/support/faq/). The HDInsight service provides an additional level of support for built-in components.

## Components

Two types of open-source components are available in the HDInsight service:

### Built-in components

These components are preinstalled on HDInsight clusters and provide core functionality of the cluster. The following components belong to this category:

* [Apache Hadoop YARN](https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html) Resource Manager.
* The Hive query language [HiveQL](https://cwiki.apache.org/confluence/display/Hive/LanguageManual).

A full list of cluster components is available in [What are the Apache Hadoop components and versions available with HDInsight?](hdinsight-component-versioning.md)

### Custom components

As a user of the cluster, you can install or use in your workload any component available in the community or created by you.

> [!WARNING]  
> Components provided with the HDInsight cluster are fully supported. Microsoft Support helps to isolate and resolve issues related to these components.
>
> Custom components receive commercially reasonable support to help you further troubleshoot the issue. Microsoft Support might be able to resolve the issue. Or they might ask you to engage available channels for the open-source technologies where deep expertise for that technology is found. Many community sites can be used. Examples are [Microsoft Q&A question page for HDInsight](/answers/topics/azure-hdinsight.html) and [Stack Overflow](https://stackoverflow.com).
>
> Apache projects also have project sites on the [Apache website](https://apache.org). An example is [Hadoop](https://hadoop.apache.org/).

## Component usage

The HDInsight service provides several ways to use custom components. The same level of support applies, no matter how a component is used or installed on the cluster. The following table describes the most common ways that custom components are used on HDInsight clusters:

|Usage |Description |
|---|---|
|Job submission|Hadoop or other types of jobs that execute or use custom components can be submitted to the cluster.|
|Cluster customization|During cluster creation, you can specify additional settings and custom components that are installed on the cluster nodes.|
|Samples|For popular custom components, Microsoft and others might provide samples of how these components can be used on HDInsight clusters. These samples are provided without support.|

## Next steps

* [Customize Azure HDInsight clusters by using script actions](./hdinsight-hadoop-customize-cluster-linux.md)
* [Develop script action scripts for HDInsight](hdinsight-hadoop-script-actions-linux.md)
* [Safely manage Python environment on Azure HDInsight using Script Action](./spark/apache-spark-python-package-installation.md)
