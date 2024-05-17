---
title: Planning multicloud security determine data residency requirements GDPR agent considerations guidance
description: Learn about determining data residency requirements when planning multicloud deployment with Microsoft Defender for Cloud.
ms.topic: how-to
author: dcurwin
ms.author: dacurwin
ms.date: 10/03/2022
---

# Determine plan and agents requirements

This article is one of a series providing guidance as you design a cloud security posture management (CSPM) and cloud workload protection (CWP) solution across multicloud resources with Microsoft Defender for Cloud.

## Goal

Identify what plans to enable and requirements for each plan.

## Get started

When protecting assets across cloud, you need to identify what plans to enable for your desired protection, as well as installing agent components if and as needed by each plan.

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
  - When you enable auto-provisioning, you specify where to store collected data. Either in the default Log Analytics workspace created by Defender for Cloud, or in any other workspace in your subscription. [Learn more](enable-data-collection.md?tabs=autoprovision-feature).
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

Defender for Containers has both sensor-based and agentless components.

- **Agentless collection of Kubernetes audit log data**:  [Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) or GCP Cloud Logging enables and collects audit log data, and sends the collected information to Defender for Cloud for further analysis. Data storage is based on the EKS cluster AWS region, in accordance with GDPR - EU and US.
- **Agentless collection for Kubernetes inventory**: Collect data on your Kubernetes clusters and their resources, such as: Namespaces, Deployments, Pods, and Ingresses.
- **Sensor-based Azure Arc-enabled Kubernetes**: Connects your EKS and GKE clusters to Azure using [Azure Arc agents](../azure-arc/kubernetes/conceptual-agent-overview.md), so that they’re treated as Azure Arc resources.
- **[Defender sensor](defender-for-cloud-glossary.md#defender-sensor)**: A DaemonSet that collects signals from hosts using eBPF technology, and provides runtime protection. The extension is registered with a Log Analytics workspace and used as a data pipeline. The audit log data isn't stored in the Log Analytics workspace.
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
