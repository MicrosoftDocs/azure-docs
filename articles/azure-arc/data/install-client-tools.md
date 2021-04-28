---
title: Install client tools
description: Install azdata, kubectl, Azure CLI, psql, Azure Data Studio (Insiders), and the Arc extension for Azure Data Studio
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Install client tools for deploying and managing Azure Arc enabled data services

> [!IMPORTANT]
> If you are updating to a new monthly release, please be sure to also update to the latest version of Azure Data Studio, the [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)] tool, and the [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)] and Azure Arc extensions for Azure Data Studio.

This document walks you through the steps for installing the [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)], Azure Data Studio, Azure CLI (az), and the Kubernetes CLI tool (kubectl) on your client machine.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Tools for creating and managing Azure Arc enabled data services 

The following table lists common tools required for creating and managing Azure Arc enabled data services, and how to install those tools:

| Tool | Required | Description | Installation |
|---|---|---|---|
| [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)] | Yes | Command-line tool for installing and managing a big data cluster. [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)] also includes a command line utility to connect to and query Azure SQL and SQL Server instances and Postgres servers using the commands `azdata sql query` (run a single query from the command line), `azdata sql shell` (an interactive shell), `azdata postgres query` and `azdata postgres shell`. | [Install](/sql/azdata/install/deploy-install-azdata?toc=/azure/azure-arc/data/toc.json&bc=/azure/azure-arc/data/breadcrumb/toc.json) |
| Azure Data Studio | Yes | Rich experience tool for connecting to and querying a variety of databases including Azure SQL, SQL Server, PostrgreSQL, and MySQL. Extensions to Azure Data Studio provide an administration experience for Azure Arc enabled data services. | [Install](/sql/azure-data-studio/download-azure-data-studio) |
| [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)] extension for Azure Data Studio | Yes | Extension for Azure Data Studio that will install [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)] if you don't already have it.| Install from extensions gallery in Azure Data Studio.|
| Azure Arc extension for Azure Data Studio | Yes | Extension for Azure Data Studio that provides a management experience for Azure Arc enabled data services. There is a dependency on the [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)] extension for Azure Data Studio. | Install from extensions gallery in Azure Data Studio.|
| PostgreSQL extension in Azure Data Studio | No | PostgreSQL extension for Azure Data Studio that provides management capabilities for PostgreSQL. | <!--{need link} [Install](../azure-data-studio/data-virtualization-extension.md) --> Install from extensions gallery in Azure Data Studio.|
| Azure CLI (az)<sup>1</sup> | Yes | Modern command-line interface for managing Azure services. Used with AKS deployments and to upload Azure Arc enabled data services inventory and billing data to Azure. ([More info](/cli/azure/)). | [Install](/cli/azure/install-azure-cli) |
| Kubernetes CLI (kubectl)<sup>2</sup> | Yes | Command-line tool for managing the Kubernetes cluster ([More info](https://kubernetes.io/docs/tasks/tools/install-kubectl/)). | [Windows](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-with-powershell-from-psgallery) \| [Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-using-native-package-management) |
| curl <sup>3</sup> | Required for some sample scripts. | Command-line tool for transferring data with URLs. | [Windows](https://curl.haxx.se/windows/) \| Linux: install curl package |
| oc | Required for Red Hat OpenShift and Azure Redhat OpenShift deployments. |`oc` is the Open Shift command line interface (CLI). | [Installing the CLI](https://docs.openshift.com/container-platform/4.4/cli_reference/openshift_cli/getting-started-cli.html#installing-the-cli)



<sup>1</sup> You must be using Azure CLI version 2.0.4 or later. Run `az --version` to find the version if needed.

<sup>2</sup> You must use `kubectl` version 1.13 or later. Also, the version of `kubectl` should be plus or minus one minor version of your Kubernetes cluster. If you want to install a specific version on `kubectl` client, see [Install `kubectl` binary via curl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-binary-using-curl) (on Windows 10, use cmd.exe and not Windows PowerShell to run curl).

<sup>3</sup> If you are using PowerShell, curl is an alias to the Invoke-WebRequest cmdlet.

## Next steps

[Create the Azure Arc data controller](create-data-controller.md)