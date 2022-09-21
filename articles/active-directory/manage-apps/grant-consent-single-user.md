---
title: Grant consent on behalf of a single user
description: Learn how to grant consent on behalf of a single user when user consent is disabled or restricted.
services: active-directory
author: psignoret
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 11/25/2021
ms.author: phsignor

#customer intent: As an admin, I want to grant consent on behalf of a single user
---

# Grant consent on behalf of a single user by using PowerShell

In this article, you'll learn how to grant consent on behalf of a single user by using PowerShell.

When a user grants consent for themselves, the following events occur

1. A service principal for the client application is created, if it doesn't already exist. A service principal is the instance of an application or a service in your Azure Active Directory (Azure AD) tenant. Access that's granted to the app or service is associated with this service principal object.

1. For each API to which the application requires access, a delegated permission grant to that API is created for the permissions that are needed by the application, for access on behalf of the user. A delegated permission grant authorizes an application to access an API on behalf of a user, when that user has signed in.

1. The user is assigned the client application. Assigning the application to the user ensures that the application is listed in the [My Apps](my-apps-deployment-plan.md) portal for that user, which allows them to review and revoke the access that has been granted on their behalf.

## Prerequisites

To grant consent to an application on behalf of one user, you need:

- A user account with Global Administrator, Application Administrator, or Cloud Application Administrator

## Grant consent on behalf of a single user

Before you start, record the following details from the Azure portal:

- The app ID for the app that you're granting consent. For purposes of this article, we'll call it the "client application."
- The API permissions that are required by the client application. Find out the app ID of the API and the permission IDs or claim values.
- The username or object ID for the user on whose behalf access will be granted.

For this example, we'll use [Microsoft Graph PowerShell](/powershell/microsoftgraph/get-started) to grant consent on behalf of a single user. The client application is [Microsoft Graph Explorer](https://aka.ms/ge), and we grant access to the Microsoft Graph API.

```powershell
# The app for which consent is being granted. In this example, we're granting access
# to Microsoft Graph Explorer, an application published by Microsoft.
$clientAppId = "de8bc8b5-d9f9-48b1-a8ad-b748da725064" # Microsoft Graph Explorer

# The API to which access will be granted. Microsoft Graph Explorer makes API 
# requests to the Microsoft Graph API, so we'll use that here.
$resourceAppId = "00000003-0000-0000-c000-000000000000" # Microsoft Graph API

# The permissions to grant. Here we're including "openid", "profile", "User.Read"
# and "offline_access" (for basic sign-in), as well as "User.ReadBasic.All" (for 
# reading other users' basic profile).
$permissions = @("openid", "profile", "offline_access", "User.Read", "User.ReadBasic.All")

# The user on behalf of whom access will be granted. The app will be able to access 
# the API on behalf of this user.
$userUpnOrId = "user@example.com"

# Step 0. Connect to Microsoft Graph PowerShell. We need User.ReadBasic.All to get
#    users' IDs, Application.ReadWrite.All to list and create service principals, 
#    DelegatedPermissionGrant.ReadWrite.All to create delegated permission grants, 
#    and AppRoleAssignment.ReadWrite.All to assign an app role.
#    WARNING: These are high-privilege permissions!
Connect-MgGraph -Scopes ("User.ReadBasic.All Application.ReadWrite.All " `
                        + "DelegatedPermissionGrant.ReadWrite.All " `
                        + "AppRoleAssignment.ReadWrite.All")

# Step 1. Check if a service principal exists for the client application. 
#     If one does not exist, create it.
$clientSp = Get-MgServicePrincipal -Filter "appId eq '$($clientAppId)'"
if (-not $clientSp) {
   $clientSp = New-MgServicePrincipal -AppId $clientAppId
}

# Step 2. Create a delegated permission that grants the client app access to the
#     API, on behalf of the user. (This example assumes that an existing delegated 
#     permission grant does not already exist, in which case it would be necessary 
#     to update the existing grant, rather than create a new one.)
$user = Get-MgUser -UserId $userUpnOrId
$resourceSp = Get-MgServicePrincipal -Filter "appId eq '$($resourceAppId)'"
$scopeToGrant = $permissions -join " "
$grant = New-MgOauth2PermissionGrant -ResourceId $resourceSp.Id `
                                     -Scope $scopeToGrant `
                                     -ClientId $clientSp.Id `
                                     -ConsentType "Principal" `
                                     -PrincipalId $user.Id

# Step 3. Assign the app to the user. This ensures that the user can sign in if assignment
#     is required, and ensures that the app shows up under the user's My Apps.
if ($clientSp.AppRoles | ? { $_.AllowedMemberTypes -contains "User" }) {
    Write-Warning ("A default app role assignment cannot be created because the " `
                 + "client application exposes user-assignable app roles. You must " `
                 + "assign the user a specific app role for the app to be listed " `
                 + "in the user's My Apps access panel.")
} else {
    # The app role ID 00000000-0000-0000-0000-000000000000 is the default app role
    # indicating that the app is assigned to the user, but not for any specific 
    # app role.
    $assignment = New-MgServicePrincipalAppRoleAssignedTo `
          -ServicePrincipalId $clientSp.Id `
          -ResourceId $clientSp.Id `
          -PrincipalId $user.Id `
          -AppRoleId "00000000-0000-0000-0000-000000000000"
}
```

## Next steps

- [Configure the admin consent workflow](configure-admin-consent-workflow.md)
- [Configure how users consent to applications](configure-user-consent.md)
- [Permissions and consent in the Microsoft identity platform](../develop/v2-permissions-and-consent.md)
