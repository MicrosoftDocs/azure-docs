---
title: Job in Azure Spring Apps
description: Learn more about the Job concept in Azure Spring Apps.
author: KarlErickson
ms.author: ninpan
ms.service: azure-spring-apps
ms.topic: conceptual
ms.date: 06/06/2024
ms.custom: devx-track-java, devx-track-extended-java
---

# Job in Azure Spring Apps (Preview)

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Java ✅ C#

**This article applies to:** ❎ Basic/Standard ✅ Enterprise

*Job* is a key concept in the resource model of Azure Spring Apps. Like *App* in Azure Spring Apps, both are considered resources managed within the service.

An App runs a workload continuously, whereas a Job enables customers to run workloads that complete within a finite duration. Examples of apps include web apps and background services that process input continuously. Examples of jobs include batch processes and on-demand tasks.

Spring developers who write jobs probably choose the Spring Batch framework or Spring Cloud Task. While Spring Batch excels in handling large-scale batch processing tasks, Spring Cloud Task is specialized for managing short-lived tasks with minimal overhead. You can run both types efficiently in Azure Spring Apps jobs to meet diverse requirements.

## Job execution

A *job execution* refers to the process of running a particular task or set of tasks defined within a job. It encompasses the entire lifecycle of executing those tasks, including initializing, processing, and completing the job according to its specifications.

A common lifecycle of a job execution in Azure Spring Apps is from `pending` and `running` to a termination status of `completed` or `failed`, depending on whether the execution finishes successfully.

Each time the job is executed, it adopts its preset configuration from the job, with certain aspects allowing for customization to accommodate different runs.

In nonparallel job execution, only one instance runs at a time. In parallel execution, multiple instances can run simultaneously.

## Configuration

The job establishes the default configuration used for each execution, encompassing elements like the user application source and trigger configuration. Each execution of the job inherits the configuration, enabling certain parameters to be overridden with new values for individual executions.

The following table shows the configuration in job level or job execution level:

| Property name                | Scope         | Notes                                                                                                                                                                                                                                                                                                                       |
|------------------------------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Trigger type                 | Job           | The manual trigger for public preview. More trigger types are planned for later.                                                                                                                                                                                                                                            |
| Parallelism                  | Job           | The count of instances of the job that executes in the same time. The default value is 1. For parallel jobs, you can get the index of each instance through the `JOB_COMPLETION_INDEX` environment variable.                                                                                                                |
| Retry limit                  | Job           | The maximum number of times a job attempts execution after encountering a failure or error. The default value is 0, which means the job doesn't retry if it fails.                                                                                                                                                          |
| Timeout                      | Job           | The maximum number of seconds to wait for a job to complete before its status is set to `failed`. You can leave it unset or set the value to 0, which means the job has no timeout.                                                                                                                                         |
| Arguments                    | Job/Execution | The value of arguments specified for the execution override of the job.                                                                                                                                                                                                                                                     |
| Environment variables        | Job/Execution | Variables in key-value pairs format. The environment variables specified at the job level are default values for each execution. The environment variables specified at the execution level have higher priority. You can specify environment variables when you start an execution to override the value at the job level. |
| Secret environment variables | Job/Execution | Variables that contain credentials where the secret values are encrypted.                                                                                                                                                                                                                                                   |
| CPU                          | Job/Execution | The value specified for the execution overrides the value specified for the job.                                                                                                                                                                                                                                            |
| Memory                       | Job/Execution | The value specified for the execution overrides the value specified for the job.                                                                                                                                                                                                                                            |

The configuration at the job level applies when creating or updating the job resource. The configuration at the job execution level applies when starting a job execution.

## Next step

[How to manage and use jobs in the Azure Spring Apps Enterprise plan](how-to-manage-job.md)
