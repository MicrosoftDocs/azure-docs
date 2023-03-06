---
title: Create a sign-up and sign-in user flow
description: Learn how to create a sign-up and sign-in user flow for your customer-facing app.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 03/03/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Create a sign-up and sign-in user flow for customers  

In your customer tenant, you can create user flows that allow users to **sign-in** or **sign up** for an app and create new local accounts. The user flow defines the series of steps the user follows during sign-up, and the user attributes you want to collect. The identity providers you allow them to use, such as [Google](how-to-google-federation-customers.md) and [Facebook](how-to-facebook-federation-customers.md). You can associate one or more applications with a single user flow.  

In your Azure AD customer tenant, email sign-up is enabled by default in your local account identity provider settings. When a customer completes a user flow, they sign up for your application by entering an email address and a password, which creates a local account in your directory. The account username and password are stored locally, and Azure AD serves as the identity provider for the account.

The following screenshot demonstrates the sign-in flow:

<!--[Screenshot that shows the steps user goes through to sign-in](./media/sign-in-flow.png)

> [!TIP]
> For programmatic access, follow the guidance in the [create user flows using Graph API](API%232-CIAM-branding.md)
-->

## Prerequisites

- If you haven't already created your own Azure AD customer tenant, create one now.
- If you haven't already registered an application in your customer tenant, register one now.
- Install [Node.js runtime](https://nodejs.org/en/download/) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) on your local machine. To test that you have Node.js and npm correctly installed on your machine, you can type `node --version` and `npm --version` in a terminal or command prompt.

## Create a user flow

Follow these steps to create a user flow a customer can use to sign in or sign up for an application.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. If you have access to multiple tenants, use the **Directories + subscriptions** filter in the top menu to switch to the customer tenant you created earlier.

1. Under **Azure services**, select **Azure Active Directory**.

1. In the left menu, select **External Identities**.

1. Select **User flows**, and then select **New user flow**.

   <!--[Screenshot](media/17-create-user-flow-new-user-flow.png)-->

1. On the **Create** page:

   1. Enter a **Name** for the user flow. For example, *SignInSignUpSample*.

   1. In the **Identity providers** list, select the  **Email Accounts** identity provider. This identity provider allows uses to sign-in or sign-up  with their email address.
   
         > [!NOTE]
         > Additional identity providers will be listed here only after you set up federation with them. For example, if you set up federation with [Google](how-to-google-federation-customers.md) or [Facebook](how-to-facebook-federation-customers.md), you'll be able to select those additional identity providers here.  

   1. Under **Email accounts**, you can select one of the three options. For this tutorial, select **Email with password**.

       - **Email with password**: Allows new users to sign up and sign in using an email address as the sign-in name and a password as their first factor credential.  

      - **Email one-time-passcode**: Allows new users to sign up and sign in using an email address as the sign-in name and email one-time passcode as their first factor credential.

         > [!NOTE]
         > Email one-time passcode must be enabled at the tenant level (**All Identity Providers** > **Email One-time-passcode**) for this option to be available at the user flow level.  
        
      The following screenshot demonstrates how to select the identity providers.
      
   <!--   ![Screenshot that shows how to select the Azure AD sign up and email accounts identity providers.](media/18-create-user-flow.png)-->

   1. Under **User attributes**, choose the attributes you want to collect from the user upon sign-up. For more attributes, select **Show more**. For example, select **Show more**, and then choose attributes and claims for **Country/Region**, **Display Name**, and **Postal Code**. Select **OK**. (Users are only prompted for attributes when they sign up for the first time.)


1. Select **Create**. The new user flow appears in the User flows list. If necessary, refresh the page.

## Add applications to the user flow

Now you can associate applications with the user flow. Associating your user flow with an application allows you to enable sign-in or sign-up for that app. You can choose more than one application to be associated with the user flow. A single application can be associated only with one user flow. Once you associate the user flow with one or more applications, users who visit that application can sign up or sign in using the options configured in the user flow.

1. In the Azure portal, select **Azure Active Directory**.

1. Select **External Identities**, and then select **User flows** under **Self-service sign up**.

1. Select the self-service sign-up user flow from the list you created.

1. In the left menu, under **Use**, select **Applications**.

1. Select **Add application**.

   <!--[Screenshot the shows how to associate an application to a user flow.](media/20-create-user-flow-add-application.png)-->

1. Select the application from the list. Or use the search box to find the application, and then select it.

1. Choose **Select**.

## Test the user flow

Now that your application is associated with a user flow, you can test the sign-in process.

<!--steps TBD-->

1. Open your browser in private mode and go to **http://localhost:3000/**.

1. In the top right corner of the page, select **Sign-in** to start the authentication flow.

1. Choose **Can't access your account?** to start the sign-up flow.

1. Follow the flow to enter your email, retrieve and enter the one-time passcode, and create new password. After you complete the sign-up steps, the page shows your newly created information.

1. Select **Sign-out** in the upper right corner of the page to sign out.

## (Optional) Select the layout of the attribute collection

You can choose the order in which the attributes are displayed on the sign-up page.

1. In the Azure portal, select **Azure Active Directory**.

1. Select **External Identities**, and then select **User flows**.

1. From the list, select your user flow.

1. Under **Customize**, select **Page layouts**.

   The attributes you chose to collect are listed. You can change the attribute label, type, and whether it’s required. You can also change the order of display by selecting an attribute, and then select **Move up**, **Move down**, **Move to the top**, or **Move to the bottom**.

   <!--[Screenshot shows how to sort the attribute collection](media/19-create-user-flow-attribute-page-layout.png)-->

1. Select **Save**.

## (Optional) Built-in and Custom Attributes  

User attributes are values collected from the user during self-service sign-up flow. Azure AD comes with a built-in set of attributes, but you can create custom attributes for use in your user flow. You can also read and write these attributes by using the Microsoft Graph API. Check out the define custom attributes for user flows<!--(API-reference-CIAM-user-flows.md#scenario-6-list-attributes-in-a-userflow)--> article.

### To add custom attributes

1. In the Azure portal, select **Azure Active Directory**.
1. Select **External Identities**
1. Select **Custom user attributes**. The available user attributes are listed.
1. To add an attribute, select **Add**.
1. In the **Add an attribute** pane, enter the following values:

   - **Name** - Provide a name for the custom attribute. For example, "Loyalty number".
   - **Data Type** - Choose a data type, **String**, **Boolean**, or **Int**.
   - **Description** - Optionally, enter a description of the custom attribute for internal use. This description isn't visible to the user.

1. Select **Create**.


### Add attributes to the sign-up page

The custom attribute is now available in the list of user attributes and for use in your user flows. In this step, you add the *Loyalty number* to a user flow.

1. In the Azure portal, select **Azure Active Directory**.
1. Select **External Identities**, and then select **User flows**.
1. From the list, select your user flow.
1. Under **Customize**, select **User attributes**.
1. Select the attributes you want to add. For example, *Loyalty number*. 
1. Select **Save**, to save the changes.

   <!-- ![Screenshot that shows how to select attributes to collect during the sign-up.](./media/user-flow-select-attributes.png)-->

## Next steps

- [Enable password reset](how-to-user-flow-password-reset-customers.md)