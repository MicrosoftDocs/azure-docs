---
title: Tutorial - Deploy an Azure VMware Solution private cloud
description: Learn how to create and deploy an Azure VMware Solution private cloud
ms.topic: tutorial
ms.date: 04/23/2021
---

# Tutorial: Deploy an Azure VMware Solution private cloud

The Azure VMware Solution private gives you the ability to deploy a vSphere cluster in Azure. For each private cloud created, there's one vSAN cluster by default. You can add, delete, and scale clusters.  The minimum number of hosts per cluster is three. More hosts can be added one at a time, up to a maximum of 16 hosts per cluster. The maximum number of clusters per private cloud is four.  The initial deployment of Azure VMware Solution has three hosts. 

Trial clusters are available for evaluation and are limited to three hosts. There's a single trial cluster per private cloud. You can scale a trial cluster by a single host during the evaluation period.

You use vSphere and NSX-T Manager to manage most other aspects of cluster configuration or operation. All local storage of each host in a cluster is under the control of vSAN.

>[!TIP]
>You can always extend the cluster and add additional clusters later if you need to go beyond the initial deployment number.

Because Azure VMware Solution doesn't allow you to manage your private cloud with your on-premises vCenter at launch, extra configuration is needed. These procedures and related prerequisites are covered in this tutorial.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create an Azure VMware Solution private cloud
> * Verify the private cloud deployed

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Appropriate administrative rights and permission to create a private cloud. You must be at minimum contributor level in the subscription.
- Follow the information you gathered in the [planning](production-ready-deployment-steps.md) article to deploy Azure VMware Solution.
- Ensure you have the appropriate networking configured as described in [Network planning checklist](tutorial-network-checklist.md).
- Hosts have been provisioned and the Microsoft.AVS resource provider has been registered as described in [Request hosts and enable the Microsoft.AVS resource provider](enable-azure-vmware-solution.md).

## Create a private cloud

[!INCLUDE [create-avs-private-cloud-azure-portal](includes/create-private-cloud-azure-portal-steps.md)]

## Next steps

In this tutorial, you've learned how to:

> [!div class="checklist"]
> * Create an Azure VMware Solution private cloud
> * Verify the private cloud deployed
> * Delete an Azure VMware Solution private cloud

Continue to the next tutorial to learn how to create a jump box. You use the jump box to connect to your environment so that you can manage your private cloud locally.


> [!div class="nextstepaction"]
> [Access an Azure VMware Solution private cloud](tutorial-access-private-cloud.md)
