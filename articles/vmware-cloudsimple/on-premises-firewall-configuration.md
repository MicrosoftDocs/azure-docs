---
title: Accessing Azure VMware Solutions (AVS) from on-premises 
description: Accessing your Azure VMware Solutions (AVS) from your on-premises network through a firewall
titleSuffix: Azure VMware Solutions (AVS)

author: sharaths-cs 
ms.author: dikamath 
ms.date: 08/08/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# Accessing your AVS Private Cloud environment and applications from on-premises

A connection can be set up from on-premises network to AVS using Azure ExpressRoute or Site-to-Site VPN. Access your AVS Private Cloud vCenter and any workloads you run on the AVS Private Cloud using the connection. You can control what ports are opened on the connection using a firewall in your on-premises network. This article discusses some of the typical applications port requirements. For any other applications, refer to the application documentation for port requirements.

## Ports required for accessing vCenter

To access your AVS Private Cloud vCenter and NSX-T manager, ports defined in the table below must be opened on the on-premises firewall. 

| Port       | Source                           | Destination                      | Purpose                                                                                                                |
|------------|----------------------------------|----------------------------------|------------------------------------------------------------------------------------------------------------------------|
| 53 (UDP)   | On-premises DNS servers          | AVS Private Cloud DNS servers        | Required for forwarding DNS lookup of *az.AVS.io* to AVS Private Cloud DNS servers from on-premises network.     |
| 53 (UDP)   | AVS Private Cloud DNS servers        | On-premises DNS servers          | Required for forwarding DNS look up of on-premises domain names from AVS Private Cloud vCenter to on-premises DNS servers. |
| 80 (TCP)   | On-premises network              | AVS Private Cloud management network | Required for redirecting vCenter URL from *http* to *https*.                                                         |
| 443 (TCP)  | On-premises network              | AVS Private Cloud management network | Required for accessing vCenter and NSX-T manager from on-premises network.                                           |
| 8000 (TCP) | On-premises network              | AVS Private Cloud management network | Required for vMotion of virtual machines from on-premises to AVS Private Cloud.                                          |
| 8000 (TCP) | AVS Private Cloud management network | On-premises network              | Required for vMotion of virtual machines from AVS Private Cloud to on-premises.                                          |

## Ports required for using on-premises active directory as an identity source

To configure on-premises active directory as an identity source on AVS Private Cloud vCenter, ports defined in the table must be opened. See [Use Azure AD as an identity provider for vCenter on AVS AVS Private Cloud](https://docs.azure.cloudsimple.com/azure-ad/) for configuration steps.

| Port         | Source                           | Destination                                         | Purpose                                                                                                                                          |
|--------------|----------------------------------|-----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| 53 (UDP)      | AVS Private Cloud DNS servers        | On-premises DNS servers                             | Required for forwarding DNS look up of on-premises active directory domain names from AVS Private Cloud vCenter to on-premises DNS servers.        |
| 389 (TCP/UDP) | AVS Private Cloud management network | On-premises active directory domain controllers     | Required for LDAP communication from AVS Private Cloud vCenter server to active directory domain controllers for user authentication.              |
| 636 (TCP)     | AVS Private Cloud management network | On-premises active directory domain controllers     | Required for secure LDAP (LDAPS) communication from AVS Private Cloud vCenter server to active directory domain controllers for user authentication. |
| 3268 (TCP)    | AVS Private Cloud management network | On-premises active directory global catalog servers | Required for LDAP communication in a multi-domain controller deployments.                                                                      |
| 3269 (TCP)    | AVS Private Cloud management network | On-premises active directory global catalog servers | Required for LDAPS communication in a multi-domain controller deployments.                                                                     |                                           |

## Common ports required for accessing workload virtual machines

Access workload virtual machines running on AVS Private Cloud requires ports to be opened on your on-premises firewall. Table below shows some of the common ports required and their purpose. For any application specific port requirements, refer to the application documentation.

| Port         | Source                         | Destination                          | Purpose                                                                              |
|--------------|--------------------------------|--------------------------------------|--------------------------------------------------------------------------------------|
| 22 (TCP)      | On-premises network            | AVS Private Cloud workload network       | Secure shell access to Linux virtual machines running on AVS Private Cloud.            |
| 3389 (TCP)    | On-premises network            | AVS Private Cloud workload network       | Remote desktop to windows virtual machines running on AVS Private Cloud.               |
| 80 (TCP)      | On-premises network            | AVS Private Cloud workload network       | Access any web servers deployed on virtual machines running on AVS Private Cloud.      |
| 443 (TCP)     | On-premises network            | AVS Private Cloud workload network       | Access any secure web servers deployed on virtual machines running on AVS Private Cloud. |
| 389 (TCP/UDP) | AVS Private Cloud workload network | On-premises active directory network | Join Windows workload virtual machines to on-premises active directory domain.     |
| 53 (UDP)      | AVS Private Cloud workload network | On-premises network                  | DNS service access for workload virtual machines to on-premises DNS servers.       |

## Next steps

* [Create and manage VLANs and Subnets](https://docs.azure.cloudsimple.com/create-vlan-subnet/)
* [Connect to on-premises network using Azure ExpressRoute](https://docs.azure.cloudsimple.com/on-premises-connection/)
* [Setup Site-to-Site VPN from on-premises](https://docs.azure.cloudsimple.com/vpn-gateway/)
