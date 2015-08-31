<properties
 pageTitle="NAMD with Microsoft HPC Pack on Linux VMs | Microsoft Azure"
 description="Deploy a Microsoft HPC Pack cluster on Azure and run a NAMD simulation with charmrun on multiple Linux compute nodes."
 services="virtual-machines"
 documentationCenter=""
 authors="dlepow"
 manager="timlt"
 editor=""/>
<tags
ms.service="virtual-machines"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-linux"
 ms.workload="big-compute"
 ms.date="08/24/2015"
 ms.author="danlep"/>

# Run NAMD with Microsoft HPC Pack on Linux compute nodes in Azure

This article shows you how to deploy a Microsoft HPC Pack cluster on Azure and run a [NAMD](http://www.ks.uiuc.edu/Research/namd/) job with **charmrun** on multiple Linux compute nodes across the cluster network to calculate and visualize the structure of a large molecular system.

NAMD (for Nanoscale Molecular Dynamics program) is a parallel molecular dynamics package designed for high-performance simulation of large biomolecular systems containing up to millions of atoms, such as viruses, cell structures, and large proteins. Based on Charm++ parallel objects, NAMD scales to hundreds of cores for typical simulations and to more than 500,000 cores for the largest simulations.

Microsoft HPC Pack provides features to run a variety of large-scale HPC and parallel applications, including MPI applications, on clusters of Microsoft Azure virtual machines. Starting in Microsoft HPC Pack 2012 R2, HPC Pack also supports running Linux HPC applications on Linux compute node VMs deployed in an HPC Pack cluster. See [Get started with Linux compute nodes in an HPC Pack cluster in Azure](virtual-machines-linux-cluster-hpcpack.md) for an introduction to using Linux compute nodes with HPC Pack.


## Prerequisites

* **HPC Pack cluster with Linux compute nodes** - See [Get started with Linux compute nodes in an HPC Pack cluster in Azure](virtual-machines-linux-cluster-hpcpack.md) for the prerequisites and steps to deploy an HPC Pack cluster with Linux compute nodes on Azure by using an Azure PowerShell script and HPC Pack images in the Azure Marketplace.

    Following is a sample XML configuration file you can use with the script to deploy the HPC Pack head node and 4 size Large (A3) CentOS 6.6 compute nodes. Substitute appropriate values for your subscription and service names.
    ```
    <?xml version="1.0" encoding="utf-8" ?>
    <IaaSClusterConfig>
      <Subscription>
        <SubscriptionName>Subscription-1</SubscriptionName>
        <StorageAccount>mystorageaccount</StorageAccount>
      </Subscription>
      <Location>West US</Location>  
      <VNet>
        <VNetName>MyVNet</VNetName>
        <SubnetName>Subnet-1</SubnetName>
      </VNet>
      <Domain>
        <DCOption>HeadNodeAsDC</DCOption>
        <DomainFQDN>hpclab.local</DomainFQDN>
      </Domain>
      <Database>
        <DBOption>LocalDB</DBOption>
      </Database>
      <HeadNode>
        <VMName>CentOS66HN</VMName>
        <ServiceName>MyHPCService</ServiceName>
        <VMSize>Large</VMSize>
    <EnableRESTAPI />
    <EnableWebPortal />
  </HeadNode>
  <LinuxComputeNodes>
    <VMNamePattern>CentOS66LN-%00%</VMNamePattern>
    <ServiceName>MyLnxCNService</ServiceName>
    <VMSize>Large</VMSize>
    <NodeCount>4</NodeCount>
    <ImageName>5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-66-20150325</ImageName>
  </LinuxComputeNodes>
</IaaSClusterConfig>
```


* **NAMD software and tutorial files** - Download NAMD software from the [NAMD](http://www.ks.uiuc.edu/Research/namd/) site. This article is based on NAMD version 2.10, and uses the [Linux-x86_64 (64-bit Intel/AMD with Ethernet)](http://www.ks.uiuc.edu/Development/Download/download.cgi?UserID=&AccessCode=&ArchiveID=1310) archive, so you will be able to run NAMD on multiple compute nodes in a cluster network. Also download the [NAMD tutorial files](http://www.ks.uiuc.edu/Training/Tutorials/#namd), which include the samples used later in this article.

* **VMD** (optional) - To see the results of your NAMD job, download the molecular visualization program [VMD](http://www.ks.uiuc.edu/Research/vmd/)  


## Set up mutual trust between compute nodes
To run a cross-node job on multiple Linux nodes, we must make these nodes trust each other (by **rsh** or **ssh**). When you create the HPC Pack cluster, the Microsoft HPC Pack IaaS deployment script automatically sets up permanent mutual trust for the administrator account you specified. For non-administrator users you create in the cluster's domain, you have to set up temporary mutual trust among the nodes when a job is allocated to them, and destroy the relationship after the job is complete. To do this, provide an RSA key pair to the cluster which HPC Pack will use to establish the trust relationship.

### Generate an RSA key pair
It's easy to generate an RSA key pair, which contains a public key and a private key, by running the Linux **ssh-keygen** command.

1.	Log on to a Linux computer.

2.	Run the following command.
    ```
    ssh-keygen -t rsa
    ```

    >[AZURE.NOTE] Press **Enter** to use the default settings until the command is completed. Do not enter a passphrase here; when prompted for a password, just press **Enter**.

    ![Generate an RSA key pair][keygen]

3.	Change directory to the ~/.ssh directory. The private key is stored in id_rsa and the public key in id_rsa.pub.

    ![Private and public keys][keys]

### Add the key pair to the HPC Pack cluster
1.	Log on your head node with your HPC Pack administrator account.

2.	Create a file named C:\cred.xml and write the following contents into it. You can find an example of this file in the Appendix at the end of this article.
    ```
    <ExtendedData>
      <PrivateKey>Copy the contents of private key here</PrivateKey>
      <PublicKey>Copy the contents of public key here</PublicKey>
    </ExtendedData>
    ```
3.	Open a Command window and enter the following command to set the credential data for a domain user account you previously set up in the cluster's Active Directory domain (hpclab\hpcuser in this example). You'll use the **extendeddata** parameter to pass the name of C:\cred.xml XML file you just created for the key data.
    ```
    hpccred setcreds /extendeddata:c:\cred.xml /user:hpclab\hpcuser /password:UserPassword
    ```
4.	This command will end successfully without any output.

5.	If you generated this RSA key pair on one of your Linux nodes, remember to delete them after you have finished using them. HPC Pack won’t set up mutual trust if it finds an existing id_rsa file or id_rsa.pub file.

>[AZURE.IMPORTANT] We don’t recommend running a Linux job as an administrator on a shared cluster, because the job submitted by an administrator will run under the root account on the Linux nodes. A job submitted by a non-administrator user will run under a local Linux user with the same name as the job user, and HPC Pack will set up mutual trust for this Linux user across all the nodes allocated to the job. The Linux user can be created manually on the Linux nodes by following the previous steps, or automatically by HPC Pack when the job is submitted. If the user is created by HPC Pack, HPC Pack will delete it after the job complete.The keys will be removed after job completion on the nodes to reduce security threats.

## Set up a file share for Linux nodes

Now set up a standard SMB share on a folder on the head node, and mount the share folder on all Linux nodes to allow the Linux nodes to access NAMD files with a common path. (In the scenario of this document, we choose to mount a shared folder of Head node because CentOS 6.6 Linux nodes don’t support the Azure File service, which provides similar features. For more about mounting an Azure File share, see [Persisting connections to Microsoft Azure Files](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/27/persisting-connections-to-microsoft-azure-files.aspx).


1.	Create a folder on head node, place the NAMD files in it, and share it to everyone by setting Read/Write privileges. In our example, we extract the NAMD tar archive to \\CentOS66HN\Namd\namd2 and extract the tutorial files under \\CentOS66HN\Namd\namd2\namdsample. Here, CentOS66HN is the host name of our head node.

2.	Open a Windows PowerShell window and run the following commands to mount the shared folder.

    ```
    PS > clusrun /nodegroup:LinuxNodes mkdir -p /namd2

    PS > clusrun /nodegroup:LinuxNodes mount -t cifs //CentOS66HN/Namd/namd2 /namd2 -o vers=2.1`,username=<username>`,password='<password>'`,dir_mode=0777`,file_mode=0777
```

The first command creates a folder named /namd2 on all nodes in the LinuxNodes group. The second command mounts the shared folder //CentOS66HN/Namd/namd2 onto the folder with dir_mode and file_mode bits set to 777. The *username* and *password* in the command should be the credentials of a user on the head node.

>[AZURE.NOTE]The “`” symbol used in the command line is an escape symbol of Windows PowerShell. “`,” means the “,” here is a part of the command.


## Prepare to run a NAMD job

Before we submit our first NAMD job, we need to create a nodelist file for **charmrun** to know how many nodes it can use to start NAMD processes. You'll write a Bash script to generate the nodelist file automatically and run **charmrun** with this nodelist file. Then, you'll be able to submit a NAMD job in HPC Cluster Manager.

### Bash script to create a nodelist file
Information about nodes and cores is in the $CCP_NODES_CORES environment variable, which is set by the HPC Pack head node when the job is activated. The format for the $CCP_NODES_CORES variable is as follows:

```
<Number of nodes> <Name of node1> <Cores of node1> <Name of node2> <Cores of node2>…
```

This lists the total number of nodes, node names, and number of cores on each node that are allocated to the job. For example, if the job needs 10 cores to run, the value of $CCP_NODES_CORES will be similar to:

```
3 CENTOS66LN-00 4 CENTOS66LN-01 4 CENTOS66LN-03 2
```

Following is the information in the nodelist file, which the script will generate:

```
group main
host <Name of node1> ++cpus <Cores of node1>
host <Name of node2> ++cpus <Cores of node2>
…
```

For example:

```
group main
host CENTOS66LN-00 ++cpus 4
host CENTOS66LN-01 ++cpus 4
host CENTOS66LN-03 ++cpus 2
```

Write a Bash script in the folder containing the NAMD program files and name it hpccharmrun.sh. In this bash script, we do the following things. You can find a complete sample of this file in the Appendix of this article.

1.	Define some variables.

    ```
    #!/bin/bash

    # The path of this script
    SCRIPT_PATH="$( dirname "${BASH_SOURCE[0]}" )"
    # Charmrun command
    CHARMRUN=${SCRIPT_PATH}/charmrun
    # Argument of ++nodelist
    NODELIST_OPT="++nodelist"
    # Argument of ++p
    NUMPROCESS="+p"
    ```

2.	Get node information from the environment variables. $NODESCORES stores a list of split words from $CCP_NODES_CORES. $COUNT is the size of $NODESCORES.

    ```
    # Get node information from the environment variables
    # CCP_NODES_CORES=3 CENTOS66LN-00 4 CENTOS66LN-01 4 CENTOS66LN-03 4
    NODESCORES=(${CCP_NODES_CORES})
    COUNT=${#NODESCORES[@]}
    ```

3.	If the $CCP_NODES_CORES variable is not set, just start **charmrun** directly. (This should only occur when you run this script directly on your Linux nodes.)

    ```
    if [ ${COUNT} -eq 0 ]
    then
    	# CCP_NODES is not found or is empty, so just run charmrun without nodelist arg.
    	#echo ${CHARMRUN} $*
    	${CHARMRUN} $*
    ```

4.	Or we create a nodelist file for charmrun.

    ```
    else
    	# Create the nodelist file
    	NODELIST_PATH=${SCRIPT_PATH}/nodelist_$$

    	# Write the head line
    	echo "group main" > ${NODELIST_PATH}

    	# Get every node name and number of cores and write into the nodelist file
    	I=1
    	while [ ${I} -lt ${COUNT} ]
    	do
    		echo "host ${NODESCORES[${I}]} ++cpus ${NODESCORES[$(($I+1))]}" >> ${NODELIST_PATH}
    		let "I=${I}+2"
    	done
```
5.	Run **charmrun** with the nodelist file, get its return status, and remove the nodelist file at the end.

    ${CCP_NUMCPUS} is another environment variable set by the HPC Pack head node, which stores the number of total cores allocated to this job. We use it to specify the number of processes for charmrun.

    ```
	# Run charmrun with nodelist arg
	#echo ${CHARMRUN} ${NUMPROCESS}${CCP_NUMCPUS} ${NODELIST_OPT} ${NODELIST_PATH} $*
	${CHARMRUN} ${NUMPROCESS}${CCP_NUMCPUS} ${NODELIST_OPT} ${NODELIST_PATH} $*

	RTNSTS=$?
	rm -f ${NODELIST_PATH}
    fi

    ```
6.	Exit with the **charmrun** return status.

    ```
    exit ${RTNSTS}
    ```

## Submit a NAMD job

Now we are ready to submit a NAMD job in HPC Cluster Manager.

1.	Log on to your head node and start HPC Cluster Manager.

2.  In **Job Management**, click **New Job**.

3.	Enter a name for job such as *hpccharmrun*.

    ![New HPC job][namd_job]

4.	On the **Job Details** page, under **Job Resources**, select the type of resource as **Node** and set the **Minimum** to 3. In this example we'll run the job on 3 Linux nodes and each node has 4 cores.

    ![Job resources][job_resources]

5.	On the **Task Details** page, add a new task to the job and set the following values in the **Task Details** window.

    * **Command line** -
`/namd2/hpccharmrun.sh ++remote-shell ssh /namd2/namd2 /namd2/namdsample/1-2-sphere/ubq_ws_eq.conf > /namd2/namd2_hpccharmrun.log`

    * **Working directory** - /namd2

    * **Minimum** - 3

    ![Task details][task_details]

    >[AZURE.NOTE] We have to set the working directory here because **charmrun** tries to navigate to the same working directory on each node. If the working directory isn't set, HPC Pack starts the command in a randomly named folder created on one of the Linux nodes. This causes the following error on the other nodes:
`/bin/bash: line 37: cd: /tmp/nodemanager_task_94_0.mFlQSN: No such file or directory.`To avoid this, we specify a folder path which can be accessed by all nodes as the working directory to avoid this error.

5.	Click **Submit** to run this job.

    By default, HPC Pack submits the job as your current logged-on user account. A dialog box prompts you to enter the user name and password when you click **Submit**.

        ![Job credentials][creds]

    Sometimes HPC will remember the user information you have inputted before and won’t show this dialog. To let HPC show it again, enter the following in a Command window.
        ```
        hpccred delcreds
        ```

6.	The job will finish in a few minutes.

7.	Find the job results at \\<headnodeName>\Namd\namd2\namd2_hpccharmrun.log and \\<headnode>\Namd\namd2\namdsample\1-2-sphere\.

    If you are using the Azure File service to share files for Linux nodes, your results are in your Azure File shared folder.

8.	Open VMD to view your job results.

        ![Job results][vmd_view]

## Appendix

### An example of hpccharmrun.sh

```
#!/bin/bash

# The path of this script
SCRIPT_PATH="$( dirname "${BASH_SOURCE[0]}" )"
# Charmrun command
CHARMRUN=${SCRIPT_PATH}/charmrun
# Argument of ++nodelist
NODELIST_OPT="++nodelist"
# Argument of ++p
NUMPROCESS="+p"

# Get node information from ENVs
# CCP_NODES_CORES=3 CENTOS66LN-00 4 CENTOS66LN-01 4 CENTOS66LN-03 4
NODESCORES=(${CCP_NODES_CORES})
COUNT=${#NODESCORES[@]}

if [ ${COUNT} -eq 0 ]
then
	# CCP_NODES is not found or is empty, just run the charmrun without nodelist arg.
	#echo ${CHARMRUN} $*
	${CHARMRUN} $*
else
	# Create the nodelist file
	NODELIST_PATH=${SCRIPT_PATH}/nodelist_$$

	# Write the head line
	echo "group main" > ${NODELIST_PATH}

	# Get every node name & cores and write into the nodelist file
	I=1
	while [ ${I} -lt ${COUNT} ]
	do
		echo "host ${NODESCORES[${I}]} ++cpus ${NODESCORES[$(($I+1))]}" >> ${NODELIST_PATH}
		let "I=${I}+2"
	done

	# Run the charmrun with nodelist arg
	#echo ${CHARMRUN} ${NUMPROCESS}${CCP_NUMCPUS} ${NODELIST_OPT} ${NODELIST_PATH} $*
	${CHARMRUN} ${NUMPROCESS}${CCP_NUMCPUS} ${NODELIST_OPT} ${NODELIST_PATH} $*

	RTNSTS=$?
	rm -f ${NODELIST_PATH}
fi

exit ${RTNSTS}
```

 
###An example of cred.xml

```
<ExtendedData>
  <PrivateKey>-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAxJKBABhnOsE9eneGHvsjdoXKooHUxpTHI1JVunAJkVmFy8JC
qFt1pV98QCtKEHTC6kQ7tj1UT2N6nx1EY9BBHpZacnXmknpKdX4Nu0cNlSphLpru
lscKPR3XVzkTwEF00OMiNJVknq8qXJF1T3lYx3rW5EnItn6C3nQm3gQPXP0ckYCF
Jdtu/6SSgzV9kaapctLGPNp1Vjf9KeDQMrJXsQNHxnQcfiICp21NiUCiXosDqJrR
AfzePdl0XwsNngouy8t0fPlNSngZvsx+kPGh/AKakKIYS0cO9W3FmdYNW8Xehzkc
VzrtJhU8x21hXGfSC7V0ZeD7dMeTL3tQCVxCmwIDAQABAoIBAQCve8Jh3Wc6koxZ
qh43xicwhdwSGyliZisoozYZDC/ebDb/Ydq0BYIPMiDwADVMX5AqJuPPmwyLGtm6
9hu5p46aycrQ5+QA299g6DlF+PZtNbowKuvX+rRvPxagrTmupkCswjglDUEYUHPW
05wQaNoSqtzwS9Y85M/b24FfLeyxK0n8zjKFErJaHdhVxI6cxw7RdVlSmM9UHmah
wTkW8HkblbOArilAHi6SlRTNZG4gTGeDzPb7fYZo3hzJyLbcaNfJscUuqnAJ+6pT
iY6NNp1E8PQgjvHe21yv3DRoVRM4egqQvNZgUbYAMUgr30T1UoxnUXwk2vqJMfg2
Nzw0ESGRAoGBAPkfXjjGfc4HryqPkdx0kjXs0bXC3js2g4IXItK9YUFeZzf+476y
OTMQg/8DUbqd5rLv7PITIAqpGs39pkfnyohPjOe2zZzeoyaXurYIPV98hhH880uH
ZUhOxJYnlqHGxGT7p2PmmnAlmY4TSJrp12VnuiQVVVsXWOGPqHx4S4f9AoGBAMn/
vuea7hsCgwIE25MJJ55FYCJodLkioQy6aGP4NgB89Azzg527WsQ6H5xhgVMKHWyu
Q1snp+q8LyzD0i1veEvWb8EYifsMyTIPXOUTwZgzaTTCeJNHdc4gw1U22vd7OBYy
nZCU7Tn8Pe6eIMNztnVduiv+2QHuiNPgN7M73/x3AoGBAOL0IcmFgy0EsR8MBq0Z
ge4gnniBXCYDptEINNBaeVStJUnNKzwab6PGwwm6w2VI3thbXbi3lbRAlMve7fKK
B2ghWNPsJOtppKbPCek2Hnt0HUwb7qX7Zlj2cX/99uvRAjChVsDbYA0VJAxcIwQG
TxXx5pFi4g0HexCa6LrkeKMdAoGAcvRIACX7OwPC6nM5QgQDt95jRzGKu5EpdcTf
g4TNtplliblLPYhRrzokoyoaHteyxxak3ktDFCLj9eW6xoCZRQ9Tqd/9JhGwrfxw
MS19DtCzHoNNewM/135tqyD8m7pTwM4tPQqDtmwGErWKj7BaNZCRUlhFxwOoemsv
R6DbZyECgYEAhjL2N3Pc+WW+8x2bbIBN3rJcMjBBIivB62AwgYZnA2D5wk5o0DKD
eesGSKS5l22ZMXJNShgzPKmv3HpH22CSVpO0sNZ6R+iG8a3oq4QkU61MT1CfGoMI
a8lxTKnZCsRXU1HexqZs+DSc+30tz50bNqLdido/l5B4EJnQP03ciO0=
-----END RSA PRIVATE KEY-----</PrivateKey>
  <PublicKey>ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDEkoEAGGc6wT16d4Ye+yN2hcqigdTGlMcjUlW6cAmRWYXLwkKoW3WlX3xAK0oQdMLqRDu2PVRPY3qfHURj0EEellpydeaSekp1fg27Rw2VKmEumu6Wxwo9HddXORPAQXTQ4yI0lWSerypckXVPeVjHetbkSci2foLedCbeBA9c/RyRgIUl227/pJKDNX2Rpqly0sY82nVWN/0p4NAyslexA0fGdBx+IgKnbU2JQKJeiwOomtEB/N492XRfCw2eCi7Ly3R8+U1KeBm+zH6Q8aH8ApqQohhLRw71bcWZ1g1bxd6HORxXOu0mFTzHbWFcZ9ILtXRl4Pt0x5Mve1AJXEKb hpclabsa@longhaulLN5-033&#10;</PublicKey>
</ExtendedData>
```

## Next steps

*  



<!--Image references-->
[keygen]: ./media/virtual-machines-linux-cluster-hpcpack-namd/keygen.png
[keys]: ./media/virtual-machines-linux-cluster-hpcpack-namd/keys.png
[namd_job]: ./media/virtual-machines-linux-cluster-hpcpack-namd/namd_job.png
[job_resources]: ./media/virtual-machines-linux-cluster-hpcpack-namd/job_resources.png
[creds]: ./media/virtual-machines-linux-cluster-hpcpack-namd/creds.png
[task_details]: ./media/virtual-machines-linux-cluster-hpcpack-namd/task_details.png
[vmd_view]: ./media/virtual-machines-linux-cluster-hpcpack-namd/vmd_view.png
