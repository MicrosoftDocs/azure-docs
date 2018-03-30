# Quorum Demo in Azure Marketplace

Cale Teeter | Senior SDE DX / TED

## Overview

As part of the ongoing support for blockchain on Microsoft Azure an offering has been created to
demonstrate the use of Quorum via a full 7 node network on a single VM. This has been introduced to
the Azure Marketplace, in a way to make it easier for users to deploy the environment via a single click.

After reading this article, you will

- Understand why Quorum is relevant to blockchain projects that require heightened permissions
    on the transactions (enhanced privacy of transactions)
- Learn how to deploy a full network in a simple, single virtual machine via a single click
    deployment in Azure.

More details, at a lower level, can be found on the public github repo for Quorum.
https://github.com/jpmorganchase/quorum/wiki

## Architecture

At the core, Quorum is an Ethereum based blockchain, that adds 2 fundamental features to the existing
service, privacy of transactions/contracts and a new consensus mechanism. These are implemented in
through:

- QuorumChain -- a consensus model based on majority voting algorithm
- Constellation -- a peer based encrypted messaging exchange
- Peer Security -- node and peer permissioning using smart contracts

![](./picture/QDAM1.jpg)

For the demonstration of 7 nodes, the architecture will include a series of transaction nodes (also
referred to as observers), a single blockmaker and 3 voters.

![](./picture/QDAM2.jpg)

From a high level, transactions will flow in via the DAPP to the nodes running Ethereum (tx nodes). They
will be passed to the blockmaker, who will generate the block and then voters will confirm the
transaction.

This system has 2 types of possible transactions. Public transactions, which are transactions where the
payload is visible to all participants. These are standard Ethereum transactions. Private transactions,
which are transactions where the payload is only visible to participants whose public keys are specified
in the privateFor parameter of the transaction. This is an extension of the Ethereum protocol.

Lower level details on the transaction processing can be found on the public wiki found here:
https://github.com/jpmorganchase/quorum/wiki/Transaction-Processing

As mentioned, the consensus model for Quorum is also unique. Pluggable consensus is the ultimate
goal, however currently the model is a time-based majority voting algorithm. From a high level a smart
contract is created in the genesis block (at blockchain creation time) for voting. This governs the voting
model.

Details about the consensus flow scenarios can be found on the public wiki found here:
https://github.com/jpmorganchase/quorum/wiki/Consensus

## Getting Started

To begin, you will need an Azure subscription that will be used to deploy the virtual machine. If you do
not have an Azure subscription, you can create a free Azure account to begin. Because this deployment
will only require a single virtual machine, there is no need to increase quotas for your subscription.

Once you have a subscription, go to the Azure portal. Select the \'+\' symbol in the top left of the portal,
and in the pane that appears, in the search box, enter \'Quorum Demo\'.

![](./picture/QDAM3.jpg)

Select the template that is returned in the search results to take you to the single vm deployment wizard
and then click \'Create\'. This will open the \'Basics\' blade in the wizard.

![](./picture/QDAM4.jpg)

The template deployment will prompt you for a set of simple inputs to configure the deployment
properly. On the first step, the \'Basics\' blade, specify the values for standard parameters such as
subscription, resource group, and basic virtual machine properties.

A detailed description of each parameter follows:

### Basics

Parameter Name| Description| Allowed Values| Default Value
---|---|---|---
**Name**| A string used denote the name of the virtual machine.|The value must be between 1 and 64 characters in length.|NA
**VM disk type**| The type of storage backing the virtual machine. To learn more about storage, visit [Introduction to Microsoft Azure Storage](https://docs.microsoft.com/en-us/azure/storage/common/storage-introduction) and [Premium Storage](https://docs.microsoft.com/en-us/azure/storage/common/storage-introduction).|SSD or HDD| SSD
**User name**| The username of the administrator for the deployed virtual machine.|The value must be between 1 and 64 characters in length.|NA
**Authentication Type**| The method used to authenticate to the virtual machine. Username and password or username/ssh key.|Password or SSH public key| SSH public key
**Subscription**| The subscription in which to deploy.|Valid subscription| Current subscription
**Resource Group**| The resource group in which to deploy.|Create new or use existing. For new, the value must be 1 and 90 characters in length.|NA
**Location** |The Azure region in which to deploy.|List of valid Azure regions. |Current region.

A sample deployment is shown below:

![](./picture/QDAM5.jpg)


### Size


Parameter Name| Description| Allowed Values| Default Value
---|---|---|---
**Virtual Machine Size**| Choose the appropriate size of virtual machine.|NA |Recommended sizes are displayed.

![](./picture/QDAM6.jpg)

### Settings


Parameter Name| Description| Allowed Values| Default Value
---|---|---|---
**Use managed disk**| Removes the need to manage underlying storage account for the virtual machine. [More info](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/managed-disks-overview)|No or Yes| No
**Storage Account**| The underlying storage account for non-managed disk type virtual machines.|New or existing storage accounts|New storage account with default unique name
**Virtual Network** |Virtual network that the virtual machine will be provisioned into. [More info](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview)|New or existing virtual network.|New virtual network with default unique name.
**Subnet**| A range of ip addresses in a virtual network.|New or existing subnet. |New subnet with default unique name.
**Public IP Address**| An ip address that allows the virtual machine to be accessed from the public internet.|New or existing public ip address.|New public ip with default unique name.
**Network Security Group**| A list of ACL rules that allow or deny traffic to a VM instance in a virtual network. [More info](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-nsg).|New or existing network security group.|New network security group with default unique name.
**Extensions**| Applications that provide post-deployment configuration and automation tasks for virtual machines. [More info](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/extensions-features)|Selection from existing extensions offered in the Azure portal.|No extensions.
**High Availability**| Allows the use of availability sets which enable logical grouping of virtual machines to ensure Azure fabric will distribute to avoid single points of failure at hardware level. [More info](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/infrastructure-example)|Either none or existing/new availability sets.|None
**Boot Diagnostics**| Capture serial console output and screenshots of the virtual machine running on a host to help diagnose startup issues.|Disabled or Enabled |Enabled
**Guest OS Diagnostics**| Capture metrics every minute for your virtual machine. This is telemetry from the infrastructure. [More info](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview)|Disabled or Enabled |Disabled
**Diagnostic Storage Account**|Underlying storage account that is used to hold the output of diagnostics from the virtual machine.|New or existing storage account.|New storage account with a default unique name.

A sample of this blade is below:

![](./picture/QDAM7.jpg)


Click through the summary blade, which displays the inputs that have been provided for the deployment
of the virtual machine. This also validates the subscription and the inputs to ensure the deployment
values will not cause an exception in provisioning.

![](./picture/QDAM8.jpg)

Finally, review the legal and privacy terms and click \'Purchase\' to deploy. This typically takes a few
minutes to complete.

## Post Deployment of 7 nodes Quorum demo

After the deployment of the virtual machine for Quorum demo, the virtual machine will contain all the
necessary software to run Quorum, including Ethereum and Constellation. This machine could be used
to create new applications using Quorum. A demo has been created that will showcase setting up 7
nodes on a single virtual machine, to make it easy to understand how this blockchain software functions.

To set up this demo, a few post deployment steps will be required.

### Login to the virtual machine via SSH

A few commands will be required to start the demo. In order to do this we need to login to the virtual
machine. There are a few SSH clients available, and shown here is Putty, which is open source and can
be downloaded from this site: [http://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html](http://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)


Once this is downloaded, it is a simple executable that can be used to login to the virtual machine with
the credentials created in the deployment steps. You will need to retrieve the public ip address that is
listening for the login (port 22/ssh). You can find this the portal by clicking on your virtual machine and
copying the value named public ip address to your clipboard.

![](./picture/QDAM9.jpg)

Then open putting and paste in the public ip address from above.

![](./picture/QDAM10.jpg)

Click \'Open\' and then enter you credentials (username/password) or if you chose public key instead of
password, you will need to have the private key associated with this public key. These are the
credentials that you specified while deploying the virtual machine.

![](./picture/QDAM11.jpg)

### Run the commands to setup the 7 nodes demo

After login to the virtual machine, a series of commands will be required to run to configure the virtual
machine with the demo of 7 individual nodes, configure Ethereum, configure constellation, and start the
cluster.

The first command to run will grab the 7 nodes demo environment, including the keys and configuration
files from a shared github repository. The following command will download this to your demo
instance.

**qrmadmin@armdemo:$ git clone** https://github.com/jpmorganchase/quorum-examples.git

This will take just a few moments to retrieve.

![](./picture/QDAM12.jpg)

After running this command, it will be required to move to the newly created directory, in order to use
the demo. This is a very simple command

**qrmadmin@armdemo:$ cd quorum-examples/examples/7nodes**

![](./picture/QDAM13.jpg)

Next we will need to run the remaining commands under elevated rights, specifically because various
directories will be created inside the contained script. This is again a very simple command

**qrmadmin@armdemo:$ sudo su**

![](./picture/QDAM14.jpg)

And finally we will initialize and start the 7 node cluster. The first command will initialize the nodes
with a common genesis block. NOTE: This genesis block is for demo purposes only, and in anything
beyond running this demo, a genesis block can be generated using a utility such as the one found here
https://github.com/davebryson/quorum-genesis

**qrmadmin@armdemo:$. init.sh**

![](./picture/QDAM15.jpg)

Lastly, we will now use the newly configured nodes to start the cluster and run the first transaction on
the network by uploading a smart contract and transferring value to node 7 in the network.

**qrmadmin@armdemo:$. start.sh**

![](./picture/QDAM16.jpg)

All should be successful at this point, along with a contract transactions, and result (true).
Congratulations, you have a multi-node Quorum blockchain running, validated with a transactions
demonstrating the privacy of the transaction.


