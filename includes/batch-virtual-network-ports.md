- The VNet must be in the same Azure **region** and **subscription** as the Batch account.

- For pools created with a virtual machine configuration, only Azure Resource Manager-based VNets are supported. For pools created with a cloud services configuration, only classic VNets are supported.
  
- To use a classic VNet, the `MicrosoftAzureBatch` service principal must have the `Classic Virtual Machine Contributor` Role-Based Access Control (RBAC) role for the specified VNet. To use an Azure Resource Manager-based VNet, you need to have permissions to access the VNet and to deploy VMs in the subnet.

- The subnet specified for the pool must have enough unassigned IP addresses to accommodate the number of VMs targeted for the pool; that is, the sum of the `targetDedicatedNodes` and `targetLowPriorityNodes` properties of the pool. If the subnet doesn't have enough unassigned IP addresses, the pool partially allocates the compute nodes, and a resize error occurs. 

- Pools in the virtual machine configuration deployed in an Azure VNet automatically allocate additional Azure networking resources. The following resources are needed for each 50 pool nodes in a VNet: 1 network security group, 1 public IP address, and 1 load balancer. These resources are limited by [quotas](../articles/batch/batch-quota-limit.md) in the subscription that contains the virtual network supplied when creating the Batch pool.

- The VNet must allow communication from the Batch service to be able to schedule tasks on the compute nodes. This can be verified by checking if the VNet has any associated network security groups (NSGs). If communication to the compute nodes in the specified subnet is denied by an NSG, then the Batch service sets the state of the compute nodes to **unusable**. 

- If the specified VNet has associated Network Security Groups (NSGs) and/or a firewall, configure the inbound and outbound ports as shown in the following tables:


  |    Destination Port(s)    |    Source IP address      |   Source port    |    Does Batch add NSGs?    |    Required for VM to be usable?    |    Action from user   |
  |---------------------------|---------------------------|----------------------------|----------------------------|-------------------------------------|-----------------------|
  |   <ul><li>For pools created with the virtual machine configuration: 29876, 29877</li><li>For pools created with the cloud services configuration: 10100, 20100, 30100</li></ul>        |    * <br /><br />Although this requires effectively "allow all", the Batch service applies an NSG at the network interface level on each VM created under virtual machine configuration that filters out all non-Batch service IP addresses. | * or 443 |    Yes. Batch adds NSGs at the level of network interfaces (NIC) attached to VMs. These NSGs allow traffic only from Batch service role IP addresses. Even if you open these ports to the Internet, the traffic will get blocked at the NIC. |    Yes  |  You do not need to specify an NSG, because Batch allows only Batch IP addresses. <br /><br /> However, if you do specify an NSG, please ensure that these ports are open for inbound traffic.|
  |    3389 (Windows), 22 (Linux)               |    User machines, used for debugging purposes, so that you can remotely access the VM.    |   *  | No                                    |    No                    |    Add NSGs if you want to permit remote access (RDP or SSH) to the VM.   |                                


  |    Outbound Port(s)    |    Destination    |    Does Batch add NSGs?    |    Required for VM to be usable?    |    Action from user    |
  |------------------------|-------------------|----------------------------|-------------------------------------|------------------------|
  |    443    |    Azure Storage    |    No    |    Yes    |    If you add any NSGs, then ensure that this port is open to outbound  traffic.    |

   Also, ensure that your Azure Storage endpoint can be resolved by any custom DNS servers that serve your VNet. Specifically, URLs of the form `<account>.table.core.windows.net`, `<account>.queue.core.windows.net`, and `<account>.blob.core.windows.net` should be resolvable. 

   If you add a Resource Manager based NSG, you can make use of [service tags](../articles/virtual-network/security-overview.md#service-tags) to select the Storage IP addresses for the specific region for outbound connections. Note that the Storage IP addresses must be the same region as your Batch account and VNet. Service tags are currently in preview in selected Azure regions.