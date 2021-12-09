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
ms.date: 12/09/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management integration with ServiceNow

This topic describes how to configure the ServiceNow integration with Microsoft CloudKnox Permissions Management.

## How to configure the ServiceNow integration

- On the **Integration tab**, click **ServiceNow**.

## How to use the ServiceNow tab

1. On the **Integration tab**, click **ServiceNow**.
2. Read through the procedures to perform the following tasks:
    1. Install the CloudKnox application for ServiceNow.
    2. Configure the CloudKnox application for ServiceNow.
    3. Assign roles for the CloudKnox plug-in for ServiceNow.
    4. Enable email notifications.
    5. Updating the list collector values.
    6. Edit workflow.
3. On the **Integration tab**, under the **Communication with ServiceNow** plugin, view the following information:
    - **Endpoint for CloudKnox** - This box is pre-populated with the endpoint Uniform Resource Locator (URL).
    - **Username** - This box is pre-populated with the username endpoint.
    - **Password** - This box is pre-populated with a password.
4. Click **Test Connection**. 

     When the test has completed successfully, the **Connection successful, please Save** message appears.
5. Click **Save Connection**.
6. View the box below to find the following information:
    - **API End Point** (Application Programming Interface) - This box is pre-populated with the CloudKnox app web address.
    - **Service Account ID** - This box is pre-populated with the ID for the given connected service account.
    - **Access Key** - This box is pre-populated with the access key code.
    - **Secret Key** - Lists as *hidden*. It should be reserved for future use.
7. Click **Generate New Key**.
8. On the **Validate OTP To Generate New Keys**, a message displays asking you to check your email for a code that was sent to the email address on file. 

     If you do not receive the email, click **Resend OTP** and then check your email again.
9. In the **Enter OTP box**, enter the code from the email.
10. Click **Verify**.

## How to use the Integration tab 

1. Click **Integration** and view the following information:
    - **Endpoint for ServiceNow** - This box is pre-populated with the endpoint URL.
    - **Username** - This box is pre-populated with the username **cloudknox.endpoint**
    - **API End Point** (Application Programming Interface) - This box is pre-populated with the CloudKnox app web address.
    - **Created By** - This box is pre-populated with the email address of the user who created the integration. 
    - **Created On** - This box is pre-populated with the date and time the integration was created.
    - **Service Account ID** - This box is pre-populated with the ID for the given connected service account.
    - **Access Key** - This box is pre-populated with the access key code.
    - **Secret Key** - Lists the secret key as *hidden*. It should be reserved for future use.
2. Click **Generate New Key**.
3. On the **Validate OTP To Generate New Keys**, a message displays asking you to check your email for a code that was sent to the email address on file. 

     If you do not receive the email, click **Resend OTP** and then check your email again.
4. In the **Enter OTP box**, enter the code from the email.
5. Click **Verify**.

<!---## Next steps--->