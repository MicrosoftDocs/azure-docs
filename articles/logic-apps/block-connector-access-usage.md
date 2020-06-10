---
title: Block specific connectors in logic app workflows
description: How to prevent access and usage for specific connectors in Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: deli, logicappspm
ms.topic: conceptual
ms.date: 06/11/2020
---

# Block access and usage for specific connectors in Azure Logic Apps

If your organization needs to prohibit access and usage for specific connectors in logic app workflows, you can use [Azure Policy](../governance/policy/overview.md) to create an [Azure Policy definition](../governance/policy/overview.md#policy-definition) that blocks access to those connectors.

This topic shows how to create a policy definition in the Azure portal, but you can also create policy definitions in these ways:

* [Azure PowerShell]
* [Azure CLI]
* [Azure Resource Manager template]

## Prerequisites

If you don't have an Azure subscription, [create a free Azure account](https://azure.microsoft.com/free/) before you start.

## Create policy definition

1. Sign in to the [Azure portal](https://portal.azure.com). In the portal search box, enter `policy`, and select **Policy**.

   ![In Azure portal, find and select "policy"](./media/block-connector-access-usage/find-select-azure-policy.png)

1. On the **Policy** menu, select **Definitions** > **+ Policy definition**.

   ![Select "Definitions" > "+ Policy Definition"](./media/block-connector-access-usage/add-new-policy-definition.png)



