---
title: Install client tools
description: Install azdata, kubectl, Azure CLI, psql, Azure Data Studio (Insiders), and the Arc extension for Azure Data Studio
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Install client tools for deploying and managing Azure Arc enabled data services

> [!IMPORTANT]
> If you are have used any private preview bits, please be sure to uninstall `azdata` and extensions first and upgrade to the latest release of Azure Data Studio and the Azure Arc extension by following [uninstall/update client tools](uninstall-update-client-tools.md) first, and then follow the instructions below to reinstall `azdata` and extensions.


This article describes the client toosl that should be installed for creating, managing, and using Azure Arc enabled data services. The following section provides a list of tools and links to instalallation instructions. 

## Tools for deploying and managing Azure Arc enabled data services 

The following table lists common tools required for deploying and managing Azure Arc enabled data services, and how to install those tools:

| Tool | Required | Description | Installation |
|---|---|---|---|
| `azdata` | Yes | Command-line tool for installing and managing a big data cluster. | [Install](/sql/azdata/install/deploy-install-azdata?toc=/azure/azure-arc/data/toc.json&bc=/azure/azure-arc/data/breadcrumb/toc.json) |
| `kubectl`<sup>1</sup> | Yes | Command-line tool for monitoring the underlying Kubernetes cluster ([More info](https://kubernetes.io/docs/tasks/tools/install-kubectl/)). | [Windows](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-with-powershell-from-psgallery) \| [Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-using-native-package-management) |
| **Azure Data Studio** | Yes | Cross-platform graphical tool for querying SQL Server. | [Install](https://aka.ms/getazuredatastudio) |
| **Azure Data CLI extension** | Yes | Extension for Azure Data Studio | <!--[need link] [Install](../azure-data-studio/need-link.md) -->|
| **Azure Arc extension** | Yes | Extension for Azure Data Studio that provides management capabilities for Arc data services. | <!--{need link} [Install](../azure-data-studio/data-virtualization-extension.md) -->|
| **Azure CLI**<sup>2</sup> | For AKS | Modern command-line interface for managing Azure services. Used with AKS deployments ([More info](/cli/azure/?view=azure-cli-latest)). | [Install](/cli/azure/install-azure-cli?view=azure-cli-latest) |
| **mssql-cli** | Optional | Modern command-line interface for querying SQL Server ([More info](/sql/tools/mssql-cli)). | [Windows](https://github.com/dbcli/mssql-cli/blob/master/doc/installation/windows.md) \| [Linux](https://github.com/dbcli/mssql-cli/blob/master/doc/installation/linux.md) |
| **sqlcmd** | For some scripts | Legacy command-line tool for querying SQL Server ([More info](sql/tools/sqlcmd-utility)). You might need to install the Microsoft ODBC Driver 11 for SQL Server before installing the SQLCMD package. | [Windows](https://www.microsoft.com/download/details.aspx?id=36433) \| [Linux](/sql/linux/sql-server-linux-setup-tools) |
| `curl` <sup>3</sup> | For some scripts | Command-line tool for transferring data with URLs. | [Windows](https://curl.haxx.se/windows/) \| Linux: install curl package |
| `oc` | Required for Red Hat OpenShift and Azure Redhat OpenShift deployments. |`oc` is the Open Shift command line interface (CLI). | [Installing the CLI](https://docs.openshift.com/container-platform/4.4/cli_reference/openshift_cli/getting-started-cli.html#installing-the-cli)


<sup>1</sup> You must use `kubectl` version 1.13 or later. Also, the version of `kubectl` should be plus or minus one minor version of your Kubernetes cluster. If you want to install a specific version on `kubectl` client, see [Install `kubectl` binary via curl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-binary-using-curl) (on Windows 10, use cmd.exe and not Windows PowerShell to run curl).

<sup>2</sup> You must be using Azure CLI version 2.0.4 or later. Run `az --version` to find the version if needed.

<sup>3</sup> If you are running on Windows 10, `curl` is already in your PATH when running from a cmd prompt. For other versions of Windows, download `curl` using the link and place it in your PATH.

## Which tools are required?

The previous table provides all of the common tools that are used with managing Azure Arc enabled data services. In general, the following tools are most important for managing, connecting to, and querying the Azure Arc data controller:

- `azdata`
- `kubectl`
- **Azure Data Studio**
- **Azure Data CLI extension**
- **Azure Arc extension**

The remaining tools are only required in certain scenarios. **Azure CLI** can be used to manage Azure services associated with AKS deployments. **mssql-cli** is an optional but useful tool that allows you to connect to the SQL Server master instance in the cluster and run queries from the command line. And **sqlcmd** and `curl` are required if you plan to install sample data with the GitHub script. For managing Azure Arc enabled PostgreSQL Hyperscale, any tool that currently works against PostgreSQL should also work with Azure Arc enabled PostgreSQL Hyperscale.




## Next steps

Now [deploy the Azure Arc data controller](create-data-controller.md)
