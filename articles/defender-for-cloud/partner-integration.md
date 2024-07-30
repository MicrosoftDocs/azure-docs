---
title: Integrate security solutions in Defender for Cloud
description: Learn about how Microsoft Defender for Cloud integrates with partner solutions to enhance your security posture and protect your Azure resources.
ms.topic: concept-article
ms.date: 05/16/2024
#customer intent: As a reader, I want to learn how security solutions integrate into Defender for Cloud.
---

# Integrated solutions in Defender for Cloud

This article provides information about security solutions that integrate with Microsoft Defender for Cloud.

Defender for Cloud integrates with both Microsoft services and partner solutions. Integration with solutions helps you to:

- **Simplify deployment**: Defender for Cloud offers streamlined provisioning of integrated partner solutions. For solutions like antimalware and vulnerability assessment, Defender for Cloud can provision the agent on your virtual machines. For firewall appliances, Defender for Cloud can take care of much of the network configuration required.
- **Integrate detection**: Security events from partner solutions are automatically collected, aggregated, and displayed as part of Defender for Cloud alerts and incidents. These events are also fused with detections from other sources to provide advanced threat-detection capabilities.
- **Unify monitoring and management**: Integrated events in Defender for Cloud help you to monitor partner solutions at a glance. Basic management is available, with easy access to advanced setup by using the partner solution.
- **Extend capabilities**: Some integrations extend Defender for Cloud capabilities. For example:
    - Defender for Cloud supports [third-party integrations](defender-partner-applications.md) to help enhance runtime security capabilities provided by Defender for APIs.
    - Defender for Cloud [integrates with ServiceNow](integration-servicenow.md) to help prioritize remediation of security recommendations, and to create and monitor tickets.


## Integrations

Integrated solutions appear in the Azure portal, in **Defender for Cloud** -> **Management** -> **Security solutions**.

Azure security solutions that are deployed from Defender for Cloud are automatically connected. You can also connect other security data sources, including computers running on-premises or in other clouds.

:::image type="content" source="./media/partner-integration/security-solutions-page-01-2023.png" alt-text="Screenshot showing security Solutions page." lightbox="./media/partner-integration/security-solutions-page-01-2023.png":::

### Connected solutions

The **Connected solutions** section includes security solutions that are currently connected to Defender for Cloud.

:::image type="content" source="media/partner-integration/connected-solutions.png" alt-text="Screenshot that shows the available connectable solutions.":::

The status of a security solution can be:

- **Healthy** (green): No health issues.
- **Unhealthy** (red): There's a health issue that requires immediate attention. If no health data is available and no alerts were received within the last 14 days, Defender for Cloud indicates that the solution is unhealthy or not reporting.
- **Stopped reporting** (orange): The solution stopped reporting health status.
- **Not reported** (gray): No health data is available. The solution didn't report anything yet and no health data is available. A solution's status might be unreported if it was connected recently and is still deploying.

If health status isn't available, Defender for Cloud shows the date and time of the last event received to indicate whether the solution is reporting or not.

You can drill down into each solution to manage it.

### Discovered solutions

Defender for Cloud automatically discovers security solutions that are running in Azure but not connected to Defender for Cloud, and displays them in the **Discovered solutions** section. You can connect solutions as needed to integrate it with Defender for Cloud.

### Add data sources

The **Add data sources** section includes other available data sources that can be connected. For instructions on adding data from any of these sources, select **ADD**.

:::image type="content" source="media/partner-integration/add-data-sources.png" alt-text="Screenshot that shows the available additional data sources.":::






## Related content

[Continuously export Defender for Cloud data](continuous-export.md).
