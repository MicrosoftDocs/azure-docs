# Using Avere-CLFSLoad to populate Azure Blob cache storage

CLFSLoad is a Python-based tool that copies data into Azure Blob storage containers
and stores it in Microsoft's Avere Cloud Filesystem (CLFS) format. The proprietary CLFS format is
used by the Azure HPC Cache and Avere vFXT for Azure products.

CLFSLoad runs on a single Linux node. It transfers a single rooted subtree. It
assumes that the source tree does not change during the transfer. The
destination is an Azure Storage container. When the transfer is complete, the
destination container can be used with an Azure HPC Cache instance or Avere vFXT for Azure cluster.

## Requirements

CLFSLoad requires Python version 3.6 or newer. Python 3.7 gives better performance than 3.6.

## Installation

You can install Avere-CLFSLoad on a physical Linux workstation or on a VM. (Read [Running on Azure virtual machines](#running-on-azure-virtual-machines) for additional VM recommendations.)

This example creates a Python virtual environment and installs CLFSLoad:

```bash
python3 -m venv /usr/CLFSLoad < /dev/null
source /usr/CLFSLoad/bin/activate
easy_install -U setuptools < /dev/null
python setup.py install
```

This example creates the directory ``/usr/CLFSLoad`` and installs Avere-CLFSLoad there, but you can use any directory.

## Usage

To execute a new transfer:

```bash
CLFSLoad.py --new local_state_path source_root target_storage_account target_container sas_token
```

* ``local_state_path`` is a directory on the local disk. CLFSLoad uses this path to store
temporary state and log files.

  If a transfer is interrupted (for example because of a system failure or reboot) you can resume the transfer using the contents of ``local_state_path`` by re-executing the command without the ``--new`` option.

* ``source_root`` is the path to the subtree that will be transferred. The path can be on a filesystem local to the node, or it can be remote (for example, an NFS mount).

* ``target_storage_account`` is the name of the Azure storage account to which
``source_root`` will be copied. The account must exist before running CLFSLoad.

* ``target_container`` is the name of the Blob storage container within
``target_storage_account`` to which ``source_root`` will be copied. This container must exist before running CLFSLoad.

  * A new transfer expects the container to be empty.
  * A resumed transfer expects to find the contents it previously wrote.

* ``sas_token`` is the secure access signature for accessing ``target_container``.
For more information, see: [Using shared access signatures (SAS)](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1)

   Your shell will likely require you to quote or otherwise escape the ``sas_token`` value.

### Resuming an interrupted transfer

If a transfer is interrupted, it can be resumed instead of restarted from the beginning. The command to resume a transfer is the same as the command used to start it, but without the ``--new`` argument.

```bash
CLFSLoad.py local_state_path source_root target_storage_account target_container sas_token
```

### Running on Azure virtual machines

The recommended VM size is Standard_F16s_v2.

For best performance, place your local state directory in ``/mnt``.

If you are using a Standard_L series VM, you can use one of the NVME devices as a local filesystem and place your local state directory there. This option gives more capacity but does not typically give better performance than using ``/mnt``.

### Using the populated Blob storage with a vFXT cluster or Azure HPC Cache

Follow the directions in product documentation to define the populated container as a backend storage target for your Azure HPC Cache or Avere vFXT for Azure.

The first time you attach the populated container, it might take a few minutes before its ``/`` export appears and is ready to be added as a junction. This is normal internal configuration overhead and not a cause for alarm.

## Troubleshooting

### fatal error: Python.h: No such file or directory

An error like this indicates that your Python installation is incomplete: 

```fatal error: Python.h: No such file or directory
#include <Python.h>
          ^~~~~~~~~~
compilation terminated.
```

You must install the development package and venv support.

apt example (used with Ubuntu): 

```sudo apt-get update
sudo apt-get --assume-yes install python3-dev
sudo apt-get --assume-yes install python3-venv
```

Consult your Linux distribution's documentation to determine the best way to install Python 3.

## Reporting problems

Report problems to averesupport@microsoft.com.

## Reporting security issues

Security issues and bugs should be reported privately, via email, to the Microsoft Security Response Center (MSRC) at [secure@microsoft.com](mailto:secure@microsoft.com). You should receive a response within 24 hours. If for some reason you do not, please follow up by email to ensure we received your original message. 

Further information, including the [MSRC PGP] (https://technet.microsoft.com/en-us/security/dn606155) key, can be found in the [Security TechCenter](https://technet.microsoft.com/en-us/security/default).

## Microsoft open source code of conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).

For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact[opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
