---
title: Manage the Azure Operator Service Manager cluster extension
description: AOSM NFO extension command reference and examples.
author: msftadam
ms.author: adamdor
ms.date: 09/16/2024
ms.topic: how-to
ms.service: azure-operator-service-manager
---

# Manage network function operator extension
This article guides user management of the Azure Operator Service Manager (AOSM) network function operator (NFO) extension. This kubernetes cluster extension is used as part of the AOSM service offering and used to manage container based workloads, hosted by the Azure Operator Nexus platform.

## Overview 
These commands are executed after making the NAKS cluster ready for the add-on extension and presume prior installation of the Azure CLI and authentication into the target subscription.

## Create network function extension
The Azure CLI command 'az k8s-extension create' is executed to install the NFO extension.

### Command
```bash
az k8s-extension create --cluster-name
                        --cluster-type {connectedClusters}
                        --extension-type {Microsoft.Azure.HybridNetwork}
                        --name
                        --resource-group
                        --scope {cluster}
                        --release-namespace {azurehybridnetwork}
                        --release-train {preview, stable}
                        --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator
                        [--auto-upgrade {false, true}]
                        [--config global.networkfunctionextension.enableClusterRegistry={false, true}]
                        [--config global.networkfunctionextension.enableLocalRegistry={false, true}]
                        [--config global.networkfunctionextension.enableEarlyLoading={false,true}]
                        [--config global.networkfunctionextension.clusterRegistry.highAvailability.enabled={true, false}]
                        [--config global.networkfunctionextension.clusterRegistry.autoScaling.enabled={true, false}]
                        [--config global.networkfunctionextension.webhook.highAvailability.enabled={true, false}]
                        [--config global.networkfunctionextension.webhook.autoScaling.enabled={true, false}]
                        [--config global.networkfunctionextension.clusterRegistry.storageClassName=]
                        [--config global.networkfunctionextension.clusterRegistry.storageSize=]
                        [--config global.networkfunctionextension.webhook.pod.mutation.matchConditionExpression=]
                        [--config global.networkfunctionextension.clusterRegistry.clusterRegistryGCCadence=]
                        [--config global.networkfunctionextension.clusterRegistry.clusterRegistryGCThreshold=]
                        [--version]
```

### Required Parameters
`--cluster-name -c`
* Name of the Kubernetes cluster.

`--cluster-type -t`
* Specify Arc clusters or Azure kubernetes service (AKS) managed clusters or Arc appliances or provisionedClusters.
* Accepted values: connectedClusters.

`--extension-type`
* Name of the extension type.
* Accepted values: Microsoft.Azure.HybridNetwork.

`--name -n`
* Name of the extension instance.

`--resource-group -g`
* Name of resource group. You can configure the default group using 'az configure --defaults group=groupname'.
  
`--config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator`
* This configuration must be provided.

### Optional Parameters
`--auto-upgrade`
* Automatically upgrade minor version of the extension instance.
* Accepted values: false, true.
* Default value: true.

`--release-train`
* Specify the release train for the extension type.
* Accepted values: preview, stable.
* Default value: stable.

`--version` 
* Specify the explicit version to install for the extension instance if '--auto-upgrade-minor-version' isn't enabled.

### Optional feature specific configurations

#### Side Loading

`--config global.networkfunctionextension.enableLocalRegistry=`
* This configuration allows artifacts to be delivered to edge via hardware drive.
* Accepted values: false, true.
* Default value: false.

#### Pod Mutating Webhook
`--config global.networkfunctionextension.webhook.pod.mutation.matchConditionExpression=`
* This configuration is an optional parameter. It comes into play only when container network functions (CNFs) are installed in the corresponding release namespace.  
* This configuration configures more granular control on top of rules and namespaceSelectors.
* Default value:  
  ```bash
  "((object.metadata.namespace != \"kube-system\") ||  (object.metadata.namespace == \"kube-system\" && has(object.metadata.labels) && (has(object.metadata.labels.app) && (object.metadata.labels.app == \"commissioning\") || (has(object.metadata.labels.name) && object.metadata.labels.name == \"cert-exporter\") || (has(object.metadata.labels.app) && object.metadata.labels.app == \"descheduler\"))))"
  ```  
The referenced matchCondition implies that the pods getting accepted in kube-system namespace are mutated only if they have at least one of the following labels: app == "commissioning", app == "descheduler", or name == "cert-exporter." Otherwise, they aren't mutated and continue to be pulled from the original source as per the helm chart of CNF/Component/Application.  
* Accepted value: Any valid CEL expression.
* This parameter can be set or updated during either network function (NF) extension installation or update.  
* This condition comes into play only when the CNF/Component/Application are getting installed into the namespace as per the rules and namespaceSelectors. If there are more pods getting spin up in that namespace, this condition is applied.   

#### Cluster Registry
`--config global.networkfunctionextension.enableClusterRegistry=`
* This configuration provisions a registry in the cluster to locally cache artifacts.
* Default values enable lazy loading mode unless global.networkfunctionextension.enableEarlyLoading=true.
* Accepted values: false, true.
* Default value: false.

`--config global.networkfunctionextension.clusterRegistry.highAvailability.enabled=`
* This configuration provisions the cluster registry in high availability mode if cluster registry is enabled.
* Default value is true and uses Nexus Azure kubernetes service (NAKS) nexus-shared volume on AKS recommendation is set false.
* Accepted values: true, false.
* Default value: true.

`--config global.networkfunctionextension.clusterRegistry.autoScaling.enabled=`
* This configuration provisions the cluster registry pods with horizontal auto scaling.
* Accepted values: true, false.
* Default value: true.

`--config global.networkfunctionextension.webhook.highAvailability.enabled=`
* This configuration provisions multiple replicas of webhook for high availability.
* Accepted values: true, false.
* Default value: true.

`--config global.networkfunctionextension.webhook.autoScaling.enabled=`
* This configuration provisions the webhook pods with horizontal auto scaling.
* Accepted values: true, false.
* Default value: true.

`--config global.networkfunctionextension.enableEarlyLoading=`
* This configuration enables artifacts early loading into cluster registry before helm installation or upgrade.
* This configuration can only be enabled when global.networkfunctionextension.enableClusterRegistry=true.
* Accepted values: false, true.
* Default value: false.

`--config global.networkfunctionextension.clusterRegistry.storageClassName=`
* This configuration must be provided when global.networkfunctionextension.enableClusterRegistry=true. 
* NetworkFunctionExtension provisions a PVC to local cache artifacts from this storage class.
* Platform specific values
  * AKS: managed-csi
  * NAKS(Default): nexus-shared
  * NAKS(Non-HA): nexus-volume
  * Azure Stack Edge (ASE): managed-premium
* Default value: nexus-shared.

`--config global.networkfunctionextension.clusterRegistry.storageSize=`
* This configuration must be provided when global.networkfunctionextension.enableClusterRegistry=true.
* This configuration configures the size we reserve for cluster registry.
* This configuration uses unit as Gi and Ti for sizing.
* Default value: 100Gi

`--config global.networkfunctionextension.clusterRegistry.clusterRegistryGCCadence=`
* This configuration must be provided as a schedule in standard Unix crontab format. 
* This configuration specified as an empty string disable the scheduled job, allowing customers to opt out of running garbage collection.
* Default value: "0 0 * * *" -- Runs the job once everyday.

`--config global.networkfunctionextension.clusterRegistry.clusterRegistryGCThreshold=`
* This configuration specifies the precent threshold value to trigger the cluster registry garbage collection process.
* This configuration triggers garbage collection process when cluster registry usage exceeds this value.
* Default value: 0.

> [!NOTE]
> * When managing a NAKS cluster with AOSM, the default parameter values enable HA as the recommended configuration.
> * When managing a AKS cluster with AOSM, HA must be disabled using the following configuration options:
>
>```
>    --config global.networkfunctionextension.clusterRegistry.highAvailability.enabled=false
>    --config global.networkfunctionextension.webhook.highAvailability.enabled=false
>    --config global.networkfunctionextension.clusterRegistry.storageClassName=managed-csi
>```

## Update network function extension
The Azure CLI command 'az k8s-extension update' is executed to update the NFO extension.

```bash
az k8s-extension update --resource-group
                        --cluster-name
                        --cluster-type {connectedClusters}
                        --extension-type {Microsoft.Azure.HybridNetwork}
                        --name
                        --release-namespace {azurehybridnetwork}
                        --release-train {preview, stable}
                        --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator
                        [--version] {version-target}
                        [--config global.networkfunctionextension.enableClusterRegistry={false, true}]
                        [--config global.networkfunctionextension.enableLocalRegistry={false, true}]
                        [--config global.networkfunctionextension.enableEarlyLoading={false,true}]
                        [--config global.networkfunctionextension.clusterRegistry.highAvailability.enabled={true, false}]
                        [--config global.networkfunctionextension.clusterRegistry.autoScaling.enabled={true, false}]
                        [--config global.networkfunctionextension.webhook.highAvailability.enabled={true, false}]
                        [--config global.networkfunctionextension.webhook.autoScaling.enabled={true, false}]
                        [--config global.networkfunctionextension.clusterRegistry.storageClassName=]
                        [--config global.networkfunctionextension.clusterRegistry.storageSize=]
                        [--config global.networkfunctionextension.webhook.pod.mutation.matchConditionExpression=]
                        [--config global.networkfunctionextension.clusterRegistry.clusterRegistryGCCadence=]
                        [--config global.networkfunctionextension.clusterRegistry.clusterRegistryGCThreshold=]
```


## Delete network function extension
The Azure CLI command 'az k8s-extension delete' is executed to delete  the NFO extension.

```bash
az k8s-extension delete --resource-group
                        --cluster-name
                        --cluster-type {connectedClusters}
                        --extension-type {Microsoft.Azure.HybridNetwork}
                        --name
                        --release-namespace {azurehybridnetwork}
                        --release-train {preview, stable}
                        --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator
```

## Examples
Create a network function extension with auto upgrade.
```bash
az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork
```

Create a network function extension with a pined version.
```bash
az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --auto-upgrade-minor-version false --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork --version 1.0.2711-7
```

Create a network function extension with cluster registry (default lazy loading mode) feature enabled on NAKS.
```bash
az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork --config global.networkfunctionextension.enableClusterRegistry=true --config global.networkfunctionextension.clusterRegistry.storageSize=100Gi
```

Create a network function extension with cluster registry (default lazy loading mode) feature enabled on AKS.
```bash
az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork --config global.networkfunctionextension.enableClusterRegistry=true --config global.networkfunctionextension.clusterRegistry.highAvailability.enabled=false --config global.networkfunctionextension.clusterRegistry.storageClassName=managed-csi --config global.networkfunctionextension.clusterRegistry.storageSize=100Gi
```

Create a network function extension with cluster registry (early loading) feature enabled.
```bash
az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork --config global.networkfunctionextension.enableClusterRegistry=true --config global.networkfunctionextension.enableEarlyLoading=true --config global.networkfunctionextension.clusterRegistry.storageClassName=managed-csi --config global.networkfunctionextension.clusterRegistry.storageSize=100Gi
```

Create a network function extension with side loading feature enabled.
```bash
az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork --config global.networkfunctionextension.enableLocalRegistry=true
```

Update a network function extension to enable cluster registry.
```bash
az k8s-extension update --resource-group naks-1-rg --cluster-name naks-1  --cluster-type connectedClusters --name networkfunction-operator  --extension-type Microsoft.Azure.HybridNetwork --release-namespace azurehybridnetwork --config networkFunctionExtension.EnableManagedInClusterEdgeRegistry=true –-config networkFunctionExtension.EdgeRegistrySizeInGB=1024
```

Update a network function extension to reach a new target version.
```bash
az k8s-extension update --resource-group naks-1-rg --cluster-name naks-1  --cluster-type connectedClusters --name networkfunction-operator  --extension-type Microsoft.Azure.HybridNetwork --release-namespace azurehybridnetwork --version X.X.XXXX-YYY
```
