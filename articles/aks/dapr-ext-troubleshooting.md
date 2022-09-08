---
title: Troubleshoot Dapr extension installation errors 
description: Troubleshoot errors you may encounter while installing the Dapr extension for AKS or Arc for Kubernetes
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: nigreenf
ms.service: container-service
ms.topic: article
ms.date: 09/08/2022
ms.custom: devx-track-azurecli
---

# Troubleshoot Dapr extension installation errors

When you installing the Dapr extension for Azure Kubernetes Service (AKS) or Arc for Kubernetes, you might occasionally come across problems. This article details some common problems and troubleshooting steps.

## Dapr version doesn't exist

You're installing the Dapr extension and [targeting a specific version](./dapr.md#targeting-a-specific-dapr-version), but run into an error message saying the Dapr version doesn't exist. Try installing again, making sure to use a [supported version of Dapr](./dapr.md#dapr-versions). 

## Dapr version exists, but not in the mentioned region

Some versions of Dapr are not available in all regions. If you receive this error message, try installing in an [available region](./dapr.md#cloudsregions) where your Dapr version is supported.

## Dapr OSS already exists

You've used Dapr before and would like to install the Dapr extension for AKS or Arc for Kubernetes, but you receive an error message indicating that Dapr already exists. You need to uninstall Dapr OSS before installing the Dapr extension for AKS and Azure Arc for Kubernetes. For more information, read [Migrate from Dapr OSS](./dapr-migration.md).

## General extension install or update failure

If the extension fails to create or update, you can inspect where the creation of the extension failed by running the `az k8s-extension list` command. For example, if a wrong key is used in the configuration-settings, such as `global.ha=false` instead of `global.ha.enabled=false`: 

```azure-cli-interactive
az k8s-extension list --cluster-type managedClusters --cluster-name myAKSCluster --resource-group myResourceGroup
```

The below JSON is returned, and the error message is captured in the `message` property.

```json
"statuses": [
      {
        "code": "InstallationFailed",
        "displayStatus": null,
        "level": null,
        "message": "Error: {failed to install chart from path [] for release [dapr-1]: err [template: dapr/charts/dapr_sidecar_injector/templates/dapr_sidecar_injector_poddisruptionbudget.yaml:1:17: executing \"dapr/charts/dapr_sidecar_injector/templates/dapr_sidecar_injector_poddisruptionbudget.yaml\" at <.Values.global.ha.enabled>: can't evaluate field enabled in type interface {}]} occurred while doing the operation : {Installing the extension} on the config",
        "time": null
      }
],
```

## Solutions to common retry issues

Some errors while installing Dapr need a simple nudge in the right direction. If you run into a general error with no specific message during Dapr extension install, try the following steps:

- [Restart your AKS or Arc for Kubernetes cluster](./start-stop-cluster.md).
- Make sure you've [registered the `KubernetesConfiguration` service provider](./dapr.md#register-the-kubernetesconfiguration-service-provider).

# Next steps

If you're still running into issues, explore the [AKS troubleshooting guide](./troubleshooting.md) and the [Dapr OSS troubleshooting guide](https://docs.dapr.io/operations/troubleshooting/common_issues/).