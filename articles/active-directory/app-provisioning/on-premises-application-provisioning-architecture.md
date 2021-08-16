---
title: 'Azure AD on-premises application provisioning architecture | Microsoft Docs'
description: Presents an overview of on-premises application provisioning architecture.
services: active-directory
author: billmath
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 05/28/2021
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Azure AD on-premises application provisioning architecture

>[!IMPORTANT]
> The on-premises provisioning preview is currently in an invitation-only preview. To request access to the capability, use the [access request form](https://aka.ms/onpremprovisioningpublicpreviewaccess). We'll open the preview to more customers and connectors over the next few months as we prepare for general availability (GA).

## Overview

The following diagram shows an overview of how on-premises application provisioning works.

![Diagram that shows the architecture for on-premises application provisioning.](.\media\on-premises-application-provisioning-architecture\arch-3.png)

There are three primary components to provisioning users into an on-premises application:

- The provisioning agent provides connectivity between Azure Active Directory (Azure AD) and your on-premises environment.
- The ECMA host converts provisioning requests from Azure AD to requests made to your target application. It serves as a gateway between Azure AD and your application. You can use it to import existing ECMA2 connectors used with Microsoft Identity Manager. The ECMA host isn't required if you've built a SCIM application or SCIM gateway.
- The Azure AD provisioning service serves as the synchronization engine.

>[!NOTE]
> Microsoft Identity Manager Synchronization isn't required. But you can use it to build and test your ECMA connector before you import it into the ECMA host.


### Firewall requirements

You don't need to open inbound connections to the corporate network. The provisioning agents only use outbound connections to the provisioning service, which means there's no need to open firewall ports for incoming connections. You also don't need a perimeter (DMZ) network because all connections are outbound and take place over a secure channel.

## Agent best practices
- Ensure the auto Azure AD Connect Provisioning Agent Auto Update service is running. It's enabled by default when you install the agent. Auto-update is required for Microsoft to support your deployment.
- Avoid all forms of inline inspection on outbound TLS communications between agents and Azure. This type of inline inspection causes degradation to the communication flow.
- The agent must communicate with both Azure and your application, so the placement of the agent affects the latency of those two connections. You can minimize the latency of the end-to-end traffic by optimizing each network connection. Each connection can be optimized by:
  - Reducing the distance between the two ends of the hop.
  - Choosing the right network to traverse. For example, traversing a private network rather than the public internet might be faster because of dedicated links.

## ECMA Connector Host architecture

[![ECMA connector host](.\media\on-premises-application-provisioning-architecture\ecma-2.png)](.\media\on-premises-application-provisioning-architecture\ecma-2.png#lightbox)

The ECMA Connector Host has serveral moving pieces it uses to achieve on-premises provisioning.  The diagram above is a conceputal drawing that presents these individaul areas.  The table below describes the areas in more detail.

|Area|Description|
|-----|-----|
|Endpoints|Responsible for communication and data-transfer between the Azure AD provisioning service}
|In-memory cache|Used to store the data received from the on-premises data source|
|Autosync|Provides asynchronous data synchronization between the ECMA Connector Host and the on-premises data source|
|Business logic|Used to coordianate all of the ECMA Connector Host activities|

### About anchor attributes and distinguished names
The following information is provided to better explain the anchor attributes and the distinguished names, particularly used by the genericSQL connector.

The anchor attribute is a unique attribute of an object type that does not change and represents an that object in the ECMA Connector Host in-memory cache.

The distinguished name (DN) is a name that uniquely identifies an object by indicating its current location in the directory hierarchy.  Or in the case of SQL, in the partition. The name is formed by concatenating the anchor attribute a the root of the directory partition. 

When we think of traditional DNs in a traditional format, for say, Active Directory or LDAP, we think of something similar to:

  CN=Lola Jacobson,CN=Users,DC=contoso,DC=com

However, for a data source such as SQL, which is flat, not hierarchical, the DN needs to be either already present in one of the table or created from the information we provide to the ECMA Connector Host.  

This can be achieved by checking **Autogenerated** in the checkbox when configuring the genericSQL connector. When you choose DN to be autogenerated, the ECMA host will generate a DN in an LDAP format: CN=<anchorvalue>,OBJECT=<type>. This also assumes that DN is Anchor is **unchecked** in the Connectivity page. 
 [![ECMA connector host](.\media\on-premises-application-provisioning-architecture\user-2.png)](.\media\on-premises-application-provisioning-architecture\user-2.png#lightbox)

The genericSQL connector expects the DN to be populated using an LDAP format.  The Generic SQL connector is using the LDAP style with the component name "OBJECT=". This allows it to use partitions (each object type is a partition).

Since ECMA Connector Host currently only supports the USER object type, the OBJECT=<type> will be OBJECT=USER.  So the DN for a user with an anchorvalue of

  CN=ljacobson,OBJECT=USER


### User creation workflow

1.  The Azure AD provisioning service queries the ECMA Connector Host to see if the user exists.  It uses the **matching attribute** as the filter.  This attribute is defined in the Azure AD portal under Enterprise applications -> On-premises provisioning -> provisioning -> attribute matching.  It is denoted by the 1 for matching precedence and cannot be removed.
 [![Matching attribute](.\media\on-premises-application-provisioning-architecture\matching-1.png)](.\media\on-premises-application-provisioning-architecture\matching-1.png#lightbox)

2.  ECMA Connector Host receives the GET request and queries its internal cache to see if the user exists and has based imported.  This is done using the **query attribute**. The query attribute is defined in the object types page.  
 [![Matching attribute](.\media\on-premises-application-provisioning-architecture\matching-2.png)](.\media\on-premises-application-provisioning-architecture\matching-2.png#lightbox)


3. If the user does not exist, Azure AD will make a POST request to create the user.  The ECMA Connector Host will respond back to Azure AD with the HTTP 201 and provide an ID for the user. This ID is derived from the anchor value defined in the object types page. This anchor will be used by Azure AD to query the ECMA Connector Host for future and subsequent requests. 
4. If a change happens to the user in Azure AD, then Azure AD will make a GET request to retrieve the user using the anchor from the previous step, rather than the matching attribute in step 1. This allows, for example, the UPN to change without breaking the link between the user in Azuer AD and in the app.  


## Provisioning agent questions
Some common questions are answered here.

### What is the GA version of the provisioning agent?

For the latest GA version of the provisioning agent, see [Azure AD connect provisioning agent: Version release history](provisioning-agent-release-version-history.md).

### How do I know the version of my provisioning agent?

 1. Sign in to the Windows server where the provisioning agent is installed.
 1. Go to **Control Panel** > **Uninstall or Change a Program**.
 1. Look for the version that corresponds to the entry for **Microsoft Azure AD Connect Provisioning Agent**.

### Does Microsoft automatically push provisioning agent updates?

Yes. Microsoft automatically updates the provisioning agent if the Windows service Microsoft Azure AD Connect Agent Updater is up and running. Ensuring that your agent is up to date is required for support to troubleshoot issues.

### Can I install the provisioning agent on the same server running Azure AD Connect or Microsoft Identity Manager?

Yes. You can install the provisioning agent on the same server that runs Azure AD Connect or Microsoft Identity Manager, but they aren't required.

### How do I configure the provisioning agent to use a proxy server for outbound HTTP communication?

The provisioning agent supports use of outbound proxy. You can configure it by editing the agent config file **C:\Program Files\Microsoft Azure AD Connect Provisioning Agent\AADConnectProvisioningAgent.exe.config**. Add the following lines into it toward the end of the file just before the closing `</configuration>` tag. Replace the variables `[proxy-server]` and `[proxy-port]` with your proxy server name and port values.

```
    <system.net>
        <defaultProxy enabled="true" useDefaultCredentials="true">
            <proxy
                usesystemdefault="true"
                proxyaddress="http://[proxy-server]:[proxy-port]"
                bypassonlocal="true"
            />
        </defaultProxy>
    </system.net>
```
### How do I ensure the provisioning agent can communicate with the Azure AD tenant and no firewalls are blocking ports required by the agent?

You can also check whether all the required ports are open.

### How do I uninstall the provisioning agent?
 1. Sign in to the Windows server where the provisioning agent is installed.
 2. Go to **Control Panel** > **Uninstall or Change a Program**.
 3. Uninstall the following programs:
     - Microsoft Azure AD Connect Provisioning Agent
     - Microsoft Azure AD Connect Agent Updater
     - Microsoft Azure AD Connect Provisioning Agent Package

### I am getting an Invalid LDAP style DN error when trying to configure the ECMA Connector Host with SQL
By default, the genericSQL connector expects the DN to be populated using the LDAP style (when the ‘DN is anchor’ attribute is left unchecked in the first connectivity page). In the error message above, you can see that the DN is a UPN, rather than an LDAP style DN that the connector expects. 

To resolve this, ensure that **Autogenerated** is selected on the object types page when you configure the connector.




## Next steps

- [App provisioning](user-provisioning.md)
- [Azure AD ECMA Connector Host prerequisites](on-premises-ecma-prerequisites.md)
- [Azure AD ECMA Connector Host installation](on-premises-ecma-install.md)
- [Azure AD ECMA Connector Host configuration](on-premises-ecma-configure.md)
