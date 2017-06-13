---
title: Deploy SAP IDES EHP7 SP3 for SAP ERP 6.0 on Azure | Microsoft Docs
description: Deploy SAP IDES EHP7 SP3 for SAP ERP 6.0 on Azure
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
# Deploy SAP IDES EHP7 SP3 for SAP ERP 6.0 on Azure
This article describes how to deploy an SAP IDES system running with Microsoft SQL Server and the Windows operating system on Azure via the SAP Cloud Appliance Library 3.0. The screenshots show the step-by-step process. To deploy a different solution, follow the same steps.

To start with the SAP Cloud Appliance Library (SAP CAL), go to the [SAP Cloud Applicance Library](https://cal.sap.com/) website. SAP also has a blog about the new [SAP Cloud Appliance Library 3.0](http://scn.sap.com/community/cloud-appliance-library/blog/2016/05/27/sap-cloud-appliance-library-30-came-with-a-new-user-experience). 

> [!NOTE]
As of May 29, 2017, you can use the Azure Resource Manager deployment model in addition to the less-preferred classic deployment model to deploy the SAP CAL. We recommend that you use the new Resource Manager deployment model and disregard the classic deployment model.

If you already created an SAP CAL account that uses the classic model, *you need to create another SAP CAL account*. This account needs to exclusively deploy into Azure by using the Resource Manager model.

1. After you sign in to the SAP CAL, the first page usually leads you to the **Solutions** page. The solutions offered on the SAP CAL are steadily increasing, so you might need to scroll quite a bit to find the solution you want. The highlighted Windows-based SAP IDES solution that is available exclusively on Azure demonstrates the deployment process:

    ![SAP CAL Solutions](./media/sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic1.jpg)


2. To sign in to the SAP CAL for the first time, use your SAP S-User or other user registered with SAP. Then define an SAP CAL account that is used by the SAP CAL to deploy appliances on Azure. In the account definition, you need to:

    - Define the deployment model on Azure (Resource Manager or classic deployment model).
    - Your Azure subscription. An SAP CAL account can be assigned to one subscription only. If you need more than one subscription, you need to create another SAP CAL account.
    - Give the SAP CAL permission to deploy into your Azure subscription.

    > [!NOTE]
    The next steps show the SAP CAL account creation process for Resource Manager deployments. If you already have an SAP CAL account that is linked to the classic deployment model, you *need* to follow these steps to create a new SAP CAL account. The new SAP CAL account needs to be assigned to deploy in the Resource Manager model.

3. Create a new SAP CAL account. The **Accounts** page shows three choices for Azure: 

    - **Microsoft Azure (classic)**, which is the classic deployment model and no longer preferred
    - **Microsoft Azure**, which is the new Resource Manager deployment model
    - **Windows Azure operated by 21Vianet**, which is an option in China where the deployment is in the classic model

    To deploy in the Resource Manager model, the new SAP CAL account needs to be associated with **Microsoft Azure**.

    ![SAP Cloud Appliance Library Cloud Provider](./media/sap-cal-ides-erp6-ehp7-sp3-sql/s4h-pic-2a.PNG)

4. Enter the Azure **Subscription ID** that can be found on the Azure portal. 

    ![SAP Cloud Appliance Library Subscription ID](./media/sap-cal-ides-erp6-ehp7-sp3-sql/s4h-pic3c.PNG)

5. To authorize the SAP CAL to deploy into the Azure subscription you just defined, click **Authorize**. The following page appears in the browser tab:

    ![Internet Explorer Cloud Service Sign-in page](./media/sap-cal-ides-erp6-ehp7-sp3-sql/s4h-pic4c.PNG)

6. More than one user might be listed. Choose the Microsoft account that is linked to be the co-admin of the Azure subscription you selected. The following page appears in the browser tab:

    ![Internet Explorer Cloud Service Confirmation page](./media/sap-cal-ides-erp6-ehp7-sp3-sql/s4h-pic5a.PNG)

7. Click **Accept**. If the authorization is successful, the SAP CAL account definition displays again. After a short time, a message confirms that the authorization process was successful.

8. To proceed with the CAL account creation, you need to assign the newly created SAP CAL account to your user. Enter your **User ID** in the text box on the right, and click **Add**. 

    ![Account to user association](./media/sap-cal-ides-erp6-ehp7-sp3-sql/s4h-pic8a.PNG)

9. To associate your SAP CAL account with your user that you use to sign in to the SAP CAL, click **Review**. 

10. To create the association between your CAL user and the newly created account, click **Create**.

    ![SAP Cloud Appliance Library Accounts](./media/sap-cal-ides-erp6-ehp7-sp3-sql/s4h-pic9b.PNG)

    You successfully created an SAP CAL account that is able to:

    - Leverage the Resource Manager deployment model.
    - Deploy SAP systems into your Azure subscription.


    > [!NOTE]
    Before you can deploy the SAP IDES solution based on Windows and SQL Server, you might need to sign up for an SAP CAL subscription. Otherwise, the solution might show up as **Locked** on the overview page.


11. After you set up an SAP CAL account, select **The SAP IDES solution on Windows and SQL Server** solution. Click **Create Instance**, and confirm the usage and terms conditions. 

12. On the **Basic Mode: Create Instance** page, you need to:

    - Enter an instance **Name**.
    - Select an Azure **Region**. You might need an SAP CAL subscription to get multiple Azure regions offered.
    -  Enter the master **Password** for the solution, as shown:

    ![SAP Cloud Appliance Library Basic Mode: Create Instance](./media/sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic10a.png)

13. Click **Create**. A page appears that shows the status of the deployment. After some time, depending on the size and complexity of the solution (SAP CAL gives an estimate), the status is shown as active and ready for use: 

    ![SAP Cloud Appliance Library Instances](./media/sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic12a.png)

    On the Azure portal, you can find the resource group and all its objects that were created by the SAP CAL. The virtual machine can be found starting with the same instance name that was given in the SAP CAL.

    ![Resource group objects](./media/sap-cal-ides-erp6-ehp7-sp3-sql/ides_resource_group.PNG)

14. In the SAP CAL, go to the deployed instances and click **Connect**. The following pop-up window appears: 

    ![Connect to the Instance](./media/sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic14a.PNG)


15. Before you can use one of the options to connect to the deployed systems, click the **Getting Started Guide**. The documentation names the users for each of the connectivity methods. The passwords for those users are set to the master password you defined at the beginning of the deployment process. In the documentation, other more functional users are listed with their passwords that you can use to sign in to the deployed system.

    ![SAP Welcome documentation](./media/sap-cal-ides-erp6-ehp7-sp3-sql/ides-pic15.jpg)

A healthy SAP IDES system is deployed in Azure within a few hours.

If you bought an SAP CAL subscription, SAP fully supports deployments through an SAP CAL on Azure. The support queue is BC-VCM-CAL.

