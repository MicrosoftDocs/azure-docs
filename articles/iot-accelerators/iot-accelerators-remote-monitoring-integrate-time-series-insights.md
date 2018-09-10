---
title: Integrate Azure Time Series Insights with Remote Monitoring | Microsoft Docs
description: Learn how-to you will learn how to configure TSI for an existing Remote Monitoring solution that does not include TSI out of the box.
author: philmea
manager: timlt
ms.author: philmea
ms.date: 04/29/2018
ms.topic: conceptual
ms.service: iot-accelerators
services: iot-accelerators
---

# Integrate Azure Time Series Insights with Remote Monitoring
Azure Time Series Insights is a fully managed analytics, storage, and visualization service for managing IoT-scale time-series data in the cloud. You can use Time Series Insights to store and manage time-series data, explore and visualize events simultaneously, conduct root-cause analysis, and to compare multiple sites and assets.

 Our solution accelerator now provides automatic deployment and integration with Time Series Insights*. In this how-to you will learn how to configure Time Series Insights for an existing Remote Monitoring solution that does not have Time Series Insights.

> [!NOTE]
> Time Series Insights is not yet available in Mooncake. All Mooncake Remote Monitoring deployments will continue to use Cosmos DB for all storage.

## Prerequisites

To complete this how-to, you will need have already deployed a Remote Monitoring solution:

* [Deploy the Remote Monitoring preconfigured solution](quickstart-remote-monitoring-deploy.md)

## Create a consumer group

You will need to create a dedicated consumer group in your IoT Hub to be used for streaming data to Time Series Insights.

> [!NOTE]
> Consumer groups are used by applications to pull data from Azure IoT Hub. Each consumer group allows up to five output consumers. You should create a new consumer group for every five output sinks and you can create up to 32 consumer groups.

1. In the Azure portal, click the Cloud Shell button.

1. Execute the following command to create a new consumer group:

```azurecli-interactive
az iot hub consumer-group create --hub-name contosorm30526 --name timeseriesinsights --resource-group ContosoRM
```

## Deploy Time Series Insights and connect to IoT Hub
Next, deploy Time Series Insights as an additional resource into your Remote Monitoring solution.

1. Sign in to the [Azure portal](http://portal.azure.com/).

1. Select **Create a resource** > **Internet of Things** > **Time Series Insights**.

    ![New Time Series Insights](./media/iot-accelerators-time-series-insights/new-time-series-insights.png)

1. To create your Time Series Insights environment, use the values in the following table:

    | Setting | Value |
    | ------- | ----- |
    | Environment Name | The following screenshot uses the name **contorosrmtsi**. Choose your own unique name when you complete this step. |
    | Subscription | Select your Azure subscription in the drop-down. |
    | Resource group | **Use existing**. Select the name of your existing Remote Monitoring resource group. |
    | Location | We are using **East US**. Create your environment in the same region as your Remote Monitoring solution if possible. |
    | Sku |**S1** |
    | Capacity | **1** |
    | Pin to dashboard | **Yes** |

    ![Create Time Series Insights](./media/iot-accelerators-time-series-insights/new-time-series-insights-create.png)

1. Click **Create**. It can take a moment for the environment to be created.

1. Go to Azure portal and find the Time Series Insights resource. Configure the event source to connect the IoT Hub through the dedicated Consumer Group created above. (TODO: more detailed steps)

> [!NOTE]
> If you need to grant additional users access to the Time Series Insights explorer, you can use these steps to [grant data access](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-data-access#grant-data-access).

## Add the Remote Monitoring application and users into TSI data access policy
To make sure all users who have access to your Remote Monitoring solution are able to explore data in the TSI explorer, you will need to add your application and users under data access policies in the Azure Portal. 

1. In the navigation list, choose **Resource groups**.

1. Choose the **ContosoRM** resource group.

1. Choose **contosormtsi** in the list of Azure resources.

1. Choose **Data Access Policies** to see the current list of role assignments.

1. Choose **Add** to open the **Select User Rule** pane.

   If you don't have permissions to assign roles, you won't see the **Add** option.

   ![Add permissions pane](./media/role-assignments-portal/add-permissions.png)

1. In the **Role** drop-down list, select a role such as **Reader** and **Contributor**.

1. In the **Select** list, select a user, group, or application. If you don't see the security principal in the list, you can type in the **Select** box to search the directory for display names, email addresses, and object identifiers.

1. Choose **Save** to create the role assignment.

   After a few moments, the security principal is assigned the role in data access policies.

## Configure ASA Streaming Job to stop sending messages to Cosmos DB 
The next step is to configure the ASA Manager microservice to write messages to TSI. This step will duplicate the messages that are right now streamed to Cosmos DB.

1. FInd ASA streaming job on Azure portal
1. Stop ASA streaming job
1. Edit the ASA query and remove the message stream at the bottom
1. (Optional) Remove the output of message which is point to the Cosmos DB collection `messages`. This will stop duplicating messages into Cosmos DB collection and save on costs.
1. Restart ASA streamingjobs

## Pull the latest released telemetry service code from Github repo or tagged docker image

### *Pull the latest telemetry service update (with config value for storage set to "tsi").
for DotNet version, e.g:

1. docker pull azureiotpcs/telemetry-dotnet:1.0.2
1. docker pull azureiotpcs/asa-manager-dotnet:1.0.2
1. docker pull azureiotpcs/pcs-remote-monitoring-webui:1.0.2

## Configure the environment of `basic` deployment for the updated micro services above
1. Create a key for the AAD application on Azure Portal
1. Pull the latest docker compose yaml file from Github repo
1. SSH into the VM
1. `cd /app`
1. Add the following environment variables for each micro services in the yaml file and `env-setup` script in the VM
* PCS_TELEMETRY_STORAGE_TYPE=tsi
* PCS_TSI_FQDN={TSI Data Access FQDN}
* PCS_AAD_TENANT={AAD Tenant Id}
* PCS_AAD_APPID={AAD application Id}
* PCS_AAD_APPSECRET={AAD application key}
1. Edit your the docker compose file and add above environment variables for telemetry service
1.  Edit your the docker compose file and add `PCS_TELEMETRY_STORAGE_TYPE` for ASA Manager service
1. Restart docker contains `sudo ./start.sh` from the VM


## Configure the environment of `standard` deployment for the updated micro services above
1. run `kubectl proxy`
1. Go to the Kubernets management console
1. Find the config map to add the new environment vaiables for TSI
```
telemetry.storage.type: "tsi"
telemetry.tsi.fqdn: "{TSI Data Access FQDN}"
security.auth.serviceprincipal.secret: "{AAD application service principal secret}"
```
1. Edit the template yaml file for telemetry service pod:
```
    - name: PCS_AAD_TENANT
        valueFrom:
        configMapKeyRef:
            name: deployment-configmap
            key: security.auth.tenant
    - name: PCS_AAD_APPID
        valueFrom:
        configMapKeyRef:
            name: deployment-configmap
            key: security.auth.audience
    - name: PCS_AAD_APPSECRET
        valueFrom:
        configMapKeyRef:
            name: deployment-configmap
            key: security.auth.serviceprincipal.secret
    - name: PCS_TELEMETRY_STORAGE_TYPE
        valueFrom:
        configMapKeyRef:
            name: deployment-configmap
            key: telemetry.storage.type
    - name: PCS_TSI_FQDN
        valueFrom:
        configMapKeyRef:
            name: deployment-configmap
            key: telemetry.tsi.fqdn
```
1. Edit the template yaml file for ASA manager service pod:
```
    - name: PCS_TELEMETRY_STORAGE_TYPE
        valueFrom:
        configMapKeyRef:
            name: deployment-configmap
            key: telemetry.storage.type
```

## Open your telemetry in the Time Series Insights explorer
1. Click **Go To Environment**, which will open the Time Series Insights explorer web app.

    ![Time Series Insights Explorer](./media/iot-tsi-explorer)



## *[Optional]* Configure the Web UI to link to the TSI explorer
To easily view your data in the TSI explorer, we recommend customizing the UI to easily link to the environment.

1. 

## *[Optional]* Migrate existing data to TSI
TSI can store data up to 400 days, which can help you analyze long term trends and patterns. If you would like to migrate your existing Remote Monitoring solution data to TSI, you will need to make the following modifications. However, we recommend starting fresh with your data if possible to avoid running into daily TSI throttling limits.

If you would like to work around these throttling limits you will need to temporarily increase the capacity of your TSI environment which will also temporarily increase your cost.

1. Go to the Time Series Insights resource that you created in the Azure Portal.

1. Follow the steps outlined to [scale your environment](https://docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-how-to-scale-your-environment).

> [!NOTE]
> Migrating your existing data into Time Series Insights will temporarily increase your cost. To optimize your capacity changes, see [how to plan your Time Series Insights environment](https://docs.microsoft.com/en-us/azure/time-series-insights/time-series-insights-environment-planning).

## Next Steps
* To learn about how to explore your data and diagnose an alert in the TSI explorer, see [Diagnosing an alert with Azure Time Series Insights](/tutorials).

* To learn how to explore and query data in the Time Series Insights explorer, see [Azure Time Series Insights explorer](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-explorer).
