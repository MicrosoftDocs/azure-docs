---
title: Azure managed applications
titleSuffix: An Azure Communication Services article
description: This article describes how to offer your customers cloud solutions using Azure managed applications for Azure Communication Services.
author: pgrandhi
manager: rajasekaran2003
services: azure-communication-services

ms.author: pgrandhi
ms.date: 04/09/2025
ms.topic: conceptual
ms.service: azure-communication-services
---

# Managed applications

This article describes how you can use Azure managed applications to offer cloud solutions that are easy for customers to deploy and operate.

Customers also control the permissions that enable full access to resources in the managed resource group. Customers can make sure that all end users are using approved versions, compliant with organizational standards. Your customers don't need to develop application-specific domain knowledge to manage these applications. Your customers automatically acquire application updates without the need to worry about troubleshooting and diagnose issues with the applications.

Azure managed applications enable you to build and manage complete solutions in Azure. Managed applications enable you to offer cloud solutions that are easy for customers to deploy and operate.  

You implement the infrastructure and can provide ongoing support. You determine if your managed application is public or private:

- You can offer managed application to all customers by publishing in Azure Marketplace.
- Or, you can make your managed application available only within your organization by publishing to an internal service catalog.

A managed application is similar to a solution template in Azure Marketplace. The main difference is that if you publish a managed application, you specify the cost to your customers for ongoing support of the solution.

Managed applications enable you to define terms for managing the application and all charges are handled through Azure billing. You can deploy managed applications via your subscriptions, but you don't need to maintain, update, or service them.

:::image type="content" source="../../azure-resource-manager/managed-applications/media/overview/managed-apps-resource-group.png" alt-text="Diagram that shows the relationship between customer and publisher Azure subscriptions for a managed resource group.":::

## How to implement

To publish a managed application to your service catalog, you need to:

1. Create an Azure ARM template that defines the Azure resources you want to deploy with the managed application. Every managed application includes a `mainTemplate.json` file.
2. Define the nested ARM templates as needed in their own JSON files in a subfolder, to be included in the `mainTemplate.json` file.
3. Create the portal experience to for the managed application. Use the `createUiDefinition.json` file to generate the portal user interface. Define the portal user interface elements for that customers see when deploying the managed application.
4. Create a `.zip` package that contains the required JSON files. The `.zip` package file has a 120-MB limit for a service catalog's managed application definition.
5. Publish the managed application definition so it's available in your service catalog.

For more information, see [Advantages of managed applications](/azure/azure-resource-manager/managed-applications/overview#advantages-of-managed-applications).

## Sample applications

Azure Communication Services managed applications provide samples that showcase how you can use the Azure Resource Manager (ARM) templates. Use the ARM templates to implement infrastructure for specific Azure Communication Services scenarios.

For example, you can:

- Create an Azure Communication Services resource.
- Create a storage queue.
- Set up the storage queue as event subscription for your resource using managed identities.
- Enable diagnostic settings for the resource for troubleshooting purposes. 
- Access diagnostic logs and update any infrastructure as needed over time. 

For more information about the sample applications, see GitHub Azure Samples [Managed Communication Services](https://github.com/Azure-Samples/communication-services-azure-managed-apps/blob/fca4bcad7516cf6c001c171272aceda4ed62c7a0/ManagedApplicationSamples/readme.md).

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure Communication Services managed application](https://github.com/Azure-Samples/communication-services-azure-managed-apps/blob/fca4bcad7516cf6c001c171272aceda4ed62c7a0/ManagedApplicationSamples/readme.md)

## Related articles

[Azure managed applications overview](/azure/azure-resource-manager/managed-applications/overview)
