
## Key features
* **High-performance hardware** – These instances are designed and optimized for compute-intensive and network-intensive applications, including high-performance computing (HPC) and batch applications, modeling, and large-scale simulations. 
  
    Details about the Intel Xeon E5-2667 v3 processor (used in the H-series) and Intel Xeon E5-2670 processor (in A8 - A11), including supported instruction set extensions, are at the Intel.com website. 
* **Designed for HPC clusters** – Deploy multiple compute-intensive instances in Azure to create a stand-alone HPC cluster or to add capacity to an on-premises cluster. If you want to, deploy cluster management and job scheduling tools. Or, use the instances for compute-intensive work in another Azure service such as Azure Batch.
* **RDMA network connection for MPI applications** – A subset of the compute-intensive instances (H16r, H16mr, A8, and A9) feature a second network interface for remote direct memory access (RDMA) connectivity. This interface is in addition to the standard Azure network interface available to other VM sizes. 
  
    This interface allows RDMA-capable instances to communicate with each other over an InfiniBand network, operating at FDR rates for H16r and H16mr virtual machines, and QDR rates for A8 and A9 virtual machines. The RDMA capabilities exposed in these virtual machines can boost the scalability and performance of certain Linux and Windows Message Passing Interface (MPI) applications. See [Access to the RDMA network](#access-to-the-rdma-network) in this article for requirements.

## Deployment considerations
* **Azure subscription** – To deploy more than a few compute-intensive instances, consider a pay-as-you-go subscription or other purchase options. If you're using an [Azure free account](https://azure.microsoft.com/free/), you can use only a limited number of Azure compute cores.
* **Pricing and availability** - The compute-intensive VM sizes are offered only in the Standard pricing tier. Check [Products available by region](https://azure.microsoft.com/regions/services/) for availability in Azure regions. 
* **Cores quota** – You might need to increase the cores quota in your Azure subscription from the default value. Your subscription might also limit the number of cores you can deploy in certain VM size families, including the H-series. To request a quota increase, [open an online customer support request](../articles/azure-supportability/how-to-create-azure-support-request.md) at no charge. (Default limits may vary depending on your subscription category.)
  
  > [!NOTE]
  > Contact Azure Support if you have large-scale capacity needs. Azure quotas are credit limits, not capacity guarantees. Regardless of your quota, you are only charged for cores that you use.
  > 
  > 
* **Virtual network** – An Azure [virtual network](https://azure.microsoft.com/documentation/services/virtual-network/) is not required to use the compute-intensive instances. However, you may need at least a cloud-based Azure virtual network for many deployment scenarios, or a site-to-site connection if you need to access on-premises resources such as an application license server. If one is needed, create a new virtual network to deploy the instances. Adding compute-intensive VMs to a virtual network in an affinity group is not supported.
* **Cloud service or availability set** – To use the Azure RDMA network, deploy the RDMA-capable VMs in the same cloud service (if you use the classic deployment model) or the same availability set (if you use the Azure Resource Manager deployment model). If you use Azure Batch, the RDMA-capable VMs must be in the same pool.
* **Resizing** – Because of the specialized hardware used in the compute-intensive instances, you can only resize compute-intensive instances within the same size family (H-series or compute-intensive A-series). For example, you can only resize an H-series VM from one H-series size to another. In addition, resizing from a non-compute-intensive size to a compute-intensive size is not supported.  
* **RDMA network address space** - The RDMA network in Azure reserves the address space 172.16.0.0/16. To run MPI applications on instances deployed in an Azure virtual network, make sure that the virtual network address space does not overlap the RDMA network.

