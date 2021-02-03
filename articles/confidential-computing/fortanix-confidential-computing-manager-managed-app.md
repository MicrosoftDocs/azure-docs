---
title: Fortanix Confidential Computing Manager in Azure-managed applications
description: Learn how to deploy Fortanix Confidential Computing Manager (CCM) in a managed application in the Azure portal.
author: JBCook
ms.service: container-service
ms.topic: conceptual
ms.date: 01/29/2021
ms.author: jencook
---

# Confidential Computing Manager in Azure-managed applications

This article shows you how to deploy an application that is managed by Fortanix Confidential Computing Manager in Azure.

## Prerequisites

- A private Docker registry to push converted application image(s).
- An Azure subscription.

## Deploy a Confidential Computing Manager-managed application in Azure

1. Go to the [Azure portal](https://portal.azure.com/).

    :::image type="content" source="media/fortanix-confidential-computing-manager/azure-portal.png" alt-text="Azure portal.":::

2. In the Search Bar, search "Fortanix Confidential Computing Manager" and you will find the Marketplace listing for Fortanix CCM. Select **Fortanix Confidential Computing Manager on Azure**.

    :::image type="content" source="media/fortanix-confidential-computing-manager/search-marketplace-listing.png" alt-text="Marketplace listing.":::

3. The page on which you create the CCM-managed application opens. select **Create**.

    :::image type="content" source="media/fortanix-confidential-computing-manager/create-managed-application.png" alt-text="Create Application.":::

4. Fill in all the required fields.
   1. In the Managed Application Details section, the **Managed Resource Group** field will have a default value that the user can modify if they need to.
   2. In the **Region** field, select either **Australia East**, **Australia Southeast**, **East US**, **West US 2**, **West Europe**, **North Europe**, **Canada Central**, **Canada East**, or **East US 2 EUAP** (more regions will be added as Azure adds Managed Application support to more regions).

   :::image type="content" source="media/fortanix-confidential-computing-manager/required-fields.png" alt-text="Required Fields":::

   Select **Review + create** to create the Fortanix CCM-managed application.

5. Review the details and once the validation passes, select the **I agree to the terms and conditions above** check box, and then select **Create** to create the managed application.

   :::image type="content" source="media/fortanix-confidential-computing-manager/review-details.png" alt-text="Review Details.":::

6. The Fortanix CCM deployment will start and notifies that the deployment is in progress.

   :::image type="content" source="media/fortanix-confidential-computing-manager/deployment-progress.png" alt-text="Deployment Progress.":::

7. When the deployment is complete, select **Go to resource** button to go to the deployed CCM-managed application's "Overview" page to enroll the compute node.

   :::image type="content" source="media/fortanix-confidential-computing-manager/ccm-resource.png" alt-text="Screenshot that shows a successful deployment in the Azure portal.]":::

   :::image type="content" source="media/fortanix-confidential-computing-manager/ccm-overview.png" alt-text="Screenshot that shows an overview of the confidential computing resource in the Azure portal.":::

## Enroll the compute node in Fortanix CCM

1. Select **Confidential Computing Manager** from the left navigation menu. Log in to Fortanix CCM and create an account as you see in **Figure 9**.

    For more details on how to sign up, log in and create an account in CCM refer to [CCM Getting Started](https://support.fortanix.com/hc/en-us/articles/360034373551-User-s-Guide-Logging-in).
    
    :::image type="content" source="media/fortanix-confidential-computing-manager/ccm-login.png" alt-text="Screenshot that shows the Fortanix Confidential Computing Manager login.":::
    
2. To get the Join Token from the CCM Management Console, first select the **ENROLL NODE** button. Then, in the ENROLL NODE window, select the **COPY** button to copy the join token.

    :::image type="content" source="media/fortanix-confidential-computing-manager/get-join-token.png" alt-text="Screenshot that shows getting the join token.":::

3. Now to enroll a node agent, select the **Confidential Computing Node Agent** tab and select **Add** to add a CCM node agent.

    :::image type="content" source="media/fortanix-confidential-computing-manager/add-node-agent.png" alt-text="Screenshot that shows adding the node agent.":::

4.  In the CCM node agent form, fill all the required fields. Paste the join token that you copied in Step 2 in **Join Token**. Select **Review + submit** to confirm.

    For more information on how to enroll a CCM compute node, see [Enroll Compute Node](https://support.fortanix.com/hc/en-us/articles/360043085652-User-s-Guide-Compute-Nodes).
    
    :::image type="content" source="media/fortanix-confidential-computing-manager/enroll-compute-node.png" alt-text="Screenshot that shows enrolling the compute node.":::
    
5. After the validation passes, select **Submit** to complete the node agent creation.

    :::image type="content" source="media/ffortanix-confidential-computing-manager/node-agent-created.png" alt-text="Screenshot that shows the node agent is created.":::

6. To check the deployment status, go to the **Overview** tab, and select **Managed resource group** link.

    :::image type="content" source="media/fortanix-confidential-computing-manager/node-enrolled.png" alt-text="Screenshot that shows the node is enrolled.":::
    
    :::image type="content" source="media/fortanix-confidential-computing-manager/managed-resource-group.png" alt-text="Screenshot that shows checking the deployment status.":::

7. Now you will notice that the deployment status is still in progress and will take a few minutes for the node agent to be successfully enrolled.

    :::image type="content" source="media/fortanix-confidential-computing-manager/deployment-in-progress.png" alt-text="Screenshot that shows the deployment in progress.":::

8. When the node agent enrollment is successful, the status changes to "Succeeded".

    :::image type="content" source="media/fortanix-confidential-computing-manager/deployment-succeeded.png" alt-text="Screenshot that shows the deployment succeeded.":::

9. Now in the CCM-managed application, go to the Compute Nodes pages and you will notice that the node is in an **Active** state and enrolled successfully.

    :::image type="content" source="media/fortanix-confidential-computing-manager/node-active-state.png" alt-text="Screenshot that shows the node successfully enrolled.":::

## Delete CCM compute nodes

The user also can delete a CCM node agent from the Confidential Computing Node Agent page. To delete the node agent, select the node agent and select the **Delete** button on the top bar.

:::image type="content" source="media/fortanix-confidential-computing-manager/delete-node-agent.png" alt-text="Screenshot that shows deleting the node agent.":::
  
