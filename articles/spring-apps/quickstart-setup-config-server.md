---
title: "Quickstart: Set up Spring Cloud Config Server for Azure Spring Apps"
description: Describes the setup of Azure Spring Apps Config Server for app deployment.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: quickstart
ms.date: 7/19/2022
ms.custom: devx-track-java, devx-track-extended-java, fasttrack-edit, mode-other, event-tier1-build-2022
zone_pivot_groups: programming-languages-spring-apps
---

# Quickstart: Set up Spring Cloud Config Server for Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ❌ Enterprise

Config Server is a centralized configuration service for distributed systems. It uses a pluggable repository layer that currently supports local storage, Git, and Subversion. In this quickstart, you set up the Config Server to get data from a Git repository.

::: zone pivot="programming-language-csharp"

## Prerequisites

- Completion of the previous quickstart in this series: [Provision Azure Spring Apps service](./quickstart-provision-service-instance.md).
- Azure Spring Apps Config Server is only applicable to the Basic or Standard plan.

## Config Server procedures

Set up your Config Server with the location of the git repository for the project by running the following command. Replace *\<service instance name>* with the name of the service you created earlier. The default value for service instance name that you set in the preceding quickstart doesn't work with this command.

```azurecli
az spring config-server git set -n <service instance name> --uri https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples --search-paths steeltoe-sample/config
```

This command tells Config Server to find the configuration data in the [steeltoe-sample/config](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/steeltoe-sample/config) folder of the sample app repository. Since the name of the app that gets the configuration data is `planet-weather-provider`, the file that's used is [planet-weather-provider.yml](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/blob/master/steeltoe-sample/config/planet-weather-provider.yml).

::: zone-end

::: zone pivot="programming-language-java"

## Prerequisites

- [JDK 17](/azure/developer/java/fundamentals/java-jdk-install)
- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Optionally, [Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli). Install the Azure Spring Apps extension with the following command: `az extension add --upgrade --name spring`
- Optionally, [the Azure Toolkit for IntelliJ](https://plugins.jetbrains.com/plugin/8053-azure-toolkit-for-intellij/).

## Config Server procedures

#### [Azure portal](#tab/Azure-portal)

The following procedure sets up the Config Server using the Azure portal to deploy the [PetClinic sample](https://github.com/azure-samples/spring-petclinic-microservices).

1. Go to the service **Overview** page and select **Config Server**.

1. In the **Default repository** section, set **URI** to `https://github.com/azure-samples/spring-petclinic-microservices-config`.

1. Select **Validate**. Validation checks the schema and accessibility of your git repo to make sure it's correct.

    :::image type="content" source="media/quickstart-setup-config-server/portal-config.png" alt-text="Screenshot of Azure portal showing Config Server page." lightbox="media/quickstart-setup-config-server/portal-config.png":::

1. When validation is complete, select **Apply** to save your changes.

    :::image type="content" source="media/quickstart-setup-config-server/validate-complete.png" alt-text="Screenshot of Azure portal showing Config Server page with Apply button highlighted." lightbox="media/quickstart-setup-config-server/validate-complete.png":::

Updating the configuration can take a few minutes. You should get a notification when the configuration is complete.

#### [Azure CLI](#tab/Azure-CLI)

The following procedure uses the Azure CLI to set up Config Server to deploy the [Pet Clinic sample](https://github.com/azure-samples/spring-petclinic-microservices).

Run the following command to set the Default repository.

```azurecli
az spring config-server git set -n <service instance name> --uri https://github.com/azure-samples/spring-petclinic-microservices-config
```

::: zone-end

> [!TIP]
> For information on using a private repository for Config Server, see [Configure a managed Spring Cloud Config Server in Azure Spring Apps](./how-to-config-server.md).

## Troubleshooting of Azure Spring Apps Config Server

The following procedure explains how to troubleshoot Config Server settings.

1. In the Azure portal, go to the service **Overview** page and select **Logs**.

1. In the **Queries** pane under **Show the application logs that contain the "error" or "exception" terms**,
   select **Run**.

   :::image type="content" source="media/quickstart-setup-config-server/setup-config-server-query.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps query." lightbox="media/quickstart-setup-config-server/setup-config-server-query.png":::

   The following error in the logs indicates that the Spring Apps service can't locate properties from Config Server: `java.lang.illegalStateException`

1. Go to the service **Overview** page.

1. Select **Diagnose and solve problems**.

1. Under **Availability and Performance**, select **Troubleshoot**.

   :::image type="content" source="media/quickstart-setup-config-server/setup-config-server-diagnose.png" alt-text="Screenshot of Azure portal showing Diagnose and solve problems page." lightbox="media/quickstart-setup-config-server/setup-config-server-diagnose.png":::

   Azure portal displays the **Availability and Performance** page, which provides various information about Config Server health status.

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When you no longer need it, delete the resource group, which deletes the resources in the resource group. To delete the resource group, enter the following commands in the Azure CLI:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Build and deploy apps to Azure Spring Apps](quickstart-deploy-apps.md)
