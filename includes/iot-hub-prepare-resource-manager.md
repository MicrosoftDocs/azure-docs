---
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.custom: devx-track-azurepowershell, devx-track-arm-template
ms.topic: include
ms.date: 10/26/2018
---
## Prepare to authenticate Azure Resource Manager requests
You must authenticate all the operations that you perform on resources using the [Azure Resource Manager][lnk-authenticate-arm] with Azure Active Directory (AD). The easiest way to configure Azure AD is to use PowerShell or Azure CLI.

Install the [Azure PowerShell cmdlets][lnk-powershell-install] before you continue.

The following steps show how to set up authentication for your app to register with Azure Active Directory. You can run these commands in a standard PowerShell session. Registering with Azure Active Directory is necessary to authenticate any future REST calls. For more information, see [How and why applications are added to Azure AD](../articles/active-directory/develop/active-directory-how-applications-are-added.md).

1. Sign in to your Azure subscription using the following command. If you're using PowerShell in Azure Cloud Shell you're already signed in, so you can skip this step.

    ```powershell
    Connect-AzAccount
    ```

1. If you have multiple Azure subscriptions, signing in to Azure grants you access to all the Azure subscriptions associated with your credentials. 

   List the Azure subscriptions available for you to use:

   ```powershell
   Get-AzSubscription
   ```

   Select the subscription you want to use. You can use either the `Name` or `Id` from the output of the previous command.

   ```powershell
   Select-AzSubscription -SubscriptionName "{your subscription Name or Id}"
   ```

1. Save your `Id` and `TenantId` for later.

1. Create a new Azure Active Directory application using the following command, replacing these placeholders with your own values:
   
   * **{Display name}:** a display name for your application such as **MySampleApp**
   * **{Application identifier}:** A unique identifier such as your primary domain. To find the primary domain associated with your subscription, go to the [Azure portal](https://ms.portal.azure.com/#home) in the **Azure Active Directory** service on its **Overview page** and find **Primary domain**. See the different domain possibilities in the [Azure Active Directory app manifest](../articles/active-directory/develop/reference-app-manifest.md#identifieruris-attribute). Be sure to add `/your-id` at the end of your domain (`your-Id` can be any name), for example, `"https://microsoft.onmicrosoft.com/my-unique-ad-app"`.

   :::image type="content" source="/includes/media/iot-hub-prepare-resource-manager/find-domain.png" alt-text="Screenshot showing location of your Primary domain in the Azure portal.":::
     
     ```powershell
     $myApp = New-AzADApplication -DisplayName "<your-display-name>" -IdentifierUris "<your-domain>/<your-id>"
     New-AzADServicePrincipal -AppId $myApp.AppId
     ```
     A confirmation of your `Display name`, `Id`, and `AppId` will print to the console.

1. Save the **AppId** of the application you created for later.

1. Set up a role assignment authorization using the following command, replacing **{MyAppId}** with your **AppId**.
   
    ```powershell
    New-AzRoleAssignment -RoleDefinitionName "Owner" -ApplicationId {MyAppId}
    ```

   To understand roles and permissions, see [Create or update Azure custom roles using Azure PowerShell](../articles/role-based-access-control/custom-roles-powershell.md).

With your new Azure AD application, you can now authenticate from your custom C# application. 

You need the following values later in this tutorial:

* TenantId
* SubscriptionId
* AppId

[lnk-authenticate-arm]: /rest/api/
[lnk-powershell-install]: /powershell/azure/install-az-ps
