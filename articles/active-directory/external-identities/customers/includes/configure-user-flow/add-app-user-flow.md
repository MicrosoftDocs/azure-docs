---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 03/30/2023
ms.author: kengaderdus
---
Now you can associate applications with the user flow. Associating your user flow with an application allows you to enable sign-in or sign-up for that app. You can choose more than one application to be associated with the user flow. A single application can be associated only with one user flow. Once you associate the user flow with one or more applications, users who visit that application can sign up or sign in using the options configured in the user flow.

1. On the sidebar menu, select **Azure Active Directory**.

1. Select **External Identities**, then **User flows**.

1. Select the self-service sign-up user flow that you created earlier from the list, for example, *SignInSignUpSample*.

1. Under **Use**, select **Applications**.

1. Select **Add application**.

   <!--[Screenshot the shows how to associate an application to a user flow.](media/20-create-user-flow-add-application.png)-->

1. Select the application from the list such as *ciam-client-app* or use the search box to find the application, and then select it.

1. Choose **Select**. 