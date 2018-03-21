


**Last document update**: January 22, 3:00 PM PST.

The recent disclosure of a [new class of CPU vulnerabilities](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/ADV180002) known as speculative execution side-channel attacks has resulted in questions from customers seeking more clarity.  

The infrastructure that runs Azure and isolates customer workloads from each other is protected.  This means that other customers running on Azure cannot attack your application using these vulnerabilities.

> [!NOTE] 
> Azure mitigations previously announced on Jan 3, 2018 are unaffected by the recent [updated guidance](https://newsroom.intel.com/news/root-cause-of-reboot-issue-identified-updated-guidance-for-customers-and-partners/) from Intel. There will be no additional maintenance activity on customer VMs as a result of this new information.
>
> We will continue to update these best practices as we receive microcode updates from hardware vendors. Please check back for updated guidance.
>

## Keeping your Operating Systems up-to-date

While an OS update is not required to isolate your applications running on Azure from other customers running on Azure, it is always a best practice to keep your OS versions up-to-date. 

In the following offerings, here are our recommended actions to update your Operating System: 

<table>
<tr>
<th>Offering</th> <th>Recommended Action </th>
</tr>
<tr>
<td>Azure Cloud Services </td>	<td>Enable auto update or ensure you are running the newest Guest OS.</td>
</tr>
<tr>
<td>Azure Linux Virtual Machines</td> <td>Install updates from your operating system provider when available. </td>
</tr>
<tr>
<td>Azure Windows Virtual Machines </td> <td>Verify that you are running a supported antivirus application before you install OS updates. Contact your antivirus software vendor for compatibility information.<p> Install the [January security rollup](https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/ADV180002). </p></td>
</tr>
<tr>
<td>Other Azure PaaS Services</td> <td>There is no action needed for customers using these services. Azure automatically keeps your OS versions up-to-date. </td>
</tr>
</table>

## Additional guidance if you are running untrusted code 

No additional customer action is needed unless you are running untrusted code. If you allow code that you do not trust (for example, you allow one of your customers to upload a binary or code-snippet that you then execute in the cloud within your application), then the following additional steps should be taken.  


### Windows 
If you are using Windows and hosting untrusted code, you should also enable a Windows feature called Kernel Virtual Address (KVA) Shadowing which provides additional protection against speculative execution side-channel vulnerabilities. This feature is turned off by default and may impact performance if enabled. 
Follow [Windows Server KB4072698](https://support.microsoft.com/help/4072698/windows-server-guidance-to-protect-against-the-speculative-execution) instructions for Enabling Protections on the Server. If you are running Azure Cloud Services, verify that you are running WA-GUEST-OS-5.15_201801-01 or WA-GUEST-OS-4.50_201801-01 (available starting on January 10th) and enable the registry key via a startup task.


### Linux
If you are using Linux and hosting untrusted code, you should also update Linux to a more recent version that implements kernel page-table isolation (KPTI) which separates the page tables used by the kernel from those belonging to user space. These mitigations require a Linux OS update and can be obtained from your distribution provider when available. Your OS provider can tell you whether protections are enabled or disabled by default.



## Next steps

To learn more, see [Securing Azure customers from CPU vulnerability](https://azure.microsoft.com/blog/securing-azure-customers-from-cpu-vulnerability/).
