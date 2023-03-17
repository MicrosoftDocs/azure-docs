---
title: Create a Logic app with Azure Database for MySQL - Flexible Server
description: Create a Logic app with Azure Database for MySQL - Flexible Server
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: mksuni
ms.author: sumuth 
ms.date: 12/15/2022
---

# Tutorial: Create a Logic app with Azure Database for MySQL - Flexible Server

[!INCLUDE [logic-apps-sku-consumption](../../../includes/logic-apps-sku-consumption.md)]

This quickstart shows how to create an automated workflow using Azure Logic Apps with Azure Database for MySQL Connector (Preview). 

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free).

- Create an Azure Database for MySQL - Flexible Server using [Azure portal](./quickstart-create-server-portal.md) <br/> or [Azure CLI](./quickstart-create-server-cli.md) if you don't have one.
- Get the [inbound](../../logic-apps/logic-apps-limits-and-config.md#inbound) and [outbound](../../logic-apps/logic-apps-limits-and-config.md#outbound) IP addresses used by the Logic Apps service in the Azure region where you create your logic app workflow.
- Configure networking settings of Azure Database for MySQL - Flexible Server to make sure your logic Apps IP address have access to it. If you're using Azure App Service or Azure Kubernetes service, enable **Allow public access from any Azure service within Azure to this server** setting in the Azure portal.
-  Populate the database server with a new database `orderdb` and a table `orders` using the SQL script

```sql
CREATE DATABASE `orderdb`;
USE `orderdb`;
CREATE TABLE `orders` (
  `orderNumber` int(11) NOT NULL,
  `orderDate` date NOT NULL,
  `status` varchar(15) NOT NULL,
  PRIMARY KEY (`orderNumber`),
 ) ;
```

[Having issues? Let us know](https://github.com/MicrosoftDocs/azure-docs/issues)

 ## Create a Consumption logic app resource

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

2. In the Azure search box, enter `logic apps`, and select **Logic apps**.

   :::image type="content" source="./media/tutorial-logic-apps-with-mysql/find-select-logic-apps.png" alt-text="Screenshot that shows Azure portal search box with logic apps":::

3. On the **Logic apps** page, select **Add**.

4. On the **Create Logic App** pane, on the **Basics** tab, provide the following basic information about your logic app:
    -  **Subscription**: Your Azure subscription name.
    -   **Resource Group**: The Azure resource group where you create your logic app and related resources. This name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**).
    -   **Logic App name**:  Your logic app name, which must be unique across regions and can contain only letters, numbers, hyphens (`-`), underscores (`_`), parentheses (`(`, `)`), and periods (`.`).

5. Before you continue making selections, go to the **Plan** section. For **Plan type**, select **Consumption** so that you view only the settings that apply to the Consumption plan-based logic app type. The **Plan type** property specifies the logic app type and billing model to use.

6. Now continue making the following selections:

   - **Region**: The Azure datacenter region for storing your app's information. This example deploys the sample logic app to the **West US** region in Azure.
   - **Enable log analytics**: This option appears and applies only when you select the **Consumption** logic app type. <p><p>Change this option only when you want to enable diagnostic logging. For this quickstart, keep the default selection. 
    
7. When you're ready, select **Review + Create**.

8. On the validation page that appears, confirm all the information that you provided, and select **Create**.
     
## Select HTTP request trigger template 
Follow this section to create a new logic app starting with a **When an HTTP Request is received** trigger to perform a data operation on MySQL database.

1. After Azure successfully deploys your app, select **Go to resource**. Or, find and select your logic app resource by typing the name in the Azure search box.
    
   :::image type="content" source="./media/tutorial-logic-apps-with-mysql/go-to-new-logic-app-resource.png" alt-text="Screenshot showing the resource deployment page and selected button" :::

2. Scroll down past the video and the section named **Start with a common trigger**.

3. Select **When an HTTP Request is received**. 
    
   :::image type="content" source="./media/tutorial-logic-apps-with-mysql/add-http-request-trigger.png" alt-text="Screenshot showing the template gallery and selected template":::

4. Add a sample payload in json 

     ```json
    {
    "orderNumber":"100",
    "orderDate":"2023-01-01",
    "orderStatus":"Shipped"
    }
    ```
    
   :::image type="content" source="./media/tutorial-logic-apps-with-mysql/add-http-sample-payload.png" alt-text="Screenshot showing sample payload":::
    
5. An HTTP request body payload will be generated. 
    
   :::image type="content" source="./media/tutorial-logic-apps-with-mysql/https-request-body-payload-generated.png" alt-text="Screenshot showing sample payload is generated":::
    
## Add a MySQL database action
You can add an action as the next step after the HTTP request trigger to run subsequent operations in your workflow. You can add an action get, insert or update or delete data in the MySQL database. For this tutorial we will insert a new row into the `orders` table.

1. Add a **New Step** in the workflow

2. Search for **Azure Database for MySQL** connector. 
    
   :::image type="content" source="./media/tutorial-logic-apps-with-mysql/search-for-azure-db-for-mysql.png" alt-text="Screenshot searching for azure database for mysql":::

3. View all the actions for Azure Database for MySQL connector. 
    
   :::image type="content" source="./media/tutorial-logic-apps-with-mysql/azure-db-for-mysql-connector-actions.png" alt-text="Screenshot Azure database for mysql action listed":::

4. Select the **Insert Row** action. Select **Change connection** to add a new connection 
   
   :::image type="content" source="./media/tutorial-logic-apps-with-mysql/insert-row-action-mysql-database.png" alt-text="Screenshot Insert row action for Azure Database for MySQL":::
    
5. Add a new connection to the existing Azure Database for MySQL database. 
     
   :::image type="content" source="./media/tutorial-logic-apps-with-mysql/azure-mysql-database-add-connection.png" alt-text="Screenshot add new connection for Azure Database for MySQL":::
   
## Run your workflow
Select **Run Trigger** to execute the workflow and test if it actually inserts the row into the table. You can use any MySQL client to check if the row was inserted into the table. 
    
## Next steps
- [Create Schedule based workflows](../../logic-apps/tutorial-build-schedule-recurring-logic-app-workflow.md)
- [Create approval based workflows](../../logic-apps/tutorial-process-mailing-list-subscriptions-workflow.md)
    
