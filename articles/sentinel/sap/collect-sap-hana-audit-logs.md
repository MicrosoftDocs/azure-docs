---
title: Collect SAP HANA audit logs | Microsoft Docs
description: This article explains how to collect audit logs from your SAP HANA database.
author: msftandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 03/02/2022
---

# Collect SAP HANA audit logs

[!INCLUDE [Banner for top of topics](../includes/banner.md)]

This article explains how to collect audit logs from your SAP HANA database.

> [!IMPORTANT]
> The Microsoft Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

If you have SAP HANA database audit logs configured with Syslog, you'll also need to configure your Log Analytics agent to collect the Syslog files.

1. Make sure that the SAP HANA audit log trail is configured to use Syslog, as described in *SAP Note 0002624117*, which is accessible from the [SAP Launchpad support site](https://launchpad.support.sap.com/#/notes/0002624117). For more information, see:

    - [SAP HANA Audit Trail - Best Practice](https://archive.sap.com/documents/docs/DOC-51098)
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

Learn more about the Microsoft Sentinel SAP solutions:

- [Deploy the Microsoft Sentinel SAP data connector with SNC](sap-solution-deploy-snc.md)
- [Expert configuration options, on-premises deployment, and SAPControl log sources](sap-solution-deploy-alternate.md)
- [Microsoft Sentinel SAP solution detailed SAP requirements](sap-solution-detailed-requirements.md)
- [Microsoft Sentinel SAP solution logs reference](sap-solution-log-reference.md)
- [Microsoft Sentinel SAP solution: built-in security content](sap-solution-security-content.md)
- [Troubleshoot your Microsoft Sentinel SAP solution deployment](sap-deploy-troubleshoot.md)

For more information, see [Microsoft Sentinel solutions](sentinel-solutions.md).

