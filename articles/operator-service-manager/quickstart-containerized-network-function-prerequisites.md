---
title: Prerequisites for Using Azure Operator Service Manager
description: Use this Quickstart to install and configure the necessary prerequisites for Azure Operator Service Manager
author: HollyCl
ms.author: hollycl
ms.service: azure-operator-service-manager
ms.custom: devx-track-azurecli
ms.topic: quickstart
ms.date: 09/08/2023
---

# Quickstart: Complete the prerequisites to deploy a Containerized Network Function in Azure Operator Service Manager

In this Quickstart, you complete the tasks necessary prior to using the Azure Operator Service Manager (AOSM).

## Prerequisites

- You have [enabled AOSM](quickstart-onboard-subscription-azure-operator-service-manager.md) on your Azure subscription.

## Download and install Azure CLI

To install the Azure CLI locally, refer to [How to install the Azure CLI](/cli/azure/install-azure-cli).

To sign into the Azure CLI, use the `az login` command and complete the prompts displayed in your terminal to finish authentication. For more sign-in options, refer to [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

> [!NOTE]
> If you're running on Windows or macOS, consider running Azure CLI in a Docker container. For more information, see [How to run the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker). You can also use the Bash environment in the Azure cloud shell. For more information, see [Start the Cloud Shell](/azure/cloud-shell/quickstart?tabs=azurecli) to use Bash environment in Azure Cloud Shell.

### Install Azure Operator Service Manager (AOSM) CLI extension

Install the Azure Operator Service Manager (AOSM) CLI extension using this command:

```azurecli
az extension add --name aosm
```

1. Run `az version` to see the version and dependent libraries that are installed.
1. Run `az upgrade` to upgrade to the current version of Azure CLI.

## Requirements for Containerized Network Function (CNF)

### Install required local tools

For those utilizing Containerized Network Functions, it's essential to ensure that the following packages are installed on the machine from which you're executing the CLI:

- **Install docker**, refer to [Install the Docker Engine](https://docs.docker.com/engine/install/).
- **Install Helm**, refer to [Install Helm CLI](https://helm.sh/docs/intro/install/). You must use Helm v3.8.0 or later.


### Download sample Helm chart

Download the sample Helm chart from here [Sample Helm chart](https://download.microsoft.com/download/c/5/1/c512cc48-ad99-4a69-afdc-db2bda449914/nginxdemo-0.3.0.tgz) for use with this quickstart.

## Next steps

- [Quickstart: Publish Nginx container as Containerized Network Function (CNF)](quickstart-publish-containerized-network-function-definition.md)
