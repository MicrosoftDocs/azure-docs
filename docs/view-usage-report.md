---
title: View Usage report
description: Analyze your usage performance for your Office Add-in after acquired from Microsoft AppSource.
localization_priority: Normal
ms.date: 10/06/2020
---

# View the Usage report in the dashboard

The [Usage report](https://partner.microsoft.com/dashboard/analytics/office/usage) in the Partner Center dashboard lets you see how many customers use your Office Add-in after acquired from Microsoft AppSource.

In this report, a usage means a customer has successfully launched an Add-in on any of the four Office Apps (Word, Excel, PowerPoint, Outlook) and on any of the five platforms (Win32, Mac, Web, iOS, Android). If a customer launches an Add-in on multiple platforms, it will be counted only once.

The SLA for Acquisitions data is currently four days.

## Multiple Add-ins 

As a provider, if you have multiple Add-ins listed on Microsoft AppSource then you can pick an Add-in from a drop-down by clicking on 2-directional arrow icon :::image type="content" source="images/usage-bidirec-arrow.png" alt-text="Usage Bidirectional Arrow "::: near top-left side of a page. At a time, usage of only one Add-in will be displayed on a page.

## Time Period

Near the top of the page, you can select the time period for which you want to see the usage. The default selection is 30D (30 days), but you can choose to show data for two or three months. 

:::image type="content" source="images/usage-timeline.png" alt-text="Usage Timeline ":::

## Filters

Near the top-right side of a page, you can apply different Filters to filter all of the data on this page by Market / Office App / Platform. 

- **Market**: The default filter is All markets, but you can limit the data by selecting a particular region. 
- **Office Apps**: The default filter is All Office Apps, but you can limit the data by selecting a particular App.
- **Platform**: The default filter is All platforms, but you can limit the data by selecting a particular platform.

> [!Note]
> Currently there is no provision of choosing multiple selections

## Usage

The Usage chart (Devices tab) shows the number of daily active & new users (where a customer has successfully launched your app) over the selected period of time.

The Usage chart (Retention tab) shows DAU/MAU ratio, which is basically no. of distinct users launched an Add-in on a given day / no. of distinct users launched an Add-in within past 30 days from that day.

## Cohort Active Usage (90D)

The Cohort Active Usage (90D) chart shows how group of users use your App week over week. 

Week starts from Monday and ends on Sunday. 

So let’s say, for the week of June 1 2020, the “Week 1” usage is 5000, meaning 5000 distinct users launched an Add-in successfully in that week. For the same week, if the “Week 2” usage is 20%, that means, 1000 out of those 5000 users launched the same Add-in successfully in the week of June 8. 

Date filter doesn’t apply to this chart and it always shows cohort usage for 90 days. 

## Device sessions

The Device sessions chart shows the usage over the selected period of time for each market in which your App is launched successfully.

You can view this data in a visual Map form, or toggle the setting to view it in Table form. Table form will show five markets at a time, sorted either alphabetically or by highest/lowest number of usages. You can also download the data to view info for all markets together.

> [!NOTE]
> Devices with unknown geographic locations are not recorded. Geographic locations for Outlook Web App are not available at this time. 

## See also

- [View the acquisition report in the dashboard](https://docs.microsoft.com/office/dev/store/view-acquisitions-report#acquisitions)