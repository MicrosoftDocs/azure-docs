---
title: Build environment variables for Java in Azure Container Apps
description: Learn about Java image build from source code via environment variables.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: devx-track-extended-java
ms.topic: conceptual
ms.date: 02/27/2024
ms.author: cshoe
---

# Build environment variables for Java in Azure Container Apps

Azure Container Apps uses [Buildpacks](https://buildpacks.io/) to automatically create a container image that allows you to deploy from your source code directly to the cloud. To take control of your build configuration, you can use environment variables to customize parts of your build like the JDK, Maven, and Tomcat. The following article shows you how to configure environment variables to help you take control over builds that automatically create a container for you.

## Supported Java build environment variables

### Configure JDK

Container Apps use [Microsoft Build of OpenJDK](https://www.microsoft.com/openjdk) to build source code and as the runtime environment. Four LTS JDK versions are supported: 8, 11, 17 and 21.

- For source code build, the default version is JDK 17.

- For a JAR file build, the JDK version is read from the file location `META-INF\MANIFEST.MF` in the JAR, but uses the default JDK version 17 if the specified version isn't available.
  
Here's a listing of the environment variables used to configure JDK:

| Environment variable | Description | Default |
|--|--|--|
| `BP_JVM_VERSION` | Controls the JVM version. | `17` |

### Configure Maven

Container Apps supports building Maven-based applications from source.

Here's a listing of the environment variables used to configure Maven:

| Build environment variable | Description | Default |
|--|--|--|
| `BP_MAVEN_VERSION` | Sets the major Maven version. Since Buildpacks only ships a single version of each supported line, updates to the buildpack can change the exact version of Maven installed. If you require a specific minor/patch version of Maven, use the Maven wrapper instead. | `3` |
| `BP_MAVEN_BUILD_ARGUMENTS` | Defines the arguments passed to Maven. The `--batch-mode` is prepended to the argument list in environments without a TTY. | `-Dmaven.test.skip=true --no-transfer-progress package` |
| `BP_MAVEN_ADDITIONAL_BUILD_ARGUMENTS` | Defines extra arguments used (for example, `-DskipJavadoc` appended to `BP_MAVEN_BUILD_ARGUMENTS`) to pass to Maven. |  |
| `BP_MAVEN_ACTIVE_PROFILES` | Comma separated list of active profiles passed to Maven. |  |
| `BP_MAVEN_BUILT_MODULE` | Designates application artifact that contains the module. By default, the build looks in the root module. | |
| `BP_MAVEN_BUILT_ARTIFACT` | Location of the built application artifact. This value supersedes the `BP_MAVEN_BUILT_MODULE` variable. You can match a single file, multiple files, or a directory through one or more space separated patterns. | `target/*.[ejw]ar` |
| `BP_MAVEN_POM_FILE` | Specifies a custom location to the project's *pom.xml* file. This value is relative to the root of the project (for example, */workspace*). | `pom.xml` |
| `BP_MAVEN_DAEMON_ENABLED` | Triggers the installation and configuration of Apache `maven-mvnd` instead of Maven. Set this value to `true` if you want to the Maven Daemon. | `false` |
| `BP_MAVEN_SETTINGS_PATH` | Specifies a custom location to Maven's *settings.xml* file. |  |
| `BP_INCLUDE_FILES` | Colon separated list of glob patterns to match source files. Any matched file is retained in the final image. |  |
| `BP_EXCLUDE_FILES` | Colon separated list of glob patterns to match source files. Any matched file is removed from the final image. Any include patterns are applied first, and you can use "exclude patterns" to reduce the files included in the build. |  |
| `BP_JAVA_INSTALL_NODE` | Control whether or not a separate Buildpack installs Yarn and Node.js. If set to `true`, the Buildpack checks the app root or path set by `BP_NODE_PROJECT_PATH`. The project path looks for either a *yarn.lock* file, which requires the installation of Yarn and Node.js. If there's a *package.json* file, then the build only requires Node.js. | `false` |
| `BP_NODE_PROJECT_PATH` | Direct the project subdirectory to look for *package.json* and *yarn.lock* files. |  |

### Configure Tomcat

Container Apps supports running war file in Tomcat application server.

Here's a listing of the environment variables used to configure Tomcat:

| Build environment variable | Description | Default |
|--|--|--|
| `BP_TOMCAT_CONTEXT_PATH` | The context path where the application is mounted. | Defaults to empty (`ROOT`) |
| `BP_TOMCAT_EXT_CONF_SHA256` | The SHA256 hash of the external configuration package. |  |
| `BP_TOMCAT_ENV_PROPERTY_SOURCE_DISABLED` | When set to `true`, the Buildpack doesn't configure `org.apache.tomcat.util.digester.EnvironmentPropertySource`. This configuration option is added to support loading configuration from environment variables and referencing them in Tomcat configuration files. |  |
| `BP_TOMCAT_EXT_CONF_STRIP` | The number of directory levels to strip from the external configuration package. | `0` |
| `BP_TOMCAT_EXT_CONF_URI` | The download URI of the external configuration package. |  |
| `BP_TOMCAT_EXT_CONF_VERSION` | The version of the external configuration package. |  |
| `BP_TOMCAT_VERSION` | Used to configure a specific Tomcat version. Supported Tomcat versions include 8, 9, and 10. | `9.*` |

### Configure Cloud Build Service

Here's a listing of the environment variables used to configure a Cloud Build Service:

| Build environment variable | Description | Default |
|--|--|--|
| `ORYX_DISABLE_TELEMETRY` | Controls whether or not to disable telemetry collection. | `false` |

## How to configure Java build environment variables

You can configure Java build environment variables when you deploy Java application source code via CLI command `az containerapp up`, `az containerapp create`, or `az containerapp update`:

```azurecli
az containerapp up \
  --name <CONTAINER_APP_NAME> \
  --source <SOURCE_DIRECTORY> \
  --build-env-vars <NAME=VALUE NAME=VALUE> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --environment <ENVIRONMENT_NAME>
```

The `build-env-vars` argument is a list of environment variables for the build, space-separated values in `key=value` format. Here's an example list you can pass in as variables:

```bash
BP_JVM_VERSION=21 BP_MAVEN_VERSION=4 "BP_MAVEN_BUILD_ARGUMENTS=-Dmaven.test.skip=true --no-transfer-progress package"
```

You can also configure the Java build environment variables when you [set up GitHub Actions with Azure CLI in Azure Container Apps](github-actions-cli.md).

```azurecli
az containerapp github-action add \
  --repo-url "https://github.com/<OWNER>/<REPOSITORY_NAME>" \
  --build-env-vars <NAME=VALUE NAME=VALUE> \
  --branch <BRANCH_NAME> \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --registry-url <URL_TO_CONTAINER_REGISTRY> \
  --registry-username <REGISTRY_USER_NAME> \
  --registry-password <REGISTRY_PASSWORD> \
  --service-principal-client-id <appId> \
  --service-principal-client-secret <password> \
  --service-principal-tenant-id <tenant> \
  --token <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>
```

## Next steps

> [!div class="nextstepaction"]
> [Build and deploy from a repository](quickstart-code-to-cloud.md)
