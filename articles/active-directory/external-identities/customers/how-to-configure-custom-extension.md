---
title: Add validation to attribute collection
description: Learn about how you can perform validation on attributes collected from the user during sign-up, along with showing the user a blocked or validation error page if needed. There are two events enabled, OnAttributeCollectionStart and OnAttributeCollectionSubmit.
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

# Configure a custom extension

Self-service sign-up user flows can now take advantage of custom extensions in order to provide validation and augmentation capabilities. 

Custom extensions allow you to perform validation on attributes collected from the user during sign-up, along with showing the user a blocked or validation error page if needed. 

## Configuring a custom extension 

Follow the these steps to configure a custom extension for your user flow user flow: 

1. Sign in to your test tenant using the [portal URL](https://portal.azure.com/?EnableCustomExtension=true&useMultiEventApi=true). 

2. Navigate to **External Identities** > **Custom authentication extensions (preview)** > **Create a custom extension**. 

3. Select the **OnAttributeCollectionStart/Submit** event types and click **Next**. 

   <!--/media/PP3/attribute-collection-01.png-->

4. Enter your endpoint configuration information and then click **Next**. 

   - **Name** is a friendly name for your custom extension to help you identify it elsewhere 

   - **Target URL** is the endpoint for your custom extension API 

   - **Description** is optional, and is used to help others understand what your custom extension is used for, what information it returns, and what actions it may take. 

   <!--/media/PP3/attribute-collection-02.png-->

5. You can use an existing app registration. Select an application registration from the flyout menu and click **Select**. You can also create a new application registration. After selecting the appropriate app registration, your app’s name, application id (client id), and app ID URI will be shown. If you have not created an App ID URI for your app registration, you will be required to do so at this step. Click **Next** when you have completed this step. 

   <!--/media/PP3/attribute-collection-03.png-->

6. You will then be presented with a confirmation page. Review the information and if all looks good, click **Create**. 

   <!--/media/PP3/attribute-collection-04.png-->

7. You will be presented with the Overview view of your custom extension. Review the information. Also, you may be prompted to grant Admin Consent for your API in order to receive custom authentication extension HTTP requests. Click the **Grant Permission** button after reviewing this information. 

   <!--/media/PP3/attribute-collection-05.png-->

8. After clicking **Grant Permission**, you will be asked to consent to the permission being requested. Review the information and click **Accept** if you approve. 

   <!--/media/PP3/attribute-collection-06.png-->

9. After granting consent, your Overview page will show that the app’s required permission has been configured. 

## Associating a custom extension to a user flow 

Now that you have created a custom extension, you can associate it with one or more of your user flows. To do so, follow these steps. 

1. Go back to **External Identities** and select **User flows**. Click on the user flow that you want to configure to use your custom extension. 

2. You’ll be taken to your user flow’s Overview blade. Select the “Custom authentication extensions” menu item to display the Custom Extension blade data. 

3. Within the blade, you can associate custom extensions with two different steps of your user flow: “Before collecting information from the user” and “When a user submits their information”. The “Before collecting…” step is associated with the OnAttributeCollectionStart event; the “When a user submits…” step is associated with the OnAttributeCollectionSubmit event. 

   <!--/media/PP3/attribute-collection-07.png-->

4. In our previous steps, we configured a custom extension for the OnAttributeCollectionStart event, so click the pencil icon next to the “Before collecting…” step. 

5. In the dropdown that appears, only those custom extensions configured for the OnAttributeCollectionStart event will be displayed. Choose the application that we configured in the previous steps and click **Select**. 

   <!--/media/PP3/attribute-collection-08.png-->

6. You will see your application next to the “Before collecting…” step. If you are satisfied with this configuration, click the **Save** icon in the menu. 

   <!--/media/PP3/attribute-collection-09.png-->