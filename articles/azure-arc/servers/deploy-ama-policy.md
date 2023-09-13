---
title: How to deploy and configure Azure Monitor Agent using Azure Policy
description: Learn how to deploy and configure Azure Monitor Agent using Azure Policy.
ms.date: 05/17/2023
ms.topic: conceptual
---

# Deploy and configure Azure Monitor Agent using Azure Policy

This article covers how to deploy and configure the Azure Monitor Agent (AMA) to Arc-enabled servers through Azure Policy using a custom Policy definition. Using Azure Policy ensures that Azure Monitor is running on your selected Arc-enabled servers, and automatically install the Azure Monitor Agent on newly added Arc resources.

Deploying the Azure Monitor Agent through a custom Policy definition involves two main steps:

- Selecting an existing or creating a new Data Collection Rule (DCR)

- Creating and deploying the Policy definition

In this scenario, the Policy definition is used to verify that the AMA is installed on your Arc-enabled servers. It will also install the AMA on newly added machines or on existing machines that don't have the AMA installed.

In order for Azure Monitor to work on a machine, it needs to be associated with a Data Collection Rule. Therefore, you'll need to include the resource ID of the DCR when you create your Policy definition.

## Select a Data Collection Rule

Data Collection Rules define the data collection process in Azure Monitor. They specify what data should be collected and where that data should be sent. You'll need to select or create a DCR to be associated with your Policy definition.

1. From your browser, go to the [Azure portal](https://portal.azure.com).

1. Navigate to the **Monitor | Overview** page. Under **Settings**, select **Data Collection Rules**.
    A list of existing DCRs displays. You can filter this at the top of the window. If you need to create a new DCR, see [Data collection rules in Azure Monitor](../../azure-monitor/essentials/data-collection-rule-overview.md) for more information.

1. Select the DCR to apply to your ARM template to view its overview.

1. Select **Resources** to view a list of resources (such as Arc-enabled VMs) assigned to the DCR. To add more resources, select *Add**. (You'll need to add resources if you created a new DCR.)

1. Select **Overview**, then select **JSON View** to view the JSON code for the DCR:
    
    :::image type="content" source="media/deploy-ama-policy/dcr-overview.png" alt-text="Screenshot of the Overview window for a data collection rule highlighting the JSON view button.":::

1. Locate the **Resource ID** field at the top of the window and select the button to copy the resource ID for the DCR to the clipboard. Save this resource ID; you'll need to use it when creating your Policy definition.
    
    :::image type="content" source="media/deploy-ama-policy/dcr-json-view.png" alt-text="Screenshot of the Resource JSON window showing the JSON code for a data collection rule and highlighting the resource ID copy button.":::

## Create and deploy the Policy definition

In order for Azure Policy to check if AMA is installed on your Arc-enabled, you'll need to create a custom policy definition that does the following:

- Evaluates if new VMs have the AMA installed and the association with the DCR.

- Enforces a remediation task to install the AMA and create the association with the DCR on VMs that aren't compliant with the policy.

1. Select one of the following policy definition templates (that is, for Windows or Linux machines):
    - [Configure Windows machines](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/CreateAssignmentBladeV2/assignMode~/0/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicySetDefinitions%2F9575b8b7-78ab-4281-b53b-d3c1ace2260b)
    - [Configure Linux machines](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/InitiativeDetailBlade/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicySetDefinitions%2F118f04da-0375-44d1-84e3-0fd9e1849403/scopes~/%5B%22%2Fsubscriptions%2Fd05f0ffc-ace9-4dfc-bd6d-d9ec0a212d16%22%2C%22%2Fsubscriptions%2F6e967edb-425b-4a33-ae98-f1d2c509dda3%22%2C%22%2Fsubscriptions%2F5f2bd58b-42fc-41da-bf41-58690c193aeb%22%2C%22%2Fsubscriptions%2F2dad32d6-b188-49e6-9437-ca1d51cec4dd%22%5D)
    
    These templates are used to create a policy to configure machines to run Azure Monitor Agent and associate those machines to a DCR.

1. Select **Assign** to begin creating the policy definition. Enter the applicable information for each tab (that is, **Basics**, **Advanced**, etc.).
1. On the **Parameters** tab, paste the **Data Collection Rule Resource ID** that you copied during the previous procedure:

    :::image type="content" source="media/deploy-ama-policy/resource-id-field.png" alt-text="Screenshot of the Parameters tab of the Configure Windows Machines dialog highlighting the Data Collection Rule Resource ID field.":::
1. Complete the creation of the policy to deploy it for the applicable machines. Once Azure Monitor Agent is deployed, your Azure Arc-enabled servers can apply its services and use it for log collection.

## Additional resources

* [Azure Monitor overview](../../azure-monitor/overview.md)

* [Tutorial: Monitor a hybrid machine with VM insights](learn/tutorial-enable-vm-insights.md)
