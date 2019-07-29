---
title: Deploy SAP S/4HANA or BW/4HANA on an Azure VM | Microsoft Docs
description: Deploy SAP S/4HANA or BW/4HANA on an Azure VM
services: virtual-machines-linux
documentationcenter: ''
author: hermanndms
manager: gwallace
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: 44bbd2b6-a376-4b5c-b824-e76917117fa9
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 09/15/2016
ms.author: hermannd

---
# Deploy SAP S/4HANA or BW/4HANA on Azure
This article describes how to deploy S/4HANA on Azure by using the SAP Cloud Appliance Library (SAP CAL) 3.0. To deploy other SAP HANA-based solutions, such as BW/4HANA, follow the same steps.

> [!NOTE]
> For more information about the SAP CAL, go to the [SAP Cloud Appliance Library](https://cal.sap.com/) website. SAP also has a blog about the [SAP Cloud Appliance Library 3.0](https://scn.sap.com/community/cloud-appliance-library/blog/2016/05/27/sap-cloud-appliance-library-30-came-with-a-new-user-experience).
> 
> [!NOTE]
> As of May 29, 2017, you can use the Azure Resource Manager deployment model in addition to the less-preferred classic deployment model to deploy the SAP CAL. We recommend that you use the new Resource Manager deployment model and disregard the classic deployment model.

## Step-by-step process to deploy the solution

The following sequence of screenshots shows you how to deploy S/4HANA on Azure by using the SAP CAL. The process works the same way for other solutions, such as BW/4HANA.

The **Solutions** page shows some of the SAP CAL HANA-based solutions available on Azure. **SAP S/4HANA 1610 FPS01, Fully-Activated Appliance** is in the middle row:

![SAP CAL Solutions](./media/cal-s4h/s4h-pic-1c.png)

### Create an account in the SAP CAL
1. To sign in to the SAP CAL for the first time, use your SAP S-User or other user registered with SAP. Then define an SAP CAL account that is used by the SAP CAL to deploy appliances on Azure. In the account definition, you need to:

    a. Select the deployment model on Azure (Resource Manager or classic).

    b. Enter your Azure subscription. An SAP CAL account can be assigned to one subscription only. If you need more than one subscription, you need to create another SAP CAL account.

    c. Give the SAP CAL permission to deploy into your Azure subscription.

   > [!NOTE]
   >  The next steps show how to create an SAP CAL account for Resource Manager deployments. If you already have an SAP CAL account that is linked to the classic deployment model, you *need* to follow these steps to create a new SAP CAL account. The new SAP CAL account needs to deploy in the Resource Manager model.

1. Create a new SAP CAL account. The **Accounts** page shows three choices for Azure: 

    a. **Microsoft Azure (classic)** is the classic deployment model and is no longer preferred.

    b. **Microsoft Azure** is the new Resource Manager deployment model.

    c. **Windows Azure operated by 21Vianet** is an option in China that uses the classic deployment model.

    To deploy in the Resource Manager model, select **Microsoft Azure**.

    ![SAP CAL Account Details](./media/cal-s4h/s4h-pic-2a.png)

1. Enter the Azure **Subscription ID** that can be found on the Azure portal.

   ![SAP CAL Accounts](./media/cal-s4h/s4h-pic3c.png)

1. To authorize the SAP CAL to deploy into the Azure subscription you defined, click **Authorize**. The following page appears in the browser tab:

   ![Internet Explorer cloud services sign-in](./media/cal-s4h/s4h-pic4c.png)

1. If more than one user is listed, choose the Microsoft account that is linked to be the coadministrator of the Azure subscription you selected. The following page appears in the browser tab:

   ![Internet Explorer cloud services confirmation](./media/cal-s4h/s4h-pic5a.png)

1. Click **Accept**. If the authorization is successful, the SAP CAL account definition displays again. After a short time, a message confirms that the authorization process was successful.

1. To assign the newly created SAP CAL account to your user, enter your **User ID** in the text box on the right and click **Add**.

   ![Account to user association](./media/cal-s4h/s4h-pic8a.png)

1. To associate your account with the user that you use to sign in to the SAP CAL, click **Review**. 
 
1. To create the association between your user and the newly created SAP CAL account, click **Create**.

   ![User to SAP CAL account association](./media/cal-s4h/s4h-pic9b.png)

You successfully created an SAP CAL account that is able to:

- Use the Resource Manager deployment model.
- Deploy SAP systems into your Azure subscription.

Now you can start to deploy S/4HANA into your user subscription in Azure.

> [!NOTE]
> Before you continue, determine whether you have Azure vCPU quotas for Azure H-Series VMs. At the moment, the SAP CAL uses H-Series VMs of Azure to deploy some of the SAP HANA-based solutions. Your Azure subscription might not have any H-Series vCPU quotas for H-Series. If so, you might need to contact Azure support to get a quota of at least 16 H-Series vCPUs.
> 
> [!NOTE]
> When you deploy a solution on Azure in the SAP CAL, you might find that you can choose only one Azure region. To deploy into Azure regions other than the one suggested by the SAP CAL, you need to purchase a CAL subscription from SAP. You also might need to open a message with SAP to have your CAL account enabled to deliver into Azure regions other than the ones initially suggested.

### Deploy a solution

Let's deploy a solution from the **Solutions** page of the SAP CAL. The SAP CAL has two sequences to deploy:

- A basic sequence that uses one page to define the system to be deployed
- An advanced sequence that gives you certain choices on VM sizes 

We demonstrate the basic path to deployment here.

1. On the **Account Details** page, you need to:

    a. Select an SAP CAL account. (Use an account that is associated to deploy with the Resource Manager deployment model.)

    b. Enter an instance **Name**.

    c. Select an Azure **Region**. The SAP CAL suggests a region. If you need another Azure region and you don't have an SAP CAL subscription, you need to order a CAL subscription with SAP.

    d. Enter a master **Password** for the solution of eight or nine characters. The password is used for the administrators of the different components.

   ![SAP CAL Basic Mode: Create Instance](./media/cal-s4h/s4h-pic10a.png)

1. Click **Create**, and in the message box that appears, click **OK**.

   ![SAP CAL Supported VM Sizes](./media/cal-s4h/s4h-pic10b.png)

1. In the **Private Key** dialog box, click **Store** to store the private key in the SAP CAL. To use password protection for the private key, click **Download**. 

   ![SAP CAL Private Key](./media/cal-s4h/s4h-pic10c.png)

1. Read the SAP CAL **Warning** message, and click **OK**.

   ![SAP CAL Warning](./media/cal-s4h/s4h-pic10d.png)

    Now the deployment takes place. After some time, depending on the size and complexity of the solution (the SAP CAL provides an estimate), the status is shown as active and ready for use.

1. To find the virtual machines collected with the other associated resources in one resource group, go to the Azure portal: 

   ![SAP CAL objects deployed in the new portal](./media/cal-s4h/sapcaldeplyment_portalview.png)

1. On the SAP CAL portal, the status appears as **Active**. To connect to the solution, click **Connect**. Different options to connect to the different components are deployed within this solution.

   ![SAP CAL Instances](./media/cal-s4h/active_solution.png)

1. Before you can use one of the options to connect to the deployed systems, click **Getting Started Guide**. 

   ![Connect to the Instance](./media/cal-s4h/connect_to_solution.png)

    The documentation names the users for each of the connectivity methods. The passwords for those users are set to the master password you defined at the beginning of the deployment process. In the documentation, other more functional users are listed with their passwords, which you can use to sign in to the deployed system. 

    For example, if you use the SAP GUI that's preinstalled on the Windows Remote Desktop machine, the S/4 system might look like this:

   ![SM50 in the preinstalled SAP GUI](./media/cal-s4h/gui_sm50.png)

    Or if you use the DBACockpit, the instance might look like this:

   ![SM50 in the DBACockpit SAP GUI](./media/cal-s4h/dbacockpit.png)

Within a few hours, a healthy SAP S/4 appliance is deployed in Azure.

If you bought an SAP CAL subscription, SAP fully supports deployments through the SAP CAL on Azure. The support queue is BC-VCM-CAL.







