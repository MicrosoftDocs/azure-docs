---
title: Manage Apache Spark packages
description: Learn how to add and manage libraries used by Apache Spark in Azure Synapse Analytics.
author: shuaijunye
ms.service: synapse-analytics
ms.topic: how-to
ms.date: 02/20/2023
ms.author: shuaijunye
ms.subservice: spark
ms.custom: kr2b-contr-experiment, devx-track-azurepowershell
---

# Manage libraries for Apache Spark in Azure Synapse Analytics

Libraries provide reusable code that you might want to include in your programs or projects for Apache Spark in Azure Synapse Analytics (Azure Synapse Spark).

You might need to update your serverless Apache Spark pool environment for various reasons. For example, you might find that:

- One of your core dependencies released a new version.
- You need an extra package for training your machine learning model or preparing your data.
- A better package is available, and you no longer need the older package.
- Your team has built a custom package that you need available in your Apache Spark pool.

To make third-party or locally built code available to your applications, install a library onto one of your serverless Apache Spark pools or a notebook session.

## Overview of package levels

There are three levels of packages installed on Azure Synapse Analytics:

- **Default**: Default packages include a full Anaconda installation, plus extra commonly used libraries. For a full list of libraries, see [Apache Spark version support](apache-spark-version-support.md).

  When a Spark instance starts, these libraries are included automatically. You can add more packages at the other levels.
- **Spark pool**: All running artifacts can use packages at the Spark pool level. For example, you can attach notebook and Spark job definitions to corresponding Spark pools.

  You can upload custom libraries and a specific version of an open-source library that you want to use in your Azure Synapse Analytics workspace. The workspace packages can be installed in your Spark pools.
- **Session**: A session-level installation creates an environment for a specific notebook session. The change of session-level libraries isn't persisted between sessions.

> [!NOTE]
>
> - Pool-level library management can take time, depending on the size of the packages and the complexity of required dependencies, the maximum updating time is set as 50 minutes. Your pool-level library management job will be canceled automatically if it exceeds the upper limit of 50 minutes. We recommend the session-level installation for experimental and quick iterative scenarios.
> - The pool-level library management will produce a stable dependency for running your Notebooks and Spark job definitions. Installing the library to your Spark pool is highly recommended for the pipeline runs.
> - Session level library management can help you with fast iteration or dealing with the frequent changes of library. However, the stability of session level installation is not promised. Also, in-line commands like %pip and %conda are disabled in pipeline run. Managing library in Notebook session is recommended during the developing phase.

## Manage workspace packages

When your team develops custom applications or models, you might develop various code artifacts like *.whl*, *.jar*, or *.tar.gz* files to package your code.

> [!IMPORTANT]
>
> - *tar.gz* is only supported for R language. Please use *.whl* as Python custom package.

In Azure Synapse, workspace packages can be custom or private *.whl* or *.jar* files. You can upload these packages to your workspace and later assign them to a specific serverless Apache Spark pool. After you assign these workspace packages, they're installed automatically on all Spark pool sessions.

To learn more about how to manage workspace libraries, see [Manage workspace packages](./apache-spark-manage-workspace-packages.md).

## Manage pool packages

In some cases, you might want to standardize the packages that are used on an Apache Spark pool. This standardization can be useful if multiple people on your team commonly install the same packages.

By using the pool management capabilities of Azure Synapse Analytics, you can configure the default set of libraries to install on a serverless Apache Spark pool. These libraries are installed on top of the [base runtime](./apache-spark-version-support.md).

For Python libraries, Azure Synapse Spark pools use Conda to install and manage Python package dependencies. You can specify the pool-level Python libraries by providing a *requirements.txt* or *environment.yml* file. This environment configuration file is used every time a Spark instance is created from that Spark pool. You can also attach the workspace packages to your pools.

To learn more about these capabilities, see [Manage Spark pool packages](./apache-spark-manage-pool-packages.md).

> [!IMPORTANT]
>
> - If the package that you're installing is large or takes a long time to install, it might affect the Spark instance's startup time.
> - Altering the PySpark, Python, Scala/Java, .NET, or Spark version is not supported.

### Manage dependencies for DEP-enabled Azure Synapse Spark pools

> [!NOTE]
> Installing packages from a public repo is not supported within [DEP-enabled workspaces](../security/workspace-data-exfiltration-protection.md). Instead, upload all your dependencies as workspace libraries and install them to your Spark pool.

If you're having trouble identifying required dependencies, follow these steps:

1. Run the following script to set up a local Python environment that's the same as the Azure Synapse Spark environment. This script requires a YAML file containing a list of all the libraries included in the default Python environment for Azure Synapse Spark. You can find this YAML file in the documentation for specific runtime versions, such as [Apache Spark 3.2 (EOLA)](./apache-spark-32-runtime.md) and [Apache Spark 3.3 (GA)](./apache-spark-33-runtime.md).

   ```powershell
      # One-time Azure Synapse Python setup
      wget Synapse-Python38-CPU.yml
      sudo bash Miniforge3-Linux-x86_64.sh -b -p /usr/lib/miniforge3
      export PATH="/usr/lib/miniforge3/bin:$PATH"
      sudo apt-get -yq install gcc g++
      conda env create -n synapse-env -f Synapse-Python38-CPU.yml 
      source activate synapse-env
   ```

2. Run the following script to identify the required dependencies. 
The script can be used to pass your *requirements.txt* file, which has all the packages and versions that you intend to install in the Spark 3.1 or Spark 3.2 pool. It will print the names of the *new* wheel files/dependencies for your input library requirements. 

   ```python
      # Command to list wheels needed for your input libraries.
      # This command will list only new dependencies that are
      # not already part of the built-in Azure Synapse environment.
      pip install -r <input-user-req.txt> > pip_output.txt
      cat pip_output.txt | grep "Using cached *"
   ```

   > [!NOTE]
   > This script will list only the dependencies that are not already present in the Spark pool by default.

## Manage session-scoped packages

When you're doing interactive data analysis or machine learning, you might try newer packages, or you might need packages that are currently unavailable on your Apache Spark pool. Instead of updating the pool configuration, you can use session-scoped packages to add, manage, and update session dependencies.

Session-scoped packages allow users to define package dependencies at the start of their session. When you install a session-scoped package, only the current session has access to the specified packages. As a result, these session-scoped packages don't affect other sessions or jobs that use the same Apache Spark pool. In addition, these libraries are installed on top of the base runtime and pool-level packages.

To learn more about how to manage session-scoped packages, see the following articles:

- [Python session packages](./apache-spark-manage-session-packages.md#session-scoped-python-packages): At the start of a session, provide a Conda *environment.yml* file to install more Python packages from popular repositories. Or you can use %pip and %conda commands to manage libraries in the Notebook code cells.

- [Scala/Java session packages](./apache-spark-manage-session-packages.md#session-scoped-java-or-scala-packages): At the start of your session, provide a list of *.jar* files to install by using `%%configure`.

- [R session packages](./apache-spark-manage-session-packages.md#session-scoped-r-packages-preview): Within your session, you can install packages across all nodes within your Spark pool by using `install.packages` or `devtools`.


## Automate the library management process through Azure PowerShell cmdlets and REST APIs

If your team wants to manage libraries without visiting the package management UIs, you have the option to manage the workspace packages and pool-level package updates through Azure PowerShell cmdlets or REST APIs for Azure Synapse Analytics.

For more information, see the following articles:

- [Manage your Spark pool libraries through REST APIs](apache-spark-manage-packages-outside-ui.md#manage-packages-through-rest-apis)
- [Manage your Spark pool libraries through Azure PowerShell cmdlets](apache-spark-manage-packages-outside-ui.md#manage-packages-through-azure-powershell-cmdlets)

## Next steps

- [View the default libraries and supported Apache Spark versions](apache-spark-version-support.md)
- [Troubleshoot library installation errors](apache-spark-troubleshoot-library-errors.md)
