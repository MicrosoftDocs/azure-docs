---
title: Configure a custom Linux container
description: Learn how to configure a custom Linux container in Azure App Service. This article shows the most common configuration tasks. 

ms.topic: article
ms.date: 03/28/2019
---

# Configure a custom Linux container for Azure App Service

This article shows you how to configure a custom Linux container to run on Azure App Service.

This guide provides key concepts and instructions for containerization of Linux apps in App Service. If you've never used Azure App Service, follow the [custom container quickstart](quickstart-docker-go.md) and [tutorial](tutorial-custom-docker-image.md) first. There's also a [multi-container app quickstart](quickstart-multi-container.md) and [tutorial](tutorial-multi-container-app.md).

## Configure port number

The web server in your custom image may use a port other than 80. You tell Azure about the port that your custom container uses by using the `WEBSITES_PORT` app setting. The GitHub page for the [Python sample in this tutorial](https://github.com/Azure-Samples/docker-django-webapp-linux) shows that you need to set `WEBSITES_PORT` to _8000_. You can set it by running [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set) command in the Cloud Shell. For example:

```azurecli-interactive
az webapp config appsettings set --resource-group <resource-group-name> --name <app-name> --settings WEBSITES_PORT=8000
```

## Configure environment variables

Your custom container may use environment variables that need to be supplied externally. You can pass them in by running [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set) command in the Cloud Shell. For example:

```azurecli-interactive
az webapp config appsettings set --resource-group <resource-group-name> --name <app-name> --settings WORDPRESS_DB_HOST="myownserver.mysql.database.azure.com"
```

This method works both for single-container apps or multi-container apps, where the environment variables are specified in the *docker-compose.yml* file.

## Use persistent shared storage

You can use the */home* directory in your app's file system to persist files across restarts and share them across instances. The `/home` in your app is provided to enable your container app to access persistent storage.

When persistent storage is disabled, then writes to the `/home` directory aren't persisted across app restarts or across multiple instances. The only exception is the `/home/LogFiles` directory, which is used to store the Docker and container logs. When persistent storage is enabled, all writes to the `/home` directory are persisted and can be accessed by all instances of a scaled-out app.

By default, persistent storage is *enabled* and the setting is not exposed in the Application Settings. To disable it, set the `WEBSITES_ENABLE_APP_SERVICE_STORAGE` app setting by running [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set) command in the Cloud Shell. For example:

```azurecli-interactive
az webapp config appsettings set --resource-group <resource-group-name> --name <app-name> --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=false
```

> [!NOTE]
> You can also [configure your own persistent storage](how-to-serve-content-from-azure-storage.md).

## Enable SSH

SSH enables secure communication between a container and a client. In order for a custom container to support SSH, you must add it into the Dockerfile itself.

> [!TIP]
> All built-in Linux containers have added the SSH instructions in their image repositories. You can go through the following instructions with the [Node.js 10.14 repository](https://github.com/Azure-App-Service/node/blob/master/10.14) to see how it's enabled there.

- Use the [RUN](https://docs.docker.com/engine/reference/builder/#run) instruction to install the SSH server and set the password for the root account to `"Docker!"`. For example, for an image based on [Alpine Linux](https://hub.docker.com/_/alpine), you need the following commands:

    ```Dockerfile
    RUN apk add openssh \
         && echo "root:Docker!" | chpasswd 
    ```

    This configuration doesn't allow external connections to the container. SSH is available only through `https://<app-name>.scm.azurewebsites.net` and authenticated with the publishing credentials.

- Add [this sshd_config file](https://github.com/Azure-App-Service/node/blob/master/10.14/sshd_config) to your image repository, and use the [COPY](https://docs.docker.com/engine/reference/builder/#copy) instruction to copy the file to the */etc/ssh/* directory. For more information about *sshd_config* files, see [OpenBSD documentation](https://man.openbsd.org/sshd_config).

    ```Dockerfile
    COPY sshd_config /etc/ssh/
    ```

    > [!NOTE]
    > The *sshd_config* file must include the following items:
    > - `Ciphers` must include at least one item in this list: `aes128-cbc,3des-cbc,aes256-cbc`.
    > - `MACs` must include at least one item in this list: `hmac-sha1,hmac-sha1-96`.

- Use the [EXPOSE](https://docs.docker.com/engine/reference/builder/#expose) instruction to open port 2222 in the container. Although the root password is known, port 2222 is inaccessible from the internet. It's accessible only by containers within the bridge network of a private virtual network.

    ```Dockerfile
    EXPOSE 80 2222
    ```

- In the start-up script for your container, start the SSH server.

    ```bash
    /usr/sbin/sshd
    ```

    For an example, see how the default [Node.js 10.14 container](https://github.com/Azure-App-Service/node/blob/master/10.14/startup/init_container.sh) starts the SSH server.

## Access diagnostic logs

[!INCLUDE [Access diagnostic logs](../../../includes/app-service-web-logs-access-no-h.md)]

## Configure multi-container apps

- [Use persistent storage in Docker Compose](#use-persistent-storage-in-docker-compose)
- [Preview limitations](#preview-limitations)
- [Docker Compose options](#docker-compose-options)

### Use persistent storage in Docker Compose

Multi-container apps like WordPress need persistent storage to function properly. To enable it, your Docker Compose configuration must point to a storage location *outside* your container. Storage locations inside your container don't persist changes beyond app restart.

Enable persistent storage by setting the `WEBSITES_ENABLE_APP_SERVICE_STORAGE` app setting, using the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set) command in Cloud Shell.

```azurecli-interactive
az webapp config appsettings set --resource-group <resource-group-name> --name <app-name> --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=TRUE
```

In your *docker-compose.yml* file, map the `volumes` option to `${WEBAPP_STORAGE_HOME}`. 

`WEBAPP_STORAGE_HOME` is an environment variable in App Service that is mapped to persistent storage for your app. For example:

```yaml
wordpress:
  image: wordpress:latest
  volumes:
  - ${WEBAPP_STORAGE_HOME}/site/wwwroot:/var/www/html
  - ${WEBAPP_STORAGE_HOME}/phpmyadmin:/var/www/phpmyadmin
  - ${WEBAPP_STORAGE_HOME}/LogFiles:/var/log
```

### Preview limitations

Multi-container is currently in preview. The following App Service platform features are not supported:

- Authentication / Authorization
- Managed Identities

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
- volumes

#### Unsupported options

- build (not allowed)
- depends_on (ignored)
- networks (ignored)
- secrets (ignored)
- ports other than 80 and 8080 (ignored)

> [!NOTE]
> Any other options not explicitly called out are ignored in Public Preview.

## Configure VNet integration

Using a custom container with VNet integration may require additional container configuration. See [Integrate your app with an Azure Virtual Network](../web-sites-integrate-with-vnet.md).

[!INCLUDE [robots933456](../../../includes/app-service-web-configure-robots933456.md)]

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Deploy from private container repository](tutorial-custom-docker-image.md)

> [!div class="nextstepaction"]
> [Tutorial: Multi-container WordPress app](tutorial-multi-container-app.md)
