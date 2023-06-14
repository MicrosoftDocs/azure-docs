---
ms.service: logic-apps
ms.topic: include
author: ecfan
ms.author: estfan
ms.date: 09/27/2022
ms.custom: engagement-fy23
---

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. In the designer search box, enter **github**. If your workflow is blank, select the trigger that you want to use. If your workflow already has a trigger, select the action that you want to use.

   This example continues with a GitHub trigger.

   ![Select the GitHub connector and a trigger](./media/connectors-create-api-github/github-connector.png)

1. If you didn't previously create a connection, select **Sign in** so you can provide your GitHub credentials when prompted.

   Your workflow requires these credentials for authenticating your identity to GitHub.

   ![Sign in with your GitHub credentials](./media/connectors-create-api-github/github-connector-sign-in-credentials.png)

1. Provide your GitHub user name and password. To confirm access to your GitHub account, authorize Azure Logic Apps (**aaptapps**) to create the connection.

   ![Provide credentials and confirm authorization](./media/connectors-create-api-github/github-connector-authorize.png)   

   Your connection is now created in the Azure portal and is ready for use.

1. Continue defining your logic app workflow.

   ![Add more actions to your logic app workflow](./media/connectors-create-api-github/github-connector-logic-app.png)
