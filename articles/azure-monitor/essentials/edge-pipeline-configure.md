---
title: Configuration of Azure Monitor pipeline for edge and multicloud
description: Configuration of Azure Monitor pipeline for edge and multicloud
ms.topic: conceptual
ms.date: 11/14/2023
ms.author: bwren
author: bwren
---

# Configuration of Azure Monitor edge pipeline

[Azure Monitor pipeline](./pipeline-overview.md) is a data ingestion pipeline providing consistent and centralized data collection for Azure Monitor. The [edge pipeline](./pipeline-overview.md#edge-pipeline) enables at-scale collection, transformation, and routing of telemetry data before it's sent to the cloud. It can cache data locally and sync with the cloud when connectivity is restored and can also act as a proxy connection to Azure Monitor in cases where the network is segmented and data cannot be sent directly to the cloud. This article describes how to enable and configure the edge pipeline in your environment. 

## Overview
The Azure Monitor edge pipeline is a containerized solution that is deployed on an [Arc-enabled Kubernetes cluster](../../azure-arc/kubernetes/overview.md). It leverages OpenTelemetry Collector as a foundation that enables an extensibility model to support collection from a wide range of data sources.

The following diagram shows the components of the edge pipeline. One or more data flows listens for incoming data from clients, and the pipeline extension forwards the data to the cloud, using the local cache if necessary.

The pipeline configuration file the data flows and cache properties for the edge pipeline. Part of each data flow definition is the DCR and stream that will process that data in the cloud pipeline. The [DCR](./pipeline-overview.md#data-collection-rule) defines the schema of the incoming data, a transformation to filter or modify the data, and the destination where the data should be sent.

:::image type="content" source="media/edge-pipeline/edge-pipeline-configuration.png" lightbox="media/edge-pipeline/edge-pipeline-configuration.png" alt-text="Overview diagram of the dataflow for Azure Monitor edge pipeline." border="false"::: 


The following components are required to enable and configure the Azure Monitor edge pipeline. If you use the Azure portal to configure the edge pipeline, then each of these components is created for you. With other methods, you need to configure each one.


| Component | Description |
|:---|:---|
| Edge pipeline controller extension | Extension added to your Arc-enabled Kubernetes cluster to support pipeline functionality. |
| Edge pipeline controller instance | Instance of the edge pipeline running on your Arc-enabled Kubernetes cluster with a set of listeners to accept client data and exporters to deliver that data to Azure Monitor. |
| Pipeline configuration | Configuration file that defines the data flows for the pipeline instance. Each data flow includes a receiver and an exporter. The receiver listens for incoming data, and the exporter sends the data to the destination. |
| Data collection endpoint (DCE) | Endpoint where the data is sent to the Azure Monitor pipeline. The pipeline configuration includes a property for the URL of the DCE so the pipeline instance knows where to send the data. |
| Data collection rule (DCR) | Configuration file that defines how the data is received in the cloud pipeline and where it's sent. The DCR can also include a transformation to filter or modify the data before it's sent to the destination. |


## Prerequisites

- [Arc-enabled Kubernetes cluster](../../azure-arc/kubernetes/overview.md ) in your own environment with an external IP address. See [Connect an existing Kubernetes cluster to Azure Arc](../../azure-arc/kubernetes/quickstart-connect-cluster.md) for details on enabling Arc for a cluster.
- Log Analytics workspace in Azure Monitor to receive the data from the edge pipeline. See [Create a Log Analytics workspace in the Azure portal](../../azure-monitor/logs/quick-create-workspace.md) for details on creating a workspace.
- A data collection process that sends one of the following types data to a Log Analytics workspace using a [data collection rule (DCR)](./data-collection-rule-overview.md).
  - Syslog
  - OLTP


## Enable and configure pipeline
The current options for enabling and configuration are detailed in the tabs below.

### [Portal](#tab/Portal)

### Configure pipeline using Azure Portal
When you use the Azure portal to enable and configure the pipeline, all required components are created based on your selections.

From the **Monitor** menu in the Azure portal, select **Pipelines** and then click **Create Azure Monitor pipeline extension**. The **Basic** tab prompts you for the following information to deploy the extension and pipeline instance on your cluster.

:::image type="content" source="media/edge-pipeline/create-pipeline.png" lightbox="media/edge-pipeline/create-pipeline.png" alt-text="Screenshot of Create Azure Monitor pipeline screen.":::

The settings in this tab are described in the following table.

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

The settings in this tab are described in the following table.

| Property | Description |
|:---|:---|
| Name | Name for the dataflow. Must be unique for this pipeline. |
| Source type | The type of data being collected. The following source types are currently supported:<br>- Syslog<br>- OTLP |
| Port | Port that the pipeline listens on for incoming data. If two dataflows use the same port, they will both receive and process the data. |
| Destination Type | Destination for the data. Currently, only Log Analytics workspace is supported. |
| Log Analytics Workspace | Log Analytics workspace to send the data to. |
| Table Name | The name of the table in the Log Analytics workspace to send the data to. If the table doesn't exist then it will be created  |


### [ARM](#tab/ARM)

### Configure pipeline using ARM templates


### Edge pipeline extension

| Parameter | Description |
|:---|:--|
| `name` | Name of the pipeline extension. Must be unique for the subscription. |
| `scope` | Resource ID of the Arc-enabled Kubernetes cluster. |
| `releaseNamespace` | Namespace in the cluster where the extension will be deployed. |

```json
{
    "type": "Microsoft.KubernetesConfiguration/extensions",
    "apiVersion": "2022-11-01",
    "name": "my-pipeline-extension",
    "scope": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Kubernetes/connectedClusters/my-arc-cluster",
    "tags": "",
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
}
```


### DCE

| Parameter | Description |
|:---|:--|
| `name` | Name of the DCE. Must be unique for the subscription. |
| `location` | Location of the DCE. Must match the location of the DCR. |

```json
{
    "type": "Microsoft.Insights/dataCollectionEndpoints",            
    "name": "my-dce",
    "location": "eastus",
    "apiVersion": "2021-04-01",
    "tags": "",
    "properties": {
        "configurationAccess": {},
        "logsIngestion": {},
        "networkAcls": {
            "publicNetworkAccess": "Enabled"
        }
    }
}
```


### DCR
The DCR is stored in Azure Monitor and defines how the data will be processed when its received from the edge pipeline. See [Structure of a data collection rule in Azure Monitor](./data-collection-rule-overview.md) for details on the structure of a DCR. The edge pipeline configuration specifies the `immutable ID` of the DCR and the `stream` in the DCR that will process the data. 

| Parameter | Description |
|:---|:--|
| `name` | Name of the DCR. Must be unique for the subscription. |
| `location` | Location of the DCR. Must match the location of the DCE. |
| `dataCollectionEndpointId` | Resource ID of the DCE. |
| `streamDeclarations` | Schema of the data being received. One stream is required for each dataflow in the pipeline configuration. The name must be unique in the DCR and must begin with *Custom-*. The `column` sections in the samples below should be used for the OLTP and Syslog data flows. If the schema for your destination table is different, then you can modify it using a transformation. |
| `destinations` | Add additional section to send data to multiple workspaces. |
| - `name` | Name for the destination to reference in the `dataFlows` section. Must be unique for the DCR. |
| - `workspaceResourceId` | Resource ID of the Log Analytics workspace. |
| - `workspaceId` | Immutable ID of the Log Analytics workspace. |
| `dataFlows` | Matches streams and destinations. One entry for each stream/destination combination. |
| - `streams` | One or more streams (defined in `streamDeclarations`). You can include multiple stream if they're being sent to the same destination. |
| - `destinations` | One or more destinations (defined in `destinations`). You can include multiple destinations if they're being sent to the same destination. |
| - `transformKql` | Transformation to apply to the data before sending it to the destination. Use `source` to send the data without any changes. The output of the transformation must match the schema of the destination table. See [Data collection transformations in Azure Monitor](./data-collection-transformations.md) for details on transformations. |
| - `outputStream` | Specifies the destination table in the Log Analytics workspace. The table must already exist in the workspace. For custom tables, prefix the table name with *Custom-*. For built-in tables, prefix the table name with *Microsoft-*. |


```json
{
    {
        "type": "Microsoft.Insights/dataCollectionRules",
        "name": "my-dcr",
        "location": "eastus",
        "apiVersion": "2021-09-01-preview",
        "tags": "",
        "properties": {
            "dataCollectionEndpointId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Insights/dataCollectionEndpoints/my-dce",
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
                        "name": "LogAnayticsWorkspace01",
                        "workspaceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.OperationalInsights/workspaces/my-workspace",
                        "workspaceId": "dcr-00000000000000000000000000000000"
                    }
                ]
            },
            "dataFlows": [
                {
                    "streams": [
                        "Custom-OTLP"
                    ],
                    "destinations": [
                        "LogAnayticsWorkspace01"
                    ],
                    "transformKql": "source",
                    "outputStream": "Custom-OTelLogs_CL"
                },
                {
                    "streams": [
                        "Custom-Syslog"
                    ],
                    "destinations": [
                        "LogAnayticsWorkspace01"
                    ],
                    "transformKql": "source",
                    "outputStream": "Custom-Syslog_CL"
                }
            ]
        }
    }
}
```



#### Edge pipeline configuration
The pipeline configuration defines how the Azure Monitor Pipeline Controller will configure your cluster and deploy the pipelines necessary to receive and send telemetry to the cloud.

| Property | Description |
|:---|:--|
| `name` | Name of the pipeline instance. Must be unique in the subscription. |
| `location` | Location of the pipeline instance. |
| `extendedLocation` |  |
| `receivers` | One entry for each receiver. Each entry specifies the type of data being received, the port it will listen on, and a unique name that will be used in the `pipelines` section of the configuration. |
| - `type` | Type of data received. Current options are `OTLP` and `Syslog`. |
| - `name` | Name for the receiver referenced in the `service` section. Must be unique for the pipeline instance. |
| - `endpoint` | Address and port the receiver listens on. Use `0.0.0.0` for al addresses. |
| `processors` | Reserved for future use.|
| `exporters`  | One entry for each destination. |
| - `type` | Only currently supported type is `AzureMonitorWorkspaceLogs`. |
| - `name` | Must be unique for the pipeline instance. The name is used in the `pipelines` section of the configuration. |
| - `dataCollectionEndpointUrl` |  URL of your DCE. You can locate this in the Azure portal by navigating to the DCE and copying the Logs Ingestion value. |
| - `dataCollectionRule` | Immutable ID of the DCR. From the JSON view of your DCR, copy the value of the immutable ID in the **General** section. |
| `stream` | Name of the stream in your DCR that will accept the data. |
| `schema` | Schema of the data being sent to the cloud pipeline. This must match the schema defined in the stream in the DCR. |

##### `service` 
 Contains the `pipelines` section that defines the data flows for the pipeline instance that each match a `receiver` with an `exporter`. 



```json
{
    "type": "Microsoft.monitor/pipelineGroups",
    "location": "eastus",
    "apiVersion": "2023-10-01-preview",
    "name": "my-pipeline-group",
    "tags": "",
    "extendedLocation": {
        "name": "my-custom-location",
        "type": "CustomLocation"
    },
    "properties": {
        "receivers": [
            {
                "type": "OTLP",
                "name": "receiver-OTLP",
                "otlp": {
                    "endpoint": "0.0.0.0:4317"
                }
            },
            {
                "type": "Syslog",
                "name": "receiver-Syslog",
                "syslog": {
                    "endpoint": "0.0.0.0:514"
                }
            }
        ],
        "processors": [],
        "exporters": [
            {
                "type": "AzureMonitorWorkspaceLogs",
                "name": "exporter-log-analytics-workspace",
                "azureMonitorWorkspaceLogs": {
                    "api": {
                        "dataCollectionEndpointUrl": "https://my-dce-4agr.eastus-1.ingest.monitor.azure.com",
                        "stream": "Custom-OTLP",
                        "dataCollectionRule": "dcr-00000000000000000000000000000000",
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
                        "exporter-log-analytics-workspace"
                    ]
                },
                {
                    "name": "DefaultSyslogs",
                    "receivers": [
                        "receiver-Syslog"
                    ],
                    "processors": [],
                    "exporters": [
                        "exporter-log-analytics-workspace"
                    ]
                }
            ]
        }
    }
}
```


### [ARM sample](#tab/ARMAll)

### ARM template sample to configure all components

You can deploy all of the required components for the Azure Monitor edge pipeline using the single ARM template shown below. Edit the parameter file with specific values for your environment. Each section of the template is described below including sections that you must modify before using it.


| Component | Type | Description |
|:---|:---|:---|
| Log Analytics workspace | `Microsoft.OperationalInsights/workspaces` | Remove this section if you're using an existing Log Analytics workspace. The only parameter required is the workspace name. The immutable ID for the workspace, which is needed for other components, will be automatically created. |
| Data collection endpoint (DCE) | `Microsoft.Insights/dataCollectionEndpoints` | Remove this section if you're using an existing DCE. The only parameter required is the DCE name. The logs ingestion URL for the DCE, which is needed for other components, will be automatically created. |
| Edge pipeline extension | `Microsoft.KubernetesConfiguration/extensions` | The only parameter required is the pipeline extension name. |
| Custom location | `Microsoft.ExtendedLocation/customLocations` | Custom location of the the Arc-enabled Kubernetes cluster to create the custom |
| Edge pipeline instance | `Microsoft.monitor/pipelineGroups` | Edge pipeline instance that includes configuration of the listener, exporters, and data flows. You must modify the properties of the pipeline instance before deploying the template. |
| Data collection rule (DCR) | `Microsoft.Insights/dataCollectionRules` | The only parameter required is the DCR name, but you must modify the properties of the DCR before deploying the template. |


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

| Client | Description |
|:---|:---|
| Syslog | Update Syslog clients to send data to the pipeline endpoint and the port of your Syslog dataflow. |
| OTLP | The Azure Monitor edge pipeline exposes a gRPC-based OTLP endpoint on port 4317. Configuring your instrumentation to send to this OTLP endpoint will depend on the instrumentation library itself. See [OTLP endpoint or Collector](https://opentelemetry.io/docs/instrumentation/python/exporters/#otlp-endpoint-or-collector) for OpenTelemetry documentation. The environment variable method is documented at [OTLP Exporter Configuration](https://opentelemetry.io/docs/concepts/sdk-configuration/otlp-exporter-configuration/). |


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
|  Filtering | You can filter out certain data during data synchronization depending on the application requirements and the data characteristics. |
| Aggregation and sampling | Aggregate and sample data depending on its category to reduce the amount of data to be synced and optimize the bandwidth. |
| Data sync duration | Specify a time slot for data sync to ensure the optimum bandwidth consumption. For example, a retail customer may require to pick an after-store-hour time slot for data synchronization so that the data sync does not interfere with the regular store activities. |
| Bandwidth allocation | Allocate a percentage of bandwidth to sync the cached data to prioritize the real-time data to be ingested to cloud. |

## Next steps

- [Read more about Azure Monitor pipeline](./pipeline-overview.md).