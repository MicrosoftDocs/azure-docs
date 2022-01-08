---
title: Microsoft CloudKnox Permissions Management integration with CloudKnox API
description: How to configure the Microsoft CloudKnox Permissions Management API integration.
services: active-directory
manager: karenh444
ms.service: active-directory
ms.topic: overview
author: Yvonne-deQ
ms.date: 01/07/2022
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management integration with CloudKnox API

This topic describes the process of configuring and deleting Microsoft CloudKnox Permissions Management integration with the CloudKnox API.

## How to configure a CloudKnox API integration

- On the **Integrations** page, click **CloudKnox API**.

### How to use the CloudKnox API tab

- To read additional documentation, click the link provided on the CloudKnox API tab.

### How to use the Integration tab

1. Click the **Integration** tab, and view the following columns:

    - **Email** - Lists the email address of the user who created the integration.
    - **Created By** - Lists the first and last name of the user who create the integration.
    - **Created On** - Lists the date and time the integration was created.
    - **Recent Activity** - Lists the date and time the integration was last used, or notes if the integration was never used.
    - **Service Account ID** - Lists the service account ID.
    - **Access Key** - Lists the access key code.

2. Click **Create Service Account**. The following information is pre-populated on the page:
    - **API Endpoint**
    - **Service Account ID**
    - **Access Key**
    - **Secret Key**

3. To copy the codes, click the **Duplicate** icon next to the respective information. 

   > [!NOTE]
   >  The codes are time sensitive and will regenerate after the box is closed.

4. To re-generate the codes, at the bottom of the column, click **Re-generate**.

### How to use the Settings tab

1. Click the **Settings** tab, and then view the following columns.

2. Under **Roles can create service account**, select **Super Admin**, **Viewer**, or **Controller**.

3. In the **Access Key Rotation Policy** column, select options for the following:

    - **How often should the users rotate their access keys?** - Select **30 days**, **60 days**, **90 days**, or **Never**.
    - **Notification** - Enter a whole number in the blank space within **Notify "X" days before the selected period**, or select **Don't Notify**.
    - **Action (after the key rotation period ends)** - Select **Disable Action Key** or **No Action**.

4. In the **Access Key Usage Policy** column, select options for the following:

    - **How often should the users go without using their access keys?** - Select **30 days**, **60 days**, **90 days**, or **Never**.
    - **Notification** - Enter a whole number in the blank space within **Notify "X" days before the selected period**, or select **Don't Notify**.
    - **Action (after the key rotation period ends)** - Select **Disable Action Key** or **No Action**.

5. Click **Save**.

## How to delete a CloudKnox API integration

1. Click **Delete Integration**.
 
     On the **Validate OTP To Delete [Service Name] Integration** page, a message displays asking you to check your email for a code sent to the email address on file.

     If you do not receive the code, click **Resend OTP**.

2. In the **Enter OTP** box, enter the code from the email.

3. Click **Verify**.

## Next steps

[Sentry installation - AWS](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20AWS%20bef8e66cf2834aa69867b628f4b0a203.html)

[CloudKnox FortSentry registration](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/CloudKnox%20FortSentry%20Registration%20f9f85592b2cf48aca0c0effd604a0827.html)

