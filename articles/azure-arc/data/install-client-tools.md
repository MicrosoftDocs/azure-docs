---
title: Install client tools
description: Install azdata, kubectl, Azure CLI, psql, Azure Data Studio (Insiders), and the Arc extension for Azure Data Studio
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.custom: devx-track-azurecli
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Install client tools for deploying and managing Azure Arc-enabled data services

This article points you to resources to install the tools to manage Azure Arc-enabled data services.

> [!IMPORTANT]
> If you are updating to a new release, update to the latest version of Azure Data Studio, the Azure Arc extension for Azure Data Studio, Azure (`az`) command line interface (CLI), and the [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)].
>
> [!INCLUDE [use-insider-azure-data-studio](includes/use-insider-azure-data-studio.md)] 

The [`arcdata` extension for Azure CLI (`az`)](about-arcdata-extension.md) replaces `azdata` for Azure Arc-enabled data services.

## Tools for creating and managing Azure Arc-enabled data services

The following table lists common tools required for creating and managing Azure Arc-enabled data services, and how to install those tools:

| Tool | Required | Description | Installation |
|---|---|---|---|
| Azure CLI (`az`)<sup>1</sup> | Yes | Modern command-line interface for managing Azure services. Used to manage Azure services in general and also specifically Azure Arc-enabled data services using the CLI or in scripts for both indirectly connected mode (available now) and directly connected mode (available soon). ([More info](/cli/azure/)). | [Install](/cli/azure/install-azure-cli) |
| `arcdata` extension for Azure (`az`) CLI | Yes | Command-line tool for managing Azure Arc-enabled data services as an extension to the Azure CLI (`az`) | [Install](install-arcdata-extension.md) |
| Azure Data Studio | Yes | Rich experience tool for connecting to and querying a variety of databases including Azure SQL, SQL Server, PostrgreSQL, and MySQL. Extensions to Azure Data Studio provide an administration experience for Azure Arc-enabled data services. | [Install](/sql/azure-data-studio/download-azure-data-studio) |
| Azure Arc extension for Azure Data Studio | Yes | Extension for Azure Data Studio that provides a management experience for Azure Arc-enabled data services.| Install from the extensions gallery in Azure Data Studio.|
| PostgreSQL extension in Azure Data Studio | No | PostgreSQL extension for Azure Data Studio that provides management capabilities for PostgreSQL. | <!--{need link} [Install](../azure-data-studio/data-virtualization-extension.md) --> Install from extensions gallery in Azure Data Studio.|
| Kubernetes CLI (kubectl)<sup>2</sup> | Yes | Command-line tool for managing the Kubernetes cluster ([More info](https://kubernetes.io/docs/tasks/tools/install-kubectl/)). | [Windows](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows) \| [Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/) \| [macOS](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/) |
| `curl` <sup>3</sup> | Required for some sample scripts. | Command-line tool for transferring data with URLs. | [Windows](https://curl.haxx.se/windows/) \| Linux: install curl package |
| `oc` | Required for Red Hat OpenShift and Azure Redhat OpenShift deployments. |`oc` is the Open Shift command line interface (CLI). | [Installing the CLI](https://docs.openshift.com/container-platform/4.6/cli_reference/openshift_cli/getting-started-cli.html#installing-the-cli)



<sup>1</sup> You must be using Azure CLI version 2.26.0 or later. Run `az --version` to find the version if needed.

<sup>2</sup> You must use `kubectl` version 1.19 or later. Also, the version of `kubectl` should be plus or minus one minor version of your Kubernetes cluster. If you want to install a specific version on `kubectl` client, see [Install `kubectl` binary via curl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-binary-using-curl) (on Windows 10, use cmd.exe and not Windows PowerShell to run curl).

<sup>3</sup> For PowerShell, `curl` is an alias to the Invoke-WebRequest cmdlet.

## Next steps

[Plan an Azure Arc-enabled data services deployment](plan-azure-arc-data-services.md)
