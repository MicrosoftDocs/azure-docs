---
author: dlepow
ms.service: virtual-machines
ms.topic: include
ms.date: 06/01/2020
ms.author: danlep
---
### Database tier

The Database tier contains the database instances for the application. The database can be either an Oracle DB, Oracle RAC, or Oracle Exadata Database system. 

If the choice is to use Oracle DB, the database instance may be deployed on Azure via the Oracle DB images available on the Azure Marketplace. Alternatively, you may use the interconnect between Azure and OCI to deploy the Oracle DB in a PaaS model on OCI.

For Oracle RAC, you can use OCI in PaaS model. It is recommended that you use a two-node RAC system. While it is possible to deploy Oracle RAC on Azure CloudSimple in IaaS model, it is not a supported configuration by Oracle. Refer to [Oracle programs eligible for Authorized Cloud Environments](http://www.oracle.com/us/corporate/pricing/authorized-cloud-environments-3493562.pdf).

Finally, for Exadata systems, use the OCI interconnect and deploy the Exadata system in OCI. The preceding architecture diagram above shows an Exadata system deployed in OCI across two subnets.

For production scenarios, deploy multiple instances of the database across two availability zones (if deploying in Azure) or two availability domains (in OCI). Use Oracle Active Data Guard to synchronize the primary and standby databases.

The database tier only receives requests from the middle tier. It is recommended that you set up a network security group (security list if deploying the database in OCI) to only allow requests on port 1521 from the middle tier and port 22 from the bastion server for administrative reasons.

For databases deployed in OCI, a separate virtual cloud network must be set up with a dynamic routing gateway (DRG) that is connected to your FastConnect circuit.