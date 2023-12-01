---
title: Overview of Azure Monitor pipeline for edge and multicloud
description: Overview of Azure Monitor pipeline for edge and multicloud
ms.topic: conceptual
ms.date: 11/14/2023
ms.author: bwren
author: bwren
---

# Overview of Azure Monitor pipeline for edge and multicloud

Azure Monitor pipeline for edge and multicloud is an Azure Monitor component that enables at-scale collection, transformation, and routing of telemetry data at the edge and to the cloud. It leverages OpenTelemetry Collector as a foundation that enables an extensibility model to support collection from a wide range of data sources.

Azure Monitor Pipeline will be deployed on an Arc-enabled K8s cluster in the customers’ environment.  


## Prerequisites

- Arc-enabled Kubernetes cluster with an external IP address.
    - You can use Azure Kubernetes Service (AKS) if you don’t already have a cluster.
- Workload generating OTLP or Syslog data.
- Log Analytics workspace
- Azure CLI
•	Azure resource provider
- For Azure Arc-enabled Kubernetes, the following Azure resource providers must be registered in your subscription:
    - Microsoft.Kubernetes
    - Microsoft.KubernetesConfiguration
    - Microsoft.ExtendedLocation
- To use Azure Monitor, the following Azure resource providers must be registered in your subscription:
    - Microsoft.Insights
    - Microsoft.Monitor


## Onboarding

## Create Data Collection Endpoint (DCE)
Create a Data Collection Endpoint if you don't already have one in the same region as your Kubrenetes cluster.  See [Create a data collection endpoint](./data-collection-endpoint-overview.md#create-a-data-collection-endpoint)

## Create tables in Log Analytics workspace


## Pipeline installation

The following three components must be installed and configured for the Azure Monitor Pipeline.

- Azure Monitor Pipeline Controller Arc Extension
- Entitle installed Arc Extension to send telemetry to your Log Analytics Workspace via DCR
- mDeploy the Azure Monitor Pipeline Configuration to the cluster.

## Deploy the Azure Monitor Pipeline Arc Extension
From Azure CLI, run the following command to install the Azure Monitor Pipeline Controller into the specified cluster in the specified namespace without automatic upgrades.

```azurecli
az k8s-extension create --name <name> --extension-type microsoft.monitor.pipelinecontroller --scope cluster --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --release-train preview --release-namespace <release-namespace> --version 0.1.1-23318.7-privatepreview --debug --auto-upgrade false
```

Replace the following parameters with the appropriate values:

| Parameter | Description |
|:---|:--|
| `name` | Name of the extension in your cluster. Limited to 10 characters or less. |
| `cluster-name` | Name of the Arc-connected Kubernetes cluster resource. |
| `resource-group` | Name of the resource group. |
| `release-namespace` | Namespace to install the extension. |


## Give the Arc extension access to your DCR
A system identity is created when you deploy the extension. This identity is used when the pipeline connects to Azure Monitor.

Run the following command to get the object id of the System Assigned Identity:

```azurecli
az k8s-extension show --name <name> --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --query "identity.principalId" -o tsv
```

Use the output from this command as input to this next command to entitle Azure Monitor Pipeline to send its telemetry to the DCR created in the section above.


az role assignment create --assignee "<extension principal ID>" --role "Monitoring Metrics Publisher" --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Insights/dataCollectionRules/<dcr-name>"

| Parameter | Description |
|:---|:--|
| `extension principal ID` | Guid returned from the previous command. |
| `scope`  | Resource ID of the DCR. |

Verify access to the DCR from the Access Control (IAM) option for the DCR in the Azure portal. The identity should be listed as a Monitoring Metrics Publisher.

\[Placeholder for image\]

## Deploy the Azure Monitor Pipeline Configuration to the cluster

The configuration file defines how the Azure Monitor Pipeline Controller will configure your cluster and deploy the pipelines necessary to receive and send telemetry to the cloud. 

| Parameter | Description |
|:---|:--|
| `namespace` | Namespace provided during deployment of the Arc extension. |
| `dcr_endpoint` | Endpoint of your DCE. You can locate this in the Azure portal by navigating to the DCE and copying the Logs Ingestion value.<br>Example: https://example-dce-82qc.eastus-1.ingest.monitor.azure.com |
| `stream_name` | Name of the stream in your DCR. From the JSON view of your DCR, copy the value of the stream name in the **Data sources** section.<br>Example: Custom-TestData_CL |
| `dcr` | Immutable ID of the DCR. From the JSON view of your DCR, copy the value of the immutable ID in the **General** section.<br>Example: dcr-00000000-0000-0000-0000-000000000000. |

Once the yaml file has been updated, you deploy it to the cluster with the following command:

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

You can also query the 
