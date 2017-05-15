---
title: Use a Windows PC with Hadoop on HDInsight - Azure | Microsoft Docs
description: Work from a Windows PC in Hadoop on HDInsight. Manage and query clusters with PowerShell, Visual Studio, and Linux tools. Develop big data solutions with .NET.
services: hdinsight
keywords: hadoop on windows,hadoop for windows
author: cjgronlund
manager: jhubbard

ms.author: cgronlun
ms.date: 05/16/2017
ms.topic: article
ms.service: hdinsight
ms.custom: hdiseo17may2017
---

# Work in the Hadoop ecosystem on HDInsight from a Windows PC

Learn about development and management options on the Windows PC for working in the Hadoop ecosystem on HDInsight. 

HDInsight is based on Apache Hadoop and Hadoop components, open-source technologies developed on Linux. HDInsight version 3.4 and higher uses the Ubuntu Linux distribution as the underlying OS for the cluster. However, you can work with HDInsight from a Windows client or Windows development environment.

## Use PowerShell for deployment and management tasks
Azure PowerShell is a scripting environment that you can use to control and automate deployment and management tasks in HDInsight from Windows.

Examples of tasks you can do with PowerShell:

* [Create clusters using PowerShell](hdinsight-hadoop-create-linux-clusters-azure-powershell.md)
* [Run Hive queries using PowerShell](hdinsight-hadoop-use-hive-powershell.md)
* [Manage clusters with PowerShell](hdinsight-administer-use-powershell.md)

Follow steps to [install and configure Azure Powershell](https://docs.microsoft.com/en-us/powershell/azure/install-azurerm-ps) to get the latest version. If you have scripts that need to be modified to use the new cmdlets for Azure Resource Manager, see [Migrate to Azure Resource Manager-based development tools for HDInsight clusters](hdinsight-hadoop-development-using-azure-resource-manager.md).

## Query clusters with Data Lake Tools for Visual Studio
You can connect to and query clusters with Data Lake Tools for Visual Studio. 

Before you try the following examples, [install and try Data Lake Tools for Visual Studio](hdinsight-hadoop-visual-studio-tools-get-started.md). Examples of tasks you can do with Data Lake tools for Visual Studio:
* [Deploy and manage Storm topologies from Visual Studio](hdinsight-storm-deploy-monitor-topology-linux.md)
* [Run Hive queries from Visual Studio](hdinsight-hadoop-use-hive-visual-studio.md)

## Use the Visual Studio and the .NET SDK 

You can use Visual Studio with the .NET SDK to manage clusters and develop big data applications. You can use other IDEs, but examples shown are in Visual Studio.

Examples of tasks you can do with the .NET SDK in Visual Studio:
* [Create clusters and work in HDInsight from a .NET Framework application](hdinsight-hadoop-create-linux-clusters-dotnet-sdk.md)
* [Run Hive queries using the .NET SDK](hdinsight-hadoop-use-hive-dotnet-sdk.md)
* [Use C# user-defined functions with Hive and Pig streaming on Hadoop](hdinsight-hadoop-hive-pig-udf-dotnet-csharp.md)

> TIP 
>If you're running .NET solutions with Windows-based HDInsight clusters, it's a good time to plan a migration to Linux-based clusters. For more information, see [Migrate .NET solution for Windows-based HDInsight to Linux-based HDInsight](hdinsight-hadoop-migrate-dotnet-to-linux.md).

## Run Linux-based tools and technologies on Windows

If you encounter a situation where you must use a tool or technology that is only available on Linux, consider the following options:

* **Bash (beta) on Windows 10** provides a Linux subsystem on Windows. Bash allows you to directly run Linux utilities without having to maintain a dedicated Linux installation. [Install and run the Bash beta on Windows 10](https://msdn.microsoft.com/commandline/wsl/install_guide)
* **Docker for Windows** provides access to many Linux-based tools, and can be run directly from Windows. For example, you can use Docker to run the Beeline client for Hive directly from Windows. You can also use Docker to run a local Jupyter notebook and remotely connect to Spark on HDInsight. [Get started with Docker for Windows](https://docs.docker.com/docker-for-windows/)
* **[MobaXTerm](http://mobaxterm.mobatek.net/)** allows you to graphically browse the cluster file system over an SSH connection.

