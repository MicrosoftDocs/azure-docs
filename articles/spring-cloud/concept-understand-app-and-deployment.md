---
title:  "App and deployment in Azure Spring Cloud"
description: This topic explains the distinction between application and deployment in Azure Spring Cloud.
author: karlerickson
ms.author: karler
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 07/23/2020
ms.custom: devx-track-java
---

# App and deployment in Azure Spring Cloud

**This article applies to:** ✔️ Java ✔️ C#

**App** and **Deployment** are the two key concepts in the resource model of Azure Spring Cloud. In Azure Spring Cloud, an *App* is an abstraction of one business app or one microservice.  One version of code or binary deployed as the *App* runs in a *Deployment*.  Apps run in an *Azure Spring Cloud Service Instance*, or simply *service instance*, as shown next.

 ![Apps and Deployments](./media/spring-cloud-app-and-deployment/app-deployment-rev.png)

You can have multiple service instances within a single Azure subscription, but the Azure Spring Cloud Service is easiest to use when all of the Apps that make up a business app or microservice reside within a single service instance.

Azure Spring Cloud standard tier allows one App to have one production deployment and one staging deployment, so that you can do blue/green deployment on it easily.

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

## See also
* [Set up a staging environment in Azure Spring Cloud](./how-to-staging-environment.md)