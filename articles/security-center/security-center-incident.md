---
title: Manage security incidents in Azure Security Center | Microsoft Docs
description: This document helps you to use Azure Security Center to manage security incidents.
services: security-center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: conceptual
ms.date: 06/15/2020
ms.author: memildin

---
# Manage security incidents in Azure Security Center

Triaging and investigating security alerts can be time consuming for even the most skilled security analysts, and for many it is hard to even know where to begin. By using [analytics](security-center-detection-capabilities.md) to connect the information between distinct [security alerts](security-center-managing-and-responding-alerts.md), Security Center can provide you with a single view of an attack campaign and all of the related alerts – you can quickly understand what actions the attacker took and what resources were impacted.

This topic explains about incidents in Security Center, and how to use remediate their alerts.

## What is a security incident?

In Security Center, a security incident is an aggregation of all alerts for a resource that align with [kill chain](alerts-reference.md#intentions) patterns. Incidents appear in the [Security Alerts](security-center-managing-and-responding-alerts.md) list. Click on an incident to view the related alerts, which enables you to obtain more information about each occurrence.

## Managing security incidents

1. On the Security Center overview page, select the **Security alerts** tile. The incidents and alerts are listed. Notice that the security incident description has a different icon compared to other alerts.

    ![View security incidents](./media/security-center-managing-and-responding-alerts/security-center-manage-alerts.png)

1. To view details, select an incident. The **Security incident** page shows more details. 

    ![Respond to security incidents in Azure Security Center](./media/security-center-incident/incident-details.png)


    The left pane of the security incident page shows high-level information regarding the security incident: title, severity, status, activity time, description, and the affected resource. Alongside the affected resource are the Azure tags relevant to the resource. Use these to infer the organizational context of the resource when investigating the alert.

    The right pane includes the **Alerts** tab with the security alerts that were correlated as part of this incident. 

    >[!TIP]
    > For more information about a specific alert, select it. 

    ![Incident's take action tab](./media/security-center-incident/incident-take-action-tab.png)

    To switch to the **Take action** tab, select the tab or the button on the bottom of the right pane. Use this tab to take further actions regarding the incident. Actions such as:
    - *Mitigate the threat* - provides manual remediation steps for this security incident
    - *Prevent future attacks* - provides security recommendations to help reduce the attack surface, increase security posture, and thus prevent future attacks
    - *Trigger automated response* - provides the option to trigger a Logic App as a response to this security alert
    - *Suppress similar alerts* - provides the option to suppress future alerts with similar characteristics if the alert isn’t relevant for your organization 

   > [!NOTE]
   > The same alert can exist as part of an incident, as well as to be visible as a standalone alert.

1. Follow the remediation steps given for each alert.


## See also
In this document, you learned how to use the security incident capability in Security Center. For related information, see the following:

* [Threat protection in Security Center](threat-protection.md)
* [Security alerts in Security Center](security-center-alerts-overview.md)
* [Manage and respond to security alerts](security-center-managing-and-responding-alerts.md)