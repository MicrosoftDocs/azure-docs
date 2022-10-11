---
title: Static Files
titleSuffix: Azure Spring Apps Enterprise Tier
description: How to Deploy Static File in Azure Spring Apps Enterprise Tier
author: yilims
ms.author: yili7
ms.service: spring-apps
ms.topic: how-to
ms.date: 10/09/2022
ms.custom: event-tier1-build-2022
---

# Static files

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to deploy your static files to Azure Spring Apps Enterprise tier. The static files are served by web servers like Nginx or Apache HTTP Server

## Overview
Azure Spring Apps allows you to deploy static files using the popular NGINX or HTTPD web servers, with a variety of utilities for ease of use:
- You can deploy static files directly and the specified web server is configured automatically to serve those static assets.
- You can create your frontend application in the JavaScript framework of your choice, deploy your dynamic frontend application as static content.
- You can create a server configuration file to customize the web server.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md).
- One or more applications running in Azure Spring Apps. For more information on creating apps, see [How to Deploy Spring Boot applications from Azure CLI](./how-to-launch-from-source.md).
- [Azure CLI](/cli/azure/install-azure-cli), version 2.0.67 or higher.
- Your static files or dynamic frontend application.

## Deploy your static files

* To deploy the static files with the default server configuration file generated automatically, see [Configure web server via environment variables](#configure-web-server-via-environment-variables), use the following command:

```azurecli
az spring app deploy
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-name> \
    --name <your-app-name> \
    --source-path <path-to-source-code> \
    --build-env BP_WEB_SERVER=nginx
```
Refer to [Paketo samples](https://github.com/paketo-buildpacks/samples/tree/main/web-servers) for serving static files with default server configuration file, using BP_WEB_SERVER to select either [HTTPD](https://github.com/paketo-buildpacks/samples/blob/main/web-servers/no-config-file-sample/HTTPD.md) or [NGINX](https://github.com/paketo-buildpacks/samples/blob/main/web-servers/no-config-file-sample/NGINX.md).
> [!NOTE]
> The sample code is maintained by Paketo open source community.

* To deploy dynamic frontend application as static content, use the following command:

```azurecli
az spring app deploy
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-name> \
    --name <your-app-name> \
    --source-path <path-to-source-code> \
    --build-env BP_WEB_SERVER=nginx BP_NODE_RUN_SCRIPTS=build BP_WEB_SERVER_ROOT=build
```
Refer to [Paketo frontend applicaiton sample](https://github.com/paketo-buildpacks/samples/tree/main/web-servers/javascript-frontend-sample) for using NPM to build a React app into static files that can be served by a web server .

* To deploy the static files with customized server configuration file, see [Customized server configuration file restriction](#customized-server-configuration-file-restriction), use the following command:

```azurecli
az spring app deploy
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-name> \
    --name <your-app-name> \
    --source-path <path-to-source-code>
```
Refer to Paketo samples for serving static files with your own server configuration file, using either [HTTPD](https://github.com/paketo-buildpacks/samples/tree/main/web-servers/httpd-sample) or [NGINX](https://github.com/paketo-buildpacks/samples/tree/main/web-servers/nginx-sample).

## Configure web server via environment variables
You can use environment variables to tweak the automatically-generated server configuration file. Supported environment variables:
|Environment Variable|Description|
|--------------------|-----------|
|BP_WEB_SERVER|Specify web server type: "nginx" for Nginx and "httpd" for Apache HTTP server.<br> It's required when using automatically-generated server configuration file.|
|BP_WEB_SERVER_ROOT|Defaults to public, setting this allows you to modify the location of the static files served by the web server with either an absolute path or a path relative to the app directory.|
|BP_NODE_RUN_SCRIPTS|Define a script under the "scripts" property of your package.json that builds your production-ready static assets. Most frameworks bootstrap this automatically. For React, it's "build". Set the BP_NODE_RUN_SCRIPTS to specify which scripts to run. BP_WEB_SERVER_ROOT should be set to the build output directory. For React, this is ./build by default.|
|BP_WEB_SERVER_ENABLE_PUSH_STATE|Enable push state routing for your application. This means that regardless of the route that is requested, index.html will always be served. This comes in handy if you are serving a Javascript frontend app where the route exists within the app but not on the static file structure.|
|BP_WEB_SERVER_FORCE_HTTPS|Enforce HTTPS for server connections by redirecting all requests to use the HTTPS protocol.|

```azurecli
az spring app deploy
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-name> \
    --name <your-app-name> \
    --source-path <path-to-source-code>
    --build-env BP_WEB_SERVER=httpd BP_WEB_SERVER_ROOT=htdocs
```
Refer to [NGINX doc](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-nginx-nginx-buildpack.html) and [HTTPD doc](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-httpd-httpd-buildpack.html) for more environment variables.

## Customized server configuration file restriction
You can configure web server by providing a customized server configuration file. Your configuration file must conform to the following restrictions:
|Configuration|Description|Nginx Configuration|Httpd Configuration|
|-------------|-----------|-----|-----|
|Listening port|Web server must listen on port 8080. The service checks the port on TCP for readiness and liveness. It's requried to use templated variable PORT in the configuration file and the appropriate port number is injected when the web server is launched|listen {{PORT}};|Listen "${PORT}"|
|Log path|Config log path to the console| access_log /dev/stdout; error_log /dev/stderr;| ErrorLog "/dev/stderr"|
|File path with write permission|Web server is granted write permssion to directory /tmp, configure all the path requires write permission under directory /tmp | For example: <br/> client_body_temp_path /tmp/client_body_temp;||
|Maximum accepted body size of client request|Web server is behind the gateway, maximum accepted body size of client request is set to 500m in the gateway, the vaue for web server must be less than 500m | client_max_body_size should be less than 500m|LimitRequestBody should be less than 500m|

## Common build error
|Error Message|Root Cause|Solution|
|-------------|-----------|--------|
|ERROR: No buildpack groups passed detection.<br> ERROR: Please check that you are running against the correct path.<br> ERROR: failed to detect: no buildpacks participating|Web server type is not specified|set environment variable BP_WEB_SERVER to nginx or httpd|

## Common deployment error
|Error Message|Description|Solution|
|-------------|-----------|--------|
|: invalid log ptah, failed to start: /var/client_body_temp" failed (13: Permission denied)<br/> 112404: Exit code 1: application error.|Web server doesn't have write permission to the specified path|configure the path under directory /tmp, for example: /tmp/client_body_temp |


## Next steps

- [Azure Spring Apps](index.yml)
