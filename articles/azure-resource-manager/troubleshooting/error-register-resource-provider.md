---
title: Resource provider registration errors
description: Describes how to resolve Azure resource provider registration errors for resources deployed with a Bicep file or Azure Resource Manager template (ARM template).
ms.topic: troubleshooting
ms.custom: devx-track-azurepowershell, devx-track-bicep, devx-track-arm-template, devx-track-azurecli
ms.date: 04/05/2023
---

# Resolve errors for resource provider registration

This article describes resource provider registration errors that occur when you use a resource provider that you haven't already used in your Azure subscription. The errors are displayed when you deploy resources with a Bicep file or Azure Resource Manager template (ARM template). If Azure doesn't automatically register a resource provider, you can do a manual registration.

## Symptom

When a resource is deployed, you might receive the following error code and message:

```Output
Code: NoRegisteredProviderFound
Message: No registered resource provider found for location {location}
and API version {api-version} for type {resource-type}.
```

Or, you might receive a similar message that states:

```Output
Code: MissingSubscriptionRegistration
Message: The subscription is not registered to use namespace {resource-provider-namespace}
```

The error message should give you suggestions for the supported locations and API versions. You can change your template to use a suggested value. Most providers are registered automatically by the Microsoft Azure portal or the command-line interface, but not all. If you haven't used a particular resource provider before, you might need to register that provider.

When virtual machine (VM) auto-shutdown is disabled, you might receive an error message similar to:

```Output
Code: AuthorizationFailed
Message: The client '<identifier>' with object id '<identifier>' does not have authorization to perform
action 'Microsoft.Compute/virtualMachines/read' over scope ...
```

An unexpected error can occur for a resource provider that's not in your ARM template or Bicep file. This error might happen when a resource is deployed that creates other supporting resources. For example, the resource in your template adds monitoring or security resources. The error message indicates the resource provider namespace you need to register is for the supporting resource.

## Cause

You receive these errors for one of these reasons:

- The required resource provider hasn't been registered for your subscription.
- API version not supported for the resource type.
- Location not supported for the resource type.
- For VM auto-shutdown, the `Microsoft.DevTestLab` resource provider must be registered.

## Solution

# [Azure CLI](#tab/azure-cli)

You can use Azure CLI to get information about a resource provider's registration status and
register a resource provider.

Use [az provider list](/cli/azure/provider#az-provider-list) to display the registration status for your subscription's resource providers. The examples use the `--output table` parameter to filter the output for readability. You can omit the parameter to see all properties.

The following command lists all the subscription's resource providers and whether they're `Registered` or `NotRegistered`.

```azurecli-interactive
az provider list --output table
```

You can filter the output by registration state. Replace the query value with `Registered` or `NotRegistered`.

```azurecli-interactive
az provider list --query "[?registrationState=='Registered']" --output table
```

Get the registration status for a specific resource provider:

```azurecli-interactive
az provider list --query "[?namespace=='Microsoft.Compute']" --output table
```

To register a resource provider, use the [az provider register](/cli/azure/provider#az-provider-register) command, and specify the _namespace_ to register.

```azurecli-interactive
az provider register --namespace Microsoft.Cdn
```

To get a resource type's supported locations, use [az provider show](/cli/azure/provider#az-provider-show):

```azurecli-interactive
az provider show --namespace Microsoft.Web --query "resourceTypes[?resourceType=='sites'].locations"
```

Get a resource type's supported API versions:

```azurecli-interactive
az provider show --namespace Microsoft.Web --query "resourceTypes[?resourceType=='sites'].apiVersions"
```

# [PowerShell](#tab/azure-powershell)

You can use Azure PowerShell to get information about a resource provider's registration status and
register a resource provider.

Use [Get-AzResourceProvider](/powershell/module/az.resources/get-azresourceprovider) to display the registration status for your subscription's resource providers.

The following command lists all the subscription's resource providers and whether they're `Registered` or `NotRegistered`.

```azurepowershell-interactive
Get-AzResourceProvider -ListAvailable
```

To list only `Registered` resource providers, omit the `ListAvailable` parameter. You can also filter the output by registration state. Replace the value with `Registered` or `NotRegistered`.

```azurepowershell-interactive
Get-AzResourceProvider -ListAvailable |
  Where-Object -Property RegistrationState -EQ -Value "Registered"
```

Get the registration status for a specific resource provider:

```azurepowershell-interactive
Get-AzResourceProvider -ListAvailable |
  Where-Object -Property ProviderNamespace -Like -Value "Microsoft.Compute"
```

To register a provider, use [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider) and provide the resource provider's name.

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace "Microsoft.Cdn"
```

Get a resource type's supported locations:

```azurepowershell-interactive
((Get-AzResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes |
  Where-Object -Property ResourceTypeName -EQ -Value "sites").Locations
```

Get a resource type's supported API versions:

```azurepowershell-interactive
((Get-AzResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes |
  Where-Object -Property ResourceTypeName -EQ -Value "sites").ApiVersions
```

# [Portal](#tab/azure-portal)

You can see the registration status and register a resource provider namespace through the portal.

1. Sign in to [Azure portal](https://portal.azure.com/).

1. In the search box, enter _subscriptions_. Or if you've recently viewed your subscription, select **Subscriptions**.

    :::image type="content" source="media/error-register-resource-provider/select-subscriptions.png" alt-text="Screenshot of the Azure portal with search box and Subscriptions highlighted.":::


1. Select the subscription you want to use to register a resource provider.

    :::image type="content" source="media/error-register-resource-provider/select-subscription-to-register.png" alt-text="Screenshot of the Azure portal subscriptions list, highlighting a specific subscription for resource provider registration.":::

1. To see the list of resource providers, under **Settings** select **Resource providers**.

    :::image type="content" source="media/error-register-resource-provider/select-resource-providers.png" alt-text="Screenshot of the Azure portal displaying a subscription's settings, highlighting the 'Resource providers' option.":::

1. To register a resource provider, select the resource provider and then select **Register**.

    :::image type="content" source="media/error-register-resource-provider/select-register.png" alt-text="Screenshot of the Azure portal resource providers list, showing a specific provider selected and the 'Register' button highlighted.":::

---
