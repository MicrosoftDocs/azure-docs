---
title: Configure a custom container
description: Learn how to configure a custom container in Azure App Service. This article shows the most common configuration tasks. 
author: msangapu-msft
ms.author: msangapu
ms.topic: how-to
ms.date: 10/12/2023
ms.custom: devx-track-azurepowershell, devx-track-azurecli
zone_pivot_groups: app-service-containers-windows-linux
---

# Configure a custom container for Azure App Service

This article shows you how to configure a custom container to run on Azure App Service.

::: zone pivot="container-windows"

This guide provides key concepts and instructions for containerization of Windows apps in App Service. If you've never used Azure App Service, follow the [custom container quickstart](quickstart-custom-container.md) and [tutorial](tutorial-custom-container.md) first.

::: zone-end

::: zone pivot="container-linux"

This guide provides key concepts and instructions for containerization of Linux apps in App Service. If you've never used Azure App Service, follow the [custom container quickstart](quickstart-custom-container.md) and [tutorial](tutorial-custom-container.md) first. There's also a [multi-container app quickstart](quickstart-multi-container.md) and [tutorial](tutorial-multi-container-app.md).

::: zone-end

::: zone pivot="container-windows"

> [!NOTE]
> Service Principal is no longer supported for Windows container image pull authentication. The recommended way is to use Managed Identity for both Windows and Linux containers

## Supported parent images

For your custom Windows image, you must choose the right [parent image (base image)](https://docs.docker.com/develop/develop-images/baseimages/) for the framework you want:

- To deploy .NET Framework apps, use a parent image based on the Windows Server 2019 Core [Long-Term Servicing Channel (LTSC)](/windows-server/get-started/servicing-channels-comparison#long-term-servicing-channel-ltsc) release. 
- To deploy .NET Core apps, use a parent image based on the Windows Server 2019 Nano [Semi-Annual Servicing Channel (SAC)](/windows-server/get-started/servicing-channels-comparison#semi-annual-channel) release. 

It takes some time to download a parent image during app start-up. However, you can reduce start-up time by using one of the following parent images that are already cached in Azure App Service:

- [mcr.microsoft.com/windows/servercore:ltsc2022](https://mcr.microsoft.com/product/windows/servercore/about)
- [mcr.microsoft.com/windows/servercore:ltsc2019](https://mcr.microsoft.com/product/windows/servercore/about)
- [mcr.microsoft.com/dotnet/framework/aspnet](https://mcr.microsoft.com/product/dotnet/framework/aspnet/tags):4.8-windowsservercore-ltsc2022
- [mcr.microsoft.com/dotnet/framework/aspnet](https://mcr.microsoft.com/product/dotnet/framework/aspnet/tags):4.8-windowsservercore-ltsc2019
- [mcr.microsoft.com/dotnet/runtime](https://mcr.microsoft.com/product/dotnet/runtime/tags):6.0-nanoserver-ltsc2022
- [mcr.microsoft.com/dotnet/runtime](https://mcr.microsoft.com/product/dotnet/runtime/tags):6.0-nanoserver-1809
- [mcr.microsoft.com/dotnet/aspnet](https://mcr.microsoft.com/product/dotnet/aspnet/tags):6.0-nanoserver-ltsc2022
- [mcr.microsoft.com/dotnet/aspnet](https://mcr.microsoft.com/product/dotnet/aspnet/tags):6.0-nanoserver-1809

::: zone-end

## Change the Docker image of a custom container

To change an existing custom container from the current Docker image to a new image, use the following command:

```azurecli-interactive
az webapp config container set --name <app-name> --resource-group <group-name> --docker-custom-image-name <docker-hub-repo>/<image>
```

## Use an image from a private registry

To use an image from a private registry, such as Azure Container Registry, run the following command:

```azurecli-interactive
az webapp config container set --name <app-name> --resource-group <group-name> --docker-custom-image-name <image-name> --docker-registry-server-url <private-repo-url> --docker-registry-server-user <username> --docker-registry-server-password <password>
```

For *\<username>* and *\<password>*, supply the login credentials for your private registry account.

## Use managed identity to pull image from Azure Container Registry

Use the following steps to configure your web app to pull from ACR using managed identity. The steps will use system-assigned managed identity, but you can use user-assigned managed identity as well.

1. Enable [the system-assigned managed identity](./overview-managed-identity.md) for the web app by using the [`az webapp identity assign`](/cli/azure/webapp/identity#az-webapp-identity-assign) command:

    ```azurecli-interactive
    az webapp identity assign --resource-group <group-name> --name <app-name> --query principalId --output tsv
    ```
    Replace `<app-name>` with the name you used in the previous step. The output of the command (filtered by the --query and --output arguments) is the service principal ID of the assigned identity, which you use shortly.
1. Get the resource ID of your Azure Container Registry:
    ```azurecli-interactive
    az acr show --resource-group <group-name> --name <registry-name> --query id --output tsv
    ```
    Replace `<registry-name>` with the name of your registry. The output of the command (filtered by the --query and --output arguments) is the resource ID of the Azure Container Registry.
1. Grant the managed identity permission to access the container registry:

    ```azurecli-interactive
    az role assignment create --assignee <principal-id> --scope <registry-resource-id> --role "AcrPull"
    ```

    Replace the following values:
    - `<principal-id>` with the service principal ID from the `az webapp identity assign` command
    - `<registry-resource-id>` with the ID of your container registry from the `az acr show` command

    For more information about these permissions, see [What is Azure role-based access control](../role-based-access-control/overview.md).

1. Configure your app to use the managed identity to pull from Azure Container Registry.

    ```azurecli-interactive
    az webapp config set --resource-group <group-name> --name <app-name> --generic-configurations '{"acrUseManagedIdentityCreds": true}'
    ```

    Replace the following values:
    - `<app-name>` with the name of your web app.
    >[!Tip]
    > If you are using PowerShell console to run the commands, you will need to escape the strings in the `--generic-configurations` argument in this and the next step. For example: `--generic-configurations '{\"acrUseManagedIdentityCreds\": true'`
1. (Optional) If your app uses a [user-assigned managed identity](overview-managed-identity.md#add-a-user-assigned-identity), make sure this is configured on the web app and then set an additional `acrUserManagedIdentityID` property to specify its client ID:
    
    ```azurecli-interactive
    az identity show --resource-group <group-name> --name <identity-name> --query clientId --output tsv
    ```
    Replace the `<identity-name>` of your user-assigned managed identity and use the output `<client-id>` to configure the user-assigned managed identity ID.

    ```azurecli-interactive
    az  webapp config set --resource-group <group-name> --name <app-name> --generic-configurations '{"acrUserManagedIdentityID": "<client-id>"}'
    ```

You are all set, and the web app will now use managed identity to pull from Azure Container Registry. 

## Use an image from a network protected registry

To connect and pull from a registry inside a virtual network or on-premises, your app will need to be connected to a virtual network using the virtual network integration feature. This is also needed for Azure Container Registry with private endpoint. When your network and DNS resolution is configured, you enable the routing of the image pull through the virtual network by configuring the `vnetImagePullEnabled` site setting:

```azurecli-interactive
az resource update --resource-group <group-name> --name <app-name> --resource-type "Microsoft.Web/sites" --set properties.vnetImagePullEnabled [true|false]
```

## I don't see the updated container

If you change your Docker container settings to point to a new container, it may take a few minutes before the app serves HTTP requests from the new container. While the new container is being pulled and started, App Service continues to serve requests from the old container. Only when the new container is started and ready to receive requests does App Service start sending requests to it.

## How container images are stored

The first time you run a custom Docker image in App Service, App Service does a `docker pull` and pulls all image layers. These layers are stored on disk, like if you were using Docker on-premises. Each time the app restarts, App Service does a `docker pull`, but only pulls layers that have changed. If there have been no changes, App Service uses existing layers on the local disk.

If the app changes compute instances for any reason, such as scaling up and down the pricing tiers, App Service must pull down all layers again. The same is true if you scale out to add additional instances. There are also rare cases where the app instances may change without a scale operation.

## Configure port number

By default, App Service assumes your custom container is listening on port 80. If your container listens to a different port, set the `WEBSITES_PORT` app setting in your App Service app. You can set it via the [Cloud Shell](https://shell.azure.com). In Bash:

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings WEBSITES_PORT=8000
```

In PowerShell:

```azurepowershell-interactive
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -AppSettings @{"WEBSITES_PORT"="8000"}
```

App Service currently allows your container to expose only one port for HTTP requests. 

## Configure environment variables

Your custom container may use environment variables that need to be supplied externally. You can pass them in via the [Cloud Shell](https://shell.azure.com). In Bash:

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings DB_HOST="myownserver.mysql.database.azure.com"
```

In PowerShell:

```azurepowershell-interactive
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -AppSettings @{"DB_HOST"="myownserver.mysql.database.azure.com"}
```

When your app runs, the App Service app settings are injected into the process as environment variables automatically. You can verify container environment variables with the URL `https://<app-name>.scm.azurewebsites.net/Env`.

If your app uses images from a private registry or from Docker Hub, credentials for accessing the repository are saved in environment variables: `DOCKER_REGISTRY_SERVER_URL`, `DOCKER_REGISTRY_SERVER_USERNAME` and `DOCKER_REGISTRY_SERVER_PASSWORD`. Because of security risks, none of these reserved variable names are exposed to the application.

::: zone pivot="container-windows"
For IIS or .NET Framework (4.0 or above) based containers, they're injected into `System.ConfigurationManager` as .NET app settings and connection strings automatically by App Service. For all other language or framework, they're provided as environment variables for the process, with one of the following corresponding prefixes:

- `APPSETTING_`
- `SQLCONTR_`
- `MYSQLCONTR_`
- `SQLAZURECOSTR_`
- `POSTGRESQLCONTR_`
- `CUSTOMCONNSTR_`

::: zone-end

::: zone pivot="container-linux"

This method works both for single-container apps or multi-container apps, where the environment variables are specified in the *docker-compose.yml* file.

::: zone-end

## Use persistent shared storage

::: zone pivot="container-windows"

You can use the *C:\home* directory in your custom container file system to persist files across restarts and share them across instances. The `C:\home` directory is provided to enable your custom container to access persistent storage.

When persistent storage is disabled, then writes to the `C:\home` directory are not persisted across app restarts or across multiple instances. When persistent storage is enabled, all writes to the `C:\home` directory are persisted and can be accessed by all instances of a scaled-out app. Additionally, any contents inside the `C:\home` directory of the container are overwritten by any existing files already present on the persistent storage when the container starts.

The only exception is the `C:\home\LogFiles` directory, which is used to store the container and application logs. This folder will always persist upon app restarts if [application logging is enabled](troubleshoot-diagnostic-logs.md?#enable-application-logging-windows) with the **File System** option, independently of the persistent storage being enabled or disabled. In other words, enabling or disabling the persistent storage will not affect the application logging behavior.

By default, persistent storage is *disabled* on Windows custom containers. To enable it, set the `WEBSITES_ENABLE_APP_SERVICE_STORAGE` app setting value to `true` via the [Cloud Shell](https://shell.azure.com). In Bash:

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=true
```

In PowerShell:

```azurepowershell-interactive
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -AppSettings @{"WEBSITES_ENABLE_APP_SERVICE_STORAGE"=true}
```

::: zone-end

::: zone pivot="container-linux"

You can use the */home* directory in your custom container file system to persist files across restarts and share them across instances. The `/home` directory is provided to enable your custom container to access persistent storage. Saving data within `/home` will contribute to the [storage space quota](../azure-resource-manager/management/azure-subscription-service-limits.md#app-service-limits) included with your App Service Plan.

When persistent storage is disabled, then writes to the `/home` directory are not persisted across app restarts or across multiple instances. When persistent storage is enabled, all writes to the `/home` directory are persisted and can be accessed by all instances of a scaled-out app. Additionally, any contents inside the `/home` directory of the container are overwritten by any existing files already present on the persistent storage when the container starts.

The only exception is the `/home/LogFiles` directory, which is used to store the container and application logs. This folder will always persist upon app restarts if [application logging is enabled](troubleshoot-diagnostic-logs.md#enable-application-logging-linuxcontainer) with the **File System** option, independently of the persistent storage being enabled or disabled. In other words, enabling or disabling the persistent storage will not affect the application logging behavior.

It is recommended to write data to `/home` or a [mounted Azure storage path](configure-connect-to-azure-storage.md?tabs=portal&pivots=container-linux). Data written outside these paths will not be persistent during restarts and will be saved to platform-managed host disk space separate from the App Service Plans file storage quota.

By default, persistent storage is *enabled* on Linux custom containers. To disable it, set the `WEBSITES_ENABLE_APP_SERVICE_STORAGE` app setting value to `false` via the [Cloud Shell](https://shell.azure.com). In Bash:

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=false
```

In PowerShell:

```azurepowershell-interactive
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -AppSettings @{"WEBSITES_ENABLE_APP_SERVICE_STORAGE"=false}
```

::: zone-end

> [!NOTE]
> You can also [configure your own persistent storage](configure-connect-to-azure-storage.md).

## Detect HTTPS session

App Service terminates TLS/SSL at the front ends. That means that TLS/SSL requests never get to your app. You don't need to, and shouldn't implement any support for TLS/SSL into your app. 

The front ends are located inside Azure data centers. If you use TLS/SSL with your app, your traffic across the Internet will always be safely encrypted.

::: zone pivot="container-windows"

## Customize ASP.NET machine key injection

 During the container start, automatically generated keys are injected into the container as the machine keys for ASP.NET cryptographic routines. You can [find these keys in your container](#connect-to-the-container) by looking for the following environment variables: `MACHINEKEY_Decryption`, `MACHINEKEY_DecryptionKey`, `MACHINEKEY_ValidationKey`, `MACHINEKEY_Validation`. 

The new keys at each restart may reset ASP.NET forms authentication and view state, if your app depends on them. To prevent the automatic regeneration of keys, [set them manually as App Service app settings](#configure-environment-variables). 

## Connect to the container

You can connect to your Windows container directly for diagnostic tasks by navigating to `https://<app-name>.scm.azurewebsites.net/` and choosing the SSH option. A direct SSH session with your container is established in which you can run commands inside your container

- It functions separately from the graphical browser above it, which only shows the files in your [shared storage](#use-persistent-shared-storage).
- In a scaled-out app, the SSH session is connected to one of the container instances. You can select a different instance from the **Instance** dropdown in the top Kudu menu.
- Any change you make to the container from within the SSH session does *not* persist when your app is restarted (except for changes in the shared storage), because it's not part of the Docker image. To persist your changes, such as registry settings and software installation, make them part of the Dockerfile.

## Access diagnostic logs

App Service logs actions by the Docker host as well as activities from within the container. Logs from the Docker host (platform logs) are shipped by default, but application logs or web server logs from within the container need to be enabled manually. For more information, see [Enable application logging](troubleshoot-diagnostic-logs.md#enable-application-logging-linuxcontainer) and [Enable web server logging](troubleshoot-diagnostic-logs.md#enable-web-server-logging). 

There are several ways to access Docker logs:

- [In the Azure portal](#in-azure-portal)
- [From the Kudu console](#from-the-kudu-console)
- [With the Kudu API](#with-the-kudu-api)
- [Send logs to Azure monitor](troubleshoot-diagnostic-logs.md#send-logs-to-azure-monitor)

### In Azure portal

Docker logs are displayed in the portal, in the **Container Settings** page of your app. The logs are truncated, but you can download all the logs clicking **Download**. 

### From the Kudu console

Navigate to `https://<app-name>.scm.azurewebsites.net/DebugConsole` and click the **LogFiles** folder to see the individual log files. To download the entire **LogFiles** directory, click the **Download** icon to the left of the directory name. You can also access this folder using an FTP client.

In the console terminal, you can't access the `C:\home\LogFiles` folder by default because persistent shared storage is not enabled. To enable this behavior in the console terminal, [enable persistent shared storage](#use-persistent-shared-storage).

If you try to download the Docker log that is currently in use using an FTP client, you may get an error because of a file lock.

### With the Kudu API

Navigate directly to `https://<app-name>.scm.azurewebsites.net/api/logs/docker` to see metadata for the Docker logs. You may see more than one log file listed, and the `href` property lets you download the log file directly. 

To download all the logs together in one ZIP file, access `https://<app-name>.scm.azurewebsites.net/api/logs/docker/zip`.

## Customize container memory

By default all Windows Containers deployed in Azure App Service have a memory limit configured.  The following table lists the default settings per App Service Plan SKU. 

| App Service Plan SKU | Default memory limit per app in MB |
|-|-|
| P1v3 | 1024 |
| P1Mv3 | 1024 |
| P2v3 | 1536 |
| P2Mv3 | 1536 |
| P3v3 | 2048 |
| P3Mv3 | 2048 |
| P4Mv3 | 2560 |
| P5Mv3 | 3072 |

You can change this value by providing the `WEBSITE_MEMORY_LIMIT_MB` app setting via the [Cloud Shell](https://shell.azure.com). In Bash:

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings WEBSITE_MEMORY_LIMIT_MB=2000
```

In PowerShell:

```azurepowershell-interactive
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -AppSettings @{"WEBSITE_MEMORY_LIMIT_MB"=2000}
```

The value is defined in MB and must be less and equal to the total physical memory of the host. For example, in an App Service plan with 8 GB RAM, the cumulative total of `WEBSITE_MEMORY_LIMIT_MB` for all the apps must not exceed 8 GB. Information on how much memory is available for each pricing tier can be found in [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/windows/), in the **Premium v3 service plan** section.

## Customize the number of compute cores

By default, a Windows container runs with all available cores for your chosen pricing tier. You may want to reduce the number of cores that your staging slot uses, for example. To reduce the number of cores used by a container, set the `WEBSITE_CPU_CORES_LIMIT` app setting to the preferred number of cores. You can set it via the [Cloud Shell](https://shell.azure.com). In Bash:

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --slot staging --settings WEBSITE_CPU_CORES_LIMIT=1
```

In PowerShell:

```azurepowershell-interactive
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -AppSettings @{"WEBSITE_CPU_CORES_LIMIT"=1}
```

> [!NOTE]
> Updating the app setting triggers automatic restart, causing minimal downtime. For a production app, consider swapping it into a staging slot, change the app setting in the staging slot, and then swap it back into production.

Verify your adjusted number by going to the Kudu Console (`https://<app-name>.scm.azurewebsites.net`) and typing in the following commands using PowerShell. Each command outputs a number.

```PowerShell
Get-ComputerInfo | ft CsNumberOfLogicalProcessors # Total number of enabled logical processors. Disabled processors are excluded.
Get-ComputerInfo | ft CsNumberOfProcessors # Number of physical processors.
```

The processors may be multicore or hyperthreading processors. Information on how many cores are available for each pricing tier can be found in [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/windows/), in the **Premium v3 service plan** section.

## Customize health ping behavior

App Service considers a container to be successfully started when the container starts and responds to an HTTP ping. The health ping request contains the header `User-Agent= "App Service Hyper-V Container Availability Check"`. If the container starts but does not respond to a ping after a certain amount of time, App Service logs an event in the Docker log, saying that the container didn't start. 

If your application is resource-intensive, the container might not respond to the HTTP ping in time. To control the actions when HTTP pings fail, set the `CONTAINER_AVAILABILITY_CHECK_MODE` app setting. You can set it via the [Cloud Shell](https://shell.azure.com). In Bash:

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings CONTAINER_AVAILABILITY_CHECK_MODE="ReportOnly"
```

In PowerShell:

```azurepowershell-interactive
Set-AzWebApp -ResourceGroupName <group-name> -Name <app-name> -AppSettings @{"CONTAINER_AVAILABILITY_CHECK_MODE"="ReportOnly"}
```

The following table shows the possible values:

| Value | Descriptions |
| - | - |
| **Repair** | Restart the container after three consecutive availability checks |
| **ReportOnly** | The default value. Don't restart the container but report in the Docker logs for the container after three consecutive availability checks. |
| **Off** | Don't check for availability. |

## Support for Group Managed Service Accounts

Group Managed Service Accounts (gMSAs) are currently not supported in Windows containers in App Service.

::: zone-end

::: zone pivot="container-linux"

## Enable SSH

Secure Shell (SSH) is commonly used to execute administrative commands remotely from a command-line terminal. In order to enable the Azure portal SSH console feature with custom containers, the following steps are required:

1. Create a standard [sshd_config](https://man.openbsd.org/sshd_config) file with the following example contents and place it on the application project root directory:
    
    ```
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
    > This file configures OpenSSH and must include the following items in order to comply with the Azure portal SSH feature:
    > - `Port` must be set to 2222.
    > - `Ciphers` must include at least one item in this list: `aes128-cbc,3des-cbc,aes256-cbc`.
    > - `MACs` must include at least one item in this list: `hmac-sha1,hmac-sha1-96`.
    
2. Create an entrypoint script with the name `entrypoint.sh` (or change any existing entrypoint file) and add the command to start the SSH service, along with the application startup command. The following example demonstrates starting a Python application. Please replace the last command according to the project language/stack:
    
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
    
3. Add to the Dockerfile the following instructions according to the base image distribution. The same will copy the new files, install OpenSSH server, set proper permissions and configure the custom entrypoint, and expose the ports required by the application and SSH server, respectively:
    
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
    > The root password must be exactly `Docker!` as it is used by App Service to let you access the SSH session with the container. This configuration doesn't allow external connections to the container. Port 2222 of the container is accessible only within the bridge network of a private virtual network and is not accessible to an attacker on the internet.

4. Rebuild and push the Docker image to the registry, and then test the Web App SSH feature on Azure portal.

For further troubleshooting additional information is available at the Azure App Service OSS blog: [Enabling SSH on Linux Web App for Containers](https://azureossd.github.io/2022/04/27/2022-Enabling-SSH-on-Linux-Web-App-for-Containers/index.html#troubleshooting)

## Access diagnostic logs

[!INCLUDE [Access diagnostic logs](../../includes/app-service-web-logs-access-linux-no-h.md)]

## Configure multi-container apps

- [Use persistent storage in Docker Compose](#use-persistent-storage-in-docker-compose)
- [Preview limitations](#preview-limitations)
- [Docker Compose options](#docker-compose-options)

### Use persistent storage in Docker Compose

Multi-container apps like WordPress need persistent storage to function properly. To enable it, your Docker Compose configuration must point to a storage location *outside* your container. Storage locations inside your container don't persist changes beyond app restart.

Enable persistent storage by setting the `WEBSITES_ENABLE_APP_SERVICE_STORAGE` app setting, using the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command in [Cloud Shell](https://shell.azure.com).

```azurecli-interactive
az webapp config appsettings set --resource-group <group-name> --name <app-name> --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=TRUE
```

In your *docker-compose.yml* file, map the `volumes` option to `${WEBAPP_STORAGE_HOME}`. 

`WEBAPP_STORAGE_HOME` is an environment variable in App Service that is mapped to persistent storage for your app. For example:

```yaml
wordpress:
  image: <image name:tag>
  volumes:
  - ${WEBAPP_STORAGE_HOME}/site/wwwroot:/var/www/html
  - ${WEBAPP_STORAGE_HOME}/phpmyadmin:/var/www/phpmyadmin
  - ${WEBAPP_STORAGE_HOME}/LogFiles:/var/log
```

### Preview limitations

Multi-container is currently in preview. The following App Service platform features are not supported:

- Authentication / Authorization
- Managed Identities
- CORS
- Virtual network integration is not supported for Docker Compose scenarios
- Docker Compose on Azure App Services currently has a limit of 4,000 characters at this time.

### Docker Compose options

The following lists show supported and unsupported Docker Compose configuration options:

#### Supported options

- command
- entrypoint
- environment
- image
- ports
- restart
- services
- volumes ([mapping to Azure Storage is unsupported](configure-connect-to-azure-storage.md?tabs=portal&pivots=container-linux#limitations))

#### Unsupported options

- build (not allowed)
- [depends_on](faq-app-service-linux.yml#how-do-i-use-depends-on-) (ignored)
- networks (ignored)
- secrets (ignored)
- ports other than 80 and 8080 (ignored)
- default environment variables like `$variable and ${variable}` unlike in docker
#### Syntax Limitations

- "version x.x" always needs to be the first YAML statement in the file
- ports section must use quoted numbers
- image > volume section must be quoted and cannot have permissions definitions
- volumes section must not have an empty curly brace after the volume name

> [!NOTE]
> Any other options not explicitly called out are ignored in Public Preview.

[!INCLUDE [robots933456](../../includes/app-service-web-configure-robots933456.md)]

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Migrate custom software to Azure App Service using a custom container](tutorial-custom-container.md)

::: zone pivot="container-linux"

> [!div class="nextstepaction"]
> [Tutorial: Multi-container WordPress app](tutorial-multi-container-app.md)

::: zone-end

Or, see additional resources:

- [Environment variables and app settings reference](reference-app-settings.md)
- [Load certificate in Windows/Linux containers](configure-ssl-certificate-in-code.md#load-certificate-in-linuxwindows-containers)
