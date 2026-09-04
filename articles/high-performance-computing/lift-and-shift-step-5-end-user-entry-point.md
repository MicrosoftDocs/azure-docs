---
title: End-user entry point configuration
description: Learn how to configure end-user entry points during a migration of high performance computing architecture.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/24/2026
ms.topic: how-to
ms.service: azure-virtual-machines
ms.subservice: hpc
ms.collections:
  - hpc-migration-content
  - migration
  - onprem-to-azure
# Customer intent: "As an HPC user, I want to configure various entry points for accessing cloud resources, so that I can optimize my workflows and efficiently submit jobs through SSH, remote desktop, or web-based applications like JupyterHub and RStudio."
---

# End-user entry point configuration

Users access the computing environment in different ways. A common access point is through a terminal with ssh via command line interface (CLI). Other mechanisms are graphical user interface via VDI or web portals with on-demand, Jupyter lab, or r-studio. Some users may also rely on ssh via Visual Studio Code (VS Code). An end-user entry point component is key to shape the user experience accessing the HPC cloud resources, and it's highly dependent on the user workflow and application.

Once all the basic infrastructure is deployed, the end-user entry point would:

- Allow end-user to sign in into the machine and submit jobs;
- Allow end-user to request a remote desktop session;
- Allow end-user to request web browser-based sessions to run applications such
  as Jupyter lab or r-studio.

## Define user entry point needs

* **SSH access:**
  - Enable users to sign in into the HPC environment via SSH for job submission and management.
  - Ensure secure authentication and connection protocols are in place.

* **Remote desktop access:**
  - Allow users to request and establish remote desktop sessions for graphical applications.
  - Determine whether users need hardware-accelerated 3D rendering. Post-processing and visualization workloads do; terminal and administrative access doesn't.
  - Provide VDI solutions that support the applications your users run.

* **Web browser-based access:**
  - Support web browser-based sessions for running applications such as Jupyter Lab or RStudio.
  - Ensure seamless integration with the HPC environment and resource management.

## Tools and services

* **SSH access:**
  - Use standard SSH protocols to provide secure command-line access to HPC resources.
  - Configure SSH keys and user permissions to ensure secure and efficient access.

* **Remote desktop access:**
  - For administrative and terminal-oriented access, a basic remote desktop server such as xrdp is sufficient. See [Use xrdp with Linux](/azure/virtual-machines/linux/use-remote-desktop).
  - For visualization and post-processing workloads that render in 3D, use a GPU-enabled VM size and a session technology that supports hardware-accelerated OpenGL. See [Remote visualization for HPC workloads on Azure](remote-visualization-overview.md).
  - Select the VM size accordingly. NV-family sizes expose the graphics driver functionality that accelerated rendering depends on; compute-oriented sizes generally don't.

* **Web browser-based access:**
  - Deploy web-based platforms like JupyterHub or RStudio Server for interactive sessions.
  - To allow seamless access to compute resources, integrate these platforms with the HPC environment.
  - Where a scheduler is in use, [Open OnDemand](/azure/cyclecloud/how-to/ccws/configure-open-ondemand) provides browser-based shell, file management, and interactive sessions in one portal.

## Best practices

* **Secure authentication and access control:**
  - Implement multifactor authentication (MFA) and SSH key-based authentication for secure access.
  - Use role-based access control (RBAC) to manage user permissions and ensure compliance with security policies.

* **Optimize user experience:**
  - Provide clear documentation and training for users on how to access and use different entry points.
  - To ensure a smooth user experience, continuously monitor and optimize the performance of access points.

* **Ensure compatibility and integration:**
  - Test and validate the compatibility of remote desktop and web-based access solutions with HPC applications.
  - Verify that GPU acceleration is active in remote desktop sessions. A session that renders correctly but slowly usually falls back to software rendering.
  - Integrate access solutions with the existing HPC infrastructure to provide seamless resource management.

* **Scalability and performance:**
   - Configure access points to scale based on user demand, ensuring availability and performance during peak usage.
   - Use performance metrics to monitor and optimize the entry point infrastructure regularly.

## Example steps for setup and deployment

**Setting up SSH access:**

1. **Configure SSH server:**

   - Install and configure an SSH server on the sign-in nodes.
   - Generate and distribute SSH keys to users and configure user permissions.

      ```bash
      sudo apt-get install openssh-server
      sudo systemctl enable ssh
      sudo systemctl start ssh
      ```

1. **User authentication:**

    - Set up SSH key-based authentication and configure the SSH server to disable password authentication for added security.

      ```bash
      ssh-keygen -t rsa -b 4096
      ssh-copy-id user@hpc-login-node
      ```

**Setting up remote desktop access:**

The steps depend on whether users need hardware-accelerated rendering.

1. **For administrative access without 3D acceleration:**

    - Install a remote desktop server on the sign-in nodes and configure user permissions.

      ```bash
      sudo apt-get install xrdp
      sudo systemctl enable xrdp
      sudo systemctl start xrdp
      ```

    - This setup provides a working desktop for terminal work and file management. It doesn't accelerate OpenGL applications.

1. **For visualization workloads with 3D acceleration:**

    - Deploy the session on an NV-family VM size and install the graphics driver, not the compute driver.
    - Choose a session technology that supports GPU-accelerated rendering.
    - Verify acceleration explicitly before handing the environment to users.
    - For the deployment models, GPU size selection, and session technology options, see [Remote visualization for HPC workloads on Azure](remote-visualization-overview.md).

**Setting up web browser-based access:**

1. **Deploy JupyterHub or RStudio Server:**

    - Install and configure JupyterHub or RStudio Server on the HPC environment.

      ```bash
      sudo apt-get install jupyterhub
      sudo systemctl enable jupyterhub
      sudo systemctl start jupyterhub
      ````

1. **Integrate with HPC resources:**

    - Configure the web-based platforms to integrate with the HPC scheduler and compute resources.

      ```bash
      jupyterhub --no-ssl --port 8000
      ```

## Resources

- Azure CycleCloud CLI installation guide: [product website](/azure/cyclecloud/how-to/install-cyclecloud-cli?view=cyclecloud-8&preserve-view=true)
- Azure CycleCloud REST API reference guide: [product website](/azure/cyclecloud/api?view=cyclecloud-8&preserve-view=true)
- Azure CycleCloud Python API reference guide: [product website](/azure/cyclecloud/python-api?view=cyclecloud-8&preserve-view=true)
- Azure CycleCloud CLI reference guide: [product website](/azure/cyclecloud/cli?view=cyclecloud-8&preserve-view=true)
- Remote visualization for HPC workloads on Azure: [Remote visualization for HPC workloads on Azure](remote-visualization-overview.md)
- Choose a remote visualization deployment model: [Choose a remote visualization deployment model](remote-visualization-choose-deployment-model.md)
- Configure Open OnDemand with CycleCloud: [product website](/azure/cyclecloud/how-to/ccws/configure-open-ondemand)
- LSF Scheduler CLI commands: [external](https://www.ibm.com/docs/en/spectrum-lsf/10.1.0?topic=reference-command)
- PBS Scheduler CLI commands: [external](https://2021.help.altair.com/2021.1.2/PBS%20Professional/PBSUserGuide2021.1.2.pdf)
- Slurm Scheduler CLI commands: [external](https://slurm.schedmd.com/pdfs/summary.pdf)
- Open OnDemand: [external](https://openondemand.org/)
