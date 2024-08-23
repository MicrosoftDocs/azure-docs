---
title: Create incidents from alerts in Microsoft Sentinel | Microsoft Docs
description: Learn how to create incidents from alerts in Microsoft Sentinel.
author: yelevin
ms.topic: how-to
ms.custom: mvc
ms.date: 05/29/2024
ms.author: yelevin
---

# Automatically create incidents from Microsoft security alerts

Alerts triggered in Microsoft security solutions that are connected to Microsoft Sentinel, such as Microsoft Defender for Cloud Apps and Microsoft Defender for Identity, do not automatically create incidents in Microsoft Sentinel. By default, when you connect a Microsoft solution to Microsoft Sentinel, any alert generated in that service will be ingested and stored in the *SecurityAlert* table in your Microsoft Sentinel workspace. You can then use that data like any other raw data you ingest into Microsoft Sentinel.

You can easily configure Microsoft Sentinel to automatically create incidents every time an alert is triggered in a connected Microsoft security solution, by following the instructions in this article.

> [!IMPORTANT]
> **This article does not apply** if you have:
> - Enabled [**Microsoft Defender XDR incident integration**](microsoft-365-defender-sentinel-integration.md), or 
> - Onboarded Microsoft Sentinel to the [**unified security operations platform**](microsoft-sentinel-defender-portal.md).
>
> In these scenarios, Microsoft Defender XDR [creates incidents from alerts](/defender-xdr/alerts-incidents-correlation) generated in Microsoft services.
>
> If you use incident creation rules for other Microsoft security solutions or products not integrated into Defender XDR, such as Microsoft Purview Insider Risk Management, and you plan to onboard to the unified security operations platform in the Defender portal, replace your incident creation rules with [scheduled analytics rules](scheduled-rules-overview.md).

## Prerequisites

Connect your security solution by installing the appropriate solution from the **Content Hub** in Microsoft Sentinel and setting up the data connector. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md) and [Microsoft Sentinel data connectors](connect-data-sources.md).

## Enable automatic incident generation in data connector

The most direct way to automatically create incidents from alerts generated from Microsoft security solutions is to configure the solution's data connector to create incidents:

1. Connect a Microsoft security solution data source. 

    :::image type="content" source="media/incidents-from-alerts/generate-security-incidents.png" alt-text="Screenshot of data connector configuration screen." lightbox="media/incidents-from-alerts/generate-security-incidents.png":::

1. Under **Create incidents &ndash; Recommended**, select **Enable** to enable the default analytics rule that creates incidents automatically from alerts generated in the connected security service. You can then edit this rule under **Analytics** and then **Active rules**.

   > [!IMPORTANT]
   >
   > If you don't see this section as shown, you most likely have enabled incident integration in your Microsoft Defender XDR connector, or you have onboarded Microsoft Sentinel to the unified security operations platform in the Microsoft Defender portal.
   >
   > In either case, this article does not apply to your environment, since your incidents are created by the Microsoft Defender correlation engine instead of by Microsoft Sentinel.

## Create incident creation rules from a Microsoft Security template

Microsoft Sentinel provides ready-made rule templates to create Microsoft Security rules. Each Microsoft source solution has its own template. For example, there's one for Microsoft Defender for Endpoint, one for Microsoft Defender for Cloud, and so on. Create a rule from each template that corresponds with the solutions in your environment, for which you want to create incidents automatically. Modify the rules to define more specific options for filtering which alerts should result in incidents. For example, you can choose to create Microsoft Sentinel incidents automatically only from high-severity alerts from Microsoft Defender for Identity.

1. From the Microsoft Sentinel navigation menu, under **Configuration**, select **Analytics**.

1. Select the **Rule templates** tab to see all of the analytics rule templates. To find more rule templates, go to the **Content hub** in Microsoft Sentinel.

    :::image type="content" source="media/incidents-from-alerts/rule-templates.png" alt-text="Screenshot of rule templates list in Analytics page." lightbox="media/incidents-from-alerts/rule-templates.png":::

1. Filter the list for the **Microsoft security** rule type to see the analytics rule templates for creating incidents from Microsoft alerts.

    :::image type="content" source="media/incidents-from-alerts/security-analytics-rule.png" alt-text="Screenshot of Microsoft security rule templates list.":::

1. Select the rule template for the alert source for which you want to create incidents. Then, in the details pane, select **Create rule**.

    :::image type="content" source="media/incidents-from-alerts/rule-template-details.png" alt-text="Screenshot of rule template details panel.":::

1. Modify the rule details, filtering the alerts that will create incidents by alert severity or by text contained in the alert’s name.  
      
    For example, if you choose **Microsoft Defender for Identity** in the **Microsoft security service** field and choose **High** in the **Filter by severity** field, only high severity security alerts will automatically create incidents in Microsoft Sentinel.

    :::image type="content" source="media/incidents-from-alerts/create-rule-wizard.png" alt-text="Screenshot of rule creation wizard.":::

1. Like with other types of analytics rules, select the **Automated response** tab to define [automation rules](create-manage-use-automation-rules.md) that run when incidents are created by this rule.

## Create incident creation rules from scratch

You can also create a new **Microsoft security** rule that filters alerts from different Microsoft security services. On the **Analytics** page, select **Create > Microsoft incident creation rule**.

:::image type="content" source="media/incidents-from-alerts/incident-creation-rule.png" alt-text="Screenshot of creating a Microsoft Security rule on the Analytics page.":::

You can create more than one **Microsoft Security** analytics rule per **Microsoft security service** type. This does not create duplicate incidents if you apply filters on each rule that exclude each other.

## Next steps

- To get started with Microsoft Sentinel, you need a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Learn how to [onboard your data to Microsoft Sentinel](quickstart-onboard.md), and [get visibility into your data and potential threats](get-visibility.md).
