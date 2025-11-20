---
title: Manage an Azure Operator Service Manager Cluster Extension
description: This article provides a command reference and examples for the Azure Operator Service Manager network function operator (NFO) extension.
author: msftadam
ms.author: adamdor
ms.date: 09/16/2024
ms.topic: how-to
ms.service: azure-operator-service-manager
---

# Manage an NFO extension

This article guides user management of a network function operator (NFO) extension for Azure Operator Service Manager. You use this Kubernetes cluster extension to manage container-based workloads that the Azure Operator Nexus platform hosts.

You run the commands in this article after you make the Nexus Azure Kubernetes Service (NAKS) cluster ready for the add-on extension. The commands presume prior installation of the Azure CLI and authentication into the target subscription.

## Create an NFO extension

To create an NFO extension, run the Azure CLI command `az k8s-extension create`.

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
                        [--config global.networkfunctionextension.clusterRegistry.registryService.scale={"small", "medium", "large"}]
                        [--version]
```

### Required parameters

`--cluster-name -c`

* Name of the Kubernetes cluster.

`--cluster-type -t`

* Specify Azure Arc clusters, Azure Kubernetes Service (AKS) managed clusters, Azure Arc appliances, or `provisionedClusters`.
* Accepted values: `connectedClusters`.

`--extension-type`

* Name of the extension type.
* Accepted values: `Microsoft.Azure.HybridNetwork`.

`--name -n`

* Name of the extension instance.

`--resource-group -g`

* Name of the resource group. You can configure the default group by using `az configure --defaults group=groupname`.
  
`--config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator`

* You must provide this configuration.

### Optional parameters

`--auto-upgrade`

* Automatically upgrade the minor version of the extension instance.
* Accepted values: `false`, `true`.
* Default value: `true`.

`--release-train`

* Specify the release train for the extension type.
* Accepted values: `preview`, `stable`.
* Default value: `stable`.

`--version`

* Specify the explicit version to install for the extension instance if `--auto-upgrade-minor-version` isn't enabled.

### Optional feature-specific configurations

#### Side loading

`--config global.networkfunctionextension.enableLocalRegistry=`

* This configuration allows artifacts to be delivered to the edge via hardware drive.
* Accepted values: `false`, `true`.
* Default value: `false`.

#### Pod mutating webhook

`--config global.networkfunctionextension.webhook.pod.mutation.matchConditionExpression=`

* This configuration is an optional parameter. It comes into play only when container network functions (CNFs) are installed in the corresponding release namespace.  
* This configuration sets more granular control on top of rules and `namespaceSelectors`.
* Default value:

  ```bash
  "((object.metadata.namespace != \"kube-system\") ||  (object.metadata.namespace == \"kube-system\" && has(object.metadata.labels) && (has(object.metadata.labels.app) && (object.metadata.labels.app == \"commissioning\") || (has(object.metadata.labels.name) && object.metadata.labels.name == \"cert-exporter\") || (has(object.metadata.labels.app) && object.metadata.labels.app == \"descheduler\"))))"
  ```  

  The referenced match condition implies that the pods getting accepted in the `kube-system` namespace are mutated only if they have at least one of the following labels: `app == "commissioning"`, `app == "descheduler"`, or `name == "cert-exporter"`. Otherwise, they aren't mutated and continue to be pulled from the original source in accordance with the Helm chart of the CNF, component, or application.  
* Accepted value: Any valid Common Expression Language (CEL) expression.
* You can set or update this parameter during installation or update of the NFO extension.  
* This condition comes into play only when you're installing the CNF, component, or application into the namespace in accordance with the rules and `namespaceSelectors`. If you create more pods in that namespace, this condition is applied.

#### Cluster registry

`--config global.networkfunctionextension.enableClusterRegistry=`

* This configuration provisions a registry in the cluster to locally cache artifacts.
* Default values enable lazy loading mode unless `global.networkfunctionextension.enableEarlyLoading=true`.
* Accepted values: `false`, `true`.
* Default value: `false`.

`--config global.networkfunctionextension.clusterRegistry.highAvailability.enabled=`

* This configuration provisions the cluster registry in high availability (HA) mode if the cluster registry is enabled.
* This configuration uses an NAKS `nexus-shared` volume on the AKS recommendation if the value is set to `false`.
* Registry pod replica count is a minimum of `3` and a maximum of `5`.
* Accepted values: `true`, `false`.
* Default value: `true`.

`--config global.networkfunctionextension.clusterRegistry.autoScaling.enabled=`

* This configuration provisions the cluster registry pods with horizontal autoscaling.
* Accepted values: `true`, `false`.
* Default value: `true`.

`--config global.networkfunctionextension.webhook.highAvailability.enabled=`

* This configuration provisions multiple replicas of the webhook for high availability.
* Accepted values: `true`, `false`.
* Default value: `true`.

`--config global.networkfunctionextension.webhook.autoScaling.enabled=`

* This configuration provisions the webhook pods with horizontal autoscaling.
* Accepted values: `true`, `false`.
* Default value: `true`.

`--config global.networkfunctionextension.enableEarlyLoading=`

* This configuration enables the early loading of artifacts into the cluster registry before Helm installation or upgrade.
* You can enable this configuration only when `global.networkfunctionextension.enableClusterRegistry=true`.
* Accepted values: `false`, `true`.
* Default value: `false`.

`--config global.networkfunctionextension.clusterRegistry.storageClassName=`

* You must provide this configuration when `global.networkfunctionextension.enableClusterRegistry=true`.
* `networkfunctionextension` provisions a persistent volume claim (PVC) to local cache artifacts from this storage class.
* Platform-specific values:
  * AKS: `managed-csi`
  * NAKS (default): `nexus-shared`
  * NAKS (non-HA): `nexus-volume`
  * Azure Stack Edge: `managed-premium`
* Default value: `nexus-shared`.

> [!NOTE]
>
> * When you're managing an NAKS cluster by using Azure Operator Service Manager, the default parameter values enable HA as the recommended configuration.
> * When you're managing an AKS cluster by using Azure Operator Service Manager, you must disable HA by using the following configuration options:
>
>```
>    --config global.networkfunctionextension.clusterRegistry.highAvailability.enabled=false
>    --config global.networkfunctionextension.webhook.highAvailability.enabled=false
>    --config global.networkfunctionextension.clusterRegistry.storageClassName=managed-csi
>```

`--config global.networkfunctionextension.clusterRegistry.storageSize=`

* You must provide this configuration when `global.networkfunctionextension.enableClusterRegistry=true`.
* This configuration sets the size that we reserve for the cluster registry.
* This configuration uses units as Gi and Ti for sizing.
* Default value: `100Gi`

`--config global.networkfunctionextension.clusterRegistry.clusterRegistryGCCadence=`

* You must provide this configuration as a schedule in standard Unix Crontab format.
* This configuration, specified as an empty string, disables the scheduled job so that you can opt out of running garbage collection.
* Default value: `0 0 * * *`. Runs the job once every day.

`--config global.networkfunctionextension.clusterRegistry.clusterRegistryGCThreshold=`

* This configuration specifies the percentage threshold value to trigger the garbage collection process for the cluster registry.
* This configuration triggers the garbage collection process when cluster registry usage exceeds this value.
* Default value: `0`.

`--config global.networkfunctionextension.clusterRegistry.registryService.scale=`

* This configuration sets the CPU and memory resources for the cluster registry to a predefined scale option.
* Accepted values: `small`, `medium`, `large`.
* Default value: `medium`.
* Following are the registry resource specifications for all three scales:

  ```
      - requests:
        - small: cpu: 100m, memory: 250Mi
        - medium: cpu: 250m, memory: 500Mi
        - large: cpu: 500m, memory: 1Gi
      - limits:
        - small: cpu: 100m, memory: 2Gi
        - medium: cpu: 500m, memory: 2Gi
        - large: cpu: 1, memory: 4Gi
  ```

## Update an NFO extension

To update an NFO extension, run the Azure CLI command `az k8s-extension update`:

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

## Delete an NFO extension

To delete an NFO extension, run the Azure CLI command `az k8s-extension delete`:

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

Create an NFO extension with automatic upgrade:

```bash
az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork
```

Create an NFO extension with a pinned version:

```bash
az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --auto-upgrade-minor-version false --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork --version 1.0.2711-7
```

Create an NFO extension with the cluster registry (default lazy loading mode) feature enabled on NAKS:

```bash
az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork --config global.networkfunctionextension.enableClusterRegistry=true --config global.networkfunctionextension.clusterRegistry.storageSize=100Gi
```

Create an NFO extension with the cluster registry (default lazy loading mode) feature enabled on AKS:

```bash
az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork --config global.networkfunctionextension.enableClusterRegistry=true --config global.networkfunctionextension.clusterRegistry.highAvailability.enabled=false --config global.networkfunctionextension.clusterRegistry.storageClassName=managed-csi --config global.networkfunctionextension.clusterRegistry.storageSize=100Gi
```

Create an NFO extension with the cluster registry (early loading) feature enabled:

```bash
az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork --config global.networkfunctionextension.enableClusterRegistry=true --config global.networkfunctionextension.enableEarlyLoading=true --config global.networkfunctionextension.clusterRegistry.storageClassName=managed-csi --config global.networkfunctionextension.clusterRegistry.storageSize=100Gi
```

Create an NFO extension with the side loading feature enabled:

```bash
az k8s-extension create --resource-group myresourcegroup --cluster-name mycluster --name myextension --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --scope cluster --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator --release-namespace azurehybridnetwork --config global.networkfunctionextension.enableLocalRegistry=true
```

Update an NFO extension to enable the cluster registry:

```bash
az k8s-extension update --resource-group naks-1-rg --cluster-name naks-1  --cluster-type connectedClusters --name networkfunction-operator  --extension-type Microsoft.Azure.HybridNetwork --release-namespace azurehybridnetwork --config networkFunctionExtension.EnableManagedInClusterEdgeRegistry=true –-config networkFunctionExtension.EdgeRegistrySizeInGB=1024
```

Update an NFO extension to reach a new target version:

```bash
az k8s-extension update --resource-group naks-1-rg --cluster-name naks-1  --cluster-type connectedClusters --name networkfunction-operator  --extension-type Microsoft.Azure.HybridNetwork --release-namespace azurehybridnetwork --version X.X.XXXX-YYY
```
