---
title: "Use GitOps with Helm for an Azure Arc-enabled cluster configuration (Preview)"
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

# Use GitOps with Helm for an Azure Arc-enabled cluster configuration (Preview)

Helm is an open-source packaging tool that helps you install and manage the lifecycle of Kubernetes applications. Similar to Linux package managers such as APT and Yum, Helm is used to manage Kubernetes charts, which are packages of preconfigured Kubernetes resources.

This article shows you how to configure and use Helm with Azure Arc enabled Kubernetes.

## Before you begin

This article assumes that you have an existing Azure Arc enabled Kubernetes connected cluster. If you need a connected cluster, see the [connect a cluster quickstart](./connect-cluster.md).

Let's first set environment variables to use throughout this tutorial. You'll need the resource group name and cluster name for your connected cluster.

```bash
export RESOURCE_GROUP=<Resource_Group_Name>
export CLUSTER_NAME=<ClusterName>
```

## Verify your cluster is enabled with Arc

```bash
az connectedk8s list -g $RESOURCE_GROUP -o table
```

Output:
```bash
Name           Location    ResourceGroup
-------------  ----------  ---------------
arc-helm-demo  eastus      k8s-clusters
```

## Overview of using Helm with Azure Arc enabled Kubernetes

 The Helm operator provides an extension to Flux that automates Helm Chart releases. A Chart release is described through a Kubernetes custom resource named HelmRelease. Flux synchronizes these resources from git to the cluster, and the Helm operator makes sure Helm charts are released as specified in the resources.

 Below is an example git repo structure that we'll use in this tutorial:

```bash
├── charts
│   └── azure-vote
│       ├── Chart.yaml
│       ├── templates
│       │   ├── NOTES.txt
│       │   ├── deployment.yaml
│       │   └── service.yaml
│       └── values.yaml
└── releases
    └── prod
        └── azure-vote-app.yaml
```

In the git repo we have two directories, one containing a Helm chart and one containing the releases config. In the `releases/prod` directory the `azure-vote-app.yaml` contains the HelmRelease config shown below:

```bash
 apiVersion: helm.fluxcd.io/v1
 kind: HelmRelease
 metadata:
   name: azure-vote-app
   namespace: prod
   annotations:
 spec:
   releaseName: azure-vote-app
   chart:
     git: https://github.com/Azure/arc-helm-demo
     path: charts/azure-vote
     ref: master
   values:
     image:
       repository: dstrebel/azurevote
       tag: v1
     replicaCount: 3
```

The Helm release config contains the following fields:

- `metadata.name` is mandatory, and needs to follow Kubernetes naming conventions
- `metadata.namespace` is optional, and determines where the release is created
- `spec.releaseName` is optional, and if not provided the release name will be $namespace-$name
- `spec.chart.path` is the directory containing the chart, given relative to the repository root
- `spec.values` are user customizations of default parameter values from the chart itself

The options specified in the HelmRelease spec.values will override the options specified in values.yaml from the chart source.

You can learn more about the HelmRelease in the official [Helm Operator documentation](https://docs.fluxcd.io/projects/helm-operator/en/1.0.0-rc9/references/helmrelease-custom-resource.html)

## Create a configuration

Using the Azure CLI extension for `k8sconfiguration`, let's link our connected cluster to the example git repository. We will give this configuration a name `azure-voting-app` and deploy the Flux operator in the `prod` namespace.

```bash
az k8sconfiguration create --name azure-voting-app --resource-group  $RESOURCE_GROUP --cluster-name $CLUSTER_NAME --operator-instance-name azure-voting-app --operator-namespace prod --enable-helm-operator --helm-operator-version='0.6.0' --helm-operator-params='--set helm.versions=v3' --repository-url https://github.com/Azure/arc-helm-demo.git --operator-params='--git-readonly --git-path=releases/prod' --scope namespace --cluster-type connectedClusters
```

### Configuration Parameters

To customize the creation of configuration, [learn about additional parameters you may use](./use-gitops-connected-cluster.md#additional-parameters).


## Validate the Configuration

Using the Azure CLI, validate that the `sourceControlConfiguration` was successfully created.

```console
az k8sconfiguration show --resource-group $RESOURCE_GROUP --name azure-voting-app --cluster-name $CLUSTER_NAME --cluster-type connectedClusters
```

Note that the `sourceControlConfiguration` resource is updated with compliance status, messages, and debugging information.

**Output:**

```console
Command group 'k8sconfiguration' is in preview. It may be changed/removed in a future release.
{
  "complianceStatus": {
    "complianceState": "Compliant",
    "lastConfigApplied": "2019-12-05T05:34:41.481000",
    "message": "...",
    "messageLevel": "3"
  },
  "id": "/subscriptions/57ac26cf-a9f0-4908-b300-9a4e9a0fb205/resourceGroups/AzureArcTest/providers/Microsoft.Kubernetes/connectedClusters/AzureArcTest1/providers/Microsoft.KubernetesConfiguration/sourceControlConfigurations/cluster-config",
  "name": "azure-vote-app",
  "operatorInstanceName": "cluster-config",
  "operatorNamespace": "prod",
  "operatorParams": "--git-readonly --git-path=releases/prod",
  "operatorScope": "namespace",
  "operatorType": "Flux",
  "provisioningState": "Succeeded",
  "repositoryPublicKey": "...",
  "repositoryUrl": "git://github.com/Azure/arc-helm-demo.git",
  "resourceGroup": "AzureArcTest",
  "type": "Microsoft.KubernetesConfiguration/sourceControlConfigurations"
}
```

## Validate Application

We'll now check to verify the application is up and running by getting the service ip.

```bash
kubectl get svc/azure-vote-front -n prod
```

**Output:**

```bash
NAME               TYPE           CLUSTER-IP    EXTERNAL-IP      PORT(S)        AGE
azure-vote-front   LoadBalancer   10.0.14.161   52.186.160.216   80:30372/TCP   4d22h
```

Find the external IP address from the output above and open it in a browser.

## Next steps

- [Use Azure Policy to govern cluster configuration](./use-azure-policy.md)
