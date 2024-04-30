---
title: Set up continuous export with Azure Policy
description: Learn how to set up continuous export of Microsoft Defender for Cloud security alerts and recommendations with Azure Policy.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 03/20/2024
#customer intent: As a security analyst, I want to learn how to set up continuous export of alerts and recommendations with Azure Policy so that I can analyze the data in Log Analytics or Azure Event Hubs.
---

# Set up continuous export with Azure Policy

Continuous export of Microsoft Defender for Cloud security alerts and recommendations can help you analyze the data in Log Analytics or Azure Event Hubs. You can set up continuous export in Defender for Cloud at scale, by using provided Azure Policy templates.

> [!TIP]
> Defender for Cloud also offers the option to do a onetime, manual export to a comma-separated values (CSV) file. Learn how to [download a CSV file](export-alerts-to-csv.md).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

Required roles and permissions:
- Security Admin or Owner for the resource group
- Write permissions for the target resource.
- If you use the [Azure Policy DeployIfNotExist policies](#set-up-continuous-export-at-scale-with-azure-policy), you must have permissions that let you assign policies.
- To export data to Event Hubs, you must have Write permissions on the Event Hubs policy.
- To export to a Log Analytics workspace: 
    - If it *has the SecurityCenterFree solution*, you must have a minimum of Read permissions for the workspace solution: `Microsoft.OperationsManagement/solutions/read`.
    - If it *doesn't have the SecurityCenterFree solution*, you must have write permissions for the workspace solution: `Microsoft.OperationsManagement/solutions/action`.
    
    Learn more about [Azure Monitor and Log Analytics workspace solutions](/previous-versions/azure/azure-monitor/insights/solutions).

## Set up continuous export at scale with Azure Policy

Automating your organization's monitoring and incident response processes can help you reduce the time it takes to investigate and mitigate security incidents.

To deploy your continuous export configurations across your organization, use the provided Azure Policy `DeployIfNotExist` policies to create and configure continuous export procedures.

To implement these policies:

1. Select a policy to apply:

    |Goal  |Policy  |Policy ID  |
    |---------|---------|---------|
    |Continuous export to Event Hubs|[Deploy export to Event Hubs for Microsoft Defender for Cloud alerts and recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fcdfcce10-4578-4ecd-9703-530938e4abcb)|cdfcce10-4578-4ecd-9703-530938e4abcb|
    |Continuous export to Log Analytics workspace|[Deploy export to Log Analytics workspace for Microsoft Defender for Cloud alerts and recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fffb6f416-7bd2-4488-8828-56585fef2be9)|ffb6f416-7bd2-4488-8828-56585fef2be9|

1. Select **Assign**.

    :::image type="content" source="./media/continuous-export-azure-policy/export-policy-assign.png" alt-text="Screenshot that shows assigning the Azure Policy.":::

1. Select each tab and set the parameters to meet your requirements:

    1. On the **Basics** tab, set the scope for the policy. To use centralized management, assign the policy to the management group that contains the subscriptions that use the continuous export configuration.

    1. On the **Parameters** tab, set the resource group name, location and Event Hub details.

    1. Optionally, to apply this assignment to existing subscriptions, select the **Remediation** tab, and then select the option to create a remediation task.

1. Review the summary page, and then select **Create**.

## Next step

> [!div class="nextstepaction"]
> [Setup continuous export to an event hub behind a firewall](continuous-export-event-hub-firewall.md)
