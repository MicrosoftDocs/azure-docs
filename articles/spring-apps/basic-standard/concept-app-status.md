---
title: App Status in Azure Spring Apps
description: Learn the app status categories in Azure Spring Apps
author: KarlErickson
ms.service: azure-spring-apps
ms.topic: conceptual
ms.date: 03/26/2024
ms.author: karler
ms.custom: devx-track-java
---

# App status in Azure Spring Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Java ✅ C#

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article shows you how to view app status for Azure Spring Apps.

The Azure Spring Apps UI delivers information about the status of running applications. There's an **Apps** option for each resource group in a subscription that displays general status of application types. For each application type, there's a display of **Application instances**.

## Apps status

To view general status of an application type, select **Apps** in the left navigation pane of a resource group to display the following status information of the deployed app:

* **Provisioning state**: Shows the deployment's provisioning state.
* **Running instance**: Shows how many app instances are running and how many app instances you desire. If you stop the app, this column shows **stopped**.
* **Registration status**: Shows how many app instances are registered in service discovery and how many app instances you desire. If you stop the app, this column shows **stopped**.

:::image type="content" source="media/concept-app-status/apps-ui-status.png" alt-text="Screenshot of the Azure portal that shows the Apps Settings page with specific columns highlighted." lightbox="media/concept-app-status/apps-ui-status.png":::

### Deployment status

The deployment status shows the running state of the deployment. The status is reported as one of the following values:

| Value   | Definition                        |
|---------|-----------------------------------|
| Running | The deployment SHOULD be running. |
| Stopped | The deployment SHOULD be stopped. |

### Provisioning status

The deployment provisioning status describes the state of operations of the deployment resource. This status shows the comparison between the functionality and the deployment definition.

The provisioning state is accessible only from the CLI. The status is reported as one of the following values:

| Value     | Definition                                              |
|-----------|---------------------------------------------------------|
| Creating  | The resource is creating and isn't ready.              |
| Updating  | The resource is updating and the functionality might be different from the deployment definition until the update is complete.                               |
| Succeeded | Successfully supplied resources and deploys the binary. The deployment's functionality is the same as the definition and all app instances are working. |
| Failed    | Failed to achieve the **Succeeded** goal.                 |
| Deleting  | The resource is being deleted which prevents operation, and the resource isn't available in this status. |

### Registration status

The app registration status shows the state in service discovery. The Basic/Standard plan uses Eureka for service discovery. For more information on how the Eureka client calculates the state, see [Eureka's health checks](https://cloud.spring.io/spring-cloud-netflix/multi/multi__service_discovery_eureka_clients.html#_eurekas_health_checks). The Enterprise pricing plan uses [Tanzu Service Registry](../enterprise/how-to-enterprise-service-registry.md) for service discovery.

## App instances status

The *app instance* status represents every instance of the app. To view the status of a specific instance of a deployed app, select the **App instance** pane and then select the **App Instance Name** value for the app. The following status values appear:

* **Status**: Indicates whether the instance is starting, running, terminating, or in failed state.
* **Discovery Status**: The registered status of the app instance in the Eureka server or the Service Registry.

:::image type="content" source="media/concept-app-status/apps-ui-instance-status.png" alt-text="Screenshot of the Azure portal showing the App instance Settings page with the Status and Discovery status columns highlighted." lightbox="media/concept-app-status/apps-ui-instance-status.png":::

### App instance status

The instance status is reported as one of the following values:

| Value       | Definition |
|-------------|------------|
| Starting    | The binary is successfully deployed to the given instance. The instance booting the **.jar** file might fail because the **.jar** file can't run properly. Azure Spring Apps restarts the app instance in 60 seconds if it detects that the app instance is still in the **Starting** state. |
| Running     | The instance works. The instance can serve requests from inside Azure Spring Apps. |
| Failed      | The app instance failed to start the user's binary after several retries. The app instance might be in one of the following states:<br/>- The app might stay in the **Starting** status and never be ready for serving requests.<br/>- The app might boot up but crash in a few seconds. |
| Terminating | The app instance is shutting down. The app might not serve requests and the app instance is removed. |

### App discovery status

The discovery status of the instance is reported as one of the following values:

| Value          | Definition |
|----------------|------------|
| UP             | The app instance is registered to Eureka and ready to receive traffic |
| OUT_OF_SERVICE | The app instance is registered to Eureka and able to receive traffic. but shuts down for traffic intentionally. |
| DOWN           | The app instance is registered but not able to receive traffic. |
| UNREGISTERED   | The app instance isn't registered to Eureka. |
| N/A            | The app instance is running with custom container or service discovery is not enabled. |

## Next steps

* [Prepare a Spring or Steeltoe application for deployment in Azure Spring Apps](how-to-prepare-app-deployment.md)
