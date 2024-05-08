---
title: Use 
titleSuffix: Azure Spring Apps Enterprise plan
description: Learn how to manage job with the Azure Spring Apps.
author: KarlErickson
ms.author: ninpan
ms.service: spring-apps
ms.topic: how-to
ms.date: 05/12/2024
ms.custom: devx-track-java, devx-track-extended-java
---

# How to manage and use jobs in the Azure Spring Apps Enterprise plan

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article shows you how to manage the lifecycle of the job and run it in the Azure Spring Apps Enterprise plan.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise plan instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).

## Create and deploy a job

# [Azure CLI](#tab/azure-cli)

To create a job, run the command `az spring job create` to create job and deploy the job with source code or artifacts of the application.

```
az spring job create --name <job-name>
az spring job deploy --artifact-path <artifact-path> --name <job-name>
```

# [Azure portal](#tab/azure-portal)

To create a job using the Azure portal, follow the steps:

1. Go to your Azure Spring Apps instance. From the navigation pane, select *Jobs* in *Settings*.
1. Select *Create Job* in the *Jobs* blade.
1. Input the job name and other configurations of the job, click *Create* button to create the job.
1. After the job is created successfully, select *Deploy Job*. Copy the Azure CLI commands in the panel and run the commands in terminal to deploy the job. 

---

For public preview, at most ten jobs can be created per service instance.

## Start and cancel a job execution

# [Azure CLI](#tab/azure-cli)

To start a job execution with Azure CLI, run the following command.

```
az spring job start --name <job-name>
```

If the command runs successfully, the name of the job execution is returned. With `--wait-until-finished true` parameter, the command does not return until the job execution finishes.

To query the status of the job execution, use the command, replace the `<execution-name>` with the name returned from start command

```
az spring job execution show --job <job-name> --name <execution-name>
```

To cancel those job executions which are running, run the following command.

```
az spring job execution cancel --job <job-name> --name <execution-name>
```

# [Azure portal](#tab/azure-portal)

1. Open the overview page of the job by selecting the job name in the *Jobs* blade
1. Select *Run* to open settings panel of the job execution
1. Input specific arguments and add environment variables as wanted for this execution, click *Run* button to run the execution.
1. In the *Executions* blade of *Jobs* overview page, find the latest job execution and select *View execution detail* to see the configuration both in job level and execution level

To rerun the job execution, select *Rerun Job* to trigger a new job execution with the same configuration

To cancel the running job execution, select *Cancel Job*.

---

## Query job execution history

# [Azure CLI](#tab/azure-cli)

To show the execution history, run the command:

```
az spring job execution list --job <job-name>
```

# [Azure portal](#tab/azure-portal)

1. In the *Executions* blade of *Jobs* overview page, latest job executions are listed
1. Select *Rerun Job* to trigger a new job execution with the same configuration
1. Select *Cancel Job* to cancel a running job execution
1. Select *View execution detail* to see the configuration both in job level and execution level

---

For public preview, the latest ten job execution history per job which are completed or failed are remained.


## Query job execution logs

For history job executions, you can query the logs in the log analytics using the query in Azure Portal:

```
AppPlatformLogsforSpring
| where AppName == '<job-name>' and InstanceName startswith '<execution-name>'
| order by TimeGenerated asc
```

The step to setup log analytics workspace can be found

For real time log, use the following command:

```
az spring job logs --name <job-name> --execution <execution-name>
```

If there are multiple instances for the job execution, specify `--instance <instance-name>` to view logs of one instance.

## Integrate with managed components

For public preview, jobs are supported to integrate with Spring Cloud Config Server for configuration management and Tanzu Service Registry for service discovery.

### Spring Cloud Config

With Spring Cloud Config, external properties for jobs can be managed in a central place. After configuring the Spring Cloud Config with the right settings, bind the job to use it.

# [Azure CLI](#tab/azure-cli)

Bind the job to Spring Cloud Config using the command:

```
az spring job create --bind-config-server true
```

# [Azure portal](#tab/azure-portal)

1. Go to your Azure Spring Apps instance. From the navigation pane, select *Spring Cloud Config Server* in *Managed components*.
1. If it's not enabled, select *Manage* to enable it.
1. In the *Settings* tab, configure Spring Cloud Config Server with the right git repository. Click *Validate* and *Apply* to make it take effect.
1. In *Job binding* tab, select *Bind job* and choose the job to apply.
1. After binding successfully, the job name shows in the list below.
1. Run the job

---

### Tanzu Service registry

To make the job discover the other apps in the same Azure Spring Apps service, you can first create an app that uses Service Registry, then create job and bind it to Service Registry.

# [Azure CLI](#tab/azure-cli)

using the following Azure CLI command:

```
az spring job create --bind-service-registry true
```

# [Azure portal](#tab/azure-portal)

1. Go to your Azure Spring Apps instance. From the navigation pane, select *Service Registry* in *Managed components*.
1. If it's not enabled, select *Manage* to enable it.
1. In *Job binding* tab, select *Bind job* and choose the job to apply.
1. After binding successfully, the job name shows in the list below.
1. Run the job

---

When running the job execution, you can access the endpoint of registered app through Service Registry.
