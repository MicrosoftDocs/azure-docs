---
title: Prioritize security actions by data sensitivity - Microsoft Defender for Cloud
description: Use Microsoft Purview's data sensitivity classifications in Microsoft Defender for Cloud
author: bmansheim
ms.author: benmansheim
ms.topic: overview
ms.custom: ignite-2022
ms.date: 06/29/2022
---
# Prioritize security actions by data sensitivity (Preview)

[Microsoft Purview](../purview/overview.md), Microsoft's data governance service, provides rich insights into the *sensitivity of your data*. With automated data discovery, sensitive data classification, and end-to-end data lineage, Microsoft Purview helps organizations manage and govern data in hybrid and multicloud environments.

Microsoft Defender for Cloud customers using Microsoft Purview can benefit from another important layer of metadata in alerts and recommendations: information about any potentially sensitive data involved. This knowledge helps solve the triage challenge and ensures security professionals can focus their attention on threats to sensitive data.

This page explains the integration of Microsoft Purview's data sensitivity classification labels within Defender for Cloud.

You can learn more by watching this video from the Defender for Cloud in the Field video series:
- [Integration with Azure Purview](episode-two.md)

## Availability
|Aspect|Details|
|----|:----|
|Release state:|Preview.<br>[!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]|
|Pricing:|You'll need a Microsoft Purview account to create the data sensitivity classifications and run the scans. The integration between Purview and Microsoft Defender for Cloud doesn't incur extra costs, but the data is shown in Microsoft Defender for Cloud only for enabled plans.|
|Required roles and permissions:|**Security admin** and **Security contributor**|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/no-icon.png"::: Azure China 21Vianet (**Partial**: Subset of alerts and vulnerability assessment for SQL servers. Behavioral threat protections aren't available.)|



## The triage problem and Defender for Cloud's solution
Security teams regularly face the challenge of how to triage incoming issues. 

Defender for Cloud includes two mechanisms to help prioritize recommendations and security alerts:

- For recommendations, we've provided **security controls** to help you understand how important each recommendation is to your overall security posture. Defender for Cloud includes a **secure score** value for each control to help you prioritize your security work. Learn more in [Security controls and their recommendations](secure-score-security-controls.md#security-controls-and-their-recommendations).

- For alerts, we've assigned **severity labels** to each alert to help you prioritize the order in which you attend to each alert. Learn more in [How are alerts classified?](alerts-overview.md#how-are-alerts-classified).

However, where possible, you'd want to focus the security team's efforts on risks to the organization's **data**. If two recommendations have equal impact on your secure score, but one relates to a resource with sensitive data, ideally you'd include that knowledge when determining prioritization.

Microsoft Purview's data sensitivity classifications and data sensitivity labels provide that knowledge.

## Discover resources with sensitive data
To provide information about discovered sensitive data and help ensure you have that information when you need it, Defender for Cloud displays information from Microsoft Purview in multiple locations.

> [!TIP]
> If a resource is scanned by multiple Microsoft Purview accounts, the information shown in Defender for Cloud relates to the most recent scan.


### Alerts and recommendations pages
When you're reviewing a recommendation or investigating an alert, the information about any potentially sensitive data involved is included on the page. You can also filter the list of alerts by **Data sensitivity classifications** and **Data sensitivity labels** to help you focus on the alerts that relate to sensitive data.

This vital layer of metadata helps solve the triage challenge and ensures your security team can focus its attention on the threats to sensitive data.


### Inventory filters
The [asset inventory page](asset-inventory.md) has a collection of powerful filters to group your resources with outstanding alerts and recommendations according to the criteria relevant for any scenario. These filters include **Data sensitivity classifications** and **Data sensitivity labels**. Use these filters to evaluate the security posture of resources on which Microsoft Purview has discovered sensitive data.

:::image type="content" source="./media/information-protection/information-protection-inventory-filters.png" alt-text="Screenshot of information protection filters in Microsoft Defender for Cloud's asset inventory page." lightbox="./media/information-protection/information-protection-inventory-filters.png":::

### Resource health 
When you select a single resource - whether from an alert, recommendation, or the inventory page - you reach a detailed health page showing a resource-centric view with the important security information related to that resource. 

The resource health page provides a snapshot view of the overall health of a single resource. You can review detailed information about the resource and all recommendations that apply to that resource. Also, if you're using any of the Microsoft Defender plans, you can see outstanding security alerts for that specific resource too.

When reviewing the health of a specific resource, you'll see the Microsoft Purview information on this page and can use it to determine what data has been discovered on this resource. To explore more details and see the list of sensitive files, select the link to launch Microsoft Purview.

:::image type="content" source="./media/information-protection/information-protection-resource-health.png" alt-text="Screenshot of Defender for Cloud's resource health page showing information protection labels and classifications from Microsoft Purview." lightbox="./media/information-protection/information-protection-resource-health.png":::

> [!NOTE]
> - If the data in the resource is updated and the update affects the resource classifications and labels, Defender for Cloud reflects those changes only after Microsoft Purview rescans the resource.
> - If Microsoft Purview account is deleted, the resource classifications and labels are still be available in Defender for Cloud.
> - Defender for Cloud updates the resource classifications and labels within 24 hours of the Purview scan.

## Attack path
Some of the attack paths consider resources that contain sensitive data, such as “AWS S3 Bucket with sensitive data is publicly accessible”, based on Purview scan results.

## Security explorer
The Cloud Map shows resources that “contains sensitive data”, based on Purview scan results. You can use resources with this label to explore the map.

- To see the classification and labels of the resource, go to the [inventory](asset-inventory.md).
- To see the list of classified files in the resource, go to the [Microsoft Purview compliance portal](../purview/overview.md).

## Learn more

You can check out the following blog:

- [Secure sensitive data in your cloud resources](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/secure-sensitive-data-in-your-cloud-resources/ba-p/2918646).

## Next steps

For related information, see:

- [What is Microsoft Purview?](../purview/overview.md)
- [Microsoft Purview's supported data sources and file types](../purview/sources-and-scans.md) and [supported data stores](../purview/purview-connector-overview.md)
- [Microsoft Purview deployment best practices](../purview/deployment-best-practices.md)
- [How to label to your data in Microsoft Purview](../purview/how-to-automatically-label-your-content.md)
