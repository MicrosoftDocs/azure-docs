---
title: Track progress of Team Data Science Process projects
description: How data science group managers, team leads, and project leads can track the progress of a data science project.
author: marktab
manager: cgronlun
editor: cgronlun
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 09/26/2019
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---

# Track the progress of data science projects

Data science group managers, team leads, and project leads can track the progress of their projects, such as what work has been done, who did the work, and what work remains. 

## Azure DevOps dashboards

If you're using Azure DevOps, you can build dashboards to track the activities and work items associated with a given Agile project. For more information about dashboards, see [Dashboards, reports, and widgets](/azure/devops/report/dashboards/).

For instructions on how to create and customize dashboards and widgets in Azure DevOps, see the following quickstarts:

- [Add and manage dashboards](/azure/devops/report/dashboards/dashboards)
- [Add widgets to a dashboard](/azure/devops/report/dashboards/add-widget-to-dashboard)

## Example dashboard

Here is a simple example dashboard that tracks the sprint activities of an Agile data science project, including the number of commits to associated repositories. 

- The **countdown** tile shows the number of days that remain in the current sprint. 

- The two **code tiles** show the number of commits in the two project repositories for the past seven days. 

- **Work items for TDSP Customer Project** shows the results of a query for all work items and their status. 

- A **cumulative flow diagram** (CFD) shows the number of Closed and Active work items.

- The **burndown chart** shows work still to complete against remaining time in the sprint.

- The **burnup chart** shows completed work compared to total amount of work in the sprint.

![Dashboard](./media/track-progress/dashboard.png)

## Next steps

[Walkthroughs executing the Team Data Science Process](walkthroughs.md) lists walkthroughs that demonstrate all the steps in the process for specific scenarios, with links and thumbnail descriptions. The linked scenarios illustrate how to combine cloud and on-premises tools and services into workflows or pipelines to create intelligent applications. 
