---
title:  Azure Application Insights usage cohorts | Microsoft Docs
description: Analyze different sets or users, sessions, events, or operations that have something in common
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: conceptual
ms.date: 04/10/2018
ms.reviewer: daviste
ms.author: mbullwin
---

# Application Insights cohorts

A cohort is a set of users, sessions, events, or operations that have something in common. In Azure Application Insights, cohorts are defined by an analytics query. In cases where you have to analyze a specific set of users or events repeatedly, cohorts can give you more flexibility to express exactly the set you’re interested in.

![Cohorts pane](.\media\app-insights-usage-cohorts\001.png)

## Cohorts versus basic filters

Cohorts are used in ways similar to filters. But cohorts' definitions are built from custom analytics queries, so they're much more adaptable and complex. Unlike filters, you can save cohorts so other members of your team can reuse them.

You might define a cohort of users who have all tried a new feature in your app. You can save this cohort in your Application Insights resource. It's easy to analyze this saved group of specific users in the future.

> [!NOTE]
> After they're created, cohorts are available from the Users, Sessions, Events, and User Flows tools.

## Example: Engaged users

Your team defines an engaged user as anyone who uses your app five or more times in a given month. In this section, you define a cohort of these engaged users.

1. Open the Cohorts tool.

2. Select the **Template Gallery** tab. You see a collection of templates for various cohorts.

3. Select **Engaged Users -- by Days Used**.

    There are three parameters for this cohort:
    * **Activities**, where you choose which events and page views count as “usage.”
    * **Period**, the definition of a month.
    * **UsedAtleastCustom**, the number of times users need to use something within a period to count as engaged.

4. Change **UsedAtleastCustom** to **5+ days**, and leave **Period** on the default of 28 days.

    ![Engaged users](.\media\app-insights-usage-cohorts\003.png)

    Now this cohort represents all user IDs sent with any custom event or page view on 5 separate days in the past 28.

5. Select **Save**.

   > [!TIP]
   >  Give your cohort a name, like “Engaged Users (5+ Days).” Save it to “My reports” or “Shared reports,” depending on whether you want other people who have access to this Application Insights resource to see this cohort.

6. Select **Back to Gallery**.

### What can you do by using this cohort?

Open the Users tool. In the **Show** drop-down box, choose the cohort you created under **Users who belong to**.

Now the Users tool is filtered to this cohort of users:

![Users pane filtered to a particular cohort](.\media\app-insights-usage-cohorts\004.png)

A few important things to notice:
* You can't create this set through normal filters. The date logic is more advanced.
* You can further filter this cohort by using the normal filters in the Users tool. So although the cohort is defined on 28-day windows, you can still adjust the time range in the Users tool to be 30, 60, or 90 days.

These filters support more sophisticated questions that are impossible to express through the query builder. An example is _people who were engaged in the past 28 days. How did those same people behave over the past 60 days?_

## Example: Events cohort

You can also make cohorts of events. In this section, you define a cohort of the events and page views. Then you see how to use them from the other tools. This cohort might define a set of events that your team considers _active usage_ or a set related to a certain new feature.

1. Open the Cohorts tool.

2. Select the **Template Gallery** tab. You’ll see a collection of templates for various cohorts.

3. Select **Events Picker**.

    ![Screenshot of events picker](.\media\app-insights-usage-cohorts\006.png)

4. In the **Activities** drop-down box, select the events you want to be in the cohort.

5. Save the cohort and give it a name.

## Example: Active users where you modify a query

The previous two cohorts were defined by using drop-down boxes. But you can also define cohorts by using analytics queries for total flexibility. To see how, create a cohort of users from the United Kingdom.

![Animated image walking through use of Cohorts tool](.\media\app-insights-usage-cohorts\cohorts0001.gif)

1. Open the Cohorts tool, select the **Template Gallery** tab, and select **Blank Users cohort**.

    ![Blank users cohort](.\media\app-insights-usage-cohorts\001.png)

    There are three sections:
    * A Markdown text section, where you describe the cohort in more detail for others on your team.

    * A parameters section, where you make your own parameters, like **Activities** and other drop-down boxes from the previous two examples.

    * A query section, where you define the cohort by using an analytics query.

    In the query section, you [write an analytics query](/azure/kusto/query). The query selects the certain set of rows that describe the cohort you want to define. The Cohorts tool then implicitly adds a “| summarize by user_Id” clause to the query. This data is previewed below the query in a table, so you can make sure your query is returning results.

    > [!NOTE]
    > If you don’t see the query, try resizing the section to make it taller and reveal the query. The animated .gif at the beginning of this section illustrates the resizing behavior.

2. Copy and paste the following text into the query editor:

    ```KQL
    union customEvents, pageViews
    | where client_CountryOrRegion == "United Kingdom"
    ```

3. Select **Run Query**. If you don't see user IDs appear in the table, change to a country where your application has users.

4. Save and name the cohort.

## Frequently asked questions

_I’ve defined a cohort of users from a certain country. When I compare this cohort in the Users tool to just setting a filter on that country, I see different results. Why?_

Cohorts and filters are different. Suppose you have a cohort of users from the United Kingdom (defined like the previous example), and you compare its results to setting the filter “Country or region = United Kingdom.”

* The cohort version shows all events from users who sent one or more events from the United Kingdom in the current time range. If you split by country or region, you likely see many countries and regions.
* The filters version only shows events from the United Kingdom. But if you split by country or region, you see only the United Kingdom.

## Learn more
- [Analytics query language](https://go.microsoft.com/fwlink/?linkid=856587)
- [Users, sessions, events](app-insights-usage-segmentation.md)
- [User flows](app-insights-usage-flows.md)
- [Usage overview](app-insights-usage-overview.md)