---
title: Create an Azure VMware Solution private cloud
description: Steps to create an Azure VMware Solution private cloud using the Azure portal.
ms.topic: include
ms.date: 04/07/2021
---

<!-- Used in deploy-azure-vmware-solution.md and tutorial-create-private-cloud.md -->

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Create a new resource**. 

1. In the **Search the Marketplace** text box type `Azure VMware Solution`, and select **Azure VMware Solution** from the list. 

1. On the **Azure VMware Solution** window, select **Create**.

1. On the **Basics** tab, enter values for the fields. 

   >[!TIP]
   >You gathered this information during the [planning phase](production-ready-deployment-steps.md) of this quick start.

   | Field   | Value  |
   | ---| --- |
   | **Subscription** | Select the subscription you plan to use for the deployment.|
   | **Resource group** | Select the resource group for your private cloud resources. |
   | **Location** | Select a location, such as **east us**. This is the *region* you defined during the planning phase. |
   | **Resource name** | Provide the name of your Azure VMware Solution private cloud. |
   | **SKU** | Select **AV36**. |
   | **Hosts** | Shows the number of hosts allocated for the private cloud cluster. The default value is 3, which can be raised or lowered after deployment.  |
   | **Address block** | Enter an IP address block for the CIDR network for the private cloud, for example, 10.175.0.0/22. |
   | **Virtual Network** | Select a Virtual Network or create a new one for the Azure VMware Solution private cloud.  |

   :::image type="content" source="../media/tutorial-create-private-cloud/create-private-cloud.png" alt-text="On the Basics tab, enter values for the fields." border="true":::

1. Once finished, select **Review + Create**. On the next screen, verify the information entered. If the information is all correct, select **Create**.

   > [!NOTE]
   > This step takes roughly 3-4 hours. Adding a single node in existing/same cluster takes between 30 - 45 minutes.

1. Verify that the deployment was successful. Navigate to the resource group you created and select your private cloud.  You'll see the status of **Succeeded** when the deployment has completed. 

   :::image type="content" source="../media/tutorial-create-private-cloud/validate-deployment.png" alt-text="Verify that the deployment was successful." border="true":::
