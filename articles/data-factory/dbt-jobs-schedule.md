title: dbt Jobs in Microsoft Fabric – Schedule dbt job
description: Learn how to create and configure dbt Jobs in Microsoft Fabric.
author: vasquezd21
ms.author: vasquezd21
ms.topic: how-to
ms.date: 11/10/2025
---

# How to schedule a dbt job

1. **Open your dbt job** in Fabric.
2. Click the **Schedule** tab in the top panel.
3. Click **Add schedule** to configure a new scheduled run.

**Scheduling options:**
- **Repeat:** Choose how often to run the job (e.g., by the minute, hourly, daily, weekly).
- **Interval:** Set the frequency (e.g., every 15 minutes).
- **Start date and time:** When the schedule should begin.
- **End date and time:** (Optional) When the schedule should stop.
- **Time zone:** Select your preferred time zone for scheduling.

4. Click **Save** to activate the schedule.

  <img src="images\dbtschedule.png" width="700px" /> 


#### Why use scheduling?

- **Automate model refreshes:** Keep your analytics up to date.
- **Support CI/CD workflows:** Schedule builds and tests after data loads.

- **Reduce manual effort:** dbt jobs run automatically at your chosen intervals.

