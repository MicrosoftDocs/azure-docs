---
title:  "Quickstart - Provision Azure Spring Cloud service instance"
description: Describes creation of Azure Spring Cloud service instance for app deployment.
author:  MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 08/03/2020
ms.custom: devx-track-java
---

# Quickstart: Provision Azure Spring Cloud service instance

You can instantiate Azure Spring Cloud using the Azure portal or the Azure CLI.  Both methods are illustrated in the following procedures.

## Prerequisites

* [Sign up for an Azure subscription](https://azure.microsoft.com/free/)

## Provision a service instance on the Azure portal
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

6. Click the **Diagnostic Setting** tab to open the following dialog.

7. You can set **Enable logs** to *yes* or *no* according to your requirements.

    ![Enable logs](media/spring-cloud-quickstart-launch-app-portal/diagnostic-setting.png)

8. Click the **Tracing** tab.

9. You can set **Enable tracing** to *yes* or *no* according to your requirements.  If you set **Enable tracing** to yes,  also select an existing application insight, or create a new one. Without the **Application Insights** specification there will be a validation error.


    ![Tracing](media/spring-cloud-quickstart-launch-app-portal/tracing.png)

10. Click **Review and create**.

11. Verify your specifications, and click **Create**.

It takes about 5 minutes for the service to deploy.  Once it is deployed, the **Overview** page for the service instance will appear.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=asc-portal-quickstart&step=provision)


## Azure Cloud Shell
The Azure Cloud Shell is a free interactive shell that has common Azure tools preinstalled, including the latest versions of Git, JDK, Maven, and the Azure CLI. If you are logged in to your Azure subscription, launch your [Azure Cloud Shell](https://shell.azure.com) from shell.azure.com.  You can learn more about Azure Cloud Shell by [reading our documentation](../cloud-shell/overview.md)

### Install the Azure CLI extension

Sign in to your Azure subscription.  Install the Azure Spring Cloud extension for the Azure CLI using the following command

```azurecli
az extension add --name spring-cloud
```

### Provision a service instance on the Azure CLI

1. Login to the Azure CLI and choose your active subscription. Be sure to choose the active subscription that is whitelisted for Azure Spring Cloud

    ```azurecli
        az login
        az account list -o table
        az account set --subscription <Name or ID of subscription from the last step>
    ```

2. Prepare a name for your Azure Spring Cloud service.  The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens.  The first character of the service name must be a letter and the last character must be either a letter or a number.

3. Create a resource group to contain your Azure Spring Cloud service.

    ```azurecli
        az group create --location eastus --name <resource group name>
    ```

    Learn more about [Azure Resource Groups](../azure-resource-manager/management/overview.md).

4. Open an Azure CLI window and run the following commands to provision an instance of Azure Spring Cloud.

    ```azurecli
        az spring-cloud create -n <service instance name> -g <resource group name>
    ```

    The service instance will take around five minutes to deploy.

5. Set your default resource group name and cluster name using the following commands:

    ```azurecli
        az configure --defaults group=<resource group name>
        az configure --defaults spring-cloud=<service instance name>
    ```

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=asc-cli-quickstart&step=provision)

## Next steps
* [Set up configuration server](spring-cloud-quickstart-setup-config-server.md)


