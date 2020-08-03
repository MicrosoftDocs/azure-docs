---
title: "Quickstart - Set up Azure Spring Cloud config server"
description: Describes set up of Azure Spring Cloud config server for app deployment.
author: MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 08/03/2020
ms.custom: devx-track-java
---

# Quickstart: Set up Azure Spring Cloud configuration server

Spring Cloud Config server is horizontally scalable centralized configuration service for distributed systems. It uses a pluggable repository layer that currently supports local storage, Git, and Subversion.  All apps deployed to Azure Spring Cloud use the config server.

## Config server set up using Azure portal

1. Go to the service **Overview** page and select **Config Server**.

2. In the **Default repository** section, set **URI** to "https://github.com/Azure-Samples/piggymetrics-config".

3. Select **Apply** to save your changes.

    ![Screenshot of ASC portal](media/spring-cloud-quickstart-launch-app-portal/portal-config.png)

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=asc-portal-quickstart&step=config-server)

## Config server set up using CLI
Install the Azure Spring Cloud extension for the Azure CLI using the following command

```azurecli
az extension add --name spring-cloud
```

Update your config-server with the location of the git repository for our project:

```azurecli
az spring-cloud config-server git set -n <service instance name> --uri https://github.com/Azure-Samples/piggymetrics-config
```

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=asc-cli-quickstart&step=config-server)

## Next steps
* [Build and deploy apps](spring-cloud-quickstart-deploy-apps.md)