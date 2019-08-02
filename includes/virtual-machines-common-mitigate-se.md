---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 06/04/2019
 ms.author: cynthn;kareni
 ms.custom: include file
---


**Last document update**: 4 June 2019 3:00 PM PST.

The disclosure of a [new class of CPU vulnerabilities](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/ADV180002) known as speculative execution side-channel attacks has resulted in questions from customers seeking more clarity.  

Microsoft has deployed mitigations across all our cloud services. The infrastructure that runs Azure and isolates customer workloads from each other is protected. This means that a potential attacker using the same infrastructure can’t attack your application using these vulnerabilities.

Azure is using [memory preserving maintenance](https://docs.microsoft.com/azure/virtual-machines/windows/maintenance-and-updates#maintenance-that-doesnt-require-a-reboot) whenever possible, to minimize customer impact and eliminate the need for reboots. Azure will continue utilizing these methods when making systemwide updates to the host and protect our customers.

More information about how security is integrated into every aspect of Azure is available on the [Azure Security Documentation](https://docs.microsoft.com/azure/security/) site. 

> [!NOTE] 
> Since this document was first published, multiple variants of this vulnerability class have been disclosed. Microsoft continues to be heavily invested in protecting our customers and providing guidance. This page will be updated as we continue to release further fixes. 
> 
> On May 14, 2019, [Intel disclosed](https://www.intel.com/content/www/us/en/security-center/advisory/intel-sa-00233.html) a new set of speculative execution side channel vulnerability known as Microarchitectural Data Sampling (MDS see the Microsoft Security Guidance [ADV190013](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/ADV190013)), which has been assigned multiple CVEs: 
> - CVE-2019-11091 - Microarchitectural Data Sampling Uncacheable Memory (MDSUM)
> - CVE-2018-12126 - Microarchitectural Store Buffer Data Sampling (MSBDS) 
> - CVE-2018-12127 - Microarchitectural Load Port Data Sampling (MLPDS)
> - CVE-2018-12130 - Microarchitectural Fill Buffer Data Sampling (MFBDS)
>
> This vulnerability affects Intel® Core® processors and Intel® Xeon® processors.  Microsoft Azure has released operating system updates and is deploying new microcode, as it is made available by Intel, throughout our fleet to protect our customers against these new vulnerabilities.   Azure is closely working with Intel to test and validate the new microcode prior to its official release on the platform. 
>
> **Customers that are running untrusted code within their VM** need to take action to protect against these vulnerabilities by reading below for additional guidance on all speculative execution side-channel vulnerabilities (Microsoft Advisories ADV [180002](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/ADV180002), [180018](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/adv180018), and [190013](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/ADV190013)).
>
> Other customers should evaluate these vulnerabilities from a Defense in Depth perspective and consider the security and performance implications of their chosen configuration.



## Keeping your operating systems up-to-date

While an OS update is not required to isolate your applications running on Azure from other Azure customers, it is always a best practice to keep your software up-to-date. The latest Security Rollups for Windows contain mitigations for several speculative execution side channel vulnerabilities. Similarly, Linux distributions have released multiple updates to address these vulnerabilities. Here are our recommended actions to update your operating system:

| Offering | Recommended Action  |
|----------|---------------------|
| Azure Cloud Services  | Enable [auto update](https://docs.microsoft.com/azure/cloud-services/cloud-services-how-to-configure-portal) or ensure you are running the newest Guest OS. |
| Azure Linux Virtual Machines | Install updates from your operating system provider. For more information, see [Linux](#linux) later in this document. |
| Azure Windows Virtual Machines  | Install the latest security rollup.
| Other Azure PaaS Services | There is no action needed for customers using these services. Azure automatically keeps your OS versions up-to-date. |

## Additional guidance if you are running untrusted code 

Customers who allow untrusted users to execute arbitrary code may wish to implement some additional security features inside their Azure Virtual Machines or Cloud Services. These features protect against the intra-process disclosure vectors that several speculative execution vulnerabilities describe.

Example scenarios where additional security features are recommended:

- You allow code that you do not trust to run inside your VM.  
	- *For example, you allow one of your customers to upload a binary or script that you then execute within your application*. 
- You allow users that you do not trust to log into your VM using low privileged accounts.   
	- *For example, you allow a low-privileged user to log into one of your VMs using remote desktop or SSH*.  
- You allow untrusted users access to virtual machines implemented via nested virtualization.  
	- *For example, you control the Hyper-V host, but allocate the VMs to untrusted users*. 

Customers who do not implement a scenario involving untrusted code do not need to enable these additional security features. 

## Enabling additional security 

You can enable additional security features inside your VM or Cloud Service if you are running untrusted code. In parallel, ensure your operating system is up-to-date to enable security features inside your VM or Cloud Service

### Windows 

Your target operating system must be up-to-date to enable these additional security features. While numerous speculative execution side channel mitigations are enabled by default, the additional features described here must be enabled manually and may cause a performance impact. 


**Step 1: Disable hyper-threading on the VM** - Customers running untrusted code on a hyper-threaded VM will need to disable hyper-threading or move to a non-hyper-threaded VM size. Reference [this doc](https://docs.microsoft.com/azure/virtual-machines/windows/acu) for a list of hyper-threaded VM sizes (where ratio of vCPU to Core is 2:1). To check if your VM has hyper-threading enabled, please refer to the below script using the Windows command line from within the VM.

Type `wmic` to enter the interactive interface. Then type the below to view the amount of physical and logical processors on the VM.

```console
CPU Get NumberOfCores,NumberOfLogicalProcessors /Format:List
```

If the number of logical processors is greater than physical processors (cores), then hyper-threading is enabled.  If you are running a hyper-threaded VM, please [contact Azure Support](https://aka.ms/MicrocodeEnablementRequest-SupportTechnical) to get hyper-threading disabled.  Once hyper-threading is disabled, **support will require a full VM reboot**. Please refer to [Core count](#core-count) to understand why your VM core count decreased.


**Step 2**: In parallel to Step 1, follow the instructions in [KB4072698](https://support.microsoft.com/help/4072698/windows-server-guidance-to-protect-against-the-speculative-execution) to verify protections are enabled using the [SpeculationControl](https://aka.ms/SpeculationControlPS) PowerShell module.

> [!NOTE]
> If you previously downloaded this module, you will need to install the newest version.
>


The output of the PowerShell script should have the below values to validate enabled protections against these vulnerabilities:

```
Windows OS support for branch target injection mitigation is enabled: True
Windows OS support for kernel VA shadow is enabled: True
Windows OS support for speculative store bypass disable is enabled system-wide: False
Windows OS support for L1 terminal fault mitigation is enabled: True
Windows OS support for MDS mitigation is enabled: True
```

If the output shows `MDS mitigation is enabled: False`, please [contact Azure Support](https://aka.ms/MicrocodeEnablementRequest-SupportTechnical) for available mitigation options.



**Step 3**: To enable Kernel Virtual Address Shadowing (KVAS) and Branch Target Injection (BTI) OS support, follow the instructions in [KB4072698](https://support.microsoft.com/help/4072698/windows-server-guidance-to-protect-against-the-speculative-execution) to enable protections using the `Session Manager` registry keys. A reboot is required.


**Step 4**: For deployments that are using [nested virtualization](https://docs.microsoft.com/azure/virtual-machines/windows/nested-virtualization) (D3 and E3 only): These instructions apply inside the VM you are using as a Hyper-V host.

1.	Follow the instructions in [KB4072698](https://support.microsoft.com/help/4072698/windows-server-guidance-to-protect-against-the-speculative-execution) to enable protections using the `MinVmVersionForCpuBasedMitigations` registry keys.
2.	Set the hypervisor scheduler type to `Core` by following the instructions [here](https://docs.microsoft.com/windows-server/virtualization/hyper-v/manage/manage-hyper-v-scheduler-types).


### Linux

<a name="linux"></a>Enabling the set of additional security features inside requires that the target operating system be fully up-to-date. Some mitigations will be enabled by default. The following section describes the features which are off by default and/or reliant on hardware support (microcode). Enabling these features may cause a performance impact. Reference your operating system provider’s documentation for further instructions


**Step 1: Disable hyper-threading on the VM** - Customers running untrusted code on a hyper-threaded VM will need to disable hyper-threading or move to a non-hyper-threaded VM.  Reference [this doc](https://docs.microsoft.com/azure/virtual-machines/linux/acu) for a list of hyper-threaded VM sizes (where ratio of vCPU to Core is 2:1). To check if you are running a hyper-threaded VM, run the `lscpu` command in the Linux VM. 

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

If you are running a hyper-threaded VM, please [contact Azure Support](https://aka.ms/MicrocodeEnablementRequest-SupportTechnical) to get hyper-threading disabled.  Once hyper-threading is disabled, **support will require a full VM reboot**. Please refer to [Core count](#core-count) to understand why your VM core count decreased.



**Step 2**: To mitigate against any of the below speculative execution side-channel vulnerabilities, refer to your operating system provider’s documentation:   
 
- [Redhat and CentOS](https://access.redhat.com/security/vulnerabilities) 
- [SUSE](https://www.suse.com/support/kb/?doctype%5B%5D=DT_SUSESDB_PSDB_1_1&startIndex=1&maxIndex=0) 
- [Ubuntu](https://wiki.ubuntu.com/SecurityTeam/KnowledgeBase/) 


### Core count

When a hyper-threaded VM is created, Azure allocates 2 threads per core - these are called vCPUs. When hyper-threading is disabled, Azure removes a thread and surfaces up single threaded cores (physical cores). The ratio of vCPU to CPU is 2:1, so once hyper-threading is disabled, the CPU count in the VM will appear to have decreased by half. For example, a D8_v3 VM is a hyper-threaded VM running on 8 vCPUs (2 threads per core x 4 cores).  When hyper-threading is disabled, CPUs will drop to 4 physical cores with 1 thread per core. 

## Next steps

This article provides guidance to the below speculative execution side-channel attacks that affect many modern processors:

[Spectre Meltdown](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/ADV180002):
- CVE-2017-5715 - Branch Target Injection (BTI)  
- CVE-2017-5754 - Kernel Page Table Isolation (KPTI)
- CVE-2018-3639 – Speculative Store Bypass (KPTI) 
 
[L1 Terminal Fault (L1TF)](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/ADV180018):
- CVE-2018-3615 - Intel Software Guard Extensions (Intel SGX)
- CVE-2018-3620 - Operating Systems (OS) and System Management Mode (SMM)
- CVE-2018-3646 – impacts Virtual Machine Manager (VMM)

[Microarchitectural Data Sampling](https://portal.msrc.microsoft.com/en-us/security-guidance/advisory/ADV190013): 
- CVE-2019-11091 - Microarchitectural Data Sampling Uncacheable Memory (MDSUM)
- CVE-2018-12126 - Microarchitectural Store Buffer Data Sampling (MSBDS)
- CVE-2018-12127 - Microarchitectural Load Port Data Sampling (MLPDS)
- CVE-2018-12130 - Microarchitectural Fill Buffer Data Sampling (MFBDS)








