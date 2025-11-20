---
title: Configure a Custom Container
description: Learn how to configure a custom container in Azure App Service. This article shows the most common configuration tasks. 
author: msangapu-msft
ms.author: msangapu
ms.topic: how-to
ms.date: 03/06/2025
ms.custom: devx-track-azurepowershell, devx-track-azurecli, linux-related-content
zone_pivot_groups: app-service-containers-windows-linux
ms.service: azure-app-service
---

# Configure a custom container for Azure App Service

This article shows you how to configure a custom container to run on Azure App Service.

::: zone pivot="container-windows"

Learn about key concepts and get instructions for containerization of Windows apps in App Service. New users should first follow the [custom container quickstart](quickstart-custom-container.md) and [tutorial](tutorial-custom-container.md).

::: zone-end

::: zone pivot="container-linux"

Learn about key concepts and get instructions for containerization of Linux apps in App Service. New users should first follow the [custom container quickstart](quickstart-custom-container.md) and [tutorial](tutorial-custom-container.md). For sidecar containers, see [Tutorial: Configure a sidecar container for custom container in Azure App Service](tutorial-custom-container-sidecar.md).

::: zone-end

::: zone pivot="container-windows"

> [!NOTE]
> Using a service principal for Windows container image pull authentication is no longer supported. We recommend that you use managed identity for both Windows and Linux containers.

## Supported parent images

Select the right [parent image (base image)](https://docs.docker.com/develop/develop-images/baseimages/) for the framework you want for your custom Windows image:

- To deploy .NET Framework apps, use a parent image based on the Windows Server 2019 Core [Long-Term Servicing Channel](/windows-server/get-started/servicing-channels-comparison#long-term-servicing-channel-ltsc) release.
- To deploy .NET Core apps, use a parent image based on the Windows Server 2019 Nano [Annual Channel](/windows-server/get-started/servicing-channels-comparison#annual-channel-ac) release.

It takes some time to download a parent image during app startup. You can reduce startup time by using one of the following parent images that are already cached in Azure App Service:

- [mcr.microsoft.com/windows/servercore:ltsc2022](https://mcr.microsoft.com/product/windows/servercore/about)
- [mcr.microsoft.com/windows/servercore:ltsc2019](https://mcr.microsoft.com/product/windows/servercore/about)
- [mcr.microsoft.com/dotnet/framework/aspnet](https://mcr.microsoft.com/product/dotnet/framework/aspnet/tags): `4.8-windowsservercore-ltsc2022`
- [mcr.microsoft.com/dotnet/framework/aspnet](https://mcr.microsoft.com/product/dotnet/framework/aspnet/tags): `4.8-windowsservercore-ltsc2019`
- [mcr.microsoft.com/dotnet/runtime](https://mcr.microsoft.com/product/dotnet/runtime/tags): `6.0-nanoserver-ltsc2022`
- [mcr.microsoft.com/dotnet/runtime](https://mcr.microsoft.com/product/dotnet/runtime/tags): `6.0-nanoserver-1809`
- [mcr.microsoft.com/dotnet/aspnet](https://mcr.microsoft.com/product/dotnet/aspnet/tags): `6.0-nanoserver-ltsc2022`
- [mcr.microsoft.com/dotnet/aspnet](https://mcr.microsoft.com/product/dotnet/aspnet/tags): `6.0-nanoserver-1809`

::: zone-end

## Change the Docker image of a custom container

Use the following command to change the current Docker image to a new image in an existing custom container:

```azurecli-interactive
az webapp config container set --name <app-name> --resource-group <group-name> --docker-custom-image-name <docker-hub-repo>/<image>
```

## Use an image from a private registry

To use an image from a private registry, such as Azure Container Registry, run the following command:

```azurecli-interactive
az webapp config container set --name <app-name> --resource-group <group-name> --docker-custom-image-name <image-name> --docker-registry-server-url <private-repo-url> --docker-registry-server-user <username> --docker-registry-server-password <password>
```

Supply the sign-in credentials for your private registry account in the `\<username>` and `\<password>` fields.

## Use managed identity to pull an image from Azure Container Registry

Use the following steps to configure your web app to pull from Azure Container Registry by using managed identity. The steps use system-assigned managed identity, but you can also use user-assigned managed identity.

1. Enable [the system-assigned managed identity](./overview-managed-identity.md) for the web app by using the [`az webapp identity assign`](/cli/azure/webapp/identity#az-webapp-identity-assign) command:

   ```azurecli-interactive
   az webapp identity assign --resource-group <group-name> --name <app-name> --query principalId --output tsv
   ```

   Replace *\<app-name>* with the name you used in the previous step. The output of the command, filtered by the `--query` and `--output` arguments, is the service principal ID of the assigned identity.

1. Get the resource ID of your container registry:

   ```azurecli-interactive
   az acr show --resource-group <group-name> --name <registry-name> --query id --output tsv
   ```

   Replace *\<registry-name>* with the name of your registry. The output of the command, filtered by the `--query` and `--output` arguments, is the resource ID of the container registry.

1. Grant the managed identity permission to access the container registry:

   ```azurecli-interactive
   az role assignment create --assignee <principal-id> --scope <registry-resource-id> --role "AcrPull"
   ```

   Replace the following values:

   - *\<principal-id>* with the service principal ID from the `az webapp identity assign` command
   - *\<registry-resource-id>* with the ID of your container registry from the `az acr show` command

   For more information about these permissions, see [What is Azure role-based access control?](../role-based-access-control/overview.md).

1. Configure your app to use the managed identity to pull from Azure Container Registry.

   ```azurecli-interactive
   az webapp config set --resource-group <group-name> --name <app-name> --generic-configurations '{"acrUseManagedIdentityCreds": true}'
   ```

   Replace the following values:

   - *\<app-name>* with the name of your web app.

   > [!TIP]
   > If you use PowerShell console to run the commands, escape the strings in the `--generic-configurations` argument in this step and the next step. For example: `--generic-configurations '{\"acrUseManagedIdentityCreds\": true'`.

1. (Optional) If your app uses a [user-assigned managed identity](overview-managed-identity.md#add-a-user-assigned-identity), make sure the identity is configured on the web app and then set the `acrUserManagedIdentityID` property to specify its client ID:

   ```azurecli-interactive
   az identity show --resource-group <group-name> --name <identity-name> --query clientId --output tsv
   ```

   Replace the `<identity-name>` of your user-assigned managed identity and use the output `<client-id>` to configure the user-assigned managed identity ID.

   ```azurecli-interactive
   az  webapp config set --resource-group <group-name> --name <app-name> --generic-configurations '{"acrUserManagedIdentityID": "<client-id>"}'
   ```

The web app now uses managed identity to pull from Azure Container Registry.

## Use an image from a network-protected registry

To connect and pull from a registry inside a virtual network or on-premises, your app must integrate with a virtual network. You also need virtual network integration for Azure Container Registry with a private endpoint. After you configure your network and DNS resolution, enable the routing of the image pull through the virtual network. Configure the `vnetImagePullEnabled` site setting:

```azurecli-interactive
az resource update --resource-group <group-name> --name <app-name> --resource-type "Microsoft.Web/sites" --set properties.vnetImagePullEnabled [true|false]
```

### Troubleshoot what to do if you don't see the updated container

If you change your Docker container settings to point to a new container, it might take a few minutes before the app serves HTTP requests from the new container. While the new container is pulled and started, App Service continues to serve requests from the old container. App Service only sends requests to the new container after it starts and is ready to receive requests.

### Learn how container images are stored

The first time you run a custom Docker image in App Service, App Service performs the `docker pull` command and pulls all image layers. The layers are stored on disk, the same as when you use Docker on-premises. Each time the app restarts, App Service performs the `docker pull` command. It pulls only changed layers. If there are no changes, App Service uses existing layers on the local disk.

If the app changes compute instances for any reason (like changing pricing tiers), App Service must again pull all layers. The same is true if you scale out to add more instances. Also, in rare cases, the app instances might change without a scale operation.

## Configure port number

By default, App Service assumes your custom container listens on port 80. If your container listens to a different port, set the `WEBSITES_PORT` app setting in your App Service app. You can set it by using [Azure Cloud Shell](https://shell.azure.com). In Bash, use the following command:

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings WEBSITES_PORT=8000
```

In PowerShell, use the following command:

```azurepowershell-interactive
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -AppSettings @{"WEBSITES_PORT"="8000"}
```

App Service currently allows your container to expose only one port for HTTP requests.

## Configure environment variables

Your custom container might use environment variables that you need to supply externally. You can pass them in by using [Cloud Shell](https://shell.azure.com). In Bash, use the following command:

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings DB_HOST="myownserver.mysql.database.azure.com"
```

In PowerShell, use the following command:

```azurepowershell-interactive
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -AppSettings @{"DB_HOST"="myownserver.mysql.database.azure.com"}
```

When your app runs, the App Service app settings are automatically injected into the process as environment variables. You can verify container environment variables with the URL `https://<app-name>.scm.azurewebsites.net/Env`.

When you SSH into a container with custom Docker images, you might see only a few environment variables if you try to use commands like `env` or `printenv`. To see all environment variables within the container, like ones you pass in to your application for runtime usage, add this line to your entrypoint script:

```docker endpoint
eval $(printenv | sed -n "s/^\([^=]\+\)=\(.*\)$/export \1=\2/p" | sed 's/"/\\\"/g' | sed '/=/s//="/' | sed 's/$/"/' >> /etc/profile)
```

See a [full example](https://github.com/azureossd/docker-container-ssh-examples/blob/main/alpine-node/init_container.sh).

If your app uses images from a private registry or from Docker Hub, the credentials for accessing the repository are saved in environment variables: `DOCKER_REGISTRY_SERVER_URL`, `DOCKER_REGISTRY_SERVER_USERNAME`, and `DOCKER_REGISTRY_SERVER_PASSWORD`. Because of security risks, none of these reserved variable names are exposed to the application.

::: zone pivot="container-windows"
For Internet Information Services (IIS) or .NET Framework (4.0 or later) containers, credentials are automatically injected into `System.ConfigurationManager` as .NET app settings and connection strings by App Service. For all other languages or frameworks, they're provided as environment variables for the process, with one of the following prefixes:

- `APPSETTING_`
- `SQLCONTR_`
- `MYSQLCONTR_`
- `SQLAZURECOSTR_`
- `POSTGRESQLCONTR_`
- `CUSTOMCONNSTR_`

::: zone-end

::: zone pivot="container-linux"

You can use this method for both single-container or multi-container apps, where the environment variables are specified in the `docker-compose.yml` file.

::: zone-end

## Use persistent shared storage

::: zone pivot="container-windows"

You can use the `C:\home` directory in your custom container file system to persist files across restarts and share them across instances. When you use the `C:\home` directory, your custom container can access persistent storage.

When persistent storage is disabled, writes to the `C:\home` directory aren't persisted across app restarts or across multiple instances. When persistent storage is enabled, all writes to the `C:\home` directory persist. All instances of a scaled-out app can access them. When the container starts, if any files are present on the persistent storage, they overwrite any contents in the `C:\home` directory of the container.

The only exception is the `C:\home\LogFiles` directory. This directory stores the container and application logs. The folder always persists upon app restarts if [application logging is enabled](troubleshoot-diagnostic-logs.md?#enable-application-logging-windows) with the **File System** option, whether or not persistent storage is enabled. In other words, when you enable or disable persistent storage, it doesn't affect application logging behavior.

By default, persistent storage is *enabled* on Windows custom containers. To disable it, set the `WEBSITES_ENABLE_APP_SERVICE_STORAGE` app setting value to `false` by using [Cloud Shell](https://shell.azure.com). In Bash, use the following command:

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=false
```

In PowerShell, use the following command:

```azurepowershell-interactive
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -AppSettings @{"WEBSITES_ENABLE_APP_SERVICE_STORAGE"=false}
```

::: zone-end

::: zone pivot="container-linux"

You can use the `/home` directory in your custom container file system to persist files across restarts and share them across instances. When you use the `C:\home` directory, your custom container can access persistent storage. Keep in mind that data that you save within `/home` contributes to the [storage space quota](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-app-service-limits) included with your App Service plan.

When persistent storage is disabled, writes to the `C:\home` directory aren't persisted across app restarts or across multiple instances. When persistent storage is enabled, all writes to the `C:\home` directory persist. All instances of a scaled-out app can access them. When the container starts, if any files are present on the persistent storage, they overwrite any contents in the `C:\home` directory of the container.

The only exception is the `C:\home\LogFiles` directory. This directory stores the container and application logs. The folder always persists upon app restarts if [application logging is enabled](troubleshoot-diagnostic-logs.md?#enable-application-logging-windows) with the **File System** option, whether or not persistent storage is enabled. In other words, when you enable or disable persistent storage, it doesn't affect application logging behavior.

We recommend that you write data to `/home` or a [mounted Azure storage path](configure-connect-to-azure-storage.md?tabs=portal&pivots=container-linux). Data that you write outside these paths isn't persistent during restarts. The data is saved to platform-managed host disk space separate from the App Service plans file storage quota.

By default, persistent storage is *disabled* on Linux custom containers. To enable it, set the `WEBSITES_ENABLE_APP_SERVICE_STORAGE` app setting value to `true` by using [Cloud Shell](https://shell.azure.com). In Bash, use the following command:

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=true
```

In PowerShell, use the following command:

```azurepowershell-interactive
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -AppSettings @{"WEBSITES_ENABLE_APP_SERVICE_STORAGE"=true}
```

::: zone-end

> [!NOTE]
> You can also [configure your own persistent storage](configure-connect-to-azure-storage.md).

## Detect HTTPS session

App Service terminates TLS at the front ends. That means that TLS requests never get to your app. You don't need to, and shouldn't, implement any support for TLS into your app.

The front ends are located inside Azure datacenters. If you use TLS with your app, your traffic across the internet is always safely encrypted.

::: zone pivot="container-windows"

## Customize ASP.NET machine key injection

 During the container start, keys are automatically generated and injected into the container as the machine keys for ASP.NET cryptographic routines. You can [find these keys in your container](#connect-to-the-container) by looking for the following environment variables: `MACHINEKEY_Decryption`, `MACHINEKEY_DecryptionKey`, `MACHINEKEY_ValidationKey`, and `MACHINEKEY_Validation`.

The new keys at each restart might reset ASP.NET forms authentication and view state, if your app depends on them. To prevent the automatic regeneration of keys, [set them manually as App Service app settings](#configure-environment-variables).

## Connect to the container

To connect to your Windows container directly for diagnostic tasks, go to `https://<app-name>.scm.azurewebsites.net/` and select the SSH option. This option establishes a direct SSH session in which you can run commands inside your container.

- It functions separately from the graphical browser above it, which only shows the files in your [shared storage](#use-persistent-shared-storage).
- In a scaled-out app, the SSH session connects to one of the container instances. You can select a different instance from the **Instance** dropdown list in the top Kudu menu.
- Except for changes in the shared storage, any change you make to the container from within the SSH session *doesn't* persist when your app restarts. These changes aren't part of the Docker image. To persist changes like registry settings and software installation, make them part of the Dockerfile.

## Access diagnostic logs

App Service logs actions by the Docker host and activities from within the container. Logs from the Docker host (platform logs) are enabled by default. You need to manually enable application logs or web server logs from within the container. For more information, see [Enable application logging](troubleshoot-diagnostic-logs.md#enable-application-logging-linuxcontainer) and [Enable web server logging](troubleshoot-diagnostic-logs.md#enable-web-server-logging).

You can access Docker logs in several ways:

- [Azure portal](#azure-portal)
- [Kudu](#kudu)
- [Kudu API](#kudu-api)
- [Azure Monitor](troubleshoot-diagnostic-logs.md#send-logs-to-azure-monitor)

### Azure portal

Docker logs are displayed in the Azure portal in the **Container Settings** pane of your app. The logs are truncated. To download all the logs, select **Download**.

### Kudu

To see the individual log files, go to `https://<app-name>.scm.azurewebsites.net/DebugConsole` and select the `LogFiles` folder. To download the entire `LogFiles` directory, select the **Download** icon to the left of the directory name. You can also access this folder by using an FTP client.

By default, you can't access the `C:\home\LogFiles` folder in the SSH terminal because persistent shared storage isn't enabled. To enable this behavior in the console terminal, [enable persistent shared storage](#use-persistent-shared-storage).

If you try to download the Docker log that's currently in use by using an FTP client, you might get an error because of a file lock.

### Kudu API

Go directly to `https://<app-name>.scm.azurewebsites.net/api/logs/docker` to see metadata for the Docker logs. You might see more than one log file listed. You can use the `href` property to directly download the log file.

To download all the logs together in one ZIP file, access `https://<app-name>.scm.azurewebsites.net/api/logs/docker/zip`.

## Customize container memory

By default, all Windows containers deployed in Azure App Service have a memory limit configured. The following table lists the default settings per App Service plan SKU.

| App Service plan SKU | Default memory limit per app (in MB) |
|:-----|:-----|
| P1v3 | 1024 |
| P1Mv3 | 1024 |
| P2v3 | 1536 |
| P2Mv3 | 1536 |
| P3v3 | 2048 |
| P3Mv3 | 2048 |
| P4Mv3 | 2560 |
| P5Mv3 | 3072 |

You can change this value by providing the `WEBSITE_MEMORY_LIMIT_MB` app setting in [Cloud Shell](https://shell.azure.com). In Bash, use the following command:

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings WEBSITE_MEMORY_LIMIT_MB=2000
```

In PowerShell, use the following command:

```azurepowershell-interactive
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -AppSettings @{"WEBSITE_MEMORY_LIMIT_MB"=2000}
```

The value is defined in megabytes (MB) and must be less and equal to the total physical memory of the host. For example, in an App Service plan with 8 GB of RAM, the cumulative total of `WEBSITE_MEMORY_LIMIT_MB` for all the apps can't exceed 8 GB. For more information on how much memory is available, see the Premium v3 service plan in [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/windows/).

## Customize the number of compute cores

By default, a Windows container runs with all available cores for your pricing tier. You might want to reduce the number of cores that your staging slot uses. To reduce the number of cores that a container uses, set the `WEBSITE_CPU_CORES_LIMIT` app setting to the preferred number of cores. You can set it by using [Cloud Shell](https://shell.azure.com). In Bash, use the following command:

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --slot staging --settings WEBSITE_CPU_CORES_LIMIT=1
```

In PowerShell, use the following command:

```azurepowershell-interactive
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -AppSettings @{"WEBSITE_CPU_CORES_LIMIT"=1}
```

> [!TIP]
> Updating the app setting triggers automatic restart, which causes minimal downtime. For a production app, consider swapping it into a staging slot. Change the app setting in the staging slot, and then swap it back into production.

To verify your adjusted number, open an SSH session by using the Azure portal or the Kudu portal (`https://<app-name>.scm.azurewebsites.net/webssh/host`). Enter the following commands by using PowerShell. Each command returns a number.

```PowerShell
Get-ComputerInfo | ft CsNumberOfLogicalProcessors # Total number of enabled logical processors. Disabled processors are excluded.
Get-ComputerInfo | ft CsNumberOfProcessors # Number of physical processors.
```

The processors might be multicore or hyper-threading processors. To find out how many cores are available, see the Premium v3 service plan in [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/windows/).

## Customize health ping behavior

App Service considers a container to be successfully started when the container starts and responds to an HTTP ping. The health ping request contains the header `User-Agent= "App Service Hyper-V Container Availability Check"`. If the container starts but doesn't respond to pings after a certain amount of time, App Service logs an event in the Docker log.

If your application is resource intensive, the container might not respond to the HTTP ping in time. To control what happens when HTTP pings fail, set the `CONTAINER_AVAILABILITY_CHECK_MODE` app setting. You can set it by using [Cloud Shell](https://shell.azure.com). In Bash, use the following command:

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings CONTAINER_AVAILABILITY_CHECK_MODE="ReportOnly"
```

In PowerShell, use the following command:

```azurepowershell-interactive
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -AppSettings @{"CONTAINER_AVAILABILITY_CHECK_MODE"="ReportOnly"}
```

The following table shows the possible values:

| Value | Description |
|:---|:---|
| `Repair` | Restart the container after three consecutive availability checks. |
| `ReportOnly` | The default value. Report the container in the Docker logs after three consecutive availability checks, but don't restart it. |
| `Off` | Don't check for availability. |

## Support for group managed service accounts

Group managed service accounts aren't supported in Windows containers in App Service.

::: zone-end

::: zone pivot="container-linux"

## Enable SSH

You can use Secure Shell (SSH) to remotely run administrative commands from a command-line terminal. To enable the Azure portal SSH console feature with custom containers, follow these steps:

1. Create a standard `sshd_config` file with the following example contents and place it on the application project root directory:

   ```console
   Port 			2222
   ListenAddress 		0.0.0.0
   LoginGraceTime 		180
   X11Forwarding 		yes
   Ciphers aes128-cbc,3des-cbc,aes256-cbc,aes128-ctr,aes192-ctr,aes256-ctr
   MACs hmac-sha1,hmac-sha1-96
   StrictModes 		yes
   SyslogFacility 		DAEMON
   PasswordAuthentication 	yes
   PermitEmptyPasswords 	no
   PermitRootLogin 	yes
   Subsystem sftp internal-sftp
   ```

   > [!NOTE]
   > This file configures OpenSSH and must include the following items to comply with the Azure portal SSH feature:
   >
   > - The `Port` value must be set to `2222`.
   > - The `Ciphers` values must include at least one item in this list: `aes128-cbc`, `3des-cbc`, or `aes256-cbc`.
   > - The `MACs` values must include at least one item in this list: `hmac-sha1` or `hmac-sha1-96`.

1. Create an entrypoint script named `entrypoint.sh` or change any existing entrypoint file. Add the command to start the SSH service, along with the application startup command. The following example demonstrates starting a Python application. Replace the last command according to the project language or stack:

   ### [Debian](#tab/debian)

   ```Bash
   #!/bin/sh
   set -e
   service ssh start
   exec gunicorn -w 4 -b 0.0.0.0:8000 app:app
   ```

   ### [Alpine](#tab/alpine)

   ```Bash
   #!/bin/sh
   set -e
   /usr/sbin/sshd
   exec gunicorn -w 4 -b 0.0.0.0:8000 app:app
   ```
   ---

1. Add the following instructions to the Dockerfile according to the base image distribution. These instructions copy the new files, install the OpenSSH server, set proper permissions and configure the custom entrypoint, and expose the ports required by the application and SSH server, respectively:

   ### [Debian](#tab/debian)

   ```Dockerfile
   COPY entrypoint.sh ./
    
   # Start and enable SSH
   RUN apt-get update \
       && apt-get install -y --no-install-recommends dialog \
       && apt-get install -y --no-install-recommends openssh-server \
       && echo "root:Docker!" | chpasswd \
       && chmod u+x ./entrypoint.sh
   COPY sshd_config /etc/ssh/
    
   EXPOSE 8000 2222
    
   ENTRYPOINT [ "./entrypoint.sh" ] 
   ```

   ### [Alpine](#tab/alpine)

   ```Dockerfile
   COPY sshd_config /etc/ssh/
   COPY entrypoint.sh ./
    
   # Start and enable SSH
   RUN apk add openssh \
       && echo "root:Docker!" | chpasswd \
       && chmod +x ./entrypoint.sh \
       && cd /etc/ssh/ \
       && ssh-keygen -A
    
   EXPOSE 8000 2222
    
   ENTRYPOINT [ "./entrypoint.sh" ]
   ```
   ---

   > [!NOTE]
   > The root password must be exactly `Docker!` because App Service uses it to grant you access to the SSH session with the container. This configuration doesn't allow external connections to the container. The container's port `2222` is accessible only within the bridge network of a private virtual network. An attacker on the internet can't access it.

1. Rebuild and push the Docker image to the registry, and then test the **Web App SSH** feature in the Azure portal.

For more troubleshooting information, see the Azure App Service blog: [Enable SSH on a Linux web app for containers](https://azureossd.github.io/2022/04/27/2022-Enabling-SSH-on-Linux-Web-App-for-Containers/index.html#troubleshooting).

## Access diagnostic logs

[!INCLUDE [Access diagnostic logs](../../includes/app-service-web-logs-access-linux-no-h.md)]

## Configure multi-container apps

> [!NOTE]
> The Docker Compose feature will be retired on March 31, 2027. Sidecar containers succeed multi-container apps in App Service. For new services, see [Tutorial: Configure a sidecar container for custom container in Azure App Service](tutorial-custom-container-sidecar.md). For existing multi-container apps in App Service, see [Migrate your Docker Compose applications to the sidecar feature](https://azure.github.io/AppService/2025/04/01/Docker-compose-migration.html).

- [Use persistent storage in Docker Compose](#use-persistent-storage-in-docker-compose)
- [Preview limitations](#preview-limitations)
- [Docker Compose options](#docker-compose-options)

### Use persistent storage in Docker Compose

Multi-container apps like WordPress need persistent storage to function properly. To enable persistent storage, your Docker Compose configuration must point to a storage location *outside* your container. Storage locations inside your container don't persist changes beyond app restart.

To enable persistent storage, set the `WEBSITES_ENABLE_APP_SERVICE_STORAGE` app setting. Use the [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command in [Cloud Shell](https://shell.azure.com).

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=TRUE
```

In your `docker-compose.yml` file, map the `volumes` option to `${WEBAPP_STORAGE_HOME}`.

`WEBAPP_STORAGE_HOME` is an environment variable in App Service that maps to persistent storage for your app. For example:

```yaml
wordpress:
  image: <image name:tag>
  volumes:
  - "${WEBAPP_STORAGE_HOME}/site/wwwroot:/var/www/html"
  - "${WEBAPP_STORAGE_HOME}/phpmyadmin:/var/www/phpmyadmin"
  - "${WEBAPP_STORAGE_HOME}/LogFiles:/var/log"
```

### Preview limitations

Multi-container is currently in preview. The following App Service platform features aren't supported:

- Authentication or authorization.
- Managed identities.
- Cross-origin resource sharing (CORS).
- Virtual network integration with Docker Compose scenarios.

Docker Compose on Azure App Service currently has a limit of 4,000 characters.

### Docker Compose options

The following sections show supported and unsupported Docker Compose configuration options.

#### Supported options

- `command`
- `entrypoint`
- `environment`
- `image`
- `ports`
- `restart`
- `services`
- `volumes` ([Mapping to Azure Storage is unsupported](configure-connect-to-azure-storage.md?tabs=portal&pivots=container-linux#limitations))

#### Unsupported options

- `build` (not allowed)
- [`depends_on`](faq-app-service-linux.yml#how-do-i-use-depends-on-) (ignored)
- `networks` (ignored)
- `secrets` (ignored)
- Ports other than `80` and `8080` (ignored)
- Default environment variables like `$variable` and `${variable}` (unlike in Docker)

#### Syntax limitations

- The first YAML statement in the file always needs to be `version x.x`.
- The ports section must use quoted numbers.
- The `image > volume` section must be quoted and can't have permissions definitions.
- The volumes section can't include an empty curly brace after the volume name.

> [!NOTE]
> Any other options not explicitly mentioned are ignored in preview.

[!INCLUDE [robots933456](../../includes/app-service-web-configure-robots933456.md)]

::: zone-end

## Related content

- [Tutorial: Migrate custom software to Azure App Service by using a custom container](tutorial-custom-container.md)
- [Tutorial: Configure a sidecar container for custom container in Azure App Service](tutorial-custom-container-sidecar.md)
- [Environment variables and app settings reference](reference-app-settings.md)
- [Load certificates in Windows/Linux containers](configure-ssl-certificate-in-code.md#load-certificates-in-linuxwindows-containers)
