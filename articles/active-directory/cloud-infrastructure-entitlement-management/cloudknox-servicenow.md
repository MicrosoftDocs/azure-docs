---
title: Microsoft CloudKnox Permissions Management integration with ServiceNow
description: How to configure and use Microsoft CloudKnox Permissions Management with ServiceNow.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/15/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management integration with ServiceNow

This topic describes how to configure the ServiceNow integration with Microsoft CloudKnox Permissions Management.

## How to configure the ServiceNow integration

1. On the **Integration tab**, select **ServiceNow**.
2. On the **Integration tab**, select **ServiceNow**.
3. Read through the procedures to do the following tasks:
    1. Install the CloudKnox application for ServiceNow.
    2. Configure the CloudKnox application for ServiceNow.
    3. Assign roles for the CloudKnox plug-in for ServiceNow.
    4. Enable email notifications.
    5. Updating the list collector values.
    6. Edit the workflow.
4. On the **Integration tab**, under the **Communication with ServiceNow** plugin, view the following information:
    - **Endpoint for CloudKnox** - This box is pre-populated with the endpoint Uniform Resource Locator (URL).
    - **Username** - This box is pre-populated with the endpoint username.
    - **Password** - This box is pre-populated with a password.
5. Select **Test Connection**. 

     When the test has completed successfully, the **Connection successful, please Save** message appears.
6. Select **Save Connection**.
7. Review the following information:
    - **API End Point** (Application Programming Interface) - This box is pre-populated with the CloudKnox app web address.
    - **Service Account ID** - This box is pre-populated with the ID for the given connected service account.
    - **Access Key** - This box is pre-populated with the access key code.
    - **Secret Key** - Lists as *hidden*. It should be reserved for future use.
8. Select **Generate New Key**.
9. On the **Validate OTP To Generate New Keys**, a message displays asking you to check your email for a code that was sent to the email address on file. 

     If you don't receive the email, select **Resend OTP**, and then check your email again.
10. In the **Enter OTP box**, enter the code from the email.
11. Select **Verify**.

## How to use the Integration tab 

1. Select **Integration** and view the following information:
    - **Endpoint for ServiceNow** - This box is pre-populated with the endpoint URL.
    - **Username** - This box is pre-populated with the *cloudknox.endpoint* username.
    - **API End Point** (Application Programming Interface) - This box is pre-populated with the CloudKnox app web address.
    - **Created By** - This box is pre-populated with the email address of the user who created the integration.
    - **Created On** - This box is pre-populated with the date and time the integration was created.
    - **Service Account ID** - This box is pre-populated with the ID for the given connected service account.
    - **Access Key** - This box is pre-populated with the access key code.
    - **Secret Key** - Lists the secret key as *hidden*. It should be reserved for future use.
2. Select **Generate New Key**.
3. On the **Validate OTP To Generate New Keys**, a message displays asking you to check your email for a code that was sent to the email address on file.

     If you don't receive the email, select **Resend OTP**, and then check your email again.
4. In the **Enter OTP box**, enter the code from the email.
5. Select **Verify**.

<!---## Next steps--->