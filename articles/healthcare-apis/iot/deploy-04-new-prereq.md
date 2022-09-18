---
title: Prerequisites for deploying the MedTech service manually using the Azure portal - Azure Health Data Services
description: In this article, you'll learn the prerequisites for manually deploying the MedTech service in the Azure portal.
author: mcevoy-building7
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 09/17/2022
ms.author: v-smcevoy
---

# Prerequisites for manually deploying the MedTech service using the Azure portal

Before you can configure or deploy MedTech services, you must satisfy the following prerequisites:

- You must have a valid Azure account.
- You must have a resource group deployed in the Azure portal.
- You must deploy an event hub service instance in an Event Hubs namespace.
- You must deploy a workspace in Azure Health Data Services.
- You must deploy FHIR service in Azure Health Data Services.

## Azure account

You can get a free Azure account at [Cloud Computing Services | Microsoft Azure](https://azure.microsoft.com). Once you have logged in to your Azure account, go to the [Azure portal to begin](https://portal.azure.com/#home).

## Deploy a resource group in the Azure portal

From portal, select the Create a resource button. Then enter "Azure Health Data Services" in the "Search services and marketplace" box. You should be taken to the Azure Health Data Services blade.

## Deploy a workspace to contain your Azure Health Data Services resources.

The first resource you must create is a workspace to hold all your other important resources.

From the Azure Health Data Services resource page, select Create. You will be taken to the first page of Create Azure Health Data Services workspace.

Make sure the appropriate subscription appears for the subscription you want to use. Fill in the resource group you want to use or create a new one. Then give the workspace a unique name and select the region you want to use.

Select the Networking button at the bottom to continue. Choose whether you want a public or private endpoint. Create tags if you want to use them. When you are ready to move forward, select the Review + create tab.

Select the Create button to deploy your workspace. After a short delay, you will see information on your new workspace. Make sure you wait until all parts of the screen are displayed.

If your initial deployment was successful, you should see "Your deployment is complete" displayed along with the Deployment name, Subscription, and Resource group.

## Deploy an event hub in the Azure portal using a namespace

The Event Hubs service plays a crucial role in the data flow from medical device to becoming an Observation in FHIR service. Data flows to the event hub from the device and is then stored there until MedTech can pick up the data.

The event hub is needed as a buffer because Internet propagation times are indeterminate, but the event hub can store the data for as much as 24 hours before expiring.

Before you can create an event hub, you must create a namespace in Azure portal as a way to scope the one or more event hubs under your control.

To create a namespace and an Event Hubs instance, see [Azure Event Hubs namespace and event hub deployed in the Azure portal](../../event-hubs/event-hubs-create.md) for more information.

## Deploy the FHIR service

The last prerequisite you need to do before you can configure and deploy MedTech service is to deploy the FHIR service. FHIR service will take the data that MedTech processed and persist it as a FHIR service Observation.

There are three ways to deploy FHIR service:

1. Using portal. See [Deploy a FHIR service within Azure Health Data Services - using portal](../fhir/fhir-portal-quickstart.md).

2. Using Bicep. See [Deploy a FHIR service within Azure Health Data Services using Bicep](../fhir/fhir-service-bicep.md)

3. Using an ARM template [Deploy a FHIR service within Azure Health Data Services - using ARM template](../fhir/fhir-service-resource-manager-template.md)

## Summary of Prerequisites

You have done the following prerequisites:

- Created resources in the Azure portal
- Created an Azure Health Data Service workspace
- Deployed Event Hubs service
- Deployed FHIR service

To begin the next step of configuring the MedTech service, go to [Configuring the MedTech service](deploy-05-new-config.md)
in preparation for deployment.

## Next steps

In this article, you learned about prerequisites needed to deploy the MedTech service manually. To learn more about the next step for manual deployment, see

>[!div class="nextstepaction"]
>[Configure the MedTech service for manual deployment using the Azure portal](deploy-05-new-config.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
