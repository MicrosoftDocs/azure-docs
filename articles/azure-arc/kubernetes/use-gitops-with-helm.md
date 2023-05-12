---
title: "Deploy Helm Charts using GitOps on Azure Arc-enabled Kubernetes cluster"
ms.date: 05/08/2023
ms.topic: how-to
description: "Use GitOps with Helm for an Azure Arc-enabled cluster configuration"
---

# Deploy Helm Charts using GitOps on an Azure Arc-enabled Kubernetes cluster

> [!IMPORTANT]
> This article is for GitOps with Flux v1.  GitOps with Flux v2 is now available for Azure Arc-enabled Kubernetes and Azure Kubernetes Service (AKS) clusters; [go to the tutorial for GitOps with Flux v2](./tutorial-use-gitops-flux2.md). We recommend [migrating to Flux v2](conceptual-gitops-flux2.md#migrate-from-flux-v1) as soon as possible.
>
> Support for Flux v1-based cluster configuration resources created prior to January 1, 2024 will end on [May 24, 2025](https://azure.microsoft.com/updates/migrate-your-gitops-configurations-from-flux-v1-to-flux-v2-by-24-may-2025/). Starting on January 1, 2024, you won't be able to create new Flux v1-based cluster configuration resources.
Helm is an open-source packaging tool that helps you install and manage the lifecycle of Kubernetes applications. Similar to Linux package managers like APT and Yum, Helm is used to manage Kubernetes charts, which are packages of pre-configured Kubernetes resources.

This article shows you how to configure and use Helm with Azure Arc-enabled Kubernetes.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An existing Azure Arc-enabled Kubernetes connected cluster.
    - If you haven't connected a cluster yet, walk through our [Connect an Azure Arc-enabled Kubernetes cluster quickstart](quickstart-connect-cluster.md).
- An understanding of the benefits and architecture of this feature. Read more in [Configurations and GitOps - Azure Arc-enabled Kubernetes article](conceptual-configurations.md).
- Install the `k8s-configuration` Azure CLI extension of version >= 1.0.0:
  
  ```azurecli
  az extension add --name k8s-configuration
  ```

## Overview of using GitOps and Helm with Azure Arc-enabled Kubernetes

 The Helm operator provides an extension to Flux that automates Helm Chart releases. A Helm Chart release is described via a Kubernetes custom resource named HelmRelease. Flux synchronizes these resources from Git to the cluster, while the Helm operator makes sure Helm Charts are released as specified in the resources.

 The [example repository](https://github.com/Azure/arc-helm-demo) used in this article is structured in the following way:

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

In the Git repo we have two directories: one containing a Helm Chart and one containing the releases config. In the `releases` directory, the `app.yaml` contains the HelmRelease config, shown below:

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

| Field | Description |
| ------------- | ------------- | 
| `metadata.name` | Mandatory field. Needs to follow Kubernetes naming conventions. |
| `metadata.namespace` | Optional field. Determines where the release is created. |
| `spec.releaseName` | Optional field. If not provided the release name will be `$namespace-$name`. |
| `spec.chart.path` | The directory containing the chart (relative to the repository root). |
| `spec.values` | User customizations of default parameter values from the Chart itself. |

The options specified in the HelmRelease `spec.values` will override the options specified in `values.yaml` from the Chart source.

You can learn more about the HelmRelease in the official [Helm Operator documentation](https://docs.fluxcd.io/projects/helm-operator/en/stable/).

## Create a configuration

Using the Azure CLI extension for `k8s-configuration`, link your connected cluster to the example Git repository. Give this configuration the name `azure-arc-sample` and deploy the Flux operator in the `arc-k8s-demo` namespace.

```azurecli
az k8s-configuration create --name azure-arc-sample --cluster-name AzureArcTest1 --resource-group AzureArcTest --operator-instance-name flux --operator-namespace arc-k8s-demo --operator-params='--git-readonly --git-path=releases' --enable-helm-operator --helm-operator-chart-version='1.2.0' --helm-operator-params='--set helm.versions=v3' --repository-url https://github.com/Azure/arc-helm-demo.git --scope namespace --cluster-type connectedClusters
```

### Configuration parameters

To customize the creation of the configuration, [learn about additional parameters](./tutorial-use-gitops-connected-cluster.md#additional-parameters).

## Validate the configuration

Using the Azure CLI, verify that the configuration was successfully created.

```azurecli
az k8s-configuration show --name azure-arc-sample --cluster-name AzureArcTest1 --resource-group AzureArcTest --cluster-type connectedClusters
```

The configuration resource is updated with compliance status, messages, and debugging information.

```output
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
    "chartVersion": "1.2.0"
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

## Validate application

Run the following command and navigate to `localhost:8080` on your browser to verify that application is running.

```console
kubectl port-forward -n arc-k8s-demo svc/arc-k8s-demo 8080:8080
```

## Next steps

Apply cluster configurations at scale using [Azure Policy](./use-azure-policy.md).
