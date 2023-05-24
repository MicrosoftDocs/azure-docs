---

title: How Traffic Controller works
titlesuffix: Azure Application Load Balancer
description: This article provides information about how Traffic Controller accepts incoming requests and routes them to a backend target.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: conceptual
ms.date: 6/1/2023
ms.author: greglin
---

# How Traffic Controller works

Traffic Controller is made up of three components:
- Traffic Controller
- Frontends
- Associations

The following dependencies are also referenced in a Traffic Controller deployment
- Private IP address
- Subnet Delegation
- User-assigned Managed Identity

:::image type="content" source="./media/concepts-how-traffic-controller-works/traffic-controller-kubernetes.png" alt-text="Diagram depicting traffic from internet ingressing into Traffic Controller and being sent to backend pods in AKS.":::

## Traffic Controller Concepts

### Traffic Controller
- Traffic Controller is a parent resource that deploys the control plane
- The control plane is what orchestrates date plane proxy configuration based on customer intent.
- Traffic Controller has two child resources; associations and frontends
  - Child resources are exclusive to only their parent Traffic Controller and may not be referenced by additional Traffic Controllers

### Traffic Controller Frontends
- A Traffic Controller Frontend defines the entry point client traffic should be received by a given Traffic Controller
   - A frontend can't be associated to multiple Traffic Controllers
   - Each frontend provides a unique FQDN that can be referenced by a customer's CNAME record 
   - Private IP addresses are currently unsupported
- A single Traffic Controller can support multiple Frontends

### Traffic Controller Association
- A Traffic Controller Association defines a connection point into a virtual network.  An association is a 1:1 mapping of an association resource to an Azure Subnet that has been delegated.
- Traffic Controllers are designed to allow for multiple associations
   - The current number of associations is currently limited to 1
- During creation of an association, the underlying data plane is provisioned and connected to a subnet within the defined virtual network's subnet
- Each association should assume at least 256 addresses are available in the subnet at time of provisioning.
   - A minimum /24 subnet mask for new deployment, assuming nothing has been provisioning in the subnet).
      - If n number of Traffic Controllers are provisioned, with the assumption each Traffic Controller contains one association, and the desired is to share the same subnet, the available required addresses should be n*256.
   - All traffic controller association resources should match the same region as the Traffic Controller parent resource

## Azure / General concepts

### Private IP address
- A private IP address isn't explicitly defined as an Azure Resource Manager resource.  A private IP address would refer to a specific host address within a given virtual network's subnet.

### Subnet Delegation
- Microsoft.ServiceNetworking/trafficControllers is the namespace adopted by Traffic Controller and may be delegated to a virtual network's subnet.
- When delegation occurs, provisioning of traffic controller resources doesn't happen, nor is there an exclusive mapping to a Traffic controller association resource.
- Any number of subnets can have a subnet delegation that is the same or different to Traffic Controller.  Once defined, no other resources, other than the defined service, can be provisioned into the subnet unless explicitly defined by the service's implementation.

### User-assigned Managed Identity
- Managed identities for Azure resources eliminate the need to manage credentials in code.
- A User Managed Identity is required for the Azure Load Balancer Controller to make changes to Traffic Controller
- Azure Traffic Controller Configuration Manager is a built-in RBAC role that is delegated to the Traffic Controller resource to enable the Azure Load Balancer controller to use the least required permissions to make changes to the Traffic Controller resource.

## How Traffic Controller accepts a request
Each Traffic Controller frontend provides a generated Fully Qualified Domain Name managed by Azure.  The FQDN may be used as-is or customers may opt to mask the FQDN with a CNAME record.

Before a client sends a request to Traffic Controller, the client resolves a CNAME that points to the frontend's FQDN; or the client may directly resolve the FQDN provided by Traffic Controller by using a DNS server.

The DNS resolver translates the DNS record to an IP address.

When the client initiates the request, the DNS name specified is passed as a host header to Traffic Controller on the defined frontend.

A set of routing rules evaluates how the request for that hostname should be initiated to a defined backend target.

## How Traffic Controller routes a request

### Modifications to the request
Traffic Controller inserts two additional headers to all requests before requests are initiated from Traffic Controller to a backend target:
- x-forwarded-proto
- x-request-id

x-forwarded-proto returns the protocol received by Traffic Controller from the client.  The value is either http or https.
X-request-id is a unique guid generated by Traffic Controller for each client request and presented in the forwarded request to the backend target. The guid consists of 32 alphanumeric characters, separated by dashes (for example: d23387ab-e629-458a-9c93-6108d374bc75). This guid can be used to correlate a request received by Traffic Controller and initiated to a backend target as defined in access logs.

