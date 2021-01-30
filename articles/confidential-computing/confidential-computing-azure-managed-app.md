title: Fortanix Confidential Computing Manager (CCM) on Azure Managed Application
description: Learn how to deploy Fortanix CCM on Microsoft Azure Portal.
services:
author: Nithya Ramakrishnan
ms.service:
ms.subservice:
ms.workload:
ms.topic: conceptual
ms.date: 29/1/2021
ms.author: JenCook
---

# Confidential Computing Manager Azure Managed Application

## Prerequisites

- A private Docker registry to push converted application image(s).
- An Azure subscription.

## Deploy CCM Managed Application on Azure

1. Go to the Microsoft Azure portal -https://portal.azure.com/.

![Azure Portal](media/Azure-managed-app-files/azure_portal.png)

2. In the Search Bar, search "Fortanix Confidential Computing Manager" and you will find the Marketplace listing for Fortanix CCM. Click **Fortanix Confidential Computing Manager on Azure**.

![Marketplace Listing](media/Azure-managed-app-files/search_marketplace_listing.png)

3. This will open the page to create the CCM Managed application. Click **Create**.

![Create Application](media/Azure-managed-app-files/create_managed_application.png)

4. Fill in all the required fields.
   1. In the Managed Application Details section, the **Managed Resource Group** field will have a default value that the user  can modify if required.
   2. In the **Region** field, select either **Australia East**, **Australia Southeast**, **East US**, **West US 2**, **West Europe**, **North Europe**, **Canada Central**, **Canada East**, or **East US 2 EUAP** (more regions will be added as Azure adds Managed Application support to more regions).

   ![Required Fields](media/Azure-managed-app-files/required_fields.png)

   Click **Review + create** to create the Fortanix CCM managed application.

5. Review the details and once the validation passes, select the **I agree to the terms and conditions above** check box, and then click **Create** to create the managed application.

![Review Details](media/Azure-managed-app-files/review_details.png)

6. The Fortanix CCM deployment will start and notifies that the deployment is in progress.

![Deployment Progress](media/Azure-managed-app-files/deployment_progress.png)

7. When the deployment is complete, click **Go to resource** button to go to the deployed CCM managed application's "Overview" page to enroll the compute node.

![Enroll Node Start](media/Azure-managed-app-files/ccm_resource.png)

![Enroll Node Start](media/Azure-managed-app-files/ccm_overview_page.png)


## Enroll Compute Node in Fortanix CCM

1. Click **Confidential Computing Manager** from the left navigation menu. Log in to Fortanix CCM and create an account as you see in **Figure 9**.

For more details on how to sign up, log in and create an account in CCM refer to [CCM Getting Started](https://support.fortanix.com/hc/en-us/articles/360034373551-User-s-Guide-Logging-in).

![CCM Login](media/Azure-managed-app-files/ccm_login.png)

2. Get the Join Token from the CCM Management Console by clicking the **ENROLL NODE** button and in the ENROLL NODE window click the **COPY** button to copy the join token.

![Get Join Token](media/Azure-managed-app-files/get_join_token.png)

3. Now to enroll a node agent, click the **Confidential Computing Node Agent** tab and click **Add** to add a CCM node agent.

![Add Node Agent](media/Azure-managed-app-files/add_node_agent.png)

4.  In the CCM node agent form, fill all the required fields. Paste the join token that you copied in Step 2 in the **Join Token** field. Click **Review + submit** button to confirm.

For more details on how to enroll a CCM compute node, refer to [Enroll Compute Node](https://support.fortanix.com/hc/en-us/articles/360043085652-User-s-Guide-Compute-Nodes).

![Enroll Compute Node](media/Azure-managed-app-files/enroll_compute_node.png)

5. Once the validation passes, click **Submit** to complete the node agent creation.

![Node Agent Created](media/Azure-managed-app-files/node_agent_created.png)

6. To check the deployment status, go to the **Overview** tab, and click **Managed resource group** link.

![node enrolled](media/Azure-managed-app-files/node_enrolled.png)

![Check Deployment Status](media/Azure-managed-app-files/managed_resource_group.png)

7. Now you will notice that the deployment status is still in progress and will take a few minutes for the node agent to be successfully enrolled.

![Deployment Progress](media/Azure-managed-app-files/deployment_in_progress.png)

8. Once the node agent enrollment is successful, the status changes to "Succeeded".

![Deployment Succeeded](media/Azure-managed-app-files/deployment_succeeded.png)

9. Now in the CCM managed application, go to the Compute Nodes pages and you will notice that the node is in an **Active** state and enrolled successfully.

![Node Successfully Enrolled](media/Azure-managed-app-files/node_active_state.png)

## Delete CCM Compute nodes

1. The user also has the option to delete a CCM node agent from the Confidential Computing Node Agent page. To do this, select the node agent and click the **Delete** button on the top bar.

![Delete Node Agent](media/Azure-managed-app-files/delete_node_agent.png)
