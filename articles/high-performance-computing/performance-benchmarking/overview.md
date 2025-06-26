---
title: "High-Performance Computing (HPC) performance and benchmarking overview"
description: Learn about understanding and measuring the performance concepts and benchmarking methologies.
author: padmalathas
ms.author: padmalathas
ms.date: 01/01/2025
ms.topic: concept-article
ms.service: azure-virtual-machines
ms.subservice: hpc
# Customer intent: "As an HPC administrator, I want to learn about performance metrics and benchmarking methodologies, so that I can optimize system performance and ensure my applications meet required operational standards."
---

# High-Performance Computing (HPC) Performance and Benchmarking Overview

High-Performance Computing (HPC) systems are designed to process large amounts of data and perform complex calculations at high speeds. Understanding and measuring their performance is crucial for system optimization, procurement decisions, and ensuring applications meet performance requirements. This document provides a comprehensive overview of HPC performance concepts and benchmarking methodologies. 

## Key Performance Metrics

Understanding the fundamental metrics used to measure HPC system performance is essential for meaningful system evaluation and comparison. They provide objective measurements for comparison, identify system bottlenecks thereby enabling the performance tuning and help predict predict application performance. The performance  

# [Processing Performance](#tab/processperf)
HPC systems' computational capabilities are measured through various metrics that quantify their ability to execute calculations and instructions.
  - FLOPS (Floating-Point Operations Per Second): Measures the raw computational power of a system
  - Peak Performance: Theoretical maximum performance achievable by the system
  - Sustained Performance: Actual performance achieved during real-world operations
  - IPS (Instructions Per Second): Rate at which a processor executes instructions

# [Memory Performance](#tab/memoryperf)
Memory system efficiency is crucial for overall system performance as it determines how quickly data can be accessed and processed.
  - Bandwidth: Rate of data transfer between memory and processor
  - Latency: Time delay between memory request and data delivery
  - Memory Hierarchy Performance: Cache hit rates and access times across different memory levels

# [Network Performance](#tab/networkperf)
In a distributed computing environments, network performance metrics help evaluate the system's ability to communicate between nodes effectively.
  - Bandwidth: Maximum data transfer rate between nodes
  - Latency: Time required for a message to travel between nodes
  - Message Rate: Number of messages that can be sent per second
  - Bisection Bandwidth: Worst-case bandwidth when the network is split into two equal parts

---

## Benchmarking Categories
Different types of benchmarks serve various purposes in evaluating system performance, from testing specific components to assessing real-world application performance.

|Synthetic Benchmarks <br> (Test specific system components or characteristics)|Application Benchmarks <br> (Real-world applications or their proxies)|Kernel Benchmarks <br> (Small, self-contained portions of applications)|
|----------|-------------|------|
|STREAM (memory bandwidth)|Weather Research and Forecasting (WRF)|NAS Parallel Benchmarks|
|Intel MPI Benchmarks (network performance)|GROMACS (molecular dynamics)|DOE CORAL Benchmarks|
|LINPACK (dense linear algebra)|NAMD (molecular dynamics)|ECP Proxy Applications|
|HPCG (sparse linear algebra)|MILC (quantum chromodynamics)|

## Performance Analysis Methods
Various techniques are employed to gather detailed performance data and identify bottlenecks in HPC systems and applications. Most commonly used methods are *profiling* wherein it collects runtime data to understand program behavior and resource utilization patterns, *tracing* method in which it captures details temporal information about program execution and the system behavior for in-depth analysis.

### Profiling  
  - Time-based profiling: Sampling program counter at regular intervals
  - Event-based profiling: Collecting hardware counter data
  - Communication profiling: Analyzing message patterns and timing
  - I/O profiling: Measuring file system performance

### Tracing
  - Timeline analysis: Recording temporal behavior of events
  - Message tracing: Analyzing communication patterns
  - Hardware counter tracing: Recording hardware events over time

## Performance Optimization Techniques
These strategies help maximize system efficiency and application performance across different aspects of HPC systems. The most effective techniques typically combine elements from all three categories, creating a balanced optimization strategy that considers the entire system's performance characteristics. Success often comes from identifying which combination of these techniques best matches your specific application and system architecture.

:::image type="content" source="../media/performance-techniques.jpg" alt-text="A screenshot of the effective techniques with combined elements.":::

## Best Practices for Benchmarking
Following are established benchmarking practices ensures reliable and reproducible performance measurements.

### Methodology
  - To define clear objectives and metric
  - Select representative benchmarks
  - Ensure consistent testing conditions
  - Document all testing parameters
  - Perform multiple runs for statistical validity

### Common Pitfalls to Avoid
  - Insufficient warm-up periods
  - Inconsistent compiler options
  - Inadequate sample sizes
  - Unrealistic input datasets
  - Ignoring system variability

### Reporting Requirements
  - System configuration details'
  - Software stack information
  - Benchmark parameters
  - Raw results and statistical analysis
  - Environmental conditions
  - Optimization settings

## Related resources

- [HPC workload best practices guide](/azure/virtual-machines/workload-guidelines-best-practices-storage)
- [HPC system and big-compute solutions](/azure/architecture/solution-ideas/articles/big-compute-with-azure-batch)
