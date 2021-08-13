---
title: How to delegate user registration and product subscription
description: Learn how to delegate user registration and product subscription to a third party in Azure API Management.
services: api-management
documentationcenter: ''
author: vladvino
manager: cfowler
editor: ''

ms.assetid: 8b7ad5ee-a873-4966-a400-7e508bbbe158
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 08/13/2021
ms.author: apimpm

---
# How to delegate user registration and product subscription

Delegation enables your website to own the user data and perform custom validation.With delegation, you can handle developer sign-in/sign-up and product subscription using your existing website, instead of the developer portal's built-in functionality. 

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## <a name="delegate-signin-up"> </a>Delegating developer sign-in and sign-up

To delegate developer sign-in and sign-up to your existing website, create a special delegation endpoint on your site. This special delegation acts as the entry-point for any sign-in/sign-up request initiated from the API Management developer portal.

The final workflow will be:

1. Developer clicks on the sign-in or sign-up link at the API Management developer portal.
2. Browser redirects to the delegation endpoint.
3. Delegation endpoint in return redirects user to or presents user with sign-in/sign-up. 
4. Upon successful sign-in/sign-up, user is redirected back to the starting API Management developer.

### Set up API Management to route requests via delegation endpoint

1. In the Azure portal, search for **Security** in your API Management resource.
2. Click the **Delegation** item. 
3. Click the checkbox to enable **Delegate sign-in & sign-up**.

![Delegation page][api-management-delegation-signin-up]

4. Decide your special delegation endpoint's URL and enter it in the **Delegation endpoint URL** field. 
5. Within the **Delegation authentication** key field, enter a secret used to compute a signature provided for verification that the request originates from API Management. 
   * Click the **Generate** button for API Management to generate a random key for you.

### Create the delegation endpoint

>[!NOTE]
> While the following procedure provide examples of the **SignIn** operation, you can perform account management using any of the available operations with the steps below. 

Your new delegation endpoint must:

1. Receive a request in the following form:
   
   > *http:\//www.yourwebsite.com/apimdelegation?operation=SignIn&returnUrl={URL of source page}&salt={string}&sig={string}*
   
    Query parameters for the sign-in/sign-up case:
   | Parameter | Description |
   | --------- | ----------- |
   | **operation** | Identifies the delegation request type. Available operations: **SignIn**, **ChangePassword**, **ChangeProfile**, **CloseAccount**, and **SignOut**. |
   | **returnUrl** | The URL of where the user clicked on a sign-in or sign-up link. |
   | **salt** | A special salt string used for computing a security hash. |
   | **sig** | A computed security hash used for comparison to your own computed hash. |
   
3. Verify the request comes from Azure API Management (optional, but highly recommended for security).
   
   * Compute an HMAC-SHA512 hash of a string based on the **returnUrl** and **salt** query parameters. For more details, check our [example code].
     
     ```
         hmac(salt + '\n' + returnUrl)
     ```
   * Compare the above-computed hash to the value of the **sig** query parameter. If the two hashes match, move on to the next step. Otherwise, deny the request.
4. Verify you receive a request for sign-in/sign-up.
    * The **operation** query parameter will be set to "**SignIn**".
5. Present the user with sign-in/sign-up UI.
    * If the user signs up, create a corresponding account for them in API Management. 
      * [Create a user] with the API Management REST API. 
      * Set the user ID to either the same value in your user store or a new, easily tracked ID.
6. When the user is successfully authenticated:
   
   * [Request a shared access token] via the API Management REST API.
   * Append a **returnUrl** query parameter to the SSO URL you received from the API call above. For example:
     
     > `https://contoso.developer.azure-api.net/signin-sso?token=<URL-encoded token>&returnUrl=%2Freturn%2Furl` 
     
   * Redirect the user to the above-produced URL.

>[!NOTE]
> For account management operations (**ChangePassword**, **ChangeProfile**, and **CloseAccount**), pass the following query parameters:
>    | Parameter | Description |
>   | --------- | ----------- |
>   | **operation** | Identifies the delegation request type. |
>   | **userId** | The user ID of the account you wish to manage. |
>   | **salt** | A special salt string used for computing a security hash. |
>   | **sig** | A computed security hash used for comparison to your own computed hash. |

## <a name="delegate-product-subscription"> </a>Delegating product subscription

Delegating product subscriptions works similarly to delegating user sign-in/sign-up. The final workflow would be as follows:

1. Developer selects a product in the API Management developer portal and clicks on the **Subscribe** button.
2. Browser redirects to the delegation endpoint.
3. Delegation endpoint performs required product subscription steps, which you design. They may include: 
   * Redirecting to another page to request billing information.
   * Asking additional questions.
   * Storing the information and not requiring any user action.

### Enable the API Management functionality

1. On the **Delegation** page, click **Delegate product subscription**.

### Create the delegation endpoint

Your new delegation endpoint must:

1. Receive a request in the following form.
   
   > *http:\//www.yourwebsite.com/apimdelegation?operation={operation}&productId={product to subscribe to}&userId={user making request}&salt={string}&sig={string}*
   >
   
    Query parameters for the product subscription case:
   | Parameter | Description |
   | --------- | ----------- |
   | **operation** | Identifies the delegation request type. Valid product subscription requests options are: <ul><li>**Subscribe**: a request to subscribe the user to a given product with provided ID (see below).</li><li>**Unsubscribe**: a request to unsubscribe a user from a product.</li><li>**Renew**: a request to renew a subscription (for example, that may be expiring)</li></ul> |
   | **productId** | On *Subscribe*, the product ID that the user requested subscription. |
   | **subscriptionId** | On *Unsubscribe* and *Renew*, the product subscription. |
   | **userId** | On *Subscribe*, the requesting user's ID. |
   | **salt** | A special salt string used for computing a security hash. |
   | **sig** | A computed security hash used for comparison to your own computed hash. |

2. Verify that the request is coming from Azure API Management (optional, but highly recommended for security)
   
   * Compute an HMAC-SHA512 of a string based on the **productId**, **userId**, and **salt** query parameters:
     ```
     HMAC(**salt** + '\n' + **productId** + '\n' + **userId**)
     ```
   * Compare the above-computed hash to the value of the **sig** query parameter. If the two hashes match, move on to the next step. Otherwise, deny the request.
3. Process the product subscription based on the operation type requested in **operation** (for example: billing, further questions, etc.).
4. Upon successful user subscription to the product on your side, subscribe the user to the API Management product by [calling the REST API for subscriptions].

## <a name="delegate-example-code"> </a> Example Code

These code samples show how to:

* Take the *delegation validation key*, which is set in the **Delegation** screen of the publisher portal.
* Create an HMAC, which validates the signature, proving the validity of the passed returnUrl.

With slight modification, you can use the same code for the **productId** and **userId**.

### C# code to generate hash of returnUrl

```csharp
using System.Security.Cryptography;

string key = "delegation validation key";
string returnUrl = "returnUrl query parameter";
string salt = "salt query parameter";
string signature;
using (var encoder = new HMACSHA512(Convert.FromBase64String(key)))
{
    signature = Convert.ToBase64String(encoder.ComputeHash(Encoding.UTF8.GetBytes(salt + "\n" + returnUrl)));
    // change to (salt + "\n" + productId + "\n" + userId) when delegating product subscription
    // compare signature to sig query parameter
}
```

### NodeJS code to generate hash of returnUrl

```
var crypto = require('crypto');

var key = 'delegation validation key'; 
var returnUrl = 'returnUrl query parameter';
var salt = 'salt query parameter';

var hmac = crypto.createHmac('sha512', new Buffer(key, 'base64'));
var digest = hmac.update(salt + '\n' + returnUrl).digest();
// change to (salt + "\n" + productId + "\n" + userId) when delegating product subscription
// compare signature to sig query parameter

var signature = digest.toString('base64');
```

> [!IMPORTANT]
> You need to [republish the developer portal](api-management-howto-developer-portal-customize.md#publish) for the delegation changes to take effect.

## Next steps
For more information on delegation, see the following video:

> [!VIDEO https://channel9.msdn.com/Blogs/AzureApiMgmt/Delegating-User-Authentication-and-Product-Subscription-to-a-3rd-Party-Site/player]
> 
> 

[Delegating developer sign-in and sign-up]: #delegate-signin-up
[Delegating product subscription]: #delegate-product-subscription
[Request a shared access token]: /rest/api/apimanagement/2020-12-01/user/get-shared-access-token
[create a user]: /rest/api/apimanagement/2020-12-01/user/create-or-update
[calling the REST API for subscriptions]: /rest/api/apimanagement/2020-12-01/subscription/create-or-update
[Next steps]: #next-steps
[example code]: #delegate-example-code

[api-management-delegation-signin-up]: ./media/api-management-howto-setup-delegation/api-management-delegation-signin-up.png
