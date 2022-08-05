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
ms.service: virtual-machines
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 06/26/2021
ms.author: hobruche

---
# SAP Cloud Appliance Library

[SAP Cloud Appliance Library](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) offers a quick and easy way to create SAP workloads in Azure. With a few clicks you can set up a fully configured demo environment from an Appliance Template or deploy a standardized system for an SAP product based on default or custom SAP software installation stacks. 
This page lists the latest Appliance Templates and below the latest SAP S/4HANA stacks for production-ready deployments. 

For deployment of an appliance template you will need to authenticate with your S-User or P-User. You can create a P-User free of charge via the [SAP Community](https://community.sap.com/). 



[For details on Azure account creation see the SAP learning video and description](https://www.youtube.com/watch?v=iORePziUMBk&list=PLWV533hWWvDmww3OX9YPhjjS1l1n6o-H2&index=18)

You will also find detailed answers to your questions related to SAP Cloud Appliance Library on Azure [SAP CAL FAQ](https://caldocs.hana.ondemand.com/caldocs/help/Azure_FAQs.pdf)

The online library is continuously updated with Appliances for demo, proof of concept and exploration of new business cases. For the most recent ones select “Create Appliance” here from the list – or visit [cal.sap.com](https://cal.sap.com/catalog#/applianceTemplates) for further templates.

## Deployment of appliances through SAP Cloud Appliance Library

| Appliance Templates | Link |
| -------------- | :--------- |
| **SAP Focused Run 3.0 FP03 (configured)** July 28 2022  | [Create Appliance](https://cal.sap.com/registration?sguid=517c6359-6b26-458d-b816-ca25c3e5af7d&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|SAP Focused Run is designed specifically for businesses that need high-volume system and application monitoring, alerting, and analytics. It's a powerful solution for service providers, who want to host all their customers in one central, scalable, safe, and automated environment. It also addresses customers with advanced needs regarding system management, user monitoring, integration monitoring, and configuration and security analytics. |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/applianceTemplates/517c6359-6b26-458d-b816-ca25c3e5af7d) |
| **System Conversion for SAP S/4HANA – SAP S/4HANA 2021 FPS01 after technical conversion** July 27 2022  | [Create Appliance](https://cal.sap.com/registration?sguid=93895065-7267-4d51-945b-9300836f6a80&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|Third solution after performing a technical system conversion from SAP ERP to SAP S/4HANA before additional configuration. It has been tested and prepared as converted from SAP EHP7 for SAP ERP 6.0 to SAP S/4HANA 2020 FPS01. |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/applianceTemplates/93895065-7267-4d51-945b-9300836f6a80) |
| **SAP Focused Run 3.0 FP03, unconfigured** July 21 2022  | [Create Appliance](https://cal.sap.com/registration?sguid=4c38b6ff-d598-4dbc-8f39-fdcf96ae0beb&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|SAP Focused Run is designed specifically for businesses that need high-volume system and application monitoring, alerting, and analytics. It's a powerful solution for service providers, who want to host all their customers in one central, scalable, safe, and automated environment. It also addresses customers with advanced needs regarding system management, user monitoring, integration monitoring, and configuration and security analytics. |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/applianceTemplates/4c38b6ff-d598-4dbc-8f39-fdcf96ae0beb) | 
| **SAP S/4HANA 2021 FPS02, Fully-Activated Appliance**  July 19 2022 | [Create Appliance](https://cal.sap.com/registration?sguid=3f4931de-b15b-47f1-b93d-a4267296b8bc&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|This appliance contains SAP S/4HANA 2021 (FPS02) with pre-activated SAP Best Practices for SAP S/4HANA core functions, and further scenarios for Service, Master Data Governance (MDG), Portfolio Mgmt. (PPM), Human Capital Management (HCM), Analytics, Migration Cockpit, and more. User access happens via SAP Fiori, SAP GUI, SAP HANA Studio, Windows remote desktop, or the backend operating system for full administrative access. |  [Details]( https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/applianceTemplates/3f4931de-b15b-47f1-b93d-a4267296b8bc) |
 | **System Conversion for SAP S/4HANA – Source system SAP ERP6.0 before running SUM** July 05 2022  | [Create Appliance](https://cal.sap.com/registration?sguid=b28b67f3-ebab-4b03-bee9-1cd57ddb41b6&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|Second solution for performing a system conversion from SAP ERP to SAP S/4HANA after preparation steps before running Software Update Manager. It has been tested and prepared to be converted from SAP EHP7 for SAP ERP 6.0 to SAP S/4HANA 2021 FPS01  |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/applianceTemplates/b28b67f3-ebab-4b03-bee9-1cd57ddb41b6) |
| **SAP NetWeaver 7.5 SP15 on SAP ASE** January 20 2020  | [Create Appliance](https://cal.sap.com/registration?sguid=69efd5d1-04de-42d8-a279-813b7a54c1f6&provider=208b780d-282b-40ca-9590-5dd5ad1e52e8) |
|SAP NetWeaver 7.5 SP15 on SAP ASE |  [Details](https://cal.sap.com/catalog?provider=208b780d-282b-40ca-9590-5dd5ad1e52e8#/solutions/69efd5d1-04de-42d8-a279-813b7a54c1f6) |



## Deployment of S/4HANA system for productive usage through SAP Cloud Appliance Library

You now can also deploy S4H systems for productive usage through SAP Cloud Appliance Library. Within a few clicks, you can have your SAP system for productive usage up and running. The following links highlight the solutions that you can quickly deploy on Azure. Just select  the "Deploy System" under "Products" link. 

You will need to authenticate with your S-User. 

| All products | Link |
| -------------- | :--------- |
| **SAP S/4HANA 2021 FPS01 for Productive Deployments**   | [Deploy System](https://cal.sap.com/catalog#/products) |
|This solution comes as a standard S/4HANA system installation including High Availability capabilities to ensure higher system uptime for productive usage. The system parameters can be customized during initial provisioning according to the requirements for the target system. You will need a valid license for deployment initiation. |
| **SAP S/4HANA 2021 Initial Shipment Stack for Productive Deployments**   | [Deploy System](https://cal.sap.com/catalog#/products) |
|This solution comes as a standard S/4HANA system installation including High Availability capabilities to ensure higher system uptime for productive usage. The system parameters can be customized during initial provisioning according to the requirements for the target system. |
 
---

_Within a few hours, a healthy SAP S/4 appliance is deployed in Azure._

If you bought an SAP CAL subscription, SAP fully supports deployments through SAP CAL on Azure. The support queue is BC-VCM-CAL.




