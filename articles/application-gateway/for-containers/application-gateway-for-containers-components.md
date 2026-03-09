---
title: Application Gateway for Containers components
description: This article provides information about how Application Gateway for Containers accepts incoming requests and routes them to a backend target.
services: application-gateway
author: mbender-ms
ms.service: azure-appgw-for-containers
ms.topic: concept-article
ms.date: 12/05/2025
ms.author: mbender
# Customer intent: "As a cloud architect, I want to understand the components of Application Gateway for Containers, so that I can effectively configure and manage traffic routing to backend services in my cloud deployment."
---

# Application Gateway for Containers components

This article provides detailed descriptions and requirements for components of Application Gateway for Containers. It explains how Application Gateway for Containers accepts incoming requests and routes them to a backend target. For a general overview of Application Gateway for Containers, see [What is Application Gateway for Containers](overview.md).

### Core components

- An Application Gateway for Containers resource is an Azure parent resource that deploys the control plane.
- The control plane orchestrates proxy configuration based on customer intent.
- Application Gateway for Containers has two child resources: associations and frontends.
  - Child resources belong exclusively to their parent Application Gateway for Containers and can't be shared with other Application Gateway for Containers resources.

### Application Gateway for Containers frontends

- An Application Gateway for Containers frontend resource is an Azure child resource of the Application Gateway for Containers parent resource.
- An Application Gateway for Containers frontend defines the entry point client traffic uses for a given Application Gateway for Containers.
  - You can't associate a frontend with more than one Application Gateway for Containers.
  - You can create a CNAME record by using the unique FQDN that each frontend provides.
  - Private IP addresses aren't currently supported.
- A single Application Gateway for Containers can support more than one frontend.

### Application Gateway for Containers associations

- An Application Gateway for Containers association resource is an Azure child resource of the Application Gateway for Containers parent resource.
- An Application Gateway for Containers association defines a connection point into a virtual network. An association is a 1:1 mapping of an association resource to a delegated Azure Subnet.
- Application Gateway for Containers is designed to allow for more than one association.
  - At this time, the current number of associations is limited to 1.
- During creation of an association, the underlying data plane is provisioned and connected to a subnet within the defined virtual network's subnet.
- Each association should assume at least 256 addresses are available in the subnet at time of provisioning.
  - A minimum /24 subnet mask for each deployment (assuming no resources are previously provisioned in the subnet).
    - If you plan to deploy multiple Application Gateway for Containers resources that share the same subnet, calculate the required addresses as *n×256*, where *n* equals the number of Application Gateway for Containers resources. This assumes each contains one association.
  - All Application Gateway for Containers association resources should match the same region as the Application Gateway for Containers parent resource.

### Application Gateway for Containers ALB Controller

- An Application Gateway for Containers ALB Controller is a Kubernetes deployment that orchestrates configuration and deployment of Application Gateway for Containers by watching Kubernetes both Custom Resources and Resource configurations, such as, but not limited to, Ingress, Gateway, and ApplicationLoadBalancer. It uses both ARM and Application Gateway for Containers configuration APIs to propagate configuration to the Application Gateway for Containers Azure deployment.
- Deploy or install ALB Controller with Helm.
- ALB Controller consists of two running pods.
  - alb-controller pod orchestrates customer intent to Application Gateway for Containers load balancing configuration.
  - alb-controller-bootstrap pod manages CRDs.
 
### Application Gateway for Containers security policy

- An Application Gateway for Containers security policy defines security configurations, such as WAF, for the ALB Controller to consume.
- A single Application Gateway for Containers resource can refer to more than one security policy.
- At this time, the only security policy type offered is `waf` for web application firewall capabilities.
- The `waf` security policy is a one-to-one mapping between the security policy resource and a Web Application Firewall policy.
  - You can reference only one web application firewall policy in any number of security policies for a defined Application Gateway for Containers resource.
 
### Application Gateway for Containers AKS managed add-on

The AKS add-on for Application Gateway for Containers provides a managed deployment experience by AKS for the ALB Controller, eliminating the need to manually deploy a helm chart.

Some of the benefits of using the managed add-on over a helm based deployment are:

- **Managed updates:** No need to manually update Helm charts; updates are managed by AKS.
- **Automated identity management:** The add-on automatically creates and configures the managed identity (`applicationloadbalancer-<cluster-name>`) with the required permissions.
- **Simplified subnet configuration:** A dedicated subnet (`aks-appgateway`) is automatically provisioned with the correct delegation.
- **Reduced configuration complexity:** No need to manually set up federated credentials or role assignments.
- **AKS Automatic support:** Add-on deployment is required when using AKS Automatic clusters.

## Azure / general concepts

### Private IP address

- A private IP address isn't explicitly defined as an Azure Resource Manager resource. A private IP address refers to a specific host address within a given virtual network's subnet.

### Subnet delegation

- Microsoft.ServiceNetworking/trafficControllers is the namespace adopted by Application Gateway for Containers and you can delegate it to a virtual network's subnet.
- When you delegate, you don't provision Application Gateway for Containers resources, nor is there an exclusive mapping to an Application Gateway for Containers association resource.
- Any number of subnets can have a subnet delegation that is the same or different to Application Gateway for Containers. Once defined, you can't provision other resources into the subnet unless explicitly defined by the service's implementation.

### User-assigned managed identity

- Managed identities for Azure resources eliminate the need to manage credentials in code.
- You need a user-assigned managed identity for each Azure Load Balancer Controller to make changes to Application Gateway for Containers.
- _AppGw for Containers Configuration Manager_ is a built-in RBAC role that allows ALB Controller to access and configure the Application Gateway for Containers resource.

 > [!NOTE]
 > The _AppGw for Containers Configuration Manager_ role has [data action permissions](../../role-based-access-control/role-definitions.md#control-and-data-actions) that the Owner and Contributor roles don't have. It's critical to delegate proper permissions to prevent issues with ALB Controller making changes to the Application Gateway for Containers service.

## How Application Gateway for Containers accepts a request

Each Application Gateway for Containers frontend provides a generated fully qualified domain name managed by Azure. You can use the FQDN as-is or mask it with a CNAME record.

Before a client sends a request to Application Gateway for Containers, the client resolves a CNAME that points to the frontend's FQDN, or the client directly resolves the FQDN provided by Application Gateway for Containers by using a DNS server.

The DNS resolver translates the DNS record to an IP address.

When the client initiates the request, the DNS name specified is passed as a host header to Application Gateway for Containers on the defined frontend.

A set of routing rules evaluates how the request for that hostname should be initiated to a defined backend target.

## How Application Gateway for Containers routes a request

### HTTP/2 Requests

Application Gateway for Containers supports both HTTP/2 and HTTP/1.1 protocols for communication between the client and the frontend. The HTTP/2 setting is always enabled and can't be changed. If clients prefer to use HTTP/1.1 for their communication to the frontend of Application Gateway for Containers, they can continue to negotiate accordingly.

Communication between Application Gateway for Containers and the backend target is always via HTTP/1.1, except for gRPC, which uses HTTP/2.

### Modifications to the request

Application Gateway for Containers inserts three extra headers to all requests before it initiates requests to a backend target:

- x-forwarded-for
- x-forwarded-proto
- x-request-id

**x-forwarded-for** is the original requester's client IP address. If the request comes through a proxy, the header value appends the address it receives, comma delimited. For example: 1.2.3.4,5.6.7.8; where 1.2.3.4 is the client IP address to the proxy in front of Application Gateway for Containers, and 5.6.7.8 is the address of the proxy forwarding traffic to Application Gateway for Containers.

**x-forwarded-proto** returns the protocol Application Gateway for Containers receives from the client. The value is either http or https.

**x-request-id** is a unique guid that Application Gateway for Containers generates for each client request and presents in the forwarded request to the backend target. The guid consists of 32 alphanumeric characters, separated by dashes (for example: aaaa0000-bb11-2222-33cc-444444dddddd). You can use this guid to correlate a request that Application Gateway for Containers receives and initiates to a backend target as defined in access logs.

## Request timeouts

Application Gateway for Containers enforces the following timeouts as it initiates and maintains requests between the client, Application Gateway for Containers, and backend.

| Timeout | Duration | Description |
| ------- | --------- | ----------- |
| Request Timeout | 60 seconds | Time that Application Gateway for Containers waits for the backend target response. |
| HTTP Idle Timeout | 5 minutes | Idle timeout before closing an HTTP connection. |
| Stream Idle Timeout | 5 minutes | Idle timeout before closing an individual stream carried by an HTTP connection. |
| Upstream Connect Timeout | 5 seconds | Time for establishing a connection to the backend target. |

> [!NOTE]
> Request timeout strictly enforces the request to complete in the defined time irrespective if data is actively streaming or the request is idle. For example, if you're serving large file downloads and you expect transfers to take greater than 60 seconds due to size or slow transfer rates, consider increasing the request timeout value or setting it to 0.
