---
title: Tutorial - Deploy an Azure VMware Solution private cloud
description: Learn how to create and deploy an Azure VMware Solution private cloud
ms.topic: tutorial
ms.service: azure-vmware
ms.date: 10/27/2022
ms.custom: engagement-fy23, devx-track-azurecli
---

# Tutorial: Deploy an Azure VMware Solution private cloud

The Azure VMware Solution private gives you the ability to deploy a vSphere cluster in Azure. For each private cloud created, there's one vSAN cluster by default. You can add, delete, and scale clusters.  The minimum number of hosts per cluster is three. More hosts can be added one at a time, up to a maximum of 16 hosts per cluster. The maximum number of clusters per private cloud is 12.  The initial deployment of Azure VMware Solution has three hosts.

You use vCenter Server and NSX-T Manager to manage most other aspects of cluster configuration or operation. All local storage of each host in a cluster is under the control of vSAN.

>[!TIP]
>You can always extend the cluster and add more clusters later if you need to go beyond the initial deployment number.

Because Azure VMware Solution doesn't allow you to manage your private cloud with your cloud vCenter Server at launch, you'll need to do more steps for the configuration. This tutorial covers these steps and related prerequisites.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create an Azure VMware Solution private cloud
> * Verify the private cloud deployed

## Prerequisites

- Appropriate administrative rights and permission to create a private cloud. You must be at minimum contributor level in the subscription.
- Follow the information you gathered in the [planning](plan-private-cloud-deployment.md) tutorial to deploy Azure VMware Solution.
- Ensure you have the appropriate networking configured as described in the [Network planning checklist](tutorial-network-checklist.md).
- Hosts provisioned and the Microsoft.AVS [resource provider has been registered](deploy-azure-vmware-solution.md#register-the-microsoftavs-resource-provider).

## Create a private cloud

[!INCLUDE [create-avs-private-cloud-azure-portal](includes/create-private-cloud-azure-portal-steps.md)]

## Next steps

In this tutorial, you've learned how to:

> [!div class="checklist"]
> * Create an Azure VMware Solution private cloud
> * Verify the private cloud deployed
> * Delete an Azure VMware Solution private cloud

Continue to the next tutorial to learn how to create a jump box. You use the jump box to connect to your environment to manage your private cloud locally.

> [!div class="nextstepaction"]
> [Access an Azure VMware Solution private cloud](tutorial-access-private-cloud.md)
