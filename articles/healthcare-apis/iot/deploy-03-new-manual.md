---
title: Overview of manually deploying the MedTech service using the Azure portal - Azure Health Data Services
description: In this article, you'll see an overview of how to manually deploy the MedTech service in the Azure portal.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 10/28/2022
ms.author: jasteppe
---

# How to manually deploy MedTech service using the Azure portal

You may prefer to manually deploy MedTech service if you need to track every step of the developmental process. Manual deployment might be necessary if you have to customize or troubleshoot your deployment. Manual deployment will help you by providing all the details for implementing each task.

The explanation of MedTech service manual deployment using the Azure portal is divided into three parts that cover each of key tasks required:

- Part 1: Prerequisites (see Prerequisites below)
- Part 2: Configuration (see [Configure for manual deployment](deploy-05-new-config.md))
- Part 3: Deployment and Post Deployment (see [Manual deployment and post-deployment](deploy-06-new-deploy.md))

If you need a diagram with information on the MedTech service deployment, there's an architecture overview at [Choose a deployment method](deploy-iot-connector-in-azure.md#deployment-architecture-overview). This diagram shows the data flow steps of deployment and how MedTech service processes data into a Fast Healthcare Interoperability Resources (FHIR&#174;) Observation.

## Part 1: Prerequisites

Before you can begin configuring to deploy MedTech services, you need to have the following five prerequisites:

- A valid Azure subscription
- A resource group deployed in the Azure portal
- A workspace deployed in Azure Health Data Services
- An event hub deployed in a namespace
- FHIR service deployed in Azure Health Data Services

## Open your Azure account

The first thing you need to do is determine if you have a valid Azure subscription. If you don't have an Azure subscription, see [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/).

## Deploy a resource group in the Azure portal

When you sign in to your Azure account, go to the Azure portal and select the **Create a resource** button. Enter "Azure Health Data Services" in the "Search services and marketplace" box. This step should take you to the Azure Health Data Services page.

## Deploy a workspace in Azure Health Data Services

The first resource you must create is a workspace to contain your Azure Health Data Services resources. Start by selecting Create from the Azure Health Data Services resource page. This step will take you to the first page of Create Azure Health Data Services workspace, when you need to do the following eight steps:

1. Fill in the resource group you want to use or create a new one.

2. Give the workspace a unique name.

3. Select the region you want to use.

4. Select the Networking button at the bottom to continue.

5. Choose whether you want a public or private endpoint. 

6. Create tags if you want to use them. They're optional.

7. When you're ready to continue, select the Review + create tab.

8. Select the Create button to deploy your workspace. 

After a short delay, you'll start to see information about your new workspace. Make sure you wait until all parts of the screen are displayed. If your initial deployment was successful, you should see:

- "Your deployment is complete"
- Deployment name
- Subscription name
- Resource group name

## Deploy an event hub in the Azure portal using a namespace

An event hub is the next prerequisite you need to create. It's an important step because the event hub receives the data flow from a device and stores it until the MedTech service picks up the device data. Once the MedTech service picks up the device data, it can begin the transformation of the device data into a FHIR service Observation resource. Because Internet propagation times are indeterminate, the event hub is needed to buffer the data and store it for as much as 24 hours before expiring.

Before you can create an event hub, you must create a namespace in Azure portal to contain it. For more information on how To create a namespace and an event hub, see [Azure Event Hubs namespace and event hub deployed in the Azure portal](../../event-hubs/event-hubs-create.md).

## Deploy the FHIR service

The last prerequisite you need to do before you can configure and deploy MedTech service, is to deploy the FHIR service.

There are three ways to deploy FHIR service:

1. Using portal. See [Deploy a FHIR service within Azure Health Data Services - using portal](../fhir/fhir-portal-quickstart.md).

2. Using Bicep. See [Deploy a FHIR service within Azure Health Data Services using Bicep](../fhir/fhir-service-bicep.md).

3. Using an ARM template. See [Deploy a FHIR service within Azure Health Data Services - using ARM template](../fhir/fhir-service-resource-manager-template.md).

After you have deployed FHIR service, it will be ready to receive the data processed by MedTech and persist it as a FHIR service Observation.

## Continue on to Part 2: Configuration

After your prerequisites are successfully completed, you can go on to Part 2: Configuration. See **Next steps** below.

## Next steps

When you're ready to begin Part 2 of Manual Deployment, see

> [!div class="nextstepaction"]
> [Part 2: Configure the MedTech service for manual deployment using the Azure portal](deploy-05-new-config.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
