---
title: Microsoft CloudKnox Permissions Management - The Integrations dashboard 
description: How to view available authorization systems in the Integrations dashboard in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 01/25/2022
ms.author: v-ydequadros
---

# The Integrations dashboard

This topic describes how to use the **Integrations** dashboard in Microsoft CloudKnox Permissions Management (CloudKnox) to view available authorization systems.

**To display the Integrations dashboard**:

1. In the upper right of the CloudKnox dashboard, select **User** (your initials) in the upper right of the screen, and then select **Integrations.**

    The **Integrations** dashboard displays a tile for each authorization system available to you.
1. Select an authorization system tile to view its integration information.

    The Integrations dashboard has three tabs:
    - The **Authorization system** tab
    - The **Integration** tab
    - The **Settings** tab

## The Authorization system tab

The **Authorization system** tab provides information about features available through the selected authorization system's application programming interface (API). 

The API ensures that an organization can customize CloudKnox to best suit their workflows. 

- To find out more about the API, select the link to the documentation.

## The Integration tab

The **Integration** tab displays the following integration information for the selected authorization system.

Depending on the authorization system you've selected, some of the information displayed on this tab may be different from the list below.

- **API Endpoint** - Displays the API endpoint and authorization system name.
    - Select **Copy** (the pages icon) to copy the endpoint information to the clipboard. 
- **Email** - Displays user email names.

- **Created By** - Displays the name of the user who created the integration. 
- **Created On** - Displays the date the user created the integration. 
- **Recent activity** - Displays when the authorization system was last used. 

    If there has been no activity, the tab displays **Never used**.
- **Service Account ID** - Displays the service account ID. 
    - Select **Copy** (the pages icon) to copy the service account ID to the clipboard. 
- **Access Key** - Displays the access key. 
    - To copy the access key to the clipboard, select **Copy** (the pages icon).
- **Re-generate** - Select to generate a new key.
    - In the **Validate OTP To integrations.generateNewKeys** box, enter the OTP (One Time Passcode) CloudKnox sent to your email address. Then select **Verify**.

        If you don't receive the OTP in your email, select **Resend OTP**, and then check your email.

## The Settings tab

The **Settings** tab displays the following settings information for the selected authorization system:

- **Roles can create service account**
    - Select **Super Admin**, **Viewer**, or **Controller**. You can select more than one role.

- **Access Key Rotation Policy** 
    - **How often should the users rotate their access keys?** - Select how often users should rotate their access keys.
    - **Notification** - Select how often users should be notified.
    - **Action** - Select what should happen to the access key after the rotation period ends: **Disable Access Key** or **No Action**.

- **Access Key Usage Policy** 
    - **How long can the users go without using their access keys?** - Select how long users can go without using their access keys.
    - **Notification** - Select how often users should be notified.
    - **Action** - Select what should happen to the access key after the rotation period ends: **Disable Access Key** or **No Action**.

- **Save** - Select **Save** to save your integration settings.

<!---## Next steps--->

<!---View integrated authorization systems](cloudknox-product-integrations)--->
<!---[Installation overview](cloudknox-installation.md)--->
<!---[Configure integration with the CloudKnox API](cloudknox-integration-api.md)--->
<!---[Sign up and deploy FortSentry in your organization](cloudknox-fortsentry-registration.md)--->