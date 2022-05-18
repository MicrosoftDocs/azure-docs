---
author: alexwolfmsft
ms.author: alexwolf
ms.topic: include
ms.date: 02/03/2022
---

Select the **Configuration** link on the left nav to go to the configuration page.

Select the **+ New Connection string** button in the **Connection Strings** section, and enter the following values:

* **Name** - enter `MyDbConnection`.
* **Value** - paste the connection string you copied into the value field.  Make sure to replace the username and password in the Connection String with the values you specified when creating the database.
* **Type** - select **SQLServer**.

Select **OK** to close the dialog, and then select **Save** at the top of the configuration screen.

Your app can now connect to the SQL database. Next let's generate the schema for our data using Entity Framework Core.
