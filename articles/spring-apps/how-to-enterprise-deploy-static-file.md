---
title: Deploy static files in Azure Spring Apps Enterprise tier
titleSuffix: Azure Spring Apps Enterprise tier
description: Learn how to deploy static files in Azure Spring Apps Enterprise tier.
author: karlerickson
ms.author: yili7
ms.service: spring-apps
ms.topic: how-to
ms.date: 10/19/2022
ms.custom: event-tier1-build-2022
---

# Deploy static files in Azure Spring Apps Enterprise tier

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to deploy your static files to Azure Spring Apps Enterprise tier. The static files are served by web servers such as Nginx or Apache HTTP Server.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md).
- One or more applications running in Azure Spring Apps. For more information on creating apps, see [How to Deploy Spring Boot applications from Azure CLI](./how-to-launch-from-source.md).
- [Azure CLI](/cli/azure/install-azure-cli), version 2.0.67 or higher.
- Your static files or dynamic front-end application.

## Deploy your static files

You can deploy static files to Azure Spring Apps using NGINX or HTTPD web servers in the following ways:

- You can deploy static files directly. Azure Spring Apps automatically configures the specified web server to serve the static files.
- You can create your front-end application in the JavaScript framework of your choice, and then deploy your dynamic front-end application as static content.
- You can create a server configuration file to customize the web server.

### Deploy static files directly

Use the following command to deploy static files directly using an auto-generated default server configuration file.

```azurecli
az spring app deploy
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-name> \
    --name <your-app-name> \
    --source-path <path-to-source-code> \
    --build-env BP_WEB_SERVER=nginx
```

For more information, see the [Configure an auto-generated server configuration file](#configure-an-auto-generated-server-configuration-file) section of this article.

### Deploy your front-end application as static content

Use the following command to deploy a dynamic front-end application as static content.

```azurecli
az spring app deploy
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-name> \
    --name <your-app-name> \
    --source-path <path-to-source-code> \
    --build-env BP_WEB_SERVER=nginx BP_NODE_RUN_SCRIPTS=build BP_WEB_SERVER_ROOT=build
```

### Deploy static files using a customized configuration file

Use the following command to deploy static files using a customized server configuration file.

```azurecli
az spring app deploy
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-name> \
    --name <your-app-name> \
    --source-path <path-to-source-code>
```

For more information, see the [Using a customized server configuration file](#using-a-customized-server-configuration-file) section of this article.

## Sample code

> [!NOTE]
> The sample code is maintained by the Paketo open source community.

The [Paketo buildpacks samples](https://github.com/paketo-buildpacks/samples/tree/main/web-servers) demonstrate common use cases for several different application types, including the following use cases:

- Serving static files with a default server configuration file using `BP_WEB_SERVER` to select either [HTTPD](https://github.com/paketo-buildpacks/samples/blob/main/web-servers/no-config-file-sample/HTTPD.md) or [NGINX](https://github.com/paketo-buildpacks/samples/blob/main/web-servers/no-config-file-sample/NGINX.md).
- Using Node Package Manager to build a [React app](https://github.com/paketo-buildpacks/samples/tree/main/web-servers/javascript-frontend-sample) into static files that can be served by a web server. Use the following steps:
  1. Define a script under the `scripts` property of the *package.json* file that builds your production-ready static assets. For React, it's `build`.
  1. Find out where static assets are stored after the build script runs. For React, static assets are stored in `./build` by default.
  1. Set `BP_NODE_RUN_SCRIPTS` to the name of the build script.
  1. Set `BP_WEB_SERVER_ROOT` to the build output directory.
- Serving static files with your own server configuration file, using either [HTTPD](https://github.com/paketo-buildpacks/samples/tree/main/web-servers/httpd-sample) or [NGINX](https://github.com/paketo-buildpacks/samples/tree/main/web-servers/nginx-sample).

## Configure an auto-generated server configuration file

You can use environment variables to modify the auto-generated server configuration file. The following table shows supported environment variables.

| Environment Variable              | Supported Value                                               | Description                                                                                                                                                         |
|------------------------------------|----------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `BP_WEB_SERVER`                   | *nginx* or *httpd*                                            | Specifies the web server type, either *nginx* for Nginx or *httpd* for Apache HTTP server. Required when using the auto-generated server configuration file.        |
| `BP_WEB_SERVER_ROOT`              | An absolute file path or a file path relative to */workspace*. | Sets the root directory for the static files. The default is `public`.                                                                                              |
| `BP_WEB_SERVER_ENABLE_PUSH_STATE` | *true* or *false*                                             | Enables push state routing for your application. Regardless of the route that is requested, *index.html* is always served. Useful for single-page web applications. |
| `BP_WEB_SERVER_FORCE_HTTPS`       | *true* or *false*                                             | Enforces HTTPS for server connections by redirecting all requests to use the HTTPS protocol.                                                                        |

The following environment variables aren't supported.

- `BP_LIVE_RELOAD_ENABLED`
- `BP_NGINX_VERSION`
- `BP_HTTPD_VERSION`

## Using a customized server configuration file

You can configure web server by using a customized server configuration file. Your configuration file must conform to the restrictions described in the following table.

| Configuration                                | Description                                                                                                                                                                                                                                             | Nginx Configuration                                        | Httpd Configuration                          |
|-----------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------|-----------------------------------------------|
| Listening port                               | Web server must listen on port 8080. The service checks the port on TCP for readiness and whether it's live. You must use the templated variable `PORT` in the configuration file. The appropriate port number is injected when the web server is launched. | `listen {{PORT}}`                                          | `Listen "${PORT}"`                           |
| Log path                                     | Config log path to the console.                                                                                                                                                                                                                         | `access_log /dev/stdout`, `error_log stderr`               | `ErrorLog /proc/self/fd/2`                   |
| File path with write permission              | Web server is granted write permission to the */tmp* directory. Configuring the full path requires write permission under the */tmp* directory.                                                                                                             | For example: *client_body_temp_path /tmp/client_body_temp* |                                              |
| Maximum accepted body size of client request | Web server is behind the gateway. The maximum accepted body size of the client request is set to 500m in the gateway and the value for web server must be less than 500m.                                                                               | `client_max_body_size` should be less than 500m.           | `LimitRequestBody` should be less than 500m. |

## Buildpack bindings

Deploying static files to Azure Spring Apps Enterprise tier supports the Dynatrace buildpack binding. The `htpasswd` buildpack binding isn't supported.

For more information, see the [Buildpack bindings](how-to-enterprise-build-service.md#buildpack-bindings) section of [Use Tanzu Build Service](how-to-enterprise-build-service.md).

## Common build and deployment errors

Your deployment of static files to Azure Spring Apps Enterprise tier may generate the following common build errors:

- ERROR: No buildpack groups passed detection.
- ERROR: Please check that you're running against the correct path.
- ERROR: failed to detect: no buildpacks participating

The root cause of these errors is that the web server type isn't specified. To resolve these errors, set the environment variable `BP_WEB_SERVER` to *nginx* or *httpd*.

The following table describes common deployment errors when you deploy static files to Azure Spring Apps Enterprise tier.

| Error message                                                                       | Root cause                                                          | Solution                                                                                                                                                                                                                                                             |
|--------------------------------------------------------------------------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| *112404: Exit code 0: purposely stopped, please refer to `https://aka.ms/exitcode`* | The web server failed to start.                                     | Validate your server configuration file to see if there's a configuration error. Then, check whether your configuration file conforms to the restrictions described in the [Using a customized server configuration file](#using-a-customized-server-configuration-file) section. |
| *mkdir() "/var/client_body_temp" failed (13: Permission denied)*                    | The web server doesn't have write permission to the specified path. | Configure the path under the directory */tmp*; for example: */tmp/client_body_temp*.                                                                                                                                                                                 |

## Next steps

- [Azure Spring Apps](index.yml)
