---
title: Deploying SAP IDES EHP7 SP3 for SAP ERP 6.0 on Microsoft Azure | Microsoft Docs
description: Deploying SAP IDES EHP7 SP3 for SAP ERP 6.0 on Microsoft Azure
services: virtual-machines-windows
documentationcenter: ''
author: hermanndms
manager: timlt
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: 626c1523-1026-478f-bd8a-22c83b869231
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 09/16/2016
ms.author: hermannd

---
# Deploying SAP IDES EHP7 SP3 for SAP ERP 6.0 on Microsoft Azure
This article describes how to deploy an SAP IDES system running with SQL Server and Windows OS on Microsoft Azure via SAP Cloud Appliance Library 3.0. The screenshots show the process step by step. Deploying other solutions in the list works a similar way from a process perspective. One just has to select a different solution.

To start with SAP Cloud Appliance Library (SAP CAL), follow this [link](https://cal.sap.com/). There is a blog from SAP about 
the new [SAP Cloud Appliance Library 3.0](http://scn.sap.com/community/cloud-appliance-library/blog/2016/05/27/sap-cloud-appliance-library-30-came-with-a-new-user-experience). 

**As of May 29th 2017, SAP CAL allows deploying with the Azure Resource Manager deployment model additional to the less preferred classic deployment model. We highly recommend using the new Azure Resource Manager deployment model for deployment and disregard the old deployment model CAL marks as 'classic'.**

If you already deployed in SAP CAL and created an SAP CAL account that could deploy SAP solutions in Azure using the Azure classic deployment method **you need to create another SAP CAL account** that can exclusively deploy into Azure using Azure Resource Manager as deployment framework.

The first screen after logging in to SAP CAL usually leads you to the solutions page of SAP CAL. The solutions offered on SAP CAL are growing month over month. So you might need to scroll quite a bit to find the solution you are looking for.

![](./media/cal-ides-erp6-ehp7-sp3-sql/ides-pic1.jpg)

Some of the solutions that are available on Microsoft Azure are shown above. The highlighted
Windows-based SAP IDES solution that is only available exclusively on Azure was chosen to demonstrate the deployment process.

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

Since we want to deploy in the Azure Resource Manager deployment model in the future, our new SAP CAL account needs to associated with **Microsoft Azure**.

![Screenshot of the SAP Cloud Appliance Library Accounts window](./media/cal-ides-erp6-ehp7-sp3-sql/s4h-pic-2a.PNG)

Then, enter the Azure subscription ID that can be found on the Azure portal. 

![Screenshot of the SAP Cloud Appliance Library Accounts window](./media/cal-ides-erp6-ehp7-sp3-sql/s4h-pic3c.PNG)

The next step is to authorize SAP CAL to deploy into the Azure subscription you just defined. To initiate that process, press the button 'Authorize' as seen in the screenshot above.

Check your Internet Browser since the next screen, which should appear in the same tab in the browser should look like

![Screenshot of IE Cloud Service Login Screen](./media/cal-ides-erp6-ehp7-sp3-sql/s4h-pic4c.PNG)

There might be more than one user listed. You need to choose the Microsoft account that is linked to be co-admin of the Azure subscription you picked.

As next step, a screen like that should show up in the browser tab:

![Screenshot of IE Cloud Service Confirmation Screen](./media/cal-ides-erp6-ehp7-sp3-sql/s4h-pic5a.PNG)

Press the button 'Accept'. As the Authorization is successful, SAP CAL account definition is displayed again, a message is displayed for short time confirming that the authorization process was successful.

To proceed with the CAL account creation, you need to assign the newly created SAP CAL account to your user. In the screen shown below

![Screenshot of Account to User Association](./media/cal-ides-erp6-ehp7-sp3-sql/s4h-pic8a.PNG)

type your User ID (lower red circle) into the field on the right marked in red and press the button 'add'. this step should associate your SAP CAL account with your user that you use to log in to SAP CAL. **You now must press the button 'Review'** to progress with the account association. In the 'Review' page, you need to press the button 'Create' (marked in red below to create the association between your CAL user and the newly created account.

![Screenshot of SAP Cloud Appliance Library Accounts window](./media/cal-ides-erp6-ehp7-sp3-sql/s4h-pic9b.PNG)

You succeeded now to create an SAP CAL account that is able to:

- Leverage Azure Resource Manager deployment methods
- Deploy SAP systems into your azure subscription


> [!NOTE]
Before being able to deploy the SAP IDES solution based on Windows and SQL Server, you might need to sign up for an SAP CAL subscription. Otherwise the solution could show up as 'Locked' in the overview page.


After the setup of an SAP CAL account, you select The SAP IDES solution on Windows and SQL Server solution. Pressing the button 'Create Instance' should get you to the next screen. In that screen, you need to confirm some usage and terms conditions (not shown here). The next screen, which is shown below is using the 'basic' deployment mode as the only screen where you need to:
- Enter an instance name.
- Choose an Azure region. Keep in mind that you might need an SAP CAL subscription to get multiple Azure regions offered.
-  Define the master password for the solution as shown below.

![](./media/cal-ides-erp6-ehp7-sp3-sql/ides-pic10a.png)

After pressing the button 'Create', you see a screen like bellow that gives you the status of the deployment. You need to wait until the status is 'Active'. Below you see the state within the deployment

After some time depending on the size and complexity of the solution (an estimation is given by SAP CAL), it's shown as "active" and ready for usage. 

![](./media/cal-ides-erp6-ehp7-sp3-sql/ides-pic12a.png)

If you check on the Azure portal, you can find the Resource Group and all its objects that were created by SAP CAL in an Azure Resource Group that was created by SAP CAL. The virtual machine can be found starting with the same instance name that was given in SAP CAL.

![](./media/cal-ides-erp6-ehp7-sp3-sql/ides_resource_group.PNG)

Jumping back to SAP CAL, you can go to the deployed instances and press he button 'Connect'. Th pop-up below shows up. 

![](./media/cal-ides-erp6-ehp7-sp3-sql/ides-pic14a.PNG)


Before you proceed, you need to click the link of the 'Getting Started Guide' before you can take one of the options to connect to the deployed systems. The documentation names the users for each of the connectivity methods. The passwords for those users are set to the master password you defined at the beginning of the deployment process. In the documentation, other more functional users are listed with their passwords that you can use to log in to the deployed system.

![](./media/cal-ides-erp6-ehp7-sp3-sql/ides-pic15.jpg)

As you can see a perfectly healthy SAP IDES system deployed in Microsoft Azure within a few hours.

SAP does support deployments through SAP CAL on Azure fully if you bought an SAP CAL subscription. The support queue is: BC-VCM-CAL.

