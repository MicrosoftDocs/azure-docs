---
title: How to delegate user registration and product subscription
description: Learn how to delegate user registration and product subscription to a third party in Azure API Management.
author: dlepow
services: api-management

ms.service: api-management
ms.topic: article
ms.date: 08/07/2023
ms.author: danlep
---

# How to delegate user registration and product subscription

Delegation enables your website to own the user data and perform custom validation. With delegation, you can handle developer sign-in/sign-up (and related account management operations) and product subscription using your existing website, instead of the developer portal's built-in functionality. 

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Delegating developer sign-in and sign-up

To delegate developer sign-in and sign-up and developer account management options to your existing website, create a special delegation endpoint on your site. This special delegation acts as the entry-point for any sign-in/sign-up and related requests initiated from the API Management developer portal.

The final workflow will be:

1. Developer clicks on the sign-in or sign-up link or an account management link at the API Management developer portal.
1. Browser redirects to the delegation endpoint.
1. Delegation endpoint in return redirects user to or presents user with sign-in/sign-up or account management UI. 
1. After the operation completes, user is redirected back to the API Management developer portal at the location they left.

### Set up API Management to route requests via delegation endpoint

1. In the Azure portal, search for **Developer portal** in your API Management resource.
1. Click the **Delegation** item. 
1. Click the checkbox to enable **Delegate sign-in & sign-up**.

    :::image type="content" source="media/api-management-howto-setup-delegation/api-management-delegation-signin-up.png" alt-text="Screenshot showing delegation of sign-in and sign-up in the portal.":::

1. Decide your special delegation endpoint's URL and enter it in the **Delegation endpoint URL** field. 
1. Within the **Delegation Validation Key** field, either:
    * Enter a secret used to compute a signature provided for verification that the request originates from API Management. 
    * Click the **Generate** button for API Management to generate a random key for you.
1. Click **Save**.

### Create your delegation endpoint 

Recommended steps for creating a new delegation endpoint to implement on your site:

1. Receive a request in the following form, depending on the operation:
   
   > *http:\//www.yourwebsite.com/apimdelegation?operation={operation}&returnUrl={URL of source page}&salt={string}&sig={string}*
   >

   -Or-

   > *http:\//www.yourwebsite.com/apimdelegation?operation={operation}&userId={user ID of account}&salt={string}&sig={string}*
   >

    Query parameters:

   | Parameter | Description |
   | --------- | ----------- |
   | **operation** | Identifies the delegation request type. Available operations: **SignIn**, **SignUp**, **ChangePassword**, **ChangeProfile**, **CloseAccount**, **SignOut**. |
   | **returnUrl** | On *SignIn* or *SignUp*, the URL of where the user clicked on a sign-in or sign-up link. |
   | **userId** | On *ChangePassword*, *ChangeProfile*, *CloseAccount*, and *SignOut*, the user ID of the account you wish to manage. |
   | **salt** | A special salt string used for computing a security hash. |
   | **sig** | A computed security hash used for comparison to your own computed hash. |
   
1. Verify the request comes from Azure API Management (optional, but highly recommended for security).
   
    * Compute an HMAC-SHA512 hash of a string based on the **returnUrl** (or **UserId**) and **salt** query parameters. For examples, check our [example code].
     
      For *SignIn* and *SignUp*:
    
         ```
         HMAC(salt + '\n' + returnUrl)
         ```

      For *ChangePassword*, *ChangeProfile*, *CloseAccount*, and *SignOut*:
    
         ```
         HMAC(salt + '\n' + userId)
         ```
   * Compare the above-computed hash to the value of the **sig** query parameter. If the two hashes match, move on to the next step. Otherwise, deny the request.
1. Verify you receive a request for a sign-in/sign-up or account management operation.
1. Present the user with sign-in/sign-up or account management UI.
1. After completing the operation on your side, manage the user in API Management. For example, if the user signs up, create a corresponding account for them in API Management. 
      * [Create a user] with the API Management REST API. 
      * Set the user ID to either the same value in your user store or a new, easily tracked ID.
1. After sign-in or sign-up, when the user is successfully authenticated:
   
   * [Request a shared access token] via the API Management REST API.
   * Append a **returnUrl** query parameter to the SSO URL you received from the API call above. For example:
     
     > `https://contoso.developer.azure-api.net/signin-sso?token=<URL-encoded token>&returnUrl=%2Freturn%2Furl` 
     
   * Redirect the user to the above-produced URL.

## Delegating product subscription

Delegating product subscriptions works similarly to delegating user sign-in/sign-up. The final workflow would be as follows:

1. Developer selects a product in the API Management developer portal and clicks on the **Subscribe** button.
1. Browser redirects to the delegation endpoint.
1. Delegation endpoint performs required product subscription steps, which you design. They may include: 
   * Redirecting to another page to request billing information.
   * Asking additional questions.
   * Storing the information and not requiring any user action.

### Enable the API Management functionality

On the **Delegation** page, click **Delegate product subscription**.

### Create your delegation endpoint

Recommended steps for creating a new delegation endpoint to implement on your site:

1. Receive a request in the following form, depending on the operation.
   
   > *http:\//www.yourwebsite.com/apimdelegation?operation={operation}&productId={product to subscribe to}&userId={user making request}&salt={string}&sig={string}*
   >
   
   -Or-

   > *http:\//www.yourwebsite.com/apimdelegation?operation={operation}&subscriptionId={subscription to manage}&salt={string}&sig={string}*
   > 
    Query parameters:

   | Parameter | Description |
   | --------- | ----------- |
   | **operation** | Identifies the delegation request type. Valid product subscription requests options are: <ul><li>**Subscribe**: a request to subscribe the user to a given product with provided ID (see below).</li><li>**Unsubscribe**: a request to unsubscribe a user from a product</li></ul> |
   | **productId** | On *Subscribe*, the product ID that the user requested subscription. |
   | **userId** | On *Subscribe*, the requesting user's ID. |
   | **subscriptionId** | On *Unsubscribe*, the product subscription ID. |
   | **salt** | A special salt string used for computing a security hash. |
   | **sig** | A computed security hash used for comparison to your own computed hash. |

1. Verify that the request is coming from Azure API Management (optional, but highly recommended for security)
   
   * Compute an HMAC-SHA512 of a string based on the **productId** and **userId** (or **subscriptionId**) and **salt** query parameters:
   
     For *Subscribe*: 
     ```
     HMAC(salt + '\n' + productId + '\n' + userId)
     ```

     For *Unsubscribe*: 
     ```
     HMAC(salt + '\n' + subscriptionId)
     ```

   * Compare the above-computed hash to the value of the **sig** query parameter. If the two hashes match, move on to the next step. Otherwise, deny the request.
1. Process the product subscription based on the operation type requested in **operation** (for example: billing, further questions, etc.).
1. After completing the operation on your side, manage the subscription in API Management. For example, subscribe the user to the API Management product by [calling the REST API for subscriptions].

## Example code

These code samples show how to generate the hash of the `returnUrl` query parameter when delegating user sign-in or sign-up. The `returnUrl` is the URL of the page where the user clicked on the sign-in or sign-up link.

* Take the *delegation validation key*, which is set in the **Delegation** screen of the Azure portal.
* Create an HMAC, which validates the signature, proving the validity of the passed returnUrl.

With slight modification, you can use the same code to calculate other hashes, such as with `productId` and `userId` when delegating product subscription.

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
> You need to [republish the developer portal](developer-portal-overview.md#publish-the-portal) for the delegation changes to take effect.

## Next steps
- [Learn more about the developer portal.](api-management-howto-developer-portal.md)
- [Authenticate using Microsoft Entra ID](api-management-howto-aad.md) or with [Azure AD B2C](api-management-howto-aad-b2c.md).
- More developer portal questions? [Find answers in our FAQ](developer-portal-faq.md).

[Delegating developer sign-in and sign-up]: #delegate-signin-up
[Delegating product subscription]: #delegate-product-subscription
[Request a shared access token]: /rest/api/apimanagement/current-ga/user/get-shared-access-token
[create a user]: /rest/api/apimanagement/current-ga/user/create-or-update
[calling the REST API for subscriptions]: /rest/api/apimanagement/current-ga/subscription/create-or-update
[Next steps]: #next-steps
[example code]: #example-code

[api-management-delegation-signin-up]: ./media/api-management-howto-setup-delegation/api-management-delegation-signin-up.png
