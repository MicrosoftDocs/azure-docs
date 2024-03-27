---
title: Deploy automatic attack disruption for SAP (Preview)| Microsoft Sentinel
description: This article describes how to deploy automatic attack disruption in the Microsoft Defender portal for SAP.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 02/21/2024
appliesto: Microsoft Sentinel in the Azure portal and the Microsoft Defender portal
ms.collection: usx-security
#customerIntent: As a security engineer, I want to deploy automatic attack disruption for SAP in the Microsoft Defender portal.
---

# Deploy automatic attack disruption for SAP (Preview)

Microsoft Defender XDR correlates millions of individual signals to identify active ransomware campaigns or other sophisticated attacks in the environment with high confidence. While an attack is in progress, Defender XDR disrupts the attack by automatically containing compromised assets that the attacker is using through automatic attack disruption. Automatic attack disruption limits lateral movement early on and reduces the overall impact of an attack, from associated costs to loss of productivity. At the same time, it leaves security operations teams in complete control of investigating, remediating, and bringing assets back online.

When you add a new SAP system to Microsoft Sentinel, your default configuration includes attack disruption functionality in the unified SOC platform. This article describes how to deploy automatic attack disruption for existing SAP systems, including steps in both Microsoft Sentinel in the Azure portal, and in your SAP environment.

For more information, see [Automatic attack disruption in Microsoft Defender XDR](/microsoft-365/security/defender/automatic-attack-disruption).

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Prerequisites

- To deploy automatic attack disruption for SAP in your existing system, make sure that you have all the [prerequisites for deploying Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md).

- While configuring your system to support attack disruption for SAP is done in the Azure portal and your SAP environment, attack disruption itself surfaces only in the unified SOC platform in the Microsoft Defender portal. Make sure that you've configured the integration between Microsoft Sentinel and Microsoft Defender XDR.

    For more information, see [Connect Microsoft Sentinel to Microsoft Defender XDR](https://aka.ms/onboard-microsoft-sentinel).

## Update your SAP data connector agent

Attack disruption for SAP requires that you have an agent with the latest version of the SAP data connector.

Update your existing agent to the latest version manually. Automatic updates aren't supported for attack disruption. For more information, see [Manually update SAP data connector agent](update-sap-data-connector.md#manually-update-sap-data-connector-agent).

> [!TIP]
> If you need to add a new agent, attack disruption supports new agents that are added using the portal option only. For more information, see [Deploy the data connector agent](deploy-data-connector-agent-container.md#deploy-the-data-connector-agent).

## Apply and assign the /MSFTSEN/SENTINEL_RESPONDER SAP role to your SAP system

Attack disruption is supported by the new **/MSFTSEN/SENTINEL_RESPONDER** SAP role, which you must apply to your SAP system and assign to the SAP user account used by Microsoft Sentinel's SAP data connector agent.

1. Do one of the following to apply the new role to your SAP system:

    - Deploy the SAP CR NUMBER TBD CR. <!--add cr number-->
    - Upload role definitions from the [/MSFTSEN/SENTINEL_RESPONDER](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/SAP/Sample%20Authorizations%20Role%20File/MSFTSEN_SENTINEL_RESPONDER) GitHub directory.

1. Assign the **/MSFTSEN/SENTINEL_RESPONDER** role to the SAP user account used by Microsoft Sentinel's SAP data connector agent. For more information, see [Deploy SAP Change Requests and configure authorization](preparing-sap.md).

Alternately, manually assign the following authorizations to the current role already assigned to the SAP user account used by Microsoft Sentinel's SAP data connector.

These authorizations are included in the **/MSFTSEN/SENTINEL_RESPONDER** SAP role specifically for attack disruption response actions.

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
- [Recommended playbooks](../automate-responses-with-playbooks.md#recommended-playbooks)
