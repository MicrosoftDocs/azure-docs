---
title: Concepts - Monitor and protection
description: Learn about the Azure native services that help secure and protect your Azure VMware Solution workloads.
ms.topic: conceptual
ms.date: 08/14/2021
---

# Monitor and protect Azure VMware Solution workloads

Microsoft Azure native services let you monitor, manage, and protect your virtual machines (VMs) in a hybrid environment (Azure, Azure VMware Solution, and on-premises). In this article, you'll integrate Azure native services in your Azure VMware Solution private cloud. You'll also learn how to use the tools to manage your VMs throughout their lifecycle. 

The Azure native services that you can integrate with Azure VMware Solution include:

- **Azure Arc** extends Azure management to any infrastructure, including Azure VMware Solution, on-premises, or other cloud platforms. [Azure Arc enabled servers](../azure-arc/servers/overview.md) lets you manage your Windows and Linux physical servers and virtual machines hosted *outside* of Azure, on your corporate network, or another cloud provider. You can attach a Kubernetes cluster hosted in your Azure VMware Solution environment using [Azure Arc enabled Kubernetes](../azure-arc/kubernetes/overview.md). 

- **Azure Monitor** collects, analyzes, and acts on telemetry from your cloud and on-premises environments. It requires no deployment.  You can monitor guest operating system performance to discover and map application dependencies for Azure VMware Solution or on-premises VMs. Your Log Analytics workspace in Azure Monitor enables log collection and performance counter collection using the Log Analytics agent or extensions. 

   With Azure Monitor, you can collect data from different [sources to monitor and analyze](../azure-monitor/agents/data-sources.md) and different types of [data for analysis, visualization, and alerting](../azure-monitor/data-platform.md). You can also create alert rules to identify issues in your environment, like high use of resources, missing patches, low disk space, and heartbeat of your VMs. You can set an automated response to detected events by sending an alert to IT Service Management (ITSM) tools. Alert detection notification can also be sent via email.

- **Azure Security Center** strengthens data centers' security and provides advanced threat protection across hybrid workloads in the cloud or on-premises. It assesses Azure VMware Solution VMs' vulnerability, raises alerts as needed, and forwards them to Azure Monitor for resolution. For instance, it assesses missing operating system patches, security misconfigurations, and [endpoint protection](../security-center/security-center-services.md). You can also define security policies in [Azure Security Center](azure-security-integration.md).

- **Azure Update Management** manages operating system updates for your Windows and Linux machines in a hybrid environment in Azure Automation. It monitors patching compliance and forwards patching deviation alerts to Azure Monitor for remediation. Azure Update Management must connect to your Log Analytics workspace to use stored data to assess the status of updates on your VMs.

- **Log Analytics workspace** stores log data. Each workspace has its own data repository and configuration to store data. You can monitor Azure VMware Solution VMs through the Log Analytics agent. Machines connected to the Log Analytics Workspace use the [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md) to collect data about changes to installed software, Microsoft services, Windows registry and files, and Linux daemons on monitored servers. When data is available, the agent sends it to Azure Monitor Logs for processing. Azure Monitor Logs applies logic to the received data, records it, and makes it available for analysis. Use the Azure Arc enabled servers [VM extensions support](../azure-arc/servers/manage-vm-extensions.md) to deploy Log Analytics agents on VMs. 

- **Azure Sentinel** provides security analytics, alert detection, and automated threat response across an environment. It's a cloud-native, security information event management (SIEM) solution  that's built on top of a Log Analytics Workspace.



## Benefits

- Azure native services can be used to manage your VMs in a hybrid environment (Azure, Azure VMware Solution, and on-premises).
- Integrated monitoring and visibility of your Azure, Azure VMware Solution, and on-premises VMs.
- With Azure Update Management in Azure Automation, you can manage operating system updates for both your Windows and Linux machines. 
- Azure Security Center provides advanced threat protection, including:
    - File integrity monitoring
    - Fileless security alerts
    - Operating system patch assessment
    - Security misconfigurations assessment
    - Endpoint protection assessment 
- Easily deploy the Log Analytics agent using Azure Arc enabled servers VM extension support for new and existing VMs. 
- Your Log Analytics workspace in Azure Monitor enables log collection and performance counter collection using the Log Analytics agent or extensions. Collect data and logs to a single point and present that data to different Azure native services. 
- Added benefits of Azure Monitor include: 
    - Seamless monitoring 
    - Better infrastructure visibility 
    - Instant notifications 
    - Automatic resolution 
    - Cost efficiency 


## Topology

The diagram shows the integrated monitoring architecture for Azure VMware Solution VMs.

:::image type="content" source="media/concepts/integrated-azure-monitoring-architecture.png" alt-text="Diagram showing the integrated Azure monitoring architecture." border="false":::

The Log Analytics agent enables collection of log data from Azure, Azure VMware Solution, and on-premises VMs. The log data is sent to Azure Monitor Logs and stored in a Log Analytics workspace. You can deploy the Log Analytics agent using Arc enabled servers [VM extensions support](../azure-arc/servers/manage-vm-extensions.md) for new and existing VMs. 

Once the logs are collected by the Log Analytics workspace, you can configure the Log Analytics workspace with Azure Security Center. Azure Security Center assesses the vulnerability status of Azure VMware Solution VMs and raises an alert for any critical  vulnerability. For instance, it assesses missing operating system patches, security misconfigurations, and [endpoint protection](../security-center/security-center-services.md).

You can configure the Log Analytics workspace with Azure Sentinel for alert detection, threat visibility, hunting, and threat response. In the preceding diagram, Azure Security Center is connected to Azure Sentinel using Azure Security Center connector. Azure Security Center will forward the environment vulnerability to Azure Sentinel to create an incident and map with other threats. You can also create the scheduled rules query to detect unwanted activity and convert it to the incidents.


## Next steps

Now that you've covered Azure VMware Solution network and interconnectivity concepts, you may want to learn about:

- [Integrating Azure native services in Azure VMware Solution](integrate-azure-native-services.md)
- [Integrate Azure Security Center with Azure VMware Solution](azure-security-integration.md)
- [Automation account authentication](../automation/automation-security-overview.md)
- [Designing your Azure Monitor Logs deployment](../azure-monitor/logs/design-logs-deployment.md) and [Azure Monitor](../azure-monitor/overview.md)
- [Azure Security Center planning](../security-center/security-center-planning-and-operations-guide.md) and [Supported platforms for Security Center](../security-center/security-center-os-coverage.md)


