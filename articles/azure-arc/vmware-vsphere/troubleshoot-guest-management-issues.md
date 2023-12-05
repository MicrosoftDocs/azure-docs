---
title: Troubleshoot Guest Management Issues
description: Learn about how to troubleshoot the guest management issues for Arc-enabled VMware vSphere.
ms.topic: reference
ms.date: 11/06/2023
ms.service: azure-arc
ms.subservice: azure-arc-vmware-vsphere
author: Farha-Bano
ms.author: v-farhabano
manager: jsuri

# Customer intent: As a VI admin, I want to understand the troubleshooting process for guest management issues.
---
# Troubleshoot Guest Management for Linux VMs

This article provides information on how to troubleshoot and resolve the issues that can occur while you enable guest management on Arc-enabled VMware vSphere virtual machines.  

## Troubleshoot issues while enabling Guest Management on a domain-joined Linux VM

**Error message**: Enabling Guest Management on a domain-joined Linux VM fails with the error message **InvalidGuestLogin: Failed to authenticate to the system with the credentials**.

**Resolution**: Before you enable Guest Management on a domain-joined Linux VM using active directory credentials, follow these steps to set the configuration on the VM:

1. In the SSSD configuration file (typically, */etc/sssd/sssd.conf*), add the following under the section for the domain:

      [domain/contoso.com]
      ad_gpo_map_batch = +vmtoolsd

2. After making the changes to SSSD configuration, restart the SSSD process. If SSSD is running as a system process, run `sudo systemctl restart sssd` to restart it.

### Additional information

The parameter `ad_gpo_map_batch` according to the [sssd main page](https://jhrozek.fedorapeople.org/sssd/1.13.4/man/sssd-ad.5.html):

A comma-separated list of Pluggable Authentication Module (PAM) service names for which GPO-based access control is evaluated based on the BatchLogonRight and DenyBatchLogonRight policy settings.

It's possible to add another PAM service name to the default set by using **+service_name** or to explicitly remove a PAM service name from the default set by using **-service_name**. For example, to replace a default PAM service name for this sign in (for example, **crond**) with a custom PAM service name (for example, **my_pam_service**), use this configuration:

`ad_gpo_map_batch = +my_pam_service, -crond`

Default: The default set of PAM service names includes:

- crond:

    `vmtoolsd` PAM is enabled for SSSD evaluation. For any request coming through VMware tools, SSSD is invoked since VMware tools use this PAM for authenticating to the Linux Guest VM.

#### References

- [Invoke-VMScript to an domain joined Ubuntu VM](https://communities.vmware.com/t5/VMware-PowerCLI-Discussions/Invoke-VMScript-to-an-domain-joined-Ubuntu-VM/td-p/2257554).


## Troubleshoot issues while enabling Guest Management on RHEL-based Linux VMs

Applies to: 

- RedHat Linux
- CentOS
- Rocky Linux
- Oracle Linux
- SUSE Linux
- SUSE Linux Enterprise Server
- Alma Linux
- Fedora


**Error message**: Provisioning of the resource failed with Code: `AZCM0143`; Message: `install_linux_azcmagent.sh: installation error`.

**Workaround**

Before you enable the guest agent, follow these steps on the VM:

1. Create file `vmtools_unconfined_rpm_script_kcs5347781.te` using the following:

     `policy_module(vmtools_unconfined_rpm_script_kcs5347781, 1.0) 
     gen_require(`
     type vmtools_unconfined_t;
     ')
     optional_policy(`
     rpm_transition_script(vmtools_unconfined_t,system_r)
     ')`

2. Install the package to build the policy module:

     `sudo yum -y install selinux-policy-devel`

3. Compile the module:

     `make -f /usr/share/selinux/devel/Makefile vmtools_unconfined_rpm_script_kcs5347781.pp`

4. Install the module:

     `sudo semodule -i vmtools_unconfined_rpm_script_kcs5347781.pp`

### Additional information

Track the issue through [BZ 1872245 - [VMware][RHEL 8] vmtools is not able to install rpms](https://bugzilla.redhat.com/show_bug.cgi?id=1872245).

Upon executing a command using `vmrun` command, the context of the `yum` or `rpm` command is `vmtools_unconfined_t`.

Upon `yum` or `rpm` executing scriptlets, the context is changed to `rpm_script_t`, which is currently denied because of the missing rule in the SELinux policy.

#### References

- [Executing yum/rpm commands using VMware tools facility (vmrun) fails in error when packages have scriptlets](https://access.redhat.com/solutions/5347781).

## Next steps

If you don't see your problem here or you can't resolve your issue, try one of the following channels for support:

- Get answers from Azure experts through [Microsoft Q&A](/answers/topics/azure-arc.html).

- Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.

- [Open an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md).