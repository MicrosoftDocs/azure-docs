---
title: 'Quickstart - Configure properties for an app that has been registered with your Azure AD tenant'
description: This quickstart uses the Azure portal to configure an application that has been registered with your Azure Active Directory (Azure AD) tenant.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: quickstart
ms.workload: identity
ms.date: 10/29/2019
ms.author: kenwith
ms.collection: M365-identity-device-management
---

# Configure properties for an application in your Azure AD tenant

In the previous quickstart you added an application to your Azure AD tenant. When you add an application you are registering it with Azure AD. In this quickstart you will configure some of the properties for an app.
 
>[!IMPORTANT]
>We recommend using a non-production environment to test the steps in this quickstart.

## Before you begin

To configure the properties of an application in your tenant, you need to have already added the app. The previous quickstart walks you through adding an app to your tenant.

## Configure user sign-in properties

When you add an application to your Azure ID tenant you are immediate presented with the settings for it. If you are configuring an application that has already been added then look at the first quickstart which walks you through viewing the applications added to your tenant. 

To edit the application properties:

1. Select the application to open it.
2. Select **Properties** to open the properties pane for editing.

    ![Shows the Properties screen and editable app properties](media/add-application-portal/edit-properties.png)

3. Take a moment to understand the sign-in options. The options determine how users who are assigned or unassigned to the application can sign into the application. And, the options also determine if a user can see the application in the access panel.

    - **Enabled for users to sign-in?** determines whether users assigned to the application can sign in.
    - **User assignment required?** determines whether users who aren't assigned to the application can sign in.
    - **Visible to users?** determines whether users assigned to an app can see it in the access panel and O365 launcher.

4. Use the following tables to help you choose the best options for your needs.

   - Behavior for **assigned** users:

       | Application property | Application property | Application property | Assigned-user experience | Assigned-user experience |
       |---|---|---|---|---|
       | Enabled for users to sign-in? | User assignment required? | Visible to users? | Can assigned users sign in? | Can assigned users see the application?* |
       | yes | yes | yes | yes | yes  |
       | yes | yes | no  | yes | no   |
       | yes | no  | yes | yes | yes  |
       | yes | no  | no  | yes | no   |
       | no  | yes | yes | no  | no   |
       | no  | yes | no  | no  | no   |
       | no  | no  | yes | no  | no   |
       | no  | no  | no  | no  | no   |

   - Behavior for **unassigned** users:

       | Application property | Application property | Application property | Unassigned-user experience | Unassigned-user experience |
       |---|---|---|---|---|
       | Enabled for users to sign in? | User assignment required? | Visible to users? | Can unassigned users sign in? | Can unassigned users see the application?* |
       | yes | yes | yes | no  | no   |
       | yes | yes | no  | no  | no   |
       | yes | no  | yes | yes | no   |
       | yes | no  | no  | yes | no   |
       | no  | yes | yes | no  | no   |
       | no  | yes | no  | no  | no   |
       | no  | no  | yes | no  | no   |
       | no  | no  | no  | no  | no   |

     *Can the user see the application in the access panel and the Office 365 app launcher?

## Use a custom logo

To use a custom logo:

1. Create a logo that is 215 by 215 pixels, and save it in PNG format.
1. Since you've already found your application, select the application.
1. In the left pane, select **Properties**.
1. Upload the logo.
1. When you're finished, select **Save**. 

    ![Shows how to change the logo from the app's Properties page](media/add-application-portal/change-logo.png)

   > [!NOTE]
   > The thumbnail displayed on this **Properties** pane doesn't update right away. You can close and reopen the properties to see the updated icon.

## Next steps

Now that you've configured the properties of the application you can continue on to setup single sign-on.

- [Set up single sign-on](add-application-portal-setup-sso.md)
- [Remove an app](remove-application-portal.md)