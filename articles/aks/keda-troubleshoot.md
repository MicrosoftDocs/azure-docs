---
title: Troubleshooting Kubernetes Event-driven Autoscaling (KEDA) add-on
description: How to troubleshoot Kubernetes Event-driven Autoscaling add-on
services: container-service
ms.topic: article
ms.date: 8/26/2021
ms.author: tomkerkhove
---

# Kubernetes Event-driven Autoscaling (KEDA) AKS add-on Troubleshooting Guides

When you deploy the KEDA AKS add-on, you could possibly experience problems associated with configuration of the application autoscaler. The following guide will assist you on how to troubleshoot errors and resolve common problems.

## Verifying and Troubleshooting KEDA components

### Check available KEDA version

You can check the available KEDA version by using the `kubectl` command:

```azurecli-interactive
kubectl get crd/scaledobjects.keda.sh -o custom-columns='APP:.metadata.labels.app\.kubernetes\.io/version'
```

An overview will be provided with the installed KEDA version:

```Output
APP
2.7.0
```

### Enabling add-on on clusters with self-managed open-source KEDA installations

While Kubernetes only allows one metric server to be installed, you can in theory install KEDA multiple times. However, it isn't recommended given only one installation will work.

When the KEDA add-on is installed in an AKS cluster, the previous installation of open-source KEDA will be overridden and the add-on will take over.

This means that the customization and configuration of the self-installed KEDA deployment will get lost and no longer be applied.

While there's a possibility that the existing autoscaling will keep on working, there's a risk given it will be configured differently and won't support features such as managed identity.

It's recommended to uninstall existing KEDA installations before enabling the KEDA add-on given the installation will succeed without any error.

In order to determine which metrics adapter is being used by KEDA, use the `kubectl` command:

```azurecli-interactive
kubectl get APIService/v1beta1.external.metrics.k8s.io -o custom-columns='NAME:.spec.service.name,NAMESPACE:.spec.service.namespace'
```

An overview will be provided showing the service and namespace that Kubernetes will use to get metrics:

```Output
NAME                              NAMESPACE
keda-operator-metrics-apiserver   kube-system
```

> [!WARNING]
> If the namespace is not `kube-system`, then the AKS add-on is being ignored and another metric server is being used.
