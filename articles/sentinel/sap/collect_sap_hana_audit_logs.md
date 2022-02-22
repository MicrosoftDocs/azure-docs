---
title: Collect SAP HANA audit logs  | Microsoft Docs
description: Collect SAP HANA audit logs
author: msftandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 03/02/2022
---

# Collect SAP HANA audit logs

This article explains how to collect audit log from SAP HANA database.

If you have SAP HANA database audit logs configured with Syslog, you'll also need to configure your Log Analytics agent to collect the Syslog files.

1. Make sure that the SAP HANA audit log trail is configured to use Syslog, as described in *SAP Note 0002624117*, which is accessible from the [SAP Launchpad support site](https://launchpad.support.sap.com/#/notes/0002624117). For more information, see:

    - [SAP HANA Audit Trail - Best Practice](https://archive.sap.com/documents/docs/DOC-51098)
    - [Recommendations for Auditing](https://help.sap.com/viewer/742945a940f240f4a2a0e39f93d3e2d4/2.0.05/en-US/5c34ecd355e44aa9af3b3e6de4bbf5c1.html)

1. Check your operating system Syslog files for any relevant HANA database events.

1. Install and configure a Log Analytics agent on your machine:

    a. Sign in to your HANA database operating system as a user with sudo privileges.  
    b. In the Azure portal, go to your Log Analytics workspace. On the left pane, under **Settings**, select **Agents management** > **Linux servers**.  
    c. Under **Download and onboard agent for Linux**, copy the code that's displayed in the box to your terminal, and then run the script.

    The Log Analytics agent is installed on your machine and connected to your workspace. For more information, see [Install Log Analytics agent on Linux computers](../../azure-monitor/agents/agent-linux.md) and [OMS Agent for Linux](https://github.com/microsoft/OMS-Agent-for-Linux) on the Microsoft GitHub repository.

1. Refresh the **Agents Management > Linux servers** tab to confirm that you have **1 Linux computers connected**.

1. On the left pane, under **Settings**, select **Agents configuration**, and then select the **Syslog** tab.

1. Select **Add facility** to add the facilities you want to collect. 

    > [!TIP]
    > Because the facilities where HANA database events are saved can change between different distributions, we recommend that you add all facilities, check them against your Syslog logs, and then remove any that aren't relevant.
    >

1. In Microsoft Sentinel, check to confirm that HANA database events are now shown in the ingested logs.
