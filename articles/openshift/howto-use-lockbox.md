---
title: Using Azure Lockbox to authorize support access to Azure Red Hat OpenShift cluster resources.
description: In this how-to article, learn how to use review support requests to access Azure Red Hat OpenShift cluster resources using Azure Lockbox.
author: johnmarco
ms.service: azure-redhat-openshift
ms.topic: how-to
ms.author: johnmarc
ms.date: 03/23/2023
topic: how-to
keywords: azure, openshift, aro, red hat, lockbox
#Customer intent: I need to learn how to authorize or reject requests from Microsoft support engineers to access my Azure Red Hat OpenShift cluster resources.
---

# Authorize support requests for cluster access with Azure Lockbox

In some circumstances, a support agent at Microsoft may need access to your OpenShift cluster resources. The Azure Lockbox feature works with Azure Redhat OpenShift to provide customers a way to review and approve or reject requests from Microsoft support to access their cluster resources. This ability can be important for financial, government, or other regulatory industries where there's extra scrutiny regarding access to resources.

With Azure Lockbox, whenever a support ticket is created, you have the ability to grant consent to Microsoft support agents to access your cluster resources. The actions that the support engineer can take are limited to those [listed below](#aro-lockbox-actions). Azure Lockbox will tell you exactly what action the support agent is trying to execute.

See [Customer Lockbox](/azure/security/fundamentals/customer-lockbox-overview) for more information about the Lockbox feature. 

## Access request process

The Azure Lockbox workflow consists of the following main steps:

1. A support ticket is opened from the Azure portal. The ticket is assigned to a customer support engineer at Microsoft.
1. The customer support engineer reviews the request and determines the next steps to resolve the issue.
1. When the request requires the support engineer to perform one of the actions [listed below](#aro-lockbox-actions), a Lockbox request is initiated. The request is now in a **Customer Notified** state, waiting for the customer's approval before granting access.
1. An email is sent from Microsoft to the customer, notifying them about the pending access request.
1. The customer signs in to the Azure portal to view the Lockbox request and can Approve or Deny the request.

As a result of the selection:

- Approve: Access is granted to the Microsoft support engineer. The access is granted for a default period of eight hours.
- Deny: The elevated access request by the support engineer is rejected and no further action is taken.

See [Customer Lockbox--workflow](/azure/security/fundamentals/customer-lockbox-overview#workflow) for another details about the access request process.

## Operating limitations

- The Lockbox feature works only with customer support tickets.
- Customers can only grant access through the Lockbox interface.
- No action can be taken until customer approval is granted.

## Enable Lockbox for ARO

You can enable Lockbox from the [Administration module](https://aka.ms/customerlockbox/administration) in the Customer Lockbox blade. Once you enable Lockbox, it will apply to all the ARO clusters in that subscription.

> [!NOTE]
> To enable Customer Lockbox, the user account needs to have the [Global Administrator role assigned](/azure/active-directory/roles/manage-roles-portal).

## ARO Lockbox actions

The actions below require Lockbox authorization in order for a support engineer to proceed:

- Create Kubernetes object
- Update Kubernetes object
- Delete Kubernetes object
- Get logs from a pod in the OpenShift namespace
- List or get Kubernetes objects

## Auditing logs

Lockbox logs are stored in activity logs. In the Azure portal, select Activity Logs to view auditing information related to Customer Lockbox requests. See [Customer Lockbox, Auditing Logs](/azure/security/fundamentals/customer-lockbox-overview#auditing-logs) for more information.