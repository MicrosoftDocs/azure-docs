---
title: Disable local authentication with Azure Service Bus
description: This article explains how to disable local or Shared Access Signature key authentication for a Service Bus namespace and use only Microsoft Entra ID. 
ms.topic: how-to
ms.date: 03/19/2026 
ms.custom: sfi-image-nochange
#customer intent: As a developer or IT administrator, I want to know how to disable shared access key authentication and use only the Microsoft Entra ID authentication for higher security.
---

# Disable local or shared access key authentication with Azure Service Bus
You can authenticate to Azure Service Bus resources in two ways: 

- Microsoft Entra ID
- Shared Access Signatures (SAS)

Microsoft Entra ID provides superior security and ease of use over shared access signatures (SAS). By using Microsoft Entra ID, you don't need to store tokens in your code, which reduces potential security vulnerabilities. Use Microsoft Entra ID with your Azure Service Bus applications when possible.

This article explains how to disable SAS key authentication (or local authentication) and use only Microsoft Entra ID for authentication. 

## Why disable local authentication?

Disabling local (SAS key) authentication strengthens the security of your Service Bus namespace in several ways:

- **Eliminates static credentials.** SAS keys are long-lived shared secrets. If a key leaks, anyone who has it can access your namespace until you manually rotate the key. Microsoft Entra ID uses short-lived tokens that are automatically refreshed.
- **Enables fine-grained access control.** SAS policies grant broad rights (Send, Listen, Manage) at the namespace or entity level. Microsoft Entra role-based access control (RBAC) lets you assign specific roles (`Azure Service Bus Data Sender`, `Azure Service Bus Data Receiver`, `Azure Service Bus Data Owner`) to individual users, groups, service principals, or managed identities.
- **Provides an audit trail.** Microsoft Entra authentication events appear in the Microsoft Entra sign-in logs. SAS key usage doesn't produce comparable identity-level audit records.
- **Supports conditional access.** By using Microsoft Entra ID, you can enforce policies such as multifactor authentication, trusted device requirements, and location restrictions - none of which are available by using SAS keys.

> [!TIP]
> Before you disable local authentication, update all applications to authenticate by using Microsoft Entra ID. See the [migration steps](#migrate-from-sas-to-microsoft-entra-id) section later in this article.

## Use portal to disable local auth
In this section, you learn how to use the Azure portal to disable local authentication. 

1. Go to your Service Bus namespace in the [Azure portal](https://portal.azure.com).
1. In the **Essentials** section of the **Overview** page, select **Enabled** for **Local Authentication**. 

    :::image type="content" source="./media/disable-local-authentication/portal-overview-enabled.png" alt-text="Screenshot that shows the Overview page of a Service Bus namespace with Local Authentication set to Enabled." lightbox="./media/disable-local-authentication/portal-overview-enabled.png":::
1. On the **Local Authentication** page, select **Disabled**, and select **OK**. 

      :::image type="content" source="./media/disable-local-authentication/select-disabled.png" alt-text="Screenshot that shows the selection of Disabled option on the Local Authentication page.":::

## Use a template to disable local auth
You can disable local authentication for a Service Bus namespace by setting the `disableLocalAuth` property to `true` as shown in the following templates.

# [Bicep](#tab/bicep)

```bicep
@description('Name of the Service Bus namespace')
param namespaceName string

@description('Location for all resources.')
param location string = resourceGroup().location

resource serviceBusNamespace 'Microsoft.ServiceBus/namespaces@2024-01-01' = {
  name: namespaceName
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    disableLocalAuth: true
  }
}
```

# [ARM template](#tab/arm)

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namespaceName": {
            "type": "string",
            "metadata": {
                "description": "Name of the Service Bus namespace"
            }
        },
        "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]",
            "metadata": {
                "description": "Location for all resources."
            }
        }
    },
    "resources": [
        {
            "type": "Microsoft.ServiceBus/namespaces",
            "apiVersion": "2024-01-01",
            "name": "[parameters('namespaceName')]",
            "location": "[parameters('location')]",
            "sku": {
                "name": "Standard",
                "tier": "Standard"
            },
            "properties": {
                "disableLocalAuth": true
            }
        }
    ]
}
```

---

## Use Azure CLI or PowerShell to disable local auth

You can also disable local authentication by using command-line tools for an existing namespace.

# [Azure CLI](#tab/azure-cli)

```azurecli
az servicebus namespace update \
    --resource-group <resource-group-name> \
    --name <namespace-name> \
    --disable-local-auth true
```

To re-enable local authentication:

```azurecli
az servicebus namespace update \
    --resource-group <resource-group-name> \
    --name <namespace-name> \
    --disable-local-auth false
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzServiceBusNamespace `
    -ResourceGroupName <resource-group-name> `
    -Name <namespace-name> `
    -DisableLocalAuth
```

To re-enable local authentication:

```azurepowershell
Set-AzServiceBusNamespace `
    -ResourceGroupName <resource-group-name> `
    -Name <namespace-name> `
    -DisableLocalAuth:$false
```

---

You can verify the current state by checking the `disableLocalAuth` property:

# [Azure CLI](#tab/azure-cli)

```azurecli
az servicebus namespace show \
    --resource-group <resource-group-name> \
    --name <namespace-name> \
    --query disableLocalAuth
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
(Get-AzServiceBusNamespace -ResourceGroupName <resource-group-name> -Name <namespace-name>).DisableLocalAuth
```

---

## Enforce with Azure Policy

For tenant-wide or subscription-wide enforcement, use the built-in Azure Policy [**Service Bus namespaces should have local authentication methods disabled**](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcfb11c26-f069-4c14-8e36-56c394dae5af) (policy ID: `cfb11c26-f069-4c14-8e36-56c394dae5af`).

This policy evaluates Service Bus namespaces and flags any that have `disableLocalAuth` set to `false` or unset. You can assign it at the management group, subscription, or resource group level.

### Policy effects

When you assign the policy, choose an effect that matches your enforcement needs:

| Effect | Behavior |
|--------|----------|
| **Audit** (default) | Existing namespaces with local auth enabled appear as **non-compliant** in the compliance dashboard. New namespaces are still allowed. |
| **Deny** | Prevents the creation or update of any namespace that has local auth enabled. Use this effect to enforce compliance for new resources. |

### Assign the policy

1. In the [Azure portal](https://portal.azure.com), go to **Policy** > **Definitions**.
1. Search for *Service Bus namespaces should have local authentication methods disabled*.
1. Select the policy definition, and then select **Assign**.
1. Choose the scope (management group, subscription, or resource group).
1. On the **Parameters** tab, select the desired effect (**Audit** or **Deny**).
1. Select **Review + create**, and then **Create**.

After assignment, namespaces that don't comply appear in **Policy** > **Compliance**. You can create a remediation task for namespaces that need updating.

:::image type="content" source="./media/disable-local-authentication/azure-policy.png" alt-text="Screenshot of Azure policy to disable location authentication." lightbox="./media/disable-local-authentication/azure-policy.png":::

## Migrate from SAS to Microsoft Entra ID

Before you disable local authentication, update all applications that connect to your Service Bus namespace to use Microsoft Entra ID instead of connection strings or SAS tokens. Follow these steps:

### Step 1: Assign RBAC roles

Assign the appropriate Azure Service Bus data role to each identity (user, service principal, or managed identity) that needs access:

| Role | Permission |
|------|-----------|
| `Azure Service Bus Data Sender` | Send messages to queues and topics |
| `Azure Service Bus Data Receiver` | Receive messages from queues and subscriptions |
| `Azure Service Bus Data Owner` | Full access (send, receive, manage entities) |

You can assign roles through the Azure portal, Azure CLI, or Azure PowerShell. For detailed instructions, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

### Step 2: Update application code

Replace connection string-based authentication with `DefaultAzureCredential` (or another Microsoft Entra credential) from the Azure Identity library. The following examples show the change for each language:

# [.NET](#tab/dotnet)

```csharp
// Before (connection string):
await using ServiceBusClient client = new("<connection-string>");

// After (Microsoft Entra ID):
await using ServiceBusClient client = new(
    "<your-namespace>.servicebus.windows.net",
    new DefaultAzureCredential());
```

# [Java](#tab/java)

```java
// Before (connection string):
ServiceBusSenderClient sender = new ServiceBusClientBuilder()
    .connectionString("<connection-string>")
    .sender()
    .queueName("<queue-name>")
    .buildClient();

// After (Microsoft Entra ID):
TokenCredential credential = new DefaultAzureCredentialBuilder().build();
ServiceBusSenderClient sender = new ServiceBusClientBuilder()
    .credential("<your-namespace>.servicebus.windows.net", credential)
    .sender()
    .queueName("<queue-name>")
    .buildClient();
```

# [Python](#tab/python)

```python
# Before (connection string):
client = ServiceBusClient.from_connection_string("<connection-string>")

# After (Microsoft Entra ID):
from azure.identity import DefaultAzureCredential
client = ServiceBusClient(
    fully_qualified_namespace="<your-namespace>.servicebus.windows.net",
    credential=DefaultAzureCredential())
```

# [JavaScript](#tab/javascript)

```javascript
// Before (connection string):
const client = new ServiceBusClient("<connection-string>");

// After (Microsoft Entra ID):
const { DefaultAzureCredential } = require("@azure/identity");
const client = new ServiceBusClient(
    "<your-namespace>.servicebus.windows.net",
    new DefaultAzureCredential());
```

---

For more detail on each SDK, see:
- .NET: [Sample — Authenticate the client](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/samples/Sample00_AuthenticateClient.md)
- Java: [Sample — Send with Azure Identity](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/servicebus/azure-messaging-servicebus/src/samples/java/com/azure/messaging/servicebus/SendMessageWithAzureIdentityAsyncSample.java)
- Python: [Sample — Service Bus client](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/servicebus/azure-servicebus/samples/sync_samples/sample_code_servicebus.py)
- JavaScript: [Service Bus samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/servicebus/service-bus/samples)

### Step 3: Test with both auth methods enabled

Deploy your updated application while local auth is still enabled. Verify that:
- You send and receive messages successfully.
- The application logs show Microsoft Entra token acquisition (not SAS).
- No errors related to authentication appear.

### Step 4: Disable local authentication

After you confirm all applications work with Microsoft Entra ID, disable local auth by using any of the methods described earlier in this article (portal, CLI, PowerShell, or template).

### Step 5: Clean up SAS policies (optional)

After you disable local auth, existing SAS policies on the namespace remain but can't be used to generate functional tokens. You can leave them in place or remove them for a cleaner configuration. Removing unused policies reduces the attack surface if someone accidentally re-enables local auth.

## Related content
To learn about Microsoft Entra ID and SAS authentication, see the following articles: 

- [Authentication with SAS](service-bus-sas.md) 
- Authentication with Microsoft Entra ID
    - [Authenticate with managed identities](service-bus-managed-service-identity.md)
    - [Authenticate from an application](authenticate-application.md)
