---
title: How to get support for Avere vFXT for Azure
description: Explanation of opening support tickets about Avere vFXT for Azure
author: ekpgh
ms.service: avere-vfxt
ms.topic: conceptual
ms.date: 10/31/2018
ms.author: v-erkell
---

# Get help with your system

If you need help with your Avere vFXT for Azure, here are the various ways to get support:

* **Avere vFXT issue** - Use the Azure portal to open a support ticket for your Avere vFXT as described [below](#open-a-support-ticket-for-your-avere-vfxt).
* **Quota** - If you have a quota-related issue, [request a quota increase](#request-a-quota-increase)
* **Documentation and examples** - If you find problems with this documentation or examples, scroll to the bottom of the page with the problem and use the **Feedback** section to search for existing issues and file a new one if needed.  

## Open a support ticket for your Avere vFXT

If you encounter issues while deploying or using Avere vFXT, request help through the Azure portal.  

Follow these steps to make sure that your support ticket is tagged with a resource from your cluster. Tagging the ticket helps us route it to the correct support resource. 

1. From [https://portal.azure.com](https://portal.azure.com), select **Resource Groups**.

   ![screenshot of Azure portal left menu with "Resource groups" circled](media/avere-vfxt-ticket-rg.png)

1. Browse to the resource group that contains the vFXT cluster where the issue occurred, and click on one of the Avere virtual machines.

    ![screenshot of Azure portal resource group "overview" panel with a particular VM circled](media/avere-vfxt-ticket-vm.png)

1. In the VM page, scroll down to the bottom of the left panel and click **New support request**.

    ![Screenshot of the Azure portal VM page for the VM from the previous screenshot. The left menu is scrolled to the bottom and "New support request" is circled.](media/avere-vfxt-ticket-request.png)

1. On page one of the support request, click **All Services** and look under **Storage** to choose **Avere vFXT**.

    ![screenshot of the new support request screen in the Azure portal with the header "Basics" and a circle around the "Service" item. The button "All services" is selected and the drop-down menu field has the value "Avere vFXT"](media/avere-vfxt-ticket-service.png)

1. On page two, choose the problem type and category that most closely match your issue. Add a short title and description that includes the time the issue occurred. 

   ![screenshot of the new support request screen with the header "Problem", which contains many fields that need to be completed](media/avere-vfxt-ticket-problem.png)

1. On page three, fill in your contact information and click **Create**. A confirmation and ticket number will be sent to your email address, and a support staff member will contact you.

## Request a quota increase

Read [Quota for the vFXT cluster](avere-vfxt-prereqs.md#quota-for-the-vfxt-cluster) to learn what components are needed to deploy the Avere vFXT for Azure. You can [request a quota increase](https://docs.microsoft.com/azure/azure-supportability/resource-manager-core-quotas-request) from the Azure portal.