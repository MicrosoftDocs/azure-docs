---
title: Deploy automatic attack disruption for SAP | Microsoft Sentinel
description: Learn how to deploy automatic attack disruption for SAP with the unified security operations platform.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 04/01/2024
appliesto:
  - Microsoft Sentinel in the Azure portal
  - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#customerIntent: As a security engineer, I want to deploy automatic attack disruption for SAP with the unified security operations platform.
---

# Deploy attack disruption for SAP (Preview)

Microsoft Defender XDR correlates millions of individual signals to identify active ransomware campaigns or other sophisticated attacks in the environment with high confidence. While an attack is in progress, Defender XDR disrupts the attack by automatically containing compromised assets that the attacker is using through automatic attack disruption. Automatic attack disruption limits lateral movement early on and reduces the overall impact of an attack, from associated costs to loss of productivity. At the same time, it leaves security operations teams in complete control of investigating, remediating, and bringing assets back online.

When you add a new SAP system to Microsoft Sentinel, your default configuration includes attack disruption functionality in the unified SOC platform. This article describes how to ensure that your SAP system is ready to support automatic attack disruption for SAP in the Microsoft Defender portal.

Attack disruption for SAP is configured by updating your data connector agent version and ensuring that the relevant role is applied. However, attack disruption itself surfaces only in the unified security operations platform in the Microsoft Defender portal.

For more information, see [Automatic attack disruption in Microsoft Defender XDR](/microsoft-365/security/defender/automatic-attack-disruption).

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Prerequisites

- To deploy attack disruption for SAP, make sure that you configured the integration between Microsoft Sentinel and Microsoft Defender XDR. For more information, see [Connect Microsoft Sentinel to Microsoft Defender XDR](/microsoft-365/security/defender/microsoft-sentinel-onboard) and [Microsoft Sentinel in the Microsoft Defender portal (preview)](../microsoft-sentinel-defender-portal.md).

## Deploy automatic attack disruption for SAP

1. Attack disruption for SAP requires that you have a Microsoft Sentinel SAP data connector agent, version 90847355 or higher. The identity of your data connector agent VM must be also assigned to the **Microsoft Sentinel Business Applications Agent Operator** Azure role.

  To make sure you're using an agent with the right version and the Azure role is assigned as needed, deploy a new agent, or update your current agent to the latest version. For more information, see:

  - [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
  - [Update Microsoft Sentinel's SAP data connector agent](update-sap-data-connector.md), especially [Update your data connector agent for attack disruption](update-sap-data-connector.md#update-your-data-connector-agent-for-attack-disruption).

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

1. Apply **/MSFTSEN/SENTINEL_RESPONDER SAP** SAP role to your SAP system and assign it to the SAP user account used by Microsoft Sentinel's SAP data connector agent.

  To apply and assign the **/MSFTSEN/SENTINEL_RESPONDER** SAP role:
  
  1. Upload role definitions from the [/MSFTSEN/SENTINEL_RESPONDER](https://aka.ms/SAP_Sentinel_Responder_Role) file in GitHub.

  1. Assign the **/MSFTSEN/SENTINEL_RESPONDER** role to the SAP user account used by Microsoft Sentinel's SAP data connector agent. For more information, see [Deploy SAP Change Requests and configure authorization](preparing-sap.md).

  Alternately, manually assign the following authorizations to the current role already assigned to the SAP user account used by Microsoft Sentinel's SAP data connector. These authorizations are included in the **/MSFTSEN/SENTINEL_RESPONDER** SAP role specifically for attack disruption response actions.

  | Authorization object | Field | Value |
  | -------------------- | ----- | ----- |
  |S_RFC	|RFC_TYPE	|Function Module |
  |S_RFC	|RFC_NAME	|BAPI_USER_LOCK |
  |S_RFC	|RFC_NAME	|BAPI_USER_UNLOCK |
  |S_RFC	|RFC_NAME	|TH_DELETE_USER <br>In contrast to its name, this function doesn't delete users, but ends the active user session. |
  |S_USER_GRP	|CLASS	|* <br>We recommend replacing S_USER_GRP CLASS with the relevant classes in your organization that represent dialog users. |
  |S_USER_GRP	|ACTVT	|03 |
  |S_USER_GRP	|ACTVT	|05 |

  For more information, see [Required ABAP authorizations](preparing-sap.md#required-abap-authorizations).

## Related content

- [Automatic attack disruption in Microsoft Defender XDR](/microsoft-365/security/defender/automatic-attack-disruption)
- [Microsoft Sentinel in the Microsoft Defender portal (preview)](../microsoft-sentinel-defender-portal.md)
- [Prerequisites for deploying Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
- [Deploy Microsoft Sentinel solution for SAP applications](deployment-overview.md)
