---
title: Troubleshoot NFSv4.1 Kerberos volume issues for Azure NetApp Files | Microsoft Docs
description: Describes error messages and resolutions that can help you troubleshoot NFSv4.1 Kerberos volume issues for Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: troubleshooting
ms.date: 01/12/2021
ms.author: b-juche
---
# Troubleshoot NFSv4.1 Kerberos volume issues 

This article describes resolutions to error conditions you might have when creating or managing NFSv4.1 Kerberos volumes. 

## Error conditions and resolutions

|     Error conditions    |     Resolutions    |
|-|-|
|`Error allocating volume - Export policy rules does not match kerberosEnabled flag` | Azure NetApp Files does not support Kerberos for NFSv3 volumes. Kerberos is supported only for the NFSv4.1 protocol.  |
|`This NetApp account has no configured Active Directory   connections`  |  Configure   Active Directory for the NetApp account with fields **KDC IP** and **AD Server Name**. See [Configure the Azure portal](configure-kerberos-encryption.md#configure-the-azure-portal) for instructions. |
|`Mismatch between KerberosEnabled flag value and ExportPolicyRule's access type parameter values.`  | Azure NetApp Files does not support converting a plain NFSv4.1 volume to Kerberos NFSv4.1 volume, and vice-versa. |
|`mount.nfs: access denied by server when mounting volume <SMB_SERVER_NAME-XXX.DOMAIN_NAME>/<VOLUME_NAME>` <br>  Example: `smb-test-64d9.contoso.com:/nfs41-vol101` | <ol><li> Ensure that the A/PTR records are properly set up and exist in the Active Directory for the server name `smb-test-64d9.contoso.com`. <br> In the NFS client, if `nslookup` of `smb-test-64d9.contoso.com` resolves to IP address IP1 (that is, `10.1.1.68`), then `nslookup` of IP1 must resolve to only one record (that is, `smb-test-64d9.contoso.com`). `nslookup` of IP1 *must* not resolve to multiple names. </li>  <li>Set AES-256 for the NFS machine account of type `NFS-<Smb NETBIOS NAME>-<few random characters>` on AD using either PowerShell or the UI. <br> Example commands: <ul><li>`Set-ADComputer <NFS_MACHINE_ACCOUNT_NAME> -KerberosEncryptionType AES256` </li><li>`Set-ADComputer NFS-SMB-TEST-64 -KerberosEncryptionType AES256` </li></ul> </li> <li>Ensure that the time of the NFS client, AD, and Azure NetApp Files storage software is synchronized with each other and is within a five-minute skew range. </li>  <li>Get the Kerberos ticket on the NFS client using the command `kinit <administrator>`.</li> <li>Reduce the NFS client hostname to less than 15 characters and perform the realm join again. </li><li>Restart the NFS client and the `rpcgssd` service as follows. The command might vary depending on the OS.<br> RHEL 7: <br> `service nfs restart` <br> `service rpcgssd restart` <br> CentOS 8: <br> `systemctl enable nfs-client.target && systemctl start nfs-client.target` <br> Ubuntu: <br> (Restart the `rpc-gssd` service.) <br> `sudo systemctl start rpc-gssd.service` </ul>| 
|`mount.nfs: an incorrect mount option was specified` 	| The issue might be related to the NFS client issue. Reboot the NFS client.  	|
|`Hostname lookup failed`  	| You need to create a reverse lookup zone on the DNS server, and then add a PTR record of the AD host machine in that reverse lookup zone. <br> For example, assume that the IP address of the AD machine is `10.1.1.4`, the hostname of the AD machine (as found by using the hostname command) is `AD1`, and the domain name is `contoso.com`. The PTR record added to the reverse lookup zone should be `10.1.1.4 -> AD1.contoso.com`. |
|`Volume creation fails due to unreachable DNS server`  | Two possible solutions are available: <br> <ul><li> This error indicates that DNS is not reachable. The reason might be an incorrect DNS IP or a networking issue. Check the DNS IP entered in AD connection and make sure that the IP is correct. </li> <li> Make sure that the AD and the volume are in same region and in same VNet. If they are in different VNets, ensure that VNet peering is established between the two VNets. </li></ul> |
|NFSv4.1 Kerberos volume creation fails with an error similar to the following example: <br> `Failed to enable NFS Kerberos on LIF "svm_e719cde8d6d0413fbd6adac0636cdecb_7ad0b82e_73349613". Failed to bind service principal name on LIF "svm_e719cde8d6d0413fbd6adac0636cdecb_7ad0b82e_73349613". SecD Error: server create fail join user auth.`	|The KDC IP is wrong and the Kerberos volume has been  created. Update the KDC IP with a correct address. <br> After you update the KDC IP, the error will not go away. You need to re-create the volume. |

## Next steps  

* [Configure NFSv4.1 Kerberos encryption for Azure NetApp Files](configure-kerberos-encryption.md)
