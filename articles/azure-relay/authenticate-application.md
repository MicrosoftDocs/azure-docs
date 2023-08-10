---
title: Authenticate from an application - Azure Relay 
description: This article provides information about authenticating an application with Azure Active Directory to access Azure Relay resources. 
ms.topic: article
ms.date: 07/22/2022
---

# Authenticate and authorize an application with Azure Active Directory to access Azure Relay entities 
Azure Relay supports using Azure Active Directory (Azure AD) to authorize requests to Azure Relay entities (Hybrid Connections, WCF Relays). With Azure AD, you can use Azure role-based access control (Azure RBAC) to grant permissions to a security principal, which may be a user, group, or application service principal. To learn more about roles and role assignments, see [Understanding the different roles](../role-based-access-control/overview.md).   

> [!NOTE]
> This feature is generally available in all regions except Microsoft Azure operated by 21Vianet.


[!INCLUDE [relay-roles](./includes/relay-roles.md)]

## Authenticate from an app
A key advantage of using Azure AD with Azure Relay is that your credentials no longer need to be stored in your code. Instead, you can request an OAuth 2.0 access token from Microsoft identity platform. Azure AD authenticates the security principal (a user, a group, or service principal) running the application. If authentication succeeds, Azure AD returns the access token to the application, and the application can then use the access token to authorize requests to Azure Relay.

Following sections shows you how to configure your console application for authentication with Microsoft Identity Platform 2.0. For more information, see [Microsoft Identity Platform (v2.0) overview](../active-directory/develop/v2-overview.md).

For an overview of the OAuth 2.0 code grant flow, see [Authorize access to Azure Active Directory web applications using the OAuth 2.0 code grant flow](../active-directory/develop/v2-oauth2-auth-code-flow.md).

### Register your application with an Azure AD tenant
The first step in using Azure AD to authorize Azure Relay entities is registering your client application with an Azure AD tenant from the Azure portal. When you register your client application, you supply information about the application to AD. Azure AD then provides a client ID (also called an application ID) that you can use to associate your application with Azure AD runtime. 

For step-by-step instructions to register your application with Azure AD, see [Quickstart: Register an application with Azure AD](../active-directory/develop/quickstart-register-app.md#register-an-application).

> [!IMPORTANT]
> Make note of the **Directory (tenant) ID** and the **Application (client) ID**. You will need these values to run the sample application.

### Create a client secret   
The application needs a client secret to prove its identity when requesting a token. In the same article linked above, see the [Add a client secret](../active-directory/develop/quickstart-register-app.md#add-a-client-secret) section to create a client secret. 

> [!IMPORTANT]
> Make note of the **Client Secret**. You will need it to run the sample application.

## Assign Azure roles using the Azure portal
Assign one of the Azure Relay roles to the application's service principal at the desired scope (Relay entity, namespace, resource group, subscription). For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

## Run the sample

1. Download the console application sample from [GitHub](https://github.com/Azure/azure-relay/tree/master/samples/hybrid-connections/dotnet/rolebasedaccesscontrol).
1. Run the application locally on your computer per the instructions from the [README article](https://github.com/Azure/azure-relay/tree/master/samples/hybrid-connections/dotnet/rolebasedaccesscontrol#rolebasedaccesscontrol-hybrid-connection-sample).

    > [!NOTE]
    > Follow the same steps above to run the [sample console application for WCF Relay](https://github.com/Azure/azure-relay/tree/master/samples/wcf-relay/RoleBasedAccessControl). 

#### Highlighted code from the sample
Here's the code from the sample that shows how to use Azure AD authentication to connect to the Azure Relay service.  

1. Create a [TokenProvider](/dotnet/api/microsoft.azure.relay.tokenprovider) object by using the `TokenProvider.CreateAzureActiveDirectoryTokenProvider` method. 

    If you haven't already created an app registration, see the [Register your application with Azure AD](#register-your-application-with-an-azure-ad-tenant) section to create it and then create a client secret as mentioned in the [Create a client secret](#create-a-client-secret) section.

    If you want to use an existing app registration, follow these instructions to get **Application (client) ID** and **Directory (tenant) ID**. 

    1. Sign in to the [Azure portal](https://portal.azure.com).
    1. Search for and select **Azure Active Directory** using the search bar at the top.
    1. On the **Azure Active Directory** page, select **App registrations** in the **Manage** section on the left menu. 
    1. Select your app registration. 
    1. On the page for your app registration, you will see the values for **Application (client) ID** and **Directory (tenant) ID**. 
    
    To get the **client secret**, follow these steps:
    1. On the page your app registration, select **Certificates & secrets** on the left menu. 
    1. Use the copy button in the **Value** column for the secret in the **Client secrets** section. 

    
    ```csharp
    static TokenProvider GetAadTokenProvider(string clientId, string tenantId, string clientSecret)
    {
        return TokenProvider.CreateAzureActiveDirectoryTokenProvider(
            async (audience, authority, state) =>
            {
                IConfidentialClientApplication app = ConfidentialClientApplicationBuilder.Create(clientId)
                    .WithAuthority(authority)
                    .WithClientSecret(clientSecret)
                    .Build();

                var authResult = await app.AcquireTokenForClient(new [] { $"{audience}/.default" }).ExecuteAsync();
                return authResult.AccessToken;
            },
            $"https://login.microsoftonline.com/{tenantId}");
    }
    ```
1. Create a [HybridConnectionListener](/dotnet/api/microsoft.azure.relay.hybridconnectionlistener.-ctor#Microsoft_Azure_Relay_HybridConnectionListener__ctor_System_Uri_Microsoft_Azure_Relay_TokenProvider_) or [HybridConnectionClient](/dotnet/api/microsoft.azure.relay.hybridconnectionclient.-ctor#microsoft-azure-relay-hybridconnectionclient-ctor(system-uri-microsoft-azure-relay-tokenprovider)) object by passing the hybrid connection URI and the token provider you created in the previous step.

    **Listener:**
    ```csharp
    var listener = new HybridConnectionListener(hybridConnectionUri, tokenProvider);    
    ```
    
    **Sender:**
    ```csharp
    var sender = new HybridConnectionClient(hybridConnectionUri, tokenProvider);    
    ```

## Samples

- Hybrid Connections: [.NET](https://github.com/Azure/azure-relay/tree/master/samples/hybrid-connections/dotnet/rolebasedaccesscontrol), [Java](https://github.com/Azure/azure-relay/tree/master/samples/hybrid-connections/java/role-based-access-control), [JavaScript](https://github.com/Azure/azure-relay/tree/master/samples/hybrid-connections/node/rolebasedaccesscontrol)
- WCF Relay: [.NET](https://github.com/Azure/azure-relay/tree/master/samples/wcf-relay/RoleBasedAccessControl)

 
## Next steps
- To learn more about Azure RBAC, see [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md)?
- To learn how to assign and manage Azure role assignments with Azure PowerShell, Azure CLI, or the REST API, see these articles:
    - [Add or remove Azure role assignments using Azure PowerShell](../role-based-access-control/role-assignments-powershell.md)  
    - [Add or remove Azure role assignments using Azure CLI](../role-based-access-control/role-assignments-cli.md)
    - [Add or remove Azure role assignments using the REST API](../role-based-access-control/role-assignments-rest.md)
    - [Add or remove Azure role assignments using Azure Resource Manager Templates](../role-based-access-control/role-assignments-template.md)

To learn more about Azure Relay, see the following topics.
- [What is Relay?](relay-what-is-it.md)
- [Get started with Azure Relay Hybrid connections WebSockets](relay-hybrid-connections-dotnet-get-started.md)
- [Get stated with Azure Relay Hybrid connections HTTP requests](relay-hybrid-connections-http-requests-dotnet-get-started.md)








