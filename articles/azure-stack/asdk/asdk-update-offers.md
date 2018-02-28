---
title: Update Azure Stack offers and plans | Microsoft Docs
description: This article describes how to view and modify existing offers and plans. 
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.custom: mvc
ms.date: 03/09/2018
ms.author: jeffgilb
ms.reviewer: misainat
---

# Update offers and plans
As an Azure Stack operator, you create plans that contain the desired services and applicable quotas for your users to subscribe to. These *base plans* contain the core services to be offered to your users and you can only have one base plan per offer. If you need to modify your offer, you can use *add-on plans* that allow you to modify the plan to extend computer, storage, or network quotas initially offered with the base plan. 

Although combining everything in a single plan may be optimal in some cases, you may want to have a base plan, and offer additional services using add-on plans. For instance, you could decide to offer IaaS services as part of a base plan, with all PaaS services treated as add-on plans. Plans can also be used to control consumption of resources in your limited ASDK environment. For example, if you want your users to be mindful of their resource usage, you could have a relatively small base plan (depending on the services required) and as users reach capacity, they would be alerted that they have already consumed the allocation of resources based on their assigned plan. From there, the users may select an available add-on plan for additional resources. 

> [!NOTE]
> When a user adds an add-on to an existing subscription, the additional resources could take up to an hour to appear. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an add-on plan 
> * Subscribe to the add-on plan

## Create an add-on plan
**Add-on plans** are created by modifying an existing offer.

1. Sign in to the [Azure Stack portal](https://adminportal.local.azurestack.external) as a cloud administrator.


## Subscribe to the add-on plan
To extend your current Azure Stack subscription with an add-on plan, you need to login to the Azure Stack user portal to discover the additional resources that have been offered by the Azure Stack operator.

1. Log in to the [user portal](https://portal.local.azurestack.external).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create an add-on plan 
> * Subscribe to the add-on plan

> [!div class="nextstepaction"]
> [Create a virtual machine from a template](asdk-create-vm-template.md)

