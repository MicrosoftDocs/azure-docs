---
title: Deploy a multi‑region HPC cluster
description: Guidance to plan, deploy, operate, and recover a multi‑region HPC cluster on Azure, including architecture options, prerequisites, step‑by‑step deployment, day‑2 operations, DR strategy, and caveats.
author: jemorey
ms.author: padmalathas
ms.reviewer: xpillons
ms.date: 12/31/2025
ms.update-cycle: 1095-days
---

# Deploy a multi‑region HPC cluster

High-performance computing (HPC) clusters are typically deployed within a single Azure region to minimize network latency and keep compute resources co-located with data. However, there are scenarios where deploying a multi-region HPC cluster becomes necessary or advantageous - whether for increased capacity, access to specialized hardware, data locality requirements, or disaster recovery (DR) planning.

This guide provides end-to-end guidance for HPC users to understand, plan, deploy, and operate multi-region HPC clusters on Azure, with a focus on Azure CycleCloud as the orchestration platform.

> [!NOTE]
> Multi-region HPC deployments introduce additional complexity and cost. Not every workload benefits from this approach—evaluate your specific needs before proceeding.

## Why consider a multi‑region HPC cluster?

Multi-region HPC designs allow your workloads to span or switch between Azure regions, improving availability, resiliency, or scalability beyond what a single region can offer. The following table summarizes which approach might suit different requirements.

| Use Case | Description |
|----------|-------------|
| **Capacity and Scale** | A single region might lack sufficient cores or specific VM sizes during peak demand. Splitting loosely coupled workloads across regions provides access to more total cores or alternative VM SKUs. |
| **Specialized Hardware Availability** | Not all Azure regions offer the same HPC VM types (for example, NDv4 GPUs, HB-series InfiniBand VMs). A secondary region can provide specialized compute resources unavailable in your primary region. |
| **Data Localization/Proximity** | Large datasets might be tied to specific regions (for example, Azure Open Datasets in West US 2). Deploying compute in that region reduces data movement costs and latency. |
| **Disaster Recovery (DR)** | For mission-critical workloads, multi-region deployment provides higher availability and a DR path in case of regional outages. |

### When to waive a multi-region

Highly tightly coupled parallel jobs (for example, MPI applications with frequent inter-node communication) might suffer significant performance degradation if spread across distant regions due to added network latency. Consider multi-region only when your workloads can tolerate increased latency and management overhead.


## Architecture comparison

There are multiple architectural approaches for designing an HPC solution across regions. The best approach depends on your goals for load distribution and disaster recovery.

:::image type="content" source="../images/multi-region-hpc-architecture.png" alt-text="Screenshot of multi-region HPC architecture." lightbox="../images/multi-region-hpc-architecture.png":::

### Option 1: Active/Active clusters (independent clusters per region)

In this option, you can deploy two or more full HPC clusters in different regions, each actively running jobs. The work is divided between regions by project or workload type.

:::image type="content" source="../images/active-active-clusters.png" alt-text="Screenshot of Active/Active cluster option." lightbox="../images/active-active-clusters.png":::

- **Pros:** Maximum capacity, redundancy and high availability.
- **Cons:** Higher cost/operations overhead, separate management and complex data sync.
- **Best for:** Organizations needing maximum capacity and continuous availability.

### Option 2: Active/Passive (primary with disaster recovery failover)

In this option, an HPC cluster runs in a primary region with a standby environment in a secondary region for disaster recovery. The secondary region is pre-provisioned but doesn't run jobs during normal operations.

:::image type="content" source="../images/active-passive-disaster-recovery.png" alt-text="Screenshot of Active/Passive cluster option." lightbox="../images/active-passive-disaster-recovery.png":::

- **Pros:** Lower cost, focuses on business continuity at a reduced overhead.
- **Cons:** Ongoing data replication, regular DR drills and non‑zero failover time.
- **Best for:** Mission‑critical workloads with defined recovery time objective (RTO).

### Option 3: Single HPC control plane across regions

In this option, one scheduler/head node manages compute in multiple regions. 

:::image type="content" source="../images/single-control-plane-multi-region.png" alt-text="Screenshot of single control plane across regions option." lightbox="../images/single-control-plane-multi-region.png":::

- **Pros:** Unified cluster partitions, single endpoint for users and no duplicate control systems.
- **Cons:** Requires advanced network setup and creating new partitions in the remote regions, single head node can be a single point of failure and offers complex reliability.
- **Best for:** Organizations wanting a unified management experience with regional compute pools.

### Architecture selection guide

| Requirement or goal | Recommended multi-region model |
|-------------|-------------------|
| Maximum capacity | Active/Active |
| Cost efficiency | Active/Passive |
| Simplified management | Single Control Plane |
| Fastest failover | Active/Active |
| Lowest RTO | Active/Active |
| Lowest operational cost | Active/Passive |

## Reference deployment: multi-region HPC cluster with CycleCloud

This section outlines the process for setting up a multi-region HPC Slurm cluster using CycleCloud. In this example, the head node runs in Region A (primary), and additional compute nodes can be provisioned in Region B (secondary).

:::image type="content" source="../images/cyclecloud-multi-region-deployment.png" alt-text="Screenshot of Multi region cluster deployment." lightbox="../images/cyclecloud-multi-region-deployment.png":::

### Prerequisites

- Working CycleCloud installation in region A
- Adequate quota for chosen VM sizes in both regions
- VNet peering or connectivity between regions

### Step-by-step deployment

#### Step 1: Prepare cloud resources in both regions

```bash
# Create resource groups (if not existing)
az group create --name rg-hpc-regionA --location eastus
az group create --name rg-hpc-regionB --location westus2

# Check quota availability
az vm list-usage --location eastus --output table
az vm list-usage --location westus2 --output table
```

- Create or identify resource groups and virtual networks in each region
- Deploy ancillary services (AD replica domain controller in Region B if using Active Directory)

#### Step 2: Deploy CycleCloud in region A with region-scoped identity

Follow standard Azure CycleCloud installation for your primary region using a managed identity or service principal limited to Region A's resources.

#### Step 3: Add a credential for region B in CycleCloud

```bash
# Create service principal for Region B
az ad sp create-for-rbac --name "cyclecloud-regionB-sp" \
  --role contributor \
  --scopes /subscriptions/<subscription-id>/resourceGroups/rg-hpc-regionB

# In CycleCloud CLI, add the new credential
cyclecloud account create regionB-account
```

Use the same CycleCloud locker (Blob Storage container) in both regions for cluster data. Alternatively, if you set up a CycleCloud locker in region B, you must create a private endpoint in region B to access the locker in region A.

#### Step 4: Connect networks and DNS across regions

```bash
# Create VNet peering from VNET-1 to VNET-2
az network vnet peering create -g rg-hpc-regionA -n VNET1ToVNET2 \
  --vnet-name vnet-hpc-regionA --remote-vnet vnet-hpc-regionB --allow-vnet-access

# Create VNet peering from VNET-2 to VNET-1
az network vnet peering create -g rg-hpc-regionB -n VNET2ToVNET1 \
  --vnet-name vnet-hpc-regionB --remote-vnet vnet-hpc-regionA --allow-vnet-access

# Create Private DNS Zone and link to both VNets
az network private-dns zone create -g rg-hpc-regionA -n hpc.internal
az network private-dns link vnet create -g rg-hpc-regionA \
  -n regionA-link -z hpc.internal -v vnet-hpc-regionA -e true
az network private-dns link vnet create -g rg-hpc-regionA \
  -n regionB-link -z hpc.internal -v vnet-hpc-regionB -e true
```
> [!NOTE]
> In certain configurations, including Open OnDemand deployments, node‑level DNS resolution might require updating resolv.conf to query the private DNS zone resolver before the Azure resolver to support short‑name resolution. Currently, it's unclear about persistent solution.

#### Step 5: Customize the CycleCloud cluster template for multi-region

Modify your CycleCloud cluster template to define node pools for each region. Key parameters include:

- `Region`
- `VpcId` (VNET)
- `Subnets`
- `AvailabilityZone`

Example parameters file (`slurm-multiregion-params.json`):

```json
{
  "Credentials": "your-cyclecloud-credential",
  "PrimarySubnet": "rg-hpc-regionA/vnet-hpc-regionA/compute-subnet",
  "PrimaryRegion": "eastus",
  "SecondarySubnet": "rg-hpc-regionB/vnet-hpc-regionB/compute-subnet",
  "SecondaryRegion": "westus2",
  "HPCMachineType": "Standard_HB120rs_v3",
  "MaxHPCExecuteCoreCount": 1200,
  "HTCMachineType": "Standard_D16s_v5",
  "MaxHTCExecuteCoreCount": 400
}
```

#### Step 6: Import the template and deploy the cluster

```bash
# Import cluster template
cyclecloud import_cluster multi-region-slurm -c Slurm \
  -f slurm-multiregion-template.txt \
  -p slurm-multiregion-params.json

# Start the cluster
cyclecloud start_cluster multi-region-slurm
```

#### Step 7: Verify nodes in both regions

```bash
# Check node status from scheduler
sinfo

# View CycleCloud node status
cyclecloud show_nodes multi-region-slurm
```

#### Step 8: Test job submission and data access

```bash
#!/bin/bash
#SBATCH --job-name=mpiMultiRegion
#SBATCH --partition=hpc-regionB
#SBATCH -N 2
#SBATCH -n 120
#SBATCH --chdir /tmp
#SBATCH --exclusive

set -x
source /etc/profile.d/modules.sh
module load mpi/hpcx

echo "SLURM_JOB_NODELIST = " $SLURM_JOB_NODELIST
NPROCS=$SLURM_NTASKS

mpirun -n $NPROCS --report-bindings echo "hello world!"
mv slurm-${SLURM_JOB_ID}.out $HOME
```

> [!TIP]
> Set an explicit working directory local to region B (`--chdir /tmp`) since the home directory is typically in region A.


## Day-2 operations and management

### Reliability and job resiliency

> [!IMPORTANT]
> CycleCloud and Slurm do not provide an SLA for individual job success. Implement application-level checkpoint/restart to recover from interruptions.

### Capacity management

- Monitor resource utilization continuously
- Distribute work to alternate region when approaching quota limits
- Leverage multiple VM instance types across regions
- Review Azure updates on new HPC VM availability

### Security and access control

- Use region-specific managed identities
- Restrict network access with NSGs even with VNet peering
- Maintain separate Key Vault instances per region
- Ensure data replication compliance with residency requirements


## Disaster recovery strategy 

### DR configuration options

| Configuration | Description | Recovery Speed |
|---------------|-------------|----------------|
| **Active/Active** | Continuous availability, duplicate all systems | Immediate |
| **Active/Passive (Warm Standby)** | Small head node running, compute spun up on failover | Minutes to hours |
| **Passive/Cold** | Manual deployment from backups | Hours to days |

### Data protection requirements

- Replicate critical data (input datasets, home directories, checkpoints, results)
- Use geo-redundant storage or custom replication with versioning
- Match replication frequency to recovery point objective (RPO) (for example, 4-hour RPO = replicate at least every 4 hours)


## Validation and testing

### Test categories

#### Job submission tests

- Submit test jobs targeting each region's resources
- Measure job start time and network throughput
- Run small MPI jobs across nodes in different regions
- Note performance impact from cross-region latency

#### Data consistency checks

- Test that replicated data in Region B is usable
- Disconnect primary storage and attempt reads from secondary
- Verify all data and metadata (permissions) are intact

#### End-to-end DR test

- Assume Region A is unavailable
- Bring up HPC environment in Region B using DR procedures
- Measure time to restore critical functionality
- Verify RPO and RTO compliance
- Fail back to Region A and synchronize changes


## Caveats and considerations

### Performance caveats

| Caveat | Impact | Mitigation |
|--------|--------|------------|
| **Network bandwidth limits** | Large data transfers might bottleneck | Pre-stage data, and use compression |
| **Working directory location** | Jobs in region B might have slow access to region A home dirs | Use a local working directory and mirror user home directories when required |

### Operational caveats

| Caveat | Impact | Mitigation |
|--------|--------|------------|
| **No automatic job completion SLA** | Jobs might fail without automatic recovery | Implement checkpointing and retry logic |
| **Double management overhead** | Active/active requires managing two clusters | Use automation and infrastructure-as-code |
| **CycleCloud UI limitations** | UI restricts single-region configuration | Use CLI with custom templates and parameters files |
| **Name resolution complexity** | Nodes must resolve across regions | Configure private DNS zones linked to both VNets |

### Cost caveats

| Caveat | Impact | Mitigation |
|--------|--------|------------|
| **Egress charges** | Cross-region traffic incur additional costs | Process data in-region, use local storage |
| **Idle secondary resources** | DR region incurs costs even when idle | Rely on autoscaling to deallocate idle compute nodes |
| **Quota management** | Both regions need sufficient quota | Request increases early, use capacity reservations |

### Security caveats

| Caveat | Impact | Mitigation |
|--------|--------|------------|
| **Credential scope** | Cross-region credentials increase blast radius | Use region-specific managed identities |
| **Data residency** | Replicating data might violate compliance | Verify regulatory requirements before replication |
| **Network exposure** | VNet peering opens cross-region paths | Apply strict NSG rules |


## Frequently asked questions (FAQs)

* Do I need a separate CycleCloud server in each region?

    Not necessarily. CycleCloud can manage multiple regions from one instance using multiple credentials and lockers. However, for higher availability, some organizations run distinct CycleCloud installations in each region with identical configurations.

* How can I minimize data e-gress charges?
    - Keep shared storage synchronized using Azure backbone replication (GRS, ZRS)
    - Use region-specific CycleCloud lockers instead of a global store
    - Compress data before transfer
    - Transmit only incremental changes
    - Run jobs in the same region as their data

* What RPO/RTO should HPC workloads have?
    Typical targets:
    - **RPO**: Few hours (or checkpoint interval length)
    - **RTO**: 4-24 hours

    For time-sensitive workloads (for example, weather forecasting with strict deadlines), near-zero RTO might require active/active setup.

* Are there SLA guarantees for multi-region HPC job completion?

    No. There is no Microsoft SLA guaranteeing individual HPC job completion—single or multi-region. Azure infrastructure services (VMs, Virtual Machine Scale Set, Storage) have availability SLAs, but job-level recovery is your responsibility.

* How do I check if a region supports my HPC needs?
    - Consult [Azure regional services documentation](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/)
    - Check Azure portal for VM sizes and quotas per region
    - Engage Azure support for capacity planning on large deployments
