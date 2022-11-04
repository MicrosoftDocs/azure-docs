---
title: Manage Apache Spark packages
description: Learn how to add and manage libraries used by Apache Spark in Azure Synapse Analytics. Libraries provide reusable code for use in your programs or projects.
author: shuaijunye
ms.service: synapse-analytics
ms.topic: how-to
ms.date: 11/03/2022
ms.author: shuaijunye
ms.subservice: spark
ms.custom: kr2b-contr-experiment
---

# Manage libraries for Apache Spark in Azure Synapse Analytics

Libraries provide reusable code that you might want to include in your programs or projects.

You might need to update your serverless Apache Spark pool environment for various reasons. For example, you might find that:

- One of your core dependencies released a new version.
- You need an extra package for training your machine learning model or preparing your data.
- You have found a better package and no longer need the older package.
- Your team has built a custom package that you need available in your Apache Spark pool.

To make third party or locally built code available to your applications, install a library onto one of your serverless Apache Spark pools or notebook session.

> [!IMPORTANT]
>
> - There are three levels of package installing on Synapse Analytics -- default level, Spark pool level and session level.
> - Apache Spark in Azure Synapse Analytics has a full Anaconda install plus extra libraries served as the default level installation which is fully managed by Synapse. The Spark pool level packages can be used by all running Artifacts, e.g., Notebook and Spark job definition attaching the corresponding Spark pool. The session level installation will create an environment for the specific Notebook session, the change of session level libraries will not be persisted between sessions.
> - You can upload custom libraries and a specific version of an open-source library that you would like to use in your Azure Synapse Analytics Workspace. The workspace packages can be installed in your Spark pools.
> - To be noted, the pool level library management can take certain amount of time depending on the size of packages and the complexity of required dependencies. The session level installation is suggested with experimental and quick iterative scenarios.
  
## Default Installation

Default packages include a full Anaconda install plus extra commonly used libraries. The full libraries list can be found at [Apache Spark version support](apache-spark-version-support.md).

When a Spark instance starts, these libraries are included automatically. More packages can be added at the Spark pool level or session level.

## Workspace packages

When your team develops custom applications or models, you might develop various code artifacts like *.whl*, *.jar*, or *tar.gz* files to package your code.

In Synapse, workspace packages can be custom or private *.whl* or *.jar* files. You can upload these packages to your workspace and later assign them to a specific serverless Apache Spark pool. Once assigned, these workspace packages are installed automatically on all Spark pool sessions.

To learn more about how to manage workspace libraries, see the following article:

- [Manage workspace packages](./apache-spark-manage-workspace-packages.md)

> [!NOTE]
> If you enabled [Data exfiltration protection](./security/workspace-data-exfiltration-protection.md), you should upload all your dependencies as workspace libraries.

## Pool packages

In some cases, you might want to standardize the packages that are used on an Apache Spark pool. This standardization can be useful if the same packages are commonly installed by multiple people on your team.

Using the Azure Synapse Analytics pool management capabilities, you can configure the default set of libraries to install on a given serverless Apache Spark pool. These libraries are installed on top of the [base runtime](./apache-spark-version-support.md).

Currently, pool management is only supported for Python. For Python, Synapse Spark pools use Conda to install and manage Python package dependencies. When specifying your pool-level libraries, you can now provide a *requirements.txt* or an *environment.yml* file. This environment configuration file is used every time a Spark instance is created from that Spark pool.

To learn more about these capabilities, see [Manage Spark pool packages](./apache-spark-manage-pool-packages.md).

> [!IMPORTANT]
>
> - If the package you are installing is large or takes a long time to install, this fact affects the Spark instance start up time.
> - Altering the PySpark, Python, Scala/Java, .NET, or Spark version is not supported.
> - Installing packages from PyPI is not supported within DEP-enabled workspaces.

## Session-scoped packages

Often, when doing interactive data analysis or machine learning, you might try newer packages or you might need packages that are currently unavailable on your Apache Spark pool. Instead of updating the pool configuration, users can now use session-scoped packages to add, manage, and update session dependencies.

Session-scoped packages allow users to define package dependencies at the start of their session. When you install a session-scoped package, only the current session has access to the specified packages. As a result, these session-scoped packages don't affect other sessions or jobs using the same Apache Spark pool. In addition, these libraries are installed on top of the base runtime and pool level packages.

To learn more about how to manage session-scoped packages, see the following articles:

- [Python session packages:](./apache-spark-manage-session-packages.md#session-scoped-python-packages) At the start of a session, provide a Conda *environment.yml* to install more Python packages from popular repositories.

- [Scala/Java session packages:](./apache-spark-manage-session-packages.md#session-scoped-java-or-scala-packages) At the start of your session, provide a list of *.jar* files to install using `%%configure`.

- [R session packages:](./apache-spark-manage-session-packages.md#session-scoped-r-packages-preview) Within your session, you can install packages across all nodes within your Spark pool using `install.packages` or `devtools`.

## Manage your packages outside Synapse Analytics UI

If your team want to manage the libraries without visiting the package management UIs, you have the options to manage the workspace packages and pool level package updates through Azure PowerShell cmdlets or REST APIs for Synapse Analytics.

To learn more about Azure PowerShell cmdlets and package management REST APIs, see the following articles:

- Azure PowerShell cmdlets for Synapse Analytics: [Manage your Spark pool libraries through Azure PowerShell cmdlets](apache-spark-manage-packages-outside-ui.md#manage-packages-through-azure-powershell-cmdlets)
- Package management REST APIs: [Manage your Spark pool libraries through REST APIs](apache-spark-manage-packages-outside-ui.md#manage-packages-through-rest-apis)

## Next steps

- View the default libraries: [Apache Spark version support](apache-spark-version-support.md)
- Troubleshoot library installation errors: [Troubleshoot library errors](apache-spark-troubleshoot-library-errors.md)
