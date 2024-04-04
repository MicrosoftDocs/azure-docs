---
title: Automatic attack disruption for SAP | Microsoft Sentinel
description: Learn about deploying automatic attack disruption for SAP with the unified security operations platform.
author: batamig
ms.author: bagol
ms.topic: concept
ms.date: 04/01/2024
appliesto:
  - Microsoft Sentinel in the Azure portal and the Microsoft Defender portal
ms.collection: usx-security
#customerIntent: As a security engineer, I want to deploy automatic attack disruption for SAP in the Microsoft Defender portal.
---

# Automatic attack disruption for SAP (Preview)

Microsoft Defender XDR correlates millions of individual signals to identify active ransomware campaigns or other sophisticated attacks in the environment with high confidence. While an attack is in progress, Defender XDR disrupts the attack by automatically containing compromised assets that the attacker is using through automatic attack disruption. Automatic attack disruption limits lateral movement early on and reduces the overall impact of an attack, from associated costs to loss of productivity. At the same time, it leaves security operations teams in complete control of investigating, remediating, and bringing assets back online.

When you add a new SAP system to Microsoft Sentinel, your default configuration includes attack disruption functionality in the unified SOC platform. This article describes how to ensure that your SAP system is ready to support automatic attack disruption for SAP in the Microsoft Defender portal.

For more information, see [Automatic attack disruption in Microsoft Defender XDR](/microsoft-365/security/defender/automatic-attack-disruption).

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Attack disruption with the unified security operations platform

Attack disruption for SAP is configured by updating your data connector agent version and ensuring that the relevant role is applied. However, attack disruption itself surfaces only in the unified security operations platform in the Microsoft Defender portal.

To use attack disruption for SAP, make sure that you configured the integration between Microsoft Sentinel and Microsoft Defender XDR. For more information, see [Connect Microsoft Sentinel to Microsoft Defender XDR](/microsoft-365/security/defender/microsoft-sentinel-onboard) and [Microsoft Sentinel in the Microsoft Defender portal (preview)](../microsoft-sentinel-defender-portal.md).

## Required SAP data connector agent version and role

Attack disruption for SAP requires that you have:

- A Microsoft Sentinel SAP data connector agent, version 88020708 or higher.
- The identity of your data connector agent VM must be assigned to the **Microsoft Sentinel Business Applications Agent Operator** Azure role.

**To use attack disruption for SAP**, deploy a new agent, or update your current agent to the latest version. For more information, see:

- [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
- [Update Microsoft Sentinel's SAP data connector agent](update-sap-data-connector.md)

**To verify your current agent version**, run the following query from the Microsoft Sentinel **Logs** page:

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

If the identity of your data connector agent VM isn't yet assigned to the **Microsoft Sentinel Business Applications Agent Operator** role as part of the deployment process, assign the role manually. For more information, see [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md#role).

## Related content

- [Automatic attack disruption in Microsoft Defender XDR](/microsoft-365/security/defender/automatic-attack-disruption)
- [Microsoft Sentinel in the Microsoft Defender portal (preview)](../microsoft-sentinel-defender-portal.md)
- [Prerequisites for deploying Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
- [Deploy Microsoft Sentinel solution for SAP applications](deployment-overview.md)
