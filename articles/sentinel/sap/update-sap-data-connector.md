---
title: Update the Microsoft Sentinel for SAP applications data connector agent
description: This article shows you how to update an already existing SAP data connector to its latest version.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 06/22/2025
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security
#Customer intent: As a security operations engineer, I want to update the Microsoft Sentinel for SAP applications data connector agent so that I can ensure my SAP data integration is using the latest features and security updates.

---

# Update the Microsoft Sentinel for SAP applications data connector agent

This article shows you how to update an already existing Microsoft Sentinel for SAP data connector to its latest version so that you can use the latest features and improvements.

During the data connector agent update process, there might be a brief downtime of approximately 10 seconds. To ensure data integrity, a database entry stores the timestamp of the last fetched log. After the update is complete, the data fetching process resumes from the last log fetched, preventing duplicates and ensuring a seamless data flow.

The automatic or manual updates described in this article are relevant to the SAP connector agent only, and not to the Microsoft Sentinel solution for SAP applications. To successfully update the solution, your agent needs to be up to date. The solution is updated separately, as you would any other [Microsoft Sentinel solution](../sentinel-solutions-deploy.md#install-or-update-content).

Content in this article is relevant for your **security**, **infrastructure**, and  **SAP BASIS** teams. 

> [!NOTE]
> This article is relevant only for the data connector agent, and isn't relevant for the [SAP agentless data connector](deployment-overview.md#data-connector) (Limited preview).
>

## Prerequisites

Before you start:

- Make sure that you have all the prerequisites for deploying Microsoft Sentinel solution for SAP applications. For more information, see [Prerequisites for deploying Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md).

- Make sure that you understand your SAP and Microsoft Sentinel environments and architecture, including the machines where your connector agents and collectors are [installed](deploy-data-connector-agent-container.md).

## Configure automatic updates for the SAP data connector agent (Preview)

Configure automatic updates for the connector agent, either for [all existing containers](#configure-automatic-updates-for-all-existing-containers) or a [specific container](#configure-automatic-updates-on-a-specific-container).

The commands described in this section create a cron job that runs daily, checks for updates, and updates the agent to the latest GA version. Containers running a preview version of the agent that's newer than the latest GA version aren't updated. Log files for automatic updates are located on the collector machine, at */var/log/sapcon-sentinel-register-autoupdate.log*.

After you configure automatic updates for an agent once, it's always configured for automatic updates.

> [!IMPORTANT]
> Automatically updating the SAP data connector agent is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### Configure automatic updates for all existing containers

To turn on automatic updates for all existing containers with a connected SAP agent, run the following command on the collector machine:

```bash
wget -O sapcon-sentinel-auto-update.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-auto-update.sh && bash ./sapcon-sentinel-auto-update.sh 
```

If you're working with multiple containers, the cron job updates the agent on all containers that existed at the time when you ran the original command. If you add containers after you create the initial cron job, the new containers aren't updated automatically. To update these containers, [run an extra command to add them](#configure-automatic-updates-on-a-specific-container).

### Configure automatic updates on a specific container

To configure automatic updates for a specific container or containers, such as if you added containers after running the [original automation command](#configure-automatic-updates-for-all-existing-containers), run the following command on the collector machine:

```bash
wget -O sapcon-sentinel-auto-update.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-auto-update.sh && bash ./sapcon-sentinel-auto-update.sh --containername <containername> [--containername <containername>]...
```

Alternately, in the */opt/sapcon/[SID or Agent GUID]/settings.json* file, define the `auto_update` parameter for each of the containers as `true`.

### Turn off automatic updates

To turn off automatic updates for a container or containers, open the */opt/sapcon/[SID or Agent GUID]/settings.json* file for editing and define the `auto_update` parameter for each of the containers as `false`.

## Manually update SAP data connector agent

To manually update the connector agent, make sure that you have the most recent versions of the relevant deployment scripts from the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP).

For more information, see [Microsoft Sentinel solution for SAP applications data connector agent update file reference](reference-update.md).

**On the data connector agent machine, run**:

```bash
wget -O sapcon-instance-update.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-instance-update.sh && bash ./sapcon-instance-update.sh
```

The SAP data connector Docker container on your machine is updated.

Be sure to check for any other available updates, such as SAP change requests.

### Verify your current data connector agent version

To verify your current agent version, run the following query from the Microsoft Sentinel **Logs** page:

```Kusto
SAP_HeartBeat_CL
| where sap_client_category_s !contains "AH"
| summarize arg_max(TimeGenerated, agent_ver_s), make_set(system_id_s) by agent_id_g
| project
    TimeGenerated,
    SAP_Data_Connector_Agent_guid = agent_id_g,
    Connected_SAP_Systems_Ids = set_system_id_s,
    Current_Agent_Version = agent_ver_s
```

See more information on the following items used in the preceding example, in the Kusto documentation:
- [***where*** operator](/kusto/query/where-operator?view=microsoft-sentinel&preserve-view=true)
- [***summarize*** operator](/kusto/query/summarize-operator?view=microsoft-sentinel&preserve-view=true)
- [***project*** operator](/kusto/query/project-operator?view=microsoft-sentinel&preserve-view=true)
- [***arg_max()*** aggregation function](/kusto/query/arg-max-aggregation-function?view=microsoft-sentinel&preserve-view=true)
- [***make_set()*** aggregation function](/kusto/query/make-set-aggregation-function?view=microsoft-sentinel&preserve-view=true)
- 
[!INCLUDE [kusto-reference-general-no-alert](../includes/kusto-reference-general-no-alert.md)]


## Related content

For more information, see:

- [Deploy Microsoft Sentinel solution for SAP applications](deployment-overview.md)
- [Monitor the health of your SAP system](../monitor-sap-system-health.md)
- [Troubleshoot your Microsoft Sentinel solution for SAP applications deployment](sap-deploy-troubleshoot.md)
