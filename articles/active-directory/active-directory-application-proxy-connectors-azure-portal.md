---
title: Publishing applications on separate networks and locations using connector groups in Azure AD App Proxy | Microsoft Docs
description: Covers how to create and manage groups of connectors in Azure AD Application Proxy.
services: active-directory
documentationcenter: ''
author: kgremban
manager: femila

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/04/2017
ms.author: kgremban

ms.custom: H1Hack27Feb2017
---

# Publish applications on separate networks and locations using connector groups
> [!div class="op_single_selector"]
> * [Azure portal](active-directory-application-proxy-connectors-azure-portal.md)
> * [Azure classic portal](active-directory-application-proxy-connectors.md)
>

## Azure AD Application Proxy and connector groups

Customers utilize Azure AD's Application Proxy for more and more scenarios and applications. So we've made App Proxy even more flexible by enabling more topologies. You can create Application Proxy connector groups – a new capability to assign specific connectors to serve specific applications. This capability generates many use cases for Application Proxy that were not possible before. 

The basic concept is that each Application Proxy connector is assigned to a connector group. All the connectors that belong to the same connector group act as a separate group for high-availability and load balancing. By default, all connectors belong to a default group. The admin can create new groups and change these assignments in the Azure portal. 

By default, all applications are assigned to a default connector group. If your admin doesn’t change anything, the system continues to behave like it did before. If you change nothing, all the applications assigned to the default connector group include all the connectors. But if you organize your connectors into groups, you can set each application to work with a specific connector group. In this case, only the connectors in that group will serve the application upon request.


>[!NOTE] 
>Because new connectors are automatically assigned to a default connector group, for large deployments we recommend that you do not have applications assigned to the default group. Therefore once installed, new connectors will not receive any live traffic. Only after you assign the connector to one of the active groups, it can start serving live traffic. This also enables you to put connectors in an idle mode in order to enable maintenance.
>

## Prerequisite: Create your connector groups
To group your connectors, you have to make sure you [installed multiple connectors](active-directory-application-proxy-enable.md). When you install a new connector, it automatically joins the **Default** connector group.

## Step 1: Create connector groups
You can create as many connector groups as you want. Connector group creation is accomplished in the [Azure portal](https://portal.azure.com).

1. Select **Azure Active Directory** to go to the management dashboard for your directory. From there, select **Enterprise applications** > **Application proxy**.
2. Select the **Connector Groups** button. The New Connector Group blade appears.
3. Give your new connector group a name, then use the dropdown menu to select which connectors belong in this group.
4. Select **Save** when your connector Group is complete.

## Step 2: Assign applications to your connector groups
The last step is to set each application to the connector group that will serve it.

1. From the management dashboard for your directory, select **Enterprise applications** > **All applications** > the application you want to assign to a connector group > **Application Proxy**.
2. Under **Connector group**, use the dropdown menu to select the group you want the application to use.
3. Select **Save** to apply the change.

## Use cases for connector groups 

Connector groups are useful for various scenarios, including:

###Sites with multiple interconnected datacenters

Many organizations have a number of interconnected datacenters. In this case, you want to keep as much traffic within the datacenter as possible because cross-datacenter links are expensive and slow. You can deploy connectors in each datacenter to serve only the applications that reside within the datacenter. This approach minimizes cross-datacenter links and provides an entirely transparent experience to your users.

### Applications installed on isolated networks

Applications can be hosted in networks that are not part of the main corporate network. You can use connector groups to install dedicated connectors on isolated networks to also isolate applications to the network. This usually happens when a third party vendor maintains a specific application for your organization. 

Connector groups allow you to install dedicated connectors for those networks that publish only specific applications, making it easier and more secure to outsource application management to third party vendors.

### Applications installed on IaaS 

For applications installed on IaaS for cloud access, connector groups provide a common service to secure the access to all the apps. Connector groups don't create additional dependency on your corporate network, or fragment the app experience. Connectors can be installed on every cloud datacenter and serve only applications that reside in this network. You can install several connectors to achieve high availability.

In this case, the organization has number of virtual machines connected to their own IaaS hosted virtual network. To allow employees to use these applications, these private networks are connected to the corporate network using site-to-site VPN. This provides a good experience for employees that are located on-premise. But, it may not be ideal for remote employees, because it requires additional on-premises infrastructure, as you can see in the diagram below:

![AzureAD Iaas Network](./media/application-proxy-publish-apps-separate-networks/application-proxy-iaas-network.png)
  
This can become an issue as many organizations use multiple cloud vendors, as their applications reside in numerous datacenters. With Azure AD Application Proxy connector groups, you can enable a common service to secure the access to all applications without creating additional dependency on your corporate network:

![AzureAD Iaas Multiple Cloud Vendors](./media/application-proxy-publish-apps-separate-networks/application-proxy-multiple-cloud-vendors.png)

### Multi-forest – different connector groups for each forest

Most customers who have deployed Application Proxy are using its single-sign-on (SSO) capabilities by performing Kerberos Constrained Delegation (KCD). To acheive this, the connector’s machines need to be joined to a domain that can delegate the users toward the application. KCD supports cross-forest capabilities. But for companies who have distinct multi-forest environments with no trust between them, a single connector cannot be used for all forests. 

In this case, specific connectors can be deployed per forest, and set to serve applications that were published to serve only the users of that specific forest. Each connector group represents a different forest. While the tenant and most of the experience will be unified for all forests, users can be assigned to their forest applications using Azure AD groups.
 
### Disaster Recovery sites

There are two different approaches you can take with a disaster recovery (DR) site, depending on how your sites are implemented:

* If your DR site is built in active-active mode where it is exactly like the main site and has the same networking and AD settings, you can create the connectors on the DR site in the same connector group as the main site. This enables Azure AD to detect failovers for you.
* If your DR site is separate from the main site, you can create a different connector group in the DR site, and have either 1) additional applications or 2) manually divert the existing application to the DR connector group as needed.
 
### Serve multiple companies from a single tenant

There are many different ways to implement a model in which a single service provider deploys and maintains Azure AD related services for multiple companies. Connector groups help the admin segregate the connectors and applications into different groups. One way, which is suitable for small companies, is to have a single Azure AD tenant while the different companies have their own domain name and networks. This is also true for M&A scenarios and situations where a single IT division serves several companies for regulatory or business reasons. 

## Sample configurations

Some examples that you can implement, include the followiong connector groups.
 
### Default configuration – no use for connector groups

If you don’t use connector groups, your configuration would look like this:

![AzureAD No Connector Groups](./media/application-proxy-publish-apps-separate-networks/application-proxy-sample-config-1.png)
 
This configuration is sufficient for small deployments and tests. It will also work well if your organization has a flat network topology.
 
### Default configuration and an isolated network

This configuration is an evolution of the default one, in which there is a specific app that runs in an isolated network such as IaaS virtual network: 

![AzureAD No Connector Groups](./media/application-proxy-publish-apps-separate-networks/application-proxy-sample-config-2.png)
 
### Recommended configuration – several specific groups and a default group for idle

The recommended configuration for large and complex organizations is to have the default connector group as a group that doesn’t serve any applications and is used for idle or newly installed connectors. All applications are served using customized connector groups. This enables all the complexity of the scenarios described above.

In the example below, the company has two datacenters, A and B, with two connectors that serve each site. Each site has different applications that run on it. 

![AzureAD No Connector Groups](./media/application-proxy-publish-apps-separate-networks/application-proxy-sample-config-3.png)
 
## Next steps
* [Enable Application Proxy](active-directory-application-proxy-enable.md)
* [Enable single-sign on](active-directory-application-proxy-sso-using-kcd.md)
* [Enable conditional access](active-directory-application-proxy-conditional-access.md)
* [Troubleshoot issues you're having with Application Proxy](active-directory-application-proxy-troubleshoot.md)

