
Key features of these instances include:

* **High-performance hardware** – The Azure datacenter hardware that runs these instances is designed and optimized for compute-intensive and network-intensive applications, including high-performance computing (HPC) and batch applications, modeling, and large-scale simulations.

* **RDMA network connection for MPI applications** – Set up the A8 and A9 instances to communicate with other A8 and A9 instances over a low-latency, high-throughput network in Azure that is based on remote direct memory access (RDMA) technology. This feature can boost the performance of certain Linux and Windows Message Passing Interface (MPI) applications.

* **Support for HPC clusters** – Deploy cluster management and job scheduling software on the A8, A9, A10, and A11 instances in Azure to create a stand-alone HPC cluster or to add capacity to an on-premises cluster.

>[AZURE.NOTE]A10 and A11 instances have the same performance optimizations and specifications as the A8 and A9 instances. However, they do not include access to the RDMA network in Azure. They are designed for HPC applications that do not require constant and low-latency communication between nodes, also known as parametric or embarrassingly parallel applications.


## Specs

### CPU and memory

The Azure A8, A9, A10, and A11 compute-intensive instances feature high-speed, multicore CPUs and large amounts of memory, as shown in the following table.

Size | CPU | Memory
------------- | ----------- | ----------------
A8 and A10 | Intel Xeon E5-2670<br/>8 cores @ 2.6 GHz | DDR3-1600 MHz<br/>56 GB
A9 and A11 | Intel Xeon E5-2670<br/>16 cores @ 2.6 GHz | DDR3-1600 MHz<br/>112 GB


>[AZURE.NOTE]Additional processor details, including supported instruction set extensions, are at the Intel.com website. 

### Network adapters

A8 and A9 instances have two network adapters, which connect to the following two back-end Azure networks.


Network | Description
-------- | -----------
10-Gbps Ethernet | Connects to Azure services (such as Azure Storage and Azure Virtual Network) and to the Internet.
32-Gbps back end, RDMA capable | Enables low-latency, high-throughput application communication between instances within a single cloud service or availability set. Reserved for MPI traffic only.


>[AZURE.IMPORTANT]See [Access to the RDMA network](#access-to-the-rdma-network) in this article for additional requirements for MPI applications to access the RDMA network.

A10 and A11 instances have a single, 10-Gbps Ethernet network adapter that connects to Azure services and the Internet.

## Deployment considerations

* **Azure subscription** – If you want to deploy more than a small number of compute-intensive instances, consider a pay-as-you-go subscription or other purchase options. If you're using an [Azure free account](https://azure.microsoft.com/free/), you can use only a limited number of Azure compute cores.

* **Cores quota** – You might need to increase the cores quota in your Azure subscription from the default of 20 cores per subscription (if you use the classic deployment model) or 20 cores per region (if you use the Resource Manager deployment model). To request a quota increase, open a support ticket at no charge as shown in [Understanding Azure limits and increases](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/). (Default limits may vary depending on your subscription category.)

    >[AZURE.NOTE]Contact Azure Support if you have large-scale capacity needs. Azure quotas are credit limits, not capacity guarantees. Regardless of your quota, you are charged only for cores that you use.

* **Virtual network** – An Azure [virtual network](https://azure.microsoft.com/documentation/services/virtual-network/) is not required to use the compute-intensive instances. However, you may need at least a cloud-based Azure virtual network for many scenarios, or a site-to-site connection if you need to access on-premises resources such as an application license server. If one is needed, create a new virtual network to deploy the instances. Adding an A8, A9, A10, or A11 VM to a virtual network in an affinity group is not supported.

* **Cloud service or availability set** – To connect through the RDMA network, size A8 or A9 VMs must be deployed in the same cloud service (if you use the classic deployment model) or the same availability set (if you use the Azure Resource Manager deployment model).

* **Pricing** - The A8–A11 VM sizes are available only in the Standard pricing tier.

* **Resizing** – You can't resize an instance of size other than A8–A11 to one of the compute-intensive instance sizes (A8-11), and you can’t resize a compute-intensive instance to a non-compute-intensive size. This is because of the specialized hardware and the performance optimizations that are specific to compute-intensive instances.

* **RDMA network address space** - The RDMA network in Azure reserves the address space 172.16.0.0/16. If you plan to run MPI applications on A8 and A9 instances in an Azure virtual network, make sure that the virtual network address space does not overlap the RDMA network.





