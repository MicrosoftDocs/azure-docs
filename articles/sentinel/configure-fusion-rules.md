---
title: Configure multistage attack detection (Fusion) rules in Microsoft Sentinel
description: Create and configure attack detection rules based on Fusion technology in Microsoft Sentinel.
author: yelevin
ms.topic: conceptual
ms.date: 01/30/2022
ms.author: yelevin
ms.custom: ignite-fall-2021
---
# Configure multistage attack detection (Fusion) rules in Microsoft Sentinel

> [!IMPORTANT]
> The new version of the Fusion analytics rule is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

Microsoft Sentinel uses Fusion, a correlation engine based on scalable machine learning algorithms, to automatically detect multistage attacks by identifying combinations of anomalous behaviors and suspicious activities that are observed at various stages of the kill chain. On the basis of these discoveries, Microsoft Sentinel generates incidents that would otherwise be difficult to catch. These incidents comprise two or more alerts or activities. By design, these incidents are low-volume, high-fidelity, and high-severity.

Customized for your environment, this detection technology not only reduces [false positive](false-positives.md) rates but can also detect attacks with limited or missing information.

## Configure Fusion rules

This detection is enabled by default in Microsoft Sentinel. To check or change its status, use the following instructions:

1. Sign in to the [Azure portal](https://portal.azure.com) and enter **Microsoft Sentinel**.

1. From the Microsoft Sentinel navigation menu, select **Analytics**.

1. Select the **Active rules** tab, and then locate **Advanced Multistage Attack Detection** in the **NAME** column by filtering the list for the **Fusion** rule type. Check the **STATUS** column to confirm whether this detection is enabled or disabled.

    :::image type="content" source="./media/fusion/selecting-fusion-rule-type.png" alt-text="Screenshot of Fusion analytics rule." lightbox="./media/fusion/selecting-fusion-rule-type.png":::

1. To change the status, select this entry and on the **Advanced Multistage Attack Detection** preview pane, select **Edit**.

1. In the **General** tab of the **Analytics rule wizard**, note the status (Enabled/Disabled), or change it if you want.

    If you changed the status but have no further changes to make, select the **Review and update** tab and select **Save**.

    To further configure the Fusion detection rule, select **Next: Configure Fusion**.

    :::image type="content" source="media/configure-fusion-rules/configure-fusion-rule.png" alt-text="Screenshot of Fusion rule configuration." lightbox="media/configure-fusion-rules/configure-fusion-rule.png":::

1. **Configure source signals for Fusion detection**: we recommend you include all the listed source signals, with all severity levels, for the best result. By default they are already all included, but you have the option to make changes in the following ways:

    > [!NOTE]
    > If you exclude a particular source signal or an alert severity level, any Fusion detections that rely on signals from that source, or on alerts matching that severity level, will not be triggered. 
    
    - **Exclude signals from Fusion detections**, including anomalies, alerts from various providers, and raw logs.
     
        *Use case:* if you are testing a specific signal source known to produce noisy alerts, you can temporarily turn off the signals from that particular signal source for Fusion detections.

    - **Configure alert severity for each provider**: by design, the Fusion ML model correlates low fidelity signals into a single high severity incident based on anomalous signals across the kill-chain from multiple data sources. Alerts included in Fusion are generally lower severity (medium, low, informational), but occasionally relevant high severity alerts are included.
     
        *Use case:* If you have a separate process for triaging and investigating high severity alerts and would prefer not to have these alerts included in Fusion, you can configure the source signals to exclude high severity alerts from Fusion detections. 



    - **Exclude specific detection patterns from Fusion detection**. Certain Fusion detections may not be applicable to your environment, or may be prone to generating false positives. If you’d like to exclude a specific Fusion detection pattern, follow the instructions below:

        1. Locate and open a Fusion incident of the kind you want to exclude.

        1. In the **Description** section, select **Show more**.

        1. Under **Exclude this specific detection pattern**, select **exclusion link**, which redirects you to the **Configure Fusion** tab in the analytics rule wizard.

            :::image type="content" source="media/configure-fusion-rules/exclude-fusion-incident.png" alt-text="Screenshot of Fusion incident. Select the exclusion link.":::

        On the **Configure Fusion** tab, you'll see the detection pattern - a combination of alerts and anomalies in a Fusion incident - has been added to the exclusion list, along with the time when the detection pattern was added.

        You can remove an excluded detection pattern any time by selecting the trashcan icon on that detection pattern.

        :::image type="content" source="media/configure-fusion-rules/exclusion-patterns-list.png" alt-text="Screenshot of list of excluded detection patterns.":::

        Incidents that match excluded detection patterns will still be triggered, but they will **not show up in your active incidents queue**. They will be auto-populated with the following values:

        - **Status**: "Closed"
        
        - **Closing classification**: “Undetermined”

        - **Comment**: “Auto closed, excluded Fusion detection pattern”

        - **Tag**: “ExcludedFusionDetectionPattern” - you can query on this tag to view all incidents matching this detection pattern.

            :::image type="content" source="media/configure-fusion-rules/auto-closed-incident.png" alt-text="Screenshot of auto closed, excluded Fusion incident.":::



> [!NOTE]
> Microsoft Sentinel currently uses 30 days of historical data to train the machine learning systems. This data is always encrypted using Microsoft’s keys as it passes through the machine learning pipeline. However, the training data is not encrypted using [Customer-Managed Keys (CMK)](customer-managed-keys.md) if you enabled CMK in your Microsoft Sentinel workspace. To opt out of Fusion, navigate to **Microsoft Sentinel** \> **Configuration** \> **Analytics \> Active rules**, right-click on the **Advanced Multistage Attack Detection** rule, and select **Disable.**

## Configure scheduled analytics rules for Fusion detections

> [!IMPORTANT]
>
> - Fusion-based detection using analytics rule alerts is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

**Fusion** can detect scenario-based multi-stage attacks and emerging threats using alerts generated by [scheduled analytics rules](detect-threats-custom.md). We recommend you take the following steps to configure and enable these rules, so that you can get the most out of Microsoft Sentinel's Fusion capabilities.

1. Fusion for emerging threats can use alerts generated by any scheduled analytics rules, both [built-in](detect-threats-built-in.md#scheduled) and those [created by your security analysts](detect-threats-custom.md), that contain kill-chain (tactics) and entity mapping information. To ensure that an analytics rule's output can be used by Fusion to detect emerging threats:

    - Review **entity mapping** for these scheduled rules. Use the [entity mapping configuration section](map-data-fields-to-entities.md) to map parameters from your query results to Microsoft Sentinel-recognized entities. Because Fusion correlates alerts based on entities (such as *user account* or *IP address*), its ML algorithms cannot perform alert matching without the entity information.

    - Review the **tactics and techniques** in your analytics rule details. The Fusion ML algorithm uses [MITRE ATT&CK](https://attack.mitre.org/) information for detecting multi-stage attacks, and the tactics and techniques you label the analytics rules with will show up in the resulting incidents. Fusion calculations may be affected if incoming alerts are missing tactic information.

1. Fusion can also detect scenario-based threats using rules based on the following **scheduled analytics rule templates**.

    To enable the queries available as templates in the **Analytics** blade, go to the **Rule templates** tab, select the rule name in the templates gallery, and click **Create rule** in the details pane. 

    - [Cisco - firewall block but success logon to Microsoft Entra ID](https://github.com/Azure/Azure-Sentinel/blob/60e7aa065b196a6ed113c748a6e7ae3566f8c89c/Detections/MultipleDataSources/SigninFirewallCorrelation.yaml)
    - [Fortinet - Beacon pattern detected](https://github.com/Azure/Azure-Sentinel/blob/83c6d8c7f65a5f209f39f3e06eb2f7374fd8439c/Detections/CommonSecurityLog/Fortinet-NetworkBeaconPattern.yaml)
    - [IP with multiple failed Microsoft Entra logins successfully logs in to Palo Alto VPN](https://github.com/Azure/Azure-Sentinel/blob/60e7aa065b196a6ed113c748a6e7ae3566f8c89c/Detections/MultipleDataSources/HostAADCorrelation.yaml)
    - [Multiple Password Reset by user](https://github.com/Azure/Azure-Sentinel/blob/83c6d8c7f65a5f209f39f3e06eb2f7374fd8439c/Detections/MultipleDataSources/MultiplePasswordresetsbyUser.yaml)
    - [Rare application consent](https://github.com/Azure/Azure-Sentinel/blob/83c6d8c7f65a5f209f39f3e06eb2f7374fd8439c/Detections/AuditLogs/RareApplicationConsent.yaml)
    - [SharePointFileOperation via previously unseen IPs](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/OfficeActivity/SharePoint_Downloads_byNewIP.yaml)
    - [Suspicious Resource deployment](https://github.com/Azure/Azure-Sentinel/blob/83c6d8c7f65a5f209f39f3e06eb2f7374fd8439c/Detections/AzureActivity/NewResourceGroupsDeployedTo.yaml)
    - [Palo Alto Threat signatures from Unusual IP addresses](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/PaloAlto-PAN-OS/Analytic%20Rules/PaloAlto-UnusualThreatSignatures.yaml)
    
    To add queries that are not currently available as a rule template, see [create a custom analytics rule with a scheduled query](detect-threats-custom.md#create-a-custom-analytics-rule-with-a-scheduled-query). 
    
    - [New Admin account activity seen which was not seen historically](https://github.com/Azure/Azure-Sentinel/blob/83c6d8c7f65a5f209f39f3e06eb2f7374fd8439c/Hunting%20Queries/OfficeActivity/new_adminaccountactivity.yaml)

    For more information, see [Fusion Advanced Multistage Attack Detection Scenarios with Scheduled Analytics Rules](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/what-s-new-fusion-advanced-multistage-attack-detection-scenarios/ba-p/2337497).
    
    > [!NOTE]
    > For the set of scheduled analytics rules used by Fusion, the ML algorithm does fuzzy matching for the KQL queries provided in the templates. Renaming the templates will not impact Fusion detections.

## Next steps

Learn more about [Fusion detections in Microsoft Sentinel](fusion.md).

Learn more about the many [scenario-based Fusion detections](fusion-scenario-reference.md).

Now you've learned more about advanced multistage attack detection, you might be interested in the following quickstart to learn how to get visibility into your data and potential threats: [Get started with Microsoft Sentinel](get-visibility.md).

If you're ready to investigate the incidents that are created for you, see the following tutorial: [Investigate incidents with Microsoft Sentinel](investigate-cases.md).
