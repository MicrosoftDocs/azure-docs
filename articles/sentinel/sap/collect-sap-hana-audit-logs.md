---
title: Collect SAP HANA audit logs in Microsoft Sentinel | Microsoft Docs
description: This article explains how to collect audit logs from your SAP HANA database.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 05/24/2023
---

# Collect SAP HANA audit logs in Microsoft Sentinel

This article explains how to collect audit logs from your SAP HANA database.

> [!IMPORTANT]
> Microsoft Sentinel SAP HANA support is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

If you have SAP HANA database audit logs configured with Syslog, you'll also need to configure your Log Analytics agent to collect the Syslog files.

## Collect SAP HANA audit logs

1. Make sure that the SAP HANA audit log trail is configured to use Syslog, as described in *SAP Note 0002624117*, which is accessible from the [SAP Launchpad support site](https://launchpad.support.sap.com/#/notes/0002624117). For more information, see:

    - [SAP HANA Audit Trail - Best Practice](https://help.sap.com/docs/SAP_HANA_PLATFORM/b3ee5778bc2e4a089d3299b82ec762a7/35eb4e567d53456088755b8131b7ed1d.html?version=2.0.03)
    - [Recommendations for Auditing](https://help.sap.com/viewer/742945a940f240f4a2a0e39f93d3e2d4/2.0.05/en-US/5c34ecd355e44aa9af3b3e6de4bbf5c1.html)

1. Check your operating system Syslog files for any relevant HANA database events.

1. Install and configure a Log Analytics agent on your machine:

    1. Sign in to your HANA database operating system as a user with sudo privileges.  

    1. In the Azure portal, go to your Log Analytics workspace. On the left pane, under **Settings**, select **Agents management** > **Linux servers**.  

    1. Under **Download and onboard agent for Linux**, copy the code that's displayed in the box to your terminal, and then run the script.

    The Log Analytics agent is installed on your machine and connected to your workspace. For more information, see [Install Log Analytics agent on Linux computers](../../azure-monitor/agents/agent-linux.md) and [OMS Agent for Linux](https://github.com/microsoft/OMS-Agent-for-Linux) on the Microsoft GitHub repository.

1. Refresh the **Agents Management > Linux servers** tab to confirm that you have **1 Linux computers connected**.

1. On the left pane, under **Settings**, select **Agents configuration**, and then select the **Syslog** tab.

1. Select **Add facility** to add the facilities you want to collect. 

    > [!TIP]
    > Because the facilities where HANA database events are saved can change between different distributions, we recommend that you add all facilities, check them against your Syslog logs, and then remove any that aren't relevant.
    >

1. In Microsoft Sentinel, check to confirm that HANA database events are now shown in the ingested logs.

## Next steps

Learn more about the Microsoft Sentinel solution for SAP® applications:

- [Deploy Microsoft Sentinel solution for SAP® applications](deployment-overview.md)
- [Prerequisites for deploying Microsoft Sentinel solution for SAP® applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Deploy SAP Change Requests (CRs) and configure authorization](preparing-sap.md)
- [Deploy the solution content from the content hub](deploy-sap-security-content.md)
- [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
- [Deploy the SAP data connector with SNC](configure-snc.md)
- [Monitor the health of your SAP system](../monitor-sap-system-health.md)
- [Enable and configure SAP auditing](configure-audit.md)

Troubleshooting:

- [Troubleshoot your Microsoft Sentinel solution for SAP® applications deployment](sap-deploy-troubleshoot.md)

Reference files:

- [Microsoft Sentinel solution for SAP® applications data reference](sap-solution-log-reference.md)
- [Microsoft Sentinel solution for SAP® applications: security content reference](sap-solution-security-content.md)
- [Kickstart script reference](reference-kickstart.md)
- [Update script reference](reference-update.md)
- [Systemconfig.ini file reference](reference-systemconfig.md)

For more information, see [Microsoft Sentinel solutions](../sentinel-solutions.md).

