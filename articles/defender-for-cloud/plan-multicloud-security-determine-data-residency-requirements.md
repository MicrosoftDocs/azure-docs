---
title: Planning multicloud security determine data residency requirements GDPR agent considerations guidance
description: Learn about determining data residency requirements when planning multicloud deployment with Microsoft Defender for Cloud.
ms.topic: how-to
author: dcurwin
ms.author: dacurwin
ms.custom: ignite-2022
ms.date: 10/03/2022
---

# Determine data residency requirements

This article is one of a series providing guidance as you design a cloud security posture management (CSPM) and cloud workload protection (CWP) solution across multicloud resources with Microsoft Defender for Cloud.

## Goal

Identify data residency constraints as you plan your multicloud deployment.

## Get started

When designing business solutions, data residency (the physical or geographic location of an organization’s data) is often top of mind due to compliance requirements. For example, the European Union’s General Data Protection Regulation (GDPR) requires all data collected on citizens to be stored in the EU, for it to be subject to European privacy laws.

- As you plan, consider these points around data residency:
- When you create connectors to protect multicloud resources, the connector resource is hosted in an Azure resource group that you choose when you set up the connector. Select this resource group in accordance with your data residency requirements.  
When data is retrieved from AWS/GCP, it’s stored in either GDPR-EU, or US:

  - Defender for Cloud looks at the region in which the data is stored in the AWS/GCP cloud and matches that.
  - Anything in the EU is stored in the EU region. Anything else is stored in the US region.

## Agent considerations

There are data considerations around agents and extensions used by Defender for Cloud.

- **CSPM:** CSPM functionality in Defender for Cloud is agentless. No agents are needed for CSPM to work.
- **CWP:** Some workload protection functionality for Defender for Cloud requires the use of agents to collect data.

## Defender for Servers plan

Agents are used in the Defender for Servers plan as follows:

- Non-Azure public clouds connect to Azure by leveraging the [Azure Arc](../azure-arc/servers/overview.md) service.
- The [Azure Connected Machine agent](../azure-arc/servers/agent-overview.md) is installed on multicloud machines that onboard as Azure Arc machines. Defender for Cloud should be enabled in the subscription in which the Azure Arc machines are located.
- Defender for Cloud leverages the Connected Machine agent to install extensions (such as Microsoft Defender for Endpoint) that are needed for [Defender for Servers](./defender-for-servers-introduction.md) functionality.
- [Log analytics agent/Azure Monitor Agent (AMA)](../azure-monitor/agents/agents-overview.md) is needed for some [Defender for Service Plan 2](./defender-for-servers-introduction.md) functionality.
  - The agents can be provisioned automatically by Defender for Cloud.
  - When you enable auto-provisioning, you specify where to store collected data. Either in the default Log Analytics workspace created by Defender for Cloud, or in any other workspace in your subscription. [Learn more](/azure/defender-for-cloud/enable-data-collection?tabs=autoprovision-feature).
  - If you select to continuously export data, you can drill into and configure the types of events and alerts that are saved. [Learn more](./continuous-export.md?tabs=azure-portal).
- Log Analytics workspace:
  - You define the Log Analytics workspace you use at the subscription level. It can be either a default workspace, or a custom-created workspace.
  - There are [several reasons](../azure-monitor/logs/workspace-design.md) to select the default workspace rather than the custom workspace.
  - The location of the default workspace depends on your Azure Arc machine region. [Learn more](/azure/defender-for-cloud/faq-data-collection-agents#where-is-the-default-log-analytics-workspace-created-).
  - The location of the custom-created workspace is set by your organization. [Learn more](/azure/defender-for-cloud/faq-data-collection-agents#how-can-i-use-my-existing-log-analytics-workspace-) about using a custom workspace.

## Defender for Containers plan

[Defender for Containers](./defender-for-containers-introduction.md) protects your multicloud container deployments running in:

- **Azure Kubernetes Service (AKS)** - Microsoft's managed service for developing, deploying, and managing containerized applications.
- **Amazon Elastic Kubernetes Service (EKS) in a connected AWS account** - Amazon's managed service for running Kubernetes on AWS without needing to install, operate, and maintain your own Kubernetes control plane or nodes.
- **Google Kubernetes Engine (GKE) in a connected GCP project** - Google’s managed environment for deploying, managing, and scaling applications using GCP infrastructure.
- **Other Kubernetes distributions** - using [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md), which allows you to attach and configure Kubernetes clusters running anywhere, including other public clouds and on-premises.

Defender for Containers has both agent-based and agentless components.

- **Agentless collection of Kubernetes audit log data**:  [Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) or GCP Cloud Logging enables and collects audit log data, and sends the collected information to Defender for Cloud for further analysis. Data storage is based on the EKS cluster AWS region, in accordance with GDPR - EU and US.
- **Agent-based Azure Arc-enabled Kubernetes**: Connects your EKS and GKE clusters to Azure using [Azure Arc agents](../azure-arc/kubernetes/conceptual-agent-overview.md), so that they’re treated as Azure Arc resources.
- **[Defender agent](defender-for-cloud-glossary.md#defender-agent)**: A DaemonSet that collects signals from hosts using eBPF technology, and provides runtime protection. The extension is registered with a Log Analytics workspace and used as a data pipeline. The audit log data isn't stored in the Log Analytics workspace.
- **Azure Policy for Kubernetes**: configuration information is collected by Azure Policy for Kubernetes.
  - Azure Policy for Kubernetes extends the open-source Gatekeeper v3 admission controller webhook for Open Policy Agent.
  - The extension registers as a web hook to Kubernetes admission control and makes it possible to apply at-scale enforcement, safeguarding your clusters in a centralized, consistent manner.

## Defender for Databases plan

For the [Defender for Databases plan](./quickstart-enable-database-protections.md) in a multicloud scenario, you leverage Azure Arc to manage the multicloud SQL Server databases. The SQL Server instance is installed in a virtual or physical machine connected to Azure Arc.

- The [Azure Connected Machine agent](../azure-arc/servers/agent-overview.md) is installed on machines connected to Azure Arc.
- The Defender for Databases plan should be enabled in the subscription in which the Azure Arc machines are located.
- The Log Analytics agent for Microsoft Defender SQL Servers should be provisioned on the Azure Arc machines. It collects security-related configuration settings and event logs from machines.
- Automatic SQL server discovery and registration needs to be set to On to allow SQL database discovery on the machines.

When it comes to the actual AWS and GCP resources that are protected by Defender for Cloud, their location is set directly from the AWS and GCP clouds.

## Next steps

In this article, you have learned how to determine your data residency requirements when designing a multicloud security solution. Continue with the next step to [determine compliance requirements](plan-multicloud-security-determine-compliance-requirements.md).
