---
title: "Tutorial: Use GitOps with Flux v2 in Azure Arc-enabled Kubernetes or Azure Kubernetes Service (AKS) clusters"
description: "This tutorial shows how to use GitOps with Flux v2 to manage configuration and application deployment in Azure Arc and AKS clusters."
keywords: "GitOps, Flux, Flux v2, Kubernetes, K8s, Azure, Arc, AKS, Azure Kubernetes Service, containers, devops"
services: azure-arc, aks
ms.service: azure-arc
ms.date: 10/24/2022
ms.topic: tutorial
ms.custom: template-tutorial, devx-track-azurecli, references_regions, ignite-2022
---

# Tutorial: Use GitOps with Flux v2 in Azure Arc-enabled Kubernetes or AKS clusters

GitOps with Flux v2 can be enabled in Azure Kubernetes Service (AKS) managed clusters or Azure Arc-enabled Kubernetes connected clusters as a cluster extension. After the `microsoft.flux` cluster extension is installed, you can create one or more `fluxConfigurations` resources that sync your Git repository sources to the cluster and reconcile the cluster to the desired state. With GitOps, you can use your Git repository as the source of truth for cluster configuration and application deployment.

> [!NOTE]
> Eventually Azure will stop supporting GitOps with Flux v1, so begin using Flux v2 as soon as possible.

This tutorial describes how to use GitOps in a Kubernetes cluster. Before you dive in, take a moment to [learn how GitOps with Flux works conceptually](./conceptual-gitops-flux2.md).

> [!IMPORTANT]
> The `microsoft.flux` extension released major version 1.0.0. This includes the [multi-tenancy feature](#multi-tenancy). If you have existing GitOps Flux v2 configurations that use a previous version of the `microsoft.flux` extension you can upgrade to the latest extension manually using the Azure CLI: "az k8s-extension create -g <RESOURCE_GROUP> -c <CLUSTER_NAME> -n flux --extension-type microsoft.flux -t <CLUSTER_TYPE>" (use "-t connectedClusters" for Arc clusters and "-t managedClusters" for AKS clusters).

> [!TIP]
> When using this extension with [AKS hybrid clusters provisioned from Azure](extensions.md#aks-hybrid-clusters-provisioned-from-azure-preview) you must set `--cluster-type` to use `provisionedClusters` and also add `--cluster-resource-provider microsoft.hybridcontainerservice` to the command. Installing Azure Arc extensions on AKS hybrid clusters provisioned from Azure is currently in preview.

## Prerequisites

To manage GitOps through the Azure CLI or the Azure portal, you need the following:

### For Azure Arc-enabled Kubernetes clusters

* An Azure Arc-enabled Kubernetes connected cluster that's up and running.
  
  [Learn how to connect a Kubernetes cluster to  Azure Arc](./quickstart-connect-cluster.md). If you need to connect through an outbound proxy, then assure you [install the Arc agents with proxy settings](./quickstart-connect-cluster.md?tabs=azure-cli#connect-using-an-outbound-proxy-server).

* Read and write permissions on the `Microsoft.Kubernetes/connectedClusters` resource type.

### For Azure Kubernetes Service clusters

* An MSI-based AKS cluster that's up and running.

  > [!IMPORTANT]
  > **Ensure that the AKS cluster is created with MSI** (not SPN), because the `microsoft.flux` extension won't work with SPN-based AKS clusters.
  > For new AKS clusters created with “az aks create”, the cluster will be MSI-based by default. For already created SPN-based clusters that need to be converted to MSI run “az aks update -g $RESOURCE_GROUP -n $CLUSTER_NAME --enable-managed-identity”. For more information, refer to [managed identity docs](../../aks/use-managed-identity.md).

* Read and write permissions on the `Microsoft.ContainerService/managedClusters` resource type.

### Common to both cluster types

* Read and write permissions on these resource types:

  * `Microsoft.KubernetesConfiguration/extensions`
  * `Microsoft.KubernetesConfiguration/fluxConfigurations`

* Azure CLI version 2.15 or later. [Install the Azure CLI](/cli/azure/install-azure-cli) or use the following commands to update to the latest version:

  ```console
  az version
  az upgrade
  ```

* Registration of the following Azure service providers. (It's OK to re-register an existing provider.)

  ```console
  az provider register --namespace Microsoft.Kubernetes
  az provider register --namespace Microsoft.ContainerService
  az provider register --namespace Microsoft.KubernetesConfiguration
  ```

  Registration is an asynchronous process and should finish within 10 minutes. Use the following code to monitor the registration process:

  ```console
  az provider show -n Microsoft.KubernetesConfiguration -o table

  Namespace                          RegistrationPolicy    RegistrationState
  ---------------------------------  --------------------  -------------------
  Microsoft.KubernetesConfiguration  RegistrationRequired  Registered
  ```

### Version and region support

GitOps is currently supported in [all regions that Azure Arc-enabled Kubernetes supports](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=kubernetes-service,azure-arc). GitOps is currently supported in a subset of the regions that AKS supports. The GitOps service is adding new supported regions on a regular cadence.

The most recent version of the Flux v2 extension and the two previous versions (N-2) are supported. We generally recommend that you use the most recent version of the extension.

### Network requirements

The GitOps agents require outbound (egress) TCP to the repo source on either port 22 (SSH) or port 443 (HTTPS) to function. The agents also require the following outbound URLs:

| Endpoint (DNS) | Description |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `https://management.azure.com` | Required for the agent to communicate with the Kubernetes Configuration service. |
| `https://<region>.dp.kubernetesconfiguration.azure.com` | Data plane endpoint for the agent to push status and fetch configuration information. Depends on `<region>` (the supported regions mentioned earlier). |
| `https://login.microsoftonline.com` | Required to fetch and update Azure Resource Manager tokens. |
| `https://mcr.microsoft.com` | Required to pull container images for Flux controllers. |

## Enable CLI extensions

>[!NOTE]
>The `k8s-configuration` CLI extension manages either Flux v2 or Flux v1 configurations. Eventually Azure will stop supporting GitOps with Flux v1, so begin using Flux v2 as soon as possible. 

Install the latest `k8s-configuration` and `k8s-extension` CLI extension packages:

```console
az extension add -n k8s-configuration
az extension add -n k8s-extension
```

To update these packages, use the following commands:

```console
az extension update -n k8s-configuration
az extension update -n k8s-extension
```

To see the list of az CLI extensions installed and their versions, use the following command:

```console
az extension list -o table

Experimental   ExtensionType   Name                   Path                                                       Preview   Version
-------------  --------------  -----------------      -----------------------------------------------------      --------  --------
False          whl             connectedk8s           C:\Users\somename\.azure\cliextensions\connectedk8s         False     1.2.7
False          whl             k8s-configuration      C:\Users\somename\.azure\cliextensions\k8s-configuration    False     1.5.0
False          whl             k8s-extension          C:\Users\somename\.azure\cliextensions\k8s-extension        False     1.1.0
```

> [!TIP]
> For help resolving any errors, see the Flux v2 suggestions in [Azure Arc-enabled Kubernetes and GitOps troubleshooting](troubleshooting.md#flux-v2---general).

## Apply a Flux configuration by using the Azure CLI

Use the `k8s-configuration` Azure CLI extension (or the Azure portal) to enable GitOps in an AKS or Arc-enabled Kubernetes cluster. For a demonstration, use the public [gitops-flux2-kustomize-helm-mt](https://github.com/Azure/gitops-flux2-kustomize-helm-mt) repository.

> [!IMPORTANT]
> The demonstration repo is designed to simplify your use of this tutorial and illustrate some key principles. To keep up to date, the repo can get breaking changes occasionally from version upgrades. These changes won't affect your new application of this tutorial, only previous tutorial applications that have not been deleted. To learn how to handle these changes please see the [breaking change disclaimer](https://github.com/Azure/gitops-flux2-kustomize-helm-mt#breaking-change-disclaimer-%EF%B8%8F).

In the following example:

* The resource group that contains the cluster is `flux-demo-rg`.
* The name of the Azure Arc cluster is `flux-demo-arc`.
* The cluster type is Azure Arc (`-t connectedClusters`), but this example also works with AKS (`-t managedClusters`).
* The name of the Flux configuration is `cluster-config`.
* The namespace for configuration installation is `cluster-config`.
* The URL for the public Git repository is `https://github.com/Azure/gitops-flux2-kustomize-helm-mt`.
* The Git repository branch is `main`.
* The scope of the configuration is `cluster`. This gives the operators permissions to make changes throughout cluster. To use `namespace` scope with this tutorial, [see the changes needed](#multi-tenancy).
* Two kustomizations are specified with names `infra` and `apps`. Each is associated with a path in the repository.
* The `apps` kustomization depends on the `infra` kustomization. (The `infra` kustomization must finish before the `apps` kustomization runs.)
* Set `prune=true` on both kustomizations. This setting assures that the objects that Flux deployed to the cluster will be cleaned up if they're removed from the repository or if the Flux configuration or kustomizations are deleted.

If the `microsoft.flux` extension isn't already installed in the cluster, it'll be installed. When the flux configuration is installed, the initial compliance state may be "Pending" or "Non-compliant" because reconciliation is still on-going. After a minute, you can query the configuration again and see the final compliance state.

```console
az k8s-configuration flux create -g flux-demo-rg \
-c flux-demo-arc \
-n cluster-config \
--namespace cluster-config \
-t connectedClusters \
--scope cluster \
-u https://github.com/Azure/gitops-flux2-kustomize-helm-mt \
--branch main  \
--kustomization name=infra path=./infrastructure prune=true \
--kustomization name=apps path=./apps/staging prune=true dependsOn=\["infra"\]

'Microsoft.Flux' extension not found on the cluster, installing it now. This may take a few minutes...
'Microsoft.Flux' extension was successfully installed on the cluster
Creating the flux configuration 'cluster-config' in the cluster. This may take a few minutes...
{
  "complianceState": "Pending",
  ... (not shown because of pending status)
}
```

Show the configuration after allowing time to finish reconciliations.

```console
az k8s-configuration flux show -g flux-demo-rg -c flux-demo-arc -n cluster-config -t connectedClusters
{
  "bucket": null,
  "complianceState": "Compliant",
  "configurationProtectedSettings": {},
  "errorMessage": "",
  "gitRepository": {
    "httpsCaCert": null,
    "httpsUser": null,
    "localAuthRef": null,
    "repositoryRef": {
      "branch": "main",
      "commit": null,
      "semver": null,
      "tag": null
    },
    "sshKnownHosts": null,
    "syncIntervalInSeconds": 600,
    "timeoutInSeconds": 600,
    "url": "https://github.com/Azure/gitops-flux2-kustomize-helm-mt"
  },
  "id": "/subscriptions/REDACTED/resourceGroups/flux-demo-rg/providers/Microsoft.Kubernetes/connectedClusters/flux-demo-arc/providers/Microsoft.KubernetesConfiguration/fluxConfigurations/cluster-config",
  "kustomizations": {
    "apps": {
      "dependsOn": [
        "infra"
      ],
      "force": false,
      "name": "apps",
      "path": "./apps/staging",
      "prune": true,
      "retryIntervalInSeconds": null,
      "syncIntervalInSeconds": 600,
      "timeoutInSeconds": 600
    },
    "infra": {
      "dependsOn": null,
      "force": false,
      "name": "infra",
      "path": "./infrastructure",
      "prune": true,
      "retryIntervalInSeconds": null,
      "syncIntervalInSeconds": 600,
      "timeoutInSeconds": 600
    }
  },
  "name": "cluster-config",
  "namespace": "cluster-config",
  "provisioningState": "Succeeded",
  "repositoryPublicKey": "",
  "resourceGroup": "Flux2-Test-RG-EUS",
  "scope": "cluster",
  "sourceKind": "GitRepository",
  "sourceSyncedCommitId": "main/4f1bdad4d0a54b939a5e3d52c51464f67e474fcf",
  "sourceUpdatedAt": "2022-04-06T17:34:03+00:00",
  "statusUpdatedAt": "2022-04-06T17:44:56.417000+00:00",
  "statuses": [
    {
      "appliedBy": null,
      "complianceState": "Compliant",
      "helmReleaseProperties": null,
      "kind": "GitRepository",
      "name": "cluster-config",
      "namespace": "cluster-config",
      "statusConditions": [
        {
          "lastTransitionTime": "2022-04-06T17:33:32+00:00",
          "message": "Fetched revision: main/4f1bdad4d0a54b939a5e3d52c51464f67e474fcf",
          "reason": "GitOperationSucceed",
          "status": "True",
          "type": "Ready"
        }
      ]
    },
    {
      "appliedBy": null,
      "complianceState": "Compliant",
      "helmReleaseProperties": null,
      "kind": "Kustomization",
      "name": "cluster-config-apps",
      "namespace": "cluster-config",
      "statusConditions": [
        {
          "lastTransitionTime": "2022-04-06T17:44:04+00:00",
          "message": "Applied revision: main/4f1bdad4d0a54b939a5e3d52c51464f67e474fcf",
          "reason": "ReconciliationSucceeded",
          "status": "True",
          "type": "Ready"
        }
      ]
    },
    {
      "appliedBy": {
        "name": "cluster-config-apps",
        "namespace": "cluster-config"
      },
      "complianceState": "Compliant",
      "helmReleaseProperties": {
        "failureCount": 0,
        "helmChartRef": {
          "name": "cluster-config-podinfo",
          "namespace": "cluster-config"
        },
        "installFailureCount": 0,
        "lastRevisionApplied": 1,
        "upgradeFailureCount": 0
      },
      "kind": "HelmRelease",
      "name": "podinfo",
      "namespace": "cluster-config",
      "statusConditions": [
        {
          "lastTransitionTime": "2022-04-06T17:33:43+00:00",
          "message": "Release reconciliation succeeded",
          "reason": "ReconciliationSucceeded",
          "status": "True",
          "type": "Ready"
        },
        {
          "lastTransitionTime": "2022-04-06T17:33:43+00:00",
          "message": "Helm install succeeded",
          "reason": "InstallSucceeded",
          "status": "True",
          "type": "Released"
        }
      ]
    },
    {
      "appliedBy": null,
      "complianceState": "Compliant",
      "helmReleaseProperties": null,
      "kind": "Kustomization",
      "name": "cluster-config-infra",
      "namespace": "cluster-config",
      "statusConditions": [
        {
          "lastTransitionTime": "2022-04-06T17:43:33+00:00",
          "message": "Applied revision: main/4f1bdad4d0a54b939a5e3d52c51464f67e474fcf",
          "reason": "ReconciliationSucceeded",
          "status": "True",
          "type": "Ready"
        }
      ]
    },
    {
      "appliedBy": {
        "name": "cluster-config-infra",
        "namespace": "cluster-config"
      },
      "complianceState": "Compliant",
      "helmReleaseProperties": null,
      "kind": "HelmRepository",
      "name": "bitnami",
      "namespace": "cluster-config",
      "statusConditions": [
        {
          "lastTransitionTime": "2022-04-06T17:33:36+00:00",
          "message": "Fetched revision: 46a41610ea410558eb485bcb673fd01c4d1f47b86ad292160b256555b01cce81",
          "reason": "IndexationSucceed",
          "status": "True",
          "type": "Ready"
        }
      ]
    },
    {
      "appliedBy": {
        "name": "cluster-config-infra",
        "namespace": "cluster-config"
      },
      "complianceState": "Compliant",
      "helmReleaseProperties": null,
      "kind": "HelmRepository",
      "name": "podinfo",
      "namespace": "cluster-config",
      "statusConditions": [
        {
          "lastTransitionTime": "2022-04-06T17:33:33+00:00",
          "message": "Fetched revision: 421665ba04fab9b275b9830947417b2cebf67764eee46d568c94cf2a95a6341d",
          "reason": "IndexationSucceed",
          "status": "True",
          "type": "Ready"
        }
      ]
    },
    {
      "appliedBy": {
        "name": "cluster-config-infra",
        "namespace": "cluster-config"
      },
      "complianceState": "Compliant",
      "helmReleaseProperties": {
        "failureCount": 0,
        "helmChartRef": {
          "name": "cluster-config-nginx",
          "namespace": "cluster-config"
        },
        "installFailureCount": 0,
        "lastRevisionApplied": 1,
        "upgradeFailureCount": 0
      },
      "kind": "HelmRelease",
      "name": "nginx",
      "namespace": "cluster-config",
      "statusConditions": [
        {
          "lastTransitionTime": "2022-04-06T17:34:13+00:00",
          "message": "Release reconciliation succeeded",
          "reason": "ReconciliationSucceeded",
          "status": "True",
          "type": "Ready"
        },
        {
          "lastTransitionTime": "2022-04-06T17:34:13+00:00",
          "message": "Helm install succeeded",
          "reason": "InstallSucceeded",
          "status": "True",
          "type": "Released"
        }
      ]
    },
    {
      "appliedBy": {
        "name": "cluster-config-infra",
        "namespace": "cluster-config"
      },
      "complianceState": "Compliant",
      "helmReleaseProperties": {
        "failureCount": 0,
        "helmChartRef": {
          "name": "cluster-config-redis",
          "namespace": "cluster-config"
        },
        "installFailureCount": 0,
        "lastRevisionApplied": 1,
        "upgradeFailureCount": 0
      },
      "kind": "HelmRelease",
      "name": "redis",
      "namespace": "cluster-config",
      "statusConditions": [
        {
          "lastTransitionTime": "2022-04-06T17:33:57+00:00",
          "message": "Release reconciliation succeeded",
          "reason": "ReconciliationSucceeded",
          "status": "True",
          "type": "Ready"
        },
        {
          "lastTransitionTime": "2022-04-06T17:33:57+00:00",
          "message": "Helm install succeeded",
          "reason": "InstallSucceeded",
          "status": "True",
          "type": "Released"
        }
      ]
    },
    {
      "appliedBy": {
        "name": "cluster-config-infra",
        "namespace": "cluster-config"
      },
      "complianceState": "Compliant",
      "helmReleaseProperties": null,
      "kind": "HelmChart",
      "name": "test-chart",
      "namespace": "cluster-config",
      "statusConditions": [
        {
          "lastTransitionTime": "2022-04-06T17:33:40+00:00",
          "message": "Pulled 'redis' chart with version '11.3.4'.",
          "reason": "ChartPullSucceeded",
          "status": "True",
          "type": "Ready"
        }
      ]
    }
  ],
  "suspend": false,
  "systemData": {
    "createdAt": "2022-04-06T17:32:44.646629+00:00",
    "createdBy": null,
    "createdByType": null,
    "lastModifiedAt": "2022-04-06T17:32:44.646629+00:00",
    "lastModifiedBy": null,
    "lastModifiedByType": null
  },
  "type": "Microsoft.KubernetesConfiguration/fluxConfigurations"
}
```

These namespaces were created:

* `flux-system`: Holds the Flux extension controllers.
* `cluster-config`: Holds the Flux configuration objects.
* `nginx`, `podinfo`, `redis`: Namespaces for workloads described in manifests in the Git repository.

```console
kubectl get namespaces
```

The `flux-system` namespace contains the Flux extension objects:  

* Azure Flux controllers: `fluxconfig-agent`, `fluxconfig-controller`
* OSS Flux controllers: `source-controller`, `kustomize-controller`, `helm-controller`, `notification-controller`

The Flux agent and controller pods should be in a running state.

```console
kubectl get pods -n flux-system

NAME                                      READY   STATUS    RESTARTS   AGE
fluxconfig-agent-9554ffb65-jqm8g          2/2     Running   0          21m
fluxconfig-controller-9d99c54c8-nztg8     2/2     Running   0          21m
helm-controller-59cc74dbc5-77772          1/1     Running   0          21m
kustomize-controller-5fb7d7b9d5-cjdhx     1/1     Running   0          21m
notification-controller-7d45678bc-fvlvr   1/1     Running   0          21m
source-controller-df7dc97cd-4drh2         1/1     Running   0          21m
```

The namespace `cluster-config` has the Flux configuration objects.

```console
kubectl get crds

NAME                                                   CREATED AT
alerts.notification.toolkit.fluxcd.io                  2022-04-06T17:15:48Z
arccertificates.clusterconfig.azure.com                2022-03-28T21:45:19Z
azureclusteridentityrequests.clusterconfig.azure.com   2022-03-28T21:45:19Z
azureextensionidentities.clusterconfig.azure.com       2022-03-28T21:45:19Z
buckets.source.toolkit.fluxcd.io                       2022-04-06T17:15:48Z
connectedclusters.arc.azure.com                        2022-03-28T21:45:19Z
customlocationsettings.clusterconfig.azure.com         2022-03-28T21:45:19Z
extensionconfigs.clusterconfig.azure.com               2022-03-28T21:45:19Z
fluxconfigs.clusterconfig.azure.com                    2022-04-06T17:15:48Z
gitconfigs.clusterconfig.azure.com                     2022-03-28T21:45:19Z
gitrepositories.source.toolkit.fluxcd.io               2022-04-06T17:15:48Z
helmcharts.source.toolkit.fluxcd.io                    2022-04-06T17:15:48Z
helmreleases.helm.toolkit.fluxcd.io                    2022-04-06T17:15:48Z
helmrepositories.source.toolkit.fluxcd.io              2022-04-06T17:15:48Z
imagepolicies.image.toolkit.fluxcd.io                  2022-04-06T17:15:48Z
imagerepositories.image.toolkit.fluxcd.io              2022-04-06T17:15:48Z
imageupdateautomations.image.toolkit.fluxcd.io         2022-04-06T17:15:48Z
kustomizations.kustomize.toolkit.fluxcd.io             2022-04-06T17:15:48Z
providers.notification.toolkit.fluxcd.io               2022-04-06T17:15:48Z
receivers.notification.toolkit.fluxcd.io               2022-04-06T17:15:48Z
volumesnapshotclasses.snapshot.storage.k8s.io          2022-03-28T21:06:12Z
volumesnapshotcontents.snapshot.storage.k8s.io         2022-03-28T21:06:12Z
volumesnapshots.snapshot.storage.k8s.io                2022-03-28T21:06:12Z
websites.extensions.example.com                        2022-03-30T23:42:32Z
```

```console
kubectl get fluxconfigs -A

NAMESPACE        NAME             SCOPE     URL                                                       PROVISION   AGE
cluster-config   cluster-config   cluster   https://github.com/Azure/gitops-flux2-kustomize-helm-mt   Succeeded   44m
```

```console
kubectl get gitrepositories -A

NAMESPACE        NAME             URL                                                       READY   STATUS                                                            AGE
cluster-config   cluster-config   https://github.com/Azure/gitops-flux2-kustomize-helm-mt   True    Fetched revision: main/4f1bdad4d0a54b939a5e3d52c51464f67e474fcf   45m
```

```console
kubectl get helmreleases -A

NAMESPACE        NAME      READY   STATUS                             AGE
cluster-config   nginx     True    Release reconciliation succeeded   66m
cluster-config   podinfo   True    Release reconciliation succeeded   66m
cluster-config   redis     True    Release reconciliation succeeded   66m
```

```console
kubectl get kustomizations -A


NAMESPACE        NAME                   READY   STATUS                                                            AGE
cluster-config   cluster-config-apps    True    Applied revision: main/4f1bdad4d0a54b939a5e3d52c51464f67e474fcf   65m
cluster-config   cluster-config-infra   True    Applied revision: main/4f1bdad4d0a54b939a5e3d52c51464f67e474fcf   65m
```

Workloads are deployed from manifests in the Git repository.

```console
kubectl get deploy -n nginx

NAME                                       READY   UP-TO-DATE   AVAILABLE   AGE
nginx-ingress-controller                   1/1     1            1           67m
nginx-ingress-controller-default-backend   1/1     1            1           67m

kubectl get deploy -n podinfo

NAME      READY   UP-TO-DATE   AVAILABLE   AGE
podinfo   1/1     1            1           68m

kubectl get all -n redis

NAME                 READY   STATUS    RESTARTS   AGE
pod/redis-master-0   1/1     Running   0          68m

NAME                     TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
service/redis-headless   ClusterIP   None          <none>        6379/TCP   68m
service/redis-master     ClusterIP   10.0.13.182   <none>        6379/TCP   68m

NAME                            READY   AGE
statefulset.apps/redis-master   1/1     68m
```

### Delete the Flux configuration

You can delete the Flux configuration by using the following command. This action deletes both the `fluxConfigurations` resource in Azure and the Flux configuration objects in the cluster. Because the Flux configuration was originally created with the `prune=true` parameter for the kustomization, all of the objects created in the cluster based on manifests in the Git repository will be removed when the Flux configuration is removed.

```console
az k8s-configuration flux delete -g flux-demo-rg -c flux-demo-arc -n cluster-config -t connectedClusters --yes
```

For an AKS cluster, use the same command but with `-t managedClusters`replacing `-t connectedClusters`.

Note that this action does *not* remove the Flux extension.

### Delete the Flux cluster extension

You can delete the Flux extension by using either the CLI or the portal. The delete action removes both the `microsoft.flux` extension resource in Azure and the Flux extension objects in the cluster.

If the Flux extension was created automatically when the Flux configuration was first created, the extension name will be `flux`.

For an Azure Arc-enabled Kubernetes cluster, use this command:

```console
az k8s-extension delete -g flux-demo-rg -c flux-demo-arc -n flux -t connectedClusters --yes
```

For an AKS cluster, use the same command but with `-t managedClusters`replacing `-t connectedClusters`.

### Control which controllers are deployed with the Flux cluster extension

The `source`, `helm`, `kustomize`, and `notification` Flux controllers are installed by default. The `image-automation` and `image-reflector` controllers must be enabled explicitly. You can use the `k8s-extension` CLI to make those choices:

* `--config source-controller.enabled=<true/false>` (default `true`)
* `--config helm-controller.enabled=<true/false>` (default `true`)
* `--config kustomize-controller.enabled=<true/false>` (default `true`)
* `--config notification-controller.enabled=<true/false>` (default `true`)
* `--config image-automation-controller.enabled=<true/false>` (default `false`)
* `--config image-reflector-controller.enabled=<true/false>` (default `false`)

Here's an example for including the [Flux image-reflector and image-automation controllers](https://fluxcd.io/docs/components/image/). If the Flux extension was created automatically when a Flux configuration was first created, the extension name will be `flux`.

```console
az k8s-extension create -g <cluster_resource_group> -c <cluster_name> -t <connectedClusters or managedClusters> --name flux --extension-type microsoft.flux --config image-automation-controller.enabled=true image-reflector-controller.enabled=true
```

### Using Kubelet identity as authentication method for Azure Kubernetes Clusters

When working with Azure Kubernetes clusters, one of the authentication options to use is kubelet identity. In order to let Flux use this, add a parameter --config useKubeletIdentity=true at the time of Flux extension installation.

```console
az k8s-extension create --resource-group <resource-group> --cluster-name <cluster-name> --cluster-type managedClusters --name flux --extension-type microsoft.flux --config useKubeletIdentity=true
```

### Red Hat OpenShift onboarding guidance

Flux controllers require a **nonroot** [Security Context Constraint](https://access.redhat.com/documentation/en-us/openshift_container_platform/4.2/html/authentication/managing-pod-security-policies) to properly provision pods on the cluster. These constraints must be added to the cluster prior to onboarding of the `microsoft.flux` extension.

```console
NS="flux-system"
oc adm policy add-scc-to-user nonroot system:serviceaccount:$NS:kustomize-controller
oc adm policy add-scc-to-user nonroot system:serviceaccount:$NS:helm-controller
oc adm policy add-scc-to-user nonroot system:serviceaccount:$NS:source-controller
oc adm policy add-scc-to-user nonroot system:serviceaccount:$NS:notification-controller
oc adm policy add-scc-to-user nonroot system:serviceaccount:$NS:image-automation-controller
oc adm policy add-scc-to-user nonroot system:serviceaccount:$NS:image-reflector-controller
```

For more information on OpenShift guidance for onboarding Flux, refer to the [Flux documentation](https://fluxcd.io/docs/use-cases/openshift/#openshift-setup).

## Work with parameters

For a description of all parameters that Flux supports, see the [official Flux documentation](https://fluxcd.io/docs/). Flux in Azure doesn't support all parameters yet. Let us know if a parameter you need is missing from the Azure implementation.

You can see the full list of parameters that the `k8s-configuration flux` CLI command supports by using the `-h` parameter:

```console
az k8s-configuration flux -h

Group
    az k8s-configuration flux : Commands to manage Flux v2 Kubernetes configurations.

Subgroups:
    deployed-object : Commands to see deployed objects associated with Flux v2 Kubernetes
                      configurations.
    kustomization   : Commands to manage Kustomizations associated with Flux v2 Kubernetes
                      configurations.

Commands:
    create          : Create a Flux v2 Kubernetes configuration.
    delete          : Delete a Flux v2 Kubernetes configuration.
    list            : List all Flux v2 Kubernetes configurations.
    show            : Show a Flux v2 Kubernetes configuration.
    update          : Update a Flux v2 Kubernetes configuration.
```

Here are the parameters for the `k8s-configuration flux create` CLI command:

```console
az k8s-configuration flux create -h

This command is from the following extension: k8s-configuration

Command
    az k8s-configuration flux create : Create a Flux v2 Kubernetes configuration.

Arguments
    --cluster-name -c   [Required] : Name of the Kubernetes cluster.
    --cluster-type -t   [Required] : Specify Arc connected clusters or AKS managed clusters.
                                     Allowed values: connectedClusters, managedClusters.
    --name -n           [Required] : Name of the flux configuration.
    --resource-group -g [Required] : Name of resource group. You can configure the default group
                                     using `az configure --defaults group=<name>`.
    --url -u            [Required] : URL of the source to reconcile.
    --bucket-insecure              : Communicate with a bucket without TLS.  Allowed values: false,
                                     true.
    --bucket-name                  : Name of the S3 bucket to sync.
    --container-name               : Name of the Azure Blob Storage container to sync
    --interval --sync-interval     : Time between reconciliations of the source on the cluster.
    --kind                         : Source kind to reconcile.  Allowed values: bucket, git, azblob.
                                     Default: git.
    --kustomization -k             : Define kustomizations to sync sources with parameters ['name',
                                     'path', 'depends_on', 'timeout', 'sync_interval',
                                     'retry_interval', 'prune', 'force'].
    --namespace --ns               : Namespace to deploy the configuration.  Default: default.
    --no-wait                      : Do not wait for the long-running operation to finish.
    --scope -s                     : Specify scope of the operator to be 'namespace' or 'cluster'.
                                     Allowed values: cluster, namespace.  Default: cluster.
    --suspend                      : Suspend the reconciliation of the source and kustomizations
                                     associated with this configuration.  Allowed values: false,
                                     true.
    --timeout                      : Maximum time to reconcile the source before timing out.

Auth Arguments
    --local-auth-ref --local-ref   : Local reference to a kubernetes secret in the configuration
                                     namespace to use for communication to the source.

Bucket Auth Arguments
    --bucket-access-key            : Access Key ID used to authenticate with the bucket.
    --bucket-secret-key            : Secret Key used to authenticate with the bucket.

Git Auth Arguments
    --https-ca-cert                : Base64-encoded HTTPS CA certificate for TLS communication with
                                     private repository sync.
    --https-ca-cert-file           : File path to HTTPS CA certificate file for TLS communication
                                     with private repository sync.
    --https-key                    : HTTPS token/password for private repository sync.
    --https-user                   : HTTPS username for private repository sync.
    --known-hosts                  : Base64-encoded known_hosts data containing public SSH keys
                                     required to access private Git instances.
    --known-hosts-file             : File path to known_hosts contents containing public SSH keys
                                     required to access private Git instances.
    --ssh-private-key              : Base64-encoded private ssh key for private repository sync.
    --ssh-private-key-file         : File path to private ssh key for private repository sync.

Git Repo Ref Arguments
    --branch                       : Branch within the git source to reconcile with the cluster.
    --commit                       : Commit within the git source to reconcile with the cluster.
    --semver                       : Semver range within the git source to reconcile with the
                                     cluster.
    --tag                          : Tag within the git source to reconcile with the cluster.

Global Arguments
    --debug                        : Increase logging verbosity to show all debug logs.
    --help -h                      : Show this help message and exit.
    --only-show-errors             : Only show errors, suppressing warnings.
    --output -o                    : Output format.  Allowed values: json, jsonc, none, table, tsv,
                                     yaml, yamlc.  Default: json.
    --query                        : JMESPath query string. See http://jmespath.org/ for more
                                     information and examples.
    --subscription                 : Name or ID of subscription. You can configure the default
                                     subscription using `az account set -s NAME_OR_ID`.
    --verbose                      : Increase logging verbosity. Use --debug for full debug logs.
    
Azure Blob Storage Account Auth Arguments
    --sp_client_id                 : The client ID for authenticating a service principal with Azure Blob, required for this authentication method
    --sp_tenant_id                 : The tenant ID for authenticating a service principal with Azure Blob, required for this authentication method
    --sp_client_secret             : The client secret for authenticating a service principal with Azure Blob
    --sp_client_cert               : The Base64 encoded client certificate for authenticating a service principal with Azure Blob
    --sp_client_cert_password      : The password for the client certificate used to authenticate a service principal with Azure Blob
    --sp_client_cert_send_chain    : Specifies whether to include x5c header in client claims when acquiring a token to enable subject name / issuer based authentication for the client certificate
    --account_key                  : The Azure Blob Shared Key for authentication
    --sas_token                    : The Azure Blob SAS Token for authentication
    --mi_client_id                 : The client ID of the managed identity for authentication with Azure Blob

Examples
    Create a Flux v2 Kubernetes configuration
        az k8s-configuration flux create --resource-group my-resource-group \
        --cluster-name mycluster --cluster-type connectedClusters \
        --name myconfig --scope cluster --namespace my-namespace \
        --kind git --url https://github.com/Azure/arc-k8s-demo \
        --branch main --kustomization name=my-kustomization

    Create a Kubernetes v2 Flux Configuration with Bucket Source Kind
        az k8s-configuration flux create --resource-group my-resource-group \
        --cluster-name mycluster --cluster-type connectedClusters \
        --name myconfig --scope cluster --namespace my-namespace \
        --kind bucket --url https://bucket-provider.minio.io \
        --bucket-name my-bucket --kustomization name=my-kustomization \
        --bucket-access-key my-access-key --bucket-secret-key my-secret-key
        
    Create a Kubernetes v2 Flux Configuration with Azure Blob Storage Source Kind
        az k8s-configuration flux create --resource-group my-resource-group \
        --cluster-name mycluster --cluster-type connectedClusters \
        --name myconfig --scope cluster --namespace my-namespace \
        --kind azblob --url https://mystorageaccount.blob.core.windows.net \
        --container-name my-container --kustomization name=my-kustomization \
        --account-key my-account-key
```

### Configuration general arguments

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--cluster-name` `-c` | String | Name of the cluster resource in Azure. |
| `--cluster-type` `-t` | `connectedClusters`, `managedClusters` | Use `connectedClusters` for Azure Arc-enabled Kubernetes clusters and `managedClusters` for AKS clusters. |
| `--resource-group` `-g` | String | Name of the Azure resource group that holds the Azure Arc or AKS cluster resource. |
| `--name` `-n`| String | Name of the Flux configuration in Azure. |
| `--namespace` `--ns` | String | Name of the namespace to deploy the configuration.  Default: `default`. |
| `--scope` `-s` | String | Permission scope for the operators. Possible values are `cluster` (full access) or `namespace` (restricted access). Default: `cluster`.
| `--suspend` | flag | Suspends all source and kustomize reconciliations defined in this Flux configuration. Reconciliations active at the time of suspension will continue.  |

### Source general arguments

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--kind` | String | Source kind to reconcile. Allowed values: `bucket`, `git`, `azblob`.  Default: `git`. |
| `--timeout` | [golang duration format](https://pkg.go.dev/time#Duration.String) | Maximum time to attempt to reconcile the source before timing out. Default: `10m`. |
| `--sync-interval` `--interval` | [golang duration format](https://pkg.go.dev/time#Duration.String) | Time between reconciliations of the source on the cluster. Default: `10m`. |

### Git repository source reference arguments

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--branch` | String | Branch within the Git source to sync to the cluster. Default: `master`. Newer repositories might have a root branch named `main`, in which case you need to set `--branch=main`.  |
| `--tag` | String | Tag within the Git source to sync to the cluster. Example: `--tag=3.2.0`. |
| `--semver` | String | Git tag `semver` range within the Git source to sync to the cluster. Example: `--semver=">=3.1.0-rc.1 <3.2.0"`. |
| `--commit` | String | Git commit SHA within the Git source to sync to the cluster. Example: `--commit=363a6a8fe6a7f13e05d34c163b0ef02a777da20a`. |

For more information, see the [Flux documentation on Git repository checkout strategies](https://fluxcd.io/docs/components/source/gitrepositories/#checkout-strategies).

### Public Git repository

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | http[s]://server/repo[.git] | URL of the Git repository source to reconcile with the cluster. |

### Private Git repository with SSH and Flux-created keys

Add the public key generated by Flux to the user account in your Git service provider.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | ssh://user@server/repo[.git] | `git@` should replace `user@` if the public key is associated with the repository instead of the user account. |

### Private Git repository with SSH and user-provided keys

Use your own private key directly or from a file. The key must be in [PEM format](https://aka.ms/PEMformat) and end with a newline (`\n`).

Add the associated public key to the user account in your Git service provider.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | ssh://user@server/repo[.git] | `git@` should replace `user@` if the public key is associated with the repository instead of the user account. |
| `--ssh-private-key` | Base64 key in [PEM format](https://aka.ms/PEMformat) | Provide the key directly. |
| `--ssh-private-key-file` | Full path to local file | Provide the full path to the local file that contains the PEM-format key.

### Private Git host with SSH and user-provided known hosts

The Flux operator maintains a list of common Git hosts in its `known_hosts` file. Flux uses this information to authenticate the Git repository before establishing the SSH connection. If you're using an uncommon Git repository or your own Git host, you can supply the host key so that Flux can identify your repository.

Just like private keys, you can provide your `known_hosts` content directly or in a file. When you're providing your own content, use the [known_hosts content format specifications](https://aka.ms/KnownHostsFormat), along with either of the preceding SSH key scenarios.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | ssh://user@server/repo[.git] | `git@` can replace `user@`. |
| `--known-hosts` | Base64 string | Provide `known_hosts` content directly. |
| `--known-hosts-file` | Full path to local file | Provide `known_hosts` content in a local file. |

### Private Git repository with an HTTPS user and key

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | `https://server/repo[.git]` | HTTPS with Basic Authentication. |
| `--https-user` | Raw string | HTTPS username. |
| `--https-key` | Raw string | HTTPS personal access token or password.

### Private Git repository with an HTTPS CA certificate

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | `https://server/repo[.git]` | HTTPS with Basic Authentication. |
| `--https-ca-cert` | Base64 string | CA certificate for TLS communication. |
| `--https-ca-cert-file` | Full path to local file | Provide CA certificate content in a local file. |

### Bucket source arguments

If you use a `bucket` source instead of a `git` source, here are the bucket-specific command arguments.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | URL String | The URL for the `bucket`. Formats supported: http://, https://. |
| `--bucket-name` | String | Name of the `bucket` to sync. |
| `--bucket-access-key` | String | Access Key ID used to authenticate with the `bucket`. |
| `--bucket-secret-key` | String | Secret Key used to authenticate with the `bucket`. |
| `--bucket-insecure` | Boolean | Communicate with a `bucket` without TLS.  If not provided, assumed false; if provided, assumed true. |

### Azure Blob Storage Account source arguments

If you use a `azblob` source, here are the blob-specific command arguments.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | URL String | The URL for the `azblob`. |
| `--container-name` | String | Name of the Azure Blob Storage container to sync |
| `--sp_client_id` | String | The client ID for authenticating a service principal with Azure Blob, required for this authentication method |
| `--sp_tenant_id` | String | The tenant ID for authenticating a service principal with Azure Blob, required for this authentication method |
| `--sp_client_secret` | String | The client secret for authenticating a service principal with Azure Blob |
| `--sp_client_cert` | String | The Base64 encoded client certificate for authenticating a service principal with Azure Blob |
| `--sp_client_cert_password` | String | The password for the client certificate used to authenticate a service principal with Azure Blob |
| `--sp_client_cert_send_chain` | String | Specifies whether to include x5c header in client claims when acquiring a token to enable subject name / issuer based authentication for the client certificate |
| `--account_key` | String | The Azure Blob Shared Key for authentication |
| `--sas_token` | String | The Azure Blob SAS Token for authentication |
| `--mi_client_id` | String | The client ID of the managed identity for authentication with Azure Blob |

### Local secret for authentication with source

You can use a local Kubernetes secret for authentication with a `git`, `bucket` or `azBlob` source.  The local secret must contain all of the authentication parameters needed for the source and must be created in the same namespace as the Flux configuration.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--local-auth-ref` `--local-ref`  | String | Local reference to a Kubernetes secret in the Flux configuration namespace to use for authentication with the source. |

For HTTPS authentication, you create a secret with the `username` and `password`:

```console
kubectl create ns flux-config
kubectl create secret generic -n flux-config my-custom-secret --from-literal=username=<my-username> --from-literal=password=<my-password-or-key>
```

For SSH authentication, you create a secret with the `identity` and `known_hosts` fields:

```console
kubectl create ns flux-config
kubectl create secret generic -n flux-config my-custom-secret --from-file=identity=./id_rsa --from-file=known_hosts=./known_hosts
```

For both cases, when you create the Flux configuration, use `--local-auth-ref my-custom-secret` in place of the other authentication parameters:

```console
az k8s-configuration flux create -g <cluster_resource_group> -c <cluster_name> -n <config_name> -t connectedClusters --scope cluster --namespace flux-config -u <git-repo-url> --kustomization name=kustomization1 --local-auth-ref my-custom-secret
```

Learn more about using a local Kubernetes secret with these authentication methods:

* [Git repository HTTPS authentication](https://fluxcd.io/docs/components/source/gitrepositories/#https-authentication)
* [Git repository HTTPS self-signed certificates](https://fluxcd.io/docs/components/source/gitrepositories/#https-self-signed-certificates)
* [Git repository SSH authentication](https://fluxcd.io/docs/components/source/gitrepositories/#ssh-authentication)
* [Bucket static authentication](https://fluxcd.io/docs/components/source/buckets/#static-authentication)

> [!NOTE]
> If you need Flux to access the source through your proxy, you'll need to update the Azure Arc agents with the proxy settings. For more information, see [Connect using an outbound proxy server](./quickstart-connect-cluster.md?tabs=azure-cli-connect-using-an-outbound-proxy-server).

### Git implementation

To support various repository providers that implement Git, Flux can be configured to use one of two Git libraries: `go-git` or `libgit2`. See the [Flux documentation](https://fluxcd.io/docs/components/source/gitrepositories/#git-implementation) for details.

The GitOps implementation of Flux v2 automatically determines which library to use for public cloud repositories:

* For GitHub, GitLab, and BitBucket repositories, Flux uses `go-git`.
* For Azure DevOps and all other repositories, Flux uses `libgit2`.

For on-premises repositories, Flux uses `libgit2`.

### Kustomization

By using `az k8s-configuration flux create`, you can create one or more kustomizations during the configuration.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--kustomization` | No value | Start of a string of parameters that configure a kustomization. You can use it multiple times to create multiple kustomizations. |
| `name` | String | Unique name for this kustomization. |
| `path` | String | Path within the Git repository to reconcile with the cluster. Default is the top level of the branch. |
| `prune` | Boolean | Default is `false`. Set `prune=true` to assure that the objects that Flux deployed to the cluster will be cleaned up if they're removed from the repository or if the Flux configuration or kustomizations are deleted. Using `prune=true` is important for environments where users don't have access to the clusters and can make changes only through the Git repository. |
| `depends_on` | String | Name of one or more kustomizations (within this configuration) that must reconcile before this kustomization can reconcile. For example: `depends_on=["kustomization1","kustomization2"]`. Note that if you remove a kustomization that has dependent kustomizations, the dependent kustomizations will get a `DependencyNotReady` state and reconciliation will halt.|
| `timeout` | [golang duration format](https://pkg.go.dev/time#Duration.String) | Default: `10m`.  |
| `sync_interval` | [golang duration format](https://pkg.go.dev/time#Duration.String) | Default: `10m`.  |
| `retry_interval` | [golang duration format](https://pkg.go.dev/time#Duration.String) | Default: `10m`.  |
| `validation` | String | Values: `none`, `client`, `server`. Default: `none`.  See [Flux documentation](https://fluxcd.io/docs/) for details.|
| `force` | Boolean | Default: `false`. Set `force=true` to instruct the kustomize controller to re-create resources when patching fails because of an immutable field change. |

You can also use `az k8s-configuration flux kustomization` to create, update, list, show, and delete kustomizations in a Flux configuration:

```console
az k8s-configuration flux kustomization -h

Group
    az k8s-configuration flux kustomization : Commands to manage Kustomizations associated with Flux
    v2 Kubernetes configurations.

Commands:
    create : Create a Kustomization associated with a Flux v2 Kubernetes configuration.
    delete : Delete a Kustomization associated with a Flux v2 Kubernetes configuration.
    list   : List Kustomizations associated with a Flux v2 Kubernetes configuration.
    show   : Show a Kustomization associated with a Flux v2 Kubernetes configuration.
    update : Update a Kustomization associated with a Flux v2 Kubernetes configuration.
```

Here are the kustomization creation options:

```console
az k8s-configuration flux kustomization create -h

This command is from the following extension: k8s-configuration

Command
    az k8s-configuration flux kustomization create : Create a Kustomization associated with a
    Kubernetes Flux v2 Configuration.

Arguments
    --cluster-name -c          [Required] : Name of the Kubernetes cluster.
    --cluster-type -t          [Required] : Specify Arc connected clusters or AKS managed clusters.
                                            Allowed values: connectedClusters, managedClusters.
    --kustomization-name -k    [Required] : Specify the name of the kustomization to target.
    --name -n                  [Required] : Name of the flux configuration.
    --resource-group -g        [Required] : Name of resource group. You can configure the default
                                            group using `az configure --defaults group=<name>`.
    --dependencies --depends --depends-on : Comma-separated list of kustomization dependencies.
    --force                               : Re-create resources that cannot be updated on the
                                            cluster (i.e. jobs).  Allowed values: false, true.
    --interval --sync-interval            : Time between reconciliations of the kustomization on the
                                            cluster.
    --no-wait                             : Do not wait for the long-running operation to finish.
    --path                                : Specify the path in the source that the kustomization
                                            should apply.
    --prune                               : Garbage collect resources deployed by the kustomization
                                            on the cluster.  Allowed values: false, true.
    --retry-interval                      : Time between reconciliations of the kustomization on the
                                            cluster on failures, defaults to --sync-interval.
    --timeout                             : Maximum time to reconcile the kustomization before
                                            timing out.

Global Arguments
    --debug                               : Increase logging verbosity to show all debug logs.
    --help -h                             : Show this help message and exit.
    --only-show-errors                    : Only show errors, suppressing warnings.
    --output -o                           : Output format.  Allowed values: json, jsonc, none,
                                            table, tsv, yaml, yamlc.  Default: json.
    --query                               : JMESPath query string. See http://jmespath.org/ for more
                                            information and examples.
    --subscription                        : Name or ID of subscription. You can configure the
                                            default subscription using `az account set -s
                                            NAME_OR_ID`.
    --verbose                             : Increase logging verbosity. Use --debug for full debug
                                            logs.

Examples
    Create a Kustomization associated with a Kubernetes v2 Flux Configuration
        az k8s-configuration flux kustomization create --resource-group my-resource-group \
        --cluster-name mycluster --cluster-type connectedClusters --name myconfig \
        --kustomization-name my-kustomization-2 --path ./my/path --prune --force
```

## Manage GitOps configurations by using the Azure portal

The Azure portal is useful for managing GitOps configurations and the Flux extension in Azure Arc-enabled Kubernetes or AKS clusters. The portal displays all Flux configurations associated with each cluster and enables drilling in to each.

The portal provides the overall compliance state of the cluster. The Flux objects that have been deployed to the cluster are also shown, along with their installation parameters, compliance state, and any errors.

You can also use the portal to create, update, and delete GitOps configurations.

## Manage cluster configuration by using the Flux Kustomize controller

The Flux Kustomize controller is installed as part of the `microsoft.flux` cluster extension. It allows the declarative management of cluster configuration and application deployment by using Kubernetes manifests synced from a Git repository. These Kubernetes manifests can include a *kustomize.yaml* file, but it isn't required.

For usage details, see the following:

* [Flux Kustomize controller](https://fluxcd.io/docs/components/kustomize/)
* [Kustomize reference documents](https://kubectl.docs.kubernetes.io/references/kustomize/)
* [The kustomization file](https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/)
* [Kustomize project](https://kubectl.docs.kubernetes.io/references/kustomize/)
* [Kustomize guides](https://kubectl.docs.kubernetes.io/guides/config_management/)

## Manage Helm chart releases by using the Flux Helm controller

The Flux Helm controller is installed as part of the `microsoft.flux` cluster extension. It allows you to declaratively manage Helm chart releases with Kubernetes manifests that you maintain in your Git repository.

For usage details, see the following:

* [Flux for Helm users](https://fluxcd.io/docs/use-cases/helm/)
* [Manage Helm releases](https://fluxcd.io/docs/guides/helmreleases/)
* [Migrate to Flux v2 Helm from Flux v1 Helm](https://fluxcd.io/docs/migration/helm-operator-migration/)
* [Flux Helm controller](https://fluxcd.io/docs/components/helm/)

> [!TIP]
> Because of how Helm handles index files, processing helm charts is an expensive operation and can have very high memory footprint. As a result, helm chart reconciliation, when occurring in parallel, can cause memory spikes and OOMKilled if you are reconciling a large number of helm charts at a given time. By default, the source-controller sets its memory limit at 1Gi and its memory requests at 64Mi. If you need to increase this limit and requests due to a high number of large helm chart reconciliations, run the following command after installing the microsoft.flux extension:
>
> `az k8s-extension update -g <resource-group> -c <cluster-name> -n flux -t connectedClusters --config source-controller.resources.limits.memory=2Gi source-controller.resources.requests.memory=300Mi`

### Use the GitRepository source for Helm charts

If your Helm charts are stored in the `GitRepository` source that you configure as part of the `fluxConfigurations` resource, you can indicate that the configured source should be used as the source of the Helm charts by adding `clusterconfig.azure.com/use-managed-source: "true"` to your HelmRelease yaml, as shown in the following example:

```console
---
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: somename
  namespace: somenamespace
  annotations:
    clusterconfig.azure.com/use-managed-source: "true"
spec:
  ...
```

By using this annotation, the HelmRelease that is deployed will be patched with the reference to the configured source. Currently, only `GitRepository` source is supported.

## Multi-tenancy

Flux v2 supports [multi-tenancy](https://github.com/fluxcd/flux2-multi-tenancy) in [version 0.26](https://fluxcd.io/blog/2022/01/january-update/#flux-v026-more-secure-by-default). This capability has been integrated into Azure GitOps with Flux v2.

>[ !NOTE]
> For the multi-tenancy feature, you need to know if your manifests contain any cross-namespace sourceRef for HelmRelease, Kustomization, ImagePolicy, or other objects, or [if you use a Kubernetes version less than 1.20.6](https://fluxcd.io/blog/2022/01/january-update/#flux-v026-more-secure-by-default). To prepare, take these actions:
>
> * Upgrade to Kubernetes version 1.20.6 or greater.
> * In your Kubernetes manifests, assure that all `sourceRef` are to objects within the same namespace as the GitOps configuration.
>   * If you need time to update your manifests, you can [opt out of multi-tenancy](#opt-out-of-multi-tenancy). However, you still need to upgrade your Kubernetes version.

### Update manifests for multi-tenancy

Let’s say you deploy a `fluxConfiguration` to one of our Kubernetes clusters in the **cluster-config** namespace with cluster scope. You configure the source to sync the https://github.com/fluxcd/flux2-kustomize-helm-example repo. This is the same sample Git repo used in the tutorial earlier in this doc. After Flux syncs the repo, it will deploy the resources described in the manifests (YAML files). Two of the manifests describe HelmRelease and HelmRepository objects.

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: nginx
  namespace: nginx
spec:
  releaseName: nginx-ingress-controller
  chart:
    spec:
      chart: nginx-ingress-controller
      sourceRef:
        kind: HelmRepository
        name: bitnami
        namespace: flux-system
      version: "5.6.14"
  interval: 1h0m0s
  install:
    remediation:
      retries: 3
  # Default values
  # https://github.com/bitnami/charts/blob/master/bitnami/nginx-ingress-controller/values.yaml
  values:
    service:
      type: NodePort
```

```yaml
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: bitnami
  namespace: flux-system
spec:
  interval: 30m
  url: https://charts.bitnami.com/bitnami
```

By default, the Flux extension will deploy the `fluxConfigurations` by impersonating the **flux-applier** service account that is deployed only in the **cluster-config** namespace. Using the above manifests, when multi-tenancy is enabled the HelmRelease would be blocked. This is because the HelmRelease is in the **nginx** namespace and is referencing a HelmRepository in the **flux-system** namespace. Also, the Flux helm-controller cannot apply the HelmRelease, because there is no **flux-applier** service account in the **nginx** namespace.

To work with multi-tenancy, the correct approach is to deploy all Flux objects into the same namespace as the `fluxConfigurations`. This avoids the cross-namespace reference issue, and allows the Flux controllers to get the permissions to apply the objects. Thus, for a GitOps configuration created in the **cluster-config** namespace, the above manifests would change to these:

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: nginx
  namespace: cluster-config 
spec:
  releaseName: nginx-ingress-controller
  targetNamespace: nginx
  chart:
    spec:
      chart: nginx-ingress-controller
      sourceRef:
        kind: HelmRepository
        name: bitnami
        namespace: cluster-config
      version: "5.6.14"
  interval: 1h0m0s
  install:
    remediation:
      retries: 3
  # Default values
  # https://github.com/bitnami/charts/blob/master/bitnami/nginx-ingress-controller/values.yaml
  values:
    service:
      type: NodePort
```

```yaml
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: bitnami
  namespace: cluster-config
spec:
  interval: 30m
  url: https://charts.bitnami.com/bitnami
```

### Opt out of multi-tenancy

When the `microsoft.flux` extension is installed, multi-tenancy is enabled by default to assure security by default in your clusters.  However, if you need to disable multi-tenancy, you can opt out by creating or updating the `microsoft.flux` extension in your clusters with "--configuration-settings multiTenancy.enforce=false".

```console
az k8s-extension create --extension-type microsoft.flux --configuration-settings multiTenancy.enforce=false -c CLUSTER_NAME -g RESOURCE_GROUP -n flux -t <managedClusters or connectedClusters>

or

az k8s-extension update --configuration-settings multiTenancy.enforce=false -c CLUSTER_NAME -g RESOURCE_GROUP -n flux -t <managedClusters or connectedClusters>
```

## Migrate from Flux v1

If you've been using Flux v1 in Azure Arc-enabled Kubernetes or AKS clusters and want to migrate to using Flux v2 in the same clusters, you first need to delete the Flux v1 `sourceControlConfigurations` from the clusters.  The `microsoft.flux` cluster extension won't install if there are Flux v1 `sourceControlConfigurations` resources in the cluster.

Use these Azure CLI commands to find and then delete existing `sourceControlConfigurations` in a cluster:

```console
az k8s-configuration list --cluster-name <Arc or AKS cluster name> --cluster-type <connectedClusters OR managedClusters> --resource-group <resource group name>
az k8s-configuration delete --name <configuration name> --cluster-name <Arc or AKS cluster name> --cluster-type <connectedClusters OR managedClusters> --resource-group <resource group name>
```

You can also use the Azure portal to view and delete GitOps configurations in Azure Arc-enabled Kubernetes or AKS clusters.

General information about migration from Flux v1 to Flux v2 is available in the fluxed project: [Migrate from Flux v1 to v2](https://fluxcd.io/docs/migration/).

## Next steps

Advance to the next tutorial to learn how to apply configuration at scale with Azure Policy.
> [!div class="nextstepaction"]
> [Use Azure Policy to enforce GitOps at scale](./use-azure-policy-flux-2.md).
