---
title: Create a Power automate flow with Azure Database for MySQL Flexible Server
description: Create a Power automate flow with Azure Database for MySQL Flexible Server
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: mksuni
ms.author: sumuth 
ms.date: 1/15/2023
---

# Tutorial: Create a Power automate flow app with Azure Database for MySQL Flexible Server

Power Automate is a service that helps you create automated workflows between your favorite apps and services to synchronize files, get notifications, collect data, and more. Here are a few examples of what you can do with Power Automate.

- Automate business processes 
- Move business data between systems on a schedule
- Connect to more than 500 data sources or any publicly available API
- Perform CRUD (create, read, update, delete) operations on data 

In this quickstart shows how to create an automated workflow usingPower automate flow with [Azure database for MySQL connector](/connectors/azuremysql/).

## Prerequisites

* An account on [flow.microsoft.com](https://flow.microsoft.com).

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free).

- Create an Azure Database for MySQL Flexible server using [Azure portal](./quickstart-create-server-portal.md) <br/> or [Azure CLI](./quickstart-create-server-cli.md) if you don't have one.
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

# Overview of cloud flows

Create a cloud flow when you want your automation to be triggered either automatically, instantly, or via a schedule. Here are types of flows you can create and then use with Azure database for MySQL connector.

| **Flow type**                                                                       | **Use case**                                                                                  | **Automation target**                                                                             |
|-------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| [Automated flows](get-started-logic-flow.md)                 | Create an automation that is triggered by an event such as arrival of an email from a specific person, or a mention of your company in social media.| [Connectors](/connectors/) for cloud or on-premises services connect your accounts and enable them to talk to each other. |
| [Instant flows](introduction-to-button-flows.md)              | Start an automation with a click of a button. You can automate for repetitive tasks from your Desktop or Mobile devices. For example, instantly send a reminder to the team with a push of a button from your mobile device.                      |     Wide range of tasks such as requesting an approval, an action in Teams or SharePoint.                                                                                |
| [Scheduled flows](run-scheduled-tasks.md)                    | Schedule an automation such as daily data upload to SharePoint or a database.             |Tasks that need to be automated on a schedule.


If you're ready to start your Power Automate project, visit the [guidance and planning article](./guidance/planning/introduction.md) to get up and running quickly.    

## Specify an event to start the flow
First, you will need to select what event, or *trigger*, starts your flow.

1. In [Power Automate](https://flow.microsoft.com), select **Create** from the navigation bar on the left.

2. Under **Start from blank*, select **Auotmated cloud flow**.

3. Give your flow a name in the **Add a name or we'll generate one** field.

1. Enter **Twitter** into the **Search all triggers** field.

1. Select **Twitter - When a new tweet is posted**.

   ![Name your flow and serch for the Twitter trigger.](./media/get-started-logic-flow/name-search-trigger.png)


<!-- 1. Select the **Search hundreds of connectors and triggers** box at the bottom of the screen, enter **Twitter** in the box that says **Search all connectors and triggers**, and then select **Twitter - When a new tweet is posted**.

    ![Twitter event.](./media/get-started-logic-flow/twitter-search.png) -->

1. Select the **Create** button at the bottom of the screen.

## Specify an action

## Test your flow

    
## Next Steps
[Azure database for MySQL connector](/connectors/azuremysql/) reference 
    
