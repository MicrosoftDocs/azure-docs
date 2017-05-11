---
title: Use a Windows PC with Hadoop on HDInsight - Azure | Microsoft Docs 
description: Work in HDInsight from a Windows PC. Run applications on Hadoop with PowerShell and Visual Studio. Develop big data solutions with .NET.
keywords: 
services: hdinsight 
keywords: hadoop on windows, hadoop for windows 
author: cjgronlund
manager: jhubbard

ms.author: cgronlun
ms.date: 05/12/2017
ms.topic: article
ms.service: hdinsight
ms.custom: hdiseo17may2017
---

# Work in Hadoop on HDInsight from a Windows PC

Learn about tools available for a Windows PC for working in and devethe Hadoop ecosystem on HDInsight. 

HDInsight is based on Apache Hadoop and Hadoop components, open-source technologies developed on Linux. HDInsight version 3.4 and higher uses the Ubuntu Linux distribution as the underlying OS for the cluster. However, you can work with HDInsight from a Windows client or Windows development environment.

## Use PowerShell on Windows
Azure PowerShell is a scripting environment that you can use to control and automate deployment and management tasks in HDInsight from Windows.

Examples of tasks you can do with PowerShell:

* [Create clusters using PowerShell](hdinsight-hadoop-create-linux-clusters-azure-powershell.md)
* [Run Hive queries using PowerShell](hdinsight-hadoop-use-hive-powershell.md)
* [Manage clusters with PowerShell](hdinsight-administer-use-powershell.md)

Follow steps to [install and configure Azure Powershell](https://docs.microsoft.com/en-us/powershell/azure/install-azurerm-ps) to get the latest version. If you have scripts that need to be modified to use the new cmdlets that work with Azure Resource Manager, see [Migrate to Azure Resource Manager-based development tools for HDInsight clusters](hdinsight-hadoop-development-using-azure-resource-manager.md).

## Use Visual Studio and tools for Data Lake and Hadoop
You can use Data Lake Tools for Visual Studio with HDInsight. Manage clusters and develop apps powered by big data insights.

[Install and try Data Lake Tools for Visual Studio](hdinsight-hadoop-visual-studio-tools-get-started.md).

Examples of tasks you can do with Visual Studio:
* [Create clusters and work in HDInsight from a .NET Framework application](hdinsight-hadoop-create-linux-clusters-dotnet-sdk.md)


Examples of tasks you can do with Data Lake tools for Visual Studio:
* [Run Hive queries from Data Lake tools for Visual Studio](hdinsight-hadoop-use-hive-visual-studio.md)
* [Deploy and manage Storm topologies with Data Lake tools for Visual Studio](hdinsight-storm-deploy-monitor-topology-linux.md)

 

https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-visual-studio-tools-get-started
https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-storm-deploy-monitor-topology-linux


[Discussion about VS tools. Links to Hive, Storm, etc. documents]

## Use .NET

[Brief discussion about .NET on HDInsight. Links to the main .NET on Linux-based HDInsight document, links to example for Hive/Pig C# UDF, links to example C# MapReduce, links to migrate .NET from Windows to Linux]

## Use Linux-based technologies on Windows

If you encounter a situation where you must use a tool or technology that is only available on Linux, consider the following options:

* Bash on Windows 10 provides a Linux subsystem on Windows. This allows you to directly run Linux utilities without having to maintain a dedicated Linux installation.
* Docker for Windows provides access to many Linux-based tools, and can be ran directly from Windows. For example, you can use Docker to run the Beeline client for Hive directly from Windows. You can also use Docker to run a local Jupyter notebook and remotely connect to Spark on HDInsight. [Note that the docker stuff needs to be vetted by engineering. I just created the POC for Jupyter in Docker yesterday, based on the official Jupyter notebook docker images.]
* 3rd party Windows tools such as MobaXTerm that allow you to graphically browse the cluster file system over an SSH connection



•	Using PowerShell to submit jobs
•	Using tools for Visual Studio to work with Hive, Storm, etc.
•	Setting up development environments
•	How to use things like Bash on Windows 10 and/or Docker to run Linux-native tools for things like development or remote connectivity.

## Next steps

