---
title: Azure Monitor Agent in Defender for Cloud
description: Learn how to deploy the Azure Monitor Agent on your Azure, multicloud, and on-premises servers to support Microsoft Defender for Cloud protections.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 02/28/2024
ms.custom: template-how-to
---

# Azure Monitor Agent in Defender for Cloud

To make sure that your server resources are secure, Microsoft Defender for Cloud uses agents installed on your servers to send information about your servers to Microsoft Defender for Cloud for analysis.

In this article, we give an overview of AMA preferences for when you deploy Defender for SQL servers on machines.

> [!NOTE]
> As part of the Defender for Cloud updated strategy, Azure Monitor Agent will no longer be required for the Defender for Servers offering. However, it will still be required for Defender for SQL Server on machines. As a result, the previous autoprovisioning process for both agents has been adjusted accordingly. Learn more about [this announcement](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation).

## Azure Monitor Agent in Defender for Servers

Azure Monitor Agent (AMA) is still available for deployment on your servers but isn't required to receive Defender for Servers features and capabilities. To ensure your servers are secured, receive all the security content of Defender for Servers, verify [Defender for Endpoint (MDE) integration](integration-defender-for-endpoint.md) and [agentless disk scanning](concept-agentless-data-collection.md) are enabled on your subscriptions. This ensures you’ll seamlessly be up to date and receive all the alternative deliverables once they're provided.

AMA provisioning is available through the Microsoft Defender for Cloud platform only through  Defender for SQL servers on machines. Learn how to [deploy AMA on your servers using standard methods including PowerShell, CLI, and Resource Manager templates](../azure-monitor/vm/monitor-virtual-machine-agent.md#agent-deployment-options).

## Availability

The following information on availability is relevant for the [Defender for SQL](defender-for-sql-introduction.md) plan only.

[!INCLUDE [azure-monitor-agent-availability](includes/azure-monitor-agent-availability.md)]

## Prerequisites

Before you deploy AMA with Defender for Cloud, you must have the following prerequisites:

- Make sure your multicloud and on-premises machines have Azure Arc installed.
  - AWS and GCP machines
    - [Onboard your AWS connector](quickstart-onboard-aws.md) and autoprovision Azure Arc.
    - [Onboard your GCP connector](quickstart-onboard-gcp.md) and autoprovision Azure Arc.
  - On-premises machines
    - [Install Azure Arc](../azure-arc/servers/learn/quick-enable-hybrid-vm.md).
- Make sure the Defender plans that you want the Azure Monitor Agent to support are enabled:
  - [Enable Defender for SQL servers on machines](defender-for-sql-usage.md)  
  - [Enable Defender plans on the subscriptions for your AWS VMs](quickstart-onboard-aws.md)
  - [Enable Defender plans on the subscriptions for your GCP VMs](quickstart-onboard-gcp.md)

## Deploy the SQL server-targeted AMA autoprovisioning process

Deploying Azure Monitor Agent with Defender for Cloud is available for SQL servers on machines as detailed [here](defender-for-sql-autoprovisioning.md#migrate-to-the-sql-server-targeted-ama-autoprovisioning-process).

## Impact of running with both the Log Analytics and Azure Monitor Agents

You can run both the Log Analytics and Azure Monitor Agents on the same machine, but you should be aware of these considerations:

- Certain recommendations or alerts are reported by both agents and appear twice in Defender for Cloud.
- Each machine is billed once in Defender for Cloud, but make sure you track billing of other services connected to the Log Analytics and Azure Monitor, such as the Log Analytics workspace data ingestion.
- Both agents have performance impact on the machine.

When you enable Defender for Servers Plan 2, Defender for Cloud decides which agent to provision. In most cases, the default is the Log Analytics agent.

Learn more about [migrating to the Azure Monitor Agent](../azure-monitor/agents/azure-monitor-agent-migration.md).

## Custom configurations

### Configure custom destination Log Analytics workspace

When you install the Azure Monitor Agent with autoprovisioning, you can define the destination workspace of the installed extensions. By default, the destination is the “default workspace” that Defender for Cloud creates for each region in the subscription: `defaultWorkspace-<subscriptionId>-<regionShortName>`. Defender for Cloud automatically configures the data collection rules, workspace solution, and other extensions for that workspace.

If you configure a custom Log Analytics workspace:

- Defender for Cloud only configures the data collection rules and other extensions for the custom workspace. You have to configure the workspace solution on the custom workspace.
- Machines with Log Analytics agent that reports to a Log Analytics workspace with the security solution are billed even when the Defender for Servers plan isn't enabled. Machines with the Azure Monitor Agent are billed only when the plan is enabled on the subscription. The security solution is still required on the workspace to work with the plans features and to be eligible for the 500-MB benefit.

### Log analytics workspace solutions

The Azure Monitor Agent requires Log analytics workspace solutions. These solutions are automatically installed when you autoprovision the Azure Monitor Agent with the default workspace.

The required [Log Analytics workspace solutions](/previous-versions/azure/azure-monitor/insights/solutions) for the data that you're collecting are:

- Cloud security posture management (CSPM) – **SecurityCenterFree solution**
- Defender for Servers Plan 2 – **Security solution**

### Other security events collection

When you autoprovision the Log Analytics agent in Defender for Cloud, you can choose to collect other security events to the workspace.

As in Log Analytics workspaces, Defender for Servers Plan 2 users are eligible for [500 MB of free data](faq-defender-for-servers.yml) daily on defined data types that include security events.

## Next steps

Now that you enabled the Log Analytics agent, check out the features that are supported by the agent:

- [Endpoint protection assessment](endpoint-protection-recommendations-technical.md)
- [Adaptive application controls](adaptive-application-controls.md)
- [Fileless attack detection](defender-for-servers-introduction.md#plan-features)
- [File integrity monitoring](file-integrity-monitoring-enable-ama.md)
