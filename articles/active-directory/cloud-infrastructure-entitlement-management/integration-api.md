---
title: Set and view configuration settings in Permissions Management
description: How to view the Permissions Management API integration settings and create service accounts and roles.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 06/16/2023
ms.author: jfields
---

# Set and view configuration settings

This topic describes how to view configuration settings, create and delete a service account, and create a role in Permissions Management.

## View configuration settings

The **Integrations** dashboard displays the authorization systems available to you.

1. To display the **Integrations** dashboard, select **User** (your initials) in the upper right of the screen, and then select **Integrations.**

    The **Integrations** dashboard displays a tile for each available authorization system.

1. Select an authorization system tile to view the following integration information:

    1. To find out more about the Permissions Management API, select **Permissions Management API**, and then select documentation.

    1. To view information about service accounts, select **Integration**:
        - **Email**: Lists the email address of the user who created the integration.
        - **Created By**: Lists the first and last name of the user who created the integration.
        - **Created On**: Lists the date and time the integration was created.
        - **Recent Activity**: Lists the date and time the integration was last used, or notes if the integration was never used.
        - **Service Account ID**: Lists the service account ID.
        - **Access Key**: Lists the access key code.

    1. To view settings information, select **Settings**:
        - **Roles can create service account**: Lists the type of roles you can create.
        - **Access Key Rotation Policy**: Lists notifications and actions you can set.
        - **Access Key Usage Policy**: Lists notifications and actions you can set.

## Create a service account

1. On the **Integrations** dashboard, select **User**, and then select **Integrations.**
2. Click **Create Service Account**. The following information is pre-populated on the page:
    - **API Endpoint**
    - **Service Account ID**
    - **Access Key**
    - **Secret Key**

3. To copy the codes, select the **Duplicate** icon next to the respective information.

   > [!NOTE]
   >  The codes are time sensitive and will regenerate after the box is closed.

4. To regenerate the codes, at the bottom of the column, select **Regenerate**.

## Delete a service account

1. On the **Integrations** dashboard, select **User**, and then select **Integrations.**

1. On the right of the email address, select **Delete Service Account**.

     On the **Validate OTP To Delete [Service Name] Integration** box, a message displays asking you to check your email for a code sent to the email address on file.

     If you don't receive the code, select **Resend OTP**.

1. In the **Enter OTP** box, enter the code from the email.

1. Click **Verify**.

## Create a role

1. On the **Integrations** dashboard, select **User**, and then select **Settings**.
2. Under **Roles can create service account**, select the role you want:
    - **Super Admin**
    - **Viewer**
    - **Controller**

3. In the **Access Key Rotation Policy** column, select options for the following:

    - **How often should the users rotate their access keys?**: Select **30 days**, **60 days**, **90 days**, or **Never**.
    - **Notification**: Enter a whole number in the blank space within **Notify "X" days before the selected period**, or select **Don't Notify**.
    - **Action (after the key rotation period ends)**: Select **Disable Action Key** or **No Action**.

4. In the **Access Key Usage Policy** column, select options for the following:

    - **How often should the users go without using their access keys?**: Select **30 days**, **60 days**, **90 days**, or **Never**.
    - **Notification**: Enter a whole number in the blank space within **Notify "X" days before the selected period**, or select **Don't Notify**.
    - **Action (after the key rotation period ends)**: Select **Disable Action Key** or **No Action**.

5. Click **Save**.
