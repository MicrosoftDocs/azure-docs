---
title: How to set or edit Azure API Management policies | Microsoft Docs
description: Learn how to use the Azure portal to set or edit policies in an Azure API Management instance. Policies are defined in XML documents that contain a sequence of statements that are run sequentially on the request or response of an API.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 03/01/2022
ms.author: danlep
---

# How to set or edit Azure API Management policies

This article shows you how to configure and manage policies in your API Management instance using the Azure portal. Each policy definition is an XML document that describes a sequence of inbound and outbound statements. This series of policy statements is run in order for each API request and response.

The policy editor in the portal provides guided forms for API publishers to select and configure common policies. API publishers who more familiar with API Management policies can also edit the XML directly in the policy code editor.

More information about policies:

* For an overview, see [Policies in Azure API Management](api-management-howto-policies.md).
* For a complete list, see [API Management policy reference](api-management-policies.md).
* For policy XML examples, see [API Management policy samples](./policies/index.md). 

## Prerequisites

If you don't already have an API Management instance and a backend API, see:

- [Create an Azure API Management instance](get-started-create-service-instance.md)
- [Import and publish an API](import-and-publish.md)

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Configure policy for an API

The following example shows how to add an inbound policy scoped to an API to filter IP addresses. API Management provides a guided form-based editors to simplify configuring many policies, or you can add or edit XML directly in a code editor. 

> [!NOTE]
> You can configure policies at other [scopes](api-management-howto-policies.md#policy-scopes), such as for all APIs, a product, or a single API operation. See [Configure scope](#configure-scope), later in this article, for other examples.

To add a policy:

# [Form](#tab/form)

1. In the left navigation of your API Management instance, select **APIs**.
1. Select an API that you previously imported.
1. Select the **Design** tab.
1. To apply the policy to all operations, select **All operations**.
1. In the **Inbound processing** section, select **+ Add policy**.


    :::image type="content" source="media/set-edit-policies/form-editor.png" alt-text="Add policy in API Management":::

1. In **Add inbound policy**, select a policy to add. For example, select **Filter IP addresses**.
    
    :::image type="content" source="media/set-edit-policies/filter-ip-addresses.png" alt-text="Filter IP addresses policy":::

    > [!TIP]
    > * Policies shown are scoped to the policy section you're configuring - in this case, for inbound processing.
    > * If you don't see a policy you want, select the **Other policies** tile. This will open the XML code editor.
1. Select **Allowed IPs** > **+ Add IP filter** and add the first and last IP addresses of a range of incoming addresses that are allowed to make API requests. Add other IP address ranges, if needed.

    :::image type="content" source="media/set-edit-policies/configure-ip-filter.png" alt-text="Configure allowed IP addresses":::
1. Select **Save** to propagate changes to the API Management gateway immediately.

    The **ip-filter** policy now appears in the **Inbound processing** section.

# [Code](#tab/editor)

1. In the left navigation of your API Management instance, select **APIs**.
1. Select an API that you previously imported.
1. Select the **Design** tab.
1. To apply the policy to all operations, select **All operations**.
1. In the **Inbound processing** section, select the **</>** (code editor) icon.


    :::image type="content" source="media/set-edit-policies/code-editor.png" alt-text="Add policy in API Management":::

1. To see available policy XML code snippets, select **Show snippets**. For example, select **Restrict caller IPs**.

    :::image type="content" source="media/set-edit-policies/insert-policy-snippet.png" alt-text="":::

1. Paste or enter the desired policy code snippet into one of the appropriate blocks, and complete the policy configuration. Select **Save**. 
    ```xml
    <policies>
        <inbound>
            <base />
            <ip-filter action="allow">
                <address-range from="10.100.7.0" to="10.100.127.0" />
            </ip-filter>
        </inbound>
        <backend>
            <base />
        </backend>
        <outbound>
            <base />
        </outbound>
        <on-error>
            <base />
        </on-error>
    </policies>
    ```
1. Select **Save** to propagate changes to the API Management gateway immediately.
    
    The **ip-filter** policy now appears in the **Inbound processing** section.
---
## Configure scope


To see the policies in the current scope in the policy editor, click **Recalculate effective policy**.

### Global scope

Global scope is configured for **All APIs** in your API Management instance.

1. In the left navigation of your API Management instance, select **APIs**.
1. Select **All APIs**.
1. Select the **Design** tab.

    :::image type="content" source="media/set-edit-policies/product-scope-policy.png" alt-text="Configure policy at product scope":::

1. In the **Inbound processing** or **Outbound processing** section, select **+ Add policy** to use a form-based policy editor, or select the **</>** (code editor) icon to add and edit XML directly. 

    > [!NOTE]
    > The **Backend** policy section can only contain the **forward-request** policy element.
6. Select **Save** to propagate changes to the API Management gateway immediately.

### Product scope

Product scope is configured for a selected product.

1. In the left menu, select **Products**, and then select a product to which you want to apply policies.
1. In the product window, select **Policies**.

    :::image type="content" source="media/set-edit-policies/global-scope-policy.png" alt-text="Configure policy at global scope":::
1. In the **Inbound processing** or **Outbound processing** section, select **+ Add policy** to use a form-based policy editor, or select the **</>** (code editor) icon to add and edit XML directly. 

    > [!NOTE]
    > The **Backend** policy section can only contain the **forward-request** policy element.
6. Select **Save** to propagate changes to the API Management gateway immediately.

### API scope

API scope is configured for **All Operations** of the selected API.

1. Select the **API** you want to apply policies to.

    ![API scope](./media/api-management-howto-policies/api-scope.png)

2. Select **All operations**
3. Click the triangle icon.
4. Select **Code editor**.
5. Add or edit policies.
6. Press **Save**. 

### Operation scope 

Operation scope is configured for the selected operation.

1. Select an **API**.
2. Select the operation you want to apply policies to.

    ![Operation scope](./media/api-management-howto-policies/operation-scope.png)

3. Click the triangle icon.
4. Select **Code editor**.
5. Add or edit policies.
6. Press **Save**. 

## Next steps

See the following related topics:

+ [Transform APIs](transform-api.md)
+ [Policy Reference](./api-management-policies.md) for a full list of policy statements and their settings
+ [Policy samples](./policy-reference.md)



[ADD/INCORP FROM OVERVIEW]
You can edit the XML directly in the definition window, which also provides:
* A list of statements to the right.
* Statements applicable to the current scope enabled and highlighted.

Clicking an enabled statement will add the appropriate XML at the cursor in the definition view. 

> [!NOTE]
> If the policy that you want to add is not enabled, ensure that you are in the correct scope for that policy. Each policy statement is designed for use in certain scopes and policy sections. To review the policy sections and scopes for a policy, check the **Usage** section in the [Policy Reference][Policy Reference].
