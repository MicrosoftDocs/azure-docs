---
title: Troubleshoot OpenShift deployment in Azure | Microsoft Docs
description: Troubleshoot OpenShift deployment in Azure.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: haroldwongms
manager: mdotson
editor: 
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 04/19/2019
ms.author: haroldw
---

# Troubleshoot OpenShift deployment in Azure

If the OpenShift cluster doesn't deploy successfully, the Azure portal will provide error output. The output may be difficult to read which makes it difficult to identify the problem. Quickly scan this output for exit code 3, 4 or 5. The following provides information on these three exit codes:

- Exit code 3: Your Red Hat Subscription User Name / Password or Organization ID / Activation Key is incorrect
- Exit code 4: Your Red Hat Pool ID is incorrect or there are no entitlements available
- Exit code 5: Unable to provision Docker Thin Pool Volume

For all other exit codes, connect to the host(s) via ssh to view the log files.

**OpenShift Container Platform**

SSH to the ansible playbook host. For the template or the Marketplace offer, use the bastion host. From the bastion, you can SSH to all other nodes in the cluster (master, infra, CNS, compute). You'll need to be root to view the log files. Root is disabled for SSH access by default so don't use root to SSH to other nodes.

**OKD**

SSH to the ansible playbook host. For the OKD template (version 3.9 and earlier), use the master-0 host. For the OKD template (version 3.10 and later), use the bastion host. From the ansible playbook host, you can SSH to all other nodes in the cluster (master, infra, CNS, compute). You'll need to be root (sudo su -) to view the log files. Root is disabled for SSH access by default so don't use root to SSH to other nodes.

## Log files

The log files (stderr and stdout) for the host preparation scripts are located in `/var/lib/waagent/custom-script/download/0` on all hosts. If an error occurred during the preparation of the host, view these log files to determine the error.

If the preparation scripts ran successfully, then the log files in the `/var/lib/waagent/custom-script/download/1` directory of the ansible playbook host will need to be examined. If the error occurred during the actual installation of OpenShift, the stdout file will display the error. Use this information to contact Support for further assistance.

Example output

```json
TASK [openshift_storage_glusterfs : Load heketi topology] **********************
fatal: [mycluster-master-0]: FAILED! => {"changed": true, "cmd": ["oc", "--config=/tmp/openshift-glusterfs-ansible-IbhnUM/admin.kubeconfig", "rsh", "--namespace=glusterfs", "deploy-heketi-storage-1-d9xl5", "heketi-cli", "-s", "http://localhost:8080", "--user", "admin", "--secret", "VuoJURT0/96E42Vv8+XHfsFpSS8R20rH1OiMs3OqARQ=", "topology", "load", "--json=/tmp/openshift-glusterfs-ansible-IbhnUM/topology.json", "2>&1"], "delta": "0:00:21.477831", "end": "2018-05-20 02:49:11.912899", "failed": true, "failed_when_result": true, "rc": 0, "start": "2018-05-20 02:48:50.435068", "stderr": "", "stderr_lines": [], "stdout": "Creating cluster ... ID: 794b285745b1c5d7089e1c5729ec7cd2\n\tAllowing file volumes on cluster.\n\tAllowing block volumes on cluster.\n\tCreating node mycluster-cns-0 ... ID: 45f1a3bfc20a4196e59ebb567e0e02b4\n\t\tAdding device /dev/sdd ... OK\n\t\tAdding device /dev/sde ... OK\n\t\tAdding device /dev/sdf ... OK\n\tCreating node mycluster-cns-1 ... ID: 596f80d7bbd78a1ea548930f23135131\n\t\tAdding device /dev/sdc ... Unable to add device: Unable to execute command on glusterfs-storage-4zc42:   Device /dev/sdc excluded by a filter.\n\t\tAdding device /dev/sde ... OK\n\t\tAdding device /dev/sdd ... OK\n\tCreating node mycluster-cns-2 ... ID: 42c0170aa2799559747622acceba2e3f\n\t\tAdding device /dev/sde ... OK\n\t\tAdding device /dev/sdf ... OK\n\t\tAdding device /dev/sdd ... OK", "stdout_lines": ["Creating cluster ... ID: 794b285745b1c5d7089e1c5729ec7cd2", "\tAllowing file volumes on cluster.", "\tAllowing block volumes on cluster.", "\tCreating node mycluster-cns-0 ... ID: 45f1a3bfc20a4196e59ebb567e0e02b4", "\t\tAdding device /dev/sdd ... OK", "\t\tAdding device /dev/sde ... OK", "\t\tAdding device /dev/sdf ... OK", "\tCreating node mycluster-cns-1 ... ID: 596f80d7bbd78a1ea548930f23135131", "\t\tAdding device /dev/sdc ... Unable to add device: Unable to execute command on glusterfs-storage-4zc42:   Device /dev/sdc excluded by a filter.", "\t\tAdding device /dev/sde ... OK", "\t\tAdding device /dev/sdd ... OK", "\tCreating node mycluster-cns-2 ... ID: 42c0170aa2799559747622acceba2e3f", "\t\tAdding device /dev/sde ... OK", "\t\tAdding device /dev/sdf ... OK", "\t\tAdding device /dev/sdd ... OK"]}

PLAY RECAP *********************************************************************
mycluster-cns-0       : ok=146  changed=57   unreachable=0    failed=0   
mycluster-cns-1       : ok=146  changed=57   unreachable=0    failed=0   
mycluster-cns-2       : ok=146  changed=57   unreachable=0    failed=0   
mycluster-infra-0     : ok=143  changed=55   unreachable=0    failed=0   
mycluster-infra-1     : ok=143  changed=55   unreachable=0    failed=0   
mycluster-infra-2     : ok=143  changed=55   unreachable=0    failed=0   
mycluster-master-0    : ok=502  changed=198  unreachable=0    failed=1   
mycluster-master-1    : ok=348  changed=140  unreachable=0    failed=0   
mycluster-master-2    : ok=348  changed=140  unreachable=0    failed=0   
mycluster-node-0      : ok=143  changed=55   unreachable=0    failed=0   
mycluster-node-1      : ok=143  changed=55   unreachable=0    failed=0   
localhost                  : ok=13   changed=0    unreachable=0    failed=0   

INSTALLER STATUS ***************************************************************
Initialization             : Complete (0:00:39)
Health Check               : Complete (0:00:24)
etcd Install               : Complete (0:01:24)
Master Install             : Complete (0:14:59)
Master Additional Install  : Complete (0:01:10)
Node Install               : Complete (0:10:58)
GlusterFS Install          : In Progress (0:03:33)
	This phase can be restarted by running: playbooks/openshift-glusterfs/config.yml

Failure summary:

  1. Hosts:    mycluster-master-0
     Play:     Configure GlusterFS
     Task:     Load heketi topology
     Message:  Failed without returning a message.
```

The most common errors during installation are:

1. Private key has passphrase
2. Key vault secret with private key wasn't created correctly
3. Service principal credentials were entered incorrectly
4. Service principal doesn't have contributor access to the resource group

### Private Key has a passphrase

You'll see an error that permission was denied for ssh. ssh to the ansible playbook host to check for a passphrase on the private key.

### Key vault secret with private key wasn't created correctly

The private key is copied into the ansible playbook host - ~/.ssh/id_rsa. Confirm this file is correct. Test by opening an SSH session to one of the cluster nodes from the ansible playbook host.

### Service principal credentials were entered incorrectly

When providing the input to the template or Marketplace offer, the incorrect information was provided. Make sure you use the correct appId (clientId) and password (clientSecret) for the service principal. Verify by issuing the following azure cli command.

```bash
az login --service-principal -u <client id> -p <client secret> -t <tenant id>
```

### Service principal doesn't have contributor access to the resource group

If the Azure cloud provider is enabled, then the service principal used must have contributor access to the resource group. Verify by issuing the following azure cli command.

```bash
az group update -g <openshift resource group> --set tags.sptest=test
```

## Additional tools

For some errors, you can also use the following commands to get more information:

1. systemctl status \<service>
2. journalctl -xe
