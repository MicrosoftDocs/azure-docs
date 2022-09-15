---
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.topic: include
ms.date: 10/26/2018
---
## Prepare to authenticate Azure Resource Manager requests
You must authenticate all the operations that you perform on resources using the [Azure Resource Manager][lnk-authenticate-arm] with Azure Active Directory (AD). The easiest way to configure Azure AD is to use PowerShell or Azure CLI.

Install the [Azure PowerShell cmdlets][lnk-powershell-install] before you continue.

The following steps show how to set up password authentication for an AD application using PowerShell. You can run these commands in a standard PowerShell session.

1. Sign in to your Azure subscription using the following command:

    ```powershell
    Connect-AzAccount
    ```

1. If you have multiple Azure subscriptions, signing in to Azure grants you access to all the Azure subscriptions associated with your credentials. 

   List the Azure subscriptions available for you to use:

   ```powershell
   Get-AzSubscription
   ```

   Select the subscription you want to use. You can use either the subscription name or ID from the output of the previous command.

   ```powershell
   Select-AzSubscription -SubscriptionName "{your subscription name}"
   ```

1. Save your **Id** and **TenantId** for later.

1. Create a new Azure Active Directory application using the following command, replacing the placeholders:
   
   * **{Display name}:** a display name for your application such as **MySampleApp**
   * **{Home page URL}:** the URL of the home page of your app such as **http:\//mysampleapp/home**. This URL doesn't need to point to a real application.
   * **{Application identifier}:** A unique identifier such as **http:\//mysampleapp**. This URL doesn't need to point to a real application.
   * **{Password}:** A password that you use to authenticate with your app.
     
     ```powershell
     $SecurePassword=ConvertTo-SecureString {password} -asplaintext -force
     New-AzADApplication -DisplayName {Display name} -HomePage {Home page URL} -IdentifierUris {Application identifier} -Password $SecurePassword
     ```
1. Save the **ApplicationId** of the application you created for later.

1. Create a new service principal using the following command, replacing **{MyApplicationId}** with the **ApplicationId** from the previous step:
   
    ```powershell
    New-AzADServicePrincipal -ApplicationId {MyApplicationId}
    ```

1. Set up a role assignment using the following command, replacing **{MyApplicationId}** with your **ApplicationId**.
   
    ```powershell
    New-AzRoleAssignment -RoleDefinitionName Owner -ServicePrincipalName {MyApplicationId}
    ```

With your new Azure AD application, you can now authenticate from your custom C# application. 

You need the following values later in this tutorial:

* TenantId
* SubscriptionId
* ApplicationId
* Password

[lnk-authenticate-arm]: /rest/api/
[lnk-powershell-install]: /powershell/azure/install-az-ps