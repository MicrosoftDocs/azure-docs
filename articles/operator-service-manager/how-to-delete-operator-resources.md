---
title: How to delete operator resources
description: Learn how to delete operator services
author: sherrygonz
ms.author: sherryg
ms.date: 09/11/2023
ms.topic: how-to
ms.service: azure-operator-service-manager
---

# Delete operator resources in Azure Operator Service Manager

In this how-to guide, you learn how to delete operator resources that include Site Network Service (SNS), Configuration Group Values and Sites. The order in which operator resources are deleted is critical. You should start by deleting the Site Network Service (SNS) followed by the Configuration Group Values, then lastly the Sites. This process must be followed before deleting any of the Publisher or Designer resources referenced by the Operator.

## Prerequisites

- You must already have a site, in your deployment, that you want to delete.
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create the site(s).

## Delete Site Network Service

1. Search for the Site Network Service (SNS) within Azure portal. 
1. Select the Site Network Service (SNS) within the Azure portal you wish to delete.

1. Under the Overview section, take note of the *Site* and the *resource group* within the **Properties**.

1. Under the **Overview** section, take note of the *Configuration Group Value* and the *resource group* within **Desired configuration**.

1. Once you have listed the resources, select **Delete** against the Site Network Service (SNS).

1. Follow the prompts to confirm and complete the deletion.

    :::image type="content" source="media/how-to-delete-operator-resource-confirm-prompt.png" alt-text="Diagram showing the Confirmation prompt with a warning message.":::

> [!NOTE]
> Deleting a Site Network Service (SNS) can be time consuming. It it important to inform the user in advance that deletions may take between 5 minutes to over an hour.

### Troubleshoot deletion errors

While deleting a Site Network Service (SNS) is a straightforward task, here are some troubleshooting tips to consider issues are encountered:

1. Check the error message: If the error message mentions "nested resources," delete the Site Network Service (SNS) again.
1. Examine the managed resource group: To track the progress of the deletion, navigate to the managed resource group and follow the same instructions as outlined in [Create site network service in Azure Operator Service Manager](how-to-create-site-network-service.md). Eventually, all resources associated with the Site Network Service (SNS) become deleted.

## Delete Configuration Group Values

1. Navigate to the Azure portal and search for **Resource Group** in which the Configuration Group Value was deployed.
   
1. Select the specific **Configuration Group Value(s)** you wish to delete. 
1. Select **Delete**.

1. Follow the prompts to confirm and complete the deletion.

## Delete Sites

1. Navigate to the Azure portal and search for the Resource Group in which the Site was deployed.
1. Select the specific **Site** you wish to delete.
1. Select **Delete**.

1. Follow the prompts to confirm and complete the deletion.