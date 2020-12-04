---
title: How to use named values in Azure API Management policies
description: Learn how to use named values in Azure API Management policies. Named values can contain literal strings and policy expressions.
services: api-management
documentationcenter: ''
author: vladvino

ms.service: api-management
ms.topic: article
ms.date: 12/03/2020
ms.author: apimpm
---

# Use named values in Azure API Management policies

[API Management policies](api-management-howto-policies.md) are a powerful capability of the system that allows the Azure portal to change the behavior of the API through configuration. Policies are a collection of statements that are executed sequentially on the request or response of an API. Policy statements can be constructed using literal text values, policy expressions, and named values.

Each API Management service instance has a global collection of key/value pairs, called *named values*. There is no imposed limit on the number of items in the collection. Named values can be used to manage constant string values across all API configuration and policies. 

Yo can stored manage, and referenced secret named values in [Azure Key Vault](../key-vault/general/overview.md). Integration with Azure Key Vault helps improve API Management security in several ways:

* Secrets can be reused across services as named values
* Secrets updated in Azure Key Vault are automatically rotated in API Management
* Granular access policies can be applied to secrets

## Named value attributes

Each named value may have the following attributes:

| Attribute      | Type            | Description                                                                                                                            |
| -------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `Display name` | string          | Used for referencing the named value in policies. A string of one to 256 characters. Only letters, numbers, dot, and dash are allowed. |
| `Value`        | string          | Actual value. Must not be empty or consist only of whitespace. Maximum of 4096 characters long.                                        |
| `Secret`       | boolean         | Whether the value is a secret and should be encrypted or not.                                                               |
| `Tags`         | array of string | Used to filter the named value list. Up to 32 tags.                                                                                    |

![Named values](./media/api-management-howto-properties/named-values.png)

Named values can contain literal strings and [policy expressions](./api-management-policy-expressions.md). For example, the value of `Expression` is a policy expression that returns a string containing the current date and time. The named value `Credential` is marked as a secret, so its value is not displayed by default.

| Name       | Value                      | Secret | Tags          |
| ---------- | -------------------------- | ------ | ------------- |
| Answer     | 42                         | False  | vital-numbers |
| Credential | ••••••••••••••••••••••     | True   | security      |
| Expression | @(DateTime.Now.ToString()) | False  |               |

## Add and edit a named value

![Add a named value](./media/api-management-howto-properties/add-property.png)

1. Select **APIs** from under **API MANAGEMENT**.
2. Select **Named values**.
3. Select **+Add**.

    **Name** and **Value** are required values. If value is a secret, select the **This is a secret** checkbox. Enter one or more optional tags to help organize your named values, then **Save**.

4. Select **Create**.

Once the named value is created, you can edit it by selecting the name. If you change the named value name, any policies that reference that named value are automatically updated to use the new name.

## Add secret named value

To use a secret as a named value, we recommend storing and managing the secret in an Azure key vault.

1. For steps to create a key vault, see [Quickstart: Create a key vault using the Azure portal](../key-vault/general/quick-create-portal.md).
1. Enable a system-assigned or user-assigned [managed identity](api-management-howto-use-managed-service-identity.md) in the API Management instance.
1. Assign a [key vault access policy](../key-vault/general/assign-access-policy-portal.md) to the identity with permissions to get and list secrets from the vault. When configuring the policy in the **Add access policy** window in the portal:
    1. In **Secret permissions**, select **Get** and select **List**.
    1. In **Select principal**, select the resource name of your managed identity. If you're using a system-assignmed managed identity, the principal is the name of your API Management instance.
    1. Create or import a secret to the key vault. See [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](../key-vault/secrets/quick-create-portal.md).
    1. 
    1. 

### Configuration for Key Vault firewall

If [Key Vault firewall](../key-vault/general/network-security.md) is enabled on your key vault, you may use the key vault to store secrets for API Management. 

The following are additional requirements for API Management to access the key vault when Key Vault firewall is enabled:

* You must use the API Management instance's **system-assigned** managed identity to access the key vault.
* When enabling the Key Vault firewall, select the **Allow Trusted Microsoft Services to bypass this firewall** option.

Additionally, if the API Management instance is deployed in a [virtual network](api-management-using-with-vnet.md), configure the following network settings:
* Enable a [service endpoint](../key-vault/general/overview-vnet-service-endpoints.md) to Azure Key Vault on the API Management subnet 
* Open up NSG for the AzureKeyVault [service tag](../virtual-network/service-tags-overview.md)
*



## Delete a named value

To delete a named value, click **Delete** beside the named value to delete.

> [!IMPORTANT]
> If the named value is referenced by any policies, you will be unable to successfully delete it until you remove the named value from all policies that use it.

## Search and filter named values

The **Named values** tab includes searching and filtering capabilities to help you manage your named values. To filter the named values list by name, enter a search term in the **Search property** textbox. To display all named values, clear the **Search property** textbox and press enter.

To filter the list by tag, enter one or more tags into the **Filter by tags** textbox. To display all named values, clear the **Filter by tags** textbox and press enter.

## To use a named value

To use a named value in a policy, place its name inside a double pair of braces like `{{ContosoHeader}}`, as shown in the following example:

```xml
<set-header name="{{ContosoHeader}}" exists-action="override">
  <value>{{ContosoHeaderValue}}</value>
</set-header>
```

In this example, `ContosoHeader` is used as the name of a header in a `set-header` policy, and `ContosoHeaderValue` is used as the value of that header. When this policy is evaluated during a request or response to the API Management gateway, `{{ContosoHeader}}` and `{{ContosoHeaderValue}}` are replaced with their respective values.

Named values can be used as complete attribute or element values as shown in the previous example, but they can also be inserted into or combined with part of a literal text expression as shown in the following example: `<set-header name = "CustomHeader{{ContosoHeader}}" ...>`

Named values can also contain policy expressions. In the following example, the `ExpressionProperty` is used.

```xml
<set-header name="CustomHeader" exists-action="override">
    <value>{{ExpressionProperty}}</value>
</set-header>
```

When this policy is evaluated, `{{ExpressionProperty}}` is replaced with its value: `@(DateTime.Now.ToString())`. Since the value is a policy expression, the expression is evaluated and the policy proceeds with its execution.

You can test this out in the developer portal by calling an operation that has a policy with named values in scope. In the following example, an operation is called with the two previous example `set-header` policies with named values. Note that the response contains two custom headers that were configured using policies with named values.

![Developer portal][api-management-send-results]

If you look at the [API Inspector trace](api-management-howto-api-inspector.md) for a call that includes the two previous sample policies with named values, you can see the two `set-header` policies with the named values inserted as well as the policy expression evaluation for the named value that contained the policy expression.

![API Inspector trace][api-management-api-inspector-trace]

While named values can contain policy expressions, they can't contain other named values. If text containing a named value reference is used for a value, such as `Text: {{MyProperty}}`, that reference won't be resolved and replaced.

## Next steps

-   Learn more about working with policies
    -   [Policies in API Management](api-management-howto-policies.md)
    -   [Policy reference](./api-management-policies.md)
    -   [Policy expressions](./api-management-policy-expressions.md)

[api-management-send-results]: ./media/api-management-howto-properties/api-management-send-results.png
[api-management-properties-filter]: ./media/api-management-howto-properties/api-management-properties-filter.png
[api-management-api-inspector-trace]: ./media/api-management-howto-properties/api-management-api-inspector-trace.png


====
Gotchas to mention in the document:
When you use SecretIdentifier don’t provide the Version specific KeyVaultId. Otherwise refresh wont happen 

Refresh happens every 3 hours (SSL refresh) 

APIM should have access either via System or UserAssigned "GET and LIST" on /secrets endpoint. Customer needs to enabled Managed Identity. aka.ms/apimmsi 

Warning 

Don’t delete KeyVault  

Don’t delete Secret 

Don’t remove MSI access 

You can enable Firewall on KeyVault. But follow this guidance 

 

Dedicated (not n VNET) 

Consumption (not in VNET) 

Dedicated - VNET 

KeyVault  -  Open 

NA 

NA 

NA 

KeyVault - Block All Access 

Enable Trusted Service APIM and use 

System Assigned Identity  

 

Enable Trusted Service APIM and  

use SystemAssigned Identity 

Enable Trusted Service on KeyVault and use SystemAssigned 

Enable Service Endpoint to KeyVault on APIM Subnet 

Open up NSG for KeyVault ServiceTag 

KeyVault - Restrict to VNET 

Enable Trusted Service APIM and use 

System Assigned Identity 

 

Enable Trusted Service APIM and use  

System Assigned Identity. 

Enable Trusted Service on KeyVault and use SystemAssigned 

Enable Service Endpoint to KeyVault on APIM Subnet 

Open up NSG for KeyVault ServiceTag 


