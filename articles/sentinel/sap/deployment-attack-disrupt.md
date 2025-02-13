---
title: Automatic attack disruption for SAP | Microsoft Sentinel
description: Learn about deploying automatic attack disruption for SAP with the unified security operations platform.
author: batamig
ms.author: bagol
ms.topic: concept-article
ms.date: 04/07/2024
appliesto:
  - Microsoft Sentinel in the Azure portal
  - Microsoft Sentinel with Defender XDR in the Microsoft Defender portal
ms.collection: usx-security
#Customer intent: As a security engineer, I want to configure automatic attack disruption for SAP so that I can minimize the impact of sophisticated attacks and maintain control over investigation and remediation processes.

---

# Automatic attack disruption for SAP (Preview)

Microsoft Defender XDR correlates millions of individual signals to identify active ransomware campaigns or other sophisticated attacks in the environment with high confidence. While an attack is in progress, Defender XDR disrupts the attack by automatically containing compromised assets that the attacker is using through automatic attack disruption. Automatic attack disruption limits lateral movement early on and reduces the overall impact of an attack, from associated costs to loss of productivity. At the same time, it leaves security operations teams in complete control of investigating, remediating, and bringing assets back online.

When you add a new SAP system to Microsoft Sentinel, your default configuration includes attack disruption functionality in the unified security operations platform. This article describes how to ensure that your SAP system is ready to support automatic attack disruption for SAP in the Microsoft Defender portal.

For a video demonstration of attack disruption for SAP, watch the following video:
<br><br>
> [!VIDEO https://www.youtube.com/embed/-ijnGxRnwks?si=MPC2uNuLD8biqMVj]

Content in this article is intended for your **security**, **infrastructure**, and  **SAP BASIS** teams.

> [!NOTE]
> Attack disruption requires a data connector agent and isn't supported for the [SAP agentless solution](deployment-overview.md#data-connector) (limited preview).

## Attack disruption for SAP and the unified security operations platform

Attack disruption for SAP is configured by updating your data connector agent version and ensuring that the relevant roles are applied in Azure and your SAP system. However, automatic attack disruption itself surfaces only in the unified security operations platform in the Microsoft Defender portal.

For more information, see [Automatic attack disruption in Microsoft Defender XDR](/microsoft-365/security/defender/automatic-attack-disruption).

## Minimum agent version and required roles

Automatic attack disruption for SAP requires:

- A data connector agent version 90847355 or higher.
- The identity of your data connector agent VM must be assigned to the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** Azure roles.
- The **/MSFTSEN/SENTINEL_RESPONDER** SAP role must be applied to your SAP system and assigned to the SAP user account used by Microsoft Sentinel's SAP data connector agent.

To use attack disruption for SAP, deploy a new agent, or update your current agent to the latest version. Make sure to assign the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** Azure roles and the **/MSFTSEN/SENTINEL_RESPONDER** SAP role as required.

For more information, see:

- [Connect your SAP system to Microsoft Sentinel](deploy-data-connector-agent-container.md)
- [Update Microsoft Sentinel's SAP data connector agent](update-sap-data-connector.md#), especially [Update your system for attack disruption](update-sap-data-connector.md#update-your-system-for-attack-disruption)

## Related content

For more information, see [Microsoft Sentinel in the Microsoft Defender portal (preview)](../microsoft-sentinel-defender-portal.md).
