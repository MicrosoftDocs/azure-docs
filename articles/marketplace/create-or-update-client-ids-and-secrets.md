---
title: Create or update client IDs and secrets in Partner Center
description: To enable OAuth in your SharePoint Add-ins, create or delete client IDs and secrets, update or replace expiring client secrets, and associate them with your add-ins in Partner Center.
ms.topic: article
ms.author: siraghav
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.date: 1/11/2018
---

# Create or update client IDs and secrets in Partner Center

Create or delete client IDs and secrets, update or replace expiring client secrets, and associate them with your apps in Partner Center to enable OAuth in your SharePoint Add-ins.

### To update expiring client secrets in SharePoint Add-ins

1. Generate and add a new client secret in Partner Center to associate with that particular add-in client ID. For specific steps, see **To generate additional client secrets** in [Update the client secret associated with your client ID](#update-the-client-secret-associated-with-your-client-id) later in this article.

2. Update your remote web application to use the new client secret. For information about how to do this using Microsoft Office Developer Tools for Visual Studio, see **Update the remote web application in Visual Studio to use the new secret** in [Replace an expiring client secret in a SharePoint Add-in](/sharepoint/dev/sp-add-ins/replace-an-expiring-client-secret-in-a-sharepoint-add-in). 

3. Republish your remote web application.

> [!IMPORTANT]
>  Microsoft Office Developer Tools for Visual Studio supports setting a secondary client secret that you can use to update your expiring client secret.

<a name="bk_usingoauth"> </a>
## Using OAuth to authenticate and authorize add-ins

Open Authorization (OAuth) is an open protocol for authorization. OAuth enables secure authorization from desktop and web applications in a simple and standard way. It lets users approve an application to act on their behalf without sharing their user name and password. For example, users can share their private resources or data (contact list, documents, photos, videos, and so on) that are stored on one site with another site, without having to provide their credentials (typically user name and password). 

With OAuth, users can authorize a service provider (for example, SharePoint) to provide tokens instead of credentials (for example, user name and password) to their data that is hosted by a given service provider (for example, SharePoint). Each token grants access to a specific site (for example, a SharePoint document repository), for specific resources (for example, documents from a folder), and for a defined duration. Users can then grant a third-party site access to information that is stored with another service provider (for example, SharePoint), without sharing their user name and password and without sharing all the data that they have on SharePoint.

If your add-in requires this type of authorization, you have to associate OAuth client ID and client secrets with your add-in. You can generate OAuth client secrets in Partner Center, and then add them to your add-in code.

When a user installs an add-in that has an associated client ID and client secret, a consent dialog box appears. If the user gives consent, the add-in can act on behalf of the user to access the data that the add-in requires. Users can only grant the permissions that they have. Grants represent the permissions that a user has delegated to an add-in. 

For example, your add-in could be a trip calendar add-in that opens as an **IFRAME** on a Microsoft 365 SharePoint site. OAuth would allow the add-in to identify the user to whom the trip calendar belongs, or if the trip calendar add-in needed to access other aspects of Microsoft 365, such as resources or calendar information, it could access those on behalf of the signed-in user.

> [!NOTE]
> For more information about OAuth, client ID and client secrets, see [Authorization and authentication of SharePoint Add-ins](/sharepoint/dev/sp-add-ins/authorization-and-authentication-of-sharepoint-add-ins), [Context Token OAuth flow for SharePoint Add-ins](/sharepoint/dev/sp-add-ins/context-token-oauth-flow-for-sharepoint-add-ins), and [Register SharePoint Add-ins 2013](/sharepoint/dev/sp-add-ins/register-sharepoint-add-ins).

<a name="bk_addclientid"> </a>
## Add a client ID and client secret

You can associate only one client ID with your add-in, but you can associate multiple client secrets with a client ID. For security and administrative purposes, we recommend limiting the number of client secrets associated with a client ID.

> [!IMPORTANT]
> To submit a SharePoint Add-in that uses OAuth and distribute it to China, you must: 
> - Use a separate client ID and client secret for China.
> - Add a separate add-in package specifically for China. 
> - Block access for all countries except China.
> - Create a separate add-in listing for China. 
>
> For more information about distributing add-ins to China, see [Submit apps for Office 365 operated by 21Vianet in China](submit-sharepoint-add-ins-for-office-365-operated-by-21vianet-in-china.md). 

Inbound data to your add-in is signed by using only one signing client secret. In Partner Center, this is the client secret with a green check mark next to **Active** in the Status column on the **Client IDs** page. If you delete the signing client secret that your add-in uses, the next valid client secret is used instead.

Your add-in can use any valid client secrets as passwords to communicate with Microsoft. When a client secret expires, it can no longer be used as a password. If there is only one client secret associated with your client ID, deleting that secret can prevent your add-in from accessing the data it needs.

If your add-in is a service and it needs OAuth client IDs and client secrets, follow these steps.

### To add a client ID

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/office/overview) with your developer account and go to the **Product overview** page for your add-in.

2. On the **Client IDs** tab, select **Add new client ID**.

3. In the **New client ID** dialog box, provide the following information.   

    |**Item**|**Information to provide**|
    |:-----|:-----|
    |Friendly name|Select a name to help you recognize which add-in will use this client ID; for example, "calendar app".|
    |App domain|Provide the domain on which your add-in will run. For example: `app.contoso.com`.<br/>This must be a valid domain name that you own; it must not include `http://` or `https://`,<br/>and it must not be an international domain name.|
    |App redirect URL|Provide the redirect URL to send users to after they agree to your add-in's access requirements in the consent dialog box.<br/>This URL must start with `https://`, `http://`, or `ms-app://`.|

4. Select **Create secret now**.  

5. Choose how long your client secret will be valid for. The options are one, two, or three years. We recommend choosing one year, because this might be easier to track within your business processes than longer time periods. However, there is no security impact to choosing two or three years. When the client secret is expiring, you will need to update your add-in.

6. Select the availability of the client secret. Select one of the following:
    - **This client ID will be used for an app that is available worldwide.**
    - **This client ID will be used for an app that is available in China only.**
 
7. Choose **Create secret now**.

8. On the **Get client secret** page, copy your client ID and client secret to a secure location so that you can refer to it later.
    
    > [!IMPORTANT]
    > The client secret is associated with your client ID, but it will not be shown in Partner Center again. You should also record the start and end dates, so that you are aware of the client secret period of validity and its expiration date. If your client secret is close to expiring, you need to generate a new client secret and update your add-in. For more information, see [Update the client secret associated with your client ID](#bk_update).

9. Select **Done**.

<!-- Need to verify
<a name="bk_associate"> </a>
### To associate your client ID and secret with your add-in

After you create your client ID and client secret, you can add them to the code of your add-in and then associate your client ID with your add-in in Partner Center.

> [!NOTE]
> You can add the client ID and client secret to your code at any point in your add-in development process: during development, before testing, or before adding your add-in to Partner Center. However, to fully test your add-in, we recommend that you add them before you test. You can use the same client ID and secret throughout your add-in development process. If you are unsure where to place the client ID and client secret in your code, refer to the documentation provided for the add-in type you are developing.

### To associate the client ID and client secret with your add-in in Partner Center

1. When you're adding or editing your add-in, on the **Product overview** page, select the **My add-in is a service and requires server to server authorization** check box.
    
   > [!IMPORTANT]
   >  If you are submitting a SharePoint Add-in that uses OAuth, and you want to distribute it to China, you must use a separate client ID and client secret for China.

2. Select the friendly name of the OAuth client ID that you want your add-in to use. 
-->       

<a name="bk_update"> </a>

## Update the client secret associated with your client ID

Update your client secret in the following situations:

-  **Your client secret is expiring**
    
    We recommend that you add a new client secret in Partner Center while your current client secret is still valid. Update your add-in with the new client secret, and then delete the client secret that is close to expiring by choose **Delete** next to that entry on the **Client IDs** page in Partner Center.
    
    > [!NOTE]
    >  Microsoft Office Developer Tools for Visual Studio supports setting a secondary client secret that you can use to update your expiring client secret.

-  **The security of your client secret is compromised**
    
    To respond to a security compromise quickly, you can delete the compromised client secret from Partner Center first, add a new client secret, and then update your add-in with the new client secret.

    > [!IMPORTANT]
    > After the compromised client secret is deleted and before the new client secret is added, your add-in might temporarily be unavailable. This might be acceptable depending on the severity of the business impact of a lost or stolen client secret.

### To generate additional client secrets

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/office/overview) with your developer account and go to the **Product overview** page for your add-in.

2. On the **Client IDs** tab, select the client ID with which you want to associate additional client secrets.

3. On the client ID detail page, select **New client secret**.

4. Choose how long you want the secret to be valid for. The options are one, two, or three years.

4. Select **Create**.

5. Copy the client secret shown on the **Get client secret** dialog box to a secure location so that you can refer to it later.
    
    > [!IMPORTANT]
    > The client secret is associated with your client ID, but it will not be shown in Partner Center again. Record the start and end dates so that you are aware of the client secret period of validity and its expiration date.

6. Select **Done**.
    
    > [!NOTE]
    > The new client secret will be active within 15 minutes.

### To delete a client secret

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/office/overview) with your developer account and go to the **Product overview** page for your add-in.

2. On the **Client IDs** tab, select **Delete** next to the client ID that has the client secret that you want to delete.
    
    > [!IMPORTANT]
    > Deleting a client secret can prevent your add-in from accessing the data it needs, unless you created additional secrets that are valid and that are associated with your add-in, and you configured it to use these additional client secrets. If you have only one client secret associated with the client ID, we recommend that you generate an additional client secret before you delete it.

4. In the **Confirmation** dialog box, select **Delete**.

<a name="bk_deleteclientid"> </a>
## Delete a client ID

You might want to delete a client ID in certain situations, for example:

- You no longer want to offer your add-in.

- You want to offer a new version of your add-in and no longer want to offer the previous version. In this situation, you might want to delete the client ID you associated with the previous version of your add-in.

> [!WARNING]
> Deleting a client ID that is associated with your add-in deletes all associated client secrets and prevents it from accessing the data it needs. Any customer using your add-in will experience downtime after you delete a client ID that is associated with it.

### To delete a client ID

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/office/overview) with your developer account and go to the **Product overview** page for your add-in.

2. On the **Client IDs** tab, select **Delete** next to the client ID that has the client secret that you want to delete.

3. In the **Confirmation** dialog box, select **Delete**.


### To delete a client ID, but continue offering your add-in

1. Add another client ID and at least one valid client secret. For details, see  [Add a client ID and client secret](#bk_addclientid).

2. Delete the client ID from your code.

3. Delete the client ID from Partner Center, as described in the previous procedure.

4. Add the new client ID and client secret to your code.

5. On the **Product overview** page, choose **Publish**.
    
    > [!NOTE]
    > Customers using your add-in will experience downtime during the update to your code and the Partner Center approval process.

<a name="bk_addresources"> </a>
## See also

- [Submit your Office solution to Microsoft AppSource via Partner Center](submit-to-appsource-via-partner-center.md)
- [Microsoft AppSource submission FAQ](appsource-submission-faq.yml)
- [Certification policies](/legal/marketplace/certification-policies)

    
