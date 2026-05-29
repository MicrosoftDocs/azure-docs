---
title: "High-Performance Computing (HPC) performance and benchmarking overview"
description: Learn about understanding and measuring the performance concepts and benchmarking methodologies.
author: padmalathas
ms.author: padmalathas
ms.date: 02/23/2026
ms.topic: concept-article
ms.service: azure-virtual-machines
ms.subservice: hpc
# Customer intent: "As an HPC administrator, I want to learn about performance metrics and benchmarking methodologies, so that I can optimize system performance and ensure my applications meet required operational standards."
---

# High-Performance Computing (HPC) Performance and Benchmarking Overview

This article introduces HPC- AI benchmarking on Azure. It is designed for architects, engineers, and decision-makers who need to:

- Evaluate Azure infrastructure for new or existing workloads
- Establish performance baselines
- Compare VM families using objective data
- Optimize performance and cost efficiency
 
## Why benchmarking matters

Benchmarking provides evidence-based insights that support both technical and business decisions. It serves several critical purposes for HPC and AI workloads:

- Choose the right infrastructure: Match workload characteristics to the most suitable Azure VM family.
- Validate performance: Confirm that deployed systems meet expected throughput and latency targets.
- Optimize configurations: Identify bottlenecks across compute, memory, storage, and networking.
- Analyze cost efficiency: Compare price–performance ratios across VM options.
- Support procurement decisions: Provide repeatable, defensible performance data to stakeholders.


## Key Performance Metrics

Understanding the core metrics used to measure HPC system performance is essential for meaningful system evaluation and comparison. They provide objective measurements for comparison, identify system bottlenecks thereby enabling the performance tuning and help predict application performance. Metrics vary by workload type, but they generally fall into four categories.  

# [Compute performance](#tab/computeperf)

Compute performance metrics describe the raw processing capability of a system and how effectively that capability is realized in practice. FLOPS (floating-point operations per second) are commonly used to quantify computational throughput and are often reported by benchmarks such as HPL (LINPACK). While peak performance represents the theoretical maximum capability of the hardware, sustained performance reflects what applications actually achieve under real workloads and is therefore a more meaningful indicator for most evaluations.

# [Memory performance](#tab/memoryperf)

Memory system efficiency is crucial for overall system performance as it determines how quickly data can be accessed and processed. Memory performance metrics capture how efficiently data moves between processors and memory, which is often a dominant factor in overall application performance. Memory bandwidth measures the rate at which data can be transferred and is especially critical for memory-bound workloads such as computational fluid dynamics. Memory latency reflects the delay between a request and data delivery, influencing scalability and responsiveness, while cache efficiency indicates how effectively applications reuse data to avoid expensive memory accesses.


# [Network performance](#tab/networkperf)

In a distributed computing environment, network performance metrics help evaluate the system's ability to communicate between nodes effectively. These metrics are essential for distributed and tightly coupled workloads that span multiple nodes. Network bandwidth defines the maximum data transfer rate between nodes, whereas network latency measures the time required for messages to travel across the interconnect. Message rate, often evaluated with MPI micro-benchmarks, indicates how well the system handles frequent, small communications, which is particularly important for communication-intensive HPC applications.

# [AI specific metrics](#tab/aispecific)

AI workloads introduce additional performance considerations beyond traditional HPC metrics. Throughput measures how many samples or tokens are processed per second during training or inference and is a primary indicator of overall efficiency. Time to first token (TTFT) captures the latency before the first output token is generated and directly affects user experience for large language model inference. Scaling efficiency describes how well performance improves as additional GPUs or nodes are added, providing insight into how effectively the workload utilizes parallel resources.

---

## Azure VM families for HPC and AI
Azure provides specialized VM families tuned for different workload patterns.

### CPU-based HPC (HB-series)
HB-series VMs are optimized for memory bandwidth and low-latency networking, making them well suited for traditional HPC workloads such as:

* Computational fluid dynamics (CFD)
* Weather and climate modeling
* Finite element analysis

Key characteristics include:

* High-core-count AMD EPYC processors
* Large memory bandwidth (including HBM in newer generations)
* High-speed InfiniBand networking

### GPU-based AI (ND-series)
ND-series VMs are designed for GPU-accelerated workloads, including:

* Deep learning training
* Large language model (LLM) inference
* AI research and experimentation

These VMs feature:

* NVIDIA data center GPUs (H100, H200, Blackwell)
* Large GPU memory capacity
* High-bandwidth GPU-to-GPU and GPU-to-network interconnects

## Benchmarking categories
Different benchmarks answer different questions. Select benchmarks based on the aspect of performance you want to evaluate.

### Synthetic benchmarks
Synthetic benchmarks isolate specific system components and are useful for baseline validation:

* STREAM – Measures sustainable memory bandwidth
* HPL (LINPACK) – Measures peak floating-point compute performance
* HPCG – Evaluates performance for sparse linear algebra, closer to real-world HPC workloads
* OSU Micro-Benchmarks – Validates MPI latency and bandwidth
* NCCL tests – Measures GPU collective communication performance

### Application benchmarks
Application benchmarks reflect real-world behavior and are often more representative:

* ANSYS Fluent – CFD solver performance
* WRF – Weather and atmospheric modeling
* GROMACS / NAMD – Molecular dynamics throughput
* MLPerf Training – End-to-end AI training performance
* MLPerf Inference – Model serving throughput and latency


## Getting started

Follow this recommended path to begin benchmarking on Azure:

```
1. Set up infrastructure
   └── Setting Up Your First HPC Cluster (CycleCloud + Slurm)
   
2. Run baseline benchmarks
   ├── Running Your First Benchmark: STREAM (CPU/memory)
   └── Running NCCL Benchmarks (GPU communication)
   
3. Compare VM options
   ├── CPU HPC VMs Comparison
   └── GPU AI VMs Comparison
   
4. Optimize for your workload
   └── Optimizing NCCL for Azure (AI training)
```

## Best practices

Following are some guidelines for reliable and reproducible benchmarks:

### Before you benchmark

- **Use HPC/AI optimized images**: Start with Azure HPC images (AlmaLinux-HPC, Ubuntu-HPC) that include pre-configured drivers and libraries
- **Verify driver versions**: Ensure GPU drivers, InfiniBand drivers, and NCCL versions are current
- **Check topology**: Confirm NUMA configuration and GPU-to-NIC affinity

### During benchmarking

- **Warm-up runs**: Discard initial runs to allow caches to stabilize
- **Multiple iterations**: Run at least 5 iterations and report median or average
- **Consistent conditions**: Keep OS, drivers, and configurations identical across comparisons
- **Document everything**: Record software versions, environment variables, and command-line parameters

### Common pitfalls to avoid

- Insufficient warm-up periods
- Comparing different software versions
- Ignoring NUMA topology
- Using default configurations without optimization
- Inadequate sample sizes

## Related resources

- [HPC workload best practices guide](/azure/virtual-machines/workload-guidelines-best-practices-storage)
- [HPC system and big-compute solutions](/azure/architecture/solution-ideas/articles/big-compute-with-azure-batch)
