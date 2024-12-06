---
title: Azure Container Apps samples
description: Learn how to use Azure Container Apps from existing samples 
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 05/31/2024
ms.author: cshoe
---

# Azure Container Apps samples

Refer to the following samples to learn how to use Azure Container Apps in different contexts and paired with different technologies.

| Name | Description |
|--|--|
| [A/B Testing your ASP.NET Core apps using Azure Container Apps](https://github.com/Azure-Samples/dotNET-Frontend-AB-Testing-on-Azure-Container-Apps)<br /> | Shows how to use Azure App Configuration, ASP.NET Core Feature Flags, and Azure Container Apps revisions together to gradually release features or perform A/B tests. |
| [gRPC with ASP.NET Core on Azure Container Apps](https://github.com/Azure-Samples/dotNET-Workers-with-gRPC-messaging-on-Azure-Container-Apps) | This repository contains a simple scenario that demonstrates how an ASP.NET Core 6.0 app is built as a cloud-native application. The application is hosted in Azure Container Apps that uses gRPC request/response transmission from Worker microservices. The gRPC service simultaneously streams sensor data to a Blazor server frontend, so you can see the data charted in real-time. |
| [Deploy an Orleans Cluster to Container Apps](https://github.com/Azure-Samples/Orleans-Cluster-on-Azure-Container-Apps) | An end-to-end sample and tutorial for getting a Microsoft Orleans cluster running on Azure Container Apps. Worker microservices rapidly transmit data to a back-end Orleans cluster for monitoring and storage, emulating thousands of physical devices in the field. |
| [Deploy a shopping cart Orleans app to Container Apps](https://github.com/Azure-Samples/orleans-blazor-server-shopping-cart-on-container-apps) | An end-to-end example shopping cart app built in ASP.NET Core Blazor Server with Orleans deployed to Azure Container Apps. |
| [ASP.NET Core front-end with two back-end APIs on Azure Container Apps](https://github.com/Azure-Samples/dotNET-FrontEnd-to-BackEnd-on-Azure-Container-Apps)<br /> | This sample demonstrates ASP.NET Core 6.0 can be used to build a cloud-native application hosted in Azure Container Apps. |
| [ASP.NET Core front-end with two back-end APIs on Azure Container Apps (with Dapr)](https://github.com/Azure-Samples/dotNET-FrontEnd-to-BackEnd-with-DAPR-on-Azure-Container-Apps)<br /> | Demonstrates how ASP.NET Core 6.0 is used to build a cloud-native application hosted in Azure Container Apps using Dapr. |
| [Deploy Drupal on Azure Container Apps](https://github.com/Azure-Samples/drupal-on-azure-container-apps) | Demonstrates how to deploy a Drupal site to Azure Container Apps, with Azure Database for MariaDB, and Azure Files to store static assets.|
| [Launch your first Java app on Azure Container Apps](https://github.com/Azure-Samples/azure-container-apps-java-samples/tree/main/spring-petclinic) |A monolithic Java application called PetClinic built with Spring Framework. PetClinic is a well-known sample application provided by the Spring Framework community. |
| [Launch your first Java microservice app on Azure Container Apps](https://github.com/Azure-Samples/azure-container-apps-java-samples/tree/main/spring-petclinic-microservices) |A microservices-based version of PetClinic with Spring, built with Spring Framework, showcasing configuration management, service discovery, and health/metrics monitoring on Azure Container Apps.|
| [Launch Your first Java Spring Batch app on Azure Container Apps](https://github.com/Azure-Samples/azure-container-apps-java-samples/tree/main/spring-batch-football) |A Java Spring Batch application showcasing an ephemeral statistics loading job, adapted from the Spring Batch Football Job sample, and deployable to Azure Container Apps. |
| [Launch Your first Java AI application on Azure Container Apps](https://github.com/Azure-Samples/spring-petclinic-ai) |A Java AI application built with the Spring-AI Framework, demonstrating how to integrate with Azure OpenAI capabilities to enhance PetClinic application with an intelligent Chatbot, and deploy it to Azure Container Apps. |
