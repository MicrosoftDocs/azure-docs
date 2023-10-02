---
title:  Connect to an app instance for troubleshooting
description: Learn how to connect to an app instance in Azure Spring Apps for troubleshooting.
author: KarlErickson
ms.author: xiangy
ms.service: spring-apps
ms.topic: article
ms.date: 12/06/2022
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
---

# Connect to an app instance for troubleshooting

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article describes how to access the shell environment inside your application instances to do advanced troubleshooting.

Although Azure Spring Apps offers various managed troubleshooting approaches, you may want to do advanced troubleshooting using the shell environment. For example, you may want to accomplish the following troubleshooting tasks:

- Directly use Java Development Kit (JDK) tools.
- Diagnose against an app’s back-end services for network connection and API call latency for both virtual-network and non-virtual-network instances.
- Diagnose storage capacity, performance, and CPU/memory issues.

## Prerequisites

- [Azure CLI](/cli/azure/install-azure-cli) with the Azure Spring Apps extension. Use the following command to remove previous versions and install the latest extension. If you previously installed the `spring-cloud` extension, uninstall it to avoid configuration and version mismatches.

  ```azurecli
  az extension remove --name spring
  az extension add --name spring
  az extension remove --name spring-cloud
  ```

- A deployed application in Azure Spring Apps.
- If you've deployed a custom container, a shell program. The default is `/bin/sh`.

## Assign an Azure role

Before connecting to an app instance, you must be granted the role *Azure Spring Apps Connect Role*. Connecting to an app instance requires the data action permission `Microsoft.AppPlatform/Spring/apps/deployments/connect/action`.

You can assign an Azure role using the Azure portal or Azure CLI.

### [Azure portal](#tab/azure-portal)

Use the following steps to assign an Azure role using the Azure portal.

1. Open the [Azure portal](https://portal.azure.com).
1. Open your existing Azure Spring Apps service instance.
1. Select **Access Control (IAM)** from the left menu.
1. Select **Add** in the command bar, and then select **Add role assignment**.

   :::image type="content" source="media/how-to-connect-to-app-instance-for-troubleshooting/add-role-assignment.png" alt-text="Screenshot of the Access Control(IAM) page showing the Add role assignment command." lightbox="media/how-to-connect-to-app-instance-for-troubleshooting/add-role-assignment.png":::

1. Search for **Azure Spring Apps Connect Role** in the list, and then select **Next**.

   :::image type="content" source="media/how-to-connect-to-app-instance-for-troubleshooting/connect-role.png" alt-text="Screenshot of the Add role assignment page showing the Azure Spring Apps Connect Role." lightbox="media/how-to-connect-to-app-instance-for-troubleshooting/connect-role.png":::

1. Select **Select members**, and then search for your username.

1. Select **Review + assign**.

### [Azure CLI](#tab/azure-cli)

Use the following command to assign the *Azure Spring Apps Connect Role* role using the Azure CLI:

```azurecli
az role assignment create \
    --role 'Azure Spring Apps Connect Role' \
    --scope '<service-instance-resource-id>' \
    --assignee '<your-identity>'
```

> [!NOTE]
> The role assignment may take several minutes.

---

## Connect to an app instance

You can connect to an app instance using the Azure portal or Azure CLI.

### [Azure portal](#tab/azure-portal)

Use the following steps to connect to an app instance using the Azure portal.

1. Open the [Azure portal](https://portal.azure.com).
1. Open your existing Azure Spring Apps service instance.
1. Select **Apps** from left the menu, then select one of your apps.
1. Select **Console** from the left menu.
1. Select an application instance.

   :::image type="content" source="media/how-to-connect-to-app-instance-for-troubleshooting/console-instance.png" alt-text="Screenshot of the Azure portal Console page showing an app instance." lightbox="media/how-to-connect-to-app-instance-for-troubleshooting/console-instance.png":::

1. Select or input a shell to run in the container.

   :::image type="content" source="media/how-to-connect-to-app-instance-for-troubleshooting/console-shell.png" alt-text="Screenshot of the Azure portal Console page showing a Custom Shell entry." lightbox="media/how-to-connect-to-app-instance-for-troubleshooting/console-shell.png":::

1. Select **Connect**.

   :::image type="content" source="media/how-to-connect-to-app-instance-for-troubleshooting/console-connect.png" alt-text="Screenshot of the Azure portal Console page showing the Connect command." lightbox="media/how-to-connect-to-app-instance-for-troubleshooting/console-connect.png":::

### [Azure CLI](#tab/azure-cli)

If your app contains only one instance, use the following command to connect to the instance using the Azure CLI:

```azurecli
az spring app connect \
    --service <your-service-instance> \
    --resource-group <your-resource-group> \
    --name <app-name> 
```

Otherwise, use the following command to specify the instance:

```azurecli
az spring app connect \
    --service <your-service-instance> \
    --resource-group <your-resource-group> \
    --name <app-name> \
    --instance <instance_name>
```

Use the following command to specify another deployment of the app:

```azurecli
az spring app connect \
    --service <your-service-instance> \
    --resource-group <your-resource-group> \
    --name <app-name> \
    --deployment green
```

By default, Azure Spring Apps launches the app instance with `/bin/sh` bundled in the base image of the container. Use the following command to switch to another bundled shell such as `/bin/bash`:

```azurecli
az spring app connect \
    --service <your-service-instance> \
    --resource-group <your-resource-group> \
    --name <app-name> \
    --shell-cmd /bin/bash
```

If your app is deployed with a custom image and shell, you can also use the `--shell-cmd` parameter to specify your shell.

---

## Troubleshoot your app instance

After you connect to an app instance, you can check the status of the heap memory.

Use the following command to find the Java process ID, which is usually `1`:

```azurecli
jps
```

The output should look like the following example:

:::image type="content" source="media/how-to-connect-to-app-instance-for-troubleshooting/jps-result.png" alt-text="Screenshot showing the output of the jps command.":::

Then use the following command to run the JDK tool to check the result:

```azurecli
jstat -gc 1
```

The output should look like the following example:

:::image type="content" source="media/how-to-connect-to-app-instance-for-troubleshooting/jstat-result.png" alt-text="Screenshot showing the output of the jstat command.":::

## Disconnect from your app instance

When you're done troubleshooting, use the `exit` command to disconnect from the app instance, or press `Ctrl+d`.

## Troubleshooting tools

The following list describes some of the pre-installed tools that you can use for troubleshooting:

- `lsof` - Lists open files.
- `top` - Displays system summary information and current utilization.
- `ps` - Gets a snapshot of the running process.
- `netstat` - Prints network connections and interface statistics.
- `nslookup` - Queries internet name servers interactively.
- `ping` - Tests whether a network host can be reached.
- `nc` - Reads from and writes to network connections using TCP or UDP.
- `wget` - Lets you download files and interact with REST APIs.
- `df` - Displays the amount of available disk space.

You can also use JDK-bundled tools such as `jps`, `jcmd`, and `jstat`.

The following list shows the tools available, which depend on your service plan and type of app deployment:

- Source Code, JAR, and artifacts deployment:
  - Basic, Standard, and Standard Consumption & Dedicated Plan:
    - Common tools - Yes
    - JDK tools - Yes, for Java workloads only.
  - Enterprise Plan:
    - Common tools - Depends on which OS Stack you've chosen in your [builder](./how-to-enterprise-build-service.md#builders). Yes, for full OS Stack. No, for base OS Stack.
    - JDK tools - Yes, for Java workloads only.
- Custom image deployment: Depends on the installed tool set in your image.

> [!NOTE]
> JDK tools aren't included in the path for the *source code* deployment type. Run `export PATH="$PATH:/layers/paketo-buildpacks_microsoft-openjdk/jdk/bin"` before running any JDK commands.

## Limitations

Using the shell environment inside your application instances has the following limitations:

- Because the app is running as a non-root user, you can't execute some actions requiring root permission. For example, you can't install new tools by using the system package manager `apt / yum`.

- Because some Linux capabilities are prohibited, tools that require special privileges, such as `tcpdump`, don't work.

## Next steps

- [Self-diagnose and solve problems in Azure Spring Apps](./how-to-self-diagnose-solve.md)
