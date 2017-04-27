---
title: Use Windows with Hadoop on HDInsight - Azure | Microsoft Docs 
description: Learn how to use HDInsight from Microsoft Windows. Use PowerShell and Visual Studio to run applications on Hadoop. Learn how to develop big data solutions for HDInsight using .NET.
services: hdinsight 
keywords: hadoop on windows, hadoop for windows 
author: cjgronlund

ms.author: cgronlun
ms.date: 05/01/2017
ms.topic: article
ms.service: hdinsight
manager: jhubbard
---

# Windows tools and techniques for Hadoop on HDInsight 
Learn the ways you can work in the Hadoop ecosystem on HDInsight from Microsoft Windows. Use PowerShell and Visual Studio to run applications on Hadoop. Learn how to develop big data solutions for HDInsight using .NET.


## Use HDInsight with Windows

Learn how you can use Windows to work with HDInsight clusters. HDInsight is based on Apache Hadoop, which is developed on Linux and uses many open source technologies also developed on Linux. However you do not have to use a Linux client or development environment to work with HDInsight.

## Use PowerShell

[Discussion about Azure PowerShell. Links to Hive, Pig, MapReduce documents]

## Use Visual Studio

[Discussion about VS tools. Links to Hive, Storm, etc. documents]

## Use .NET

[Brief discussion about .NET on HDInsight. Links to the main .NET on Linux-based HDInsight document, links to example for Hive/Pig C# UDF, links to example C# MapReduce, links to migrate .NET from Windows to Linux]

## Use Linux-based technology from Windows

If you encounter a situation where you must use a tool or technology that is only available on Linux, consider the following options:

•	Bash on Windows 10 provides a Linux subsystem on Windows. This allows you to directly run Linux utilities without having to maintain a dedicated Linux installation.
•	Docker for Windows provides access to many Linux-based tools, and can be ran directly from Windows. For example, you can use Docker to run the Beeline client for Hive directly from Windows. You can also use Docker to run a local Jupyter notebook and remotely connect to Spark on HDInsight. [Note that the docker stuff needs to be vetted by engineering. I just created the POC for Jupyter in Docker yesterday, based on the official Jupyter notebook docker images.]
•	3rd party Windows tools such as MobaXTerm that allow you to graphically browse the cluster file system over an SSH connection

•	Using PowerShell to submit jobs
•	Using tools for Visual Studio to work with Hive, Storm, etc.
•	Setting up development environments
•	How to use things like Bash on Windows 10 and/or Docker to run Linux-native tools for things like development or remote connectivity.

## Next steps

Now that you have an overview of SQL Database here are suggested next steps: 

- Get started by [creating your first database](https://docs.microsoft.com/azure/sql-database/sql-database-get-started-portal).
- Build your first app in C#, Java, Node.js, PHP, Python, or Ruby: [Connection libraries for SQL Database and SQL Server](https://docs.microsoft.com/azure/sql-database/sql-database-libraries)
- See the [pricing page](https://azure.microsoft.com/en-us/pricing/details/sql-database/) and [SLA page](https://azure.microsoft.com/support/legal/sla/).