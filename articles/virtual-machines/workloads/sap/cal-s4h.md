---
title: Deploy SAP S/4HANA or BW/4HANA on an Azure VM | Microsoft Docs
description: Deploy SAP S/4HANA or BW/4HANA on an Azure VM
services: virtual-machines-linux
documentationcenter: ''
author: hermanndms
manager: timlt
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
# Deploy SAP S/4HANA or BW/4HANA on Microsoft Azure
This article describes how to deploy S/4HANA on Microsoft Azure by using SAP Cloud Appliance Library (SAP CAL) 3.0. Deploying other SAP HANA-based solutions, like BW/4HANA, works the same way from a process perspective. You select a different solution.

> [!NOTE]
For more information about the SAP Cloud Appliance Library, see the [home page of their site](https://cal.sap.com/). There is also a blog from SAP about [SAP Cloud Appliance Library 3.0](http://scn.sap.com/community/cloud-appliance-library/blog/2016/05/27/sap-cloud-appliance-library-30-came-with-a-new-user-experience).

**As of May 29th 2017, SAP CAL allows deploying with the Azure Resource Manager deployment model additional to the less preferred classic deployment model. We highly recommend using the new Azure Resource Manager deployment model for deployment and disregard the old deployment model CAL marks as 'classic'.**

## Step-by-step process to deploy the solution

The following sequence of screenshots shows you how to deploy S/4HANA on Azure using SAP CAL. The process works the same way for other solutions, like BW/4HANA.

The first picture shows some of the SAP CAL HANA-based solutions available on Azure. Notice **SAP S/4HANA 1610 FPS01, Fully-Activated Appliance** in the middle of the screen.

![Screenshot of the SAP Cloud Appliance Library Solutions window](./media/cal-s4h/s4h-pic-1c.png)

### Account creation in SAP Cloud appliance Library
Using your SAP S-User or other user registered with SAP to log in to SAP CAL for the first time, the next step is to define an SAP CAL account that is used by SAP CAL to deploy appliances on Azure. In the account definition, you need to:

- Define the deployment model on Azure (Azure Resource Manager or classic deployment model).
- Your Azure subscription. An SAP CAL account can be assigned to one subscription only. If you need more than one subscription, you need to create another SAP CAL account.
- Give SAP CAL the permission to deploy into your Azure subscription.

> [!NOTE]
The next steps will show, the SAP CAL account creation for Azure Resource Manager deployments. If you already have an SAP CAL account that is linked to the classical deployment model, you NEED to follow these steps to create a new SAP CAL account. The new SAP CAL account needs to get assigned to deploy in the Azure Resource Manager model.

First, create a new SAP CAL account. In **Accounts**, you see three choices for Azure: 

- Microsoft Azure (classic) which is the classic deployment method and not preferred these days
- Microsoft Azure, which, stands for the new Azure Resource Manager deployment model
- An Azure option operated by 21Vianet in China where the deployment still is in the classic model

Since we want to deploy in Azure Resource Manager deployment model in the future, our new SAP CAL account needs to associated with **Microsoft Azure**.

![Screenshot of the SAP Cloud Appliance Library Accounts window](./media/cal-s4h/s4h-pic-2a.png)

Then, enter the Azure subscription ID that can be found on the Azure portal. 

![Screenshot of the SAP Cloud Appliance Library Accounts window](./media/cal-s4h/s4h-pic3c.png)

The next step is to authorize SAP CAL to deploy into the Azure subscription you defined. To initiate that process, press the button 'Authorize as seen in the screenshot above.

Check your Internet Browser since the next screen, which should appear in the same tab in the browser should look like

![Screenshot of IE Cloud Service Login Screen](./media/cal-s4h/s4h-pic4c.png)

There might be more than one user listed. You need to choose the Microsoft account that is linked to be co-admin of the Azure subscription you picked.

As next, a screen like that should show up in the browser tab:

![Screenshot of IE Cloud Service Confirmation Screen](./media/cal-s4h/s4h-pic5a.png)

Press the button 'Accept'. As the Authorization is successful, SAP CAL account definition is displayed again, a message is displayed for short time confirming that the authorization process was successful.

In the next step, you need to assign the newly created SAP CAL account to your user. In the screen shown below

![Screenshot of Account to User Association](./media/cal-s4h/s4h-pic8a.png)

type your User ID (lower red circle) into the field on the right marked in red and press the button 'add'. This step should associate your account with your user that you use to log in to SAP CAL. 
**You now must press the button 'Review'** to progress with the account association. In the 'Review' page, you need to press the button 'Create' (marked in red below) to create the association between your SAP CAL user and the newly created SAP CAL account.

![Screenshot of SAP Cloud Appliance Library Accounts window](./media/cal-s4h/s4h-pic9b.png)

You succeeded now to create an SAP CAL account that is able to:

- Leverage Azure Resource Manager deployment methods
- Deploy SAP systems into your Azure subscription

No, we can start to deploy S/4HANA into your user subscription into Azure.

> [!NOTE]
**Before continuing, check whether you have Azure core quotas for Azure H-Series VMs. At the moment, CAL is using H-Series VMs of Azure to deploy some of the SAP HANA-based solutions. Your Azure subscription may not have any H-Series core quota for H-Series. Hence you might need to contact Microsoft Azure support to get a quota of at least 16 H-Series cores.**

> [!NOTE]
**As you attempt to deploy an SAP solution on Azure in CAL, you might find that you only can choose one Azure region. To deploy into other Azure regions, than the one suggested by CAL, you need to purchase a CAL subscription from SAP! You also might need to open a message with SAP to have your CAL account enabled to deliver into other Azure regions than the ones suggested by SAP CAL initially**

As these obstacles are taken care of, let's start with the deployment of the solution out of the solution screen of SAP CAL. SAP CAL has two sequences to deploy:

- A 'basic' one with one real screen to define the system to be deployed.
- An 'advanced' sequence, where you have certain choices on VM sizes. 

We demonstrate the 'basic' path to deployment here.

As the first screen (below) appears, you need to:

- Select a CAL account (use an account that is associated to deploy with Azure Resource Manager deployment model)
- Enter an instance name
- Choose an Azure region. Keep in mind that CAL suggests a region. If you need another Azure region and you do not have a CAL subscription, you should order an SAP CAL subscription with SAP) 
- Define the master password for the solution. The master password needs to be between 8-9 signs long. The password is used for the administrators of the different components


![Screenshot of SAP Cloud Appliance Library Solutions window](./media/cal-s4h/s4h-pic10a.png)

After pressing the button 'Create' (lower right corner), the following screen appears that you need to confirm with pressing 'OK'

![Screenshot of SAP Cloud Appliance Library Solutions window](./media/cal-s4h/s4h-pic10b.png)

After confirming another screen regarding to your private key shows up. We usually store it in CAL and also download it password protected. 

![Screenshot of SAP Cloud Appliance Library Solutions window](./media/cal-s4h/s4h-pic10c.png)

A last information screen by SAP CAL shows that you need to confirm

![Screenshot of SAP Cloud Appliance Library Solutions window](./media/cal-s4h/s4h-pic10d.png)

Now the deployment is taking place, depending on the size and complexity of the solution (an estimate is provided by SAP CAL), after a time, the solution is shown as 'Active' and ready for use.

In the Azure portal, these virtual machines can be found now all collected with the other associated resources in one Azure Resource Group: 

![Screenshot that shows CAL deployed objects in the new portal](./media/cal-s4h/sapcaldeplyment_portalview.png)

From SAP CAL side, you should see the status of 'Active', like shown below

![Screenshot of SAP Cloud Appliance Library Instances window](./media/cal-s4h/active_solution.png)

Now it's possible to connect to the solution by using the connect button in the SAP CAL portal. As you see, there are different options to connect to the different components that have been deployed within this solution.

![Screenshot of Connect to the Instance dialog box](./media/cal-s4h/connect_to_solution.png)

Before you proceed, you need to click the link of the 'Getting Started Guide' before you can take one of the options to connect to the deployed systems. The documentation names the users for each of the connectivity methods. The passwords for those users are set to the master password you defined at the beginning of the deployment process. In the documentation, other more functional users are listed with their passwords that you can use to log in to the deployed system. 

For example, using SAP GUI that is preinstalled on the Windows Remote Desktop machine, The S/4 system itself could look like:

![Screenshot of SM50 in SAP GUI](./media/cal-s4h/gui_sm50.png)

or using the DBACockpit for this instance could look like:

![Screenshot of SM50 in SAP GUI](./media/cal-s4h/dbacockpit.png)

As you can see a perfectly healthy SAP S/4 appliance deployed in Microsoft Azure within a few hours.

And yes, SAP does support deployments through SAP CAL on Azure fully if you bought an SAP CAL subscription. The support queue is: BC-VCM-CAL.







