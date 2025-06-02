---
title: Reuse Policy Configurations in API Management | Microsoft Docs
description: Learn how to create and manage reusable policy fragments, XML snippets that contain policy configurations, in Azure API Management.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 05/15/2025
ms.author: danlep

#customer intent: As an API developer, I want to learn how to create and manage policy fragments so that I can reuse policy configurations.
---

# Reuse policy configurations in your API Management policy definitions

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article shows how to create and use *policy fragments* in your Azure API Management policy definitions. Policy fragments are centrally managed, reusable XML snippets that contain one or more API Management [policy](api-management-howto-policies.md) configurations. 

Policy fragments help you configure policies consistently and maintain policy definitions without needing to repeat or retype XML code.

A policy fragment:

* Must be valid XML that contains one or more policy configurations.
* Can include [policy expressions](api-management-policy-expressions.md), if a referenced policy supports them.
* Is inserted as-is in a policy definition via the [include-fragment](include-fragment-policy.md) policy.

Limitations:

* A policy fragment can't include a policy section identifier (`<inbound>`, `<outbound>`, for example) or the `<base/>` element.
* Currently, a policy fragment can't nest another policy fragment. 
* The maximum size of a policy fragment is 32 KB.

## Prerequisites

If you don't already have an API Management instance and a backend API, see:

- [Create an Azure API Management instance](get-started-create-service-instance.md)
- [Import and publish an API](import-and-publish.md)

Although it's not required, you might want to [configure](set-edit-policies.md) one or more policy definitions. You can copy policy elements from these definitions when you create policy fragments.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Create a policy fragment

1. In the left pane of your API Management instance, under **APIs**, select **Policy fragments**. In the **Policy fragments** pane, select **+ Create**.
1. In the **Create a new policy fragment** window, enter a **Name** and, optionally, a **Description** of the policy fragment. The name must be unique within your API Management instance.

    Example name: *ForwardContext*

1. In the **XML policy fragment** editor, type or paste one or more policy XML elements between the `<fragment>` and `</fragment>` tags: 

    :::image type="content" source="media/policy-fragments/create-fragment.png" alt-text="Screenshot showing the Create a new policy fragment window.":::

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

Use the [`include-fragment`](include-fragment-policy.md) policy to insert a policy fragment in a policy definition. For more information about policy definitions, see [Set or edit policies](set-edit-policies.md).

* You can include a fragment at any scope and in any policy section, as long as the underlying policy or policies in the fragment support the usage.
* You can include multiple policy fragments in a policy definition.

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

After you create a policy fragment, you can view and update its properties or delete it at any time.

**To view the properties of a policy fragment:**

1. In the left pane of your API Management instance, under **APIs**, select **Policy fragments**. Select the name of your fragment.
1. On the **Overview** page, review the **Policy document references** to see the policy definitions that include the fragment.
1. On the **Properties** page, under **Settings**, review the name and description of the policy fragment. The name can't be changed.

**To edit a policy fragment:**

1. In the left pane of your API Management instance, under **APIs**, select **Policy fragments**. Select the name of your fragment.
1. Under **Settings**, select **Policy editor**. 
1. Update the statements in the fragment, and then select **Apply**.

> [!NOTE]
> Updates affect all policy definitions in which the fragment is included.

**To delete a policy fragment:**

1. In the left pane of your API Management instance, under **APIs**, select **Policy fragments**. Select the name of your fragment.
1. Review **Policy document references** for policy definitions that include the fragment. Before you delete a fragment, you must remove the fragment references from all policy definitions.
1. After all references are removed, select **Delete**.

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
