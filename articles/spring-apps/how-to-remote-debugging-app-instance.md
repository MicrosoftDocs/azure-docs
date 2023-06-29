---
title: Debug your apps remotely in Azure Spring Apps
description: Learn how to debug your apps remotely in Azure Spring Apps.
ms.service: spring-apps
ms.topic: how-to
author: KarlErickson
ms.author: jialuogan
ms.date: 4/18/2023
ms.custom: devx-track-java, devx-track-extended-java, event-tier1-build-2022
---

# Debug your apps remotely in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This feature describes how to enable remote debugging of your applications in Azure Spring Apps.

## Prerequisites

- [Azure CLI](/cli/azure/install-azure-cli) with the Azure Spring Apps extension. Use the following command to remove previous versions and install the latest extension. If you previously installed the spring-cloud extension, uninstall it to avoid configuration and version mismatches.

  ```azurecli
  az extension remove --name spring
  az extension add --name spring
  az extension remove --name spring-cloud
  ```

- A deployed application in Azure Spring Apps.

## Enable or disable remote debugging

For security reasons, Azure Spring Apps disables remote debugging by default. Based on your company policy, you can enable remote debugging for your app yourself or see an admin to enable it for you. You can enable or disable remote debugging using Azure CLI, Azure portal, or the VS Code extension.

### [Azure portal](#tab/portal)

Use the following steps to enable remote debugging for your application using the Azure portal:

1. Navigate to your application page.
1. Under **Settings** in the left navigation pane, select **Remote debugging**.
1. On the **Remote debugging** page, enable remote debugging and specify the debugging port.

   :::image type="content" source="media/how-to-remote-debugging-app-instance/portal-enable-remote-debugging.png" alt-text="Screenshot of the Remote debugging page showing the Remote debugging option selected." lightbox="media/how-to-remote-debugging-app-instance/portal-enable-remote-debugging.png":::

### [Azure CLI](#tab/cli)

Use the following command to enable remote debugging for your application using the Azure CLI:

```azurecli
az spring app enable-remote-debugging \
    --name <application-name> \
    --deployment <deployment-name> \
    --resource-group <resource-group-name> \
    --service <service-name> \
    --port <port>
```

Use the following command to disable remote debugging for your application:

```azurecli
az spring app disable-remote-debugging \
    --name <application-name> \
    --deployment <deployment-name> \
    --resource-group <resource-group-name> \
    --service <service-name> \
```

Use the following command to display the remote debugging configuration:

```azurecli
az spring app get-remote-debugging-config \
    --name <application-name> \
    --deployment <deployment-name> \
    --resource-group <resource-group-name> \
    --service <service-name> \
```

---

## Assign an Azure role

To remotely debug an app instance, you must be granted the role `Azure Spring Apps Remote Debugging Role`, which includes the `Microsoft.AppPlatform/Spring/apps/deployments/remotedebugging/action` data action permission.

You can assign an Azure role using the Azure portal or Azure CLI.

### [Azure portal](#tab/azure-portal)

Use the following steps to assign an Azure role using the Azure portal.

1. Open the [Azure portal](https://portal.azure.com).
1. Open your Azure Spring Apps service instance.
1. In the navigation pane, select **Access Control (IAM)**.
1. On the **Access Control (IAM)** page, select **Add**, and then select **Add role assignment**.

   :::image type="content" source="media/how-to-remote-debugging-app-instance/add-role-assignment.png" alt-text="Screenshot of the Azure portal showing the Access Control (IAM) page for an Azure Spring Apps instance with the Add role assignment option highlighted." lightbox="media/how-to-remote-debugging-app-instance/add-role-assignment.png":::

1. On the **Add role assignment** page, in the **Name** list, search for and select *Azure Spring Apps Remote Debugging Role*, and then select **Next**.

   :::image type="content" source="media/how-to-remote-debugging-app-instance/remote-debugging-role.png" alt-text="Screenshot of the Azure portal showing the Add role assignment page for an Azure Spring Apps instance with the Azure Spring Apps Remote Debugging Role name highlighted." lightbox="media/how-to-remote-debugging-app-instance/remote-debugging-role.png":::

1. Select **Members**, and then search for and select your username.

1. Select **Review + assign**.

### [Azure CLI](#tab/azure-cli)

Use the following command to obtain the Azure Spring Apps Remote Debugging Role.

   ```azurecli
   az role assignment create \
       --role "Azure Spring Apps Remote Debugging Role" \
       --scope "<service-instance-resource-id>" \
       --assignee "<your-identity>"
   ```

---

## Debug an app instance remotely

You can debug an app instance remotely using the Azure Toolkit for IntelliJ or the Azure Spring Apps for VS Code extension.

### [Azure Toolkit for IntelliJ](#tab/Intellij-extension)

This section describes how to debug an app instance remotely using the Azure Toolkit for IntelliJ.

### Prerequisites

- [Azure Toolkit for IntelliJ](/azure/developer/java/toolkit-for-intellij/install-toolkit).
- [IntelliJ IDEA](https://www.jetbrains.com/idea/download), Ultimate or Community edition.

### Enable or disable remote debugging

Use the following steps to enable or disable remote debugging:

1. Sign in to your Azure account in Azure Explorer.
1. Select an app instance, and then select **Enable Remote Debugging**.

   :::image type="content" source="media/how-to-remote-debugging-app-instance/intellij-enable-remote.png" alt-text="Screenshot showing the Enable Remote Debugging option." lightbox="media/how-to-remote-debugging-app-instance/intellij-enable-remote.png":::

### Attach debugger

Use the following steps to attach debugger.

1. Select an app instance, and then select **Attach Debugger**. IntelliJ connects to the app instance and starts remote debugging.

   :::image type="content" source="media/how-to-remote-debugging-app-instance/intellij-remote-debugging-instance.png" alt-text="Screenshot showing the Attach Debugger option." lightbox="media/how-to-remote-debugging-app-instance/intellij-remote-debugging-instance.png":::

1. Azure Toolkit for IntelliJ creates the remote debugging configuration. You can find it under **Remote Jvm Debug"** Configure the module class path to the source code that you use for remote debugging.

   :::image type="content" source="media/how-to-remote-debugging-app-instance/intellij-remote-debugging-configuration.png" alt-text="Screenshot of the Run/Debug Configurations page." lightbox="media/how-to-remote-debugging-app-instance/intellij-remote-debugging-configuration.png":::

### Troubleshooting

This section provides troubleshooting information.

- Take the following actions if you fail to attach debugger and receive an error similar to `java.net.SocketException, connection reset` or `Failed to attach to remote debugger, ClosedConnectionException`:

  - Check the RBAC role to make sure that you're authorized to remotely debug an app instance.
  - Make sure that you're connecting to a valid instance. Refresh the deployment to get the latest instances.

    :::image type="content" source="media/how-to-remote-debugging-app-instance/refresh-instance.png" alt-text="Screenshot showing the Refresh command." lightbox="media/how-to-remote-debugging-app-instance/refresh-instance.png":::

- Take the following actions if you successfully attach debugger but can't remotely debug the app instance:

  - Make sure that your IDE contains the source code you want to debug.
  - Make sure that the debug configuration has the correct module class path.

### [VS Code extension](#tab/Vscode-extension)

This section describes how to debug an app instance remotely using the VS Code extension.

### Prerequisites

- [Azure Spring Apps for VS Code Plugin](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-azurespringcloud).
- [Visual Studio Code](https://code.visualstudio.com).

### Enable or disable remote debugging

Use the following steps to enable or disable remote debugging:

1. Sign in to your Azure subscription.
1. Select an app instance, and then select **Enable Remote Debugging**.

   :::image type="content" source="media/how-to-remote-debugging-app-instance/visual-studio-code-enable-remote-debugging.png" alt-text="Screenshot showing the Enable Remote Debugging option." lightbox="media/how-to-remote-debugging-app-instance/visual-studio-code-enable-remote-debugging.png":::

### Attach debugger

Use the following steps to attach debugger.

1. Select an app instance, and then select **Attach Debugger**. VS Code connects to the app instance and starts remote debugging.

   :::image type="content" source="media/how-to-remote-debugging-app-instance/visual-studio-code-remote-debugging-instance.png" alt-text="Screenshot showing the Attach Debugger option." lightbox="media/how-to-remote-debugging-app-instance/visual-studio-code-remote-debugging-instance.png":::

### Troubleshooting

This section provides troubleshooting information.

- Take the following actions if you fail to attach debugger and receive an error similar to `java.net.SocketException, connection reset` or `Failed to attach to remote debugger, ClosedConnectionException`:

  - Check the RBAC role to make sure that you're authorized to remotely debug an app instance.
  - Make sure that you're connecting to a valid instance. Refresh the deployment to get the latest instances.

    :::image type="content" source="media/how-to-remote-debugging-app-instance/refresh-instance.png" alt-text="Screenshot showing the Refresh command." lightbox="media/how-to-remote-debugging-app-instance/refresh-instance.png":::

- Take the following action if you successfully attach debugger but can't remotely debug the app instance:

  - Make sure that your IDE contains the source code you want to debug.

---

## Limitations

Remote debugging is only supported for Java applications.

| Plan                    | Deployment type   | Supported |
|-------------------------|-------------------|-----------|
| Standard and basic plan | Jar               | Yes       |
| Standard and basic plan | Source code(Java) | Yes       |
| Standard and basic plan | Custom Image      | No        |
| Enterprise plan         | Java Application  | Yes       |
| Enterprise plan         | Source code(Java) | Yes       |
| Enterprise plan         | Custom Image      | No        |

## Tips

- Java remote debugging is dangerous because it allows remote code execution. Azure Spring Apps helps you secure the communication between your client IDE and the remote application. However, you should disable remote debugging and remove the RBAC role after you're finished.
- You should scale in the app instance to one to ensure that traffic can go to the instance.

## Next steps

- [Azure Spring Apps](index.yml)
