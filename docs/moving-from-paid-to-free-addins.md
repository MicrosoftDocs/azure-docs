---
title: Moving from paid to free add-ins
description: "The licensing framework for Office and SharePoint Add-ins is in the process of being retired."
ms.date: 06/26/2019
localization_priority: Priority
---

# Moving from paid to free add-ins

The licensing framework for Office and SharePoint Add-ins is in the process of being retired. For more information about the licensing framework, see [License your add-ins](license-your-add-ins.md).

Starting July 29th 2019, we will no longer accept new paid add-ins to AppSource. Existing paid add-ins in AppSource (that do not move to an alternate SaaS/billing model) will be purchasable until January 2020. They will then be hidden from AppSource, but still be available for existing users. If these add-ins have not been migrated by July 2020, they will be removed both for existing users and removed from AppSource. You will be able to change paid add-ins pricing models – including transitioning them to free add-ins - via Seller Dashboard until July 2020.

After the move from paid to free, the add-in will still be sent licensing tokens containing the information about the user’s license, and those tokens will still need to be parsed. 

The user experience can depend on whether the license is for a new or existing user and whether the payment option was previously a subscription or one-time purchase.

For details about how to monetize add-ins going forward, see [Monetize your add-in through Microsoft Commercial Marketplace](monetize-addins-through-microsoft-commercial-marketplace.md).
## Add-in user experience

The following table describes the add-in user experience for different purchase types, and the action that you can take to transition from paid to free add-ins.

|Purchase type |New user |Existing user |Action to take|
|:------------ |:------- |:------------ |:-------------|
|Subscription  |The user will receive a free entitlement. The add-in will no longer be available to purchase but can be acquired for free. This will be returned in the token for the add-in entitlement.|The user will no longer be charged after their billed month ends. At the end of the period they have paid for, the subscription license will be extended indefinitely.<br/><br/>If the license was previously seat-based (applies to Outlook and SharePoint add-ins only), it will be modified to resemble a site license for the user. This will be returned in the token to the add-in.<br/><br/>All active trial licenses will be converted to free entitlements.	|Where a token in a free or extended subscription state is returned, you can take the opportunity to upsell the user to the new license. Some information to inform upsell decisions is maintained in the token.<br/><br/>**Token changes**<br/>The license tokens will change when an add-in moves from paid to free, as follows:<ul><li>Update to all migrated tokens:<br/>`ed="8999-12-31T23:59:59Z"`</li><li>Update to all seat-based tokens:<br/>`sl="true"`</li><li>For seat-based tokens, where the customer previously purchased a site-license:<br/>`ts="0"`</li><li>For seat-based tokens, where the customer purchased 3 seats:<br/>`ts="3"`</li></ul>|
|One-time purchase	|The user will receive a free entitlement. The add-in will no longer be available to purchase but can be acquired for free. This will be returned in the token for the add-in entitlement. |The user’s original purchase will still be valid. If the license was previously seat based (applies to Outlook and SharePoint add-ins only), it will be modified to resemble a site license for the user. This will be returned in the token to the add-in.<br/><br/>All active trial licenses will be converted to Free entitlements.	|For existing users that return a valid paid token, those users should continue to work. If the original token was seat-based (applies to Outlook and SharePoint add-ins only), the new token will contain the originally purchased seat count.<br/><br/>For new users, or users where the original seat count has been exceeded, you can take the opportunity to upsell the user to the new license.<br/><br/>**Token changes**<br/>For most users, the license token returned to the add-in will not change. The license tokens will change when an add-in moves from paid to free for seat-based tokens:<ul><li>Update to all seat-based tokens:<br/>`sl="true"`</li><li>For seat-based tokens, where the customer previously purchased a site-license:<br/>`ts="0"`</li><li>For seat-based tokens, where the customer purchased 3 seats:<br/>`ts="3"`</li></ul> |

For the license token schema, see [Office and SharePoint Add-in license XML schema structure](add-in-license-schema.md).

For more information about using licensing to upsell your add-in services, see [Implement licensing to upsell your Office Add-in services](implement-licensing-for-add-in-services.md).

## Examples

Following are a few examples of the experience after an add-in switches from paid to free:

- **Word user, purchased add-in via one-time purchase**

   Because this user had purchased the add-in prior to the switch to free, the license token will still return an active paid entitlement for that user in the “et” parameter. 

- **Word user, acquires free version of same add-in**

   Because this user had not acquired the add-in when it was paid, the license token will return a free entitlement for that user in the “et” parameter.

- **Outlook user, purchases add-in via subscription**

   In this case, the user will continue to use the subscription they paid for until the end of that billing period. The expiry date for the subscription will extend and they will no longer be charged for the add-in going forward. 

- **Outlook user, acquires free version of same subscription add-in**

   The user had not acquired the add-in when it was paid, so the license token will return a free entitlement for that user in the “et” parameter.

- **SharePoint user, purchased seat-based license for 3 seats via one-time purchase**

   In this case, the token will effectively come back as a site license but will also include the number of seats that had been purchased. 

- **SharePoint user, purchased seat-based license for 3 seats via subscription**

   In this case, the token will come back with an expiration date that will be extended indefinitely, and it will come back as a site license but will also include the number of seats that were acquired previously. 

- **Excel user, acquired add-in as a trial**

   Because this add-in was acquired prior to the trial expiration date, the trial will now return a free entitlement.

   > **Note:** This applies for subscription or one-time purchase add-ins.
