---
title: Use Microsoft Entra ID to authenticate Batch Management solutions
description: Explore using Microsoft Entra ID to authenticate from applications that use the Batch Management .NET library.
ms.topic: how-to
ms.date: 06/24/2024
ms.custom: has-adal-ref, devx-track-csharp, devx-track-arm-template, devx-track-dotnet
---

# Authenticate Batch Management solutions with Microsoft Entra ID

Applications that call the Azure Batch Management service authenticate with [Microsoft Authentication Library](../active-directory/develop/msal-overview.md) (Microsoft Entra ID). Microsoft Entra ID is Microsoft's multitenant cloud based directory and identity management service. Azure itself uses Microsoft Entra ID for the authentication of its customers, service administrators, and organizational users.

The Batch Management .NET library exposes types for working with Batch accounts, account keys, applications, and application packages. The Batch Management .NET library is an Azure resource provider client, and is used together with [Azure Resource Manager](../azure-resource-manager/management/overview.md) to manage these resources programmatically. Microsoft Entra ID is required to authenticate requests made through any Azure resource provider client, including the Batch Management .NET library, and through Azure Resource Manager.

In this article, we explore using Microsoft Entra ID to authenticate from applications that use the Batch Management .NET library. We show how to use Microsoft Entra ID to authenticate a subscription administrator or co-administrator, using integrated authentication. We use the [AccountManagement](https://github.com/Azure/azure-batch-samples/tree/master/CSharp/AccountManagement) sample project, available on GitHub, to walk through using Microsoft Entra ID with the Batch Management .NET library.

To learn more about using the Batch Management .NET library and the AccountManagement sample, see [Manage Batch accounts and quotas with the Batch Management client library for .NET](batch-management-dotnet.md).

<a name='register-your-application-with-azure-ad'></a>

## Register your application with Microsoft Entra ID

The [Microsoft Authentication Library](../active-directory/develop/msal-authentication-flows.md) (MSAL) provides a programmatic interface to Microsoft Entra ID for use within your applications. To call MSAL from your application, you must register your application in a Microsoft Entra tenant. When you register your application, you supply Microsoft Entra ID with information about your application, including a name for it within the Microsoft Entra tenant. Microsoft Entra ID then provides an application ID that you use to associate your application with Microsoft Entra ID at runtime. To learn more about the application ID, see [Application and service principal objects in Microsoft Entra ID](../active-directory/develop/app-objects-and-service-principals.md).

To register the AccountManagement sample application, follow the steps in the [Adding an Application](../active-directory/develop/quickstart-register-app.md) section in [Integrating applications with Microsoft Entra ID](../active-directory/develop/quickstart-register-app.md). Specify **Native Client Application** for the type of application. The industry standard OAuth 2.0 URI for the **Redirect URI** is `urn:ietf:wg:oauth:2.0:oob`. However, you can specify any valid URI (such as `http://myaccountmanagementsample`) for the **Redirect URI**, as it does not need to be a real endpoint.

![Adding an application](./media/batch-aad-auth-management/app-registration-management-plane.png)

Once you complete the registration process, you'll see the application ID and the object (service principal) ID listed for your application.

![Completed registration process](./media/batch-aad-auth-management/app-registration-client-id.png)

## Grant the Azure Resource Manager API access to your application

Next, you'll need to delegate access to your application to the Azure Resource Manager API. The Microsoft Entra identifier for the Resource Manager API is **Windows Azure Service Management API**.

Follow these steps in the Azure portal:

1. In the left-hand navigation pane of the Azure portal, choose **All services**, click **App Registrations**, and click **Add**.
2. Search for the name of your application in the list of app registrations:

    ![Search for your application name](./media/batch-aad-auth-management/search-app-registration.png)

3. Display the **Settings** blade. In the **API Access** section, select **Required permissions**.
4. Click **Add** to add a new required permission.
5. In step 1, enter **Windows Azure Service Management API**, select that API from the list of results, and click the **Select** button.
6. In step 2, select the check box next to **Access Azure classic deployment model as organization users**, and click the **Select** button.
7. Click the **Done** button.

The **Required Permissions** blade now shows that permissions to your application are granted to both the MSAL and Resource Manager APIs. Permissions are granted to MSAL by default when you first register your app with Microsoft Entra ID.

![Delegate permissions to the Azure Resource Manager API](./media/batch-aad-auth-management/required-permissions-management-plane.png)

<a name='azure-ad-endpoints'></a>

## Microsoft Entra endpoints

To authenticate your Batch Management solutions with Microsoft Entra ID, you'll need two well-known endpoints.

- The **Microsoft Entra common endpoint** provides a generic credential gathering interface when a specific tenant is not provided, as in the case of integrated authentication:

    `https://login.microsoftonline.com/common`

- The **Azure Resource Manager endpoint** is used to acquire a token for authenticating requests to the Batch management service:

    `https://management.core.windows.net/`

The AccountManagement sample application defines constants for these endpoints. Leave these constants unchanged:

```csharp
// Azure Active Directory "common" endpoint.
private const string AuthorityUri = "https://login.microsoftonline.com/common";
// Azure Resource Manager endpoint
private const string ResourceUri = "https://management.core.windows.net/";
```

## Reference your application ID

Your client application uses the application ID (also referred to as the client ID) to access Microsoft Entra ID at runtime. Once you've registered your application in the Azure portal, update your code to use the application ID provided by Microsoft Entra ID for your registered application. In the AccountManagement sample application, copy your application ID from the Azure portal to the appropriate constant:

```csharp
// Specify the unique identifier (the "Client ID") for your application. This is required so that your
// native client application (i.e. this sample) can access the Microsoft Graph API. For information
// about registering an application in Azure Active Directory, please see "Register an application with the Microsoft identity platform" here:
// https://learn.microsoft.com/azure/active-directory/develop/quickstart-register-app
private const string ClientId = "<application-id>";
```
Also copy the redirect URI that you specified during the registration process. The redirect URI specified in your code must match the redirect URI that you provided when you registered the application.

```csharp
// The URI to which Azure AD will redirect in response to an OAuth 2.0 request. This value is
// specified by you when you register an application with AAD (see ClientId comment). It does not
// need to be a real endpoint, but must be a valid URI (e.g. https://accountmgmtsampleapp).
private const string RedirectUri = "http://myaccountmanagementsample";
```

<a name='acquire-an-azure-ad-authentication-token'></a>

## Acquire a Microsoft Entra authentication token

After you register the AccountManagement sample in the Microsoft Entra tenant and update the sample source code with your values, the sample is ready to authenticate using Microsoft Entra ID. When you run the sample, the MSAL attempts to acquire an authentication token. At this step, it prompts you for your Microsoft credentials:

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

After you provide your credentials, the sample application can proceed to issue authenticated requests to the Batch management service.

## Next steps

- For more information on running the [AccountManagement sample application](https://github.com/Azure/azure-batch-samples/tree/master/CSharp/AccountManagement), see [Manage Batch accounts and quotas with the Batch Management client library for .NET](batch-management-dotnet.md).
- To learn more about Microsoft Entra ID, see the [Microsoft Entra Documentation](../active-directory/index.yml).
- In-depth examples showing how to use MSAL are available in the [Azure Code Samples](https://azure.microsoft.com/resources/samples/?service=active-directory) library.
- To authenticate Batch service applications using Microsoft Entra ID, see [Authenticate Batch service solutions with Active Directory](batch-aad-auth.md).
