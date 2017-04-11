# Implement licensing to upsell your Office Add-in services
<!-- updated title; verify that this matches the intent. -->
If you're building an Office Add-in that is backed by a subscription service, your add-in can expose different functionality or messaging depending on whether the customer paid for that service. This article describes how to deliver licensing and upsell your services. For example, when you sell your service to one department in an organization, you might want to sell to the other departments in that organization as well.

This article also explains how to handle licensing state for individuals and organizations, based on how the add-in is acquired - for example, whether it was acquired from the Office Store or assigned via centralized deployment, and whether an individual made the purchase or whether a Microsoft Partner resells the service.  

Implementing licensing involves nine basic steps.

## Step 1: Use a single manifest for all customers

To make distributing and maintaining your add-in easy, we recommend that you submit a single add-in to the Office Store. That way, as you add new feature, like [add-in commands](https://dev.office.com/docs/add-ins/design/add-in-commands) or single sign-on, those features are made available to all customers. You don't need to worry about supporting different add-ins for different customers. You also don't need to contact each customer’s administrator if you need to change the manifest.

>**Note:** Because some customization scenarios are not yet supported, you might have to provide a customer a custom manifest - for example, if you want to use a different icon on the ribbon or a different group name for add-in commands.  

### Step 2: Create your own licensing database

To sell Office Add-ins to organizations, you will need to create your own licensing database. This is necessary because:

- Many software vendors sell the add-in (and the subscription service that backs it) through their own licensing system, via their own invoices/payment models and at price points of their own choosing.
- Centralized deployment does not offer the ability for users to buy add-ins from the Office Store and deploy them. This is because Office Store paid add-ins today only work with personal identities (Microsoft accounts), not work or school accounts.

As such, you must build a licensing database (or use your existing licensing database). This might record:

- The organizational tenant ID that uniquely identifies the customer.
- The organization name.
- The count of licenses you have sold to that customer (this can be an unlimited site license).
- A list of the usernames/user IDs of all users who have a license assigned.
- Whether the license for each user is trial, paid basic, or paid premium.
- Whether users belonging to this organization should be blocked (for example, if they keep using the service but do not purchase it).
- Links to your internal sales system, which you can use to map a given organization’s license(s) to your own records of that sale.

This database should be able to expose an API to your add-in that might be similar to the following the API. 

'www.contoso-addin.com/VerifyLicense.aspx? Username=xxx; autoProvision=1'
    Return enum:

        - Organization has paid license, and User has paid license
        - Organization has paid license, and User has trial license
        - Organization has paid license, and User has no license
        - Organization has no license, and User has trial license
        - Organization has no license, and User has no license

This API will be called when the add-in runs on a customer’s premises. It must be publicly accessible.

In general, we recommend that you let anyone try your add-in, at least for a certain period of time. Plan to follow up with customers who use more licenses than they have paid for.

The business logic for choosing whether or not a user is given a valid license is up to your discretion. The following are some possible approaches.

### Always give licenses

You might decide you want to let anyone from any organization try your add-in. Then if you see high-volume usage of your add-in, your sales team can approach customers to sell them a license. 

You can include an internal mechanism to block customers who continue to use the add-in without making a purchase.

### Discretion when exceeding license limits

If an organization buys 200 licenses, consider what happens when 201, 210, or 300 users try to use the add-in. Generally, we recommend that you apply some discretion to preserve a seamless customer experience, because group sizes organically change as people join and leave teams or organizations. If the service your add-in uses is expensive to run, however, you might decide to be strict about licensing limits.

### Enforcement based on first come, first served

You might want to let the first assigned users receive a license, but refuse licenses to any more users after the maximum number of licenses has been reached.

### Enforcement based on concurrent usage

You might want to only count users who have used the add-in in the last 30 days. For example, you might allow up to 200 users to have a license. If user 201 tries to use the add-in that month, they will be refused.

## Step 3: Modify your add-in to authenticate the user with OpenID authentication, and use single sign-on

To provide an intelligent experience that can upsell depending on who is using the add-in, the add-in needs to learn who the current user is.

<!-- Link to article? -->
When you use OpenID authentication in your add-in, users can sign in using a personal identity (a Microsoft account) or a work or school account.  

Also, when you use single sign-on, users are signed in to the add-in automatically with the same identity they use to sign in to Office. (Office 2013 or Office 2016 users still need to sign in manually.)

<!-- Are you referring to using OpenID and SSO? Are they technically requirements? 
>**Note:** OpenID authentication and SSO are requirements for the CSP program (hyperlink to program).
-->
## Step 4: Modify your add-in to look up licensing state

Your add-in must next identify the following information about the user:

1.	For users signed in with an organisational identity:
a.	Identify their Organizational Tenant ID.  (open: how?)
b.	Identify whether the current signed in user is a tenant administrator (open: how?)
2.	Pass this information to your licensing API.

## Step 5: Determine organization branding

You can support the re-branding of your add-in for a particular customer.  To achieve this, when your add-in service activates, it needs to be told the ID of the current user’s organisation.

This may be achieved in one of two ways:
1)	You may use the Organisational Tenant ID (from above) to retrieve that particular organisation’s logo/name that is to be used on the splash screen.  Since this information may be confidential, it is recommended you save it in X (link to how Martin did it).
2)	The add-in manifest may already be organisation-specific.  You may use a common back-end service for all organisations, but the activation URL may include that organisation’s name (or ID) as a URL parameter or path.

You may fall back to generic branding if the organisation does not have/need specific branding.

## Step 6: Modify the add-in experience based on licensing state

Your add-in’s business logic needs to decide what experience to give the user.

Some examples include:
•	For users signed in with an organisational identity:
o	If the user’s license is Valid, they should get a branded, paid experience.
o	If the user’s license is Trial and their organisation has purchased, they may see a notification to contact their IT department to ask about getting a license while they use the add-in
o	If the user’s license is Trial but their organisation has not purchased, they may see prompts to learn more about the benefits of buying while they use the add-in
o	If the user has no valid license, they may see a basic screen that encourages them to ask their IT department to purchase, but they may be blocked from using the add-in.
•	For users signed in with a personal identity:
o	Any users without paid licenses may see personal requests to buy it.

Remember that many employees in organisations do not know how to contact their administrator, so provide graceful or informative experiences where possible.

## Step 7: Win the customer 

You should include in-app telemetry to know whether the customer is being successful with your add-in.  This will let you know when which customers to contact and when, which will improve your chance of making a sale.  The best practice is to let customers try the add-in, while following up in-app, by email (link to AppSource), and in person.  

Best practices are contained in our go-to-market guide (link).

You will learn as you approach customers how to engage with them in a way that is well received and wins the sale.  As said above, it is at your discretion how strict you are when customers go over their license allocation.

## Step 8: Record the sale

When you have won the sale for a given customer, you should update the licensing database with the record for that customer.  

You should look up the customer in your licensing database by name or email, and record how many licenses were sold, etc.

## Step 9: Deploy the add-in

After the sale is complete, the add-in needs to be deployed in the customer’s environment.  This may be done by the customer’s Tenant Administrator themselves, by you on their behalf, or by a Reseller.

The administrator must navigate to Centralised Deployment (link?).  Ideally, your add-in is in the Office Store and the admin may pick it.  In cases where you needed to build a custom manifest, that manifest must be manually uploaded.

The administrator should then create a flat group (or DL) containing the target users of that add-in.  Nested groups are not supported.  The administrator should then assign the add-in to that group.

At this point, everyone in the organisation belonging to that group will see it in their ribbon.    (Link to Admin Center telemetry dashboard)

Crucially, as group membership grows (or as users from that same organisation install the add-in from the Store), your licensing service can do the ‘right’ thing and your add-in can behave as desired.
