---
title: Understanding app status in Azure Spring Cloud
description: Learn the app status categories in Azure Spring Cloud
author: MikeDodaro
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 04/10/2020
ms.author: brendm

---

# Understanding app status in Azure Spring Cloud

The Azure Spring Cloud UI delivers information about the status of running applications.  There is an **Apps** option for each resource group in a subscription that displays general status of application types.  For each application type, there is display of **Application instances**.

## Apps status
To view general status of an application type, select **Apps** in the left navigation pane of a resource group. The result will be display of the status of the deployed app and its discovery status:
* DeploymentStatus: Whether the app is deployed or its state
* DiscoveryStatus: The registered status of the app in Eureka server, which is the same as the definition in Eureka

 ![Apps status](media/spring-cloud-concept-app-status/apps-ui-status.png)

**The Deployment status is reported as one of the following values:**

Deployment.properties.Status

| Enum | Definition |
|:--:|:----------------:|
| Running | The deployment runs properly |
| Stopped | The deployment is stopped |
| Compiling | ASC is compiling user's source code |
| Allocating | ASC is acquiring resource for the deployment. Prevent user operation in this status. |
| Upgrading | User's app is trying to boot up with given resources and binary deployment. |
| Failed | User's app failed to deploy due to lack of resources, or binary cannot be built from source code. |

**The provisioning state is reported as one of the following values:**

Deployment.properties.privioningState: 

| Enum | Definition |
|:--:|:----------------:|
| Creating | The resource is creating. |
| Updating | The resource is updating. |
| Succeeded | ASC successfully supplies resources and deploys the binary. |
| Failed | ASC failed to achieve the *Succeeded* goal. |
| Deleting | The resource is being deleted. This prevents operation, and the resource is not available in this status. |

**The Discovery status is reported as one of the following values:**

DiscoveryStatus: registered status of the instance in Eureka server, same as the definition in Eureka

| Enum | Definition |
|:--:|:----------------:|
| Up | The app instance is registered to eureka and ready to receive traffic |
| OUT_OF_SERVICE | The app instance is registered to Eureka and able to receive traffic. but shuts down for traffic intentionally. |
| DOWN | The app instance is not registered to Eureka or is registered but not able to receive traffic. |

## App instances status

To view the status of a specific instance of a deployed app, click the **Name** of the app in the **Apps** UI. The results will display:
* AppInstance.status: Whether the instance is running or its state
* DiscoveryStatus: The registered status of the app instance in Eureka server

 ![App instances status](media/spring-cloud-concept-app-status/apps-ui-instance-status.png)

**The instance status is reported as one of the following values:**

Deployment.properties.appInstance.status: 

| Enum | Definition |
|:--:|:----------------:|
| Pending | ASC is still allocating resources for the instance |
| Starting | The binary is successfully deployed to the given instance. Instance booting the jar file may fail because jar cannot run properly. |
| Running | The instance works. |
| Failed | ASC failed to deploy the resource to the instance. |
| Terminating | The app instance is shutting down. |
| Retiring | The app instance is for the previous deployment and should be retired after the current deployment operation. |

**The discovery status of the instance is reported as one of the following values:**

Deployment.properties.appInstance. DiscoveryStatus: 
registered status of the instance in Eureka server, same as the definition in Eureka

| Enum | Definition |
|:--:|:----------------:|
| Up | The app instance is registered to eureka and ready to receive traffic |
| OUT_OF_SERVICE | The app instance is registered to Eureka and able to receive traffic. but shuts down for traffic intentionally. |
| DOWN | The app instance is not registered to Eureka or is registered but not able to receive traffic. |


## See also
* [Prepare a Java Spring application for deployment in Azure Spring Cloud](spring-cloud-tutorial-prepare-app-deployment.md)