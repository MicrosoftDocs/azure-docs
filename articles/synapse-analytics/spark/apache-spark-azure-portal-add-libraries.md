---
title: Package management
description: Learn how to add and manage libraries used by Apache Spark in Azure Synapse Analytics.
services: synapse-analytics
author: midesa
ms.service: synapse-analytics
ms.topic: reference
ms.date: 03/01/2020
ms.author: midesa
ms.reviewer: jrasnick 
ms.subservice: spark
---

# Manage libraries for Apache Spark in Azure Synapse Analytics
Libraries provide reusable code that you may want to include in your programs or projects. 

You may need to update your serverless Apache Spark pool environment for various reasons. For example, you may find that:
- one of your core dependencies released a new version.
- you need an extra package for training your machine learning model or preparing your data.
- you have found a better package and no longer need the older package.
- your team has built a custom package that you need available in your Apache Spark pool.

To make third party or locally built code available to your applications, you can install a library onto one of your serverless Apache Spark pools or notebook session.
  
## Default Installation
Apache Spark in Azure Synapse Analytics has a full Anacondas install plus extra libraries. The full libraries list can be found at [Apache Spark version support](apache-spark-version-support.md). 

When a Spark instance starts up, these libraries will automatically be included. Additional packages can be added at the Spark pool level or session level.

## Workspace packages
When developing custom applications or models, your team may develop various code artifacts like wheel or jar files to package your code. 

In Synapse, workspace packages can be custom or private wheel or jar files. You can upload these packages to your workspace and later assign them to a specific Spark pool. Once assigned, these workspace packages are automatically installed on all Spark pool sessions.

To learn more about how to manage workspace libraries, visit the following how-to guides:

- [Python workspace packages (preview): ](./apache-spark-manage-python-packages.md#install-wheel-files) Upload Python wheel files as a workspace package and later add these packages to specific serverless Apache Spark pools.
- [Scala/Java workspace packages (preview): ](./apache-spark-manage-scala-packages.md#workspace-packages) Upload Scala and Java jar files as a workspace package and later add these packages to specific serverless Apache Spark pools.

## Pool packages
In some cases, you may want to standardize the set of packages that are used on a given Apache Spark pool. This standardization can be useful if the same packages are commonly installed by multiple people on your team. 

Using the Azure Synapse Analytics pool management capabilities, you can configure the default set of libraries that you would like installed on a given serverless Apache Spark pool. These libraries are installed on top of the [base runtime](./apache-spark-version-support.md). 

Currently, pool management is only supported for Python. For Python, Synapse Spark pools use Conda to install and manage Python package dependencies. When specifying your pool-level libraries, you can now provide a requirements.txt or an environment.yml. This environment configuration file is used every time a Spark instance is created from that Spark pool. 

To learn more about these capabilities, visit the documentation on [Python pool management](./apache-spark-manage-python-packages.md#pool-libraries).

> [!IMPORTANT]
> - If the package you are installing is large or takes a long time to install, this affects the Spark instance start up time.
> - Altering the PySpark, Python, Scala/Java, .NET, or Spark version is not supported.
> - Installing packages from PyPI is not supported within DEP-enabled workspaces.

## Session-scoped packages
Often, when doing interactive data analysis or machine learning, you may find that you want to try out newer packages or you may need packages that are not already available on your Apache Spark pool. Instead of updating the pool configuration, users can now use session-scoped packages to add, manage, and update session dependencies.

Session-scoped packages allow users to define package dependencies at the start of their session. When you install a session-scoped package, only the current session has access to the specified packages. As a result, these session-scoped packages will not impact other sessions or jobs using the same Apache Spark pool. In addition, these libraries are installed on top of the base runtime and pool level packages. 

To learn more about how to manage session-scoped packages, visit the following how-to guides:

- [Python session packages (preview): ](./apache-spark-manage-python-packages.md) At the start of a session, provide a Conda *environment.yml* to install additional Python packages from popular repositories. 
- [Scala/Java session packages: ](./apache-spark-manage-scala-packages.md) At the start of your session, provide a list of jar files to install using `%%configure`.

## Next steps
- View the default libraries: [Apache Spark version support](apache-spark-version-support.md)
