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

Azure Monitor Pipeline is deployed on an Arc-enabled Kubernetes cluster in your environment. The Azure Monitor Pipeline Controller Arc Extension is installed on this cluster to consolidate data from your clients, which is then forwarded to Azure Monitor in the cloud.


## Prerequisites

- [Arc-enabled Kubernetes cluster](../../azure-arc/kubernetes/overview.md ) in your own environment with an external IP address. See [Connect an existing Kubernetes cluster to Azure Arc](../../azure-arc/kubernetes/quickstart-connect-cluster.md) for details on enabling Arc for a cluster.
- Log Analytics workspace in Azure Monitor to receive the data from the edge pipeline. See [Create a Log Analytics workspace in the Azure portal](../../azure-monitor/logs/quick-create-workspace.md) for details on creating a workspace.
- A data collection process that sends one of the following types data to a Log Analytics workspace using a [data collection rule (DCR)](./data-collection-rule-overview.md).
  - Syslog
  - OLTP


## Enable and configure pipeline
The following components are required to enable and configure the Azure Monitor edge pipeline. Depending on the method you use to perform the configuration, you may need explicitly create each component, or they may be created for you based on your selections.

> [!NOTE]
> This list might be too detailed for the portal user. Could combine controller instance with data flows. Or keep this detail and make note in portal section that you don't need to worry about this level of detail.

| Component | Description |
|:---|:---|
| Edge pipeline controller extension | Extension added to your Arc-enabled Kubernetes cluster to support pipeline functionality. |
| Edge pipeline controller instance | Instance of the edge pipeline running on your Arc-enabled Kubernetes cluster with a set of listeners to accept client data and exporters to deliver that data to Azure Monitor. |
| Data flows | Pairing of receivers and exporters from the controller instance to receive and deliver specific sets of data. |
| Data collection endpoint (DCE) | Endpoint where the data is sent to the Azure Monitor pipeline. The pipeline configuration includes a property for the URL of the DCE so the pipeline instance knows where to send the data. |
| Data collection rule (DCR) | Configuration file that defines how the data is received in the cloud pipeline and where it's sent. The DCR can also include a transformation to filter or modify the data before it's sent to the destination. |
| Pipeline configuration | Configuration file that defines the data flows for the pipeline instance. Each data flow includes a receiver, processor, and exporter. The receiver listens for incoming data, the processor transforms the data, and the exporter sends the data to the destination. |

:::image type="content" source="media/edge-pipeline/edge-pipeline-configuration.png" lightbox="media/edge-pipeline/edge-pipeline-configuration.png" alt-text="Configuration details of the dataflow for Azure Monitor edge pipeline."::: 

### [Portal](#tab/Portal)

### Configure pipeline using Azure Portal
When you use the Azure portal to enable and configure the pipeline, all required components are created based on your selections.


1. From the **Monitor** menu in the Azure portal, select **Pipelines**.
2. Click **Create Azure Monitor pipeline extension**.

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


### [ARM](#tab/ARM)

You can deploy all of the required components for the Azure Monitor edge pipeline using the single ARM template shown below. Edit the parameter file with specific values for your environment. Each section of the template is described below including sections that you must modify before using it.


| Component | Type | Description |
|:---|:---|:---|
| Log Analytics workspace | `Microsoft.OperationalInsights/workspaces` | Remove this section if you're using an existing Log Analytics workspace. The only parameter required is the workspace name. The immutable ID for the workspace, which is needed for other components, will be automatically created. |
| Data collection endpoint (DCE) | `Microsoft.Insights/dataCollectionEndpoints` | Remove this section if you're using an existing DCE. The only parameter required is the DCE name. The logs ingestion URL for the DCE, which is needed for other components, will be automatically created. |
| Edge pipeline extension | `Microsoft.KubernetesConfiguration/extensions` | The only parameter required is the pipeline extension name. |
| Custom location | `Microsoft.ExtendedLocation/customLocations` | Custom location of the the Arc-enabled Kubernetes cluster to create the custom |
| Edge pipeline instance | `Microsoft.monitor/pipelineGroups` | Edgepipeline instasnce that includes configuration of the listener, exporters, and data flows. You must modify the properties of the pipeline instance before deploying the template. |
| Data collection rule (DCR) | `Microsoft.Insights/dataCollectionRules` | The only parameter required is the DCR name, but you must modify the properties of the DCR before deploying the template. |


### Edge pipeline configuration
The pipeline configuration defines how the Azure Monitor Pipeline Controller will configure your cluster and deploy the pipelines necessary to receive and send telemetry to the cloud.

| Parameter | Description |
|:---|:--|
| `receivers` | One entry for each receiver in the pipeline. Each entry specifies the type of data being received, the port it will listen on, and a unique name that will be used in the `pipelines` section of the configuration. |
| `processors` | Reserved for future use. |
| `exporters` | One entry for each destination that uses the following properties:<br>- `type` - Only currently supported type is `AzureMonitorWorkspaceLogs`.<br>- `name` - Must be unique for the pipeline instance. The name is used in the `pipelines` section of the configuration.<br>- `dataCollectionEndpointUrl`  URL of your DCE. You can locate this in the Azure portal by navigating to the DCE and copying the Logs Ingestion value.<br>- `dataCollectionRule` - Immutable ID of the DCR. From the JSON view of your DCR, copy the value of the immutable ID in the **General** section.<br>- `stream` - Name of the stream in your DCR that will accept the data.<br>- `schema` - Schema of the data being sent to the cloud pipeline. This must match the schema defined in the stream in the DCR. |
| `service` | Contains the `pipelines` section that defines the data flows for the pipeline instance that each match a `receiver` with an `exporter`. |


### Create data collection rule (DCR)
The DCR is stored in Azure Monitor and defines how the data will be processed when its received from the edge pipeline. See [Structure of a data collection rule in Azure Monitor](./data-collection-rule-overview.md) for details on the structure of a DCR. 


### Template file

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "location": {
            "type": "string"
        },
        "clusterId": {
            "type": "string"
        },
        "clusterExtensionIds": {
            "type": "array"
        },
        "customLocationName": {
            "type": "string"
        },
        "dceName": {
            "type": "string"
        },
        "dcrName": {
            "type": "string"
        },
        "logAnalyticsWorkspaceName": {
            "type": "string"
        },
        "pipelineExtensionName": {
            "type": "string"
        },
        "pipelineGroupName": {
            "type": "string"
        },
        "tagsByResource": {
            "type": "object",
            "defaultValue": {}
        },
        "tableInfo": {
            "type": "array",
            "defaultValue": []
        }
    },
    "resources": [
        {
            "type": "Microsoft.OperationalInsights/workspaces",            
            "name": "[parameters('logAnalyticsWorkspaceName')]",
            "location": "[parameters('location')]",
            "apiVersion": "2017-03-15-preview",
            "tags": "[ if(contains(parameters('tagsByResource'), 'Microsoft.OperationalInsights/workspaces'), parameters('tagsByResource')['Microsoft.OperationalInsights/workspaces'], json('{}')) ]",
            "properties": {
                "sku": {
                    "name": "pergb2018"
                }
            }
        },
        {
            "type": "Microsoft.Insights/dataCollectionEndpoints",            
            "name": "[parameters('dceName')]",
            "location": "[parameters('location')]",
            "apiVersion": "2021-04-01",
            "tags": "[ if(contains(parameters('tagsByResource'), 'Microsoft.Insights/dataCollectionEndpoints'), parameters('tagsByResource')['Microsoft.Insights/dataCollectionEndpoints'], json('{}')) ]",
            "properties": {
                "configurationAccess": {},
                "logsIngestion": {},
                "networkAcls": {
                    "publicNetworkAccess": "Enabled"
                }
            }
        },
        {
            "type": "Microsoft.Insights/dataCollectionRules",
            "name": "[parameters('dcrName')]",
            "location": "[parameters('location')]",
            "apiVersion": "2021-09-01-preview",
            "dependsOn": [
                "[resourceId('Microsoft.OperationalInsights/workspaces', 'DefaultWorkspace-westus2')]",
                "[resourceId('Microsoft.Insights/dataCollectionEndpoints', 'Aep-mytestpl-ZZPXiU05tJ')]"
            ],
            "tags": "[ if(contains(parameters('tagsByResource'), 'Microsoft.Insights/dataCollectionRules'), parameters('tagsByResource')['Microsoft.Insights/dataCollectionRules'], json('{}')) ]",
            "properties": {
                "dataCollectionEndpointId": "[resourceId('Microsoft.Insights/dataCollectionEndpoints', 'Aep-mytestpl-ZZPXiU05tJ')]",
                "streamDeclarations": {
                    "Custom-OTLP": {
                        "columns": [
                            {
                                "name": "Body",
                                "type": "string"
                            },
                            {
                                "name": "TimeGenerated",
                                "type": "datetime"
                            },
                            {
                                "name": "SeverityText",
                                "type": "string"
                            }
                        ]
                    }
                },
                    "Custom-Syslog": {
                        "columns": [
                            {
                                "name": "Body",
                                "type": "string"
                            },
                            {
                                "name": "TimeGenerated",
                                "type": "datetime"
                            },
                            {
                                "name": "SeverityText",
                                "type": "string"
                            }
                        ]
                    }
                },
                "dataSources": {},
                "destinations": {
                    "logAnalytics": [
                        {
                            "name": "DefaultWorkspace-westus2",
                            "workspaceResourceId": "[resourceId('Microsoft.OperationalInsights/workspaces', 'DefaultWorkspace-westus2')]",
                            "workspaceId": "[reference(resourceId('Microsoft.OperationalInsights/workspaces', 'DefaultWorkspace-westus2'))].customerId"
                        }
                    ]
                },
                "dataFlows": [
                    {
                        "streams": [
                            "Custom-OTLP"
                        ],
                        "destinations": [
                            "localDest-DefaultWorkspace-westus2"
                        ],
                        "transformKql": "source",
                        "outputStream": "Custom-OTelLogs_CL"
                    },
                    {
                        "streams": [
                            "Custom-Syslog"
                        ],
                        "destinations": [
                            "DefaultWorkspace-westus2"
                        ],
                        "transformKql": "source",
                        "outputStream": "Custom-Syslog_CL"
                    }
                ]
            }
        },
        {
            "type": "Microsoft.KubernetesConfiguration/extensions",
            "apiVersion": "2022-11-01",
            "name": "[parameters('pipelineExtensionName')]",
            "scope": "[parameters('clusterId')]",
            "tags": "[ if(contains(parameters('tagsByResource'), 'Microsoft.KubernetesConfiguration/extensions'), parameters('tagsByResource')['Microsoft.KubernetesConfiguration/extensions'], json('{}')) ]",
            "identity": {
                "type": "SystemAssigned"
            },
            "properties": {
                "aksAssignedIdentity": {
                    "type": "SystemAssigned"
                },
                "autoUpgradeMinorVersion": false,
                "extensionType": "microsoft.monitor.pipelinecontroller",
                "releaseTrain": "preview",
                "scope": {
                    "cluster": {
                        "releaseNamespace": "my-strato-ns"
                    }
                },
                "version": "0.37.3-privatepreview"
            }
        },
        {
            "type": "Microsoft.ExtendedLocation/customLocations",
            "apiVersion": "2021-08-15",
            "name": "[parameters('customLocationName')]",
            "location": "[parameters('location')]",
            "tags": "[ if(contains(parameters('tagsByResource'), 'Microsoft.ExtendedLocation/customLocations'), parameters('tagsByResource')['Microsoft.ExtendedLocation/customLocations'], json('{}')) ]",
            "dependsOn": [
                "[parameters('pipelineExtensionName')]"
            ],
            "properties": {
                "hostResourceId": "[parameters('clusterId')]",
                "namespace": "[toLower(parameters('customLocationName'))]",
                "clusterExtensionIds": "[parameters('clusterExtensionIds')]",
                "hostType": "Kubernetes"
            }
        },
        {
            "type": "Microsoft.monitor/pipelineGroups",
            "location": "[parameters('location')]",
            "apiVersion": "2023-10-01-preview",
            "name": "[parameters('pipelineGroupName')]",
            "tags": "[ if(contains(parameters('tagsByResource'), 'Microsoft.monitor/pipelineGroups'), parameters('tagsByResource')['Microsoft.monitor/pipelineGroups'], json('{}')) ]",
            "dependsOn": [
                "[parameters('customLocationName')]",
                "[resourceId('Microsoft.Insights/dataCollectionRules','Aep-mytestpl-ZZPXiU05tJ')]"
            ],
            "extendedLocation": {
                "name": "[resourceId('Microsoft.ExtendedLocation/customLocations', parameters('customLocationName'))]",
                "type": "CustomLocation"
            },
            "properties": {
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
                ],
                "service": {
                    "pipelines": [
                        {
                            "name": "DefaultOTLPLogs",
                            "receivers": [
                                "receiver-OTLP"
                            ],
                            "processors": [],
                            "exporters": [
                                "exporter-lu7mbr90"
                            ]
                        }
                    ]
                }
            }
        }
    ],
    "outputs": {}
}

```

### Sample parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "value": "eastus"
    },
    "clusterId": {
      "value": ""
    },
    "workspaceResourceId": {
      "value": "/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/microsoft.operationalinsights/workspaces/<workspaceName>"
    },
    "workspaceRegion": {
      "value": "<workspaceRegion>"
    },
    "workspaceDomain": {
      "value": "<workspaceDomainName>"
    }    
  }
}
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

| Setting | Description |
|:---|:---|
| Expiration | Defines the amount of time the data can remain in the cache before it's discarded. |
| Persistent volume limit | Memory limit for the cache. When the limit is reached, data is removed according to the data sync type. |


### Data sync type

| Type | Description |
|:---|:---|
| FIFO | First in, first out. When connectivity is restored, the oldest data is sent first, and all data in the queue is sent before any real-time data. This preserves the chronological order and completeness of the data making it ideal for data that is informative and used for SLI/SLOs or business KPIs.  |
| LIFO | Last in, first out. When connectivity is restored, the newest data is sent first, and all data in the queue is sent before any real-time data. This delivers the most recent and relevant data making it ideal for dynamic and adaptive data such as security events. |
| Real-time | Real-time data is prioritized before cached data is delivered. This data is ideal for time-sensitive and critical data such as health monitoring or emergency response. |
|  Filtering You can filter out certain data during data synchronization depending on the application requirements and the data characteristics. |
| Aggregation and sampling | Aggregate and sample data depending on its category to reduce the amount of data to be synced and optimize the bandwidth. |
| Data sync duration | Specify a time slot for data sync to ensure the optimum bandwidth consumption. For example, a retail customer may require to pick an after-store-hour time slot for data synchronization so that the data sync does not interfere with the regular store activities. |
| Bandwidth allocation | Allocate a percentage of bandwidth to sync the cached data to prioritize the real-time data to be ingested to cloud. |