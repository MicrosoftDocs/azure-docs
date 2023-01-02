---
title: Create a Logz.io resource
description: Quickstart article that describes how to create a Logz.io resource in Azure.
ms.topic: conceptual
ms.date: 10/25/2021
author: flang-msft
ms.author: franlanglois
ms.custom: references_regions
---

# Quickstart: Create a Logz.io resource in Azure portal

This article describes how to enable Azure integration of the Logz.io software as a service (SaaS). You use Logz.io to monitor the health and performance of your Azure environment.

## Prerequisites

- **Subscription owner**: To set up Logz.io, you must be assigned the [Owner role](../../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles) in the Azure subscription. Before you begin this integration, [check your access](../../role-based-access-control/check-access.md).
- **Register resource provider**: If `Microsoft.Insights` isn't already registered for your subscription, register it. For more information, see [Register resource provider](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

## Find offer

Use the Azure portal to find Logz.io in Azure Marketplace.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you've visited the **Marketplace** in a recent session, select the icon from the available options. Otherwise, search for _Marketplace_.

    :::image type="content" source="./media/create/marketplace.png" alt-text="Azure Marketplace.":::

1. From Azure Marketplace, search for _Logz.io_.
1. Select **Logz.io - Observability based on ELK & Prometheus**.
1. Select the **Set up + subscribe** button. The **Create new Logz.io account** window opens.

    :::image type="content" source="./media/create/logzio-app.png" alt-text="Logz.io Observability application.":::

## Create new Logz.io account

On the **Basics** tab of the **Create a Logz.io account** screen, input the following values:

| Property | Description |
| ---- | ---- |
| **Subscription** | From the drop-down menu, select the Azure subscription where you have owner access. |
| **Resource group** | Specify whether you want to create a new resource group or use an existing resource group. A [resource group](../../azure-resource-manager/management/overview.md#resource-groups) is a container that holds related resources for an Azure solution. |
| **Logz account name** | Provide the name for the Logz.io account you want to create. |
| **Location** | Select **West US 2** or **West Europe**. Logz.io supports only these Azure regions. |
| **Pricing Plan** | Select from the list of available Logz.io plans. |
| **Billing Term** | **Monthly** is the default. |
| **Price** | Specified based on the selected Logz.io plan. |

:::image type="content" source="./media/create/basics.png" alt-text="Create a Logz.io account.":::

After you input the values, select the **Next: Logs and metrics** button.

## Configure logs

On the **Logs and Metrics** tab, specify which Azure resources will send logs and metrics to Logz.io.

There are two types of logs that can be sent from Azure to Logz.io:

- **Subscription level logs**: Provide insight into the operations on each Azure resource in the subscription from the outside (the management plane) and updates on **Service Health** events. Use the **Activity log**, to determine what, who, and when for any write operations (PUT, POST, DELETE) taken on the resources in your subscription. There's a single **Activity log** for each Azure subscription.
- **Azure resource logs**: Provide insight into operations that were run within an Azure resource (the data plane). For example, getting a secret from a key vault or making a request to a database. The content of resource logs varies by the Azure service and resource type.

Subscription level logs can be sent to Logz.io by checking the box titled **Send subscription level logs**. If this box isn't checked, none of the subscription level logs are sent to Logz.io.

Azure resource logs can be sent to Logz.io by checking the box titled **Send Azure resource logs for all defined resources**. The types of Azure resource logs are listed in [Azure Monitor Resource Log categories](../../azure-monitor/essentials/resource-logs-categories.md). To filter the specific set of Azure resources sending logs to Logz.io, you can use Azure resource tags.

Tag rules for sending logs are as follows:

- By default, logs are collected for all resources.
- Azure resources with _Include_ tags send logs to Logz.io.
- Azure resources with _Exclude_ tags **do not** send logs to Logz.io.
- If there's a conflict between inclusion and exclusion rules, exclusion takes a priority.

:::image type="content" source="./media/create/logs.png" alt-text="Set up logs and metrics.":::

After you configure the logs and metrics, select the **Next: Tags** button.

## Add custom tags

You can specify custom tags for the new Logz.io resource by adding key value pairs.

Each key value pair includes a **Name** and **Value**:

| Property | Description |
| ---- | ---- |
| **Name** | Name of the tag corresponding to the Azure Logz.io resource. |
| **Value** | Value of the tag corresponding to the Azure Logz.io resource. |

:::image type="content" source="./media/create/tags.png" alt-text="Add custom tags.":::

After you add tabs, select the **Next: Single sign-on** button.

## Configure single sign-on

Single sign-on (SSO) is an optional feature:

- To opt out of SSO, skip this step.
- To opt in to SSO, see [Set up Logz.io single sign-on](setup-sso.md).

After Azure AD is configured, from the **Single sign-on** tab, select your Logz.io SSO application.

:::image type="content" source="./media/create/sso.png" alt-text="Configure single sign-on.":::

Select the **Next: Review + create** button to navigate to the final step for resource creation.

## Create resource

On the **Review + create** page, all validations are run. You can review all the selections made in the **Basics**, **Logs and metrics**, **Tags** and **Single sign-on** tabs. You can also review the Logz.io and Azure Marketplace terms and conditions.

Review all the information to verify it's correct. To begin the deployment, select the **Create** button.

:::image type="content" source="./media/create/create-resource.png" alt-text="Review and create account.":::

After a successful deployment, you can view the deployed Logz.io resource by selecting the **Go to Resource** button.

## Next steps

- Learn how to [manage](manage.md) your Logz.io integration.
- To resolve problems with the integration, see [troubleshooting](troubleshoot.md).
