# CycleCloud: Core Concepts

At its most basic, a High Performance Computing (HPC) system is a pool of computational resources backed by performant file systems, interconnected by low-latency networks. These computational resources are usually managed by HPC Schedulers, software applications that schedule jobs.

Building individual HPC systems on Azure from basic infrastructure units such as Virtual Machines, Disks, and Network Interfaces can be cumbersome, especially if these resources are meant to be ephemeral — existing only for the time required to solve the HPC task at hand. Additionally, operators want to create multiple, separate HPC environments tailored to business units, research teams, or even individuals. Managing multiple HPC systems introduces another level of operational complexity.

## What is CycleCloud?

Azure CycleCloud is a tool that helps construct HPC systems on Azure, orchestrating these systems so that they size elastically according to the HPC tasks at hand, without the hassle of managing basic Azure building blocks. CycleCloud is designed by a team of experienced HPC professionals for HPC administrators and users in mind, particularly users who are looking build HPC systems in Azure that resemble internal HPC infrastructure that they are familiar with.

Operationally, CycleCloud is an application server that is installed in a Linux VM on Azure, or in an internal server that has access to Azure APIs and resources. This application server provides three main functions:

1. A graphical user interface for creating and managing HPC systems on Azure.
2. Autoscaling integrations for HPC schedulers that translate HPC scheduler task requirements into Azure resources.
3. A node preparation and configuration system for converting a provisioned VM into an HPC node.

### What would you use CycleCloud for and what can it do

CycleCloud is targeted at HPC operators (administrators and users) who are deploying HPC systems on Azure and who want to replicate infrastructure they have been running internally, from the HPC scheduler used to file-system mount points for application installs and data access. These users are particularly looking at supporting applications, workflow engines, and computational pipelines without having to retool their internal processes.

CycleCloud provides a rich and declarative templating syntax that enables users to describe their HPC system, from the cluster topology (the number and types of cluster nodes), down to the mount points and applications that will be deployed on each node. CycleCloud is designed to work with HPC schedulers such as PBSPro, Slurm, IBM LSF, Grid Engine, and HT Condor, allowing users to create different queues in each scheduler and map them to compute nodes of different VM sizes on Azure. Additionally, autoscale plugins are integrated with the scheduler head nodes that listen to job queues in each system, and size the compute cluster accordingly by interacting with the autoscale REST API running on the application server.

Besides provisioning and creating HPC nodes, CycleCloud also provides a framework for preparing and configuring a virtual machine, in essence providing a system for converting a bare VM into a functional component of an HPC system. Through this framework, users can do last-mile configuration on a VM.

Additionally, CycleCloud provides the following features:

- **User Access**

    CycleCloud comes with a build-in support for creating local user accounts on each node of a HPC system. With this build-in system, user access can be controlled through a single management plane without deploying a directory service.

- **Monitoring**

    Nodes of the HPC system come with Ganglia configured, and node-level metrics are collected and displayed in the CycleCloud UI. These are useful for monitoring the load on the system, and can be hooked up into reporting and alerting services.

- **Logging**

    CycleCloud provides a system for logging activities an events at the node and application server level.

- **OS portability** — "BYO" Image

    The system does not mandate that a specific VM image or operating system be used. CycleCloud supports the major Windows and Linux operating systems on HPC nodes. Additionally, users can build their own VM image and use that in their HPC system.

- **Infrastructure as code**

    As everything created in CycleCloud is defined in templates and configuration scripts, HPC systems deployed through CycleCloud are repeatable and portable. This provides operators consistency in deploying HPC systems in different environments: Sandbox, Development, Test, and Production. Operators can also deploy identical HPC systems for different business groups or teams to separate accounting concerns.

- **Loosely coupled or tightly coupled workloads**

    HPC clusters created by CycleCloud are designed not only to support loosely coupled or embarrassingly parallel jobs where scale (the size of the cluster) is the primary concern. CycleCloud clusters are also designed with Azure's Infiniband backbone in mind, supporting tightly coupled or MPI-based workloads where node proximity and network latency is critical. These scale-out and tightly coupled concepts are ingrained in the scheduler integrations that CycleCloud supports.

### What CycleCloud is not

There is no job scheduling functionality in CycleCloud. In other words, CycleCloud is not a scheduler, but rather a platform that enables users to deploy their own scheduler into Azure. As mentioned above, CycleCloud comes with built-in support for the commonly used schedulers (PBSPro, Slurm, IBM LSF, Grid Engine, and HT Condor), but CycleCloud users frequently implement their own scheduler on top of the provided autoscaling API.

CycleCloud does not dictate cluster topology; the installation comes with templates that are designed to get HPC systems up and running in Azure quickly, but by customizing the templates HPC operators are able to tailor the infrastructure to meet their — or their users' — requirements. The Azure HPC community provides opinionated templates that are optimized for different types of workloads and industries.

### What a CycleCloud deployed environment looks like

An entire CycleCloud HPC system is deployed on Azure infrastructure, running on VMs that are in your own subscription. CycleCloud itself is installed as an application server on a VM in Azure that requires outbound access to Azure Resource Provider APIs. CycleCloud then starts and manages VMs that form the HPC systems — these typically consist of the HPC scheduler head node(s) and compute nodes, but may also include VM based Network Attached Storage such as an NFS server or BeeGFS cluster, login nodes, bastion hosts, and other components needed to support an HPC infrastructure. The makeup of the HPC system is defined entirely through CycleCloud templates. Additionally, CycleCloud HPC environments can utilize other PaaS services such as Azure NetApp Files, Azure HPC Cache, and Azure Active Directory Domain Service.
