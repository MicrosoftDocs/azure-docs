---
 title: NVv4-series - Azure Virtual Machines
 description: Specifications for the NVv4-series VMs.
 services: virtual-machines
 author: jonbeck7
 ms.service: virtual-machines
 ms.topic: article
 ms.date: 02/03/2020
 ms.author: lahugh
---

# NVv4-series (Preview)

The NVv4-series virtual machines are powered by [AMD Radeon Instinct MI25](https://www.amd.com/en/products/professional-graphics/instinct-mi25) GPUs and AMD EPYC 7V12(Rome) CPUs. With NVv4-series Azure is introducing virtual machines with partial GPUs. Pick the right sized virtual machine for GPU accelerated graphics applications and virtual desktops starting at 1/8th of a GPU with 2 GiB frame buffer to a full GPU with 16 GiB frame buffer. NVv4 virtual machines currently support only Windows guest operating system.

[Sign-up and get access to these machines during preview](https://aka.ms/nvv4signup).
<br>

Premium Storage:  Supported

Premium Storage caching:  Supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | GPU memory: GiB | Max data disks | Max NICs |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_NV4as_v4 |4 |14 |88 | 1/8 | 2 | 4 | 2 |
| Standard_NV8as_v4 |8 |28 |176 | 1/4 | 4 | 8 | 4 |
| Standard_NV16as_v4 |16 |56 |352 | 1/2 | 8 | 16 | 8 |
| Standard_NV32as_v4 |32 |112 |704 | 1 | 16 | 32 | 8 |

<sup>1</sup> NVv4-series VMs feature AMD Simultaneous multithreading Technology

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Supported operating systems and drivers

To take advantage of the GPU capabilities of Azure N-series VMs running Windows, NVIDIA or AMD GPU drivers must be installed.

The [NVIDIA GPU Driver Extension](/extensions/hpccompute-gpu-windows.md) installs appropriate NVIDIA CUDA or GRID drivers on an N-series VM. Install or manage the extension using the Azure portal or tools such as Azure PowerShell or Azure Resource Manager templates. See the [NVIDIA GPU Driver Extension documentation](/extensions/hpccompute-gpu-windows.md) for supported operating systems and deployment steps. For general information about VM extensions, see [Azure virtual machine extensions and features](/extensions/overview.md).

If you choose to install NVIDIA GPU drivers manually, see [N-series GPU driver setup for Windows](/windows/n-series-driver-setup.md) or [N-series GPU driver setup for Linux](/linux/n-series-driver-setup) for supported operating systems, drivers, installation, and verification steps.

To install AMD GPU drivers manually, see N-series [AMD GPU driver setup for Windows](/windows/n-series-driver-setup.md) for supported operating systems, drivers, installation, and verification steps.

## Other sizes

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.