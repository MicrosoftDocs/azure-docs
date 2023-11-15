---
title: How to set or edit Azure API Management policies | Microsoft Docs
description: Configure policies at different scopes in an Azure API Management instance using the policy editor in the Azure portal.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 10/18/2023
ms.author: danlep
---

# How to set or edit Azure API Management policies

This article shows you how to configure policies in your API Management instance by editing policy definitions in the Azure portal. Each policy definition is an XML document that describes a sequence of inbound and outbound statements that run sequentially on an API request and response.

The policy editor in the portal provides guided forms for API publishers to add and edit policies in policy definitions. You can also edit the XML directly in the policy code editor.

More information about policies:

* [Policy overview](api-management-howto-policies.md)
* [Policy reference](api-management-policies.md) for a full list of policy statements and their settings
* [Policy snippets repo](https://github.com/Azure/api-management-policy-snippets)

## Prerequisites

If you don't already have an API Management instance and a backend API, see:

- [Create an Azure API Management instance](get-started-create-service-instance.md)
- [Import and publish an API](import-and-publish.md)

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Configure policy in the portal

The following example shows how to configure a policy using two options in the policy editor in the portal:

* A guided form-based editor to simplify configuring many policies
* A code editor where you can add or edit XML directly 

In this example, the policy filters requests from certain incoming IP addresses. It's scoped to a selected API.

> [!NOTE]
> You can configure policies at other [scopes](api-management-howto-policies.md#scopes), such as for all APIs, a product, or a single API operation. See [Configure scope](#configure-policies-at-different-scopes), later in this article, for other examples.

To configure a policy:

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
    > * If you don't see a policy you want, select the **Other policies** tile. This will open the XML code editor and display a complete list of policies for that section and scope.
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

    :::image type="content" source="media/set-edit-policies/insert-policy-snippet.png" alt-text="Insert policy snippet":::

1. Paste or enter the desired policy code snippet into one of the appropriate blocks, and complete the policy configuration. 
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
    > [!NOTE]
    > Set a policy's elements and child elements in the order provided in the policy statement.

1. Select **Save** to propagate changes to the API Management gateway immediately.
    
    The **ip-filter** policy now appears in the **Inbound processing** section.
---

## Get assistance creating policies using Microsoft Copilot for Azure (preview)


[Microsoft Copilot for Azure](../copilot/overview.md) (preview) provides policy authoring capabilities for Azure API Management. Using Copilot for Azure in the context of API Management's policy editor, you can create policies that match your specific requirements without knowing the syntax or have already configured policies explained to you. This proves particularly useful for handling complex policies with multiple requirements. 

You can prompt Copilot for Azure to generate policy definitions, then copy the results into the policy editor and make any necessary adjustments. Ask questions to gain insights into different options, modify the provided policy, or clarify the policy you already have. [Learn more](../copilot/author-api-management-policies.md)about this capability.

> [!NOTE]
> Microsoft Copilot for Azure requires [registration](../copilot/limited-access.md#registration-process) (preview) and is currently only available to approved enterprise customers and partners. 

## Configure policies at different scopes

API Management gives you flexibility to configure policy definitions at multiple [scopes](api-management-howto-policies.md#scopes), in each of the policy sections.

> [!IMPORTANT]
> Not all policies can be applied at each scope or policy section. If the policy that you want to add isn't enabled, ensure that you are in a supported policy section and scope for that policy. To review the policy sections and scopes for a policy, check the **Usage** section in the [Policy reference](api-management-policies.md) topics.

> [!NOTE]
> The **Backend** policy section can only contain one policy element. By default, API Management configures the [`forward-request`](forward-request-policy.md) policy in the **Backend** section at the global scope, and the `base` element at other scopes.

### Global scope

Global scope is configured for **All APIs** in your API Management instance.

1. In the left navigation of your API Management instance, select **APIs** > **All APIs**.
1. Select the **Design** tab.

    :::image type="content" source="media/set-edit-policies/global-scope-policy.png" alt-text="Configure policy at product scope":::

1. In a policy section, select **+ Add policy** to use a form-based policy editor, or select the **</>** (code editor) icon to add and edit XML directly. 

1. Select **Save** to propagate changes to the API Management gateway immediately.

### Product scope

Product scope is configured for a selected product.

1. In the left menu, select **Products**, and then select a product to which you want to apply policies.
1. In the product window, select **Policies**.

    :::image type="content" source="media/set-edit-policies/product-scope-policy.png" alt-text="Configure policy at global scope":::
1. In a policy section, select **+ Add policy** to use a form-based policy editor, or select the **</>** (code editor) icon to add and edit XML directly. 

1. Select **Save** to propagate changes to the API Management gateway immediately.



### API scope

API scope is configured for **All operations** of the selected API.

1. In the left navigation of your API Management instance, select **APIs**, and then select the API that you want to apply policies to.
1. Select the **Design** tab.
1. Select **All operations**.

    :::image type="content" source="media/set-edit-policies/api-scope-policy.png" alt-text="Configure policy at API scope":::

1. In a policy section, select **+ Add policy** to use a form-based policy editor, or select the **</>** (code editor) icon to add and edit XML directly. 

6. Select **Save** to propagate changes to the API Management gateway immediately.

### Operation scope 

Operation scope is configured for a selected API operation.

1. In the left navigation of your API Management instance, select **APIs**.
1. Select the **Design** tab.
1. Select  the operation to which you want to apply policies.

    :::image type="content" source="media/set-edit-policies/operation-scope-policy.png" alt-text="Configure policy at operation scope":::

1. In a policy section, select **+ Add policy** to use a form-based policy editor, or select the **</>** (code editor) icon to add and edit XML directly. 

1. Select **Save** to propagate changes to the API Management gateway immediately.

## Reuse policy configurations

You can create reusable [policy fragments](policy-fragments.md) in your API Management instance. Policy fragments are XML elements containing your configurations of one or more policies. Policy fragments help you configure policies consistently and maintain policy definitions without needing to repeat or retype XML code. 

Use the [`include-fragment`](include-fragment-policy.md) policy to insert a policy fragment in a policy definition.

## Use `base` element to set policy evaluation order

If you configure policy definitions at more than one scope, multiple policies could apply to an API request or response. Depending on the order that the policies from the different scopes are applied, the transformation of the request or response could differ.

In API Management, determine the policy evaluation order by placement of the `base` element in each section in the policy definition at each scope. The `base` element inherits the policies configured in that section at the next broader (parent) scope. The `base` element is included by default in each policy section.

> [!NOTE]
> To view the effective policies at the current scope, select **Calculate effective policy** in the policy editor.

To modify the policy evaluation order using the policy editor:

1. Begin with the definition at the most *narrow* scope you configured, which API Management will apply first.

    For example, when using policy definitions configured at the global scope and the API scope, begin with the configuration at the API scope.
1. Place the `base` element within a section to determine where to inherit all policies from the corresponding section at the parent scope. 
 
    For example, in an `inbound` section configured at the API scope, place a `base` element to control where to inherit policies configured in the `inbound` section at the global scope. In the following example, policies inherited from the global scope are applied before the `ip-filter` policy.

    ```xml
    <policies>
      <inbound>
          <base />
            <ip-filter action="allow">
                <address>10.100.7.1</address>
            </ip-filter>
      </inbound>
      [...]
    </policies>
    ```
  
    > [!NOTE]
    > * You can place the `base` element before or after any policy element in a section.
    > * If you want to prevent inheriting policies from the parent scope, remove the `base` element. In most cases, this isn't recommended.

1. Continue to configure the `base` element in policy definitions at successively broader scopes.

    A globally scoped policy has no parent scope, and using the `base` element in it has no effect.

## Related content

For more information about working with policies, see:

+ [Tutorial: Transform and protect APIs](transform-api.md)
+ [Set or edit policies](set-edit-policies.md)
+ [Policy reference](./api-management-policies.md) for a full list of policy statements and their settings
+ [Policy snippets repo](https://github.com/Azure/api-management-policy-snippets)	
