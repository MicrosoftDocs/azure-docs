---
title: Get started with custom claims providers (preview)
titleSuffix: Microsoft identity platform
description: Learn how to develop and register a Microsoft Entra custom authentication extensions REST API. The custom authentication extension allows you to source claims from a data store that is external to Microsoft Entra ID.  
services: active-directory
author: davidmu1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 08/16/2023
ms.author: davidmu
ms.custom: aaddev
ms.reviewer: JasSuri
#Customer intent: As an application developer, I want to create and register a custom authentication extensions API so I can source claims from a data store that is external to Microsoft Entra ID.
---

# Configure a custom claim provider token issuance event (preview)

This article describes how to configure and set up a custom claims provider with the [token issuance start event](custom-claims-provider-overview.md#token-issuance-start-event-listener) type. This event is triggered right before the token is issued, and allows you to call a REST API to add claims to the token. 

This how-to guide demonstrates the token issuance start event with a REST API running in Azure Functions and a sample OpenID Connect application. Before you start, take a look at following video, which demonstrates how to configure Microsoft Entra custom claims provider with Function App:

> [!VIDEO https://www.youtube.com/embed/fxQGVIwX8_4]

## Prerequisites

- Before following this article, read the [custom authentication extensions](custom-extension-overview.md) overview.

- To use Azure services, including Azure Functions, you need an Azure subscription. If you don't have an existing Azure account, you may sign up for a [free trial](https://azure.microsoft.com/free/dotnet/) or use your [Visual Studio Subscription](https://visualstudio.microsoft.com/subscriptions/) benefits when you [create an account](https://account.windowsazure.com/Home/Index).

## Step 1: Create an Azure Function app

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

In this step, you create an HTTP trigger function API in the Azure portal. The function API is the source of extra claims for your token. Follow these steps to create an Azure Function:

1. Sign in to the [Azure portal](https://portal.azure.com) with your administrator account.
1. From the Azure portal menu or the **Home** page, select **Create a resource**.
1. In the **New** page, select **Compute** > **Function App**.
1. On the **Basics** page, use the function app settings as specified in the following table:

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Subscription** | Your subscription | The subscription under which the new function app will be created in. |
    | **[Resource Group](/azure/azure-resource-manager/management/overview)** |  *myResourceGroup* | Select and existing resource group, or name for the new one in which you'll create your function app. |
    | **Function App name** | Globally unique name | A name that identifies the new function app. Valid characters are `a-z` (case insensitive), `0-9`, and `-`.  |
    |**Publish**| Code | Option to publish code files or a Docker container. For this tutorial, select **Code**. |
    | **Runtime stack** | .NET | Your preferred programming language. For this tutorial, select **.NET**.  |
    |**Version**| 6 | Version of the .NET runtime. |
    |**Region**| Preferred region | Select a [region](https://azure.microsoft.com/regions/) that's near you or near other services that your functions can access. |
    | **Operating System** | Windows | The operating system is pre-selected for you based on your runtime stack selection. |
    | **Plan type** | Consumption (Serverless) | Hosting plan that defines how resources are allocated to your function app.  |

1. Select **Review + create** to review the app configuration selections and then select **Create**.

1. Select the **Notifications** icon in the upper-right corner of the portal and watch for the **Deployment succeeded** message. Then, select **Go to resource** to view your new function app.

### 1.1 Create an HTTP trigger function

After the Azure Function app is created, create an HTTP trigger function. The HTTP trigger lets you invoke a function with an HTTP request. This HTTP trigger will be referenced and called by your Microsoft Entra custom authentication extension.

1. Within your **Function App**, from the menu select **Functions**.
1. From the top menu, select **+ Create**.
1. In the **Create Function** window, leave the **Development environment** property as **Develop in portal**, and then select the **HTTP trigger** template.
1. Under **Template details**, enter *CustomAuthenticationExtensionsAPI* for the **New Function** property.
1. For the **Authorization level**, select **Function**.
1. Select **Create**

The following screenshot demonstrates how to configure the Azure HTTP trigger function.

:::image type="content" border="false"source="media/custom-extension-get-started/create-http-trigger-function.png" alt-text="Screenshot that shows how to choose the development environment, and template." lightbox="media/custom-extension-get-started/create-http-trigger-function.png":::

### 1.2 Edit the function

1. From the menu, select **Code + Test**
1. Replace the entire code with the following code snippet.

    ```csharp
    #r "Newtonsoft.Json"
    using System.Net;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Primitives;
    using Newtonsoft.Json;
    public static async Task<IActionResult> Run(HttpRequest req, ILogger log)
    {
        log.LogInformation("C# HTTP trigger function processed a request.");
        string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        dynamic data = JsonConvert.DeserializeObject(requestBody);
        
        // Read the correlation ID from the Azure AD  request    
        string correlationId = data?.data.authenticationContext.correlationId;
        
        // Claims to return to Azure AD
        ResponseContent r = new ResponseContent();
        r.data.actions[0].claims.CorrelationId = correlationId;
        r.data.actions[0].claims.ApiVersion = "1.0.0";
        r.data.actions[0].claims.DateOfBirth = "01/01/2000";
        r.data.actions[0].claims.CustomRoles.Add("Writer");
        r.data.actions[0].claims.CustomRoles.Add("Editor");
        return new OkObjectResult(r);
    }

    public class ResponseContent{
        [JsonProperty("data")]
        public Data data { get; set; }
        public ResponseContent()
        {
            data = new Data();
        }
    }

    public class Data{
        [JsonProperty("@odata.type")]
        public string odatatype { get; set; }
        public List<Action> actions { get; set; }
        public Data()
        {
            odatatype = "microsoft.graph.onTokenIssuanceStartResponseData";
            actions = new List<Action>();
            actions.Add(new Action());
        }
    }

    public class Action{
        [JsonProperty("@odata.type")]
        public string odatatype { get; set; }
        public Claims claims { get; set; }
        public Action()
        {
            odatatype = "microsoft.graph.tokenIssuanceStart.provideClaimsForToken";
            claims = new Claims();
        }
    }

    public class Claims{
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string CorrelationId { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string DateOfBirth { get; set; }
        public string ApiVersion { get; set; }
        public List<string> CustomRoles { get; set; }
        public Claims()
        {
            CustomRoles = new List<string>();
        }
    }
    ```

    The code starts with reading the incoming JSON object. Microsoft Entra ID sends the [JSON object](./custom-claims-provider-reference.md) to your API. In this example, it reads the correlation ID value. Then, the code returns a collection of claims, including the original correlation ID, the version of your Azure Function, date of birth and custom role that is returned to Microsoft Entra ID.

1. From the top menu, select **Get Function Url**, and copy the URL. In the next step, the function URL will be used and referred to as `{Function_Url}`.

## Step 2: Register a custom authentication extension

In this step, you configure a custom authentication extension, which will be used by Microsoft Entra ID to call your Azure function. The custom authentication extension contains information about your REST API endpoint, the claims that it parses from your REST API, and how to authenticate to your REST API. Follow these steps to register a custom authentication extension:

# [Microsoft Entra admin center](#tab/entra-admin-center)

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Application Administrator](../roles/permissions-reference.md#application-developer) and [Authentication Administrator](../roles/permissions-reference.md#authentication-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. Select **Custom authentication extensions**, and then select **Create a custom authentication extension**.
1. In **Basics**, select the **tokenIssuanceStart** event and select **Next**.
1. In **Endpoint Configuration**, fill in the following properties:

    - **Name** - A name for your custom authentication extension. For example, *Token issuance event*.
    - **Target Url** - The `{Function_Url}` of your Azure Function URL.
    - **Description** - A description for your custom authentication extensions.

1. Select **Next**.

1. In **API Authentication**, select the **Create new app registration** option to create an app registration that represents your *function app*.  

1. Give the app a name, for example **Azure Functions authentication events API**.

1. Select **Next**.

1. In **Claims**, enter the attributes that you expect your custom authentication extension to parse from your REST API and will be merged into the token. Add the following claims:

    - dateOfBirth
    - customRoles
    - apiVersion
    - correlationId

1. Select **Next** and **Create**, which registers the custom authentication extension and the associated application registration.

# [Microsoft Graph](#tab/microsoft-graph)

Register an application to authenticate your custom authentication extension to your Azure Function.

1. Sign in to [Graph Explorer](https://aka.ms/ge) using an account whose home tenant is the tenant you wish to manage your custom authentication extension in. The account must have the privileges to create and manage an application registration in the tenant.
2. Run the following request.

    # [HTTP](#tab/http)
    ```http
    POST https://graph.microsoft.com/v1.0/applications
    Content-type: application/json
    
    {
        "displayName": "authenticationeventsAPI"
    }
    ```

    # [C#](#tab/csharp)
    [!INCLUDE [sample-code](~/microsoft-graph/includes/snippets/csharp/v1/tutorial-application-basics-create-app-csharp-snippets.md)]
    
    # [Go](#tab/go)
    [!INCLUDE [sample-code](~/microsoft-graph/includes/snippets/go/v1/tutorial-application-basics-create-app-go-snippets.md)]
    
    # [Java](#tab/java)
    [!INCLUDE [sample-code](~/microsoft-graph/includes/snippets/java/v1/tutorial-application-basics-create-app-java-snippets.md)]
    
    # [JavaScript](#tab/javascript)
    [!INCLUDE [sample-code](~/microsoft-graph/includes/snippets/javascript/v1/tutorial-application-basics-create-app-javascript-snippets.md)]
    
    # [PHP](#tab/php)
    Snippet not available.
    
    # [PowerShell](#tab/powershell)
    [!INCLUDE [sample-code](~/microsoft-graph/includes/snippets/powershell/v1/tutorial-application-basics-create-app-powershell-snippets.md)]
    
    # [Python](#tab/python)
    [!INCLUDE [sample-code](~/microsoft-graph/includes/snippets/python/v1/tutorial-application-basics-create-app-python-snippets.md)]
    
    ---

3. From the response, record the value of **id** and **appId** of the newly created app registration. These values will be referenced in this article as `{authenticationeventsAPI_ObjectId}` and `{authenticationeventsAPI_AppId}` respectively.

Create a service principal in the tenant for the authenticationeventsAPI app registration.

Still in Graph Explorer, run the following request. Replace `{authenticationeventsAPI_AppId}` with the value of **appId** that you recorded from the previous step.

```http
POST https://graph.microsoft.com/v1.0/servicePrincipals
Content-type: application/json
    
{
    "appId": "{authenticationeventsAPI_AppId}"
}
```

### Set the App ID URI, access token version, and required resource access

Update the newly created application to set the application ID URI value, the access token version, and the required resource access.

In Graph Explorer, run the following request. 
   - Set the application ID URI value in the *identifierUris* property. Replace `{Function_Url_Hostname}` with the hostname of the `{Function_Url}` you recorded earlier.
   - Set the `{authenticationeventsAPI_AppId}` value with the **appId** that you recorded earlier.
   - An example value is `api://authenticationeventsAPI.azurewebsites.net/f4a70782-3191-45b4-b7e5-dd415885dd80`. Take note of this value as you'll use it later in this article in place of `{functionApp_IdentifierUri}`.

```http
POST https://graph.microsoft.com/v1.0/applications/{authenticationeventsAPI_ObjectId}
Content-type: application/json

{
"identifierUris": [
    "api://{Function_Url_Hostname}/{authenticationeventsAPI_AppId}"
],    
"api": {
    "requestedAccessTokenVersion": 2,
    "acceptMappedClaims": null,
    "knownClientApplications": [],
    "oauth2PermissionScopes": [],
    "preAuthorizedApplications": []
},
"requiredResourceAccess": [
    {
        "resourceAppId": "00000003-0000-0000-c000-000000000000",
        "resourceAccess": [
            {
                "id": "214e810f-fda8-4fd7-a475-29461495eb00",
                "type": "Role"
            }
        ]
    }
]
}
```

### Register a custom authentication extension

Next, you register the custom authentication extension. You register the custom authentication extension by associating it with the app registration for the Azure Function, and your Azure Function endpoint `{Function_Url}`.

1. In Graph Explorer, run the following request. Replace `{Function_Url}` with the hostname of your Azure Function app. Replace `{functionApp_IdentifierUri}` with the identifierUri used in the previous step.
   - You'll need the *CustomAuthenticationExtension.ReadWrite.All* delegated permission. 

    # [HTTP](#tab/http)
    ```http
    POST https://graph.microsoft.com/beta/identity/customAuthenticationExtensions
    Content-type: application/json
    
    {
        "@odata.type": "#microsoft.graph.onTokenIssuanceStartCustomExtension",
        "displayName": "onTokenIssuanceStartCustomExtension",
        "description": "Fetch additional claims from custom user store",
        "endpointConfiguration": {
            "@odata.type": "#microsoft.graph.httpRequestEndpoint",
            "targetUrl": "{Function_Url}"
        },
        "authenticationConfiguration": {
            "@odata.type": "#microsoft.graph.azureAdTokenAuthentication",
            "resourceId": "{functionApp_IdentifierUri}"
        },
        "claimsForTokenConfiguration": [
            {
                "claimIdInApiResponse": "DateOfBirth"
            },
            {
                "claimIdInApiResponse": "CustomRoles"
            }
        ]
    }
    ```
    # [C#](#tab/csharp)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/beta/includes/snippets/csharp/create-customauthenticationextension-from--csharp-snippets.md)]
    
    # [Go](#tab/go)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/beta/includes/snippets/go/create-customauthenticationextension-from--go-snippets.md)]
    
    # [Java](#tab/java)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/beta/includes/snippets/java/create-customauthenticationextension-from--java-snippets.md)]
    
    # [JavaScript](#tab/javascript)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/beta/includes/snippets/javascript/create-customauthenticationextension-from--javascript-snippets.md)]
    
    # [PHP](#tab/php)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/beta/includes/snippets/php/create-customauthenticationextension-from--php-snippets.md)]
    
    # [PowerShell](#tab/powershell)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/beta/includes/snippets/powershell/create-customauthenticationextension-from--powershell-snippets.md)]
    
    # [Python](#tab/python)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/beta/includes/snippets/python/create-customauthenticationextension-from--python-snippets.md)]

    ---

1. Record the **id** value of the created custom claims provider object. You'll use the value later in this tutorial in place of `{customExtensionObjectId}`.

---

### 2.2 Grant admin consent

After your custom authentication extension is created, open the **Overview** tab of the new custom authentication extension.

From the **Overview** page, select the **Grant permission** button to give admin consent to the registered app, which allows the custom authentication extension to authenticate to your API. The custom authentication extension uses `client_credentials` to authenticate to the Azure Function App using the `Receive custom authentication extension HTTP requests` permission.

The following screenshot shows how to grant permissions.

:::image type="content" border="false"source="./media/custom-extension-get-started/custom-extensions-overview.png" alt-text="Screenshot that shows how grant admin consent." lightbox="media/custom-extension-get-started/custom-extensions-overview.png":::

## Step 3: Configure an OpenID Connect app to receive enriched tokens

To get a token and test the custom authentication extension, you can use the <https://jwt.ms> app. It's a Microsoft-owned web application that displays the decoded contents of a token (the contents of the token never leave your browser).

Follow these steps to register the **jwt.ms** web application:

### 3.1 Register a test web application

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Application Administrator](../roles/permissions-reference.md#application-developer).
1. Browse to **Identity** > **Applications** > **Application registrations**.
1. Select **New registration**.
1. Enter a **Name** for the application. For example, **My Test application**.
1. Under **Supported account types**, select **Accounts in this organizational directory only**.
1. In the **Select a platform** dropdown in **Redirect URI**, select **Web** and then enter `https://jwt.ms` in the URL text box.
1. Select **Register** to complete the app registration.

The following screenshot shows how to register the *My Test application*.

:::image type="content" border="false"source="media/custom-extension-get-started/register-test-web-application.png" alt-text="Screenshot that shows how to select the supported account type and redirect URI.":::

### 3.1 Get the application ID

In your app registration, under **Overview**, copy the **Application (client) ID**. The app ID is referred to as the `{App_to_enrich_ID}` in later steps. In Microsoft Graph, it's referenced by the **appId** propety.

:::image type="content" border="false"source="media/custom-extension-get-started/get-the-test-application-id.png" alt-text="Screenshot that shows how to copy the application ID.":::

### 3.2 Enable implicit flow

The **jwt.ms** test application uses the implicit flow. Enable implicit flow in your *My Test application* registration:

1. Under **Manage**, select **Authentication**.
1. Under **Implicit grant and hybrid flows**, select the **ID tokens (used for implicit and hybrid flows)** checkbox.
1. Select **Save**.

### 3.3 Enable your App for a claims mapping policy

A claims mapping policy is used to select which attributes returned from the custom authentication extension are mapped into the token. To allow tokens to be augmented, you must explicitly enable the application registration to accept mapped claims:

1. In your *My Test application* registration, under **Manage**, select **Manifest**.
1. In the manifest, locate the `acceptMappedClaims` attribute, and set the value to `true`.
1. Set the `accessTokenAcceptedVersion` to `2`.
1. Select **Save** to save the changes.

The following JSON snippet demonstrates how to configure these properties.

```json
{
  "acceptMappedClaims": true,
  "accessTokenAcceptedVersion": 2,
  "appId": "22222222-0000-0000-0000-000000000000",
}
```

> [!WARNING]
> Do not set `acceptMappedClaims` property to `true` for multi-tenant apps, which can allow malicious actors to create claims-mapping policies for your app. Instead [configure a custom signing key](/graph/application-saml-sso-configure-api#option-2-create-a-custom-signing-certificate).

## Step 4: Assign a custom claims provider to your app

For tokens to be issued with claims incoming from the custom authentication extension, you must assign a custom claims provider to your application. This is based on the token audience, so the provider must be assigned to the client application to receive claims in an ID token, and to the resource application to receive claims in an access token. The custom claims provider relies on the custom authentication extension configured with the **token issuance start** event listener. You can choose whether all, or a subset of claims, from the custom claims provider are mapped into the token.

Follow these steps to connect the *My Test application* with your custom authentication extension:

# [Microsoft Entra admin center](#tab/entra-admin-center)

First assign the custom authentication extension as a custom claims provider source:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Application Administrator](../roles/permissions-reference.md#application-administrator).
1. Browse to **Identity** > **Applications** > **Application registrations**.
1. In the **Overview** page, under **Managed application in local directory**, select **My Test application**.
1. Under **Manage**, select **Single sign-on**.
1. Under **Attributes & Claims**, select **Edit**.

    :::image type="content" border="false"  source="./media/custom-extension-get-started/open-id-connect-based-sign-on.png" alt-text="Screenshot that shows how to configure app claims." lightbox="./media/custom-extension-get-started/open-id-connect-based-sign-on.png":::

1. Expand the **Advanced settings** menu.
1. Select **Configure** against **Custom claims provider**.
1. Expand the **Custom claims provider** drop-down box, and select the *Token issuance event* you created earlier.
1. Select **Save**.

Next, assign the attributes from the custom claims provider, which should be issued into the token as claims:

1. Select **Add new claim** to add a new claim. Provide a name to the claim you want to be issued, for example **dateOfBirth**.
1. Under **Source**, select `Attribute`, and choose `customClaimsProvider.DateOfBirth` from the **Source attribute** drop-down box.

    :::image type="content" border="false"  source="media/custom-extension-get-started/manage-claim.png" alt-text="Screenshot that shows how to add a claim mapping to your app." lightbox="media/custom-extension-get-started/manage-claim.png":::

1. Select **Save**.
1. You can repeat this process to add the `customClaimsProvider.customRoles`, `customClaimsProvider.apiVersion` and `customClaimsProvider.correlationId` attributes.

# [Microsoft Graph](#tab/microsoft-graph)

First create an event listener to trigger a custom authentication extension for the *My Test application* using the token issuance start event.

1. Sign in to [Graph Explorer](https://aka.ms/ge) using an account whose home tenant is the tenant you wish to manage your custom authentication extension in.
1. Run the following request. Replace `{App_to_enrich_ID}` with the app ID of *My Test application* recorded earlier. Replace `{customExtensionObjectId}` with the custom authentication extension ID recorded earlier.
    - You'll need the *EventListener.ReadWrite.All* delegated permission. 

    # [HTTP](#tab/http)
    ```http
    POST https://graph.microsoft.com/beta/identity/authenticationEventListeners
    Content-type: application/json
    
    {
        "@odata.type": "#microsoft.graph.onTokenIssuanceStartListener",
        "conditions": {
            "applications": {
                "includeAllApplications": false,
                "includeApplications": [
                    {
                        "appId": "{App_to_enrich_ID}"
                    }
                ]
            }
        },
        "priority": 500,
        "handler": {
            "@odata.type": "#microsoft.graph.onTokenIssuanceStartCustomExtensionHandler",
            "customExtension": {
                "id": "{customExtensionObjectId}"
            }
        }
    }
    ```

    # [C#](#tab/csharp)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/beta/includes/snippets/csharp/create-authenticationeventlistener-from--csharp-snippets.md)]
    
    # [Go](#tab/go)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/beta/includes/snippets/go/create-authenticationeventlistener-from--go-snippets.md)]
    
    # [Java](#tab/java)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/beta/includes/snippets/java/create-authenticationeventlistener-from--java-snippets.md)]
    
    # [JavaScript](#tab/javascript)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/beta/includes/snippets/javascript/create-authenticationeventlistener-from--javascript-snippets.md)]
    
    # [PHP](#tab/php)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/beta/includes/snippets/php/create-authenticationeventlistener-from--php-snippets.md)]
    
    # [PowerShell](#tab/powershell)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/beta/includes/snippets/powershell/create-authenticationeventlistener-from--powershell-snippets.md)]
    
    # [Python](#tab/python)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/beta/includes/snippets/python/create-authenticationeventlistener-from--python-snippets.md)]
    
    ---


Next, create the claims mapping policy, which describes which claims can be issued to an application from a custom claims provider.

1. Still in Graph Explorer, run the following request. You'll need the *Policy.ReadWrite.ApplicationConfiguration* delegated permission.


    # [HTTP](#tab/http)
    ```http
    POST https://graph.microsoft.com/v1.0/policies/claimsMappingPolicies
    Content-type: application/json

    {
        "definition": [
            "{\"ClaimsMappingPolicy\":{\"Version\":1,\"IncludeBasicClaimSet\":\"true\",\"ClaimsSchema\":[{\"Source\":\"CustomClaimsProvider\",\"ID\":\"DateOfBirth\",\"JwtClaimType\":\"dob\"},{\"Source\":\"CustomClaimsProvider\",\"ID\":\"CustomRoles\",\"JwtClaimType\":\"my_roles\"},{\"Source\":\"CustomClaimsProvider\",\"ID\":\"CorrelationId\",\"JwtClaimType\":\"correlationId\"},{\"Source\":\"CustomClaimsProvider\",\"ID\":\"ApiVersion\",\"JwtClaimType\":\"apiVersion \"},{\"Value\":\"tokenaug_V2\",\"JwtClaimType\":\"policy_version\"}]}}"
        ],
        "displayName": "MyClaimsMappingPolicy",
        "isOrganizationDefault": false
    }
    ```
    # [C#](#tab/csharp)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/csharp/create-claimsmappingpolicy-from-claimsmappingpolicies-csharp-snippets.md)]
    
    # [Go](#tab/go)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/go/create-claimsmappingpolicy-from-claimsmappingpolicies-go-snippets.md)]
    
    # [Java](#tab/java)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/java/create-claimsmappingpolicy-from-claimsmappingpolicies-java-snippets.md)]
    
    # [JavaScript](#tab/javascript)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/javascript/create-claimsmappingpolicy-from-claimsmappingpolicies-javascript-snippets.md)]
    
    # [PHP](#tab/php)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/php/create-claimsmappingpolicy-from-claimsmappingpolicies-php-snippets.md)]
    
    # [PowerShell](#tab/powershell)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/powershell/create-claimsmappingpolicy-from-claimsmappingpolicies-powershell-snippets.md)]
    
    # [Python](#tab/python)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/python/create-claimsmappingpolicy-from-claimsmappingpolicies-python-snippets.md)]
    
    ---

2. Record the `ID` generated in the response, later it's referred to as `{claims_mapping_policy_ID}`.

Get the service principal object ID:

1. Run the following request in Graph Explorer. Replace `{App_to_enrich_ID}` with the **appId** of *My Test Application*.

    ```http
    GET https://graph.microsoft.com/v1.0/servicePrincipals(appId='{App_to_enrich_ID}')
    ```

Record the value of **id**.

Assign the claims mapping policy to the service principal of *My Test Application*.

1. Run the following request in Graph Explorer. You'll need the *Policy.ReadWrite.ApplicationConfiguration* and *Application.ReadWrite.All* delegated permission.

    # [HTTP](#tab/http)
    ```http
    POST https://graph.microsoft.com/v1.0/servicePrincipals/{test_App_Service_Principal_ObjectId}/claimsMappingPolicies/$ref
    Content-type: application/json

    {
        "@odata.id": "https://graph.microsoft.com/v1.0/policies/claimsMappingPolicies/{claims_mapping_policy_ID}"
    }
    ```

    # [C#](#tab/csharp)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/csharp/create-claimsmappingpolicy-from-serviceprincipal-csharp-snippets.md)]
    
    # [Go](#tab/go)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/go/create-claimsmappingpolicy-from-serviceprincipal-go-snippets.md)]
    
    # [Java](#tab/java)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/java/create-claimsmappingpolicy-from-serviceprincipal-java-snippets.md)]
    
    # [JavaScript](#tab/javascript)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/javascript/create-claimsmappingpolicy-from-serviceprincipal-javascript-snippets.md)]
    
    # [PHP](#tab/php)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/php/create-claimsmappingpolicy-from-serviceprincipal-php-snippets.md)]
    
    # [PowerShell](#tab/powershell)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/powershell/create-claimsmappingpolicy-from-serviceprincipal-powershell-snippets.md)]
    
    # [Python](#tab/python)
    [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/python/create-claimsmappingpolicy-from-serviceprincipal-python-snippets.md)]
    
    ---

---

## Step 5: Protect your Azure Function

Microsoft Entra custom authentication extension uses server to server flow to obtain an access token that is sent in the HTTP `Authorization` header to your Azure function. When publishing your function to Azure, especially in a production environment, you need to validate the token sent in the authorization header.

To protect your Azure function, follow these steps to integrate Microsoft Entra authentication, for validating incoming tokens with your *Azure Functions authentication events API* application registration.

> [!NOTE]
> If the Azure function app is hosted in a different Azure tenant than the tenant in which your custom authentication extension is registered, skip to [using OpenID Connect identity provider](#51-using-openid-connect-identity-provider) step.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate and select the function app you previously published.
1. Select **Authentication** in the menu on the left.
1. Select **Add Identity provider**.  
1. Select **Microsoft** as the identity provider.
1. Under **App registration**->**App registration type**, select **Pick an existing app registration in this directory** and pick the *Azure Functions authentication events API* app registration you [previously created](#step-2-register-a-custom-authentication-extension) when registering the custom claims provider.
1. Under **Unauthenticated requests**, select **HTTP 401 Unauthorized** as the identity provider.
1. Unselect the **Token store** option.
1. Select **Add** to add authentication to your Azure Function.

    :::image type="content" border="true"  source="media/custom-extension-get-started/configure-auth-function-app.png" alt-text="Screenshot that shows how to add authentication to your function app." lightbox="media/custom-extension-get-started/configure-auth-function-app.png":::

### 5.1 Using OpenID Connect identity provider

If you configured the [Microsoft identity provider](#step-5-protect-your-azure-function), skip this step. Otherwise, if the Azure Function is hosted under a different tenant than the tenant in which your custom authentication extension is registered, follow these steps to protect your function:

1. Sign in to the [Azure portal](https://portal.azure.com), then navigate and select the function app you previously published.
1. Select **Authentication** in the menu on the left.
1. Select **Add Identity provider**.  
1. Select **OpenID Connect** as the identity provider.
1. Provide a name, such as *Contoso Microsoft Entra ID*.
1. Under the **Metadata entry**, enter the following URL to the **Document URL**. Replace the `{tenantId}` with your Microsoft Entra tenant ID.

    ```http
    https://login.microsoftonline.com/{tenantId}/v2.0/.well-known/openid-configuration
    ```

1. Under the **App registration**, enter the application ID (client ID) of the *Azure Functions authentication events API* app registration [you created previously](#step-2-register-a-custom-authentication-extension).

1. In the Microsoft Entra admin center:
    1. Select the *Azure Functions authentication events API* app registration [you created previously](#step-2-register-a-custom-authentication-extension).
    1. Select **Certificates & secrets** > **Client secrets** > **New client secret**.
    1. Add a description for your client secret.
    1. Select an expiration for the secret or specify a custom lifetime.
    1. Select **Add**.
    1. Record the **secret's value** for use in your client application code. This secret value is never displayed again after you leave this page.
1. Back to the Azure Function, under the **App registration**, enter the **Client secret**.
1. Unselect the **Token store** option.
1. Select **Add** to add the OpenID Connect identity provider.

## Step 6: Test the application

To test your custom claim provider, follow these steps:

1. Open a new private browser and navigate and sign-in through the following URL.

    ```http
    https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/authorize?client_id={App_to_enrich_ID}&response_type=id_token&redirect_uri=https://jwt.ms&scope=openid&state=12345&nonce=12345
    ```

1. Replace `{tenant-id}` with your tenant ID, tenant name, or one of your verified domain names. For example, `contoso.onmicrosoft.com`.
1. Replace `{App_to_enrich_ID}` with the [My Test application registration ID](#31-get-the-application-id).  
1. After logging in, you'll be presented with your decoded token at `https://jwt.ms`. Validate that the claims from the Azure Function are presented in the decoded token, for example, `dateOfBirth`.

## Next steps

- Learn how to configure a [SAML application](custom-extension-configure-saml-app.md) to receive tokens with claims sourced from an external store.

- Learn more about custom claims providers with the [custom claims provider reference](custom-claims-provider-reference.md) article.

- Learn how to [troubleshoot your custom authentication extensions API](custom-extension-troubleshoot.md).
