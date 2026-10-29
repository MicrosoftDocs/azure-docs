---
title: 'Tutorial: Configure header-based routing with the Azure portal'
titleSuffix: Azure Application Gateway
description: Learn how to configure Application Gateway Advanced Rules in the Azure portal to route traffic based on HTTP headers.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: tutorial
ms.date: 09/08/2026
ms.author: mbender
ms.custom: sfi-image-nochange
#Customer intent: As an IT administrator, I want to use the Azure portal to set up an application gateway with advanced routing rule, so I can efficiently route traffic based on the HTTP request headers.
---

# Tutorial: Configure header-based routing with Application Gateway Advanced Rules in the Azure portal

[!INCLUDE [preview-advanced-routing-rules](../networking/includes/azure-application-gateway/preview-advanced-routing-rules.md)]

In this tutorial, you use the Azure portal to configure header-based routing through [Azure Application Gateway Advanced Rules](advanced-rules.md). You create routing rules that direct traffic to different backend pools based on custom HTTP headers. This tutorial uses an existing Application Gateway with a basic routing rule, a listener, a default backend pool, and default backend settings.


## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure account, you can [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account).
- An [application gateway with a basic routing rule](quick-create-portal.md#create-an-application-gateway), a listener, a default backend pool, and default backend settings.
- A second backend pool and backend settings for the application version that receives requests with the `X-App-Version: v2` header.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create an application gateway

> [!NOTE]
> The Azure portal Create Application Gateway experience currently doesn't support configuration of an Advanced Routing Rule. For convenience, you can update a Basic rule to an Advanced Routing Rule after the gateway is deployed.

Follow [Quickstart: Direct web traffic with Azure Application Gateway - Azure portal](quick-create-portal.md#create-an-application-gateway) to deploy an application gateway with a basic rule. Before you continue, add a second backend pool and backend settings for the v2 application target.

## Configure Advanced Routing rule

Using your existing listener and its port number with an Advanced rule, update the existing Basic rule to an Advanced rule.

1. Go to the application gateway resource you created. You can also choose an existing resource.
1. Open **Rules** from the left menu.
1. Select the basic rule that you want to update to an advanced rule.

### Listener tab

When you select an existing Basic listener, you see that the fields under the tab are prefilled. If you create a new Advanced Rule, enter the following details:

* Rule name - Enter a name for the rule.
* Rule Priority - Enter a numeric value. The system processes rules with lower values first.

 ### Routing tab

1. For **Rule type**, select **Advanced** to update the rule from basic.

	:::image type="content" source="./media/configure-advanced-routing-rule/rule-type-selection.png" alt-text="Screenshot of an Application Gateway routing rule in the Azure portal with Advanced selected as the rule type.":::

1. In the **Advanced rule** section, configure these values:

	| **Setting** | **Value** |
	|---|---|
	| Advanced rule name | Use the name `V2-app-routing`. |
	| Advanced rule priority | Specify an integer value that determines evaluation order. Lower values are evaluated first. |

	> [!NOTE]
	> The **Advanced Rule Priority** value is different from the primary **Rule Priority** value you filled earlier. The Advanced Rule priority value applies to each nested rule within an [Advanced Routing Map](advanced-rules.md#architecture-overview).

1. Under **Conditions**, select **+ Add conditions** to configure one or multiple conditions under a conditions set using these values:

	| **Setting** | **Value** |
	|---|---|
	| Condition set name | Use `V2-app-condition`. |
	| Condition type | Select **HTTP header**. |
	| Header type | Select **Custom**. |
	| Custom header | Enter `X-App-Version`. |
	| Match type | Select **Static** for an exact value match. |
	| Value | Enter `v2`. |

1. Select **Add Conditions**. This step doesn't save the configuration yet.

	:::image type="content" source="./media/configure-advanced-routing-rule/configure-condition-set.png" alt-text="Screenshot of an advanced routing condition set in the Azure portal matching the custom X-App-Version header to the value v2.":::

1. Under **Targets**, select **+ Add Targets**, and configure these values:

	| **Setting** | **Value** |
	|---|---|
	| Target type | Select **Backend pool**. |
	| Backend pool | Select the backend pool that you created for the v2 version of the application. |
	| Backend settings | Select the backend HTTP settings that you created for the v2 application. |

	:::image type="content" source="./media/configure-advanced-routing-rule/configure-target-pools.png" alt-text="Screenshot of Configure target pools in the Azure portal, showing the app-service backend pool and besetting-443 backend settings.":::

	Now, let's complete the default routing configuration. Any incoming request that doesn't include custom header "X-App-Version:v2" must be routed to the default backend pool.

1. In **Default targets**, verify that **Target** and **Backend Settings** contain the values from the basic rule.

	:::image type="content" source="./media/configure-advanced-routing-rule/configuration-summary.png" alt-text="Screenshot of an advanced routing configuration summary in the Azure portal showing the v2 conditional target and the default backend target.":::

1. Select **Review**.

### Review tab

This page is read-only and provides a summary of the configurations you completed. You can review and make any corrections if necessary by selecting the **Previous** button.

1. Review the advanced rule, condition set, conditional backend target, and default backend target. Select **Previous** to correct any values.
1. Select **Save**.

	:::image type="content" source="./media/configure-advanced-routing-rule/review-configurations.png" alt-text="Screenshot of Azure portal review tab showing the completed advanced routing rule, condition, and backend target configuration.":::

## Test the Application Gateway

Test the advanced routing rule by using cURL to send three HTTP requests to the Application Gateway's public IP address: one without the `X-App-Version` header, one with `X-App-Version: v2`, and one with a different value.

### Get the Application Gateway IP address
1. In the left menu, select **Overview**.
1. Copy the Frontend public IP address.

### Test with cURL
```cURL
# Test request without the header (routes to default pool)
curl http://<FRONTEND-IP>/

# Test request with custom header (routes to V2 Backend Pool)
curl -H "X-App-Version: v2" http://<FRONTEND-IP>/

# Test request with different header value (routes to default pool)
curl -H "X-App-Version: none" http://<FRONTEND-IP>/
```

## Clean up resources
When you no longer need the resources, delete the resource group and all related resources:

1. In the Azure portal, search for and select **Resource groups**.
1. Select the resource group you created for the deployment of the gateway in this tutorial.
1. On the resource group page, select **Delete resource group**.
1. Enter the resource group name for confirmation and then select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Advanced routing rules on Azure Application Gateway](advanced-rules.md)