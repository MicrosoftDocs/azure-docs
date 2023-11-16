---
title: Oracle Database on Azure - Overview
description: Learn about solutions that integrate Oracle Database on Azure as an Oracle managed service.
author: jjaygbay1
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: article
ms.date: 04/11/2023
ms.author: jacobjaygbay
---


# Oracle Database@Azure 

Oracle Database@Azure is an Oracle managed service available in your Azure environment. All systems running Oracle Database on Azure use hardware physically located in Azure's data centers. Placing the hardware in the datacenter ensures that the Oracle Database on Azure service has the fastest possible access to Azure resources and applications.

As an Azure customer, you subscribe to this service inside your Azure environment, as you do with other Azure services. Like other Azure native services, Oracle Database@Azure systems use an Azure Virtual Network (virtual network) for networking, managed within the Azure environment. The Oracle Database at Azure service uses the Azure tenancy's identity management and authorization, which can be either the Azure native identity service or a federated identity provider.

Oracle Database@Azure services run on systems managed by Oracle through a connection to  (OCI). This includes software patching, infrastructure updates, and other operations. While Oracle Database@Azure requires that customers have an OCI tenancy, most service activities take place in the Azure environment.

Use Oracle Database@Azure (OracleDB@Azure) to subscribe to the Oracle Database Service inside your Azure environment. All hardware infrastructure for your Oracle Database Service is located in Azure's physical data centers, giving your critical database workloads the high-performance and low-latency they require. Like other Azure native services, OracleDB@Azure systems use an Azure Virtual Network (virtual network) for networking, managed within the Azure environment. The OracleDB@Azure service uses the Azure tenancy's identity management and authorization, which can be either the Azure native identity service or a federated identity provider. The service allows you to monitor database metrics, audit logs, events, logging data, and telemetry natively in Azure.

These products run on Oracle hardware, and Oracle provides hardware management. For example, patching through a connection to Oracle Cloud (OCI). While the OracleDB@Azure service requires that customers have an OCI tenancy, most service activities take place in the Azure environment.

## Oracle Database on Azure interfaces 

You can provision Oracle Database@Azure using the Azure portal and Azure APIs, SDKs and Terraform. All nomenclature, creation flows, and wizard paths are Azure. Management of Oracle database system infrastructure and VM cluster resources takes place in the Azure portal as well.

You can provision OracleDB@Azure using standard Azure interfaces, including the Azure portal, the Azure API and SDK, and Terraform. Management of Exadata infrastructure and VM cluster resources takes place in the Azure portal as well.

For Oracle Container Databases (CDB) and Oracle Pluggable Databases (PDB), some management tasks are completed using the OCI console.

Database and application developers work in the Azure portal or use Azure tools (Azure API, SDK, Terraform) to interact with Oracle Database@Azure databases.

## Support information 
In this section, you find information about support for Oracle Database@Azure.

### Azure support scope and contact information 

Azure collaborates with OCI to provide support for the following:

-   Virtual networking issues including those involving network address translation (NAT), firewalls, DNS and traffic management, and delegated Azure subnets.
-   Bastion and virtual machine (VM) issues including database host connection, software installation, latency, and host performance.
-   VM metrics, database logs, database events

For information on Azure support, see [Contact Microsoft Azure Support](https://support.microsoft.com/topic/contact-microsoft-azure-support-2315e669-8b1f-493b-5fb1-d88a8736ffe4) in the Azure documentation.

### Oracle support scope and contact information 

If you can't find an answer to a question by searching the documentation, you can submit a question to the [Oracle database on Azure forum](mailto:OracleDB@Azure.com) in Oracle's Cloud Customer Connect community. This option is available to all customers.

For your Oracle database on Azure systems, Oracle Support can assist you with the following types of issues:

-   Database connection issues (Oracle TNS)
-   Oracle Database performance issues
-   Oracle Database error resolution
-   Networking issues related to communications with the OCI tenancy associated with the service
-   Quota (limits) increases to receive another capacity
-   Scaling to add more capacity (hardware) to existing OracleDB@Azure systems
-   New generation hardware upgrades
-   Billing issues related to the OracleDB@Azure service

If you're contacting Oracle Support, be sure to tell your Oracle Support agent that your issue is related to OracleDB@Azure, as support requests for this service are handled by a  support team that specializes with these deployments. A member of this team contacts you directly.

1.  Call **1-800-223-1711.** If you're outside of the United States, see [Oracle Support Contacts Global Directory](https://www.oracle.com/support/contact.html) to find contact information for your country or region.
2.  Choose option "2" to open a new Service Request (SR).
3.  Choose option "4" for "unsure".
4.  Enter "#" each time you're asked for your CSI number. At the third attempt, your call is directed to an Oracle Support agent.
5.  Let the agent know that you have an issue with your multicloud system, and the name of the product (for example,  or ). An internal Service Request is opened on your behalf and a  support engineer contacts you directly.

## Purchasing Oracle Database on Azure 

For small deployments (for example, an Oracle Base Database system), simply buy Oracle Database@Azure in the Azure Marketplace.

For larger commitments (for example, systems using dedicated Exadata infrastructure),

To purchase Oracle Database@Azure, contact [Oracle's sales team](https://www.oracle.com/corporate/contact/) or your Oracle sales representative for a sale offer. Oracle Sales team creates an Azure Private Offer in the Azure Marketplace to set terms and offer custom pricing.

Existing Azure customers can use a Microsoft Azure Consumption Commitment (MACC) to pay for Oracle Database@Azure. Existing Oracle Database Software customers can use the Bring Your Own License (BYOL) option or Unlimited License Agreements (ULAs). Billing and payment for the service is done through Azure. On your regular Microsoft Azure bills, you see charges for your Oracle Database@Azure service alongside charges for your other Azure services.

After an offer is created for your organization, you can accept the offer and complete the purchase in the Azure portal's Marketplace service. Billing and payment for the service is done through Azure.

## Next steps 