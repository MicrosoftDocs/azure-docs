---
title: Create custom configuration templates
description: Create custom configuration templates
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.custom: devx-track-azurecli
author: dinethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---
# Create custom configuration templates

This article explains how to create a custom configuration template for Azure Arc-enabled data controller. 

One of required parameters during deployment of a data controller in indirectly connected mode, is the `az arcdata dc create --profile-name` parameter. Currently, the available list of built-in profiles can be found via running the query:

```azurecli
az arcdata dc config list
```

These profiles are template JSON files that have various settings for the Azure Arc-enabled data controller such as container registry and repository settings, storage classes for data and logs, storage size for data and logs, security, service type etc. and can be customized to your environment. 

However, in some cases, you may want to customize those configuration templates to meet your requirements and pass the customized configuration template using the `--path` parameter to the `az arcdata dc create` command rather than pass a preconfigured configuration template using the `--profile-name` parameter.

## Create control.json file

Run `az arcdata dc config init` to initiate a control.json file with pre-defined settings based on your distribution of Kubernetes cluster.
For instance, a template control.json file for a Kubernetes cluster based on the `azure-arc-kubeadm` template in a subdirectory called `custom` in the current working directory can be created as follows:

```azurecli
az arcdata dc config init --source azure-arc-kubeadm --path custom
```
The created control.json file can be edited in any editor such as Visual Studio Code to customize the settings appropriate for your environment.

## Use custom control.json file to deploy Azure Arc-enabled data controller using Azure CLI (az)

Once the template file is created, the file can be applied during Azure Arc-enabled data controller create command as follows:

```azurecli
az arcdata dc  create --path ./custom --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect  --k8s-namespace <namespace> --use-k8s

#Example:
#az arcdata dc  create --path ./custom --name arc --subscription <subscription ID> --resource-group my-resource-group --location eastus --connectivity-mode indirect --k8s-namespace <namespace> --use-k8s
```

## Use custom control.json file for deploying Azure Arc data controller using Azure portal

From the Azure Arc data controller create screen, select "Configure custom template" under Custom template. This will invoke a blade to provide custom settings. In this blade, you can either type in the values for the various settings, or upload a pre-configured control.json file directly. 

After ensuring the values are correct, click Apply to proceed with the Azure Arc data controller deployment.

## Next steps

* For direct connectivity mode: [Deploy data controller - direct connect mode (prerequisites)](create-data-controller-direct-prerequisites.md)

* For indirect connectivity mode: [Create data controller using CLI](create-data-controller-indirect-cli.md)
