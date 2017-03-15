---
title: Use Azure Active Directory to authenticate from Batch solutions | Microsoft Docs
description: Use Azure Active Directory to authenticate from Batch solutions
services: batch
documentationcenter: .net
author: tamram
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: batch
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: big-compute
ms.date: 03/13/2017
ms.author: tamram
---

# Use Azure Active Directory to authenticate Batch solutions

Azure Batch supports authentication with [Azure Active Directory][aad_about] (Azure AD) for your Batch solutions. Azure AD is Microsoft’s multi-tenant cloud based directory and identity management service. Azure itself uses Azure AD for the authentication of its customers, service administrators, and organizational users.

In this article, explore using Azure AD to authenticate from applications that use the Batch Management .NET library or the Batch .NET library. In the context of the Batch .NET APIs, you use Azure AD to authenticate a subscription administrator or co-administrator (integrated authentication). This authenticated user can then issue requests to Azure Batch.

It's also possible to use Azure AD to authenticate access to an application running unattended. In this article, we focus on using Azure AD integrated authentication, and refer you to other resources to learn about authenticating unattended applications.

## Authenticate Batch management applications with Azure AD

The Batch Management .NET library exposes types for working with Batch accounts, account keys, applications, and application packages. The Batch Management .NET library is an Azure resource provider client, and is used together with [Azure Resource Manager][resman_overview] to manage these resources programmatically. 

Azure AD is required to authenticate requests made through any Azure resource provider client, including the Batch Management .NET library, and through [Azure Resource Manager][resman_overview]. The Batch Management .NET library supports authentication through Azure AD only.

In this section, we use the [AccountManagment][acct_mgmt_sample] sample project, available on GitHub, to walk through using Azure AD with the Batch Management .NET library. The AccountManagement sample is a console application that accesses a subscription programmatically, creates a resource group and a new Batch account, and performs some operations on the account. 

To learn more about using the Batch Management .NET library and the AccountManagement sample, see [Manage Batch accounts and quotas with the Batch Management client library for .NET](batch-management-dotnet.md).

### Register your application with Azure AD

The Azure [Active Directory Authentication Library][aad_adal] (ADAL) provides a programmatic interface to Azure AD for use within your applications. To call ADAL from your application, you must register your application in an Azure AD tenant. When you register your application, you provide Azure AD with information about your application, including a name for your application. Azure AD associates this name with two objects that are defined in your Azure AD tenant: the application object and the service principal object. The identifiers for the application and the service principal are listed in the properties for your registered application. To learn more about these objects, see [Application and service principal objects in Azure Active Directory](../active-directory/develop/active-directory-application-objects.md).

To register the AccountManagement sample application, follow the steps in the [Adding an Application](../active-directory/develop/active-directory-integrating-applications.md#adding-an-application) section in [Integrating applications with Azure Active Directory][aad_integrate]. Specify **Native Client Application** for the type of application. For the **Redirect URI**, you can specify any valid URI (such as `http://myaccountmanagementsample`), as it does not need to be a real endpoint:

![](./media/batch-aad-auth/app-registration-management-plane.png)

Once you complete the registration process, you'll see the application ID and the object (service principal) ID listed for your application.  

![](./media/batch-aad-auth/app-registration-client-id.png)

### Update your code to reference your application ID 

Your client application uses the application ID (also referred to as the client ID) to access Azure AD at runtime. Once you've registered your application in the Azure portal, update your code to use the application ID provided by Azure AD for your registered application. In the AccountManagement sample application, copy your application ID from the Azure portal to the appropriate constant:

```csharp
// Specify the unique identifier (the "Client ID") for your application. This is required so that your
// native client application (i.e. this sample) can access the Microsoft Azure AD Graph API. For information
// about registering an application in Azure Active Directory, please see "Adding an Application" here:
// https://azure.microsoft.com/documentation/articles/active-directory-integrating-applications/
private const string ClientId = "<application-id>";
```
Also copy the redirect URI that you specified during the registration process.

```csharp
// The URI to which Azure AD will redirect in response to an OAuth 2.0 request. This value is
// specified by you when you register an application with AAD (see ClientId comment). It does not
// need to be a real endpoint, but must be a valid URI (e.g. https://accountmgmtsampleapp).
private const string RedirectUri = "http://myaccountmanagementsample";
```

### Grant the Azure Resource Manager API access to your application

Next, you'll need to delegate access to your application to the Azure Resource Manager API. Follow these steps in the Azure portal:

1. In the left-hand navigation pane of the Azure portal, choose **More Services**, click **App Registrations**, and click **Add**.
2. Search for the name of your application in the list of app registrations:

    ![Search for your application name](./media/batch-aad-auth/search-app-registration.png)

3. Display the **Settings** blade. In the **API Access** section, select **Required permissions**.
4. Click **Add** to add a new required permission. 
5. In step 1, enter `Windows Azure Service Management API`, select that API from the list of results, and click the **Select** button.
6. In step 2, select the check box next to **Access Azure classic deployment model as organization users**, and click the **Select** button.
7. Click the **Done** button.

The **Required Permissions** blade now shows that permissions to your application are granted to both the ADAL and Resource Manager APIs. Permissions are granted to ADAL by default when you first register your app with Azure AD.

![Delegate permissions to the Azure Resource Manager API](./media/batch-aad-auth/app-registration-complete.png)


### Acquire an Azure AD authentication token

The AccountManagement sample application defines constants that provide the endpoint for Azure AD and for Azure Resource Manager. The sample application uses these constants to query Azure AD for subscription information. Leave these constants unchanged:

```csharp
// These endpoints are used during authentication and authorization with AAD.
private const string AuthorityUri = "https://login.microsoftonline.com/common"; // Azure Active Directory "common" endpoint
private const string ResourceUri = "https://management.core.windows.net/";     // Azure service management resource
```

After you register the AccountManagement sample in the Azure AD tenant and provide the necessary values within the sample source code, the sample is ready to authenticate using Azure AD. When you run the sample, the ADAL attempts to acquire an authentication token. At this step, it prompts you for your Microsoft credentials: 

```csharp
// Obtain an access token using the "common" AAD resource. This allows the application
// to query AAD for information that lies outside the application's tenant (such as for
// querying subscription information in your Azure account).
AuthenticationContext authContext = new AuthenticationContext(AuthorityUri);
AuthenticationResult authResult = authContext.AcquireToken(ResourceUri,
                                                        ClientId,
                                                        new Uri(RedirectUri),
                                                        PromptBehavior.Auto);
```

After you provide your service administrator or coadministrator credentials, the sample application can proceed to issue authenticated requests to the Batch management service. 

## Authenticate Batch service applications with Azure AD

The Batch .NET library provides types for building parallel processing workflows with the Batch service. The Batch service supports both [Shared Key](https://docs.microsoft.com/rest/api/batchservice/authenticate-requests-to-the-azure-batch-service) authentication and authentication through Azure AD. 

>[!NOTE]
>When you create a Batch account, you can specify whether pools are to be allocated in a subscription managed by Batch, or in a user subscription. If your account allocates pools in a user subscription, then you must authenticate requests to resources in that account with Azure AD.
>
>

Authenticating Batch .NET applications via Azure AD is similar to authenticating Batch Management .NET applications. There are a few differences, described in this section.

### Batch service endpoints

The Batch service endpoints differ from those that you use with Batch Management .NET.

The Azure AD endpoint for Batch is:

`https://login.microsoftonline.com/microsoft.onmicrosoft.com`

The resource endpoint for Batch is:

`https://batch.core.windows.net/`

### Grant the Batch service API access to your application

Before you can authenticate via Azure AD from your Batch application, you need to register your application with Azure AD and grant access to the Batch service API.

1. To register your Batch application, follow the steps in the [Adding an Application](../active-directory/develop/active-directory-integrating-applications.md#adding-an-application) section in [Integrating applications with Azure Active Directory][aad_integrate]. For the **Redirect URI**, you can specify any valid URI. It does not need to be a real endpoint.

    After you've registered your application, you'll see the application ID and service principal ID:

    ![Register your Batch application with Azure AD](./media/batch-aad-auth/app-registration-data-plane.png)

2. Next, display the **Settings** blade. In the **API Access** section, select **Required permissions**.
3. In the **Required permissions** blade, click the **Add** button.
4. In step 1, search for **MicrosoftAzureBatch**, select **Microsoft Azure Batch (MicrosoftAzureBatch)**, and click the **Select** button.
5. In step 2, select the check box next to **Access Azure Batch Service** and click the **Select** button.
6. Click the **Done** button.

The **Required Permissions** blade now shows that your application grants access to both the Azure AD and Azure Batch APIs. 

![API permissions](./media/batch-aad-auth/required-permissions-data-plane.png)

### Authentication for Batch accounts in a user subscription

When you create a new Batch account, you can choose the subscription in which pools are allocated. Your choice affects how you authenticate requests made to resources in that account

By default, Batch pools are allocated in a Batch service subscription. If you choose this option, you can authenticate requests to resources in that account with either Shared Key or with Azure AD.

You can also specify that Batch pools are allocated in a specified user subscription. If you choose this option, you must authenticate requests to resources in that account with Azure AD.

### Best practices for using Azure AD with Batch

An Azure AD authentication token expires after one hour. When using a long-lived BatchClient, we recommend that you retrieve a token from ADAL on every request to ensure you always have a valid token. 

To achieve this in .NET, write a method that retrieves the token from Azure AD and pass that method to a BatchTokenCredentials object as a delegate. The delegate method is called on every request to the Batch service to ensure that a valid token is provided. By default ADAL caches tokens, so a new token is retrieved from Azure AD only when necessary. For an example, see [Examples using Azure AD with Batch .NET](#code-example-using-azure-ad-with-batch-net).

The token is cached for one hour by default. When the token is within five minutes of expiry, ADAL retrieves a new token. For more information about tokens in Azure AD, see [Authentication Scenarios for Azure AD](../active-directory/develop/active-directory-authentication-scenarios.md).

### Code example: Using Azure AD with Batch .NET

To write Batch .NET code that authenticates with Azure AD, reference the [Azure Batch .NET](https://www.nuget.org/packages/Azure.Batch/) package and the [ADAL](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/) package.

Include the following `using` statements in your code:

```csharp
using Microsoft.Azure.Batch;
using Microsoft.Azure.Batch.Auth;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
```

Reference the Batch service endpoints for Azure AD in your code, for example:  

```csharp
private const string BatchAuthorityUrl = "https://login.microsoftonline.com/microsoft.onmicrosoft.com";
private const string BatchResourceUrl = "https://batch.core.windows.net/";
```

Specify the application ID for your application. The application ID is available from your app registration in the Azure portal; see the section titled [Grant the Batch service API access to your application](#grant-the-batch-service-api-access-to-your-application) to retrieve it. 

```csharp
private const string ClientId = "<client-id>";
```

Also specify a redirect URI, which can be any valid URI.

```csharp
private const string RedirectUri = "http://mydataplanesample";
```

Write a callback method to acquire the authentication token from Azure AD. The **AcquireTokenAsync** method prompts the user for their credentials and uses those credentials to acquire a new token.

```csharp
public static async Task<string> GetAuthenticationTokenAsync(string resource)
{
    var authContext = new AuthenticationContext(BatchAuthorityUrl);

    // Acquire the authentication token from Azure AD.
    var authResult = await authContext.AcquireTokenAsync(BatchAuthorityUrl, 
                                                        ClientId, 
                                                        new Uri(RedirectUri), 
                                                        new PlatformParameters(PromptBehavior.Auto));

    return authResult.AccessToken;
}
```

Construct a **BatchTokenCredentials** object that takes the delegate as a parameter. Use those credentials to open a **BatchClient** object. You can then use that **BatchClient** object for subsequent operations against the Batch service.

```csharp
public static async Task PerformBatchOperations()
{
    Func<Task<string>> tokenProvider = () => GetAuthenticationTokenAsync(BatchResourceUrl);

    using (var client = await BatchClient.OpenAsync(new BatchTokenCredentials(BatchAccountUrl, tokenProvider)))
    {
        await client.JobOperations.ListJobs().ToListAsync();
    }
}
```

The **GetAuthenticationTokenAsync** callback method shown above uses Azure AD for integrated authentication of a user who is interacting with the application. The call to the **AcquireTokenAsync** method prompts the user for their credentials, and the application proceeds once the user provides them. You can also use Azure AD to authenticate an unattended application by using an Azure AD service principal. For more information, see [Application and service principal objects in Azure Active Directory](../active-directory/develop/active-directory-application-objects.md) and [Use portal to create Active Directory application and service principal that can access resources](../resource-group-create-service-principal-portal.md).  
 

## Next steps

For more information on running the [AccountManagement sample application][acct_mgmt_sample], see [Manage Batch accounts and quotas with the Batch Management client library for .NET](batch-management-dotnet.md).

To learn more about Azure AD, see the [Azure Active Directory Documentation](https://docs.microsoft.com/azure/active-directory/). In-depth examples showing how to use ADAL are available in the [Azure Code Samples](https://azure.microsoft.com/resources/samples/?service=active-directory) library.


[aad_about]: ../active-directory/active-directory-whatis.md "What is Azure Active Directory?"
[aad_adal]: ../active-directory/active-directory-authentication-libraries.md
[aad_auth_scenarios]: ../active-directory/active-directory-authentication-scenarios.md "Authentication Scenarios for Azure AD"
[aad_integrate]: ../active-directory/active-directory-integrating-applications.md "Integrating Applications with Azure Active Directory"
[acct_mgmt_sample]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/AccountManagement
[api_net]: http://msdn.microsoft.com/library/azure/mt348682.aspx
[api_mgmt_net]: https://msdn.microsoft.com/library/azure/mt463120.aspx
[azure_portal]: http://portal.azure.com
[azure_storage]: https://azure.microsoft.com/services/storage/
[azure_tokencreds]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.tokencloudcredentials.aspx
[batch_explorer_project]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/BatchExplorer
[net_batch_client]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient.###
[net_list_keys]: https://msdn.microsoft.com/library/azure/microsoft.azure.management.batch.accountoperationsextensions.listkeysasync.aspx
[net_create]: https://msdn.microsoft.com/library/azure/microsoft.azure.management.batch.accountoperationsextensions.createasync.aspx
[net_delete]: https://msdn.microsoft.com/library/azure/microsoft.azure.management.batch.accountoperationsextensions.deleteasync.aspx
[net_regenerate_keys]: https://msdn.microsoft.com/library/azure/microsoft.azure.management.batch.accountoperationsextensions.regeneratekeyasync.aspx
[net_sharedkeycred]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.auth.batchsharedkeycredentials.aspx
[net_mgmt_client]: https://msdn.microsoft.com/library/azure/microsoft.azure.management.batch.batchmanagementclient.aspx
[net_mgmt_subscriptions]: https://msdn.microsoft.com/library/azure/microsoft.azure.management.batch.batchmanagementclient.subscriptions.aspx
[net_mgmt_listaccounts]: https://msdn.microsoft.com/library/azure/microsoft.azure.management.batch.iaccountoperations.listasync.aspx
[resman_api]: https://msdn.microsoft.com/library/azure/mt418626.aspx
[resman_client]: https://msdn.microsoft.com/library/azure/microsoft.azure.management.resources.resourcemanagementclient.aspxs
[resman_subclient]: https://msdn.microsoft.com/library/azure/microsoft.azure.subscriptions.subscriptionclient.aspx
[resman_overview]: ../azure-resource-manager/resource-group-overview.md

[4]: ./media/batch-aad-auth/app-registration-01.png

[1]: ./media/batch-aad-auth/portal-01.png
