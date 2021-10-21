---
title: Azure Purview Self-Service Concepts
description: Understand the concept for Azure Purview Self-Service Data Access
author: bjspeaks
ms.author: blessonj
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: conceptual
ms.date: 10/13/2021
---

# Concepts for Azure Purview Self-Service data discovery and access (Preview)

This article helps you understand Azure Purview Self-Service Access Management.

## Overview

Azure Purview Self-Service Access Management allows data consumer to request
access to data when browsing or searching for data. Currently, we support 
self-service data access to storage accounts, containers, folders, and files.

A **collection admin** will need to map a self-service workflow to a collection.
Collection is logical grouping of data sources that are registered within
Azure Purview. **Only data source(s)** that are registered for policy management
will allow data consumers to request access to data.

## Terminology

**Data Consumer** is anyone who uses the data. Example, a data analyst accessing 
marketing data for customer segmentation. Data consumer and data requestor will
be used interchangeably within this document.

**Collection** is logical grouping of data sources that are registered within
Azure Purview.

**self-service workflow** is the process that is invoked when a data consumer
requests access to data.

**Approver** is either security group or AAD users that can approve self-service
access requests

## How to use Azure Purview self-service access management?

  Azure Purview allows organizations to catalog metadata about all registered 
data assets. It allows data consumers to search for or browse to the required 
data asset.   

   With self-service access management, data consumers can not only find data assets 
but also request access to the data assets that are within data sources that are 
registered for policy integration. When the data consumer requests access to a data asset, the associated
self-service access workflow is triggered.

   A default self-service workflow template is available with Azure Purview account is created.
The default template can be amended to add more approvers and/or set the approver's email address.


   The data curator role will be able to customize the default self-service workflow template or
use the default workflow without customization. The approvers for the access request are assigned by the data curator. For this, the data curator can use either 
an email distribution group or an approver's email address.

   Whenever a data consumer requests access to a dataset, the notification is sent
to the workflow approver. The approver will be able to view the request and approve
it either from purview portal or from within the email notification. When the request 
is approved a policy is auto-generated and applied against the respective, data source.
The requestor or data consumer is notified that the request was approved.

   If a data consumer's data access request is declined, a policy does not get 
generated and the data consumer is notified that the access request was declined.

## Next steps

-  [Enroll for the Azure Purview self-service preview](https://aka.ms/opt-in-data-use-policy)