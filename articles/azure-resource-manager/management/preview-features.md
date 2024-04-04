---
title: Set up preview features in Azure subscription
description: Describes how to list, register, or unregister preview features in your Azure subscription for a resource provider.
ms.topic: how-to
ms.date: 03/19/2024
ms.custom: devx-track-azurepowershell, devx-track-azurecli
# Customer intent: As an Azure user, I want to use preview features in my subscription so that I can expose a resource provider's preview functionality.
---

# Set up preview features in Azure subscription

This article shows you how to manage preview features in your Azure subscription. Preview features let you opt in to new functionality before it's released. Some preview features are available to anyone who wants to opt in. Other preview features require approval from the product team.

Azure Feature Exposure Control (AFEC) is available through the [Microsoft.Features](/rest/api/resources/features) namespace. Preview features have the following format for the resource ID:

`Microsoft.Features/providers/{resourceProviderNamespace}/features/{featureName}`

## Required access

To list, register, or unregister preview features in your Azure subscription, you need access to the `Microsoft.Features/*` actions. This permission is granted through the [Contributor](../../role-based-access-control/built-in-roles.md#contributor) and [Owner](../../role-based-access-control/built-in-roles.md#owner) built-in roles. You can also specify the required access through a [custom role](../../role-based-access-control/custom-roles.md).

## List preview features

You can list all the preview features and their registration states for an Azure subscription.

# [Portal](#tab/azure-portal)

The portal only shows a preview feature when the service that owns the feature has explicitly opted in to the preview features management experience.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search box, enter _subscriptions_ and select **Subscriptions**.

    :::image type="content" source="./media/preview-features/search.png" alt-text="Screenshot of Azure portal search box with 'subscriptions' entered.":::

1. Select the link for your subscription's name.

    :::image type="content" source="./media/preview-features/subscriptions.png" alt-text="Screenshot of Azure portal with subscription selection highlighted.":::

1. From the left menu, under **Settings** select **Preview features**.

    :::image type="content" source="./media/preview-features/preview-features-menu.png" alt-text="Screenshot of Azure portal with Preview features menu option highlighted.":::

1. You see a list of available preview features and your current registration status.

    :::image type="content" source="./media/preview-features/preview-features-list.png" alt-text="Screenshot of Azure portal displaying a list of preview features.":::

1. From **Preview features** you can filter the list by **name**, **State**, or **Type**:

    - **Filter by name**: Must contain text from a preview feature's name, not the **Display name**.
    - **State**: Select the drop-down menu and choose a state. The portal doesn't filter by **Unregistered**.
    - **Type**: Select the drop-down menu and choose a type.

    :::image type="content" source="./media/preview-features/filter.png" alt-text="Screenshot of Azure portal with filter options for preview features.":::

# [Azure CLI](#tab/azure-cli)

To list all the subscription's preview features, use the [az feature list](/cli/azure/feature#az-feature-list) command.

The default output for Azure CLI is JSON. For more information about other output formats, see [Output formats for Azure CLI commands](/cli/azure/format-output-azure-cli).

```azurecli-interactive
az feature list
```

```json
{
  "id": "/subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Features/providers/
    Microsoft.Compute/features/InGuestPatchVMPreview",
  "name": "Microsoft.Compute/InGuestPatchVMPreview",
  "properties": {
    "state": "NotRegistered"
  },
  "type": "Microsoft.Features/providers/features"
}
```

To filter the output for a specific resource provider, use the `namespace` parameter. In this example, the `output` parameter specifies a table format.

```azurecli-interactive
az feature list --namespace Microsoft.Compute --output table
```

```Output
Name                                                RegistrationState
-------------------------------------------------   -------------------
Microsoft.Compute/AHUB                              Unregistered
Microsoft.Compute/AllowManagedDisksReplaceOSDisk    Registered
Microsoft.Compute/AllowPreReleaseRegions            Pending
Microsoft.Compute/InGuestPatchVMPreview             NotRegistered
```

To filter output for a specific preview feature, use the [az feature show](/cli/azure/feature#az-feature-show) command.

```azurecli-interactive
az feature show --name InGuestPatchVMPreview --namespace Microsoft.Compute --output table
```

```Output
Name                                     RegistrationState
---------------------------------------  -------------------
Microsoft.Compute/InGuestPatchVMPreview  NotRegistered
```

# [PowerShell](#tab/azure-powershell)

To list all the subscription's preview features, use the [Get-AzProviderFeature](/powershell/module/az.resources/get-azproviderfeature) cmdlet.

```azurepowershell-interactive
Get-AzProviderFeature -ListAvailable
```

```Output
FeatureName      ProviderName     RegistrationState
-----------      ------------     -----------------
betaAccess       Microsoft.AAD    NotRegistered
previewAccess    Microsoft.AAD    Registered
tipAccess        Microsoft.AAD    Pending
testAccess       Microsoft.AAD    Unregistered
```

To filter the output for a specific resource provider, use the `ProviderNamespace` parameter. The default output shows only the registered features. To display all preview features for a resource provider, use the `ListAvailable` parameter with the `ProviderNamespace` parameter.

```azurepowershell-interactive
Get-AzProviderFeature -ProviderNamespace "Microsoft.Compute" -ListAvailable
```

```Output
FeatureName                          ProviderName        RegistrationState
-----------                          ------------        -----------------
AHUB                                 Microsoft.Compute   Unregistered
AllowManagedDisksReplaceOSDisk       Microsoft.Compute   Registered
AllowPreReleaseRegions               Microsoft.Compute   Pending
InGuestPatchVMPreview                Microsoft.Compute   NotRegistered
```

You can filter the output for a specific preview feature using the `FeatureName` parameter.

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName "InGuestPatchVMPreview" -ProviderNamespace "Microsoft.Compute"
```

```Output
FeatureName             ProviderName        RegistrationState
-----------             ------------        -----------------
InGuestPatchVMPreview   Microsoft.Compute   NotRegistered
```

---

## Register preview feature

Register a preview feature in your Azure subscription to expose more functionality for a resource provider. Some preview features require approval.

After a preview feature is registered in your subscription, you'll see one of two states: **Registered** or **Pending**.

- For a preview feature that doesn't require approval, the state is **Registered**.
- If a preview feature requires approval, the registration state is **Pending**. You must request approval from the Azure service offering the preview feature. Usually, you request access through a support ticket.
  - To request approval, submit an [Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md).
  - After the registration is approved, the preview feature's state changes to **Registered**.

Some services require other methods, such as email, to get approval for pending request. Check announcements about the preview feature for information about how to get access.

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search box, enter _subscriptions_ and select **Subscriptions**.
1. Select the link for your subscription's name.
1. From the left menu, under **Settings** select **Preview features**.
1. Select the link for the preview feature you want to register.
1. Select **Register**.

    :::image type="content" source="./media/preview-features/register.png" alt-text="Screenshot of Azure portal with Register button for a preview feature.":::

1. Select **OK**.

The **Preview features** screen refreshes and the preview feature's **State** is displayed.

# [Azure CLI](#tab/azure-cli)

To register a preview feature, use the [az feature register](/cli/azure/feature#az-feature-register) command.

```azurecli-interactive
az feature register --name InGuestPatchVMPreview --namespace Microsoft.Compute
```

```json
{
  "id": "/subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Features/providers/
    Microsoft.Compute/features/InGuestPatchVMPreview",
  "name": "Microsoft.Compute/InGuestPatchVMPreview",
  "properties": {
    "state": "Registering"
  },
  "type": "Microsoft.Features/providers/features"
}
```

To view the registration's status, use the `az feature show` command.

```azurecli-interactive
az feature show --name InGuestPatchVMPreview --namespace Microsoft.Compute --output table
```

```Output
Name                                     RegistrationState
---------------------------------------  -------------------
Microsoft.Compute/InGuestPatchVMPreview  Registered
```

> [!NOTE]
> When the register command runs, a message is displayed that after the feature is registered, to run `az provider register --namespace <provider-name>` to propagate the changes.

# [PowerShell](#tab/azure-powershell)

To register a preview feature, use the [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) cmdlet.

```azurepowershell-interactive
Register-AzProviderFeature -FeatureName "InGuestPatchVMPreview" -ProviderNamespace "Microsoft.Compute"
```

```Output
FeatureName             ProviderName        RegistrationState
-----------             ------------        -----------------
InGuestPatchVMPreview   Microsoft.Compute   Registering
```

To view the registration's status, use the `Get-AzProviderFeature` cmdlet.

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName "InGuestPatchVMPreview" -ProviderNamespace "Microsoft.Compute"
```

```Output
FeatureName             ProviderName        RegistrationState
-----------             ------------        -----------------
InGuestPatchVMPreview   Microsoft.Compute   Registered
```

---

## Unregister preview feature

When you've finished using a preview feature, unregister it from your Azure subscription. You may notice two different statuses after unregistering the feature. If you unregister through the portal, the status is set to **Not registered**. If you unregister through Azure CLI, PowerShell, or REST API, the status is set to **Unregistered**. The status is different because the portal deletes the feature registration, but the commands unregister the feature. In both cases, the feature is no longer available in your subscription. In both cases, you can opt in to the feature again by re-registering it.

# [Portal](#tab/azure-portal)

You can unregister preview features from **Preview features**. The **State** changes to **Not registered**.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search box, enter _subscriptions_ and select **Subscriptions**.
1. Select the link for your subscription's name.
1. From the left menu, under **Settings** select **Preview features**.
1. Select the link for the preview feature you want to unregister.
1. Select **Unregister**.

    :::image type="content" source="./media/preview-features/unregister.png" alt-text="Screenshot of Azure portal with Unregister button for a preview feature.":::

1. Select **OK**.

# [Azure CLI](#tab/azure-cli)

To unregister a preview feature, use the [az feature unregister](/cli/azure/feature#az-feature-unregister) command. The `RegistrationState` state changes to **Unregistered**.

```azurecli-interactive
az feature unregister --name InGuestPatchVMPreview --namespace Microsoft.Compute
```

```json
{
  "id": "/subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Features/providers/
    Microsoft.Compute/features/InGuestPatchVMPreview",
  "name": "Microsoft.Compute/InGuestPatchVMPreview",
  "properties": {
    "state": "Unregistering"
  },
  "type": "Microsoft.Features/providers/features"
}
```

To view the unregistration's status, use the `az feature show` command.

```azurecli-interactive
az feature show --name InGuestPatchVMPreview --namespace Microsoft.Compute --output table
```

```Output
Name                                     RegistrationState
---------------------------------------  -------------------
Microsoft.Compute/InGuestPatchVMPreview  Unregistered
```

> [!NOTE]
> When the unregister command runs, a message is displayed that after the feature is unregistered, to run `az provider register --namespace <provider-name>` to propagate the changes.

To find **Unregistered** preview features, use the following command. Replace `<ResourceProvider.Name>` with a provider name such as `Microsoft.Compute`.

The following example displays an **Unregistered** preview feature for the `Microsoft.Compute` resource provider.

```azurecli-interactive
az feature list --namespace <ResourceProvider.Name> --query "[?properties.state=='Unregistered'].{Name:name, RegistrationState:properties.state}" --output table
```

```Output
Name                                     RegistrationState
---------------------------------------  -------------------
Microsoft.Compute/InGuestPatchVMPreview  Unregistered
```

# [PowerShell](#tab/azure-powershell)

To unregister a preview feature, use the [Unregister-AzProviderFeature](/powershell/module/az.resources/unregister-azproviderfeature) cmdlet. The `RegistrationState` state changes to **Unregistered**.

```azurepowershell-interactive
Unregister-AzProviderFeature -FeatureName "InGuestPatchVMPreview" -ProviderNamespace "Microsoft.Compute"
```

```Output
FeatureName             ProviderName        RegistrationState
-----------             ------------        -----------------
InGuestPatchVMPreview   Microsoft.Compute   Unregistering
```

To view the unregistration's status, use the `Get-AzProviderFeature` cmdlet.

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName "InGuestPatchVMPreview" -ProviderNamespace "Microsoft.Compute"
```

```Output
FeatureName             ProviderName        RegistrationState
-----------             ------------        -----------------
InGuestPatchVMPreview   Microsoft.Compute   Unregistered
```

The following example displays an **Unregistered** preview feature for the `Microsoft.Compute` resource provider.

```azurepowershell-interactive
Get-AzProviderFeature  -ProviderNamespace "Microsoft.Compute" -ListAvailable | Where-Object { $_.RegistrationState -eq "Unregistered" }
```

```Output
FeatureName             ProviderName        RegistrationState
-----------             ------------        -----------------
InGuestPatchVMPreview   Microsoft.Compute   Unregistered
```

---

## Next steps

- To use REST API calls and list, register, or unregister preview features, see the [Features](/rest/api/resources/features) documentation.
- For more information about how to register a resource provider, see [Azure resource providers and types](resource-providers-and-types.md).
- For a list that maps resource providers to Azure services, see [Resource providers for Azure services](azure-services-resource-providers.md).
