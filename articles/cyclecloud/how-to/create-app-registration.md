---
title: Create Entra App Registration for use with CycleCloud (PREVIEW)
description: Configure Entra ID App Registration to use with CycleCloud
author: aevdokimova
ms.date: 07/01/2025
ms.author: aevdokimova
---

# Create Microsoft Entra app registration for use with CycleCloud **(PREVIEW)**

[Microsoft Entra ID](/entra/fundamentals) is a cloud-based identity and access management service that enables your employees to access external resources. If your organization requires the use of Microsoft Entra ID, CycleCloud provides a native integration to Microsoft Entra ID for user management, authorization, and authentication.

> [!NOTE]
> When you permission users for an App Registration, they get the assigned access and role for all CycleCloud installations that use that App Registration. To segregate users between multiple CycleCloud installations, create a separate App Registration for each CycleCloud.

## Create the CycleCloud app registration

> [!NOTE]
> If you use a service principal for CycleCloud that the CLI generates, it doesn't have an associated Enterprise Application required for Microsoft Entra ID.

1. In the Azure portal, select the **Microsoft Entra ID** icon in the navigation pane. Or, type "Microsoft Entra ID" in the search bar and select "Microsoft Entra ID" from the Services category in the results.
1. Go to the **App registrations** tab.  
![Location of the App registrations tab in Azure Portal](../images/entra-setup/entra1.png)
1. Select **New registration** from the top menu and set up your application. You don't need to set the redirect URI right now.
![App registration creation view](../images/entra-setup/entra17.png)
1. On the **Overview** page of your newly created application, note the **Application (client) ID** and **Directory (tenant) ID** fields. You need these values later to configure Entra authentication in CycleCloud.
![Overview of the App Registration window](../images/entra-setup/entra2.png)
1. On the **Expose an API** page of your app, select **Add a scope**. This step exposes your app registration as an API for which Access Tokens can be generated. In the pop-up, keep the Application ID URI as the default value, which should look like `api://{ClientID}`.
![Expose an API menu](../images/entra-setup/entra3.png)
![A popup view for adding the API scope's URI](../images/entra-setup/entra4.png)
1. When you select **Save and Continue**, the portal prompts you to configure the new scope. Enter `user_access` as the scope name. Configure the other fields as you want, but set **State** to Enabled. After you save the scope, it appears in the **Scopes** table.
![Add a scope configuration sliding view](../images/entra-setup/entra5.png)
1. Go to the **API Permissions** page and select **Add a permission**. In the **Request API permissions** menu, go to **My APIs** and choose the name of your application. From there, choose **Delegated permissions** and select the scope you just created. Select **Add permission**. Your new permission now appears in the **Configured permissions** table.
![A view of API permissions table alongside the side menu for adding one](../images/entra-setup/entra6.png)
![Request API permissions menu](../images/entra-setup/entra7.png)
1. On the **Authentication** page, select **Add a platform** and choose **Single-page application**. If you plan to use the CycleCloud CLI with Entra ID, set **Allow public client flows** to **true**.
![Platform configuration menu](../images/entra-setup/entra8.png)
1. Under the **Configure single-page application** menu, set **Redirect URI** to "https://{your_cyclecloud_IP_or_DOMAIN_NAME}/home". You can leave the rest of fields blank.
![Single-page application configuration menu](../images/entra-setup/entra18.png)
1.	Under **Configure single-page application**, set the **Redirect URI** to `http://localhost`. This URI is required. For more information, see [Redirect URI (reply URL) restrictions and limitations](/entra/identity-platform/reply-url). Make sure to also include both `https://{your_cyclecloud_IP_or_DOMAIN_NAME}/home` and `https://{your_cyclecloud_IP_or_DOMAIN_NAME}/login` as allowed redirect URLs. You can leave the rest of fields blank.
1.  To allow multiple CycleCloud installations or multiple URIs for the same CycleCloud to access this **Application Registration**, configure additional URIs on the same **Authentication** page. Select **Add URI** to create a field, enter the additional URI in the new field, and select **Save**. 
![Redirect URI configuration view](../images/entra-setup/entra15.png)
1.	To enable the CycleCloud CLI to authenticate with the new application registration, add the **Mobile and desktop applications** platform. Go back to the **Authentication** page, select **Add a platform** again, and select **Mobile and desktop applications** in the **Configure Desktop + Devices** pop-up. Add a custom redirect URI with the value `http://localhost`.

    ![Configure Desktop + devices menu](../images/entra-setup/entra19.png)
    
    When you select **Configure**, you can also add a URI for `https://localhost`.
    ![Mobile and desktop application configuration window](../images/entra-setup/entra20.png)
1.	Next, add the user roles for CycleCloud under **App roles** by selecting **Create app role**. You can set the **Display name** field to anything you want, but the **Value** field must match the built-in CycleCloud role for this to work. 
![App roles configuration window](../images/entra-setup/entra9.png)
    > [!NOTE]
    > Since Microsoft Entra ID doesn't allow roles to have spaces in them and some of the in-built CycleCloud roles include spaces (for example, “Cluster Administrator”), replace any spaces in the role names you define in Microsoft Entra ID with a dot (for example, “Data Admin” becomes “Data.Admin”). Rename any roles defined in CycleCloud to not feature dots. Role definitions in Microsoft Entra ID are case insensitive.

    At a minimum, add the following roles:
    ![Basic roles required for CycleCloud](../images/entra-setup/entra21.png)
1. By default, the app registration issues access tokens v2.0, which CycleCloud doesn't support. To configure the app registration to issue tokens v1.0, select **Manifest**, locate the property **accessTokenAcceptedVersion** in the manifest, and change the value of that property to **null**. After changing the token version, select **Save**.
![Manifest menu](../images/entra-setup/entra24.png)
## Permissioning users for CycleCloud

1.  After you create the required CycleCloud roles, add users and assign roles to them. To do this step, go to the app's **Enterprise Application** page. The easiest way to get there is through a helper link on your App roles page. 
![A shortcut to get to the Enterprise Application's role assignment window](../images/entra-setup/entra10.png)
1.  To add a user and assign a role, go to the **Users and groups** page of the Enterprise Application and select **Add user/group**.
![Add a user/group menu](../images/entra-setup/entra11.png)
1. On the **Add Assignment** page, select one or more users and the role to assign to them. You can use a search bar to filter users. Since only one app role was created in the screenshot, it's selected automatically, but the menu for selecting it is similar to how you select users. You can assign only one role at a time. To add multiple roles to the same user, repeat this process.
![Add a role assignment selection](../images/entra-setup/entra12.png)
![Add a role assignment completion](../images/entra-setup/entra13.png)
1. After you assign the role, the user appears on the **User and groups** page. Assigning multiple roles to a single user results in several entries for that user - one entry per role.
![User and groups view after a role has been assigned](../images/entra-setup/entra14.png)
1. RECOMMENDED: If you want to allow access to CycleCloud only for users you explicitly add to your app, go to the **Properties of the Enterprise Application** and set **Assignment Required** to **Yes** 
![Assignment required setting highlight in the Enterprise Application blade](../images/entra-setup/entra16.png)