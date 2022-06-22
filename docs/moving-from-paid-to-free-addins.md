---
title: Moving from paid to free apps
description: The licensing framework for Office and SharePoint Add-ins is in the process of being retired.
ms.author: siraghav
ms.date: 06/26/2019
ms.localizationpriority: high
---

# Moving from paid to free apps

Starting July 29th, 2019, we no longer accept new paid apps to Microsoft AppSource and by February 28, 2020, all paid apps in AppSource will be hidden and no longer be available to new customers. Your paid apps will remain available to existing subscribers until June 30th, 2020 when we will cancel all paid app subscription. Before then, we’re offering code samples and technical guidance to help you convert your paid apps to paid SaaS offers and continue selling on AppSource.

If you're interested in engaging with Microsoft for guidance on moving paid apps to paid SaaS offers, please [contact us](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR1QsbGOr2ktItoKI5VaSnf5UMDYxVVVKQU42SlY4VElaQUdHQ0lVVU9NRS4u). 

For details about how to monetize apps going forward, see [Monetize your app through Microsoft Commercial Marketplace](monetize-addins-through-microsoft-commercial-marketplace.md).

## App user experience

The following table describes the app user experience for different purchase types, and the action that you can take to transition from paid to free apps.

|Purchase type |New user |Existing user |Action to take|
|:------------ |:------- |:------------ |:-------------|
|Subscription  |The user will receive a free entitlement. The app will no longer be available to purchase but can be acquired for free. This will be returned in the token for the app entitlement.|The user will no longer be charged after their billed month ends. At the end of the period they have paid for, the subscription license will be extended indefinitely.<br/><br/>If the license was previously seat-based (applies to Outlook and SharePoint add-ins only), it will be modified to resemble a site license for the user. This will be returned in the token to the app.<br/><br/>All active trial licenses will be converted to free entitlements.	|Where a token in a free or extended subscription state is returned, you can take the opportunity to upsell the user to the new license. Some information to inform upsell decisions is maintained in the token.<br/><br/>**Token changes**<br/>The license tokens will change when an app moves from paid to free, as follows:<ul><li>Update to all migrated tokens:<br/>`ed="8999-12-31T23:59:59Z"`</li><li>Update to all seat-based tokens:<br/>`sl="true"`</li><li>For seat-based tokens, where the customer previously purchased a site-license:<br/>`ts="0"`</li><li>For seat-based tokens, where the customer purchased 3 seats:<br/>`ts="3"`</li></ul>|
|One-time purchase	|The user will receive a free entitlement. The app will no longer be available to purchase but can be acquired for free. This will be returned in the token for the app entitlement. |The user’s original purchase will still be valid. If the license was previously seat based (applies to Outlook and SharePoint add-ins only), it will be modified to resemble a site license for the user. This will be returned in the token to the add-in.<br/><br/>All active trial licenses will be converted to Free entitlements.	|For existing users that return a valid paid token, those users should continue to work. If the original token was seat-based (applies to Outlook and SharePoint add-ins only), the new token will contain the originally purchased seat count.<br/><br/>For new users, or users where the original seat count has been exceeded, you can take the opportunity to upsell the user to the new license.<br/><br/>**Token changes**<br/>For most users, the license token returned to the app will not change. The license tokens will change when an app moves from paid to free for seat-based tokens:<ul><li>Update to all seat-based tokens:<br/>`sl="true"`</li><li>For seat-based tokens, where the customer previously purchased a site-license:<br/>`ts="0"`</li><li>For seat-based tokens, where the customer purchased 3 seats:<br/>`ts="3"`</li></ul> |

## Examples

Following are a few examples of the experience after an app switches from paid to free:

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
