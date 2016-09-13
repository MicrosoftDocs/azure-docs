<properties
	pageTitle="Working with Azure AD Application Proxy connectors | Microsoft Azure"
	description="Covers how to create and manage groups of connectors in Azure AD Application Proxy."
	services="active-directory"
	documentationCenter=""
	authors="kgremban"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/09/2016"
	ms.author="kgremban"/>


# Publish applications on separate networks and locations using connector groups - Public Preview

> [AZURE.SELECTOR]
- [Azure portal](active-directory-application-proxy-connectors-azure-portal.md)
- [Azure classic portal](active-directory-application-proxy-connectors.md)


Connector groups are useful for various scenarios, including:

- Sites with multiple interconnected datacenters. In this case, you want to keep as much traffic within the datacenter as possible because cross-datacenter links are expensive and slow. You can deploy connectors in each datacenter to serve only the applications that reside within the datacenter. This approach minimizes cross-datacenter links and provides an entirely transparent experience to your users.
- Managing applications installed on isolated networks that are not part of the main corporate network. You can use connector groups to install dedicated connectors on isolated networks to also isolate applications to the network.
- For applications installed on IaaS for cloud access, connector groups provide a common service to secure the access to all the apps. Connector groups don't create additional dependency on your corporate network, or fragment the app experience. Connectors can be installed on every cloud datacenter and serve only applications that reside in this network. You can install several connectors to achieve high availability.
- Support for multi-forest environments in which specific connectors can be deployed per forest and set to serve specific applications.
- Connector groups can be used in Disaster Recovery sites to either detect failover or as backup for the main site.
- Connector groups can also be used to serve multiple companies from a single tenant.

## Prerequisite: Create your connectors
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


## See also

- [Enable Application Proxy](active-directory-application-proxy-enable.md)
- [Enable single-sign on](active-directory-application-proxy-sso-using-kcd.md)
- [Enable conditional access](active-directory-application-proxy-conditional-access.md)
- [Troubleshoot issues you're having with Application Proxy](active-directory-application-proxy-troubleshoot.md)

For the latest news and updates, check out the [Application Proxy blog](http://blogs.technet.com/b/applicationproxyblog/)
