---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 07/12/2023
ms.author: kengaderdus
---

To use your client app certificate, you need to associate the app you registered in the Microsoft Entra admin center with the certificate:

1. 1.  Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/).

1. If you have access to multiple tenants, make sure you use the directory that contains your Azure AD for customers tenant:
    
    1. Select the **Directories + subscriptions** icon :::image type="icon" source="../../media/common/portal-directory-subscription-filter.png" border="false"::: in the toolbar. 
    
    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD for customers directory in the **Directory name** list, and then select **Switch**. 

1. On the sidebar menu, select **Azure Active Directory**.

1. Select **Applications**, then select **App Registrations**.

1. From the app registration list, select the app that you want to associate with the certificate, such as *ciam-client-app*.

1. Under **Manage**, select **Certificates & secrets**.

1. Select **Certificates**, then select **Upload certificate**.

1. Select the **Select a file** file icon, then select the certificate you want to upload, such as *ciam-client-app-cert.pem* or *ciam-client-app-cert.cer* or *ciam-client-app-cert.crt*.

1. For **Description**, type in a description, such as, *CIAM client app certificate*, then select **Add** to upload your certificate. Once the certificate is uploaded, the **Thumbprint**, **Start date**, and *Expires* values are displayed.

1. Record the **Thumbprint** value for use later when you configure your client app.