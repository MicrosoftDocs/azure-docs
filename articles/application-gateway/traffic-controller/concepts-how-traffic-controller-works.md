---

title: How Traffic Controller works
titlesuffix: Azure Application Load Balancer
description: This article provides information about how Traffic Controller accepts incoming requests and routes them to a backend target.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: conceptual
ms.date: 5/1/2023
ms.author: greglin
---

# How Traffic Controller works

Traffic Controller is made up of three components:
- Traffic Controller
- Frontends
- Asscoations

The following dependencies are also referenced in a Traffic Controller deployment
- Public IP address
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
- A Traffic Controller Frontend defines the IP address that traffic should be received by a given Traffic Controller
   - A given frontend cannot be associated to multiple Traffic Controllers
   - The frontend resource region should match the same region as the parent
   - For Frontends mapped to public IPs, all Public IPs across all frontends in one Traffic Controller must have the same home region as the traffic controller.
- Each frontend maps to a single public IP address
   - Private IP addresses are currently unsupported
- A single Traffic Controller can support multiple Frontends

### Traffic Controller Association
- A Traffic Controller Association defines a connection point into a virtual network.  An association is a 1:1 mapping of an association resource to an Azure Subnet that has been delegated.
- Traffic Controllers are designed to allow for multiple associations
   - The current number of associations is currently limited to 1
- During creation of an association, the underlying data plane is provisioned and connected to a subnet within the defined virtual network's subnet
- Each association should assume at least 256 addresses are available in the subnet at time of provisioning.
   - A minimum /24 subnet mask for new deployment, assuming nothing has been provisioning in the subnet).
      - If n number of Traffic Controllers are provisioned, with the assumption each Traffic Controller contains 1 association, and the desired is to share the same subnet, the available required addresses should be n*256.
   - All traffic controller association resources should match the same region as the Traffic Controller parent resource

## Azure concepts

### Public IP address
- An Azure resource that defines a publicly routable address exposed to the internet.
- Traffic Controller only supports Public IP address resources that are of Standard Sku.

### Private IP address
- A private IP address is not explicitly defined as an Azure Resource Manager resource.  A private IP address would refer to a specific host address within a given virtual network's subnet.

### Subnet Delegation
- Microsoft.ServiceNetworking/trafficControllers is the namespace adopted by Traffic Controller and may be delegated to a virtual network's subnet.
- When delegation occurs, provisioning of traffic controller resources does not happen, nor is there an exclusive mapping to a Traffic controller association resource.
- Any number of subnets can have a subnet delegation that is the same or different to Traffic Controller.  Once defined, no other resources, other than the defined service, can be provisioned into the subnet unless explicitly defined by the service's implementation.

### User-assigned Managed Identity
- Managed identities for Azure resources eliminate the need to manage credentials in code.
- A User Managed Identity is required for the Azure Load Balancer Controller to make changes to Traffic Controller
- Azure Traffic Controller Configuration Manager is a built-in RBAC role that is delegated to the Traffic Controller resource to enable the Azure Load Balancer controller to use the least required permissions to make changes to the Traffic Controller resource.
