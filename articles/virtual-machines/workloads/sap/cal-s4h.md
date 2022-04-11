---
title: Deploy SAP S/4HANA or BW/4HANA on an Azure VM | Microsoft Docs
description: Deploy SAP S/4HANA or BW/4HANA on an Azure VM
services: virtual-machines-linux
documentationcenter: ''
author: hobru
manager: timlt
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: 44bbd2b6-a376-4b5c-b824-e76917117fa9
ms.service: virtual-machines-linux
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 06/26/2021
ms.author: hobruche

---
# SAP Cloud Appliance Library

The [SAP Cloud Appliance Library](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) enables you to quickly create a demo environment with a fully preconfigured SAP system. Within a few clicks, you can have your SAP system up and running. The following links highlight several solutions that you can quickly deploy on Azure. Just select  the "Create Instance" link. 

You will need to authenticate with your S-User or P-User. You can create a P-User free of charge via the [SAP Community](https://community.sap.com/).  Find more details outlined below.

| Solution | Link |
| -------------- | :--------- | 
| **SAP S/4HANA 2020 FPS01** March 22 2022  | [Create Instance](https://cal.sap.com/registration?sguid=4bad009a-cb02-4992-a8b6-28c331a79c66&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|This solution comes as a standard S/4HANA system installation including a remote desktop for easy frontend access. It contains a pre-configured and activated SAP S/4HANA Fiori UI in client 100, with prerequisite components activated as per SAP note 3009827 Rapid Activation for SAP Fiori in SAP S/4HANA 2020 FPS01. See More Information Link. |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/4bad009a-cb02-4992-a8b6-28c331a79c66) |
| **SAP Financial Services Data Platform 1.15** March 16 2022  | [Create Instance](https://cal.sap.com/registration?sguid=310f0bd9-fcad-4ecb-bfea-c61cdc67152b&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|SAP Financial Services Data Management aims to support customers in the building of a data platform for the banking and insurance industries on SAP HANA. It helps the customer to reduce redundancies by managing enterprise data with a "single source of truth" approach through a harmonized integrated data model. |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/310f0bd9-fcad-4ecb-bfea-c61cdc67152b) |
| **SAP S/4HANA 2020 FPS02 for Productive Deployments** December 06 2021  | [Create Instance](https://cal.sap.com/registration?sguid=6562b978-0df0-4b2d-a114-22ba359006ca&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|This solution comes as a standard S/4HANA system installation including High Availability capabilities to ensure higher system uptime for productive usage. The system parameters can be customized during initial provisioning according to the requirements for the target system. |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/6562b978-0df0-4b2d-a114-22ba359006ca) |
| **SAP S/4HANA 2020 FPS02, Fully-Activated Appliance**  July 27 2021 | [Create Instance](https://cal.sap.com/registration?sguid=d48af08b-e2c6-4409-82f8-e42d5610e918&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|This appliance contains SAP S/4HANA 2020 (FPS02) with pre-activated SAP Best Practices for SAP S/4HANA core functions, and further scenarios for Service, Master Data Governance (MDG), Transportation Mgmt. (TM), Portfolio Mgmt. (PPM), Human Capital Management (HCM), Analytics, Migration Cockpit, and more. User access happens via SAP Fiori, SAP GUI, SAP HANA Studio, Windows remote desktop, or the backend operating system for full administrative access. |  [Details]( https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/d48af08b-e2c6-4409-82f8-e42d5610e918) |
| **SAP S/4HANA 2021, Fully-Activated Appliance**  December 08 2021 | [Create Instance](https://cal.sap.com/registration?sguid=b8a9077c-f0f7-47bd-977c-70aa6a6a2aa7&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|This appliance contains SAP S/4HANA 2021 (SP00) with pre-activated SAP Best Practices for SAP S/4HANA core functions, and further scenarios for Service, Master Data Governance (MDG), Transportation Mgmt. (TM), Portfolio Mgmt. (PPM), Human Capital Management (HCM), Analytics, Migration Cockpit, and more. User access happens via SAP Fiori, SAP GUI, SAP HANA Studio, Windows remote desktop, or the backend operating system for full administrative access. |  [Details]( https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/b8a9077c-f0f7-47bd-977c-70aa6a6a2aa7) |
| **SAP S/4HANA 2020 FPS01, Fully-Activated Appliance** April 20 2021  | [Create Instance](https://cal.sap.com/registration?sguid=a0b63a18-0fd3-4d88-bbb9-4f02c13dc343&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|This appliance contains SAP S/4HANA 2020 (FPS01) with pre-activated SAP Best Practices for SAP S/4HANA core functions, and further scenarios for Service, Master Data Governance (MDG), Transportation Mgmt. (TM), Portfolio Mgmt. (PPM), Human Capital Management (HCM), Analytics, Migration Cockpit, and more. User access happens via SAP Fiori, SAP GUI, SAP HANA Studio, Windows remote desktop, or the backend operating system for full administrative access. |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/a0b63a18-0fd3-4d88-bbb9-4f02c13dc343) |
| **SAP S/4HANA 2020 FPS02** February 23 2022  | [Create Instance](https://cal.sap.com/registration?sguid=c3b133c5-fa87-4572-8cc8-e9dac2e43e6d&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|This solution comes as a standard S/4HANA system installation including a remote desktop for easy frontend access. It contains a pre-configured and activated SAP S/4HANA Fiori UI in client 100, with prerequisite components activated as per SAP note 3045635 Rapid Activation for SAP Fiori in SAP S/4HANA 2020 FPS02. See More Information Link. |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/c3b133c5-fa87-4572-8cc8-e9dac2e43e6d) |
| **IDES EHP8 FOR SAP ERP 6.0 on SAP ASE, June 2021** June 10 2021  | [Create Instance](https://cal.sap.com/registration?sguid=ed55a454-0b10-47c5-8644-475ecb8988a0&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|IDES systems are copies of the SAP-internal demo systems and used as playground for customizing and testing. This IDES system specifically can be used as source system in the data migration scenarios of the SAP S/4HANA Fully-Activated Appliance (2020 FPS01 and higher). Besides that, it contains standard business scenarios based on predefined master and transactional data. |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/ed55a454-0b10-47c5-8644-475ecb8988a0) |
| **SAP BW/4HANA 2021 including BW/4HANA Content 2.0 SP08** March 08 2022  | [Create Instance](https://cal.sap.com/registration?sguid=26167db3-6ab2-40fc-a8d9-af5b4014c10c&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|This solution offers you an insight of SAP BW/4HANA. SAP BW/4HANA is the next generation Data Warehouse optimized for SAP HANA. Beside the basic BW/4HANA options the solution offers a bunch of SAP HANA optimized BW/4HANA Content and the next step of Hybrid Scenarios with SAP Data Warehouse Cloud. |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/26167db3-6ab2-40fc-a8d9-af5b4014c10c) |
| **SAP Business One 10.0 PL02, version for SAP HANA**  August 24 2020 | [Create Instance](https://cal.sap.com/registration?sguid=371edc8c-56c6-4d21-acb4-2d734722c712&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|Trusted by over 70,000 small and midsize businesses in 170+ countries, SAP Business One is a flexible, affordable, and scalable ERP solution with the power of SAP HANA. The solution is pre-configured using a 31-day trial license and has a demo database of your choice pre-installed. See the getting started guide to learn about the scope of the solution and how to easily add new demo databases. To secure your system against the CVE-2021-44228 vulnerability, apply SAP Support Note 3131789. For more information, see the Getting Started Guide of this solution (check the "Security Aspects" chapter). |  [Details]( https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/371edc8c-56c6-4d21-acb4-2d734722c712) |
| **Information Detector for SAP Data Custodian v2106** August 30 2021  | [Create Instance](https://cal.sap.com/registration?sguid=db44680c-8a2a-405d-8963-838db38fa7dd&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|The information detector for SAP Data Custodian can be used to automate data labeling of cloud resources. Information detectors search through your infrastructure resources and determine whether they contain certain types of information. |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/db44680c-8a2a-405d-8963-838db38fa7dd) |
| **SAP Yard Logistics 2009 for SAP S/4HANA**  Jul 28, 2021 | [Create Instance](https://cal.sap.com/registration?sguid=9cdf4f13-73a5-4743-a213-82e0d1a68742&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|Run more efficient and profitable supply chain logistics with the SAP Yard Logistics application. Maximize your visibility into all yard processes and preview planned workloads with a range of visualization and reporting tools, so you can optimize resource use and support planning, execution, and billing with a single system.|  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/9cdf4f13-73a5-4743-a213-82e0d1a68742) | 
| **SAP S/4HANA 2020 FPS02, Fully-Activated Appliance**  Jul 27, 2021 | [Create Instance](https://cal.sap.com/registration?sguid=d48af08b-e2c6-4409-82f8-e42d5610e918&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) | 
|This solution comes as a standard S/4HANA system installation including a remote desktop for easy frontend access. It contains a pre-configured and activated SAP S/4HANA Fiori UI in client 100, with prerequisite components activated as per SAP note 3045635 Rapid Activation for SAP Fiori in SAP S/4HANA 2020 FPS02. See More Information Link.| [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/d48af08b-e2c6-4409-82f8-e42d5610e918) | 
| **SAP Focused Run 3.0 FP01, unconfigured**  Jul 21, 2021 | [Create Instance](https://cal.sap.com/registration?sguid=82bdb96e-3578-41aa-a3e1-a6d9a8335ae1&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|SAP Focused Run is designed specifically for businesses that need high-volume system and application monitoring, alerting, and analytics. It's a powerful solution for service providers, who want to host all their customers in one central, scalable, safe, and automated environment. It also addresses customers with advanced needs regarding system management, user monitoring, integration monitoring, and configuration and security analytics.|  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/82bdb96e-3578-41aa-a3e1-a6d9a8335ae1) | 
| **SAP S/4HANA 2020 FPS01 Utilities Trial**  Jul 21, 2021 | [Create Instance](https://cal.sap.com/registration?sguid=68785eeb-a228-4aa8-8273-b4c30775590c&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|This solution lets you create your own SAP S/4HANA 2020 Utilities system and get hands-on experience, including an all-area full admin access. Selected guided tours will help you understand the optimized processing of metering data, the streamlined billing process through role-based FIORI user interfaces, and the industry-specific customer service conduct in Customer Engagement.|  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/68785eeb-a228-4aa8-8273-b4c30775590c)| 
| **SAP Product Lifecycle Costing 4.0 SP3 Hotfix 2**  Aug 1, 2021 | [Create Instance](https://cal.sap.com/registration?sguid=f2bf191a-7efc-48a2-b8ac-51756eb225bc&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|SAP Product Lifecycle Costing is a solution to calculate costs and other dimensions for new products or product related quotations in an early stage of the product lifecycle, to quickly identify cost drivers and to easily simulate and compare alternatives.|  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/f2bf191a-7efc-48a2-b8ac-51756eb225bc)|
| **SAP ABAP Platform 1909, Developer Edition** June 21 2021  | [Create Instance](https://cal.sap.com/registration?sguid=7bd4548f-a95b-4ee9-910a-08c74b4f6c37&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|The SAP ABAP Platform on SAP HANA gives you access to SAP ABAP Platform 1909 Developer Edition on SAP HANA. Note that this solution is preconfigured with many additional elements – including: SAP ABAP RESTful Application Programming Model, SAP Fiori launchpad, SAP gCTS, SAP ABAP Test Cockpit, and preconfigured frontend / backend connections, etc It also includes all the standard ABAP AS infrastructure: Transaction Management, database operations / persistence, Change and Transport System, SAP Gateway, interoperability with ABAP Development Toolkit and SAP WebIDE, and much more. |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/7bd4548f-a95b-4ee9-910a-08c74b4f6c37) |
| **1: SAP ERP source system (openSAP)**  September 17 2021 | [Create Instance](https://cal.sap.com/registration?sguid=1a3556c0-0ee1-4a4c-8a5a-db08173df293&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|Solution 1 for performing a system conversion from SAP ERP to SAP S/4HANA initial status. It has been tested and prepared to be converted from SAP EHP6 for SAP ERP 6.0 SPS13 to SAP S/4HANA 2020 FPS00. |  [Details]( https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/1a3556c0-0ee1-4a4c-8a5a-db08173df293) |
| **2: SAP ERP source system after prep steps before running Software Update Manager (openSAP)** October 04 2021  | [Create Instance](https://cal.sap.com/registration?sguid=5eb92a4d-a704-48b8-b060-0647c63b667c&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|Solution 2 for performing a system conversion from SAP ERP to SAP S/4HANA after preparation steps before running Software Update Manager. It has been tested and prepared to be converted from SAP EHP6 for SAP ERP 6.0 SPS13 to SAP S/4HANA 2020 FPS00. |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/5eb92a4d-a704-48b8-b060-0647c63b667c) |
| **3. SAP S/4HANA target system after technical conversion before additional config** September 22 2021  | [Create Instance](https://cal.sap.com/registration?sguid=4336a3fb-2fc9-4a93-9500-c65101ffc9d7&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|Solution 3 after performing a technical system conversion from SAP ERP to SAP S/4HANA before additional configuration. It has been tested and prepared as converted from SAP EHP6 for SAP ERP 6.0 SPS13 to SAP S/4HANA 2020 FPS00. |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/4336a3fb-2fc9-4a93-9500-c65101ffc9d7) |
| **4: SAP S/4HANA target system including additional config (openSAP)**  October 17 2021 | [Create Instance](https://cal.sap.com/registration?sguid=f48f2b77-389f-488b-be2b-1c14a86b2e69&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|Solution 4 after performing a technical system conversion from SAP ERP to SAP S/4HANA including additional configuration. It has been tested and prepared as converted from SAP EHP6 for SAP ERP 6.0 SPS13 to SAP S/4HANA 2020 FPS00. |  [Details]( https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/f48f2b77-389f-488b-be2b-1c14a86b2e69) |
| **SAP Solution Manager 7.2 SP13 & Focused Solutions SP08 (Demo System) with SAP S/4HANA** November 16 2021  | [Create Instance](https://cal.sap.com/registration?sguid=769336fe-cb15-44dc-926c-e3f851adab32&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|SAP Solution Manager 7.2 supports the “business of IT” with four key value chains: Portfolio to Project (P2P) to drive the portfolio of projects and balance business initiatives and their business value against IT capacity, skills and timelines. Requirement to Deploy (R2D) to build what the business needs. Request to Fulfill (R2F) to catalog, request and fulfill services. Detect to Correct (D2C) to anticipate and resolve production problems. |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/769336fe-cb15-44dc-926c-e3f851adab32) |
| **Enterprise Management Layer for SAP S/4HANA 2020 FPS02** November 15 2021  | [Create Instance](https://cal.sap.com/registration?sguid=0f85835e-b3d5-4b75-b65e-4d89ed0da409&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|The enterprise management layer for SAP S/4HANA 2020 offers a ready-to-run, pre-configured, localized core template based on pre-activated SAP Best Practices on-premise country versions covering 43 countries. The CAL solution can be used to get familiar with this offering. |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/0f85835e-b3d5-4b75-b65e-4d89ed0da409) |
 




---







## Setup and get started with SAP Cloud Appliance Library

> [!NOTE]
> For more information about the SAP CAL, go to the [SAP Cloud Appliance Library](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) website. SAP also has a blog about the [SAP Cloud Appliance Library 3.0](http://scn.sap.com/community/cloud-appliance-library/blog/2016/05/27/sap-cloud-appliance-library-30-came-with-a-new-user-experience).

> [!NOTE]
> As of May 29, 2017, you can use the Azure Resource Manager deployment model in addition to the less-preferred classic deployment model to deploy the SAP CAL. We recommend that you use the new Resource Manager deployment model and disregard the classic deployment model.

## Create an account in the SAP CAL
1. To sign in to the SAP CAL for the first time, use your SAP S-User or other user registered with SAP. Then define an SAP CAL account that is used by the SAP CAL to deploy appliances on Azure. In the account definition, you need to:

    a. Select the deployment model on Azure (Resource Manager or classic).

    b. Enter your Azure subscription. An SAP CAL account can be assigned to one subscription only. If you need more than one subscription, you need to create another SAP CAL account.

    c. Give the SAP CAL permission to deploy into your Azure subscription.

    > [!NOTE]
    > The next steps show how to create an SAP CAL account for Resource Manager deployments. If you already have an SAP CAL account that is linked to the classic deployment model, you *need* to follow these steps to create a new SAP CAL account. The new SAP CAL account needs to deploy in the Resource Manager model.

2. Create a new SAP CAL account. The **Accounts** page shows three choices for Azure: 

    a. **Microsoft Azure (classic)** is the classic deployment model and is no longer preferred.

    b. **Microsoft Azure** is the new Resource Manager deployment model.

    c. **Windows Azure operated by 21Vianet** is an option in China that uses the classic deployment model.

    To deploy in the Resource Manager model, select **Microsoft Azure**.

    ![SAP CAL Account Details](./media/cal-s4h/s4h-pic-2a.png)

3. Enter the Azure **Subscription ID** that can be found on the Azure portal.

   ![SAP CAL Accounts](./media/cal-s4h/s4h-pic3c.png)

4. To authorize the SAP CAL to deploy into the Azure subscription you defined, click **Authorize**. The following page appears in the browser tab:

   ![Internet Explorer cloud services sign-in](./media/cal-s4h/s4h-pic4c.png)

5. If more than one user is listed, choose the Microsoft account that is linked to be the coadministrator of the Azure subscription you selected. The following page appears in the browser tab:

   ![Internet Explorer cloud services confirmation](./media/cal-s4h/s4h-pic5a.png)

6. Click **Accept**. If the authorization is successful, the SAP CAL account definition displays again. After a short time, a message confirms that the authorization process was successful.

7. To assign the newly created SAP CAL account to your user, enter your **User ID** in the text box on the right and click **Add**.

   ![Account to user association](./media/cal-s4h/s4h-pic8a.png)

8. To associate your account with the user that you use to sign in to the SAP CAL, click **Review**. 
 
9. To create the association between your user and the newly created SAP CAL account, click **Create**.

   ![User to SAP CAL account association](./media/cal-s4h/s4h-pic9b.png)

You successfully created an SAP CAL account that is able to:

- Use the Resource Manager deployment model.
- Deploy SAP systems into your Azure subscription.

Now you can start to deploy S/4HANA into your user subscription in Azure.

> [!NOTE]
> Before you continue, determine whether you have required Azure core quotas. Some solutions in SAP CAL uses M-Series VMs of Azure to deploy some of the SAP HANA-based solutions. Your Azure subscription might not have any M-Series core quotas. If so, you might need to contact Azure support to get a required quota.

> [!NOTE]
> When you deploy a solution on Azure in the SAP CAL, you might find that you can choose only one Azure region. To deploy into Azure regions other than the one suggested by the SAP CAL, you need to purchase a CAL subscription from SAP. You also might need to open a message with SAP to have your CAL account enabled to deliver into Azure regions other than the ones initially suggested.

## Deploy a solution

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

2. Click **Create**, and in the message box that appears, click **OK**.

   ![SAP CAL Supported VM Sizes](./media/cal-s4h/s4h-pic10b.png)

3. In the **Private Key** dialog box, click **Store** to store the private key in the SAP CAL. To use password protection for the private key, click **Download**. 

   ![SAP CAL Private Key](./media/cal-s4h/s4h-pic10c.png)

4. Read the SAP CAL **Warning** message, and click **OK**.

   ![SAP CAL Warning](./media/cal-s4h/s4h-pic10d.png)

    Now the deployment takes place. After some time, depending on the size and complexity of the solution (the SAP CAL provides an estimate), the status is shown as active and ready for use.

5. To find the virtual machines collected with the other associated resources in one resource group, go to the Azure portal: 

   ![SAP CAL objects deployed in the new portal](./media/cal-s4h/sapcaldeplyment_portalview.png)

6. On the SAP CAL portal, the status appears as **Active**. To connect to the solution, click **Connect**. Different options to connect to the different components are deployed within this solution.

   ![SAP CAL Instances](./media/cal-s4h/active_solution.png)

7. Before you can use one of the options to connect to the deployed systems, click **Getting Started Guide**. 

   ![Connect to the Instance](./media/cal-s4h/connect_to_solution.png)

    The documentation names the users for each of the connectivity methods. The passwords for those users are set to the master password you defined at the beginning of the deployment process. In the documentation, other more functional users are listed with their passwords, which you can use to sign in to the deployed system. 

    For example, if you use the SAP GUI that's preinstalled on the Windows Remote Desktop machine, the S/4 system might look like this:

   ![SM50 in the preinstalled SAP GUI](./media/cal-s4h/gui_sm50.png)

    Or if you use the DBACockpit, the instance might look like this:
 

   ![SM50 in the DBACockpit SAP GUI](./media/cal-s4h/dbacockpit.png)

Within a few hours, a healthy SAP S/4 appliance is deployed in Azure.

If you bought an SAP CAL subscription, SAP fully supports deployments through the SAP CAL on Azure. The support queue is BC-VCM-CAL.







