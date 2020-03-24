---
title: Register a resource app in Azure AD - Azure API for FHIR
description: Register a resource (or API) app in Azure Active Directory, so that client applications can request access to the resource when authenticating.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 02/07/2019
ms.author: mihansen
---

# Register a resource application in Azure Active Directory

In this article, you'll learn how to register a resource (or API) application in Azure Active Directory. A resource application is an Azure Active Directory representation of the FHIR server API itself and client applications can request access to the resource when authenticating. The resource application is also known as the *audience* in OAuth parlance.

## Azure API for FHIR

If you are using the Azure API for FHIR, a resource application is automatically created when you deploy the service. As long as you are using the Azure API for FHIR in the same Azure Active Directory tenant as you are deploying your application, you can skip this how-to-guide and instead deploy your Azure API for FHIR to get started.

If you are using a different Azure Active Directory tenant (not associated with your subscription), you can import the Azure API for FHIR resource application into your tenant with 
PowerShell:

```azurepowershell-interactive
New-AzADServicePrincipal -ApplicationId 4f6778d8-5aef-43dc-a1ff-b073724b9495
```

or you can use Azure CLI:

```azurecli-interactive
az ad sp create --id 4f6778d8-5aef-43dc-a1ff-b073724b9495
```

## FHIR Server for Azure

If you are using the open source FHIR Server for Azure, follow the steps below to register a resource application.

### App registrations in Azure portal

1. In the [Azure portal](https://portal.azure.com), on the left navigation panel, click **Azure Active Directory**.

2. In the **Azure Active Directory** blade click **App registrations**:

    ![Azure portal. New App Registration.](media/how-to-aad/portal-aad-new-app-registration.png)

3. Click the **New registration**.

### Add a new application registration

Fill in the details for the new application. There are no specific requirements for the display name, but setting it to the URI of the FHIR server makes it easy to find:

![New application registration](media/how-to-aad/portal-aad-register-new-app-registration-NAME.png)

### Set identifier URI and define scopes

A resource application has an identifier URI (Application ID URI), which clients can use when requesting access to the resource. This value will populate the `aud` claim of the access token. It is recommended that you set this URI to be the URI of your FHIR server. For SMART on FHIR apps, it is assumed that the *audience* is the URI of the FHIR server.

1. Click **Expose an API**

2. Click **Set** next to *Application ID URI*.

3. Enter the identifier URI and click **Save**. A good identifier URI would be the URI of your FHIR server.

4. Click **Add a scope** and add any scopes that you would like to define for your API. You are required to add at least one scope in order to grant permissions to your resource application in the future. If you don't have any specific scopes you want to add, you can add user_impersonation as a scope.

![Audience and scope](media/how-to-aad/portal-aad-register-new-app-registration-AUD-SCOPE.png)

### Define application roles

The Azure API for FHIR and the OSS FHIR Server for Azure use [Azure Active Directory application roles](https://docs.microsoft.com/azure/architecture/multitenant-identity/app-roles) for role-based access control. To define which roles should be available for your FHIR Server API, open the resource application's [manifest](https://docs.microsoft.com/azure/active-directory/active-directory-application-manifest/):

1. Click **Manifest**:

    ![Application Roles](media/how-to-aad/portal-aad-register-new-app-registration-APP-ROLES.png)

2. In the `appRoles` property, add the roles you would like users or applications to have:

    ```json
    "appRoles": [
      {
        "allowedMemberTypes": [
          "User",
          "Application"
        ],
        "description": "FHIR Server Administrators",
        "displayName": "admin",
        "id": "1b4f816e-5eaf-48b9-8613-7923830595ad",
        "isEnabled": true,
        "value": "admin"
      },
      {
        "allowedMemberTypes": [
          "User"
        ],
        "description": "Users who can read",
        "displayName": "reader",
        "id": "c20e145e-5459-4a6c-a074-b942bbd4cfe1",
        "isEnabled": true,
        "value": "reader"
      }
    ],
    ```

## Next steps

In this article, you've learned how to register a resource application in Azure Active Directory. Next, deploy the Azure API for FHIR.
 
>[!div class="nextstepaction"]
>[Deploy Azure API for FHIR](fhir-paas-powershell-quickstart.md)