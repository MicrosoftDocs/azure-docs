---
title: Deploy the Azure Monitor agent with auto provisioning
description: Deploy the Azure Monitor agent on your Azure, multicloud, and on-premises servers with auto provisioning to support Microsoft Defender for Cloud protections.
author: bmansheim
ms.author: benmansheim
ms.topic: how-to
ms.date: 08/03/2022
ms.custom: template-how-to
---

# Auto provision the Azure Monitor agent to protect your servers with Microsoft Defender for Cloud

To make sure that your server resources are secure, Microsoft Defender for Cloud uses agents installed on your servers to send information about your servers to Microsoft Defender for Cloud for analysis. You can use auto provisioning to quietly deploy the Azure Monitor agent on your servers.

In this article, we're going to show you how to use auto provisioning to deploy the agent so that you can protect your servers.

Currently, the Azure Monitor agent supports these Defender for Cloud protections:

| Defender for Cloud protection  | Required Defender plan  |
|---------|---------|
| [Endpoint protection assessment](endpoint-protection-recommendations-technical)    | [Security posture management (CSPM)](overview-page)        |
| [Adaptive application controls](adaptive-application-controls.md)    | [Defender for Servers Plan 2](defender-for-servers-overview)        |
| [File Integrity Monitoring](file-integrity-monitoring-overview.md)    | [Defender for Servers Plan 2](defender-for-servers-overview)        |
| [Fileless attack detections](defender-for-servers-introduction#fileless-attack-detection)    | [Defender for Servers Plan 2](defender-for-servers-overview)        |
| SQL content    | [Defender for SQL on machines](defender-for-sql-usage.md)        |

## Prerequisites

Before you enable auto provisioning, you must have the following prerequisites:

- Make sure your multicloud and on-premises machines have Azure Arc installed.
  - Multicloud machines
    - [Onboard your AWS connector](quickstart-onboard-aws.md) and auto provision Azure Arc.
    - [Onboard your GCP connector](quickstart-onboard-gcp.md) and auto provision Azure Arc.
  - On-premises machines
    - [Install Azure Arc](https://docs.microsoft.com/en-us/azure/azure-arc/servers/learn/quick-enable-hybrid-vm).
- Make sure the Defender plans that you want Azure Monitor agent to support are enabled:
  - [Enable Defender for Servers Plan 2 on Azure and on-premises VMs](enable-enhanced-security)
  - [Enable Defender for SQL on machines on Azure and on-premises VMs](defender-for-sql-usage.md)
  - [Enable Defender plans for AWS VMs](quickstart-onboard-aws.md)
  - [Enable Defender plans for GCP VMs](quickstart-onboard-gcp.md)

## Deploy the Azure Monitor agent with auto provisioning

To deploy the Azure Monitor agent with auto provisioning:

1. From Defender for Cloud's menu, open **Environment settings**.
1. Select the relevant subscription.
1. Open the **Auto provisioning** page.
1. Enable deployment of the Azure Monitor agent:

    1. For the **Log Analytics agent/Azure Monitor agent**, select the **On** status.
    1. For the **Log Analytics agent/Azure Monitor agent**, select **Edit configuration**.
    1. For the Auto-provisioning configuration agent type, select **Azure Monitor Agent**.


    :::image type="content" source="../media/" alt-text="Screenshot of the auto provisioning page for enabling the Azure Monitor agent.":::

    By default:

    - The Azure Monitor agent is installed on all existing machines in the subscription that don't already have it installed, and on all new machines created in the subscription.
    - The Log Analytics agent is not uninstalled from machines that already have it installed. You can manually remove the Log Analytics agent if you don't require it for other protections.
    - The agent is sends data to the default workspace for the subscription. You can also [configure a custom workspace](#configure-custom-destination-log-analytics-workspace) to send data to.

## Custom configurations

### Configure custom destination Log Analytics workspace

When enabling AMA installation through the auto-provisioning, the customer can define the destination workspace of the installed extensions. By default, the destination is the “default workspace” that Defender for Cloud creates for each region in the subscription: `defaultWorkspace-<subscriptionId>-<regionShortName>`. Defender for Cloud automatically configures the data collection rules, workspace solution, and additional extensions for that workspace.

If you configure a custom Log Analytics workspace, Defender for Cloud only configures the data collection rules and additional extensions for the custom workspace. You'll have to configure the workspace solution on the custom workspace. You are billed for the machines with Azure Monitor agents that report to the custom workspace, regardless of their subscription and its plans settings. The Defender for Cloud default workspace is configured to avoid extra charges.

To configure a custom destination workspace for the Azure Monitor agent:

1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

### Log analytics workspace solutions

The Azure Monitor agent requires Log analytics workspace solutions. These solutions are automatically installed when you auto deploy the Azure Monitor agent with the default workspace. 

The required [Log Analytics workspace solutions](/azure/azure-monitor/insights/solutions.md) for the data that you are collecting are:
  - Security posture management – SecurityCenterFree solution
  - Defender for Servers Plan 2 – Security solution
  - Database protection - None required

### Additional extensions for Defender for Cloud

The Azure Monitor agent requires additional extensions. These extensions are automatically installed when you auto deploy the Azure Monitor agent:

- File integrity monitoring – Requires dedicated FIM extension, ASA extension
- Endpoint protection recommendations and Fileless attack detections – Require the ASA extension (link). This is included by default as part of the DCR generated by the auto-provisioning.
- Database protections – contains 2 extensions, one for ATP and one for VA.

### Additional security events collection

When enabling LogA auto-provisioning from MDC portal, users are given an option to enable the collection of additional security events to their workspace. These events are not needed for any MDC unique content, and mainly use customers for investigations through Sentinel.
The configuration of these security events is not available through MDC portal for AMA machines. Customers who wish to enable it, can still do that manually on the selected workspace by creating a [DCR](https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/data-collection-rule-overview) that will collect the required evets. To see the optional events collected by MDC for LogA machines, see relevant documentation (Add link to the DCR template deployment).

Like for LogA, MDC users are eligible for 500MB daily discount on defined data types  that include security events. Please refer to the billing section.

## Using the Log Analytics and Azure Monitor agents together

Having Log A agent and AMA side by side on the same machine, is supported by the extensions, and by MDC. Having said that, there are several considerations one should be familiar with before running the extensions side by side:
- Certain recommendations or alerts might appear twice. This won’t impact MDC secure score (link).
- There won’t be double billing from MDC side, each machine will be billed only once. There might be double billing on services outside of MDC, like for Log A workspace data ingestion.
- Two processes are running on the same machine, which is not efficient in terms of performance.
The auto-provisioning page (add screenshots) offers users to enable automatic installation of either Log A agent, or AMA. As side by side is not recommended (although it is supported), the default choice of which extension to provision has an internal logic that meant to minimize side by side situation, but there is no option to completely avoid it. At the preview stage, the default choice for the vast majority of cases will remain Log Analytics extension. Users can control this setting and change it at any time, and the change will be effective moving forward (it won’t remove extensions that were already installed).

For more about migrating to Azure Monitor agent, see the [Log Analytics agent to Azure Monitor agent migration guide](https://docs.microsoft.com/en-us/azure/azure-monitor/agents/azure-monitor-agent-migration).

## Billing considerations

For Defender for Servers - Machines with Log Analytics extension are billed in one of two ways – Either if the servers plan was enabled on the subscription, or the machine had LogA extension reporting to a workspace with security solution. In case the LogA workspace has security solution, all the machines reporting to it received the dependent value, are billed, and eligible for the 500MB benefit regardless of whether the plan is enabled on the subscription.

In AMA era, the billing and dependent value require the machine’s subscription to be enabled. Security solution is still required on the workspace to enjoy the plan’s content and 500MB benefit but doesn’t pose charges, nor provides value for additional machines connected to it with AMA. However, billing of machines with LogA is still impacted by the solution, hence we recommend choosing the workspace and its settings carefully when using a custom workspace, and not the default workspace configuration created by MDC.
In case the machine has both LogA and AMA, MDC will charge the machine only once, and will provide the 500MB benefit with LogA storage only once.
More details on the 500MB benefit (link).  
Please note that in the case of both agents side-by side, double billing may happen on products other than MDC (like for data ingestion into LogA workspace).

## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->