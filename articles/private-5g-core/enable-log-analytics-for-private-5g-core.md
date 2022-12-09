---
title: Enable Log Analytics for a packet core instance
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to enable Log Analytics to allow you to monitor and analyze activity for a packet core instance. 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 03/08/2022
ms.custom: template-how-to
---

# Enable Log Analytics for a packet core instance

Log Analytics is a tool in the Azure portal used to edit and run log queries with data in Azure Monitor Logs. You can write queries to retrieve records or visualize data in charts, allowing you to monitor and analyze activity in your private mobile network. In this how-to guide, you'll learn how to enable Log Analytics for a packet core instance.

> [!IMPORTANT] 
> Log Analytics is part of Azure Monitor and is chargeable. [Estimate costs](monitor-private-5g-core-with-log-analytics.md#estimate-costs) provides information on estimating the cost of using Log Analytics to monitor your private mobile network. You shouldn't enable Log Analytics if you don't want to incur any costs. If you don't enable Log Analytics, you can still monitor your packet core instances from the local network using the [packet core dashboards](packet-core-dashboards.md).

## Prerequisites

- Identify the Kubernetes - Azure Arc resource representing the Azure Arc-enabled Kubernetes cluster on which your packet core instance is running.
- Ensure you have [Contributor](../role-based-access-control/built-in-roles.md#contributor) role assignment on the Azure subscription containing the Kubernetes - Azure Arc resource.
- Ensure your local machine has admin kubectl access to the Azure Arc-enabled Kubernetes cluster. This requires an admin kubeconfig file. Contact your trials engineer for instructions on how to obtain this.

## Create an Azure Monitor extension

Follow the steps in [Azure Monitor Container Insights for Azure Arc-enabled Kubernetes clusters](../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md) to create an Azure Monitor extension for the Azure Arc-enabled Kubernetes cluster. Ensure that you use the instructions for the Azure CLI, and that you choose **Option 4 - On Azure Stack Edge** when you carry out [Create extension instance using Azure CLI](../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md?tabs=cli#create-extension-instance).

## Configure and deploy the ConfigMap

In this step, you'll configure and deploy a ConfigMap which will allow Container Insights to collect Prometheus metrics from the Azure Arc-enabled Kubernetes cluster.

1. Copy the following yaml file into a text editor and save it as *99-azure-monitoring-configmap.yml*.

   ```yml
   kind: ConfigMap
   apiVersion: v1
   data:
     schema-version:
       # string.used by agent to parse config. supported versions are {v1}. Configs with other schema versions will be
       # rejected by the agent.
       v1
     config-version:
       # string.used by customer to keep track of this config file's version in their source control/repository (max
       # allowed 10 chars, other chars will be truncated)
       ver1
     log-data-collection-settings: |-
       # Log data collection settings
       # Any errors related to config map settings can be found in the KubeMonAgentEvents table in the Log Analytics
       # workspace that the cluster is sending data to.
   
       [log_collection_settings]
          [log_collection_settings.stdout]
             # In the absense of this configmap, default value for enabled is true
             enabled = false
             # exclude_namespaces setting holds good only if enabled is set to true.
             # kube-system log collection is disabled by default in the absence of 'log_collection_settings.stdout'
             # setting. If you want to enable kube-system, remove it from the following setting.
             # If you want to continue to disable kube-system log collection keep this namespace in the following setting
             # and add any other namespace you want to disable log collection to the array.
             # In the absense of this configmap, default value for exclude_namespaces = ["kube-system"].
             exclude_namespaces = ["kube-system"]
   
          [log_collection_settings.stderr]
             # Default value for enabled is true
             enabled = false
             # exclude_namespaces setting holds good only if enabled is set to true.
             # kube-system log collection is disabled by default in the absence of 'log_collection_settings.stderr'
             # setting. If you want to enable kube-system, remove it from the following setting.
             # If you want to continue to disable kube-system log collection keep this namespace in the following setting
             # and add any other namespace you want to disable log collection to the array.
             # In the absense of this cofigmap, default value for exclude_namespaces = ["kube-system"].
             exclude_namespaces = ["kube-system"]
   
          [log_collection_settings.env_var]
             # In the absense of this configmap, default value for enabled is true
             enabled = false
   
          [log_collection_settings.enrich_container_logs]
             # In the absense of this configmap, default value for enrich_container_logs is false.
             # When this is enabled (enabled = true), every container log entry (both stdout & stderr)
             # will be enriched with container Name & container Image.
             enabled = false
   
          [log_collection_settings.collect_all_kube_events]
             # In the absense of this configmap, default value for collect_all_kube_events is false.
             # When the setting is set to false, only the kube events with !normal event type will be collected.
            # When this is enabled (enabled = true), all kube events including normal events will be collected.
             enabled = false
   
     prometheus-data-collection-settings: |-
       # Custom Prometheus metrics data collection settings
       [prometheus_data_collection_settings.cluster]
           # Cluster level scrape endpoint(s). These metrics will be scraped from agent's Replicaset (singleton)
           # Any errors related to prometheus scraping can be found in the KubeMonAgentEvents table in the Log Analytics
           # workspace that the cluster is sending data to.
   
           # Interval specifying how often to scrape for metrics. This is duration of time and can be specified for
           # supporting settings by combining an integer value and time unit as a string value. Valid time units are ns,
           # us (or µs), ms, s, m, h.
           interval = "1m"
   
           ## Uncomment the following settings with valid string arrays for prometheus scraping
           fieldpass = ["subscribers_count", "amf_registered_subscribers", "amf_registered_subscribers_connected", "amf_connected_gnb", "subgraph_counts", "cppe_bytes_total", "amfcc_mm_initial_registration_failure", "amfcc_n1_auth_failure", "amfcc_n1_auth_reject", "amfn2_n2_pdu_session_resource_setup_request", "amfn2_n2_pdu_session_resource_setup_response", "amfn2_n2_pdu_session_resource_modify_request", "amfn2_n2_pdu_session_resource_modify_response", "amfn2_n2_pdu_session_resource_release_command", "amfn2_n2_pdu_session_resource_release_response", "amfcc_n1_service_reject", "amfn2_n2_pathswitch_request_failure", "amfn2_n2_handover_failure"]
   
           #fielddrop = ["metric_to_drop"]
   
           # An array of urls to scrape metrics from.
           # urls = ["http://myurl:9101/metrics"]
   
           # An array of Kubernetes services to scrape metrics from.
           # kubernetes_services = ["http://my-service-dns.my-namespace:9102/metrics"]
   
           # When monitor_kubernetes_pods = true, replicaset will scrape Kubernetes pods for the following prometheus
           # annotations:
           # - prometheus.io/scrape: Enable scraping for this pod
           # - prometheus.io/scheme: If the metrics endpoint is secured then you will need to
           #     set this to `https` & most likely set the tls config.
           # - prometheus.io/path: If the metrics path is not /metrics, define it with this annotation.
           # - prometheus.io/port: If port is not 9102 use this annotation
           monitor_kubernetes_pods = true
   
           ## Restricts Kubernetes monitoring to namespaces for pods that have annotations set and are scraped using the
           ## monitor_kubernetes_pods setting.
           ## This will take effect when monitor_kubernetes_pods is set to true
           ##   ex: monitor_kubernetes_pods_namespaces = ["default1", "default2", "default3"]
           # monitor_kubernetes_pods_namespaces = ["default1"]
   
       [prometheus_data_collection_settings.node]
           # Node level scrape endpoint(s). These metrics will be scraped from agent's DaemonSet running in every node in
           # the cluster
           # Any errors related to prometheus scraping can be found in the KubeMonAgentEvents table in the Log Analytics
           # workspace that the cluster is sending data to.
   
           # Interval specifying how often to scrape for metrics. This is duration of time and can be specified for
           # supporting settings by combining an integer value and time unit as a string value. Valid time units are ns,
           # us (or µs), ms, s, m, h.
           interval = "1m"
   
           ## Uncomment the following settings with valid string arrays for prometheus scraping
   
           # An array of urls to scrape metrics from. $NODE_IP (all upper case) will substitute of running Node's IP
           # address
           # urls = ["http://$NODE_IP:9103/metrics"]
   
           #fieldpass = ["metric_to_pass1", "metric_to_pass12"]
   
           #fielddrop = ["metric_to_drop"]
   
     metric_collection_settings: |-
       # Metrics collection settings for metrics sent to Log Analytics and MDM
       [metric_collection_settings.collect_kube_system_pv_metrics]
         # In the absense of this configmap, default value for collect_kube_system_pv_metrics is false
         # When the setting is set to false, only the persistent volume metrics outside the kube-system namespace will be
         # collected
         enabled = false
         # When this is enabled (enabled = true), persistent volume metrics including those in the kube-system namespace
         # will be collected
   
     alertable-metrics-configuration-settings: |-
       # Alertable metrics configuration settings for container resource utilization
       [alertable_metrics_configuration_settings.container_resource_utilization_thresholds]
           # The threshold(Type Float) will be rounded off to 2 decimal points
           # Threshold for container cpu, metric will be sent only when cpu utilization exceeds or becomes equal to the
           # following percentage
           container_cpu_threshold_percentage = 95.0
           # Threshold for container memoryRss, metric will be sent only when memory rss exceeds or becomes equal to the
           # following percentage
           container_memory_rss_threshold_percentage = 95.0
           # Threshold for container memoryWorkingSet, metric will be sent only when memory working set exceeds or becomes
           # equal to the following percentage
           container_memory_working_set_threshold_percentage = 95.0
   
       # Alertable metrics configuration settings for persistent volume utilization
       [alertable_metrics_configuration_settings.pv_utilization_thresholds]
           # Threshold for persistent volume usage bytes, metric will be sent only when persistent volume utilization
           # exceeds or becomes equal to the following percentage
           pv_usage_threshold_percentage = 60.0
     integrations: |-
       [integrations.azure_network_policy_manager]
           collect_basic_metrics = false
           collect_advanced_metrics = false
   metadata:
     name: container-azm-ms-agentconfig
     namespace: kube-system
   ```
1. In a command line with kubectl access to the Azure Arc-enabled Kubernetes cluster, navigate to the folder containing the *99-azure-monitoring-configmap.yml* file and run the following command. 
    
    `kubectl apply -f 99-azure-monitoring-configmap.yml`

   The command will return quickly with a message that's similar to the following: `configmap "container-azm-ms-agentconfig" created`. However, the configuration change can take a few minutes to finish before taking effect, and all omsagent pods in the cluster will restart. The restart is a rolling restart for all omsagent pods, not all restart at the same time.

## Run a query

In this step, you'll run a query in the Log Analytics workspace to confirm that you can retrieve logs for the packet core instance.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the Log Analytics workspace you used when creating the Azure Monitor extension in [Create an Azure Monitor extension](#create-an-azure-monitor-extension).
1. Select **Logs** from the resource menu.
   :::image type="content" source="media/log-analytics-workspace.png" alt-text="Screenshot of the Azure portal showing a Log Analytics workspace resource. The Logs option is highlighted.":::
1. If it appears, select **X** to dismiss the **Queries** window.
1. Select **Select scope**.

   :::image type="content" source="media/enable-log-analytics-for-private-5g-core/select-scope.png" alt-text="Screenshot of the Log Analytics interface. The Select scope option is highlighted.":::

1. Under **Select a scope**, deselect the Log Analytics workspace. 
1. Search for and select the **Kubernetes - Azure Arc** resource representing the Azure Arc-enabled Kubernetes cluster.
1. Select **Apply**.

   :::image type="content" source="media/enable-log-analytics-for-private-5g-core/select-kubernetes-cluster-scope.png" alt-text="Screenshot of the Azure portal showing the Select a scope screen. The search bar, Kubernetes - Azure Arc resource and Apply option are highlighted.":::

1. Copy and paste the following query into the query window, and then select **Run**.

   ```kusto
   InsightsMetrics
      | where Namespace == "prometheus"
      | where Name == "amf_connected_gnb"
      | extend Time=TimeGenerated
      | extend GnBs=Val
      | project GnBs, Time
   ```

   :::image type="content" source="media/enable-log-analytics-for-private-5g-core/run-query.png" alt-text="Screenshot of the Log Analytics interface. The Run option is highlighted." lightbox="media/enable-log-analytics-for-private-5g-core/run-query.png":::

1. Verify that the results window displays the results of the query, showing how many gNodeBs have been connected to the packet core instance in the last 24 hours.

   :::image type="content" source="media/enable-log-analytics-for-private-5g-core/query-results.png" alt-text="Screenshot of the results window displaying results from a query.":::

## Next steps

- [Learn more about monitoring Azure Private 5G Core using Log Analytics](monitor-private-5g-core-with-log-analytics.md)
- [Create an overview Log Analytics dashboard using an ARM template](create-overview-dashboard.md)
- [Learn more about Log Analytics in Azure Monitor](../azure-monitor/logs/log-analytics-overview.md)
