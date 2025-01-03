---
title: "Deployment step 2: base services - resource orchestrator component"
description: Learn about the configuration of the resource orchestrator during migration deployment step two.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: azure-virtual-machines
ms.subservice: hpc
---

# Deployment step 2: base services - resource orchestrator component

Typically, resources in an on-premises environment are fully available for usage. When you migrate to the cloud, resources need to be provisioned (that is, set-up and configured). This requirement is a core difference between on-premises and cloud environments. Resource orchestrator's provisions the compute nodes and other components (for example, storage and network), **on demand**, to allow the execution of user jobs. In the context of a lift and shift architecture, this component would:

- Provision resources and install the software for job execution based on end-user job submission requests to the job scheduler.
- Verify all resources are healthy for job execution.

When working with lift and shift scenarios, `Azure CycleCloud` can be used to provision a traditional HPC job scheduler in a cloud environment. Azure CycleCloud offers several features to make a smoother transition from on-premises to the cloud environment.

## Define resource needs

* **Compute nodes:**
  - Provision high-performance compute nodes based on job requirements. Configure node types, sizes, and scaling policies to optimize performance and cost.

* **Job scheduler:**
  - Integrate with HPC job schedulers like Slurm, PBS Pro, or LSF. Manage job submissions, monitor job status, and optimize job execution.

* **Login nodes:**
  - Provide access for users to submit and manage jobs. Configure sign-in nodes to handle user authentication and secure shell (SSH) access to the HPC environment.

* **Storage:**
  - Set up storage solutions for job data, results, and logs. Use Azure Managed Lustre, Azure NetApp Files, or Azure Blob Storage based on performance and capacity requirements.

* **Network:**
  - Configure network settings for secure and high-performance communication between compute nodes, storage, and other resources. Use Azure Virtual Networks and Network Security Groups (NSG) to manage network traffic.

## Tools and services

* **Azure CycleCloud:**
  - Use Azure CycleCloud for managing and optimizing HPC environments in the cloud.
  - Deploy and configure HPC clusters through the Azure CycleCloud portal.
  - Set up and manage compute nodes, job schedulers, and storage resources for efficient HPC workloads.

* **Dynamic scaling:**
  - Automatically scale compute resources up or down based on job demand.
  - Configure scaling policies to specify the minimum and maximum number of nodes.
  - Set scaling triggers and cooldown periods.

* **Template-based deployments:**
  - Use predefined templates to deploy various HPC cluster configurations quickly.
  - Define compute node types, network configurations, storage options, and installed software in templates.
  - Customize templates to meet specific requirements, such as including specialized software or configuring specific network settings.

* **Support for multiple schedulers:**
  - Integrate CycleCloud with popular HPC job schedulers like Slurm, PBS Pro, and LSF.
  - Use CycleCloud’s built-in scheduler support or configure custom integrations based on existing on-premises setup.

- **Unified job management:**
  - Manage jobs across hybrid environments from a single interface.
  - Submit, monitor, and control jobs running both on-premises and in the cloud.
  - Use job arrays, dependencies, and other advanced scheduling features to optimize job execution and resource utilization.

## Best practices

* **Plan and test:**
  - Carefully plan your cluster configurations, including node types, storage options, and network settings.
  - Perform test deployments and workloads to ensure everything is set up correctly before scaling up.

* **Automate configuration:**
  - Utilize CycleCloud templates and automation scripts for consistent and repeatable cluster deployments.
  - Automate updates to cluster configurations to respond quickly to changing requirements or new software versions.

* **Monitor and optimize:**
  - Continuously monitor resource utilization and job performance through the CycleCloud portal.
  - To improve performance and reduce costs, optimize cluster configurations based on monitoring data.

* **Secure access:**
  - Implement robust access controls using Azure Active Directory and SSH keys for sign-in nodes.
  - Ensure that only authorized users can access compute and storage resources.

* **Documentation and training:**
  - Maintain detailed documentation of cluster configurations, deployment processes, and operational procedures.
  - Provide training for HPC administrators and users to ensure effective and efficient use of CycleCloud-managed resources.

## Example steps for setup and deployment

This section outlines the steps for installing and configuring Azure CycleCloud, specifically using the CycleCloud Slurm Workspace. It includes instructions for setting up the environment, configuring basic settings, and deploying an HPC cluster with a predefined template.

1. **Install and configure Azure CycleCloud:**

   - **Install CycleCloud Slurm workspace:**

      - Navigate to the Azure Marketplace and search for "Azure CycleCloud Slurm Workspace."
      - Follow the prompts to deploy the CycleCloud Slurm Workspace, specifying the required parameters such as resource group, location, and virtual network.
      - After deployment, configure the environment through the CycleCloud portal.
      - Ensure the Slurm scheduler is set up and ready for job submissions.

      > [!NOTE]
      > For detailed information about Azure CycleCloud Slurm Workspace, visit this [blog post](https://techcommunity.microsoft.com/t5/azure-high-performance-computing/introducing-azure-cyclecloud-slurm-workspace-preview/ba-p/4158433).

   - **Configure the environment:**
     - Use the CycleCloud CLI or web portal to configure the basic settings, such as cloud provider credentials, default regions, and network configurations.
     - Storage accounts and other necessary resources for CycleCloud to use for cluster deployments were already deployed using the preceding Cyclecloud Slurm Workspace marketplace solution.

2. **Create and deploy an HPC cluster:**

   - **Define Cluster Template:**
     - Create a cluster template that specifies the compute node types, job scheduler, software packages, and other configuration details.

     > [!NOTE]
     > An existing Slurm template will have already been created by the Slurm Workspace deployment setup.

   - **Deploy the Cluster:**
     - Use the CycleCloud CLI or web portal to deploy the cluster based on the defined template. Monitor the deployment process to ensure all resources are provisioned and configured correctly.
     - Example command to deploy a cluster:

       ```bash
       cyclecloud create_cluster -f hpc-cluster-template.txt
       ```

## Resources

- Azure CycleCloud Documentation: [product website](/azure/cyclecloud/?view=cyclecloud-8&preserve-view=true)
- Azure CycleCloud Overview: [product website](/azure/cyclecloud/overview?view=cyclecloud-8&preserve-view=true)
- Azure CycleCloud Slurm Workspace: [blog post](https://techcommunity.microsoft.com/t5/azure-high-performance-computing/introducing-azure-cyclecloud-slurm-workspace-preview/ba-p/4158433)
