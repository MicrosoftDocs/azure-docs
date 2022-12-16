---
title: Fortanix Confidential Computing Manager in an Azure managed application
description: Learn how to deploy Fortanix Confidential Computing Manager (CCM) in a managed application in the Azure portal.
author: mamccrea
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: how-to
ms.date: 02/03/2021
ms.author: mamccrea
ms.custom: ignite-fall-2021
---

# Fortanix Confidential Computing Manager in an Azure managed application

This article shows you how to deploy an application that's managed by Fortanix Confidential Computing Manager in the Azure portal.

Fortanix is a third-party software vendor with products and services built on top of Azure infrastructure. There are other third-party providers offering similar confidential computing services on Azure.

> [!NOTE]
>The products referenced in this document are not under the control of Microsoft. Microsoft is providing this information to you only as a convenience, and the reference to these non-Microsoft products do not imply endorsement by Microsoft.

## Prerequisites

- A private Docker registry to push converted application images.
- If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/) before you begin.

## Deploy a Confidential Computing Manager through an Azure managed application

1. Go to the [Azure portal](https://portal.azure.com/).

    :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/Azure-portal.png" alt-text="Azure portal.":::

2. In the Search Bar, search "Fortanix Confidential Computing Manager" and you will find the Marketplace listing for Fortanix CCM. Select **Fortanix Confidential Computing Manager on Azure**.

    :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/search-marketplace-listing.png" alt-text="Marketplace listing.":::

3. The page on which you create the CCM-managed application opens. select **Create**.

    :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/create-managed-application.png" alt-text="Create Application.":::

4. Fill in all the required fields.
   1. In the Managed Application Details section, the **Managed Resource Group** field will have a default value that the user can modify if they need to.
   2. In the **Region** field, select either **Australia East**, **Australia Southeast**, **East US**, **West US 2**, **West Europe**, **North Europe**, **Canada Central**, **Canada East**, or **East US 2 EUAP**.

   :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/required-fields.png" alt-text="Required Fields":::

   Select **Review + create** to create the Fortanix CCM-managed application.

5. Review the details and once the validation passes, select the **I agree to the terms and conditions above** check box, and then select **Create** to create the managed application.

   :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/review-details.png" alt-text="Review Details.":::

6. The Fortanix CCM deployment will start and notifies that the deployment is in progress.

   :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/deployment-progress.png" alt-text="Deployment Progress.":::

7. When the deployment is complete, select **Go to resource** button to go to the deployed CCM-managed application's "Overview" page to enroll the compute node.

   :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/fortanix-resource.png" alt-text="Screenshot that shows a successful deployment in the Azure portal.]":::

   :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/fortanix-overview.png" alt-text="Screenshot that shows an overview of the confidential computing resource in the Azure portal.":::

## Enroll the compute node in Fortanix CCM

1. Select **Confidential Computing Manager** from the left navigation menu. Log in to Fortanix CCM and create an account as you see in **Figure 9**.

    For more details on how to sign up, log in and create an account in CCM refer to [CCM Getting Started](https://support.fortanix.com/hc/en-us/articles/360034373551-User-s-Guide-Logging-in).
    
    :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/fortanix-login.png" alt-text="Screenshot that shows the Fortanix Confidential Computing Manager login.":::
    
2. To get the Join Token from the CCM Management Console, first select the **ENROLL NODE** button. Then, in the ENROLL NODE window, select the **COPY** button to copy the join token.

    :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/get-join-token.png" alt-text="Screenshot that shows getting the join token.":::

3. Now to enroll a node agent, select the **Confidential Computing Node Agent** tab and select **Add** to add a CCM node agent.

    :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/add-node-agent.png" alt-text="Screenshot that shows adding the node agent.":::

4.  In the CCM node agent form, fill all the required fields. Paste the join token that you copied in Step 2 in **Join Token**. Select **Review + submit** to confirm.

    For more information on how to enroll a CCM compute node, see [Enroll Compute Node](https://support.fortanix.com/hc/en-us/articles/360043085652-User-s-Guide-Compute-Nodes).
    
    :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/enroll-compute-node.png" alt-text="Screenshot that shows enrolling the compute node.":::
    
5. After the validation passes, select **Submit** to complete the node agent creation.

    :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/node-agent-created.png" alt-text="Screenshot that shows the node agent is created.":::

6. To check the deployment status, go to the **Overview** tab, and select **Managed resource group** link.

    :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/node-enrolled.png" alt-text="Screenshot that shows the node is enrolled.":::
    
    :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/managed-resource-group.png" alt-text="Screenshot that shows checking the deployment status.":::

7. Now you will notice that the deployment status is still in progress and will take a few minutes for the node agent to be successfully enrolled.

    :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/deployment-in-progress.png" alt-text="Screenshot that shows the deployment in progress.":::

8. When the node agent enrollment is successful, the status changes to "Succeeded".

    :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/deployment-succeeded.png" alt-text="Screenshot that shows the deployment succeeded.":::

9. Now in the CCM-managed application, go to the Compute Nodes pages and you will notice that the node is in an **Active** state and enrolled successfully.

    :::image type="content" source="media/how-to-fortanix-confidential-computing-manager/node-active-state.png" alt-text="Screenshot that shows the node successfully enrolled.":::

## Clean up resources

The user also can delete a CCM node agent from the Confidential Computing Node Agent page. To delete the node agent, select the node agent and select the **Delete** button on the top bar.

:::image type="content" source="media/how-to-fortanix-confidential-computing-manager/delete-node-agent.png" alt-text="Screenshot that shows deleting the node agent.":::

## Next steps

In this quickstart, you enrolled a node using an Azure managed app to Fortanix's Confidential Computing Manager. The node enrollment allows you to convert your application image to run on top of a confidential computing virtual machine. For more information about confidential computing virtual machines on Azure, see [Solutions on Virtual Machines](virtual-machine-solutions-sgx.md).

To learn more about Azure's confidential computing offerings, see [Azure confidential computing](overview.md).

Learn how to complete similar tasks using other third-party offerings on Azure, like [Anjuna](https://azuremarketplace.microsoft.com/marketplace/apps/anjuna1646713490052.anjuna_cc_saas?tab=Overview) and [Scone](https://sconedocs.github.io).
