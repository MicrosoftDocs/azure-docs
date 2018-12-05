---
 title: include file
 description: include file
 services: digital-twins
 author: alinamstanciu
 ms.service: digital-twins
 ms.topic: include
 ms.date: 11/13/2018
 ms.author: alinast
 ms.custom: include file
---

1. In the [Azure portal](https://portal.azure.com), open **Azure Active Directory** from the left pane, and then open the **Properties** pane. Copy the **Directory ID** to a temporary file. You'll use this value to configure a sample application in the next section.

    ![Azure Active Directory directory ID](./media/digital-twins-permissions/aad-app-reg-tenant.png)

1. Open the **App registrations** pane, and then select the **New application registration** button.

    ![App registrations pane](./media/digital-twins-permissions/aad-app-reg-start.png)

1. Give a friendly name for this app registration in the **Name** box. Choose **Application type** as **Native**, and **Redirect URI** as `https://microsoft.com`. Select **Create**.

    ![Create pane](./media/digital-twins-permissions/aad-app-reg-create.png)

1. Open the registered app, and copy the value of the **Application ID** field to a temporary file. This value identifies your Azure Active Directory app. You'll use the application ID to configure your sample application in the following sections.

    ![Azure Active Directory application ID](./media/digital-twins-permissions/aad-app-reg-app-id.png)

1. Open your app registration pane. Select **Settings** > **Required permissions**, and then:

   a. Select **Add** on the upper left to open the **Add API access** pane.

   b. Select **Select an API** and search for **Azure Digital Twins**. If your search doesn't locate the API, search for **Azure Smart Spaces** instead.

   c. Select the **Azure Digital Twins (Azure Smart Spaces Service)** option and choose **Select**.

   d. Choose **Select permissions**. Select the **Read/Write Access** delegated permissions check box, and choose **Select**.

   e. Select **Done** in the **Add API access** pane.

   f. In the **Required permissions** pane, select the **Grant permissions** button, and accept the acknowledgement that appears.

      ![Required permissions pane](./media/digital-twins-permissions/aad-app-req-permissions.png)
