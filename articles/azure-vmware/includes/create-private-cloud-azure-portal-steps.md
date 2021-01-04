---
title: Deploy Azure VMware Solution
description: Steps to deploy Azure VMware Solution using the Azure portal.
ms.topic: include
ms.date: 09/28/2020
---

<!-- Used in deploy-azure-vmware-solution.md and tutorial-create-private-cloud.md -->

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Create a new resource**. In the **Search the Marketplace** text box type `Azure VMware Solution`, and select **Azure VMware Solution** from the list. On the **Azure VMware Solution** window, select **Create**.

1. On the **Basics** tab, enter values for the fields. The following table lists the properties for the fields.

   | Field   | Value  |
   | ---| --- |
   | **Subscription** | The subscription you plan to use for the deployment.|
   | **Resource group** | The resource group for your private cloud resources. |
   | **Location** | Select a location, such as **east us**.|
   | **Resource name** | The name of your Azure VMware Solution private cloud. |
   | **SKU** | Select the following SKU value: AV36 |
   | **Hosts** | The number of hosts to add to the private cloud cluster. The default value is 3, which can be raised or lowered after deployment.  |
   | **vCenter admin password** | Enter a cloud administrator password. |
   | **NSX-T manager password** | Enter an NSX-T administrator password. |
   | **Address block** | Enter an IP address block for the CIDR network for the private cloud, for example, 10.175.0.0/22. |
   | **Virtual Network** | Select a Virtual Network or create a new one for the Azure VMware Solution private cloud.  |

   :::image type="content" source="../media/tutorial-create-private-cloud/create-private-cloud.png" alt-text="On the Basics tab, enter values for the fields." border="true":::

1. Once finished, select **Review + Create**. On the next screen, verify the information entered. If the information is all correct, select **Create**.

   > [!NOTE]
   > This step takes roughly two hours. 

1. Verify that the deployment was successful. Navigate to the resource group you created and select your private cloud.  You'll see the status of **Succeeded** when the deployment has completed. 

   :::image type="content" source="../media/tutorial-create-private-cloud/validate-deployment.png" alt-text="Verify that the deployment was successful." border="true":::