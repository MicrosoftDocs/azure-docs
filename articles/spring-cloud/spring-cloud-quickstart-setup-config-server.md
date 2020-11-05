---
title: "Quickstart - Set up Azure Spring Cloud configuration server"
description: Describes set up of Azure Spring Cloud config server for app deployment.
author: MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 09/08/2020
ms.custom: devx-track-java
zone_pivot_groups: programming-languages-spring-cloud
---

# Quickstart: Set up Azure Spring Cloud configuration server

Azure Spring Cloud Config server is a centralized configuration service for distributed systems. It uses a pluggable repository layer that currently supports local storage, Git, and Subversion. In this quickstart, you set up the config server to get data from a Git repository.

::: zone pivot="programming-language-csharp"

## Prerequisites

* Complete the previous quickstart in this series: [Provision Azure Spring Cloud service](spring-cloud-quickstart-provision-service-instance.md).

## Azure Spring Cloud config server procedures

Set up your config-server with the location of the git repository for the project by running the following command. Replace `<service instance name>` with the name of the service you created earlier. The default value for service instance name that you set in the preceding quickstart doesn't work with this command.

```azurecli
az spring-cloud config-server git set -n <service instance name> --uri https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples --search-paths steeltoe-sample/config
```

This command tells Configuration server to find the configuration data in the [steeltoe-sample/config](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/steeltoe-sample/config) folder of the sample app repository. Since the name of the app that will get the configuration data is `planet-weather-provider`, the file that will be used is [planet-weather-provider.yml](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/blob/master/steeltoe-sample/config/planet-weather-provider.yml).

::: zone-end

::: zone pivot="programming-language-java"
Azure Spring Cloud Config server is centralized configuration service for distributed systems. It uses a pluggable repository layer that currently supports local storage, Git, and Subversion.  Set up the config server to deploy microservice apps to Azure Spring Cloud.

## Prerequisites

* [Install JDK 8](/java/azure/jdk/?preserve-view=true&view=azure-java-stable)
* [Sign up for an Azure subscription](https://azure.microsoft.com/free/)
* (Optional) [Install the Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli?preserve-view=true&view=azure-cli-latest) and install the Azure Spring Cloud extension with command: `az extension add --name spring-cloud`
* (Optional) [Install the Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053-azure-toolkit-for-intellij/) and [sign-in](/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app#installation-and-sign-in)

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
::: zone-end

## Troubleshooting of Azure Spring Cloud config server

The following procedure explains how to troubleshoot config server settings.

1. Go to the service **Overview** page and select **Logs**. 
1. Select **Queries** and **Show the application logs which contain the "error" or "exception" terms"**. 
1. Click **Run**. 
1. If you find the error **java.lang.illegalStateException** in logs, this indicates that spring cloud service cannot locate properties from config server.

    ![ASC portal run query](media/spring-cloud-quickstart-setup-config-server/setup-config-server-query.png)

1. Go to the service **Overview** page.
1. Select **Diagnose and solve problems**. 
1. Select **Config Server** detector.

    ![ASC portal diagnose problems](media/spring-cloud-quickstart-setup-config-server/setup-config-server-diagnose.png)

3. Click **Config Server Health Check**.

    ![ASC portal genie](media/spring-cloud-quickstart-setup-config-server/setup-config-server-genie.png)

4. Click **Config Server Status** to see more details from the detector.

    ![ASC portal health status](media/spring-cloud-quickstart-setup-config-server/setup-config-server-health-status.png)

## Next steps

In this quickstart, you created Azure resources that will continue to accrue charges if they remain in your subscription. If you don't intend to continue on to the next quickstart, see [Clean up resources](spring-cloud-quickstart-logs-metrics-tracing.md#clean-up-resources). Otherwise, advance to the next quickstart:

> [!div class="nextstepaction"]
> [Build and deploy apps](spring-cloud-quickstart-deploy-apps.md)