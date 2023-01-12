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
ms.devlang: 
ms.custom: azureday1, devx-track-azurepowershell
ms.subservice: web-apps
---

Learn how to access Microsoft Graph from a web app running on Azure App Service.

:::image type="content" alt-text="Diagram that shows accessing Microsoft Graph." source="../../media/scenario-secure-app-access-microsoft-graph/web-app-access-graph.svg" border="false":::

You want to call Microsoft Graph for the web app. A safe way to give your web app access to data is to use a [system-assigned managed identity](../../../active-directory/managed-identities-azure-resources/overview.md). A managed identity from Azure Active Directory allows App Service to access resources through role-based access control (RBAC), without requiring app credentials. After assigning a managed identity to your web app, Azure takes care of the creation and distribution of a certificate. You don't have to worry about managing secrets or app credentials.

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

When accessing the Microsoft Graph, the managed identity needs to have proper permissions for the operation it wants to perform. Currently, there's no option to assign such permissions through the Azure portal. 

1. Run the following script to add the requested Microsoft Graph API permissions to the managed identity service principal object.

    # [PowerShell](#tab/azure-powershell)
    
    ```powershell
    # Install the module. (You need admin on the machine.)
    # Install-Module AzureAD.
    
    # Your tenant ID (in the Azure portal, under Azure Active Directory > Overview).
    $TenantID="<tenant-id>"
    $resourceGroup = "securewebappresourcegroup"
    $webAppName="SecureWebApp-20201102125811"
    
    # Get the ID of the managed identity for the web app.
    $spID = (Get-AzWebApp -ResourceGroupName $resourceGroup -Name $webAppName).identity.principalid
    
    # Check the Microsoft Graph documentation for the permission you need for the operation.
    $PermissionName = "User.Read.All"
    
    Connect-AzureAD -TenantId $TenantID
    
    # Get the service principal for Microsoft Graph.
    # First result should be AppId 00000003-0000-0000-c000-000000000000
    $GraphServicePrincipal = Get-AzureADServicePrincipal -SearchString "Microsoft Graph" | Select-Object -first 1
    
    # Assign permissions to the managed identity service principal.
    $AppRole = $GraphServicePrincipal.AppRoles | `
    Where-Object {$_.Value -eq $PermissionName -and $_.AllowedMemberTypes -contains "Application"}
    
    New-AzureAdServiceAppRoleAssignment -ObjectId $spID -PrincipalId $spID `
    -ResourceId $GraphServicePrincipal.ObjectId -Id $AppRole.Id
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

1. After executing the script, you can verify in the [Azure portal](https://portal.azure.com) that the requested API permissions are assigned to the managed identity.

1. Go to **Azure Active Directory**, and then select **Enterprise applications**. This pane displays all the service principals in your tenant. In **Managed Identities**, select the service principal for the managed identity.

    If you're following this tutorial, there are two service principals with the same display name (SecureWebApp2020094113531, for example). The service principal that has a **Homepage URL** represents the web app in your tenant. The service principal that appears in **Managed Identities** should *not* have a **Homepage URL** listed and the **Object ID** should match the object ID value of the managed identity in the [previous step](#enable-managed-identity-on-app).

1. Select the service principal for the managed identity.

    :::image type="content" alt-text="Screenshot that shows the All applications option." source="../../media/scenario-secure-app-access-microsoft-graph/enterprise-apps-all-applications.png":::

1. In **Overview**, select **Permissions**, and you'll see the added permissions for Microsoft Graph.

    :::image type="content" alt-text="Screenshot that shows the Permissions pane." source="../../media/scenario-secure-app-access-microsoft-graph/enterprise-apps-permissions.png":::