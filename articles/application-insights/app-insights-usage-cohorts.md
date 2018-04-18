---
title:  Azure Application Insights Usage Cohorts | Microsoft docs
description: Analyze different sets or users, sessions, events, or operations that have something in common
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: article
ms.date: 04/10/2018
ms.author: mbullwin ; daviste
---

# Application Insights Cohorts

A cohort is a set of users, sessions, events, or operations that have something in common. In Azure Application Insights cohorts are defined by an Analytics query. If you find yourself analyzing a specific set of users or events repeatedly, cohorts can give you even more flexibility to express exactly the set you’re interested in.

![Cohorts pane](.\media\app-insights-usage-cohorts\001.png)

## Cohorts versus basic filters

While cohorts are used in similar ways as filters, the fact that a cohort's definition is built from custom Analytics queries allows them to be far more adaptable and complex. Unlike filters, you can save cohorts so other members of your team can reuse them.

You might define a cohort of users that have all tried a new feature in your app. With this cohort saved in your Application Insights resource, it makes analyzing this specific group of users in the future one click away.

> [!NOTE]
> Once created, cohorts are available from the Users, Sessions, Events, and User Flows tools.

## Example: engaged users

Your team defines an engaged user as anyone who uses your app five or more times in a given month. Let’s define a cohort of these engaged users.

1. Open the **Cohorts** tool.

2. Click **Template Gallery** tab. Here you’ll find a collection of templates for various cohorts.

3. Choose **Engaged Users** – by Days Used”.

    There are three parameters for this cohort:
      * **Activities** that let you choose which events and page views should count as “usage”.
      * **Period** the definition of a month.
      * **UsedAtleastCustom** the number of times they need to use something within a period to count as an engaged user.

4. Change **UsedAtleastCustom** to “5+ days” and leave **Period** to the default of 28 days.

    ![Image](.\media\app-insights-usage-cohorts\003.png)

    Now this cohort represents all user IDs that were sent with any custom event or page view on five separate days in the past 28 days.

5. Click **Save**.

   > [!TIP]
   >  Give your cohort a name, like “Engaged Users (5+ Days)” and save it to “My reports” or “Shared reports” depending on if you want other people with access to this Appication Insights resource to see this cohort.

6. Click **Back to Gallery**.

### What can you do with this cohort?

Open the **Users** tool > In the **Show** dropdown > Choose the cohort you created under **Users who belong to…**

Now the Users tool is filtered to this cohort of users:

![Users pane filtered to a particular cohort](.\media\app-insights-usage-cohorts\004.png)

A few important things to notice:
   * This is a set you couldn’t have created through normal filters. The date logic is more advanced.
   * You can further filter this cohort using the normal filters in the Users tool. So while the cohort is defined on 28-day windows, you can still adjust the time range in the Users tool to be 30, 60, or 90 days. 

This lets you ask more sophisticated questions like: _for people who were engaged in the past 28 days, how did those same people behave over the past 60 days?_ that would otherwise be impossible to express through the query builder.

## Example: events cohort

You can also make cohorts of events. Let’s define a cohort of the events and page views, then see how to use them from the other tools. This might be useful to define a set of events that your team considers _active usage_, or to define a set of events related to a certain new feature.

1. Open the **Cohorts** tool.

2. Click the **Template Gallery** tab. Here you’ll find a collection of templates for various cohorts.

3. Choose **Events Picker**.

    ![Screenshot of Events picker](.\media\app-insights-usage-cohorts\006.png)

4. In the **Activities** dropdown, select the events you’d like to be in the cohort

5. Save the cohort and give it a name.

## Example: active users where you modify query

The previous two cohorts were defined using dropdowns. But we can also define cohorts with Analytics queries for total flexibility. Let’s see how by creating a cohort of users from the United Kingdom.

![Animated image walking through use of Cohorts tool](.\media\app-insights-usage-cohorts\cohorts0001.gif)

1. Open the **Cohorts** tool > Click **Template Gallery** tab > Choose **Blank Users cohort**.

    ![Blank Users Cohort](.\media\app-insights-usage-cohorts\001.png)

    There are three sections:
       * A Markdown text section where you can describe the cohort in more detail for others on your team.

       * A parameters section you can use to make your own parameters, like the **Activities** and other dropdowns from the previous two examples.

       * A query section that you use to define the cohort using an Analytics query.

    In the query section, you [write an Analytics query](https://docs.loganalytics.io/index) that selects the certain set of rows that describe the cohort you want to define. The Cohorts tool then implicitly adds a “| summarize by user_Id” clause to the query. This is previewed below the query in a table so you can make sure your query is returning results.

    > [!NOTE]
    > If you don’t see the query, try resizing the section to make it taller and reveal the query. The animated .gif at the beginning of this section illustrates the resizing behavior.

2. Copy-paste the following into the query editor:

    ```KQL
    union customEvents, pageViews
    | where client_CountryOrRegion == "United Kingdom"
    ```

3. Click **Run Query**. You should see user IDs appear in the table. If not, change to a country where your application has users.

4. Save and name the cohort.

## Frequently asked questions

_I’ve defined a cohort of users from a certain country. When I compare this cohort in the Users tool to just setting a filter on that country in the Users tool, I see different results. Why?_

Cohorts and filters are different. Suppose you have a cohort of users from the United Kingdom (defined like the above example) and you compare its results to setting the filter “Country or region = United Kingdom.”

* The cohort version will show all events from users who have sent at least one event from the United Kingdom in the current time range. If you split by country or region, you’ll likely see many countries and regions.
* The filters version will only show events from the United Kingdom. Whereas if you split by country or region, you’ll only see the United Kingdom.

## Learn more
- [Analytics query language](https://go.microsoft.com/fwlink/?linkid=856587)
- [Users, Sessions, Events](app-insights-usage-segmentation.md)
- [User Flows](app-insights-usage-flows.md)
- [Usage overview](app-insights-usage-overview.md)