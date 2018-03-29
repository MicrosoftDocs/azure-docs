---
title:  Azure Application Insights Usage Cohorts | Microsoft docs
description: Analyze how different sets or users, sessions, events, or operations that have something in common
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: article
ms.date: 01/25/2018
ms.author: mbullwin ; daviste
---

# Application Insights Cohorts

![Cohorts blade](.\media\app-insights-usage-cohorts\01.png)

## What’s a cohort? What problems can they solve for me?

* A cohort is a set of users, sessions, events, or operations that have something in common.
* This commonality is defined by an Analytics query.
* For example, you might define a cohort of users that have all tried a new feature in your app. This cohort is a kind of bookmark so it’s easy for you to filter to this group of users in the future from the App Insights tools.
* If you find yourself re-entering the same filters and time ranges over and over, cohorts are a great solution. And since they can be shared within an App Insights resource, your whole team can benefit.

> [!NOTE]
> Once created, cohorts are available from the Users, Sessions, Events, and User Flows tools.

## Example: Engaged users

* Say your team defines an engaged user as anyone who uses your app five or more times in a given month. Let’s define a cohort of these engaged users.
* Open the Cohorts tool
* Click “Template Gallery” tab. Here you’ll find a collection of templates for various cohorts.
* Choose “Engaged Users – by Days Used”
* There are three parameters for this cohort:
    * “Activites”: which lets you choose which events and page views should count as “usage”
    * “Period”: the definition of a month
    * “UsedAtleastCustom:” the number of times they need to use within a period to count as an engaged user.
* Change UsedAtleastCustom to “5+ days” and leave Period to the default of 28 days
* Now this cohort represents all user IDs that were sent with any custom event or page view on five separate days in the past 28 days.
* Click Save
* Give your cohort a name, like “Engaged Users (5+ Days)” and save it to “My reports” or “Shared reports” depending if you want other people with access to this App Insights resource to see this cohort.
* Click “Back to Gallery”
* You’ll see your new cohort appear

### What can you do with this cohort?

* Open the Users tool
* In the “Show” dropdown, choose the cohort you just created under “Users who belong to…”
* Now the Users tool is filtered to this cohort of users.
* A few important things to notice:
    * This is a filter you couldn’t have applied through normal filters…it’s more advanced date logic
    * You can further filter this cohort using the normal filters in the Users tool. So while the cohort is defined on 28 day windows, you can still adjust the time range in the Users tool to be 30, 60, or 90 days. This lets you ask more sophisticated questions like, “For people who were engaged in the past 28 days, how did those same people behave over the past 60 days?” etc. that would otherwise be impossible to express through the query builder, otherwise.

## Example: TBD events cohort
* You can make cohorts of events, too. Let’s define a cohort of the events and page views, then see how to use them from the other tools. This might be useful to define a set of events that your team considers “active usage,” or to define a set of events related to a certain new feature
* Open the Cohorts tool
* Click “Template Gallery” tab. Here you’ll find a collection of templates for various cohorts.
* Choose “Events Picker”
* In the “Activities” dropdown, select the events you’d like to be in the cohort
* Save the cohort and give it a name

### What can you do with this cohort?
* Open the Users tool
* In the “Who used” dropdown, select the cohort you just created under the “Cohorts” header.
* Now the Users tool is filtered to users who used this set of events

## Example: TBD active users where you modify query
* Previous two cohorts we defined using dropdowns. But we can also define cohorts with Analytics queries for total flexibility.
* Let’s see how by creating a cohort of users from the United Kingdom.
* Open the Cohorts tool
* Click “Template Gallery” tab.
* Choose “Blank Users cohort”

![Blank Users Cohort](.\media\app-insights-usage-cohorts\01.png)

* Three sections:
    * A Markdown text section where you can describe the cohort in more detail for others on your team
    * A parameters section you can use to make your own parameters, like the “Activities” and other dropdowns from the previous two examples. 
    * A query section that you use to define the cohort using an Analytics query.

> [!NOTE]
> If you don’t see the query, try resizing the section to make it taller and reveal the query.

* In the query section, you write an Analytics query that selects the certain set of rows that describe the cohort you want to define. The Cohorts tool then implicitly adds a “| summarize by user_Id” clause to the query. This is previewed below the query in a table so you can make sure your query is returning results.
* Copy-paste the following into the query editor:

```KQL
union customEvents, pageViews
| where client_CountryOrRegion == "United Kingdom"
```

* Click “Run Query”. You should see user IDs appear in the table. If not, change to a country from which your application has users.
* Save and name this cohort.

## Frequently asked questions

_“I’ve defined a cohort of users from a certain country. When I compare this cohort in the Users tool to just setting a filter on that country in the Users tool, I see different results. Why?”_

Cohorts and filters are different. Suppose you have a cohort of users from the United Kingdom (defined like the above example) and you compare its results to setting the filter “Country or region = United Kingdom.” 
* The cohort version will show all events from users who have sent at least one event from the United Kingdom in the current time range. If you split by country or region, you’ll likely see many countries and regions.
* The filters version will only show events from the United Kingdom. If you split by country or region, you’ll only see the United Kingdom.

## Learn more
- [Analytics query language](https://go.microsoft.com/fwlink/?linkid=856587)
- [Users, Sessions, Events](app-insights-usage-segmentation.md)
- [User Flows](app-insights-usage-flows.md)
- [Usage overview](app-insights-usage-overview)
