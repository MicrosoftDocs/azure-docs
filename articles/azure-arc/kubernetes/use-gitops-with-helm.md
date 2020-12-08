---
title: "Deploy Helm Charts using GitOps on Arc enabled Kubernetes cluster(Preview)"
services: azure-arc
ms.service: azure-arc
#ms.subservice: azure-arc-kubernetes coming soon
ms.date: 05/19/2020
ms.topic: article
author: mlearned
ms.author: mlearned
description: "Use GitOps with Helm for an Azure Arc-enabled cluster configuration (Preview)"
keywords: "GitOps, Kubernetes, K8s, Azure, Helm, Arc, AKS, Azure Kubernetes Service, containers"
---

# Deploy Helm Charts using GitOps on Arc enabled Kubernetes cluster (Preview)

Helm is an open-source packaging tool that helps you install and manage the lifecycle of Kubernetes applications. Similar to Linux package managers such as APT and Yum, Helm is used to manage Kubernetes charts, which are packages of pre-configured Kubernetes resources.

This article shows you how to configure and use Helm with Azure Arc enabled Kubernetes.

## Before you begin

This article assumes that you have an existing Azure Arc enabled Kubernetes connected cluster. If you need a connected cluster, see the [connect a cluster quickstart](./connect-cluster.md).

## Overview of using GitOps and Helm with Azure Arc enabled Kubernetes

 The Helm operator provides an extension to Flux that automates Helm Chart releases. A Chart release is described through a Kubernetes custom resource named HelmRelease. Flux synchronizes these resources from git to the cluster, and the Helm operator makes sure Helm charts are released as specified in the resources.

 The [example repository](https://github.com/Azure/arc-helm-demo) used in this document is structured in the following way:

```console
├── charts
│   └── azure-arc-sample
│       ├── Chart.yaml
│       ├── templates
│       │   ├── NOTES.txt
│       │   ├── deployment.yaml
│       │   └── service.yaml
│       └── values.yaml
└── releases
    └── app.yaml
```

In the git repo we have two directories, one containing a Helm chart and one containing the releases config. In the `releases` directory, the `app.yaml` contains the HelmRelease config shown below:

```yaml
apiVersion: helm.fluxcd.io/v1
kind: HelmRelease
metadata:
  name: azure-arc-sample
  namespace: arc-k8s-demo
spec:
  releaseName: arc-k8s-demo
  chart:
    git: https://github.com/Azure/arc-helm-demo
    ref: master
    path: charts/azure-arc-sample
  values:
    serviceName: arc-k8s-demo
```

The Helm release config contains the following fields:

- `metadata.name` is mandatory, and needs to follow Kubernetes naming conventions
- `metadata.namespace` is optional, and determines where the release is created
- `spec.releaseName` is optional, and if not provided the release name will be $namespace-$name
- `spec.chart.path` is the directory containing the chart, given relative to the repository root
- `spec.values` are user customizations of default parameter values from the chart itself

The options specified in the HelmRelease spec.values will override the options specified in values.yaml from the chart source.

You can learn more about the HelmRelease in the official [Helm Operator documentation](https://docs.fluxcd.io/projects/helm-operator/en/stable/)

## Create a configuration

Using the Azure CLI extension for `k8sconfiguration`, let's link our connected cluster to the example git repository. We will give this configuration a name `azure-arc-sample` and deploy the Flux operator in the `arc-k8s-demo` namespace.

```console
az k8sconfiguration create --name azure-arc-sample --cluster-name AzureArcTest1 --resource-group AzureArcTest --operator-instance-name flux --operator-namespace arc-k8s-demo --operator-params='--git-readonly --git-path=releases' --enable-helm-operator --helm-operator-version='0.6.0' --helm-operator-params='--set helm.versions=v3' --repository-url https://github.com/Azure/arc-helm-demo.git --scope namespace --cluster-type connectedClusters
```

### Configuration Parameters

To customize the creation of configuration, [learn about additional parameters you may use](./use-gitops-connected-cluster.md#additional-parameters).

## Validate the Configuration

Using the Azure CLI, validate that the `sourceControlConfiguration` was successfully created.

```console
az k8sconfiguration show --name azure-arc-sample --cluster-name AzureArcTest1 --resource-group AzureArcTest --cluster-type connectedClusters
```

The `sourceControlConfiguration` resource is updated with compliance status, messages, and debugging information.

**Output:**

```console
Command group 'k8sconfiguration' is in preview. It may be changed/removed in a future release.
{
  "complianceStatus": {
    "complianceState": "Installed",
    "lastConfigApplied": "2019-12-05T05:34:41.481000",
    "message": "{\"OperatorMessage\":null,\"ClusterState\":null}",
    "messageLevel": "3"
  },
  "enableHelmOperator": "True",
  "helmOperatorProperties": {
    "chartValues": "--set helm.versions=v3",
    "chartVersion": "0.6.0"
  },
  "id": "/subscriptions/57ac26cf-a9f0-4908-b300-9a4e9a0fb205/resourceGroups/AzureArcTest/providers/Microsoft.Kubernetes/connectedClusters/AzureArcTest1/providers/Microsoft.KubernetesConfiguration/sourceControlConfigurations/azure-arc-sample",
  "name": "azure-arc-sample",
  "operatorInstanceName": "flux",
  "operatorNamespace": "arc-k8s-demo",
  "operatorParams": "--git-readonly --git-path=releases",
  "operatorScope": "namespace",
  "operatorType": "Flux",
  "provisioningState": "Succeeded",
  "repositoryPublicKey": "",
  "repositoryUrl": "https://github.com/Azure/arc-helm-demo.git",
  "resourceGroup": "AzureArcTest",
  "type": "Microsoft.KubernetesConfiguration/sourceControlConfigurations"
}
```

## Validate Application

Run the following command and navigate to `localhost:8080` on your browser to verify that application is running.

```console
kubectl port-forward -n arc-k8s-demo svc/arc-k8s-demo 8080:8080
```

## Next steps

- [Use Azure Policy to govern cluster configuration](./use-azure-policy.md)
