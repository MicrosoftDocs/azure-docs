---
title: Deploy Open Service Mesh AKS add-on using Bicep
description: Deploy Open Service Mesh on Azure Kubernetes Service (AKS) using Bicep
services: container-service
ms.topic: article
ms.date: 9/20/2021
ms.author: pgibson
---

# Deploy Open Service Mesh (OSM) Azure Kubernetes Service (AKS) add-on using Bicep

This article will discuss how to deploy the OSM add-on to AKS using a [Bicep](../azure-resource-manager/bicep/index.yml) template.

> [!IMPORTANT]
> The OSM add-on installs version *0.11.1* of OSM on your cluster.

[Bicep](../azure-resource-manager/bicep/overview.md) is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. Bicep can be used in place of creating Azure [ARM](../azure-resource-manager/templates/overview.md) templates for deploying your infrastructure-as-code Azure resources.

## Prerequisites

- The Azure CLI, version 2.20.0 or later
- OSM version v0.11.1 or later
- An SSH Public Key used for deploying AKS
- [Visual Studio Code](https://code.visualstudio.com/) utilizing a Bash terminal
- Visual Studio Code [Bicep extension](../azure-resource-manager/bicep/install.md)

## Install the OSM AKS add-on for a new AKS cluster using Bicep

For a new AKS cluster deployment scenario, start with a brand new deployment of an AKS cluster with the OSM add-on enabled at the cluster create operation. The following set of directions will use a generic Bicep template that deploys an AKS cluster using ephemeral disks, using the [`kubenet`](./configure-kubenet.md) CNI, and enabling the AKS OSM add-on. For more advanced deployment scenarios visit the [Bicep](../azure-resource-manager/bicep/overview.md) documentation.

### Create a resource group

In Azure, you can associate related resources using a resource group. Create a resource group by using [az group create](/cli/azure/group#az_group_create). The following example is used to create a resource group named in a specified Azure location (region):

```azurecli-interactive
az group create --name <my-osm-bicep-aks-cluster-rg> --location <azure-region>
```

### Create the main and parameters Bicep files

Using Visual Studio Code with a bash terminal open, create a directory to store the necessary Bicep deployment files. The following example creates a directory named `bicep-osm-aks-addon` and changes to the directory

```azurecli-interactive
mkdir bicep-osm-aks-addon
cd bicep-osm-aks-addon
```

Next create both the main and parameters files, as shown in the following example.

```azurecli-interactive
touch osm.aks.bicep && touch osm.aks.parameters.json
```

Open the `osm.aks.bicep` file and copy the following example content to it, then save the file.

```azurecli-interactive
// https://docs.microsoft.com/azure/aks/troubleshooting#what-naming-restrictions-are-enforced-for-aks-resources-and-parameters
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

Open the `osm.aks.parameters.json` file and copy the following example content to it. Add the deployment-specific parameters, then save the file.

> [!NOTE]
> The `osm.aks.parameters.json` is an example template parameters file needed for the Bicep deployment. You will have to update the specified parameters specifically for your deployment environment. The specific parameter values used by this example needs the following parameters to be updated. They are the _clusterName_, _clusterDNSPrefix_, _k8Version_, and _sshPubKey_. To find a list of supported Kubernetes version in your region, please use the `az aks get-versions --location <region>` command.

```azurecli-interactive
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

### Deploy the Bicep file

To deploy the previously created Bicep files, open the terminal and authenticate to your Azure account for the Azure CLI using the `az login` command. Once authenticated to your Azure subscription, run the following commands for deployment.

```azurecli-interactive
az group create --name osm-bicep-test --location eastus2

az deployment group create \
  --name OSMBicepDeployment \
  --resource-group osm-bicep-test \
  --template-file osm.aks.bicep \
  --parameters @osm.aks.parameters.json
```

When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the AKS OSM add-on installation

There are several commands to run to check all of the components of the AKS OSM add-on are enabled and running:

First we can query the add-on profiles of the cluster to check the enabled state of the add-ons installed. The following command should return "true".

```azurecli-interactive
az aks list -g <my-osm-aks-cluster-rg> -o json | jq -r '.[].addonProfiles.openServiceMesh.enabled'
```

The following `kubectl` commands will report the status of the osm-controller.

```azurecli-interactive
kubectl get deployments -n kube-system --selector app=osm-controller
kubectl get pods -n kube-system --selector app=osm-controller
kubectl get services -n kube-system --selector app=osm-controller
```

## Accessing the AKS OSM add-on configuration

Currently you can access and configure the OSM controller configuration via the OSM MeshConfig resource, and you can view the OSM controller configuration settings via the CLI use the **kubectl** get command as shown below.

```azurecli-interactive
kubectl get meshconfig osm-mesh-config -n kube-system -o yaml
```

Output of the MeshConfig is shown in the following:

```
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

Notice the **enablePermissiveTrafficPolicyMode** is configured to **true**. Permissive traffic policy mode in OSM is a mode where the [SMI](https://smi-spec.io/) traffic policy enforcement is bypassed. In this mode, OSM automatically discovers services that are a part of the service mesh. The discovered services will have traffic policy rules programed on each Envoy proxy sidecar to allow communications between these services.

> [!WARNING]
> Before proceeding please verify that your permissive traffic policy mode is set to true, if not please change it to **true** using the command below

```OSM Permissive Mode to True
kubectl patch meshconfig osm-mesh-config -n kube-system -p '{"spec":{"traffic":{"enablePermissiveTrafficPolicyMode":true}}}' --type=merge
```

## Clean up resources

When the Azure resources are no longer needed, use the Azure CLI to delete the deployment test resource group.

```
az group delete --name osm-bicep-test
```

Alternatively, you can uninstall the OSM add-on and the related resources from your cluster. For more information, see [Uninstall the Open Service Mesh (OSM) add-on from your AKS cluster][osm-uninstall].

## Next steps

This article showed you how to install the OSM add-on on an AKS cluster and verify it is installed an running. With the the OSM add-on on your cluster you can [Deploy a sample application][osm-deploy-sample-app] or [Onboard an existing application][osm-onboard-app] to work with your OSM mesh.

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