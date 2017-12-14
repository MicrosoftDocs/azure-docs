
GPU optimized VM sizes are for specialized virtual machines targeted for heavy graphic rendering and video editing. Available with single or multiple GPUs. This article provides information about the number of vCPUs, data disks, and NICs as well as storage throughput and network bandwidth for each size in this grouping. 


The NC and NV sizes are also known as GPU-enabled instances. They are specialized virtual machine sizes that include NVIDIA's GPU cards, optimized for different scenarios and use cases. The NV sizes are optimized and designed for remote visualization, streaming, gaming, encoding, and VDI scenarios utilizing frameworks such as OpenGL and DirectX. The NC sizes are more optimized for compute-intensive and network-intensive applications and algorithms, including CUDA- and OpenCL-based applications and simulations. 


The NV instances are powered by NVIDIA’s Tesla M60 GPU card and NVIDIA GRID for desktop accelerated applications and virtual desktops where customers are able to visualize their data or simulations. Users are able to visualize their graphics intensive workflows on the NV instances to get superior graphics capability and additionally run single precision workloads such as encoding and rendering. The Tesla M60 delivers 4096 CUDA cores in a dual-GPU design with up to 36 streams of 1080p H.264. 

The NC instances are powered by NVIDIA’s Tesla K80 card. Users can now crunch through data much faster by leveraging CUDA for energy exploration applications, crash simulations, ray traced rendering, deep learning and more. The Tesla K80 delivers 4992 CUDA cores with a dual-GPU design, up to 2.91 Teraflops of double-precision and up to 8.93 Teraflops of single-precision performance.

## NV instances

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | Maximum data disks |
| --- | --- | --- | --- | --- | --- |
| Standard_NV6 |6 |56 |380 | 1 | 24 |
| Standard_NV12 |12 |112 |680 | 2 | 48 |
| Standard_NV24 |24 |224 |1440 | 4 | 64 |

1 GPU = one-half M60 card.

## NC instances

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | Maximum data disks |
| --- | --- | --- | --- | --- | --- |
| Standard_NC6 |6 |56 | 380 | 1 | 24 |
| Standard_NC12 |12 |112 | 680 | 2 | 48 |
| Standard_NC24 |24 |224 | 1440 | 4 | 64 |
| Standard_NC24r* |24 |224 | 1440 | 4 | 64 |

1 GPU = one-half K80 card.

*RDMA capable


