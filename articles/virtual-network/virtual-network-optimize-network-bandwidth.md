---
title: Optimize Azure VM network throughput
description: Optimize network throughput for Windows and Linux virtual machines, including major distributions such as Ubuntu and Red Hat.
services: virtual-network
author: mabicca
manager: Gerald DeGrace
ms.service: azure-virtual-network
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 09/24/2026
ms.author: mabicca
# Customer intent: As a system administrator managing Azure virtual machines, I want to optimize network throughput for both Windows and Linux VMs, so that I can improve performance and ensure efficient resource utilization during data transfers.
---

# Optimize network throughput for Azure virtual machines

Azure virtual machines (VMs) have default network settings that can be optimized to improve throughput and consistency. This article describes how to optimize network performance for Windows and Linux VMs.

> [!IMPORTANT]
> Many of the optimizations described in this article (for example, congestion control, queue discipline, buffer sizes, and NIC tuning) affect how traffic flows between systems.
>
> For best results, apply these settings consistently across all virtual machines participating in the workload, including:
>
> - Client systems
> - Server systems
>
> Applying these configurations to only a subset of virtual machines can lead to:
>
> - Inconsistent throughput
> - Increased packet retransmissions
> - Suboptimal congestion behavior
>
> Always validate changes across the entire data path and test performance end-to-end.

## Windows virtual machines

If your Windows VM supports _accelerated networking_, enable that feature for optimal throughput. For more information, see [Create a Windows VM with accelerated networking](create-vm-accelerated-networking-powershell.md).

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

> [!IMPORTANT]
> VM sizes that use the [MANA](/azure/virtual-network/accelerated-networking-mana-overview) network adapter require a minimum kernel version per distribution for Accelerated Networking support. For non-endorsed distributions or custom kernels, use Linux kernel 6.14 or later. For the full list of minimum supported kernel versions by distribution, see [Supported operating systems](/azure/virtual-network/accelerated-networking-overview).

## Achieving consistent transfer speeds in Linux VMs in Azure

Linux VMs can show inconsistent transfer speeds, especially during large regional transfers (for example, 1 GB to 50 GB between West Europe and West US). Common causes include older kernels, default buffer sizes, and untuned congestion control or queue discipline settings.

Apply the following baseline tuning to any Linux VM on Azure. These are three distinct areas — apply all of them, not just one:

- [Congestion control and qdisc testing](#congestion-control-and-qdisc-testing): the TCP congestion control algorithm and queue discipline (qdisc).
- [NIC ring buffer sizes](#nic-ring-buffer-sizes): RX/TX ring buffer sizing at the network interface level, set independently of `sysctl`.
- [Sysctl parameters](#sysctl-parameters): a minimal, Azure-specific `sysctl` set applied to `/etc/sysctl.d/99-azure-network-tuning.conf`.

### Congestion control and qdisc testing

> [!NOTE]
> BBR support is only available on kernels 4.19 and later.

Congestion control and qdisc settings affect how traffic flows end-to-end. They can impact throughput and latency as much as buffer sizes. Test these combinations and keep the one that performs best for your workload.

As a general guideline:

- If your architecture spans different Azure regions (long-haul, higher-latency paths), BBR is usually the better fit.
- For localized communication within a region or availability zone (lower-latency paths), CUBIC is usually sufficient.

Also test both `fq` and `pfifo_fast` qdisc with BBR, since the qdisc choice can affect results as much as the congestion control algorithm itself.

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
3. **CUBIC + PFIFO_FAST** (common baseline for localized, low-latency communication)
   ```bash
   sudo sysctl -w net.ipv4.tcp_congestion_control=cubic
   sudo sysctl -w net.core.default_qdisc=pfifo_fast
   ```

Measure each option with representative traffic, then use the best-performing combination for your environment.

> [!IMPORTANT]
> The `sysctl -w` commands above apply immediately but don't persist across reboots. Once you settle on a combination, persist it by adding the following lines to `/etc/sysctl.d/99-azure-congestion.conf` (BBR + FQ shown as an example; substitute your chosen combination):
>
> ```ini
> net.ipv4.tcp_congestion_control = bbr
> net.core.default_qdisc = fq
> ```
>
> Then apply the changes: `sudo sysctl --system`

> [!NOTE]
> `pfifo_fast` availability can vary by distro/kernel. If it isn't available, use the closest supported qdisc option in your environment and continue benchmarking.

### NIC ring buffer sizes

Tuning NIC ring buffers is a baseline requirement for any Linux VM on Azure. The following settings apply at the network interface level, rather than through `sysctl`.

RX/TX ring buffers are the memory areas a NIC driver uses to hold packets that arrive from (or are waiting to go out to) the wire, before the kernel gets a chance to process them. When the CPU is momentarily busy (for example, servicing an interrupt storm, a scheduling delay, or another burst of traffic), a larger ring buffer gives the driver more room to keep incoming or outgoing packets queued instead of dropping them. Dropping packets causes intermittent timeouts and retransmissions under bursty or high-concurrency traffic. This ring buffer concept is the same RX/TX ring documented for the `-g`/`--show-ring` and `-G`/`--set-ring` options in [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html). The tradeoff is added latency: a much larger buffer can absorb bigger bursts, but packets sitting longer in the queue before being processed also increases latency. Treat ring buffer size as a balance between drop tolerance and latency rather than "bigger is always better."

```bash
# Accelerated Networking interface (mlx4_en, mlx5_core, or mana, depending on the VM SKU)
sudo ethtool -G <accel-interface> rx 4096 tx 4096
# Synthetic (hv_netvsc) interface
sudo ethtool -G <synthetic-interface> rx 1024 tx 1024
```

> [!IMPORTANT]
> On SUSE Linux Enterprise Server (SLES), SAP HANA systems under **heavy load** and other high-concurrency, multithreaded workloads can trigger Accelerated Networking ring buffer saturation. This condition shows up as intermittent connection timeouts (`rc=110`/`ETIMEDOUT`) even though interface counters show no drops or errors. These workloads typically need larger ring buffer values than the defaults shown in this article. For the recommended `ethtool` values and the steps to persist them across reboots (udev rule and initramfs rebuild), see [Intermittent Network Connection Timeouts (rc=110) on Azure Due to Accelerated Networking Ring Buffer Saturation](https://support.scc.suse.com/s/kb/Intermittent-Network-Connection-Timeouts-rc-110-on-Azure-Due-to-Accelerated-Networking-Ring-Buffer-Saturation?language=en_US) from SUSE.

> [!IMPORTANT]
> These settings don't persist across reboots on their own. To make them permanent, add a udev rule as described in [Persisting NIC ring buffer sizes (RX/TX)](#persisting-nic-ring-buffer-sizes-rxtx).

### Sysctl parameters

Add the following lines to `/etc/sysctl.d/99-azure-network-tuning.conf`. Most values are safe defaults, but two groups need to be recalculated for your VM instead of copied as-is:

- **Memory-scaled values** (`net.ipv4.tcp_mem`, `net.ipv4.udp_mem`) size the networking stack's memory pressure thresholds (low, pressure, max, in 4-KB pages) relative to total RAM. The values shown assume a VM with roughly 4 GB of RAM. Scale them up proportionally for larger VMs (for example, roughly double for 8 GB of RAM) so the network stack has enough memory headroom without starving other workloads on the VM.
- **Bandwidth-scaled values** (`net.core.rmem_max`, `net.core.wmem_max`, `net.ipv4.tcp_rmem`, `net.ipv4.tcp_wmem`) size socket buffers to the connection's bandwidth-delay product: `buffer size (bytes) ≈ (NIC bandwidth in bits/second ÷ 8) × round-trip time (seconds)`. The values shown assume a ~12 Gbps Accelerated Networking interface and a ~2 ms round-trip time, which is typical for communication within a single Azure region: (12,000,000,000 ÷ 8) × 0.002 ≈ 3,000,000 bytes ≈ 3 MB, which is why `rmem_max`, `wmem_max`, and the max field of `tcp_rmem`/`tcp_wmem` are set to 3145728. Recalculate for your VM size's actual NIC line rate (see [Accelerated Networking throughput by VM size](/azure/virtual-machines/sizes)) and for your workload's expected round-trip time, which is higher for cross-region traffic.

```ini
# TCP memory pressure thresholds in 4-KB pages (low, pressure, max): pages = RAM bytes x fraction / 4096; shown values ≈ 9%/12.5%/19% of 4 GB RAM
net.ipv4.tcp_mem = 98304 131072 196608
# Same memory-pressure thresholds as tcp_mem, applied to UDP sockets
net.ipv4.udp_mem = 98304 131072 196608

# Max receive buffer per socket, sized to the bandwidth-delay product: (NIC bandwidth in bytes/sec) x RTT in seconds ≈ (12 Gbps / 8) x 0.002 s ≈ 3 MB
net.core.rmem_max = 3145728
# Max send buffer per socket; same bandwidth-delay product calculation as rmem_max
net.core.wmem_max = 3145728
# Per-socket TCP receive buffer (min, default, max bytes); max matches the bandwidth-delay product above
net.ipv4.tcp_rmem = 4096 87380 3145728
# Per-socket TCP send buffer (min, default, max bytes); max matches the bandwidth-delay product above
net.ipv4.tcp_wmem = 4096 65536 3145728

# Default receive buffer for sockets that don't request a larger size; kept modest so many concurrent sockets don't exhaust RAM on a 4 GB VM
net.core.rmem_default = 262144
# Default send buffer for sockets that don't request a larger size; same rationale as rmem_default
net.core.wmem_default = 262144

# Minimum guaranteed UDP receive buffer per socket, even under memory pressure
net.ipv4.udp_rmem_min = 16384
# Minimum guaranteed UDP send buffer per socket, even under memory pressure
net.ipv4.udp_wmem_min = 16384

# Max packets processed per NAPI polling cycle across all interfaces, per CPU pass; raised from the kernel default of 300 for high-throughput NICs
net.core.netdev_budget = 1000
# Max packets allowed to queue when the kernel can't drain the NIC's ring buffer fast enough
net.core.netdev_max_backlog = 32768
# Max packets processed per network device, per NAPI polling pass (64 is also the kernel default; listed here for explicitness)
net.core.dev_weight = 64

# Enable TCP timestamps (RFC 7323), needed for RTT estimation and required by tcp_tw_reuse below
net.ipv4.tcp_timestamps = 1
# Allow reusing TIME_WAIT sockets for new outgoing connections, reducing ephemeral port exhaustion under high connection churn
net.ipv4.tcp_tw_reuse = 1
# Widen the ephemeral source port range to support more concurrent outgoing connections
net.ipv4.ip_local_port_range = 1024 65535
# Max pending-connection backlog for listening sockets, raised for servers accepting many concurrent connection attempts
net.core.somaxconn = 32768
# Max ancillary (control message) buffer size per socket
net.core.optmem_max = 65535
# Disable F-RTO (Forward RTO-recovery), an algorithm for lossy/wireless links that's unnecessary on stable wired Azure networks
net.ipv4.tcp_frto = 0
# Microseconds to busy-poll a socket before sleeping, trading CPU time for lower latency on latency-sensitive workloads
net.core.busy_poll = 50
# Microseconds to busy-poll specifically during read() calls; used together with busy_poll
net.core.busy_read = 50
```

Then apply the changes:

```bash
sudo sysctl --system
```

### Persisting NIC ring buffer sizes (RX/TX)

Create a udev rule in `/etc/udev/rules.d/99-azure-ring-buffer.rules` to apply ring buffer settings to network interfaces. Matching on `ENV{ID_NET_DRIVER}` detects whichever Accelerated Networking driver is present (`mana`, `mlx4_core`, or `mlx5_core`, depending on the VM SKU`) without needing to know the driver ahead of time. Use `rx 4096 tx 4096` for Accelerated Networking interfaces and keep `rx 1024 tx 1024` for synthetic `hv_netvsc` interfaces:

```ini
# Set up accelerated networking ring buffers (mana, mlx4_core, or mlx5_core, depending on the VM SKU)
SUBSYSTEM=="net", ACTION=="add|move", ENV{ID_NET_DRIVER}=="mana", RUN+="/usr/sbin/ethtool -G %k rx 4096 tx 4096"
SUBSYSTEM=="net", ACTION=="add|move", ENV{ID_NET_DRIVER}=="mlx4_core", RUN+="/usr/sbin/ethtool -G %k rx 4096 tx 4096"
SUBSYSTEM=="net", ACTION=="add|move", ENV{ID_NET_DRIVER}=="mlx5_core", RUN+="/usr/sbin/ethtool -G %k rx 4096 tx 4096"

# Set up synthetic interface ring buffers (hv_netvsc)
SUBSYSTEM=="net", ACTION=="add|move", ENV{ID_NET_DRIVER}=="hv_netvsc", RUN+="/usr/sbin/ethtool -G %k rx 1024 tx 1024"
```

> [!IMPORTANT]
> On Red Hat Enterprise Linux 9 versions older than 9.8 (for example, 9.6), this udev rule doesn't take effect because the `initscripts-rename-device` package is installed and interferes with `RUN+=` actions on network device udev rules. Either remove the `initscripts-rename-device` package, or apply the ring buffer settings through another mechanism (for example, a systemd service or NetworkManager dispatcher script) instead of relying on this udev rule. This issue doesn't occur on RHEL 9.8 and later.

### NIC transmit queue length

Create the following rule in `/etc/udev/rules.d/99-azure-txqueue-len.rules` to increase transmit queue length:

```ini
SUBSYSTEM=="net", ACTION=="add|change", KERNEL=="en*|eth*", ATTR{tx_queue_len}="10000"
```

### Testing udev rules without rebooting

After adding or updating the ring buffer or transmit queue length udev rules, apply them to already-present interfaces without a reboot:

```bash
sudo udevadm control --reload-rules
sudo udevadm trigger --action=add --subsystem-match=net
```

This step re-triggers udev's `add` action for existing network interfaces, so the rules run against them immediately instead of waiting for the next boot or hot-plug event. Confirm the new values took effect with `ethtool -g <interface>` (ring buffers) or `ip link show <interface>` (transmit queue length).

### SR-IOV dual-interface behavior and side effects

For high-performance networking on Linux, Azure uses SR-IOV, with the VF interface bound to the `mlx4_en`, `mlx5_core`, or `mana` driver depending on the VM SKU. In this model, you can see both a synthetic interface and a virtual function (VF) interface for the same VM networking path. [Learn more](/azure/virtual-network/accelerated-networking-how-it-works).

This design is expected, but it can create confusion during tuning and troubleshooting if both interfaces are treated as independent data paths.

Possible side effects include:

- Inconsistent benchmark results when settings are applied to one interface but traffic uses the other.
- Unexpected latency spikes or retransmissions during failover between synthetic and VF paths.
- Misleading diagnostics if counters and packet captures are collected from the wrong interface.

To reduce risk:

- Validate which interface carries your workload traffic before tuning.
- Keep udev and sysctl tuning consistent with your interface strategy.
- Re-test throughput and latency after reboot, driver updates, or accelerated networking state changes.

## Additional notes

System administrators can implement these recommendations by editing configuration files such as `/etc/sysctl.d/`, `/etc/modules-load.d/`, and `/etc/udev/rules.d/`. Review kernel and driver updates carefully to avoid regressions.

## Related content

- Deploy VMs close to each other for low latency with [proximity placement groups](/azure/virtual-machines/co-location).
- See the optimized result with [Bandwidth/Throughput testing](virtual-network-bandwidth-testing.md) for your scenario.
- Read about how [bandwidth is allocated to virtual machines](virtual-machine-network-throughput.md).
- Read [Azure Virtual Network frequently asked questions](virtual-networks-faq.md).
