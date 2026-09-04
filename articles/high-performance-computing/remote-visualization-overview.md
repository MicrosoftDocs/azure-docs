---
title: Remote visualization for high-performance computing on Azure
description: Learn how remote visualization keeps interactive HPC graphics and data close to Azure compute and storage resources.
ai-usage: ai-generated
author: padmalathas
ms.author: padmalathas
ms.date: 08/24/2026
ms.topic: concept-article
ms.service: azure-virtual-machines
ms.subservice: hpc
# Customer intent: "As an HPC architect, I want to understand remote visualization on Azure so that I can provide secure, responsive access to graphical workloads near their compute and data."
---

# Remote visualization for high-performance computing on Azure

Remote visualization runs a graphical application on an Azure virtual machine (VM) and streams the application's display to a user's device. The application stays close to the high-performance computing (HPC) resources and data that it uses. Instead of moving large result sets to a workstation, the remote-display protocol sends rendered pixels to the user and returns keyboard and pointer input to the application.

Remote visualization is an access pattern, not a single Azure service. A complete solution combines Azure infrastructure with remote-display software, identity, networking, storage, and, for cluster-integrated deployments, an HPC scheduler or web portal.

## Why visualization moves to the data

HPC simulations can produce datasets that are expensive or impractical to copy to each user's device. Keeping visualization near the data can:

- Reduce transfers of large models, meshes, images, and simulation results.
- Keep controlled data within the Azure environment.
- Give users access to GPU resources that aren't available on their local devices.
- Avoid maintaining a separate local copy of the application and its dependencies.

This design doesn't eliminate network requirements. The user experience still depends on round-trip latency, available bandwidth, display resolution, image quality, and the remote-display protocol. Test the complete path from each expected user location.

## How HPC remote visualization differs from general VDI

General-purpose virtual desktop infrastructure (VDI) usually provides productivity desktops and centrally managed applications. HPC remote visualization has additional requirements:

- Graphical applications often read large datasets from shared HPC storage.
- Sessions can require dedicated or fractional GPUs and application-specific drivers.
- Interactive work might precede or follow a scheduled batch job.
- Some sessions need scheduler-allocated compute resources rather than a fixed desktop VM.
- Application and remote-display licenses can constrain VM size, session density, or scaling.

Use VDI services for general desktop requirements. Use an HPC remote visualization design when the graphical session must be close to HPC applications, storage, or scheduler-managed resources.

## When to use remote visualization

Consider remote visualization when users need to:

- Inspect large simulation results without copying the full dataset to a local workstation.
- Use Linux engineering, scientific, or three-dimensional applications interactively.
- Render graphics by using a GPU that's colocated with HPC data and compute resources.
- Maintain a persistent cloud workstation or reconnect to a long-running graphical session.
- Start interactive work through the same identity, storage, and scheduler environment as batch jobs.

Remote visualization might not be the best choice when a workload can render results noninteractively, a web-native application meets the requirement, or network latency prevents an acceptable interactive experience. Test with representative users, datasets, and applications before you select a production design.

## Architecture

A remote visualization solution typically includes the following components:

- **User entry point:** A native remote-display client or a browser-based portal.
- **Session host:** A Linux VM that hosts the desktop or graphical application and the remote-display software.
- **Rendering resource:** CPU rendering for lighter workloads or an Azure GPU VM for hardware-accelerated graphics.
- **HPC integration:** Optional scheduler and portal integration for interactive jobs that need dynamically allocated cluster resources.
- **Storage:** Managed disks or shared storage that makes home directories, application data, and HPC results available to the session.
- **Identity:** Linux identity and access controls, or integration with an organizational identity provider when the selected software supports it.
- **Network:** Private connectivity from the user to the session entry point and controlled connectivity to compute and storage resources.

Keep the rendered application and its source data in the same Azure region when possible. Remote-display protocols send pixels and user input across the network, while the larger application datasets remain in Azure.

### Direct and split rendering

In direct rendering, the application and the X server or desktop session use the same GPU. In split-rendering designs, software such as VirtualGL redirects an application's OpenGL rendering to a GPU and sends the resulting images through a separate remote-display session. Split rendering can give an application hardware acceleration without requiring the remote-display protocol itself to implement the application's rendering API.

The exact configuration depends on the application, display server, GPU driver, desktop environment, and remote-display product. Confirm that the software vendors support the complete combination. A successful OpenGL demonstration doesn't establish support or performance for the production application.

## Deployment models

Remote visualization for HPC commonly uses one of two deployment models:

- **Standalone visualization:** One or more persistent session-host VMs provide desktops or applications independently of an HPC scheduler. This model suits individual workstations, small teams, and applications that don't need scheduled compute resources.
- **Cluster-integrated visualization:** A portal or access node starts an interactive session through an HPC scheduler. The session uses shared identity and storage with the cluster and can use dynamically provisioned compute resources.

Some workloads don't require either model. Browser-native notebooks, application-specific web interfaces, or noninteractive rendering might provide a simpler entry point. For a detailed comparison, see [Choose a remote visualization deployment model for Azure HPC](remote-visualization-choose-deployment-model.md).

## GPU considerations

Select a VM based on the application's supported GPU vendor and driver, graphics memory, CPU and memory requirements, storage throughput, session density, and regional availability. Don't assume that all Azure GPU VM families use the same GPU vendor or driver stack.

For example, NVadsA10_v5 VMs use NVIDIA A10 GPUs, while NVads V710 v5 VMs use AMD Radeon PRO V710 GPUs. Their driver and rendering configurations aren't interchangeable. Confirm application compatibility with the exact VM size, operating system, remote-display software, and driver combination. For current options, see [NV-family GPU-accelerated VM sizes](/azure/virtual-machines/sizes/gpu-accelerated/nv-family).

### NVadsA10_v5 sizing

NVadsA10_v5 sizes provide fractional or full NVIDIA A10 GPUs. The fraction determines the available frame-buffer memory.

| VM size | vCPUs | Memory (GiB) | A10 GPUs | GPU memory (GiB) |
| --- | ---: | ---: | ---: | ---: |
| Standard_NV6ads_A10_v5 | 6 | 55 | 1/6 | 4 |
| Standard_NV12ads_A10_v5 | 12 | 110 | 1/3 | 8 |
| Standard_NV18ads_A10_v5 | 18 | 220 | 1/2 | 12 |
| Standard_NV36ads_A10_v5 | 36 | 440 | 1 | 24 |
| Standard_NV36adms_A10_v5 | 36 | 880 | 1 | 24 |
| Standard_NV72ads_A10_v5 | 72 | 880 | 2 | 48 |

Use the table as an initial capacity reference, not as a session-density guarantee. Benchmark the application's CPU, system memory, GPU memory, and storage demands. For current specifications, see [NVadsA10_v5 sizes](/azure/virtual-machines/sizes/gpu-accelerated/nvadsa10v5-series).

### GPU drivers

Install the driver type supported for both the VM family and the workload:

- **NVIDIA:** NVadsA10_v5 virtual workstation and virtual application workloads use the Azure-supported NVIDIA GRID driver. GRID installation requires Secure Boot and virtual Trusted Platform Module (vTPM) to be disabled. Follow [Install NVIDIA GPU drivers on N-series VMs running Linux](/azure/virtual-machines/linux/n-series-driver-setup) for the current driver and supported operating systems.
- **AMD:** NVads V710 v5 VMs support the AMD GPU Driver Extension, a preconfigured Azure Marketplace image, or a documented manual installation for supported Ubuntu versions. For graphics workloads, follow [Install AMD GPU drivers on NVads V710-series Linux VMs](/azure/virtual-machines/linux/azure-n-series-amd-gpu-driver-linux-installation-guide).

Don't substitute a compute driver for a graphics driver solely because the application also uses GPU compute. Verify the application's rendering and compute requirements together.

Avoid retired or retiring VM families in new designs. NVv3 and NVv4 retire on September 30, 2026. Review [NV-family GPU-accelerated VM sizes](/azure/virtual-machines/sizes/gpu-accelerated/nv-family#previous-generation-nv-family-series) and plan migrations before a retirement date.

## Choose a session technology

Session technologies offer different user experiences and support boundaries.

| Technology pattern | User experience | Common HPC fit | Considerations |
| --- | --- | --- | --- |
| Native remote-display client | Dedicated desktop or application client | Persistent engineering workstation | Client deployment, protocol ports, licensing, reconnect behavior, and peripheral controls |
| Browser-based remote desktop | Desktop streamed through a web browser | Managed access without a native client | Web gateway security, certificates, browser compatibility, and session limits |
| HPC web portal | Files, jobs, shells, notebooks, or interactive apps from one portal | Scheduler-integrated shared clusters | Portal and scheduler configuration, app definitions, access-node capacity, and release-specific features |
| VNC-based session | Remote Linux desktop through a VNC client or web gateway | Controlled environments and proofs of concept | Encryption, authentication, GPU acceleration, and vendor support vary by implementation |

Open OnDemand is an example of an HPC web portal. Azure CycleCloud Workspace for Slurm can deploy Open OnDemand as a web entry point for its Slurm environment. Available interactive applications and integrations depend on the workspace release and configuration. For current authentication guidance, see [Configure Open OnDemand with CycleCloud](/azure/cyclecloud/how-to/ccws/configure-open-ondemand).

## Storage and data access

Place visualization hosts where they can use the same authoritative data as the HPC workflow. Depending on the deployment model, sessions can use managed disks, Azure Files, Azure NetApp Files, Azure Managed Lustre, or another shared file system supported by the application and cluster design.

Plan for:

- Consistent user and group identifiers across session hosts and shared storage.
- Home-directory, project-directory, and scratch-space behavior.
- Metadata and small-file performance as well as sequential throughput.
- Mount recovery after reboot or node replacement.
- Data lifecycle, backup, snapshots, and access auditing.

Don't use a session host's temporary disk as the only copy of user or project data.

## Network design

Keep session hosts, data, and dependent compute resources in the same Azure region when possible. For production, place visualization resources on private networks and provide an approved user access path, such as point-to-site VPN or Azure ExpressRoute.

Azure Bastion can provide browser-based SSH or RDP for VM administration. It isn't a general-purpose proxy for remote-display products or Open OnDemand application traffic. Design the end-user path for the selected session technology and expose only its required endpoints.

Measure latency from each user population. Network bandwidth affects image quality and frame rate, but latency often determines how responsive interactive rotation, zooming, and selection feel.

## Security considerations

Use private network access as the default for production deployments. Connect users through an approved private access path such as a point-to-site VPN or Azure ExpressRoute, and restrict network security group rules to the required sources and ports.

Also apply these controls:

- Don't expose desktop services or administrative interfaces directly to the public internet.
- Use multifactor authentication where the selected identity integration supports it.
- Use SSH public-key authentication and least privilege for administrative access.
- Use trusted certificates for browser-based entry points.
- Restrict clipboard, file transfer, drive mapping, and device redirection according to data-handling requirements.
- Patch the operating system, GPU driver, remote-display software, and applications through a tested image lifecycle.
- Monitor sign-ins, VM health, disk capacity, GPU utilization, and license consumption.

For a shared portal, separate administrative access from user access and review the portal's application definitions before deployment. Interactive applications can inherit a user's access to shared storage and scheduled resources.

## When remote visualization isn't suitable

Use another access pattern when:

- Users need high-frame-rate or latency-sensitive interaction that the network path can't deliver.
- The application or license agreement doesn't support remote use, virtualization, or the selected GPU.
- A web-native application or notebook provides the required interaction with less operational overhead.
- Noninteractive rendering can generate the required images or animations as a scheduled job.
- You can reduce or transform results in Azure and transfer them safely for local analysis.

## Design and validation considerations

Before production deployment, validate the following areas:

| Area | Questions to answer |
| --- | --- |
| Application | Does the software vendor support the selected operating system, GPU, driver, and remote-display method? |
| User experience | Are latency, image quality, display resolution, input devices, and reconnect behavior acceptable from user locations? |
| Capacity | How many concurrent sessions can each VM support with representative models and datasets? |
| Data | Can the session host access the required storage with the correct identity and permissions? |
| Operations | How are images patched, sessions recovered, capacity scaled, and licenses monitored? |
| Security | Is access private, authenticated, encrypted, and limited to approved data-transfer features? |

A simple graphics demonstration doesn't establish application support or production performance. Use the actual application and a representative dataset for validation.

## Support boundaries

Microsoft supports the Azure infrastructure and Microsoft products in the solution. Remote-display products and application-specific integrations can have separate vendor support and licensing terms. Use vendor-maintained installation guidance and a supported integration. Don't deploy an unvalidated community project as though it's a Microsoft-supported feature.

## Next steps

- [Choose a remote visualization deployment model for Azure HPC](remote-visualization-choose-deployment-model.md)
- [Enable user access and job submission for Azure HPC](lift-and-shift-step-5-overview.md)
- [Plan your CycleCloud Workspace for Slurm deployment](/azure/cyclecloud/how-to/ccws/plan-your-deployment).
