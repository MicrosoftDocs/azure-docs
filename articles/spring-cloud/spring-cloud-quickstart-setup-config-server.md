---
title: "Quickstart - Set up Azure Spring Cloud configuration server"
description: Describes set up of Azure Spring Cloud config server for app deployment.
author: MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 08/03/2020
ms.custom: devx-track-java
---

# Quickstart: Set up Azure Spring Cloud configuration server

Azure Spring Cloud Config server is centralized configuration service for distributed systems. It uses a pluggable repository layer that currently supports local storage, Git, and Subversion.  Set up the config server to deploy microservice apps to Azure Spring Cloud.

## Prerequisites

* [Install JDK 8](https://docs.microsoft.com/java/azure/jdk/?view=azure-java-stable)
* [Sign up for an Azure subscription](https://azure.microsoft.com/free/)
* (Optional) [Install the Azure CLI version 2.0.67 or higher](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) and install the Azure Spring Cloud extension with command: `az extension add --name spring-cloud`
* (Optional) [Install the Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053-azure-toolkit-for-intellij/) and [sign-in](https://docs.microsoft.com/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app#installation-and-sign-in)

## Azure Spring Cloud config server procedures

#### [Portal](#tab/Azure-portal)

The following procedure sets up the config server using the Azure portal to deploy the [Piggymetrics sample](spring-cloud-quickstart-sample-app-introduction.md).

1. Go to the service **Overview** page and select **Config Server**.

2. In the **Default repository** section, set **URI** to "https://github.com/Azure-Samples/piggymetrics-config".

3. Select **Apply** to save your changes.

    ![Screenshot of ASC portal](media/spring-cloud-quickstart-launch-app-portal/portal-config.png)

#### [CLI](#tab/Azure-CLI)

The following procedure uses the Azure CLI to set up the config server to deploy the [Piggymetrics sample](spring-cloud-quickstart-sample-app-introduction.md).

Set up your config-server with the location of the git repository for the project:

```azurecli
az spring-cloud config-server git set -n <service instance name> --uri https://github.com/Azure-Samples/piggymetrics-config
```

---

## Next steps
> [!div class="nextstepaction"]
> [Build and deploy apps](spring-cloud-quickstart-deploy-apps.md)
