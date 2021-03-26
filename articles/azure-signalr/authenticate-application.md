---
title: Authenticate an application to access Azure SignalR Service
description: This article provides information about authenticating an application with Azure Active Directory to access Azure SignalR Service
author: terencefan

ms.author: tefa
ms.service: signalr
ms.topic: conceptual
ms.date: 08/03/2020
---

# Authenticate an application with Azure Active Directory to access Azure SignalR Service
Microsoft Azure provides integrated access control management for resources and applications based on Azure Active Directory (Azure AD). A key advantage of using Azure AD with Azure SignalR Service is that you don't need to store your credentials in the code anymore. Instead, you can request an OAuth 2.0 access token from the Microsoft Identity platform. The resource name to request a token is `https://signalr.azure.com/`. Azure AD authenticates the security principal (an application, resource group, or service principal) running the application. If the authentication succeeds, Azure AD returns an access token to the application, and the application can then use the access token to authorize request to Azure SignalR Service resources.

When a role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. Access can be scoped to the level of subscription, the resource group, or the Azure SignalR resource. An Azure AD security can assign roles to a user, a group, an application service principal, or a [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md). 

> [!NOTE]
> A role definition is a collection of permissions. Role-based access control (RBAC) controls how these permissions are enforced through role assignment. A role assignment consists of three elements: security principal, role definition, and scope. For more information, see [Understanding the different roles](../role-based-access-control/overview.md).

## Register your application with an Azure AD tenant
The first step in using Azure AD to authorize Azure SignalR Service resources is registering your application with an Azure AD tenant from the [Azure portal](https://portal.azure.com/). 
When you register your application, you supply information about the application to AD. Azure AD then provides a client ID (also called an application ID) that you can use to associate your application with Azure AD runtime. 
To learn more about the client ID, see [Application and service principal objects in Azure Active Directory](../active-directory/develop/app-objects-and-service-principals.md). 

The following images show steps for registering a web application:

![Register an application](./media/authenticate/app-registrations-register.png)

> [!Note]
> If you register your application as a native application, you can specify any valid URI for the Redirect URI. For native applications, this value does not have to be a real URL. For web applications, the redirect URI must be a valid URI, because it specifies the URL to which tokens are provided.

After you've registered your application, you'll see the **Application (client) ID** under **Settings**:

![Application ID of the registered application](./media/authenticate/application-id.png)

For more information about registering an application with Azure AD, see [Integrating applications with Azure Active Directory](../active-directory/develop/quickstart-register-app.md).


### Create a client secret   
The application needs a client secret to prove its identity when requesting a token. To add the client secret, follow these steps.

1. Navigate to your app registration in the Azure portal.
1. Select the **Certificates & secrets** setting.
1. Under **Client secrets**, select **New client secret** to create a new secret.
1. Provide a description for the secret, and choose the wanted expiration interval.
1. Immediately copy the value of the new secret to a secure location. The fill value is displayed to you only once.

![Create a Client secret](./media/authenticate/client-secret.png)

### Upload a certificate

You could also upload a certification instead of creating a client secret.

![Upload a Certification](./media/authenticate/certification.png)

## Assign Azure roles using the Azure portal  
To learn more on managing access to Azure resources using Azure RBAC and the Azure portal, see [this article](..//role-based-access-control/role-assignments-portal.md). 

After you've determined the appropriate scope for a role assignment, navigate to that resource in the Azure portal. Display the access control (IAM) settings for the resource, and follow these instructions to manage role assignments:

1. In the [Azure portal](https://portal.azure.com/), navigate to your SignalR resource.
1. Select **Access Control (IAM)** to display access control settings for the Azure SignalR. 
1. Select the **Role assignments** tab to see the list of role assignments. Select the **Add** button on the toolbar and then select **Add role assignment**. 

    ![Add button on the toolbar](./media/authenticate/role-assignments-add-button.png)

1. On the **Add role assignment** page, do the following steps:
    1. Select the **Azure SignalR role** that you want to assign. 
    1. Search to locate the **security principal** (user, group, service principal) to which you want to assign the role.
    1. Select **Save** to save the role assignment. 

        ![Assign role to an application](./media/authenticate/assign-role-to-application.png)

    1. The identity to whom you assigned the role appears listed under that role. For example, the following image shows that application `signalr-dev` and `signalr-service` are in the SignalR App Server role. 
        
        ![Role Assignment List](./media/authenticate/role-assignment-list.png)

You can follow similar steps to assign a role scoped to resource group, or subscription. Once you define the role and its scope, you can test this behavior with samples [in this GitHub location](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac).

## Sample codes while configuring your app server.

Add following options when `AddAzureSignalR`:

```C#
services.AddSignalR().AddAzureSignalR(option =>
{
    option.ConnectionString = "Endpoint=https://<name>.signalr.net;AuthType=aad;clientId=<clientId>;clientSecret=<clientSecret>;tenantId=<tenantId>";
});
```

Or simply configure the `ConnectionString` in your `appsettings.json` file.

```json
{
"Azure": {
    "SignalR": {
      "Enabled": true,
      "ConnectionString": "Endpoint=https://<name>.signalr.net;AuthType=aad;clientId=<clientId>;clientSecret=<clientSecret>;tenantId=<tenantId>"
    }
  },
}
```

When using `certificate`, change the `clientSecret` to `clientCert` like this:

```C#
    option.ConnectionString = "Endpoint=https://<name>.signalr.net;AuthType=aad;clientId=<clientId>;clientCert=<clientCertFilepath>;tenantId=<tenantId>";
```

## Next steps
- To learn more about RBAC, see [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md)?
- To learn how to assign and manage Azure role assignments with Azure PowerShell, Azure CLI, or the REST API, see these articles:
    - [Manage role-based access control (RBAC) with Azure PowerShell](../role-based-access-control/role-assignments-powershell.md)  
    - [Manage role-based access control (RBAC) with Azure CLI](../role-based-access-control/role-assignments-cli.md)
    - [Manage role-based access control (RBAC) with the REST API](../role-based-access-control/role-assignments-rest.md)
    - [Manage role-based access control (RBAC) with Azure Resource Manager Templates](../role-based-access-control/role-assignments-template.md)

See the following related articles:
- [Authenticate a managed identity with Azure Active Directory to access Azure SignalR Service](authenticate-managed-identity.md)
- [Authorize access to Azure SignalR Service using Azure Active Directory](authorize-access-azure-active-directory.md)