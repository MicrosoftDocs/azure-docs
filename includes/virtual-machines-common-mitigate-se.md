
 
The recent disclosure of a [new class of CPU vulnerabilities](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/ADV180002) known as speculative execution side-channel attacks has resulted in questions from customers seeking more clarity. 

 
## Azure infrastructure

The issues described in the vulnerability disclosure could be used to bypass a hypervisor boundary and allow disclosure of memory between two co-hosted virtual machines. As reported in an earlier [blog post](https://azure.microsoft.com/blog/securing-azure-customers-from-cpu-vulnerability/), Azure has applied mitigations to protect customers against this vulnerability.  Microsoft always recommends that customers apply security best practices for your VM images including installing all security updates from their operating system vendor.

## PaaS Services on Azure
Azure PaaS offerings have mitigations deployed by default. No action is required by customers. See below for Azure Cloud Services exception.  


## Azure Cloud Services

[Azure Cloud Services](https://azure.microsoft.com/services/cloud-services/) with auto update enabled automatically receive a version of the Guest OS that includes mitigations to these vulnerabilities. 

The following Guest OS releases include updates with protections against speculative execution side channel vulnerabilities:

* WA-GUEST-OS-5.15_201801-01
* WA-GUEST-OS-4.50_201801-01


A small number of customers using Azure Cloud Services to host untrusted code should also enable [Kernel Virtual Address Shadowing](#enabling-kernel-virtual-address-shadowing-on-windows-server) in addition to updating the Guest OS. This provides additional protection against speculative execution side-channel vulnerabilities. This can be accomplished via a startup task. More information about which customers and usage scenarios require this feature and how to enable it, is provided below.


## Azure Virtual Machines (Windows & Linux)

Microsoft always recommends that customers install all security updates. 

The January 2018 security rollup contains fixes for these vulnerabilities and more. Verify that you are running a supported antivirus application before you install OS updates. Contact the antivirus software vendor for compatibility information. 

To address speculative execution vulnerabilities, updates to the Linux kernel will be required and can be obtained from your distribution provider when available. 

A small number of customers using Azure Virtual Machines (Windows) to host untrusted code should also enable [Kernel Virtual Address Shadowing](#enabling-kernel-virtual-address-shadowing-on-windows-server) which provides additional protection against speculative execution side-channel vulnerabilities.  More information about which customers and usage scenarios require this feature and how to enable it is provided below.


## Enabling Kernel Virtual Address Shadowing on Windows Server

Customers who use Windows Server to execute untrusted code should enable a feature called Kernel Virtual Address Shadowing which provides protection for systems where untrusted code is executing with low user privileges.

This additional protection may affect performance and is turned off by default. Kernel Virtual Address Shadowing protects against process-to-process and kernel-to-process information disclosure.

Your VMs, Cloud Services, or on-premises servers are at risk if they fall into one of the following categories:

* Azure nested virtualization Hyper-V Hosts
* Remote Desktop Services Hosts (RDSH)
* Virtual machines or cloud services that are running untrusted code such as containers or untrusted extensions for database, untrusted web content or workloads that run code that is provided from external sources.

An example of a scenario where Kernel Virtual Address Shadowing is necessary: 

|     |
|-----|
|An Azure virtual machine runs a service where untrusted users can submit JavaScript code which is executed with limited privileges. On the same VM, there exists a highly privileged process which contains secret data that should not be accessible to those users. In this situation, Kernel Virtual Address Shadowing is necessary to provide protection against disclosure between the two.|
|     | 

Specific instructions on enabling Kernel Virtual Address Shadowing are available through [Windows Server KB4072698](https://support.microsoft.com/help/4072698/windows-server-guidance-to-protect-against-the-speculative-execution).


> [!NOTE]
> At the time of publication, Kernel Virtual Address Shadowing is only available in Windows Server 2016, Windows Server 2012 R2, and Windows Server 2008 R2.  
>
>

If you are running a Linux Server, please consult with the vendor of your operating systems for updates and instructions.

## Branch Target Injection Mitigation Support (Microcode)

Customers using tools that detect the existence of microcode-based mitigations report that Azure is unpatched. This is incorrect. At the time of this publication, Branch Target Injection Mitigation Support is not exposed from the Azure Hypervisor into Azure Virtual Machines or Azure Cloud Services. This means that Virtual Machines are unaware of the existence of microcode and cannot use its augmented instruction set. This does not mean that Azure is vulnerable to cross-VM speculative execution side channel attacks.
 
## Next steps

To learn more, see [Securing Azure customers from CPU vulnerability](https://azure.microsoft.com/blog/securing-azure-customers-from-cpu-vulnerability/).