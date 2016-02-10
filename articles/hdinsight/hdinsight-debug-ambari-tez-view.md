<properties
pageTitle="Use Ambari Tez View with HDInsight | Azure"
description="Learn how to use the Ambari Tez view to debug Tez jobs on HDInsight"
services="hdinsight"
documentationCenter=""
authors="Blackmist"
manager="paulettm"
editor="cgronlun"/>

<tags
ms.service="hdinsight"
ms.devlang=""
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="big-data"
ms.date="Use Ambari Tez View with HDInsight | Azure"
ms.author="larryfr"/>

# Use Ambari Views to debug Tez Jobs on HDInsight

In this document, you will learn how to use the Tez View on the Ambari Web UI to understand and debug Tez jobs submitted to a Linux-based HDInsight cluster.

##Prerequisites

* A Linux-based HDInsight cluster. For steps on creating a new cluster, see [TBD].

* A modern web browser.

##Understanding Tez

Tez is an execution engine that can be used to run Hive queries. It is the default for Hive on Linux-based HDInsight clusters. When a Hive query is submitted, Tez converts the query into a Directed Acyclic Graph (DAG.) The DAG describes the order of execution of the actions performed by the script.

Individual items within a DAG are called vertices, and execute a piece of the query. The actual execution of the work described by a vertex is handled as a task, which may be distributed across multiple nodes in the cluster.

[tbd graphic]

##Using Tez View

[note: ran query around 9:45, took until TBD to show up]

1. In a web browser, navigate to https://CLUSTERNAME.azurehdinsight.net, where __CLUSTERNAME__ is the name of your HDInsight cluster.

2. From the menu at the top of the page, select the __Views__ icon. This looks like a series of squares. In the dropdown that appears, select __Tez view__. 

3. When the Tez view loads, you will see a list of DAGs that have been ran on the cluster. The default view includes the Dag Name, Id, Submitter, Status, Start Time, End Time, Duration, Application ID, and Queue. More columns can be added using the gear icon at the right of the page.

    > [AZURE.NOTE] You will only see entries on this page if you have ran jobs that use Tez. Many simple queries can be resolved without using Tez, and so will not result in an entry in this table.