---
title: Schedule your jobs - Azure Batch
description: Use job scheduling to manage your tasks.
.
services: batch
documentationcenter: .net
author: LauraBrenner
manager: evansma
editor: ''

ms.assetid: 63d9d4f1-8521-4bbb-b95a-c4cad73692d3
ms.service: batch
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-compute
ms.date: 02/27/2017
ms.author: labrenne
ms.custom: seodec18

---

# Schedule jobs for efficiency

Scheduling Batch jobs enables you to prioritize the jobs you want to run first while taking into account tasks that have dependencies on other tasks. By scheduling your jobs you can make sure you use the least amount of resources. Nodes can be decommissioned when not needed, tasks that are dependent on other tasks are spun up just in time optimizing the workflows. 

## The benefits of scheduling jobs


## Use the portal to schedule a job

1. Sign in to [Azure portal](https://portal.azure.com/).

2. Select the Batch account you want to schedule jobs in.

3. Select **Add** to create a new job schedule and complete the **Basic form**.


![Schedule a job][1]

a. **Job schedule ID**: The unique identifier for this job schedule.

b **Display name**: The display name for the job doesn't have to be unique but has a maximum length of 1024 characters.

Schedule the job.

c. **Do not run until**: This specifies the earliest time the job will run. If you don't set this, the schedule becomes ready to run jobs immediately.

d. **Do not run after**: No jobs run after the time you set here. If you don't specify a time, then you are creating a recurring job schedule which remains active until you explicitly terminate it.

e. **Recurrence interval**: You can specify the amount of time between jobs. You can have only one job at a time scheduled, so if it is time to create a new job under a job schedule, but the previous job is still running, the Batch service will not create the new job until the previous job finishes.  

f. **Start window**: Here you specify the time interval, starting from the time the schedule indicates a job should be created, until it should be completed. If the current job doesn't complete during its window, the next job won't start.

At the bottom of the basic form, you will specify the pool on which you want the job to run. To find your pool ID information, select **Update**. 

![Specify pool][2]


g. **Pool ID**: Identify the pool you will run the job on.

h. **Job configuration task**: Select **Update** to name the Job Manager task as well as the Job preparation and release tasks, if you are using them.

i. **Priority**: Give the job a priority.

j. **Max wall clock time**: Set the maximum amount of time the job can run for. If it doesn't complete within the time frame, Batch terminates the job. If you don't set this, then there is no time limit for the job.

k. **Max task retry count**: Specify the number of times a task can be retried up to a maximum of 4 times. This is not the same as the number of retries an API call might have.

l. **When all tasks complete**: The default is no action.

m. **When a task fails**: The default is no action. A task fails if the retry count is exhausted or there was an error when starting the task. 

After you select **Save**, if you go to **Job schedules** in the left navigation, you can track the execution of the job, by selecting **Execution info**.








[1]: ./media/batch-job-schedule/addjobschedule-02.png
[2]: ./media/batch-job-schedule/addjobschedule-03.png


