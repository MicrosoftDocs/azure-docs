---
title: Registering an AAD Application
description: Registering an AAD Application
author: bwren
ms.author: bwren
ms.date: 08/18/2021
ms.topic: article
---
# Registering an AAD Application

1.  From your main Azure portal, go to Azure Active Directory.
2.  In the menu on the left hand side of the screen for AAD, select App Registrations.

![Select app registration](images/aad-setup/aad-menu.png)

3.  Create a new AAD app. Note the homepage/redirect URL you give the app on creation, as it will be required to request an OAuth token. Additionally, copy the Application ID from the App Properties tab in your App's menu. If this method of creating an app does not work for you, you may complete the same process by [following these steps](/azure/active-directory/develop/active-directory-v2-app-registration).

![Create a new AAD App](images/aad-setup/app-create.png)

4.  Next we need to associate this app with permissions to access the Log Analytics API, which we can do because we have added the Log Analytics API Service Principal to this tenant. Open the app you just created, accessible from the AAD menu via the App Registrations tab.
5.  Click "Required Permissions" then "Add". This step will vary depending on the [OAuth2 flow](https://dev.loganalytics.io/documentation/Authorization/OAuth2) you choose to use to authenticate.

<!-- end list -->

  - If you plan to use the authorization code grant or implicit grant flow, search for Log Analytics API in the "Select an API" menu, and choose it from the list. Select "Read Log Analytics data as user" under Delegated Permissions.

![Add permissions to AAD App](images/aad-setup/perms-add.png)

![Add Data.Read user role](images/aad-setup/08.png)

7.  Click Select at the bottom of the page, then done.

8.  Back in the "Required Permissions" window open on the left, click the "Grant Permissions" button to update the application permissions with your new selections.

9.  Move back again to the Settings menu for you AAD App, this time selecting "Keys". Provide a name and expiration date for your key, and click save. The key will be shown **only** now, so save it immediately. This key will be used to request tokens when paired with an authorization code.

After this step, you can retrieve OAuth2 tokens which you will send to the Log Analytics API. These tokens authorize you to the API. However, you still need to link your Log Analytics workspace so that the app will have permission to your particular workspace.

## Link Log Analytics Workspace

1.  Navigate to your Azure portal, and select or search for Log Analytics.
2.  Select your workspace from the list of available options, or search for it.
3.  From the left menu that opens, select Access Control (IAM). Click Add, and select "Log Analytics Reader" for the Role in the blade that appears. Search for your AAD App by name, and then click save.

You app is now setup to make API calls to your workspace. Next, you must decided on an [OAuth2 flow](oath2.md) to use, and request a token to authorize your access.
