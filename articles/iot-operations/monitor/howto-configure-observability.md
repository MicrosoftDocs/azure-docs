---
title: Configure observability
titleSuffix: Azure IoT Operations
description: Configure observability features in Azure IoT Operations to monitor the health of your solution.
author: timlt
ms.author: timlt
ms.topic: how-to
ms.date: 02/04/2024

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data
# on the health of my industrial assets and edge environment.
---

# Configure observability

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Observability provides visibility into every layer of your Azure IoT Operations Preview configuration. It gives you insight into the actual behavior of issues, which increases the effectiveness of site reliability engineering. Azure IoT Operations offers observability through custom curated Grafana dashboards that are hosted in Azure. These dashboards are powered by Azure Monitor managed service for Prometheus and by Container Insights. This article shows you how to configure the services you need for observability of your solution. 

## Prerequisites

- Azure IoT Operations Preview installed. For more information, see [Quickstart: Deploy Azure IoT Operations – to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md).

## Configure your cluster

1. Run the following code to register providers with the subscription where your
   cluster is located:

   ```azurecli
   az account set -s <subscription-id>
   az provider register -n "Microsoft.Kubernetes"
   az provider register -n "Microsoft.Insights"
   az provider register -n "Microsoft.AlertsManagement"
   ```

1. Set up the scrape configuration. You can run this command directly from your Arc-enabled Kubernetes cluster or from another machine.

   > [!NOTE]
   > If you plan to run the command in this step from another machine, run the following 
   > command first to connect to your Arc-enabled kubernetes cluster:
   >
   > ```azurecli
   > az connectedk8s proxy -n <cluster-name> \
   >                       -g <cluster-resource-group> \
   >                       --subscription <cluster-subscription>
   > ```
   >
   > After you run the following command from a remote machine, you 
   > might get an access denied error. If so, make sure that you have 
   > permissions to perform the correct operations on the cluster. To
   > give yourself full permissions, run the following command from your 
   > Arc-enabled Kubernetes cluster:
   >
   > ```bash  
   > kubectl create clusterrolebinding <your-username>-admin --clusterrole cluster-admin --user=<your-email>
   > ```

   ```bash
   kubectl apply -f ama-metrics-prometheus-config.yaml --context <cluster-context>
   ```

   If your cluster's context is the default, run the following command instead of the previous one: 

   ```bash
   kubectl apply -f ama-metrics-prometheus-config.yaml
   ```

## Deploy Resources

Azure IoT Operations uses the two types of observability resources: 

- Shared observability resources for monitoring multiple clusters
- Cluster-specific resources created for each cluster that you want to monitor

You can create observability resources in a single deployment or in separate deployments, depending on how you want to organize your resources. 

The following deployment types are available:
- [All-in-one Deployment](#all-in-one-deployment). Creates all resources needed to monitor a cluster from scratch. Useful if you're getting started and want to set up a single cluster with a new set of observability resources. 
- [Shared Resource Deployment](#shared-resource-deployment). Creates only the shared observability resources. Useful for setting up shared resources independently from connecting clusters to those resources.
- [Cluster Resource Deployment](#cluster-resource-deployment). Connects a cluster to an existing set of shared observability resources created in one of the other deployment types. Useful for adding more clusters to a single set of shared resources. 

### All-in-one Deployment

The all-in-one deployment sets up shared monitoring resources (that is, Azure Managed Grafana, Azure Monitor, Azure Log Analytics) and connects the specified cluster to those resources.

To deploy, run the following command. Use the subscription ID and resource group of the pre-existing Arc-enabled cluster that you want to monitor.

> [!NOTE]
> Additional parameters may be specified by reading through the [bicep file](./observability-full.bicep). The optional parameters can specify things like alternative locations for cluster resources.

```azurecli
az deployment group create \
      --subscription <subscription-id> \
      --resource-group <cluster-resource-group> \
      --template-file observability-full.bicep \
      --parameters grafanaAdminId=$(az ad user show --id $(az account show --query user.name --output tsv) --query=id --output tsv) \
                   clusterName=<cluster-name> \
                   sharedResourceGroup=<shared-resource-group> \
                   sharedResourceLocation=<shared-resource-location> \
      --query=properties.outputs
```

The previous command grants admin access for the newly created Grafana instance to the user who runs it. If that access isn't what you want, run the following command instead. You need to set up permissions manually before anyone can access the Grafana instance. 

```azurecli
az deployment group create \
    --subscription <subscription-id> \
    --resource-group <cluster-resource-group> \
    --template-file observability-full.bicep \
    --parameters clusterName=<cluster-name> \
                 sharedResourceGroup=<shared-resource-group> \
                 sharedResourceLocation=<shared-resource-location> \
    --query=properties.outputs
```

To set up permissions manually, [add a role assignment](https://learn.microsoft.com/en-us/azure/managed-grafana/how-to-share-grafana-workspace?tabs=azure-portal#add-a-grafana-role-assignment) to the Grafana instance for any users who should have access. Assign one of the Grafana roles (Grafana Admin, Grafana Editor, Grafana Viewer) depending on the level of access desired.

If the deployment succeeds, a few pieces of information are printed at the end of the command output. The information includes the Grafana URL and the resource IDs for both the Log Analytics and Azure Monitor resources that were created. The Grafana URL allows you to navigate to the Grafana instance that you configure in [Step 3](#step-3-access-grafana-dashboards). You need the other two pieces of information if you want to set up more clusters by using [Cluster Resource Deployment](#cluster-resource-deployment).

### Shared Resource Deployment

This deployment sets up the shared monitoring resources (that is, Azure Managed Grafana, Azure Monitor, Azure Log Analytics), but doesn't connect it to any clusters. After you run this deployment, use the [Cluster Resource Deployment](#cluster-resource-deployment) to set up monitoring that uses the shared resources.

To deploy, run the following command. Use the subscription ID and resource group where you want the observability resources to exist.  The resource group must already exist. You only need to run this command once per monitoring environment that you would like to use:

> [!NOTE] 
> You can specify additional parameters by reading through the [bicep file](./observability.bicep). The optional parameters specify things like alternative locations for shared resources.

```azurecli
az deployment group create \
      --subscription <subscription-id> \
      --resource-group <resource-group> \
      --template-file observability.bicep \
      --parameters grafanaAdminId=$(az ad user show --id $(az account show --query user.name --output tsv) --query=id --output tsv) \
      --query=properties.outputs
```

The previous command grants admin access for the newly created Grafana instance to the user who runs it. You might need to run the command from a managed machine, depending on how your tenant is configured. If you don't have a managed machine or you don't want to add yourself as a Grafana admin, run the following command instead. You need to set up permissions manually before anyone can access the Grafana instance. 

```azurecli
az deployment group create \
    --subscription <subscription-id> \
    --resource-group <resource-group> \
    --template-file observability.bicep \
    --query=properties.outputs
```

To set up permissions manually, [add a role assignment](https://learn.microsoft.com/en-us/azure/managed-grafana/how-to-share-grafana-workspace?tabs=azure-portal#add-a-grafana-role-assignment) to the Grafana instance for any users who should have access. Assign one of the Grafana roles (Grafana Admin, Grafana Editor, Grafana Viewer) depending on the level of access desired.

If the deployment succeeds, a few pieces of information are printed at the end of the command output. This information includes the Grafana URL and the resource IDs for both the Log Analytics and Azure Monitor resources that were created. The Grafana URL allows you to navigate to the Grafana instance that you configure in [Step 3](#step-3-access-grafana-dashboards). You need the other two pieces of information if you want to set up more clusters by using [Cluster Resource Deployment](#cluster-resource-deployment).

### Cluster Resource Deployment

This deployment configures observability for our individual cluster. The deployment enables telemetry to be sent to the shared resources deployed either in an [All-in-one Deployment](#all-in-one-deployment) or in a [Shared Resource Deployment](#shared-resource-deployment).

To deploy, run the following command. Use the resource IDs that were output from the previous deployment for the relevant parameters:

```azurecli
az deployment group create \
      --subscription <cluster-subscription-id> \
      --resource-group <cluster-resource-group> \
      --template-file cluster.bicep \
      --parameters clusterName=<cluster-name> \
                  azureMonitorId=<azure-monitor-resource-id> \
                  logAnalyticsId=<log-analytics-resource-id>
```

If your Azure Monitor or Log Analytics are in a different region from your cluster, the previous command produces an error. To resolve the error, pass the extra `azureMonitorLocation` and `logAnalyticsLocation` parameters:

```azurecli
az deployment group create \
      --subscription <cluster-subscription-id> \
      --resource-group <cluster-resource-group> \
      --template-file cluster.bicep \
      --parameters clusterName=<cluster-name> \
                  azureMonitorId=<azure-monitor-resource-id> \
                  logAnalyticsId=<log-analytics-resource-id> \
                  azureMonitorLocation=<azure-monitor-location> \
                  logAnalyticsLocation=<log-analytics-location>
```

## Access Grafana Dashboards

Navigate to the endpoint for the Grafana instance that you created previously by using the URL from the deployment outputs. If you didn't already do so, create the relevant dashboards by going to the [dashboard list](../../samples/grafana-dashboards).
For each dashboard in the list that you want, use the add (+) button in the upper right of the Grafana UI to import it into the Grafana workspace. 

## Cleanup

To uninstall the resources created by these scripts, navigate to the resource group where you installed the shared resources and delete the following resources:

- Azure Monitor Workspace
- Azure Managed Grafana
- Log Analytics Workspace
- Container Insights Solution

For a resource group with a single cluster connected, the following screenshot shows what the list of resources looks like:

:::image type="content" source="media/howto-configure-observability/shared-resource-delete.png" alt-text="Screenshot that lists shared resources."  lightbox="media/howto-configure-observability/shared-resource-delete-expanded.png":::

Next, navigate to the resource group where your cluster is located (if different from the resource group for the previous resources). Find the data collection endpoint, the two data collection rules (one ending with "logsDataCollectionRule" and the other ending with "metricsDataCollectionRule") and recording rule groups (ending in "KubernetesRecordingRuleGroup" and
"NodeRecordingRuleGroup"). Delete these five resources to complete the cleanup without removing the cluster itself.

> [!NOTE]  
> You might need to run the delete more than once for all resources to be successfully deleted. 

For a typical cluster resource group, the following screenshot shows what the list of resources looks like.  The resources to delete are selected. 

:::image type="content" source="media/howto-configure-observability/cluster-resource-delete.png" alt-text="Screenshot that lists shared resources to delete."  lightbox="media/howto-configure-observability/cluster-resource-delete-expanded.png":::

Finally, you can remove the configuration that was installed on your cluster. To do that, run the following command from your cluster:

```bash
kubectl delete -f ama-metrics-prometheus-config.yaml --context <cluster-context>
```

If your cluster's context is the default, run the following command instead of the previous one: 

```bash
kubectl delete -f ama-metrics-prometheus-config.yaml
```


## Related content

- [Azure Monitor overview](../../azure-monitor/overview.md)
