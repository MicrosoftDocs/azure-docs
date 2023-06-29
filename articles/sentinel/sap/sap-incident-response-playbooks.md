---
title: Microsoft Sentinel incident response playbooks for SAP
description: This article introduces Microsoft Sentinel playbooks built to respond to incidents in your SAP environment.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 06/28/2023
---

# Microsoft Sentinel incident response playbooks for SAP

This article describes how to take advantage of Microsoft Sentinel's security orchestration, automation, and response (SOAR) capabilities in conjunction with SAP. The article introduces purpose-built playbooks included in the [Microsoft Sentinel solution for SAP® applications](solution-overview.md). You can use these playbooks to respond automatically to suspicious user activity in SAP systems, automating remedial actions in SAP RISE, SAP ERP, SAP Business Technology Platform (BTP) as well as in Azure Active Directory.

The Microsoft Sentinel SAP solution empowers your organization to secure its SAP environment. For a complete, detailed overview of the Sentinel SAP solution, see the following articles:
- [Microsoft Sentinel solution for SAP® applications overview](solution-overview.md)
- [Deploy Microsoft Sentinel solution for SAP® applications](deployment-overview.md)
- [Microsoft Sentinel solution for SAP® applications: security content reference](sap-solution-security-content.md)

With the addition of these playbooks to the solution, you can not only monitor and analyze security events in real-time, you can also automate SAP incident response workflows to improve the efficiency and effectiveness of security operations.

The Microsoft Sentinel solution for SAP® applications includes the following playbooks:
- SAP Incident Response - Lock user from Teams - Basic
- SAP Incident Response - Lock user from Teams - Advanced
- SAP Incident Response - Reenable audit logging once deactivated

## Use case

You're tasked with defending your organization's SAP environment. You've implemented Microsoft Sentinel solution for SAP® applications. You've enabled the solution's analytics rule "SAP - Execution of a Sensitive Transaction Code," and you've customized the solution's "Sensitive Transactions" watchlist to include transaction code *SE80*. An incident warns you of suspicious activity in one of the SAP systems. A user is trying to execute this highly sensitive transaction. You must [investigate this incident](../investigate-incidents.md).

During the triage phase, you decide to take action against this user, kicking it out of your SAP ERP or BTP systems or even from Azure AD.

To bring orchestration and automation to this process, let's build an [automation rule](../automate-incident-handling-with-automation-rules.md) to invoke the **Lock user from Teams - Basic** playbook whenever a sensitive transaction execution by an unauthorized user is detected. This playbook uses Teams' adaptive cards feature to request approval before unilaterally blocking the user. For more information on configuring this playbook, see [this SAP blog post](https://blogs.sap.com/2023/05/22/from-zero-to-hero-security-coverage-with-microsoft-sentinel-for-your-critical-sap-security-signals-youre-gonna-hear-me-soar-part-1/).

The **Lock user from Teams - Advanced** playbook accomplishes the same objective, but is designed for more complex scenarios, allowing a single playbook to be used for multiple SAP systems, each with its own SAP SID. The playbook seamlessly manages the connections to all of these systems, and their credentials, using the *SAP - Systems* watchlist (included with the Microsoft Sentinel solution for SAP® applications) and Azure Key Vault. The playbook also allows you to communicate to the parties in the approval process using [Outlook actionable messages](/outlook/actionable-messages/get-started) in addition to&mdash;and synchronized with&mdash;Teams. For more information on configuring this playbook, see [this SAP blog post](https://blogs.sap.com/2023/05/23/from-zero-to-hero-security-coverage-with-microsoft-sentinel-for-your-critical-sap-security-signals-part-2/).

With your mission being to ensure that security coverage of your SAP environment remains comprehensive and uninterrupted, you might be concerned about the SAP audit log&mdash;one of the sources of your security information&mdash;being deactivated. You want to build an automation rule based on the **SAP - Deactivation of Security Audit Log** analytics rule, that will invoke the **Reenable audit logging once deactivated** playbook to make sure that doesn't happen. This playbook also uses Teams, but only to inform security personnel, since the action to re-enable the audit log can be done immediately as no approval is necessary. Since this playbook also uses Azure Key Vault to manage credentials, the playbook's configuration is similar to that of the previous one. For more information on this playbook and its configuration, see [this SAP blog post](https://blogs.sap.com/2023/05/23/from-zero-to-hero-security-coverage-with-microsoft-sentinel-for-your-critical-sap-security-signals-part-3/).

## Standard vs. Consumption playbooks

Microsoft Sentinel lets you create instances of these playbooks directly from templates if you're using Consumption playbooks. If you have specific requirements for virtual networking (VNET) support, you must use Standard playbooks, which means you currently have to create them from scratch as blank playbooks, and then import the relevant workflows into the playbook. See the [full explanation of the different types of playbooks](../automate-responses-with-playbooks.md#logic-app-types). Here is the procedure to follow:

1. Create the playbook as described in [these instructions](../tutorial-respond-threats-playbook.md?tabs=LAS#create-a-playbook). Follow the steps for a **Standard** playbook.
1. 

## Next steps

In this article, you learned about the playbooks available in the Microsoft Sentinel solution for SAP® applications.

- Learn more about the [Microsoft Sentinel solution for SAP® applications](solution-overview.md).
- Learn how to [deploy the Microsoft Sentinel solution for SAP® applications](deployment-overview.md).
- Learn about the [security content available in the Microsoft Sentinel solution for SAP® applications](sap-solution-security-content.md).
- Learn about [automation rules](../automate-incident-handling-with-automation-rules.md) and [playbooks](../automate-responses-with-playbooks.md).
