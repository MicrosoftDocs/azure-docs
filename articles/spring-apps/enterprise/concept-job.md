---
title:  "Job in Azure Spring Apps"
description: Explain the Job concept in Azure Spring Apps.
author: KarlErickson
ms.author: ninpan
ms.service: spring-apps
ms.topic: conceptual
ms.date: 05/12/2024
ms.custom: devx-track-java, devx-track-extended-java
---

# Job in Azure Spring Apps (Preview)

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

*Job* is a key concept in the resource model of Azure Spring Apps. Comparing with *App* in Azure Spring Apps, They are both resources under Service.

*Job* enables customers to run workloads which completes in finite duration, while the workload in *App* runs continuously. Examples of apps include web apps and background services that process input continuously, while examples of jobs include batch processes and on demand tasks.

## Job execution

Each run of the job is a job execution. The job execution carries the properties of the corresponding job and serves as a dynamic instance. A common lifecycle of a job execution is from `pending`, `running` to termination status `completed` or `failed` depeding on whether the execution finishes successfully or not.

## Configuration

Job defines the default configuration that is used for each job execution, such as the source of user application and the trigger configuration.

### Trigger configuration

Job is only supported to be triggered manually for public preview. More trigger types will be supported later.

- **Parallelism**: The count of instances of the job which executes in the same time. The default value is 1. For parallel job, you can get the index of each instance through `JOB_COMPLETION_INDEX` environment variable.
- **Retry limit**: The maximum number of a job attempts to execution after encountering a failure or error. The default value is 0 which means the job does not retry if it fails.
- **Timeout**: The maximum time in seconds when the job failed. You can leave it unset or set the value 0 which means the job has no timeout.

### Arguments and environment variables
You can specify arguments and environment variables both in Job level and execution level. The value of arguments specified for the execution override that of the job.

The environment variables consist of key and value. You can specify the value in secret environment variable for secret values. The environment variables specified in job level are default values for each execution, the environment variables specified in execution level has higher priority. You can specify part of those environment variables when start an execution to override the value in job level.

### Resource request
CPU and memory can also be specified both in Job level and execution level. The value of cpu and memory specified for the execution override that of the job.

You can add `--cpu` and `--memory` in `az spring job create` or `az spring job update` command to specify the default value of the job, or specify them in `az spring job start` command which only applies for this execution.