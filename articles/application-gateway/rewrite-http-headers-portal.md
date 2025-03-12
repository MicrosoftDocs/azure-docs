---
title: Rewrite HTTP request and response headers in portal - Azure Application Gateway
description: Use the Azure portal to configure an application gateway to rewrite the HTTP headers in the requests and responses that pass through the gateway.
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 11/13/2019
ms.author: greglin
ms.custom: mvc
---

# Rewrite HTTP request and response headers with Azure Application Gateway - Azure portal

This article describes how to use the Azure portal to configure an [Azure Application Gateway v2 SKU](./application-gateway-autoscaling-zone-redundant.md) instance to rewrite the HTTP headers in requests and responses.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Before you begin

You need to have an Application Gateway v2 SKU instance to finish the steps in this article. Rewriting headers isn't supported in the v1 SKU. If you don't have the v2 SKU, create an [Application Gateway v2 SKU](./tutorial-autoscale-ps.md) instance before you begin.

## Create required objects

To configure HTTP header rewrite, follow these steps.

1. Create the objects that are required for an HTTP header rewrite:

   - **Rewrite action**: Used to specify the request and request header fields that you intend to rewrite and the new value for the headers. You can associate one or more rewrite conditions with a rewrite action.
   - **Rewrite condition**: An optional configuration. Rewrite conditions evaluate the content of HTTP(S) requests and responses. The rewrite action occurs if the HTTP(S) request or response matches the rewrite condition.

     If you associate more than one condition with an action, the action occurs only when all the conditions are met. In other words, the operation is a logical `AND` operation.

   - **Rewrite rule**: Contains multiple rewrite action/rewrite condition combinations.
   - **Rule sequence**: Helps determine the order in which the rewrite rules execute. This configuration is helpful when you have multiple rewrite rules in a rewrite set. A rewrite rule that has a lower rule sequence value runs first. If you assign the same rule sequence value to two rewrite rules, the order of execution is nondeterministic.
   - **Rewrite set**: Contains multiple rewrite rules that will be associated with a request routing rule.

1. Attach the rewrite set to a routing rule. The rewrite configuration is attached to the source listener via the routing rule.

   - When you use a basic routing rule, the header rewrite configuration is associated with a source listener and is a global header rewrite.
   - When you use a path-based routing rule, the header rewrite configuration is defined on the URL path map. In that case, it applies only to the specific path area of a site.

You can create multiple HTTP header rewrite sets and apply each rewrite set to multiple listeners. But you can apply only one rewrite set to a specific listener.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account.

## Configure a header rewrite

In this example, we modify a redirection URL by rewriting the location header in the HTTP response sent by a backend application.

1. Select **All resources**, and then select your application gateway.

1. In the service pane, select **Rewrites**.

1. Select **Rewrite set**.

   ![Screenshot that shows adding a rewrite set.](media/rewrite-http-headers-portal/add-rewrite-set.png)

1. Provide a name for the rewrite set and associate it with a routing rule:

   1. In the **Name** box, enter the name for the rewrite set.
   1. In the **Associated routing rules** list, select one or more rules. Select only rules not already associated with other rewrite sets. Rules already associated with other rewrite sets are dimmed.
   1. Select **Next**.
   
     ![Screenshot that shows adding a name and association.](media/rewrite-http-headers-portal/name-and-association.png)

1. Create a rewrite rule:

   1. Select **Add rewrite rule**.

      ![Screenshot that shows adding a rewrite rule.](media/rewrite-http-headers-portal/add-rewrite-rule.png)

   1. In the **Rewrite rule name** box, enter a name for the rewrite rule. In the **Rule sequence** box, enter a number.

      ![Screenshot that shows adding a rewrite rule name.](media/rewrite-http-headers-portal/rule-name.png)

1. In this example, we rewrite the location header only when it contains a reference to `azurewebsites.net`. To do this step, add a condition to evaluate whether the location header in the response contains `azurewebsites.net`:

   1. Select **Add condition**, and then select the box containing the **If** instructions to expand it.

      ![Screenshot that shows adding a condition.](media/rewrite-http-headers-portal/add-condition.png)

   1. In the **Type of variable to check** list, select **HTTP header**.
   1. In the **Header type** list, select **Response**.
   1. Under **Header name**, select **Common header**. In this example, we're evaluating the location header, which is a common header.
   1. In the **Common header** list, select **Location**.
   1. Under **Case-sensitive**, select **No**.
   1. In the **Operator** list, select **equal (=)**.
   1. Enter a regular expression pattern. In this example, we use the pattern `(https?):\/\/.*azurewebsites.net(.*)$`.
   1. Select **OK**.

     ![Screenshot that shows configuring an If condition.](media/rewrite-http-headers-portal/condition.png)

1. Add an action to rewrite the location header:

   1. In the **Action type** list, select **Set**.
   1. In the **Header type** list, select **Response**.
   1. Under **Header name**, select **Common header**.
   1. In the **Common header** list, select **Location**.
   1. Enter the header value. In this example, we use `{http_resp_Location_1}://contoso.com{http_resp_Location_2}` as the header value. This value replaces `azurewebsites.net` with `contoso.com` in the location header.
   1. Select **OK**.

     ![Screenshot that shows adding an action.](media/rewrite-http-headers-portal/action.png)

1. Select **Create** to create the rewrite set.

   ![Screenshot that shows selecting Create.](media/rewrite-http-headers-portal/create.png)

1. The **Rewrites** pane opens. Verify that the rewrite set you created is in the list of rewrite sets.

   ![Screenshot that shows rewriting a set view.](media/rewrite-http-headers-portal/rewrite-set-list.png)

## Related content

To learn more about how to set up some common use cases, see [Common header rewrite scenarios](./rewrite-http-headers-url.md).