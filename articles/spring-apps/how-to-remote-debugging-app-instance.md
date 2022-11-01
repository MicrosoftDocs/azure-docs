# How to remote debugging App Instance for troubleshooting

This feature enables you to remote debugging java applications in Azure Spring Apps.

## Prerequisites
* Azure CLI and Spring Apps extension are installed.
* App already deployed.
* [Azure Spring Apps Vscode plugin](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-azurespringcloud) is installed.
* [Azure Toolkit for Intellij](https://learn.microsoft.com/en-us/azure/developer/java/toolkit-for-intellij/install-toolkit) is installed

## Assign an Azure role

Before remote debugging the app instances, you must be granted the role "Azure Spring Apps Remote Debugging Role" because it requires a new Data Action permission `Microsoft.AppPlatform/Spring/apps/deployments/remotedebugging/action`. It can be achieved by the following command:

```azurecli
az role assignment create --role 'Azure Spring Apps Remote Debugging Role' --scope '<Resource id of your service instance>' --assignee '<your identity>'
```

## Enable remote debugging
For security, remote debugging is disabled by default. You can enable remote debugging by cli, portal and ide extensions.

### Portal
Go to application page.

1. Select **Remote Debugging**.
2. Enable remote debugging and set the debugging port

![Remote Debugging](./media/how-to-remote-debugging-app-instance/portal-enable-remote-debugging.png)

### Cli
To enable remote debugging
```azurecli
az spring app enable-remote-debugging -n <app name> -d <deloyment name> --resource-group <resource group name> --service <service name> --port <port>
```

To disable remote debugging
```azurecli
az spring app disable-remote-debugging -n <app name> -d <deloyment name> --resource-group <resource group name> --service <service name>
```

To show the configuration of remote debugging
```azurecli
az spring app get-remote-debugging-config -n <app name> -d <deloyment name> --resource-group <resource group name> --service <service name>
```

### Intellij extension
![Intellij Enable Remote Debugging](./media/how-to-remote-debugging-app-instance/intellij-enable-remote-debugging.png)
### Vscode extension
![Vscode Enable Remote Debugging](./media/how-to-remote-debugging-app-instance/vscode-enable-remote-debugging.png)


## Remote debugging app instance
### Vscode
1. Choose one of the app instance and run "Attach Debugger". Vscode will help you to connect to the app instance and start remote debugging.

![Vscode Remote Debugging](./media/how-to-remote-debugging-app-instance/vscode-remote-debugging-instance.png)

### Intellij
1. Choose one of the app instance and run "Attach Debugger". Intellij will help you to connect to the app instance and start remote debugging.

![Vscode Remote Debugging](./media/how-to-remote-debugging-app-instance/intellij-remote-debugging-instance.png)

2. We will create remote debugging configuration for you, you can find it under "Remote Jvm Debug". Please configure the module class path to your source code which is used for remote debugging.
   ![Intellij Remote Debugging configuration](./media/how-to-remote-debugging-app-instance/intellij-remote-debugging-configuration.png)

## Troubleshooting
1. Failed to attach debugger, the error looks like "java.net.SocketException, connection reset", "Failed to attach to remote debugger, ClosedConnectionException"
   
   - Please check the [RBAC role](#assign-an-azure-role) to ensure you are authorized to remote debugging an app instance.
   - Please ensure you access to a valid instance. You can refresh the deployment to get the latest instances.
     
     ![Refresh app instances](./media/how-to-remote-debugging-app-instance/refresh-instance.png)
2. Successfully attach debugger but cannot remote debugging the app instance.
   - Please ensure your ide contains the source code you want to debug.
   - If you are using intellij, please ensure the debug configuration has the [correct module class path](#intellij).


## Limitations
Remote debugging is only supported for java applications.

| Tier                    | Deployment Type   | Supported |
|-------------------------|-------------------|-----------|
| Standard and basic tier | Jar               | Yes       |
| Standard and basic tier | Source code(Java) | Yes       |
| Standard and basic tier | Byoc              | No        |
| Enterprise tier         | Java Application  | Yes       |
| Enterprise tier         | Source code(Java) | Yes       |
| Enterprise tier         | Byoc              | No        |



## Tips
- Java remote debugging is very dangerous because it allows remote code execution. ASA will help you to secure the communication among your client ide and the remote application.
Even so, you'd better disable remote debugging and remove the RBAC role after you finished.
- You'd better scale in the app instance to one to ensure the traffic can go to the instance, it will make your remote debugging easier.