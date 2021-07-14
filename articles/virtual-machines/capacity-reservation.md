---
title: 'Do something with myFeature (preview)' #Required; 60 characters max. Page title is displayed in search results.
description: Learn how to #Required; article description that is displayed in search results. 
author: cynthn #Required; your GitHub user alias, with correct capitalization.
ms.author: cynthn #Required; microsoft alias of author; optional team alias.
ms.service: virtual-machines #Required
ms.subservice:  # Optional; feature area like imaging or networking
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 01/01/2021 #Required; mm/dd/yyyy format.
ms.reviewer: cynthn #Optional name of someone else who works on this article who can answer questions or help with publishing
ms.custom: template-how-to #Required; leave this attribute/value as-is.

#This template is for a how-to article. For a published example see xxx.md

---

<!--

Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->

<!-- Heading 1
Required. Use a single #. Start with a verb. Clearly convey the task the user will complete. Should be similar to the title metadata value, but can be up to 100 characters.
-->

# Do something (preview)

<!-- Introductory paragraph 
Required. Lead with a light intro that describes, in customer-friendly language, 
what the customer will learn, or do, or accomplish. Answer the fundamental “why 
would I want to do this?” question. Keep it short.

The following "preview" note should be left in until the feature goes GA. Replace "**feature** with something appropriate for your release.
-->

> [!IMPORTANT]
> **Feature** is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Prerequisites

<!--Optional. If you need prerequisites, make them your first H2 in a how-to guide. 
Use clear and unambiguous language and use a list format.
-->
 
Before you get started, make sure you have the following:

- Prereq 
- Prereq

## Register the feature

<!--Optional. If you need register the feature for preview, these are some basic instructions you can use. Delete this if the feature is auto-registered.
-->

For the public preview, you first need to register the feature:

### [CLI](#tab/cli)

- This article requires version <!-- version number --> or later of the Azure CLI. If using [Azure Cloud Shell](../cloud-shell/quickstart.md), the latest version is already installed.
- Run [az version](/cli/azure/reference-index?#az_version) to find the version. 
- To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az_upgrade).


```azurecli-interactive
az feature register --namespace <!-- feature namespace --> --name <!-- feature name-->
```

Check the status of the feature registration.

```azurecli-interactive
az feature show --namespace <!-- feature namespace --> --name <!-- feature name--> | grep state
```

Check your provider registration.

```azurecli-interactive
az provider show -n <!-- feature namespace --> | grep registrationState
```

If they do not say registered, run the following:

```azurecli-interactive
az provider register -n <!-- feature -->

```

### [PowerShell](#tab/powershell)

Install the latest [Azure PowerShell version](/powershell/azure/install-az-ps), and sign in to an Azure account using [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount).

```azurepowershell-interactive
Register-AzProviderFeature -FeatureName <!-- feature name--> -ProviderNamespace Microsoft.Compute
```

It takes a few minutes for the registration to finish. Use `Get-AzProviderFeature` to check the status of the feature registration:

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName <!-- feature name--> -ProviderNamespace Microsoft.Compute
```

When `RegistrationState` returns `Registered`, you can move on to the next step.

Check your provider registration. Make sure it returns `Registered`.

```azurepowershell-interactive
Get-AzResourceProvider -ProviderNamespace Microsoft.Compute | Format-table -Property ResourceTypes,RegistrationState
```

If it doesn't return `Registered`, use the following code to register the providers:

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.Compute
```

---


## Do something

<!-- Give this section a short title and then an intro paragraph -->

<!-- In this template, we are going to cover multi ways to do something. For this, we use "tabbed content". Each tab starts with a ### and the type of tool. Delete the sections you aren't covering.-->

### [Portal](#tab/portal2)

<!-- Introduction paragraph if needed. The numbering is automatically controlled, so you can put 1. for each step and the rendering engine will fix the numbers in the live content. -->

1. Open the [portal](https://portal.azure.com).
1. In the search bar, type **<name_of_feature>**.
1. Select **<name_of_feature>**.
1. In the left menu under **Settings**, select **<something>**.
1. In the **<something>** page, select **<something>**.

### [CLI](#tab/cli2)
<!-- Introduction paragraph if needed-->

```azurecli-interactive

```

### [PowerShell](#tab/powershell2)

<!-- Introduction paragraph if needed -->

```powershell-interactive

```


### [REST](#tab/rest2)

<!-- Introduction paragraph if needed -->

```rest

```

---

<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->

## Next steps
<!-- You can link back to the overview, or whatever seems like the logical next thing to read -->
- [Overview](preview-overview.md)


<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->