---

title: Application Gateway for Containers components (preview)
description: This article provides information about how Application Gateway for Containers accepts incoming requests and routes them to a backend target.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: appgw-for-containers
ms.topic: conceptual
ms.date: 07/24/2023
ms.author: greglin
---

# Application Gateway for Containers components (preview)

This article provides detailed descriptions and requirements for components of Application Gateway for Containers. Information about how Application Gateway for Containers accepts incoming requests and routes them to a backend target is provided.  For a general overview of Application Gateway for Containers, see [What is Application Gateway for Containers?](overview.md).

### Core components
- Application Gateway for Containers is an Azure parent resource that deploys the control plane
- The control plane is responsible for orchestrating proxy configuration based on customer intent.
- Application Gateway for Containers has two child resources; associations and frontends
  - Child resources are exclusive to only their parent Application Gateway for Containers and may not be referenced by additional Application Gateway for Containers

### Application Gateway for Containers frontends
- An Application Gateway for Containers frontend resource is an Azure child resource of the Application Gateway for Containers parent resource
- An Application Gateway for Containers frontend defines the entry point client traffic should be received by a given Application Gateway for Containers
   - A frontend can't be associated to multiple Application Gateway for Containers
   - Each frontend provides a unique FQDN that can be referenced by a customer's CNAME record 
   - Private IP addresses are currently unsupported
- A single Application Gateway for Containers can support multiple frontends

### Application Gateway for Containers associations
- An Application Gateway for Containers association resource is an Azure child resource of the Application Gateway for Containers parent resource
- An Application Gateway for Containers association defines a connection point into a virtual network.  An association is a 1:1 mapping of an association resource to an Azure Subnet that has been delegated.
- Application Gateway for Containers is designed to allow for multiple associations
   - At this time, the current number of associations is currently limited to 1
- During creation of an association, the underlying data plane is provisioned and connected to a subnet within the defined virtual network's subnet
- Each association should assume at least 256 addresses are available in the subnet at time of provisioning.
   - A minimum /24 subnet mask for new deployment, assuming nothing has been provisioning in the subnet).
      - If n number of Application Gateway for Containers are provisioned, with the assumption each Application Gateway for Containers contains one association, and the intent is to share the same subnet, the available required addresses should be n*256.
   - All Application Gateway for Containers association resources should match the same region as the Application Gateway for Containers parent resource

### Application Gateway for Containers ALB Controller
- An Application Gateway for Containers ALB Controller is a Kubernetes deployment that orchestrates configuration and deployment of Application Gateway for Containers by watching Kubernetes both Custom Resources and Resource configurations, such as, but not limited to, Ingress, Gateway, and ApplicationLoadBalancer.  It uses both ARM / Application Gateway for Containers configuration APIs to propagate configuration to the Application Gateway for Containers Azure deployment.
- ALB Controller is deployed / installed via Helm
- ALB Controller consists of two running pods
   - alb-controller pod is responsible for orchestrating customer intent to Application Gateway for Containers load balancing configuration
   - alb-controller-bootstrap pod is responsible for management of CRDs

## Azure / general concepts

### Private IP address
- A private IP address isn't explicitly defined as an Azure Resource Manager resource.  A private IP address would refer to a specific host address within a given virtual network's subnet.

### Subnet delegation

- Microsoft.ServiceNetworking/trafficControllers is the namespace adopted by Application Gateway for Containers and may be delegated to a virtual network's subnet.
- When delegation occurs, provisioning of Application Gateway for Containers resources doesn't happen, nor is there an exclusive mapping to an Application Gateway for Containers association resource.
- Any number of subnets can have a subnet delegation that is the same or different to Application Gateway for Containers.  Once defined, no other resources, other than the defined service, can be provisioned into the subnet unless explicitly defined by the service's implementation.

### User-assigned managed identity

- Managed identities for Azure resources eliminate the need to manage credentials in code.
- A User Managed Identity is required for each Azure Load Balancer Controller to make changes to Application Gateway for Containers
- _AppGw for Containers Configuration Manager_ is a built-in RBAC role that allows ALB Controller to access and configure the Application Gateway for Containers resource.

 > [!Note]
> The _AppGw for Containers Configuration Manager_ role has [data action permissions](../../role-based-access-control/role-definitions.md#control-and-data-actions) that the Owner and Contributor roles do not have. It is critical proper permissions are delegated to prevent issues with ALB Controller making changes to the Application Gateway for Containers service.

## How Application Gateway for Containers accepts a request

Each Application Gateway for Containers frontend provides a generated Fully Qualified Domain Name managed by Azure.  The FQDN may be used as-is or customers may opt to mask the FQDN with a CNAME record.

Before a client sends a request to Application Gateway for Containers, the client resolves a CNAME that points to the frontend's FQDN; or the client may directly resolve the FQDN provided by Application Gateway for Containers by using a DNS server.

The DNS resolver translates the DNS record to an IP address.

When the client initiates the request, the DNS name specified is passed as a host header to Application Gateway for Containers on the defined frontend.

A set of routing rules evaluates how the request for that hostname should be initiated to a defined backend target.

## How Application Gateway for Containers routes a request

### Modifications to the request

Application Gateway for Containers inserts three additional headers to all requests before requests are initiated from Application Gateway for Containers to a backend target:
- x-forwarded-for
- x-forwarded-proto
- x-request-id

**x-forwarded-for** is the original requestor's client IP address.  If the request is coming through a proxy, the header value will append the address received, comma delimited.  In example: 1.2.3.4,5.6.7.8; where 1.2.3.4 is the client IP address to the proxy in front of Application Gateway for Containers, and 5.6.7.8 is the address of the proxy forwarding traffic to Application Gateway for Containers.

**x-forwarded-proto** returns the protocol received by Application Gateway for Containers from the client.  The value is either http or https.

**X-request-id** is a unique guid generated by Application Gateway for Containers for each client request and presented in the forwarded request to the backend target. The guid consists of 32 alphanumeric characters, separated by dashes (for example: d23387ab-e629-458a-9c93-6108d374bc75). This guid can be used to correlate a request received by Application Gateway for Containers and initiated to a backend target as defined in access logs.

