# Technical Requirements for an Isolation Domain

-   To create an isolation domain, the network fabric must be in provisioned state.

-   The isolation domain is the parent resource of any internal or external networks. Therefore, the isolation domain must be created before any networks.

-   In each internal network, the first eight IP addresses from the subnet are reserved. For example, if the subnet is  10.10.10.0/24, then the IP addresses from  10.10.10.0 to 10.10.10.7 are reserved.

-   For IPv4, the maximum length allowed for a BGP listen range is /28, and the maximum length allowed for a static route prefix is /24. For IPv6, the maximum length allowed for a BGP listen range is /127, and the maximum length allowed for a static route prefix is /64.


- Nexus supports:
    -   3500 Layer 2 isolation domains per Nexus instance
    -   200 Layer 3 isolation domains per Nexus instance


## Information required for the Isolation Domain Resource

When you create an isolation domain resource, the following information must be specified:

-   **Resource group**: The name of the resource group where you want to create the isolation domain. A resource group is a logical container that holds related resources for an Azure solution.

-   **Resource name**: The name of the isolation domain resource. It must be unique within the resource group.

-   **Location**: The Azure region where you want to create the isolation domain. It must match the location of the network fabric resource on which you're deploying the isolation domain.

-   **Network fabric ID**: The resource ID of the network fabric that you want to use for the isolation domain. A network fabric is a managed network service that provides layer 2 and layer 3 connectivity for your workloads.

-   **VLAN ID**: The VLAN ID that you want to use for the isolation domain. It must be a valid VLAN ID between 501 and 3000. It must also be unique within the network fabric resource.

-   **MTU**: The maximum transmission unit for the isolation domain. The default value is 1500.

-   **Administrative state**: Whether the isolation domain is enabled or disabled. You can change the state using the update-admin-state command.

-   **Subscription ID**: The Azure subscription ID for your Operator Nexus instance. It should be the same as the one used for the network fabric resource.

The status of the isolation domain creation or deletion can be monitored using the **Provisioning state**. It can be Succeeded, Failed, or InProgress.
