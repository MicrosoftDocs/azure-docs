---
title: include file 
description: include file 
services: logic-apps
author: MandiOhlinger
ms.service: logic-apps
ms.topic: include 
ms.date: 03/02/2018
ms.author: mandia
ms.custom: include file
---

1. In the [Azure portal](https://portal.azure.com), 
create a blank logic app. 

2. In the Logic Apps Designer, 
enter "github" as your filter. 

3. Select the GitHub connector and the trigger 
that you want to use.

   ![Select the GitHub connector and a trigger](./media/connectors-create-api-github/github-connector.png)

   > [!NOTE]
   > All logic app workflows must start with a trigger. 
   > You can select actions only when your logic workflow 
   > already starts with a trigger. 

4. If you didn't previously create a connection, 
choose **Sign in** so you can provide 
your GitHub credentials when prompted.  

   ![Sign in with your GitHub credentials](./media/connectors-create-api-github/github-connector-sign-in-credentials.png)

   Your logic app uses these credentials to authorize 
   connecting and accessing data for your GitHub account. 

5. Provide your GitHub user name and password, then confirm your authorization.

   ![Provide credentials and confirm authorization](./media/connectors-create-api-github/github-connector-authorize.png)   

   Your connection is now created in the Azure portal 
   and is ready for use.

6. Continue defining your logic app workflow.

   ![Add more actions to your logic app workflow](./media/connectors-create-api-github/github-connector-logic-app.png)

