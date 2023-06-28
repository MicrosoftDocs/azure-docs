---
title: Microsoft Sentinel incident response playbooks for SAP
description: This article introduces Microsoft Sentinel playbooks built to respond to incidents in your SAP environment.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 06/28/2023
---

# Microsoft Sentinel incident response playbooks for SAP

This article demonstrates how to take advantage of Microsoft Sentinel's security orchestration, automation, and response (SOAR) capabilities in conjunction with SAP. The article introduces purpose-built playbooks included in the [Microsoft Sentinel solution for SAP® applications](solution-overview.md). You can use these playbooks to respond automatically to suspicious user activity in SAP systems, automating remedial actions in SAP RISE, SAP ERP, SAP Business Technology Platform (BTP) as well as in Azure Active Directory.

The Microsoft Sentinel SAP solution empowers your organization to secure its SAP environment. For a complete, detailed overview of the Sentinel SAP solution, see the following articles:
- [Microsoft Sentinel solution for SAP® applications overview](solution-overview.md)
- [Deploy Microsoft Sentinel solution for SAP® applications](deployment-overview.md)
- [Microsoft Sentinel solution for SAP® applications: security content reference](sap-solution-security-content.md)

With the addition of these playbooks to the solution, you can not only monitor and analyze security events in real-time, you can also automate SAP incident response workflows to improve the efficiency and effectiveness of security operations.

## Use case

You're tasked with defending your organization's SAP environment. You've implemented Microsoft Sentinel solution for SAP® applications. You've enabled the solution's analytics rule "SAP - Execution of a Sensitive Transaction Code," and you've customized the solution's "Sensitive Transactions" watchlist to include transaction code *SE80*. An incident warns you of suspicious activity in one of the SAP systems. A user is trying to execute this highly sensitive transaction. You must [investigate this incident](../investigate-incidents.md).

During the triage phase, you decide to take action against this user, kicking it out of your SAP ERP or BTP systems or even from Azure AD. 

## Next steps

In this article, you learned about the Microsoft Sentinel solution for SAP® BTP.

> [!div class="nextstepaction"]
> [Deploy the Microsoft Sentinel Solution for SAP® BTP](deploy-sap-btp-solution.md)
