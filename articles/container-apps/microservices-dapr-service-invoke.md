---
title: "Microservices communication using Dapr Service Invocation"
titleSuffix: "Azure Container Apps"
description: Enable two sample Dapr applications to communicate and leverage Azure Container Apps.
author: hhunter-ms
ms.author: hannahhunter
ms.service: container-apps
ms.custom: devx-track-dotnet, devx-track-js, devx-track-python
ms.topic: how-to
ms.date: 05/15/2023
zone_pivot_group_filename: container-apps/dapr-zone-pivot-groups.json
zone_pivot_groups: dapr-languages-set
---

# Microservices communication using Dapr Service Invocation 

In this tutorial, you'll:
> [!div class="checklist"]
> * Create and run locally two microservices that communicate securely using auto-mTLS and reliably using built-in retries via [Dapr's Service Invocation API](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/service-invocation-overview/). 
> * Deploy the application to Azure Container Apps via the Azure Developer CLI with the provided Bicep. 

The sample service invocation project includes:
1. A `checkout` service that uses Dapr's HTTP proxying capability on a loop to invoke a request on the `order-processor` service.  
1. A `order-processor` service that receives the request from the `checkout` service.  

:::image type="content" source="media/microservices-dapr-azd/service-invocation-quickstart.png" alt-text="Diagram of the Dapr service invocation services.":::

## Prerequisites

- Install [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)
- [Install](https://docs.dapr.io/getting-started/install-dapr-cli/) and [init](https://docs.dapr.io/getting-started/install-dapr-selfhost/) Dapr
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Install [Git](https://git-scm.com/downloads)

::: zone pivot="nodejs"

## Run the Node.js applications locally

Before deploying the application to Azure Container Apps, start by running the `order-processor` and `checkout` services locally with Dapr.

### Prepare the project

1. Clone the [sample Dapr application](https://github.com/Azure-Samples/svc-invoke-dapr-nodejs) to your local machine.

   ```bash
   git clone https://github.com/Azure-Samples/svc-invoke-dapr-nodejs.git
   ```

1. Navigate into the sample's root directory.

   ```bash
   cd svc-invoke-dapr-nodejs
   ```

### Run the Dapr applications using the Dapr CLI

Start by running the `order-processor` service.

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
   dapr run --app-port 5001 --app-id order-processor --app-protocol http --dapr-http-port 3501 -- npm start
   ```

1. In a new terminal window, from the sample's root directory, navigate to the `checkout` caller service.

   ```bash
   cd checkout
   ```

1. Install the dependencies.

   ```bash
   npm install
   ```

1. Run the `checkout` service with Dapr.

   ```bash
   dapr run  --app-id checkout --app-protocol http --dapr-http-port 3500 -- npm start
   ```

   #### Expected output

   In both terminals, the `checkout` service is calling orders to the `order-processor` service in a loop.

   `checkout` output:

   ```
   == APP == Order passed: {"orderId":1}
   == APP == Order passed: {"orderId":2}
   == APP == Order passed: {"orderId":3}
   == APP == Order passed: {"orderId":4}
   == APP == Order passed: {"orderId":5}
   == APP == Order passed: {"orderId":6}
   == APP == Order passed: {"orderId":7}
   == APP == Order passed: {"orderId":8}
   == APP == Order passed: {"orderId":9}
   == APP == Order passed: {"orderId":10}
   == APP == Order passed: {"orderId":11}
   == APP == Order passed: {"orderId":12}
   == APP == Order passed: {"orderId":13}
   == APP == Order passed: {"orderId":14}
   == APP == Order passed: {"orderId":15}
   == APP == Order passed: {"orderId":16}
   == APP == Order passed: {"orderId":17}
   == APP == Order passed: {"orderId":18}
   == APP == Order passed: {"orderId":19}
   == APP == Order passed: {"orderId":20}
   ```

   `order-processor` output:

   ```
   == APP == Order received: { orderId: 1 }
   == APP == Order received: { orderId: 2 }
   == APP == Order received: { orderId: 3 }
   == APP == Order received: { orderId: 4 }
   == APP == Order received: { orderId: 5 }
   == APP == Order received: { orderId: 6 }
   == APP == Order received: { orderId: 7 }
   == APP == Order received: { orderId: 8 }
   == APP == Order received: { orderId: 9 }
   == APP == Order received: { orderId: 10 }
   == APP == Order received: { orderId: 11 }
   == APP == Order received: { orderId: 12 }
   == APP == Order received: { orderId: 13 }
   == APP == Order received: { orderId: 14 }
   == APP == Order received: { orderId: 15 }
   == APP == Order received: { orderId: 16 }
   == APP == Order received: { orderId: 17 }
   == APP == Order received: { orderId: 18 }
   == APP == Order received: { orderId: 19 }
   == APP == Order received: { orderId: 20 }
   ```

1. Press <kbd>Cmd/Ctrl</kbd> + <kbd>C</kbd> in both terminals to exit out of the service-to-service invocation.

## Deploy the Dapr application template using Azure Developer CLI

Deploy the Dapr application to Azure Container Apps using [`azd`](/azure/developer/azure-developer-cli/overview).

### Prepare the project

In a new terminal window, navigate into the sample's root directory.

   ```bash
   cd svc-invoke-dapr-nodejs
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
     (✓) Done: Log Analytics workspace: log-analytics-name
     (✓) Done: Application Insights: app-insights-name
     (✓) Done: Portal dashboard: dashboard-name
     (✓) Done: Container Apps Environment: container-apps-env-name
     (✓) Done: Container App: ca-checkout-name
     (✓) Done: Container App: ca-order-processor-name
   
   
   Deploying services (azd deploy)
   
     (✓) Done: Deploying service api
     - Endpoint: https://ca-order-processor-name.eastus.azurecontainerapps.io/
     (✓) Done: Deploying service worker
   
   SUCCESS: Your Azure app has been deployed!
   You can view the resources created under the resource group resource-group-name in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/<your-azure-subscription>/resourceGroups/resource-group-name/overview
   ```

### Confirm successful deployment 

In the Azure portal, verify the `checkout` service is passing orders to the `order-processor` service. 

1. Copy the `checkout` container app's name from the terminal output.

1. Sign in to the [Azure portal](https://portal.azure.com) and search for the container app resource by name.

1. In the Container Apps dashboard, select **Monitoring** > **Log stream**.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-menu.png" alt-text="Screenshot of navigating to the Log stream page in the Azure portal.":::

1. Confirm the `checkout` container is logging the same output as in the terminal earlier.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-portal-view-checkout-svc.png" alt-text="Screenshot of the checkout service container's log stream in the Azure portal.":::

1. Do the same for the `order-processor` service.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-portal-view-order-processor-svc.png" alt-text="Screenshot of the order processor service container's log stream in the Azure portal.":::


## What happened?

Upon successful completion of the `azd up` command:

- Azure Developer CLI provisioned the Azure resources referenced in the [sample project's `./infra` directory](https://github.com/Azure-Samples/svc-invoke-dapr-nodejs/tree/main/infra) to the Azure subscription you specified. You can now view those Azure resources via the Azure portal.
- The app deployed to Azure Container Apps. From the portal, you can browse the fully functional app.


::: zone-end

::: zone pivot="python"

## Run the Python applications locally

Before deploying the application to Azure Container Apps, start by running the `order-processor` and `checkout` services locally with Dapr.

### Prepare the project

1. Clone the [sample Dapr application](https://github.com/Azure-Samples/svc-invoke-dapr-python) to your local machine.

   ```bash
   git clone https://github.com/Azure-Samples/svc-invoke-dapr-python.git
   ```

1. Navigate into the sample's root directory.

   ```bash
   cd svc-invoke-dapr-python
   ```

### Run the Dapr applications using the Dapr CLI

Start by running the `order-processor` service.

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
   dapr run --app-port 8001 --app-id order-processor --app-protocol http --dapr-http-port 3501 -- python3 app.py
   ```

1. In a new terminal window, from the sample's root directory, navigate to the `checkout` caller service.

   ```bash
   cd checkout
   ```

1. Install the dependencies.

   ```bash
   pip3 install -r requirements.txt
   ```

1. Run the `checkout` service with Dapr.

   ```bash
   dapr run  --app-id checkout --app-protocol http --dapr-http-port 3500 -- python3 app.py
   ```

   #### Expected output

   In both terminals, the `checkout` service is calling orders to the `order-processor` service in a loop.

   `checkout` output:

   ```
   == APP == Order passed: {"orderId":1}
   == APP == Order passed: {"orderId":2}
   == APP == Order passed: {"orderId":3}
   == APP == Order passed: {"orderId":4}
   == APP == Order passed: {"orderId":5}
   == APP == Order passed: {"orderId":6}
   == APP == Order passed: {"orderId":7}
   == APP == Order passed: {"orderId":8}
   == APP == Order passed: {"orderId":9}
   == APP == Order passed: {"orderId":10}
   == APP == Order passed: {"orderId":11}
   == APP == Order passed: {"orderId":12}
   == APP == Order passed: {"orderId":13}
   == APP == Order passed: {"orderId":14}
   == APP == Order passed: {"orderId":15}
   == APP == Order passed: {"orderId":16}
   == APP == Order passed: {"orderId":17}
   == APP == Order passed: {"orderId":18}
   == APP == Order passed: {"orderId":19}
   == APP == Order passed: {"orderId":20}
   ```

   `order-processor` output:

   ```
   == APP == Order received: { orderId: 1 }
   == APP == Order received: { orderId: 2 }
   == APP == Order received: { orderId: 3 }
   == APP == Order received: { orderId: 4 }
   == APP == Order received: { orderId: 5 }
   == APP == Order received: { orderId: 6 }
   == APP == Order received: { orderId: 7 }
   == APP == Order received: { orderId: 8 }
   == APP == Order received: { orderId: 9 }
   == APP == Order received: { orderId: 10 }
   == APP == Order received: { orderId: 11 }
   == APP == Order received: { orderId: 12 }
   == APP == Order received: { orderId: 13 }
   == APP == Order received: { orderId: 14 }
   == APP == Order received: { orderId: 15 }
   == APP == Order received: { orderId: 16 }
   == APP == Order received: { orderId: 17 }
   == APP == Order received: { orderId: 18 }
   == APP == Order received: { orderId: 19 }
   == APP == Order received: { orderId: 20 }
   ```

1. Press <kbd>Cmd/Ctrl</kbd> + <kbd>C</kbd> in both terminals to exit out of the service-to-service invocation

## Deploy the Dapr application template using Azure Developer CLI

Deploy the Dapr application to Azure Container Apps using [`azd`](/azure/developer/azure-developer-cli/overview).

### Prepare the project

1. In a new terminal window, navigate into the [sample's](https://github.com/Azure-Samples/svc-invoke-dapr-python) root directory.

   ```bash
   cd svc-invoke-dapr-python
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
     (✓) Done: Log Analytics workspace: log-analytics-name
     (✓) Done: Application Insights: app-insights-name
     (✓) Done: Portal dashboard: dashboard-name
     (✓) Done: Container Apps Environment: container-apps-env-name
     (✓) Done: Container App: ca-checkout-name
     (✓) Done: Container App: ca-order-processor-name
   
   
   Deploying services (azd deploy)
   
     (✓) Done: Deploying service api
     - Endpoint: https://ca-order-processor-name.eastus.azurecontainerapps.io/
     (✓) Done: Deploying service worker
   
   SUCCESS: Your Azure app has been deployed!
   You can view the resources created under the resource group resource-group-name in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/<your-azure-subscription>/resourceGroups/resource-group-name/overview
   ```

### Confirm successful deployment 

In the Azure portal, verify the `checkout` service is passing orders to the `order-processor` service. 

1. Copy the `checkout` container app's name from the terminal output.

1. Sign in to the [Azure portal](https://portal.azure.com) and search for the container app resource by name.

1. In the Container Apps dashboard, select **Monitoring** > **Log stream**.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-menu.png" alt-text="Screenshot of navigating to the Log stream page in the Azure portal.":::

1. Confirm the `checkout` container is logging the same output as in the terminal earlier.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-portal-view-checkout-svc.png" alt-text="Screenshot of the checkout service container's log stream in the Azure portal.":::

1. Do the same for the `order-processor` service.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-portal-view-order-processor-svc.png" alt-text="Screenshot of the order processor service container's log stream in the Azure portal.":::


## What happened?

Upon successful completion of the `azd up` command:

- Azure Developer CLI provisioned the Azure resources referenced in the [sample project's `./infra` directory](https://github.com/Azure-Samples/svc-invoke-dapr-python/tree/main/infra) to the Azure subscription you specified. You can now view those Azure resources via the Azure portal.
- The app deployed to Azure Container Apps. From the portal, you can browse the fully functional app.

::: zone-end

::: zone pivot="csharp"

## Run the .NET applications locally

Before deploying the application to Azure Container Apps, start by running the `order-processor` and `checkout` services locally with Dapr.

### Prepare the project

1. Clone the [sample Dapr application](https://github.com/Azure-Samples/svc-invoke-dapr-csharp) to your local machine.

   ```bash
   git clone https://github.com/Azure-Samples/svc-invoke-dapr-csharp.git
   ```

1. Navigate into the sample's root directory.

   ```bash
   cd svc-invoke-dapr-csharp
   ```

### Run the Dapr applications using the Dapr CLI

Start by running the `order-processor` callee service with Dapr.

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
   dapr run --app-port 7001 --app-id order-processor --app-protocol http --dapr-http-port 3501 -- dotnet run
   ```

1. In a new terminal window, from the sample's root directory, navigate to the `checkout` caller service.

   ```bash
   cd checkout
   ```

1. Install the dependencies.

   ```bash
   dotnet build
   ```

1. Run the `checkout` service with Dapr.

   ```bash
   dapr run  --app-id checkout --app-protocol http --dapr-http-port 3500 -- dotnet run
   ```

   #### Expected output

   In both terminals, the `checkout` service is calling orders to the `order-processor` service in a loop.

   `checkout` output:

   ```
   == APP == Order passed: {"orderId":1}
   == APP == Order passed: {"orderId":2}
   == APP == Order passed: {"orderId":3}
   == APP == Order passed: {"orderId":4}
   == APP == Order passed: {"orderId":5}
   == APP == Order passed: {"orderId":6}
   == APP == Order passed: {"orderId":7}
   == APP == Order passed: {"orderId":8}
   == APP == Order passed: {"orderId":9}
   == APP == Order passed: {"orderId":10}
   == APP == Order passed: {"orderId":11}
   == APP == Order passed: {"orderId":12}
   == APP == Order passed: {"orderId":13}
   == APP == Order passed: {"orderId":14}
   == APP == Order passed: {"orderId":15}
   == APP == Order passed: {"orderId":16}
   == APP == Order passed: {"orderId":17}
   == APP == Order passed: {"orderId":18}
   == APP == Order passed: {"orderId":19}
   == APP == Order passed: {"orderId":20}
   ```

   `order-processor` output:

   ```
   == APP == Order received: { orderId: 1 }
   == APP == Order received: { orderId: 2 }
   == APP == Order received: { orderId: 3 }
   == APP == Order received: { orderId: 4 }
   == APP == Order received: { orderId: 5 }
   == APP == Order received: { orderId: 6 }
   == APP == Order received: { orderId: 7 }
   == APP == Order received: { orderId: 8 }
   == APP == Order received: { orderId: 9 }
   == APP == Order received: { orderId: 10 }
   == APP == Order received: { orderId: 11 }
   == APP == Order received: { orderId: 12 }
   == APP == Order received: { orderId: 13 }
   == APP == Order received: { orderId: 14 }
   == APP == Order received: { orderId: 15 }
   == APP == Order received: { orderId: 16 }
   == APP == Order received: { orderId: 17 }
   == APP == Order received: { orderId: 18 }
   == APP == Order received: { orderId: 19 }
   == APP == Order received: { orderId: 20 }
   ```

1. Press <kbd>Cmd/Ctrl</kbd> + <kbd>C</kbd> in both terminals to exit out of the service-to-service invocation.

## Deploy the Dapr application template using Azure Developer CLI

Deploy the Dapr application to Azure Container Apps using [`azd`](/azure/developer/azure-developer-cli/overview).

### Prepare the project

In a new terminal window, navigate into the [sample's](https://github.com/Azure-Samples/svc-invoke-dapr-csharp) root directory.

   ```bash
   cd svc-invoke-dapr-csharp
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
     (✓) Done: Log Analytics workspace: log-analytics-name
     (✓) Done: Application Insights: app-insights-name
     (✓) Done: Portal dashboard: dashboard-name
     (✓) Done: Container Apps Environment: container-apps-env-name
     (✓) Done: Container App: ca-checkout-name
     (✓) Done: Container App: ca-order-processor-name
   
   
   Deploying services (azd deploy)
   
     (✓) Done: Deploying service api
     - Endpoint: https://ca-order-processor-name.eastus.azurecontainerapps.io/
     (✓) Done: Deploying service worker
   
   SUCCESS: Your Azure app has been deployed!
   You can view the resources created under the resource group resource-group-name in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/<your-azure-subscription>/resourceGroups/resource-group-name/overview
   ```

### Confirm successful deployment 

In the Azure portal, verify the `checkout` service is passing orders to the `order-processor` service. 

1. Copy the `checkout` container app's name from the terminal output.

1. Sign in to the [Azure portal](https://portal.azure.com) and search for the container app resource by name.

1. In the Container Apps dashboard, select **Monitoring** > **Log stream**.
   
   :::image type="content" source="media/microservices-dapr-azd/log-streams-menu.png" alt-text="Screenshot of navigating to the Log stream page in the Azure portal.":::


1. Confirm the `checkout` container is logging the same output as in the terminal earlier.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-portal-view-checkout-svc.png" alt-text="Screenshot of the checkout service container's log stream in the Azure portal.":::

1. Do the same for the `order-processor` service.

   :::image type="content" source="media/microservices-dapr-azd/log-streams-portal-view-order-processor-svc.png" alt-text="Screenshot of the order processor service container's log stream in the Azure portal.":::


## What happened?

Upon successful completion of the `azd up` command:

- Azure Developer CLI provisioned the Azure resources referenced in the [sample project's `./infra` directory](https://github.com/Azure-Samples/svc-invoke-dapr-csharp/tree/main/infra) to the Azure subscription you specified. You can now view those Azure resources via the Azure portal.
- The app deployed to Azure Container Apps. From the portal, you can browse the fully functional app.


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
