---
title: "Deployment step 5: End-user entry point - End-user entry point component"
description: Learn about the configuration of end-user entry points during migration deployment step five.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: 
services: 
---

# Deployment step 5: End-user entry point - End-user entry point component

Users access the computing environment in different ways. A common access point is through a terminal with ssh via command line interface (CLI). Other mechanisms are graphical user interface via VDI or web portals with on-demand, Jupyter lab, or r-studio. Some users may also rely on ssh via Visual Studio Code (VS Code). An end-user entry point component is key to shape the user experience accessing the HPC cloud resources, and it's highly dependent on the user workflow and application.

Once all the basic infrastructure is deployed, the end-user entry point would:

- Allow end-user to sign in into the machine and submit jobs;
- Allow end-user to request a remote desktop session;
- Allow end-user to request web browser-based sessions to run applications such
  as Jupyter lab or r-studio.

## Define User Entry Point Needs

1. **SSH Access:**
   - Enable users to sign in into the HPC environment via SSH for job submission and management.
   - Ensure secure authentication and connection protocols are in place.

2. **Remote Desktop Access:**
   - Allow users to request and establish remote desktop sessions for graphical applications.
   - Provide VDI solutions that support various operating systems and applications.

3. **Web Browser-based Access:**
   - Support web browser-based sessions for running applications such as Jupyter Lab or RStudio.
   - Ensure seamless integration with the HPC environment and resource management.

## Tools and Services

**SSH Access:**

- Use standard SSH protocols to provide secure command-line access to HPC resources.
- Configure SSH keys and user permissions to ensure secure and efficient access.

**Remote Desktop Access:**

- Utilize VDI solutions such as Windows Virtual Desktop or non-Microsoft VDI providers.
- Configure remote desktop protocols (RDP, VNC) and ensure compatibility with user applications.

**Web Browser-based Access:**

- Deploy web-based platforms like JupyterHub or RStudio Server for interactive sessions.
- To allow seamless access to compute resources, integrate these platforms with the HPC environment.

## Best Practices

1. **Secure Authentication and Access Control:**
   - Implement multifactor authentication (MFA) and SSH key-based authentication for secure access.
   - Use role-based access control (RBAC) to manage user permissions and ensure compliance with security policies.

2. **Optimize User Experience:**
   - Provide clear documentation and training for users on how to access and utilize different entry points.
   - To ensure a smooth user experience, continuously monitor and optimize the performance of access points.

3. **Ensure Compatibility and Integration:**
   - Test and validate the compatibility of remote desktop and web-based access solutions with HPC applications.
   - To provide seamless resource management, integrate access solutions with the existing HPC infrastructure.

4. **Scalability and Performance:**
   - Configure access points to scale based on user demand, ensuring availability and performance during peak usage.
   - Use performance metrics to monitor and optimize the entry point infrastructure regularly.

## Example Steps for Setup and Deployment

**Setting up SSH Access:**

1. **Configure SSH Server:**

   - Install and configure an SSH server on the sign-in nodes.
   - Generate and distribute SSH keys to users and configure user permissions.

      ```bash
      sudo apt-get install openssh-server
      sudo systemctl enable ssh
      sudo systemctl start ssh
      ```

2. **User Authentication:**

    - Set up SSH key-based authentication and configure the SSH server to disable password authentication for added security.

      ```bash
      ssh-keygen -t rsa -b 4096
      ssh-copy-id user@hpc-login-node
      ```

**Setting up Remote Desktop Access:**

1. **Deploy VDI Solution:**

    - Choose and deploy a VDI solution that fits your HPC environment (for example, Windows Virtual Desktop, VNC).
    - Configure remote desktop protocols and ensure they're compatible with user applications.
2. **Configure Remote Desktop Access:**

    - Set up remote desktop services on the HPC sign-in nodes and configure user permissions.

      ```bash
      sudo apt-get install xrdp
      sudo systemctl enable xrdp
      sudo systemctl start xrdp
      ```

**Setting up Web Browser-based Access:**

1. **Deploy JupyterHub or RStudio Server:**

    - Install and configure JupyterHub or RStudio Server on the HPC environment.

      ```bash
      sudo apt-get install jupyterhub
      sudo systemctl enable jupyterhub
      sudo systemctl start jupyterhub
      ````

2. **Integrate with HPC Resources:**

    - Configure the web-based platforms to integrate with the HPC scheduler and compute resources.

      ```bash
      jupyterhub --no-ssl --port 8000
      ```

---

## Resources

- Azure CycleCloud CLI installation guide: [product website](/azure/cyclecloud/how-to/install-cyclecloud-cli?view=cyclecloud-8&preserve-view=true)
- Azure CycleCloud CLI reference guide: [product website](/azure/cyclecloud/cli?view=cyclecloud-8&preserve-view=true)
- Azure CycleCloud REST API reference guide: [product website](/azure/cyclecloud/api?view=cyclecloud-8&preserve-view=true)
- Azure CycleCloud Python API reference guide: [product website](/azure/cyclecloud/python-api?view=cyclecloud-8&preserve-view=true)
- Remote visualization via OnDemand and AzHop: [blog post](https://techcommunity.microsoft.com/t5/azure-high-performance-computing/azure-hpc-ondemand-platform-cloud-hpc-made-easy/ba-p/2537338)
- LSF Scheduler CLI commands: [external](https://www.ibm.com/docs/en/spectrum-lsf/10.1.0?topic=reference-command)
- PBS Scheduler CLI commands: [external](https://2021.help.altair.com/2021.1.2/PBS%20Professional/PBSUserGuide2021.1.2.pdf)
- Slurm Scheduler CLI commands: [external](https://slurm.schedmd.com/pdfs/summary.pdf)
- Open OnDemand: [external](https://openondemand.org/)
