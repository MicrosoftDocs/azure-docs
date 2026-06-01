---
title: Scheduling Time for Cache Maintenance
description: Learn how to configure scheduled maintenance windows for Azure Managed Redis to control when updates and patches are applied to minimize application disruptions.
#customer intent: As a developer, I want to understand how to prepare my application for maintenance so that I can ensure connectivity resilience during updates.
ms.date: 11/17/2025
ms.topic: concept-article
ai-usage: ai-assisted
---

# Azure Managed Redis scheduled maintenance (preview)

Azure Managed Redis scheduled maintenance windows allow you to define specific time periods when maintenance activities can occur on your Redis instances. You control when Redis server updates and operating system patches are applied, minimizing unexpected disruptions to your applications.

Azure Managed Redis automatically handles infrastructure maintenance, including security patches, Redis version updates, and operating system updates. Without scheduled maintenance windows, these updates occur at Azure's discretion. When you configure scheduled maintenance windows, you control this timing.

Some maintenance activities are excluded. For more information, see [Excluded maintenance activities](#excluded-maintenance-activities).

This feature is currently in preview and provides a balance between necessary system updates and application availability requirements.

## Prerequisites

- An existing Azure Managed Redis instance
- Knowledge of your application's usage patterns and low-traffic periods
- Familiarity with Azure portal or Azure CLI for configuration management

## Schedule a maintenance window

1. [Browse to your cache](configure.md#configure-azure-managed-redis-settings) in the Azure portal and select **Maintenance (Preview)** from the Resource menu.

1. In the working pane, turn on **Custom schedule**.

1. Configure your maintenance windows by setting the duration in hours and minutes for each day of the week.

1. Set the time window for each maintenance period and select which days you want to include or exclude from maintenance.

## Maintenance window requirements and limitations

Scheduled maintenance windows have specific requirements and limitations that define how you can configure maintenance timing.

### Duration requirements

- Minimum of 4 hours per individual window
- At least two windows per week required
- Total of 18 hours minimum per week across all windows

### Time constraints

- All times specified in UTC timezone only
- Start times must be at the top of the hour (no minute-level precision)
- Granularity limited to hour or hour-and-minute intervals

### Scheduling flexibility

- Select specific days of the week for maintenance
- Define different start times for different days
- Modify configurations at any time with immediate effect

## Types of maintenance activities

Scheduled maintenance windows include specific types of updates while excluding others. There's a clear boundary between included and excluded activities

### Included maintenance activities

- Redis server software updates and patches
- Guest operating system updates on VMs hosting Redis instances
- Minor Redis version upgrades as part of regular maintenance cycles

### Excluded maintenance activities

- Host operating system updates on underlying Azure infrastructure
- Azure networking component updates
- Critical security patches that might occur outside windows for security compliance
- Major Redis version upgrade, which you manage separately with 90-day deferral options

## Maintenance effects and behavior

During scheduled maintenance windows, your Redis instances undergo specific processes that can affect connectivity and performance.

### Expected effects and behaviors

- Brief connectivity interruptions due to failover operations
- Temporary increase in server CPU and memory load during data replication
- Redis instances remain available but can experience connection blips
- Updates applied on best-effort basis within your specified time windows

### Failover process

Redis instances use failover mechanisms during maintenance to maintain service availability. Data replication between nodes occurs during this process, which temporarily increases resource utilization. Applications should implement connection retry logic and resilience patterns to handle these brief interruptions gracefully.

For more information, see [Failover and patching for Azure Managed Redis](failover.md).

## Configuration flexibility

The scheduled maintenance feature provides ongoing management capabilities that adapt to changing operational requirements.

### Immediate changes

- Maintenance window modifications take effect immediately for future maintenance cycles
- No waiting period or approval process required for schedule updates
- Changes don't affect maintenance already in progress

## Monitoring and visibility

Azure provides multiple ways to track maintenance activities and their effect on your Redis instances.

### Activity tracking

- Past maintenance activities appear in Azure Activity Logs
- Ongoing maintenance operations visible through monitoring tools
- Maintenance events logged with timestamps and details

### Preparation recommendations

Applications should implement connection resilience patterns including retry logic, circuit breakers, and graceful degradation to handle brief connectivity interruptions during maintenance windows.

## Related content

- [Failover and patching for Azure Cache for Redis](failover.md)
- [Connection resilience best practices](best-practices-connection.md)
