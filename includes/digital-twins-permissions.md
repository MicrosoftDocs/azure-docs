---
 title: include file
 description: include file
 services: azure-digital-twins
 author: alinamstanciu
 ms.service: azure-digital-twins
 ms.topic: include
 ms.date: 09/19/2018
 ms.author: alinast
 ms.custom: include file
---

1. In the [Azure portal](https://portal.azure.com), open **Azure Active Directory** from the pane on the left. Then open the **Properties** pane. Copy **Directory ID** to a temporary file. You use this value to configure sample application in the following section.

    ![Azure Active Directory Properties Directory ID](./media/digital-twins-permissions/aad-app-reg-tenant.png)

1. Open the **App registrations** pane, and then select **New application registration**.
    
    ![Azure Active Directory app registrations new](./media/digital-twins-permissions/aad-app-reg-start.png)

1. Enter a friendly name for this app registration in the **Name** box. Under **Application type**, select **Native**. Under **Redirect URI**, select https://microsoft.com. Select **Create**.

    ![Azure Active Directory App registrations create](./media/digital-twins-permissions/aad-app-reg-create.png)

1. Open the registered app, and copy the value of the **Application ID** field to a temporary file. This value identifies your Azure Active Directory app. You use the Application ID to configure your sample application in the following sections.

    ![Azure Active Directory Application ID](./media/digital-twins-permissions/aad-app-reg-app-id.png)

1. Open your app registration pane. Select **Settings** > **Required permissions**, and then:

    a. Select **Add** in the top left to open the **Add API access** pane.
    
    b. Choose **Select an API**, and search for **Azure Digital Twins**. If your search doesn't locate the API, search for **Azure Smart Spaces** instead.
    
    c. Select **Azure Digital Twins (Azure Smart Spaces Service)**, and choose **Select**.
    
    d. Choose **Select permissions**. Select the **Read/Write Access** delegated permissions check box, and choose **Select**.
    
    e. Select **Done** in the **Add API access** pane.
    
    f. In the **Required permissions** pane, select **Grant permissions**. Accept the acknowledgement that appears.

      ![Azure Active Directory App registrations add API](./media/digital-twins-permissions/aad-app-req-permissions.png)
