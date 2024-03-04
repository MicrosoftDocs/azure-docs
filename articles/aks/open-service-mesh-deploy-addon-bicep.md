---
title: Deploy the Open Service Mesh add-on by using Bicep
description: Use a Bicep template to deploy the Open Service Mesh (OSM) add-on to Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: devx-track-bicep
ms.date: 9/20/2021
ms.author: pgibson
---

# Deploy the Open Service Mesh add-on by using Bicep

This article shows you how to deploy the Open Service Mesh (OSM) add-on to Azure Kubernetes Service (AKS) by using a [Bicep](../azure-resource-manager/bicep/index.yml) template.

> [!IMPORTANT]
> Based on the version of Kubernetes your cluster is running, the OSM add-on installs a different version of OSM.
>
> |Kubernetes version         | OSM version installed |
> |---------------------------|-----------------------|
> | 1.24.0 or greater         | 1.2.5                 |
> | Between 1.23.5 and 1.24.0 | 1.1.3                 |
> | Below 1.23.5              | 1.0.0                 |
>
> Older versions of OSM may not be available for install or be actively supported if the corresponding AKS version has reached end of life. You can check the [AKS Kubernetes release calendar](./supported-kubernetes-versions.md#aks-kubernetes-release-calendar) for information on AKS version support windows.

[Bicep](../azure-resource-manager/bicep/overview.md) is a domain-specific language that uses declarative syntax to deploy Azure resources. You can use Bicep in place of creating [Azure Resource Manager templates](../azure-resource-manager/templates/overview.md) to deploy your infrastructure-as-code Azure resources.

## Prerequisites

- Azure CLI version 2.20.0 or later
- An SSH public key used for deploying AKS
- [Visual Studio Code](https://code.visualstudio.com/) with a Bash terminal
- The Visual Studio Code [Bicep extension](../azure-resource-manager/bicep/install.md)

## Install the OSM add-on for a new AKS cluster by using Bicep

For deployment of a new AKS cluster, you enable the OSM add-on at cluster creation. The following instructions use a generic Bicep template that deploys an AKS cluster by using ephemeral disks and the [`kubenet`](./configure-kubenet.md) container network interface, and then enables the OSM add-on. For more advanced deployment scenarios, see [What is Bicep?](../azure-resource-manager/bicep/overview.md).

### Create a resource group

In Azure, you can associate related resources by using a resource group. Create a resource group by using [az group create](/cli/azure/group#az-group-create). The following example creates a resource group named *my-osm-bicep-aks-cluster-rg* in a specified Azure location (region):

```azurecli-interactive
az group create --name <my-osm-bicep-aks-cluster-rg> --location <azure-region>
```

### Create the main and parameters Bicep files

By using Visual Studio Code with a Bash terminal open, create a directory to store the necessary Bicep deployment files. The following example creates a directory named *bicep-osm-aks-addon* and changes to the directory:

```azurecli-interactive
mkdir bicep-osm-aks-addon
cd bicep-osm-aks-addon
```

Next, create both the main file and the parameters file, as shown in the following example:

```azurecli-interactive
touch osm.aks.bicep && touch osm.aks.parameters.json
```

Open the *osm.aks.bicep* file and copy the following example content to it. Then save the file.

```bicep
// https://learn.microsoft.com/azure/aks/troubleshooting#what-naming-restrictions-are-enforced-for-aks-resources-and-parameters
@minLength(3)
@maxLength(63)
@description('Provide a name for the AKS cluster. The only allowed characters are letters, numbers, dashes, and underscore. The first and last character must be a letter or a number.')
param clusterName string
@minLength(3)
@maxLength(54)
@description('Provide a name for the AKS dnsPrefix. Valid characters include alphanumeric values and hyphens (-). The dnsPrefix can\'t include special characters such as a period (.)')
param clusterDNSPrefix string
param k8Version string
param sshPubKey string


resource aksCluster 'Microsoft.ContainerService/managedClusters@2021-03-01' = {
  name: clusterName
  location: resourceGroup().location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    kubernetesVersion: k8Version
    dnsPrefix: clusterDNSPrefix
    enableRBAC: true
    agentPoolProfiles: [
      {
        name: 'agentpool'
        count: 3
        vmSize: 'Standard_DS2_v2'
        osDiskSizeGB: 30
        osDiskType: 'Ephemeral'
        osType: 'Linux'
        mode: 'System'
      }
    ]
    linuxProfile: {
      adminUsername: 'adminUserName'
      ssh: {
        publicKeys: [
          {
            keyData: sshPubKey
          }
        ]
      }
    }
    addonProfiles: {
        openServiceMesh: {
            enabled: true
            config: {}
      }
    }
  }
}
```

Open the *osm.aks.parameters.json* file and copy the following example content to it. Add the deployment-specific parameters, and then save the file.

> [!NOTE]
> The *osm.aks.parameters.json* file is an example template parameters file needed for the Bicep deployment. Update the parameters specifically for your deployment environment. The specific parameter values in this example need the following parameters to be updated: `clusterName`, `clusterDNSPrefix`, `k8Version`, and `sshPubKey`. To find a list of supported Kubernetes versions in your region, use the `az aks get-versions --location <region>` command.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "clusterName": {
      "value": "<YOUR CLUSTER NAME HERE>"
    },
    "clusterDNSPrefix": {
      "value": "<YOUR CLUSTER DNS PREFIX HERE>"
    },
    "k8Version": {
      "value": "<YOUR SUPPORTED KUBERNETES VERSION HERE>"
    },
    "sshPubKey": {
      "value": "<YOUR SSH KEY HERE>"
    }
  }
}
```

### Deploy the Bicep files

To deploy the previously created Bicep files, open the terminal and authenticate to your Azure account for the Azure CLI by using the `az login` command. After you're authenticated to your Azure subscription, run the following commands for deployment:

```azurecli-interactive
az group create --name osm-bicep-test --location eastus2

az deployment group create \
  --name OSMBicepDeployment \
  --resource-group osm-bicep-test \
  --template-file osm.aks.bicep \
  --parameters @osm.aks.parameters.json
```

When the deployment finishes, you should see a message that says the deployment succeeded.

## Validate installation of the OSM add-on

You use several commands to check that all of the components of the OSM add-on are enabled and running.

First, query the add-on profiles of the cluster to check the enabled state of the installed add-ons. The following command should return `true`:

```azurecli-interactive
az aks list -g <my-osm-aks-cluster-rg> -o json | jq -r '.[].addonProfiles.openServiceMesh.enabled'
```

The following `kubectl` commands will report the status of *osm-controller*:

```azurecli-interactive
kubectl get deployments -n kube-system --selector app=osm-controller
kubectl get pods -n kube-system --selector app=osm-controller
kubectl get services -n kube-system --selector app=osm-controller
```

## Access the OSM add-on configuration

You can configure the OSM controller via the OSM MeshConfig resource, and you can view the OSM controller's configuration settings via the Azure CLI. Use the `kubectl get` command as shown in the following example:

```azurecli-interactive
kubectl get meshconfig osm-mesh-config -n kube-system -o yaml
```

Here's an example output of MeshConfig:

```yaml
apiVersion: config.openservicemesh.io/v1alpha1
kind: MeshConfig
metadata:
  creationTimestamp: "0000-00-00A00:00:00A"
  generation: 1
  name: osm-mesh-config
  namespace: kube-system
  resourceVersion: "2494"
  uid: 6c4d67f3-c241-4aeb-bf4f-b029b08faa31
spec:
  certificate:
    serviceCertValidityDuration: 24h
  featureFlags:
    enableEgressPolicy: true
    enableMulticlusterMode: false
    enableWASMStats: true
  observability:
    enableDebugServer: true
    osmLogLevel: info
    tracing:
      address: jaeger.osm-system.svc.cluster.local
      enable: false
      endpoint: /api/v2/spans
      port: 9411
  sidecar:
    configResyncInterval: 0s
    enablePrivilegedInitContainer: false
    envoyImage: mcr.microsoft.com/oss/envoyproxy/envoy:v1.18.3
    initContainerImage: mcr.microsoft.com/oss/openservicemesh/init:v0.9.1
    logLevel: error
    maxDataPlaneConnections: 0
    resources: {}
  traffic:
    enableEgress: true
    enablePermissiveTrafficPolicyMode: true
    inboundExternalAuthorization:
      enable: false
      failureModeAllow: false
      statPrefix: inboundExtAuthz
      timeout: 1s
    useHTTPSIngress: false
```

Notice that `enablePermissiveTrafficPolicyMode` is configured to `true`. In OSM, permissive traffic policy mode bypasses [SMI](https://smi-spec.io/) traffic policy enforcement. In this mode, OSM automatically discovers services that are a part of the service mesh. The discovered services will have traffic policy rules programmed on each Envoy proxy sidecar to allow communications between these services.

> [!WARNING]
> Before you proceed, verify that your permissive traffic policy mode is set to `true`. If it isn't, change it to `true` by using the following command:
>
> ```OSM Permissive Mode to True
> kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"traffic":{"enablePermissiveTrafficPolicyMode":true}}}' --type=merge
>```

## Clean up resources

When you no longer need the Azure resources, use the Azure CLI to delete the deployment's test resource group:

```azurecli-interactive
az group delete --name osm-bicep-test
```

Alternatively, you can uninstall the OSM add-on and the related resources from your cluster. For more information, see [Uninstall the Open Service Mesh add-on from your AKS cluster][osm-uninstall].

## Next steps

This article showed you how to install the OSM add-on on an AKS cluster and verify that it's installed and running. With the OSM add-on installed on your cluster, you can [deploy a sample application][osm-deploy-sample-app] or [onboard an existing application][osm-onboard-app] to work with your OSM mesh.

<!-- Links -->
<!-- Internal -->

[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[osm-uninstall]: open-service-mesh-uninstall-add-on.md
[osm-deploy-sample-app]: https://release-v1-0.docs.openservicemesh.io/docs/getting_started/install_apps/
[osm-onboard-app]: https://release-v1-0.docs.openservicemesh.io/docs/guides/app_onboarding/
