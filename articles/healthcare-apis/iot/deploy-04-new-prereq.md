---
title: Prerequisites for deploying the MedTech service manually using the Azure portal - Azure Health Data Services
description: In this article, you'll learn the prerequisites for manually deploying the MedTech service in the Azure portal.
author: mcevoy-building7
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 09/27/2022
ms.author: v-smcevoy
---

# Prerequisites for manually deploying the MedTech service using the Azure portal

Before you can configure or deploy MedTech services, you need to have the following five prerequisites:

- A valid Azure subscription
- A resource group deployed in the Azure portal
- A workspace deployed in Azure Health Data Services
- An event hub deployed in a namespace
- FHIR service deployed in Azure Health Data Services

## Open your Azure account

The first thing you need to do is determine if you have a valid Azure subscription. If you don't have an Azure subscription, see [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/).

## Deploy a resource group in the Azure portal

When you log in to your Azure account, go to Azure portal and select the Create a resource button. Then enter "Azure Health Data Services" in the "Search services and marketplace" box. You should take you to the Azure Health Data Services blade.

## Deploy a workspace in Azure Health Data Services

The first resource you must create is a workspace to contain your Azure Health Data Services resources.

Start by selecting Create from the Azure Health Data Services resource page. This will take you to the first page of Create Azure Health Data Services workspace, when you need to do the following 8 steps:

1. Fill in the resource group you want to use or create a new one.

2. Give the workspace a unique name.

3. Select the region you want to use.

4. Select the Networking button at the bottom to continue.

5. Choose whether you want a public or private endpoint. 

6. Create tags if you want to use them. 

7. When you are ready to move forward, select the Review + create tab.

8. Select the Create button to deploy your workspace. 

After a short delay, you will start to see information about your new workspace. Make sure you wait until all parts of the screen are displayed. If your initial deployment was successful, you should see:

- "Your deployment is complete"
- Deployment name
- Subscription name
- Resource group name

## Deploy an event hub in the Azure portal using a namespace

An event hub is the next prerequisite you need to create. It is important because it receives the data flow from a medical device and stores it there until MedTech can pick up the data and translate it into a FHIR service Observation resource. Because Internet propagation times are indeterminate, the event hub is needed to buffer the data and store it for as much as 24 hours before expiring.

Before you can create an event hub, you must create a namespace in Azure portal to contain it. For more information on how To create a namespace and an event hub, see [Azure Event Hubs namespace and event hub deployed in the Azure portal](../../event-hubs/event-hubs-create.md).

## Deploy the FHIR service

The last thing you need to do before you can configure and deploy MedTech service is to deploy the FHIR service.

There are three ways to deploy FHIR service:

1. Using portal. See [Deploy a FHIR service within Azure Health Data Services - using portal](../fhir/fhir-portal-quickstart.md).

2. Using Bicep. See [Deploy a FHIR service within Azure Health Data Services using Bicep](../fhir/fhir-service-bicep.md).

3. Using an ARM template. See [Deploy a FHIR service within Azure Health Data Services - using ARM template](../fhir/fhir-service-resource-manager-template.md).

After you have deployed FHIR service, it will be ready to take the data processed by MedTech and persist it as a FHIR service Observation.

## Next steps

In this article, you learned about the prerequisites needed to deploy the MedTech service manually. When you have completed all the prerequisite requirements and your FHIR service is deployed, you are ready for the next step of manual deployment, see

>[!div class="nextstepaction"]
>[Configure the MedTech service for manual deployment using the Azure portal](deploy-05-new-config.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
