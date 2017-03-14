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

# Use Azure Active Directory to authenticate from Batch solutions

Azure Batch supports authentication with Azure Active Directory (Azure AD) for all of your Batch solutions.

All requests to the Batch service must be authenticated. When you develop with the Batch .NET library, you have two options for authentication:

- [Shared Key authentication](https://docs.microsoft.com/rest/api/batchservice/authenticate-requests-to-the-azure-batch-service)
- [Azure AD][aad_about]


## Use Azure AD with Batch Management .NET

The Batch Management .NET library exposes types for working with Batch accounts, account keys, applications, and application packages. The Batch Management .NET library is an Azure resource provider, and is used together with [Azure Resource Manager][resman_overview] to manage these resources programmatically.

Azure AD is required to authenticate requests made through the Batch Management .NET library and through [Azure Resource Manager][resman_overview]. 

In this section, we'll use the [AccountManagment][acct_mgmt_sample] sample project, available on GitHub, to walk through using Azure AD with the Batch Management .NET library. The AccountManagement sample is a console application that demonstrates how to access a subscription programmatically, create a new resource group, create a new Batch account, perform some operations on the account, and then delete the new account and resource group. 

### Register your application with Azure AD

Azure AD is Microsoft’s multi-tenant cloud based directory and identity management service. Azure itself uses Azure AD for the authentication of its customers, service administrators, and organizational users. In the context of Batch Management .NET, you use Azure AD to authenticate a subscription administrator or co-administrator. This authenticated user can then issue requests to the Batch service.

The Azure [Active Directory Authentication Library][aad_adal] (ADAL) provides a programmatic interface to Azure AD for use within your applications. To call ADAL from your application, you must register your application in an Azure AD tenant. When you register your application, you provide Azure AD with information about your application, including a name for your application. Azure AD associates this name with two objects that are defined in your Azure AD tenant: the application object and the service principal object. The application object and service principal object are listed in the properties for your registered application. To learn more about these objects, see [Application and service principal objects in Azure Active Directory](../active-directory/develop/active-directory-application-objects.md).

To register the AccountManagement sample application, follow the steps in the [Adding an Application](../active-directory/develop/active-directory-integrating-applications.md#adding-an-application) section in [Integrating applications with Azure Active Directory][aad_integrate]. Specify **Native Client Application** for the type of application. For the **Redirect URI**, you can specify any valid URI (such as `http://myaccountmanagementsample`), as it does not need to be a real endpoint:

![](./media/batch-aad-auth/app-registration-01.png)

In the source code for the AccountManagement sample application, you'll notice constants that provide the endpoint for Azure AD and for Azure Resource Manager. The sample application uses these constants to query Azure AD for subscription information. Leave these constants unchanged:

```csharp
// These endpoints are used during authentication and authorization with AAD.
private const string AuthorityUri = "https://login.microsoftonline.com/common"; // Azure Active Directory "common" endpoint
private const string ResourceUri = "https://management.core.windows.net/";     // Azure service management resource
```

Your client application uses the application object ID (also referred to as the client ID) to access Azure AD at runtime. In the AccountManagement sample application, copy your application ID from the Azure portal to the appropriate constant:

```csharp
// Specify the unique identifier (the "Client ID") for your application. This is required so that your
// native client application (i.e. this sample) can access the Microsoft Azure AD Graph API. For information
// about registering an application in Azure Active Directory, please see "Adding an Application" here:
// https://azure.microsoft.com/documentation/articles/active-directory-integrating-applications/
private const string ClientId = "your application ID";
```

Also copy the redirect URI that you specified during the registration process.

```csharp
// The URI to which Azure AD will redirect in response to an OAuth 2.0 request. This value is
// specified by you when you register an application with AAD (see ClientId comment). It does not
// need to be a real endpoint, but must be a valid URI (e.g. https://accountmgmtsampleapp).
private const string RedirectUri = "https://batchsampleapp";
```

Once you've registered the AccountManagement sample in the Azure AD tenant and provided the necessary constant values within the sample source code, the sample is ready to authenticate using Azure AD. When you run the sample, the ADAL attempts to acquire an authentication token. At this step, it prompts you for for your Microsoft credentials: 

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

After you provide your service administrator or coadministrator credentials, the sample application can proceed to issue authenticated requests. For more information on running the AccountManagement sample application, see [Manage Batch accounts and quotas with the Batch Management client library for .NET](batch-management-dotnet.ms).

> [!NOTE] 
> To run the AccountManagement sample, you'll also need to register the sample application with Azure Resource Manager. For information about how to do this, see [Manage Batch accounts and quotas with the Batch Management client library for .NET](batch-management-dotnet.ms).
>
>

#### Register the sample with Azure AD

Next, you'll need to delegate permissions to the Azure Resource Manager API. Follow these steps in the Azure portal:

1. In the left-hand navigation pane of the Azure portal, choose **More Services**, click **App Registrations**, and click **Add**.
2. Search for the name of your application in the list of app registrations:

![Search for your application name][5]

3. Display the **Settings** blade. In the **API Access** section, select **Required permissions**.
4. Click **Add** to add a new required permission. 
5. In step 1, enter **Windows Azure Service Management API**, and select that API.
6. In step 2, select the check box next to  **Access Azure Service Management as organization users**.
7. Click the **Done** button.

![Delegate permissions to the Azure Resource Manager API][6]

### Run the sample

Once you've added the application as described above, update `Program.cs` in the [AccountManagment][acct_mgmt_sample] sample project with your application's Redirect URI and Client ID. You can find these values in the **Configure** tab of your application:

![Application configuration in Azure portal][3]

The [AccountManagment][acct_mgmt_sample] sample application demonstrates the following operations:

1. Acquire a security token from Azure AD by using [ADAL][aad_adal]. If the user is not already signed in, they are prompted for their Azure credentials.
2. By using the security token obtained from Azure AD, create a [SubscriptionClient][resman_subclient] to query Azure for a list of subscriptions associated with the account. This allows selection of a subscription if multiple are found.
3. Create a credentials object associated with the selected subscription.
4. Create [ResourceManagementClient][resman_client] by using the credentials.S
5. Use [ResourceManagementClient][resman_client] to create a resource group.
6. Use [BatchManagementClient][net_mgmt_client] to perform several Batch account operations:
   * Create a Batch account in the new resource group.
   * Get the newly created account from the Batch service.
   * Print the account keys for the new account.
   * Regenerate a new primary key for the account.
   * Print the quota information for the account.
   * Print the quota information for the subscription.
   * Print all accounts within the subscription.
   * Delete newly created account.
7. Delete the resource group.

Before deleting the newly created Batch account and resource group, you can inspect both in the [Azure portal][azure_portal]:

![Azure portal displaying the resource group and Batch account][1]
<br />
*Azure portal displaying new resource group and Batch account*






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
[net_batch_client]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient.aspx
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
[5]: ./media/batch-aad-auth/app-registration-02.png
[6]: ./media/batch-aad-auth/app-registration-03.png
[1]: ./media/batch-management-dotnet/portal-01.png
