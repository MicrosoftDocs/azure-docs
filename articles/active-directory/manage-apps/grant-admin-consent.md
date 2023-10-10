---
title: Grant tenant-wide admin consent to an application 
description: Learn how to grant tenant-wide consent to an application so that end-users aren't prompted for consent when signing in to an application.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 04/14/2023
ms.author: jomondi
ms.reviewer: ergreenl
ms.collection: M365-identity-device-management
ms.custom: contperf-fy22q2, enterprise-apps
zone_pivot_groups: enterprise-apps-minus-former-powershell

#customer intent: As an admin, I want to grant tenant-wide admin consent to an application in Microsoft Entra ID.
---

# Grant tenant-wide admin consent to an application

  In this article, you'll learn how to grant tenant-wide admin consent to an application in Microsoft Entra ID. To understand how individual users consent, see [Configure how end-users consent to applications](configure-user-consent.md).

When you grant tenant-wide admin consent to an application, you give the application access on behalf of the whole organization to the permissions requested. Granting admin consent on behalf of an organization is a sensitive operation, potentially allowing the application's publisher access to significant portions of your organization's data, or the permission to do highly privileged operations. Examples of such operations might be role management, full access to all mailboxes or all sites, and full user impersonation. Carefully review the permissions that the application is requesting before you grant consent.

By default, granting tenant-wide admin consent to an application will allow all users to access the application unless otherwise restricted. To restrict which users can sign-in to an application, configure the app to [require user assignment](application-properties.md#assignment-required) and then [assign users or groups to the application](assign-user-or-group-access-portal.md). 

Granting tenant-wide admin consent may revoke any permissions that had previously been granted tenant-wide for that application. Permissions that have previously been granted by users on their own behalf won't be affected.

## Prerequisites

Granting tenant-wide admin consent requires you to sign in as a user that is authorized to consent on behalf of the organization.

To grant tenant-wide admin consent, you need:

- A Microsoft Entra user account with one of the following roles:

   - Global Administrator or Privileged Role Administrator, for granting consent for apps requesting any permission, for any API.
   - Cloud Application Administrator or Application Administrator, for granting consent for apps requesting any permission for any API, _except_ Azure AD Graph or Microsoft Graph app roles (application permissions).
   - A custom directory role that includes the [permission to grant permissions to applications](../roles/custom-consent-permissions.md), for the permissions required by the application.

## Grant tenant-wide admin consent in Enterprise apps

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

You can grant tenant-wide admin consent through the **Enterprise applications** panel if the application has already been provisioned in your tenant. For example, an app could be provisioned in your tenant if at least one user has already consented to the application. For more information, see [How and why applications are added to Microsoft Entra ID](../develop/how-applications-are-added.md).

:::zone pivot="portal"

To grant tenant-wide admin consent to an app listed in **Enterprise applications**:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **All applications**.
1. Enter the name of the existing application in the search box, and then select the application from the search results.
1. Select **Permissions** under **Security**.
   :::image type="content" source="media/grant-tenant-wide-admin-consent/grant-tenant-wide-admin-consent.png" alt-text="Screenshot shows how to grant tenant-wide admin consent.":::
1. Carefully review the permissions that the application requires. If you agree with the permissions the application requires, select **Grant admin consent**.

## Grant admin consent in App registrations

For applications your organization has developed, or which are registered directly in your Microsoft Entra tenant, you can also grant tenant-wide admin consent from **App registrations** in the Microsoft Entra admin centerMicrosoft Entra admin center.

To grant tenant-wide admin consent from **App registrations**:

1. On the Microsoft Entra admin center, browse to **Identity** > **Applications** > **App registrations** > **All applications**.
1. Enter the name of the existing application in the search box, and then select the application from the search results.
1. Select **API permissions** under **Manage**.
1. Carefully review the permissions that the application requires. If you agree, select **Grant admin consent**.

## Construct the URL for granting tenant-wide admin consent

When granting tenant-wide admin consent using either method described above, a window opens from the Microsoft Entra admin center to prompt for tenant-wide admin consent. If you know the client ID (also known as the application ID) of the application, you can build the same URL to grant tenant-wide admin consent.

The tenant-wide admin consent URL follows the following format:

```http
https://login.microsoftonline.com/{organization}/adminconsent?client_id={client-id}
```

where:

- `{client-id}` is the application's client ID (also known as app ID).
- `{organization}` is the tenant ID or any verified domain name of the tenant you want to consent the application in. You can use the value `organizations`, which will cause the consent to happen in the home tenant of the user you sign in with.

As always, carefully review the permissions an application requests before granting consent.

For more information on constructing the tenant-wide admin consent URL, see [Admin consent on the Microsoft identity platform](../develop/v2-admin-consent.md).

:::zone-end


:::zone pivot="ms-powershell"

In the following example, you'll grant delegated permissions defined by a resource enterprise application to a client enterprise application on behalf of all users.

In the example, the resource enterprise application is Microsoft Graph of object ID `7ea9e944-71ce-443d-811c-71e8047b557a`. The Microsoft Graph defines the delegated permissions, `User.Read.All` and `Group.Read.All`. The consentType is `AllPrincipals`, indicating that you're consenting on behalf of all users in the tenant. The object ID of the client enterprise application is `b0d9b9e3-0ecf-4bfd-8dab-9273dd055a941`.

> [!CAUTION] 
> Be careful! Permissions granted programmatically are not subject to review or confirmation. They take effect immediately.

## Grant admin consent for delegated permissions

1. Connect to Microsoft Graph PowerShell and sign in as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).

   ```powershell
   Connect-MgGraph -Scopes "Application.ReadWrite.All", "DelegatedPermissionGrant.ReadWrite.All"
   ```

1. Retrieve all the delegated permissions defined by Microsoft graph (the resource application) in your tenant application. Identify the delegated permissions that you'll grant the client application. In this example, the delegation permissions are `User.Read.All` and `Group.Read.All`
   
   ```powershell
   Get-MgServicePrincipal -Filter "displayName eq 'Microsoft Graph'" -Property Oauth2PermissionScopes | Select -ExpandProperty Oauth2PermissionScopes | fl
   ```

1. Grant the delegated permissions to the client enterprise application by running the following request.
   
```powershell
$params = @{
  
  "ClientId" = "b0d9b9e3-0ecf-4bfd-8dab-9273dd055a94"
  "ConsentType" = "AllPrincipals"
  "ResourceId" = "7ea9e944-71ce-443d-811c-71e8047b557a"
  "Scope" = "User.Read.All Group.Read.All"
}

New-MgOauth2PermissionGrant -BodyParameter $params | 
  Format-List Id, ClientId, ConsentType, ResourceId, Scope
```
     
4. Confirm that you've granted tenant wide admin consent by running the following request.   
    
  ```powershell
   Get-MgOauth2PermissionGrant -Filter "clientId eq 'b0d9b9e3-0ecf-4bfd-8dab-9273dd055a94' consentType eq 'AllPrincipals'" 
  ```      
## Grant admin consent for application permissions

In the following example, you grant the Microsoft Graph enterprise application (the principal of ID `b0d9b9e3-0ecf-4bfd-8dab-9273dd055a94`) an app role (application permission) of ID `df021288-bdef-4463-88db-98f22de89214` that's exposed by a resource enterprise application of ID `7ea9e944-71ce-443d-811c-71e8047b557a`.

1. Connect to Microsoft Graph PowerShell and sign in as a [Global Administrator](../roles/permissions-reference.md#global-administrator).

   ```powershell
   Connect-MgGraph -Scopes "Application.ReadWrite.All", "AppRoleAssignment.ReadWrite.All"
   ```

1. Retrieve the app roles defined by Microsoft graph in your tenant. Identify the app role that you'll grant the client enterprise application. In this example, the app role ID is `df021288-bdef-4463-88db-98f22de89214`.

   ```powershell
   Get-MgServicePrincipal -Filter "displayName eq 'Microsoft Graph'" -Property AppRoles | Select -ExpandProperty appRoles |fl
   ```
  
1. Grant the application permission (app role) to the client enterprise application by running the following request.

```powershell
 $params = @{
  "PrincipalId" ="b0d9b9e3-0ecf-4bfd-8dab-9273dd055a94"
  "ResourceId" = "2cab1707-656d-40cc-8522-3178a184e03d"
  "AppRoleId" = "df021288-bdef-4463-88db-98f22de89214"
}

New-MgServicePrincipalAppRoleAssignment -ServicePrincipalId '2cab1707-656d-40cc-8522-3178a184e03d' -BodyParameter $params | 
  Format-List Id, AppRoleId, CreatedDateTime, PrincipalDisplayName, PrincipalId, PrincipalType, ResourceDisplayName
```

:::zone-end

:::zone pivot="ms-graph"

Use [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) to grant both delegated and application permissions. 

## Grant admin consent for delegated permissions

In the following example, you'll grant delegated permissions defined by a resource enterprise application to a client enterprise application on behalf of all users. 

You need to sign in as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).

In the example, the resource enterprise application is Microsoft Graph of object ID `7ea9e944-71ce-443d-811c-71e8047b557a`. The Microsoft Graph defines the delegated permissions, `User.Read.All` and `Group.Read.All`. The consentType is `AllPrincipals`, indicating that you're consenting on behalf of all users in the tenant. The object ID of the client enterprise application is `b0d9b9e3-0ecf-4bfd-8dab-9273dd055a941`.

> [!CAUTION] 
> Be careful! Permissions granted programmatically are not subject to review or confirmation. They take effect immediately.

1. Retrieve all the delegated permissions defined by Microsoft graph (the resource application) in your tenant application. Identify the delegated permissions that you'll grant the client application. In this example, the delegation permissions are `User.Read.All` and `Group.Read.All`
   
   ```http
   GET https://graph.microsoft.com/v1.0/servicePrincipals?$filter=displayName eq 'Microsoft Graph'&$select=id,displayName,appId,oauth2PermissionScopes
   ```

1. Grant the delegated permissions to the client enterprise application by running the following request.
   
   ```http
   POST https://graph.microsoft.com/v1.0/oauth2PermissionGrants
   
   Request body
   {
      "clientId": "b0d9b9e3-0ecf-4bfd-8dab-9273dd055a94",
      "consentType": "AllPrincipals",
      "resourceId": "7ea9e944-71ce-443d-811c-71e8047b557a",
      "scope": "User.Read.All Group.Read.All"
   }
   ```
1. Confirm that you've granted tenant wide admin consent by running the following request.

   ```http
   GET https://graph.microsoft.com/v1.0/oauth2PermissionGrants?$filter=clientId eq 'b0d9b9e3-0ecf-4bfd-8dab-9273dd055a94' and consentType eq 'AllPrincipals'
   ```
## Grant admin consent for application permissions

In the following example, you grant the Microsoft Graph enterprise application (the principal of ID `b0d9b9e3-0ecf-4bfd-8dab-9273dd055a94`) an app role (application permission) of ID `df021288-bdef-4463-88db-98f22de89214` that's exposed by a resource enterprise application of ID `7ea9e944-71ce-443d-811c-71e8047b557a`. 

You need to sign in as sign as a [Global Administrator](../roles/permissions-reference.md#global-administrator).

1. Retrieve the app roles defined by Microsoft graph in your tenant. Identify the app role that you'll grant the client enterprise application. In this example, the app role ID is `df021288-bdef-4463-88db-98f22de89214`

   ```http
   GET https://graph.microsoft.com/v1.0/servicePrincipals?$filter=displayName eq 'Microsoft Graph'&$select=id,displayName,appId,appRoles
   ```
1. Grant the application permission (app role) to the client enterprise application by running the following request.

   ```http
   POST https://graph.microsoft.com/v1.0/servicePrincipals/7ea9e944-71ce-443d-811c-71e8047b557a/appRoleAssignedTo
   
   Request body

   {
      "principalId": "b0d9b9e3-0ecf-4bfd-8dab-9273dd055a94",
      "resourceId": "7ea9e944-71ce-443d-811c-71e8047b557a",
      "appRoleId": "df021288-bdef-4463-88db-98f22de89214"
   }
   ```
:::zone-end

## Next steps

[Configure how end-users consent to applications](configure-user-consent.md)

[Configure the admin consent workflow](configure-admin-consent-workflow.md)
