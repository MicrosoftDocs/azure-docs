
# Blog
Security and privacy of sensitive communication is of paramount interest to IoT customers, including those in the enterprise and manufacturing sectors. In IoT Hub, we have heard from many customers about their desire to elevate the security of their operations by ensuring that their Azure resources in the cloud can only be accessed from within the networks they own and control. Furthermore, there is a strong preference to avoid exposing a resource endpoint publicly over the Internet.

Today, we announce a number of IoT Hub features to support the VNET connectivity pattern for IoT customers to achieve the above goals end-to-end:

* IoT hub will now support [private endpoints](../private-link/private-endpoint-overview.md) enabling a private connectivity experience from within customers' VNET's deployed in the Azure cloud. In many cases, this will consequently allow customers to fully block off their IoT Hub's publicly facing endpoint if they so desire.

* As an Azure trusted first-party service, IoT Hub can now be granted Role-Based Access Control (RBAC) permissions to interact with downstream Azure services including blob storage, event hubs or service bus. In addition to replaceing key-based authenticaion, this allows IoT Hub to bypass network-level security policies that may block off connectivity to their public endpoints.


The cumulative result of the above enhancements is that IoT customers that adopt the VNET connectivity pattern can develop and deploy end-to-end solutions that ingest device traffic into IoT Hub and subsequently route the ingested messages to other downstream services without exposing the resouces involved to the public Internet. For enterprise, and manufacturing customers with stringent multi-layer security requirements, this helps improve the overall security posture of the end-to-end solution.

## IoT Hub's VNET connectivity pattern
Traditionally, a large portion of IoT customers in the enterprise or manufacturing sectors operate devices that are deployed on an on-prem network environment managed by their organizations. An on-prem network typically uses private IP address ranges, which thus far, required device traffic to pass through a gateway (such as HTTP gateway or a NAT) to reach IoT Hub's public-facing endpoint over the internet.

While such a network setup is always secured by IoT hub's use of TLS encryption for all connections, many customers have expressed more stringent requirements for  additional layers of security via network isolation. These customers can now utilize the VNET connectivity pattern described below to communicate with IoT Hub as well as other Azure services involved in an end-to-end IoT solution. 

To clarify the scope, let's first review the connectivity interactions involved in a typical IoT solution:

* **Device ingress:** IoT devices connect to IoT Hub for the purpose of sending telemetry, receiving commands, or exchange of device twin documents. These connections are created outbound from devices to IoT Hub.

* **Service ingress:** Customers' IoT applications and services connect to IoT Hub in a similar outbound fashion to receive telemetry, send commands, or update device twin documents. 

* **Routing (egress):** The routing feature of IoT Hub allows egress of messages and notifications from IoT Hub to downstream services, including blob storage, Event Hubs, and services bus. Therefore, routing egress requires outbound connectivity to the downstream resource.

* **Import/export jobs and file upload:** IoT hub's import/export jobs and file upload features rely on conenctivity between IoT Hub and the downstream storage account. File upload additionally requires connectivity between devices and the storage account. All these conenctions are created inbound to the storage account endpoint.

In a traditional setup, all connections listed above take place over the public-facing endpoint of the resources involved. In case the customer would like to fully isolate the endpoint from the Internet, they can use the connectivity scheme using the VNET pattern as described in the following sections:

### Device ingress
To allow device ingress using the VNET pattern, customers use [Virtual Private Networks (VPN) tunnel](../virtual-network/virtual-networks-overview.md) or [Express Route private peering](../expressroute/expressroute-introduction.md) to gain connectivity to the subnet spaces inside of their VNET. Subsequently, the customer creates a private endpoint resource to allocate a private IP address in a VNET subnet via which IoT Hub resource will be reachable.


### Service ingress

There are two possibilities for service ingress under the VNET pattern:

* If customer services are already deployed in an Azure VNET (which is the case for a VM or a Kubernetese cluster deployed in Azure), the customer can create a private endpoint to a subnet in that VNET or use VNET peering to enable connectivity to another VNET where a private endpoint is already present.

* If customer services are deployed in an on-prem network, the setup additionally involves the use of VPN or Express Route private peering to enable connectivity to an Azure VNET.

In both cases above, the use of private endpoints enables the customer to offload the traffic going to IoT Hub's public-facing endpoint. As a result, if all IoT Hub ingress traffic is sent over private endpoints, the customer can go ahead and block off the public-facing endpoing altogether using the firewall feature.


### Routing (egress)

Customers who adopt the VNET network isolation pattern typically apply this paradigm across all their other Azure resources as well. This typically means that the public-facing endpoints of all resources being blocked. Consequently, such a setup imacts IoT Hub's [message routing feature](../iot-hub/iot-hub-devguide-messages-d2c.md) to communicate with those endpoints. This connectivity restriction can be bypassed using RBAC permission assignments that grant access to IoT Hub to interact to the downstream resource. This is achieved using the [Azure First party trusted services capability](../storage/common/storage-network-security.md#trusted-microsoft-services) that is already in use by several other Azure services.

Furthermore, the use of RBAC in this case will eliminate the need for maintaining resource-level access keys. This helps avoid some of the difficulties involved in managing key rollovers.


### Import/export jobs and file upload

At the time of this writing, three other IoT Hub features namely import jobs, export jobs, and file upload, also required connectivity to customer's storage accounts. Similarly, blocking the storage accounts' public-facing endpoint will impact these features.

As part of the announcement today, we are also enabling RBAC for IoT Hub to bypass the network connectivity restrictions as a first party trusted service. 