---
title: Kubernetes on Azure tutorial - Prepare an application for Azure Kubernetes Service (AKS)
description: In this Azure Kubernetes Service (AKS) tutorial, you learn how to prepare and build a multi-container app with Docker Compose that you can then deploy to AKS.
ms.topic: tutorial
ms.date: 10/23/2023
ms.custom: mvc

#Customer intent: As a developer, I want to learn how to build a container-based application so that I can deploy the app to Azure Kubernetes Service.
---

# Tutorial - Prepare an application for Azure Kubernetes Service (AKS)

In this tutorial, part one of seven, you prepare a multi-container application to use in Kubernetes. You use existing development tools like Docker Compose to locally build and test the application. You learn how to:

> [!div class="checklist"]
>
> * Clone a sample application source from GitHub.
> * Create a container image from the sample application source.
> * Test the multi-container application in a local Docker environment.

Once completed, the following application runs in your local development environment:

:::image type="content" source="./media/container-service-kubernetes-tutorials/aks-store-application.png" alt-text="Screenshot showing the Azure Store Front App running locally opened in a local web browser." lightbox="./media/container-service-kubernetes-tutorials/aks-store-application.png":::

In later tutorials, you upload the container image to an Azure Container Registry (ACR), and then deploy it into an AKS cluster.

## Before you begin

This tutorial assumes a basic understanding of core Docker concepts such as containers, container images, and `docker` commands. For a primer on container basics, see [Get started with Docker][docker-get-started].

To complete this tutorial, you need a local Docker development environment running Linux containers. Docker provides packages that configure Docker on a [Mac][docker-for-mac], [Windows][docker-for-windows], or [Linux][docker-for-linux] system.

> [!NOTE]
> Azure Cloud Shell doesn't include the Docker components required to complete every step in these tutorials. Therefore, we recommend using a full Docker development environment.

## Get application code

The [sample application][sample-application] used in this tutorial is a basic store front app including the following Kubernetes deployments and services:

:::image type="content" source="./media/container-service-kubernetes-tutorials/aks-store-architecture.png" alt-text="Screenshot of Azure Store sample architecture." lightbox="./media/container-service-kubernetes-tutorials/aks-store-architecture.png":::

* **Store front**: Web application for customers to view products and place orders.
* **Product service**: Shows product information.
* **Order service**: Places orders.
* **Rabbit MQ**: Message queue for an order queue.

1. Use [git][] to clone the sample application to your development environment.

    ```console
    git clone https://github.com/Azure-Samples/aks-store-demo.git
    ```

2. Change into the cloned directory.

    ```console
    cd aks-store-demo
    ```

## Review Docker Compose file

The sample application you create in this tutorial uses the [*docker-compose-quickstart* YAML file](https://github.com/Azure-Samples/aks-store-demo/blob/main/docker-compose-quickstart.yml) in the [repository](https://github.com/Azure-Samples/aks-store-demo/tree/main) you cloned in the previous step.

```yaml
version: "3.7"
services:
  rabbitmq:
    image: rabbitmq:3.11.17-management-alpine
    container_name: 'rabbitmq'
    restart: always
    environment:
      - "RABBITMQ_DEFAULT_USER=username"
      - "RABBITMQ_DEFAULT_PASS=password"
    ports:
      - 15672:15672
      - 5672:5672
    healthcheck:
      test: ["CMD", "rabbitmqctl", "status"]
      interval: 30s
      timeout: 10s
      retries: 5
    volumes:
      - ./rabbitmq_enabled_plugins:/etc/rabbitmq/enabled_plugins
    networks:
      - backend_services
  orderservice:
    build: src/order-service
    container_name: 'orderservice'
    restart: always
    ports:
      - 3000:3000
    healthcheck:
      test: ["CMD", "wget", "-O", "/dev/null", "-q", "http://orderservice:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 5
    environment:
      - ORDER_QUEUE_HOSTNAME=rabbitmq
      - ORDER_QUEUE_PORT=5672
      - ORDER_QUEUE_USERNAME=username
      - ORDER_QUEUE_PASSWORD=password
      - ORDER_QUEUE_NAME=orders
      - ORDER_QUEUE_RECONNECT_LIMIT=3
    networks:
      - backend_services
    depends_on:
      rabbitmq:
        condition: service_healthy
  productservice:
    build: src/product-service
    container_name: 'productservice'
    restart: always
    ports:
      - 3002:3002
    healthcheck:
      test: ["CMD", "wget", "-O", "/dev/null", "-q", "http://productservice:3002/health"]
      interval: 30s
      timeout: 10s
      retries: 5
    networks:
      - backend_services
  storefront:
    build: src/store-front
    container_name: 'storefront'
    restart: always
    ports:
      - 8080:8080
    healthcheck:
      test: ["CMD", "wget", "-O", "/dev/null", "-q", "http://storefront:80/health"]
      interval: 30s
      timeout: 10s
      retries: 5
    environment:
      - VUE_APP_PRODUCT_SERVICE_URL=http://productservice:3002/
      - VUE_APP_ORDER_SERVICE_URL=http://orderservice:3000/
    networks:
      - backend_services
    depends_on:
      - productservice
      - orderservice
networks:
  backend_services:
    driver: bridge
```

## Create container images and run application

You can use [Docker Compose][docker-compose] to automate building container images and the deployment of multi-container applications.

1. Create the container image, download the Redis image, and start the application using the `docker compose` command.

    ```console
    docker compose -f docker-compose-quickstart.yml up -d
    ```

2. View the created images using the [`docker images`][docker-images] command.

    ```console
    docker images
    ```

    The following condensed example output shows the created images:

    ```output
    REPOSITORY                       TAG                          IMAGE ID
    aks-store-demo-productservice    latest                       2b66a7e91eca
    aks-store-demo-orderservice      latest                       54ad5de546f9
    aks-store-demo-storefront        latest                       d9e3ac46a225
    rabbitmq                         3.11.17-management-alpine    79a570297657
    ...
    ```

3. View the running containers using the [`docker ps`][docker-ps] command.

    ```console
    docker ps
    ```

    The following condensed example output shows four running containers:

    ```output
    CONTAINER ID        IMAGE
    21574cb38c1f        aks-store-demo-productservice
    c30a5ed8d86a        aks-store-demo-orderservice
    d10e5244f237        aks-store-demo-storefront
    94e00b50b86a        rabbitmq:3.11.17-management-alpine
    ```

## Test application locally

To see your running application, navigate to `http://localhost:8080` in a local web browser. The sample application loads, as shown in the following example:

:::image type="content" source="./media/container-service-kubernetes-tutorials/aks-store-application.png" alt-text="Screenshot showing the Azure Store Front App opened in a local browser." lightbox="./media/container-service-kubernetes-tutorials/aks-store-application.png":::

On this page, you can view products, add them to your cart, and then place an order.

## Clean up resources

Since you validated the application's functionality, you can stop and remove the running containers. ***Do not delete the container images*** - you use them in the next tutorial.

* Stop and remove the container instances and resources using the [`docker-compose down`][docker-compose-down] command.

    ```console
    docker compose down
    ```

## Next steps

In this tutorial, you created a sample application, created container images for the application, and then tested the application. You learned how to:

> [!div class="checklist"]
> * Clone a sample application source from GitHub.
> * Create a container image from the sample application source.
> * Test the multi-container application in a local Docker environment.

In the next tutorial, you learn how to store container images in an ACR.

> [!div class="nextstepaction"]
> [Push images to Azure Container Registry][aks-tutorial-prepare-acr]

<!-- LINKS - external -->
[docker-compose]: https://docs.docker.com/compose/
[docker-for-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-for-mac]: https://docs.docker.com/docker-for-mac/
[docker-for-windows]: https://docs.docker.com/docker-for-windows/
[docker-get-started]: https://docs.docker.com/get-started/
[docker-images]: https://docs.docker.com/engine/reference/commandline/images/
[docker-ps]: https://docs.docker.com/engine/reference/commandline/ps/
[docker-compose-down]: https://docs.docker.com/compose/reference/down
[git]: https://git-scm.com/downloads
[sample-application]: https://github.com/Azure-Samples/aks-store-demo

<!-- LINKS - internal -->
[aks-tutorial-prepare-acr]: ./tutorial-kubernetes-prepare-acr.md