---
title: Setup continuous export withAzure Policy
description: Learn how to set up continuous export of Microsoft Defender for Cloud security alerts and recommendations with Azure Policy.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 03/18/2024
#customer intent: As a security analyst, I want to learn how to set up continuous export of alerts and recommendations with Azure Policy so that I can analyze the data in Log Analytics or Azure Event Hubs.
---

# Setup continuous export with Azure Policy

## Prerequisites


## Set up continuous export at scale by using provided policies

Automating your organization's monitoring and incident response processes can help you reduce the time it takes to investigate and mitigate security incidents.

To deploy your continuous export configurations across your organization, use the provided Azure Policy `DeployIfNotExist` policies to create and configure continuous export procedures.

To implement these policies:

1. Select a policy to apply:

    |Goal  |Policy  |Policy ID  |
    |---------|---------|---------|
    |Continuous export to Event Hubs|[Deploy export to Event Hubs for Microsoft Defender for Cloud alerts and recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fcdfcce10-4578-4ecd-9703-530938e4abcb)|cdfcce10-4578-4ecd-9703-530938e4abcb|
    |Continuous export to Log Analytics workspace|[Deploy export to Log Analytics workspace for Microsoft Defender for Cloud alerts and recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fffb6f416-7bd2-4488-8828-56585fef2be9)|ffb6f416-7bd2-4488-8828-56585fef2be9|

1. On the relevant page in Azure Policy, select **Assign**.

    :::image type="content" source="./media/continuous-export/export-policy-assign.png" alt-text="Screenshot that shows assigning the Azure Policy.":::

1. Select each tab and set the parameters to meet your requirements:

    1. On the **Basics** tab, set the scope for the policy. To use centralized management, assign the policy to the management group that contains the subscriptions that use the continuous export configuration.

    1. On the **Parameters** tab, set the resource group and data type details.

        > [!TIP]
        > Each parameter has a tooltip that explains the options that are available.
        >
        > The Azure Policy **Parameters** tab (1) provides access to configuration options that are similar to options that you can access on the Defender for Cloud **Continuous export** page (2).
        >
        > :::image type="content" source="./media/continuous-export/azure-policy-next-to-continuous-export.png" alt-text="Screenshot that shows comparing the parameters in continuous export with Azure Policy." lightbox="./media/continuous-export/azure-policy-next-to-continuous-export.png":::
        >

    1. Optionally, to apply this assignment to existing subscriptions, select the **Remediation** tab, and then select the option to create a remediation task.

1. Review the summary page, and then select **Create**.

## Next step

> [!div class="nextstepaction"]
>
