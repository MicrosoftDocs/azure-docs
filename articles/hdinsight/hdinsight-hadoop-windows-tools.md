---
title: Use a Windows PC with Hadoop on HDInsight - Azure | Microsoft Docs 
description: Learn how to use HDInsight from a Windows PC. Use PowerShell and Visual Studio to run applications on Hadoop. Learn how to develop big data solutions for HDInsight using .NET.
services: hdinsight 
keywords: hadoop on windows, hadoop for windows 
author: cjgronlund

ms.author: cgronlun
ms.date: 05/12/2017
ms.topic: article
ms.service: hdinsight
manager: jhubbard
---

# Work in Hadoop on HDInsight from a Windows PC

Learn about tools available for a Windows PC for the Hadoop ecosystem on HDInsight. 

HDInsight is based on Apache Hadoop and Hadoop components, open-source technologies developed on Linux. HDInsight version 3.4 and higher uses the Ubuntu Linux distribution as the underlying OS for the cluster. However, you can work with HDInsight from a Windows client or Windows development environment.

Use PowerShell and Visual Studio to run applications on Hadoop. Learn how to develop big data solutions for HDInsight using .NET.


## Use PowerShell on Windows
Azure PowerShell is a scripting environment that you can use to control and automate deployment and management tasks in HDInsight from Windows.

Examples of tasks you can do with PowerShell:

* [Create clusters using PowerShell](hdinsight-hadoop-create-linux-clusters-azure-powershell.md)
* [Run Hive queries using PowerShell](hdinsight-hadoop-use-hive-powershell.md)
* [Manage clusters with PowerShell](hdinsight-administer-use-powershell.md)

Follow steps to [install and configure Azure Powershell](https://docs.microsoft.com/en-us/powershell/azure/install-azurerm-ps) to get the latest version. If you have scripts that need to be modified to use the new cmdlets that work with Azure Resource Manager, see [Migrate to Azure Resource Manager-based development tools for HDInsight clusters](hdinsight-hadoop-development-using-azure-resource-manager.md).

## Use Visual Studio tools for Hadoop and Data Lake
You can use Data Lake Tools for Visual Studio to work with a 

Examples of tasks you can do with Data Lake tools for Visual Studio:
* [Run Hive queries from Visual Studio](hdinsight-hadoop-use-hive-visual-studio.md)
 

https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-visual-studio-tools-get-started
https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-storm-deploy-monitor-topology-linux
https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-create-linux-clusters-dotnet-sdk 

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

