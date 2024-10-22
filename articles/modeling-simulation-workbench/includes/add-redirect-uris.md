---
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: include
ms.date: 08/20/2024
---

Follow these steps to register redirect URIs with the application registration in Microsoft Entra ID:

1. On the overview page for your Modeling and Simulation Workbench workbench, navigate to the connector.

1. On the **Overview** page for the connector, locate and document the two connector properties, **Dashboard reply URL** and **Authentication reply URL**, using the copy to clipboard icon. If these properties aren't visible, select the **See More** button on page to expand the window. The URLs will be of the form:
   * **Dashboard reply URL**: https://<*dashboardFqdn*>/etx/oauth2/code
   * **Authentication reply URL**: https://<*authenticationFqdn*>/otdsws/login?authhandler=AzureOIDC

   :::image type="content" source="../media/quickstart-create-portal/update-aad-app-01.png" alt-text="Screenshot of the connector overview page showing where you select the reply URLs.":::

## Add redirect URIs

1. From the Azure portal, navigate to **Microsoft Entra ID**

1. From the left menu, select **App registrations**

1. Locate your application registration you created for your Workbench.

1. Under **Manage**, select **Authentication**.

1. Under **Platform configurations**, select **Add a platform**.

1. Under **Configure platforms**, select the **Web** tile.

1. On the **Configure Web** pane, paste the **Dashboard reply URL** you documented in the previous step in the **Redirect URI** field. Then select **Configure**.
    :::image type="content" source="../media/quickstart-create-portal/update-aad-app-02.png" alt-text="Screenshot of the Microsoft Entra ID app Authentication page showing where you configure web authentication.":::

1. Under **Platform configurations** > **Web** > **Redirect URIs**, select **Add URI**.

1. Paste the **Authentication reply URL** you documented in the previous step.

1. Select **Save**.

   :::image type="content" source="../media/quickstart-create-portal/update-aad-app-03.png" alt-text="Screenshot of the Microsoft Entra app Authentication page showing where you set the second Redirect URI.":::
