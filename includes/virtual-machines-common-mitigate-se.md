---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 08/14/2018
 ms.author: cynthn;kareni
 ms.custom: include file
---


**Last document update**: 14 August 2018 10:00 AM PST.

The disclosure of a [new class of CPU vulnerabilities](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/ADV180002) known as speculative execution side-channel attacks has resulted in questions from customers seeking more clarity.  

Microsoft has deployed mitigations across all our cloud services. The infrastructure that runs Azure and isolates customer workloads from each other is protected. This means that a potential attacker using the same infrastructure can’t attack your application using these vulnerabilities.

Azure is using [memory preserving maintenance](https://docs.microsoft.com/azure/virtual-machines/windows/maintenance-and-updates#memory-preserving-maintenance) whenever possible, to minimize customer impact and eliminate the need for reboots. Azure will continue utilizing these methods when making systemwide updates to the host and protect our customers.

More information about how security is integrated into every aspect of Azure is available on the [Azure Security Documentation](https://docs.microsoft.com/azure/security/) site. 

> [!NOTE] 
> Since this document was first published, multiple variants of this vulnerability class have been disclosed. Microsoft continues to be heavily invested in protecting our customers and providing guidance. This page will be updated as we continue to release further fixes. 
> 
> On August 14, 2018, the industry disclosed a new speculative execution side channel vulnerability known as [L1 Terminal Fault](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/ADV180018) (L1TF) which has been assigned multiple CVEs ([CVE-2018-3615, CVE-2018-3620, and CVE-2018-3646](https://www.intel.com/content/www/us/en/security-center/advisory/intel-sa-00161.html)). This vulnerability affects Intel® Core® processors and Intel® Xeon® processors. Microsoft has deployed mitigations across our cloud services which reinforce the isolation between customers. Please read below for additional guidance to protect against L1TF and previous vulnerabilities ([Spectre Variant 2 CVE-2017-5715 and Meltdown Variant 3 CVE-2017-5754](https://support.microsoft.com/help/4072698/windows-server-guidance-to-protect-against-the-speculative-execution)).
>  






## Keeping your Operating Systems up-to-date

While an OS update is not required to isolate your applications running on Azure from other Azure customers, it is always a best practice to keep your software up-to-date. The latest Security Rollups for Windows contain mitigations for several speculative execution side channel vulnerabilities. Similarly, Linux distributions have released multiple updates to address these vulnerabilities. Here are our recommended actions to update your Operating System:

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

You can enable additional security features inside your VM or Cloud Service.

### Windows 

Your target operating system must be up-to-date to enable these additional security features. While numerous speculative execution side channel mitigations are enabled by default, the additional features described here must be enabled manually and may cause a performance impact. 

**Step 1**: [Contact Azure Support](https://aka.ms/MicrocodeEnablementRequest-SupportTechnical) to expose updated firmware (microcode) into your Virtual Machines. 

**Step 2**: Enable Kernel Virtual Address Shadowing (KVAS) and Branch Target Injection (BTI) OS support. Follow the instructions in [KB4072698](https://support.microsoft.com/help/4072698/windows-server-guidance-to-protect-against-the-speculative-execution) to enable protections via the `Session Manager` registry keys. A reboot is required. 

**Step 3**: For deployments that are using [nested virtualization](https://docs.microsoft.com/azure/virtual-machines/windows/nested-virtualization) (D3 and E3 only): 
These instructions apply inside the VM you are using as a Hyper-V host. 

1. Follow the instructions in [KB4072698](https://support.microsoft.com/help/4072698/windows-server-guidance-to-protect-against-the-speculative-execution) to enable protections via the `MinVmVersionForCpuBasedMitigations` registry keys.  
 
1. Set the hypervisor scheduler type to **Core** by following the instructions [here](https://docs.microsoft.com/windows-server/virtualization/hyper-v/manage/manage-hyper-v-scheduler-types). 

**Step 4**: Follow the instructions in [KB4072698](https://support.microsoft.com/help/4072698/windows-server-guidance-to-protect-against-the-speculative-execution) to verify protections are enabled using the [SpeculationControl](https://aka.ms/SpeculationControlPS) PowerShell module. 

> [!NOTE]
> If you previously downloaded this module, you will need to install the newest version.
>

All VMs should show:

```
branch target injection mitigation is enabled: True

kernel VA shadow is enabled: True  

L1TFWindowsSupportEnabled: True
```


### Linux

<a name="linux"></a>Enabling the set of additional security features inside requires that the target operating system be fully up-to-date. Some mitigations will be enabled by default. The following section describes the features which are off by default and/or reliant on hardware support (microcode). Enabling these features may cause a performance impact. Reference your operating system provider’s documentation for further instructions
 
**Step 1**: [Contact Azure Support](https://aka.ms/MicrocodeEnablementRequest-SupportTechnical) to expose updated firmware (microcode) into your Virtual Machines.
 
**Step 2**: Enable Branch Target Injection (BTI) OS support to mitigate CVE-2017-5715 (Spectre Variant 2) by following your operating system provider’s documentation. 
 
**Step 3**: Enable Kernel Page Table Isolation (KPTI) to mitigate CVE-2017-5754 (Meltdown Variant 3) by following your operating system provider’s documentation. 
 
More information is available from your operating system’s provider:  
 
- [Redhat and CentOS](https://access.redhat.com/security/vulnerabilities/speculativeexecution) 
- [Suse](https://www.suse.com/support/kb/doc/?id=7022512) 
- [Ubuntu](https://wiki.ubuntu.com/SecurityTeam/KnowledgeBase/SpectreAndMeltdown) 


## Next steps

To learn more, see [Securing Azure customers from CPU vulnerability](https://azure.microsoft.com/blog/securing-azure-customers-from-cpu-vulnerability/).
