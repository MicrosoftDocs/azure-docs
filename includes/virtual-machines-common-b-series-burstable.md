
> [!NOTE] 
> Previews are made available to you on the condition that you agree to the terms of use. For more information, see [Microsoft Azure Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> This preview will be limited to the following regions:
> - US - West 2
> - US - East
> - Europe - West
> - Asia Pacific - Southeast

After the preview has completed we will rapidly release the B-Series to all remaining regions.

The B-Series VM family will allow you to choose which VM size provides you the necessary base level performance for your workload, while you with the ability to burst CPU performance 100% of the core. This VM size provides you the choice of 10%-135% of an Intel® Broadwell E5-2673 v4 2.3GHz, or an Intel® Haswell 2.4 GHz E5-2673 v3 processor core.

The B-Series VM’s are ideal for workloads that do not need the full performance of the CPU for large amounts of time, like web servers, small databases and development and test environments. These workloads typically have burstable performance requirements. The B-Series provides you with the ability to purchase a VM size with baseline performance and then it builds up credits when the VM is utilizing less than its base performance. When the VM has accumulated credit, the VM can burst above the VM’s baseline using up to 100% of the CPU Core when your application requires the higher CPU performance.


| Size          | vCPU's               | Memory: GiB | Local SSD: GiB | Base Performance of a Core | Credits banked / hour | Max Banked Credits | Linux Price / Hour |    Windows Price / Hour      |
|---------------|----------------------|-------------|----------------|----------------------------|-----------------------|--------------------|--------------------|----------|
| Standard_B1s  | 1                    | 1           | 4              | 10%                        | 6                     | 144                | $ 0.012            | $ 0.017  |
| Standard_B1ms | 1                    | 2           | 4              | 20%                        | 12                    | 288                | $ 0.023            | $ 0.032  |
| Standard_B2s  | 2                    | 4           | 8              | 40%                        | 24                    | 576                | $ 0.047            | $ 0.065  |
| Standard_B2ms | 2                    | 8           | 16             | 60%                        | 36                    | 864                | $ 0.094            | $ 0.0122 |
| Standard_B4ms | 4                    | 16          | 32             | 90%                        | 54                    | 1296               | $ 0.188            | $ 0.229  |
| Standard_B8ms | 8                    | 32          | 64             | 135%                       | 81                    | 1944               | $ 0.376            | $ 0.439  |


