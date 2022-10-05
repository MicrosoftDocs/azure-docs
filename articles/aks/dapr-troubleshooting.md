---
title: Troubleshoot Dapr extension installation errors 
description: Troubleshoot errors you may encounter while installing the Dapr extension for AKS or Arc for Kubernetes
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: nigreenf
ms.service: container-service
ms.topic: article
ms.date: 09/15/2022
ms.custom: devx-track-azurecli
---

# Troubleshoot Dapr extension installation errors

This article details some common error messages you may encounter while installing the Dapr extension for Azure Kubernetes Service (AKS) or Arc for Kubernetes.

## Installation failure without an error message

If the extension fails to create or update without an error message, you can inspect where the creation of the extension failed by running the `az k8s-extension list` command. For example, if a wrong key is used in the configuration-settings, such as `global.ha=false` instead of `global.ha.enabled=false`: 

```azure-cli-interactive
az k8s-extension list --cluster-type managedClusters --cluster-name myCluster --resource-group myResourceGroup
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

Another example:

```azurecli
az k8s-extension list --cluster-type managedClusters --cluster-name myCluster --resource-group myResourceGroup
```

```json
"statuses": [
    {
      "code": "InstallationFailed",
      "displayStatus": null,
      "level": null,
      "message": "The extension operation failed with the following error: unable to add the configuration with configId {extension:microsoft-dapr} due to error: {error while adding the CRD configuration: error {failed to get the immutable configMap from the elevated namespace with err: configmaps 'extension-immutable-values' not found }}. (Code: ExtensionOperationFailed)",
      "time": null
    }
  ]
```

For these cases, possible remediation actions are to:

- [Restart your AKS or Arc for Kubernetes cluster](./start-stop-cluster.md).
- Make sure you've [registered the `KubernetesConfiguration` service provider](./dapr.md#register-the-kubernetesconfiguration-service-provider).
- Force delete and [reinstall the Dapr extension](./dapr.md). 

See below for examples of error messages you may encounter during Dapr extension install or update.

## Error: Dapr version doesn't exist

You're installing the Dapr extension and [targeting a specific version](./dapr.md#targeting-a-specific-dapr-version), but run into an error message saying the Dapr version doesn't exist. 

```
(ExtensionOperationFailed) The extension operation failed with the following error:  Failed to resolve the extension version from the given values.
Code: ExtensionOperationFailed
Message: The extension operation failed with the following error:  Failed to resolve the extension version from the given values.
```

Try installing again, making sure to use a [supported version of Dapr](./dapr.md#dapr-versions). 

## Error: Dapr version exists, but not in the mentioned region

Some versions of Dapr aren't available in all regions. If you receive an error message like the following, try installing in an [available region](./dapr.md#cloudsregions) where your Dapr version is supported.

```
(ExtensionTypeRegistrationGetFailed) Extension type microsoft.dapr is not registered in region <regionname>.
Code: ExtensionTypeRegistrationGetFailed
Message: Extension type microsoft.dapr is not registered in region <regionname>
```

## Error: `dapr-system` already exists

You're installing the Dapr extension for AKS or Arc for Kubernetes, but receive an error message indicating that Dapr already exists. This error message may look like:

```
(ExtensionOperationFailed) The extension operation failed with the following error:  Error: {failed to install chart from path [] for release [dapr-ext]: err [rendered manifests contain a resource that already exists. Unable to continue with install: ServiceAccount "dapr-operator" in namespace "dapr-system" exists and cannot be imported into the current release: invalid ownership metadata; annotation validation error: key "meta.helm.sh/release-name" must equal "dapr-ext": current value is "dapr"]} occurred while doing the operation : {Installing the extension} on the config
```

You need to uninstall Dapr OSS before installing the Dapr extension. For more information, read [Migrate from Dapr OSS](./dapr-migration.md).

## Next steps

If you're still running into issues, explore the [AKS troubleshooting guide](./troubleshooting.md) and the [Dapr OSS troubleshooting guide](https://docs.dapr.io/operations/troubleshooting/common_issues/).