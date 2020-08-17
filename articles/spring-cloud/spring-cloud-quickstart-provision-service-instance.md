---
title:  "Quickstart - Provision Azure Spring Cloud service"
description: Describes creation of Azure Spring Cloud service instance for app deployment.
author:  MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 08/03/2020
ms.custom: devx-track-java
---

# Quickstart: Provision Azure Spring Cloud service

You can instantiate Azure Spring Cloud using the Azure portal or the Azure CLI.  Both methods are explained in the following procedures.

## Prerequisites

* [Sign up for an Azure subscription](https://azure.microsoft.com/free/)

## Provision an instance of Azure Spring Cloud

The following procedure creates an instance of Azure Spring Cloud using the Azure portal.

1. In a new tab, open the [Azure portal](https://ms.portal.azure.com/). 

2. From the top search box, search for **Azure Spring Cloud**.

3. Select **Azure Spring Cloud** from the results.

    ![ASC icon](media/spring-cloud-quickstart-launch-app-portal/find-spring-cloud-start.png)

4. On the Azure Spring Cloud page, click **+ Add**.

    ![ASC icon](media/spring-cloud-quickstart-launch-app-portal/spring-cloud-add.png)

5. Fill out the form on the Azure Spring Cloud **Create** page.  Consider the following guidelines:
    - **Subscription**: Select the subscription you want to be billed for this resource.  Ensure that this subscription has been added to our allow-list for Azure Spring Cloud.
    - **Resource group**: Creating new resource groups for new resources is a best practice.
    - **Service Details/Name**: Specify the name of your service instance.  The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens.  The first character of the service name must be a letter and the last character must be either a letter or a number.
    - **Location**: Select the location for your service instance. Currently supported locations include East US, West US 2, West Europe, and Southeast Asia.

    ![ASC portal start](media/spring-cloud-quickstart-launch-app-portal/portal-start.png)

6. Click **Review and create**.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=asc-cli-quickstart&step=public-endpoint)

> [!div class="nextstepaction"]
## Next steps
* [Set up configuration server](spring-cloud-quickstart-setup-config-server.md)


