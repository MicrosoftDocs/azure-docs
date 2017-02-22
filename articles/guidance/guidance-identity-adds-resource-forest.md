---
title: Creating an Active Directory Domain Services (DS) resource forest in Azure | Microsoft Docs
description: How to create a trusted Active Directory domain in Azure.
services: guidance,vpn-gateway,expressroute,load-balancer,virtual-network,active-directory
documentationcenter: na
author: telmosampaio
manager: christb
editor: ''
tags: azure-resource-manager

ms.assetid: 67d86788-c22d-4394-beaf-b4acdf4e2e56
ms.service: guidance
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/28/2016
ms.author: telmos

---
# Creating an Active Directory Domain Services (AD DS) resource forest in Azure

[!INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes how to create an Active Directory domain in Azure that is separate from, but trusted by, domains in your on-premises forest.

> [!NOTE]
> Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.
> 
> 

Active Directory Domain Services (AD DS) is a distributed database service that stores identity information about users, devices, and other resources in a hierarchical structure. The top node in the hierarchical structure is known as a forest. A forest contains domains, and domains contain other types of objects.

You can use AD DS to create trust relationships between top level forest objects, in order to provide interoperability between domains. That is, logons in one domain can be trusted to provide access to resources in other domains.

This reference architecture shows how to create an AD DS forest in Azure with a one-way outgoing trust relationship with an on-premises domain. The forest in Azure contains a domain that does not exist on-premises, but because of the trust relationship, logons made against on-premises domains can be trusted for access to resources in the separate Azure domain.  

Typical uses for this architecture include maintaining security separation for objects and identities held in the cloud, and migrating individual domains from on-premises to the cloud.

## Architecture diagram

The following diagram highlights the important components in this architecture. 

> A Visio document that includes this architecture diagram is available for download from the [Microsoft download center][visio-download]. This diagram is on the "Identity - AADS (resource forest)" page.
> 
> 

![[0]][0] 

* **On-premises network**. The on-premises network contains its own Active Directory forest and domains.
* **Active Directory servers**. These are domain controllers implementing domain services running as VMs in the cloud. These servers host a forest containing one or more domains, separate from those located on-premises.
* **One-way trust relationship**. The example in the diagram shows a one-way trust from the domain in Azure to the on-premises domain. This relationship enables on-premises users to access resources in the domain in Azure, but not the other way around. It is possible to create a two-way trust if cloud users also require access to on-premises resources.
* **Active Directory subnet**. The AD DS servers are hosted in a separate subnet. Network security group (NSG) rules protect the AD DS servers and provide a firewall against traffic from unexpected sources.
* **Azure gateway**. The Azure gateway provides a connection between the on-premises network and the Azure VNet. This can be a [VPN connection][azure-vpn-gateway] or [Azure ExpressRoute][azure-expressroute]. For more information, see [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture].

## Recommendations

For specific recommendations on implementing Active Directory in Azure, see the following articles:

- [Extending Active Directory Domain Services (AD DS) to Azure][extending-ad-to-azure]. 
- [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines][ad-azure-guidelines].

### Trust

The on-premises domains are contained within a different forest from the domains in the cloud. To enable authentication of on-premises users in the cloud, the domains in Azure must trust the logon domain in the on-premises forest. Similarly, if the cloud provides a logon domain for external users, it may be necessary for the on-premises forest to trust the cloud domain.

You can establish trusts at the forest level by [creating forest trusts][creating-forest-trusts], or at the domain level by [creating external trusts][creating-external-trusts]. A forest level trust creates a relationship between all domains in two forests. An external domain level trust only creates a relationship between two specified domains. You should only create external domain level trusts between domains in different forests.

Trusts can be unidirectional (one-way) or bidirectional (two-way):

* A one-way trust enables users in one domain or forest (known as the *incoming* domain or forest) to access the resources held in another (the *outgoing* domain or forest).
* A two-way trust enables users in either domain or forest to access resources held in the other.

The following table summarizes trust configurations for some simple scenarios:

| Scenario | On-premises trust | Cloud trust |
| --- | --- | --- |
| On-premises users require access to resources in the cloud, but not vice versa |One-way, incoming |One-way, outgoing |
| Users in the cloud require access to resources located on-premises, but not vice versa |One-way, outgoing |One-way, incoming |
| Users in the cloud and on-premises both requires access to resources held in the cloud and on-premises |Two-way, incoming and outgoing |Two-way, incoming and outgoing |

## Scalability considerations

Active Directory is automatically scalable for domain controllers that are part of the same domain. Requests are distributed across all controllers within a domain. You can add another domain controller, and it synchronizes automatically with the domain. Do not configure a separate load balancer to direct traffic to controllers within the domain. Ensure that all domain controllers have sufficient memory and storage resources to handle the domain database. Make all domain controller VMs the same size.

## Availability considerations

Provision at least two domain controllers for each domain. This enables automatic replication between servers. Create an availability set for the VMs acting as Active Directory servers handling each domain. Put at least two servers in this availability set.

Also, consider designating one or more servers in each domain as [standby operations masters][standby-operations-masters] in case connectivity to a server acting as a flexible single master operation (FSMO) role fails.

## Manageability considerations

For information about management and monitoring considerations, see [Extending Active Directory to Azure][extending-ad-to-azure]. 
 
For additional information, see [Monitoring Active Directory][monitoring_ad]. You can install tools such as [Microsoft Systems Center][microsoft_systems_center] on a monitoring server in the management subnet to help perform these tasks.

## Security considerations

Forest level trusts are transitive. If you establish a forest level trust between an on-premises forest and a forest in the cloud, this trust is extended to other new domains created in either forest. If you use domains to provide separation for security purposes, consider creating trusts at the domain level only. Domain level trusts are non-transitive.

For Active Directory-specific security considerations, see the security considerations section in [Extending Active Directory to Azure][extending-ad-to-azure].

## Solution deployment

A solution is available on [Github][github] to deploy this reference architecture. You will need the latest version of the Azure CLI to run the Powershell script that deploys the solution. To deploy the reference architecture, follow these steps:

1. Download or clone the solution folder from [Github][github] to your local machine.

2. Open the Azure CLI and navigate to the local solution folder.

3. Run the following command:
   
    ```Powershell
    .\Deploy-ReferenceArchitecture.ps1 <subscription id> <location> <mode>
    ```
   
    Replace `<subscription id>` with your Azure subscription ID.
   
    For `<location>`, specify an Azure region, such as `eastus` or `westus`.
   
    The `<mode>` parameter controls the granularity of the deployment, and can be one of the following values:
   
   * `Onpremise`: deploys the simulated on-premises environment.
   * `Infrastructure`: deploys the VNet infrastructure and jump box in Azure.
   * `CreateVpn`: deploys the Azure virtual network gateway and connects it to the simulated on-premises network.
   * `AzureADDS`: deploys the VMs acting as Active Directory DS servers, deploys Active Directory to these VMs, and deploys the domain in Azure.
   * `WebTier`: deploys the web tier VMs and load balancer.
   * `Prepare`: deploys all of the preceding deployments. **This is the recommended option if If you do not have an existing on-premises network but you want to deploy the complete reference architecture described above for testing or evaluation.** 
   * `Workload`: deploys the business and data tier VMs and load balancers. Note that these VMs are not included in the `Prepare` deployment.

4. Wait for the deployment to complete. If you are deploying the `Prepare` deployment, it will take several hours.
     
5. If you are using the simulated on-premises configuration, configure the incoming trust relationship:
   
   1. Connect to the jump box (*ra-adtrust-mgmt-vm1* in the *ra-adtrust-security-rg* resource group). Log in as *testuser* with password *AweS0me@PW*.
   2. On the jump box open an RDP session on the first VM in the *contoso.com* domain (the on-premises domain). This VM has the IP address 192.168.0.4. The username is *contoso\testuser* with password *AweS0me@PW*.
   3. Download the [incoming-trust.ps1][incoming-trust] script and run it to create the incoming trust from the *treyresearch.com* domain.

6. If you are using your own on-premises infrastructure:
   
   1. Download the [incoming-trust.ps1][incoming-trust] script.
   2. Edit the script and replace the value of the `$TrustedDomainName` variable with the name of your own domain.
   3. Run the script.

7. From the jump-box, connect to the first VM in the *treyresearch.com* domain (the domain in the cloud). This VM has the IP address 10.0.4.4. The username is *treyresearch\testuser* with password *AweS0me@PW*.

8. Download the [outgoing-trust.ps1][outgoing-trust] script and run it to create the incoming trust from the *treyresearch.com* domain. If you are using your own on-premises machines, then edit the script first. Set the `$TrustedDomainName` variable to the name of your on-premises domain, and specify the IP addresses of the Active Directory DS servers for this domain in the `$TrustedDomainDnsIpAddresses` variable.

9. Wait a few minutes for the previous steps to complete, then connect to an on-premises VM and perform the steps outlined in the article [Verify a Trust][verify-a-trust] to determine whether the trust relationship between the *contoso.com* and *treyresearch.com* domains is correctly configured.

## Next steps

* Learn the best practices for [extending your on-premises AD DS domain to Azure][adds-extend-domain]
* Learn the best practices for [creating an AD FS infrastructure][adfs] in Azure.

<!-- links -->


[ad-azure-guidelines]: https://msdn.microsoft.com/library/azure/jj156090.aspx
[adds-extend-domain]: ./guidance-identity-adds-extend-domain.md
[adfs]: ./guidance-identity-adfs.md
[azure-expressroute]: https://azure.microsoft.com/documentation/articles/expressroute-introduction/
[azure-vpn-gateway]: https://azure.microsoft.com/documentation/articles/vpn-gateway-about-vpngateways/
[creating-external-trusts]: https://technet.microsoft.com/library/cc816837(v=ws.10).aspx
[creating-forest-trusts]: https://technet.microsoft.com/library/cc816810(v=ws.10).aspx
[extending-ad-to-azure]: ./guidance-identity-adds-extend-domain.md
[github]: https://github.com/mspnp/reference-architectures/tree/master/guidance-identity-adds-trust
[incoming-trust]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/extensions/incoming-trust.ps1
[implementing-a-secure-hybrid-network-architecture]: ./guidance-iaas-ra-secure-vnet-hybrid.md
[implementing-a-secure-hybrid-network-architecture-with-internet-access]: ./guidance-iaas-ra-secure-vnet-dmz.md
[microsoft_systems_center]: https://www.microsoft.com/server-cloud/products/system-center-2016/
[monitoring_ad]: https://msdn.microsoft.com/library/bb727046.aspx
[resource-manager-overview]: ../azure-resource-manager/resource-group-overview.md
[running-VMs-for-an-N-tier-architecture-on-Azure]: ./guidance-compute-n-tier-vm.md
[solution-script]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/Deploy-ReferenceArchitecture.ps1
[standby-operations-masters]: https://technet.microsoft.com/library/cc794737(v=ws.10).aspx
[visio-download]: http://download.microsoft.com/download/1/5/6/1569703C-0A82-4A9C-8334-F13D0DF2F472/RAs.vsdx
[outgoing-trust]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/extensions/outgoing-trust.ps1
[verify-a-trust]: https://technet.microsoft.com/library/cc753821.aspx
[0]: ./media/guidance-identity-aad-resource-forest/figure1.png "Secure hybrid network architecture with separate Active Directory domains"