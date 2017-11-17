# Implement licensing to upsell your Office Add-in services

If you're building an Office Add-in that is backed by a subscription service, your add-in can expose different functionality or messaging depending on whether the customer paid for that service. This article describes how to deliver licensing and upsell your services. It also explains how to handle licensing state for individuals and organizations, based on how the add-in is acquired.  


## Step 1: Use a single manifest for all customers

To make distributing and maintaining your add-in easy, we recommend that you submit a single add-in to the Office Store. That way, as you add new features, like [add-in commands](https://dev.office.com/docs/add-ins/design/add-in-commands) or single sign-on, those features are made available to all customers - you don't need to worry about supporting different add-ins for different customers, and you don't need to contact each customer’s administrator when to change the manifest.

> [!NOTE]
> Because some customization scenarios are not yet supported, you might have to provide a customer a custom manifest - for example, if you want to use a different icon on the ribbon or a different group name for add-in commands.  

### Step 2: Create a licensing database

To sell Office Add-ins to organizations, you will need to create a licensing database. This is necessary because:

- Many software vendors sell the add-in (and the subscription service that backs it) through their own licensing system, via their own invoices/payment models and at the price points they choose.
- Centralized deployment does not allow users to buy add-ins from the Office Store and deploy them. Office Store paid add-ins today only work with personal identities (Microsoft accounts), not work or school accounts.

As such, you must build a licensing database (or use your existing licensing database). This might record:

- The organizational tenant ID that uniquely identifies the customer.
- The organization name.
- The count of licenses you have sold to that customer (this can be an unlimited site license).
- A list of the usernames/user IDs of all users who have a license assigned.
- Whether the license for each user is trial, paid basic, or paid premium.
- Whether users belonging to this organization should be blocked (for example, if they keep using the service but do not purchase it).
- Links to your internal sales system, which you can use to map a given organization’s license(s) to your own records of that sale.

This database should be able to expose an API to your add-in that might be similar to the following. 

```
www.contoso-addin.com/VerifyLicense.aspx? Username=xxx; autoProvision=1

    Return enum:

        - Organization has paid license, and User has paid license
        - Organization has paid license, and User has trial license
        - Organization has paid license, and User has no license
        - Organization has no license, and User has trial license
        - Organization has no license, and User has no license
```

This API will be called when the add-in runs on a customer’s premises. It must be publicly accessible.

In general, we recommend that you let anyone try your add-in, at least for a certain period of time. Plan to follow up with customers who use more licenses than they have paid for.

The business logic for choosing whether or not a user is given a valid license is up to your discretion. The following are some possible approaches.

### Always give licenses

You might decide you want to let anyone from any organization try your add-in. If you see high-volume usage of your add-in, your sales team can approach customers to sell them a license. 

You can include an internal mechanism to block customers who continue to use the add-in without making a purchase.

### Discretion when exceeding license limits

If an organization buys 200 licenses, consider what happens when 201, 210, or 300 users try to use the add-in. Generally, we recommend that you apply some discretion to preserve a seamless customer experience, because group sizes  change as people join and leave teams or organizations. If the service your add-in uses is expensive to run, however, you might decide to be strict about licensing limits.

### Enforcement based on first come, first served

You might want to let the first assigned users receive a license, but refuse licenses to any more users after the maximum number of licenses has been reached.

### Enforcement based on concurrent usage

You might want to only count users who have used the add-in in the last 30 days. For example, you might allow up to 200 users to have a license. If user 201 tries to use the add-in that month, they will not be granted access.

### Date-based enforcement of trials

You might want to use date-based enforcement. For example, if company A has not bought a license and 10 users try your add-in, you might let them use it (as a trial) for 30 days.  If company B has bought a license for 20 users, and another 5 users from company B try it, they might get to use it as a trial for 60 days. 

## Step 3: Modify your add-in to authenticate the user with OpenID authentication, and use single sign-on

To provide an intelligent experience that can upsell depending on who is using the add-in, the add-in needs to learn who the current user is.

<!-- Link to article? -->
When you use OpenID authentication in your add-in, users can sign in using a personal identity (a Microsoft account) or a work or school account.  

Also, when you use single sign-on, users are signed in to the add-in automatically with the same identity they use to sign in to Office. (Office 2013 or Office 2016 users still need to sign in manually.)

<!-- Are you referring to using OpenID and SSO? Are they technically requirements? 
>**Note:** OpenID authentication and SSO are requirements for the CSP program (hyperlink to program).
-->

## Step 4: Modify your add-in to look up licensing state

Your add-in must next identify information about the user.

For users who sign in with a work or school account, you can add support for Oauth to your add-in. For details, see [Authorize external services in your Office Add-in](https://dev.office.com/docs/add-ins/develop/auth-external-add-ins). This will allow you to use Microsoft Graph to get the following information about the user:

- Their organizational tenant ID, via the [Get organization](https://developer.microsoft.com/graph/docs/api-reference/v1.0/api/organization_get) method.  
- The list of roles that are assigned to the user, via the [getMemberObjects](https://developer.microsoft.com/graph/docs/api-reference/v1.0/api/user_getmemberobjects) action.
    The tenant admin directory role has the following specific ID: 62e90394-69f5-4237-9190-012177145e10. You can query for other roles as well.  

For more information, see [Microsoft Graph permission scopes](https://developer.microsoft.com/graph/docs/authorization/permission_scopes).

Pass this information to your licensing API.

## Step 5: Apply custom branding

You can support the rebranding of your add-in for a particular customer. To do this, you pass the current user's organization ID when your add-in service activates. You can do this in one of two ways:

- Use the organizational tenant ID to retrieve the organization's logo or name that is to be used on the splash screen. <!-- Because this information might be confidential, we recommend that you save it in X. -->
- If the add-in manifest is organization-specific, use a common backend service for all organizations, but include that organization’s name (or ID) as a URL parameter or path in the activation URL.

You can fall back to generic branding if the organization does not have or need specific branding.

## Step 6: Modify the add-in experience based on licensing state

Your add-in’s business logic should provide a different experience to the user based on the state of the license. For example:

- For users signed in with a work or school account:
    - If the user has a valid license, they get a branded, paid experience.
    - If the user has a trial license and their organization has purchased licenses, they might see a notification to contact their IT department to get a license.
    - If the user has a trial license and their organization has not purchased licenses, they might see prompts to learn more about the benefits of purchasing a license.
    - If the user does not have a valid or trial license, they might see a screen that encourages them to ask their IT department to purchase licenses, but be blocked from using the add-in.
- For users signed in with a Microsoft account:
    - Users who do not have paid licenses might see a request to purchase a license.

Note that some employees might not know how to contact their administrator. Provide graceful or informative user experiences where possible.

## Step 7: Win the customer 

Include in-app telemetry to help you understand whether customers have a successful experience with your add-in. You can use this information to determine which customers to contact and when. As a best practice, let customers try your add-in, and follow up in the app, by email (link to AppSource), and in person.  

For go-to-market best practices, see the [Office ISV GTM guide](https://www.microsoft.com/en-us/download/54593).


## Step 8: Record the sale

When a customer makes a purchase, update your licensing database with the record for that customer. Look up the customer in your licensing database by name or email, and record how many licenses were sold.

## Step 9: Deploy the add-in to the customer

After a customer makes a purchase, you need to deploy the add-in to the customer’s environment. The customer’s tenant administrator or a reseller can deploy the add-in, or you can deploy it yourself.

A tenant administrator can deploy the add-in via [centralized deployment](https://dev.office.com/docs/add-ins/publish/centralized-deployment). If your add-in is published in the Office Store, the admin can select it from the **Add an Office Add-in** link on the Office 365 admin center page. If your add-in has a custom manifest, the adminstrator will need to upload the manifest from their computer or a URL.

<!-- In our other content, we don't say that the admin has to create a group to assign the add-in. They can assign the add-in to groups or individuals. I suggest we leave this part out as it isn't consistent with our other content, or we update the centralized deployment topics to clarify that the add-ins have to be assigned to a group. 

The administrator should then create a flat group (or DL) containing the target users of that add-in.  Nested groups are not supported.  The administrator should then assign the add-in to that group.

At this point, everyone in the organization belonging to that group will see it in their ribbon.    (Link to Admin Center telemetry dashboard)

As group membership grows (or as users from the organization install the add-in from the Store), your licensing service will work as designed.

-->
