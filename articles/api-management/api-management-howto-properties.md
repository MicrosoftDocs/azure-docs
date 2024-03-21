---
title: How to use named values in Azure API Management policies
description: Learn how to use named values in Azure API Management policies. Named values can contain literal strings, policy expressions, and secrets stored in Azure Key Vault.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 01/13/2023
ms.author: danlep
ms.custom: engagement-fy23, devx-track-azurecli
---

# Use named values in Azure API Management policies

[API Management policies](api-management-howto-policies.md) are a powerful capability of the system that allow the publisher to change the behavior of the API through configuration. Policies are a collection of statements that are executed sequentially on the request or response of an API. Policy statements can be constructed using literal text values, policy expressions, and named values.

*Named values* are a global collection of name/value pairs in each API Management instance. There is no imposed limit on the number of items in the collection. Named values can be used to manage constant string values and secrets across all API configurations and policies. 

:::image type="content" source="media/api-management-howto-properties/named-values.png" alt-text="Named values in the Azure portal":::

## Value types

|Type  |Description  |
|---------|---------|
|Plain     |  Literal string or policy expression     |
|Secret     |   Literal string or policy expression that is encrypted by API Management      |
|[Key vault](#key-vault-secrets)     |  Identifier of a secret stored in an Azure key vault.      |

Plain values or secrets can contain [policy expressions](./api-management-policy-expressions.md). For example, the expression `@(DateTime.Now.ToString())` returns a string containing the current date and time.

For details about the named value attributes, see the API Management [REST API reference](/rest/api/apimanagement/current-ga/named-value/create-or-update).

## Key vault secrets

Secret values can be stored either as encrypted strings in API Management (custom secrets) or by referencing secrets in [Azure Key Vault](../key-vault/general/overview.md). 

Using key vault secrets is recommended because it helps improve API Management security:

* Secrets stored in key vaults can be reused across services
* Granular [access policies](../key-vault/general/security-features.md#privileged-access) can be applied to secrets
* Secrets updated in the key vault are automatically rotated in API Management. After update in the key vault, a named value in API Management is updated within 4 hours. You can also manually refresh the secret using the Azure portal or via the management REST API.

## Prerequisites

* If you have not created an API Management service instance yet, see [Create an API Management service instance](get-started-create-service-instance.md).

### Prerequisites for key vault integration

 - If you don't already have a key vault, create one. For steps to create a key vault, see [Quickstart: Create a key vault using the Azure portal](../key-vault/general/quick-create-portal.md).

    To create or import a secret to the key vault, see [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](../key-vault/secrets/quick-create-portal.md).

- Enable a system-assigned or user-assigned [managed identity](api-management-howto-use-managed-service-identity.md) in the API Management instance.

[!INCLUDE [api-management-key-vault-access](../../includes/api-management-key-vault-access.md)]


[!INCLUDE [api-management-key-vault-network](../../includes/api-management-key-vault-network.md)]

## Add or edit a named value

### Add a key vault secret to API Management

See [Prerequisites for key vault integration](#prerequisites-for-key-vault-integration).


> [!IMPORTANT]
> When adding a key vault secret to your API Management instance, you must have permissions to list secrets from the key vault.

> [!CAUTION]
> When using a key vault secret in API Management, be careful not to delete the secret, key vault, or managed identity used to access the key vault.

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. Under **APIs**, select **Named values** > **+Add**.
1. Enter a **Name** identifier, and enter a **Display name** used to reference the property in policies.
1. In **Value type**, select **Key vault**.
1. Enter the identifier of a key vault secret (without version), or choose **Select** to select a secret from a key vault.
    > [!IMPORTANT]
    > If you enter a key vault secret identifier yourself, ensure that it doesn't have version information. Otherwise, the secret won't rotate automatically in API Management after an update in the key vault.
1. In **Client identity**, select a system-assigned or an existing user-assigned managed identity. Learn how to [add or modify managed identities in your API Management service](api-management-howto-use-managed-service-identity.md).
    > [!NOTE]
    > The identity needs permissions to get and list secrets from the key vault. If you haven't already configured access to the key vault, API Management prompts you so it can automatically configure the identity with the necessary permissions.
1. Add one or more optional tags to help organize your named values, then **Save**.
1. Select **Create**.

    :::image type="content" source="media/api-management-howto-properties/add-property.png" alt-text="Add key vault secret value":::

### Add a plain or secret value to API Management

### [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. Under **APIs**, select **Named values** > **+Add**.
1. Enter a **Name** identifier, and enter a **Display name** used to reference the property in policies.
1. In **Value type**, select **Plain** or **Secret**.
1. In **Value**, enter a string or policy expression.
1. Add one or more optional tags to help organize your named values, then **Save**.
1. Select **Create**.

Once the named value is created, you can edit it by selecting the name. If you change the display name, any policies that reference that named value are automatically updated to use the new display name.

### [Azure CLI](#tab/azure-cli)

To begin using Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

To add a named value, use the [az apim nv create](/cli/azure/apim/nv#az-apim-nv-create) command:

```azurecli
az apim nv create --resource-group apim-hello-word-resource-group \
    --display-name "named_value_01" --named-value-id named_value_01 \
    --secret true --service-name apim-hello-world --value test
```

After you create a named value, you can update it by using the [az apim nv update](/cli/azure/apim/nv#az-apim-nv-update) command. To see all your named values, run the [az apim nv list](/cli/azure/apim/nv#az-apim-nv-list) command:

```azurecli
az apim nv list --resource-group apim-hello-word-resource-group \
    --service-name apim-hello-world --output table
```

To see the details of the named value you created for this example, run the [az apim nv show](/cli/azure/apim/nv#az-apim-nv-show) command:

```azurecli
az apim nv show --resource-group apim-hello-word-resource-group \
    --service-name apim-hello-world --named-value-id named_value_01
```

This example is a secret value. The previous command does not return the value. To see the value, run the [az apim nv show-secret](/cli/azure/apim/nv#az-apim-nv-show-secret) command:

```azurecli
az apim nv show-secret --resource-group apim-hello-word-resource-group \
    --service-name apim-hello-world --named-value-id named_value_01
```

To delete a named value, use the [az apim nv delete](/cli/azure/apim/nv#az-apim-nv-delete) command:

```azurecli
az apim nv delete --resource-group apim-hello-word-resource-group \
    --service-name apim-hello-world --named-value-id named_value_01
```

---

## Use a named value

The examples in this section use the named values shown in the following table.

| Name               | Value                      | Secret | 
|--------------------|----------------------------|--------| 
| ContosoHeader      | `TrackingId`                 | False  | 
| ContosoHeaderValue | ••••••••••••••••••••••     | True   | 
| ExpressionProperty | `@(DateTime.Now.ToString())` | False  | 
| ContosoHeaderValue2 | `This is a header value.` | False | 

To use a named value in a policy, place its display name inside a double pair of braces like `{{ContosoHeader}}`, as shown in the following example:

```xml
<set-header name="{{ContosoHeader}}" exists-action="override">
  <value>{{ContosoHeaderValue}}</value>
</set-header>
```

In this example, `ContosoHeader` is used as the name of a header in a `set-header` policy, and `ContosoHeaderValue` is used as the value of that header. When this policy is evaluated during a request or response to the API Management gateway, `{{ContosoHeader}}` and `{{ContosoHeaderValue}}` are replaced with their respective values.

Named values can be used as complete attribute or element values as shown in the previous example, but they can also be inserted into or combined with part of a literal text expression as shown in the following example: 

```xml
<set-header name = "CustomHeader{{ContosoHeader}}" ...>
```

Named values can also contain policy expressions. In the following example, the `ExpressionProperty` expression is used.

```xml
<set-header name="CustomHeader" exists-action="override">
    <value>{{ExpressionProperty}}</value>
</set-header>
```

When this policy is evaluated, `{{ExpressionProperty}}` is replaced with its value, `@(DateTime.Now.ToString())`. Since the value is a policy expression, the expression is evaluated and the policy proceeds with its execution.

You can test this in the Azure portal or the [developer portal](api-management-howto-developer-portal.md) by calling an operation that has a policy with named values in scope. In the following example, an operation is called with the two previous example `set-header` policies with named values. Notice that the response contains two custom headers that were configured using policies with named values.

:::image type="content" source="media/api-management-howto-properties/api-management-send-results.png" alt-text="Test API response":::

If you look at the outbound [API trace](api-management-howto-api-inspector.md) for a call that includes the two previous sample policies with named values, you can see the two `set-header` policies with the named values inserted as well as the policy expression evaluation for the named value that contained the policy expression.

:::image type="content" source="media/api-management-howto-properties/api-management-api-inspector-trace.png" alt-text="API Inspector trace":::

String interpolation can also be used with named values.

```xml
<set-header name="CustomHeader" exists-action="override">
    <value>@($"The URL encoded value is {System.Net.WebUtility.UrlEncode("{{ContosoHeaderValue2}}")}")</value>
</set-header>
```

The value for `CustomHeader` will be `The URL encoded value is This+is+a+header+value.`.

> [!CAUTION]
> If a policy references a secret in Azure Key Vault, the value from the key vault will be visible to users who have access to subscriptions enabled for [API request tracing](api-management-howto-api-inspector.md).

While named values can contain policy expressions, they can't contain other named values. If text containing a named value reference is used for a value, such as `Text: {{MyProperty}}`, that reference won't be resolved and replaced.

## Delete a named value

To delete a named value, select the name and then select **Delete** from the context menu (**...**).

> [!IMPORTANT]
> If the named value is referenced by any API Management policies, you can't delete it until you remove the named value from all policies that use it.

## Next steps

-   Learn more about working with policies
    -   [Policies in API Management](api-management-howto-policies.md)
    -   [Policy reference](./api-management-policies.md)
    -   [Policy expressions](./api-management-policy-expressions.md)

[api-management-send-results]: ./media/api-management-howto-properties/api-management-send-results.png
