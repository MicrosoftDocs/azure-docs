---
title: Reuse policy configurations in Azure API Management | Microsoft Docs
description: Learn how to create and manage reusable policy fragments in Azure API Management. Policy fragments are XML elements containing policy configurations that can be included in any policy definition.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 04/28/2022
ms.author: danlep
ms.custom: event-tier1-build-2022
---

# Reuse policy configurations in your API Management policy definitions

This article shows you how to create and use *policy fragments* in your API Management policy definitions. Policy fragments are centrally managed, reusable XML snippets containing one or more API Management [policy](api-management-howto-policies.md) configurations. 

Policy fragments help you configure policies consistently and maintain policy definitions without needing to repeat or retype XML code.

A policy fragment:

* Must be valid XML containing one or more policy configurations
* May include [policy expressions](api-management-policy-expressions.md), if a referenced policy supports them
* Is inserted as-is in a policy definition by using the [include-fragment](include-fragment-policy.md) policy

Limitations:

* A policy fragment can't include a policy section identifier (`<inbound>`, `<outbound>`, etc.) or the `<base/>` element.
* Currently, a policy fragment can't nest another policy fragment. 
* The maximum size of a policy fragment is 32 KB.

## Prerequisites

If you don't already have an API Management instance and a backend API, see:

- [Create an Azure API Management instance](get-started-create-service-instance.md)
- [Import and publish an API](import-and-publish.md)

While not required, you may want to [configure](set-edit-policies.md) one or more policy definitions. You can copy policy elements from these definitions when creating policy fragments.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Create a policy fragment

1. In the left navigation of your API Management instance, under **APIs**, select **Policy fragments** > **+ Create**.
1. In the **Create a new policy fragment** window, enter a **Name** and an optional **Description** of the policy fragment. The name must be unique within your API Management instance.

    Example name: *ForwardContext*
1. In the **XML policy fragment** editor, type or paste one or more policy XML elements between the `<fragment>` and `</fragment>` tags. 

    :::image type="content" source="media/policy-fragments/create-fragment.png" alt-text="Screenshot showing the create a new policy fragment form.":::

    For example, the following fragment contains a [`set-header`](set-header-policy.md) policy configuration to forward context information to a backend service. This fragment would be included in an inbound policy section. The policy expressions in this example access the built-in [`context` variable](api-management-policy-expressions.md#ContextVariables).

    ```xml
    <fragment>
        <set-header name="x-request-context-data" exists-action="override">
          <value>@(context.User.Id)</value>
          <value>@(context.Deployment.Region)</value>
        </set-header>
    </fragment>
    ```
    
1. Select **Create**. The fragment is added to the list of policy fragments.

## Include a fragment in a policy definition

Configure the [`include-fragment`](include-fragment-policy.md) policy to insert a policy fragment in a policy definition. For more information about policy definitions, see [Set or edit policies](set-edit-policies.md).

* You may include a fragment at any scope and in any policy section, as long as the underlying policy or policies in the fragment support that usage.
* You may include multiple policy fragments in a policy definition.

For example, insert the policy fragment named *ForwardContext* in the inbound policy section:

```xml
<policies>
    <inbound>
        <include-fragment fragment-id="ForwardContext" />
        <base />
    </inbound>
[...]
```

> [!TIP]
> To see the content of an included fragment displayed in the policy definition, select **Calculate effective policy** in the policy editor.

## Manage policy fragments

After creating a policy fragment, you can view and update the properties of a policy fragment, or delete the policy fragment at any time.

**To view properties of a policy fragment:**

1. In the left navigation of your API Management instance, under **APIs**, select **Policy fragments**. Select the name of your fragment.
1. On the **Overview** page, review the **Policy document references** to see the policy definitions that include the fragment.
1. On the **Properties** page, review the name and description of the policy fragment. The name can't be changed.

**To edit a policy fragment:**

1. In the left navigation of your API Management instance, under **APIs**, select **Policy fragments**. Select the name of your fragment.
1. Select **Policy editor**. 
1. Update the statements in the fragment and then select **Apply**.

> [!NOTE]
> Update affects all policy definitions where the fragment is included.

**To delete a policy fragment:**

1. In the left navigation of your API Management instance, under **APIs**, select **Policy fragments**. Select the name of your fragment.
1. Review **Policy document references** for policy definitions that include the fragment. Before a fragment can be deleted, you must remove the fragment references from all policy definitions.
1. After all references are removed, select **Delete**.

## Next steps

For more information about working with policies, see:

+ [Tutorial: Transform and protect APIs](transform-api.md)
+ [Set or edit policies](set-edit-policies.md)
+ [Policy reference](./api-management-policies.md) for a full list of policy statements
+ [Policy snippets repo](https://github.com/Azure/api-management-policy-snippets)	
