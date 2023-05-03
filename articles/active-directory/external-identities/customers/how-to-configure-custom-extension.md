---
title: Add validation to attribute collection
description: Learn about how you can create a custom authentication extension in the authentication flow for your customer-facing application. There are two events enabled, OnAttributeCollectionStart and OnAttributeCollectionSubmit.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date: 04/30/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to know what information I can collect from customers during sign-up, and how I can customize and extend how I collect information.
---

# Configure a custom authentication extension

Self-service sign-up user flows can now take advantage of custom extensions in order to provide validation and augmentation capabilities. 

Custom extensions allow you to perform validation on attributes collected from the user during sign-up, along with showing the user a blocked or validation error page if needed. 

## Configuring a custom extension 

Follow these steps to configure a custom extension for your user flow: 

1. Sign in to your test tenant using the [portal URL](https://portal.azure.com/?EnableCustomExtension=true&useMultiEventApi=true). 

2. Navigate to **External Identities** > **Custom authentication extensions (preview)** > **Create a custom extension**. 

3. Select the **OnAttributeCollectionStart/Submit** event types and select **Next**. 

   <!--/media/PP3/attribute-collection-01.png-->

4. Enter your endpoint configuration information and then select **Next**. 

   - **Name** is a friendly name for your custom extension to help you identify it elsewhere 

   - **Target URL** is the endpoint for your custom extension API 

   - **Description** is optional, and is used to help others understand what your custom extension is used for, what information it returns, and what actions it may take. 

   <!--/media/PP3/attribute-collection-02.png-->

5. You can use an existing app registration. Select an application registration from the flyout menu and select **Select**. You can also create a new application registration. After you select the appropriate app registration, your app’s name, application ID (client ID), and app ID URI will be shown. If you haven't created an App ID URI for your app registration, you must do so at this step. Select **Next** when you have completed this step.

   <!--/media/PP3/attribute-collection-03.png-->

6. The confirmation page appears. Verify the information, and then select **Create**.

   <!--/media/PP3/attribute-collection-04.png-->

7. The Overview view of your custom extension appears. Review the information. Also, you may be prompted to grant Admin Consent for your API in order to receive custom authentication extension HTTP requests. Select the **Grant Permission** button after reviewing this information. 

   <!--/media/PP3/attribute-collection-05.png-->

8. Consent to the permission being requested. Review the information and select **Accept** if you approve.

   <!--/media/PP3/attribute-collection-06.png-->

9. After you grant consent, your Overview page will show that the app’s required permission has been configured.

## Associating a custom extension to a user flow 

Now that you have created a custom extension, you can associate it with one or more of your user flows. To do so, follow these steps.

1. Go to **External Identities** and select **User flows**. Select the user flow that you want to configure to use your custom extension.

2. The user flow Overview appears. Select **Custom authentication extensions** to display the custom extension data.

3. You can associate custom extensions with two different steps of your user flow: **Before collecting information from the user** (associated with the OnAttributeCollectionStart event) and **When a user submits their information**(associated with the OnAttributeCollectionSubmit event).

   <!--/media/PP3/attribute-collection-07.png-->

4. If you're configuring a custom extension for the OnAttributeCollectionStart event, select the pencil icon next to the “Before collecting…” step.

5. In the dropdown that appears, only those custom extensions configured for the OnAttributeCollectionStart event appear. Choose the application you configured in the previous steps and choose **Select**.

   <!--/media/PP3/attribute-collection-08.png-->

6. Your application appears next to the “Before collecting…” step. If you're satisfied with this configuration, select the **Save** icon in the menu.

   <!--/media/PP3/attribute-collection-09.png-->