## Prepare to authenticate Resource Manager requests

You must authenticate all the operations that you perform on resources using the [Azure Resource Manager][lnk-authenticate-arm] with Azure Active Directory (AD). The easiest way to configure this is to use PowerShell or Azure CLI.

You should install [Azure PowerShell 1.0][lnk-powershell-install] or later before you continue.

The following steps show how to set up password authentication for an AD application using PowerShell. You can run these commands in a standard PowerShell session.

1. Log in to your Azure subscription using the following command:

    ```
    Login-AzureRmAccount
    ```

2. Make a note of your **TenantId** and **SubscriptionId**. You will need them later.

3. Create a new Azure Active Directory application using the following command, replacing the place holders:

    - **{Display name}:** a display name for your application such as **MySampleApp**
    - **{Home page URL}:** the URL of the home page of your app such as **http://mysampleapp/home**. This URL does not need to point to a real application.
    - **{Application identifier}:** A unique identifier such as **http://mysampleapp**. This URL does not need to point to a real application.
    - **{Password}:** A password that you will use to authenticate with your app.

    ```
    New-AzureRmADApplication -DisplayName {Display name} -HomePage {Home page URL} -IdentifierUris {Application identifier} -Password {Password}
    ```
    
4. Make a note of the **ApplicationId** of the application you created. You will need this later.

5. Create a new service principal using the following command, replacing **{MyApplicationId}** with the **ApplicationId** from the previous step:

    ```
    New-AzureRmADServicePrincipal -ApplicationId {MyApplicationId}
    ```
    
6. Setup a role assignment using the following command, replacing **{MyApplicationId}** with your **ApplicationId**.

    ```
    New-AzureRmRoleAssignment -RoleDefinitionName Owner -ServicePrincipalName {MyApplicationId}
    ```
    
You have now finished creating the Azure AD application that will enable you to authenticate from your custom C# application. You will need the following values later in this tutorial:

- TenantId
- SubscriptionId
- ApplicationId
- Password

[lnk-authenticate-arm]: https://msdn.microsoft.com/library/azure/dn790557.aspx
[lnk-powershell-install]: ../articles/powershell-install-configure.md
