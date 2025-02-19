---
title: Manage and Use Jobs in the Azure Spring Apps Enterprise Plan
description: Learn how to manage jobs with the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: ninpan
ms.service: azure-spring-apps
ms.topic: how-to
ms.date: 06/06/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
---

# Manage and use jobs in the Azure Spring Apps Enterprise plan

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ❎ Basic/Standard ✅ Enterprise

This article shows you how to manage the lifecycle of a job and run it in the Azure Spring Apps Enterprise plan.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise plan instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).

## Create and deploy a job

### [Azure CLI](#tab/azure-cli)

Use the following commands to create and deploy a job:

```azurecli
az spring job create --name <job-name>
az spring job deploy \
    --name <job-name> \
    --artifact-path <artifact-path>
```

### [Azure portal](#tab/azure-portal)

Use the following steps to create and deploy a job:

1. Open your Azure Spring Apps service instance.

1. In the navigation pane, select **Settings**, and then select **Jobs**.

1. On the **Jobs** page, select **Create Job**.

1. Add a name for the job and select other configurations. Select **Create** and wait until the job is created successfully.

1. Select **Deploy Job**. A panel opens.

1. To deploy the job, copy the Azure CLI commands on the panel, then run the commands on the command line.

---

For the public preview, you can create a maximum of 10 jobs per service instance.

## Start and cancel a job execution

### [Azure CLI](#tab/azure-cli)

Use the following command to start a job execution:

```azurecli
az spring job start --name <job-name>
```

If the command runs successfully, it returns the name of the job execution. With the `--wait-until-finished true` parameter, the command doesn't return until the job execution finishes.

To query the status of the job execution, use the following command. Replace the `<execution-name>` with the name returned from the start command.

```azurecli
az spring job execution show \
    --job <job-name> \
    --name <execution-name>
```

To cancel the job executions that are running, use the following command:

```azurecli
az spring job execution cancel \
    --job <job-name> \
    --name <execution-name>
```

### [Azure portal](#tab/azure-portal)

Use the following steps to start or cancel a job execution:

1. On the **Jobs** page, select the job name to open the overview page of the job.

1. Select **Run** to open the settings panel of the job execution.

1. Add specific arguments and environment variables as needed for this execution. Select **Run** to run the execution.

1. To rerun the job execution, select **Rerun Job** to trigger a new job execution with the same configuration.

1. To cancel the running job execution, select **Cancel Job**.

---

## Query job execution history

### [Azure CLI](#tab/azure-cli)

To show the execution history, use the following command:

```azurecli
az spring job execution list --job <job-name>
```

### [Azure portal](#tab/azure-portal)

1. Go to the **Executions** section of the **Jobs** overview page.

1. Find the latest job execution and select **View execution detail** to see the configuration both at the job level and the execution level.

---

For the public preview, the latest 10 completed or failed job execution records per job are retained in history.

## Query job execution logs

To get the history of job executions in the Azure portal, use the following Log Analytics query:

```kusto
AppPlatformLogsforSpring
| where AppName == '<job-name>' and InstanceName startswith '<execution-name>'
| order by TimeGenerated asc
```

For more information, see [Quickstart: Set up a Log Analytics workspace](../basic-standard/quickstart-setup-log-analytics.md).

For real time logs, use the following command on the command line:

```azurecli
az spring job logs \
    --name <job-name> \
    --execution <execution-name>
```

If there are multiple instances for the job execution, specify `--instance <instance-name>` to view the logs for one instance only.

## Rerun job execution

### [Azure CLI](#tab/azure-cli)

Use the following command to trigger a new job execution:

```azurecli
az spring job start \
    --name <job-name> \
    --args <argument-value> \
    --envs <key=value>
```

### [Azure portal](#tab/azure-portal)

Use the following steps to rerun a job execution:

1. Open the **Executions** section of the **Jobs** overview page.

1. Select **Rerun** to trigger a new job execution with the same configuration as the previous one.

A new job execution is shown in the **Executions** section.

---

## Integrate with managed components

For the public preview, jobs can integrate seamlessly with Spring Cloud Config Server for efficient configuration management and Tanzu Service Registry for service discovery.

### Integrate with Spring Cloud Config Server

With Spring Cloud Config Server, you can manage the configurations or properties required by a job in Git repositories, and then load them into the job. After setting up Git repo configurations for Spring Cloud Config Server, you need to bind the jobs to the server.

#### [Azure CLI](#tab/azure-cli)

Use the following command to bind the job to Spring Cloud Config Server during job creation:

```azurecli
az spring job create \
    --name <job-name> \
    --bind-config-server true
```

For existing jobs, use the following command to bind them to Spring Cloud Config Server:

```azurecli
az spring config-server bind --job <job-name>
```

#### [Azure portal](#tab/azure-portal)

Use the following steps to bind the job to Spring Cloud Config Server during job creation:

1. Open your Azure Spring Apps service instance.

1. In the navigation pane, select **Job**.

1. Select **Create Job** and then, in the **Bind** section, select **Spring Cloud Config Server**.

1. Select **Create** to start the creation process.

For existing jobs, use the following steps to bind them to Spring Cloud Config Server:

1. Open your Azure Spring Apps service instance.

1. In the navigation pane, go to the **Managed components** section, and then select **Spring Cloud Config Server**.

1. If the component is disabled, select **Manage** to enable it.

1. On the **Settings** tab, configure Spring Cloud Config Server with the right Git repository. Select **Validate** and then select **Apply**.

1. On the **Job binding** tab, select **Bind job** and select the job to apply.

   After the job binds successfully, the job name shows up on the list.

1. Run the job.

---

If you no longer need Spring Cloud Config Server for your jobs, you can unbind them from it. This change takes effect on new job executions.

#### [Azure CLI](#tab/azure-cli)

Use the following command to unbind a job:

```azurecli
az spring config-server unbind --job <job-name>
```

#### [Azure portal](#tab/azure-portal)

Use the following steps to unbind a job:

1. Open your Azure Spring Apps service instance.

1. In the navigation pane, go to the **Managed components** section, and then select **Spring Cloud Config Server**.

1. On the **Job binding** tab, select the job you need to unbind.

1. Select **Unbind job**.

---

### Integrate with Tanzu Service registry

It's common for a job to call an API from a long-running app in collaboration to query for information, notifications, and so forth. To enable the job to discover apps running in the same Azure Spring Apps service, you can bind both your apps and jobs to a managed service registry. The following section describes how to bind a job to Tanzu Service Registry.

#### [Azure CLI](#tab/azure-cli)

Use the following command to bind a job to Tanzu Service Registry during job creation:

```azurecli
az spring job create --bind-service-registry true
```

For existing jobs, use the following command to bind them to Tanzu Service Registry:

```azurecli
az spring service-registry bind --job <job-name>
```

#### [Azure portal](#tab/azure-portal)

Use the following steps to bind a job to Tanzu Service Registry during job creation:

1. Open your Azure Spring Apps service instance.

1. In the navigation pane, go to the **Managed components** section, and then select **Service Registry**.

1. If the component is disabled, select **Manage** to enable it.

1. On the **Job binding** tab, select **Bind job** and then select the job to apply.

   After the job binds successfully, the job name shows up on the list.

1. Run the job.

For existing jobs, use the following steps to bind them to Tanzu Service Registry:

1. Open your Azure Spring Apps service instance.

1. In the navigation pane, go to the **Managed components** section, and then select **Service Registry**.

1. If the component is disabled, select **Manage** to enable it.

1. On the **Job binding** tab, select **Bind job** and then select the job to apply.

   After the job binds successfully, the job name shows up on the list.

1. Run the job.

---

When you run the job execution, it can access endpoints of registered apps through the service registry.

If you no longer need the service registry for your jobs, you can unbind them from it. This change takes effect on new job executions.

#### [Azure CLI](#tab/azure-cli)

Use the following command to unbind the job:

```azurecli
az spring service-registry unbind --job <job-name>
```

#### [Azure portal](#tab/azure-portal)

Use the following steps to unbind the job:

1. Open your Azure Spring Apps service instance.

1. In the navigation pane, go to the **Managed components** section, and then select **Service Registry**.

1. On the **Job binding** tab, select the job that you need to unbind.

1. Select **Unbind job**.

---

## See also

[Job in Azure Spring Apps](concept-job.md)
