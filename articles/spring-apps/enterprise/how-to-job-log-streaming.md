---
title:  Stream Azure Spring Apps job logs in real time
description: Learn how to use log streaming to view job logs in real time.
author: KarlErickson
ms.author: jiec
ms.service: spring-apps
ms.topic: how-to
ms.date: 05/29/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
---

# Stream Azure Spring Apps job logs in real time (Preview)

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article describes how to use the Azure CLI to get real-time logs of jobs for troubleshooting. You can also use diagnostics settings to analyze diagnostics data in Azure Spring Apps. For more information, see [Analyze logs and metrics with diagnostics settings](./diagnostic-services.md). For more information on streaming logs, see [Stream Azure Spring Apps application console logs in real time](./how-to-log-streaming.md) and [Stream Azure Spring Apps managed component logs in real time](./how-to-managed-component-log-streaming.md).

## Prerequisites

- [Azure CLI](/cli/azure/install-azure-cli) with the Azure Spring Apps extension, version 1.24.0 or higher. You can install the extension by using the following command: `az extension add --name spring`.

## Assign an Azure role

To stream logs of jobs, you must have the relevant Azure roles assigned to you. The following table lists the required role and the operations for which this role is granted permission:

| Required role                         | Operations                                                                                                                                |
|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| Azure Spring Apps Job Log Reader Role | `Microsoft.AppPlatform/Spring/jobs/executions/logstream/action` <br/> `Microsoft.AppPlatform/Spring/jobs/executions/listInstances/action` |

### [Azure portal](#tab/azure-Portal)

Use the following steps to assign an Azure role using the Azure portal:

1. Open the [Azure portal](https://portal.azure.com).

1. Open your Azure Spring Apps service instance.

1. In the navigation pane, select **Access Control (IAM)**.

1. On the **Access Control (IAM)** page, select **Add**, and then select **Add role assignment**.

   :::image type="content" source="media/how-to-job-log-streaming/add-role-assignment.png" alt-text="Screenshot of the Azure portal that shows the Access Control (IAM) page with the Add role assignment option highlighted." lightbox="media/how-to-job-log-streaming/add-role-assignment.png":::

1. On the **Add role assignment** page, in the **Name** list, search for and select the target role, and then select **Next**.

   :::image type="content" source="media/how-to-job-log-streaming/job-log-reader-role.png" alt-text="Screenshot of the Azure portal that shows the Add role assignment page with the Azure Spring Apps Job Log Reader Role name highlighted." lightbox="media/how-to-job-log-streaming/job-log-reader-role.png":::

1. Select **Members** and then search for and select your username.

1. Select **Review + assign**.

### [Azure CLI](#tab/azure-CLI)

Use the following command to assign an Azure role:

   ```azurecli
   az role assignment create \
       --role "<Log-reader-role-for-job>" \
       --scope "<service-instance-resource-id>" \
       --assignee "<your-identity>"
   ```

---

## List all instances in a job execution

Every time a job is triggered, a new job execution is created. Also, depending on the parallelism setting for your job, several replicas or instances execute in parallel.

Use the following command to list all instances in a job execution:

```azurecli
az spring job execution instance list \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --job <job-name> \
    --execution <job-execution-name>
```

## View tail logs

This section provides examples of using the Azure CLI to produce tail logs.

### View tail logs for a specific instance

To view the tail logs for a specific instance, use the `az spring job logs` command with the `-i/--instance` argument, as shown in the following example:

```azurecli
az spring job logs \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <job-name> \
    --execution <job-execution-name> \
    --instance <instance-name>
```

### View tail logs for all instances in one command

To view the tail logs for all instances, use the `--all-instances` argument, as shown in the following example. The instance name is the prefix of each log line. When there are multiple instances, logs are printed in batch for each instance. This way logs of one instance aren't interleaved with the logs of another instance.

```azurecli
az spring job logs \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <job-name> \
    --execution <job-execution-name> \
    --all-instances
```

## Stream new logs continuously

By default, `az spring job logs` prints only existing logs streamed to the console and then exits. If you want to stream new logs, add the `-f/--follow` argument.

When you use the `-f/--follow` option to tail instant logs, the Azure Spring Apps log streaming service sends heartbeat logs to the client every minute unless the job is writing logs constantly. Heartbeat log messages use the following format: `2023-12-18 09:12:17.745: No log from server`.

### Stream logs for a specific instance

Use the following command to stream logs for a specific instance:

```azurecli
az spring job logs \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <job-name> \
    --execution <job-execution-name> \
    --instance <instance-name> \
    --follow
```

### Stream logs for all instances

Use the following command to stream logs for all instances:

```azurecli
az spring job logs \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <job-name> \
    --execution <job-execution-name> \
    --all-instances \
    --follow
```

When you stream logs for multiple instances in a job execution, the logs of one instance interleave with the logs of others.

## Stream logs in a virtual network injection instance

For an Azure Spring Apps instance deployed in a custom virtual network, you can access log streaming by default from a private network. For more information, see [Deploy Azure Spring Apps in a virtual network](./how-to-deploy-in-azure-virtual-network.md)

Azure Spring Apps also enables you to access real-time job logs from a public network.

> [!NOTE]
> Enabling the log streaming endpoint on the public network adds a public inbound IP to your virtual network. Be sure to use caution if this is a concern for you.

### [Azure portal](#tab/azure-Portal)

Use the following steps to enable a log streaming endpoint on the public network:

1. Select the Azure Spring Apps service instance deployed in your virtual network and then select **Networking** in the navigation menu.

1. Select the **Vnet injection** tab.

1. Switch the status of **Dataplane resources on public network** to **Enable** to enable a log streaming endpoint on the public network. This process takes a few minutes.

   :::image type="content" source="media/how-to-job-log-streaming/dataplane-public-endpoint.png" alt-text="Screenshot of the Azure portal that shows the Networking page with the Vnet injection tab selected and the Troubleshooting section highlighted." lightbox="media/how-to-job-log-streaming/dataplane-public-endpoint.png":::

### [Azure CLI](#tab/azure-CLI)

Use the following command to enable the log stream public endpoint:

```azurecli
az spring update \
    --resource-group <resource-group-name> \
    --service <service-instance-name> \
    --enable-dataplane-public-endpoint true
```

---

After you enable the log stream public endpoint, you can access the job logs from a public network just like you would access a normal instance.

## Secure traffic to the log streaming public endpoint

Log streaming for jobs uses Azure RBAC to authenticate the connections to the jobs. As a result, only users who have the proper roles can access the logs.

To ensure the security of your jobs when you expose a public endpoint for them, secure the endpoint by filtering network traffic to your service with a network security group. For more information, see [Tutorial: Filter network traffic with a network security group using the Azure portal](../../virtual-network/tutorial-filter-network-traffic.md). A network security group contains security rules that allow or deny inbound network traffic to, or outbound network traffic from, several types of Azure resources. For each rule, you can specify source and destination, port, and protocol.

> [!NOTE]
> If you can't access job logs in the virtual network injection instance from the internet after you enable a log stream public endpoint, check your network security group to see whether you've allowed such inbound traffic.

The following table shows an example of a basic rule that we recommend. You can use commands like `nslookup` with the endpoint `<service-name>.private.azuremicroservices.io` to get the target IP address of a service.

| Priority | Name      | Port | Protocol | Source   | Destination        | Action |
|----------|-----------|------|----------|----------|--------------------|--------|
| 100      | Rule name | 80   | TCP      | Internet | Service IP address | Allow  |
| 110      | Rule name | 443  | TCP      | Internet | Service IP address | Allow  |

## Next steps

- [Troubleshoot VMware Spring Cloud Gateway](./how-to-troubleshoot-enterprise-spring-cloud-gateway.md)
- [Use Application Configuration Service](./how-to-enterprise-application-configuration-service.md)
- [Stream Azure Spring Apps application console logs in real time](./how-to-log-streaming.md)
- [Stream Azure Spring Apps managed component logs in real time](./how-to-managed-component-log-streaming.md)
