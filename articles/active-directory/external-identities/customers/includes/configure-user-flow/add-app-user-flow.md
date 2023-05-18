---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 05/05/2023
ms.author: kengaderdus
---
Although many applications can be associated with your user flow, a single application can only be associated with one user flow. A user flow allows configuration of the user experience for specific applications. For example, you can configure a user flow that requires users to sign-in or sign-up with a phone number or email address.

1. On the sidebar menu, select **Azure Active Directory**.

1. Select **External Identities**, then **User flows**.

1. Select the self-service sign-up user flow that you created earlier from the list, for example, *SignInSignUpSample*.

1. Under **Use**, select **Applications**.

1. Select **Add application**.

   <!--[Screenshot the shows how to associate an application to a user flow.](media/20-create-user-flow-add-application.png)-->

1. Select the application from the list such as *ciam-client-app* or use the search box to find the application, and then select it.

1. Choose **Select**. 