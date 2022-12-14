---
title: Create a Logic app with Azure Database for MySQL Flexible Server
description: Create a Logic app with Azure Database for MySQL Flexible Server
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: mksuni
ms.author: sumuth 
ms.date: 12/15/2022
---

# Tutorial: Create a Logic app with Azure Database for MySQL Flexible Server

[!INCLUDE [logic-apps-sku-consumption](../../../includes/logic-apps-sku-consumption.md)]

This quickstart shows how to create an automated workflow using Azure Logic Apps with Azure database for MySQL Flexible Server. 

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free).

- Create an Azure Database for MySQL Flexible server using [Azure portal](./quickstart-create-server-portal.md) <br/> or [Azure CLI](../../logic-apps/quickstart-create-server-cli.md) if you don't have one.
- Get the [inbound](../../logic-apps/logic-apps-limits-and-config.md#inbound) and [outbound](../../logic-apps/logic-apps-limits-and-config.md#outbound) IP addresses used by the Logic Apps service in the Azure region where you create your logic app workflow.
- Configure networking settings of Azure Database for MySQL flexible server to make sure your logic Apps IP address have access to it. If you're using Azure App Service or Azure Kubernetes service, enable **Allow public access from any Azure service within Azure to this server** setting in the Azure portal.
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

1. In the Azure search box, enter `logic apps`, and select **Logic apps**.

   ![Screenshot that shows Azure portal search box with "logic apps" as the search term and "Logic Apps" as the selected result.](./media/ tutorial-logic-apps-with-mysql/find-select-logic-apps.png)

1. On the **Logic apps** page, select **Add**.

   ![Screenshot showing the Azure portal and Logic Apps service page and "Add" option selected.](./media/ tutorial-logic-apps-with-mysql/add-new-logic-app.png)

1. On the **Create Logic App** pane, on the **Basics** tab, provide the following basic information about your logic app:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | Your Azure subscription name. |
   | **Resource Group** | Yes | <*Azure-resource-group-name*> | The [Azure resource group](../../azure-resource-manager/management/overview.md#terminology) where you create your logic app and related resources. This name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example creates a resource group named **My-First-LA-RG**. |
   | **Logic App name** | Yes | <*logic-app-name*> | Your logic app name, which must be unique across regions and can contain only letters, numbers, hyphens (`-`), underscores (`_`), parentheses (`(`, `)`), and periods (`.`). <br><br>This example creates a logic app named **My-First-Logic-App**. |
   |||||

1. Before you continue making selections, go to the **Plan** section. For **Plan type**, select **Consumption** so that you view only the settings that apply to the Consumption plan-based logic app type. The **Plan type** property specifies the logic app type and billing model to use.

   | Plan type | Description |
   |-----------|-------------|
   | **Standard** | This logic app type is the default selection and runs in single-tenant Azure Logic Apps and uses the [Standard billing model](../../logic-apps/logic-apps-pricing.md#standard-pricing). |
   | **Consumption** | This logic app type runs in global, multi-tenant Azure Logic Apps and uses the [Consumption billing model](../../logic-apps/logic-apps-pricing.md#consumption-pricing). |
   |||

1. Now continue making the following selections:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Region** | Yes | <*Azure-region*> | The Azure datacenter region for storing your app's information. This example deploys the sample logic app to the **West US** region in Azure. <p>**Note**: If your subscription is associated with an [integration service environment](connect-virtual-network-vnet-isolated-environment-overview.md), this list includes those environments. |
   | **Enable log analytics** | Yes | **No** | This option appears and applies only when you select the **Consumption** logic app type. <p><p>Change this option only when you want to enable diagnostic logging. For this quickstart, keep the default selection. |
   ||||

   > [!NOTE]
   >
   > If you selected an Azure region that supports availability zone redundancy, the **Zone redundancy** 
   > section is enabled. This preview section offers the choice to enable availability zone redundancy 
   > for your logic app. However, currently supported Azure regions don't include **West US**, 
   > so you can ignore this section for this example. For more information, see 
   > [Protect logic apps from region failures with zone redundancy and availability zones](../../logic-apps/set-up-zone-redundancy-availability-zones.md).

   When you're done, your settings look similar to this version:

   ![Screenshot showing the Azure portal and logic app resource creation page with details for new logic app.](./media/ tutorial-logic-apps-with-mysql/create-logic-app-settings.png)

1. When you're ready, select **Review + Create**.

1. On the validation page that appears, confirm all the information that you provided, and select **Create**.
     
     ## Select the blank template

1. After Azure successfully deploys your app, select **Go to resource**. Or, find and select your logic app resource by typing the name in the Azure search box.

   ![Screenshot showing the resource deployment page and selected button, "Go to resource".](./media/ tutorial-logic-apps-with-mysql/go-to-new-logic-app-resource.png)

   The designer's template page opens to show an introduction video and commonly used triggers.

1. Scroll down past the video and the section named **Start with a common trigger**.

1. Select **When a HTTP Request is received**. 

   ![Screenshot showing the template gallery and selected template, "HTTP request Logic App".](./media/ tutorial-logic-apps-with-mysql/add-http-request-trigger.png)
1. Add a sample payload in json 
    ```json
    {
    "orderNumber":"100",
    "orderDate":"2023-01-01",
    "orderStatus":"Shipped"
    }
    ```
    
   ![Screenshot showing sample payload , "HTTP request Logic App payload"](./media/ tutorial-logic-apps-with-mysql/add-http-sample-payload.png)
    
1. A HTTP request body payload will be generated 
    
    ![Screenshot showing sample payload is generated , "HTTP request sample payload"](./media/ tutorial-logic-apps-with-mysql/https-request-body-payload-generated.png)
    
## Add a MySQL database action
You can add an action as the next step after the HTTP request trigger to run subsequent operations in your workflow. You can add an action get, insert or update or delete data in the MySQL database. 

1. Add a **New Step** in the workflow

2. Search for **Azure database for MySQL** connector. 
    ![Screenshot searching for azure database for mysql , "Search for Azure database for MySQL"](./media/ tutorial-logic-apps-with-mysql/search-for-azure-db-for-mysql.png)

3.  View all the actions for Azure database for MySQL connector. 
    
     ![Screenshot Azure database for mysql action listed, "Actions for Azure database for MySQL"](./media/ tutorial-logic-apps-with-mysql/azure-db-for-mysql-connector-actions.png)

4. Select the **Insert Row** action . Select **Change connection** to add a new connection 
     ![Screenshot Insert row action for Azure database for MySQL, "insert row action for Azure database for MySQL"](./media/ tutorial-logic-apps-with-mysql/insert-row-action-mysql-database.png)
    
5. Add a new connection to the existing Azure database for MySQL database. 
         ![Screenshot add new connection for Azure database for MySQL, "add new connection for Azure database for MySQL"](./media/ tutorial-logic-apps-with-mysql/azure-mysql-database-add-connection.png)
   
## Run your workflow
Select **Run Trigger** to execute the workflow and test if it actually inserts the row into the table. You can use any MySQL client to check if the row was inserted into the table. 
    
## Next Steps
[Create Schedule based workflows](../../logic-apps/tutorial-build-schedule-recurring-logic-app-workflow.md)
[Create approval based workflows](../../logic-apps/tutorial-process-mailing-list-subscriptions-workflow.md)
    

    
    
    
