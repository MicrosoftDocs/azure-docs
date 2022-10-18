---
title: Deploy static files in Azure Spring Enterprise tier
titleSuffix: Azure Spring Apps Enterprise tier
description: Learn how to deploy static files in Azure Spring Apps Enterprise tier.
author: yilims
ms.author: yili7
ms.service: spring-apps
ms.topic: how-to
ms.date: 10/09/2022
ms.custom: event-tier1-build-2022
---

# Deploy static files in Azure Spring Enterprise tier

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to deploy your static files to Azure Spring Apps Enterprise tier. The static files are served by web servers such as Nginx or Apache HTTP Server.

## Overview

Azure Spring Apps allows you to deploy static files using the popular NGINX or HTTPD web servers:

- You can deploy static files directly and the specified web server is configured automatically to serve those static assets.
- You can create your frontend application in the JavaScript framework of your choice, deploy your dynamic frontend application as static content.
- You can create a server configuration file to customize the web server.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md).
- One or more applications running in Azure Spring Apps. For more information on creating apps, see [How to Deploy Spring Boot applications from Azure CLI](./how-to-launch-from-source.md).
- [Azure CLI](/cli/azure/install-azure-cli), version 2.0.67 or higher.
- Your static files or dynamic frontend application.

## Deploy your static files

- To deploy the static files with the default server configuration file generated automatically, see [Configure auto-generated server configuration file](#configure-auto-generated-server-configuration-file), use the following command:

```azurecli
az spring app deploy
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-name> \
    --name <your-app-name> \
    --source-path <path-to-source-code> \
    --build-env BP_WEB_SERVER=nginx
```

- To deploy dynamic frontend application as static content, use the following command:

```azurecli
az spring app deploy
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-name> \
    --name <your-app-name> \
    --source-path <path-to-source-code> \
    --build-env BP_WEB_SERVER=nginx BP_NODE_RUN_SCRIPTS=build BP_WEB_SERVER_ROOT=build
```

- To deploy the static files with customized server configuration file, see [Customized server configuration file restriction](#customized-server-configuration-file-restriction), use the following command:

```azurecli
az spring app deploy
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-name> \
    --name <your-app-name> \
    --source-path <path-to-source-code>
```

## Sample code

> [!NOTE]
> The sample code is maintained by Paketo open source community.

The [Paketo samples](https://github.com/paketo-buildpacks/samples/tree/main/web-servers) have several different application types demonstrate common use cases such as:

- Serving static files with default server configuration file, using BP_WEB_SERVER to select either [HTTPD](https://github.com/paketo-buildpacks/samples/blob/main/web-servers/no-config-file-sample/HTTPD.md) or [NGINX](https://github.com/paketo-buildpacks/samples/blob/main/web-servers/no-config-file-sample/NGINX.md).
- Using NPM to build a [React app](https://github.com/paketo-buildpacks/samples/tree/main/web-servers/javascript-frontend-sample) into static files that can be served by a web server:
  - Define a script under the "scripts" property of your package.json that builds your production-ready static assets. For React, it's "build".
  - Find out where static assets are stored after the build script runs. For React, static assets are stored in `./build` by default.
  - BP_NODE_RUN_SCRIPTS should be set to the name of the build script.
  - BP_WEB_SERVER_ROOT should be set to the build output directory.
- Serving static files with your own server configuration file. using either [HTTPD](https://github.com/paketo-buildpacks/samples/tree/main/web-servers/httpd-sample) or [NGINX](https://github.com/paketo-buildpacks/samples/tree/main/web-servers/nginx-sample)

## Configure auto-generated server configuration file

You can use environment variables to tweak the auto-generated server configuration file.

Supported environment variables:

|Environment Variable|Supported Value|Description|
|--------------------|---------------|-----------|
|BP_WEB_SERVER|nginx or httpd|Specify web server type: "nginx" for Nginx and "httpd" for Apache HTTP server. Required when using the auto-generated server configuration file.|
|BP_WEB_SERVER_ROOT|an absolute file path or a file path relative to /workspace|Defaults to public, set the root directory for the static files.|
|BP_WEB_SERVER_ENABLE_PUSH_STATE|true or false|Enable push state routing for your application. Regardless of the route that is requested, index.html will always be served. It's useful for single-page web applications.|
|BP_WEB_SERVER_FORCE_HTTPS|true or false|Enforce HTTPS for server connections by redirecting all requests to use the HTTPS protocol.|

Unsupported environment variables:

- BP_LIVE_RELOAD_ENABLED
- BP_NGINX_VERSION
- BP_HTTPD_VERSION

## Customized server configuration file restriction

You can configure web server by providing a customized server configuration file. Your configuration file must conform to the following restrictions:

|Configuration|Description|Nginx Configuration|Httpd Configuration|
|-------------|-----------|-----|-----|
|Listening port|Web server must listen on port 8080. The service checks the port on TCP for readiness and liveness. Required to use templated variable PORT in the configuration file. The appropriate port number is injected when the web server is launched|listen {{PORT}}|Listen "${PORT}"|
|Log path|Config log path to the console| access_log /dev/stdout, error_log stderr| ErrorLog /proc/self/fd/2|
|File path with write permission|Web server is granted write permission to directory /tmp, configure all the path requires write permission under directory /tmp | For example: client_body_temp_path /tmp/client_body_temp||
|Maximum accepted body size of client request|Web server is behind the gateway, maximum accepted body size of client request is set to 500m in the gateway, the value for web server must be less than 500m | client_max_body_size should be less than 500m|LimitRequestBody should be less than 500m|

## Buildpack bindings

Supported [Buildpack bindings](how-to-enterprise-build-service.md#buildpack-bindings)

- Dynatrace

Unsupported Buildpack bindings

- htpasswd

## Common build error

|Error Message|Root Cause|Solution|
|-------------|----------|--------|
|ERROR: No buildpack groups passed detection. ERROR: Please check that you're running against the correct path. ERROR: failed to detect: no buildpacks participating|Web server type isn't specified|set environment variable BP_WEB_SERVER to nginx or httpd|

## Common deployment error

|Error Message|Root Cause|Solution|
|-------------|----------|--------|
|112404: Exit code 0: purposely stopped, please refer to `https://aka.ms/exitcode` |Web server failed to start|Validate your server configuration file to see if there's any configuration error, double check if your configuration file conforms to [Customized server configuration file restriction](#customized-server-configuration-file-restriction)|
|mkdir() "/var/client_body_temp" failed (13: Permission denied)|Web server doesn't have write permission to the specified path|Configure the path under directory /tmp, for example: /tmp/client_body_temp|

## Next steps

- [Azure Spring Apps](index.yml)
