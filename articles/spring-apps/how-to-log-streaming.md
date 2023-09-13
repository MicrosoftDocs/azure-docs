---
title:  Stream Azure Spring Apps application console logs in real time
description: Describes how to use log streaming to view application logs in real time
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 08/10/2022
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, event-tier1-build-2022
---

# Stream Azure Spring Apps application console logs in real time

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article describes how to enable log streaming in Azure CLI to get real-time application console logs for troubleshooting. You can also use diagnostics settings to analyze diagnostics data in Azure Spring Apps. For more information, see [Analyze logs and metrics with diagnostics settings](./diagnostic-services.md).

## Prerequisites

- [Azure CLI](/cli/azure/install-azure-cli) with the Azure Spring Apps extension, minimum version 1.0.0. You can install the extension by using the following command: `az extension add --name spring`
- An instance of Azure Spring Apps with a running application. For more information, see [Quickstart: Deploy your first application to Azure Spring Apps](./quickstart.md).

## Use Azure CLI to produce tail logs

This section provides examples of using Azure CLI to produce tail logs. To avoid repeatedly specifying your resource group and service instance name, use the following commands to set your default resource group name and cluster name:

```azurecli
az config set defaults.group=<service-group-name>
az config set defaults.spring=<service-instance-name>
```

The resource group and service name are omitted in the following examples.

### View the tail log for an app with a single instance

If an app named `auth-service` has only one instance, you can view the log of the app instance with the following command:

```azurecli
az spring app logs --name <application-name>
```

This command returns logs similar to the following examples, where `auth-service` is the application name.

```output
...
2020-01-15 01:54:40.481  INFO [auth-service,,,] 1 --- [main] o.apache.catalina.core.StandardService  : Starting service [Tomcat]
2020-01-15 01:54:40.482  INFO [auth-service,,,] 1 --- [main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.22]
2020-01-15 01:54:40.760  INFO [auth-service,,,] 1 --- [main] o.a.c.c.C.[Tomcat].[localhost].[/uaa]  : Initializing Spring embedded WebApplicationContext
2020-01-15 01:54:40.760  INFO [auth-service,,,] 1 --- [main] o.s.web.context.ContextLoader  : Root WebApplicationContext: initialization completed in 7203 ms

...
```

### View the tail log for an app with multiple instances

If multiple instances exist for the app named `auth-service`, you can view the instance log by using the `-i/--instance` option.

First, run the following command to get the app instance names:

```azurecli
az spring app show --name auth-service --query properties.activeDeployment.properties.instances --output table
```

This command produces results similar to the following output:

```output
Name                                         Status    DiscoveryStatus
-------------------------------------------  --------  -----------------
auth-service-default-12-75cc4577fc-pw7hb  Running   UP
auth-service-default-12-75cc4577fc-8nt4m  Running   UP
auth-service-default-12-75cc4577fc-n25mh  Running   UP
```

Then, you can stream logs of an app instance using the `-i/--instance` option, as follows:

```azurecli
az spring app logs --name auth-service --instance auth-service-default-12-75cc4577fc-pw7hb
```

You can also get details of app instances from the Azure portal. After selecting **Apps** in the left navigation pane of your Azure Spring Apps service, select **App Instances**.

### Continuously stream new logs

By default, `az spring app logs` prints only existing logs streamed to the app console, and then exits. If you want to stream new logs, add the `-f/--follow` argument:

```azurecli
az spring app logs --name auth-service --follow
```

When you use the `--follow` argument to tail instant logs, the Azure Spring Apps log streaming service sends heartbeat logs to the client every minute unless your application is writing logs constantly. Heartbeat log messages use the following format: `2020-01-15 04:27:13.473: No log from server`.

Use the following command to check all the logging options that are supported:

```azurecli
az spring app logs --help
```

### Format JSON structured logs

> [!NOTE]
> Formatting JSON structured logs requires spring extension version 2.4.0 or later.

Structured application logs are displayed in JSON format, which can be difficult to read. You can use the `--format-json` argument to format logs in JSON format into a more readable format. For more information, see [Structured application log for Azure Spring Apps](./structured-app-log.md).

The following example shows how to use the `--format-json` argument:

```azurecli
# Raw JSON log
$ az spring app logs --name auth-service
{"timestamp":"2021-05-26T03:35:27.533Z","logger":"com.netflix.discovery.DiscoveryClient","level":"INFO","thread":"main","mdc":{},"message":"Disable delta property : false"}
{"timestamp":"2021-05-26T03:35:27.533Z","logger":"com.netflix.discovery.DiscoveryClient","level":"INFO","thread":"main","mdc":{},"message":"Single vip registry refresh property : null"}

# Formatted JSON log
$ az spring app logs --name auth-service --format-json
2021-05-26T03:35:27.533Z  INFO [           main] com.netflix.discovery.DiscoveryClient   : Disable delta property : false
2021-05-26T03:35:27.533Z  INFO [           main] com.netflix.discovery.DiscoveryClient   : Single vip registry refresh property : null
```

The `--format-json` argument also accepts an optional customized format using format string syntax. For more information, see [Format String Syntax](https://docs.python.org/3/library/string.html#format-string-syntax).

The following example shows how to use format string syntax:

```azurecli
# Custom format
$ az spring app logs --name auth-service --format-json="{message}{n}"
Disable delta property : false
Single vip registry refresh property : null
```

> The default format being used is:
>
> ```format
> {timestamp} {level:>5} [{thread:>15.15}] {logger{39}:<40.40}: {message}{n}{stackTrace}
> ```

## Stream an Azure Spring Apps app log in a virtual network injection instance

For an Azure Spring Apps instance deployed in a custom virtual network, you can access log streaming by default from a private network. For more information, see [Deploy Azure Spring Apps in a virtual network](./how-to-deploy-in-azure-virtual-network.md)

Azure Spring Apps also enables you to access real-time app logs from a public network using Azure portal or the Azure CLI.

> [!NOTE]
> Enabling the log streaming endpoint on the public network adds a public inbound IP to your virtual network. Be sure to use caution if this is a concern for you.

### [Azure portal](#tab/azure-portal)

Use the following steps to enable a log streaming endpoint on the public network.

1. Select the Azure Spring Apps service instance deployed in your virtual network, and then open the **Networking** tab in the navigation menu.

1. Select the **Vnet injection** page.

1. Switch the status of **Dataplane resources on public network** to **enable** to enable a log streaming endpoint on the public network. This process will take a few minutes.

   :::image type="content" source="media/how-to-log-streaming/dataplane-public-endpoint.png" alt-text="Screenshot of enabling a log stream public endpoint on the Vnet Injection page." lightbox="media/how-to-log-streaming/dataplane-public-endpoint.png":::

#### [Azure CLI](#tab/azure-CLI)

Use the following command to enable the log stream public endpoint.

```azurecli
az spring update \
    --resource-group <resource-group-name> \
    --service <service-instance-name> \
    --enable-dataplane-public-endpoint true
```

---

After you've enabled the log stream public endpoint, you can access the app log from a public network as you would access a normal instance.

## Secure traffic to the log streaming public endpoint

Log streaming uses the same key as the test endpoint described in [Set up a staging environment in Azure Spring Apps](./how-to-staging-environment.md) to authenticate the connections to your deployments. As a result, only users who have read access to the test keys can access log streaming.

To ensure the security of your applications when you expose a public endpoint for them, secure the endpoint by filtering network traffic to your service with a network security group. For more information, see [Tutorial: Filter network traffic with a network security group using the Azure portal](../virtual-network/tutorial-filter-network-traffic.md). A network security group contains security rules that allow or deny inbound network traffic to, or outbound network traffic from, several types of Azure resources. For each rule, you can specify source and destination, port, and protocol.

> [!NOTE]
> If you can't access app logs in the virtual network injection instance from the internet after you've enabled a log stream public endpoint, check your network security group to see whether you've allowed such inbound traffic.

The following table shows an example of a basic rule that we recommend. You can use commands like `nslookup` with the endpoint `<service-name>.private.azuremicroservices.io` to get the target IP address of a service.

| Priority | Name      | Port | Protocol | Source   | Destination        | Action |
|----------|-----------|------|----------|----------|--------------------|--------|
| 100      | Rule name | 80   | TCP      | Internet | Service IP address | Allow  |
| 110      | Rule name | 443  | TCP      | Internet | Service IP address | Allow  |

## Next steps

- [Quickstart: Monitoring Azure Spring Apps apps with logs, metrics, and tracing](./quickstart-logs-metrics-tracing.md)
- [Analyze logs and metrics with diagnostics settings](./diagnostic-services.md)
