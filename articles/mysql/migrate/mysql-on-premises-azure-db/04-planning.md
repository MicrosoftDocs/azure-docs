---
title: "Migrate MySQL on-premises to Azure Database for MySQL: Planning"
description: "An Azure landing zone is the target environment defined as the final resting place of a cloud migration project."
ms.service: mysql
ms.subservice: migration-guide
ms.topic: how-to
author: rothja
ms.author: jroth
ms.reviewer: maghan
ms.custom:
ms.date: 06/21/2021
---

# Migrate MySQL on-premises to Azure Database for MySQL: Planning

[!INCLUDE[applies-to-mysql-single-flexible-server](../../includes/applies-to-mysql-single-flexible-server.md)]

## Prerequisites

[Assessment](03-assessment.md)

## Landing zone

An [Azure Landing zone](/azure/cloud-adoption-framework/ready/landing-zone/) is the target environment defined as the final resting place of a cloud migration project. In most projects, the landing zone should be scripted via ARM templates for its initial setup. Finally, it should be customized with PowerShell or the Azure portal to fit the workloads needs.

Since WWI is based in San Francisco, all resources for the Azure landing zone were created in the `US West 2` region. The following resources were created to support the migration:

- [Azure Database for MySQL](../../quickstart-create-mysql-server-database-using-azure-portal.md)

- [Azure Database Migration Service (DMS)](../../../dms/quickstart-create-data-migration-service-portal.md)

- [Express Route](../../../expressroute/expressroute-introduction.md)

- [Azure Virtual Network](../../../virtual-network/quick-create-portal.md) with [hub and spoke design](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) with corresponding [virtual network peerings](../../../virtual-network/virtual-network-peering-overview.md) establish.

- [App Service](../../../app-service/overview.md)

- [Application Gateway](../../../load-balancer/quickstart-load-balancer-standard-internal-portal.md?tabs=option-1-create-internal-load-balancer-standard)

- [Private endpoints](../../../private-link/private-endpoint-overview.md) for the App Services and MySQL instance

> [!NOTE]
> As part of this guide, two ARM templates (one with private endpoints, one without) were provided in order to deploy a potential Azure landing zone for a MySQL migration project. The private endpoints ARM template provides a more secure and production like scenario. Additional manual Azure landing zone configuration may be necessary, depending on the requirements.

## Networking

Getting data from the source system to Azure Database for MySQL in a fast and optimal way is a vital component to consider in a migration project. Small unreliable connections may require administrators to restart the migration several times until a successful result is achieved. Restarting migrations because of network issues can lead to wasted effort.

Take the time to understand and evaluate the network connectivity between the source, tool, and destination environments. In some cases, it may be appropriate to upgrade the internet connectivity or configure an ExpressRoute connection from the on-premises environment to Azure. Once on-premises to Azure connectivity has been created, the next step is to validate that the selected migration tool can connect from the source to the destination.

The migration tool location determines the network connectivity requirements. As shown in the table below, the selected migration tool must connect to both the on-premises machine and to Azure. Azure should be configured to only accept network traffic from the migration tool location.

| Migration Tool | Type | Location | Inbound Network Requirements | Outbound Network Requirements |
|----------------|------|----------|------------------------------|-------------------------------|
| **Database Migration Service (DMS)** | Offline | Azure| Allow 3306 from external IP | A path to connect to the Azure MySQL database instance |
| **Import/Export (MySQL Workbench, mysqldump)** | Offline| On-premises | Allow 3306 from internal IP | A path to connect to the Azure MySQL database instance |
| **Import/Export (MySQL Workbench, mysqldump)** | Offline| Azure VM | Allow 3306 from external IP | A path to connect to the Azure MySQL database instance |
| **mydumper/myloader** | Offline | On-premises | Allow 3306 from internal IP | A path to connect to the Azure MySQL database instance |
| **mydumper/myloader** | Offline | Azure VM | Allow 3306 from external IP | A path to connect to the Azure MySQL database instance |
| **binlog**  | Offline | On-premises | Allow 3306 from external IP or private IP via Private endpoints | A path for each replication server to the master |

Other networking considerations include:

- DMS located in a VNET is assigned a [dynamic public IP](../../../dms/faq.yml) to the service. At creation time, you can place the service inside a virtual network that has connectivity via a [ExpressRoute](../../../expressroute/expressroute-introduction.md) or over [a site to site VPN](../../../vpn-gateway/tutorial-site-to-site-portal.md).

- When using an Azure Virtual Machine to run the migration tools, assign it a public IP address and then only allow it to connect to the on-premises MySQL instance.

- Outbound firewalls must ensure outbound connectivity to Azure Database for MySQL. The MySQL gateway IP addresses are available on the [Connectivity Architecture in Azure Database for MySQL](../../concepts-connectivity-architecture.md#azure-database-for-mysql-gateway-ip-addresses) page.

## SSL/TLS connectivity

In addition to the application implications of migrating to SSL-based communication, the SSL/TLS connection types are also something that needs to be considered. After creating the Azure Database for MySQL database, review the SSL settings, and read the [SSL/TLS connectivity in Azure Database for MySQL](../../concepts-ssl-connection-security.md) article to understand how the TLS settings can affect the security posture.

> [!Important]
> Pay attention to the disclaimer on the page. Enforcement of TLS version is not be enabled by default. Once TLS is enabled, the only way to disable it is to re-enable SSL.

## WWI scenario

WWI’s cloud team has created the necessary Azure landing zone resources in a specific resource group for the Azure Database for MySQL. To create the landing zone, WWI decided to script the setup and deployment using ARM templates. By using ARM templates, they can quickly tear down and resetup the environment, if needed.

As part of the ARM template, all connections between virtual networks are configured with peering in a hub and spoke architecture. The database and application are placed into separate virtual networks. An Azure App Gateway is placed in front of the app service to allow the app service to be isolated from the Internet. The Azure App Service connects to the Azure Database for MySQL using a private endpoint.

WWI originally wanted to test an online migration, but the required network setup for DMS to connect to their on-premises environment made this infeasible. WWI chose to do an offline migration instead. The MySQL Workbench tool was used to export the on-premises data and then was used to import the data into the Azure Database for MySQL instance.

## Planning checklist

- Prepare the Azure landing zone. Consider using ARM template deployment in case the environment must be torn down and rebuilt quickly.

- Verify the networking setup. Verification should include: connectivity, bandwidth, latency, and firewall configurations.

- Determine if you're going to use the online or offline data migration strategy.

- Decide on the SSL certificate strategy.


## Next steps

> [!div class="nextstepaction"]
> [Migration Methods](./05-migration-methods.md)
