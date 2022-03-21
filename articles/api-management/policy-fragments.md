---
title: Reuse policy configuration in Azure API Management | Microsoft Docs
description: Learn how to create and manage reusable policy fragments in Azure API Management. These fragments are XML code blocks with policy configurations that can be included in any policy definition.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 03/21/2022
ms.author: danlep
---

# Reuse policy statements in your API Management policy definitions

This article shows you how to create and use [*policy fragments*](policy-fragments.md) in your API Management policy definitions. Policy fragments are reusable XML code blocks containing one or more [policy](api-management-howto-policies.md) statements. Using policy fragments in your policy definitions, you can configure and apply policies repeatably and consistently in your API Managment instance.

## Prerequisites

If you don't already have an API Management instance and a backend API, see:

- [Create an Azure API Management instance](get-started-create-service-instance.md)
- [Import and publish an API](import-and-publish.md)

While not required, you may want to [configure](set-edit-policies.md) one or more policy definitions. You can copy statements from these defintions when creating policy fragments.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Create a policy fragment

1. In the left navigation of your API Management instance, under **APIs**, select **Policy fragments** > **+ Create**.
1. In the **Create a new policy fragment** window, enter a **Name** and an optional **Description** of the policy fragment. The name must be unique within your API Management instance.

    Example name: *ForwardContext*
1. In the **XML policy fragment** editor, type or copy one or more policy statements between the `<fragment>` and `</fragment>` tags. The fragment may include multiple policies and [policy expressions](api-management-policy-expressions.md), if a referenced policy supports them.

    The following example fragment  sets a custom header to forward context information to a backend service. This fragment would be included in an Inbound policy section. The policy expressions in this example access the built-in [`context` variable](api-management-policy-expressions.md#ContextVariables).

    ```xml
    <fragment>
        <set-header name="x-request-context-data" exists-action="override">
          <value>@(context.User.Id)</value>
          <value>@(context.Deployment.Region)</value>
        </set-header>
    </fragment>
    ```
    
    :::image type="content" source="media/policy-fragments/create-fragment.png" alt-text="Create policy fragment":::
1. Select **Create**. The fragment is added to the list of policy fragments.

> [!NOTE]
> * A policy fragment cannot include a policy section identifier (`<inbound>`, `<outbound>`, etc.) or the `<base/>` element.
> * A policy fragment cannot reference another policy fragment.

## Include a fragment in a policy definition

Configure the [`include-fragment`](api-management-advanced-policies.md#a-name%22includefragmentIncludeFragment) policy to add a policy fragment to a policy definition. For a tutorial to configure a policy definition, see [Transform and protect your API](transform-api.md).

* You may include a fragment at any scope and in any policy section, as long as the underlying policies in the fragment support that usage.
* You may multiple policy fragments in a policy definition.

For example, configure an inbound policy at the scope of a selected API to include the policy fragment named *ForwardContext*:

```xml
<policies>
    <inbound>
        <include-fragment fragment-id="ForwardContext" />
        <base />
    </inbound>
[...]
```

## Manage policy fragments

After creating a policy fragment, you can view and update policy properties, or delete the policy at any time.

To view properties of a fragment:

1. In the left navigation of your API Management instance, under **APIs**, select **Policy fragments**, and then select the name of your fragment.
1. On the **Overview** page, review the **Policy document references** to see the policy definitions that include the fragment.
1. On the **Properties** page, review the name and description of the policy fragement. The name cannot be changed.

To update the policy fragment:

1. In the left navigation of your API Management instance, under **APIs**, select **Policy fragments**, and then select the name of your fragment.
1. Select **Policy editor**. 
1. Update the statements in the fragment and then select


* Update affects all policy definitions where the fragment is included
* Delete removes all references from policy definitiions where the fragment is included

## Next steps


