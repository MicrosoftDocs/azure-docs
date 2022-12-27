---
title:  "App and deployment in Azure Spring Apps"
description: This topic explains the distinction between application and deployment in Azure Spring Apps.
author: karlerickson
ms.author: karler
ms.service: spring-apps
ms.topic: conceptual
ms.date: 07/23/2020
ms.custom: devx-track-java, event-tier1-build-2022
---

# App and deployment in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

**App** and **Deployment** are the two key concepts in the resource model of Azure Spring Apps. In Azure Spring Apps, an *App* is an abstraction of one business app.  One version of code or binary deployed as the *App* runs in a *Deployment*.  Apps run in an *Azure Spring Apps Service Instance*, or simply *service instance*, as shown next.

 ![Apps and Deployments](./media/spring-cloud-app-and-deployment/app-deployment-rev.png)

You can have multiple service instances within a single Azure subscription, but the Azure Spring Apps Service is easiest to use when all of the Apps that make up a business app reside within a single service instance.

Azure Spring Apps standard tier allows one App to have one production deployment and one staging deployment, so that you can do blue/green deployment on it easily.

## App

The following features/properties are defined on App level.

| Features | Description |
|:--|:----------------|
| Public</br>Endpoint | The URL to access the app |
| Custom</br>Domain | CNAME record that secures the custom domain |
| Service</br>Binding | Out of box connection with other Azure services |
| Managed</br>Identity | Managed identity by Azure Active Directory allows your app to easily access other Azure AD-protected resources such as Azure Key Vault |
| Persistent</br>Storage | Setting that enables data to persist beyond app restart |

## Deployment

The following features/properties are defined on Deployment level, and will be exchanged when swapping production/staging deployment.

| Features | Description |
|:--|:----------------|
| CPU | Number of vcores per App instance |
| Memory | Gb of memory per App instance|
| Instance</br>Count | The number of app instances, set manually or automatically |
| Auto-Scale | Scale instance count automatically based on predefined rules and schedules |
| JVM</br>Options | Setting JVM options  |
| Environment</br>Variables | Setting environment variables |
| Runtime</br>Version | Java 8/Java 11|

## Restrictions

* **An App must have one production Deployment**: Deleting a production Deployment is blocked by the API. It should be swapped to staging before deleting.
* **An App can have at most two Deployments**: Creating more than two deployments is blocked by the API. Deploy your new binary to either the existing production or staging deployment.
* **Deployment management is not available in Basic Tier**: Use Standard tier for Blue-Green deployment capability.

## Next steps

* [Set up a staging environment in Azure Spring Apps](./how-to-staging-environment.md)
