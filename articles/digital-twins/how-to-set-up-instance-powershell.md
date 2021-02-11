---
# Mandatory fields.
title: Set up an instance and authentication (PowerShell)
titleSuffix: Azure Digital Twins
description: See how to set up an instance of the Azure Digital Twins service using Azure PowerShell
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 12/16/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
ms.custom: devx-track-azurepowershell
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Set up an Azure Digital Twins instance and authentication (PowerShell)

[!INCLUDE [digital-twins-setup-selector.md](../../includes/digital-twins-setup-selector.md)]

This article covers the steps to **set up a new Azure Digital Twins instance**, including creating
the instance and setting up authentication. After completing this article, you will have an Azure
Digital Twins instance ready to start programming against.

This version of this article goes through these steps manually, one by one, using [Azure PowerShell](/powershell/azure/new-azureps-module-az).

* To go through these steps manually using the Azure portal, see the portal version of this article: [*How-to: Set up an instance and authentication (portal)*](how-to-set-up-instance-portal.md).
* To run through an automated setup using a deployment script sample, see the scripted version of this article: [*How-to: Set up an instance and authentication (scripted)*](how-to-set-up-instance-scripted.md).

[!INCLUDE [digital-twins-setup-steps.md](../../includes/digital-twins-setup-steps.md)]
[!INCLUDE [digital-twins-setup-permissions.md](../../includes/digital-twins-setup-permissions.md)]

## Prepare your environment

1. First, choose where to run the commands in this article. You can choose to run Azure PowerShell commands using a local installation of Azure PowerShell, or in a browser window using [Azure Cloud Shell](https://shell.azure.com).
    * If you choose to use Azure PowerShell locally:
       1. [Install the Az PowerShell module](/powershell/azure/install-az-ps).
       1. Open a PowerShell window on your machine.
       1. Connect to your Azure account using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.
    * If you choose to use Azure Cloud Shell:
        1. See [Overview of Azure Cloud Shell](../cloud-shell/overview.md) for more information about Cloud Shell.
        1. Open a Cloud Shell window by following [this link](https://shell.azure.com) in your browser.
        1. In the Cloud Shell icon bar, make sure your Cloud Shell is set to run the PowerShell version.
    
            :::image type="content" source="media/how-to-set-up-instance/cloud-shell/cloud-shell-powershell.png" alt-text="Cloud Shell window showing selection of the PowerShell version":::
    
1. If you have multiple Azure subscriptions, choose the appropriate subscription in which the resources should be billed. Select a specific subscription using the
   [Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

   ```azurepowershell-interactive
   Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
   ```

1. If this is your first time using Azure Digital Twins with this subscription, you must register the **Microsoft.DigitalTwins** resource provider. (If you're not sure, it's ok to run it again even if you've done it sometime in the past.)

   ```azurepowershell-interactive
   Register-AzResourceProvider -ProviderNamespace Microsoft.DigitalTwins
   ```

1. Use the following command to install the **Az.DigitalTwins** PowerShell module.
    ```azurepowershell-interactive
    Install-Module -Name Az.DigitalTwins
    ```

> [!IMPORTANT]
> While the **Az.DigitalTwins** PowerShell module is in preview, you must install it separately
> using the `Install-Module` cmdlet as described above. After this PowerShell module becomes generally available, it
> will be part of future Az PowerShell module releases and available by default from within Azure
> Cloud Shell.

## Create the Azure Digital Twins instance

In this section, you will **create a new instance of Azure Digital Twins** using Azure PowerShell.
You'll need to provide:

* An [Azure resource group](../azure-resource-manager/management/overview.md) where the instance will be deployed. If you don't
  already have an existing resource group, you can create one using the
  [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet:

  ```azurepowershell-interactive
  New-AzResourceGroup -Name <name-for-your-resource-group> -Location <region>
  ```

* A region for the deployment. To see what regions support Azure Digital Twins, visit
  [*Azure products available by region*](https://azure.microsoft.com/global-infrastructure/services/?products=digital-twins).
* A name for your instance. The name of the new instance must be unique within the region for your
  subscription. If your subscription has another Azure Digital Twins instance in the region that's
  already using the specified name, you'll be asked to pick a different name.

Use your values in the following command to create the instance:

```azurepowershell-interactive
New-AzDigitalTwinsInstance -ResourceGroupName <your-resource-group> -ResourceName <name-for-your-Azure-Digital-Twins-instance> -Location <region>
```

### Verify success and collect important values

If the instance was created successfully, the result looks similar to the following output
containing information about the resource you've created:

```Output
Location   Name                                         Type
--------   ----                                         ----
<region>   <name-for-your-Azure-Digital-Twins-instance> Microsoft.DigitalTwins/digitalTwinsInstances
```

Next, display the properties of your new instance by running `Get-AzDigitalTwinsInstance` and piping to `Select-Object -Property *`, like this:

```azurepowershell-interactive
Get-AzDigitalTwinsInstance -ResourceGroupName <your-resource-group> -ResourceName <name-for-your-Azure-Digital-Twins-instance> |
  Select-Object -Property *
```

> [!TIP]
> You can use this command to see all the properties of your instance at any time.

Note the Azure Digital Twins instance's **HostName**, **Name**, and **ResourceGroup**. These are
important values that you may need as you continue working with your Azure Digital Twins instance,
to set up authentication, and related Azure resources. If other users will be programming against
the instance, you should share these values with them.

You now have an Azure Digital Twins instance ready to go. Next, you'll give the appropriate Azure
user permissions to manage it.

## Set up user access permissions

[!INCLUDE [digital-twins-setup-role-assignment.md](../../includes/digital-twins-setup-role-assignment.md)]

First, determine the **ObjectId** for the Azure AD account of the user that should be assigned the role. You can find this value using the [Get-AzAdUser](/powershell/module/az.resources/get-azaduser) cmdlet, by passing in the user principal name on the Azure AD account to retrieve their ObjectId (and other user information). In most cases, the user principal name will match the user's email on the Azure AD account.

```azurepowershell-interactive
Get-AzADUser -UserPrincipalName <Azure-AD-user-principal-name-of-user-to-assign>
```

Next, use the **ObjectId** in the following command to assign the role. The command also requires you to enter the same subscription ID, resource group name, and
Azure Digital Twins instance name that you chose earlier when creating the instance. The command must be run by a user with
[sufficient permissions](#prerequisites-permission-requirements) in the Azure subscription.

```azurepowershell-interactive
$Params = @{
  ObjectId = '<Azure-AD-user-object-id-of-user-to-assign>'
  RoleDefinitionName = 'Azure Digital Twins Data Owner'
  Scope = '/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.DigitalTwins/digitalTwinsInstances/<name-for-your-Azure-Digital-Twins-instance>'
}
New-AzRoleAssignment @Params
```

The result of this command is outputted information about the role assignment that's been created.

### Verify success

[!INCLUDE [digital-twins-setup-verify-role-assignment.md](../../includes/digital-twins-setup-verify-role-assignment.md)]

You now have an Azure Digital Twins instance ready to go, and have assigned permissions to manage it.

## Next steps

See how to connect a client application to your instance with authentication code:
* [*How-to: Write app authentication code*](how-to-authenticate-client.md)
