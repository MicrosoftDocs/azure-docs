---
title: What's new in Azure Spring Apps Archived
description: This page highlights previous features and improvements for Azure Spring Apps
author: hangwan97
ms.author: hangwan
ms.service: data-factory
ms.subservice: concepts
ms.topic: overview
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
ms.date: 05/07/2023
---

# What's new in Azure Spring Apps (Archived)

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

Azure Spring Apps is improved on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about the latest releases.

For most recent updates, refer to the [What's new](whats-new.md)

## December 2022

The following updates are now available in both basic/standard and enterprise plan:

- **Ingress Settings**: With ingress settings, customers can now manage Azure Spring Apps traffic on the application level, including protocol support for gRPC, WebSocket and RSocket-on-WebSocket, session affinity, and send/read timeout. For more information, see [Customize the ingress configuration in Azure Spring Apps](how-to-configure-ingress.md).

- **Remote debugging**: Now, you can remotely debug your apps in Azure Spring Apps using IntelliJ or VS Code. For security reasons, by default, Azure Spring Apps disables remote debugging. You can enable remote debugging for your apps using Azure Portal or Azure CLI and start debugging. For more information, see [Debug your apps remotely in Azure Spring Apps](how-to-remote-debugging-app-instance.md).

- **Connect to app instance shell environment for troubleshooting**: Azure Spring Apps offers many ways to troubleshoot your applications. For developers who like to inspect an app instance running environment, you can connect to the app instance’s shell environment and troubleshoot it. For more information, see [Connect to an app instance for troubleshooting](how-to-connect-to-app-instance-for-troubleshooting.md).

The following updates are now available in the enterprise plan:

- **New managed Tanzu component - Application Live View from Tanzu Application Platform**: a lightweight insight and troubleshooting tool based on Spring Boot Actuators that helps app developers and app operators look inside running apps. Applications provide information from inside the running processes using HTTP endpoints. Application Live View uses those endpoints to retrieve and interact with the data from applications. For more information, see [Use Application Live View with Azure Spring Apps Enterprise tier](how-to-use-application-live-view.md).

- **New managed Tanzu component – Application Accelerators from Tanzu Application Platform**: can speed up the process of building and deploying applications. They help you to bootstrap develop your applications and deploy them in a discoverable and repeatable way. For more information, see [Use VMware Tanzu Application Accelerator with Azure Spring Apps Enterprise tier](how-to-use-accelerator.md).

- **Directly deploy static files**: If you have applications that are purely holding static files like html, css, or front-end applications built with the JavaScript framework of your choice, you can directly deploy them now with an automatically configured web server (HTTPD and NGINX) to serve those assets, leveraging Tanzu Web Servers buildpack in behind. For more information, see [Deploy web static files](how-to-enterprise-deploy-static-file.md).

- **Managed Spring Cloud Gateway enhancement**: We have newly added app-level routing rule support to simplify your routing rule configuration and TLS support from the gateway to apps in managed Spring Cloud Gateway. For more information, see [Use Spring Cloud Gateway](how-to-use-enterprise-spring-cloud-gateway.md).

## September 2022

The following updates are now available to help customers reduce adoption barriers and pricing frictions to take full advantage of the capabilities offered by Azure Spring Apps Enterprise.

- **Price Reduction**: We have reduced the base unit of Azure Spring Apps Standard and Enterprise to 6 vCPUs and 12 GB of Memory and reduced the overage prices for vCPU and Memory. For more information, see [Azure Spring Apps pricing](https://azure.microsoft.com/pricing/details/spring-apps/)

- **Monthly Free Grant**: The first 50 vCPU-hours and 100 memory GB hours are free each month. For more information, see [Learn more.](https://azure.microsoft.com/pricing/details/spring-apps/)

You can compare the price change from [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058).

## Older updates

For older updates, refer to the [Azure Updates for Azure Spring Apps](https://azure.microsoft.com/updates/?query=azure%20spring).
