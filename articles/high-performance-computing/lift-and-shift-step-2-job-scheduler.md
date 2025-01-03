---
title: "Deployment step 2: base services - job scheduler component"
description: Learn about the configuration of the job scheduler during migration deployment step two.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: azure-virtual-machines
ms.subservice: hpc
---

# Deployment step 2: base services - job scheduler component

Job schedulers are responsible for scheduling user jobs, that is, determining where and when jobs should be executed. In the context of the cloud, job schedulers interact with resource orchestrators to acquire/release resources on-demand, which is different from an on-premises environment where resources are fixed and fully available all the time. The most common HPC job schedulers are Slurm, OpenPBS, PBSPro, and LSF.

## Define job scheduler needs

* **Scheduler deployment:**
   - Migrate existing job scheduler configurations to the cloud environment.
   - Utilize the same scheduler available within CycleCloud or migrate to a different scheduler if necessary.

* **Configuration management:**
   - Configure job schedulers to define partitions/queues, Azure SKUs, compute node hostnames, and other parameters.
   - Automatically update scheduler configurations on-the-fly based on changes in resource availability and job requirements.

* **Job submission and management:**
   - Allow end-users to submit jobs for execution according to scheduling and resource access policy rules.
   - Monitor and manage job queues, resource utilization, and job statuses.

## Tools and services

**Job scheduler via CycleCloud:**
  - Use CycleCloud to deploy and manage HPC job schedulers in the cloud.
  - Configure job schedulers like Slurm, OpenPBS, PBSPro, and LSF within the CycleCloud environment.
  - Manage job submissions, queues, and resource allocations through the CycleCloud portal or CLI.

## Best practices for job schedulers in HPC lift and shift architecture

* **Efficient scheduler deployment:**
   - Plan and test the migration of existing job scheduler configurations to the cloud environment to ensure compatibility, performance, and user experience.
   - Use CycleCloud's built-in support for schedulers like Slurm, OpenPBS, PBSPro, and LSF for a smoother deployment process.

* **Optimized configuration management:**
   - To align with changing resource availability and job requirements, regularly update scheduler configurations (for example, scheduler queues/partitions).
   - Automate configuration changes using scripts and tools to minimize manual intervention and reduce the risk of errors.

* **Robust job submission and management:**
   - Implement a user-friendly interface for job submission and management to facilitate end-user interaction with the scheduler.
   - To identify and address potential issues promptly, continuously monitor job queues, resource utilization, and job statuses.

* **Scalability and performance:**
   - Configure dynamic scaling policies to automatically adjust the number of compute nodes based on job demand, optimizing resource utilization and cost.
   - Use performance metrics and monitoring tools to continuously assess and improve the performance of the job scheduler and the overall HPC environment.

These best practices help ensure a smooth transition to cloud-based job scheduling, maintaining efficiency, scalability, and performance for HPC workloads.

## Example steps for setup and deployment

This section provides an overview on deploying and configuring a job scheduler using Azure CycleCloud. It includes steps for selecting and deploying the scheduler, configuring its settings, and migrating an existing on-premises scheduler to the cloud environment.

1. **Using CycleCloud to deploy a job scheduler:**

   - **Deploy job scheduler:**
     - Navigate to the Azure CycleCloud portal and select the desired job scheduler from the available options (for example, Slurm, PBSPro).
     - Follow the prompts to deploy the job scheduler, specifying the required parameters such as resource group, location, and virtual network.
     - Example command for deploying a Slurm scheduler:

       ```bash
       cyclecloud create_cluster -n slurm-cluster -c slurm
       ```

   - **Configure job scheduler:**
     - Once the job scheduler is deployed, configure the scheduler settings through the CycleCloud portal.
     - Define partitions/queues, Azure SKUs, compute node hostnames, and other parameters.

2. **Migrating existing job scheduler settings to CycleCloud:**

      **Slurm**
   - **Export existing configuration:**
     - Export the configuration of the existing on-premises job scheduler.
     - Example command for exporting Slurm configuration:

       ```bash
       scontrol show config > slurm_config.txt
       ```

   - **Evaluate and adjust Slurm configuration:**

      - Open the exported configuration file and evaluate each setting to determine which ones are necessary and relevant for the cloud environment.

      - Common settings to consider include:

        - ControlMachine
        - SlurmdPort
        - StateSaveLocation
        - SlurmdSpoolDir
        - SlurmctldPort
        - ProctrackType
        - AuthType
        - SchedulerType
        - SelectType
        - SelectTypeParameters
        - AccountingStorageType
        - JobCompType

   - **Prepare the CycleCloud Slurm template:**

      - Open the CycleCloud Slurm template configuration file. You can access this file through the CycleCloud UI under the cluster's configuration settings.
      - Locate the section where Slurm configurations are specified.

   - **Add adjusted Slurm settings to CycleCloud Slurm configuration:**

      - For each relevant setting from your on-premises configuration, add it to the Slurm configuration textbox within the CycleCloud Slurm template. Adjust the values as needed to reflect the cloud environment specifics.

## Example job scheduler submission

**Submit Slurm interactive job using srun:**

```bash
#!/bin/bash

# Submit a job using srun
srun --partition=debug --ntasks=1 --time=00:10:00 --job-name=test_job --output=output.txt my_application

```

**Submit Slurm batch script using sbatch:**

```bash
#!/bin/bash

# Create a Slurm batch script
echo "#!/bin/bash
#SBATCH --partition=debug
#SBATCH --ntasks=1
#SBATCH --time=00:10:00
#SBATCH --job-name=test_job
#SBATCH --output=output.txt

# Run the application
my_application" > job_script.sh

# Submit the batch job
sbatch job_script.sh

```

## Resources

- Azure CycleCloud Scheduling and Autoscaling: [product website](/azure/cyclecloud/concepts/scheduling?view=cyclecloud-8&preserve-view=true)
- IBM Spectrum LSF: [external](https://www.ibm.com/docs/en/spectrum-lsf/10.1.0)
- OpenPBS: [external](https://www.openpbs.org/)
- PBSPro: [external](https://altair.com/pbs-professional)
- Slurm: [external](https://slurm.schedmd.com/)
