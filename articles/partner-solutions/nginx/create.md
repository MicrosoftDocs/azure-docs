---
title: Create an NGINXaaS resource
description: In this quickstart, learn how to use the Azure portal to create an instance of NGINXaaS from Azure Marketplace.
ms.topic: quickstart
ms.date: 05/09/2025
ms.custom: references_regions
#customer intent: As a developer, I want to implement NGINX as a service to simplify NGINX management.
---

# QuickStart: Create an NGINXaaS resource – An Azure Native ISV Service

In this quickstart, use Azure Marketplace to create an instance of NGINXaaS.

## Prerequisites

[!INCLUDE [Prerequisites](../includes/create-prerequisites.md)]

## Create a resource

1. From the Azure portal menu's global search bar, search for *marketplace*. Select **Marketplace** from the Services results.

1. In the Marketplace, search for *F5 NGINX as a Service*. In the results, subscribe to NGINX as a Service.

1. In **Create NGINXaaS**, in the **Basics** tab, select a Subscription and resource group. You can create a resource group, if necessary.

   :::image type="content" source="media/nginx-create/nginx-create.png" alt-text="Screenshot of basics pane of the NGINXaaS create experience.":::

1. Provide a name for your NGINXaaS instance and select a region. Not all marketplace plans are available for all regions.

1. Use the link to select a pricing plan.

1. Enter a valid address for **Support Contact**.

1. Select **Next** to view the **Networking** tab.

## Networking

In the **Networking** tab:

1. Specify a virtual network and subnet or accept the option to create new ones.

1. Select **I allow NGINX service provider to access the above virtual network for deployment.**

1. For **IP address type**, select **Public Only** or **Private Only**.

1. Select **Review + create**.

## Review and create

The **Review + Create** tab runs validations. Review the selections made in the **Basics**, **Networking**, and optionally **Tags** tabs. You can also review the NGINXaaS and Azure Marketplace terms and conditions.  

After you review all the information, select **Create**.

Deployment can take some time.

## Deployment completed

After the Azure portal finishes creating the resource, select **Go to Resource** to view your new NGINXaaS resource.

Select **Overview** in the left menu to see information on the deployed resources.

## Next step

> [!div class="nextstepaction"]
> [Manage the NGINXaaS resource](manage.md)
