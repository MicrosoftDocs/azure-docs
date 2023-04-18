---
title: Configuration overview for Azure Static Web Apps
description: Learn about the different ways to configure Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 09/08/2021
ms.author: cshoe
---

# Configuration overview

The following different concepts apply to configuring a static web app.

- [Application configuration](./configuration.md): Define rules in the `staticwebapp.config.json` file to control application behavior and features. Use this file to define route and security rules, custom headers, and networking settings.

- [Build configuration](./build-configuration.md): Define settings that control the build process.

- [Application settings](./application-settings.md): Set application-level settings and environment variables that can be used by backend APIs.

## Example scenarios

| If you want to... | then... |
|---|---|
| Define routing rules | [Create rules in the staticwebapp.config.json file](./configuration.md) |
| Set which branch triggers builds | [Update the tracked branch name in the build configuration file](./build-configuration.md)  |
| Define which security roles have access to a route | [Secure routes with roles in the staticwebapp.config.json file](./configuration.md#securing-routes-with-roles) |
| Set which HTML file is served if a route doesn't match an actual file | [Define fallback route in the staticwebapp.config.json file](./configuration.md#fallback-routes) |
| Set global headers for HTTP requests | [Define global headers in the staticwebapp.config.json file](./configuration.md#global-headers)|
| Define a custom build command | [Set a custom build command value in the application configuration file](./build-configuration.md) |
| Set an environment variable for a frontend build | [Define an environment variable in the build configuration file](./build-configuration.md#environment-variables) |
| Set an environment variable for an API | [Set an application setting in the portal](./application-settings.md) |

## Next steps

> [!div class="nextstepaction"]
> [Application configuration](configuration.md)
