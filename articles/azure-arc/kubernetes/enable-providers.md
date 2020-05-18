---
title: "Enable resource providers"
ms.service: arc-kubernetes
ms.date: 05/19/2020
ms.topic: article
author: mlearned
ms.author: mlearned
description: "Enable resource providers"
keywords: "Kubernetes, Arc, Azure, K8s, containers"
---

# Enable resource providers

## Enable required feature flags

In order to use Azure Arc enabled Kubernetes your Azure subscriptions need two feature flags enabled.

```console
az feature register --namespace Microsoft.Kubernetes --name previewAccess
az feature register --namespace Microsoft.KubernetesConfiguration --name sourceControlConfiguration
```

**Example output:**

```console
{
  "id": "/subscriptions/57ac26cf-a9f0-4908-b300-9a4e9a0fb205/providers/Microsoft.Features/providers/Microsoft.KubernetesConfiguration/features/sourceControlConfiguration",
  "name": "Microsoft.KubernetesConfiguration/sourceControlConfiguration",
  "properties": {
    "state": "Registered"
  },
  "type": "Microsoft.Features/providers/features"
}
```

## Verify feature flags

```console
az feature list -o table | grep Kubernetes
```

**Output:**

```console
Microsoft.Kubernetes/previewAccess                                                Registered
Microsoft.KubernetesConfiguration/sourceControlConfiguration                      Registered
```

If you receive an error, or do not see the following features in a `Registered` state, please check the following:

1. Ensure you are using the subscription that you provided to Microsoft: `az account set -s <subscription id>`
1. Re-check your feature flags

## Register Providers

Next, register the two providers for Azure Arc enabled Kubernetes:

```console
az provider register --namespace Microsoft.Kubernetes
Registering is still on-going. You can monitor using 'az provider show -n Microsoft.Kubernetes'

az provider register --namespace Microsoft.KubernetesConfiguration
Registering is still on-going. You can monitor using 'az provider show -n Microsoft.KubernetesConfiguration'
```

Registration is an asynchronous process. While registration should complete quickly (within 10 minutes). You may monitor registration process If you do not see registration state progress, reach out to <haikueng@microsoft.com>.

```console
az provider show -n Microsoft.Kubernetes -o table
```

**Output:**

```console
Namespace             RegistrationPolicy    RegistrationState
--------------------  --------------------  -------------------
Microsoft.Kubernetes  RegistrationRequired  Registered
```

```console
az provider show -n Microsoft.KubernetesConfiguration -o table
```

**Output:**

```console
Namespace                          RegistrationPolicy    RegistrationState
---------------------------------  --------------------  -------------------
Microsoft.KubernetesConfiguration  RegistrationRequired  Registered
```

## Next

* Return to the [README](../README.md#connect-your-first-cluster)
