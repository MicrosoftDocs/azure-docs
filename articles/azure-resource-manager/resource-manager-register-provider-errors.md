---
title: Azure resource provider registration errors | Microsoft Docs
description: Describes how to resolve Azure resource provider registration errors.
services: azure-resource-manager
documentationcenter: ''
author: tfitzmac
manager: timlt
editor: ''

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: troubleshooting
ms.date: 03/09/2018
ms.author: tomfitz

---
# Resolve errors for resource provider registration

This article describes the errors you may encounter when using a resource provider that you have not previously used in your subscription.

## Symptom

When deploying resource, you may receive the following error code and message:

```
Code: NoRegisteredProviderFound
Message: No registered resource provider found for location {location}
and API version {api-version} for type {resource-type}.
```

Or, you may receive a similar message that states:

```
Code: MissingSubscriptionRegistration
Message: The subscription is not registered to use namespace {resource-provider-namespace}
```

The error message should give you suggestions for the supported locations and API versions. You can change your template to one of the suggested values. Most providers are registered automatically by the Azure portal or the command-line interface you are using, but not all. If you have not used a particular resource provider before, you may need to register that provider.

## Cause

You receive these errors for one of three reasons:

1. The resource provider has not been registered for your subscription
1. API version not supported for the resource type
1. Location not supported for the resource type

## Solution 1 - PowerShell

For PowerShell, use **Get-AzureRmResourceProvider** to see your registration status.

```powershell
Get-AzureRmResourceProvider -ListAvailable
```

To register a provider, use **Register-AzureRmResourceProvider** and provide the name of the resource provider you wish to register.

```powershell
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Cdn
```

To get the supported locations for a particular type of resource, use:

```powershell
((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).Locations
```

To get the supported API versions for a particular type of resource, use:

```powershell
((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes | Where-Object ResourceTypeName -eq sites).ApiVersions
```

## Solution 2 - Azure CLI

To see whether the provider is registered, use the `az provider list` command.

```azurecli-interactive
az provider list
```

To register a resource provider, use the `az provider register` command, and specify the *namespace* to register.

```azurecli-interactive
az provider register --namespace Microsoft.Cdn
```

To see the supported locations and API versions for a resource type, use:

```azurecli-interactive
az provider show -n Microsoft.Web --query "resourceTypes[?resourceType=='sites'].locations"
```

## Solution 3 - Azure portal

You can see the registration status and register a resource provider namespace through the portal.

1. For your subscription, select **Resource providers**.

   ![select resource providers](./media/resource-manager-register-provider-errors/select-resource-provider.png)

1. Look at the list of resource providers, and if necessary, select the **Register** link to register the resource provider of the type you are trying to deploy.

   ![list resource providers](./media/resource-manager-register-provider-errors/list-resource-providers.png)
