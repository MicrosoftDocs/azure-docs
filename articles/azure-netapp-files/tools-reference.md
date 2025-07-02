---
title: Azure NetApp Files tools
description: Learn about the tools available to you to maximize your experience and savings with Azure NetApp Files.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 05/08/2025
ms.author: anfdocs
# Customer intent: "As a cloud architect, I want to utilize estimation and monitoring tools for Azure NetApp Files, so that I can optimize costs and performance while ensuring efficient management of my storage deployment."
---

# Azure NetApp Files tools 

Azure NetApp Files offers [multiple tools](https://azure.github.io/azure-netapp-files/) to estimate costs, understand features and availability, and monitor your Azure NetApp Files deployment.

* [Azure NetApp Files effective price estimator](https://azure.github.io/azure-netapp-files/effective-calc/)

    This tool is designed to estimate effective price based on the compound savings when enabling [Azure NetApp Files storage with cool access](cool-access-introduction.md), [Azure NetApp Files reserved capacity](reservations.md), [Azure NetApp Files snapshots](snapshots-introduction.md), and the [Azure NetApp Files Flexible service level](azure-netapp-files-service-levels.md#Flexible). Azure NetApp Files delivers advanced storage cost savings by leveraging automated data tiering, space-efficient snapshots, reserved capacity pricing based on Azure reservations, and the Flexible service level allowing you to decouple storage capacity and throughput. These features can work together or independently to significantly improve the effective price of Azure NetApp Files.
    
* [**Azure NetApp Files Performance Calculator**](https://azure.github.io/azure-netapp-files/calc/)

    The Azure NetApp Files Performance Calculator enables you to easily calculate the performance and estimated cost of a volume based on the size and service level or performance requirements. It also helps you estimate backup and replication costs.

* [**Azure NetApp Files datastore for Azure VMware Solution TCO Estimator**](https://azure.github.io/azure-netapp-files/avs-calc/)

    This tool assists you with sizing an Azure VMware Solution. In the Estimator, provide the details of your current VMware environment to learn how much you can save by using Azure NetApp Files datastores.

* [**SAP on Azure NetApp Files Sizing Estimator**](https://azure.github.io/azure-netapp-files/sap-calc/)

    This comprehensive tool estimates the infrastructure costs of an SAP HANA on Azure NetApp Files landscape. The estimate includes primary storage, backup, and replication costs.

* [**Azure NetApp Files storage with cool access cost savings estimator**](https://azure.github.io/azure-netapp-files/coolaccess-calc/)

    Azure NetApp Files storage with cool access enables you to transparently move infrequently accessed data to less expensive storage. This cost savings estimator helps you understand how much money you can save by enabling storage with cool access.

* [**Azure NetApp Files Region and Feature Map**](https://azure.github.io/azure-netapp-files/map/)
    
    Use this interactive map to understand which regions support Azure NetApp Files and its numerous features. 

* [**Azure NetApp Files on YouTube**](https://www.youtube.com/@azurenetappfiles)

    Learn about the latest features in Azure NetApp Files and watch detailed how-to videos on the Azure NetApp Files YouTube channel. 

* [**ANFCapacityManager**](https://github.com/ANFTechTeam/ANFCapacityManager)

    ANFCapacityManager is an Azure logic application that automatically creates metric alert rules in Azure Monitor to notify you when volumes are approaching their capacity. Optionally, it can increase the volumes' sizes automatically to keep your applications online.

* [**ANFHealthCheck**](https://github.com/seanluce/ANFHealthCheck)

    ANFHeathCheck is a PowerShell runbook that generates artful HTML reports of your entire Azure NetApp Files landscape. Optionally, it can automatically reduce over-sized volumes and capacity pools to reduce your TCO.

* [Azure Verified Module (AVM) Terraform Module for Azure NetApp Files](https://registry.terraform.io/modules/Azure/avm-res-netapp-netappaccount/azurerm/latest)

    Use the Azure Verified Module (AVM) if you would like to deploy Azure NetApp Files through infrastructure as code using Terraform.

* [Azure Verified Module (AVM) Bicep Module for Azure NetApp Files](https://github.com/Azure/bicep-registry-modules/tree/main/avm/res/net-app/net-app-account)

    Use the Azure Verified Module (AVM) if you would like to deploy Azure NetApp Files through infrastructure as code using Bicep.

* [Azure Monitoring Baseline Alerts for Azure NetApp Files](https://azure.github.io/azure-monitor-baseline-alerts/services/NetApp/netAppAccounts/)

    Use this tool to deploy alerts that should be configured in Azure NetApp Files as a baseline for monitoring.

* [Azure Proactive Resilience Library for Azure NetApp Files](https://azure.github.io/Azure-Proactive-Resiliency-Library-v2/azure-resources/NetApp/netAppAccounts/)

    Learn about recommendations related to resiliency for Azure NetApp Files.
