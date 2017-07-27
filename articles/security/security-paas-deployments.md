---
title: Securing PaaS deployments | Microsoft Docs
description: " Understand the security advantages of PaaS versus other cloud service models and learn recommended practices for securing your Azure PaaS deployment. "
services: security
documentationcenter: na
author: techlake
manager: MBaldwin
editor: techlake

ms.assetid:
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/21/2017
ms.author: terrylan

---
# Securing PaaS deployments

This article provides information that helps you:

- Understand the security advantages of hosting applications in the cloud
- Evaluate the security advantages of platform as a service (PaaS) versus other cloud service models
- Change your security focus from a network-centric to an identity-centric perimeter security approach
- Implement general PaaS security best practices recommendations

## Cloud security advantages
There are security advantages to being in the cloud. In an on-premises environment, organizations likely have unmet responsibilities and limited resources available to invest in security, which creates an environment where attackers are able to exploit vulnerabilities at all layers.

![Security advantages of cloud era][1]

Organizations are able to improve their threat detection and response times by using a provider’s cloud-based security capabilities and cloud intelligence.  By shifting responsibilities to the cloud provider, organizations can get more security coverage, which enables them to reallocate security resources and budget to other business priorities.

## Division of responsibility
It’s important to understand the division of responsibility between you and Microsoft. On-premises, you own the whole stack but as you move to the cloud some responsibilities transfer to Microsoft. The following responsibility matrix shows the areas of the stack in a SaaS, PaaS, and IaaS deployment that you are responsible for and Microsoft is responsible for.

![Responsibility zones][2]

For all cloud deployment types, you own your data and identities. You are responsible for protecting the security of your data and identities, on-premises resources, and the cloud components you control (which varies by service type).

Responsibilities that are always retained by you, regardless of the type of deployment, are:

- Data
- Endpoints
- Account
- Access management

## Security advantages of a PaaS cloud service model
Using the same responsibility matrix, let’s look at the security advantages of an Azure PaaS deployment versus on-premises.

![Security advantages of PaaS][3]

Starting at the bottom of the stack, the physical infrastructure, Microsoft mitigates common risks and responsibilities. Because the Microsoft cloud is continually monitored by Microsoft, it is hard to attack. It doesn’t make sense for an attacker to pursue the Microsoft cloud as a target. Unless the attacker has lots of money and resources, the attacker is likely to move on to another target.  

In the middle of the stack, there is no difference between a PaaS deployment and on-premises. At the application layer and the account and access management layer, you have similar risks. In the next steps section of this article, we will guide you to best practices for eliminating or minimizing these risks.

At the top of the stack, data governance and rights management, you take on one risk that can be mitigated by key management. (Key management is covered in best practices.) While key management is an additional responsibility, you have areas in a PaaS deployment that you no longer have to manage so you can shift resources to key management.

The Azure platform also provides you strong DDoS protection by using various network-based technologies. However, all types of network-based DDoS protection methods have their limits on a per-link and per-datacenter basis. To help avoid the impact of large DDoS attacks, you can take advantage of Azure’s core cloud capability of enabling you to quickly and automatically scale out to defend against DDoS attacks. We'll go into more detail on how you can do this in the recommended practices articles.

## Modernizing the defender’s mindset
With PaaS deployments come a shift in your overall approach to security. You shift from needing to control everything yourself to sharing responsibility with Microsoft.

Another significant difference between PaaS and traditional on-premises deployments, is a new view of what defines the primary security perimeter. Historically, the primary on-premises security perimeter was your network and most on-premises security designs use the network as its primary security pivot. For PaaS deployments, you are better served by considering identity to be the primary security perimeter.

## Identity as the primary security perimeter
One of the five essential characteristics of cloud computing is broad network access, which makes network-centric thinking less relevant. The goal of much of cloud computing is to allow users to access resources regardless of location. For most users, their location is going to be somewhere on the Internet.

The following figure shows how the security perimeter has evolved from a network perimeter to an identity perimeter. Security becomes less about defending your network and more about defending your data, as well as managing the security of your apps and users. The key difference is that you want to push security closer to what’s important to your company.

![Identity as new security perimeter][4]

Initially, Azure PaaS services (for example, web roles and Azure SQL) provided little or no traditional network perimeter defenses. It was understood that the element’s purpose was to be exposed to the Internet (web role) and that authentication provides the new perimeter (for example, BLOB or Azure SQL).

Modern security practices assume that the adversary has breached the network perimeter. Therefore, modern defense practices have moved to identity. Organizations must establish an identity-based security perimeter with strong authentication and authorization hygiene (best practices).

## Recommendations for managing the identity perimeter

Principles and patterns for the network perimeter have been available for decades. In contrast, the industry has relatively less experience with using identity as the primary security perimeter. With that said, we have accumulated enough experience to provide some general recommendations that are proven in the field and apply to almost all PaaS services.

The following summarizes a general best practices approach to managing your identity perimeter.

- **Don’t lose your keys or credentials**
  Securing keys and credentials is essential to secure PaaS deployments. Losing keys and credentials is a common problem. One good solution is to use a centralized solution where keys and secrets can be stored in hardware security modules (HSM). Azure provides you an HSM in the cloud with [Azure Key Vault](../key-vault/key-vault-whatis.md).
- **Don’t put credentials and other secrets into source code or GitHub**
  The only thing worse than losing your keys and credentials is having an unauthorized party gain access to them. Attackers are able to take advantage of bot technologies to find keys and secrets stored in code repositories such as GitHub. Do not put key and secrets in these public source code repositories.
- **Protect your VM management interfaces on hybrid PaaS and IaaS services**
  IaaS and PaaS services run on virtual machines (VMs). Depending on the type of service, several management interfaces are available that enable you to remote manage these VMs directly. Remote management protocols such as [Secure Shell Protocol (SSH)](https://en.wikipedia.org/wiki/Secure_Shell), [Remote Desktop Protocol (RDP)](https://support.microsoft.com/kb/186607), and [Remote PowerShell](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.core/enable-psremoting) can be used. In general, we recommend that you do not enable direct remote access to VMs from the Internet. If available, you should use alternate approaches such as using virtual private networking into an Azure virtual network. If alternative approaches are not available, then ensure that you use complex passphrases, and when available, two-factor authentication (such as [Azure Multi-Factor Authentication](../multi-factor-authentication/multi-factor-authentication.md)).
- **Use strong authentication and authorization platforms**

  - Use federated identities in Azure AD instead of custom user stores. When you use federated identities, you take advantage of a platform-based approach and you delegate the management of authorized identities to your partners. A federated identity approach is especially important in scenarios when employees are terminated and that information needs to be reflected through multiple identity and authorization systems.
  - Use platform supplied authentication and authorization mechanisms instead of custom code. The reason is that developing custom authentication code can be error prone. Most of your developers are not security experts and are unlikely to be aware of the subtleties and the latest developments in authentication and authorization. Commercial code (for example from Microsoft) is often extensively security reviewed.
  - Use multi-factor authentication. Multi-factor authentication is the current standard for authentication and authorization because it avoids the security weaknesses inherent in username and password types of authentication. Access to both the Azure management (portal/remote PowerShell) interfaces and to customer facing services should be designed and configured to use [Azure Multi-Factor Authentication (MFA)](../multi-factor-authentication/multi-factor-authentication.md).
  - Use standard authentication protocols, such as OAuth2 and Kerberos. These protocols have been extensively peer reviewed and are likely implemented as part of your platform libraries for authentication and authorization.

## Next steps
In this article, we focused on security advantages of an Azure PaaS deployment. Next, learn recommended practices for securing your PaaS web and mobile solutions. We’ll start with Azure App Service, Azure SQL Database, and Azure SQL Data Warehouse. As articles on recommended practices for other Azure services become available, links will be provided in the following list:

- [Azure App Service](security-paas-applications-using-app-services.md)
- [Azure SQL Database and Azure SQL Data Warehouse](security-paas-applications-using-sql.md)
- Azure Storage
- Azure REDIS Cache
- Azure Service Bus
- Web Application Firewalls

<!--Image references-->
[1]: ./media/security-paas-deployments/advantages-of-cloud.png
[2]: ./media/security-paas-deployments/responsibility-zones.png
[3]: ./media/security-paas-deployments/advantages-of-paas.png
[4]: ./media/security-paas-deployments/identity-perimeter.png
