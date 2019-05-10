---
title: 'Create an Azure Bastion host  | Microsoft Docs'
description: In this article, learn how to create an Azure Bastion host
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: conceptual
ms.date: 05/09/2019
ms.author: cherylmc
Customer intent: As someone with a networking background, I want to create an Azure Bastion host.

---

# Create an Azure Bastion host (preview)

This article shows you how to create an Azure Bastion host. Once you provision the Azure Bastion service in your virtual network, the seamless RDP/SSH experience is available to all your VMs in the same virtual network. This deployment is per virtual network, not per subscription/account or virtual machine.

There are 2 ways that you can create a Bastion host resource:

* Create a bastion resource using the Azure portal.
* Create a bastion resource in the Azure portal by using existing VM settings.

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

## Before you begin

Send an email to request onboarding for your subscription. In this email, include the following information:

* Subscription ID: <>
* Company Name:
* Your Name:
* Email Address (Corporate Email):

After your subscription has been provisioned for the preview, we will respond with a confirmation. Once you subscription has been provisioned, you can proceed with the next steps.

## <a name="openvwan"></a>Create a bastion host

This section helps you create a new Azure Bastion resource from the Azure portal.

1. From the home page in the [preview portal](http://aka.ms/BastionHost), click **+ Create a resource** to create a new resource.

1. Type 'Bastion' in the search resource type field, then click **Enter** to get to the search results.

1. From the search results, click the **Bastion** resource. Make sure the publisher is *Microsoft* and the category is *Networking*. (Note that WALLIX Bastion is not Microsoft Azure Bastion).

4. On the **Bastion (preview)** page, click **Create** to open the **Create a bastion** page .

5. On the **Create a bastion** page, configure a new Bastion resource. Specify the configuration settings for your bastion resource.

    ![Virtual WAN diagram](./media/bastion-create-host-portal/settings.png)

    * **Subscription**: This is the Azure subscription you want to use to create a new Bastion resource.
    * **Resource Group**: This is the Azure resource group in which the new Bastion resource will be created in. If you don’t have an existing resource group, you can create a new one.
    * **Name**: The name of the new Bastion resource
    * **Region**: The Azure public region that the resource will be created in.
    * **Virtual network**: The virtual network in which the Bastion resource will be created in. You can create a new virtual network in the portal during this process, in case you don’t have or don’t want to use an existing virtual network. If you are using an existing virtual network, you want to consider the Bastion subnet requirements.
    * **Subnet**: This is the subnet inside your virtual network to which Bastion resource will be deployed. The subnet must be created with the name AzureBastionSubnet. This lets Azure know which subnet to deploy the Bastion resource to. This is different than a Gateway subnet. We highly recommend that you use at least a /27 or larger subnet (/27, /26, etc.). Create the AzureBastionSubnet without any Network Security Groups, route tables, or delegations.
    * **Public IP address**: This is the public IP of the Bastion resource on which RDP/SSH will be accessed (over port 443). Create a new public IP, or use an existing one. The public IP address must be in the same region as the Bastion resource you are creating.
    * **Public IP address name**: The name of the public IP address resource.
    * **Public IP address SKU**: Prepopulated by default to **Standard**.
    * **Assignment**: Static

6. When you have finished specifying the settings, click **Review + Create**.
7. On the validation screen, click **Create**. Wait for about 5 mins for the Bastion resource to be created and deployed. During this time, you may see deployment messages. Wait until the deployment has fully completed. This should take about 5 minutes.

## Create a bastion host using VM settings

If you create a bastion host in the portal by using an existing VM, various settings will automatically default to correspond with the VM.

1. In the [preview portal](https://aka.ms/BastionHost), navigate to your virtual machine, then click **Connect**.

    ![VM Connect](./media/bastion-create-host-portal/vmsettings.png)

1. On the right sidebar, click **Bastion**, then **Use Bastion**.

    ![Bastion](./media/bastion-create-host-portal/vmbastion.png)

1. On the Bastion page, fill out the following settings fields:

    * **Name**: The name of the bastion host you want to create.
    * **Subnet**: This is the subnet inside your virtual network to which Bastion resource will be deployed. The subnet must be created with the name **AzureBastionSubnet**. This lets Azure know which subnet to deploy the Bastion resource to. This is different than a Gateway subnet. We highly recommend that you use at least a /27 or larger subnet (/27, /26, etc.). Create the **AzureBastionSubnet** without any Network Security Groups, route tables, or delegations.
    * **Public IP address**: This is the public IP of the Bastion resource on which RDP/SSH will be accessed (over port 443). Create a new public IP, or use an existing one. The public IP address must be in the same region as the Bastion resource you are creating.
    * **Public IP address name**: The name of the public IP address resource.
4. Click **Create** to create and deploy the bastion host.

## Next steps

Read the [Bastion FAQ](bastion-faq.md)