---
services: microsoft-graph, app-service-web
author: rwike77
manager: CelesteDG

ms.service: app-service
ms.topic: include
ms.workload: identity
ms.date: 08/19/2022
ms.author: ryanwi
ms.reviewer: stsoneff
ms.custom: azureday1
ms.subservice: web-apps
---

Learn how to access Microsoft Graph from a web app running on Azure App Service.

:::image type="content" alt-text="Diagram that shows accessing Microsoft Graph." source="../../media/scenario-secure-app-access-microsoft-graph/web-app-access-graph.svg" border="false":::

You want to call Microsoft Graph for the web app. A safe way to give your web app access to data is to use a [system-assigned managed identity](../../../active-directory/managed-identities-azure-resources/overview.md). A managed identity from Microsoft Entra ID allows App Service to access resources through role-based access control (RBAC), without requiring app credentials. After assigning a managed identity to your web app, Azure takes care of the creation and distribution of a certificate. You don't have to worry about managing secrets or app credentials.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create a system-assigned managed identity on a web app.
> * Add Microsoft Graph API permissions to a managed identity.
> * Call Microsoft Graph from a web app by using managed identities.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* A web application running on Azure App Service that has the [App Service authentication/authorization module enabled](../../scenario-secure-app-authentication-app-service.md).

## Enable managed identity on app

If you create and publish your web app through Visual Studio, the managed identity was enabled on your app for you. 

1. In your app service, select **Identity** in the left pane and then select **System assigned**. 
1. Verify that **Status** is set to **On**. If not, select **Save** and then select **Yes** to enable the system-assigned managed identity. When the managed identity is enabled, the status is set to **On** and the object ID is available.

1. Take note of the **Object ID** value, which you'll need in the next step.

:::image type="content" alt-text="Screenshot that shows the system-assigned identity." source="../../media/scenario-secure-app-access-microsoft-graph/create-system-assigned-identity.png":::

## Grant access to Microsoft Graph

When accessing the Microsoft Graph, the managed identity needs to have proper permissions for the operation it wants to perform. Currently, there's no option to assign such permissions through the Microsoft Entra admin center. 

1. Run the following script to add the requested Microsoft Graph API permissions to the managed identity service principal object.

    # [PowerShell](#tab/azure-powershell)
    
    ```powershell
    # Install the module.
    # Install-Module Microsoft.Graph -Scope CurrentUser
    
    # The tenant ID
    $TenantId = "11111111-1111-1111-1111-111111111111"
    
    # The name of your web app, which has a managed identity.
    $webAppName = "SecureWebApp-20201106120003" 
    $resourceGroupName = "SecureWebApp-20201106120003ResourceGroup"
    
    # The name of the app role that the managed identity should be assigned to.
    $appRoleName = "User.Read.All"
    
    # Get the web app's managed identity's object ID.
    Connect-AzAccount -Tenant $TenantId
    $managedIdentityObjectId = (Get-AzWebApp -ResourceGroupName $resourceGroupName -Name $webAppName).identity.principalid
    
    Connect-MgGraph -TenantId $TenantId -Scopes 'Application.Read.All','AppRoleAssignment.ReadWrite.All'
    
    # Get Microsoft Graph app's service principal and app role.
    $serverApplicationName = "Microsoft Graph"
    $serverServicePrincipal = (Get-MgServicePrincipal -Filter "DisplayName eq '$serverApplicationName'")
    $serverServicePrincipalObjectId = $serverServicePrincipal.Id
    
    $appRoleId = ($serverServicePrincipal.AppRoles | Where-Object {$_.Value -eq $appRoleName }).Id
    
    # Assign the managed identity access to the app role.
    New-MgServicePrincipalAppRoleAssignment `
        -ServicePrincipalId $managedIdentityObjectId `
        -PrincipalId $managedIdentityObjectId `
        -ResourceId $serverServicePrincipalObjectId `
        -AppRoleId $appRoleId
    ```

    # [Azure CLI](#tab/azure-cli)
    
    ```azurecli-interactive
    az login
    
    webAppName="SecureWebApp-20201106120003"
    
    spId=$(az resource list -n $webAppName --query [*].identity.principalId --out tsv)
    
    graphResourceId=$(az ad sp list --display-name "Microsoft Graph" --query [0].id --out tsv)
    
    appRoleId=$(az ad sp list --display-name "Microsoft Graph" --query "[0].appRoles[?value=='User.Read.All' && contains(allowedMemberTypes, 'Application')].id" --output tsv)
    
    uri=https://graph.microsoft.com/v1.0/servicePrincipals/$spId/appRoleAssignments
    
    body="{'principalId':'$spId','resourceId':'$graphResourceId','appRoleId':'$appRoleId'}"
    
    az rest --method post --uri $uri --body $body --headers "Content-Type=application/json"
    ```

    ---

1. After executing the script, you can verify in the [Microsoft Entra admin center](https://entra.microsoft.com) that the requested API permissions are assigned to the managed identity.

1. Go to **Applications**, and then select **Enterprise applications**. This pane displays all the service principals in your tenant. **Add a filter** for "Application type==Managed identities" and select the service principal for the managed identity.

    If you're following this tutorial, there are two service principals with the same display name (SecureWebApp2020094113531, for example). The service principal that has a **Homepage URL** represents the web app in your tenant. The service principal that appears in **Managed Identities** should *not* have a **Homepage URL** listed and the **Object ID** should match the object ID value of the managed identity in the [previous step](#enable-managed-identity-on-app).

1. Select the service principal for the managed identity.

    :::image type="content" alt-text="Screenshot that shows the All applications option." source="../../media/scenario-secure-app-access-microsoft-graph/enterprise-apps-all-applications.png":::

1. In **Overview**, select **Permissions**, and you'll see the added permissions for Microsoft Graph.

    :::image type="content" alt-text="Screenshot that shows the Permissions pane." source="../../media/scenario-secure-app-access-microsoft-graph/enterprise-apps-permissions.png":::
