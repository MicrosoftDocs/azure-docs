---
title: Enable/Disable zone redundant high availability - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: This article describes how to enable or disable zone redundant high availability in Azure Database for PostgreSQL through the Azure portal.
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: how-to
ms.date: 08/24/2020
---
# Enable or disable zone redundant high availability configuration

This article describes how you can enable or disable zone redundant high
availability configuration in your Azure for PostgreSQL flexible server.

Zone redundant high availability provisions a physically separate
standby replica in a different zone. Refer to this \[Ha concepts
documentation for more details on benefits of deploying flexible servers
in a high availability configuration. You may choose to enable high
availability at the time of flexible server creation \[how-to-DB create
documentation\]. This page provides guidelines how you can enable or
disable high availability. This operation does not change your other
settings including VNET configuration, firewall settings, and backup
retention. Similarly, enabling and disabling of high availability is an
online operation and does not impact your application connectivity and
operations.

## Pre-requisites

To complete this how-to guide, you need:

-   To enable or disable high availability, you must have a flexible server.

-   Zone redundant deployment capability is available only in regions
    where multiple zones are supported. In regions where only one
    availability zone is available, high available option will not be
    available.

## Enable high availability during server creation

Follow these steps to deploy high availability while creating your
flexible server.

1.  In the [Azure portal](https://portal.azure.com/), choose
    Flexible Server and click create.

2.  Provide your **Subscription** and **Resource group** details.

3.  Under Server details, provide your **server name** and **region**.

4.  Choose your **availability zone**. This is useful if you want to
    collocate your application in the same availability zone as the
    database to reduce latency. Choose **No Preference** if you want the
    flexible server to deploy on any availability zone.

5.  Click the checkbox for **Zone redundant high availability** in the
    Availability option.

6.  Choose the **PostgreSQL version** from the dropdown.

7.  If you want to change the default compute and storage, click
    **Configure server**.

8.  If zone redundant high availability option is checked, the burstable
    compute tier will not be available to choose. You can choose either
    **General purpose** or **Memory Optimized** compute tiers.

9.  Select the **compute size** for your choice from the dropdown.

10. Select **storage size** in GiB using the sliding bar.

11. Select the **backup retention period** between 7 days and 35 days.

## Enable high availability post server creation

Follow these steps to enable high availability for your existing
flexible server.

1.  In the [Azure portal](https://portal.azure.com/), select your
    existing PostgreSQL flexible server.

2.  On the flexible server page, click **High Availability** from the
    front panel to open high availability page.

3.  Click on the **zone redundant high availability** checkbox to enable
    the option.

4.  Click **Save** to save the change.

5.  A confirmation dialog will show that states that by enabling high
    availability, your cost will increase due to additional server and
    storage deployment.

6.  Click **Enable HA** button to enable the high availability.

7.  A notification will show up stating the high availability deployment
    is in progress.

## Disable high availability

Follow these steps to disable high availability for your flexible server
that is already configured with zone redundancy.

1.  In the [Azure portal](https://portal.azure.com/), select your
    existing Azure Database for PostgreSQL flexible server.

2.  On the flexible server page, click **High Availability** from the
    front panel to open high availability page.

3.  Click on the zone redundant high availability checkbox to disable
    the option.

4.  Click **Save** to save the change.

5.  A confirmation dialog will be shown where you can confirm disabling
    HA.

6.  Click **Disable HA** button to disable the high availability.

7.  A notification will show up decommissioning of the high availability
    deployment is in progress.

## Next steps

Learn about \<?\>
