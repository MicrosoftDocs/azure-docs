---
title: Using Azure Lockbox to manage customer data access
description: In this how-to article, learn how to use Azure Lockbox to review customer data access requests for Azure Red Hat Openshift.
author: johnmarco
ms.service: azure-redhat-openshift
ms.topic: how-to
ms.author: johnmarc
ms.date: 10/26/2022
topic: how-to
keywords: azure, openshift, aro, red hat, lockbox
#Customer intent: I need to learn how to manage customer data requests for my Azure Red Hat Openshift installation.
---

# Manage customer data requests with Azure Lockbox

In some circumstances, a support agent at Microsoft or Red Hat may need access to a customer’s OpenShift clusters and Azure environment. The Azure Lockbox feature works with Azure Redhat OpenShift to provide customers a way to review and approve/reject customer data access requests. This ability can be particularly important for financial, government, or other regulatory industries where there is extra scrutiny regarding access to customer data.

With Azure Lockbox, whenever a support ticket is created, you have the ability to grant consent to Microsoft and Red Hat support agents to access your environment to troubleshoot and resolve issues. Azure Lockbox will tell you exactly what support agents are trying to access to help resolve your issues.

See [Customer Lockbox](/azure/security/fundamentals/customer-lockbox-overview) for more information and instruction on the Lockbox feature. 

## Access request process

1. The Azure Lockbox workflow consists of the following main steps:
1. A support ticket is opened from the Azure portal. The ticket is assigned to a customer support engineer at Microsoft or Red Hat.
1. The customer support engineer review the service request and determines the next steps to resolve the issue.
1. When the request requires direct access to customer data, a Customer Lockbox request is initiated. The request is now in a **Customer Notified** state, waiting for the customer's approval before granting access.
1. An email is sent from Microsoft to the customer, notifying them about the pending access request.
1. The customer signs in to the Azure portal to view the Lockbox request and can Approve or Deny the request.

As a result of the selection:

- Approve: Access is granted to the Microsoft engineer. The access is granted for a default period of eight hours.
- Deny: The elevated access request by the Microsoft engineer is rejected and no further action is taken.

See [Customer Lockbox--workflow](/azure/security/fundamentals/customer-lockbox-overview#workflow) for additional details about the access request process.

## Enable Lockbox for ARO

You can enable Customer Lockbox from the [Administration module](https://aka.ms/customerlockbox/administration) in the Customer Lockbox blade.

> [!NOTE]
> To enable Customer Lockbox, the user account needs to have the [Global Administrator role assigned](/azure/active-directory/roles/manage-roles-portal).


## ARO Lockbox actions

Azure Lockbox can be used to control data access for the following ARO actions:

|ARO Action  |Not Required Behind Lockbox  |Lockbox Required  |
|------------|-----------------------------|------------------|
|Create Kubernetes object | |X |
|Update Kubernetes object | |X |
|Delete Kubernetes object |X (softer delete does not require Lockbox) |X (VM or VMSS or Storage Account may require Lockbox) |
|Get cluster |X (only service metadata)<br>No need behind Lockbox | |
|Get VM serial console logs | |X |
|List cluster Azure resources |X (ARM or above) | |
|List clusters |X (ARM or above) | |
|List or get Kubernetes objects | |X (Below ARM/Created by customers) |
|Put or patch cluster |X | |
|Redeploy virtual machine |X | |
|Upgrade cluster |X | |


## Limitations


