---
title: Enable Trusted Access for Azure Monitor for SAP solutions
description: Learn about enabling private endpoints for your AMS resources
author: vaidehikher18
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: how-to
ms.date: 03/05/2025
ms.author: vaidehikher
#Customer intent: As an SAP Basis or cloud infrastructure team member, I want to deploy Azure Monitor for SAP solutions with private endpoints for storage account and key vault.
---

# Enabling private endpoints for AMS resources

One of the challenges for customers is that the key vault and storage account that are created as part of the Azure Monitor for SAP solutions Managed Resource Group have their public access enabled. Customers want to disable this public access to be security compliant, but blocking the public access on these resources can lead to functional issues within AMS.
With this feature, you can use the system-assigned identity of the Azure Monitor for SAP solutions resource and our service will use trusted access mode to interact with the key vault and storage account. With this, you can then block public access and only allow traffic from AMS subnet on your key vault and storage account in AMS managed resource group.
This feature provides more security and control over your AMS resources, as you can limit the access to the key vault and storage account to the AMS service and subnet only and prevent any unauthorized or malicious access from outside.

# Prerequisites and steps to enable trusted access using MSI
To use the trusted access using MSI feature, you need to meet the following prerequisites and follow the steps below:
* Migrate to Dedicated app service plan: [Follow steps here](https://github.com/Azure/Azure-Monitor-for-SAP-solutions-preview/wiki/9-.a.-Cost-optimization-using-Dedicated-hosting-plan)
    > This is a mandatory step to avoid having function app scaling issues after storage account's public access is disabled.

`Important Note: Trusted access feature is supported only if the "ROUTE ALL" is enabled during the monitor creation.`

# Steps to follow while creating new AMS
* Login to the Azure portal using the above link and create a new Azure Monitor for SAP solutions resource.
* Fill in the required fields, such as the name, description etc.
* (Mandatory) Under the Networking section, have the 'Route all' option enabled.
* Under the Identity section, select Enable System Assigned Managed Identity.
![screenshot of enabling trusted access during AMS resource creation.](../monitor/media/enable-trusted-access/enable-system-assigned-mi.png)

* Click on Save to create the monitor instance.
* Create all the providers that are needed.

# Steps to follow for existing AMS
* Log in to the Azure portal and navigate to your Azure Monitor for SAP solutions resource.

* Migrate to Dedicated app service plan: [Follow steps here](https://github.com/Azure/Azure-Monitor-for-SAP-solutions-preview/wiki/9-.a.-Cost-optimization-using-Dedicated-hosting-plan)
  > This is a mandatory step to avoid having function app scaling issues after storage account's public access is disabled.

* Go to the identity tab and enable the system assigned identity and wait for the operation to complete and monitor should be in succeeded state after the operation.
![screenshot of enabling trusted access under indentity tab.](../monitor/media/enable-trusted-access/enable-mi-existing-customer.png)


# Disable Identity on existing AMS
* Go to Identity tab for AMS and disable the identity and save.

## Important: 
* Migrating to dedicated app service plan is a mandatory step to avoid having function app scaling issues after storage account's public access is disabled.
