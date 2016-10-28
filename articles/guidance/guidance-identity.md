<properties
   pageTitle="Managing identity in Azure | Microsoft Azure"
   description="Explains and compares the different methods available for managing identity in hybrid systems that span the on-premises/cloud boundary with Azure."
   services=""
   documentationCenter="na"
   authors="telmosampaio"
   manager="christb"
   editor=""
   tags=""/>
<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/27/2016"
   ms.author="telmosampaio"/>
   
# Extending on-premises identity to Azure

In most enterprise systems based on Windows, you will use Active Directory (AD) to provide identity management services to your applications. When you extend your network infrastructure to the cloud you have some important decisions to make concerning how to manage identity. Should you expand your on-premises domains to incorporate VMs in the cloud? Should you create new domains in the cloud? Should you implement your own forest in the cloud or use [Azure Active Directory][aad] (Azure AD)?

The patterns & practices group has created a set of reference architectures to address these scenarios. Each reference architecture demonstrates one approach to managing on-premises identities in Azure, and includes:
  		  
- Recommendations and best practices.
- Considerations for availability, security, scalability, and manageability.
- An Azure Resource Manager template that you can modify and deploy.

This article gives a summary of each reference architecture, and helps you to decide which solution will best meet your needs.

## Using Azure Active Directory

You can use Azure AD to create a domain in Azure and link it to an on-premises AD domain. Azure AD enables you to configure single sign-on for users running applications accessed through the cloud.

[![0]][0]

Azure AD is a straightforward way to implement a security domain in Azure. It is used by many Microsoft applications, such as Microsoft Office 365. 

Benefits:

- There is no need to maintain an Active Directory infrastructure in the cloud. Azure AD is entirely managed and maintained by Microsoft.

- Azure AD provides the same identity information that is available on-premises.

- Authentication can happen in Azure, reducing the need for external applications and users to contact the on-premises domain.

Considerations:

- Identity services are limited to users and groups. There is no ability to authenticate service and computer accounts.

- You must configure connectivity with your on-premises domain to keep the Azure AD directory synchronized. 

- You are responsible for publishing applications that users can access in the cloud through Azure AD.

For detailed information about this architecture, see [Implementing Azure Active Directory][implementing-aad].

## Using Active Directory in Azure joined to an on-premises forest

An organization might need to use features that are provided by AD Domain Services (AD DS) but are not currently implemented by Azure AD. You can host AD DS on-premises, but in a hybrid scenario where elements of an application are located in Azure, it can be more efficient to replicate this functionality and the AD repository to the cloud. This approach can help reduce the latency caused by sending authentication and local authorization requests from the cloud back to AD DS running on-premises. 

[![1]][1]

This approach requires that you create your own domain in the cloud and join it to the on-premises forest. You create VMs to host the AD DS services.

Benefits:

- Provides the ability to authenticate user, service, and computer accounts on-premises and in the cloud.

- Provides access to the same identity information that is available on-premises.

- There is no need to manage a separate AD forest; the domain in the cloud can belong to the on-premises forest.

- You can apply group policy defined by on-premises Group Policy Objects to the domain in the cloud.

Considerations:

- You must deploy and manage your own AD DS servers and domain in the cloud.

- There may be some synchronization latency between the domain servers in the cloud and the servers running on-premises.

For detailed information about this architecture, see [Extending Active Directory Directory Services (AD DS) to Azure][extending-adds].

## Using Active Directory in Azure with a separate forest

An organization that runs Active Directory (AD) on-premises might have a forest comprising many different domains. You can use domains to provide isolation between functional areas that must be kept separate, possibly for security reasons, but you can share information between domains by establishing trust relationships.

[![2]][2]

An organization that utilizes separate domains can take advantage of Azure by relocating one or more of these domains into a separate forest in the cloud. Alternatively, an organization might wish to keep all cloud resources logically distinct from those held on-premises, and store information about cloud resources in their own directory, as part of a forest also held in the cloud.

Benefits:

- You can implement on-premises identities and separate Azure-only identities.

- There is no need to replicate from the on-premises AD forest to Azure.

Considerations:

- Authentication for on-premises identities in the cloud performs extra network hops to the on-premises AD servers.

- You must deploy your own AD DS servers and forest in the cloud, and establish the appropriate trust relationships between forests.

For detailed information about this architecture, see [Creating a Active Directory Directory Services (AD DS) resource forest in Azure][adds-forest-in-azure].

## Using Active Directory Federation Services (AD FS) with Azure

AD FS can run on-premises, but in a hybrid scenario where applications are located in Azure, it can be more efficient to implement this functionality in the cloud.

[![3]][3]

This architecture is especially useful for:

- Solutions that utilize federated authorization to expose web applications to partner organizations.

- Systems that support access from web browsers running outside of the organizational firewall.

- Systems that enable users to access to web applications by connecting from authorized external devices such as remote computers, notebooks, and other mobile devices. 

Benefits:

- You can leverage claims-aware applications.

- It provides the ability to trust external partners for authentication.

- It provides compatibility with large set of authentication protocols.

Considerations:

- You must deploy your own AD DS, AD FS, and AD FS Web Application Proxy servers in the cloud.

- This architecture can be complex to configure.

For detailed information about this architecture, see [Implementing Active Directory Federation Services (AD FS) in Azure][adfs-in-azure].

## Next steps

The resources below explain how to implement the architectures described in this article.

- [Implementing Azure Active Directory][implementing-aad]
- [Extending Active Directory Directory Services (AD DS) to Azure][extending-adds]
- [Creating a Active Directory Directory Services (AD DS) resource forest in Azure][adds-forest-in-azure]
- [Implementing Active Directory Federation Services (AD FS) in Azure][adfs-in-azure]

<!-- Links -->
[0]: ./media/identity/figure1.png "Cloud identity architecture using Azure Active Directory"
[1]: ./media/identity/figure2.png "Secure hybrid network architecture with Active Directory"
[2]: ./media/identity/figure3.png "Secure hybrid network architecture with separate AD domains and forests"
[3]: ./media/identity/figure4.png "Secure hybrid network architecture with AD FS"
[implementing-aad]: ./guidance-identity-aad.md
[extending-adds]: ./guidance-identity-adds-extend-domain.md
[adds-forest-in-azure]: ./guidance-identity-adds-resource-forest.md
[adfs-in-azure]: ./guidance-identity-adfs.md
[add]: https://azure.microsoft.com/services/active-directory/