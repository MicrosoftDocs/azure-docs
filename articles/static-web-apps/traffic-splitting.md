---
title: Traffic Splitting in Azure Static Web Apps (preview)
description: Learn to divert traffic from one branch to another.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  how-to
ms.date: 07/10/2023
ms.author: cshoe
---

# Traffic Splitting in Azure Static Web Apps (preview)

Traffic splitting allows you to divert a percentage of traffic to different [branch environments](./branch-environments.md).

Traffic splitting is only available on the [Standard hosting plan](plans.md).

## Split traffic

Before you can split traffic between branches, you first need to have open pull requests to create separate environments.

To split traffic among different environments, use the following steps:

1. Open your static web app in the Azure portal.

1. From the *Settings* section, select **Environments**.

1. Select the **Traffic splitting** tab.

1. Select the **Add** button to create a new row in the traffic mapping table.

1. From the dropdown, select name of the pull request you want to target.

1. Enter the percentage amount of traffic you want to allocate among the different environments.

    Adjust the values in each of the input boxes in the *Traffic* column so the total equals 100%.

1. Select **Save** to commit your changes.

## Disable traffic splitting

To disable traffic splitting, select the **Traffic splitting** to open the settings window.

Remove all nonproduction environments from the list and save your changes.

## Next steps

> [!div class="nextstepaction"]
> [Use preview environments](preview-environments.md)
