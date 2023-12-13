---
title: Configure server parameters - Azure portal - Azure Database for PostgreSQL - Single Server
description: This article describes how to configure the Postgres parameters in Azure Database for PostgreSQL through the Azure portal.
ms.service: postgresql
ms.subservice: single-server
ms.topic: how-to
ms.author: sunila
author: sunilagarwal
ms.date: 06/24/2022
---

# Configure server parameters in Azure Database for PostgreSQL - Single Server via the Azure portal

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

You can list, show, and update configuration parameters for an Azure Database for PostgreSQL server through the Azure portal.

## Prerequisites

To step through this how-to guide you need:
- [Azure Database for PostgreSQL server](quickstart-create-server-database-portal.md)

## Viewing and editing parameters

1. Open the [Azure portal](https://portal.azure.com).

2. Select your Azure Database for PostgreSQL server.

3. Under the **SETTINGS** section, select **Server parameters**. The page shows a list of parameters, their values, and descriptions.
:::image type="content" source="./media/how-to-configure-server-parameters-in-portal/3-overview-of-parameters.png" alt-text="Overview Page for Parameters":::

4. Select the **drop down** button to see the possible values for enumerated-type parameters like client_min_messages.
:::image type="content" source="./media/how-to-configure-server-parameters-in-portal/4-enum-drop-down.png" alt-text="Enumerate drop down":::

5. Select or hover over the **i** (information) button to see the range of possible values for numeric parameters like cpu_index_tuple_cost.
:::image type="content" source="./media/how-to-configure-server-parameters-in-portal/4-information-button.png" alt-text="information button":::

6. If needed, use the **search box** to narrow down to a specific parameter. The search is on the name and description of the parameters.
:::image type="content" source="./media/how-to-configure-server-parameters-in-portal/5-search.png" alt-text="Search results":::

7. Change the parameter values you would like to adjust. All changes you make in a session are highlighted in purple. Once you have changed the values, you can select **Save**. Or you can **Discard** your changes.
:::image type="content" source="./media/how-to-configure-server-parameters-in-portal/6-save-and-discard-buttons.png" alt-text="Save or Discard changes":::

8. If you have saved new values for the parameters, you can always revert everything back to the default values by selecting **Reset all to default**.
:::image type="content" source="./media/how-to-configure-server-parameters-in-portal/7-reset-to-default-button.png" alt-text="Reset all to default":::

## Next steps

Learn about:
- [Overview of server parameters in Azure Database for PostgreSQL](concepts-servers.md)
- [Configuring parameters using the Azure CLI](how-to-configure-server-parameters-using-cli.md)
