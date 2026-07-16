---
title: Running your first benchmark using STREAM
description: Learn how to run the STREAM benchmark on Azure HPC virtual machines. 
author: padmalathas
ms.author: padmalathas
ms.topic: how-to
ms.date: 02/24/2026
ms.service: azure-virtual-machines
ms.subservice: hpc
---

# Running your first benchmark using STREAM

STREAM measures sustainable memory bandwidth, which is critical for memory-bound workloads like computational fluid dynamics (CFD), finite element analysis, and data analytics. STREAM is a simple, synthetic benchmark that measures memory bandwidth for four vector operations:


| Operation | Description | Formula |
|-----------|-------------|---------|
| Copy | Measures transfer rates | a(i) = b(i) |
| Scale | Adds simple arithmetic | a(i) = q × b(i) |
| Add | Multiple load/store operations | a(i) = b(i) + c(i) |
| Triad | Most representative | a(i) = b(i) + q × c(i) |

The **Triad** result is the standard metric for comparing memory bandwidth across systems.

**Time to complete**: 15-20 minutes

## Prerequisites

- An Azure HPC VM (HBv3, HBv4, HBv5, or HX-series recommended)
- SSH access to the VM
- Root or sudo privileges

> [!TIP]
> For best results, use Azure HPC marketplace images (AlmaLinux-HPC or Ubuntu-HPC) which include optimized compilers and libraries.

## Expected results by VM family

Use these values to validate your results:

| VM Series | STREAM Triad (GB/s) | Notes |
|-----------|---------------------|-------|
| HBv5 (with HBM) | ~7,000 | Uses HBM memory |
| HBv4 | ~650-780 | DDR5 memory |
| HBv3 | ~330-350 | DDR4 memory |
| HBv2 | ~260 | DDR4 memory |

If your results are significantly lower (more than 10% below), check your configuration.

## Step 1: Connect to your VM

Connect via SSH to your HPC VM:

```bash
ssh azureuser@<vm-public-ip>
```

Or connect through your Slurm login node if using a cluster.

## Step 2: Install dependencies

### Option A: Using Azure HPC images (recommended)

Azure HPC images include the necessary compilers. Verify GCC is available:

```bash
gcc --version
```

### Option B: Manual installation

If using a standard image, install build tools:

```bash
# AlmaLinux/RHEL
sudo dnf groupinstall "Development Tools" -y

# Ubuntu
sudo apt update && sudo apt install build-essential -y
```

## Step 3: Download and compile STREAM

Clone the Azure benchmarking repository which includes optimized STREAM configurations:

```bash
# Create working directory
mkdir -p ~/benchmarks && cd ~/benchmarks

# Clone Azure benchmarking repository
git clone https://github.com/Azure/woc-benchmarking.git
cd woc-benchmarking/apps/hpc/stream
```

Alternatively, download STREAM directly:

```bash
mkdir -p ~/benchmarks/stream && cd ~/benchmarks/stream
wget https://www.cs.virginia.edu/stream/FTP/Code/stream.c
```

Compile with optimizations for AMD EPYC processors (used in HB-series):

```bash
gcc -O3 -march=znver3 -fopenmp -DSTREAM_ARRAY_SIZE=800000000 \
    -DNTIMES=20 stream.c -o stream
```

**Compiler flags explained**:

| Flag | Purpose |
|------|---------|
| `-O3` | Maximum optimization level |
| `-march=znver3` | Optimize for AMD Zen 3/4 architecture |
| `-fopenmp` | Enable OpenMP for multi-threading |
| `-DSTREAM_ARRAY_SIZE=800000000` | Array size (~6 GB per array, 18 GB total) |
| `-DNTIMES=20` | Number of iterations |

> [!IMPORTANT]
> The array size must be large enough that data doesn't fit in cache. For HBv4/HBv5 with 1.5 GB L3 cache, use at least 800M elements.

## Step 4: Configure thread affinity

Proper thread pinning is critical for accurate results. Set OpenMP environment variables:

```bash
# Get number of physical cores
NCORES=$(lscpu | grep "^Core(s) per socket:" | awk '{print $4}')
NSOCKETS=$(lscpu | grep "^Socket(s):" | awk '{print $2}')
TOTAL_CORES=$((NCORES * NSOCKETS))

echo "Total physical cores: $TOTAL_CORES"

# Set OpenMP configuration
export OMP_NUM_THREADS=$TOTAL_CORES
export OMP_PROC_BIND=spread
export OMP_PLACES=cores
```

For HBv4 (176 cores):
```bash
export OMP_NUM_THREADS=176
export OMP_PROC_BIND=spread
export OMP_PLACES=cores
```

For HBv5 (standard configuration):
```bash
export OMP_NUM_THREADS=176
export OMP_PROC_BIND=spread
export OMP_PLACES=cores
```

## Step 5: Run the benchmark

Execute STREAM:

```bash
./stream
```

**Sample output** (HBv4):

```
-------------------------------------------------------------
STREAM version $Revision: 5.10 $
-------------------------------------------------------------
This system uses 8 bytes per array element.
-------------------------------------------------------------
Array size = 800000000 (elements), Offset = 0 (elements)
Memory per array = 6103.5 MiB (= 5.96 GiB).
Total memory required = 18310.5 MiB (= 17.88 GiB).
Each kernel will be executed 20 times.
-------------------------------------------------------------
Number of Threads requested = 176
Number of Threads counted = 176
-------------------------------------------------------------
Function    Best Rate MB/s  Avg time     Min time     Max time
Copy:          753284.2     0.017157     0.016966     0.018884
Scale:         707935.3     0.018260     0.018045     0.019629
Add:           756972.9     0.025508     0.025318     0.027311
Triad:         757820.9     0.025464     0.025290     0.027212
-------------------------------------------------------------
```

The **Triad Best Rate** (757,820.9 MB/s = ~740 GB/s) is the key result.

## Step 6: Validate results

Compare your Triad result against expected values:

```bash
# Quick validation script
TRIAD_RESULT=757820  # Replace with your result in MB/s
VM_TYPE="HBv4"       # HBv2, HBv3, HBv4, or HBv5

case $VM_TYPE in
    "HBv5") EXPECTED=7000000 ;;
    "HBv4") EXPECTED=700000 ;;
    "HBv3") EXPECTED=330000 ;;
    "HBv2") EXPECTED=260000 ;;
esac

PERCENT=$(echo "scale=1; $TRIAD_RESULT * 100 / $EXPECTED" | bc)
echo "Achieved $PERCENT% of expected bandwidth"
```

**Results interpretation**:

| Achievement | Interpretation |
|-------------|----------------|
| 95-105% | Excellent - VM performing as expected |
| 85-95% | Good - Minor optimization possible |
| 70-85% | Investigate - Check thread affinity, NUMA |
| <70% | Problem - Check configuration |

## Step 7: Run on multiple NUMA domains (advanced)

For detailed NUMA analysis, run STREAM per NUMA domain:

```bash
# Check NUMA topology
numactl --hardware

# Run on NUMA node 0 only
numactl --cpunodebind=0 --membind=0 \
    OMP_NUM_THREADS=22 OMP_PROC_BIND=spread OMP_PLACES=cores ./stream

# Run on all NUMA domains (default full-node run)
numactl --interleave=all \
    OMP_NUM_THREADS=176 OMP_PROC_BIND=spread OMP_PLACES=cores ./stream
```

## Troubleshooting

### Low bandwidth results

**Symptom**: Results significantly below expected values

**Solutions**:

1. **Check thread count**:
   ```bash
   echo $OMP_NUM_THREADS
   # Should match physical core count
   ```

1. **Verify thread binding**:
   ```bash
   export OMP_DISPLAY_ENV=TRUE
   ./stream 2>&1 | head -20
   ```

1. **Check for CPU frequency scaling**:
   ```bash
   cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
   # Should be "performance" for benchmarking
   ```

1. **Verify NUMA memory policy**:
   ```bash
   numactl --show
   ```

### Array size too small

**Symptom**: Results higher than expected (measuring cache, not memory)

**Solution**: Increase `STREAM_ARRAY_SIZE` at compile time. Total memory used should be at least 4× the L3 cache size.

```bash
# Recompile with larger array
gcc -O3 -march=znver3 -fopenmp -DSTREAM_ARRAY_SIZE=1000000000 \
    -DNTIMES=20 stream.c -o stream
```

### Inconsistent results

**Symptom**: Large variation between runs

**Solutions**:

1. Ensure no other processes are running:
   ```bash
   top -b -n 1 | head -20
   ```

1. Run more iterations:
   ```bash
   # Recompile with more iterations
   gcc -O3 -march=znver3 -fopenmp -DSTREAM_ARRAY_SIZE=800000000 \
       -DNTIMES=50 stream.c -o stream
   ```

## Running STREAM in a Slurm job

If using a Slurm cluster, create a job script:

```bash
cat << 'EOF' > stream-job.sh
#!/bin/bash
#SBATCH --job-name=stream
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=176
#SBATCH --time=00:10:00
#SBATCH --partition=hpc
#SBATCH --exclusive

# Set thread configuration
export OMP_NUM_THREADS=$SLURM_CPUS_PER_TASK
export OMP_PROC_BIND=spread
export OMP_PLACES=cores

# Run STREAM
cd ~/benchmarks/woc-benchmarking/apps/hpc/stream
./stream
EOF

sbatch stream-job.sh
```

## Automating with the Azure benchmarking scripts

The Azure woc-benchmarking repository includes automation scripts:

```bash
cd ~/benchmarks/woc-benchmarking/apps/hpc/stream

# View available scripts
ls -la

# Run automated benchmark (if available)
./run_stream.sh
```

