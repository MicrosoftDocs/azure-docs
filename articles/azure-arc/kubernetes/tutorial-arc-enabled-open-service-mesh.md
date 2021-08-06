---
title: Azure Arc–enabled Open Service Mesh (Preview)
description: Open Service Mesh (OSM) extension on Azure Arc–enabled Kubernetes cluster
services: azure-arc
ms.service: azure-arc
ms.date: 07/23/2021
ms.topic: article
author: mayurigupta13
ms.author: mayg
---

# Azure Arc–enabled Open Service Mesh (Preview)

[Open Service Mesh (OSM)](https://docs.openservicemesh.io/) is a lightweight, extensible, Cloud Native service mesh that allows users to uniformly manage, secure, and get out-of-the-box observability features for highly dynamic microservice environments.

OSM runs an Envoy-based control plane on Kubernetes, can be configured with [SMI](https://smi-spec.io/) APIs, and works by injecting an Envoy proxy as a sidecar container next to each instance of your application. [Read more](https://docs.openservicemesh.io/#features) on the service mesh scenarios enabled by Open Service Mesh.

### Support limitations for Azure Arc–enabled Open Service Mesh

- Only one instance of Open Service Mesh can be deployed on an Azure Arc–connected Kubernetes cluster
- Public preview is available for Open Service Mesh version v0.8.4 and above. Find out the latest version of the release [here](https://github.com/Azure/osm-azure/releases).
- Following Kubernetes distributions are currently supported
    - AKS Engine
    - Cluster API Azure
    - Google Kubernetes Engine
    - Canonical Kubernetes Distribution
    - Rancher Kubernetes Engine
    - OpenShift Kubernetes Distribution
    - Amazon Elastic Kubernetes Service
- Azure Monitor integration with Azure Arc–enabled Open Service Mesh is available with [limited support](https://github.com/microsoft/Docker-Provider/blob/ci_dev/Documentation/OSMPrivatePreview/ReadMe.md).


[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

### Prerequisites

- Ensure you have met all the common prerequisites for cluster extensions listed [here](extensions.md#prerequisites).
- Use az k8s-extension CLI version >= v0.4.0

## Install Azure Arc–enabled Open Service Mesh (OSM) on an Azure Arc–enabled Kubernetes cluster

The following steps assume that you already have a cluster with supported Kubernetes distribution connected to Azure Arc.

### Install a specific version of OSM

Ensure that your KUBECONFIG environment variable points to the kubeconfig of the Kubernetes cluster where you want the OSM extension installed.

Set the environment variables:

```azurecli-interactive
export VERSION=0.8.4
export CLUSTER_NAME=<arc-cluster-name>
export RESOURCE_GROUP=<resource-group-name>
```

While Azure Arc–enabled Open Service Mesh is in preview, the `az k8s-extension create` command only accepts `pilot` for the `--release-train` flag. `--auto-upgrade-minor-version` is always set to `false` and a version must be provided. If you have an OpenShift cluster, use the steps in the [section](#install-a-specific-version-of-osm-on-openshift-cluster).

```azurecli-interactive
az k8s-extension create --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --release-train pilot --name osm --version $VERSION
```

You should see output similar to the output shown below. It may take 3-5 minutes for the actual OSM helm chart to get deployed to the cluster. Until this deployment happens, you will continue to see installState as Pending.

```json
{
  "autoUpgradeMinorVersion": false,
  "configurationSettings": {},
  "creationTime": "2021-04-29T17:50:11.4116524+00:00",
  "errorInfo": {
    "code": null,
    "message": null
  },
  "extensionType": "microsoft.openservicemesh",
  "id": "/subscriptions/<subscription-id>/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Kubernetes/connectedClusters/$CLUSTER_NAME/providers/Microsoft.KubernetesConfiguration/extensions/osm",
  "identity": null,
  "installState": "Pending",
  "lastModifiedTime": "2021-04-29T17:50:11.4116525+00:00",
  "lastStatusTime": null,
  "location": null,
  "name": "osm",
  "releaseTrain": "pilot",
  "resourceGroup": "$RESOURCE_GROUP",
  "scope": {
    "cluster": {
      "releaseNamespace": "arc-osm-system"
    },
    "namespace": null
  },
  "statuses": [],
  "type": "Microsoft.KubernetesConfiguration/extensions",
  "version": "0.8.4"
}
```

### Install a specific version of OSM on OpenShift cluster

1. Copy and save the following contents into a JSON file. If you have already created a configuration settings file, please add the following line to the existing file to preserve your previous changes.
   ```json
   {
       "osm.OpenServiceMesh.enablePrivilegedInitContainer": "true"
   }
   ```

   Set the file path as an environment variable:
   ```azurecli-interactive
   export SETTINGS_FILE=<json-file-path>
   ```
   
2. Run the `az k8s-extension create` command used to create the OSM extension, and pass in the settings file using configuration settings:
   ```azurecli-interactive
   az k8s-extension create --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --release-train pilot --name osm --version $VERSION --configuration-settings-file $SETTINGS_FILE
   ```
   
3. Add the privileged [security context constraint](https://docs.openshift.com/container-platform/4.7/authentication/managing-security-context-constraints.html) to each service account for the applications in the mesh.
   ```azurecli-interactive
   oc adm policy add-scc-to-user privileged -z <service account name> -n <service account namespace>
   ```

It may take 3-5 minutes for the actual OSM helm chart to get deployed to the cluster. Until this deployment happens, you will continue to see installState as Pending.

To ensure that the privileged init container setting is not reverted to the default, pass in the "osm.OpenServiceMesh.enablePrivilegedInitContainer" : "true" configuration setting to all subsequent az k8s-extension create commands.

### Install Azure Arc–enabled OSM using ARM template

After connecting your cluster to Azure Arc, create a json file with the following format, making sure to update the <cluster-name> value:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "ConnectedClusterName": {
            "defaultValue": "<cluster-name>",
            "type": "String",
            "metadata": {
                "description": "The Connected Cluster name."
            }
        },
        "ExtensionInstanceName": {
            "defaultValue": "osm",
            "type": "String",
            "metadata": {
                "description": "The extension instance name."
            }
        },
        "ExtensionVersion": {
            "defaultValue": "0.8.4",
            "type": "String",
            "metadata": {
                "description": "The extension type version."
            }
        },
        "ExtensionType": {
            "defaultValue": "Microsoft.openservicemesh",
            "type": "String",
            "metadata": {
                "description": "The extension type."
            }
        },
        "ReleaseTrain": {
            "defaultValue": "Pilot",
            "type": "String",
            "metadata": {
                "description": "The release train."
            }
        }
    },
    "functions": [],
    "resources": [
        {
            "type": "Microsoft.KubernetesConfiguration/extensions",
            "apiVersion": "2020-07-01-preview",
            "name": "[parameters('ExtensionInstanceName')]",
            "properties": {
                "extensionType": "[parameters('ExtensionType')]",
                "releaseTrain": "[parameters('ReleaseTrain')]",
                "version": "[parameters('ExtensionVersion')]"
            },
            "scope": "[concat('Microsoft.Kubernetes/connectedClusters/', parameters('ConnectedClusterName'))]"
        }
    ]
}
```

Now set the environment variables:

```azurecli-interactive
export TEMPLATE_FILE_NAME=<template-file-path>
export DEPLOYMENT_NAME=<desired-deployment-name>
```

Finally, run this command to install the OSM extension through az CLI:

```azurecli-interactive
az deployment group create --name $DEPLOYMENT_NAME --resource-group $RESOURCE_GROUP --template-file $TEMPLATE_FILE_NAME
```

Now, you should be able to view the OSM resources and use the OSM extension in your cluster.

## Validate the Azure Arc–enabled Open Service Mesh installation

Run the following command.

```azurecli-interactive
az k8s-extension show --cluster-type connectedClusters --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --name osm
```

You should see a JSON output similar to the output below:

```json
{
  "autoUpgradeMinorVersion": false,
  "configurationSettings": {},
  "creationTime": "2021-04-29T19:22:00.7649729+00:00",
  "errorInfo": {
    "code": null,
    "message": null
  },
  "extensionType": "microsoft.openservicemesh",
  "id": "/subscriptions/<subscription-id>/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Kubernetes/connectedClusters/$CLUSTER_NAME/providers/Microsoft.KubernetesConfiguration/extensions/osm",
  "identity": null,
  "installState": "Installed",
  "lastModifiedTime": "2021-04-29T19:22:00.7649731+00:00",
  "lastStatusTime": "2021-04-29T19:23:27.642+00:00",
  "location": null,
  "name": "osm",
  "releaseTrain": "pilot",
  "resourceGroup": "$RESOURCE_GROUP",
  "scope": {
    "cluster": {
      "releaseNamespace": "arc-osm-system"
    },
    "namespace": null
  },
  "statuses": [],
  "type": "Microsoft.KubernetesConfiguration/extensions",
  "version": "0.8.4"
}
```
## OSM controller configuration
OSM deploys a MeshConfig resource `osm-mesh-config` as a part of its control plane in arc-osm-system namespace. The purpose of this MeshConfig is to provide the mesh owner/operator the ability to update some of the mesh configurations based on their needs. to view the default values, use the following command.

```azurecli-interactive
kubectl describe meshconfig osm-mesh-config -n arc-osm-system
```
The output would show the default values:

```azurecli-interactive
Certificate:
    Service Cert Validity Duration:  24h
  Feature Flags:
    Enable Egress Policy:      true
    Enable Multicluster Mode:  false
    Enable WASM Stats:         true
  Observability:
    Enable Debug Server:  false
    Osm Log Level:        info
    Tracing:
      Address:   jaeger.osm-system.svc.cluster.local
      Enable:    false
      Endpoint:  /api/v2/spans
      Port:      9411
  Sidecar:
    Config Resync Interval:            0s
    Enable Privileged Init Container:  false
    Envoy Image:                       mcr.microsoft.com/oss/envoyproxy/envoy:v1.18.3
    Init Container Image:              mcr.microsoft.com/oss/openservicemesh/init:v0.9.1
    Log Level:                         error
    Max Data Plane Connections:        0
    Resources:
  Traffic:
    Enable Egress:                          false
    Enable Permissive Traffic Policy Mode:  true
    Inbound External Authorization:
      Enable:              false
      Failure Mode Allow:  false
      Stat Prefix:         inboundExtAuthz
      Timeout:             1s
    Use HTTPS Ingress:     false
```
Refer to the [Config API reference](https://docs.openservicemesh.io/docs/apidocs/config/v1alpha1) for more information. Notice that **spec.traffic.enablePermissiveTrafficPolicyMode** is set to **true**. Permissive traffic policy mode in OSM is a mode where the [SMI](https://smi-spec.io/) traffic policy enforcement is bypassed. In this mode, OSM automatically discovers services that are a part of the service mesh and programs traffic policy rules on each Envoy proxy sidecar to be able to communicate with these services.

### Making changes to OSM controller configuration

> [!NOTE]
> Values in the MeshConfig `osm-mesh-config` are persisted across upgrades.

Changes to `osm-mesh-config` can be made using the kubectl patch command. In the following example, the permissive traffic policy mode is changed to false.

```azurecli-interactive
kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"traffic":{"enablePermissiveTrafficPolicyMode":false}}}' --type=merge
```

If an incorrect value is used, validations on the MeshConfig CRD will prevent the change with an error message explaining why the value is invalid. For example, the below command shows what happens if we patch enableEgress to a non-boolean value.

```azurecli-interactive
kubectl patch meshconfig osm-mesh-config -n arc-osm-system -p '{"spec":{"traffic":{"enableEgress":"no"}}}'  --type=merge

# Validations on the CRD will deny this change
The MeshConfig "osm-mesh-config" is invalid: spec.traffic.enableEgress: Invalid value: "string": spec.traffic.enableEgress in body must be of type boolean: "string"
```

## OSM controller configuration (version v0.8.4)

Currently you can access and configure the OSM controller configuration via the ConfigMap. To view the OSM controller configuration settings, query the `osm-config` ConfigMap via `kubectl` to view its configuration settings.

```azurecli-interactive
kubectl get configmap osm-config -n arc-osm-system -o json
```

Output:

```json
{
  "egress": "false",
  "enable_debug_server": "false",
  "enable_privileged_init_container": "false",
  "envoy_log_level": "error",
  "permissive_traffic_policy_mode": "true",
  "prometheus_scraping": "true",
  "service_cert_validity_duration": "24h",
  "tracing_enable": "false",
  "use_https_ingress": "false"
}
```

Read [OSM ConfigMap documentation](https://release-v0-8.docs.openservicemesh.io/docs/osm_config_map/) to understand each of the available configurations. 

To make changes to the OSM ConfigMap for version v0.8.4, use the following guidance:

1. Copy and save the changes you wish to make in a JSON file. In this example, we are going to change the permissive_traffic_policy_mode from true to false. Each time you make a change to `osm-config`, you will have to provide the full list of changes (compared to the default `osm-config`) in a JSON file.
    ```json
    {
        "osm.OpenServiceMesh.enablePermissiveTrafficPolicy" : "false"
    }
    ```
    
    Set the file path as an environment variable:
    
    ```azurecli-interactive
    export SETTINGS_FILE=<json-file-path>
    ```
    
2. Run the same `az k8s-extension create` command used to create the extension, but now pass in the configuration settings file: 
    ```azurecli-interactive
    az k8s-extension create --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --release-train pilot --name osm --version $VERSION --configuration-settings-file $SETTINGS_FILE
    ```
    
    > [!NOTE]
    > To ensure that the ConfigMap changes are not reverted to the default, pass in the same configuration settings to all subsequent az k8s-extension create commands.

## Using the Azure Arc–enabled Open Service Mesh

To start using OSM capabilities, you need to first onboard the application namespaces to the service mesh. Download the OSM CLI from [OSM GitHub releases page](https://github.com/openservicemesh/osm/releases/). Once the namespaces are added to the mesh, you can configure the SMI policies to achieve the desired OSM capability.

### Onboard namespaces to the service mesh

Add namespaces to the mesh by running the following command:

```azurecli-interactive
osm namespace add <namespace_name>
```

More information about onboarding services can be found [here](https://docs.openservicemesh.io/docs/tasks/onboard_services/).

### Configure OSM with Service Mesh Interface (SMI) policies

You can start with a [demo application](https://docs.openservicemesh.io/docs/getting_started/manual_demo/#deploy-applications) or use your test environment to try out SMI policies.

> [!NOTE] 
> Ensure that the version of the bookstore application you run matches the version of the OSM extension installed on your cluster. Ex: if you are using v0.8.4 of the OSM extension, use the bookstore demo from release-v0.8 branch of OSM upstream repository.

### Configuring your own Jaeger, Prometheus and Grafana instances

The OSM extension does not install add-ons like [Jaeger](https://www.jaegertracing.io/docs/getting-started/), [Prometheus](https://prometheus.io/docs/prometheus/latest/installation/) and [Grafana](https://grafana.com/docs/grafana/latest/installation/) so that users can integrate OSM with their own running instances of those tools instead. To integrate with your own instances, check the following documentation:

> [!NOTE]
> Use the commands provided in the OSM GitHub documentation with caution. Ensure that you use the correct namespace name 'arc-osm-system' when making changes to `osm-mesh-config`.

- [BYO-Jaeger instance](https://docs.openservicemesh.io/docs/tasks/observability/tracing/#byo-bring-your-own)
- [BYO-Prometheus instance](https://docs.openservicemesh.io/docs/tasks/observability/metrics/#byo-prometheus)
- [BYO-Grafana dashboard](https://docs.openservicemesh.io/docs/tasks/observability/metrics/#importing-dashboards-on-a-byo-grafana-instance)


## Monitoring application using Azure Monitor and Applications Insights

Both Azure Monitor and Azure Application Insights helps you maximize the availability and performance of your applications and services by delivering a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments.

Azure Arc–enabled Open Service Mesh will have deep integrations into both of these Azure services, and provide a seemless Azure experience for viewing and responding to critical KPIs provided by OSM metrics. Follow the steps below to allow Azure Monitor to scrape prometheus endpoints for collecting application metrics. 

1. Ensure that prometheus_scraping is set to true in the `osm-mesh-config`.

2. Ensure that the application namespaces that you wish to be monitored are onboarded to the mesh. Follow the guidance [available here](#onboard-namespaces-to-the-service-mesh).

3. Expose the prometheus endpoints for application namespaces.
    ```azurecli-interactive
    osm metrics enable --namespace <namespace1>
    osm metrics enable --namespace <namespace2>
    ```

4. Install the Azure Monitor extension using the guidance available [here](../../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md?toc=/azure/azure-arc/kubernetes/toc.json).

5. Add the namespaces you want to monitor in container-azm-ms-osmconfig ConfigMap. Download the ConfigMap from [here](https://github.com/microsoft/Docker-Provider/blob/ci_prod/kubernetes/container-azm-ms-osmconfig.yaml).
    ```azurecli-interactive
    monitor_namespaces = ["namespace1", "namespace2"]
    ```

6. Run the following kubectl command
    ```azurecli-interactive
    kubectl apply -f container-azm-ms-osmconfig.yaml
    ```

It may take up to 15 minutes for the metrics to show up in Log Analytics. You can try querying the InsightsMetrics table.

```azurecli-interactive
InsightsMetrics
| where Name contains "envoy"
| extend t=parse_json(Tags)
| where t.app == "namespace1"
```
Read more about integration with Azure Monitor [here](https://github.com/microsoft/Docker-Provider/blob/ci_dev/Documentation/OSMPrivatePreview/ReadMe.md).

### Navigating the OSM dashboard

1. Access your Azure Arc–connected Kubernetes cluster using this [link](https://aka.ms/azmon/osmarcux).
2. Go to Azure Monitor and navigate to the Reports tab to access the OSM workbook.
3. Select the time-range & namespace to scope your services.

![OSM workbook](./media/tutorial-arc-enabled-open-service-mesh/osm-workbook.jpg)

#### Requests tab

- This tab provides you the summary of all the http requests sent via service to service in OSM.
- You can view all the services and all the services it is communicating to by selecting the service in grid.
- You can view total requests, request error rate & P90 latency.
- You can drill down to destination and view trends for HTTP error/success code, success rate, pod resource utilization, and latencies at different percentiles.

#### Connections tab

- This tab provides you a summary of all the connections between your services in Open Service Mesh.
- Outbound connections: Total number of connections between Source and destination services.
- Outbound active connections: Last count of active connections between source and destination in selected time range.
- Outbound failed connections: Total number of failed connections between source and destination service

## Upgrade the OSM extension instance to a specific version

There may be some downtime of the control plane during upgrades. The data plane will only be affected during CRD upgrades.

### Supported Upgrades

The OSM extension can be upgraded up to the next minor version. Downgrades and major version upgrades are not supported at this time.

### CRD Upgrades

The OSM extension cannot be upgraded to a new version if that version contains CRD version updates without deleting the existing CRDs first. You can check if an OSM upgrade also includes CRD version updates by checking the CRD Updates section of the [OSM release notes](https://github.com/openservicemesh/osm/releases).

Make sure to back up your Custom Resources prior to deleting the CRDs so that they can be easily recreated after upgrading. Afterwards, follow the upgrade instructions captured below.

> [!NOTE] 
> Upgrading the CRDs will affect the data plane as the SMI policies won't exist between the time they're deleted and the time they're created again.

### Upgrade instructions

1. Delete the old CRDs and custom resources (Run from the root of the [OSM repo](https://github.com/openservicemesh/osm)). Ensure that the tag of the [OSM CRDs](https://github.com/openservicemesh/osm/tree/main/charts/osm/crds) corresponds to the new version of the chart.
    ```azurecli-interactive
    kubectl delete --ignore-not-found --recursive -f ./charts/osm/crds/

2. Install the updated CRDs.
    ```azurecli-interactive
    kubectl apply -f charts/osm/crds/
    ```

3. Set the new chart version as an environment variable:
    ```azurecli-interactive
    export VERSION=<chart version>
    ```
    
4. Run az k8s-extension create with the new chart version
    ```azurecli-interactive
    az k8s-extension create --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --release-train pilot --name osm --version $VERSION --configuration-settings-file $SETTINGS_FILE
    ```

5. Recreate Custom Resources using new CRDs

## Uninstall Azure Arc–enabled Open Service Mesh

Use the following command:

```azurecli-interactive
az k8s-extension delete --cluster-type connectedClusters --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --name osm -y
```

Verify that the extension instance has been deleted:

```azurecli-interactive
az k8s-extension list --cluster-type connectedClusters --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP
```

This output should not include OSM. If you don't have any other extensions installed on your cluster, it will just be an empty array.

When you use the az k8s-extension command to delete the OSM extension, the arc-osm-system namespace is not removed, and the actual resources within the namespace (like mutating webhook configuration and osm-controller pod) will take around ~10 minutes to delete.

> [!NOTE] 
> Use the az k8s-extension CLI to uninstall OSM components managed by Arc. Using the OSM CLI to uninstall is not supported by Arc and can result in undesirable behavior.

## Troubleshooting

Refer to the troubleshooting guide [available here](troubleshooting.md#arc-enabled-open-service-mesh).

## Next steps

> **Just want to try things out?**  
> Get started quickly with an [Azure Arc Jumpstart](https://aka.ms/arc-jumpstart-osm) scenario using Cluster API.
