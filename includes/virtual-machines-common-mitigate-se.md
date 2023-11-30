---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 06/14/2022
 ms.author: cynthn;kareni
 ms.custom: include file
---

This article provides guidance for a new class of silicon based micro-architectural and speculative execution side-channel vulnerabilities that affect many modern processors and operating systems. This includes Intel, AMD, and ARM. Specific details for these silicon-based vulnerabilities can be found in the following security advisories and CVEs: 
- [ADV180002 - Guidance to mitigate speculative execution side-channel vulnerabilities](https://msrc.microsoft.com/update-guide/vulnerability/ADV180002)
- [ADV180012 - Microsoft Guidance for Speculative Store Bypass](https://msrc.microsoft.com/update-guide/vulnerability/ADV180012)
- [ADV180013 - Microsoft Guidance for Rogue System Register Read](https://msrc.microsoft.com/update-guide/vulnerability/ADV180013)
- [ADV180016 - Microsoft Guidance for Lazy FP State Restore](https://msrc.microsoft.com/update-guide/vulnerability/ADV180016)
- [ADV180018 - Microsoft Guidance to mitigate L1TF variant](https://msrc.microsoft.com/update-guide/vulnerability/ADV180018)
- [ADV190013 - Microsoft Guidance to mitigate Microarchitectural Data Sampling vulnerabilities](https://msrc.microsoft.com/update-guide/vulnerability/ADV190013)
- [ADV220002 - Microsoft Guidance on Intel Processor MMIO Stale Data Vulnerabilities](https://msrc.microsoft.com/update-guide/vulnerability/ADV220002)
- [CVE-2022-23816 - AMD CPU Branch Type Confusion](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-23816)
- [CVE-2022-21123 - AMD CPU Branch Type Confusion](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-23825)


The disclosure of these CPU vulnerabilities has resulted in questions from customers seeking more clarity.  

Microsoft has deployed mitigations across all our cloud services. The infrastructure that runs Azure and isolates customer workloads from each other is protected. This means that a potential attacker using the same infrastructure can't attack your application using these vulnerabilities.

Azure is using [memory preserving maintenance](../articles/virtual-machines/maintenance-and-updates.md?bc=%2fazure%2fvirtual-machines%2fwindows%2fbreadcrumb%2ftoc.json%252c%2fazure%2fvirtual-machines%2fwindows%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json%253ftoc%253d%2fazure%2fvirtual-machines%2fwindows%2ftoc.json#maintenance-that-doesnt-require-a-reboot) whenever possible, to minimize customer impact and eliminate the need for reboots. Azure will continue utilizing these methods when making systemwide updates to the host and protect our customers.

More information about how security is integrated into every aspect of Azure is available on the [Azure Security Documentation](../articles/security/index.yml) site. 

> [!NOTE] 
> Since this document was first published, multiple variants of this vulnerability class have been disclosed. Microsoft continues to be heavily invested in protecting our customers and providing guidance. This page will be updated as we continue to release further fixes. 
>
> **Customers that are running untrusted code within their VM** need to take action to protect against these vulnerabilities by reading below for more guidance on all vulnerabilities.
>
> Other customers should evaluate these vulnerabilities from a Defense in Depth perspective and consider the security and performance implications of their chosen configuration.
> 



## Keeping your operating systems up-to-date

While an OS update is not required to isolate your applications running on Azure from other Azure customers, it is always a best practice to keep your software up-to-date. The latest Security Updates for Windows contain mitigations for these vulnerabilities. Similarly, Linux distributions have released multiple updates to address these vulnerabilities. Here are our recommended actions to update your operating system:

| Offering | Recommended Action  |
|----------|---------------------|
| Azure Cloud Services  | Enable [auto update](../articles/cloud-services/cloud-services-how-to-configure-portal.md) or ensure you're running the newest Guest OS. |
| Azure Linux Virtual Machines | Install updates from your operating system provider. For more information, see [Linux](#linux) later in this document. |
| Azure Windows Virtual Machines  | Install the latest security rollup.
| Other Azure PaaS Services | There is no action needed for customers using these services. Azure automatically keeps your OS versions up-to-date. |

## Additional guidance if you're running untrusted code 

Customers who allow untrusted users to execute arbitrary code may wish to implement some extra security features inside their Azure Virtual Machines or Cloud Services. These features protect against the intra-process disclosure vectors that several speculative execution vulnerabilities describe.

Example scenarios where more security features are recommended:

- You allow code that you do not trust to run inside your VM.  
    - *For example, you allow one of your customers to upload a binary or script that you then execute within your application*. 
- You allow users that you do not trust to log into your VM using low privileged accounts.   
    - *For example, you allow a low-privileged user to log into one of your VMs using remote desktop or SSH*.  
- You allow untrusted users access to virtual machines implemented via nested virtualization.  
    - *For example, you control the Hyper-V host, but allocate the VMs to untrusted users*. 

Customers who do not implement a scenario involving untrusted code do not need to enable these extra security features. 

## Enabling additional security 

You can enable more security features inside your VM or Cloud Service if you're running untrusted code. In parallel, ensure your operating system is up-to-date to enable security features inside your VM or Cloud Service

### Windows 

Your target operating system must be up-to-date to enable these extra security features. While numerous mitigations are enabled by default, the extra features described here must be enabled manually and may cause a performance impact. 



#### Option 1

**Step 1:** Follow the instructions in [KB4072698](https://support.microsoft.com/help/4072698/windows-server-guidance-to-protect-against-the-speculative-execution) to verify protections are enabled using the [SpeculationControl](https://aka.ms/SpeculationControlPS) PowerShell module.

> [!NOTE]
> If you previously downloaded this module, you will need to install the newest version.
>


To validate enabled protections against these vulnerabilities, see [Understanding Get-SpeculationControlSettings PowerShell script output](https://support.microsoft.com/topic/understanding-get-speculationcontrolsettings-powershell-script-output-fd70a80a-a63f-e539-cda5-5be4c9e67c04).

If protections are not enabled, please [contact Azure Support](https://aka.ms/microcodeenablementrequest-supporttechnical) to enable additional controls on your Azure VM.

**Step 2:** To enable Kernel Virtual Address Shadowing (KVAS) and Branch Target Injection (BTI) OS support, follow the instructions in [KB4072698](https://support.microsoft.com/help/4072698/windows-server-guidance-to-protect-against-the-speculative-execution) to enable protections using the `Session Manager` registry keys. A reboot is required.


**Step 3:** For deployments that are using [nested virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization) (D3 and E3 only): These instructions apply inside the VM you're using as a Hyper-V host.

1.    Follow the instructions in [KB4072698](https://support.microsoft.com/help/4072698/windows-server-guidance-to-protect-against-the-speculative-execution) to enable protections using the `MinVmVersionForCpuBasedMitigations` registry keys.
2.    Set the hypervisor scheduler type to `Core` by following the instructions [here](/windows-server/virtualization/hyper-v/manage/manage-hyper-v-scheduler-types).

#### Option 2

**Disable hyper-threading on the VM** - Customers running untrusted code on a hyper-threaded VM might choose to disable hyper-threading or move to a non-hyper-threaded VM size. Reference [this doc](../articles/virtual-machines/acu.md) for a list of hyper-threaded VM sizes (where ratio of vCPU to Core is 2:1). To check if your VM has hyper-threading enabled, refer to the below script using the Windows command line from within the VM.

Type `wmic` to enter the interactive interface. Then type the following command to view the amount of physical and logical processors on the VM.

```
CPU Get NumberOfCores,NumberOfLogicalProcessors /Format:List
```

If the number of logical processors is greater than physical processors (cores), then hyper-threading is enabled. If you're running a hyper-threaded VM, [contact Azure Support](https://aka.ms/MicrocodeEnablementRequest-SupportTechnical) to get hyper-threading disabled. Once hyper-threading is disabled, support will require a full VM reboot. Refer to [Core count](#core-count) to understand why your VM core count decreased.

### Option 3

For [CVE-2022-23816](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-23816) and [CVE-2022-21123](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-23825) (AMD CPU Branch Type Confusion), follow both **Option 1** and **Option 2** above.



### Linux

Enabling the set of extra security features inside requires that the target operating system be fully up-to-date. Some mitigations will be enabled by default. The following section describes the features which are off by default and/or reliant on hardware support (microcode). Enabling these features may cause a performance impact. Reference your operating system provider's documentation for further instructions


**Step 1: Disable hyper-threading on the VM** - Customers running untrusted code on a hyper-threaded VM will need to disable hyper-threading or move to a non-hyper-threaded VM.  Reference [this doc](../articles/virtual-machines/acu.md) for a list of hyper-threaded VM sizes (where ratio of vCPU to Core is 2:1). To check if you're running a hyper-threaded VM, run the `lscpu` command in the Linux VM. 

If `Thread(s) per core = 2`, then hyper-threading has been enabled. 

If `Thread(s) per core = 1`, then hyper-threading has been disabled. 

 
Sample output for a VM with hyper-threading enabled: 

```console
CPU Architecture:      x86_64
CPU op-mode(s):        32-bit, 64-bit
Byte Order:            Little Endian
CPU(s):                8
On-line CPU(s) list:   0-7
Thread(s) per core:    2
Core(s) per socket:    4
Socket(s):             1
NUMA node(s):          1

```

If you're running a hyper-threaded VM, [contact Azure Support](https://aka.ms/MicrocodeEnablementRequest-SupportTechnical) to get hyper-threading disabled.  Once hyper-threading is disabled, **support will require a full VM reboot**. Refer to [Core count](#core-count) to understand why your VM core count decreased.



**Step 2:** To mitigate against any of the below CPU based memory vulnerabilities, refer to your operating system provider's documentation:   
 
- [Redhat and CentOS](https://access.redhat.com/security/vulnerabilities) 
- [SUSE](https://www.suse.com/support/kb/?doctype%5B%5D=DT_SUSESDB_PSDB_1_1&startIndex=1&maxIndex=0) 
- [Ubuntu](https://wiki.ubuntu.com/SecurityTeam/KnowledgeBase/) 


### Core count

When a hyper-threaded VM is created, Azure allocates 2 threads per core - these are called vCPUs. When hyper-threading is disabled, Azure removes a thread and surfaces up single threaded cores (physical cores). The ratio of vCPU to CPU is 2:1, so once hyper-threading is disabled, the CPU count in the VM will appear to have decreased by half. For example, a D8_v3 VM is a hyper-threaded VM running on 8 vCPUs (2 threads per core x 4 cores).  When hyper-threading is disabled, CPUs will drop to 4 physical cores with 1 thread per core. 

## Next steps

For more information about how security is integrated into every aspect of Azure, see [Azure Security Documentation](../articles/security/index.yml). 
