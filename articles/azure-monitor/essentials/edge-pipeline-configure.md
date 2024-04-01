---
title: Configuration of Azure Monitor pipeline for edge and multicloud
description: Configuration of Azure Monitor pipeline for edge and multicloud
ms.topic: conceptual
ms.date: 11/14/2023
ms.author: bwren
author: bwren
---

# Configuration of Azure Monitor pipeline for edge and multicloud

Azure Monitor pipeline for edge and multicloud is an Azure Monitor component that enables at-scale collection, transformation, and routing of telemetry data at the edge and to the cloud. It leverages OpenTelemetry Collector as a foundation that enables an extensibility model to support collection from a wide range of data sources.

Azure Monitor Pipeline is deployed on an Arc-enabled K8s cluster in your environment. The Azure Monitor Pipeline Controller Arc Extension is installed on this cluster to consolidate data from your clients, which is then forwarded to Azure Monitor in the cloud.

[Placeholder for image]()


## Prerequisites

- [Arc-enabled Kubernetes cluster](../../azure-arc/kubernetes/overview.md ) in your own environment with an external IP address. See [Connect an existing Kubernetes cluster to Azure Arc](../../azure-arc/kubernetes/quickstart-connect-cluster.md) for details on enabling Arc for a cluster.
- A data collection process that sends one of the following types data to a Log Analytics workspace using a [data collection rule (DCR)](./data-collection-rule-overview.md).
  - Syslog
  - OLTP


## [Portal](#tab/Portal)
Using the Azure portal, you can deploy the Azure Monitor pipeline extension and instance to your Arc-enabled Kubernetes cluster and add dataflows using the same interface.

1. From the **Monitor** menu in the Azure portal, select **Pipelines**.
2. Click **Create Azure Monitor pipeline extension**.

### Pipeline instance

The **Basic** tab prompts you for the following information to deploy the extension and pipeline instance on your cluster.

:::image type="content" source="media/edge-pipeline/create-pipeline.png" lightbox="media/edge-pipeline/create-pipeline.png" alt-text="Screenshot of Create Azure Monitor pipeline screen.":::

| Property | Description |
|:---|:---|
| Instance name | Name for the Azure Monitor pipeline instance. Must be unique for the subscription. |
| Subscription | Azure subscription to create the pipeline instance. |
| Resource group | Resource group to create the pipeline instance. |
| Location | Location of the pipeline instance. |
| Arc K8 Cluster | Select your Arc-enabled Kubernetes cluster. |
| Custom Location | Custom location for your Arc-enabled Kubernetes cluster. |

### Data flows

The **Dataflow** tab allows you to create and edit dataflows for the pipeline instance. Each dataflow includes the following details:

:::image type="content" source="media/edge-pipeline/create-dataflow.png" lightbox="media/edge-pipeline/create-dataflow.png" alt-text="Screenshot of Create add dataflow screen.":::

| Property | Description |
|:---|:---|
| Name | Name for the dataflow. Must be unique for this pipeline. |
| Source type | The type of data being collected. The following source types are currently supported:<br>- Syslog<br>- OTLP |
| Port | Port that the pipeline listens on for incoming data. If two dataflows use the same port, they will both receive and process the data. |
| Destination Type | Destination for the data. Currently, only Log Analytics workspace is supported. |
| Log Analytics Workspace | Log Analytics workspace to send the data to. |
| Table Name | The name of the table in the Log Analytics workspace to send the data to. If the table doesn't exist then it will be created  |

## [CLI](#tab/CLI)

### Pipeline installation

The following three components must be installed and configured for the Azure Monitor Pipeline.

1. Install Azure Monitor Pipeline Controller Arc extension on your Kubernetes cluster.
2. Grant the Arc extension permission to send telemetry to your Log Analytics Workspace via DCR
3. Deploy the Azure Monitor Pipeline Configuration to the cluster.

## Deploy Azure Monitor Pipeline Arc extension
The first step is to deploy the Azure Monitor Pipeline Arc extension to your Azure Arc-enabled Kubernetes cluster. 

Use the `az k8s-extension create` command with `--extension-type microsoft.monitor.pipelinecontroller` to install the Azure Monitor Pipeline Controller. Provide a name for the extension that's 10 characters or less.

```azurecli
az k8s-extension create --name <extension-name> --extension-type microsoft.monitor.pipelinecontroller --scope cluster --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --release-train preview --release-namespace <release-namespace> --version 0.1.1-23318.7-privatepreview --debug --auto-upgrade false
```

## Give the Arc extension access to your DCR
A system identity is created when you deploy the extension. This identity is used when the pipeline connects to Azure Monitor and requires access to the DCR used in the data collection scenario.

Use the `az k8s-extension show` command with `--cluster-type connectedClusters --query "identity.principalId"` to get the object id of the System Assigned Identity.

```azurecli
az k8s-extension show --name <name> --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --query "identity.principalId" -o tsv
```

Use the output from this command with `az role assignment create` to allow the Azure Monitor Pipeline to send its telemetry to the DCR.

```azurecli
az role assignment create --assignee "<extension principal ID>" --role "Monitoring Metrics Publisher" --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Insights/dataCollectionRules/<dcr-name>"
```

Verify access to the DCR from the Access Control (IAM) option for the DCR in the Azure portal. The identity should be listed as a *Monitoring Metrics Publisher*.


### Dataflows
Once you have the pipeline configured, you can add one or more *dataflows*. Each dataflow includes the details in the following table.

| Setting | Description |
|:---|:---|
| Name | Name for the dataflow. Must be unique for this pipeline. |
| Source type | The type of data being collected. The following source types are currently supported:<br> - Syslog<br> - OTLP |
| Port | Port that the pipeline listens on for incoming data. If two dataflows use the same port, they will both receive and process the data. |
| Destination Type


```json
{
    "receivers": [
        {
            "type": "OTLP",
            "name": "receiver-OTLP-4317",
            "otlp": {
                "endpoint": "0.0.0.0:4317"
            }
        },
        {
            "type": "Syslog",
            "name": "receiver-Syslog-514",
            "syslog": {
                "endpoint": "0.0.0.0:514"
            }
        }
    ],
    "processors": [],
    "exporters": [
        {
            "type": "AzureMonitorWorkspaceLogs",
            "name": "exporter-lu7mbr90",
            "azureMonitorWorkspaceLogs": {
                "api": {
                    "dataCollectionEndpointUrl": "[reference(resourceId('Microsoft.Insights/dataCollectionEndpoints','Aep-mytestpl-ZZPXiU05tJ')).logsIngestion.endpoint]",
                    "stream": "Custom-DefaultAEPOTelLogs_CL-FqXSu6GfRF",
                    "dataCollectionRule": "[reference(resourceId('Microsoft.Insights/dataCollectionRules', 'Aep-mytestpl-ZZPXiU05tJ')).immutableId]",
                    "schema": {
                        "recordMap": [
                            {
                                "from": "body",
                                "to": "Body"
                            },
                            {
                                "from": "severity_text",
                                "to": "SeverityText"
                            },
                            {
                                "from": "time_unix_nano",
                                "to": "TimeGenerated"
                            }
                        ]
                    }
                }
            }
        }
    ]
}
```




### Deploy the Azure Monitor Pipeline Configuration to the cluster

The configuration file defines how the Azure Monitor Pipeline Controller will configure your cluster and deploy the pipelines necessary to receive and send telemetry to the cloud. 

| Parameter | Description |
|:---|:--|
| `namespace` | Namespace provided during deployment of the Arc extension. |
| `dcr_endpoint` | Endpoint of your DCE. You can locate this in the Azure portal by navigating to the DCE and copying the Logs Ingestion value.<br>Example: `https://example-dce-82qc.eastus-1.ingest.monitor.azure.com` |
| `stream_name` | Name of the stream in your DCR. From the JSON view of your DCR, copy the value of the stream name in the **Data sources** section.<br>Example: Custom-TestData_CL |
| `dcr` | Immutable ID of the DCR. From the JSON view of your DCR, copy the value of the immutable ID in the **General** section.<br>Example: dcr-00000000-0000-0000-0000-000000000000. |

Once the yaml file has been updated, deploy it to the cluster with the following command:

```azurecli
kubectl apply -f private-preview-plus-pipeline-config.yaml
```

Validate that the pipeline is running by first confirming the appropriate Kubernetes pods were created:

```azurecli
kubectl get pods -n <insert namespace>
```

You should see three pods in the Running state:
- \<arc extension name\>-pipeline-operator-controller-manager… 
- Pipeline-0-deployment…
- Pipeline-nginx-deployment…

You can also query the logs for the namespace to validate that the pipeline is executing with the following command:

```azurecli
kubectl logs -l component=collector -n <namespace> -f --tail 1000
```

---




## Client configuration
Once your edge pipeline extension and instance are installed, then you need to configure your clients to send data to the pipeline.

### Retrieve ingress endpoint
Each client requires the external IP address of the pipeline. Use the following command to retrieve this address:

```azurecli
kubectl get services -n <namespace where azure monitor pipeline was installed>
```

If the application producing logs is external to the cluster, copy the *external-ip* value of the service *nginx-controller-service* with the load balancer type. If the application is on a pod within the cluster, copy the *cluster-ip* value. If the external-ip field is set to *pending*, you will need to configure an external IP for this ingress manually according to your cluster configuration.

### Syslog clients
Update Syslog clients to send data to the pipeline endpoint and the port of your Syslog dataflow. For example, if you have a linux machine with *syslog/rsyslog* log installed, add this information to the configuration file `rsyslog.conf`.

You can update the configuration file with the following command:

```bash
sudo nano /etc/rsyslog.conf
```

For example, the following configuration file sends logs to a pipeline at address 10.0.0.92:514.

```
# rsyslog configuration file

# Filter duplicated messages
$RepeatedMsgReduction on

#
# Set the default permissions for all log files.
#
$FileOwner syslog
$FileGroup adm
$FileCreateMode 0640
$DirCreateMode 0755
$Umask 0022
$PrivDropToUser syslog
$PrivDropToGroup syslog

#
# Where to place spool and state files
#
$WorkDirectory /var/spool/syslog

#
# Include all config files in /etc/rsyslog.d/
#
#IncludeConfig /etc/rsyslog.d/*.conf   

# ---
*.* @10.0.0.92:514
```

### OTLP clients
The Azure Monitor edge pipeline exposes a gRPC-based OTLP endpoint on port 4317. Configuring your instrumentation to send to this OTLP endpoint will depend on the instrumentation library itself. See [OTLP endpoint or Collector](https://opentelemetry.io/docs/instrumentation/python/exporters/#otlp-endpoint-or-collector) for OpenTelemetry documentation. The environment variable method is documented at [OTLP Exporter Configuration](https://opentelemetry.io/docs/concepts/sdk-configuration/otlp-exporter-configuration/).


## Cache configuration
Edge devices in some environments may experience intermittent connectivity due to various factors such as network congestion, signal interference, power outage, or mobility. In these environments, you can configure the Azure Monitor edge pipeline to cache data to persistent disk and configure the queue to backfill cached data using a strategy most applicable to your environment.


During disconnected periods, the edge pipeline will write collected data as files in the persistent volume.

