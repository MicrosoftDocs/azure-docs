---
title: Troubleshooting Kubernetes Event-driven Autoscaling (KEDA) add-on
description: How to troubleshoot Kubernetes Event-driven Autoscaling add-on
services: container-service
ms.topic: article
ms.date: 8/26/2021
ms.author: tomkerkhove
---

# Kubernetes Event-driven Autoscaling (KEDA) AKS add-on Troubleshooting Guides

When you deploy the KEDA AKS add-on, you could possibly experience problems associated with configuration of the application autoscaler.

The following guide will assist you on how to troubleshoot errors and resolve common problems with the add-on, in addition to the official KEDA [FAQ][keda-faq] & [troubleshooting guide][keda-troubleshooting].

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

### Ensuring the cluster firewall is configured correctly

It might happen that KEDA isn't scaling applications because it can't start up.

When checking the operator logs, you might find errors similar to the following:

```output
1.6545953013458195e+09 ERROR Failed to get API Group-Resources {"error": "Get \"https://10.0.0.1:443/api?timeout=32s\": EOF"}
sigs.k8s.io/controller-runtime/pkg/cluster.New
/go/pkg/mod/sigs.k8s.io/controller-runtime@v0.11.2/pkg/cluster/cluster.go:160
sigs.k8s.io/controller-runtime/pkg/manager.New
/go/pkg/mod/sigs.k8s.io/controller-runtime@v0.11.2/pkg/manager/manager.go:313
main.main
/workspace/main.go:87
runtime.main
/usr/local/go/src/runtime/proc.go:255
1.6545953013459463e+09 ERROR setup unable to start manager {"error": "Get \"https://10.0.0.1:443/api?timeout=32s\": EOF"}
main.main
/workspace/main.go:97
runtime.main
/usr/local/go/src/runtime/proc.go:255
```

While in the metric server you might notice that it's not able to start up:

```output
I0607 09:53:05.297924 1 main.go:147] keda_metrics_adapter "msg"="KEDA Version: 2.7.1"
I0607 09:53:05.297979 1 main.go:148] keda_metrics_adapter "msg"="KEDA Commit: "
I0607 09:53:05.297996 1 main.go:149] keda_metrics_adapter "msg"="Go Version: go1.17.9"
I0607 09:53:05.298006 1 main.go:150] keda_metrics_adapter "msg"="Go OS/Arch: linux/amd64"
E0607 09:53:15.344324 1 logr.go:279] keda_metrics_adapter "msg"="Failed to get API Group-Resources" "error"="Get \"https://10.0.0.1:443/api?timeout=32s\": EOF"
E0607 09:53:15.344360 1 main.go:104] keda_metrics_adapter "msg"="failed to setup manager" "error"="Get \"https://10.0.0.1:443/api?timeout=32s\": EOF"
E0607 09:53:15.344378 1 main.go:209] keda_metrics_adapter "msg"="making provider" "error"="Get \"https://10.0.0.1:443/api?timeout=32s\": EOF"
E0607 09:53:15.344399 1 main.go:168] keda_metrics_adapter "msg"="unable to run external metrics adapter" "error"="Get \"https://10.0.0.1:443/api?timeout=32s\": EOF"
```

This most likely means that the KEDA add-on isn't able to start up due to a misconfigured firewall.

In order to make sure it runs correctly, make sure to configure the firewall to meet [the requirements][aks-firewall-requirements].

### Enabling add-on on clusters with self-managed open-source KEDA installations

While Kubernetes only allows one metric server to be installed, you can in theory install KEDA multiple times. However, it isn't recommended given only one installation will work.

When the KEDA add-on is installed in an AKS cluster, the previous installation of open-source KEDA will be overridden and the add-on will take over.

This means that the customization and configuration of the self-installed KEDA deployment will get lost and no longer be applied.

While there's a possibility that the existing autoscaling will keep on working, it introduces a risk given it will be configured differently and won't support features such as managed identity.

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

[aks-firewall-requirements]: limit-egress-traffic.md#azure-global-required-network-rules
[keda-troubleshooting]: https://keda.sh/docs/latest/troubleshooting/
[keda-faq]: https://keda.sh/docs/latest/faq/