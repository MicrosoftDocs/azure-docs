---
title: Troubleshoot a custom claims provider
titleSuffix: Microsoft identity platform
description: Troubleshoot and monitor your custom claims provider API.  Learn how to use logging and Microsoft Entra sign-in logs to find errors and issues in your custom claims provider API.
services: active-directory
author: davidmu1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 03/06/2023
ms.author: davidmu
ms.custom: aaddev
ms.reviewer: JasSuri
#Customer intent: As an application developer, I want to find errors and issues in my custom claims provider API.
---

# Troubleshoot your custom claims provider API (preview)

Authentication events and [custom claims providers](custom-claims-provider-overview.md) allow you to customize the Microsoft Entra authentication experience by integrating with external systems.  For example, you can create a custom claims provider API and configure an [OpenID Connect app](./custom-extension-get-started.md) or [SAML app](custom-extension-configure-saml-app.md) to receive tokens with claims from an external store.

## Error behavior

When an API call fails, the error behavior is as follows:

- For OpenId Connect apps - Microsoft Entra ID redirects the user back to the client application with an error. A token isn't minted.
- For SAML apps -  Microsoft Entra ID shows the user an error screen in the authentication experience. The user isn't redirected back to the client application.

The error code sent back to the application or the user is generic. To troubleshoot, check the [sign-in logs](#azure-ad-sign-in-logs) for the [error codes](#error-codes-reference).

## Logging

In order to troubleshoot issues with your custom claims provider REST API endpoint, the REST API must handle logging. Azure Functions and other API-development platforms provide in-depth logging solutions. Use those solutions to get detailed information on your APIs behavior and troubleshoot your API logic.

<a name='azure-ad-sign-in-logs'></a>

## Microsoft Entra sign-in logs

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

You can also use [Microsoft Entra sign-in logs](../reports-monitoring/concept-sign-ins.md) in addition to your REST API logs, and hosting environment diagnostics solutions. Using Microsoft Entra sign-in logs, you can find errors, which may affect the users' sign-ins. The Microsoft Entra sign-in logs provide  information about the HTTP status, error code, execution duration, and number of retries that occurred the API was called by Microsoft Entra ID.

Microsoft Entra sign-in logs also integrate with [Azure Monitor](/azure/azure-monitor/). You can set up alerts and monitoring, visualize the data, and integrate with security information and event management (SIEM)  tools. For example, you can set up notifications if the number of errors exceed a certain threshold that you choose.

To access the Microsoft Entra sign-in logs:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. Select **Sign-in logs**, and then select the latest sign-in log.
1. For more details, select the **Authentication Events** tab. Information related to the custom authentication extension REST API call is displayed, including any [error codes](#error-codes-reference).

    :::image type="content" source="media/custom-extension-troubleshoot/authentication-events.png" alt-text="Screenshot that shows the authentication events information." :::

## Error codes reference

Use the following table to diagnose an error code.

|Error code |Error name |Description |
|----|----|----|
|1003000 | EventHandlerUnexpectedError | There was an unexpected error when processing an event handler.|
|1003001 | CustomExtenstionUnexpectedError | There was an unexpected error while calling a custom extension API.|
|1003002 | CustomExtensionInvalidHTTPStatus | The custom extension API returned an invalid HTTP status code. Check that the API returns an accepted status code defined for that custom extension type.|
|1003003 | CustomExtensionInvalidResponseBody | There was a problem parsing the custom extension's response body. Check that the API response body is in an acceptable schema for that custom extension type.|
|1003004 | CustomExtensionThrottlingError | There are too many custom extension requests. This exception is thrown for custom extension API calls when throttling limits are reached.|
|1003005 | CustomExtensionTimedOut | The custom extension didn't respond within the allowed timeout. Check that your API is responding within the configured timeout for the custom extension. It can also indicate that the access token is invalid. Follow the steps to [call your REST API directly](#call-your-rest-api-directly). |
|1003006 | CustomExtensionInvalidResponseContentType | The custom extension's response content-type isn't 'application/json'.|
|1003007 | CustomExtensionNullClaimsResponse | The custom extension API responded with a null claims bag.|
|1003008 | CustomExtensionInvalidResponseApiSchemaVersion | The custom extension API didn't respond with the same apiSchemaVersion that it was called for.|
|1003009 | CustomExtensionEmptyResponse | The custom extension API response body was null when that wasn't expected.|
|1003010 | CustomExtensionInvalidNumberOfActions | The custom extension API response included a different number of actions than those supported for that custom extension type.|
|1003011 | CustomExtensionNotFound | The custom extension associated with an event listener couldn't be found.|
|1003012 | CustomExtensionInvalidActionType | The custom extension returned an invalid action type defined for that custom extension type.|
|1003014 | CustomExtensionIncorrectResourceIdFormat | The _identifierUris_ property in the manifest for the application registration for the custom extension, should be in the format of "api://{fully qualified domain name}/{appid}.|
|1003015 | CustomExtensionDomainNameDoesNotMatch | The targetUrl and resourceId of the custom extension should have the same fully qualified domain name.|
|1003016 | CustomExtensionResourceServicePrincipalNotFound | The appId of the custom extension resourceId should correspond to a real service principal in the tenant.|
|1003017 | CustomExtensionClientServicePrincipalNotFound | The custom extension resource service principal is not found in the tenant.|
|1003018 | CustomExtensionClientServiceDisabled | The custom extension resource service principal is disabled in this tenant.|
|1003019 | CustomExtensionResourceServicePrincipalDisabled | The custom extension resource service principal is disabled in this tenant.|
|1003020 | CustomExtensionIncorrectTargetUrlFormat | The target URL is in an improper format. It's must be a valid URL that start with https.|
|1003021 | CustomExtensionPermissionNotGrantedToServicePrincipal | The service principal doesn't have admin consent for the Microsoft Graph CustomAuthenticationExtensions.Receive.Payload app role (also known as application permission) which is required for the app to receive custom authentication extension HTTP requests.|
|1003022 | CustomExtensionMsGraphServicePrincipalDisabledOrNotFound |The MS Graph service principal is disabled or not found in this tenant.|
|1003023 | CustomExtensionBlocked | The endpoint used for the custom extension is blocked by the service.|
|1003024 | CustomExtensionResponseSizeExceeded | The custom extension response size exceeded the maximum limit.|
|1003025 | CustomExtensionResponseClaimsSizeExceeded | The total size of claims in the custom extension response exceeded the maximum limit.|
|1003026 | CustomExtensionNullOrEmptyClaimKeyNotSupported | The custom extension API responded with claims containing null or empty key'|
|1003027 | CustomExtensionConnectionError | Error connecting to the custom extension API.|

## Call your REST API directly

Your REST API is protected by a Microsoft Entra access token. You can test your API by obtaining an access token with the [application registration](custom-extension-get-started.md#22-grant-admin-consent) associated with the custom authentiction extensions. After you acquire an access token, pass it the HTTP `Authorization` header. To obtain an access token, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Application registrations**.
1. Select the *Azure Functions authentication events API* app registration [you created previously](custom-extension-get-started.md#step-2-register-a-custom-authentication-extension). 
1. Copy the [application ID](custom-extension-get-started.md#22-grant-admin-consent).
1. If you haven't created an app secret, follow these steps:
    1. Select **Certificates & secrets** > **Client secrets** > **New client secret**.
    1. Add a description for your client secret.
    1. Select an expiration for the secret or specify a custom lifetime.
    1. Select **Add**.
    1. Record the **secret's value** for use in your client application code. This secret value is never displayed again after you leave this page.
1. From the menu, select **Expose an API** and copy the value of the **Application ID URI**. For example, `api://contoso.azurewebsites.net/11111111-0000-0000-0000-000000000000`.
1. Open Postman and create a new HTTP query.
1. Change the **HTTP method** to `POST`.
1. Enter the following URL. Replace the `{tenantID}` with your tenant ID.

    ```http
    https://login.microsoftonline.com/{tenantID}/oauth2/v2.0/token
    ```

1. Under the **Body**, select **form-data** and add the following keys:

    |Key  |Value  |
    |---------|---------|
    |`grant_type`| `client_credentials`|
    |`client_id`| The **Client ID** of your application.|
    |`client_secret`|The **Client Secret** of your application.|
    |`scope`| The **Application ID URI** of your application, then add `.default`. For example, `api://contoso.azurewebsites.net/11111111-0000-0000-0000-000000000000/.default`|

1. Run the HTTP query and copy the `access_token` into the <https://jwt.ms> web app.
1. Compare the `iss` with the issuer name you [configured in your API](custom-extension-get-started.md#step-5-protect-your-azure-function).
1. Compare the `aud` with the client ID you [configured in your API](custom-extension-get-started.md#step-5-protect-your-azure-function).

To test your API directly from the Postman, follow these steps:

1. In your REST API, disable the `appid` or `azp` [claim validation](custom-extension-overview.md#protect-your-rest-api). Check out how to [edit the function API](custom-extension-get-started.md#12-edit-the-function) you created earlier.
1. In Postman, create new HTTP request
1. Set the **HTTP method** to `POST`
1. In the **Body**, select **Raw** and then select **JSON**.
1. Pase the following JSON that imitates the request Microsoft Entra ID sends to your REST API.

    ```json
    {
        "type": "microsoft.graph.authenticationEvent.tokenIssuanceStart",
        "source": "/tenants/<Your tenant GUID>/applications/<Your Test Application App Id>",
        "data": {
            "@odata.type": "microsoft.graph.onTokenIssuanceStartCalloutData",
            "tenantId": "<Your tenant GUID>",
            "authenticationEventListenerId": "<GUID>",
            "customAuthenticationExtensionId": "<Your custom authentication extension ID>",
            "authenticationContext": {
                "correlationId": "fcef74ef-29ea-42ca-b150-8f45c8f31ee6",
                "client": {
                    "ip": "127.0.0.1",
                    "locale": "en-us",
                    "market": "en-us"
                },
                "protocol": "OAUTH2.0",
                "clientServicePrincipal": {
                    "id": "<Your Test Applications servicePrincipal objectId>",
                    "appId": "<Your Test Application App Id>",
                    "appDisplayName": "My Test application",
                    "displayName": "My Test application"
                },
                "resourceServicePrincipal": {
                    "id": "<Your Test Applications servicePrincipal objectId>",
                    "appId": "<Your Test Application App Id>",
                    "appDisplayName": "My Test application",
                    "displayName": "My Test application"
                },
                "user": {
                    "createdDateTime": "2016-03-01T15:23:40Z",
                    "displayName": "John Smith",
                    "givenName": "John",
                    "id": "90847c2a-e29d-4d2f-9f54-c5b4d3f26471",
                    "mail": "john@contoso.com",
                    "preferredLanguage": "en-us",
                    "surname": "Smith",
                    "userPrincipalName": "john@contoso.com",
                    "userType": "Member"
                }
            }
        }
    }
    ```

1. Select **Authorization** and then select **Bearer token**.
1. Paste the access token you received from Microsoft Entra ID, and run the query.


## Common performance improvements

One of the most common issues is that your custom claims provider API doesn't respond within the two-seconds timeout. If your REST API doesn't respond in subsequent retries, then the authentication fails. To improve the performance of your REST API, follow the below suggestions:

1. If your API accesses any downstream APIs, cache the access token used to call these APIs, so a new token doesn't have to be acquired on every execution.
1. Performance issues are often related to downstream services. Add logging, which records the process time to call to any downstream services. 
1. If you use a cloud provider to host your API, use a hosting plan that keeps the API always "warm". For Azure Functions, it can be either [the Premium plan or Dedicated plan](/azure/azure-functions/functions-scale).
1. [Run automated integration tests](test-automate-integration-testing.md) for your authentications. You can also use Postman or other tools to test just your API performance.

## Next steps

- Learn how to [create and register a custom claims provider](custom-extension-get-started.md) with a sample OpenID Connect application.
- If you already have a custom claims provider registered, you can configure a [SAML application](custom-extension-configure-saml-app.md) to receive tokens with claims sourced from an external store.
- Learn more about custom claims providers with the [custom claims provider reference](custom-claims-provider-reference.md) article.
