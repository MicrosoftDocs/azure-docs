---
title: Rewrite URL and query string with Azure Application Gateway - Azure portal
description: Learn how to use the Azure portal to configure an Azure Application Gateway to rewrite URL and query string
services: application-gateway
author: surajmb
ms.service: application-gateway
ms.topic: how-to
ms.date: 7/16/2020
ms.author: surmb
---

# Rewrite URL with Azure Application Gateway - Azure portal (Preview)

This article describes how to use the Azure portal to configure an [Application Gateway v2 SKU](application-gateway-autoscaling-zone-redundant.md) instance to rewrite URL.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Before you begin

You need to have an Application Gateway v2 SKU instance to complete the steps in this article. Rewriting URL isn't supported in the v1 SKU. If you don't have the v2 SKU, create an [Application Gateway v2 SKU](tutorial-autoscale-ps.md) instance before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account.

## Configure URL rewrite

In the below example whenever the request URL contains */article*, the URL path and URL query string are rewritten

`contoso.com/article/123/fabrikam` -> `contoso.com/article.aspx?id=123&title=fabrikam`

1. Select **All resources**, and then select your application gateway.

2. Select **Rewrites** in the left pane.

3. Select **Rewrite set**:

    :::image type="content" source="./media/rewrite-url-portal/rewrite-url-portal-1.png" alt-text="Add rewrite set":::

4. Provide a name for the rewrite set and associate it with a routing rule:

    * Enter the name for the rewrite set in the **Name** box.
    
    * Select one or more of the rules listed in the **Associated routing rules** list. This is used to associate the rewrite configuration to the source listener via the routing rule. You can select only those routing rules that haven't been associated with other rewrite sets. The rules that have already been associated with other rewrite sets are greyed out.
    
    * Select **Next**.
    
    :::image type="content" source="./media/rewrite-url-portal/rewrite-url-portal-2.png" alt-text="Associate to a rule":::

5. Create a rewrite rule:

    * Select **Add rewrite rule**.
    
    :::image type="content" source="./media/rewrite-url-portal/rewrite-url-portal-3.png" alt-text="Add rewrite rule":::
    
    * Enter a name for the rewrite rule in the **Rewrite rule name** box. Enter a number in the **Rule sequence** box.

6. In this example, we'll rewrite URL path and URL query string only when path contains */article*. To do this, add a condition to evaluate whether the URL path contains */article*

    * Select **Add condition** and then select the box containing the **If** instructions to expand it.
    
    * Since in this example we want       to check the pattern */article* in the URL path, in the **Type of variable to check** list, select **Server variable**.
    
    * In the **Server variable** list, select uri_path
    
    * Under **Case-sensitive**, select **No**.
    
    * In the **Operator** list, select **equal (=)**.
    
    * Enter a regular expression pattern. In this example, we'll use the pattern `.*article/(.*)/(.*)`
    
        **Note**: ( ) is used to capture the substring for later use in composing the expression for rewriting the URL path. For more information, see [here](rewrite-http-headers-url#capturing).

    * Select **OK**.

    :::image type="content" source="./media/rewrite-url-portal/rewrite-url-portal-4.png" alt-text="Condition":::

 

7. Add an action to rewrite the URL and URL path

   * In the **Rewrite type** list, select **URL**.

   * In the **Action type** list, select **Set**.

   * Under **Components**, select **Both URL path and URL query string**

   * In the **URL path value**, enter the new value of the path. In this example, we will use **/article.aspx** 

    * In the **URL query       string value**, enter the new value of the URL query striong. In this       example, we will use **id={var_uri_path_1}&title={var_uri_path_2}**
    
    `{var_uri_path_1}` and `{var_uri_path_1}` are used to fetch the substrings captured while evaluating the   condition in this expression `.*article/(.*)/(.*)`
    
    * Select **OK**.

    :::image type="content" source="./media/rewrite-url-portal/rewrite-url-portal-5.png" alt-text="Action":::

8. Click **Create** to create the rewrite set.

9. Verify that the new rewrite set appears in the list of rewrite sets

    :::image type="content" source="./media/rewrite-url-portal/rewrite-url-portal-6.png" alt-text="Add rewrite rule":::

## Verify URL rewrite through access logs

Observe the below fields in access logs to verify if the URL rewrite happened as per your expectation.

* **originalRequestUriWithArgs**: This field contains the original request URL
* **requestUri**: This field contains the URL after the rewrite operation on Application Gateway

For more information on all the fields in the access logs, see [here](application-gateway-diagnostics.md#for-application-gateway-and-waf-v2-sku:).

##  Next steps

To learn more about how to set up rewrites for some common use cases, see [common rewrite scenarios](rewrite-http-headers.md).