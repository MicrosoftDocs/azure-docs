---
title: "Microservices communication using Dapr Publish and Subscribe"
titleSuffix: "Azure Container Apps"
description: Enable two sample Dapr applications to send and receive messages and leverage Azure Container Apps.
author: hhunter-ms
ms.author: hannahhunter
ms.service: container-apps
ms.custom: devx-track-dotnet, devx-track-js, devx-track-python
ms.topic: how-to
ms.date: 05/15/2023
zone_pivot_group_filename: container-apps/dapr-zone-pivot-groups.json
zone_pivot_groups: dapr-languages-set
---

# Microservices communication using Dapr Publish and Subscribe 

In this tutorial, you'll:
> [!div class="checklist"]
> * Create a publisher microservice and a subscriber microservice that leverage the [Dapr pub/sub API](https://docs.dapr.io/developing-applications/building-blocks/pubsub/pubsub-overview/) to communicate using messages for event-driven architectures. 
> * Deploy the application to Azure Container Apps via the Azure Developer CLI with provided Bicep. 

The sample pub/sub project includes:
1. A message generator (publisher) `checkout` service that generates messages of a specific topic.
1. An (subscriber) `order-processor` service that listens for messages from the `checkout` service of a specific topic. 

:::image type="content" source="media/microservices-dapr-azd/pubsub-quickstart.png" alt-text="Diagram of the Dapr pub/sub sample.":::

## Prerequisites

- Install [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)
- [Install](https://docs.dapr.io/getting-started/install-dapr-cli/) and [init](https://docs.dapr.io/getting-started/install-dapr-selfhost/) Dapr
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Install [Git](https://git-scm.com/downloads)

::: zone pivot="nodejs"

## Run the Node.js applications locally

Before deploying the application to Azure Container Apps, run the `order-processor` and `checkout` services locally with Dapr and Azure Service Bus.

### Prepare the project

1. Clone the [sample Dapr application](https://github.com/Azure-Samples/pubsub-dapr-nodejs-servicebus) to your local machine.

   ```bash
   git clone https://github.com/Azure-Samples/pubsub-dapr-nodejs-servicebus.git
   ```

1. Navigate into the sample's root directory.

   ```bash
   cd pubsub-dapr-nodejs-servicebus
   ```

### Run the Dapr applications using the Dapr CLI

Start by running the `order-processor` subscriber service with Dapr.

1. From the sample's root directory, change directories to `order-processor`.

   ```bash
   cd order-processor
   ```
1. Install the dependencies.

   ```bash
   npm install
   ```

1. Run the `order-processor` service with Dapr.

   ```bash
   dapr run --app-port 5001 --app-id order-processing --app-protocol http --dapr-http-port 3501 --resources-path ../components -- npm run start
   ```

1. In a new terminal window, from the sample's root directory, navigate to the `checkout` publisher service.

   ```bash
   cd checkout
   ```

1. Install the dependencies.

   ```bash
   npm install
   ```

1. Run the `checkout` service with Dapr.

   ```bash
   dapr run --app-id checkout --app-protocol http --resources-path ../components -- npm run start
   ```

   #### Expected output

   In both terminals, the `checkout` service publishes 10 messages received by the `order-processor` service before exiting.

   `checkout` output:

   ```
   == APP == Published data: {"orderId":1}
   == APP == Published data: {"orderId":2}
   == APP == Published data: {"orderId":3}
   == APP == Published data: {"orderId":4}
   == APP == Published data: {"orderId":5}
   == APP == Published data: {"orderId":6}
   == APP == Published data: {"orderId":7}
   == APP == Published data: {"orderId":8}
   == APP == Published data: {"orderId":9}
   == APP == Published data: {"orderId":10}
   ```

   `order-processor` output:

   ```
   == APP == Subscriber received: {"orderId":1}
   == APP == Subscriber received: {"orderId":2}
   == APP == Subscriber received: {"orderId":3}
   == APP == Subscriber received: {"orderId":4}
   == APP == Subscriber received: {"orderId":5}
   == APP == Subscriber received: {"orderId":6}
   == APP == Subscriber received: {"orderId":7}
   == APP == Subscriber received: {"orderId":8}
   == APP == Subscriber received: {"orderId":9}
   == APP == Subscriber received: {"orderId":10}
   ```

1. Make sure both applications have stopped by running the following commands. In the checkout terminal:

   ```sh
   dapr stop --app-id checkout
   ```

   In the order-processor terminal:

   ```sh
   dapr stop --app-id order-processor
   ```

## Deploy the Dapr application template using Azure Developer CLI

Deploy the Dapr application to Azure Container Apps using [`azd`](/azure/developer/azure-developer-cli/overview).

### Prepare the project

In a new terminal window, navigate into the [sample's](https://github.com/Azure-Samples/pubsub-dapr-nodejs-servicebus) root directory.

```bash
cd pubsub-dapr-nodejs-servicebus
```

### Provision and deploy using Azure Developer CLI

1. Run `azd init` to initialize the project.

   ```azdeveloper
   azd init
   ```

1. When prompted in the terminal, provide the following parameters.

   | Parameter | Description |
   | --------- | ----------- |
   | Environment Name | Prefix for the resource group created to hold all Azure resources. |
   | Azure Location  | The Azure location for your resources. |
   | Azure Subscription | The Azure subscription for your resources. |

1. Run `azd up` to provision the infrastructure and deploy the Dapr application to Azure Container Apps in a single command.

   ```azdeveloper
   azd up
   ```

   This process may take some time to complete. As the `azd up` command completes, the CLI output displays two Azure portal links to monitor the deployment progress. The output also demonstrates how `azd up`:

   - Creates and configures all necessary Azure resources via the provided Bicep files in the `./infra` directory using `azd provision`. Once provisioned by Azure Developer CLI, you can access these resources via the Azure portal. The files that provision the Azure resources include:
     - `main.parameters.json`
     - `main.bicep`
     - An `app` resources directory organized by functionality
     - A `core` reference library that contains the Bicep modules used by the `azd` template
   - Deploys the code using `azd deploy`

   #### Expected output

   ```azdeveloper
   Initializing a new project (azd init)
   
   
   Provisioning Azure resources (azd provision)
   Provisioning Azure resources can take some time
   
     You can view detailed progress in the Azure Portal:
     https://portal.azure.com
   
     (✓) Done: Resource group: resource-group-name
     (✓) Done: Application Insights: app-insights-name
     (✓) Done: Portal dashboard: portal-dashboard-name
     (✓) Done: Log Analytics workspace: log-analytics-name
     (✓) Done: Key vault: key-vault-name
     (✓) Done: Container Apps Environment: ca-env-name
     (✓) Done: Container App: ca-checkout-name
     (✓) Done: Container App: ca-orders-name
   
   
   Deploying services (azd deploy)
   
     (✓) Done: Deploying service checkout
     (✓) Done: Deploying service orders
     - Endpoint: https://ca-orders-name.endpoint.region.azurecontainerapps.io/
   
   SUCCESS: Your Azure app has been deployed!
   You can view the resources created under the resource group resource-group-name in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/subscription-id/resourceGroups/resource-group-name/overview
   ```

### Confirm successful deployment 

In the Azure portal, verify the `checkout` service is publishing messages to the Azure Service Bus topic. 

1. Copy the `checkout` container app name from the terminal output.

1. Sign in to the [Azure portal](https://portal.azure.com) and search for the container app resource by name.

1. In the Container Apps dashboard, select **Monitoring** > **Log stream**.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-menu.png" alt-text="Screenshot of navigating to the Log stream page in the Azure portal.":::


1. Confirm the `checkout` container is logging the same output as in the terminal earlier.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-portal-view-checkout-pubsub.png" alt-text="Screenshot of the checkout service container's log stream in the Azure portal.":::

1. Do the same for the `order-processor` service.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-portal-view-order-processor-pubsub.png" alt-text="Screenshot of the order processor service container's log stream in the Azure portal.":::

## What happened?

Upon successful completion of the `azd up` command:

- Azure Developer CLI provisioned the Azure resources referenced in the [sample project's `./infra` directory](https://github.com/Azure-Samples/pubsub-dapr-nodejs-servicebus/tree/main/infra) to the Azure subscription you specified. You can now view those Azure resources via the Azure portal.
- The app deployed to Azure Container Apps. From the portal, you can browse to the fully functional app.


::: zone-end

::: zone pivot="python"

## Run the Python applications locally

Before deploying the application to Azure Container Apps, run the `order-processor` and `checkout` services locally with Dapr and Azure Service Bus.

### Prepare the project

1. Clone the [sample Dapr application](https://github.com/Azure-Samples/pubsub-dapr-python-servicebus) to your local machine.

   ```bash
   git clone https://github.com/Azure-Samples/pubsub-dapr-python-servicebus.git
   ```

1. Navigate into the sample's root directory.

   ```bash
   cd pubsub-dapr-python-servicebus
   ```

### Run the Dapr applications using the Dapr CLI

Start by running the `order-processor` subscriber service with Dapr.

1. From the sample's root directory, change directories to `order-processor`.

   ```bash
   cd order-processor
   ```
1. Install the dependencies.

   ```bash
   pip3 install -r requirements.txt
   ```

1. Run the `order-processor` service with Dapr.

   ```bash
   dapr run --app-id order-processor --resources-path ../components/ --app-port 5001 -- python3 app.py
   ```

1. In a new terminal window, from the sample's root directory, navigate to the `checkout` publisher service.

   ```bash
   cd checkout
   ```

1. Install the dependencies.

   ```bash
   pip3 install -r requirements.txt
   ```

1. Run the `checkout` service with Dapr.

   ```bash
   dapr run --app-id checkout --resources-path ../components/ -- python3 app.py
   ```

   #### Expected output

   In both terminals, the `checkout` service publishes 10 messages received by the `order-processor` service before exiting.

   `checkout` output:

   ```
   == APP == Published data: {"orderId":1}
   == APP == Published data: {"orderId":2}
   == APP == Published data: {"orderId":3}
   == APP == Published data: {"orderId":4}
   == APP == Published data: {"orderId":5}
   == APP == Published data: {"orderId":6}
   == APP == Published data: {"orderId":7}
   == APP == Published data: {"orderId":8}
   == APP == Published data: {"orderId":9}
   == APP == Published data: {"orderId":10}
   ```

   `order-processor` output:

   ```
   == APP == Subscriber received: {"orderId":1}
   == APP == Subscriber received: {"orderId":2}
   == APP == Subscriber received: {"orderId":3}
   == APP == Subscriber received: {"orderId":4}
   == APP == Subscriber received: {"orderId":5}
   == APP == Subscriber received: {"orderId":6}
   == APP == Subscriber received: {"orderId":7}
   == APP == Subscriber received: {"orderId":8}
   == APP == Subscriber received: {"orderId":9}
   == APP == Subscriber received: {"orderId":10}
   ```

1. Make sure both applications have stopped by running the following commands. In the checkout terminal:

   ```sh
   dapr stop --app-id checkout
   ```

   In the order-processor terminal:

   ```sh
   dapr stop --app-id order-processor
   ```

## Deploy the Dapr application template using Azure Developer CLI

Deploy the Dapr application to Azure Container Apps using [`azd`](/azure/developer/azure-developer-cli/overview).

### Prepare the project

In a new terminal window, navigate into the [sample's](https://github.com/Azure-Samples/pubsub-dapr-python-servicebus) root directory.

```bash
cd pubsub-dapr-python-servicebus
```

### Provision and deploy using Azure Developer CLI

1. Run `azd init` to initialize the project.

   ```azdeveloper
   azd init
   ```

1. When prompted in the terminal, provide the following parameters.

   | Parameter | Description |
   | --------- | ----------- |
   | Environment Name | Prefix for the resource group created to hold all Azure resources. |
   | Azure Location  | The Azure location for your resources. |
   | Azure Subscription | The Azure subscription for your resources. |

1. Run `azd up` to provision the infrastructure and deploy the Dapr application to Azure Container Apps in a single command.

   ```azdeveloper
   azd up
   ```

   This process may take some time to complete. As the `azd up` command completes, the CLI output displays two Azure portal links to monitor the deployment progress. The output also demonstrates how `azd up`:

   - Creates and configures all necessary Azure resources via the provided Bicep files in the `./infra` directory using `azd provision`. Once provisioned by Azure Developer CLI, you can access these resources via the Azure portal. The files that provision the Azure resources include:
     - `main.parameters.json`
     - `main.bicep`
     - An `app` resources directory organized by functionality
     - A `core` reference library that contains the Bicep modules used by the `azd` template
   - Deploys the code using `azd deploy`

   #### Expected output

   ```azdeveloper
   Initializing a new project (azd init)
   
   
   Provisioning Azure resources (azd provision)
   Provisioning Azure resources can take some time
   
     You can view detailed progress in the Azure Portal:
     https://portal.azure.com
   
     (✓) Done: Resource group: resource-group-name
     (✓) Done: Application Insights: app-insights-name
     (✓) Done: Portal dashboard: portal-dashboard-name
     (✓) Done: Log Analytics workspace: log-analytics-name
     (✓) Done: Key vault: key-vault-name
     (✓) Done: Container Apps Environment: ca-env-name
     (✓) Done: Container App: ca-checkout-name
     (✓) Done: Container App: ca-orders-name
   
   
   Deploying services (azd deploy)
   
     (✓) Done: Deploying service checkout
     (✓) Done: Deploying service orders
     - Endpoint: https://ca-orders-name.endpoint.region.azurecontainerapps.io/
   
   SUCCESS: Your Azure app has been deployed!
   You can view the resources created under the resource group resource-group-name in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/subscription-id/resourceGroups/resource-group-name/overview
   ```

### Confirm successful deployment 

In the Azure portal, verify the `checkout` service is publishing messages to the Azure Service Bus topic. 

1. Copy the `checkout` container app name from the terminal output.

1. Sign in to the [Azure portal](https://portal.azure.com) and search for the container app resource by name.

1. In the Container Apps dashboard, select **Monitoring** > **Log stream**.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-menu.png" alt-text="Screenshot of navigating to the Log stream page in the Azure portal.":::


1. Confirm the `checkout` container is logging the same output as in the terminal earlier.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-portal-view-checkout-pubsub.png" alt-text="Screenshot of the checkout service container's log stream in the Azure portal.":::

1. Do the same for the `order-processor` service.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-portal-view-order-processor-pubsub.png" alt-text="Screenshot of the order processor service container's log stream in the Azure portal.":::

## What happened?

Upon successful completion of the `azd up` command:

- Azure Developer CLI provisioned the Azure resources referenced in the [sample project's `./infra` directory](https://github.com/Azure-Samples/pubsub-dapr-python-servicebus/tree/main/infra) to the Azure subscription you specified. You can now view those Azure resources via the Azure portal.
- The app deployed to Azure Container Apps. From the portal, you can browse to the fully functional app.


::: zone-end

::: zone pivot="csharp"

## Run the .NET applications locally

Before deploying the application to Azure Container Apps, run the `order-processor` and `checkout` services locally with Dapr and Azure Service Bus.

### Prepare the project

1. Clone the [sample Dapr application](https://github.com/Azure-Samples/pubsub-dapr-csharp-servicebus) to your local machine.

   ```bash
   git clone https://github.com/Azure-Samples/pubsub-dapr-csharp-servicebus.git
   ```

1. Navigate into the sample's root directory.

   ```bash
   cd pubsub-dapr-csharp-servicebus
   ```

### Run the Dapr applications using the Dapr CLI

Start by running the `order-processor` subscriber service with Dapr.

1. From the sample's root directory, change directories to `order-processor`.

   ```bash
   cd order-processor
   ```
1. Install the dependencies.

   ```bash
   dotnet build
   ```

1. Run the `order-processor` service with Dapr.

   ```bash
   dapr run --app-id order-processor --resources-path ../components/ --app-port 7001 -- dotnet run --project .
   ```

1. In a new terminal window, from the sample's root directory, navigate to the `checkout` publisher service.

   ```bash
   cd checkout
   ```

1. Install the dependencies.

   ```bash
   dotnet build
   ```

1. Run the `checkout` service with Dapr.

   ```bash
   dapr run --app-id checkout --resources-path ../components/ -- dotnet run --project .
   ```

   #### Expected output

   In both terminals, the `checkout` service publishes 10 messages received by the `order-processor` service before exiting.

   `checkout` output:

   ```
   == APP == Published data: {"orderId":1}
   == APP == Published data: {"orderId":2}
   == APP == Published data: {"orderId":3}
   == APP == Published data: {"orderId":4}
   == APP == Published data: {"orderId":5}
   == APP == Published data: {"orderId":6}
   == APP == Published data: {"orderId":7}
   == APP == Published data: {"orderId":8}
   == APP == Published data: {"orderId":9}
   == APP == Published data: {"orderId":10}
   ```

   `order-processor` output:

   ```
   == APP == Subscriber received: {"orderId":1}
   == APP == Subscriber received: {"orderId":2}
   == APP == Subscriber received: {"orderId":3}
   == APP == Subscriber received: {"orderId":4}
   == APP == Subscriber received: {"orderId":5}
   == APP == Subscriber received: {"orderId":6}
   == APP == Subscriber received: {"orderId":7}
   == APP == Subscriber received: {"orderId":8}
   == APP == Subscriber received: {"orderId":9}
   == APP == Subscriber received: {"orderId":10}
   ```

1. Make sure both applications have stopped by running the following commands. In the checkout terminal.

   ```sh
   dapr stop --app-id checkout
   ```

   In the order-processor terminal:

   ```sh
   dapr stop --app-id order-processor
   ```

## Deploy the Dapr application template using Azure Developer CLI

Deploy the Dapr application to Azure Container Apps using [`azd`](/azure/developer/azure-developer-cli/overview).

### Prepare the project

In a new terminal window, navigate into the [sample's](https://github.com/Azure-Samples/pubsub-dapr-csharp-servicebus) root directory.

```bash
cd pubsub-dapr-csharp-servicebus
```

### Provision and deploy using Azure Developer CLI

1. Run `azd init` to initialize the project.

   ```azdeveloper
   azd init
   ```

1. When prompted in the terminal, provide the following parameters.

   | Parameter | Description |
   | --------- | ----------- |
   | Environment Name | Prefix for the resource group created to hold all Azure resources. |
   | Azure Location  | The Azure location for your resources. |
   | Azure Subscription | The Azure subscription for your resources. |

1. Run `azd up` to provision the infrastructure and deploy the Dapr application to Azure Container Apps in a single command.

   ```azdeveloper
   azd up
   ```

   This process may take some time to complete. As the `azd up` command completes, the CLI output displays two Azure portal links to monitor the deployment progress. The output also demonstrates how `azd up`:

   - Creates and configures all necessary Azure resources via the provided Bicep files in the `./infra` directory using `azd provision`. Once provisioned by Azure Developer CLI, you can access these resources via the Azure portal. The files that provision the Azure resources include:
     - `main.parameters.json`
     - `main.bicep`
     - An `app` resources directory organized by functionality
     - A `core` reference library that contains the Bicep modules used by the `azd` template
   - Deploys the code using `azd deploy`

   #### Expected output

   ```azdeveloper
   Initializing a new project (azd init)
   
   
   Provisioning Azure resources (azd provision)
   Provisioning Azure resources can take some time
   
     You can view detailed progress in the Azure Portal:
     https://portal.azure.com
   
     (✓) Done: Resource group: resource-group-name
     (✓) Done: Application Insights: app-insights-name
     (✓) Done: Portal dashboard: portal-dashboard-name
     (✓) Done: Log Analytics workspace: log-analytics-name
     (✓) Done: Key vault: key-vault-name
     (✓) Done: Container Apps Environment: ca-env-name
     (✓) Done: Container App: ca-checkout-name
     (✓) Done: Container App: ca-orders-name
   
   
   Deploying services (azd deploy)
   
     (✓) Done: Deploying service checkout
     (✓) Done: Deploying service orders
     - Endpoint: https://ca-orders-name.endpoint.region.azurecontainerapps.io/
   
   SUCCESS: Your Azure app has been deployed!
   You can view the resources created under the resource group resource-group-name in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/subscription-id/resourceGroups/resource-group-name/overview
   ```

### Confirm successful deployment 

In the Azure portal, verify the `checkout` service is publishing messages to the Azure Service Bus topic. 

1. Copy the `checkout` container app name from the terminal output.

1. Sign in to the [Azure portal](https://portal.azure.com) and search for the container app resource by name.

1. In the Container Apps dashboard, select **Monitoring** > **Log stream**.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-menu.png" alt-text="Screenshot of navigating to the Log stream page in the Azure portal.":::


1. Confirm the `checkout` container is logging the same output as in the terminal earlier.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-portal-view-checkout-pubsub.png" alt-text="Screenshot of the checkout service container's log stream in the Azure portal.":::

1. Do the same for the `order-processor` service.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-portal-view-order-processor-pubsub.png" alt-text="Screenshot of the order processor service container's log stream in the Azure portal.":::

## What happened?

Upon successful completion of the `azd up` command:

- Azure Developer CLI provisioned the Azure resources referenced in the [sample project's `./infra` directory](https://github.com/Azure-Samples/pubsub-dapr-csharp-servicebus/tree/main/infra) to the Azure subscription you specified. You can now view those Azure resources via the Azure portal.
- The app deployed to Azure Container Apps. From the portal, you can browse to the fully functional app.

::: zone-end

## Clean up resources

If you're not going to continue to use this application, delete the Azure resources you've provisioned with the following command:

```azdeveloper
azd down
```

## Next steps

- Learn more about [deploying Dapr applications to Azure Container Apps](./microservices-dapr.md).
- [Enable token authentication for Dapr requests.](./dapr-authentication-token.md)
- Learn more about [Azure Developer CLI](/azure/developer/azure-developer-cli/overview) and [making your applications compatible with `azd`](/azure/developer/azure-developer-cli/make-azd-compatible).
- [Scale your Dapr applications using KEDA scalers](./dapr-keda-scaling.md)
