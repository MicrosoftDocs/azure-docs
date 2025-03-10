---
title: Use a Windows PC with Hadoop on HDInsight - Azure
description: Work from a Windows PC in Hadoop on HDInsight. Manage and query clusters with PowerShell, Visual Studio, and Linux tools. Develop big data solutions with .NET.
ms.service: azure-hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive, devx-track-dotnet, linux-related-content
ms.date: 09/06/2024
---

# Work in the Apache Hadoop ecosystem on HDInsight from a Windows PC

Learn about development and management options on the Windows PC for working in the Apache Hadoop ecosystem on HDInsight.

HDInsight is based on Apache Hadoop and Hadoop components, open-source technologies developed on Linux. HDInsight version 3.4 and higher uses the Ubuntu Linux distribution as the underlying OS for the cluster. However, you can work with HDInsight from a Windows client or Windows development environment.

## Use PowerShell for deployment and management tasks

Azure PowerShell is a scripting environment that you can use to control and automate deployment and management tasks in HDInsight from Windows.

Examples of tasks you can do with PowerShell:

* [Create clusters using PowerShell](hdinsight-hadoop-create-linux-clusters-azure-powershell.md).
* [Run Apache Hive queries using PowerShell](hadoop/apache-hadoop-use-hive-powershell.md).
* [Manage clusters with PowerShell](hdinsight-administer-use-powershell.md).

Follow steps to [install and configure Azure PowerShell](/powershell/azure/install-azure-powershell) to get the latest version.

## Utilities you can run in a browser

The following utilities have a web UI that runs in a browser:
* **[Azure Cloud Shell](../cloud-shell/overview.md)** is an interactive, command-line shell that runs in your browser and from within the Azure portal.

* **[Apache Ambari Web UI](hdinsight-hadoop-manage-ambari.md)** is a management and monitoring utility available in the Azure portal that can be used to manage different kinds of jobs, such as:
    * [Use Apache Ambari with the REST API](hdinsight-hadoop-manage-ambari-rest-api.md)
    * [Apache Hive View in Apache Ambari](hadoop/apache-hadoop-use-hive-ambari-view.md)
    * [Apache Tez View in Apache Ambari](./index.yml)

Before you go to the following examples, [install and try Data Lake Tools for Visual Studio](hadoop/apache-hadoop-visual-studio-tools-get-started.md).

## Visual Studio and the .NET SDK

You can use Visual Studio with the .NET SDK to manage clusters and develop big data applications. You can use other IDEs for the following tasks, but examples are shown in Visual Studio.

Examples of tasks you can do with the .NET SDK in Visual Studio:
* [Azure HDInsight SDK for .NET](/dotnet/api/overview/azure/hdinsight).
* [Run Apache Hive queries using the .NET SDK](hadoop/apache-hadoop-use-hive-dotnet-sdk.md).
* [Use C# user-defined functions with Apache Hive and Apache Pig streaming on Apache Hadoop](hadoop/apache-hadoop-hive-pig-udf-dotnet-csharp.md).

## IntelliJ IDEA and Eclipse IDE for Spark clusters

Both [IntelliJ IDEA](https://www.jetbrains.com/idea/download) and the [Eclipse IDE](https://www.eclipse.org/downloads/) can be used to:
* Develop and submit a Scala Spark application on an HDInsight Spark cluster.
* Access Spark cluster resources.
* Develop and run a Scala Spark application locally.

These articles show how:
* IntelliJ IDEA: [Create Apache Spark applications using the Azure Toolkit for IntelliJ plug-in and the Scala SDK.](spark/apache-spark-intellij-tool-plugin.md)
* Eclipse IDE or Scala IDE for Eclipse: [Create Apache Spark applications and the Azure Toolkit for Eclipse](spark/apache-spark-eclipse-tool-plugin.md)

## Notebooks on Spark for data scientists

Apache Spark clusters in HDInsight include Apache Zeppelin notebooks and kernels that can be used with Jupyter Notebooks.

* [Learn how to use kernels on Apache Spark clusters with Jupyter Notebooks to test Spark applications](spark/apache-spark-zeppelin-notebook.md)
* [Learn how to use Apache Zeppelin notebooks on Apache Spark clusters to run Spark jobs](spark/apache-spark-jupyter-notebook-kernels.md)

## Run Linux-based tools and technologies on Windows

If you come across a situation where you must use a tool or technology that is only available on Linux, consider the following options:

* **Bash on Ubuntu on Windows 10** provides a Linux subsystem on Windows. Bash allows you to directly run Linux utilities without having to maintain a dedicated Linux installation. See [Windows Subsystem for Linux Installation Guide for Windows 10](/windows/wsl/install-win10) for installation steps.  Other [Unix shells](https://www.gnu.org/software/bash/) work as well.
* **Docker for Windows** provides access to many Linux-based tools, and can be run directly from Windows. For example, you can use Docker to run the Beeline client for Hive directly from Windows. You can also use Docker to run a local Jupyter Notebook and remotely connect to Spark on HDInsight. [Get started with Docker for Windows](https://docs.docker.com/docker-for-windows/)
* **[MobaXTerm](https://mobaxterm.mobatek.net/)** allows you to graphically browse the cluster file system over an SSH connection.

## Cross-platform tools

The Azure command-line interface (CLI) is Microsoft's cross-platform command-line experience for managing Azure resources.  For more information, see [Azure Command-Line Interface (CLI)](/cli/azure/).

## Next steps

If you're new to work in Linux-based clusters, see the following articles:
* [Set up Apache Hadoop, Apache Kafka, Apache Spark, or other clusters](hdinsight-hadoop-provision-linux-clusters.md)
* [Tips for HDInsight clusters on Linux](hdinsight-hadoop-linux-information.md)
