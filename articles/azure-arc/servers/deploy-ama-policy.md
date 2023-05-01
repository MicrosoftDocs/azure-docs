---
title: How to deploy Azure Monitor Agent using Azure Policy
description: Learn how to deploy Azure Monitor Agent using Azure Policy.
ms.date: 05/01/2023
ms.topic: conceptual
---

# Deploy Azure Monitor Agent using Azure Policy

This article covers how to deploy the Azure Monitor Agent to Arc-enabled servers through Azure Policy using an ARM template. Using Azure Policy allows you to ensure that Azure Monitor is running on your selected Arc-enabled servers, as well as automatically install the Azure Monitor Agent on newly added Arc resources. Unlike [other methods for deploying the Azure Monitor agent](concept-log-analytics-extension-deployment.md#installation-options), deployment of Azure Monitor through an ARM templates allows...

Deploying the Azure Monitor Agent through Azure Policy using an ARM template involves two main steps:

- Selecting a Data Collection Rule (DCR)

- Creating and deploying the Policy definition

In this scenario, the Policy definition is used to verify that the AMA is installed on your Arc-enabled servers, and to install it on new servers or on existing servers that are discovered to not have the AMA installed. However, in order for Azure Monitor to work on a machine, it also needs to be associated with a Data Collection Rule. Therefore, you'll need to include the resource ID of the DCR within the Policy definition.


## Select a Data Collection Rule

Data Collection Rules (DCRs) define the data collection process in Azure Monitor. DCRs specify what data should be collected, how to transform that data, and where to send that data. You need to select (or create) a DCR and specify it within the ARM template you'll use for deploying AMA.

1. From your browser, go to the [Azure portal](https://portal.azure.com).

1. Navigate to the **Monitor | Overview** page and then, under **Settings**, select **Data Collection Rules**.
    A list of existing DCRs displays. You can filter this at the top of the window. If you need to create a new DCR, see ?? for more information.

1. Select the DCR to apply to your ARM template to view its overview.

1. Select **Resources** to view a list resources (such as Arc-enabled VMs) assigned to the DCR. To add additional resources, select *Add**. (You will need to add resources if you created a new DCR.)

1. Select **Overview**, then select **JSON View** to view the JSON code for the DCR:
    
    :::image type="content" source="media/deploy-ama-policy/dcr-overview.png" alt-text="Screenshot of the Overview window for a data collection rule highlighting the JSON view button.":::

1. Locate the **Resource ID** field at the top of the window and click the button to copy the resource ID for the DCR to the clipboard. Save this resource ID; you'll need to use it within the ARM template.
    
    :::image type="content" source="media/deploy-ama-policy/dcr-json-view.png" alt-text="Screenshot of the Resource JSON window showing the JSON code for a data collection rule and highlighting the resource ID copy button.":::

## Create and deploy the Policy definition

In order for Azure Policy to check if AMA is installed on your Arc-enabled, you'll need to create a custom policy definition that does the following:

- Evaluates if new VMs have the AMA installed and the association with the DCR.

- Enforces a remediation task to install the AMA and create the association with the DCR on VMs that are not compliant with the policy.

1. Select one of the following policy definition templates (i.e., for Windows or Linux machines):
    1. Configure Windows machines
    1. Configure Linus machines
    These templates are used to create a policy to configure machines to run Azure Monitor Agent and associate those machines to a DCR.
    For complete instructions on using policy definition templates, see ??.

1. Select **Assign** to begin creating the policy definition. Enter the applicable information for each tab (i.e., **Basics**, **Advanced**, etc.).
1. On the **Parameters** tab, paste in the **Data Collection Rule Resource ID** that you copied during the previous procedure:
    :::image type="content" source="media/deploy-ama-policy/resource-id-field.png" alt-text="Screenshot of the Parameters tab of the Configure Windows Machines dialog highlighting the Data Collection Rule Resource ID field.":::
1. Complete the creation of the policy to deploy it for the applicable machines. Once Azure Monitor Agent is deployed, your Azure Arc-enabled servers can leverage its services and use it for log collection.

## Additional resources

* [Azure Monitor overview](../../azure-monitor/overview.md)

* [Tutorial: Monitor a hybrid machine with VM insights](learn/tutorial-enable-vm-insights.md)