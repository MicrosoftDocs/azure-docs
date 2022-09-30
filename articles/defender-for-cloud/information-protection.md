---
title: Prioritize security actions by data sensitivity - Microsoft Defender for Cloud
description: Use Microsoft Purview's data sensitivity classifications in Microsoft Defender for Cloud
ms.topic: overview
ms.date: 06/29/2022
---
# Prioritize security actions by data sensitivity

[Microsoft Purview](../purview/overview.md), Microsoft's data governance service, provides rich insights into the *sensitivity of your data*. With automated data discovery, sensitive data classification, and end-to-end data lineage, Microsoft Purview helps organizations manage and govern data in hybrid and multicloud environments.

Microsoft Defender for Cloud customers using Microsoft Purview can benefit from an additional vital layer of metadata in alerts and recommendations: information about any potentially sensitive data involved. This knowledge helps solve the triage challenge and ensures security professionals can focus their attention on threats to sensitive data.

This page explains the integration of Microsoft Purview's data sensitivity classification labels within Defender for Cloud.

You can learn more by watching this video from the Defender for Cloud in the Field video series:
- [Integration with Azure Purview](episode-two.md)

## Availability
|Aspect|Details|
|----|:----|
|Release state:|Preview.<br>[!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]|
|Pricing:|You'll need a Microsoft Purview account to create the data sensitivity classifications and run the scans. Viewing the scan results and using the output is free for Defender for Cloud users|
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
To provide the vital information about discovered sensitive data, and help ensure you have that information when you need it, Defender for Cloud displays information from Microsoft Purview in multiple locations.

> [!TIP]
> If a resource is scanned by multiple Microsoft Purview accounts, the information shown in Defender for Cloud relates to the most recent scan.


### Alerts and recommendations pages
When you're reviewing a recommendation or investigating an alert, the information about any potentially sensitive data involved is included on the page.

This vital additional layer of metadata helps solve the triage challenge and ensures your security team can focus its attention on the threats to sensitive data.



### Inventory filters
The [asset inventory page](asset-inventory.md) has a collection of powerful filters to group your resources with outstanding alerts and recommendations according to the criteria relevant for any scenario. These filters include **Data sensitivity classifications** and **Data sensitivity labels**. Use these filters to evaluate the security posture of resources on which Microsoft Purview has discovered sensitive data.

:::image type="content" source="./media/information-protection/information-protection-inventory-filters.png" alt-text="Screenshot of information protection filters in Microsoft Defender for Cloud's asset inventory page." lightbox="./media/information-protection/information-protection-inventory-filters.png":::

### Resource health 
When you select a single resource - whether from an alert, recommendation, or the inventory page - you reach a detailed health page showing a resource-centric view with the important security information related to that resource. 

The resource health page provides a snapshot view of the overall health of a single resource. You can review detailed information about the resource and all recommendations that apply to that resource. Also, if you're using any of the Microsoft Defender plans, you can see outstanding security alerts for that specific resource too.

When reviewing the health of a specific resource, you'll see the Microsoft Purview information on this page and can use it determine what data has been discovered on this resource alongside the Microsoft Purview account used to scan the resource.

:::image type="content" source="./media/information-protection/information-protection-resource-health.png" alt-text="Screenshot of Defender for Cloud's resource health page showing information protection labels and classifications from Microsoft Purview." lightbox="./media/information-protection/information-protection-resource-health.png":::

### Overview tile
The dedicated **Information protection** tile in Defender for Cloud’s [overview dashboard](overview-page.md) shows Microsoft Purview’s coverage. It also shows the resource types with the most sensitive data discovered.

A graph shows the number of recommendations and alerts by classified resource types. The tile also includes a link to Microsoft Purview to scan additional resources. Select the tile to see classified resources in Defender for Cloud’s asset inventory page.

:::image type="content" source="./media/information-protection/overview-dashboard-information-protection.png" alt-text="Screenshot of the information protection tile in Microsoft Defender for Cloud's overview dashboard." lightbox="./media/information-protection/overview-dashboard-information-protection.png":::

## Learn more

You can check out the following blog:

- [Secure sensitive data in your cloud resources](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/secure-sensitive-data-in-your-cloud-resources/ba-p/2918646).

## Next steps

For related information, see:

- [What is Microsoft Purview?](../purview/overview.md)
- [Microsoft Purview's supported data sources and file types](../purview/sources-and-scans.md) and [supported data stores](../purview/purview-connector-overview.md)
- [Microsoft Purview deployment best practices](../purview/deployment-best-practices.md)
- [How to label to your data in Microsoft Purview](../purview/how-to-automatically-label-your-content.md)
