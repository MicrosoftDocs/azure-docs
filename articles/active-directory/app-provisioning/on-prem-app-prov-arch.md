---
title: 'On-premises application provisioning architecture | Microsoft Docs'
description: Describes overview of on-premises application provisioning architecture.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 08/31/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# On-premises application provisioning architecture

## Overview

The following diagram shows an over view of how on-premises application provisioning works.

![Architecture](.\media\on-prem-app-prov-arch\arch1.png)

The following information is a detailed description of what is occuring through every step of the process:

  1. Users use the Walk the on-prem provisioning extension wizard.  This wizard provides connectivity to the app and defines the attribute mappings between SCIM and app.

  2.  Provide Azure AD tenant credentials and specify the connector URL. This information is then used to register the agent with the Azure AD tenant.
  3.  The agent registers with the Hybrid Identity Service endpoint
  4.  An entry is created for this agent in the HIS tables. A tenant can have more than one registered agents. Each has a unique connector-id.  Similar to the table below:
   
   |Connector-Id | Resource-connector URL |Connector version|
   |-----|-----|-----|
   |&lt;GUID-1&gt;|contoso.com|1.1.67.0|
   |&lt;GUID-2&gt;|contoso.com|1.1.67.0|
  
  5. Provisioning is configured in the cloud, including authorization for the host / extension, scoping, and attribute mappings between Azure AD and SCIM. 

### Firewall requirements

You do not need to open inbound connections to the corporate network. The provisioning agents only use outbound connections to the provisioning service, which means that there is no need to open firewall ports for incoming connections. You also do not need a perimeter (DMZ) network because all connections are outbound and take place over a secure channel. 

### Agent location

The agent has to communicate with both Azure and your application, so the placement of the agent affects the latency of those two connections.  You can minimize the latency of the end-to-end traffic by optimizing each network connection. Each connection can be optimized by: 

- Reducing the distance between the two ends of the hop. 
- Choosing the right network to traverse. For example, traversing a private network rather than the public Internet may be faster, due to dedicated links. 

### High availability  

Microsoft recommends having at least 3 agents in an agent group. Our service automatically load balances traffic between the agents and can failover if an agent goes down. You can also deploy multiple connector hosts, but need to ensure that the configuration is uniform across hosts.  Use the following guidance: 

 - Place agents on different outbound connections to avoid a single point of failure. If connectors use the same outbound connection, a network problem with the connection may impact all agents using it. 
- Avoid forcing agents to restart when connected to production applications. Doing so could negatively impact the distribution of traffic across connectors. Restarting connectors causes more agents to be unavailable and forces connections to the remaining available connector. The result is an uneven use of the agents initially. 
- Avoid all forms of inline inspection on outbound TLS communications between agents and Azure. This type of inline inspection causes degradation to the communication flow. 
- Make sure to keep automatic updates running for your connectors. 

> [!NOTE]
> While we do provide high availability among agents, we do not support connecting multiple connector hosts to a single app. Each connector host can have multiple apps, but each app can have only one host.  

## Agents and Agent Groups 

Provisioning on-premises relies on the concept of agents and agent groups. Each agent is assigned to one or more agent groups and each app is assigned to one agent group.

![Agent](.\media\on-prem-app-prov-arch\agents1.png)

### Creating a new agent group 
```
POST ~/onPremisesPublishingProfiles/{publishingType}/agentGroups/{id}/agents 

{ 

    "displayName": "New Group" 

} 
```
 

### Adding an agent to an agent group 

 

### Removing an agent from an agent group 

```
DELETE /onPremisesPublishingProfiles/{publishingType}/agents/{id1}/agentGroups/{id2}/$ref 
```
 

### Deleting an agent group 

```
DELETE https://graph.microsoft.com/beta/onPremisesPublishingProfiles/provisioning/agentGroups/8832388F-3814-4952-B288-FFB62081FE25/ 
```

## Provisioning Agent with a proxy server for outbound HTTP communication

The Provisioning Agent supports use of outbound proxy. You can configure it by editing the agent config file **C:\Program Files\Microsoft Azure AD Connect Provisioning Agent\AADConnectProvisioningAgent.exe.config**. 

Add the following lines into it, towards the end of the file just before the closing `</configuration>` tag. 

Replace the variables [proxy-server] and [proxy-port] with your proxy server name and port values. 

```xml 

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


## Next Steps

- App provisioning](user-provisioning.md)