---
title: Multicloud monitoring with Azure Monitor
description: Guidance and recommendations for using Azure Monitor to monitor resources and applications in other clouds.
ms.topic: conceptual
ms.date: 01/31/2023
ms.reviewer: bwren

---

# Multicloud monitoring with Azure Monitor
In addition to monitoring services and application in Azure, Azure Monitor can provide complete monitoring for your resources and applications running in other clouds including Amazon Web Services (AWS) and Google Cloud Platform (GCP). This article describes features of Azure Monitor that allow you to provide complete monitoring across your AWS and GCP environments.

## Virtual machines
[VM insights](vm/vminsights-overview.md) in Azure Monitor uses [Azure Arc-enabled servers](../azure-arc/servers/overview.md) to provide a consistent experience between both Azure virtual machines and your AWS EC2 or GCP VM instances. You can view your hybrid machines right alongside your Azure machines and onboard them using identical methods. This includes using standard Azure constructs such as Azure Policy and applying tags.

The [Azure Monitor agent](agents/agents-overview.md) installed by VM insights collects telemetry from the client operating system of virtual machines regardless of their location. Use the same [data collection rules](essentials/data-collection-rule-overview.md) that define your data collection across all of the virtual machines across your different cloud environments.

- [Plan and deploy Azure Arc-enabled servers](../azure-arc/servers/plan-at-scale-deployment.md)
- [Manage Azure Monitor Agent](agents/azure-monitor-agent-manage.md)
- [Enable VM insights overview](vm/vminsights-enable-overview.md)

If you use Defender for Cloud for security management and threat detection, then you can use auto provisioning to automate the deployment of the Azure Arc agent to your AWS EC2 and GCP VM instances.

- [Connect your AWS accounts to Microsoft Defender for Cloud](../defender-for-cloud/quickstart-onboard-aws.md)
- [Connect your GCP projects to Microsoft Defender for Cloud](../defender-for-cloud/quickstart-onboard-gcp.md)

## Kubernetes
[Container insights](containers/container-insights-overview.md) in Azure Monitor uses [Azure Arc-enabled Kubernetes](../azure-arc/servers/overview.md) to provide a consistent experience between both [Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md) and Kubernetes clusters in your AWS EKS or GCP GKE instances. You can view your hybrid clusters right alongside your Azure machines and onboard them using identical methods. This includes using standard Azure constructs such as Azure Policy and applying tags.

Use Prometheus [remote write](./essentials/prometheus-remote-write.md) from your on-premises, AWS, or GCP clusters to send data to Azure managed service for Prometheus.

The [Azure Monitor agent](agents/agents-overview.md) installed by Container insights collects telemetry from the client operating system of clusters regardless of their location. Use the same analysis tools on Container insights to monitor clusters across your different cloud environments.

- [Connect an existing Kubernetes cluster to Azure Arc](../azure-arc/kubernetes/quickstart-connect-cluster.md)
- [Azure Monitor Container Insights for Azure Arc-enabled Kubernetes clusters](containers/container-insights-enable-arc-enabled-clusters.md)
- [Monitoring Azure Kubernetes Service (AKS) with Azure Monitor](../aks/monitor-aks.md)

## Applications
Applications hosted outside of Azure must be hard coded to send telemetry to [Azure Monitor Application Insights](app/app-insights-overview.md) using SDKs for [supported languages](app/app-insights-overview.md#supported-languages). Annual code maintenance should be planned to upgrade the SDKs per [Application Insights SDK support guidance](app/sdk-support-guidance.md).

- If you use [Grafana](https://grafana.com/grafana/) for visualization of monitoring data across your different clouds. use the [Azure Monitor data source](https://grafana.com/docs/grafana/latest/datasources/azure-monitor/) to include application log and metric data in your dashboards.
- If you use [Data Dog](https://www.datadoghq.com/), use [Azure integrations](https://www.datadoghq.com/blog/azure-monitoring-enhancements/) to include application log and metric data in your Data Dog UI.


## Audit
In addition to monitoring the health of your cloud resources, you can consolidate auditing data from your AWS and GCP clouds into your Log Analytics workspace so that you can consolidate your analysis and reporting. This is best performed by Azure Sentinel which uses the same workspace as Azure Monitor and provides additional features for collecting and analyzing security and auditing data.

Use the following methods to ingest AWS service log data into Microsoft Sentinel.

- [Microsoft Sentinel connector](../sentinel/connect-aws.md)
- [Azure function](https://github.com/andedevsecops/AWS-CloudTrail-AzFunc)
- [AWS Lambda function](https://github.com/andedevsecops/aws-data-connector-az-sentinel)


Use the following methods to use a plugin to collect events, including pub/sub events, stored in GCP Cloud Storage, and then ingest into Log Analytics.

- [Google Cloud Storage Input Plugin](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-google_cloud_storage.html)
- [GCP Cloud Functions](https://github.com/andedevsecops/azure-sentinel-gcp-data-connector)
- [Google_pubsub input plugin](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-google_pubsub.html#plugins-inputs-google_pubsub)
- [Azure Log Analytics output plugin for Logstash](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/microsoft-logstash-output-azure-loganalytics)


## Custom data sources
Use the following methods to collect data from your cloud resources that doesn't fit into standard collection methods.

- Send custom log data from any REST API client with the [Logs Ingestion API in Azure Monitor](logs/logs-ingestion-api-overview.md)
- Use Logstash to collect data and the [Azure Log Analytics output plugin for Logstash](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/microsoft-logstash-output-azure-loganalytics) to ingest it into a Log Analytics workspace.

## Automation
[Azure Automation](../automation/overview.md) delivers cloud-based automation, operating system updates, and configuration services that support consistent management across your Azure and non-Azure environments. It includes process automation, configuration management, update management, shared capabilities, and heterogeneous features. [Hybrid Runbook Worker](../automation/automation-hybrid-runbook-worker.md) enables automation runbooks to run directly on the non-Azure virtual machines  against resources in the environment to manage those local resources.

Through [Arc-enabled servers](../azure-arc/servers/overview.md), Azure Automation provides a consistent deployment and management experience for your non-Azure machines. It enables integration with the Automation service using the VM extension framework to deploy the Hybrid Runbook Worker role, and simplify onboarding to Update Management and Change Tracking and Inventory.

