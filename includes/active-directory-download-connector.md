---
author: CelesteDG
ms.service: active-directory-domain-services
ms.topic: include
ms.date: 01/22/2020
ms.author: marsma
---

1. Sign in to the [Azure portal](https://portal.azure.com/) as an application administrator of the directory that uses Application Proxy. For example, if the tenant domain is contoso.com, the admin should be admin@contoso.com or any other admin alias on that domain.
1. Select your username in the upper-right corner. Verify you're signed in to a directory that uses Application Proxy. If you need to change directories, select **Switch directory** and choose a directory that uses Application Proxy.
1. In left navigation panel, select **Azure Active Directory**.
1. Under **Manage**, select **Application proxy**.
1. Select **Download connector service**.

    ![Download connector service to see the Terms of Service](./media/active-directory-download-connector/application-proxy-download-connector-service.png)

1. Read the Terms of Service. When you're ready, select **Accept terms & Download**.
1. At the bottom of the window, select **Run** to install the connector. An install wizard opens.
1. Follow the instructions in the wizard to install the service. When you're prompted to register the connector with the Application Proxy for your Azure AD tenant, provide your application administrator credentials.
    - For Internet Explorer (IE), if **IE Enhanced Security Configuration** is set to **On**, you may not see the registration screen. To get access, follow the instructions in the error message. Make sure that **Internet Explorer Enhanced Security Configuration** is set to **Off**.
