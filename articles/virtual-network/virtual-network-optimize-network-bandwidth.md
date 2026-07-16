---
title: Optimize Azure VM network throughput
description: Optimize network throughput for Windows and Linux virtual machines, including major distributions such as Ubuntu and Red Hat.
services: virtual-network
author: asudbring
manager: Gerald DeGrace
ms.service: azure-virtual-network
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 08/02/2024
ms.author: allensu
# Customer intent: As a system administrator managing Azure virtual machines, I want to optimize network throughput for both Windows and Linux VMs, so that I can improve performance and ensure efficient resource utilization during data transfers.
---

# Optimize network throughput for Azure virtual machines

Azure virtual machines (VMs) have default network settings that can be optimized to improve throughput and consistency. This article describes how to optimize network performance for Windows and Linux VMs.

> [!IMPORTANT]
> Many of the optimizations described in this article (for example, congestion control, queue discipline, buffer sizes, and NIC tuning) affect how traffic flows between systems.
>
> For best results, apply these settings consistently across all virtual machines participating in the workload, including:
> - Client systems
> - Server systems
>
> Applying these configurations to only a subset of virtual machines can lead to:
> - Inconsistent throughput
> - Increased packet retransmissions
> - Suboptimal congestion behavior
>
> Always validate changes across the entire data path and test performance end-to-end.

## Windows virtual machines

If your Windows VM supports *accelerated networking*, enable that feature for optimal throughput. For more information, see [Create a Windows VM with accelerated networking](create-vm-accelerated-networking-powershell.md).

For all other Windows VMs, Receive Side Scaling (RSS) can provide higher maximum throughput than a VM without RSS. RSS might be disabled by default. To check whether RSS is enabled and enable it, follow these steps:

1. Check whether RSS is enabled for a network adapter by using the [Get-NetAdapterRss](/powershell/module/netadapter/get-netadapterrss) PowerShell command. In the following example, output from `Get-NetAdapterRss` shows that RSS isn't enabled.

   ```powershell
   Name                    : Ethernet
   InterfaceDescription    : Microsoft Hyper-V Network Adapter
   Enabled                 : False
   ```

1. To enable RSS, enter the following command:

   ```powershell
   Get-NetAdapter | % {Enable-NetAdapterRss -Name $_.Name}
   ```

   This command has no output. It changes network interface card (NIC) settings and causes temporary connectivity loss for about one minute. A **Reconnecting** dialog appears during the connectivity loss. Connectivity is typically restored after the third attempt.

1. Confirm that RSS is enabled in the VM by entering the `Get-NetAdapterRss` command again. If successful, the following example output is returned:

   ```powershell
   Name                    : Ethernet
   InterfaceDescription    : Microsoft Hyper-V Network Adapter
   Enabled                 : True
   ```

## Linux virtual machines

RSS is enabled by default in Linux virtual machines (VMs) in Azure. Linux kernels released since October 2017 include additional network optimization options that help Linux VMs achieve higher throughput.

### Enable Azure Accelerated Networking for optimal throughput

Azure Accelerated Networking can significantly improve throughput and reduce latency and jitter. Depending on the VM size and platform generation, Azure uses one of two technologies: [Mellanox](/azure/virtual-network/accelerated-networking-how-it-works), which is widely available, and [MANA](/azure/virtual-network/accelerated-networking-mana-overview), which is developed by Microsoft.

### Azure tuned kernels

Some distributions, such as Ubuntu (Canonical) and SUSE, provide [Azure tuned kernels](/azure/virtual-machines/linux/endorsed-distros#azure-tuned-kernels).

Use the following command to verify that you're using the Azure kernel, which usually includes `azure` in the kernel name.

```bash
uname -r

# Sample output for an Azure kernel on an Ubuntu Linux VM
6.8.0-1017-azure
```

### Other Linux distributions

Most modern distributions include major networking improvements in newer kernels. Check your kernel version and use 4.19 or later when possible. Newer kernels include better networking behavior and support modern congestion control options such as BBR.

## Achieving consistent transfer speeds in Linux VMs in Azure

Linux VMs can show inconsistent transfer speeds, especially during large regional transfers (for example, 1 GB to 50 GB between West Europe and West US). Common causes include older kernels, default buffer sizes, and untuned congestion control or queue discipline settings.

To get more consistent throughput, apply the following baseline tuning and then test congestion/qdisc combinations for your workload.

### Baseline sysctl tuning (copy/paste)

Apply the following baseline sysctl settings:

```bash
sudo tee /etc/sysctl.d/99-azure-network-tuning.conf > /dev/null <<'EOF'
# Buffer and memory tuning
# Overall TCP memory pressure thresholds (min, pressure, max pages)
net.ipv4.tcp_mem = 4096 87380 67108864
# Overall UDP memory pressure thresholds (min, pressure, max pages)
net.ipv4.udp_mem = 4096 87380 33554432
# Per-socket TCP read buffer limits (min, default, max bytes)
net.ipv4.tcp_rmem = 4096 87380 67108864
# Per-socket TCP write buffer limits (min, default, max bytes)
net.ipv4.tcp_wmem = 4096 65536 67108864
# Default socket receive buffer size in bytes
net.core.rmem_default = 33554432
# Default socket send buffer size in bytes
net.core.wmem_default = 33554432
# Minimum UDP send buffer per socket in bytes
net.ipv4.udp_wmem_min = 16384
# Minimum UDP receive buffer per socket in bytes
net.ipv4.udp_rmem_min = 16384
# Maximum socket send buffer size in bytes
net.core.wmem_max = 134217728
# Maximum socket receive buffer size in bytes
net.core.rmem_max = 134217728
# Busy polling time in microseconds for low-latency packet receive
net.core.busy_poll = 50
# Busy read time in microseconds when polling sockets
net.core.busy_read = 50

# Extra TCP and networking settings
# Enable TCP timestamps for RTT measurement and PAWS protection
net.ipv4.tcp_timestamps = 1
# Allow safer TIME-WAIT socket reuse for outbound connections
net.ipv4.tcp_tw_reuse = 1
# Expand available ephemeral source port range
net.ipv4.ip_local_port_range = 1024 65535
# Increase packets processed per NAPI polling cycle
net.core.netdev_budget = 1000
# Increase per-socket ancillary/option memory limit in bytes
net.core.optmem_max = 65535
# Disable F-RTO (typically unnecessary on stable wired paths)
net.ipv4.tcp_frto = 0
# Increase maximum listen backlog for pending connections
net.core.somaxconn = 32768
# Increase ingress packet backlog queue length
net.core.netdev_max_backlog = 32768
# Increase per-CPU packet processing quota per softirq cycle
net.core.dev_weight = 64
EOF

sudo sysctl --system
```

### Congestion control and qdisc tests (sysctl)

Different workloads behave differently. Test these combinations and keep the one that gives the best results for your latency, throughput, and retransmission profile.

1. **BBR + FQ** (often a strong default for high-throughput and long-haul transfers)
   ```bash
   sudo sysctl -w net.ipv4.tcp_congestion_control=bbr
   sudo sysctl -w net.core.default_qdisc=fq
   ```
2. **BBR + PFIFO_FAST** (useful to compare queue behavior under bursty or mixed traffic)
   ```bash
   sudo sysctl -w net.ipv4.tcp_congestion_control=bbr
   sudo sysctl -w net.core.default_qdisc=pfifo_fast
   ```
3. **CUBIC + PFIFO_FAST** (common legacy baseline for compatibility and comparison)
   ```bash
   sudo sysctl -w net.ipv4.tcp_congestion_control=cubic
   sudo sysctl -w net.core.default_qdisc=pfifo_fast
   ```

Measure each option with representative traffic, then use the best-performing combination for your environment.

> [!NOTE]
> `pfifo_fast` availability can vary by distro/kernel. If it isn't available, use the closest supported qdisc option in your environment and continue benchmarking.

### UDEV rule for NIC ring buffers (TX/RX)

Create a udev rule in `/etc/udev/rules.d/99-azure-ring-buffer.rules` to apply ring buffer settings to network interfaces:

Use `rx 4096 tx 4096` for Accelerated Networking interfaces (`hv_pci`) and keep `rx 1024 tx 1024` for synthetic `hv_netvsc` interfaces.

If you prefer an interactive approach for ring buffer tuning, you can also use this helper tool: [Azure Linux NIC setup (bash)](https://github.com/mabicca/azure-linux-tuning/tree/main/azure-nic-setup/bash).

> [!NOTE]
> This GitHub tool is an optional helper and isn't part of Microsoft Learn product documentation. Review the scripts and test changes in a non-production environment before broad rollout.

````plaintext
# Setup Accelerated Interface ring buffers (Mellanox / Mana) 
SUBSYSTEM=="net", DRIVERS=="hv_pci", ACTION=="add",  RUN+="/usr/sbin/ethtool -G $env{INTERFACE} rx 4096 tx 4096"

# Setup Synthetic interface ring buffers (hv_netvsc)
SUBSYSTEM=="net", DRIVERS=="hv_netvsc*", ACTION=="add",  RUN+="/usr/sbin/ethtool -G $env{INTERFACE} rx 1024 tx 1024"
````
  
### UDEV rule for qdisc on interface events

After you finish benchmarking and select your preferred qdisc, create a udev rule in `/etc/udev/rules.d/99-azure-qdisc.rules` to apply that qdisc when network interfaces are added or changed.

Replace `<qdisc_choice>` with the qdisc you selected during testing (for example, `fq` or `pfifo_fast`):

```plaintext
ACTION=="add|change", SUBSYSTEM=="net", KERNEL=="enp*", PROGRAM="/sbin/tc qdisc replace dev \$env{INTERFACE} root noqueue"
ACTION=="add|change", SUBSYSTEM=="net", KERNEL=="eth*", PROGRAM="/sbin/tc qdisc replace dev \$env{INTERFACE} root <qdisc_choice>"
```

### UDEV rule for NIC transmit queue length

Create the following rule in `/etc/udev/rules.d/99-azure-txqueue-len.rules` to increase transmit queue length:

```plaintext
SUBSYSTEM=="net", ACTION=="add|change", KERNEL=="eth*", ATTR{tx_queue_len}="10000" 
```

### IRQ scheduling (irqbalance)

Depending on your workload, you might want to restrict the irqbalance service from scheduling IRQs on specific nodes. When using IRQBalance, update `/etc/default/irqbalance` to specify which CPUs shouldn't have IRQs scheduled. You'll need to determine [the mask](https://manpages.debian.org/testing/irqbalance/irqbalance.1.en.html#IRQBALANCE_BANNED_CPUS) that excludes those CPUs.

More information about how to calculate the mask is available [here](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux_for_real_time/7/html/tuning_guide/interrupt_and_process_binding).

### SR-IOV dual-interface behavior and side effects

In Linux high-performance networking, Azure uses SR-IOV (for example, with Mellanox drivers such as `mlx4` or `mlx5`). In this model, you can see both a synthetic interface and a virtual function (VF) interface for the same VM networking path. [Learn more](/azure/virtual-network/accelerated-networking-how-it-works).

This design is expected, but it can create confusion during tuning and troubleshooting if both interfaces are treated as independent data paths.

Possible side effects include:

- Inconsistent benchmark results when settings are applied to one interface but traffic uses the other.
- Unexpected latency spikes or retransmissions during failover between synthetic and VF paths.
- Misleading diagnostics if counters and packet captures are collected from the wrong interface.

To reduce risk:

- Validate which interface carries your workload traffic before tuning.
- Keep udev and sysctl tuning consistent with your interface strategy.
- Re-test throughput and latency after reboot, driver updates, or accelerated networking state changes.
 

### Additional notes

System administrators can implement these recommendations by editing configuration files such as `/etc/sysctl.d/`, `/etc/modules-load.d/`, and `/etc/udev/rules.d/`. Review kernel and driver updates carefully to avoid regressions.

For more information about specific configurations and troubleshooting, see Azure documentation on networking performance.

## Related content

- Deploy VMs close to each other for low latency with [proximity placement groups](/azure/virtual-machines/co-location).
- See the optimized result with [Bandwidth/Throughput testing](virtual-network-bandwidth-testing.md) for your scenario.
- Read about how [bandwidth is allocated to virtual machines](virtual-machine-network-throughput.md).
- Read [Azure Virtual Network frequently asked questions](virtual-networks-faq.md).
