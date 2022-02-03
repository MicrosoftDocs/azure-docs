---
title: View available authorization systems in CloudKnox Permissions Management
description: How to view available authorization systems in CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 02/02/2022
ms.author: v-ydequadros
---

# View available authorization systems

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This topic describes how to view available authorization systems using the **Integrations** dashboard in CloudKnox Permissions Management (CloudKnox) to view available authorization systems.

## Display available authorization systems

1. In the upper right of the CloudKnox dashboard, select **User** (your initials) in the upper right of the screen, and then select **Integrations.**

    The **Integrations** dashboard displays a tile for each authorization system available to you.
1. Select an authorization system tile to view its integration information.

    The Integrations dashboard has three tabs:
    - A tab with the name of your authorization system, for example **CloudKnox API**.
    - The **Integration** tab
    - The **Settings** tab

## View information about an authorization system's API

The tab with the name of your authorization system provides information about features available through its application programming interface (API).

The API ensures that an organization can customize CloudKnox to best suit their workflows.

- To find out more about the API, select the link to the documentation.

## View integration information about an authorization system

The **Integration** tab displays the following integration information for the selected authorization system.

Depending on the authorization system you've selected, some of the information displayed on this tab may be different from the following list.

- **API endpoint**: Displays the API endpoint and authorization system name.
    - Select **Copy** (the pages icon) to copy the endpoint information to the clipboard.

- **Email**: Displays user email names.
- **Created by**: Displays the name of the user who created the integration. 
- **Created on**: Displays the date the user created the integration. 
- **Recent activity**: Displays when the authorization system was last used. 

    If there has been no activity, the column displays **Never used**.
- **Service account ID**: Displays the service account ID. 
    - Select **Copy** (the pages icon) to copy the service account ID to the clipboard. 
- **Access key**: Displays the access key. 
    - To copy the access key to the clipboard, select **Copy** (the pages icon).
- **Re-generate**: Select to generate a new key.
    - In the **Validate OTP To integrations.generateNewKeys** box, enter the OTP (one time passcode) CloudKnox sent to your email address. Then select **Verify**.

        If you don't receive the OTP in your email, select **Resend OTP**, and then check your email.

## View settings information about an authorization system

The **Settings** tab displays the following settings information for the selected authorization system:

- **Roles can create service account**
    - Select a role or roles that can create a service account: **Super Admin**, **Viewer**, or **Controller**. You can select more than one role.

- **Access key rotation policy** 
    - **How often should the users rotate their access keys?**: Select how often you want to rotate your access keys.
    - **Notification**: Select how often you want to be notified.
    - **Action**: Select what should happen to the access key after the rotation period ends: **Disable access key** or **No action**.

- **Access key usage policy** 
    - **How long can the users go without using their access keys?**: Select how long you want to go without using their access keys.
    - **Notification**: Select how often you want to be notified.
    - **Action**: Select what should happen to the access key after the rotation period ends. You can select **Disable access key** or **No action***.

- **Save**: Select **Save** to save your integration settings.

<!---## Next steps--->

<!---View integrated authorization systems](cloudknox-product-integrations)--->
<!---[Installation overview](cloudknox-installation.md)--->
<!---[Configure integration with the CloudKnox API](cloudknox-integration-api.md)--->
<!---[Sign up and deploy FortSentry in your organization](cloudknox-fortsentry-registration.md)--->