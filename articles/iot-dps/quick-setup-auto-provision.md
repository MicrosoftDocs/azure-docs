---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Intent and product brand in a unique string of 43-59 chars including spaces | Microsoft Docs 
description: 115-145 characters including spaces. Edit the intro para describing article intent to fit here. This abstract displays in the search result.
services: service-name-with-dashes-AZURE-ONLY 
keywords: Don’t add or edit keywords without consulting your SEO champ.
author: github-alias
ms.author: MSFT-alias-person-or-DL
ms.date: 08/10/2017
ms.topic: article-type-from-white-list
# Use only one of the following. Use ms.service for services, ms.prod for on-prem. Remove the # before the relevant field.
# ms.service: service-name-from-white-list
# product-name-from-white-list

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
# manager: MSFT-alias-manager-or-PM-counterpart
---

<---!
Definition of Quickstart: 
Fundamental, Day 1 instructions for new customers to use an Azure subscription to quickly use a specific product/service 
(zero to Wow in < 10 minutes). Include short, simple info and steps that require a new customer to have an Azure subscription and interact with your Azure service. 
Minimize the use of screenshots in Quickstart articles (rules for screenshots below)

- Metadata for this article should have ms.topic: hero-article; ms.custom: mvc
-->

*EXAMPLE*: 
# Create a Windows virtual machine with the Azure portal
<---! # Page heading (H1) - Unique, starts with "Create"
-->

<---! Intro paragraph: 
1. 1-2 sentences that explain what customers will do and why it is useful.  Also, mention any relevant versioning information that the article is based on.
2. Use an include to make sure Azure CLI, PowerShell or Portal are installed and configured correctly-->

*EXAMPLE 1*:
Azure virtual machines can be created through the Azure portal. This method provides a browser-based user interface for creating and configuring virtual machines and all related resources. This Quickstart steps through creating a virtual machine and installing a webserver on the VM.

*REQUIRED*:
If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/).

<---! The next set of H2s describes the steps. Each H2 outlines the steps to completion ("Create a virtual machine", "Create a SQL Database"). 
-->

*EXAMPLE*:
## Create virtual machine

1. Click the **New** button found on the upper left-hand corner of the Azure portal.

2. Select **Compute**, select **Windows Server 2016 Datacenter**, and ensure that **Resource Manager** is the selected deployment model. Click the **Create** button. 

3. Enter the virtual machine information. The user name and password entered here is used to log in to the virtual machine. When complete, click **OK**.

    ![Enter basic information about your VM in the portal blade](./media/quick-create-portal/create-windows-vm-portal-basic-blade.png)  

4. Select a size for the VM. To see more sizes, select **View all** or change the **Supported disk type** filter. 

    ![Screenshot that shows VM sizes](./media/quick-create-portal/create-windows-vm-portal-sizes.png)  

5. On the settings blade, select **Yes** under **Use managed disks**, keep the defaults for the rest of the settings, and click **OK**.

6. On the summary page, click **Ok** to start the virtual machine deployment.

7. The VM will be pinned to the Azure portal dashboard. Once the deployment has completed, the VM summary blade automatically opens.

<---!
All quickstarts need to include a section to clean up resources or delete work to avoid unnecessary charges.  
-->

*REQUIRED*:
## Clean up resources

Other quick starts in this collection build upon this quick start. If you plan to continue on to work with subsequent quick starts or with the tutorials, do not clean up the resources created in this quick start. If you do not plan to continue, use the following steps to delete all resources created by this quick start in the Azure portal.

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click **myResourceGroup**. 
2. On your resource group page, click **Delete**, type **myResourceGroup** in the text box, and then click **Delete**.

<---! A simple of list of articles that link to logical next steps.  This is probabLy a tutorial that is a superset of this QuickStart. Include no more than 3 next steps. Make sure to include syntax to highlight your next steps [!div class="nextstepaction"]
-->

*REQUIRED*:
## Next steps

*EXAMPLE*:
In this quick start, you’ve deployed a simple virtual machine, a network security group rule, and installed a web server. To learn more about Azure virtual machines, continue to the tutorial for Windows VMs.

> [!div class="nextstepaction"]
> [Azure Windows virtual machine tutorials](./tutorial-manage-vm.md)

<---!
Rules for screenshots:
- Use default Public Portal colors​
- Remove personally identifiable information​
- Browser included in the first shot of the article​
- Resize the browser to minimize white space​
- Include complete blades in the screenshots​
- Linux: Safari – consider context in images​

Guidelines for outlining areas within screenshots:
- Red outline #ef4836
- 3px thick outline
- Text should be vertically centered within the outline.
- Length of outline should be dependent on where it sits within the screenshot. Make the shape fit the layout of the screenshot.
-->