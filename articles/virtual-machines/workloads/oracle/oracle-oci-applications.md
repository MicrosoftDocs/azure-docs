---
title: Architectures to deploy Oracle apps on Azure and OCI | Microsoft Docs
description: Application architectures to deploy Oracle apps including E-Business Suite and JD Edwards EnterpriseOne on Microsoft Azure with databases in Oracle Cloud Infrastructure (OCI).
services: virtual-machines-linux
documentationcenter: ''
author: romitgirdhar
manager: jeconnoc
tags: 

ms.assetid: 
ms.service: virtual-machines
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 07/09/2019
ms.author: rogirdh
ms.custom: 
---
# Architectures to deploy Oracle applications that connect Azure and OCI

Microsoft and Oracle have worked together to enable customers to deploy Oracle applications such as Oracle E-Business Suite, JD Edwards EnterpriseOne, PeopleSoft, and Retail Merchandising Suite (RMS) in the cloud. With the introduction of the private network inter-connectivity between Microsoft Azure and Oracle Cloud Infrastructure (OCI), Oracle applications can now be deployed on Azure with their back-end databases in Azure or OCI. Oracle applications can also be integrated with Azure Active Directory, allowing you to set up single sign-on so that users can sign into the Oracle application using their Azure AD credentials.

OCI offers multiple Oracle database options for Oracle applications, including DBaaS, Exadata Cloud Service, Oracle RAC, and Infrastructure-as-a-Service (IaaS). Currently, Autonomous Database is not a supported back-end for Oracle applications.

There are [multiple options](oracle-overview.md) for deploying Oracle applications in Azure, including in a high availability and secure manner. Azure also offers [Oracle database VM images](oracle-vm-solutions.md) that you can deploy if you choose to run your Oracle applications entirely on Azure.

The following sections outline architecture recommendations by both Microsoft and Oracle to deploy Oracle E-Business Suite and JD Edwards EnterpriseOne in a cross-cloud configuration. Microsoft and Oracle have tested these applications in the cross-cloud setup and confirmed that the performance meets standards set by Oracle for these applications.

## Architecture considerations

Oracle applications are made up of multiple services, which can be hosted on the same or multiple virtual machines in Azure and OCI. 

Application instances can be set up with private or public endpoints. Microsoft and Oracle recommend setting up a *bastion host VM* with a public IP address in a separate subnet for management of the application. Then, assign only private IP addresses to the other machines, including the database tier. 

When setting up an application in the cross-cloud architecture, planning is required to ensure that the IP address space in the Azure virtual network does not overlap the private IP address space in the OCI virtual cloud network. A bastion host may also be deployed in the virtual cloud network in OCI to manage the database tier.

For added security, setup Network Security Groups (NSG) at a Subnet level to ensure only traffic on specific ports and IP addresses is permitted (For instance, any machines in the middle tier should only receive traffic from within the VNET. No external traffic must reach the middle tier machines directly).

For High availability, you can setup redundant instances of the different servers in the same availability set or different availability zones. Availability Zones allow you to achieve a 99.99% uptime SLA, while availability sets allow you to achieve a 99.95% uptime SLA in-region. Sample architecture diagrams shown here are deployed across two Availability Zones.

When deploying the application on the cross-cloud inter-connect, if you have an existing ExpressRoute circuit connecting your Azure environment to on-premises, you may re-use the VNET Gateway that connects your Azure VNET to your on-premises network. However, you will need a separate ExpressRoute circuit for the inter-connect to OCI than the one connecting to your on-premises network.

## E-Business Suite

Oracle E-Business Suite (EBS) is a suite of applications including Supply Chain Management (SCM) and Customer Relationship Management (CRM). To take advantage of OCI’s managed database portfolio, EBS can be deployed using the cross-cloud interconnect between Microsoft Azure and OCI. In this configuration, the presentation and application tiers run in Azure and the database tier in OCI. See the following architecture diagram:

![EBS application Cross-Cloud architecture in Azure and OCI](media/oracle-oci-applications/ebs-arch-cross-cloud.png)

In the sample architecture diagram above, the Virtual Network (VNET) in Azure is connected to Virtual Cloud Network (VCN) in OCI using the cross-cloud inter-connect. The Application tier is setup in Azure, whereas the database is setup in OCI. It is recommended that each component be deployed to its own subnet with NSGs to allow traffic from only specific subnets on specific ports.

The architecture can also be adapted for deployment entirely on Azure with highly available Oracle databases configured using Oracle Data Guard in two availability zones in a region. The following is an example of this architectural pattern:

![E-Business Suite Azure-Only Architecture](media/oracle-oci-applications/ebs-arch-azure.png)

The following is a description of the different components:

- **Bastion host** - The bastion host is an optional component that you can use as a jump server to access the application and database instances. The bastion host VM can have a public IP address assigned to it, although the recommendation is to set up an ExpressRoute connection or site-to-site VPN with your on-premises network for secure access. Additionally, only SSH (port 22, Linux) or RDP (port 3389, Windows Server) should be opened for incoming traffic. For high availability, deploy a bastion host in two availability zones or in a single availability set.

You may also enable ssh-agent forwarding on your VMs, which allows you to access other VMs in the VNET by forwarding the credentials from your bastion host or you can use SSH tunneling to access other instances.

Here's an example of agent forwarding:

`ssh -A -t user@BASTION_SERVER_IP ssh -A root@TARGET_SERVER_IP`

This connects to the bastion and then immediately runs ssh again, so you get a terminal on the target instance. You may need to specify a user other than root on the target instance if your cluster is configured differently. The -A argument forwards the agent connection so your private key on your local machine is used automatically. Note that agent forwarding is a chain, so the second ssh command also includes -A so that any subsequent SSH connections initiated from the target instance also use your local private key.

- **Application tier** - The application tier is isolated in its own subnet. There are multiple virtual machines set up for fault tolerance and easy patch management. These VMs can be backed by shared storage, which is offered by Azure NetApp Files (ANF) and Ultra SSDs. This allows for easier deployment of patches without downtime. The machines in the application tier should be fronted by an internal load balancer so that requests to the EBS application tier are processed even if one machine in the tier is offline due to a fault.
- **Load balancer** - Azure Load Balancer allows you to distribute traffic across multiple instances of your workload to ensure high availability. In this case, a public load balancer is setup as users are allowed to access the EBS application over the web. The load balancer distributes the load to both the machines in the middle tier. For added security, you may limit the traffic to only users accessing the system from your corporate network using Site-to-Site VPN or Express Route and Network Security Group (NSG).
- **Database tier** - This tier hosts the Oracle database and is separated into its own subnet. It is recommended to add network security groups that only permit traffic from the application tier to the database tier on the Oracle-specific database port 1521.

  Microsoft and Oracle recommend a high availability setup. High availability can be achieved by  setting up two Oracle databases in two availability zones with Oracle Data Guard, or using Oracle Database Exadata Cloud Service in OCI. When using Oracle Database Exadata Cloud Service, your database is deployed in two subnets.

- **Identity tier** - The Identity tier contains the EBS Asserter VM. The EBS Asserter is a software that allowd you to synchronize identities from Oracle Identity Cloud Service (IDCS) and Azure AD. The EBS Asserter is neededs as EBS does not support SSO protocols like SAML 2.0 or OpenID Connect. The EBS Asserter consumes the OpenID connect token (generated by IDCS), validates it, and then creates a session for the user in EBS. While this architecture discusses IDCS integration in detail, Azure AD unified access and SSO also can be enabled with Oracle Access Manager with Oracle Internet Directory or Oracle Unified Directory as well. Please see the whitepapers on [Deploying Oracle EBS with IDCS Integration](https://cloud.oracle.com/iaas/whitepapers/deploy_ebusiness_suite_across_oci_azure_sso_idcs.pdf) or [Deploying Oracle EBS with OAM Integration](https://cloud.oracle.com/iaas/whitepapers/deploy_ebusiness_suite_across_oci_azure_sso_oam.pdf) for more information.
It is recommended that you deploy redundant servers of the EBS asserter across multiple Availability Zones with a load balancer in front of it for high availability.

Once your infrastructure is setup, E-Business Suite can be installed by following the installation guide provided by Oracle.

## JD Edwards EnterpriseOne

Oracle's JD Edwards EnterpriseOne is an integrated applications suite of comprehensive enterprise resource planning software. It is a multi-tiered application that can be set up with either an Oracle or SQL Server database back-end. This section discusses details on deploying JD Edwards EnterpriseOne with an Oracle database back-end in OCI.

In the following recommended architecture, the administration, presentation, and middle tiers are deployed to the virtual network in Azure. The database is deployed in the virtual cloud network in OCI.

As with E-Business Suite, you can set up an optional bastion tier for secure administrative purposes. Use the bastion VM host as a jump server to access the application and database instances.

![JD Edwards EnterpriseOne Cross-Cloud architecture](media/oracle-oci-applications/jdedwards-arch-cross-cloud.png)

In the sample architecture diagram, the Virtual Network (VNET) in Azure is connected to Virtual Cloud Network (VCN) in OCI using the cross-cloud inter-connect. The application tier is setup in Azure, whereas the database is setup in OCI. It is recommended that each component be deployed to its own subnet with NSGs to allow traffic from only specific subnets on specific ports.

The architecture can also be adapted for deployment entirely on Azure with highly available Oracle databases configured using Oracle Data Guard in two availability zones in a region. The following is an example of this architectural pattern:

![JD Edwards EnterpriseOne Azure-Only Architecture](media/oracle-oci-applications/jdedwards-arch-azure.png)

The following is a description of the different components of the sample architecture:

- **Bastion Host Tier** - The bastion host is an optional component that you can use as a jump server to access the application and database instances. The bastion host VM can have a public IP address assigned to it, although the recommendation is to set up an ExpressRoute connection or site-to-site VPN with your on-premises network for secure access. Additionally, only SSH (port 22, Linux) or RDP (port 3389, Windows Server) should be opened for incoming traffic. For high availability, deploy a bastion host in two availability zones or in a single availability set.

  You may also enable SSH agent forwarding on your VMs, which allows you to access other VMs in the VNET by forwarding the credentials from your bastion host. Or, you can use SSH tunneling to access other instances.

   Here's an example of agent forwarding:

   ```bash
   ssh -A -t user@BASTION_SERVER_IP ssh -A root@TARGET_SERVER_IP
   ```

   This connects to the bastion and then immediately runs SSH again, so you get a terminal on the target instance. You may need to specify a user other than root on the target instance if your cluster is configured differently. The `-A` argument forwards the agent connection so your private key on your local machine is used automatically. Note that agent forwarding is a chain, so the second `ssh` command also includes `-A` so that any subsequent SSH connections initiated from the target instance also use your local private key.

- **Administrative Tier** - This tier, as the name suggests. is used for administrative tasks. You can carve out a separate subnet for the administrative tier. The services and servers in this tier are primarily used for installation and administration of the application. Hence, single instances of these servers are sufficient. Redundant instances are not required for the high availability of your application.

  The components of this tier are as follows:
    
    - _Provisioning server_: This server is used for end-to-end deployment of the different components of the application. It communicates with all the instances in the other tiers, including the instances in the database tier, over port 22. It hosts the Server Manager Console for JD Edwards EnterpriseOne.
    - _Deployment server_: This server is primarily required for the installation of JD Edwards EnterpriseOne. During the installation process, this server acts as the central repository fpr required files and installation packages. The software is distributed or deployed to all other servers and clients from this server.
    - _Development client_: This server contains components that run in a web browser as well as native applications.

- **Presentation Tier** - This tier contains various components such as Application Interface Services (AIS), Application Development Framework (ADF) and Java Application Servers (JAS). The servers in this tier communicate with the servers in the middle tier. They are fronted by a load balancer that routes traffic to the necessary server based on the port number and URL that the traffic is received on. It is recommended that you deploy multiple instances of each server type for high availability.
The following are the components in this tier:
    
    - _Application Interface Services (AIS)_: Application Interface Service server provides the communication interface between JD Edwards EnterpriseOne mobile enterprise applications and JD Edwards EnterpriseOne.
    - _Java Application Server (JAS)_: The Java Application Server receives requests from the load balancer and passes it to the middle tier to execute complicated tasks. JAS has the ability to execute simple business logic.
    - _BI Publisher Server (BIP)_: This is the reporting server. It presents reports based on the data collected by the JD Edwards EnterpriseOne application. You can design and control how the report presents the data based on different templates.
    - _Business Services Server (BSS)_: Business Services enables information exchange and interoperability with other Oracle applications.
    - _Real-Time Events Server (RTE)_: The RTE Server allows you to setup notifications to external systems about transactions occuring in the JDE EnterpriseOne system. It uses a subscriber model and allows third-party systems to subscribe to events. To load balance requests to both the Real-Time Events servers, ensure that the servers are in a cluster.
    - _Application Development Framework (ADF) Server_: The Application Development Framework server is used to run JD Edwards EnterpriseOne applications developed with Oracle ADF. This is deployed on an Oracle Weblogic server with ADF runtime.

- **Middle Tier** - The middle tier contains logic server and batch server. In this case, both logic server and batch server are installed on the same virtual machine. However, for production scenarios, it is recommended that you deploy logic server and batch server on separate servers. Multiple Servers are deployed in the middle tier across two availability zones for higher availability. An Azure Load Balancer should be created and these servers should be placed in the backend pool to ensure that both servers are active and processing requests.

The servers in the middle tier receives requests from the servers and the public load balancer in the presentation tier only. NSG rules must be setup to deny traffic from any other address but the presentation tier subnet and the load balancer. An NSG rule can also be setup to allow traffic on port 22 from the bastion host for management purposes. You may be able to use the public load balancer to load balancer requests between the VMs in the middle tier.

There are two components of middle tier. They are as follows:

- _Logic server_: These servers contain the business logic or business functions.
- _Batch server_: These servers are used for batch processing

- **Database Tier** - The Database tier contains the database instances. The database can be either an Oracle DB, Oracle RAC or Oracle Exadata Database system. If using Oracle DB, the database can be deployed on Azure using the marketplace image or you can bring your own image and deploy it in IaaS mode. Alternatively, you may use the inter-connect between Azure and OCI to deploy the Oracle DB in a PaaS model on OCI. For Oracle RAC, you may deploy Oracle RAC on Azure CloudSimple in IaaS model or in OCI in PaaS model. It is recommended that you use a 2-node RAC system. Finally, for Exadata systems, use the OCI inter-connect and deploy the Exadata system in OCI. The diagram above shows an Exadata system deployed in OCI across two subnets.
For production scenarios, deploy multiple instances of the database across two availability zones (if deploying in Azure) / Availability domains (in OCI). Use Oracle Active Data Guard to keep the primary and stand-by databases in-sync.
The database tier only receives requests from the middle tier. It is recommended that you setup NSG (security list if deploying the database in OCI) to only allow requests on port 1521 from the middle tier and port 22 from the bastion server for administrative reasons.

For databases deployed in OCI, a separate VCN must be setup and must with a Dynamic Routing Gateway (DRG) that is connected to your FastConnect circuit.

- **Identity Tier** - The Microsoft-Oracle partnership enables you to setup a unified identity across Azure, OCI and your Oracle application. For JD Edwards EnterpriseOne application suite, an instance of the Oracle HTTP Server (OHS) is needed to setup a Single Sign-On (SSO) between Azure AD and Oracle IDCS.

Oracle HTTP Server (OHS) acts as a reverse proxy to the application tier, which means that all the requests to the end applications go through Oracle HTTP Server. Oracle Access Manager WebGate is an Oracle HTTP Server web server plugin that intercepts every request going to the end application. If a resource being accessed is protected (requires an authenticated session), the WebGate initiates OpenID Connect (OIDC) authentication flow with Identity Cloud Service through the user’s browser. For more information about the flows supported by the OpenID Connect WebGate, see the [Oracle Access Manager documentation](https://docs.oracle.com/en/middleware/idm/access-manager/12.2.1.3/aiaag/integrating-webgate-oidc-server.html).

With this setup, a user already logged in to Azure Active Directory (Azure AD) can navigate to JD Edwards EnterpriseOne application without logging in again, through Oracle Identity Cloud Service. Customers that deploy this solution gain the benefits of SSO, including a single set of credentials, an improved login experience, improved security, and reduced help-desk cost.

Refer to the [whitepaper on setting up SSO with Azure AD for Peoplesoft & JD Edwards EnterpriseOne](https://cloud.oracle.com/iaas/whitepapers/deploy_peoplesoft_jdedwards_across_oci_azure.pdf) to learn more about setting up SSO for JD Edwards EnterpriseOne application with Azure AD.

//TODO: check if you can SSH from a VM in Azure to a VM in OCI. If so, no bastion server is needed in OCI.

## Peoplesoft

Oracle's Peoplesoft application suite contains software for human resource and finance software. The application suite is multi-tiered and applications include human resource management systems (HRMS), customer relationship management (CRM), financials and supply chain management (FSCM) and enterprise performance management (EPM).

It is recommended that each tier of the software suite be deployed in its own subnet. An Oracle DB or Microsoft SQL Server is required as the backend database for the application. This section discusses details on deploying Peoplesoft with an Oracle database back-end.

The following is a canonical architecture for deploying Peoplesoft application on cross-cloud Architecture.

![Peoplesoft Cross-cloud Architecture](media/oracle-oci-applications/peoplesoft-arch-cross-cloud.png)

In the sample architecture diagram above, the Virtual Network (VNET) in Azure is connected to Virtual Cloud Network (VCN) in OCI using the cross-cloud inter-connect. The Application tier is setup in Azure, whereas the database is setup in OCI. It is recommended that each component be deployed to its own subnet with NSGs to allow traffic from only specific subnets on specific ports.

The architecture can also be adapted for deployment entirely on Azure with highly available Oracle databases configured using Oracle Data Guard in two availability zones in a region. The following is an example of this architectural pattern:

![Peoplesoft Azure-Only Architecture](media/oracle-oci-applications/peoplesoft-arch-azure.png)

The following is a description of the different components of the sample architecture:

- **Bastion Host Tier** - The bastion host is an optional component that you can use as a jump server to access the application and database instances. The bastion host VM can have a public IP address assigned to it, although the recommendation is to set up an ExpressRoute connection or site-to-site VPN with your on-premises network for secure access. Additionally, only SSH (port 22, Linux) or RDP (port 3389, Windows Server) should be opened for incoming traffic. For high availability, deploy a bastion host in two availability zones or in a single availability set.

You may also enable ssh-agent forwarding on your VMs, which allows you to access other VMs in the VNET by forwarding the credentials from your bastion host or you can use SSH tunneling to access other instances.

Here's an example of agent forwarding:

`ssh -A -t user@BASTION_SERVER_IP ssh -A root@TARGET_SERVER_IP`

This connects to the bastion and then immediately runs ssh again, so you get a terminal on the target instance. You may need to specify a user other than root on the target instance if your cluster is configured differently. The -A argument forwards the agent connection so your private key on your local machine is used automatically. Note that agent forwarding is a chain, so the second ssh command also includes -A so that any subsequent SSH connections initiated from the target instance also use your local private key.

- **Application tier**: The application tier contains instances of the Peoplesoft application servers, Peoplesoft web servers, elastic search and Peoplesoft Process Scheduler. An Azure Load Balancer is setup to accept requests from users which are routed to the appropriate server in the application tier.

For high availability, consider setting up redundant instances of each server in the application tier across different availability zones. The Azure load balancer can be setup with multiple back-end pools to direct each request to the right server.

- **PeopleTools Client**: The PeopleTools client is used to perform administration activities, such as development, migration and upgrade. As the PeopleTools client is not required for achieving high availability of your application, redundant servers of PeopleTools Client is not needed.

- **Database tier**: The Database tier contains the database instances. The database can be either an Oracle DB, Oracle RAC or Oracle Exadata Database system. If using Oracle DB, the database can be deployed on Azure using the marketplace image or you can bring your own image and deploy it in IaaS mode. Alternatively, you may use the inter-connect between Azure and OCI to deploy the Oracle DB in a PaaS model on OCI. For Oracle RAC, you may deploy Oracle RAC on Azure CloudSimple in IaaS model or in OCI in PaaS model. It is recommended that you use a 2-node RAC system. Finally, for Exadata systems, use the OCI inter-connect and deploy the Exadata system in OCI. The diagram above shows an Exadata system deployed in OCI across two subnets.
For production scenarios, deploy multiple instances of the database across two availability zones (if deploying in Azure) / Availability domains (in OCI). Use Oracle Active Data Guard to keep the primary and stand-by databases in-sync.
The database tier only receives requests from the middle tier. It is recommended that you setup NSG (security list if deploying the database in OCI) to only allow requests on port 1521 from the middle tier and port 22 from the bastion server for administrative reasons.

For databases deployed in OCI, a separate VCN must be setup and must with a Dynamic Routing Gateway (DRG) that is connected to your FastConnect circuit.

- **Identity Tier** - The Microsoft-Oracle partnership enables you to setup a unified identity across Azure, OCI and your Oracle application. For the Peoplesoft application suite, an instance of the Oracle HTTP Server (OHS) is needed to setup a Single Sign-On (SSO) between Azure AD and Oracle IDCS.

Oracle HTTP Server (OHS) acts as a reverse proxy to the application tier, which means that all the requests to the end applications go through Oracle HTTP Server. Oracle Access Manager WebGate is an Oracle HTTP Server web server plugin that intercepts every request going to the end application. If a resource being accessed is protected (requires an authenticated session), the WebGate initiates OpenID Connect (OIDC) authentication flow with Identity Cloud Service through the user’s browser. For more information about the flows supported by the OpenID Connect WebGate, see the [Oracle Access Manager documentation](https://docs.oracle.com/en/middleware/idm/access-manager/12.2.1.3/aiaag/integrating-webgate-oidc-server.html).

With this setup, a user already logged in to Azure Active Directory (Azure AD) can navigate to PeopleSoft application without logging in again, through Oracle Identity Cloud Service. Customers that deploy this solution gain the benefits of SSO, including a single set of credentials, an improved login experience, improved security, and reduced help-desk cost.

Refer to the [whitepaper on setting up SSO with Azure AD for Peoplesoft & JD Edwards EnterpriseOne](https://cloud.oracle.com/iaas/whitepapers/deploy_peoplesoft_jdedwards_across_oci_azure.pdf) to learn more about setting up SSO for Peoplesoft application with Azure AD.

//TODO: check if you can SSH from a VM in Azure to a VM in OCI. If so, no bastion server is needed in OCI.

## Next steps

Use [Terraform deployment templates](https://github.com/microsoft/azure-oracle) to set up Oracle apps in Azure and establish cross-cloud connectivity with OCI.

For more information and whitepapers about OCI, see the [Oracle Cloud](https://docs.cloud.oracle.com/iaas/Content/home.htm) documentation.
