---
title:  Connect to an app instance for troubleshooting
description: Learn how to connect to an app instance in Azure Spring Apps for troubleshooting.
author: karlerickson
ms.author: xiangy
ms.service: spring-apps
ms.topic: article
ms.date: 11/09/2021
ms.custom: devx-track-java, devx-track-azurecli
---

# Connect to an app instance for troubleshooting

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

### Azure CLI
Use the following command to assign the *Azure Spring Apps Connect Role* role:

```azurecli
az role assignment create \
    --role 'Azure Spring Apps Connect Role' \
    --scope '<service-instance-resource-id>' \
    --assignee '<your-identity>'
```

### Portal

1. Open the [Azure portal](https://portal.azure.com).
1. Open your existing Azure Spring Apps service instance.
1. Select **Access Control(IAM)** from the left menu.
1. Select **Add** in the command bar, then click **Add role assignment**.
   
   :::image type="content" source="media/how-to-connect-to-app-instance-for-troubleshooting/assign-role-1.png" alt-text="Screenshot of Azure portal Add role assignment page." lightbox="media/how-to-connect-to-app-instance-for-troubleshooting/assign-role-1.png":::

1. Search for **Azure Spring Apps Connect Role** the list and click next.

   :::image type="content" source="media/how-to-connect-to-app-instance-for-troubleshooting/assign-role-2.png" alt-text="Screenshot of Azure portal Add role assignment page." lightbox="media/how-to-connect-to-app-instance-for-troubleshooting/assign-role-2.png":::

1. Click **Select members** and search for your username.

   :::image type="content" source="media/how-to-connect-to-app-instance-for-troubleshooting/assign-role-3.png" alt-text="Screenshot of Azure portal Add role assignment page." lightbox="media/how-to-connect-to-app-instance-for-troubleshooting/assign-role-3.png":::

1. Click **Review + assign**.

## Connect to an app instance

### Azure CLI

If your app contains only one instance, use the following command to connect to the instance:

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

### Portal

1. Open the [Azure portal](https://portal.azure.com).
1. Open your existing Azure Spring Apps service instance.
1. Select **Apps** from left the menu, then select one of your apps.
1. Select **Console** from the left menu.
1. Choose an application instance.

   :::image type="content" source="media/how-to-connect-to-app-instance-for-troubleshooting/console-blade-1.png" alt-text="Screenshot of Azure portal App Console page." lightbox="media/how-to-connect-to-app-instance-for-troubleshooting/console-blade-1.png":::

1. Select or input a shell to run in the container.

   :::image type="content" source="media/how-to-connect-to-app-instance-for-troubleshooting/console-blade-2.png" alt-text="Screenshot of Azure portal App Console page." lightbox="media/how-to-connect-to-app-instance-for-troubleshooting/console-blade-2.png":::

1. Click the **Connect** button.

   :::image type="content" source="media/how-to-connect-to-app-instance-for-troubleshooting/console-blade-3.png" alt-text="Screenshot of Azure portal App Console page." lightbox="media/how-to-connect-to-app-instance-for-troubleshooting/console-blade-3.png":::

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

The available tools depend on your service tier and type of app deployment. The following table describes the availability of troubleshooting tools:

| Tier                  | Deployment type         | Common tools                                 | JDK tools                   | Notes                                    |
|------------------------|--------------------------|-----------------------------------------------|------------------------------|-------------------------------------------|
| Basic / Standard tier | Source code / Jar       | Y                                            | Y (for Java workloads only) |                                          |
| Basic / Standard tier | Custom image            | N                                            | N                           | Up to your installed tool set.           |
| Enterprise Tier       | Source code / Artifacts | Y (for full OS stack), N (for base OS stack) | Y (for Java workloads only) | Depends on the OS stack of your builder. |
| Enterprise Tier       | Custom image            | N                                            | N                           | Depends on your installed tool set.           |

> [!NOTE]
> For the **source code** deployment, the JDK tools aren't included in the path. Please run `export PATH="$PATH:/layers/paketo-buildpacks_microsoft-openjdk/jdk/bin"` before running any JDK commands.

## Limitations

Using the shell environment inside your application instances has the following limitation:

- Because the app is running as a non-root user, you can't execute some actions requiring root permission. For example, you can't install new tools by using the system package manager `apt / yum`.

- Because some Linux capabilities are prohibited, tools that require special privileges, such as `tcpdump`, don't work.

## Next steps

- [Self-diagnose and solve problems in Azure Spring Apps](./how-to-self-diagnose-solve.md)
