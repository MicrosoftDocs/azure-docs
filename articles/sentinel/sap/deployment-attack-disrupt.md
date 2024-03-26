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

## Update your SAP data connector agent

Attack disruption for SAP requires that you have an agent with the latest version of the SAP data connector.

Update your existing agent to the latest version manually. Automatic updates aren't supported for attack disruption. For more information, see [Manually update SAP data connector agent](update-sap-data-connector.md#manually-update-sap-data-connector-agent).

> [!TIP]
> If you need to add a new agent, attack disruption supports adding a new agent using the portal option only. For more information, see [Deploy the data connector agent container](deploy-data-connector-agent-container.md#deploy-the-data-connector-agent-container?tabs=managed-identity%2Cazure-portal).


## Apply the MSFTSEN_SENTINEL_CONNECTOR_ROLE_WITH_RESPONSE SAP role to your SAP system

Attack disruption is supported by the new **MSFTSEN_SENTINEL_RESPONSE** SAP role, which you must apply to your SAP system.

Do one of the following:

- Apply the role to your SAP system.
- Apply the following permissions to your SAP system, which are included in the **MSFTSEN_SENTINEL_RESPONSE** role:

    PERMISSIONS ARE TBD

STEPS ARE TBD.

For more information, see [Required ABAP authorizations](preparing-sap.md#required-abap-authorizations).

## Related content

- [Automatic attack disruption in Microsoft Defender XDR](/microsoft-365/security/defender/automatic-attack-disruption)
- [Recommended playbooks](../automate-responses-with-playbooks.md#recommended-playbooks)
