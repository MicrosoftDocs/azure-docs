---
title: Lifecycle management of Azure VMware Solution VMs
description: Learn to manage all aspects of the lifecycle of your Azure VMware Solution (AVS) VMs with Microsoft Azure native tools.
ms.topic: conceptual
ms.date: 09/11/2020
---

# Lifecycle management of Azure VMware Solution VMs

Microsoft Azure native tools can be used to not only monitor virtual machines (VMs) in the Azure environment, but also your VMs on Azure VMware Solution, as well as your on-premises VMs. In this overview, we'll take a high-level look at the integrated monitoring architecture Azure offers, and how you can leverage its native tools to manage your Azure VMware Solution virtual machines (VMs) throughout their lifecycle.

## Benefits

- Azure native services can be used to manage your VMs in a hybrid environment (Azure, Azure VMware Solution, and on-premises).
- Integrated monitoring and visibility of your Azure, Azure VMware Solution, and on-premises VMs.
- With Azure Update Management in Azure Automation, you can manage operating system updates for both your Windows and Linux machines. 
- Azure Security Center provides advanced threat protection with features like file integrity monitoring, fileless security alerts, missing operating system patch assessment, security misconfigurations assessment, and endpoint protection assessment. 
- Easily deploy the Microsoft Monitoring Agent (MMA) using Azure ARC for new VMs. 
- Your Log Analytics workspace in Azure Monitor enables log collection and performance counter collection using MMA or extensions. Collect data and logs to a single point and present that data to different Azure native services. 
- Added benefits of Azure Monitor include: 
    - Seamless monitoring 
    - Better infrastructure visibility 
    - Instant notifications 
    - Automatic resolution 
    - Cost efficiency 

## Integrated Azure monitoring architecture

The following diagram shows the integrated monitoring architecture for Azure VMware Solution VMs.

![Integrated Azure monitoring architecture](media/lifecycle-mgmt-avs-vms/integrated-asure-monitoring-architecture.png)

## Integrating and deploying Azure native services

**Azure ARC** extends Azure management to any infrastructure, including Azure VMware Solution, on-premises, or other cloud platforms. Azure ARC can be deployed by installing an Azure Kubernetes Service (AKS) cluster in the Azure VMware Solution environment. For more information, see [Connect an Azure Arc-enabled Kubernetes cluster](../azure-arc/kubernetes/connect-cluster.md).

Azure VMware Solution VMs can be monitored through Microsoft Monitoring Agent (MMA). (Microsoft Monitoring Agent (MMA) is also referred to as Log Analytics agent or OMS Linux agent.) MMA can be installed automatically when VMs are provisioned through ARC VM lifecycle workflows. MMA can also be installed when deploying VMs from a template in vCenter; again, with VMs provisioned through ARC workflows. This enables all provisioned Azure VMware Solution VMs to have MMA installed and send logs to the Azure Log Analytics workspace. For more information, see [Log Analytics agent overview](../azure-monitor/platform/log-analytics-agent.md).

**Log Analytics workspace** enables log collection and performance counter collection using MMA or extensions. See [Create a Log Analytics workspace in the Azure portal](../azure-monitor/learn/quick-create-workspace.md) for more information on how to create your Log Analytics workspace.
- To add Windows VMs to your log analytics workspace, see [Install Log Analytics agent on Windows computers](../azure-monitor/platform/agent-windows.md).
- To add Linux VMs to your log analytics workspace, see [Install Log Analytics agent on Linux computers](../azure-monitor/platform/agent-linux.md).

**Azure Update Management** in Azure Automation manages operating system updates for your Windows and Linux machines in Azure, Azure VMware Solution, on-premises, and other cloud environments. It monitors patching compliance and forward patching deviation alerts to Azure Monitor for remediation. Azure Update Management must connect to the Log Analytics workspace and use stored data to assess the status of updates on VMs in Azure, Azure VMware Solution, and on-premises.
- To add Log Analytics to Azure Update Management, you first need to [create an Azure Automation account](../automation/automation-create-standalone-account.md).
- To link your Log Analytics workspace with your automation account, see [Log Analytics workspace and Automation account](../azure-monitor/insights/solutions.md#log-analytics-workspace-and-automation-account).
- To enable Azure Update Management for your VMs, see [Enable Update Management from an Automation account](../automation/update-management/update-mgmt-enable-automation-account.md).
- Once you've added VMs to Azure Update Management, you can [Deploy updates on VMs and review results](../automation/update-management/update-mgmt-deploy-updates.md). 

**Azure Security Center** is a unified infrastructure security management system that strengthens the security posture of your data centers, and provides advanced threat protection across your hybrid workloads in the cloud as well as on premises. It will assess the vulnerability of Azure VMware Solution VMs and raise alerts as needed. These security alerts can be forwarded to Azure Monitor for resolution.
- Azure Security Center is a pre-configured tool and does not require any deployment. For more information, see a list of [Supported features for virtual machines](../security-center/security-center-services.md).
- To add Azure VMware Solution VMs and non-Azure VMs to Azure Security Center, see [Onboard Windows computers to Azure Security Center](../security-center/quick-onboard-windows-computer.md) and [Onboard Linux computers to Azure Security Center](../security-center/quick-onboard-linux-computer.md).
- After adding VMs, Azure Security Center analyzes the security state of the resources to identify potential vulnerabilities. It also provides recommendations in the Overview tab. For more information, see [Security recommendations in Azure Security Center](../security-center/security-center-recommendations.md).
- You can define security policies in Azure Security Center. For information on configuring your security policies, see [Working with security policies](../security-center/tutorial-security-policy.md).

**Azure Monitor** maximizes the availability and performance of your applications and services by delivering a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments. It is a pre-configured tool, and requires no deployment.
- Azure Monitor allows you to collect data from different sources to monitor and analyse. For more information, see [Sources of monitoring data for Azure Monitor](../azure-monitor/platform/data-sources.md).
- You can also collect different types of data for analysis, visualization, and alerting. For more information, see [Azure Monitor data platform](../azure-monitor/platform/data-platform.md).
- To configure Azure Monitor with your Log Analytics workspace, see [Configure Log Analytics workspace for Azure Monitor for VMs](../azure-monitor/insights/vminsights-configure-workspace.md).
- After collecting data from various sources, you can create alert rules to identify issues in your environment; for instance, high utilization of resources, missing patches, low disk space, heartbeat of VMs, and so on. You can also set an automated response to detected events by sending an alert to IT service management (ITSM) tools. An alert detection notification can also be sent via email. To create such rules, see:
    - [Create, view, and manage metric alerts using Azure Monitor](../azure-monitor/platform/alerts-metric.md).
    - [Create, view, and manage log alerts using Azure Monitor](../azure-monitor/platform/alerts-log.md).
    - [Action rules](../azure-monitor/platform/alerts-action-rules.md) to set automated actions and notifications.
    - [Connect Azure to ITSM tools using IT Service Management Connector](../azure-monitor/platform/itsmc-overview.md).

**Azure platform as a service (PaaS)** is a development and deployment environment in the cloud, with resources enabling you to deliver simple, cloud-based applications to sophisticated, cloud-enabled enterprise applications. For instance, you can integrate Azure SQL Database with your Azure VMware Solution VMs. SQL alerts can then be integrated and correlated with Azure VMware Solution VM alerts. Then, for example if the SQL Database leg of the application is within the Azure PAAS, and the web application tier of the same application is hosted on your Azure VMware Solution VMs, a database alert can be correlated with a web app alert. This can simplify the troubleshooting effort with a single, integrated visibility of Azure, Azure VMware Solution, and on-premises VMs.
