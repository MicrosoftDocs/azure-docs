---
title: Multicloud monitoring with Azure Monitor
description: Guidance and recommendations for using Azure Monitor to monitor resources and applications in other clouds.
ms.topic: conceptual
ms.date: 10/18/2021
ms.reviewer: bwren

---

# Multicloud monitoring with Azure Monitor
Most customer environments include in multiple clouds. In addition to Azure, you may have applications and other resources in Amazon Web Services (AWS) and Google Cloud Platform (GCP)

In addition to monitoring services and application in Azure, Azure Monitor can provide complete monitoring for your resources and applications running in other clouds. This article describes features of Azure Monitor that allow you to provide complete monitoring across your AWS and GCP environments.


## Azure Arc
Azure Arc simplifies governance and management by delivering a consistent multi-cloud management platform. 

## Virtual machines
Using [Azure Arc-enabled servers](../azure-arc/servers/overview.md), [VM insights](vm/vminsights-overview.md) in Azure Monitor provides a consistent experience between both Azure virtual machines and your AWS EC2 or GCP VM instances. You can view your hybrid machines right alongside your Azure machines and onboard them using identical methods. This includes using standard Azure constructs such as Azure Policy and applying tags.

- [Overview of Azure Arc-enabled servers](../azure-arc/servers/overview.md)
- [Plan and deploy Azure Arc-enabled servers](../azure-arc/servers/plan-at-scale-deployment.md)

The Azure Monitor agent installed by VM insights collects data from the client operating system of virtual machines regardless of their location. Use the same [data collection rules](essentials/data-collection-rule-overview.md) that define your data collection across all of the virtual machines across your different cloud environments.

- [Azure Monitor Agent overview](agents/agents-overview.md)
- [Manage Azure Monitor Agent](agents/azure-monitor-agent-manage.md)
- [Collect events and performance counters from virtual machines with Azure Monitor Agent](agents/data-collection-rule-azure-monitor-agent.md)



## Kubernetes
Using [Azure Arc-enabled Kubernetes](../azure-arc/servers/overview.md), [Container insights](containers/container-insights-overview.md) in Azure Monitor provides a consistent experience between both [Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md) and Kubernetes clusters in your AWS EC2 or GCP VM instances. You can view your hybrid clusters right alongside your Azure machines and onboard them using identical methods. This includes using standard Azure constructs such as Azure Policy and applying tags.

- [Overview of Azure Arc-enabled Kubernetes?](../azure-arc/kubernetes/overview.md)
- [Connect an existing Kubernetes cluster to Azure Arc](../azure-arc/kubernetes/quickstart-connect-cluster.md)

The Azure Monitor agent installed by Container insights collects data from the client operating system of virtual machines regardless of their location. 

- [Azure Monitor Container Insights for Azure Arc-enabled Kubernetes clusters](containers/container-insights-enable-arc-enabled-clusters.md)
- [Monitoring Azure Kubernetes Service (AKS) with Azure Monitor](../aks/monitor-aks.md)

## Applications
A feature of Azure Monitor, Application Insights is an extensible Application Performance Management (APM) service for developers and DevOps professionals, which provides telemetry insights and information, in order to better understand how applications are performing and to identify areas for optimization.



### Microsoft Defender for Cloud
If you are using Defender for Cloud, you can connect your AWS account and GCP projects, and automate the deployment of the Azure Arc agent to your AWS EC2 and GCP VM instances.

- [Connect your AWS accounts to Microsoft Defender for Cloud](../defender-for-cloud/quickstart-onboard-aws.md)
- [Connect your GCP projects to Microsoft Defender for Cloud](../defender-for-cloud/quickstart-onboard-gcp.md)





## Infrastructure

You can use a plugin to get events stored in GCP Cloud Storage, and then ingest into a Log Analytics workspace.

- [Google Cloud Storage Input Plugin](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-google_cloud_storage.html)
- [Azure Sentinel Data connector for Google Cloud Platform](https://github.com/andedevsecops/azure-sentinel-gcp-data-connector)
- [Azure Log Analytics output plugin for Logstash](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/microsoft-logstash-output-azure-loganalytics)


### Audit
Connect Microsoft Sentinel to Amazon Web Services to ingest AWS service log data.

- [Connect Microsoft Sentinel to Amazon Web Services to ingest AWS service log data](../sentinel/connect-aws.md)
- [Azure native Data connector to ingest AWS CloudTrail Logs](https://github.com/andedevsecops/AWS-CloudTrail-AzFunc)
- [AWS Lambda Function to import CloudTrail Logs to Azure Sentinel](https://github.com/andedevsecops/aws-data-connector-az-sentinel)

You can use a plugin to get pub/sub events stored in GCP Cloud Storage, and then ingest into Log Analytics.

- [Google_pubsub input plugin](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-google_pubsub.html#plugins-inputs-google_pubsub)
- [Azure Log Analytics output plugin for Logstash](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/microsoft-logstash-output-azure-loganalytics)


## Custom data sources

To send custom log data from any REST API client.

- [Logs Ingestion API in Azure Monitor](logs/logs-ingestion-api-overview.md)

Alternatively, use Logstash to collect and the Logstash plugin to ingest data.

- [Azure Log Analytics output plugin for Logstash](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/microsoft-logstash-output-azure-loganalytics)

## Next steps

