---
title: Debug your apps remotely in Azure Spring Apps
description: Learn how to debug your apps remotely in Azure Spring Apps.
ms.service: spring-apps
ms.topic: how-to
ms.author: karler
author: shipeng, jialuogan
ms.date: 11/18/2022
ms.custom: devx-track-java, event-tier1-build-2022
---

# Debug your apps remotely in Azure Spring Apps

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

For security reasons, Azure Spring Apps disables remote debugging by default. Based on your company policy, you can enable remote debugging for your app yourself or see an admin to enable it for you. You can enable or disable remote debugging using the Azure CLI, Azure portal, or VS Code extension.

### [Azure Portal](#tab/portal)

Use the following steps to enable remote debugging for your application using the Azure Portal:

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

Use the following command to disable remote debugging for you application:

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

## Remote debugging app instance
#### [Intellij extension](#tab/Intellij-extension)

### Prerequisites
* [Azure Toolkit for IntelliJ](https://learn.microsoft.com/en-us/azure/developer/java/toolkit-for-intellij/install-toolkit) is installed


### Enable/disable Remote Debugging

![Intellij Enable Remote Debugging](./media/how-to-remote-debugging-app-instance/intellij-enable-remote-debugging.png)

### Attach Debugger

#### Assign an azure role
Before you attach debugger, you must be granted the role "Azure Spring Apps Remote Debugging Role" because it requires a new Data Action permission `Microsoft.AppPlatform/Spring/apps/deployments/remotedebugging/action`. It can be achieved by the following command:

```azurecli
az role assignment create --role 'Azure Spring Apps Remote Debugging Role' --scope '<Resource id of your service instance>' --assignee '<your identity>'
```


1. Choose one of the app instance and run "Attach Debugger". Intellij will help you to connect to the app instance and start remote debugging.

![Vscode Remote Debugging](./media/how-to-remote-debugging-app-instance/intellij-remote-debugging-instance.png)

2. We will create remote debugging configuration for you, you can find it under "Remote Jvm Debug". Please configure the module class path to your source code which is used for remote debugging.
   ![Intellij Remote Debugging configuration](./media/how-to-remote-debugging-app-instance/intellij-remote-debugging-configuration.png)

 

### Troubleshooting
1. Failed to attach debugger, the error looks like "java.net.SocketException, connection reset", "Failed to attach to remote debugger, ClosedConnectionException"

   - Please check the [RBAC role](#assign-an-azure-role) to ensure you are authorized to remote debugging an app instance.
   - Please ensure you access to a valid instance. You can refresh the deployment to get the latest instances.

     ![Refresh app instances](./media/how-to-remote-debugging-app-instance/refresh-instance.png)
2. Successfully attach debugger but cannot remote debugging the app instance.
   - Please ensure your ide contains the source code you want to debug.
   - Please ensure the debug configuration has the correct module class path.



#### [Vscode extension](#tab/Vscode-extension)

### Prerequisites
* [Azure Spring Apps extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-azurespringcloud) is installed.


### Enable/disable Remote Debugging
![Vscode Enable Remote Debugging](./media/how-to-remote-debugging-app-instance/vscode-enable-remote-debugging.png)

### Attach Debugger

#### Assign an azure role
Before you attach debugger, you must be granted the role "Azure Spring Apps Remote Debugging Role" because it requires a new Data Action permission `Microsoft.AppPlatform/Spring/apps/deployments/remotedebugging/action`. It can be achieved by the following command:

```azurecli
az role assignment create --role 'Azure Spring Apps Remote Debugging Role' --scope '<Resource id of your service instance>' --assignee '<your identity>'
```

1. Choose one of the app instance and run "Attach Debugger". Vscode will help you to connect to the app instance and start remote debugging.

![Vscode Remote Debugging](./media/how-to-remote-debugging-app-instance/vscode-remote-debugging-instance.png)

 

### Troubleshooting
1. Failed to attach debugger, the error looks like "java.net.SocketException, connection reset", "Failed to attach to remote debugger, ClosedConnectionException"
   
   - Please check the [RBAC role](#assign-an-azure-role) to ensure you are authorized to remote debugging an app instance.
   - Please ensure you access to a valid instance. You can refresh the deployment to get the latest instances.
     
     ![Refresh app instances](./media/how-to-remote-debugging-app-instance/refresh-instance.png)
2. Successfully attach debugger but cannot remote debugging the app instance.
   - Please ensure your ide contains the source code you want to debug.


---

## Limitations
Remote debugging is only supported for java applications.

| Tier                    | Deployment Type   | Supported |
|-------------------------|-------------------|-----------|
| Standard and basic tier | Jar               | Yes       |
| Standard and basic tier | Source code(Java) | Yes       |
| Standard and basic tier | Custom Image      | No        |
| Enterprise tier         | Java Application  | Yes       |
| Enterprise tier         | Source code(Java) | Yes       |
| Enterprise tier         | Custom Image      | No        |



## Tips
- Java remote debugging is very dangerous because it allows remote code execution. ASA will help you to secure the communication among your client ide and the remote application.
Even so, please do disable remote debugging and remove the RBAC role after you finished.
- You'd better scale in the app instance to one to ensure the traffic can go to the instance, it will make your remote debugging easier.