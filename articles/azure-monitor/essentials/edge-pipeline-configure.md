---
title: Configuration of Azure Monitor pipeline for edge and multicloud
description: Configuration of Azure Monitor pipeline for edge and multicloud
ms.topic: conceptual
ms.date: 04/25/2024
ms.author: bwren
author: bwren
ms.custom: references_regions
---

# Configuration of Azure Monitor edge pipeline
[Azure Monitor pipeline](./pipeline-overview.md) is a data ingestion pipeline providing consistent and centralized data collection for Azure Monitor. The [edge pipeline](./pipeline-overview.md#edge-pipeline) enables at-scale collection, and routing of telemetry data before it's sent to the cloud. It can cache data locally and sync with the cloud when connectivity is restored and route telemetry to Azure Monitor in cases where the network is segmented and data cannot be sent directly to the cloud. This article describes how to enable and configure the edge pipeline in your environment. 

## Overview
The Azure Monitor edge pipeline is a containerized solution that is deployed on an [Arc-enabled Kubernetes cluster](../../azure-arc/kubernetes/overview.md) and leverages OpenTelemetry Collector as a foundation. The following diagram shows the components of the edge pipeline. One or more data flows listen for incoming data from clients, and the pipeline extension forwards the data to the cloud, using the local cache if necessary.

The pipeline configuration file defines the data flows and cache properties for the edge pipeline. The [DCR](./pipeline-overview.md#data-collection-rules) defines the schema of the data being sent to the cloud pipeline, a transformation to filter or modify the data, and the destination where the data should be sent. Each data flow definition for the pipeline configuration specifies the DCR and stream within that DCR that will process that data in the cloud pipeline.

:::image type="content" source="media/edge-pipeline/edge-pipeline-configuration.png" lightbox="media/edge-pipeline/edge-pipeline-configuration.png" alt-text="Overview diagram of the dataflow for Azure Monitor edge pipeline." border="false"::: 

> [!NOTE]
> Private link is supported by edge pipeline for the connection to the cloud pipeline.

The following components and configurations are required to enable the Azure Monitor edge pipeline. If you use the Azure portal to configure the edge pipeline, then each of these components is created for you. With other methods, you need to configure each one.


| Component | Description |
|:---|:---|
| Edge pipeline controller extension | Extension added to your Arc-enabled Kubernetes cluster to support pipeline functionality - `microsoft.monitor.pipelinecontroller`. |
| Edge pipeline controller instance | Instance of the edge pipeline running on your Arc-enabled Kubernetes cluster. |
| Data flow | Combination of receivers and exporters that run on the pipeline controller instance. Receivers accept data from clients, and exporters to deliver that data to Azure Monitor. |
| Pipeline configuration | Configuration file that defines the data flows for the pipeline instance. Each data flow includes a receiver and an exporter. The receiver listens for incoming data, and the exporter sends the data to the destination. |
| Data collection endpoint (DCE) | Endpoint where the data is sent to the Azure Monitor pipeline. The pipeline configuration includes a property for the URL of the DCE so the pipeline instance knows where to send the data. |

| Configuration | Description |
|:---|:---|
| Data collection rule (DCR) | Configuration file that defines how the data is received in the cloud pipeline and where it's sent. The DCR can also include a transformation to filter or modify the data before it's sent to the destination. |
| Pipeline configuration | Configuration that defines the data flows for the pipeline instance, including the data flows and cache. |

## Supported configurations

**Supported distros**<br>
Edge pipeline is supported on the following Kubernetes distributions:

- Canonical
- Cluster API Provider for Azure
- K3
- Rancher Kubernetes Engine
- VMware Tanzu Kubernetes Grid

**Supported locations**<br>
Edge pipeline is supported in the following Azure regions:

- East US2
- West US2
- West Europe

## Prerequisites

- [Arc-enabled Kubernetes cluster](../../azure-arc/kubernetes/overview.md ) in your own environment with an external IP address. See [Connect an existing Kubernetes cluster to Azure Arc](../../azure-arc/kubernetes/quickstart-connect-cluster.md) for details on enabling Arc for a cluster.
- The Arc-enabled Kubernetes cluster must have the custom locations features enabled. See [Create and manage custom locations on Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/custom-locations#enable-custom-locations-on-your-cluster).
- Log Analytics workspace in Azure Monitor to receive the data from the edge pipeline. See [Create a Log Analytics workspace in the Azure portal](../../azure-monitor/logs/quick-create-workspace.md) for details on creating a workspace.
- The following resource providers must be registered in your Azure subscription. See [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types).
  - Microsoft.Insights
  - Microsoft.Monitor 



## Workflow
You don't need a detail understanding of the different steps performed by the Azure Monitor pipeline to configure it using the Azure portal. You may need a more detailed understanding of it though if you use another method of installation or if you need to perform more advanced configuration such as transforming the data before it's stored in its destination.

The following tables and diagrams describe the detailed steps and components in the process for collecting data using the edge pipeline and passing it to the cloud pipeline for storage in Azure Monitor. Also included in the tables is the configuration required for each of those components.

| Step | Action | Supporting configuration |
|:---|:---|:---|
| 1. | Client sends data to the edge pipeline receiver. | Client is configured with IP and port of the edge pipeline receiver and sends data in the expected format for the receiver type. |
| 2. | Receiver forwards data to the exporter. | Receiver and exporter are configured in the same pipeline. |
| 3. | Exporter tries to send the data to the cloud pipeline. | Exporter in the pipeline configuration includes URL of the DCE, a unique identifier for the DCR, and the stream in the DCR that defines how the data will be processed. |
| 3a. | Exporter stores data in the local cache if it can't connect to the DCE. | Persistent volume for the cache and configuration of the local cache is enabled in the pipeline configuration. |

:::image type="content" source="media/edge-pipeline/edge-pipeline-data-flow.png" lightbox="media/edge-pipeline/edge-pipeline-data-flow.png" alt-text="Detailed diagram of the steps and components for data collection using Azure Monitor edge pipeline." border="false":::

| Step | Action | Supporting configuration |
|:---|:---|:---|
| 4. | Cloud pipeline accepts the incoming data. | The DCR includes a schema definition for the incoming stream that must match the schema of the data coming from the edge pipeline. |
| 5. | Cloud pipeline applies a transformation to the data. | The DCR includes a transformation that filters or modifies the data before it's sent to the destination. The transformation may filter data, remove or add columns, or completely change its schema. The output of the transformation must match the schema of the destination table. |
| 6. | Cloud pipeline sends the data to the destination. | The DCR includes a destination that specifies the Log Analytics workspace and table where the data will be stored. |

:::image type="content" source="media/edge-pipeline/cloud-pipeline-data-flow.png" lightbox="media/edge-pipeline/cloud-pipeline-data-flow.png" alt-text="Detailed diagram of the steps and components for data collection using Azure Monitor cloud pipeline." border="false"::: 

## Segmented network



[Network segmentation](/azure/architecture/networking/guide/network-level-segmentation) is a model where you use software defined perimeters to create a different security posture for different parts of your network. In this model, you may have a network segment that can't connect to the internet or to other network segments. The edge pipeline can be used to collect data from these network segments and send it to the cloud pipeline.

:::image type="content" source="media/edge-pipeline/layered-network.png" lightbox="media/edge-pipeline/layered-network.png" alt-text="Diagram of a layered network for Azure Monitor edge pipeline." border="false":::

To use Azure Monitor pipeline in a layered network configuration, you must add the following entries to the allowlist for the Arc-enabled Kubernetes cluster. See [Configure Azure IoT Layered Network Management Preview on level 4 cluster](/azure/iot-operations/manage-layered-network/howto-configure-l4-cluster-layered-network?tabs=k3s#configure-layered-network-management-preview-service).


```yml
- destinationUrl: "*.ingest.monitor.azure.com"
  destinationType: external
- destinationUrl: "login.windows.net"
  destinationType: external
```


## Create table in Log Analytics workspace

Before you configure the data collection process for the edge pipeline, you need to create a table in the Log Analytics workspace to receive the data. This must be a custom table since built-in tables aren't currently supported. The schema of the table must match the data that it receives, but there are multiple steps in the collection process where you can modify the incoming data, so you the table schema doesn't need to match the source data that you're collecting. The only requirement for the table in the Log Analytics workspace is that it has a `TimeGenerated` column.

See [Add or delete tables and columns in Azure Monitor Logs](../logs/create-custom-table.md) for details on different methods for creating a table. For example, use the CLI command below to create a table with the three columns called `Body`, `TimeGenerated`, and `SeverityText`.

```azurecli
az monitor log-analytics workspace table create --workspace-name my-workspace --resource-group my-resource-group  --name my-table_CL --columns TimeGenerated=datetime Body=string SeverityText=string
```



## Enable cache
Edge devices in some environments may experience intermittent connectivity due to various factors such as network congestion, signal interference, power outage, or mobility. In these environments, you can configure the edge pipeline to cache data by creating a [persistent volume](https://kubernetes.io) in your cluster. The process for this will vary based on your particular environment, but the configuration must meet the following requirements:

   - Metadata namespace must be the same as the specified instance of Azure Monitor pipeline.
   - Access mode must support `ReadWriteMany`.

Once the volume is created in the appropriate namespace, configure it using parameters in the pipeline configuration file below.

> [!CAUTION]
> Each replica of the edge pipeline stores data in a location in the persistent volume specific to that replica. Decreasing the number of replicas while the cluster is disconnected from the cloud will prevent that data from being backfilled when connectivity is restored.

## Enable and configure pipeline
The current options for enabling and configuration are detailed in the tabs below.

### [Portal](#tab/Portal)

### Configure pipeline using Azure portal
When you use the Azure portal to enable and configure the pipeline, all required components are created based on your selections. This saves you from the complexity of creating each component individually, but you made need to use other methods for 

Perform one of the following in the Azure portal to launch the installation process for the Azure Monitor pipeline:

- From the **Azure Monitor pipelines (preview)** menu, click  **Create**. 
- From the menu for your Arc-enabled Kubernetes cluster, select **Extensions** and then add the **Azure Monitor pipeline extension (preview)** extension.

The **Basic** tab prompts you for the following information to deploy the extension and pipeline instance on your cluster.

:::image type="content" source="media/edge-pipeline/create-pipeline.png" lightbox="media/edge-pipeline/create-pipeline.png" alt-text="Screenshot of Create Azure Monitor pipeline screen.":::

The settings in this tab are described in the following table.

| Property | Description |
|:---|:---|
| Instance name | Name for the Azure Monitor pipeline instance. Must be unique for the subscription. |
| Subscription | Azure subscription to create the pipeline instance. |
| Resource group | Resource group to create the pipeline instance. |
| Cluster name | Select your Arc-enabled Kubernetes cluster that the pipeline will be installed on. |
| Custom Location | Custom location for your Arc-enabled Kubernetes cluster. This will be automatically populated with the name of a custom location that will be created for your cluster or you can select another custom location in the cluster. |

The **Dataflow** tab allows you to create and edit dataflows for the pipeline instance. Each dataflow includes the following details:

:::image type="content" source="media/edge-pipeline/create-dataflow.png" lightbox="media/edge-pipeline/create-dataflow.png" alt-text="Screenshot of Create add dataflow screen.":::

The settings in this tab are described in the following table.

| Property | Description |
|:---|:---|
| Name | Name for the dataflow. Must be unique for this pipeline. |
| Source type | The type of data being collected. The following source types are currently supported:<br>- Syslog<br>- OTLP |
| Port | Port that the pipeline listens on for incoming data. If two dataflows use the same port, they will both receive and process the data. |
| Log Analytics Workspace | Log Analytics workspace to send the data to. |
| Table Name | The name of the table in the Log Analytics workspace to send the data to.   |


### [CLI](#tab/CLI)

### Configure pipeline using Azure CLI
Following are the steps required to create and configure the components required for the Azure Monitor edge pipeline using Azure CLI.  


### Edge pipeline extension
The following command adds the edge pipeline extension to your Arc-enabled Kubernetes cluster. 

```azurecli
az k8s-extension create --name <pipeline-extension-name> --extension-type microsoft.monitor.pipelinecontroller --scope cluster --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --release-train Preview

## Example
az k8s-extension create --name my-pipe --extension-type microsoft.monitor.pipelinecontroller --scope cluster --cluster-name my-cluster --resource-group my-resource-group --cluster-type connectedClusters --release-train Preview
```

### Custom location
The following ARM template creates the custom location for to your Arc-enabled Kubernetes cluster. 

```azurecli
az customlocation create --name <custom-location-name>  --resource-group <resource-group-name> --namespace <name of namespace> --host-resource-id <connectedClusterId> --cluster-extension-ids <extensionId>

## Example
az customlocation create --name my-cluster-custom-location --resource-group my-resource-group --namespace my-cluster-custom-location --host-resource-id /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Kubernetes/connectedClusters/my-cluster --cluster-extension-ids /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Kubernetes/connectedClusters/my-cluster/providers/Microsoft.KubernetesConfiguration/extensions/my-cluster
```



### DCE
The following ARM template creates the [data collection endpoint (DCE)](./data-collection-endpoint-overview.md) required for the edge pipeline to connect to the cloud pipeline. You can use an existing DCE if you already have one in the same region. Replace the properties in the following table before deploying the template.

```azurecli
az monitor data-collection endpoint create -g "myResourceGroup" -l "eastus2euap" --name "myCollectionEndpoint" --public-network-access "Enabled"

## Example
 az monitor data-collection endpoint create --name strato-06-dce --resource-group strato --public-network-access "Enabled"
```



### DCR
The DCR is stored in Azure Monitor and defines how the data will be processed when it's received from the edge pipeline.  The edge pipeline configuration specifies the `immutable ID` of the DCR and the `stream` in the DCR that will process the data. The `immutable ID` is automatically generated when the DCR is created.

Replace the properties in the following template and save them in a json file before running the CLI command to create the DCR. See [Structure of a data collection rule in Azure Monitor](./data-collection-rule-overview.md) for details on the structure of a DCR.

| Parameter | Description |
|:---|:--|
| `name` | Name of the DCR. Must be unique for the subscription. |
| `location` | Location of the DCR. Must match the location of the DCE. |
| `dataCollectionEndpointId` | Resource ID of the DCE. |
| `streamDeclarations` | Schema of the data being received. One stream is required for each dataflow in the pipeline configuration. The name must be unique in the DCR and must begin with *Custom-*. The `column` sections in the samples below should be used for the OLTP and Syslog data flows. If the schema for your destination table is different, then you can modify it using a transformation defined in the `transformKql` parameter. |
| `destinations` | Add additional section to send data to multiple workspaces. |
| - `name` | Name for the destination to reference in the `dataFlows` section. Must be unique for the DCR. |
| - `workspaceResourceId` | Resource ID of the Log Analytics workspace. |
| - `workspaceId` | Workspace ID of the Log Analytics workspace. |
| `dataFlows` | Matches streams and destinations. One entry for each stream/destination combination. |
| - `streams` | One or more streams (defined in `streamDeclarations`). You can include multiple stream if they're being sent to the same destination. |
| - `destinations` | One or more destinations (defined in `destinations`). You can include multiple destinations if they're being sent to the same destination. |
| - `transformKql` | Transformation to apply to the data before sending it to the destination. Use `source` to send the data without any changes. The output of the transformation must match the schema of the destination table. See [Data collection transformations in Azure Monitor](./data-collection-transformations.md) for details on transformations. |
| - `outputStream` | Specifies the destination table in the Log Analytics workspace. The table must already exist in the workspace. For custom tables, prefix the table name with *Custom-*. Built-in tables are not currently supported with edge pipeline. |


```json
{
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
                    "workspaceId": "00000000-0000-0000-0000-000000000000"
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
```

Install the DCR using the following command:

```azurecli
az monitor data-collection rule create --name 'myDCRName' --location <location> --resource-group <resource-group>  --rule-file '<dcr-file-path.json>' 

## Example
az monitor data-collection rule create --name my-pipeline-dcr  --location westus2 --resource-group 'my-resource-group' --rule-file 'C:\MyDCR.json' 

```


### DCR access
The Arc-enabled Kubernetes cluster must have access to the DCR to send data to the cloud pipeline. Use the following command to retrieve the object ID of the System Assigned Identity for your cluster.

```azurecli
az k8s-extension show --name <extension-name> --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --query "identity.principalId" -o tsv 

## Example:
az k8s-extension show --name my-pipeline-extension --cluster-name my-cluster --resource-group my-resource-group --cluster-type connectedClusters --query "identity.principalId" -o tsv 
```

Use the output from this command as input to the following command to give Azure Monitor pipeline the authority to send its telemetry to the DCR.

```azurecli
az role assignment create --assignee "<extension principal ID>" --role "Monitoring Metrics Publisher" --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Insights/dataCollectionRules/<dcr-name>" 

## Example:
az role assignment create --assignee "00000000-0000-0000-0000-000000000000" --role "Monitoring Metrics Publisher" --scope "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Insights/dataCollectionRules/my-dcr" 
```

### Edge pipeline configuration
The edge pipeline configuration defines the details of the edge pipeline instance and deploy the data flows necessary to receive and send telemetry to the cloud.

Replace the properties in the following table before deploying the template.

| Property | Description |
|:---|:--|
| **General** | |
| `name` | Name of the pipeline instance. Must be unique in the subscription. |
| `location` | Location of the pipeline instance. |
| `extendedLocation` |  |
| **Receivers** | One entry for each receiver. Each entry specifies the type of data being received, the port it will listen on, and a unique name that will be used in the `pipelines` section of the configuration. |
| `type` | Type of data received. Current options are `OTLP` and `Syslog`. |
| `name` | Name for the receiver referenced in the `service` section. Must be unique for the pipeline instance. |
| `endpoint` | Address and port the receiver listens on. Use `0.0.0.0` for al addresses. |
| **Processors** | Reserved for future use.|
| **Exporters**  | One entry for each destination. |
| `type` | Only currently supported type is `AzureMonitorWorkspaceLogs`. |
| `name` | Must be unique for the pipeline instance. The name is used in the `pipelines` section of the configuration. |
| `dataCollectionEndpointUrl` |  URL of the DCE where the edge pipeline will send the data. You can locate this in the Azure portal by navigating to the DCE and copying the **Logs Ingestion** value. |
| `dataCollectionRule` | Immutable ID of the DCR that defines the data collection in the cloud pipeline. From the JSON view of your DCR in the Azure portal, copy the value of the **immutable ID** in the **General** section. |
| - `stream` | Name of the stream in your DCR that will accept the data. |
| - `maxStorageUsage` | Capacity of the cache. When 80% of this capacity is reached, the oldest data is pruned to make room for more data.  |
| - `retentionPeriod` | Retention period in minutes. Data is pruned after this amount of time. |
| - `schema` | Schema of the data being sent to the cloud pipeline. This must match the schema defined in the stream in the DCR. The schema used in the example is valid for both Syslog and OTLP. |
| **Service** | One entry for each pipeline instance. Only one instance for each pipeline extension is recommended.  |
| **Pipelines** | One entry for each data flow. Each entry matches a `receiver` with an `exporter`. |
| `name` | Unique name of the pipeline. |
| `receivers` | One or more receivers to listen for data to receive. |
| `processors` | Reserved for future use. |
| `exporters` | One or more exporters to send the data to the cloud pipeline. |
| `persistence` | Name of the persistent volume used for the cache. Remove this parameter if you don't want to enable the cache. |


```json
{
    "type": "Microsoft.monitor/pipelineGroups",
    "location": "eastus",
    "apiVersion": "2023-10-01-preview",
     "name": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.ExtendedLocation/customLocations/my-custom-location",

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
                        "dataCollectionRule": "dcr-00000000000000000000000000000000",
                        "stream": "Custom-OTLP",
                        "cache": {
                            "maxStorageUsage": "10000",
                            "retentionPeriod": "60"
                        },
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
                    ],
                    "type": "logs"
                },
                {
                    "name": "DefaultSyslogs",
                    "receivers": [
                        "receiver-Syslog"
                    ],
                    "processors": [],
                    "exporters": [
                        "exporter-log-analytics-workspace"
                    ],
                    "type": "logs"
                }
            ],
            "persistence": {
                "persistentVolume": "my-persistent-volume"
            }
        },
        "networkingConfigurations": [
            {
                "externalNetworkingMode": "LoadBalancerOnly",
                "routes": [
                    {
                        "receiver": "receiver-OTLP"
                    },
                    {
                        "receiver": "receiver-Syslog"
                    }
                ]
            }
         ]
    }
}
```

Install the template using the following command:

```azurecli
az deployment group create --resource-group <resource-group-name> --template-file <path-to-template>

## Example
az deployment group create --resource-group my-resource-group --template-file C:\MyPipelineConfig.json

```


### [ARM](#tab/arm)

### ARM template sample to configure all components

You can deploy all of the required components for the Azure Monitor edge pipeline using the single ARM template shown below. Edit the parameter file with specific values for your environment. Each section of the template is described below including sections that you must modify before using it. 


| Component | Type | Description |
|:---|:---|:---|
| Log Analytics workspace | `Microsoft.OperationalInsights/workspaces` | Remove this section if you're using an existing Log Analytics workspace. The only parameter required is the workspace name. The immutable ID for the workspace, which is needed for other components, will be automatically created. |
| Data collection endpoint (DCE) | `Microsoft.Insights/dataCollectionEndpoints` | Remove this section if you're using an existing DCE. The only parameter required is the DCE name. The logs ingestion URL for the DCE, which is needed for other components, will be automatically created. |
| Edge pipeline extension | `Microsoft.KubernetesConfiguration/extensions` | The only parameter required is the pipeline extension name. |
| Custom location | `Microsoft.ExtendedLocation/customLocations` | Custom location of the Arc-enabled Kubernetes cluster to create the custom |
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
        "cachePersistentVolume": {
            "type": "string"
        },
        "cacheMaxStorageUsage": {
            "type": "int"
        },
        "cacheRetentionPeriod": {
            "type": "int"
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
                                "cache": {
                                    "maxStorageUsage": "[parameters('cacheMaxStorageUsage')]",
                                    "retentionPeriod": "[parameters('cacheRetentionPeriod')]"
                                },
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
                    ],
                    "persistence": {
                        "persistentVolume": "[parameters('cachePersistentVolume')]"
                    }
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
            "value": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Kubernetes/connectedClusters/my-arc-cluster"
        },
        "clusterExtensionIds": {
            "value": ["/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.KubernetesConfiguration/extensions/my-pipeline-extension"]
        },
        "customLocationName": {
            "value": "my-custom-location"
        },
        "dceName": {
            "value": "my-dce"
        },
        "dcrName": {
            "value": "my-dcr"
        },
        "logAnalyticsWorkspaceName": {
            "value": "my-workspace"
        },
        "pipelineExtensionName": {
            "value": "my-pipeline-extension"
        },
        "pipelineGroupName": {
            "value": "my-pipeline-group"
        },
        "tagsByResource": {
            "value": {}
        }   
    }
}
```

---

## Verify configuration

### Verify pipeline components running in the cluster
In the Azure portal, navigate to the **Kubernetes services** menu and select your Arc-enabled Kubernetes cluster. Select **Services and ingresses** and ensure that you see the following services:

- \<pipeline name\>-external-service 
- \<pipeline name\>-service 

:::image type="content" source="media/edge-pipeline/edge-pipeline-cluster-components.png" lightbox="media/edge-pipeline/edge-pipeline-cluster-components.png" alt-text="Screenshot of cluster components supporting Azure Monitor edge pipeline." ::: 

Click on the entry for **\<pipeline name\>-external-service** and note the IP address and port in the **Endpoints** column. This is the external IP address and port that your clients will send data to.

### Verify heartbeat
Each pipeline configured in your pipeline instance will send a heartbeat record to the `Heartbeat` table in your Log Analytics workspace every minute. The contents of the `OSMajorVersion` column should match the name your pipeline instance. If there are multiple workspaces in the pipeline instance, then the first one configured will be used.

Retrieve the heartbeat records using a log query as in the following example:

:::image type="content" source="media/edge-pipeline/heartbeat-records.png" lightbox="media/edge-pipeline/heartbeat-records.png" alt-text="Screenshot of log query that returns heartbeat records for Azure Monitor edge pipeline." ::: 


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


## Verify data
The final step is to verify that the data is received in the Log Analytics workspace. You can perform this verification by running a query in the Log Analytics workspace to retrieve data from the table.

:::image type="content" source="media/edge-pipeline/log-results-syslog.png" lightbox="media/edge-pipeline/log-results-syslog.png" alt-text="Screenshot of log query that returns of Syslog collection." ::: 

## Next steps

- [Read more about Azure Monitor pipeline](./pipeline-overview.md).
