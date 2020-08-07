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
ms.date: 04/04/2019
ms.author: apimpm

---
# How to delegate user registration and product subscription

Delegation allows you to use your existing website for handling developer sign in/sign up and subscription to products, as opposed to using the built-in functionality in the developer portal. It enables your website to own the user data and perform the validation of these steps in a custom way.

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## <a name="delegate-signin-up"> </a>Delegating developer sign-in and sign-up

To delegate developer, sign in and sign up to your existing website, you'll need to create a special delegation endpoint on your site. It needs to act as the entry-point for any such request initiated from the API Management developer portal.

The final workflow will be as follows:

1. Developer clicks on the sign in or sign up link at the API Management developer portal
2. Browser is redirected to the delegation endpoint
3. Delegation endpoint in return redirects to or presents UI asking user to sign in or sign up
4. On success, the user is redirected back to the API Management developer portal page they started from

To begin, let's first set-up API Management to route requests via your delegation endpoint. In the Azure portal, search for **Security** in your API Management resource and then click the **Delegation** item. Click the checkbox to enable 'Delegate sign in & sign up'.

![Delegation page][api-management-delegation-signin-up]

* Decide what the URL of your special delegation endpoint will be and enter it in the **Delegation endpoint URL** field. 
* Within the Delegation authentication key field, enter a secret that will be used to compute a signature provided to you for verification to ensure that the request is indeed coming from Azure API Management. You can click the **generate** button to have API Management randomly generate a key for you.

Now you need to create the **delegation endpoint**. It has to perform a number of actions:

1. Receive a request in the following form:
   
   > *http:\//www.yourwebsite.com/apimdelegation?operation=SignIn&returnUrl={URL of source page}&salt={string}&sig={string}*
   > 
   > 
   
    Query parameters for the sign in / sign up case:
   
   * **operation**: identifies what type of delegation request it is - it can only be **SignIn** in this case
   * **returnUrl**: the URL of the page where the user clicked on a sign in or sign up link
   * **salt**: a special salt string used for computing a security hash
   * **sig**: a computed security hash to be used for comparison to your own computed hash
2. Verify that the request is coming from Azure API Management (optional, but highly recommended for security)
   
   * Compute an HMAC-SHA512 hash of a string based on the **returnUrl** and **salt** query parameters ([example code provided below]):
     
     > HMAC(**salt** + '\n' + **returnUrl**)
     > 
     > 
   * Compare the above-computed hash to the value of the **sig** query parameter. If the two hashes match, move on to the next step, otherwise deny the request.
3. Verify that you are receiving a request for sign in/sign up: the **operation** query parameter will be set to "**SignIn**".
4. Present the user with UI to sign in or sign up
5. If the user is signing-up you have to create a corresponding account for them in API Management. [Create a user] with the API Management REST API. When doing so, ensure that you set the user ID to the same value as in your user store or to an ID that you can keep track of.
6. When the user is successfully authenticated:
   
   * [request a single-sign-on (SSO) token] via the API Management REST API
   * append a returnUrl query parameter to the SSO URL you have received from the API call above:
     
     > for example, `https://customer.portal.azure-api.net/signin-sso?token&returnUrl=/return/url` 
     > 
     > 
   * redirect the user to the above produced URL

In addition to the **SignIn** operation, you can also perform account management by following the previous steps and using one of the following operations:

* **ChangePassword**
* **ChangeProfile**
* **CloseAccount**

You must pass the following query parameters for account management operations.

* **operation**: identifies what type of delegation request it is (ChangePassword, ChangeProfile, or CloseAccount)
* **userId**: the user ID of the account to manage
* **salt**: a special salt string used for computing a security hash
* **sig**: a computed security hash to be used for comparison to your own computed hash

## <a name="delegate-product-subscription"> </a>Delegating product subscription
Delegating product subscription works similarly to delegating user sign in/-up. The final workflow would be as follows:

1. Developer selects a product in the API Management developer portal and clicks on the Subscribe button.
2. Browser is redirected to the delegation endpoint.
3. Delegation endpoint performs required product subscription steps. It's up to you to design the steps. They may include redirecting to another page to request billing information, asking additional questions, or simply storing the information and not requiring any user action.

To enable the functionality, on the **Delegation** page click **Delegate product subscription**.

Next, ensure the delegation endpoint does the following actions:

1. Receive a request in the following form:
   
   > *http:\//www.yourwebsite.com/apimdelegation?operation={operation}&productId={product to subscribe to}&userId={user making request}&salt={string}&sig={string}*
   >
   
    Query parameters for the product subscription case:
   
   * **operation**: identifies what type of delegation request it is. For product subscription requests the valid options are:
     * "Subscribe": a request to subscribe the user to a given product with provided ID (see below)
     * "Unsubscribe": a request to unsubscribe a user from a product
     * "Renew": a request to renew a subscription (for example, that may be expiring)
   * **productId**: the ID of the product the user requested to subscribe to
   * **subscriptionId**: on *Unsubscribe* and *Renew* - the ID of the product subscription
   * **userId**: the ID of the user the request is made for
   * **salt**: a special salt string used for computing a security hash
   * **sig**: a computed security hash to be used for comparison to your own computed hash

2. Verify that the request is coming from Azure API Management (optional, but highly recommended for security)
   
   * Compute an HMAC-SHA512 of a string based on the **productId**, **userId**, and **salt** query parameters:
     
     > HMAC(**salt** + '\n' + **productId** + '\n' + **userId**)
     > 
     > 
   * Compare the above-computed hash to the value of the **sig** query parameter. If the two hashes match, move on to the next step, otherwise deny the request.
3. Process product subscription based on the type of operation requested in **operation** - for example, billing, further questions, etc.
4. On successfully subscribing the user to the product on your side, subscribe the user to the API Management product by [calling the REST API for subscriptions].

## <a name="delegate-example-code"> </a> Example Code

These code samples show how to:

* Take the *delegation validation key*, which is set in the Delegation screen of the publisher portal
* Create an HMAC, which is then used to validate the signature, proving the validity of the passed returnUrl.

The same code works for the productId and userId with slight modification.

**C# code to generate hash of returnUrl**

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

**NodeJS code to generate hash of returnUrl**

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

[Delegating developer sign in and sign up]: #delegate-signin-up
[Delegating product subscription]: #delegate-product-subscription
[request a single-sign-on (SSO) token]: https://docs.microsoft.com/rest/api/apimanagement/2019-12-01/User/GenerateSsoUrl
[create a user]: https://docs.microsoft.com/rest/api/apimanagement/2019-12-01/user/createorupdate
[calling the REST API for subscriptions]: https://docs.microsoft.com/rest/api/apimanagement/2019-12-01/subscription/createorupdate
[Next steps]: #next-steps
[example code provided below]: #delegate-example-code

[api-management-delegation-signin-up]: ./media/api-management-howto-setup-delegation/api-management-delegation-signin-up.png 
