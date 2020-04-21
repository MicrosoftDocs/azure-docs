---
title: Tutorial - Deploy vSphere Cluster in Azure
description: Learn to deploy a vSphere Cluster in Azure using Azure VMWare Solution (AVS)
ms.topic: tutorial
ms.date: 05/04/2020
---

# Tutorial: Deploy an AVS private cloud in Azure

Ability to deploy a vSphere cluster in Azure from the Azure portal.
Minimum initial deployment is three hosts. Additional hosts can be added
one at a time, up to a maximum of 16 hosts per cluster. Deployment
within 150 minute time frame.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Private Cloud
> * Verify deployment was successful

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Appropriate administrative rights & permission to create a private cloud.
- Ensure you have the appropriate networking configured as described in [Quickstart: Network checklist](network-checklist.md)

## Sign in to the Azure portal

Sign in to the [Azure portal](https://rc.portal.azure.com).

## Create a Private Cloud

In the Azure portal, select **+ Create a new resource**. In the **Search the Marketplace**
text box type `avs`, and select **AVS - Private Cloud** from the list. On the **AVS - Private Cloud** window, click **Create**

On the **Basics** tab, enter values for the fields. The following table shows a detailed list of the properties.

| Field   | Value  |
| ---| --- |
| **Subscription** | The subscription you plan to use for the deployment.|
| **Resource group** | The resource group for your private cloud resources. |
| **Location** | Select a location, such as **east us**.|
| **Resource name** | The name of your AVS private cloud. |
| **SKU** | Select the appropriate SKU, available values are: |
| **Hosts** | This is the number of hosts to add to the private cloud cluster. The default value is 3. This value can be raised or lowered after deployment.  |
| **vCenter admin password** | Enter a cloud administrator password. |
| **NSX-T manager password** | Enter a NSX-T administrator password. |
| **Address block** | Enter an IP address block for the CIDR network for the private cloud. An example is, 10.175.0.0/22. |

![](./media/tutorial-create-private-cloud/image9.jpg)

Once finished, click **Review + Create**. On the next screen verify the information entered. If the information is all correct, click **Create**.

> [!NOTE]
> This step takes roughly two hours. 

## Verify deployment was successful

The Azure Portal notification shows the
deployment is successful. Navigate to the Azure portal to verify your private cloud is deployed.

![](./media/tutorial-create-private-cloud/image10.jpg)

## Next steps

In this tutorial you learned how to:

> [!div class="checklist"]
> * Create an AVS private cloud
> * Verified the Private Cloud deployed

Continue to the next tutorial to learn how to create a virtual network for use with your Private Cloud.

> [!div class="nextstepaction"]
> [Create a Virtual Network](tutorial-configure-networking.md)