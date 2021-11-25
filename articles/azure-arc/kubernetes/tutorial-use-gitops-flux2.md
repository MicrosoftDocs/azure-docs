---
title: "Tutorial: Use GitOps with Flux v2 in Azure Arc-enabled Kubernetes or Azure Kubernetes Service (AKS) clusters"
description: "This tutorial shows how to use GitOps with Flux v2 to manage configuration and application deployment in Azure Arc and AKS clusters."
keywords: "GitOps, Flux, Kubernetes, K8s, Azure, Arc, AKS, Azure Kubernetes Service, containers, devops"
services: azure-arc, aks
ms.service: azure-arc
ms.date: 11/22/2021
ms.topic: tutorial
author: csand-msft
ms.author: csand
ms.custom: template-tutorial, devx-track-azurecli
---

# Use GitOps with Flux v2 in Azure Arc-enabled Kubernetes or Azure Kubernetes Service (AKS) clusters (Public Preview)

GitOps with Flux v2 can be enabled in Azure Arc-enabled Kubernetes connected clusters or Azure Kubernetes Service (AKS) managed clusters as a cluster extension. After the `microsoft.flux` cluster extension is installed, you can then create one or more `fluxConfigurations` resources that sync your Git repository sources to the cluster and reconcile the cluster to the desired state. With GitOps, you can use your Git repository as the source of truth for cluster configuration and application deployment.

This document contains a detailed tutorial of using Azure GitOps in a Kubernetes cluster. Before diving in, take a moment to [learn how GitOps with Flux works conceptually](./conceptual-gitops-flux2).

General Availability of Azure Arc-enabled Kubernetes includes GitOps with Flux v1. The public preview of GitOps with Flux v2, documented here, is available in both Azure Arc-enabled Kubernetes and AKS. Flux v2 is the way forward, and Flux v1 will eventually be deprecated.

## Before you begin

To manage GitOps through the Azure CLI or portal you need:

### For Azure Arc-enabled Kubernetes clusters

* An Azure Arc-enabled Kubernetes connected cluster that is up and running.
  * [Learn how to Arc-enable a Kubernetes cluster](./quickstart-connect-cluster). If you need to connect through an outbound proxy, then assure you [install the Arc agents with proxy settings](./quickstart-connect-cluster?tabs=azure-cli#5-connect-using-an-outbound-proxy-server).
* 'Read' and 'Write' permissions on the 'Microsoft.Kubernetes/connectedClusters' resource type.

### For Azure Kubernetes Service (AKS) clusters

* An AKS cluster that is up and running.

>[!IMPORTANT]

>Ensure the AKS cluster is created with MSI (not SPN), because the `microsoft.flux` extension won't work with SPN-based AKS clusters.

* 'Read' and 'Write' permissions on the 'Microsoft.ContainerService/managedClusters' resource type.

### Common to both cluster types

* Assure Azure CLI version 2.15 or greater. [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) or update to the latest version to ensure that you have Azure CLI version 2.15+.

```console
az version
az upgrade
```

* Register the following Azure service providers (it's ok to re-register an existing provider).

```console
az provider register --namespace Microsoft.Kubernetes
az provider register --namespace Microsoft.KubernetesConfiguration
```

Registration is an asynchronous process. While registration should complete within 10 minutes, you may monitor the registration process. If you don't see the registration state progress to *Registered*, reach out to <haikueng@microsoft.com>.

```console
az provider show -n Microsoft.KubernetesConfiguration -o table

Namespace                          RegistrationPolicy    RegistrationState
---------------------------------  --------------------  -------------------
Microsoft.KubernetesConfiguration  RegistrationRequired  Registered
```

### Supported regions

Azure GitOps is currently supported in the regions supported by Azure Arc-enabled Kubernetes, which is a subset of the regions supported by AKS. Thus, GitOps is currently not supported in all AKS regions.  [See the supported regions here](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=kubernetes-service,azure-arc). The GitOps service is adding new supported regions on a regular cadence.

### Network requirements

The GitOps agents require the following protocols, ports, and outbound URLs to function:

* TCP on port 443 --> `https://:443`

| Endpoint (DNS) | Description |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `https://management.azure.com` | Required for the agent to communicate with the Kubernetes Configuration service |
| `https://<region>.dp.kubernetesconfiguration.azure.com` | Data plane endpoint for the agent to push status and fetch configuration information. Depends on `<region>`: the supported regions referenced above. |
| `https://login.microsoftonline.com` | Required to fetch and update Azure Resource Manager tokens |
| `https://mcr.microsoft.com` | Required to pull container images for Flux controllers |
| `https://azurearcfork8s.azurecr.io` | Required to pull container images for GitOps agents |

## Enable CLI extensions

>[!NOTE]
>The `k8s-configuration` CLI extension has been upgraded to manage either Flux v2 or Flux v1 configurations. Flux v2 is an important upgrade to Flux v1, and eventually Azure GitOps support for Flux v1 will cease. Thus, begin using Flux v2 as soon as possible.

* Install the latest `k8s-configuration` and `k8s-extension` CLI extension packages.

```console
az extension add -n k8s-configuration
az extension add –n k8s-extension
```

* To update these packages:

```console
az extension update -n k8s-configuration
az extension update -n k8s-extension
```

To see the list of az CLI extensions installed and their versions:

```console
az extension list -o table

Experimental   ExtensionType   Name                   Path                                                       Preview   Version
-------------  --------------  -----------------      -----------------------------------------------------      --------  --------
False          whl             connectedk8s           C:\Users\somename\.azure\cliextensions\connectedk8s           False     1.1.7
False          whl             k8s-configuration      C:\Users\somename\.azure\cliextensions\k8s-configuration      False     1.2.0
False          whl             k8s-extension          C:\Users\somename\.azure\cliextensions\k8s-extension          False     1.0.0
```

## Apply a Flux configuration using Azure CLI

Use the `k8s-configuration` Azure CLI extension (or the Azure portal) to enable GitOps in an AKS or Arc-enabled Kubernetes cluster. For demonstration, use the public [https://github.com/fluxcd/flux2-kustomize-helm-example](https://github.com/fluxcd/flux2-kustomize-helm-example) repository. 

In the example below:

* The resource group that contains the cluster is "flux-demo-rg".
* The name of the Arc cluster is "flux-demo-arc".
* The cluster type is Arc (connectedClusters), but this can also work with AKS (managedClusters).
* The name of the Flux configuration is "gitops-demo".
* The namespace for configuration installation is "gitops-demo".
* The URL for the public Git repository is "https://github.com/fluxcd/flux2-kustomize-helm-example".
* The Git repository branch is "main".
* The scope of the configuration is "cluster" (which gives the operators permissions to make changes throughout cluster).
* Two kustomizations are specified with names "infra" and "apps", each associated with a different path in the repository.
* The "apps" kustomization depends on the "infra" kustomization (the "infra" kustomization must complete before the "apps" kustomization runs).
* Set prune=true on both kustomizations. This assures that objects deployed to the cluster by Flux will be cleaned up if they're removed from the repository or if the Flux configuration or kustomizations are deleted.

If the `microsoft.flux` extension isn't already  installed in the cluster, then it will be installed.

```console
az k8s-configuration flux create -g flux-demo-rg -c flux-demo-arc -n gitops-demo --namespace gitops-demo -t connectedClusters --scope cluster -u https://github.com/fluxcd/flux2-kustomize-helm-example --branch main  --kustomization name=infra path=./infrastructure prune=true --kustomization name=apps path=./apps/staging prune=true dependsOn=["infra"]

Command group 'k8s-configuration flux' is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
Warning! https url is being used without https auth params, ensure the repository url provided is not a private repo
'Microsoft.Flux' extension not found on the cluster, installing it now. This may take a few minutes...
'Microsoft.Flux' extension was successfully installed on the cluster
Creating the flux configuration 'gitops-demo' in the cluster. This may take a few minutes...
{
  "complianceState": "Pending",
  ... (not shown because of pending status)
}
```

Show the configuration after time to finish reconciliations.

```console
az k8s-configuration flux show -g flux-demo-rg -c flux-demo-arc -n gitops-demo -t connectedClusters

Command group 'k8s-configuration flux' is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
{
  "complianceState": "Compliant",
  "configurationProtectedSettings": {},
  "errorMessage": "",
  "gitRepository": {
    "httpsCaFile": null,
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
    "url": "https://github.com/fluxcd/flux2-kustomize-helm-example"
  },
  "id": "/subscriptions/REDACTED/resourceGroups/flux-demo-rg/providers/Microsoft.Kubernetes/connectedClusters/flux-demo-arc/providers/Microsoft.KubernetesConfiguration/fluxConfigurations/gitops-demo",
  "kustomizations": {
    "apps": {
      "dependsOn": [
        {
          "kustomizationName": "infra"
        }
      ],
      "force": false,
      "path": "./apps/staging",
      "prune": true,
      "retryIntervalInSeconds": null,
      "syncIntervalInSeconds": 600,
      "timeoutInSeconds": 600
    },
    "infra": {
      "dependsOn": [],
      "force": false,
      "path": "./infrastructure",
      "prune": true,
      "retryIntervalInSeconds": null,
      "syncIntervalInSeconds": 600,
      "timeoutInSeconds": 600
    }
  },
  "lastSourceSyncedAt": "2021-11-23T22:59:22+00:00",
  "lastSourceSyncedCommitId": "main/f0c2aaef48461d8099a8fff05893e9ebb96f1561",
  "name": "gitops-demo",
  "namespace": "gitops-demo",
  "provisioningState": "Succeeded",
  "repositoryPublicKey": "",
  "resourceGroup": "flux-demo-rg",
  "scope": "cluster",
  "sourceKind": "GitRepository",
  "statuses": [
    {
      "appliedBy": null,
      "complianceState": "Compliant",
      "helmReleaseProperties": null,
      "kind": "GitRepository",
      "name": "gitops-demo",
      "namespace": "gitops-demo",
      "statusConditions": [
        {
          "lastTransitionTime": "2021-11-23T22:59:22+00:00",
          "message": "Fetched revision: main/f0c2aaef48461d8099a8fff05893e9ebb96f1561",
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
      "name": "gitops-demo-apps",
      "namespace": "gitops-demo",
      "statusConditions": [
        {
          "lastTransitionTime": "2021-11-23T22:59:53+00:00",
          "message": "Applied revision: main/f0c2aaef48461d8099a8fff05893e9ebb96f1561",
          "reason": "ReconciliationSucceeded",
          "status": "True",
          "type": "Ready"
        }
      ]
    },
    {
      "appliedBy": {
        "name": "gitops-demo-apps",
        "namespace": "gitops-demo"
      },
      "complianceState": "Compliant",
      "helmReleaseProperties": {
        "failureCount": 0,
        "helmChartRef": {
          "name": "podinfo-podinfo",
          "namespace": "flux-system"
        },
        "installFailureCount": 0,
        "lastRevisionApplied": 1,
        "upgradeFailureCount": 0
      },
      "kind": "HelmRelease",
      "name": "podinfo",
      "namespace": "podinfo",
      "statusConditions": [
        {
          "lastTransitionTime": "2021-11-23T22:59:54+00:00",
          "message": "Release reconciliation succeeded",
          "reason": "ReconciliationSucceeded",
          "status": "True",
          "type": "Ready"
        },
        {
          "lastTransitionTime": "2021-11-23T22:59:54+00:00",
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
      "name": "gitops-demo-infra",
      "namespace": "gitops-demo",
      "statusConditions": [
        {
          "lastTransitionTime": "2021-11-23T22:59:24+00:00",
          "message": "Applied revision: main/f0c2aaef48461d8099a8fff05893e9ebb96f1561",
          "reason": "ReconciliationSucceeded",
          "status": "True",
          "type": "Ready"
        }
      ]
    },
    {
      "appliedBy": {
        "name": "gitops-demo-infra",
        "namespace": "gitops-demo"
      },
      "complianceState": "Compliant",
      "helmReleaseProperties": null,
      "kind": "HelmRepository",
      "name": "bitnami",
      "namespace": "flux-system",
      "statusConditions": [
        {
          "lastTransitionTime": "2021-11-23T22:59:30+00:00",
          "message": "Fetched revision: 75dd8746b22e569460eb3b453b0ae22941c680b7",
          "reason": "IndexationSucceed",
          "status": "True",
          "type": "Ready"
        }
      ]
    },
    {
      "appliedBy": {
        "name": "gitops-demo-infra",
        "namespace": "gitops-demo"
      },
      "complianceState": "Compliant",
      "helmReleaseProperties": null,
      "kind": "HelmRepository",
      "name": "podinfo",
      "namespace": "flux-system",
      "statusConditions": [
        {
          "lastTransitionTime": "2021-11-23T22:59:24+00:00",
          "message": "Fetched revision: fddc2924c28a1a1895e215a4dc065f33a0ea2e8e",
          "reason": "IndexationSucceed",
          "status": "True",
          "type": "Ready"
        }
      ]
    },
    {
      "appliedBy": {
        "name": "gitops-demo-infra",
        "namespace": "gitops-demo"
      },
      "complianceState": "Compliant",
      "helmReleaseProperties": {
        "failureCount": 0,
        "helmChartRef": {
          "name": "nginx-nginx",
          "namespace": "flux-system"
        },
        "installFailureCount": 0,
        "lastRevisionApplied": 1,
        "upgradeFailureCount": 0
      },
      "kind": "HelmRelease",
      "name": "nginx",
      "namespace": "nginx",
      "statusConditions": [
        {
          "lastTransitionTime": "2021-11-23T23:00:10+00:00",
          "message": "Release reconciliation succeeded",
          "reason": "ReconciliationSucceeded",
          "status": "True",
          "type": "Ready"
        },
        {
          "lastTransitionTime": "2021-11-23T23:00:10+00:00",
          "message": "Helm install succeeded",
          "reason": "InstallSucceeded",
          "status": "True",
          "type": "Released"
        }
      ]
    },
    {
      "appliedBy": {
        "name": "gitops-demo-infra",
        "namespace": "gitops-demo"
      },
      "complianceState": "Compliant",
      "helmReleaseProperties": {
        "failureCount": 0,
        "helmChartRef": {
          "name": "redis-redis",
          "namespace": "flux-system"
        },
        "installFailureCount": 0,
        "lastRevisionApplied": 1,
        "upgradeFailureCount": 0
      },
      "kind": "HelmRelease",
      "name": "redis",
      "namespace": "redis",
      "statusConditions": [
        {
          "lastTransitionTime": "2021-11-23T22:59:56+00:00",
          "message": "Release reconciliation succeeded",
          "reason": "ReconciliationSucceeded",
          "status": "True",
          "type": "Ready"
        },
        {
          "lastTransitionTime": "2021-11-23T22:59:56+00:00",
          "message": "Helm install succeeded",
          "reason": "InstallSucceeded",
          "status": "True",
          "type": "Released"
        }
      ]
    }
  ],
  "suspend": false,
  "systemData": {
    "createdAt": "2021-11-23T22:58:53.736245+00:00",
    "createdBy": null,
    "createdByType": null,
    "lastModifiedAt": "2021-11-23T22:58:53.736245+00:00",
    "lastModifiedBy": null,
    "lastModifiedByType": null
  },
  "type": "Microsoft.KubernetesConfiguration/fluxConfigurations"
}
```

These namespaces were created:

* `flux-system`: holds the Flux extension controllers
* `gitops-demo`: holds the Flux configuration objects
* `nginx`, `podinfo`, `redis`: namespaces for workloads described in manifests in the Git repository

```console
kubectl get namespaces
NAME              STATUS   AGE
azure-arc         Active   17d
default           Active   17d
flux-system       Active   18m
gitops-demo       Active   17m
kube-node-lease   Active   17d
kube-public       Active   17d
kube-system       Active   17d
nginx             Active   17m
podinfo           Active   16m
redis             Active   17m```

The `flux-system` namespace contains the Flux extension objects.  

* Azure Flux controllers: `fluxconfig-agent`, `fluxconfig-controller`
* OSS Flux controllers: `source-controller`, `kustomize-controller`, `helm-controller`, `notification-controller`

The Flux agent and controller pods should be in running state.

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

Namespace `gitops-demo` has the Flux configuration objects.

```console
kubectl get crds -n gitops-demo

NAME                                                   CREATED AT
alerts.notification.toolkit.fluxcd.io                  2021-11-23T22:57:49Z
arccertificates.clusterconfig.azure.com                2021-11-06T15:12:36Z
azureclusteridentityrequests.clusterconfig.azure.com   2021-11-06T15:12:36Z
connectedclusters.arc.azure.com                        2021-11-06T15:12:36Z
customlocationsettings.clusterconfig.azure.com         2021-11-06T15:12:36Z
extensionconfigs.clusterconfig.azure.com               2021-11-06T15:12:36Z
fluxconfigs.clusterconfig.azure.com                    2021-11-23T22:57:49Z
gitconfigs.clusterconfig.azure.com                     2021-11-06T15:12:36Z
gitrepositories.source.toolkit.fluxcd.io               2021-11-23T22:57:49Z
healthstates.azmon.container.insights                  2021-11-06T14:45:55Z
helmcharts.source.toolkit.fluxcd.io                    2021-11-23T22:57:49Z
helmreleases.helm.toolkit.fluxcd.io                    2021-11-23T22:57:49Z
helmrepositories.source.toolkit.fluxcd.io              2021-11-23T22:57:49Z
kustomizations.kustomize.toolkit.fluxcd.io             2021-11-23T22:57:49Z
providers.notification.toolkit.fluxcd.io               2021-11-23T22:57:49Z
receivers.notification.toolkit.fluxcd.io               2021-11-23T22:57:49Z
```

```console
kubectl get fluxconfigs -A

NAMESPACE     NAME          SCOPE     URL                                                      PROVISION   AGE
gitops-demo   gitops-demo   cluster   https://github.com/fluxcd/flux2-kustomize-helm-example   Succeeded   22m
```

```console
kubectl get gitrepositories -A

NAMESPACE     NAME          URL                                                      READY   STATUS                                                            AGE
gitops-demo   gitops-demo   https://github.com/fluxcd/flux2-kustomize-helm-example   True    Fetched revision: main/f0c2aaef48461d8099a8fff05893e9ebb96f1561   22m
```

```console
kubectl get kustomizations -A

NAMESPACE     NAME                READY   STATUS                                                            AGE
gitops-demo   gitops-demo-apps    True    Applied revision: main/f0c2aaef48461d8099a8fff05893e9ebb96f1561   23m
gitops-demo   gitops-demo-infra   True    Applied revision: main/f0c2aaef48461d8099a8fff05893e9ebb96f1561   23m
```

Workloads deployed from manifests in the Git repository.

```console
kubectl get deploy -n nginx

NAME                                       READY   UP-TO-DATE   AVAILABLE   AGE
nginx-ingress-controller                   1/1     1            1           25m
nginx-ingress-controller-default-backend   1/1     1            1           25m

kubectl get deploy -n podinfo

NAME      READY   UP-TO-DATE   AVAILABLE   AGE
podinfo   1/1     1            1           26m

kubectl get all -n redis

NAME                 READY   STATUS    RESTARTS   AGE
pod/redis-master-0   1/1     Running   0          95m

NAME                     TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
service/redis-headless   ClusterIP   None          <none>        6379/TCP   95m
service/redis-master     ClusterIP   10.0.180.63   <none>        6379/TCP   95m

NAME                            READY   AGE
statefulset.apps/redis-master   1/1     95m
```

### Delete the Flux configuration

You can delete the Flux configuration. This deletes both the fluxConfigurations resource in Azure and the Flux configuration objects in the cluster. Because the Flux configuration was originally created with the `prune=true` parameter for the kustomization, all of the objects created in the cluster based on manifests in the Git repository will be removed when the Flux configuration is removed.

```console
az k8s-configuration flux delete -g flux-demo-rg -c flux-demo-arc -n gitops-demo -t connectedClusters --yes
```

Note that this does NOT remove the Flux extension.

### Delete the Flux cluster extension

You can delete the Flux extension using either the CLI or the portal. The delete action removes both the microsoft.flux extension resource in Azure and the Flux extension objects in the cluster.

If the Flux extension was created automatically when the Flux configuration was first created, then the extension name will be `flux`.

For Azure Arc-enabled Kubernetes cluster:

```console
az k8s-extension delete -g flux-demo-rg -c flux-demo-arc -n flux -t connectedClusters --yes
```

For Azure Kubernetes Service (AKS) cluster:

```console
az k8s-extension delete -g flux-demo-rg -c flux-demo-arc -n flux -t managedClusters --yes
```

### Add image reflector and automation controllers to the Flux cluster extension

You can add the [Flux image reflector and automation controllers](https://fluxcd.io/docs/components/image/) to the Flux extension installation using the CLI command below. If the Flux extension was created automatically when the Flux configuration was first created, then the extension name will be `flux`.

```console
az k8s-extension create -g <cluster_resource_group> -c <cluster_name> -t <connectedClusters or managedClusters> --name flux --extension-type microsoft.flux --config image-automation-controller.enabled=true image-reflector-controller.enabled=true
```

## Parameters reference

See the [official Flux documentation](https://fluxcd.io/docs/) for description of all parameters supported by Flux. Flux in Azure doesn't support all parameters yet; let us know if a parameter you need is missing from the Azure implementation.

You can see the full list of parameters supported by the `k8s-configuration flux` CLI command by using the `-h` parameter.

```console
az k8s-configuration flux -h

Group
    az k8s-configuration flux : Commands to manage Flux v2 Kubernetes configurations.
        This command group is in preview and under development. Reference and support levels:
        https://aka.ms/CLI_refstatus
Subgroups:
    kustomization : Commands to manage Kustomizations associated with Flux v2 Kubernetes
                    configurations.

Commands:
    create        : Create a Kubernetes Flux v2 Configuration.
    delete        : Delete a Kubernetes Flux v2 Configuration.
    list          : List Kubernetes Flux v2 Configurations.
    show          : Show a Kubernetes Flux v2 Configuration.
    update        : Update a Kubernetes Flux v2 Configuration.
```

Here are parameters for `k8s-configuration flux create` CLI command.

```console
az k8s-configuration flux create -h

This command is from the following extension: k8s-configuration

Command
    az k8s-configuration flux create : Create a Kubernetes Flux v2 Configuration.
        Command group 'k8s-configuration flux' is in preview and under development. Reference
        and support levels: https://aka.ms/CLI_refstatus
Arguments
    --cluster-name -c   [Required] : Name of the Kubernetes cluster.
    --cluster-type -t   [Required] : Specify Arc connectedClusters or AKS managedClusters.
                                     Allowed values: connectedClusters, managedClusters.
    --name -n           [Required] : Name of the flux configuration.
    --resource-group -g [Required] : Name of resource group. You can configure the default group
                                     using `az configure --defaults group=<name>`.
    --interval --sync-interval     : Time between reconciliations of the source on the cluster.
    --kind                         : Source kind to reconcile.  Allowed values: git.  Default: git.
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
    --url -u                       : URL of the git repo source to reconcile.

Auth Arguments
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
    --local-auth-ref --local-ref   : Local reference to a kubernetes secret in the configuration
                                     namespace to use for communication to the source.
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

Examples
    Create a Kubernetes v2 Flux Configuration
        az k8s-configuration flux create --resource-group my-resource-group \
        --cluster-name mycluster --cluster-type connectedClusters \
        --name myconfig --scope cluster --namespace my-namespace \
        --kind git --url https://github.com/Azure/arc-k8s-demo \
        --branch main --kustomization name=my-kustomization```
```

### Configuration general arguments

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--cluster-name` `-c` | String | The name of the cluster resource in Azure. |
| `--cluster-type` `-t` | *connectedClusters*, *managedClusters* | Use *connectedClusters* for Azure Arc-enabled Kubernetes cluster and *managedClusters* for Azure Kubernetes Service (AKS) cluster. |
| `--resource-group` `-g` | String | The name of the Azure resource group that holds the Arc or AKS cluster resource. |
| `--name` `-n`| String | The name of the Flux configuration in Azure. |
| `--namespace` `--ns` | String | The name of the namespace to deploy the configuration.  Default: default. |
| `--scope` `-s` | String | The permission scope for the operators. Possible values are 'cluster' (full access) or 'namespace' (restricted access). Default: cluster.
| `--suspend` | flag | Suspends all source and kustomize reconciliations defined in this Flux configuration. Reconciliations active at the time of suspension will continue.  |

### Git repository arguments

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--kind` | String | The source kind to reconcile. Default: *git*. Currently, only *git* is supported.  |
| `--timeout` | [golang duration format](https://pkg.go.dev/time#Duration.String) | Maximum time to reconcile the source before timing out. Default: 10m |
| `--sync-interval` `--interval` | [golang duration format](https://pkg.go.dev/time#Duration.String) | Frequency of reconciliations of the Git source on the cluster. Default: 10m |

### Git repository reference arguments

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--branch` | String | Branch within the git source to sync to the cluster. Default: *master*. Newer repositories may have root branch named *main*, in which case you need to set *--branch=main*.  |
| `--tag` | String | Tag within the git source to sync to the cluster. Example: *--tag=3.2.0* |
| `--semver` | String | Git tag semver range within the git source to sync to the cluster. Example: *--semver=">=3.1.0-rc.1 <3.2.0"* |
| `--commit` | String | The Git commit SHA within the git source to sync to the cluster. Example: *--commit=363a6a8fe6a7f13e05d34c163b0ef02a777da20a* |

For more information, see the [Flux docs on Git repository checkout strategies](https://fluxcd.io/docs/components/source/gitrepositories/#checkout-strategies).

### Use a public Git repository

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | http[s]://server/repo[.git] | The URL of the git repository source to reconcile with the cluster. |

### Use a private Git repository with SSH and Flux-created keys

Add the public key generated by Flux to the user account in your Git service provider.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | ssh://user@server/repo[.git] | `git@` should replace `user@` if the public key is associated with the repository instead of the user account |

### Use a private Git repository with SSH and user-provided keys

Provide your own private key directly or in a file. The key must be in [PEM format](https://aka.ms/PEMformat) and end with newline (\n).

Add the associated public key to the user account in your Git service provider.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | ssh://user@server/repo[.git] | `git@` should replace `user@` if the public key is associated with the repository instead of the user account |
| `--ssh-private-key` | Base64 key in [PEM format](https://aka.ms/PEMformat) | Provide key directly |
| `--ssh-private-key-file` | Full path to local file | Provide full path to local file that contains the PEM-format key

### Use a private Git host with SSH and user-provided known hosts

The Flux operator maintains a list of common Git hosts in its known hosts file to authenticate the Git repository before establishing the SSH connection. If you're using an *uncommon* Git repository or your own Git host, you can supply the host key so that Flux can identify your repository.

Just like private keys, you can provide your known_hosts content directly or in a file. When providing your own content, use the [known_hosts content format specifications](https://aka.ms/KnownHostsFormat), along with either of the SSH key scenarios above.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | ssh://user@server/repo[.git] | `git@` may replace `user@` |
| `--known-hosts` | Base64 string | Provide known hosts content directly |
| `--known-hosts-file` | Full path to local file | Provide known hosts content in a local file |

### Use a private Git repository with HTTPS user and key

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | https://server/repo[.git] | HTTPS with basic auth |
| `--https-user` | Raw string | HTTPS username |
| `--https-key` | Raw string | HTTPS personal access token or password

### Use a private Git repository with HTTPS CA certificate

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | https://server/repo[.git] | HTTPS with basic auth |
| `--https-ca-cert` | Base64 string | CA certificate for TLS communication |
| `--https-ca-cert-file` | Full path to local file | Provide CA certificate content in a local file |

### Using local secret for authentication

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--local-auth-ref`  | String | Local reference to a Kubernetes secret in the Flux configuration namespace to use for communication with the Git source. |

For HTTPS authentication, you create a secret (in the same namespace where the Flux configuration will be) with the username and password/key.

```console
kubectl create ns flux-config
kubectl create secret generic -n flux-config my-custom-secret --from-literal=username=<my-username> --from-literal=password=<my-password-or-key>
```

For SSH authentication, you create a secret (in the same namespace where the Flux configuration will be) with both the identity and known_hosts fields.

```console
kubectl create ns flux-config
kubectl create secret generic -n flux-config my-custom-secret --from-file=identity=./id_rsa --from-file=known_hosts=./known_hosts
```

For both cases, when you create the Flux configuration use *--local-auth-ref my-custom-secret* in place of the other authentication parameters.

```console
az k8s-configuration flux create -g <cluster_resource_group> -c <cluster_name> -n <config_name> -t connectedClusters --scope cluster --namespace flux-config -u <git-repo-url> --kustomization name=kustomization1 --local-auth-ref my-custom-secret
```

>[!NOTE]
>If you need Flux to access the Git repository through your proxy, you will need to update the Azure Arc agents with the proxy settings. For more information, see [Connect using an outbound proxy server](https://docs.microsoft.com/azure/azure-arc/kubernetes/quickstart-connect-cluster?tabs=azure-cli#5-connect-using-an-outbound-proxy-server).

### Git Implementation

To support various repository providers that implement Git, Flux can be configured to use one of two Git libraries: go-git or libgit2. See [the Flux docs for details](https://fluxcd.io/docs/components/source/gitrepositories/#git-implementation).

The Azure GitOps implementation of Flux v2 automatically determines which library to use for public cloud repositories:

* For GitHub, GitLab, and BitBucket repositories, go-git is used.
* For Azure DevOps and all other repositories, libgit2 is used.

For on-premises repositories, libgit2 is used.

### Kustomization

Using `az k8s-configuration flux create` you can create one or more kustomizations during the configuration create.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--kustomization` | No value | Indicate the start of a string of parameters that configure a kustomization. You can use this multiple times to create multiple kustomizations. |
| `name` | String | The unique name for this kustomization. |
| `path` | String | The path within the Git repository to reconcile with the cluster. Default is the top level of the branch. |
| `prune` | Boolean | Default is *false*. Set *prune=true* to remove Kubernetes objects from the cluster when they're removed from the Git repository or when the kustomization is removed. Setting *prune=true* is important for environments where users don't have access to the clusters and can make changes only through the Git repository; this setting will assure that the resources will be cleaned up in the cluster when they're removed from the repository. |
| `depends_on` | String | The name of one or more kustomizations (within this configuration) that must reconcile before this kustomization can reconcile. For example, *depends_on=["kustomization1","kustomization2"]* Note: if you remove a kustomization that has dependencies, the dependent kustomizations will get "DependencyNotReady" state, and won't continue with reconciliation.|
| `timeout` | [golang duration format](https://pkg.go.dev/time#Duration.String) | Default: 10m  |
| `sync_interval` | [golang duration format](https://pkg.go.dev/time#Duration.String) | Default: 10m  |
| `retry_interval` | [golang duration format](https://pkg.go.dev/time#Duration.String) | Default: 10m  |
| `validation` | String | Values: *none*, *client*, *server*. Default: *none*.  See [Flux documentation](https://fluxcd.io/docs/) for details.|
| `force` | Boolean | Default is *false*. Set *force=true* to instruct the kustomize controller to recreate resources when patching fails because of an immutable field change. |

You can also use `az k8s-configuration flux kustomization` to create, update, list, show, and delete kustomizations in a Flux configuration.

```console
az k8s-configuration flux kustomization -h

Group
    az k8s-configuration flux kustomization : Commands to manage Kustomizations associated with Flux
    v2 Kubernetes configurations.
        Command group 'k8s-configuration flux' is in preview and under development. Reference
        and support levels: https://aka.ms/CLI_refstatus
Commands:
    create : Create a Kustomization associated with a Kubernetes Flux v2 Configuration.
    delete : Delete a Kustomization associated with a Kubernetes Flux v2 Configuration.
    list   : List Kustomizations associated with a Kubernetes Flux v2 Configuration.
    show   : Show a Kustomization associated with a Flux v2 Configuration.
    update : Update a Kustomization associated with a Kubernetes Flux v2 Configuration.
```

Here are the kustomization create options:

```console
az k8s-configuration flux kustomization create -h

This command is from the following extension: k8s-configuration

Command
    az k8s-configuration flux kustomization create : Create a Kustomization associated with a
    Kubernetes Flux v2 Configuration.
        Command group 'k8s-configuration flux kustomization' is in preview and under
        development. Reference and support levels: https://aka.ms/CLI_refstatus
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
    Create a Kustomization associated wiht a Kubernetes v2 Flux Configuration
        az k8s-configuration flux kustomization create --resource-group my-resource-group \
        --cluster-name mycluster --cluster-type connectedClusters --name myconfig \
        --kustomization-name my-kustomization-2 --path ./my/path --prune --force
```

## Manage GitOps configurations using the Azure portal

The Azure portal is useful for managing GitOps configurations and the Flux extension in Azure Arc-enabled Kubernetes or AKS clusters. The portal displays all Flux configurations associated with each cluster and enables drilling in to each. The overall compliance state of the cluster relative to the state declared in the Git repository is provided. In addition, the Flux objects that have been deployed to the cluster are shown along with their installation parameters, compliance state, and any errors.

The portal can also be used to create and delete GitOps configurations.  Soon update of existing GitOps configuration will also be possible.

## Using Kustomize

The Flux Kustomize controller is installed as part of the `microsoft.flux` cluster extension. It allows the declarative management of cluster configuration and application deployment using Kubernetes manifests synced from a Git repository. These Kubernetes manifests can include a kustomize.yaml file, but it isn't required.

For usage details see the following documents:

* [Flux Kustomize controller](https://fluxcd.io/docs/components/kustomize/)
* [Kustomize reference documents](https://kubectl.docs.kubernetes.io/references/kustomize/)
* [The kustomization file](https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/)
* [Kustomize project](https://kubernetes-sigs.github.io/kustomize/)
* [Kustomize guides](https://kubectl.docs.kubernetes.io/guides/config_management/)

## Using Helm

The Flux Helm controller is installed as part of the `microsoft.flux` cluster extension. It allows you to declaratively manage Helm chart releases with Kubernetes manifests you maintain in your Git repository.

For usage details see the following documents:

* [Flux for Helm users](https://fluxcd.io/docs/use-cases/helm/)
* [Manage Helm releases](https://fluxcd.io/docs/guides/helmreleases/)
* [Migrate to Flux v2 Helm from Flux v1 Helm](https://fluxcd.io/docs/migration/helm-operator-migration/)
* [Flux Helm controller](https://fluxcd.io/docs/components/helm/)

## Migrating from Flux v1

If you have been using Flux v1 in Azure Arc-enabled Kubernetes or Azure Kubernetes Service clusters and want to migrate to using Flux v2 in the same clusters, you first need to delete the Flux v1 `sourceControlConfigurations` from the clusters.  The `microsoft.flux` cluster extension won't install if there are `sourceControlConfigurations` resources installed in the cluster.

Use these az CLI commands to find and then delete existing `sourceControlConfigurations` in a cluster:

```console
az k8s-configuration list --cluster-name <Arc or AKS cluster name> --cluster-type <connectedClusters OR managedClusters> --resource-group <resource group name>
az k8s-configuration delete --name <configuration name> --cluster-name <Arc or AKS cluster name> --cluster-type <connectedClusters OR managedClusters> --resource-group <resource group name>
```

You can also use the Azure portal to view and delete GitOps configurations in Azure Arc-enabled Kubernetes or AKS clusters.

General information about migration from Flux v1 to Flux v2 is available in the fluxcd project: [Migrate from Flux v1 to v2](https://fluxcd.io/docs/migration/).

## Next steps

Advance to the next tutorial to learn how to implement CI/CD with GitOps.
> [!div class="nextstepaction"]
> [Implement CI/CD with GitOps](./tutorial-gitops-flux2-ci-cd.md)
