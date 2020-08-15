---
title: 'Quickstart: Configure properties for an application in your Azure Active Directory (Azure AD) tenant'
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
---

# Quickstart: Configure properties for an application in your Azure Active Directory (Azure AD) tenant

In the previous quickstart, you added an application to your Azure Active Directory (Azure AD) tenant. When you add an application, you're letting your Azure AD tenant know it's the identity provider for the app. Now you'll configure some of the properties for the app.
 
## Prerequisites

To configure the properties of an application in your Azure AD tenant, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
- Optional: Completion of [View your apps](view-applications-portal.md).
- Optional: Completion of [Add an app](add-application-portal.md).

>[!IMPORTANT]
>Use a nonproduction environment to test the steps in this quickstart.

## Configure app properties

When you finish adding an application to your Azure AD tenant, the overview page appears. If you're configuring an application that was already added, look at the first quickstart. It walks you through viewing the applications added to your tenant. 

To edit the application properties:

1. In the Azure AD portal, select **Enterprise applications**. Then find and select the application you want to configure.
2. In the **Manage** section, select **Properties** to open the **Properties** pane for editing.

    ![Screenshot of the Properties screen that shows editable app properties.](media/add-application-portal/edit-properties.png)

3. Take a moment to understand the options available to configure:
    - **Enabled for users to sign in?** determines whether users assigned to the application can sign in.
    - **User assignment required?** determines whether users who aren't assigned to the application can sign in.
    - **Visible to users?** determines whether users assigned to an app can see it in the [access panel](https://myapps.microsoft.com) and Office 365 app launcher. (See the waffle menu in the upper-left corner of an Office 365 or Microsoft 365 website.)
4. Use the following tables to help you choose the best options for your needs.

   - Behavior for *assigned* users:

       | Application property | Application property | Application property | Assigned-user experience | Assigned-user experience |
       |---|---|---|---|---|
       | Enabled for users to sign in? | User assignment required? | Visible to users? | Can assigned users sign in? | Can assigned users see the application?* |
       | Yes | Yes | Yes | Yes | Yes  |
       | Yes | Yes | No  | Yes | No   |
       | Yes | No  | Yes | Yes | Yes  |
       | Yes | No  | No  | Yes | No   |
       | No  | Yes | Yes | No  | No   |
       | No  | Yes | No  | No  | No   |
       | No  | No  | Yes | No  | No   |
       | No  | No  | No  | No  | No   |

   - Behavior for *unassigned* users:

       | Application property | Application property | Application property | Unassigned-user experience | Unassigned-user experience |
       |---|---|---|---|---|
       | Enabled for users to sign in? | User assignment required? | Visible to users? | Can unassigned users sign in? | Can unassigned users see the application?* |
       | Yes | Yes | Yes | No  | No   |
       | Yes | Yes | No  | No  | No   |
       | Yes | No  | Yes | Yes | No   |
       | Yes | No  | No  | Yes | No   |
       | No  | Yes | Yes | No  | No   |
       | No  | Yes | No  | No  | No   |
       | No  | No  | Yes | No  | No   |
       | No  | No  | No  | No  | No   |

     *Can the user see the application in the access panel and the Office 365 app launcher?

## Use a custom logo

To use a custom logo:

1. Create a logo that's 215 by 215 pixels, and save it in .png format.
2. In the Azure AD portal, select **Enterprise applications**. Then find and select the application you want to configure.
3. In the **Manage** section, select **Properties** to open the **Properties** pane for editing. 
4. Select the icon to upload the logo.
5. When you're finished, select **Save**.

    ![Screenshot of the Properties screen that shows how to change the logo.](media/add-application-portal/change-logo.png)

   > [!NOTE]
   > The thumbnail displayed on this **Properties** pane doesn't update right away. You can close and reopen the **Properties** pane to see the updated icon.


> [!TIP]
> You can automate app management using the Graph API, see [Automate app management with Microsoft Graph API](https://docs.microsoft.com/graph/application-saml-sso-configure-api).


## Clean up resources

If you're not going to continue with the quickstart series then consider deleting the app to clean up your test tenant. Deleting the app is covered in the last quickstart in this series, see [Delete an app](delete-application-portal.md).

## Next steps

Advance to the next article to learn how to set up single sign-on for an app.
> [!div class="nextstepaction"]
> [Set up single sign-on](add-application-portal-setup-sso.md)
