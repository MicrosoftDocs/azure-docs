---
title: Manage security incidents in Azure Security Center | Microsoft Docs
description: This document helps you to use Azure Security Center to manage security incidents.
services: security-center
documentationcenter: na
author: rkarlin
manager: barbkess
editor: ''

ms.assetid: e8feb669-8f30-49eb-ba38-046edf3f9656
ms.service: security-center
ms.topic: conceptual
ms.devlang: na
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 8/27/2019
ms.author: rkarlin

---
# Manage security incidents in Azure Security Center

Triage and investigating security alerts can be time consuming for even the most skilled security analysts, and for many it is hard to even know where to begin. By using [analytics](security-center-detection-capabilities.md) to connect the information between distinct [security alerts](security-center-managing-and-responding-alerts.md), Security Center can provide you with a single view of an attack campaign and all of the related alerts – you can quickly understand what actions the attacker took and what resources were impacted.

This topic explains about incidents in Security Center, and how to use remediate their alerts.

## What is a security incident?

In Security Center, a security incident is an aggregation of all alerts for a resource that align with [kill chain](https://blogs.technet.microsoft.com/office365security/addressing-your-cxos-top-five-cloud-security-concerns/) patterns. Incidents appear in the [Security Alerts](security-center-managing-and-responding-alerts.md) list. Click ona an incident to view the related alerts, which enables you to obtain more information about each occurrence.

## Managing security incidents

1. On the Security Center dashboard, click the **Security alerts** tile. The incidents and alerts are listed. Notice that the security incident description has a different icon compared to other alerts.

    ![View security incidents](./media/security-center-managing-and-responding-alerts/security-center-manage-alerts.png)

1. To view details, click on an incident. The **Security incident detected** blade displays further details. The **General Information** section can offer an insight into what triggered the security alert. It displays information such as the target resource, source IP address (when applicable), if the alert is still active, and recommendations about how to remediate.  

    ![Respond to security incidents in Azure Security Center](./media/security-center-managing-and-responding-alerts/security-center-alert-incident.png)

1. To obtain more information on each alert, click on an alert. The remediation suggested by Security Center vary according to the security alert.

   > [!NOTE]
   > The same alert can exist as part of an incident, as well as to be visible as a standalone alert.

    ![Alert details](./media/security-center-incident/security-center-incident-alert.png)

1. Follow the remediation steps given for each alert.

For more information about alerts, [Managing and responding to security alerts](security-center-managing-and-responding-alerts.md).

The following topics guide you through the different alerts, according to resource types:

* [IaaS VMs and servers alerts](security-center-alerts-iaas.md)
* [Native compute alerts](security-center-alerts-compute.md)
* [Data services alerts](security-center-alerts-data-services.md)

The following topics explain how Security Center uses the different telemetry that it collects from integrating with the Azure infrastructure, in order to apply additional protection layers for resources deployed on Azure:

* [Service layer alerts](security-center-alerts-service-layer.md)
* [Integration with Azure security products](security-center-alerts-integration.md)

## See also
In this document, you learned how to use the security incident capability in Security Center. To learn more about Security Center, see the following:

* [Security alerts in Azure Security Center](security-center-alerts-overview.md).
* [Manage security alerts](security-center-managing-and-responding-alerts.md)
* [Azure Security Center Planning and Operations Guide](security-center-planning-and-operations-guide.md)
* [Azure Security Center FAQ](security-center-faq.md)--Find frequently asked questions about using the service.
* [Azure Security blog](https://blogs.msdn.com/b/azuresecurity/)--Find blog posts about Azure security and compliance.
