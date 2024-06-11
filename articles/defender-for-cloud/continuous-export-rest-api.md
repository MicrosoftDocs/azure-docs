---
title: Set up continuous export with REST API
description: Learn how to set up continuous export of Microsoft Defender for Cloud security alerts and recommendations with REST API.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 03/19/2024
# customer intent: As a reader, I want to learn how to set up continuous export of Microsoft Defender for Cloud security alerts and recommendations using the REST API, so that I can integrate it into my own applications.
---

# Set up continuous export with REST API

Continuous export of Microsoft Defender for Cloud security alerts and recommendations can help you analyze the data in Log Analytics or Azure Event Hubs. You can set up continuous export in Defender for Cloud by using the REST API.

> [!TIP]
> Defender for Cloud also offers the option to do a onetime, manual export to a comma-separated values (CSV) file. Learn how to [download a CSV file](export-alerts-to-csv.md).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

Required roles and permissions:
- Security Admin or Owner for the resource group
- Write permissions for the target resource.
- If you use the [Azure Policy DeployIfNotExist policies](continuous-export-azure-policy.md), you must have permissions that let you assign policies.
- To export data to Event Hubs, you must have Write permissions on the Event Hubs policy.
- To export to a Log Analytics workspace: 
    - If it *has the SecurityCenterFree solution*, you must have a minimum of Read permissions for the workspace solution: `Microsoft.OperationsManagement/solutions/read`.
    - If it *doesn't have the SecurityCenterFree solution*, you must have write permissions for the workspace solution: `Microsoft.OperationsManagement/solutions/action`.
    
    Learn more about [Azure Monitor and Log Analytics workspace solutions](/previous-versions/azure/azure-monitor/insights/solutions).

### Set up continuous export by using the REST API

You can set up and manage continuous export by using the Microsoft Defender for Cloud [automations API](/rest/api/defenderforcloud/automations). Use this API to create or update rules for exporting to any of the following destinations:

- Azure Event Hubs
- Log Analytics workspace
- Azure Logic Apps

You also can send the data to an [event hub or Log Analytics workspace in a different tenant](benefits-of-continuous-export.md#export-data-to-an-event-hub-or-log-analytics-workspace-in-another-tenant).

> [!NOTE]
> If you’re configuring continuous export by using the REST API, always include the parent with the findings.

Here are some examples of options that you can use only in the API:

- **Greater volume**: You can create multiple export configurations on a single subscription by using the API. The **Continuous Export** page in the Azure portal supports only one export configuration per subscription.

- **Additional features**: The API offers parameters that aren't shown in the Azure portal. For example, you can add tags to your automation resource and define your export based on a wider set of alert and recommendation properties than the ones that are offered on the **Continuous export** page in the Azure portal.

- **Focused scope**: The API offers you a more granular level for the scope of your export configurations. When you define an export by using the API, you can define it at the resource group level. If you're using the **Continuous export** page in the Azure portal, you must define it at the subscription level.

    > [!TIP]
    > These API-only options are not shown in the Azure portal. If you use them, a banner informs you that other configurations exist.

## Next step

> [!div class="nextstepaction"]
> [Set up continuous export with Azure Policy](continuous-export-azure-policy.md)
