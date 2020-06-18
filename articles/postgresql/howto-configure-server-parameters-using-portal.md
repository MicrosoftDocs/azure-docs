---
title: Configure server parameters - Azure portal - Azure Database for PostgreSQL - Single Server
description: This article describes how to configure the Postgres parameters in Azure Database for PostgreSQL through the Azure portal.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 02/28/2018
---

# Configure server parameters in Azure Database for PostgreSQL - Single Server via the Azure portal 
You can list, show, and update configuration parameters for an Azure Database for PostgreSQL server through the Azure portal.

## Prerequisites
To step through this how-to guide you need:
- [Azure Database for PostgreSQL server](quickstart-create-server-database-portal.md)

## Viewing and editing parameters
1. Open the [Azure portal](https://portal.azure.com).

2. Select your Azure Database for PostgreSQL server.

3. Under the **SETTINGS** section, select **Server parameters**. The page shows a list of parameters, their values, and descriptions.
![Overview Page for Parameters](./media/howto-configure-server-parameters-in-portal/3-overview-of-parameters.png)

4. Select the **drop down** button to see the possible values for enumerated-type parameters like client_min_messages.
![Enumerate drop down](./media/howto-configure-server-parameters-in-portal/4-enum-drop-down.png)

5. Select or hover over the **i** (information) button to see the range of possible values for numeric parameters like cpu_index_tuple_cost.
![information button](./media/howto-configure-server-parameters-in-portal/4-information-button.png)

6. If needed, use the **search box** to narrow down to a specific parameter. The search is on the name and description of the parameters.
![Search results](./media/howto-configure-server-parameters-in-portal/5-search.png)

7. Change the parameter values you would like to adjust. All changes you make in a session are highlighted in purple. Once you have changed the values, you can select **Save**. Or you can **Discard** your changes.
![Save or Discard changes](./media/howto-configure-server-parameters-in-portal/6-save-and-discard-buttons.png)

8. If you have saved new values for the parameters, you can always revert everything back to the default values by selecting **Reset all to default**.
![Reset all to default](./media/howto-configure-server-parameters-in-portal/7-reset-to-default-button.png)

## Next steps
Learn about:
- [Overview of server parameters in Azure Database for PostgreSQL](concepts-servers.md)
- [Configuring parameters using the Azure CLI](howto-configure-server-parameters-using-cli.md)
