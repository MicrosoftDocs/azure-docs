---
title: Azure Arc-enabled Open Service Mesh (Preview)
description: Open Service Mesh (OSM) extension on Arc enabled Kubernetes cluster
services: azure-arc
ms.service: azure-arc
ms.date: 05/12/2021
ms.topic: article
author: mayurigupta13
ms.author: mayg
---

# Azure Arc-enabled Open Service Mesh (Preview)

## Overview

[Open Service Mesh (OSM)](https://docs.openservicemesh.io/) is a lightweight, extensible, Cloud Native service mesh that allows users to uniformly manage, secure, and get out-of-the-box observability features for highly dynamic microservice environments.

OSM runs an Envoy-based control plane on Kubernetes, can be configured with [SMI](https://smi-spec.io/) APIs, and works by injecting an Envoy proxy as a sidecar container next to each instance of your application. [Read more](https://docs.openservicemesh.io/#features) on the service mesh scenarios enabled by Open Service Mesh.

### Support limitations for Arc enabled Open Service Mesh
- Only one instance of Open Service Mesh can be deployed on an Arc connected Kubernetes cluster
- Public preview is available for Open Service Mesh version v0.8.3 and above
- Following Kubernetes distributions are currently supported
    - AKS Engine
    - Cluster API Azure
    - Google Kubernetes Engine
    - Canonical Kubernetes Distribution
    - Rancher Kubernetes Engine
    - OpenShift Kubernetes Distribution
    - Amazon Elastic Kubernetes Service


[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

### Prerequisite
Ensure you have met all the common prerequisites for cluster extensions listed [here](extensions.md#prerequisites).

## Install Arc enabled Open Service Mesh (OSM) on an Arc enabled Kubernetes cluster

The following steps assume that you already have a cluster with supported Kubernetes distribution connected to Azure Arc.

### Install a specific version of OSM

Ensure that your KUBECONFIG environment variable points to the kubeconfig of the Kubernetes cluster where you want the OSM extension installed.

Set the version environment variable:
```azurecli-interactive
export VERSION=0.8.3
```
While Arc enabled Open Service Mesh is in preview, the az k8s-extension create command only accepts pilot for the --release-train flag. auto-upgrade-minor-version is always set to false and a version must be provided. If you have an OpenShift cluster, use the steps in the [section](#install-a-specific-version-of-osm-on-openshift-cluster).

```azurecli-interactive
az k8s-extension create --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --release-train pilot --name osm --release-namespace arc-osm-system --version $VERSION
```

You should see output similar to the output shown below. It may take 3-5 minutes for the actual OSM helm chart to get deployed to the cluster. Till this deployment happens, you will continue to see installState as Pending.

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
  "version": "0.8.3"
}
```
### Install a specific version of OSM on OpenShift cluster

1. Copy and save the following in a JSON file. If you have already created a configuration settings file, please add the following line to the existing file to preserve your previous changes.

```json
{
    "osm.OpenServiceMesh.enablePrivilegedInitContainer" : "true"
}
```

Set the file path as an environment variable:
```azurecli-interactive
export SETTINGS_FILE=<json-file-path>
```
2. Run the az k8s-extension create command used to create the OSM extension, and pass in --configuration-settings-file $SETTINGS_FILE
```azurecli-interactive
az k8s-extension create --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --release-train pilot --name osm --release-namespace arc-osm-system --version $VERSION --configuration-settings-file $SETTINGS_FILE
```
3. Add the privileged [security context constraint](https://docs.openshift.com/container-platform/4.7/authentication/managing-security-context-constraints.html) to each service account for the applications in the mesh.
```azurecli-interactive
 oc adm policy add-scc-to-user privileged -z <service account name> -n <service account namespace>
```
It may take 3-5 minutes for the actual OSM helm chart to get deployed to the cluster. Till this deployment happens, you will continue to see installState as Pending.

To ensure that the priviliged init container setting is not reverted to the default, pass in the "osm.OpenServiceMesh.enablePrivilegedInitContainer" : "true" configuration setting to all subsequent az k8s-extension create commands.

### Install Arc enabled OSM using ARM template
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
            "defaultValue": "0.8.3",
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

## Validate the Arc enabled Open Service Mesh installation

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
  "version": "0.8.3"
}
```

## OSM controller configuration

Currently you can access and configure the OSM controller configuration via the configmap. To view the OSM controller configuration settings, query the osm-config configmap via `kubectl` to view its configuration settings.

```azurecli-interactive
kubectl describe configmap osm-config -n arc-osm-system 
```

Output of the default OSM configmap should look like the following:

```json
{
  "egress": "false",
  "enable_debug_server": "false",
  "envoy_log_level": "error",
  "permissive_traffic_policy_mode": "true",
  "prometheus_scraping": "true",
  "service_cert_validity_duration": "24h",
  "tracing_enable": "false",
  "use_https_ingress": "false"
}
```
Read [OSM ConfigMap documentation](https://github.com/openservicemesh/osm/blob/release-v0.8/docs/content/docs/osm_config_map.md) to understand each of the available configurations. Notice the **permissive_traffic_policy_mode** is configured to **true**. Permissive traffic policy mode in OSM is a mode where the [SMI](https://smi-spec.io/) traffic policy enforcement is bypassed. In this mode, OSM automatically discovers services that are a part of the service mesh and programs traffic policy rules on each Envoy proxy sidecar to be able to communicate with these services.

### Making changes to OSM ConfigMap
To make changes to the OSM configmap, use the following guidance:

1.  Copy and save the changes you wish to make in a JSON file. In this example, we are going to change the permissive_traffic_policy_mode from true to false and change the enable_debug_server setting from false to true. Note that everytime you make a change to osmconfig, you will have to provide the full list of changes (compared to the default osmconfig) in a JSON file.
```json
{
    "osm.OpenServiceMesh.enablePermissiveTrafficPolicy" : "false",
    "osm.OpenServiceMesh.enableDebugServer" : "true"
}
```
Set the file path as an environment variable:
```azurecli-interactive
export SETTINGS_FILE=<json-file-path>
```
2. Run the same az k8s-extension create command used to create the extension, but now pass in --configuration-settings-file $SETTINGS_FILE. If you've previously created a configuration protected settings file, pass that in to the command as well or those changes may be overridden.
```azurecli-interactive
az k8s-extension create --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --cluster-type connectedClusters --extension-type Microsoft.openservicemesh --scope cluster --release-train pilot --name osm --release-namespace arc-osm-system --version $VERSION --configuration-protected-settings-file $PROTECTED_SETTINGS_FILE --configuration-settings-file $SETTINGS_FILE
```
>[!NOTE]
>To ensure that the ConfigMap changes are not reverted to the default, pass in the same configuration settings to all subsequent az k8s-extension create commands.

## Using the Arc enabled Open Service Mesh
To start using OSM capabilities, you need to first onboard the application namespaces to the service mesh. This can be done using OSM CLI, which is available for download [here](https://github.com/openservicemesh/osm/blob/release-v0.8/docs/content/docs/install/_index.md). Once the namespaces are added to the mesh, you can configure the SMI policies to achieve the desired OSM capability.

### Onboard namespaces to the service mesh
Add namespaces to the mesh by running the following command:
```azurecli-interactive
osm namespace add <namespace_name>
```
More information about onboarding services can be found [here](https://github.com/openservicemesh/osm/blob/release-v0.8/docs/content/docs/tasks_usage/onboard_services.md).

### Configure OSM with Service Mesh Interface (SMI) policies
You can start with a [demo application](https://github.com/openservicemesh/osm/blob/release-v0.8/docs/content/docs/install/manual_demo/_index.md#deploy-the-bookstore-demo-applications) or use your test environment to try out SMI policies.

>[!NOTE] 
>Ensure that the version of the bookstore application you run matches the version of the OSM extension have installed on your cluster. Ex: if you are using v0.8.3 of the OSM extension, use the bookstore demo from release-v0.8 branch of OSM upstream repository.

### Configuring your own Jaeger, Prometheus and Grafana instances
The OSM extension has [Jaeger](https://www.jaegertracing.io/docs/getting-started/), [Prometheus](https://prometheus.io/docs/prometheus/latest/installation/) and [Grafana](https://grafana.com/docs/grafana/latest/installation/) installation disabled by default so that users can integrate OSM with their own running instances of these. To integrate with your own instances, refer to the following documentation:

- [BYO-Jaeger instance](https://github.com/Azure/azure-arc-kubernetes-preview/blob/master/docs/osm/tracing.md)
- [BYO-Prometheus instance](https://github.com/openservicemesh/osm/blob/release-v0.8/docs/content/docs/tasks_usage/metrics.md#byo-bring-your-own)
- [BYO-Grafana dashboard](https://github.com/openservicemesh/osm/blob/release-v0.8/docs/content/docs/tasks_usage/metrics.md#importing-dashboards-on-a-byo-grafana-instance)


## Monitoring application using Azure Monitor and Applications Insights

Both Azure Monitor and Azure Application Insights helps you maximize the availability and performance of your applications and services by delivering a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments.

Arc enabled Open Service Mesh will have deep integrations into both of these Azure services, and provide a seemless Azure experience for viewing and responding to critical KPIs provided by OSM metrics. Follow the steps below to allow Azure Monitor to scrape prometheus endpoints for collecting application metrics.

1. Ensure that prometheus_scraping is set to true in the OSM configmap.
2. Expose the prometheus endpoints for application namespaces
```azurecli-interactive
osm metrics enable --namespace <namespace1>
osm metrics enable --namespace <namespace2>
```
3. Install the Azure Monitor extension using the guidance available [here](../../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md?toc=/azure/azure-arc/kubernetes/toc.json).
4. Add the namespaces you want to monitor in container-azm-ms-osmconfig configmap 
```azurecli-interactive
monitor_namespaces = ["namespace1", "namespace2"]
```
5. Run the following kubectl command
```azurecli-interactive
kubectl apply -f container-azm-ms-osmconfig.yaml
```
It may take upto 15 minutes for the metrics to show up in Log Analytics. You can try querying the InsightsMetrics table.

```azurecli-interactive
InsightsMetrics 
| where Namespace == "prometheus"
| where Name contains "envoy"
| extend t=parse_json(Tags)
| where t.app == "namespace1"
```

### Navigating the OSM dashboard
1. Access your Arc connected Kubernetes cluster using this [link](https://aka.ms/azmon/osmux).
2. Go to Azure Monitor and navigate to the Reports tab to access the OSM workbook.
3. Select the time-range & namespace to scope your services.

![OSM workbook](./media/tutorial-arc-enabled-osm/osm-workbook.jpg)

#### Requests Tab

- This tab provides you the summary of all the http requests sent via service to service in OSM.
- You can view all the services and all the services it is communicating to by selecting the service in grid.
- You can view total requests, request error rate & P90 latency.
- You can drill-down to destination and view trends for HTTP error/success code, success rate, Pods resource utilization, latencies at different percentiles.

#### Connections Tab
- This tab provides you a summary of all the connections between your services in Open Service Mesh.
- Outbound connections: Total number of connections between Source and destination services.
- Outbound active connections: Last count of active connections between source and destination in selected time range.
- Outbound failed connections: Total number of failed connections between source and destination service

## Upgrade the OSM extension instance to a specific version
>[!NOTE] 
>Upgrading the OSM add-on could potentially overwrite user-configured values in the OSM configmap. To prevent any previous ConfigMap changes from being overwritten, pass in the same configuration settings file used to make those edits. If you've previously created a configuration protected settings file, pass it in as well.















## Open Service Mesh (OSM) AKS add-on Troubleshooting Guides

When you deploy the OSM AKS add-on, you might occasionally experience a problem. The following guides will assist you on how to troubleshoot errors and resolve common problems.

### Verifying and Troubleshooting OSM components

#### Check OSM Controller Deployment

```azurecli-interactive
kubectl get deployment -n kube-system --selector app=osm-controller
```

A healthy OSM Controller would look like this:

```Output
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
osm-controller   1/1     1            1           59m
```

#### Check the OSM Controller Pod

```azurecli-interactive
kubectl get pods -n kube-system --selector app=osm-controller
```

A healthy OSM Pod would look like this:

```Output
NAME                            READY   STATUS    RESTARTS   AGE
osm-controller-b5bd66db-wglzl   0/1     Evicted   0          61m
osm-controller-b5bd66db-wvl9w   1/1     Running   0          31m
```

Even though we had one controller evicted at some point, we have another one that is READY 1/1 and Running with 0 restarts. If the column READY is anything other than 1/1 the service mesh would be in a broken state.
Column READY with 0/1 indicates the control plane container is crashing - we need to get logs. See Get OSM Controller Logs from Azure Support Center section below. Column READY with a number higher than 1 after the / would indicate that there are sidecars installed. OSM Controller would most likely not work with any sidecars attached to it.

> [!NOTE]
> As of version v0.8.2 the OSM Controller is not in HA mode and will run in a deployed with replica count of 1 - single pod. The pod does have health probes and will be restarted by the kubelet if needed.

#### Check OSM Controller Service

```azurecli-interactive
kubectl get service -n kube-system osm-controller
```

A healthy OSM Controller service would look like this:

```Output
NAME             TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)              AGE
osm-controller   ClusterIP   10.0.31.254   <none>        15128/TCP,9092/TCP   67m
```

> [!NOTE]
> The CLUSTER-IP would be different. The service NAME and PORT(S) must be the same as the example above.

#### Check OSM Controller Endpoints

```azurecli-interactive
kubectl get endpoints -n kube-system osm-controller
```

A healthy OSM Controller endpoint(s) would look like this:

```Output
NAME             ENDPOINTS                              AGE
osm-controller   10.240.1.115:9092,10.240.1.115:15128   69m
```

#### Check OSM Injector Deployment

```azurecli-interactive
kubectl get pod -n kube-system --selector app=osm-injector
```

A healthy OSM Injector deployment would look like this:

```Output
NAME                            READY   STATUS    RESTARTS   AGE
osm-injector-5986c57765-vlsdk   1/1     Running   0          73m
```

#### Check OSM Injector Pod

```azurecli-interactive
kubectl get pod -n kube-system --selector app=osm-injector
```

A healthy OSM Injector pod would look like this:

```Output
NAME                            READY   STATUS    RESTARTS   AGE
osm-injector-5986c57765-vlsdk   1/1     Running   0          73m
```

#### Check OSM Injector Service

```azurecli-interactive
kubectl get service -n kube-system osm-injector
```

A healthy OSM Injector service would look like this:

```Output
NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
osm-injector   ClusterIP   10.0.39.54   <none>        9090/TCP   75m
```

#### Check OSM Endpoints

```azurecli-interactive
kubectl get endpoints -n kube-system osm-injector
```

A healthy OSM endpoint would look like this:

```Output
NAME           ENDPOINTS           AGE
osm-injector   10.240.1.172:9090   75m
```

#### Check Validating and Mutating webhooks

```azurecli-interactive
kubectl get ValidatingWebhookConfiguration --selector app=osm-controller
```

A healthy OSM Validating Webhook would look like this:

```Output
NAME              WEBHOOKS   AGE
aks-osm-webhook-osm   1      81m
```

```azurecli-interactive
kubectl get MutatingWebhookConfiguration --selector app=osm-injector
```

A healthy OSM Mutating Webhook would look like this:

```Output
NAME              WEBHOOKS   AGE
aks-osm-webhook-osm   1      102m
```

#### Check for the service and the CA bundle of the Validating webhook

```azurecli-interactive
kubectl get ValidatingWebhookConfiguration aks-osm-webhook-osm -o json | jq '.webhooks[0].clientConfig.service'
```

A well configured Validating Webhook Configuration would look exactly like this:

```json
{
  "name": "osm-config-validator",
  "namespace": "kube-system",
  "path": "/validate-webhook",
  "port": 9093
}
```

#### Check for the service and the CA bundle of the Mutating webhook

```azurecli-interactive
kubectl get MutatingWebhookConfiguration aks-osm-webhook-osm -o json | jq '.webhooks[0].clientConfig.service'
```

A well configured Mutating Webhook Configuration would look exactly like this:

```json
{
  "name": "osm-injector",
  "namespace": "kube-system",
  "path": "/mutate-pod-creation",
  "port": 9090
}
```

#### Check whether OSM Controller has given the Validating (or Mutating) Webhook a CA Bundle

> [!NOTE]
> As of v0.8.2 It is important to know that AKS RP installs the Validating Webhook, AKS Reconciler ensures it exists, but OSM Controller is the one that fills the CA Bundle.

```azurecli-interactive
kubectl get ValidatingWebhookConfiguration aks-osm-webhook-osm -o json | jq -r '.webhooks[0].clientConfig.caBundle' | wc -c
```

```azurecli-interactive
kubectl get MutatingWebhookConfiguration aks-osm-webhook-osm -o json | jq -r '.webhooks[0].clientConfig.caBundle' | wc -c
```

```Example Output
1845
```

This number indicates the number of bytes, or the size of the CA Bundle. If this is empty, 0, or some number under 1000 it would indicate that the CA Bundle is not correctly provisioned. Without a correct CA Bundle, the Validating Webhook would be erroring out and prohibiting the user from making changes to the osm-config ConfigMap in the kube-system namespace.

A sample error when the CA Bundle is incorrect:

- An attempt to change the osm-config ConfigMap:

```azurecli-interactive
kubectl patch ConfigMap osm-config -n kube-system --type merge --patch '{"data":{"config_resync_interval":"2m"}}'
```

- Error:

```
Error from server (InternalError): Internal error occurred: failed calling webhook "osm-config-webhook.k8s.io": Post https://osm-config-validator.kube-system.svc:9093/validate-webhook?timeout=30s: x509: certificate signed by unknown authority
```

Work around for when the **Validating** Webhook Configuration has a bad certificate:

- Option 1 - Restart OSM Controller - this will restart the OSM Controller. On start, it will overwrite the CA Bundle of both the Mutating and Validating webhooks.

```azurecli-interactive
kubectl rollout restart deployment -n kube-system osm-controller
```

- Option 2 - Option 2. Delete the Validating Webhook - removing the Validating Webhook makes mutations of the `osm-config` ConfigMap no longer validated. Any patch will go through. The AKS Reconciler will at some point ensure the Validating Webhook exists and will recreate it. The OSM Controller may have to be restarted to quickly rewrite the CA Bundle.

```azurecli-interactive
kubectl delete ValidatingWebhookConfiguration aks-osm-webhook-osm
```

- Option 3 - Delete and Patch: The following command will delete the validating webhook, allowing us to add any values, and will immediately try to apply a patch. Most likely the AKS Reconciler will not have enough time to reconcile and restore the Validating Webhook giving us the opportunity to apply a change as a last resort:

```azurecli-interactive
kubectl delete ValidatingWebhookConfiguration aks-osm-webhook-osm; kubectl patch ConfigMap osm-config -n kube-system --type merge --patch '{"data":{"config_resync_interval":"15s"}}'
```

#### Check the `osm-config` **ConfigMap**

> [!NOTE]
> The OSM Controller does not require for the `osm-config` ConfigMap to be present in the kube-system namespace. The controller has reasonable default values for the config and can operate without it.

Check for the existence:

```azurecli-interactive
kubectl get ConfigMap -n kube-system osm-config
```

Check the content of the osm-config ConfigMap

```azurecli-interactive
kubectl get ConfigMap -n kube-system osm-config -o json | jq '.data'
```

```json
{
  "egress": "true",
  "enable_debug_server": "true",
  "enable_privileged_init_container": "false",
  "envoy_log_level": "error",
  "outbound_ip_range_exclusion_list": "169.254.169.254,168.63.129.16,20.193.20.233",
  "permissive_traffic_policy_mode": "true",
  "prometheus_scraping": "false",
  "service_cert_validity_duration": "24h",
  "use_https_ingress": "false"
}
```

`osm-config` ConfigMap values:

| Key                              | Type   | Allowed Values                                          | Default Value                          | Function                                                                                                                                                                                                                                |
| -------------------------------- | ------ | ------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| egress                           | bool   | true, false                                             | `"false"`                              | Enables egress in the mesh.                                                                                                                                                                                                             |
| enable_debug_server              | bool   | true, false                                             | `"true"`                               | Enables a debug endpoint on the osm-controller pod to list information regarding the mesh such as proxy connections, certificates, and SMI policies.                                                                                    |
| enable_privileged_init_container | bool   | true, false                                             | `"false"`                              | Enables privileged init containers for pods in mesh. When false, init containers only have NET_ADMIN.                                                                                                                                   |
| envoy_log_level                  | string | trace, debug, info, warning, warn, error, critical, off | `"error"`                              | Sets the logging verbosity of Envoy proxy sidecar, only applicable to newly created pods joining the mesh. To update the log level for existing pods, restart the deployment with `kubectl rollout restart`.                            |
| outbound_ip_range_exclusion_list | string | comma-separated list of IP ranges of the form a.b.c.d/x | `-`                                    | Global list of IP address ranges to exclude from outbound traffic interception by the sidecar proxy.                                                                                                                                    |
| permissive_traffic_policy_mode   | bool   | true, false                                             | `"false"`                              | Setting to `true`, enables allow-all mode in the mesh i.e. no traffic policy enforcement in the mesh. If set to `false`, enables deny-all traffic policy in mesh i.e. an `SMI Traffic Target` is necessary for services to communicate. |
| prometheus_scraping              | bool   | true, false                                             | `"true"`                               | Enables Prometheus metrics scraping on sidecar proxies.                                                                                                                                                                                 |
| service_cert_validity_duration   | string | 24h, 1h30m (any time duration)                          | `"24h"`                                | Sets the service certificate validity duration, represented as a sequence of decimal numbers each with optional fraction and a unit suffix.                                                                                             |
| tracing_enable                   | bool   | true, false                                             | `"false"`                              | Enables Jaeger tracing for the mesh.                                                                                                                                                                                                    |
| tracing_address                  | string | jaeger.mesh-namespace.svc.cluster.local                 | `jaeger.kube-system.svc.cluster.local` | Address of the Jaeger deployment, if tracing is enabled.                                                                                                                                                                                |
| tracing_endpoint                 | string | /api/v2/spans                                           | /api/v2/spans                          | Endpoint for tracing data, if tracing enabled.                                                                                                                                                                                          |
| tracing_port                     | int    | any non-zero integer value                              | `"9411"`                               | Port on which tracing is enabled.                                                                                                                                                                                                       |
| use_https_ingress                | bool   | true, false                                             | `"false"`                              | Enables HTTPS ingress on the mesh.                                                                                                                                                                                                      |
| config_resync_interval           | string | under 1 minute disables this                            | 0 (disabled)                           | When a value above 1m (60s) is provided, OSM Controller will send all available config to each connected Envoy at the given interval                                                                                                    |

#### Check Namespaces

> [!NOTE]
> The kube-system namespace will never participate in a service mesh and will never be labeled and/or annotated with the key/values below.

We use the `osm namespace add` command to join namespaces to a given service mesh.
When a k8s namespace is part of the mesh (or for it to be part of the mesh) the following must be true:

View the annotations with

```azurecli-interactive
kubectl get namespace bookbuyer -o json | jq '.metadata.annotations'
```

The following annotation must be present:

```Output
{
  "openservicemesh.io/sidecar-injection": "enabled"
}
```

View the labels with

```azurecli-interactive
kubectl get namespace bookbuyer -o json | jq '.metadata.labels'
```

The following label must be present:

```Output
{
  "openservicemesh.io/monitored-by": "osm"
}
```

If a namespace is not annotated with `"openservicemesh.io/sidecar-injection": "enabled"` or not labeled with `"openservicemesh.io/monitored-by": "osm"` the OSM Injector will not add Envoy sidecars.

> Note: After `osm namespace add` is called only **new** pods will be injected with an Envoy sidecar. Existing pods must be restarted with `kubectl rollout restart deployment ...`

#### Verify the SMI CRDs:

Check whether the cluster has the required CRDs:

```azurecli-interactive
kubectl get crds
```

We must have the following installed on the cluster:

- httproutegroups.specs.smi-spec.io
- tcproutes.specs.smi-spec.io
- trafficsplits.split.smi-spec.io
- traffictargets.access.smi-spec.io
- udproutes.specs.smi-spec.io

Get the versions of the CRDs installed with this command:

```azurecli-interactive
for x in $(kubectl get crds --no-headers | awk '{print $1}' | grep 'smi-spec.io'); do
    kubectl get crd $x -o json | jq -r '(.metadata.name, "----" , .spec.versions[].name, "\n")'
done
```

Expected output:

```Output
httproutegroups.specs.smi-spec.io
----
v1alpha4
v1alpha3
v1alpha2
v1alpha1


tcproutes.specs.smi-spec.io
----
v1alpha4
v1alpha3
v1alpha2
v1alpha1


trafficsplits.split.smi-spec.io
----
v1alpha2


traffictargets.access.smi-spec.io
----
v1alpha3
v1alpha2
v1alpha1


udproutes.specs.smi-spec.io
----
v1alpha4
v1alpha3
v1alpha2
v1alpha1
```

OSM Controller v0.8.2 requires the following versions:

- traffictargets.access.smi-spec.io - [v1alpha3](https://github.com/servicemeshinterface/smi-spec/blob/v0.6.0/apis/traffic-access/v1alpha3/traffic-access.md)
- httproutegroups.specs.smi-spec.io - [v1alpha4](https://github.com/servicemeshinterface/smi-spec/blob/v0.6.0/apis/traffic-specs/v1alpha4/traffic-specs.md#httproutegroup)
- tcproutes.specs.smi-spec.io - [v1alpha4](https://github.com/servicemeshinterface/smi-spec/blob/v0.6.0/apis/traffic-specs/v1alpha4/traffic-specs.md#tcproute)
- udproutes.specs.smi-spec.io - Not supported
- trafficsplits.split.smi-spec.io - [v1alpha2](https://github.com/servicemeshinterface/smi-spec/blob/v0.6.0/apis/traffic-split/v1alpha2/traffic-split.md)
- \*.metrics.smi-spec.io - [v1alpha1](https://github.com/servicemeshinterface/smi-spec/blob/v0.6.0/apis/traffic-metrics/v1alpha1/traffic-metrics.md)

If CRDs are missing use the following commands to install these on the cluster:

```azurecli-interactive
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/v0.8.2/charts/osm/crds/access.yaml
```

```azurecli-interactive
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/v0.8.2/charts/osm/crds/specs.yaml
```

```azurecli-interactive
kubectl apply -f https://raw.githubusercontent.com/openservicemesh/osm/v0.8.2/charts/osm/crds/split.yaml
```

## Disable Open Service Mesh (OSM) add-on for your AKS cluster

To disable the OSM add-on, run the following command:

```azurecli-interactive
az aks disable-addons -n <AKS-cluster-name> -g <AKS-resource-group-name> -a open-service-mesh
```

<!-- LINKS - internal -->

[kubernetes-service]: concepts-network.md#services
[az-feature-register]: /cli/azure/feature?view=azure-cli-latest&preserve-view=true#az_feature_register
[az-feature-list]: /cli/azure/feature?view=azure-cli-latest&preserve-view=true#az_feature_list
[az-provider-register]: /cli/azure/provider?view=azure-cli-latest&preserve-view=true#az_provider_register