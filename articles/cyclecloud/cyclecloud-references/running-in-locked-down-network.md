---
title: Azure CycleCloud in locked down networks| Microsoft Docs
description: Running Azure CycleCloud in locked down networks.
author: anhoward
ms.date: 2/26/2018
ms.author: anhoward
---

# Installing and running Azure CycleCloud in a locked down network

The CycleCloud application and cluster nodes can operate in environments with
limited internet access. There are certain minimal TCP ports which must remain 
open and are enumerated here.

## Internal Communication between Cluster Nodes and CycleCloud

Cluster nodes fetch and post information to and from the CycleCloud application.
There are a ports that need to be open between the cluster nodes and CycleCloud 
server for these purposes:

| Name        | Source            | Destination    | Service | Protocol | Port Range |
| ----------- | ----------------- | -------------- | ------- | -------- | ---------- |
| amqp_5672  | Cluster Node   | CycleCloud     | AMQP    | TCP      | 5672       |
| https_9443 | Cluster Node   | CycleCloud     | HTTPS   | TCP      | 9443       |


## Communication to Azure APIs

CycleCloud must be able to connect to the ARM Management API to orchestrate VMs. 
This API access carries the additional requirement of authenticating to Azure 
Active Directory. These APIs use **HTTPS**.

CycleCloud requires outbound access to:
* _https://management.azure.com_ (Azure ARM Management)
* _https://login.microsoftonline.com_ (Azure AD)

The management API is hosted regionally, and the public ip address ranges can be
found [here](https://www.microsoft.com/en-us/download/confirmation.aspx?id=41653).
The Azure AD login is part of the Microsoft 365 common APIs and ip ranges for the
service can be found [here](https://docs.microsoft.com/en-us/office365/enterprise/urls-and-ip-address-ranges). 

Cluster nodes must be able to access Azure Storage accounts. The recommended way 
to provide private access to this service and any other supported Azure service is 
[Virtual Network Service Endpoints](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoints-overview).

