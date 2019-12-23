CycleCloud Core Concepts

Distilling High Performance Computing (HPC) systems down to its building blocks, leaves one with pools of computational resources backed by performant file systems, interconnected by low-latency networks. These computational resources are usually managed by a class of software called HPC Schedulers that does job scheduling.

Building individual HPC systems on Azure from basic Azure infrastructure units such as Virtual Machines, Disks, and Network Interfaces can be tedious to manage, especially if these resources are meant to be ephemeral -- existing only for the time required to solve the HPC task at hand. Additionally, operating in Azure means that one is not limited to a single HPC system for all users; being able to create separate HPC systems for individual business units, research teams, or even individuals, allow operators to create HPC systems tailored to a specific purpose or workflow. 

What is CycleCloud

Azure CycleCloud is a tool that helps construct HPC systems on Azure, orchestrating these systems so that they size elastically according to the HPC tasks at hand, without requiring a user to operate the system at the level of the basic Azure building blocks. CycleCloud is designed by a team of experienced HPC professionals for HPC administrators or users in mind, in particular users who are looking at migrating an internal HPC infrastructure onto Azure. 

Operationally, CycleCloud is an application server that is installed in a Linux VM on Azure, or in an internal server that has access to Azure APIs and resources. This application server provides three main functions:
1. A graphical user-interface for creating and managing HPC systems on Azure.
2. An autoscaling API and autoscaling plugins for HPC schedulers, these work together to provision resources on Azure based on tasks requirements.
3. A node preparation and configuration system for converting a provisioned VM into a HPC node.

What would you use CycleCloud for and what can it do

CycleCloud is targeted at HPC operators (administrators and users) who are deploying HPC systems on Azure and replicate infrastructure they have been running internally, from the HPC scheduler used to file system mount points for application installs and data access. These users are particularly looking at supporting applications, workflow engines, and computational pipelines without having to retool their processes.

CycleCloud provides a rich and declarative templating syntax that enables users to describe their HPC system, from the cluster topology (the number and types of cluster nodes), down to the mount points and applications that will be deployed on each node. CycleCloud is designed to work with HPC schedulers such as PBSPro, Slurm, IBM LSF, Grid Engine, and HT Condor, such that users can create different queues in each scheduler and map that to the cluster topology of different VM sizes on Azure. Additionally, autoscale plugins are integrated with the scheduler headnodes that listen to job queues in each system, and size the compute cluster accordingly by interacting with the autoscale REST API running on the application server.

Besides provisioning and creating HPC nodes, CycleCloud also provides a framework for preparing and configuring a virtual machine, in essence providing a system for converting a bare VM into a functional component of a HPC system. Through this framework, users can do last-mile configuration on a VM.

Additionally, CycleCloud provides the following features:
- User Access
CycleCloud comes with a build-in support for creating local user accounts on each node of a HPC system. With this build-in system, user access can be controlled through a single management plane without deploying a directory service.

- Monitoring 
Nodes of the HPC system come with Ganglia configured, and node-level metrics are collected and displayed in the CycleCloud UI. These are useful for monitoring the load on the system, and can be hooked up into reporting and alerting services.
- Logging
CycleCloud provides a system for logging activities an events at the node and application server level.
- OS portability -- BYO Image
The system does not mandate that a specific VM image or operating system be used. CycleCloud supports the major Windows and Linux operating systems on HPC nodes. Additionally, users can build their own VM image and use that in their HPC system. 
- Infrastructure as code
As everything created in CycleCloud is defined in templates and configuration scripts, HPC systems deployed through CycleCloud are repeatable and portable. This provides operators consistency to deploy HPC systems through different environments: Sandbox, Development, Test, Production. Operators can also deploy identical HPC systems for different business groups or teams to separate accounting concerns.
- Loosely coupled or tightly coupled workloads
HPC clusters created by CycleCloud is designed not only to support loosely coupled or embarassingly parallel jobs where scale (the size of the cluster) is the primary concern. CycleCloud clusters are also designed with Azure's infiniband backbone in mind, supporting tightly-coupled or MPI-based workloads where node proximity and network latency is critical. These scale-out and tightly-coupled concepts are ingrained in the scheduler integrations CycleCloud supports.

What CycleCloud is not

There is no job scheduling functionality in CycleCloud. In other words, CycleCloud is not a scheduler, but rather a platform that enables users to deploy their own scheduler into Azure. As mentioned above, CycleCloud comes with build-in support for the commonly used schedulers (PBSPro, Slurm, IBM LSF, Grid Engine, and HT Condor), but CycleCloud users frequently implement their own scheduler on top of the autoscaling API that is provided.

- Does not mandate set up, install, and configuration
- Besides deploying schedulers does not support middleware services
- Does not dictate cluster topology
- Does not enforce a user management system
- 

What a CycleCloud deployed environment looks like
