---
title: Configure server parameters - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: This article describes how to configure the Postgres parameters in Azure Database for PostgreSQL - Flexible Server through the Azure portal.
author: varun-dhawan
ms.author: varundhawan
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.date: 8/14/2023
---

# Configure server parameters in Azure Database for PostgreSQL - Flexible Server via the Azure portal 

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

You can list, show, and update configuration parameters for an Azure Database for PostgreSQL server through the Azure portal. In addition, you can also click on the **Server Parameter Tabs** to easily view parameter group as **Modified**, **Static**, **Dynamic** and **Read-Only**.

## Prerequisites
To step through this how-to guide you need:
- [Azure Database for PostgreSQL - Flexible server](quickstart-create-server-portal.md)

## Viewing and editing parameters
1. Open the [Azure portal](https://portal.azure.com).

2. Select your Azure Database for PostgreSQL server.

3. Under the **SETTINGS** section, select **Server parameters**. The page shows a list of parameters, their values, and descriptions.
:::image type="content" source="./media/howto-configure-server-parameters-in-portal/3-overview-of-parameters.png" alt-text="Screenshot of overview page for parameters.":::

4. Select the **drop down** button to see the possible values for enumerated-type parameters like client_min_messages.
:::image type="content" source="./media/howto-configure-server-parameters-in-portal/4-enum-drop-down.png" alt-text="Screenshot of enumerate drop down.":::

5. Select or hover over the **i** (information) button to see the range of possible values for numeric parameters like cpu_index_tuple_cost.
:::image type="content" source="./media/howto-configure-server-parameters-in-portal/4-information-button.png" alt-text="Screenshot of information button.":::

6. If needed, use the **search box** to narrow down to a specific parameter. The search is on the name and description of the parameters.
:::image type="content" source="./media/howto-configure-server-parameters-in-portal/5-search.png" alt-text="Screenshot of search results.":::

7. Change the parameter values you would like to adjust. All changes you make in a session are highlighted in purple. Once you have changed the values, you can select **Save**. Or you can **Discard** your changes.
:::image type="content" source="./media/howto-configure-server-parameters-in-portal/6-save-and-discard.png" alt-text="Screenshot of save or discard changes.":::

8. List all the parameters that are modified from their _default_ value. 
:::image type="content" source="./media/howto-configure-server-parameters-in-portal/8-modified-parameter-tab.png" alt-text="Screenshot of modified parameter tab.":::

9. If you have saved new values for the parameters, you can always revert everything back to the default values by selecting **Reset all to default**.
:::image type="content" source="./media/howto-configure-server-parameters-in-portal/7-reset-to-default-button.png" alt-text="Screenshot of reset all to default.":::

## Working with time zone parameters
If you plan to work with date and time data in PostgreSQL, you’ll want to ensure that you’ve set the correct time zone for your location. All timezone-aware dates and times are stored internally in PostgreSQL in UTC. They are converted to local time in the zone specified by the **TimeZone** server parameter before being displayed to the client.  This parameter can be edited on **Server parameters** page as explained above. 
PostgreSQL allows you to specify time zones in three different forms:
1. A full time zone name, for example America/New_York. The recognized time zone names are listed in the [**pg_timezone_names**](https://www.postgresql.org/docs/9.2/view-pg-timezone-names.html) view.  
   Example to query this view in psql and get list of time zone names:
   <pre>select name FROM pg_timezone_names LIMIT 20;</pre>

   You should see result set like:

   <pre>
            name
        -----------------------
        GMT0
        Iceland
        Factory
        NZ-CHAT
        America/Panama
        America/Fort_Nelson
        America/Pangnirtung
        America/Belem
        America/Coral_Harbour
        America/Guayaquil
        America/Marigot
        America/Barbados
        America/Porto_Velho
        America/Bogota
        America/Menominee
        America/Martinique
        America/Asuncion
        America/Toronto
        America/Tortola
        America/Managua
        (20 rows)
    </pre>
   
2. A time zone abbreviation, for example PST. Such a specification merely defines a particular offset from UTC, in contrast to full time zone names which can imply a set of daylight savings transition-date rules as well. The recognized abbreviations are listed in the [**pg_timezone_abbrevs view**](https://www.postgresql.org/docs/9.4/view-pg-timezone-abbrevs.html)
   Example to query this view in psql and get list of time zone abbreviations:

   <pre> select abbrev from pg_timezone_abbrevs limit 20;</pre>

    You should see result set like:

     <pre>
        abbrev|
        ------+
        ACDT  |
        ACSST |
        ACST  |
        ACT   |
        ACWST |
        ADT   |
        AEDT  |
        AESST |
        AEST  |
        AFT   |
        AKDT  |
        AKST  |
        ALMST |
        ALMT  |
        AMST  |
        AMT   |
        ANAST |
        ANAT  |
        ARST  |
        ART   |
    </pre>

3. In addition to the timezone names and abbreviations, PostgreSQL will accept POSIX-style time zone specifications of the form STDoffset or STDoffsetDST, where STD is a zone abbreviation, offset is a numeric offset in hours west from UTC, and DST is an optional daylight-savings zone abbreviation, assumed to stand for one hour ahead of the given offset. 
   

## Next steps
Learn about:
- [Overview of server parameters in Azure Database for PostgreSQL](concepts-server-parameters.md)
- [Configure Azure Database for PostgreSQL - Flexible Server parameters via CLI](howto-configure-server-parameters-using-cli.md)
  
