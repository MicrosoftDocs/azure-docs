---
title: Overview - Oracle Database@Azure 
description: Learn about Oracle Database@Azure.
author: jjaygbay1
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: article
ms.date: 12/6/2023
ms.custom: engagement-fy23
ms.author: jacobjaygbay
---


# Overview - Oracle Database@Azure 

Oracle Database@Azure is an Oracle operated and managed service running on Exadata infrastructure physically located in Azure's data centers. This proximity ensures low latency from your application tier to your mission critical Oracle databases and provides you with the ability to innovate with our Azure services like Azure Open AI, Fabric, and others. 

You can run your Exadata Database service in Azure with the feature and pricing parities as Exadata Cloud Service in the Oracle Cloud Infrastructure (OCI). OCI control plane is extended to Azure Datacenters via a secure network for service management including software patching, infrastructure updates, and other operations. While Oracle Database@Azure requires customers to have an OCI tenancy, most service activities take place in the Azure environment. 

You can subscribe to this service via Azure Marketplace. With native Azure integration, you can provision the Oracle databases within your Azure Virtual Network for a secure connectivity to your application tier and rest of Azure services. The service uses the Azure tenancy's identity management and authorization, which can be either the Azure native identity service or a federated identity provider.  

With Azure monitor integration, you can monitor database metrics, audit logs, events, logging data, and telemetry natively in Azure and build custom dashboards per your organizational needs. 

## Oracle Database@Azure interfaces 

You can provision and manage your Oracle Database@Azure infrastructure (Exadata infrastructure and VM cluster) using the Azure portal  RestAPIs, SDKs and Terraform.  

Oracle Container Databases (CDB) and Oracle Pluggable Databases (PDB) provisioning and management tasks are completed using the OCI console. 

Database and application developers can interact, manage, and monitor their Oracle databases using familiar Oracle tools like Oracle SQL developer, Oracle Enterprise manage, DataGuard and Golden Gate 

## Purchasing Oracle Database@Azure 

To purchase the Oracle Database@Azure offer, contact your Microsoft representative, the [Oracle sales team](https://www.oracle.com/corporate/contact/), or your Oracle sales representative. The Oracle Sales team creates a private offer in the Azure Marketplace to set terms and offer custom pricing. 

Current Azure customers can use a Microsoft Azure Consumption Commitment (MACC) to pay for Oracle Database@Azure. Existing Oracle Database software customers can use the Bring Your Own License (BYOL) option or Unlimited License Agreements (ULAs). Billing and payment for the service is done through Azure. On your regular Microsoft Azure bills, you see charges for your Oracle Database@Azure service alongside charges for your other Azure services. 

After an offer is created for your organization, you can accept the offer and complete the purchase in the Azure portal's Marketplace service. Billing and payment for the service is done through Azure. 

## Available regions

Oracle Database@Azure is available in the locations listed on this page. Oracle Database@Azure infrastructure resources must be provisioned in these Azure regions. The corresponding  regions listed are the regions used by database administrators for certain container database (CDB) and Pluggable database (PDB) management and maintenance operations.

|Azure region|
|------------|
|East US (Virginia)|

## Next steps
 
- [Onboarding with Oracle Database@Azure](onboarding-oracle-database.md)
- [Provision and manage Oracle Database@Azure](provision-oracle-database.md)
- [Oracle Database@Azure support information](oracle-database-support.md)
- [Solution design for Oracle Database@Azure](oracle-database-solution-design.md)