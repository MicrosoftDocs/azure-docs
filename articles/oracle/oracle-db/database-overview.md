---
title: Overview - Oracle Database@Azure 
description: Overview - Oracle Database@Azure.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: overview
ms.date: 10/01/2024
ms.custom: engagement-fy23
ms.author: jacobjaygbay
---


# Overview - Oracle Database@Azure

Oracle Database@Azure is an Oracle database service running on Oracle Cloud Infrastructure (OCI), colocated in Microsoft data centers. This ensures that the Oracle Database@Azure service has the fastest possible access to Azure resources and applications.

Oracle Database@Azure allows you to subscribe to the Oracle Database Service inside your Azure environment. All infrastructure for your Oracle Database Service is located in Azure's physical data centers, giving your critical database workloads the high-performance and low-latency they require. Like other Azure services, Oracle Database@Azure uses an Azure Virtual Network for networking, managed within the Azure environment. The service uses the Azure tenancy's identity management and authorization, which can be either the Azure native identity service or a federated identity provider. The service allows you to monitor database metrics, audit logs, events, logging data, and telemetry natively in Azure.

Oracle Database@Azure runs on infrastructure managed by Oracle's expert Cloud Infrastructure operations team. The operations team performs software patching, infrastructure updates, and other operations through a connection to OCI. While the service requires that customers have an OCI tenancy, most service activities take place in the Azure environment.

## Oracle Database@Azure interfaces

You can provision Oracle Database@Azure using the Azure portal and Azure APIs, SDKs, and Terraform. Management of Oracle database system infrastructure and VM cluster resources takes place in the Azure portal as well.

For Oracle Container Databases (CDB) and Oracle Pluggable Databases (PDB), some management tasks are completed using the OCI console.

Database and application developers work in the Azure portal or use Azure tools (Azure API, SDK, Terraform) to interact with Oracle Database@Azure databases.

## Purchase Oracle Database@Azure

To purchase Oracle Database@Azure, contact [Oracle's sales team](https://go.oracle.com/LP=138489) or your Oracle sales representative for a sale offer. Oracle Sales team creates an Azure Private Offer in the Azure Marketplace for your service. After an offer is made for your organization, you can accept the offer and complete the purchase in the Azure portal's Marketplace service. For more information on Azure private offers, see [Overview of the commercial marketplace and enterprise procurement](/marketplace/procurement-overview).

Billing and payment for the service is done through Azure. Payment for Oracle Database@Azure counts toward your Microsoft Azure Consumption Commitment (MACC). Existing Oracle Database software customers can use the Bring Your Own License (BYOL) option or Unlimited License Agreements (ULAs). On your regular Microsoft Azure invoices, you can see charges for Oracle Database@Azure alongside charges for your other Azure Marketplace services.


## Compliance

Oracle Database@Azure is an Oracle Cloud database service that runs Oracle Database workloads in a customer's Azure environment. Oracle Database@Azure offers various Oracle Database Services through customer’s Microsoft Azure environment. This service allows customers to monitor database metrics, audit logs, events, logging data, and telemetry natively in Azure. It runs on infrastructure managed by Oracle's Cloud Infrastructure operations team who performs software patching, infrastructure updates, and other operations through a connection to Oracle Cloud.  
All infrastructure for Oracle Database@Azure is co-located in Azure's physical data centers and uses Azure Virtual Network for networking, managed within the Azure environment. Federated identity and access management for Oracle Database@Azure is provided by Microsoft Entra ID.

For detailed information on the compliance certifications please visit [Microsoft Services Trust Portal](https://servicetrust.microsoft.com/)  and [Oracle compliance website](https://docs.oracle.com/en-us/iaas/Content/multicloud/compliance.htm). If you have further questions about OracleDB@Azure compliance please reach out to your account team and/or get information through [Oracle and Microsoft support for Oracle Database@Azure](https://docs.oracle.com/en-us/iaas/Content/multicloud/oaahelp.htm).

## Oracle Support scope and contact information 

Oracle Support is your first line of support for all Oracle Database@Azure issues. Oracle Support can help you with the following types of Oracle Database@Azure issues:

- Database connection issues (Oracle TNS)
- Oracle Database performance issues
- Oracle Database error resolution
- Networking issues related to communications with the OCI tenancy associated with the service
- Quota (limits) increases to receive more capacity
- Scaling to add more compute and storage capacity to Oracle Database@Azure
- New generation hardware upgrades
- Billing issues related to Oracle Database@Azure

If you contact Oracle Support, be sure to tell your Oracle Support agent that your issue is related to Oracle Database@Azure.  Support requests for this service are handled by a  support team that specializes in these deployments. A member of this specialized team contacts you directly.

1. Call **1-800-223-1711.** If you're outside of the United States, visit [Oracle Support Contacts Global Directory](https://www.oracle.com/support/contact.html) to find contact information for your country or region.
2. Choose option "2" to open a new Service Request (SR).
3. Choose option "4" for "unsure".
4. Enter "#" each time you're asked for your CSI number. At the third attempt, your call is directed to an Oracle Support agent.
5. Let the agent know that you have an issue with your multicloud system, and the name of the product (for example, or). An internal Service Request is opened on your behalf and a  support engineer contacts you directly.

You can also submit a question to the Oracle Database@Azure forum in Oracle's [Cloud Customer Connect](https://community.oracle.com/customerconnect/categories/oracle-cloud-infrastructure-and-platform) community. This option is available to all customers.

## Azure Support scope and contact information

Azure provides support for the following, collaborating with OCI as needed:

- Virtual networking issues including those involving network address translation (NAT), firewalls, DNS and traffic management, and delegated Azure subnets.
- Bastion and virtual machine (VM) issues including database host connection, software installation, latency, and host performance.
- VM metrics, database logs, database events.

See [Contact Microsoft Azure Support](https://support.microsoft.com/topic/contact-microsoft-azure-support-2315e669-8b1f-493b-5fb1-d88a8736ffe4) in the Azure documentation for information on Azure support. For SLA information about the service offering, please refer to the [Oracle PaaS and IaaS Public Cloud Services Pillar Document](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.oracle.com%2Fcontracts%2Fdocs%2Fpaas_iaas_pub_cld_srvs_pillar_4021422.pdf%3Fdownload%3Dfalse&data=05%7C02%7Cjacobjaygbay%40microsoft.com%7Cc226ce0d176442b3302608dc3ed3a6d0%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C638454325970975560%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C0%7C%7C%7C&sdata=VZvhVUJzmUCzI25kKlf9hKmsf5GlrMPsQujqjGNsJbk%3D&reserved=0)

## Next steps
- [Onboard with Oracle Database@Azure](onboard-oracle-database.md)
- [Provision and manage Oracle Database@Azure](provision-oracle-database.md)
- [Oracle Database@Azure support information](oracle-database-support.md)
- [Network planning for Oracle Database@Azure](oracle-database-network-plan.md)
- [Groups and roles for Oracle Database@Azure](oracle-database-groups-roles.md)
