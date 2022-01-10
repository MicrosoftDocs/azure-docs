---
title: Microsoft CloudKnox Permissions Management - The Integrations dashboard 
description: How to use the Integrations dashboard in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 01/10/2022
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - The Integrations dashboard

The **Integrations** dashboard displays the authorization systems available to you in Microsoft CloudKnox Permissions Management.

1. To display the **Integrations** dashboard, select **User** (your initials) in the upper right of the screen, and then select **Integrations.**

    The **Integrations** dashboard displays a tile for each available authorization system.

1. Select an authorization system tile to view its integration information.

1. On the **Authorization System** page, select **Integration**.

     The **Integration** dashboard displays the following information for the selected authorization system.

    Depending on the authorization system you've selected, some of the information displayed may be different from the list below.

    - **Endpoint from** *the authorization system name*
        - Select **Copy** (the pages icon) to copy the endpoint information to the clipboard. 
        - Select **Edit Connection** (the pencil icon) to edit the connection information.
    - **Username** - Displays the username.
    - **API Endpoint** - Displays the API endpoint.
        - Select **Copy** (the pages icon) to copy the API endpoint information to the clipboard. 
    - **Created By** - Displays the name of the user who created the integration. 
    - **Created On** - Displays the date the user created the integration. 
    - **Service Account ID** - Displays the service account ID. 
        - Select **Copy** (the pages icon) to copy the service account ID to the clipboard. 
    - **Access Key** - Displays the access key. 
        - To copy the access key to the clipboard, select **Copy** (the pages icon).
        - To generate a new key, select **Generate New Key**.
            - In the **Validate OTP To integrations.generateNewKeys8** box, enter the OTP (One Time Passcode) CloudKnox sent to your email address. Then select **Verify**.

                If you don't receive the OTP in your email, select **Resend OTP**, and then check your email.
    - **Secret Key** - This option is reserved for future use.
    



<!---## Next steps--->

<!---View integrated authorization systems](cloudknox-product-integrations)--->
<!---[Installation overview](cloudknox-installation.md)--->
<!---[Configure integration with the CloudKnox API](cloudknox-integration-api.md)--->
<!---[Sign up and deploy FortSentry in your organization](cloudknox-fortsentry-registration.md)--->