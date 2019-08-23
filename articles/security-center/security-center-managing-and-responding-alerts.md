---
title: Manage security alerts in Azure Security Center | Microsoft Docs
description: This document helps you to use Azure Security Center capabilities to manage and respond to security alerts.
services: security-center
documentationcenter: na
author: rkarlin
manager: barbkess
editor: ''

ms.assetid: b88a8df7-6979-479b-8039-04da1b8737a7
ms.service: security-center
ms.topic: conceptual
ms.devlang: na
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/22/2019
ms.author: v-mohabe

---
# Managing and responding to security alerts in Azure Security Center

This topic shows you how to view and process the alerts that you have received in order to protect your resources. 

* To learn about the different types of alerts, see [Security alert types](security-alerts-overview#security-alert-types).
* For an overview of how Security Center generates alerts, see [How Azure Security Center detects and responds to threats](security-alert-types#asc-detects)

<!-- Anything else need to be said in this intro-->

> [!NOTE]
> To enable advanced detections, upgrade to Azure Security Center Standard. A free trial is available. To upgrade, select Pricing Tier in the [Security Policy](tutorial-security-policy.md). See [Azure Security Center pricing](security-center-pricing.md) to learn more.

<!-- Can I take out the note-->

## What are security alerts?
Security Center automatically collects, analyzes, and integrates log data from your Azure resources, the network, and connected partner solutions, like firewall and endpoint protection solutions, to detect real threats and reduce false positives. A list of prioritized security alerts is shown in Security Center along with the information you need to quickly investigate the problem and recommendations for how to remediate an attack.

> [!NOTE]
> For more information about how Security Center detection capabilities work, read [Azure Security Center Detection Capabilities](security-center-detection-capabilities.md).

## Managing security alerts

You can review your current alerts by looking at the **Security alerts** tile. Follow the steps below to see more details about each alert:

1. On the Security Center dashboard, the **Security alerts** tile displays an overview of the alerts.

  ![Security alerts tile in Security Center](./media/security-center-managing-and-responding-alerts/security-center-dashboard-alert.png)

1. To see more details about the alerts, click the tile.

   ![The Security alerts in Security Center](./media/security-center-managing-and-responding-alerts/security-center-manage-alerts.png)

    The alerts and their details are listed at the bottom of the page. To sort, click the column that you want to sort by. For more about the alert columns and alert severities, see [Alert severities](security-center-alerts-overview.md#alert-severities) and [Understand alert details](security-center-alerts-overview.md#alert-details).

<!---moved these sections out of here-->
<!--filter is just a step, not a whole section-->
1. To filter the alerts shown, click **Filter**, and from the **Filter** blade that opens, select the filter options that you want to apply. The list updates according to the selected filter.
For example, you might you want to address security alerts that occurred in the last 24 hours because you are investigating a potential breach in the system.
![Filtering alerts in Security Center](./media/security-center-managing-and-responding-alerts/security-center-filter-alerts.png)

## Respond to security alerts
Click a security alert to learn which resources are involved and the steps you need to take to remediate an attack. 

<!-- I take out the words "if any", should I put them back.-->

![Respond to security alerts in Azure Security Center](./media/security-center-managing-and-responding-alerts/security-center-alert.png)

After reviewing the information, click the resource that was attacked.

![Suggestions for what to do about security alerts in Azure Security Center](./media/security-center-managing-and-responding-alerts/security-center-alert-remediate.png)

In the **Description** field, you find more details about this event. These additional details offer insight into what triggered the security alert, the target resource, when applicable the source IP address, and recommendations about how to remediate.  In some instances, the source IP address is empty (not available) because not all Windows security events logs include the IP address.

The remediation suggested by Security Center vary according to the security alert. In some cases, you may have to use other Azure capabilities to implement the recommended remediation. For example, the remediation for this attack is to not allow the IP address that is generating this attack by using a [network ACL](../virtual-network/virtual-networks-acl.md) or a [network security group](../virtual-network/security-overview.md#security-rules) rule. For more information on the different types of alerts, read [Security alerts types](security-center-alerts-overview.md#security-alert-types).

> [!NOTE]
> Security Center has released to limited preview a new set of detections that leverage auditd records, a common auditing framework, to detect malicious behaviors on Linux machines. Please send an email 
> with your subscription IDs to [us](mailto:ASC_linuxdetections@microsoft.com) to join the preview.


## See also
In this document, you learned how to configure security policies in Security Center. To learn more about Security Center, see the following:

* [Handling Security Incident in Azure Security Center](security-center-incident.md)
* [Azure Security Center Detection Capabilities](security-center-detection-capabilities.md)
* [Azure Security Center Planning and Operations Guide](security-center-planning-and-operations-guide.md)
* [Azure Security Center FAQ](security-center-faq.md) — Find frequently asked questions about using the service.
* [Azure Security blog](https://blogs.msdn.com/b/azuresecurity/) — Find blog posts about Azure security and compliance.
