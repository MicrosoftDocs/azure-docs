---
title: Concepts - Monitor and protection
description: Learn about the Azure native services that help secure and protect your Azure VMware Solution workloads.
ms.topic: conceptual
ms.date: 06/14/2021
---

# Monitor and protect Azure VMware Solution workloads

Microsoft Azure native services let you monitor, manage, and protect your virtual machines (VMs) on Azure VMware Solution and on-premises VMs. The Azure native services that you can integrate with Azure VMware Solution include:

- **Log Analytics workspace** workspace stores log data. Each workspace has its own data repository and configuration to store data.  Use Azure Arc enabled servers VM extension to deploy Log Analytics agents on VMs. 

- **Azure Security Center** strengthens data centers' security and provides advanced threat protection across hybrid workloads in the cloud or on-premises. It assesses Azure VMware Solution VMs' vulnerability, raises alerts as needed, and forwards them to Azure Monitor for resolution. You can also define security policies in [Azure Security Center](azure-security-integration.md).

- **[Azure Monitor](../azure-monitor/vm/vminsights-enable-overview.md)** collects, analyzes, and acts on telemetry from your cloud and on-premises environments. It requires no deployment. With Azure Monitor, you can monitor guest operating system performance to discover and map application dependencies for Azure VMware Solution or on-premises VMs. Your Log Analytics workspace in Azure Monitor enables log collection and performance counter collection using the Log Analytics agent or extensions. Collect data and logs to a single point and present that data to different Azure native services.

- **Azure Arc** extends Azure management to any infrastructure, including Azure VMware Solution, on-premises, or other cloud platforms. [Azure Arc enabled servers](../azure-arc/servers/overview.md) lets you manage your Windows and Linux physical servers and virtual machines hosted *outside* of Azure, on your corporate network, or another cloud provider. You can attach a Kubernetes cluster hosted in your Azure VMware Solution environment using [Azure Arc enabled Kubernetes](../azure-arc/kubernetes/overview.md). 

- **[Azure Update Management](../automation/update-management/overview.md)** manages operating system updates for your Windows and Linux machines in a hybrid environment in Azure Monitor. It monitors patching compliance and forwards patching deviation alerts to Azure Monitor for remediation. Azure Update Management must connect to your Log Analytics workspace to use stored data to assess the status of updates on your VMs.
 


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


