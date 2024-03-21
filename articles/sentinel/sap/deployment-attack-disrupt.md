---
title: Deploy automatic attack disruption for SAP (Preview)| Microsoft Sentinel
description: This article describes how to deploy automatic attack disruption in the Microsoft Defender portal for SAP.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 02/21/2024
appliesto: Microsoft Sentinel in the Azure portal and the Microsoft Defender portal
ms.collection: usx-security
---

# Deploy automatic attack disruption for SAP (Preview)

Microsoft Defender XDR correlates millions of individual signals to identify active ransomware campaigns or other sophisticated attacks in the environment with high confidence. While an attack is in progress, Defender XDR disrupts the attack by automatically containing compromised assets that the attacker is using through automatic attack disruption.

Automatic attack disruption limits lateral movement early on and reduces the overall impact of an attack, from associated costs to loss of productivity. At the same time, it leaves security operations teams in complete control of investigating, remediating, and bringing assets back online.

This article describes how to deploy automatic attack disruption in the Microsoft Defender portal with the unified SOC platform and the Microsoft Sentinel solution for SAP applications. Deployment includes steps in both Microsoft Sentinel in the Azure portal, and in your SAP environment.

For more information, see [Automatic attack disruption in Microsoft Defender XDR](/microsoft-365/security/defender/automatic-attack-disruption).

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Prerequisites

To deploy automatic attack disruption for SAP, make sure that have all the [prerequisites for deploying Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md).

## Deploy attack disruption for SAP

Attack disruption for SAP requires that you have an agent with the latest version of the SAP data connector.

- **If you don't yet have an agent**, add a new one using the portal option only. For more information, see [Deploy the data connector agent container](deploy-data-connector-agent-container.md#deploy-the-data-connector-agent-container?tabs=managed-identity%2Cazure-portal).

- **If you have an existing agent**, update it manually to the latest version. Automatic updates aren't supported for attack disruption. For more information, see [Manually update SAP data connector agent](update-sap-data-connector.md#manually-update-sap-data-connector-agent).

Then, also reapply the *MSFTSEN_SENTINEL_CONNECTOR_ROLE_V0.0.27.SAP* role to ensure that it includes permissions required for attack disruption. For more information, see [Reapply the MSFTSEN_SENTINEL_CONNECTOR_ROLE_V0.0.27.SAP role](update-sap-data-connector.md#reapply-the-msftsen_sentinel_connector_role_v0.0.27.sap-role).

## Related content

- [Automatic attack disruption in Microsoft Defender XDR](/microsoft-365/security/defender/automatic-attack-disruption)
- [Recommended playbooks](../automate-responses-with-playbooks.md#recommended-playbooks)
