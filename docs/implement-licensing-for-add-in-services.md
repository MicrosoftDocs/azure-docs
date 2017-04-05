# Implement licensing and upsell for your Office Add-in services

This document is intended for use by anyone building an Office add-in backed by a subscription service.  It describes how your add-in can expose different functionality or messaging depending on whether the customer has paid for that service or not.  This document includes how to deliver licensing and upsell, for example: when you sell your service to one department in an organisation and want to encourage sales to the other departments in that organisation too.

From a technical perspective, this document explains how to handle licensing state for individuals and for organisations.  It explains the scenarios (including personal acquisitions from the Office Store and deployments via Centralized Deployment, whether purchase is made by the customer themselves, or whether it is a Microsoft Partner who resells your service link).  

## Step 1: Use a single manifest for all customers, where possible

For ease of distribution and maintenance, we recommend that you submit a single add-in to the Office Store.  As you add new capabilities to your add-in, such as add-in commands (e.g. ribbon button support) or single sign-on, then these capabilities are made available to all customers and you do need to worry about supporting different add-ins for different customers.  It further means you do not need to contact each customer’s administrator individually should you ever need to change the manifest.

Note: Certain customisation scenarios are not yet supported which may lead you to give a customer a custom manifest for a deployment.  If you wish to use a different icon on the ribbon (e.g. the customer’s logo) or a different group name (e.g. Contoso Image Bank), you will need to provide your customer Contoso with a custom manifest.  

### Step 2: Create your own licensing database

To sell Office add-ins to organisations, you will need to create your own licensing database.  This is necessary because:
•	Many software vendors sell the add-in (and the subscription service that backs it) through their own licensing system, via their own invoices/payment-models and at price points of their own choosing.
•	Centralized Deployment does not offer the ability for users to buy add-ins from the Office Store and deploy them.  This is because Office Store paid add-ins today only work with personal identities (Microsoft Accounts), not organisational identities.

As such, you must build a licensing database (or use your existing licensing database).  This might record:
•	The organisational tenant ID, uniquely identifying the customer
•	The organisation name
•	The count of licenses you have sold to that customer (which may be an unlimited site license)
•	A list of the usernames / user IDs of all users who have a license assigned
•	Whether the license for each user is trial, paid basic or paid premium etc.
•	Whether users belonging to this organisation should be blocked (e.g. if they keep using the service but refuse to buy it)
•	Links to your internal sales system, allowing you to map a given organisation’s license(s) to your own records of that sale.

This database should be able to expose an API to your add-in that may look something like the API below.  Bear in mind the API will be called when the add-in runs on a customer’s premises so needs to be publicly accessible.
•	www.contoso-addin.com/VerifyLicense.aspx? Username=xxx; autoProvision=1
o	Return enum:
	Organisation has paid license, and User has paid license
	Organisation has paid license, and User has trial license
	Organisation has paid license, and User has no license
	Organisation has no license, and User has trial license
	Organisation has no license and User has no license

In general, it is recommended that you let anyone try your add-in, at least for a certain period of time.  See section (bottom of article) for how to follow up with customers who use a lot more licenses than they have paid for.

The business logic for choosing whether a user is given a valid license or not is left to your discretion.  Some approaches include:

### Always give licenses

You may decide you want to let anyone try the add-in from any organisation.  This lets your sales team wait for viral usage of your add-in to take hold before you approach the customer (see bottom of article) to win the sale.  

You may have an internal mechanism to block particular customers who keep using the add-in but refuse to pay.

### Discretion when exceeding license limits

If an organisation buys 200 licenses, and user 201 tries to use the add-in, should they get a valid license response or an invalid license response.  How about user 210?  How about user 300?

Generally, a little bit of discretion is recommended so the customer’s experience is not ‘brittle’, and because group sizes will organically go up or down as people join and leave teams or organisations.  But if the service used by your add-in is very expensive to run, you may decide to be strict.

### Enforcement based on first come, first served

You may wish to let the first 200 assigned users receive a list, but any more users will be refused.

### Enforcement based on concurrent usage

You may wish to only count users who have used the add-in in the last 30 days.  For example, you may allow up to 200 users to have a license.  If a 201st user tries to use it that month, they will be refused.

## Step 4: Modify your add-in to authenticate the user with Open ID Authentication, and leverage Single Sign-on

To be able to provide an intelligent experience which knows how to upsell depending on who is using the add-in, the add-in first needs to learn who the current user is.

Your add-in should leverage OpenID Auth (hyperlink to article?).  When implemented in your add-in, this will give the user a way to sign-in using a personal identity (a Microsoft Account) or an organisational identity.  

Your add-in should further leverage Single Sign On (hyperlink to article).  When implemented in your add-in, this will allow your user to be automatically signed into the add-in with the same identity they use to sign into Office.  (Users on older versions of Office 2013 or Office 2016 would still need to sign in manually)

Note that the requirements above are requirements for CSP program (hyperlink to program).

## Step 5: Modify your add-in to look up licensing state

Your add-in must next identify key characteristics about the user:

1.	For users signed in with an organisational identity:
a.	Identify their Organisational Tenant ID.  (open: how?)
b.	Identify whether the current signed in user is a tenant administrator (open: how?)
2.	Pass this information to your licensing API (as above, connected to your licensing database)

## Step 6: Determine organisation branding

You may support the re-branding of your add-in for a particular customer.  To achieve this, when your add-in service activates, it needs to be told the ID of the current user’s organisation.

This may be achieved in one of two ways:
1)	You may use the Organisational Tenant ID (from above) to retrieve that particular organisation’s logo/name that is to be used on the splash screen.  Since this information may be confidential, it is recommended you save it in X (link to how Martin did it).
2)	The add-in manifest may already be organisation-specific.  You may use a common back-end service for all organisations, but the activation URL may include that organisation’s name (or ID) as a URL parameter or path.

You may fall back to generic branding if the organisation does not have/need specific branding.

## Step 7: Modify the add-in experience based on licensing state

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

## Step 8: Win the customer 

You should include in-app telemetry to know whether the customer is being successful with your add-in.  This will let you know when which customers to contact and when, which will improve your chance of making a sale.  The best practice is to let customers try the add-in, while following up in-app, by email (link to AppSource), and in person.  

Best practices are contained in our go-to-market guide (link).

You will learn as you approach customers how to engage with them in a way that is well received and wins the sale.  As said above, it is at your discretion how strict you are when customers go over their license allocation.

## Step 9: Record the sale

When you have won the sale for a given customer, you should update the licensing database with the record for that customer.  

You should look up the customer in your licensing database by name or email, and record how many licenses were sold, etc.

## Step 9: Deploy the add-in

After the sale is complete, the add-in needs to be deployed in the customer’s environment.  This may be done by the customer’s Tenant Administrator themselves, by you on their behalf, or by a Reseller.

The administrator must navigate to Centralised Deployment (link?).  Ideally, your add-in is in the Office Store and the admin may pick it.  In cases where you needed to build a custom manifest, that manifest must be manually uploaded.

The administrator should then create a flat group (or DL) containing the target users of that add-in.  Nested groups are not supported.  The administrator should then assign the add-in to that group.

At this point, everyone in the organisation belonging to that group will see it in their ribbon.    (Link to Admin Center telemetry dashboard)

Crucially, as group membership grows (or as users from that same organisation install the add-in from the Store), your licensing service can do the ‘right’ thing and your add-in can behave as desired.
