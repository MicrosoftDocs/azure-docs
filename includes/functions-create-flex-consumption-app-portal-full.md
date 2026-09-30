---
author: ggailey777
ms.service: azure-functions
ms.custom:
  - build-2024
ms.date: 11/14/2025
ms.author: glenga
ms.topic: include
---

[!INCLUDE [functions-create-flex-consumption-app-portal](functions-create-flex-consumption-app-portal.md)]

6. On the **Monitoring** page, make sure that **Enable Application Insights** is selected. Accept the default to create a new Application Insights instance, or else choose to use an existing instance. When you create an Application Insights instance, you're also asked to select a Log Analytics **Workspace**.

7. On the **Authentication** page, change the **Authentication type** to **Managed identity** for all resources. With this option, a user-assigned managed identity is also created that your app uses to access these Azure resources using Microsoft Entra ID authentication. Managed identities with Microsoft Entra ID provides the highest level of security for connecting to Azure resources.   

8. Accept the default options in the remaining tabs and then select **Review + create** to review the app configuration you chose.

9. When you're satisfied, select **Create** to provision and deploy the function app and related resources.

10. Select the **Notifications** icon in the upper-right corner of the portal and watch for the **Deployment succeeded** message.

11. Select **Go to resource** to view your new function app. You can also select **Pin to dashboard**. Pinning makes it easier to return to this function app resource from your dashboard.

    :::image type="content" source="./media/functions-create-function-app-portal/function-app-create-notification-new.png" alt-text="Screenshot of deployment notification.":::