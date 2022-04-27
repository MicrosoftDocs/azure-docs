---
title: Create Dynatrace application - Azure partner solutions
description: This article describes how to use the Azure portal to create an instance of Dynatrace.
ms.topic: quickstart
ms.collection: na
ms.service: partner-services
author: flang-msft
ms.author: franlanglois
ms.date: 05/12/2022
ms.custom: mode-other
---

# QuickStart: Get started with Dynatrace

In this quickstart, you'll use the Azure portal to integrate an instance of Dynatrace with your Azure solutions.

## Prerequisites

- Subscription owner - The Dynatrace integration with Azure can only be created by users who have _Owner_ access on the Azure subscription. [Confirm that you have the appropriate access](../../role-based-access-control/check-access.md) before starting the setup.
- Single sign-on app - The ability to automatically navigate between the Azure portal and Dynatrace Cloud is enabled via single sign-on (SSO). This option is automatically enabled and turned on for all Azure users.

## Find offer

Use the Azure portal to find the Dynatrace application.

1. In a web browser, go to the [Azure portal](https://portal.azure.com/) and sign in.

1. If you've visited the **Marketplace** in a recent session, select the icon from the available options. Otherwise, search for _Marketplace_.

1. Search for _Dynatrace_ and select **Dynatracesearch (Dynatrace Cloud)** from the available offerings.

1. Select **Set up + subscribe**.

## Create resource

After you've selected the offer for Dynatrace, you're ready to set up the application.

1. On the **Create Dynatrace Resource** basics page, provide the following values.

    | Property | Description |
    | ---- | ---- |
    | **Subscription** | From the drop-down, select an Azure subscription where you have owner access. |
    | **Resource group** | Specify whether you want to create a new resource group or use an existing resource group. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview](../../azure-resource-manager/management/overview.md). |
    | **Dynatrace account name** | Provide the name for the Dynatrace account you want to create |
    | **Region** | Select the region you want to deploy to. |
    | **Pricing Plan** | **Pay as you go**. |
    | **Price** | Specified based on the selected Dynatrace plan. |

   When you've finished, select **Next: Logs and Metrics**.

1. On **Logs & metrics**, specify which logs to send to Dynatrace.

   There are two types of logs that can be emitted from Azure to Dynatrace.

   **Subscription logs** provide insights into the operations on each Azure resource in the subscription from the management plane.

   **Azure resource logs** provide insights into operations that happen within the data plane.

1. After the deployment is finished, select **Go to resource** to view the deployed resource.

## Next steps

- [Manage the Dynatrace resource](dynatrace-manage.md)
