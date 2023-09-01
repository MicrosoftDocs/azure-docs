---
title: Enable File Integrity Monitoring (Azure Monitor Agent)
description: Learn how to enable File Integrity Monitor when you collect data with the Azure Monitor Agent (AMA)
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 11/14/2022
---
# Enable File Integrity Monitoring when using the Azure Monitor Agent

To provide [File Integrity Monitoring (FIM)](file-integrity-monitoring-overview.md), the Azure Monitor Agent (AMA) collects data from machines according to [data collection rules](../azure-monitor/essentials/data-collection-rule-overview.md). When the current state of your system files is compared with the state during the previous scan, FIM notifies you about suspicious modifications.

File Integrity Monitoring with the Azure Monitor Agent offers:

- **Compatibility with the unified monitoring agent** - Compatible with the [Azure Monitor Agent](../azure-monitor/agents/agents-overview.md) that enhances security, reliability, and facilitates multi-homing experience to store data.
- **Compatibility with tracking tool**- Compatible with the Change tracking (CT) extension deployed through the Azure Policy on the client's virtual machine. You can switch to Azure Monitor Agent (AMA), and then the CT extension pushes the software, files, and registry to AMA.
- **Simplified onboarding**- You can [onboard FIM](#enable-file-integrity-monitoring-with-ama) from Microsoft Defender for Cloud.
- **Multi-homing experience** – Provides standardization of management from one central workspace. You can [transition from Log Analytics (LA) to AMA](../azure-monitor/agents/azure-monitor-agent-migration.md) so that all VMs point to a single workspace for data collection and maintenance.
- **Rules management** – Uses [Data Collection Rules](https://azure.microsoft.com/updates/azure-monitor-agent-and-data-collection-rules-public-preview/) to configure or customize various aspects of data collection. For example, you can change the frequency of file collection.

In this article you'll learn how to:

   - [Enable File Integrity Monitoring with AMA](#enable-file-integrity-monitoring-with-ama)
   - [Edit the list of tracked files and registry keys](#edit-the-list-of-tracked-files-and-registry-keys)
   - [Exclude machines from File Integrity Monitoring](#exclude-machines-from-file-integrity-monitoring) 

## Availability

|Aspect|Details|
|----|:----|
|Release state:|Preview|
|Pricing:|Requires [Microsoft Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features)|
|Required roles and permissions:|**Owner**<br>**Contributor**|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds - Supported only in regions: `australiaeast`, `australiasoutheast`, `canadacentral`, `centralindia`, `centralus`, `eastasia`, `eastus2euap`, `eastus`, `eastus2`, `francecentral`, `japaneast`, `koreacentral`, `northcentralus`, `northeurope`, `southcentralus`, `southeastasia`, `switzerlandnorth`, `uksouth`, `westcentralus`, `westeurope`, `westus`, `westus2`<br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Microsoft Azure operated by 21Vianet)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: [Azure Arc](../azure-arc/servers/overview.md) enabled devices.<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected GCP accounts|

## Prerequisites

To track changes to your files on machines with AMA:

- Enable [Defender for Servers Plan 2](defender-for-servers-introduction.md)

- [Install AMA](auto-deploy-azure-monitoring-agent.md) on machines that you want to monitor

## Enable File Integrity Monitoring with AMA

To enable File Integrity Monitoring (FIM), use the FIM recommendation to select machines to monitor:

   1. From Defender for Cloud's sidebar, open the **Recommendations** page.
   1. Select the recommendation [File integrity monitoring should be enabled on machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9b7d740f-c271-4bfd-88fb-515680c33440). Learn more about [Defender for Cloud recommendations](review-security-recommendations.md).
   1. Select the machines that you want to use File Integrity Monitoring on, select **Fix**, and select **Fix X resources**.

        The recommendation fix:

        - Installs the `ChangeTracking-Windows` or `ChangeTracking-Linux` extension on the machines.
        - Generates a data collection rule (DCR) for the subscription, named `Microsoft-ChangeTracking-[subscriptionId]-default-dcr`, that defines what files and registries should be monitored based on default settings. The fix attaches the DCR to all machines in the subscription that have AMA installed and FIM enabled.
        - Creates a new Log Analytics workspace with the naming convention `defaultWorkspace-[subscriptionId]-fim` and with the default workspace settings.
   
        You can update the DCR and Log Analytics workspace settings later.
   
 1. From Defender for Cloud's sidebar, go to **Workload protections** > **File integrity monitoring**, and select the banner to show the results for machines with Azure Monitor Agent.

    :::image type="content" source="media/file-integrity-monitoring-enable-ama/file-integrity-monitoring-azure-monitoring-agent-banner.png" alt-text="Screenshot of banner in File integrity monitoring to show the results for machines with Azure Monitor Agent.":::

1. The machines with File Integrity Monitoring enabled are shown.

    :::image type="content" source="media/file-integrity-monitoring-enable-ama/file-integrity-monitoring-azure-monitoring-agent-results.png" alt-text="Screenshot of File integrity monitoring results for machines with Azure Monitor Agent." lightbox="media/file-integrity-monitoring-enable-ama/file-integrity-monitoring-azure-monitoring-agent-results.png":::

    You can see the number of changes that were made to the tracked files, and you can select **View changes** to see the changes made to the tracked files on that machine.

## Edit the list of tracked files and registry keys

File Integrity Monitoring (FIM) for machines with Azure Monitor Agent uses [Data Collection Rules (DCRs)](../azure-monitor/essentials/data-collection-rule-overview.md) to define the list of files and registry keys to track. Each subscription has a DCR for the machines in that subscription.

FIM creates DCRs with a default configuration of tracked files and registry keys. You can edit the DCRs to add, remove, or update the list of files and registries that are tracked by FIM.

To edit the list of tracked files and registries:

1. In File integrity monitoring, select **Data collection rules**.

    You can see each of the rules that were created for the subscriptions that you have access to.

1. Select the DCR that you want to update for a subscription.

    Each file in the list of Windows registry keys, Windows files, and Linux files contains a definition for a file or registry key, including name, path, and other options. You can also set **Enabled** to **False** to untrack the file or registry key without removing the definition.
    
    Learn more about [system file and registry key definitions](../automation/change-tracking/manage-change-tracking.md#track-files).
    
1. Select a file, and then add or edit the file or registry key definition.

1. Select **Add** to save the changes.

## Exclude machines from File Integrity Monitoring

Every machine in the subscription that is attached to the DCR is monitored. You can detach a machine from the DCR so that the files and registry keys aren't tracked.

To exclude a machine from File Integrity Monitoring:

1.  In the list of monitored machines in the FIM results, select the menu (**...**) for the machine
1. Select **Detach data collection rule**.

:::image type="content" source="media/file-integrity-monitoring-enable-ama/file-integrity-monitoring-azure-monitoring-agent-detach-rule.png" alt-text="Screenshot of the option to detach a machine from a data collection rule and exclude the machines from File Integrity Monitoring." lightbox="media/file-integrity-monitoring-enable-ama/file-integrity-monitoring-azure-monitoring-agent-detach-rule.png":::

The machine moves to the list of unmonitored machines, and file changes aren't tracked for that machine anymore.

## Next steps

Learn more about Defender for Cloud in:

- [Setting security policies](tutorial-security-policy.md) - Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing security recommendations](review-security-recommendations.md) - Learn how recommendations help you protect your Azure resources.
- [Azure Security blog](https://azure.microsoft.com/blog/topics/security/) - Get the latest Azure security news and information.
