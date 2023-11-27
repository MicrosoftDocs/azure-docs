---
title: Overview - Oracle Database@Azure 
description: Learn about Oracle Database@Azure.
author: jjaygbay1
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: article
ms.date: 04/11/2023
ms.author: jacobjaygbay
---


# Overview - Oracle Database@Azure 

Oracle Database@Azure is an Oracle managed service available in your Azure environment. All systems running Oracle Database on Azure use hardware physically located in Azure's data centers. Placing the hardware in the datacenter ensures that the Oracle Database on Azure service has the fastest possible access to Azure resources and applications.

As an Azure customer, you subscribe to this service inside your Azure environment, as you do with other Azure services. Like other Azure native services, Oracle Database@Azure systems use an Azure Virtual Network (virtual network) for networking, managed within the Azure environment. The Oracle Database at Azure service uses the Azure tenancy's identity management and authorization, which can be either the Azure native identity service or a federated identity provider.

Oracle Database@Azure services run on systems managed by Oracle through a connection to  (OCI). This includes software patching, infrastructure updates, and other operations. While Oracle Database@Azure requires that customers have an OCI tenancy, most service activities take place in the Azure environment.

Use Oracle Database@Azure (OracleDB@Azure) to subscribe to the Oracle Database Service inside your Azure environment. All hardware infrastructure for your Oracle Database Service is located in Azure's physical data centers, giving your critical database workloads the high-performance and low-latency they require. Like other Azure native services, OracleDB@Azure systems use an Azure Virtual Network (virtual network) for networking, managed within the Azure environment. The OracleDB@Azure service uses the Azure tenancy's identity management and authorization, which can be either the Azure native identity service or a federated identity provider. The service allows you to monitor database metrics, audit logs, events, logging data, and telemetry natively in Azure.

These products run on Oracle hardware, and Oracle provides hardware management. For example, patching through a connection to Oracle Cloud (OCI). While the OracleDB@Azure service requires that customers have an OCI tenancy, most service activities take place in the Azure environment.

## Oracle Database@Azure interfaces 

You can provision Oracle Database@Azure using the Azure portal and Azure APIs, SDKs and Terraform. All nomenclature, creation flows, and wizard paths are Azure. Management of Oracle database system infrastructure and VM cluster resources takes place in the Azure portal as well.

You can provision Oracle Database@Azure using standard Azure interfaces, including the Azure portal, the Azure API and SDK, and Terraform. Management of Exadata infrastructure and VM cluster resources takes place in the Azure portal as well.

For Oracle Container Databases (CDB) and Oracle Pluggable Databases (PDB), some management tasks are completed using the OCI console.

Database and application developers work in the Azure portal or use Azure tools (Azure API, SDK, Terraform) to interact with Oracle Database@Azure databases.

## Purchasing Oracle Database@Azure 

For small deployments, like an Oracle Base Database system, you can simply buy Oracle Database@Azure in the Azure Marketplace. For purchase larger commitments, like the systems using dedicated Exadata infrastructure, contact the [Oracle sales team](https://www.oracle.com/corporate/contact/) or your Oracle sales representative for a sale offer. Oracle Sales team creates an Azure Private Offer in the Azure Marketplace to set terms and offer custom pricing.

Current Azure customers can use a Microsoft Azure Consumption Commitment (MACC) to pay for Oracle Database@Azure. Existing Oracle Database software customers can use the Bring Your Own License (BYOL) option or Unlimited License Agreements (ULAs). Billing and payment for the service is done through Azure. On your regular Microsoft Azure bills, you see charges for your Oracle Database@Azure service alongside charges for your other Azure services.

After an offer is created for your organization, you can accept the offer and complete the purchase in the Azure portal's Marketplace service. Billing and payment for the service is done through Azure.

## Available regions

Oracle Database@Azure is available in the locations listed on this page. Oracle Database@Azure infrastructure resources must be provisioned in these Azure regions. The corresponding  regions listed are the regions used by database administrators for certain container database (CDB) and pluggable database (PDB) management and maintenance operations.

|Azure region|
|------------|
|East US (Virginia)|

## Next steps 